<template>
  <div class="curiseShip">
    <div class="buttonDv">
      <el-button class="el-button" type="primary" @click="saveFun(1)">保 存</el-button>
      <el-button class="el-button" type="primary" @click="saveFun(2)">下一步</el-button>
      <el-button class="el-button" type="danger" @click="cancalBtn">取 消</el-button>
    </div>
    <el-button class="el-button" type="warning" @click="addFun">添 加</el-button>
    <div class="contentBox" v-for="item in listData" :key="item.index">
      <p class="textP titleP">{{item.title}}</p>
      <p class="textP shortLine"><span class="titleSpan">城市：</span><span class="textSpan">{{item.city}}</span></p>
      <p class="textP shortLine"><span class="titleSpan">集合地点：</span><span class="textSpan">{{item.location}}</span></p>
      <p class="textP shortLine"><span class="titleSpan">价格：</span><span class="textSpan">{{item.price}}</span></p>
      <p class="textP"><span class="titleSpan">预定须知：</span><span class="textSpan">{{item.note}}</span></p>
      <p class="textP"><span class="titleSpan">贴心提示：</span><span class="textSpan">{{item.tips}}</span></p>
      <p class="textP">
        <span class="titleSpan">车程：</span>
        <el-table :data="item.tableData" border :highlight-current-row="true" :header-cell-style="getRowClass" :stripe="true" id="table-content">
          <el-table-column prop="direction" label="方向" align="center">
          </el-table-column>
          <el-table-column prop="origin" label="出发地" align="center">
          </el-table-column>
          <el-table-column prop="time" label="出发时间" align="center">
          </el-table-column>
          <el-table-column prop="destination" label="目的地" align="center">
          </el-table-column>
        </el-table>
      </p>
      <div class="buttonDv">
        <el-button class="el-button" type="primary" @click="edit(item)">编辑</el-button>
        <el-button class="el-button" type="danger" @click="deleteFun(item)">删除</el-button>
      </div>
    </div>
    <coachMsgAdd :dialogFormVisible='dialogFormVisible' :info='info' @close="closeAdd"></coachMsgAdd>
  </div>
</template>
<script type="text/javascript">
import coachMsgAdd from '@/page/productManagement/liner/addStep/2coachMsgAdd.vue'
import {formatDate} from '@/js/libs/publicMethod.js'
export default {
  name: "curiseShip",
  components: {
    coachMsgAdd
  },
  data() {
    return {
      listData: [
        {
          title: '',
          city: '',
          location: '',
          price: '',
          note: '',
          tips: '',
          tableData: []
        }
      ],
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
          that.$router.push({
            path: '/productList/productLiner',
            name: '邮轮'
          });
        }
      });
    },
    saveFun(type){
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/product/product/saveproductdeliver", {
        "button_type": type,
        "product_id": this.$route.query.id,
        "create_uid": sessionStorage.getItem('id'),
        "org_id": sessionStorage.getItem('orgID')
      }, ).then(function(response) {
        // console.log('del信息',response);
        if (response.data.code == '200') {
          that.$message({
            type: 'success',
            message: '创建成功!'
          });
          if(type == '1'){
            // alert('保存');
            // that.$router.back();
            that.$router.push({
              path: '/productList/productLiner',
              name: '邮轮'
            });
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
    addFun(){
      this.dialogFormVisible = true;
    },
    edit(item){
      this.dialogFormVisible = true;
      this.info = item.id;
    },
    closeAdd(){
      this.dialogFormVisible = false;
      this.info = '';
      this.loadData();
    },
    deleteFun(item){
      // console.log(item);
      const that = this;
      this.$confirm("是否删除本条接送大巴信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/product/product-deliver/del", {
          "id": item.id
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
    loadData(){
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/product/product-deliver/listall", {
        "product_id": this.$route.query.id
      }, ).then(function(response) {
        console.log('接送信息',response);
        if (response.data.code == '200') {
          if(response.data.data.list != 0){
            that.listData = [];
            response.data.data.list.forEach(function(item, index, arr){
              const itemData = {
                id: item.id,
                title: item.title,
                city: item.city,
                location: item.resort,
                price: item.price,
                note: item.reservation_notes,
                tips: item.reminder,
                tableData: [{
                  direction: '去程',
                  origin: item.go_place_departure,
                  time: item.go_time_departure ? formatDate(new Date(item.go_time_departure)).split(" ")[0] + ' ' + formatDate(new Date(item.go_time_departure)).split(" ")[1] : '',
                  destination: item.go_destination
                },{
                  direction: '返程',
                  origin: item.return_place_departure,
                  time: item.return_time_departure ? formatDate(new Date(item.return_time_departure)).split(" ")[0] + ' ' + formatDate(new Date(item.return_time_departure)).split(" ")[1] : '',
                  destination: item.return_destination
                }]
              }
              that.listData.push(itemData);
            });
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
    }
  },
  created() {
    if(this.$route.query.id){
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
    margin: 12px auto;
    .el-button{
      float: right;
      margin-right: 18px;
    }
  }
  .contentBox{
    border: 1px solid #666;
    width: 100%;
    margin: 10px auto;
    padding: 5px;
    box-sizing: border-box;
    .textP{
      margin: 0;
      padding: 0;
      width: 100%;
      line-height: 28px;
      vertical-align: top;
      .titleSpan{
        width: 100px;
        height: 100%;
        vertical-align: top;
        display: inline-block;
      }
    }
    .titleP{
      font-size: 18px;
      font-weight: 700;
      line-height: 40px;
    }
    .shortLine{
      width: 33%;
      display: inline-block;
    }
    .el-table{
      width: 90%;
      display: inline-block;
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
