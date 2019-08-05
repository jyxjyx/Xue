import Xue from './src/main';
import { XueRouterCls, XueRouterCom } from './src/router';

function HelloWorld2(props) {
  return (<div>hello world2</div>)
}
function HelloWorld1(props) {
  return (<div>hello world1</div>)
}
const router = new XueRouterCls({
  routes: [
    {
      path: '/hello1',
      component: HelloWorld1
    },
    {
      path: '/hello2',
      component: HelloWorld2
    }
  ]
});


let HelloWorld = {
  data() {
    return {
      msg: 'hello world'
    }
  },
  beforeCreate() {
    // setTimeout(() => {
    //   this.msg = 'xixi'
    //   console.log('inner settimout')
    //   console.log(this)
      // this.props.test = 123
    // }, 4000)
  },
  render() {
    return (<div>
      { this.msg }
      { this.props.test }
    </div>)
  }
};
let c = new Xue({
  root: '#app',
  // watch: {
  //   a() {},
  //   b: 123
  // },
  data() {
    return {
      test1: 'i am text1',
      test2: {
        a: 'i am text2 attr a'
      }
    }
  },
  methods: {
    fn1() {
      console.log(this)

      console.log('i am fn1')
    },
    fn2() {
      console.log(this)
      console.log('i am fn2')
    }
  },
  render() {
    return (<div>
      <XueRouterCom options={ router }></XueRouterCom>
      {/* <div>
        i am in father com:{ this.test1 }
      </div> */}
      <HelloWorld test={ this.test1 }></HelloWorld>
      <HelloWorld2 test={ this.test1 }></HelloWorld2>
      { this.test1 }
      <br />
      { this.test2.a }
      <br />
      { this.test1 === 'i am text1' ? 'text1 === "i am text1"' : 'text1 === "i am text1 change"' }
      <br />
      { this.test1 === 'i am text1' ? null : <div>i have been rendered when test1 !== 'i am text1' </div> }

      { this.test1 === 'i am text1' ? <div>i have been rendered when test1 === 'i am text1' </div>: null }

      { this.test1 === 'i am text1' ? 
        <a>
          i am a node when text1 === 'i am text1'
          <span> i am inner span</span>
        </a> : 
        <span>i am a node when text1 === 'i am text1 change'</span>
      }
      <br />
      { this.test1 === 'i am text1' ? 
        <a>i am a node when text1 === 'i am text1'</a> :
        <span>
          i am a node when text1 === 'i am text1 change'
          <span> i am inner</span>
        </span> 
      }
      <br />
      <div onClick={this.test1 === 'i am text1' ? this.fn1 : this.fn2} 
        className={this.test1 === 'i am text1' ? 'cls1' : 'cls2'}>
        my attrs and events will be change
      </div>
    </div>);
  },
  beforeCreate() {
    setTimeout(() => {
      this.test1 = 'i am text1 change';
      // this.test2.a = 'i am text2 attr a change';
      console.log('settimeout');
    }, 3000)
    // setTimeout(() => {
    //   this.test1 = 'i am text1';
    //   this.test2.a = 'i am text2 attr a';
    //   console.log('settimeout');
    // }, 5000)
  }
});

// console.log(c)