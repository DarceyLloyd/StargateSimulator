/*
    Author: darcey@aftc.io
    Author: Darcey.Lloyd@gmail.com
*/
// The AFTC Object - All For The Code and NOTHING but the CODE!
var AFTC = AFTC || {};

/**
 * @function: addEvent(obj,type,fn,useCapture)
 * @desc: Shortcut for adding events with old browser compatibility
 * @param object obj: The object you wish to attach the event listener to
 * @param string type: The event type (e.type) mousedown, mouseup, click etc
 * @param function fn: The function to call when the event is triggered
 * @param boolean optional useCapture: Whether the event should be executed in the capturing or in the bubbling phase
 */
window.addEvent = function (obj, type, fn, useCapture) {
    if (obj == null || typeof (obj) == 'undefined') return;
    if (obj.addEventListener) {
        //obj.addEventListener(type, fn, false);
        obj.addEventListener(type, fn, useCapture ? true : false);
    } else if (obj.attachEvent) {
        obj.attachEvent("on" + type, fn);
    } else {
        obj["on" + type] = fn;
    }
};

/**
 * @function: onReady(fn)
 * @desc: Replacement for jQuerys $(document).ready
 * @param function fn: inline function or pass it a function for when your page is loaded and ready to be used
 * @alias: ready
 */
window.onReady = function (fn) {
    // IE9+
    if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
        fn();
    } else {
        document.addEventListener("DOMContentLoaded", function () {
            // Adds a little delay but is a good thing
            setTimeout(fn, 10);
        });
    }
}
window.ready = function (fn) {
    window.onReady(fn);
}




/**
 * @function: AFTC.Resizemanager()
 * @desc: A function stack manager for resize and orientation change events
 * @function: enable()
 * @desc: enable function stack execution on oritentation and resize change
 * @function: disable()
 * @desc: disable function stack execution on oritentation and resize change
 * @function: add(uid,fn)
 * @desc: add function to orientation and resize stack
 * @param string uid: unique id / label of function to add from stack
 * @param function fn: function to add to stack
 * @function: remove(uid)
 * @desc: remove function from orientation and resize stack
 * @param string uid: unique id / label of function to remove from stack
 */
AFTC.ResizeManager = {
    running: false,
    enabled: false,
    delay: 100,
    stack: [],
    enable: function () {
        // log("AFTC.ResizeManager.enable()");
        AFTC.ResizeManager.enabled = true;
        window.addEventListener("resize", AFTC.ResizeManager.resizeHandler, false);
        window.addEventListener("orientationchange", AFTC.ResizeManager.resizeHandler, false);
    },
    disable: function () {
        // log("AFTC.ResizeManager.disable()");
        AFTC.ResizeManager.enabled = false;
        window.removeEventListener("resize", AFTC.ResizeManager.resizeHandler, false);
        window.removeEventListener("orientationchange", AFTC.ResizeManager.resizeHandler, false);
    },
    add: function (uid, fn) {
        // log("AFTC.ResizeManager.add(): " + uid);
        var stackItem = {};
        stackItem.uid = uid;
        stackItem.fn = fn;
        AFTC.ResizeManager.stack.push(stackItem);
    },
    remove: function (uid) {
        // log("AFTC.ResizeManager.remove(): " + uid);
        var len = AFTC.ResizeManager.stack.length;
        for (var i = 0; i < len; i++) {
            if (AFTC.ResizeManager.stack[i]) {
                //log(AFTC.ResizeManager.stack[i].uid);
                if (AFTC.ResizeManager.stack[i].uid == uid) {
                    AFTC.ResizeManager.stack.splice(i, 1);
                    AFTC.ResizeManager.remove(uid);
                    break;
                }
            }
        }
    },
    runStackItem: function (index, stackLength) {
        // log("runStackItem(index:"+index+")");
        window.setTimeout(function () {
            if (index == (stackLength - 1)) {
                AFTC.ResizeManager.running = false;
            }
            AFTC.ResizeManager.stack[index].fn();
        }, AFTC.ResizeManager.delay);

    },
    resizeHandler: function (e) {
        if (AFTC.ResizeManager.running) {
            return;
        }
        AFTC.ResizeManager.running = true;

        window.setTimeout(function () {
            var len = AFTC.ResizeManager.stack.length;
            for (var i = 0; i < len; i++) {
                AFTC.ResizeManager.runStackItem(i, len);
            }
        }, AFTC.ResizeManager.delay);
    }
}
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #










// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// DOM Element retrieval
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
AFTC.AFTCElementQueryCache = [];

/**
 * @function: getElementById(id)
 * @desc: short cut for document.getElementById, it also caches the query
 * @param id string: id of html element to retrieve
 * @alias: getId
 * @alias: byId
 */
window.getElementById = function (id) {
    var cached = AFTC.AFTCElementQueryCache[id];
    if (isElement(cached)) {
        return cached;
    } else {
        var ele = document.getElementById(id);
        AFTC.AFTCElementQueryCache[id] = ele;
        return ele;
    }
}
window.getId = function (id) { return window.getElementById(id); }
window.byId = function (id) { return window.getElementById(id); }

/**
 * @function: querySelector(str)
 * @desc: Short cut for document.querySelector, it also caches the query
 * @param string str: the query to be run on the dom
 * @alias: query
 * @alias: cssQuery
 */
window.querySelector = function (str) {
    var cached = AFTC.AFTCElementQueryCache[str];
    if (isElement(cached)) {
        return cached;
    } else {
        var ele = document.querySelector(str);
        AFTC.AFTCElementQueryCache[str] = ele;
        return ele;
    }
}
window.query = function (id) { return window.querySelector(id); }
window.cssQuery = function (id) { return window.querySelector(id); }


/**
 * @function: getElementsByClassName(str)
 * @desc: Short cut for document.getElementsByClassName, it also caches the query
 * @param string str: the class name to look for
 * @alias: getClass
 * @alias: byClass
 */
window.getElementsByClassName = function (str) {
    var cached = AFTC.AFTCElementQueryCache[str];
    if (isElement(cached)) {
        return cached;
    } else {
        var ele = document.getElementsByClassName(str);
        AFTC.AFTCElementQueryCache[str] = ele;
        return ele;
    }
}
window.getClass = function (id) { return window.getElementsByClassName(id); }
window.byClass = function (id) { return window.getElementsByClassName(id); }



/**
 * @function: getElementsByTagName(str)
 * @desc: shortcut for getElementsByTagName
 * @param string str: tag name to look for
 */
window.getElementsByTagName = function (str) {
    var cached = AFTC.AFTCElementQueryCache[str];
    if (isElement(cached)) {
        return cached;
    } else {
        var ele = document.getElementsByTagName(str);
        AFTC.AFTCElementQueryCache[str] = ele;
        return ele;
    }
}
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #






// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// Styling shortcuts
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
/**
 * @function: addClass(elementOrId,classname)
 * @desc: shortcut to add a css class to a html element
 * @param elementORstring elementOrId: The elemnt or id of the html element to add a css class to
 * @param string className: the class name to add
 */
window.addClass = function (elementOrId, className) {
    if (isElement(elementOrId)) {
        elementOrId.classList.add(className);
    } else {
        getElementById(elementOrId).classList.add(className);
    }
}

/**
 * @func: removeClass(elementOrId,className)
 * @desc: shortcut to remove a class from a html element
 * @param elementORstring elementOrId: The elemnt or id of the html element to add a css class to
 * @param string className: the class name to remove
 */
window.removeClass = function (elementOrId, className) {
    if (isElement(elementOrId)) {
        elementOrId.classList.remove(className);
    } else {
        log("elementOrId =" + elementOrId);
        log("className =" + className);
        getElementById(elementOrId).classList.remove(className);
    }
}


/**
 * @function: hasClass(elementOrId, cls)
 * @desc: Check to see if an element has a class attached to it
 * @param string elementOrId: The elemnt or id of the html element 
 * @param string cls: class to look for
 */
window.hasClass = function(elementOrId, cls) {
    if (isElement(elementOrId)) {
        return elementOrId.classList.contains(cls);
    } else {
        return getElementById(elementOrId).classList.contains(cls);
    }
}
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #







// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// DEBUG
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

/**
 * @function: AFTC.log{}
 * @desc: shortcut for console.log with capabilities to log nice arrays, objects and to html elements via innerHTML 
 * @param: boolean enabled: sets window.log to enabled or disabled
 * @alias: trace
 */

AFTC.log = {
    enabled: true
};
AFTC.logTo = {
    enabled: false,
    element: false
};
/**
 * @function: log(input)
 * @desc: Shortcut for console.log with capabilities to log nice arrays, objects and to html elements via innerHTML 
 * ````
 * log("Hello World");
 * log("a = " + a);
 * log("myVar1 = " + myVar1 + "  myVar2 = " + myVar2);
 * log(MyObject);
 * log(MyClass);
 * ````
 * @param * input: what you want to console.log
 * @alias: trace
 */
window.log = function (arg) {
    if (console) {
        if (AFTC.log.enabled) {
            if (typeof (arg) == "undefined") {
                console.error("AFTC.LOG(arg) ERROR: Your log variable (arg) is \"undefined\"!");
            } else {
                console.log(arg);
            }
            if (isElement(AFTC.logTo.element) && AFTC.logTo.enabled) {
                if (typeof (arg) == "object") {
                    AFTC.logTo.element.innerHTML += "[Object]<br>";
                    for (var key in arg) {
                        AFTC.logTo.element.innerHTML += ("&nbsp;&nbsp;&nbsp;&nbsp;" + key + " = " + arg[key] + "<br>");
                    }
                } else {
                    AFTC.logTo.element.innerHTML += (arg + "<br>");
                }

            }
        }
    }
}
window.trace = function (arg) {
    log(arg);
}



/**
 * @function: logEnable()
 * @desc: Enables log()
 */
window.logEnable = function () {
    AFTC.log.enabled = true;
}


/**
 * @function: logDisable()
 * @desc: Disable log()
 */
window.logDisable = function () {
    AFTC.log.enabled = false;
}




/**
 * @func: configLog({options})
 * @desc: Configuration function for logTo() autologging see examples folder on usage
 * @param string autoLogTo: html element id to log to
 * @param boolean autoLogEnable: enable auto log
 * @param boolean enableAutoLog: enable auto log
 * @param boolean autoLogDisable: disable auto log
 * @param boolean disableAutoLog: disable auto log
 */
window.configLog = function () {
    // Command functions (multiple commands may run the same function)
    var autoLogTo = function (arg) {
        var element = getElementById(arg);
        if (isElement(element)) {
            AFTC.logTo.element = element;
            AFTC.logTo.enabled = true;
        } else {

        }
    }
    var autoLogEnable = function (value) {
        if (isBoolean(value)) {
            AFTC.logTo.enabled = value;
        }
    }
    var autoLogDisable = function (value) {
        if (isBoolean(value)) {
            AFTC.logTo.enabled = !value;
        }
    }


    // Process arguments
    if (arguments[0] && typeof (arguments[0]) == "object") {
        for (var key in arguments[0]) {
            var value = arguments[0][key];

            switch (key) {
                case "autoLogTo":
                    autoLogTo(value);
                    break;
                case "autoLogEnable":
                    autoLogEnable(value);
                    break;
                case "enableAutoLog":
                    autoLogEnable(value);
                    break;
                case "autoLogDisable":
                    autoLogDisable(value);
                    break;
                case "disableAutoLog":
                    autoLogDisable(value);
                    break;
                default:
                    console.error("AFTC.js > configLog({autoLogTo:elementId}): Usage error, unknown command [" + key + "]!");
                    break;
            }

        }
    }
}



/**
 * @function: logTo(elementId,str)
 * @desc: A console.log alternative that will output to a html element and the console at the same time
 * ````
 * logTo("message","Hello World!");
 * ````
 * @param string elementId: elementId to output to
 * @param string str: what innerHTML will be set to
 * @param bool cls: clear before appending html string
 */
window.logTo = function (elementId, str, cls) {
    var element = getElementById(elementId);
    log(str);
    if (element) {
        if (cls == undefined){
            cls = false;
        }
        if (cls){
            element.innerHTML = (str + "<br>");
        } else {
            element.innerHTML += (str + "<br>");
        }
    }
}


/**
 * @function: logObjTo(elementId,obj,appendOrPrepend)
 * @desc: A console.log alternative that will output an object to a html element and the console nicely formatted at the same time
 * @param string elementId: html element id to output to
 * @param object obj: the object to debug output
 * @param boolean optional append: append text or prepend text
 * @return:
 */
window.logObjTo = function (elementId, obj, append) {
    var element = getElementById(elementId);
    if (!element) {
        throw ("AFTC.JS > logObjTo(elementId,obj): Usage error. Can't find elementId of [" + elementId + "] on the dom!");
    }

    var msg = "Logging object:<br>\n";
    for (var key in obj) {
        msg += "&nbsp;&nbsp;&nbsp;&nbsp;" + key + " = " + obj[key] + "<br>\n";
    }

    if (!append) {
        append = true;
    }

    if (append) {
        var oldContent = element.innerHTML;
        element.innerHTML = oldContent + "<br>" + msg;
    } else {
        var oldContent = element.innerHTML;
        element.innerHTML = msg + "<br>" + oldContent;
    }
}


