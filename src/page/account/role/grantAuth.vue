<template>
  <div>
        <el-dialog title="用户授权" custom-class="city_list" :visible.sync="dialogFormAuth" width="1000px" class="abow_dialog" @close="cenclePer">
        <div :style="authDiocss">
          <el-form class="bottom">           
               <div v-for="(menuList,index) in authData">
                 <el-checkbox v-model="menuList.isJur" :label="menuList.id" :key="menuList.id" @change="menuChanged(index)">{{menuList.name}}</el-checkbox>
                 <div class="check-list">
                   <el-checkbox  v-model="actList.isJur" v-for="actList in menuList.act" :label="actList.id" :key="actList.id" @change="actChanged(index)">{{actList.name}}</el-checkbox>
                   <div style="margin-top:5px">
                   <el-checkbox v-model="dataList.isJur" v-for="(dataList,indexD) in menuList.dataJurisdiction" :label="dataList.id" :key="dataList.id" @change="dataChanged(index,indexD)"><span class="data-check">{{dataList.name}}</span></el-checkbox>
                   </div>
                 </div>
               </div>
          </el-form>
          <div class="footer">
              <div slot="footer" class="dialog-footer" style="text-align: center">
                <el-button @click="cenclePer">取消</el-button>
                <el-button type="primary" @click="perSubmit">确 定</el-button>
              </div>
          </div>
        </div> 
      </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    id: 0,
    variable: 0,
    dialogType: 0,
    userType: 0,
  },
  data() {
    return {
       authDiocss: {
　　　　　　height: '',
            overflowY: 'scroll'
　　　 },
       authData: [],
       dialogFormAuth: false,
    }
  },
  watch: {
      variable: function(){        
        if(this.dialogType==1){
          this.getHeight();
          this.getActs(this.id);   
          this.dialogFormAuth=true;    
        }
     }
  },
  methods: {
      cenclePer () {
         this.dialogFormAuth = false;
         this.authData = [];
      },
      menuChanged (index) {
        if(this.authData[index].isJur == false){  //一级未选中 则对应的二级都不选中
            var actArray = this.authData[index].act.length;          
            var datajurArray = this.authData[index].dataJurisdiction.length;                          
            for(let i = 0;i<actArray;i++){
                this.authData[index].act[i].isJur = false;
            }
            for(let i = 0;i<datajurArray;i++){
                this.authData[index].dataJurisdiction[i].isJur = false;      
            }
        }else if(this.authData[index].isJur = true){  //一级选中  则对应的二级都选中
            var actArray = this.authData[index].act.length;
            if(actArray>0){
                for(let i = 0,len = this.authData[index].act.length;i<len;i++){
                    this.authData[index].act[i].isJur = true;
                }
            } 
        }
      },
      actChanged (index) {
        var childrenArray = this.authData[index].act;
        var tickCount = 0,
            len = childrenArray.length
        for(var i = 0; i < len; i++) {
            if(childrenArray[i].isJur == true){
                tickCount++;
            }
        }
        if(tickCount == len){        
            this.authData[index].isJur = true;
        }
      },
      dataChanged (index,indexD) {
         for(let i=0;i<this.authData[index].dataJurisdiction.length;i++){
            if(i!=indexD){
              this.authData[index].dataJurisdiction[i].isJur=false;
            }
         }  
      },
      getHeight () {
        this.authDiocss.height=document.body.clientHeight-200+"px";
      },
      getActs () {
          this.$http.post(this.GLOBAL.serverSrc + '/org/jurisdiction/api/acts',{
                "userID":this.id,
              }).then(res => {              
                this.authData=res.data.objects;           
          })
      },
      perSubmit () {
        if(this.userType==1){
          this.$http.post(this.GLOBAL.serverSrc + '/org/jurisdiction/api/do',{
                 "userID": this.id,
                 "object": this.authData
              }).then(res => {         
                if(res.data.isSuccess == true){
                   this.$message.success('提交成功');
                   this.cenclePer();
                }
          })
        }
      },
    }
}
</script>

<style scoped>
     .data-check{color: #d67121;display: inline-block;border-radius: 5px;padding: 0 5px}
     .abow_dialog {margin:-100px 0 0 0}
     .check-list{margin:10px 0 15px 25px}
     .footer{position: absolute;z-index: 10000;bottom: 30px;width: 900px;background-color: #fff;}
     .authDiocss{position: relative;}
     .bottom{margin-bottom: 80px;}
</style>