/* ========================================================================
 * Maple: maple.js [1.0.0]
 * https://github.com/fengqinhua/Maple.Bootstrap-Admin
 * 功能说明：
 *     实现常用函数的封装
 * 
 * ========================================================================
 * Copyright (c) 2018; Licensed MIT
 *
 * ! Some code copy from zui 1.8.1 by QingDao Nature Easy Soft Network Technology Co,LTD  @easysoft cnezsoft.com. (Copyright (c) 2018 cnezsoft.com; Licensed MIT)
 * ! & iTsai-Webtools by Chiroc The file has been changed in Maple. It will not keep update with the ZUI version in the future.
 * ======================================================================== */


/* ========================================================================
 * 基础类库 string,Array 的扩展方法
 * ======================================================================== */
;
(function () {
    "use strict";

    //  判断是否为数字
    if (!String.prototype.isNum) {
        String.prototype.isNum = function (s) {
            if (s !== null) {
                var r, re;
                re = /\d*/i;
                r = s.match(re);
                return (r == s) ? true : false;
            }
            return false;
        };
    };

    //  判断是否以 searchString 结尾
    if (!String.prototype.endsWith) {
        String.prototype.endsWith = function (searchString, position) {
            var subjectString = this.toString();
            if (position === undefined || position > subjectString.length) {
                position = subjectString.length;
            }
            position -= searchString.length;
            var lastIndex = subjectString.indexOf(searchString, position);
            return lastIndex !== -1 && lastIndex === position;
        };
    };

    //  判断是否以 searchString 开始
    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function (searchString, position) {
            position = position || 0;
            return this.lastIndexOf(searchString, position) === position;
        };
    };

    //  判断是否包含 searchString
    if (!String.prototype.includes) {
        String.prototype.includes = function () {
            return String.prototype.indexOf.apply(this, arguments) !== -1;
        };
    };

    //  去掉字符串前面和最后的空格
    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/(^\s*)|(\s*$)/g, "");
        };
    };

    //  去掉字符串中所有的空格
    if (!String.prototype.trimBlanks) {
        String.prototype.trimBlanks = function () {
            return this.replace(/(\s*)/g, "");
        };
    };

    //格式化字符串,将{n},替换为对应的参数
    //如：'I {0}&{1} China.'.formatArgs('love','like'); 输出："I love&like China."
    if (!String.prototype.formatArgs) {
        String.prototype.formatArgs = function () {
            var thiz = this;
            for (var i = 0; i < arguments.length; i++) {
                var param = "\{" + i + "\}";
                thiz = thiz.replace(param, arguments[i]);
            }
            return thiz;
        };
    };
    /**
     * 判断数据中是否存在cell值，并返回第一个存在的位置
     * 
     * @method indexOf
     * @param {String/Number} cell 数组元素值
     * @returns {Number} 查询成功返回0-n的索引号，失败返回-1
     */
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (cell) {
            for (var i = 0, len = this.length; i < len; i++) {
                if (this[i] === cell)
                    return i;
            }
            return -1;
        };
    };

})();

/* ========================================================================
 * maple.js
 * 定义浏览器，视窗，URL相关的基础函数
 * ======================================================================== */
