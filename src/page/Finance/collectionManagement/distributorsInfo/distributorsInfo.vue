<template>
  <div class="distributor-content">
    <!-- 搜索表单 -->
    <el-form :model="ruleForm" ref="ruleForm"  label-width="80px" id="form-content">
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <el-form-item label="分销商:" prop="distributor">
            <el-input v-model="ruleForm.distributor" placeholder="请输入分销商"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请人:" prop="createUser">
            <el-input v-model="ruleForm.createUser" placeholder="请输入申请人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态:" class="status-length" prop="checkType">
            <el-select v-model="ruleForm.checkType" placeholder="请选择状态">
              <el-option label="驳回" value="2"></el-option>
              <el-option label="通过" value="1"></el-option>
              <el-option label="审批中" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="8">
          <el-form-item label="款项说明:" prop="moneyExplain">
            <el-input v-model="ruleForm.moneyExplain" placeholder="请输入款项说明"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请日期:" prop="dateStart">
            <el-col :span="11">
              <el-form-item prop="dateStart">
                <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.dateStart" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="dateEnd">
                <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.dateEnd" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button @click="searchHandInside()"  type="primary" icon="el-icon-search">搜索</el-button>
            <el-button @click="emptyButtonInside('ruleForm')" type="primary" icon="el-icon-s-open" plain>重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 搜索表单 END -->
    <!-- 表格 -->
    <el-table :data="internalTableData" border :highlight-current-row="true" @row-click="clickBanle" :header-cell-style="getRowClass" :stripe="true" id="table-content">
      <el-table-column prop="id" label="收款单号" align="center"></el-table-column>
      <el-table-column prop="checkType" label="状态" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.checkType=='0'" style="color: #7F7F7F" >审批中</div>
          <div v-else="scope.row.checkType=='1'" style="color: #FF4A3D" >通过</div>
          <div v-else-if="scope.row.checkType=='2'" style="color: #33D174" >驳回</div>
        </template>
      </el-table-column>
      <el-table-column prop="distributor" label="分销商" align="center">
      </el-table-column>
      <el-table-column prop="moneyExplain" label="款项说明" align="center">
      </el-table-column>
      <el-table-column prop="price" label="金额" align="center">
      </el-table-column>
      <el-table-column prop="collectionTime" label="收款时间" align="center" :formatter='handleCollectionTime'>
      </el-table-column>
      <el-table-column prop="createTime" label="申请时间" align="center" :formatter='handleCreateTime'>
      </el-table-column>
      <el-table-column prop="createUser" label="申请人" align="center">
      </el-table-column>
      <el-table-column prop="payarr.length" label="关联订单数" align="center">
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button @click="dialogFind(scope.row.id, scope)" type="text" size="small" class="table_details">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格 END -->
  </div>
</template>

<script type="text/javascript">
import moment from 'moment'

export default {
  data() {
    return {
      internalTableData: null, // 表格数据
      ruleForm: {
        createUser: '', // 申请人
        distributor: '', // 经销商
        moneyExplain: '', // 价钱
        checkType: '', // 状态
        dateStart: '', // 开始时间
        dateEnd: '', // 结束时间
      }
    }
  },
  created () {
    this.getDataInside()
  },
  methods: {
    // 时间插件
    moment,
    // 申请时间转换
    handleCreateTime (row,cellValue) {
      let changeCreateTime = moment(row.createTime).format('YYYY-MM-DD HH:mm:ss')
      return changeCreateTime
    },
    // 收款时间转换
    handleCollectionTime (row,cellValue) {
      let changeCollectionTime = moment(row.collectionTime).format('YYYY-MM-DD HH:mm:ss')
      return changeCollectionTime
    },
    // 详情
    dialogFind (id, scope) {
      const keepRowInfo = scope.row
      this.$router.push({path: '/gatheringDel', query: {rowId: id, rowInfo: keepRowInfo}})
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
    // 获取id （点击表格行）
    clickBanle (row) {
      // this.pid = row['id'];
    },
    // 重置
    emptyButtonInside (formName) {
       this.$refs['ruleForm'].resetFields()
    },
    // 搜索
    searchHandInside () {
      let _this = this
      this.$http.post(
        this.GLOBAL.serverSrc + "/finance/collection/api/page", {
          "pageIndex": 1,
          "pageSize": 10,
          "object": {
            "startTime": _this.ruleForm.dateStart ? moment(_this.ruleForm.dateStart, 'YYYY-MM-DD HH:mm:ss') : "2000-01-01",
            "endTime":  _this.ruleForm.dateEnd ? moment(_this.ruleForm.dateEnd, 'YYYY-MM-DD HH:mm:ss') : "2019-09-26",
            'distributor': _this.ruleForm.distributor ? _this.ruleForm.distributor : "",
            'moneyExplain': _this.ruleForm.moneyExplain ? _this.ruleForm.moneyExplain : "",
            'createUser': _this.ruleForm.createUser ? _this.ruleForm.createUser : "",
            'checkType': _this.ruleForm.checkType ? _this.ruleForm.checkType : -1,
            "collectionType": 5,
          }
        }, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }
      )
      .then(function(obj) {
        _this.internalTableData = obj.data.objects;
      })
      .catch(function(obj) {})
    },
    // 表格数据
    getDataInside () {
      let _this = this
      this.$http.post(this.GLOBAL.serverSrc + "/finance/collection/api/page", {
        "pageIndex": 1,
        "pageSize": 10,
        "object": {
          "startTime": "2000-01-01",
          "endTime": "2019-09-26",
          "collectionType": 5,
          "checkType": 4
        }
      }, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      })
      .then(function (obj) {
        _this.internalTableData = obj.data.objects
      })
    }
  }
}

</script>
<style lang="scss" scoped>
  .distributor-content{
    width: 99%;
    margin: 25px auto;
    height: auto;
    border: 1px solid #e6e6e6;
    #form-content{
      background: #f7f7f7;
      padding: 20px 10px;
      margin: 20px 10px;
      .el-select{
        width: 100% !important;
      }
      .line{
        text-align: center;
      }
    }
    #table-content{
      width: 98%;
      margin: 40px auto 20px;
    }
  }

</style>
