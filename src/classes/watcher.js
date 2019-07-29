let id = 0;
class Watcher {
  constructor(type, cb) {
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
    console.log('i have update')
  }
}
export default Watcher;