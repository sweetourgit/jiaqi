<template>
  <div>
    <el-tree
      :data="data"
      show-checkbox
      default-expand-all
      node-key="id"
      ref="tree"
      highlight-current
      :props="defaultProps"
    ></el-tree>
  </div>
</template>

<script>
export default {
  name: "chooseAccount",
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