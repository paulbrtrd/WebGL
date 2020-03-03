Weapons = function(Player) {
    // On permet d'accéder à Player n'importe où dans Weapons
    this.Player = Player;

    // Import de l'armurerie depuis Game
    this.Armory = Player.game.armory;

    // Positions selon l'arme non utilisée
    this.bottomPosition = new BABYLON.Vector3(0.5, -2.5, 1);

    // Changement de Y quand l'arme est séléctionnée
    this.topPositionY = -0.5;

    // Ajout de l'inventaire
    this.inventory = [];

    // Créons notre lance-roquettes
    var ezekiel = this.newWeapon('Ezekiel')
    this.inventory[0] = ezekiel;

    // Laser
    var armageddon = this.newWeapon('Armageddon')
    this.inventory[1] = armageddon;

    // Notre arme actuelle est Ezekiel, qui se trouve en deuxième position
    // dans le tableau des armes dans Armory
    this.actualWeapon = this.inventory.length - 1;

    // On dit que notre arme en main est l'arme active
    this.inventory[this.actualWeapon].isActive = true;

    // On dit que la cadence est celle de l'arme actuelle (grâce à typeWeapon)
    this.fireRate = this.Armory.weapons[this.inventory[this.actualWeapon].typeWeapon].setup.cadency;

    this._deltaFireRate = this.fireRate;

    this.canFire = true;

    this.launchBullets = false;

    // _this va nous permettre d'acceder à l'objet depuis des fonctions que nous utiliserons plus tard
    var _this = this;

    // Engine va nous être utile pour la cadence de tir
    var engine = Player.game.scene.getEngine();

    // Mise à jour de canFire et deltaFireRate
    Player.game.scene.registerBeforeRender(function() {
        if (!_this.canFire) {
            _this._deltaFireRate -= engine.getDeltaTime();
            if (_this._deltaFireRate <= 0 && _this.Player.isAlive) {
                _this.canFire = true;
                _this._deltaFireRate = _this.fireRate;
            }
        }
    });

};

