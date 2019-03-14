<template>
  <div class="travelTemplate">
    <div class="head">
      <div class="search">
        <div class="searchTemplate">
          <span>模板名称</span>
          <el-input class="searchTemplate_index" v-model="input" placeholder="请输入内容"></el-input>
        </div>
        <div class="searchState">
          <span>类型</span>
          <el-select class="searchTemplate_index" v-model="searchValue" placeholder="请选择">
            <el-option
              v-for="(item, index) in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <el-button class="searReset" type="primary" @click="searResetClick">重置</el-button>
      </div>
    </div>
    <div class="products">
      <el-button class="products_button" type="primary" @click="insertProducts()">添加模板</el-button>
      <el-table class="table_list" :data="tableData" border :header-row-style="tableHead" :cell-style="tableHeight" :header-cell-style="getRowClass" style="width:750px">
          <el-table-column prop="id" label="ID" align="center" width="70%"></el-table-column>
          <el-table-column prop="name" label="模板名称"  align="center"></el-table-column>
          <el-table-column prop="productType" label="模板类型" align="center" width="210%"></el-table-column>
          <el-table-column align="center" label="操作" width="220%">
            <template slot-scope="scope">
              <el-button class="table_button" type="primary" @click="editProducts(scope.row)">编辑</el-button>
              <el-button class="table_button" type="danger" @click="deleteProducts(scope.row)">删除</el-button>
            </template>
          </el-table-column>
      </el-table>
      <div class="pages">
        <el-pagination class="page" background @size-change="pagesizes" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[2, 4, 8, 10]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
      <!-- 添加产品 -->
      <el-dialog class="Products_popup" :visible.sync="addProducts" :show-close="false" width="75%">
        <div>
          <!-- <el-button class="newTemplate" type="primary">新增模板</el-button> -->
          <span class="newTemplate" v-if="isJudge">新增模板</span>
          <span class="newTemplate" v-else>编辑模板</span>
          <div class="button_right">
            <el-button class="Determine cancel" @click="addProducts = false">取消</el-button>
            <el-button class="Determine" type="primary" @click="addTemplate('dataProducts')">保存</el-button>
          </div>
        </div>
        <el-form class="Products_form" :model="dataProducts" status-icon :rules="dataProductsRules" ref="dataProducts">
          <el-form-item label="模板名称:" :label-width="formLabelWidth" prop="templateName">
            <el-input class="Products_input" v-model="dataProducts.templateName" clearable></el-input>
          </el-form-item>
          <el-form-item label="模板类型:" prop="templateType" :label-width="formLabelWidth">
            <el-select class="Products_select" v-model="dataProducts.templateType" placeholder="请选择">
              <el-option
                v-for="(item, index) in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出行人个数:" prop="travelNum" :label-width="formLabelWidth">
            <el-radio-group class="travelNum" v-model="dataProducts.travelNum">
              <el-radio label="1">一个出行人</el-radio>
              <el-radio label="2">多个出行人(仅出行人信息需要填写多份)</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="出行人填写配置:" prop="traveFillIn" :label-width="formLabelWidth">
            <el-radio-group class="travelNum" v-model="dataProducts.traveFillIn">
              <el-radio label="1">一个出行人</el-radio>
              <el-radio label="2">多个出行人(仅出行人信息需要填写多份)</el-radio>
            </el-radio-group>
          </el-form-item>
          <template 
          v-if="dataProducts.templateName !== ''
          && dataProducts.templateType !== ''
          && dataProducts.travelNum !== ''
          && dataProducts.traveFillIn !== ''">
            <div class="detailed">
              <el-form-item label="出行人信息:" :label-width="formLabelWidth">
                <el-checkbox-group class="selection" v-model="dataProducts.travelInfo">
                  <el-checkbox :label="item.id" name="type" v-for="(item, index) in attribute" :key="index" @click.native="travelInfos(item.id)">{{item.name}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="行程信息:" :label-width="formLabelWidth">
                <el-checkbox-group class="selection" v-model="dataProducts.travelInfo">
                  <el-checkbox :label="item.id" name="type" v-for="(item, index) in attribute1" :key="index" @click.native="travelInfos(item.id)">{{item.name}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="取还地址:" :label-width="formLabelWidth">
                <el-checkbox-group class="selection" v-model="dataProducts.travelInfo">
                  <el-checkbox :label="item.id" name="type" v-for="(item, index) in attribute2" :key="index" @click.native="travelInfos(item.id)">{{item.name}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="收货地址:" :label-width="formLabelWidth">
                <el-checkbox-group class="selection" v-model="dataProducts.travelInfo">
                  <el-checkbox :label="item.id" name="type" v-for="(item, index) in attribute3" :key="index" @click.native="travelInfos(item.id)">{{item.name}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>
            <el-table class="table_lists" :data="tableProducts" border :header-row-style="tableHead" :cell-style="tableHeight" :header-cell-style="getRowClass" style="width: 65%;">
                <el-table-column prop="name" label="字段名称" width="260%" align="center"></el-table-column>
                <el-table-column prop="selection" label="选填/必填" width="160%" align="center"></el-table-column>
                <el-table-column prop="selectionValue" label="选项值" align="center"></el-table-column>
                <el-table-column align="center" width="160%" label="操作">
                  <template slot-scope="scope">
                    <template v-if="scope.row.id !== 1
                    && scope.row.id !== 2
                    && scope.row.id !== 3">
                      <el-button class="table_button" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    </template>
                  </template>
                </el-table-column>
            </el-table>
          </template>
        </el-form>
      </el-dialog>
      <!-- 添加产品END -->
      <!-- 类型二弹窗 -->
      <el-dialog class="TypeTwo_popup" :visible.sync="typeTwo" :show-close="false">
        <el-button class="typeTwo_button" type="primary" @click="typeTwoClick('typeTwoData', typeTwoData.key)">保存</el-button>
        <el-form class="Products_form" :model="typeTwoData" status-icon :rules="typeTwoRules" ref="typeTwoData">
          <el-form-item label="字段名称:" :label-width="formLabelWidth">
            <span class="typeTwo_span">{{typeTwoData.name}}</span>
          </el-form-item>
          <el-form-item label="填写要求:" :label-width="formLabelWidth">
            <el-radio-group class="typeTwoNum" v-model="typeTwoData.requirement">
              <el-radio label="选填">选填</el-radio>
              <el-radio label="必填">必填</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="certificates">
            <el-checkbox-group class="selections typeTwo_select" v-model="typeTwoData.certificates">
              <template v-for="(item, index) in typeTwoData.documents">
                <el-checkbox :label="item.id" name="type"  :key="index">{{item.name}}</el-checkbox>
              </template>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 类型二弹窗END -->
      <!-- 类型三弹窗 -->
      <el-dialog class="TypeThree_popup" :visible.sync="typeThree" :show-close="false" width="40%">
        <template v-if="sex == 1">
          <el-button class="typeTwo_button" type="primary" @click="typeThreeClick('typeThreeTable', typeThreeData.key)">保存</el-button>
        </template>
        <template v-if="sex == 0">
          <el-button class="typeTwo_button" type="primary" @click="typeThreeClick('typeThreeTables', typeThreeData.key)">保存</el-button>
        </template>
        <el-form class="Products_form" :model="typeThreeData" status-icon ref="typeTwoData">
          <el-form-item label="字段名称:" :label-width="formLabelWidth">
            <span class="typeTwo_span">{{typeThreeData.name}}</span>
          </el-form-item>
          <el-form-item label="填写要求:" :label-width="formLabelWidth">
            <el-radio-group class="typeTwoNum" v-model="typeThreeData.requirement">
              <el-radio label="选填">选填</el-radio>
              <el-radio label="必填">必填</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="sex == 1">
            <el-table class="typeThree_list" :data="typeThreeTable" border :header-row-style="tableHead" :cell-style="tableHeight" :header-cell-style="getRowClass" style="width: 40%;">
              <el-table-column prop="name" label="选项值" width="" align="center"></el-table-column>
            </el-table>
          </template>
          <template v-else-if="sex == 0">
            <el-table class="typeThree_list" :data="typeThreeTables" border :header-row-style="tableHead" :cell-style="tableHeight" :header-cell-style="getRowClass" style="width: 40%;">
              <el-table-column prop="name" label="选项值" width="" align="center"></el-table-column>
            </el-table>
          </template>
        </el-form>
      </el-dialog>
      <!-- 类型三END -->
      <!-- 类型四弹窗 -->
      <el-dialog class="TypeFour_popup" :visible.sync="typeFour" :show-close="false" width="40%">
        <el-button class="typeTwo_button" type="primary" @click="typeFourClick(typeFourList, typeFourData.key, typeFourData.id)">保存</el-button>
        <el-form class="Products_form" :model="typeFourData" status-icon ref="typeFourTable">
          <el-form-item label="字段名称:" :label-width="formLabelWidth">
            <span class="typeTwo_span">{{typeFourData.name}}</span>
          </el-form-item>
          <el-form-item label="填写要求:" :label-width="formLabelWidth">
            <el-radio-group class="typeTwoNum" v-model="typeFourData.requirement">
              <el-radio label="选填">选填</el-radio>
              <el-radio label="必填">必填</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label-width="-5px" prop="timeFormat">
            <el-input class="typeFour_input" v-model="typeFourData.time" placeholder="请输入内容"></el-input>
            <el-button class="typeFour_time" type="primary" @click="addTime(typeFourData.id)">添加选项时间</el-button>
          </el-form-item>
          <el-table class="typeThree_list" :data="typeFourList" border :header-row-style="tableHead" :cell-style="tableHeight" :header-cell-style="getRowClass" style="width: 60%;">
            <el-table-column prop="name" label="选项值" width="" align="center"></el-table-column>
            <el-table-column fixed="right" align="center" label="操作">
              <template slot-scope="scope">
                <el-button class="table_button" type="primary" @click="typeFourDelete(scope.$index, typeFourList)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-dialog>
      <!-- 类型四ENG -->
      <!-- 类型五弹窗 -->
      <el-dialog class="TypeFive_popup" :visible.sync="typeFive" :show-close="false" width="40%">
        <el-button class="typeTwo_button" type="primary" @click="typeFiveClick(typeFiveData.key)">保存</el-button>
        <el-form class="Products_form" :model="typeFiveData" status-icon>
          <el-form-item label="字段名称:" :label-width="formLabelWidth">
            <span class="typeTwo_span">{{typeFiveData.name}}</span>
          </el-form-item>
          <el-form-item label="填写要求:" :label-width="formLabelWidth">
            <el-radio-group class="typeTwoNum" v-model="typeFiveData.requirement">
              <el-radio label="选填">选填</el-radio>
              <el-radio label="必填">必填</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 类型五ENG -->
    </div>
  </div>
</template>

<script>
  export default {
    created() {
      this.$http.post(this.GLOBAL.serverSrc + '/universal/template/api/templatetypeget', {

      }).then(res => {
        res.data.objects.forEach(item => {
          this.options.push({
            'id': item.id,
            'name': item.name
          })
        })
      })
      // options
      let y = new Date().getFullYear();
      let m = new Date().getMonth() + 1;
      let d = new Date().getDate();
      if (m < 10) m = "0" + m;
      if (d < 10) d = "0" + d;
      this.createTime = y + "-" + m + "-" + d;
      this.initData();
    },
    data () {
      var rulessex = (rule, value, callback) => {
        if(this.typeTwoData.certificates == ''){
          if(this.typeTwoData.requirement == '必填'){
            callback(new Error('请选择证件'));
          } else {
            callback();
          }
        } else {
          callback();
        }
      };
      // var rulessexs = (rule, value, callback) => {
      //   if(this.typeFourData.time !== ''){
      //     var str = this.typeFourData.time
      //     var patt = /^(20|21|22|23|[0-1]\d):[0-5]\d$/
      //     if(str.match(patt)){
      //       callback();
      //     } else {
      //       callback(new Error('请添加正确时间格式'));
      //     }
      //   }

      //   if(this.typeFourTable.length == 0){
      //     if(this.typeFourData.requirement == '必填'){
      //       callback(new Error('必填项请填写时间'));
      //     } else {
      //       callback();
      //     }
      //   } else {
      //     callback();
      //   }
      // }
      return {
        isJudge: true, // 判断添加或者编辑
        input: '', // 搜索框末班名称
        createTime: '', // 当前时间
        switchNum: true, // 防止native修饰符执行travelInfos两遍
        // 属性数据
        attribute:[{
          "id": 10,
          "name": "身高（cm）",
          "type": 5,
          "DataType": "int",
          "InfoType": 1
        },{
          "id": 1,
          "name": "中文名称",
          "type": 1,
          "DataType": "string",
          "InfoType": 1
        },
        {
          "id": 2,
          "name": "姓（拼音）",
          "type": 1,
          "DataType": "string",
          "InfoType": 1
        },
        {
          "id": 3,
          "name": "名（拼音）",
          "type": 1,
          "DataType": "string",
          "InfoType": 1
        },
        {
          "id": 4,
          "name": "证件类型",
          "type": 2,
          "DataType": "single",
          "InfoType": 1
        },
        {
          "id": 5,
          "name": "有效期",
          "type": 5,
          "DataType": "datetime",
          "InfoType": 1
        },
        {
          "id": 6,
          "name": "出生年月日",
          "type": 5,
          "DataType": "datetime",
          "InfoType": 1
        },
        {
          "id": 7,
          "name": "性别",
          "type": 3,
          "DataType": "single",
          "InfoType": 1
        },
        {
          "id": 8,
          "name": "国籍",
          "type": 5,
          "DataType": "string",
          "InfoType": 1
        },
        {
          "id": 9,
          "name": "联系电话",
          "type": 5,
          "DataType": "tel",
          "InfoType": 1
        },
        {
          "id": 11,
          "name": "体重（kg）",
          "type": 5,
          "DataType": "float",
          "InfoType": 1
        },
        {
          "id": 12,
          "name": "鞋码(欧码)",
          "type": 3,
          "DataType": "single",
          "InfoType": 1
        },
        {
          "id": 13,
          "name": "左眼视力",
          "type": 5,
          "DataType": "string",
          "InfoType": 1
        },
        {
          "id": 14,
          "name": "右眼视力",
          "type": 5,
          "DataType": "string",
          "InfoType": 1
        }],
        attribute1:[{
          "id": 23,
          "name": "到达地点",
          "type": 5,
          "DataType": "string",
          "InfoType": 2
        },
          {
          "id": 15,
          "name": "境外联系电话",
          "type": 5,
          "DataType": "string",
          "InfoType": 2
        },
        {
          "id": 16,
          "name": "微信号",
          "type": 5,
          "DataType": "string",
          "InfoType": 2
        },
        {
          "id": 17,
          "name": "预约时间",
          "type": 5,
          "DataType": "datetime",
          "InfoType": 2
        },
        {
          "id": 18,
          "name": "出行人数",
          "type": 5,
          "DataType": "int",
          "InfoType": 2
        },
        {
          "id": 19,
          "name": "行李数",
          "type": 5,
          "DataType": "int",
          "InfoType": 2
        },
        {
          "id": 20,
          "name": "接人时间",
          "type": 5,
          "DataType": "datetime",
          "InfoType": 2
        },
        {
          "id": 21,
          "name": "接人地点",
          "type": 5,
          "DataType": "string",
          "InfoType": 2
        },
        {
          "id": 22,
          "name": "接人地点（英文）",
          "type": 5,
          "DataType": "string",
          "InfoType": 2
        },
        {
          "id": 24,
          "name": "到达地点（英文）",
          "type": 5,
          "DataType": "string",
          "InfoType": 2
        },
        {
          "id": 25,
          "name": "接人酒店名称",
          "type": 5,
          "DataType": "string",
          "InfoType": 2
        },
        {
          "id": 26,
          "name": "接人酒店名称（英文）",
          "type": 5,
          "DataType": "string",
          "InfoType": 2
        },
        {
          "id": 27,
          "name": "接人酒店地址",
          "type": 5,
          "DataType": "string",
          "InfoType": 2
        },
        {
          "id": 28,
          "name": "接人酒店地址（英文）",
          "type": 5,
          "DataType": "string",
          "InfoType": 2
        },
        {
          "id": 29,
          "name": "接人酒店电话",
          "type": 5,
          "DataType": "tel",
          "InfoType": 2
        },
        {
          "id": 30,
          "name": "接机航班号",
          "type": 5,
          "DataType": "string",
          "InfoType": 2
        },
        {
          "id": 31,
          "name": "航班抵达日期",
          "type": 5,
          "DataType": "datetime",
          "InfoType": 2
        },
        {
          "id": 32,
          "name": "送达酒店名称",
          "type": 5,
          "DataType": "string",
          "InfoType": 2
        },
        {
          "id": 33,
          "name": "送达酒店地址",
          "type": 5,
          "DataType": "string",
          "InfoType": 2
        },
        {
          "id": 34,
          "name": "送达酒店名称（英文）",
          "type": 5,
          "DataType": "string",
          "InfoType": 2
        },
        {
          "id": 35,
          "name": "接送酒店电话",
          "type": 5,
          "DataType": "string",
          "InfoType": 2
        },
        {
          "id": 36,
          "name": "过夜酒店名称",
          "type": 5,
          "DataType": "string",
          "InfoType": 2
        },
        {
          "id": 37,
          "name": "过夜酒店名称（英文）",
          "type": 5,
          "DataType": "string",
          "InfoType": 2
        },
        {
          "id": 38,
          "name": "用车时间",
          "type": 5,
          "DataType": "datetime",
          "InfoType": 2
        },
        {
          "id": 39,
          "name": "用车地点",
          "type": 5,
          "DataType": "string",
          "InfoType": 2
        },
        {
          "id": 40,
          "name": "接机、送机航班号",
          "type": 5,
          "DataType": "string",
          "InfoType": 2
        },
        {
          "id": 41,
          "name": "接机航班/接站车次",
          "type": 5,
          "DataType": "string",
          "InfoType": 2
        },
        {
          "id": 42,
          "name": "降落、起飞时间",
          "type": 5,
          "DataType": "datetime",
          "InfoType": 2
        },
        {
          "id": 43,
          "name": "接人送达地点",
          "type": 5,
          "DataType": "string",
          "InfoType": 2
        },
        {
          "id": 44,
          "name": "用车人数",
          "type": 5,
          "DataType": "int",
          "InfoType": 2
        },
        {
          "id": 45,
          "name": "返回酒店名称（英文）",
          "type": 5,
          "DataType": "string",
          "InfoType": 2
        },
        {
          "id": 46,
          "name": "返回酒店地址（英文）",
          "type": 5,
          "DataType": "string",
          "InfoType": 2
        },
        {
          "id": 47,
          "name": "返回酒店电话",
          "type": 5,
          "DataType": "tel",
          "InfoType": 2
        },
        {
          "id": 48,
          "name": "行程计划",
          "type": 5,
          "DataType": "string",
          "InfoType": 2
        },
        {
          "id": 49,
          "name": "返程送回酒店名称（英文）",
          "type": 5,
          "DataType": "string",
          "InfoType": 2
        },
        {
          "id": 50,
          "name": "返程送回酒店地址（英文）",
          "type": 5,
          "DataType": "string",
          "InfoType": 2
        },
        {
          "id": 51,
          "name": "返程送回酒店电话",
          "type": 5,
          "DataType": "string",
          "InfoType": 2
        },
        {
          "id": 52,
          "name": "酒店名称（英文）",
          "type": 5,
          "DataType": "string",
          "InfoType": 2
        },
        {
          "id": 53,
          "name": "酒店联系电话",
          "type": 5,
          "DataType": "tel",
          "InfoType": 2
        },
        {
          "id": 54,
          "name": "入住酒店日期",
          "type": 5,
          "DataType": "datetime",
          "InfoType": 2
        },
        {
          "id": 55,
          "name": "离开酒店日期",
          "type": 5,
          "DataType": "datetime",
          "InfoType": 2
        },
        {
          "id": 56,
          "name": "返程航班号/火车列次",
          "type": 5,
          "DataType": "string",
          "InfoType": 2
        },
        {
          "id": 57,
          "name": "返程日期",
          "type": 5,
          "DataType": "datetime",
          "InfoType": 2
        },
        {
          "id": 58,
          "name": "返程航班/列次时间",
          "type": 5,
          "DataType": "string",
          "InfoType": 2
        },
        {
          "id": 59,
          "name": "取还设备地址",
          "type": 5,
          "DataType": "string",
          "InfoType": 2
        },
        {
          "id": 60,
          "name": "预计出行日期",
          "type": 5,
          "DataType": "datetime",
          "InfoType": 2
        },
        {
          "id": 61,
          "name": "到达火车车次",
          "type": 5,
          "DataType": "string",
          "InfoType": 2
        },
        {
          "id": 62,
          "name": "到达车站",
          "type": 5,
          "DataType": "string",
          "InfoType": 2
        },
        {
          "id": 63,
          "name": "出发时间(单选)",
          "type": 4,
          "DataType": "single",
          "InfoType": 2
        },
        {
          "id": 64,
          "name": "出发班次",
          "type": 4,
          "DataType": "single",
          "InfoType": 2
        },
        {
          "id": 65,
          "name": "出发酒店所在区域",
          "type": 4,
          "DataType": "single",
          "InfoType": 2
        },
        {
          "id": 66,
          "name": "用餐时间",
          "type": 5,
          "DataType": "datetime",
          "InfoType": 2
        },
        {
          "id": 67,
          "name": "场次",
          "type": 4,
          "DataType": "single",
          "InfoType": 2
        },
        {
          "id": 68,
          "name": "上车地点(去程)",
          "type": 4,
          "DataType": "single",
          "InfoType": 2
        },
        {
          "id": 69,
          "name": "集合地点",
          "type": 4,
          "DataType": "single",
          "InfoType": 2
        },
        {
          "id": 70,
          "name": "集合时间",
          "type": 4,
          "DataType": "single",
          "InfoType": 2
        },
        {
          "id": 71,
          "name": "下车地点(去程)",
          "type": 4,
          "DataType": "single",
          "InfoType": 2
        },
        {
          "id": 72,
          "name": "成人人数",
          "type": 5,
          "DataType": "int",
          "InfoType": 2
        },
        {
          "id": 73,
          "name": "儿童人数",
          "type": 5,
          "DataType": "int",
          "InfoType": 2
        },
        {
          "id": 74,
          "name": "上车地点(回程)",
          "type": 4,
          "DataType": "single",
          "InfoType": 2
        },
        {
          "id": 75,
          "name": "下车地点(回程)",
          "type": 4,
          "DataType": "single",
          "InfoType": 2
        },
        {
          "id": 76,
          "name": "婴儿人数",
          "type": 5,
          "DataType": "int",
          "InfoType": 2
        },
        {
          "id": 77,
          "name": "使用地点",
          "type": 4,
          "DataType": "single",
          "InfoType": 2
        },
        {
          "id": 78,
          "name": "备选时间/场次",
          "type": 4,
          "DataType": "single",
          "InfoType": 2
        }],
        attribute2:[{
          "id": 80,
          "name": "还件地址",
          "type": 4,
          "DataType": "single",
          "InfoType": 3
        },
        {
          "id": 79,
          "name": "取件地址",
          "type": 4,
          "DataType": "single",
          "InfoType": 3
        }],
        attribute3: [{
          "id": 83,
          "name": "收货地址",
          "type": 5,
          "DataType": "string",
          "InfoType": 4
        },
          {
          "id": 81,
          "name": "收货人姓名",
          "type": 5,
          "DataType": "string",
          "InfoType": 4
        },
        {
          "id": 82,
          "name": "收货人电话",
          "type": 5,
          "DataType": "tel",
          "InfoType": 4
        }],
        options: [],
        searchValue: '', // 下拉框
        // 模板信息
        tableData: [],
        tableHead: {height: '60px', color: '#555555'}, // 表格头部高度
        tableHeight: {padding: '0', height: '40px'}, // 各表格高度
        pagesize:10, // 每页的数据条数
        currentPage:1, // 默认开始页面
        total: 1, // 模板数据总数
        addProducts: false, // 添加产品弹窗
        typeTwo: false, // 类型二的弹窗
        typeThree: false, // 类型三的弹窗
        typeFour: false, // 类型四的弹窗
        typeFive: false, // 类型五的弹窗
        sex: 0, // 判断是否是性别弹窗
        dataProducts: {
          id: '', // 模板id编辑用
          templateName: '',  // 模板名称
          templateType: '',  // 模板类型
          travelNum: '',  // 出行人个数
          traveFillIn: '',  // 出行人填写配置
          travelInfo: [],  // 出行人信息
        },
        formLabelWidth: '140px', // 弹窗item宽度
        // 信息表格
        tableProducts: [],
        // 类型三鞋码表格
        typeThreeTables: [],
        // 类型三性别表格
        typeThreeTable: [],
        // 类型四表格页面显示数据
        typeFourList: [],
        // 类型四下各选项值下
        fourDepartureTime: [], // 出发时间
        fourDepartureShifts: [], // 出发班次
        fourDepartureHotelArea: [], // 出发酒店所在区域
        fourScene: [], // 场次
        fourBoardingLocation: [], // 上车地点(去程)
        fourCollectionPlace: [], // 集合地点
        fourCollectionTime: [], // 集合时间
        fourDropOffArea: [], // 下车地点(去程)
        fourBoardingLocations: [], // 上车地点(回程)
        fourDropOffAreas: [], // 下车地点(回程)
        fourPlaceUse: [], // 使用地点
        fourAlternativeTime: [], // 备选时间
        fourPickAddress: [], // 取件地址
        fourReturnAddress: [], // 还件地址
        // 储存性别表格
        // sexTable: [],
        // 储存鞋码表格
        // sizeTable: [],
        // 类型二选项值
        typeTwoList: [],
        // 类型三选项值
        typeThreeList: [], // 性别
        typeThreeLists: [], // 鞋码
        // 类型二
        typeTwoData: {
          name: '', // 字段名称
          requirement: '必填', // 填写要求
          certificates: [], // 证件选择
          documents: [] 
        },
        // 类型三
        typeThreeData: {
          name: '', // 字段名称
          requirement: '必填', // 填写要求
        },
        // 类型四
        typeFourData: {
          id: '', // 模板id
          name: '', // 字段名称
          requirement: '必填', // 填写要求
          time: '' // 填写时间
        },
        // 类型五
        typeFiveData: {
          name: '', // 字段名称
          requirement: '必填', // 填写要求          
        },
        // 添加产品正则
        dataProductsRules: {
          templateName: [
            { required: true, message: '请填写模板名称'}
          ],
          templateType: [
            { required: true, message: '请选择模板类型'}
          ],
          travelNum: [
            { required: true, message: '请选择出行人个数'}
          ],
          traveFillIn: [
            { required: true, message: '请选择出行人填写配置'}            
          ]
        },
        // 类型二正则
        typeTwoRules: {
          certificates: [
            { validator: rulessex }
          ]
        },
        // 类型四正则
        // typeFourRules: {
        //   timeFormat: [
        //     { validator: rulessexs }
        //   ]
        // }
      }
    },
    methods: {
      // 表格头部背景颜色
      getRowClass({ row, column, rowIndex, columnIndex }) {
          if (rowIndex == 0) {
            return 'background:#F7F7F7'
          } else {
            return ''
          }
      },
      // 出行模板数据
      initData(){
        // this.tableData = [];
        this.$http.post(this.GLOBAL.serverSrc + '/universal/template/api/templatepage', {
          "pageIndex": this.currentPage,
          "pageSize": this.pagesize,
          "object": {}
        }).then(res => {
          this.tableData = res.data.objects;
          this.total = res.data.total;
          this.tableData.forEach(item => {
            let productType = '';
            this.options.forEach(obj => {
              if (item.productType == obj.id) {
                productType = obj.name;
              }
            })
            item.productType = productType

            // this.tableData.push({
            //   "id": item.id,
            //   "name": item.name,
            //   "productType": productType,
            //   "isOne": item.isOne,
            //   "isRequired": item.isRequired,
            //   "properties": item.properties
            // })
          })
        }).catch(err => {
          console.log(err);
        })
      },
      // 点击模板添加事件
      travelInfos(row) {
        setTimeout(res => {
          if(this.switchNum){
            let attributes = this.attribute.concat(this.attribute1).concat(this.attribute2).concat(this.attribute3);
            if(this.tableProducts.length =='' || this.tableProducts.length < this.dataProducts.travelInfo.length){
              attributes.forEach(item => {
                if(item.id == row){
                  this.tableProducts.push({
                    "id": item.id,
                    "name": item.name,
                    "type" : item.type,
                    "selection" : "必填",
                    "InfoType" : item.InfoType,
                    "selectionValue" : []
                  })
                }
              })
            } else {
              for(let i=0; i<this.tableProducts.length; i++){
                if(this.tableProducts[i].id == row){
                  this.tableProducts.splice(i, 1);
                }
              }
            }
            this.switchNum = false;
          } else {
            this.switchNum = true;
            this.fourDataTable(row, 'clare');
            if(row == 4){
              this.typeTwoData.certificates = [];
            }
          }
        },100)
      },
      // 类型四属性类型的时间表格
      fourDataTable(id, isData, name) {
        let time = name !== undefined? name :this.typeFourData.time;
        this.typeFourList = [];
        switch(id){
          case 63:
            if(isData == 'time'){
              this.fourDepartureTime.push({
                'name': time,
                "createTime": this.createTime
              })
            }
            if(isData == 'clare'){
              this.fourDepartureTime = [];
            }
            this.typeFourList = this.fourDepartureTime;
            break;
          case 64:
            if(isData == 'time'){
              this.fourDepartureShifts.push({
                'name': time,
                "createTime": this.createTime
              })
            }
            if(isData == 'clare'){
              this.fourDepartureShifts = [];
            }
            this.typeFourList = this.fourDepartureShifts;
            break;
          case 65:
            if(isData == 'time'){
              this.fourDepartureHotelArea.push({
                'name': time,
                "createTime": this.createTime
              })
            }
            if(isData == 'clare'){
              this.fourDepartureHotelArea = [];
            }
            this.typeFourList = this.fourDepartureHotelArea;
            break;
          case 67:
            if(isData == 'time'){
              this.fourScene.push({
                'name': time,
                "createTime": this.createTime
              })
            }
            if(isData == 'clare'){
              this.fourScene = [];
            }
            this.typeFourList = this.fourScene;
            break;
          case 68:
            if(isData == 'time'){
              this.fourBoardingLocation.push({
                'name': time,
                "createTime": this.createTime
              })
            }
            if(isData == 'clare'){
              this.fourBoardingLocation = [];
            }
            this.typeFourList = this.fourBoardingLocation;
            break;
          case 69:
            if(isData == 'time'){
              this.fourCollectionPlace.push({
                'name': time,
                "createTime": this.createTime
              })
            }
            if(isData == 'clare'){
              this.fourCollectionPlace = [];
            }
            this.typeFourList = this.fourCollectionPlace;
            break;
          case 70:
            if(isData == 'time'){
              this.fourCollectionTime.push({
                'name': time,
                "createTime": this.createTime
              })
            }
            if(isData == 'clare'){
              this.fourCollectionTime = [];
            }
            this.typeFourList = this.fourCollectionTime;
            break;
          case 71:
            if(isData == 'time'){
              this.fourDropOffArea.push({
                'name': time,
                "createTime": this.createTime
              })
            }
            if(isData == 'clare'){
              this.fourDropOffArea = [];
            }
            this.typeFourList = this.fourDropOffArea;
            break;
          case 74:
            if(isData == 'time'){
              this.fourBoardingLocations.push({
                'name': time,
                "createTime": this.createTime
              })
            }
            if(isData == 'clare'){
              this.fourBoardingLocations = [];
            }
            this.typeFourList = this.fourBoardingLocations;
            break;
          case 75:
            if(isData == 'time'){
              this.fourDropOffAreas.push({
                'name': time,
                "createTime": this.createTime
              })
            }
            if(isData == 'clare'){
              this.fourDropOffAreas = [];
            }
            this.typeFourList = this.fourDropOffAreas;
            break;
          case 77:
            if(isData == 'time'){
              this.fourPlaceUse.push({
                'name': time,
                "createTime": this.createTime
              })
            }
            if(isData == 'clare'){
              this.fourPlaceUse = [];
            }
            this.typeFourList = this.fourPlaceUse;
            break;
          case 78:
            if(isData == 'time'){
              this.fourAlternativeTime.push({
                'name': time,
                "createTime": this.createTime
              })
            }
            if(isData == 'clare'){
              this.fourAlternativeTime = [];
            }
            this.typeFourList = this.fourAlternativeTime;
            break;
          case 79:
            if(isData == 'time'){
              this.fourPickAddress.push({
                'name': time,
                "createTime": this.createTime
              })
            }
            if(isData == 'clare'){
              this.fourPickAddress = [];
            }
            this.typeFourList = this.fourPickAddress;
            break;
          case 80:
            if(isData == 'time'){
              this.fourReturnAddress.push({
                'name': time,
                "createTime": this.createTime
              })
            }
            if(isData == 'clare'){
              this.fourReturnAddress = [];
            }
            this.typeFourList = this.fourReturnAddress;
            break;
        }
      },
      // 模板添加编辑需要清空的数据
      templateEmpty() {
        this.tableProducts = []; // 清空模板信息表格
        // 清空模板表单信息
        this.dataProducts = {
          id: '', // 模板id编辑用
          templateName: '',  // 模板名称
          templateType: '',  // 模板类型
          travelNum: '',  // 出行人个数
          traveFillIn: '',  // 出行人填写配置
          travelInfo: [],  // 出行人信息
        };
        // 清空类型二表单值
        this.typeTwoData = {
          name: '', // 字段名称
          requirement: '必填', // 填写要求
          certificates: [], // 证件选择
          documents: [] 
        }
        // 清空类型三表单值
        this.typeThreeData = {
          name: '', // 字段名称
          requirement: '必填', // 填写要求
        }
        // 清空类型四表单值
        this.typeFourData = {
          id: '', // 模板id
          name: '', // 字段名称
          requirement: '必填', // 填写要求
          time: '' // 填写时间
        }
        // 清空类型五表单值
        this.typeFiveData = {
          name: '', // 字段名称
          requirement: '必填', // 填写要求          
        }
        // 清空列表四各个表格的保存值
          this.fourDepartureTime = [];
          this.fourDepartureShifts = [];
          this.fourDepartureHotelArea = [];
          this.fourScene = [];
          this.fourBoardingLocation = [];
          this.fourCollectionPlace = [];
          this.fourCollectionTime = [];
          this.fourDropOffArea = [];
          this.fourBoardingLocations = [];
          this.fourDropOffAreas = [];
          this.fourPlaceUse = [];
          this.fourAlternativeTime = [];
          this.fourPickAddress = [];
          this.fourReturnAddress = [];
      },
      // 模板添加
      insertProducts() {
        this.addProducts = true;
        this.isJudge = true;
        if(this.$refs['dataProducts'] !== undefined){
          // 清空添加表单验证样式
          this.$refs['dataProducts'].resetFields();
        }
        this.templateEmpty();
      },
      // 模板修改
      editProducts(data) {
        this.$http.post(this.GLOBAL.serverSrc + '/universal/template/api/templateget', {
          "object": {
            "id": data.id,
            "properties": [{
              "loadOption": true,
            }],
            "loadProperty": true,
          }
        }).then(res => {
          let selection = ''; // 选填必填转化成汉字
          let listStr = []; // 选项值数组
          this.addProducts = true;
          this.isJudge = false;
          this.templateEmpty();
          this.dataProducts.id = res.data.object.id;
          this.dataProducts.templateType = res.data.object.productType; // 默认值
          this.dataProducts.templateName = res.data.object.name;
          this.dataProducts.travelNum = String(res.data.object.isOne);
          this.dataProducts.traveFillIn = String(res.data.object.isRequired);
          if(res.data.object.properties.length != 0){
            res.data.object.properties.forEach(item => {
              this.dataProducts.travelInfo.push(item.propertyListID);
              if(item.options.length != 0){
                item.options.forEach(items => {
                  listStr.push(items.name);
                  this.fourDataTable(item.propertyListID, 'time', items.name);
                  if(item.type == 2){
                    this.typeTwoData.certificates.push(items.optionID);
                  }
                })
              }
              if(item.isRequired == 1){
                selection = '必填';
              } else {
                selection = '选填';
              }
              this.tableProducts.push({
                "id": item.propertyListID,
                "name": item.name,
                "type" : item.type,
                "selection": selection,
                "InfoType" : item.infoType,
                "selectionValue" : listStr.join('，')
              })
              listStr = [];
            })
          }
        }).catch(err => {
          console.log(err);
        })
      },
      // 模板属性编辑按钮
      handleEdit(key, data) {
        // 类型二
        if(data.type == '2'){
          this.$http.post(this.GLOBAL.serverSrc + '/universal/template/api/optionlist', {
            "object": {
                "propertyListID": data.id
              }
          }).then(res => {
            this.typeTwoData.documents = [];
            res.data.objects.forEach(item => {
              this.typeTwoData.documents.push({
                "id": item.id,
                "name": item.name,
                "propertyListID": item.propertyListID,
                "propertyListType": item.propertyListType
              })
            })
          }).catch(err => {
            console.log(err)
          })
          this.typeTwo = true;
          this.typeTwoData.name = data.name
          this.typeTwoData.key = key
        // 类型三
        } else if(data.type == '3'){
          this.$http.post(this.GLOBAL.serverSrc + '/universal/template/api/optionlist', {
              "object": {
                "propertyListID": data.id
              }
            }).then(res => {
              if(data.name == '性别'){
                this.typeThreeTable = [];
                res.data.objects.forEach(item => {
                  this.typeThreeTable.push({
                    "id": item.id,
                    "name": item.name,
                    "propertyListID": item.propertyListID,
                    "propertyListType": item.propertyListType
                  })
                })
                this.sex = 1
              } else if(data.name == '鞋码(欧码)'){
                this.typeThreeTables = [];
                res.data.objects.forEach(item => {
                  this.typeThreeTables.push({
                    "id": item.id,
                    "name": item.name,
                    "propertyListID": item.propertyListID,
                    "propertyListType": item.propertyListType
                  })
                })
                this.sex = 0
              }
            }).catch(err => {
              console.log(err)
            })
          this.typeThree = true;
          this.typeThreeData.name = data.name
          this.typeThreeData.key = key
        // 类型四
        } else if(data.type == '4'){
          this.typeFour = true;
          this.fourDataTable(data.id);
          this.typeFourData.name = data.name
          this.typeFourData.id = data.id
          this.typeFourData.key = key
        // 类型五
        } else if(data.type == '5'){
          this.typeFive = true;
          this.typeFiveData.name = data.name
          this.typeFiveData.key = key
        }
      },
      // 类型二
      typeTwoClick(form, key) {
        this.$refs[form].validate(valid => {
          if(valid){
            let name = [];
            this.typeTwoList = [];
            this.typeTwoData.certificates.forEach(item => {
              this.typeTwoData.documents.forEach(items => {
                if(item == items.id){
                  name.push(items.name);
                  this.typeTwoList.push({
                    "optionID": items.id,
                    "name": items.name,
                    "propertyID": items.propertyListID,
                    "createTime": this.createTime
                  })
                }
              })
            })
            this.tableProducts[key].selection = this.typeTwoData.requirement
            this.tableProducts[key].selectionValue = name.join('，')
            this.typeTwo = false;
          }
        })
      },
      // 类型三性别
      typeThreeClick(form, key) {
        // 性别保存
        if(form == 'typeThreeTable'){
          let sex = [];
          this.typeThreeList = [];
          this.typeThreeTable.forEach(item => {
            sex.push(item.name);
            this.typeThreeList.push({
              "optionID": item.id,
              "name": item.name,
              "propertyID": item.propertyListID,
              "createTime": this.createTime
            })
          })
          this.tableProducts[key].selection = this.typeThreeData.requirement
          this.tableProducts[key].selectionValue = sex.join('，')
          // 鞋码保存
        } else if(form == 'typeThreeTables'){
          let size = [];
          this.typeThreeLists = [];
          this.typeThreeTables.forEach(item => {
            size.push(item.name);
            this.typeThreeLists.push({
              "optionID": item.id,
              "name": item.name,
              "propertyID": item.propertyListID,
              "createTime": this.createTime
            })
          })
          this.tableProducts[key].selection = this.typeThreeData.requirement
          this.tableProducts[key].selectionValue = size.join('，')
        }
        this.typeThree = false;
      },
      // 类型四添加时间
      addTime(id) {
        this.fourDataTable(id, 'time');
        this.typeFourData.time = ''
        // if(this.typeFourData.time != ''){
        //   data.push({
        //     'name': this.typeFourData.time,
        //     "createTime": this.createTime
        //   })
        // }
      },
      // 类型四删除时间
      typeFourDelete(key, data) {
        data.splice(key, 1);
      },
      // 类型四保存
      typeFourClick(data, key, id) {
        // this.$refs[form].validate(valid => {
        //   if(valid){

        //   }
        // })
        this.tableProducts[key].selection = this.typeFourData.requirement
        let arr =[]
        for(let i=0;i<data.length;i++){
          arr.push(data[i].name)
        }
        this.tableProducts[key].selectionValue = arr.join('，')
        this.typeFour = false
      },
      // 类型五保存
      typeFiveClick(key) {
        this.tableProducts[key].selection = this.typeFiveData.requirement
        this.typeFive = false
      },
      // 改变每页显示条数
      pagesizes(page){
        this.currentPage = 1;
        this.pagesize = page;
        this.initData();
      },
      // 改变当前页
      handleCurrentChange(currentPage){
        this.currentPage = currentPage;
        this.initData();      
      },
      // 模板保存添加
      addTemplate(form) {
        this.$refs[form].validate(valid => {
          if(valid){
            let properties = []; // 模板下的模板信息
            let selection = ''; // 必填 选填
            let options = []; // 模板信息下的选项值
            this.tableProducts.forEach(item => {
              if(item.selection == '必填'){
                selection = 1;
              } else {
                selection = 2;
              }
              switch(item.id){
                case 4:
                  options = this.typeTwoList;
                  break;
                case 7:
                  options = this.typeThreeList;
                  break;
                case 12:
                  options = this.typeThreeLists;
                  break;
                case 63:
                  options = this.fourDepartureTime;
                  break;
                case 64:
                  options = this.fourDepartureShifts;
                  break;
                case 65:
                  options = this.fourDepartureHotelArea;
                  break;
                case 67:
                  options = this.fourScene;
                  break;
                case 68:
                  options = this.fourBoardingLocation;
                  break;
                case 69:
                  options = this.fourCollectionPlace;
                  break;
                case 70:
                  options = this.fourCollectionTime;
                  break;
                case 71:
                  options = this.fourDropOffArea;
                  break;
                case 74:
                  options = this.fourBoardingLocations;
                  break;
                case 75:
                  options = this.fourDropOffAreas;
                  break;
                case 77:
                  options = this.fourPlaceUse;
                  break;
                case 78:
                  options = this.fourAlternativeTime;
                  break;
                case 79:
                  options = this.fourPickAddress;
                  break;
                case 80:
                  options = this.fourReturnAddress;
                  break;
              }
              properties.push({
                "propertyListID": item.id,
                "name": item.name,
                "type": item.type,
                "infoType": item.InfoType,
                "isRequired": selection,
                "createTime": this.createTime,
                "dataType": "string",
                "options": options
              })
              options = [];
            })
            // 添加保存
            if(this.isJudge){
              this.$http.post(this.GLOBAL.serverSrc + '/universal/template/api/templateinsert', {
                "object": {
                  "name": this.dataProducts.templateName,
                  "productType": this.dataProducts.templateType,
                  "isOne": this.dataProducts.travelNum,
                  "isRequired": this.dataProducts.traveFillIn,
                  "createTime": this.createTime,
                  "properties": properties
                }
              }).then(res => {
                this.addProducts = false;
                this.$message.success('添加成功！');
                this.initData();
                this.$refs['dataProducts'].resetFields()
              }).catch(err => {
                console.log(err);
              })
            } else {
              // 编辑保存
              this.$http.post(this.GLOBAL.serverSrc + '/universal/template/api/templatesave', {
                "object": {
                  "id": this.dataProducts.id,
                  "name": this.dataProducts.templateName,
                  "productType": this.dataProducts.templateType,
                  "isOne": this.dataProducts.travelNum,
                  "isRequired": this.dataProducts.traveFillIn,
                  "createTime": this.createTime,
                  "properties": properties
                }
              }).then(res => {
                this.addProducts = false;
                this.$message.success('编辑成功！');
                this.initData();
                this.$refs['dataProducts'].resetFields()
              }).catch(err => {
                console.log(err);
              })
            }
          }
        })
      },
      // 模板删除
      deleteProducts(data) {
        this.$confirm('此操作将删除该模板', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        this.$http.post(this.GLOBAL.serverSrc + '/universal/template/api/templatedelete', {
          'id': data.id
        }).then(res => {
          if (this.tableData.length == 1) {
            this.currentPage = this.currentPage - 1;
          }
          this.initData();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(err => {
          console.log(err);
        })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        })
      },
      // 重置
      searResetClick() {
        this.input = '';
        this.searchValue = '';
      }
    }
  }
</script>

<style scoped>
.head{
  margin:0 -20px 0 -20px;
  height:60px;
  border-bottom: solid 2px #f7f7f7;
}
.searchTemplate{
  float: left;
  margin: 0 0 0 20px;
}
.searchTemplate_index{
  width: 200px;
  margin: 0 0 0 12px;
}
.searchState{
  float: left;
  margin: 0 0 0 24px;
}
.products_button{
  float: left;
  margin: 18px 0 0 0;
}
.table_button{
  width: 50px;
  height: 22px;
  padding: 0;
}
.table_list{
  position: relative;
  top: 79px;
  left: -100px;
}
.table_lists{
  position: relative;
  left: 190px;
}
.page{
  float: right;
}
.pages{
  width: 750px;
  height: 40px;
  margin-top: 125px;
}
.newTemplate{
  float: left;
  margin: -45px 0 0 0;
  font-size: 20px;
}
.button_right{
  float: right;
  margin: -45px 0 0 0;
}
.Determine{
  width: 100px;
}
.cancel{
  margin: 0 10px 0 0;
}
.Products_form{
  margin: 30px 0 0 0;
}
.Products_input{
  float: left;
  width: 300px;
}
.Products_select{
  float: left;
  width: 300px;
}
.travelNum{
  float: left;
  margin: 13px 0 0 0;
}
.selection{
  float: left;
  margin: 0 0 0 -30px;
}
.selections{
  float: left;
}
.detailed{
  width: 85%;
}
.typeTwo_button{
  float: right;
  margin: -45px 0 0 0;
  width: 100px;
}
.typeTwo_span{
  float: left;
  margin: 0 0 0 30px;
}
.typeTwoNum{
  float: left;
  margin: 13px 0 0 30px;
}
.selections>>>.el-checkbox{
  margin-left: 80px;
}
.typeTwo_select{
  margin: 0 0 0 40px;
}
.TypeTwo_popup .is-error>>>.el-form-item__error{
  margin-left:70px;
}
.TypeFour_popup .el-form-item.el-form-item--feedback.is-error>>>.el-form-item__error{
  margin-left:70px;
}
.typeThree_list{
  margin-left: 65px;
}
.el-checkbox-group>>>.el-checkbox{
  margin-left: 30px;
}
.typeFour_input{
  float: left;
  width: 220px;
  margin-left: 70px;
}
.typeFour_time{
  margin-left: 20px;
  margin-right: 18%;
  height: 30px;
  padding-top: 0;
  padding-bottom: 0; 
  margin-top: 6px;
}
.typeFour_list{
  margin-left: -100px;
}
.travelTemplate>>>.selection .el-checkbox+.el-checkbox{ float: left;}
.searReset{
  margin-left: 20px;
}
</style>
