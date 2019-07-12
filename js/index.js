$(function() {
	// 1 监听文本框的输入和输出，创建todo，并且将其插入列表中,同时改变items left的值
	var textValue = "";// 初始化文本框的值
	var $lists = $(".lists");// 获取填充todo的ul
	var $count = parseInt($(".todo .footer .count strong").text());// 获取items left的值
	var $footer = $(".todo .footer")[0];// 获取底部的footer元素
	var $checkAll = $(".check-all");// 获取小图标
	var $clearComplete = $(".clear-complete")[0];
	var conditionArray = [];// 创建一个存储todo选中状态的数组
	// 1.1 当文本框失去焦点时
	$(".need").blur(function() {
		textValue = this.value;
		if (textValue.length > 0) {//文本框中的值满足条件值调用
			createTodo(textValue);
			this.value = "";
			$(".todo .footer .count strong").text(++$count);
		}
		
	});
	// 1.2 当用户敲回车键或者tab键时
	$("body").keyup(function(event) {
		if (event.keyCode == 13 || event.keyCode == 9) {
			textValue = $(".need").val();
			if (textValue.length > 0) {
				createTodo(textValue);
				$(".need").val("");
				$(".todo .footer .count strong").text(++$count);
			}					
		}
	
	});
	// 1.4 创建一个函数动态生成一条todo,并且将其插入列表中
	function createTodo(textValue) {
		var value = "" +
		 '<li class="item">' +
								'<div class="view">' +
									'<input type="checkbox" class="toggle"/>'+
									'<label>'+ textValue +'</label>' +
									'<button type="button" class="destroy"></button>' +
								'</div>' +
							'</li>';
		$lists.append(value);
		conditionArray[$count] = false; // 将生成的每一个todo的状态存储在数组中
		console.log(conditionArray)
		$checkAll.addClass("show");// 显示小图标
		if ($footer.style.display == "none") {
			$footer.style.display = "block";
		}
	}
	// 2 给输入框左边的小图标绑定一个点击事件(未完成)
	$(".check-all").click(function(){
		// 2.1 点击时切换图标
		var len = conditionArray.length;
		var $condition = $(".lists .item .toggle");
		var flag = true;
		for (var i = 0; i < len; i++) {
			if (conditionArray[i] == true) {
				$condition.prop("checked", true);
				conditionArray
				break;
			} else {
				flag = false;
			}
		}
		

		
							
		// 2.2 点击时切换li的类名
		$(".lists .item ").toggleClass("completed");
		// 2.3 点击时切换clearcomplete
	});
	// 3 给todo列表的CheckBox绑定事件，需要用到事件委托
	$lists.on("click", "input", function() {
		// 3.1 拿到被点击元素的序号，从0开始
		var index = $(".lists input").index(this);
		// 3.2 将点击后的状态存储在数组中
		conditionArray[index] = $(this).prop("checked");
		console.log(conditionArray)
	});
	
	
})