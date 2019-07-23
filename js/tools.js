//该函数用于事件的绑定
/*
    addEventListener()中的this是绑定事件的对象，而attachEvent()中的this是window
    参数：
     1.obj:要绑定事件的对象
     2.evenStr:事件的字符串（不要on）
     3.callback：回调函数
*/
// function bind(obj, evenStr, callback) {
// 	if (obj.addEventListener) {
// 		obj.addEventListener(evenStr, callback, false);
// 	} else {
// 		obj.attachEvent("on" + evenStr, function() {
// 			callback.call(obj);
// 		});
// 	}
// }
// //该函数用于向元素中添加class属性，obj代表元素，cn代表class属性名
// function addClass(obj, cn) {
// 	if (!hasClass(obj, cn)) {
// 		obj.className += " " + cn;
// 	}
// }
// //该函数用于判断元素中是否含有对应的class样式名
// function hasClass(obj, cn) {
// 	var reg = new RegExp("\\b" + cn + "\\b");
// 	return reg.test(obj.className);
// }
// //该函数用于移除对应的class样式名
// function removeClass(obj, cn) {
// 	var reg = new RegExp("\\b" + cn + "\\b");
// 	obj.className = obj.className.replace(reg, "");
// }
// //该函数用于如果元素中含有对应的样式名，则删除该样式名，如果没有改样式名，则添加
// 
// function toggleClass(obj, cn) {
// 	if (hasClass(obj, cn)) {
// 		removeClass(obj, cn);
// 	} else {
// 		addClass(obj, cn);
// 	}
// }

