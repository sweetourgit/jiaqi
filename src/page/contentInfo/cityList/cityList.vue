<template>
  <div class="cityList">
      <el-cascader class="cascade" :popper-class="toolTipClass" :options="options" @change="handleChange"></el-cascader>
      <template v-if="geography == 1">
        <el-button class="add_country" type="primary" @click="addState = true">添加国家</el-button>
      </template>
      <template v-else-if="geography == 2">
        <el-button class="add_country" type="primary" @click="addProvince = true">添加省份</el-button>
      </template>
      <template v-else-if="geography == 3">
        <el-button class="add_country" type="primary" @click="addProvince = true">添加省份</el-button>
      </template>
      <div :class="search">
        <span class="keyword">输入关键字:</span>
        <el-autocomplete class="inputBox" clearable placeholder="请输入关键字" :fetch-suggestions="querySearch" suffix-icon="el-icon-search" v-model="input" :trigger-on-focus="false"></el-autocomplete>
        <el-button class="searchButton" type="primary" icon="el-icon-search"></el-button>
      </div>
      <!-- 国家列表 -->
      <template v-if="geography == 1">
        <el-table class="table_list" :data="tableData" border :header-row-style="tableHead" :cell-style="tableHeight" :header-cell-style="getRowClass" style="width: 100%;">
          <el-table-column :key="Math.random()" prop="id" label="ID" width="86" align="center"></el-table-column>
          <el-table-column :key="Math.random()" label="国家" width="219" align="center">
            <template slot-scope="scope">
              <el-tooltip placement="right" effect="light">
                <div slot="content">点击查看<br/>下级分类</div>
                <el-button type="text">{{ scope.row.country }}</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :key="Math.random()" prop="continent" label="所属大洲" align="center"></el-table-column>
          <el-table-column :key="Math.random()" prop="englishName" label="英文名" align="center"></el-table-column>
          <el-table-column :key="Math.random()" prop="pinyin" label="中文全拼" align="center"></el-table-column>
          <el-table-column :key="Math.random()" prop="initials" label="首字母" align="center"></el-table-column>
          <el-table-column :key="Math.random()" prop="code" label="代码" align="center"></el-table-column>
          <el-table-column :key="Math.random()" label="操作" fixed="right" align="center" width="500">
          <template slot-scope="scope">
            <div class="table_button_left">
              <el-button class="table_button" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button class="table_button" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </div>
            <div class="table_button_right">
              <el-button class="table_button1" type="success" @click="addProvince = true">添加省份</el-button>
              <el-button class="table_button1" type="success" @click="addCity1(scope.$index, scope.row)">添加城市</el-button>
            </div>
          </template>
          </el-table-column>
        </el-table>
        <el-pagination class="page" background @size-change="" @current-change="" :current-page="currentPage" :page-sizes="[2, 4, 8, 10]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="400">
        </el-pagination>
      </template>
      <!-- 国家列表END -->
      <!-- 省份列表 -->
      <template v-else-if="geography == 2">
        <el-table class="table_list" :data="tableDataProvince" border :header-row-style="tableHead" :cell-style="tableHeight" :header-cell-style="getRowClass" style="width: 100%;">
          <el-table-column :key="Math.random()" prop="id" label="ID" width="86" align="center"></el-table-column>
          <el-table-column :key="Math.random()" label="省份" width="219" align="center">
            <template slot-scope="scope">
              <el-tooltip placement="right" effect="light">
                <div slot="content">点击查看<br/>下级分类</div>
                <el-button type="text">{{ scope.row.province }}</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :key="Math.random()" prop="country" label="国家" align="center"></el-table-column>
          <el-table-column :key="Math.random()" prop="englishName" label="英文名" align="center"></el-table-column>
          <el-table-column :key="Math.random()" prop="pinyin" label="中文全拼" align="center"></el-table-column>
          <el-table-column :key="Math.random()" prop="initials" label="首字母" align="center"></el-table-column>
          <el-table-column :key="Math.random()" label="操作" fixed="right" align="center" width="400">
          <template slot-scope="scope">
            <el-button class="table_button" type="primary" @click="ProvinceEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button class="table_button" type="danger" @click="ProvinceDelete(scope.$index, scope.row)">删除</el-button>
            <el-button class="table_button1" type="success" @click="addCity1(scope.$index, scope.row)">添加城市</el-button>
          </template>
          </el-table-column>
        </el-table>
        <el-pagination class="page" background @size-change="" @current-change="" :current-page="currentPage" :page-sizes="[2, 4, 8, 10]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="400">
        </el-pagination>
      </template>
      <!-- 省份列表END -->
      <!-- 城市列表 -->
      <template v-else-if="geography == 3">
        <el-table class="table_list" :data="tableDataCity" border :header-row-style="tableHead" :cell-style="tableHeight" :header-cell-style="getRowClass" style="width: 100%;">
          <el-table-column :key="Math.random()" prop="id" label="ID" width="86" align="center"></el-table-column>
          <el-table-column :key="Math.random()" prop="city" label="城市" align="center"></el-table-column>
          <el-table-column :key="Math.random()" prop="province" label="省份" align="center"></el-table-column>
          <el-table-column :key="Math.random()" prop="country" label="国家" align="center"></el-table-column>
          <el-table-column :key="Math.random()" prop="englishName" label="英文名" align="center"></el-table-column>
          <el-table-column :key="Math.random()" prop="pinyin" label="中文全拼" align="center"></el-table-column>
          <el-table-column :key="Math.random()" prop="initials" label="首字母" align="center"></el-table-column>
          <el-table-column :key="Math.random()" prop="code" label="代码" align="center"></el-table-column>
          <el-table-column :key="Math.random()" prop="url" label="Url" width="380" align="center"></el-table-column>
          <el-table-column :key="Math.random()" label="操作" fixed="right" align="center" width="260">
          <template slot-scope="scope">
            <el-button class="table_button" type="primary" @click="CityEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button class="table_button" type="danger" @click="CityDelete(scope.$index, scope.row)">删除</el-button>
          </template>
          </el-table-column>
        </el-table>
        <el-pagination class="page" background @size-change="" @current-change="" :current-page="currentPage" :page-sizes="[2, 4, 8, 10]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="400">
        </el-pagination>
      </template>
      <!-- 城市列表END -->
      <!-- 添加国家弹框 -->
      <el-dialog class="add_country_popup" custom-class="city_list" title="添加国家" :visible.sync="addState" width="600px">
        <el-form :model="countryPopup" status-icon :rules="countryRules" ref="countryPopup">
          <el-form-item label="选择大洲:" prop="select" :label-width="formLabelWidth">
            <el-select class="country_select" v-model="countryPopup.select" placeholder="请选择">
              <el-option label="北美洲" value="shanghai"></el-option>
              <el-option label="亚洲" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="国家名称:" :label-width="formLabelWidth" prop="countryName">
            <el-input class="country_input" v-model="countryPopup.countryName" clearable></el-input>
          </el-form-item>
          <el-form-item label="英文名:" :label-width="formLabelWidth" prop="englishName">
            <el-input class="country_input" v-model="countryPopup.englishName" clearable></el-input>
          </el-form-item>
          <el-form-item label="中文全拼:" :label-width="formLabelWidth" prop="pinyin">
            <el-input class="country_input" v-model="countryPopup.pinyin" clearable></el-input>
          </el-form-item>
          <el-form-item label="首字母:" :label-width="formLabelWidth" prop="initials">
            <el-input class="country_input" v-model="countryPopup.initials" clearable></el-input>
          </el-form-item>
          <el-form-item label="代码:" :label-width="formLabelWidth" prop="code">
            <el-input class="country_input" v-model="countryPopup.code" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button class="Determine" @click="addState = false">取 消</el-button>
          <el-button class="Determine" type="primary" @click="countryForm('countryPopup')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 添加国家END -->
      <!-- 编辑国家弹框 -->
      <el-dialog class="edit_country_popup" custom-class="city_list" title="国家编辑" :visible.sync="editState" width="600px">
        <el-form :model="editCountryPopup" status-icon :rules="editCountryRules" ref="editCountryPopup">
          <el-form-item label="ID:" :label-width="formLabelWidth" prop="id">
            <span class="country_span">{{editCountryPopup.id}}</span>
          </el-form-item>
          <el-form-item label="选择大洲:" prop="select" :label-width="formLabelWidth">
            <el-select class="country_select" v-model="editCountryPopup.select" placeholder="请选择">
              <el-option label="北美洲" value="shanghai"></el-option>
              <el-option label="亚洲" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="国家名称:" :label-width="formLabelWidth" prop="countryName">
            <el-input class="country_input" v-model="editCountryPopup.countryName" clearable></el-input>
          </el-form-item>
          <el-form-item label="英文名:" :label-width="formLabelWidth" prop="englishName">
            <el-input class="country_input" v-model="editCountryPopup.englishName" clearable></el-input>
          </el-form-item>
          <el-form-item label="中文全拼:" :label-width="formLabelWidth" prop="pinyin">
            <el-input class="country_input" v-model="editCountryPopup.pinyin" clearable></el-input>
          </el-form-item>
          <el-form-item label="首字母:" :label-width="formLabelWidth" prop="initials">
            <el-input class="country_input" v-model="editCountryPopup.initials" clearable></el-input>
          </el-form-item>
          <el-form-item label="代码:" :label-width="formLabelWidth" prop="code">
            <el-input class="country_input" v-model="editCountryPopup.code" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button class="Determine" @click="editState = false">取 消</el-button>
          <el-button class="Determine" type="primary" @click="countryForm('editCountryPopup')">确 定</el-button>
        </div>
      </el-dialog>  
      <!-- 编辑国家END -->
      <!-- 添加省份弹框 -->
      <el-dialog class="add_country_popup" custom-class="city_list" title="添加省份" :visible.sync="addProvince" width="600px">
        <el-form :model="provincePopup" status-icon :rules="provinceRules" ref="provincePopup">
          <el-form-item label="所属国家:" :label-width="formLabelWidth" prop="countryName">
            <span class="country_span">{{provincePopup.countryName}}</span>
          </el-form-item>
          <el-form-item label="省份名称:" :label-width="formLabelWidth" prop="provinceName">
            <el-input class="country_input" v-model="provincePopup.provinceName" clearable></el-input>
          </el-form-item>
          <el-form-item label="英文名:" :label-width="formLabelWidth" prop="englishName">
            <el-input class="country_input" v-model="provincePopup.englishName" clearable></el-input>
          </el-form-item>
          <el-form-item label="中文全拼:" :label-width="formLabelWidth" prop="pinyin">
            <el-input class="country_input" v-model="provincePopup.pinyin" clearable></el-input>
          </el-form-item>
          <el-form-item label="首字母:" :label-width="formLabelWidth" prop="initials">
            <el-input class="country_input" v-model="provincePopup.initials" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button class="Determine" @click="addProvince = false">取 消</el-button>
          <el-button class="Determine" type="primary" @click="provinceForm('provincePopup')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 添加省份END -->
      <!-- 编辑省份弹框 -->
      <el-dialog class="edit_country_popup" custom-class="city_list" title="省份编辑" :visible.sync="editProvince" width="600px">
        <el-form :model="editProvincePopup" status-icon :rules="editProvinceRules" ref="editProvincePopup">
          <el-form-item label="ID:" :label-width="formLabelWidth" prop="id">
            <span class="country_span">{{editProvincePopup.id}}</span>
          </el-form-item>
          <el-form-item label="所属国家:" :label-width="formLabelWidth" prop="countryName">
            <span class="country_span">{{editProvincePopup.countryName}}</span>
          </el-form-item>
          <el-form-item label="省份名称:" :label-width="formLabelWidth" prop="provinceName">
            <el-input class="country_input" v-model="editProvincePopup.provinceName" clearable></el-input>
          </el-form-item>
          <el-form-item label="英文名:" :label-width="formLabelWidth" prop="englishName">
            <el-input class="country_input" v-model="editProvincePopup.englishName" clearable></el-input>
          </el-form-item>
          <el-form-item label="中文全拼:" :label-width="formLabelWidth" prop="pinyin">
            <el-input class="country_input" v-model="editProvincePopup.pinyin" clearable></el-input>
          </el-form-item>
          <el-form-item label="首字母:" :label-width="formLabelWidth" prop="initials">
            <el-input class="country_input" v-model="editProvincePopup.initials" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button class="Determine" @click="editProvince = false">取 消</el-button>
          <el-button class="Determine" type="primary" @click="provinceForm('editProvincePopup')">确 定</el-button>
        </div>
      </el-dialog>  
      <!-- 编辑省份END -->
      <!-- 添加城市弹框 -->
      <el-dialog class="add_country_popup edit_city_popup" custom-class="city_list" title="添加城市" :visible.sync="addCity" width="600px" style="height: 980px">
        <el-form :model="cityPopup" status-icon :rules="cityRules" ref="cityPopup">
          <el-form-item label="所属国家:" :label-width="formLabelWidth" prop="countryName">
            <span class="country_span">{{cityPopup.countryName}}</span>
          </el-form-item>
          <el-form-item label="所属省份:" :label-width="formLabelWidth" prop="provinceName">
            <span class="country_span">{{cityPopup.provinceName}}</span>
          </el-form-item>
          <el-form-item label="城市名称:" :label-width="formLabelWidth" prop="cityName">
            <el-input class="country_input" v-model="cityPopup.cityName" clearable></el-input>
          </el-form-item>
          <el-form-item label="备用名:" :label-width="formLabelWidth" prop="reserveName">
            <el-input class="country_input" v-model="cityPopup.reserveName" clearable></el-input>
          </el-form-item>
          <el-form-item label="Url:" :label-width="formLabelWidth" prop="url">
            <el-input class="country_input" v-model="cityPopup.url" clearable></el-input>
          </el-form-item>
          <el-form-item label="英文名:" :label-width="formLabelWidth" prop="englishName">
            <el-input class="country_input" v-model="cityPopup.englishName" clearable></el-input>
          </el-form-item>
          <el-form-item label="中文全拼:" :label-width="formLabelWidth" prop="pinyin">
            <el-input class="country_input" v-model="cityPopup.pinyin" clearable></el-input>
          </el-form-item>
          <el-form-item label="首字母:" :label-width="formLabelWidth" prop="initials">
            <el-input class="country_input" v-model="cityPopup.initials" clearable></el-input>
          </el-form-item>
          <el-form-item label="代码:" :label-width="formLabelWidth" prop="code">
            <el-input class="country_input" v-model="cityPopup.code" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button class="Determine" @click="addCity = false">取 消</el-button>
          <el-button class="Determine" type="primary" @click="cityForm('cityPopup')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 添加城市END -->
      <!-- 编辑城市弹框 -->
      <el-dialog class="add_country_popup edit_city_popup" custom-class="city_list" title="编辑城市" :visible.sync="editCity" width="600px" style="height:1050px">
        <el-form :model="editCityPopup" status-icon :rules="editCityRules" ref="editCityPopup">
          <el-form-item label="ID:" :label-width="formLabelWidth" prop="id">
            <span class="country_span">{{editCityPopup.id}}</span>
          </el-form-item>
          <el-form-item label="所属国家:" :label-width="formLabelWidth" prop="countryName">
            <span class="country_span">{{editCityPopup.countryName}}</span>
          </el-form-item>
          <el-form-item label="所属省份:" :label-width="formLabelWidth" prop="provinceName">
            <span class="country_span">{{editCityPopup.provinceName}}</span>
          </el-form-item>
          <el-form-item label="城市名称:" :label-width="formLabelWidth" prop="cityName">
            <el-input class="country_input" v-model="editCityPopup.cityName" clearable></el-input>
          </el-form-item>
          <el-form-item label="备用名:" :label-width="formLabelWidth" prop="reserveName">
            <el-input class="country_input" v-model="editCityPopup.reserveName" clearable></el-input>
          </el-form-item>
          <el-form-item label="Url:" :label-width="formLabelWidth" prop="url">
            <el-input class="country_input" v-model="editCityPopup.url" clearable></el-input>
          </el-form-item>
          <el-form-item label="英文名:" :label-width="formLabelWidth" prop="englishName">
            <el-input class="country_input" v-model="editCityPopup.englishName" clearable></el-input>
          </el-form-item>
          <el-form-item label="中文全拼:" :label-width="formLabelWidth" prop="pinyin">
            <el-input class="country_input" v-model="editCityPopup.pinyin" clearable></el-input>
          </el-form-item>
          <el-form-item label="首字母:" :label-width="formLabelWidth" prop="initials">
            <el-input class="country_input" v-model="editCityPopup.initials" clearable></el-input>
          </el-form-item>
          <el-form-item label="代码:" :label-width="formLabelWidth" prop="code">
            <el-input class="country_input" v-model="editCityPopup.code" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button class="Determine" @click="editCity = false">取 消</el-button>
          <el-button class="Determine" type="primary" @click="cityForm('editCityPopup')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑城市END -->
  </div>
