<template>
<div>
    <div class="main-container">
    <div class="header">
        <div class="header_add">
          <el-button type="primary" @click="addAlbum = true">添加相册</el-button>
        </div>
        <div class="header_seach">
          <div class="search-input">
            <el-input v-model="searchName" placeholder="请输入相册名称" clearable></el-input>
          </div>
          <div class="search-button">
            <el-button type="primary" icon="el-icon-search" @click="sealbumPage"></el-button>
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
                 <img width="100%" height="100%" :src="picSrc+img.pictures[0].url" v-if="img.pictures.length>0"/>
                 <img width="100%" height="100%" :src="'../../../static/materialList/nopic.jpg'" v-else/> 
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
    <el-dialog title="相册" :visible.sync="getAlbumForm" custom-class="city_list" :append-to-body="true" width="1220px" @close="albumInfoClose" class="clearfix" style="margin-top:-50px">  
      <div class="add-address-img">
        <div class="left-img">
          <!--图片轮播-->
          <div class="swiper-container gallery-top">
            <div class="swiper-wrapper">
              <div v-for="item in albumInfo.pictures" class="swiper-slide">
               <img :src="picSrc+item.url" width="100%" height="100%"/>
               <!--<video poster="https://pic.qyer.com/video/cover/20181031/1540966129500?imageView2/1/w/700/h/394" src="https://media.qyer.com/video/source/20181031/1540966124475" autoplay="autoplay" controls="controls" width="100%" height="100%"></video>-->
              </div>
            </div>
            <!-- Add Arrows -->
            <div class="swiper-button-next swiper-button-white" @click="nextSwiper"></div>
            <div class="swiper-button-prev swiper-button-white" @click="prevSwiper"></div>
          </div>
          <div class="swiper-container gallery-thumbs">
            <div class="swiper-wrapper">
              <div v-for="(item,index) in albumInfo.pictures" class="swiper-slide" @click="slideTo(index)">
                <img :src="picSrc+item.url" width="100%" height="100%"/>
              </div>
            </div>
          </div>
          <!---->
          <i class="el-icon-circle-close-outline" @click="delPic"></i>
        </div>
         <div class="right-form">
           <div class="album-message">
             <!-- 表格头部 -->
            <div class="album-title">
              <div class="blue-box"></div>
              <div class="album-text">相册信息</div>
            </div>
            <div class="album-form">
                <el-form :model="albumInfo"  ref="albumForm" label-width="100px">
                  <div class="album-name1">
                    名称：<el-input v-model="albumInfo.name" placeholder="请输入素材名称" :disabled="albumDisabled"></el-input>
                    <span class="empty" v-if="albumNameEmpty">名称不能为空</span>
                  </div>
                  <el-form-item label="类型：" style="margin-top:20px">
                    <el-select  v-model="albumInfo.albumType">
                      <el-option :key="item.id" v-for="item in albumtype" :label="item.name" :value="item.id" :disabled="albumDisabled"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="目的地：">
                    <el-button plain @click="leftTree2 = leftTree2 == true?false:true" class="w200 tl" :disabled="albumDisabled">{{albumInfo.areaName}}</el-button>
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
             <div class="album-form" v-show="picInfoShow">
                <div class="album-name1">
                    名称：<el-input v-model="pictInfo.name" placeholder="请输入素材名称" :disabled="picDisabled"></el-input>
                    <span class="empty" v-if="picNameEmpty">名称不能为空</span>
                </div>
                <div class="album-info">
                  <div>
                      <p class="per-title">权限：</p>
                      <el-checkbox-group v-model="checkedCompany" class="company-list" :disabled="picDisabled">
                        <el-checkbox v-for="item in companyList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
                      </el-checkbox-group>
                  </div>
                  <div class="size">尺寸：{{pictInfo.width}}*{{pictInfo.height}}</div>
                  <div class="size">大小：{{pictInfo.length}}</div>
                </div>                    
            </div>
            <div class="album-picbutton" v-show="picInfoShow">              
                 <el-button type="primary" @click="savPic">{{savPicBut}}</el-button>
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
                :limit="12"
                drag
                :file-list="fileList"
                action="http://192.168.1.186:3009/upload/api/picture"
                multiple
                list-type="picture"
                :on-error="handleError"
                :on-success="handleSuccess"
                :on-remove="handleRemove"
                :on-preview="handlePreview" name="files">                
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，单次最多上传12张图片</div>
              </el-upload>
          </div>
         </div>
         <div class="right-form1">
             <div class="album-title">
                <div class="blue-box"></div>
                <div class="album-text">素材信息</div>
             </div>
             <div class="album-form" v-for="(item,index) in fileList" v-show="uid==item.uid">
                <div class="album-name1">
                    名称：<el-input placeholder="请输入素材名称" v-model="item.name"></el-input>
                </div>
                <div class="album-info">
                  <div>
                      <p class="per-title">权限：</p>
                      <el-checkbox-group v-model="item.companies" class="company-list">
                        <el-checkbox v-for="itemList in companyList" :label="itemList.id" :key="itemList.id">{{itemList.name}}</el-checkbox>
                      </el-checkbox-group>
                  </div>
                  <div class="size">尺寸： {{item.width}}*{{item.height}}</div>
                  <div class="size">大小： {{item.length}}</div>
                </div>                    
            </div>
            <div class="uploadBut">
               <el-button @click="pictureFormClose">取消</el-button>  
               <el-button type="primary" @click="pictureInsert">添加素材</el-button> 
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
        picSrc:'http://192.168.1.186:3009/upload',
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
        addAlbum: false, //添加相册弹窗
        leftTree1:false, //添加相册选择目的地       
        albumtype:[],  //全部景点类型
        geography:"", //控制右侧相册列表隐藏
        //单个相册弹窗
        getAlbumForm:false,
        albumInfo:{}, //单个相册信息
        leftTree2:false,
        albumId:0,  //保存相册id
        albumDisabled:true, //文本框禁用
        saveAlbumBut:"修改属性",
        albumNameEmpty:false,
        //素材信息
        picInfoShow:true,
        companyList:[], //全部公司
        picDisabled:true, //文本框禁用
        savPicBut:"修改属性",        
        picNameEmpty:false,
        pictInfo:{}, //单个图片信息
        checkedCompany: [], //保存单个图片的公司数据
        activeIndex:0, //swiper当前索引


        //素材照片弹窗
        getPictureForm:false,
        fileList:[],//上传的图片集合
        insertCheCompany:[], //默认选中全部公司id
        uid:0,//上传图片缩略图选中项
        len:0,
        time:0,
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
    },
    methods: {
      handleSizeChange(val){
        this.pageSize = val;
        this.pageIndex = 1;
        this.albumPage(1,val,this.data.id,this.searchName);
      },
      handleCurrentChange(val){
        this.albumPage(val,this.pageSize,this.data.id,this.searchName);
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
                  message: '添加相册成功',
                  type: 'success'
                  });
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
        if (data.isLeaf == 1) {
          if(this.addAlbum == true){
              //添加相册tree
              this.picForm.destination=data.name;
              this.picForm.destinationId=data.id;
              this.leftTree1=false;             
          }else if(this.getAlbumForm == true){
             //修改相册tree
              this.albumInfo.areaName=data.name;
              this.albumInfo.areaID=data.id;
              this.leftTree2=false;
          }else{
              this.data = data;
             //左侧导航tree
              this.geography = 1;
              this.searchName = "";
              this.albumPage(this.pageIndex,this.pageSize,this.data.id?this.data.id:0,this.searchName);
          }
        }
      },
      sealbumPage(){
        this.geography = 1;
        this.albumPage(this.pageIndex,this.pageSize,0,this.searchName);
      },
      //相册list
      albumPage(pageIndex=this.pageIndex,pageSize=this.pageSize,areaID=0,name=""){
        this.$http.post('http://192.168.1.186:3024' + '/album/api/page',{
            "pageIndex": pageIndex,
            "pageSize": pageSize,
            "object": {
              "name":name,
              "areaID": areaID,
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
               this.albumId = id;
               this.getAlbumForm = true;
               this.getCompany();
               setTimeout(()=>{
                this.mySwiper(0);
               },100)
               if(res.data.object.pictures.length!=0){
                 this.getPicture(0);
                 this.picInfoShow=true;
               }else{
                 this.picInfoShow=false;
               }

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
          if(!this.albumInfo.name){
            this.albumNameEmpty=true;
            return false;
          }         
          this.$http.post('http://192.168.1.186:3024' + '/album/api/save',{
             "object":this.albumInfo
          }).then(res => {
            if(res.data.isSuccess == true){
              this.albumPage(this.pageIndex,this.pageSize,this.data.id,this.searchName);
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.albumNameEmpty=false;
              this.saveAlbumBut="修改属性";
              this.albumDisabled=true;
            }
          }).catch(err => {
            console.log(err)
          })          
        }        
      },
      albumInfoClose(){
        this.getAlbumForm = false;
        this.leftTree2=false; 
        this.albumDisabled=true;
        this.saveAlbumBut="修改属性";
      },
      mySwiper(index){
         var galleryThumbs = new Swiper('.gallery-thumbs', {
            spaceBetween: 10,
            slidesPerView: 4,
            freeMode: true,
            watchSlidesVisibility: true,
            watchSlidesProgress: true,
            slideToClickedSlide: true,
            initialSlide: index,  
            observer:true,//修改swiper自己或子元素时，自动初始化swiper 
            observeParents:true,//修改swiper的父元素时，自动初始化swiper 
          });
          var galleryTop = new Swiper('.gallery-top', {
            spaceBetween: 10,
            initialSlide: index,  
            observer:true,//修改swiper自己或子元素时，自动初始化swiper 
            observeParents:true,//修改swiper的父元素时，自动初始化swiper 
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
            thumbs: {
              swiper: galleryThumbs
            }
          });
      },
      slideTo(index){
         this.getPicture(index);
      },
      prevSwiper(){
        this.getPicture(this.activeIndex-1);
      },
      nextSwiper(){
        this.getPicture(this.activeIndex+1);
      },
      pictureFormClose(){
        this.fileList = [];
        this.getPictureForm=false;
      },
      //查询一个素材信息
      getPicture(index){
        this.picDisabled=true;
        this.savPicBut="修改属性";
        this.$http.post('http://192.168.1.186:3024' + '/picture/api/get',{
             id:this.albumInfo.pictures[index].id
          }).then(res => {
            if(res.data.isSuccess == true){
               this.pictInfo=res.data.object;
               this.checkedCompany=[];
               for(let i=0;i<this.pictInfo.companies.length;i++){
                   this.checkedCompany.push(this.pictInfo.companies[i].company)
                } 
                this.activeIndex=index;
             }
          })
      },
      //删除一张照片
      delPic(){
        this.$confirm("确认删除?", "提示", {
           confirmButtonText: "确定",
           cancelButtonText: "取消",
           type: "warning"
        })
        .then(() => {
              this.$http.post('http://192.168.1.186:3024' + '/picture/api/delete',{
                    "id": this.pictInfo.id
                  }).then(res => {
                      if(res.data.isSuccess == true){
                         this.$message.success("删除成功");
                         this.getAlbum(this.albumId);
                  }
               })
          })
          .catch(() => {
            this.$message({
            type: "info",
            message: "已取消"
          });
        });
      },
      //保存照片信息
      savPic(){
        if(this.picDisabled){
          this.picDisabled=false;
          this.savPicBut="保存属性";
        }else{
          if(!this.pictInfo.name){
            this.picNameEmpty=true;
            return false;
          }       
          this.pictInfo.companies=[];
          for(let i=0;i<this.checkedCompany.length;i++){
              this.pictInfo.companies.push({
                  "id": 0,
                  "company": this.checkedCompany[i],
                  "pictureID": this.pictInfo.id
              });
          } 
          this.$http.post('http://192.168.1.186:3024' + '/picture/api/save',{
             "object":this.pictInfo
          }).then(res => {
            if(res.data.isSuccess == true){
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.picNameEmpty=false;
              this.savPicBut="修改属性";
              this.picDisabled=true;
            }
          }).catch(err => {
            console.log(err)
          })          
        }  
      },
      //获取公司
      getCompany(){
        this.$http.post('http://192.168.1.186:3024' + '/picture/api/companyget')
        .then(res => {
            this.insertCheCompany=[];
            this.companyList=res.data.objects;
            for(let i=0;i<this.companyList.length;i++){
               this.insertCheCompany.push(this.companyList[i].id)
            }            
          })
      },
      //添加素材弹窗
      createPic(){
        this.getPictureForm=true;
      },
      handleError(err, file) {
          console.log('失败')
          this.fileList = []
      },
      handleSuccess(res, file ,fileList) {
          //多次添加图片判断，如果是第一次添加修改全部图片数据，否则修改新添加项数据            
          if(this.time!=fileList.length){  //多张图片情况只在第一次执行数组操作，用time标识
            this.time=fileList.length;         
            if(this.fileList.length==0){
               this.fileList=fileList;
            }else{
               this.len=this.fileList.length;  //len循环初始值
               for(let i=this.len;i<fileList.length;i++){
                 this.fileList.push(fileList[i]);
               }
             }
          }     
          var paths = null;
          for(let i=this.len;i<fileList.length;i++){          
           paths=JSON.parse(fileList[i].response).paths[0];         
           this.$set(this.fileList[i],"companies",this.insertCheCompany);
           this.$set(this.fileList[i],"width",paths.Width);
           this.$set(this.fileList[i],"height",paths.Height);
           this.$set(this.fileList[i],"url1",paths.Url);
           this.$set(this.fileList[i],"length",paths.Length);
           this.$set(this.fileList[i],"name",paths.Name);
          }
          this.uid=fileList[0].uid;  //编辑上传图片时默认到第一张图片  
          
      },
      //选中待上传的图片
      handlePreview(file) {
        this.uid=file.uid;
      },
      //删除待上传的图片
      handleRemove(file, fileList) {
        this.uid=fileList[0].uid;
        for(let i=0;i<this.fileList.length;i++){
           if(file.uid==this.fileList[i].uid){
             this.fileList.splice(i,1);
           }
        }       
        this.time=this.fileList.length;       
      },
      //添加素材
      pictureInsert(){
        let pictureList=[];  //图片数据字段转换
        let fileList=this.fileList;
        for(let i=0;i<fileList.length;i++){
           let picture={};
           picture.id=0;
           picture.albumID=this.albumId;
           picture.name=fileList[i].name;
           picture.url=fileList[i].url1;
           picture.height=fileList[i].height;
           picture.width=fileList[i].width;
           picture.length=parseInt(fileList[i].size/1024);
           picture.createUser=sessionStorage.getItem('id');
           picture.companies=[];
           picture.createTime=new Date();
           for(let j=0;j<fileList[i].companies.length;j++){             
              picture.companies.push({
                  "id": 0,
                  "company": fileList[i].companies[j],
                  "pictureID": 0
                });
           }
           pictureList.push(picture);
        }

        this.$http.post('http://192.168.1.186:3024' + '/picture/api/insertlist',{
            "object":{"pictures":pictureList}
          }).then(res => {
             if(res.data.isSuccess == true){
             this.$message({
               message: '图片图片成功',
               type: 'success'
             });
             this.getAlbum(this.albumId);
             this.fileList = [];
             this.getPictureForm=false;
             this.time=0;
             this.len=0;
             }
          })
          
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
.left-tree1{position:absolute;background-color:#fff;top:255px;width: 265px;height: 400px;border:1px solid #fff;box-shadow:3px 3px 3px #EDEDED,3px -3px 3px #EDEDED,-3px 3px 3px #EDEDED,-3px -3px 3px #EDEDED;left:120px;overflow: auto;z-index:2002}
.left-tree2{position:absolute;background-color:#fff;top:165px;width: 250px;height: 400px;border:1px solid #fff;box-shadow:3px 3px 3px #EDEDED,3px -3px 3px #EDEDED,-3px 3px 3px #EDEDED,-3px -3px 3px #EDEDED;left:100px;overflow: auto;z-index:2002}
.address-big{margin-top: 10px;float: left;width: 76%}
.address-img{position: relative;float: left;margin-left:2.5%;width:30%;margin-bottom:42px}
.marterialist-img{width:100%;height:252px;cursor:pointer}
.introduce{width:100%;height:30px;margin-top:16px;font-size:14px}
.label{float:left;width:60px;height:30px;background:#2f96fa;text-align: center;line-height: 30px;color:#fff}
.number{float:left;width:60px;height:30px;line-height: 30px;background:#eee;color:#000;text-align:center}
.address-name{float:left;margin-top:10px;font-size:18px}
.pagination{float: right;margin-right: 68px;margin-top: 10px;clear:both}
.add-address-img{width:1150px;height:670px;margin-left:20px}
.add-address-imgpic{width:1350px;height:620px;margin-left:20px}
.left-img{float:left;width:730px;height:620px;border:1px solid #fff;position: relative}
.left-img i{position: absolute;top:10px;right:10px;display: block;z-index: 2;color: #fff;font-size: 30px}
.left-imgpic{float:left;width:880px;height:470px;border:1px solid #fff}
.right-form{float:left;width:380px;margin-left: 20px}
.album-message{width:380px;height:305px;border:1px solid #E6E6E6;margin-bottom:20px}
.material-message{width:380px;height:350px;border:1px solid #E6E6E6;position: relative;}
.right-form1{float:left;width:380px;height:600px;border:1px solid #E6E6E6;position:relative;}
.album-title{width:150px;height:30px;margin-top:17px;margin-left:20px}
.blue-box{float:left;width:5px;height:30px;background:#3095fa}
.album-text{font-size:20px;margin-top:7px;margin-left:15px !important;line-height:30px}
.album-form{margin-top:20px;margin-left:20px;position:relative}
.album-name1 .el-input{width:200px;margin-left:13px}
.album-name1{margin-left:42px}
.album-button{width:250px;height:50px;margin-left:65px;margin-top:10px}
.album-picbutton{width:250px;position: absolute;bottom:20px;left:145px;}
.album-info{height:100px;margin-left:46px;margin-top:-5px}
.album-info .size{margin-top:10px;clear:both}
.empty{position:absolute;left:100px;top:40px;font-size:12px;color:red}
/* 上传图片 */
.upload{margin-top:14px;width:400px;border-radius: 20px}
.clearfix:after{display: block;clear: both;content: "";visibility: hidden;height: 0}
.clearfix{zoom:1}
.confirm{margin:0 140px 0 20px}
.upload-demo{width: 850px}
.el-upload__tip{width: 350px}
.uploadBut{position: absolute;bottom:30px;left:25px;}
.uploadBut .el-button{width: 130px;margin-left: 24px}
.company-list{margin: 20px 0 5px 0;width: 270px;float: left;}
.company-list .el-checkbox{min-width: 100px;margin:0 15px 7px 15px}
.per-title{margin: 20px 0;padding: 0;float: left}
.el-upload-list__item{width:50%}
.swiper-container {
  width: 100%;
  height: 300px;
  margin-left: auto;
  margin-right: auto;
}
.swiper-slide {
background-size: cover;
background-position: center;
}
.gallery-top {
height: 80%;
width: 100%;
}
.gallery-thumbs {
height: 20%;
box-sizing: border-box;
padding: 10px 0;
}
.gallery-thumbs .swiper-slide {
width: 25%;
height: 100%;
opacity: 0.4;
}
.gallery-thumbs .swiper-slide-thumb-active {
opacity: 1;
}
</style>
