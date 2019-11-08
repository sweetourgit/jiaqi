<!-- 预付款管理 -> 需要您审批 -->
<template>
  <div class="all">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- 搜索表单 -->
      <el-form :model="ruleFormSeach" ref="ruleFormSeach" label-width="80px" id="form-content">
        <el-row type="flex" class="row-bg">
          <el-col :span="8">
            <el-form-item label="团期计划:" prop="groupCode_01">
              <el-input v-model="ruleFormSeach.groupCode_01" placeholder="请输入团期计划"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="借款人:" prop="borrower">
              <el-input v-model="ruleFormSeach.borrower" placeholder="请输入借款人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="申请时间:">
              <el-col :span="11">
                <el-form-item prop="startTime">
                  <el-date-picker type="date" placeholder="选择开始日期" v-model="ruleFormSeach.startTime" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item prop="endTime">
                  <el-date-picker type="date" placeholder="选择结束日期" v-model="ruleFormSeach.endTime" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="5" style="text-align: center">
            <el-form-item>
              <el-button @click="searchHand()" type="primary">搜索</el-button>
              <el-button @click="resetHand('ruleFormSeach')" type="primary">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 搜索表单 END -->
      <!-- 表格 -->
      <el-table :data="tableData" border :highlight-current-row="true" @row-click="clickBanle" :header-cell-style="getRowClass" id="table-content">
        <el-table-column prop="paymentID" label="借款单号" align="center">
        </el-table-column>
        <el-table-column label="发起时间" align="center" width="190">
          <template slot-scope="scope">
            {{formatDate1(scope.row.createTime)}}
          </template>
        </el-table-column>
        <el-table-column prop="groupCode" label="团期计划" align="center" width="230">
        </el-table-column>
        <el-table-column prop="supplierName" label="供应商名称" align="center" width="170">
        </el-table-column>
        <el-table-column prop="supplierTypeEX" label="类型" align="center" width="90">
        </el-table-column>
        <el-table-column cell-style prop="price" label="借款金额" align="center" width="90">
        </el-table-column>
        <el-table-column prop="createUser" label="申请人" align="center" width="90">
        </el-table-column>
        <el-table-column prop="opinion" label="操作" align="center" width="100">
           <template slot-scope="scope">
              <el-button @click="dialogFind(scope.row)" type="text" size="small" class="table_details">详情</el-button>
           </template>
        </el-table-column>
      </el-table>
      <!-- 表格 END -->
      <!-- 翻页 -->
      <el-row type="flex" class="paging">
        <el-col :span="8" :offset="13">
          <el-pagination
            v-if="pageshow1"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[5, 10, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total='total'
            background
          >
          </el-pagination>
        </el-col>
      </el-row>
      <!-- 翻页 END -->
      <!-- 报销弹窗 -->
      <!-- 申请预付款 -->
      <el-dialog title="申请预付款" :visible.sync="dialogFormVisible" width=60% :show-close="false">
        <div v-if="this.find == 1" class="sh_style">审核中</div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <div class="btn" style="position:absolute;z-index:9;top:20px;right:5%;">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button v-if="this.find == 1" type="primary" @click="Transfer ('ruleForm')">转办</el-button>
            <el-button v-if="this.find == 1" type="success" @click="submitForm('ruleForm')">确 定</el-button>
            <el-button v-if="this.find == 1" type="danger" @click="boSubmit('ruleForm')">驳回</el-button>
          </div>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <!-- 基本信息 -->
            <el-tab-pane label="预付款申请" name="first">
              <div>
                <!--申请人-->
                <el-form-item label="申请人" prop="user" ref="user" label-width="120px">
                  <div class="destination-input">
                    <el-tag :key="tag3.pod" v-for="tag3 in dynamicTags3" closable :disable-transitions="false" @close="handleClose3(tag3)">
                      {{tag3.pod}}
                    </el-tag>
                    <el-autocomplete id="ddd" class="input-new-tags" v-model="ruleForm.user" v-if="inputVisible3" ref="saveTagInput" size="small" placeholder="请输入申请人" :trigger-on-focus="false"></el-autocomplete>
                    <el-button v-else class="input-new-tag" size="small" :disabled="change" @click="showInput3">请输入申请人</el-button>
                  </div>
                  <span id="isNull" v-show="noNull">不能为空</span>
                </el-form-item>
                <!--团期计划-->
                <el-form-item label="团期计划" prop="tour" label-width="120px">
                  <el-input v-model="ruleForm.tour" :disabled="true" @blur="tour_check" class="productName" placeholder="请输入或者选择团期计划"></el-input>
                  <el-input v-model="ruleForm.productName" :disabled="true" class="productName" placeholder="自动补充产品名称" style="width:30%;"></el-input>
                  <el-button class="input-new-tag2" size="small" :disabled="change" @click="showInput4">选择</el-button>
                </el-form-item>
                <!-- 供应商 -->
                <el-form-item label="供应商" prop="supplier" ref="supplier" label-width="120px">
                  <div class="destination-input">
                    <el-tag :key="tag2.id" v-for="tag2 in dynamicTags2" closable :disable-transitions="false" @close="handleClose2(tag2)">
                      {{tag2.label}}
                    </el-tag>
                    <el-autocomplete id="input-error" :disabled="change" class="lable_input" v-if="inputVisible2" v-model="ruleForm.supplier" ref="saveTagInput" size="small" placeholder="请输入供应商" @keyup.enter.native="handleInputConfirm2" :fetch-suggestions="querySearch5" :trigger-on-focus="false" @select="dest_01" @blur="handleInputConfirm2">
                    </el-autocomplete>
                    <el-button v-else class="operation_Label" :disabled="change" v-show="supplierLength" size="small" @click="showInput2">请输入供应商</el-button>
                  </div>
                  <span id="empty" v-show="empty">不能为空</span>
                </el-form-item>
                <!-- 类型 -->
                <el-form-item label="类型" prop="type" label-width="120px">
                  <el-select style="float: left;" v-model="ruleForm.type" placeholder="请选择" :disabled="change">
                    <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <!-- 借款金额 -->
                <el-form-item label="借款金额" prop="loanMoney" label-width="120px">
                  <el-input type="number" v-model="ruleForm.loanMoney" class="bright" placeholder="借款金额" :disabled="change"></el-input>
                </el-form-item>
                <!-- 借款数量 -->
                <el-form-item label="借款数量" prop="loanNumber" class="bright_b" label-width="120px" style="margin-left: 35%;">
                  <el-input type="number" v-model="ruleForm.loanNumber" class="lightspot" placeholder="借款数量" :disabled="change" style='margin-left: 10px;'></el-input>
                </el-form-item>
                <!-- 摘要 -->
                <el-form-item label="摘要" prop="abstract" label-width="120px">
                  <el-input v-model="ruleForm.abstract" class="bright" placeholder="摘要" :disabled="change"></el-input>
                </el-form-item>
                <!-- 账户 -->
                <el-form-item label="账户" prop="account" label-width="120px">
                  <el-input v-model="ruleForm.account" class="bright" placeholder="账户" :disabled="change"></el-input>
                </el-form-item>
                <!-- 开户行 -->
                <el-form-item label="开户行" prop="bank" label-width="120px">
                  <el-input v-model="ruleForm.bank" class="bright" placeholder="开户行" :disabled="change"></el-input>
                </el-form-item>
                <!-- 开户行 -->
                <el-form-item label="开户名" prop="bankName" label-width="120px">
                  <el-input v-model="ruleForm.bankName" class="bright" placeholder="开户名" :disabled="change"></el-input>
                </el-form-item>
                <!-- 付款方式 -->
                <el-form-item label="付款方式" prop="payMode" label-width="120px">
                  <el-select style="float: left;" v-model="ruleForm.payMode" placeholder="请选择" :disabled="change">
                    <el-option v-for="item in payModeList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="附件" label-width="120px">
                  <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :disabled="change" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                  </el-upload>
                </el-form-item>
                <el-form-item label="" label-width="120px" label-height="auto">
                  <el-table :data="tableData5" border style="width:70%" :header-cell-style="getRowClass2">
                    <el-table-column prop="total" label="订单总额" align="center">
                    </el-table-column>
                    <el-table-column prop="isTotal" label="已审批总额" align="center">
                    </el-table-column>
                    <el-table-column prop="onTotal" label="审批中总额" align="center">
                    </el-table-column>
                    <el-table-column prop="sucTotal" label="已收总额" align="center">
                    </el-table-column>
                    <el-table-column prop="supTotal" label="供应商欠款总额" align="center">
                    </el-table-column>
                    </el-table-column>
                  </el-table>
                </el-form-item>
                <el-form-item label="付款明细" label-width="120px" label-height="auto">
                  <br />
                  <el-table :data="tableData6" border style="width:100%" :header-cell-style="getRowClass2">
                    <el-table-column prop="id" label="ID" align="center">
                    </el-table-column>
                    <el-table-column prop="status" label="状态" align="center">
                    </el-table-column>
                    <el-table-column prop="type" label="类型" align="center">
                    </el-table-column>
                    <el-table-column prop="supplier" label="供应商" align="center">
                    </el-table-column>
                    <el-table-column prop="price" label="付款金额" align="center">
                    </el-table-column>
                    <el-table-column prop="number" label="人数" align="center">
                    </el-table-column>
                    <el-table-column prop="org" label="部门" align="center">
                    </el-table-column>
                    <el-table-column prop="user" label="申请人" align="center">
                    </el-table-column>
                    <el-table-column prop="createTime" label="申请日期" align="center">
                    </el-table-column>
                    <el-table-column prop="abstract" label="摘要" align="center">
                    </el-table-column>
                    <el-table-column label="审批过程" align="center">
                      <template slot-scope="scope">
                        <span style="color:blue;" v-on:click="advanceProcess2(scope.row.id)">查看</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="cancellationMoney" label="已核销金额" align="center">
                    </el-table-column>
                  </el-table>
                </el-form-item>
                <el-form-item label="" label-width="120px" label-height="auto" style="margin-top: -21px;" v-if="dialogVisible6">
                  <el-table :data="tableData11" border style="width:55%" :header-cell-style="getRowClass2">
                    <el-table-column prop="createTime" label="申请日期" align="center">
                    </el-table-column>
                    <el-table-column prop="user" label="申请人" align="center">
                    </el-table-column>
                    <el-table-column prop="status" label="状态" align="center">
                    </el-table-column>
                    <el-table-column prop="abstract" label="摘要" align="center">
                    </el-table-column>
                  </el-table>
                </el-form-item>
                <el-form-item label="无收入借款明细" label-width="120px" label-height="auto">
                  <br />
                  <el-table :data="tableData7" border style="width:90%" :header-cell-style="getRowClass2">
                    <el-table-column prop="id" label="ID" align="center">
                    </el-table-column>
                    <el-table-column prop="status" label="状态" align="center">
                    </el-table-column>
                    <el-table-column prop="type" label="类型" align="center">
                    </el-table-column>
                    <el-table-column prop="supplier" label="供应商" align="center">
                    </el-table-column>
                    <el-table-column prop="price" label="付款金额" align="center">
                    </el-table-column>
                    <el-table-column prop="org" label="部门" align="center">
                    </el-table-column>
                    <el-table-column prop="user" label="申请人" align="center">
                    </el-table-column>
                    <el-table-column prop="createTime" label="申请日期" align="center">
                    </el-table-column>
                    <el-table-column prop="abstract" label="摘要" align="center">
                    </el-table-column>
                    <el-table-column label="审批过程" align="center">
                      <template slot-scope="scope">
                        <span style="color:blue;" v-on:click="advanceProcess(scope.row.id)">查看</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="cancellationMoney" label="已核销金额" align="center">
                    </el-table-column>
                  </el-table>
                </el-form-item>
                <el-form-item label="" label-width="120px" label-height="auto" style="margin-top: -21px;" v-if="dialogVisible5">
                  <el-table :data="tableData10" border style="width:55%" :header-cell-style="getRowClass2">
                    <el-table-column prop="createTime" label="申请日期" align="center">
                    </el-table-column>
                    <el-table-column prop="user" label="申请人" align="center">
                    </el-table-column>
                    <el-table-column prop="status" label="状态" align="center">
                    </el-table-column>
                    <el-table-column prop="abstract" label="摘要" align="center">
                    </el-table-column>
                  </el-table>
                </el-form-item>
                <el-form-item label="收入明细" label-width="120px" label-height="auto">
                  <br />
                  <el-table :data="tableData8" border style="width:85%" :header-cell-style="getRowClass2">
                    <el-table-column prop="oNo" label="订单编号" align="center">
                    </el-table-column>
                    <el-table-column prop="source" label="来源" align="center">
                    </el-table-column>
                    <el-table-column prop="user" label="联系人" align="center">
                    </el-table-column>
                    <el-table-column prop="number" label="人数" align="center">
                    </el-table-column>
                    <el-table-column prop="total" label="订单金额" align="center">
                    </el-table-column>
                    <el-table-column prop="accepted" label="已收" align="center">
                    </el-table-column>
                    <el-table-column prop="arrears" label="欠款" align="center">
                    </el-table-column>
                    <el-table-column prop="aNo" label="收款单号" align="center">
                    </el-table-column>
                    <el-table-column prop="arrearsTime" label="欠款日期" align="center">
                    </el-table-column>
                    <el-table-column prop="repaymentTime" label="应还日期" align="center">
                    </el-table-column>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </el-dialog>
      <!-- 预付款弹窗 END -->
      <!--协办弹窗-->
      <el-dialog style="text-align: left" title="选择协办人:" :visible.sync="dialogFormVisible1" width="50%">
        <div style="text-align: center">
          <div style="width: 100%">
            <div class="button_select" style="margin-bottom: 30px;margin-top: -30px;">
              <el-input v-model="apply_user_input" class="input" style='margin-left: 0px;'></el-input>
              <el-button type="primary" @click="searchHand2()" size="medium">搜索</el-button>
            </div>
            <div class="table_trip" style=" width: 100%;">
              <el-table :data="tableData3" border style="width: 100%" :highlight-current-row="true" @row-click="clickBanle2" :header-cell-style="getRowClass2">
                <el-table-column prop="id" label="ID" align="center" width="100%">
                </el-table-column>
                <el-table-column prop="name" label="姓名" width="120%" align="center">
                </el-table-column>
                <el-table-column prop="org" label="组织" align="center">
                </el-table-column>
                </el-table-column>
              </el-table>
            </div>
            <!--分页-->
            <div class="block" style="margin-top: 30px;text-align:center;">
              <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page.sync="currentPage2" :page-sizes="[5, 10, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total=total2>
              </el-pagination>
            </div>
            <!--分页-->
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="routerHandle2()">确 定</el-button>
        </span>
      </el-dialog>
      <!--报销人弹窗end-->
      <!--团期计划弹窗-->
      <el-dialog width="60%" title="选择报销的人" :visible.sync="dialogFormVisible2" append-to-body>
        <div class="indialog">
          <div class="indialog_search">
            <span class="search_style">团期单号：</span>
            <el-input v-model="planNum" placeholder="请输入内容" class="search_input"></el-input>
            <span class="search_style">产品名称：</span>
            <el-input v-model="planName" placeholder="请输入内容" class="search_input"></el-input>
            <span class="search_style">出行日期：</span>
            <el-input v-model="planTime" placeholder="请输入内容" style="float: left; width: 100px"></el-input>
            <span class="search__">—</span>
            <el-input v-model="planTime1" placeholder="请输入内容" style="float: left; width: 100px"></el-input>
            <el-button type="primary" size="mini" round style="margin-top: 5px; margin-left: 10px">重置</el-button>
          </div>
          <el-table :data="planData" border style="width: 100%; margin-top: 30px">
            <el-table-column prop="id" label="团期计划ID">
            </el-table-column>
            <el-table-column prop="name" label="产品名称">
            </el-table-column>
            <el-table-column prop="address" label="目的地">
            </el-table-column>
            <el-table-column prop="time" label="出行日期">
            </el-table-column>
            <el-table-column prop="ornize" label="部门">
            </el-table-column>
            <el-table-column prop="proer" label="产品录入人">
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
      <!--团期计划弹窗end-->
      <!--添加报销弹窗-->
      <el-dialog width="60%" title="添加报销" :visible.sync="dialogFormVisible3" append-to-body>
        <el-table :data="joinData1" border style="width: 100%; margin-top: 30px">
          <el-table-column prop="id" label="关联单号" width="80">
          </el-table-column>
          <el-table-column prop="type" label="类型" width="70">
          </el-table-column>
          <el-table-column prop="gys" label="供应商" width="60">
          </el-table-column>
          <el-table-column prop="bm" label="部门">
          </el-table-column>
          <el-table-column prop="accpeter" label="申请人" width="80">
          </el-table-column>
          <el-table-column prop="time" label="发起日期">
          </el-table-column>
          <el-table-column prop="content" label="摘要">
          </el-table-column>
          <el-table-column prop="count" label="金额" width="100">
          </el-table-column>
          <el-table-column prop="wcount" label="未报销金额">
          </el-table-column>
          <el-table-column prop="bcount" label="报销金额">
            <template slot-scope="scope">
              <el-input v-model="scope.row.bcount" style="width:100px;"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="text('joinData1')">确 定</el-button>
        </div>
      </el-dialog>
      <!--添加报销弹窗end-->
      <!--驳回意见弹窗-->
      <el-dialog title="请填写审批意见" :visible.sync="dialogFormVisible4" width="30%">
        <textarea style="width: 90%; height: 132px; resize:none;margin-left: 13px; ">123123</textarea>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
      </el-dialog>
      <!--驳回意见弹窗end-->
    </el-tabs>
  </div>
</template>
<script>
export default {
  name: "needApproval",
  data() {
    var areaIdRule = (rule, value, callback) => {
      console.log(this.ruleForm)
      if (this.ruleForm.plan.planId == '' || this.ruleForm.plan.planName == '') {
        return callback(new Error('团期计划不能为空'));
      } else {
        callback();

      }
    };
    var areamoneyRule = (rule, value, callback) => {
      console.log(this.ruleForm)
      if (this.ruleForm.money.type == '' || this.ruleForm.money.count == '') {
        return callback(new Error('报销金额不能为空'));
      } else {
        callback();

      }
    };
    return {
      ruleFormSeach:{
        groupCode_01: '',
        borrower: '',
        startTime: '',
        endTime: ''
      },
      apply_user_input: '', //选择申请人员
      pageNum: 1, // 设定当前页数
      pageSize: 10, // 设定默认分页每页显示数 todo 具体看需求
      total: 0,
      total2: 0,
      find: 0, // 分辨查看
      change: false,
      radio: '1', // 单选
      dialogFormVisible2: false, // 团期计划弹窗
      dialogFormVisible3: false, // 添加报销
      dialogFormVisible: false, // 报销表单弹窗
      dialogFormVisible1: false, // 报销人弹窗
      dialogFormVisible4: false, // 审批意见弹窗
      planNum: '', // 团期计划搜索
      planName: '',
      planTime: '',
      planTime1: '',
      domains: [{ // 手添报销
        type: '地接',
        money: '9000.00'
      }],
      ruleForm: { // 报销表单
        name: [{
          tt: '大运通-日本',
          peo: '阳阳'
        }],
        plan: {
          planId: '',
          planName: ''
        },
        money: {
          type: '小费',
          count: '1000.00'
        },
        content: ''
      },
      rules: { // 报销表单验证
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
        ],
        plan: [
          { validator: areaIdRule, trigger: 'blur' }
        ],
        money: [
          { validator: areamoneyRule, trigger: 'blur' }
        ],
        contents: [
          { required: true, message: '请输入摘要信息', trigger: 'blur' },
        ],
      },
      reimData: [{ // 审批意见
        reier: '',
        reisult: '',
        info: '',
        time: '',
      }],
      formLabelWidth: '120px',
      currentPage2: 1,
      activeName: 'first',
      number: '',
      plan: '',
      accepter: '',
      pageshow1:true,
      startTime: '',
      endTime: '',
      tableData: [], // 报销table
      tableData1: [{ // 报销人表单
        id: '001',
        name: '张三',
        phone: '15566447881',
        orinaze: '辽宁大运通-销售部-主管 辽宁大运通-销售部-主管',
        sex: '男',
        type: '启用'
      }, {
        id: '001',
        name: '张三',
        phone: '15566447881',
        orinaze: '大运通-财务部',
        sex: '男',
        type: '启用'
      }, {
        id: '001',
        name: '张三',
        phone: '15566447881',
        orinaze: '大运通-财务部',
        sex: '男',
        type: '启用'
      }, {
        id: '001',
        name: '张三',
        phone: '15566447881',
        orinaze: '大运通-财务部',
        sex: '男',
        type: '启用'
      }],
      planData: [{ // 团期计划表格
        id: 'TC-GTY-1001-01-180806-01',
        name: '美国西海岸三城双奥莱10日之旅',
        address: '西雅图',
        time: '2019-01-09',
        ornize: '辽宁大运通-北美部',
        proer: '阳阳',
      }, {
        id: 'TC-GTY-1001-01-180806-01',
        name: '美国西海岸三城双奥莱10日之旅',
        address: '西雅图',
        time: '2019-01-09',
        ornize: '辽宁大运通-北美部',
        proer: '阳阳',
      }],
      joinData: [{ // 关联单据表单
        id: '1',
        type: '地接',
        gys: '国旅',
        bm: '辽宁大运通-北美部',
        accpeter: '阳阳',
        time: '2019-01-09 09:37',
        content: '',
        count: '17800.00',
        wcount: '17800.00',
        bcount: '17800.00',
      }, {
        id: '1',
        type: '地接',
        gys: '国旅',
        bm: '辽宁大运通-北美部',
        accpeter: '阳阳',
        time: '2019-01-09 09:37',
        content: '',
        count: '17800.00',
        wcount: '17800.00',
        bcount: '17800.00',
      }],
      joinData1: [{
        id: '1',
        type: '地接',
        gys: '国旅',
        bm: '辽宁大运通-北美部',
        accpeter: '阳阳',
        time: '2019-01-09 09:37',
        content: '',
        count: '17800.00',
        wcount: '17800.00',
        bcount: '',
      }, {
        id: '1',
        type: '地接',
        gys: '国旅',
        bm: '辽宁大运通-北美部',
        accpeter: '阳阳',
        time: '2019-01-09 09:37',
        content: '',
        count: '17800.00',
        wcount: '17800.00',
        bcount: '',
      }],
      tableData3: [],
      tableData5: [{
        total: '订单总额',
        isTotal: '已审批总额',
        onTotal: '审批中总额',
        sucTotal: '已收总额',
        supTotal: '供应商欠款总额',
      }],
      tableData6: [{
        id: 'ID',
        status: '状态',
        type: '类型',
        supplier: '供应商',
        price: '付款金额',
        number: '人数',
        org: '部门',
        user: '申请人',
        createTime: '申请日期',
        abstract: '摘要',
        approval: '审批过程',
        cancellationMoney: '已核销金额',
      }],
      tableData7: [{
        id: 'ID',
        status: '状态',
        type: '类型',
        supplier: '供应商',
        price: '付款金额',
        org: '部门',
        user: '申请人',
        createTime: '申请日期',
        abstract: '摘要',
        approval: '审批过程',
        cancellationMoney: '已核销金额',
      }],
      tableData8: [{
        oNo: '订单编号',
        source: '来源',
        user: '联系人',
        number: '人数',
        total: '订单金额',
        accepted: '已收',
        arrears: '欠款',
        aNo: '收款单号',
        arrearsTime: '欠款日期',
        repaymentTime: '应还日期',
      }],
      tableData10: [{
        id: '1',
        createTime: '审批时间',
        user: '审批人',
        status: '审批结果',
        abstract: '审批意见',
      }, {
        id: '2',
        createTime: '审批时间',
        user: '审批人',
        status: '审批结果',
        abstract: '审批意见',
      }],
      tableData11: [{
        id: '1',
        createTime: '审批时间',
        user: '审批人',
        status: '审批结果',
        abstract: '审批意见',
      }, {
        id: '2',
        createTime: '审批时间',
        user: '审批人',
        status: '审批结果',
        abstract: '审批意见',
      }],
      fileList: [{ // 文件上传列表
        name: 'food.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }, {
        name: 'food2.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }, {
        name: 'food2.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }, {
        name: 'food2.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }, {
        name: 'food2.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }, {
        name: 'food2.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }, {
        name: 'food2.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }],
      editableTabsValue: '1',
      editableTabs: [{
        title: 'Tab 1',
        name: '1',
        content: 'Tab 1 content'
      }],
      tabIndex: 1,
      reable: true,
      pid: 0,
      dynamicTags3: [],
      dynamicTags2: [],
      inputVisible3: false,
      noNull: '',
      empty: '',
      inputVisible2: false,
      supplierLength: true,
      type: '',
      typeList: [{
        value: '选项1',
        label: '地接'
      }, {
        value: '选项2',
        label: '机票（本公司）'
      }, {
        value: '选项3',
        label: '机票（非本公司）'
      }, {
        value: '选项4',
        label: '小费'
      }, {
        value: '选项5',
        label: '签证'
      }, {
        value: '选项6',
        label: '火车票'
      }, {
        value: '选项7',
        label: '汽车票'
      }, {
        value: '选项8',
        label: '船票'
      }, {
        value: '选项9',
        label: '其他'
      }, {
        value: '选项10',
        label: '返款'
      }],
      payMode: '',
      payModeList: [{
        value: '选项1',
        label: '网银'
      }, {
        value: '选项2',
        label: '现金'
      }, {
        value: '选项3',
        label: '支付宝'
      }, {
        value: '选项4',
        label: '微信'
      }],
      tableData5: [],
      tableData6: [{
        id: 'ID',
        status: '状态',
        type: '类型',
        supplier: '供应商',
        price: '付款金额',
        number: '人数',
        org: '部门',
        user: '申请人',
        createTime: '申请日期',
        abstract: '摘要',
        approval: '审批过程',
        cancellationMoney: '已核销金额',
      }],
      tableData7: [{
        id: 'ID',
        status: '状态',
        type: '类型',
        supplier: '供应商',
        price: '付款金额',
        org: '部门',
        user: '申请人',
        createTime: '申请日期',
        abstract: '摘要',
        approval: '审批过程',
        cancellationMoney: '已核销金额',
      }],
      tableData8: [{
        oNo: '订单编号',
        source: '来源',
        user: '联系人',
        number: '人数',
        total: '订单金额',
        accepted: '已收',
        arrears: '欠款',
        aNo: '收款单号',
        arrearsTime: '欠款日期',
        repaymentTime: '应还日期',
      }],
      dialogVisible5: false,
      dialogVisible6: false,
    };
  },
  methods: {
    advanceProcess2(num) {
      console.log(num)
      this.dialogVisible6 = true
    },
    advanceProcess(num) {
      console.log(num)
      this.dialogVisible5 = true
    },
    showInput2() {
      if (this.dynamicTags2.length < 1) {
        this.inputVisible2 = true;
        this.ruleForm.supplier
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      }
      this.$refs.ruleForm.validateField('supplier')
    },
    tour_check() {
      if (this.ruleForm.tour != '') {
        this.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/page', {
          "pageIndex": 1,
          "pageSize": 1,
          "object": {
            "title": this.tour,
          }
        }).then(res => {
          if (res.data.isSuccess == true) {
            this.product_name_pre = res.data.objects[0].groupCode
            this.ruleForm.productName = res.data.objects[0].groupCode
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.ruleForm.productName = ''
      }
    },
    showInput4() {
      this.dialogVisible2 = true;
    },
    showInput3() {
      this.dialogVisible = true
    },
    handlePreview(file, fileList) {
      console.log(file)
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    //文件上传
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    },
    // 表格头部背景颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
    getRowClass2({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
    //获取id
    clickBanle(row, event, column) {
      this.pid = row['id'];
      this.reable = false;
    },
    //获取id
    clickBanle2(row, event, column) {
      this.user_id = row['id'];
      this.user_name = row['name'];
      this.reable = false;

    },
    //删除
    removeDomain(item) {
      var index = this.domains.indexOf(item)
      if (index !== -1) {
        this.domains.splice(index, 1)
      }
    },
    //添加
    addDomain() {
      this.domains.push({
        type: '',
        money: ''
      });
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //转办
    Transfer() {
      this.dialogFormVisible1 = true
    },
    //驳回
    boSubmit() {
      this.dialogFormVisible4 = true
    },
    //撤销申请
    chanelSubmit() {
      this.$confirm('是否撤销该条借款, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '撤销成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消撤销'
        });
      });
    },
    text(formName) {
      console.log(this.joinData1)
    },
    // 报销弹窗
    dialogchange() {
      this.find = 0;
      this.change = false
      this.dialogFormVisible = true;
    },
    //报销弹窗查看
    dialogFind() {
      this.find = 1;
      this.change = true
      this.dialogFormVisible = true;
    },
    //添加报销
    addbx() {
      this.dialogFormVisible3 = true;
    },
    //报销人选择弹窗
    adddialog() {
      this.dialogFormVisible1 = true;
    },
    routerHandle2() { //转办
      this.$confirm('是否转办该条审批, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '转办成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消转办'
        });
      });
    },
    //团期计划弹窗
    planDialog() {
      this.dialogFormVisible2 = true;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    //文件上传
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    },
    //添加报销和删除
    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        let newTabName = ++this.tabIndex + '';
        this.editableTabs.push({
          title: 'New Tab',
          name: newTabName,
          content: 'New Tab content'
        });
        this.editableTabsValue = newTabName;
      }
      if (action === 'remove') {
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
    handleCurrentChange(val) {
      this.pageNum = val;
      if (this.firstTab) {
        this.firstIndex = val
      }
      if (this.secondTab) {
        this.secondIndex = val
      }
      this.searchHand(val,this.pageSize);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.searchHand(1,val);
    },
    searchHand2() {
      this.pageNum = 1;
      var that = this
      this.$http.post(
          this.GLOBAL.serverSrc + "/org/api/userpage", {
            "pageIndex": this.pageNum,
            "pageSize": this.pageSize,
            "total": 0,
            "object": {
              "isDeleted": 0,
              "value": '',
              "type": 3,
              "user": '',
              "input": this.apply_user_input,
            },
          }, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        )
        .then(function(obj) {
          that.total2 = obj.data.total;
          that.tableData3 = obj.data.objects;
          that.tableData3.forEach(function(v, k, arr) {
            arr[k]['org'] = '吉林大运通-财务部-会计'
            if (arr[k]['sex'] == 1) {
              arr[k]['sex'] = '男'
            } else {
              arr[k]['sex'] = '女'
            }
            if (arr[k]['userState'] == 0) {
              arr[k]['status'] = '未选择'
            } else if (arr[k]['userState'] == 1) {
              arr[k]['status'] = '等待审核'
            } else if (arr[k]['userState'] == 2) {
              arr[k]['status'] = '正常'
            } else {
              arr[k]['status'] = '停用'
            }
          })
        })
        .catch(function(obj) {
          console.log(obj)
        })
    },
    handleSizeChange2(val) {
      this.pagesize2 = val
      var that = this
      this.$http.post(
          this.GLOBAL.serverSrc + "/org/api/userpage", {
            "pageIndex": this.pageNum,
            "pageSize": this.pageSize,
            "total": 0,
            "object": {
              "isDeleted": 0,
              "value": '',
              "type": 3,
              "user": '',
              "input": this.apply_user_input,
            },
          }, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        )
        .then(function(obj) {
          that.total2 = obj.data.total;
          that.tableData3 = obj.data.objects;
          that.tableData3.forEach(function(v, k, arr) {
            arr[k]['org'] = '吉林大运通-财务部-会计'
            if (arr[k]['sex'] == 1) {
              arr[k]['sex'] = '男'
            } else {
              arr[k]['sex'] = '女'
            }
            if (arr[k]['userState'] == 0) {
              arr[k]['status'] = '未选择'
            } else if (arr[k]['userState'] == 1) {
              arr[k]['status'] = '等待审核'
            } else if (arr[k]['userState'] == 2) {
              arr[k]['status'] = '正常'
            } else {
              arr[k]['status'] = '停用'
            }
          })
        })
        .catch(function(obj) {
          console.log(obj)
        })
    },
    handleCurrentChange2(val) {
      this.pageNum = val;
      var that = this
      this.$http.post(
          this.GLOBAL.serverSrc + "/org/api/userpage", {
            "pageIndex": this.pageNum,
            "pageSize": this.pageSize,
            "total": 0,
            "object": {
              "isDeleted": 0,
              "value": '',
              "type": 3,
              "user": '',
              "input": this.apply_user_input,
            },
          }, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        )
        .then(function(obj) {
          that.total2 = obj.data.total;
          that.tableData3 = obj.data.objects;
          that.tableData3.forEach(function(v, k, arr) {
            arr[k]['org'] = '吉林大运通-财务部-会计'
            if (arr[k]['sex'] == 1) {
              arr[k]['sex'] = '男'
            } else {
              arr[k]['sex'] = '女'
            }
            if (arr[k]['userState'] == 0) {
              arr[k]['status'] = '未选择'
            } else if (arr[k]['userState'] == 1) {
              arr[k]['status'] = '等待审核'
            } else if (arr[k]['userState'] == 2) {
              arr[k]['status'] = '正常'
            } else {
              arr[k]['status'] = '停用'
            }
          })
        })
        .catch(function(obj) {
          console.log(obj)
        })
    },
    formatDate1(dates){
       var dateee = new Date(dates).toJSON();
       var date = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
       return date;
    },
    resetHand(){
      this.planID='';
      this.user='';
      this.startTime='';
      this.endTime='';
    },
    searchHand(pageNum,pageSize) {
      this.pageNum = pageNum;
      this.pageSize = pageSize;
      this.pageshow1 = false;
      let objectRequest = {};
      objectRequest.paymentType = 2;
      objectRequest.checkType = 0;
      if (this.startTime) { objectRequest.beginTime = this.startTime}
      if (this.endTime) { objectRequest.endTime = this.endTime}
      var that = this
      this.$http.post(
          this.GLOBAL.serverSrc + "/finance/payment/api/page", {
            "pageIndex": pageNum,
            "pageSize":  pageSize,
            "object": objectRequest,
          }
        )
        .then(function(obj) {
          that.total = obj.data.total;
          that.tableData = obj.data.objects;
          that.$emit('headCallBack', obj.data.total);
        })
        .catch(function(obj) {
          console.log(obj)
        })
        this.$nextTick(() => {
             this.pageshow1 = true
        })
  },
  //工作流获取代办
  gettingUnfinished(){
     this.$http.post(this.GLOBAL.jqUrl + "/JQ/GettingUnfinishedTasksForJQ",{
            "userCode": "rbop01",
            "startTime": this.startTime?this.startTime:"1970-07-23T01:30:54.452Z",
            "endTime": this.endTime?this.endTime:new Date(),
            "startIndex": 1,  //页码
            "endIndex": 1   //每页条数
          }
      )
      .then(obj=>{
        //this.total = obj.data.total;
        //this.tableData = obj.data.objects;
      })
      .catch(function(obj) {
        console.log(obj)
      })
   }
  },
  created(){
   //this.searchHand(1,this.pageSize);
   this.gettingUnfinished();

  },
}
</script>

<style lang="scss" scoped>
  .distributor-content {
    width: 99%;
    margin: 25px auto;
    height: auto;
    border: 1px solid #e6e6e6;
    #form-content {
      background: #f7f7f7;
      padding: 40px 10px 20px 10px;
      margin: 8px 10px 20px 10px;
      .line{
        text-align: center;
      }
      .status-length{
        width: 100% !important;
      }
    }
    .add-style{
      margin-left: 1%;
      margin-top: 30px;
    }
    #table-content{
      width: 98%;
      margin: 10px auto 10px;
    }
    .paging{
      margin:20px 0 10px 0;
    }
    .title-margin{
      margin-bottom: 30px;
    }
    .title-margin-t{
      margin-top: 45px;
    }
    .el-divider__text{
      font-size: 17px !important
    }
  }

</style>
