
// Author: darcey@aftc.io
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
var SimpleWormHole = function () {
    var vars = {
        path: "./",
        textures: {
            wormhole: false,
            cubeMap: [
                'neb_px.jpg',
                'neb_nx.jpg',
                'neb_py.jpg',
                'neb_ny.jpg',
                'neb_pz.jpg',
                'neb_nz.jpg'
            ]
        },
        three: {
            renderer: false,
            scene: false,
            camera: false,
        },
        dom: {
            container: false,
            overlay: false,
        },
        tunnelSpline: false,
        tunnelGeom: false,
        tunnelMaterial: false,
        tunnelMesh: false,
        zSpeed: 0.0010,
        tubePos: 0,
        rx: 0,
        lookAhead: 10,
        t: 0,
        started: false,
        loaded: false,
        outAnimStarted: false
    };
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function construtor() {
        log("SimpleWormHole.construtor()");

        vars.dom.stargate = getElementById("stargate");
        vars.dom.gateunderlay = vars.dom.stargate.getElementsByClassName("bg-container")[0];
        vars.dom.gateoverlay = vars.dom.stargate.getElementsByClassName("overlay-container")[0];
        vars.dom.gate = vars.dom.stargate.getElementsByClassName("gate")[0];
        vars.dom.dhd = vars.dom.stargate.getElementsByClassName("dhd")[0];
        vars.dom.lockcontainer = vars.dom.stargate.getElementsByClassName("lock-container")[0];
        vars.dom.ring = vars.dom.stargate.getElementsByClassName("ring-container")[0];
        vars.dom.water = vars.dom.stargate.getElementsByClassName("water")[0];
        vars.dom.fill = vars.dom.stargate.getElementsByClassName("fill")[0];
        vars.dom.console = document.querySelector("#stargate .info-container .txt");


        vars.dom.overlay = getElementById("wormhole-overlay");

        var loader = new THREE.TextureLoader();
        loader.crossOrigin = "Anonymous";
        loader.load(
            "./images/space01.jpg",
            function (texture) {
                vars.textures.wormhole = texture;
                setupThreeJS();
            }
        );
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function setupThreeJS() {
        log("SimpleWormHole.setupThreeJS()");
        // Creating the renderer
        vars.three.renderer = new THREE.WebGLRenderer({ alpha: false });
        vars.three.renderer.setClearColor(0x000000, 0);
        vars.three.renderer.setSize(window.innerWidth, window.innerHeight);
        vars.dom.container = getElementById("wormhole");
        vars.dom.container.append(vars.three.renderer.domElement);

        // Creating the scene
        vars.three.scene = new THREE.Scene();
        // Setting up the camera
        vars.three.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);

        // Creating the tunnel and adding it to the scene
        vars.tunnelGeom = buildTunnerGeometry(40, 512, 30, 80);

        // Create textured tunnel mesh
        vars.tunnelMaterial = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide,
            wireframe: false,
            map: vars.textures.wormhole
        });

        vars.tunnelMesh = new THREE.Mesh(vars.tunnelGeom, vars.tunnelMaterial);
        vars.three.scene.add(vars.tunnelMesh);

        setupCubeMap();

        resizeHandler();

        vars.loaded = true;
        // Auto run if started when load hadn't completed yet
        if (vars.started){
            startIntroAnim();
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function setupCubeMap(){
        log("Wormhole.setupCubeMap()");

        // I pref season 8 wormhole
        //log("SimpleWormHole.setupCubeMap(): vars.path = " + vars.path);
        var fileType = ".jpg";
        var urls = [
            vars.path + 'images/neb_px' + ".jpg",
            vars.path + 'images/neb_nx' + ".jpg",
            vars.path + 'images/neb_py' + ".jpg",
            vars.path + 'images/neb_ny' + ".jpg",
            vars.path + 'images/neb_pz' + ".jpg",
            vars.path + 'images/neb_nz' + ".jpg"
        ];


        vars.three.scene.background = new THREE.CubeTextureLoader()

            .load(
                urls,
                function(){
                    log("WormHole - Cube Texture Loader - COMPLETE");
                },
                function(){
                    log("WormHole - Cube Texture Loader - PROGRESS");
                },
                function(){
                    log("WormHole - Cube Texture Loader - ERROR");
                },
            );

        //var textureCube = THREE.ImageUtils.loadTextureCube(urls, THREE.CubeRefractionMapping);

        // var shader = THREE.ShaderLib["cube"];
        // shader.uniforms.tCube.value = textureCube;

        // var material = new THREE.ShaderMaterial({
        //     fragmentShader: shader.fragmentShader,
        //     vertexShader: shader.vertexShader,
        //     uniforms: shader.uniforms,
        //     depthWrite: false,
        //     side: THREE.BackSide
        // });

        // var mesh = new THREE.Mesh(new THREE.BoxGeometry(50000, 50000, 50000), material);
        // vars.three.scene.add(mesh);

        // var geometry = new THREE.SphereGeometry( 5000, 32, 32 );
        // var material = new THREE.MeshBasicMaterial( {color: 0xffff00,side: THREE.BackSide} );
        // var sphere = new THREE.Mesh( geometry, material );
        // vars.three.scene.add( sphere )
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function buildTunnerGeometry(points, segments, radius, radiusSegments) {
        // Array of spline points
        var splinePoints = [];
        var previousPoint = new THREE.Vector3(0, 0, 0);
        for (var i = 0; i < points; i++) {
            var rX = previousPoint.x + 5 + Math.round(Math.random() * 500);
            var rY = previousPoint.y + 5 + Math.round(Math.random() * 500);
            var rZ = previousPoint.z + 5 + Math.round(Math.random() * 500);

            previousPoint.x = rX;
            previousPoint.y = rY;
            previousPoint.z = rZ;

            splinePoints.push(new THREE.Vector3(rX, rY, rZ));
        }
        vars.tunnelSpline = new THREE.CatmullRomCurve3(splinePoints); // SplineCurve3
        var geom = new THREE.TubeGeometry(vars.tunnelSpline, segments, radius, radiusSegments, false);
        return geom;
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function render() {
        vars.t += 0.01;

        var end = 1 - (vars.zSpeed * vars.lookAhead);
        var closeToEnd = 1 - (vars.zSpeed * (vars.lookAhead*20));

        // if  (vars.tubePos >= closeToEnd && !vars.outAnimStarted){
        //     vars.outAnimStarted = true;
        //     // startEndAnim();
        // }

        if (vars.tubePos >= end) {
            log("Wormhole limit reached!");
            return;
        }

        var pos1 = vars.tunnelSpline.getPointAt(vars.tubePos);
        var pos2 = vars.tunnelSpline.getPointAt(vars.tubePos + (vars.zSpeed * vars.lookAhead));
        vars.three.camera.position.set(pos1.x, pos1.y, pos1.z);
        vars.three.camera.lookAt(pos2);

        vars.rx = Math.sin(vars.t) * 15;
        vars.three.camera.rotation.z = degToRad(vars.rx);
        vars.tubePos += vars.zSpeed;
        requestAnimationFrame(render);
        vars.three.renderer.render(vars.three.scene, vars.three.camera);
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function startEndAnim(){
        if (vars.outAnimStarted){
            return;
        }
        vars.outAnimStarted = true;
        log("SimpleWormHole.startEndAnim()");



        var tEnd = new TimelineMax({ });
        tEnd.add(TweenMax.to(vars.dom.overlay, 0.3, { delay: 0.1, opacity: 1 }));
        tEnd.set(getElementById("end"),{display:"block"});
        tEnd.set(vars.dom.gateunderlay,{display:"none"});
        tEnd.set(vars.dom.gateoverlay,{display:"none"});
        tEnd.set(vars.dom.dhd,{display:"none"});
        tEnd.set(vars.dom.gate,{display:"none"});
        tEnd.set(vars.dom.ring,{display:"none"});
        tEnd.set(vars.dom.lockcontainer,{display:"none"});
        tEnd.set(vars.dom.water,{display:"none"});
        tEnd.set(vars.dom.fill,{display:"none"});
        tEnd.set(vars.dom.console,{display:"none"});
        tEnd.set(vars.dom.container,{display:"none"});
        tEnd.add(TweenMax.to(vars.dom.overlay, 0.3, { delay: 1.5, opacity: 0 }));
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function resizeHandler() {
        vars.three.renderer.setSize(window.innerWidth, window.innerHeight);
        vars.three.camera.aspect = window.innerWidth / window.innerHeight;
        vars.three.camera.updateProjectionMatrix();
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function startIntroAnim(){
        log("Wormhole.startIntroAnim()");

        render();
        vars.dom.overlay.style.display = "block";
        vars.dom.container.style.display = "block";
        TweenMax.set(vars.dom.overlay,{opacity:1});
        TweenMax.set(vars.dom.container,{opacity:1});
        TweenMax.to(vars.dom.overlay,0.5,{delay: 0.5, opacity:0});

        var path = vars.path + "sounds/" + "through_the_wormhole.mp3";
        var sound = new Audio(path);
        sound.volume = 0.7;
        // sound.addEventListener('ended', function () {
        //     startEndAnim();
        // }, false);
        sound.addEventListener("timeupdate",function(e){
            // log(sound.currentTime);
            if (sound.currentTime >= 11){
                startEndAnim();
            }
        });
        sound.play();

        // var sound      = document.createElement('audio');
        // sound.id       = 'audio-player';
        // sound.controls = 'controls';
        // sound.src      = path;
        // sound.type     = 'audio/mpeg';
        // sound.addEventListener("timeupdate",function(e){
        //     log(sound.currentTime);
        //     if (sound.currentTime >= 11){
        //         startEndAnim();
        //     }
        // });
        // document.body.appendChild(sound);
        // sound.play();
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    // simulate constructor
    construtor();
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    // Public
    this.start = function () {
        log("Wormhole.start()");
        vars.started = true;
        if (vars.loaded){
            startIntroAnim();
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

