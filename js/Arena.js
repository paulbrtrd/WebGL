Arena = function(game) {
    // Appel des variables nécéssaires
    this.game = game;
    var scene = game.scene;

    // Création de notre lumière principale
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 20, 0), scene);
    light.diffuse = new BABYLON.Color3(1, 1, 1);
    light.specular = new BABYLON.Color3(1, 1, 1);

    // Lumière directionnelle (ne fonctionne pas)
    // var light1 = new BABYLON.DirectionalLight("Dir1", new BABYLON.Vector3(0, 1, 0), scene);
    // light1.diffuse = new BABYLON.Color3(1, 1, 1);
    // light1.specular = new BABYLON.Color3(1, 1, 1);

    // Lumière ponctuelle
    // var light1 = new BABYLON.PointLight("Omni1", new BABYLON.Vector3(1, 10, 1), scene);
    // light1.diffuse = new BABYLON.Color3(1, 1, 1);
    // light1.specular = new BABYLON.Color3(1, 1, 1);

    // Spot
    var light1 = new BABYLON.SpotLight("Spot1", new BABYLON.Vector3(0, 30, -10), new BABYLON.Vector3(0, -1, 0), 0.8, 2, scene);
    light1.diffuse = new BABYLON.Color3(1, 1, 1);
    light1.specular = new BABYLON.Color3(1, 1, 1);

    // Ajout d'un matériau: les murs
    var materialWall = new BABYLON.StandardMaterial("wallTexture", scene);
    materialWall.diffuseTexture = new BABYLON.Texture("assets/images/wood.jpg", scene);


    // Ajout d'un matériau: le sol
    var materialGround = new BABYLON.StandardMaterial("groundTexture", scene);
    materialGround.diffuseTexture = new BABYLON.Texture("assets/images/brick.jpg", scene);
    materialGround.diffuseTexture.uScale = 4.0;
    materialGround.diffuseTexture.vScale = 4.0;

    // Le sol
    var ground = BABYLON.Mesh.CreateGround("ground1", 20, 20, 2, scene);
    ground.scaling = new BABYLON.Vector3(2, 10, 3);
    ground.material = materialGround;

    // Les 4 cubes
    var mainBox = BABYLON.Mesh.CreateBox("box1", 3, scene);
    mainBox.scaling.y = 1;
    mainBox.position = new BABYLON.Vector3(5, (3 / 2) * mainBox.scaling.y, 5);
    mainBox.rotation.y = Math.PI * 45 / 180;
    mainBox.material = materialWall;
    var mainBox2 = mainBox.clone("box2");
    mainBox2.scaling.y = 2;
    mainBox2.position = new BABYLON.Vector3(5, (3 / 2) * mainBox2.scaling.y, -5);
    var mainBox3 = mainBox.clone("box3");
    mainBox3.scaling.y = 3;
    mainBox3.position = new BABYLON.Vector3(-5, (3 / 2) * mainBox3.scaling.y, -5);
    var mainBox4 = mainBox.clone("box4");
    mainBox4.scaling.y = 4;
    mainBox4.position = new BABYLON.Vector3(-5, (3 / 2) * mainBox4.scaling.y, 5);

    // Le cylindre
    var cylinder = BABYLON.Mesh.CreateCylinder("cyl1", 20, 5, 5, 20, 4, scene);
    cylinder.position.y = 20 / 2
    cylinder.material = materialWall;


};