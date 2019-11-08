<template>
<div>
<el-cascader :props="props"></el-cascader>
</div>
</template>

<script>
let id = 0;
export default {
data() {
return {
aaa: 1,
props: {
  lazy: true,
  _this: this,
  lazyLoad(node, resolve) {
    const { level } = node;
    let nId = 204;
    if (level > 0) {
      nId = node.value;
    }
    console.log(nId);
    this._this.$http
    .post(this._this.GLOBAL.serverSrc + "/org/api/deptlist", {
      object: {
        ParentID: nId
      }
    })
    .then(res => {
    let data = res.data.objects.map(v => {
      return {
        label: v.orgName,
        value: v.id
      };
    });
    resolve(data);
    });
  }
}
};
}
};
</script>

<style scoped lang='stylus'>
.big {
width: 1600px;
height: 750px !important;
}

.list {
float: left;
}

.table {
margin-left: 40px;
margin-top: 40px;
}

.page {
margin-top: 30px;
float: left;
margin-left: 35px;
}

.Popup {
margin: auto;
}

.addButton {
float: left;
margin-left: 40px;
}

.el-dialog__wrapper>>>.el-dialog {
width: 400px;
}

.dialog-footer {
text-align: center;
}

.oppp {
margin: 20px;
width: 100px;
}

.addPosition-input {
width: 220px;
margin-right: 100px;
}
</style>