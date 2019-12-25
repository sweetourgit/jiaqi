<template>
  <div>
    <!--备注信息弹窗-->
    <el-dialog
      title="备注"
      :visible.sync="isDialogFormMark"
      :close-on-click-modal="false"
      class
      width="780px"
    >
      <el-form
        :model="markFormAdd"
        :rules="rules"
        ref="markFormAdd"
        label-width="80px"
        class="demo-ruleForm"
      >
        <div v-for="(item,index) in markForms" :key="index">
          <el-form-item :label="name">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 6}"
              class="remark"
              placeholder="请输入内容"
              v-model="item.content"
              :disabled="true"
            ></el-input>
            <div class="time">2020-11-12</div>
          </el-form-item>
        </div>
        <el-form-item label="填写备注" prop="Mark">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 6}"
            class="remark"
            placeholder="请输入内容"
            v-model="markFormAdd.Mark"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="info" size="medium" class="submitMark">提交备注</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="colse">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "boatRemarksInfor",
  props: {
    propsObj:Object
  },
  data() {
    return {
      isDialogFormMark: false,//备注dialog是否显示
    };
  },
  watch:{
    // propsObj.dialogType: () {
    //   if (this.propsObj.dialogType == 0) this.isDialogFormMark = true
    // }
  },
  created() {},
  methods: {},
  mounted() {}
};
</script>

<style lang="scss" scoped>
</style>