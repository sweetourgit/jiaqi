import { getOrderAction, getTeampreviewAction, getEnrollsAction } from './api'

const ProcessManageMixin= {
  
  data(){
    return Object.assign( 
      {
        positionTotal: 0, // teampreview的count，产品总数量
        positionLeft: 0,  // 产品余位
      },
      {
        
      }
    )
  },

  methods: Object.assign(
    // 主干函数
    {
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
            this.positionTotal= teampreviewRes.count;
            this.sourceMaker(enrollsRes, guests)
          })
        })
      },

      /**
       * @description: 制作数据源
       * @param {Array} enrolls: 计划的所有报名类型
       * @param {Array} guests: 已报名的信息
       * @return: 
       */
      sourceMaker(enrolls, guests){
        let count= 0;
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
          // 不知道存不存在这个情况，过去有一个报名类型，但是现在没有了，这个时候hitEnroll为undefined
          let hitEnroll= enrolls.find(el => el.enrollName=== enrollName);
          // guest的报名类型不存在于当前enrolls
          if(!(key in salePriceReflect)){
            salePriceReflect[key]= [];
            // 如果hitEnroll不存在，则手动建立一个过期报名
            salePriceReflect[key].enroll= hitEnroll || this.passedMaker(salePriceReflect[key]);
            this.salePrice.push(salePriceReflect[key]);
          };
          // guest的报名类型存在于当前enrolls
          salePriceReflect[key].push(guest);  
        })
        // 这里的el就是上边的salePriceReflect[key]
        this.salePrice.forEach(el => {
          count+= el.length;
          el.enroll && el.enroll.children.push(el);
        })
        this.positionLeft= this.positionTotal- count;
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
        // 这里的proto是salePrice的一项, cb为数据矫正
        let { varied, proto, cb }= payload;
        let enroll= proto.enroll;
        let quota= enroll.quota;
        // 当前enroll已报名的数量
        let currentCount;
        console.log(varied, proto)
        // 如果enroll有过时标志，表示是现在enroll列表中不存在的项，不可以添加新报名信息
        if(enroll.passed){
          this.$message.info(`该报名类型已过期，不可新增报名`);
          return cb();
        }
  
  // 计算剩余位置逻辑
        currentCount= this.currentCountHandler(enroll);
        // 当有配额，且操作后大于配额
        if(quota && currentCount+ varied> quota){
          varied= quota- currentCount;
          this.$message.info(`超过当前报名类型配额，最多新增${ varied }个报名`);
        }
        // 当没有配额，且操作后大于剩余数量
        if(!quota && varied> this.positionLeft){
          varied= this.positionLeft;
          this.$message.info(`库存不足，最多新增${ varied }个报名`);
        }
  
        let staticObj= {
          orderID: this.orderget.id,
          orderCode: this.orderget.orderCode,
          orgID: this.orderget.orgID,
          userID: this.orderget.userID,
          productType: this.orderget.productTyp
        }
        for(let i= 0; i< varied; i++){
          let newEnroll= this.enrollMaker(enroll, staticObj)
          proto.push(newEnroll);
          this.newEnrollList.push(newEnroll);
        }
        // 处理余位
        this.positionLeft-= varied;
      },

      enrollMinusChangeHandler(payload){
        let { varied, proto, cb }= payload;
        let result= [...proto].reverse();
        let count= varied;
        result= result.filter(el => {
          // 如果还没减够数量，且当前项未填写信息, 则移除该项
          if(varied< 0 && !el.cnName){
            varied++;
            return false;
          } else {
            return true;
          }
        })
        // 没减够数量
        varied< 0 && this.$message.info(`已完善过信息的报名，请手动删除`);
        proto.splice(0);
        this.$nextTick(() => proto.push(...result.reverse()));
        // 处理余位
        this.positionLeft+= varied- count;
      },
    },

    // 辅助函数
    {
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
       * @description: 根据报名类型和价格类型返回key
       */
      enrollKeyMaker(enroll){
        let { enrollName, price_01, price_02 }= enroll;
        return `${enrollName}_${this.propPriceType=== 1? price_01: price_02}`
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

      passedMaker(guest){
        let { enrollID, enrollName, singlePrice }= guest;
        return {
          enrollID, 
          enrollName, 
          price_01: singlePrice,
          price_02: singlePrice,
        }
      },

      // 计算enroll下已报名的数量
      currentCountHandler(enroll){
        let num= 0;
        enroll.children.forEach(child => num+= child.length);
        return num;
      },

      getShowName(item){
        return item.enroll && item.enroll.enrollName
      },

      getShowPrice(item){
        let { price_01, price_02 }= item.enroll;
        return this.toDecimal2(this.propPriceType=== 1? price_01: price_02);
      },

      removeGuestEmit(payload){
        let { enroll, guest }= payload;
        console.log(enroll, guest )
        new Promise((resolve, reject) => {
          if(!guest.cnName) return resolve();
          return this.$confirm(`确定要删除当前报名信息吗?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            resolve();
          }).catch(() => {
            reject();
          })
        }).then(() => {
          let index= enroll.findIndex(el => el=== guest);
          enroll.splice(index, 1);
          this.positionLeft++;
        })
      },

      editGuestEmit(guest){
        this.$refs.guestEditDialog.wakeup(guest);
      },

      saveGuestEmit(payload){
        let { guest, formData }= payload;
        Object.assign(guest, formData);
      }
    }
  )
}

export default ProcessManageMixin