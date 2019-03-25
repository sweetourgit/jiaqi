<template>
<div>
    <div class="main-container">
    <div class="header">
        <div class="header_add">
          <el-button type="primary" @click="addAlbum = true">添加相册</el-button>
        </div>
        <div class="header_seach">
          <div class="search-input">
            <el-input v-model="searchName" placeholder="目的地\名称"  clearable></el-input>
          </div>
          <div class="search-button">
            <el-button type="primary" icon="el-icon-search" ></el-button>
          </div>
        </div>
    </div>
    <!--左侧导航-->
    <div class="left-tree">
         <el-tree :props="props1" :load="loadNode1" class="treeDemo" lazy @node-click="treeClick" :expand-on-click-node="false" node-key="id" ref="refTree"></el-tree>
    </div>  
    <!-- 图片list -->
    <div v-show="geography == 1" class="address-big">
         <div class="address-img" v-for="img in marterialist" :key="img.name" >
              <div class="marterialist-img" @click="addAlbumImg1(img.name)" >
                   <img style="width:100%;height:100%" :src="img.imgs" alt="">
              </div>
              <!-- 图片介绍 -->
              <div class="introduce">
                   <!-- 图片标签 -->
                   <div class="label">标签</div>
                   <!-- 图片数量 -->
                   <div class="number">{{img.num}}张</div>
              </div>
              <!-- 景点名称 -->
              <div class="address-name">
                  {{img.title}}
              </div>
         </div>    
         <!--分页-->
         <el-pagination class="pagination"
            @size-change="handleSizeChange"
            background
            @current-change="handleCurrentChange"
            :current-page="1"
            :page-sizes="[10, 30, 50, 100]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
         </el-pagination>
         <!--分页end-->
    </div>
    </div>
    <!-- 所有的弹窗 -->
    <!-- 1.添加相册的弹窗 -->
    <el-dialog title="添加相册" :visible.sync="addAlbum" custom-class="city_list" append-to-body width="450px" @close="albumClose">
       <el-form :model="picForm"  ref="picForm" :rules="rules" style="position:relative">
        <el-form-item label="名称:" prop="name" :label-width="formLabelWidth" width="250">
          <el-input v-model="picForm.name" auto-complete="off" placeholder="请输入相册名称" class="w270"></el-input>
        </el-form-item>
        <el-form-item label="类型:" prop="type" :label-width="formLabelWidth">
          <el-select v-model="picForm.type" placeholder="请选择相册类型" class="w270">
            <el-option v-for="item in albumtype" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目的地:" prop="destination" :label-width="formLabelWidth">
          <el-button plain @click="leftTree1 = true" @blur="leftTree1 = false" v-model="picForm.destination" class="w270">{{picForm.destination}}</el-button>
        </el-form-item>
        <!--添加相册目的地-->
        <div class="left-tree1" v-if="leftTree1">
             <el-tree :props="props1" :load="loadNode1" class="treeDemo" lazy @node-click="treeClick" :expand-on-click-node="false" node-key="id" ref="refTree"></el-tree>
        </div> 
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="albumClose">取 消</el-button>
          <el-button type="primary" @click="albumSuccess('picForm')" class="confirm">确 定</el-button>
        </div>
         
    </el-dialog>
















           
   
</div>
 

</template>

