<style lang="scss" scoped>
.changeinfo-package{
  header{
    padding: 20px 0;
  }
}
</style>

<template>
  <div class="changeinfo-package">
    <header>
      <el-form
        label-width="120px" 
        ref="submitForm"
        :model="submitForm"
        :rules="rules"
      >
        <el-row>

          <el-col :span="6">
            <el-form-item label="套餐名：" label-width="90px" prop="name">
              <el-input
                style="width: 100%;"
                v-model="submitForm.name"
                placeholder="请输入套餐名称"
                maxlength="10"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="出发地：" prop="podID">
              <el-select v-model="submitForm.podID" placeholder="出发地" style="width: 100%;"
                @change="podChange"
              >
                <el-option
                  v-for="item in pods"
                  :key="item.podID"
                  :label="item.pod"
                  :value="item.podID">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="目的地：" prop="destinationID">
              <el-select v-model="submitForm.destinationID" placeholder="目的地" style="width: 100%;"
                @change="destinationChange"
              >
                <el-option
                  v-for="item in destinations"
                  :key="item.destinationID"
                  :label="item.destination"
                  :value="item.destinationID">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          
        </el-row>

        <el-row v-show="false">
          <el-input v-model="submitForm.pod"></el-input>
          <el-input v-model="submitForm.destination"></el-input>
        </el-row>
      </el-form>
    </header>
    <main>
      <el-tabs v-model="vm.current" type="card">
        <el-tab-pane label="交通信息" name="traffic">
          <traffic-tab-pane
            ref="traffic"
            :proto="proto.traffic"
            :brief-mark="proto.briefMark"
          ></traffic-tab-pane>
        </el-tab-pane>
        <!-- <el-tab-pane label="酒店信息" name="second">酒店信息</el-tab-pane> -->
        <el-tab-pane label="日程信息" name="schedules">
          <schedules-tab-pane
            ref="schedules"
            :proto="proto.schedules"
          ></schedules-tab-pane>
        </el-tab-pane>
      </el-tabs>
    </main>
  </div>
</template>

<script>
import { TEAM_TRAFFIC_DTO_GO, TEAM_TRAFFIC_DTO_BACK } from '../dictionary'
import ErrorHandlerMixin from './traffic-tab-pane/comps/mixins/ErrorHandlerMixin'
// 组件
import trafficTabPane from './traffic-tab-pane'
import schedulesTabPane from './schedules-tab-pane'

export default {
  components: {
    trafficTabPane,
    schedulesTabPane
  },

  mixins: [ErrorHandlerMixin],

  provide: {
    PROVIDE_PACKAGE_ID: null,
  },

  props: {
    //package
    proto: {
      type: Object
    },
    pods: {
      type: Array
    },
    destinations: {
      type: Array
    },
    nameChecker: {
      type: Array
    }
  },

  watch: {
    proto: {
      handler(nval){
        this.$nextTick(() => {
          this.init()
        })
      },
      immediate: true
    }
  },

  data(){
    return {
      vm: {
        current: 'traffic',
      },
      submitForm: {
        name: null,
        pod: '',
        podID: null,
        destination: '',
        destinationID: null
      },
      rules: {
        name: [{ required: true, validator: this.nameValidator, trigger: 'blur' }],
        podID: [{ required: true, validator: this.simpleValidator, message: '出发地不能为空', trigger: 'blur' }],
        destinationID: [{ required: true, validator: this.simpleValidator, message: '目的地不能为空', trigger: 'blur' }]
      }
    }
  },

  methods: {
    /**
     * @description: 初始化submitForm，剥离交通信息，日程信息，保存基础信息快照
     * @bug 127: 产品修改出发地和目的地后，套餐的出发地和目的地不存在在新数据中
     */
    init(){
      Object.keys(this.proto).forEach(attr => {
        attr!== 'schedules' 
          && attr!== 'traffic'
            && (this.submitForm[attr]= this.proto[attr]);
      });
      // bug 127: 这里记录原始数据
      this.checkProto= this.$deepCopy(this.submitForm);
      this.checkIfLoseInfo();
      this._provided.PROVIDE_PACKAGE_ID= this.proto.id;
    },

    // bug 127:检查套餐目的地和出发地是否还在产品的池子中
    checkIfLoseInfo(){
      let { podID, destinationID }= this.submitForm;
      // 判断是否是新增套餐
      if(!podID && !destinationID) return;
      let podLose= !this.pods.find(pod => pod.podID=== podID);
      let desLose= !this.destinations.find(destination => destination.destinationID=== destinationID);
      if(podLose){
        this.submitForm.pod= null;
        this.submitForm.podID= null;
      }
      if(desLose){
        this.submitForm.destination= null;
        this.submitForm.destinationID= null;
      }
      if(podLose || desLose) return this.$message.info(
        `套餐${podLose?'出发地': ''}${desLose?'目的地': ''}失效，请重新选择`
      );
    },

    /**
     * @description: 表单验证
     * @TODO 提交错误信息，监控是否有数据变化
     * @TODO 如果没有其他操作貌似可以合并成一个方法
     */
    nameValidator(rule, value, callback){
      if(!value) return callback(this.makeErrorQueueMsg('套餐名不能为空'));
      if(this.nameChecker.includes(value)) return callback(this.makeErrorQueueMsg('套餐名已存在'));
      return callback();
    },

    /**
     * @description: 检查是否有数据变动
     */
    checkHasChange(){
      let bol= false;
      //检查基础信息
      bol= !this.$checkLooseEqual(this.submitForm, this.checkProto);
      //检查交通信息，如果基础信息中存在变动，则中断接下来的检查，提高性能，这递归大对象伤不起啊
      !bol && (bol= this.$refs.traffic.checkHasChange());
      !bol && (bol= this.$refs.schedules.checkHasChange());
      bol && console.warn(`changeinfo-package checkHasChange: ${bol}`)
      return bol;
    },

    /**
     * @description: 获取数据
     */
    getData(){
      let hasChange= this.checkHasChange();
      if(!hasChange) return this.$message.info('无数据变动');
      let { traffic, briefMark }= this.$refs.traffic.getData();
      let schedules= this.$refs.schedules.getData();
      let data= this.$deepCopy(this.submitForm);
      // 保存互斥，简要则清空详细，详细则清空简要
      data.traffic= briefMark? [
        TEAM_TRAFFIC_DTO_GO, TEAM_TRAFFIC_DTO_BACK
      ]: traffic;
      data.briefMark= briefMark;
      data.schedules= schedules;
      return data;
    },

    validate(){
      let bol= true;
      this.$refs.submitForm.validate(validate => {
        bol= validate;
      });
      bol && (bol= this.$refs.traffic.validate());
      bol && (bol= this.$refs.schedules.validate());
      return bol;
    },

    /**
     * @description: 下拉选择联动赋值
     */
    podChange(nval){
      let hit= this.pods.find(el => el.podID=== nval);
      this.submitForm.pod= hit.pod;
    },
    destinationChange(nval){
      let hit= this.destinations.find(el => el.destinationID=== nval);
      this.submitForm.destination= hit.destination;
    }
  }
}
</script>