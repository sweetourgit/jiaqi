<template>
<div>
    <div class="main-container">
      <!--左侧导航-->
      <div class="left-tree">
           <el-tree :props="props1" :load="loadNode1" class="treeDemo" lazy @node-click="treeClick" :expand-on-click-node="false" node-key="id" ref="refTree"></el-tree>
      </div> 
      <!--右侧数据--> 
      <div style="float:left; margin:0 0 0 30px;">
        <div class="check" v-for="item in file">
          <div class="checkTitle">
            <i class="el-icon-caret-right" style="color:#F38F00;"></i>
            <span>{{item.name}}</span>
          </div>
          <el-checkbox v-for="item in item.fileList" style="margin:0 30px 0 0;" :key="item.value">{{item.content}}</el-checkbox>
        </div>
      </div>
    </div>















           
   
</div>
 

</template>

<script scoped>
  export default {
    data() {        
      return {   
        //左侧菜单
        props1: {
          label: 'name',
          isLeaf: 'leaf'
        },
        data: '', // 存单击数据
        theContinent: '', // 所属地区id
        node: '', // 获取tree子级数据
        resolve: '', // 获取tree子级方法
        level: '', // 层级数据
        //右侧数据
        file: [//右侧checkbox循环数据
                {
                  name: "账户管理",
                  fileList: [
                      {content: "用户列表" },
                      {content: "组织列表" },
                      {content: "职位列表" },
                      {content: "角色列表" },
                      {content: "用户列表" },
                      {content: "用户列表" },
                      {content: "组织列表" },
                      {content: "职位列表" },
                      {content: "角色列表" },
                      {content: "用户列表" },
                      {content: "用户列表" },
                      {content: "组织列表" },
                      {content: "职位列表" },
                      {content: "角色列表" },
                      {content: "用户列表" },
                      {content: "用户列表" },
                      {content: "组织列表" },
                      {content: "职位列表" },
                      {content: "角色列表" },
                      {content: "用户列表" },
                  ]
                }
              ],







        

      }
    },
    methods: {
      loadNode1(node, resolve) {
        this.node = node.data
        this.resolve = resolve
        this.level = node.level
        /*添加第一级*/
        if (node.level === 0) {
          this.list=[];
          this.$http.post(this.GLOBAL.serverSrc + "/universal/area/api/areainforlist",{
              "object": {
                "parentID": -1,
              }
            }).then(obj => {
              for (let i = 0; i < obj.data.objects.length; i++) {
                this.list.push({
                  name:obj.data.objects[i].areaName,
                  key: i,
                  id: obj.data.objects[i].id,
                  isLeaf: obj.data.objects[i].isLeaf, // 是否是末级
                  Hierarchy: 0 // 层级
                })
              }
              resolve(this.list);
            }).catch(obj => {
              console.log(obj)
            })
        }
        if (node.level >= 1) {
          this.getSon(
            node.data.key,
            node.data.label,
            node.data.id,
            node.data.isLeaf,
            resolve,
            node.level
          );
        }
      },
      /*获取子集的方法*/
      getSon(key, label, id, isLeaf, resolve, level){
        this.$http.post(this.GLOBAL.serverSrc + "/universal/area/api/areainforlist",
          {
            "object": {
              "parentID": id,
            }
          }).then(res => {
          this.lists = []
          if (res.data.isSuccess == true) {
            for (var i = 0; i < res.data.objects.length; i++) {
              if (res.data.objects[i].isDeleted == 0) {
                if (res.data.objects[i].isLeaf == 2) {
                  this.lists.push({
                    name:res.data.objects[i].areaName,
                    key: i,
                    id: res.data.objects[i].id,
                    isLeaf: res.data.objects[i].isLeaf,
                    leaf: false,
                    Hierarchy: level
                  })
                } else {
                  this.lists.push({
                    name:res.data.objects[i].areaName,
                    key: i,
                    id: res.data.objects[i].id,
                    isLeaf: res.data.objects[i].isLeaf,
                    leaf: true,
                    Hierarchy: level
                  })
                }
              }
            }
          }
          setTimeout(() => {
            resolve(this.lists);
          }, 200);
        }).catch(error => {
          console.log(error);
        });
      },
      // 单击tree节点
      treeClick(data,node){     
        this.data = data;
        if (data.isLeaf == 1) {
          if(this.addAlbum==false){
          this.geography = 1;
          this.albumPage();
        }else{
          this.picForm.destination=this.data.name;
          this.picForm.destinationId=this.data.id;
          this.leftTree1=false; 
         }
        }
      },













  
    
    }    
  }
</script>

<style lang="scss" scoped>
/*左侧tree样式*/
.treeDemo{margin:20px}
.main-container{width: 100%;padding-bottom: 60px;overflow: auto;max-width:1800px}
.left-tree{float: left;margin-top: 10px;width: 260px;height: 695px;border:1px solid #fff;box-shadow:3px 3px 3px #EDEDED,3px -3px 3px #EDEDED,-3px 3px 3px #EDEDED,-3px -3px 3px #EDEDED;margin-left: 1%;overflow: auto;}
/*右侧多选框样式*/
.check{line-height: 40px; width: 800px;}
.checkTitle{font-size: 12pt; font-weight: bold;}
.el-checkbox.el-checkbox { margin-left: 0 !important; margin-right: 30px !important;}
</style>
