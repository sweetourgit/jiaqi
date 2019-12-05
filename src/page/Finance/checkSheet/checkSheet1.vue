<template>
  <div class="all">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!--报账单-->
      <el-tab-pane label="报账单" name="first">
        <div class="borders">
          <div class="search">
            <el-row>
              <el-col :span="7">
                <span class="search_style">团期计划：</span>
                <el-input v-model="plan" placeholder="请输入内容" class="search_input"></el-input>
              </el-col>
              <el-col :span="7">
                <span class="search_style">报账人：</span>
                <!--<el-input v-model="reimbursementPer" placeholder="请输入内容" class="search_input"></el-input>-->
                <el-autocomplete class="search_input" v-model="reimbursementPer" :fetch-suggestions="querySearchOper" placeholder="请输入操作人员" @select="handleSelectOper" @blur="blurHand"></el-autocomplete>
              </el-col>
              <el-col :span="9">
                <span class="search_style">发起时间：</span>
                <el-date-picker v-model="startTime" type="date" placeholder="请选择日期" class="start-time" :editable="disabled"></el-date-picker>
                <div class="date-line"></div>
                <el-date-picker v-model="endTime" type="date" placeholder="请选择日期" class="start-time" :editable="disabled"></el-date-picker>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="7">
                <span class="search_style">产品名称：</span>
                <el-input v-model="productName" placeholder="请输入内容" class="search_input"></el-input>
              </el-col>
              <el-col :span="9" :offset="7">
                <el-button type="primary" @click="resetFun" plain class="buttonSearch">重置</el-button>
                <el-button type="primary" @click="searchFun" class="buttonSearch">搜索</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="table_style">
            <el-table :data="tableData" border :header-cell-style="getRowClass" v-loading="loading">
              <el-table-column prop="tour_no" label="团期计划" align="center"></el-table-column>
              <el-table-column prop="" label="状态" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.bill_status=='5'" style="color: #7F7F7F" >报账中</div>
                  <div v-if="scope.row.bill_status=='6'" style="color: #FF4A3D" >报账驳回</div>
                  <div v-if="scope.row.bill_status=='7'" style="color: #33D174" >已报账</div>
                  <div v-if="scope.row.bill_status=='8'" style="color: #66b1ff" >已回冲</div>
                </template>
              </el-table-column>
              <el-table-column prop="product_name" label="产品名称" align="center"></el-table-column>
              <el-table-column prop="create_uid" label="申请人" align="center"></el-table-column>
              <el-table-column prop="created_at" label="申请时间" align="center"></el-table-column>
              <el-table-column prop="mark" label="审批意见" align="center"></el-table-column>
              <el-table-column prop="opinion" label="操作" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.bill_status=='5'">
                    <el-button @click="approve(scope.row)" type="text" size="small" class="table_details">审批</el-button>
                  </div>
                  <div v-if="scope.row.bill_status=='7' || scope.row.bill_status=='8'">
                    <el-button @click="detail(scope.row)" type="text" size="small" class="table_details">详情</el-button>
                    <el-button @click="recoilloan(scope.row)" type="text" size="small" class="table_details" v-if="scope.row.bill_status=='7'">回冲借款单</el-button>
                  </div>
                  <div v-if="scope.row.bill_status=='6'" style="color: #FF4A3D" ></div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-sizes="[10, 20, 50, 100]"
              :page-size= pageSize
              layout="total, sizes, prev, pager, next, jumper"
              :total=pageCount
              background>
            </el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <!--报账单end-->

      <!--需要你审批-->
      <el-tab-pane :label="'需要您审批 ('+number+')'" name="second">
        <NeedApproval ref="needApproval"></NeedApproval>
      </el-tab-pane>
      <!--审批end-->
    </el-tabs>
    <checkSheetPreview :dialogFormVisible="dialogFormVisible" @close="closeFun" :info="info"></checkSheetPreview>
  </div>
