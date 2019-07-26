function elementMixin(Xue) {
  Xue.prototype._parseJSX = (tag, attrs, ...children) => {
    return {
      tag,
      attrs,
      children
    }
  }
}

export default elementMixin;