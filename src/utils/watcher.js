let id = 0;
class Watcher {
  constructor() {
    this.id = id++;
    this.deps = [];
  }
  addDep(dep) {
    const depIds = this.deps.map(item => item.id);
    if(dep && !depIds.includes(dep.id)) this.deps.push(dep);
  }
  run() {
    console.log('i have update')
  }
}
export default Watcher;