$(document).ready(function () {
    //获取到轮播图数据 √
    $.ajax({
        type: 'get',
        url: 'http://localhost:3004/Carousel',
        success: function (data) {
            //data对象组
            var newItems = ''; //不初始化会导致第一个值为undefined
            console.log(data);
            for (var i = 0; i < data.length; i++) {
                //添加控件
                let $li = document.createElement("li");
                //给控件添加属性
                $($li).attr("data-target", "#myCarousel"); //$()才能使用
                $($li).attr("data-slide-to", i);
                //第一个为添加类active
                if (i == 0) {
                    $($li).addClass("active");
                    newItems += '<div class="item active"><img src="' +
                        data[i].src +
                        '" name = "' +
                        data[i].id +
                        '"' +
                        'class = "center-block"></div>';
                } else { //添加图片
                    newItems += '<div class="item"><img src="' +
                        data[i].src +
                        '" name = "' +
                        data[i].id +
                        '"' +
                        'class = "center-block"></div>';
                }
                $(".carousel-indicators").append($li);
            }
            $(".carousel-inner").html(newItems);
            //获取到点击图片的id
            $(".carousel-inner .item img").on("click", function () {
                var $imgName = $(this).attr("name");
                console.log($imgName);
                //修改地址栏到对应id的地址
                $.ajax({
                    type: 'get',
                    url: '',
                    success: function (data) {
                        //修改地址
                        window.location.replace(data);
                    }
                })
            }) //事件委托,放在函数外面获取不到
        }
    });
    //获取到[全部]的总数/4+0.5得总页数
    $.ajax({
        type: 'get',
        url: '', //Classify?id=0
        success: function (data) {
            //动态生成页码
            var page = '<li><a href="#">&laquo;</a></li>';
            var $pageCount = Number(data) / 4 + 0.5;
            for (var i = 1; i <= $pageCount; i++) {
                page += '<li><a href="#">' +
                    i +
                    '</a></li>'
            }
            page += '<li><a href="#">&raquo;</a></li>';
            (".pagination").html(page);
        }
    });
    //先获取到[全部]标签的第一页数据
    $.ajax({
        type: 'get',
        url: '', //Classify?id=0&page=0;
        success: function (data) {
            //动态生成
            let $cards = '';
            for (var i = 0; i < data.length; i++) {
                $cards += '<img src = "' +
                    data[i].src +
                    '">'
            }
            ("#paging").html(cards);
        }
    });
    //标签切换改变class并且传值、再获取分页数据. √
    $(".nav-pills li").on("click", function () {
        $(".nav-pills .active").removeClass("active");
        $(this).addClass("active");
        //还需要传给后台被点击标签的id
        //获取到该类的页数，创建分页
    });
    //分页
    $(".pagination li").on("click", function (e) {
        e.preventDefault(); //清除默认行为 √
        //获取到该类该页的数据
    })
    //搜索框
    //传数据并获得的函数
    function getResult(val) {
        $.ajax({
            type: 'POST',
            data: JSON.stringify(val),
            contentType: 'application/json',
            dataType: 'json',
            url: '',
            success: function (data) {
                //返回数据
                $.ajax({
                    type: 'get',
                    url: '',
                    success: function (data) {
                        //动态添加li
                        for (var i = 0; i < data.length; i++) {
                            let $li = document.createElement("li");
                            $($li).text(data[i].key) //获取数据的内容
                            $(".search-result ul").append($li); //添加到ul中
                        }

                    }
                })
            }
        })
    }
    //监听鼠标或键盘触发激发的事件

    $(".search input").on("change", function () {
        //获取到value √√√
        var $value = $(".search input").val();
        //调用函数
        $.ajax({
            type: 'POST',
            data: JSON.stringify($value),
            contentType: 'application/json',
            dataType: 'json',
            url: '',
            success: function (data) {
                //返回数据
                $.ajax({
                    type: 'get',
                    url: '',
                    success: function (data) {
                        //动态添加li
                        for (var i = 0; i < data.length; i++) {
                            let $li = document.createElement("li");
                            $($li).text(data[i].key) //获取数据的内容
                            $(".search-result ul").append($li); //添加到ul中
                        }

                    }
                })
            }
        })
        //搜索结果列表display √
        $(".search-result").css("display", "block");
    })
    //失去焦点时隐藏搜索结果
    $(".search input").on("blur", function () {
        $(".search-result").css("display", "none");
    })
    //点击搜索按钮 会有模态框出现,展示结果
    $(".search .btn").on("click", function (e) {
        //清除默认
        e.preventDefault();
        var $value = $(".search input").val();
        $.ajax({
            type: 'POST',
            data: JSON.stringify(val),
            contentType: 'application/json',
            dataType: 'json',
            url: '',
            success: function (data) {
                //返回数据
                $.ajax({
                    type: 'get',
                    url: '',
                    success: function (data) {
                        //弹框
                        for (var i = 0; i < data.length; i++) {
                            let $li = document.createElement("li");
                            $($li).text(data[i].key) //获取数据的内容
                            $(".modal-body ul").append($li); //添加到ul中
                        }
                    }
                })
            }
        })
    });
    //点击查询状态的按钮，会出现查询入口
    (() => {
        let $inquireEntry = $("#inquireEntry");
        let $outerBox = $("#outerBox");
        $inquireEntry.on("click", () => {
        $outerBox.show();
        })
    })();
   //点击注册社团的按钮，会出现注册入口
   (()=>{
   let $registerEntry = $("#registerEntry");
   let $outerBox1 = $("#outerBox1");
   $registerEntry.on("click",()=>{
       $outerBox1.show();
   })
   })();
   //点击登陆的按钮，会出现登录入口
   (()=>{
   let $loginEntry = $("#loginEntry");
   let $outerBox2 = $("#outerBox2");
   $loginEntry.on("click",()=>{
       $outerBox2.show();
   })
   })();
});