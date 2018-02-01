//@ sourceURL=baseExample1_form.js  
/*
 *  项目：base
 *  模块：Example1-form
 *  标识：bssw-f
 *  日期：2018.1.29
 *  人员：anthony
 *  备注：
 */

;
var baseExample1_form = function () {

    var bindPageElement = function () {
        var pkey = maple.getPageQueryString("pkey", "");
        if (pkey != "") { 
            maple.msg.warning("当前是编辑页面，主键标识：" + pkey,"系统提示");
        }

        $('input.flat').iCheck({
            checkboxClass: 'icheckbox_square-grey',
            radioClass: 'iradio_square-grey'
        });
        $(".chosen-select").chosen({
            allow_single_deselect: true,
            disable_search_threshold: 10,
            no_results_text: "没有匹配结果",
            placeholder_text_single: "请选择...",
            placeholder_text_multiple: "请选择...",
            width: "100%"
        });

        //初始化按钮
        $("#bssw-f-save").on("click", function () {
            save(false);
        });
        $("#bssw-f-saveandadd").on("click", function () {
            save(true);
        });
        $("#bssw-f-cancel").on("click", function () {
            comeBack();
        });
    };

    //保存数据
    var save = function (isContinue) {
        
    };

    //返回
    var comeBack = function () {
        Layout.openModule("#../templates/page-baseExample1.html");
    };

    return {
        init: function () {
            bindPageElement();
        }
    };
}();


// 页面加载完成后初始化页面数据
function afterPageLoad() {
    baseExample1_form.init();
}

//页面关闭时所需执行的函数
function onPageLoad() {
    return false;
}
//页面关闭时所需执行的函数
function onPageClose() { }