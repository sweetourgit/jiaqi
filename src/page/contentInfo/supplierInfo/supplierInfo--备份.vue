<template>
  <div class="supplierList">
    <el-form :model="ruleForm" label-width="120px">
      <div>
        <el-form-item label="供应商名称" prop="supplierName" style="float:left;">
          <el-input class="name_input" v-model="ruleForm.supplierName"placeholder="请输入供应商名称"></el-input>
        </el-form-item>
        <el-form-item label="ID" prop="supplierCard" style="float:left; margin:0 90px 0 90px;">
          <el-input class="name_input" v-model="ruleForm.supplierCard"></el-input>
        </el-form-item>
        <el-form-item label="结算方式" prop="settlement" style="float:left;">
          <!-- <el-input class="name_input" v-model="ruleForm.settlement"></el-input> -->
          
          <el-cascader :options="settlement" v-model="ruleForm.settlement" clearable></el-cascader>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="状态" prop="condition" style="float:left;">
          <!-- <el-input class="name_input" v-model="ruleForm.condition"></el-input> -->
          <el-select v-model="ruleForm.condition" placeholder="请选择结算方式">
            <el-option v-for="item in condition" :key="item.value":label="item.label":value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类别" prop="category" style="float:left; margin:0 90px 0 90px;">
          <!-- <el-input class="name_input" v-model="ruleForm.category"></el-input> -->
           <el-cascader :options="borrowingType" v-model="ruleForm.category" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="可见区域" prop="visibleArea" style="float:left;">
          <!-- <el-input class="name_input" v-model="ruleForm.visibleArea"></el-input> -->
          <el-select v-model="ruleForm.visibleArea" placeholder="请选择结算方式">
            <el-option v-for="item in condition" :key="item.value":label="item.label":value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div style="float:right; margin:0 0 30px 0;">
        <el-button type="primary">搜索</el-button>
        <el-button type="primary" plain @click="reset()">重置</el-button>
      </div>
    </el-form>
    <div style="clear:both;"><el-button type="primary" @click="addSupplier">添加</el-button></div>
    <!--表格-->
    <el-table :data="tableData" border class="tableData">
      <el-table-column prop="id" label="ID" width="150"align="center"></el-table-column>
      <el-table-column prop="name" label="供应商名称" width="230"align="center"></el-table-column>
      <el-table-column prop="userState" label="状态" width="100" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.userState=='正常'" style="color: #7F7F7F" >{{scope.row.userState}}</div>
          <div v-if="scope.row.userState=='停用'" style="color: #FF4A3D" >{{scope.row.userState}}</div>
          <div v-if="scope.row.userState=='待审核'" style="color: #33D174" >{{scope.row.userState}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="supplierType" label="类型" width="150"align="center"></el-table-column>
      <el-table-column prop="isMonthly" label="结算方式" width="150"align="center"></el-table-column>
      <el-table-column prop="destinationID" label="所属部门" width="200"align="center"></el-table-column>
      <el-table-column label="操作" width="159" align="center">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small" class="table_details">详情</el-button>
          <div class="table_line">|</div>
          <el-button type="text" class="table_details" size="small">编辑</el-button>
          <div class="table_line">|</div>
          <el-button type="text" class="table_editor" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination class="pageList" :page-sizes="[10,1,30,50]" background @size-change="handleSizeChange" :page-size="pagesize" :current-page.sync="currentPage" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    <!--添加弹窗-->
    <el-dialog title="添加供应商" :visible.sync="supplierShow" width="1100px" custom-class="city_list" :show-close='false'> 
      <div class="" style="position:absolute; top:8px; right:10px;">
        <el-button @click="cancelAddSupplier()">取消</el-button>
        <el-button type="primary">添加</el-button>
      </div> 
      <div class="basic">基本信息</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" style="overflow:hidden; margin:20px 0 0 0;">
        <div style="float:left;">
          <el-form-item label="供应商名称" prop="name">
            <el-input class="name_input" v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="公司可见性" prop="visible">
            <el-cascader :options="visibles" v-model="ruleForm.visible" :props="{ multiple: true, checkStrictly: true }" clearable></el-cascader>
          </el-form-item>
          <el-form-item label="状态" prop="supplierState">
            <el-select v-model="ruleForm.supplierState" placeholder="请选择">
              <el-option v-for="item in state" :key="item.value":label="item.label":value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类别" prop="supplierType">
            <el-cascader :options="borrowingType" v-model="ruleForm.supplierType" :props="{ multiple: true, checkStrictly: true }" clearable></el-cascader>
          </el-form-item>
          <el-form-item label="结算方式" prop="supplierWay">
            <el-select v-model="ruleForm.supplierWay" placeholder="请选择">
              <el-option v-for="item in visibles" :key="item.value":label="item.label":value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="使用部门" prop="userDepartment">
            <el-cascader :options="branch" v-model="ruleForm.userDepartment" :props="{ multiple: true, checkStrictly: true }" clearable></el-cascader>
          </el-form-item>
          <el-form-item label="产品主要方向" prop="orientation">
            <el-input class="name_input" v-model="ruleForm.orientation"></el-input>
          </el-form-item>
          <el-form-item label="到期日期" prop="expireData">
            <el-date-picker class="name_input" v-model="ruleForm.expireData" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="附件" prop="supplierUpload">
            <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :file-list="fileList">
    		  		<el-button size="small" type="primary">选择文件</el-button>
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
              <el-option v-for="item in visibles" :key="item.value":label="item.label":value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input class="name_input" v-model="ruleForm.remark"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div class="basic" style="margin:15px 0 0 0;">账户信息</div>
      <el-form :model="ruleForm_01" :rules="rules" ref="ruleForm" label-width="120px" style="overflow:hidden; margin:20px 0 0 0;">
        <div style="float:left;">
          <el-form-item label="汇款户名" prop="accountName">
            <el-input class="name_input" v-model="ruleForm_01.accountName"></el-input>
          </el-form-item>
          <el-form-item label="开户行" prop="openingBank">
            <el-input class="name_input" v-model="ruleForm_01.openingBank"></el-input>
          </el-form-item>
        </div>
        <div style="float:right; margin:0 200px 0 0; overflow:hidden;">
          <el-form-item label="账号" prop="account">
            <el-input class="name_input" v-model="ruleForm_01.account"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="note">
            <el-input class="name_input" v-model="ruleForm_01.note"></el-input>
          </el-form-item>
        </div>
      </el-form>
	  <div style="float:right; margin:0 200px 30px 0;">
	  	<el-button type="primary" plain @click="emptyForm()">清空表单</el-button>
	  	<el-button type="primary">添加账户</el-button>
	  </div>
      <el-table :data="tableDataBank" border class="tableDataBank">
	      <el-table-column prop="cardName" label="汇款户名" width="109"align="center"></el-table-column>
	      <el-table-column prop="bankName" label="开户行" width="150"align="center"></el-table-column>
	      <el-table-column prop="cardNumber" label="账号" width="200"align="center"></el-table-column>
	      <el-table-column prop="memo" label="备注" width="150"align="center"></el-table-column>
	      <el-table-column label="操作" width="200" align="center">
	        <template slot-scope="scope">
	          <el-button @click="handleClick(scope.row)" type="text" size="small" class="balk_details">编辑</el-button>
	          <div class="table_line">|</div>
	          <el-button type="text" class="table_editor" size="small">删除</el-button>
	        </template>
	      </el-table-column>
	    </el-table>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        //表格数据
        tableData: [],
        //银行表格
        tableDataBank:[{
        	cardName:'1',
        	bankName:'建行',
        	cardNumber:'1234 1234 1234 1234 123',
        	memo:'1'
        }],
        settlement: [{//结算方式
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
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
        //分页
        currentPage: 1,
        total:0,
        pagesize:10,
        //添加弹窗
        supplierShow:false,
        ruleForm:{
          name:'',
          visible:'',
          supplierState:'',
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
          supplierName:'',
          supplierCard:'',
          settlement:'',
          condition:'',
          category:'',
          visibleArea:'',
        },
        ruleForm_01:{
        	accountName:'',
        	openingBank:'',
        	account:'',
        	note:''
        },
        rules:{
          name: [{ required: true, message: '请输入借款人名字', trigger: 'blur' }],
          visible:[{ required: true, message: '请选择可共享的部门', trigger: 'blur' }],
          supplierState: [{ required: true, message: '请输入借款人名字', trigger: 'blur' }],
          supplierType:[{ required: true, message: '请选择可共享的部门', trigger: 'blur' }],
          supplierWay: [{ required: true, message: '请输入借款人名字', trigger: 'blur' }],
          userDepartment:[{ required: true, message: '请选择可共享的部门', trigger: 'blur' }],
          accountName:[{ required: true, message: '请输入汇款户名', trigger: 'blur' }],
          openingBank:[{ required: true, message: '请输入开户行', trigger: 'blur' }],
          account:[{ required: true, message: '请输入账号', trigger: 'blur' }]
        },
        visibles:[{//公司可见选择器
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        state:[{
        	value:'0',
        	label:'等待审核'
        },{
        	value:'1',
        	label:'正常'
        },{
        	value:'2',
        	label:'停用'
        },],
        borrowingType:[],//供应商类别
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
        fileList: [{//申请无收入借款中附件信息
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
         }, {
          name: 'food2.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
         }],
         sid:0,
      }
    },
    methods:{
      handleClick(row) {//表格查看编辑
        console.log(row);
      },
      //分页
      handleSizeChange(page) {
        this.currentPage = 1;
        this.pagesize = page;
        this.queryList();
      },
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage;
        this.queryList();
      },
      //查询表格
      queryList(){
        var that = this
        this.$http.post(
          this.GLOBAL.serverSrc + "/universal/supplier/api/supplierpage",
          {
            "object": {
              "isDeleted": 0,
            },
            "pageSize":this.pagesize,
            "pageIndex": this.currentPage,
            "isGetAll": true,
            "id": 0
          },)
          .then(function (obj) {
            that.total = obj.data.total
            that.tableData = obj.data.objects
            that.tableData.forEach(function (v,k,arr) {
              let types='';
              for(let i=0;i< arr[k].types.length;i++){
                 types+=arr[k].types[i].supplierTypeEX;
                 if(i!=arr[k].types.length-1){
                  types+=','
                 }
              }
              arr[k]['supplierType']=types;

              if(arr[k]['userState'] == 0){
                arr[k]['userState'] = '等待审核'
              }else if(arr[k]['userState'] == 1) {
                arr[k]['userState'] = '正常'
              }else if(arr[k]['userState'] == 2) {
                arr[k]['userState'] = '停用'
              }
              
            })
            console.log(obj.data.objects)
          })
          .catch(function (obj) {
            console.log(obj)
          })
      },
      //查询银行表格
      banklist(){
      	var that = this
        this.$http.post(
          this.GLOBAL.serverSrc + "/universal/supplier/api/banklist",
          {
            "object": {
              "supplierID":this.sid,
            }
          },)
          .then(function (obj) {
            that.total = obj.data.total
            that.tableDataBank = obj.data.objects
            console.log(obj.data.objects)
          })
          .catch(function (obj) {
            console.log(obj)
          })
      },
      //清空表单
      emptyForm(){
      	this.ruleForm_01.accountName = "",
      	this.ruleForm_01.openingBank = "",
      	this.ruleForm_01.account = "",
      	this.ruleForm_01.note = ""
      },
      //添加银行账户
      addBank(){

      },
      //供应商类型
      themeList(){
	      this.borrowingType = [];
	      this.$http.post(this.GLOBAL.serverSrc + '/universal/suppliertype/api/get', {}).then(res => {
	        for (let i = 0; i < res.data.objects.length; i++) {
	          this.borrowingType.push({
	            "value": res.data.objects[i].id,
	            "label": res.data.objects[i].name
	          })
	        }
	      })
	      .then(res =>{
	        this.borrowingType =  res.data.objects;
	      }).catch(function(err){
	        console.log(err);
	      })
       },
      //点击添加显示弹窗
      addSupplier(){
        this.supplierShow = true;
        //this.banklist();
        this.clear();
      },
      cancelAddSupplier(){//关闭添加弹窗
        this.supplierShow = false;
        this.clear();
      },
      clear(){//取消弹窗文本框清空
      	this.ruleForm.name = "";
	      this.ruleForm.visible = "";
	      this.ruleForm.supplierState = "";
	      this.ruleForm.supplierType = "";
	      this.ruleForm.supplierWay = "";
	      this.ruleForm.userDepartment = "";
	      this.ruleForm.orientation = "";
	      this.ruleForm.expireData = "";
	      this.ruleForm.supplierUpload = "";
	      this.ruleForm.legalPerson = "";
	      this.ruleForm.pactNumber = "";
	      this.ruleForm.handlers = "";
	      this.ruleForm.handlersPhone = "";
	      this.ruleForm.principal = "";
	      this.ruleForm.principalPhone = "";
	      this.ruleForm.operator = "";
	      this.ruleForm.agreement = "";
	      this.ruleForm.remark = "";
      },
      //搜索重置
      reset(){
        this.ruleForm.supplierName = "",
        this.ruleForm.supplierCard = "",
        this.ruleForm.settlement = "",
        this.ruleForm.condition = "",
        this.ruleForm.category = "",
        this.ruleForm.visibleArea = ""
      },
    },
    
    mounted(){
      this.queryList();
    },
    created(){
      this.themeList();//供应商类别
    },
 
  }
</script>

<style scoped lang='stylus'>
  .supplierList{width:1140px;}
  .tableData{width:1140px; margin:20px 0 0 0;}
  /*表格操作*/
  .table_details{float:left; margin:0 0 0 5px; color:#000;}
  .table_line{float:left; margin:3px 10px 0 10px;}
  .table_editor{float:left;}
  /*分页*/
  .pageList{float:right; margin:30px 0 30px 0;}
  /*添加弹窗*/
  .basic{font-size:12pt;}
  .name_input{width:200px;}
  
  .upload-demo{width: 200px;}
  .upload-demo>>>.el-upload-list__item{clear:both; margin:10px 0 0 0; width:100%;}

  /*银行表格*/
  .tableDataBank{width:810px;margin:15px 0 0 50px;overflow:hidden;}
  .balk_details{float:left; margin:0 0 0 50px; color:#000;}
</style>
