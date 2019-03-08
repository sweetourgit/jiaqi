<template>
<div>
    <div class="main-container">
    <div class="header">
        <div class="header_add">
          <el-button type="primary" @click="addAlbum = true">添加相册</el-button>
        </div>
        <div class="header_seach">
          <div class="search-input">
            <el-input v-model="addName" placeholder="目的地\名称"  clearable></el-input>
          </div>
          <div class="search-button">
            <el-button   type="primary" icon="el-icon-search" ></el-button>
          </div>
        </div>
    </div>
    <!--左侧导航-->
    <div class="left-tree">
         <div style="margin-left:80px;margin-top:50px;"> 
              <el-tree :props="props1" :load="loadNode1" lazy></el-tree>
         </div>
    </div>     
    <!-- 地址图片的最大框框 -->
    <div class="address-big">
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
        

    <!-- 所有的弹窗 -->
    <!-- 1.添加相册的弹窗 -->
  <el-dialog title="添加相册" :visible.sync="addAlbum" custom-class="city_list" append-to-body width="27%"  class="clearfix form_left">
  <el-form :model="form"  ref="form">
   <el-form-item label="名称:" prop="name" :label-width="formLabelWidth" style="width:350px;margin-left:35px" >
      <el-input v-model="form.name" auto-complete="off" placeholder="请输入相册名称"></el-input>
    </el-form-item>
    <el-form-item label="类型:" prop="type" :label-width="formLabelWidth" style="margin-left:35px;width:350px">
      <el-select v-model="form.type" placeholder="请选择相册类型" style="width:250px">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="目的地:" prop="destination" :label-width="formLabelWidth" style="margin-left:35px;width:350px">
      <el-select v-model="form.destination" placeholder="请选择目的地" style="width:250px">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="albumClose">取 消</el-button>
    <el-button type="primary" @click="albumSuccess">确 定</el-button>
  </div>
</el-dialog>

<!-- 2.添加照片的弹窗 -->
<el-dialog title="添加照片" :visible.sync="addAlbumImg" custom-class="city_list" style="margin-top:-100px"  append-to-body width="1600px"  class="clearfix form_left">
  
  <div class="add-address-img">
    <div class="left-img">
      <!-- 第一张图片 -->
      <div class="first-img">
        <img style="width:100%;height:100%;"   :src="this.addressImg"    alt="">
            <!-- <span class="small_img_close" @click="img_close"><i style="width:20px;cursor:pointer" class="el-icon-error"></i></span>    -->
        
      </div>
      <!-- 其余图片  -->
      <div class="small-box">
        <div v-for="img in marterialist" :key="img.name">
           <div id="Simg" class="small-img"
            v-for="small in num" 
            :key="small.name" 
            :class="{'classa': small.name == classa}"
            @click="select(small.name,small.imgs,small.title,small.name)" >
            <img style="width:100%;height:100%;" :src="small.imgs" alt="">
        </div>
      </div>   
      </div>
    </div>
     <div class="right-form">
       <div class="album-message">
         <!-- 表格头部 -->
        <div class="album-title">
          <div class="blue-box"></div>
          <div class="album-text">相册信息</div>
        </div>
        <div class="album-name">{{this.title}}</div>
        <div class="album-form">
            <el-form :model="albumForm"  ref="albumForm" label-width="100px" >
              <el-form-item label="类型 :">
                <el-select  v-model="albumForm.type" placeholder="请选择活动区域">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="目的地 :">
                  <el-select  v-model="albumForm.destination" placeholder="请选择活动区域">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
                </el-form-item>
          </el-form>
          <div class="album-button">
            <el-button type="danger" @click="del()">删除相册</el-button>
            
            <el-button type="primary" @click="material">创建素材</el-button>
          </div>
        </div>
     
       </div>
       <div class="material-message">
         <div class="album-title">
            <div class="blue-box"></div>
            <div class="album-text">素材信息</div>
         </div>
         <div class="album-form">
            <el-form :model="materialForm"  ref="materialForm" label-width="100px" >
              <el-form-item label="名称 :" prop="name" >
                <el-input  v-model="this.album" placeholder="请输入素材名称"></el-input>
                </el-form-item>
            </el-form>
            <div style="width:200px;height:100px;margin-left:50px;">
              <div style="margin-top:10px;text-align:left">尺寸 : 1024*720</div>
              <div style="margin-top:10px;text-align:left">大小 : 14M</div>
              <div style="margin-top:10px;text-align:left">标签:
                <el-button size="mini">添加</el-button>
              </div>
            </div>       
        </div>
       </div>
    </div> 
  </div> 
