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
        <el-button type="info" size="small"
          @click="$router.push('/productList/packageTour')"
        >取消</el-button>
      </div>
    </header>
    
    <main>
      <el-tabs v-model="vm.currentPackage" type="card" closable 
        :before-leave="changeTab"
        @tab-remove="removeTab"
      >
        <el-tab-pane
          v-for="item in packages"
          :key="item.name"
          :label="item.name"
          :name="item.name"
        >
          <changeinfo-package
            ref="packageRef"
            v-if="vm.currentPackage=== item.name"
            :data-name="item.name"
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
import { 
  getTeamScheduleDTOList, 
  TEAM_TRAFFIC_DTO_GO, TEAM_TRAFFIC_DTO_BACK, 
  CODE_PREFIX, CODE_SUFFIX
} from './dictionary'
import changeinfoPackage from './comps/changeinfo-package'

export default {
  components: {
    changeinfoPackage
  },

  provide: {
    // 行程总天数
    PROVIDE_DAY: 0,
    // 校验错误收集队列
    ERROR_QUEUE: []
  },

  data() {
    return {
      vm: {
        currentPackage: null,
        // 当发生需要先保存再新增的情况，这个标志为true, changeTab中赋值
        addAfterSave: false,
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
     * @description: TEAM_TRAFFIC_DTO_BACK会默认给一个天数最大值
     * 目前有两个地方 TrafficFormMixin和这里
     */
    addTab(){
      let newTabName= this.getNewPackageName();
      TEAM_TRAFFIC_DTO_BACK.day= this._provided.PROVIDE_DAY;
      this.packages.push({
        teamID:this.$route.query.id,
        loadPackage: true,
        loadPlan: true,

        name: newTabName,
        
        pod: null,
        podID: null,
        destination: null,
        destinationID: null,
        createTime: new Date().toISOString(),
        traffic: [
          TEAM_TRAFFIC_DTO_GO,
          TEAM_TRAFFIC_DTO_BACK
        ],
        schedules: getTeamScheduleDTOList(
          this._provided.PROVIDE_DAY
        ),
        briefMark: '',
        codePrefix: CODE_PREFIX,
        codeSuffix: CODE_SUFFIX
      });
      this.$nextTick(() => this.changeTab(newTabName, this.vm.currentPackage));
    },

    /**
     * @description: 移除Tab
     */
    removeTab(name) {
      let index= this.packages.findIndex(el => el.name=== name);
      let id= this.packages[index].id;
      this.$confirm(`确定要删除[${name}]套餐吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removeTabAction(id, index);
      })
    },

    changeTab(activeName, oldActiveName){
      // 切换tab前先保存的逻辑
      if(this.vm.addAfterSave){
        this.vm.currentPackage= this.vm.addAfterSave;
        return !!this.vm.addAfterSave;
      }
      let current= this.getPackageRef();
      if(!current) return true;
      let hasChange= current.checkHasChange();
      if(!hasChange) return true;
      // 切换tab前先保存的逻辑
      this.vm.addAfterSave= activeName;
      return new Promise((res, rej) => {
        this.$confirm(`信息已经修改，是否需要保存?`, '保存提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.addOrSave()
          // 需要保存
          res(false);
        }).catch(() => {
          this.vm.currentPackage= activeName;
          // 放弃保存
          rej(true);
        });
      })
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
    teaminfogetAction(refresh){
      return new Promise((resolve, reject) => {
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
          this.pods.splice(0);
          this.pods.push(...pods);
          this.destinations.splice(0);
          this.destinations.push(...destinations);
          this._provided.PROVIDE_DAY= day;
          this.proto= object;
          this.vm.currentPackage= this.packages[0].name;

          // 只有addAfterSave时是先保存再创建，有refresh的情况是addAction和saveAction后刷新
          this.vm.addAfterSave && this.$nextTick(() => {
            this.vm.currentPackage= null;
            this.$nextTick(() => {
              !refresh && this.addTab();
              this.vm.addAfterSave= false;
            })
          })
          resolve();
        }).catch(err => {
          //TODO: 错误日志
          this.$message.error(err);
          reject();
        })
      })
    },

    /**
     * @description: 保存按钮触发的事件，先判断是保存还是新增
     */
    addOrSave(){
      let current= this.getPackageRef();
      let hasChange= current.checkHasChange();
      if(!hasChange) return Promise.reject(this.$message.info('信息无变动'));
      let validate= current.validate();
      if(!validate) return Promise.reject(this.showValidateError());
      let object= current.getData();

      let isSave= this.isSave();
      if(!isSave) return this.addAction(object);
      return this.saveAction(object); 
    },
    // 获取当前套餐实例
    getPackageRef(){
      let packages= this.$refs.packageRef;
      if(!packages || packages.length=== 0) return;
      let current= packages.find(el => el.$el.dataset.name=== this.vm.currentPackage);
      return current;
    },
    isSave(){
      let current= this.packages.find(el => el.name=== this.vm.currentPackage);
      return current.id=== 0 || !!current.id;
    },

    /**
     * @description: 添加删除都返回Promise，且回调中刷新数据
     */
    addAction(object){
      return new Promise((resolve, reject) => {
        this.$http.post(
          this.GLOBAL.serverSrc + "/team/api/teampackageinsert", { object },
        ).then(res => {
          let { result, isSuccess }= res.data;
          if(isSuccess==true){
            this.$message.success("添加成功");
            this.vm.addAfterSave= object.name;
            resolve(this.teaminfogetAction(true));
          }else{
            this.$message.error("添加失败");
            reject();
          }
        }).catch(function(error) {
          console.log(error);
          reject();
        });
      })
    },
    saveAction(object){
      return new Promise((resolve, reject) => {
        this.$http.post(
          this.GLOBAL.serverSrc + "/team/api/teampackagesave", { object },
        ).then(res => {
          if(res.data.isSuccess==true){
            this.$message.success("修改成功");
            this.vm.addAfterSave= object.name;
            resolve(this.teaminfogetAction(true));
          }else{
            this.$message.error("添加失败");
            reject();
          }
        }).catch(function(error) {
          console.log(error);
          reject();
        });
      })
    },
    removeTabAction(id, index){
      let successFunc= () => {
        this.packages.splice(index, 1);
        this.$message.success('删除成功');
        this.$nextTick(() => {
          let current= this.packages.length && this.packages[this.packages.length- 1];
          if(!current) return;
          this.vm.currentPackage= current.name;
        })
      }
      // 删除的是尚未存入数据库的
      if(!id) {
        return successFunc();
      }
      this.$http.post(this.GLOBAL.serverSrc + "/team/api/teampackagedelete", {
        id
      }).then(successFunc);
    },

    /**
     * @description: 显示表单验证信息队列
     */
    showValidateError(){
      let ERROR_QUEUE= this._provided.ERROR_QUEUE;
      const h = this.$createElement;
      let errors= ERROR_QUEUE[0] && ERROR_QUEUE[0].msgs.map(error => h('div', null, error))
      this.$msgbox({
        title: '表单验证结果',
        message: h('p', null, errors),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).finally(() => {
        ERROR_QUEUE.splice(0);
      })
    },
  }
}
</script>