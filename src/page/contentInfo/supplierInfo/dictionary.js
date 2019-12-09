// 获取供应商原型
export const getSupplierDTO= function(){
  return {
    id: 0,
    createTime: null,	// integer($int64)
    // code
    name: null,
    types: [],
    productDirection: null,
    isMonthly: null,
    productArea: null,
    leader: null,
    phone: null,
    legalPerson: null,
    handPerson: null,
    handPhone: null,
    billName:	null,
    taxNumber: null,
    expireTime: null,	// string($date-time)
    memo: null,
    banks: [],
    files: [],
    createUser: null,
    supplierCode: null,
    alias: [],
    
    // 暂设常量
    orgs: [
      {
        id: 0,
        orgName: "嘉麒集团"
      }
    ], 
    companyArea: 1,
    isDeleted: 0,
    isAgree: 2,
    userState: 1, // 角色的数据状态 0等待审核 1正常 2停用
    manageType: 1
  }
}

// 状态options
export const ConditionTypeOptions= [
  { value: 1, label: "正常" },
  {value: 2, label: "停用"},
  {value: 0, label: "待审核"}
]

export const CompanyAreaOptions= [
  { value: 1, label: "集团专享" },
  { value: 2, label: "沈阳专享" },
  { value: 3, label: "吉林专享" },
  { value: 4, label: "大连专享" },
  { value: 5, label: "哈尔滨专享" }
]
