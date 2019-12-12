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
              <el-input v-model="createUser" placeholder="请输入内容" class="search_input" :disabled="ifShowProposer"></el-input>
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
            <el-table  :data="tableData" border style="width:100%;">
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
              <!-- <el-table-column prop="info" label="审批意见" width="180" align="center"></el-table-column> -->
              <el-table-column prop="guid" label="操作" width="180" align="center">
                <template slot-scope="scope">
                  <div @click="dialogFind(scope)" style="color: #f5a142">详情</div>
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
            <el-tabs
              v-model="ruleForm.editableTabsValue"
              type="card"
              :editable="change ? false : true"
              @tab-click="tabClick"
              @edit="handleTabsEdit"
              style="border: 1px solid #E4E7ED"
            >
              <el-tab-pane
                :key="item.name"
                v-for="item in ruleForm.editableTabs"
                :label="item.title"
                :name="item.name"
              >
              <!-- {{item.content}} -->
              <div class="handle_div">
                <div class="handle_id" v-if="find==1"><span>ID:</span><span style="margin-left: 10px;">{{item.content.id}}</span></div>
                <div class="handle_people" v-if="find==1"><span>申请人:</span><span style="margin-left: 10px;">{{item.content.createUser}}</span></div>
                <div class="handle_time" v-if="find==1"><span>创建时间:</span><span style="margin-left: 10px;">{{item.content.createTime}}</span></div>
              </div>

              <div style="color: red; position: absolute;left: 20px;top: 65px;">*</div>
                <!-- <el-form-item label="团期计划" porp="groupCode">
                  <el-input
                    v-model="item.content.groupCode"
                    ref="groupCode"
                    placeholder="请输入"
                    style="width: 240px;"
                    :disabled="change"
                   ></el-input>
                  <el-input
                    v-model="item.content.productName"
                    placeholder="请输入或者选择团期计划"
                    style="width: 240px;"
                    :disabled="change"
                  ></el-input>
                  <el-button size="mini" @click="planDialog()" v-if="find==0">选择</el-button>
                </el-form-item> -->
                <el-form-item label="团期计划" porp="groupCode"  >
                  <el-autocomplete
                      v-model="item.content.groupCode"
                      ref="groupCode"
                      style="width: 240px;"
                      placeholder="请输入团期计划"
                      :disabled="change"
                      :fetch-suggestions="querySearch3Plan"
                      @select="departurePlan"
                      @blur="tour_check"
                      :trigger-on-focus="false"
                    >
                    </el-autocomplete>
                    <el-input 
                    style="width:300px;" 
                    disabled 
                    v-model="item.content.productName"  
                    placeholder="通过输入团期计划,自动补充产品名称"
                    ></el-input>
                    <el-button size="mini" @click="planDialog()" v-if="find==0">选择</el-button>
                </el-form-item>

                <el-form-item label="摘要" porp="mark">
                  <el-input
                    v-model="item.content.mark"
                    ref="mark"
                    placeholder="请输入"
                    style="width: 480px;"
                    :disabled="change"
                  ></el-input>
                </el-form-item>
                <div style="color: red; color: red; position: absolute;top:127px;left: 48px;">*</div>
                <el-form-item label="附件：" label-width="140px" required>
                  <el-upload 
                  ref="image" 
                  prop="image"
                  class="upload-demo" 
                  multiple
                  name="files"
                  :action= "uploadUrl"
                  :on-success="handleSucess" 
                  :on-change="handleChange"
                  :on-remove="handleRemove"
                  :on-error="handleError" 
                  :on-preview="handlePreview"
                  :before-remove="beforeRemove" 
                  :file-list="item.content.files">
                    <el-button size="small" type="primary" v-if="find==0">点击上传</el-button>
                  </el-upload>
                </el-form-item>
                <div class="re_style">
                  <el-radio v-model="radio" label="1">关联单据</el-radio>
                  <!-- <el-radio v-model="radio" label="2">手添报销明细</el-radio> -->
                </div>
                <div v-if="radio==1" class="re_style" style="margin-top: 20px">
                  <el-button @click="addbx(item.content)" v-if="find==0">增加1</el-button>
                </div>
                <div  style="background: #E6F3FC; height: 33px;width: 1204px;margin-left: 64px;margin-top: 10px; ">
                  <i
                    style="float: left; margin-left: 10px;margin-top: 7px;"
                    class="el-icon-warning"
                  ></i>
                  <div style="float: left;margin-left: 30px;margin-top: 7px;">
                    已选择
                    <span style="color: #249BEB">{{item.content.t_sum}}</span>项
                  </div>
                  <div style="float: left; margin-left: 30px;margin-top: 7px;">
                    报销总计：
                    <span style="font-weight:bold">{{item.content.t_price}}</span>元
                  </div>
                </div>
                <div v-if="radio==1">
                   <div class="re_style">
                    <el-table :data="item.content.payments" border style="width: 100%; margin-top: 30px">
                      
                      <el-table-column prop="paymentID" label="无收入借款或预付款ID" width="100"></el-table-column>
                      <el-table-column prop="supplierTypeEX" label="借款类型" width="90"></el-table-column>
                      <el-table-column prop="supplierName" label="供应商" width="100"></el-table-column>
                      <el-table-column prop="createUser" label="申请人" width="100"></el-table-column>
                      <el-table-column prop="paymentMark" label="摘要" width="120"></el-table-column>
                      <el-table-column prop="paymentPrice" label="借款金额" width="100"></el-table-column>
                      <el-table-column prop="wcount" label="未报销金额" width="100"></el-table-column>

                      <el-table-column prop="price" label="报销金额" style="background: yellow" width="140"  v-if="find==0">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.price" style="width:100px;"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="peopleCount" label="人数" width="140"  v-if="find==0">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.peopleCount" style="width:100px;"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="paymentID" label="操作" width="140"  v-if="find==0">
                          <template slot-scope="scope">
                          <div @click="t_delete(scope.row.paymentID)" style="color: #f5a142">删除</div>
                         </template>
                      </el-table-column>
                    
                      <!-- 不能改的 -->
                       <el-table-column prop="price" label="报销金额" style="background: yellow" width="140" v-if="find==1">  </el-table-column>
                       <el-table-column prop="peopleCount" label="人数" width="140"  v-if="find==1"> </el-table-column>
                       
                    </el-table>
                  </div>
                  <!-- <div class="re_style" style="margin-top: 30px; margin-bottom: 30px">报销金额：100.00</div> -->
                </div>
                <!-- <div v-if="radio==2">
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
                  <div
                   v-for="(domain, index) in domains" 
                   :class="re_style" 
                   style="margin: 20px 0 0 135px;"
                   :key='index+"m"'>
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
                </div> -->
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
          <el-button @click="chanceSubmit(ruleForm)">取 消</el-button>
          <el-button v-if="this.find == 0" type="primary" @click="submitForm(ruleForm)">确 定3</el-button>
          <el-button
            v-if="this.find == 1"
            type="danger"
            @click="chanelSubmit(ruleForm)"
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
            <el-button type="primary" @click="addplan(ruleForm.editableTabsValue)">确 定1</el-button>
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
              style="float: left;width: 140px;"
            ></el-date-picker>
            <el-date-picker
              v-model="endTime2"
              type="date"
              placeholder="终止日期"
              style="float: left;width: 140px;"
            ></el-date-picker>
            <el-button
              type="primary"
              size="mini"
              @click="searchHand4(1)"
              round
              style="margin-top: 5px; margin-left: 10px"
            >搜索</el-button>
            <el-button 
            @click="T_update_btn" 
            type="primary"
            size="mini"
            round
            style="margin-top: 5px; margin-left: 10px"
            >重置</el-button>
            
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
         </div>
      </el-dialog>
      <!--团期计划弹窗end-->
      <!--添加报销弹窗-->
      <el-dialog width="60%" title="添加报销" :visible.sync="dialogFormVisible3" append-to-body @close="t_text_del('joinData')" >
         <span class="search_style">供应商：</span>
              <el-input v-model="t_supplier" placeholder="请输入内容" class="search_input"></el-input>
          <div class="reform_s">
            <el-button @click="T_check" type="primary">搜索2</el-button>
            <el-button @click="T_update" type="primary">重置2</el-button>
          </div>
        <el-table 
        :data="joinData" 
        border 
        style="width: 100%; margin-top: 30px">
          <el-table-column prop="paymentID" label="关联单号" width="60"></el-table-column>
          <el-table-column prop="supplierTypeEX" label="类型" width="80"></el-table-column>
          <el-table-column prop="supplierName" label="供应商" width="90"></el-table-column>
          <!-- <el-table-column prop="supplierName" label="供应商" v-if="this.supplier == 1"></el-table-column> -->
          <el-table-column prop="orgName" label="部门" width="60"></el-table-column>
          <el-table-column prop="createUser" label="申请人" width="80"></el-table-column>
          <el-table-column prop="createTime" label="发起日期" width="130"></el-table-column>
          <el-table-column prop="paymentMark" label="摘要" width="130"></el-table-column>
          <el-table-column prop="price" label="金额" width="90"></el-table-column>
          <el-table-column prop="wcount" label="未报销金额" width="90"></el-table-column>
          <el-table-column prop="bcount" width="120" label="报销金额">
            <template slot-scope="scope">
              <el-input v-model="scope.row.bcount" style="width:90px;"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="peopleCount" width="120" label="人数">
            <template slot-scope="scope">
              <el-input v-model="scope.row.peopleCount" style="width:90px;"></el-input>
            </template>
          </el-table-column>
           <el-table-column prop="paymentID" label="操作" width="140"  v-if="find==2">
            <template slot-scope="scope">
             <div @click="t_delete(scope.row.paymentID)" style="color: #f5a142">删除</div>
            </template>
           </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="t_text_del('joinData')">取 消</el-button>
          <el-button type="primary" @click="t_text('joinData')">确 定2</el-button>
        </div>
      </el-dialog>
      <!--添加报销弹窗end-->
      <!--需要你审批-->
      <el-tab-pane label="需要您审批" name="second">
        <!-- <NeedApproval></NeedApproval> -->
        <approvalToBorrow></approvalToBorrow>
      </el-tab-pane>
      <!--审批end-->
    </el-tabs>
  </div>
