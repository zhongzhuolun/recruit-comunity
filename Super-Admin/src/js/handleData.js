import $ from 'jquery';
import exitComunityData from '../../lib/data';
const echarts = require('echarts');
import {comfirmFlag, $comfirmFrame} from './comfirm';
// 定义全局变量
const $myPage = $('#zzl-page'); // 页面包裹元素
const $breadcrumb = $('.breadcrumb li') // 路径导航条
const $navApply = $('.nav-apply'); // 侧边栏审核管理
const $userApply = $('.user-apply') // 侧边用户审核管理
const $bannerApply = $('.banner-apply') // 侧边栏轮播图审核管理
const $bannerManagePage = $('#banner-manage'); // 轮播图信息管理界面
const $skinBtn = $('.skin .btn'); // 获取换肤按钮
const $pageBtns = $('.home-data'); // 获取主页的四个按钮
const $comfirmBtn = $('.alert .comfirm');
const $tempImgContainer = $('.img-container');
const $container = $tempImgContainer.find('.container');
let userInformationPageIndex = 0;
let bannerManagePageIndex = 0;
let userApplyPageIndex = 0;
let bannerApplyPageIndex = 0;
const Authorization = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJTdXBlckFkbWluIl0sImFkbWluSWQiOjEsImV4cCI6MTU2NTg3MTc5MH0.2vfsIxE6BMs95Ru4tMttia-9ev8Ns6WWb_YWhylcF8k';

