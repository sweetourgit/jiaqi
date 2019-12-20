<template>
  <div class="visalist">
    <!-- <div class="button">
      <el-button>取消</el-button>
      <el-button type="primary" @click="nextMessage('ruleForm')">下一步</el-button>
    </div>
    <div class="bother">
      <div class="left">
        <div class="one">
          <div class="border">1</div>
          <div class="fl">基础信息</div>
        </div>
        <div class="line"></div>
        <div class="one">
          <div class="border">2</div>
          <div class="fl">签证信息</div>
        </div>
        <div class="line"></div>
        <div class="one">
          <div class="border">3</div>
          <div class="fl">重要提示</div>
        </div>
      </div>
      <div class="right">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="产品名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="活动区域" prop="region">
            <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动性质" prop="type">
            <el-checkbox-group v-model="ruleForm.type">
              <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
              <el-checkbox label="地推活动" name="type"></el-checkbox>
              <el-checkbox label="线下主题活动" name="type"></el-checkbox>
              <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="特殊资源" prop="resource">
            <el-radio-group v-model="ruleForm.resource">
              <el-radio label="线上品牌商赞助"></el-radio>
              <el-radio label="线下场地免费"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      // ruleForm: {
      //     name: '',
      //     region: '',
      //     type: [],
      //     resource: '',
      //   },
      //   rules: {
      //     name: [
      //       { required: true, message: '请输入活动名称', trigger: 'blur' },
      //       { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
      //     ],
      //     region: [
      //       { required: true, message: '请选择活动区域', trigger: 'change' }
      //     ],
      //     type: [
      //       { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
      //     ],
      //     resource: [
      //       { required: true, message: '请选择活动资源', trigger: 'change' }
      //     ]
      //   }
    };
  },
  created() {
  },
  methods: {
    // nextMessage(formName){
    //   this.$refs[formName].validate((valid) => {
        
    //   });
    // },
  }
};
</script>

<style scoped lang="scss">
.visalist{
  max-width: 1200px; 
  overflow: hidden;
}
.button{
  float:right;
}
.bother{
  clear:both;
}
.left{
  float:left;
  width:150px;
}
.border{
  width:40px;
  height:40px;
  border:2px solid #e6e6e6;
  line-height:40px;
  text-align:center;
  border-radius:50%;
  float:left;
  margin:10px 0 10px 0;
}
.fl{
  float:left;
  line-height:40px;
  margin:10px 0 0 10px;
}
.line{
  clear:both;
  width:3px;
  height:40px;
  background:#e6e6e6;
  margin:0 0 0 19px;
}
.right{
  float:left;
  margin:15px 0 0 40px;
}
</style>


