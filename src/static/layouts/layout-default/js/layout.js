/**
处理整个页面布局的组件
**/
;
var Layout = function () {
    var defalutHomePageUrl = "#../templates/page-home.html",
        pageLoadErrorMsg = "<div class=\"error-text\"><i class=\"glyphicon glyphicon-exclamation-sign\"></i>加载失败，请检查网络重试,或者联系系统管理员。</div>",
        api_identity_info = "../api/IdentityInfo.json",
        data_identity_info, //当前用户身份信息
        $body, //body
        $myPageContent, //PageContent
        isSupportHashChange, //标识当前浏览器是否支持hashchang事件
        isPageOpening = false, //标识当前是否正在加载页面
        hasOpenedPage = false, //标识已存在加载完成的页面
        lastOpenPageUrl = "", //最近一次已加载的页面
        lastPageLoadCall, //最近一次页面加载的异步函数标识
        debug = true; //标识是否打印debug信息

    // 设置皮肤
    var switchTheme = function (theme) {
        var defaultTheme = "blue";
        if (theme == null) {
            theme = $.cookie("mapleCurrentTheme") == null ? defaultTheme : $.cookie("mapleCurrentTheme");
        }

        if (theme != defaultTheme) {
            $("#bootstrap-theme").attr("href", "../static/global/plugins/bootstrap/theme/bootstrap-" + theme + ".min.css");
            $("#maple-theme").attr("href", "../static/layouts/layout-default/css/themes/" + theme + ".css");
        }
    };

    //初始化主页面
    var loadHomePage = function () {
        loadIdentityInfo(function (data, datatype) {
            if (data == null) {
                //如果数据加载失败，则跳转至500页面
                window.location.href = "page-500.html";
                return;
            }
            //初始化菜单栏
            if (data.menus !== undefined) {
                $("#myTreeMenu").tree({
                    data: data.menus,
                    itemCreator: function ($li, item) {
                        if (item.icon !== undefined) {
                            $li.append($("<a/>", {
                                href: item.url
                            }).html("<i class=\"" + item.icon + "\"></i>" + item.title));
                        } else {
                            $li.append($("<a/>", {
                                href: item.url
                            }).text(item.title));
                        }
                    }
                });
            }
            //初始化当前用户信息
            if (data.name !== undefined) {
                $("#myUserName").text(data.name);
            }
            //选中当前模块
            handleClickTreeMenu();
            var hash = window.location.hash;
            openModule(hash);
        });
    };

    //加载身份信息并执行后处理
    var loadIdentityInfo = function (callback, delayLoadRemote, waitRemote) {
        if (data_identity_info != null) {
            if (debug) console.log("data_identity_info from Memory :", data_identity_info);
            if (!waitRemote) {
                callback(data_identity_info, "catch");
                return;
            }
        }

        var loadFromRemote = function () {
            $.ajax({
                url: api_identity_info,
                type: "GET",
                dataType: "json",
                success: function (data) {
                    if (data !== null) {
                        data_identity_info = data;
                        callback(data, "remote");
                    } else {
                        if (debug) console.log("Failed load data_identity_info from api " + api_identity_info);
                        callback(null, "error");
                    }
                },
                error: function () {
                    if (debug) console.log("Failed load data_identity_info from api " + api_identity_info);
                    callback(null, "error");
                }
            });
        }

        if (delayLoadRemote !== false) {
            if (delayLoadRemote) {
                setTimeout(loadFromRemote, delayLoadRemote);
            } else {
                loadFromRemote();
            }
        }
    };

    // 页面滚动至指定高度
    var scrollPageTo = function (el, offeset) {
        var pos = (el && el.size() > 0) ? el.offset().top : 0;
        if (el) {
            if ($("body").hasClass("page-header-fixed")) {
                pos = pos - $("#myPageHeader").height();
            }
            pos = pos + (offeset ? offeset : -1 * el.height());
        }

        $("html,body").animate({
            scrollTop: pos
        }, "slow");
    };

    //打开一个模块 如果浏览器支持hash chang 事件，那么则改变hash即可
    //如果不支持，那么需要人工打开
    var openModule = function (url) {
        if (typeof url === 'undefined' || url === null || url === "") {
            url = defalutHomePageUrl;
        }

        if (url === "#") return;
        if (url.startsWith("#") && url.length > 1) {
            $("#myTreeMenu li:not(.has-list)").each(function () {
                if ($(this).find("a").attr("href") === url) {
                    $("#myTreeMenu li.active").removeClass("active");
                    $(this).addClass('active');
                }
            });

            if (isSupportHashChange && window.location.hash !== url) {
                window.location.hash = url; //如果支持hashchang 那么则修改hash触发该事件
            } else {
                openPageAsyn(url);
            }
        } else {
            if (maple.isExternalUrl(url)) {
                window.open(url, "_blank");
            } else {
                window.location.href = url;
            }
        }
    };

    //刷新当前模块
    var refrashModule = function () {
        openPageAsyn(window.location.hash);
    };

    //注册菜单的点击事件
    var handleClickTreeMenu = function () {
        $("#myTreeMenu").on("click", "a", function (e) {
            e.preventDefault();
            var urlHash = $(this).attr("href");
            if (urlHash == "#") {
                var $li = $(this).parent();
                if (!$li.hasClass("has-list")) {
                    $("#myTreeMenu li.active").removeClass("active");
                    $(this).closest("li").addClass("active");
                }
            } else {
                openModule(urlHash);
            }
        });
    };

    //检测浏览器是否支持HashChange
    var checkSupportHashChange = function () {
        if (('onhashchange' in window) &&
            ((typeof document.documentMode === 'undefined') || document.documentMode == 8)) {
            isSupportHashChange = true;
        } else {
            isSupportHashChange = false;
        }
    };

    //URL Hash 发生变化，用于处理浏览器的前进与后退
    var handleUrlHashChange = function () {
        if (isSupportHashChange) {
            //路由切换
            if (window.addEventListener) {
                window.addEventListener("hashchange", function () {
                    openPageAsyn(window.location.hash);
                });
            } else {
                window.attachEvent("onhashchange", function () {
                    openPageAsyn(window.location.hash);
                });
            }

        }
    };

    //异步打开页面
    var openPageAsyn = function (url) {
        if (url == "" || url == "#") return;

        url = url.substr(1);
        //页面正在加载中且加载的URL与当前URL一致，那么则返回
        if (isPageOpening && url === lastOpenPageUrl) {
            if (debug) console.log("the same url is loading ..." + url);
            return;
        }

        //开始加载
        //打开等待动画DIV
        // maple.progress.configure({
        //     img: "../static/layouts/layout-default/img/loading-spinner-grey.gif",
        //     message: "加载中..."
        // });
        maple.progress.startPageLoading();

        //执行页面加载
        loadPageInfo(url, function (data, dataType) {
            if (dataType === "remote") {
                try {
                    var REG_BODY = /<body[^>]*>([\s\S]*)<\/body>/;
                    var temps = REG_BODY.exec(data);
                    if (temps && temps.length === 2) {
                        $myPageContent.html(temps[1]);
                    } else {
                        $myPageContent.html($("<div>").html(data).find("#pagecontent").html());
                    }
                } catch (e) {
                    if (debug) console.warn("Page data has error: ", {
                        content: data,
                        error: e
                    });
                    maple.msg.error((e && e.message) ? e.message : "发生未处理的异常", "系统提示");
                }
            } else if (dataType === "error") {
                $myPageContent.html(pageLoadErrorMsg);
            } else {
                $myPageContent.html("???");
            }

            scrollPageTo();
            handlePageLoad();
        }, 200);

        //设置页面openning标识
        lastOpenPageUrl = url;
        isPageOpening = true;
        //关闭已加载的页面
        if (hasOpenedPage) {
            closePage(true);
        }
        // $myPageContent.empty();
    };

    //关闭页面
    var closePage = function () {
        window["afterPageLoad"] = null;
        window["onPageLoad"] = null;
        if ($.isFunction(window["onPageClose"])) {
            window["onPageClose"]();
            window["onPageClose"] = null;
        }
    };

    //注册page加载事件
    var handlePageLoad = function () {

        var delayMutedPageLoading = false;
        if ($.isFunction(window["onPageLoad"])) {
            delayMutedPageLoading = window["onPageLoad"]() === false;
        }

        setTimeout(function () {
            if ($.isFunction(window["afterPageLoad"])) {
                try {
                    window["afterPageLoad"]();
                } catch (e) {
                    if (debug) console.warn("Page data has error: ", {
                        error: e
                    });
                    maple.msg.error((e && e.message) ? e.message : "发生未处理的异常", "系统提示");
                }
                endPageLoad();
            }
        }, 100);

        if (!delayMutedPageLoading) endPageLoad();
    };


    //结束加载页面
    var endPageLoad = function () {
        isPageOpening = false;
        hasOpenedPage = true;
        maple.progress.stopPageLoading();
    };

    //加载页面并执行后处理
    var loadPageInfo = function (url, callback, delayLoadRemote) {
        var loadFromRemote = function () {
            $.ajax({
                url: url,
                type: "GET",
                dataType: "html",
                success: function (data) {
                    if (data !== null) {
                        callback(data, "remote");
                    } else {
                        if (debug) console.log("Failed load pageinfo from url " + url);
                        callback(null, "error");
                    }
                },
                error: function () {
                    if (debug) console.log("Failed load pageinfo from url " + url);
                    callback(null, "error");
                }
            });
        }

        if (delayLoadRemote !== false) {
            if (delayLoadRemote) {
                if (lastPageLoadCall) {
                    clearTimeout(lastPageLoadCall);
                }
                lastPageLoadCall = setTimeout(loadFromRemote, delayLoadRemote);
            } else {
                loadFromRemote();
            }
        }
    };

    return {
        init: function () {
            $body = $("body");
            $myPageContent = $("#myPageContent");
            // maple.progress.UseNprogress({
            //     parent: "#myPageContent"
            // });
            checkSupportHashChange(); //检测浏览器是否支持HashChange事件
            handleUrlHashChange(); //检测浏览器HashChange事件
            loadHomePage(); //初始化首页信息   
            switchTheme(); //初始化皮肤 
        },
        setDefalutHomePageUrl: function (url) {
            if(url){
                defalutHomePageUrl = url;
            }
        },
        setApi_identity_info: function (url) {
            if(url){
                api_identity_info = url;
            }
        },
        switchTheme: switchTheme,
        scrollPageTo: scrollPageTo,
        scrollPageTop: function () {
            //滚动至顶部
            scrollPageTo();
        },
        openModule: openModule,
        refrashModule: refrashModule,
        getDatatableDefaultOptions: function () {
            //获取Bootstrap Table绑定时的缺省设置
            return {
                method: 'post', //请求方式（*）
                striped: true, //是否显示行间隔色
                cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                pagination: true, //是否显示分页（*）
                sortable: true, //是否启用排序
                sortOrder: "asc", //排序方式
                queryParamsType: "pageSize", //参数格式,发送标准的RESTFul类型的参数请求
                sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
                pageNumber: 1, //初始化加载第一页，默认第一页
                pageSize: 10, //每页的记录行数（*）
                pageList: [5, 10, 25, 50, 100], //可供选择的每页的行数（*）
                search: false, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
                strictSearch: true,
                showColumns: true, //是否显示所有的列
                showRefresh: true, //是否显示刷新按钮
                minimumCountColumns: 2, //最少允许的列数
                clickToSelect: true, //是否启用点击选中行
                showToggle: true, //是否显示详细视图和列表视图的切换按钮
                cardView: false, //是否显示详细视图
                detailView: false, //是否显示父子表
                responseHandler: function (res) {
                    if (res && res.code && res.data && res.code == "200") {
                        return res.data;
                    } else {
                        maple.msg.error(res.msg ? res.msg : "数据加载异常", "系统提示");
                        return {
                            "total": "0",
                            "rows": []
                        };
                    }
                },
                onLoadError: function (status) {
                    maple.msg.error(status ? status : "数据加载异常", "系统提示");
                }
            };
        }
    };
}();

