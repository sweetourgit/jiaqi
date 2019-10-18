<template>
  <div class="vivo" style="position:relative" id="recognitionDo">
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
          <span class="left_span">认款方式：</span>
          <el-select v-model="rec_type" placeholder="请选择" @change="typeChange">
            <el-option key="1" label="分销商预存款" value="1"></el-option>
            <el-option key="3" label="订单收款" value="3"></el-option>
          </el-select>
        </div>
        <div class="selectDv" v-if="rec_type == '1'">
          <span class="left_span">分销商：</span>
          <el-autocomplete class="search_input" v-model="distributor" :fetch-suggestions="querySearchD" placeholder="请输入操作人员" @select="handleSelectD" @blur="blurHand"></el-autocomplete>
        </div>
        <div class="selectDv" v-if="rec_type == '3'">
          <span class="left_span">分销商：</span>
          <el-radio-group v-model="distributorType">
            <el-radio label="美团（团购直连）">美团（团购直连）</el-radio>
            <el-radio label="马蜂窝自由行">马蜂窝自由行</el-radio>
            <el-radio label="去哪儿">去哪儿</el-radio>
            <el-radio label="票付通余额">票付通余额</el-radio>
            <el-radio label="无">无</el-radio>
          </el-radio-group>
          <br><br>
          <span class="left_span">款项入账时间段：</span>
          <el-date-picker v-model="startTime" type="date" placeholder="开始日期" class="start-time baseIn" :picker-options="startDatePicker"></el-date-picker>
          <span style="display: inline-block;line-height: 32px;margin:10px 0;">--</span>
          <el-date-picker v-model="endTime" type="date" placeholder="结束日期" class="start-time baseIn" :picker-options="endDatePicker"></el-date-picker>
          <p class="mark_p">该笔款所包含的所有订单，所有订单下单的时间区间</p>
          <br><br>
          <span class="left_span">订单明细：</span>
          <el-upload ref="upload1" class="upload-demo" :action="UploadUrl()" :headers="headers" :on-success="handleSuccess" :on-error="handleError" :on-remove="handleRemove" :before-remove="beforeRemove" :on-exceed="handleExceed" :file-list="fileListUpload" :limit="1">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <p class="stepTitle MXtitle">收款明细</p>
          <div class="lineTitle"><i class="el-icon-info"></i>&nbsp;&nbsp;已关联&nbsp;{{totalItem}}&nbsp;项 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总计：{{totalMoney}}元  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收款入账时间段：{{startTimeTable}}--{{endTimeTable}}</div>
          <el-table ref="singleTable" :data="tableDataQK" border :header-cell-style="getRowClass" height="700">
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
    name: "recognitionDo",
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

        rec_type: '',// 认款方式

        distributor: '',// 选择的分销商
        distributorID: '',// 选择的分销商ID
        distributorList: [],// 分销商列表

        distributorType: '无',
        startTime: '',// 款项入账时间：开始结束
        endTime: '',

        fileListUpload: [],
        tableDataQK: [],// 订单明细信息
        totalItem: '0',
        totalMoney: '',
        startTimeTable: '',
        endTimeTable: '',
        deleteStr: '',

        startDatePicker: this.beginDate(),
        endDatePicker: this.processDate(),

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
      typeChange(value){
//        console.log(value);
        this.rec_type = value;
      },
      // 关闭弹窗
      closeAdd(){
        this.distributor = '';
        this.distributorID = '';
        this.distributorType = '无';
        this.startTime = '';
        this.endTime = '';

        this.fileListUpload = [];
        this.tableDataQK = [];
        this.totalItem = '0';
        this.totalMoney = '';
        this.startTimeTable = '';
        this.endTimeTable = '';
        this.deleteStr = '';
        this.$emit('close', false);
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
          })
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
          that.deleteStr += scope.$index + ',';
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
//          console.log(that.deleteStr);
        }).catch(() => {

        });
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
        if(this.startTime === '' && this.rec_type === "3"){
          that.$message({
            type: 'warning',
            message: '款项入账时间段不能为空！'
          });
          return;
        }
        if(this.endTime === '' && this.rec_type === "3"){
          that.$message({
            type: 'warning',
            message: '款项入账时间段不能为空！'
          });
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
        if(this.deleteStr == ''){
          data = {
            "id": this.info,
            "rec_mode": this.rec_type,
            "distributor_code": this.distributorID,
            "distributor": this.distributorType,
            "rece_start": this.startTime,
            "rece_end": this.endTime,
            "file": fileArr,
            "rec_uid": sessionStorage.getItem('id')
          }
        }else{
          this.deleteStr = this.deleteStr.substr(0, this.deleteStr.length - 1);
          data = {
            "id": this.info,
            "rec_mode": this.rec_type,
            "distributor_code": this.distributorID,
            "distributor": this.distributorType,
            "rece_start": this.startTime,
            "rece_end": this.endTime,
            "file": fileArr,
            "del_order": this.deleteStr,
            "rec_uid": sessionStorage.getItem('id')
          }
        }
        console.log(data);
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/oprecognition/op-recognition/confirmrec", data, ).then(function(response) {
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
            if(response.data.data.file){
              for(let i = 0; i < that.fileList.length; i++){
                that.fileList[i].url = that.GLOBAL.serverSrcPhp + that.fileList[i].url;
              }
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
      },
      // 时间限制
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
      },
    },
    created() {

    },
    mounted() {

    }
  }

</script>
<style lang="scss">
  #recognitionDo .el-dialog{
    width: 90%;
  }
  #recognitionDo .stepTitle{
    width: 94%;
    line-height: 45px;
    font-size: 18px;
    text-indent: 20px;
    margin: 0 auto;
  }
  #recognitionDo .MXtitle{
    width: 100%;
  }
  #recognitionDo .stepDv{
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
      span.left_span{
        display: inline-block;
        width: 120px;
        height: 40px;
        line-height: 40px;
      }
      span.el-radio__input{
        width: 20px;
      }
      span.el-radio__inner{
        width: 14px;
      }
      .el-select{
        width: 300px;
      }
      .mark_p{
        margin: 0;
        line-height: 30px;
        color: #999999;
        padding-left: 125px;
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
      margin: 0 auto;
    }
    .upload-demo{
      width: 80%;
      display: inline-block;
      margin: 10px auto;
    }
  }
  #recognitionDo .el-upload-list__item{
    margin-top: 10px !important;
  }
  #recognitionDo .el-upload-list__item{
    width: 100%!important;
  }
  #recognitionDo .lineTitle{
    width: 96%;
    margin: 10px auto;
    background-color: #E6F3FC;
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
    padding: 0 10px;
  }
  #recognitionDo .el-table{
    width: 96%;
    margin: 0 auto;
  }

</style>
