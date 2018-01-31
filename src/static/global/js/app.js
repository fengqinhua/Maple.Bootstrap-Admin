/* ========================================================================
 * Maple: App.js [1.0.0]
 * https://github.com/fengqinhua/Maple.Bootstrap-Admin
 * ========================================================================
 * Copyright (c) 2018; Licensed MIT
 *
 * ! Some code copy from zui 1.8.1 by QingDao Nature Easy Soft Network Technology Co,LTD  @easysoft cnezsoft.com. (Copyright (c) 2018 cnezsoft.com; Licensed MIT)
 * ! The file has been changed in Maple. It will not keep update with the ZUI version in the future.
 * ======================================================================== */

;
var App = function () {
    var isIE8 = false;
    var isIE9 = false;
    var isIE10 = false;
    var storageEnable = false; //是否可以使用本地存储  

    // 初始化设置
    var handleInit = function () {
        isIE8 = !!navigator.userAgent.match(/MSIE 8.0/);
        isIE9 = !!navigator.userAgent.match(/MSIE 9.0/);
        isIE10 = !!navigator.userAgent.match(/MSIE 10.0/);

        if (isIE10) {
            $("html").addClass("ie10"); // detect IE10 version
        }

        if (isIE10 || isIE9 || isIE8) {
            $("html").addClass("ie"); // detect IE10 version
        }
    };
    //调整ajax默认设置
    var ajaxDefaultSetting = function () {
        $.ajaxSetup({
            cache: false
        });
    };
    //检查是否可以使用本地存储
    var checkLocalDB = function () {
        storageEnable = App.store && App.store.enable;
    };

    return {
        init: function () {
            handleInit();
            checkLocalDB(); //检查是否可以使用本地存储
            ajaxDefaultSetting(); //设置ajax的默认参数
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
        getCurrentUrl: function () {
            return window.location.href.split('#')[0].split('?')[0];
        },
        getQueryString: function (name, defaultValue) {
            //读取查询参数
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r !== null) {
                return unescape(r[2]);
            }else{
                var items = window.location.hash.split("?");
                if(items.length >1){
                    r = items[items.length-1].match(reg);
                    if (r !== null) return unescape(r[2]);
                }
            }
            return defaultValue;
        },
        isExternalUrl: function (url) {
            //判断url是否为外部的链接
            if (typeof url === "string") {
                url = url.toLowerCase();
                return url.startsWith("http://") || url.startsWith("https://");
            }
            return false;
        },
        isIE8: function () {
            //检查是否为IE8
            return isIE8;
        },
        isIE9: function () {
            //检查是否为IE9
            return isIE9;
        },
        isStorageEnable: function () {
            //本地存储是否可用
            return storageEnable;
        },
        //开始加载等待
        startPageLoading: function (options) {
            NProgress.start();
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
        },
        //结束加载等待
        stopPageLoading: function () {
            NProgress.done();
            // $(".page-loading").remove();
        },
        UseNprogress: function (options) {
            options = $.extend(true, {}, options);
            if (options.parent) {
                NProgress.configure({
                    parent: options.parent
                });
            }
        }
    };
}();

jQuery(document).ready(function () {
    App.init(); // init metronic core componets
});


/* ========================================================================
 * string.js
 * ======================================================================== */
(function () {
    'use strict';

    /**
     * Format string with argument list or object
     * @param  {object | arguments} args
     * @return {String}
     */
    if (!String.prototype.format) {
        String.prototype.format = function (args) {
            var result = this;
            if (arguments.length > 0) {
                var reg;
                if (arguments.length <= 2 && typeof (args) == 'object') {
                    for (var key in args) {
                        if (args[key] !== undefined) {
                            reg = new RegExp('(' + (arguments[1] ? arguments[1].replace('0', key) : '{' + key + '}') + ')', 'g');
                            result = result.replace(reg, args[key]);
                        }
                    }
                } else {
                    for (var i = 0; i < arguments.length; i++) {
                        if (arguments[i] !== undefined) {
                            reg = new RegExp('({[' + i + ']})', 'g');
                            result = result.replace(reg, arguments[i]);
                        }
                    }
                }
            }
            return result;
        };
    }

    /**
     * Judge the string is a integer number
     *
     * @access public
     * @return bool
     */
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
    }

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
    }

    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function (searchString, position) {
            position = position || 0;
            return this.lastIndexOf(searchString, position) === position;
        };
    }

    if (!String.prototype.includes) {
        String.prototype.includes = function () {
            return String.prototype.indexOf.apply(this, arguments) !== -1;
        };
    }

})();

/* ========================================================================
 * 扩展jquery插件功能，实现序列化Json数据的方法
 * ======================================================================== */
(function($){  
    $.fn.serializeJson=function(){  
        var serializeObj={};  
        var array=this.serializeArray();  
        $(array).each(function(){  
            if(serializeObj[this.name]){  
                if($.isArray(serializeObj[this.name])){  
                    serializeObj[this.name].push(this.value);  
                }else{  
                    serializeObj[this.name]=[serializeObj[this.name],this.value];  
                }  
            }else{  
                serializeObj[this.name]=this.value;   
            }  
        });  
        return serializeObj;  
    };  
})(jQuery);  

/* ========================================================================
 * storeb.js
 * ======================================================================== */
(function (window, $) {
    'use strict';

    var lsName = 'localStorage';
    var storage,
        dataset,
        pageName = 'page_' + window.location.pathname + window.location.search;

    /* The Store object */
    var Store = function () {
        this.slience = true;
        try {
            if ((lsName in window) && window[lsName] && window[lsName].setItem) {
                this.enable = true;
                storage = window[lsName];
            }
        } catch (e) {}
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
        if (typeof this.page[key] != 'undefined') {
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
            if (!this.slience) throw new Error('Browser not support localStorage or enable status been set true.');
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
        if (typeof val === 'undefined' || val === null) {
            if (typeof defaultValue !== 'undefined') {
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
        if (typeof value === 'string') return value;
        return JSON.stringify(value);
    };

    /* Deserialize value, with JSON.parse if the given value is not a string */
    Store.prototype.deserialize = function (value) {
        if (typeof value !== 'string') return undefined;
        try {
            return JSON.parse(value);
        } catch (e) {
            return value || undefined;
        }
    };

    App.store = new Store();

}(window, jQuery));


/* ========================================================================
 * tree.js
 * ======================================================================== */
(function ($) {
    'use strict';

    var name = 'maple.tree'; // modal name
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
        var isPreserveEnable = App && App.store && App.store.enable;
        if (isPreserveEnable) {
            this.selector = name + '::' + (options.name || '') + '#' + (this.$.attr('id') || globalId++);
            this.store = App.store[options.name ? 'get' : 'pageGet'](this.selector, {});
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
            App.store[this.options.name ? 'set' : 'pageSet'](this.selector, this.store);
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