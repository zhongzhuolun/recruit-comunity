// import {$} from "../../lib/jquery-1.12.4";
// console.log($)
import '../../lib/bootstrap-3.3.7/dist/css/bootstrap.min.css';
// 侧边栏
let asideThat;
class aside {
  constructor() {
    console.log($)
    asideThat = this;
    //左侧栏整体
    this.$btns = $("#aside-nav");
    // 部门管理按钮
    this.$accountBtn = $("#aside-nav .account-btn");
    // 管理部门的字体图标
    this.$accountBtnIcon = $("#aside-nav .account-btn i")
    // 部门管理下拉菜单
    this.$accountMenu = $("#aside-nav .account-menu");
    this.init();
  }
  init() {
    this.$btns.on("click",function(e) {
      e = e || window.event;
      let target = e.target;
      // console.log(target.className);
      if(target.tagName == "DIV") {
        console.log("我是div")
        asideThat.changeClass(target,"aside-btn-current");
      }else if(target.tagName == "I" && $(target).parent()[0].tagName == "DIV" || target.tagName == "SPAN" && $(target).parent()[0].tagName == "DIV") {
        asideThat.changeClass($(target).parent(),"aside-btn-current");
      }
    });
    // 给下拉菜单注册事件
    this.$accountBtn.on("click",function() {
      $(this).toggleClass("current-bgc");
      asideThat.$accountBtnIcon.toggleClass("icon-ico_open");
      asideThat.$accountMenu.slideToggle(200);
      //移除兄弟的样式
      asideThat.$accountMenu.parent().siblings().slice(1).find("i").removeClass("icon-ico_open");
      asideThat.$accountMenu.parent().siblings().slice(1).find("div").removeClass("current-bgc");
      asideThat.$accountMenu.parent().siblings().slice(1).find("ul").slideUp(200);
    })
  }
  // 修改类名
  changeClass(target,classname) {
    $(target).toggleClass(classname);
    $(target).siblings().removeClass(classname);
  }
}
// 账号管理功能
let loginThat;
class login {
  constructor() {
    loginThat = this;
    // 获取登录按钮
    this.$loginbtn = $(".login-icon");
    //获取隐藏菜单
    this.$menu = $(".account-menu");
    // 修改密码按钮
    this.$changeBtn = $(".account-menu .edit-password");
    //获取密码页
    this.$passwordPage = $("#change-password");
    //获取主页
    this.$mainBox = $("#main-box");
    // 取消修改按钮
    this.$quitBtn = $("#change-password .quit");
    //确认修改
    this.$affirm = $("#change-password .affirm");
    //获取旧密码输入框
    // this.$oldIput = $("")
    // 调用初始化函数
    this.init();
  }
  init() {
    console.log(this.$loginbtn);
    console.log(this.$menu);
    // 给登录按钮注册点击事件
    this.$loginbtn.on("click",function() {
      console.log("下拉菜单出来啦")
      // event.currentTarget
      $(loginThat.$menu).slideToggle(300);
    })
    //给修改密码按钮注册事件
    this.$changeBtn.on("click",function() {
      loginThat.$mainBox.hide();
      loginThat.$passwordPage.show();
    })
    //给取消按钮注册事件
    this.$quitBtn.on("click",function() {
      loginThat.$mainBox.show();
      loginThat.$passwordPage.hide();
    })  
  }
  // // 修改密码
  // checkPassword() {
  //   let oldPassword = 
  // }
}

