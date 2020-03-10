<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="Sku详情" name="first"> 
      <VisaDetails></VisaDetails>
    </el-tab-pane>
    <el-tab-pane label="报账" name="second">
      <VisaCheck></VisaCheck>
     </el-tab-pane>
     
  </el-tabs>
</template>
<script>
  import VisaDetails from '@/page/productManagement/regimentPlan/children/visaOrder/VisaDetails/VisaDetails';
  import VisaCheck from '@/page/productManagement/regimentPlan/children/visaOrder/VisaCheck/VisaCheck';
  export default {
     name: "visaOrderList",
      components: {
        VisaDetails,
        VisaCheck
      },
    data() {
      return {
        activeName: 'first'
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      

      }
    }
  };
</script>