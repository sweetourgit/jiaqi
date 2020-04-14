<template>
  <!-- 申请直客收款-弹窗 -->
  <div>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="收款时间" prop="collectionTime" label-width="120px">
          <el-date-picker style="width:100%;" v-model="ruleForm.collectionTime" type="date" class="inputWidth" placeholder="收款时间" :disabled="change"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="交易流水号" prop="serialNumber" label-width="120px">
          <el-input style="width: 100%;" v-model="ruleForm.serialNumber" class="bright inputWidth" placeholder="交易流水" :disabled="change"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="收款账户" prop="collectionNumber" label-width="120px">
          <el-input style="width:60.5%;"  v-model="ruleForm.collectionNumber" placeholder="请输入收款账户" :disabled="change"></el-input>
          <el-button style="width:30%;" class="collection" @click="account()" :disabled="change">选择</el-button>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="摘要" prop="abstract" label-width="120px">
          <el-input style="width:100%;" v-model="ruleForm.abstract"  placeholder="摘要" :disabled="change"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="凭证" prop="voucher" label-width="120px" ref="voucher">
      <el-upload  class="upload-demo" name="files" multiple :action="this.uploadUrl" :disabled="change" :on-error="handleError"
        :on-success="handleSuccess" :on-remove="handleRemove" :on-preview="handlePreview">
        <el-button size="small" type="primary">上传文件</el-button>
      </el-upload>
    </el-form-item>
    <el-form-item label="是否选择发票" prop="isInvoice" label-width="130px">
      <el-radio-group v-model="ruleForm.isInvoice" :disabled="change" @change="isInvoiceHandle">
        <el-radio value='1' :label='1' key='1'>是</el-radio>
        <el-radio value='0' :label='0' key='0'>否</el-radio>
      </el-radio-group>
    </el-form-item>
  </div>
</template>
<script type="text/javascript">
  // 这个组件设计的逻辑不多 当时没拆好 逻辑放父组件离了
  import {
    mapMutations,
    mapGetters,
    mapActions
  } from 'vuex'
  export default {
    name: "StraightGuestInfo",
    components: {},
    props: ['ruleForm'],
    data() {
      return {
        change: false,
        fileList: [],
        imgBigName: ''
      }
    },
    computed: {
      ...mapGetters('collectionManagement', {
        uploadUrl: 'uploadUrl'
      })
    },

    methods: {
      ...mapActions('collectionManagement', {
        getCollectionList: 'getCollectionList'
      }),
      //获取同业社列表
      account() {
        this.getCollectionList()
      },
      //是否选择发票
      isInvoiceHandle(val) {
        this.$emit('isInvoiceHandle', val)
      },
      //文件上传成功
      handleSuccess(res, file, fileList) {
        console.log('上传成功')
        this.fileList = fileList
      },
      // 文件上传失败时的钩子
      handleError(err, file) {
        this.fileList = []
      },
      // 上传文件-移除 这里的uid 虽然说是赋值了 但是并没有调用
      handleRemove(file, fileList) {
        this.uid = fileList[0].uid;
        this.fileList = fileList
        this.fileCheckVal = fileList.length
      },
      // 点击文件列表中已上传的文件时的钩子
      handlePreview(file) {
        let getUrl = JSON.parse(file.response)
        this.uid = file.uid
        window.open(getUrl.paths[0].Url);
      },
    }
  }
</script>
<style lang="scss" scoped>

</style>
