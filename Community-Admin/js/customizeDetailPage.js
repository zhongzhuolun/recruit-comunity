import $ from 'jquery';
// import {globalApis} from './globalApis'
import {globalApis} from './globalApis';
// 自定义社团详情页板块
// $(()=>{
  function customizeDetailPage() {
  // 引入外部函数
  let {
    tipOut,
    tipOutBlock,
    selectionToEnd,
  } = globalApis;

  // 自定义详情页→模板按钮选择
  let $templateBtnsContainer = $(".edit-side-bar .edit-btns");
  // 模板按钮
  let $templateBtns = $(".template-btn");
  // 获取所有模板
  let $templates = $(".template");

  // 模板选择
  $templateBtnsContainer.on("click", ".template-btn", function(){
    // 更新按钮样式
    $templateBtns.eq($(this).index()).addClass("template-seleted").siblings(".template-btn").removeClass("template-seleted");
    $templates.eq($(this).index()).removeClass("scale-in").addClass("scale-out").siblings(".template").removeClass("scale-out").addClass("scale-in");
    // 重置scrollTop = 0
    $(".edit-main-body").scrollTop(0);
  });

  // 是否正在自定义
  let isCustomizing = false;
  let $editCustomizeTarget;  // 编辑模板对象
  let $canCustomizeEdits;  // 可以编辑的元素
  let $imgContainers; // 图片替换区
  let customizeEdited = false;   // 是否已经编辑完成

  // 开始自定义
  $(".customize-operating .btn1").on("click", function (event) {
    // 获取对应的模板
    $editCustomizeTarget = $templates.eq($(".template-seleted").index());
    $editCustomizeTarget.parent().addClass("template-customizing");
    // 获取模板中可编辑的对象
    $canCustomizeEdits = $editCustomizeTarget.find(".can-edit");
    $imgContainers = $editCustomizeTarget.find(".img-container");

    // 如果不是正在自定义才执行操作
    if(!isCustomizing) {
      isCustomizing = true; // 正在自定义
      $imgContainers.addClass("can-edit-img"); // 为图片添加可编辑类名
      $(".customize-operating .btn1").addClass("customizing"); // 自定义中
      // 编辑元素样式变化
      $canCustomizeEdits.css({
        background: "#16b47a23",
        color: "black"
      });

      // 回车失焦
      $editCustomizeTarget.on("keydown", ".can-edit", function(e) {
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
      $editCustomizeTarget.on("click", ".can-edit", function(e) {
        // 可编辑
        $(this).attr("contenteditable", "true").focus();
        return false;
      });
      // 聚焦样式
      $editCustomizeTarget.on("focus", ".can-edit", function(e) {
        $(this).css({
          background: "white",
          color: "black"
        });
      });
      // 失焦事件
      $editCustomizeTarget.on("blur", ".can-edit", function(e) {
        if (!!!$(this).text().trim()) {
          tipOut(event, "编辑内容不能为空噢~");
          $(this).focus();
        } else {
          $(this).css({
            background: "#16b47a23",
            color: "black"
          });
        }
        // 左右小标题宽度重置（特判）
        if($(this).parent().is(".additional-section-header") && $(this).parent().children().length === 3) {
          $(this).parent().width($(this).width());
        }
      });
      $editCustomizeTarget.on("input", ".additional-section-txt", function(e) {
        if ($(this).text().length > 150) {
          $(this).text($(this).text().substring(0, 150));
          selectionToEnd(this);
          tipOut(e, "不能超过150字噢");
        }
      });  
      
      $editCustomizeTarget.on("input", ".main-txt", function(e) {
        if ($(this).text().length > 300) {
          $(this).text($(this).text().substring(0, 300));
          selectionToEnd(this);
          tipOut(e, "不能超过300字噢");
        }
      });
    } else {
      tipOut(event, "正在自定义中……");
    }
    
  });

  // 完成编辑
  $(".customize-operating .btn2").on("click",function(event){
    // 如果正在自定义才可以完成编辑
    if(isCustomizing) {
      $editCustomizeTarget = $templates.eq($(".template-seleted").index());
      $canCustomizeEdits = $editCustomizeTarget.find(".can-edit");
      $editCustomizeTarget.parent().removeClass("template-customizing");
      $imgContainers = $editCustomizeTarget.find(".img-container");
      // 完成编辑则重置样式和相关变量以及事件
      isCustomizing = false;
      customizeEdited = true;
      $imgContainers.removeClass("can-edit-img");
      $(".customize-operating .btn1").removeClass("customizing");
      $canCustomizeEdits.attr({
        style:'',
        contenteditable: "false"
      });
      $editCustomizeTarget.unbind();
      tipOutBlock("已保存");
      // 发送ajax请求
    } else {
      customizeEdited = false;
      tipOut(event, "还未进行自定义噢(・。・)");
    }
  });

  // 点我上传按钮
  $(".customize-operating .btn3").on("click",function(){
    if(customizeEdited) {
      customizeEdited = false;
      tipOutBlock("上传成功");
      // TODO:
      $.ajax({
        type: "method",
        url: "url",
        data: "data",
        dataType: "dataType",
        success: function (response) {
          
        }
      });
    } else {
      tipOut(event, "请先完成编辑呐(・。・)");
    }
  });

  // 模板中添加部门
  $(".add-another").on("click",function(e){
    if(isCustomizing) {
      if($editCustomizeTarget.find(".additional-section").length <= 7) {
        switch ($(".template-seleted").index()){
          case 0:{
            let direction;
            // 如果左向与右向数目相同，则添加左向，否则添加右向
            if($(this).parent().prev().hasClass("additional-section-header-right")){
              direction = "left";
            } else {
              direction = "right";
            }
            let html = '<section class="additional-section additional-section-header-' + direction + '">' 
                    + '<i class="iconfont delete" title="删除">&#xe610;</i><span class="additional-section-header"><span class="can-edit" style="background: rgba(22, 180, 122, 0.137); color: black;">财务处</span><span class="dividing-line"></span><span class="bottom-line"></span></span>'
                    + '<p class="additional-section-txt can-edit" style="background: rgba(22, 180, 122, 0.137); color: black;">财务处是学校财务工作的职能部门，在校党委、行政的领导下，全面负责学校财务管理和会计核算工作，下设预算管理科、科研经费管理科、收费管理科、稽核科、财务信息科、会计核算科、会计服务中心、会计委派科、综合科等九个科室，现有财会人员50人，其中硕士以上学历22人，中高级职称32人</p></section>';
            $(html).insertBefore($editCustomizeTarget.find(".img-container-2"));        
            tipOutBlock("添加成功");
          };break;
          default:{
            
          };break;
        }
      } else {
        tipOut(e, "不能再添加啦~");
      }
    }
  });

  // 模板中删除部门
  $(".template").on("click", ".delete", function(){
    if(confirm("确定删除吗？")){
      $(this).parent().hide("fast",function(){
        $(this).remove();
      });
    }
  });
}


// });

export {customizeDetailPage};