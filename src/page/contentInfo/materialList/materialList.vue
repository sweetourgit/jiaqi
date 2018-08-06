<template>
<div>
    <div class="big">
          <div class="header">
        <div class="header_add">
          <el-button type="primary" @click="addAlbum = true">添加相册</el-button>
        </div>
        <div class="header_seach">
          <div class="search-input">
            <el-input v-model="addName" placeholder="请输入目的地名称"  clearable></el-input>
          </div>
          <div class="search-button">
            <el-button  size="medium" type="primary" icon="el-icon-search" ></el-button>
          </div>
        </div>
    </div>
     
        <div class="left-tree">
           
      
           <div style="margin-left:80px;margin-top:50px;"> 
              <el-tree
                :props="props1"
                :load="loadNode1"
                lazy
              >
              </el-tree>
           </div>
            

        </div>
        <!-- 地址图片的最大框框 -->
      <div class="address-big">
            <div class="address-img" v-for="img in marterialist" :key="img.name" >
                <div class="marterialist-img" @click="addAlbumImg1(img.name)" >
                    <img style="width:100%;height:100%" :src="marterialist[img.name].smallImg[0].imgs" alt="">
                </div>
                <!-- 图片介绍 -->
                <div class="introduce">
                    <!-- 图片标签 -->
                    <div class="label">标签</div>
                    <!-- 图片数量 -->
                    <div class="number">{{img.smallImg.length}}张</div>
                </div>
                <!-- 景点名称 -->
                <div class="address-name">
                    {{img.title}}
                </div>

            </div>
            
     
        </div>
         <div class="page">
        <!-- <span class="demonstration">完整功能</span> -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage4"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400">
            </el-pagination>
        </div>
      </div>
        

    <!-- 所有的弹窗 -->
    <!-- 1.添加相册的弹窗 -->
  <el-dialog title="添加相册" :visible.sync="addAlbum" custom-class="city_list" append-to-body width="20%"  class="clearfix form_left">
  <el-form :model="form"  ref="form">
   <el-form-item label="名称:" prop="name" :label-width="formLabelWidth" style="width:300px" >
      <el-input v-model="form.name" auto-complete="off" placeholder="请输入相册名称"></el-input>
    </el-form-item>
    <el-form-item label="类型:" prop="type" :label-width="formLabelWidth" style="margin-right:200px;width:300px">
      <el-select v-model="form.type" placeholder="请选择相册类型">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="目的地:" prop="destination" :label-width="formLabelWidth" style="margin-right:200px;width:300px">
      <el-select v-model="form.destination" placeholder="请选择目的地">
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
<el-dialog title="添加照片" :visible.sync="addAlbumImg" custom-class="city_list" style="margin-top:-100px"  append-to-body width="1450px"  class="clearfix form_left">
  <el-form :model="form"  ref="form">
  </el-form>
  <div class="add-address-img">
    <div class="left-img">
      <!-- 第一张图片 -->
      <div class="first-img">
        <img style="width:100%;height:100%;"   :src="this.addressImg"    alt="">
            <span class="small_img_close" @click="img_close"><i style="width:20px;cursor:pointer" class="el-icon-error"></i></span>   
        
      </div>
      <!-- 其余图片  -->
      <div class="small-box">
        <div v-for="img in marterialist" :key="img.name">
           <div class="small-img"
            v-for="small in num" 
            :key="small.name" 
            :class="{'classa': small.name == classa}"
            @click="select(small.name,small.imgs,small.title)" >
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
            <el-button type="danger">删除相册</el-button>
            
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
                <el-button size="mini">按钮</el-button>
              </div>
            </div>       
        </div>
       </div>
    </div> 
  </div> 
</el-dialog>

