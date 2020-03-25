/*
 * @Author: WZJ 
 * @Last Modified by:   WZJ 
 */


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
import { upLoadDraft, deleteDraft } from "../../../../api.js";
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
    },
    groupCode: {
      type: String
    }
  },
  created() {},
  methods: {
    // 关闭当前草稿组件
    closeDraft() {
      this.$emit("change-draft", false);
      //关闭组件时同时清除缓存(针对第二次打开表单，此时已有草稿缓存的情况)
      this.$el.remove(this.groupCode)
    },
    // 确定保存草稿 接口传参 JSON字符串
    saveDraft(data) {
      //保存草稿到缓存 有效时间为12小时
      this.$ls.set(this.groupCode,JSON.stringify(this.subForm),60 * 60 * 1000*12);
      // upLoadDraft(315, this.groupCode, JSON.stringify(this.subForm), this);
      this.closeDraft();
    }
  }
};
</script>

<style>
</style>