// 部门详情
let introductionThat;
class introduction {
  constructor() {
    introductionThat = this;
    // 获取详情页按钮
    this.$introductionBtn = $(".brief-introduction");
    // 获取详情页
    this.$detialPage = $("#brief-introduction-box");
    // 获取详情页内容
    this.$detialContent = $("#brief-introduction-box .content-box");
    // 获取修改按钮
    this.$editBtn = $("#brief-introduction-box button");
    // 获取关闭按钮
    this.$close = $("#brief-introduction-box .close");
    // 获取拖拽区域
    this.$drapArea = $("#brief-introduction-box .drap-area");
    //获取提示信息
    this.$tips = $("#brief-introduction-box .tips"); 
    // 调用初始化函数
    this.init(); 
  }
  init() {
    // console.log(this.$detialContent);
    // 给详情页按钮注册点击事件
    this.$introductionBtn.on("click",function() {
      console.log("详情页按钮被点了");
      introductionThat.$detialPage.fadeToggle(300);
    });
    //给详情页的关闭按钮注册事件
    this.$close.on("click", function() {
      introductionThat.$detialPage.fadeOut(300);
    });
    //给修改按钮注册事件
    this.$editBtn.on("click", function() {
      introductionThat.$detialContent = $("#brief-introduction-box .content-box");
      console.log(introductionThat.$detialContent);
      if($(this).text() == "修改") {
        introductionThat.edit(introductionThat.$detialContent);
      }else if($(this).text() == "完成") {
        console.log("完成")
        introductionThat.finishEdit(introductionThat.$detialContent);
      }
    });
    // 给拖拽区域注册事件
    this.$drapArea.on("mousedown",function(event) {
      let ox = event.clientX - introductionThat.$detialPage[0].offsetLeft;
      let oy = event.clientY - introductionThat.$detialPage[0].offsetTop;
      console.log(ox,oy);
      $(document).on("mousemove",function(e) {
        let x = e.pageX;
        let y = e.pageY;
        console.log(x,y);
        introductionThat.$detialPage[0].style.left = x - ox + "px";
        introductionThat.$detialPage[0].style.top = y - oy + "px";
      })
    })
    // 给document注册事件解绑
    $(document).on("mouseup",function() {
      
      $(document).unbind("mousemove");
    })
    // 给输入框注册键盘按下事件
    this.$detialContent.on("input",function(e) {
      let max = 150;
      console.log($(this).text().length);
      if($(this).text().length > max) {
        //超过150字时阻止输入
        $(this).text($(this).text().substring(0,150));
        let range = window.getSelection();//创建range
        range.selectAllChildren(this);//range 选择obj下所有子内容
        range.collapseToEnd();//光标移至最后
        introductionThat.$tips.addClass("tips-anim");
        $(this).addClass("modification-limit");
      }else {
        introductionThat.$tips.removeClass("tips-anim");
        $(this).removeClass("modification-limit");
      }
    })
  }
  //编辑功能
  edit(obj) {
    let max = 150;
    obj[0].setAttribute("contenteditable", "true");
    obj[0].focus();
    obj.on("keydown",function(event) {
      if(event.keyCode == "13") {
        this.blur();
        introductionThat.$editBtn[0].innerText = "修改";
        obj[0].setAttribute("contenteditable", "false");
        //移除高亮提示
        introductionThat.$tips.removeClass("tips-anim");
        $(this).removeClass("modification-limit");
      }
    })
    introductionThat.$editBtn[0].innerText = "完成";
  }
  //完成编辑
  finishEdit(obj) {
    let text = obj[0].innerText;
    obj[0].setAttribute("contenteditable", "false");
    obj[0].innerText = text;
    introductionThat.$editBtn[0].innerText = "修改";
  }
  //拖拽功能
  drap(obj) {
    let ofs = obj.offset();
    console.log(ofs);
  }
}