<!-- 3.添加素材弹窗 -->
<el-dialog title="添加素材" :visible.sync="addMaterial" style="margin-top:-100px;" custom-class="city_list" append-to-body width="1450px"  class="clearfix form_left">
  <el-form :model="form"  ref="form">
  </el-form>
  <div class="add-address-img">
    <div class="left-img">
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
        <div v-for="img in marterialist" :key="img.name" ></div>
        <div class="material-small-img"  v-for="small in num"  :key="num.name"
            @click="select(small.name,small.imgs,small.title)" >
           <!-- <span  style="position:relative;margin-left:285px;top:20px" @click="img_close"><i style="width:20px;cursor:pointer" class="el-icon-error"></i></span>   -->
            <img  :class="{'classa': small.name == classa}" style="width:100%;height:100%;" :src="small.imgs" :key="num.name"  alt="">    
        </div>      
      </div>  
    </div>
     <div class="right-form">    
       <div class="material-message">
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
            <div style="width:200px;height:100px;margin-left:50px;">
              <div style="margin-top:10px;text-align:left">尺寸 : 1024*720</div>
              <div style="margin-top:10px;text-align:left">大小 : 14M</div>
              <div style="margin-top:10px;text-align:left">标签:
                <!-- 添加标签 -->
                <el-button size="mini" @click="label">编辑</el-button>
              </div>
            </div>
             <div class="album-button">
              <el-button  style="width:100px;">取消</el-button>
              <el-button type="primary" style="width:100px;">添加 </el-button>
            </div>           
        </div>
       </div>
    </div>
  </div>
