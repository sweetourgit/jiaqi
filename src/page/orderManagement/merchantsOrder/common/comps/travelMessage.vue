<style lang="scss" scoped>
.costList {
  width: 800px;
  line-height: 40px;
  text-align: center;
  border: 1px solid #ebebeb;
  border-collapse: collapse;
  border-spacing: 0;
}
.costList_01 {
  background: #f3f3f3;
}
.tc {
  text-align: center;
}
.oh {
  overflow: hidden;
}
ul {
  margin: 0;
  padding: 0;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
</style>
<template>
  <div>
    <table border="1" cellpadding="0" cellspacing="0"
      v-for="(item,indexPrice) in sourceData"
      :class="['costList', orderStatus == 4 || orderStatus == 6|| orderStatus===9 ? 'disableColor':'']"
      :key="indexPrice">
      <tr class="costList_01">
        <td width="120">姓名</td>
        <td width="100">报名类型</td>
        <td width="120">电话</td>
        <td width="180">身份证</td>
        <td width="80">性别</td>
        <td width="140">操作</td>
      </tr>
      <tr v-for="(guest, index) in item" :key="'b'+index">
        <td>{{guest.cnName}}</td>
        <td>
          <span>{{guest.enrollName}}</span>
          <br/>
          <span>{{toDecimal2(guest.singlePrice)}}</span>
        </td>
        <td>{{guest.mobile}}</td>
        <td>{{guest.idCard}}</td>
        <td>
          <div v-if="guest.sex=='0'">男</div>
          <div v-if="guest.sex=='1'">女</div>
        </td>
        <td class="tc">
          <el-button
            class="fl cursor"
            @click="$emit('edit-guest', guest)"
            :disabled="disabled"
          >编辑</el-button>
          <span class="fl">|</span>
          <el-button
            class="fl cursor"
            @click="delTravel(guest, item)"
            :disabled="disabled"
          >删除</el-button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {

  props: {
    orderStatus: Number,
    proto: Array,
    disabled: Boolean,
  },

  watch: {
    proto: {
      handler(nval, oval){
        if(nval && nval.length){
          this.sourceData.splice(0);
          this.sourceData.push(...nval);
        }
      },
      immediate: true,
      deep: true
    }
  },

  data(){
    return {
      sourceData: []
    }
  },

  methods: {
    delTravel(guest, enroll){
      this.$emit('remove-guest', { guest, enroll });
    },

    toDecimal2(x) {
      let f = Math.round(x * 100) / 100;
      var s = f.toString();
      var rs = s.indexOf(".");
      if (rs < 0) {
        rs = s.length;
        s += ".";
      }
      while (s.length <= rs + 2) {
        s += "0";
      }
      return s;
    }
  }

}
</script>