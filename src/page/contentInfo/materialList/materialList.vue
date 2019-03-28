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
         <div class="address-img" v-for="img in albumList">
              <div class="marterialist-img" @click="getAlbum(img.id)">
                   <img width="100%" height="100%" :src="img.pictures[0].url" v-if="img.pictures.length" />
                   <img width="100%" height="100%" :src="null" v-else />
              </div>
              <!-- 图片介绍 -->
              <div class="introduce">
                   <div v-for="item in albumtype">
                      <div class="label" v-if="img.albumType==item.id">{{item.name}}</div>
                   </div>                  
                   <!-- 图片数量 -->
                   <div class="number">{{img.pictures.length}}张</div>
              </div>
              <!-- 景点名称 -->
              <div class="address-name">
                  {{img.name}}
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
       <el-form :model="picForm"  ref="picForm" :rules="rules">
        <el-form-item label="名称:" prop="name" :label-width="formLabelWidth" width="250">
          <el-input v-model="picForm.name" auto-complete="off" placeholder="请输入相册名称" class="w270 tl"></el-input>
        </el-form-item>
        <el-form-item label="类型:" prop="type" :label-width="formLabelWidth">
          <el-select v-model="picForm.type" placeholder="请选择相册类型" class="w270">
            <el-option :key="item.id" v-for="item in albumtype" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目的地:" prop="destination" :label-width="formLabelWidth">
          <el-button plain @click="leftTree1 = leftTree1 == true?false:true" class="w270">{{picForm.destination}}</el-button>
        </el-form-item>
        <!--添加相册目的地-->
        <div class="left-tree1" v-if="leftTree1">
             <el-tree :props="props1" :load="loadNode1" class="treeDemo" lazy @node-click="treeClick" :expand-on-click-node="false" node-key="id" ref="refTree"></el-tree>
        </div> 
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="albumClose">取 消</el-button>
          <el-button type="primary" @click="albumInsert('picForm')" class="confirm">确 定</el-button>
        </div>        
    </el-dialog>

    <!-- 2.单个相册详情的弹窗 -->
    <el-dialog title="添加照片" :visible.sync="getAlbumForm" custom-class="city_list" :append-to-body="true" width="1220px" @close="albumInfoClose" class="clearfix">  
      <div class="add-address-img">
        <div class="left-img">
          <!--图片轮播-->
          <div class="swiper-container">
              <div class="swiper-wrapper">
                  <div class="swiper-slide"><img height="100%" width="100%" src="http://ht.sweetuu.com//PhotoGallery/2017/03/16/f603be7a53174dea94318dfbdd2dfdfd.jpg" alt=""></div>
                  <div class="swiper-slide"><img height="100%" width="100%" src="http://ht.sweetuu.com//PhotoGallery/2017/03/16/f603be7a53174dea94318dfbdd2dfdfd.jpg" alt=""></div>
                  <div class="swiper-slide"><img height="100%" width="100%" src="http://ht.sweetuu.com//PhotoGallery/2017/03/16/f603be7a53174dea94318dfbdd2dfdfd.jpg" alt=""></div>
                  <div class="swiper-slide"><img height="100%" width="100%" src="http://ht.sweetuu.com//PhotoGallery/2017/03/16/f603be7a53174dea94318dfbdd2dfdfd.jpg" alt=""></div>
              </div>
              <!-- 如果需要分页器 -->
              <div class="swiper-pagination"></div>
              
              <!-- 如果需要导航按钮 -->
              <div class="swiper-button-prev"></div>
              <div class="swiper-button-next"></div>

          </div>
          <!---->
        </div>
         <div class="right-form">
           <div class="album-message">
             <!-- 表格头部 -->
            <div class="album-title">
              <div class="blue-box"></div>
              <div class="album-text">相册信息</div>
            </div>
            <div class="album-form">
                <el-form :model="albumInfo"  ref="albumForm" label-width="100px" >
                  <div class="album-name1">
                    名称：<el-input v-model="albumInfo.name" placeholder="请输入素材名称" :disabled="albumDisabled"></el-input>
                  </div>
                  <el-form-item label="类型：" style="margin-top:20px">
                    <el-select  v-model="albumInfo.albumType">
                      <el-option :key="item.id" v-for="item in albumtype" :label="item.name" :value="item.id" :disabled="albumDisabled"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="目的地：">
                    <el-button plain @click="leftTree2 = leftTree2 == true?false:true" class="w200 tl" :disabled="albumDisabled">{{albumInfo.areaID}}</el-button>
                  </el-form-item>
                  <!--修改相册目的地-->
                  <div class="left-tree2" v-if="leftTree2">
                       <el-tree :props="props1" :load="loadNode1" class="treeDemo" lazy @node-click="treeClick" :expand-on-click-node="false" node-key="id" ref="refTree"></el-tree>
                  </div>
              </el-form>
              <div class="album-button">              
                <el-button type="primary" @click="createPic">创建素材</el-button>
                <el-button type="primary" @click="saveAlbum">{{saveAlbumBut}}</el-button>
              </div>
            </div>       
           </div>
           <div class="material-message">
             <div class="album-title">
                <div class="blue-box"></div>
                <div class="album-text">素材信息</div>
             </div>
             <div class="album-form">
                <div class="album-name1">
                    名称：<el-input v-model="albumInfo.name" placeholder="请输入素材名称"></el-input>
                </div>
                <div class="album-info">
                  <div class="size">尺寸：<!--{{albumInfo.pictures[0].width}}*{{albumInfo.pictures[0].height}}--></div>
                  <div class="size">大小：<!--{{albumInfo.length}}--></div>
                </div>       
            </div>
           </div>
        </div> 
      </div> 
    </el-dialog>
   
    <!-- 3.添加素材弹窗 -->
    <el-dialog title="添加照片" :visible.sync="getPictureForm" custom-class="city_list" :append-to-body="true" width="1350px" @close="pictureFormClose" class="clearfix">  
      <div class="add-address-imgpic">
        <div class="left-imgpic">
          <!--图片上传-->
          <div class="upload">
              <el-upload
                class="upload-demo"
                ref="upload"
                drag
                :file-list="fileList"
                action="http://192.168.1.186:3009/upload/api/picture"
                multiple
                list-type="picture"
                :on-error="handleError"
                :on-success="handleSuccess"
                :on-remove="handleRemove"
                :on-preview="handlePreview">

                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
          </div>
         </div>
         <div class="right-form1">
             <div class="album-title">
                <div class="blue-box"></div>
                <div class="album-text">素材信息</div>
             </div>
             <div class="album-form">
                <div class="album-name1">
                    名称：<el-input placeholder="请输入素材名称"></el-input>
                </div>
                <div class="album-info">
                  <div>
                      <p class="per-title">权限：</p>
                      <el-checkbox-group v-model="checkedCompany" class="company-list">
                        <el-checkbox v-for="item in companyList" :label="item" :key="item.id" checked @change="handleCompanyChange">{{item.name}}</el-checkbox>
                      </el-checkbox-group>
                  </div>
                  <div class="size">尺寸：<!--{{albumInfo.pictures[0].width}}*{{albumInfo.pictures[0].height}}--></div>
                  <div class="size">大小：<!--{{albumInfo.length}}--></div>
                </div>     
                <div class="uploadBut">
                   <el-button @click="">取消</el-button>  
                   <el-button type="primary" @click="submitUpload">添加素材</el-button> 
                </div> 
            </div>
        </div> 
      </div> 
    </el-dialog>












           
   
