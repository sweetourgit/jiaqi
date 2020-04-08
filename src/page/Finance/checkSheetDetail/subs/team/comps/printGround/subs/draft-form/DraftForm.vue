<!-- 2020-3-31 -->
<template>
  <el-dialog :loading="loading" :title="title" width="50%" :visible="state" :close-on-click-modal="false" :before-close="handleClose"
    :append-to-body="true">
    <el-table style="width: 100%" border :data="draftList" :highlight-current-row="false" :header-cell-style="getRowClass">
      <el-table-column align="center" prop="data.supplier" label="供应商名称"></el-table-column>

      <el-table-column align="center" label="借款类型">地接款</el-table-column>

      <el-table-column align="center" prop="data.arrearsPrice" label="借款金额"></el-table-column>

      <el-table-column align="center" prop="data.peopleCount" label="人数"></el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="wakeupEditForm(scope.row)">
            选取
          </el-button>
          <el-button size="small" type="danger" @click="deleteDraft(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
  import {
    getDraftList,
    deleteDraft
  } from '../../../../api.js'
  export default {
    props: {
      title: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        draftList: [], //草稿列表
        state: false, //控制是否显示草稿组件
        loading: false
      }
    },

    methods: {
      //获取草稿列表
      getDraftList() {
        let that = this
        getDraftList().then(res => {
          if (res.data.isSuccess == true) {
            let draftList = res.data.objects
            for (let i = 0; i < draftList.length; i++) {
              draftList[i].data = JSON.parse(draftList[i].data)
            }
            this.draftList = draftList
            // that.draftList = JSON.parse(res.data.objects.data)
            // console.log('draftList',that.draftList)
            this.state = true
          } else {
            throw '获取草稿列表失败'
          }
        }).catch(rej => {
          console.log('rej', rej)
          // this.$message.err(rej)
        })
      },
      //储存草稿
      saveDraft() {
        //在expenseEditForm.vue  saveAction() 被调用
      },
      //删除一条草稿
      deleteDraft(row) {
        this.loading = true
        deleteDraft(row.guid).then(res => {
          if (res.isSuccess == true) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getDraftList()
          } else {
            this.$message.error('删除出错');
          }
          this.loading = false
        }).catch(rej => {
          this.loading = false
        })
      },
      //弹出新增框 并赋予数据 对应组件为expenseEditForm.vue
      wakeupEditForm(row) {
        // console.log('row',row.data)
        this.handleClose()
        this.$emit('wakeupEditForm', row.data, 'draft')
      },
      //更新是否显示草稿组件 显示组件时 加载数据
      handleOpen() {
        this.getDraftList()
      },
      //关闭当前草稿组件
      handleClose() {
        this.state = false
      },
      //控制table头背景色
      getRowClass({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
        if (rowIndex == 0) {
          return 'background:#F7F7F7;color:rgb(85, 85, 85);'
        } else {
          return ''
        }
      },
    },

  }
</script>

<style>
</style>
