window.addEventListener("DOMContentLoaded", function () {



    // Wrap every letter in a span
    var specialword = document.getElementsByClassName('special-words')[0];
    // this.html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span style='position: relative; display: inline-block;' class='animated-letters'>$&</span>"));
    specialword.innerHTML = specialword.innerHTML.replace(/([^\x00-\x80]|\w)/g, "<span style='position: relative; display: inline-block;' class='animated-letters'>$&</span>");
    anime.timeline({loop: true})
    .add({
        targets: specialword.children,
        translateY: ['-1px', '1px','-1px','0'],
        translateZ: 0,
        duration: 600,
        easing: 'linear',
        delay: function(el, i) {
        return 30 * i;
        }
    })


    var redirected = false;
    var ifell = false;
    var canvas = document.getElementById('websitequest');
    var engine = new BABYLON.Engine(canvas, true);

    var createScene = function () {
        // basic scene
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3.Black();

        // var helper = scene.createDefaultEnvironment({
        //     skybox: false,
        // });
        // helper.setMainColor(BABYLON.Color3.Black());

        var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size: 4000.0, width:4000.0}, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/404dethh", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;

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
        var ground = BABYLON.MeshBuilder.CreatePlane("ground", {width: 60, size: 2, tileSize: 30}, scene);
        ground.material = new BABYLON.StandardMaterial("groundMat", scene);
        ground.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
        ground.material.backFaceCulling = false;
        ground.position = new BABYLON.Vector3(10, 0.1, -10);
        ground.rotation = new BABYLON.Vector3(Math.PI / 2, Math.PI / 4, 0);
        ground.material.opacity = 0.5;

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
        camera._needMoveForGravity = true


        // basic lighting
        var pathwidth = (window.innerWidth <= 768 ? 3 : 2); 
        var light1 = new BABYLON.PointLight('point1', new BABYLON.Vector3(33, pathwidth, -33), scene);

        // a good website
        var agoodwebsite = BABYLON.SceneLoader.Append("./", "a good website.obj", scene, function (scene) {

            agoodwebsite.position = new BABYLON.Vector3(5,5,5);
        });

        // Over/Out

        

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

    function startGame() {
        document.getElementsByClassName("start-screen")[0].classList += ' go-way';
    
        var master_channel = new Tone.Channel().toMaster();
        var vol = new Tone.Volume(-24)
        var vol2 = new Tone.Volume(0)
        var heavensounds = new Tone.Sampler({
            "C3" : "audio/110036__timbre__organ-ic-2.wav"
        }, function(){
            setTimeout(() => {
                heavensounds.triggerAttackRelease(43, 20);     
                setInterval(() => {
                    heavensounds.triggerAttackRelease(43, 20); 
                    setTimeout(() => {
                        heavensounds.triggerAttackRelease(43, 20);     
                    }, 10000);                 
                }, 20000);  
            }, 500);
        });
        heavensounds.chain(vol, master_channel);
        var wilhelm = new Tone.Sampler({
            "C3" : "audio/WilhelmScream.mp3"
        }, function(){
            console.log('wilhelm loaded');
        });
        wilhelm.chain(vol2, master_channel);

        var scene = createScene();
    
        engine.runRenderLoop(function () {
            // render changes
            var camerapos = engine.scenes[0].cameras[0]._position;
            heavensounds.volume.value = (camerapos.x / 2);
            // console.log(engine.scenes[0].cameras[0])
            if (redirected == false && camerapos.x > 29 && camerapos.y > 0) {
                console.log('redirecting...');
                window.location.href = "https://kylegrover.com/services/new-websites"
                redirected = true;
            }
            if (ifell == false && camerapos.y < -1300) {
                wilhelm.triggerAttack("C3");  
                console.log('i fell');
                ifell = true;
                setTimeout(() => {
                    engine.scenes[0].cameras[0]._position = new BABYLON.Vector3(-10,2.1,10);
                    engine.scenes[0].cameras[0]._rotation = new BABYLON.Vector3(0,0,0);
                    ifell = false;
                }, 300);
            }
            throttle(function(){
                // x range -10, 30
                document.getElementById('websitequest').style.opacity = 1 - (enginex + 10) / 40;
            }, 300)
            scene.render();
        })
        document.getElementsByTagName("body")[0].removeEventListener('click',startGame);
    }
    document.getElementsByTagName("body")[0].addEventListener('click',startGame)

});

function throttle (callback, limit) {
    var wait = false;                  // Initially, we're not waiting
    return function () {               // We return a throttled function
        if (!wait) {                   // If we're not waiting
            callback.call();           // Execute users function
            wait = true;               // Prevent future invocations
            setTimeout(function () {   // After a period of time
                wait = false;          // And allow future invocations
            }, limit);
        }
    }
}