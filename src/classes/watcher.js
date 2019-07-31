let id = 0;
class Watcher {
  constructor(cb, type) {
    this.id = id++;
    this.deps = [];
    this.type = type;
    this.cb = cb;
  }
  addDep(dep) {
    const depIds = this.deps.map(item => item.id);
    if(dep && !depIds.includes(dep.id)) this.deps.push(dep);
  }
  run() {
    this.cb();
  }
}
export default Watcher;