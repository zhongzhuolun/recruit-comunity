import $ from 'jquery';
import handleData from './handeData';
import '../../bootstrap-3.3.7-dist/css/bootstrap.min.css';
import '../css/index.css';
import exitComunityData from '../../lib/data';
 
document.onreadystatechange=function(){
    if(document.readyState=="complete"){
        $(".loading").fadeOut();
    }
};

$(function () {
    // 定义全局变量
    const $breadcrumb = $('.breadcrumb li') // 路径导航条
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
    const $skinBtn = $('.skin .btn'); // 获取换肤按钮
    const $pageBtns = $('.home-data'); // 获取主页的四个按钮
    let $img = $("img");
    let num = 0;
    $img.each(function(i){
        let oImg = new Image();
        oImg.οnlοad = function(){
            oImg.οnlοad = null;
            num++;
            $(".loading b").html(parseInt( num/$("img").size()*100)+"%");
            if(num >= i){
                $(".loading").fadeOut();
            }
        }
        oImg.src = $img[i].src;
    }); 
      
    // 头部
    (() => {
        // 一键换肤
        const {
            switchingSkin
        } = handleData;
        $skinBtn.on('click', switchingSkin);
    })();
    // 侧边栏
    (() => {
        const {
            sideControl,
            mianControl,
            controlSlide
        } = handleData;
        // 侧边栏用户信息管理
        $userInformation.on('click', function () {
            const $allPage = $userInformationPage.find('.all-page');
            sideControl($(this), $userInformationPage);
            $allPage.html(exitComunityData.length)
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
        $listGroup.on('click', '.list-group-item', function () {
            mianControl($(this));
        });
        
        // 侧边栏社团管理下拉按钮
        $navCommuity.on('click', function () {
            controlSlide($('.commuity-fold-nav'), $(this));
        });
        // 侧边栏审核管理下拉按钮
        $navApply.on('click', function () {
            controlSlide($('.banner-fold-nav'), $(this));
        });
        // 侧边栏内容管理下拉按钮
        $navContent.on('click', function () {
            controlSlide($('.content-fold-nav'), $(this));
        });
    })();
    // 首页
    (() => {
        // 获取处理数据对象中的函数
        const {
            sector,
            changePage
        } = handleData;
        // 分别给四个按钮绑定单击切换页面的事件
        $pageBtns.eq(0).click(function () {
            changePage($('.commuity-fold-nav'), $userInformation, $userInformationPage);
            // $userInformation.parents('.row').eq(0).prev().addClass('active');
          
        });
        $pageBtns.eq(1).click(function () {
            changePage($('.commuity-fold-nav'), $bannerManage, $bannerManagePage);
        });
        $pageBtns.eq(2).click(function () {
            changePage($('.banner-fold-nav'), $userApply, $userApplyPage);
        });
        $pageBtns.eq(3).click(function () {
            changePage($('.banner-fold-nav'), $bannerApply, $bannerApplyPage);
        });
        // 返回首页按钮
        $homeBtn.on('click', function () {
            $(this).parents('.container-fluid').find('.detail').css({
                color: "rgb(120, 117, 117)"
            });
            $myHomePage.siblings('.manage').fadeOut();
            $myHomePage.fadeIn();
            $breadcrumb.eq(1).fadeOut();
            $breadcrumb.eq(2).fadeOut();

        });
        // 扇形图
        sector('#sector');
        $("#sector").click(function () {
            sector($pageBtns);
        });
    })();
    // 用户信息管理界面
    (() => {
        // 定义一个用来存储选中状态的列表项
        let deleteArr;
        // 获取处理数据对象中的函数
        const {
            initUserInformation,
            deleteOneItem,
            changeItemState,
            deleteAllCheckedItems,
            checkAllItems,
            handleNextPage,
            handlePrePage
        } = handleData;
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
        const pageLength =  exitComunityData.length;
        let value = "";
        // 初始化数据
        const url = './exist-comunity.json';
        const $tbody = $('#user-information tbody');
        // $userInformation.one('click', initUserInformation($tbody, url));
        $userInformation.one('click', initUserInformation($tbody, url, 0));
        // 删除社团单条信息
        $userInformationPage.on('click', '.btn-danger', function () {
            deleteOneItem($(this), $userInformationPage);
        });
        // 点击选中按钮，改变单选框和全选框的状态，事件委托
        $userInformationPage.on('click', '.radio label', function () {
            changeItemState($(this), $checkAll, $userInformationPage);
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
        // 下一页按钮
        $nextPageBtn.on('click', function() {
            handleNextPage($(this),pageLength, $tbody, $currentPage, url)
        });
        // 上一页按钮
        $prePageBtn.on('click', function() {
            handlePrePage($(this),$tbody, $currentPage, url)
        });
        // 模糊搜索功能, 搜索后也需要分页
        // 禁止表单默认行为
        $form.on('submit',function(ev) {
            ev.preventDefault();
        }) 
        // 获取输入框中的值
        $input.on('keyup', function() {
            value = $(this).val();
        })
        // 点击后开始搜索
        $searchBtn.on('click',function() {
            const datas = exitComunityData;
            let itemArray = []; 
            let searchItems = [];
            $(datas).each((key, item) => {
                itemArray.push(item.object);
                $(itemArray).each((key, item) => {
                    $(item).each((key, item) => {
                        if (item.comunity.includes(value)) {
                            searchItems.push(item);
                        }
                    })
                })
            });
        })
    })();
    // 轮播图管理界面
    (() => {
        // 获取表格的容器，轮播图的容器，真正存放轮播图的容器，添加按钮
        const $tbody = $('#banner-manage .table tbody');
        const $tempImgContainer = $('.img-container');
        const $container = $tempImgContainer.find('.container');
        const $addBtn = $('.add');
        // 获取处理数据对象中的函数
        const {
            showTempBannerWindow,
            deleteOneItem,
            bannerControl,
            initBannerManagePage,
            customBtn
        } = handleData;
        // 定义一个用来保存当前点击的正在展示的那一张轮播图的列表的元素的变量
        let $current;
        // 定义存储容器中轮播图数据和展示中的轮播图数据的对象
        let tempBannerData = {};
        let showingBannerData = {};
        // 初始化数据
        let url = './showing-banner.json';
        $bannerManage.one('click', function () {
            initBannerManagePage(url, $tbody);
        })
        // 替换按钮，事件委托，点击跳出替换窗口,此时需要发送请求，得到审核完成的轮播图数据
        $bannerManagePage.on('click', '.replace', function () {
            $container.html("");
            $current = showTempBannerWindow($(this), $tempImgContainer, $container, $current);
        });
        // 确定替换按钮，事件委托，需要发送数据给后台，告诉它们我替换的是哪一张
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
            customBtn(e, $(this));
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
            initUserApply,
            deleteOneItem,
            changeItemState,
            deleteAllCheckedItems,
            checkAllItems
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
            deleteOneItem($(this), $userApplyPage);
        })
        // 3. 点击删除单个项目的按钮，发送请求修改状态，将其从后台服务器中删除，最后再把对应的项目删除
        // 点击删除单个的按钮，删除单个元素，事件委托
        $userApplyPage.on('click', '.btn-danger', function () {
            deleteOneItem($(this), $userApplyPage);
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
        // 获取处理数据对象中的函数
        const {
            initBannerApply,
            deleteOneItem,
            changeItemState,
            deleteAllCheckedItems,
            checkAllItems
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
            deleteOneItem($(this), $bannerApplyPage);
        });
        // 3. 点击删除单个项目的按钮，发送请求修改状态，将其从后台服务器中删除，最后再把对应的项目删除
        // 点击删除单个的按钮，删除单个元素，事件委托
        $bannerApplyPage.on('click', '.delete', function () {
            deleteOneItem($(this), $bannerApplyPage);
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
        });
        // 点击全选按钮，选中该页所有项
        $checkAll.click(function () {
            checkAllItems($(this), $bannerApplyPage);
        });
        // 5. 单选按钮，全选按钮，选中时，点击表格最底下的通过按钮，即可通过所有被选项，同时循环触发流程2
        $bannerApplyPage.find('.pass-all-checked').click(function () {
            deleteArr = $bannerApplyPage.find('table .active').parents('tr');
            deleteAllCheckedItems(deleteArr, $checkAll, $bannerApplyPage);
        });
        // 6. 分页按钮，点击上一页或者下一页的时候，会发送请求，每次请求一页数据，重新渲染界面
    })();
})
// 缩略图模块
$(function() {
    // 7. 缩略图逻辑
        // 页面包裹元素
        const $myPage = $('#zzl-page');
        // 获取预览模块
        const $previewImg = $('.img-zoom');
        // 点击缩略图，打开大图, 事件委托
        $myPage.on('click', '.img-scale', function (event) {
            $('.img-zoom-wrap').html('<img class="img-lg" style="width:60vw;" src="' + this.src + '">');
            $previewImg.fadeIn();
            event.stopPropagation();
        });
        // 事件委托，点击预览按钮，打开大图
        $myPage.on('click', '.preview', function (event) {
            $('.img-zoom-wrap').html('<img class="img-lg" style="width:60vw;" src="' + $(this).parents('tr').find('.img-scale').attr('src') + '">');
            $previewImg.fadeIn();
            event.stopPropagation();
        });
        // 点击除了大图的区域，隐藏大图
        $(document).on('click', function () {
            $previewImg.fadeOut();
        });
        // 事件委托，点击关闭按钮，关闭大图
        $previewImg.on('click', '.close-preview', function (event) {
            $previewImg.fadeOut();
        });
        // 阻止事件冒泡
        $previewImg.on('click', function (event) {
            event.stopPropagation();
        });
})