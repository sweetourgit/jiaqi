<template style=" position: relative;">
<div class="labelList">
  <div>
    <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit">
      <el-tab-pane :key="index+''" v-for="(item, index) in editableTabs" :label="item.typeName" :name="index+''">
        <div class="labelBorder">
          <div class="searchBox">
            <!--清空-->
            <div style="float:left">
              <el-input placeholder="搜索标签名称" v-model="empty" class="empty" clearable></el-input>
              <el-button class="primary" @click="emptyButton()" type="primary">重置</el-button>
            </div>
            <!--编辑删除主题-->
            <div style="float:right;">
              <el-button class="primary" type="primary">编辑集合</el-button>
              <el-button class="primary" type="danger">删除集合</el-button>
            </div>
            <div class="actionButton">
              <el-button>添加标签</el-button>
              <el-button>编辑标签</el-button>
              <el-button>转移集合</el-button>
              <el-button type="danger">删除标签</el-button>
            </div>
            <el-table class="labelTable" :data="tableData" border style="width: 100%":header-cell-style="getRowClass">
              <el-table-column prop="number" type="selection" width="55" align="center"></el-table-column>
              <el-table-column prop="id" label="ID" width="180" align="center"></el-table-column>
              <el-table-column prop="typeName" label="标签名称" width="180" align="center"></el-table-column>
              <el-table-column prop="product" label="绑定相关产品" align="center"></el-table-column>
            </el-table>
            <!--分页-->
            <el-pagination class="pageList" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>

          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
  <!--弹窗-->
  <!--添加主题弹窗-->
  <div class="popup" v-show="gatherShow">
    <div class="mask" @click="gatherClose()"></div>
    <div class="add">
      <div class="gatherColor">
        <div class="gatherTitle">添加集合</div>
        <div class="gatherClose" @click="gatherClose()">×</div>
      </div>
      <div class="labelName">
        <div style="float:left; line-height:40px; margin:0 10px 0 70px;">集合名称：</div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" style="float:left;">
          <el-form-item prop="highlightWords">
            <el-input style="width:180px;" maxlength=10 v-model="ruleForm.highlightWords" placeholder="10个字以内"></el-input>
            <span class="span1">{{ruleForm.highlightWords.length}}/10字</span>
          </el-form-item>
        </el-form>
      </div>
      <div class="judge">
        <el-button @click="gatherClose()">取消</el-button>
        <el-button @click="addGather()" type="primary">确定</el-button>
      </div>
    </div>
  </div>
  <!--删除主题弹窗-->
  <div class="popup" v-show="deleteGatherShow">
    <div class="mask" @click="deleteGatherClose()"></div>
    <div class="add">
      <div class="gatherColor">
        <div class="gatherTitle">删除集合</div>
        <div class="gatherClose" @click="deleteGatherClose()">×</div>
      </div>
      <div class="judge">
        <el-button @click="deleteGatherClose()">取消</el-button>
        <el-button @click="deleteGather(ensure)" type="primary">确定</el-button>
      </div>
    </div>
  </div>
  <!--绑定相关产品弹窗-->
  <div class="popup" v-show="contentShow=false">
    <div class="mask"></div>
    <div class="add">
      <div class="gatherColor">
        <div class="gatherTitle">绑定相关产品</div>
        <div class="gatherClose">×</div>
      </div>
    </div>
  </div>

</div>