<script scoped>
  export default {
    data() {        
      return {       
        // 分页
        pageSize: 10, // 设定默认分页每页显示数 todo 具体看需求
        pageIndex: 1, // 设定当前页数
        total: 100,
        // 风景图        
        marterialist:[{
          name:'1',
          title:'玄冰',
          num:'10',
          imgs:'http://ht.sweetuu.com//PhotoGallery/2015/07/20/763773619351461d9e04e605673d1919.jpg',
        },{
          name:'2',
          title:'冰洞',
          num:'10',
          imgs:'http://ht.sweetuu.com//PhotoGallery/2015/07/20/763773619351461d9e04e605673d1919.jpg',
        },{
          name:'3',
          title:'山洞',
          num:'10',
          imgs:'http://ht.sweetuu.com//PhotoGallery/2015/07/20/763773619351461d9e04e605673d1919.jpg',
        },{
          name:'4',
          title:'潜水',
          num:'10',
          imgs:'http://ht.sweetuu.com//PhotoGallery/2015/07/20/763773619351461d9e04e605673d1919.jpg',
        },{
          name:'5',
          title:'城堡',
          num:'10',
          imgs:'http://ht.sweetuu.com//PhotoGallery/2015/07/20/763773619351461d9e04e605673d1919.jpg',
        },{
          name:'6',
          title:'悬崖',
          num:'10',
          imgs:'http://ht.sweetuu.com//PhotoGallery/2015/07/20/763773619351461d9e04e605673d1919.jpg',
        }],
        searchName:'',
        //添加相册弹窗
        picForm: {
            name: '',
            type: '',
            destination: '请选择目的地',
            destinationId: 0
        },
        // 添加相册隐藏
        formLabelWidth: '100px',
        addAlbum: false,
        rules:{
          name: [
            { required: true, message: '请输入相册名称', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择类型',trigger: 'blur' }
          ],
          destination: [
            { required: true, message: '请选择目的地',trigger: 'blur' }
          ]        
        },
        //左侧菜单
        list:[],
        lists: [], //子级
        props1: {
          label: 'name',
          isLeaf: 'leaf'
        },
        data: '', // 存单击数据
        theContinent: '', // 所属地区id
        node: '', // 获取tree子级数据
        resolve: '', // 获取tree子级方法
        level: '', // 层级数据
        //添加素材弹窗
        albumForm:false,
        albumtype:[],
        leftTree1:false,
        geography:""








        

      }
    },
    created(){
      this.albumtypeget()
    },
    methods: {
      handleSizeChange(val){
        this.pageSize = val;
        this.pageIndex = 1;
      //  this.moduleList();
      },
      handleCurrentChange(val){
        this.pageIndex = val;
      //  this.moduleList();
      },
      // 关闭相册弹窗
      albumClose(){
        this.$refs["picForm"].resetFields();
        this.addAlbum = false;
        },
      // 相册添加成功
      albumSuccess(formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
          

            this.addAlbum = false;
            this.$refs[formName].resetFields();
            this.addMaterial = true;
            this.$message({
            message: '添加相册成功,请为它添加照片吧~',
            type: 'success'
            });
          }
        })
      },
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
      //相册list
      albumPage(){
        this.$http.post('http://192.168.1.186:3024' + '/album/api/page',{
            "pageIndex": this.pageIndex,
            "pageSize": this.pageSize,
            "object": {
              "areaID": this.data.id,
              "isDeleted": 0
            }
          }).then(res => {
            if(res.data.isSuccess == true){
               this.marterialist=res.data.objects;
               this.total=res.data.total;
            }
          }).catch(err => {
            console.log(err)
          })
      },
      //获取
      albumtypeget(){
        this.$http.post('http://192.168.1.186:3024' + '/album/api/albumtypeget').then(res => {
            if(res.data.isSuccess == true){
               this.albumtype=res.data.objects
            }
          }).catch(err => {
            console.log(err)
        })
      }












  
    
    }    
  }
</script>

