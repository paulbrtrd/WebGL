Player = function(game, canvas) {
    // La scène du jeu
    this.scene = game.scene;

    // Initialisation de la caméra
    this._initCamera(this.scene, canvas);

};

Player.prototype = {
    _initCamera: function(scene, canvas) {
        // On crée une caméra freecamera
        // var freecam = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 5, -10), scene);

        // // On demande à la caméra de regarder au point zéro de la scène
        // freecam.setTarget(BABYLON.Vector3.Zero());

        // // On affecte le mouvement de la caméra au canvas
        // freecam.attachControl(canvas, true);

        // Caméra Arcrotate
        var arcRcamera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 10, new BABYLON.Vector3(0, 0, 0), scene);
        arcRcamera.setTarget(BABYLON.Vector3.Zero());
        arcRcamera.attachControl(canvas, true);

        this.camera = arcRcamera;
    }
};