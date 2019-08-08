$(function () {

    // 定义全局变量
    const $breadcrumb = $('.breadcrumb') // 路径导航条
    const $navCommuity = $('.nav-commuity'); // 侧边栏社团管理
    const $userInformation = $('.user-information') // 侧边栏用户管理
    const $bannerManage = $('.banner-manage') // 侧边栏轮播图管理
    const $navApply = $('.nav-apply'); // 侧边栏审核管理
    const $userApply = $('.user-apply') // 侧边用户审核管理
    const $bannerApply = $('.banner-apply') // 侧边栏轮播图审核管理
    const $navContent = $('.nav-content'); // 侧边栏内容管理
    const $listGroup = $('.list-group'); // 侧边栏
    const $myHomePage = $('#my-home'); // 超级管理员首页
    const $userInformationPage = $('#user-information'); // 用户信息管理界面
    const $bannerManagePage = $('#banner-manage'); // 轮播图信息管理界面
    const $userApplyPage = $('#user-apply'); // 审核社团管理员注册管理界面
    const $bannerApplyPage = $('#banner-apply'); // 轮播图审核管理界面
    const $homeBtn = $('.home-btn'); // 获取返回超级管理员首页的按钮
    // 定义一个对象，专门用于存储处理数据的函数
    const handleData = {
        // 序列化函数
        serial: ($obj) => {
            console.log(1)
            const $serialEle = $obj.find('.serial-num');
            console.log($serialEle)
            $serialEle.each((key, item) => {
                item.innerHTML = key + 1;
            })

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
                        color: "#1d3b5d"
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
                        color: "rgba(225,225,225,.7)"
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
                color: "#ccc"
            });
            $obj.css({
                color: "#25a7ab"
            });
        },
        // 生成首页图表数据
        sector: (that) => {
            let brower = [],
                names = [];
            let index = $(that).data('index');
            $.ajax({
                type: 'get',
                url: './echartOne.json',
                dataType: "json",
                success: function (result) {
                    $.each(eval('result.list' + index), function (index, item) {
                        names.push(item.name);
                        brower.push({
                            name: item.name,
                            value: item.value
                        });
                    });
                    handleData.echartStr(names, brower);
                },
                error: function (errorMsg) {
                    alert("图表请求数据失败!");
                }
            });
        },
        // 主页切换页面
        changePage: ($nav, $pageBtn, $page) => {
            $nav.slideDown().siblings('.row').slideUp();
            handleData.sideControl($pageBtn, $page);
            $pageBtn.trigger('click');
        },
        // 生成用户管理界面初始化数据
        initUserInformation: ($tbody, url) => {
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
                error: function (errorMsg) {
                    alert('请求数据失败，请检查网络情况');
                }
            });
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
                    flag =false;
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
            console.log($checkAll.children().prop('checked'))
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
        // 侧边栏管理(切换页面)
        sideControl: ($obj, $page) => {
            handleData.resetColor($obj)
            $page.siblings('.manage').fadeOut();
            $page.fadeIn();
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
                url: './temp-banners.json',
                dataType: "json",
                success: function (result) {
                        $(result.object).each((key, item) => {
                            let $item =  '<div class="col-sm-6 col-md-4 temp">'+
                            '<div class="thumbnail">'+
                              '<img src="'+ item.src +'" alt="...">'+
                              '<div class="caption">'+
                                '<h3 class="commuity-name">'+ item.comunity +'</h3>'+
                                '<p class="username">'+ item.manage +'</p>'+
                                '<p class="student-num hide">'+ item.studentNum +'</p>'+
                                '<p class="phone-num hide">'+ item.phoneNum +'</p>'+
                                '<p class="comunity-id hide">'+ item["comunity-id"] +'</p>'+
                                '<p><a href="javascript:;" class="btn btn-primary comfirm-replace" role="button">替换</a>'+
                                '<a href="javascript:;" class="btn btn-success comfirm-add" role="button">添加</a></p>'+
                              '</div>'+
                            '</div>'+
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
        bannerControl : ($tempItem, $current, tempBannerData, showingBannerData, bool, $tbody) => {
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
                if (showingSerialNum <= 8) {
                    $tbody.append($item);
                    $tempItem.remove();

                } else {
                    alert('不能再添加啦，轮播图数目最多为8！')
                }
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
                success: function (result) {
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
                                        '<td class="auditing-commuity-name">' + item.comunity + '</td>' +
                                        '<td class="auditing-username">' + item.manage + '</td>' +
                                        '<td class="auditing-student-num">' + item.studentNum + '</td>' +
                                        '<td class="auditing-userphone">' + item.phoneNum + '</td>' +
                                        '<td class="auditing-id">' + item['comunity-id'] + '</td>' +
                                        '<td><a href="javascript:;" class="thumbnail">' +
                                        '<img class="img-scale auditing" style="width: 8vw;" src="' + item.src + '" alt="...">' +
                                        '</a></td>' +
                                        '<td>' +
                                        '<button type="button" class="btn btn-info preview">预览</button>' +
                                        '<button type="button" class="btn btn-primary success">通过</button>' +
                                        '<button type="button" class="btn btn-danger delete">删除</button>' +
                                        '</td>' +
                                        '</tr>';
                                        $tbody.append($item);
                        });
                },
                error: function (errorMsg) {
                    alert("请求数据失败!");
                }
            });
        }



    };
    // 头部
    (() => {
        // 获取换肤按钮
        const $skinBtn = $('.skin .btn');
        // 一键换肤功能
        $skinBtn.on('click', function() {
            if ($skinBtn.text() == '夜间模式') {
                $skinBtn.text('白天模式');
            } else {
                $skinBtn.text('夜间模式');
            }
        })
    })();
    // 侧边栏
    (() => {
        const {sideControl,mianControl} = handleData;
        // 侧边栏用户信息管理
        $userInformation.on('click', function () {
            sideControl($(this), $userInformationPage);
        });
        // 侧边栏轮播图信息管理
        $bannerManage.on('click', function () {
            sideControl($(this), $bannerManagePage);
        });
        // 侧边栏轮播图审核管理
        $bannerApply.on('click', function () {
            sideControl($(this), $bannerApplyPage);
        });
        // 侧边用户审核管理
        $userApply.on('click', function () {
            sideControl($(this), $userApplyPage);
        });
        // 侧边栏主管理按钮
        $listGroup.on('click', '.list-group-item', function() {
            mianControl($(this));
        })
        // 侧边栏社团管理下拉按钮
        $navCommuity.on('click', function () {
            $('.commuity-fold-nav').slideToggle().siblings('.row').slideUp();
        });
        // 侧边栏审核管理下拉按钮
        $navApply.on('click', function () {
            $('.banner-fold-nav').slideToggle().siblings('.row').slideUp();
        });
        // 侧边栏内容管理下拉按钮
        $navContent.on('click', function () {
            $('.content-fold-nav').slideToggle().siblings('.row').slideUp();
        });
    })();
    // 首页
    (() => {
        // 获取处理数据对象中的函数
        const {sector, changePage} = handleData;
        // 获取四个按钮
        const $pageBtns = $('.home-data');
        // 分别给四个按钮绑定单击切换页面的事件
        $pageBtns.eq(0).click(function() {
            changePage($('.commuity-fold-nav'), $userInformation, $userInformationPage);
        });
        $pageBtns.eq(1).click(function() {
            changePage($('.commuity-fold-nav'), $bannerManage, $bannerManagePage);
        });
        $pageBtns.eq(2).click(function() {
            changePage($('.banner-fold-nav'), $userApply, $userApplyPage);
        });
        $pageBtns.eq(3).click(function() {
            changePage($('.banner-fold-nav'), $bannerApply, $bannerApplyPage);
        });
        // 返回首页按钮
        $homeBtn.on('click', function () {
            $(this).parents('.container-fluid').find('.detail').css({
                color: "#ccc"
            });
            $myHomePage.siblings('.manage').fadeOut();
            $myHomePage.fadeIn();
        })
        // 扇形图
        sector('#sector');
        $("#sector").click(function () {
            sector(this);
        })

    })();
    // 用户信息管理界面
    (() => {
        // 定义一个用来存储选中状态的列表项
        let deleteArr;
        // 获取处理数据对象中的函数
        const {initUserInformation, deleteOneItem, changeItemState,deleteAllCheckedItems,checkAllItems} = handleData;
        // 获取全选按钮
        const $checkAll = $userInformationPage.find('.check-all label');
        // 获取表单元素，获取输入框，获取搜索按钮，获取上下页分页按钮，上下页数
        const $form = $userInformationPage.find('form');
        const $input = $userInformationPage.find('#search-input');
        const $searchBtn = $userInformationPage.find('.navbar-form .btn-info');
        const $prePageBtn = $userInformationPage.find('.prepage');
        const $nextPageBtn = $userInformationPage.find('.nextpage');
        const $currentPage = $userInformationPage.find('.current-page');
        const $allPage = $userInformationPage.find('.all-page');
        // 初始化数据
        const url = './exist-comunity.json';
        const $tbody = $('#user-information tbody');
        $userInformation.one('click', initUserInformation($tbody, url));
        // 删除社团单条信息
        $userInformationPage.on('click', '.btn-danger', function () {
            deleteOneItem($(this), $userInformationPage);
        });
        // 点击选中按钮，改变单选框和全选框的状态，事件委托
        $userInformationPage.on('click', '.radio label', function () {
            changeItemState($(this),$checkAll, $userInformationPage);
        });
        // 点击删除多个的按钮，删除已选中的元素，事件委托
        $userInformationPage.find('.delete-all-checked').click(function () {
            deleteArr = $userInformationPage.find('table .active').parents('tr');
            deleteAllCheckedItems(deleteArr, $checkAll, $userInformationPage)
        });
        // 点击全选按钮，选中该页所有项
        $checkAll.click(function () {
            checkAllItems($(this), $userInformationPage);
        })
        // 分页功能

        // 搜索功能
    })();
    // 轮播图管理界面
    (() => {
       // 获取表格的容器，轮播图的容器，真正存放轮播图的容器，添加按钮
        const $tbody = $('#banner-manage .table tbody');
        const $tempImgContainer = $('.img-container');
        const $container = $tempImgContainer.find('.container');
        const $addBtn = $('.add');
        // 获取处理数据对象中的函数
        const {showTempBannerWindow, deleteOneItem, bannerControl, initBannerManagePage} = handleData;
         // 定义一个用来保存当前点击的正在展示的那一张轮播图的列表的元素的变量
        let $current;
        // 定义存储容器中轮播图数据和展示中的轮播图数据的对象
        let tempBannerData = {};
        let showingBannerData = {};
        // 初始化数据
        let url = './showing-banner.json';
        
        $bannerManage.one('click', function() {
            initBannerManagePage(url, $tbody);
        })
        // 替换按钮，事件委托，点击跳出替换窗口,此时需要发送请求，得到审核完成的轮播图数据
        $bannerManagePage.on('click', '.replace', function () {
                $container.html("");
                $current = showTempBannerWindow($(this), $tempImgContainer, $container, $current);
        });
        // 确定替换按钮，事件委托，需要发送数据给后台，告诉它们我替换的是哪一张  （bug）
        $bannerManagePage.on('click', '.comfirm-replace', function () {
            bannerControl($(this).parents('.temp'), $current, tempBannerData, showingBannerData, false);    
            $tempImgContainer.fadeOut();
            $container.html("");
        })

        // 关闭按钮
        $('.close-img-container').click(function () {
            $tempImgContainer.fadeOut();
        })
        // 删除按钮，事件委托
        $bannerManagePage.on('click', '.delete-showing', function () {
            deleteOneItem($(this), $bannerManagePage);
        })
        // 添加按钮 
        $addBtn.on('click', function () {
            $container.html("");
            $current = showTempBannerWindow($(this), $tempImgContainer, $container, $current);
        });
        // 确定添加按钮 事件委托
        $bannerManagePage.on('click', '.comfirm-add', function () {
            bannerControl($(this).parents('.temp'), $current, tempBannerData, showingBannerData, true, $tbody);    
            // 隐藏轮播图容器，同时清空里面的内容
            $tempImgContainer.fadeOut();
            $container.html("");
        })
        // 自定义添加按钮
        $('.mybtn').on('mouseenter', function (e) {
            e = e || window.event;
            let ball = $('<span class="box"></span>');
            let left = e.pageX - $('.mybtn').get(0).offsetLeft;
            let top = e.pageY - $('.mybtn').get(0).offsetTop;
            ball.css({
                'left': 57 + 'px',
                'top': top + 'px'
            });
            $('.mybtn').append(ball);
            ball.on('animationend', function () {
                //每次在执行完动画把“水波”从文档中移出；
                ball.remove();
            }); 
        });
    })();
    // 用户注册审核界面
    (() => {
        // 定义一个用来存储选中状态的列表项
        let deleteArr;
        // 获取全选按钮
        const $checkAll = $userApplyPage.find('.check-all label');
        // 获取处理数据对象中的函数
        const {
            initUserApply,deleteOneItem,changeItemState,deleteAllCheckedItems,checkAllItems
        } = handleData; 
        // 获取上下页分页按钮，上下页数
        const $prePageBtn = $userApplyPage.find('.prepage');
        const $nextPageBtn = $userApplyPage.find('.nextpage');
        const $currentPage = $userApplyPage.find('.current-page');
        const $allPage = $userApplyPage.find('.all-page');
        // 定义一个用来存储通过的用户的信息
        let userData = {}
        // 1. 初始化数据，点击该界面时，应该发送请求，获取到状态为正在注册中的社团信息，并且将其渲染出来
        const url = './register.json';
        const $tbody = $('#user-apply tbody');
        $userApply.one('click', function () {
            initUserApply(url, $tbody);
        })
        // 2. 点击通过按钮，将该项目的数据储存起来，然后发送请求修改状态，并且添加到后台服务器中，最后再把对应的项目删除掉
        // 事件委托
        $userApplyPage.on('click', '.btn-success', function () { 
            deleteOneItem($(this),$userApplyPage);
        })
        // 3. 点击删除单个项目的按钮，发送请求修改状态，将其从后台服务器中删除，最后再把对应的项目删除
        // 点击删除单个的按钮，删除单个元素，事件委托
        $userApplyPage.on('click', '.btn-danger', function () {
            deleteOneItem($(this),$userApplyPage);
        });
        // 4. 单选按钮，全选按钮，选中时，点击表格最底下的删除按钮，即可删除所有被选项，同时循环触发流程3
        // 点击选中按钮，改变单选框的其状态，事件委托
        $userApplyPage.on('click', '.radio label', function () {
            changeItemState($(this), $checkAll, $userApplyPage)
        });
        // 点击删除已选按钮，删除已选项
        $userApplyPage.find('.delete-all-checked').click(function () {
            deleteArr = $userApplyPage.find('table .active').parents('tr');
            deleteAllCheckedItems(deleteArr, $checkAll, $userApplyPage)
        })
        // 点击全选按钮，选中该页所有项
        $checkAll.click(function () {
            checkAllItems($(this), $userApplyPage);
        })
        // 5. 单选按钮，全选按钮，选中时，点击表格最底下的通过按钮，即可通过所有被选项，同时循环触发流程2
        $userApplyPage.find('.pass-all-checked').click(function () {
            deleteArr = $userApplyPage.find('table .active').parents('tr');
            deleteAllCheckedItems(deleteArr, $checkAll, $userApplyPage);
        })
        // 6. 分页按钮，点击上一页或者下一页的时候，会发送请求，每次请求一页数据，重新渲染界面



    })();
    // 轮播图审核界面
    (() => {
        // 定义一个用来存储选中状态的列表项
        let deleteArr;
        // 获取全选按钮
        const $checkAll = $bannerApplyPage.find('.check-all label');
        // 获取预览模块
        const $previewImg = $('.img-zoom');
        // 获取处理数据对象中的函数
        const {
            initBannerApply,deleteOneItem,changeItemState,deleteAllCheckedItems,checkAllItems
        } = handleData;
        // 获取上下页分页按钮，上下页数
        const $prePageBtn = $bannerApplyPage.find('.prepage');
        const $nextPageBtn = $bannerApplyPage.find('.nextpage');
        const $currentPage = $bannerApplyPage.find('.current-page');
        const $allPage = $bannerApplyPage.find('.all-page');
         // 1. 初始化数据，点击该界面时，应该发送请求，获取到状态为正在审核中的轮播图，并且将其渲染出来
         const url = './temp-banners.json';
         const $tbody = $('#banner-apply tbody');
         $bannerApply.one('click', function () {
             initBannerApply(url, $tbody);
         });
         // 2. 点击通过按钮，将该项目的数据储存起来，然后发送请求修改状态，并且添加到后台服务器中，最后再把对应的项目删除掉
         // 事件委托
         $bannerApplyPage.on('click', '.success', function () { 
             deleteOneItem($(this),$bannerApplyPage);
         });
         // 3. 点击删除单个项目的按钮，发送请求修改状态，将其从后台服务器中删除，最后再把对应的项目删除
         // 点击删除单个的按钮，删除单个元素，事件委托
         $bannerApplyPage.on('click', '.delete', function () {
             deleteOneItem($(this),$bannerApplyPage);
         });
         // 4. 单选按钮，全选按钮，选中时，点击表格最底下的删除按钮，即可删除所有被选项，同时循环触发流程3
         // 点击选中按钮，改变单选框的其状态，事件委托
         $bannerApplyPage.on('click', '.radio label', function () {
             changeItemState($(this), $checkAll, $bannerApplyPage);
         });
         // 点击删除已选按钮，删除已选项
         $bannerApplyPage.find('.delete-all-checked').click(function () {
             deleteArr = $bannerApplyPage.find('table .active').parents('tr');
             deleteAllCheckedItems(deleteArr, $checkAll, $bannerApplyPage);
         })
         // 点击全选按钮，选中该页所有项
         $checkAll.click(function () {
             checkAllItems($(this), $bannerApplyPage);
         })
         // 5. 单选按钮，全选按钮，选中时，点击表格最底下的通过按钮，即可通过所有被选项，同时循环触发流程2
         $bannerApplyPage.find('.pass-all-checked').click(function () {
             deleteArr = $bannerApplyPage.find('table .active').parents('tr');
             deleteAllCheckedItems(deleteArr, $checkAll, $bannerApplyPage);
         })
         // 6. 分页按钮，点击上一页或者下一页的时候，会发送请求，每次请求一页数据，重新渲染界面




         // 7. 缩略图逻辑
        // 点击缩略图，打开大图, 事件委托
        $bannerApplyPage.on('click', '.img-scale', function(event) {
            $('.img-zoom-wrap').html('<img class="img-lg" style="width:60vw;" src="' + this.src + '">')
            $previewImg.fadeIn();
            event.stopPropagation();
        })
        // 事件委托，点击预览按钮，打开大图
        $bannerApplyPage.on('click', '.preview', function (event) {
            $('.img-zoom-wrap').html('<img class="img-lg" style="width:60vw;" src="' + $(this).parents('tr').find('.img-scale').attr('src') + '">')
            $previewImg.fadeIn();
            event.stopPropagation();
        })
        // 点击除了大图的区域，隐藏大图
        $(document).on('click', function () {
            $previewImg.fadeOut()
        })
        // 事件委托，点击关闭按钮，关闭大图
        $previewImg.on('click', '.close-preview', function (event) {
            $previewImg.fadeOut();
        })
        // 阻止事件冒泡
        $previewImg.on('click', function (event) {
            event.stopPropagation();
        })

    })();



})