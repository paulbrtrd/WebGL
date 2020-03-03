Arena = function(game) {
    // Appel des variables nécéssaires
    this.game = game;
    var scene = game.scene;

    BABYLON.SceneLoader.ImportMesh("", "assets/", "test.babylon", scene, function(newMeshes) {

        // Explore tous les meshes disponibles et récupère le mesh nommé 'nameMesh'
        for (var y = 0; y < newMeshes.length; y++) {
            if (newMeshes[i].name === 'Cube') {

                var searchMesh = newMeshes[i];
                break;
            }
        };
        // Convertit le mesh récupéré pour qu'il soit rendu en FlatShading
        searchMesh.convertToFlatShadedMesh();

        // On rend invisible notre mesh qui servira de prototype
        searchMesh.isVisible = true;

        // On rend le prototype accessible n'importe où
        scene.searchMeshPrototype = searchMesh;

    });

    //searchMesh.position = new BABYLON.Vector3(0, 0, 0);
    // Création de notre lumière principale
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // Créons une sphère 
    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);

    // Remontons le sur l'axe y de la moitié de sa hauteur
    sphere.position.y = 1;

    // Ajoutons un sol pour situer la sphere dans l'espace
    var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);
};