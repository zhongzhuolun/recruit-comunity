import $ from 'jquery';

var $tipBlock = $("#tip_block");
var $tipBlockTxt = $tipBlock.find("span");
const globalApis = {
  /**
   * 寻找筛选状态码对应的状态
   *
   * @param {*} statusCode 学生考核状态码
   * @returns 学生对应的考核状态
   */
  toStrStatus(statusCode) {
    switch (statusCode) {
      case '0': {
        return '已参与报名';
      };
    case '1': {
      return '第一阶段';
    };
    case '2': {
      return '第二阶段';
    };
    case '3': {
      return '第三阶段';
    }
    default: {
      return '第' + toChinesNum(statusCode) + '阶段';
    }
    }
  },
  /**
   *  寻找筛选状态对应的状态码
   *
   * @param {*} isStatusLatest 是否要最新的状态
   * @returns 学生考核状态码
   */
  getStatusCode(isStatusLatest) {
    // 要最新的给后台null
    if (isStatusLatest) {
      return null;
    } else {
      // 否则传目前所选
      return $(".filter-selected").eq(1).index() - 1;
    }
  },
  /**
   * 可以将数字转换成中文大写的表示，处理到万级别，例如 toChineseNum(12345)，返回 一万二千三百四十五。
   *
   * @param {*} num 要转换的数字
   * @returns 返回中文大写数字
   */
  toChinesNum(num) {
    let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']; //changeNum[0] = "零"
    let unit = ["", "十", "百", "千", "万"];
    num = parseInt(num);
    let getWan = (temp) => {
      let strArr = temp.toString().split("").reverse();
      let newNum = "";
      for (var i = 0; i < strArr.length; i++) {
        newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
      }
      return newNum;
    }
    let overWan = Math.floor(num / 10000);
    let noWan = num % 10000;
    if (noWan.toString().length < 4) noWan = "0" + noWan;
    return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);

  },

  /**
   * 获取部门id的函数
   *
   * @param {*} departmentName 部门名字
   * @returns 对应的部门id
   */
  findDepartmentId(departmentName) {
    if (departmentName === '所有部门') {
      // 如果对应所有部门则返回null,后台返回所有部门的数据
      return null;
    } else {

    }
  },
  /**
   * 警告小字体
   *
   * @param {*} event 事件对象
   * @param {*} text 要提示的内容
   */
  tipOut(event, text) {
    let t = $(event.target);
    let $newSpan = $('<span class="tip-out-span"><i class="iconfont" style="font-size:13px;padding-right:4px;">&#xe697;</i></span>');
    $newSpan.append(text);
    $(".container-fluid").append($newSpan);
    $newSpan.css({
      top: t.offset().top + 5 + "px",
      left: t.offset().left + t.width() / 2 + "px",
      color: "#c42c24",
      opacity: 0
    }).animate({
      top: t.offset().top - 15 + "px",
      opacity: 1
    }, 400, function () {
      $newSpan.animate({
        opacity: 0
      }, 300, function () {
        $newSpan.remove();
      })
    });
  },
  /**
   * 黑色的提醒状态框
   *
   * @param {*} text 弹出框的内容
   */
  tipOutBlock(text) {
    $tipBlockTxt.text(text);
    $tipBlock.addClass("tip-block-out");
    setTimeout(function () {
      $tipBlock.removeClass("tip-block-out");
    }, 1400);
  },
  /**
   * 设置光标位置的函数
   *
   * @param {*} element 要设置的对象
   * @param {*} pos 设置光标的位置
   */
  setCaretPosition(element, pos) {
    var range, selection;
    range = document.createRange(); //创建一个选中区域
    range.selectNodeContents(element); //选中节点的内容
    if (element.innerHTML.length > 0) {
      range.setStart(element.childNodes[0], pos); //设置光标起始为指定位置
    }
    range.collapse(true); //设置选中区域为一个点
    selection = window.getSelection(); //获取当前选中区域
    selection.removeAllRanges(); //移出所有的选中范围
    selection.addRange(range); //添加新建的范围
  },



  /**
   * 将光标位置移动到最后
   * 
   * @param {*} obj 移动光标的对象
   */
  selectionToEnd(obj) {
    let range = window.getSelection();
    range.selectAllChildren(obj);
    range.collapseToEnd();
  },

  /**
   * 获取轮播图申请状态
   *
   * @param {*} statusCode 状态码
   * @returns 返回审核状态文字以及相关类名
   */
  getBannerStatus(statusCode) {
    switch (statusCode) {
      case 0: {
        return ["审核未通过", "failed-review"]
      };
    case 1: {
      return ["审核中", "reviewing"]
    };
    case 2: {
      return ["审核已通过", "success-review"]
    };
    case 3: {
      return ["展示中", "exhibiting"]
    };
    }
  }


};

export {globalApis};
// import $ from 'jquery';
// const  globalApis = {

