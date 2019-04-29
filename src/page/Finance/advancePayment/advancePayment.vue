<template>
  <div class="vivo" style="position:relative">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="付款" name="first">
        <span class="search-title">团期计划:</span>
        <el-input v-model="groupNo" class="input"></el-input>
        <span class="search-title">申请人:</span>
        <el-input v-model="user" class="input"></el-input>
        <el-date-picker v-model="startTime" type="date" placeholder="开始日期" class="start-time"></el-date-picker>
        <div class="date-line"></div>
        <el-date-picker v-model="endTime" type="date" placeholder="终止日期" class="start-time"></el-date-picker>
        <div style="border: 0px solid #e9eaea;  margin-bottom:100px; margin-top: 30px; margin-left: 20px; width: 100%">
          <div class="button_select">
            <el-button type="primary" @click="searchHand()" size="medium">搜索</el-button>
            <el-button type="primary" @click="resetHand()" size="medium">重置</el-button>
          </div>
          <div class="button_select">
            <el-button type="primary" @click="dialogchange" plain>申请预付款</el-button>
            <el-button type="primary" @click=dialogFind plain :disabled="reable">查看借款</el-button>
          </div>
          <div class="table_trip" style="width: 90%;">
            <el-table :data="tableData" border style="width: 100%" :highlight-current-row="true" @row-click="clickBanle" :header-cell-style="getRowClass">
              <el-table-column prop="id" label="付款单号" align="center" width="80%">
              </el-table-column>
              <el-table-column prop="status" label="状态" width="100%" align="center">
              </el-table-column>
              <el-table-column prop="time" label="发起时间" align="center" width="120%">
              </el-table-column>
              <el-table-column prop="tour_plan" label="团期计划" align="center">
              </el-table-column>
              <el-table-column prop="supplier" label="供应商名称" align="center">
              </el-table-column>
              <el-table-column prop="type" label="类型" align="center" width="110%">
              </el-table-column>
              <el-table-column cell-style prop="money" label="金额" align="center" width="110%">
              </el-table-column>
              <el-table-column prop="org" label="申请组织" align="center" width="120%">
              </el-table-column>
              <el-table-column prop="user" label="申请人" align="center" width="120%">
              </el-table-column>
              <el-table-column prop="opinion" label="审批意见" align="center" width="120%">
              </el-table-column>
            </el-table>
          </div>
          <!--分页-->
          <div class="block" style="margin-top: 30px;text-align:center;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage4" :page-sizes="[5, 10, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total=total>
            </el-pagination>
          </div>
          <!--分页-->
        </div>
      </el-tab-pane>
      <el-tab-pane label="需要您审批" name="second">
        <NeedApproval></NeedApproval>
      </el-tab-pane>
    </el-tabs>
    <!--申请预付款-->
    <el-dialog title="申请预付款" :visible.sync="dialogFormVisible" width=60% :show-close="false">
      <div v-if="this.find == 1" class="sh_style">审核中</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <div class="btn" style="width:200px;position:absolute;z-index:9;top:20px;right:1%;">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button v-if="this.find == 0" type="primary" @click="submitForm('ruleForm')">确 定</el-button>
          <el-button v-if="this.find == 1" type="danger" @click="chanelSubmit('ruleForm')" plain>撤销申请</el-button>
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
                <el-input v-model="ruleForm.tour" @blur="tour_check" class="productName" placeholder="请输入或者选择团期计划"></el-input>
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
                <el-button class="input-new-tag2" size="small" :disabled="change" @click="showInput5">选择</el-button>
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
    <!--预付款弹窗end-->
    <!--验证提示弹窗-->
    <el-dialog title="提示信息" :visible.sync="dialogVadi" class="city_list tips" width="400px">
      <div>
        <ul v-for="item in validaError">
          <li>{{item}}</li>
        </ul>
      </div>
    </el-dialog>
    <el-dialog style="text-align: left" title="选择申请人:" :visible.sync="dialogVisible" width="50%">
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
              <el-table-column prop="mobile" label="手机号" align="center" width="120%">
              </el-table-column>
              <el-table-column prop="org" label="组织" align="center">
              </el-table-column>
              <el-table-column prop="sex" label="性别" align="center">
              </el-table-column>
              <el-table-column prop="status" label="状态" align="center" width="110%">
              </el-table-column>
              </el-table-column>
            </el-table>
          </div>
          <!--分页-->
          <div class="block" style="margin-top: 30px;text-align:center;">
            <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page.sync="currentPage2" :page-sizes="[5, 10, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total=total>
            </el-pagination>
          </div>
          <!--分页-->
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="routerHandle2()">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog style="text-align: left" title="选择团期:" :visible.sync="dialogVisible2" width="70%">
      <div style="text-align: center">
        <div style="width: 100%">
          <div class="button_select" style="margin-bottom: 30px;margin-top: -30px;">
            <span class="search-title" >团期计划ID</span>
            <el-input placeholder="团期计划ID" v-model="tour_id" class="group-no" style="width:20%"></el-input>
            <span class="search-title" >产品名称</span>
            <el-input placeholder="产品名称" v-model="product_name" class="group-no" style="width:20%"></el-input>
            <el-date-picker v-model="startTime" type="date" placeholder="开始日期" class="start-time"></el-date-picker>
            <el-date-picker v-model="endTime" type="date" placeholder="终止日期"></el-date-picker>
            <el-button type="primary" icon="el-icon-search" class="search" @click="searchHand4()"></el-button>
          </div>
          <div class="table_trip" style=" width: 100%;">
            <el-table :data="tableData4" border style="width: 100%" :highlight-current-row="true" @row-click="clickBanle4" :header-cell-style="getRowClass4">
              <el-table-column prop="groupCode" label="团号"></el-table-column>
              <el-table-column prop="title" label="产品名称"></el-table-column>
              <!--缺个目的地,用下面暂时代替-->
              <el-table-column prop="refPrice" label="目的地"></el-table-column>
              <el-table-column prop="dateFormat" label="出行日期"></el-table-column>
              <!--缺个部门,用下面暂时代替-->
              <el-table-column prop="count" label="部门"></el-table-column>
              <el-table-column prop="op" label="操作"></el-table-column>
            </el-table>
          </div>
          <!--分页-->
          <div class="block" style="margin-top: 30px;text-align:center;">
            <el-pagination @size-change="handleSizeChange4" @current-change="handleCurrentChange4" :current-page.sync="currentPage4" :page-sizes="[5, 10, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total=total>
            </el-pagination>
          </div>
          <!--分页-->
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="routerHandle4()">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog style="text-align: left" title="选择账户:" :visible.sync="dialogVisible3" width="70%">
      <el-tabs v-model="activeName2" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="供应商" name="three">
          <el-table :data="tableData9" border style="width: 100%" :highlight-current-row="true" :header-cell-style="getRowClass4">
            <el-table-column prop="account" label="账户"></el-table-column>
            <el-table-column prop="bank" label="开户行"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="个人" name="four">
          <el-table :data="tableData9" border style="width: 100%" :highlight-current-row="true" :header-cell-style="getRowClass4">
            <el-table-column prop="account" label="账户"></el-table-column>
            <el-table-column prop="bank" label="开户行"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible3 = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible3 = false">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog style="text-align: left" title="放大图片:" :visible.sync="dialogVisible4" width="50%">
      <el-button type="primary" @click="downs()" style="margin-bottom: 30px;">点击下载</el-button>
      <div>
        <img :src="imgBig" alt="图片" :alt="imgBigName"/>
        <span>{{imgBigName}}</span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import NeedApproval from '@/page/Finance/advancePayment/needApproval'
