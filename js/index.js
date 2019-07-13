$(function() {
	// 0 获取需要用到的元素，并且将其设置为全局变量，同时初始化一些需要的数据类型
	var textValue = "";// 初始化文本框的值
	var $lists = $(".lists");// 获取填充todo的ul
	var $count = parseInt($(".todo .footer .count strong").text());// 获取items left的值
	var $footer = $(".todo .footer")[0];// 获取底部的footer元素
	var $checkAll = $(".check-all");// 获取全选小图标
	var $clearComplete = $(".clear-complete");// 获取清除所有已完成项的按钮
	var $control = $("#toggle-all");// 获取控制小图标颜色状态的元素
	var conditionArray = [];// 创建一个存储todo选中状态的数组
	var $allBtn = $(".filters li a").eq(0);// 获取All按钮
	var $activeBtn = $(".filters li a").eq(1);// 获取Active按钮
	var $completeBtn = $(".filters li a").eq(2);// 获取Complete按钮
	// 1 监听文本框的输入和输出，创建todo，并且将其插入列表中,同时改变items left的值
	
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
		conditionArray[conditionArray.length] = false; // 将生成的每一个todo的状态存储在数组中
		$checkAll.addClass("show");// 显示小图标
		if ($footer.style.display == "none") { // 显示底部元素
			$footer.style.display = "block";
		}
	}
	// 2 给输入框左边的小图标绑定一个点击事件
	$(".check-all").click(function(){
		// 2.1 点击时切换图标	
		
		var len = conditionArray.length;
		var $condition = $(".lists .item .toggle");
		var flag = true;
		var count = 0;
		
		for (var i = 0; i < len; i++) {
			if (conditionArray[i] == true) {
				count++;
			}
		}
		// 2.1.1 当列表项全为false时，点击后应该全为true
		// 2.1.2 当列表项存在true时，点击应该全为true
		if (count == 0|| (count > 0 && count < len)) {
			$condition.prop("checked", true);
			for (var i = 0; i < len; i++) {
				conditionArray[i] = true;
				$control.prop("checked", false);
			}
		} else {// 2.1.3 当列表项全为true时，点击后应全为false
			$condition.prop("checked", false);
			for (var i = 0; i < len; i++) {
				conditionArray[i] = false;
				$control.prop("checked", true);
			}
		}	
							
		// 2.2 点击时切换todo列表的类名
		$(".lists .item ").toggleClass("completed");
		// 2.3 点击时切换clearcomplete
		$clearComplete.toggleClass("completed");
		// 2.4 如果列表项全为true，则应该为todo类名和clearccomplete都加上completed类名
		if (isAllTrue(conditionArray)) {
			$(".lists .item ").addClass("completed");
			$clearComplete.addClass("completed");
		} 		
		
	});
	// 3 给todo列表的CheckBox绑定事件，需要用到事件委托
	$lists.on("click", "input", function() {
		// 3.1 拿到被点击元素的序号
		var index = $(".lists input").index(this);
		console.log(this)
		// 3.2 将点击后的状态存储在数组中
		conditionArray[index] = $(this).prop("checked");
		// 3.3 修改全选小图标和clearcomplete的状态
		if(!conditionArray[index]) {
			$control.prop("checked", false);
			if (!isHasTrue(conditionArray)) {
				$clearComplete.removeClass("completed");
			}
		} else {
			$clearComplete.addClass("completed");
		}
		if (isAllTrue(conditionArray)) {// 如果状态数组全为true，则小图标应该为true，clearccomplete应加上completed类名
			$control.prop("checked", true);
			$clearComplete.addClass("completed");
		}
		// 3.4 点击时切换todo列表的类名
		$(".lists .item ").eq(index).toggleClass("completed");
		console.log(conditionArray)
		
	});
	// 4 给删除按钮绑定一个点击事件，需要用到事件委托
	$lists.delegate("button", "click", function (){
		// 4.1 拿到被点击元素的序号
		var index = $(".destroy").index(this);
		// 4.2 获取到当前被点击的关闭按钮的祖先元素li
		var $parent = $(this).parents(".item");
		// console.log(index,$parent)
		// 4.3 删除掉该元素
		$parent.remove();
		// 4.4 让left items的值减一
		$(".todo .footer .count strong").text(--$count);
		// 4.5 如果count的值为零，则让footed消失,全选小图标消失，clearcomplete消失
		if ($count == 0) {
			$footer.style.display = "none";
			$checkAll.removeClass("show");
			$clearComplete.removeClass("completed");		
		}
		// 4.6 重置状态数组
		conditionArray.splice(index,1);
		if (isHasTrue(conditionArray)) {
			$clearComplete.addClass("completed");
		} else {
			$clearComplete.removeClass("completed");
		}
	});
	// 5 给clearcomplete按钮绑定点击函数
	$clearComplete.click(function(){
		// 5.1 获取列表中所有为true的项目
		var $allComplete = $lists.children(".completed")

		// 5.1.1 如果列表全为true,则需要隐藏掉footer和全选小图标
		if ($allComplete.length == conditionArray.length) {
			$footer.style.display = "none";
			$checkAll.removeClass("show");
		}
		// 5.1.2 获取列表中所有为true的索引
		// var itemsArray = getAllTrueItems(conditionArray);
		// 5.1.3 如果列表不全为true
		
		// 5.2 让left items的值同步
		$count -= $allComplete.length
		$(".todo .footer .count strong").text($count);
		// 5.3 删除获取到的项目
		$allComplete.remove();
		// 5.4 重置状态数组
		resetArray(conditionArray);				
		// 5.5 移除clearcomplete按钮的completed状态
		$clearComplete.removeClass("completed");
	})
	// 6 给All按钮绑定单击响应函数
	
	// 7 给Active按钮绑定单击响应函数
	// 8 给Complete按钮绑定单击响应函数
	// 定义一个专门用来检测列表项是否全为true的函数
	function isAllTrue(arr) {
		var count = 0;
		var len = arr.length;
		for (var i = 0; i < len; i++) {
			if (arr[i] == true) {
				count++;
			}
		}
		if (count == len) {
			return true;
		} else {
			return false;
		}
	}
	// 定义一个专门用来检测列表项是否存在true的函数
	function isHasTrue(arr) {
		var count = 0;
		var len = arr.length;
		for (var i = 0; i < len; i++) {
			if (arr[i] == true) {
				count++;
			}
		}
		if (count > 0 && count < len) {
			return true;
	    } else {
			return false;
		}
	}
	// 定义一个函数专门获取列表中所有为true的序号的函数
	function getAllTrueItems(arr) {
		var itemsArray = [];
		for (var i = 0; i < arr.length; i++) {
			if (arr[i]) {
				itemsArray.push(i);
			}
		}
		console.log(itemsArray);
		return itemsArray;		
	}
	function resetArray(arr) {
		var len = arr.length
		for (var i = 0; i < len; i++) {
			for (var j = 0; j < len - i; j++) {
				if (arr[j]) {
					arr.splice(j, 1);
				    break;
				}
			}	
		}			
	}
	// 定义一个函数专门获取列表中所有未false的函数
	
	
})