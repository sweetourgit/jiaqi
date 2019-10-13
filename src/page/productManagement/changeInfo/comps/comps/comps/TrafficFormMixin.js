// 组件
import extStopover from './ext-stopover.vue'
// 字典
import { GO_OR_BACK_SIGN } from '../../../dictionary'

const TrafficFormMixin= {
  props: {
    proto: {
      type: Object
    },
    /**
     * @description: 序号，0是去程，判断返程看goOrBack是2，除此之外的都是中转
     */
    rank: [Number]
  },

  components: {
    extStopover,
  },
  
  inject: ['PROVIDE_DAY'],

  mounted(){
    //初始化
    this.init();
  },

  computed:{
    goOrBackSign(){
      // 去程
      if(this.rank=== 0) return GO_OR_BACK_SIGN.GO;
      // 返程
      if(this.submitForm.goOrBack=== 2) return GO_OR_BACK_SIGN.BACK;
      // 中转
      return GO_OR_BACK_SIGN.CENTER;
    }
  },

  methods: {
    /**
     * @description: 初始化
     */
    init(){
      this.submitForm= this.$deepCopy(this.proto);
      this.checkProto= this.$deepCopy(this.proto);
      // 返程需要给day默认值
      if(this.goOrBackSign=== GO_OR_BACK_SIGN.BACK){
        this.submitForm.day= this.PROVIDE_DAY;
        this.checkProto.day= this.PROVIDE_DAY;
      }
    },

    /**
     * @description: 检查是否有数据变动
     */
    checkHasChange(){
      let bol= false;
      bol= !this.$checkLooseEqual(this.submitForm, this.checkProto);
      console.log(this.$refs.extStopoverRef)
      !bol && (bol= this.$refs.extStopoverRef.checkHasChange());
      console.log(`traffic-form checkHasChange: ${bol}`)
      return bol;
    },
    
    /**
     * @description: 添加经停
     */
    addExtStopover(){
      this.$refs.extStopoverRef.addExtStopover()
    },

    /**
     * @description: 切换出行方式
     */
    changeTrafficMode(trafficMode){
      this.$emit('change-traffic-mode', { 
        index: this.rank, 
        goOrBackSign: this.goOrBackSign, 
        trafficMode 
      })
    },
  }
}

export default TrafficFormMixin