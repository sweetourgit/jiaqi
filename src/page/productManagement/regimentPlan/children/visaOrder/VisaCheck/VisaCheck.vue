<template>
  <div class="vivo" style="position:relative">
    <div class="demo-input-suffix ">
      <span class="search-title">产品名称:</span>
      <el-input v-model="activeForm.title" placeholder="请输入" class="input"></el-input>
      <span class="search-title">报账团号:</span>
      <el-input v-model="activeForm.tour" placeholder="请输入" class="input"></el-input>
      <span class="search-title">操作人员:</span>
      <el-input  v-model="activeForm.user" placeholder="请输入" style="margin-right:60px;"></el-input>
     <div class="button_select">
        <el-button type="primary" @click="searchHand()" size="medium">搜索</el-button>
        <el-button type="primary" @click="resetHand()" size="medium" plain>重置</el-button>
      </div>
    </div>
   
     
  </div>
</template>
<script type="text/javascript">
export default {
  name: "visaCheck",
  components: {
   
  },
  data() {
    return {
      activeForm: {
        title: '',
        tour: '',
        user: '',
      },
    
    }
  },
  computed: {
    // 计算属性的 getter
  },
  watch: {},
  methods: {

  },
  created() {
 
  }

}

</script>
<style lang="scss" scoped>
.vivo {
  .demo-input-suffix {
    width: auto;
    background-color: #F7F7F7;
    padding: 20px;

    .search-title {
      font-size: 14px;
      margin-left: 20px;
      margin-top: 10px;
    }

    .el-input {
      width: auto;
    }

    .el-input__inner {
      width: 10%;
    }

    .demo-input-suffix {
      width: 900px
    }

    .date-line {
      width: 10px;
      border-bottom: 1px solid #e6e6e6;
      display: inline-block;
      margin: 0 3px 3px 0
    }

    .button_select {
      display: inline;
    }

  }

  .main {
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: left;
    //margin-left: 50px;

    .select_button {
      padding-top: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e9eaea;
      text-align: left;
      padding-left: 50px;
    }
  }

  .table_trip {
    .table_details {
      margin: 5px;
    }
  }

}



.el-tabs__nav>>>.el-tabs__item {
  font-size: 30px !important;
}

.el-autocomplete>>>.el-input--small .el-input__inner {
  height: 35px !important;
}

</style>
