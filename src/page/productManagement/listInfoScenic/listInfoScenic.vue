<template>
  <div class="vivo" style="position:relative;width:100%;" id="productDo">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
      <div class="btn" style="z-index:99;right:10%;height:50px;width: 100%;">
        <el-button class="btn-button" style="background:#3095fa;color:#fff" @click="addsave('ruleForm')">添加</el-button>
        <el-button plain class="btn-button" @click="cancel()">取消</el-button>
      </div>
      <div>
        <!--产品名称-->
        <el-form-item label="产品名称" prop="productNamel" label-width="120px">
          <el-input v-model="ruleForm.productNamel" class="productName" placeholder="请输入正确产品名称" maxlength="30" show-word-limit></el-input>
        </el-form-item>
        <!-- 目的地 -->
        <el-form-item label="目的地" ref="destinations" style="clear:both;" label-width="120px">
          <div class="destination-input">
            <el-tag :key="tag4.destination" v-for="tag4 in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag4)">
              {{tag4.destination}}
            </el-tag>
            <el-autocomplete id="input-error" class="input-new-tags" v-if="inputVisible" v-model="ruleForm.destinations" ref="saveTagInput" size="small" placeholder="请输入目的地" @keyup.enter.native="handleInputConfirm" :fetch-suggestions="querySearch" :trigger-on-focus="false" @select="dest" @blur="handleInputConfirm">
            </el-autocomplete>
            <el-button v-else class="input-new-tag" size="small" @click="showInput">请输入目的地</el-button>
          </div>
          <span id="zero" v-show="errorNull">目的地不能为空</span>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "listInfoScenic",
  components: {},
  data() {
    return {
      //目的地
      dynamicTags: [],
      inputVisible: false,
      tableData2: [],
      errorNull: false,
      ruleForm: {
        productNamel: '',
        destinations: '',
      },
      rules: {
        productNamel: [{ required: true, message: '产品名称不能为空', trigger: 'blur' },
          { min: 0, max: 30, message: '产品名称字数超过30汉字限制', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9【】，+/（]{1,29}([\u4e00-\u9fa5a-zA-Z0-9【】，+/）]{0,1})$/, message: '请输入正确产品名称，含中括号【】中文逗号，英文+/可用，中文小括号（）仅能用在句尾', trigger: 'blur' },
        ],
        destinations: [{ required: true, message: '目的地不能为空', trigger: 'blur' }],
      },
    }
  },
  watch: { //watch()监听某个值（双向绑定）的变化，从而达到change事件监听的效果
  },
  mounted() {

  },
  created() {

  },
  methods: {
    // 取消
    cancel() {
      this.$router.push({ path: "/productList/scenicOrTicketList" });
    },
    showInput() {
      this.errorNull = false
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //目的地
    querySearch(queryString2, cb) {
      this.tableData2 = []
      this.$http.post(this.GLOBAL.serverSrc + '/universal/area/api/fuzzy', {
        "object": {
          areaName: queryString2
        }
      }, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(res => {
        for (let i = 0; i < res.data.objects.length; i++) {
          this.tableData2.push({
            "value": res.data.objects[i].areaName,
            "id": res.data.objects[i].id
          })
        }
        var results = queryString2 ? this.tableData2.filter(this.createFilter(queryString2)) : [];
        cb(results)
      }).catch(err => {
        console.log(err);
      })
    },
    handleInputConfirm() {
      this.$refs['destinations'].validate()
      if (this.ruleForm.destinations !== '') {
        setTimeout(res => {
          this.inputVisible = false;
          this.ruleForm.destinations = '';
          this.errorNull = false;
        }, 200)
      } else {
        if (this.dynamicTags.length == 0) {
          document.getElementById('input-error').style.border = "solid 1px red";
          this.errorNull = true;
        } else {
          this.inputVisible = false;
        }
      }
    },
    dest(item) {
      this.dynamicTags.push({ "destinationID": item.id, "destination": item.value });
      this.ruleForm.destinations = "";
      this.inputVisible = false;
    },
    createFilter(queryString5) {
      return (restaurant) => {
        return (restaurant.value);
      }
    },
    // 目的地
    handleClose(tag4) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag4), 1);
    },
    //保存
    addsave(formName) {
      let object = [];
      this.dynamicTags.forEach(function(v, k, arr) {
        object.push({
          "destination_id": arr[k]['destinationID'],
          "destination_name": arr[k]['destination']
        });
      });
      this.$refs[formName].validate((valid) => {

        if (this.dynamicTags.length <= 0) {
          this.errorNull = true;
          return false;
        }

        if (valid) {
          var that = this;
          this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/product/product/add", {
            "product_name": this.ruleForm.productNamel, //基本信息产品名称,
            "create_uid": sessionStorage.getItem('id'),
            "destinations": object,
            "org_id": sessionStorage.getItem('orgID')
          }, ).then(function(response) {
            if (response.data.code == '200') {
              that.$message.success("添加成功");
              that.$router.push({ path: "productList/scenicOrTicketList" });
            } else {
              that.$message.warning(response.data.message);
            }
          }).catch(function(error) {
            console.log(error);
          });

        } else {
          console.log('验证不通过')
        }
      })
    },
  }
}

</script>
<style>
#productDo .address {
  display: none;
}

#productDo #zero {
  color: red;
}

#productDo .productName {
  width: 30%;
}

#productDo .btn-button {
  float: right;
  margin-left: 10px;
}

#productDo .destination-input .el-tag{
  margin-right: 15px;
}

</style>
