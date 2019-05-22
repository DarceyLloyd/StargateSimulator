var EventHorizon = function(){

    if (!Detector.webgl) Detector.addGetWebGLMessage();

    // Texture width for simulation
    var WIDTH = 128;
    var NUM_TEXELS = WIDTH * WIDTH;

    // Water size in system units
    var BOUNDS = 512;
    var BOUNDS_HALF = BOUNDS * 0.5;

    var container, stats;
    var camera, scene, renderer, controls;
    var mouseMoved = false;
    var mouseCoords = new THREE.Vector2();
    var raycaster = new THREE.Raycaster();

    var waterMesh;
    var meshRay;
    var gpuCompute;
    var heightmapVariable;
    var waterUniforms;
    var smoothShader;

    var simplex = new SimplexNoise();

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    var options = '';
    for (var i = 4; i < 10; i++) {
        var j = Math.pow(2, i);
        options += '<a href="#" onclick="return change(' + j + ')">' + j + 'x' + j + '</a> ';
    }

    function init() {
        container = getElementById("stargate").getElementsByClassName("water")[0];

        camera = new THREE.PerspectiveCamera(75, 1, 1, 3000);
        camera.position.set(0, 0, 400);

        scene = new THREE.Scene();

        var sun = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        sun.position.set(0, 0, 175);
        scene.add(sun);

        var sun2 = new THREE.DirectionalLight(0x40A040, 1.6);
        sun2.position.set(-100, 350, -200);
        scene.add(sun2);

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        // renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setSize(512, 512);
        container.appendChild(renderer.domElement);

        if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
            stats = new Stats();
            container.appendChild(stats.dom);
        }

        var effectController = {
            mouseSize: 50.0,
            viscosity: 0.01
        };

        initWater();
        animate();
    }

    function initWater() {
        var materialColor = 0x003399;
        var geometry = new THREE.PlaneBufferGeometry(BOUNDS, BOUNDS, WIDTH - 1, WIDTH - 1);
        // material: make a ShaderMaterial clone of MeshPhongMaterial, with customized vertex shader
        var material = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge([
                THREE.ShaderLib['phong'].uniforms,
                {
                    heightmap: { value: null }
                }
            ]),
            vertexShader: document.getElementById('waterVertexShader').textContent,
            fragmentShader: THREE.ShaderChunk['meshphong_frag']
        });

        material.lights = true;

        // Material attributes from MeshPhongMaterial
        material.color = new THREE.Color(materialColor);
        material.specular = new THREE.Color(0xFFFFFF);
        material.shininess = 100;

        // Sets the uniforms with the material values
        material.uniforms.diffuse.value = material.color;
        material.uniforms.specular.value = material.specular;
        material.uniforms.shininess.value = Math.max(material.shininess, 1e-4);
        material.uniforms.opacity.value = material.opacity;

        // Defines
        material.defines.WIDTH = WIDTH.toFixed(1);
        material.defines.BOUNDS = BOUNDS.toFixed(1);

        waterUniforms = material.uniforms;

        waterMesh = new THREE.Mesh(geometry, material);
        // waterMesh.rotation.x = - Math.PI / 2;
        // waterMesh.rotation.x = degToRad(0);
        waterMesh.matrixAutoUpdate = false;
        waterMesh.updateMatrix();
        scene.add(waterMesh);

        // Creates the gpu computation class and sets it up
        gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, renderer);
        var heightmap0 = gpuCompute.createTexture();
        fillTexture(heightmap0);
        heightmapVariable = gpuCompute.addVariable("heightmap", document.getElementById('heightmapFragmentShader').textContent, heightmap0);
        gpuCompute.setVariableDependencies(heightmapVariable, [heightmapVariable]);
        heightmapVariable.material.defines.BOUNDS = BOUNDS.toFixed(1);

        var error = gpuCompute.init();
        if (error !== null) {
            console.error(error);
        }

        // Create compute shader to smooth the water surface and velocity
        smoothShader = gpuCompute.createShaderMaterial(document.getElementById('smoothFragmentShader').textContent, { texture: { value: null } });

    }

    function fillTexture(texture) {
        var waterMaxHeight = 20;

        function noise(x, y, z) {
            var multR = waterMaxHeight;
            var mult = 0.025;
            var r = 0;
            for (var i = 0; i < 15; i++) {
                r += multR * simplex.noise(x * mult, y * mult);
                multR *= 0.53 + 0.025 * i;
                mult *= 1.25;
            }
            return r;
        }

        var pixels = texture.image.data;

        var p = 0;
        for (var j = 0; j < WIDTH; j++) {
            for (var i = 0; i < WIDTH; i++) {

                var x = i * 128 / WIDTH;
                var y = j * 128 / WIDTH;

                pixels[p + 0] = noise(x, y, 123.4);
                pixels[p + 1] = 0;
                pixels[p + 2] = 0;
                pixels[p + 3] = 1;

                p += 4;
            }
        }
    }

    function smoothWater() {
        var currentRenderTarget = gpuCompute.getCurrentRenderTarget(heightmapVariable);
        var alternateRenderTarget = gpuCompute.getAlternateRenderTarget(heightmapVariable);
        for (var i = 0; i < 10; i++) {
            smoothShader.uniforms.texture.value = currentRenderTarget.texture;
            gpuCompute.doRenderTarget(smoothShader, alternateRenderTarget);
            smoothShader.uniforms.texture.value = alternateRenderTarget.texture;
            gpuCompute.doRenderTarget(smoothShader, currentRenderTarget);
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
        if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
            stats.update();
        }
    }

    function render() {
        gpuCompute.compute();
        waterUniforms.heightmap.value = gpuCompute.getCurrentRenderTarget(heightmapVariable).texture;
        renderer.render(scene, camera);
    }

    init();
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

