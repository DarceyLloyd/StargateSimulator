
// Main Stargate Function class (Function class imo is nicer to use than class's in JS as it's closer to real classes)
var Stargate = function () {
    var vars = {
        selected: 1,
        dialing: false,
        dhd: {
            button: []
        },
        dom: {
            stargate: false,
            gate: false,
            ring: false,
            water: false,
            fill: false,
            console: false,
            sam: false,
            clickToEnter: false
        },
        audio: {
            background: false,
            water: false,
        },
        path: {
            live: "./",
            dev: "./",
            actual: false
        },
        preload: {
            images: [
                "images/dhd.png",
                "images/dhd_blank.png",
                "images/dhd_btn_down.png",
                "images/dhd_btn_up.png",
                "images/gate.png",
                "images/lock_base_off.png",
                "images/lock_base_on.png",
                "images/lock_center_off.png",
                "images/lock_center_on.png",
                "images/logo.png",
                "images/ring.png"
            ],
            sounds: [
                "sounds/bg2.mp3",
                "sounds/open.mp3",
                "sounds/rotate.mp3",
                "sounds/dhd_select.mp3",
                "sounds/fail.mp3",
                "sounds/chevron_lock.mp3",
                "sounds/water.mp3",
                "sounds/through_the_wormhole.mp3"
            ],
            loadedImages: [],
            loadedSounds: [],
            imagesLoaded: 0,
            soundsLoaded: 0,
            complete: false,
        },
        r: 0
    };

    var target = 0;
    var activeSound;
    var chevronsLocked = 0;
    var chevronsRequired = 3;

    function constructor() {
        log("Stargate.constructor()");
        vars.dom.stargate = getElementById("stargate");
        vars.dom.gate = vars.dom.stargate.getElementsByClassName("gate")[0];
        vars.dom.ring = vars.dom.stargate.getElementsByClassName("ring")[0];
        vars.dom.water = vars.dom.stargate.getElementsByClassName("water")[0];
        vars.dom.fill = vars.dom.stargate.getElementsByClassName("fill")[0];
        vars.dom.console = document.querySelector("#stargate .info-container .txt");
        vars.dom.sam = vars.dom.stargate.getElementsByClassName("sam")[0];
        vars.dom.clickToEnter = vars.dom.stargate.getElementsByClassName("click-to-enter")[0];

        if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
            vars.path.actual = vars.path.dev;
        } else {
            vars.path.actual = vars.path.live;
        }
        // log("vars.path.actual = " + vars.path.actual);

        vars.dom.console.innerHTML = "Please select a " + chevronsRequired + " Chevron gate address<br>from the DHD below..";

        // vars.audio.background = playSound("bg2.mp3", 0.5, true);

        // preload();
        preloadImages();
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    function preloadImages(){
        log("Stargate.preloadImages()");

        for (let i = 0; i < vars.preload.images.length; i++) {
            vars.preload.loadedImages[i] = new Image()
            vars.preload.loadedImages[i].src = vars.preload.images[i]
            vars.preload.loadedImages[i].onload = function(e){
                // log("LOADED:");
                // log(e.target.src);
                vars.preload.imagesLoaded++;
                checkImagesLoaded();
            }
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    function checkImagesLoaded(){
        // log("Stargate.checkImagesLoaded()");
        if (vars.preload.imagesLoaded == vars.preload.images.length){
            log("IMAGES LOADED!");
            preloadSounds();
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    function preloadSounds(){
        log("Stargate.preloadSounds()");

        for (let i = 0; i < vars.preload.sounds.length; i++) {
            let sound = document.createElement("audio");
            if ("src" in sound) {
                sound.autoPlay = false;
            }
            sound.src = vars.preload.sounds[i];
            document.body.appendChild(sound);

            vars.preload.loadedSounds[i] = sound;
            vars.preload.soundsLoaded++;
            checkSoundsLoaded();
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    function checkSoundsLoaded(){
        // log("Stargate.checkSoundsLoaded()");
        if (vars.preload.soundsLoaded == vars.preload.sounds.length){
            log("SOUNDS LOADED!");
            vars.preload.compelte = true;
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -










    function preload() {
        log("Stargate.preload()");

        var myPreloader = new AFTC.Preloader({
            batchSize: 5,
            onComplete: preloaderComplete,
            onProgress: preloaderProgressHandler,
            cache: false
        });

        for (var key in vars.preload) {
            var item = vars.path.actual + vars.preload[key];
            myPreloader.add({ url: item });
        }
        for (var i = 1; i <= 32; i++) {
            var no = i;
            if (i < 10) {
                no = "0" + i;
            }
            var chevron = vars.path.actual + "images/dhd/down/c" + no + ".png";
            myPreloader.add({ url: chevron });
        }
        myPreloader.start();
    }

    function preloaderComplete() {
        log("preloaderComplete()");
    }

    function preloaderProgressHandler(o) {
        // log("preloaderProgressHandler(o): " + o.percentLoaded);
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -






    function openWormHole() {
        log("openWormHole()");
        spinRing();
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    function spinRing() {
        // log("Stargate.spinRing()");

        var newTarget = getRandom(100, 360);
        var moveRange = Math.abs(target - newTarget);
        if (moveRange < 100) {
            spinRing();
        } else {
            // log("spinRing(): " + moveRange);
            vars.dom.console.innerHTML = "Dialing chevron " + (chevronsLocked+1) + "...";
            vars.dom.console.innerHTML = "Dialing chevron " + (chevronsLocked + 1) + "...";
            target = newTarget;
            activeSound = playSound("rotate.mp3");
            TweenMax.to(vars.dom.ring, 1.2, { rotation: target, onComplete: spinRingComplete });
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    function spinRingComplete() {
        log("Stargate.spinRingComplete()");

        chevronsLocked++;
        vars.dom.console.innerHTML = "Attempting to lock chevron " + (chevronsLocked) + "...";
        // log("spinRingComplete(): chevronsLocked = " + chevronsLocked);
        activeSound.pause();
        activeSound = playSound("chevron_lock.mp3");
        var o = { v: 0 };
        TweenMax.to(o, 0.9, {
            v: 1, onComplete: function () {
                vars.dom.console.innerHTML = "Chevron " + (chevronsLocked) + " LOCKED!";
            }
        })

        var lock = getElementById("stargate").getElementsByClassName("lock" + chevronsLocked)[0];
        var base_off = lock.getElementsByClassName("base-off")[0];
        var base_on = lock.getElementsByClassName("base-on")[0];
        var center_off = lock.getElementsByClassName("center-off")[0];
        var center_on = lock.getElementsByClassName("center-on")[0];

        TweenMax.set(base_off, { opacity: 0 });
        TweenMax.set(base_on, { opacity: 1 });
        var t = new TimelineMax();
        t.add(TweenMax.to(center_off, 0.7, { y: -6 }));
        t.add(TweenMax.to(center_off, 0.2, { y: 0 }));
        t.add(TweenMax.to(center_on, 0.2, { y: 0, opacity: 1 }));

        activeSound.addEventListener('ended', function () {
            // log("chevronsLocked = " + chevronsLocked);
            if (chevronsLocked >= chevronsRequired) {
                activeSound = playSound("open.mp3");
                vars.dom.fill.style.opacity = 1;
                vars.dom.water.style.opacity = 1;
                TweenMax.to(vars.dom.fill, 1.5, { opacity: 0 });
                vars.audio.water = playSound("water.mp3", 1, true);
                vars.dom.console.innerHTML = ""; //"Wormhole established and locked! CLICK TO ENTER";

                vars.dom.sam.style.display = "block";
                var t2 = new TimelineMax({ repeat: -1 });
                t2.set(vars.dom.sam, { opacity: 0 });
                t2.to(vars.dom.sam, 5, { delay: 3, opacity: 0.2 });
                t2.to(vars.dom.sam, 5, { delay: 3, opacity: 0 });

                vars.dom.clickToEnter.style.display = "block";
                var t3 = new TimelineMax({ repeat: -1 });
                t3.set(vars.dom.clickToEnter, { opacity: 0 });
                t3.to(vars.dom.clickToEnter, 1, { delay: 3, opacity: 1 });
                t3.to(vars.dom.clickToEnter, 1, { delay: 1, opacity: 0 });

                setupClickToEnter();

            } else {
                spinRing();
            }
        }, false);
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    function playSound(file, vol, loop, onComplete) {
        // log("Stargate.playSound(file, vol, loop, onComplete)");

        var path = vars.path.actual + "sounds/" + file;
        // log("path = " + path);
        var sound = new Audio(path);
        // log(sound);
        if (vol) {
            sound.volume = 0.3;
        }
        if (loop) {
            sound.addEventListener('ended', function () {
                this.currentTime = 0;
                this.play();
            }, false);
        }

        if (onComplete) {
            sound.addEventListener('ended', function () {
                onComplete();
            }, false);
        }
        sound.play();
        return sound;
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    function enterWormhole() {
        log("Stargate.enterWormhole()");
        try {
            vars.dom.stargate.removeEventListener("click", enterWormhole);
        } catch(e) {}

        if (vars.audio.water){
            vars.audio.water.pause();
        }

        wormHole.start();
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    function setupClickToEnter(){
        log("Stargate.setupClickToEnter()");

        vars.dom.stargate.addEventListener("click", enterWormhole);
        vars.dom.stargate.classList.add("pointer");
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -








    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // PUBLIC
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    this.select = function (no) {
        // prevent selection when dialing
        if (vars.dialing) {
            log("Stargate.select(): Click rejected, stargate is already dialing.");
            return;
        }
        // only allow 7 chevron addresses
        if (vars.selected > chevronsRequired) {
            log("Stargate.select(): Click rejected, " + chevronsRequired + " chevron limit.");
            return;
        }
        // Prevent same button click
        if (vars.dhd.button[no]) {
            log("Stargate.select(): Click rejected, you already clicked that dhd button.");
            return;
        }
        vars.selected++;
        vars.dhd.button[no] = true;

        playSound("dhd_select.mp3");
        var element = getElementById("stargate").getElementsByClassName("btn" + no)[0];
        if (parseInt(no) < 10) {
            no = "0" + no;
        }
        var bg = "url(" + vars.path.actual + "images/dhd/down/c" + no + ".png)";
        element.style.backgroundImage = bg;

        if (vars.selected < (chevronsRequired+1)) {
            vars.dom.console.innerHTML = "Chevron " + (vars.selected - 1) + " of " + chevronsRequired + " selected...";
        } else {
            vars.dom.console.innerHTML = "Press the big red button to start dialing!";
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    this.dial = function () {
        log("Stargate.dial()");
        // prevent selection when dialing
        if (vars.dialing) {
            return;
        }


        // only allow 7 chevron addresses
        if (vars.selected < chevronsRequired) {
            playSound("fail.mp3");
            vars.dom.console.innerHTML = "Please select 7 symbols<br>from the DHD below";
        } else {
            vars.dom.console.innerHTML = "Dialing your 7 chevron gate address!";
            playSound("dhd_select.mp3");
            vars.dialing = true;
            openWormHole();
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    this.enter = function() {
        enterWormhole();
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    this.testClickToEnter = function(){
        setupClickToEnter();
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // To enable class constructor auto run simulation
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    constructor();
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

};
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



