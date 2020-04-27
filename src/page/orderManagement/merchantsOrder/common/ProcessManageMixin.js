import { getOrderAction, getTeampreviewAction, getEnrollsAction, orderSaveAction } from './api'

const ProcessManageMixin= {
  
  data(){
    return Object.assign( 
      {
        positionTotal: 0, 
        positionLeft: 0,  
      },
      {
        totalPrice: 0,  
        changedPrice: 0, 
        
      },
      {
        enrollsDetailStr: '',
        guestTotal: 0,  
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
    

    {
      processManage(orderId){
        getOrderAction(orderId)
        .then(orderDetail => {
          console.log(JSON.parse(sessionStorage.getItem('butPermission')))

          let { planID, guests, favourable, contact }= orderDetail;
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
            this.oldLogicAdaptor(orderDetail);
            this.teampreviewData= teampreviewRes;
            this.positionTotal= teampreviewRes.remaining;
            this.positionLeft= teampreviewRes.remaining;
            this.sourceMaker(enrollsRes, guests);
            this.viewDataMaker(favourable, guests);
            
            this.replenishInfoToastFun(this.orderget.orderChannel);
          })
        })
      },


      sourceMaker(enrolls, guests){
        let salePriceReflect= this.salePriceReflect;

        this.salePrice.splice(0);
        this.salePrice.push(
          ...enrolls.map((enroll, index) => {
            let result= [];
            result.enroll= enroll;
            enroll.children= [];
            salePriceReflect[this.enrollKeyMaker(enroll)]= result;
            return result;
          })
        )
        guests.forEach(guest => {
          let { enrollName, singlePrice }= guest;
          let key= `${enrollName}_${singlePrice}`;
          if(!(key in salePriceReflect)){
            salePriceReflect[key]= [];
            salePriceReflect[key].enroll= this.passedMaker(guest);
            this.salePrice.push(salePriceReflect[key]);
          };
          salePriceReflect[key].push(guest); 
        })
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

 
      enrollChangeHandler(payload){
        let { varied }= payload;
        varied > 0? 
          this.enrollPlusChangeHandler(payload): this.enrollMinusChangeHandler(payload)
      },

      enrollPlusChangeHandler(payload){
        let { varied, proto, cb }= payload;
        let enroll= proto.enroll;
        let quota= enroll.quota;
        let currentCount;
        let successed= [];
        if(enroll.passed){
          this.$message.info(`该报名类型已过期，不可新增报名`);
          return cb();
        }
  
        currentCount= this.currentCountHandler(enroll);
        if(quota && currentCount+ varied> quota){
          varied= quota- currentCount;
          this.$message.info(`超过当前报名类型配额，最多新增${ varied }个报名`);
          cb();
        }
        if(!quota && varied> this.positionLeft){
          varied= this.positionLeft;
          this.$message.info(`库存不足，最多新增${ varied }个报名`);
          cb();
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
          successed.push(newEnroll);
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
          if(varied< 0 && !el.cnName){
            varied++;
            removed.push(el);
            return false;
          } else {
            return true;
          }
        })
        varied< 0 && this.$message.info(`已完善过资料的报名信息，请手动删除`);
        proto.splice(0);
        this.$nextTick(() => proto.push(...result.reverse()));
        this.guestChangedHandler(removed);
      },

      favourableChangeHandler(item){
        let { price, favMode }= item;
        let proto= this.favourableProto.find(el => el.id=== item.id);
        let { price: priceProto, varied: variedProto }= proto;
        let varied= 0;
        if(this.$isNull(price) || isNaN(parseFloat(price))) return item.price= priceProto + variedProto;
        varied= parseFloat(price)- priceProto;
        this.changedPrice+= (favMode=== 1? 1: -1) * (varied- variedProto);
        proto.varied= varied;
        this.isSaveBtnClick();
        this.isChangeNumberClick();
        this.replenishInfoToastFun(this.orderget.orderChannel);
      },

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
          this.isSaveBtnClick();
          this.isChangeNumberClick();
          this.replenishInfoToastFun(this.orderget.orderChannel);
        });
      },
    },


    {
      globalMount(orderDetail){
        let { priceType, favourable }= orderDetail;
        this.propPriceType= priceType;
        this.favourableProto= this.$deepCopy(favourable).map(el => Object.assign(el, { varied: 0 }));
        this.salePriceReflect= {};
        this.newEnrollList= [];
        this.passedMakerCache= {};

        this.totalPrice= 0; 
        this.changedPrice= 0; 
        this.enrollsDetailStr= ''; 
      },
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
        this.prePayable= payable;
        priceType == 1
          ? (this.priceChange = "直客")
          : (this.priceChange = "同业");
      },
      
   
      enrollKeyMaker(enroll){
        let { enrollName, price_01, price_02 }= enroll;
        return `${enrollName}_${this.propPriceType=== 1? price_01: price_02}`
      },
           
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