</el-dialog>

<!-- 3.添加素材弹窗 -->
<el-dialog title="添加素材" :visible.sync="addMaterial" style="margin-top:-100px;" custom-class="city_list" append-to-body width="1600px"  class="clearfix form_left">
  <el-form :model="form"  ref="form">
  </el-form>
  <div class="add-address-img">
    
      <el-button type="primary" style="margin-right:900px">添加素材</el-button>
      <div class="upload">
          <el-upload
            class="upload-demo"
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
      </div>
      
        <div class="material-small-box" >
        <!-- <div v-for="img in marterialist" :key="img.name" ></div> -->
        <div class="material-small-img"  v-for="(small,index) in num"  :key="small.name"
            @click="select(small.name,small.imgs,small.title)" >
           <span  style="position:relative;margin-left:285px;top:20px" @click="img_close(index)"><i style="width:20px;cursor:pointer" class="el-icon-error"></i></span>  
            <img  :class="{'classa': small.name == classa}" style="width:100%;height:100%;" :src="small.imgs" :key="num.name"  alt="">    
        </div>      
      </div>  
    
      
    
     <div class="right-form">    
       <div class="material-message1">
          <div class="album-title">
            <div class="blue-box"></div>
            <div class="album-text">素材信息</div>
         </div>
         <div class="album-form">
            <el-form :model="materialForm"  ref="materialForm" label-width="100px" >
              <el-form-item label="名称 :" prop="name">
                <el-input v-model="this.album" placeholder="请输入素材名称"></el-input>
                </el-form-item>
            </el-form>
            <div style="width:300px;margin-left:50px;">
              <div style="margin-top:10px;">尺寸 : 1024*720</div>
              <div style="margin-top:10px;">大小 : 14M</div>
              <div style="margin-top:10px;;">标签:
                <!-- 添加标签 -->
                <template v-if='this.selectLabel.type.length == 0'>
                  <el-button size="mini" @click="label" >编辑</el-button>
                </template>
                <template v-else>
                    <el-button size="mini" @click="label" style="margin-top:5px" v-for="(item,index) in selectLabel.type" :key="index" >{{item}}</el-button>

                </template>
                
                <!-- v-for="item in selectLabel.type" -->
              </div>
            </div>
             <div class="album-button">
              <el-button  style="width:100px;" @click="albumCancal()">取消</el-button>
              <el-button type="primary" style="width:100px;" @click="albumAdd()">添加 </el-button>
            </div>           
        </div>
       </div>
    </div>
    
  </div>
