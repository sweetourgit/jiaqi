<template>
<el-dialog :title="isAdd? '新增': '编辑'" width="700px"
  ref="dialogRef" 
  :visible="state"
  :close-on-click-modal="false"
  :before-close="handleClose">
  {{ submitForm }}
  <div style="width: 600px;">
    <el-form
      size="small"
      label-width="120px" 
      ref="submitForm"
      :model="submitForm"
      :rules="rules">
      <el-form-item label="房型：" prop="cabin_id">
        <el-select style="width: 360px;"
          v-model="submitForm.cabin_id"
          @change="selectCabin">
          <el-option 
            v-for="(item, i) in cabinTypeOptions"
            :key="i" 
            :label="item.name" 
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="标题：" prop="title">
        <el-input placeholder="请输入标题" maxlength="60" show-word-limit style="width: 360px;"
          v-model="submitForm.title">
        </el-input>
      </el-form-item>

      <el-form-item label="最少入住：" prop="min_stay">
        <el-select style="width: 360px;"
          v-model="submitForm.min_stay">
          <el-option :key="item" v-for="item in number" :label="item+ '人'" :value="item"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="库存：" prop="stock">
        <el-input placeholder="请输入库存" style="width: 360px;"
          v-model="submitForm.stock">
        </el-input>
        <span style="font-size: 12px; padding-left: 5px;"
          v-show="!isAdd">
          {{ '已售库存：'+ saled }}
        </span>
      </el-form-item>
      
      <el-form-item label="同业价：" prop="adult_same_price">
        <el-input placeholder="请输入金额" style="width: 360px;"
          v-model="submitForm.adult_same_price">
        </el-input>
      </el-form-item>

      <el-form-item label="销售价：" prop="adult_straight_price">
        <el-input placeholder="请输入销售价" style="width: 360px;"
          v-model="submitForm.adult_straight_price">
        </el-input>
      </el-form-item>

      <el-form-item label="上/下线：" prop="line_status">
        <el-radio-group v-model="submitForm.line_status">
          <el-radio :label="1">上线</el-radio>
          <el-radio :label="2">下线</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" style="display: flex; justify-content: flex-end; padding-top: 20px;">
      <el-button size="small" 
        @click="handleClose">
        取 消
      </el-button>
      <el-button size="small" type="primary"
        @click="submitHandler">
        保 存
      </el-button>
    </div>
  </div>
</el-dialog>
</template>

<script>

let cache;
export default {
  props: ['cabinTypeOptions'],

  data(){
    return {
      state: false,
      isAdd: false,
      submitForm: this.getPriceDto(),
      rules: {
        cabin_id: { required: true, message: '请选择房型', trigger: "submit" },
        title: { required: true, message: '标题不能为空', trigger: "submit"},
        min_stay: { required: true, message: '请选择最少入住人数', trigger: "submit"},
        stock: [
          { required: true, pattern: /^(0|[1-9][0-9]*)$/, message: '请输入库存', trigger: ["submit", "blur"]},
          { validator: this.stockValidator, trigger: ["submit", "blur"]}
        ],
        adult_same_price: { required: true, pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/, message: '请输入正确的价格', trigger: ["submit", "blur"]},
        adult_straight_price: { required: true, pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/, message: '请输入正确的价格', trigger: ["submit", "blur"]},
        line_status: { required: true, message: '请选择是否上线', trigger: "submit" }
      },
      saled: 0,
      // 房型容纳人数
      number: 0,
    }
  },

  methods: {
    
    init(price, payload){
      let { title }= payload;
      if(!price){
        this.isAdd= true;
        this.selectCabin(title);
      } else {
        // this.saled=
        cache= price; 
        this.$assign(this.submitForm, price);
      }
      this.state= true;
    },

    handleClose(){
      this.state= false;
      this.isAdd= false;
      this.saled= 0;
      this.number= 0;
    },

    submitHandler(){
      this.$refs.submitForm.validate(bol => {
        if(!bol) return;
        this.$refs.submitForm.clearValidate();
        if(this.isAdd){
          this.$emit('submit', { 
            price: this.adaptor(this.$deepCopy(this.submitForm)), 
            isAdd: this.isAdd 
          });
        } else {
          this.$assign(cache, this.submitForm, true);
          this.adaptor(cache);
          this.$emit('submit', { 
            price: cache, 
            isAdd: this.isAdd 
          });
        }
        this.handleClose();
      })
    },  

    selectCabin(selector){
      if(!selector) return;
      let cabin= this.findCabin(selector);
      let { name, number, id }= cabin;
      if(this.isAdd) this.$assign(this.submitForm, this.getPriceDto({ cabin_id: id, title: name }));
      this.submitForm.min_stay= null;
      this.submitForm.max_stay= number;
      this.number= number;
    },

    findCabin(selector){
      console.log(this.cabinTypeOptions.length);
      let attr= Object.prototype.toString.call(selector)=== '[object Number]'? 'id': 'name'
      return this.cabinTypeOptions.find(el => {
        return el[attr]=== selector
      });
    },

    adaptor(price){
      ['stock', 'adult_same_price', 'adult_straight_price'].forEach(attr => price[attr]= parseFloat(price[attr]));
      return price;
    },

    stockValidator(rule, value, cb){
      if(this.isAdd) return cb();
      value= parseInt(value);
      if(value< this.saled) this.submitForm.stock= this.saled;
      return cb();
    },

    getPriceDto(mixin= {}){
      let { title, cabin_id }= mixin;
      return {
        cabin_id,
        title,
        min_stay: null,
        max_stay: null,
        stock: null,
        adult_same_price: null,
        adult_straight_price: null,
        line_status: 1
      }
    },
  }
}
</script>