//@ sourceURL=baseVendorPlug.js  
/*
 *  项目：base
 *  模块：
 *  标识：vp00
 *  日期：2018.2.6
 *  人员：anthony
 *  备注：
 */ 

/* ================================================
* 定义创建供应商的js类， 用于其他模块调用
* ================================================ */
;
(function (window, $) {
    "use strict";
    // 定义类的构造函数
    var baseVendorChooseOrAdd = function (options) {
        this.initOptions(options);
        
    };

    // 定义方法
    // 初始化参数
    baseVendorChooseOrAdd.prototype.initOptions = function (options) {
        this.opts = $.extend(true, {}, options);
    };
    //
    baseVendorChooseOrAdd.prototype.show = function(){
        maple.msg.clear();
        maple.progress.blockUI();
        Layout.loadPageFromRemote(maple.getRootPath() + "templates/page-baseExample1-form2.html", function (data, dataType) {
            maple.progress.unblockUI();
            var $temp = $('<div></div>');
            $temp.append(data);

            var opts = $.extend(true, plugOpts.getDialogConfirmBoxOpts(), {
                title: "新建供应商",
                message: $temp,
                size: BootstrapDialog.SIZE_NORMAL,
                callback: function (result) {
                    if (result) {
                        var data = maple.form.serialize($temp);
                        if (data) {
                            alert(data["sgys-f-fax"]);
                        }
                    }
                }
            });
            BootstrapDialog.confirm(opts);
        }, 200);
    };

})(window, jQuery);

 