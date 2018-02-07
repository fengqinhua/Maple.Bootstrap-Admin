/**
Jquery Or Bootstrap Plug Defalt Options Wapper
**/
;
var plugOpts = function () {

    return {
        getDialogMessageBoxOpts: function () {
            //获取bootstrap3-dialog绑定时的缺省设置
            return {
                message: "",
                title: "系统提示",
                type: BootstrapDialog.TYPE_DEFAULT,
                size: BootstrapDialog.SIZE_SMALL, //SIZE_SMALL SIZE_NORMAL
                onhide: function () {}
            };
        },
        getDialogConfirmBoxOpts: function () {
            //获取bootstrap3-dialog绑定时的缺省设置
            return {
                message: "", //消息内容
                title: "系统提示", //消息标题
                type: BootstrapDialog.TYPE_WARNING, //消息样式
                size: BootstrapDialog.SIZE_SMALL, //消息大小 SIZE_SMALL SIZE_NORMAL
                btnCancelLabel: '取消', // 取消按钮的文本内容
                btnOKLabel: '确定', // 确定按钮的文本内容
                btnOKClass: null, //确定按钮的文本样式
                onhide: function () {},
                callback: function () {}
            };
        },
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
                    if (res && res.code && res.code == "200") {
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
        },
        getValidationDefaultOptions: function () {
            return {
                errorElement: 'span', // default input error message container
                errorClass: 'col-md-3 col-sm-3 validator-span help-block help-block-error', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                onfocusout: false, //失去焦点时验证（不包括复选框/单选按钮）。
                onclick: false,
                onkeyup: false,
                ignore: "", // validate all fields including form hidden input
                highlight: function (element) { // hightlight error inputs
                    $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
                },
                unhighlight: function (element) { // revert the change done by hightlight
                    $(element).closest('.form-group').removeClass('has-error'); // set error class to the control group
                },
                success: function (label) {
                    label.closest('.form-group').removeClass('has-error'); // set success class to the control group
                },
                errorPlacement: function (error, element) {
                    //if (element.parent('.form-group').length) {
                    //    error.insertAfter(element.parent());
                    //} else {
                    //    error.insertAfter(element);
                    //}
                    error.appendTo(element.closest('.form-group'));
                    //error.appendTo(element.parent());
                }
            };
        }
    };
}();