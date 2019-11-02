<style lang="scss" scoped>
.date-panel{
  height: calc(100% - 50px);
  width: 100%;
  box-sizing: border-box;
  *{
    box-sizing: border-box;
  }
  &>header{
    .selector{
      cursor: pointer;
      user-select: none;
      line-height: 32px;
      .control-btns{
        padding:0 20px;
      }
    }
  }
  &>main{
    padding:20px 10px;
    width: 100%; // 120* 7+ 10* 2
    ul, li{
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 100%;
      font: inherit;
      vertical-align: baseline;
      box-sizing: border-box;
    }
    ol, ul, li {
      list-style: none;
    }
    .day-conteiner{
      width: 100%;
    }
    .day{
      display: inline-block;
      padding: 2px;
      width: 14.28%;
      height: 180px;
      border: 1px solid #aeaeae;
    }
  }
}
</style>

<template>
  <div class="date-panel">
    <header>
      <div class="selector">
        <span class="control-btns">
          <i class="el-icon-d-arrow-left" @click="monthHandler(-1)"></i>
        </span>
        <div style="display:inline-block; min-width: 170px; text-align: center;"
          @click="vm.state= !vm.state"
        >
          <span style="padding:0 5px;">{{ current[0] }}</span><span>年</span>
          <span style="padding:0 5px;">{{ current[1]+ 1 }}</span><span>月</span>
        </div>
        <span class="control-btns">
          <i class="el-icon-d-arrow-right" @click="monthHandler(1)"></i>
        </span>
      </div>
    </header>
    <main>
      <ul class="day-container">
        <template v-for="week in 6">
          <template v-for="day in 7">
            <li :key="week+ '-'+ day" class="day">
              <div></div>
            </li>
          </template>
        </template>
      </ul>
    </main>
  </div>
</template>

<script>
export default {

  data(){
    return {
      vm: {
        inAsync: false,
        state: false
      },
      // 长度为3的数组，依次存放年月日
      current: [],
      dayArray: []
    }
  },

  methods: {
    init(date){
      this.changeInAsync(true);
      this.changeCurrent(...this.getDateArr(date));
      inventorylistAction.bind(this)(
        this.getDateInt(date)
      ).then(res => {
        this.$emit('submit-inventory', this.dayArrayMaker(res));
      }).catch(err => {
        this.$message.error(err);
        this.$emit('submit-inventory', null);
      }).finally(() => {
        this.changeInAsync(false);
      })
    },

    dayHandler(){},
    monthHandler(){},

    getDateArr(date){
      date= date || new Date();
      return [
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      ]
    },

    /**
     * @description: 更改当前current的值
     */
    changeCurrent(year, month, day){
      year && this.current.splice(0, 1, year);
      (month || month=== 0) && this.current.splice(1, 1, month);
      day && this.current.splice(2, 1, day);
    },

    /**
     * @description: 根据是否弹开执行emit
     */
    changeInAsync(bol){
      this.vm.inAsync= bol;
      !this.vm.state && this.$emit('in-async', bol); 
    },
  }
}
</script>