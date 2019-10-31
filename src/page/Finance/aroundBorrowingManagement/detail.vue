<template>
  <div class="vivo" style="position:relative" id="collectionDetail">
    <el-dialog title="详情" :visible="dialogFormVisible1" @close="closeAdd" custom-class="city_list" :show-close="false" style="margin:-80px 0 0 0;width: 100%;">
      <div class="buttonDv">
        <el-button type="primary" @click="closeAdd" style="margin-right: 10px" plain>取消</el-button>
        <!--<el-button type="primary" @click="deleteDo" v-if="baseInfo.approved != 1">删除</el-button>-->
        <el-button type="primary" @click="backoutBtn">撤销</el-button>
      </div>
      <!--<p class="stepTitle">基本信息</p>-->
      <el-divider content-position="left">基本信息</el-divider>
      <el-button type="warning" round size="mini" style="margin-left: 4%;" v-if="baseInfo.status_rece == 10">驳回</el-button>
      <el-button type="info" round size="mini" style="margin-left: 4%;" v-if="baseInfo.status_rece == 11">审批中</el-button>
      <el-button type="success" round size="mini" style="margin-left: 4%;" v-if="baseInfo.status_rece == 12">通过</el-button>
      <div class="stepDv">
        <p class="inputLabel"><span>ID：</span>{{baseInfo.rece_code}}</p>
        <p class="inputLabel"><span>申请人：</span>{{baseInfo.create_uid}}</p>
        <p class="inputLabel"><span>申请时间：</span>{{baseInfo.created_at}}</p>
        <p class="inputLabel"><span>供应商：</span>{{baseInfo.created_at}}</p>
        <p class="inputLabel"><span>借款类型：</span>{{baseInfo.type}}</p>
        <p class="inputLabel"><span>借款金额：</span>{{baseInfo.rece_money}}</p>
        <p class="inputLabel"><span>摘要：</span>{{baseInfo.remark}}</p>
        <p class="inputLabel"><span>账号：</span>{{baseInfo.remark}}</p>
        <p class="inputLabel"><span>开户行：</span>{{baseInfo.remark}}</p>
        <p class="inputLabel"><span>开户名：</span>{{baseInfo.remark}}</p>
        <p class="inputLabel"><span>支付账户：</span>{{baseInfo.account}}</p>
        <p class="inputLabel"><span>已报销金额：</span>{{baseInfo.rece_money}}</p>

        <div class="inputLabel">
          <span>附件：</span>
          <!--<el-upload ref="upload1" class="upload-demo" action="" :file-list="fileList" :disabled="disabled">-->
          <!--<el-button size="small" type="primary" :disabled="disabled">点击上传</el-button>-->
          <!--</el-upload>-->

          <ul>
            <li v-for="item in fileList">
              <a :href="item.url" target="_blank">{{item.name}}</a>
            </li>
          </ul>
        </div>
      </div>

      <el-divider content-position="left">审核结果</el-divider>
      <div class="stepDv bottomDis">
        <el-table ref="singleTable" :data="tableDataResult" border style="width: 96%;margin: 0 auto;" :header-cell-style="getRowClass">
          <el-table-column prop="order_sn" label="审批时间" align="center" >
          </el-table-column>
          <el-table-column prop="order_sn" label="审批人" align="center" >
          </el-table-column>
          <el-table-column prop="product_name" label="审批结果" align="center">
          </el-table-column>
          <el-table-column prop="income" label="审批意见" align="center">
          </el-table-column>
        </el-table>
      </div>

      <div v-if="baseInfo.status_rece == 12">
        <el-divider content-position="left">相关信息</el-divider>
        <div class="stepDv bottomDis">
          <el-table ref="singleTable" :data="tableDataRelated" border style="width: 96%;margin: 0 auto;" :header-cell-style="getRowClass">
            <el-table-column prop="order_sn" label="审批时间" align="center" >
            </el-table-column>
            <el-table-column prop="order_sn" label="审批人" align="center" >
            </el-table-column>
            <el-table-column prop="product_name" label="审批结果" align="center">
            </el-table-column>
            <el-table-column prop="income" label="审批意见" align="center">
            </el-table-column>
          </el-table>
        </div>
      </div>



    </el-dialog>
  </div>
