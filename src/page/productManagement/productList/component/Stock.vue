<template>
    <div>
         <el-dialog  :visible.sync="this.$store.state.name"  append-to-body width="80%">
     <el-radio-group v-model="isCollapse" style="width:100%">
      <el-radio-button  class="group" :label="true">库存</el-radio-button>
      <el-radio-button :label="false">价格</el-radio-button>
    </el-radio-group>
    <!-- 库存 -->
    <div v-if="isCollapse==true">

      <div class="button-list" >
        <template v-if="this.forbidden == true">
          <el-button :id="'kk' + index" class="property" plain v-for="(data, index) in buttonList" :key=data.id   @click="begin(data, index)">{{data.button}}</el-button>
        </template>
        <template v-else>
          <el-button :id="'kk' + index" class="property" plain v-for="(data, index) in buttonList" :key=data.id   @click="begin(data, index)" disabled>{{data.button}}</el-button>
        </template>

      </div>
      <!-- 其实这个表格遍历数据的时候是有问题的,因为目前没有数据,每次遍历的都是addtable里面的数据,每次点击库存都会添加一条,这个地方应该是点击库存的时候传一个id按照这个id遍历数据 -->
      <el-table
        v-for="data in addtable"
        :key=data.id
        :data="data.allprice"
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

        <template slot-scope="scope" prop="ll">
              <template v-if="scope.row.ll == ''">
                <el-button @click="skuadd()" type="primary" v-show="addsku" size="mini" style="float:left">生成sku</el-button>
              </template>
           <template  slot-scope="scope" v-else>
              <div v-for="(data,index) in addtable[addtable.length-1].allprice[scope.$index].value"  :key="data.id" v-show="aa" style="float:left">
                  <el-input style="width:100px;" v-model="addtable[addtable.length-1].allprice[scope.$index].value[index].price"  type="text" clearable></el-input>
                 <!-- v-model="addtable[scope.$index].price[index].value" -->
                 <!-- v-model="addtable[addtable.length-1].allpricep[scope.$index].value" -->
                  <el-button  style="margin-right:10px;" size="mini" type="danger" @click="shanchu(index,scope.$index)">删除</el-button>
              </div>
                <el-button :id="'vv' + index" plain v-show="bb" v-for="(data,index) in addtable[addtable.length-1].allprice[scope.$index].value"
                :key="data.id" style="float:left;margin-right:10px;"  type="primary"
                @click="choice(data, index,addtable[addtable.length-1].allprice[scope.$index])"
                >
                  {{addtable[addtable.length-1].allprice[scope.$index].value[index].price}}
                </el-button>

            </template>
        </template>

         <!-- 生成sku的按钮 -->

        </el-table-column>
        <el-table-column label="操作"
          width="300"
          align="center">

        <template slot-scope="scope" prop="ll">
          <template v-if="scope.row.ll == ''">
            <el-button v-show="qq" @click="gain" size="mini" type="primary">确认属性值</el-button>
             <!--重新设置属性  -->
            <el-button v-show="again" type="danger" @click="back" size="mini">重新设置属性</el-button>
          </template>
          <template v-else>
            <el-button v-show="pp" @click="addInput(scope.row,scope.$index)" size="mini" type="primary" >添加值</el-button>
            <el-button v-show="close"  size="mini" type="primary"  disabled>添加值</el-button>

          </template>
        </template>

        </el-table-column>
      </el-table>

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
        width="180"
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
        prop="name"
        align="center"
        label="清位时间">
      </el-table-column>
        <el-table-column
        prop="name"
        align="center"
        label="出行模板">
        <template slot-scope="scope">
          <el-select v-model="value" placeholder="请选择">
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
        label="操作">
        <template slot-scope="scope">
            <el-button size="mini" type="primary">主要按钮</el-button>
            <el-button size="mini" type="primary">主要按钮</el-button>
            <el-button size="mini" type="danger">危险按钮</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <!-- 价格 -->
    <div v-else>
      <DateList/>
      <stock></stock>
    </div>

    </el-dialog>
    </div>
</template>

