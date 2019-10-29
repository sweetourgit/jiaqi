<template>
  <div>
    <!--备注信息弹窗-->
    <el-dialog
      title="订单备注"
      :visible.sync="dialogFormMark"
      :close-on-click-modal="false"
      class="city_list"
      width="780px"
      @close="close"
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
        <el-form-item>
          <el-button type="info" size="medium" class="submitMark" @click="submitMark">提交备注</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="colse" @click="close">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate } from "@/js/libs/publicMethod.js";
import moment from "moment"
export default {
  props: {
    orderId: 0,
    variable: 0,
    dialogType: 0,
    orderCode:""
  },
  data() {
    return {
      name: localStorage.getItem("name"),
      //备注信息弹窗
      dialogFormMark: false,
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
  created() {
  },
  watch: {
    variable: function() {
      if (this.dialogType == 2) {
        this.orderGetFun(this.orderId,this.orderCode);
        this.dialogFormMark = true;
      }
    }
  },
  methods: {
    moment,
    close() {
      this.dialogFormMark = false;
      this.$refs["markFormAdd"].resetFields();
    },
    orderGetFun(orderId,orderCode) {

      //查询一条订单信息 /orderquery/get/api/SIOrders
      // this.$http
      //   .post(this.GLOBAL.serverSrc + "/order/all/api/orderget", {
      //     id: orderId
      //   })
      //   .then(res => {
      //     // console.log("orderGet")
      //     console.log("备注guests",res)
      //     if (res.data.isSuccess == true) {
      //       this.orderget = res.data.object;
      //       this.markForms = res.data.object.remark
      //         ? JSON.parse(res.data.object.remark)
      //         : [];
      //       //  console.log("orderGet的this.markForms",this.markForms)
      //     }
      //   })

      this.$http
        .post(this.GLOBAL.serverSrc + "/orderquery/get/api/GetOrderCommentList", {
          orderCode: orderCode
        })
        .then(res => {
          // console.log(res)
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
      this.$refs["markFormAdd"].validate(valid => {
        if (valid) {
          // let obj = JSON.parse(JSON.stringify(this.markForms));
          // console.log("this.markForms", this.markForms);
          // obj.push(this.markFormAdd);
          // console.log("obj", obj);
          // this.orderget.remark = JSON.stringify(obj);
          // delete this.orderget.code
          // console.log("this.orderget", this.orderget);

          // this.$http
          //   .post(this.GLOBAL.serverSrc + "/order/all/api/ordersave", {
          //     object: this.orderget
          //   })
          //   .then(res => {
          //     console.log("提交", res);
          //     if (res.data.isSuccess == true) {
          //       this.$message.success("提交成功");
          //       this.dialogFormMark = false;
          //       this.$refs["markFormAdd"].resetFields();
          //     } else {
          //       this.$message.error("提交失败");
          //     }
          //   });
            let createTime = moment().format('YYYY-MM-DD hh:mm:ss').toString()
            this.$http
            .post(this.GLOBAL.serverSrc + "/orderquery/get/api/InserOrderComment", {
              object: {
                orderCode: this.orderCode,
                content: this.markFormAdd.Mark,
                createTime: createTime
              }
            })
            .then(res => {
              if (res.data.isSuccess == true) {
                this.$message.success("提交成功");
                this.dialogFormMark = false;
                this.$refs["markFormAdd"].resetFields();
              } else {
                this.$message.error("提交失败");
              }
            });

        }
      });
    },
    // 接收备注时间格式的转换   
    getTimeChange (str) {
      let time = str.replace('T',' ')
      return time
    }
  }
};
</script>

<style scoped>
.demo-ruleForm {
  margin-top: 20px;
}
.remark {
  width: 600px;
}
.time {
  margin-right: 60px;
  text-align: right;
  color: #999;
}
.submitMark {
  float: right;
  margin-right: 60px;
}
.colse {
  margin-left: 230px;
  width: 100px;
}
</style>