import { getOrderAction, getTeampreviewAction, getEnrollsAction, checkOrderhasCollection } from './api'

const ProcessManageMixin= {
  
  data(){
    return Object.assign( 
      // 余位
      {
        positionTotal: 0, // teampreview的count，产品总数量
        positionLeft: 0,  // 产品余位
      },
      // 价格
      {
        totalPrice: 0,  // 之前总价
        changedPrice: 0, //当前变动
        
      },
      // 订单详情
      {
        enrollsDetailStr: '', // 订单详情,
        guestTotal: 0,  // 总报名数
      },
      {
        disperseOrderDisabled: false, // 直客订单如果存在收款申请或收款通过，则不允许更改 
        // isCancelBtn: false, //取消订单的按钮 收款或通过就禁用
      }
    )
  },

  filters: {
    changedPriceFilter(val){
      if(val> 0) return `+${val}`;
      return val;
    }
  },

  methods: Object.assign(
    
    /**
     * @description: 主干函数
     */
    {
      processManage(orderId){
        getOrderAction(orderId)
        .then(orderDetail => {
          let { planID, guests, favourable, contact, priceType, orderCode, orderChannel}= orderDetail;
          checkOrderhasCollection(orderCode).then(bol => { 
            // 同业 月结 非月结 和直客的一样 只要有收款或者通过就禁用（包括输入框和取消订单的按钮）
            this.disperseOrderDisabled= !bol; 
            // this.isCancelBtn = !bol
            // 同业月结的只要下单了就不可以更改了 orderChannel == 3为直客 settlementType = 1 则是同业月结的 2非月结 取消订单按钮可点击
            // if(orderChannel !== 3 && this.settlementType == 1)  this.disperseOrderDisabled = true
            // 现在是直客和非月结的同业如果存在收款申请或收款通过，则不允许更改 取消订单按钮禁用
            // if(orderChannel == 3 || (orderChannel !== 3 && this.settlementType == 2))  this.disperseOrderDisabled= !bol; 
          })
          Promise.all([
            getEnrollsAction(planID), 
            getTeampreviewAction(planID)
          ])
          .then(res => {
            let [enrollsRes, teampreviewRes]= res;
            contact= JSON.parse(contact);
            this.ruleForm.contactName= contact.Name;
            this.ruleForm.contactPhone= contact.Tel;

            this.globalMount(orderDetail, enrollsRes, teampreviewRes);
            // 兼容旧逻辑
            this.oldLogicAdaptor(orderDetail);
            // 原处理
            this.teampreviewData= teampreviewRes;
            this.positionTotal= teampreviewRes.remaining;
            this.positionLeft= teampreviewRes.remaining;
            this.sourceMaker(enrollsRes, guests);
            // 初始化总价和报名信息
            this.viewDataMaker(favourable, guests);
            
            // 默认执行一次
            this.replenishInfoToastFun(this.orderget.orderChannel);
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
        //console.log(enrolls,'telet');
        //console.log(guests,'all');
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
          // guest的报名类型不存在于当前enrolls
          if(!(key in salePriceReflect)){
            salePriceReflect[key]= [];
            // 手动建立一个过期报名类型
            salePriceReflect[key].enroll= this.passedMaker(guest);
            this.salePrice.push(salePriceReflect[key]);
          };
          // guest的报名类型存在于当前enrolls
          salePriceReflect[key].push(guest); 
        })
        // 这里的el就是上边的salePriceReflect[key]
        this.salePrice.forEach(el => {
          el.enroll && el.enroll.children.push(el);
        });
      },

      viewDataMaker(favourable, guests){
        let price= 0;
        let favourablePrice= 0;
        favourable.forEach(el => favourablePrice+= (el.favMode=== 1? 1: -1)* el.price);
        price= this.enrollDetailMaker();
        this.totalPrice= price+ favourablePrice;
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
        let successed= [];
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
          cb();
        }
        // 当没有配额，且操作后大于剩余数量
        if(!quota && varied> this.positionLeft){
          varied= this.positionLeft;
          this.$message.info(`库存不足，最多新增${ varied }个报名`);
          cb();
        }
  // 结束
  
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
          successed.push(newEnroll);
          // 新增的再提交的时候要赋值相同的 createTime ，用来区分批次
          this.newEnrollList.push(newEnroll);
        }
        this.guestChangedHandler(successed, true);
      },

      enrollMinusChangeHandler(payload){
        let { varied, proto, cb }= payload;
        let result= [...proto].reverse();
        let removed= [];
        let count= varied;
        result= result.filter(el => {
          // 如果还没减够数量，且当前项未填写信息, 则移除该项
          if(varied< 0 && !el.cnName){
            varied++;
            removed.push(el);
            return false;
          } else {
            return true;
          }
        })
        // 没减够数量
        varied< 0 && this.$message.info(`已完善过资料的报名信息，请手动删除`);
        proto.splice(0);
        this.$nextTick(() => proto.push(...result.reverse()));
        this.guestChangedHandler(removed);
      },

      favourableChangeHandler(item){
        let { price, favMode }= item;
        let proto= this.favourableProto.find(el => el.id=== item.id);
        console.log(proto,'fasrf');
        let { price: priceProto, varied: variedProto }= proto;
        let varied= 0;
        // 如果输入不合规，则以旧值(原值加上最后一次改变)还原
        if(this.$isNull(price) || isNaN(parseFloat(price))) return item.price= priceProto + variedProto;
        varied= parseFloat(price)- priceProto;
        this.changedPrice+= (favMode=== 1? 1: -1) * (varied- variedProto);
        // 记录最后一次
        proto.varied= varied;
        
        // 旧逻辑
        this.isSaveBtnClick();
        this.isChangeNumberClick();
        this.replenishInfoToastFun(this.orderget.orderChannel);
      },

      // 报名信息引起的钱数余位变化
      guestChangedHandler(guestArr, isPlus){
        let money= 0;
        let count= 0;
        guestArr.forEach(guest => {
          money+= guest.singlePrice;
          count++;
        });
        this.changedPrice+= (isPlus? 1: -1)* money;
        this.positionLeft+= (isPlus? -1: 1)* count;
        this.$nextTick(() => {
          this.enrollDetailMaker()
          // 旧逻辑
          this.isSaveBtnClick();
          this.isChangeNumberClick();
          this.replenishInfoToastFun(this.orderget.orderChannel);
        });

      },
    },

    /**
     * @description: 辅助函数
     */
    {
      // 记录挂载的全局对象
      globalMount(orderDetail){
        let { priceType, favourable }= orderDetail;
        this.propPriceType= priceType;
        this.favourableProto= this.$deepCopy(favourable).map(el => Object.assign(el, { varied: 0 }));
        // 出行人信息数组的映射
        this.salePriceReflect= {};
        // 新添加的所有报名实例
        this.newEnrollList= [];
        // 过期报名类型
        this.passedMakerCache= {};

        // 应该是关闭时重置，先放到这里
        this.totalPrice= 0; // 之前总价
        this.changedPrice= 0; //当前变动
        this.enrollsDetailStr= ''; // 订单详情
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
          priceType
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
        priceType == 1
          ? (this.priceChange = "直客")
          : (this.priceChange = "同业");
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
          sex: -1,
          idCard: "",
          mobile: "",
          bornDate: 0,
          credType: 0,
          credCode: "",
        }, staticObj)
      },

      // 报名信息
      enrollDetailMaker(){
        let str= '';
        let singlePrice;
        let count= 0;
        let price= 0;
        this.salePrice.forEach(el => {
          let { enrollName, price_01, price_02 }= el.enroll;
          singlePrice= this.propPriceType=== 1? price_01: price_02;
          str+= el.length? `[ ${enrollName} ${this.toDecimal2(singlePrice)} ] x ${el.length}\n`: '';
          price+= singlePrice* el.length;
          count+= el.length;
        })
        this.guestTotal= count;
        this.enrollsDetailStr= str;
        return price;
      },
      
      /**
       * @description: 过期的报名类型，先查 passedMakerCache 里是否有对应的enroll，没有则建立一个带有passed属性enroll
       */
      passedMaker(guest){
        let { enrollID, enrollName, singlePrice }= guest;
        let key= `${enrollName}_${singlePrice}`;
        if(key in this.passedMakerCache) return this.passedMakerCache[key];
        return {
          enrollID, 
          enrollName, 
          price_01: singlePrice,
          price_02: singlePrice,
          children: [],
          passed: true
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
      
      // 手动删除
      removeGuestEmit(payload){
        let { enroll, guest }= payload;
        let removed;
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
          removed= enroll.splice(index, 1);
          this.guestChangedHandler(removed);
        })
      },
      
      // 编辑
      editGuestEmit(guest){
        this.$refs.guestEditDialog.wakeup(guest);
      },

      // 保存信息
      saveGuestEmit(payload){
        let { guest, formData }= payload;
        Object.assign(guest, formData);
      }
    }
  )
}

export default ProcessManageMixin