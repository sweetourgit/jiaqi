<template>
  <div class="all">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!--报销-->
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
           <!--   <el-button type="primary" plain @click="dialogchange">申请报销</el-button>-->
              <el-button type="primary" @click="dialogFind" plain>审批</el-button>
            </div>
          </div>
          <div class="table_style">
            <el-table
              :data="tableData"
              border
              style="width: 80%;">
              <el-table-column
                prop="number"
                label="报销单号"
                width="120"
                align="center">
              </el-table-column>
              <el-table-column
                prop="createtime"
                label="发起时间"
                align="center">
              </el-table-column>
              <el-table-column
                prop="plan"
                label="团期计划"
                width="250"
                align="center">
              </el-table-column>
              <el-table-column
                prop="monkey"
                label="报销金额"
                width="180"
                align="center">
              </el-table-column>
              <el-table-column
                prop="orinaze"
                label="申请组织"
                width="180"
                align="center">
              </el-table-column>
              <el-table-column
                prop="accpter"
                label="申请人"
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
              :page-sizes="[100, 200, 300, 400]"
              :page-size="100"
              layout="total, sizes, prev, pager, next, jumper"
              :total="400"
              background>
            </el-pagination>
          </div>
        </div>

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
                  <el-button  size="mini" @click="planDialog" v-if="find==0">选择</el-button>
                </el-form-item>
                <el-form-item label="报销金额" prop="monkey">
                  <el-input v-model="ruleForm.monkey.type" placeholder="请输入或者选择报销类型" style="width: 240px;" :disabled="change"></el-input>
                  <el-input v-model="ruleForm.monkey.count" placeholder="请输入或者选择报销金额" style="width: 240px;" :disabled="change"></el-input>
                </el-form-item>
                <el-form-item label="摘要" prop="contents">
                  <el-input v-model="ruleForm.content" placeholder="请输入或者选择报销类型" style="width: 480px;" ></el-input>
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
                        prop="type"
                        label="类型"
                        width="90"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="gys"
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
          <el-button v-if="this.find == 1" type="primary"  @click="Transfer ('ruleForm')">转办</el-button>
          <el-button v-if="this.find == 1" type="success"  @click="submitForm('ruleForm')">确 定</el-button>
          <el-button  v-if="this.find == 1"  type="danger" @click="boSubmit('ruleForm')">驳回</el-button>
        </div>
      </el-dialog>
      <!--报销弹窗end-->
      <!--报销人弹窗-->
      <el-dialog
        width="25%"
        title="选择成员"
        :visible.sync="dialogFormVisible1"
        append-to-body>
        <div>
          <div class="indialog">
            <div class="indialog_search">
              <el-input v-model="number" placeholder="请输入内容" class="search_input"></el-input>
              <el-button type="primary" size="mini" round style="margin-top: 5px; margin-left: 10px">搜索</el-button>
            </div>
            <el-table
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
                prop="orinaze"
                label="组织"
                width="180"
              >
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-dialog>
      <!--报销人弹窗end-->
      <!--团期计划弹窗-->
      <el-dialog
        width="60%"
        title="选择报销的人"
        :visible.sync="dialogFormVisible2"
        append-to-body>
        <div class="indialog">
          <div class="indialog_search">
            <span class="search_style">团期单号：</span> <el-input v-model="planNum" placeholder="请输入内容" class="search_input"></el-input>
            <span class="search_style">产品名称：</span> <el-input v-model="planName" placeholder="请输入内容" class="search_input"></el-input>
            <span class="search_style">出行日期：</span> <el-input v-model="planTime" placeholder="请输入内容" style="float: left; width: 100px"></el-input>
            <span class="search__">—</span> <el-input v-model="planTime1" placeholder="请输入内容" style="float: left; width: 100px"></el-input>
            <el-button type="primary" size="mini" round style="margin-top: 5px; margin-left: 10px">重置</el-button>
          </div>
          <el-table
            :data="planData"
            border
            style="width: 100%; margin-top: 30px">
            <el-table-column
              prop="id"
              label="团期计划ID"
            >
            </el-table-column>
            <el-table-column
              prop="name"
              label="产品名称"
            >
            </el-table-column>
            <el-table-column
              prop="address"
              label="目的地"
            >
            </el-table-column>
            <el-table-column
              prop="time"
              label="出行日期"
            >
            </el-table-column>
            <el-table-column
              prop="ornize"
              label="部门"
            >
            </el-table-column>
            <el-table-column
              prop="proer"
              label="产品录入人">
            </el-table-column>
          </el-table>
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
      <!--驳回意见弹窗-->
      <el-dialog
        title="请填写审批意见"
        :visible.sync="dialogFormVisible4"
        width="30%"
      >
       <textarea style="width: 500px; height: 132px; resize:none;margin-left: 13px; ">123123</textarea>
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
        //分辨查看
        find:0,
        change:false,
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
        //审批意见弹窗
        dialogFormVisible4: false,
        //团期计划搜索
        planNum:'',
        planName:'',
        planTime:'',
        planTime1:'',
        //手添报销
        domains: [{
          type: '地接',
          money: '9000.00'
        }],
        //报销表单
        ruleForm: {
          name: [
            {
              tt:'大运通-日本',
              peo:'阳阳'
            }
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
          contents: [
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
        currentPage4:4,
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
          orinaze: '辽宁大运通-销售部-主管 辽宁大运通-销售部-主管',
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
        planData: [{
          id: 'TC-GTY-1001-01-180806-01',
          name: '美国西海岸三城双奥莱10日之旅',
          address: '西雅图',
          time: '2019-01-09',
          ornize: '辽宁大运通-北美部',
          proer: '阳阳',
        },{
          id: 'TC-GTY-1001-01-180806-01',
          name: '美国西海岸三城双奥莱10日之旅',
          address: '西雅图',
          time: '2019-01-09',
          ornize: '辽宁大运通-北美部',
          proer: '阳阳',
        }],
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
      Transfer(){
        this.dialogFormVisible1 = true
      },
      //驳回
      boSubmit(){
        this.dialogFormVisible4 = true
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
        this.dialogFormVisible1 = true;
      },
      //团期计划弹窗
      planDialog(){
        this.dialogFormVisible2 = true;
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
      }
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

</style>
