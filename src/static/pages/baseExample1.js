//@ sourceURL=baseExample1.js  
/*
 *  项目：base
 *  模块：Example1
 *  标识：bssw
 *  日期：2018.1.29
 *  人员：anthony
 *  备注：
 */

;
var baseExample1 = function () {

    //初始化表格
    var initTable = function () {
        var options = $.extend(true, Layout.getDatatableDefaultOptions(), {
            method: 'get', //请求方式（*）
            url: "../api/baseExampleInfo.json", //请求后台的URL（*）
            toolbar: "#bssw-toolbar", //工具按钮用哪个容器
            queryParams: queryParams, //传递参数（*）
            uniqueId: "ID", //每一行的唯一标识，一般为主键列 
            cardView: false, //是否显示详细视图
            detailView: true, //是否显示父子表
            detailFormatter: detailFormatter,
            columns: [{
                field: "softwareNo",
                title: "XX编码",
                align: "left",
                valign: "middle"
            }, {
                field: "name",
                title: "XX名称",
                align: "left",
                valign: "middle",
                formatter: nameFormatter
            }, {
                field: "classify",
                title: "XX分类",
                align: "center",
                valign: "middle"
            }, {
                field: "productName",
                title: "产品名称",
                align: "left",
                valign: "middle"
            }, {
                field: "vendor",
                title: "供应商",
                align: "left",
                valign: "middle"
            }, {
                field: "source",
                title: "来源",
                align: "center",
                valign: "middle"
            }, {
                field: "distributeDate",
                title: "发布时间",
                align: "center",
                valign: "middle"
            }, {
                field: "isscan",
                title: "是否扫描",
                align: "center",
                valign: "middle"
            }, {
                field: "operate",
                title: "操作",
                align: "center",
                valign: "middle",
                formatter: operateFormatter
            }]
        });
        //初始化表格
        $("#bssw-table").bootstrapTable(options);
    };

    //刷新表格
    var refreshTable = function () {
        $('#bssw-table').bootstrapTable('refresh');
    };

    //格式化显示name
    var nameFormatter = function (value, row, index) {
        if (row.versionName) {
            return row.name + "(" + row.versionName + ")";
        } else {
            return row.name;
        }
    };

    //获取表格查询参数
    var queryParams = function (params) {
        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            PageSize: params.pageSize, //页面大小
            Page: params.pageNumber, //页码
            SortName: params.sort,
            SortOrder: params.order,
            S_Name: $("#bssw-s-name").val(),
            S_Classify: $("#bssw-s-classify").val(),
            S_Type: $("#bssw-s-type").val(),
            S_ProductName: $("#bssw-s-productName").val(),
            S_Vendor: $("#bssw-s-vendor").val()
        };
        return temp;
    };

    //数据详情
    function detailFormatter(index, row) {
        var html = [];

        html.push("<p><b>系统架构：</b> " + row.architecture + "</p>");
        html.push("<p><b>数据类型：</b> " + row.dataType + "</p>");
        html.push("<p><b>数据版本：</b> " + row.dataVersion + "</p>");
        html.push("<p><b>是否禁用：</b> " + row.isDisable + "</p>");

        return html.join('');
    };
    //格式化操作列
    var operateFormatter = function (value, row, index) {
        //
        //<a  ">停用</a>
        return "<a href=\"javascript:void(0);\" class=\"bnt\" onclick=\"baseExample1.addOrEdit('" + row.ID + "');\" title=\"修改\">修改</a> " +
            " | " + "<a href=\"javascript:void(0);\" class=\"bnt\" onclick=\"baseExample1.delComfirm('" + row.ID + "');\" title=\"删除\">删除</a>" +
            " | " + "<a href=\"javascript:void(0);\" class=\"bnt\" onclick=\"baseExample1.setRules('" + row.ID + "');\" title=\"规则设置\">规则设置</a>";

    };

    var bindPageElement = function () {
        //初始化下拉菜单
        $(".chosen-select").chosen({
            allow_single_deselect: true,
            disable_search_threshold: 10,
            no_results_text: "没有匹配结果",
            placeholder_text_single: "请选择...",
            placeholder_text_multiple: "请选择...",
            width: "100%"
        });
        //初始化按钮
        $("#bssw-search").on("click", function () {
            refreshTable();
        });

        $("#bssw-add").on("click", function () {
            alert("新增");
        });

        $("#bssw-sync").on("click", function () {
            alert("同步");
        });

        $("#bssw-export").on("click", function () {
            alert("导出");
        });

        $("#bssw-import").on("click", function () {
            alert("导入");
        });
    };

    //新增或修改
    var addOrEdit = function (pkey) {
        alert("修改" + pkey);
    };

    //设置规则
    var setRules = function (pkey) {
        alert("规则设置" + pkey);
    };

    //删除
    var delComfirm = function (pkey) {
        alert("删除" + pkey);
    };

    return {
        init: function () {
            //初始化            
            bindPageElement();
            initTable();

        },
        refreshTable: refreshTable,
        addOrEdit: addOrEdit,
        setRules: setRules,
        delComfirm: delComfirm
    };
}();


// 页面加载完成后初始化页面数据
function afterPageLoad() {
    baseExample1.init();
}

//页面关闭时所需执行的函数
function onPageLoad() {
    return false;
}
//页面关闭时所需执行的函数
function onPageClose() { }