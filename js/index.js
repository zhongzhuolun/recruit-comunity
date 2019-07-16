$(function() {
	// 0 获取需要用到的元素，并且将其设置为全局变量，同时初始化一些需要的数据类型
	var textValue = "";// 初始化文本框的值
	var $lists = $(".lists");// 获取填充todo的ul
	var $leftItem = $(".todo .footer .count strong")// 获取items left元素
	var $count = parseInt($leftItem.text());// 获取items left的值
	var $footer = $(".todo .footer")[0];// 获取底部的footer元素
	var $checkAll = $(".check-all");// 获取全选小图标
	var $clearComplete = $(".clear-complete");// 获取清除所有已完成项的按钮
	var $control = $("#toggle-all");// 获取控制小图标颜色状态的元素
	var conditionArray = [];// 创建一个存储todo选中状态的数组
	var $allBtn = $(".filters li").eq(0);// 获取All按钮
	var $activeBtn = $(".filters li").eq(1);// 获取Active按钮
	var $completeBtn = $(".filters li").eq(2);// 获取Complete按钮
	var $index;// 创建全局变量$index以便动态修改label中的值使用
	var $label;// 创建全局变量$label以便动态修改label中的值使用
	// 1 监听文本框的输入和输出，创建todo，并且将其插入列表中,同时改变items left的值	
	// 1.1 当文本框失去焦点时
	$(".need").blur(function() {
		textValue = this.value;
		if (textValue.length > 0) {//文本框中的值满足条件值调用
			createTodo(textValue);
			this.value = "";
			$leftItem.text(getAllFalseIndex(conditionArray).length);// 修改过 原始为$count++ ->
		}
		
		
		
	});
	// 1.2 当用户敲回车键或者tab键时
	$("body").keyup(function(event) {
		if (event.keyCode == 13 || event.keyCode == 9) {
			textValue = $(".need").val();
			if (textValue.length > 0) {
				createTodo(textValue);
				$(".need").val("");
				$leftItem.text(getAllFalseIndex(conditionArray).length);// 修改过 原始为$count++
			}					
		}
	
	});
	// 1.3 创建一个函数动态生成一条todo,并且将其插入列表中
	function createTodo(textValue) {
		var value = "";
		// 1.3.1 判断筛选按钮的状态:如果为complete
		if ($completeBtn.prop("class") == "selected") {
			// 1.3.2 为item加上hide的class类名，让其隐藏
			value = "hide";
		}
		// 1.3.3 通过字符串形式生成一个item
		var item = "" +
		 '<li class="item '+value+'">' +
								'<div class="view">' +
									'<input type="checkbox" class="toggle"/>'+
									'<label class="text">'+ textValue +'</label>' +
									'<button type="button" class="destroy"></button>' +
								'</div>' +
							'</li>';
		// 1.3.4 将item动态添加到ul中	
		$lists.append(item);
		// 1.3.5 将生成的每一个todo的状态存储在数组中
		conditionArray[conditionArray.length] = false; 
		// 1.3.6 显示全选小图标
		$checkAll.addClass("show");
		 // 1.3.7 显示底部元素
		if ($footer.style.display == "none") {
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
		var $item = $(".item");
		for (var i = 0; i < len; i++) {
			if (conditionArray[i] == true) {
				count++;
			}
		}
		// 2.2 判断列表的状态，同时判断筛选按钮的状态
		// 2.2.1 当列表项全为false时，点击后应该全为true，当列表项存在true时，点击应该全为true
		if (count == 0|| (count > 0 && count < len)) {
			$condition.prop("checked", true);
			for (var i = 0; i < len; i++) {
				conditionArray[i] = true;
				$control.prop("checked", false);
			}
			// 2.2.2 设置left items的值
			$count = 0;
			$leftItem.text($count);
			// 2.2.2 判断筛选按钮的状态:如果为active
			if ($activeBtn.prop("class") == "selected") {
				// 2.2.3 隐藏所有的项目
				$item.hide(100);
			// 2.2.4 判断筛选按钮的状态:如果为complete	
			} else if ($completeBtn.prop("class") == "selected") {
				// 2.2.5 隐藏所有的项目
				$item.show(100);

			}
			
		} else {// 2.3 当列表项全为true时，点击后应全为false
			$condition.prop("checked", false);
			for (var i = 0; i < len; i++) {
				conditionArray[i] = false;
				$control.prop("checked", true);
			}
			// 2.3.1 设置left items的值
			$count = conditionArray.length;
			$leftItem.text($count);
			// 2.3.2 判断筛选按钮的状态:如果为complete
			if ($completeBtn.prop("class") == "selected") {		
				// 2.3.3 隐藏所有项目
				$item.hide(100);
			// 2.3.4 判断筛选按钮的状态:如果为active
			} else if ($activeBtn.prop("class") == "selected") {
				// 2.3.5 显示所有的项目
				$item.show(100);
			}
		}	
							
		// 2.4 点击时切换todo列表的类名
		$(".lists .item ").toggleClass("completed");
		// 2.5 点击时切换clearcomplete
		$clearComplete.toggleClass("completed");
		// 2.6 如果列表项全为true，则应该为todo类名和clearccomplete都加上completed类名
		if (isAllTrue(conditionArray)) {
			$(".lists .item ").addClass("completed");
			$clearComplete.addClass("completed");
		} 		
		
	});
	// 3 给todo列表的CheckBox绑定事件，需要用到事件委托
	$lists.on("click", ".toggle", function() {
		// 3.1 拿到被点击元素的序号,状态和其祖先元素li
		var index = $(".lists .toggle").index(this);
		var condition = $(this).prop("checked");
		var $item = $(this).parents(".item");
		// 3.2 将点击后的状态存储在数组中
		conditionArray[index] = condition;
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
		$(".lists .item").eq(index).toggleClass("completed");

		// 3.5 判断筛选按钮的状态:如果为active
		if ($activeBtn.prop("class") == "selected") {
			if (condition) {
				// 3.5.1 隐藏该项目
				$item.hide(100);	
			}
		}
		// 3.6 判断筛选按钮的状态:如果为complete
		if ($completeBtn.prop("class") == "selected") {
			if (!condition) {
				// 3.6.1 隐藏该项目
				$item.hide(100);
			}
		}
		console.log(conditionArray)
		// 3.7 设置left item的值
		// if (condition) {
		// 	$count -= 1;
		// } else {
		// 	$count += 1;
		// }
		$leftItem.text(getAllFalseIndex(conditionArray).length);
		
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
		// 4.4 重置状态数组
		conditionArray.splice(index,1);
		if (isHasTrue(conditionArray)) {
			$clearComplete.addClass("completed");
		} else {
			$clearComplete.removeClass("completed");
		}
		// 4.5 让left items的值减一
		$count = getAllFalseIndex(conditionArray).length;
		$leftItem.text($count);
		// 4.6 如果conditionArray的长度为零，则让footed消失,全选小图标消失，clearcomplete消失
		if (conditionArray.length == 0) {
			$footer.style.display = "none";
			$checkAll.removeClass("show");
			$clearComplete.removeClass("completed");		
		}
		
	});
	// 5 给clearcomplete按钮绑定点击函数
	$clearComplete.click(function(){
		// 5.1 获取列表中所有为true的项目
		var $allComplete = $lists.children(".completed");

		// 5.1.1 如果列表全为true,则需要隐藏掉footer和全选小图标
		if ($allComplete.length == conditionArray.length) {
			$footer.style.display = "none";
			$checkAll.removeClass("show");
		}		
		// 5.2 让left items的值同步
		$count = getAllFalseIndex(conditionArray).length;
		$leftItem.text($count);
		// 5.3 删除获取到的项目
		$allComplete.remove();
		// 5.4 重置状态数组
		resetArray(conditionArray);				
		// 5.5 移除clearcomplete按钮的completed状态
		$clearComplete.removeClass("completed");
	})
	// 6 给All按钮绑定单击响应函数
	$allBtn.click(function() {
		// 6.1 获取列表中所有的元素
		var $allItems = $lists.children(".item");
		// 6.2 排他操作
		$(this).addClass("selected");
		$(this).siblings().removeClass("selected");		
		// 6.3 显示所有元素
		$allItems.show(100);

	})
	// 7 给Active按钮绑定单击响应函数
	$activeBtn.click(function() {	
		// 7.1 找到所有为true的items
		var $allComplete = $lists.children(".completed");
		var $allNoComplete = getAllFalse(conditionArray);
		// 7.2 排他操作
		$(this).addClass("selected");
		$(this).siblings().removeClass("selected");		
		// 7.3 隐藏所有为true的items
		$allComplete.hide(100);
		// 7.4 显示所有为false的items
		for (var i = 0; i < $allNoComplete.length; i++) {
			$allNoComplete[i].show(100);
		}

	})
	// 8 给Complete按钮绑定单击响应函数
	$completeBtn.click(function() {	
		// 8.1 找到所有为false的items,隐藏所有为false的items
		var $allNoComplete = getAllFalse(conditionArray);
		var $allComplete = $lists.children(".completed");
		for (var i = 0; i < $allNoComplete.length; i++) {
			$allNoComplete[i].hide(100);
		}
		// 8.2 排他操作
		$(this).addClass("selected");
		$(this).siblings().removeClass("selected");		
		// 8.3 显示所有为true的items
		$allComplete.show(100);
	})
	// 9 监听todo中label的点击事件，需要用到事件委托
	$lists.delegate(".text", "dblclick", function() {			
		// 9.1 获取label中的值,以及在todo列表中的索引值
		var value = $(this).html();
		$label = $(this);
		$index = $(".text").index(this);
		//9.2 动态生成一个input框
		handleDbclick(value);
		// 9.3 设置边框的样式
		$(this).parents("li").addClass("editing");
		// 9.4 隐藏label
		$(this).hide();
		
	})
	
	// 10 监听todo中input的失去焦点事件，需要用到事件委托
	$lists.delegate(".change", "blur", function() {
		// 10.1 获取input中的值,以及在todo列表中的索引值
		var value = $(this).val();
		// 10.2 将边框样式还原
		$label.parents("li").removeClass("editing");
		
		// 10.4 判断值的内容,如果为空的话
		if (value.length == 0) {
			// 10.4.1 将对应的item移除
			$label.parents("li").remove();
			// 10.4.2 将状态数组对应的索引的值删除
			conditionArray.splice($index, 1);
			// 10.4.3 重新设置leftitems的值
			$leftItem.text(getAllFalseIndex(conditionArray).length);
			// 10.4.4 重新设置$count的值
			$count = getAllFalseIndex(conditionArray).length;
		} else {
			// 10.4.5 将value的值设置给label
			$label.html(value);
			// 10.4.6 显示label
			$label.show();
			
		}
		//10.3 将input移除
		$(this).remove();
		// 10.5 判断conditionArray的长度是否为零，若为零，则隐藏对应的按钮
		if (conditionArray.length == 0) {
			$footer.style.display = "none";
			$checkAll.removeClass("show");
			$clearComplete.removeClass("completed");		
		}		
	})
	// 11 监听todo中label的键盘事件，需要用到事件委托 (!!!有bug)
	$lists.on("keyup", ".change", function($event) {
	// 	// 11.1 获取input中的值,以及在todo列表中的索引值
		var value = $(this).val();
		// var index = $(".change").index(this);
		if (event.keyCode == 13 || event.keyCode == 9) {
			//11.2 将边框样式还原
			$label.parents("li").removeClass("editing");
			
			//11.4 判断值的内容,如果为空的话
			if (value.length == 0) {
				//11.4.1 将对应的item移除
				$label.parents("li").remove();
				//11.4.2 将状态数组对应的索引的值删除
				conditionArray.splice($index, 1);
				//11.4.3 重新设置leftitems的值
				$leftItem.text(getAllFalseIndex(conditionArray).length);
				//11.4.4 重新设置$count的值
				$count = getAllFalseIndex(conditionArray).length;
			} else {
				// 11.4.5 将value的值设置给label
				$label.html(value);
				// 11.4.6 显示label
				$label.show();
				
			}
			//11.3 判断是否还有input框，有则将input移除
			if ($(this)) {
				console.log($(this))
				$(this).blur();
			}
			
			// 11.5 判断conditionArray的长度是否为零，若为零，则隐藏对应的按钮
			if (conditionArray.length == 0) {
				$footer.style.display = "none";
				$checkAll.removeClass("show");
				$clearComplete.removeClass("completed");		
			}
			$event.preventDefault();
			return false;
			
		}
		
		 
	})
	// 12.监听动态生成的输入框的聚焦事件
	$lists.delegate(".change", "focus", function($event){
		$event.target.select();
	})
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
	// 定义一个函数专门用来重置状态数组
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
	// 定义一个函数专门获取列表中所有为false的序号的函数
	function getAllFalseIndex(arr) {
		var itemsArray = [];
		for (var i = 0; i < arr.length; i++) {
			if (!arr[i]) {
				itemsArray.push(i);
			}
		}
		return itemsArray;		
	}
	// 定义一个函数专门获取所有为false的items
	function getAllFalse(arr) {
		var allFalseArr = [];
		var allFalseIndex = getAllFalseIndex(arr);
		var $allItems = $lists.children(".item");
		for (var i = 0; i < allFalseIndex.length; i++) {
			allFalseArr[i] = $allItems.eq(allFalseIndex[i]);
		}
		return allFalseArr;	
	}
	// 定义一个专门用来处理双击label元素时动态修改元素内容的函数
	function handleDbclick(value) {
		var $input = $("<input class='change'> tyep='text'");
		$input.attr("value", value);
		var resetIndex = $index;
		var n = $index;
		// 判断筛选按钮的状态:如果为complete
		if ($completeBtn.prop("class") == "selected") {	
			n = 0;
			for (var i = 0;i < resetIndex; i++) {
				if (conditionArray[i]) {
					n++;
				}
			}
			
		// 判断筛选按钮的状态:如果为active
		} else if ($activeBtn.prop("class") == "selected") {
				n = 0;
			for (var i = 0;i < resetIndex; i++) {
				if (!conditionArray[i]) {
					n++;
				}
			}
		}
		$input.css("top", n*58);   
		//  判断此时label中的值是否有删除线，即此时状态是否为true
		if (conditionArray[$index]) {
			$input.addClass("checked");
		}
		$lists.append($input);
		$input.focus();
		
		
		
	}
})
// 	// 通过contenteidtable属性会有回车键无法取消其默认行为的bug，即回车自动换行
	// 	if (event.keyCode == 13 || event.keyCode == 9) {
	// 		// 11.2 将边框样式还原
	// 		$(this).parents("li").removeClass("editing");
	// 		// 11.3 设置元素不可编辑
	// 		$(this).prop("contenteditable", false);
	// 		// 11.4 判断值的内容,如果为空的话
	// 		if (value.length == 0) {
	// 			// 11.4.1 将对应的item移除
	// 			$(this).parents("li").remove();
	// 			// 11.4.2 将状态数组对应的索引的值删除
	// 			conditionArray.splice(index, 1);
	// 			// 11.4.3 重新设置leftitems的值
	// 			$leftItem.text(getAllFalseIndex(conditionArray).length);
	// 			// 11.4.4 重新设置$count的值
	// 			$count = getAllFalseIndex(conditionArray).length;
	// 		}
	// 		$event.preventDefault();
 //            return false;
	// 	}
	// })