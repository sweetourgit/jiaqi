<template style=" position: relative;">
<div class="labelList">
  <div>
    <!--tabs切换-->
    <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit" @tab-click="handleClick">
<<<<<<< HEAD
      <el-tab-pane :key="index+''" v-for="(item, index) in editableTabs" :label="item.typeName" :name="index+''"></el-tab-pane>
=======
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
              <el-button class="primary" @click="editGatherTheme($event)" type="primary">编辑集合</el-button>
              <el-button class="primary" type="danger" @click="deleteGatherTheme()">删除集合</el-button>
            </div>
            <div class="actionButton">
              <el-button>添加标签</el-button>
              <el-button :disabled="forbidden">编辑标签</el-button>
              <el-button :disabled="forbidden1">转移集合</el-button>
              <el-button :disabled="forbidden1">删除标签</el-button>
            </div>
            <el-table :data="tableData" ref="multipleTable" class="labelTable" :header-cell-style="getRowClass" border :row-style="rowClass"@selection-change="changeFun" @row-click="clickRow">
              <el-table-column prop="id" label="ID" width="180" align="center"></el-table-column>
              <el-table-column prop="labelName" label="标签名称" width="180" align="center"></el-table-column>
              <el-table-column prop="product" label="绑定相关产品" align="center"></el-table-column>
            </el-table>
            <!--分页-->
            <el-pagination class="pageList" :page-sizes="[10,1,30,50]" background @size-change="handleSizeChange" :page-size="pagesize" :current-page.sync="currentPage" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>

          </div>
        </div>
      </el-tab-pane>
