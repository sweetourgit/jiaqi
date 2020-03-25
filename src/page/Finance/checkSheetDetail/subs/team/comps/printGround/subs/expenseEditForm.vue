/*
 * @Author: WZJ 
 * @Last Modified by:   WZJ 
 */


<template>
  <el-dialog
    :title="isSave? '编辑报账信息':'新增报账信息' "
    width="650px"
    ref="dialogRef"
    :visible="state"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <el-form label-width="120px" ref="submitForm" :model="submitForm" :rules="rules">
      <el-form-item label="供应商：" prop="supplier" ref="supplierRef">
        <el-autocomplete
          class="inline-input"
          size="small"
          style="width: 450px;"
          placeholder="输入供应商名称"
          v-model="submitForm.supplier"
          :fetch-suggestions="getSupplierAction"
          :trigger-on-focus="false"
          @select="selectSupplier"
        ></el-autocomplete>
      </el-form-item>

      <el-form-item label="借款类型：">
        <el-input placeholder="请输入" size="small" style="width: 450px;" disabled v-model="type"></el-input>
      </el-form-item>

      <el-form-item label="借款金额：" prop="arrearsPrice">
        <el-input
          placeholder="请输入"
          size="small"
          style="width: 450px;"
          v-model="submitForm.arrearsPrice"
        ></el-input>
      </el-form-item>

      <el-form-item label="人数：" prop="peopleCount">
        <el-input
          placeholder="请输入"
          size="small"
          style="width: 450px;"
          v-model="submitForm.peopleCount"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="changeDraft(true)">取 消</el-button>
      <el-button type="primary" size="small" @click="saveAction()">保 存</el-button>
    </span>
    <Draft
      ref="draft"
      v-bind:subForm="submitForm"
      :groupCode="groupCode"
      v-show="showDraft"
      @change-draft="handleClose"
      :form="this.expenseCache"
    ></Draft>
  </el-dialog>
</template>

<script>
import { getSupplierlist } from "../../../api";
import Draft from "./comps/draft.vue";
export default {
  components: {
    Draft
  },
  data() {
    return Object.assign(
      {
        state: false,
        isSave: false,
        supplierSelected: false,
        showDraft: false,
        groupCode: "",
        expenseCache: ""
      },
      {
        type: "地接款",
        submitForm: {
          supplierID: null,
          supplier: null,
          arrearsPrice: null,
          peopleCount: null
        },
        rules: {
          supplier: {
            required: true,
            validator: this.supplierValidator,
            message: "不存在或未选择供应商",
            trigger: "change"
          },
          arrearsPrice: {
            required: true,
            pattern: /(^-?[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/,
            message: "请输入正确的价格格式",
            trigger: "blur"
          },
          peopleCount: {
            required: true,
            pattern: /^(0|[1-9][0-9]*)$/,
            message: "请输入正确的人数",
            trigger: "blur"
          }
        }
      }
    );
  },

  methods: {
    wakeup(expense, { groupCode }) {
      this.groupCode = groupCode;
      this.isSave = !!expense;
      this.supplierSelected = this.isSave;
      this.state = true;
      //判断当前是否通过编辑进入(isSave=true通过编辑进入;isSave=false通过新增进入)
      this.expenseCache = this.isSave ? expense : this.getDraft();

      Object.keys(this.submitForm).forEach(
        attr => (this.submitForm[attr] = this.expenseCache[attr])
      );
    },

    temporaryVariable() {
      this.expenseCache = null;
    },
    //打开表单时调用，判断是否有草稿
    getDraft() {
      //缓存表单唯一标识为 groupCode (应使用guid;未提交表单暂时得不到guid,暂时用groupCode代替)
      if (this.$ls.get(this.groupCode)) {
        let copy = this.getExpenseDTO();
        this.expenseCache = copy;
        Object.keys(this.expenseCache).forEach(item => {
          if (JSON.parse(this.$ls.get(this.groupCode))[item])
            this.expenseCache[item] = JSON.parse(this.$ls.get(this.groupCode))[
              item
            ];
        });
        this.supplierSelected = true;
        return this.expenseCache;
      }
      //若没有草稿则 重置表单
      return this.getExpenseDTO();
    },

    saveAction() {
      let that = this;
      this.$refs.submitForm.validate(result => {
        if (!result) return;
        Object.keys(this.submitForm).forEach(attr => {
          this.expenseCache[attr] = this.submitForm[attr];
        });
        this.expenseCache.arrearsPrice = parseFloat(
          this.expenseCache.arrearsPrice
        );
        this.expenseCache.price = this.expenseCache.arrearsPrice;

        this.$emit("save-action", {
          expense: this.expenseCache,
          isSave: this.isSave
        });
        this.handleClose();
        //表单提交后 清楚本地草稿缓存
        let remove = this.$ls.remove(this.groupCode);
        let data = this.$ls.get(this.groupCode);
      });
    },

    handleClose() {
      this.$refs.submitForm.resetFields();
      this.temporaryVariable();
      this.state = false;
      this.showDraft = status;
    },

    getExpenseDTO() {
      return {
        title: "地接款",
        supplierType: 1,
        supplierID: null,
        supplier: null,
        peopleCount: null,
        price: null,
        payPrice: 0,
        arrearsPrice: null,
        mark: null,
        expenseType: 1
      };
    },

    getSupplierAction(name, cb) {
      this.supplierSelected = false;
      let payload = {
        name,
        UserState: -1,
        SupplierType: -1
      };
      getSupplierlist(payload)
        .then(suppliers => {
          cb(
            suppliers
              .filter(supplier => supplier.userState === 1)
              .map(supplier => {
                return {
                  id: supplier.id,
                  value: supplier.name
                };
              })
          );
        })
        .catch(err => {
          console.log(err);
          cb([]);
        });
    },

    selectSupplier(dto) {
      let { id } = dto;
      this.submitForm.supplierID = id;
      this.supplierSelected = true;
    },

    supplierValidator(rule, value, cb) {
      if (this.supplierSelected && this.submitForm.supplier) return cb();
      cb(new Error(rule.message));
    },
    //修改草稿组件显示状态  status无参默认为false基本上没传过参数
    changeDraft(status) {
      let that = this;
      //循环表单 其中若是有已填想 则弹出是否保存草稿
      for (let item in this.submitForm) {
        if (this.submitForm[item] != null) {
          that.showDraft = status;
          return false;
        }
      }
      //若是未填表单则直接关闭表单
      this.handleClose();
    }
  }
};
</script>