class Element {
  constructor(vnode) {
    // 非文本节点
    if(vnode.tag !== '') {
      this.el = document.createElement(vnode.tag);
      // 绑定属性
      Object.entries(vnode.attrs).forEach(([key, value]) => {
        this.addAttribute(key, value);
      });
      // 绑定事件
      Object.entries(vnode.events).forEach(([key, value]) => {
        this.addEventListener(key, value);
      });
    }
    // 文本节点
    else this.el = document.createTextNode(vnode.text);

  }
  appendChild(element) {
    this.el.appendChild(element.el);
  }
  addAttribute(name, value) {
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
  addEventListener(name, handler) {
    this.el.addEventListener(name, handler);
  }
}
export default Element;