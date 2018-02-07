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
var baseVendorChooseOrAdd = function () { };


// 私有方法
// 设置页面数据
baseVendorChooseOrAdd.prototype._setPageData = function(data){
    this.$page = $('<div></div>');
    this.$page.append(data);
    this._bindPageElement();
    this._handelInitValidate();
};
// 绑定事件及相关插件设置
baseVendorChooseOrAdd.prototype._bindPageElement = function(){

};
// 设置验证
baseVendorChooseOrAdd.prototype._handelInitValidate = function(){
    var temps = $.extend(true, plugOpts.getValidationDefaultOptions(), {
        errorClass: 'col-md-2 col-sm-2 validator-span text-danger',
        rules: {
            "sgys-f-vendorName": {
                required: true
            },
            "sgys-f-contactMode": {
                required: true
            }
        }
    });
    this.$page.find("#sgys-form").validate(temps);
};
// 保存数据
baseVendorChooseOrAdd.prototype._saveData = function (callback) {
    maple.progress.blockUI();
    $form = this.$page.find("#sgys-form");
    var result = $form.valid();
    if (result) {
        //执行保存数据
        var formValues = maple.form.serialize($form);
        $.ajax({
            type: 'get',//应该是POST
            dataType: "json",
            contentType: "application/x-www-form-urlencoded",
            url: maple.getRootPath() + "api/saveRequest2.json",
            data: formValues,//JSON.stringify(formValues),
            cache: false,
            async: true,
            success: function (res) {
                maple.progress.unblockUI();
                if (res && res.code && res.code == "200" && res.result) {
                    if (typeof callback === "function"){
                        callback(formValues);
                    }
                } else {
                    maple.msg.error(res.msg ? res.msg : "保存失败!");
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                maple.progress.unblockUI();
                maple.msg.error(res.msg ? res.msg : "保存失败!");
            }
        });
    } else {
        maple.progress.unblockUI();
    }
};
// 共有方法

// 展示对话框
baseVendorChooseOrAdd.prototype.show = function (callback) {
    maple.msg.clear();
    maple.progress.blockUI();
    var that = this;

    Layout.loadPageFromRemote(maple.getRootPath() + "templates/page-baseExample1-form2.html", function (data, dataType) {
        maple.progress.unblockUI();
        that._setPageData(data);
        var temps = $.extend(true, {}, {
            title: "新建供应商",
            message: that.$page,
            size: BootstrapDialog.SIZE_NORMAL,
            buttons:[
                {
                    label: '取消',
                    action: function(dialogItself){
                        dialogItself.close();
                    }
                },
                {
                    label: '确定',
                    cssClass: 'btn-primary',
                    action: function(dialogItself){
                        that._saveData(function(data){
                            if(data){
                                for(var key in data){
                                    if(key == "sgys-f-vendorName"){
                                        if (typeof callback === "function"){
                                            callback(data[key]);
                                        }
                                    }
                                }
                            }
    
                            dialogItself.close();
                        });
                    }
                }
            ]
        });
        BootstrapDialog.show(temps);
    });
};


