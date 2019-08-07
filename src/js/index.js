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
        }
    };
    // 侧边栏
    (() => {
        const {resetColor} = handleData
        // 侧边栏用户信息管理
        $userInformation.on('click', function () {
            resetColor($(this))
            $userInformationPage.siblings('.manage').fadeOut();
            $userInformationPage.fadeIn();
        })
        // 侧边栏轮播图信息管理
        $bannerManage.on('click', function () {
            resetColor($(this));
            $bannerManagePage.siblings('.manage').fadeOut();
            $bannerManagePage.fadeIn();
        })
        // 侧边栏轮播图审核管理
        $bannerApply.on('click', function () {
            resetColor($(this))
            $bannerApplyPage.siblings('.manage').fadeOut();
            $bannerApplyPage.fadeIn();
        })
        // 侧边用户审核管理
        $userApply.on('click', function () {
            resetColor($(this))
            $userApplyPage.siblings('.manage').fadeOut();
            $userApplyPage.fadeIn();
        })
        // 侧边栏主管理按钮
        $listGroup.on('click', '.list-group-item', function () {
            $(this).toggleClass('active');
            $(this).find('.toggle').toggleClass('glyphicon-minus');
            $(this).find('.badge').hide();
            $(this).siblings().removeClass('active');
            $(this).siblings().find('.toggle').removeClass('glyphicon-minus');
        })
        // 侧边栏社团管理下拉按钮
        $navCommuity.on('click', function () {
            $('.commuity-fold-nav').slideToggle();
            $('.banner-fold-nav').slideUp();
        })
        // 侧边栏审核管理下拉按钮
        $navApply.on('click', function () {
            $('.banner-fold-nav').slideToggle();
            $('.commuity-fold-nav').slideUp();
        })
        // 侧边栏内容管理下拉按钮
        $navContent.on('click', function () {
            $('.commuity-fold-nav').slideUp();
            $('.banner-fold-nav').slideUp();
        })
    })();
    // 首页
    (() => {

        const {echartStr, sector} = handleData;
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
        const {serial, initUserInformation} = handleData;
        // 获取全选按钮
        const $checkAll = $userInformationPage.find('.check-all label');
        // 获取表单元素，获取输入框，获取搜索按钮，获取上下页分页按钮，上下页数
        const $form = $userInformationPage.find('form');
        const $input = $userInformationPage.find('#search-input');
        const $searchBtn = $userInformationPage.find('.form-group .btn-info');
        const 
        // const 
        // 初始化数据
        const url = './exist-comunity.json';
        const $tbody = $('#user-information tbody');
        $userInformation.one('click', initUserInformation($tbody, url))
        // 点击删除单个按钮
        $userInformationPage.on('click', '.btn-danger', function () {
            $(this).parents('tr').remove();
            serial($userInformationPage);
        });
        // 点击选中按钮，改变单选框的其状态，事件委托
        $userInformationPage.on('click', '.radio label', function () {
            if ($(this).children().prop('checked')) {
                $(this).addClass('active');
            } else {
                $(this).removeClass('active');
            }
        });
        // 点击删除单个的按钮，删除单个元素，事件委托
        $userInformationPage.find('.delete-all-checked').click(function () {
            deleteArr = $userInformationPage.find('table .active').parents('tr')
            if (deleteArr.length > 0) {
                deleteArr.remove();
                deleteArr = "";
            }
            if ($checkAll.children().prop('checked')) {
                $checkAll.children().prop('checked', false);
            }
            serial($userInformationPage);

        })
        // 点击全选按钮，选中该页所有项
        $checkAll.click(function () {
            let $radios = $userInformationPage.find('.radio label input');
            let $labels = $userInformationPage.find('.radio label');
            if ($(this).children().prop('checked')) {
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
        })
        // 分页功能

        // 搜索功能
    })();
    // 轮播图管理界面
    (() => {
        let $current;
        const $tbody = $('#banner-manage .table tbody');
        // 获取处理数据对象中的函数
        const {
            serial
        } = handleData;
        // 替换按钮，事件委托，点击跳出替换窗口,此时需要发送请求，得到审核完成的轮播图数据
        $bannerManagePage.on('click', '.replace', function () {
            $('.img-container').fadeIn();
            $('.comfirm-add').hide();
            $('.comfirm-replace').show();
            $current = $(this).parents('tr');

        })
        // 确定替换按钮，事件委托，需要发送数据给后台，告诉它们我替换的是哪一张
        $bannerManagePage.on('click', '.comfirm-replace', function () {
            const $tempItem = $(this).parents('.temp');
            const url = $(this).parents('.thumbnail').find('img').attr('src');
            const username = $(this).parents('.caption').find('.username').text();
            const commuityName = $(this).parents('.caption').find('.commuity-name').text();
            const showingUrl = $current.find('.displaying').attr('src');
            const showingUsername = $current.find('.showing-username').html();
            const showingCommuityName = $current.find('.showing-commuity-name').html();
            $current.find('.displaying').attr('src', url);
            $current.find('.showing-username').html(username);
            $current.find('.showing-commuity-name').html(commuityName);
            $tempItem.find('img').attr('src', showingUrl);
            $tempItem.find('.username').text(showingUsername);
            $tempItem.find('.commuity-name').text(showingCommuityName);
        })

        // 关闭按钮
        $('.close-img-container').click(function () {
            $('.img-container').fadeOut();
        })
        // 删除按钮，事件委托
        $bannerManagePage.on('click', '.delete-showing', function () {
            $(this).parents('tr').remove();
            serial($bannerManagePage);

        })
        // 添加按钮 事件委托
        $bannerManagePage.on('click', '.add', function () {
            $('.img-container').fadeIn();
            $('.comfirm-replace').hide();
            $('.comfirm-add').show();
            $current = $(this).parents('tr');
        })
        // 确定添加按钮 事件委托
        $bannerManagePage.on('click', '.comfirm-add', function () {
            const $tempItem = $(this).parents('.temp');
            const url = $(this).parents('.thumbnail').find('img').attr('src');
            const username = $(this).parents('.caption').find('.username').text();
            const commuityName = $(this).parents('.caption').find('.commuity-name').text();
            const showingSerialNum = $bannerManagePage.find('tr').length;
            const showingUserphone = $current.find('.showing-userphone').text();
            const showingId = $current.find('.showing-id').text();
            const $item = '<tr class="showing">' +
                '<td class="serial-num">' + (showingSerialNum) + '</td>' +
                '<td class="showing-commuity-name">' + commuityName + '</td>' +
                '<td class="showing-username">' + username + '</td>' +
                '<td class="showing-userphone">' + showingUserphone + '</td>' +
                '<td class="showing-id">' + showingId + '</td>' +
                '<td><a href="javascript:;" class="thumbnail">' +
                '<img class="img-scale displaying" style="width: 8vw;" src="' + url + '" alt="...">' +
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
                // ball.remove();
            }); //每次在执行完动画把“水波”从文档中移出；
        });
    })();


    // 用户注册审核界面
    (() => {
        // 定义一个用来存储选中状态的列表项
        let deleteArr;
        // 获取全选按钮
        const $checkAll = $userApplyPage.find('.check-all label');
        const {
            serial
        } = handleData;
        // 1. 初始化数据，点击该界面时，应该发送请求，获取到状态为正在注册中的社团信息，并且将其渲染出来
        const url = './register.json';
        const $tbody = $('#user-apply tbody');
        $userApply.one('click', function () {
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
                            '<td>' + item.phoneNum + '</td>' +
                            '<td>' + item["comunity-id"] + '</td>' +
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
        })



        // 2. 点击通过按钮，将该项目的数据储存起来，然后发送请求修改状态，并且添加到后台服务器中，最后再把对应的项目删除掉


        // 3. 点击删除单个项目的按钮，发送请求修改状态，将其从后台服务器中删除，最后再把对应的项目删除
        // 点击删除单个的按钮，删除单个元素，事件委托
        $userApplyPage.on('click', '.btn-danger', function () {
            $(this).parents('tr').remove();
            serial($userApplyPage);
        });

        // 4. 单选按钮，全选按钮，选中时，点击表格最底下的删除按钮，即可删除所有被选项，同时循环触发流程3
        // 点击选中按钮，改变单选框的其状态，事件委托
        $userApplyPage.on('click', '.radio label', function () {
            console.log($(this).children())
            if ($(this).children().prop('checked')) {
                $(this).addClass('active');
            } else {
                $(this).removeClass('active');
            }
        });
        // 点击删除已选按钮，删除已选项
        $userApplyPage.find('.delete-all-checked').click(function () {
            deleteArr = $userApplyPage.find('table .active').parents('tr')
            if (deleteArr.length > 0) {
                deleteArr.remove();
                deleteArr = "";
            }
            if ($checkAll.children().prop('checked')) {
                $checkAll.children().prop('checked', false);
            }
            serial($userApplyPage);
        })
        // 点击全选按钮，选中该页所有项
        $checkAll.click(function () {
            let $radios = $userApplyPage.find('.radio label input');
            let $labels = $userApplyPage.find('.radio label');
            if ($(this).children().prop('checked')) {
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
        })

        // 5. 单选按钮，全选按钮，选中时，点击表格最底下的通过按钮，即可通过所有被选项，同时循环触发流程2


        // 6. 分页按钮，点击上一页或者下一页的时候，会发送请求，每次请求一页数据，重新渲染界面



    })();
    // 轮播图审核界面
    (() => {
        // 点击缩略图，打开大图
        $('.img-scale').click(function (event) {
            $('.img-zoom-wrap').html('<img class="img-lg" style="width:60vw;" src="' + this.src + '">')
            $('.img-zoom').fadeIn();
            event.stopPropagation();

        })
        // 事件委托，点击预览按钮，打开大图
        $('#zzl-body').on('click', '.preview', function (event) {
            $('.img-zoom-wrap').html('<img class="img-lg" style="width:60vw;" src="' + $(this).parents('tr').find('.img-scale').attr('src') + '">')
            $('.img-zoom').fadeIn();
            event.stopPropagation();

        })
        $(document).on('click', function () {
            $('.img-zoom').fadeOut()
        })
        // 事件委托，点击关闭按钮，关闭大图
        $('.img-zoom').on('click', '.close-preview', function (event) {
            $('.img-zoom').fadeOut();
            console.log(12)
        })
        // 阻止事件冒泡
        $('.img-zoom').on('click', function (event) {
            event.stopPropagation();
        })

    })();



})