</el-dialog>
<!-- 4.添加标签的弹窗 -->
<el-dialog title="标签选择" :visible.sync="addLabel" custom-class="city_list" style="width:950px;margin:0 auto">
  <div style="margin:0 auto">
    <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane v-for="list in Label" :label="list.title" :key="list.key" >
      <div class="add-label">
        <div class="label-name">
          <div style="float:left;line-height:40px">标签:</div>
           <el-input   v-model="labelAdd"  placeholder="请输入6个字符之内的标签" style="width:220px;"></el-input>
           <el-button size="mini" @click="NewLabel(list.key)" type="primary" icon="el-icon-plus" style="float:right;margin-top:6px">添加</el-button>
        </div>
        <div class="select-label">
          <el-checkbox  class="label-check" :label="item.title" :v-model="item.checked" v-for="item in list.LabelIn" :key="item.key"></el-checkbox>        
        </div>
         <div class="material-button">
              <el-button  style="width:100px;" @click="LabelCancel">取消</el-button>
              <el-button type="primary" style="width:100px;">添加 </el-button>
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
        
        // 选中
        classa:'',
        addName:'',
        // 相册第一张图片
        addressImg: '', 
        // 分页
        currentPage1: 5,
        currentPage2: 5,
        currentPage3: 5,
        currentPage4: 4,
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
        // 风景图
        
        marterialist:[{
          name:'0',
          title:'黄金海滩',
          img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530187553628&di=8c6aa1a7b2daa91ff0ea96e42712b5c1&imgtype=0&src=http%3A%2F%2Fimg3.xiazaizhijia.com%2Fwalls%2F20150417%2Fmid_84422024ff063d3.jpg',
          smallImg:[{
          name:'0',
          title:'思考',
          imgs:'http://img07.tooopen.com/images/20180627/tooopen_sy_184051405126879.jpg',
        },{
          name:'1',
          title:'玄冰',
          imgs:'http://img07.tooopen.com/images/20180627/tooopen_sy_183733373374610.jpg',
        },{
          name:'2',
          title:'冰洞',
          imgs:'http://img07.tooopen.com/images/20180627/tooopen_sy_184344434481484.jpg',
        },{
          name:'3',
          title:'山洞',
          imgs:'http://img07.tooopen.com/images/20180627/tooopen_sy_183432343253991.jpg',
        },{
          name:'4',
          title:'潜水',
          imgs:'http://img07.tooopen.com/images/20180627/tooopen_sy_18380238220394.jpg',
        },{
          name:'5',
          title:'城堡',
          imgs:'http://img06.tooopen.com/images/20180603/tooopen_sy_241646862134.jpg',
        },{
          name:'6',
          title:'悬崖',
          imgs:'http://img07.tooopen.com/images/20180627/tooopen_sy_183919391998803.jpg',
        },{
          name:'7',
          title:'乌云',
          imgs:'http://img06.tooopen.com/images/20180320/tooopen_sy_236629122223.jpg',
        }],
        },{
          name:'1',
          title:'巴厘岛',
          img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530187553628&di=8c6aa1a7b2daa91ff0ea96e42712b5c1&imgtype=0&src=http%3A%2F%2Fimg3.xiazaizhijia.com%2Fwalls%2F20150417%2Fmid_84422024ff063d3.jpg',
          smallImg:[{
          name:'0',
          title:'玄冰',
          imgs:'http://img07.tooopen.com/images/20180627/tooopen_sy_183733373374610.jpg',
        },{
          name:'1',
          title:'冰洞',
          imgs:'http://img07.tooopen.com/images/20180627/tooopen_sy_184344434481484.jpg',
        },{
          name:'2',
          title:'田野',
          imgs:'http://img07.tooopen.com/images/20180627/tooopen_sy_11520952981795.jpg',
        }],
       },{
          name:'2',
          title:'澎湖湾',
          img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530187553628&di=8c6aa1a7b2daa91ff0ea96e42712b5c1&imgtype=0&src=http%3A%2F%2Fimg3.xiazaizhijia.com%2Fwalls%2F20150417%2Fmid_84422024ff063d3.jpg',
          smallImg:[{
          name:'0',
          title:'冰洞',
          imgs:'http://img07.tooopen.com/images/20180627/tooopen_sy_184344434481484.jpg',
        },{
          name:'1',
          title:'潜水',
          imgs:'http://img07.tooopen.com/images/20180627/tooopen_sy_183241324193657.jpg',
        }],
        },{
          name:'3',
          title:'加勒比海',
          img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530187553628&di=8c6aa1a7b2daa91ff0ea96e42712b5c1&imgtype=0&src=http%3A%2F%2Fimg3.xiazaizhijia.com%2Fwalls%2F20150417%2Fmid_84422024ff063d3.jpg',
          smallImg:[{
          name:'0',
          title:'山洞',
          imgs:'http://img07.tooopen.com/images/20180627/tooopen_sy_183651365152058.jpg',
        },{
          name:'1',
          title:'洞穴',
          imgs:'http://img07.tooopen.com/images/20180627/tooopen_sy_183614361487177.jpg',
        }],
       }],
        // 相册里面的第一个图片
        addressImg:[{
          img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530187553628&di=8c6aa1a7b2daa91ff0ea96e42712b5c1&imgtype=0&src=http%3A%2F%2Fimg3.xiazaizhijia.com%2Fwalls%2F20150417%2Fmid_84422024ff063d3.jpg',
        }],
        // 相册里面的其他图片
        
        // 素材里面的其他图片
        marterialImg:[{
          name:'0',
          img:'http://img07.tooopen.com/images/20180627/tooopen_sy_183614361487177.jpg',
        },{
          name:'1',
          img:'http://img07.tooopen.com/images/20180614/tooopen_sy_23054854878452.jpg',
        },{
          name:'2',
          img:'http://img07.tooopen.com/images/20180614/tooopen_sl_23073073033462.jpg',
        },{
          name:'3',
          img:'http://img06.tooopen.com/images/20180605/tooopen_sl_241769979233.jpg',
        },{
          name:'4',
          img:'http://img06.tooopen.com/images/20180603/tooopen_sl_241630538194.jpg',
        },{
          name:'5',
          img:'http://img06.tooopen.com/images/20180603/tooopen_sl_241629626259.jpg',
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
        
      },
      // 添加标签
      label(){
        // this.addMaterial = false;
        this.addLabel = true;
        // alert(123);
      },
     // 删除相册图片
     img_close(){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
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
          return resolve([{ name: '北京' }]);
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
     select(a,b,c){
       this.classa = a;
       this.addressImg = b;
       this.album = c;
       
       
     },
    //  点击封面进入相册
     addAlbumImg1(i){
          this.addAlbumImg = true;
          this.num = this.marterialist[i].smallImg;
          this.select(this.marterialist[i].smallImg[0].name,this.marterialist[i].smallImg[0].imgs); 
          this.bb = i;
          this.title = this.marterialist[i].title;
          this.album = this.marterialist[i].smallImg[0].title;
          },
    // 添加标签
    NewLabel(i){
      var text = this.labelAdd.trim();
      if(text){
        this.Label[i].LabelIn.push({title:text});
        this.labelAdd = '';
       }
      },
    // 取消添加标签
    LabelCancel(a){
        this.addLabel = false;
        this.$refs[a].jj.resetFields();

      }
    },
    
  };