;
(function () {
    'use strict';
    var staticFilePath = "../static/";
    var rootPath = "../";

    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    //生成GUID
    var newGuid = function () {
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    };

    //获取URL中包含的参数信息
    var getUrlParameter = function (name, url) {
        var paramStr = url || window.location.search;
        if (paramStr.length == 0) {
            return null;
        }
        if (paramStr.charAt(0) == "?") {
            paramStr = unescape(paramStr).substring(1);
        }
        if (paramStr.length == 0) {
            return null;
        }
        var params = paramStr.split('&');
        for (var i = 0; i < params.length; i++) {
            var parts = params[i].split('=', 2);
            if (parts[0] == name) {
                if (parts.length < 2 || typeof (parts[1]) === "undefined" ||
                    parts[1] == "undefined" || parts[1] == "null")
                    return '';
                return parts[1];
            }
        }
        return null;
    };

    //获取URL中包含的参数信息
    var getPageQueryString = function (name, defaultValue) {
        //读取查询参数
        var result = getUrlParameter(name, window.location.search);
        if (result != null) return result;

        var items = window.location.hash.split("?");
        if (items.length > 1) {
            result = getUrlParameter(name, items[items.length - 1]);
            if (result != null) return result;
        }
        return defaultValue;
    };

    //设置为主页
    var setHomepage = function (url) {
        url = (url ? url : location.href);
        if (document.all) {
            document.body.style.behavior = "url(#default#homepage)";
            document.body.setHomePage(url);
        } else if (window.sidebar) {
            if (window.netscape) {
                try {
                    window.netscape.security.PrivilegeManager
                        .enablePrivilege("UniversalXPConnect");
                } catch (e) {
                    alert("此操作被浏览器拒绝！请在地址栏输入\"about:config\"并回车然后将[signed.applets.codebase_principal_support]的值设置为true");
                }
            }
            try {
                var prefs = Components.classes["@mozilla.org/preferences-service;1"]
                    .getService(Components.interfaces.nsIPrefBranch);
                prefs.setCharPref("browser.startup.homepage", url);
            } catch (e) {
                alert("设置失败");
            }
        } else {
            alert("请用Ctrl+D将地址添加到收藏夹");
        }
        return this;
    };

    //获取浏览器信息
    //获取IE11存在Bug
    var getAgent = function () {
        var browser = {},
            ua = navigator.userAgent.toLowerCase(),
            rMsie = /(msie\s|trident.*rv:)([\w.]+)/,
            rFirefox = /(firefox)\/([\w.]+)/,
            rOpera = /(opera).+version\/([\w.]+)/,
            rChrome = /(chrome)\/([\w.]+)/,
            rSafari = /version\/([\w.]+).*(safari)/;

        var name = "",
            version = "0";

        var match = rMsie.exec(ua);
        if (match != null) {
            name = "IE";
            version = match[2] || "0";
        }
        var match = rFirefox.exec(ua);
        if (match != null) {
            name = match[1] || "";
            version = match[2] || "0";
        }
        var match = rOpera.exec(ua);
        if (match != null) {
            name = match[1] || "";
            version = match[2] || "0";
        }
        var match = rChrome.exec(ua);
        if (match != null) {
            name = match[1] || "";
            version = match[2] || "0";
        }
        var match = rSafari.exec(ua);
        if (match != null) {
            name = match[2] || "";
            version = match[1] || "0";
        }

        return {
            name: name,
            version: version.split(".")[0],
            versions: version
        };
    };

    if (!window.maple) {
        window.maple = {
            version: "0.1.0",
            toString: function () {
                //显示当前对象名称路径
                return "maple";
            },
            newGuid: newGuid,
            setHomepage: setHomepage,
            getAgent: getAgent,
            getHost: function () {
                //获取服务器IP或者域名
                return window.location.host.split(":")[0];
            },
            getLang: function () {
                //获取浏览器语言代码
                var nav = window.navigator;
                return (nav.language || nav.userLanguage);
            },
            getViewPort: function () {
                // 获取视图大小
                var e = window,
                    a = "inner";
                if (!("innerWidth" in window)) {
                    a = "client";
                    e = document.documentElement || document.body;
                }

                return {
                    width: e[a + "Width"],
                    height: e[a + "Height"]
                };
            },
            getPageUrl: function () {
                //获取当前URL
                return window.location.href.split("#")[0].split("?")[0];
            },
            getPageQueryString: getPageQueryString,
            goPrevPage: function () {
                history.go(-1);
                return this;
            },
            goNextPage: function () {
                history.go(1);
                return this;
            },
            refreshPage: function () {
                history.go(0);
                return this;
            },
            isExternalUrl: function (url) {
                //判断url是否为外部的链接
                if (typeof url === "string") {
                    url = url.toLowerCase();
                    return url.startsWith("http://") || url.startsWith("https://");
                }
                return false;
            },
            preventDefault: function (e) {
                //阻止浏览器默认行为
                if (e && e.preventDefault) {
                    e.preventDefault();
                } else {
                    // ie
                    window.event.returnValue = false;
                }
                return false;
            },
            getStaticFilePath: function () {
                return staticFilePath;
            },
            setStaticFilePath: function (path) {
                if (path) {
                    staticFilePath = path;
                }
            },
            getRootPath: function () {
                return rootPath;
            },
            setRootPath: function (path) {
                if (path) {
                    rootPath = path;
                }
            }
        };
    }
})();

/* ========================================================================
 * maple.progress.js
 * 定义 加载动画 相关的函数
 * 依赖NProgress，blockUI实现
 * ======================================================================== */
