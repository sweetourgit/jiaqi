<template>
  <div class="curiseShip">
    <div class="buttonDv">
      <el-button class="el-button" type="primary" @click="saveFun(1)">保 存</el-button>
      <el-button class="el-button" type="primary" @click="saveFun(2)">下一步</el-button>
      <el-button class="el-button" type="danger" @click="cancalBtn">取 消</el-button>
    </div>
    <div style="margin-bottom: 20px;">
      <el-button
        size="small"
        @click="addTab(editableTabsValue)"
      >
        添加签证信息
      </el-button>
    </div>
    <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="loadList()">
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        <p class="topTitle"><span>*</span>标题：</p>
        <el-input v-model="item.content.title" class="inputWidth" placeholder="请输入" style="width: 68%;" @blur="getTitle(item.content.title)"></el-input>
        <el-button type="warning" @click='addVisa' class="addBtn">新增一行</el-button>
        <el-radio-group v-model="item.content.crowdID" style="margin-bottom:12px;" @change="loadList()">
          <el-radio-button v-for="item in typeArr" :key="item.id" :label="item.id">{{item.name}}</el-radio-button>
        </el-radio-group>

        <el-table :data="item.content.tableData" border :highlight-current-row="true" :header-cell-style="getRowClass" :stripe="true" id="table-content">
          <el-table-column prop="type" label="类型" align="center">
          </el-table-column>
          <el-table-column prop="name" label="名称" align="center">
          </el-table-column>
          <el-table-column prop="describe" label="描述" align="center">
          </el-table-column>
          <el-table-column prop="must" label="必须" align="center">
            <template slot-scope="scope"> 
              <span v-if="scope.row.must == 1">是</span>
              <span v-if="scope.row.must == 2">否</span>
            </template>
          </el-table-column>
          <el-table-column prop="enclosure" label="附件" align="center">
            <template slot-scope="scope"> 
              <a :href="GLOBAL.serverSrcYL + scope.row.enclosure" target="blank">{{scope.row.enclosure}}</a>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button @click="edit(scope.row)" type="text" size="small" class="table_details">编辑</el-button>
              <el-button @click="deleteFun(scope.row)" type="text" size="small" class="table_details">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    
    <visaMsgAdd :dialogFormVisible='dialogFormVisible' :info='info' @close="closeAdd"></visaMsgAdd>
    <viseCopy :dialogFormVisibleCopy='dialogFormVisibleCopy' @close="closeCopy"></viseCopy>
  </div>
