// 组件
import extStopover from '../ext-stopover.vue'
// 字典
import { TRAFFIC_MODE_OPTIONS, ARRIVE_DAY_OPTIONS, GO_OR_BACK_SIGN } from '../../../../dictionary'

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

  data(){
    return Object.assign({
      submitForm: {},
      rules: {
        trafficMode: [{ required: true, trigger: 'blur' }],
        company: [{ required: true, validator: this.simpleValidator, message: '航空公司不能为空', trigger: 'blur' }],
        theNumber: [{ required: true, validator: this.simpleValidator, message: '航班号不能为空', trigger: 'blur' }],
        podCity:[{ required: true, validator: this.simpleValidator, message: '出发城市不能为空', trigger: 'blur' }],
        podPlace: [{ required: true, validator: this.simpleValidator, message: '出发机场不能为空', trigger: 'blur' }],
        podTime: [{ required: true, validator: this.timeValidator, message: '出发时间不能为空', trigger: 'blur' }],
        arriveCity: [{ required: true, validator: this.simpleValidator, message: '到达城市不能为空', trigger: 'blur' }],
        arrivePlace: [{ required: true, validator: this.simpleValidator, message: '到达机场不能为空', trigger: 'blur' }],
        arriveTime: [{ required: true, validator: this.timeValidator, message: '到达时间不能为空', trigger: 'blur' }],
        trafficMode: [{ required: true, validator: this.simpleValidator, message: '不能为空', trigger: 'blur' }],
        day: [{ required: true, validator: this.simpleValidator, message: '请选择天数', trigger: 'blur'}],
      }
    }, { TRAFFIC_MODE_OPTIONS, ARRIVE_DAY_OPTIONS })
  },

  methods: {
    /**
     * @description: 初始化
     */
    init(){
      this.submitForm= this.$deepCopy(this.proto);
      //返程需要给day默认值
      if(this.goOrBackSign=== GO_OR_BACK_SIGN.BACK){
        this.submitForm.day= this.PROVIDE_DAY;
      }
      this.checkProto= this.$deepCopy(this.submitForm);
    },

    /**
     * @description: 添加经停
     */
    addExtStopover(){
      this.$refs.extStopoverRef && this.$refs.extStopoverRef.addExtStopover()
    },

    /**
     * @description: 检查是否有数据变动
     */
    checkHasChange(){
      let bol= false;
      bol= !this.$checkLooseEqual(this.submitForm, this.checkProto);
      !bol && this.$refs.extStopoverRef && (bol= this.$refs.extStopoverRef.checkHasChange());
      bol && console.log(`traffic-form checkHasChange: ${bol}`)
      return bol;
    },

    validate(){
      let bol= true;
      this.$refs.submitForm.validate(validate => bol= validate);
      bol && this.$refs.extStopoverRef && (bol= this.$refs.extStopoverRef.validate());
      return bol;
    },

    timeValidator(rule, value, cb){
      // timepicker空间空值返回的是“null”
      if(!value || value=== "null") return cb(this.makeErrorQueueMsg(rule.message));
      cb();
    },
    
    /**
     * @description: 获取数据
     */
    getData(){
      let data= this.submitForm;
      if(this.$refs.extStopoverRef){
        data.ext_Stopover= this.$refs.extStopoverRef.getData();
      }
      return data;
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