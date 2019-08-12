import $ from 'jquery';
import {
  globalApis
} from './globalApis'
// 编辑我的部门板块

function editDepartment() {
  // 全局正则
  let phoneReg = /^[1][0-9]{10}$/ig; /* 验证手机号 */
  let passWordReg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,20}$/ig; /*密码采用数字、字母、特殊字符且长度为8-20位*/
  let studentNumReg = /^\d*$/ig; /* 验证学号 */
  let txtReg = /^[a-zA-Z\u4e00-\u9fa5]{1}[a-zA-Z0-9_\u4e00-\u9fa5]{1,19}$/ig; /* 验证用户名,学院,专业班级和宿舍*/
  // 不能以数字开头且2-20字符
  let nameReg = /^[\u4E00-\u9FA5A-Za-z\s]+(·[\u4E00-\u9FA5A-Za-z]+)*$/;

  // 引入函数
  let {
    selectionToEnd,
    tipOut,
    tipOutBlock
  } = globalApis;

  // 全局变量
  let isDepartmentEditing = false; // 是否正在进行部门的编辑
  let $canEdits; // 可以编辑的元素
  // let canCompleted = false; // 是否可以完成编辑
  let isEmpty = false; // 是否有内容为空
  let isFormatRight = true; // 格式是否正确
  // 点击修改部门信息
  $(".edit-my-department").on("click", ".department-name .edit-icon", function (event) {
    // 如果不是在编辑
    if (!isDepartmentEditing) {
      // 获取可编辑元素
      $canEdits = $(this).parents(".department-msg").find(".can-edit");
      $(this).hide();
      $(this).siblings(".determine-edit").show();
      isDepartmentEditing = true;
      $canEdits.css({
        background: "#ffce6047",
        color: "black"
      });
      // 回车失焦
      $canEdits.on("keydown", function (e) {
        var e = e || window.event;
        // 如果是回车,且输入框不为空
        if (((e.keyCode || e.which) == 13)) {
          if ((!!$(this).text().trim())) {
            $(this).blur();
          }
          return false;
        }
      });
      // 点击聚焦
      $canEdits.on("click", function () {
        $(this).attr("contenteditable", "true").focus();
        return false;
      });
      // 焦点效果
      $canEdits.on("focus", function () {
        $(this).css({
          background: "white",
          color: "black"
        });
      });
      // 失焦事件
      $canEdits.on("blur", function (e) {
        if (!!!$(this).text().trim()) {
          $(this).focus();
          isEmpty = true; // 为空
        } else {
          $(this).css({
            background: "#ffce6047",
            color: "black"
          });
          isEmpty = false; // 不为空了
        }
        if (isEmpty) {
          tipOut(e, "编辑内容不能为空");
        } else if (!isFormatRight) {
          tipOut(e, "请检查你的输入格式");
        }
      });
    } else {
      // 正在编辑
      tipOut(event, "正在编辑中噢~");
    }
  });
  // 点击完成部门修改
  $(".edit-my-department").on("click", ".department-name .determine-edit", function (e) {
    if (!isEmpty && isFormatRight) {
      // 输入格式正确且内容都不为空
      if (confirm("确定此次修改吗？")) {
        // 重置变量
        isDepartmentEditing = false;
        isEmpty = false;
        isFormatRight = true;
        $(this).hide();
        $(this).siblings(".edit-icon").show();
        // 解绑事件
        $canEdits.unbind();
        $canEdits.attr({
          "contenteditable": "false",
          "style": ''
        });
        tipOutBlock("修改成功");
        // 发送ajax
        $.ajax({
          type: "method",
          url: "url",
          data: "data",
          dataType: "dataType",
          success: function (response) {}
        });
      }
    }
    return false;
  });

  // 限制部门简介字数
  $(".edit-my-department").on("input", ".introdution-txt", function (e) {

    if ($(this).text().length > 150) {
      $(this).text($(this).text().substring(0, 150));
      selectionToEnd(this);
      tipOut(e, "不能超过100字噢");
    }
  });


  /**
   *  给某个编辑框绑定正则判断
   *
   * @param {*} classStr $(".edit-my-department")的子代编辑框的类名
   * @param {*} reg 要判断的正则
   */
  function bindRegText(classStr, reg) {
    $(".edit-my-department").on("blur", classStr, function () {
      if (!reg.test($(this).text().trim())) {
        $(this).focus();
        // 格式错误
        isFormatRight = false;
      } else {
        // 格式正确
        isFormatRight = true;
      }
    });
  }

  // 管理员正则验证
  bindRegText(".student-name", nameReg);
  // 管理员手机账号验证
  bindRegText(".account-phone", phoneReg);
  // 管理员学号正则验证
  bindRegText(".account-student-num", studentNumReg);
  // 密码正则验证
  bindRegText(".password", passWordReg);





  // 获取注册部门div
  let $registereBlock = $(".department-registere");
  // 添加部门
  $(".edit-my-department .edit-btns .btn").on("click", function (e) {
    // console.log(isDepartmentEditing + '1');
    if (!isDepartmentEditing) {
      $(".department-registere-container").show(0, function () {
        $registereBlock.attr("style", '');
        $registereBlock.addClass("tip-block-out");
        // console.log(isDepartmentEditing + '2');
      });
    } else {
      tipOut(e, "请先完成编辑");
    }
    return false;
  });
  // 关闭添加部门的框
  $registereBlock.find(".header .iconfont").on("click", () => {
    $registereBlock.removeClass("tip-block-out");
    $(".department-registere-container").hide();
  });
  // 确定添加按钮
  $registereBlock.find(".btn").on("click", () => {
    // 添加dom节点
    let html = '<section class="department-msg"><header class="department-name h3"><span class="can-edit">' +
      $(".form-horizontal #department-name").val() +
      '</span><i class="iconfont edit-icon" title="修改部门信息">&#xe858;</i><i class="iconfont determine-edit" title="确定修改" style="display: none">&#xe60c;</i></header>' +
      '<section class="flex-container"><section class="brief-introdution"><header>部门简介:</header><span class="header-line"></span><span class="introdution-txt can-edit">' +
      '点击右上角扳手可以编辑噢~</span></section><section class="department-account"><header>部门账号信息:</header><span class="header-line"></span>' +
      '<div><span class="field-header">管理员：</span><span class="student-name field-txt can-edit">' +
      $(".form-horizontal #student-name").val() +
      '</span></span></div><div><span class="field-header">手机账号：</span><span class="account-phone field-txt can-edit">' +
      $(".form-horizontal #student-phone").val() +
      '</span></span></div><div><span class="field-header">学号账号：</span><span class="account-student-num field-txt can-edit">' +
      $(".form-horizontal #student-num").val() +
      '</span></span></div><div><span class="field-header">密码：</span><span class="password field-txt can-edit">' +
      $(".form-horizontal #password").val() +
      '</span></div></section></section></section>';

    $(".edit-my-department").append(html);
    $registereBlock.remove("tip-block-out");
    $(".department-registere-container").hide();
    $(".form-control").val('');
    tipOutBlock("添加成功");
  });

  // 添加部门窗口拖拽
  $registereBlock.mousedown(function (e) {
    var positionDiv = $(this).offset();
    //记录鼠标点击的位置与目标左上角水平方向的距离
    var distenceX = e.pageX - positionDiv.left;
    //记录鼠标点击的位置与目标左上角垂直方向的距离
    var distenceY = e.pageY - positionDiv.top;
    if (e.target.tagName !== 'INPUT') {
      $(document).mousemove(function (e) {
        var x = e.pageX - distenceX;
        var y = e.pageY - distenceY;
        if (x < 0) {
          x = 0;
        } else if (x > $(document).width() - $registereBlock.outerWidth(true)) {
          x = $(document).width() - $registereBlock.outerWidth(true);
        }
        if (y < 0) {
          y = 0;
        } else if (y > $(document).height() - $registereBlock.outerHeight(true)) {
          y = $(document).height() - $registereBlock.outerHeight(true);
        }
        $registereBlock.css({
          'left': (x + $registereBlock.outerWidth(true) / 2) + 'px',
          'top': (y + $registereBlock.outerHeight(true) / 2) + 'px'
        });
      });
      $(document).mouseup(function () {
        $(document).off('mousemove');
      });
    }
  });
}

export {
  editDepartment
}