// obj对象，attr属性，target目标，speed速度，callback回调函数
function move(obj, attr, target, speed, callback) {
	clearTimeout(obj.timer); //关闭指定对象的定时器
	var current = parseInt(getStyle(obj, attr)); //获取当前对象的属性的值
	if (current > target) { //判断如果当前的值大于目标值，则将速度取反
		speed = -speed;
	}
	obj.timer = setInterval(function() { //开启指定对象的定时器
		var oldValue = parseInt(getStyle(obj, attr)); //获取对象属性开始的值
		var newValue = oldValue + speed; //将旧值加上变化速度的和赋予新的值
		if (speed < 0 && newValue < target || speed > 0 && newValue > target) {
			newValue = target;
		}

		obj.style[attr] = newValue + "px"; //将新值赋予对象的属性
		if (newValue === target) {
			clearTimeout(obj.timer); //判断如果新的值完全等于目标值，则关闭定时器
			callback && callback();
		}
	}, 30);
}
//该函数用于获取一个元素中对应的CSS属性
function getStyle(obj, name) {
	if (window.getComputedStyle) {
		return getComputedStyle(obj, null)[name]; //其他浏览器支持的方法
	} else {
		return obj.currentStyle[name]; //该方法只有IE浏览器支持
	}
}
//共享onload事件
function addLoadEvent(func) {
	var oldOnload = window.onload;
	if (typeof window.onload != "function") {
		window.onload = func;
	} else {
		window.onload = function() {
			oldOnload();
			func();
		}
	}
}
//insertAfter函数
function insertAfter(newElement, targetElement) {
	var parent = targetElement.parentNode;
	if (parent.lastChild == targetElement) {
		parent.appendChild(newElement);
	} else {
		parent.insertBefore(newElement, targetElement.nextSibling);
	}
}
//获取下一个元素节点函数
function getNextElement(node) {
	if (node.nodeType == 1) {
		return node;
	}
	if (node.nextSibling) {
		return getNextElement(node.nextSibling);
	} else {
		return null;
	}
}
//获取像素
function getPxInfo(imgdata, x, y) {
	var color = [];
	var data = imgdata.data;
	var w = imgdata.width;
	var h = imgdata.height;

	color[0] = data[(y * w + x) * 4];
	color[1] = data[(y * w + x) * 4 + 1];
	color[2] = data[(y * w + x) * 4 + 2];
	color[3] = data[(y * w + x) * 4 + 3];
	return color;
}
//设置像素
function setPxInfo(imgdata, x, y, color) {
	var data = imgdata.data;
	var w = imgdata.width;
	var h = imgdata.height;

	data[(y * w + x) * 4] = color[0];
	data[(y * w + x) * 4 + 1] = color[1];
	data[(y * w + x) * 4 + 2] = color[2];
	data[(y * w + x) * 4 + 3] = color[3];
}
//该函数用于阻止元素的事件冒泡
function stopFunc(ev) {
	ev = ev || window.event;
	ev.stopPropagation ? ev.stopPropagation() : ev.cancelBubble = true;
}
//将父级下所有的符合条件的子元素全部取出
function getChilds(child, oParent) {
	var childArr = [];
	var tagsAll = oParent.getElementsByTagName('*');
	[].map.call(tagsAll, function(current) {
		if (current.className == child) {
			childArr.push(current);
		}
	});
	return childArr;
}
//冒泡
function bubble(arr) {
	for (var i = 0, rec = arr[0]; i < arr.length; i++) {
		rec = Math.min(rec, arr[i]);
	}
	return rec;
}
//获取数组中最小值对应的index
function getMinIndex(min, arr) {
	for (var i in arr) {
		if (min == arr[i])
			return i;
	}
}
//该函数用于给多个元素绑定事件 obj：对象名，cn：不加on的事件类型 callback:回调函数
function bindOfEvent(obj, cn, callback) {
	for (var i = 0; i < obj.length; i++) {
		bind(obj[i], cn, callback);
	}
}
//拖拽函数，主要用于播放器
(function(w) {
	w.$_ = {};
	//callBack将内部组件的move状态暴露了外部的业务逻辑
	w.$_.drag = function(textNode, callBack) {
		//确定元素一开始的位置
		var elementPoint = {
			x: 0,
			y: 0
		};
		//鼠标一开始的位置
		var startPoint = {
			x: 0,
			y: 0
		};
		textNode.onmousedown = function(ev) {
			ev = ev || event;
			//参照于offsetParent
			elementPoint.x = this.offsetLeft;
			elementPoint.y = this.offsetTop;
			//参照于视口
			startPoint.x = ev.clientX;
			startPoint.y = ev.clientY;
			if (textNode.setCapture) {
				textNode.setCapture();
			}

			document.onmousemove = function(ev) {
				ev = ev || event;
				//参照于视口
				var nowPoint = {
					x: 0,
					y: 0
				};
				nowPoint.x = ev.clientX;
				nowPoint.y = ev.clientY;
				var L = elementPoint.x + nowPoint.x - startPoint.x;
				var T = elementPoint.y + nowPoint.y - startPoint.y;
				if (L < 0) {
					L = 0;
				} else if (L > textNode.offsetParent.offsetWidth - textNode.clientWidth) {
					L = textNode.offsetParent.offsetWidth - textNode.clientWidth;
				}
				//参照于offsetParent
				textNode.style.left = L + "px";
				//						textNode.style.top = T + "px";
				if (callBack && typeof callBack["moving"] === "function") {
					callBack["moving"].call(textNode);
				}
				document.onmouseup = function() {

					window.valueP = false;
					document.onmousemove = document.onmouseup = null;
					if (document.releaseCapture) {
						document.releaseCapture();
					}
					return false;
				}
			}

		}
	}
})(window)

