<template>
  <el-dialog :title="vm.share=== SHARE_STATE.SHARE?'编辑计划（共享）':'编辑计划'" width="1260px"
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
          <el-form-item label="库存类型：">
            <el-radio-group size="small" disabled v-model="vm.share">
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
          <el-form-item label="报名类型：">
            <el-select v-model="vm.enrollName" placeholder="最高" size="small">
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
  saveInventory,
  savePlan,
} from '../../../../../../planInventory'

export default {
  components: { enrollCard },

  inject: ['poolManager', 'PACKAGE_LIST'],

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
        enrollName: null
      },
      submitForm: {
        count: '',
        dateHous: null,
        inventoryID: null
      },
      rules: {
        inventoryID: { required: true, message: '请选择共享库存', trigger: ['blur']}, 
        share: { required: true, message: '请选择库存类型', trigger: ['blur']},
        count: [
          { required: true, message: '请填写库存', trigger: ['change', 'blur']},
          { required: true, validator: this.positiveIntegerValidator, trigger: ['change', 'blur']},
        ],
        dateHous: { required: true, message: '请选择预留时长', trigger: ['blur']},
      },
      // 新增plan
      enrollList: [],
      // 共享库存列表
      shareOptions: [],
      // 报名类型列表
      enrollTypeOptions: [],
    }, { SHARE_STATE })
  },

  methods: {
    handleOpen(payload){
      let { share, dateHous, count, inventoryID, planEnroll, day, regimentType }= payload;
      // 共享类型
      this.vm.share= share;
      this.submitForm.regimentType= regimentType;
      this.submitForm.dateHous= dateHous;
      this.submitForm.count= count;
      this.submitForm.inventoryID= inventoryID;
      this.enrollList.push(...planEnroll);
      this.checkProto= this.$deepCopy(this.submitForm);
      this.cacheInit= payload;
      getEnrollTypeDictionary().then(res => {
        this.enrollTypeOptions.push(...res);
      });
      if(this.vm.share=== SHARE_STATE.SHARE){
        let { dayInt }= day;
        getInventoryList({ share: SHARE_STATE.SHARE, date: dayInt }).then(res => {
          this.shareOptions.push(...res)
        })
      }
      this.vm.state= true;
    },

    handleClose(){
      this.enrollList.splice(0);  // 清空子列
      this.shareOptions.splice(0);  // 清空共享库存表单
      this.enrollTypeOptions.splice(0);
      this.vm.share= SHARE_STATE.NOT_SHARE; //重置共享状态
      this.$refs.submitForm.resetFields();  // 重置表单
      this.vm.state= false;
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
      let name= this.vm.enrollName;
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
     * @description:
     * 1. 共享库存：直接新增计划，且每次只能一个
     * 2. 非共享库存：先新增库存再新增计划，可以有多个 vm.isMultiple
     */
    addAction(){
      if(!this.validate()) return console.error('validator errors');
      if(!this.hasChange()){
        this.$message.info('数据无变化');
        return this.handleClose();
      }
      let inventory= this.getInventorySave();
      let plan= this.getPlanSave();
      let { date }= this.cacheInit.day;
      saveInventory(inventory)
      .then(
        () => savePlan(plan)
      )
      .then(() => {
        this.$message.success('修改成功');
        this.$emit('refresh', { date, sureDate: true });
        this.handleClose();
      })
      .catch(() => this.$message.success('修改失败'));
    },
    
    hasChange(){
      let bol= this.$checkLooseEqual(this.submitForm, this.checkProto);
      //　报名数发生变化
      if(bol) bol= (this.cacheInit.planEnroll.length=== this.enrollList.length);
      if(bol) bol= !this.childrenHasChange(); 
      return !bol;
    },

    childrenHasChange(){
      return !!this.getEnrollRefs().find(enrollRef => enrollRef.hasChange());
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

    getInventorySave(){
      let { share, dateHous, count, inventoryID, planEnroll, day, name }= this.cacheInit;
      return {
        id: inventoryID,
        name: name,
        count: this.submitForm.count,
        share: share,
        date: day.dayInt
      }
    },

    getPlanSave(){
      let currentPac= this.PACKAGE_LIST.find(pac => pac.selected);
      let { id, codePrefix, codeSuffix }= currentPac;
      let { dayInt, vm }= this.poolManager.currentDay;
      return {
        id: vm.planID,
        packageID: id,
        inventoryID: this.submitForm.inventoryID,
        dateHous: this.submitForm.dateHous,
        date: dayInt,
        groupCode: `${codePrefix}-${dayInt}-${codeSuffix}`,
        planEnroll: this.getEnrollRefs().map(enrollRef => enrollRef.getData()),
        regimentType: this.submitForm.regimentType,
        createTime: 0,
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
    }
  }
}
</script>