//学生列表模块
let studentListThat;
class studentList {
  constructor() {
    studentListThat = this;
    // 获取tbody
    this.$table = $(".table .table-body");
    //获取加载动画
    this.$loadingAnimate = $(".login-animate")
    // 获取分页按钮组
    this.$pageingBtns = $(".paging");
    // 获取发起新一轮考核按钮
    this.$newStep = $("#table-box .new-step");
    // 获取搜索框
    this.$search = $("#table-box .search .search-input");
    // 获取搜索按钮
    this.$searchBtn = $("#table-box .search #glass");
    //取消搜索按钮
    this.$quitSearch =  $("#table-box .quit-search");
    // 获取tr
    this.$allTr = $(".table .table-body tr");
    // 获取编辑按钮
    this.$editBtn = $("#table-box tbody tr button.edit");
    // 获取删除按钮
    this.$delete = $("#table-box tbody tr button.delete");
    // 获取添加按钮
    this.$add = $("#table-box tbody tr button.add");
    
    // 获取阶段按钮
    this.$stageUl = $("#table-box .search .classify");
    // 获取最新的阶段
    this.$newStage = 0;
    // 记录选中的阶段
    this.$curStage = 0;
    this.init();
  }
  init() {
    this.updata();
    console.log(this.$table);
    //给发起新一轮按钮注册事件
    this.$newStep.on("click",function() {
      //发起新一轮自动跳到最新状态
      let func = function() {
        newPrimary.$addNav.show(250);
        newAside.$btns.hide(250);
        studentListThat.$delete.hide(100);
        studentListThat.$editBtn.hide(100);
        studentListThat.$add.show(100);
      }
      studentListThat.toNewStatus(func);

    })
    //给搜索框注册事件
    this.$search.on("keydown",function(event) {
      if(event.keyCode == 13) {
        event.currentTarget.blur();
      }
    })
    this.$search.on("focus",function() {
      studentListThat.$quitSearch.show(0);
      studentListThat.$newStep.hide(200);
    })
    //取消搜索
    this.$quitSearch.on("click",function() {
      console.log("取消搜索");
      studentListThat.$newStep.show(200);
      studentListThat.$quitSearch.fadeOut(300);
      // 更新表格数据及分页按钮
      studentListThat.updateTable("https://easydoc.xyz/mock/pcA33l2V","https://easydoc.xyz/mock/TMvEb2Re");
    })
    this.$search.on("blur",function() {
      if(this.value.trim() == "") {
        return false;
      }
      // 搜索的字段
      let str = this.value.trim();
      // 显示搜索结果
      newStudentList.updateTable("https://easydoc.xyz/mock/VawZrtJT","https://easydoc.xyz/mock/TMvEb2Re");
    });
    //给搜索按钮注册事件
    this.$searchBtn.on("click",function() {
      studentListThat.$search.blur();
    })
    // 给阶段按钮注册事件
    this.$stageUl.on("click","li",function(event) {
    
      if($(event.currentTarget).index() == 0) {
        return false;
      }else {
        $(event.currentTarget).addClass("current-stage");
        $(event.currentTarget).siblings().removeClass("current-stage");
        //更新当前选中的阶段按钮状态
        studentListThat.$curStage = $(event.currentTarget).index() - 1;
        // 显示对应阶段的数据
        studentListThat.updateTable("https://easydoc.xyz/mock/pcA33l2V","https://easydoc.xyz/mock/TMvEb2Re");
      }
    })
    // 给table委托事件
    this.$table.on("click","tr td button",function(event) {
      console.log($(event.currentTarget).index());
      //编辑按钮
      if($(event.currentTarget).index() == 0) {
        console.log(this);
        if(this.innerText == "编辑") {
          let lastFocus = $(".tr-focus");
          // 移除上一个元素的类名
          lastFocus.removeClass("tr-focus");
          lastFocus.children().last().children(".edit").text("编辑");
          lastFocus.children().prop({
            contenteditable: false
          })
          this.innerText = "完成";
          studentListThat.edit($(this.parentNode),true);
          $(this.parentNode.parentNode).addClass("tr-focus");
        }else {
          this.innerText = "编辑";
          studentListThat.finishEdit($(this.parentNode));
          $(this.parentNode.parentNode).removeClass("tr-focus");
        }
      }
      //删除按钮
      if($(event.currentTarget).index() == 1) {
        let targetNode = $(this.parentNode.parentNode);
        targetNode.remove();
      }
      //添加按钮
      if($(event.currentTarget).index() == 2) {
        console.log(this);
        let studentId = $(this).parent().siblings()[1].innerText;
        let name = $(this).parent().siblings()[2].innerText
        let index = $(this).parent().parent().index();
        // console.log(index);
        let newTr = `<td>${studentId}</td><td>${name}</td><td class="text-center"><i class="iconfont icon-guanbi"></i></td>`;
        let tr = document.createElement("tr");
        tr.innerHTML = newTr;
        tr.setAttribute("index", index); 
        newPrimary.$addTbody.append($(tr));
        // console.log("添加按钮")
        $(this).addClass("forbid").attr("disabled","disabled");
      }
    });
  }
  updata() {

    studentListThat.$table = $(".table .table-body");
    // 获取tr
    studentListThat.$allTr = $(".table .table-body tr");
    // 获取编辑按钮
    studentListThat.$editBtn = $("#table-box tbody tr button.edit");
    // 获取删除按钮
    studentListThat.$delete = $("#table-box tbody tr button.delete");
    // 获取添加按钮
    studentListThat.$add = $("#table-box tbody tr button.add");
  }
  toNewStatus(func) {
    studentListThat.$stageUl.children().last().click().addClass("current-stage");
    studentListThat.$stageUl.children().last().click().siblings().removeClass("current-stage");
    //更新当前选中的阶段按钮状态
    studentListThat.$curStage = $(event.currentTarget).index() - 1;
    // 显示对应阶段的数据
    studentListThat.updateTable("https://easydoc.xyz/mock/pcA33l2V","https://easydoc.xyz/mock/TMvEb2Re",func);
  }
  // 更新表格及分页数据
  updateTable(tableurl,pageurl,func) {
    //重新获取当前阶段的数据
    newPage.getData({
      url: tableurl,
      data: {
        pageCode: 1,
        status: studentListThat.$curStage
      }
    }).then((res) => {
      //更新表格数据
      newStudentList.creatEle(res,studentListThat.$table);
      console.log("我完成数据获取了");
      
      //更新分页按钮
      return newPage.getData({
        url: pageurl,
        communityId: 333,
        communityId: 444,
        status: studentListThat.$curStage
      })
    }).then((res) => {
      if(func) {
        console.log(func);
        func();
      }
      let totalPage = res.object.studentCount;
      newpaging.creatLis(studentListThat.$curStage,totalPage);
    })
  }
  // 动态生成表格
  creatEle(msg,table) {
    console.log("生成表格");
    table.empty();
    let data = msg.object;
    for(let i = 0;i < data.length; i++) {
      let ele = document.createElement("tr");
      let eleInner = 
      `
        <td>${i+1}</td>
        <td>${data[i].studentNumber}</td>            
        <td>${data[i].studentName}</td>  
        <td>${data[i].studentSex}</td>  
        <td>${data[i].studentPhone}</td>  
        <td>${data[i].studentAcademy}</td>  
        <td>${data[i].studentMajorClass}</td>  
        <td>${data[i].studentDormitory}</td>
        <td><button class="edit btn btn-primary">编辑</button><button class="delete btn btn-warning">删除</button><button class="add btn btn-info">添加</button></td>  
      `;
      ele.innerHTML = eleInner;
      table.append($(ele));
    }
    studentListThat.updata();
  }
  
