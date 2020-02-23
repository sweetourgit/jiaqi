<template>
  <div>
    <!-- <el-dialog title="申请发票管理" :visible="dialogFormVisible"style="margin:-80px 0 0 0;"width=1100px :show-close="false" custom-class="city_list" class="addReceivables"@close="closeAdd()">
      123
    </el-dialog> -->
  </div>
</template>

<script>
export default {
   name: "addInvoiceApply",
   components: {},
   props: {
      dialogFormVisible: false, // 是否显示弹窗
      find: 0,
      change: false, // 相关表单是否可点击
   },
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
    closeAdd(){
      this.dialogFormVisible = false;
    },
  }
};
</script>

<style scoped lang="scss">


</style>


