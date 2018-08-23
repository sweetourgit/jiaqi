<template>
  <div class="travelTemplate">
    <div class="head">
      <div class="search">
        <div class="searchTemplate">
          <span>模板名称</span>
          <el-input class="searchTemplate_index" v-model="input" placeholder="请输入内容"></el-input>
        </div>
        <div class="searchState">
          <span>状态</span>
          <el-select class="searchTemplate_index" v-model="searchValue" placeholder="请选择">
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item.label"
              :value="index">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="products">
      <el-button class="products_button" type="primary" @click="addProducts = true">添加模板</el-button>
      <el-table class="table_list" :data="tableData" border :header-row-style="tableHead" :cell-style="tableHeight" :header-cell-style="getRowClass" style="width: 1000px;">
          <el-table-column prop="id" label="ID" align="center" width="130"></el-table-column>
          <el-table-column prop="templateName" label="模板名称" align="center" width="350"></el-table-column>
          <el-table-column prop="templateType" label="模板类型" align="center"></el-table-column>
          <el-table-column fixed="right" align="center" label="操作">
            <template slot-scope="scope">
              <el-button class="table_button" type="primary" @click="">编辑</el-button>
              <el-button class="table_button" type="danger" @click="">删除</el-button>
            </template>
          </el-table-column>
      </el-table>
      <el-pagination class="page" background @size-change="" @current-change="" :current-page="currentPage" :page-sizes="[2, 4, 8, 10]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="400"></el-pagination>
      <!-- 添加产品 -->
      <el-dialog class="Products_popup" :visible.sync="addProducts" :show-close="false" width="75%">
        <div>
          <el-button class="newTemplate" type="primary">新增模板</el-button>
          <div class="button_right">
            <el-button class="Determine cancel" @click="addProducts = false">取消</el-button>
            <el-button class="Determine" type="primary">保存</el-button>
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
                :key="index"
                :label="item.label"
                :value="index">
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
                <el-checkbox-group class="selection" v-model="dataProducts.travelInfo" @change="travelInfos">
                  <el-checkbox label="身高(cm)-5" name="type">身高(cm)</el-checkbox>
                  <el-checkbox label="中文姓名-1" name="type">中文姓名</el-checkbox>
                  <el-checkbox label="姓(拼音)-1" name="type">姓(拼音)</el-checkbox>
                  <el-checkbox label="名(拼音)-1" name="type">名(拼音)</el-checkbox>
                  <el-checkbox label="证件类型-2" name="type">证件类型</el-checkbox>
                  <el-checkbox label="有效期-5" name="type">有效期</el-checkbox>
                  <el-checkbox label="出生年月日-5" name="type">出生年月日</el-checkbox>
                  <el-checkbox label="性别-3" name="type">性别</el-checkbox>
                  <el-checkbox label="国籍-5" name="type">国籍</el-checkbox>
                  <el-checkbox label="联系电话-5" name="type">联系电话</el-checkbox>
                  <el-checkbox label="体重(kg)-5" name="type">体重(kg)</el-checkbox>
                  <el-checkbox label="鞋码(欧码)-3" name="type">鞋码(欧码)</el-checkbox>
                  <el-checkbox label="左眼视力-5" name="type">左眼视力</el-checkbox>
                  <el-checkbox label="右眼视力-5" name="type">右眼视力</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="行程信息:" :label-width="formLabelWidth">
                <el-checkbox-group class="selection" v-model="dataProducts.travelInfo" @change="travelInfos">
                  <el-checkbox label="境外联系电话-5" name="type">境外联系电话</el-checkbox>
                  <el-checkbox label="微信号-5" name="type">微信号</el-checkbox>
                  <el-checkbox label="预约时间-5" name="type">预约时间</el-checkbox>
                  <el-checkbox label="出行人数-5" name="type">出行人数</el-checkbox>
                  <el-checkbox label="行李数-5" name="type">行李数</el-checkbox>
                  <el-checkbox label="接人时间-5" name="type">接人时间</el-checkbox>
                  <el-checkbox label="接人地点-5" name="type">接人地点</el-checkbox>
                  <el-checkbox label="接人地点(英文)-5" name="type">接人地点(英文)</el-checkbox>
                  <el-checkbox label="到达地点-5" name="type">到达地点</el-checkbox>
                  <el-checkbox label="到达地点(英文)-5" name="type">到达地点(英文)</el-checkbox>
                  <el-checkbox label="接人酒店名称-5" name="type">接人酒店名称</el-checkbox>
                  <el-checkbox label="接人酒店名称(英文)-5" name="type">接人酒店名称(英文)</el-checkbox>
                  <el-checkbox label="接人酒店地址-5" name="type">接人酒店地址</el-checkbox>
                  <el-checkbox label="接人酒店地址(英文)-5" name="type">接人酒店地址(英文)</el-checkbox>
                  <el-checkbox label="接人酒店电话-5" name="type">接人酒店电话</el-checkbox>
                  <el-checkbox label="接机航班号-5" name="type">接机航班号</el-checkbox>
                  <el-checkbox label="航班抵达日期-5" name="type">航班抵达日期</el-checkbox>
                  <el-checkbox label="航班抵达时间-5" name="type">航班抵达时间</el-checkbox>
                  <el-checkbox label="送达酒店名称-5" name="type">送达酒店名称</el-checkbox>
                  <el-checkbox label="送达酒店地址-5" name="type">送达酒店地址</el-checkbox>
                  <el-checkbox label="送达酒店名称(英文)-5" name="type">送达酒店名称(英文)</el-checkbox>
                  <el-checkbox label="送达酒店地址(英文)-5" name="type">送达酒店地址(英文)</el-checkbox>
                  <el-checkbox label="送达酒店电话-5" name="type">送达酒店电话</el-checkbox>
                  <el-checkbox label="送机航班号-5" name="type">送机航班号</el-checkbox>
                  <el-checkbox label="航班起飞日期-5" name="type">航班起飞日期</el-checkbox>
                  <el-checkbox label="航班起飞时间-5" name="type">航班起飞时间</el-checkbox>
                  <el-checkbox label="出发酒店名称-5" name="type">出发酒店名称</el-checkbox>
                  <el-checkbox label="出发酒店名称(英文)-5" name="type">出发酒店名称(英文)</el-checkbox>
                  <el-checkbox label="出发酒店地址(英文)-5" name="type">出发酒店地址(英文)</el-checkbox>
                  <el-checkbox label="出发酒店电话-5" name="type">出发酒店电话</el-checkbox>
                  <!-- <el-checkbox label="31" name="type">出发酒店电话</el-checkbox> -->
                  <el-checkbox label="接送酒店名称(英文)-5" name="type">接送酒店名称(英文)</el-checkbox>
                  <el-checkbox label="接送酒店地址(英文)-5" name="type">接送酒店地址(英文)</el-checkbox>
                  <el-checkbox label="接送酒店电话-5" name="type">接送酒店电话</el-checkbox>
                  <el-checkbox label="过夜酒店名称(英文)-5" name="type">过夜酒店名称(英文)</el-checkbox>
                  <el-checkbox label="过夜酒店地址(英文)-5" name="type">过夜酒店地址(英文)</el-checkbox>
                  <el-checkbox label="用车时间-5" name="type">用车时间</el-checkbox>
                  <el-checkbox label="用车地点-5" name="type">用车地点</el-checkbox>
                  <el-checkbox label="接机、送机航班号-5" name="type">接机、送机航班号</el-checkbox>
                  <el-checkbox label="接机航班/接站车次-5" name="type">接机航班/接站车次</el-checkbox>
                  <el-checkbox label="降落、起飞时间-5" name="type">降落、起飞时间</el-checkbox>
                  <el-checkbox label="接人送达地点-5" name="type">接人送达地点</el-checkbox>
                  <el-checkbox label="用车人数-5" name="type">用车人数</el-checkbox>
                  <el-checkbox label="返回酒店名称(英文)-5" name="type">返回酒店名称(英文)</el-checkbox>
                  <el-checkbox label="返回酒店地址(英文)-5" name="type">返回酒店地址(英文)</el-checkbox>
                  <el-checkbox label="返回酒店电话-5" name="type">返回酒店电话</el-checkbox>
                  <el-checkbox label="行程计划-5" name="type">行程计划</el-checkbox>
                  <el-checkbox label="返程送回酒店名称(英文)-5" name="type">返程送回酒店名称(英文)</el-checkbox>
                  <el-checkbox label="返程送回酒店地址(英文)-5" name="type">返程送回酒店地址(英文)</el-checkbox>
                  <el-checkbox label="返程送回酒店电话-5" name="type">返程送回酒店电话</el-checkbox>
                  <el-checkbox label="酒店名称(英文)-5" name="type">酒店名称(英文)</el-checkbox>
                  <el-checkbox label="酒店联系电话-5" name="type">酒店联系电话</el-checkbox>
                  <el-checkbox label="入住酒店日期-5" name="type">入住酒店日期</el-checkbox>
                  <el-checkbox label="离开酒店日期-5" name="type">离开酒店日期</el-checkbox>
                  <el-checkbox label="返程航班号/火车列次-5" name="type">返程航班号/火车列次</el-checkbox>
                  <el-checkbox label="返程日期-5" name="type">返程日期</el-checkbox>
                  <el-checkbox label="返程航班/列次时间-5" name="type">返程航班/列次时间</el-checkbox>
                  <el-checkbox label="取还设备地址-5" name="type">取还设备地址</el-checkbox>
                  <el-checkbox label="预计出行日期-5" name="type">预计出行日期</el-checkbox>
                  <el-checkbox label="到达火车车次-5" name="type">到达火车车次</el-checkbox>
                  <el-checkbox label="到达车站-5" name="type">到达车站</el-checkbox>
                  <el-checkbox label="出发时间(单选)-4" name="type">出发时间(单选)</el-checkbox>
                  <el-checkbox label="出发班次-4" name="type">出发班次</el-checkbox>
                  <el-checkbox label="出发酒店所在区域-4" name="type">出发酒店所在区域</el-checkbox>
                  <el-checkbox label="用餐时间-5" name="type">用餐时间</el-checkbox>
                  <el-checkbox label="场次-4" name="type">场次</el-checkbox>
                  <el-checkbox label="上车地点(去程)-4" name="type">上车地点(去程)</el-checkbox>
                  <el-checkbox label="集合地点-4" name="type">集合地点</el-checkbox>
                  <el-checkbox label="集合时间-4" name="type">集合时间</el-checkbox>
                  <el-checkbox label="下车地点(去程)-4" name="type">下车地点(去程)</el-checkbox>
                  <el-checkbox label="成人人数-5" name="type">成人人数</el-checkbox>
                  <el-checkbox label="儿童人数-5" name="type">儿童人数</el-checkbox>
                  <el-checkbox label="上车地点(回程)-4" name="type">上车地点(回程)</el-checkbox>
                  <el-checkbox label="下车地点(回程)-4" name="type">下车地点(回程)</el-checkbox>
                  <el-checkbox label="婴儿人数-5" name="type">婴儿人数</el-checkbox>
                  <el-checkbox label="使用地点-4" name="type">使用地点</el-checkbox>
                  <el-checkbox label="备选时间/场次-4" name="type">备选时间/场次</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="取还地址:" :label-width="formLabelWidth">
                <el-checkbox-group class="selection" v-model="dataProducts.travelInfo" @change="travelInfos">
                  <el-checkbox label="取件地址-4" name="type">取件地址</el-checkbox>
                  <el-checkbox label="还件地址-4" name="type">还件地址</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="收货地址:" :label-width="formLabelWidth">
                <el-checkbox-group class="selection" v-model="dataProducts.travelInfo" @change="travelInfos">
                  <el-checkbox label="收货人姓名-5" name="type">收货人姓名</el-checkbox>
                  <el-checkbox label="收货人电话-5" name="type">收货人电话</el-checkbox>
                  <el-checkbox label="收货地址-5" name="type">收货地址</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>
            <el-table class="table_lists" :data="tableProducts" border :header-row-style="tableHead" :cell-style="tableHeight" :header-cell-style="getRowClass" style="width: 100%;">
                <el-table-column prop="name" label="字段名称" width="229" align="center"></el-table-column>
                <el-table-column prop="selection" label="选填/必填" align="center"></el-table-column>
                <el-table-column prop="selectionValue" label="选项值" align="center"></el-table-column>
                <el-table-column fixed="right" align="center" label="操作">
                  <template slot-scope="scope">
                    <template v-if="scope.row.name !== '中文姓名'
                    && scope.row.name !== '姓(拼音)'
                    && scope.row.name !== '名(拼音)'">
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
              <el-checkbox label="身份证" name="type">身份证</el-checkbox>
              <el-checkbox label="护照" name="type">护照</el-checkbox>
              <el-checkbox label="港澳通行证" name="type">港澳通行证</el-checkbox>
              <el-checkbox label="台湾通行证" name="type">台湾通行证</el-checkbox>
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
              <el-table-column prop="sex" label="选项值" width="" align="center"></el-table-column>
            </el-table>
          </template>
          <template v-else-if="sex == 0">
            <el-table class="typeThree_list" :data="typeThreeTables" border :header-row-style="tableHead" :cell-style="tableHeight" :header-cell-style="getRowClass" style="width: 40%;">
              <el-table-column prop="size" label="选项值" width="" align="center"></el-table-column>
            </el-table>
          </template>
        </el-form>
      </el-dialog>
      <!-- 类型三END -->
      <!-- 类型四弹窗 -->
      <el-dialog class="TypeFour_popup" :visible.sync="typeFour" :show-close="false" width="40%">
        <el-button class="typeTwo_button" type="primary" @click="typeFourClick('typeFourTable', typeFourData.key)">保存</el-button>
        <el-form class="Products_form" :model="typeFourData" status-icon :rules="typeFourRules" ref="typeFourTable">
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
            <el-button class="typeFour_time" type="primary" @click="addTime('typeFourTable')">添加选项时间</el-button>
          </el-form-item>
          <el-table class="typeThree_list" :data="typeFourTable" border :header-row-style="tableHead" :cell-style="tableHeight" :header-cell-style="getRowClass" style="width: 60%;">
            <el-table-column prop="time" label="选项值" width="" align="center"></el-table-column>
            <el-table-column fixed="right" align="center" label="操作">
              <template slot-scope="scope">
                <el-button class="table_button" type="primary" @click="typeFourDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-dialog>
      <!-- 类型四END -->
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
      <!-- 类型五END -->
    </div>
  </div>
