<style lang="scss" scoped>
.display-bar{
  .borrow-ground{
    height: 250px;
    .title{
      font-size: 24px;
      line-height: normal;
      font-weight: bold;
      margin-bottom: 24px;
    }
  }
  .lend-ground{
    height: 250px;
    .title{
      font-size: 24px;
      line-height: normal;
      font-weight: bold;
      margin-bottom: 24px;
    }
  }
}
</style>
<template>
  <div class="display-bar">

    <div class="borrow-ground"
      v-show="borrowState">
      <div class="title">
        借款信息
      </div>
      <el-form label-width="120px" style="width: 100%;">
        <el-row :gutter="100" class="common-row">
          <el-col :span="12">
            <el-form-item label="借款单号：">
              <span class="content">
                {{ borrow.id }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="金额：">
              <span class="content">
                {{ borrow.price }}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="lend-ground"
      v-show="lendState">
      <div class="title">
        报销信息
      </div>

      <el-form label-width="120px" style="width: 100%;">
        <el-row :gutter="100" class="common-row">
          <el-col :span="12">
            <el-form-item label="报销单号：">
              <span class="content">
                {{ borrow.expenseID }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="团期计划：">
              <span class="content">
                {{ lend.groupCode }}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-form label-width="120px" style="width: 100%;">
        <el-row :gutter="100" class="common-row">
          <el-col :span="12">
            <el-form-item label="产品名称：">
              <span class="content">
                {{ lend.teamProName }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="摘要：">
              <span class="content">
                {{ lend.expenseMark }}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-form label-width="120px" style="width: 100%;">
        <el-row :gutter="100" class="common-row">
          <el-col :span="12">
            <el-form-item label="报销金额：">
              <span class="content">
                {{ lend.price }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态：">
              <span class="content">
                {{ lend.checkTypeEX }}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {

  data(){
    return Object.assign(
      {
        borrowState: false,
        lendState: false,
      },
      {
        borrow: {},
        lend: {},
      }
    )
  },

  methods: {
    wakeup(payload= {}){
      let { borrow, lend }= payload;
      this.borrowState= !!borrow;
      this.lendState= !!lend;
      if(borrow) this.borrow= borrow;
      if(lend) this.lend= lend;
    }
  }

}
</script>