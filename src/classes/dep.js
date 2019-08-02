import { addUpdateQueue } from '../utils/queue';

let id = 0;
let targetList = [];

class Dep {
  static target = null;
  static pushTarget(watcher) {
    targetList.push(watcher);
    Dep.target = watcher;
  }
  static popTarget() {
    targetList.pop();
    const length = targetList.length;
    if(length > 0)
      Dep.target = targetList[length - 1];
  }
  constructor(value) {
    this.id = id++;
    this.watchers = [];
    this.value = value;
  }
  addWatcher() {
    const watcherIds = this.watchers.map(item => item.id);
    if(Dep.target && !watcherIds.includes(Dep.target.id)) this.watchers.push(Dep.target);
  }
  changeWatcher(watcher) {
    Dep.target = watcher;
  }
  notify() {
    addUpdateQueue(this.watchers);
  }
  updateValue(value) {
    this.value = value;
  }

}
export default Dep;