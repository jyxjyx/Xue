import { addUpdateQueue } from '../utils/queue';

let id = 0;

class Dep {
  static target = null;
  constructor() {
    this.id = id++;
    this.watchers = [];
  }
  depend() {
    const watcherIds = this.watchers.map(item => item.id);
    if(Dep.target && !watcherIds.includes(Dep.target.id)) this.watchers.push(Dep.target);
  }
  changeWatcher(watcher) {
    Dep.target = watcher;
  }
  notify() {
    debugger
    addUpdateQueue(this.watchers);
  }
}
export default Dep;