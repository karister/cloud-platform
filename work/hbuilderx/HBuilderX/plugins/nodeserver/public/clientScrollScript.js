const ignoreElementTags = ['UL', 'OL', 'THEAD', 'TBODY']
class CodeLineElement {
	constructor(element, line) {
		this.line = line
		this.element = element
		this.tableElement = null // 添加该属性是由于table的tr的offsetTop值参照table标签而非body
	}
	updateOffsetTop() {
		this.offsetTop = this.element.offsetTop
		if (this.tableElement) {
			this.offsetTop = this.offsetTop + this.tableElement.offsetTop
		}
	}
}

function debounce(cb, delay) {
	let timer;
	return function(...arg) {
		clearTimeout(timer)
		timer = setTimeout(() => {
			cb(...arg)
			clearTimeout(timer)
			timer = null
		}, delay)
	}
}

function throttle(cb, delay) {
	let timer;
	return function(...arg) {
		if (!timer) {
			timer = setTimeout(() => {
				cb(...arg)
				clearTimeout(timer)
				timer = null
			}, delay)
		}
	}
}

var codeLineElements;
// 客户端处理滚动的脚本
let ws = new WebSocket("ws://localhost:8888");

ws.onopen = function() {
	// 监听浏览器滚动事件
	document.onscroll = throttle(() => {
		if (!flag) return;
		let viewLine = 0;
		var scrollTop = document.documentElement.scrollTop;
		let len = codeLineElements.length;
		for (let i = len - 2; i >= 0; i--) {
			let item = codeLineElements[i]
			let offsetTop = item.offsetTop
			if (offsetTop < scrollTop) {
				let line = parseInt(codeLineElements[i].line) + 1
				let eleHeight = codeLineElements[i + 1].offsetTop - offsetTop; // 当前元素的高度
				let scrollElementHeight = scrollTop - offsetTop // 相对于当前元素顶部的距离
				if (scrollElementHeight < eleHeight / 2) {
					viewLine = line - 1
					break;
				}
				viewLine = line
				break;
			}
		}
		if (nowLine !== viewLine) {
			nowLine = viewLine
			let msg = {
				type: 'line',
				data: {
					line: viewLine
				}
			}
			ws.send(JSON.stringify(msg));
		}
	}, 10)
	// 获取编辑器的当前的startLine同步滚动浏览器
	ws.send(JSON.stringify({
		type: 'startLine',
		data: {}
	}));
};

let flag = true
let timer;
let nowLine; // 当前所在行

ws.onmessage = function(evt) {
	var line = parseInt(evt.data);
	let elementsLength = codeLineElements.length;
	// 调用浏览器滚动屏幕api
	for (let i = 0; i <= elementsLength - 1; i++) {
		let item = codeLineElements[i]
		let elementLine = parseInt(item.line)
		let element = item.element
		let isLastLine = i === elementsLength - 1;
		let scrollElement = null;
		if (!isLastLine) {
			let nextElementLine = parseInt(codeLineElements[i + 1].line)
			if (elementLine === line || (elementLine < line && line < nextElementLine)) {
				scrollElement = elementLine === line ? element : codeLineElements[i + 1].element
			}
		} else {
			scrollElement = element
		}
		if (scrollElement) {
			flag = false // 阀门关闭，禁止监听滚动事件
			clearTimeout(timer)
			scrollElement.scrollIntoView();
			nowLine = elementLine
			timer = setTimeout(() => {
				flag = true // 阀门开启，监听滚动事件
				clearTimeout(timer)
			}, 300)
			break;
		}
	}
};

window.onresize = debounce(() => {
	codeLineElements.forEach(ele => {
		ele.updateOffsetTop()
	});
}, 300)

getCodeLineElements()

function getCodeLineElements() {
	codeLineElements = [new CodeLineElement(document.body, -1)];
	let tableElement;
	for (const element of document.getElementsByClassName('code-line')) {
		if (!(element instanceof HTMLElement)) {
			continue;
		}

		const line = element.getAttribute('data-line');
		if (isNaN(line)) {
			continue;
		}
		if (element.tagName === "TABLE") {
			tableElement = element
		}
		if (ignoreElementTags.includes(element.tagName)) continue;
		if (element.tagName === 'CODE' && element.parentElement && element.parentElement.tagName === 'PRE') {
			//隔离代码块是一种特殊情况，因为' code-line '只能标记为on
			//使用' <code> '元素，而不是父元素' <pre> '。
			codeLineElements.push(new CodeLineElement(element.parentElement, line, element));
		} else {
			let codeEle = new CodeLineElement(element, line)
			if (element.tagName === "TR") {
				codeEle.tableElement = tableElement
			}
			codeEle.updateOffsetTop()
			codeLineElements.push(codeEle);
		}
	}
}