import Xue from './src/main';
let a = <div className='class_a'>hahaha</div>
console.log(a)
let c = new Xue({
  root: '#app',
  watch: {
    a() {},
    b: 123
  },
  data() {
    return {
      test: 1,
      test2: {
        a: 1
      }
    }
  },
  methods: {
    fn1() {
      console.log('i have been clicked')
    }
  },
  render() {
    return (<div>
      { this.test }
      { this.test2.a }
      
      <div onClick={this.fn1} onclass='c1' className='c2'>div1<div>div3</div></div>
      <div>div2</div>

    </div>);
  },
  beforeCreate() {
    setTimeout(() => {
      this.test = 2;
      this.test2.a = 2;
      console.log(this.$data)
    }, 3000)
  }
});

console.log(c)