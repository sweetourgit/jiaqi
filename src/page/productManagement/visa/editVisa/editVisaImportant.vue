<template>
  <div>
    <div class="visalist">
      <div class="button">
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" @click="addProduct('ruleForm')">添加</el-button>
      </div>
      <div class="bother">
        <div class="left">
          <div class="one">
            <div class="correct"><i class="el-icon-check"></i></div>
            <div class="fl">基础信息</div>
          </div>
          <div class="line"></div>
          <div class="one">
            <div class="correct"><i class="el-icon-check"></i></div>
            <div class="fl">签证信息</div>
          </div>
          <div class="line"></div>
          <div class="one">
            <div class="border">3</div>
            <div class="fl">重要提示</div>
          </div>
        </div>
        <div class="right">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="重要提示：" prop="important">
              <el-input v-model="ruleForm.important" class="messagename" placeholder="请输入重要提示" type="textarea":rows="5"></el-input>
              <span class="numbers">{{ruleForm.important.length}}/1000字</span>
            </el-form-item>
            <el-form-item label="費用包含：" prop="includes">
              <el-input v-model="ruleForm.includes" class="messagename" placeholder="请输入費用包含" type="textarea":rows="5"></el-input>
              <span class="numbers">{{ruleForm.includes.length}}/1000字</span>
            </el-form-item>
            <el-form-item label="費用不包含：" prop="costExclusive">
              <el-input v-model="ruleForm.costExclusive" class="messagename" placeholder="请输入費用不包含" type="textarea":rows="5"></el-input>
              <span class="numbers">{{ruleForm.costExclusive.length}}/1000字</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>

export default {
  props: {
   
  },
  data() {
    return {
      ruleForm:{
        important:'', // 重要信息
        includes:'', // 費用包含
        costExclusive:'', //費用不包含
      },
      rules:{
        important: [
          { min: 1, max: 1000, message: '长度在 1 到 1000 个字符', trigger: 'change' }
        ],
        includes: [
          { min: 1, max: 1000, message: '长度在 1 到 1000 个字符', trigger: 'change' }
        ],
        costExclusive: [
          { min: 1, max: 1000, message: '长度在 1 到 1000 个字符', trigger: 'change' }
        ],
      },
      
    };
  },
  watch: {
    
  },
  created() {
    this.getProduct();
  },
  methods: {
    getProduct(){
      this.$http.post(this.GLOBAL.serverSrc + "/visa/visapro/api/get",{
        id:sessionStorage.getItem('productID')
      }).then(res => {
          console.log(res.data.object)
      })
    },
    addProduct(formName){
      var newsObject = sessionStorage.getItem('message');
      newsObject = JSON.parse(newsObject);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post(this.GLOBAL.serverSrc + "/visa/visapro/api/save",
            {
              object: {
                "id": sessionStorage.getItem('productID'),
                "visaTitle": newsObject[0].name, // 签证名称
                "strengths": newsObject[1].highlightWords, // 产品亮点词
                "visaPod": newsObject[2].region, // 签证国家地区传ID
                "pictureID": newsObject[3].pictureID, // 头图ID
                "pepeatpic": newsObject[4].shuffling, // 轮播图传ID和URL
                "signature": newsObject[5].signature, // 送签地
                "reception": newsObject[6].reception, // 签证受理地区
                "visaType": newsObject[7].visaType, // 签证类型
                "technologicalType": newsObject[8].technologicalType, // 签证流程类型
                "interview": newsObject[9].interview, // 是否面试
                "validity": newsObject[10].validity, // 签证有效期
                "entry": newsObject[11].entry, // 入境次数
                "staydays": newsObject[12].staydays, // 停留天数
                "overview": newsObject[13].overview, // 产品概况
                "important": this.ruleForm.important, // 重要提示
                "cost": this.ruleForm.includes, // 费用包含
                "notCost": this.ruleForm.costExclusive, // 费用不包含
                "onlineType": 0,
                "erpType": 0,
                "isDeleted": 0,
                "createTime": "2020-03-12T06:38:40.753Z",
                "code": "string",
                "copyNum": 0,
                "createUser": "string"
              }
            })
            .then(res => {
              if(res.data.isSuccess == true){
                 this.$message.success("添加成功");
                 this.$router.push({ path: "/productList/productVisa" }); // 基本信息添加完跳转到签证信息页面
                 this.$refs[formName].resetFields();
              }else{
                 this.$message.success("添加失败");
              }
          })
        } else {
          return false;
        }
      });
    },
    cancel(){
      this.$confirm("是否取消本次添加产品?", "提示", {
         confirmButtonText: "确定",
         cancelButtonText: "取消",
         type: "warning"
      })
      .then(res => {
         this.$message.success("本次添加产品取消成功");
         this.$router.push({ path: "/productList/productVisa" });
       })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        });
      });
    },
  }
};
</script>

<style scoped lang="scss">
.visalist{max-width: 1200px; overflow: hidden;margin:0 0 50px 0;}
.button{float:right;}
.bother{clear:both;}
.left{float:left;width:150px;}
.correct{
  width:40px;
  height:40px;
  border:2px solid #409eff;
  background:#409eff;
  line-height:40px;
  text-align:center;
  border-radius:50%;
  float:left;
  margin:10px 0 10px 0;
  color:#fff;
  font-weight: bold;
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
  margin:15px 0 0 30px;
  width:900px;
  overflow:hidden;
  position:relative;
}
.messagename{width:650px; float:left;}
.numbers{float:left; margin:85px 0 0 10px;}
</style>