<script>

    export default {
        name: "Stock",
        data() {
      return {
        buttonlist:[],
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
        skuList:false,
      // 显示sku的数组
        ccc:[],
      // sku的id
        skuid : 0,
      // 按钮列表
      buttonList: [
        // pp 是开关

        {
          id: "0",
          button: "出发地",
          pp : false,
          //每个按钮的验证v-model
          verifier:" Origin",
        },
        {
          id: "1",
          button: "行程路线",
          pp : false,
          verifier: "Route",
        },
        {
          id: "2",
          button: "天数",
          pp : false,
          verifier: "Day",
        },
        {
          id: "3",
          button: "晚数",
          pp : false,
          verifier: "NightNum",
        },
        {
          id: "4",
          button: "房型",
          pp : false,
          verifier: "House",
        },
        {
          id: "5",
          button: "住宿条件",
          pp : false,
          verifier: "Accommodation",
        },
        {
          id: "6",
          button: "航空公司",
          pp : false,
          verifier: "Airline",
        },
        {
          id: "7",
          button: "酒店名称",
          pp : false,
          verifier: "HotelName",
        },
        {
          id: "8",
          button: "套餐类型",
          pp : false,
          verifier: "SetMeal",
        }
      ],
        // 列表数组
        addtable: [

        ],
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
       type: [{
          value: '1',
          label: '国内出行'
        }, {
          value: '2',
          label: '境外出行'
        }, {
          value: '3',
          label: '周边游'
        }, {
          value: '4',
          label: '城市玩乐'
        }, {
          value: '5',
          label: '参团游'
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
        },{
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
      /*qqq(q,w){
        console.log(q)
        console.log(w)
      },*/

      searchHand(){
        alert(13);
      },
      clickHand(index){
        if( this.domains[index].status == "true"){
          this.domains[index].status = "false"
        }else{
          this.buttonlist.push(this.domains[index].value);
          this.domains[index].status = "true"
        }
            console.log(this.domains[index].value);



        console.log( this.buttonlist);
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
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },

      // 库存按钮出现
      groupStage() {
      this.merchandise = true;
      this.addtable.push({
        allprice:[],
      });
      this.sku.push({
      price:[],
    });
      // console.log(this.addtable);
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

      // 如果按钮是未按下的情况下
      if(e.pp == false){
        document.getElementById('kk'+key).style.border = 'solid 1px #409EFF'
        document.getElementById('kk'+key).style.color= '#409EFF'
        this.forbidden == true
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
          console.log(e);
        }

      }else if(e.pp){
        // 当按钮按下了
        document.getElementById('kk'+key).style.border = 'solid 1px #dcdfe6'
        document.getElementById('kk'+key).style.color = '#606266'
        console.log("e.id:"+ e.id);
        console.log("e.key:" + e.key);
        console.log(this.addtable[this.addtable.length-1].allprice);
        // 这个地方删除有些问题!
        this.addtable[this.addtable.length -1].allprice.splice(e.key,1);
        for(let i=0;i<this.addtable[this.addtable.length-1].allprice.length -1;i++){
          this.buttonList[this.addtable[this.addtable.length-1].allprice[i].id].key = i;
        }
        if(this.addtable[this.addtable.length-1].allprice.length ==1){
          this.addtable[this.addtable.length-1].allprice.splice(0,1);
        }
        this.buttonList[key].pp = false;
      }
    },
    //添加属性值功能
    addInput(b,key){
      this.aa = true;
      // console.log(b);
      // 向指定的属性数组中添加属性值
      this.addtable[this.addtable.length-1].allprice[key].value.push({
        price:'',
      })
    },


  // 确认属性值
  gain(){
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
    this.forbidden = false;

    console.log(this.addtable);
    console.log(this.sku);
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
    // 属性恢复使用
    this.forbidden = true;
  },

  // 属性值按钮按下
  choice(e,key,kk){
    // 每次点击按钮之后把数据存到sku数组中
    this.sku[this.sku.length-1].price.push({
      ID:Date.now(),
      zhi:kk.value[key].price,
      name:kk.property,
    })
    console.log(this.sku);

    // if(this.select == false){
    //   document.getElementById('vv'+key).style.border = 'solid 1px #409EFF';
    //   document.getElementById('vv'+key).style.color= '#fff';
    //   document.getElementById('vv'+key).style.background= '#409EFF';

    // }else{
    //   document.getElementById('vv'+key).style.border = 'solid 1px #b3d8ff';
    //   document.getElementById('vv'+key).style.color= '#409EFF';
    //   document.getElementById('vv'+key).style.background= '#409EFF';

    // }
  },
  // 生成sku
  skuadd(){
    console.log(this.sku);


     console.log( this.sku[this.sku.length-1].price.length);
     if(this.sku[this.sku.length-1].price.length==0){
      this.$message({
          showClose: true,
          message: '请选择要添加的属性',
          type: 'error'
        });
     }else{
       // 获取点击按钮后的数据
       this.skuList = true;
    var bbb = [];
    for(var i = 0;i<this.sku[this.sku.length-1].price.length;i++){
      bbb[i] = this.sku[this.sku.length-1].price[i]
    }
     this.sku[this.sku.length-1].price.splice(0,this.sku[this.sku.length-1].price.length);
    console.log(this.sku);
    console.log(bbb);
    var ooo = [];
  for(var k = 0;k<bbb.length;k++){
    ooo.push(
         bbb[k].name + ':' + bbb[k].zhi
    )


  }
    var ppp = ooo.toString()
    // sku的id编号
    this.skuid++;
    this.ccc.push({
      id:this.skuid,
      ddd:ppp,
    })
    console.log(this.ccc)
     }

  },

  // 删除属性值
  shanchu(index,key){
    console.log(this.addtable[this.addtable.length-1].allprice[key].value[index]);
    // splice(this.addtable[this.addtable.length-1].allprice[index].value[index],0);
    this.addtable[this.addtable.length-1].allprice[key].value.splice(index,1);

  }


  }
    }
    
</script>

<style scoped>

</style>