export default {
  name: "advancePayment",
  components: {
    NeedApproval
  },
  data() {
    return {
      activeName: 'first',
      activeName2: 'three',
      //付款搜索
      groupNo: '',
      user: '',
      startTime: '',
      endTime: '',
      pageIndex: 1, // 设定当前页数
      pageSize: 10, // 设定默认分页每页显示数 todo 具体看需求
      total: 0,
      total2: 0,
      pageIndex2: 1, // 设定当前页数
      currentPage4: 1,
      currentPage2: 1,
      arr: [],
      reable: true,
      pid: 0,
      reable2: true,
      pid2: 0,
      firstIndex: 1,
      secondIndex: 1,
      firstTab: true,
      secondTab: false,
      approvalTotal: 0,
      tableData: [],
      tableData2: [],
      tableData3: [],
      tableData4: [{
          id: 1,
          status: 1,
          time: '2016-05-03',
          tour_plan: '泰国曼谷+芭提雅+沙美岛+清迈小镇7日游',
          supplier: '我是供应商',
          type: '地接',
          money: '20',
          surplus: '20',
          org: '国内部',
          user: 'tester申请人',
          opinion: '统一',
        },
        {
          id: 2,
          status: 2,
          time: '2018-05-03',
          tour_plan: '泰国曼谷+芭提雅+沙美岛+清迈小镇7日游',
          supplier: '我是供应商',
          type: '地接',
          money: '20',
          surplus: '20',
          org: '国内部',
          user: 'tester申请人',
          opinion: '统一',
        }
      ],
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
        cancellationMoney: '已核销金额',
      }],
      tableData7: [{
        id: '1',
        status: '状态',
        type: '类型',
        supplier: '供应商',
        price: '付款金额',
        org: '部门',
        user: '申请人',
        createTime: '申请日期',
        abstract: '摘要',
        cancellationMoney: '已核销金额',
      }, {
        id: '2',
        status: '状态',
        type: '类型',
        supplier: '供应商',
        price: '付款金额',
        org: '部门',
        user: '申请人',
        createTime: '申请日期',
        abstract: '摘要',
        cancellationMoney: '已核销金额',
      }, {
        id: '3',
        status: '状态',
        type: '类型',
        supplier: '供应商',
        price: '付款金额',
        org: '部门',
        user: '申请人',
        createTime: '申请日期',
        abstract: '摘要',
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
      tableData9: [{
        account: '账户',
        bank: '开户行',
        name: '名称',
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
      supplier: '',
      supplierList: [{
        value: '选项1',
        label: '辽宁大运通'
      }, {
        value: '选项2',
        label: '辽宁康辉'
      }],
      type: '',
      typeList: [],
      payMode: '',
      payModeList: [],
      ruleForm: {
        loanMoney: '',
        loanNumber: '',
        user: '',
        productName: '',
        tour: '',
        supplier: '',
        abstract: '',
        account: '',
        bank: '',
        bankName: '',
        payMode: '',
      }, //文件上传列表
      fileList: [{
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
      rules: {
        type: [{ required: true, message: '类型不能为空', trigger: 'change' }],
        loanMoney: [{ required: true, message: '借款金额不能为空', trigger: 'blur' }],
        loanNumber: [{ required: true, message: '借款数量不能为空', trigger: 'blur' },
          { pattern: /^[+]{0,1}(\d+)$/, message: '借款数量需为正整数' }
        ],
        tour: [{ required: true, message: '团期计划不能为空', trigger: 'change' }],
        supplier: [{ required: true, message: '供应商不能为空', trigger: 'blur' }],
        productName: [{ required: true, message: '产品名称不能为空', trigger: 'change' }],
        user: [{ required: true, message: '申请人不能为空', trigger: 'change' }],
        abstract: [{ required: true, message: '摘要不能为空', trigger: 'blur' }],
        account: [{ required: true, message: '账户不能为空', trigger: 'blur' }],
        bank: [{ required: true, message: '开户行不能为空', trigger: 'blur' }],
        bankName: [{ required: true, message: '开户名不能为空', trigger: 'blur' }],
        payMode: [{ required: true, message: '付款方式不能为空', trigger: 'change' }],
      },
      activeName: 'first',
      inputVisible3: false,
      dynamicTags2: [],
      noNull: '',
      validaError: '',
      empty: '',
      dialogVadi: false,
      supplierLength: true,
      inputVisible3: false,
      inputVisible2: false,
      dialogVisible3: false,
      dialogVisible4: false,
      dialogVisible5: false,
      dialogVisible6: false,
      dialogVisible2: false,
      dialogFormVisible: false,
      dialogVisible: false,
      apply_user_input: '',
      tour_id: '',
      tour_id_pre: '',
      product_name_pre: '',
      product_name: '',
      change: false,
      find: 0,
      dynamicTags3: [],
      imgBig: '',
      imgBigName: '',
    }
  },
  computed: {
    // 计算属性的 getter
    approval: function() {
      // `this` 指向 vm 实例
      return this.approvalTotal > 0 ? '您需要审批(' + this.approvalTotal + ')' : '您需要审批'
    },
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
    getRowClass2({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
    routerHandle2() { //申请人添加
      this.dynamicTags3.push({ "podID": this.user_id, "pod": this.user_name });
      this.ruleForm.user = '1';
      this.dialogVisible = false
      this.$refs.ruleForm.validateField('user')
    },
    handleClose3(tag3) {
      this.dynamicTags3.splice(this.dynamicTags3.indexOf(tag3), 1);
      if (this.dynamicTags3.length <= 0) {
        this.ruleForm.user = ''
      }
      this.$refs.ruleForm.validateField('user')
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
    handlePreview(file, fileList) {
      this.dialogVisible4 = true
      this.imgBig = file.url
      this.imgBigName = file.name
    },
    downloadIamge(imgsrc, name) { //下载图片地址和图片名
      var image = new Image();
      // 解决跨域 Canvas 污染问题
      image.setAttribute("crossOrigin", "anonymous");
      image.onload = function() {
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据

        var a = document.createElement("a"); // 生成一个a元素
        var event = new MouseEvent("click"); // 创建一个单击事件
        a.download = name || "photo"; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
      };
      image.src = imgsrc;
    },
    downs() {
      this.downloadIamge(this.imgBig, this.imgBigName)
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
    //搜索
    searchHand() {
      this.pageNum = 1;

      if (!this.productBehind) {
        this.productBehind = 0
      } else {
        this.pageNum = 1;
      }
      var that = this
      this.$http.post(
          this.GLOBAL.serverSrc + "/team/api/teamsearch", {
            "pageIndex": this.pageNum,
            "pageSize": this.pageSize,
            "total": 0,
            "object": {
              "id": 0,
              "title": '',
              "createUser": '',
              "minPrice": 0,
              "maxPrice": 0,
              "podID": 0,
              "destinationID": 0
            }
          }, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        )
        .then(function(obj) {
          that.total = obj.data.total;
          that.tableData = obj.data.objects;
          that.tableData.forEach(function(v, k, arr) {
            arr[k]['status'] = "状态"
            arr[k]['time'] = '2016-05-03'
            arr[k]['tour_plan'] = '团期计划'
            arr[k]['supplier'] = '供应商'
            arr[k]['type'] = "类型:比如地接"
            arr[k]['money'] = "金额"
            arr[k]['org'] = '国内部'
            arr[k]['user'] = 'tester申请人'
            arr[k]['opinion'] = '同意'
          })
        })
        .catch(function(obj) {
          console.log(obj)
        })

    },
    handleCurrentChange(val) {
      this.pageNum = val;
      if (this.firstTab) {
        this.firstIndex = val
      }
      if (this.secondTab) {
        this.secondIndex = val
      }
      var that = this
      this.$http.post(
          this.GLOBAL.serverSrc + "/team/api/teamsearch", {
            "pageIndex": val,
            "pageSize": this.pageSize,
            "total": 0,
            "object": {
              "id": 0,
              "title": '',
              "createUser": '',
              "minPrice": 0,
              "maxPrice": 0,
              "podID": 0,
              "destinationID": 0
            }
          }, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        )
        .then(function(obj) {
          that.total = obj.data.total;
          that.tableData = obj.data.objects;
          that.tableData.forEach(function(v, k, arr) {
            arr[k]['status'] = "状态"
            arr[k]['time'] = '2016-05-03'
            arr[k]['tour_plan'] = '团期计划'
            arr[k]['supplier'] = '供应商'
            arr[k]['type'] = "类型:比如地接"
            arr[k]['money'] = "金额"
            arr[k]['org'] = '国内部'
            arr[k]['user'] = 'tester申请人'
            arr[k]['opinion'] = '同意'
          })
        })
        .catch(function(obj) {
          console.log(obj)
        })
    },
    handleSizeChange(val) {
      this.pagesize = val
      var that = this
      this.$http.post(
          this.GLOBAL.serverSrc + "/team/api/teamsearch", {
            "pageIndex": 1,
            "pageSize": val,
            "total": 0,
            "object": {
              "id": 0,
              "title": '',
              "createUser": '',
              "minPrice": 0,
              "maxPrice": 0,
              "podID": 0,
              "destinationID": 0
            }
          }, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        )
        .then(function(obj) {
          console.log(obj.data);
          that.total = obj.data.total;
          that.tableData = obj.data.objects;
          that.tableData.forEach(function(v, k, arr) {
            arr[k]['status'] = "状态"
            arr[k]['time'] = '2016-05-03'
            arr[k]['tour_plan'] = '团期计划'
            arr[k]['supplier'] = '供应商'
            arr[k]['type'] = "类型:比如地接"
            arr[k]['money'] = "金额"
            arr[k]['org'] = '国内部'
            arr[k]['user'] = 'tester申请人'
            arr[k]['opinion'] = '同意'
          })
        })
        .catch(function(obj) {
          console.log(obj)
        })
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
          that.total = obj.data.total;
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
          that.total = obj.data.total;
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
          that.total = obj.data.total;
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
    handDb() {
      this.$router.push({
        path: 'advanceApply',
        query: {}
      })
    },
    handDb2() {
      this.$router.push({
        path: '/changepro',
        query: {
          id: this.pid2
        }
      })
    },
    resetHand() {
      this.groupNo = ''
      this.user = ''
      this.startTime = ''
      this.endTime = ''
    },
    //获取id
    clickBanle(row, event, column) {
      this.pid = row['id'];
      this.reable = false;

    },
    handleClick(tab, event) {
      if (tab.name == 'first') {
        this.firstTab = true
        this.secondTab = false
        this.pageIndex = this.firstIndex;
        this.currentPage4 = this.firstIndex;
      }
      if (tab.name == 'second') {
        this.firstTab = false
        this.secondTab = true
        this.pageIndex = this.secondIndex;
        this.currentPage4 = this.secondIndex;
      }
    },
    routerHandle4() { //团期计划
      this.ruleForm.tour = this.tour_id_pre
      this.ruleForm.productName = this.product_name_pre
      this.dialogVisible2 = false
    },
    // 表格头部背景颜色
    getRowClass4({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
    //获取id
    clickBanle2(row, event, column) {
      this.user_id = row['id'];
      this.user_name = row['name'];
      this.reable = false;

    },
    //获取id
    clickBanle4(row, event, column) {
      this.tour_id_pre = row['groupCode'];
      this.product_name_pre = row['title'];
      this.reable = false;
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
    searchHand4() {
      this.pageNum = 1;
      this.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/page', {
        "pageIndex": this.pageIndex,
        "pageSize": this.pageSize,
        "object": {
          "title": "斯里兰卡",
        }
      }).then(res => {
        if (res.data.isSuccess == true) {
          this.tableData4 = res.data.objects;
          this.total = res.data.total;
        }
      }).catch(err => {
        console.log(err)
      })

    },
    handleCurrentChange4(val) {
      this.pageNum = val;
      this.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/page', {
        "pageIndex": this.pageNum,
        "pageSize": this.pageSize,
        "object": {
          "title": "斯里兰卡",
        }
      }).then(res => {
        if (res.data.isSuccess == true) {
          this.tableData4 = res.data.objects;
          this.total = res.data.total;
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleSizeChange4(val) {
      this.pageSize = val
      this.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/page', {
        "pageIndex": 1,
        "pageSize": this.pageSize,
        "object": {
          "title": "斯里兰卡",
        }
      }).then(res => {
        if (res.data.isSuccess == true) {
          this.tableData4 = res.data.objects;
          this.total = res.data.total;
        }
      }).catch(err => {
        console.log(err)
      })
    },
    showInput5() {
      this.dialogVisible3 = true;
    },
    showInput4() {
      this.dialogVisible2 = true;
    },
    showInput3() {
      this.dialogVisible = true
    },
    // 供应商
    dest_01(item) {
      this.ruleForm.supplier = item.value;
      this.inputVisible2 = false;
    },
    handleInputConfirm2() {
      if (this.ruleForm.supplier !== '') {
        setTimeout(res => {
          let inputVal4 = this.ruleForm.supplier;
          if (inputVal4) {
            this.dynamicTags2.push({ "labelID": 0, "label": inputVal4, "teamID": 0 });
            this.ruleForm.supplier = inputVal4;
          }
          this.inputVisible2 = false;
          this.empty = false;
        }, 200)
        this.supplierLength = false;
      } else {
        if (this.dynamicTags2.length == 0) {
          this.empty = true;
          document.getElementById('input-error').style.border = "solid 1px red";
        } else {
          this.inputVisible2 = false;
        }
      }
      this.$refs.ruleForm.validateField('supplier')
    },
    handleClose2(tag2) {
      this.dynamicTags2.splice(this.dynamicTags2.indexOf(tag2), 1);
      this.supplierLength = true
      if (this.dynamicTags2.length < 1) {
        this.ruleForm.supplier = ''
      }
      this.$refs.ruleForm.validateField('supplier')
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
    querySearch5(queryString5, cb) {
      this.tableData2 = []
      this.$http.post(this.GLOBAL.serverSrc + '/universal/supplier/api/supplierlist', {
        "object": {
          supplier: queryString5
        }
      }).then(res => {
        for (let i = 0; i < res.data.objects.length; i++) {
          this.tableData2.push({
            "value": res.data.objects[i].leader,
            "id": res.data.objects[i].id
          })
        }
        var results = queryString5 ? this.tableData2.filter(this.createFilter(queryString5)) : [];
        cb(results)
      }).catch(err => {
        console.log(err);
      })
    },
    //获取供应商类型
    querySearch6() {
      this.typeList = []
      this.$http.post(this.GLOBAL.serverSrc + '/universal/suppliertype/api/get', {
        "object": {
          id: 1
        }
      }).then(res => {
        for (let i = 0; i < res.data.objects.length; i++) {
          this.typeList.push({
            "value": res.data.objects[i].id,
            "label": res.data.objects[i].name
          })
        }
      }).catch(err => {
        console.log(err);
      })
    },
    //付款方式
    querySearch7() {
      this.payModeList = []
      this.$http.post(this.GLOBAL.serverSrc + '/finance/payway/api/get', {
        "object": {
          id: 1,
        }
      }).then(res => {
        for (let i = 0; i < res.data.objects.length; i++) {
          this.payModeList.push({
            "value": res.data.objects[i].id,
            "label": res.data.objects[i].name
          })
        }
      }).catch(err => {
        console.log(err);
      })
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
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
        this.dialogFormVisible = false
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消撤销'
        });
      });
    },
  },
  created() {
    var that = this
    this.$http.post(
        this.GLOBAL.serverSrc + "/team/api/teamsearch", {
          "pageIndex": 1,
          "pageSize": this.pageSize,
          "total": 0,
          "object": {
            "id": 0,
            "title": '',
            "createUser": '',
            "minPrice": 0,
            "maxPrice": 0,
            "podID": 0,
            "destinationID": 0
          }
        }, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }
      )
      .then(function(obj) {
        that.total = obj.data.total;
        that.tableData = obj.data.objects;
        that.tableData.forEach(function(v, k, arr) {
          arr[k]['status'] = "状态"
          arr[k]['time'] = '2016-05-03'
          arr[k]['tour_plan'] = '团期计划'
          arr[k]['supplier'] = '供应商'
          arr[k]['type'] = "类型:比如地接"
          arr[k]['money'] = "金额"
          arr[k]['org'] = '国内部'
          arr[k]['user'] = 'tester申请人'
          arr[k]['opinion'] = '同意'
        })
      })
      .catch(function(obj) {
        console.log(obj)
      })
    this.querySearch6()
    this.querySearch7()
  },
};

</script>
<style lang="scss" scoped>
.el-tabs__nav>>>.el-tabs__item {
  font-size: 30px !important;
}

#tab-first {
  font-size: 30px
}

.el-table th {
  background-color: red;
}

.demo-input-suffix {
  width: 900px
}

.el-input {
  width: auto
}

.group-no {
  margin-left: 10px
}

.start-time {
  margin-left: 25px
}

.date-line {
  width: 10px;
  border-bottom: 1px solid #e6e6e6;
  display: inline-block;
  margin: 0 3px 3px 0
}

.search-title {
  font-size: 14px;
  margin-left: 20px;
  margin-top: 10px;
}

.el-input__inner {
  width: 10%;
}

.button_select {
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: left;
  //margin-left: 50px;

  .select_button {
    padding-top: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e9eaea;
    text-align: left;
    padding-left: 50px;
  }
}

.el-autocomplete>>>.el-input--small .el-input__inner {
  height: 35px !important;
}

.input-new-tags {
  width: 200px;
  float: left;
  margin-left: 5px;
  height: 30px;
  line-height: 30px;
  padding-top: 1px;
  margin-top: 1px;
  margin-bottom: 4px;
  padding-bottom: 2px
}

.bright_b {
  float: left;
  margin-left: 205px;
  margin-top: -62px;
}

.sh_style {
  background: #eaeaea;
  position: absolute;
  width: 50px;
  height: 23px;
  text-align: center;
  line-height: 26px;
  top: 20px;
  left: 116px;
}

</style>
