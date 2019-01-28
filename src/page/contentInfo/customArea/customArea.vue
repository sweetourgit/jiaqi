<template>
  <div>
    <div class="big">
      <div class="top">
        <el-button type="primary" class="add-classification" @click="addClassification = true">添加分类</el-button>
      </div>
      <div class="bottom_customArea_list">
        <el-table :data="classificationTable" style="width: 100%" :cell-style="bottom_table" :span-method="objectSpanMethod">
          <el-table-column prop="classification" label="分类" align="center">
            <el-table-column label="名称" prop="classificationName" align="center">
              <template slot-scope="scope">
                <div class="father">
                  <span class="name">{{ scope.row.classificationName }}</span>
                  <span class="icon">
                    <i class="el-icon-edit" @click="editClassification = true"></i>
                    <i class="el-icon-remove" @click="removeClassification"></i>
                    <i class="el-icon-circle-plus" @click="addGrouping = true"></i>
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="排序" prop="classificationRank" align="center"></el-table-column>
          </el-table-column>
          <el-table-column prop="grouping" label="分组" align="center">
            <el-table-column label="名称" prop="groupingName" align="center">
              <template slot-scope="scope">
                <div class="father">
                  <span class="name">{{ scope.row.groupingName }}</span>
                  <span class="icon">
                    <i class="el-icon-edit" @click="editGrouping = true"></i>
                    <i class="el-icon-remove" @click="removeGrouping"></i>
                    <i class="el-icon-circle-plus" @click="addCity = true"></i>
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="排序" prop="groupingRank" align="center"></el-table-column>
            <el-table-column label="分组url" prop="groupingUrl" align="center" width="618"></el-table-column>
          </el-table-column>
          <el-table-column prop="city" label="城市" align="center">
            <el-table-column label="名称" prop="cityName" align="center">
              <template slot-scope="scope">
                <div class="father">
                  <span class="name">{{ scope.row.cityName }}</span>
                  <span class="icon">
                    <i class="el-icon-edit" @click="editCity = true"></i>
                    <i class="el-icon-remove" @click="removeCity"></i>
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="排序" prop="cityRank" align="center"></el-table-column>
          </el-table-column>
        </el-table>
        <div class="block">
            <!--   @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage4" -->
          <el-pagination
            background
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400">
          </el-pagination>
        </div>
      </div>
      <!-- 添加分类弹框 -->
      <el-dialog title="添加分类" custom-class="city_list" :visible.sync="addClassification" class="Popup" width>
        <el-form style="padding-left:79px" :model="form" :rules="rules" ref="form">
          <el-form-item label="分类名称：" prop="classificationName" :label-width="formLabelWidth" class="boom">
            <el-input v-model="form.classificationName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="排序：" :label-width="formLabelWidth" class="boom" prop="classificationRank">
            <el-input v-model="form.classificationRank" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="classification-footer">
          <el-button class="oppp" @click="addClassification_ceil('form')">取 消</el-button>
          <el-button class="oppp" type="primary" @click="addsave('form')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑分类弹框 -->
      <el-dialog title="编辑分类" custom-class="city_list" :visible.sync="editClassification" class="Popup">
        <el-form style="padding-left:79px" :model="editForm" :rules="rules" ref="editForm">
          <el-form-item label="分类名称：" prop="classificationName" :label-width="formLabelWidth" class="boom">
            <el-input v-model="editForm.classificationName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="排序：" :label-width="formLabelWidth" class="boom" prop="classificationRank">
            <el-input v-model="editForm.classificationRank" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="classification-footer">
          <el-button class="oppp" @click="editClassification_ceil('editForm')">取 消</el-button>
          <el-button class="oppp" type="primary" @click="editsave('editForm')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 添加分组弹框 -->
      <el-dialog title="添加分组" custom-class="city_list" :visible.sync="addGrouping" class="Popup" width="580px">
        <el-form style="padding-left:79px" :model="addGroup" :rules="rules" ref="addGroup">
          <el-form-item label="分类：" :label-width="formLabelWidth" class="boom">
            <span class="zoon">国内</span>
          </el-form-item>
          <el-form-item label="分组名称：" :label-width="formLabelWidth" class="boom" prop="groupingName">
            <el-input v-model="addGroup.groupingName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="排序：" :label-width="formLabelWidth" class="boom" prop="groupingRank">
            <el-input v-model="addGroup.groupingRank" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="url：" :label-width="formLabelWidth" class="url" prop="groupingUrl">
            <el-input v-model="addGroup.groupingUrl" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="classification-footer">
          <el-button class="oppp" @click="addGrouping_ceil('addGroup')">取 消</el-button>
          <el-button class="oppp" type="primary" @click="addGroupingSave('addGroup')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分组编辑弹框 -->
      <el-dialog title="编辑分组" custom-class="city_list" :visible.sync="editGrouping" class="Popup" width="580px">
        <el-form style="padding-left:79px" :model="editGroup" :rules="rules" ref="editGroup">
          <el-form-item label="分类：" :label-width="formLabelWidth" class="boom">
            <span class="zoon">国内</span>
          </el-form-item>
          <el-form-item label="分组名称：" :label-width="formLabelWidth" class="boom" prop="groupingName">
            <el-input v-model="editGroup.groupingName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="排序：" :label-width="formLabelWidth" class="boom" prop="groupingRank">
            <el-input v-model="editGroup.groupingRank" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="url：" :label-width="formLabelWidth" class="url" prop="groupingUrl">
            <el-input v-model="editGroup.groupingUrl" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="classification-footer">
          <el-button class="oppp" @click="editGrouping_ceil('editGroup')">取 消</el-button>
          <el-button class="oppp" type="primary" @click="editGroupingSave('editGroup')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 城市编辑 -->
      <el-dialog title="编辑城市" custom-class="city_list" :visible.sync="editCity" class="Popup">
        <el-form style="padding-left:79px" :model="editCitys" :rules="rules" ref="editCitys">
          <el-form-item label="分类：" :label-width="formLabelWidth" class="boom">
            <span class="zoonA">国内</span>
          </el-form-item>
          <el-form-item label="分组：" :label-width="formLabelWidth" class="boom">
            <span class="zoonB">直辖市</span>
          </el-form-item>
          <el-form-item label="城市名称：" :label-width="formLabelWidth" class="boom">
            <span class="zoonA">北京</span>
          </el-form-item>
          <el-form-item label="排序：" :label-width="formLabelWidth" class="boom" prop="cityRank">
            <el-input v-model="editCitys.cityRank" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="classification-footer">
          <el-button class="oppp" @click="editCity_ceil('editCitys')">取 消</el-button>
          <el-button class="oppp" type="primary" @click="editCitySave('editCitys')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 添加城市 -->
      <el-dialog title="添加城市" custom-class="city_list" :visible.sync="addCity" class="Popup">
        <el-form style="padding-left:79px" :model="addCitys" :rules="rules" ref="addCitys">
          <el-form-item label="分类：" :label-width="formLabelWidth" class="boom">
            <span class="zoonA">国内</span>
          </el-form-item>
          <el-form-item label="分组：" :label-width="formLabelWidth" class="boom">
            <span class="zoonB">直辖市</span>
          </el-form-item>
          <el-form-item label="选择城市：" :label-width="formLabelWidth" class="boom" prop="cityName">
            <el-cascader placeholder="请选择" :options="options" filterable change-on-select class="cascader" v-model="addCitys.cityName"></el-cascader>
          </el-form-item>
          <el-form-item label="排序：" :label-width="formLabelWidth" class="boom" prop="cityRank">
            <el-input v-model="addCitys.cityRank" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="classification-footer">
          <el-button class="oppp" @click="addCity_ceil('addCitys')">取 消</el-button>
          <el-button class="oppp" type="primary" @click="addCitySave('addCitys')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      classificationTable: [
        {
          classificationName: "国内",
          classificationRank: "01",
          groupingName: "直辖市",
          groupingRank: "01",
          groupingUrl:
            "http://www.dytyou.com/gonglue/jianjie/city11893-beijing.html",
          cityName: "北京",
          cityRank: "01"
        },
        {
          cityName: "天津",
          cityRank: "02"
        },
        {
          cityName: "上海",
          cityRank: "03"
        },
        {
          groupingName: "四川、重庆",
          groupingRank: "02",
          groupingUrl:
            "http://www.dytyou.com/gonglue/jianjie/city11893-beijing.html",
          cityName: "成都",
          cityRank: "01"
        },
        {
          cityName: "九寨沟",
          cityRank: "02"
        },
        {
          cityName: "都江堰",
          cityRank: "03"
        },
        {
          cityName: "稻城亚丁",
          cityRank: "04"
        },
        {
          groupingName: "港澳台",
          groupingRank: "03",
          groupingUrl:
            "http://www.dytyou.com/gonglue/jianjie/city11893-beijing.html",
          cityName: "香港",
          cityRank: "01"
        },
        {
          cityName: "澳门",
          cityRank: "02"
        },
        {
          classificationName: "欧洲",
          classificationRank: "02",
          groupingName: "北欧",
          groupingRank: "01",
          groupingUrl:
            "http://www.dytyou.com/gonglue/jianjie/city11893-beijing.html",
          cityName: "冰岛",
          cityRank: "01"
        },
        {
          cityName: "芬兰",
          cityRank: "02"
        },
        {
          cityName: "挪威",
          cityRank: "03"
        },
        {
          cityName: "丹麦",
          cityRank: "04"
        },
        {
          cityName: "瑞典",
          cityRank: "05"
        }
      ],
      // 城市级联数据
      options: [
        {
          value: "zhongguo",
          label: "中国",
          children: [
            {
              value: "henansheng",
              label: "河南省",
              children: [
                {
                  value: "shijiazhuangshi",
                  label: "石家庄市"
                },
                {
                  value: "tangshan",
                  label: "唐山"
                },
                {
                  value: "qinhuangdao",
                  label: "秦皇岛"
                },
                {
                  value: "handan",
                  label: "邯郸"
                }
              ]
            },
            {
              value: "jilinsheng",
              label: "吉林省"
            }
          ]
        },
        {
          value: "riben",
          label: "日本"
        }
      ],
      // 添加分类
      addClassification: false,
      form: {
        classificationName: "",
        classificationRank: ""
      },
      // 编辑分类
      editClassification: false,
      editForm: {
        classificationName: "国内",
        classificationRank: "01"
      },
      // 添加分组
      addGrouping: false,
      addGroup: {
        groupingName: "",
        groupingRank: "",
        groupingUrl: ""
      },
      // 编辑分组
      editGrouping: false,
      editGroup: {
        groupingName: "直辖市",
        groupingRank: "01",
        groupingUrl:
          "http://www.dytyou.com/gonglue/jianjie/city11893-beijing.html"
      },
      // 编辑城市
      editCity: false,
      editCitys: {
        cityRank: "01"
      },
      // 添加城市
      addCity: false,
      addCitys: {
        cityRank: ""
      },
      formLabelWidth: "200px",
      //表格内边距
      bottom_table: {
        height: "36px",
        padding: "0"
      },
      rules: {
        classificationName: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { pattern: /^[\u4e00-\u9fa5]{2,10}$/, message: "请输入2-10位汉字" }
        ],
        classificationRank: [ { required: true, message: "排序不能为空", trigger: "blur" } ],
        groupingName: [
          { required: true, message: "请输入分组名称", trigger: "blur" },
          { pattern: /^[\u4e00-\u9fa5]{2,10}$/, message: "请输入2-10位汉字" }
        ],
        groupingRank: [ { required: true, message: "排序不能为空", trigger: "blur" } ],
        cityRank: [ { required: true, message: "排序不能为空", trigger: "blur" } ],
        cityName: [ { required: true, message: "城市必选", trigger: "blur" } ]
      }
    };
  },
  methods: {
    //添加分类
    addsave(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$message.success("添加成功");
          this.addClassification= false;
        } else {
          return false;
        }
      });
    },
    //编辑分类
    editsave(editForm){
      this.$refs[editForm].validate((valid) => {
        if (valid) {
          this.$message.success("修改成功");
          this.editClassification= false;
        } else {
          return false;
        }
      });
    },
    //添加分组
    addGroupingSave(addGroup){
      this.$refs[addGroup].validate((valid) => {
        if (valid) {
          this.$message.success("添加成功");
          this.addGrouping= false;
        } else {
          return false;
        }
      });
    },
    //编辑分组
    editGroupingSave(editGroup){
      this.$refs[editGroup].validate((valid) => {
        if (valid) {
          this.$message.success("修改成功");
          this.editGrouping= false;
        } else {
          return false;
        }
      });
    },
    //添加城市
    addCitySave(addCitys){
       this.$refs[addCitys].validate((valid) => {
        if (valid) {
          this.$message.success("添加成功");
          this.addCity= false;
        } else {
          return false;
        }
      });
    },
    //编辑城市
    editCitySave(editCitys){
      this.$refs[editCitys].validate((valid) => {
        if (valid) {
          this.$message.success("修改成功");
          this.editCity= false;
        } else {
          return false;
        }
      });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        if (rowIndex === 0) {
          return {
            rowspan: 9,
            colspan: 1
          };
        } else if (rowIndex === 9) {
          return {
            rowspan: 5,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      } else if (columnIndex === 4 || columnIndex === 3 || columnIndex === 2) {
        if (rowIndex === 0) {
          return {
            rowspan: 3,
            colspan: 1
          };
        } else if (rowIndex === 3) {
          return {
            rowspan: 4,
            colspan: 1
          };
        } else if (rowIndex === 7) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else if (rowIndex === 9) {
          return {
            rowspan: 5,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    removeClassification() {
      this.$confirm("是否删除该分类？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    },
    removeGrouping() {
      this.$confirm("是否删除该分组?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    },
    removeCity() {
      this.$confirm("是否删除该城市?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    },
    // 添加分类取消
    addClassification_ceil(a){
      this.addClassification = false;
      this.$refs[a].resetFields();
    },
    // 编辑分类取消
    editClassification_ceil(a){
      this.editClassification = false;
      this.$refs[a].resetFields();
    },
    // 添加分组取消
    addGrouping_ceil(a){
      this.addGrouping = false;
      this.$refs[a].resetFields();
    },
    // 编辑分组取消
    editGrouping_ceil(a){
      this.editGrouping = false;
      this.$refs[a].resetFields();
    },
    // 添加城市取消
    addCity_ceil(a){
      this.addCity = false;
      this.$refs[a].resetFields();
    },
    // 编辑城市取消
    editCity_ceil(a){
      this.editCity = false;
      this.$refs[a].resetFields();
    }
  }
};
</script>

<style scoped lang='stylus'>
.big { width: 100%; height: 75%; }
.top { width: 100%; height: 50px; }
.bottom_customArea_list { width: 100%; }
.add-classification { float: left; }
.icon { display: none; }
.father:hover .icon { display: inline-block; }
.block { margin-top: 20px; float: right; margin-bottom:50px; }
.Popup { margin: 0 auto; }
.boom { position: relative; right: 100px; }
.zoon { position: relative; right: 115px; }
.url { position: relative; right: 100px; width: 550px; }
.cascader { margin-right: 45px; }
.el-dialog__wrapper>>>.el-dialog { width: 500px; }
.classification-footer{ text-align :center; }
.oppp{ margin: 20px; width:100px; }
.zoonA{ position: relative; right: 77px; }
.zoonB{ position: relative; right: 70px; }
.big>>>.el-table__body tr:hover>td{ background-color:initial !important; }
.big>>>.el-table__body tr.current-row>td{ background-color: initial !important; }
</style>
