<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Stargate with DHD - Darcey@aftc.io</title>
    <link href="includes/css/styles.css?v=<?php echo(rand(0, 9999999)); ?>" rel="stylesheet" type="text/css"/>
    <script src="includes/js/aftc.min.js"></script>
    <script src="includes/js/aftc.preload.min.js"></script>

    <script src="includes/js/TweenMax.min.js"></script>

    <script src="./includes/js/three.js"></script>
    <script src="./includes/js/Detector.js"></script>
    <script src="./includes/js/stats.min.js"></script>
    <script src="./includes/js/SimplexNoise.js"></script>

    <script src="./includes/js/GPUComputationRenderer.js"></script>

    <script src="includes/js/utils.js?v=<?php echo(rand(0, 9999999)); ?>"></script>
    <script src="includes/js/Stargate.js?v=<?php echo(rand(0, 9999999)); ?>"></script>
    <script src="includes/js/EventHorizon.js?v=<?php echo(rand(0, 9999999)); ?>"></script>
    <script src="includes/js/Wormhole.js?v=<?php echo(rand(0, 9999999)); ?>"></script>

    <script src="includes/js/global.js?v=<?php echo(rand(0, 9999999)); ?>"></script>
</head>

<body>
<div id="end">
    <div class="inner">
        <div class="image"></div>
        <div class="who"><br>Darcey@aftc.io</div>
    </div>

</div>
<div id="stargate">
    <div id="wormhole"></div>
    <div id="wormhole-overlay"></div>
    <div class="info-container">
        <div class="txt">darcey@aftc.io</div>
    </div>

    <div class="inner">
        <div class="gate"></div>
        <div class="ring-container">
            <div class="ring"></div>
        </div>
        <div class="lock-container">
            <div class="lock1 lock">
                <div class="center-on"></div>
                <div class="center-off"></div>
                <div class="base-on"></div>
                <div class="base-off"></div>
            </div>
            <div class="lock2 lock">
                <div class="center-on"></div>
                <div class="center-off"></div>
                <div class="base-on"></div>
                <div class="base-off"></div>
            </div>
            <div class="lock3 lock">
                <div class="center-on"></div>
                <div class="center-off"></div>
                <div class="base-on"></div>
                <div class="base-off"></div>
            </div>
            <div class="lock4 lock">
                <div class="center-on"></div>
                <div class="center-off"></div>
                <div class="base-on"></div>
                <div class="base-off"></div>
            </div>
            <div class="lock5 lock">
                <div class="center-on"></div>
                <div class="center-off"></div>
                <div class="base-on"></div>
                <div class="base-off"></div>
            </div>
            <div class="lock6 lock">
                <div class="center-on"></div>
                <div class="center-off"></div>
                <div class="base-on"></div>
                <div class="base-off"></div>
            </div>
            <div class="lock7 lock">
                <div class="center-on"></div>
                <div class="center-off"></div>
                <div class="base-on"></div>
                <div class="base-off"></div>
            </div>
        </div>
        <div class="fill"></div>
        <div class="water"></div>
        <div class="bg-container">
            <div class="logo"></div>
        </div>
        <div class="overlay-container">
            <div class="sam"></div>
            <div class="click-to-enter"><a href='javascript: stargate.enter();'>CLICK TO ENTER</a></div>
        </div>


        <div class="dhd">
            <div class="bg"></div>
            <div class="btn-start" onclick="stargate.dial()"></div>
            <div class="buttons">
                <?php
                $dir = './images/dhd/up';
                $files = scandir($dir);
                $cnt = 0;
                $css = "<style>\n";
                foreach ($files as $key => $file)
                {
                    if ($file != "." && $file != "..")
                    {
                        $cnt++;
                        $size = getimagesize($dir . "/" . $file);
                        $w = 0;
                        $html = "<div class='dhd-btn btn" . $cnt . "' onclick='stargate.select(" . $cnt . ")'>";
                        //$html .= "<img src='./images/dhd/up/" . $file . "' width='" . $size[0] . "'  height='" . $size[1] . "'>";
                        //$html .= "<img src='./images/dhd/down/" . $file . "' width='" . $size[0] . "'  height='" . $size[1] . "'>";
                        $html .= "</div>\n";
                        echo($html);
                        // $css .= "#stargate .dhd .btn" . $cnt . " {\n";
                        // $css .= "\t" ."position: absolute;". "\n";
                        // $css .= "\t" ."top: 0px;". "\n";
                        // $css .= "\t" ."left: 0px;". "\n";
                        // $css .= "\t" ."background: url(../../images/dhd/up/" . $file . ");". "\n";
                        // $css .= "\t" ."width: " . $size[0] . "px;". "\n";
                        // $css .= "\t" ."height: " . $size[1] . "px;". "\n";
                        // $css .= "\t" . "}\n\n";
                        $css .= "#stargate .dhd .btn" . $cnt . ":hover {\n";
                        // $css .= "\t" ."position: absolute;". "\n";
                        // $css .= "\t" ."top: 0px;". "\n";
                        // $css .= "\t" ."left: 0px;". "\n";
                        $css .= "\t" . "background: url(../../images/dhd/over/" . $file . ");" . "\n";
                        // $css .= "\t" ."width: " . $size[0] . "px;". "\n";
                        // $css .= "\t" ."height: " . $size[1] . "px;". "\n";
                        $css .= "\t" . "}\n\n";
                    }
                }
                $css .= "\n</style>";
                // echo($css);
                // <div class="btn1"><img src="./images/c01.png" width="57"></div>
                ?>
            </div>
        </div>
    </div>
