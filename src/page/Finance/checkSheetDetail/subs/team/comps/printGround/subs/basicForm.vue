<template>
  <div>
    <el-dialog
      title="编辑基本信息"
      width="650px"
      ref="dialogRef"
      :visible="state"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-form label-width="120px" ref="submitForm" :model="submitForm" :rules="rules">
        <el-form-item label="导陪：" prop="guideName">
          <el-input
            placeholder="请输入"
            size="small"
            style="width: 450px;"
            v-model="submitForm.guideName"
          ></el-input>
        </el-form-item>

        <el-form-item label="接团社：" prop="localName">
          <el-input
            placeholder="请输入"
            size="small"
            style="width: 450px;"
            v-model="submitForm.localName"
          ></el-input>
        </el-form-item>

        <el-form-item label="其他收入：" prop="title">
          <el-input
            placeholder="款项名称"
            size="small"
            style="width: 450px;"
            v-model="submitForm.title"
          ></el-input>
        </el-form-item>

        <el-form-item label=" " prop="price">
          <el-input placeholder="金额" size="small" style="width: 450px;" v-model="submitForm.price"></el-input>
        </el-form-item>

        <el-form-item label=" " prop="ticket">
          <el-input placeholder="票号" size="small" style="width: 450px;" v-model="submitForm.ticket"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- <el-popconfirm title="这是一段内容确定删除吗？">
          <el-button slot="reference">删除</el-button>
        </el-popconfirm> -->
        <el-button size="small" @click="handleClose(true)">取 消</el-button>
        <el-button type="primary" size="small" @click="saveAction">保 存</el-button>
      </span>
      <!-- <Draft
      ref="draft"
      v-bind:subForm="submitForm"
      v-show="showDraft"
      @change-draft="showDraft=$event"
      :form="$refs.submitForm"
      ></Draft>-->
    </el-dialog>
  </div>
</template>

<script>
import Draft from "./comps/draft.vue";
export default {
  components: { Draft },

  data() {
    return Object.assign(
      {
        state: false,
        showDraft: false,
        submitForm: {
          guideName: null,
          localName: null,
          title: null,
          price: null,
          ticket: null
        }
      },
      {
        rules: {
          price: [
            {
              pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/,
              message: "请输入正确的价格格式",
              trigger: "blur"
            },
            { validator: this.otherIncomeValidator, trigger: "submit" }
          ],
          title: { validator: this.otherIncomeValidator, trigger: "submit" },
          ticket: { validator: this.otherIncomeValidator, trigger: "submit" }
        }
      }
    );
  },

  methods: {
    wakeup(payload) {
      let { guideName, localName, title, price, ticket } = payload;
      Object.assign(this.submitForm, {
        guideName,
        localName,
        title,
        price,
        ticket
      });
      this.state = true;
    },
    handleClose(type) {
      this.state = false;
      this.$refs.submitForm.resetFields();
    },
    saveAction() {
      this.$refs.submitForm.validate(result => {
        if (!result) return;
        this.adaptor();
        this.$emit("save-action", this.submitForm);
        this.handleClose("saved");
      });
    },
    adaptor() {
      if (!this.$isNull(this.submitForm.price))
        this.submitForm.price = parseFloat(this.submitForm.price);
    },
    otherIncomeValidator(rule, value, cb) {
      let { ticket, title, price } = this.submitForm;
      let error = new Error("不能单独填写票号;款项名称与金额不能单独填写");
      // 三者都不填
      if (!ticket && !title && !price) return cb();
      // 只填写了票号
      if (!(title && price) && ticket) return cb(error);
      // 价格title都填写了
      if (price && title) return cb();
      return cb(error);
    },
    changeDraft(status, saved) {
      this.showDraft = status;
      // this.state=false
    }
  }
};
</script>