>>>>>>> 4ebe0cbbeb16b43959c80a2c00cc2166a8ac165b
    </el-tabs>
    <!--表格-->
    <div class="labelBorder">
      <div class="searchBox">
        <!--清空-->
        <div style="float:left">
          <el-input placeholder="搜索标签名称" v-model="empty" class="empty" clearable></el-input>
          <el-button class="primary" @click="emptyButton()" type="primary">重置</el-button>
        </div>
        <!--编辑删除主题-->
        <div style="float:right;">
          <el-button class="primary" @click="editGatherTheme($event)" type="primary">编辑集合</el-button>
          <el-button class="primary" type="danger" @click="deleteGatherTheme()">删除集合</el-button>
        </div>
        <div class="actionButton">
          <el-button>添加标签</el-button>
          <el-button :disabled="forbidden">编辑标签</el-button>
          <el-button :disabled="forbidden1">转移集合</el-button>
          <el-button :disabled="forbidden1">删除标签</el-button>
        </div>
        <el-table :data="tableData" ref="multipleTable" class="labelTable" :header-cell-style="getRowClass" border :row-style="rowClass"@selection-change="changeFun" @row-click="clickRow">
          <el-table-column prop="id" label="ID" width="180" align="center"></el-table-column>
          <el-table-column prop="labelName" label="标签名称" width="180" align="center"></el-table-column>
          <el-table-column prop="product" label="绑定相关产品" align="center"></el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination class="pageList" :page-sizes="[10,1,30,50]" background @size-change="handleSizeChange" :page-size="pagesize" :current-page.sync="currentPage" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </div>
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
  <!--编辑主题弹窗-->
  <div class="popup" v-show="editGatherShow">
    <div class="mask" @click="editGatherClose()"></div>
    <div class="add">
      <div class="gatherColor">
        <div class="gatherTitle">编辑集合</div>
        <div class="gatherClose" @click="editGatherClose()">×</div>
      </div>
      <div class="labelName">
        <div style="float:left; line-height:40px; margin:0 10px 0 70px;">集合名称：</div>
        <el-form :model="ruleForm_01" :rules="rules" ref="ruleForm_01" style="float:left;">
          <el-form-item prop="highlightWords01">
            <el-input style="width:180px;" maxlength=10 v-model="ruleForm_01.highlightWords01" placeholder="10个字以内"></el-input>
            <span class="span1">{{ruleForm_01.highlightWords01.length}}/10字</span>
          </el-form-item>
        </el-form>
      </div>
      <div class="judge">
        <el-button @click="editGatherClose()">取消</el-button>
        <el-button @click="editTheme()" type="primary">确定</el-button>
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
        //表格数据
        tableData: [],
        multipleSelection: [],
        forbidden1:true,
        forbidden:true,
        //分页
        currentPage: 1,
        total:0,
        pagesize:10,
        //弹窗字数限制
        ruleForm:{
          highlightWords: '',
        },
        ruleForm_01:{
          highlightWords01:'',
        },
        rules:{
          highlightWords:[
            { required: true, message: '不能为空', trigger: 'blur' },
            { min: 0, max: 10, message: '字数超过10汉字限制', trigger: 'blur' },
          ],
          highlightWords01:[
            { required: true, message: '不能为空', trigger: 'blur' },
            { min: 0, max: 10, message: '字数超过10汉字限制', trigger: 'blur' },
          ],
        },
        gatherShow:false,//添加主题弹窗
        deleteGatherShow:false,//删除主题弹窗
        ensure:'',//删除主题
        editGatherShow:false,//编辑主题弹窗
        clickTab:'',//点击切换获取当前值
        sid:'',
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
            this.editableTabsValue = targetName;
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
          return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px'
        } else {
          return ''
        }
      },
      //产品列表勾选button显示
      changeFun(val) {
        this.multipleSelection=val;
        if(this.multipleSelection.length==1){
          this.forbidden=false;
        }else{
          this.forbidden=true;
        };
        if(this.multipleSelection.length>0){
          this.forbidden1=false;
        }else{
          this.forbidden1=true;
        }
        //event.cancelBubble = true;//row-click和selection-change耦合事件
      },
      clickRow(row){    //选中行复选框勾选
        this.$refs.multipleTable.clearSelection(); //清空用户的选择  
        this.$refs.multipleTable.toggleRowSelection(row);
      },
      rowClass({row, rowIndex}){  //选中行样式改变
       for(var i=0;i<this.multipleSelection.length;i++){
          if(this.multipleSelection[i].id==row.id){
             return { "background-color": "#ecf5ff" }
          }
        }
      },
      //分页
      handleSizeChange(page) {
        this.currentPage = 1;
        this.pagesize = page;
        this.themeList();
      },
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage;
        this.themeList();
      },
      //添加主题弹窗关闭、确定添加
      gatherClose(){
        this.gatherShow = false;
        this.ruleForm.highlightWords='';
      },
      addGather() {
        this.handleTabsEdit(this.tabIndex, "add");
        this.addTheme();
        //this.ruleForm.highlightWords='';
      },
      //删除主题弹窗关闭、确定删除
      deleteGatherClose(){
        this.deleteGatherShow = false;
      },
      deleteGather(ensure){
        this.handleTabsEdit(this.tabIndex, "remove");
        this.deleteTheme();
      },
      deleteGatherTheme(){
        this.deleteGatherShow = true;
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
                  _this.$message({
                    type:"success",
                    message:"添加成功"
                  })
                  _this.ruleForm.highlightWords = '';
                  _this.gatherShow = false;
                  _this.pageList();
                }
                
              })
          } else {
            return false;
          }
        });
      },
      //删除主题方法
      deleteTheme(index){
        for(var i =0; i<this.editableTabs.length; i++){
          if(i== this.editableTabsValue){
            this.sid = this.editableTabs[i].id
          }
        }
        let _this = this;
        this.$http.post(this.GLOBAL.serverSrc + "/universal/labletype/api/delete", {
          id: this.sid
        })
          .then(function(response) {
            _this.$message({
              type: "success",
              message: "删除成功!"
            });
            _this.deleteGatherShow = false;
            _this.pageList();
          })
          .catch(function(error) {
            console.log(error);
          });
      },
      //修改主题方法
      editTheme(){
        var that = this
          this.$http.post(
            this.GLOBAL.serverSrc + "/universal/labletype/api/save",
            {
              "object": {
                "id": this.sid,
                "typeName": this.ruleForm_01.highlightWords01,
                "createTime": "2019-03-08T08:19:11.173Z",
                "code": "string",
                "isDeleted": 0
              }
            },
          )
          .then(function (response) {
            if(response.data.isSuccess == false){
              _this.$message.error("修改失败,该标签已存在");
            }
            else{
              _this.$message({
                type:"success",
                message:"修改成功"
              })
              _this.editGatherShow = false;
              _this.pageList();
            }  
            })
            .catch(function (obj) {
              console.log(obj)
            })
      },
      //关闭编辑主题弹窗
      editGatherClose(){
        this.editGatherShow = false;
        this.ruleForm_01.highlightWords01 = '';
      },
      //获取当前项的标题
      handleClick(tab, event) {//点击切换获取当前值
        this.clickTab = tab.label;
        this.themeList();
      },
      //显示编辑主题弹窗
      editGatherTheme(e){
        this.editGatherShow = true;
        this.cycleId();
        this.ruleForm_01.highlightWords01 = this.clickTab;
      },
      //循环主题ID
      cycleId(){
        console.log("cycleId")
        for(var i =0; i<this.editableTabs.length; i++){
          if(i== this.editableTabsValue){
            this.clickTab = this.editableTabs[i].typeName;
            this.sid = this.editableTabs[i].id;
          }
        }
      },


      //主题列表显示
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
            if(obj.data.objects){
              that.editableTabs = obj.data.objects
            }else{
              that.editableTabs = []
            }
            that.tabIndex = that.editableTabs.length
          //  that.editableTabsValue = that.editableTabs.length
            that.themeList();
          })
          .catch(function (obj) {
            console.log(obj)
          })
      },
      //产品列表显示
      themeList() {
        this.cycleId();
        var that = this
        this.$http.post(
          this.GLOBAL.serverSrc + "/universal/olabel/api/olabelpage",
          {
            "pageIndex": this.currentPage,
            "pageSize": this.pagesize,
            "total": 0,
            "object": {
              "id": this.sid,
              "labelName": "",
              "tagType": 1,
              "createTime": "2019-03-11T05:15:08.895Z",
              "code": "string",
              "isDeleted": 0
            }
          },)
          .then(function (obj) {
            that.total = obj.data.total
            that.tableData = obj.data.objects
            that.tabIndex = that.tableData.length
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
/**/
.actionButton .el-button{width:80px;padding: 0;line-height: 35px}
.el-button.is-disabled{color: #606266;background-color: #fff;border-color: #dcdfe6}
</style>




