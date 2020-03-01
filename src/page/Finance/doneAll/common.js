import moment from 'moment'
export default {
  data() {
    return {

    }
  },
  created(){
  },
  filters: {
    numFilter (value) {
      // 截取当前数据到小数点后两位
      let realVal = parseFloat(value).toFixed(2)
      return realVal
    },
    formatDate: function (value) {//截取详情时间格式
      return moment(value).format('YYYY-MM-DD')
    },
    formatDateCreateAn: function (value) {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    },
    formatDateDetailsAn:function (value) {
      if(typeof value == 'string'){
        return ''
      } else {
        return moment(value).format('YYYY-MM-DD')
      }
    }
  },
  methods: {
    moment,
    handleCancel(paramsTabName, paramsCollectionTab){
      if(paramsTabName == 'collection'){
        this.$store.commit('doneAll/showCollectionTab', paramsCollectionTab)
      }
      this.$store.commit('doneAll/referDoneAllShowWhichTab', paramsTabName)
      this.$router.go(-1)
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px'
      } else {
        return ''
      }
    },
  }
}
