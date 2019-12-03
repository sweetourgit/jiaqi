<style lang="scss" scoped>
.supplier-detail{
  display: flex;
  position: relative;
  padding-bottom: 80px;
  &>main{
    width: 1080px;
  }
  &>aside{
    padding-left: 20px;
    .fixed-outer{
      position: fixed;
    }
  }
}
</style>

<template>
  <div class="supplier-detail">
    <main>
      <div>
          <div class="title">基本信息</div>
          <el-form ref="submitForm" label-width="120px" style="width: 100%; padding-top: 15px;">

            <el-row :gutter="100" class="common-row">
              <el-col :span="12">
                <el-form-item label="供应商名称：">{{ submitForm.name }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="法人代表：">{{ submitForm.legalPerson | nullFilter }}</el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="100" class="common-row">
              <el-col :span="12">
                <el-form-item label="供应商编码：">{{ submitForm.supplierCode }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="合同编号：">{{ submitForm.taxNumber }}</el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="100" class="common-row">
              <el-col :span="12">
                <el-form-item label="状态：">{{ submitForm.userState }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="经手人：" prop="handPerson">{{ submitForm.handPerson }}</el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="100" class="common-row">
              <el-col :span="12">
                <el-form-item label="线路：" prop="productArea">{{ submitForm.productArea }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="经手人电话：" prop="handPhone">{{ submitForm.handPhone }}</el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="100" class="common-row">
              <el-col :span="12">
                <el-form-item label="类别：" prop="types">{{ submitForm.types }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="负责人：" prop="leader">{{ submitForm.leader }}</el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="100" class="common-row">
              <el-col :span="12">
                <el-form-item label="结算方式：" prop="isMonthly">{{ submitForm.isMonthly }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="负责人电话：" prop="phone">{{ submitForm.phone }}</el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="100" class="common-row">
              <el-col :span="12">
                <el-form-item label="产品主要方向：" prop="productDirection">{{ submitForm.productDirection |  }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="操作负责人：" prop="billName">{{ submitForm.billName }}</el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="100" class="common-row">
              <el-col :span="12">
                <el-form-item label="到期日期：" prop="expireTime">{{ submitForm.expireTime }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="供应商协议：" prop="isAgree">{{ submitForm.isAgree }}</el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="100" class="common-row">
              <el-col :span="12" :offset="12">
                <el-form-item label="备注：" prop="memo">
                  <div>
                    {{ submitForm.memo }}
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="100" class="common-row">
              <el-col :span="12">
                <el-form-item label="附件：" prop="files">
                  <div>
                    <div v-for="(file, i) in submitForm.files" :key="i">
                      {{ file.name }}
                    </div>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="供应商别名：" prop="alias">{{ submitForm.alias }}</el-form-item>
              </el-col>
            </el-row>

          </el-form>
      </div>
      <div style="margin-top: 20px;">
        <div class="title" style="margin-bottom: 20px;">账户信息</div>
        <div style="padding-left: 60px;">
          <el-table style="width: 100%" border
            :data="submitForm.banks"
            :highlight-current-row="false"
            :header-cell-style="getRowClass">
            <el-table-column align="center" prop="cardName" label="汇款户名" ></el-table-column>

            <el-table-column align="center" prop="bankName" label="开户行"></el-table-column>

            <el-table-column align="center" prop="cardNumber" label="账号"></el-table-column>

            <el-table-column align="center" prop="memo" label="备注"></el-table-column>
          </el-table>
        </div>
      </div>
    </main>
    <aside>
      <div class="fixed-outer">
        <el-button type="info" size="small"
          @click="backListWithQuery">
          返回
        </el-button>
      </div>
    </aside>    
  </div>
</template>

<script>
import { getSupplierDTO } from '../dictionary'
import { getSupplierById, getDicOptions } from '../api'

export default {

  mounted(){
    this.preHandler();
    this.makeOptions();
  },

  data(){
    return {
      submitForm: { ...getSupplierDTO() },
      SupplierTypeOptions: [],
      IsMonthlyOptions: [],
      ProductAreaOptions: [],
      ConditionTypeOptions: [{ value: 1, label: "正常" },{value: 2, label: "停用"},{value: 0, label: "待审核"}]
    }
  },

  filters: {
    nullFilter(val){
      if(val) return val;
      return '（ 未填写 ）';
    }
  },

  methods: {
    preHandler(){
      let { conditions, pageInfo, id }= this.$route.query;
      if(conditions || pageInfo) this.backQuery= { conditions, pageInfo };
      this.$router.replace({ path: this.$route.path, query: { id } });
    },

    makeOptions(){
      Promise.all([
        getDicOptions('SupplierType'),
        getDicOptions('IsMonthly'),
        getDicOptions('ProductArea')
      ]).then(res => {
        this.SupplierTypeOptions.push(
          ...res[0].map(el => {
            return {
              supplierType: el.id,
              supplierTypeEX: el.name
            }
          })
        );
        this.IsMonthlyOptions.push(...res[1]);
        this.ProductAreaOptions.push(...res[2]);
        this.init();
      })
    },

    init(){
      let { id }= this.$route.query;
      getSupplierById(id)
      .then(res => {
        Object.assign(this.submitForm, res);
        this.submitForm.userState= this.ConditionTypeOptions.find(el => el.value== res.userState).label;
        this.submitForm.productArea= this.ProductAreaOptions.find(el => el.id== res.productArea).name;
        this.submitForm.types= this.typesAdaptor(res.types);
        this.submitForm.isMonthly= this.IsMonthlyOptions.find(el => el.id== res.isMonthly).name;
        this.submitForm.expireTime= this.expireTimeAdaptor(res.expireTime);
        this.submitForm.isAgree= res.isAgree=== 1? '是': '否';
        //this.submitForm.files= this.filesAdaptor(res.files);
        this.submitForm.alias= this.aliasAdaptor(res.alias);
      })
    },

    typesAdaptor(types){
      return types.map(type => type.supplierTypeEX).join('、');
    },

    expireTimeAdaptor(expireTime){
      let date= new Date(expireTime);
      return `${ date.getFullYear() }年${ date.getMonth()+ 1 }月${ date.getDate() }日`
    },

    filesAdaptor(files){

    },
    
    aliasAdaptor(alias){
      return alias.map(alias => alias.name).join('、');
    },

    backListWithQuery(){
      this.$router.replace({ path: '/supplierInfo', query: this.backQuery });
    },

    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
  }

}
</script>