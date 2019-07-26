export default function proxy(xm, sourceKey, key) {
  Object.defineProperty(xm, key, {
    get() {
      return xm[sourceKey][key];
    },
    set(newV) {
      xm[sourceKey][key] = newV;
    }
  })
}