/**
处理整个页面布局的组件
**/
;
var Layout = function () {
    var api_identity_info = "../api/IdentityInfo.json",
        data_identity_info,
        storageEnable,
        debug = true;


    //读取查询参数
    var getQueryString = function (name, defaultValue) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r !== null) return unescape(r[2]);
        return defaultValue;
    }; 



    // 设置皮肤
    var switchTheme = function (theme) {
        var defaultTheme = "blue";
        if (theme == null) {
            theme = storageEnable ? $.maple.store.get("currentTheme", "blue") : "blue";
        } else {
            if (storageEnable) {
                $.maple.store.set("currentTheme", theme);
            }
        }

        if (theme != defaultTheme) {
            $("#maple-theme").attr("href", "../static/layouts/layout-default/css/themes/" + theme + ".css");
        }
    };
    //加载身份信息
    var handleIdentityInfo = function () {
        if (data_identity_info == null) {
            httpGetData(api_identity_info, "json", function (data, datatype) {
                
            });
        } else{
            if (debug) console.log('data_identity_info from Memory :', data_identity_info);
            
        }
 
    };
    //初始化菜单
    var initMenu = function(){

    }
    //选中并高亮当前菜单

    //检查是否可以使用本地存储
    var checkLocalDB =function(){
        storageEnable = $.maple.store && $.maple.store.enable;
    }
    //调整ajax默认设置
    var ajaxDefaultSetting = function () {
        $.ajaxSetup({
            cache: false
        });
    };

    //通过http get获取远程资源
    var httpGetData = function (url, dataType, callback, delayLoadRemote) {
        var loadFromRemote = function () {
            // var dataType = url.endsWith('.json') ? 'json' : (url.endsWith('.md') ? 'text' : 'html');
            $.ajax({
                url: url,
                type: 'GET',
                dataType: dataType,
                success: function (data) {
                    if (data !== null) {
                        callback(data, 'success');
                    } else {
                        if (debug) console.log('Failed load', url, 'from remote, instead load cache:');
                        callback(null, 'error');
                    }
                },
                error: function () {
                    if (debug) console.warn("Ajax error:", url);
                    callback(null, 'error');
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



    return {
        initTheme: function () {
            switchTheme();
        },
        initIdentityInfo:function(){
            handleIdentityInfo();
        },
        init: function () {
            checkLocalDB();             //检查是否可以使用本地存储
            ajaxDefaultSetting();       //设置ajax的默认参数
            this.initTheme();           //初始化皮肤 
            this.initIdentityInfo();    //初始化身份信息   
        }
    };
}();

jQuery(document).ready(function () {
    Layout.init(); // 页面加载时初始化处理整个页面布局的组件
});