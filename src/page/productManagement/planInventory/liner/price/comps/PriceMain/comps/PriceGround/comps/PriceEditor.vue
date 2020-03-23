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
      <el-form-item label="房型：" prop="money">
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

      <el-form-item label="标题：" prop="money">
        <el-input placeholder="请输入标题" style="width: 360px;"
          v-model="submitForm.title">
        </el-input>
      </el-form-item>

      <el-form-item label="最少入住：" prop="money">
        <el-select style="width: 360px;"
          v-model="submitForm.reserved_time">
          <el-option :key="item" v-for="item in number" :label="item+ '人'" :value="item"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="标题：" prop="money">
        <el-input placeholder="请输入金额" style="width: 360px;"
          v-model="submitForm.money">
        </el-input>
        <span>已售库存：10</span>
      </el-form-item>
      
      <el-form-item label="标题：" prop="money">
        <el-input placeholder="请输入金额" style="width: 360px;"
          v-model="submitForm.money">
        </el-input>
      </el-form-item>

      <el-form-item label="标题：" prop="money">
        <el-input placeholder="请输入金额" style="width: 360px;"
          v-model="submitForm.money">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" style="display: flex; justify-content: flex-end; padding-top: 20px;">
      <el-button size="small" 
        @click="handleClose">
        取 消
      </el-button>
      <el-button size="small" type="primary">保 存</el-button>
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
      rules: {},
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
        this.$assign(this.submitForm, price);
      }
      this.state= true;
    },

    handleClose(){
      this.state= false;
    },

    selectCabin(selector){
      let cabin= this.findCabin(selector);
      let { name, number, id }= cabin;
      if(this.isAdd) this.$assign(this.submitForm, this.getPriceDto({ cabin_id: id, title: name }));
      this.submitForm.min_stay= null;
      this.submitForm.max_stay= number;
      this.number= number;
    },

    findCabin(selector){
      let attr= Object.prototype.toString.call(selector)=== '[object Number]'? 'id': 'name'
      return this.cabinTypeOptions.find(el => el[attr]=== selector);
    },

    adaptor(price){

    },

    getPriceDto(mixin= {}){
      let { title, cabin_id }= mixin;
      console.log(title, cabin_id);
      return {
        cabin_id,
        title,
        min_stay: null,
        max_stay: null,
        stock: null,
        adult_same_price: null,
        adult_straight_price: null,
        line_status: 0
      }
    },
  }
}
</script>