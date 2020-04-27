<style lang="scss" scoped>
.label-input{
  position: relative;
  width: 100%;
  &>.tag{
    display: inline-block;
    font-size: 12px;
    height: 32px;
    line-height: 1;
    padding: 9px 15px;
    margin-right: 10px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    box-sizing: border-box;
    .close{
      display: none;
      padding-left: 12px;
    }
  }
  &>.tag:hover{
    .close{
      display: inline;
    }
  }
  .input-ground{
    width: 100%;
    .inline-input{
      width: 300px;
    }
    .el-autocomplete-suggestion li:hover{
      background-color: #F5F7FA;
    }
  }
}
</style>

<template>
  <div class="label-input" @blur="blur">

    <div class="tag"
      v-for="(item, i) in list"
      :key="i"
    >
      <span>{{ item[tagLabelAttr] }}</span>
      <span class="close">
        <i class="el-icon-close" @click="deleteTag(i)"></i>
      </span>
    </div>

    <el-button type="primary" size="small" icon="el-icon-plus" circle
      v-show="!vm.inEdit"
      @click="changeState"
    ></el-button>

    <div class="input-ground">

      <el-autocomplete class="inline-input" size="small"
        ref="autocompleteRef"
        v-model="vm.inputVal"
        v-show="isAutocomplete && vm.inEdit"
        :fetch-suggestions="emitFetchSuggestions"
        :placeholder="placeholder"
        :trigger-on-focus="false"
        @select="select"
        @blur="blur(200)"
      ></el-autocomplete>

      <div v-show="!isAutocomplete && vm.inEdit">
        <el-input class="inline-input" size="small"
          ref="inputRef"
          v-model="vm.inputVal"
          :placeholder="placeholder"
          :maxlength="inputProps.maxlength"
          :show-word-limit="inputProps.showWordLimit"
          @blur="blur(200)"
        >
        </el-input>
        <el-button type="primary" size="small" @click="sureInput">确定</el-button>
      </div>

    </div>
  </div>  
</template>

<script>
export default {
  props: {
    value: Array,
    placeholder: String,
    tagLabelAttr: String,
    tagValueAttr: String,
    cbLabel: String,
    inputProps: {
      type: Object,
      default(){
        return {}
      }
    },
    fetchSuggestions: Function,
  },

  created(){
    this.init();
  },
  
  computed: {
    isAutocomplete(){
      return !!this.fetchSuggestions;
    }
  },

  data(){
    return {
      vm: {
        inputVal: '',
        inEdit: false,
      },
      list: [],
    }
  },

  methods: {
    init(){
      this.list= this.value;
    },

    changeState(){
      this.vm.inEdit= true;
      this.$nextTick(() => {
        let input= this.isAutocomplete? 
          this.$refs.autocompleteRef.$el:
            this.$refs.inputRef.$el
        input.querySelector('input').focus();  
      })
    },

    emitFetchSuggestions(val, cb){
      this.fetchSuggestions(val, cb, this.cbLabel, this.tagValueAttr, this.tagLabelAttr);
    },

    select(selector){
      let isExisted= this.checkTagExisted(selector.data);
      !isExisted && this.list.push(selector.data);
      this.blur();
    },

    sureInput(){
      new Promise((resolve, reject) => {
        let val= this.vm.inputVal;
        if(!val) reject();
        val= this.inputProps.factory?
          this.inputProps.factory(val): val;
        if(!val) reject();
        this.checkTagExisted(val)? reject(): resolve(val);
      }).then(res => {
        this.list.push(res)
      }).catch(() => {

      }).finally(() => {
        this.blur();
      })
    },

    blur(time){
      setTimeout(() => {
        this.vm.inEdit= false;
        this.vm.inputVal= null;
      }, time || 50);
    },

    checkTagExisted(tag){
      return this.list.find(el => {
        let attr= this.tagLabelAttr;
        return attr? tag[attr]=== el[attr]: tag=== el;
      });
    },

    deleteTag(index){
      this.list.splice(index, 1);
      this.vm.inputVal= 'index';
      this.$nextTick(() => { this.vm.inputVal= null });
    },
  }
}
</script>