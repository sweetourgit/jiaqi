<template>
  <div>
    <!--备注信息弹窗-->
    <el-dialog
      title="备注"
      :visible.sync="propsObj.dialogType === 0"
      :close-on-click-modal="false"
      class
      width="780px"
      @close="btRemarkDialogClose"
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
        <el-form-item align="right">
          <el-button type="info" size="medium" class="submitMark">提交备注</el-button>
        </el-form-item>
        <el-form-item align="center">
          <el-button class="colse" @click="btRemarkDialogClose">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "boatRemarksInfor",
  props: {
    propsObj: { type: Object }
  },
  data() {
    return {
      // name: localStorage.getItem("name"),
      markFormAdd: {
        orderCode: "",
        Mark: "",
        CreateTime: ""
      },
      markForms: [],
      orderget: {},
      rules: {
        Mark: [{ required: true, message: "请填写备注信息", trigger: "blur" }]
      }
    };
  },

  watch: {},
  created() {},
  methods: {
    // 关闭弹窗事件
    btRemarkDialogClose() {
      this.$emit(
        "update:this.propsObj.dialogType",
        (this.propsObj.dialogType = -1)
      );
      this.markFormAdd.Mark = ""
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
</style>