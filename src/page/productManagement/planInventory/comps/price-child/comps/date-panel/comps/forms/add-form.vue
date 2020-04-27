<template>
  <el-dialog :title="vm.isMultiple?'新增计划（多选）':'新增计划'" width="1260px"
    :visible="vm.state"
    :close-on-click-modal="false"
    :before-close="handleClose">
    <div style="width: 100%;">
      <div>
        <el-form
          label-width="120px" 
          ref="submitForm"
          :model="submitForm"
          :rules="rules"
        >
          <el-form-item label="库存类型：" prop="share">
            <el-radio-group v-model="submitForm.share" size="small"
              :disabled="vm.isMultiple"
              @change="shareChange"
            >
              <el-radio :label="2">非共享</el-radio>
              <el-radio :label="1">共享</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="共享库存：" prop="inventoryID" v-if="vm.share=== SHARE_STATE.SHARE">
            <el-select v-model="submitForm.inventoryID" type="date" placeholder="共享库存" style="width: 400px;" size="small"
              @change="selectShareInventory"
            >
              <el-option
                v-for="item in shareOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="countText" prop="count">
            <el-input size="small" style="width: 400px;" placeholder="总库存" :disabled="vm.share=== SHARE_STATE.SHARE"
              v-model="submitForm.count"
            ></el-input>        
          </el-form-item>
          <el-form-item label="预留时长：" prop="dateHous">
            <el-select v-model="submitForm.dateHous" type="date" placeholder="预留时长" style="width: 400px;" size="small">
              <el-option
                v-for="item in 24"
                :key="item"
                :label="item+ '小时'"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报名类型：" prop="enrollName">
            <el-select v-model="submitForm.enrollName" placeholder="最高" size="small">
              <el-option
                v-for="(item, i) in enrollTypeOptions"
                :key="i"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
            <el-button type="primary" size="small" @click="addEnrollCard">添加</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div style="width: 100%; overflow: auto; padding: 20px 20px 0 20px; box-sizing: border-box;">
        <div style="display: flex;">
          <enroll-card ref="enrollRef" 
            v-for="(item, i) in enrollList" 
            :key="i"
            :proto="item"
            :average="vm.average"
          >
            <el-button style="float: right; padding: 3px 0;" type="text" @click="removeEnrollCard(i)">删除</el-button>
          </enroll-card>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="addAction">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import enrollCard from './comps/enroll-card'
import { DAY_STATE as SHARE_STATE } from '../../../../../../dictionary'
import { 
  getInventoryList,  
  getEnrollTypeDictionary, 
  getCostList
} from '../../../../../../planInventory'