/**
 * @function: openDebugWindow(html)
 * @desc: open a popup window with the html you wish to display in it
 * @param dataType html: the html you wish to display in the popup window
 * @return:
 * @alias: stringToWindow
 */
window.openDebugWindow = function (html) {
    var w = window.open('debug', 'debug', 'width=1200,height=400,resizeable,scrollbars');
    w.document.title = "Debug";
    w.document.write("<style>body {width:100%;}</style>");
    w.document.write("<div style='display:block;width:98%;-ms-word-wrap:break-word ;word-wrap:break-word;border:1px solid #000000;'>" + html + "</div>");
    //w.document.write("<div style='width:100%'>" + str + "</div>");
    w.document.close();
}
window.stringToWindow = function (html) {
    openDebugWindow(html);
}


/**
 * @function: setHTML(elementOrId,html);
 * @desc: quick shortcut for outputting html to an element
 * ````
 * setHTML("header","Welcome");
 * // or
 * var myElement = getElementById("header");
 * setHTML(myElement,"Welcome!");
 * ````
 * @param dataType elementOrId: the element or the element id you wish to set the html of
 * @param dataType html: the html string to insert into your element
 * @return:
 * @alias: html
 */
window.setHTML = function (elementOrId, str) {
    var element;
    if (typeof (elementOrId) == "string") {
        element = getElementById(elementOrId);
    }
    if (isElement(element)) {
        element.innerHTML = str;
    } else {
        return "unable to retrieve element from [" + elementOrId + "]";
    }
}
window.html = function (element, str) { window.setHTML(element, str); }
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #










// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// Array functions
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
/**
 * @function: arrayRemoveIndex(arr,index)
 * @desc: remove a specified index from an array
 * @param array arr: the array you wish to remove an index on
 * @param number index: the array index you wish to remove
 * @return: array
 */
window.arrayRemoveIndex = function (array, index) {
    return array.splice(index);
}

/**
 * @function: isStringInArray(needle,haystack)
 * @desc: Check to see if a string is in an array
 * @param string needle: the string your looking for
 * @param array haystack: the array you wish to search
 */
window.isStringInArray = function (needle, haystack) {
    return (new RegExp('(' + haystack.join('|').replace(/\./g, '\\.') + ')$')).test(needle);
}

/**
 * @function: arrayContains(haystack,needle)
 * @desc: Check to see if your array contains something you want to find
 * @param array arr: the array you wish to search
 * @param string needle: what you want to find
 */
window.arrayContains = function (haystack, needle) {
    if (haystack.indexOf(needle) > -1) { return true; } else { return false; }
}

/**
 * @function: arrayRemove(arr,item)
 * @desc: removes an item from an array
 * @param array arr: the array you wish to search and remove from
 * @param string item:  index at which a given element can be found
 * @alias: arrayRemoveItem
 */
window.arrayRemove = function (arr, item) {
    if (!window.arrayContains(item)) { return this; }
    return arr.splice(arr.indexOf(item), 1);
}
window.arrayRemoveItem = function (arr, item) { return arrayRemove(arr, item); }

/**
 * @function: arrayEmpty(arr)
 * @desc: clears/empties an array for garbage collection
 * @param array arr: the array to clear / empty
 * @alias: arrayClear
 */
window.arrayEmpty = function (arr) {
    while (arr.length > 0) { arr.pop(); }
}
window.arrayClear = function (arr) { window.arrayEmpty(arr); }


/**
 * @function: getMaxFromArray(arr)
 * @desc: returns the maximum value in an array
 * @param array arr: the array you wish to find the maximum value in
 * @alias: arrayGetMax
 * @alias: arrayMax
 */
window.getMaxFromArray = function (arr) {
    return Math.max.apply(Math, arr);
}
window.arrayGetMax = function (arr) { return getMaxFromArray(arr); }
window.arrayMax = function (arr) { return getMaxFromArray(arr); }

/**
 * @function: arrayGetMin
 * @desc: returns the minimum value in an array
 * @param array arr: the array you wish to find the minimum value in
 * @alias: getMinFromArray
 * @alias: arrayMin
 */
window.arrayGetMin = function (arr) {
    return Math.min.apply(Math, arr);
}
window.getMinFromArray = function (arr) { return arrayGetMin(arr); }
window.arrayMin = function (arr) { return arrayGetMin(arr); }

/**
 * @function: arrayShuffle(arr)
 * @desc: shuffles an array using a random method out of a choice of 2
 * @param array arr: the array to shuffle
 * @alias: shuffleArray2
 * @alias: shuffleArray3
 */
window.arrayShuffle = function (arr) {
    var methodNo = getRandom(2, 3);
    log(methodNo);
    return window["arrayShuffle" + methodNo](arr);
    var fn = "arrayShuffle" + methodNo;
}
window.shuffleArray = function (arr) { return arrayShuffle(arr); }


/**
 * @function: arrayShuffle2(arr)
 * @desc: shuffles an array (method 2)
 * @param array arr: the array to shuffle
 */
window.arrayShuffle2 = function (arr) {
    var currentIndex = arr.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = arr[currentIndex];
        arr[currentIndex] = arr[randomIndex];
        arr[randomIndex] = temporaryValue;
    }

    return arr;
}

/**
 * @function: arrayShuffle3(a)
 * @desc: shuffles an array (method 2)
 * @param array a: the array to shuffle
 */
window.arrayShuffle3 = function (a) {
    var x, t, r = new Uint32Array(1);
    for (var i = 0, c = a.length - 1, m = a.length; i < c; i++ , m--) {
        crypto.getRandomValues(r);
        x = Math.floor(r / 65536 / 65536 * m) + i;
        t = a[i], a[i] = a[x], a[x] = t;
    }

    return a;
}
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #










// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// Datatype handling / Variable conversion / Type checking / isXXX / getXXX / Common equation functions
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
/**
 * @function: isAlphaNumeric(input)
 * @desc: check if an input is an alpha numerical value ([a-z],[A-Z],[0-9] only)
 * @param string||number input: variable / value you wish to check
 */
window.isAlphaNumeric = function (input) {
    return !(/\W/.test(input));
}


/**
 * @function: isElement(o)
 * @desc: checks if your variable is an element or not
 * @param * o: variable you wish to check
 */
window.isElement = function (o) {
    var answer = (
        typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
            o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string"
    );

    if (answer != true) {
        return false;
    } else {
        return true;
    }
}
/**
 * @function: isElement2(element)
 * @desc: checks to see if your vairable is an element or not
 * @param * element: the variable you wish to check
 */
window.isElement2 = function (element) {
    // works on major browsers back to IE7
    return element instanceof Element;
}
/**
 * @function: isDOM(obj)
 * @desc: checks to see if your variable is a DOM object
 * @param object obj: variable to check
 */
window.isDOM = function (obj) {
    // this works for newer browsers
    try { return obj instanceof HTMLElement; }

    // this works for older browsers
    catch (e) {
        return (typeof obj === "object") &&
            (obj.nodeType === 1) && (typeof obj.style === "object") &&
            (typeof obj.ownerDocument === "object");
    }
};
/**
 * @function: radToDeg(input)
 * @desc: converts radians to degrees
 * @param number input: the radians you wish converted to degrees
 * @alias: rad2deg
 */
window.radToDeg = function (input) {
    return input * (180 / Math.PI);
}
window.rad2deg = function (arg) { return radToDeg(arg); }


/**
 * @function: degToRad(input)
 * @desc: converts degrees to radians
 * @param number input: the value you wish converted to radians
 * @alias: deg2rad
 */
window.degToRad = function (input) {
    return input * (Math.PI / 180);
}
window.deg2rad = function (arg) { return degToRad(arg); }


/**
 * @function: boolToString(bool)
 * @desc: converts boolean to a string of true or false
 * @param boolean bool: the boolean you wish to convert
 */
window.boolToString = function (bool) {

    if (!bool || bool == undefined || typeof (bool) != "boolean") {
        console.log("AFTC.js: Conversion.js: boolToString(str): Error - input is not a boolean!");
        return "error";
    }

    if (bool) {
        return "true";
    } else {
        return "false";
    }
}




/**
 * @function: boolToYesNo(bool)
 * @desc: converts a boolean to yes or no
 * @param boolean bool: the boolean you wish to convert
 */
window.boolToYesNo = function (bool) {

    if (!bool || bool == undefined || typeof (bool) != "boolean") {
        console.log("AFTC.js: Conversion.js: boolToString(str): Error - input is not a boolean!");
        return "error";
    }

    if (bool) {
        return "yes";
    } else {
        return "no";
    }
}


/**
 * @function: stringToBool(str)
 * @desc: converts a string to a boolean (y,yes,"1",no etc)
 * @param string str: the string you wish to convert
 */
window.stringToBool = function (str) {

    if (!str || str == undefined || typeof (str) != "string") {
        console.log("AFTC.js: Conversion.js: stringToBoolean(str): Error - input str is not valid!");
        return false;
    }

    switch (str.toLowerCase()) {
        case "y":
            return true;
            break;
        case "yes":
            return true;
            break;
        case "1":
            return true;
            break;
        case "true":
            return true;
            break;
        case "y":
            return true;
            break;
        default:
            return false;
            break;
    }
}



/**
 * @function: getBooleanFrom(input)
 * @desc: converts an input to a boolean
 * @param * input: the variable you wish to convert to a boolean
 */
window.getBooleanFrom = function (input) {
    if (input == null || input == "" || !input) {
        return false;
    }

    if (typeof (input) == "string") {
        return stringToBool(input);
    }

    if (typeof (input) == "number") {
        if (input <= 0) {
            return false;
        } else {
            return true;
        }
    }
}


/**
 * @function: isBoolean(input)
 * @desc: checks if a variable is a boolean
 * @param * input: variable to check
 * @alias: isBool
 */
window.isBoolean = function (input) {
    if (typeof (input) == "boolean") {
        return true;
    } else {
        return false;
    }
}
window.isBool = function (input) { return isBoolean(input); }


/**
 * @function: isNumeric(n)
 * @desc: check if variable is numeric
 * @param * n: variable to check
 * @alias: isNumber
 */
window.isNumeric = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
window.isNumber = function (n) { return isNumeric(n); }



/**
 * @function: isArray(arr)
 * @desc: check if variable is an array
 * @param * arr: variable to check
 */
window.isArray = function (arr) {
    return !!arr && arr.constructor === Array;
    //return arr.constructor == Array;
}

/**
 * @function: parseArrayToFloat(arr)
 * @desc: parses all values in array to float
 * @param array arr: array to process
 * @alias: arrayToFloat
 */
window.parseArrayToFloat = function(arr){
    for(var i=0; i < arr.length; i++){
        arr[i] = parseFloat(arr[i]);
    }
    return arr;
}
window.arrayToFloat = function(arr){ return parseArrayToFloat(arr); }

/**
 * @function:parseArrayToInt(arr)
 * @desc: parses all values in array to float
 * @param array arr: array to process
 * @alias: arrayToInt
 */
window.parseArrayToInt = function(arr){
    for(var i=0; i < arr.length; i++){
        arr[i] = parseInt(arr[i]);
    }
    return arr;
}
window.arrayToInt = function(arr){ return parseArrayToInt(arr); }



/**
 * @function:convertToArray(v)
 * @desc: takes an input and returns it as index[0] of an array
 * @param & v: value to insert into array
 * @alias: valueToArray
 */
window.convertToArray = function(v){
    var a = [];
    a[0] = v;
    return a;
}
window.valueToArray = function(v){ return convertToArray(v); }


/**
 * @function: getFunctionName(fn)
 * @desc: tries to get the function name of a suppled function
 * @param function fn: the function wish to get the name of
 */