;
(function () {
    'use strict';
    var configure = function (options) {
        if (typeof NProgress != 'undefined') {
            var opts = $.extend(true, { parent: "body" }, options);
            NProgress.configure({ parent: '#container' });
        }
    };

    var myLoading = function () {
        // $(".page-loading").remove();
        // if (options) {
        //     var html = "<div class=\"page-loading\">";
        //     if (options.img) {
        //         html += "<img src=\"" + options.img + "\"/>";
        //     }
        //     html += "&nbsp;&nbsp;<span>";
        //     if (options.message) {
        //         html += options.message;
        //     } else {
        //         html += "加载中...";
        //     }
        //     html += "</span></div>";
        //     $("body").append(html);
        // } else {
        //     $("body").append("<div class=\"page-loading\">&nbsp;&nbsp;<span>加载中...</span></div>");
        // }
    };

    var myEndLoad = function () {
        // $(".page-loading").remove();
    };

    //开始加载动画
    var startPageLoading = function () {
        if (typeof NProgress != 'undefined') {
            NProgress.start();
        } else {
            myLoading();
        }
    };
    //结束加载动画
    var stopPageLoading = function () {
        if (typeof NProgress != 'undefined') {
            NProgress.done();
        } else {
            myEndLoad();
        }
    };

    var blockUI = function (options) {
        options = $.extend(true, {}, options);
        var html = '';
        if (options.animate) {
            html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '">' + '<div class="block-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>' + '</div>';
        } else if (options.iconOnly) {
            html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + maple.getStaticFilePath() + 'global/img/loading-spinner-grey.gif" align=""></div>';
        } else if (options.textOnly) {
            html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><span>&nbsp;&nbsp;' + (options.message ? options.message : '加载中...') + '</span></div>';
        } else {
            html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + maple.getStaticFilePath() + 'global/img/loading-spinner-grey.gif" align=""><span>&nbsp;&nbsp;' + (options.message ? options.message : '加载中...') + '</span></div>';
        }

        if (options.target) { // element blocking
            var el = $(options.target);
            if (el.height() <= ($(window).height())) {
                options.cenrerY = true;
            }
            el.block({
                message: html,
                baseZ: options.zIndex ? options.zIndex : 2000,
                centerY: options.cenrerY !== undefined ? options.cenrerY : false,
                css: {
                    top: '10%',
                    border: '0',
                    padding: '0',
                    backgroundColor: 'none'
                },
                overlayCSS: {
                    backgroundColor: options.overlayColor ? options.overlayColor : '#555',
                    opacity: options.boxed ? 0.05 : 0.1,
                    cursor: 'wait'
                }
            });
        } else { // page blocking
            $.blockUI({
                message: html,
                baseZ: options.zIndex ? options.zIndex : 2000,
                css: {
                    border: '0',
                    padding: '0',
                    backgroundColor: 'none'
                },
                overlayCSS: {
                    backgroundColor: options.overlayColor ? options.overlayColor : '#555',
                    opacity: options.boxed ? 0.05 : 0.1,
                    cursor: 'wait'
                }
            });
        }
    };

    var unblockUI = function (target) {
        if (target) {
            $(target).unblock({
                onUnblock: function () {
                    $(target).css('position', '');
                    $(target).css('zoom', '');
                }
            });
        } else {
            $.unblockUI();
        }
    };

    maple.progress = {
        toString: function () {
            return 'maple.progress';
        },
        configure: configure,
        startPageLoading: startPageLoading,
        stopPageLoading: stopPageLoading,
        blockUI: blockUI,
        unblockUI: unblockUI
    };
})();