</script>

<style>
.classa{
  border: 3px solid #0FB99A;
}
 .header{
    height: 50px;
  }
  .header_add{
    float: left;
  }
  .header_seach{
    float: right;
    margin-left: 100px;
  }
  .search-input{
    width: 353px;
    float: left;
  }
  .search-button{
    float: left;
    margin-left: 20px
  }
.big{
    /* position: relative; */
   width: 100%;
    padding-bottom: 40px;
    overflow: auto;
    /* max-height:80%; */
    /* border:1px solid green; */
}
.add-button{
    /* position:relative; */
    float: left;
}
.top{
    
    width:100%;
    /* border: 1px solid red; */
}
.address-input{
    float: left;
  
    /* position:relative !important; */
    /* float: right; */
    width:350px !important;
    left:32%;
}
.top-button{
    float: left;
    /* margin-top:2px; */
    /* height:35px; */
    /* text-align: center; */
    /* line-height: 35px; */
}
.left-tree{
    /* position: relative; */
      float: left;
      margin-top: 10px;
      width: 400px;
      height: 1000px;
      border:1px solid #fff;
      box-shadow:3px 3px 3px #EDEDED,3px -3px 3px #EDEDED,-3px 3px 3px #EDEDED,-3px -3px 3px #EDEDED;
      margin-top:1.2%;
      margin-left: 5px;
}
.address-big{
    /* position: absolute; */
    /* float: right; */
     /* margin-top:-1060px;
     margin-left:350px; */
    margin-top: 15px;
    float: left;
    width: 1215px;
    /* margin-left:96px; */
    /* border:1px solid pink;  */
}
.address-img{
    position: relative;
    float: left;
    /* left:425px; */
    /* top:30px; */
    /* top:10px; */
    /* margin-bottom:500px; */
    /* margin-top:20px; */
    /* margin-right:20px; */
    margin-left:22px;
    
    margin-bottom:20px;
    width:585px;
    height:490px;
    /* border:1px solid purple; */
}
.marterialist-img{
    width:585px;
    height:400px;
    cursor:pointer;
    /* height:400px; */
    /* border:1px solid red; */
    
}
.introduce{
    /* position:absolute; */
    width:200px;
    height:40px;
    margin-top:16px;
    /* border:1px solid green; */
}
.label{
    float:left;
    width:100px;
    height:40px;
    background:#333;
    text-align: center;
    line-height: 40px;
    color:#E6E6E6;
}
.number{
    /* float:right; */
    /* width:100px; */
    height:40px;
    /* text-align: center; */
    line-height: 40px;
    background:#666;
    color:#E6E6E6;
    
}
.address-name{
    float:left;
    margin-top:16px;
    font-size:20 px;
}
.page{
  float: right;
    margin-right: 68px;
    margin-top: 10px;
}
.add-album{
  margin:0 auto;
  width:3000px;
  margin-left:-500px;
  margin-top:-100px;
}
.add-address-img{
  width:1400px;
  height:800px;
  /* border:1px solid red; */
}
.left-img{
  float:left;
  width:1000px;
  height:800px;
  border:1px solid #fff;
}
.first-img{
  width:1000px;
  height:550px;
  /* border:1px solid green; */
  /* background-image:url('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530187553628&di=8c6aa1a7b2daa91ff0ea96e42712b5c1&imgtype=0&src=http%3A%2F%2Fimg3.xiazaizhijia.com%2Fwalls%2F20150417%2Fmid_84422024ff063d3.jpg');
  background-size: 100% 100%; */
}
.small-img{
  /* float:left; */
  margin-top:13px;
  width:280px;
  height:200px;
  /* 使元素变成行内元素，拥有行内元素的特性，即可以与其他行内元素共享一行，不会独占一行 */
  display:inline-block;
  /* width:25%;
  height:77%; */
  /* border:1px solid yellow; */
  margin-right:17px;
  margin-bottom:30px;
  cursor:pointer
  
}
/* 相册小图片点击之后的样式  */
 .class-a{
   border:1px solid #0FB99A;
 }