// // }
// /**
//  * 寻找筛选状态码对应的状态
//  *
//  * @param {*} statusCode 学生考核状态码
//  * @returns 学生对应的考核状态
//  */
// const toStrStatus = (statusCode) => {
//   switch (statusCode) {
//     case '0': {
//       return '已参与报名';
//     };
//   case '1': {
//     return '第一阶段';
//   };
//   case '2': {
//     return '第二阶段';
//   };
//   case '3': {
//     return '第三阶段';
//   }
//   default: {
//     return '第' + toChinesNum(statusCode) + '阶段';
//   }
//   }
// }


// /**
//  *  寻找筛选状态对应的状态码
//  *
//  * @param {*} isStatusLatest 是否要最新的状态
//  * @returns 学生考核状态码
//  */
// const getStatusCode = (isStatusLatest) => {
//   // 要最新的给后台null
//   if (isStatusLatest) {
//     return null;
//   } else {
//     // 否则传目前所选
//     return $(".filter-selected").eq(1).index() - 1;
//   }
// }


// /**
//  * 可以将数字转换成中文大写的表示，处理到万级别，例如 toChineseNum(12345)，返回 一万二千三百四十五。
//  *
//  * @param {*} num 要转换的数字
//  * @returns 返回中文大写数字
//  */
// const toChinesNum = (num) => {
//   let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']; //changeNum[0] = "零"
//   let unit = ["", "十", "百", "千", "万"];
//   num = parseInt(num);
//   let getWan = (temp) => {
//     let strArr = temp.toString().split("").reverse();
//     let newNum = "";
//     for (var i = 0; i < strArr.length; i++) {
//       newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
//     }
//     return newNum;
//   }
//   let overWan = Math.floor(num / 10000);
//   let noWan = num % 10000;
//   if (noWan.toString().length < 4) noWan = "0" + noWan;
//   return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);

// }


// /**
//  * 获取部门id的函数
//  *
//  * @param {*} departmentName 部门名字
//  * @returns 对应的部门id
//  */
// const findDepartmentId = (departmentName) => {
//   if (departmentName === '所有部门') {
//     // 如果对应所有部门则返回null,后台返回所有部门的数据
//     return null;
//   } else {

//   }
// }


// /**
//  * 警告小字体
//  *
//  * @param {*} event 事件对象
//  * @param {*} text 要提示的内容
//  */
// const tipOut = (event, text) => {
//   let t = $(event.target);
//   let $newSpan = $('<span class="tip-out-span"><i class="iconfont" style="font-size:13px;padding-right:4px;">&#xe697;</i></span>');
//   $newSpan.append(text);
//   $(".container-fluid").append($newSpan);
//   $newSpan.css({
//     top: t.offset().top + 5 + "px",
//     left: t.offset().left + t.width() / 2 + "px",
//     color: "#c42c24",
//     opacity: 0
//   }).animate({
//     top: t.offset().top - 15 + "px",
//     opacity: 1
//   }, 400, function () {
//     $newSpan.animate({
//       opacity: 0
//     }, 300, function () {
//       $newSpan.remove();
//     })
//   });
// }



// /**
//  * 黑色的提醒状态框
//  *
//  * @param {*} text 弹出框的内容
//  */
// const tipOutBlock = (text) => {
//   $tipBlockTxt.text(text);
//   $tipBlock.addClass("tip-block-out");
//   setTimeout(function () {
//     $tipBlock.removeClass("tip-block-out");
//   }, 1400);
// }


// /**
//  * 设置光标位置的函数
//  *
//  * @param {*} element 要设置的对象
//  * @param {*} pos 设置光标的位置
//  */
// const setCaretPosition = function (element, pos) {
//   var range, selection;
//   range = document.createRange(); //创建一个选中区域
//   range.selectNodeContents(element); //选中节点的内容
//   if (element.innerHTML.length > 0) {
//     range.setStart(element.childNodes[0], pos); //设置光标起始为指定位置
//   }
//   range.collapse(true); //设置选中区域为一个点
//   selection = window.getSelection(); //获取当前选中区域
//   selection.removeAllRanges(); //移出所有的选中范围
//   selection.addRange(range); //添加新建的范围
// }



// /**
//  * 将光标位置移动到最后
//  * 
//  * @param {*} obj 移动光标的对象
//  */
// const selectionToEnd = (obj) => {
//   let range = window.getSelection();
//   range.selectAllChildren(obj);
//   range.collapseToEnd();
// }

// /**
//  * 获取轮播图申请状态
//  *
//  * @param {*} statusCode 状态码
//  * @returns 返回审核状态文字以及相关类名
//  */
// const getBannerStatus = (statusCode) => {
//   switch (statusCode) {
//     case 0: {
//       return ["审核未通过", "failed-review"]
//     };
//   case 1: {
//     return ["审核中", "reviewing"]
//   };
//   case 2: {
//     return ["审核已通过", "success-review"]
//   };
//   case 3: {
//     return ["展示中", "exhibiting"]
//   };
//   }
// }

// export {globalApis};




 