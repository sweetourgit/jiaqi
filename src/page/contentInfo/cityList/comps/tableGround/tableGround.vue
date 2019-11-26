<style lang="scss" scoped>
.table-ground{
  width: 100%;
  padding-left: 20px;
  &>header{
    display: flex;
    justify-content: space-between;
  }
  &>main{
    box-sizing: border-box;
    padding-top: 10px;
    min-height: 508px;
  }
}
</style>

<template>
  <div class="table-ground">
    <header>
      <el-row>
        <el-col style="width: 100px; line-height: 32px; font-size: 14px; text-align: center;">
          <span>输入关键字：</span>
        </el-col>
        <el-col style="width: 300px;">
          <el-input size="small" placeholder="请输入关键字"></el-input>
        </el-col>
        <el-col style="width: 60px; margin-left: 10px;">
          <el-button type="primary" size="small">搜索</el-button>
        </el-col>
      </el-row>
      <el-button type="primary" size="small" 
        v-if="belong"
        @click="wakeupAddForm"
      >添加</el-button>
    </header>
    <main>
      <el-table style="width: 100%" border
        :data="tableData" 
        :header-cell-style="getRowClassFunc"
        :header-row-style="{ height: '58px', color: '#555555' }"
        :cell-style="{ padding: 0, height: '44px' }"
        :highlight-current-row="false">
        <el-table-column align="center" width="60px" prop="id" label="ID" ></el-table-column>

        <el-table-column align="center" label="名称">
          <template slot-scope="scope">
            <el-button type="text"
              v-if="scope.row.isLeaf == 2"
              @click="$emit('node-click', scope.row)" 
            >{{ scope.row.areaName }}</el-button>
            <span type="text"
              v-else
            >{{ scope.row.areaName }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center"
          :label="belong"
        >
          <template slot-scope="scope">{{ scope.row.parent.areaName }}</template>
        </el-table-column>

        <el-table-column prop="englishName" label="英文名" align="center"></el-table-column>

        <el-table-column prop="chineseFull" label="中文全拼" align="center"></el-table-column>

        <el-table-column prop="firstChar" label="首字母" align="center" width="70px"></el-table-column>

        <el-table-column prop="initial" label="首拼" align="center"></el-table-column>

        <el-table-column prop="areaCode" label="代码" align="center" width="80px"></el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="wakeupEditForm(scope.row)">编辑</el-button>
            <el-button size="small" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <footer>
      <div style="display: flex; justify-content: center; padding-top: 20px;">
        <el-pagination background
          :current-page.sync="pageInfo.pageNo"
          :page-sizes="[2, 4, 8, 10]"
          :page-size="pageInfo.pageSize"
          :total="pageInfo.total"
          @current-change="pageActionHandler"
          @prev-click="pageActionHandler"
          @next-click="pageActionHandler"
          @size-change="sizeChangeFunc"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </footer>  
  </div>
</template>

<script>
import { getSonListAction } from '../../api'

// 获取分页对象
const getPageInfo= function () {
  return { pageNo: 1, pageSize: 10, total: 0 }
}
export default {

  beforeDestroy(){
    this.cache= null;
  },

  data(){
    return Object.assign(
      //视图
      {
        belong: null,
      },
      // 分页数据
      {
        pageInfo: getPageInfo(),
      },
      // 数据
      {
        tableData: [],
      }
    )
  },

  methods: {
    
    init(nodeProto){
      // 重置分页信息
      Object.assign(this.pageInfo, getPageInfo());
      // 清空缓存
      this.cache= nodeProto;
      this.initAction(nodeProto);
    },

    refresh(parent){
      parent.inited= false;
      this.initAction(parent);
    },

    // 判断是否可以走缓存
    initAction(nodeProto){
      new Promise((resolve, reject) => {
        nodeProto= nodeProto || this.cache;
        let { id, children, inited }= nodeProto;
        if(inited) return resolve(this.getSonListFromCache());
        resolve(this.getSonListAction(nodeProto));
      })
      .then(res => {
        this.tableData.splice(0);
        let { objects, total }= res;
        if(!total) return;
        this.tableData.push(...this.makeStandardProto(nodeProto, objects));
        this.pageInfo.total= total;
        this.belong= this.computedBelong(nodeProto);
      })
    },

    // 从缓存中以分页方式读取
    getSonListFromCache(){
      let list= this.cache.children;
      let { pageNo, pageSize }= this.pageInfo;
      return {
        objects: list.slice((pageNo- 1)* pageSize, (pageNo- 1)* pageSize+ pageSize),
        total: list.length
      }
    },

    getSonListAction(){
      if(this.cache.inited) return Promise.resolve(this.getSonListFromCache());
      let { id }= this.cache;
      let { pageNo, pageSize }= this.pageInfo;
      return getSonListAction({ parentID: id }, pageNo, pageSize)
    },

    getRowClassFunc({ row, column, rowIndex, columnIndex }){
      if (rowIndex == 0) return 'background:#F7F7F7'
    },

    makeStandardProto(parent, arr){
      return arr.map(el => {
        if(el.standard) return el;
        el.children? el.children.splice(0): el.children= [];
        el.inited= false; // 是否已在tree中初始化
        el.standard= true; // 是否已标准化
        el.parent= parent;
        el.level= parent? parent.level+ 1: 1;
        return el;
      })
    },

    computedBelong(nodeProto){
      let { level }= nodeProto;
      switch (level) {
        case 1: return '所属大洲'; break;
        case 2: return '所属国家'; break;
        case 3: return '所属地区'; break;
        default: return '所属地区'; break;
      }
    },

    sizeChangeFunc(num){
      this.pageInfo.pageSize= num;
      this.pageActionHandler();
    },

    pageActionHandler(){
      this.$nextTick(() => {
        this.initAction()
      })
    },

    wakeupAddForm(){
      this.$emit('wakeup-add-form', this.cache);
    },
    
    wakeupEditForm(data){
      this.$emit('wakeup-edit-form', data);
    }
  }

}
</script>