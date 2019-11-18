<template>
  <div class="all">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!--报销-->
      <el-tab-pane label="报销" name="first">
        <div class="borders">
          <div>
            <div class="search">
              <span class="search_style">报销单号：</span>
              <el-input v-model="expenseID" placeholder="请输入内容" class="search_input"></el-input>
              <span class="search_style">团期计划：</span>
              <el-input v-model="groupCode" placeholder="请输入内容" class="search_input"></el-input>
              <span class="search_style">申请人：</span>
              <el-input v-model="createUser" placeholder="请输入内容" class="search_input"></el-input>
              <span class="search_style">发起时间：</span>
              <div style="float: left">
                <el-date-picker 
                v-model="beginDate" 
                type="date" 
                @change="endDateChange()" 
                @blur="beginDateBlur()"
                placeholder="开始时间"
                ></el-date-picker>
              </div>
              <span class="search__">—</span>
              <div style="float: left">
                <el-date-picker 
                v-model="endDate" 
                type="date"
                @blur="endDateBlur()"
                @change="endDateChange()" 
                placeholder="结束时间"
                ></el-date-picker>
              </div>
            </div>
            <div class="reform">
              <el-button type="primary"  @click="handleSearch">搜索1</el-button>
              <el-button type="primary"  @click="handleReset">重置1</el-button>
            </div>
            <div class="reform">
              <el-button type="primary" plain @click="dialogchange">申请</el-button>
              <!--
                <el-button type="primary" @click="dialogFind" plain>查看</el-button>
              -->
            </div>
          </div>
          <div class="table_style">
            <el-table :data="tableData" border style="width: 100%;">
              <el-table-column prop="expenseID" label="报销单号" width="180" align="center"></el-table-column>
              <el-table-column prop="checkTypeEX" label="状态" width="180" align="center">
                <template slot-scope="scope">
                  <div
                    v-if="scope.row.checkTypeEX=='审批中'"
                    style="color: #7F7F7F"
                  >{{scope.row.checkTypeEX}}</div>
                  <div
                    v-if="scope.row.checkTypeEX=='驳回'"
                    style="color: #FF4A3D"
                  >{{scope.row.checkTypeEX}}</div>
                  <div
                    v-if="scope.row.checkTypeEX=='通过'"
                    style="color: #33D174"
                  >{{scope.row.checkTypeEX}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="发起时间" align="center"></el-table-column>
              <el-table-column prop="groupCode" label="团期计划" width="250" align="center"></el-table-column>
              <el-table-column prop="price" label="报销金额" width="180" align="center"></el-table-column>
              <el-table-column prop="createUser" label="申请人" width="150" align="center"></el-table-column>
              <el-table-column prop="info" label="审批意见" width="180" align="center"></el-table-column>
              <el-table-column prop="qq" label="操作" width="180" align="center">
                <template slot-scope="scope">
                  <div @click="dialogFind" style="color: #f5a142">详情</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage4"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageCount"
              background
            ></el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <!--报销end-->
      <!--报销弹窗-->
      <el-dialog title="报销申请" :visible.sync="dialogFormVisible" width="70%" :show-close="false">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <!--多报销-->
          <div>
            <div class="handle_div">
              <div class="handle_id"><span>ID:</span><span style="margin-left: 10px;">12312321</span></div>
              <div class="handle_people"><span>申请人:</span><span style="margin-left: 10px;">大运通-财务部-阳阳</span></div>
              <div class="handle_time"><span>创建时间:</span><span style="margin-left: 10px;">2019-12-23 12:23:23</span></div>
            </div>
            <el-tabs
              v-model="editableTabsValue"
              type="card"
              :editable="change ? false : true"
              @tab-click="tabClick"
              @edit="handleTabsEdit"
              style="border: 1px solid #E4E7ED"
            >
              <el-tab-pane
                :key="item.name"
                v-for="(item, index) in editableTabs"
                :label="item.title"
                :name="item.name"
              >
                <div style="color: red; position: absolute;left: 20px;top: 15px;">*</div>
                <el-form-item label="团期计划" prop="groupCode">
                  <el-input
                    v-model="ruleForm.groupCode.planId"
                    placeholder="请输入"
                    style="width: 240px;"
                    :disabled="change"
                  ></el-input>
                  <el-input
                    v-model="ruleForm.groupCode.planName"
                    placeholder="请输入或者选择团期计划"
                    style="width: 240px;"
                    :disabled="change"
                  ></el-input>
                  <el-button size="mini" @click="planDialog" v-if="find==0">选择</el-button>
                </el-form-item>
                <el-form-item label="摘要" prop="content">
                  <el-input
                    v-model="ruleForm.content"
                    placeholder="请输入"
                    style="width: 480px;"
                    :disabled="change"
                  ></el-input>
                </el-form-item>
                <div style="color: red; color: red; position: absolute;top: 140px;left: 48px;">*</div>
                <el-form-item label="附件" prop="image" ref="againimage">
                  <el-upload
                    name="files"
                    class="upload-demo"
                    action="http://192.168.1.186:3009/upload/api/picture"
                    :on-change="handleChange"
                    :on-success="handleSucess"
                    :file-list="fileList"
                  >
                    <el-button size="small" type="primary" v-if="find==0">点击上传</el-button>
                  </el-upload>
                </el-form-item>
                <div class="re_style">
                  <el-radio v-model="radio" label="1">关联单据</el-radio>
                  <el-radio v-model="radio" label="2">手添报销明细</el-radio>
                </div>
                <div v-if="radio==1" class="re_style" style="margin-top: 20px">
                  <el-button @click="addbx('ruleForm')" v-if="find==0">增加1</el-button>
                  <!-- <el-button @click="addbx" v-if="find==0">修改</el-button> -->
                  <!-- <el-button type="danger" v-if="find==0">删除</el-button> -->
                </div>
                <div
                  style="background: #E6F3FC; height: 33px;width: 1204px;margin-left: 64px;margin-top: 10px; "
                >
                  <i
                    style="float: left; margin-left: 10px;margin-top: 7px;"
                    class="el-icon-warning"
                  ></i>
                  <div style="float: left;margin-left: 30px;margin-top: 7px;">
                    已选择
                    <span style="color: #249BEB">0</span>项
                  </div>
                  <div style="float: left; margin-left: 30px;margin-top: 7px;">
                    报销总计：
                    <span style="font-weight:bold">0.00</span>元
                  </div>
                </div>
                <div v-if="radio==1">
                  <!-- <div style="background: #E6F3FC; height: 33px;width: 1204px;margin-left: 64px;margin-top: 10px; ">
                        <i style="float: left; margin-left: 10px;margin-top: 7px;" class="el-icon-warning"></i>
                        <div style="float: left;margin-left: 30px;margin-top: 7px;">已选择<span style="color: #249BEB">0</span>项</div>
                        <div style="float: left; margin-left: 30px;margin-top: 7px;">报销总计：<span style="font-weight:bold">0.00</span>元</div>
                  </div>-->
                  <div class="re_style">
                    <el-table :data="joinData" border style="width: 100%; margin-top: 30px">
                      <el-table-column prop="id" label="无收入借款或预付款ID" width="110"></el-table-column>
                      <el-table-column prop="paymentType" label="借款类型" width="90"></el-table-column>
                      <el-table-column prop="supplierType" label="供应商" width="100"></el-table-column>
                      <el-table-column prop="createUser" label="申请人" width="80"></el-table-column>
                      <el-table-column prop="mark" label="摘要"></el-table-column>
                      <el-table-column prop="price" label="借款金额"></el-table-column>
                      <el-table-column prop="wcount" label="未报销金额"></el-table-column>
                      <el-table-column prop="bcount" label="报销金额" style="background: yellow">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.bcount" style="width:100px;"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="peopleCount" label="人数">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.peopleCount" style="width:100px;"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="peopleCount" label="操作">
                        <template slot-scope="scope">
                          <div @click style="color: #f5a142">删除</div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                  <!-- <div class="re_style" style="margin-top: 30px; margin-bottom: 30px">报销金额：100.00</div> -->
                </div>
                <div v-if="radio==2">
                  <div style="float:left;margin: 10px 0 0 65px;width: 70px;">报销明细:</div>
                  <div class="re_style" style="margin-top: 20px;">
                    <el-input
                      :disabled="change"
                      v-model="ruleForm.monkeys.mark"
                      placeholder="请输入报销类型"
                      style="width: 240px;"
                    ></el-input>
                    <el-input
                      :disabled="change"
                      v-model="ruleForm.monkeys.price"
                      placeholder="请输入报销金额"
                      style="width: 240px;"
                    ></el-input>
                    <el-button type="primary" @click="addDomain" v-if="find==0">添加</el-button>
                  </div>
                  <div v-for="(domain, index) in domains" class="re_style" style="margin: 20px 0 0 135px;">
                    <el-input
                      :disabled="change"
                      v-model="domain.mark"
                      placeholder="请输入报销类型"
                      style="width: 240px;"
                    ></el-input>
                    <el-input
                      :disabled="change"
                      v-model="domain.price"
                      placeholder="请输入报销金额"
                      style="width: 240px;"
                    ></el-input>
                    <el-button type="danger" @click="removeDomain(domain)" v-if="find==0">删除</el-button>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>

            <div v-if="this.find == 1" class="re_style" style="margin-top: 20px">
              <el-table :data="reimData" border style="width: 100%">
                <el-table-column prop="reier" label="审批人" width="180"></el-table-column>
                <el-table-column prop="reisult" label="审批结果" width="180"></el-table-column>
                <el-table-column prop="info" label="审批意见"></el-table-column>
                <el-table-column prop="time" label="审批时间"></el-table-column>
              </el-table>
            </div>
          </div>
          <!--多报销end-->
        </el-form>
        <div slot="footer" class="dialog-footer" style="position: absolute;top: 20px;right: 20px;">
          <el-button @click="chanceSubmit('ruleForm')">取 消</el-button>
          <el-button v-if="this.find == 0" type="primary" @click="submitForm('ruleForm')">确 定3</el-button>
          <el-button
            v-if="this.find == 1"
            type="danger"
            @click="chanelSubmit('ruleForm')"
            plain
          >撤销申请</el-button>
          <div v-if="this.find == 1" class="sh_style">审核中</div>
        </div>
      </el-dialog>
      <!--报销弹窗end-->
      <!--团期计划弹窗-->
      <el-dialog
        width="60%"
        title="获取团期计划"
        :visible.sync="dialogFormVisible2"
        append-to-body
        :show-close="false"
      >
        <div class="indialog">
          <div style=" position: absolute;right: 67px;top: 22px;">
            <el-button @click="dialogFormVisible2 = false">取 消</el-button>
            <el-button type="primary" @click="addplan">确 定1</el-button>
          </div>
          <div class="indialog_search">
            <span class="search_style">团期单号：</span>
            <el-input v-model="tour_name" placeholder="请输入内容" class="search_input"></el-input>
            <span class="search_style">产品名称：</span>
            <el-input v-model="product_name" placeholder="请输入内容" class="search_input"></el-input>
            <span class="search_style">出行日期：</span>
            <el-date-picker
              v-model="startTime2"
              type="date"
              placeholder="开始日期"
              style="float: left;width: 150px;"
            ></el-date-picker>
            <el-date-picker
              v-model="endTime2"
              type="date"
              placeholder="终止日期"
              style="float: left;width: 150px;"
            ></el-date-picker>
            <el-button
              type="primary"
              size="mini"
              @click="searchHand4(1)"
              round
              style="margin-top: 5px; margin-left: 10px"
            >搜索</el-button>
          </div>
          <el-table
            :data="planData"
            border
            :highlight-current-row="true"
            @row-click="planChange"
            style="width: 100%; margin-top: 30px"
          >
            <el-table-column prop="groupCode" label="团期计划ID"></el-table-column>
            <el-table-column prop="title" label="产品名称"></el-table-column>
            <el-table-column prop="destination" label="目的地"></el-table-column>
            <el-table-column prop="date" label="出行日期"></el-table-column>
            <el-table-column prop="orgName" label="部门"></el-table-column>
            <el-table-column prop="name" label="产品录入人"></el-table-column>
          </el-table>
          <!--  <el-pagination
              style="margin-top: 10px;float: right"
              :page-size="userSize"
              :pager-count="11"
              layout="prev, pager, next"
              @current-change="handleCurrentChange2"
              :total=planTotal>
          </el-pagination>-->
        </div>
      </el-dialog>
      <!--团期计划弹窗end-->
      <!--添加报销弹窗-->
      <el-dialog width="60%" title="添加报销" :visible.sync="dialogFormVisible3" append-to-body>
              <span class="search_style">申请人：</span>
              <el-input v-model="t_plan" placeholder="请输入内容" class="search_input"></el-input>
              <span class="search_style">供应商：</span>
              <el-input v-model="t_supplier" placeholder="请输入内容" class="search_input"></el-input>
          <div class="reform_s">
            <el-button @click="T_check" type="primary">搜索2</el-button>
            <el-button @click="T_update" type="primary">重置2</el-button>
          </div>
        <el-table :data="joinData1" border style="width: 100%; margin-top: 30px">
          <el-table-column prop="id" label="关联单号" width="80"></el-table-column>
          <el-table-column prop="type" label="类型" width="70"></el-table-column>
          <el-table-column prop="gys" label="供应商" width="60"></el-table-column>
          <el-table-column prop="bm" label="部门"></el-table-column>
          <el-table-column prop="accpeter" label="申请人" width="80"></el-table-column>
          <el-table-column prop="time" label="发起日期"></el-table-column>
          <el-table-column prop="content" label="摘要"></el-table-column>
          <el-table-column prop="count" label="金额" width="100"></el-table-column>
          <el-table-column prop="wcount" label="未报销金额"></el-table-column>
          <el-table-column prop="bcount" width="130" label="报销金额">
            <template slot-scope="scope">
              <el-input v-model="scope.row.bcount" style="width:100px;"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="bcount" width="130" label="人数">
            <template slot-scope="scope">
              <el-input v-model="scope.row.bcount" style="width:100px;"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible3 = false">取 消</el-button>
          <el-button type="primary" @click="text('joinData1')">确 定2</el-button>
        </div>
      </el-dialog>
      <!--添加报销弹窗end-->
      <!--需要你审批-->
      <el-tab-pane label="需要您审批" name="second">
        <NeedApproval></NeedApproval>
      </el-tab-pane>
      <!--审批end-->
    </el-tabs>
  </div>
</template>

<script>
import NeedApproval from "@/page/Finance/reimburseManagement/needApproval";
import { formatDate } from "@/js/libs/formatDate.js";
import moment from "moment";
export default {
  name: "reimburseManagement",
  components: {
    NeedApproval
  },
  data() {
    var areaIdRule = (rule, value, callback) => {
      console.log(this.ruleForm);
      if (
        this.ruleForm.groupCode.planId == "" ||
        this.ruleForm.groupCode.planName == ""
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
      image: 0,
      value1: "",
      value2: "",
      hand: [],
      plans: {
        planNum: "1",
        planName: "2",
        pid: ""
      },
      beginDate: "",//报销开始时间+
      endDate: "",//报销结束时间+
      planTotal: 100,
      userSize: 10,
      userTotal: 100,
      startTime2: "",
      endTime2: "",
      //每页偏移量
      pageSize: 10,
      pageCount: 100,
      change: false,
      //分辨查看
      find: 0,
      // 单选
      radio: "1",
      //团期计划弹窗
      dialogFormVisible2: false,
      //添加报销
      dialogFormVisible3: false,
      //报销表单弹窗
      dialogFormVisible: false,
      //报销人弹窗
      dialogFormVisible1: false,
      //团期计划搜索
      tour_name: "",
      product_name: "",
      planTime: "",
      planTime1: "",
      //手添报销
      domains: [
        {
          mark: "",
          price: ""
        }
      ],
      // 选中报销人字段
      people: {
        tt: "大运通-日本",
        peo: "qq"
      },
      //报销表单
      ruleForm: {
        groupCode: {
          planId: "",
          planName: ""
        },

        monkeys: {
          mark: "",
          price: ""
        },
        content: ""
      },
      //报销表单验证
      rules: {
        name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        groupCode: [{ validator: areaIdRule, trigger: "blur" }],
        image: [{ validator: imageIdRule, trigger: "blur" }],
        content: [
          { required: true, message: "请输入摘要", trigger: "change" },
          {
            min: 0,
            max: 80,
            message: "摘要字数不能超过80字",
            trigger: "change"
          }
        ]
      },
      //审批意见
      reimData: [
        {
          reier: "",
          reisult: "",
          info: "",
          time: ""
        }
      ],
      formLabelWidth: "120px",
      currentPage4: 1,
      activeName: "first",
      expenseID: "",
      groupCode: "",
      t_plan: "",// 添加报销申请人
      t_supplier:"",//添加报销供应商
      createUser: "",
      createtime1: "",
      createtime2: "",
      //报销table
      tableData: [
        {
          expenseID: "1",
          type: "申请中",
          createtime: "2016-05-02",
          groupCode: "TC-GTY-1001-01-180806-01",
          monkey: "国旅",
          orinaze: "辽宁大运通-国内部",
          accpter: "阳阳",
          info: ""
        },
        {
          expenseID: "1",
          type: "驳回",
          createtime: "2016-05-02",
          groupCode: "TC-GTY-1001-01-180806-01",
          monkey: "国旅",
          orinaze: "辽宁大运通-国内部",
          accpter: "阳阳",
          info: "郑总：信息补全"
        },
        {
          expenseID: "1",
          type: "通过",
          createtime: "2016-05-02",
          groupCode: "TC-GTY-1001-01-180806-01",
          monkey: "国旅",
          orinaze: "辽宁大运通-国内部",
          accpter: "阳阳",
          info: ""
        }
      ],
      //团期计划表格
      planData: [],
      //关联单据表单
      joinData: [
        {
          id: "1",
          type: "地接",
          gys: "国旅",
          bm: "辽宁大运通-北美部",
          accpeter: "阳阳",
          time: "2019-01-09 09:37",
          content: "",
          count: "17800.00",
          wcount: "17800.00",
          bcount: "200.0",
          peopleCount: 12
        }
      ],
      joinData1: [
        {
          id: "1",
          type: "地接",
          gys: "国旅",
          bm: "辽宁大运通-北美部",
          accpeter: "阳阳",
          time: "2019-01-09 09:37",
          content: "",
          count: "17800.00",
          wcount: "17800.00",
          bcount: ""
        },
        {
          id: "1",
          type: "地接",
          gys: "国旅",
          bm: "辽宁大运通-北美部",
          accpeter: "阳阳",
          time: "2019-01-09 09:37",
          content: "",
          count: "17800.00",
          wcount: "17800.00",
          bcount: ""
        }
      ],
      file: [],
      //文件上传列表
      fileList: [],
      editableTabsValue: "1",
      editableTabs: [
        {
          title: "报销1",
          name: "1",
          content: "Tab 1 content"
        }
      ],
      tabIndex: 1
    };
  },
  methods: {
    /* deleTab(info){
            console.log("报销"+info)

          },*/
    moment,
    //切换时候，换内容
    tabClick() {
      this.ruleForm = {
        groupCode: {
          planId: "",
          planName: ""
        },

        monkeys: {
          mark: "小费",
          price: "1000.00"
        },
        content: ""
      };
      this.$refs[ruleForm].resetFields();
    },
    chanceSubmit(ruleForm) {
      console.log(ruleForm);
      this.ruleForm = {
        groupCode: {
          planId: "",
          planName: ""
        },

        monkeys: {
          mark: "小费",
          price: "1000.00"
        },
        content: ""
      };
      this.dialogFormVisible = false;
      this.$refs[ruleForm].resetFields();
    },
    addplan() {
      this.ruleForm.groupCode.planId = this.plans.planNum;
      this.ruleForm.groupCode.planName = this.plans.planName;
      this.Associated(this.plans.pid);
      this.dialogFormVisible2 = false;
    },
    //获取关联单据
    Associated(val) {
      this.$http
        .post(this.GLOBAL.serverSrc + "/finance/payment/api/checklist", {
          object: {
            planID: val
          }
        })
        .then(res => {
          this.joinData = res.data.objects;
          console.log(res);
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
    adduser() {
      this.ruleForm.name.push(this.people);
      this.dialogFormVisible1 = false;
    },
    // 报销人选中行
    clickBanle(row) {
      this.people = {};
      this.people.peo = row.name;
      this.people.tt = row.orgName;
    },
    //
    searchHand4(val) {
      this.$http
        .post(this.GLOBAL.serverSrc + "/teamquery/get/api/planfinancelist", {
          pageIndex: val,
          pageSize: this.userSize,
          object: {
            groupCode: this.tour_name, //团号
            title: this.product_name, //产品名称
            beginDate: this.startTime2
              ? formatDate(this.startTime2, "yyyyMMdd")
              : 0, //搜索用开始日期
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
        mark: "",
        price: ""
      });
    },
    // 报销申请提交
    submitForm(formName) {
      console.log(formName);
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.hand = [];
          for (var i = 0; i < this.domains.length; i++) {
            this.hand.push(this.domains[i]);
          }
          this.hand.push(this.ruleForm.monkeys);
          var createUser = this.ruleForm.name[0].peo;
          var pid = this.plans.pid;
          var price = this.ruleForm.monkey.price;
          var mark = this.ruleForm.content;
          var files = this.fileList;
          var check = 0;
          var others = this.hand;

          this.$http
            .post(this.GLOBAL.serverSrc + "/finance/expense/api/insertlist", {
              object: [
                {
                  createUser: createUser,
                  planID: pid,
                  price: price,
                  mark: mark,
                  files: files,
                  checkType: check,
                  payments: [],
                  others: others
                }
              ]
            })
            .then(res => {
              if (res.data.isSuccess == true) {
                this.beginWokeing(res.data.object);
                this.reimList();
              }
            })
            .catch(err => {
              console.log(err);
            });
          this.$message({
            type: "success",
            message: "创建成功!"
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
    text(formName) {
      console.log(this.joinData1);
    },
    // 报销弹窗
    dialogchange() {
      this.find = 0;
      this.change = false;
      this.dialogFormVisible = true;
    },
    //报销弹窗查看
    dialogFind() {
      console.log(this.ruleForm)
      this.find = 1;
      this.change = true;
      this.dialogFormVisible = true;
    },
    //添加报销
    addbx(formName) {
      console.log(formName);
       this.$refs[formName].validate(valid => {
        if (valid) {
        this.dialogFormVisible3 = true;
        } else {
          this.$message({
          message: '请先填写团期计划',
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
      var paths = null;
      for (var i = 0; i < fileList.length; i++) {
        paths = JSON.parse(fileList[i].response).paths[0];
        this.$set(this.fileList[i], "url", paths.Url);
        this.$set(this.fileList[i], "name", paths.Name);
      }
      this.image = 1;
      this.clearValidate("againimage");
      console.log(fileList);
    },
    //添加报销和删除
    handleTabsEdit(targetName, action) {
      console.log(action);
      console.log(targetName);
      if (action === "add") {
        let newTabName = ++this.tabIndex + "";
        this.editableTabs.push({
          title: "报销" + this.tabIndex,
          name: newTabName,
          content: "New Tab content"
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
          console.log(obj.data.objects);
          that.tableData = obj.data.objects;
        })
        .catch(function(obj) {
          console.log(obj);
        });
    },
     T_check(){//添加报销搜索
  console.log("我是搜索2");
  
  },
  T_update(){//添加报销重置
  console.log("我是重置2");
 

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
      createUser = this.createUser,//申请人
      beginDate= this.beginDate,//开始时间
      endDate = this.endDate,//结束时间
   ) {
      let object = {};
        expenseID !== "" ? (object.expenseID = expenseID) : expenseID,
        groupCode !== "" ? (object.groupCode = groupCode) : groupCode,
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
  },
  created() {
    this.reimList();
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
.upload-demo >>> .el-upload-list__item {
  width: 30%;
}
.handle_div {
  height: 50px;
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
