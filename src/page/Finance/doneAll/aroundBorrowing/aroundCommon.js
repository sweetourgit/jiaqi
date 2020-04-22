import {formatDate} from '@/js/libs/publicMethod.js'
import moment from 'moment'
export default{
  data() {
    return {
      tableData: [],
      totalNum: 0
    }
  },
	methods: {
    moment,
		// 导出方法
		exportFun(ruleForm, type){
			let start = '', end = '';
			if(ruleForm.startTime){
				start = moment(ruleForm.startTime).format('YYYY-MM-DD');
			}
			if(ruleForm.endTime){
				end = moment(ruleForm.endTime).format('YYYY-MM-DD');
			}
			if(type == 1){
				if(this.tableData1.length == 0){
					this.$message.warning("无搜索数据导出，请重新搜索！");
				}else{
					window.location.href = this.GLOBAL.serverSrcPhp + "/api/v1/loan/periphery-loan/exportloan?periphery_type=1&supplier_code=" + ruleForm.supplierID + "&create_uid=" + ruleForm.reimbursementPerID + "&start_time=" + start + "&end_time=" + end + "&approval_status=" + ruleForm.borrowStatus + "&account_type=" + ruleForm.accountType + "&reimbursed_status=" + ruleForm.reimbursed_status;
				}
			}else if(type == 2){
				if(this.tableData2.length == 0){
					this.$message.warning("无搜索数据导出，请重新搜索！");
				}else{
					window.location.href = this.GLOBAL.serverSrcPhp + "/api/v1/loan/periphery-loan/exportloan?periphery_type=2&supplier_code=" + ruleForm.supplierID + "&create_uid=" + ruleForm.reimbursementPerID + "&start_time=" + start + "&end_time=" + end + "&approval_status=" + ruleForm.borrowStatus + "&account_type=" + ruleForm.accountType + "&reimbursed_status=" + ruleForm.reimbursed_status;
				}
			}else if(type == 3){
				if(this.tableData3.length == 0){
					this.$message.warning("无搜索数据导出，请重新搜索！");
				}else{
					window.location.href = this.GLOBAL.serverSrcPhp + "/api/v1/loan/periphery-loan/exportloan?periphery_type=3&supplier_code=" + ruleForm.supplierID + "&create_uid=" + ruleForm.reimbursementPerID + "&start_time=" + start + "&end_time=" + end + "&approval_status=" + ruleForm.borrowStatus + "&account_type=" + ruleForm.accountType + "&reimbursed_status=" + ruleForm.reimbursed_status;
				}
			}
			
		},
		// 获取工作流未完成任务
		loadFinished(ruleForm, loan){
      const that = this;
			this.$http.post(this.GLOBAL.jqUrlZB + "/ZB/GettingfinishedTasksForJQ", {
				"userCode": sessionStorage.getItem('tel'),
				"startTime": "1970-07-23T01:30:54.452Z",
				"endTime": moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
				"startIndex": -1,
				"endIndex": -1,
				"workflowCode": loan
			}, ).then(function(response) {
				// console.log('获取已办任务', response);
				let noIncomeIDs = '', noIncomeNum = 0, advanceIDs = '', advanceNum = 0, balanceIDs = '', balanceNum = 0;
				if(loan == 'NoIncomeLoan_ZB'){
					if(response.data.length !== 0){
						response.data.forEach(function (item, index, arr) {
							noIncomeIDs += item.jq_ID + ',';
							noIncomeNum++;
						});
						
						noIncomeIDs = noIncomeIDs.substr(0, noIncomeIDs.length - 1);
						that.loadData(1, noIncomeIDs, ruleForm);
					}else{
						that.noIncomeNum = 0;
						that.tableData1 = [];
						that.pageCount1 = 0;
					}
				}else if(loan == 'IncomeLoan_ZB'){
					if(response.data.length !== 0){
						response.data.forEach(function (item, index, arr) {
							advanceIDs += item.jq_ID + ',';
							advanceNum++;
						});

						advanceIDs = advanceIDs.substr(0, advanceIDs.length - 1);
						that.loadData(2, advanceIDs, ruleForm);
					}else{
						that.advanceNum = 0;
						that.tableData2 = [];
						that.pageCount2 = 0;
					}
				}else if(loan == 'BalancePayment_ZB'){
					if(response.data.length !== 0){
						response.data.forEach(function (item, index, arr) {
							balanceIDs += item.jq_ID + ',';
							balanceNum++;
						});
						
						balanceIDs = balanceIDs.substr(0, balanceIDs.length - 1);
						that.loadData(3, balanceIDs, ruleForm);
					}else{
						that.balanceNum = 0;
						that.tableData3 = [];
						that.pageCount3 = 0;
					}
        }
			}).catch(function(error) {
				console.log(error);
      });
      return that.totalNum;
		},
	
		// 加载数据
		loadData(periphery_type, ids, ruleForm){
      const that = this;
      let currentPage = '', pageSize = '';
			if(periphery_type == 1){
        currentPage = this.currentPage1;
        pageSize = this.pageSize1;
			}else if(periphery_type == 2){
        currentPage = this.currentPage2;
        pageSize = this.pageSize2;
      }else if(periphery_type == 3){
        currentPage = this.currentPage3;
        pageSize = this.pageSize3;
      }
			this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/loan/periphery-loan/examinepage", {
				"pageIndex": currentPage,
				"pageSize": pageSize,
				"create_uid": ruleForm.reimbursementPerID,
				"supplier_code": ruleForm.supplierID,
				"start_at": ruleForm.startTime,
				"end_at": ruleForm.endTime,
				"periphery_type": periphery_type,
				"approval_status": ruleForm.borrowStatus,
				"account_type": ruleForm.accountType,
				"reimbursed_status": ruleForm.reimbursed_status,
				"id": ids
			}, ).then(function(response) {
		console.log(response);
		// 2020-4-20 预付款和余额借款被驳回后在已办不显示
				if (response.data.code == '200') {
					// if(periphery_type!=1){
					// 	for(let i=0;i<response.data.data.list.length;i++){
					// 		if(response.data.data.list[i].approval_status==2){
					// 			response.data.data.list.splice(i,1)
					// 			i=i-1
					// 		}
					// 	}
					// }
          let idArr = [];
          that.totalNum =response.data.data.total - 0;
		  that.tableData = response.data.data.list;
          that.tableData.forEach(function (item, index, arr) {
            idArr.push(item.id);
					})	
          that.sortTable(idArr, periphery_type, that.totalNum);
				} else {
					that.$message.success("加载数据失败~");
        }
        
			}).catch(function(error) {
				console.log(error);
      });
      
    },
    // 排序
    sortTable(idArr, type, num){
      const that = this;
      this.$http.post(this.GLOBAL.jqUrlZB + "/ZB/GetFinishedTasksNewTimeByJQIds", {
        "jQ_IDs": idArr,
        "jQ_Type": type
      }, ).then(function(response) {
        // console.log('排序', response);
        if(response.status == 200){
          let moneyAll = 0;
          response.data.list.forEach(function(item, index, arr){
            that.tableData.forEach(function(item1, index1, arr1){
              if(item.jqId == item1.id){
                item = Object.assign(item, item1);
                moneyAll += parseFloat(item.loan_money);
                item.finishTime = item.finishTime.split('T')[0] + ' ' + item.finishTime.split('T')[1];
                item.created_at = formatDate(new Date(item.created_at*1000));
                // 根据ID获取人名
                that.getName(item.create_uid).then(res => {
                  item.create_uid = res;
                });
                // 根据code获取供应商名称
                that.getSupplier(item.supplier_code).then(res => {
                  item.supplier_code = res;
                });
                return;
              }
            })
          })
          if(type == 1){
            that.tableData1 = response.data.list;
            that.pageCount1 = num;
            that.totalMoney1 = moneyAll.toFixed(2);
						that.num1 = response.data.list.length;
						that.$store.commit('doneAll/updateBorrowAroundNoIncomeNum', num)
          }else if(type == 2){
            that.tableData2 = response.data.list;
            that.pageCount2 = num;
            that.totalMoney2 = moneyAll.toFixed(2);
						that.num2 = response.data.list.length;
						that.$store.commit('doneAll/updateBorrowAroundAdvanceNum', num)
          }else if(type == 3){
            that.tableData3 = response.data.list;
            that.pageCount3 = num;
            that.totalMoney3 = moneyAll.toFixed(2);
						that.num3 = response.data.list.length;
						that.$store.commit('doneAll/updateBorrowAroundBalanceNum', num)
					}
					that.$emit('handlePassVal', num);
        }
      }).catch(function(error) {
        console.log(error);
      });
    },
		// 根据id获取操作人
		getName(id){
			const that = this;
			return that.$http.post(that.GLOBAL.serverSrcZb + "/org/api/userget", {
				"id": id
			},{
				headers: {
					'Authorization': 'Bearer ' + localStorage.getItem('token'),
				}
			}).then(function(response) {
				// console.log('名字',response.data.object.name);
				if (response.data.isSuccess) {
					return response.data.object.name;
				} else {
					if(response.data.result.message){
						that.$message.warning(response.data.result.message);
					}else{
						that.$message.warning("申请人获取失败~");
					}
					return '';
				}
			}).catch(function(error) {
				console.log(error);
				return '';
			});
		},
		// 根据id获取供应商
		getSupplier(code){
			const that = this;
			return that.$http.post(that.GLOBAL.serverSrcZb + "/universal/supplier/api/supplierget", {
				"id": code
			},{
				headers: {
					'Authorization': 'Bearer ' + localStorage.getItem('token'),
				}
			}).then(function(response) {
				// console.log(response);
				if (response.data.isSuccess) {
					return response.data.object.name;
				} else {
					if(response.data.result.message){
						that.$message.warning(response.data.result.message);
					}else{
						that.$message.warning("获取供应商名称失败~");
					}
					return '';
				}
			}).catch(function(error) {
				console.log(error);
			});
		},
		getRowClass ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px'
      } else {
        return ''
      }
    },
		// 时间限制（开始时间小于结束时间）
		beginDate(){
			const that = this;
			return {
				disabledDate(time){
					if (that.endTime) {  //如果结束时间不为空，则小于结束时间
						return new Date(that.endTime).getTime() < time.getTime()
					} else {
						// return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
					}
				}
			}
		},
		processDate(){
			const that = this;
			return {
				disabledDate(time) {
					if (that.startTime) {  //如果开始时间不为空，则结束时间大于开始时间
						return new Date(that.startTime).getTime() > time.getTime()
					} else {
						// return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
					}
				}
			}
		},
	}
}