function getFunctionName(fn) {
    var name = fn.toString();
    var reg = /function ([^\(]*)/;
    return reg.exec(name)[1];
};

// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
















// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// Random generators (small ones)
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
/**
 * @function: getRandomInt(min,max)
 * @desc: returns a random number / int betwen your specified min and max values
 * @param number min: the minimum your random number is allowed to go
 * @param number max: the maximum your random number is allowed to go
 * @alias: getRandom
 */
window.getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
window.getRandom = function (min, max) {
    return getRandomInt(min, max);
}


/**
 * @function: randomString(length)
 * @desc: get a random string of a specified length
 * @param number length: the length of the string you wish to generate
 * @alias: getRandomString
 */
window.randomString = function (length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < length; i++){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}
window.getRandomString = function (len) {
    return randomString(len);
}


/**
 * @function: getUniqueId()
 * @desc: Generates a random id
 * @alias: getUID
 * @alias: generateRandomId
 * @alias: generateUID
 */
window.getUniqueId = function(){
    return randomString(5) + Math.random().toString(36).substr(2, 8);
}
window.getUID = function(){ return getUniqueId(); }
window.generateRandomId = function(){ return getUniqueId(); }
window.generateUID = function(){ return getUniqueId(); }


/**
 * @function: getArrayOfRandomNumbers(arraySize,min,max)
 * @desc: generate an array of random number between your max and min values
 * @param number arraySize: the number of random numbers to generate also the array size that will be returned
 * @param number min: the minimum your random number is allowed to be
 * @param number max: the maximum your random number is allowed to be
 */
window.getArrayOfRandomNumbers = function (arraySize, min, max) {
    var arr = [];
    for (var i = 0; i < arraySize; i++) {
        arr[i] = getRandom(min, max);
    }
    return arr;
}


/**
 * @function: getArrayOfRandomStrings(arraySize,strLength)
 * @desc: generate an array of random string of a specified length
 * @param number arraySize: the number of random strings to generate also the array size that will be returned
 * @param number strLength: the length of the strings to be generated
 */
window.getArrayOfRandomStrings = function (arraySize, strLength) {
    var arr = [];
    for (var i = 0; i < arraySize; i++) {
        arr[i] = getRandomString(strLength);
    }
    return arr;
}



/**
 * @function: guid()
 * @desc: generates a guid
 * @alias: getGUID
 */
window.guid = function () {
    function Amiga() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return Amiga() + Amiga() + '-' + Amiga() + '-' + Amiga() + '-' +
        Amiga() + '-' + Amiga() + Amiga() + Amiga();
}
window.getGUID = function () { return guid(); }

// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #










// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// Misc features (small ones only)
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
/**
 * @function: redirect(url)
 * @desc: no more typing self.location.href, just use redirect(url)
 * @param string url: the url you wish to redirect to
 */
window.redirect = function (url) {
    self.location.href = url;
};


/**
 * @function: AFTC.Benchmark()
 * @desc: Quick and easy benchmarking, see examples benchmark.htm for usage
 * ````
 * AFTC.Benchmark().start();
 * // do you stuff
 * AFTC.Benchmark().end();
 * log( AFTC.Benchmark().getTime() );
 * ````
 * @function start: start benchmark
 * @function stop: stop benchmark
 * @function getTime: return benchmark result
 */
AFTC.Benchmark = function () {
    var params = {
        start: 0,
        end: 0,
        time: 0
    }

    return {
        start: function () {
            params.start = new Date();
        },
        stop: function () {
            params.end = new Date();
            params.time = params.end.getTime() - params.start.getTime();
            return params.time;
        },
        getTime: function () {
            return params.time;
        }
    }
}


/**
 * @function: hide(element,classListToRemove,classListToAdd)
 * @desc: hides a html element, can also add or remove any amount of classes on element hide at the same time
 * @param element||string element: the element or the string id of the element you wish to hide
 * @param array classListToRemoveOnHide: string of class to remove or array of string classes to remove on hide
 * @param array classListToAddOnHide: string of class to remove or array of string classes to add on hide
 */
window.hide = function (element, classListToRemoveOnHide, classListToAddOnHide) {
    var elementId = false;
    if (typeof (element) == "string") {
        elementId = element;
        element = getElementById(elementId);
    } else if (!isElement(element)) {
        console.error("AFTC.js > show({element}): Usage error, element must be string ID of element or the element itself");
        return false;
    }

    if (!element || element == null || element == undefined) {
        console.error("AFTC.js > show({element}): Unable to find element of id [" + elementId + "]");
        return false;
    }

    // REMOVE
    if (isArray(classListToRemoveOnHide)) {
        for (var key in classListToRemoveOnHide) {
            var className = classListToRemoveOnHide[key];
            // log("removing class [" + className + "]");
            removeClass(element, className);
        }
    } else if (typeof (classListToRemoveOnHide) == "string") {
        removeClass(element, classListToRemoveOnHide);
        // log("removing class [" + className + "]");
    }

    // ADD
    if (isArray(classListToAddOnHide)) {
        for (var key in classListToAddOnHide) {
            var className = classListToAddOnHide[key];
            // log("adding class [" + className + "]");
            addClass(element, className);
        }
    } else if (typeof (classListToAddOnHide) == "string") {
        addClass(element, classListToAddOnHide);
        // log("adding class [" + className + "]");
    }


    var oldDisplayValue = element.getAttribute("old-display-prop");
    //log("oldDisplayValue = " + oldDisplayValue);
    if (!oldDisplayValue || oldDisplayValue == "" || oldDisplayValue.length < 1) {
        // log("no old value going to assume display is block");
        element.style.display = 'block';
    }

    element.style.display = 'none';
}


/**
 * @function: show(element,classListToRemove,classListToSAdd)
 * @desc: show a html element, can also add or remove any amount of classes on element show at the same time
 * @param element||string element: the element or the string id of the element you wish to hide
 * @param array classListToRemoveOnShow: string of class to remove or array of string classes to remove on show
 * @param array classListToAddOnShow: string of class to remove or array of string classes to add on show
 */
window.show = function (element, classListToRemoveOnShow, classListToAddOnShow) {
    // log("window.show(" + element + ")");
    var elementId = false;
    if (typeof (element) == "string") {
        elementId = element;
        element = getElementById(elementId);
    } else if (!isElement(element)) {
        console.error("AFTC.js > show({element}): Usage error, element must be string ID of element or the element itself");
        return false;
    }

    if (!element || element == null || element == undefined) {
        console.error("AFTC.js > show({element}): Unable to find element of id [" + elementId + "]");
        return false;
    }

    // REMOVE
    if (isArray(classListToRemoveOnShow)) {
        for (var key in classListToRemoveOnShow) {
            var className = classListToRemoveOnShow[key];
            // log("removing class [" + className + "]");
            removeClass(element, className);
        }
    } else if (typeof (classListToRemoveOnShow) == "string") {
        removeClass(element, classListToRemoveOnShow);
        // log("removing class [" + className + "]");
    }

    // ADD
    if (isArray(classListToAddOnShow)) {
        for (var key in classListToAddOnShow) {
            var className = classListToAddOnShow[key];
            // log("adding class [" + className + "]");
            addClass(element, className);
        }
    } else if (typeof (classListToAddOnShow) == "string") {
        addClass(element, classListToAddOnShow);
        // log("adding class [" + className + "]");
    }


    var oldDisplayValue = element.getAttribute("old-display-prop");
    //log("oldDisplayValue = " + oldDisplayValue);
    if (!oldDisplayValue || oldDisplayValue == "" || oldDisplayValue.length < 1) {
        // log("no old value going to assume display is block");
        element.style.display = 'block';
    } else {
        element.style.display = oldDisplayValue;
    }


}

// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
/**
 * @function: cleanJSONString(s)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 */
window.generateUniqueId = function (length) {

}



/**
 * @function: cleanJSONString(s)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.cleanJSONString = function (s) {
	// preserve newlines, etc - use valid JSON
	s = s.replace(/\\n/g, "\\n")
		.replace(/\\'/g, "\\'")
		.replace(/\\"/g, '\\"')
		.replace(/\\&/g, "\\&")
		.replace(/\\r/g, "\\r")
		.replace(/\\t/g, "\\t")
		.replace(/\\b/g, "\\b")
		.replace(/\\f/g, "\\f");
	// remove non-printable and other non-valid JSON chars
	s = s.replace(/[\u0000-\u0019]+/g, "");
	return s;
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


/**
 * @function: escapeHTML(text)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.escapeHTML = function (text) {
	var replacements = {
		"<": "&lt;",
		">": "&gt;",
		"&": "&amp;",
		"\"": "&quot;"
	};
	return text.replace(/[<>&"]/g, function (character) {
		return replacements[character];
	});
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



/**
 * @function: trimStringLength(input, length)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.trimStringLength = function (input, length) {
	return input.substring(0, length);
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



/**
 * @function: getFileExtension(str)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.getFileExtension = function (str) {
	var ext = str.split('.').pop();
	return str;
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



/**
 * @function: getFileExtension2(input)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.getFileExtension2 = function (input) {
	return input.slice((input.lastIndexOf(".") - 1 >>> 0) + 2);
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




/**
 * @function: getLastPartOfUrl()
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.getLastPartOfUrl = function () {
	var url = window.location.href;
	var part = url.substring(url.lastIndexOf('/') + 1);
	return part;
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



/**
 * @function: removeFileFromPath(path)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.removeFileFromPath = function (path) {
	//var pa = '/this/is/a/folder/aFile.txt';
	var r = /[^\/]*$/;
	path = path.replace(r, '');
	return path;
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


/**
 * @function: getAnchorFromUrl(url)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.getAnchorFromUrl = function (url) {
	return url.slice(url.lastIndexOf('#') + 1);
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -





/**
 * @function: String.prototype.startsWith(str)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
// es6 now supports the startsWith() and endsWith() (This is for pre ES6 support)
if (typeof String.prototype.startsWith != 'function') {
	String.prototype.startsWith = function (str) {
		return this.match(new RegExp("^" + str));
	};
}

/**
 * @function: String.prototype.endsWith(str)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
// es6 now supports the startsWith() and endsWith() (This is for pre ES6 support)
if (typeof String.prototype.endsWith != 'function') {
	String.prototype.endsWith = function (str) {
		return this.match(new RegExp(str + "$"));
	};
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


/**
 * @function: getStringBetween(str,start,end)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.getStringBetween = function(str,start,end){
	return str.split(start).pop().split(end).shift().trim();
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



/**
 * @function: getAllStringsBetween(str,start,end)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.getAllStringsBetween = function(str,start,end){
	//return str.match(new RegExp(start + "(.*)" + end));
	// var regExString = new RegExp("(?:"+start+")(.*?)(?:"+end+")", "ig"); //set ig flag for global search and case insensitive
	// return regExString.exec(str);
	for(var i=0; i<str.length; ++i) {
		log(str[i]);
	}
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




/*
window.getAllStringsBetween = function(str,start,end){
	var arr = str.split(/[:;]/);
}


test.match(new RegExp(firstvariable + "(.*)" + secondvariable));

or

var regExString = new RegExp("(?:"+firstvariable+")(.*?)(?:"+secondvariable+")", "ig"); //set ig flag for global search and case insensitive

var testRE = regExString.exec("My cow always gives milk.");
if (testRE && testRE.length > 1) //RegEx has found something and has more than one entry.
{  
    alert(testRE[1]); //is the matched group if found
}
*/






/**
 * @function: getWeightedRandom(odds, iterations)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string odds: xxxxxxxxxxxxxxxxxxxx
 * @param string iterations: xxxxxxxxxxxxxxxxxxxx
 */
window.getWeightedRandom = function (odds, iterations) {
    if (!odds) {
        odds = [
            0.68, // 0
            0.69, // 1
            0.698, // 2
            0.6909, // 3
            0.68, // 4
            0.58, // 5
            0.57, // 6
            0.56, // 7
            0.4, // 8
            0.3, // 9
        ];
    }
    var weights = [];
    var r = 0;
    var iMax = 0;
    var wMax = 0;

    for (var i in odds) {
        if (!weights[i]) {
            weights[i] = 0;
        }

        for (var x = 0; x < iterations; x++) {
            r = Math.random();
            //log(r.toFixed(3) + "   " + odds[i].toFixed(3));
            if (r <= odds[i]) {
                weights[i] += odds[i];
            }
        }

        if (weights[i] > wMax) {
            wMax = weights[i];
            iMax = i;
        }
    }

    //log(weights);
    //log("wMax = " + wMax + "   iMax = " + iMax);
    return iMax;
};
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * @function: getDaysBetween(startDateTime, endDateTime)
 * @desc: Gets the number of whole days between a start and end date
 * @param DateTime startDateTime: start date
 * @param DateTime endDateTime: end date
 * @alias: getNoOfDaysBetween
 * @alias: getDaysBetweenDates
 */
window.getDaysBetween = function(startDateTime, endDateTime) {
	var msPerDay = 8.64e7;
	// Copy dates so don't mess them up
	var sd = new Date(startDateTime);
	var ed = new Date(endDateTime);
	// Set to noon - avoid DST errors
	sd.setHours(12, 0, 0);
	ed.setHours(12, 0, 0);
	// Round to remove daylight saving errors
	return Math.round((ed - sd) / msPerDay);
}
window.getNoOfDaysBetween = function(start, end){ return getDaysBetween(start, end); }
window.getDaysBetweenDates = function(start, end){ return getDaysBetween(start, end); }




/**
 * @function: getUkDateFromDbDateTime(input)
 * @desc: get a uk date from a mysql db date value
 * @param MySQLDateTimeString input: MySQL DB DateTime
 */
window.getUkDateFromDbDateTime = function (input) {
	// "2016-04-08 21:11:59" to UK date
	if (input == "" || input == null) {
		return "no input";
	}
	var DateTime = input.split(" ");
	var DateParts = DateTime[0].split("-");
	var UKDate = DateParts[2] + "/" + DateParts[1] + "/" + DateParts[0];
	return UKDate;
}

/**
 * @function: getUkDateTimeFromDbDateTime(input)
 * @desc: get a uk date from a mysql db date time value
 * @param MySQLDateTimeString input: MySQL DB DateTime
 */
window.getUkDateTimeFromDbDateTime = function (input) {
	// "2016-04-08 21:11:59" to UK date time
	var DateTime = input.split(" ");
	var DateParts = DateTime[0].split("-");
	var TimeParts = DateTime[1].split(":");
	var UKDate = DateParts[2] + "/" + DateParts[1] + "/" + DateParts[0];
	var Time = TimeParts[0] + ":" + TimeParts[1];
	return (UKDate + " " + Time);
}

/**
 * @function: getSQLDateTime()
 * @desc: gets the date time now for sql insert
 */
window.getSQLDateTime = function () {
	var now = new Date();
	var year = now.getFullYear();
	var month = now.getMonth() + 1;
	var day = now.getDate();
	var hour = now.getHours();
	var minute = now.getMinutes();
	var second = now.getSeconds();
	if (month.toString().length == 1) {
		var month = '0' + month;
	}
	if (day.toString().length == 1) {
		var day = '0' + day;
	}
	if (hour.toString().length == 1) {
		var hour = '0' + hour;
	}
	if (minute.toString().length == 1) {
		var minute = '0' + minute;
	}
	if (second.toString().length == 1) {
		var second = '0' + second;
	}
	var dateTime = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
	return dateTime;
}



/**
 * @function: getDateTime(local)
 * @desc: gets the date time at a specified local
 * @param string optional local: options are us or do not supply for en-gb
 */
window.getDateTime = function (local) {
	// NOTE: MySQL DB DateTime format: "2016-04-08 21:11:59"
	var currentdate = new Date(),
		datetime = "";

	if (!local) {
		local = "en-GB";
	}

	switch (local.toLowerCase()) {
		case "db":
			datetime = getSQLDateTime();
			break;
		case "us":
			datetime = currentdate.toLocaleString('en-US', {
				hour12: false,
				month: "numeric",
				day: "numeric",
				year: "numeric",
				hour: "numeric",
				minute: "numeric",
				second: "numeric"
			});
			datetime = datetime.replace(",", "");
			break;
		default:
			datetime = currentdate.toLocaleString('en-GB');
			datetime = datetime.replace(",", "");
			break;
	}

	return datetime;
}



/**
 * @function: xxxxxx(xxx)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.setCookie = function (name, value) {
	//document.cookie = name + "=" + value + "; expires=Thu, 18 Dec 2013 12:00:00 GMT";
	//.cookie(name, value, {expires:365,path:'/sfsow'});
	var expires = new Date();
	expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
	document.cookie = name + '=' + value + ';expires=' + expires.toUTCString();
}
// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -


/**
 * @function: getCookie(name)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.getCookie = function (name) {
	//return .cookie(name);
	var keyValue = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|)');
	return keyValue ? keyValue[2] : null;
}
// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -


/**
 * @function: xxxxxx(xxx)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.validateEmail = function (email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}


/**
 * @function: xxxxxx(xxx)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.isValidEmail = function (email) {
	return validateEmail(email);
}




/**
 * @function: generateNoise(canvasId, opacity)
 * @desc: Generate noise into a canvas element (ensure you set canvase dimensions)
 * @param string canvasId: Canvas element id to work with
 * @param number opacity: opacity of noise
 */
window.generateNoise = function(canvasId, opacity) {
	var canvas = document.getElementById(canvasId),
		ctx = canvas.getContext('2d'),
		x, y,
		number,
		opacity = opacity || .2;

	for (x = 0; x < canvas.width; x++) {
		for (y = 0; y < canvas.height; y++) {
			number = Math.floor(Math.random() * 60);

			ctx.fillStyle = "rgba(" + number + "," + number + "," + number + "," + opacity + ")";
			ctx.fillRect(x, y, 1, 1);
		}
	}

	//document.body.style.backgroundImage = "url(" + canvas.toDataURL("image/png") + ")";
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



// AFTC init
var AFTC = AFTC || {}

/**
 * @type: class
 * @name: AFTC.Animate()
 * @version: 2.3.14
 * @requires: base.js
 * @function: AFTC.Animate(elementId, onComplete)
 * @desc: Quick and easy css animation for nearly every css element style
 * ````
 * var anim1 = new AFTC.Animate("box1", onCompleteFunction);
 * anim1.wait(2); // wait in 2 seconds
 * anim1.set("backgroundColor","RGBA(255,255,255,0.5)"); // sets background color to white 50% opacity
 * anim1.anim("fontColor","RGBA(255,0,0,1)",1.5); // animates the font color to red over 1.5 seconds
 * anim1.set(["html","paddingLeft",left"],["hello","10px","100px"],[1,2,3]); // sets innerHTML, padding-left and left position over 1, 2 and 3 seconds
 * ````
 * @link: see usage example in test/animation.htm
 */
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
AFTC.Animate = function (elementId, onComplete) {
    // log("AFTC.Animate()");

    // Var defs
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    var params = {
        error: {
            error: false,
            msg: ""
        },
        elementId: false,
        element: false,
        onComplete: false,
        stack: [],
        stackCount: 0,
        active: {
            stackIndex: false,
            defIndex: false,
            definition: false,
        },
        state: {
            started: false,
            stopped: false
        },
        onComplete: false
    };

    var StackVo = function () {
        this.type = ""; // set || anim || delay
        this.definitions = []; // Array of DefinitionVo's
        this.uid = 0;
    }

    var DelayVo = function () {
        this.duration = false;
        this.start = false;
        this.end = false;
    }

    var DefinitionVo = function () {
        this.style = "";
        this.valid = true;
        this.start = {
            v: false,
            rgba: false,
            r: false,
            g: false,
            b: false,
            a: false,
            suffix: false
        };
        this.end = {
            v: false,
            rgba: false,
            r: false,
            g: false,
            b: false,
            a: false,
            suffix: false
        };
        this.range = {
            v: false,
            r: false,
            g: false,
            b: false,
            a: false
        };
        this.step = {
            v: false,
            r: false,
            g: false,
            b: false,
            a: false
        };
        this.time = {
            start: false,
            end: false,
            duration: false
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    // Constructor
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function init() {
        // log("AFTC.Animate.init()");

        // var ini
        params.elementId = elementId;
        params.onComplete = onComplete;

        // Get element and check exists
        params.element = getElementById(elementId);
        if (!isElement(params.element)) {
            params.error.msg = "AFTC.js > AFTC.Animate(): Usage error, unable to locate an element with id [" + params.elementId + "] on the DOM!";
            throw (params.error.msg);
            return;
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function addStackItem(type, style, value, duration) {
        // log("- - - - - - - - - - - - - - - - - - - - - - - - -");
        // log("AFTC.Animate.addStackItem(type:" + type + ", style, value, duration)");
        type = String(type).toLowerCase();
        if (type != "set" && type != "anim" && type != "delay") {
            params.error.flag = true;
            params.error.msg = "AFTC.js > AFTC.Animate.addStackItem(): Error - unhandled type of [" + type + "]";
            throw (params.error.msg);
            return;
        }

        var isStyleArray = isArray(style);
        var isValueArray = isArray(value);
        var isDurationArray = isArray(duration);
        if (isStyleArray != isValueArray && isStyleArray != isDurationArray) {
            params.error.flag = true;
            params.error.msg = "AFTC.js > AFTC.Animate.addStackItem(): Error - please ensure all your params are either arrays or single values";
            throw (params.error.msg);
            return;
        }
        if (isStyleArray && isValueArray && isDurationArray) {
            if (style.length != value.length && style.length != duration.length) {
                params.error.flag = true;
                params.error.msg = "AFTC.js > AFTC.Animate.addStackItem(): Error - please ensure all your params are arrays are the same size";
                throw (params.error.msg);
                return;
            }
        }

        // If params are single value then push them into arrays for array processing
        if (!isStyleArray && !isValueArray && !isDurationArray) {
            style = convertToArray(style);
            value = convertToArray(value);
            duration = convertToArray(duration);
        }

        // Create new StackVo() for strack of set||anim|delay configurations
        var svo = new StackVo();
        svo.type = type;
        //svo.uid = "aftcAnimId" + Math.random().toString(36).substr(2, 9);
        //svo.uid = "stk" + Math.round( Math.random()*9999999 );
        params.stackCount++;
        svo.uid = "stk" + params.stackCount;

        if (type == "anim" || type == "set") {
            // log("ADD: " + type + "  STYLE: " + style);
            for (var i = 0; i < style.length; i++) {
                var dvo = new DefinitionVo();
                dvo.style = style[i];
                dvo.time.duration = parseFloat(duration) * 1000;
                // NOTE: Can't set start value here as it might change, work it out before run
                // Process endValue
                var endValue = value[i];
                if (isRGB(endValue)) {
                    var rgba = getRGBAArray(endValue);
                    dvo.end.r = rgba[0];
                    dvo.end.g = rgba[1];
                    dvo.end.b = rgba[2];
                    dvo.end.a = rgba[3];
                    dvo.end.rgba = true;
                    dvo.end.suffix = getSuffix(endValue);
                } else {
                    if (dvo.style.toLowerCase() == "html") {
                        dvo.end.v = endValue;
                    } else {
                        dvo.end.v = parseFloat(endValue);
                        if (isNaN(dvo.end.v)) {
                            dvo.end.v = endValue;
                        }
                    }
                    dvo.end.rgba = false;
                    dvo.end.suffix = getSuffix(endValue);
                }
                // log(dvo);
                // log("--");
                svo.definitions.push(dvo);
            }
            params.stack.push(svo);
        } else if (type == "delay") {
            // log("ADD Delay");
            // Set times
            var dvo = new DelayVo();
            dvo.duration = parseFloat(duration) * 1000;
            svo.definitions.push(dvo);
            params.stack.push(svo);
        }
        // log(svo);
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -







    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function start() {
        // log("AFTC.Animate.start()");
        params.state.started = true;
        params.state.stopped = false;
        params.active.stackIndex = 0;
        params.active.defIndex = 0;
        selectStackRunCount = 0;
        selectStack();
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    var selectStackRunLimit = 2000;
    var selectStackRunCount = 0;


    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function selectStack() {
        // log("- - - - - - - - - - - - - - - - - - - - - - - - -");
        if (params.active.stackIndex >= (params.stack.length)) {
            // log("AFTC.Animate.selectStack(): Stack complete!");
            stackCompletehandler();
            return;
        } else {
            if (selectStackRunCount >= selectStackRunLimit) {
                console.error("AFTC.Animate.selectStack(): ERROR: Run count limit triggered");
                return;
            } else {
                selectStackRunCount++;
                // log("AFTC.Animate.selectStack(): Processing [" + params.active.stackIndex + "] of [" + (params.stack.length - 1) + "]");
                params.active.defIndex = 0; // reset

                var svo = params.stack[params.active.stackIndex];
                var definitions = svo.definitions;
                params.active.defIndex = 0;
                // log(svo);

                if (svo.type == "delay") {
                    var dvo = svo.definitions[0]; // DelayVo
                    if (!dvo.start) {
                        dvo.start = new Date().getTime();
                        dvo.end = dvo.start + (dvo.duration);
                    }
                    processDelay();
                } else if (svo.type == "set") {
                    processSet();
                } else if (svo.type == "anim") {
                    for (var i = 0; i < definitions.length; i++) {
                        setDefinitionValues(i);
                    }
                    processAnimRunCount = 0;
                    processAnim();
                } else {
                    log("PROCESS: ERROR - UNKNOWN type [" + svo.type + "]");
                }

            }
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    var processAnimLimit = 2000;
    var processAnimRunCount = 0;

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function processAnim() {
        if (processAnimRunCount > processAnimLimit) {
            console.error("processAnim(): RUN LIMIT REACHED!");
            return;
        }
        processAnimRunCount++;
        // log("-----");
        // log("AFTC.Animate.processAnim()")

        var svo = params.stack[params.active.stackIndex];
        var definitions = svo.definitions;
        var complete = true;

        for (var i = 0; i < definitions.length; i++) {
            var dvo = definitions[i];
            //log(dvo);
            var ct = new Date().getTime() - dvo.time.start;
            var v = 0, r = 0, g = 0, b = 0, a = 0, msg = "";
            
            // //setHTML("debug","c = " + c);
            if (ct < dvo.time.duration) {
                if (dvo.start.rgba && dvo.end.rgba) {
                    r = Math.round(dvo.start.r + (dvo.step.r * ct));
                    g = Math.round(dvo.start.g + (dvo.step.g * ct));
                    b = Math.round(dvo.start.b + (dvo.step.b * ct));
                    a = dvo.start.a + (dvo.step.a * ct);
                    v = "RGBA(" + r + "," + g + "," + b + "," + a.toFixed(2) + ")";
                    var t = "RGBA(" + dvo.end.r + "," + dvo.end.g + "," + dvo.end.b + "," + dvo.end.a.toFixed(2) + ")";
                    var c = "RGBA(" + dvo.start.r + "," + dvo.start.g + "," + dvo.start.b + "," + dvo.start.a.toFixed(2) + ")";
                    msg += "ct:" + ct + "  v:" + v + "   target:" + t + "  ";
                    msg += "  current:" + c + "  rs:" + dvo.step.r + "  ra:" + dvo.step.a;
                    // log(msg);
                    params.element.style[dvo.style] = v;
                } else {
                    v = dvo.start.v + (dvo.step.v * ct);
                    msg += "ct:" + ct + "  v:" + v + "  range:" + dvo.range.v + "  ";
                    msg += "current:" + dvo.start.v + "  target:" + dvo.end.v + "  step:" + dvo.step.v;
                    // log(msg);
                    params.element.style[dvo.style] = v + dvo.end.suffix;
                }
                complete = false;
            } else {
                if (dvo.start.rgba && dvo.end.rgba) {
                    v = "RGBA(" + dvo.end.r + "," + dvo.end.g + "," + dvo.end.b + "," + dvo.end.a.toFixed(2) + ")";
                    params.element.style[dvo.style] = v;
                } else {
                    v = dvo.end.v;
                    msg += "ct:" + ct + "  v:" + v + "  range:" + dvo.range.v + "  ";
                    msg += "current:" + dvo.start.v + "  target:" + dvo.end.v + "  step:" + dvo.step.v;
                    // log(msg);
                    params.element.style[dvo.style] = v + dvo.end.suffix;
                }
                
            }
        }

        if (!complete){
            requestAnimationFrame(processAnim);
        } else {
            params.active.stackIndex++;
            selectStack();
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -








    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function processSet() {
        // log("-----");
        // log("AFTC.Animate.processSet()");
        var svo = params.stack[params.active.stackIndex];
        var definitions = svo.definitions;

        for (var i = 0; i < definitions.length; i++) {
            var dvo = definitions[i];
            var v;
            if (dvo.style.toLowerCase() == "html") {
                params.element.innerHTML = dvo.end.v;
            } else {
                if (dvo.end.rgba) {
                    v = "RGBA(" + dvo.end.r + "," + dvo.end.g + "," + dvo.end.b + "," + dvo.end.a + ")";
                    params.element.style[dvo.style] = v;
                } else {
                    var v = (dvo.end.v + dvo.end.suffix);
                    params.element.style[dvo.style] = v;
                }
            }
            // log("Setting style: [" + dvo.style + "] to [" + v + "]");
        }

        params.active.stackIndex++;
        params.active.defIndex = 0;
        selectStack();
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function processDelay() {
        // log("processDelay()");

        var svo = params.stack[params.active.stackIndex];
        var definitions = svo.definitions;
        var delayVo = svo.definitions[0];

        var c = new Date().getTime() - delayVo.start;
        // log(c);
        //setHTML("debug","c = " + c);
        if (c < delayVo.duration) {
            requestAnimationFrame(processDelay);
        } else {
            // log("processDelay(): COMPLETE");
            params.active.stackIndex++;
            params.active.defIndex = 0;
            selectStack();
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -








    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function stackCompletehandler() {
        // log("AFTC.Animate.stackCompletehandler()");
        if (typeof(params.onComplete) == "function") {
            params.onComplete();
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -













    // Utility functions
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function setDefinitionValues(definitionsIndex) {
        // log("AFTC.Animate.setDefinitionValues(definitionsIndex:"+definitionsIndex+")");
        var svo = params.stack[params.active.stackIndex];
        var dvo = svo.definitions[definitionsIndex];


        // Process startValue
        var startValue = getComputedStyle(params.element)[dvo.style];
        if (isRGB(startValue)) {
            var rgba = getRGBAArray(startValue);
            dvo.start.r = rgba[0];
            dvo.start.g = rgba[1];
            dvo.start.b = rgba[2];
            dvo.start.a = rgba[3];
            dvo.start.rgba = true;
            dvo.start.suffix = getSuffix(startValue);
        } else {
            dvo.start.v = parseFloat(startValue);
            dvo.start.rgba = false;
            dvo.start.suffix = getSuffix(startValue);
        }

        // Calculate ranges, times and steps
        if (svo.type == "anim") {
            if (dvo.start.rgba && dvo.end.rgba) {
                // dvo.range.r = dvo.end.r > dvo.start.r ? dvo.end.r - dvo.start.r : dvo.start.r - dvo.end.r;
                // dvo.range.g = dvo.end.g > dvo.start.g ? dvo.end.g - dvo.start.g : dvo.start.g - dvo.end.g;
                // dvo.range.b = dvo.end.b > dvo.start.b ? dvo.end.b - dvo.start.b : dvo.start.b - dvo.end.b;
                // dvo.range.a = dvo.end.a > dvo.start.a ? dvo.end.a - dvo.start.a : dvo.start.a - dvo.end.a;

                dvo.range.r = dvo.end.r - dvo.start.r;
                dvo.range.g = dvo.end.g - dvo.start.g;
                dvo.range.b = dvo.end.b - dvo.start.b;
                dvo.range.a = dvo.end.a - dvo.start.a;

                dvo.step.r = (dvo.range.r / dvo.time.duration);
                dvo.step.g = (dvo.range.g / dvo.time.duration);
                dvo.step.b = (dvo.range.b / dvo.time.duration);
                dvo.step.a = (dvo.range.a / dvo.time.duration);
            } else {
                //dvo.range.v = dvo.end.v > dvo.start.v ? dvo.end.v - dvo.start.v : dvo.start.v - dvo.end.v;
                dvo.range.v = dvo.end.v - dvo.start.v;
                dvo.step.v = (dvo.range.v / dvo.time.duration);
            }

            dvo.time.start = new Date().getTime() + 0;
            dvo.time.end = dvo.time.start + dvo.time.duration;

            // log(dvo.start);
            // log(dvo.end);
            // log(dvo.range);

            // Check start and end are valid
            if (dvo.start.rgba !== dvo.end.rgba && dvo.start.suffix !== dvo.end.suffix && set != "set") {
                params.error.flag = true;
                params.error.msg = "AFTC.js > AFTC.Animate(): Error - Unable to process set or animate for style [" + dvo.style + "] due to start and end value datatypes not being the same!\n";
                params.error.msg += "startValueIsRGB:[" + dvo.start.rgba + "]  endValueIsRGB:[" + dvo.end.rgba + "]  ";
                params.error.msg += "startSuffix:[" + dvo.start.suffix + "]  endSuffix:[" + dvo.end.suffix + "]";
                console.error(params.error.msg);
                dvo.valid = false;
                return;
            }
        }
    }


    function getRGBAArray(input) {
        var input = String(input).toLowerCase();
        input = input.replace(" ", "");
        input = input.replace("rgba", "");
        input = input.replace("rgb", "");
        input = input.replace("(", "");
        input = input.replace(")", "");
        parts = input.split(",");
        for (var i = 0; i < parts.length; i++) {
            parts[i] = parseFloat(parts[i]);
        }
        if (parts.length == 3) {
            parts.push(1);
        }
        return parts;
    }

    function setStyleDuration(duration) {
        // log("setStyleDuration()");
        // params.element.style.transition = "all " + duration + "s";
        params.element.style.transitionDuration = duration + "s";
        params.element.style.webkitTransitionDuration = duration + "s";
        params.element.style.mozTransitionDuration = duration + "s";
        params.element.style.oTransitionDuration = duration + "s";
        params.element.style.msTransitionDuration = duration + "s";
    }

    function removeStyleDuration() {
        // log("removeStyleDuration()");
        // params.element.style.removeProperty("transition");
        setStyleDuration(0);
        params.element.style.removeProperty("transitionDuration");
        params.element.style.removeProperty("webkitTransitionDuration");
        params.element.style.removeProperty("mozTransitionDuration");
        params.element.style.removeProperty("oTransitionDuration");
        params.element.style.removeProperty("msTransitionDuration");
    }

    function validateDuration(duration) {
        if (typeof (duration) == "undefined") {
            return duration = 0.01;
        } else {
            return parseFloat(duration);
        }
    }

    function isRGB(input) {
        input = String(input).toLowerCase();
        if (input.indexOf("rgb") > -1) {
            return true;
        } else {
            return false;
        }
    }

    function getSuffix(input) {
        input = String(input).toLowerCase();
        if (input.indexOf("px") > -1) {
            return "px";
        } else if (input.indexOf("%") > -1) {
            return "%";
        } else if (input.indexOf("rem") > -1) {
            return "rem";
        } else if (input.indexOf("em") > -1) {
            return "em";
        } else if (input.indexOf("rem") > -1) {
            return "rem";
        } else {
            return "";
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -





    // Public functions
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    this.animate = function (style, value, duration) {
        addStackItem("anim", style, value, duration);
        return this;
    };
    this.anim = function (style, value, duration) {
        addStackItem("anim", style, value, duration);
        return this;
    };
    this.setProp = function (style, value) {
        addStackItem("set", style, value, 0);
        return this;
    };
    this.set = function (style, value) {
        addStackItem("set", style, value, 0);
        return this;
    };
    this.delay = function (duration) {
        addStackItem("delay", "", 0, duration);
        return this;
    };
    this.wait = function (duration) {
        addStackItem("delay", "", 0, duration);
        return this;
    };
    this.pause = function (duration) {
        addStackItem("delay", "", 0, duration);
        return this;
    };
    this.repeat = function (count) {
        start();
    };
    this.start = function () {
        start();
    };
    this.stop = function () {
        stop();
    };
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    // Simulate constructor auto execution
    init();
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



// AFTC.totParams = {
//     startTime:0,
//     endTime:0,
//     startValue:0,
//     endValue:0,
//     duration:0,
//     active:false,
//     step:0,
//     range:0,
//     onUpdate:false,
//     onComplete:false
// }
// window.tweenValueOverTime = function(start,end,duration,onUpdate,onComplete){
//     if(AFTC.totParams.active){
//         console.warn("tweenValueOverTime(): Error: Already running, if you require more advanced value tweening please use AFTC.Animate()");
//         return;
//     }
    
//     AFTC.totParams.active = true;
//     AFTC.totParams.duration = duration * 1000;
//     AFTC.totParams.startTime = new Date().getTime();
//     AFTC.totParams.endTime = AFTC.totParams.startTime + AFTC.totParams.duration;
//     AFTC.totParams.startValue = start;
//     AFTC.totParams.endValue = end;
//     AFTC.totParams.range = AFTC.totParams.endValue-AFTC.totParams.startValue;
//     AFTC.totParams.step = AFTC.totParams.range/(duration*1000);
//     AFTC.totParams.onUpdate = onUpdate;
//     AFTC.totParams.onComplete = onComplete;
//     log(AFTC.totParams);
//     AFTCTweenValueEngine();
// }
// window.AFTCTweenValueEngine = function(){
//     var c = new Date().getTime() - AFTC.totParams.startTime;
//     var v = 0;
//     if (c < AFTC.totParams.duration){
//         v = AFTC.totParams.startValue + AFTC.totParams.step * c;
//         log(c + " v=" + v);
//         if (onUpdate){
//             onUpdate(v);
//         }
//         requestAnimationFrame(AFTCTweenValueEngine);
//     } else {
//         v = AFTC.totParams.endValue;
//         log(c + " v=" + v);
//         log("COMPELTE");
//         if (onUpdate){
//             onComplete(v);
//         }
//     }
    
// }



/**
 * @function: fadeIn(elementId, duration)
 * @desc: fades in an element over a specified duration
 * @param string elementId: the id of the html element you wish to fade
 * @param number duration: how long you want the fade to run over in seconds
 */
window.fadeIn = function (elementId, duration) {
    var cleanUp = function(){
        animation = null;
        delete(animation);
    }
    var animation = new AFTC.Animate(elementId,cleanUp);
    animation.anim(["opacity"],[1],[duration]);
    animation.start();
}


/**
 * @function: fadeOut(elementId, duration)
 * @desc: fades out an element over a specified duration
 * @param string elementId: the id of the html element you wish to fade
 * @param number duration: how long you want the fade to run over in seconds
 */
window.fadeOut = function (elementId, duration) {
    var cleanUp = function(){
        animation = null;
        delete(animation);
    }
    var animation = new AFTC.Animate(elementId,cleanUp);
    animation.anim(["opacity"],[0],[duration]);
    animation.start();
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -







/**
 * @function: getElementOffsetTop(elementIdOrQuery)
 * @desc: Gets an elements top offset
 * @param string elementId: the element ID you wish to get the top offset of
 */
window.getElementOffsetTop = function (elementId) {
    var element = getElementById(elementId);
    var curtop = 0;
    if (isElement(element)){
        if (element.offsetParent) {
            do {
                curtop += element.offsetTop;
            } while (element = element.offsetParent);
            return parseFloat([curtop]);
        }
    }
    
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



/**
 * @function: scrollToElement(elementId, arg_duration, offset)
 * @desc: Scroll to element on page
 * @param string elementId: ID of element you wish to scroll to
 * @param string arg_duration: Duration in seconds
 * @param number offset: How much to offset scroll by
 */
window.scrollToElement = function (elementId, arg_duration, offset) {
    var ele = getElementById(elementId);
    var targetY = getElementOffsetTop(elementId);
    if (typeof (offset) != "undefined") {
        targetY += parseFloat(offset);
    }

    // If you dont want scroll just use this next line and return
    //window.scroll(0, targetY);

    var startY = document.documentElement.scrollTop,
        currentY = document.documentElement.scrollTop,
        distance = Math.abs(targetY - startY),
        duration = arg_duration * 1000,
        startTime = null,
        endTime,
        step = 0;

    // Prevent run if at location +/- 3 pixels
    if (startY > (targetY - 3) && startY < (targetY + 3)) {
        return false;
    }

    var direction = "scroll up";
    if (targetY > startY) {
        direction = "scroll down";
    }

    // log("scrollToElement(): startY = " + startY)
    // log("scrollToElement(): targetY = " + targetY)
    // log("scrollToElement(): distance = " + distance)
    // log("scrollToElement(): currentY = " + currentY)
    // log("scrollToElement(): direction = " + direction)



    var animate = function (t) {
        if (!startTime) {
            startTime = t;
            endTime = t + duration;
            step = (distance / duration);
        }

        // 1st run startTime and endTime are undefined and NaN, prevent run
        if (!endTime) {
            // log("prevent run");
            requestAnimationFrame(animate);
            return;
        }

        currentY = document.documentElement.scrollTop;

        if (direction == "scroll down") {
            var nextY = startY + (step * (t - startTime));
            if (nextY > targetY) {
                nextY = targetY;
            }
            // var msg = "";
            // msg += "start = " + startTime.toFixed(2);
            // msg += "   end = " + endTime.toFixed(2);
            // msg += "   startY = " + startY.toFixed(2);
            // msg += "   targetY = " + targetY.toFixed(2);
            // msg += "   currentY = " + currentY.toFixed(2);
            // msg += "   step = " + step.toFixed(2);
            // msg += "   nextY = " + nextY.toFixed(2);
            // log(msg);

            if (nextY >= targetY) {
                delete startTime;
                delete endTime;
                delete duration;
                delete step;
                window.scrollTo(0, targetY);
                // log("scroll down animation done");
                // log("-------------------------------\n\n\n");
            } else {
                window.scrollTo(0, nextY);
                requestAnimationFrame(animate);
            }
        } else {
            var nextY = startY - (step * (t - startTime));
            if (nextY < targetY) {
                nextY = targetY;
            }
            if (nextY <= targetY) {
                delete startTime;
                delete endTime;
                delete duration;
                delete step;
                window.scrollTo(0, targetY);
            } else {
                window.scrollTo(0, nextY);
                requestAnimationFrame(animate);
            }
        }
    }
    animate();
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// AFTC init
var AFTC = AFTC || {}



/**
 * @function: getHSLColor(xxx)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.getHSLColor = function (value) {
    //value from 0 to 1
    var hue = ((1 - value) * 120).toString(10);
    return ["hsl(", hue, ",100%,50%)"].join("");
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


/**
 * @function: getRandomRGBString()
 * @desc: returns a random RGB string RGB(xxx,xxx,xxx)
 */
window.getRandomRGBString = function () {
    var r = Math.round(Math.random() * 255);
    var g = Math.round(Math.random() * 255);
    var b = Math.round(Math.random() * 255);
    var rgb = "rgb(" + r + "," + g + "," + b + ")";
    return rgb;
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



/**
 * @function: xxxxxx(xxx)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.getRandomHexColor = function () {
    var hex = Math.floor(Math.random() * 0xFFFFFF);
    return "#" + ("000000" + hex.toString(16)).substr(-6);
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


/**
 * @function: xxxxxx(xxx)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.getRandomRGBColor = function(){
    rand = "rgb("+
        Math.floor(Math.random()*256)+","+
        Math.floor(Math.random()*256)+","+
        Math.floor(Math.random()*256)+")";
    return rand;
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


/**
 * @function: xxxxxx(xxx)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.rgb2Hex = function (r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




/**
 * @function: xxxxxx(xxx)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.rgbToHex = function (r, g, b) {
    function getHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    var rr = getHex(r);
    var gg = getHex(g);
    var bb = getHex(b);

    return "#" + rr + gg + bb;
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



/**
 * @function: xxxxxx(xxx)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.hexToRgb = function (hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



/**
 * @function: xxxxxx(xxx)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.numberToHex = function (num) {
    return num.toString(16);
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




/**
 * @function: xxxxxx(xxx)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.rgb2hsv = function() {
    var rr, gg, bb,
        r = arguments[0] / 255,
        g = arguments[1] / 255,
        b = arguments[2] / 255,
        h, s,
        v = Math.max(r, g, b),
        diff = v - Math.min(r, g, b),
        diffc = function(c){
            return (v - c) / 6 / diff + 1 / 2;
        };

    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(r);
        gg = diffc(g);
        bb = diffc(b);

        if (r === v) {
            h = bb - gg;
        }else if (g === v) {
            h = (1 / 3) + rr - bb;
        }else if (b === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        v: Math.round(v * 100)
    };
}








/**
 * @function: AFTC.Color(arg_color)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */

AFTC.Color = function (arg_color) {

    // Var ini
    var me = this;

    var params = {
        color: {
            r: 0,
            g: 0,
            b: 0
        }
    };

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function init() {
        //log("AFTC.Color.init()");

        // Process arg_color
        var hex = "";
        var num = "";
        var rgb = "";
        var str = "";
        var conversionError = false;

        switch (typeof (arg_color)) {
            case "string":
                // hex or rgb
                if (arg_color[0] == "#") {
                    //log("AFTC.Color.init(): Converting hex format [" + arg_color + "] to RGB");
                    rgb = hexToRgb(arg_color);
                    params.color.r = rgb.r;
                    params.color.g = rgb.g;
                    params.color.b = rgb.b;
                } else {
                    //log("AFTC.Color.init(): Converting rgb string to RGB");
                    str = arg_color.replace("rgb(", "");
                    str = str.replace(")", "");
                    var arr = str.split(",");
                    if (arr.length == 3) {
                        params.color.r = parseInt(arr[0]);
                        params.color.g = parseInt(arr[1]);
                        params.color.b = parseInt(arr[2]);
                    } else {
                        conversionError = true;
                    }
                }
                break;
            // case "number":
            //     //log("AFTC.Color.init(): Converting number format 0x000000 to RGB");
            //     hex = "#" + numberToHex(arg_color);
            //     log(arg_color);
            //     log(hex);
            //     rgb = hexToRgb(hex);
            //     params.color.r = rgb.r;
            //     params.color.g = rgb.g;
            //     params.color.b = rgb.b;
            //     break;
            case "object":
                var isArray = !!arg_color && arg_color.constructor === Array;
                if (!isArray) {
                    conversionError = true;
                } else if (arg_color.length == 3) {
                    //log("AFTC.Color.init(): Converting array to RGB");
                    params.color.r = parseInt(arg_color[0]);
                    params.color.g = parseInt(arg_color[1]);
                    params.color.b = parseInt(arg_color[2]);
                } else {
                    conversionError = true;
                }
                break;
            default:

                break;
        }


        //log(params.color.rgb);

        if (conversionError) {
            var msg = "";
            msg += "AFTC.Color(): ERROR - Unable to conver the color you supplied [" + arg_color + "] to a useful RGB value!\n";
            msg += "Formats supported are:" + "\n";
            msg += "\t" + "new AFTC.Color('rgb(50,60,70)');" + "\n";
            msg += "\t" + "new AFTC.Color('50,60,70');" + "\n";
            msg += "\t" + "new AFTC.Color([50,60,70]);" + "\n";
            msg += "\t" + "new AFTC.Color('#FFFFFF');" + "\n";
            throw (msg);
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    var adjustBrightness = function (percent) {
        //log("adjustBrightness(): " + percent);
        if (percent == 0) {
            return;
        } else {
            if (percent > 0){
                shadeColor(params.color,percent);
            } else {
                shadeColor(params.color,percent);

            }
            //log("################### - " + rgbToHex(params.color) + " " + percent + "%");
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -






    // Utility functions
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Stack exchange was full of rubbish (event hat shadeBlendConvert), done my own based on percentage of number base 255
    function shadeColor(rgbObj, percent) {
        var r = rgbObj.r;
        var g = rgbObj.g;
        var b = rgbObj.b;

        var redPercent = (100/255) * r; // The current value percent of 255
        var redTarget = Math.ceil(redPercent + percent);
        if (redPercent > 100){
            redTarget = 100;
        }

        var greenPercent = (100/255) * g; // The current value percent of 255
        var greenTarget = Math.ceil(greenPercent + percent);
        if (greenTarget > 100){
            greenTarget = 100;
        }

        var bluePercent = (100/255) * b // The current value percent of 255
        var blueTarget = Math.ceil(bluePercent + percent);
        if (blueTarget > 100){
            blueTarget = 100;
        }
        
        
        //log(rgbObj)
        //log("redPercent:" + redPercent.toFixed(2) + "%  redTarget:" + redTarget.toFixed(2));
        // log("greenPercent:" + greenPercent.toFixed(2) + "%  greenTarget:" + greenTarget.toFixed(2));
        //log("bluePercent:" + bluePercent.toFixed(2) + "%  blueTarget:" + blueTarget.toFixed(2));

        var step = 255/100;

        params.color.r = Math.round(step * redTarget);
        params.color.g = Math.round(step * greenTarget);
        params.color.b = Math.round(step * blueTarget);


    }




    var rgbToHex = function (obj) {
        var r = obj.r;
        var g = obj.g;
        var b = obj.b;

        function getHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }

        var rr = getHex(r);
        var gg = getHex(g);
        var bb = getHex(b);

        return "#" + rr + gg + bb;
    }
    var rgb2hex = function (obj) {
        var red = obj.r;
        var gren = obj.g;
        var blue = obj.b;

        var rgb = blue | (green << 8) | (red << 16);
        return '#' + (0x1000000 + rgb).toString(16).slice(1)
    }

    var hexToRgb = function (hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    var numberToHex = function (num) {
        return num.toString(16);
    }


    var rgbToNumber = function RGBToHex(obj) {
        var r = obj.r;
        var g = obj.g;
        var b = obj.b;

        var v = r << 16 | g << 8 | b;
        return v;
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -






    // Simulate constructor
    init();
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    // Public
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    return {
        lighten: function (percent) {
            adjustBrightness(percent);
        },
        darken: function (percent) {
            adjustBrightness(-percent);
        },
        getHex: function () {
            return rgbToHex(params.color);
        },
        getRGB: function () {
            return {r:params.color.r,g:params.color.g,b:params.color.b};
        },
        getRGBString: function () {
            return "rgb(" + params.color.r + "," + params.color.g + "," + params.color.b + ")";
        },
        getNumber: function () {

            return rgbToNumber(params.color) + " ";
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


/**
 * @function: xxxxxx(xxx)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.isFireFox = function () {
	var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
	return is_firefox;
}

/**
 * @function: xxxxxx(xxx)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.isChrome = function () {
	var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
	return is_chrome;
}

/**
 * @function: xxxxxx(xxx)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.isSafari = function () {
	var is_safari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
	return is_safari;
}

/**
 * @function: xxxxxx(xxx)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.isIE = function () {
	var is_ie = navigator.userAgent.toLowerCase().indexOf('MSIE') > -1;
	return is_ie;
}

/**
 * @function: xxxxxx(xxx)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.getIEVersion = function () {
	var match = navigator.userAgent.match(/(?:MSIE |Trident\/.*; rv:)(\d+)/);
	return match ? parseInt(match[1]) : undefined;
}

/**
 * @function: xxxxxx(xxx)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.getBrowser = function () {
	var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
	if (/trident/i.test(M[1])) {
		tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
		return 'IE';
	}
	if (M[1] === 'Chrome') {
		tem = ua.match(/\bOPR\/(\d+)/);
		if (tem != null) {
			return 'Opera';
		}
	}
	M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
	if ((tem = ua.match(/version\/(\d+)/i)) != null) {
		M.splice(1, 1, tem[1]);
	}
	return M[0];
}
// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -



/**
 * @function: xxxxxx(xxx)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.getOS = function (testAgent) {
	var userAgent;

	if (!testAgent){
		userAgent = navigator.userAgent || navigator.vendor || window.opera;
	} else {
		userAgent = testAgent;
	}

	userAgent = userAgent.toLowerCase();

	


	// Windows Phone must come first because its UA also contains "Android"!
	if (/windows phone/i.test(userAgent)) {
		return {
			os:"windows phone",
			userAgent:userAgent
		}
	}

	// Samsung Browser detection S8
	if (/samsungbrowser/i.test(userAgent)) {
		return {
			os:"android",
			userAgent:userAgent
		}
	}



	if (/android/i.test(userAgent)) {
		return {
			os:"android",
			userAgent:userAgent
		}
	}

	if (/ipad|iphone|ipod/i.test(userAgent)) {
		return {
			os:"ios",
			userAgent:userAgent
		}
	}



	// Windows Phone must come first because its UA also contains "Android"
	if (/win64|win32|win16|win95|win98|windows 2000|windows xp|msie|windows nt 6.3; trident|windows nt|windows/i.test(userAgent)) {
		return {
			os:"windows",
			userAgent:userAgent
		}
	}


	if (/os x/i.test(userAgent)) {
		return {
			os:"osx",
			userAgent:userAgent
		}
	}

	if (/macintosh|osx/i.test(userAgent)) {
		return {
			os:"osx",
			userAgent:userAgent
		}
	}

	if (/openbsd/i.test(userAgent)) {
		return {
			os:"open bsd",
			userAgent:userAgent
		}
	}


	if (/sunos/i.test(userAgent)) {
		return {
			os:"sunos",
			userAgent:userAgent
		}
	}






	if (/crkey/i.test(userAgent)) {
		return {
			os:"chromecast",
			userAgent:userAgent
		}
	}

	if (/appletv/i.test(userAgent)) {
		return {
			os:"apple tv",
			userAgent:userAgent
		}
	}

	if (/wiiu/i.test(userAgent)) {
		return {
			os:"nintendo wiiu",
			userAgent:userAgent
		}
	}

	if (/nintendo 3ds/i.test(userAgent)) {
		return {
			os:"nintendo 3ds",
			userAgent:userAgent
		}
	}

	if (/playstation/i.test(userAgent)) {
		return {
			os:"playstation",
			userAgent:userAgent
		}
	}

	if (/kindle/i.test(userAgent)) {
		return {
			os:"amazon kindle",
			userAgent:userAgent
		}
	}

	if (/ cros /i.test(userAgent)) {
		return {
			os:"chrome os",
			userAgent:userAgent
		}
	}



	if (/ubuntu/i.test(userAgent)) {
		return {
			os:"ubuntu",
			userAgent:userAgent
		}
	}


	if (/googlebot/i.test(userAgent)) {
		return {
			os:"google bot",
			userAgent:userAgent
		}
	}

	if (/bingbot/i.test(userAgent)) {
		return {
			os:"bing bot",
			userAgent:userAgent
		}
	}

	if (/yahoo! slurp/i.test(userAgent)) {
		return {
			os:"yahoo bot",
			userAgent:userAgent
		}
	}



	return {
		os: false,
		userAgent:userAgent
	};
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




// AFTC init
var AFTC = AFTC || {}


// AFTC.lockBody params
window.AFTCLockBodyParams = {
	pageYOffset: null,
	elementId: ""
};
/**
 * @function: xxxxxx(xxx)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.lockBody = function () {
	if (arguments[0] && typeof (arguments[0]) == "object") {
		for (var key in arguments[0]) {
			if (window.AFTCLockBodyParams.hasOwnProperty(key)) {
				window.AFTCLockBodyParams[key] = arguments[0][key];
			} else {
				throw ("AFTC.js > dom.js > lockBody(): Usage Error - Unknown parameter [" + key + "]");
			}
		}
	} else {
		var usage = "\n";
		usage += "AFTC.js > dom.js > lockBody() usage:" + "\n";
		usage += "lockBody({elementId:'PageContainmentDivId'});" + "\n";
		usage += "unlockBody();" + "\n";
		throw (usage);
	}

	if (window.pageYOffset) {
		window.AFTCLockBodyParams.pageYOffset = window.pageYOffset;

		$('html, body').css({
			top: -(window.AFTCLockBodyParams.pageYOffset)
		});
	}

	$('#' + window.AFTCLockBodyParams.elementId).css({
		height: "100%",
		overflow: "hidden"
	});
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



/**
 * @function: xxxxxx(xxx)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.unlockBody = function () {
	$('#' + window.AFTCLockBodyParams.elementId).css({
		height: "",
		overflow: ""
	});

	$('html, body').css({
		top: ''
	});

	window.scrollTo(0, window.AFTCLockBodyParams.pageYOffset);
	window.setTimeout(function () {
		window.AFTCLockBodyParams.pageYOffset = null;
	}, 0);
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -





/**
 * @function: xxxxxx(xxx)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.centerAbsoluteElement = function (eleOrEleId) {
	var element;

	if (typeof (eleOrEleId) === "string") {
		element = document.getElementById(eleOrEleId);
		if (!element) {
			throw ("AFTC.js > centerAbsoluteElement(elementOrElementId): ERROR! elementId supplied was not found on the DOM!");
		}
	}

	// var marginL = parseInt( getComputedStyle(element,null).marginLeft );
	// var marginR = parseInt( getComputedStyle(element,null).marginRight );
	// var marginT = parseInt( getComputedStyle(element,null).marginTop );
	// var marginB = parseInt( getComputedStyle(element,null).marginBottom );

	// var paddingL = parseInt( getComputedStyle(element,null).paddingLeft );
	// var paddingR = parseInt( getComputedStyle(element,null).paddingRight );
	// var paddingT = parseInt( getComputedStyle(element,null).paddingTop );
	// var paddingB = parseInt( getComputedStyle(element,null).paddingBottom );

	// var borderLeftW = parseInt( getComputedStyle(element,null).borderLeftWidth );
	// var borderRighttW = parseInt( getComputedStyle(element,null).borderRighttWidth );
	// var borderTopW = parseInt( getComputedStyle(element,null).borderTopWidth );
	// var borderBottomW = parseInt( getComputedStyle(element,null).borderBottomWidth );

	var offsetWidth = parseInt(element.offsetWidth);
	var offsetHeight = parseInt(element.offsetHeight);

	var tx = (window.innerWidth / 2) - (offsetWidth / 2);
	var ty = (window.innerHeight / 2) - (offsetHeight / 2);

	element.style.left = tx + "px";
	element.style.top = ty + "px";

	// element.css("left", tx);
	// element.css("top", ty);
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




// /**
//  * @function: xxxxxx(xxx)
//  * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//  * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
//  */
// window.getStyle = function (eleOrId, style) {
//     var element;

//     if (typeof (eleOrId) == "string") {
//         element = document.getElementById(eleOrId);
//         if (!element) {
//             var msg = "getComputerStyle(elementOrId,style): usage error!";
//             msg += "elementOrId needs to be an element in the DOM or a string of the ID of an element in the DOM!";
//             throw (msg);
//         }
//     } else {
//         element = eleOrId;
//     }


//     if (!document.defaultView) {
//         var msg = "getComputerStyle(elementOrId,style): Your browser doesn't support defaultView, please upgrade your browser or try google chrome.";
//         throw (msg);
//     }

//     if (!document.defaultView.getComputedStyle) {
//         var msg = "getComputerStyle(elementOrId,style): Your browser doesn't support getComputedStyle, please upgrade your browser or try google chrome.";
//         throw (msg);
//     }

//     var sd = document.defaultView.getComputedStyle(element, null);

//     if (!sd[style]) {
//         var msg = "\n" + "getComputerStyle(elementOrId,style): Computed style for element doesn't exist!\n";
//         msg += "The element [" + eleOrId + "] doesn't have a computer style property of [" + style + "]";
//         throw (msg);
//     }

//     return sd[style];
// }
// // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -







/**
 * @function: isBreakPoint(bp)
 * @desc: Returns the breakpoint your in
 * @param array bp: [320, 480, 768, 1024] etc
 */
window.isBreakPoint = function(bp) {
    // The breakpoints that you set in your css
    var bps = [320, 480, 768, 1024];
    var w = window.innerWidth;
    var min, max;
    for (var i = 0, l = bps.length; i < l; i++) {
      if (bps[i] === bp) {
        min = bps[i-1] || 0;
        max = bps[i];
        break;
      }
    }
    return w > min && w <= max;
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * @function: xxxxxx(xxx)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.removeAllSelectOptions = function (selectBoxId) {
	var i,
		element = document.getElementById(selectBoxId);

	if (element) {
		for (i = element.options.length - 1; i >= 0; i--) {
			element.remove(i);
		}
	}

}
// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -





/**
 * @function: checkboxToggleContent(xxx)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.checkboxToggleContent = function (cb, ids, showOnCheck) {
	var msg = "aftc.js > checkboxShowHide > incorrect usage!\n";
	msg += "checkboxHideShow(arg1,arg2,arg3)" + "\n";
	msg += "arg1 = checkbox element || checkbox element id" + "\n";
	msg += "arg2 = elementIdToShowHodeToggle || ArrayOfElementIdsToShowHide toggle" + "\n";
	msg += "arg3 (optional) = boolean : true (default) = show items on check || false = hide items on check" + "\n";

	var checkbox;

	if (typeof (cb) == "string") {
		checkbox = document.getElementById(cb);
		if (!cb) {
			log("checkboxShowHide argument 1 ID was not found on the DOM! Check for typos")
			throw (msg);
		}
	}

	if (cb.type && cb.type != 'checkbox') {
		log("checkboxShowHide argument 1 was not a checkbox element or id of a checkbox!")
		throw (msg);
	}


	if (!ids || ids == '' || ids.length < 1) {
		log("checkboxShowHide argument 2 is not valid!")
		throw (msg);
	}


	if (typeof (showOnCheck) == "undefined") {
		showOnCheck = true;
	}

	var itemsToShowHide = [];

	if (typeof (ids) == "string") {
		var element = document.getElementById(ids);
		if (!element) {
			log("Unable to find elemnt id [" + ids + "] on page!\n" + msg);
		}
		itemsToShowHide.push(element);

	} else if (isArray(ids)) {
		// log("PARSING ARRAY");
		for (var index = 0; index < ids.length; index++) {
			var id = ids[index];
			// log("going to look for element with id of [" + id + "]");
			var element = document.getElementById(id);
			if (!element) {
				throw ("Unable to find elemnt id [" + id + "] on page!\n" + msg);
			}
			itemsToShowHide.push(element);
		}

	}


	// Take note of each elements style.display value as we will want to restore it
	//.setAttribute('data', "icon:
	//document.getElementById('item1').dataset.icon


	for (var index = 0; index < itemsToShowHide.length; index++) {
		var element = itemsToShowHide[index];
		var currentDisplayStyle = element.style.display;
		var originalDisplayStyle = element.getAttribute("data-display");
		if (!element.dataset.display) {
			//displayStyle = getStyle(element,"display"); // This would make it dependent on misc.js
			var sd = document.defaultView.getComputedStyle(element, null);
			currentDisplayStyle = sd.display;
			originalDisplayStyle = currentDisplayStyle;
			element.setAttribute("data-display", originalDisplayStyle);
		}

		var style = "";

		if (cb.checked && showOnCheck) {
			style = originalDisplayStyle;
		} else if (cb.checked && !showOnCheck) {
			style = "none";
		} else if (!cb.checked && showOnCheck) {
			style = "none";
		} else {
			style = originalDisplayStyle;
		}

		//log("Setting [" + element.id + "] style.display to [" + style + "]");
		element.style.display = style;

	}

	// log("---");
	// log("currentDisplayStyle = [" + currentDisplayStyle + "]");
	// log("originalDisplayStyle = [" + originalDisplayStyle + "]");

	// show by elementId
	var elementToShow = document.getElementById(ids);
	if (elementToShow) {


	}

	/*
	var $state = jQuery('input[name="' + $checkboxID + '"]:checked').val();
	$state = $state.toLowerCase();

	if ($state.checked) {
		jQuery("#" + $elementIdForHideShow).slideDown();
	} else {
		jQuery("#" + $elementIdForHideShow).slideUp();
	}
	*/
}
// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -


/**
 * @function: isChecked(xxx)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.isChecked = function (id) {
	return document.getElementById(id).checked;
}
// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -




/**
 * @function: isNumberKey(event)
 * @desc: Checks if evt supplied (use on form input events via onkeyup or onkeydown)
 * @param event evt: html onkeyup(event) or onkeydown(event)
 */
window.isNumberKey = function (evt) {
	var charCode = (evt.which) ? evt.which : event.keyCode;
	if (charCode > 31 && (charCode < 48 || charCode > 57))
		return false;

	return true;
}
// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -





/**
 * @function: parseJSONToSelect(j, selectElementIdOrElement, labelKey, valueKey)
 * @desc: parses a json object of key value pairs to a form select element
 * @param string j: the json data
 * @param multi selectElementIdOrElement: the json data
 * @param string labelKey: of key value pair this is the key
 * @param string valueKey: of key value pair this is the value
 */
window.parseJSONToSelect = function (j, selectElementIdOrElement, labelKey, valueKey) {
	var element;

	if (typeof(selectElementIdOrElement) == "string"){
		element = document.getElementById(selectElementIdOrElement);
		if (!element){
			throw("AFTC.js > parseJSONToSelect() Usage ERROR, Unable to find anything on the DOM with an ID of [" + selectElementIdOrElement + "]");
		}
	}

	if( typeof(selectElementIdOrElement) == "object"){
		element = selectElementIdOrElement;
	}

	if (typeof(j) == "string"){
		j = JSON.parse(j);
	}

	for (var i = 0; i < j.length; i++) {
		var label = j[i][labelKey];
		var data = j[i][valueKey];

		var option = document.createElement("option");
		option.text = label;
		option.value = data;
		//log(option);
		element.add(option);
	}
}




/**
 * @function: xxxxxx(xxx)
 * @desc: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * @param string xxxx: xxxxxxxxxxxxxxxxxxxx
 */
window.limitLengthInWords = function (element, maxWords) {
	var value = element.value,
		wordCount = value.split(/\S+/).length - 1,
		re = new RegExp("^\\s*\\S+(?:\\s+\\S+){0," + (maxWords - 1) + "}");
	if (wordCount >= maxWords) {
		element.value = value.match(re);
		document.getElementById('word_count').innerHTML = "";
		wcount_valid = true;
	} else {
		document.getElementById('word_count').innerHTML = (maxWords - wordCount) + " words remaining";
		wcount_valid = false;
	}

	return wcount_valid;
}
// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
// AFTC init
var AFTC = AFTC || {}

/* Some reading / ref material
https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
https://developer.mozilla.org/es/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
*/


/**
 * @type: class
 * @name: AFTC.XHR()
 * @version: 1.0.0
 * @requires: base.js
 * @function: AFTC.XHR(args)
 * @desc: Quick and easy xhr/ajax
 * ````
	var data = "mode=json2";
	xhr1 = AFTC.XHR({
		url: "./request.php",
		method: "post",
		data: data,
		dataType: "form",
		onComplete: function (response) {
			logTo("debug", response);
			response = JSON.parse(response);
			// Iterate
			// for (var index in response) {
			//     var jObject = response[index];
			//     logTo("debug", jObject);
			//     for (var key in jObject) {
			//         log(key + " = " + response[index][key]);
			//     }
			// }
		}
	});
 * ````
 * @param string url: url or file you wish to load
 * @param string method: post, get, put, delete etc
 * @param * data: array, object, formdata, string or json data you wish to send to the url
 * @param string dataType: data type of data object array, object, formdata, form and json
 * @param function onComplete: on a successfull xhr request this is the function that will be called
 * @return object data;
 * @link: see usage example in tests/xhr/xhr.htm
 */
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
AFTC.XHR = function () {
	var args = {
		url: false,
		method: false,
		data: false,
		dataType: false,
		responseType: false,
		onComplete: false
	};

	// Process arguments
	if (arguments[0] && typeof (arguments[0]) == "object") {
		for (var key in arguments[0]) {
			if (args.hasOwnProperty(key)) {
				args[key] = arguments[0][key];
			}
		}
	}

	var params = {
		url: false,
		requestHeader: false,
		xhr: false,
		readyState: false,
		status: false,
		responseType: false,
		response: null
	};
	// - - - - - - - - - - - - - - - - - - -


	// - - - - - - - - - - - - - - - - - - -
	function init() {
		if (window.XMLHttpRequest) {
			// code for IE7+, Firefox, Chrome, Opera, Safari
			params.xhr = new XMLHttpRequest();
		} else {
			// code for IE6, IE5
			params.xhr = new ActiveXObject("Microsoft.XMLHTTP");
		}

		// format and check args
		if (!args.method) {
			args.method = "GET";
		} else {
			args.method = String(args.method).toUpperCase();
		}

		if (!args.dataType) {
			args.dataType = "form";
		} else {
			args.dataType = String(args.dataType).toLowerCase();
		}

		if (args.method == "GET" && args.dataType != "form") {
			console.error("AFTC.XHR: ERROR: GET only supports the 'form' data type (key value pairs eg a=1&b=2)");
			return false;
		} else if (args.dataType != "form" && args.dataType != "formdata" && args.dataType != "json" && args.dataType != "array" && args.dataType != "object") {
			console.error("AFTC.XHR: ERROR: The dataType option only supports 'form', 'formdata', 'json', 'array' or 'object'");
			return false;
		}


		if (!args.url) {
			console.error("AFTC.XHR: ERROR: Please specify a URL!");
			return false;
		}
		// - - - -

		// Setup onReadStateChange
		params.xhr.onreadystatechange = function (e) {
			params.readyState = this.readyState;
			params.status = this.status;

			if (this.readyState == 4 && this.status == 200) {
				// log("###### RESPONSE:");
				// logTo("debug", params.xhr.getResponseHeader("Content-Type"));

				if (String(params.xhr.responseType).toLowerCase() == "json") {
					params.response = this.response;
				} else {
					params.response = this.responseText;
				}

				if (args.onComplete) {
					args.onComplete(params.response);
				}
			}
		};
		// - - - -

		// Set response headers
		if (args.responseType) {
			args.responseType = String(args.responseType).toLowerCase();
			if (args.responseType.indexOf("json") != -1) {
				params.xhr.responseType = 'json';
			}
		}
		// - - - -

		// Open, setRequestHeader, Send
		if (!args.data) {
			params.xhr.open(args.method, args.url, true);
			params.xhr.send();
		} else {
			processData();

			if (args.dataType == "form") {
				params.requestHeader = "application/x-www-form-urlencoded; charset=utf-8";
			} else if (args.dataType == "formdata") {
				//params.requestHeader = "multipart/form-data";
			} else if (args.dataType == "json") {
				params.requestHeader = "application/json; charset=utf-8";
			} else {

			}


			// log("######### SEND ##########");
			// log("args.method = " + args.method);
			// log("args.url = " + args.url);
			// log("args.dataType = " + args.dataType);
			// log("args.data = " + args.data);
			// log("params.requestHeader = " + params.requestHeader);
			// log("----------------------------------");


			params.xhr.open(args.method, args.url, true);
			if (params.requestHeader){
				params.xhr.setRequestHeader("Content-Type", params.requestHeader);
			}
			

			switch (args.method) {
				case "GET":
					params.xhr.send();
					break;
				default:
					params.xhr.send(args.data);
					break;
			}

			log("getResponseHeader = " + params.xhr.getResponseHeader("Content-Type"));
			
		}
		// - - - -

	}
	// - - - - - - - - - - - - - - - - - - -





	// - - - - - - - - - - - - - - - - - - -
	function processData() {
		if (args.method == "GET" && args.data != false) {
			args.url = args.url + "?" + args.data;
			return true;
		}

		if (args.method == "POST") {
			if (args.data.append) {
				args.dataType = "formdata";
			} else {
				if (isArray(args.data) || typeof (args.data) == "object") {
					// Array || Object
					var data = "";
					var formData = new FormData();
					for (var key in args.data) {
						log(key + " = " + args.data[key]);
						formData.append(key, args.data[key]);
						data += "&" + key + "=" + args.data[key];
					}
					args.dataType = "form";
					args.data = data;
					return true;
				}
			}

		}


		// default
		return true;
	}
	// - - - - - - - - - - - - - - - - - - -


	// // - - - - - - - - - - - - - - - - - - -
	// function processData() {
	// 	// Process data
	// 	if (!args.data) {
	// 		params.xhr.send();
	// 		return true;
	// 	}

	// 	// Prevent json on get
	// 	if (args.method == "get" && args.dataType != "form" && args.dataType != "formdata") {
	// 		console.error("AFTC.XHR: ERROR: GET only supports data types of 'form' and 'formdata', [" + args.dataType + "] was set!");
	// 		return false;
	// 		// dataType:form and typeof(data):string
	// 		if (args.dataType == "form" && typeof (args.data) == "string") {
	// 			// add string to url
	// 			params.getURL = params.getURL + "?" + args.data;
	// 			return true;
	// 		}
	// 	}


	// 	// Tests
	// 	// GET Requires string data to be appended to url
	// 	// args.method = "get";
	// 	// args.dataType = "argon";
	// 	// args.data = "a=1&b=2&mode=test";
	// 	// args.data = [];
	// 	// args.data["name"] = "Darcey";
	// 	// args.data["email"] = "darcey@aftc.io";
	// 	// args.data = new FormData();
	// 	// args.data.append("name", "Darcey Lloyd");
	// 	// args.data.append("email", "darcey.lloyd@gmail.com");


	// 	var urlParams = "";

	// 	// GET only data parsers
	// 	if (args.method == "get") {
	// 		// GET sends variables via url string
	// 		if (args.dataType == "form" && typeof (args.data) == "string") {
	// 			params.data = args.data; // params is final data, args is arg / original data
	// 			params.url = args.url + "?" + params.data;
	// 			return true;
	// 		}

	// 		// GET sends variables via url string, iterate through FormData appending to url string
	// 		if (args.data.append || args.dataType == "formdata") {
	// 			// FormData
	// 			urlParams = "";
	// 			log(args.data.entries());
	// 			for (var pair of args.data.entries()) {
	// 				if (urlParams != "") {
	// 					urlParams += "&";
	// 				}
	// 				urlParams += pair[0] + "=" + pair[1];
	// 				// log(pair[0] + ', ' + pair[1]);
	// 			}
	// 			params.dataType = "form";
	// 			params.url = args.url + "?" + urlParams;
	// 			return true;
	// 		}

	// 		// GET sends variables via url string, iterate through array/object appending to url string
	// 		if (isArray(args.data) || typeof (args.data) == "object") {
	// 			// Array || Object
	// 			urlParams = "";
	// 			for (var key in args.data) {
	// 				if (urlParams != "") {
	// 					urlParams += "&";
	// 				}
	// 				urlParams += key + "=" + args.data[key];
	// 			}
	// 			params.dataType = "form";
	// 			params.url = args.url + "?" + urlParams;
	// 			return true;
	// 		}
	// 	} else {
	// 		// POST sends variables via string, formdata or json, iterate through array/object creating FormData object
	// 		if (isArray(args.data) || typeof (args.data) == "object") {
	// 			// Array || Object
	// 			params.data = new FormData();
	// 			for (var key in args.data) {
	// 				params.data.append(key, args.data[key]);
	// 			}
	// 			params.dataType = "formdata";
	// 			params.url = args.url;
	// 			return true;
	// 		}
	// 	}

	// 	// default
	// 	params.dataType = args.dataType;
	// 	params.url = args.url;
	// 	return true;
	// }
	// // - - - - - - - - - - - - - - - - - - -





	// Constructor simulation
	init();
	// - - - - - - - - - - - - - - - - - - -


	// Return
	return {
		url: args.url,
		method: args.method,
		data: args.data,
		dataType: args.dataType,
		xhr: params.xhr,
		readyState: params.readyState,
		status: params.status,
		response: params.response,
		responseType: params.responseType
	}
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -







// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
// window.AJAXLoad = function($url, $method, $data, $callback) {

// 	$.ajax({
// 		method: $method,
// 		url: $url,
// 		data: $data,
// 		success: function (response) {
// 			$callback(response);
// 			//return response;
// 		},
// 		error: function (jqXHR, textStatus) {
// 			var msg = "";
// 			msg += "AFTC.JS: AJAXLoad(): ERROR\n";
// 			msg += "\t" + "URL: [" + $url + "]\n";
// 			msg += "\t" + "method: [" + $method + "]\n";
// 			msg += "\t" + "data: [" + $data + "]\n";
// 			msg += "\t" + "status: [" + ajax.status + "]\n";
// 			msg += "\t" + "statusText: [" + ajax.statusText + "]\n";
// 			msg += "\t" + "jqXHR: [" + jqXHR + "]\n";
// 			msg += "\t" + "textStatus: [" + textStatus + "]\n";
// 			log(msg);
// 		}
// 	});
// }
// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -



// window.loadJSONFile = function($url, $callback) {
// 	/*
// 	 var $data = $.getJSON($file, function(result){
// 	 $.each(result, function(key, val){
// 	 //$("div").append(field + " ");
// 	 //log(val);
// 	 });
// 	 return result;
// 	 });
// 	 */

// 	var ajax = $.ajax({
// 		dataType: "json",
// 		url: $url,
// 		global: false,
// 		success: function (data) {
// 			$callback(data);
// 		},
// 		error: function (data) {
// 			var msg = "";
// 			msg += "loadJSONFile: ERROR\n";
// 			msg += "\t" + "URL: [" + $url + "]\n";
// 			//msg += "\t" + "ID: [" + $id + "]\n";
// 			//msg += "\t" + "method: [" + $method + "]\n";
// 			msg += "\t" + "data: [" + data + "]\n";
// 			msg += "\t" + "status: [" + ajax.status + "]\n";
// 			msg += "\t" + "statusText: [" + ajax.statusText + "]\n";
// 			log(msg);
// 		}
// 	});
// }