</el-dialog>
<!-- 4.添加标签的弹窗 -->
<el-dialog title="标签选择" :visible.sync="addLabel" custom-class="city_list" style="width:950px;margin:0 auto">
  <div style="margin:0 auto;">
    <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane v-for="list in Label" :label="list.title" :key="list.key" >
      <div class="add-label">
        <div class="label-name">
          <div style="float:left;line-height:40px">标签:</div>
           <el-input   v-model="labelAdd"  placeholder="请输入6个字符之内的标签" style="width:220px;"></el-input>
           <el-button size="mini" @click="NewLabel(list.key)" type="primary" icon="el-icon-plus" style="float:right;margin-top:6px">添加</el-button>
        </div>
        <div class="select-label">
            <el-checkbox-group v-model="selectLabel.type">
          <el-checkbox  class="label-check" :label="item.title" :v-model="item.checked" v-for="item in list.LabelIn" :key="item.key"></el-checkbox>        
            </el-checkbox-group>
        </div>
         <div class="material-button">
              <el-button  style="width:100px;" @click="LabelCancel">取消</el-button>
              <el-button type="primary" style="width:100px;" @click="Addlabel">确定</el-button>
        </div>
      </div>  
    </el-tab-pane>
  </el-tabs>
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




        // 选中
        classa:'',
        addName:'',
        // 相册第一张图片
        addressImg: '', 
         // 树形控件的数据
        props1: {
          label: 'name',
          children: 'zones',
          isLeaf: 'leaf'
        },
        data3: [{
          id: 1,
          label: '中国',
          children: [{
            id: 3,
            label: '吉林',
            children: [{
              id: 4,
              label: '松原'
            }, {
              id: 5,
              label: '吉林',
              disabled: true
            }]
          }, {
            id: 2,
            label: '辽宁',
            disabled: true,
            children: [{
              id: 6,
              label: '沈阳'
            }, {
              id: 7,
              label: '沈北',
              disabled: true
            }]
          }]
        }],
        // 相册里面的第一个图片
        addressImg:[{

        }],
        // 相册里面的其他图片
        
        // 素材里面的其他图片
        marterialImg:[{
          name:'0',
          img:'http://ht.sweetuu.com//PhotoGallery/2015/07/20/763773619351461d9e04e605673d1919.jpg',
        },{
          name:'1',
          img:'http://ht.sweetuu.com//PhotoGallery/2015/07/20/763773619351461d9e04e605673d1919.jpg',
        },{
          name:'2',
          img:'http://ht.sweetuu.com//PhotoGallery/2015/07/20/763773619351461d9e04e605673d1919.jpg',
        },{
          name:'3',
          img:'http://ht.sweetuu.com//PhotoGallery/2015/07/20/763773619351461d9e04e605673d1919.jpg',
        },{
          name:'4',
          img:'http://ht.sweetuu.com//PhotoGallery/2015/07/20/763773619351461d9e04e605673d1919.jpg',
        },{
          name:'5',
          img:'http://ht.sweetuu.com//PhotoGallery/2015/07/20/763773619351461d9e04e605673d1919.jpg',
        }],
        // 标签
        Label:[
        {
          key:'0',
          title:'景色',
            LabelIn:[
          {
            key:'0',
            title:'游山',
            checked:'checked0',
          },{
            key:'1',
            title:'玩水',
            checked:'checked1',
          },{
            key:'2',
            title:'下海',
            checked:'checked2',
          },{
            key:'3',
            title:'看天',
            checked:'checked3',
          },
        ]},
        {
          key:'1',
          title:'美食',
             LabelIn:[
          {
            key:'0',
            title:'特色菜',
            checked:'checked0',
          },{
            key:'1',
            title:'法餐',
            checked:'checked1',
          }, {
            key:'2',
            title:'当地饮食',
            checked:'checked2',
          },{
            key:'3',
            title:'东北菜',
            checked:'checked3',
          },
          ]},
          {
          key:'2',
          title:'购物',
             LabelIn:[
          {
            key:'0',
            title:'免税',
            checked:'checked0',
          },{
            key:'1',
            title:'含税',
            checked:'checked1',
          }, {
            key:'2',
            title:'纪念品',
            checked:'checked2',
          },{
            key:'3',
            title:'伴手礼',
            checked:'checked3',
          },
          ]},
          {
          key:'3',
          title:'住宿',
             LabelIn:[
          {
            key:'0',
            title:'民宿',
            checked:'checked0',
          },{
            key:'1',
            title:'旅店',
            checked:'checked1',
          }, {
            key:'2',
            title:'酒店',
            checked:'checked2',
          },{
            key:'3',
            title:'温泉酒店',
            checked:'checked3',
          },
          ]},
          {
          key:'4',
          title:'娱乐',
             LabelIn:[
          {
            key:'0',
            title:'KTV',
            checked:'checked0',
          },{
            key:'1',
            title:'真人CS',
            checked:'checked1',
          }, {
            key:'2',
            title:'SPA',
            checked:'checked2',
          },{
            key:'3',
            title:'密室逃脱',
            checked:'checked3',
          },
          ]},
           {
          key:'5',
          title:'其他',
             LabelIn:[
          {
            key:'0',
            title:'健身房',
            checked:'checked0',
          },{
            key:'1',
            title:'轰趴',
            checked:'checked1',
          }, {
            key:'2',
            title:'桌游馆',
            checked:'checked2',
          },{
            key:'3',
            title:'运动场',
            checked:'checked3',
          },
          ]}
        ],
        
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        num: '',
        // 添加相册隐藏
        addAlbum : false,
        // 相册添加照片隐藏
        addAlbumImg : false,
        // 添加素材
        addMaterial : false,
        // 添加标签
        addLabel : false,
        haha:'',
        aa:'',
        // 标签
        labelAdd:'',
        materialRules: '',
        albumRules: '',
        checked:'',
        title:'',
        album:'',
         handleClick(tab, event) {
        // console.log(tab, event);
      },
        activeName: '',
          form: {
            name: '',
            type: '',
            destination: '',
            date1: '',
            date2: '',
            delivery: false,
            type: [],
            resource: '',
            desc: ''
          },
          albumForm: {
            destination:'',
            type:'',
          },
          materialForm: {
            name:'',
          },
        // 被选中的标签
        checkLabel:[], 
        selectLabel:{
          type:[],
        },
        formLabelWidth: '100px',
        rules:{
              name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择活动区域',trigger: 'blur' }
          ],
          destination: [
            { required: true, message: '请选择活动区域',trigger: 'blur' }
          ],
        
        },
         materialrules:{
              name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
        }
      };
    },

    methods: {
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      // 关闭相册弹窗
      albumClose(){
        this.addAlbum = false;
        this.form.name = '';
        this.form.type = '';
        this.form.destination = '';
        },
      // 相册添加成功
      albumSuccess(){
        this.addAlbum = false;
        this.form.name = '';
        this.form.type = '';
        this.form.destination = '';
        this.addMaterial = true;
        this.$message({
          message: '添加相册成功,请为它添加照片吧~',
          type: 'success'
        });
      },
      // 添加素材
      material(){
        // this.num = this.marterialist[0].smallImg.imgs;
        // alert(this.num);
        // this.addAlbumImg = false;     
        this.addMaterial = true;
        console.log(this.selectLabel.type)
        
      },
      // 添加标签
      label(){
        // this.addMaterial = false;
        this.addLabel = true;
        // alert(123);
        console.log(this.selectLabel);
      },
     // 删除相册图片
     img_close(aa){
       console.log(aa);
      //  console.log(this.num[aa]);
      
          
       
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.num.splice(aa,1);   
          this.addressImg = this.num[0].imgs; 
          this.album = '';
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
                
        
      },
      // 城市树形框架数据
       loadNode1(node, resolve) {
        if (node.level === 0) {
          return resolve([{ name: '北京' },{ name: '辽宁' }]);
        }
        if (node.level > 1) return resolve([]);

        setTimeout(() => {
          const data = [{
            name: '东直门',
            
          }, {
            name: '西直门'
          }];

          resolve(data);
        }, 500);
      },
      // 选择相册其他照片
     select(a,b,c,d){
       this.classa = a;

       console.log(b);
      
       console.log(this.addAlbumImg)
       this.addressImg = b;
       this.album = c;
      //  this.img.smallImg.length = d;
      //  alert(1)
      // if(d>=3){
      //   alert(123);
      //   this.Simg.style.marginLeft = 40;
      //   this.Simg.style.background = "red";
        
      // }
      //  alert(d);
       
     },
    //  点击封面进入相册
     addAlbumImg1(i){
       console.log(this.marterialist[i]);
          this.addAlbumImg = true;
          this.num = this.marterialist[i].smallImg;
          console.log(this.num[0].imgs);
         this.addressImg = this.num[0].imgs;

          // this.select(this.marterialist[i].smallImg[0].name,this.marterialist[i].smallImg[0].imgs); 
          this.bb = i;
       console.log(this.bb);

          this.title = this.marterialist[i].title;
          this.album = this.marterialist[i].smallImg[0].title;
          },
    // 添加标签
    NewLabel(i){
      console.log(i);
      var text = this.labelAdd.trim();
      if(text){
        this.Label[i].LabelIn.push({title:text});
        // this.selectLabel.type.push({text});
        console.log(this.checkLabel);
        this.labelAdd = '';
       }

      },
    // 取消添加标签
    LabelCancel(a){
        this.addLabel = false;
        // this.$refs[a].jj.resetFields();

      },

    // 删除相册
    del(){

      console.log(this.marterialist[this.bb])
      console.log(this.bb);
      console.log(this.marterialist);
       this.$confirm('此操作将永久删除该相册, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            
            type: 'success',
            message: '删除成功!'
          });
        this.marterialist.splice(this.bb,1);
        
        console.log(this.marterialist);

            this.addAlbumImg = false;
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        
      },
    // 添加所有标签
    Addlabel(){
      console.log("添加成功");
      console.log(this.selectLabel.type);
     
      this.addLabel = false;
    },
    // 取消素材选择
    albumCancal(){
      this.classa = '';
      this.album = '';
    },
    // 添加素材到相册
    albumAdd(){
       this.$message({
          message: '添加成功',
          type: 'success'
        });
       this.addMaterial = false;
       this.classa = '';
       

    }
    
    },
    
  };
</script>

<style lang="scss" scoped>
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
.left-tree{float: left;margin-top: 10px;width: 22%;height: 695px;border:1px solid #fff;box-shadow:3px 3px 3px #EDEDED,3px -3px 3px #EDEDED,-3px 3px 3px #EDEDED,-3px -3px 3px #EDEDED;margin-left: 1%}
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
</style>
