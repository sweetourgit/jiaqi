<style lang="scss" scoped>

</style>

<template>
  <div class="ext-hotel">
    <el-col>
      <el-radio-group v-model="submitForm.IsHotel">
        <!-- <el-radio :label="0">酒店</el-radio> -->
        <el-radio :label="0">其他</el-radio>
      </el-radio-group>
    </el-col>
    <el-col v-if="!submitForm.IsHotel">
      <el-input placeholder="住宿说明" style="width: 300px;" size="small"
        v-model="submitForm.Details"
        @change="change"
      ></el-input>
    </el-col>
  </div>
</template>

<script>
/**
 * @description: 
 * 1. 在watch中初始化，因为第一次传的value是void 0
 */

export default {

  props: {
    value: [String, Error]
  },

  mounted(){
    this.change= this.$debounce(() => {
      this.validate() 
        && this.$emit('input', JSON.stringify(this.submitForm));
    }, 1000, true);
  },

  watch: {
    value(nval){
      if(nval && !this.vm.inited) this.init();
    }
  },
  
  data(){
    return {
      vm: {
        inited: false,
      },
      submitForm: {
        IsHotel: 0,
        Details: ''
      }
    }
  },

  methods: {
    init(){
      this.vm.inited= true;

      // 接口文档是对象，但是现在传回来的都是数组，这里先做个补丁, 以后数据正确这里要删掉
      let fake= JSON.parse(this.value);
      if(Object.prototype.toString.call(fake)=== '[object Array]'){
        fake= fake[0];
        !('IsHotel' in fake) && (fake.IsHotel= 0); 
      }

      this.checkProto= this.$deepCopy(fake);
      this.submitForm= this.$deepCopy(fake);
    },

    change(){},

    validate(){
      if(this.submitForm.Details) return true;
      this.$emit('input', new Error(
        this.submitForm.IsHotel? '未选择酒店信息': '住宿说明不能为空'
      ));
      return false;
    },
  }

}
</script>