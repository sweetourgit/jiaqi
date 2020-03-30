import { dictionaryMaker } from '@/js/utils'

export const PLAN_STATUS= dictionaryMaker({
  NORMAL: { label: '正常', value: 1 },
  OUTLINE: { label: '停售', value: 2 },
  CLOSE: { label: '封团', value: 3 },
  PRE_FULL: { label: '暂满', value: 4 },
  FULL: { label: '满员', value: 5 },
})

export const CHECK_STATUS= dictionaryMaker({
  PREPARE: { label: '未报账', value: 1 },
  CHECKING: { label: '报账中', value: 2 },
  REJECT: { label: '报账驳回', value: 3 },
  CHECKED: { label: '已报账', value: 4 }
})