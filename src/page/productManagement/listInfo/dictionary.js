
export const getTeamProDTO= function(){
  return {
    title: '',
    isForeign: 1,
    day: null,
    night: null,
    pods: [],
    destinations: [],
    confirmType: 0,
    strengths: [],
    label: [],
    pictureID: null,
    vedioID: 100,
    pepeatpic: [],
    crowdID: null,
    themeID: null,
    advanceDay: null,
    mark: '',
    instructions: INSTRUCTION_TITILES.map(title => getInstructionDTO(title)),
    others: [],
    
    proStat: 1,
    createTime: Date.now(),
    createUser:sessionStorage.getItem('userCode'),
    loadPackage: true,
    isDeleted: 0,

    guid: null,
  }
}

export const INSTRUCTION_TITILES= [
  '费用包含', '费用不包含', '温馨提示', '儿童政策', '购物场所', '自费项目'
]

export const getInstructionDTO= function(title){
  return {
    title: title,
    createTime: new Date().toISOString(),
    content: "",
    code: null
  }
}

export const MENU_TYPE= {
  COST: 1,
  RESERVE: 2,
  INTRODUCE: 3
}