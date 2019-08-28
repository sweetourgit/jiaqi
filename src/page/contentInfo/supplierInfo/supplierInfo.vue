<template>
  <div class="supplierList">
    <!--搜索栏-->
    <div class="plan">
      <div style="width:1140px;">
        <div class="fl">
          <span class="emptyPlan">供应商名称</span>
          <el-input v-model="supplierName" class="empty" clearable placeholder="请输入团期计划"></el-input>
        </div>
        <div class="fl" style="margin:0 90px 0 90px;">
          <span class="emptyPlan">ID</span>
          <el-input v-model="supplierCard" class="empty" clearable placeholder="请输入申请人"></el-input>
        </div>
        <div class="fl">
          <span class="emptyPlan">结算方式</span>
          <el-select v-model="settlement" placeholder="请输入类型" class="empty">
            <el-option :label="item.label" :value="item.value" v-for="(item,index) of settlementType" :key="item.value" />
          </el-select>
        </div>
      </div>
      <div style="width:1140px;">
        <div class="fl">
          <span class="emptyPlan">状态</span>
          <el-select v-model="condition" placeholder="请输入类型" class="empty">
            <el-option :label="item.label" :value="item.value" v-for="(item,index) of conditionType" :key="item.value" />
          </el-select>
        </div>
        <div class="fl" style="margin:0 90px 0 90px;">
          <span class="emptyPlan">类别</span>
          <el-select v-model="category" placeholder="请输入类型" class="empty">
            <el-option :label="item.label" :value="item.value" v-for="(item,index) of borrowingType" :key="item.value" />
          </el-select>
        </div>
        <div class="fl">
          <span class="emptyPlan">可见区域</span>
          <el-select v-model="visibleArea" placeholder="请输入类型" class="empty">
            <el-option :label="item.label" :value="item.value" v-for="(item,index) of visibleType" :key="item.value" />
          </el-select>
        </div>
      </div>
      <div style="float:right; margin:0 0 30px 0;">
        <el-button type="primary" @click="searchButton()">搜索</el-button>
        <el-button type="primary" plain @click="reset()">重置</el-button>
      </div>
    </div>
    <!--添加按钮-->
    <div style="clear:both;"><el-button type="primary" @click="addSupplier">添加</el-button></div>
    <!--表格-->
    <el-table :data="tableData" border class="tableData" :header-cell-style="getRowClass">
      <el-table-column prop="id" label="ID" width="150"align="center"></el-table-column>
      <el-table-column prop="name" label="供应商名称" width="230"align="center"></el-table-column>
      <el-table-column prop="userStateEX" label="状态" width="100" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.userStateEX=='正常'" style="color: #7F7F7F" >{{scope.row.userStateEX}}</div>
          <div v-if="scope.row.userStateEX=='停用'" style="color: #FF4A3D" >{{scope.row.userStateEX}}</div>
          <div v-if="scope.row.userStateEX=='待审核'" style="color: #33D174" >{{scope.row.userStateEX}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="supplierTypeEX" label="类型" width="150"align="center"></el-table-column>
      <el-table-column prop="isMonthlyEX" label="结算方式" width="150"align="center"></el-table-column>
      <el-table-column prop="orgName" label="所属部门" width="200"align="center"></el-table-column>
      <el-table-column label="操作" width="159" align="center">
        <template slot-scope="scope">
          <span class="cursor" @click="handleClick(scope.row.id)">详情</span>
          <span>|</span>
          <span class="cursor">编辑</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pagination" :page-sizes="[10,1,30,50]" background @size-change="handleSizeChange" :page-size="pagesize" :current-page.sync="currentPage" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total">
     </el-pagination>
    <!--添加弹窗-->
    <el-dialog :title="title" :visible.sync="supplierShow" width="1100px" style="margin:-80px 0 0 0;" custom-class="city_list" :show-close='false'> 
      <div class="addButton">
        <el-button @click="closeSupplier()">取消</el-button>
        <el-button @click="saveModule('ruleForm')" type="primary">确定</el-button>
      </div>
      <div class="basic">基本信息</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" style="overflow:hidden; margin:20px 0 0 0;">
        <div style="float:left;">
          <el-form-item label="供应商名称" prop="name">
            <el-input class="name_input" v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="公司可见性" prop="visible">
            <!-- <el-cascader :options="visibleType" v-model="ruleForm.visible" clearable></el-cascader> -->
            <el-select v-model="ruleForm.visible" placeholder="请选择">
              <el-option v-for="item in visibleType" :key="item.value":label="item.label":value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="supplierState">
            <el-select v-model="ruleForm.supplierState" placeholder="请选择">
              <el-option v-for="item in conditionType" :key="item.value":label="item.label":value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="线路" prop="routeType">
            <el-select v-model="ruleForm.routeType" placeholder="请选择">
              <el-option v-for="item in pathType" :key="item.value":label="item.label":value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类别" prop="supplierType">
            <el-select v-model="ruleForm.supplierType" placeholder="请选择">
              <el-option v-for="item in borrowingType" :key="item.value":label="item.label":value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结算方式" prop="supplierWay">
            <el-select v-model="ruleForm.supplierWay" placeholder="请选择">
              <el-option v-for="item in settlementType" :key="item.value":label="item.label":value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="使用部门" prop="userDepartment">
            <el-cascader  v-model="ruleForm.userDepartment" :props="props" clearable></el-cascader>
          </el-form-item>
          <el-form-item label="产品主要方向" prop="orientation">
            <el-input class="name_input" v-model="ruleForm.orientation"></el-input>
          </el-form-item>
          <el-form-item label="到期日期" prop="expireData">
            <el-date-picker class="name_input" v-model="ruleForm.expireData" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="附件" prop="supplierUpload">
            <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :file-list="fileList">
              <el-button size="small">上传文件</el-button>
            </el-upload>
          </el-form-item>
        </div>
        <div style="float:right; margin:0 200px 0 0; overflow:hidden;">
          <el-form-item label="法人代表" prop="legalPerson">
            <el-input class="name_input" v-model="ruleForm.legalPerson"></el-input>
          </el-form-item>
          <el-form-item label="合同编号" prop="pactNumber">
            <el-input class="name_input" v-model="ruleForm.pactNumber"></el-input>
          </el-form-item>
          <el-form-item label="经手人" prop="handlers">
            <el-input class="name_input" v-model="ruleForm.handlers"></el-input>
          </el-form-item>
          <el-form-item label="经手人电话" prop="handlersPhone">
            <el-input class="name_input" v-model="ruleForm.handlersPhone"></el-input>
          </el-form-item>
          <el-form-item label="负责人" prop="principal">
            <el-input class="name_input" v-model="ruleForm.principal"></el-input>
          </el-form-item>
          <el-form-item label="负责人电话" prop="principalPhone">
            <el-input class="name_input" v-model="ruleForm.principalPhone"></el-input>
          </el-form-item>
          <el-form-item label="操作负责人" prop="operator">
            <el-input class="name_input" v-model="ruleForm.operator"></el-input>
          </el-form-item>
          <el-form-item label="供应商协议" prop="agreement">
            <el-select v-model="ruleForm.agreement" placeholder="请选择">
              <el-option v-for="item in agreement" :key="item.value":label="item.label":value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input class="name_input" v-model="ruleForm.remark"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div class="basic" style="margin:15px 0 0 0;">账户信息</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" style="overflow:hidden; margin:20px 0 0 0;">
        <div style="float:left;">
          <el-form-item label="汇款户名" prop="accountName">
            <el-input class="name_input" v-model="ruleForm.accountName"></el-input>
          </el-form-item>
          <el-form-item label="开户行" prop="openingBank">
            <el-input class="name_input" v-model="ruleForm.openingBank"></el-input>
          </el-form-item>
        </div>
        <div style="float:right; margin:0 200px 0 0; overflow:hidden;">
          <el-form-item label="账号" prop="account">
            <el-input class="name_input" v-model="ruleForm.account"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="note">
            <el-input class="name_input" v-model="ruleForm.note"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div style="float:right; margin:0 200px 30px 0;">
        <el-button type="primary" plain @click="emptyForm()">清空表单</el-button>
        <el-button type="primary" @click="addEmty()">添加账户</el-button>
      </div>
      <el-table :data="tableDataBank" border class="tableDataBank" :header-cell-style="getRowClass">
        <el-table-column prop="cardName" label="汇款户名" width="109"align="center"></el-table-column>
        <el-table-column prop="bankName" label="开户行" width="150"align="center"></el-table-column>
        <el-table-column prop="cardNumber" label="账号" width="200"align="center"></el-table-column>
        <el-table-column prop="memo" label="备注" width="150"align="center"></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small" class="balk_details">编辑</el-button>
            <div class="table_line">|</div>
            <el-button type="text" @click.native.prevent="deleteEmty(scope.$index, tableDataBank)" class="table_editor" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
  let id = 0;
  export default {
    data(){
      return{
        aaa: 1,
props: {
  lazy: true,
  _this: this,
  multiple: true, checkStrictly: true,
  lazyLoad(node, resolve) {
    const { level } = node;
    let nId = 204;
    if (level > 0) {
      nId = node.value;
    }
    console.log(nId);
    this._this.$http
    .post(this._this.GLOBAL.serverSrc + "/org/api/deptlist", {
      object: {
        ParentID: nId
      }
    })
    .then(res => {
    let data = res.data.objects.map(v => {
      return {
        label: v.orgName,
        value: v.id
      };
    });
    resolve(data);
    });
  }
},
        supplierName:'',//搜索框供应商名称
        supplierCard:'',//搜索框ID
        settlement:'',//搜索框结算名称
        condition:'',//搜索框状态
        category:'',//搜索框类别
        visibleArea:'',//搜索框可见区域
        /*ruleForm:{
          supplierName:'',//搜索框供应商名称
          supplierCard:'',//搜索框ID
          settlement:'',//搜索框结算名称
          condition:'',//搜索框状态
          category:'',//搜索框类别
          visibleArea:'',//搜索框可见区域
        },*/
        ruleForm:{
          name:'',
          visible:'',
          supplierState:'',
          routeType:'',
          supplierType:'',
          supplierWay:'',
          userDepartment:'',
          orientation:'',
          expireData:'',
          supplierUpload:'',
          legalPerson:'',
          pactNumber:'',
          handlers:'',
          handlersPhone:'',
          principal:'',
          principalPhone:'',
          operator:'',
          agreement:'',
          remark:'',
          accountName:'',
          openingBank:'',
          account:'',
          note:''
        },
        conditionType:[{//状态
          value:'正常',
          label:'正常'
        },{
          value:'停用',
          label:'停用'
        },{
          value:'待审核',
          label:'待审核'
        }],
        ruleForm_01:{
          accountName:'',
          openingBank:'',
          account:'',
          note:''
        },
        rules:{//验证
          name: [{ required: true, message: '供应商名称不能为空', trigger: 'blur' },
                 { min: 0, max: 40, message: '供应商名称字数不能超过40字', trigger: 'change' },],
          visible:[{ required: true, message: '公司可见性不能为空', trigger: 'blur' }],
          supplierState:[{ required: true, message: '状态不能为空', trigger: 'blur' }],
          routeType:[{ required: true, message: '线路不能为空', trigger: 'blur' }],
          supplierType:[{ required: true, message: '类别不能为空', trigger: 'blur' }],
          supplierWay:[{ required: true, message: '结算方式不能为空', trigger: 'blur' }],
          userDepartment:[{ required: true, message: '使用部门不能为空', trigger: 'blur' }],
        },
        //0settlement: [],//结算方式
        condition:[{//状态
          value:'正常',
          label:'正常'
        },{
          value:'停用',
          label:'停用'
        },{
          value:'待审核',
          label:'待审核'
        }],
        settlementType:[],//搜索框结算方式数字
        borrowingType:[],//搜索框供应商类别数组
        visibleType:[],//搜索框可见区域数组
        pathType:[],//添加弹窗中线路数组
        tableData:[],//表格
        supplierShow:false,//添加弹窗
        branch: [{//使用部门选择器
          value: 'zhinan',
          label: '指南',
          children: [{
            value: 'shejiyuanze',
            label: '设计原则',
            children: [{
              value: 'yizhi',
              label: '一致'
            }, {
              value: 'fankui',
              label: '反馈'
            }, {
              value: 'xiaolv',
              label: '效率'
            }, {
              value: 'kekong',
              label: '可控'
            }]
          }, {
            value: 'daohang',
            label: '导航',
            children: [{
              value: 'cexiangdaohang',
              label: '侧向导航'
            }, {
              value: 'dingbudaohang',
              label: '顶部导航'
            }]
          }]
        }, {
          value: 'zujian',
          label: '组件',
          children: [{
            value: 'basic',
            label: 'Basic',
            children: [{
              value: 'layout',
              label: 'Layout 布局'
            }, {
              value: 'color',
              label: 'Color 色彩'
            }, {
              value: 'typography',
              label: 'Typography 字体'
            }, {
              value: 'icon',
              label: 'Icon 图标'
            }, {
              value: 'button',
              label: 'Button 按钮'
            }]
          }, {
            value: 'form',
            label: 'Form',
            children: [{
              value: 'radio',
              label: 'Radio 单选框'
            }, {
              value: 'checkbox',
              label: 'Checkbox 多选框'
            }, {
              value: 'input',
              label: 'Input 输入框'
            }, {
              value: 'input-number',
              label: 'InputNumber 计数器'
            }, {
              value: 'select',
              label: 'Select 选择器'
            }, {
              value: 'cascader',
              label: 'Cascader 级联选择器'
            }, {
              value: 'switch',
              label: 'Switch 开关'
            }, {
              value: 'slider',
              label: 'Slider 滑块'
            }, {
              value: 'time-picker',
              label: 'TimePicker 时间选择器'
            }, {
              value: 'date-picker',
              label: 'DatePicker 日期选择器'
            }, {
              value: 'datetime-picker',
              label: 'DateTimePicker 日期时间选择器'
            }, {
              value: 'upload',
              label: 'Upload 上传'
            }, {
              value: 'rate',
              label: 'Rate 评分'
            }, {
              value: 'form',
              label: 'Form 表单'
            }]
          }, {
            value: 'data',
            label: 'Data',
            children: [{
              value: 'table',
              label: 'Table 表格'
            }, {
              value: 'tag',
              label: 'Tag 标签'
            }, {
              value: 'progress',
              label: 'Progress 进度条'
            }, {
              value: 'tree',
              label: 'Tree 树形控件'
            }, {
              value: 'pagination',
              label: 'Pagination 分页'
            }, {
              value: 'badge',
              label: 'Badge 标记'
            }]
          }, {
            value: 'notice',
            label: 'Notice',
            children: [{
              value: 'alert',
              label: 'Alert 警告'
            }, {
              value: 'loading',
              label: 'Loading 加载'
            }, {
              value: 'message',
              label: 'Message 消息提示'
            }, {
              value: 'message-box',
              label: 'MessageBox 弹框'
            }, {
              value: 'notification',
              label: 'Notification 通知'
            }]
          }, {
            value: 'navigation',
            label: 'Navigation',
            children: [{
              value: 'menu',
              label: 'NavMenu 导航菜单'
            }, {
              value: 'tabs',
              label: 'Tabs 标签页'
            }, {
              value: 'breadcrumb',
              label: 'Breadcrumb 面包屑'
            }, {
              value: 'dropdown',
              label: 'Dropdown 下拉菜单'
            }, {
              value: 'steps',
              label: 'Steps 步骤条'
            }]
          }, {
            value: 'others',
            label: 'Others',
            children: [{
              value: 'dialog',
              label: 'Dialog 对话框'
            }, {
              value: 'tooltip',
              label: 'Tooltip 文字提示'
            }, {
              value: 'popover',
              label: 'Popover 弹出框'
            }, {
              value: 'card',
              label: 'Card 卡片'
            }, {
              value: 'carousel',
              label: 'Carousel 走马灯'
            }, {
              value: 'collapse',
              label: 'Collapse 折叠面板'
            }]
          }]
        }, {
          value: 'ziyuan',
          label: '资源',
          children: [{
            value: 'axure',
            label: 'Axure Components'
          }, {
            value: 'sketch',
            label: 'Sketch Templates'
          }, {
            value: 'jiaohu',
            label: '组件交互文档'
          }]
        }],

        fileList: [],//添加供应商上传附件
        agreement:[{//供应商协议
          value:'是',
          label:'是'
          },{
            value:'否',
            label:'否'
          }],
        tableDataBank:[],//账户信息表格
        title:"",//标题
        //分页
        currentPage: 1,
        pagesize: 10, // 设定默认分页每页显示数
        pageIndex: 1, // 设定当前页数
        total: 0,
      }
    },
    methods:{
      //表格颜色
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#F7F7F7;color:rgb(85, 85, 85);'
        } else {
          return ''
        }
      },
      //搜索框重置
      reset(){
        this.supplierName = "",//搜索框供应商名称
        this.supplierCard = "",//搜索框ID
        this.settlement = "",//搜索框结算名称
        this.condition = "",//搜索框状态
        this.category = "",//搜索框类别
        this.visibleArea = ""//搜索框可见区域
      },
      //结算方式
      settlemen(){
        this.settlementType = [];
        this.$http.post('http://192.168.2.65:3017/universal/supplier/api/dictionaryget?enumname=IsMonthly')
        .then(res => {
          for (let i = 0; i < res.data.objects.length; i++) {
            this.settlementType.push({
              "value": res.data.objects[i].id,
              "label": res.data.objects[i].name
            })
          }
        })
        .then(res =>{
          //that.settlementType =  res.data.objects;
        }).catch(function(err){
          console.log(err);
        })
      },
      //供应商类别
      themeList(){
        this.borrowingType = [];
        this.$http.post('http://192.168.2.65:3017/universal/supplier/api/dictionaryget?enumname=SupplierType')
        .then(res => {
          for (let i = 0; i < res.data.objects.length; i++) {
            this.borrowingType.push({
              "value": res.data.objects[i].id,
              "label": res.data.objects[i].name
            })
          }
        })
        .then(res =>{
          //this.borrowingType =  res.data.objects;
        }).catch(function(err){
          console.log(err);
        })
      },
      //可见区域
      visible(){
        this.visibleType = [];
        this.$http.post('http://192.168.2.65:3017/universal/supplier/api/dictionaryget?enumname=CompanyArea')
        .then(res => {
          for (let i = 0; i < res.data.objects.length; i++) {
            this.visibleType.push({
              "value": res.data.objects[i].id,
              "label": res.data.objects[i].name
            })
          }
        })
        .then(res =>{
          //this.borrowingType =  res.data.objects;
        }).catch(function(err){
          console.log(err);
        })
      },
      //线路
      trails(){
        this.pathType = [];
        this.$http.post('http://192.168.2.65:3017/universal/supplier/api/dictionaryget?enumname=ProductArea')
        .then(res => {
          for (let i = 0; i < res.data.objects.length; i++) {
            this.pathType.push({
              "value": res.data.objects[i].id,
              "label": res.data.objects[i].name
            })
          }
        })
        .then(res =>{
          //this.pathType =  res.data.objects;
        }).catch(function(err){
          console.log(err);
        })
      },
      /*ccc(){
        props: {
          lazy: true,
          _this: this,
          lazyLoad(node, resolve) {
          const { level } = node;
          let nId = 204;
          if (level > 0) {
            nId = node.value;
          }
          console.log(nId);
          this._this.$http
          .post(this._this.GLOBAL.serverSrc + "/org/api/deptlist", {
            object: {
              ParentID: nId
            }
          })
          .then(res => {
          let data = res.data.objects.map(v => {
            return {
              label: v.orgName,
              value: v.id
            };
          });
          resolve(data);
          });
          // }, 100);
          }
}
      },*/
      saveModule(formName){ //判断显示编辑或者添加弹窗
         if(this.title == "添加供应商"){
            this.addLabelTheme(formName);
         }else{
            this.editLabelTheme(formName);
         }
      },
      addLabelTheme(formName){//添加一条供应商
         
      },
      //添加供应商按钮
      addSupplier(){
        this.title="添加供应商";
        this.supplierShow = true;
      },
      closeSupplier(){
        this.supplierShow = false;
      },
      //申请
      confirmSupplier(){

      },
      //分页
      handleSizeChange(page) {
        this.currentPage = 1;
        this.pagesize = page;
        this.supplierPage();
      },
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage;
        this.supplierPage();
      },
      //搜索
      searchButton(){
        this.supplierPage();
      },
      //查询表格
      supplierPage(supplierName=this.supplierName,supplierCard=this.supplierCard,settlement=this.settlement,condition=this.condition,category=this.category,visibleArea=this.visibleArea){
        var that = this
        this.$http.post(
          this.GLOBAL.serverSrc + "/universal/supplier/api/supplierpage",
          {
            "object": {
              "isDeleted": 0,
              "name":supplierName,
              "id":supplierCard == '' ? 0 : supplierCard,
              "isMonthly":settlement == '' ? 0 : settlement,
              "supplierType": category == '' ? -1 : category,
              "UserState":condition == '' ? -1 : condition,
              "companyArea":visibleArea == '' ? 1 : visibleArea
              /*"isDeleted": 0,
              "supplierType": -1,
              "UserState":-1,*/
            },
            "pageSize":this.pagesize,
            "pageIndex": this.currentPage,
            "isGetAll": true,
            "id": 0,
          },)
          .then(function (obj) {
            that.total = obj.data.total
            that.tableData = obj.data.objects
          })
          .catch(function (obj) {
            console.log(obj)
          })
      },
      //清空表单
      emptyForm(){
        this.ruleForm.accountName = "",
        this.ruleForm.openingBank = "",
        this.ruleForm.account = "",
        this.ruleForm.note = ""
      },
      //添加账户
      addEmty(index, row){
        if(this.ruleForm.accountName != '' && this.ruleForm.openingBank != '' && this.ruleForm.account != '' && this.ruleForm.note != ''){
          this.tableDataBank.push({
              "cardName" : this.ruleForm.accountName,
              "bankName" : this.ruleForm.openingBank,
              "cardNumber" : this.ruleForm.account,
              "memo" : this.ruleForm.note
          });
          this.emptyForm();
        }
      },
      //编辑账户
      handleClick(index,rows){
        /*this.ruleForm_01.accountName = this.cardName;
        this.ruleForm_01.openingBank = this.bankName;
        this.ruleForm_01.account = this.cardNumber;
        this.ruleForm_01.note = this.memo;*/
      },
      //删除账户
      deleteEmty(index, rows){
        rows.splice(index, 1);
      },


      
      
      
    },
    
    mounted(){
      this.supplierPage();
    },
    created(){
      this.themeList();//供应商类别
      this.settlemen();//结算方式
      this.visible();//可见区域
      this.trails();//线路
      this.ccc();
    },


 
  }
</script>

<style scoped lang='stylus'>
  .supplierList{width:1140px;}
  /*搜索框样式*/
  .name_input{width:200px;}
  .empty{ width: 200px; line-height: 30px;margin: 0 0 0 10px; }
  .fl{float:left; margin: 0 0 20px 0;}
  .emptyPlan{margin: 0 0 0 30px; float:left; width:80px; text-align:right; line-height:40px;}
  .planTime{width: 135px; line-height: 30px;margin: 0 0 0 10px;}
  .time{margin: 0 0 0 10px;}
  .plan{font-size:14px;}

  /*表格样式*/
  .tableData{width:1140px; margin:20px 0 0 0;}
  .cursor{cursor: pointer}
  /*添加弹窗样式*/
  .addButton{position:absolute; top:8px; right:10px;}
  .basic{font-size:12pt;}
  /*银行表格*/
  .tableDataBank{width:810px;margin:15px 0 0 50px;overflow:hidden;}
  .balk_details{float:left; margin:0 0 0 50px; color:#000;}
  .table_line{float:left; margin:3px 10px 0 10px;}
  .table_editor{float:left;}
  /*分页*/
  .pagination{text-align:right;margin:30px 0 50px 0}

</style>