</template>

<script>
// import NeedApproval from "@/page/Finance/reimburseManagement/needApproval";
import approvalToBorrow from "@/page/Finance/loanManagement/approvalToBorrow";
import { formatDate } from "@/js/libs/formatDate.js";
import moment from "moment";
export default {
  name: "reimburseManagement",
  components: {
    //NeedApproval
    approvalToBorrow
  },
  data() {
    var areaIdRule = (rule, value, callback) => {
      if (
        this.editableTabs.groupCode == "" ||
        this.editableTabs.productName == ""
      ) {
        return callback(new Error("团期计划不能为空"));
      } else {
          return callback()
      }
    };
    var imageIdRule = (rule, value, callback) => {
      if (this.image == 0) {
        return callback(new Error("上传图片不能为空"));
      } else {
          return callback()
      }
    };

    return {
      uploadUrl: this.GLOBAL.serverSrc + '/upload/obs/api/picture/', // 上传凭证
      image: 0,
      value1: "",
      value2: "",
      ifShowProposer: false, // 当职位为收纳额时候禁止使用申请人检索
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
      supplier:0,//供应商没有的时候显示这个
      startTime2: "",
      endTime2: "",
      pageSize: 10,//每页偏移量
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
          mark: "0",
          price: "0"
        }
      ],
      // 选中报销人字段
      people: {
        tt: "大运通-日本",
        peo: "qq"
      },
      t_price_box:[],//所有价格数组
      //报销表单
    ruleForm: {
      editableTabsValue: "1",
      editableTabs: [
        {
          title: "报销1",
          name: "1",
          content:{
              createUser:"",
              createTime: "",
              id:"",
              groupCode: "",
              productName: "",
              mark: "",
              t_sum:0,//一共多少项
              t_price:0,//一共多少钱
              files:[],
              payments:[],
              joinData:[],
              plan: {
                planId: "",
                planName: ""
              },
             
          }
        }
      ],
      },
      querySearchPlanData: [], // 团期计划检索联想数组
      object_lisr:[],//最后提交的数组
      //报销表单验证
      rules: {
        name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        groupCode: [{ validator: areaIdRule, trigger: "blur" }],
        image: [{ validator: imageIdRule, trigger: "blur" }],
        mark: [
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
      reimData: [{
          reier: "",
          reisult: "",
          info: "",
          time: ""
        }],
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
      tableData: [],
      //团期计划表格
      planData: [],
      //关联单据表单
      joinData:[],
      payments:[],
      file: [],
      //文件上传列表
      files: [],
      
      tabIndex: 1
    };
  },
      methods: {
        moment,
        //切换时候，换内容
        tabClick() {
          console.log(9);
           
        },
        chanceSubmit() { // 取消按钮
        if(this.find == 0){
          this.$confirm("是否取消本次报销申请", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
               this.ruleForm.editableTabs=[{
                title: "报销1",
                name: "1",
                content:{
                    createUser:"",
                    createTime: "",
                    id:"",
                    groupCode: "",
                    productName: "",
                    mark: "",
                    t_sum:0,//一共多少项
                    t_price:0,//一共多少钱
                    files:[],
                    payments:[],
                    joinData:[],
                    plan: {
                      planId: "",
                      planName: ""
                    },
                   }
              }];
              this.tabIndex = 1;
              this.radio= "1";
              this.dialogFormVisible = false;

          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
       }else if(this.find == 1){
              this.ruleForm.editableTabs=[{
                    title: "报销1",
                    name: "1",
                    content:{
                        createUser:"",
                        createTime: "",
                        id:"",
                        groupCode: "",
                        productName: "",
                        mark: "",
                        t_sum:0,//一共多少项
                        t_price:0,//一共多少钱
                        files:[],
                        payments:[],
                        joinData:[],
                        plan: {
                          planId: "",
                          planName: ""
                        },
                       }
                  }];
              this.tabIndex = 1;
              this.radio= "1";
              this.dialogFormVisible = false;
        }
         
        },
        addplan(editableTabsValue) {//确定1
          let one = editableTabsValue - 1;
          let editableTabs = this.ruleForm.editableTabs;
          // let one = editableTabsValue;
          
          editableTabs[one].content.groupCode = this.plans.planNum;
          editableTabs[one].content.productName = this.plans.planName;
          // this.Associated(this.plans.pid);
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
                        let one_index = this.ruleForm.editableTabsValue - 1; 
                        this.ruleForm.editableTabs[one_index].content.joinData.push({
                          paymentID:  object[i].paymentID,
                          supplierTypeEX:object[i].supplierTypeEX,
                          groupCode:object[i].groupCode,
                          productName:object[i].productName,
                          createUser:object[i].createUser,
                          paymentMark:object[i].mark,
                          price:object[i].price,
                          paymentPrice:object[i].price,
                          bcount:0,
                          createTime:object[i].createTime.replace(/T/g, ' ').replace(/.[\d]{3}Z/, ' '),
                          supplierName:object[i].supplierName,
                          peopleCount:object[i].peopleCount,
                          orgName:object[i].orgName,
                          wcount :object[i].price - object[i].collectionPrice
                          //  wcount :object[i].price - object[i].expensePrice
                      });
                      
                    
                      this.joinData = this.ruleForm.editableTabs[one_index].content.joinData
                    }
                    
                      
                })
                .catch(err => {
                  console.log(err);
                });
            },
      
        planChange(row) {  //获取团号和name
          this.plans = {};
          this.plans.planName = row.title;
          this.plans.planNum = row.groupCode;
          this.plans.pid = row.planID;
        },
      
        clickBanle(row) {  // 报销人选中行
          this.people = {};
          this.people.peo = row.name;
          this.people.tt = row.orgName;
        },
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
        //  //删除
        // removeDomain(item) {
        //   var index = this.domains.indexOf(item);
        //   if (index !== -1) {
        //     this.domains.splice(index, 1);
        //   }
        // },
        //添加
        addDomain() {
          this.domains.push({
              mark: "0",
              price: "0"
            });
        },
        add_form(object){ // 提交代码
              this.$http
                    .post(this.GLOBAL.serverSrc + "/finance/expense/api/insertlist", {
                        object:object
                      })
                      .then(res => {
                        console.log(res.data.isSuccess);
                        if (res.data.isSuccess == true) {
                          this.pageList(1, this.pageSize);
                          this.$message({
                            type: "success",
                            message: "创建成功!"
                          });
                          this.beginWokeing(res.data.object);
                          this.pageList();
                          //this.getUserList(1);
                          this.dialogFormVisible = false;
                          this.ruleForm.editableTabs=[{
                              title: "报销1",
                              name: "1",
                              content:{
                                  createUser:"",
                                  createTime: "",
                                  id:"",
                                  groupCode: "",
                                  productName: "",
                                  mark: "",
                                  t_sum:0,//一共多少项
                                  t_price:0,//一共多少钱
                                  files:[],
                                  payments:[],
                                  joinData:[],
                                  plan: {
                                    planId: "",
                                    planName: ""
                                  },
                                  
                                }
                            }];
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
                 
                  
        },
        // 报销申请提交
        submitForm(ruleForm) {
          var joinData_sn=[];
          var files_s=[];
          var editableTabs = ruleForm.editableTabs;
          for(var j in editableTabs){
              let submitForm_list = editableTabs[j].content;
                if(submitForm_list.groupCode !=="" || submitForm_list.mark !== "" ||submitForm_list.files.length !== 0 ){ // 判断必填内容
                  // for (var i in submitForm_list.joinData_s) { //获取关联订单
                  //   joinData_sn.push({
                  //     price:submitForm_list.joinData_s[i].price,
                  //     paymentID:submitForm_list.joinData_s[i].paymentID,
                  //     peopleCount:submitForm_list.joinData_s[i].peopleCount
                  //   });
                  // };
                  for (var i in submitForm_list.files) {//获取上传图片名字和地址
                    files_s.push({
                      name:submitForm_list.files[i].name,
                      url:submitForm_list.files[i].url,
                    });
                  };
                    

                  if(submitForm_list.mark.length > 80 ){
                          this.$message({
                            message:'摘要字数不能超过80字',
                            type: 'warning' 
                        });
                        return false;
                    }
                    for(var n in submitForm_list.payments){
                      if(submitForm_list.payments[n].price > submitForm_list.payments[n].wcount){
                            this.$message({
                                message:'报销金额不得大于未报销金额',
                                type: 'warning' 
                              });
                              return false;
                        }else if(submitForm_list.payments[n].peopleCount === 0){
                          this.$message({
                                message:'人数不能为空',
                                type: 'warning' 
                              });
                              return false;
                        }
                  }
                  this.object_lisr.push({
                            createUser: sessionStorage.getItem('id'),//用户id
                            planID:this.plans.pid,//团期计划id
                            price:submitForm_list.t_price,//总价
                            mark:submitForm_list.mark,
                            files: files_s , //关联数据
                            payments: submitForm_list.payments, //关联付款单据报销明细
                            checkType:0,//审批状态 
                          })
                          //others:this.domains,//手填报销记录明细
                          console.log(this.object_lisr,'ddb');
                          this.add_form(this.object_lisr)//调用提交接口
                }else{

                  this.$message({
                      message: '请检查必填项',
                      type: 'warning' 
                  });
              }
             
            }
            

        },
        beginWokeing(res) {  //启动工作流
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
            let one_index = this.ruleForm.editableTabsValue - 1; 
            let joinData = this.ruleForm.editableTabs[one_index].content.joinData;
            let t_joinData=[];
            this.ruleForm.editableTabs[one_index].content.t_price = 0
            this.t_price_box = [];
            this.ruleForm.editableTabs[one_index].content.payments=[];
            for(let v in joinData){
               t_joinData.push({
                  createTime: joinData[v].createTime.replace(/T/g, ' ').replace(/.[\d]{3}Z/, ' '),
                  createUser:joinData[v].createUser,
                  groupCode:joinData[v].groupCode,
                  orgName: joinData[v].orgName,
                  paymentID: joinData[v].paymentID,
                  paymentMark:joinData[v].paymentMark,
                  paymentPrice: joinData[v].paymentPrice,
                  peopleCount: joinData[v].peopleCount,
                  price: joinData[v].bcount,
                  productName:joinData[v].productName,
                  supplierName: joinData[v].supplierName,
                  supplierTypeEX: joinData[v].supplierTypeEX,
                  wcount: joinData[v].wcount
              })
            }
            for(let i in t_joinData){
                    if(t_joinData[i].price!= "0" ){
                        this.ruleForm.editableTabs[one_index].content.payments.push(t_joinData[i]);
                        this.t_price_box.push(t_joinData[i].price);
                    }
              }

            this.t_price_sum()
            this.dialogFormVisible3 = false;
            this.ruleForm.editableTabs[one_index].content.joinData=[];
        },
        t_text_del(){//确认取消
         console.log("取消2");
         let one_index = this.ruleForm.editableTabsValue - 1; 
         this.dialogFormVisible3 = false;
         this.ruleForm.editableTabs[one_index].content.joinData=[];
        },
        t_delete(paymentID){// 添加数据删除
          let one_index = this.ruleForm.editableTabsValue - 1;
          let payments_box = this.ruleForm.editableTabs[one_index].content.payments;
          this.$confirm("此操作将删除该跟团游信息", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            this.ruleForm.editableTabs[one_index].content.t_price = 0
            this.t_price_box = [];
            this.ruleForm.editableTabs[one_index].content.payments=[];
              for(let j in payments_box){
                console.log(payments_box[j].paymentID);
                if(payments_box[j].paymentID === paymentID){
                      payments_box.splice(j, 1); 
                      this.$message({
                          type: "success",
                          message: "删除成功"
                        });
                      
                  }
                    this.ruleForm.editableTabs[one_index].content.payments.push(payments_box[j]);
                    this.t_price_box.push(payments_box[j].price);
                    this.t_price_sum();
                 }

          })
          .catch(() => {
            console.log(7);
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
        },
        t_price_sum(){//多少项总价多少
          let one_index = this.ruleForm.editableTabsValue - 1; 
          let t_price_box = this.t_price_box;
          let sss = 0 ;
            for(let i=0;i < t_price_box.length;i++){
                  sss = Number(t_price_box[i]) + sss  
              }
          this.ruleForm.editableTabs[one_index].content.t_sum = this.ruleForm.editableTabs[one_index].content.payments.length;//多少项
          this.ruleForm.editableTabs[one_index].content.t_price = sss //多少钱
        },
        // 报销弹窗
        dialogchange() {
          this.payments = [];
          this.find = 0;
          this.change = false;
          this.dialogFormVisible = true;
        },
        //报销弹窗查看
        dialogFind(scope) {//详情
          this.find = 1;
          this.change = true;
          this.dialogFormVisible = true;
          this.ruleForm.editableTabs=[];
          this.$http
                .post(this.GLOBAL.serverSrc + "/finance/expense/api/list", {
                  object:{
                    guid:scope.row.guid,
                  }
                })
                .then(res => {
                  if (res.data.isSuccess == true) {
                    var d_objects = res.data.objects; 
                    let d_objects_content =[];
                    let d_price_box =[];
                    let new_payments_box =[];
                    let qian = 0;
                    let wcount_s = 0;
                    for(let i in d_objects){
                       console.log(d_objects[i],'66');
                       let t_sum = d_objects[i].payments.length;//多少项 
                       for( let s in d_objects[i].payments){
                              wcount_s = d_objects[i].payments[s].paymentPrice -  d_objects[i].payments[s].price;//未报销金额
                              d_price_box.push(d_objects[i].payments[s].price);
                              new_payments_box.push({
                                          code: d_objects[i].payments[s].code,
                                          createTime: d_objects[i].payments[s].createTime.replace(/T/g, ' ').replace(/.[\d]{3}Z/, ' '),
                                          expenseID: d_objects[i].payments[s].expenseID,
                                          id: d_objects[i].payments[s].id,
                                          paymentID: d_objects[i].payments[s].paymentID,
                                          paymentMark: d_objects[i].payments[s].paymentMark,
                                          paymentPrice: d_objects[i].payments[s].paymentPrice,
                                          peopleCount: d_objects[i].payments[s].peopleCount,
                                          price: d_objects[i].payments[s].price,
                                          supplierName: d_objects[i].payments[s].supplierName,
                                          supplierType: d_objects[i].payments[s].supplierType,
                                          supplierTypeEX: d_objects[i].payments[s].supplierTypeEX,
                                          createUser:d_objects[i].createUser,
                                          wcount:wcount_s
                              })
                       }
                      for(let i=0;i < d_price_box.length;i++){ // 多少钱
                          qian = Number(d_price_box[i]) + qian  
                      }

                       d_objects_content.push({
                          createUser:d_objects[i].createUser,
                          createTime: d_objects[i].createTime.replace(/T/g, ' ').replace(/.[\d]{3}Z/, ' '),
                          id:d_objects[i].id,
                          groupCode: d_objects[i].groupCode,
                          productName: d_objects[i].productName,
                          mark:  d_objects[i].mark,
                          t_sum:t_sum,//一共多少项
                          t_price:qian,//一共多少钱
                          files:d_objects[i].files,
                          payments:new_payments_box,
                          joinData:d_objects[i].joinData,
                         

                       })
                       // others:d_objects[i].others,
                       console.log( d_objects_content,'大宝贝')
                    }

                    for(let i in d_objects_content){
                          let newTabName = ++this.tabIndex;
                              newTabName=newTabName-1 +"";
                              console.log(newTabName,"详情");
                                this.ruleForm.editableTabs.push({
                                  title: "报销" + newTabName,
                                  name: newTabName,
                                  content: d_objects_content[i]
                                });
                      }
                        
                      
                  }
                })
                .catch(err => {
                  console.log(err);
                });
        },
        //添加报销
        addbx(item) { 
        //   this.joinData = [];
          if(item.groupCode === "" || item.mark === "" || item.productName === "" || this.image === 0 ){
              this.$message({
                message: '请检查必填项',
                type: 'warning'
              });
          }else{
              this.Associated(this.plans.pid);
              this.dialogFormVisible3 = true;
          }
          //  this.$refs[item].validate(valid => {
          //     if (valid) {
          //     } else {
          //     }
          // });
          
          
        
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
          this.pageList();
        },
        handleCurrentChange(val) {
          this.currentPage4 = val;
          this.pageList();
        },
        //选择报销人
        handleCurrentChange1(val) {
          this.getUserList(val);
          console.log(`当前页: ${val}`);
        },
        //文件上传
        handleChange(file, files) {
          this.files = files.slice(-3);
        },
        //图片上传成功
        handleSucess(res, file, files) {
          var paths = [];
          let one_index = this.ruleForm.editableTabsValue - 1;
          this.ruleForm.editableTabs[one_index].content.files = files;
          for (var i = 0; i < files.length; i++) {
            paths = JSON.parse(files[i].response).paths[0];
            this.$set(this.ruleForm.editableTabs[one_index].content.files[i], "url", paths.Url);
            this.$set(this.ruleForm.editableTabs[one_index].content.files[i], "name", paths.Name);
          }
          this.image = 1;
        }, 
        handleRemove(file, files) {//图片删除
            console.log(file, files);
            this.files = files;
          },
        handleError(err, file) {// 上传失败
          this.files = []
        },
       handlePreview(file) {
            console.log(file);
            window.open(file.url);
          },
        
        beforeRemove(file, files) {

          return this.$confirm(`确定移除 ${ file.name }？`);
        },
        //添加报销和删除
        handleTabsEdit(targetName, action) {
          console.log(action);
          console.log(targetName);
            let newTab= this.getNewTab();
          if (action === "add") {
            let newTabName = ++this.tabIndex + "";
            this.ruleForm.editableTabs.push({
              title: "报销" + this.tabIndex,
              name: newTabName,
              content: newTab
            });
            this.ruleForm.editableTabsValue = newTabName;
            console.log( this.ruleForm.editableTabs );
          }
          if (action === "remove") {
          //  if (this.ruleForm.editableTabs.length == 1) {
          //     console.log(123);
          //   } else {
          //     console.log(567);
          //   }
           this.$confirm("是否需要删除 报销" + targetName, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
           let tabs = this.ruleForm.editableTabs;
                let activeName = this.ruleForm.editableTabsValue;
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

                this.ruleForm.editableTabsValue = activeName;
                this.ruleForm.editableTabs = tabs.filter(tab => tab.name !== targetName);

          })
          .catch(() => {
            console.log(7);
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
          }
        },
      
        getNewTab(){  // 获取新tab实例
          return {
              createUser:"",
              createTime:"",
              groupCode:"",
              productName:"",
              id:"",
              mark:"",
              files:[],
              joinData:[],
              payments:[],
              t_sum:0,//一共多少项
              t_price:0,//一共多少钱
              plan: {
                planId: "",
                planName: ""
              },
              }
        },
        // reimList() {  //获取报销列表数据
        //     var that = this;
        //     this.$http
        //       .post(this.GLOBAL.serverSrc + "/finance/expense/api/page", {
        //         pageIndex: this.currentPage4,
        //         pageSize: this.pageSize,
        //         total: 0,
        //         object: {}
        //       })
        //       .then(function(obj) {
        //         that.pageCount = obj.data.total;
        //         for(let j in obj.data.objects){
        //              that.tableData.push({
        //               beginTime: obj.data.objects[j].beginTime,
        //               checkType: obj.data.objects[j].checkType,
        //               checkTypeEX:  obj.data.objects[j].checkTypeEX,
        //               createTime:  obj.data.objects[j].createTime.replace(/T/g, ' ').replace(/.[\d]{3}Z/, ' '),
        //               createUser:  obj.data.objects[j].createUser,
        //               endTime:  obj.data.objects[j].endTime,
        //               expenseID:  obj.data.objects[j].expenseID,
        //               groupCode:  obj.data.objects[j].groupCode,
        //               guid:  obj.data.objects[j].guid,
        //               orgName:  obj.data.objects[j].orgName,
        //               planID:  obj.data.objects[j].planID,
        //               price:  obj.data.objects[j].price,
        //         })
        //         }
               


        //         //console.log('获取列表报销数据',that.tableData);
        //       })
        //       .catch(function(obj) {
        //         console.log(obj);
        //       });
        // },

        T_check(){ //添加报销搜索
          this.joinData=[];
          this.Associated(this.plans.pid);
        },
        T_update(){//添加报销重置
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
            this.pageIndex = 1;
            this.currentPage4 = 1;
            this.pageList(1, this.pageSize);
            
          },
        handleReset() { // 重置
            this.pageIndex = 1;
            this.currentPage4 = 1;
            this.expenseID = "";
            this.groupCode = "";
            this.createUser = "";
            this.beginDate = "";
            this.endDate = "";
            this.pageList(1, this.pageSize);
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
        ){
            var that = this;
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

            that.$http
              .post(that.GLOBAL.serverSrc + "/finance/expense/api/page", {
                pageIndex: that.currentPage4,
                pageSize: that.pageSize,
                total: 0,
                object: object
              })
              .then(function(obj) {

                console.log(obj.data.objects,'查询数据');
                that.pageCount = obj.data.total;
                  for(let j in obj.data.objects){
                     this.tableData.push({
                      beginTime: obj.data.objects[j].beginTime,
                      checkType: obj.data.objects[j].checkType,
                      checkTypeEX:  obj.data.objects[j].checkTypeEX,
                      createTime:  obj.data.objects[j].createTime.replace(/T/g, ' ').replace(/.[\d]{3}Z/, ' '),
                      createUser:  obj.data.objects[j].createUser,
                      endTime:  obj.data.objects[j].endTime,
                      expenseID:  obj.data.objects[j].expenseID,
                      groupCode:  obj.data.objects[j].groupCode,
                      guid:  obj.data.objects[j].guid,
                      orgName:  obj.data.objects[j].orgName,
                      planID:  obj.data.objects[j].planID,
                      price:  obj.data.objects[j].price,
                })
                }
                console.log(this.tableData,'查询数据');
                })
              .catch(function(obj) {
                console.log(obj);
              });
        },
        endDateChange() { //判断结束时间不能在开始时间之前
          let beginTime = moment(this.beginDate).format("YYYYMMDD");
          let entTime = moment(this.endDate).format("YYYYMMDD");
          if (this.beginDate !== "") {
            if (entTime < beginTime) {
              this.$message.error("结束时间不能早于开始时间");
              this.endDate = "";
            }
          }
        },

        // beginDateBlur() {
        //   if (this.beginDate == "" && this.endDate == "") {
        //     this.pageList(1, this.pageSize);
        //   }
        // },
        
        querySearch3Plan(queryStringPlan, cb) { // 团号搜索联想
            let one = this.ruleForm.editableTabsValue - 1;
            let groupCode = this.ruleForm.editableTabs[one].content.groupCode;
            this.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/planfinancelist', {
              "object": {
                "groupCode": groupCode, // 团号
              }
            }).then(res => {
                for (let i = 0; i < res.data.objects.length; i++) {
                      this.querySearchPlanData.push({
                          "value": res.data.objects[i].groupCode,
                          "planID": res.data.objects[i].planID,
                        })
                    }
              var results = queryStringPlan ? this.querySearchPlanData.filter(this.createFilter(queryStringPlan)) : [];
              cb(results)
            }).catch(err => {})
        },
        tour_check() {   // 团期计划输入框失去焦点时
            let one = this.ruleForm.editableTabsValue - 1;
            let groupCode = this.ruleForm.editableTabs[one].content.groupCode;
            if (groupCode != '') {
              this.$http.post(this.GLOBAL.serverSrc + "/teamquery/get/api/planfinancelist", {
                "object": {
                  "groupCode": groupCode, // 团号
                }
              }).then(res => {
                if (res.data.isSuccess == true) {
                  this.ruleForm.editableTabs[one].content.productName = res.data.objects[0].title
                  this.plans.pid  = res.data.objects[0].planID
                  }
              }).catch(err => {
                console.log(err)
              })
            } 
        },
        departurePlan(item) { // 团期计划选中
          this.plans.pid = item.planID
        },
        createFilter(queryString1){   // 模糊查询返回下拉选中项 - 查询返回value的
          return (restaurant) => {
            return (restaurant.value);
          }
        },
      
     
     

     //方法结尾
     },

      created() {
        this.pageList();
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
    width: 99%;
    margin: 25px auto;
    height: auto;
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
  width: 99%;
  margin-left: 20px;
  margin-top: 20px;
}
.reform_s {
  float: right;
  margin-bottom: 20px;
  margin-top: 20px;
}
.table_style {
  width: 98%;
  margin-left: 20px;
  margin-top: 20px;
  float: left;
}
.block {
  float: left;
  margin-left: 600px;
  margin-top: 70px;
  margin-bottom: 60px;
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
  height: 50px;
  line-height: 40px;
  margin-left: 40px;
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
