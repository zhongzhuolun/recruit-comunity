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
/* 验证社团名字和管理员名字还有所属院名称*/
function checkUsername(ID) {
    var reg = /^[a-zA-Z\u4e00-\u9fa5]{1}[a-zA-Z0-9_\u4e00-\u9fa5]{1,19}$/ig; /* 既支持中文，又支持英文字符，不能以数字开头。限制为2-20个字符 */
    var id = ID;
    return commonInfo(reg, id);
}
var communityName = document.getElementById("communityName");
var userName = document.getElementById("userName");
var academicInstitution = document.getElementById("academicInstitution");
communityName.addEventListener("blur", () => {
    checkUsername("communityName");
})
userName.addEventListener("blur", () => {
    checkUsername("userName");
})
academicInstitution.addEventListener("blur", () => {
    checkUsername("academicInstitution");
})
/*验证学号 */
function checkstudentNumber() {
    var reg = /^\d*$/ig; /* 验证学号 */
    var id = 'studentNumber1';
    return commonInfo(reg, id);
}
let $studentNumber1 = $("#studentNumber1");
$studentNumber1.on("blur", () => {
    checkstudentNumber();
});
/*验证手机号 */
function checkNumber() {
    var reg = /^[1][0-9]{10}$/ig; /* 验证手机号 */
    var id = 'Number1';
    return commonInfo(reg, id);
}
let $Number1 = $("#Number1");
$Number1.on("blur", () => {
    checkNumber();
});
/*验证密码*/
function checkPwd() {
    var reg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,20}$/ig; /*密码采用数字、字母、特殊字符且长度为8-20位*/
    var id = 'passWord';
    return commonInfo(reg, id);
}
let $passWord = $("#passWord");
let $indicate = $("#indicate");
$passWord.on("focus", () => {
    $indicate.show();
});
$passWord.on("blur", () => {
    checkPwd();
    $indicate.hide();
});
/*点注册按钮会先检查是否都已填写，之后会出现等待审核的图片（再加一些判断*/
(() => {
    const $innerImg = $("#innerImg");
    const $formBox = $(".formBox");
    let $btn1 = $("#btn1");
    let $form = $(".Registercontainer1 .form");
    $btn1.on("click", () => {

        let $formSpan = $(".Registercontainer1 .formSpan");

        $form.each((i) => {
            if ($form.eq(i).val() == "") {
                $formSpan.eq(i).text('不能为空！');
                $formSpan.eq(i).css({
                    "color": "red",
                    "background": "none"
                });

                i++;
            } else {
                $innerImg.css({
                        'display': "block"
                    }

                )

                $formBox.hide();
            }
        });
        //点击会发出Ajax请求
        let $adminNameval = $("#userName").val();
        let $studentNumberval = $("#studentNumber").val();
        let $phoneval = $("#phone").val();
        let $passwordval = $("#passWord").val();
        let $communityNameval = $("#communityName").val();
        let $communityLabelIdval = $("#level option:selected").selectedIndex; //社团级别
        let $academyNameval = $("#academicInstitution").val();
        let $srcval = $("img").attr("src"); //要上传整个图片的文件，不只是url
        let usersData = {
            adminName: $adminNameval
        ,
            studentNumber: $studentNumberval
        ,
            phone: $phoneval
        ,
            password: $passwordval
        ,
            communityName: $communityNameval
        ,
            communityLabelId: $communityLabelIdval
        ,
            academyName: $academyNameval
        ,
            src: $srcval
        };
        console.log(usersData)
        $.ajax({
        
            type: 'POST',
        
            data: usersData,
        
            contentType: 'application/json',
        
            dataType: 'json',
        
            url: 'http://10.21.23.158:8888/register/registerCommunity',
        
            success: function (data) {
                console.log(data)
        
                var datas = data;
                // console.log("成功了");
        
        
                switch (datas.code) {
                    case 0:
                        alert(datas.msg);
                        setTimeout(() => {
                            // window.location.reload(); //3秒后重新刷新一下页面
                        }, 3000);
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
    let $close1 = $("#close1");
    let $outerBox1 = $("#outerBox1");
    $close1.on("click", () => {
        $outerBox1.hide();
    })
})();
//眼睛睁开和闭上
var eye = document.getElementById("eye");
var pwd = document.getElementById("passWord");

function showhide1() {

    if (pwd.type == "password") {
        pwd.type = "text";
        eye.className = 'fa fa-eye-slash'
    } else {
        pwd.type = "password";
        eye.className = 'fa fa-eye'
    }
}

/*创建Web Uploader实例 */
// 初始化Web Uploader
var $list = $('.list');
var uploader = WebUploader.create({

    // 选完文件后，是否自动上传。
    auto: true,

    // swf文件路径
    swf: '../webuploader-0.1.5/Uploader.swf',

    // 文件接收服务端。
    server: 'http://webuploader.duapp.com/server/fileupload.php',

    // 选择文件的按钮。可选。
    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
    pick: '#filePicker',

    // 只允许选择图片文件。
    accept: {
        title: 'Images',
        extensions: 'gif,jpg,jpeg,bmp,png',
        mimeTypes: 'image/*'
    }
});
/*监听fileQueued事件，通过uploader.makeThumb来创建图片预览图。
PS: 这里得到的是Data URL数据，IE6、IE7不支持直接预览。可以借助FLASH或者服务端来完成预览。 */
// 当有文件添加进来的时候
uploader.on('fileQueued', function (file) {
    var $li = $(
            '<div id="' + file.id + '" class="file-item thumbnail">' +
            '<img>' +
            '</div>'
        ),
        $img = $li.find('img');


    // $list为容器jQuery实例
    $list.append($li);

    // 创建缩略图
    // 如果为非图片文件，可以不用调用此方法。
    // thumbnailWidth x thumbnailHeight 为 100 x 100
    var thumbnailWidth = 50,
        thumbnailHeight = 50;
    uploader.makeThumb(file, function (error, src) {
        if (error) {
            $img.replaceWith('<span>不能预览</span>');
            return;
        }

        $img.attr('src', src);
    }, thumbnailWidth, thumbnailHeight);
});
/*当文件上传过程中, 上传成功，上传失败，上传完成都分别对应uploadProgress, uploadSuccess, uploadError, uploadComplete事件。 */
// 文件上传过程中创建进度条实时显示。
uploader.on('uploadProgress', function (file, percentage) {
    var $li = $('#' + file.id),
        $percent = $li.find('.progress span');

    // 避免重复创建
    if (!$percent.length) {
        $percent = $('<p class="progress"><span></span></p>')
            .appendTo($li)
            .find('span');
    }

    $percent.css('width', percentage * 100 + '%');
});

// 文件上传成功，给item添加成功class, 用样式标记上传成功。
uploader.on('uploadSuccess', function (file) {
    $('#' + file.id).addClass('upload-state-done');
});

// 文件上传失败，显示上传出错。
uploader.on('uploadError', function (file) {
    var $li = $('#' + file.id),
        $error = $li.find('div.error');

    // 避免重复创建
    if (!$error.length) {
        $error = $('<div class="error"></div>').appendTo($li);
    }

    $error.text('上传失败');
});

// 完成上传完了，成功或者失败，先删除进度条。
uploader.on('uploadComplete', function (file) {
    $('#' + file.id).find('.progress').remove();
});
//选择校级时，所属院名称不可编辑
let $level = $("#level");
$level.on("blur", () => {
    let $levelSelected = $("#level option:selected").text();
    let $academicInstitution = $("#academicInstitution");
    if ($levelSelected == '校级') {
        $academicInstitution.attr({
            disabled: "true"
        });
    } else {
        $academicInstitution.removeAttr("disabled");
    }
});
