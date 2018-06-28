<template>
<div>
    <div class="big">
        <div class="top">
            <!-- <el-button class="add-button" type="primary"  >添加相册</el-button> -->
            <el-button type="primary" class="add-button" @click="addAlbum = true">添加相册</el-button>
            <el-input  class="address-input" v-model="haha"  placeholder="目的地/名称"></el-input>
            <el-button class="top-button" type="primary" icon="el-icon-search"></el-button>
        </div>
        <div class="address-list">
            <el-tree :data="data3" node-key="id"></el-tree>
        </div>
        <!-- 地址图片的最大框框 -->
      <div class="address-big">
            <div class="address-img">
                <div class="img" @click="addAlbumImg = true">

                </div>
                <!-- 图片介绍 -->
                <div class="introduce">
                    <!-- 图片标签 -->
                    <div class="label">标签</div>
                    <!-- 图片数量 -->
                    <div class="number">5张</div>
                </div>
                <!-- 景点名称 -->
                <div class="address-name">
                    强哥故居1
                </div>

            </div>
             <div class="address-img">
                <div class="img">

                </div>
                <!-- 图片介绍 -->
                <div class="introduce">
                    <!-- 图片标签 -->
                    <div class="label">标签</div>
                    <!-- 图片数量 -->
                    <div class="number">5张</div>
                </div>
                <!-- 景点名称 -->
                <div class="address-name">
                    强哥故居2
                </div>

            </div>
              <div class="address-img">
                <div class="img">

                </div>
                <!-- 图片介绍 -->
                <div class="introduce">
                    <!-- 图片标签 -->
                    <div class="label">标签</div>
                    <!-- 图片数量 -->
                    <div class="number">5张</div>
                </div>
                <!-- 景点名称 -->
                <div class="address-name">
                    强哥故居2
                </div>

            </div>
              <div class="address-img">
                <div class="img">

                </div>
                <!-- 图片介绍 -->
                <div class="introduce">
                    <!-- 图片标签 -->
                    <div class="label">标签</div>
                    <!-- 图片数量 -->
                    <div class="number">5张</div>
                </div>
                <!-- 景点名称 -->
                <div class="address-name">
                    强哥故居2
                </div>

            </div>
    </div>

    <!-- 所有的弹窗 -->
    <!-- 1.添加相册的弹窗 -->
  <el-dialog title="添加相册" :visible.sync="addAlbum" style="width:1000px;margin:0 auto;">
  <el-form :model="form" :rules="rules" ref="form">
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
<el-dialog title="添加照片" :visible.sync="addAlbumImg" class="add-album">
  <el-form :model="form" :rules="rules" ref="form">
  </el-form>
  <div class="add-address-img">
    <div class="left-img">
      <div class="first-img">

      </div>
      <div class="small-img">

      </div>
      <div class="small-img">

      </div>
      <div class="small-img">

      </div>
      
    </div>
     <div class="right-form">
       <div class="album-message">
         <!-- 表格头部 -->
        <div class="album-title">
          <div class="blue-box"></div>
          <div class="album-text">相册信息</div>
        </div>
        <div class="album-name">大帅府</div>
        <div class="album-form">
            <el-form :model="albumForm" :rules="albumRules" ref="albumForm" label-width="100px" >
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
            <el-form :model="materialForm" :rules="materialRules" ref="materialForm" label-width="100px" >
              <el-form-item label="类型 :" prop="name">
                <el-input v-model="materialForm.name"></el-input>
                </el-form-item>
            </el-form>
            <div style="width:200px;height:100px;margin-left:50px;">
              <div style="margin-top:10px;text-align:left">尺寸 : 1024*720</div>
              <div style="margin-top:10px;text-align:left">大小 : 14M</div>
              <div style="margin-top:10px;text-align:left">标签:
                <el-button size="mini" round>超小按钮</el-button>
              </div>
            </div>
            
        </div>
       </div>
    </div> 
  </div> 
</el-dialog>

<!-- 3.添加素材弹窗 -->
<el-dialog title="添加素材" :visible.sync="addMaterial" class="add-album">
  <el-form :model="form" :rules="rules" ref="form">
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
      <div style="margin-top:50px">
        <div class="small-img">

        </div>
        <div class="small-img">

        </div>
        <div class="small-img">

        </div>
        <div class="small-img">

        </div>
        <div class="small-img">

        </div>
        <div class="small-img">

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
            <el-form :model="materialForm" :rules="materialRules" ref="materialForm" label-width="100px" >
              <el-form-item label="名称 :" prop="name">
                <el-input v-model="materialForm.name"></el-input>
                </el-form-item>
            </el-form>
            <div style="width:200px;height:100px;margin-left:50px;">
              <div style="margin-top:10px;text-align:left">尺寸 : 1024*720</div>
              <div style="margin-top:10px;text-align:left">大小 : 14M</div>
              <div style="margin-top:10px;text-align:left">标签:
                <!-- 添加标签 -->
                <el-button size="mini" @click="label">添加</el-button>
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
<el-dialog title="标签选择" :visible.sync="addLabel" style="width:900px;margin:0 auto">
  <div style="margin:0 auto">
    <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="景点" v-for="(item) in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
    >
      <div class="add-label">
        <div class="label-name">
          <div style="float:left;line-height:40px">标签:</div>
           <el-input   v-model="haha"  placeholder="请输入6个字符之内的标签" style="width:220px;"></el-input>
           <el-button  type="primary" icon="el-icon-plus" style="float:right;margin: auto 0;">添加</el-button>
        </div>
        <div class="select-label">
          <el-checkbox v-model="checked" class="label-check">备选项</el-checkbox>
          <el-checkbox v-model="checked" class="label-check">备选项</el-checkbox>
          <el-checkbox v-model="checked" class="label-check">备选项</el-checkbox>
          <el-checkbox v-model="checked" class="label-check">备选项</el-checkbox>
                
        </div>
         <div class="album-button">
              <el-button  style="width:100px;">取消</el-button>
              <el-button type="primary" style="width:100px;">添加 </el-button>
        </div>
      </div>
      
    </el-tab-pane>
    <!-- <el-tab-pane label="美食" ></el-tab-pane>
    <el-tab-pane label="购物" ></el-tab-pane>
    <el-tab-pane label="住宿" ></el-tab-pane>
    <el-tab-pane label="娱乐" ></el-tab-pane>
    <el-tab-pane label="其他" ></el-tab-pane> -->
  </el-tabs>
  </div>
   
