<template>
  <div class="all">
    <!--头部搜索bg-->
    <div class="header">
        <div class="header_add">
          <el-button type="primary" @click="addhotel">添加酒店</el-button>
        </div>
        <div class="header_seach">
          <div class="search-input">
            <el-input v-model="search_text" placeholder="请输入中文名称\英文名称\目的地"  clearable></el-input>
          </div>
          <div class="search-button">
            <el-button  size="medium" type="primary" icon="el-icon-search" ></el-button>
          </div>
        </div>
    </div>
    <!--头部搜索ed-->
    <!--left tree begin-->
    <div class="left_tree">
      <div class="tree_size">
        <el-tree
          :props="props1"
          :load="loadNode1"
          lazy
            >
        </el-tree>
      </div>
    </div>
    <!--left tree end-->
    <!--right img begin-->
    <div class="img">
      <div class="img_border" v-for="(item,index) of img" :key=""index>
        <div class="image_size">
          <img :src="item.imgUrl" style="width: 550px;height: 400px">
        </div>
        <div class="hotchi" v-model="item.hotelchina">{{item.hotelchina}}</div>
        <div class="hoteng" v-model="item.hotelenglish">{{item.hotelenglish}}</div>
        <div class="start">
          <el-rate
            v-model="item.value5"
            disabled
            text-color="#ff9900"
            score-template="{item.value}">
          </el-rate>
        </div>
      </div>
    </div>
    <!--right img end-->
    <!--page begin-->
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
    <!--page end-->
    <!--弹出层bg-->
    <div>

      <el-dialog title="新增和编辑页面" :visible.sync="dialogFormVisible" width="80%">
        <div class="info_title">
          基础信息
        </div>
        <el-form :model="form" :inline="true" class="clearfix form_left" >
          <div class="left_input">
          <el-form-item label="活动名称" :size	="mini">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="活动名称" :size	="mini">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="活动名称" :size	="mini">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="活动名称" :size	="mini">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="活动名称" :size	="mini">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </div>
          <div class="middle_input">
            <el-form-item label="活动名称" :size	="mini">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="活动名称" :size	="mini">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="活动名称" :size	="mini">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="活动名称" :size	="mini">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="活动名称" :size	="mini">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </div>
          <div class="right_input">

            <el-form-item label="活动名称" :size	="mini">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
              >
              </el-input>
            </el-form-item>
          </div>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!--弹出层end-->
  </div>

</template>
<script>
  export default {
    data() {
      return {
        dialogFormVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px',
        img:[
          {
            imgUrl:'http://victor-t.cn/7.png',
            hotelchina:'平八茶楼酒店',
            hotelenglish:'Heihachi Tea House Inn',
            value5: 3.7,
          },{
            imgUrl:'http://victor-t.cn/7.png',
            hotelchina:'平八茶楼酒店',
            hotelenglish:'Heihachi Tea House Inn',
            value5: 3.7,
          },{
            imgUrl:'http://victor-t.cn/7.png',
            hotelchina:'平八茶楼酒店',
            hotelenglish:'Heihachi Tea House Inn',
            value5: 3.7,
          },{
            imgUrl:'http://victor-t.cn/7.png',
            hotelchina:'平八茶楼酒店',
            hotelenglish:'Heihachi Tea House Inn',
            value5: 3.7,
          }
        ],
        currentPage4: 4,
        search_text:'',
        props1: {
          label: 'name',
          // children: 'zones',
          // isLeaf: 'leaf'
        },
      }
    },
    methods: {
      //添加酒店
      addhotel(){
        this.dialogFormVisible =  true
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      loadNode1(node, resolve) {
        console.log(node)
        if (node.level === 0) {
          //获取顶级组织
          return resolve([{ name: 'region' },{name:'qqq'}]);
        }
        if (node.level > 1) return resolve([]);

        setTimeout(() => {
          const data = [{
            name: 'leaf',
            leaf: true
          }, {
            name: 'zone'
          }];

          resolve(data);
        }, 500);
      }
    }



  }
</script>

<style scoped>
  .all{
    width: 100%;
    padding-bottom: 40px;
    overflow: auto;
  }
  .header{
    height: 50px;
  }
  .header_add{
    float: left;
  }
  .header_seach{
    float: right;
    margin-right: 80px;
  }
  .search-input{
    width: 353px;
    float: left;
  }
  .search-button{
    float: left;
    margin-left: 20px
  }
  .left_tree {
      float: left;
      margin-top: 10px;
      width: 400px;
      height: 70%;
      border:1px solid #fff;
      box-shadow:3px 3px 3px #EDEDED,3px -3px 3px #EDEDED,-3px 3px 3px #EDEDED,-3px -3px 3px #EDEDED;
      margin-left: 5px;
  }
  .tree_size{
    margin: 0 auto;
    padding-top: 10px;
    width: 300px;
    height: 500px;
    overflow: auto;
  }
  .img{
    margin-top: 10px;
    float: left;
    width: 1157px;
  }
  .image_size{
    height: 400px;
    background: #8c939d;
  }
  .img_border{
    margin-left: 20px;
    margin-bottom: 10px;
    width: 550px;
    height: 480px;
    float: left;
  }
  .block{
    float: right;
    margin-right: 68px;
    margin-top: 10px;
  }
  .hotchi{
    text-align: left;
    font-weight: bolder;
    margin-top: 10px;
  }
  .hoteng{
    text-align: left;
    margin-top: 10px;
  }
  .start{
    text-align: left;
    margin-top: 10px;
  }
  .info_title{
    height: 30px;
    font-size: 16px;
    text-align: left;
  }
  .left_input{
    width: 300px;
    height: 300px;
    float: left;
    margin-left: 30px;
  }
  .middle_input{
    width: 300px;
    height: 300px;
    float: left;
    margin-left: 200px;
  }
  .right_input{
    width: 300px;
    height: 300px;
    float: left;
  }
  .clearfix:after{
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  .clearfix{
    zoom:1;
  }



</style>
