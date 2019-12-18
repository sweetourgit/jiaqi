import { getOrderAction, getTeampreviewAction, getEnrollsAction } from './api'

const ProcessManageMixin= {
  
  data(){
    return Object.assign(
      {
        positionTotal: 0, // teampreview的count，产品总数量
        positionLeft: 0,  // 产品余位
      },
      {
        //salePrice: [], // 数据源
      }
    )
  },

  methods: {
    processManage(orderId){
      getOrderAction(orderId)
      .then(orderDetail => {
        let { 
          planID, // 计划id 
          guests, // 报名数组
          priceType, // 价格类型 1直客 2同业
        }= orderDetail;
        Promise.all([
          getEnrollsAction(planID), 
          getTeampreviewAction(planID)
        ])
        .then(res => {
          let [enrollsRes, teampreviewRes]= res;
          // 兼容旧逻辑
          this.oldLogicAdaptor(orderDetail);
          // 原处理
          this.teampreviewData= teampreviewRes;
          // 计算余位
          this.sourceMaker(enrollsRes, guests, priceType)
        })
      })
    },

    // 兼容旧逻辑
    oldLogicAdaptor(orderDetail){
      let {
        planID,
        payable,
        favourable,
        orderStatus,
        endTime,
        occupyStatus,
        orderChannel,
        contact,
      }= orderDetail;
      this.payable = payable;
      this.ruleForm.favourable = favourable;
      this.getOrderStatus(
        orderStatus,
        endTime,
        occupyStatus,
        orderChannel
      );
      this.occupyStatus= occupyStatus;
      this.Timechange(endTime);
      this.ruleForm.contactName= JSON.parse(
        contact
      ).Name;
      this.ruleForm.contactPhone= JSON.parse(
        contact
      ).Tel;
      this.orderSourceFun(orderChannel);
      this.dialogFormProcess = true;
      // this.teampreview(planID);
      // 记录最开始的总价 isSaveBtnClick需要
      this.prePayable= payable;
      this.showEnrollDetail();
    },

    /**
     * @description: 制作数据源
     * @param {Array} enrolls: 计划的所有报名类型
     * @param {Array} guests: 已报名的信息
     * @param {Numer} priceType: 价格类型 1直客 2同业 
     * @return: 
     */
    sourceMaker(enrolls, guests, priceType){
      // 创建出行人信息数组的映射并挂载到全局
      let salePriceReflect= {};
      this.salePriceReflect= salePriceReflect;

      this.salePrice.splice(0);
      this.salePrice.push(
        ...enrolls.map((enroll, index) => {
          let result= [];
          // enrollName 用于共享配额
          result.enrollName= enroll.enrollName;
          salePriceReflect[this.enrollKeyMaker(enroll, priceType)]= result;
          return result;
        })
      )
      guests.forEach(guest => {
        let { enrollName, singlePrice }= guest;
        let key= `${enrollName}_${singlePrice}`;
        if(!key in salePriceReflect){
          salePriceReflect[key]= [];
          salePriceReflect[key].enrollName= enrollName;
        };
        salePriceReflect[key].push(guest);  
      })
      console.log(this.salePrice);
      
    },
    
    /**
     * @description: 根据报名类型和价格类型返回key
     */
    enrollKeyMaker(enroll, priceType){
      let { enrollName, price_01, price_02 }= enroll;
      return `${enrollName}_${priceType=== 1? price_01: price_02}`
    },

    /**
     * @description: enroll变化处理
     * @param {Object} payload: varied 变动大小， proto 哪个变了 
     * @return: 
     */
    enrollChangeHandler(payload){
      let { varied }= payload;
      varied > 0? 
        this.enrollPlusChangeHandler(payload): this.enrollMinusChangeHandler(payload)
    },

    enrollPlusChangeHandler(payload){
      let { varied, proto }= payload;
      
    },

    changeQuota() {
      //余位变化方法
      this.salePrice = JSON.parse(JSON.stringify(this.salePriceNum));
      let salePriceType = {};
      // 实时减少相关余位信息，提示库存不足
      //判断下单时  是否是预订占位 如果是则余位不变
      if (this.orderget.occupyStatus !== 1 || this.orderget.orderStatus !== 0) {
        for (let i = 0; i < this.salePrice.length; i++) {
          // this.salePrice[i].quota = parseInt(this.salePrice[i].quota) - parseInt(this.enrolNum[i]);
          this.salePrice[i].quota =
            parseInt(this.salePrice[i].quota) - parseInt(this.enrolNum[i]);
          salePriceType = this.salePrice[i];
          // if (salePriceType.quota < 0) {
          //   //判断是否显示库存不足
          //   this.quota[i] = true;
          // } else {
          //   this.quota[i] = false;
          // }
          if (this.enrolNum[i] == undefined) {
            this.enrolNum[i] = "";
          }
          if (salePriceType.quota === -1) {
            salePriceType.quota = 0;
          }
        }
      }
    },
  }

}

export default ProcessManageMixin