//定义一个拖拽函数,用于评论窗口
function drag2(obj) {
	//为obj绑定一个鼠标按下事件
	//当鼠标在被拖拽元素上按下时，开始拖拽onmousedown
	obj.onmousedown = function() {
		//div的水平偏移量 鼠标.clientX - 元素.offsetLeft
		//div的垂直偏移量 鼠标.clientY - 元素.offsetTop
		var ol = event.clientX - obj.offsetLeft;
		var ot = event.clientY - obj.offsetTop;
		//为document绑定一个onmousemove事件
		document.onmousemove = function(event) {

			event = event || window.event;
			//当鼠标移动时被拖拽元素跟随鼠标移动onmousemove
			//获取鼠标的坐标
			var left = event.clientX - ol;
			var top = event.clientY - ot;
			if (left < 240) {
				left = 240;
			} else if (left > 1128) {
				left = 1128;
			}
			if (top < 210) {
				top = 210;
			} else if (top > 414) {
				top = 414;
			}
			//修改box1的位置
			obj.style.left = left + "px";
			obj.style.top = top + "px";

		};
		//为document绑定一个鼠标松开事件
		document.onmouseup = function() {
			//当鼠标松开时，被拖拽元素固定在当前位置onmouseup
			//取消鼠标移动事件
			document.onmousemove = null;
			//取消鼠标松开事件
			document.onmouseup = null;
			// 该语句服务于评论窗口
			obj.onmousedown = null;
		};
		//取消浏览器默认行为
		return false;
	};
};
//定义一个拖拽函数,用于登录和注册的窗口
function drag3(obj) {
	//为obj绑定一个鼠标按下事件
	//当鼠标在被拖拽元素上按下时，开始拖拽onmousedown
	obj.onmousedown = function() {
		//div的水平偏移量 鼠标.clientX - 元素.offsetLeft
		//div的垂直偏移量 鼠标.clientY - 元素.offsetTop
		var ol = event.clientX - obj.offsetLeft;
		var ot = event.clientY - obj.offsetTop;
		//为document绑定一个onmousemove事件
		document.onmousemove = function(event) {

			event = event || window.event;
			//当鼠标移动时被拖拽元素跟随鼠标移动onmousemove
			//获取鼠标的坐标
			var left = event.clientX - ol;
			var top = event.clientY - ot;

			//修改obj的位置
			obj.style.left = left + "px";
			obj.style.top = top + "px";

		};
		//为document绑定一个鼠标松开事件
		document.onmouseup = function() {
			//当鼠标松开时，被拖拽元素固定在当前位置onmouseup
			//取消鼠标移动事件
			document.onmousemove = null;
			//取消鼠标松开事件
			document.onmouseup = null;
			//该语句服务于评论窗口
			obj.onmousedown = null;
		};
		//取消浏览器默认行为
		return false;
	};
};
//修改了 input:checkbox 或者 input:radio 元素的选择中状态， checked 属性发生变化。
//修改了 input:text 或者 textarea 元素的值，value 属性发生变化。
//修改了 select 元素的选中项，selectedIndex 属性发生变化。
//　　在监听到onpropertychange事件后，可以使用 event 的 propertyName 属性来获取发生变化的属性名称
// Firefox, Google Chrome, Opera, Safari, Internet Explorer from version 9
function OnInput(ev) {
	ev = ev || event;
	return ev.target.value;
}
// Internet Explorer
function OnPropChanged(ev) {
	ev = ev || event;
	if (ev.propertyName.toLowerCase() == "value") {
		return ev.srcElement.value;
	}
}

