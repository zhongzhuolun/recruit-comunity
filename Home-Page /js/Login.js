var Load = $('#outerBox2');
//登陆框的移动
function mythird() {
    var disX = 0; //横向距离
    var disY = 0; //纵向距离
    console.log(Load);

    document.onmousedown = function (ev) {
        var oEvent = ev || event; //事件对象
        disX = oEvent.clientX - Load.get(0).offsetLeft; //鼠标位置减去 LoadBox的位置
        disY = oEvent.clientY - Load.get(0).offsetTop;
        // console.log(1);
        document.onmousemove = function (ev) {
            // console.log(1)
            var oEvent = ev || event; //事件对象
            var l = oEvent.clientX - disX;
            var t = oEvent.clientY - disY;
            if (l < 0) {
                l = 0;
            } else if (l > document.documentElement.clientWidth - Load.get(0).offsetWidth) {
                l = document.documentElement.clientWidth - Load.get(0).offsetWidth;
            }
            if (t < 0) {
                t = 0;
            } else if (t > document.documentElement.clientHeight - Load.get(0).offsetHeight) {
                t = document.documentElement.clientHeight - Load.get(0).offsetHeight;
            }
            Load.get(0).style.left = l + 'px';
            Load.get(0).style.top = t + 'px';

        };
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null; // LoadBox太小了，加在document上面大一点
        };
        // return false; //阻止默认事件

    }


}
mythird();
/* 提取公共的文本类表单项验证 */
function commonInfo(reg, id) {
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

function commonInfo1(reg1, reg2, id) {
    var inputText = document.getElementById(id);
    var inputValue = inputText.value;
    var inputSpan = document.getElementById(id + "Span");

    if (inputValue == null || inputValue.length == 0) {
        inputSpan.innerHTML = "不能为空！";
        inputSpan.style.color = "red";
        inputSpan.style.background = "none";
        return false;
    } else {
        var value = reg1.test(inputValue) || reg2.test(inputValue);
        if (!value) {
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

/*验证手机号或者学号 */
function checkNumber() {
    var reg1 = /^[1][0-9]{10}$/ig; /* 验证手机号 */
    var reg2 = /^\d{10}$/ig; //验证学号必须为10位数字
    var id = 'Number';
    return commonInfo1(reg1, reg2, id);
}
let $Number = $("#Number");
$Number.on("blur", () => {
    checkNumber();
});
/*验证密码*/
function checkPwd() {
    var reg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,20}$/ig; /*密码至少包含一个数字、字母、特殊字符且长度为8-20位*/
    var id = 'passWord2';
    return commonInfo(reg, id);
}
let $passWord2 = $("#passWord2");
let $indicate2 = $("#indicate2");
let $bgImg = $("#bgImg");
$passWord2.on("focus", () => {
    $indicate2.show();
    $bgImg.attr("src", "images/wabi.jpg");
});
$passWord2.on("blur", () => {
    checkPwd();
    $indicate2.hide();
    $bgImg.attr("src", "images/wakai.jpg");
});
/*点击关闭按钮会关闭页面 */
(() => {
    let $close2 = $("#close2");
    let $outerBox2 = $("#outerBox2");
    $close2.on("click", () => {
        $outerBox2.hide();
    })
})();
//眼睛睁开和闭上
var eye2 = document.getElementById("eye2");
var pwd2 = document.getElementById("passWord2");

function showhide() {

    if (pwd2.type == "password") {
        pwd2.type = "text";
        eye2.className = 'fa fa-eye-slash'
    } else {
        pwd2.type = "password";
        eye2.className = 'fa fa-eye'
    }
}
/*点登录按钮会先检查是否都已填写*/
(() => {
    let $btn2 = $("#btn2");
    let $form = $(".Logincontainer1 .form");
    $btn2.on("click", () => {

        let $formSpan = $(".Logincontainer1 .formSpan");

        $form.each((i) => {
            if ($form.eq(i).val() == "") {
                $formSpan.eq(i).text('不能为空！');
                $formSpan.eq(i).css({
                    "color": "red",
                    "background": "none"
                });

                i++;
            }
        })
        //把数据传给后台
        let $Numberval = $Number.val();
        let $passWord2val = $passWord2.val();
        let usersData = {
            account: $Numberval,
            password: $passWord2val
        };
        // let $btn = $("#btn");

        $.ajax({

            type: 'POST',

            contentType: 'application/json',

            dataType: 'json',

            url: 'http://10.21.23.158:8888/login/adminLogin',

            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization: 'Barber Token'");
            }, //这里设置header
            headers: {
                'Content-Type': 'application/json;charset=utf8',
                'Authorization': 'Barber Token'
            },
            data: JSON.stringify(usersData),
            success: function (data) {
                var datas = data;
                switch (datas.code) {
                    case 0:
                        // setTimeout(() => {
                            localStorage.setItem("Authorization",datas.object.token);
                            localStorage.setItem("superAdminId",datas.object.adminId);
                            window.location.href = "http://127.0.0.1:5500/recruit-community/Super-Admin/dist/index.html"; //3秒后跳转页面，需要有管理员id来跳转页面
                        // }, 3000);
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