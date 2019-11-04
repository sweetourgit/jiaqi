<template>
  <div class="vivo" style="position:relative">
    <!--申请预付款-->
    <el-dialog title="选择付款账户" :visible="dialogFormVisible2" style="margin:-80px 0 0 0;" custom-class="city_list" :show-close="false" width="70%" @close="close">
      <div class="buttonDv">
        <el-button class="el-button" type="warning" @click="close">取 消</el-button>
      </div>
      <div class="table_trip" style="width: 100%;">
        <el-table ref="singleTable" :data="tableDataZH" border style="width: 100%;margin-bottom: 28px;" :highlight-current-row="true" :header-cell-style="getRowClass">
          <el-table-column prop="cardType" label="类型" align="center" >
            <template slot-scope="scope">
              <span v-if="scope.row.cardType===1">收款</span>
              <span v-if="scope.row.cardType===2">付款</span>
              <span v-if="scope.row.cardType===3">应收</span>
              <span v-if="scope.row.cardType===4">应付</span>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="账号名称" align="center">
          </el-table-column>
          <el-table-column prop="cardNum" label="卡号" align="center" width="70%">
          </el-table-column>
          <el-table-column prop="openingBank" label="开户行" align="center">
          </el-table-column>
          <el-table-column prop="openingName" label="开户人" align="center">
          </el-table-column>
          <el-table-column prop="option" label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button @click="chooseBtn(scope.row)" type="danger" size="small" class="table_details">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
  export default {
    name: "newTour",
    components: {},
    props: {
      dialogFormVisible2: false,
      info: ''
    },
    data() {
      return {
        tableDataZH: []
      }
    },
    computed: {
      // 计算属性的 getter
    },
    watch: {
      dialogFormVisible2: {
        handler: function () {
          if(this.dialogFormVisible2){
            this.loadData();
          }
        }
      }
    },
    methods: {
      // 表格头部背景颜色
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex === 0) {
          return 'background:#F7F7F7;color:rgb(85, 85, 85);'
        } else {
          return ''
        }
      },
      loadData(){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrc + "/finance/collectionaccount/api/list", {
          "object": {
            "isDeleted": 0
          },
        },).then(function (obj) {
          console.log(obj);
          if(obj.data.isSuccess){
            that.tableDataZH = obj.data.objects;
          }else{
            that.$message.warning("加载账户信息失败");
          }
        }).catch(function (obj) {
          console.log(obj)
        })
      },
      close(){
        this.$emit('close', false);
      },
      chooseBtn(row){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcPhp + '/api/v1/loan/periphery-loan/choiceaccount', {
          "id": this.info,
          "create_uid": sessionStorage.getItem('id'),
          "org_id": sessionStorage.getItem('orgID'),
          "type": row.cardType,
          "account": row.title,
          "card": row.cardNum,
          "bank": row.openingBank,
          "user": row.openingName
        },{
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          }
        }).then(res => {
          console.log(res);
          if (res.data.code == 200) {
            that.$message({
              type: 'success',
              message: '提交成功!'
            });
            that.close();
          } else {
            if(res.data.message){
              that.$message({
                type: 'warning',
                message: res.data.message
              });
            }else{
              that.$message({
                type: 'warning',
                message: '创建失败'
              });
            }
          }
        }).catch(err => {
          console.log(err)
        });
      },
    },
    created() {

    },
    mounted() {

    }
  }

</script>
<style scoped>
  .buttonDv {
    position: absolute;
    top: 8px;
    right: 3%;
  }
</style>
