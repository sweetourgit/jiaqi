import extStopover from '../ext-stopover.vue'
import { TRAFFIC_MODE_OPTIONS, ARRIVE_DAY_OPTIONS, GO_OR_BACK_SIGN } from '../../../../dictionary'

const TrafficFormMixin= {
  props: {
    proto: {
      type: Object
    },

    rank: [Number]
  },

  components: {
    extStopover,
  },
  
  inject: ['PROVIDE_DAY'],

  mounted(){
    this.init();
  },

  computed:{
    goOrBackSign(){
      if(this.rank=== 0) return GO_OR_BACK_SIGN.GO;
      if(this.submitForm.goOrBack=== 2) return GO_OR_BACK_SIGN.BACK;
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

    init(){
      this.submitForm= this.$deepCopy(this.proto);

      this.checkProto= this.$deepCopy(this.submitForm);
    },

    addExtStopover(){
      this.$refs.extStopoverRef && this.$refs.extStopoverRef.addExtStopover()
    },

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
      if(!value || value=== "null") return cb(this.makeErrorQueueMsg(rule.message));
      cb();
    },
    

    getData(){
      let data= this.submitForm;
      if(this.$refs.extStopoverRef){
        data.ext_Stopover= this.$refs.extStopoverRef.getData();
      }
      return data;
    },


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