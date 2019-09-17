<template>
  <div>
    <div style="border: 1px solid rgb(241, 241, 241); margin-left: 50px;width: 1009px" >
      <!--<div class="select_button">-->
      <!--<el-button v-for="(item, index) in domains"-->
      <!--:key="item.key"-->
      <!--@click="clickHand(index)"-->
      <!--plain-->
      <!--&gt;{{item.value}}</el-button>-->
      <!--</div>-->
      <div>
        <el-dialog
          style="text-align: left"
          title="提示"
          :visible.sync="dialogVisible"
          width="30%"
        >
          <div style="text-align: center">
            <span>产品类型：</span>
            <el-select v-model="about" placeholder="请选择">
              <el-option
                v-for="item in options1"
                :key="item.value1"
                :label="item.label"
                :value="item.value1">
              </el-option>
            </el-select>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="routerHandle()">确 定</el-button>
          </span>
        </el-dialog>
      </div>
      <div style="width: 1200px; height: 223px; margin-left: 20px">
        <div class="select_two">
          <div class="id">ID <el-input v-model="productId" style="width: 205px;margin-left: 20px;"  placeholder="请输入内容"></el-input></div>
          <div class="product">商品名称   <el-input  v-model="productTitle" style="width: 500px; margin-left: 10px;"  placeholder="请输入内容"></el-input></div>
        </div>
        <div class="select_two">
          <div class="address">出发地
            <!-- <el-input v-model="productPos" style="width: 205px;margin-left: 20px;"  placeholder="请输入内容"></el-input> -->
            <el-autocomplete class="inline-input" style="width: 205px;margin-left: 20px;" v-model="originPlace" :fetch-suggestions="querySearch3" placeholder="请输入内容" :trigger-on-focus="false" @select="departure"></el-autocomplete>
          </div>
          <div class="name">目的地
            <!-- <el-input   v-model="productMod" style="width: 200px; margin-left: 10px;"  placeholder="请输入内容"></el-input> -->
            <el-autocomplete class="inline-input" style="width: 205px;margin-left: 10px;" v-model="originMod" :fetch-suggestions="querySearch4" placeholder="请输入内容" :trigger-on-focus="false" @select="departure1"></el-autocomplete>
          </div>
          <div class="options">产品操作人 <el-input  v-model="productUser" style="width: 150px; margin-left: 10px;"  placeholder="请输入内容"></el-input></div>
        </div>
        <div class="select_two">
          <div class="options11">状态
            <el-select  style="width: 205px;margin-left: 20px;" v-model="value" placeholder="请选择">
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="prices">价格<el-input  v-model="productPrefix" style="width: 104px; margin-left: 20px;"  placeholder="请输入内容"></el-input><span style="margin-left: 10px">——</span><el-input  v-model="productBehind" style="width: 104px; margin-left: 20px;"  placeholder="请输入内容"></el-input></div>
        </div>

        <div class="select_two_button">
          <el-button type="primary" @click="searchHand()" size="medium">搜索</el-button>
          <el-button type="primary" @click="reset()" size="medium">重置</el-button>
        </div>

      </div>
    </div>
    <el-button type="primary" @click="routerHandle" style="margin-top: 10px;margin-left: 50px;">添加产品</el-button>
    <div style="border: 1px solid #e9eaea;  margin-bottom:100px; margin-top: 30px; margin-left: 50px; width: 62.5%" >
      <div class="button_select">
        <el-button @click=handDb plain :disabled="reable">编辑</el-button>
        <el-button plain :disabled="reable">复制</el-button>
        <el-button plain :disabled="reable">导出行程</el-button>
        <el-button plain :disabled="reable">退改</el-button>
        <el-button plain @click = "groupStage" :disabled="reable">团期/库存</el-button>
        <el-button @click=handInfo plain :disabled="reable">修改行程信息</el-button>
        <el-button type="danger" plain :disabled="reable" @click="handleDelete">删除</el-button>

      </div>

      <div class="table_trip" style="margin-left: 50px; width: 92%;">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          :highlight-current-row="true"
          @row-click="clickBanle"
        >
          <el-table-column
            prop="id"
            label="产品编号"
            align="center"
            width="80%"
          >
          </el-table-column>
          <el-table-column
            prop="type"
            label="类型"
            width="150%"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="name"
            label="产品名称"
            align="center"
          >
            <!-- <template slot-scope="scope">
                <el-button type="text" >{{tableData[scope.$index].name}}</el-button>
            </template> -->
          </el-table-column>
          <el-table-column
            prop="mu_address"
            label="目的地"
            align="center"
            width="120%"
          >
          </el-table-column>
          <el-table-column
            prop="options"
            label="操作人"
            align="center"
            width="100%"
          >
          </el-table-column>
          <el-table-column
            label="状态"
            align="center"
            width="110%"
          >
            <template slot-scope="scope">
              <el-button type="success"  size="mini">已上架</el-button>
            </template>
          </el-table-column>
          <el-table-column
            cell-style
            prop="opers"
            label="推送平台"
            align="center"
            width="110%">
            <template slot-scope="scope">
              <div style="color: #f5a142" >{{tableData[scope.$index].opers}}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="price"
            label="价格"
            align="center"
            width="80%"
          >
          </el-table-column>
        </el-table>

      </div>

      <!--分页-->
      <div class="block" style="margin-top: 30px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage4"
          :page-sizes="[5, 10, 50, 100]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total=total>
        </el-pagination>
      </div>
      <!--分页-->
    </div>
    <!--<div style="-->
    <!--text-align: left;-->
    <!--margin-left: 50px;-->
    <!--margin-bottom: 20px;">-->
    <!--<el-button type="primary"  @click="dialogVisible = true" >添加产品</el-button>-->
    <!--</div>-->
    <el-dialog  :close-on-click-modal="false" class="merchandise" :visible.sync="merchandise"   :show-close="false" append-to-body width="77%">
      <div style="float: left; margin-bottom: 20px; margin-left: 40% ;">
        <el-radio-group v-model="isCollapse"  @change="qqq">
          <el-radio-button  class="group" :label="true">库存</el-radio-button>
          <el-radio-button :label="false">价格</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 库存 -->
      <div v-if="isCollapse==true">
        <div class="ButtonCls"><el-button   @click="BandCancel">取消</el-button><el-button  type="primary"  @click="BandSave">保存</el-button></div>



        <!-- sku -->

        <el-table
          v-show="skuList"
          :data="ccc"
          border
          style="width: 1340px;margin:30px auto;"
          :header-cell-style="getRowClass">
          <el-table-column
            prop="id"
            label="ID"
            width="100"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="ddd"
            label="名称"
            width="180"
            align="center"
          >


          </el-table-column>
          <el-table-column
            align="center"
            label="前缀-团号-后缀">
            <template slot-scope="scope">
              <el-input :maxlength="10"  v-model="ccc[scope.$index].codePrefix" :style="isInfo ? 'border: solid 1px #f56c6c;width:100px;' : 'width:100px;'" @blur="fucking" ></el-input>
              <span >-</span>
              <span v-text="'{{'"></span>
              <span >日期</span>

              <span >}}</span>
              <span >-</span>
              <el-input :maxlength="10"  v-model="ccc[scope.$index].codeSuffix"  :style="isInfo ? 'border: solid 1px #f56c6c;width:100px;' : 'width:100px;'" @blur="fucking"></el-input>

            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="180"
            label="清位时间">
            <template slot-scope="scope">
              <span style="margin-right:5px">前</span>
              <el-input :maxlength="3"  v-model="ccc[scope.$index].uptoDay" style="width:60px"></el-input>
              <span style="margin-left:10px">天</span>
              <!-- <el-input style="width:40px"></el-input><span style="margin-left:10px">时</span> -->
              <!-- <el-input style="width:40px"></el-input><span style="margin-left:10px">分</span> -->

            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="180"
            label="出行模板">
            <template slot-scope="scope">
              <el-select v-model="ccc[scope.$index].value" placeholder="请选择">
                <el-option
                  v-for="item in type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            align="center"
            label="操作"
            width="300">
            <template slot-scope="scope">
              <template v-if="ccc[scope.$index].type == false">
                <el-button size="mini" type="primary"  @click="online(scope.$index)">上线</el-button>
              </template>
              <template v-else>
                <el-button size="mini" type="primary"  @click="offline(scope.$index)">下线</el-button>
              </template>
              <el-button size="mini" type="primary" @click="bandlePrice(scope.$index)">价格</el-button>
              <el-button size="mini" type="primary" @click="basicPrice(ccc[scope.$index].id,ccc[scope.$index].rate)">成本</el-button>

              <!-- <el-button size="mini" type="danger" @click="delSku(scope.$index)">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>

        <!--成本-->
        <el-dialog
          title="成本"
          :visible.sync="basicbutton"
          width="50%"
          append-to-body>
          <div>
            <el-button  type="primary" @click="addcost">添加</el-button>
            <el-button type="primary" @click="editorcb">编辑</el-button>
            <el-button  type="danger" @click="delcb">删除</el-button>
          </div>
          <div style="margin-top: 30px">
            <div style="float: left; margin-top: 10px">毛利率：</div>
            <div style="float: left;margin-left: 10px"><el-input v-model="lilv" placeholder="利率" style="width: 70px" @blur="changinpt"></el-input>%</div>
            <div style="margin-top: 10px;float: left;margin-left: 30px;">人均结算价({{count}})</div>
          </div>
          <div style="margin-top: 100px">
            <el-table ref="multipleTable12":data="tableData12"tooltip-effect="dark"style="width: 100%"@selection-change="handleSelectionChange"@select="changselet">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column label="序号" width="120">
                <template slot-scope="scope">{{ scope.row.id }}</template>
              </el-table-column>
              <el-table-column prop="supplierTypeEX" label="成本类型"
                width="120">
              </el-table-column>
              <el-table-column
                prop="name"
                label="供应商"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="money"
                label="金额"
                show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </div>


        </el-dialog>
        <!--添加-->
        <el-dialog title="提示" :visible.sync="cost" width="40%" append-to-body>
          <el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1" label-width="100px" class="demo-ruleForm">
            <!-- <el-form-item label="供应商" prop="region">
              <el-select v-model="ruleForm1.region" placeholder="请选择" @change="changys">
                <el-option v-for="item in options2":key="item.value":label="item.label":value="item.value"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="供应商" prop="region">
              <el-autocomplete v-model="ruleForm1.region" :fetch-suggestions="querySearch5"placeholder="请输入供应商" :trigger-on-focus="false"@select="departure" style="width: 200px"></el-autocomplete>
            </el-form-item>
            <el-form-item label="成本类型" prop="costType">
              <el-select v-model="ruleForm1.costType" placeholder="请选择" style="width: 200px">
                <el-option v-for="item in borrowingType" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
             </el-form-item>
            <el-form-item label="金额" prop="name">
              <el-input v-model="ruleForm1.name" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button v-if="this.chengben.length == 0" type="primary" @click="submitForm1('ruleForm1')">添加</el-button>
              <el-button  v-else type="primary" @click="submitForm2('ruleForm1')">修改</el-button>
              <el-button @click="resetForm1('ruleForm1')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
      <!-- 价格 -->
      <div v-else style="overflow:hidden;margin-top: 60px;">
        <DateList   v-on:merchandises="headCall"  :msg-father="ccc" :piapia="piaid" :codePrefix="codePrefix" :codeSuffix="codeSuffix"/>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import DateList from '../component/DateList'
  import scenicOrTicketList from '@/page/productManagement/productList/tab/scenicOrTicketList'

  export default {
    components:{
      DateList,
      scenicOrTicketList

    },
    data() {
      return {
        activeName: 'first',
        ruleForm1: {
          //金额
          name: '',
          //供应商
          region: '',
          //供应商
          region1: '',
          //供应商类型
          costType: '',
          //供应商类型中文
          supplierTypeEX:'',
          //供应商id
          supplierID:''
        },
        options2: [{
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
        options3: [],//成本类型
        value2: '',
        rules1: {
          name: [{ required: true, message: '请输入金额', trigger: 'change' }, 
                 {pattern: /^[+]{0,1}(\d+)$/, message: '金额需为正整数' }],
          region: [{ required: true, message: '请选择供应商名称', trigger: 'change' }],
          costType:[{ required: true, message: '请选择成本类型', trigger: 'change' }],
        },
        cost:false,
        tableData12: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        multipleSelection12: [],
        count:'5778.78',
        lilv:'',
        basicbutton:false,
        isInfo:false,
        productId:'',
        productTitle:'',
        productPos:'',
        originPlace:'',//出发地
        productMod:'',
        originMod:'',//目的地
        productUser:'',
        productPrefix:'',
        productBehind:'',
        pageNum:1,
        codePrefix:"",
        codeSuffix:'',
        pagesize:10,
        total:0,
        reable:true,
        fid:0,
        buttonlist:[],
        pid:'',
        domains: [{
          value: '跟团游',
          status:"false"
        },{
          value: '景区/票务',
          status:"false"
        }/*,{
         value: '自由行',
         status:"false"
         },{
         value: '签证',
         status:"false"
         },{
         value: '机票',
         status:"false"
         },{
         value: '酒店',
         status:"false"
         },{
         value: '门票',
         status:"false"
         },{
         value: 'WiFi',
         status:"false"
         },{
         value: '电话卡',
         status:"false"
         },{
         value: '交通',
         status:"false"
         },{
         value: '保险',
         status:"false"
         }*/],
        thisClass:'',
        options1: [{
          value1: '1',
          label: '跟团游'
        }, {
          value1: '2',
          label: '自由行'
        }, {
          value1: '3',
          label: '景区/票务'
        }],
        typeList:[{//状态搜索
          value:'0',
          label:'未上架'
        },{
          value:'1',
          label:'erp上架'
        },{
          value:'2',
          label:'线上上架'
        },{
          value:'3',
          label:'全部'
        },],
        about:'',
        dialogVisible: false,
        currentPage1: 5,
        currentPage2: 5,
        currentPage3: 5,
        currentPage4: 1,

        merchandise: false,
        isCollapse: true,
        aaa:0,
        di:0,
        wc:'',
        listId:'',
        io:0,
        lm:'',
        // 属性按钮禁用
        forbidden:true,
        // 属性按钮选中效果
        mm:true,
        // 添加值按钮
        pp:true,
        // 确认属性值按钮
        qq:false,
        // 输入框隐藏
        aa:true,
        //输入框变为按钮
        bb:false,
        // 重新设计属性
        again:false,
        // 关闭添加属性按钮
        close:false,
        // 属性按钮选择
        select:false,
        // 生成sku按钮
        addsku:false,
        // sku列表
        skuList:true,
        // 显示sku的数组
        ccc:[],
        // sku的id
        skuid : 0,
        // 属相按钮的禁用
        xianshi:false,
        // 禁用时,未被禁用的按钮的key值数组
        arr:[],
        // 添加增值(整个大块)
        accretion:true,
        // 添加增值(弹框)
        accretionBall:false,
        // 增值服务(表格)
        accretionTable:true,
        // 增值表单
        ruleForm:{
          name:'',
          priceSelect:'',
          explain:'',
        },
        // 增值服务数组
        Addprice:[{
          id:1,
          name:"保险",
          priceSelect:"非日历价格",
          explain:"保护安全",
          type:false,
        },{
          id:2,
          name:"小费",
          priceSelect:"日历价格",
          explain:"给小费鼓励一下吧",
          type:false,
        }],
        // 增值服务的id
        AddpriceId:0,
        // 增值服务的验证
        rules:{
          name:[
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { max: 20, message: '不超过20个汉字', trigger: 'blur' }
          ],
          priceSelect: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          explain: [
            { required: true, message: '请填写活动形式', trigger: 'blur' },
            { max: 50, message: '不超过50个汉字', trigger: 'blur' }

          ]
        },
        // 上线
        Online:true,
        // 下线
        Offline:false,
        // 判断属性输入属性值不为空
        shuxingz:[],
        // 按钮列表
        buttonList: [
          // pp 是开关
          // forbidden 禁用按钮
          {
            id: "0",
            button: "出发地",
            pp : false,
            //每个按钮的验证v-model
            forbidden:false,
            verifier:" Origin",
          },
          {
            id: "1",
            button: "行程路线",
            pp : false,
            forbidden:false,
            verifier: "Route",
          },
          {
            id: "2",
            button: "天数",
            pp : false,
            forbidden:false,
            verifier: "Day",
          },
          {
            id: "3",
            button: "晚数",
            pp : false,
            forbidden:false,
            verifier: "NightNum",
          },
          {
            id: "4",
            button: "房型",
            pp : false,
            forbidden:false,
            verifier: "House",
          },
          {
            id: "5",
            button: "住宿等级",
            pp : false,
            forbidden:false,
            verifier: "Accommodation",
          },
          {
            id: "6",
            button: "航空公司",
            pp : false,
            forbidden:false,
            verifier: "Airline",
          },
          {
            id: "7",
            button: "酒店名称",
            pp : false,
            forbidden:false,
            verifier: "HotelName",
          },
          {
            id: "8",
            button: "套餐类型",
            pp : false,
            forbidden:false,
            verifier: "SetMeal",
          }
        ],
        // 天数选择
        Day: [{
          value: '2天',
          label: '2天'
        }, {
          value: '3天',
          label: '3天'
        }, {
          value: '4天',
          label: '4天'
        }, {
          value: '5天',
          label: '5天'
        }, {
          value: '6天',
          label: '6天'
        },{
          value: '7天',
          label: '7天'
        }, {
          value: '8天',
          label: '8天'
        }, {
          value: '9天',
          label: '9天'
        }, {
          value: '10天',
          label: '10天'
        }, {
          value: '11天',
          label: '11天'
        },{
          value: '12天',
          label: '12天'
        },{
          value: '13天',
          label: '13天'
        }, {
          value: '14天',
          label: '14天'
        }, {
          value: '15天',
          label: '15天'
        }, {
          value: '16天',
          label: '16天'
        }],
        // 晚数列表
        NightNum: [{
          value: '1晚',
          label: '1晚'
        },{
          value: '2晚',
          label: '2晚'
        }, {
          value: '3晚',
          label: '3晚'
        }, {
          value: '4晚',
          label: '4晚'
        }, {
          value: '5晚',
          label: '5晚'
        }, {
          value: '6晚',
          label: '6晚'
        },{
          value: '7晚',
          label: '7晚'
        }, {
          value: '8晚',
          label: '8晚'
        }, {
          value: '9晚',
          label: '9晚'
        }, {
          value: '10晚',
          label: '10晚'
        }, {
          value: '11晚',
          label: '11晚'
        },{
          value: '12晚',
          label: '12晚'
        },{
          value: '13晚',
          label: '13晚'
        }, {
          value: '14晚',
          label: '14晚'
        }, {
          value: '15晚',
          label: '15晚'
        }],
        // 住宿等级
        Accommodation :[{
          value: '豪华型',
          label: '豪华型'
        },{
          value: '高档型',
          label: '高档型'
        }, {
          value: '舒适型',
          label: '舒适型'
        }, {
          value: '经济型',
          label: '经济型'
        }, {
          value: '快捷连锁',
          label: '快捷连锁'
        }, {
          value: '民俗',
          label: '民俗'
        },{
          value: '农家乐',
          label: '农家乐'
        }
        ],
        // 列表数组
        addtable: [],
        // sku数组
        sku:[],
        options: [{
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
        type: [],
        value: '',
        piaid:'',
        tableData: [],
        // 属性输入框
        price:[],
        abc: false,
        array1:'',
        team:'',
        chengben:[],
        supplier_id:0,

      }
    },
    methods: {
      //供应商模糊查询
      querySearch5(queryString3, cb) {
        this.tableData2 = []
        this.$http.post(this.GLOBAL.serverSrc + '/universal/supplier/api/supplierlist', {
          "object": {
            name: queryString3,
            UserState:-1,
          SupplierType:-1,
          }
        }).then(res => {
          for (let i = 0; i < res.data.objects.length; i++) {
            this.tableData2.push({
              "value": res.data.objects[i].name,
              "id": res.data.objects[i].id,
              "supplierType": res.data.objects[i].supplierType
            })
            this.supplier_id = res.data.objects[i].id ? res.data.objects[i].id : 0;
          }
          var results = queryString3 ? this.tableData2.filter(this.createFilter(queryString3)) : [];
          cb(results)
        }).catch(err => {
          //console.log(err);
        })
      },
      createFilter(queryString1){
        return (restaurant) => {
          return (restaurant.value);
        }
      },
      departure(item){
        console.log(item)
        // this.productPos = item.id;
        // this.originPlace = item.value;
      },
      //成本类型
      themeList(){
        this.borrowingType = [];
        this.$http.post('http://test.dayuntong.com/universal/supplier/api/dictionaryget?enumname=SupplierType')
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
        })
      
      },
      handleClick(tab, event) {
//          console.log(tab, event);
      },
      changselet(selection, row){
        this.chengben = selection

      },
      changinpt(){
        this.$http.post(this.GLOBAL.serverSrc + '/team/cost/api/saverate', {
          "object": {
            "id": this.team,
            "rate": this.lilv,
          }
        }).then(res => {
          this.ccc = []
          var that = this
          this.$http.post(
            this.GLOBAL.serverSrc + "/team/api/teampackagelist",
            {
              "object": {
                "teamID": this.pid,
              }
            },
            {
              headers:{
                'Authorization': 'Bearer ' + localStorage.getItem('token')
              }
            }
          )
            .then(function (obj) {
              /*

               */

              for (let i = 0; i < obj.data.objects.length; i++){
                /* console.log(obj.data.objects[0].id)*/

                that.ccc.push({
                  id:obj.data.objects[i].id,
                  ddd:obj.data.objects[i].name,
                  uptoDay:obj.data.objects[i].uptoDay,
                  value:obj.data.objects[i].templateID,
                  codePrefix:obj.data.objects[i].codePrefix,
                  codeSuffix:obj.data.objects[i].codeSuffix,
                  createTime:obj.data.objects[i].createTime,
                  type:false,
                  rate:obj.data.objects[i].rate
                })
                if(that.ccc[i].value == 0){
                  that.ccc[i].value = ""
                }

              }
              console.log(obj.data)
            })
            .catch(function (obj) {
              console.log(obj)
            })
        })

      },
      changys(res){
        console.log(res)
        this.ruleForm1.region1 = res.substring(res.indexOf("+")+1,res.indexOf("-"))
        this.ruleForm1.supplierID = res.substring(res.indexOf("|")+1,res.indexOf("+"))
        this.ruleForm1.costType =res.substring(res.indexOf("-")+1,res.indexOf("*"))
        this.ruleForm1.supplierTypeEX =res.slice(res.indexOf("*")+1)

        /*this.ruleForm1.costType = res.slice(res.indexOf("-")+1)*/
        /*   //供应商id
         console.log( res.substring(res.indexOf("|")+1,res.indexOf("+")))
         //供应商名称
         console.log( res.substring(res.indexOf("+")+1,res.indexOf("-")))
         //类型cn
         console.log(  res.substring(res.indexOf("-")+1,res.indexOf("*")))
         //类型ty
         console.log(  res.slice(res.indexOf("*")+1))*/
      },
      submitForm1(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post(this.GLOBAL.serverSrc + '/team/cost/api/insert', {
              "object": {
                "id": 0,
                "createTime": 0,
                "code": "string",
                "createUser": "string",
                "packageID": this.team,
                //"supplierID": this.ruleForm1.supplierID,
                "supplierID":this.supplier_id,
                //"name": this.ruleForm1.region1,
                "name":this.ruleForm1.region,
                //"supplierType": this.ruleForm1.supplierTypeEX,
                "suppliertype":this.ruleForm1.costType,
                "money": this.ruleForm1.name
              }
            }).then(res => {
              this.$http.post(this.GLOBAL.serverSrc + '/team/cost/api/list', {
                "object": {
                  "packageID": this.team,
                }
              }).then(res => {
                this.tableData12 = res.data.objects
                this.tableData12.forEach(function (v,k,arr) {
                  if(arr[k]['suppliertype'] == 0){
                    arr[k]['suppliertype'] = '船票'
                  }else if(arr[k]['suppliertype'] == 1) {
                    arr[k]['suppliertype'] = '地接社'
                  }else if(arr[k]['suppliertype'] == 2) {
                    arr[k]['suppliertype'] = '机票'
                  }else if(arr[k]['suppliertype'] == 3) {
                    arr[k]['suppliertype'] = '拼票'
                  }else if(arr[k]['suppliertype'] == 4) {
                    arr[k]['suppliertype'] = '酒店'
                  }else if(arr[k]['suppliertype'] == 5) {
                    arr[k]['suppliertype'] = '签证'
                  }else if(arr[k]['suppliertype'] == 6) {
                    arr[k]['suppliertype'] = '合作拼团社'
                  }else if(arr[k]['suppliertype'] == 7) {
                    arr[k]['suppliertype'] = '游轮'
                  }else if(arr[k]['suppliertype'] == 8) {
                    arr[k]['suppliertype'] = '火车票'
                  }else if(arr[k]['suppliertype'] == 9) {
                    arr[k]['suppliertype'] = '汽车票'
                  }
              
                })
              })
              this.cost = false
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitForm2(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post(this.GLOBAL.serverSrc + '/team/cost/api/save', {
              "object": {
                // "supplierID": this.ruleForm1.supplierID,
                // "name": this.ruleForm1.region1,
                // "supplierType": this.ruleForm1.supplierTypeEX,
                // "money": this.ruleForm1.name
                "id": this.chengben[0].id,
                "createTime": 0,
                "code": "string",
                "createUser": "string",
                "packageID": this.team,
                "supplierID":this.supplier_id,
                "name":this.ruleForm1.region,
                "suppliertype":this.ruleForm1.supplierType,
                "money": this.ruleForm1.name

              }
            }).then(res => {
              this.$http.post(this.GLOBAL.serverSrc + '/team/cost/api/list', {
                "object": {
                  "packageID": this.team,
                }
              }).then(res => {
                this.tableData12 = res.data.objects
                this.tableData12.forEach(function (v,k,arr) {
                  if(arr[k]['suppliertype'] == 0){
                    arr[k]['suppliertype'] = '船票'
                  }else if(arr[k]['suppliertype'] == 1) {
                    arr[k]['suppliertype'] = '地接社'
                  }else if(arr[k]['suppliertype'] == 2) {
                    arr[k]['suppliertype'] = '机票'
                  }else if(arr[k]['suppliertype'] == 3) {
                    arr[k]['suppliertype'] = '拼票'
                  }else if(arr[k]['suppliertype'] == 4) {
                    arr[k]['suppliertype'] = '酒店'
                  }else if(arr[k]['suppliertype'] == 5) {
                    arr[k]['suppliertype'] = '签证'
                  }else if(arr[k]['suppliertype'] == 6) {
                    arr[k]['suppliertype'] = '合作拼团社'
                  }else if(arr[k]['suppliertype'] == 7) {
                    arr[k]['suppliertype'] = '游轮'
                  }else if(arr[k]['suppliertype'] == 8) {
                    arr[k]['suppliertype'] = '火车票'
                  }else if(arr[k]['suppliertype'] == 9) {
                    arr[k]['suppliertype'] = '汽车票'
                  }
              
                })
              })
              this.cost = false
            })
          } else {
            console.log(123123)
          }
        });
      },
      resetForm1(formName) {
        this.$refs[formName].resetFields();
      },
      editorcb(){
        var arry = [];
        var arry1 = [];
        var that = this
        this.$http.post(
          this.GLOBAL.serverSrc + "/universal/supplier/api/supplierpage",
          {
            "object": {
              "isDeleted": 0,
            },
            "pageSize":1000,
            "pageIndex": 1,
            "isGetAll": true,
            "id": 0
          },)
          .then(function (obj) {
            for (var j = 0; j<obj.data.objects.length;j++){
              arry1.push(obj.data.objects[j])
              arry1[j].label = arry1[j].name
              arry1[j].value = "|"+ arry1[j].id+"+"+arry1[j].name +"-"+ arry1[j].types[0].supplierTypeEX +"*"+ arry1[j].types[0]. supplierType
            }
            that.options2 = arry1

          })

        // this.$http.post(this.GLOBAL.serverSrc + '/universal/suppliertype/api/get', {
        // }).then(res => {

        //   for (var i = 0; i<res.data.objects.length;i++){
        //     arry.push(res.data.objects[i])
        //     arry[i].label = arry[i].name
        //     arry[i].value = arry[i].id
        //   }
        //   this.options3 = arry

        // })
        /* console.log(this.chengben[0].id)*/
        this.$http.post(this.GLOBAL.serverSrc + '/team/cost/api/get', {
          "id": this.chengben[0].id
        }).then(res => {
          console.log(res.data.object)
          this.cost = true
          this.ruleForm1.region = res.data.object.name
          this.ruleForm1.costType = res.data.object.supplierTypeEX
          this.ruleForm1.name = res.data.object.money
        })

      },
      delcb(){
        for (var i=0;i<this.chengben.length; i++){
          this.$http.post(this.GLOBAL.serverSrc + '/team/cost/api/delete', {
            "id": this.chengben[i].id
          }).then(res => {
          })
        }
        this.$confirm("确认删除?", "提示", {
           confirmButtonText: "确定",
           cancelButtonText: "取消",
           type: "warning"
        }).then(res => {
          if(res.data.isSuccess == true){
             this.$message.success("删除成功");
             this.$http.post(this.GLOBAL.serverSrc + '/team/cost/api/list', {
                "object": {
                  "packageID": this.team,
                }
              }).then(res => {
                this.tableData12 = res.data.objects
                this.tableData12.forEach(function (v,k,arr) {
                  if(arr[k]['suppliertype'] == 0){
                    arr[k]['suppliertype'] = '船票'
                  }else if(arr[k]['suppliertype'] == 1) {
                    arr[k]['suppliertype'] = '地接社'
                  }else if(arr[k]['suppliertype'] == 2) {
                    arr[k]['suppliertype'] = '机票'
                  }else if(arr[k]['suppliertype'] == 3) {
                    arr[k]['suppliertype'] = '拼票'
                  }else if(arr[k]['suppliertype'] == 4) {
                    arr[k]['suppliertype'] = '酒店'
                  }else if(arr[k]['suppliertype'] == 5) {
                    arr[k]['suppliertype'] = '签证'
                  }else if(arr[k]['suppliertype'] == 6) {
                    arr[k]['suppliertype'] = '合作拼团社'
                  }else if(arr[k]['suppliertype'] == 7) {
                    arr[k]['suppliertype'] = '游轮'
                  }else if(arr[k]['suppliertype'] == 8) {
                    arr[k]['suppliertype'] = '火车票'
                  }else if(arr[k]['suppliertype'] == 9) {
                    arr[k]['suppliertype'] = '汽车票'
                  }
              
                })
              })
             //this.basicbutton = false
             //this.chengben = []
            }
         })
        // this.$message({
        //   message: '删除成功',
        //   type: 'success'
        // });
        // this.basicbutton = false
        // this.chengben = []
      },
      addcost(){
        console.log(this.chengben)
        var arry = [];
        var arry1 = [];
        var that = this
        this.$http.post(
          this.GLOBAL.serverSrc + "/universal/supplier/api/supplierpage",
          {
            "object": {
              "isDeleted": 0,
            },
            "pageSize":1000,
            "pageIndex": 1,
            "isGetAll": true,
            "id": 0
          },)
          .then(function (obj) {
            for (var j = 0; j<obj.data.objects.length;j++){
              arry1.push(obj.data.objects[j])
              arry1[j].label = arry1[j].name
              arry1[j].value = "|"+ arry1[j].id+"+"+arry1[j].name +"-"+ arry1[j].types[0].supplierTypeEX +"*"+ arry1[j].types[0]. supplierType
            }
            that.options2 = arry1

          })

        // this.$http.post(this.GLOBAL.serverSrc + '/universal/suppliertype/api/get', {
        // }).then(res => {

        //   for (var i = 0; i<res.data.objects.length;i++){
        //     arry.push(res.data.objects[i])
        //     arry[i].label = arry[i].name
        //     arry[i].value = arry[i].id
        //   }
        //   this.options3 = arry

        // })

        this.cost = true
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      basicPrice(id,rate){
        this.basicbutton = true
        this.team = id
        this.lilv = rate
        console.log(rate)
        this.$http.post(this.GLOBAL.serverSrc + '/team/cost/api/list', {
          "object": {
            "packageID": this.team,
          }
        }).then(res => {
          this.tableData12 = res.data.objects
          this.tableData12.forEach(function (v,k,arr) {
            if(arr[k]['suppliertype'] == 0){
              arr[k]['suppliertype'] = '船票'
            }else if(arr[k]['suppliertype'] == 1) {
              arr[k]['suppliertype'] = '地接社'
            }else if(arr[k]['suppliertype'] == 2) {
              arr[k]['suppliertype'] = '机票'
            }else if(arr[k]['suppliertype'] == 3) {
              arr[k]['suppliertype'] = '拼票'
            }else if(arr[k]['suppliertype'] == 4) {
              arr[k]['suppliertype'] = '酒店'
            }else if(arr[k]['suppliertype'] == 5) {
              arr[k]['suppliertype'] = '签证'
            }else if(arr[k]['suppliertype'] == 6) {
              arr[k]['suppliertype'] = '合作拼团社'
            }else if(arr[k]['suppliertype'] == 7) {
              arr[k]['suppliertype'] = '游轮'
            }else if(arr[k]['suppliertype'] == 8) {
              arr[k]['suppliertype'] = '火车票'
            }else if(arr[k]['suppliertype'] == 9) {
              arr[k]['suppliertype'] = '汽车票'
            }
        
          })
        })
        this.$http.post(this.GLOBAL.serverSrc + '/team/cost/api/getaverage', {
          "id": this.team
        }).then(res => {
          this.count = res.data.average
        })


      },
      fucking(){
        for(let i = 0; i<this.ccc.length;i++) {
          if (this.ccc[i].codePrefix == this.ccc[i].codeSuffix) {
            this.isInfo = true
            this.$message.error('错了哦，团号不能重复');
            break;
          }else{
            this.isInfo = false
          }
        }
      },
      //出发地
      querySearch3(queryString1, cb) {
        this.vague = []
        this.$http.post(this.GLOBAL.serverSrc + '/universal/area/api/fuzzy', {
          "object": {
            areaName: queryString1
          }
        }).then(res => {
          for(let i=0;i<res.data.objects.length;i++){
            this.vague.push({
              "id":res.data.objects[i].id,
              "value" : res.data.objects[i].areaName
            })
          }
          var results = queryString1 ? this.vague.filter(this.createFilter(queryString1)) : [];
          cb(results)
        }).catch(err => {
          console.log(err);
        })
      },
      /*querySearch1(queryString1, cb1) {//搜索出发地方法
       var results1 = queryString1 ? this.tableData1.filter(this.createFilter(queryString1)) : [];
       cb1(results1);
       },*/
      createFilter(queryString1){
        return (restaurant) => {
          return (restaurant.value);
        }
      },
      departure(item){
        console.log(item)
        /*this.productPos = item.id;
         this.originPlace = item.value;*/
        this.productPos = item.id;
        this.originPlace = item.value;
      },
      //目的地
      querySearch4(queryString2, cb) {
        this.tableData1 = []
        this.$http.post(this.GLOBAL.serverSrc + '/universal/area/api/fuzzy', {
          "object": {
            areaName: queryString2
          }
        },{
          headers:{
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }).then(res => {
          for(let i=0;i<res.data.objects.length;i++){
            this.tableData1.push({
              "value" : res.data.objects[i].areaName,
              "id":res.data.objects[i].id
            })
          }
          var results = queryString2 ? this.tableData1.filter(this.createFilter(queryString2)) : [];
          cb(results)
        }).catch(err => {
          console.log(err);
        })
      },
      createFilter(queryString2){
        return (restaurant) => {
          return (restaurant.value);
        }
      },
      departure1(item){
        console.log(item)
        /*this.productPos = item.id;
         this.originPlace = item.value;*/
        this.productMod = item.id;
        this.originMod = item.value;
      },
      deleta(){
        this.$http.post(
          this.GLOBAL.serverSrc + "/team/api/teamdelete",
          {
            "id": that.pid
          }
        )
          .then(function (obj) {

          })
          .catch(function (obj) {

          })
      },
      reset(){//重置
        this.productId = '';
        this.productTitle = '';
        this.productPos = '';
        this.productMod = '';
        this.productUser = '';
        this.value = '';
        this.productPrefix = '';
        this.productBehind = '';
        this.originPlace = '';
        this.originMod = '';
      },
      handleDelete(){
        this.$confirm('此操作将删除该跟团游信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(this.tableData.length ==1){
            this.pageNum = this.pageNum - 1;
          }
          var that =  this;
          this.$http.post( this.GLOBAL.serverSrc + "/team/api/teamdelete", {
            "id": that.pid
          }).then(res => {
            var that = this
            this.$http.post(
              this.GLOBAL.serverSrc + "/team/api/teamsearch",
              {
                "pageIndex": this.pageNum,
                "pageSize": this.pagesize,
                "total": 0,
                "object": {
                  "loadPackage": true
                }
              },
              {
                headers:{
                  'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
              }
            )
              .then(function (obj) {
                console.log(obj.data.total);
                that.total = obj.data.total;
                that.tableData =obj.data.objects;
                that.tableData.forEach(function (v, k, arr) {
                  arr[k]['type'] = "跟团游"
                  arr[k]['name'] = obj.data.objects[k].title;
                  arr[k]['mu_address'] = obj.data.objects[k].destinations[0].destination
                  arr[k]['options'] = obj.data.objects[k].createUser
                  arr[k]['status'] = "1"
                  arr[k]['opers'] = "飞猪 携程"
                  arr[k]['price'] = obj.data.objects[k].refPrice
                })
              })
              .catch(function (obj) {
                console.log(obj)
              })
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(err => {
            console.log(err);
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        })
      },
      handDb(){
        this.$router.push({
          path: '/changepro',
          query: {
            id: this.pid
          }
        })
      },
      handInfo(){
        this.$router.push({
          path: '/changeinfo',
          query: {
            id: this.pid
          }
        })
      },


      bandlePrice(item){

        this.piaid = this.ccc[item].id;
        this.codePrefix = this.ccc[item].codePrefix;
        this.codeSuffix = this.ccc[item].codeSuffix;

        if(this.codePrefix == '' ||this.codeSuffix ==""){
          this.$message.error('错了哦，团号不能为空');
        }else{
          this.isCollapse = false;
        }
      },
      //库存修改
      inventorysave(){
        console.log(this.ccc)
        var that = this
        /* this.$http.post(
         this.GLOBAL.serverSrc + "/team/api/inventorysave",
         {
         "object": {
         "id": 0,
         "name": "string",
         "isDeleted": 0,
         "createTime": 0,
         "code": "string",
         "count": 0,
         "orgID": 0,
         "teamID": 0,
         "createUser": "string",
         "share": 0,
         "date": 0
         }
         },
         {
         headers:{
         'Authorization': 'Bearer ' + localStorage.getItem('token')
         }
         }
         )
         .then(function (obj) {

         })
         .catch(function (obj) {

         })*/
      },
      BandSave(){
        console.log(this.ccc)

        for(let i = 0; i<this.ccc.length;i++){
          var that = this
          this.$http.post(
            this.GLOBAL.serverSrc + "/team/package/saveshort",
            {
              "object":{
                "id": that.ccc[i].id,
                "loadPlan": true,
                "uptoDay": that.ccc[i].uptoDay,
                "templateID": that.ccc[i].value,
                "codePrefix": that.ccc[i].codePrefix,
                "codeSuffix": that.ccc[i].codeSuffix
              }
            },
            {
              headers:{
                'Authorization': 'Bearer ' + localStorage.getItem('token')
              }
            }
          )
            .then(function (obj) {

            })
            .catch(function (obj) {

            })



        }
        if(this.isInfo == false){
          this.merchandise = false;
        }


      },
      BandCancel(){
        this.merchandise = false;
        this.isCollapse = true
      },
      //搜索
      searchHand(){
        this.pageNum = 1;
        console.log(this.originMod)

        if (!this.productTitle){
          this.productTitle = ""
        }else{
          this.pageNum = 1;
        }
        if (!this.productUser){
          this.productUser = ""
        }else{
          this.pageNum = 1;
        }

        if (!this.productPos || !this.originPlace){
          this.productPos = 0
        }else{
          this.pageNum = 1;
        }
        if (!this.productMod || !this.originMod){
          this.productMod = 0
        }else{
          this.pageNum = 1;
        }

        var that = this
        this.$http.post(
          this.GLOBAL.serverSrc + "/team/api/teamsearch",
          {
            "pageIndex": this.pageNum,
            "pageSize": this.pagesize,
            "total": 0,
            "object": {
              "id": that.productId == '' ? 0 : that.productId,
              "title": that.productTitle,
              "createUser": that.productUser,
              "minPrice": that.productPrefix == '' ? 0 : that.productPrefix,
              "maxPrice": that.productBehind == '' ? 0 : that.productBehind,
              "podID": that.productPos,
              "destinationID": that.productMod
            }
          },
        )
          .then(function (obj) {
            that.total = obj.data.total;
            that.tableData =obj.data.objects;
            that.tableData.forEach(function (v, k, arr) {
              arr[k]['type'] = "跟团游"
              arr[k]['name'] = obj.data.objects[k].title;
              arr[k]['mu_address'] = obj.data.objects[k].destinations[0].destination
              arr[k]['options'] = obj.data.objects[k].createUser
              arr[k]['status'] = "1"
              arr[k]['opers'] = "飞猪 携程"
              arr[k]['price'] = obj.data.objects[k].refPrice
            })
          })
          .catch(function (obj) {
            console.log(obj)
          })

      },
      clickHand(index){
        console.log(this.domains)
        if( this.domains[index].status == "true"){
          this.domains[index].status = "false"
        }else{
          this.buttonlist.push(this.domains[index].value);
          this.domains[index].status = "true"
        }

      },
      routerHandle(){
        this.$router.push({path: "/listInfo"});
//        console.log(this.about);
//        if(this.about == ""){
//          this.$message({
//            showClose: true,
//            message: '请选择要添加的产品类型',
//            type: 'error'
//          });
//        }
//        this.about = 1;
//        if(this.about == 1){
//          this.$router.push({path: "listInfo"});
//        }
//        if(this.about == 3){
//          this.$router.push({path: "listInfoScenic"});
//        }

      },
      handleClick(row) {
        console.log(row);
      },
      handleSizeChange(val) {
    
        if (!this.productTitle){
          this.productTitle = ""
        }else{
          this.pageNum = 1;
        }
        if (!this.productUser){
          this.productUser = ""
        }else{
          this.pageNum = 1;
        }
        if (!this.productPos){
          this.productPos = 0
        }else{
          this.pageNum = 1;
        }
        if (!this.productMod){
          this.productMod = 0
        }else{
          this.pageNum = 1;
        }

        this.pagesize = val
        var that = this
        this.$http.post(
          this.GLOBAL.serverSrc + "/team/api/teamsearch",
          {
            "pageIndex": 1,
            "pageSize": val,
            "total": 0,
            "object": {
              "id": that.productId == '' ? 0 : that.productId,
              "title": that.productTitle,
              "createUser": that.productUser,
              "minPrice": that.productPrefix == '' ? 0 : that.productPrefix,
              "maxPrice": that.productBehind == '' ? 0 : that.productBehind,
              "podID": that.productPos,
              "destinationID": that.productMod
            }
          },
          {
            headers:{
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        )
          .then(function (obj) {
            console.log(obj.data);
            that.total = obj.data.total;
            that.tableData =obj.data.objects;
            that.tableData.forEach(function (v, k, arr) {
              arr[k]['type'] = "跟团游"
              arr[k]['name'] = obj.data.objects[k].title;
              arr[k]['mu_address'] = obj.data.objects[k].destinations[0].destination
              arr[k]['options'] = obj.data.objects[k].createUser
              arr[k]['status'] = "1"
              arr[k]['opers'] = "飞猪 携程"
              arr[k]['price'] = obj.data.objects[k].refPrice
            })
          })
          .catch(function (obj) {
            console.log(obj)
          })
      },
      handleCurrentChange(val) {

        if (!this.productTitle){
          this.productTitle = ""
        }else{
          this.pageNum = 1;
        }
        if (!this.productUser){
          this.productUser = ""
        }else{
          this.pageNum = 1;
        }
        if (!this.productPos){
          this.productPos = 0
        }else{
          this.pageNum = 1;
        }
        if (!this.productMod){
          this.productMod = 0
        }else{
          this.pageNum = 1;
        }

        this.pageNum = val;
        var that = this
        this.$http.post(
          this.GLOBAL.serverSrc + "/team/api/teamsearch",
          {
            "pageIndex": val,
            "pageSize": this.pagesize,
            "total": 0,
            "object": {
              "id": that.productId == '' ? 0 : that.productId,
              "title": that.productTitle,
              "createUser": that.productUser,
              "minPrice": that.productPrefix == '' ? 0 : that.productPrefix,
              "maxPrice": that.productBehind == '' ? 0 : that.productBehind,
              "podID": that.productPos,
              "destinationID": that.productMod
            }
          },
          {
            headers:{
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        )
          .then(function (obj) {
            console.log(obj.data);
            that.total = obj.data.total;
            that.tableData =obj.data.objects;
            that.tableData.forEach(function (v, k, arr) {
              arr[k]['type'] = "跟团游"
              arr[k]['name'] = obj.data.objects[k].title;
              arr[k]['mu_address'] = obj.data.objects[k].destinations[0].destination
              arr[k]['options'] = obj.data.objects[k].createUser
              arr[k]['status'] = "1"
              arr[k]['opers'] = "飞猪 携程"
              arr[k]['price'] = obj.data.objects[k].refPrice
            })
          })
          .catch(function (obj) {
            console.log(obj)
          })
      },
      // 库存按钮出现
      groupStage() {
        this.ccc = []
        var that = this
        this.$http.post(
          this.GLOBAL.serverSrc + "/team/api/teampackagelist",
          {
            "object": {
              "teamID": this.pid,
            }
          },
          {
            headers:{
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        )
          .then(function (obj) {
            /*

             */

            for (let i = 0; i < obj.data.objects.length; i++){
              /* console.log(obj.data.objects[0].id)*/

              that.ccc.push({
                id:obj.data.objects[i].id,
                ddd:obj.data.objects[i].name,
                uptoDay:obj.data.objects[i].uptoDay,
                value:obj.data.objects[i].templateID,
                codePrefix:obj.data.objects[i].codePrefix,
                codeSuffix:obj.data.objects[i].codeSuffix,
                createTime:obj.data.objects[i].createTime,
                type:false,
                rate:obj.data.objects[i].rate
              })
              if(that.ccc[i].value == 0){
                that.ccc[i].value = ""
              }

            }
            console.log(obj.data)
          })
          .catch(function (obj) {
            console.log(obj)
          })
        this.merchandise = true;
        this.addtable.push({
          allprice:[],
        });
        this.sku.push({
          price:[],
        });
      },
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return "background:#F7F7F7";
        } else {
          return "";
        }
      },
      // 点击属性按钮的时候
      begin(e,key){
        // 按下按钮
        if(e.pp == false){
          // 给点击之后的样式
          this.arr.push({
            id:key,
          })
          // console.log(this.arr);
          document.getElementById('kk'+key).style.border = 'solid 1px #409EFF'
          document.getElementById('kk'+key).style.color= '#409EFF'
          // 当不符合属性条件时先将全部的按钮都禁用
          if(this.addtable[this.addtable.length-1].allprice.length >= 3){
            // console.log("超过了")
            for(var po = 0; po < this.buttonList.length;po++){
              this.buttonList[po].forbidden = true;

              document.getElementById('kk'+po).style.border = 'dashed 1px #c2c2c2'
              document.getElementById('kk'+po).style.color = '#c0c4cc'
              document.getElementById('kk'+po).style.background = '#fff'
            }
            // 然后再将点击了的按钮存在一个数组里面,再将这个数组里面的按钮取消禁用.
            for(var lo = 0;lo<this.arr.length;lo++){
              this.buttonList[this.arr[lo].id].forbidden=false;
              document.getElementById('kk'+this.arr[lo].id).style.border = 'solid 1px #409EFF'
              document.getElementById('kk'+this.arr[lo].id).style.color= '#409EFF'
            }
          }
          // 点击向数组中添加数值
          this.addtable[this.addtable.length-1].allprice.push({
            id:e.id,
            property:e.button,
            verifier:e.verifier,
            value:[],
          })
          // 按下按钮给一个true表示按下
          this.buttonList[key].pp=true;
          // 判断表格中的数据条数,如果数据只有一条那么生成一条确认属性值
          if(this.addtable[this.addtable.length-1].allprice.length ==1){
            this.addtable[this.addtable.length-1].allprice.push({
              ll:"",
            })
            this.qq = true;
            this.buttonList[key].key = this.addtable[this.addtable.length -1].allprice.length -2;
          }else{
            // 如果数据条数大于一条,则吧str,也就是确认属性值这条代码拿出来在重新放到数据尾部
            var str = this.addtable[this.addtable.length-1].allprice.splice( this.addtable[this.addtable.length-1].allprice.length -2,1);
            this.addtable[this.addtable.length -1].allprice.push(str[0]);
            this.buttonList[key].key = this.addtable[this.addtable.length -1].allprice.length -2;
            // console.log(e);
          }
        }else if(e.pp){
          // 当按钮抬起了
          console.log(this.addtable);
          // 这个地方删除有些问题!
          this.addtable[this.addtable.length -1].allprice.splice(e.key,1);
          for(let i=0;i<this.addtable[this.addtable.length-1].allprice.length -1;i++){
            this.buttonList[this.addtable[this.addtable.length-1].allprice[i].id].key = i;
          }
          if(this.addtable[this.addtable.length-1].allprice.length ==1){
            this.addtable[this.addtable.length-1].allprice.splice(0,1);
          }
          this.buttonList[key].pp = false;
          // 当抬起按钮的时候,如果符合属性数量的要求,那么将所有的禁用关闭
          if(this.addtable[this.addtable.length-1].allprice.length < 4){
            for(var po = 0; po <this.buttonList.length;po++){
              this.buttonList[po].forbidden = false;
              document.getElementById('kk'+po).style.border = 'solid 1px #c2c2c2'
              document.getElementById('kk'+po).style.color = '#606266'
            }
            this.arr.splice(e.key,1);
          }
          // 在其他按钮禁用的情况下也显示已经选中的按钮
          for(var lo = 0;lo<this.arr.length;lo++){
            document.getElementById('kk'+this.arr[lo].id).style.border = 'solid 1px #409EFF'
            document.getElementById('kk'+this.arr[lo].id).style.color= '#409EFF'
          }
        }
      },
      qqq(){
        console.log(this.ccc)
        for(var i = 0; i < this.ccc.length;i++ ){
          if(this.ccc[i].codeSuffix == "" ||this.ccc[i].codePrefix == ""){
            this.isCollapse = true
            this.$message.error('错了哦，团号不能为空');
          }
        }
      },
      headCall(data) {
        console.log(this.merchandise)
        if(this.merchandise == true){
          this.isCollapse = true
        }
        this.merchandise = data;
      },


      // 添加增值
      // appreciation(){
      //   this.accretionBall = true;
      // },
      // 保存增值
      // save(formName){
      //   this.$refs[formName].validate((valid) =>{
      //     if (valid){
      //       this.$message({
      //         message: '添加成功',
      //         type: 'success'
      //       });
      //       console.log(this.ruleForm);
      //       this.accretionBall = false;
      //       this.AddpriceId++;
      //       this.Addprice.push({
      //         id:this.Addprice.length+1,
      //         name:this.ruleForm.name,
      //         priceSelect:this.ruleForm.priceSelect,
      //         explain:this.ruleForm.explain,
      //         type:false,
      //       })
      //       this.accretionTable = true;
      //       console.log(this.Addprice);
      //       // 清空输入框的数据
      //       this.ruleForm.name = '';
      //       this.ruleForm.priceSelect = '';
      //       this.ruleForm.explain = '';
      //       // this.$refs[formName].resetFields();
      //     } else {
      //       console.log('error submit!!');
      //       return false;
      //     }
      //   });
      // },
      // 删除sku
      // delSku(a){
      //   this.ccc.splice(a,1);
      // },
      // 删除增值服务
      // delPrice(b){
      //   this.Addprice.splice(b,1);
      // },
      // sku上线
      online(index){
        console.log(index);
        console.log(this.ccc[index]);
        this.ccc[index].type = true;
      },
      // sku下线
      offline(index){
        console.log(2);
        console.log(this.ccc[index]);
        this.ccc[index].type = false;
      },
      // 增值服务上线
      addOnline(index){
        this.Addprice[index].type = true;
      },
      // 增值服务下线
      addOffline(index){
        this.Addprice[index].type = false;
      },
      //获取id
      clickBanle(row, event, column){
        this.pid = row['id'];
        this.reable = false;

      }

    },
    created(){
      this.themeList();
      //产品列表
      var that = this
      this.pageNum = 1;
      if (!this.productTitle){
        this.productTitle = ""
      }else{
        this.pageNum = 1;
      }
      if (!this.productUser){
        this.productUser = ""
      }else{
        this.pageNum = 1;
      }
      this.$http.post(
        this.GLOBAL.serverSrc + "/team/api/teamsearch",
        {
          "pageIndex": 1,
          "pageSize": this.pagesize,
          "total": 0,
          "object": {
            "id": 0,
            "title": that.productTitle,
            "createUser": that.productUser,
            "minPrice": 0,
            "maxPrice": 0,
            "podID": 0,
            "destinationID": 0
          }
        },
        {
          headers:{
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }
      )
        .then(function (obj) {
          console.log(obj.data);
          that.total = obj.data.total;
          that.tableData =obj.data.objects;
          that.tableData.forEach(function (v, k, arr) {
            arr[k]['type'] = "跟团游"
            arr[k]['name'] = obj.data.objects[k].title;
            arr[k]['mu_address'] = obj.data.objects[k].destinations[0].destination
            arr[k]['options'] = obj.data.objects[k].createUser
            arr[k]['status'] = "1"
            arr[k]['opers'] = "飞猪 携程"
            arr[k]['price'] = obj.data.objects[k].refPrice
          })
        })
        .catch(function (obj) {
          console.log(obj)
        })

      //出行模板data
      this.$http.post(
        this.GLOBAL.serverSrc + "/universal/template/api/templatelist",
        {
          "object": {
          }
        },
        {
          headers:{
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }
      )
        .then(function (obj) {
          for (let i=0; i<obj.data.objects.length; i++){
            that.type.push({
              value:obj.data.objects[i].id,
              label:obj.data.objects[i].name
            })
          }
        })
        .catch(function (obj) {
          console.log(obj)
        })
    },
    

  }
</script>
<style lang="stylus" scoped>
  .ButtonCls{
    float: right;
    margin-top: -35px;
  }
  .button_select{
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: left;
    margin-left: 50px;
  }
  .select_button{
    padding-top: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e9eaea;
    text-align: left;
    padding-left: 50px;
  }
  .id{
    width: 302px;
    float: left;
    font-size: 14px;
    margin-left: 14px;
    padding-left: 10px;
  }
  .address{
    width: 312px;
    float: left;
    font-size: 14px;
    margin-left: -3px;
  }
  .select_two{
    height: 45px;
    margin-top: 10px;
    margin-left: 30px;
  }
  .product{
    width: 600px;
    float: left;
    margin-left: 20px;
    font-size: 14px;
  }
  .options{
    width: 300px;
    float: left;
    margin-left: 10px;
    font-size: 14px;
  }
  .options11{
    width: 320px;
    float: left;
    margin-left: 10px;
    font-size: 14px;
  }
  .name{
    width: 312px;
    float: left;
    font-size: 14px;
    margin-left: 51px;
  }
  .prices{
    width: 600px;
    float: left;
    margin-left: 38px;
    font-size: 14px;
  }
  .select_two_button{
    height: 45px;
    margin-top: 10px;
    margin-left: 30px;
    float: left;
  }
  .table_trip{
  }
  .block{
    text-align right ;
    margin-bottom: 25px;
    width:75%
  }
  .group {
    /*  margin-left: calc(50% - 120px);*/
  }

  .el-radio-button>>>.el-radio-button__inner {
                       width: 120px;
                     }
  .property{
    margin-right:10px;
  }
  .button-list {
    width: 80%;
    height: 45px;
    margin: 37px auto;
  }
  // 限制字体
  .astrict{
    color:#ff4b3d;
    margin-left:30px;
  }
  .merchandise>.el-dialog{
    overflow:hidden !important;
    min-width: 1455px;
  }
</style>