Weapons.prototype = {
    newWeapon: function(typeWeapon) {
        var newWeapon;
        for (var i = 0; i < this.Armory.weapons.length; i++) {
            if (this.Armory.weapons[i].name === typeWeapon) {

                newWeapon = BABYLON.Mesh.CreateBox('rocketLauncher', 0.5, this.Player.game.scene);

                // Nous faisons en sorte d'avoir une arme d'apparence plus longue que large
                newWeapon.scaling = new BABYLON.Vector3(1, 0.7, 2);

                // On l'associe à la caméra pour qu'il bouge de la même facon
                newWeapon.parent = this.Player.camera;

                // On positionne le mesh APRES l'avoir attaché à la caméra
                newWeapon.position = this.bottomPosition.clone();

                newWeapon.isPickable = false;

                // Ajoutons un material de l'arme pour le rendre plus visible
                var materialWeapon = new BABYLON.StandardMaterial('rocketLauncherMat', this.Player.game.scene);
                materialWeapon.diffuseColor = this.Armory.weapons[i].setup.colorMesh;

                newWeapon.material = materialWeapon;

                newWeapon.typeWeapon = i;

                newWeapon.isActive = false;
                break;

            } else if (i === this.Armory.weapons.length - 1) {
                console.log('UNKNOWN WEAPON');
            }
        };

        return newWeapon;
    },

    fire: function(pickInfo) {
        this.launchBullets = true;
    },

    stopFire: function(pickInfo) {
        this.launchBullets = false;
    },

    launchFire: function() {
        if (this.canFire) {

            var idWeapon = this.inventory[this.actualWeapon].typeWeapon;
            var weaponAmmos = this.inventory[this.actualWeapon].ammos;
            var renderWidth = this.Player.game.engine.getRenderWidth(true);
            var renderHeight = this.Player.game.engine.getRenderHeight(true);
            var direction = this.Player.game.scene.pick(renderWidth / 2, renderHeight / 2, function(item) {
                if (item.name == "playerBox" || item.name == "weapon" || item.id == "hitBoxPlayer")
                    return false;
                else
                    return true;
            });
            // Si l'arme est une arme de distance
            if (this.Armory.weapons[idWeapon].type === 'ranged') {
                if (this.Armory.weapons[idWeapon].setup.ammos.type === 'rocket') {
                    // Nous devons tirer une roquette
                    direction = direction.pickedPoint.subtractInPlace(this.Player.camera.playerBox.position);
                    direction = direction.normalize();

                    this.createRocket(this.Player.camera.playerBox, direction);

                } else if (this.Armory.weapons[idWeapon].setup.ammos.type === 'bullet') {
                    // Nous devons tirer des balles simples
                    this.shootBullet(direction);
                } else {
                    // Nous devons tirer au laser
                    this.createLaser(direction);
                }
            } else {
                this.hitHand(direction);
                // Si ce n'est pas une arme à distance, il faut attaquer au corps-à-corps
            }
            this.canFire = false;
        } else {
            // Nothing to do : cannot fire
        }
    },
    createRocket: function(playerPosition, direction) {

        // Permet de connaitre l'id de l'arme dans Armory.js
        var idWeapon = this.inventory[this.actualWeapon].typeWeapon;

        // Les paramètres de l'arme
        var setupRocket = this.Armory.weapons[idWeapon].setup.ammos;

        var positionValue = this.inventory[this.actualWeapon].absolutePosition.clone();
        var rotationValue = playerPosition.rotation;
        var Player = this.Player;
        var newRocket = BABYLON.Mesh.CreateBox("rocket", 1, Player.game.scene);

        newRocket.direction = direction;
        newRocket.position = new BABYLON.Vector3(
            positionValue.x + (newRocket.direction.x * 1),
            positionValue.y + (newRocket.direction.y * 1),
            positionValue.z + (newRocket.direction.z * 1));
        newRocket.rotation = new BABYLON.Vector3(rotationValue.x, rotationValue.y, rotationValue.z);
        newRocket.scaling = new BABYLON.Vector3(0.5, 0.5, 1);
        newRocket.isPickable = false;

        newRocket.material = new BABYLON.StandardMaterial("textureWeapon", this.Player.game.scene);
        newRocket.material.diffuseColor = this.Armory.weapons[idWeapon].setup.colorMesh;
        newRocket.paramsRocket = this.Armory.weapons[idWeapon].setup;

        this.Player.game._rockets.push(newRocket);

    },

    shootBullet: function(meshFound) {
        // Permet de connaitre l'id de l'arme dans Armory.js
        var idWeapon = this.inventory[this.actualWeapon].typeWeapon;

        var setupWeapon = this.Armory.weapons[idWeapon].setup;

        if (meshFound.hit && meshFound.pickedMesh.isPlayer) {
            // On a touché un joueur
        } else {
            // L'arme ne touche pas de joueur
            console.log('Not Hit Bullet')
        }
    },

    hitHand: function(meshFound) {
        // Permet de connaitre l'id de l'arme dans Armory.js
        var idWeapon = this.inventory[this.actualWeapon].typeWeapon;

        var setupWeapon = this.Armory.weapons[idWeapon].setup;

        if (meshFound.hit &&
            meshFound.distance < setupWeapon.range * 5 &&
            meshFound.pickedMesh.isPlayer) {
            // On a touché un joueur
        } else {
            // L'arme frappe dans le vide
            console.log('Not Hit CaC')
        }
    },

    createLaser: function(meshFound) {
        // Permet de connaitre l'id de l'arme dans Armory.js
        var idWeapon = this.inventory[this.actualWeapon].typeWeapon;

        var setupLaser = this.Armory.weapons[idWeapon].setup.ammos;

        var positionValue = this.inventory[this.actualWeapon].absolutePosition.clone();

        if (meshFound.hit) {

            var laserPosition = positionValue;
            // On crée une ligne tracée entre le pickedPoint et le canon de l'arme
            let line = BABYLON.Mesh.CreateLines("lines", [
                laserPosition,
                meshFound.pickedPoint
            ], this.Player.game.scene);
            // On donne une couleur aléatoire
            var colorLine = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
            line.color = colorLine;

            // On élargit le trait pour le rendre visible
            line.enableEdgesRendering();
            line.isPickable = false;
            line.edgesWidth = 40.0;
            line.edgesColor = new BABYLON.Color4(colorLine.r, colorLine.g, colorLine.b, 1);
            if (meshFound.pickedMesh.isPlayer) {
                // On inflige des dégâts au joueur
            }
            this.Player.game._lasers.push(line);
        }
    },

    nextWeapon: function(way) {
        var armoryWeapons = this.Armory.weapons;
        var nextWeapon = this.inventory[this.actualWeapon].typeWeapon + way;
        var nextPossibleWeapon = null;

        if (way > 0) {
            // On cherche la prochaine arme disponible qui est dans l'inventaire du joueur:
            // On parcours toutes les armes de l'armoirie de manière croissante (avec retour à 0 si au max)
            for (var i = nextWeapon; i < nextWeapon + this.Armory.weapons.length; i++) {
                var numberWeapon = i % this.Armory.weapons.length; // Pour rester entre 0 et this.Armory.weapons.length
                // La première arme qui est dans l'armoirie ET l'inventaire est sélectionnée
                for (var y = 0; y < this.inventory.length; y++) {
                    if (this.inventory[y].typeWeapon === numberWeapon) {
                        nextPossibleWeapon = y;
                        break;
                    }
                }
                if (nextPossibleWeapon != null) {
                    break;
                }
            }
        } else {
            // On parcours toutes les armes de l'armoirie de manière décroissante (avec retour à max si au début)
            for (var i = nextWeapon;; i--) {
                if (i < 0) {
                    i = this.Armory.weapons.length;
                }
                var numberWeapon = i;
                for (var y = 0; y < this.inventory.length; y++) {
                    if (this.inventory[y].typeWeapon === numberWeapon) {
                        nextPossibleWeapon = y;
                        break;
                    }
                }
                if (nextPossibleWeapon != null) {
                    break;
                }
            }
        }

        if (this.actualWeapon != nextPossibleWeapon) {
            // On dit à notre arme actuelle qu'elle n'est plus active
            this.inventory[this.actualWeapon].isActive = false;
            // On change l'arme actuelle avec celle qu'on a trouvé
            this.actualWeapon = nextPossibleWeapon;
            // On dit à notre arme choisie qu'elle est l'arme active
            this.inventory[this.actualWeapon].isActive = true;

            // On actualise la cadence de l'arme
            this.fireRate = this.Armory.weapons[this.inventory[this.actualWeapon].typeWeapon].setup.cadency;
            this._deltaFireRate = this.fireRate;
        }
    },
};