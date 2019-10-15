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
              <el-select v-model="submitForm.podID" placeholder="出发地" style="width: 100%;">
                <el-option
                  v-for="item in pods"
                  :key="item.podID"
                  :label="item.pod"
                  :value="item.podID">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="目的地：" prop="destinationID">
              <el-select v-model="submitForm.destinationID" placeholder="目的地" style="width: 100%;">
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
// 组件
import trafficTabPane from './traffic-tab-pane'
import schedulesTabPane from './schedules-tab-pane'

export default {
  components: {
    trafficTabPane,
    schedulesTabPane
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
    }
  },

  watch: {
    proto: {
      handler(nval){
        this.init()
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
        podID: null,
        destinationID: null
      },
      rules: {
        name: [{ required: true, validator: this.nameValidator, trigger: 'blur' }],
        podID: [{ required: true, validator: this.podIDValidator, trigger: 'blur' }],
        destinationID: [{ required: true, validator: this.destinationIDValidator, trigger: 'blur' }]
      }
    }
  },

  methods: {
    /**
     * @description: 初始化submitForm，剥离交通信息，日程信息，保存基础信息快照 
     */
    init(){
      Object.keys(this.proto).forEach(attr => {
        attr!== 'schedules' 
          && attr!== 'traffic'
            && (this.submitForm[attr]= this.proto[attr]);
      });
      //用于比较是否发生改变的对象
      this.checkProto= this.$deepCopy(this.submitForm);
    },

    /**
     * @description: 表单验证
     * @TODO 提交错误信息，监控是否有数据变化
     * @TODO 如果没有其他操作貌似可以合并成一个方法
     */
    nameValidator(rule, value, callback){
      if(value) return callback();
      return callback(new Error('套餐名不能为空'));
    },
    podIDValidator(rule, value, callback){
      if(value) return callback();
      return callback(new Error('出发地不能为空'));
    }, 
    destinationIDValidator(rule, value, callback){
      if(value) return callback();
      return callback(new Error('目的地不能为空'));
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
      console.log(`changeinfo-package checkHasChange: ${bol}`)
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
      data.traffic= traffic;
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
  }
}
</script>