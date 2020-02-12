<template>
  <div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  created() {
      this.getaaa();
  },
  methods: {
    getaaa(){
      this.$http.post(this.GLOBAL.serverSrc + "/order/guest/refundstat/update",{
        objects:
          [
            {
            "id": 22960,
            "isDeleted": 0,
            "createTime": 0,
            "code": null,
            "cnName": "",
            "enName": "",
            "sex": 3,
            "idCard": "",
            "enrollID": 1,
            "enrollName": "成人测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试",
            "singlePrice": 4000,
            "mobile": "",
            "bornDate": 0,
            "credType": 0,
            "credCode": "",
            "credTOV": 0,
            "orderID": 1986,
            "orderCode": "15815134891626001667",
            "orgID": 0,
            "userID": 60,
            "enrollNum": 0,
            "refundStatus": 0
          }
          ]
      })
    }
  }
};
</script>

<style scoped lang="scss">

</style>


