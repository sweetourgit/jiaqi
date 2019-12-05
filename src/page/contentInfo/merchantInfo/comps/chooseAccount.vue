<template>
  <div>
    <el-dialog
      title="选择人员"
      :visible.sync="isChooseAccount"
      :show-close="false"
      class="addAccount"
      :close-on-click-modal="false"
      width="500px"
    >
      <el-tree
        :data="data"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps"
      ></el-tree>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "chooseAccount",
  props: {
    isChooseAccount: {
      type: Boolean
    }
  },
  data() {
    return {
      data: [],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  methods: {
    //   清空
    // resetChecked() {
    //   this.$refs.tree.setCheckedKeys([]);
    // }

    // 页面初始加载请求的数据
    deptlist() {
      this.$http
        .post(this.GLOBAL.serverSrc + "/org/api/deptlist", {
          ParentID: 204
        })
        .then(res => {
          console.log(res, "chooseAccount.vue");
          this.data = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    this.deptlist();
  }
};
</script>

<style lang="stylus"></style>