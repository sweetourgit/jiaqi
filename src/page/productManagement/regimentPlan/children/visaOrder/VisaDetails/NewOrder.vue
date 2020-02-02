<template>
 
    <div class="main">
      <header class="header_style">
        <el-button type="primary" size="small" @click="preAction">保存</el-button>
        <el-button type="info" size="small" @click="leavePage">取消</el-button>
      </header>
      <div class="n_message">
        <header>团期信息</header>
        <body>
        <el-row>
            <el-col :span="8">
              <div class="info">
                <p>计划编码 :</p>TC-GTY-1001-01-180806-01
              </div>
            </el-col>
            <el-col :span="8">
              <div class="info">
                <p>余位：</p> 20
              </div>
            </el-col>
            <el-col :span="8">
              <div class="info">
                <p>产品名称：</p>日本签证
              </div>
            </el-col>
       </el-row>
       <el-row>
        <el-col :span="8">
          <div class="info">
            <p>sku名称 :</p>日本单人
          </div>
        </el-col>
       </el-row>
        </body>
      </div>
 
  
  </div>
    <!-- </div> -->
</template>

<script> 
export default {
  name: "NewOrder",
  components: {
   
  },
  data() {
    return {
      
    };
  },
  created() {
   
  },
  mounted () {
  },
  methods: {
    preAction(){ // 保存
      console.log('签证团期计划保存')
    },
    leavePage(){// 取消
     this.$confirm(`是否确定取消下单`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return this.$router.push('/regimentPlan/visaOrderList');
      })
    },
    
  }
};
</script>
<style lang="scss" scoped>
 @import './index.scss'; 
.header_style{
    display: flex;
    width: 100%;
    justify-content: flex-end;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
  .n_message{
    width: 100%;
    height: 180px;
    border:1px solid #c2c2c2;
    overflow: hidden;
    header{
      width: 100%;
      background: #F7F7F7;
      height: 30px;
      line-height: 30px;
      text-align: left;
      padding:5px 10px;
    }
    .info {
        p {
          width: 20%;
          margin-left: 3%;
          display: inline-block;
        }
      }
  }

</style>
