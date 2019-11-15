<template>
  <div class="vivo" style="position:relative" id="tradeDetail">
    <el-dialog title="详情" :visible="dialogFormVisible3" @close="closeAdd" custom-class="city_list" :show-close="false" style="margin:-80px 0 0 0;width: 100%;">
      <div class="buttonDv">
        <el-button type="primary" @click="closeAdd" style="margin-right: 10px" plain>取消</el-button>
        <!--<el-button type="primary" @click="deleteDo" v-if="baseInfo.approved != 1">删除</el-button>-->
        <el-button type="primary" @click="submitBtn">确认</el-button>
      </div>
      <!--<p class="stepTitle">基本信息</p>-->
      <el-divider content-position="left">基本信息</el-divider>
      <el-button type="warning" round size="mini" style="margin-left: 4%;" v-if="baseInfo.status_rece == 10">未认款</el-button>
      <el-button type="info" round size="mini" style="margin-left: 4%;" v-if="baseInfo.status_rece == 11">待认收款</el-button>
      <el-button type="success" round size="mini" style="margin-left: 4%;" v-if="baseInfo.status_rece == 12">已认完</el-button>
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
      <el-divider content-position="left">认款信息</el-divider>
      <div class="stepDv">
        <p class="inputLabel"><span>认款方式：</span>{{baseInfo.rec_mode}}</p>
        <p class="inputLabel"><span>认款人：</span>{{baseInfo.rec_uid}}</p>
        <p class="inputLabel"><span>认款时间：</span>{{baseInfo.rec_created_at}}</p>
        <p class="inputLabel"><span>分销商：</span>{{baseInfo.distributor}}</p>
      </div>

      <div class="stepDv bottom_dataDv">
        <p class="left_span"><span>*</span>款项入账时间段：</p>
        <el-date-picker v-model="startTime" type="date" placeholder="开始日期" class="start-time baseIn" :picker-options="startDatePicker" required></el-date-picker>
        <span class="lineSpan">--</span>
        <el-date-picker v-model="endTime" type="date" placeholder="结束日期" class="start-time baseIn" :picker-options="endDatePicker" required></el-date-picker>
        <p class="mark_p">导入明细，直接填充开始时间和结束时间</p>
        <br><br>
        <div v-if="baseInfo.distributor != '无'">
          <p class="left_span"><span>*</span>订单明细：</p>
          <el-upload ref="upload1" class="upload-demo" :action="UploadUrl()" :headers="headers" :on-success="handleSuccess" :on-error="handleError" :on-remove="handleRemove" :before-remove="beforeRemove" :on-exceed="handleExceed" :file-list="fileListUpload" :limit="1" required>
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <p class="stepTitle">收款明细</p>
          <div class="lineTitle"><i class="el-icon-info"></i>&nbsp;&nbsp;已关联&nbsp;{{totalItem}}&nbsp;项 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总计：{{totalMoney}}元  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收款入账时间段：{{startTimeTable}}--{{endTimeTable}}</div>
          <el-table ref="singleTable" :data="tableDataQK" border :header-cell-style="getRowClass" maxHeight="700">
            <el-table-column prop="1" label="入账时间" align="center">
            </el-table-column>
            <el-table-column prop="2" label="订单编号" align="center">
            </el-table-column>
            <el-table-column prop="3" label="客人名称" align="center">
            </el-table-column>
            <el-table-column prop="4" label="产品" align="center">
            </el-table-column>
            <el-table-column prop="5" label="结算金额" align="center">
              <template slot-scope="scope">
                <span>{{scope.row[5]}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="6" label="手续费" align="center">
              <template slot-scope="scope">
                <span>{{scope.row[6]}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="8" label="团号" align="center">
            </el-table-column>
            <el-table-column prop="9" label="粉联号" align="center">
            </el-table-column>
            <el-table-column prop="10" label="发票号" align="center">
            </el-table-column>
            <el-table-column prop="money" label="操作" align="center">
              <template slot-scope="scope">
                <p v-if="scope.row[0] == '已删除'">已删除</p>
                <el-button size="small" type="text" style="color: red;" @click="deleteBtn(scope)" v-else>删除</el-button>
              </template>
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
    name: "tradeAdd",
    components: {
    },
    props: {
      dialogFormVisible3: false,
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
        fileList: [],

        startTime: '',
        endTime: '',
        tableDataQK: [],
        totalItem: '0',
        totalMoney: '',
        startTimeTable: '',
        endTimeTable: '',
        deleteStr: '',
        fileListUpload: [],

        isEqual: true,

        // 认款方式array
        recModeList: {
          '1': '分销商预存款',
          '2': '票付通余额支付',
          '3': '订单收款'
        },

        startDatePicker: this.beginDate(),
        endDatePicker: this.processDate()
      }
    },
    computed: {
      // 计算属性的 getter
      headers(){
        return {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }
    },
    watch: {
      dialogFormVisible3: {
        handler:function(){
//          alert(this.info);
          if(this.info !== '' && this.dialogFormVisible3){
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

      submitBtn(){
        const that = this;
        if(this.startTime === '' || this.endTime === ''){
          that.$message.warning("款项入账时间段不能为空");
          return;
        }
        if(this.baseInfo.distributor != '无'){
          if(this.fileListUpload.length === 0){
            that.$message.warning("订单明细不能为空");
            return;
          }
        }
        if(!this.isEqual){
          that.$message.warning("收款金额和收款明细总金额不相等，不可提交！");
          return;
        }

        let fileArr = [];
        if(this.fileListUpload.length > 0){
          const fileItem = {
            name: this.fileListUpload[0].name,
            url: this.fileListUpload[0].response.data.file_url
          };
          fileArr.push(fileItem);
        }
        let data;
        if(this.deleteStr === ''){
          data = {
            "id": this.info,
            "rece_start": this.startTime,
            "rece_end": this.endTime,
            "file": fileArr,
            "rec_uid": sessionStorage.getItem('id')
          }
        }else{
//          alert(this.deleteStr.substr(this.deleteStr.length-1,1) === ',');
          if(this.deleteStr.substr(this.deleteStr.length-1,1) === ','){
            this.deleteStr = this.deleteStr.substr(0, this.deleteStr.length - 1);
          }

          data = {
            "id": this.info,
            "rece_start": this.startTime,
            "rece_end": this.endTime,
            "file": fileArr,
            "del_order": this.deleteStr,
            "rec_uid": sessionStorage.getItem('id')
          }
        }
//        console.log(data);
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/oprecognition/op-recognition/importdetails", data, ).then(function(response) {
          console.log('导入订单明细',response);
          if (response.data.code == '200') {
            that.$message({
              type: 'success',
              message: "导入订单明细成功~"
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
                message: "导入订单明细失败~"
              });
            }
          }
        }).catch(function(error) {
          console.log(error);
        });
      },
      // 关联订单
      UploadUrl(){
        return this.GLOBAL.serverSrcPhp + '/api/v1/receivables/receivables/files';
      },
      handleSuccess(response, file, fileList){
//        console.log(file);
//        console.log(fileList);
//        console.log('response',response);
        if(response.code == 200){
          this.fileListUpload = fileList;
          this.tableDataQK = file.response.data.list;
          this.totalItem = file.response.data.list.length;
          this.totalMoney = file.response.data.money;
          this.startTimeTable = formatDate(new Date(file.response.data.start*1000));
          this.startTimeTable = this.startTimeTable.split(' ')[0];
          this.endTimeTable = formatDate(new Date(file.response.data.end*1000));
          this.endTimeTable = this.endTimeTable.split(' ')[0];
          this.startTime = this.startTimeTable;
          this.endTime = this.endTimeTable;
          this.tableDataQK.forEach(function (item, index, arr) {
            item[1] = formatDate(new Date(item[1]*1000));
          });
          if(parseFloat(file.response.data.money) != parseFloat(this.baseInfo.rece_money)){
            this.$message.warning('收款金额和收款明细总金额不相等，不可提交！');
            this.isEqual = false;
          }else{
            this.isEqual = true;
          }
        }else{
          if(response.message){
            this.$message.warning(response.message);
          }else{
            this.$message.warning('文件上传失败');
          }
//          this.fileList = {};
          this.$refs.upload1.clearFiles();
        }
      },
      handleError(err, file, fileList){
        this.$message.warning(`文件上传失败，请重新上传！`);
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
        this.tableDataQK = [];
        this.totalItem = '';
        this.totalMoney = '';
        this.startTimeTable = '';
        this.endTimeTable = '';
        this.startTime = '';
        this.endTime = '';
        this.fileListUploadv = [];
      },
      handleExceed(files, fileList) {
        this.$message.warning(`平台订单只支持一个附件上传！`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      // 删除明细信息
      deleteBtn(scope){
        const that = this;
        this.$confirm("是否删除此明细?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          console.log(scope.row[2]+'======'+scope.$index);
//          that.tableDataQK.splice(scope.$index,1);
          this.$set(that.tableDataQK[scope.$index],'0','已删除');
          if(that.deleteStr.substr(that.deleteStr.length-1,1) === ',' || that.deleteStr === ''){
            that.deleteStr += scope.$index + ',';
          }else{
            that.deleteStr += ',' + scope.$index + ',';
          }

          let num = parseInt(that.totalItem);
          num--;
          that.totalItem = num;
//          console.log(num);
          let totalMoney = that.totalMoney;
          totalMoney = parseFloat(totalMoney) - parseFloat(scope.row[5]);
          that.totalMoney = totalMoney.toFixed(2);
//          console.log(parseFloat(totalMoney),parseFloat(scope.row[5]),parseFloat(totalMoney)-parseFloat(scope.row[5]));
          let start = that.tableDataQK[0][1];
          let end = that.tableDataQK[0][1];
          that.tableDataQK.forEach(function (item, index, arr) {
            if(item[0] != '已删除'){
              if(new Date(Date.parse(start)) > new Date(Date.parse(item[1]))){
                start = item[1];
              }
              if(new Date(Date.parse(end)) < new Date(Date.parse(item[1]))){
                end = item[1];
              }
            }
          });
//          console.log(totalMoney.toFixed(2),start,end);
          that.totalMoney = totalMoney.toFixed(2);
          that.startTimeTable = start.split(' ')[0];
          that.endTimeTable = end.split(' ')[0];
          if(that.totalMoney != that.baseInfo.rece_money){
//            this.$message.warning('收款金额和收款明细总金额不相等，不可提交！');
            this.isEqual = false;
          }else{
            this.isEqual = true;
          }
//          console.log(that.deleteStr);
        }).catch(() => {

        });
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

        this.fileList = [];
        this.startTime = '';
        this.endTime = '';
        this.tableDataQK = [];
        this.totalItem = '0';
        this.totalMoney = '';
        this.startTimeTable = '';
        this.endTimeTable = '';
        this.deleteStr = '';
        this.fileListUpload = [];

        this.$emit('close', false);
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
//              console.log(res);
              that.baseInfo.create_uid = res;
            });
            if(response.data.data.rec_uid){
              that.getName(response.data.data.rec_uid).then(res => {
//                console.log(res);
                that.baseInfo.rec_uid = res;
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
            if(response.data.data.fil){
              that.fileList = response.data.data.file;
              for(let i = 0; i < that.fileList.length; i++){
                that.fileList[i].url = that.GLOBAL.serverSrcPhp + that.fileList[i].url;
              }
            }else{
              that.fileList = [];
            }


            // 分销商为无，自动填充时间
            if(response.data.data.distributor == '无'){
              const timeToday = new Date();
              const year = timeToday.getFullYear();
              const month = timeToday.getMonth() + 1;
              const day = timeToday.getDate();
              that.startTime = (year - 1) + '-' + month + '-' + day;
              that.endTime = (year + 1) + '-' + month + '-' + day;

              console.log(that.startTime);
              console.log(that.endTime);
            }
          } else {
            that.$message.success("加载数据失败~");
          }
        }).catch(function(error) {
          console.log(error);
        });

      },
      // 根据id获取人名
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
      },

      beginDate(){
//      alert(begin);
        const that = this;
        return {
          disabledDate(time){
            if (that.endTime) {  //如果结束时间不为空，则小于结束时间
              return new Date(that.endTime).getTime() < time.getTime()
            } else {
              // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
            }
          }
        }
      },
      processDate(){
//      alert(process);
        const that = this;
        return {
          disabledDate(time) {
            if (that.startTime) {  //如果开始时间不为空，则结束时间大于开始时间
              return new Date(that.startTime).getTime() > time.getTime()
            } else {
              // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
            }
          }
        }
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
  #tradeDetail .buttonDv{
    position: absolute;
    top: 8px;
    right: 3%;
  }
  #tradeDetail .stepDv{
    width: 94%;
    margin: 0 auto;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    display: -webkit-flex;
    justify-content: flex-start;
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
  #tradeDetail .bottom_dataDv{
    display: block;
    .left_span{
      display: inline-block;
      width: 120px;
      span{
        color: red;
      }
    }
    .baseIn{
      width: 200px;
    }
    .lineSpan{
      display: inline-block;
      line-height: 40px;
      margin: 10px auto;
    }
    .mark_p{
      margin: 0;
      line-height: 30px;
      color: #999999;
      padding-left: 125px;
    }
    .stepTitle{
      width: 100%;
      font-size: 16px;
      margin: 10px auto;
      padding: 0;
    }
  }
</style>
