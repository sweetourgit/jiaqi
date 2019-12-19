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
          // propPriceType来自processManage
          this.propPriceType= priceType;
          this.globalMount();
          let [enrollsRes, teampreviewRes]= res;
          // 兼容旧逻辑
          this.oldLogicAdaptor(orderDetail);
          // 原处理
          this.teampreviewData= teampreviewRes;
          // 计算余位
          this.sourceMaker(enrollsRes, guests)
        })
      })
    },

    // 记录挂载的全局对象
    globalMount(){
      // 出行人信息数组的映射
      this.salePriceReflect= {};
      // 新添加的所有报名实例
      this.newEnrollList= [];
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
      this.orderget = orderDetail;
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
     * @return: 
     */
    sourceMaker(enrolls, guests){
      let salePriceReflect= this.salePriceReflect;

      this.salePrice.splice(0);
      this.salePrice.push(
        ...enrolls.map((enroll, index) => {
          let result= [];
          result.enroll= enroll;
          // 收集所有相同报名类型的实例，只有当前存在的报名类型需要这个属性，不存在的报名类型肯定不可以新增实例了
          enroll.children= [];
          salePriceReflect[this.enrollKeyMaker(enroll)]= result;
          return result;
        })
      )
      guests.forEach(guest => {
        let { enrollName, singlePrice }= guest;
        let key= `${enrollName}_${singlePrice}`;
        /**
         * @description: 不知道存不存在这个情况，过去有一个报名类型，但是现在没有了，这个时候hitEnroll为undefined
         */
        let hitEnroll= enrolls.find(el => el.enrollName=== enrollName);
        // guest的报名类型不存在于当前enrolls
        if(!key in salePriceReflect){
          salePriceReflect[key]= [];
          salePriceReflect[key].enroll= hitEnroll;
          this.salePrice.push(salePriceReflect[key]);
        };
        // guest的报名类型存在于当前enrolls
        salePriceReflect[key].push(guest);  
      })
      // 这里的el就是上边的salePriceReflect[key]
      this.salePrice.forEach(el => {
        el.enroll && el.enroll.children.push(el);
      })
    },
    
    /**
     * @description: 根据报名类型和价格类型返回key
     */
    enrollKeyMaker(enroll){
      let { enrollName, price_01, price_02 }= enroll;
      return `${enrollName}_${this.propPriceType=== 1? price_01: price_02}`
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
    
    // 未考虑余位情况
    enrollPlusChangeHandler(payload){
      let { varied, proto }= payload;
      let enroll= proto.enroll;
      console.log(varied, proto)
      // 计算剩余位置逻辑
      
      // 计算剩余位置逻辑
      let staticObj= {
        orderID: this.orderget.id,
        orderCode: this.orderget.orderCode,
        orgID: this.orderget.orgID,
        userID: this.orderget.userID,
        productType: this.orderget.productTyp
      }
      console.log(staticObj)
      for(let i= 0; i< varied; i++){
        let newEnroll= this.enrollMaker(enroll, staticObj)
        proto.push(newEnroll);
        this.newEnrollList.push(newEnroll);
      }
    },

    enrollMinusChangeHandler(payload){
      let { varied, proto }= payload;
      let result= proto.splice(0);
      this.$nextTick(() => { proto.push(...result) })
    },

    /**
     * @description: 穿件新的报名实例，在提交时统一赋值createTime，根据createTime区分添加批次
     * @param {Object} enroll: { enrollID, enrollName, singlePrice }
     * @param {Object} staticObj: { orderID, orderCode, orgID, userID, productType }
     * @return: 
     */            
    enrollMaker(enroll, staticObj){
      let { enrollID, enrollName, price_01, price_02 }= enroll;
      return Object.assign({
        enrollID,
        enrollName,
        singlePrice: this.propPriceType=== 1? price_01: price_02,
        createTime: null,
        id: 0,
        isDeleted: 0,
        code: "",
        cnName: "",
        enName: "",
        sex: null,
        idCard: "",
        mobile: "",
        bornDate: 0,
        credType: 0,
        credCode: "",
      }, staticObj)
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