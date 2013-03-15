(function(cmpName) {
    cmpName = cmpName || 'ScrollSelect';
    function log(str) {
        console.log('[' + cmpName + ']:', str);
    }

    var popupClass = cmpName + '-tip';
    var cursorOffset = {x:8,y:18};
    var popUpConfig = {
        width: 100
    };

    function getPopUp() {
        return document.getElementsByClassName(popupClass)[0];
    }

    function mouseoverHandler(e) {
        var ta = e.target;
        log(ta.textContent);
        var top = e.clientY + cursorOffset.y;
        var left = e.clientX + cursorOffset.x;
        var popup = document.createElement('div');
        popup.innerHTML = ta.textContent;
        popup.setAttribute('style', 'position:absolute;background:yellow;left:' + left + 'px;top:' + top + 'px;width:' + popUpConfig.width + 'px;');
        ta.style.outline = 'yellow solid 1px';
        popup.setAttribute('class', popupClass);
        document.body.appendChild(popup);
        e.stopPropagation();
    }

    function mouseoutHandler(e) {
        var ta = e.target;
        ta.style.outline = 'none';
        document.body.removeChild(getPopUp());
        e.stopPropagation();
    }

    function mousewheelHandler(e) {
        var wheel = (e.wheelDelta) ? e.wheelDelta / 120 : -(e.detail || 0) / 3;
        //up 1: down -1
        log(wheel);
    }

    function mousemoveHandler(e) {
        var popup = getPopUp();
        if (!popup) return;
        var top = e.clientY + cursorOffset.y;
        var left = e.clientX + cursorOffset.x;
        if (left + popUpConfig.width > window.innerWidth) {
            left = window.innerWidth - popUpConfig.width;
        }
        if (top + popup.offsetHeight > window.innerHeight) {
            top = window.innerHeight - popup.offsetHeight;
        }
        popup.style.left = left + 'px';
        popup.style.top = top + 'px';
        e.stopPropagation();
    }

    var t = function() {
        var args = arguments;
        var removeHandler = args[1] === true;
        if (args[0] == 'help') {
            log('Version: 0.1');
        }

        //collect target doms
        var doms = (function() {
            var doms = [];
            var arg = '';
            for (var i = 0; i < args[0].length; i++) {
                arg = args[0][i];
                arg.constructor.name == 'HTMLDocument' && doms.push(arg);
                /^#/.test(arg) && doms.push(document.getElementById(arg.slice(1)));
                if (/^\./.test(arg)) {
                    var nodelist = document.getElementsByClassName(arg.slice(1));
                    for (var j = 0; j < nodelist.length; j++) {
                        doms.push(nodelist[j]);
                    }
                }
            }
            return doms;
        })();

        (function() {
            for (var i = 0; i < doms.length; i++) {
                doms[i][(removeHandler ? 'remove' : 'add') + 'EventListener']('mouseover', mouseoverHandler);
                doms[i][(removeHandler ? 'remove' : 'add') + 'EventListener']('mouseout', mouseoutHandler);
                doms[i][(removeHandler ? 'remove' : 'add') + 'EventListener']('mousemove', mousemoveHandler);
                doms[i][(removeHandler ? 'remove' : 'add') + 'EventListener']('mousewheel', mousewheelHandler);
            }
        })();
    };
    t.version = 0.1;
    this[cmpName] = t;
})();