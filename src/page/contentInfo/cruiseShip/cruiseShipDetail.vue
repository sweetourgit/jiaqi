<template>
  <div class="curiseShipDetail">
    <div class="baseContent">
      <div class="topDv">
        <p class="title">基本信息</p>
        <el-button @click="cancal" type="primary" plain>取消</el-button>
        <el-button @click="edit" type="primary">编辑</el-button>
      </div>
      <div class="msg">
        <div class="itemMsg"><span class="labelSpan">ID：</span><p class="infoMsg">{{baseInfo.id}}</p></div>
        <div class="itemMsg"><span class="labelSpan">邮轮公司名称：</span><p class="infoMsg">{{baseInfo.company}}</p></div>
        <div class="itemMsg"><span class="labelSpan">旗下邮轮：</span><p class="infoMsg">{{baseInfo.shipNum}}</p></div>
        <div class="itemMsg"><span class="labelSpan">操作人：</span><p class="infoMsg">{{baseInfo.person}}</p></div>
        <div class="itemMsg"><span class="labelSpan">修改时间：</span><p class="infoMsg">{{baseInfo.date}}</p></div>
        <div class="itemMsg"><span class="labelSpan">LOGO：</span>
          <ul class="infoMsgList">
            <li v-for="item in fileList" :key="item.index">
              <a :href="item.pic_url" target="_blank">{{item.pic_name}}</a>
            </li>
          </ul>
        </div>
        <div class="itemMsg"><span class="labelSpan">图片：</span>
          <ul class="infoMsgList">
            <li v-for="item in fileList1" :key="item.index">
              <a :href="item.pic_url" target="_blank">{{item.pic_name}}</a>
            </li>
          </ul>
        </div>
        <div class="itemMsg itemMsgLong"><span class="labelSpan">简介：</span><p class="infoMsg">{{baseInfo.information}}</p></div>
      </div>
      <div class="topDv">
        <p class="title">旗下邮轮</p>
        <el-button @click="routerToAdd" type="warning">添加</el-button>
      </div>
      <!-- 表格 -->
      <el-table :data="tableData" border :highlight-current-row="true" :header-cell-style="getRowClass" :stripe="true" id="table-content">
        <el-table-column prop="id" label="ID" align="center">
        </el-table-column>
        <el-table-column prop="name" label="邮轮名称" align="center">
        </el-table-column>
        <el-table-column prop="updated_at" label="更新时间" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="editShip(scope.row)" type="text" size="small" class="table_details" v-if="scope.row.line_status == 2">补充完整</el-button>
            <el-button @click="editShip(scope.row)" type="text" size="small" class="table_details" v-if="scope.row.line_status == 1">编辑</el-button>
            <el-button @click="deleteFun(scope.row)" type="text" size="small" class="table_details">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageCurrent" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total='total'>
        </el-pagination>
      </div>
      <!-- 表格 END -->
    </div>
    <cruiseShipAdd :dialogFormVisible='dialogFormVisible' :info='info' @close="closeAdd"></cruiseShipAdd>
  </div>
