
// UTILS
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var aftcDebugPos = {
    step: 1,
    fastStep: 20
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



function debugPosition(element) {
    var x = parseFloat(getComputedStyle(element).left);
    var y = parseFloat(getComputedStyle(element).top);
    var step = aftcDebugPos.step;
    window.addEventListener("keydown", function (e) {
        e.preventDefault();
        // log(e);
        switch (e.key) {
            case "Shift":
                if (step == 1) {
                    step = aftcDebugPos.fastStep;
                } else {
                    step = aftcDebugPos.step;
                }
                break;

            case "ArrowLeft":
                x = parseFloat(getComputedStyle(element).left);
                x -= step;
                element.style.left = x + "px";
                break;
            case "ArrowRight":
                x = parseFloat(getComputedStyle(element).left);
                x += step;
                element.style.left = x + "px";
                break;
            case "ArrowUp":
                y = parseFloat(getComputedStyle(element).top);
                y -= step;
                element.style.top = y + "px";
                break;
            case "ArrowDown":
                y = parseFloat(getComputedStyle(element).top);
                y += step;
                element.style.top = y + "px";
                break;
            case " ":
                //log(x + " - " + y);
                log("left: " + x + "px; top: " + y + "px;");
                break;
        }
    });
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

