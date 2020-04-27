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
        <el-button type="info" size="small" @click="leavePage">取消</el-button>
      </div>
    </header>

    <main>
      <el-tabs v-model="vm.currentPackage" type="card" closable
               :before-leave="changeTab"
               :v-loading="vm.actionLock"
               @tab-remove="removeTab">
        <el-tab-pane
          v-for="item in packages"
          :key="item.name"
          :label="item.name"
          :name="item.name">
          <changeinfo-package
            ref="packageRef"
            v-if="vm.currentPackage=== item.name"
            :data-name="item.name"
            :proto="item"
            :pods="pods"
            :destinations="destinations"
            :name-checker="vm.nameChecker">
          </changeinfo-package>
        </el-tab-pane>
      </el-tabs>
    </main>

    <footer>
      <material-list
        ref="materialListRef">
      </material-list>
      <preview-dialog
        ref="previewDialogRef">
      </preview-dialog>
    </footer>

  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import {
    getTeamScheduleDTOList,
    TEAM_TRAFFIC_DTO_GO, TEAM_TRAFFIC_DTO_BACK,
    CODE_PREFIX, CODE_SUFFIX,
    PRODUCT_LIST_ROUTE
  } from './dictionary'
  import changeinfoPackage from './comps/changeinfo-package'
  import materialList from './comps/material-list'
  import previewDialog from './comps/preview-dialog'
  export default {
    components: {
      changeinfoPackage, materialList, previewDialog
    },
    provide: {
      PROVIDE_DAY: 0,
      ERROR_QUEUE: []
    },
    mounted(){
      this.teaminfogetAction();
    },
    watch: {
      'vm.currentPackage': function(){
        let name= this.vm.currentPackage;
        this.vm.nameChecker.splice(0);
        let arr= this.packages.forEach(el => {
          el.name!== name && this.vm.nameChecker.push(el.name);
        });
      },
      materialShowState: function(nval){
        if(!nval) return;
        this.$refs.materialListRef.wakeup(this.materialIdList, this.materialSelectCb);
      },
      previewItem: function(nval){
        if(!nval) return;
        this.$refs.previewDialogRef.wakeup(nval);
      }
    },
    computed: {
      ...mapState({
        materialShowState: (state) => state.changeInfo.materialShowState,
        materialSelectCb: (state) => state.changeInfo.materialSelectCb,
        materialIdList: (state) => state.changeInfo.materialIdList,
        previewItem: (state) => state.changeInfo.previewItem
      })
    },
    data() {
      return {
        vm: {
          actionLock: false,
          currentPackage: null,
          nameChecker: []
        },
        pods: [],
        destinations: [],
        packages: [],
      }
    },
    methods: {
      leavePage(){
        let current= this.getCurrentRef();
        let hasChange= current && current.checkHasChange();
        if(hasChange) return this.$confirm(`当前套餐信息有修改未保存，是否仍要离开?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push(PRODUCT_LIST_ROUTE);
        });
        this.$router.push(PRODUCT_LIST_ROUTE);
      },

      addTab(){
        let current= this.getCurrentRef();
        let hasChange= current && current.checkHasChange();
        let newTab= this.getNewTab();
        if(hasChange){
          this.newTab= newTab;
          return this.$confirm(`当前套餐信息存在修改，是否保存?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            return this.addOrSave();
          }).catch(() => {
            this.vm.currentPackage= null;

            let newTabName= newTab.name;
            this.packages.push(newTab);
            this.newTab= null;
            this.$nextTick(() => {
              this.vm.currentPackage= newTabName;
            })
          });
          return;
        }
        let newTabName= newTab.name;
        this.packages.push(newTab);
        this.newTab= null;
        this.$nextTick(() => {
          this.vm.currentPackage= newTabName;
        })
      },
      getNewTab(){
        let newTabName= this.getNewPackageName();
        return {
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
          codePrefix: "", 
          codeSuffix: "", 
        };
      },
      removeTab(name) {
        let index= this.packages.findIndex(el => el.name=== name);
        let id= this.packages[index].id;
        this.$confirm(`确定要删除[${name}]套餐吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.removeTabAction(id, index);
        }).catch((err) => {
          console.log(err)
          this.$message.info('取消删除');
        });
      },
      changeTab(activeName, oldActiveName){
     
        if(!activeName) return false;
        return new Promise((res, rej) => {
          this.asyncCheckHasChange(activeName, oldActiveName).then(() => {
            return res();
          })
            .catch(() => {
              this.$confirm(`当前套餐信息存在修改，是否保存?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                // this.changeTabAfterAction();
                this.newTab= activeName;
                this.addOrSave();
                return rej();
              }).catch(() => {
                return res();
              });
            })
        })
      },
      asyncCheckHasChange(activeName, oldActiveName){
        let packages= this.$refs.packageRef;
        if(!packages) return Promise.resolve();
        let current= packages.find(el => el.$el.dataset.name=== oldActiveName);
        if(!current) return Promise.resolve();
        let hasChange= current.checkHasChange();
        return hasChange? Promise.reject(): Promise.resolve();
      },

      getNewPackageName(){
        let hit;
        let num= this.packages.length;
        do{
          ++num;
          hit= this.packages.find(el => el.name=== ('未命名套餐'+ num));
        } while (hit && num<= 100);
        return '未命名套餐'+ num;
      },
 
      teaminfogetAction(){
        if(this.vm.actionLock) return this.$message.info('数据保存中，请稍后再试');
        this.vm.actionLock= true;
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
            this.pods.splice(0);
            this.destinations.splice(0);
            this.packages.push(...object.package);
            this.pods.push(...pods);
            this.destinations.push(...destinations);
            this._provided.PROVIDE_DAY= day;
            if(this.packages.length=== 0) return Promise.resolve();
            if(this.newTab && this.newTab.name){
              this.packages.push(this.newTab);
              this.$nextTick(() => {
                this.vm.currentPackage= this.newTab.name;
                this.newTab= null;
              })
              return;
            }
            this.vm.currentPackage= this.newTab || this.packages[0].name;
            this.newTab= null;
            return Promise.resolve();
          }).catch(err => {
            this.$message.error(err);
          }).finally(() => {
            this.vm.actionLock= false;
          })
        })
      },

      addOrSave(){
        this._provided.ERROR_QUEUE.splice(0);
        let current= this.getCurrentRef();
        let hasChange= current && current.checkHasChange();
        if(!hasChange) return this.$message.info('信息无变动');
        let validate= current.validate();
        if(!validate) return this.showValidateError();
        let object= current.getData();
        let isSave= this.isSave();
        if(isSave) return this.saveAction(object);
        return this.addAction(object);
      },
      isSave(){
        let current= this.packages.find(el => el.name=== this.vm.currentPackage);
        return current.id=== 0 || !!current.id;
      },
      getCurrentRef(){
        let packages= this.$refs.packageRef;
        if(!packages || packages.length=== 0) return null;
        let current= packages.find(el => el.$el.dataset.name=== this.vm.currentPackage);
        !current && console.warn('getCurrentRef get none');
        return current;
      },
      addAction(object){
        return new Promise((resolve, reject) => {
          this.$http.post(
            this.GLOBAL.serverSrc + "/team/api/teampackageinsert", { object },
          ).then(res => {
            if(res.data.isSuccess==true){
              this.$message.success("添加成功");
              this.vm.currentPackage= null;
              resolve(this.teaminfogetAction());
            }else{
              this.$message.error("添加失败");
            }
          }).catch(function(error) {
            console.log(error);
          });
        })
      },
      saveAction(object){
        return new Promise((resolve, reject) => {
          this.$http.post(
            this.GLOBAL.serverSrc + "/team/api/teampackagesave", { object },
          ).then(res => {
            if(res.data.isSuccess== true){
              this.$message.success("修改成功");
              this.vm.currentPackage= null;
              resolve(this.teaminfogetAction());
            }else{
              this.$message.error("添加失败");
            }
          }).catch(function(error) {
            console.log(error);
          });
        });
      },
      removeTabAction(id, index){
        let successFunc= (res) => {
          let { isSuccess, result }= res.data;
          if(!isSuccess) return this.$message.error(result.message);
          this.packages.splice(index, 1);
          this.$message.success('删除成功');
          this.$nextTick(() => {
            let current= this.packages.length && this.packages[this.packages.length- 1];
            if(!current) return;
            this.vm.currentPackage= current.name;
          })
        }
        if(!id) return successFunc({ data: { isSuccess: true }});
        this.$http.post(this.GLOBAL.serverSrc + "/team/api/teampackagedelete", {
          id
        })
          .then(successFunc);
      },
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
      }
    }
  }
</script>
