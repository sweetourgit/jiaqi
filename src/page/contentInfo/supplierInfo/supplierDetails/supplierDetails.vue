<template>
  <div v-if="flag" class="dialog">
    <el-dialog title="详情"
               :visible.sync="supplierDialog"
               custom-class="city_list dialogOrder"
               width="1200px"
               :close-on-click-modal="false">
      <div class="supplierButton">
        <el-button @click="hideFlag">关 闭</el-button>
        <el-button type="primary" @click="fatherMethod">编 辑</el-button>
      </div>
      <div class="title">基本信息</div>
      <div class="pro-info">
        <table width="100%">
          <tr>
            <td width="33%">
              <div class="teampreview">ID:</div>
              <div class="fl ml13">{{teampreviewData.id}}</div>
            </td>
            <td width="33%">
              <div width="80" class="teampreview">状态:</div>
              <div class="ml13 fl">
                <div v-if="teampreviewData.userState == '0'">等待审核</div>
                <div v-if="teampreviewData.userState == '1'">正常</div>
                <div v-if="teampreviewData.userState == '2'">停用</div>
              </div>
            </td>
            <td width="33%">
              <div width="80" class="teampreview">公司可见性:</div>
              <div class="fl ml13">{{teampreviewData.companyAreaEX}}</div>
            </td>
          </tr>
          <tr>
            <td width="33%">
              <div width="80" class="teampreview">供应商名称:</div>
              <div class="fl ml13">{{teampreviewData.name}}</div>
            </td>
            <td width="33%">
              <div width="80" class="teampreview">类别:</div>
              <div class="fl ml13" v-for="item in types">{{item.supplierTypeEX}}</div>
            </td>
            <td width="33%">
              <div width="80" class="teampreview">结算方式:</div>
              <div class="fl ml13">{{teampreviewData.isMonthlyEX}}</div>
            </td>
          </tr>
          <tr>
            <td width="33%">
              <div width="80" class="teampreview">使用部门:</div>
              <div class="fl ml13" v-for="item in orgs">{{item.orgName}}</div>
            </td>
            <td width="33%">
              <div width="80" class="teampreview">到期日期:</div>
              <div class="fl ml13">{{teampreviewData.expireTime}}</div>
            </td>
            <td width="33%">
              <div width="80" class="teampreview">法人代表:</div>
              <div class="fl ml13">{{teampreviewData.legalPerson}}</div>
            </td>
          </tr>
          <tr>
            <!-- <td width="33%">
              <div width="80" class="teampreview">合同:</div>
              <div class="fl ml13"></div>
            </td> -->
            <td width="33%">
              <div width="80" class="teampreview">合同编号:</div>
              <div class="fl ml13">{{teampreviewData.taxNumber}}</div>
            </td>
            <td width="33%">
              <div width="80" class="teampreview">供应商协议:</div>
              <div class="fl ml13" v-if="teampreviewData.isAgree == '0'">未选择/待审核</div>
              <div class="fl ml13" v-if="teampreviewData.isAgree == '1'">是</div>
              <div class="fl ml13" v-if="teampreviewData.isAgree == '2'">否</div>
            </td>
            <td width="33%">
              <div width="80" class="teampreview">操作负责人:</div>
              <div class="fl ml13">{{teampreviewData.billName}}</div>
            </td>
          </tr>
          <tr>
            <td width="33%">
              <div width="80" class="teampreview">经手人:</div>
              <div class="fl ml13">{{teampreviewData.handPerson}}</div>
            </td>
            <td width="33%">
              <div width="80" class="teampreview">经手人电话:</div>
              <div class="fl ml13">{{teampreviewData.handPhone}}</div>
            </td>
            <td width="33%">
              <div width="80" class="teampreview">产品主要方向:</div>
              <div class="fl ml13">{{teampreviewData.productDirection}}</div>
            </td>
          </tr>
          <tr>
            <td width="33%">
              <div width="80" class="teampreview">负责人:</div>
              <div class="fl ml13">{{teampreviewData.leader}}</div>
            </td>
            <td width="33%">
              <div width="80" class="teampreview">负责人电话:</div>
              <div class="fl ml13">{{teampreviewData.phone}}</div>
            </td>
            <td width="33%">
              <div width="80" class="teampreview">供应商编码:</div>
              <div class="fl ml13">{{teampreviewData.supplierCode}}</div>
            </td>
          </tr>
          <tr>
            <td width="33%">
              <div width="80" class="teampreview">线路:</div>
              <div class="fl ml13">{{teampreviewData.productAreaEX}}</div>
            </td>
            <td width="33%">
              <div width="80" class="teampreview">备注:</div>
              <div class="fl ml13">{{teampreviewData.memo}}</div>
            </td>
            <td width="33%">
              <div class="teampreview">供应商其他名称:</div>
              <!-- <div class="fl ml13">{{alias}}</div> -->
              <div class="fl ml13" v-for="item in alias">{{item.name}} ,</div>
            </td>
          </tr>
          <tr>
            <td width="33%">
              <div width="80" class="teampreview">附件:</div>
              <div class="fl ml13">{{teampreviewData.productDirection }}</div>
            </td>
          </tr>
        </table>
      </div>
      <div class="title">账户信息</div>
      <el-table :data="accountTable" border class="tableData" :header-cell-style="getRowClass">
        <el-table-column prop="cardName" label="汇款户名" width="150" align="center"></el-table-column>
        <el-table-column prop="cardNumber" label="账号" width="300" align="center"></el-table-column>
        <el-table-column prop="bankName" label="开户行" width="150" align="center"></el-table-column>
        <el-table-column prop="memo" label="备注" width="150" align="center"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props:{
      msg:{
        type:[String,Number],
        default(){
          return ''
        }
      },
      flag:{
        type:Boolean,
        default() {
          return false
        }
      }
    },
    watch:{
      msg:function (val,oldval) {
        console.log('val', val);
        this.teamGetDetails(val);
      }
    },
    data(){
      return{
        supplierDialog:true,//详情弹窗
        teampreviewData:{},//基本信息数组
        accountTable:[],//账户信息表格
        types:[],//供应商类别数组
        orgs:[],//使用部门数组
        alias:[],//供应商其他名称数组
      }
    },
    methods:{
      //表格头部样式
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return "background:#F7F7F7;color:rgb(85, 85, 85);";
        } else {
          return "";
        }
      },
      hideFlag(){
        this.$emit("update:flag",false)
      },
      fatherMethod(){
        this.$parent.editClick()
      },
      //详情弹窗获取详情数据
      teamGetDetails(id){
        this.$http.post(this.GLOBAL.serverSrc + "/universal/supplier/api/supplierget", {
          id: id
        }).then(res => {
          console.log(res,4444)
            if (res.data.isSuccess == true) {
              this.teampreviewData = res.data.object;// 获取基本信息数据
              this.accountTable = res.data.object.banks;//获取账户信息数据
              this.alias= res.data.object.alias;//获取供应商其他名称数组
              this.types = res.data.object.types;//获取类别数组
              this.orgs = res.data.object.orgs;//获取使用部门数组
              // if(res.data.object){
              //
              // }
            }
          });
      },
    },

    mounted(){

    },
    created(){
      console.log('msg====', this.msg);
      // this.teamGetDetails();
  },

  }
</script>

<!-- <style scoped lang='stylus'> -->
<style>
.supplier{position:relative;}
/*详情按钮*/
.supplierButton{position:absolute; top:8px; right:15px;}
/*弹窗样式*/
.title{font-size: 14pt;}
.pro-info {font-size: 14px;margin: 20px 30px 10px 10px;line-height: 35px;}
.fl{float: left;}
.ml13{margin: 0 0 0 13px;}
.teampreview{ text-align:right; width: 120px;overflow: hidden;float: left;}
.tableData{margin: 30px 0 0 150px; width: 752px;}

</style>
