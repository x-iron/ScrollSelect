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
        var popup = document.createElement('div');
        popup.innerHTML = ta.textContent;
        ta.classList.add('scroll-select-activate');
        popup.classList.add(popupClass);
        popup.classList.add("scroll-select-popUp");
        popup.style.width = popUpConfig.width + 'px';
        popup.dataset.content = ta.textContent;
        document.body.appendChild(popup);
        e.stopPropagation();
    }

    function mouseoutHandler(e) {
        var ta = e.target;
        ta.classList.remove('scroll-select-activate');
        var popup = getPopUp();
        if (!popup) return;
        document.body.removeChild(popup);
        e.stopPropagation();
    }

    function mousewheelHandler(e) {
        var wheel = (e.wheelDelta) ? e.wheelDelta / 120 : -(e.detail || 0) / 3;
        //up 1: down -1
        var popUp = getPopUp();
        var textContent = popUp.dataset.content || '';
        var length = textContent.length + wheel;
        if (length > popUp.textContent.length) length = 0;
        if (length < 0) length = popUp.textContent.length;

        popUp.dataset.content = popUp.textContent.slice(0, length);
        var reg = new RegExp('^(' + popUp.dataset.content + ')');
        popUp.innerHTML = popUp.textContent.replace(reg, '<span class="selected-content">$1</span>');
        log(popUp.dataset.content);
        log(popUp.innerHTML);
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

    function clickHandler(e) {
        var popUp = getPopUp();
        var content = popUp.dataset.content;
        mouseoutHandler(e);
        window.open('http://www.google.com.hk/search?q=' + content);
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
                doms[i][(removeHandler ? 'remove' : 'add') + 'EventListener']('click', clickHandler);
            }
        })();
    };
    t.version = 0.1;
    this[cmpName] = t;
})();