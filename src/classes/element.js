class Element {
  constructor(vnode, xm) {
    this.xm = xm;
    // 如果为null的话，则不做任何处理
    if(vnode.tag === null) return;
    // 非文本节点
    if(vnode.tag !== '') {
      this.el = document.createElement(vnode.tag);
      // 绑定属性
      Object.entries(vnode.attrs).forEach(([key, value]) => {
        this.setAttribute(key, value);
      });
      // 绑定事件
      Object.entries(vnode.events).forEach(([key, value]) => {
        this.addEventListener(key, value.bind(xm));
      });
    }
    // 文本节点
    else this.el = document.createTextNode(vnode.text);

  }
  // 添加子节点
  appendChild(element) {
    this.el && element.el && this.el.appendChild(element.el);
  }
  // 移除子节点
  removeChild(element) {
    this.el && element.el && this.el.removeChild(element.el);
  }
  // 添加属性，对className和style做特殊处理
  // class是保留字，style接受一个对象
  setAttribute(name, value) {
    if(name === 'className') {
      this.el.setAttribute('class', value);
    }
    else if(name === 'style') {
      Object.entries(value).forEach(([styleKey, styleValue]) => {
        this.el.style[styleKey] = styleValue;
      })
    }
    else {
      this.el.setAttribute(name, value);
    }
  }
  // 添加事件监听
  addEventListener(name, handler) {
    this.el.addEventListener(name, handler);
  }
  // 移除事件监听
  removeEventListener(name, handler) {
    this.el.removeEventListener(name, handler);
  }
  // 更新文本节点
  updateText(text, oldElement) {
    oldElement.updateTextContent(text);
    this.el = oldElement.el;
  }
  // 更新文本内容
  updateTextContent(text) {
    this.el.textContent = text;
  }
  replaceChild(newElement, oldElement) {
    this.el.replaceChild(newElement.el, oldElement.el);
  }
  insertBefore(newElement, referenceElement) {
    this.el.insertBefore(newElement.el, referenceElement && referenceElement.el);
  }
}
export default Element;