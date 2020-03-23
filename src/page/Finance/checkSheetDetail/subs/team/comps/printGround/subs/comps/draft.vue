!<template>
  <el-dialog :modal="true" title="是否保存草稿" width="30%">
    <span>这是一段信息</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDraft()">取 消</el-button>
      <el-button @click="saveDraft()" type="primary">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
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
    closeDraft() {
      this.$emit("change-draft", false);
      
    },
    saveDraft(data) {
      upLoadDraft("", "", JSON.stringify(this.subForm), this);
      this.closeDraft();
      this.form.resetFields();
    }
  }
};
</script>

<style>
</style>