</el-dialog>
           
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
 
</div>
</template>

<script>
  export default {
    data() {
        
      return {
       
        currentPage1: 5,
        currentPage2: 5,
        currentPage3: 5,
        currentPage4: 4,
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
        // 标签循环信息
         editableTabs: [{
          title: '景点',
          name: '0',
        }, {
          title: '美食',
          name: '1',
        },{
          title: '购物',
          name: '2',
        },{
          title: '住宿',
          name: '3',
        },{
          title: '娱乐',
          name: '4',
        },{
          title: '其他',
          name: '5',
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        // 添加相册隐藏
        addAlbum : false,
        // 相册添加照片隐藏
        addAlbumImg : false,
        // 添加素材
        addMaterial : false,
        // 添加标签
        addLabel : false,
        haha:'',
        materialRules: '',
        albumRules: '',
        checked:'',
         handleClick(tab, event) {
        console.log(tab, event);
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
        this.addAlbumImg = false;        
        this.addMaterial = true;
      },
      // 添加标签
      label(){
        this.addMaterial = false;
        this.addLabel = true;
        // alert(123);
      }
    },
    
  };
</script>

<style>
.big{
    /* position:absolute; */
    width:1600px;
    height:1200px;
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
    position:relative;
    /* float: right; */
    width:350px;
    left:32%;
}
.top-button{
    float:right;
    /* margin-top:2px; */
    /* height:35px; */
    /* text-align: center; */
    /* line-height: 35px; */
}
.address-list{
    float:left;
    margin-top:20px;
    margin-right:20px;
    width:305px;
    height:1055px;
    border:1px solid #ccc; 
}
.address-big{
    position: relative;
    float: left;
     margin-top:20px;
     margin-left:56px;
    width:1215px;
    height:1010px;
    /* border:1px solid pink; */
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
    margin-left:20px;
    
    margin-bottom:20px;
    width:585px;
    height:490px;
    /* border:1px solid purple; */
}
.img{
    width:100%;
    height:400px;
    /* border:1px solid red; */
    background-image:url('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530187553628&di=8c6aa1a7b2daa91ff0ea96e42712b5c1&imgtype=0&src=http%3A%2F%2Fimg3.xiazaizhijia.com%2Fwalls%2F20150417%2Fmid_84422024ff063d3.jpg');
    
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
    background:turquoise;
    text-align: center;
    line-height: 40px;
}
.number{
    /* float:right; */
    /* width:100px; */
    height:40px;
    /* text-align: center; */
    line-height: 40px;
    background:yellowgreen;
}
.address-name{
    float:left;
    margin-top:16px;
    font-size:20 px;
}
.page{
    width:730px;
    height:32px;
    /* border:1px solid rebeccapurple; */
    margin-top:1050px;
    margin-left:920px;
}
.add-album{
  width:3000px;
  margin-left:-500px;
  margin-top:-100px;
}
.add-address-img{
  width:1400px;
  height:800px;
  border:1px solid red;
}
.left-img{
  float:left;
  width:1000px;
  height:800px;
  border:1px solid blue;
}
.first-img{
  width:1000px;
  height:500px;
  /* border:1px solid green; */
  background-image:url('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530187553628&di=8c6aa1a7b2daa91ff0ea96e42712b5c1&imgtype=0&src=http%3A%2F%2Fimg3.xiazaizhijia.com%2Fwalls%2F20150417%2Fmid_84422024ff063d3.jpg');
  background-size: 100% 100%;
}
.small-img{
  float:left;
  margin-top:17px;
  width:280px;
  height:200px;
  /* border:1px solid yellow; */
  margin-right:17px;
  background-image:url('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530187553628&di=8c6aa1a7b2daa91ff0ea96e42712b5c1&imgtype=0&src=http%3A%2F%2Fimg3.xiazaizhijia.com%2Fwalls%2F20150417%2Fmid_84422024ff063d3.jpg');
  background-size: 100% 100%;
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
  border:1px solid green;
  margin-bottom:20px;
}
.material-message{
  /* margin-top:20px; */
  width:380px;
  height:350px;
  border:1px solid green;
}
.album-title{
  width:150px;
  height:30px;
  margin-top:17px;
}
.blue-box{
  float:left;
  width:5px;
  height:30px;
  background:#3095fa;
}
.album-text{
  float:left;
  font-size:20px;
  margin-top:7px;
  margin-left:15px;
}
.album-name{
  float:left;
  margin-top:10px;
  font-size:22px;
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
  margin-left:40px;
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
  width:350px;
  height:40px;
  /* border: 1px solid yellow; */
  margin:33px auto 0;
  /* margin-top:33px; */
}
.select-label{
  /* float:left; */
  margin:25px 0px 60px 0px;
  /* border:1px solid green; */
}
.label-check{
  /* float:left; */
  margin-right:5px

}
</style>
