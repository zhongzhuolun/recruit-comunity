import $ from 'jquery';
import {applicantInformation} from './applicantInformation';
import {editDepartment} from './editDepartment';
import {customizeDetailPage} from './customizeDetailPage';
import {bannerApply} from './bannerApply';
editDepartment();
applicantInformation();
customizeDetailPage();
bannerApply();
// globalApis();
// 社团管理员界面
$(function () {
  console.log("欢迎来到社团管理员界面");

  // 全局正则
  let phoneReg = /^[1][0-9]{10}$/ig; /* 验证手机号 */
  let passWordReg = /^[0-9a-zA-Z!@#$%^&*]{8,20}$/ig; /*密码采用数字、字母、特殊字符且长度为8-20位*/
  let studentNumReg = /^\d*$/ig;  /* 验证学号 */
  let txtReg = /^[a-zA-Z\u4e00-\u9fa5]{1}[a-zA-Z0-9_\u4e00-\u9fa5]{1,19}$/ig; /* 验证用户名,学院,专业班级和宿舍*/ 
  // 不能以数字开头且2-20字符


  // ★主页面左边导航栏的点击效果
  // 获取所有的系统功能主页
  let $operators = $(".manage-nav");
  let $leftNav = $(".left-nav");
  $leftNav.on("click", (event) => {
    let e = event || window.event;
    let t = e.target;
    let index = -1;
    if (t.tagName === 'LI') {
      $(t).addClass("nav-seleted").siblings("li").removeClass("nav-seleted");
      index = $(t).index();
    } else if (t.parentNode.tagName === 'LI') {
      $(t.parentNode).addClass("nav-seleted").siblings("li").removeClass("nav-seleted");
      index = $(t.parentNode).index();
    }
    if (index > -1) {
      $($operators[index]).show().removeClass("scale-in").addClass("scale-out");
      $($operators[index]).siblings(".manage-nav").removeClass("scale-out").addClass("scale-in");
      if (index == 2) {
        $(".customize-operating").stop().slideDown("fast");
      } else {
        $(".customize-operating").stop().slideUp("fast");
      }
    }
  });



  // ★右上角账号菜单点击事件
  // 获取主菜单
  let $menu = $(".menu");
  let $innerMenu = $(".inner-menu");
  $menu.on("click", (event) => {
    let e = event || window.event;
    let t = e.target;
    $innerMenu.toggleClass("open-menu");
    if ($(t).hasClass("account-operate") || $(t).hasClass("iconfont")) {
      $(".account-operate").toggleClass("menu-click");
    }
    $(document).on("click", (event) => {
      let e = event || window.event;
      let t = e.target;
      if (!$(t).hasClass("account-operate") && !$(t).hasClass("iconfont")) {
        $(".account-operate").removeClass("menu-click");
        $innerMenu.removeClass("open-menu");
      }
    });
  });

  // FIXME:
  // // 添加新一轮右边的表格 
  // let $addTable = $(".add-student-bar .table");
  // let addCnt; // 添加总人数
  // let $departmentFilter = $(".filter-department li"); // 筛选部门的li
  // let $statusFilter = $(".filter-status li"); // 筛选状态的li
  // // 添加新一轮考核
  // $(".add-assessment-container").on("click", function (event) {
  //   // 如果没有正在创建
  //   if (!iscreatingNewRound && !isEditing) {
  //     iscreatingNewRound = true;
  //     addCnt = 0;
  //     // 初始化添加列表
  //     $(".left-nav-container").hide("normal");
  //     $(".add-student-bar").show("normal");
  //     $informationTable.find(".btn").hide();
  //     $informationTable.find(".btn-info").show();
  //     let tableHtml = '<thead>' +
  //       '<td style="width: 30%">序号</td>' +
  //       '<td>姓名</td>' +
  //       '<td style="width: 30%">操作</td>' +
  //       '</thead>';
  //     $addTable.html(tableHtml);

  //     // 限制筛选状态
  //     $departmentFilter.eq(2).addClass("filter-selected").siblings().removeClass("filter-selected");
  //     $departmentFilter.eq(1).addClass("unselectable");
  //     $statusFilter.eq($statusFilter.length - 1).addClass("filter-selected").siblings().removeClass("filter-selected").addClass("unselectable");
  //     $statusFilter.eq(0).removeClass("unselectable");
  //     $(".add-student-bar .department-name").text($departmentFilter.eq(2).text());

  //     // "添加"按钮的点击事件
  //     $informationTable.find(".btn-info").on("click", function () {
  //       if (!$(this).hasClass("disabled")) {
  //         // 考虑加id ×
  //         $addTable.append('<tr><td class="list-num">' + (++addCnt) + '</td><td><span class="student-name">' + $(this).parents(".td-operater").siblings(".student-name").text() + '</span></td><td><i class="iconfont" title="移除该学生">&#xe610;</i></td></tr>');
  //         $(this).addClass("disabled");
  //       }
  //     });

  //     // 取消添加所有
  //     $(".cancel-add").on("click", initCreateRound);
  //     // 确定添加所有
  //     $(".determine-add-btn").on("click", function () {

  //       // 发送id
  //       initCreateRound();
  //     });

  //     // 取消单个
  //     $addTable.on("click", ".iconfont", function (e) {
  //       // 用学生id搜索设置disabled
  //       // $($informationTable.find(".btn-info")[$(this).parents("tr").index()]).removeClass("disabled");
  //       $(this).parents("tr").remove();
  //     });
  //   } else if(isEditing) {
  //     tipOut(event, "请先完成编辑噢");
  //   } else {
  //     tipOut(event, "一次只能创建一轮噢~");
  //   }
  // });

  // /**
  //  * 从重新建一轮回来重置某些内容
  //  */
  // function initCreateRound() {
  //   $(".left-nav-container").show("normal");
  //   $(".add-student-bar").hide("normal");
  //   $informationTable.find(".btn").show();
  //   $informationTable.find(".btn-info").hide();
  //   // 清除限制类名
  //   $informationTable.find(".btn-info").removeClass("disabled");
  //   $departmentFilter.removeClass("unselectable");
  //   $statusFilter.removeClass("unselectable");
  //   // 重置变量
  //   iscreatingNewRound = false;
  // }

});