  // 给元素添加编辑
  edit(obj,status) {
    console.log("元素可编辑");
    obj.siblings().slice(1).prop({
      contenteditable:status
    })
    obj.siblings()[1].focus();
    obj.siblings().on("keydown",function(event) {
      if(event.keyCode == 13) {
        this.blur();
      }
    })
  }
  //完成修改
  finishEdit(obj) {
    console.log("完成修改了")
    obj.siblings().slice(1).prop({
      contenteditable:"false"
    });
  }
}

let pagingThat;
class Paging {
  constructor() {
    pagingThat = this;
    //获取分页按钮ul
    this.$pageUl = $(".paging ul");
    //获取分页按钮的li
    this.$lis = $(".paging ul li");
    //获取上一页按钮
    this.$lastPage = $(".paging .last-page");
    // 获取下一页按钮
    this.$nextPage = $(".paging .next-page");
    //获取页码总数
    this.$pageTotal = 0;
    // this.init();
  }
  init() {
    this.creatLis(1,this.$pageTotal);
    // 更新小lis
    this.update();
    this.lineHeight($(".paging ul li"),1);
    // ul委托事件
    this.$pageUl.on("click","li",function(event) {
      // console.log(this.innerText);
      // 需要跳到的页码
      let num = this.innerText;
      if(event.target.innerText == "···") {
        return false;
      }else {
        pagingThat.creatLis(Number(event.target.innerText),pagingThat.$pageTotal);
        pagingThat.lineHeight($(".paging ul li"),Number(event.target.innerText));
        //获取新的一页的信息
        newPage.getData({
          url: "https://easydoc.xyz/mock/pcA33l2V",
          data: {
            communityId: 4555,
            status: 0,
            pageCode: num
          }
        }).then(function(res) {
          newStudentList.creatEle(res,newStudentList.$table);
        })
      }
    })
    //上一页按钮注册事件
    this.$lastPage.on("click",function() {
      pagingThat.changePage(1,-1);
    })
    //下一页注册事件
    this.$nextPage.on("click",function() {
      pagingThat.changePage(pagingThat.$pageTotal,1);
    })
  }
  //更新元素
  update() {
    pagingThat.$lis = $(".paging ul li.fl");
    console.log(pagingThat.$lis);
  }
  //动态生成lis
  creatLis(cur = 0,total) {
    console.log(this);
    console.log(total);
    pagingThat.$pageUl.empty()
    let ulInner = ""; 
    if(total > 7) {
      if(cur < 5) {
        ulInner = `<li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>···</li><li>${total}</li>` ;
      }
      if(cur >= 5) {
        ulInner = `<li>1</li><li>···</li><li>${cur-1}</li><li>${cur}</li><li>${cur+1}</li><li>···</li><li>${total}</li>`
      }
      if(cur >= total - 2) {
        ulInner = `<li>1</li><li>···</li><li>${total-4}</li><li>${total-3}</li><li>${total-2}</li><li>${total-1}</li><li>${total}</li>`;
      }
    }else {
      for(let i = 0; i < total; i++) {
        ulInner += `<li>${i+1}</li>`
      }
    }
    pagingThat.$pageUl[0].innerHTML = ulInner;
  }
  //上下页切换
  changePage(limit,way) {
    let num = Number(pagingThat.$pageUl.children(".currentPage").text());
    if(num == limit) {
      return false;
    }else{
      pagingThat.creatLis(num+way,pagingThat.$pageTotal);
      pagingThat.lineHeight($(".paging ul li"),num+way);
      //发送请求获取对应页的内容
      newPage.getData({
        type: "post",
        url: "https://easydoc.xyz/mock/pcA33l2V",
        data: {

        }
      }).then(function(res) {
        newStudentList.creatEle(res,studentListThat.$table);
        newStudentList.$loadingAnimate.hide(0);
      })
    }
  }
  //按钮高亮
  lineHeight(arr,target) {
    // console.log(target-1);
    arr.each(function(i) {
      if(arr.eq(i).text() == target) {
        // console.log(arr.eq(i));
        arr.eq(i).addClass("currentPage");
      }
    })
  }
}
// 预选栏
let primaryThat;
class Primary {
  constructor() {
    primaryThat = this;
    this.$addNav = $("#add-nav");
    this.$addTbody = $("#add-nav table tbody");
    this.$allTr = $("#add-nav table tbody tr");
    //确认按钮
    this.$affirmBtn = $("#add-nav .affirm");
    //取消按钮
    this.$quitBtn = $("#add-nav .quit");
    this.init();
  }
  init() {
    // 给取消按钮注册事件
    this.$quitBtn.on("click",function() {
      primaryThat.$addNav.hide(250);
      newAside.$btns.show(250);
      //恢复按钮
      newStudentList.$delete.show(100);
      newStudentList.$editBtn.show(100);
      newStudentList.$add.hide(100);
    })
    // 给确定按钮注册事件
    this.$affirmBtn.on("click",function() {
      primaryThat.$addNav.hide(250);
      newAside.$btns.show(250);
      //恢复按钮
      newStudentList.$delete.show(100);
      newStudentList.$editBtn.show(100);
      newStudentList.$add.hide(100);
      //发起状态改变的请求

      //清空预选栏中数据
      primaryThat.$addTbody.empty();
    })
    //给tbody委托事件
    this.$addTbody.on("click","i",function() {
      $(this).parent().parent().remove();
      let index = $(this).parent().parent().attr("index");
      newStudentList.$allTr = $(".table .table-body tr");
      newStudentList.$allTr.eq(index).find(".add").removeClass("forbid").prop("disabled","");
    })
  }
}
// let passwordThat;
// class PasswordPage {
//   constructor() {
//     //获取密码页面
//     this.$passwordPage = $("")
//   }
// }
let pageThat;
//页面数据初始化页面
class Page{
  constructor() {
    //获取最新阶段
    this.$stage = 0;
    //获取最新一页
    this.$newPage = {};
    this.init();
  }
  init() {
    //最新的数据
    this.getData({
        url: "https://easydoc.xyz/mock/sm66OUlK",
        communityId: 6666,
        departmentId: 777
      }).then((res) => {
        // 更新table中的阶段信息
        newStudentList.$newStage =  res.object.status;
        return this.getData({
          url: "https://easydoc.xyz/mock/pcA33l2V",
          data: {
            pageCode: 1,
            departmentId: 111,
            communityId: 1111,
            status: res.object.status
          }
        });
      }).then((res1) => {
        console.log(res1);
        // 更新table 中的数据
        newStudentList.creatEle(res1,studentListThat.$table);
        newStudentList.$loadingAnimate.hide(0);
        return newPage.getData({
          url: "https://easydoc.xyz/mock/TMvEb2Re",
          data:{
            communityId: 666,
            departmentId: 9999,
            status: newStudentList.$newStage
          }
        })
      }).then((res2)=> {
        // 更新页码
        newpaging.$pageTotal = res2.object.studentCount; 
        newpaging.init();
      })
  }
  //获取数据
  getData(param) {
    return new Promise(function(resovle, reject) {
      $.ajax({
        "type":param.type || "get",
        "async":param.async || true,
        "url":param.url,
        "data":param.data || "",
        "headers":param.headers,
        "success": function(res) {
          resovle(res);
        },
        "error":function(err) {
          reject(err);
        }
      })
    })
  }
}
//左侧栏实例
let newAside = new aside();
// 登录模块实例
let newLogin = new login();
//部门详情模块
let newIntroduction = new introduction();
// 学生列表模块
let newStudentList = new studentList();
//分页模块
let newpaging = new Paging();
// 右侧栏模块
let newPrimary = new Primary();
// 修改密码模块

// 页面数据加载模块
let newPage = new Page();
