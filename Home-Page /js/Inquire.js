var Load1 = $('#outerBox');
//登陆框的移动
function inquireMythird() {
    var disX = 0; //横向距离
    var disY = 0; //纵向距离
    console.log(Load1);

    document.onmousedown = function (ev) {
        var oEvent = ev || event; //事件对象
        disX = oEvent.clientX - Load1.get(0).offsetLeft; //鼠标位置减去 LoadBox的位置
        disY = oEvent.clientY - Load1.get(0).offsetTop;
        console.log(1);
        document.onmousemove = function (ev) {
            console.log(1)
            var oEvent = ev || event; //事件对象
            var l = oEvent.clientX - disX;
            var t = oEvent.clientY - disY;
            if (l < 0) {
                l = 0;
            } else if (l > document.documentElement.clientWidth - Load1.get(0).offsetWidth) {
                l = document.documentElement.clientWidth - Load1.get(0).offsetWidth;
            }
            if (t < 0) {
                t = 0;
            } else if (t > document.documentElement.clientHeight - Load1.get(0).offsetHeight) {
                t = document.documentElement.clientHeight - Load1.get(0).offsetHeight;
            }
            Load1.get(0).style.left = l + 'px';
            Load1.get(0).style.top = t + 'px';

        };
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null; // LoadBox太小了，加在document上面大一点
        };
        // return false; //阻止默认事件

    }


}
inquireMythird();
/* 提取公共的文本类表单项验证 */
function inquireCommonInfo(reg, id) {
    var inputText = document.getElementById(id);
    var inputValue = inputText.value;
    var inputSpan = document.getElementById(id + "Span");

    if (inputValue == null || inputValue.length == 0) {
        inputSpan.innerHTML = "不能为空！";
        inputSpan.style.color = "red";
        inputSpan.style.background = "none";
        return false;
    } else {
        if (!reg.test(inputValue)) {
            inputSpan.innerHTML = "格式有误！";
            inputSpan.style.color = "red";
            inputSpan.style.background = "none";
            return false;
        } else {
            inputSpan.innerHTML = "√";
            inputSpan.style.color = "white";
            inputSpan.style.background = "rgb(50,200,100)";
            inputSpan.style.padding = "2px 4px";
            inputSpan.style.borderRadius = "15px";
            return true;
        }
    }

}

/*验证手机号 */
function checkNumber1() {
    var reg = /^[1][0-9]{10}$/ig; /* 验证手机号 */
    var id = 'phone';
    return inquireCommonInfo(reg, id);
}
let $phone = $("#phone");
let $checkBtn = $("#checkBtn");
$phone.on("blur", () => {
    checkNumber1();
    $checkBtn.css({
        "color": "#fff"
    }); //增加边框样式
    $checkBtn.removeClass("btn-add");
});
$phone.on("focus", () => {
    $checkBtn.css({
        "color": "green"
    }); //增加边框样式
    console.log(1);

})
//点击获取验证码，会出现一个60秒的定时器
$checkBtn.on("click", () => {
    var countdown = 60;

    function settime(val) {
        if (countdown == 0) {
            val.removeAttr("disabled");
            val.text("免费获取验证码");
            countdown = 60;
        } else {
            val.attr({
                disabled: "true"
            });
            val.text("重新发送(" + countdown + ")");
            countdown--;
            setTimeout(function () {
                settime(val)
            }, 1000)
        }

    }
    settime($checkBtn);
});
/*验证学号和验证码 */
function checkstudentNumber1(ID) {
    var reg = /^\d*$/ig; /* 验证学号 */
    var id = ID;
    return inquireCommonInfo(reg, id);
}
let $studentNumber = $("#studentNumber");
$studentNumber.on("blur", () => {
    checkstudentNumber1('studentNumber');
});
let $checkCode = $("#checkCode");
$checkCode.on("blur", () => {
    checkstudentNumber1("checkCode");
});

/*点查询按钮会先检查是否都已填写*/
(() => {
    let $innerContainer = $(".innerContainer");
    let $inquire = $('.inquire');
    let $recruit = $("#recruit");
    let $btn = $("#btn");
    let $form = $(".container1 .form");
    $btn.on("click", () => {
        
        let $formSpan = $(".container1 .formSpan");

        $form.each((i) => {
            if ($form.eq(i).val() == "") {
                $formSpan.eq(i).text('不能为空！');
                $formSpan.eq(i).css({
                    "color": "red",
                    "background": "none"
                });

                i++;
            } else {
                $innerContainer.eq(0).hide();
                console.log($innerContainer.eq(0));

                //根据后台请求接口判断要哪句话显示出来  
                console.log($inquire.eq(0));

                // $inquire.eq(1).show();
            }
        })
        //发出Ajax请求
        let $studentNumberval = $("#studentNumber").val();
        let $phoneval = $("#phone").val();
        // let usersData = [{
        //     studentNumber: $studentNumberval
        // }, {
        //     phone: $phoneval
        // }];
        let usersData = {
            studentNumber: $studentNumberval,
            phone: $phoneval
        };
        console.log(usersData)

        $.ajax({
            type: 'POST',

            data: JSON.stringify(usersData),

            contentType: 'application/json',

            dataType: 'json',

            url: 'http://10.21.23.158:8888/home/studentEntry',

            success: function (data) {

                var datas = data;
                console.log("成功了");


                switch (datas.code) {
                    case 0:
                        alert(datas.msg);
                        console.log(datas.object[0].status);
                        
                        if(datas.object[0].status == 0) {
                            $recruit.text(datas.object[0].communityName+datas.object[0].departmentName);
                            // $recruit.text(datas.object[0].departmentName);
                                $inquire.eq(0).show();
                        } else if (datas.object[0].status == 1) {
                            $inquire.eq(1).show();
                        } else if(datas.object[0].status == 2) {
                            alert("有为空的地方！");
                        }
                           

                        
                        setTimeout(() => {
                            // window.location.reload(); //3秒后刷新页面
                        }, 3000);
                        break;
                    case 1:
                        alert(datas.msg);
                        break;
                    default:
                        alert(datas.msg);
                        break;
                }




            },

            error: function (e) {

                alert("操作失败请重试");

            }

        });


    })
})();
/*点击关闭按钮会关闭页面 */
(() => {
    let $close = $("#close");
    let $outerBox = $("#outerBox");
    $close.on("click", () => {
        $outerBox.hide();
    })
})();
// let $btn = $("#btn");