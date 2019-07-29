class Element {
  constructor(vnode) {
    if(vnode.tag)
      this.el = document.createElement(vnode.tag);
    else
      this.el = document.createTextNode(vnode.text);
    
  }
  appendChild(element) {
    console.log({element})
    this.el.appendChild(element.el);
  }
}
export default Element;