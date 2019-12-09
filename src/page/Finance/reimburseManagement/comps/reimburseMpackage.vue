<template>
  <!--多报销-->
  <div>
    报销弹框内容
    {{submitForm_s.name}}
      
 
</div> 
</template>

<script>

import { formatDate } from "@/js/libs/formatDate.js";
import moment from "moment";
export default {
  name: "reimburseMpackage",
  components: {  },
  data() {
    var areaIdRule = (rule, value, callback) => {
      if (
        this.ruleForm.groupCode == "" ||
        this.ruleForm.productName == ""
      ) {
        return callback(new Error("团期计划不能为空"));
      } else {
         callback();
      }
    };
    var imageIdRule = (rule, value, callback) => {
      if (this.image == 0) {
        return callback(new Error("上传图片不能为空"));
      } else {
         callback();
      }
    };

    return {
      uploadUrl: this.GLOBAL.serverSrc + '/upload/obs/api/picture/', // 上传凭证
      find:0,//判断页面进入状态
      change: false,
      submitForm_s: {
        // name: "",
        // id: "",
        // createUser:"",
        // createTime:"",
        // groupCode:"",
        // productName:"",
        // mark:"",
        // fileList:"",
      },
     
    };
  },
  methods: {
    moment,
    init(){
      console.log(this.proto);
      Object.keys(this.proto).forEach(attr => {
        attr!== 'schedules' 
           && (this.submitForm_s[attr]= this.proto[attr]);
      });
      console.log("三三四四",this.submitForm_s)
      // bug 127: 这里记录原始数据
      //this.checkProto= this.$deepCopy(this.submitForm);

      
    },
 
    chanceSubmit(ruleForm) { // 取消按钮
     // console.log(ruleForm);
      this.ruleForm = {
        groupCode:"",
        productName:"",
        monkeys: {
          mark: "小费",
          price: "1000.00"
        },
        mark: ""
        }
      this.t_sum = 0;
      this.t_price = 0;
      this.joinData_s = [];
      this.dialogFormVisible = false;
      this.$refs[ruleForm].resetFields();
       
    },
    addplan() {//确定1
      this.ruleForm.groupCode = this.plans.planNum;
      this.ruleForm.productName = this.plans.planName;
      //this.Associated(this.plans.pid);
      this.dialogFormVisible2 = false;
    },
    //获取关联单据
    Associated(
      planID,
      suppliername = this.t_supplier,
     // createUser = this.t_plan
      ) {
        let object = {};
            suppliername !== "" ? (object.suppliername = suppliername) : suppliername,
            planID !=="" ? (object.planID = planID) : planID,
          this.$http
            .post(this.GLOBAL.serverSrc + "/finance/payment/api/checklist", {
              object:object,
            })
            .then(res => {
              var object = res.data.objects;
              var wcount; //未报销金额
                for (let i = 0; i < object.length; i++) {
                  if(object[i].orgName==null){
                      object[i].orgName="无";
                    }
                    //  if(object[i].paymentType==1){
                  //      object[i].paymentType = "无收入借款";
                  //   }else if(object[i].paymentType==2){
                  //      object[i].paymentType = "预付款";
                  //   }
                    // if(object[i].supplierType==0){
                    //   this.supplier=1;
                    // }else{
                    //   this.supplier=0;
                    // }
                    this.joinData.push({
                      paymentID:  object[i].paymentID,
                      supplierTypeEX:object[i].supplierTypeEX,
                      groupCode:object[i].groupCode,
                      productName:object[i].productName,
                      createUser:object[i].createUser,
                      mark:object[i].mark,
                      price:object[i].price,
                      wcount:object[i].wcount,
                      bcount:0,
                      createTime:object[i].createTime,
                      supplierName:object[i].supplierName,
                      peopleCount:object[i].peopleCount,
                      orgName:object[i].orgName,
                      wcount :object[i].price - object[i].collectionPrice
                  });
                }
              //console.log("添加数据",this.joinData);
            })
            .catch(err => {
              console.log(err);
            });
        },
    //获取团号和name
    planChange(row) {
      console.log(row);
      this.plans = {};
      this.plans.planName = row.title;
      this.plans.planNum = row.groupCode;
      this.plans.pid = row.planID;
    },
    // 报销人选中行
    clickBanle(row) {
      this.people = {};
      this.people.peo = row.name;
      this.people.tt = row.orgName;
    },
    //
    searchHand4(val) { //团期计划搜索
      this.$http
        .post(this.GLOBAL.serverSrc + "/teamquery/get/api/planfinancelist", {
          pageIndex: val,
          pageSize: this.userSize,
          object: {
            groupCode: this.tour_name, //团号
            title: this.product_name, //产品名称
            beginDate: this.startTime2? formatDate(this.startTime2, "yyyyMMdd"): 0, //搜索用开始日期
            endDate: this.endTime2 ? formatDate(this.endTime2, "yyyyMMdd") : 0 //搜索用结束日期
          }
        })
        .then(res => {
          console.log(res.data.objects);
          this.planData = res.data.objects;
        })
        .catch(err => {
          console.log(err);
        });
    },
    T_update_btn(){//团期计划重置
      this.tour_name=""; //团号
      this.product_name="" //产品名称
      this.startTime2="" ;//搜索用开始日期
      this.endTime2 ="";//搜索用结束日期
      this.searchHand4(1)
    },
    //删除
    removeDomain(item) {
      var index = this.domains.indexOf(item);
      if (index !== -1) {
        this.domains.splice(index, 1);
      }
    },
    //添加
    addDomain() {
      this.domains.push({
          mark: "0",
          price: "0"
        });
    },
    // 报销申请提交
    submitForm(formName) {
      var joinData_sn=[];
      var fileList_s=[];
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.hand = [];
          for (var i = 0; i < this.domains.length; i++) {
            this.hand.push(this.domains[i]);
          };
           for (var i in this.joinData_s) {
            joinData_sn.push({
              price:this.joinData_s[i].price,
              paymentID:this.joinData_s[i].paymentID,
              peopleCount:this.joinData_s[i].peopleCount
            });
          };
           for (var i = 0; i < this.fileList.length; i++) {
            fileList_s.push({
              name:this.fileList[i].name,
              url:this.fileList[i].url,
            });
          };
          console.log(this.ruleForm);
          console.log(this.ruleForm.monkeys);
          this.hand.push(this.ruleForm.monkeys);
          var createUser = sessionStorage.getItem('id');
          var pid = this.plans.pid;
          var price = this.t_price;
          var mark = this.ruleForm.mark;
          var files = fileList_s;
          var check = 0;
          var others = this.hand;
          var payments = joinData_sn;

          this.$http
            .post(this.GLOBAL.serverSrc + "/finance/expense/api/insertlist", {
              object: [{ 
                  createUser: createUser,
                  planID: pid,
                  price: price,
                  mark: mark,
                  files: files,
                  checkType: check,
                  payments: payments,
                  others: others } ]
            })
            .then(res => {
              console.log(res.data.isSuccess);
              if (res.data.isSuccess == true) {
                this.$message({
                  type: "success",
                  message: "创建成功!"
                });
                this.beginWokeing(res.data.object);
                this.reimList();
                this.getUserList(1);
                
              }else{
                  this.$message({
                  type: "error",
                  message: "创建失败!"
                });
              }
            })
            .catch(err => {
              console.log(err);
            });
         

          this.dialogFormVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //启动工作流
    beginWokeing(res) { 
      console.log(res);
      this.$http
        .post(this.GLOBAL.jqUrl + "/JQ/StartUpWorkFlowForJQ", {
          jQ_ID: res.guid,
          jQ_Type: res.flowModel,
          workflowCode: res.flowModelName,
          userCode: sessionStorage.getItem("account")
        })
        .then(res => {
          let result = JSON.parse(res.data);
          if (result.code == "0") {
            console.log("启动工作流成功");
          } else {
            console.log("启动工作流错误!");
            console.log(res.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //撤销申请
    chanelSubmit() {
      this.$confirm("是否需要撤销该笔报销", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "撤销成功!"
          });
          this.dialogFormVisible = false;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消撤销"
          });
        });
    },
    t_text() {//确认添加
        this.joinData_s = [];
        var sss;
          for(let i in this.joinData){
                if(this.joinData[i].bcount!= "0" ){
                    this.joinData_s.push(this.joinData[i]);
                    //sss = this.joinData[i].bcount + [i];
                }
              }
          this.t_sum = this.joinData_s.length;
          this.dialogFormVisible3 = false;
    },
    // 报销弹窗
    dialogchange() {
       this.ruleForm = {
        groupCode:"",
        productName:"",
        monkeys: {
          mark: "小费",
          price: "1000.00"
        },
        mark: ""
        }
      
      this.t_sum = 0;
      this.t_price=10;
      this.joinData_s = [];
      this.find = 0;
      this.change = false;
      this.dialogFormVisible = true;
    },
    //报销弹窗查看
    dialogFind(scope) {//详情
     // console.log("我是详情")
      console.log("scope",scope)
      this.find = 1;
      this.change = true;
      this.dialogFormVisible = true;
      this.$http
            .post(this.GLOBAL.serverSrc + "/finance/expense/api/list", {
              object:{
                 guid:scope.row.guid,
               }
            })
            .then(res => {
              if (res.data.isSuccess == true) {
                 var d_objects = res.data.objects; //console.log(res.data.objects);
                 var createUser;
                    this.find = 1;
                    this.change = true;
                    this.dialogFormVisible = true;
                      for(let i in d_objects){

                         this.ruleForm = d_objects[i];
                         let payments = d_objects[i].payments;
                         for(let j in payments){
                             this.joinData_s.push({
                                createUser:d_objects[i].createUser,
                                createTime:payments[j].createTime,
                                price:payments[j].price,
                                supplierTypeEX:payments[j].supplierTypeEX,
                                supplierName:payments[j].supplierName,
                                paymentID:payments[j].paymentID,
                                paymentMark:payments[j].paymentMark,
                                paymentPrice:payments[j].paymentPrice,
                                price:payments[j].price,
                                peopleCount:payments[j].peopleCount,

                            })
                          
                         }
                        
                     }
                    
                    //console.log(this.joinData_s);
               }
            })
            .catch(err => {
              console.log(err);
            });
    },
    //添加报销
    addbx(ruleForm) { 
      console.log("走2");
       this.joinData = [];
       this.$refs[ruleForm].validate(valid => {
        if (valid) {
        this.Associated(this.plans.pid);
        this.dialogFormVisible3 = true;
        } else {
          this.$message({
          message: '请填写必填项',
          type: 'warning'
        });
        return false;
        }
      });
     
    },
    //报销人选择弹窗
    adddialog() {
      this.getUserList(1);
      this.dialogFormVisible1 = true;
    },
    //获取用户列表
    getUserList(val) {
      var that = this;
      this.$http
        .post(this.GLOBAL.serverSrc + "/org/api/userpage", {
          object: {
            isDeleted: 0
          },
          pageSize: this.userSize,
          pageIndex: val,
          isGetAll: true,
          id: 0
        })
        .then(function(obj) {
          that.userTotal = obj.data.total;
          that.tableData1 = obj.data.objects;
          console.log(that.tableData1);
        })
        .catch(function(obj) {
          console.log(obj);
        });
    },
    //团期计划弹窗
    planDialog() {
      this.dialogFormVisible2 = true;
      this.searchHand4(1);
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage4 = 1;
      this.reimList();
    },
    handleCurrentChange(val) {
      this.currentPage4 = val;
      this.reimList();
    },
    //选择报销人
    handleCurrentChange1(val) {
      this.getUserList(val);
      console.log(`当前页: ${val}`);
    },
    //文件上传
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    },
    //图片上传成功
    handleSucess(res, file, fileList) {
      var paths = [];
      for (var i = 0; i < fileList.length; i++) {
        paths = JSON.parse(fileList[i].response).paths[0];
        this.$set(this.fileList[i], "url", paths.Url);
        this.$set(this.fileList[i], "name", paths.Name);
      }
      this.image = 1;
    }, 
    handleRemove(file, fileList) {//图片删除
        console.log(file, fileList);
        this.fileList = fileList;
      },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    //添加报销和删除
    handleTabsEdit(targetName, action) {
      if (action === "add") {
        let newTabName = ++this.tabIndex + "";
        this.editableTabs.push({
          title: "报销" + this.tabIndex,
          name: newTabName,
          content: "New Tab mark"
        });
        this.editableTabsValue = newTabName;
      }
      if (action === "remove") {
        console.log(this.editableTabs.length);
        if (this.editableTabs.length == 1) {
          console.log(123);
        } else {
          console.log(567);
        }
        console.log("报销" + targetName);
        console.log(this.editableTabs);
        let tabs = this.editableTabs;
            let activeName = this.editableTabsValue;
            if (activeName === targetName) {
              tabs.forEach((tab, index) => {
                if (tab.name === targetName) {
                  let nextTab = tabs[index + 1] || tabs[index - 1];
                  if (nextTab) {
                    activeName = nextTab.name;
                  }
                }
              });
            }

            this.editableTabsValue = activeName;
            this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      }
    },

  //获取报销列表数据
  reimList() {
    var that = this;
    this.$http
      .post(this.GLOBAL.serverSrc + "/finance/expense/api/page", {
        pageIndex: this.currentPage4,
        pageSize: this.pageSize,
        total: 0,
        object: {}
      })
      .then(function(obj) {
        that.pageCount = obj.data.total;
        that.tableData = obj.data.objects;
         //console.log('获取列表报销数据',that.tableData);
      })
      .catch(function(obj) {
        console.log(obj);
      });
  },
  T_check(){//添加报销搜索
    this.joinData=[];
    this.Associated(this.plans.pid);
     
  },
  T_update(){//添加报销重置
  //console.log("我是重置2");
  this.t_plan = "";
  this.t_supplier = "";
  this.joinData=[];
  this.Associated(this.plans.pid);
 },
 beginDateBlur() {//开始时间
      if (this.beginDate == "" && this.endDate == "") {
        this.pageList(1, this.pageSize);
      }
    },
  endDateBlur() {//结束时间
      if (this.beginDate == "" && this.endDate == "") {
        this.pageList(1, this.pageSize);
      }
    },
    handleSearch() {// 搜索1
    console.log("我是搜索1");
        this.pageIndex = 1;
        this.pageList(1, this.pageSize);
        this.currentPage4 = 1;
      },
    handleReset() { // 重置
        this.pageIndex = 1;
        this.expenseID = "";
        this.groupCode = "";
        this.createUser = "";
        this.beginDate = "";
        this.endDate = "";
        this.pageList(1, this.pageSize);
        this.currentPage4 = 1;
      },
      //查询列表
    pageList(
      pageIndex = this.pageIndex,
      pageSize = this.pageSize,
      expenseID = this.expenseID,//单号
      groupCode = this.groupCode,//计划
      productName = this.productName,
      createUser = this.createUser,//申请人
      beginDate= this.beginDate,//开始时间
      endDate = this.endDate,//结束时间
     ) {
      let object = {};
        expenseID !== "" ? (object.expenseID = expenseID) : expenseID,
        groupCode !== "" ? (object.groupCode = groupCode) : groupCode,
        productName !== "" ?(object.productName = productName) : productName,
        createUser !== ""? (object.createUser = createUser): createUser;
        beginDate !== ""? (object.beginDate = beginDate): beginDate;
        endDate !== ""? (object.endDate = endDate): endDate;
        
        if (endDate !== "" && beginDate !== "") {
        object.beginDate = moment(beginDate).format("YYYY-MM-DD");
        object.endDate = moment(endDate).format("YYYY-MM-DD");
      } 
       //console.log("查询1",object);
       var that = this;
      this.$http
        .post(that.GLOBAL.serverSrc + "/finance/expense/api/page", {
          pageIndex: that.currentPage4,
          pageSize: that.pageSize,
          total: 0,
          object: object
        })
        .then(function(obj) {
           console.log("查询2",obj.data.objects);
            that.pageCount = obj.data.total;
            that.tableData = obj.data.objects;
          
        })
        .catch(function(obj) {
          console.log(obj);
        });
    },
     //判断结束时间不能在开始时间之前
    endDateChange() {
      let beginTime = moment(this.beginDate).format("YYYYMMDD");
      let entTime = moment(this.endDate).format("YYYYMMDD");
      if (this.beginDate !== "") {
        if (entTime < beginTime) {
          this.$message.error("结束时间不能早于开始时间");
          this.endDate = "";
        }
      }
    },
    beginDateBlur() {
      if (this.beginDate == "" && this.endDate == "") {
        this.pageList(1, this.pageSize);
      }
    },
    t_delete(){// 添加数据删除
    

    }
  },
  created() {
    this.reimList();
    if (sessionStorage.getItem('hasCashierInfo')) {
      this.ifAccountBtn = true
    } else {
      this.ifAccountBtn = false
    }
    if (!sessionStorage.getItem('hasCashierInfo')) { // 只有是出纳的时候才显示申请人检索
      this.ifShowProposer = true
    }
  },
 
};
</script>

