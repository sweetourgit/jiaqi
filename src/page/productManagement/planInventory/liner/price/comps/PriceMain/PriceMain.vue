<style>

</style>

<template>
  <main>
    <div style="height: 4000px;">
      <span style="font-size: 14px;">订单预留时长：</span>
      <span>
        <el-select size="small"
          v-model="reserved_time">
          <el-option :key="item" v-for="item in 24" :label="item+ '小时'" :value="item"></el-option>
        </el-select>
      </span>
    </div>
    
  </main>
</template>

<script>
export default {

  data(){
    return {
      reserved_time: 24,
    }
  }

}
</script>