</template>

<script>
  export default {
    data() {
      return {
        options: [{
          value: '1',
          label: '全部国家'
        },{
          value: 'zhinan',
          label: '中国',
          children: [{
          label: '全部省份',
          value: '2',
        },{
            value: 'heik',
            label: '黑龙江',
            children: [{
            label: '全部城市',
            value: '3',
          },{
              value: 'haerbin',
              label: '哈尔滨',
            }]
          }]
        },{
          value: 'zqwewq',
          label: '日本',
          children: [{
          label: '全部城市',
          value: '3',
        },{
            value: 'dongjing',
            label: '东京',
          }]
        }],
        tableData: [{
          id: '001',
          country: '中国',
          continent: '亚洲',
          englishName: 'China',
          pinyin: 'zhongguo',
          initials: 'ZG',
          code: 'CHN',
          value: '中国'
        },{
          id: '002',
          country: '美国',
          continent: '亚洲',
          englishName: 'China',
          pinyin: 'zhongguo',
          initials: 'ZG',
          code: 'CHN',
          value: '美国'
        }],
        // 添加国家数据
        countryPopup: {
          countryName: '',
          englishName: '',
          pinyin: '',
          initials: '',
          code: '',
          select: ''
        },
        // 编辑国家数据
        editCountryPopup: {
          id: '',
          countryName: '',
          englishName: '',
          pinyin: '',
          initials: '',
          code: '',
          select: ''
        },
        // 添加国家正则判断
        countryRules: {
          select: [
            { required: true, message: '请选择大洲', trigger: 'blur'},
          ],
          countryName: [
            { required: true, message: '请填写国家名称', trigger: 'blur'},
            { pattern: /^[\u4e00-\u9fa5]{2,6}$/, message: '请输入2-6位汉字'}
          ],
          pinyin: [
            {pattern: /^[a-z]+$/, message: '请输入小写字母,不能有空格'}
          ],
          initials: [
            {pattern: /^[A-Z]+$/, message: '请输入大写字母,不能有空格'}
          ]
        },
        // 编辑国家正则判断
        editCountryRules: {
          select: [
            { required: true, message: '请选择大洲', trigger: 'blur'},
          ],
          countryName: [
            { required: true, message: '请填写国家名称', trigger: 'blur'},
            { pattern: /^[\u4e00-\u9fa5]{2,6}$/, message: '请输入2-6位汉字'}
          ],
          pinyin: [
            {pattern: /^[a-z]+$/, message: '请输入小写字母,不能有空格'}
          ],
          initials: [
            {pattern: /^[A-Z]+$/, message: '请输入大写字母,不能有空格'}
          ]
        },
        search: 'search',
        value: '',
        toolTipClass: 'popper__arrow',
        input: '',// 搜索框
        countryList: '',// 国家
        tableHead: {height: '60px', color: '#555555'}, // 表格头部高度
        tableHeight: {padding: '0', height: '34px'}, // 各表格高度
        pagesize:4, // 每页的数据条数
        currentPage:1, // 默认开始页面
        geography: '', // 判断国家 省份 城市
        addState: false, // 添加国家弹框
        formLabelWidth: '160px', // 弹窗item宽度
        addState: false, // 添加国家弹窗
        editState: false, // 编辑国家弹框
        // 省份数据 ==========================================
        addProvince: false, // 添加省份弹窗
        editProvince: false, // 编辑省份弹窗
        // 省份表格数据
        tableDataProvince: [{
          id: '001',
          province: '辽宁',
          country: '中国',
          englishName: 'Liaoning',
          pinyin: 'liaoning',
          initials: 'LN',
        },{
          id: '002',
          province: '上海',
          country: '中国',
          englishName: 'Liaoning',
          pinyin: 'liaoning',
          initials: 'LN',
        }],
        // 添加省份数据
        provincePopup: {
          countryName: '中国',
          provinceName: '',
          englishName: '',
          pinyin: '',
          initials: '',
        },
        // 编辑省份数据
        editProvincePopup: {
          id: '',
          countryName: '中国',
          provinceName: '',
          englishName: '',
          pinyin: '',
          initials: '',
        },
        // 添加省份正则判断
        provinceRules: {
          provinceName: [
            { required: true, message: '请填写省份名称', trigger: 'blur'},
            { pattern: /^[\u4e00-\u9fa5]{2,6}$/, message: '请输入2-6位汉字'}
          ],
          pinyin: [
            {pattern: /^[a-z]+$/, message: '请输入小写字母,不能有空格'}
          ],
          initials: [
            {pattern: /^[A-Z]+$/, message: '请输入大写字母,不能有空格'}
          ]
        },
        // 编辑省份正则判断
        editProvinceRules: {
          provinceName: [
            { required: true, message: '请填写省份名称', trigger: 'blur'},
            { pattern: /^[\u4e00-\u9fa5]{2,6}$/, message: '请输入2-6位汉字'}
          ],
          pinyin: [
            {pattern: /^[a-z]+$/, message: '请输入小写字母,不能有空格'}
          ],
          initials: [
            {pattern: /^[A-Z]+$/, message: '请输入大写字母,不能有空格'}
          ]
        },
        // 城市数据 ==========================================
        addCity: false, // 添加城市弹窗
        editCity: false, // 编辑城市弹窗
        // 城市表格数据
        tableDataCity: [{
          id: '001',
          city: '沈阳',
          province: '辽宁',
          country: '中国',
          englishName: 'ShenYang',
          pinyin: 'shenyang',
          initials: 'SY',
          code: '',
          url: 'www.baidu.com'
        },{
          id: '002',
          city: '上海',
          province: '-',
          country: '中国',
          englishName: 'ShangHai',
          pinyin: 'shanghai',
          initials: 'SH',
          code: '',
          url: 'www.baidu.com'
        }],
        // 添加城市数据
        cityPopup: {
          countryName: '',
          provinceName: '',
          cityName: '',
          reserveName: '',
          url: '',
          englishName: '',
          pinyin: '',
          initials: '',
          code: ''
        },
        // 编辑城市数据
        editCityPopup: {
          id: '',
          countryName: '',
          provinceName: '',
          cityName: '',
          reserveName: '',
          url: '',
          englishName: '',
          pinyin: '',
          initials: '',
          code: ''
        },
        // 添加城市正则判断
        cityRules: {
          cityName: [
            { required: true, message: '请填写城市名称', trigger: 'blur'},
            { pattern: /^[\u4e00-\u9fa5]{2,6}$/, message: '请输入2-6位汉字'}
          ],
          pinyin: [
            {pattern: /^[a-z]+$/, message: '请输入小写字母,不能有空格'}
          ],
          initials: [
            {pattern: /^[A-Z]+$/, message: '请输入大写字母,不能有空格'}
          ]
        },
        // 编辑城市正则判断
        editCityRules: {
          cityName: [
            { required: true, message: '请填写城市名称', trigger: 'blur'},
            { pattern: /^[\u4e00-\u9fa5]{2,6}$/, message: '请输入2-6位汉字'}
          ],
          pinyin: [
            {pattern: /^[a-z]+$/, message: '请输入小写字母,不能有空格'}
          ],
          initials: [
            {pattern: /^[A-Z]+$/, message: '请输入大写字母,不能有空格'}
          ]
        }
      }
    },
    methods: {
      handleChange(value) {
        let num = String(value);
        let str = num.substring(num.indexOf(",") + 1,num.length);
        let str1 = str.indexOf(",") !== -1 ?str.substring(str.indexOf(",") + 1,str.length) :num.substring(num.indexOf(",") + 1,num.length);
        this.geography = str1
        if(this.geography !== 'search'){
          this.search = 'search1'
        }
      },
      // 搜索方法
      querySearch(queryString, cb) {
        var results = queryString ? this.tableData.filter(this.createFilter(queryString)) : [];
        cb(results);
      },
      // 搜索方法
      createFilter(queryString){
        return (restaurant) => {
          return (restaurant.country.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        }
      },
      // 表格头部背景颜色
      getRowClass({ row, column, rowIndex, columnIndex }) {  
          if (rowIndex == 0) {  
            return 'background:#F7F7F7'  
          } else {  
            return ''  
          }  
      },
      // ========国家开始 =================================================
      // 添加 编辑 国家保存成功
      countryForm(formName) {
        this.$refs[formName].validate(valid => {
          if(valid) {
            this.$message.success('验证成功！');
            if(formName == 'countryPopup'){
              this.addState = false; 
              this.$refs['countryPopup'].resetFields()
            } else if(formName == 'editCountryPopup'){
              this.editState = false; 
              this.$refs['editCountryPopup'].resetFields()
            }
          } else {
            this.$message.error('验证失败！') ;
          }
        })
      },
      // 编辑国家
      handleEdit(key, data){
        this.editState = true;
        this.editCountryPopup.id = data.id;
        this.editCountryPopup.code = data.code;
        this.editCountryPopup.countryName = data.country;
        this.editCountryPopup.englishName = data.englishName;
        this.editCountryPopup.initials = data.initials;
        this.editCountryPopup.pinyin = data.pinyin;
        this.editCountryPopup.select = data.continent;
      },
      // 删除国家
      handleDelete(key, data){
        this.$confirm('是否删除该国家', '信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'delete_country',
          confirmButtonClass: 'delete_country_determine',
          cancelButtonClass: 'delete_country_determine1'
        }).then(() => {
          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // });


          this.$alert('<p>该国家下存在城市或省份 , 不能删除 ;</p><p>请清空城市或省份在删除 !</p>', '信息', {
            confirmButtonText: '确定',
            customClass: 'delete_country',
            dangerouslyUseHTMLString: true,
            confirmButtonClass: 'delete_country_determine',
          })


        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      // ========省份开始 =================================================
      // 添加省份保存成功
      provinceForm(formName){
        this.$refs[formName].validate(valid => {
          if(valid) {
            this.$message.success('验证成功！');
            if(formName == 'provincePopup'){
              this.addProvince = false; 
              this.$refs['provincePopup'].resetFields();
            } else if(formName == 'editProvincePopup') {
              this.editProvince = false;
              this.$refs['editProvincePopup'].resetFields();
            }
          } else {
            this.$message.error('验证失败！') ;
          }
        })
      },
      // 编辑省份
      ProvinceEdit(key, data){
        this.editProvince = true;
        this.editProvincePopup.id = data.id;
        this.editProvincePopup.provinceName = data.province;
        this.editProvincePopup.englishName = data.englishName;
        this.editProvincePopup.pinyin = data.pinyin;
        this.editProvincePopup.initials = data.initials;
      },
      //删除省份
      ProvinceDelete(key, data){
        this.$confirm('是否删除该省份', '信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'delete_country',
          confirmButtonClass: 'delete_country_determine',
          cancelButtonClass: 'delete_country_determine1'
        }).then(() => {
          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // });


          this.$alert('<p>该省份下存在城市 , 不能删除 ;</p><p>请清空城市在删除 !</p>', '信息', {
            confirmButtonText: '确定',
            customClass: 'delete_country',
            dangerouslyUseHTMLString: true,
            confirmButtonClass: 'delete_country_determine',
          })


        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      // ========城市开始 =================================================
      // 城市保存
      cityForm(formName){
        this.$refs[formName].validate(valid => {
          if(valid) {
            this.$message.success('验证成功！');
            if(formName == 'cityPopup'){
              this.addCity = false; 
              this.$refs['cityPopup'].resetFields();
            } else if(formName == 'editCityPopup'){
              this.editCity = false; 
              this.$refs['editCityPopup'].resetFields();
            }
          } else {
            this.$message.error('验证失败！') ;
          }
        })
      },
      // 添加城市
      addCity1(key, data){
        this.addCity = true;
        this.cityPopup.countryName = data.country;
        this.cityPopup.provinceName = data.province;
      },
      // 编辑城市
      CityEdit(key, data){
        this.editCity = true;
        this.editCityPopup.id = data.id;
        this.editCityPopup.countryName = data.country;
        this.editCityPopup.provinceName = data.province;
        this.editCityPopup.cityName = data.city;
        this.editCityPopup.url = data.url;
        this.editCityPopup.englishName = data.englishName;
        this.editCityPopup.pinyin = data.pinyin;
        this.editCityPopup.initials = data.initials;
        this.editCityPopup.code = data.code;
      },
      // 删除城市
      CityDelete(key, data){
        this.$confirm('是否删除该城市', '信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'delete_country',
          confirmButtonClass: 'delete_country_determine',
          cancelButtonClass: 'delete_country_determine1'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
    }
  }
</script>

<style scoped>
.cascade{ float: left;}
.popper__arrow{ background: red !important;}
.search{ float: left; margin: 85px 0 0 -100px;}
.search1{ float: left; margin: 85px 0 0 -198px;}
.keyword{ float: left; position: relative; top: 13px;}
.inputBox{ float: left; margin: 0 0 0 20px; width: 300px;}
.searchButton{ float: right; margin: 0 0 0 20px;}
.table_list{ position: relative; top: 96px;}
.table_button_left{ float: left; margin: 0 0 0 90px;}
.table_button{ width: 50px; height: 22px; padding: 0;}
.table_button_right{ float: right; margin: 0 90px 0 0;}
.table_button1{ width: 70px; height: 22px; padding: 0;}
.add_country{float: left; position: relative; top: 156px; right: 215px;}
.page{ float: right; margin-top: 125px; margin-bottom: 100px;}
.country_input{ width: 300px; margin: 0 95px 0 0;}
.country_select{ width: 300px; margin: 0 95px 0 0;}
.dialog-footer{ text-align: center;}
.Determine{ margin: 20px; width: 110px;}
.country_span{ float: left; margin: 0 0 0 30px;}
.edit_city_popup{ margin: -90px 0 0 0;}
</style>