<style lang="scss" scoped>
.treeDemo{margin:20px}
.w270{width:270px}
.classa{border: 3px solid #0FB99A}
.header{height: 50px}
.header_add{float: left;margin-left:.8%}
.header_seach{float: right;margin-right:1.5%}
.search-input{width: 353px;float: left;margin-right:100px}
.search-button{float: left;margin-left: -78px}
.main-container{width: 100%;padding-bottom: 60px;overflow: auto;max-width:1800px}
.add-button{float: left}
.top{width:100%}
.address-input{float: left;width:350px !important;left:32%}
.top-button{float: left}
.left-tree{float: left;margin-top: 10px;width: 22%;height: 695px;border:1px solid #fff;box-shadow:3px 3px 3px #EDEDED,3px -3px 3px #EDEDED,-3px 3px 3px #EDEDED,-3px -3px 3px #EDEDED;margin-left: 1%;overflow: auto;}
.left-tree1{position:absolute;background-color:#fff;top:175px;width: 265px;height: 400px;border:1px solid #fff;box-shadow:3px 3px 3px #EDEDED,3px -3px 3px #EDEDED,-3px 3px 3px #EDEDED,-3px -3px 3px #EDEDED;left:100px;overflow: auto;z-index:2002}
.address-big{margin-top: 10px;float: left;width: 76%}
.address-img{position: relative;float: left;margin-left:2.5%;width:30%;margin-bottom:42px}
.marterialist-img{width:100%;height:252px;cursor:pointer}
.introduce{width:100%;height:30px;margin-top:16px;font-size:14px}
.label{float:left;width:60px;height:30px;background:#2f96fa;text-align: center;line-height: 30px;color:#fff}
.number{float:left;width:60px;height:30px;line-height: 30px;background:#eee;color:#000;text-align:center}
.address-name{float:left;margin-top:10px;font-size:18px}
.pagination{float: right;margin-right: 68px;margin-top: 10px}
.add-album{margin:0 auto;width:3000px;margin-left:-500px;margin-top:-100px}
.add-address-img{width:1400px;height:800px;margin-left:70px}
.left-img{float:left;width:1000px;height:800px;border:1px solid #fff}
.first-img{width:1000px;height:550px}
.small-img{margin-top:13px;width:280px;height:200px;display:inline-block;margin-right:17px;margin-bottom:30px;cursor:pointer}
.class-a{border:1px solid #0FB99A}
.small-box{position:absolute;width:1000px;height:250px;white-space:nowrap;overflow-x:auto;overflow:scroll;overflow-y:hidden}
.small_img_close{position:absolute;margin-left:61%;top:9.5%;font-size:20px}
.material-small-box{float: left;margin-top:50px;width:1000px;height:500px;overflow-x:auto}
.material-small-img{float:left;margin-bottom:17px;width:300px;height:200px;margin-right:17px}
.right-form{float:right;width:380px}
.album-message{width:380px;height:320px;border:1px solid #E6E6E6;margin-bottom:20px}
.material-message{width:380px;height:350px;border:1px solid #E6E6E6}
.material-message1{width:380px;margin-top:-250px;border:1px solid #E6E6E6}
.album-title{width:150px;height:30px;margin-top:17px;margin-left:20px}
.blue-box{float:left;width:5px;height:30px;background:#3095fa}
.album-text{font-size:20px;margin-top:7px;margin-left:15px !important;line-height:30px}
.album-name{float:left;margin-top:10px;font-size:20px}
.album-form{width:300px;margin-top:60px;margin-left:20px}
.album-button{width:250px;height:50px;margin-left:65px;margin-top:10px}
.material-button{width:250px;height:50px;margin: 0 auto}
/* 上传图片 */
.upload{margin-top:14px;width:400px;border-radius: 20px}
.upload-img{width:50px;height:50px;margin-top:20%}
/* 标签内容框 */
.add-label{width:400px;height:300px}
.label-name{width:370px;height:40px;margin:33px 0px}
.select-label{width:430px;height:100px;overflow: auto;margin-right:20px;overflow-x:auto;margin:25px 0px 60px 0px}
.label-check{float:left;text-align:left;padding-bottom:5px !important;padding-right:25px !important}
.el-checkbox+.el-checkbox{margin-left: 0px}
.clearfix:after{display: block;clear: both;content: "";visibility: hidden;height: 0}
.clearfix{zoom:1}
.confirm{margin:0 140px 0 20px}
</style>
