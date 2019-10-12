<style lang="scss" scoped>
.changeinfo[ground="changeinfo"]{
  padding-bottom: 80px;
  header{
    display: flex;
    justify-content: space-between;
    width: 80%;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
}
</style>

<template>
  <div class="changeinfo" ground="changeinfo">
    <header>
      <div>
        <el-button type="primary" size="small" @click="addTab">新增套餐</el-button>
      </div>
      <div>
        <el-button type="primary" size="small" @click="addOrSave">保存</el-button>
        <el-button type="info" size="small">取消</el-button>
      </div>
    </header>
    
    <main>
      <el-tabs v-model="vm.currentPackage" type="card" closable @tab-remove="removeTab">
        <el-tab-pane
          v-for="item in packages"
          :key="item.name"
          :label="item.name"
          :name="item.name"
        >
          <changeinfo-package
            v-if="vm.currentPackage=== item.name"
            :proto="item"
            :pods="pods"
            :destinations="destinations"
          >
          </changeinfo-package> 
        </el-tab-pane>
      </el-tabs>
    </main>
      
  </div>
</template>

<script>
import './tools'
import changeinfoPackage from './comps/changeinfo-package'

export default {
  components: {
    changeinfoPackage
  },

  provide: {
    PROVIDE_DAY: 0,
  },

  data() {
    return {
      vm: {
        currentPackage: null,
      },
      pods: [],
      destinations: [],
      packages: [],
    }
  },

  created(){
    this.teaminfogetAction();
  },

  methods: {
    /**
     * @description: 添加Tab
     */
    addTab(){
      let newTabName= this.getNewPackageName();
      this.packages.push({
        name: newTabName
      });
      this.vm.currentPackage = newTabName;
    },

    /**
     * @description: 移除Tab
     */
    removeTab(targetName, action) {
      if (action === 'add') {
        let newTabName= this.getNewPackageName();
        this.packages.push({
          name: newTabName
        });
        this.vm.currentPackage = newTabName;
      }
      if (action === 'remove') {
        let tabs = this.packages;
        let activeName = this.vm.currentPackage;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        
        this.vm.currentPackage = activeName;
        this.packages = tabs.filter(tab => tab.name !== targetName);
      }
    },

    /**
     * @description: 新增套餐时，生成不重复的新套餐的名字
     */
    getNewPackageName(){
      let hit;
      let num= this.packages.length;
      do{
        ++num;
        hit= this.packages.find(el => el.name=== ('未命名套餐'+ num));
      } while (hit && num<= 100);
      return '未命名套餐'+ num;
    },

    /**
     * @description: 获取初始化信息
     */
    teaminfogetAction(){
      this.$http.post(
        this.GLOBAL.serverSrc + "/team/api/teaminfoget",
        {
          "object": {
            "id": this.$route.query.id,
            "loadPackage": true
          }
        }
      ).then(res => {
        let { isSuccess, object }= res.data;
        let { pods, destinations, day }= object;
        if(!isSuccess) return Promise.reject('初始化失败');
        this.packages.splice(0);
        this.packages.push(...object.package);
        this.pods.push(...pods);
        this.destinations.push(...destinations);
        this._provided.PROVIDE_DAY= day;
        //tab默认指向首页
        if(this.packages.length=== 0) return;
        this.vm.currentPackage= this.packages[0].name;
      }).catch(err => {
        //TODO: 错误日志
        this.$message.error(err);
      })
    },

    /**
     * @description: 保存按钮触发的事件，先判断是保存还是新增
     */
    addOrSave(){
      let isSave= this.isSave();
      if(!isSave) return this.addAction();
      return this.saveAction(); 
    },
    isSave(){
      let current= this.packages.find(el => el.name=== this.vm.currentPackage);
      return current.id=== 0 || !!current.id;
    },
    saveAction(){
      if(!this.checkHasChange()) return this.$message.info('数据未变动');
    }
  }
}
</script>