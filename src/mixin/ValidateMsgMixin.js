/**
 * @description: 错误信息收集mixin
 */

const ValidateMsgMixin= {
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
      msg= (this.errorPrefix? this.errorPrefix: '')+ msg;
      let sign= this.$vnode.tag;
      let hit= this.ERROR_QUEUE.find(el => el.sign=== sign);
      !hit && this.ERROR_QUEUE.push({ sign, msgs:[msg] });
      hit && (hit.msgs.find(el => el=== msg) || hit.msgs.push(msg));
      return new Error(msg);
    },

    /**
     * @description: 简单校验
     */
    simpleValidator(rule, value, cb){
      let { message }= rule;
      if(!value) return cb(this.makeErrorQueueMsg(message));
      cb();
    }
  }
}

export default ValidateMsgMixin