</div>


<!-- This is the 'compute shader' for the water heightmap: -->
<script id="heightmapFragmentShader" type="x-shader/x-fragment">

        #include <common>

        uniform vec2 mousePos;
        uniform float mouseSize;
        uniform float viscosityConstant;

        #define deltaTime ( 1.0 / 60.0 )
        #define GRAVITY_CONSTANT ( resolution.x * deltaTime * 3.0 )

        void main()	{

            vec2 cellSize = 1.0 / resolution.xy;

            vec2 uv = gl_FragCoord.xy * cellSize;

            // heightmapValue.x == height
            // heightmapValue.y == velocity
            // heightmapValue.z, heightmapValue.w not used
            vec4 heightmapValue = texture2D( heightmap, uv );

            // Get neighbours
            vec4 north = texture2D( heightmap, uv + vec2( 0.0, cellSize.y ) );
            vec4 south = texture2D( heightmap, uv + vec2( 0.0, - cellSize.y ) );
            vec4 east = texture2D( heightmap, uv + vec2( cellSize.x, 0.0 ) );
            vec4 west = texture2D( heightmap, uv + vec2( - cellSize.x, 0.0 ) );

            float sump = north.x + south.x + east.x + west.x - 4.0 * heightmapValue.x;

            float accel = sump * GRAVITY_CONSTANT;

            // Dynamics
            heightmapValue.y += accel;
            heightmapValue.x += heightmapValue.y * deltaTime;

            // Viscosity
            heightmapValue.x += sump * viscosityConstant;

            // Mouse influence
            float mousePhase = clamp( length( ( uv - vec2( 0.5 ) ) * BOUNDS - vec2( mousePos.x, - mousePos.y ) ) * PI / mouseSize, 0.0, PI );
            heightmapValue.x += cos( mousePhase ) + 1.0;

            gl_FragColor = heightmapValue;

        }


</script>

<!-- This is just a smoothing 'compute shader' for using manually: -->
<script id="smoothFragmentShader" type="x-shader/x-fragment">

        uniform sampler2D texture;

        void main()	{

            vec2 cellSize = 1.0 / resolution.xy;

            vec2 uv = gl_FragCoord.xy * cellSize;

            // Computes the mean of texel and 4 neighbours
            vec4 textureValue = texture2D( texture, uv );
            textureValue += texture2D( texture, uv + vec2( 0.0, cellSize.y ) );
            textureValue += texture2D( texture, uv + vec2( 0.0, - cellSize.y ) );
            textureValue += texture2D( texture, uv + vec2( cellSize.x, 0.0 ) );
            textureValue += texture2D( texture, uv + vec2( - cellSize.x, 0.0 ) );

            textureValue /= 5.0;

            gl_FragColor = textureValue;

        }


</script>

<!-- This is the water visualization shader, copied from the MeshPhongMaterial and modified: -->
<script id="waterVertexShader" type="x-shader/x-vertex">

        uniform sampler2D heightmap;

        #define PHONG

        varying vec3 vViewPosition;

        #ifndef FLAT_SHADED

            varying vec3 vNormal;

        #endif

        #include <common>
        #include <uv_pars_vertex>
        #include <uv2_pars_vertex>
        #include <displacementmap_pars_vertex>
        #include <envmap_pars_vertex>
        #include <color_pars_vertex>
        #include <morphtarget_pars_vertex>
        #include <skinning_pars_vertex>
        #include <shadowmap_pars_vertex>
        #include <logdepthbuf_pars_vertex>
        #include <clipping_planes_pars_vertex>

        void main() {

            vec2 cellSize = vec2( 1.0 / WIDTH, 1.0 / WIDTH );

            #include <uv_vertex>
            #include <uv2_vertex>
            #include <color_vertex>

            // # include <beginnormal_vertex>
            // Compute normal from heightmap
            vec3 objectNormal = vec3(
                ( texture2D( heightmap, uv + vec2( - cellSize.x, 0 ) ).x - texture2D( heightmap, uv + vec2( cellSize.x, 0 ) ).x ) * WIDTH / BOUNDS,
                ( texture2D( heightmap, uv + vec2( 0, - cellSize.y ) ).x - texture2D( heightmap, uv + vec2( 0, cellSize.y ) ).x ) * WIDTH / BOUNDS,
                1.0 );
            //<beginnormal_vertex>

            #include <morphnormal_vertex>
            #include <skinbase_vertex>
            #include <skinnormal_vertex>
            #include <defaultnormal_vertex>

        #ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED

            vNormal = normalize( transformedNormal );

        #endif

            //# include <begin_vertex>
            float heightValue = texture2D( heightmap, uv ).x;
            vec3 transformed = vec3( position.x, position.y, heightValue );
            //<begin_vertex>

            #include <morphtarget_vertex>
            #include <skinning_vertex>
            #include <displacementmap_vertex>
            #include <project_vertex>
            #include <logdepthbuf_vertex>
            #include <clipping_planes_vertex>

            vViewPosition = - mvPosition.xyz;

            #include <worldpos_vertex>
            #include <envmap_vertex>
            #include <shadowmap_vertex>

        }


</script>

</body>

</html>