</template>

<script>
  export default {
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
      var rulessexs = (rule, value, callback) => {
        if(this.typeFourData.time !== ''){
          var str = this.typeFourData.time
          var patt = /^(20|21|22|23|[0-1]\d):[0-5]\d$/
          if(str.match(patt)){
            callback();
          } else {
            callback(new Error('请添加正确时间格式'));
          }
        }

        if(this.typeFourTable.length == 0){
          if(this.typeFourData.requirement == '必填'){
            callback(new Error('必填项请填写时间'));
          } else {
            callback();
          }
        } else {
          callback();
        }
      }
      return {
        input: '', // 搜索框末班名称
        options: [{
          label: '自由行'
        }, {
          label: '私家团'
        }, {
          label: '游学团'
        }, {
          label: '特价机票套餐'
        }, {
          label: '特价机票'
        }, {
          label: '半自助游'
        }, {
          label: '跟团游'
        }, {
          label: '自由行定制'
        }, {
          label: '景点门票'
        }, {
          label: '一日游'
        }, {
          label: '多日游'
        }, {
          label: '当地体验'
        }, {
          label: '当地定制'
        }, {
          label: '私家定制团'
        }, {
          label: '酒店套餐'
        }, {
          label: '演出展览'
        }, {
          label: '美食'
        }, {
          label: '接送机'
        }, {
          label: '包车/拼车'
        }, {
          label: '交通卡/卷'
        }, {
          label: '租车'
        }, {
          label: '签证'
        }, {
          label: 'WIFI'
        }, {
          label: '电话卡'
        }, {
          label: '保险'
        }, {
          label: '邮轮'
        }, {
          label: '打折卷'
        }, {
          label: '购物'
        }],
        searchValue: '', // 下拉框
        // 模板信息
        tableData: [{
          id: '001',
          templateName: '自由行模板',
          templateType: '自由行',
        }, {
          id: '002',
          templateName: '跟团游模板',
          templateType: '跟团游',
        }],
        tableHead: {height: '60px', color: '#555555'}, // 表格头部高度
        tableHeight: {padding: '0', height: '40px'}, // 各表格高度
        pagesize:4, // 每页的数据条数
        currentPage:1, // 默认开始页面
        addProducts: false, // 添加产品弹窗
        typeTwo: false, // 类型二的弹窗
        typeThree: false, // 类型三的弹窗
        typeFour: false, // 类型四的弹窗
        typeFive: false, // 类型五的弹窗
        sex: 0, // 判断是否是性别弹窗
        dataProducts: {
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
        typeThreeTables: [{
          size: 30
        }, {
          size: 31
        }, {
          size: 32
        }, {
          size: 33
        }, {
          size: 34
        }, {
          size: 35
        }, {
          size: 36
        }, {
          size: 37
        }, {
          size: 38
        }, {
          size: 39
        }, {
          size: 40
        }, {
          size: 41
        }, {
          size: 42
        }, {
          size: 43
        }, {
          size: 44
        }, {
          size: 45
        }, {
          size: 46
        }, {
          size: 47
        }, {
          size: 48
        }, {
          size: 49
        }, {
          size: 50
        }],
        // 类型三性别表格
        typeThreeTable: [{
          sex: '男(male)'
        }, {
          sex: '女(female)'
        }],
        // 类型四时间表格
        typeFourTable: [],
        // 储存性别表格
        sexTable: [],
        // 储存鞋码表格
        sizeTable: [],
        // 类型二
        typeTwoData: {
          name: '', // 字段名称
          requirement: '必填', // 填写要求
          certificates: [] // 证件选择
        },
        // 类型三
        typeThreeData: {
          name: '', // 字段名称
          requirement: '必填', // 填写要求
        },
        // 类型四
        typeFourData: {
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
            { required: true, message: '请填写模板名称', trigger: 'blur'}
          ],
          templateType: [
            { required: true, message: '请选择模板类型', trigger: 'blur'}
          ],
          travelNum: [
            { required: true, message: '请选择出行人个数', trigger: 'blur'}
          ],
          traveFillIn: [
            { required: true, message: '请选择出行人填写配置', trigger: 'blur'}            
          ]
        },
        // 类型二正则
        typeTwoRules: {
          certificates: [
            { validator: rulessex }
          ]
        },
        // 类型四正则
        typeFourRules: {
          timeFormat: [
            { validator: rulessexs }
          ]
        }
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
      travelInfos(row) {
        this.tableProducts = [];
        let data = this.dataProducts.travelInfo
        for(let i=0;i<data.length;i++){
          let name = data[i].substring(0, data[i].length - 2);
          let type = data[i].substring(data[i].length - 1, data[i].length);
          this.tableProducts.push({
            "name" : name,
            "selection" : "选填",
            "selectionValue" : '',
            "type" : type
          })
        }
      },
      handleEdit(key, data) {
        if(data.type == '2'){
          this.typeTwo = true;
          this.typeTwoData.name = data.name
          this.typeTwoData.key = key
        } else if(data.type == '3'){
          if(data.name == '性别'){
            this.sex = 1
          } else if(data.name == '鞋码(欧码)'){
            this.sex = 0
          }
          this.typeThree = true;
          this.typeThreeData.name = data.name
          this.typeThreeData.key = key
        } else if(data.type == '4'){
          this.typeFour = true;
          this.typeFourData.name = data.name
          this.typeFourData.key = key
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
            this.tableProducts[key].selection = this.typeTwoData.requirement
            this.tableProducts[key].selectionValue = this.typeTwoData.certificates.join('，')
            this.typeTwo = false;
          }
        })
      },
      // 类型三性别
      typeThreeClick(form, key) {
        if(form == 'typeThreeTable'){
          for(let i=0;i<this.typeThreeTable.length;i++){
            this.sexTable.push(this.typeThreeTable[i].sex)
          }
          this.tableProducts[key].selection = this.typeThreeData.requirement
          this.tableProducts[key].selectionValue = this.sexTable.join('，')
        } else if(form == 'typeThreeTables'){
          for(let i=0;i<this.typeThreeTables.length;i++){
            this.sizeTable.push(this.typeThreeTables[i].size)
          }
          this.tableProducts[key].selection = this.typeThreeData.requirement
          this.tableProducts[key].selectionValue = this.sizeTable.join('，')
        }
        this.typeThree = false;
      },
      addTime(form) {
        this.$refs[form].validate(valid => {
          if(valid){
            if(this.typeFourData.time != ''){
              this.typeFourTable.push({
                'time': this.typeFourData.time
              })
              }
              this.typeFourData.time = ''
              this.$refs[form].resetFields()
          }
        })
      },
      typeFourDelete(key, data) {
        this.typeFourTable.splice(key, 1);
      },
      // 类型四保存
      typeFourClick(form, key) {
        this.$refs[form].validate(valid => {
          if(valid){
            this.tableProducts[key].selection = this.typeFourData.requirement
            let arr =[]
            for(let i=0;i<this.typeFourTable.length;i++){
              arr.push(this.typeFourTable[i].time)
            }
            this.tableProducts[key].selectionValue = arr.join('，')
            this.typeFour = false
          }
        })
      },
      // 类型五保存
      typeFiveClick(key) {
        this.tableProducts[key].selection = this.typeFiveData.requirement
        this.typeFive = false
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
}
.page{
  float: left;
  margin-top: 125px;
  margin-bottom: 100px;
  margin-left: 280px;
}
.newTemplate{
  float: left;
  margin: -45px 0 0 0;
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
  width: 88%;
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
  margin-right: 18%;
  height: 30px;
  padding-top: 0;
  padding-bottom: 0; 
  margin-top: 6px;
}
.typeFour_list{
  margin-left: -100px;
}
</style>
