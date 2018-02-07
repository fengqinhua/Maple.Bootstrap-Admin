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
            maple.msg.warning("当前是编辑页面，主键标识：" + pkey, "系统提示");
        }

        if (jQuery().datepicker) {
            $('.date-picker').datepicker({
                orientation: "left",
                autoclose: true,
                language: 'zh-CN'
            });
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
        $("#bssw-f-addVendor").on("click", function () {
            addVendor();
        });

    };

    //设置验证规则
    var handelInitValidate = function () {

        //验证采购单号是否重复
        $.validator.addMethod("CheckSoftwareNo", function (value, element) {
            var key = $("#hf_PK").val();
            var softwareNo = $("#bssw-f-softwareNo").val();

            var result = false;
            $.ajax(
                {
                    type: "get",
                    url: "../api/checkSoftwareNo.json",
                    dataType: "json",
                    cache: false,
                    async: false,
                    data: { key: key, softwareNo: softwareNo },
                    success: function (res) {
                        if (res && res.code && res.code == "200") {
                            result = res.result;
                        } else {
                            result = false;
                        }
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        result = false;
                    }
                });
            return result;
        }, "该软件编号已经存在");
        //验证软件名称和编码是否重复
        $.validator.addMethod("CheckSoftwareName", function (value, element) {
            var key = $("#hf_PK").val();
            var softwareName = $("#bssw-f-name").val();
            var softwareVersionName = $("#bssw-f-versionName").val();

            var result = false;
            $.ajax(
                {
                    type: "get",
                    url: "../api/checkSoftwareName.json",
                    dataType: "json",
                    cache: false,
                    async: false,
                    data: { key: key, softwareName: softwareName, softwareVersionName: softwareVersionName },
                    success: function (res) {
                        if (res && res.code && res.code == "200") {
                            result = res.result;
                        } else {
                            result = false;
                        }
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        result = false;
                    }
                });
            return result;
        }, "该软件名称或版本已经存在");
        
        var opts = $.extend(true, plugOpts.getValidationDefaultOptions(), {
            rules: {
                "bssw-f-softwareNo": {
                    required: true,
                    maxlength: 10,//用于演示
                    CheckSoftwareNo: true
                },
                "bssw-f-name": {
                    required: true,
                    CheckSoftwareName: true
                },
                "bssw-f-classify": {
                    required: true
                },
                "bssw-f-type": {
                    required: true
                },
                "bssw-f-productName": {
                    required: true
                },
                "bssw-f-source": {
                    required: true
                },
                "bssw-f-distributeDate": {
                    dateISO: true
                },
                "bssw-f-isscan": {
                    required: true
                }
            }
        });
        $("#bssw-form").validate(opts);
    };

    //保存数据
    var save = function (isContinue) {
        maple.progress.blockUI();
        $form = $("#bssw-form");
        var result = $form.valid();
        if (result) {
            //执行保存数据
            var formValues = maple.form.serialize($form);
            $.ajax({
                type: 'get',//应该是POST
                dataType: "json",
                contentType: "application/x-www-form-urlencoded",
                url: "../api/saveRequest.json",
                data: formValues,//JSON.stringify(formValues),
                cache: false,
                async: true,
                success: function (res) {
                    maple.progress.unblockUI();
                    if (res && res.code && res.code == "200" && res.result) {
                        maple.msg.success("保存成功!");
                        if (isContinue) {
                            Layout.openModule("#../templates/page-baseExample1-form.html");
                        } else {
                            Layout.openModule("#../templates/page-baseExample1.html");
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



    //返回
    var comeBack = function () {
        Layout.openModule("#../templates/page-baseExample1.html");
    };

    //添加供应商
    var addVendor = function () {
        maple.msg.clear();
        maple.progress.blockUI();
        Layout.loadPageFromRemote("../templates/page-baseExample1-form2.html", function (data, dataType) {
            maple.progress.unblockUI();
            var $temp = $('<div></div>');
            $temp.append(data);
            var opts = $.extend(true, plugOpts.getDialogConfirmBoxOpts(), {
                title:"新建供应商",
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

    return {
        init: function () {
            bindPageElement();
            handelInitValidate();
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