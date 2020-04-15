<template>
  <!--出团通知书弹窗-->
  <el-dialog
    title="出团通知书"
    :visible.sync="dialogFormMark"
    :close-on-click-modal="false"
    class
    width="780px"
    @open="getActiceNote"
    @close="btReceiptDialogClose"
  >
    <div class="adviceNote">
      <el-upload
        class="uploadDemo"
        action
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        multiple
        :disabled="true"
        :file-list="fileList"
      >
        <span>出团通知书 :</span>
      </el-upload>
      <div class="adviceNoteBtn">
        <el-button type="info" @click="dialogAdviceNote = false">取消</el-button>
        <el-button type="primary" @click="$picDownloader(fileList[0].url,fileList[0].name)">下载</el-button>
        <!-- <el-button type="primary" @click="adviceNoteSend">发送</el-button> -->
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "boatReceipt",
  props: {
    orderId: 0,
    a_variable: 0,
    dialogType: 0,
    orderCodeSon:""
  },
  data() {
    return {
      fileList: [] ,//出团通知书的图片
      dialogFormMark:false,//弹框
    };
  },
  watch: {
    a_variable: function() {
      if (this.dialogType == 4) {
        this.getActiceNote();
        this.dialogFormMark = true;
      }
    }
  },
  created() {},
  methods: {
    handleRemove(file, fileList) {},
    handlePreview(file, fileList) {},
    // 出团通知书获取
    getActiceNote() {
      this.$http
        .post(this.GLOBAL.serverSrc + "/teamquery/get/api/get", {
          id: 0
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            let { name, url } = res.data.object;
            let obj = {
                name,
                url
            };
            this.fileList.push(obj);
          }
        })
        .catch(err => {});
    },
    // 出团通知书弹窗关闭事件
    btReceiptDialogClose() {
      this.$parent.resetDialogType();
      this.fileList = [];
      this.dialogFormMark = false;
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
/* 出团通知书 */
.adviceNote {
  height: 300px;
  position: relative;
  .adviceNoteBtn {
    position: absolute;
    right: 20px;
    bottom: 10px;
  }

  .uploadDemo {
    position: relative;
    margin-top: -10px;
    margin-left: 100px;
    span {
      position: absolute;
      top: 30px;
      left: -80px;
    }
  }
}
</style>