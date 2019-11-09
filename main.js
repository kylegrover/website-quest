window.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById('websitequest');
    var engine = new BABYLON.Engine(canvas, true);

    var createScene = function () {
        // basic scene
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3.Black();

        var helper = scene.createDefaultEnvironment({
            skyboxSize: 250
        });
        helper.setMainColor(BABYLON.Color3.Black());

        // physics, longhand
        // var gravityVector = new BABYLON.Vector3(0,-6.81, 0);
        // var physicsPlugin = new BABYLON.CannonJSPlugin();
        // scene.enablePhysics(gravityVector, physicsPlugin);
        // physics, shorthand
        scene.enablePhysics();

        // glow
        var gl = new BABYLON.GlowLayer("glow", scene);
        gl.intensity = 0.5;

        //Ground
        var ground = BABYLON.MeshBuilder.CreatePlane("ground", {width: 30, sizee: 30, tileSize: 30}, scene);
        ground.material = new BABYLON.StandardMaterial("groundMat", scene);
        ground.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
        ground.material.backFaceCulling = false;
        ground.position = new BABYLON.Vector3(0, 0.1, 0);
        ground.rotation = new BABYLON.Vector3(Math.PI / 2, Math.PI / 4, 0);

        // camera/player STUFF
        // create camera
        var camera = new BABYLON.UniversalCamera('view',
            new BABYLON.Vector3(-10, 2.1, 10), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        // add wasd controls 
        camera.attachControl(canvas, true);
        camera.keysUp.push(87);
        camera.keysDown.push(83);
        camera.keysLeft.push(65);
        camera.keysRight.push(68);
        // player physics
        camera.applyGravity = true;
        camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
        camera.speed = 0.5;


        // basic lighting
        var light1 = new BABYLON.PointLight('point1', new BABYLON.Vector3(6, 10, -8), scene);

        // a good website
        var agoodwebsite = BABYLON.SceneLoader.Append("./", "a good website.obj", scene, function (scene) {
            // do something with the scene
        });

        // Over/Out
        var master_channel = new Tone.Channel().toMaster();
        var vol = new Tone.Volume(-24)
        var heavensounds = new Tone.Sampler({
            "C3" : "audio/110036__timbre__organ-ic-2.wav"
        }, function(){
            heavensounds.triggerAttackRelease(43, 20);     
            setInterval(() => {
                heavensounds.triggerAttackRelease(43, 20); 
                setTimeout(() => {
                    heavensounds.triggerAttackRelease(43, 20);     
                }, 10000);                 
            }, 20000);  
        });
        
        heavensounds.chain(vol, master_channel);


        

        // Enable Collisions
        // scene.collisionsEnabled = true;
        camera.checkCollisions = true;
        // check collisions
        ground.checkCollisions = true;
        // box.checkCollisions = true;


        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: 0,
            restitution: 0.9
        }, scene);
        // camera.physicsImpostor = new BABYLON.PhysicsImpostor(camera, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);


        // Create default pipeline and enable dof with Medium blur level
        var pipeline = new BABYLON.DefaultRenderingPipeline("default", true, scene, [scene.activeCamera]);
        pipeline.depthOfFieldBlurLevel = BABYLON.DepthOfFieldEffectBlurLevel.Medium;
        pipeline.depthOfFieldEnabled = true;
        pipeline.depthOfField.focalLength = 50;
        pipeline.depthOfField.fStop = 10;
        pipeline.depthOfField.focusDistance = 2250;


        scene.registerBeforeRender(function () {
            engine.resize()
        })


        // start the scene!
        return scene;
    }

    var scene = createScene();

    engine.runRenderLoop(function () {
        // render changes
        scene.render();
    })

});