<template>
  <div>
    <div style="
     text-align: left;
    margin-left: 50px;
    margin-bottom: 20px;">
    <el-button type="primary"  @click="dialogVisible = true" >添加产品</el-button>
    </div>

    <div style="border: 1px solid rgb(241, 241, 241); margin-left: 50px;width: 1009px" >
    <div class="select_button">
      <el-button v-for="(item, index) in domains"
                 :key="item.key"
                 @click="clickHand(index)"
                 plain
      >{{item.value}}</el-button>
      <!--<router-link to="listInfo">
      </router-link>-->


    </div>
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
        <div class="address">出发地 <el-input   v-model="productPos" style="width: 205px;margin-left: 20px;"  placeholder="请输入内容"></el-input></div>
        <div class="name">目的地 <el-input   v-model="productMod" style="width: 200px; margin-left: 10px;"  placeholder="请输入内容"></el-input></div>
        <div class="options">产品操作人 <el-input  v-model="productUser" style="width: 150px; margin-left: 10px;"  placeholder="请输入内容"></el-input></div>
      </div>
      <div class="select_two">
        <div class="options11">状态
          <el-select  style="width: 205px;margin-left: 20px;" v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
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
        <el-button type="primary" size="medium">重置</el-button>
      </div>

    </div>
    </div>

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
          <template slot-scope="scope">
              <el-button type="text" >{{tableData[scope.$index].name}}</el-button>
          </template>
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



    <el-dialog class="merchandise" :visible.sync="merchandise"   :show-close="false" append-to-body width="77%">
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
          label="团号">
          <template slot-scope="scope">
            <el-input :maxlength="10"  v-model="ccc[scope.$index].codePrefix" style="width:100px"></el-input>
            <span >-</span>
            <span >{{</span>
            <span >日期</span>

            <span >}}</span>
            <span >-</span>
            <el-input :maxlength="10"  v-model="ccc[scope.$index].codeSuffix" style="width:100px"></el-input>

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
        width="200">
        <template slot-scope="scope">
            <template v-if="ccc[scope.$index].type == false">
              <el-button size="mini" type="primary"  @click="online(scope.$index)">上线</el-button>
            </template>
            <template v-else>
            <el-button size="mini" type="primary"  @click="offline(scope.$index)">下线</el-button>
            </template>
            <el-button size="mini" type="primary" @click="bandlePrice(scope.$index)">价格</el-button>
            <!-- <el-button size="mini" type="danger" @click="delSku(scope.$index)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 增值服务 -->
    <!-- <div v-show="accretion">
        <div style="width:90%;margin-left:60px;margin-top:60px;">
          <span style="font-size:25px;color:#333">增值服务</span><br/>
          <span style="color:#dcdcdc">附加增值服务说明：不可单独购买，只能跟主产品库存一起购买的需要额外付费的项目或资源，包含但不限于夜间服务费、接送区域外附加费、儿童座椅、酒店升级、行李额服务、代办签证费、小费、司导服务费、加急费等等</span><br/>
          <el-button type="primary" size="medium"  @click="appreciation()">添加增值</el-button>
        </div> -->
          <!-- 添加增值的弹窗 -->
          <!-- <el-dialog title="增值信息" :visible.sync="accretionBall" append-to-body width="30%" custom-class="city_list">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  >
                <el-form-item label="名称 :" prop="name" style="margin-left:35px" >
                   <el-input v-model="ruleForm.name" auto-complete="off" style="width:60%;" ></el-input>
                </el-form-item>
                <el-form-item label="价格类型 :" prop="priceSelect" style="margin-left:35px" >
                    <el-radio-group v-model="ruleForm.priceSelect">
                      <el-radio label="非日历价格"></el-radio>
                      <el-radio label="日历价格"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="说明 :" prop="explain" style="margin-left:35px" >
                   <el-input v-model="ruleForm.explain" auto-complete="off" style="width:60%;" ></el-input>
                </el-form-item>
                <el-form-item style="margin-left:70%;">
                  <el-button size="mediun">删除</el-button>
                  <el-button size="mediun" type="primary" @click="save('ruleForm')">保存</el-button>
                </el-form-item>
            </el-form>
          </el-dialog> -->

        <!-- 增值服务列表 -->
          <!-- <el-table
            v-show="accretionTable"
            :data="Addprice"
            border
            style="width: 1340px;margin:20px auto;"
            :header-cell-style="getRowClass">
          <el-table-column
            prop="id"
            label="ID"
            width="180"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            width="180"
            align="center"
            >
          </el-table-column>

          <el-table-column
            prop="explain"
            align="center"
            label="说明">
          </el-table-column>
        <el-table-column
          prop="priceSelect"
          align="center"
          label="价格"
        >

          </el-table-column>
            <el-table-column
            prop="name"
            align="center"
            label="操作">
            <template slot-scope="scope">
              <template v-if="Addprice[scope.$index].type == false">
                <el-button size="mini" type="primary" @click="addOnline(scope.$index)">上线</el-button>
              </template>
              <template v-else>
                <el-button size="mini" type="primary" @click="addOffline(scope.$index)">下线</el-button>
              </template>
                <el-button size="mini" type="primary">价格</el-button>
                <template v-if="Addprice[scope.$index].type == false">
                  <el-button size="mini" type="primary">修改</el-button>
                </template>
                <el-button size="mini" type="danger" @click="delPrice(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    </div> -->

    </div>
    <!-- 价格 -->
    <div v-else>
      <DateList   v-on:merchandises="headCall"  :msg-father="ccc" :piapia="piaid" :codePrefix="codePrefix" :codeSuffix="codeSuffix"/>
    </div>
    </el-dialog>
  </div>
