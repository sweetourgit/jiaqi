<template>
  <div class="curiseShip">
    <div class="buttonDv">
      <el-button class="el-button" type="primary" @click="saveFun(1)">保 存</el-button>
      <el-button class="el-button" type="primary" @click="saveFun(2)">下一步</el-button>
      <el-button class="el-button" type="danger" @click="cancalBtn">取 消</el-button>
    </div>
    <el-button type="warning" @click='addCabin' class="addBtn">添加</el-button>
    <el-table :data="tableData" border :highlight-current-row="true" :header-cell-style="getRowClass" :stripe="true" id="table-content">
      <el-table-column prop="id" label="类型" align="center">
        <template slot-scope="scope"> 
          <div v-for='item in typeArr' :key="item.id">
            <span v-if='item.id == scope.row.type'>{{item.name}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" align="center">
      </el-table-column>
      <el-table-column prop="number" label="容纳人数" align="center">
      </el-table-column>
      <el-table-column prop="floor" label="楼层" align="center">
      </el-table-column>
      <el-table-column prop="consumption" label="消费" align="center">
      </el-table-column>
      <el-table-column prop="opening_hours" label="开放时间" align="center">
      </el-table-column>
      <el-table-column prop="introduce" label="简介" align="center">
      </el-table-column>
      <el-table-column prop="id" label="图片" align="center">
        <template slot-scope="scope"> 
          <ul class="picList">
            <li v-for="item in scope.row.pics" :key="item.index">
              <a :href="item.url" target="_blank">{{item.pic_name}}</a>
            </li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope"> 
          <el-button @click="edit(scope.row)" type="text" size="small" class="table_details">编辑</el-button>
          <el-button @click="deleteFun(scope.row)" type="text" size="small" class="table_details">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageCurrent" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total='total'>
      </el-pagination>
    </div> -->
    <cabinAdd :dialogFormVisible='dialogFormVisible' :info='info' @close="closeAdd"></cabinAdd>
  </div>
</template>
<script type="text/javascript">
import cabinAdd from '@/page/contentInfo/cruiseShip/detailAddStep/playMsgAdd.vue'
import {formatDate} from '@/js/libs/publicMethod.js'
export default {
  name: "curiseShip",
  components: {
    cabinAdd
  },
  data() {
    return {
      tableData: [],
      pageCurrent: 1,
      pageSize: 10,
      total: 0,
      dialogFormVisible: false,
      info: '',
      typeArr: [
        {
          id: "1",
          name: "船上娱乐"
        },{
          id: "2",
          name: "运动健身"
        },{
          id: "3",
          name: "海上休闲"
        },{
          id: "4",
          name: "其他"
        }
      ]
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
    cancalBtn(){
      const that = this;
      this.$confirm("是否取消本次添加?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "退出并保存",
        cancelButtonText: "退出并删除",
        type: "warning"
      }).then(() => {
        that.saveFun(1);
      }).catch( action => {
        if(action === 'cancel'){
          this.$router.push({
            path: '/cruiseShip/cruiseShipDetail',
            name: '邮轮管理/详情',
            query: {
              "id": this.$route.query.id
            }
          });
          localStorage.removeItem('liner_id');
        }
      });
    },
    saveFun(type){
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/liner/liner-entertainment/btnsave", {
        "button_type": type,
        "id": localStorage.getItem('liner_id'),
        "create_uid": sessionStorage.getItem('id'),
        "org_id": sessionStorage.getItem('orgID')
      }, ).then(function(response) {
        console.log('del信息',response);
        if (response.data.code == '200') {
          that.$message({
            type: 'success',
            message: '创建成功!'
          });
          if(type == '1'){
            // alert('保存');
            // that.$router.back();
            that.$router.push({
              path: '/cruiseShip/cruiseShipDetail',
              name: '邮轮管理/详情',
              query: {
                "id": that.$route.query.id
              }
            });
            localStorage.removeItem('liner_id');
          }else if(type == '2'){
            // alert('下一步');
            // localStorage.setItem('liner_id', response.data.data.liner_id);
            that.$parent.next();
          }
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
    },
    addCabin(){
      this.dialogFormVisible = true;
    },
    edit(row){
      this.dialogFormVisible = true;
      this.info = row.id;
    },
    closeAdd(){
      this.dialogFormVisible = false;
      this.info = '';
      this.loadData();
    },
    deleteFun(row){
      const that = this;
      this.$confirm("是否删除本条玩乐信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/liner/liner-entertainment/dellinerentertainment", {
          "id": row.id
        }, ).then(function(response) {
          console.log('del信息',response);
          if (response.data.code == '200') {
            that.$message.success("删除成功！");
            that.loadData();
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
      }).catch(() => {
        that.$message.warning("已取消~");
      });
    },
    handleSizeChange(){

    },
    handleCurrentChange(){

    },
    loadData(){
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/liner/liner-entertainment/listall", {
        "liner_id": localStorage.getItem('liner_id')
      }, ).then(function(response) {
        console.log('playMsg信息',response);
        if (response.data.code == '200') {
          that.tableData = response.data.data.list;
          that.total = response.data.data.list.length;
          that.tableData.forEach(function(item, index, arr){
            if(item.opening_hours){
              item.opening_hours = formatDate(new Date(item.opening_hours)).split(" ")[1];
            }

            item.pics.forEach(function(item, index, arr){
              item.url = item.pic_url;
            })
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
    if(localStorage.getItem('liner_id')){
      this.loadData();
    }
  },
  mounted() {

  }
}

</script>
<style lang="scss" scoped>
  .buttonDv{
    overflow: hidden;
    .el-button{
      float: right;
      margin-right: 18px;
    }
  }
  .addBtn{
    display: block;
    margin: 16px 0;
  }
  .block{
    display: block;
    text-align: center;
    margin: 10px auto;
  }
  .picList{
    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>
