<template>
  <el-dialog title="编辑" width="650px"
    ref="dialogRef" 
    :visible="state"
    :close-on-click-modal="false"
    :before-close="closeHandler">
    <div style="width: 550px;">
      <el-form
        label-width="120px" 
        ref="submitForm"
        :model="submitForm"
        :rules="rules">

        <el-form-item label="ID：">{{ submitForm.id }}</el-form-item>

        <el-form-item :label="belongLabel+ '：'">{{ parent && parent.areaName }}</el-form-item>

        <el-form-item :label="nameLabel+ '：'" prop="areaName">
          <el-input :placeholder="nameLabel" size="small"
            v-model="submitForm.areaName">
          </el-input>
        </el-form-item>

        <el-form-item label="末级区域：" prop="isLeaf">
          <el-radio-group 
            v-model="submitForm.isLeaf">
            <el-radio 
              :label="1">是</el-radio>
            <el-radio 
              :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="英文名：" prop="englishName">
          <el-input placeholder="英文名" size="small"
            v-model="submitForm.englishName">
          </el-input>
        </el-form-item>

        <el-form-item label="中文全拼：" prop="chineseFull">
          <el-input placeholder="中文全拼" size="small"
            v-model="submitForm.chineseFull">
          </el-input>
        </el-form-item>

        <el-form-item label="首字母：" prop="firstChar">
          <el-input placeholder="首字母" size="small"
            v-model="submitForm.firstChar">
          </el-input>
        </el-form-item>

        <el-form-item label="首拼：" prop="initial">
          <el-input placeholder="首拼" size="small"
            v-model="submitForm.initial">
          </el-input>
        </el-form-item>

        <el-form-item label="代码：" prop="areaCode">
          <el-input placeholder="代码" size="small"
            v-model="submitForm.areaCode">
          </el-input>
        </el-form-item>
      </el-form>
      <div style="display: flex; justify-content: center; padding-top: 20px;">
        <el-button size="small" @click="closeHandler">取消</el-button>
        <el-button size="small" type="primary" @click="saveAction">保存</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { putAreaAction } from '../api'

// 本页视图数据
const getShowData= function({ parent, belongLabel, nameLabel }= {}){
  return {
    parent, // 所属label值
    belongLabel, // 所属label
    nameLabel, // 名称label
  }
}
export default {

  data(){
    return Object.assign(
      // 视图数据
      { 
        ...getShowData(),
        state: false, 
      },
      // 数据
      {
        submitForm: {}
      },
      // 验证
      {
        rules: {
          areaName: [
            { required: true, message: '请填写名称', trigger: 'blur'},
            { pattern: /^[\u4e00-\u9fa5]{2,10}$/, message: '请输入2-10位汉字'}
          ],
          chineseFull: [
            {pattern: /^[a-z]+$/, message: '请输入小字母,不能有空格'}
          ],
          firstChar: [
            {pattern: /^[A-Z]{1}$/, message: '请输入一个大写字母,不能有空格'}
          ],
          initial: [
            {pattern: /^[A-Z]+$/, message: '请输入大写字母,不能有空格'}
          ]
        }
      }
    )
  },

  methods: {

    wakeup(payload, show){
      this.state= true;
      Object.keys(show).forEach((attr) => this[attr]= show[attr]);
      this.cache= this.$deepCopy(payload);
      this.submitForm= payload;
    },

    closeHandler(){
      this.submitForm= {};
      this.cache= null;
      this.state= false;
    },

    saveAction(){
      if(this.$checkLooseEqual(this.submitForm, this.cache)) return this.$message.info('信息无变化');
      putAreaAction(this.submitForm)
      .then(() => {
        this.$emit('refresh', this.parent);
        this.closeHandler();
      })
      .catch(err => this.$message.error(err));
    }
  }

}
</script>