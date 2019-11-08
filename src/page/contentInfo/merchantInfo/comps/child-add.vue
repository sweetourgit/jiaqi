<style lang="scss" scoped>
.child-add{
  height: 100%;
  &>header{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &>main{
    padding-top: 20px;
    height: 100%;
    .form-content{
      height: 100%;
      overflow: auto;
    }
  }
}
</style>

<template>
  <div class="child-add">
    <div @click="$emit('change-child')">add</div>
    <header>
      <div>新增商户</div>
      <div>
        <el-button type="primary" size="small">确定</el-button>
        <el-button size="small">取消</el-button>
      </div>
    </header>
    <main>
      <div class="form-content">
        <div style="height: 1000px;"></div>
      </div>
    </main>
  </div>
  
</template>

<script>
export default {

}
</script>