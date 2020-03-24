<template>
  <el-dialog
  
    top="40vh"
    :close-on-press-escape="true"
    :center="true"
    :modal="true"
    title="是否保存草稿"
    width="20%"
    :before-close="closeDraft"
    :show-close="false"
  >
    <span>这是一段信息</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDraft()">取 消</el-button>
      <el-button @click="saveDraft()" type="primary">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
// 草稿组件
import { upLoadDraft } from "../../../../api.js";
export default {
  data() {
    return {};
  },
  props: {
    subForm: {
      type: Object
    },
    form: {
      type: Object
    }
  },

  methods: {
    // 关闭当前模态框 并关闭父组件模态框 重置表单数据
    closeDraft() {
      this.$emit("change-draft", false);
    },
    // 确定保存草稿 接口传参 JSON字符串
    saveDraft(data) {
      upLoadDraft("", "", JSON.stringify(this.subForm), this);
      this.closeDraft();
    }
  }
};
</script>

<style>
</style>