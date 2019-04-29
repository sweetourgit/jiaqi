<template>
  <div class="vivo" style="position:relative">
    <el-dialog :title="title" :visible="dialogFormVisible" width=60% :show-close="false" class="addReceivables" @close="closeAdd">
      <div v-if="this.find == 1 || this.find == 2" class="sh_style">审核中</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <div class="btn" style="position:absolute;z-index:9;top:20px;right:1%;">
          <el-button @click="closeAdd">取 消</el-button>
          <el-button v-if="this.find == 0" type="primary" @click="submitForm('ruleForm')">提 交</el-button>
          <el-button v-if="this.find == 1" type="danger" @click="chanelSubmit('ruleForm')" plain>撤销收款</el-button>
          <el-button v-if="this.find == 2" type="primary" @click="Transfer ('ruleForm')">转办</el-button>
          <el-button v-if="this.find == 2" type="primary" @click="adoptForm('ruleForm')">通过</el-button>
          <el-button v-if="this.find == 2" type="danger" @click="boSubmit('ruleForm')">驳回</el-button>
        </div>
        <el-form-item label="收款时间" prop="createTime" label-width="120px">
          <el-date-picker v-model="ruleForm.createTime" type="date" placeholder="收款时间" :disabled="change"></el-date-picker>
        </el-form-item>
        <el-form-item label="收款账户" prop="collectionAccount" label-width="120px">
          <el-select style="float: left;" v-model="ruleForm.collectionAccount" placeholder="请选择" :disabled="change">
            <el-option v-for="item in collectionAccountList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="同业社" prop="sameTrade" label-width="120px">
          <el-select style="float: left;" v-model="ruleForm.sameTrade" placeholder="请选择" :disabled="change">
            <el-option v-for="item in sameTradeList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收款金额" prop="money" label-width="120px">
          <el-input type="number" v-model="ruleForm.money" class="bright" placeholder="收款金额" :disabled="change"></el-input>
        </el-form-item>
        <el-form-item label="摘要" prop="abstract" label-width="120px">
          <el-input v-model="ruleForm.abstract" class="bright2" placeholder="摘要" :disabled="change"></el-input>
        </el-form-item>
        <el-form-item label="凭证" label-width="120px">
          <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :disabled="change" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="是否开发票" prop="isInvoice" label-width="120px">
          <el-radio-group v-model="ruleForm.isInvoice" :disabled="change" @change="isInvoice">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 发票信息 -->
        <el-form-item label="" label-width="30px" label-height="auto" style="margin-top: -21px;" v-if="dialogVisible2">
          <el-table :data="ruleForm.invoiceList" border style="width: 100%;">
            <el-table-column label="发票类型" width="120" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.type" placeholder="请选择" :disabled="change">
                  <el-option v-for="item in invoiceType" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="个人/单位" width="120" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.userType" placeholder="请选择" :disabled="change">
                  <el-option key="个人" label="个人" value="个人">
                  </el-option>
                  <el-option key="单位" label="单位" value="单位">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="纳税人识别号" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.taxesNumber" required placeholder="纳税人识别号" :disabled="change"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="发票抬头/手机号" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.titleOrMobile" placeholder="发票抬头/手机号" :disabled="change"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="发票项目" width="120" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.project" placeholder="发票项目" :disabled="change">
                  <el-option v-for="item in invoiceProject" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="金额" align="center">
              <template slot-scope="scope">
                <el-input type='number' v-model="scope.row.money" placeholder="金额" :disabled="change"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="帐号" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.account" placeholder="帐号" :disabled="change"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="开户行" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.bank" placeholder="开户行" :disabled="change"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="地址" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.address" placeholder="地址" :disabled="change"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="电话" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.mobile" placeholder="电话" :disabled="change"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="70" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                <br />
                <el-button style="margin-top: 5px;" size="mini" type="primary" v-if="invoiceListCount==scope.$index" @click="handleEdit(scope.$index, scope.row)">添加</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <!-- 关联欠款 -->
        <el-form-item label="关联欠款" label-width="120px" label-height="auto">
          <span style="float: right;color:red;">欠款关联:&nbsp;&nbsp;{{arrearsRelation}}</el-input></span>
        </el-form-item>
        <el-form-item label="" label-width="" label-height="auto">
          <el-table :data="arrearsList" border style="width: 97.8%;margin-left: 30px;margin-top: -25px;">
            <el-table-column prop="orderNumber" label="订单号" align="center"></el-table-column>
            <el-table-column prop="productName" label="产品名称" align="center"></el-table-column>
            <el-table-column prop="tour" label="团期计划" align="center"></el-table-column>
            <el-table-column prop="tourStartTime" label="出团日期" align="center"></el-table-column>
            <el-table-column prop="orderMoney" label="订单金额" align="center"></el-table-column>
            <el-table-column prop="arrearsMoney" label="欠款金额" align="center"></el-table-column>
            <el-table-column prop="repaymentMoney" label="已还金额" align="center"></el-table-column>
            <el-table-column prop="inAuditMoney" label="待审核金额" align="center"></el-table-column>
            <el-table-column label="匹配收款金额" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.matchingMoney" placeholder="匹配收款金额" :disabled="change"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <!-- 审批过程 -->
        <el-form-item v-if="this.find == 1 || this.find == 2" label="审批过程" label-width="120px" label-height="auto">
        </el-form-item>
        <el-form-item v-if="this.find == 1 || this.find == 2" label="" label-width="" label-height="auto">
          <el-table :data="tableData1" border style="width: 97.8%;margin-left: 30px;margin-top: -25px;">
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
        <div style="height: 200px;"></div>
      </el-form>
    </el-dialog>
    <!--协办弹窗-->
    <el-dialog style="text-align: left" title="选择协办人:" :visible.sync="dialogFormVisible1" width="50%">
      <div style="text-align: center">
        <div style="width: 100%">
          <div class="button_select" style="margin-bottom: 30px;margin-top: -30px;">
            <el-input v-model="apply_user_input" class="input" style='margin-left: 0px;'></el-input>
            <el-button type="primary" @click="searchHand2()" size="medium">搜索</el-button>
          </div>
          <div class="table_trip" style=" width: 100%;">
            <el-table :data="tableData3" border style="width: 100%" :highlight-current-row="true" @row-click="clickBanle" :header-cell-style="getRowClass">
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
            <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page.sync="currentPage" :page-sizes="[5, 10, 50, 100]" :page-size="5" layout="total, sizes, prev, pager, next, jumper" :total=total>
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
    <!--驳回意见弹窗end-->
    <!--驳回意见弹窗-->
    <el-dialog title="请填写审批意见" :visible.sync="dialogFormVisible2" width="30%">
      <textarea style="width: 90%; height: 132px; resize:none;margin-left: 13px; ">123123</textarea>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="rejectHandle2()">确 定</el-button>
      </span>
    </el-dialog>
    <!--驳回意见弹窗end-->
    <el-dialog style="text-align: left" title="放大图片:" :visible="dialogVisible" width="50%">
      <el-button type="primary" @click="downs()" style="margin-bottom: 30px;">点击下载</el-button>
      <div>
        <img :src="imgBig" alt="图片" :alt="imgBigName"/>
        <span>{{imgBigName}}</span>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "sameTradeInfo",
  components: {},
  props: {
    dialogFormVisible: false,
    find: 0,
    change: false,
  },
  data() {
    return {
      user_id: '',
      user_name: '',
      reable: false,
      apply_user_input: '',
      total: 0,
      pageNum: 1,
      pageSize: 5,
      currentPage: 1,
      imgBigName: '',
      imgBig: '',
      dialogVisible: false,
      dialogVisible2: false,
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      ruleForm: {
        createTime: '',
        collectionAccount: '',
        sameTrade: '',
        money: '',
        abstract: '',
        isInvoice: '0',
        invoiceList: [{
          type: '',
          userType: '',
          taxesNumber: '',
          titleOrMobile: '',
          project: '',
          invoicemoney: '',
          account: '',
          bank: '',
          address: '',
          mobile: '',
        }],
      },
      rules: {
        createTime: [{ required: true, message: '收款时间不能为空', trigger: 'blur' }],
        collectionAccount: [{ required: true, message: '收款账户不能为空', trigger: 'change' }],
        sameTrade: [{ required: true, message: '同业社不能为空', trigger: 'change' }],
        money: [
          { required: true, message: '收款金额不能为空', trigger: 'blur' },
          { pattern: /^\d+(\.\d+)?$/, message: '收款金额需为正数' }
        ],
        abstract: [{ required: true, message: '摘要不能为空', trigger: 'blur' }],
        taxesNumber: [{ required: true, message: '纳税人识别号不能为空', trigger: 'blur' },
          { pattern: /^[+]{0,1}(\d+)$/, message: '纳税人识别号需为正整数' }
        ],
        isInvoice: [{ required: true, message: '是否开发票不能为空', trigger: 'blur' }],
      },
      collectionAccountList: [{
        value: '1',
        label: '收款账户1'
      }, {
        value: '2',
        label: '收款账户2'
      }, {
        value: '3',
        label: '收款账户3'
      }],
      sameTradeList: [{
        value: '1',
        label: '同业社1'
      }, {
        value: '2',
        label: '同业社2'
      }, {
        value: '3',
        label: '同业社3'
      }],

      tableData1: [{
        createTime: '2018-05-23',
        user: '阳阳',
        status: '通过',
        abstract: '没啥意见',
      }],
      tableData3: [],
      arrearsRelation: '8822.66',
      arrearsList: [{
        orderNumber: '51548979998051',
        productName: '【HKN-101】椰风海岸（海口）双飞6日游',
        tour: 'TC-GTY-1001-01-180806-01',
        tourStartTime: '2018-05-23',
        orderMoney: '1699.00',
        arrearsMoney: '1699.00',
        repaymentMoney: '0.00',
        inAuditMoney: '0.00',
        matchingMoney: '',
      }],
      invoiceType: [{
        value: '1',
        label: '类型1'
      }, {
        value: '2',
        label: '类型2'
      }, {
        value: '3',
        label: '类型3'
      }, {
        value: '4',
        label: '类型4'
      }],
      invoiceProject: [{
        value: '1',
        label: '项目1'
      }, {
        value: '2',
        label: '项目2'
      }, {
        value: '3',
        label: '项目3'
      }, {
        value: '4',
        label: '项目4'
      }],

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
    }
  },
  computed: {
    // 计算属性的 getter
    invoiceListCount() {
      return this.ruleForm.invoiceList.length - 1;
    },
    title() {
      return (this.find == 1 || this.find == 2) ? "查看同业收款" : "添加同业收款"
    },
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
    //获取id
    clickBanle(row, event, column) {
      this.user_id = row['id'];
      this.user_name = row['name'];
      this.reable = false;
    },
    closeAdd() {
      this.$emit('close', false);
    },
    changeInvoice() {
      this.ruleForm.invoiceList.forEach(function(v, k, arr) {
        console.log(arr[k]['date'])
      })
    },
    handleEdit(index, row) {
      this.ruleForm.invoiceList.push({})
    },
    handleDelete(index, row) {
      this.ruleForm.invoiceList.splice(index, 1)
      if (this.ruleForm.invoiceList.length == 0) {
        this.ruleForm.invoiceList.push({})
      }
    }, // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.arrearsRelation != 0 || this.arrearsRelation != '0.00') {
            this.$message({
              type: 'error',
              message: '关联欠款金额有误'
            });
          } else {
            alert('submit!');
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //撤销申请
    chanelSubmit() {
      this.$confirm('是否撤销该条收款, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '撤销成功!'
        });
        this.closeAdd()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消撤销'
        });
      });
    }, //转办
    Transfer() {
      this.dialogFormVisible1 = true
    },
    //驳回
    boSubmit() {
      this.dialogFormVisible2 = true
    },
    //通过确认按钮
    adoptForm() {
      this.$confirm('是否通过该条收款, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '通过成功!'
        });
        this.closeAdd()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消(通过)'
        });
      });
    },
    //转办确认按钮
    routerHandle2() {
      this.$confirm('是否转办该条收款, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '转办成功!'
        });
        this.closeAdd()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消(转办)'
        });
      });
      this.dialogFormVisible1 = false
    },
    //驳回确定按钮
    rejectHandle2() {
      this.$confirm('是否驳回该条收款, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '驳回成功!'
        });
        this.closeAdd()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消(驳回)'
        });
      });
      this.dialogFormVisible2 = false
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
    isInvoice(value) {
      this.dialogVisible2 = value == '1' ? true : false
    },
    handlePreview(file, fileList) {
      this.dialogVisible = true
      this.imgBig = file.url
      this.imgBigName = file.name
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
    handleSizeChange2(val) {
      this.pagesize = val
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
  },
  created() {

  }
}

</script>
<style lang="scss" scoped>
.sh_style {
  background: #eaeaea;
  position: absolute;
  width: 50px;
  height: 23px;
  text-align: center;
  line-height: 26px;
  top: 20px;
  left: 140px;
}

.bright {
  width: 220px;
}

.bright2 {
  width: 70%;
}

.button_select {
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: left;
  /*margin-left: 50px;*/
}

.el-input {
  width: auto
}

.search_input {
  float: left;
  width: 200px
}

</style>
