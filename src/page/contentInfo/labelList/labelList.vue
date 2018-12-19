<template style=" position: relative;">
<div class="labelList">
	<!--标题切换-->
  <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit">

    <el-tab-pane :key="item.name" v-for="(item, index) in editableTabs" :label="item.title" :name="item.name">
      <div class="labelBorder">
        <div class="searchBox">
          <el-input placeholder="请输入内容" class="search" v-model="searchLabel" ref="searchLabel" clearable></el-input>
          <el-button class="resetButton" @click="reset">重置</el-button>
          <div style="float:right;">
            <el-button type="primary" @click="editGather">编辑</el-button>
            <el-button type="danger" @click="deleteLabel">删除</el-button>
          </div>
          <!--按钮-->
          <div style=" clear:both;">
            <div style="float:left; margin:30px 0 30px 0;">
              <el-button plain @click="addTally">添加标签</el-button>
              <el-button plain @click="editLabel">编辑标签</el-button>
              <el-button plain @click="transferGather">转移集合</el-button>
              <el-button type="danger" @click="removeLabel">删除标签</el-button>
            </div>
          </div>
          <!--表格-->
          <el-table :data="tableData3" ref="multipleTable" border :row-style="rowClass" @row-click="clickRow">
            <el-table-column prop="box" type="selection" label=""></el-table-column>
            <el-table-column prop="id" label="ID" width="100"></el-table-column>
            <el-table-column prop="name" label="地标名称"></el-table-column>
            <el-table-column prop="product" label="绑定相关产品" width="120">
             <template slot-scope="scope">
              <div style="color:#3095fa" @click="product()"><u>5</u></div>
             </template>
            </el-table-column>
          </el-table>

        </div>
      </div>
    </el-tab-pane>
    <!--绑定相关产品弹窗-->
      <div class="popup" v-show="messageShow">
        <div class="mask"@click="titleClose()"></div>
        <div class="message">
          <div class="messageTitle">
            <div class="titleText">绑定产品信息</div>
            <div class="titleClose" @click="titleClose()">×</div>
          </div>
          <div style="width:90%; margin:3% 0 3% 5%; overflow:hidden">
            <el-table :data="tableData" border>
              <el-table-column prop="title" label="产品信息"></el-table-column>
              <el-table-column prop="number" label="操作"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <!--标签删除弹窗-->
      <div class="popup" v-show="comboshow">
        <div class="mask" @click="close()"></div>
        <div class="add">
          <div class="label">
            <div class="left">删除标签</div>
            <div class="right" @click="close()">×</div>
          </div>
          <div class="content">
            <div class="text">是否删除该标签</div>
            <div class="judge">
              <el-button @click="close()">取消</el-button>
              <el-button @click="confirm(ensure)" type="primary">确定</el-button>
            </div>
          </div>
        </div>
      </div>
      <!--添加集合弹窗-->
      <div class="popup" v-show="addLabel">
        <div class="mask" @click="addclose"></div>
        <div class="add">
          <div class="label">
            <div class="left">添加集合</div>
            <div class="right" @click="addclose">×</div>
          </div>
          <div class="content">
            <div class="labelName">
              <div style="float:left; line-height:40px;">集合名称：</div>
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" style="float:left;">
                <el-form-item prop="highlightWords">
                  <el-input style="width:180px;" maxlength=10 v-model="ruleForm.highlightWords" placeholder="10个字以内"></el-input>
                  <span class="span1">{{ruleForm.highlightWords.length}}/10字</span>
                </el-form-item>
              </el-form>
            </div>
            <div class="judge">
              <el-button @click="addclose">取消</el-button>
              <el-button @click="addConfirm" type="primary">确定</el-button>
            </div>
          </div>
        </div>
      </div>
      <!--编辑集合弹窗-->
      <div class="popup" v-show="addGather">
        <div class="mask" @click="closeGather"></div>
        <div class="add">
          <div class="label">
            <div class="left">编辑集合</div>
            <div class="right" @click="closeGather">×</div>
          </div>
          <div class="content">
            <div class="labelName">
              <div style="float:left; line-height:40px;">集合名称：</div>
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" style="float:left;">
                <el-form-item prop="highlightWords">
                  <el-input style="width:180px;" maxlength=10 v-model="ruleForm.highlightWords" placeholder="10个字以内"></el-input>
                  <span class="span1">{{ruleForm.highlightWords.length}}/10字</span>
                </el-form-item>
              </el-form>
            </div>
            <div class="judge">
              <el-button @click="closeGather">取消</el-button>
              <el-button @click="" type="primary">确定</el-button>
            </div>
          </div>
        </div>
      </div>
      <!--添加标签弹窗-->
      <div class="popup" v-show="addTag">
        <div class="mask" @click="closeTag"></div>
        <div class="add">
          <div class="label">
            <div class="left">添加标签</div>
            <div class="right" @click="closeTag">×</div>
          </div>
          <div class="content">
            <div class="labelName">
              <div style="float:left; line-height:40px;">标签名称：</div>
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" style="float:left;">
                <el-form-item prop="highlightWords">
                  <el-input style="width:180px;" maxlength=10 v-model="ruleForm.highlightWords" placeholder="10个字以内"></el-input>
                  <span class="span1">{{ruleForm.highlightWords.length}}/10字</span>
                </el-form-item>
              </el-form>
            </div>
            <div class="judge">
              <el-button @click="closeTag">取消</el-button>
              <el-button @click="" type="primary">确定</el-button>
            </div>
          </div>
        </div>
      </div>
      <!--编辑标签弹窗-->
      <div class="popup" v-show="editShow">
        <div class="mask" @click="closeEdit"></div>
        <div class="add">
          <div class="label">
            <div class="left">编辑标签</div>
            <div class="right" @click="closeEdit">×</div>
          </div>
          <div class="content">
            <div class="labelName">
              <div style="float:left; line-height:40px;">标签名称：</div>
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" style="float:left;">
                <el-form-item prop="highlightWords">
                  <el-input style="width:180px;" maxlength=10 v-model="ruleForm.highlightWords" placeholder="10个字以内"></el-input>
                  <span class="span1">{{ruleForm.highlightWords.length}}/10字</span>
                </el-form-item>
              </el-form>
            </div>
            <div class="judge">
              <el-button @click="closeEdit">取消</el-button>
              <el-button @click="" type="primary">确定</el-button>
            </div>
          </div>
        </div>
      </div>
      <!--转移集合-->
      <div class="popup" v-show="shiftGather">
        <div class="mask" @click="closeGathers"></div>
        <div class="add">
          <div class="label">
            <div class="left">转移集合</div>
            <div class="right" @click="closeGathers">×</div>
          </div>
          <div class="content">
            <div class="labelName">
              <div style="float:left; line-height:40px;">集合</div>
              <el-select v-model="transfer" placeholder="请选择" style="float:left; margin:0 0 0 10px;">
                <el-option v-for="item in transfers" :key="item.value" :label="item.label":value="item.value"></el-option>
              </el-select>
            </div>
            <div class="judge">
              <el-button @click="closeGathers">取消</el-button>
              <el-button @click="" type="primary">确定</el-button>
            </div>
          </div>
        </div>
      </div>
      <!--删除标签弹窗-->
      <div class="popup" v-show="cancelShow">
        <div class="mask" @click="closeCancel"></div>
        <div class="add">
          <div class="label">
            <div class="left">删除标签</div>
            <div class="right" @click="closeCancel">×</div>
          </div>
          <div class="content">
            <div class="text">是否删除该标签</div>
            <div class="judge">
              <el-button @click="closeCancel">取消</el-button>
              <el-button @click="" type="primary">确定</el-button>
            </div>
          </div>
        </div>
      </div>
  </el-tabs>







 
