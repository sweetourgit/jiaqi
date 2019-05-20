<template>
    <div class="all">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!--报销-->
        <el-tab-pane label="报销" name="first">
          <div class="borders">
            <div>
              <div class="search">
                <span class="search_style">报销单号：</span> <el-input v-model="number" placeholder="请输入内容" class="search_input"></el-input>
                <span class="search_style">团期计划：</span> <el-input v-model="plan" placeholder="请输入内容" class="search_input"></el-input>
                <span class="search_style">申请人：</span> <el-input v-model="accepter" placeholder="请输入内容" class="search_input"></el-input>
                <span class="search_style">发起时间：</span> <el-input v-model="createtime1" placeholder="请输入内容" style="float: left; width: 100px"></el-input>
                <span class="search__">—</span> <el-input v-model="createtime2" placeholder="请输入内容" style="float: left; width: 100px"></el-input>
              </div>
              <div class="reform">
                <el-button type="primary">重置</el-button>
              </div>
              <div class="reform">
                <el-button type="primary" plain @click="dialogchange">申请报销</el-button>
                <el-button type="primary" @click="dialogFind" plain>查看</el-button>
              </div>
            </div>
            <div class="table_style">
              <el-table
                :data="tableData"
                border
                style="width: 100%;">
                <el-table-column
                  prop="expenseID"
                  label="报销单号"
                  width="180"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="checkTypeEX"
                  label="状态"
                  width="180"
                  align="center">
                  <template slot-scope="scope">

                    <div v-if="scope.row.checkTypeEX=='审批中'" style="color: #7F7F7F" >{{scope.row.checkTypeEX}}</div>
                    <div v-if="scope.row.checkTypeEX=='驳回'" style="color: #FF4A3D" >{{scope.row.checkTypeEX}}</div>
                    <div v-if="scope.row.checkTypeEX=='通过'" style="color: #33D174" >{{scope.row.checkTypeEX}}</div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="createTime"
                  label="发起时间"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="groupCode"
                  label="团期计划"
                  width="250"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="price"
                  label="报销金额"
                  width="180"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="orgName"
                  label="申请组织"
                  width="180"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="createUser"
                  label="申请人"
                  width="150"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="info"
                  label="驳回信息"
                  width="180"
                  align="center">
                </el-table-column>
              </el-table>
            </div>
            <div class="block">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage4"
                :page-sizes="[10, 20, 50, 100]"
                :page-size= pageSize
                layout="total, sizes, prev, pager, next, jumper"
                :total=pageCount
                background>
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <!--报销end-->
        <!--报销弹窗-->
          <el-dialog title="报销申请"  :visible.sync="dialogFormVisible" width=70% :show-close="false">

            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

              <el-form-item label="报销人" prop="name">
                <div class="reimbursementer">
                  <div style="margin-left: 5px;float: left"
                       v-for="(val, index) in ruleForm.name"
                  >
                    <el-tag type="info">{{val.tt}}</el-tag>
                    <el-tag type="info">{{val.peo}}</el-tag>

                  </div>
                </div>
                <el-button type="info"  v-if="this.find==0" @click="adddialog">选择</el-button>
              </el-form-item>
              <!--多报销-->
              <div>
                <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit" style="border: 1px solid #E4E7ED">
                  <el-tab-pane
                    :key="item.name"
                    v-for="(item, index) in editableTabs"
                    :label="item.title"
                    :name="item.name"
                  >
                    <el-form-item label="团期计划" prop="plan">
                      <el-input v-model="ruleForm.plan.planId" placeholder="请输入或者选择团期计划" style="width: 240px;"  :disabled="change"></el-input>
                      <el-input v-model="ruleForm.plan.planName" placeholder="请输入或者选择团期计划" style="width: 240px;"   :disabled="change"></el-input>
                      <el-button  size="mini" @click="planDialog"  v-if="find==0">选择</el-button>
                    </el-form-item>
                    <el-form-item label="报销金额" prop="monkey">
                      <el-input v-model="ruleForm.monkey.type" placeholder="请输入或者选择报销类型" style="width: 240px;" :disabled="change"></el-input>
                      <el-input v-model="ruleForm.monkey.count" placeholder="请输入或者选择报销金额" style="width: 240px;" :disabled="change"></el-input>
                    </el-form-item>
                    <el-form-item label="摘要" prop="content">
                      <el-input v-model="ruleForm.content" placeholder="请输入或者选择报销类型" style="width: 480px;" :disabled="change" ></el-input>
                    </el-form-item>
                    <el-form-item label="附件" >
                      <el-upload
                        class="upload-demo"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :on-change="handleChange"
                        :file-list="fileList">
                        <el-button size="small" type="primary" v-if="find==0">点击上传</el-button>
                      </el-upload>
                    </el-form-item>
                    <div class="re_style">
                      <el-radio v-model="radio" label="1">关联单据</el-radio>
                      <el-radio v-model="radio" label="2">手添报销单据</el-radio>
                    </div>
                    <div v-if="radio==1">
                      <div class="re_style" style="margin-top: 20px">
                        <el-button @click="addbx" v-if="find==0">增加</el-button>
                        <el-button @click="addbx" v-if="find==0">修改</el-button>
                        <el-button type="danger" v-if="find==0">删除</el-button>
                      </div>
                      <div class="re_style">
                      <el-table
                        :data="joinData"
                        border
                        style="width: 100%; margin-top: 30px">
                        <el-table-column
                          prop="id"
                          label="关联单号"
                          width="80"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="paymentType"
                          label="类型"
                          width="90"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="supplierType"
                          label="供应商"
                          width="100"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="bm"
                          label="部门"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="createUser"
                          label="申请人"
                          width="80"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="createTime"
                          label="发起日期">
                        </el-table-column>
                        <el-table-column
                          prop="mark"
                          label="摘要">
                        </el-table-column>
                        <el-table-column
                          prop="price"
                          label="金额">
                        </el-table-column>
                        <el-table-column
                          prop="wcount"
                          label="未报销金额">
                        </el-table-column>
                        <el-table-column
                          prop="bcount"
                          label="报销金额">
                        </el-table-column>
                        <el-table-column
                          prop="peopleCount"
                          label="人数">
                        </el-table-column>
                      </el-table>
                      </div>
                      <div class="re_style" style="margin-top: 30px; margin-bottom: 30px">报销金额：100.00</div>
                    </div>
                    <div v-if="radio==2">
                      <div class="re_style" style="margin-top: 20px" >
                        <el-input  :disabled="change" v-model="ruleForm.monkey.type" placeholder="请输入或者选择报销类型" style="width: 240px;" ></el-input>
                        <el-input  :disabled="change" v-model="ruleForm.monkey.count" placeholder="请输入或者选择报销金额" style="width: 240px;" ></el-input>
                        <el-button type="primary" @click="addDomain" v-if="find==0">添加</el-button>

                      </div>
                      <div v-for="(domain, index) in domains" class="re_style" style="margin-top: 20px" >
                        <el-input  :disabled="change" v-model="domain.type" placeholder="请输入或者选择报销类型" style="width: 240px;" ></el-input>
                        <el-input :disabled="change"  v-model="domain.money" placeholder="请输入或者选择报销金额" style="width: 240px;" ></el-input>
                        <el-button type="danger" @click="removeDomain(domain)" v-if="find==0" >删除</el-button>
                      </div>
                      <div class="re_style" style="margin-top: 30px; margin-bottom: 30px">报销金额：200.00</div>
                    </div>
                  </el-tab-pane>
                </el-tabs>

                <div class="re_style" style="margin-top: 20px">
                  <el-table
                    :data="reimData"
                    border
                    style="width: 100%">
                    <el-table-column
                      prop="reier"
                      label="审批人"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="reisult"
                      label="审批结果"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="info"
                      label="审批意见">
                    </el-table-column>
                    <el-table-column
                      prop="time"
                      label="审批时间">
                    </el-table-column>
                  </el-table>
                </div>
              </div>
              <!--多报销end-->
            </el-form>
              <div slot="footer" class="dialog-footer" style="position: absolute;top: 20px;right: 20px;">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button v-if="this.find == 0" type="primary"  @click="submitForm('ruleForm')">确 定</el-button>
                <el-button  v-if="this.find == 1"  type="danger" @click="chanelSubmit('ruleForm')" plain>撤销申请</el-button>
                <div v-if="this.find == 1" class="sh_style" >审核中</div>
              </div>
          </el-dialog>
        <!--报销弹窗end-->
        <!--报销人弹窗-->
        <el-dialog
          width="45%"
          title="选择报销的人"
          :visible.sync="dialogFormVisible1"
          append-to-body>
          <div class="indialog">
            <div class="indialog_search">
              <el-input v-model="number" placeholder="请输入内容" class="search_input"></el-input>
              <el-button type="primary" size="mini" round style="margin-top: 5px; margin-left: 10px">搜索</el-button>
            </div>
            <div style=" position: absolute;right: 22px;top: 75px;">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary"  @click="adduser">确 定</el-button>
            </div>
            <el-table
              :highlight-current-row="true"
              @row-click="clickBanle"
              :data="tableData1"
              border
              style="width: 100%; margin-top: 30px">
              <el-table-column
                prop="id"
                label="ID"
              >
              </el-table-column>
              <el-table-column
                prop="name"
                label="姓名"
             >
              </el-table-column>
              <el-table-column
                prop="mobile"
                label="手机号"
              >
              </el-table-column>
              <el-table-column
                prop="orgName"
                label="组织"
               >
              </el-table-column>
              <el-table-column
                prop="sexCN"
                label="性别"
              >
              </el-table-column>
              <el-table-column
                prop="userStateCN"
                label="状态">
              </el-table-column>
            </el-table>

            <el-pagination
              style="margin-top: 10px"
              :page-size="userSize"
              :pager-count="11"
              layout="prev, pager, next"
              @current-change="handleCurrentChange1"
              :total=userTotal>
            </el-pagination>
          </div>
        </el-dialog>
        <!--报销人弹窗end-->
        <!--团期计划弹窗-->
        <el-dialog
          width="60%"
          title="获取团期计划"
          :visible.sync="dialogFormVisible2"
          append-to-body
          :show-close = false>
          <div class="indialog">
            <div style=" position: absolute;right: 67px;top: 22px;">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary"  @click="addplan">确 定</el-button>
            </div>
            <div class="indialog_search">
              <span class="search_style">团期单号：</span> <el-input v-model="tour_name" placeholder="请输入内容" class="search_input"></el-input>
              <span class="search_style">产品名称：</span> <el-input v-model="product_name" placeholder="请输入内容" class="search_input"></el-input>
              <span class="search_style">出行日期：</span>
              <el-date-picker v-model="startTime2" type="date" placeholder="开始日期" style="float: left;width: 150px;"></el-date-picker>
              <el-date-picker v-model="endTime2" type="date" placeholder="终止日期" style="float: left;width: 150px;"></el-date-picker>
              <el-button type="primary" size="mini"  @click="searchHand4(1)" round style="margin-top: 5px; margin-left: 10px">搜索</el-button>
            </div>
            <el-table
              :data="planData"
              border
              :highlight-current-row="true"
              @row-click="planChange"
              style="width: 100%; margin-top: 30px">
              <el-table-column
                prop="groupCode"
                label="团期计划ID"
              >
              </el-table-column>
              <el-table-column
                prop="title"
                label="产品名称"
              >
              </el-table-column>
              <el-table-column
                prop="destination"
                label="目的地"
              >
              </el-table-column>
              <el-table-column
                prop="date"
                label="出行日期"
              >
              </el-table-column>
              <el-table-column
                prop="orgName"
                label="部门"
              >
              </el-table-column>
              <el-table-column
                prop="name"
                label="产品录入人">
              </el-table-column>
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
        <el-dialog
          width="60%"
          title="添加报销"
          :visible.sync="dialogFormVisible3"
          append-to-body>
          <el-table
            :data="joinData1"
            border
            style="width: 100%; margin-top: 30px">
            <el-table-column
              prop="id"
              label="关联单号"
              width="80"
            >
            </el-table-column>
            <el-table-column
              prop="type"
              label="类型"
              width="70"
            >
            </el-table-column>
            <el-table-column
              prop="gys"
              label="供应商"
              width="60"
            >
            </el-table-column>
            <el-table-column
              prop="bm"
              label="部门"
            >
            </el-table-column>
            <el-table-column
              prop="accpeter"
              label="申请人"
              width="80"
            >
            </el-table-column>
            <el-table-column
              prop="time"
              label="发起日期">
            </el-table-column>
            <el-table-column
              prop="content"
              label="摘要">
            </el-table-column>
            <el-table-column
              prop="count"
              label="金额"
              width="100">
            </el-table-column>
            <el-table-column
              prop="wcount"
              label="未报销金额">
            </el-table-column>
            <el-table-column
              prop="bcount"
              label="报销金额">
              <template slot-scope="scope">
                <el-input v-model="scope.row.bcount" style="width:100px;"></el-input>
              </template>
            </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer" >
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary"  @click="text('joinData1')">确 定</el-button>
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
  import NeedApproval from '@/page/Finance/reimburseManagement/needApproval'
  import { formatDate } from '@/js/libs/formatDate.js'
    export default {
        name: "reimburseManagement",
      components:{
        NeedApproval
      },
      data() {
          var areaIdRule = (rule, value, callback) => {
            console.log(this.ruleForm)
            if(this.ruleForm.plan.planId == '' || this.ruleForm.plan.planName == '') {
              return callback(new Error('团期计划不能为空'));
            } else {
              callback();

            }
          };
        var areaMonkeyRule = (rule, value, callback) => {
          console.log(this.ruleForm)
          if(this.ruleForm.monkey.type == '' || this.ruleForm.monkey.count == '') {
            return callback(new Error('报销金额不能为空'));
          } else {
            callback();

          }
        };

        return {
          plans:{
            planNum:'1',
            planName:'2',
            pid:''
            },
          planTotal:100,
          userSize:10,
          userTotal:100,
          startTime2:'',
          endTime2:'',
          //每页偏移量
          pageSize:10,
          pageCount:100,
          change:false,
          //分辨查看
          find:0,
          // 单选
          radio: '1',
          //团期计划弹窗
          dialogFormVisible2: false,
          //添加报销
          dialogFormVisible3: false,
          //报销表单弹窗
          dialogFormVisible: false,
          //报销人弹窗
          dialogFormVisible1:false,
          //团期计划搜索
          tour_name:'',
          product_name:'',
          planTime:'',
          planTime1:'',
          //手添报销
          domains: [{
            type: '地接',
            money: '9000.00'
          }],
          // 选中报销人字段
          people:{
            tt:'大运通-日本',
            peo:'qq'
          },
          //报销表单
          ruleForm: {
            name: [
            ],
            plan: {
              planId: '',
              planName: ''
            },
            monkey: {
              type: '小费',
              count: '1000.00'
            },
            content:''
          },
          //报销表单验证
          rules: {
            name: [
              { required: true, message: '请输入活动名称', trigger: 'blur' },
            ],
            plan: [
              { validator: areaIdRule, trigger: 'blur' }
            ],
            monkey: [
              { validator: areaMonkeyRule, trigger: 'blur' }
            ],
            content: [
              { required: true, message: '请输入摘要信息', trigger: 'blur' },
            ],
          },
          //审批意见
          reimData: [{
            reier: '',
            reisult: '',
            info: '',
            time: '',
          }],
            formLabelWidth: '120px',
          currentPage4:1,
          activeName: 'first',
          number: '',
          plan: '',
          accepter: '',
          createtime1: '',
          createtime2:'',
          //报销table
          tableData: [{
            number: '1',
            type: '申请中',
            createtime: '2016-05-02',
            plan: 'TC-GTY-1001-01-180806-01',
            monkey: '国旅',
            orinaze: '辽宁大运通-国内部',
            accpter: '阳阳',
            info: '',
          }, {
            number: '1',
            type: '驳回',
            createtime: '2016-05-02',
            plan: 'TC-GTY-1001-01-180806-01',
            monkey: '国旅',
            orinaze: '辽宁大运通-国内部',
            accpter: '阳阳',
            info: '郑总：信息补全',
          }, {
              number: '1',
              type: '通过',
              createtime: '2016-05-02',
              plan: 'TC-GTY-1001-01-180806-01',
              monkey: '国旅',
              orinaze: '辽宁大运通-国内部',
              accpter: '阳阳',
              info: '',
            }],
          //报销人表单
          tableData1: [{
            id: '001',
            name: '张三',
            phone: '15566447881',
            orinaze: '大运通-财务部',
            sex: '男',
            type: '启用'
          },{
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
          //团期计划表格
          planData: [],
          //关联单据表单
          joinData: [{
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
          },{
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
          },{
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

          //文件上传列表
          fileList: [{
            name: 'food.jpeg',
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
          tabIndex: 1

        };
      },
      methods: {
        addplan(){
          this.ruleForm.plan.planId = this.plans.planNum
          this.ruleForm.plan.planName = this.plans.planName
          this.Associated(this.plans.pid)
          this.dialogFormVisible2 = false

        },
        //获取关联单据
        Associated(val){
          this.$http.post(this.GLOBAL.serverSrc + '/finance/payment/api/checklist', {
            "object": {
              "planID": val,
            }
          }).then(res => {
            this.joinData = res.data.objects
            console.log(res)

          }).catch(err => {
            console.log(err)
          })
        },
        //获取团号和name
        planChange(row){
          console.log(row)
          this.plans = {};
          this.plans.planName = row.title
          this.plans.planNum = row.groupCode
          this.plans.pid = row.planID
        },
        adduser(){
          this.ruleForm.name.push(this.people);
          this.dialogFormVisible1 = false


        },
          // 报销人选中行
        clickBanle(row,){
       this.people = {}
       this.people.peo = row.name
       this.people.tt = row.orgName
        },
          //
        searchHand4(val) {
          this.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/planfinancelist', {
            "pageIndex": val,
            "pageSize": this.userSize,
            "object": {
              "groupCode": this.tour_name, //团号
              "title": this.product_name, //产品名称
              "beginDate": this.startTime2 ? formatDate(this.startTime2, 'yyyyMMdd') : 0, //搜索用开始日期
              "endDate": this.endTime2 ? formatDate(this.endTime2, 'yyyyMMdd') : 0, //搜索用结束日期
            }
          }).then(res => {
            console.log(res.data.objects)
            this.planData = res.data.objects;
          }).catch(err => {
            console.log(err)
          })

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
          console.log(this.ruleForm)
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
        chanelSubmit(){
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
        text(formName){
          console.log(this.joinData1)
        },
        // 报销弹窗
        dialogchange(){
          this.find = 0;
          this.change = false
          this.dialogFormVisible = true;
        },
        //报销弹窗查看
        dialogFind(){
          this.find = 1;
          this.change = true
          this.dialogFormVisible = true;
        },
        //添加报销
        addbx(){
          this.dialogFormVisible3 = true;
        },
        //报销人选择弹窗
        adddialog(){
          this.getUserList(1)
          this.dialogFormVisible1 = true;
        },
        //获取用户列表
        getUserList(val){
          var that = this
          this.$http.post(
            this.GLOBAL.serverSrc + "/org/api/userpage",
            {
              "object": {
                "isDeleted": 0,

              },
              "pageSize":this.userSize,
              "pageIndex": val,
              "isGetAll": true,
              "id": 0
            },
          )
            .then(function (obj) {
              that.userTotal = obj.data.total
              that.tableData1 = obj.data.objects
              console.log( that.tableData1)
            })
            .catch(function (obj) {
              console.log(obj)
            })
        },
        //团期计划弹窗
        planDialog(){
          this.dialogFormVisible2 = true;
          this.searchHand4(1)
        },
        handleClick(tab, event) {
          console.log(tab, event);
        },
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
        },
        //选择报销人
        handleCurrentChange1(val) {
          this.getUserList(val)
          console.log(`当前页: ${val}`);
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

        //获取报销列表数据
        reimList(){
          var that = this
          this.$http.post(
            this.GLOBAL.serverSrc + "/finance/expense/api/page",
            {
              "pageIndex": this.currentPage4,
              "pageSize": this.pageSize,
              "total": 0,
              "object": {
              }
            },
          )
            .then(function (obj) {
              that.pageCount = obj.data.total
            console.log(obj.data.objects)
              that.tableData = obj.data.objects
            })
            .catch(function (obj) {
              console.log(obj)
            })
        }
      },
      created(){
          this.reimList();
      }

    }
</script>

<style scoped>
  .borders{
    height: 900px;
    border: 1px solid #E6E6E6;
  }
  .search{
    float: left;
    margin-top: 30px;
  }
  .search_style{
    float: left;
    margin-top: 10px;
    margin-left: 20px;
    font-size: 14px
  }
  .search_input{
    float: left;
    width: 200px
  }
  .search__{
    float: left;
    margin-top: 10px;
    margin-left: 10px;
    margin-right: 10px;
  }
  .reform{
    float: left;
    width: 1550px;
    margin-left: 20px;
    margin-top: 20px;
  }
  .table_style{
    width: 1500px;
    margin-left: 20px;
    margin-top: 20px;
    float: left;
  }
  .block{
    float: left;
    margin-left: 600px;
    margin-top: 70px;
    margin-bottom: 30px;
  }
  .reimbursementer{
    float: left;
    max-width: 700px;
    min-width: 300px;
    min-height: 40px;
    border: 1px solid #DCDFE6;
  }
  .indialog{
    min-height: 300px;
  }
  .indialog_search{
  }
  .all>>>.el-upload-list__item {
    clear: both;
  }
  .re_style{
    margin-left: 65px;
  }
  .sh_style{
    background: rgb(234, 234, 234);
    position: absolute;
    width: 66px;
    height: 35px;
    text-align: center;
    line-height: 35px;
    top: -4px;
    left: -1019px;
  }
  .upload-demo >>>.el-upload-list__item{
    width: 30%;
  }

</style>