</template>

<script>
    import NeedApproval from '@/page/Finance/checkSheet/needApproval';
    import checkSheetPreview from '@/page/Finance/checkSheet/checkSheetPreview';
    import {formatDate} from '@/js/libs/publicMethod.js'
    export default {
      name: "checkSheet",
      components:{
        NeedApproval,
        checkSheetPreview
      },
      data() {
        return {
          disabled: false,
          // 报账单需要审批数量
          number: 0,
          // 搜索字段
          plan: '',
          reimbursementPer: '',
          productName: '',
          startTime: '',
          endTime: '',
          reimbursementPerID: '',
          operatorList: [],
          // 切换字段
          activeName: 'first',
          // 分页字段
          pageSize: 10,
          currentPage: 1,
          pageCount: 0,
          // 弹出层字段
          dialogFormVisible: false,
          info: '',
          // 报账单table
          tableData: [],
          loading: true
        };
      },
      watch: {
        number: {
          handler:function(){
            this.reimList();
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
        // tab栏点击事件
        handleClick(tab, event) {
//          console.log(tab, event);
        },
        // 操作人员
        querySearchOper(queryString, cb){
          const operatorList = this.operatorList;
          var results = queryString ? operatorList.filter(this.createFilter1(queryString)) : operatorList;
          // 调用 callback 返回建议列表的数据
          cb(results);
        },
        createFilter1(queryString) {
          return (operatorList) => {
            return (operatorList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
          };
        },
        handleSelectOper(item){
          console.log(item);
          this.reimbursementPerID = item.id;
        },
        blurHand(){
          const that = this;
          let ida = '';
          if(that.reimbursementPer == ''){
            that.reimbursementPerID = '';
          }else{
            this.operatorList.forEach(function (item, index, arr) {
              if(that.reimbursementPer == item.value){
                ida = item.id;
              }
            });
            if(ida){
              that.reimbursementPerID = ida;
            }else{
              that.reimbursementPerID = '';
            }
          }
        },
        // 搜索
        searchFun(){
          this.loading = true;
          this.reimList();
        },
        resetFun(){
          this.loading = true;
          this.plan = '';
          this.reimbursementPer = '';
          this.productName = '';
          this.startTime = '';
          this.endTime = '';
          this.reimbursementPerID = '';
          this.reimList();
        },
        handleSizeChange(val) {
          this.loading = true;
          this.pageSize = val;
          this.currentPage = 1;
          this.reimList()
        },
        handleCurrentChange(val) {
          this.loading = true;
          this.currentPage = val;
          this.reimList()
        },
        // 获取报账单列表数据
        reimList(){
          const that = this;
          this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/checksheet/bill/listpage", {
            "pageIndex": this.currentPage,
            "pageSize": this.pageSize,
            "product_name": this.productName,
            "tour_no": this.plan,
            "start_time": this.startTime,
            "end_time": this.endTime,
            "create_uid": this.reimbursementPerID,
            "bill_status": '5,6,7,8'
          }, ).then(function(response) {
//            console.log(response);
            if (response.data.code == '200') {
              console.log(response);
              that.loading = false;
              that.tableData = response.data.data.list;
              that.pageCount = response.data.data.total - 0;
              that.tableData.forEach(function (item, index, arr) {
//                item.begin_at = formatDate(new Date(item.begin_at*1000));
//                item.begin_at = item.begin_at.split(" ")[0];
//                item.end_at = formatDate(new Date(item.end_at*1000));
//                item.end_at = item.end_at.split(" ")[0];
                item.createName = item.create_uid;

                item.created_at = formatDate(new Date(item.created_at*1000));
                item.created_at = item.created_at.split(" ")[0];

                that.$http.post(that.GLOBAL.serverSrcZb + "/org/api/userget", {
                  "id": item.create_uid
                },{
                  headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                  }
                }).then(function(response) {

                  if (response.data.isSuccess) {
                    item.create_uid = response.data.object.name
                  } else {
                    that.$message.warning("加载数据失败~");
                  }
                }).catch(function(error) {
                  console.log(error);
                });
              })
            } else {
              that.$message.warning("加载数据失败~");
            }
          }).catch(function(error) {
            console.log(error);
          });
        },
        // 审批报账单
        approve(res){
          console.log(res);
          this.info = res;
          this.dialogFormVisible = true;
//          name: "Result",
//          query: { name: 'name' },
//          params: { usersitelist: 'userlist' }
        },
        // 详情
        detail(res){
          console.log(res);
          this.info = res;
          this.dialogFormVisible = true;
        },
        // 关闭
        closeFun() {
          this.dialogFormVisible = false;
          this.reimList();
//          alert(this.$refs.needApproval.pageSize);
          this.$refs.needApproval.loadData();
        },
        loadOper(){
          const that = this;
          this.$http.post(this.GLOBAL.serverSrcZb + "/org/api/userlist", {
            "object": {
              "id": 0,
              "createTime": '2019-08-23T03:03:10.386Z',
              "isDeleted": 0,
              "code": "",
              "mobile": "",
              "name": "",
              "email": "",
              "userCode": "",
              "passWord": "",
              "iDcard": "",
              "tourGuide": "",
              "sex": 0,
              "userType": 0,
              "userState": 0,
              "orgID": 0,
              "orgName": "",
              "user_Position": [
                {
                  "id": 0,
                  "userID": 0,
                  "positionID": 0,
                  "positionName": "",
                  "isDefault": 0,
                  "orgID": 0,
                  "orgName": ""
                }
              ]
            }
          },{
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
          }).then(function(response) {

            if (response.data.isSuccess) {
//            console.log('操作人员列表',response.data.objects);
              let operatorList = [];
              response.data.objects.forEach(function (item, index, arr) {
                const operator = {
                  'value' : item.name,
                  'id' : item.id
                };
                operatorList.push(operator);
              });
              that.operatorList = operatorList;
            } else {
              that.$message.success("加载数据失败~");
            }
          }).catch(function(error) {
            console.log(error);
          });
        },
        // 借款单回冲
        recoilloan(row){
          const that = this;
          console.log(row);
          this.$confirm("是否回冲此报账单?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/checksheet/bill/recoilloan", {
              "id": row.id
            }, ).then(function(response) {
              console.log('回冲报账单',response);
              if (response.data.code == '200') {
                that.$message.success("回冲报账单成功~");
                that.reimList();
//                that.closeAdd();
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
          }).catch(() => {
            that.$message.success("已取消此操作~");
          });
        }

      },
      created(){
          this.reimList();
          this.loadOper();
      }

    }
</script>

<style scoped>
  .borders{
    overflow: hidden;
    border: 1px solid #E6E6E6;
    margin-bottom: 30px;
    margin-top: 25px;
  }
  .search{
    float: left;
    margin-top: 30px;
    width: 100%;
  }
  .date-line {
    width: 10px;
    border-bottom: 1px solid #e6e6e6;
    display: inline-block;
    margin: 0 3px 3px 0
  }
  .table_style{
    width: 100%;
    padding: 0 20px;
    float: left;
    box-sizing: border-box;
  }
  .el-row{
    margin-bottom: 20px;
  }
  .search_style{
    /*float: left;*/
    margin-top: 10px;
    margin-left: 20px;
    font-size: 14px;
    display: inline-block;
    width: 100px;
  }
  .search_input{
    /*float: left;*/
    width: 65%;
  }
  .start-time{
    width: 32.5%;
    margin: 0;
  }
  .buttonSearch{
    float: right;
    margin-right: 20px;
  }
  .block{
    float: left;
    margin-left: 600px;
    margin-top: 70px;
    margin-bottom: 30px;
  }

</style>
