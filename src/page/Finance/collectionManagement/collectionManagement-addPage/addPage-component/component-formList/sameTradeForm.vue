<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="收款时间" prop="collectionTime" label-width="120px">
          <el-date-picker style="width:100%" v-model="ruleForm.collectionTime" type="date" placeholder="收款时间"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="同业社名称" prop="sameTrade" label-width="120px">
          <el-autocomplete style="width:100%" v-model="ruleForm.sameTrade" :fetch-suggestions="getPeersList"
            placeholder="请输入同业社名称" :trigger-on-focus="false" @select="getArrearsList"></el-autocomplete>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="收款账户" prop="collectionNumber" label-width="120px">
          <el-input style="width:78.5%" v-model="ruleForm.collectionNumber" placeholder="请输入收款账户" :disabled="change"></el-input>
          <el-button style="width:20%" class="collection" @click="account()" :disabled="change">选择</el-button>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="收款金额" prop="price" label-width="120px">
          <el-input style="width:100%" v-model="ruleForm.price" placeholder="收款金额" :disabled="change"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="摘要" prop="abstract" label-width="120px">
          <el-input style="width:100%" v-model="ruleForm.abstract" placeholder="摘要" :disabled="change"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="凭证" prop="voucher" label-width="120px" ref="voucher">
          <el-upload style="width:30%" :file-list="fileList" class="upload-demo" name="files" multiple :action="this.uploadUrl"
            :on-error="handleError" :on-success="handleSuccess" :on-remove="handleRemove" :on-preview="handlePreview">

            <el-button size="small" type="primary">上传文件</el-button>
          </el-upload>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="是否选择发票" prop="isInvoice" label-width="120px">
      <el-radio-group v-model="ruleForm.isInvoice" @change="isInvoiceHandle">
        <el-radio label="1">是</el-radio>
        <el-radio label="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
  </div>
</template>

<script>
  import utils from '../../utils.js'
  import {
    mapMutations,
    mapGetters,
    mapActions
  } from 'vuex'
  //标签中的change都为flase 父组件预留字段 并未引用
  export default {
    props: ['ruleForm'],
    data() {
      return {
        change: false,
        sameTradeData: [], // 同业社名称模糊查询
        fileList: [],
        //点击上传文件获取uid 与 imgBigName
        uid: '',
        imgBigName: '',
        sameTradeId: '1',
        sameTradeValue: '',
        travelMode: 'GroupTour'
      }
    },
    created() {},
    computed: {
      ...mapGetters('collectionManagement', {
        uploadUrl: 'uploadUrl'
      })
    },
    methods: {
      //获取收款用户列表
      ...mapActions('collectionManagement', {
        getCollectionList: 'getCollectionList'
      }),
      ...mapMutations('collectionManagement', {
        setArrearsList: "setArrearsList"
      }),
      //获取同业社列表 待拆
      getPeersList(peerName, cb) {
        this.sameTradeData = []
        this.$http.post(this.GLOBAL.serverSrc + '/universal/localcomp/api/list', {
          "object": {
            name: peerName,
            State: 2,
          }
        }).then(res => {
          for (let i = 0; i < res.data.objects.length; i++) {
            this.sameTradeData.push({
              "value": res.data.objects[i].id + ' - ' + res.data.objects[i].name,
              "id": res.data.objects[i].id
            })
            this.supplierId = res.data.objects[i].id ? res.data.objects[i].id : 0;
          }
          var results = peerName ? this.sameTradeData.filter(this.createFilter(peerName)) : [];
          cb(results)
        })
      },
      createFilter(queryString1) {
        return (restaurant) => {
          return (restaurant.value);
        }
      },
      getArrearsList(item, type = this.travelMode) {
        if (item == undefined) {
          item = {
            id: this.sameTradeId,
            value: this.sameTradeValue
          }
        }
        this.sameTradeId = item.id
        this.sameTradeValue = item.value
        this.$emit('getOriginPlace', item.id, item.value)
        var that = this
        if (type == 'GroupTour') {
          this.$http.post(this.GLOBAL.serverSrc + '/finance/collection/api/getArrearsList', {
            lcID: item.id,
            ProductType: 1
          }).then(obj => {
            console.log('obj', obj)
            that.setArrearsList(obj)
            that.$emit('updateArrearsList')
          })
        } else if (type == 'CruiseShip') {
          this.$http.post(this.GLOBAL.serverSrcYL + '/linerapi/v1/order/order/tradearrearorder', {
            merchant_code: item.id
          }).then(obj => {
            if (obj.code == 422) {
              this.$message.success('该同业社下无关联欠款，无法申请同业收款');
              return 
            }
            obj = utils.convertArrearsListForCruiseShip()
            that.setArrearsList(obj)
            that.$emit('updateArrearsList')
          })
        }
      },

      //获取收款用户列表
      account() {
        this.getCollectionList()
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
      // 上传文件-移除
      handleRemove(file, fileList) {
        this.fileList = fileList
      },
      // 点击文件列表中已上传的文件时的钩子
      handlePreview(file) {
        let getUrl = JSON.parse(file.response)
        this.uid = file.uid
        window.open(getUrl.paths[0].Url);
        this.imgBigName = file.name
      },
      //是否选择发票
      isInvoiceHandle(val) {
        this.$emit('isInvoiceHandle', val)
      },
    }
  }
</script>

<style>
</style>
