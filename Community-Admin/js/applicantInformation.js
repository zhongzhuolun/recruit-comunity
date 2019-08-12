import $ from 'jquery';
// import {globalApis} from './globalApis';
import {globalApis} from './globalApis';
function applicantInformation() {
  // globalApis();
  // 引入外部函数
  let {
    tipOut,
    tipOutBlock,
    getStatusCode,
    findDepartmentId,
    toStrStatus
  } = globalApis;

  // 查看报名人员信息的模块

  // 全局正则
  let phoneReg = /^[1][0-9]{10}$/ig; /* 验证手机号 */
  let passWordReg = /^[0-9a-zA-Z!@#$%^&*]{8,20}$/ig; /*密码采用数字、字母、特殊字符且长度为8-20位*/
  let studentNumReg = /^\d*$/ig; /* 验证学号 */
  let txtReg = /^[a-zA-Z\u4e00-\u9fa5]{1}[a-zA-Z0-9_\u4e00-\u9fa5]{1,19}$/ig; /* 验证用户名,学院,专业班级和宿舍*/
  // 不能以数字开头且2-20字符


  // 全局变量 TODO:
  let paginationIndex = 1; // 正在分页的页码
  // let iscreatingNewRound = false; // 是否正在创建新一轮
  let totalPage = 99; // 分页总页数
  // 获得最新状态所有部门总页数
  // let totalPage = getTotalPagesNum();
  let hasChanged = false; // 编辑报名人员信息时有没有改动
  let isEditing = false; // 是否正在对报名人员的信息进行编辑
  let canCompleted = false; // 是否可以完成编辑 (都不为空才可以编辑成功)


  // ★报名人员分页
  let $paginationBar = $(".pagination-bar"); // 分页的bar
  let pageUl = $(".pagination-nav"); // 页码ul
  let $filterDepartment = $(".filter-department"); // 两个筛选学生的ul
  let $filterStatus = $(".filter-status")
  let $searchStudentInput = $(".search-student-bar"); // 搜索学生搜索input框
  let $informationTable = $(".applicant-information .table"); // 获取人员表格
  let $toPageInput = $(".to-page .form-control"); // 分页跳转input框


  /**
   * ★换页时更新页码的函数 √
   * 需要totalPage
   *
   * @param {*} index 将要/目前显示页
   */
  const updatePageNum = (index) => {
    // 更新先存页码
    paginationIndex = index;
    let html = '';
    let pageCnt = 1;
    // 如果总页数大于6才出现省略号形式
    if (totalPage > 6) {
      if (paginationIndex <= 4) {
        for (var i = 0; i < 6; i++) {
          html += '<li><span class="underline"></span><span class="page-num">' + (pageCnt++) + '</span><i class="iconfont">&#xe640;</i></li>';
        }
        html += '<li><span class="underline"></span><span class="page-num">…</span><i class="iconfont">&#xe640;</i></li>' +
          '<li><span class="underline"></span><span class="page-num">' + totalPage + '</span><i class="iconfont">&#xe640;</i></li>';
      } else if (paginationIndex >= (totalPage - 3)) {
        html += '<li><span class="underline"></span><span class="page-num">1</span><i class="iconfont">&#xe640;</i></li>' +
          '<li><span class="underline"></span><span class="page-num">…</span><i class="iconfont">&#xe640;</i></li>';
        for (var i = totalPage - 5; i <= totalPage; i++) {
          html += '<li><span class="underline"></span><span class="page-num">' + i + '</span><i class="iconfont">&#xe640;</i></li>';
        }
      } else {
        html += '<li><span class="underline"></span><span class="page-num">1</span><i class="iconfont">&#xe640;</i></li>' +
          '<li><span class="underline"></span><span class="page-num">…</span><i class="iconfont">&#xe640;</i></li>';
        for (var i = paginationIndex - 2; i <= paginationIndex + 2; i++) {
          html += '<li><span class="underline"></span><span class="page-num">' + i + '</span><i class="iconfont">&#xe640;</i></li>';
        }
        html += '<li><span class="underline"></span><span class="page-num">…</span><i class="iconfont">&#xe640;</i></li>' +
          '<li><span class="underline"></span><span class="page-num">' + totalPage + '</span><i class="iconfont">&#xe640;</i></li>';
      }
    } else {
      // 如果少于6则全部生成即可
      for (var i = 1; i <= totalPage; i++) {
        html += '<li><span class="underline"></span><span class="page-num">' + i + '</span><i class="iconfont">&#xe640;</i></li>';
      }
    }
    // 重置ul内容
    pageUl.html(html);
    // 更新选中
    for (var i = 0; i < pageUl.children().length; i++) {
      if (pageUl.children().eq(i).find(".page-num").text() == paginationIndex) {
        pageUl.children().eq(i).addClass("pagination-selected");
        break;
      }
    }

  }

  /**
   * ★ TODO:
   * 1.更新页码为第一页
   * 2.重新获取并更新总页数
   * 3.更新页码内容
   */
  function resetPageVar() {
    paginationIndex = 1;
    // totalPage = getTotalPagesNum(xx,xxx,xx);
    // 更新页码
    updatePageNum(paginationIndex);
  };

  /**
   *  获取总页数的函数 √
   *  TODO:
   * 
   * @param {*} isStatusLatest 是否要最新的状态
   */
  function getTotalPagesNum(isStatusLatest) {
    // 获取部门id
    let departmentId = findDepartmentId($(".filter-selected").eq(0).text());
    // 获取学生状态
    let statusCode = getStatusCode(isStatusLatest);
    // 获取搜索内容
    let studentName;
    if (!!$searchStudentInput.val().trim()) {
      // 如果有搜索内容则加上搜索内容
      studentName = $searchStudentInput.val().trim();
    } else {
      // 否则默认没有搜索内容
      studentName = null;
    }
    // 转换为数据
    $.ajax({
      type: "get",
      url: "",
      data: {
        "departmentId": departmentId,
        "status": statusCode,
        "name": studentName
      },
      dataType: "json",
      success: function (paginationObj) {
        // 返回对应条件的总页数
        // 每页12人
        return Math.ceil(paginationObj.object.studentCount / 12);
      }
    })
  }

  /**
   * 加载学生表单信息 ×
   * 
   * @param {*} isStatusLatest 是否要最新的状态
   */
  function loadStudents(isStatusLatest) {
    // 获取部门id
    let departmentId = findDepartmentId($(".filter-selected").eq(0).text());
    // 获取学生状态
    let statusCode = getStatusCode(isStatusLatest);
    // 获取搜索内容
    let studentName;
    if (!!$searchStudentInput.val().trim()) {
      // 如果有搜索内容则加上搜索内容
      studentName = $searchStudentInput.val().trim();
    } else {
      // 否则默认没有搜索内容
      studentName = null;
    }
    // 转为数据
    $.ajax({
      type: "get",
      url: "",
      data: {
        "pageCode": paginationIndex,
        "departmentId": departmentId,
        "status": statusCode,
        "name": studentName,
        "communityId": ''
      },
      dataType: "json",
      success: function (response) {
        let html = '<tr class="thead"><td>序号</td><td>姓名</td><td>性别</td><td>学号</td><td>学院</td><td>专业班级</td><td>手机号码</td><td>宿舍</td><td>所报部门</td><td>报名状态</td><td>相关操作</td></tr>';
        let sexStr;
        // 获取数据并生成表单
        for (let i = 0; i < response.object.length; i++) {
          if (response.object[i].studentSex === '男') {
            sexStr = 'male">&#xe600;';
          } else {
            sexStr = 'female">&#xe669;';
          }
          html += '<tr>' +
            '<td class="cannot-edit">' + (i + 1) + '</td>' +
            '<td class="can-edit student-name">' + response.object[i].studentName + '</td>' +
            '<td class="cannot-edit"><i class="iconfont ' + sexStr + '</i></td>' +
            '<td class="can-edit student-number">' + response.object[i].studentNumber + '</td>' +
            '<td class="can-edit" student-academy>' + response.object[i].studentAcademy + '</td>' +
            '<td class="can-edit student-major-class">' + response.object[i].studentMajorClass + '</td>' +
            '<td class="can-edit student-phone">' + response.object[i].studentPhone + '</td>' +
            '<td class="can-edit student-dormitory">' + response.object[i].studentDormitory + '</td>' +
            '<td class="cannot-edit">' + response.object[i].departmentName + '</td>' +
            '<td class="cannot-edit">' + toStrStatus(response.object[i].studentStatus) + '</td>' +
            '<td class="td-operater"><button class="td-edit-btn btn btn-warning" title="编辑该学生信息"><i class="iconfont">&#xe60d;</i><span class="inner-text">编辑</span></button><button class="td-delete-btn btn btn-danger" title="删除该学生信息"><iclass="iconfont">&#xe7d7;</i><span class="inner-text">删除</span></button><button class="td-delete-btn btn btn-info" title="添加该学生" style="display:none"><i class="iconfont">&#xe64f;</i><span class="inner-text">添加</span></button></td>' +
            '</tr>';
        }
        $informationTable.html(html);
      }
    });
  }


  // 初始加载页码
  updatePageNum(paginationIndex);
  // 初始加载学生列表(状态为最新)
  loadStudents(true);


  // ★筛选学生  TODO:
  // 筛选部门
  $filterDepartment.on("click", "li", function () {
    // 不是ul头、不是自己、且为可选择的
    if (!$(this).hasClass("li-header") &&
      (!$(this).hasClass("filter-selected")) &&
      (!$(this).hasClass("unselectable"))) {

      // 更改样式
      $(this).addClass("filter-selected").siblings("li").removeClass("filter-selected");
      // 更新学生状态栏的阶段数目
      undateDepartmentStatus($(this).text());
      // 重新更新页码信息
      resetPageVar();
      // 更新学生信息(最新阶段)
      loadStudents(true);

      // 创建新一轮时
      // if (iscreatingNewRound) {
      //   // 点击部门栏目部门名时右侧列表头也更新
      //   $(".add-student-bar .department-name").text($(this).text());
      // }
    }
  });
  // 筛选考核状态
  $filterStatus.on("click", "li", function () {
    // 不是ul头、不是自己、且为可选择的
    if (!$(this).hasClass("li-header") &&
      (!$(this).hasClass("filter-selected")) &&
      (!$(this).hasClass("unselectable"))) {
      // 更改样式
      $(this).addClass("filter-selected").siblings("li").removeClass("filter-selected");
      // 重新更新页码信息
      resetPageVar();
      // 更新学生信息
      loadStudents(false);
    }
  });


  /**
   * 通过点击部门更新学生考核状态栏数目(最新的状态高亮)
   *  
   * @param {*} departmentName 传入部门名字
   */
  function undateDepartmentStatus(departmentName) {
    // 获取该部门对应的阶段数目
    // let statusNum = xxx();
    // 更新状态栏ul
    // let html = '<li style="padding:0" class="li-header">筛选学生考核状态：</li>';
    // let i;
    // for(i = 0; i< statusNum -1; i++) {
    //   html += '<li>第' + toStrStatus(i) + '阶段<span class="underline"></span></li>'
    // }
    // 默认让最后一个阶段(最新)选中
    // html += '<li  class="filter-selected">第' + toStrStatus(i) + '阶段<span class="underline"></span></li>';
    // $filterStatus.html(html);
  }


  // ★模糊搜索学生 TODO:
  // 1.输入框搜索
  $searchStudentInput.on("focus", function () {
    $searchStudentInput.attr("placeholder", "");
    $searchStudentInput.on("keydown", e => {
      // 按回车且搜索内容不为空
      if (((e.keyCode || e.which) == 13)) {
        // 如果搜索内容不为空
        if (!!$searchStudentInput.val().trim()) {
          // 加载学生
          loadStudents(false);
        }
        return false;
      }
    });

  }).on("blur", () => {
    $searchStudentInput.attr("placeholder", "请输入要搜索的学生名");
  });
  // 2.点击放大镜搜索
  $(".search-icon").on("click", function () {
    // 如果搜索内容不为空
    if (!!$searchStudentInput.val().trim()) {
      // 加载学生
      loadStudents(false);
    }
  });




  // ★点击分页
  // 选择页码
  $paginationBar.on("click", "li", function () {
    let pageNum = parseInt($(this).text());
    if (!!pageNum) {
      updatePageNum(pageNum);
    }
  });
  // 上一页
  $paginationBar.find(".pre-page").on("click", () => {
    if (paginationIndex != 1) {
      updatePageNum(paginationIndex - 1);
    }
  });
  // 下一页
  $paginationBar.find(".next-page").on("click", () => {
    if (paginationIndex != totalPage) {
      updatePageNum(paginationIndex + 1);
    }
  });
  // 跳转分页
  $paginationBar.find(".btn-success").on("click", () => {
    if (Number($toPageInput.val()) <= totalPage && Number($toPageInput.val()) >= 1) {
      updatePageNum(Number($toPageInput.val()));
    }
  });


  //  ★编辑/删除报名人员信息
  // 获取可编辑元素
  let $canEditTd;
  // 获取该行相关操作td
  let $tds;
  // 获取按钮的操作文字
  let innerText;
  // 编辑/完成
  $informationTable.on("click", ".td-edit-btn", function (e) {
    innerText = $(this).find(".inner-text").text();
    $tds = $(this).parent();
    // 点击编辑
    if (innerText === '编辑') {
      if (!isEditing) {
        // 将要编辑
        $canEditTd = $tds.siblings(".can-edit");
        // 正在编辑
        isEditing = true;
        // 还没改变
        hasChanged = false;
        // 还不能完成编辑
        canCompleted = false;
        // 改变按钮样式
        $tds.find(".td-edit-btn").removeClass("btn-warning").addClass("btn-success").find(".inner-text").text("完成");
        // 点击编辑后"不可修改"的元素样式
        $tds.siblings(".cannot-edit").css({
          cursor: "not-allowed",
          "background-color": "#ddd"
        });
        // 首先让第一个可编辑元素聚焦
        $canEditTd.eq(0).attr("contenteditable", "true").focus();
        let oldTxt = $canEditTd.eq(0).text(); // 旧字段内容,默认为第一个可编辑元素的内容
        let newTxt; // 新字段内容
        // 点击时可编辑并获取焦点,并更新旧的字段内容
        $tds.siblings(".can-edit").on("click", function () {
          $(this).attr("contenteditable", "true").focus();
          oldTxt = $(this).text();
        });

        // 回车失焦
        $tds.siblings(".can-edit").on("keydown", function (e) {
          var e = e || window.event;
          // 如果是回车,且输入框不为空
          if (((e.keyCode || e.which) == 13) && (!!$(this).text().trim())) {
            $(this).blur();
            return false;
          }
        });

        // 失去焦点时比较内容
        $tds.siblings(".can-edit").on("blur", function (event) {
          // 更新新字段
          newTxt = $(this).text();
          // 字段有改变才进行存储数据
          if (newTxt !== oldTxt) {
            hasChanged = true;
          }
          if (!!!$(this).text().trim()) {
            // 编辑内容为空时
            $(this).focus();
            canCompleted = false;
            tipOut(event, "编辑内容不能为空噢~");
          } else {
            // 内容不为空可以完成编辑
            canCompleted = true;
          }
        });
      } else {
        // 正在编辑中点击其他学生的编辑
        tipOut(e, "正在编辑其它的噢~");
      }
    } else if (innerText === '完成') {
      // 点击完成
      // 可以完成编辑了
      if (canCompleted) {
        isEditing = false; // 重置参数
        tipOutBlock("编辑完成");

        // 更新按钮以及不可编辑元素的css
        $tds.find(".td-edit-btn").removeClass("btn-success").addClass("btn-warning").find(".inner-text").text("编辑");
        $tds.siblings(".cannot-edit").attr("style", "");
        // 取消绑定事件
        $tds.siblings(".can-edit").unbind();
        // $canEditTd.eq(0).attr("contenteditable", "false").blur();
        $tds.siblings(".can-edit").attr("contenteditable", "false").blur();
        // 如果有修改内容才给后台发送数据，减少不必要的数据交流
        if (hasChanged) {
          // 向后台发送数据
        } else {

        }
      } else {
        // 不能完成编辑
        tipOut("编辑内容不能为空");
      }

    }
  });
  // 删除该学生信息
  $informationTable.on("click", ".td-delete-btn", function () {
    if (confirm("确定删除该学生吗？")) {
      // 移除DOM
      $(this).parents('tr').remove();
      tipOutBlock("删除成功");

      // 删除后台数据
      var p = new Promise(function (resolve, reject) {
        // 部门id 和社团id
        $.ajax({
          type: "post",
          url: "url",
          data: {
            "studentId": studentId,
            "departmentId": departmentId
          },
          dataType: "json",
          success: function (res) {
            resolve(res);
          }
        });
      });
      // 重新获取学生信息
      p.then(function () {
        loadStudents(false);
      });
    }
    // 阻止冒泡
    return false;
  });



}

export {
  applicantInformation
};