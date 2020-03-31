<template>
  <div>
    <!--备注信息弹窗-->
    <el-dialog
      title="备注"
      :visible.sync="propsObj.dialogType === 0"
      :close-on-click-modal="false"
      class
      width="780px"
      @open="orderGetFun"
      @close="btRemarkDialogClose"
    >
      <el-form
        :model="markFormAdd"
        :rules="rules"
        ref="markFormAdd"
        label-width="80px"
        class="demo-ruleForm"
      >
        <div v-for="(item,index) in markForms" :key="index">
          <el-form-item :label="name">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 6}"
              class="remark"
              placeholder="请输入内容"
              v-model="item.mark"
              :disabled="true"
            ></el-input>
            <div class="time">{{getTimeChange(item.created_at)}}</div>
          </el-form-item>
        </div>
        <el-form-item label="填写备注" prop="Mark">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 6}"
            class="remark"
            placeholder="请输入内容"
            v-model="markFormAdd.mark"
          ></el-input>
        </el-form-item>
        <el-form-item align="center">
          <el-button type="primary" size="medium" @click="submitMark">保存</el-button>
          <el-button class="colse" @click="btRemarkDialogClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate } from "@/js/libs/publicMethod.js";
import moment from "moment"
export default {
  name: "boatRemarksInfor",
  props: {
    propsObj: { type: Object },
    orderId:0,//订单id
    orderCodeSon:'',
  },
  data() {
    return {
      name: localStorage.getItem("name"),
      markFormAdd: {
        orderCode: "",
        mark: "",
        CreateTime: formatDate(new Date())
      },
      markForms: [],
      orderget: {},
      rules: {
        mark: [{ required: true, message: "请填写备注信息", trigger: "blur" }]
      }
    };
  },

  watch: { },
  created() {},
  methods: {
    // 关闭弹窗事件
    btRemarkDialogClose() {
      this.$emit(
        "update:this.propsObj.dialogType",
        (this.propsObj.dialogType = -1)
      );
      this.markFormAdd.mark = ""
    },
    orderGetFun() { // 获取备注信息
      this.$http
          .post(this.GLOBAL.serverSrcYL + "/linerapi/v1/order/order-comment/listall", {
            order_code:this.orderCodeSon,
            order_id: this.orderId,
            limit: 20
          })
          .then(res => {
            console.log(res)
            if (res.data.code== 200) {
               this.markForms = res.data.data.list
             }
          })

          .catch(err => {
            console.log(err);
          });
    },
    submitMark() {
      this.$refs["markFormAdd"].validate(valid => {
        if (valid) {
            this.$http
            .post(this.GLOBAL.serverSrcYL + "/linerapi/v1/order/order-comment/addcomment", {
              object: {
                order_code: this.orderCodeSon,
                mark: this.markFormAdd.mark,
                order_id:this.orderId,
                create_uid:'100',
                org_id: 0,
               }
            })
            .then(res => {
              if (res.data.code == 200) {
                this.$message.success("提交成功");
                this.btRemarkDialogClose();
              } else {
                this.$message.error("提交失败");
              }
            });

        }
      });
    },
    getTimeChange (str) { // 接收备注时间格式的转换   
       let time = moment(str).format("YYYY-MM-DD HH:mm:ss");
       return time
    },
  },

};
</script>

<style>
 
</style>