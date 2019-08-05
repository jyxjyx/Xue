import Xue from '../main';
import warn from '../utils/warn';

export const XueRouterCom = {
  render() {
    const Current = this.props.options.getCurrentCom();
    return (
      <div>
        <Current></Current>
      </div>
    );
  }
};

export class XueRouterCls {
  current = null;
  refresh = () => {
    const currentPath = this.getRoute();
    const currentRoute = this.routes.find(item => item.path === currentPath);
    if(!currentRoute) return warn(`no such route ${ currentPath }, this page's route is ${ this.current.path }`);
    this.current = currentRoute;
  }
  constructor({ routes, type = 'hash' }) {
    this.routes = routes;
    this.type = type;
    this.current = routes[0];
    this.refresh();
    window.addEventListener('hashchange', this.refresh, false);
  }
  getCurrentCom() {
    return this.current && this.current.component;
  }
  getRoute() {
    if(this.type === 'hash')
      return location.hash.slice(1);
  }
};