</div>
</template>
<script>
  export default {
    data() {  
       return {
        //标题切换
        editableTabsValue: '2',
        editableTabs: [{
          title: '景点标签',
          name: '1',
          content: 'Tab 1 content'
        }, {
          title: '美食标签',
          name: '2',
          content: 'Tab 2 content'
        }],
        tabIndex: 2,
        ensure:'',
        aindex:0,
        //搜索标签输入框  
        searchLabel:'',
        //表格
        tableData3: [{
          box:'1',
          id: '1',
          name: '名筑',
          product: '5'
        }, {
          box:'2',
          id: '2',
          name: '地标',
          product: '4'
        }, {
          box:'3',
          id: '3',
          name: '必去景点',
          product: '5'
        }],
        multipleSelection: [],
        


        messageShow:false,
        //弹窗表格
        tableData:[{
          title:'【沈阳领区】日本旅游签证(单次/三年多次+顺丰包邮+拒签全退套餐+可加急+一手送签+免机酒套餐)',
          number:'解绑'
        },{
          title:'澳大利亚旅游签证(1年/3年多次+专业受理东三省客户+拒签退款套餐)',
          number:'解绑'
        }],
        //重置
        dynamicValidateForm: {
          domains: [{
            value: ''
          }]
        },
        //标签删除弹窗
        comboshow: false,
        //标签添加弹窗
        addLabel:false,
        //
        ruleForm:{
          highlightWords: '',
        },
        rules:{
          highlightWords:[
            { required: true, message: '不能为空', trigger: 'blur' },
            { min: 0, max: 10, message: '字数超过10汉字限制', trigger: 'blur' },
          ],
        },
        //添加标签
        addTag:false,
        //编辑集合
        addGather:false,
        //编辑标签
        editShow:false,
        //转移集合
        transfers: [{
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
        transfer: '',
        //转移集合
        shiftGather:false,
        //删除标签
        cancelShow:false,
       };   
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
        
    },
    methods: {
      //主题标题添加删除
       handleTabsEdit(targetName, action) {
        if (action === 'add') {
          if(this.addLabel==false){
            this.addLabel=true;
            return false;
          }else{
          let newTabName = ++this.tabIndex + '';
          this.editableTabs.push({
            title: this.ruleForm.highlightWords,
            name: newTabName,
            content: 'New Tab content'
          });
          this.editableTabsValue = newTabName;
          }
        }
        if (action === 'remove') {
          
          if(this.comboshow==false){            
            this.comboshow=true;
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
      //重置
      reset(){
        this.searchLabel='';
      },
      //点击出现表格弹窗
      product(){
        this.messageShow=true;
      },
      //绑定相关产品弹窗
      titleClose(){
        this.messageShow=false;
      },
      //标签删除弹窗
      close() {
        this.comboshow = false;
      },
      //删除标签（大）
      confirm(ensure){
       // this.comboshow = true;
       // this.editableTabs.splice(ensure, 1);
        this.handleTabsEdit(this.aindex, "remove");
        this.comboshow = false;
      },
      //标签添加弹窗
      addclose(){
        this.addLabel=false;
      },
      addConfirm() {
        this.handleTabsEdit(this.aindex, "add");
        this.addLabel = false;
        this.ruleForm.highlightWords='';
      },
      //删除种类弹窗
      deleteLabel(){
        this.comboshow=true;
      },
      //添加标签
      addTally(){
        this.addTag=true;
      },
      closeTag(){
        this.addTag=false;
      },
      //编辑集合
      editGather(){
        this.addGather=true;
      },
      closeGather(){
        this.addGather=false;
      },
      //编辑标签
      editLabel(){
        this.editShow=true;
      },
      closeEdit(){
        this.editShow=false;
      },
      //转移集合
      transferGather(){
        this.shiftGather=true;
      },
      closeGathers(){
        this.shiftGather=false;
      },
      //删除标签
      removeLabel(){
        this.cancelShow=true;
      },
      closeCancel(){
        this.cancelShow=false;
      },
      //表格勾选
      clickRow(row){    //选中行复选框勾选
        //this.$refs.multipleTable.clearSelection(); //清空用户的选择  
        this.$refs.multipleTable.toggleRowSelection(row)
      },
      rowClass({row, rowIndex}){  //选中行样式改变
       for(var i=0;i<this.multipleSelection.length;i++){
          if(this.multipleSelection[i].id==row.id){
             return { "background-color": "#ecf5ff" }
          }
        }
      },
    }
}

   

</script>














<style scoped>
	/*.labelList{ font-family: '微软雅黑'; font-size: 11pt; margin: 0 0 100px 0; max-width: 900px; overflow: hidden;}*/
  .labelList{ font-family: '微软雅黑'; font-size: 11pt; margin: 0 0 100px 0;overflow: hidden; max-width: 900px; min-width: 630px;}
  
  /*标题切换*/
  .labelTabs{text-align: left;}

  .el-tabs--card>>>.el-tabs__header{margin: 0 !important;}

  /*边框*/
  .labelBorder{border-left:1px solid #e6e6e6; border-right:1px solid #e6e6e6; border-bottom:1px solid #e6e6e6; margin:0 0 20px 0; overflow: hidden;}

  /*搜索框、按钮*/
  .searchBox{ margin: 20px 15px 20px 15px; overflow: hidden; }
  .search{ width: 340px; float: left; }
  .resetButton{float: left; margin: 0 0 0 20px; background-color: #409EFF; color:#fff;}


  /*表格*/
  .tableLabel{ clear: both; background-color: #e6e6e6; width: 100%; line-height: 30px;}
  .tableTitle{line-height: 60px;}

  .el-table>>>.cell{text-align: center;}

  /*弹窗*/
  .mask{background-color: #000; width: 100%; height: 100%; position: fixed; top: 0; left: 0;filter:alpha(opacity=50);opacity:0.5; z-index: 100;}
  .message{width: 60%;margin: auto;position: fixed; top:50%; left:40%; margin-top:-125px; margin-left:-20%; background: #fff; overflow: hidden; border:1px solid #eeeeee; border-radius: 3px; z-index: 1000; }
  .messageTitle{height: 40px; line-height: 40px; background-color: #f6f6f6; overflow: hidden; width: 100%;}
  .titleText{float: left; margin: 0 0 0 20px;}
  .titleClose{float: right; margin: 0 20px 0 0; font-size: 14pt;cursor:pointer;}

  /*标签删除弹窗*/
  .add {width: 450px; height: 250px; margin:auto; position: fixed;top: 50%; left: 50%; margin-top: -125px; margin-left:-225px;background-color: #fff; overflow: hidden; border: 1px solid #eeeeee; border-radius: 3px; z-index: 1000;}
  .label { background-color: #f6f6f6; border-bottom: 1px solid #eee; height: 57px; line-height: 40px; width: 450px;}
  .left { float: left; margin:10px 0 0 20px;}
  .right { float: right; margin: 0 20px 0 0; font-size: 16pt;cursor: pointer; line-height: 57px; }
  .content { width: 310px; overflow: hidden; margin-left:auto; margin-right: auto;}
  .text { float: left;line-height: 40px; margin:50px 0 0 0;  }
  .input { float: left; width: 180px; margin:0 0 0 15px;}
  .judge { padding: 30px 0 0 0; clear: both;}

  /*标签添加弹窗*/
  .labelName{width: 350px; margin-left:auto; margin-right:auto; margin: 50px 0 0 0;  }
  .el-form>>>.el-form-item{margin-bottom:0px;}

	
	
</style>




