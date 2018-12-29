<template>
  <div>
       <div class="pro-info">
            <table cellpadding="5">
                <tr>
                  <td width="60" class="tr">订单ID</td>
                  <td>24093932018091010185273</td>
                  <td width="60" class="tr">产品ID</td>
                  <td width="220">24093932018091010185273</td>
                  <td width="85" class="tr">订单状态</td>
                  <td width="70">订单确认</td>
                  <td width="60" class="tr">退款状态</td>
                  <td width="60">未退款</td>
                  <td width="60" class="tr">订单时间</td>
                  <td>2018/09/10 13:37</td>
                </tr>
                <tr>
                  <td width="60" class="tr">产品名</td>
                  <td colspan="9">新加坡斜坡滑车+空中吊椅索道滑车SkylineLuge景点门票 ( 即订即用 圣淘沙景点门票）</td>
                </tr>
                <tr>
                  <td width="60" class="tr">套餐名称</td>
                  <td colspan="3">君澜日式豪华房 含早餐 双人不限次温泉门票</td>
                  <td width="60" class="tr">团期计划ID</td>
                  <td colspan="5">24093932018091010185273</td>
                </tr>
                <tr>
                  <td width="60" class="tr">应付</td>
                  <td>1200</td>
                  <td width="60" class="tr">单价</td>
                  <td rowspan="2" valign="top">成人3000.00*1 单房差 500.00*1</td>
                  <td width="60" class="tr">优惠</td>
                  <td colspan="4" rowspan="2" valign="top">满1000立减300 下单立减2块</td>
                  <td rowspan="2">&nbsp;</td>
                </tr>
                <tr>
                  <td width="60" class="tr">已付</td>
                  <td>2500</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
                <tr>
                  <td width="60" class="tr">平台</td>
                  <td>苹果</td>
                  <td width="60" class="tr">支付方式</td>
                  <td>微信支付</td>
                  <td width="60" class="tr">订单来源</td>
                  <td colspan="3">xxx旅行社</td>
                  <td width="60" class="tr">销售</td>
                  <td>阳阳</td>
                </tr>
                <tr>
                  <td width="60" class="tr">用户姓名</td>
                  <td>阳阳</td>
                  <td width="60" class="tr">电话</td>
                  <td>13800001111</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
            </table>
            <div class="confirm-time">待确认剩余<span>1天22:33:33</span></div>
            <el-row class="but-row">
               <el-button>联系客人</el-button>
               <el-button>流程管理</el-button>
               <el-button>备注信息</el-button>
               <el-button>未申请退款</el-button>
               <el-button>转团</el-button>
            </el-row>
       </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  mounted(){

  },
  methods: {

    }
}
</script>

<style scoped>
    .main{overflow:hidden;padding-bottom: 50px;margin-bottom: 120px}
    .pro-info{font-size: 14px;background-color: #e4e4e4;margin:0 30px 30px 10px;line-height: 25px;padding:10px;width: 70%;min-width:1120px}
    .tr{text-align: right;font-weight: bold}
    .but-row{margin:40px 0 20px 10px}
    .but-row .el-button{border: 1px solid #2f95f9}
    .confirm-time{float: right;margin: 50px 55px 0 0;font-weight: bold;font-size:15px}
    .confirm-time span{color:#ff4c3d;margin-left: 20px}
</style>