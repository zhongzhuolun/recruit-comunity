	
	$(function(){
		var $login = $("#login");// 获取登录窗口
		var $register = $("#regis");// 获取注册窗口
		var $loginBtn = $(".login-btn");// 获取登录按钮
		var $registerBtn = $(".registe-btn");// 获取注册按钮
		var $phoneInputL = $("#login-phone")// 获取登录手机号码输入框
		var $pwdInputL = $("#login-password")// 获取登录密码输入框
		var $phoneInputR = $("#regist-phone")// 获取注册手机号码输入框
		var $pwdInputR = $("#regist-password")// 获取注册密码输入框
		var $returnLogin= $(".return-login")// 获取返回登录的按钮
		var $returnRegist = $(".login-to-regist")// 获取返回注册的按钮
		var $closeBtn = $(".close")// 获取关闭按钮
		// 13 登录
		// 13.1 为登录按钮绑定单击相应函数
		$loginBtn.click(function() {		
			// 13.2 判断输入框中的值
			if(isNone($phoneInputL, $pwdInputL)) {
				if(localStorage.user) {
					// 13.3 从localStorage取出键为user的数据模型
					var arr = eval(localStorage.user);
					var k = 0;// 用k来作为标记
					// 13.4 循环取出
					for(e in arr) {
						// 13.5 判断用户名，密码是否和localStorage中的数据一致
						if($phoneInputL.val() == arr[e].loginName) {
							if($pwdInputL.val() == arr[e].loginPsd) {
								alert('登录成功');
								// 13.6 成功后清除用户名和密码，并且隐藏登录界面
								localStorage.setItem("username", "Zarek");
								clear($phoneInputL, $pwdInputL);
								k = 0;
								$login.hide();
								return;
							} else {
								alert('密码错误');
								// 13.7 失败后清除用户名和密码
								clear($phoneInputL, $pwdInputL);
								k = 0;
								return;
							}
						} else {
							k = 1;
						}
					}
					// 13.7 如果k的值为1，证明用户名不存在,但是密码在localStorage中存在
					if(k == 1) {
						alert('用户名不存在');
						clear($phoneInputL, $pwdInputL);
					}
				} else {
					// 13.8 用户名不存在则跳转到注册页面
					alert('用户名不存在，正在跳转到注册页面！');
					$login.hide();
					$register.show();
					clear($phoneInputL, $pwdInputL);
				}
			}
		});
			
		
		// 14 注册
		// 14.1 为注册按钮绑定单击相应函数
		$registerBtn.click(function() {
			if(isNone($phoneInputR, $pwdInputR)) {
				// 14.2 定义一个空数组
				var arr = [];
				if(localStorage.user) {
					arr = eval(localStorage.user);
					for(e in arr) {
						// 14.3 取出数据判断是否注册过
						if($phoneInputR.val() == arr[e].loginName) {
							alert('该账号已被注册');
							clear($phoneInputR, $pwdInputR);
							return;
						}
					}
				}
				// 14.5 创建一个对象用来存储用户的信息
				var user = {
					'loginName': $phoneInputR.val(),
					'loginPsd': $pwdInputR.val()
				};
				// 14.6 添加数据
				arr.push(user);
				localStorage.user = JSON.stringify(arr);
				alert('注册成功');
				$login.show();
				$register.hide();
				clear($phoneInputR, $pwdInputR);
			}
		});
		// 15 为返回登录按钮绑定单击相应函数
		$returnLogin.click(function() {
			$login.show();
			$register.hide();
		})
		// 16 为返回注册按钮绑定单击相应函数
		$returnRegist.click(function() {
			$login.hide();
			$register.show();
		})
		// 17 为关闭按钮绑定单击相应函数
		$closeBtn.click(function() {
			$login.hide();
			$register.hide();
		})
	})
	
	// 定义一个函数专门用于清除输入框中的值
	function clear(phone, pwd) {
		phone.val("");
		pwd.val("");
	}
		
	// 定义一个函数专门用于判断登录时输入框是否为空
	function isNone(phone, pwd) {
		if(phone.val() == "") {
			alert('用户名不能为空');
			return false;
		} else if(pwd.val() == "") {
			alert('密码不能为空');
			return false;
		}
		return true;
	}