</template>
<script type="text/javascript">
  import {formatDate} from '@/js/libs/publicMethod.js'
  export default {
    name: "collectionDetail",
    components: {
    },
    props: {
      dialogFormVisible1: false,
      info: ''
    },
    data() {
      return {
        disabled: true,
        // 基础信息
        baseInfo: {
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
          explain: '',
          rec_mode: '',
          rec_uid: '',
          rec_created_at: '',
          distributor: '',
          distributor_code: '',
          dateQuantun: ''
        },
        // 认款方式array
        recModeList: {
          '1': '分销商预存款',
          '2': '票付通余额支付',
          '3': '订单收款'
        },
        // 基础信息凭证
        fileList: [],
        // 审核结果，table数据
        tableDataResult: [],
        // 相关信息，table数据
        tableDataRelated: []
      }
    },
    computed: {
      // 计算属性的 getter
    },
    watch: {
      info: {
        handler:function(){
//          alert(this.info);
          if(this.info != '' && this.dialogFormVisible1){
            this.loadData();
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
        this.baseInfo = {
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
          explain: '',
          rec_mode: '',
          rec_uid: '',
          rec_created_at: '',
          distributor: '',
          distributor_code: ''
        };

        this.$emit('close', false);
      },

      // 撤销操作
      backoutBtn(){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/predeposit/predeposit/deldeposit", {
          "id": this.info
        }, ).then(function(response) {
          console.log('待认款收款撤销操作',response);
          if (response.data.code == '200') {
            that.$message.success("撤销成功~");
            that.closeAdd();
          } else {
            if(response.data.message){
              that.$message.warning(response.data.message);
            }else{
              that.$message.warning("撤销失败~");
            }

          }
        }).catch(function(error) {
          console.log(error);
        });
      },

      // 加载数据
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
            if(response.data.data.rec_created_at){
              response.data.data.rec_created_at = formatDate(new Date(response.data.data.rec_created_at*1000));
            }
            if(response.data.data.rece_start){
              response.data.data.rece_start = formatDate(new Date(response.data.data.rece_start*1000));
              response.data.data.rece_start = response.data.data.rece_start.split(" ")[0];
              response.data.data.rece_end = formatDate(new Date(response.data.data.rece_end*1000));
              response.data.data.rece_end = response.data.data.rece_end.split(" ")[0];
            }
            that.baseInfo = {
              status_rece: response.data.data.status_rece,
              rece_code: response.data.data.rece_code,
              create_uid: response.data.data.create_uid,
              created_at: response.data.data.created_at,
              receivables_at: response.data.data.receivables_at,
              account_id: response.data.data.account_id,
              account: response.data.data.account_id,
              rece_money: response.data.data.rece_money,
              remain_money: response.data.data.leave_match_money,
              remark: response.data.data.remark,
              explain: response.data.data.explain,
              rec_mode: that.recModeList[response.data.data.rec_mode],
              rec_uid: response.data.data.rec_uid,
              rec_created_at: response.data.data.rec_created_at,
              distributor: response.data.data.distributor,
              distributor_code: response.data.data.distributor_code,
              dateQuantun: response.data.data.rece_start + '-' + response.data.data.rece_end
            };

            // 根据ID获取人名
            that.getName(response.data.data.create_uid).then(res => {
              console.log(res);
              that.baseInfo.create_uid = res;
            });
            if(response.data.data.rec_uid){
              that.getName(response.data.data.rec_uid).then(res => {
                console.log(res);
                that.baseInfo.rec_uid = res;
              });
            }

            // 根据分销商ID获取名称
            if(response.data.data.distributor_code){
              that.$http.post(that.GLOBAL.serverSrc + "/universal/localcomp/api/get", {
                "id": response.data.data.distributor_code
              }).then(function(obj) {
//              console.log('获取分销商',obj);
                if(obj.data.isSuccess){
                  that.baseInfo.distributor_code = obj.data.object.name;
                }else{
                  that.$message.warning("加载数据失败~");
                }
              }).catch(function(obj) {
                console.log(obj);
              });
            }

            // 根据账户ID获取账户名称
            that.$http.post(that.GLOBAL.serverSrc + "/finance/collectionaccount/api/get",
              {
                "id": response.data.data.account_id
              },{
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
              }).then(function (obj) {
//              console.log('账户查询',obj);
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

      // 根据id获取操作人
      getName(id){
        const that = this;
        return that.$http.post(that.GLOBAL.serverSrc + "/org/api/userget", {
          "id": id
        },{
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          }
        }).then(function(response) {
          console.log('名字',response.data.object.name);
          if (response.data.isSuccess) {
            return response.data.object.name;
          } else {
            that.$message.warning("失败~");
            return '';
          }
        }).catch(function(error) {
          console.log(error);
          return '';
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
  #collectionDetail .el-dialog{
    width: 90%;
  }
  #collectionDetail .stepTitle{
    width: 94%;
    line-height: 45px;
    font-size: 18px;
    text-indent: 20px;
    margin: 0 auto;
  }
  #collectionDetail .stepDv{
    width: 94%;
    margin: 0 auto;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;
    .inputLabel{
      width: 31%;
      font-size: 14px;
      line-height: 45px;
      margin: 0;
      vertical-align: top;
      span{
        display: inline-block;
        width: 120px;
        vertical-align: top;
      }
      ul{
        display: inline-block;
        width: 70%;
        list-style: none;
        padding: 0;
        margin: 0;
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
  #collectionDetail .bottomDis{
    margin-bottom: 50px;
  }
  #collectionDetail .buttonDv{
    position: absolute;
    top: 8px;
    right: 3%;
  }
  #collectionDetail .el-divider__text, #tradeAdd .el-link{
    font-size: 16px;
  }
  #collectionDetail .el-upload-list__item{
    margin-top: 10px !important;
  }
  #collectionDetail .el-upload-list__item{
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