</div>
 

</template>

<script scoped>
  import Swiper from "swiper"
  import 'swiper/dist/css/swiper.min.css';
  export default {
    data() {        
      return {       
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
        // 分页
        pageSize: 10, // 设定默认分页每页显示数 todo 具体看需求
        pageIndex: 1, // 设定当前页数
        total: 0,
        albumList:[],//相册list
        //搜索
        searchName:'',
        //添加相册弹窗
        picForm: {
            name: '',
            type: '',
            destination: '请选择目的地',
            destinationId: 0
        },
        formLabelWidth: '100px',
        addAlbum: false,
        leftTree1:false,
        //景点类型
        albumtype:[],
        geography:"", //控制右侧相册列表隐藏
        //单个相册弹窗
        getAlbumForm:true,
        albumInfo:{},
        leftTree2:false,
        albumId:0,
        albumDisabled:true,
        saveAlbumBut:"修改属性",
        //素材照片弹窗
        getPictureForm:false,
        fileList:[],//上传的图片集合
        pictureList:[],
        pictureInfo:{},
        companyList:[],
        checkedCompany: [],


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
        }
      }
    },
    created(){
      this.albumtypeget();
      this.getAlbum(4);//测试
    },
    mounted(){
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
      //获取景点类型
      albumtypeget(){
        this.$http.post('http://192.168.1.186:3024' + '/album/api/albumtypeget').then(res => {
            if(res.data.isSuccess == true){
               this.albumtype=res.data.objects
            }
          }).catch(err => {
            console.log(err)
        })
      },
      // 关闭相册弹窗
      albumClose(){
        this.$refs["picForm"].resetFields();
        this.addAlbum = false;
        this.leftTree1=false; 
        },
      // 相册添加成功
      albumInsert(formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$http.post('http://192.168.1.186:3024' + '/album/api/insert',{
              "object": {
                "id": 0,
                "name": this.picForm.name,
                "areaID": this.picForm.destinationId,
                "albumType": this.picForm.type,
                "createUser": sessionStorage.getItem('id')
              }
            }).then(res => {
              if(res.data.isSuccess == true){
                  this.addAlbum = false;
                  this.$refs[formName].resetFields();
                  this.$message({
                  message: '添加相册成功,请为它添加照片吧~',
                  type: 'success'
                  });
                  this.albumPage();
                }
              }).catch(err => {
                console.log(err)
            })           
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
                  this.lists.push({
                    name:res.data.objects[i].areaName,
                    key: i,
                    id: res.data.objects[i].id,
                    isLeaf: res.data.objects[i].isLeaf,
                    leaf: res.data.objects[i].isLeaf == 2?false:true,
                    Hierarchy: level
                  })
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
          if(this.addAlbum == true){
              this.picForm.destination=this.data.name;
              this.picForm.destinationId=this.data.id;
              this.leftTree1=false;             
          }else if(this.getAlbumForm == true){
             // this.albumInfo.name=this.data.name;
              this.albumInfo.areaID=this.data.id;
              this.leftTree2=false;
          }else{
              this.geography = 1;
              this.albumPage();
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
               this.albumList=res.data.objects;
               this.total=res.data.total;
            }else{
               this.albumList=[];
               this.total=0;
            }
          }).catch(err => {
            console.log(err)
          })
      },
      //获取一个相册信息
      getAlbum(id){       
        this.$http.post('http://192.168.1.186:3024' + '/album/api/get',{
            "id": id,
          }).then(res => {
            if(res.data.isSuccess == true){
               this.albumInfo = res.data.object;
               this.pictureList = res.data.object.pictures;
               this.pictureInfo = res.data.object.pictures[0];
               this.albumId = id;
               this.getAlbumForm = true;
               setTimeout(()=>{
                this.mySwiper()
               },100)

            }
          }).catch(err => {
            console.log(err)
          })
      },
      saveAlbum(){
        if(this.albumDisabled){
          this.albumDisabled=false;
          this.saveAlbumBut="保存属性";
        }else{
          this.albumDisabled=true;
          this.saveAlbumBut="修改属性";
        }        
      },
      albumInfoClose(){
        this.getAlbumForm = false;
        this.leftTree2=false; 
      },
      mySwiper(){
          var mySwiper = new Swiper ('.swiper-container', {
          loop: true,
          observer:true,
          observeParents:true,
          // 如果需要分页器
          pagination: '.swiper-pagination',
          paginationClickable: true,
          
          // 如果需要前进后退按钮
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          
        })    
      },
      pictureFormClose(){
        this.getPictureForm=false;
      },
      //添加素材弹窗
      createPic(){
        this.getPictureForm=true;
        this.getCompany();
      },
      //上传图片
      submitUpload(){
       this.$refs.upload.submit();
      },
      handleError(err, file) {
          console.log('失败')
          this.fileList = []
      },
      handleSuccess(res, file ,fileList) {
          
          console.log(res)
          console.log(fileList)
          
      },
      //选中待上传的图片
      handlePreview(file) {
        console.log(file);
      },
      //删除待上传的图片
      handleRemove(file, fileList) {
        console.log(fileList);
      },
      //添加素材
      pictureInsert(){
        this.$http.post('http://192.168.1.186:3024' + '/picture/api/insert',{
            "object": {
              "id": 0,
              "albumID": this.albumId,
              "name": fileList[0].name.substring(0,fileList[0].name.indexOf(".")),
              "url": "http://ht.sweetuu.com//PhotoGallery/2015/06/25/fdda2c7dca434cbcaed394e22df6abef.png",//fileList[0].url
              "height": 0,
              "width": 0,
              "length": 0,
              "createUser": sessionStorage.getItem('id'),
              "companies": [
                {
                  "id": 0,
                  "company": 205,
                  "pictureID": 0
                }
              ]
            }
          }).then(res => {
             this.$message({
               message: '图片图片成功',
               type: 'success'
             });

          })
          this.fileList = []
      },
      //查询一个素材信息
      getPicture(){
        
      },
      //获取公司
      getCompany(){
        this.$http.post('http://192.168.1.186:3024' + '/picture/api/companyget')
        .then(res => {
            this.companyList=res.data.objects;
          })
      },
      handleCompanyChange(){
        console.log(this.checkedCompany)
      },
      
    









  
    
    }    
  }
