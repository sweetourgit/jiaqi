 let Mock = require('mockjs')
let Random = Mock.Random
let data = Mock.mock('mock/nongye', 'post', {
    "data|10": [{
        "SYJE|1000-10000": 1000,
        "is_ZCK|1": [0, 1],
        "JYLSH|1": /\d{7,10}/,
        "JYSJ": function () {
            return Random.time()
        },
        "SRJE|10000-100000": 20000,
        "ZCJE|1000-10000": 1000,
        "ZHYE|100-1000": 100,
        "JYHM|1": ["aa银行", "bb银行", "cc银行"],
        "DFSS": function () {
            return Random.city(true)
        },
        "DFZH": function () {
            return Random.id()
        },
        "DFHM": function () {
            return Random.cname()
        },
        "JYYT": function () {

        },
        "GLJE|1000-10000": 1000
    }]
})
Mock.mock('mock/zhaoshang', 'post', {
    "data|10": [
        {
            "SYJE|1000-10000": 1000,
            "is_ZCK|1": [0, 1],
            "JYLSH|1": /\d{7,10}/,
            "JYR": function () {
                return Random.date()
            },
            "JYSJ": function () {
                return Random.time()
            },
            "QXR": function () {
                return Random.date()
            },
            "JYLX": '',
            "JFJE|1000-5000": 2000,
            "DFJE|10000-20000": 10000,
            "YE|100-1000": 100,
            "YT": '',
            "LCSLH|1": /\d{7,10}/,
            "YWMC": '',
            "YWCKH|1": /\d{7,10}/,
            "YWZY": '',
            "QTZY": '',
            "SFFFHM": function () {
                return Random.county(true) + '支行'
            },
            "SFFMC": function () {
                return Random.cname()
            },
            "SFFZH|1": /\d{7,10}/,
            "SFFKHHHH|1": /\d{7,10}/,
            "SFFKHHM": function () {
                return Random.county(true) + '支行'
            },
            "SFHKHHDZ": function () {
                return Random.county(true)
            },
            "SFMZGSZHFHM": function () {
                return Random.county(true) + '分行'
            },
            "MZGSZH|1": /\d{7,10}/,
            "MAGSMC": function () {
                return Random.cname() + "有限公司"
            },
            "XXBZ": '',
            "YFFJXX|1": ["有", "无"],
            "CZBZ": '',
            "KZZY": '',
            "JYFXM|1": /\d{7,10}/,
            "PJH|1": /\d{5,7}/,
            "SWZFDDH|1": /\d{7,10}/,
            "NBBH|1": /\d{5,7}/,
        }
    ]
})
Mock.mock('mock/jianshe', 'post', {
    "data|10": [{
        "SYJE|1000-10000": 1000,
        "is_ZCK|1": [0, 1],
        "JYLSH|1": /\d{7,10}/,
        "JYSJ": function () {
            return Random.time()
        },
        "JFFSE|10000-100000": 20000,
        "DFFSE|1000-10000": 1000,
        "YE|100-1000": 100,
        "BZ|1": ["欧元", "美元", "人民币"],
        "DFHM": function () {
            return Random.cname()
        },
        "DFZH|!": /\d{7,10}/,
        "DFKHJG": '',
        "JZRQ": function () {
            return Random.date()
        },
        "ZY": '',
        'BZ': '',
        'ZHMXH|1': /\d{7,10}/,
        'QYLSH|1': /\d{7,10}/,
        'PZZL': '',
        'PZH|1': /\d{5,7}/
    }]
})
Mock.mock('mock/zhongxin', 'post', {
    "data|10": [{
        "SYJE|1000-10000": 1000,
        "is_ZCK|1": [0, 1],
        'JYRQ': function () {
            return Random.date()
        },
        "JYSJ": function () {
            return Random.time()
        },
        "DFZH|1": /\d{7,10}/,
        "DFZHMC": function () {
            return Random.cname()
        },
        "DFZHKHDMC": function () {
            return Random.county(true) + '支行'
        },
        "JFFSE|10000-100000": 10000,
        "DFFSE|1000-10000": 10000,
        "DFZH|!": /\d{7,10}/,
        "ZHYE|100-1000": 1000,
        "ZY": '',
        'THBS': '',
        'THRQ': function () {
            return Random.date()
        },
        'GYJYH|1': /\d{7,10}/,
        'FY': '',
        "BZ|1": ["欧元", "美元", "人民币"],
        "JYZH|1": /\d{7,10}/,
        "JYZHKHWDMC": function () {
            return Random.county(true) + '支行'
        },
        'DWJSKH|1':/\d{7,10}/
    }]
})
Mock.mock('mock/jilinzhongxin','post',{
    "data|10":[{
        "SYJE|1000-10000": 1000,
        "is_ZCK|1": [0, 1],
        "JYLSH|1": /\d{7,10}/,
        "JYSJ": function () {
            return Random.time()
        },
        "SRJE|10000-100000":10000,
        "ZCJE|1000-10000":1000,
        "ZHYE|100-1000":100,
        "JUHM":function(){
            return Random.county(true)+'支行'
        },
        "DFSS":function(){
            return Random.city(true) 
        },
        "DFZH|1":/\d{7,10}/,
        "DFHM":function(){
            return Random.cname()
        },
        "GLJE|1000-10000":1000
    }]
})