function ifIndex(father, target) {
	var i,
		len = father.length;
	for (i = 0; i < len; i++) {
		father[i].index = i;
	}
	for (i = 0; i < len; i++) {
		if (father[i].index == target.index) {
			return father[i].index;
		}
	}

}
//该函数用于清除活跃元素的样式
function clearActive(obj, cn) {
	for (var i = 0; i < obj.length; i++) {
		obj[i].className = cn;
	}
}
//该函数用于清除禁用元素
function clearDisabled(obj) {
	for (var i = 0; i < obj.length; i++) {
		obj[i].disabled = false;
	}
}
//时间格式转换函数
function changeTime(time) {
	time = parseInt(time);
	var m = toZero(Math.floor(time % 3600 / 60));
	var s = toZero(Math.round(time % 60));
	return m + ':' + s;
}
//时间格式转换函数
function toZero(num) {
	var val = "";
	if (num < 10) {
		val = "0" + num;
	} else {
		val = num + val;
	}
	return val;
}
function outputAttributes(element) {
	var pairs = new Array(),
		attrName,
		attrValue,
		i,
		len;
	for (i = 0, len = element.attributes.length; i < len; i++) {
		attrName = element.attributes[i].nodeName;
		attrValue = element.attributes[i].nodeValue;
		if (element.attributes[i].specified) {
			pairs.push(attrName + "=\"" + attrValue + "\"");
		}
	}
	return pairs.join(" ");
}
function loadScriptString(code) {
	var script = document.createElement("script");
	script.type = "text/jscript";
	try {
		script.appendChild(document.createTextNode(code));
	} catch (ex) {
		script.text = code;
	}
	document.body.appendChild(script);
}
function loadStyleString(css) {
	var style = document.createElement("style");
	style.type = "text/css";
	try {
		style.appendChild(document.createTextNode(css));
	} catch (ex) {
		style.styleSheet.cssText = css;
	}
	var head = document.getElementsByTagName("head")[0];
	head.appendChild(style);
}
function contains(refNode, otherNode) {
	if (typeof refNode.contains == "function"
		&& (!client,engine.webkit || client.engine.webkit >= 522)) {
			return refNode.contains(otherNode);
		} else if (typeof refNode.compareDocumentPosition == "function") {
			return !!(refNode.compareDocumentPosition(otherNode) & 16);
		} else {
			var node = otherNode.parentNode;
			do {
				if (node === refNode) {
					return true;
				} else {
					node = node.parentNode;
				}
			} while (node !== null);
			return false;
		}
}
// 跨浏览器事件对象
var eventUtil = {
	addHandler: function(ele, type, handle) {
			if (ele.addEventListener) {
				ele.addEventListener(type, handler, false);
			} else if (ele.attachEvent) {
				ele.attachEvent("on" + type, handle);
			} else {
				ele["on" + type] = null;
			}
	},
	removeHandler: function(ele, type, handle) {
			if (ele.emoveEventListener) {
				ele.emoveEventListener(type, handler, false);
			} else if (ele.detachEvent) {
				ele.detachEvent("on" + type, handle);
			} else {
				ele["on" + type] = null;
			}
	},
	getEvent: function(event) {
		return event ? event: window.event;
	},
	getTarget: function(event) {
		return event.target || event.srcElement;
	},
	preventDefault: function(event) {
		if (event.preventDefault) {
			event.preventDefault();
		} else {
			event.returnValue = false;
		}
	},
	stopPropagation: function(event) {
		if (event.stopPropagation) {
			event.stopPropagation();
		} else {
			event.cancelBubble = true;
		}
	},
	getRelatedTarget: function(event) {
		if (event.relatedTarget) {
			return event.relatedTarget;
		} else if (event.toElement) {
			return event.toElement;
		} else if (event.fromElement) {
			return event.fromElement;
		} else {
			return null;
		}
	},
	getButton: function(event) {
		if (document.implementation.hasFeature("MouseEvent", "2.0")) {
			return event.button;
		} else {
			switch (event.button) {
				case 0:
				case 1:
				case 3:
				case 5:
				case 7:
					return 0;
				case 2:
				case 6:
					return 2;
				case 4:
					return 1;
					
			}
		}
	},
	getWheelDelta: function(event) {
		if (event.wheelData) {
			return (client.engine.opera && client.engine.opera < 9.5 ? -event.wheelData : event.wheelData);
		} else {
			return -event.detail * 40;
		}
	},
	getCharCode: function(event) {
		if (typeof event.charCode == "number") {
			return event.charCode;
		} else {
			return event.keyCode;
		}
	}
	
}
// 文本选中函数
function selectText(textbox, startIndex, stopIndex) {
	if (textbox.setSelectionRange) {
		textbox.setSelectionRange(startIndex, stopIndex);
	} else if (textbox.createTextRange) {
		var range = textbox.createTextRange();
		range.collapse(true);
		range.moveStart("character", stratIndex);
		range.moveEnd("character", stopIndex - startIndex);
		range.select();
	}
	textbox.focus();
}
// 反转义
function HTMLDecode(text) { 
	var temp = document.createElement("div"); 
	temp.innerHTML = text; 
	var output = temp.innerText || temp.textContent; 
	temp = null; 
	return output; 
} 
// 转义
function HTMLEncode(html) {
	var temp = document.createElement("div");
	(temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
	var output = temp.innerHTML;
	temp = null;
	return output;
}
// 检测目标数据类型
function checkedType(target) {
	return Object.prototype.toString.call(target).slice(8, -1);
}
// 深度克隆函数
function deepClone(target) {
	let result, targetType = checkedType(target);
	if (targetType === 'Object') {
		result = {};
	} else if (targetType === 'Array') {
		result = [];
	} else {
		return target;
	}
	for (let i in target) {
		let value = target[i];
		if (checkedType(value) === 'Object' || checkedType(value) === 'Array') {
			result[i] = deepClone(value);
		} else {
			result[i] = value
		}
	}
	return result;
}