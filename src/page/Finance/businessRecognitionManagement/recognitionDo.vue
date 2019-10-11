<template>
  <div class="vivo" style="position:relative" id="tradeDetail">
    <el-dialog :visible="dialogFormVisible" @close="closeAdd" style="width: 100%">
      <div class="buttonDv" style="float: right;margin-right: 3%;">
        <el-button type="primary" @click="closeAdd" style="margin-right: 10px" plain>取消</el-button>
        <el-button type="primary" @click="submitBtn">确认</el-button>
      </div>
      <p class="stepTitle">基本信息</p>
      <el-button type="info" round size="mini" style="margin-left: 4%;" v-if="baseInfo.status_rece == 1">待认收款</el-button>
      <el-button type="success" round size="mini" style="margin-left: 4%;" v-if="baseInfo.status_rece == 2">已认完</el-button>
      <div class="stepDv">
        <p class="inputLabel"><span>收款单号：</span>{{baseInfo.rece_code}}</p>
        <p class="inputLabel"><span>申请人：</span>{{baseInfo.create_uid}}</p>
        <p class="inputLabel"><span>申请时间：</span>{{baseInfo.created_at}}</p>
        <p class="inputLabel"><span>收款时间：</span>{{baseInfo.receivables_at}}</p>
        <p class="inputLabel"><span>收款账户：</span>{{baseInfo.account}}</p>
        <p class="inputLabel"><span>收款金额：</span>{{baseInfo.rece_money}}</p>
        <p class="inputLabel"><span>剩余认款金额：</span>{{baseInfo.remain_money}}</p>
        <p class="inputLabel"><span>摘要：</span>{{baseInfo.remark}}</p>
        <p class="inputLabel"><span>款项说明：</span>{{baseInfo.explain}}</p>

        <div class="inputLabel">
          <span style="vertical-align: top;">凭证：</span>
          <!--<el-upload ref="upload1" class="upload-demo" action="" :file-list="fileList" :disabled="disabled">-->
          <!--<el-button size="small" type="primary" :disabled="disabled">点击上传</el-button>-->
          <!--</el-upload>-->

          <ul style="display: inline-block;width: 70%;list-style: none;padding: 0;margin: 0;">
            <li v-for="item in fileList">
              <a :href="item.url" target="_blank">{{item.name}}</a>
            </li>
          </ul>
        </div>
      </div>
      <p class="stepTitle">认款信息</p>
      <div class="stepDv">
        <div class="selectDv">
          <span>认款方式：</span>
          <el-select v-model="rec_type" placeholder="请选择">
            <el-option key="1" label="分销商预存款" value="1"></el-option>
            <!--<el-option key="2" label="票付通余额支付" value="2"></el-option>-->
          </el-select>
        </div>
        <div class="selectDv" v-if="rec_type == '1'">
          <span>分销商：</span>
          <el-autocomplete class="search_input" v-model="distributor" :fetch-suggestions="querySearchD" placeholder="请输入操作人员" @select="handleSelectD" @blur="blurHand"></el-autocomplete>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
  import {formatDate} from '@/js/libs/publicMethod.js'
  export default {
    name: "tradeAdd",
    components: {
    },
    props: {
      dialogFormVisible: false,
      info: ''
    },
    data() {
      return {

        baseInfo: {// 基础信息
          status_rece: '',
          rece_code: '',
          create_uid: '',
          created_at: '',
          receivables_at: '',
          account_id: '',
          account: '',
          rece_money: '',
          remain_money: '',
          remark: '',
          explain: ''
        },

        fileList: [],// 凭证列表

        rec_type: '1',// 认款方式

        distributor: '',// 选择的分销商
        distributorID: '',// 选择的分销商ID
        distributorList: [],// 分销商列表

      }
    },
    computed: {
      // 计算属性的 getter
    },
    watch: {
      info: {
        handler:function(){
//          alert(this.info);
          if(this.info != '' && this.dialogFormVisible){
            this.loadData();
            this.loadDistributor();
          }
        }
      }
    },
    methods: {
      // 表格头部背景颜色
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#F7F7F7;color:rgb(85, 85, 85);'
        } else {
          return ''
        }
      },
      // 关闭弹窗
      closeAdd(){
        this.distributor = '';
        this.distributorID = '';
        this.$emit('close', false);
      },

      // 认款提交
      submitBtn(){
        const that = this;
        if(this.distributorID === '' && this.rec_type === "1"){
          that.$message({
            type: 'warning',
            message: '分销商不能为空！'
          });
          return;
        }
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/oprecognition/op-recognition/confirmrec", {
          "id": this.info,
          "rec_type": this.rec_type,
          "distributor_code": this.distributorID,
          "create_uid": sessionStorage.getItem('id'),
          "org_id": sessionStorage.getItem('orgID')
        }, ).then(function(response) {
          console.log('认款结果',response);
          if (response.data.code == '200') {
            that.$message({
              type: 'success',
              message: "提交认款成功~"
            });
            that.closeAdd();
          } else {
            if(response.data.message){
              that.$message({
                type: 'warning',
                message: response.data.message
              });
            }else{
              that.$message({
                type: 'warning',
                message: "提交认款失败~"
              });
            }
          }
        }).catch(function(error) {
          console.log(error);
        });
      },

      // 分销商选择
      querySearchD(queryString, cb){
        const distributorList = this.distributorList;
        var results = queryString ? distributorList.filter(this.createFilter1(queryString)) : distributorList;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter1(queryString) {
        return (distributorList) => {
          return (distributorList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelectD(item){
        console.log(item);
        this.distributorID = item.id;
      },
      blurHand(){
        const that = this;
        let ida = '';
        if(that.distributor == ''){
          that.distributorID = '';
        }else{
          this.operatorList.forEach(function (item, index, arr) {
            if(that.distributor == item.value){
              ida = item.id;
            }
          });
          if(ida){
            that.distributorID = ida;
          }else{
            that.distributorID = '';
          }
        }
      },

      // 加载基础数据
      loadData(){
        const that = this;
        // 获取基本信息
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/predeposit/predeposit/viewbasic", {
          "id": this.info
        }, ).then(function(response) {
          console.log('详情',response);
          if (response.data.code == '200') {
            response.data.data.created_at = formatDate(new Date(response.data.data.created_at*1000));
            response.data.data.receivables_at = formatDate(new Date(response.data.data.receivables_at*1000));
            that.baseInfo = {
              status_rece: response.data.data.status_rece,
              rece_code: response.data.data.rece_code,
              create_uid: response.data.data.create_uid,
              created_at: response.data.data.created_at,
              receivables_at: response.data.data.receivables_at,
              account_id: response.data.data.account_id,
              account: response.data.data.account_id,
              rece_money: response.data.data.rece_money,
              remain_money: response.data.data.rece_money,
              remark: response.data.data.remark,
              explain: response.data.data.explain
            };
            // 根据ID获取人名
            that.$http.post(that.GLOBAL.serverSrc + "/org/api/userget", {
              "id": response.data.data.create_uid
            },{
              headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
              }
            }).then(function(response) {
              console.log('名字',response.data.object.name);
              if (response.data.isSuccess) {
                that.baseInfo.create_uid = response.data.object.name;
              } else {
                that.$message.warning("失败~");
              }
            }).catch(function(error) {
              console.log(error);
            });
            // 根据账户ID获取账户名称
            that.$http.post(that.GLOBAL.serverSrc + "/finance/collectionaccount/api/get",
              {
                "id": response.data.data.account_id
              },{
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
              }).then(function (obj) {
//                that.tableDataZH = obj.data.objects;
              console.log('账户查询',obj);
              if(obj.data.isSuccess){
                that.baseInfo.account = obj.data.object.title;
              }
            }).catch(function (obj) {
              console.log(obj)
            });
            // 凭证
            that.fileList = response.data.data.file;
            for(let i = 0; i < that.fileList.length; i++){
              that.fileList[i].url = that.GLOBAL.serverSrcPhp + that.fileList[i].url;
            }
          } else {
            that.$message.success("加载数据失败~");
          }
        }).catch(function(error) {
          console.log(error);
        });
      },

      // 加载分销商信息
      loadDistributor(name){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrc + "/universal/localcomp/api/list", {
          object: {
            "name": name,
            "isDeleted": 0
          }
        }).then(function(obj) {
          console.log('获取分销商',obj);
          if(obj.data.isSuccess){
            let distributorObj = [];
            obj.data.objects.forEach(function (item, index, arr) {
              const distributor = {
                'value' : item.name,
                'id' : item.id
              };
              distributorObj.push(distributor);
            });
            that.distributorList = distributorObj;
          }
        }).catch(function(obj) {
          console.log(obj);
        });
      }
    },
    created() {

    },
    mounted() {

    }
  }