</template>
<script type="text/javascript">
import visaMsgAdd from '@/page/productManagement/liner/addStep/4visaMsgAdd.vue'
import viseCopy from '@/page/productManagement/liner/addStep/4visaMsgCopy.vue'
import {formatDate} from '@/js/libs/publicMethod.js'
export default {
  name: "curiseShip",
  components: {
    visaMsgAdd,
    viseCopy
  },
  data() {
    return {
      editableTabsValue: '1',
      editableTabs: [{
        title: '签证信息 1',
        name: '1',
        content: {
          "id": '',
          "title": '',
          "crowdID": '1',
          "visa_id": '',
          "tableData": []
        }
      }],
      dialogFormVisible: false,
      info: '',
      dialogFormVisibleCopy: false,
      typeArr: [
        {
          id: "1",
          name: "在职"
        },{
          id: "2",
          name: "自由职业"
        },{
          id: "3",
          name: "在校学生"
        },{
          id: "4",
          name: "退休"
        },{
          id: "5",
          name: "学龄前儿童"
        }
      ]
    }
  },
  computed: {},
  methods: {
    // 删除tab
    removeTab(targetName){
      console.log(targetName);
      const that = this;
      let deleteID = '', deleteTitle = '';
      this.editableTabs.forEach(function(item, index, arr){
        if(item.name == targetName){
          deleteID = item.content.id;
          deleteTitle = item.title;
        }
      })
      this.$confirm("确认删除 "+ deleteTitle +"?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.post(this.GLOBAL.serverSrcYL + '/linerapi/v1/product/product/delproductvisa', {
          "id": deleteID
        }).then(res => {
          // console.log(res);
          if (res.data.code == 200) {
              that.$message({
                type: 'success',
                message: '删除成功!'
              });
              that.loadData();
          } else {
              if(res.data.message){
              that.$message({
                  type: 'warning',
                  message: res.data.message
              });
              }else{
              that.$message({
                  type: 'warning',
                  message: '删除失败'
              });
              }
          }
        }).catch(err => {
          console.log(err)
        })
      }).catch( action => {
        
      });
    },
    // 添加签证tab
    addTab(){
      this.dialogFormVisibleCopy = true;
    },
    // 复制签证
    closeCopy(str){
      // alert(str);
      if(str == 'copy'){
        this.dialogFormVisibleCopy = false;
        this.loadData();
      }else if(str == 'add'){
        this.dialogFormVisibleCopy = false;
        let newTabName = (this.editableTabs.length + 1).toString();
        this.editableTabs.push({
          title: '签证信息' + newTabName,
          name: newTabName,
          content: {
            "title": '',
            "crowdID": '1',
            "visa_id": '',
            "tableData": []
          }
        });
        this.editableTabsValue = newTabName;
      }else if(str == 'cancle'){
        this.dialogFormVisibleCopy = false;
      }
    },
    getTitle(str){
      // alert(str);
      const num = this.editableTabsValue - 1;
      this.editableTabs[num].title = str;
    },
    // 表格header设置
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
    // 取消
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
    // 保存
    saveFun(type){
      const that = this;
      let visaList = [];
      this.editableTabs.forEach(function(item, index, arr){
        visaList.push({
          "id": item.id,
          "title": item.content.title
        })
      })
      this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/product/product/saveproductvisa", {
        "button_type": type,
        "product_id": this.$route.query.id,
        "visa": visaList,
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
    // 添加
    addVisa(){
      const num = parseInt(this.editableTabsValue - 1);
      // alert(num);
      if(this.editableTabs[num].content.title != '' || this.editableTabs[num].content.visa_id != ''){
        this.dialogFormVisible = true;
        this.info = {
          title: this.editableTabs[num].content.title,
          visa_id: this.editableTabs[num].content.visa_id
        }
      }else{
        this.$message.warning("请填写标题后创建签证详情！");
      }
      
    },
    // 编辑
    edit(row){
      const num = parseInt(this.editableTabsValue - 1);
      this.dialogFormVisible = true;
      this.info = {
        id: row.id,
        title: this.editableTabs[num].content.title,
        visa_id: this.editableTabs[num].content.visa_id
      };
    },
    closeAdd(){
      this.dialogFormVisible = false;
      this.info = '';
      this.loadList();
    },
    // 删除
    deleteFun(row){
      const that = this;
      this.$confirm("是否删除本条签证信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/product/product-visa-info/del", {
          "id": row.id
        }, ).then(function(response) {
          // console.log('del信息',response);
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
    // 加载签证信息表格数据
    loadList(){
      const that = this;
      const num = parseInt(this.editableTabsValue - 1);
      let visaID = '';
      if(this.editableTabs[num].content.visa_id){
        visaID = this.editableTabs[num].content.visa_id;
      }else if(localStorage.getItem("visa_id")){
        visaID = parseInt(localStorage.getItem("visa_id"));
      }else{
        this.editableTabs[num].content.tableData = [];
        return;
      }
      this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/product/product-visa-info/listall", {
        "visa_id": visaID,
        "crowd_id": this.editableTabs[num].content.crowdID
      }, ).then(function(response) {
        // console.log('签证详情',response);
        if (response.data.code == '200') {
          that.editableTabs[num].content.tableData = response.data.data.list;
          if(response.data.data.list.length != 0){
            that.editableTabs[num].content.visa_id = response.data.data.list[0].visa_id;
            if(localStorage.getItem("visa_id")){
              localStorage.removeItem("visa_id");
            }
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
    // 加载签证数据
    loadData(){
      const that = this;
      
      this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/product/product/getproductvisa", {
        "product_id": this.$route.query.id
      }, ).then(function(response) {
        // console.log('签证信息',response);
        if (response.data.code == '200') {
          if(response.data.data.list.length != 0){
            that.editableTabs = [];
            response.data.data.list.forEach(function(item, index, arr){
              that.editableTabs.push({
                title: item.title,
                name: (index + 1).toString(),
                content: {
                  "id": item.id,
                  "title": item.title,
                  "crowdID": '1',
                  "visa_id": item.visa_info ? item.visa_info[0].visa_id : '',
                  "tableData": item.visa_info
                }
              })
            })

            that.loadList();
          }else{
            that.editableTabs = [{
              title: '签证信息 1',
              name: '1',
              content: {
                "id": '',
                "title": '',
                "crowdID": '1',
                "visa_id": '',
                "tableData": []
              }
            }]
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
    .el-button{
      float: right;
      margin-right: 18px;
    }
  }
  .topTitle{
    display: inline-block;
    width: 88px;
    span{
      color: red;
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