.small-box{
  position:absolute;
  width:1000px;
  height:250px;
  /* 段落文本不换行 */
  white-space:nowrap;
  /* 如果横向溢出则提供滚动机制 */
  overflow-x:auto;
  /* 裁剪内容,提供滚动机制 */
  overflow:scroll;
  /* 如果纵向溢出,则不提供滚动机制 */
  overflow-y:hidden;
}
.small_img_close{
  position:absolute;
  margin-left:67.5%;
  top:9.5%;
  font-size:20px;
  /* margin-bottom:-10px; */
  /* margin-left:95%; */
  /* margin-top:10px; */
  /* font-size:18px; */
  /* border:1px solid red; */
}
.material-small-box{
  /* position:absolute; */
  
  margin-top:50px;
  width:1000px;
  height:500px;
 /* border:1px solid red; */
  overflow-x:auto;
  
 
  
}
.material-small-img{
  float:left;
  margin-bottom:17px;
  width:300px;
  height:200px;
  margin-right:17px;
  /* border: solid blue; */
}
.right-form{
  /* position: absolute; */
  float:right;
  width:380px;
  height:800px;
  /* border:1px solid purple; */
}
.album-message{
  width:380px;
  height:320px;
  border:1px solid #E6E6E6;
  margin-bottom:20px;
}
.material-message{
  /* margin-top:20px; */
  width:380px;
  height:350px;
  border:1px solid #E6E6E6;
}
.album-title{
  width:150px;
  height:30px;
  margin-top:17px;
  margin-left:20px;
  /* background:red; */
}
.blue-box{
  float:left;
  width:5px;
  height:30px;
  background:#3095fa;
}
.album-text{
  /* float:left; */
  font-size:20px;
  margin-top:7px;
  margin-left:15px !important;
  line-height:30px;
  /* backgroud:blue; */
}
.album-name{
  float:left;
  margin-top:10px;
  font-size:20px;
}
.album-form{
  width:300px;
  height:200px;
  /* border:1px solid red; */
  margin-top:60px;
  margin-left:20px;
}
.album-button{
  width:250px;
  height:50px;
  margin-left:65px;
  /* margin: 0 auto; */
  /* border:1px solid red; */
}
.material-button{
  width:250px;
  height:50px;
  /* margin-left:40px; */
  margin: 0 auto;
  /* border:1px solid yellow; */
}
/* 上传图片 */
.upload{
  margin-top:14px;
   width:400px;
   /* height:230px; */
  /* border:1px solid purple; */
  border-radius: 20px; 
}
.upload-img{
  width:50px;
  height:50px;
  margin-top:20%;
}
/* 标签内容框 */
.add-label{
  width:400px;
  height:300px;
  /* border: 1px solid blue; */
}
.label-name{
  width:370px;
  height:40px;
  /* border: 1px solid yellow; */
  margin:33px 35px;
  /* margin-top:33px; */
}
.select-label{
  /* float:left; */
  width:430px;
  height:100px;
  overflow: auto;
  margin-right:20px;
  overflow-x:auto;
  margin:25px 0px 60px 0px;
  /* border:1px solid green; */
}
.label-check{
  float:left;
  text-align:left;
  margin-bottom:5px !important;
  margin-right:25px !important;
}
.el-checkbox+.el-checkbox {
    margin-left: 0px;
}
  .clearfix:after{
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  .clearfix{
    zoom:1;
  }
 
</style>