</template>
<script type="text/javascript">
import cruiseShipAdd from '@/page/contentInfo/cruiseShip/cruiseShipAdd.vue'
import {formatDate} from '@/js/libs/publicMethod.js'
export default {
  name: "curiseShipDetail",
  components: {
    cruiseShipAdd
  },
  data() {
    return {
      baseInfo: {
        id: '',
        company: '',
        shipNum: '',
        person: '',
        date: '',
        logo: '',
        picture: '',
        information: ''
      },

      fileList: [],
      fileList1: [],

      tableData: [{}], // 表格数据
      pageCurrent: 1, // 当前页数
      pageSize: 10, // 每页条数
      total: 0, // 总条数

      dialogFormVisible: false,
      info: ''
    }
  },
  computed: {},
  methods: {
    // 表格header设置
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
    // 编辑
    edit(row){
      this.dialogFormVisible = true;
      this.info = 'id';
    },
    // 关闭添加弹框
    closeAdd(){
      this.dialogFormVisible = false;
      this.info = '';
    },
    cancal(){
      this.$router.push({
        path: '/cruiseShip',
        name: '邮轮管理'
      });
    },
    routerToAdd(){
      this.$router.push({
        path: '/cruiseShip/shipDetailAdd',
        name: '邮轮管理/详情/添加游轮',
        query: {
          "id": this.$route.query.id
        }
      });
    },

    // 编辑
    editShip(row){
      localStorage.setItem('liner_id', row.id);
      if(row.line_status == 1){//编辑
        this.$router.push({
          path: '/cruiseShip/shipDetailAdd',
          name: '邮轮管理/详情/添加游轮',
          query: {
            "id": row.id,
            "step": 0
          }
        });
      }else{
        this.$router.push({//补充完整
          path: '/cruiseShip/shipDetailAdd',
          name: '邮轮管理/详情/添加游轮',
          query: {
            "id": row.id,
            "step": row.cur_steps
          }
        });
      }
    },
    // 删除
    deleteFun(){

    },

    // 改变每页条数
    handleSizeChange(val){
      this.pageSize = val;
      this.pageCurrent = 1;
    },
    // 改变页数
    handleCurrentChange(val){
      this.pageCurrent = val;
    },
    // 加载数据
    loadData(){
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/liner/liner-company/viewlinercom", {
        "id": this.$route.query.id
      }, ).then(function(response) {
        console.log('获取邮轮公司detail',response);
        if (response.data.code == '200') {
          that.baseInfo = {
            id: response.data.data.id,
            company: response.data.data.name,
            shipNum: response.data.data.linernums,
            person: response.data.data.create_third_user,
            date: formatDate(new Date(response.data.data.updated_at*1000)),
            information: response.data.data.introduce
          },
          that.fileList = response.data.data.logo;
          that.fileList1 = response.data.data.pics;
          that.fileList[0].pic_url = "http://yl.dayuntong.com" + response.data.data.logo[0].pic_url;
          that.fileList1.forEach(function(item, index, arr){
            item.pic_url = "http://yl.dayuntong.com" + response.data.data.pics[index].pic_url;
          })

        } else {
          if(response.data.message){
            that.$message.warning(response.data.message);
          }else{
            that.$message.warning("加载数据失败~");
          }
        }
      }).catch(function(error) {
        console.log(error);
      });
      this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/liner/liner/listpage", {
        "pageIndex": this.pageCurrent,
        "pageSize": this.pageSize,
        // "name": this.company,
        "company_id": this.$route.query.id
      }, ).then(function(response) {
        console.log('获取邮轮',response);
        if (response.data.code == '200') {
          that.tableData = response.data.data.list;
          that.total = response.data.data.total - 0;
          that.tableData.forEach(function(item, index, arr){
            item.updated_at = formatDate(new Date(item.updated_at*1000));
          })
        } else {
          if(response.data.message){
            that.$message.warning(response.data.message);
          }else{
            that.$message.warning("加载数据失败~");
          }
        }
      }).catch(function(error) {
        console.log(error);
      });
    }
  },
  created() {
    this.loadData();
  },
  mounted() {

  }
}

</script>
<style lang="scss" scoped>
  .curiseShipDetail{
    .baseContent{
      width: 98%;
      margin: 25px auto;
      min-width: 1096px;
      .topDv{
        overflow: hidden;
        margin: 10px auto;
        .title{
          font-size: 20px;
          float: left;
          margin: 0;
          line-height: 40px;
        }
        .el-button{
          float: right;
          margin-right: 20px;
        }
      }
      .msg{
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        flex-direction: row;
        flex-wrap: wrap;
        background-color: #f7f7f7;
        padding: 18px;
        .itemMsg{
          width: 33.333%;
          line-height: 32px;
          font-size: 14px;
          .labelSpan{
            display: inline-block;
            width: 120px;
            vertical-align: top;
          }
          .infoMsg{
            display: inline-block;
            width: calc(100% - 120px);
            margin: 0;
          }
          .infoMsgList{
            display: inline-block;
            width: calc(100% - 150px);
            margin: 0;
            padding: 0;
            list-style: none;
          }
        }
        .itemMsgLong{
          width: 66.666%;
        }
      }
      #table-content{
        width: 100%;
        margin: 20px auto;
      }
      .block{
        width: 100%;
        text-align: center;
        margin: 30px auto;
      }
    }
  }
</style>