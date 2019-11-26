<style lang="scss" scoped>

</style>

<template>
  <el-form
    :model="submitForm"
    ref="submitForm"
    label-width="100px"
    style="width: 100%;"
    size="mini">
    <el-row :gutter="40">

      <el-col :span="5">
        <el-form-item label="团期计划：" prop="tour_no">
          <el-input size="small" v-model="submitForm.tour_no" placeholder="团期计划"></el-input>
        </el-form-item>
      </el-col> 

      <el-col :span="5">
        <el-form-item label="报账人：" prop="tour_no">
          <el-autocomplete  placeholder="请输入操作人员"
            v-model="submitForm.tour_no"
            :fetch-suggestions="querySearchOper"
            :trigger-on-focus="false"
            @select="handleSelectOper">
          </el-autocomplete>
        </el-form-item>
      </el-col>

      <el-col :span="5">
        <el-form-item label="产品名称：" prop="product_name">
          <el-input size="small" v-model="submitForm.product_name" placeholder="产品名称"></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="9"> 
        <div style="display: flex;">
          <el-form-item label="发起时间：" prop="start_time" :span="11">
            <el-date-picker
              v-model="submitForm.start_time"
              type="datetime"
              placeholder="起始时间">
            </el-date-picker>
          </el-form-item>
          <el-col :span="2" style="height: 32px;width: 18px;text-align:center;line-height: 32px;">
            <div>-</div>
          </el-col>
          <el-form-item label-width="0" prop="end_time" :span="11">
            <el-date-picker
              v-model="submitForm.end_time"
              type="datetime"
              placeholder="截止时间">
            </el-date-picker>
          </el-form-item>
        </div>
      </el-col>  

    </el-row>
    <el-row :gutter="40">
      <el-col :span="5">
        <el-form-item label="由我审批：" prop="tour_no">
          <el-switch active-text="是" inactive-text="否" 
            v-model="value1">
          </el-switch>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label=" " prop="tour_no">
          <el-button size="small" type="primary">搜索</el-button>
          <el-button size="small" type="info">重置</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { getOperList } from '../api'

export default {

  mounted(){
    this.init();
  },

  data(){
    return Object.assign(
      // 数据
      {
        submitForm: {

        }
      },
    )
  },

  methods: {
    init(){
      this.initOperOptions();
    },

    initOperOptions(){
      getOperList()
      .then(res => {
        console.log(res)
      })
    },

    querySearchOper(queryString, cb){
      this.$http.post(
        this.GLOBAL.serverSrc + "/Flight/flighs/api/getnum",
        {
          number: queryString,
        }
      ).then(res => {
        console.log(res)
        let { isSuccess, object }= res.data;
        if(!object) return cb();
        // 字段对应不上，转接一下
        this.flightOptions= [object];
        cb([{ value: object.number+ '' }]);
      }).catch(err => {
        let errMsg;
        if(err && err.status=== 400) errMsg= '自动填充请输入数字id，不得包含其他类型字符';
        if(err && err.status=== 500) errMsg= '500';
        cb();
        return errMsg? 
          this.$message.error(errMsg): this.$message.info(err);
      })
    },
  }
}
</script>