<template>
  <div>
     <div class="main">
     <el-table :data="groupList" ref="multipleTable" class="table" :header-cell-style="getRowClass" border @selection-change="changeFun">
       <el-table-column  prop="serno" label="序号" min-width="60"></el-table-column>
       <el-table-column  prop="id" label="ID" min-width="60"></el-table-column>
       <el-table-column  prop="state" label="状态" min-width="90"></el-table-column>
       <el-table-column  prop="date" label="日期" min-width="110"></el-table-column>
       <el-table-column  prop="groupSer" label="团期计划" min-width="240"></el-table-column>
       <el-table-column  prop="price" label="成人价" min-width="75"></el-table-column>
       <el-table-column  prop="plan" label="计划位" min-width="75"></el-table-column>
       <el-table-column  prop="surplus" label="余位" min-width="75"></el-table-column>
       <el-table-column  prop="conPt" label="确认占位" min-width="85"></el-table-column>
       <el-table-column  prop="resPt" label="预定占位" min-width="85"></el-table-column>
       <el-table-column  prop="resNpt" label="预定不占" min-width="85"></el-table-column>
       <el-table-column  prop="operation" label="操作" min-width="80"></el-table-column>
       <el-table-column  prop="name" label="产品名称" fixed="right" min-width="250"></el-table-column>
       <el-table-column  prop="name" label="编辑" fixed="right" min-width="100">
          <el-button slot-scope="scope" type="primary" size="small" @click="clickRow(scope.row)">查看</el-button>
       </el-table-column>
     </el-table>
     <el-pagination class="pagination"
        @size-change="handleSizeChange"
        background
        @current-change="handleCurrentChange"
        :current-page="4"
        :page-sizes="[10, 30, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination>
     </div>
     </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
       groupList: [{
          id:1,
          serno: 1,
          date: '2016-05-03',
          state: '正常',
          groupSer:'TC-GTY-1001-01-180806-01',
          price:'200',
          plan:'20',
          surplus:'20',
          conPt:'20',
          resPt:'20',
          resNpt:'20',
          operation:'阳阳',
          name: '泰国曼谷+芭提雅+沙美岛+清迈小镇7日游'
        },
        {
          id:2,
          serno: 2,
          date: '2016-05-03',
          state: '正常',
          groupSer:'TC-GTY-1001-01-180806-01',
          price:'200',
          plan:'20',
          surplus:'20',
          conPt:'20',
          resPt:'20',
          resNpt:'20',
          operation:'阳阳',
          name: '泰国曼谷+芭提雅+沙美岛+清迈小镇7日游'
        }]
    }
  },
  mounted(){
  this.test()
  },
  methods: {
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px'
        } else {
          return ''
        }
      },
      clickRow(row){    //选中行复选框勾选
        this.$router.push({path: "/searchOrder/orderDetail?id="+row.id});
      },
      changeFun(){
        
      },
      handleSizeChange(){

      },
      handleCurrentChange(){

      },
      test(){
        this.$http.post("http://192.168.1.168:6019/api/BPM/GetInstanceActityInfo",
              {
                "InstanceID": "52860967-14d6-40c2-a388-a8d2e081cbeb",
  "WorkItemID": "6f672fd8-4c48-4f69-bc0f-86bf3cc78924",
  "userCode": "15940441050"
              })
              .then(function(response) {

                })
              }

      }
  }

</script>

<style scoped>
       .demo-input-suffix{width: 900px}
       .table{border:1px solid #e6e6e6;border-bottom: 0;background-color: #F7F7F7;text-align: center;margin:20px 0 0 8px}
       .pagination{text-align:center;margin:70px 0 50px 0;}
</style>