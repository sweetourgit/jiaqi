<template>
  <div class="visalist"><!-- 
    <div class="button">
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
            <el-input v-model="ruleForm.name" class="messagename"></el-input>
            <span class="Numbers">{{ruleForm.name.length}}/30字</span>
          </el-form-item>
          <el-form-item label="亮点词" prop="highlightWords">
            <el-input v-model="ruleForm.highlightWords" class="Words"></el-input>
            <span class="Numbers">{{ruleForm.highlightWords.length}}/8字</span>
          </el-form-item>
          <el-form-item prop="highlightWords1" class="Words1">
            <el-input v-model="ruleForm.highlightWords1" class="Words"></el-input>
            <span class="Numbers">{{ruleForm.highlightWords1.length}}/8字</span>
          </el-form-item>
          <el-form-item prop="highlightWords2" class="Words2">
            <el-input v-model="ruleForm.highlightWords2" class="Words"></el-input>
            <span class="Numbers">{{ruleForm.highlightWords2.length}}/8字</span>
          </el-form-item>
          <el-form-item prop="highlightWords3" class="Words3">
            <el-input v-model="ruleForm.highlightWords3" class="Words"></el-input>
            <span class="Numbers">{{ruleForm.highlightWords3.length}}/8字</span>
          </el-form-item>
          <el-form-item label="活动区域" prop="region" class="mt80">
            <el-input v-model="ruleForm.region" class="messagename"></el-input>
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
      ruleForm: {
          name: '',//产品名称
          highlightWords:'',//亮点词
          highlightWords1:'',//亮点词
          highlightWords2:'',//亮点词
          highlightWords3:'',//亮点词
          region: '', //签证国家地区
          type: [],
          resource: '',
        },
        rules: {
          name: [
            { required: true, message: '请输入产品名称', trigger: 'change' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'change' }
          ],
          highlightWords: [
            { required: true, message: '请输入亮点词', trigger: 'change' },
            { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'change' }
          ],
          highlightWords1: [
            { required: true, message: '请输入亮点词', trigger: 'change' },
            { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'change' }
          ],
          highlightWords2: [
            { required: true, message: '请输入亮点词', trigger: 'change' },
            { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'change' }
          ],
          highlightWords3: [
            { required: true, message: '请输入亮点词', trigger: 'change' },
            { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'change' }
          ],
          region: [
            { required: true, message: '请输入签证国家地区', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ]
        },
    };
  },
  created() {
  },
  methods: {
    nextMessage(formName){
      this.$refs[formName].validate((valid) => {
        
      });
    },
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
  width:900px;
  overflow:hidden;
  position:relative;
}
.messagename{
  float:left;
  width:470px;
}
.Numbers{
  float:left;
  margin:0 10px 0 20px;
}
.Words{
  float:left;
  width:200px;
  margin:0 0 0 0;
}
.Words1{
  position:absolute;
  top:62px;
  right:260px;
}
.Words2{
  position:absolute;
  top:122px;
  left:0px;
}
.Words3{
  position:absolute;
  top:122px;
  right:260px;
}
.mt80{
  margin-top:80px;
}
</style>


