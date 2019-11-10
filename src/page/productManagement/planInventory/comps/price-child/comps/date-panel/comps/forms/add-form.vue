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
  getInventoryList, // 获取指定天的所有共享库存 
  getEnrollTypeDictionary, // 获取报名类型字典
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
        
      },
      // 新增plan
      enrollList: [],
      // 共享库存列表
      shareOptions: [],
      // 报名类型列表
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
      // 处理递归添加逻辑
      linkList: [],
      inventorySuccessList: [],
      errorList: [],
      // 是否是多个添加
      isMultiple: false
    }, 
    { SHARE_STATE })
  },

  methods: {
    handleOpen(){
      // 得到所有选中
      this.selectedList= this.poolManager.getSelected();
      // 判断当前是否是多选状态
      this.vm.isMultiple= this.selectedList.length> 1;
      getEnrollTypeDictionary().then(res => {
        this.enrollTypeOptions.push(...res);
      });
      this.vm.state= true;
    },

    handleClose(){
      this.enrollList.splice(0);  // 清空子列
      this.shareOptions.splice(0);  // 清空共享库存表单
      this.enrollTypeOptions.splice(0); // 报名类型
      this.inventorySuccessList.splice(0); // 成功队列
      this.linkList.splice(0) // 总队列
      this.errorList.splice(0); // 错误队列
      this.vm.share= SHARE_STATE.NOT_SHARE; //重置共享状态
      this.$refs.submitForm.resetFields();  // 重置表单
      this.vm.state= false;
    },

    // 改变库存类型
    shareChange(bol){
      this.$refs.submitForm.resetFields();
      this.submitForm.share= bol;
      // 从共享到非共享 直接返回
      if(bol=== SHARE_STATE.NOT_SHARE) return this.vm.share= SHARE_STATE.NOT_SHARE;
      // 如果已经获取过该天共享库存，则返回
      if(this.shareOptions.length) return this.vm.share= bol;
      let { dayInt }= this.poolManager.currentDay;
      getInventoryList({ share: SHARE_STATE.SHARE, date: dayInt }).then(res => {
        this.shareOptions.push(...res)
        this.vm.share= SHARE_STATE.SHARE;
      })
    },
    
    // 选择了一条共享库存
    selectShareInventory(shareId){
      let hit= this.shareOptions.find(share => share.id=== shareId);
      if(!hit) return;
      let { count }= hit;
      this.submitForm.count= count;
    },

    // 添加一个报名
    addEnrollCard(){
      let name= this.submitForm.enrollName;
      if(!name) return this.$message.error('请先选择报名类型');
      if(this.checkEnrollTypeExists(name)) return this.$message.error('报名类型已存在');
      let enrollDate= this.enrollTypeOptions.find(enroll => enroll.name=== name);
      let newEnroll= this.getEnrollDTO(name, enrollDate.id);
      this.enrollList.push(newEnroll);
    },
    
    // 删除一个enroll
    removeEnrollCard(i){
      let left= this.getEnrollRefs().map(enrollRef => enrollRef.getData());
      left.splice(i, 1);
      this.enrollList.splice(0);
      this.$nextTick(() => {
        this.enrollList.push(...left);
      })
    },

    // 检查报名类型是否存在
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

    /**
     * @description: 先验证，不通过返回false，通过则将submit变形成提交的格式 
     */
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

    /**
     * @description:
     * 1. 共享库存：直接新增计划，且每次只能一个
     * 2. 非共享库存：先新增库存再新增计划，可以有多个 vm.isMultiple
     */
    addAction(){
      if(!this.validate()) return console.error('validator errors');
      // 清空enrollCache
      // 缓存子数据集合 this.getEnrollRefs().map(enrollRef => enrollRef.getData());
      if(this.vm.share=== SHARE_STATE.SHARE) return this.shareAddAction();
      return this.notShareAddAction().then(res => {
        this.handleClose();
        this.$message.success('添加成功');
        setTimeout(() => this.$emit('refresh'), 1200);
      });
    },

    // 共享库存
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

    
    /**
     * @description: 递归添加非共享库存
     * @return: 
     */
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
          if(!planBol) console.log(this.dayInloop); // 这里是当前day插入plan成功与否的记录 

          // 出口，整理错误队列 然后 return Promise
          if(this.linkList.length=== 0 && this.errorList.length=== 0) return resolve();
          let day= (this.linkList.pop() || this.errorList.pop());
          this.savingState(day, 'saving');
          // 收集错误信息
          this.dayInloop= day;
          this.addInventoryAction(day)
          .then(inventoryID => {
            if(!inventoryID){
              // inventoryID为false说明添加库存失败，错误收集逻辑在linkAddInventoryFailCb中
              return Promise.resolve();
            }
            return this.addPlanAction(inventoryID, day)
          })
          .then(func);
        }
        // 启动
        func(true)
      })
    },

    /**
     * @description:　新增库存，如果dayInt存在于成功队列，则直接返回对应inventoryID
     */
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

    // 新增计划
    // 返回错误，但是新增成功了
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

    // 获取所有enrollRef实例
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

    // 获得一个报名实例
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

    // 链式调用
    linkAddInventory(object, day){
      return new Promise((resolve, reject) => {
        this.$http.post(this.GLOBAL.serverSrc + "/team/api/inventoryinsert", {
          object
        }).then((res) => {
          let { isSuccess, id }= res.data;
          if(!isSuccess) return resolve(this.linkFailCb(day));
          
          // 将正确添加的库存放入正确队列
          this.inventorySuccessList.push({ day, inventoryID: id })
          return resolve(id);
        }).catch((err) => {
          resolve(this.linkFailCb(day));
        })
      })
    },

    // 链式调用
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

    // 改变day的savingState
    savingState(day, state){
      if(!this.isMultiple) return;
      day.savingState= state;
    }
  }
}
</script>