</template>
<script>
  export default {
    data() {  
       return {
        editableTabsValue: '0',
        editableTabs: [],
        tabIndex: 0,
        empty:'',//清空搜索框
        tableData: [],
        //分页
        currentPage: 1,
        total:1,
        pagesize:2,
        aindex:0,
        //弹窗字数限制
        ruleForm:{
          highlightWords: '',
        },
        rules:{
          highlightWords:[
            { required: true, message: '不能为空', trigger: 'blur' },
            { min: 0, max: 10, message: '字数超过10汉字限制', trigger: 'blur' },
          ],
        },
        gatherShow:false,//添加主题弹窗
        deleteGatherShow:false,//删除主题弹窗
        ensure:'',//删除主题
       };   
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
        
    },
    //进入页面开始执行的方法
    mounted(){
      this.pageList();
    },
    methods: {
      //添加删除主题
      handleTabsEdit(targetName, action) {
        if (action === 'add') {
          if(this.gatherShow==false){
            this.gatherShow=true;
            return false;
          }else{
          let newTabName = ++this.tabIndex + '';
          this.editableTabs.push({
            typeName: this.ruleForm.highlightWords,
            //name: newTabName,
            content: 'New Tab content'
          });
          this.editableTabsValue = (newTabName-1).toString();
          console.log(this.editableTabsValue)
          }
        }
        if (action === 'remove') {
           
          if(this.deleteGatherShow==false){            
            this.deleteGatherShow=true;
            this.aindex = targetName;
            return false;
          }
          else{
            let tabs = this.editableTabs;
            let activeName = this.editableTabsValue;
            if (activeName === targetName) {
              tabs.forEach((tab, index) => {
                if (tab.name === targetName) {
                  let nextTab = tabs[index + 1] || tabs[index - 1];
                  if (nextTab) {
                    activeName = nextTab.name;
                  }
                }
              });
            }
            this.editableTabsValue = activeName;
            this.editableTabs = tabs.filter(tab => tab.name !== targetName);
          }
        }
      },
      //清空搜索框
      emptyButton(){
        this.empty = ''
      },
      //表格标题样式
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#F7F7F7'
        } else {
          return ''
        }
      },
      //分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      //添加主题弹窗关闭、确定添加
      gatherClose(){
        this.gatherShow = false;
        this.ruleForm.highlightWords='';
      },
      addGather() {
        this.handleTabsEdit(this.tabIndex, "add");
        this.gatherShow = false;
        this.addTheme();
        this.ruleForm.highlightWords='';
      },
      //删除主题弹窗关闭、确定删除
      deleteGatherClose(){
        this.deleteGatherShow = false;
      },
      deleteGather(ensure){
        this.handleTabsEdit(this.tabIndex, "remove");
        this.deleteGatherShow = false;
      
       // this.editTheme();
      },
      //添加主题方法
      addTheme(){
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            var _this = this;
            this.$http.post(this.GLOBAL.serverSrc + "/universal/labletype/api/insert",
              {
                object: {
                  id: 0,
                  typeName: this.ruleForm.highlightWords,
                  createTime: "2019-03-04T06:08:17.118Z",
                  code: "string",
                  isDeleted: 0
                }
              })
              .then(function(response) {
                if(response.data.isSuccess == false){
                  _this.$message.error("添加失败,该供应商已存在");
                } else {
                  _this.ruleForm.highlightWords = '';
                  _this.pageList();
                }
                
              })
          } else {
            return false;
          }
        });
      },
      //删除主题方法
      editTheme(index){
        let _this = this;
        this.$http.post(this.GLOBAL.serverSrc + "/universal/labletype/api/delete", {
          id: 0
        })
          .then(function(response) {
            _this.$message({
              type: "success",
              message: "删除成功!"
            });
            _this.pageList();
          })
          .catch(function(error) {
            console.log(error);
          });
      },
      //列表显示
      pageList() {
        var that = this
        this.$http.post(
          this.GLOBAL.serverSrc + "/universal/labletype/api/list",
          {
            "pageIndex": 0,
            "pageSize": 0,
            "total": 0,
            "object": {
              "id": 0,
              "typeName": "",
              "createTime": "2019-03-04T06:03:19.464Z",
              "code": "string",
              "isDeleted": 0
            }
          },)
          .then(function (obj) {
            that.total = obj.data.total
            that.editableTabs = obj.data.objects
            that.tabIndex = that.editableTabs.length
          //  that.editableTabsValue = that.editableTabs.length
          })
          .catch(function (obj) {
            console.log(obj)
          })
      },

    }
}




   

</script>













<style scoped>
/*整体样式*/
.labelList{ font-family: '微软雅黑'; font-size: 11pt; margin: 0 0 100px 0;overflow: hidden; max-width: 900px; min-width: 630px;}
/*外边框*/
.labelBorder{border-left:1px solid #e6e6e6;border-right:1px solid #e6e6e6;border-bottom:1px solid #e6e6e6; margin:0 0 20px 0; overflow: hidden; clear: both;}
.searchBox{ margin: 20px 15px 20px 15px; overflow: hidden; }
/*穿刺去除向上的距离*/
.el-tabs--card>>>.el-tabs__header{margin: 0 !important;}
/*清空搜索框*/
.empty{float: left; width: 340px;}
.primary{float: left; margin: 0 0 0 10px;}
/*功能按钮*/
.actionButton{clear: both; padding: 20px 0 0 0;}
/*表格列表*/
.labelTable{text-align: center; margin: 20px 0 0 0;}
/*分页*/
.pageList{float:right; margin: 20px 0 0 0;}
/*弹窗*/
.mask{background-color: #000; width: 100%; height: 100%; position: fixed; top: 0; left: 0;filter:alpha(opacity=50);opacity:0.5; z-index: 100;}
.add {width: 450px; height: 250px; margin:auto; position: fixed;top: 50%; left: 50%; margin-top: -125px; margin-left:-225px;background-color: #fff; overflow: hidden; border: 1px solid #eeeeee; border-radius: 3px; z-index: 1000;}
.gatherColor{height: 40px; background: #f6f6f6;border-bottom: 1px solid #eee; line-height: 40px;}
.gatherTitle{float:left; margin: 0 0 0 20px;}
.gatherClose{float:right; margin: 0 20px 0 0; font-size: 16pt; cursor:pointer; }
.labelName{width: 400px; margin-left:auto; margin-right:auto; margin: 50px 0 0 0; text-align: center; }
.el-form>>>.el-form-item{margin-bottom:0px;}
.judge { padding: 30px 0 0 0; clear: both; text-align: center;}
</style>




