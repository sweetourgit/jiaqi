<template>
  <div class="curiseShip">
    <el-form>
      <div class="buttonDv">
        <el-button class="el-button" type="primary" @click="saveFun(1)">保 存</el-button>
        <el-button class="el-button" type="primary" @click="saveFun(2)">下一步</el-button>
        <el-button class="el-button" type="danger" @click="cancalBtn">取 消</el-button>
      </div>
      <div class="topIn">
        <p><span class="leftSpan">*</span>行程天数：</p>
        <el-input v-model="day" placeholder="请输入" class="inputWidth" aria-required="true" type="number" @blur="tabShow"></el-input><span>天</span>
        <el-input v-model="night" placeholder="请输入" class="inputWidth" aria-required="true" type="number"></el-input><span>晚</span>
      </div>
      <el-tabs v-model="editableTabsValue" type="card" style="margin: 50px 0;">
        <el-tab-pane
          :key="item.name"
          v-for="item in editableTabs"
          :label="item.title"
          :name="item.name"
        >
          <!-- 每天的行程信息 form -->
          <el-form-item label="标题：" prop="title" label-width="140px">
            <el-input v-model="item.content.ruleForm.title" placeholder="请输入" class="inputWidth" maxlength="30" show-word-limit required></el-input>
          </el-form-item>
          <el-form-item label="所在城市：" prop="name" label-width="140px">
            <el-input v-model="item.content.ruleForm.city" placeholder="请输入" class="inputWidth"></el-input>
            <span>（提示：不填则默认为：海上巡航）</span>
          </el-form-item>
          <el-form-item label="停止登船时间：" prop="name" label-width="140px">
            <el-time-picker v-model="item.content.ruleForm.stopBordingTime" placeholder="开放时间"></el-time-picker>
            <span>（提示：有则填，无则不填；时间为当地时间）</span>
          </el-form-item>
          <el-form-item label="起航时间：" prop="name" label-width="140px">
            <el-time-picker v-model="item.content.ruleForm.startTime" placeholder="开放时间"></el-time-picker>
            <span>（提示：有则填，无则不填；时间为当地时间）</span>
          </el-form-item>
          <el-form-item label="抵达时间：" prop="name" label-width="140px">
            <el-time-picker v-model="item.content.ruleForm.endTime" placeholder="开放时间"></el-time-picker>
            <span>（提示：有则填，无则不填；时间为当地时间）</span>
          </el-form-item>
          <el-form-item label="餐次：" prop="name" label-width="140px">
            <div class="lineDv">
              <span>早餐：</span>
              <el-radio v-model="item.content.ruleForm.breakfast" label="1">自理</el-radio>
              <el-radio v-model="item.content.ruleForm.breakfast" label="2">详细说明</el-radio>
              <el-input v-model="item.content.ruleForm.breakfast_mark" placeholder="请输入" class="inputshort" :disabled="item.content.ruleForm.breakfast != 2"></el-input>
            </div>
            <div class="lineDv">
              <span>午餐：</span>
              <el-radio v-model="item.content.ruleForm.lunch" label="1">自理</el-radio>
              <el-radio v-model="item.content.ruleForm.lunch" label="2">详细说明</el-radio>
              <el-input v-model="item.content.ruleForm.lunch_mark" placeholder="请输入" class="inputshort" :disabled="item.content.ruleForm.lunch != 2"></el-input>
            </div>
            <div class="lineDv">
              <span>晚餐：</span>
              <el-radio v-model="item.content.ruleForm.dinner" label="1">自理</el-radio>
              <el-radio v-model="item.content.ruleForm.dinner" label="2">详细说明</el-radio>
              <el-input v-model="item.content.ruleForm.dinner_mark" placeholder="请输入" class="inputshort" :disabled="item.content.ruleForm.dinner != 2"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="详情：" prop="name" label-width="140px">
            <el-input v-model="item.content.ruleForm.detail" placeholder="请输入" class="inputWidth" type="textarea"></el-input>
          </el-form-item>
          <el-button type="warning" @click='addCabin' class="addBtn">添加</el-button>
          <el-table :data="item.content.ruleForm.tableData" border :highlight-current-row="true" :header-cell-style="getRowClass" :stripe="true" id="table-content">
            <el-table-column prop="title" label="标题" align="center">
            </el-table-column>
            <el-table-column prop="price" label="价钱" align="center">
            </el-table-column>
            <el-table-column prop="duration" label="行程时长" align="center">
            </el-table-column>
            <el-table-column prop="introduction" label="亮点推荐" align="center">
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button @click="edit(scope)" type="text" size="small" class="table_details">编辑</el-button>
                <el-button @click="deleteFun(scope)" type="text" size="small" class="table_details">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 每天的行程信息 form end-->
        </el-tab-pane>
      </el-tabs>
    </el-form>
    
    <tripMsgAdd :dialogFormVisible='dialogFormVisible' :info='info' @close="closeAdd"></tripMsgAdd>
  </div>