// 定义一个对象，专门用于存储处理数据的函数
const handleData = {
    // 序列化函数
    serial: ($obj) => {
        const $serialEle = $obj.find('.serial-num');
        $serialEle.each((key, item) => {
            item.innerHTML = key + 1;
        })
    },
    // 一键换肤功能
    switchingSkin: () => {
        $myPage.toggleClass('normal')
        if ($skinBtn.text() == '夜间模式') {
            $skinBtn.text('日间模式');
        } else {
            $skinBtn.text('夜间模式');
        }
    },
    // 首页扇形图表
    echartStr: (names, brower) => {
        let myChart;
        if (myChart != null && myChart != "" && myChart != undefined) {
            myChart.dispose();
        }
        myChart = echarts.init(document.getElementById('main'));
        const option = {
            title: {
                text: '数据可视化中心',
                // subtext: '纯属虚构',
                x: 'center',
                textStyle: {
                    color: "white"
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: names,
                textStyle: {
                    color: "white"
                },
                top: 30
            },
            color: ['#449D88', '#406cb8', '#c0444c', '#4c4c4c'],
            series: [{
                name: '访问来源',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: brower,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                label: {
                    normal: {
                        show: false,
                    }
                },
            }]
        };
        myChart.setOption(option);
    },
    // 侧边栏颜色控制
    resetColor: ($obj) => {
        $obj.parents('.list-group').eq(1).find('.detail').css({
            color: "rgb(120, 117, 117)"
        });
        $obj.css({
            color: "#25a7ab"
        });
    },
    // 生成首页图表数据
    sector: () => {
        // 定义两个数组，分别存储数目和名称，用于扇形图表
        let brower = [],
            names = ["用户人数", "轮播图数目", "待审核社团", "待审核轮播图"];
        // 存储待审核总数目
        let applyNum = 0;
        // 利用promise对象，完成异步操作
        const loadData = (url) => {
            return new Promise((resolve, reject) => {
                $.ajax({
                    type: 'get',
                    headers: {Authorization},
                    url,
                    dataType: "json",
                    success: function (result) {
                        $pageBtns.eq(0).find('.num').html(result.object.length);
                        brower.push({
                            name: names[0],
                            value: result.object.length
                        });
                        resolve();
                    },
                    error: function (errorMsg) {
                        alert("请求数据失败!");
                        reject();
                    }
                });
            })
        };
        loadData("./exist-comunity.json")
            .then(() => {
                $.ajax({
                    type: 'get',
                    url: "./showing-banner.json",
                    headers: {Authorization},
                    dataType: "json",
                    success: function (result) {

                        $pageBtns.eq(1).find('.banner-num').html(result.object.length);
                        brower.push({
                            name: names[1],
                            value: result.object.length
                        });
                    },
                    error: function (errorMsg) {
                        alert("请求数据失败!");
                    }
                });
            }, () => {

            })
            .then(() => {
                $.ajax({
                    type: 'get',
                    url: "./register.json",
                    headers: {Authorization},
                    dataType: "json",
                    success: function (result) {
                        let registerLen = result.object.length;
                        applyNum = registerLen;
                        if (registerLen > 0) {
                            $userApply.find('.badge').html(registerLen)
                        } else {
                            $userApply.find('.badge').hide();
                        }
                        $pageBtns.eq(2).find('.user-apply-num').html(registerLen);
                        brower.push({
                            name: names[2],
                            value: registerLen
                        });
                    },
                    error: function (errorMsg) {
                        alert("请求数据失败!");
                    }
                });
            }, () => {

            })
            .then(() => {
                $.ajax({
                    type: 'get',
                    url: "./temp-banners.json",
                    headers: {Authorization},
                    dataType: "json",
                    success: function (result) {
                        let tempBannersLen = result.object.length;
                        applyNum += tempBannersLen;
                        if (tempBannersLen > 0) {
                            $bannerApply.find('.badge').html(tempBannersLen);
                        } else {
                            $bannerApply.find('.badge').hide();
                        }
                        if (applyNum > 0) {
                            $navApply.find('.badge').html(applyNum)
                        } else {
                            $navApply.find('.badge').hide();
                        }
                        $pageBtns.eq(3).find('.banner-apply-num').html(tempBannersLen);
                        brower.push({
                            name: names[3],
                            value: tempBannersLen
                        });
                        handleData.echartStr(names, brower);
                    },
                    error: function (errorMsg) {
                        alert("请求数据失败!");
                    }
                });
            }, () => {});
    },
    // 主页切换页面
    changePage: ($nav, $pageBtn, $page) => {
        $nav.slideDown().siblings('.row').slideUp();
        $nav.prev().siblings('.list-group-item').find('.toggle').removeClass('glyphicon-minus');
        $nav.prev().find('.toggle').addClass('glyphicon-minus');
        handleData.sideControl($pageBtn, $page);
        $pageBtn.trigger('click');
        $pageBtn.parents('.row').eq(0).prev().addClass('active').siblings().removeClass('active');
        $breadcrumb.eq(1).removeClass('active').html('<a href="javascript:;">' + $pageBtn.parents('.side').find('.active').find('.text').text() + '</a>').show();
        $breadcrumb.eq(2).addClass('active').show().html($pageBtn.find('.text').text());
    },
    // 生成用户管理界面初始化数据
    // initUserInformation: ($tbody, url) => {
    //     $.ajax({
    //         type: 'get',
    //         url,
    //         dataType: "json",
    //         success: function (result) {
    //             $(result.object).each((key, item) => {
    //                 let $item = '<tr>' +
    //                     '<td>' +
    //                     '<div class="checkbox radio">' +
    //                     '<label>' +
    //                     '<input type="checkbox">' +
    //                     '</label>' +
    //                     '</div>' +
    //                     '</td>' +
    //                     '<td class="serial-num">' + (key + 1) + '</td>' +
    //                     '<td>' + item.comunity + '</td>' +
    //                     '<td>' + item.manage + '</td>' +
    //                     '<td>' + item.studentNum + '</td>' +
    //                     '<td>' + item.phoneNum + '</td>' +
    //                     '<td>' + item["comunity-id"] + '</td>' +
    //                     '<td><button type="button" class="btn btn-danger ">删除</button></td>' +
    //                     '</tr>';
    //                 $tbody.append($item);
    //             })
    //         },
    //         error: function (errorMsg) {
    //             alert('请求数据失败，请检查网络情况');
    //         }
    //     });

    // },

    initUserInformation: ($tbody, url, index) => {
        // 另一种方法实现数据初始化包括分页
        $tbody.html("");
        const datas = exitComunityData[index].object;
        $(datas).each((key, item) => {
            let $item = '<tr>' +
                '<td>' +
                '<div class="checkbox radio">' +
                '<label>' +
                '<input type="checkbox">' +
                '</label>' +
                '</div>' +
                '</td>' +
                '<td class="serial-num">' + (key + 1) + '</td>' +
                '<td>' + item.comunity + '</td>' +
                '<td>' + item.manage + '</td>' +
                '<td>' + item.studentNum + '</td>' +
                '<td>' + item.phoneNum + '</td>' +
                '<td>' + item["comunity-id"] + '</td>' +
                '<td><button type="button" class="btn btn-danger ">删除</button></td>' +
                '</tr>';
            $tbody.append($item);
        })
    },
    // 用户管理界面分页功能
    // 下一页
    handleNextPage($obj, totalPage, $tbody, $currentPage, url) {
        $obj.siblings('li').removeClass('disabled');
        if (userInformationPageIndex >= totalPage - 1) {
            userInformationPageIndex = totalPage - 1;
            $obj.addClass('disabled');
        } else {
            userInformationPageIndex++;
            $currentPage.html(userInformationPageIndex + 1);
            $obj.removeClass('disabled');
            handleData.initUserInformation($tbody, url, userInformationPageIndex);
        }
    },
    // 上一页
    handlePrePage($obj, $tbody, $currentPage, url) {
        $obj.siblings('li').removeClass('disabled');
        if (userInformationPageIndex <= 0) {
            userInformationPageIndex = 0;
            $obj.addClass('disabled');
        } else {
            userInformationPageIndex--;
            $currentPage.html(userInformationPageIndex + 1);
            $obj.removeClass('disabled');
            handleData.initUserInformation($tbody, url, userInformationPageIndex);
        }
    },
    // 点击删除单个元素
    deleteOneItem: ($obj, $delegate) => {
            $obj.parents('tr').remove();
            handleData.serial($delegate);
    },
    // 改变单选框的状态及全选框的状态
    changeItemState: ($obj, $checkAll, $delegate) => {
        let flag = true;
        if ($obj.children().prop('checked')) {
            $obj.addClass('active');
        } else {
            $obj.removeClass('active');
            $checkAll.children().prop('checked', false);
        }
        $delegate.find('.radio input').each((key, item) => {
            if (!$(item).prop('checked')) {
                flag = false;
            }
        });
        $checkAll.children().prop('checked', flag);

    },
    // 删除已选中的元素
    deleteAllCheckedItems: (arr, $checkAll, $delegate) => {
        if (arr.length > 0) {
            arr.remove();
            arr = "";
        }
        if ($checkAll.children().prop('checked')) {
            $checkAll.children().prop('checked', false);
        }
        handleData.serial($delegate);
    },
    // 全选
    checkAllItems: ($obj, $delegate) => {
        let $radios = $delegate.find('.radio label input');
        let $labels = $delegate.find('.radio label');
        if ($obj.children().prop('checked')) {
            $radios.each((key, value) => {
                $(value).prop("checked", true);
            });
            $labels.addClass('active');
        } else {
            $radios.each((key, value) => {
                $(value).prop("checked", false);
            });
            $labels.removeClass('active');
        }
    },
    // 确认删除一个元素
    handleComfirm: ($obj,$delegate) => {
        $comfirmBtn.one('click',  () => {
           $comfirmFrame.hide();
           handleData.deleteOneItem($obj, $delegate);
        });
   },
   // 确认多个删除
   handleComfirmAll: (arr, $checkAll, $delegate) => {
        $comfirmBtn.one('click',  () => {
            $comfirmFrame.hide();
            handleData.deleteAllCheckedItems(arr, $checkAll, $delegate);
        });
    },
    // 侧边栏管理(切换页面)
    sideControl: ($obj, $page) => {
        handleData.resetColor($obj)
        $page.siblings('.manage').fadeOut();
        $page.fadeIn();
        $breadcrumb.eq(1).removeClass('active').show().html('<a href="javascript:;">' + $obj.parents('.side').find('.active').find('.text').text() + '</a>');
        $breadcrumb.eq(2).addClass('active').show().html($obj.find('.text').text());
    },
    // 侧边栏主管理(不切换界面)
    mianControl: ($obj) => {
        $obj.toggleClass('active');
        $obj.find('.toggle').toggleClass('glyphicon-minus');
        $obj.find('.badge').hide();
        $obj.siblings().removeClass('active');
        $obj.siblings().find('.toggle').removeClass('glyphicon-minus');
    },
    // 生成轮播图管理界面的初始化数据
    initBannerManagePage: (url, $tbody) => {
        $.ajax({
            type: 'get',
            url,
            dataType: "json",
            success: function (result) {
                $(result.object).each((key, item) => {
                    let $item = '<tr class="showing">' +
                        '<td class="serial-num">' + (key + 1) + '</td>' +
                        '<td class="showing-commuity-name">' + item.comunity + '</td>' +
                        '<td class="showing-username">' + item.manage + '</td>' +
                        '<td class="showing-student-num">' + item.studentNum + '</td>' +
                        '<td class="showing-userphone">' + item.phoneNum + '</td>' +
                        '<td class="showing-id">' + item['comunity-id'] + '</td>' +
                        '<td><a href="javascript:;" class="thumbnail">' +
                        '<img class="img-scale displaying" style="width: 8vw;" src="' + item.src + '" alt="...">' +
                        '</a></td>' +
                        '<td>' +
                        '<button type="button" class="btn btn-info preview">预览</button>' +
                        '<button type="button" class="btn btn-primary replace">替换</button>' +
                        '<button type="button" class="btn btn-danger delete-showing">删除</button>' +
                        '</td>' +
                        '</tr>';
                    $tbody.append($item);
                });
            },
            error: function (errorMsg) {
                alert("请求数据失败!");
            }
        });
    },
    // 轮播图容器函数：参数一：触发事件的对象；参数二：最外层包裹容器；参数三：内部图片容器；参数四：点击的正在展示的那一张轮播图元素
    showTempBannerWindow: ($obj, $wrapContainer, $rightContainer, $currentItem) => {
        $wrapContainer.fadeIn();
        $currentItem = $obj.parents('tr');
        $.ajax({
            type: 'get',
            url: './checking-banners.json',
            dataType: "json",
            success: function (result) {
                $(result.object).each((key, item) => {
                    let $item = '<div class="col-sm-6 col-md-4 temp">' +
                        '<div class="thumbnail">' +
                        '<img src="' + item.src + '" alt="...">' +
                        '<div class="caption">' +
                        '<h3 class="commuity-name">' + item.comunity + '</h3>' +
                        '<p class="username">' + item.manage + '</p>' +
                        '<p class="student-num hide">' + item.studentNum + '</p>' +
                        '<p class="phone-num hide">' + item.phoneNum + '</p>' +
                        '<p class="comunity-id hide">' + item["comunity-id"] + '</p>' +
                        '<p><a href="javascript:;" class="btn btn-primary comfirm-replace" role="button">替换</a>' +
                        '<a href="javascript:;" class="btn btn-success comfirm-add" role="button">添加</a></p>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                    $rightContainer.append($item);
                });
                if ($obj.hasClass('replace')) {
                    $('.comfirm-add').hide();
                    $('.comfirm-replace').show();
                } else {
                    $('.comfirm-add').show();
                    $('.comfirm-replace').hide();
                }
            },
            error: function (errorMsg) {
                alert("请求数据失败!");
            }
        });
        return $currentItem;
    },
    // 轮播图控制函数
    bannerControl: ($tempItem, $current, tempBannerData, showingBannerData, bool, $tbody) => {
        // 获取容器中被点击的元素的信息
        let commuityName = $tempItem.find('.commuity-name'),
            username = $tempItem.find('.username'),
            studentNum = $tempItem.find('.student-num'),
            phoneNum = $tempItem.find('.phone-num'),
            comunityId = $tempItem.find('.comunity-id'),
            url = $tempItem.find('img');
        tempBannerData = {
            commuityName: commuityName.text(),
            username: username.text(),
            studentNum: studentNum.text(),
            phoneNum: phoneNum.text(),
            comunityId: comunityId.text(),
            url: url.attr('src')
        };
        // 获取展示中的轮播图的信息
        const showingSerialNum = $bannerManagePage.find('tr').length;
        // 代表添加
        if (bool) {
            // 动态添加数据
            let $item = '<tr class="showing">' +
                '<td class="serial-num">' + (showingSerialNum) + '</td>' +
                '<td class="showing-commuity-name">' + tempBannerData.commuityName + '</td>' +
                '<td class="showing-username">' + tempBannerData.username + '</td>' +
                '<td class="showing-student-num">' + tempBannerData.studentNum + '</td>' +
                '<td class="showing-userphone">' + tempBannerData.phoneNum + '</td>' +
                '<td class="showing-id">' + tempBannerData.comunityId + '</td>' +
                '<td><a href="javascript:;" class="thumbnail">' +
                '<img class="img-scale displaying" style="width: 8vw;" src="' + tempBannerData.url + '" alt="...">' +
                '</a></td>' +
                '<td>' +
                '<button type="button" class="btn btn-info preview">预览</button>' +
                '<button type="button" class="btn btn-primary replace">替换</button>' +
                '<button type="button" class="btn btn-danger delete-showing">删除</button>' +
                '</td>' +
                '</tr>';
                $tbody.append($item);
                $tempItem.remove();
        } else {
            //代表替换
            let showingCommuityName = $current.find('.showing-commuity-name'),
                showingUsername = $current.find('.showing-username'),
                showingStudentNum = $current.find('.showing-student-num'),
                showingUserphone = $current.find('.showing-userphone'),
                showingId = $current.find('.showing-id'),
                showingUrl = $current.find('img');
            showingBannerData = {
                showingCommuityName: showingCommuityName.text(),
                showingUsername: showingUsername.text(),
                showingStudentNum: showingStudentNum.text(),
                showingUserphone: showingUserphone.text(),
                showingId: showingId.text(),
                showingUrl: showingUrl.attr('src')
            };
            commuityName.text(showingBannerData.showingCommuityName);
            username.text(showingBannerData.showingUsername);
            studentNum.text(showingBannerData.showingStudentNum);
            phoneNum.text(showingBannerData.showingUserphone);
            comunityId.text(showingBannerData.showingId);
            url.attr('src', showingBannerData.showingUrl);
            showingCommuityName.text(tempBannerData.commuityName);
            showingUsername.text(tempBannerData.username);
            showingStudentNum.text(tempBannerData.studentNum);
            showingUserphone.text(tempBannerData.phoneNum);
            showingId.text(tempBannerData.comunityId);
            showingUrl.text('src', tempBannerData.url);
        }
    },
    // 确认轮播图控制函数
    comfirmBannerControl: ($obj,$current,tempBannerData,showingBannerData,bool, $tbody) => {
        $comfirmBtn.one('click',  () => {
           $comfirmFrame.hide();
           handleData.bannerControl($obj, $current, tempBannerData, showingBannerData, bool, $tbody);
           $tempImgContainer.fadeOut();
           $container.html("");
        });
   },
    // 初始化用户审核界面数据
    initUserApply: (url, $tbody) => {
        $.ajax({
            type: 'get',
            url,
            dataType: "json",
            success: function (result) {
                $(result.object).each((key, item) => {
                    let $item = '<tr>' +
                        '<td>' +
                        '<div class="checkbox radio">' +
                        '<label>' +
                        '<input type="checkbox">' +
                        '</label>' +
                        '</div>' +
                        '</td>' +
                        '<td class="serial-num">' + (key + 1) + '</td>' +
                        '<td class="comunity-name">' + item.comunity + '</td>' +
                        '<td class="username">' + item.manage + '</td>' +
                        '<td class="userphone">' + item.phoneNum + '</td>' +
                        '<td class="student-num">' + item.studentNum + '</td>' +
                        '<td class="student-id">' + item["comunity-id"] + '</td>' +
                        '<td><button type="button" class="btn btn-success ">通过</button>&nbsp;&nbsp;&nbsp;<button type="button"' +
                        'class="btn btn-danger ">删除</button></td>' +
                        '</tr>';
                    $tbody.append($item);
                    $navApply.find('.badge').html('');
                })
            },
            error: function (errorMsg) {
                alert('请求数据失败，请检查网络情况');
            }
        });
    },
    
    // 初始化轮播图审核界面数据
    initBannerApply: (url, $tbody) => {
        $.ajax({
            type: 'get',
            url,
            dataType: "json",
            data: {
                page: 1,
                status: 3
            },
            headers: {Authorization},
            success: function (result) {
                console.log(result)

                $(result.object).each((key, item) => {
                    let $item = '<tr class="auditing">' +
                        '<td>' +
                        '<div class="checkbox radio">' +
                        '<label>' +
                        '<input type="checkbox">' +
                        '</label>' +
                        '</div>' +
                        '</td>' +
                        '<td class="serial-num">' + (key + 1) + '</td>' +
                        '<td class="auditing-commuity-name">' + item.communityName + '</td>' +
                        '<td class="auditing-username">' + item.communityAdminName + '</td>' +
                        '<td class="auditing-student-num">' + item.studentNum + '</td>' +
                        '<td class="auditing-userphone">' + item.phoneNum + '</td>' +
                        '<td class="auditing-id">' + item.communityId + '</td>' +
                        '<td><a href="javascript:;" class="thumbnail">' +
                        '<img class="img-scale auditing" style="width: 8vw;" src="' + item.fileName + '" alt="...">' +
                        '</a></td>' +
                        '<td>' +
                        '<button type="button" class="btn btn-info preview">预览</button>' +
                        '<button type="button" class="btn btn-primary success">通过</button>' +
                        '<button type="button" class="btn btn-danger delete">删除</button>' +
                        '</td>' +
                        '</tr>';
                    $tbody.append($item);
                    $navApply.find('.badge').html('');

                });
            },
            error: function (errorMsg) {
                alert("请求数据失败!");
            }
        });
    },
    // 自定义添加按钮
    customBtn: (e, $obj) => {
        let $ball = $('<span class="box"></span>');
        let left = e.pageX - $obj.get(0).offsetLeft;
        let top = e.pageY - $obj.get(0).offsetTop;
        $ball.css({
            'left': 57 + 'px',
            'top': top + 'px'
        });
        $obj.append($ball);
        $ball.on('animationend', function () {
            //每次在执行完动画把“水波”从文档中移出；
            $ball.remove();
        });
    },
    // 控制侧边栏社团管理下拉
    controlSlide: ($nav, $obj) => {
        $nav.slideToggle().siblings('.row').slideUp();
        if (!$breadcrumb.eq(2).hasClass('active')) {
            $breadcrumb.eq(1).addClass('active').show().html($obj.find('.text').text());
        }
    }
};
export default handleData;