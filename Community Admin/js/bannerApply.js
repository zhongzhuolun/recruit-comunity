import $ from 'jquery';
import {
  globalApis
} from './globalApis';

function bannerApply() {

  // 社团申请主页轮播图
  let $bannerTable = $(".banner-apply .table"); // 获取轮播图表格
  let hasGetMsg = false; // 是否初始获取了轮播图

  $(".left-nav").on("click", "li", function () {
    // 点击申请主页轮播图并且还没获取数据
    if ($(this).find(".hidden-xs").text().trim() === '申请主页轮播图' && !hasGetMsg) {
      // 获取轮播图状态数据
      let html = '<thead><tr><td>序号</td><td>图片</td><td>审核状态</td><td>相关操作</td></tr></thead>';
      $.ajax({
        type: "get",
        url: "url",
        data: {
          communityId: '',
        },
        dataType: "json",
        success: function (response) {
          let responseObj = response.object;
          let statusArr;
          for (let i = 0; i < responseObj.length; i++) {
            statusArr = getBannerStatus(responseObj[i].status);
            html += createApplyTr(responseObj[i].fileName, statusArr[0], statusArr[1]);
          }
          // 将获取到的内容生成表格内容
          $bannerTable.html(html);
          // 重置序号
          resetNum();
        }
      });
      hasGetMsg = true;
    }
  });


  /**
   * 添加申请轮播图表的每一行
   *  
   * @param {*} imgUrl 图片url
   * @param {*} applyStatus 申请状态文字
   * @param {*} statusClass 对应申请状态的类名
   * @returns 返回tr字符串
   */
  function createApplyTr(imgUrl, applyStatus, statusClass) {
    return '<tr><td class="num"></td><td class="upload-img"><a href="#" class="thumbnail"><img src="' + imgUrl + '" alt="" class="banner-img"></a></td><td class="' + statusClass + '">' + applyStatus + '</td><td><button class="btn btn-danger">删除</button></td></tr>';
  }


  /**
   * 重置表中序号
   *
   */
  function resetNum() {
    let total = $bannerTable.find("tr").length;
    let $nums = $bannerTable.find(".num");
    for (let j = 0; j < total; j++) {
      $nums.eq(j).text(j + 1);
    }
  }

  // 预览图片与关闭图片
  let $previewDiv = $(".preview-img-container");
  $bannerTable.on("click", ".banner-img", function(){
    $previewDiv.find("img").attr("src",$(this).attr("src"));
    $previewDiv.show("fast");
  });
  $previewDiv.find("i").on("click", function(){
    $previewDiv.hide("fast");
  });

}


export {
  bannerApply
};