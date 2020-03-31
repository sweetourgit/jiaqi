<template>
  <div>
    <!--备注信息弹窗-->
    <el-dialog
      title="备注"
      :visible.sync="propsObj.dialogType === 0"
      :close-on-click-modal="false"
      class
      width="780px"
      @open="orderGetFun(this.orderId,this.orderCodeSon)"
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
              v-model="item.content"
              :disabled="true"
            ></el-input>
            <div class="time">{{getTimeChange(item.createTime)}}</div>
          </el-form-item>
        </div>
        <el-form-item label="填写备注" prop="Mark">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 6}"
            class="remark"
            placeholder="请输入内容"
            v-model="markFormAdd.Mark"
          ></el-input>
        </el-form-item>
        <el-form-item align="right">
          <el-button type="info" size="medium" class="submitMark" @click="submitMark">提交备注</el-button>
        </el-form-item>
        <el-form-item align="center">
          <el-button class="colse" @click="btRemarkDialogClose">关闭</el-button>
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
      // name: localStorage.getItem("name"),
      markFormAdd: {
        orderCode: "",
        Mark: "",
        CreateTime: formatDate(new Date())
      },
      markForms: [],
      orderget: {},
      rules: {
        Mark: [{ required: true, message: "请填写备注信息", trigger: "blur" }]
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
      this.markFormAdd.Mark = ""
    }
  },
  orderGetFun(orderId,orderCode) {
    this.$http
        .post(this.GLOBAL.serverSrcYL + "/linerapi/v1/order/order-comment/listall", {
          order_code: orderCode,
          order_id: orderId,
          limit: 20
        })
        .then(res => {
          console.log(res)
          if (res.data.isSuccess == true) {
            // this.orderget = res.data.objects;
            this.markForms = res.data.objects
            //   ? JSON.parse(res.data.object.remark)
            //   : [];
            //  console.log("orderGet的this.markForms",this.markForms)
          }
        })

        .catch(err => {
          console.log(err);
        });
    },
   submitMark() {
      // this.$refs["markFormAdd"].validate(valid => {
      //   if (valid) {
      //       let createTime = moment().utcOffset(480).format('YYYY-MM-DD HH:mm:ss').toString()
      //       this.$http
      //       .post(this.GLOBAL.serverSrc + "/orderquery/get/api/InserOrderComment", {
      //         object: {
      //           orderCode: this.orderCodeSon,
      //           content: this.markFormAdd.Mark,
      //           createTime: createTime
      //         }
      //       })
      //       .then(res => {
      //         if (res.data.isSuccess == true) {
      //           this.$message.success("提交成功");
      //           this.dialogFormMark = false;
      //           this.$refs["markFormAdd"].resetFields();
      //         } else {
      //           this.$message.error("提交失败");
      //         }
      //       });

      //   }
      // });
    },
};
</script>

<style>
.submitMark {
  float: right;
  margin-right: 60px;
}
</style>