<template>
  <div class="vivo" style="position:relative">
    <div class="table_trip" style="width: 90%;">
      <el-table ref="singleTable" :data="tableData" border style="width: 100%" :highlight-current-row="currentRow" @row-click="clickBanle" :header-cell-style="getRowClass">
        <el-table-column prop="tour_no" label="报账团号" align="center">
        </el-table-column>
        <el-table-column prop="bill_status" label="审批状态" align="center">
          <template slot-scope="scope">
            <span>{{status[scope.row.bill_status]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="product_name" label="产品名称" align="center">
        </el-table-column>
        <el-table-column prop="time" label="出发日期/返回日期" align="center" width="210">
          <template slot-scope="scope">
            <span>出发日期：{{scope.row.begin_at}}</span><br>
            <span>返回日期：{{scope.row.end_at}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="info.total_income" label="收入" align="center">
        </el-table-column>
        <el-table-column prop="info.total_cost" label="成本" align="center">
        </el-table-column>
        <el-table-column prop="info.gross_rate" label="毛利率" align="center">
        </el-table-column>
        <el-table-column prop="create_uid" label="申请人" align="center">
        </el-table-column>
        <el-table-column prop="created_at" label="申请时间" align="center" width="150">
        </el-table-column>
        <el-table-column prop="option" label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="approvalList(scope.row)" type="primary" size="small" class="table_details">审批</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div class="block" style="margin-top: 30px;margin-left:-30%;text-align:center;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage4" :page-sizes="[5, 10, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total='total'>
      </el-pagination>
    </div>
  </div>
</template>
<script type="text/javascript">
import {formatDate} from '@/js/libs/publicMethod.js'

export default {
  name: "approval",
  components: {},
  props: {
    reable: {
      type: Boolean
    },
    transmit: {
      type: Boolean
    },
    activeForm: {
      type: Object
    }
  },
  data() {
    return {
      total: 0, //总条数
      currentPage4: 1,
      pageIndex: 1, // 设定当前页数
      pageSize: 10, // 设定默认分页每页显示数 todo 具体看需求
      tableData: [],
      form: {},
      currentRow: true,
      status: {
        1: '未认款',
        2: '认款申请',
        3: '认款待修改',
        4: '认款通过',
        5: '报账中',
        6: '报账驳回',
        7: '已报账',
      }
    }
  },
  watch: {
    activeForm: {
      handler(newValue, oldValue) {
        this.form = newValue;
      },
      deep: true
    },
    transmit: function(val) {
      this.currentRow = false
    },
  },
  computed: {
    // 计算属性的 getter
  },
  methods: {
    approvalList(row) {
      this.$router.push({
        path: "/pledgingManagementApproval",
        name: "财务管理   / 财务认款管理   / 审批",
        query: {
          tour_no: row.tour_no
        }
      });
    },
    //获取id
    clickBanle(row, event, column) {
      this.currentRow = true;
//      this.$emit('selection', false, row['oid']);
    },
    // 表格头部背景颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.loadDataApproval();
    },

    handleCurrentChange(val) {
      this.pageIndex = val;
      this.loadDataApproval();
    },
    loadDataApproval(){
      const that = this;
//      console.log(this.$parent.$parent.$parent);
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/recognition/recognition/recognitionpage", {
        "pageIndex": this.pageIndex,
        "pageSize": this.pageSize,
        "tour_no": this.$parent.$parent.$parent.activeForm.tour,
        "create_uid": this.$parent.$parent.$parent.activeForm.userID,
        "bill_status": "2",
        "limit": "0"
      }, ).then(function(response) {
        if (response.data.code == '200') {
          console.log(response);
          that.tableData = response.data.data.list;
          that.total = response.data.data.total - 0;
          that.tableData.forEach(function (item, index, arr) {
            item.begin_at = formatDate(new Date(item.begin_at*1000));
            item.begin_at = item.begin_at.split(" ")[0];
            item.end_at = formatDate(new Date(item.end_at*1000));
            item.end_at = item.end_at.split(" ")[0];
            item.created_at = formatDate(new Date(item.created_at*1000));
            item.created_at = item.created_at.split(" ")[0];

            that.$http.post(that.GLOBAL.serverSrc + "/org/api/userget", {
              "id": item.create_uid
            },{
              headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
              }
            }).then(function(response) {

              if (response.data.isSuccess) {
                item.create_uid = response.data.object.name
              } else {
                that.$message.success("加载数据失败~");
              }
            }).catch(function(error) {
              console.log(error);
            });
          });
          that.$emit('getNumber', that.total);
        } else {
          that.$message.success("加载数据失败~");
        }
      }).catch(function(error) {
        console.log(error);
      });
    }
  },
  created() {
    this.loadDataApproval();
  }
}

</script>
<style lang="scss" scoped>
.vivo {
  margin-bottom: 50px;
}

</style>
