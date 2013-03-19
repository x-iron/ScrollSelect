(function(cmpName) {
    cmpName = cmpName || 'ScrollSelect';

    function log(str) {
        console.log('[' + cmpName + ']:', str);
    }

    var callback = function() {
    };
    var cursorOffset = {x:8,y:18};
    var popUpConfig = {
        width: 100
    };
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
            var popupClass = cmpName + '-tip';

            function getPopUp() {
                return document.getElementsByClassName(popupClass)[0];
            }

            var handler = {


                mouseover:function (e) {
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
                },

                mouseout:function (e) {
                    var ta = e.target;
                    ta.classList.remove('scroll-select-activate');
                    var popup = getPopUp();
                    if (!popup) return;
                    document.body.removeChild(popup);
                    e.stopPropagation();
                },

                mousewheel:function (e) {
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
                },

                mousemove: function (e) {
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
                },

                click:function (e) {
                    var popUp = getPopUp();
                    var content = popUp.dataset.content;
                    handler.mouseout(e);
                    callback(content);
                    e.stopPropagation();
                }
            };
            var events = ['mouseover','mouseout','mousemove','mousewheel','click'];
            for (var i = 0; i < doms.length; i++) {
                for (var j = 0; j < events.length; j++) {
                    var event = events[j];
                    doms[i][(removeHandler ? 'remove' : 'add') + 'EventListener'](event, handler[event]);
                }
            }
        })();
    };
    t.getVersion = function() {
        return '0.1';
    };

    t.config = function(config) {
        if (typeof config.callback == 'function') callback = config.callback;
        if (typeof config.cursorOffset == 'object') cursorOffset = config.cursorOffset;
        if (typeof config.popUpConfig == 'object') popUpConfig = config.popUpConfig;
    };
    this[cmpName] = t;
})();