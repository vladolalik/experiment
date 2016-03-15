function loadScript(url, callback) {
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}


var elements = [];
var elementsNames = [];
var pageX;
var pageY;
var actualURL;
var dataLogs = [];
var username = "";


function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}

username = getURLParameter('username');
if (username!=""){
    document.cookie = "username="+username;
}


/** initialisation **/
var date = new Date();
var timeStamp = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "." + date.getMilliseconds();
var urlChangeEvent = "{Type: \"URL\", TimeStamp: \""+ timeStamp +"\", URL: \"" + window.location.href + "\"}";
console.log(urlChangeEvent);
uploadData(urlChangeEvent);
actualURL = window.location.href;
/** initilisation **/

/** Back button detection **/
if (window.history && window.history.pushState) {
    window.history.pushState('forward', null, '#');
    $(window).on('popstate', function() {
        var date = new Date();
        var timeStamp = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "." + date.getMilliseconds();
        var backBtnEvent = "{Type: \"BACK_BUTTON\", TimeStamp: \"" + timeStamp + "\", URL: \"" +  window.location.href + "\" }"
        console.log(backBtnEvent);
        uploadData(backBtnEvent);
        window.history.back();
    });
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

var myVar = setInterval(function () {
    logPositions(elements, elementsNames);
    var result = getElements(dynamicElementsQueries);
    var tempElements = result[0];
    var tempNames = result[1];
    logPositions(tempElements, tempNames);
}, 100);

function logPositions(tempElements, tempElementsNames) {
    for (var i = 0; i < tempElements.length; i++) {
        var elm = tempElements[i];
        var pElm = getScreenCoordinatesOf(elm);
        if (checkVisible(pElm, elm)) {
            var dimensions = computeDimensions(pElm, elm);
            var date = new Date();
            var timeStamp = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "." + date.getMilliseconds();
            var position = "{Type: \"Position\", TimeStamp: \""+ timeStamp +"\", URL: \""+actualURL+"\", AOIName: \"" + tempElementsNames[i] +"\", PositionX:\""+ dimensions.pX +"\"," +
            " PositionY:\""+ dimensions.pY +"\", Width:\""+ dimensions.width +"\", Height:\""+ dimensions.height +"\"}";
            console.log(position);
            uploadData(position);
        }
    }
}

function uploadData(data){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            // console.log(xmlhttp.responseText);
        }
    };

    dataLogs.push(data);
    if (dataLogs.length > 500) {
        xmlhttp.open("POST", url + "logger.php?username="+username, true);
        xmlhttp.send(dataLogs.join("\n"));
        dataLogs = [];
    }
}

function checkVisible(pElm, elm) {
    if (!(pElm && elm))
        return false;
    return (pElm.y + elm.offsetHeight > pageY) &&
        (pElm.y < window.innerHeight + pageY) &&
        (pElm.x + elm.offsetWidth > pageX) &&
        (pElm.x < window.innerWidth + pageX);
}

function computeDimensions(positionElm, elm) {
    var pY, pX, height, width;
    if (positionElm.y < pageY) {
        height = elm.offsetHeight - (pageY - positionElm.y);
        pY = pageY;
    } else if (positionElm.y + elm.offsetHeight > window.innerHeight + pageY) {
        pY = positionElm.y;
        height = (positionElm.y + elm.offsetHeight) - (window.innerHeight + pageY);
    } else {
        height = elm.offsetHeight;
        pY = positionElm.y;
    }

    if (positionElm.x < pageX) {
        width = elm.offsetWidth - (pageX - positionElm.x);
        pX = pageX;
    } else {
        width = elm.offsetWidth;
        pX = positionElm.x;
    }
    return {
        pY: pY,
        pX: pX,
        width: width,
        height: height
    };
}

window.onmousemove = function (e) {
    pageX = e.screenX - e.clientX;
    pageY = e.screenY - e.clientY;
    // console.log(pageX + "  " + pageY);
    //console.log("window w h " + window.innerWidth + "  " + window.innerHeight);
};

window.onmousedown = function (e) {
    var button = "";
    button = e.button === 0 ? "LEFT_BUTTON" : "RIGHT_BUTTON";
    var mouseEvent = "{Type: \"MouseEvent\", TimeStamp: \""+ timeStamp +"\", URL: \""+actualURL+"\", ClickX:\""+ e.screenX +"\"," +
        "ClickY:\""+ e.screenY +"\", MouseButton:\""+ button +"\"}";
    console.log(mouseEvent);
    uploadData(mouseEvent);
    //logPositions(elementIDs);
};

document.onkeypress = function (e){
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode
    var keyEvent = "{Type: \"KeyEvent\", TimeStamp: \""+ timeStamp +"\", URL: \""+actualURL+"\", Key:\""+ charCode +"\"}";
    console.log(keyEvent);
    uploadData(keyEvent);
};

function getElementsByClassName() {
    var result = [];
    for (var i = 0; i < elementsByClass.length; i++) {
        var elements = document.getElementsByClassName(elementsByClass[i]);
        if (elements) {
            var counter = 0;
            for (var j=0;j<elements.length;j++){
                result.push(elements[j]);
                elementsNames.push(elementsByClass[i] + "_" + counter);
                counter++;
            }
        }
    }
    console.log(result);
    return result;
}

// funkcia vrati pole, ktore obsahuje 2 polia [objekty, mena objektov]
function getElements(tempQueries) {
    var result = [];
    var tempNames = [];
    for (var i = 0; i < tempQueries.length; i++) {
        var elem = document.querySelector(tempQueries[i]);
        if (elem) {
            result.push(elem);
            tempNames.push(tempQueries[i]);
        }
    }
    return [result, tempNames];
}

function getScreenCoordinatesOf(obj) {
    try {
        if (obj) {
            var p = {};
            var box = obj.getBoundingClientRect();
            p.x = Math.round(pageX + box.left);
            p.y = Math.round(pageY + box.top);
            return p;
        }
    } catch (e) {
        console.log(e);
    }
}

//var createUserCookies=function() {
//    username = setUserCookies();
//};
//
//
//loadScript("http://localhost/experiment/experiment/tampermonkey-scripts/user-id.js", createUserCookies);