</template>

<script>
import DateList from './component/DateList'

  export default {
    components:{
      DateList,


    },
     data() {
      return {
        productId:'',
        productTitle:'',
        productPos:'',
        productMod:'',
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
        }],
        thisClass:'',
        options1: [{
          value1: '1',
          label: '跟团游'
        }, {
          value1: '2',
          label: '自由行'
        }],
        about:'',
        dialogVisible: false,
        currentPage1: 5,
        currentPage2: 5,
        currentPage3: 5,
        currentPage4: 4,

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
        abc: false
      }
    },
    methods: {
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

      handleDelete(){
        this.$confirm('此操作将删除该模板', '提示', {
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
              this.GLOBAL.serverSrc + "/team/api/teampage",
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
                  arr[k]['mu_address'] = "xxx"
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

      BandSave(){


        for(let i = 0; i<this.ccc.length;i++){
          var that = this
          this.$http.post(
            this.GLOBAL.serverSrc + "/team/api/teampackagesave",
            {
              "object": {
                "id": that.ccc[i].id,
                "name": that.ccc[i].ddd,
                "podID": 0,
                "destinationID": 0,
                "pod": "string",
                "destination": "string",
                "teamID": that.ccc[i].id,
                "isDeleted": 0,
                "createTime": "2018-12-04T06:46:08.554Z",
                "code": "string",
                "traffic": [
                  {
                    "id": 0,
                    "packageID": 0,
                    "goOrBack": 1,
                    "trafficMode": 1,
                    "day": 0,
                    "pod": "string",
                    "company": "string",
                    "theNumber": "string",
                    "podCity": "string",
                    "podPlace": "string",
                    "podTime": "string",
                    "arriveCity": "string",
                    "arrivePlace": "string",
                    "arriveTime": "string",
                    "ext_Stopover": "string"
                  }
                ],
                "schedules": [
                  {
                    "id": 0,
                    "packageID": 0,
                    "day": 0,
                    "subject": "string",
                    "ext_Meals": "string",
                    "info": "string",
                    "ext_Hotel": "string",
                    "activitys": [
                      {
                        "id": 0,
                        "scheduleID": 0,
                        "activityType": 0,
                        "time": 0,
                        "name": "string",
                        "details": "string",
                        "typeExt": "string",
                        "pictureID": 0,
                        "memo": "string",
                        "createTime": "2018-12-04T06:46:08.555Z",
                        "code": "string"
                      }
                    ],
                    "createTime": "2018-12-04T06:46:08.555Z",
                    "code": "string"
                  }
                ],
                "briefMark": "string",
                /*"plan": {
                  "id": 0,
                  "isDeleted": 0,
                  "createTime": "2018-12-04T06:46:08.555Z",
                  "code": "string",
                  "inventoryID": 0,
                  "planEnroll": [
                    {
                      "id": 0,
                      "planID": 0,
                      "enrollID": 0,
                      "enrollName": "string",
                      "isDeleted": 0,
                      "price_01": 0,
                      "price_02": 0,
                      "quota": 0
                    }
                  ],
                  "loadPlan_Enroll": true,
                  "createUser": "string",
                  "packageID": 0
                },*/
                "loadPlan": true,
                "uptoDay": that.ccc[i].uptoDay,
                "templateID": that.ccc[i].value
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
        this.merchandise = false;
      },
      BandCancel(){
        this.merchandise = false;
      },
  //搜索
      searchHand(){
        if(this.productId == ''){
          this.productId = 0;
        }else{
          this.pageNum = 1;
        }
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
        if (!this.productPrefix){
          this.productPrefix = 0
        }else{
          this.pageNum = 1;
        }
        if (!this.productBehind){
          this.productBehind = 0
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
              "id": that.productId,
              "title": that.productTitle,
              "createUser": that.productUser,
              "minPrice": that.productPrefix,
              "maxPrice": that.productBehind,
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
            that.total = obj.data.total;
            that.tableData =obj.data.objects;
            that.tableData.forEach(function (v, k, arr) {
              arr[k]['type'] = "跟团游"
              arr[k]['name'] = obj.data.objects[k].title;
              arr[k]['mu_address'] = "xxx"
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
        if( this.domains[index].status == "true"){
          this.domains[index].status = "false"
        }else{
        this.buttonlist.push(this.domains[index].value);
        this.domains[index].status = "true"
        }

      },
      routerHandle(){
        console.log(this.about);
        if(this.about == 1){
          this.$router.push({path: "listInfo"});
        }
        this.dialogVisible = false
      },
      handleClick(row) {
        console.log(row);
      },
      handleSizeChange(val) {
        if(this.productId == ''){
          this.productId = 0;
        }else{
          this.pageNum = 1;
        }
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
        if (!this.productPrefix){
          this.productPrefix = 0
        }else{
          this.pageNum = 1;
        }
        if (!this.productBehind){
          this.productBehind = 0
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
              "id": that.productId,
              "title": that.productTitle,
              "createUser": that.productUser,
              "minPrice": that.productPrefix,
              "maxPrice": that.productBehind,
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
        if(this.productId == ''){
          this.productId = 0;
        }else{
          this.pageNum = 1;
        }
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
        if (!this.productPrefix){
          this.productPrefix = 0
        }else{
          this.pageNum = 1;
        }
        if (!this.productBehind){
          this.productBehind = 0
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
              "id": that.productId,
              "title": that.productTitle,
              "createUser": that.productUser,
              "minPrice": that.productPrefix,
              "maxPrice": that.productBehind,
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
                })
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
    //添加属性值功能
    addInput(b,key){
      this.aa = true;
      this.di++;
      // console.log(b);
      // console.log(b.value);
      // console.log(key);
      // console.log(this.di);

      // 向指定的属性数组中添加属性值
      this.addtable[this.addtable.length-1].allprice[key].value.push({
        di:key,
        price:'',
        pp : false,
        forbidden:false,
      })
      for(var ol =0;ol<b.value.length;ol++){
        b.value[ol].forbidden = false;
        console.log(key);
        console.log(ol);
        console.log("--------------")
        // document.getElementById('vv'+key+ol).style.border = 'solid 1px #b3d8ff'
        // document.getElementById('vv'+key+ol).style.color = '#409EFF'
        // document.getElementById('vv'+key+ol).style.background = '#ecf5ff'
        // console.log(23);

      };
        console.log(this.sku);

    },
  // 确认属性值
  gain(){
    for(var kl = 0;kl<this.addtable[this.addtable.length-1].allprice.length-1;kl++){
        // console.log(this.addtable[this.addtable.length-1].allprice[kl].value);
      if(this.addtable[this.addtable.length-1].allprice[kl].value.length == 0){
        this.abc = true
      }
    }
    if(this.abc){
        this.$message({
          showClose: true,
          message: '请为每个属性至少添加一个属性值',
          type: 'error'
        });
      } else {
        // 属性输入框和删除按钮
        this.aa = false;
        // 属性确定之后的按钮
        this.bb = true;
        this.qq = false;
        this.again = true;
        this.pp = false;
        this.close = true;
        this.addsku = true;
        // 属性按钮被禁用
        this.xianshi = true;
        // for(var ok = 0;ok<this.buttonList.length;ok++){
        //   this.buttonList[ok].forbidden = true;
        //   document.getElementById('kk'+ok).style.border = 'dashed 1px #c2c2c2'
        //   document.getElementById('kk'+ok).style.color = '#c0c4cc'
        //   document.getElementById('kk'+ok).style.background = '#fff'
        // }
        for(var lo = 0;lo<this.arr.length;lo++){
          document.getElementById('kk'+this.arr[lo].id).style.border = 'solid 1px #409EFF'
          document.getElementById('kk'+this.arr[lo].id).style.color= '#409EFF'
        }
      }

        this.abc = false
     },
  // 重新设计属性值
    back(){
      this.aa = true;
      this.bb = false;
      this.qq = true;
      this.again = false;
      this.pp = true;
      this.close = false;
      this.addsku = false;
      console.log(this.sku);
      this.sku[this.sku.length-1].price.splice(0,this.sku[this.sku.length-1].price.length);
      for(var op = 0;op<this.addtable[this.addtable.length-1].allprice.length-1;op++){
          for(var ll = 0;ll<this.addtable[this.addtable.length-1].allprice[op].value.length;ll++){
            this.addtable[this.addtable.length-1].allprice[op].value[ll].forbidden = false;
            this.addtable[this.addtable.length-1].allprice[op].value[ll].pp  = false;
            document.getElementById('vv'+op+ll).style.border = 'solid 1px #b3d8ff'
            document.getElementById('vv'+op+ll).style.color = '#409EFF'
            document.getElementById('vv'+op+ll).style.background = '#ecf5ff'
          }
        }
      console.log(this.sku);

    // 属性恢复使用
    if(this.addtable[this.addtable.length-1].allprice.length < 4){
      for(var ok = 0;ok<this.buttonList.length;ok++){
        this.buttonList[ok].forbidden = false;
        document.getElementById('kk'+ok).style.border = 'solid 1px #dcdfe6'
        document.getElementById('kk'+ok).style.color = '#606266'
      }
      for(var lo = 0;lo<this.arr.length;lo++){
        document.getElementById('kk'+this.arr[lo].id).style.border = 'solid 1px #409EFF'
        document.getElementById('kk'+this.arr[lo].id).style.color= '#409EFF'
      }
    }else if(this.addtable[this.addtable.length-1].allprice.length == 4){
      // 全部禁用,并且禁用样式
      for(var ok = 0;ok<this.buttonList.length;ok++){
          this.buttonList[ok].forbidden = true;
          document.getElementById('kk'+ok).style.border = 'solid 1px #c2c2c2'
          document.getElementById('kk'+ok).style.color = '#c0c4cc'
          document.getElementById('kk'+ok).style.background = '#fff'
      }
    // 选中的不禁用,并且选中样式
      for(var lo = 0;lo<this.arr.length;lo++){
          this.buttonList[this.arr[lo].id].forbidden =false;
          document.getElementById('kk'+this.arr[lo].id).style.border = 'solid 1px #409EFF'
          document.getElementById('kk'+this.arr[lo].id).style.color= '#409EFF'
      }
    }
  },
  // 属性值按钮按下
  choice(e,key,kk,lp){
      // 当这个按钮还处于未被按下的情况下,按下
    if(kk.value[key].pp == false){
     // 先禁用所有的属性值按钮
      for(var ui = 0;ui<kk.value.length;ui++){
        kk.value[ui].forbidden = true;
      }
       this.lm = this.addtable[this.addtable.length-1].allprice[lp].value[key].di;
         document.getElementById('vv'+lp+key).style.border = 'solid 1px #409eff'
         document.getElementById('vv'+lp+key).style.color = '#fff'
         document.getElementById('vv'+lp+key).style.background = '#409eff'
      // 再解禁选中的按钮
        kk.value[key].forbidden = false;
      // 让选中的按钮处于按下的状态
        kk.value[key].pp = true;
      // 给这个按钮选中样式
      // 将这个按钮的相关的值添加到sku这个数组中
      this.sku[this.sku.length-1].price.push({
        ID:kk.id,
        zhi:kk.value[key].price,
        name:kk.property,
      })
      console.log(this.sku[this.sku.length-1].price)
      console.log(lp);
    }else if(kk.value[key].pp == true){
        for(var ui = 0;ui<kk.value.length;ui++){
          kk.value[ui].forbidden = false;
        }
        kk.value[key].pp = false;
        console.log(this.sku[this.sku.length-1].price);
        console.log(key)
        this.sku[this.sku.length-1].price.splice(lp,1);
         document.getElementById('vv'+lp+key).style.border = 'solid 1px #b3d8ff'
         document.getElementById('vv'+lp+key).style.color = '#409EFF'
         document.getElementById('vv'+lp+key).style.background = '#ecf5ff'
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
        this.merchandise = data;
      },
  // 生成sku
  skuadd(){
    console.log(this.addtable[this.addtable.length-1].allprice)
       if(this.sku[this.sku.length-1].price.length<this.addtable[this.addtable.length-1].allprice.length-1){
          this.$message({
          showClose: true,
          message: '请为每一个属性选择要添加的属性值',
          type: 'error'
        });
       }else{
       // 获取点击按钮后的数据
        for(var op = 0;op<this.addtable[this.addtable.length-1].allprice.length-1;op++){
          for(var ll = 0;ll<this.addtable[this.addtable.length-1].allprice[op].value.length;ll++){
            this.addtable[this.addtable.length-1].allprice[op].value[ll].forbidden = false;
            this.addtable[this.addtable.length-1].allprice[op].value[ll].pp  = false;
            document.getElementById('vv'+op+ll).style.border = 'solid 1px #b3d8ff'
            document.getElementById('vv'+op+ll).style.color = '#409EFF'
            document.getElementById('vv'+op+ll).style.background = '#ecf5ff'
          }
        }
        this.skuList = true;
          var bbb = [];
          for(var i = 0;i<this.sku[this.sku.length-1].price.length;i++){
            bbb[i] = this.sku[this.sku.length-1].price[i]
          }
        this.sku[this.sku.length-1].price.splice(0,this.sku[this.sku.length-1].price.length);
          var ooo = [];
          for(var k = 0;k<bbb.length;k++){
            ooo.push(
                bbb[k].name + ':' + bbb[k].zhi
                // 这个地方遍历出来的数据没有换行,这个问题有些难,先放一放
            )
          }
        var ppp = ooo.toString()
        // sku的id编号
        this.skuid ++;
        this.ccc.push({
          id:this.skuid,
          ddd:ppp,
          type:false,
        })
        console.log(this.ccc);
        if(this.ccc.length > 0){
            this.accretion = true;
        }
     }
  },

  // 删除属性值
    shanchu(index,key){
      this.addtable[this.addtable.length-1].allprice[key].value.splice(index,1);
      },
  // 添加增值
    appreciation(){
      this.accretionBall = true;
    },
  // 保存增值
    save(formName){
      this.$refs[formName].validate((valid) =>{
        if (valid){
            this.$message({
            message: '添加成功',
            type: 'success'
          });
            console.log(this.ruleForm);
          this.accretionBall = false;
          this.AddpriceId++;
          this.Addprice.push({
            id:this.Addprice.length+1,
            name:this.ruleForm.name,
            priceSelect:this.ruleForm.priceSelect,
            explain:this.ruleForm.explain,
            type:false,
          })
          this.accretionTable = true;
          console.log(this.Addprice);
          // 清空输入框的数据
          this.ruleForm.name = '';
          this.ruleForm.priceSelect = '';
          this.ruleForm.explain = '';
          // this.$refs[formName].resetFields();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  // 删除sku
    delSku(a){
      this.ccc.splice(a,1);
    },
    // 删除增值服务
    delPrice(b){
      this.Addprice.splice(b,1);
    },
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
      //产品列表
      var that = this
      if(this.productId == ''){
        this.productId = 0;
      }else{
        this.pageNum = 1;
      }
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
      if (!this.productPrefix){
        this.productPrefix = 0
      }else{
        this.pageNum = 1;
      }
      if (!this.productBehind){
        this.productBehind = 0
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
            "id": that.productId,
            "title": that.productTitle,
            "createUser": that.productUser,
            "minPrice": that.productPrefix,
            "maxPrice": that.productBehind,
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
.merchandise>>>.el-dialog{
  overflow:hidden !important;
  min-width: 1455px;
}
</style>