<style scoped>
.borders {
  height: 900px;
  border: 1px solid #e6e6e6;
}
.search {
  float: left;
  margin-top: 30px;
}
.search_style {
  float: left;
  margin-top: 10px;
  margin-left: 20px;
  font-size: 14px;
}
.search_input {
  float: left;
  width: 200px;
}
.search__ {
  float: left;
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
}
.reform {
  float: left;
  width: 1550px;
  margin-left: 20px;
  margin-top: 20px;
}
.reform_s {
  float: right;
  margin-bottom: 20px;
  margin-top: 20px;
}
.table_style {
  width: 1500px;
  margin-left: 20px;
  margin-top: 20px;
  float: left;
}
.block {
  float: left;
  margin-left: 600px;
  margin-top: 70px;
  margin-bottom: 30px;
}
.reimbursementer {
  float: left;
  max-width: 700px;
  min-width: 300px;
  min-height: 40px;
  border: 1px solid #dcdfe6;
}
.indialog {
  min-height: 300px;
}
/* .indialog_search {
} */
.all .el-upload-list__item {
  clear: both;
}
.re_style {
  margin-left: 65px;
}
.sh_style {
  background: rgb(234, 234, 234);
  position: absolute;
  width: 66px;
  height: 35px;
  text-align: center;
  line-height: 35px;
  top: -4px;
  left: -1019px;
}
.upload-demo  .el-upload-list__item {
  width: 30%;
}
.handle_div {
  height: 100px;
  line-height: 100px;
  margin-left: 20px;
}
.handle_id {
  float: left;
}
.handle_people {
  float: left;
  margin-left: 250px;
}
.handle_time {
  float: left;
  margin-left: 250px;
}
</style>