</script>

<style scoped>
.treeDemo{margin:20px}
.w270{width:270px}
.w200{width:200px}
.tl{text-align:left}
.header{height: 50px}
.header_add{float: left;margin-left:.8%}
.header_seach{float: right;margin-right:1.5%}
.search-input{width: 353px;float: left;margin-right:100px}
.search-button{float: left;margin-left: -78px}
.main-container{width: 100%;padding-bottom: 60px;overflow: auto;max-width:1800px}
.left-tree{float: left;margin-top: 10px;width: 22%;height: 695px;border:1px solid #fff;box-shadow:3px 3px 3px #EDEDED,3px -3px 3px #EDEDED,-3px 3px 3px #EDEDED,-3px -3px 3px #EDEDED;margin-left: 1%;overflow: auto;}
.left-tree1{position:absolute;background-color:#fff;top:175px;width: 265px;height: 400px;border:1px solid #fff;box-shadow:3px 3px 3px #EDEDED,3px -3px 3px #EDEDED,-3px 3px 3px #EDEDED,-3px -3px 3px #EDEDED;left:100px;overflow: auto;z-index:2002}
.left-tree2{position:absolute;background-color:#fff;top:110px;width: 250px;height: 400px;border:1px solid #fff;box-shadow:3px 3px 3px #EDEDED,3px -3px 3px #EDEDED,-3px 3px 3px #EDEDED,-3px -3px 3px #EDEDED;left:100px;overflow: auto;z-index:2002}
.address-big{margin-top: 10px;float: left;width: 76%}
.address-img{position: relative;float: left;margin-left:2.5%;width:30%;margin-bottom:42px}
.marterialist-img{width:100%;height:252px;cursor:pointer}
.introduce{width:100%;height:30px;margin-top:16px;font-size:14px}
.label{float:left;width:60px;height:30px;background:#2f96fa;text-align: center;line-height: 30px;color:#fff}
.number{float:left;width:60px;height:30px;line-height: 30px;background:#eee;color:#000;text-align:center}
.address-name{float:left;margin-top:10px;font-size:18px}
.pagination{float: right;margin-right: 68px;margin-top: 10px;clear:both}
.add-address-img{width:1150px;height:600px;margin-left:20px}
.add-address-imgpic{width:1350px;height:620px;margin-left:20px}
.left-img{float:left;width:750px;height:470px;border:1px solid #fff}
.left-imgpic{float:left;width:880px;height:470px;border:1px solid #fff}
.right-form{float:left;width:380px}
.album-message{width:380px;height:320px;border:1px solid #E6E6E6;margin-bottom:20px}
.material-message{width:380px;height:260px;border:1px solid #E6E6E6}
.right-form1{float:left;width:380px;height:600px;border:1px solid #E6E6E6}
.album-title{width:150px;height:30px;margin-top:17px;margin-left:20px}
.blue-box{float:left;width:5px;height:30px;background:#3095fa}
.album-text{font-size:20px;margin-top:7px;margin-left:15px !important;line-height:30px}
.album-form{margin-top:30px;margin-left:20px;position:relative}
.album-name1 .el-input{width:200px;margin-left:13px}
.album-name1{margin-left:42px}
.album-button{width:250px;height:50px;margin-left:65px;margin-top:10px}
.album-info{height:100px;margin-left:46px;margin-top:-5px}
.album-info .size{margin-top:15px;clear:both}
/* 上传图片 */
.upload{margin-top:14px;width:400px;border-radius: 20px}
.clearfix:after{display: block;clear: both;content: "";visibility: hidden;height: 0}
.clearfix{zoom:1}
.confirm{margin:0 140px 0 20px}
.swiper-container{width:720px}
.upload-demo{width: 850px}
.el-upload__tip{width: 350px}
.uploadBut{margin-top: 270px}
.uploadBut .el-button{width: 130px;margin-left: 24px}
.company-list{margin: 20px 0 5px 0;width: 230px;float: left;}
.company-list .el-checkbox{min-width: 80px;margin:0 15px 7px 15px}
.per-title{margin: 20px 0;padding: 0;float: left;}
</style>
