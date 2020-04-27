

const ErrorHandlerMixin= {
  inject: ['ERROR_QUEUE'],
  props: {
    errorPrefix: [String]
  },
  methods: {

    makeErrorQueueMsg(msg){
      let prefix= this.errorPrefix? this.errorPrefix: '';
      let sign= this.$vnode.tag;
      let hit= this.ERROR_QUEUE.find(el => el.sign=== sign);
      if(!hit) this.ERROR_QUEUE.push({ sign, msgs:[prefix+ msg] });
      if(hit){
        hit.msgs.find(el => el=== msg) || hit.msgs.push(prefix+ msg);
      }
      return new Error(msg);
    },


    simpleValidator(rule, value, cb){
      if(!value) return cb(this.makeErrorQueueMsg(rule.message));
      cb();
    }
  }
}

export default ErrorHandlerMixin