export default {
  components: { enrollCard },

  inject: ['poolManager', 'PACKAGE_LIST'],

  props: {
    proto: Object
  },

  computed: {
    countText(){
      return this.vm.share=== SHARE_STATE.SHARE? '剩余库存：': '总库存：'
    }
  },

  data(){
    return Object.assign({
      vm: {
        state: false,
        share: SHARE_STATE.NOT_SHARE,
        isMultiple: false,
        pacId: null,
        average: 0
      },
      enrollList: [],
      shareOptions: [],
      enrollTypeOptions: [],
      submitForm: {
        id: null,
        date: null,
        name: '',
        count: '',
        share: SHARE_STATE.NOT_SHARE,
        dateHous: null,
        inventoryID: null,
        enrollName: null
      },
      rules: {
        inventoryID: { required: true, message: '请选择共享库存', trigger: ['blur']}, 
        share: { required: true, message: '请选择库存类型', trigger: ['blur']},
        name: { required: true, message: '请填写库存名称', trigger: ['blur']},
        count: [
          { required: true, message: '请填写库存', trigger: ['change', 'blur']},
          { required: true, validator: this.positiveIntegerValidator, trigger: ['change', 'blur']},
        ],
        dateHous: { required: true, message: '请选择预留时长', trigger: ['blur']},
      }
    }, {
      linkList: [],
      inventorySuccessList: [],
      errorList: [],
      isMultiple: false
    }, 
    { SHARE_STATE })
  },

  methods: {
    handleOpen(pack){
      let { id, rate }= pack;
      this.selectedList= this.poolManager.getSelected();
      this.vm.isMultiple= this.selectedList.length> 1;
      getEnrollTypeDictionary().then(res => {
        this.enrollTypeOptions.push(...res);
      });
      this.vm.rate= rate;
      this.vm.pacId= id;
      this.vm.average= this.poolManager.getAverage();
      this.vm.state= true;
    },

    handleClose(){
      this.enrollList.splice(0);  
      this.shareOptions.splice(0);  
      this.enrollTypeOptions.splice(0); 
      this.inventorySuccessList.splice(0); 
      this.linkList.splice(0) 
      this.errorList.splice(0); 
      this.vm.average= 0;
      this.vm.share= SHARE_STATE.NOT_SHARE; 
      this.vm.state= false;
      this.vm.pacId= null;
      this.vm.rate= 0;
      this.$refs.submitForm.resetFields();  
    },

    shareChange(bol){
      this.$refs.submitForm.resetFields();
      this.submitForm.share= bol;
      if(bol=== SHARE_STATE.NOT_SHARE){
        this.setAverage(this.poolManager.getAverage());
        return this.vm.share= SHARE_STATE.NOT_SHARE;
      }
      this.setAverage(0);
      if(this.shareOptions.length) return this.vm.share= bol;
      let { dayInt }= this.poolManager.currentDay;
      getInventoryList({ share: SHARE_STATE.SHARE, date: dayInt }).then(res => {
        this.shareOptions.push(...res)
        this.vm.share= SHARE_STATE.SHARE;
      })
    },
    
    selectShareInventory(shareId){
      let hit= this.shareOptions.find(share => share.id=== shareId);
      if(!hit) return;
      console.log(hit)
      let { count, averageCost }= hit;
      this.submitForm.count= count;
      this.getCostExceptPlane(averageCost)
    },

    addEnrollCard(){
      let name= this.submitForm.enrollName;
      if(!name) return this.$message.error('请先选择报名类型');
      if(this.checkEnrollTypeExists(name)) return this.$message.error('报名类型已存在');
      let enrollDate= this.enrollTypeOptions.find(enroll => enroll.name=== name);
      let newEnroll= this.getEnrollDTO(name, enrollDate.id);
      this.enrollList.push(newEnroll);
    },
    
    removeEnrollCard(i){
      let left= this.getEnrollRefs().map(enrollRef => enrollRef.getData());
      left.splice(i, 1);
      this.enrollList.splice(0);
      this.$nextTick(() => {
        this.enrollList.push(...left);
      })
    },

    checkEnrollTypeExists(name){
      let enrollRefs= this.getEnrollRefs();
      let hit= enrollRefs.find(enrollRef => enrollRef.submitForm.enrollName=== name);
      return hit;
    },

    positiveIntegerValidator(rule, value, cb){
      let reg= /^(0|[1-9][0-9]*)$/;
      if(!reg.test(value)) return cb(new Error('库存必须为正整数'));
      if(parseInt(value)< this.vm.saled) return cb(new Error('库存不能小于已售数量'));
      cb();
    },

    moneyValidator(rule, value, cb){
      let reg= /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
      if(reg.test(value)) return cb();
      cb(new Error('请输入正确的价格格式，最多两位小数'));
    },

 
    getSubmitDate(){
      let copy;
      this.$refs.submitForm.validate(validate => {
        if(!validate) return;
        let staticObj= { share: 1, orgID: 0 };
        let { date }= this.submitForm;
        let dateInt= date.getFullYear()* 10000+ 
                      (date.getMonth()+ 1)* 100+
                        date.getDate();
        copy= Object.assign(this.$deepCopy(this.submitForm), staticObj);
        copy.date= dateInt;
        copy.count= parseFloat(copy.count);
        copy.averageCost= parseFloat(copy.averageCost);
      })
      return copy? Object.assign(this.$deepCopy(this.proto), copy): copy;
    },

   
    addAction(){
      if(!this.validate()) return console.error('validator errors');
      // 清空enrollCache
      //  this.getEnrollRefs().map(enrollRef => enrollRef.getData());
      if(this.vm.share=== SHARE_STATE.SHARE) return this.shareAddAction();
      return this.notShareAddAction().then(res => {
        this.handleClose();
        this.$message.success('添加成功');
        setTimeout(() => this.$emit('refresh'), 1200);
      });
    },

    shareAddAction(){
      let day= this.poolManager.currentDay;
      let inventoryID= this.submitForm.inventoryID;
      this.addPlanAction(inventoryID, day)
      .then(res => {
        if(!res) return this.$message.success('添加失败');
        this.handleClose();
        this.$message.success('添加成功');
        this.$emit('refresh');
      });
    },

    

    notShareAddAction(){
      this.linkList.push(...this.poolManager.getSelected());
      this.isMultiple= this.linkList.length> 1;
      if(this.isMultiple){
        this.$message.warning('批量添加中，耐心等候，请勿操作！');
        this.linkList.forEach(el => el.savingState= 'waiting');
        this.vm.state= false;
      }
      return new Promise((resolve, reject) => {
        let func= (planBol) => {
          if(!planBol) console.log(this.dayInloop); 

          if(this.linkList.length=== 0 && this.errorList.length=== 0) return resolve();
          let day= (this.linkList.pop() || this.errorList.pop());
          this.savingState(day, 'saving');
          this.dayInloop= day;
          this.addInventoryAction(day)
          .then(inventoryID => {
            if(!inventoryID){
              return Promise.resolve();
            }
            return this.addPlanAction(inventoryID, day)
          })
          .then(func);
        }
        func(true)
      })
    },

 
    addInventoryAction(day){
      let hit= this.inventorySuccessList.find(el => el.day.dayInt=== day.dayInt);
      if(hit) return Promise.resolve(hit.inventoryID);
      return this.linkAddInventory({
        name: '',
        count: this.submitForm.count,
        share: SHARE_STATE.NOT_SHARE,
        date: day.dayInt
      }, day)
    },


    addPlanAction(inventoryID, day){
      let plan= this.getPlanDTO(inventoryID, day.dayInt);
      return this.linkAddPlan(plan, day)
    },

    validate(){
      let bol= true;
      this.$refs.submitForm.validate(validate => {
        if(!validate) return bol= false;
        bol= this.childrenValidate();
      })
      return bol;
    },

    childrenValidate(){
      let bol= true;
      let enrollRefs= this.getEnrollRefs()
      if(enrollRefs.length=== 0){
        this.$message.info('最少包含一条报名类型');
        return false;
      }
      enrollRefs.forEach(enrollRef => {
        if(bol) bol= enrollRef.validate();
      })
      return bol;
    },

    getEnrollRefs(){
      return this.$refs.enrollRef || [];
    },

    getPlanDTO(inventoryID, dayInt){
      let currentPac= this.PACKAGE_LIST.find(pac => pac.selected);
      let { id, codePrefix, codeSuffix }= currentPac;
      return {
        createTime: 0,
        inventoryID,
        packageID: id,
        date: dayInt,
        groupCode: `${codePrefix}-${dayInt}-${codeSuffix}`,
        planEnroll: this.getEnrollRefs().map(enrollRef => enrollRef.getData()),
        regimentType: 1,
        dateHous: this.submitForm.dateHous
      }
    },

    getEnrollDTO(enrollName, enrollID, planID){
      let newEnroll= {
        enrollID,
        enrollName,
        price_01: null,
        price_02: null,
        price_03: null,
        price_04: 0,
        quota: 0
      };
      if(planID) newEnroll.planID= planID;
      return newEnroll;
    },

    linkAddInventory(object, day){
      return new Promise((resolve, reject) => {
        this.$http.post(this.GLOBAL.serverSrc + "/team/api/inventoryinsert", {
          object
        }).then((res) => {
          let { isSuccess, id }= res.data;
          if(!isSuccess) return resolve(this.linkFailCb(day));
          
          this.inventorySuccessList.push({ day, inventoryID: id })
          return resolve(id);
        }).catch((err) => {
          resolve(this.linkFailCb(day));
        })
      })
    },

    linkAddPlan(object, day){
      return new Promise((resolve, reject) => {
        this.$http.post(this.GLOBAL.serverSrc + "/team/plan/api/insert",{
          object
        }).then((res) => {
          let { isSuccess }= res.data;
          if(!isSuccess) return resolve(this.linkFailCb(day));
          this.savingState(day, 'success');
          return resolve(true);
        }).catch((err) => {
          resolve(this.linkFailCb(day));
        })
      })
    },

    linkFailCb(day){
      this.savingState(day, 'error');
      this.errorList.push(day);
      return false;
    },

    savingState(day, state){
      if(!this.isMultiple) return;
      day.savingState= state;
    },

    getCostExceptPlane(averageCost){
      let pacId= this.vm.pacId;
      let rate= this.vm.rate;
      return new Promise((resolve, reject) => {
        getCostList(pacId).then(res => {
          let sum= averageCost;
          res.forEach(el => {
            if(el.supplierType=== 2) return;
            sum+= el.money;
          })
          sum= sum/(1- rate/100);
          this.setAverage(parseFloat(sum.toFixed(2)));
        })
      })
    },

    setAverage(average){
      this.vm.average= average;
      this.getEnrollRefs().forEach(enrollRef => enrollRef.$forceUpdate());
    },
  }
}
</script>