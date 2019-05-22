// Author: darcey@aftc.io
// Requires: AFTC.JS, AFTC.Preload, ThreeJS & GSAP
// npm i aftc.js (jquery replacement - faster & smaller)
// github threejs - a commonly used webgl wrapper
// gsap - tweening library
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -





var stargate,wormhole;
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
onReady(function () {
    new EventHorizon();
    
    stargate = new Stargate();
    //stargate.testClickToEnter();

    wormHole = new SimpleWormHole();
    //wormHole.start();
});
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -