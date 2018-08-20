<template>
  <div>
    <div class="select_button">
      <el-button plain>跟团游</el-button>
      <el-button plain>自由行</el-button>
      <el-button plain>签证</el-button>
      <el-button plain>机票</el-button>
      <el-button plain>酒店</el-button>
      <el-button plain>门票</el-button>
      <el-button plain>WiFi</el-button>
      <el-button plain>电话卡</el-button>
      <el-button plain>交通</el-button>
      <el-button plain>保险</el-button>
      <router-link to="listInfo"><el-button type="primary" style="margin-left: 10px">添加产品</el-button></router-link>
    </div>
    <div style="height: 155px;">
      <div class="select_two">
      <div class="id">ID <el-input style="width: 200px; margin-left: 10px;"  placeholder="请输入内容"></el-input></div>
      <div class="product">商品名称 <el-input style="width: 200px; margin-left: 10px;"  placeholder="请输入内容"></el-input></div>
      <div class="options">产品操作人 <el-input style="width: 200px; margin-left: 10px;"  placeholder="请输入内容"></el-input></div>
      <div class="prices">价格<el-input style="width: 100px; margin-left: 10px;"  placeholder="请输入内容"></el-input><span style="margin-left: 10px">——</span><el-input style="width: 100px; margin-left: 10px;"  placeholder="请输入内容"></el-input></div>
      </div>
      <div class="select_two">
        <div class="address">出发地 <el-input style="width: 200px; margin-left: 10px;"  placeholder="请输入内容"></el-input></div>
        <div class="name">商品名称 <el-input style="width: 200px; margin-left: 10px;"  placeholder="请输入内容"></el-input></div>
        <div class="options11">状态
          <el-select  style="margin-left: 33px;width: 200px;" v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        </div>
      </div>
      <div class="select_two_button">
        <el-button type="primary" size="medium">搜索</el-button>
        <el-button type="primary" size="medium">重置</el-button>
      </div>

    </div>
    <div class="table_trip">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="pid"
          label="产品编号"
         >
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型"
         >
        </el-table-column>
        <el-table-column
          prop="name"
          label="产品名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="mu_address"
          label="目的地"
         >
        </el-table-column>
        <el-table-column
          prop="options"
          label="操作人"
         >
        </el-table-column>
        <el-table-column
          label="状态"
          >
          <template slot-scope="scope">
          <el-button type="success"  size="mini">已上架</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="opers"
          label="推送平台"
        width="200">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格">
        </el-table-column>
        <el-table-column
          label="操作"
        width="300">
          <template slot-scope="scope">
            <div>
              <el-button type="primary" size="mini" @click="handleClick(scope.row)">编辑</el-button>
              <el-button type="primary" size="mini">复制</el-button>
              <el-button type="primary" size="mini">导出行程</el-button>
            </div>
            <div style="margin-top: 10px">
              <el-button type="primary" size="mini">退改</el-button>
              <el-button type="primary" size="mini">团期</el-button>
              <el-button type="primary" size="mini" @click = "groupStage">库存</el-button>
              <el-button type="danger" size="mini">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400">
        </el-pagination>
      </div>
    </div>
    <el-dialog  :visible.sync="merchandise"  append-to-body width="80%">
     <el-radio-group v-model="isCollapse" style="width:100%">
      <el-radio-button  class="group" :label="true">库存</el-radio-button>
      <el-radio-button :label="false">价格</el-radio-button>
    </el-radio-group>
    <!-- 库存 -->
    <div v-if="isCollapse==true">

      <div class="button-list" >
        <el-button id="kk" class="property" plain v-for="(data, index) in buttonList" :key=data.id   @click="begin(data, index)">{{data.button}}</el-button>
      </div>
      <el-table
        :data="addtable"
        border
        style="width: 1340px;margin:0 auto;"
        :header-cell-style="getRowClass"
       >
        <el-table-column
          prop="property"
          label="属性"
          width="230"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="price"
          label="值"
          align="center"
         >
         <template slot-scope="scope">
           <div v-for="kk in price" :key="kk.id" v-show="aa" style="float:left">
             <!-- 输入属性的input -->
             <el-input  id="rr" style="width:80px;" v-model="price.str" @keyup.enter.native="searchEnterFun"  type="text" ></el-input>

            <el-button  style="margin-right:10px;" size="mini" type="danger">删除</el-button>

            
           </div>
            <el-button plain v-show="bb" v-for="kk in price" :key="kk.id" style="float:left;margin-right:10px;" size="mini" type="primary">{{price.str}}</el-button>
            
         </template>
        </el-table-column>
        <el-table-column label="操作"
          width="300"
          align="center">

        <template slot-scope="scope" prop="ll">
            <el-button v-show="pp" @click="addInput(scope.row,scope.$index)" size="mini" type="primary">{{addtable[0].ll}}</el-button>
            <el-button v-show="qq" @click="addInput(scope.row,scope.$index)" size="mini" type="primary">{{addtable[addtable.length - 1].ll}}</el-button>
        </template>

        </el-table-column>
      </el-table>
    </div>
    <!-- 价格 -->
    <div v-else>
      <DateList/>
    </div>

    </el-dialog>
  </div>

</template>

<script>
import DateList from './component/DateList'
  export default {
    components:{
      DateList
    },
    data() {
      return {
        currentPage1: 5,
        currentPage2: 5,
        currentPage3: 5,
        currentPage4: 4,
        merchandise: false,
        isCollapse: true,
        // 添加值按钮
        pp:true,
        // 确认属性值按钮
        qq:false,
      // 输入框隐藏
        aa:true,
      //输入框变为按钮
        bb:false,
      // 按钮列表
      buttonList: [
        {
          id: "0",
          button: "出发地",
          pp : false
        },
        {
          id: "1",
          button: "行程路线",
          pp : false
        },
        {
          id: "2",
          button: "天数",
          pp : false
        },
        {
          id: "3",
          button: "晚数",
          pp : false
        },
        {
          id: "4",
          button: "房型",
          pp : false
        },
        {
          id: "5",
          button: "住宿条件",
          pp : false
        },
        {
          id: "6",
          button: "航空公司",
          pp : false
        },
        {
          id: "7",
          button: "酒店名称",
          pp : false
        },
        {
          id: "8",
          button: "套餐类型",
          pp : false
        }
      ],
      addtable: [

      ],
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
        value: '',
        tableData: [{
          pid:'1',
          type:'跟团游',
          name:'xxx 跟团游',
          mu_address:'xxx',
          options:'xxx',
          status:'1',
          opers:'飞猪 携程',
          price:'7900'
        }],
      // 属性输入框
        price:[],
      }
    },
    methods: {
      handleClick(row) {
        console.log(row);
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
          groupStage() {
      this.merchandise = true;
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#F7F7F7";
      } else {
        return "";
      }
    },
  // 点击属性按钮方法
  begin(e, key) {
    // console.log(e.id);
    if(e.pp == false){
      this.addtable.push({
      "id":e.id,
      "property":e.button,
      "ll":"添加值",
      
    })
      this.buttonList[key].pp = true;
      if(this.addtable.length == 1){
        this.addtable.push({
        "ll":'确认属性值',
      })
      // this.pp = false;
      this.qq = true;
      console.log(this.addtable[this.addtable.length - 1].ll);
    this.buttonList[key].key = this.addtable.length - 1; 
    } else {
      var str = this.addtable.splice(this.addtable.length - 2, 1);
      this.addtable.push(str[0]);
      this.buttonList[key].key = this.addtable.length - 2; 
    }
    } else if(e.pp){
      this.addtable.splice(e.key, 1);
      for(let i=0;i<this.addtable.length - 1;i++){
      this.buttonList[this.addtable[i].id].key = i;
    }
    if(this.addtable.length == 1){
      this.addtable.splice(0, 1);
    }
      this.buttonList[key].pp = false;
    } 
    },
  // 点击添加按钮方法
  addInput(b, key){
    this.aa = true;
    // console.log(b.id);
    // console.log(this.addtable[key]);
    // console.log(key);
  // 输入的属性值 
    // this.addtable[key].price.push(<el-input id="rr" style="width:80px;" v-model="input"  type="text" ></el-input>);
    // this.addtable[key].price.push(<el-button style="margin-right:10px;" size="mini" type="danger">删除</el-button>);
    this.price.push({
      qq:'',
      str:[
        
      ],
    });
    //  console.log(this.price.length);   

    },
    searchEnterFun:function(e){
        this.price[this.price.length - 1].str.push({
          oo:this.price.str,
        })
              // this.price.push({
              //   qq:'',
              //   str:this.price.str,
              // })
              // this.price.splice(this.price.length-1,0,this.price.str);
              console.log(this.price.length);              
              console.log(this.price.str);
              console.log(this.price);
              this.aa = false;

              this.bb = true;
            }
    

  }

  }
</script>
<style lang="stylus" scoped>
 .select_button{
   width: 1200px;
   margin-left: -70px;
 }
  .id{
    width: 250px;
    float: left;
    font-size: 14px;
    margin-left: 11px;
    padding-left: 7px;
  }
 .address{
   width: 260px;
   float: left;
   font-size: 14px;
 }
  .select_two{
    height: 45px;
    margin-top: 10px;
    margin-left: 30px;
  }
 .product{
   width: 300px;
   float: left;
   margin-left: 10px;
   font-size: 14px;
 }
  .options{
    width: 320px;
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
    width: 320px;
    float: left;
    margin-left: 8px;
    font-size: 14px;
  }
  .prices{
    width: 320px;
    float: left;
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
   float: right;
   margin-top: 50px;
   margin-bottom: 80px;
 }
 .group {
  margin-left: calc(50% - 120px);
}

.el-radio-button>>>.el-radio-button__inner {
  width: 120px;
}
.property{
  margin-right:20px;
}
.button-list {
  width: 75%;
  height: 45px;
  // background:red;
  margin: 37px auto;
}
</style>