/* ========================================================================
* maple.msg.js
* 定义页面消息相关的基础函数
* 依赖 toastr 实现
* ======================================================================== */
;
(function () {
    'use strict';
    var defaultOpts = {
        "closeButton": true,
        "debug": false,
        "positionClass": "toast-top-center",
        "onclick": null,
        "showDuration": "1000",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    var configure = function (options) {
        if (typeof toastr != 'undefined') {
            var opts = $.extend(true, defaultOpts, options);
            toastr.options = opts;
        }
    };

    maple.msg = {
        toString: function () {
            return 'maple.msg';
        },
        configure: configure,
        success: function (msg, title) {
            if (!title) title = "系统提示";
            if (typeof toastr != 'undefined') toastr.success(msg, title);
        },
        error: function (msg, title) {
            if (!title) title = "系统提示";
            if (typeof toastr != 'undefined') toastr.error(msg, title);
        },
        warning: function (msg, title) {
            if (!title) title = "系统提示";
            if (typeof toastr != 'undefined') toastr.warning(msg, title);
        },
        info: function (msg, title) {
            if (!title) title = "系统提示";
            if (typeof toastr != 'undefined') toastr.info(msg, title);
        },
        clear: function () {
            if (typeof toastr != 'undefined') toastr.clear();
        }
    };
    //按照系统默认参数进行设置
    maple.msg.configure();
})();
 
/* ========================================================================
 * maple.form.js
 * 定义页面表单相关的基础函数
 * ======================================================================== */
;
(function () {
    'use strict';

    /**
	 * 查找符合条件的输入标签。
	 *
	 * @method _findInputs
	 * @param {Array} inputs jQuery输入标签数组
	 * @param {String} key 查询关键字
	 * @return {Array} inputs jQuery对象数组
	 */
    var _findInputs = function (inputs, key) {
        return $(inputs.filter('input[name=' + key + '],input[id=' + key
            + '],textarea[name=' + key + '],textarea[id=' + key
            + '],select[name=' + key + '],select[id=' + key + ']'));
    };
    /**
	 * 获取合法的输入标签。
	 *
	 * @method _filterInputs
	 * @param {Object} container jQuery对象，标签容器
	 * @return {Array} inputs jQuery对象数组
	 */
    var _filterInputs = function (container) {
        return $(container
            .find('input[type!=button][type!=reset][type!=submit][type!=image][type!=file],select,textarea'));
    };

	/**
	 * 将输入控件集合序列化成对象， 名称或编号作为键，value属性作为值。
	 *
	 * @method _serializeInputs
	 * @param {Array} inputs input/select/textarea的对象集合
	 * @return {Object} json 对象 {key:value,...}
	 */
    var _serializeInputs = function (inputs) {
        var json = {};
        if (!inputs) {
            return json;
        }
        for (var i = inputs.length - 1; i >= 0; i--) {
            var input = $(inputs[i]), type = input.attr('type');
            if (type) {
                type = type.toLowerCase();
            }
            var tagName = input.get(0).tagName,
                id = input.attr('id'),
                name = input.attr('name'),
                value = null;

            // 如果input未设置ID或NAME，那么则跳出
            if (typeof id == 'undefined' && typeof name == 'undefined') {
                continue;
            }

            // input输入标签
            if (tagName == 'INPUT' && type) {
                switch (type) {
                    case 'checkbox':
                        value = input.is(':checked');
                        break;
                    case 'radio':
                        if (input.is(':checked')) {
                            value = input.attr('value');
                        } else {
                            continue;
                        }
                        break;
                    default:
                        value = input.val();
                }
            } else {
                // 非input输入标签，如：select,textarea
                value = input.val();
            }

            json[name || id] = value;
        }
        return json;
    };

    /**
         * 将值填充到输入标签里面。
         *
         * @method _deserializeInputs
         * @param {Array} inputs 输入标签集合
         * @param {String/Number} value 值
         * @return {Object} iTsai.form
         */
    var _deserializeInputs = function (inputs, value) {
        if (!inputs && value == null) {
            return this;
        }

        for (var i = inputs.length - 1; i >= 0; i--) {
            var input = $(inputs[i]);
            var type = input.attr('type');
            if (type) {
                type = type.toLowerCase();
            }
            if (type) {
                switch (type) {
                    case 'checkbox':
                        input.prop('checked', value);
                        break;
                    case 'radio':
                        input.each(function (i) {
                            var thiz = $(this);
                            if (thiz.attr('value') == value) {
                                thiz.prop('checked', true);
                            }
                        });
                        break;
                    default:
                        input.val(value);
                }
            } else {
                input.val(value);
            }
        }
        return this;
    };

    /**
	 * 序列化表单值,结果以key/value形式返回key为表单对象名称(name||id),value为其值。<br>
	 * HTML格式：<br>
	 * 1).表单容器：通常是一个form表单（如果不存在就以body为父容器）
	 * 2).输入标签：输入标签为input类型标签（包括：'checkbox','color','date','datetime','datetime-local',<br>
	 * 'email','file','hidden','month','number','password','radio','range
	 * ','reset','search','submit',<br>
	 * 'tel','text','time ','url','week'）。
	 * 而'button','reset','submit','image'会被过虑掉。
	 *
	 * @method serialize
	 * @param {Object} frm jQuery表单对象
	 * @return {Object} json对象
	 */
    var serialize = function (frm) {
        frm = frm || $('body');
        if (!frm) {
            return {};
        }
        var inputs = _filterInputs(frm);
        return _serializeInputs(inputs);
    };

    /**
	 * 填充表单内容：将json数据形式数据填充到表单内
	 *
	 * @method deserialize
	 * @param {Object} frm jQuery表单对象（或其它容器标签对象，如：div）
	 * @param {Object} json 序列化好的json数据对象
	 * @return {Object} iTsai.form
	 */
    var deserialize = function (json, frm) {
        frm = frm || $("body");
        if (!frm || !json) {
            return this;
        }

        //将所有radio还原为默认值
        frm.find("input[type=radio]").prop('checked', false);
        //再执行赋值
        var inputs = _filterInputs(frm);
        for (var key in json) {
            var value = json[key],
                input = _findInputs(inputs, key);
            _deserializeInputs(input, value);
        }

        return this;
    };

    maple.form = {
        toString: function () {
            return 'maple.form';
        },
        serialize: serialize,
        deserialize: deserialize
    };
})();

/* ========================================================================
 * maple.ajax.js
 * 定义异步ajax请求相关的基础函数
 * ======================================================================== */
;
(function (window, $) {
    'use strict';

    var defaultOpts = {
        cache: false
    };
    //调整ajax默认设置
    var ajaxDefaultSetting = function (options) {
        var opts = $.extend(true, defaultOpts, options);
        $.ajaxSetup(opts);

        // $(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
    };

    maple.ajax = {
        toString: function () {
            return 'maple.ajax';
        },
        ajaxDefaultSetting: ajaxDefaultSetting
    };
    maple.ajax.ajaxDefaultSetting();
})(window, jQuery);

/* ========================================================================
 * maple.storeb.js
 * 定义 本地存储 相关的基础函数
 * ======================================================================== */
;
(function (window, $) {
    'use strict';

    var lsName = "localStorage";
    var storage,
        dataset,
        pageName = "page_" + window.location.pathname + window.location.search + window.location.hash;

    /* The Store object */
    var Store = function () {
        this.slience = true;
        try {
            if ((lsName in window) && window[lsName] && window[lsName].setItem) {
                this.enable = true;
                storage = window[lsName];
            }
        } catch (e) { }
        if (!this.enable) {
            dataset = {};
            storage = {
                getLength: function () {
                    var length = 0;
                    $.each(dataset, function () {
                        length++;
                    });
                    return length;
                },
                key: function (index) {
                    var key, i = 0;
                    $.each(dataset, function (k) {
                        if (i === index) {
                            key = k;
                            return false;
                        }
                        i++;
                    });
                    return key;
                },
                removeItem: function (key) {
                    delete dataset[key];
                },
                getItem: function (key) {
                    return dataset[key];
                },
                setItem: function (key, val) {
                    dataset[key] = val;
                },
                clear: function () {
                    dataset = {};
                }
            };
        }
        this.storage = storage;
        this.page = this.get(pageName, {});
    };

    /* Save page data */
    Store.prototype.pageSave = function () {
        if ($.isEmptyObject(this.page)) {
            this.remove(pageName);
        } else {
            var forDeletes = [],
                i;
            for (i in this.page) {
                var val = this.page[i];
                if (val === null)
                    forDeletes.push(i);
            }
            for (i = forDeletes.length - 1; i >= 0; i--) {
                delete this.page[forDeletes[i]];
            }
            this.set(pageName, this.page);
        }
    };

    /* Remove page data item */
    Store.prototype.pageRemove = function (key) {
        if (typeof this.page[key] != "undefined") {
            this.page[key] = null;
            this.pageSave();
        }
    };

    /* Clear page data */
    Store.prototype.pageClear = function () {
        this.page = {};
        this.pageSave();
    };

    /* Get page data */
    Store.prototype.pageGet = function (key, defaultValue) {
        var val = this.page[key];
        return (defaultValue !== undefined && (val === null || val === undefined)) ? defaultValue : val;
    };

    /* Set page data */
    Store.prototype.pageSet = function (objOrKey, val) {
        if ($.isPlainObject(objOrKey)) {
            $.extend(true, this.page, objOrKey);
        } else {
            this.page[this.serialize(objOrKey)] = val;
        }
        this.pageSave();
    };

    /* Check enable status */
    Store.prototype.check = function () {
        if (!this.enable) {
            if (!this.slience) throw new Error("Browser not support localStorage or enable status been set true.");
        }
        return this.enable;
    };

    /* Get length */
    Store.prototype.length = function () {
        if (this.check()) {
            return storage.getLength ? storage.getLength() : storage.length;
        }
        return 0;
    };

    /* Remove item with browser localstorage native method */
    Store.prototype.removeItem = function (key) {
        storage.removeItem(key);
        return this;
    };

    /* Remove item with browser localstorage native method, same as removeItem */
    Store.prototype.remove = function (key) {
        return this.removeItem(key);
    };

    /* Get item value with browser localstorage native method, and without deserialize */
    Store.prototype.getItem = function (key) {
        return storage.getItem(key);
    };

    /* Get item value and deserialize it, if value is null and defaultValue been given then return defaultValue */
    Store.prototype.get = function (key, defaultValue) {
        var val = this.deserialize(this.getItem(key));
        if (typeof val === "undefined" || val === null) {
            if (typeof defaultValue !== "undefined") {
                return defaultValue;
            }
        }
        return val;
    };

    /* Get item key by index and deserialize it */
    Store.prototype.key = function (index) {
        return storage.key(index);
    };

    /* Set item value with browser localstorage native method, and without serialize filter */
    Store.prototype.setItem = function (key, val) {
        storage.setItem(key, val);
        return this;
    };

    /* Set item value, serialize it if the given value is not an string */
    Store.prototype.set = function (key, val) {
        if (val === undefined) return this.remove(key);
        this.setItem(key, this.serialize(val));
        return this;
    };

    /* Clear all items with browser localstorage native method */
    Store.prototype.clear = function () {
        storage.clear();
        return this;
    };

    /* Iterate all items with callback */
    Store.prototype.forEach = function (callback) {
        var length = this.length();
        for (var i = length - 1; i >= 0; i--) {
            var key = storage.key(i);
            callback(key, this.get(key));
        }
        return this;
    };

    /* Get all items and set value in an object. */
    Store.prototype.getAll = function () {
        var all = {};
        this.forEach(function (key, val) {
            all[key] = val;
        });

        return all;
    };

    /* Serialize value with JSON.stringify */
    Store.prototype.serialize = function (value) {
        if (typeof value === "string") return value;
        return JSON.stringify(value);
    };

    /* Deserialize value, with JSON.parse if the given value is not a string */
    Store.prototype.deserialize = function (value) {
        if (typeof value !== "string") return undefined;
        try {
            return JSON.parse(value);
        } catch (e) {
            return value || undefined;
        }
    };

    maple.store = new Store();

})(window, jQuery);

/* ========================================================================
 * tree.js
 * ======================================================================== */
(function ($) {
    "use strict";

    var name = "maple.tree"; // modal name
    var globalId = 0;

    // The tree modal class
    var Tree = function (element, options) {
        this.name = name;
        this.$ = $(element);

        this.getOptions(options);
        this._init();
    };

    var DETAULT_ACTIONS = {
        sort: {
            template: '<a class="sort-handler" href="javascript:;"><i class="glyphicon glyphicon-sort"></i></a>'
        },
        add: {
            template: '<a href="javascript:;"><i class="glyphicon glyphicon-plus"></i></a>'
        },
        edit: {
            template: '<a href="javascript:;"><i class="glyphicon glyphicon-pencil"></i></a>'
        },
        "delete": {
            template: '<a href="javascript:;"><i class="glyphicon glyphicon-trash"></i></a>'
        }
    };

    function formatActions(actions, parentActions) {
        if (actions === false) return actions;
        if (!actions) return parentActions;

        if (actions === true) {
            actions = {
                add: true,
                "delete": true,
                edit: true,
                sort: true
            };
        } else if (typeof actions === 'string') {
            actions = actions.split(',');
        }
        var _actions;
        if ($.isArray(actions)) {
            _actions = {};
            $.each(actions, function (idx, action) {
                if ($.isPlainObject(action)) {
                    _actions[action.action] = action;
                } else {
                    _actions[action] = true;
                }
            });
            actions = _actions;
        }
        if ($.isPlainObject(actions)) {
            _actions = {};
            $.each(actions, function (name, action) {
                if (action) {
                    _actions[name] = $.extend({
                        type: name
                    }, DETAULT_ACTIONS[name], $.isPlainObject(action) ? action : null);
                } else {
                    _actions[name] = false;
                }
            });
            actions = _actions;
        }
        return parentActions ? $.extend(true, {}, parentActions, actions) : actions;
    }

    function createActionEle(action, name, template) {
        name = name || action.type;
        return $(template || action.template).addClass('tree-action').attr($.extend({
            'data-type': name,
            title: action.title || ''
        }, action.attr)).data('action', action);
    }

    // default options
    Tree.DEFAULTS = {
        animate: null,
        initialState: 'normal', // 'normal' | 'preserve' | 'expand' | 'collapse',
        toggleTemplate: '<i class="list-toggle glyphicon"></i>'
        // sortable: false, //
    };

    Tree.prototype.add = function (rootEle, items, expand, disabledAnimate, notStore) {
        var $e = $(rootEle),
            $ul, options = this.options;
        if ($e.is('li')) {
            $ul = $e.children('ul');
            if (!$ul.length) {
                $ul = $('<ul/>');
                $e.append($ul);
                this._initList($ul, $e);
            }
        } else {
            $ul = $e;
        }

        if ($ul) {
            var that = this;
            if (!$.isArray(items)) {
                items = [items];
            }
            $.each(items, function (idx, item) {
                var $li = $('<li/>').data(item).appendTo($ul);
                if (item.id !== undefined) $li.attr('data-id', item.id);
                var $wrapper = options.itemWrapper ? $(options.itemWrapper === true ? '<div class="tree-item-wrapper"/>' : options.itemWrapper).appendTo($li) : $li;
                if (item.html) {
                    $wrapper.html(item.html)
                } else if ($.isFunction(that.options.itemCreator)) {
                    var itemContent = that.options.itemCreator($li, item);
                    if (itemContent !== true && itemContent !== false) $wrapper.html(itemContent);
                } else if (item.url) {
                    $wrapper.append($('<a/>', {
                        href: item.url
                    }).text(item.title || item.name));
                } else {
                    $wrapper.append($('<span/>').text(item.title || item.name));
                }
                that._initItem($li, item.idx || idx, $ul, item);
                if (item.children && item.children.length) {
                    that.add($li, item.children);
                }
            });
            this._initList($ul);
            if (expand && !$ul.hasClass('tree')) {
                that.expand($ul.parent('li'), disabledAnimate, notStore);
            }
        }
    };

    Tree.prototype.reload = function (data) {
        var that = this;

        if (data) {
            that.$.empty();
            that.add(that.$, data);
        }

        if (that.isPreserve) {
            if (that.store.time) {
                that.$.find('li:not(.tree-action-item)').each(function () {
                    var $li = $(this);
                    that[that.store[$li.data('id')] ? 'expand' : 'collapse']($li, true, true);
                });
            }
        }
    };

    Tree.prototype._initList = function ($list, $parentItem, idx, data) {
        var that = this;
        if (!$list.hasClass('tree')) {
            $parentItem = ($parentItem || $list.closest('li')).addClass('has-list');
            if (!$parentItem.find('.list-toggle').length) {
                $parentItem.prepend(this.options.toggleTemplate);
            }
            idx = idx || $parentItem.data('idx');
        } else {
            idx = 0;
            $parentItem = null;
        }
        var $children = $list.attr('data-idx', idx || 0).children('li:not(.tree-action-item)').each(function (index) {
            that._initItem($(this), index + 1, $list);
        });
        if ($children.length === 1 && !$children.find('ul').length) {
            $children.addClass('tree-single-item');
        }
        data = data || ($parentItem ? $parentItem.data() : null);
        var actions = formatActions(data ? data.actions : null, this.actions);
        if (actions) {
            if (actions.add && actions.add.templateInList !== false) {
                var $actionItem = $list.children('li.tree-action-item');
                if (!$actionItem.length) {
                    $('<li class="tree-action-item"/>').append(createActionEle(actions.add, 'add', actions.add.templateInList)).appendTo($list);
                } else {
                    $actionItem.detach().appendTo($list);
                }
            }
            if (actions.sort) {
                $list.sortable($.extend({
                    dragCssClass: 'tree-drag-holder',
                    trigger: '.sort-handler',
                    selector: 'li:not(.tree-action-item)',
                    finish: function (e) {
                        that.callEvent('action', {
                            action: actions.sort,
                            $list: $list,
                            target: e.target,
                            item: data
                        });
                    }
                }, actions.sort.options, $.isPlainObject(this.options.sortable) ? this.options.sortable : null));
            }
        }
        if ($parentItem && ($parentItem.hasClass('open') || (data && data.open))) {
            $parentItem.addClass('open in');
        }
    };

    Tree.prototype._initItem = function ($item, idx, $parentList, data) {
        if (idx === undefined) {
            var $pre = $item.prev('li');
            idx = $pre.length ? ($pre.data('idx') + 1) : 1;
        }
        $parentList = $parentList || $item.closest('ul');
        $item.attr('data-idx', idx).removeClass('tree-single-item');
        if (!$item.data('id')) {
            var id = idx;
            if (!$parentList.hasClass('tree')) {
                id = $parentList.parent('li').data('id') + '-' + id;
            }
            $item.attr('data-id', id);
        }
        data = data || $item.data();
        var actions = formatActions(data.actions, this.actions);
        if (actions) {
            var $actions = $item.find('.tree-actions');
            if (!$actions.length) {
                $actions = $('<div class="tree-actions"/>').appendTo(this.options.itemWrapper ? $item.find('.tree-item-wrapper') : $item);
                $.each(actions, function (actionName, action) {
                    if (action) $actions.append(createActionEle(action, actionName));
                });
            }
        }

        var $children = $item.children('ul');
        if ($children.length) {
            this._initList($children, $item, idx, data);
        }
    };

    Tree.prototype._init = function () {
        var options = this.options,
            that = this;
        this.actions = formatActions(options.actions);

        this.$.addClass('tree');
        if (options.animate) this.$.addClass('tree-animate');

        this._initList(this.$);

        var initialState = options.initialState;
        var isPreserveEnable = maple && maple.store && maple.store.enable;
        if (isPreserveEnable) {
            this.selector = name + '::' + (options.name || '') + '#' + (this.$.attr('id') || globalId++);
            this.store = maple.store[options.name ? 'get' : 'pageGet'](this.selector, {});
        }
        if (initialState === 'preserve') {
            if (isPreserveEnable) this.isPreserve = true;
            else this.options.initialState = initialState = 'normal';
        }

        // init data
        this.reload(options.data);
        if (isPreserveEnable) this.isPreserve = true;

        if (initialState === 'expand') {
            this.expand();
        } else if (initialState === 'collapse') {
            this.collapse();
        }

        // Bind event
        this.$.on('click', '.list-toggle,a[href="#"],.tree-toggle', function (e) {
            var $this = $(this);
            var $li = $this.parent('li');
            that.callEvent('hit', {
                target: $li,
                item: $li.data()
            });
            that.toggle($li);
            if ($this.is('a')) e.preventDefault();
        }).on('click', '.tree-action', function () {
            var $action = $(this);
            var action = $action.data();
            if (action.action) action = action.action;
            if (action.type === 'sort') return;
            var $li = $action.closest('li:not(.tree-action-item)');
            that.callEvent('action', {
                action: action,
                target: this,
                $item: $li,
                item: $li.data()
            });
        });
    };

    Tree.prototype.preserve = function ($li, id, expand) {
        if (!this.isPreserve) return;
        if ($li) {
            id = id || $li.data('id');
            expand = expand === undefined ? $li.hasClass('open') : false;
            if (expand) this.store[id] = expand;
            else delete this.store[id];
            this.store.time = new Date().getTime();
            maple.store[this.options.name ? 'set' : 'pageSet'](this.selector, this.store);
        } else {
            var that = this;
            this.store = {};
            this.$.find('li').each(function () {
                that.preserve($(this));
            });
        }
    };

    Tree.prototype.expand = function ($li, disabledAnimate, notStore) {
        if ($li) {
            $li.addClass('open');
            if (!disabledAnimate && this.options.animate) {
                setTimeout(function () {
                    $li.addClass('in');
                }, 10);
            } else {
                $li.addClass('in');
            }
        } else {
            $li = this.$.find('li.has-list').addClass('open in');
        }
        if (!notStore) this.preserve($li);
        this.callEvent('expand', $li, this);
    };

    Tree.prototype.show = function ($lis, disabledAnimate, notStore) {
        var that = this;
        $lis.each(function () {
            var $li = $(this);
            that.expand($li, disabledAnimate, notStore);
            if ($li) {
                var $ul = $li.parent('ul');
                while ($ul && $ul.length && !$ul.hasClass('tree')) {
                    var $parentLi = $ul.parent('li');
                    if ($parentLi.length) {
                        that.expand($parentLi, disabledAnimate, notStore);
                        $ul = $parentLi.parent('ul');
                    } else {
                        $ul = false;
                    }
                }
            }
        });
    };

    Tree.prototype.collapse = function ($li, disabledAnimate, notStore) {
        if ($li) {
            if (!disabledAnimate && this.options.animate) {
                $li.removeClass('in');
                setTimeout(function () {
                    $li.removeClass('open');
                }, 300);
            } else {
                $li.removeClass('open in');
            }
        } else {
            $li = this.$.find('li.has-list').removeClass('open in');
        }
        if (!notStore) this.preserve($li);
        this.callEvent('collapse', $li, this);
    };

    Tree.prototype.toggle = function ($li) {
        var collapse = ($li && $li.hasClass('open')) || $li === false || ($li === undefined && this.$.find('li.has-list.open').length);
        this[collapse ? 'collapse' : 'expand']($li);
    };

    // Get and init options
    Tree.prototype.getOptions = function (options) {
        this.options = $.extend({}, Tree.DEFAULTS, this.$.data(), options);
        if (this.options.animate === null && this.$.hasClass('tree-animate')) {
            this.options.animate = true;
        }
    };

    Tree.prototype.toData = function ($ul, filter) {
        if ($.isFunction($ul)) {
            filter = $ul;
            $ul = null;
        }
        $ul = $ul || this.$;
        var that = this;
        return $ul.children('li:not(.tree-action-item)').map(function () {
            var $li = $(this);
            var data = $li.data();
            delete data['maple.droppable'];
            var $children = $li.children('ul');
            if ($children.length) data.children = that.toData($children);
            return $.isFunction(filter) ? filter(data, $li) : data;
        }).get();
    };

    // Call event helper
    Tree.prototype.callEvent = function (name, params) {
        var result;
        if ($.isFunction(this.options[name])) {
            result = this.options[name](params, this);
        }
        this.$.trigger($.Event(name + '.' + this.name, params));
        return result;
    };

    // Extense jquery element
    $.fn.tree = function (option, params) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data(name);
            var options = typeof option == 'object' && option;

            if (!data) $this.data(name, (data = new Tree(this, options)));

            if (typeof option == 'string') data[option](params);
        });
    };

    $.fn.tree.Constructor = Tree;

    // Auto call tree after document load complete
    $(function () {
        $('[data-ride="tree"]').tree();
    });
}(jQuery));