</script>
<style lang="scss">
  #tradeDetail .el-dialog{
    width: 90%;
  }
  #tradeDetail .stepTitle{
    width: 94%;
    line-height: 45px;
    font-size: 18px;
    text-indent: 20px;
    margin: 0 auto;
  }
  #tradeDetail .stepDv{
    width: 94%;
    margin: 0 auto;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;
    .selectDv{
      width: 100%;
      overflow: hidden;
      margin-bottom: 20px;
      span{
        display: inline-block;
        width: 80px;
      }
      .el-select{
        width: 300px;
      }
    }
    .inputLabel{
      width: 31%;
      font-size: 14px;
      line-height: 45px;
      margin: 0;
      vertical-align: top;
      span{
        display: inline-block;
        width: 120px;
      }
    }
    .baseIn{
      width: 300px;
      vertical-align: top;
      margin: 10px auto;
    }
    .upload-demo{
      width: 80%;
      display: inline-block;
      margin: 10px auto;
    }
  }
  #tradeDetail .el-upload-list__item{
    margin-top: 10px !important;
  }
  #tradeDetail .el-upload-list__item{
    width: 100%!important;
  }
  .lineTitle{
    width: 100%;
    margin: 10px auto;
    background-color: #E6F3FC;
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
    padding: 0 10px;
  }

</style>
