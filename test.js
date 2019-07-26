import Xue from './src/main';
let a = <div className='class_a'>hahaha</div>
console.log(a)
let c = new Xue({
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
    fn1() {}
  },
  render() {
    return (<div>
      { this.test }
      { this.test2.a }
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