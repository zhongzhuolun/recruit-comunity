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