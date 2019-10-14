/**
 * @description: 错误信息收集mixin
 */

const ErrorHandlerMixin= {
  inject: ['ERROR_QUEUE'],
  // 调用该混入的可以提供错误前缀
  props: {
    errorPrefix: [String]
  },
  methods: {
    /**
     * @description: 收集报错信息，并返回错误实例
     * @returns {Error} 
     */
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