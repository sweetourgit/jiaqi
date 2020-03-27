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
    :append-to-body="true"
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
      <el-button size="small" @click="open()">取 消</el-button>
      <el-button type="primary" size="small" @click="saveAction()">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getSupplierlist } from "../../../api";
export default {
  data() {
    return Object.assign(
      {
        state: false,
        isSave: false,
        supplierSelected: false,
        groupCode: "",
        expenseCache: "",
        changed: false, //判断表单是否修改(若是修改弹出草稿框)
        submitForm: {
          supplierID: null,
          supplier: null,
          arrearsPrice: null,
          peopleCount: null
        }
      },
      {
        type: "地接款",

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
    open() {
      let that = this;
      //是个坑 勿动
      let submitCopy = this.getSubmitForm;
      // this.isSave?function(){}
      let isChanged = this.isSave
        ? this.isChangedEdit(submitCopy)
        : this.isChanged(submitCopy);
      if (isChanged) this.changed = false;
      for (let item in that.getSubmitForm) {
        //判断当前 item不为supplierID(点击新增按钮 自动有值，妨碍判断未填表单)
        //其他item项不为null
        //changed 改变状态为已改变
        if (
          item != "supplierID" &&
          that.getSubmitForm[item] != null &&
          this.changed
        ) {
          that
            .$confirm("是否需要保存草稿?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
            .then(() => {
              let type = that.isSave ? "edit" : "add";
              //坑 勿动
              that.submitForm = submitCopy;
              //保存后 改变状态为false
              this.changed = false;
              let setName = type == "edit" ? submitCopy.supplierID : "";
              that.$ls.set(
                that.groupCode + type + setName,
                JSON.stringify(submitCopy)
              );
              that.$refs.submitForm.resetFields();
              that.$message({
                type: "success",
                message: "保存成功!"
              });
            })
            .catch(() => {
              that.$message({
                type: "info",
                message: "已取消保存"
              });
            });
          this.handleClose();
          //这里的false 只为跳出循环
          return false;
        }
      }
      this.handleClose();
    },
    wakeup(expense, { groupCode }) {
      let that = this;
      this.groupCode = groupCode;
      this.isSave = !!expense;
      this.supplierSelected = this.isSave;
      this.state = true;
      //isSave 通过操作 编辑进入 返expense不是返
      this.expenseCache = this.isSave
        ? this.getDraftForEdit(expense)
        : this.getDraft();
      if (this.expenseCache == true) {
        console.log("表单不重新渲染");
        this.supplierSelected = true;
      } else {
        console.log("表单重新渲染");
        Object.keys(this.submitForm).forEach(attr => {
          this.submitForm[attr] = that.expenseCache[attr];
        });
      }
    },
    //获取编辑表单的草稿
    getDraftForEdit(expense) {
      //判断当前是否有对应数据
      if (
        JSON.parse(
          this.$ls.get(this.groupCode + "edit" + expense.supplierID)
        ) != null
      ) {
        //重置submitForm 表单
        let submitForm = this.getExpenseDTO();
        //取出数据并赋值给submitForm 这里因为没回关闭或保存表单都会重置表单 故用数据进行赋值对比表单是否有变化
        let copy = JSON.parse(
          this.$ls.get(this.groupCode + "edit" + expense.supplierID)
        );
        Object.keys(submitForm).forEach(attr => {
          if (copy[attr] != undefined) {
            submitForm[attr] = copy[attr];
          }
        });
        submitForm["price"] = submitForm["arrearsPrice"];
        //如果当前数据对比上回表单无修改则不重新渲染
        if (JSON.stringify(submitForm) == JSON.stringify(expense)) {
          this.changed = false;
          return expense;
          //若有修改 则返回数据 重新渲染
        } else if (this.$ls.get(this.groupCode + "edit" + expense.supplierID)) {
          this.changed = true;
          return JSON.parse(
            this.$ls.get(this.groupCode + "edit" + expense.supplierID)
          );
        }
      }
      return expense;
    },
    temporaryVariable() {
      this.expenseCache = null;
    },
    //获取添加表单的草稿
    getDraft() {
      //当前groupCode所对应的数据不为空
      if (this.$ls.get(this.groupCode + "add")) {
        //判断是否改变
        let isChangeed = this.isChanged(this.submitForm);
        //为true 则返回true 代表未改变 则表单不重新渲染
        if (isChangeed) {
          return isChangeed;
        }
        let copy = this.getExpenseDTO();
        this.expenseCache = copy;
        //使expenseCache=groupCode所对应的数据
        Object.keys(this.expenseCache).forEach(item => {
          if (JSON.parse(this.$ls.get(this.groupCode + "add"))[item])
            this.expenseCache[item] = JSON.parse(
              this.$ls.get(this.groupCode + "add")
            )[item];
        });
        // 修改rule 中的必选验证
        this.supplierSelected = true;
        return this.expenseCache;
      }
      return this.getExpenseDTO();
    },

    saveAction() {
      let that = this;
      this.$refs.submitForm.validate(result => {
        if (!result) return;
        //若为true 代表当前表单对比上次没有修改 重置expenseCache属性值
        if (that.expenseCache == true) that.expenseCache = that.getExpenseDTO();
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
        //保存成功后 改变状态为false 这里的changed 与 isChanged() 所对应的不是一个
        //当时changed是准备当做isChanged() 用 后期应该是忘了changed属性 又写个函数
        this.changed = false;
        //保存后清除数据
        let type = this.isSave ? "edit" : "add";
        let setName=type=='edit'? this.submitForm.supplierID:''
        let remove = this.$ls.remove(
          this.groupCode + type +setName
        );
        this.$refs.submitForm.resetFields();

        
      });
    },
    handleClose(status) {
      this.temporaryVariable();
      this.state = false;
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
    //判断当前表单对比上次填写 是否有改变
    isChanged(data) {
      return this.$ls.get(this.groupCode + "add") == JSON.stringify(data);
    },
    //判断当前表单对比上次填写 是否有改变
    isChangedEdit(data) {
      return (
        this.$ls.get(this.groupCode + "edit" + data.supplierID) ==
        JSON.stringify(data)
      );
    }
  },
  //watch 有坑  computed能用
  computed: {
    getSubmitForm: function() {
      this.changed = true;
      return JSON.parse(JSON.stringify(this.submitForm));
    }
  }
};
</script>