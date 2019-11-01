const ErrorHandlerMixin= {
  inject: ['ERROR_QUEUE'],
  methods: {
    /**
     * @description: 收集报错信息，并返回错误实例
     * @returns {Error} 
     */
    makeErrorQueueMsg(msg){
      let sign= this.$vnode.tag;
      let hit= this.ERROR_QUEUE.find(el => el.sign=== sign);
      if(!hit) this.ERROR_QUEUE.push({ sign, msgs:[msg] });
      if(hit){
        hit.msgs.find(el => el=== msg) || hit.msgs.push(msg);
      }
      return new Error(msg);
    },

    /**
     * @description: 简单校验
     */
    simpleValidator(rule, value, cb){
      if(!value) return cb(this.makeErrorQueueMsg(rule.message));
      cb();
    }
  }
}

export default ErrorHandlerMixin