</template>
<script type="text/javascript">
import tripMsgAdd from '@/page/productManagement/liner/addStep/1tripMsgAdd.vue'
export default {
  name: "curiseShip",
  components: {
    tripMsgAdd
  },
  data() {
    return {
      day: '',
      night: '',
      editableTabsValue: '1',
      editableTabs: [{
        title: '第 1 天',
        name: '1',
        content: {
          "ruleForm": {
            "title": '',
            "city": '',
            "stopBordingTime": '',
            "startTime": '',
            "endTime": '',
            "breakfast": '',
            "breakfast_mark": '',
            "lunch": '',
            "lunch_mark": '',
            "dinner": '',
            "dinner_mark": '',
            "detail": '',
            "tableData": []
          }
        }
      }],
      dialogFormVisible: false,
      info: '',
      typeArr: []
    }
  },
  computed: {},
  methods: {
    tabShow(){
      let numPre = this.editableTabs.length;
      let numNew = parseInt(this.day);
      if(numNew > numPre){
        // alert("增加！")
        for(let i = numPre + 1; i <= numNew; i++){
          this.editableTabs.push({
            title: '第 '+ i + ' 天',
            name: i.toString(),
            content: {
              "ruleForm": {
                "title": '',
                "city": '',
                "stopBordingTime": '',
                "startTime": '',
                "endTime": '',
                "breakfast": '',
                "breakfast_mark": '',
                "lunch": '',
                "lunch_mark": '',
                "dinner": '',
                "dinner_mark": '',
                "detail": '',
                "tableData": []
              }
            }
          });
        }
      } else {
        // alert("减少！")
        for(let i = numPre; i > numNew; i--){
          this.editableTabs.pop();
        }
      }
    },
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

      if(this.day == '' || this.night == ''){
        this.$message.warning("行程天数不能为空！");
      }

      const tripArr = [];
      this.editableTabs.forEach(function(item, index, arr){
        if(item.content.ruleForm.title == ''){
          this.$message.warning("弟" + item.name + "天标题为空，请填写！");
          return;
        };
        // console.log(item.content.ruleForm.stopBordingTime);
        // console.log(item.content.ruleForm.stopBordingTime.getTime());
        // console.log(new Date(item.content.ruleForm.stopBordingTime.getTime()));
        const itemObj = {
          "sort": item.name,
          "title": item.content.ruleForm.title,
          "located_city": item.content.ruleForm.city == '' ? '海上巡航' : item.content.ruleForm.city,
          "stop_boarding_at": item.content.ruleForm.stopBordingTime,
          "set_sail_at": item.content.ruleForm.startTime,
          "arrival_at": item.content.ruleForm.endTime,
          "breakfast": item.content.ruleForm.breakfast == 1 ? "自理" : item.content.ruleForm.breakfast_mark,
          "lunch": item.content.ruleForm.lunch == 1 ? "自理" : item.content.ruleForm.lunch_mark,
          "dinner": item.content.ruleForm.dinner == 1 ? "自理" : item.content.ruleForm.dinner_mark,
          "details": item.content.ruleForm.detail,
          "trip_project": item.content.ruleForm.tableData
        };
        tripArr.push(itemObj);
      })

      this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/product/product/saveproducttrip", {
        "button_type": type,
        "product_id": this.$route.query.id,
        "formation_day": this.day,
        "night_day": this.night,
        "trip": tripArr,
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
    edit(scope){
      this.dialogFormVisible = true;
      const num = parseInt(this.editableTabsValue) - 1;
      // console.log(scope);
      this.info = {
        "type": "edit",
        "name": this.editableTabsValue,
        "tableData": this.editableTabs[num].content.ruleForm.tableData,
        "index": scope.$index
      };
    },
    addCabin(){
      this.dialogFormVisible = true;
      const num = parseInt(this.editableTabsValue) - 1;
      this.info = {
        "type": "add",
        "name": this.editableTabsValue,
        "tableData": this.editableTabs[num].content.ruleForm.tableData,
        "index": this.editableTabs[num].content.ruleForm.tableData.length
      }
    },
    closeAdd(){
      // console.log(this.info)
      this.dialogFormVisible = false; 
      const num = parseInt(this.editableTabsValue) - 1;
      this.$set(this.editableTabs[num].content.ruleForm.tableData, this.info.tableData);
      // console.log(this.editableTabs[num].content.ruleForm.tableData);
    },
    deleteFun(scope){
      const that = this;
      const num = parseInt(this.editableTabsValue) - 1;
      this.$confirm("是否删除本条舱房信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        that.editableTabs[num].content.ruleForm.tableData = that.editableTabs[num].content.ruleForm.tableData.splice(scope.$index, 1);
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
      this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/product/product/getproducttrip", {
        "product_id": this.$route.query.id
      }, ).then(function(response) {
        console.log('行程信息',response);
        if (response.data.code == '200') {
          that.day = response.data.data.info.formation_day;
          that.night = response.data.data.info.night_day;
          if(response.data.data.info.trip.length != 0){
            that.editableTabs = [];
            response.data.data.info.trip.forEach(function(item, index, arr){
              that.editableTabs.push({
                title: '第 '+ (index + 1) + ' 天',
                name: (index + 1).toString(),
                content: {
                  "ruleForm": {
                    "title": item.title,
                    "city": item.located_city,
                    "stopBordingTime": item.stop_boarding_at,
                    "startTime": item.set_sail_at,
                    "endTime": item.arrival_at,
                    "breakfast": item.breakfast == '自理' ? '1' : '2',
                    "breakfast_mark": item.breakfast == '自理' ? '' : item.breakfast,
                    "lunch": item.lunch == '自理' ? '1' : '2',
                    "lunch_mark": item.lunch == '自理' ? '' : item.lunch,
                    "dinner": item.dinner == '自理' ? '1' : '2',
                    "dinner_mark": item.dinner == '自理' ? '' : item.dinner,
                    "detail": item.details,
                    "tableData": item.trip_project
                  }
                }
              })

            })
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
    .el-button{
      float: right;
      margin-right: 18px;
    }
  }
  .lineDv{
    margin-bottom: 8px;
    .inputshort{
      width: 40%;
    }
  }
  
  .topIn{
    width: 98%;
    padding: 10px 20px;
    background-color: #f7f7f7;
    margin: 10px auto;
    .leftSpan{
      color: red;
    }
    p{
      display: inline-block;
      width: 140px;
    }
    .inputWidth{
      width: 25%;
    }
    span{
      margin: 0 8px;
    }
  }
  
  .addBtn{
    display: block;
    margin: 16px 0;
  }
  .picList{
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .block{
    display: block;
    text-align: center;
    margin: 10px auto;
  }
</style>
