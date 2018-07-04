<template>
<div>
    <div class="big">
        <div class="top">
            <!-- <el-button class="add-button" type="primary"  >添加相册</el-button> -->
            <el-button type="primary" class="add-button" @click="addAlbum = true">添加相册</el-button>
            <el-input  class="address-input" v-model="haha"  placeholder="目的地/名称"></el-input>
            <el-button class="top-button" type="primary" icon="el-icon-search"></el-button>
        </div>
     
        <div class="left-tree">
           
            <el-tree
              :props="props1"
              :load="loadNode1"
              lazy
            >
            </el-tree>

        </div>
        <!-- 地址图片的最大框框 -->
      <div class="address-big">
            <div class="address-img" v-for="img in marterialist" :key="img.name" >
                <div class="marterialist-img" @click="addAlbumImg1(img.name)">
                    <img style="width:100%;" :src="img.img" alt="">
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
  <el-dialog title="添加相册" :visible.sync="addAlbum"  append-to-body width="20%"  class="clearfix form_left">
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
<el-dialog title="添加照片" :visible.sync="addAlbumImg" style="margin-top:-100px"  append-to-body width="1450px"  class="clearfix form_left">
  <el-form :model="form" :rules="rules" ref="form">
  </el-form>
  <div class="add-address-img">
    <div class="left-img">
      <!-- 第一张图片 -->
      <div class="first-img">
        <img style="width:100%;height:100%;"   :src="this.addressImg"    alt="">
      </div>
      <!-- 其余图片  -->
      <div class="small-box">
        <div v-for="img in marterialist" :key="img.name">
           <div class="small-img"
            v-for="small in num" 
            :key="small.name" 
            :class="{'classa': small.name == classa}"
            @click="select(small.name,small.imgs)" >
            <img style="width:100%;height:100%;" :src="small.imgs" alt="">
            <span class="small_img_close" @click="img_close"><i style="width:20px;cursor:pointer" class="el-icon-error"></i></span>
            
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
              <el-form-item label="名称 :" prop="name" >
                <el-input v-model="materialForm.name" placeholder="请输入素材名称"></el-input>
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
<el-dialog title="添加素材" :visible.sync="addMaterial" style="margin-top:-100px" append-to-body width="1450px"  class="clearfix form_left">
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
        <div class="material-small-img" v-for="img in marterialImg" :key="img.name">
          <img style="width:100%;" :src="img.img" alt="">
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
                <el-input v-model="materialForm.name" placeholder="请输入素材名称"></el-input>
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
<el-dialog title="标签选择" :visible.sync="addLabel" style="width:900px;margin:0 auto">
  <div style="margin:0 auto">
    <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane v-for="list in Label" :label="list.title" :key="list.key">
      <div class="add-label">
        <div class="label-name">
          <div style="float:left;line-height:40px">标签:</div>
           <el-input   v-model="haha"  placeholder="请输入6个字符之内的标签" style="width:220px;"></el-input>
           <el-button  type="primary" icon="el-icon-plus" style="float:right;margin: auto 0;">添加</el-button>
        </div>
        <div class="select-label">
          <el-checkbox  class="label-check" :label="item.title" :v-model="item.checked" v-for="item in list.LabelIn" :key="item.key"></el-checkbox>        
        </div>
         <div class="material-button">
              <el-button  style="width:100px;">取消</el-button>
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
          imgs:'http://img07.tooopen.com/images/20180627/tooopen_sy_184051405126879.jpg',
        },{
          name:'1',
          imgs:'http://img07.tooopen.com/images/20180627/tooopen_sy_183733373374610.jpg',
        },{
          name:'2',
          imgs:'http://img07.tooopen.com/images/20180627/tooopen_sy_184344434481484.jpg',
        },{
          name:'3',
          imgs:'http://img07.tooopen.com/images/20180627/tooopen_sy_183432343253991.jpg',
        },{
          name:'4',
          imgs:'http://img07.tooopen.com/images/20180627/tooopen_sy_18380238220394.jpg',
        },{
          name:'5',
          imgs:'http://img06.tooopen.com/images/20180603/tooopen_sy_241646862134.jpg',
        },{
          name:'6',
          imgs:'http://img07.tooopen.com/images/20180627/tooopen_sy_183919391998803.jpg',
        }],
        },{
          name:'1',
          title:'巴厘岛',
          img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530187553628&di=8c6aa1a7b2daa91ff0ea96e42712b5c1&imgtype=0&src=http%3A%2F%2Fimg3.xiazaizhijia.com%2Fwalls%2F20150417%2Fmid_84422024ff063d3.jpg',
          smallImg:[{
          name:'0',
          imgs:'http://img07.tooopen.com/images/20180627/tooopen_sy_183733373374610.jpg',
        },{
          name:'1',
          imgs:'http://img07.tooopen.com/images/20180627/tooopen_sy_184344434481484.jpg',
        }],
       },{
          name:'2',
          title:'澎湖湾',
          img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530187553628&di=8c6aa1a7b2daa91ff0ea96e42712b5c1&imgtype=0&src=http%3A%2F%2Fimg3.xiazaizhijia.com%2Fwalls%2F20150417%2Fmid_84422024ff063d3.jpg',
          smallImg:[{
          name:'0',
          imgs:'http://img07.tooopen.com/images/20180627/tooopen_sy_184344434481484.jpg',
        }],
        },{
          name:'3',
          title:'加勒比海',
          img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530187553628&di=8c6aa1a7b2daa91ff0ea96e42712b5c1&imgtype=0&src=http%3A%2F%2Fimg3.xiazaizhijia.com%2Fwalls%2F20150417%2Fmid_84422024ff063d3.jpg',
          smallImg:[{
          name:'0',
          imgs:'http://img07.tooopen.com/images/20180627/tooopen_sy_18380238220394.jpg',
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
          img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530187553628&di=8c6aa1a7b2daa91ff0ea96e42712b5c1&imgtype=0&src=http%3A%2F%2Fimg3.xiazaizhijia.com%2Fwalls%2F20150417%2Fmid_84422024ff063d3.jpg',
        },{
          name:'1',
          img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530187553628&di=8c6aa1a7b2daa91ff0ea96e42712b5c1&imgtype=0&src=http%3A%2F%2Fimg3.xiazaizhijia.com%2Fwalls%2F20150417%2Fmid_84422024ff063d3.jpg',
        },{
          name:'2',
          img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530187553628&di=8c6aa1a7b2daa91ff0ea96e42712b5c1&imgtype=0&src=http%3A%2F%2Fimg3.xiazaizhijia.com%2Fwalls%2F20150417%2Fmid_84422024ff063d3.jpg',
        },{
          name:'3',
          img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530187553628&di=8c6aa1a7b2daa91ff0ea96e42712b5c1&imgtype=0&src=http%3A%2F%2Fimg3.xiazaizhijia.com%2Fwalls%2F20150417%2Fmid_84422024ff063d3.jpg',
        },{
          name:'4',
          img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530187553628&di=8c6aa1a7b2daa91ff0ea96e42712b5c1&imgtype=0&src=http%3A%2F%2Fimg3.xiazaizhijia.com%2Fwalls%2F20150417%2Fmid_84422024ff063d3.jpg',
        },{
          name:'5',
          img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530187553628&di=8c6aa1a7b2daa91ff0ea96e42712b5c1&imgtype=0&src=http%3A%2F%2Fimg3.xiazaizhijia.com%2Fwalls%2F20150417%2Fmid_84422024ff063d3.jpg',
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
            key:'1',
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
     select(a,b){
      //  alert(123);
      // alert(this.smallImg.key);
       this.classa = a;
      //  alert(b);
      //  this.addressImg.img == b;
       this.addressImg = b;
      //  alert(this.addressImg);
     },
     addAlbumImg1(i){
            // alert(this.marterialist[$i].name);
            // alert(i);
            // alert(this.marterialist[i].title);
            
            // alert(this.marterialist[i].smallImg[0].imgs);
            
            this.addAlbumImg = true;

            this.num = this.marterialist[i].smallImg;


            this.select(this.marterialist[i].smallImg[0].name,this.marterialist[i].smallImg[0].imgs);

            // alert(this.marterialist[i].smallImg[0].name);
            
            // console.log(this.marterialist);
            
          },
    },
    
  };
</script>

<style>
.classa{
  border: 5px solid #0FB99A;
}
.big{
    /* position: relative; */
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
    position:relative !important;
    /* float: right; */
    width:350px !important;
    left:32%;
}
.top-button{
    float:right;
    /* margin-top:2px; */
    /* height:35px; */
    /* text-align: center; */
    /* line-height: 35px; */
}
.left-tree{
    /* position: relative; */
    float:left;
    margin-top:20px;
    /* margin-right:20px; */
    width:305px;
    height:1055px;
    border:1px solid #ccc; 
}
.address-big{
    /* position: relative; */
    float: right;
     margin-top:-1060px;
     margin-left:350px;
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
.marterialist-img{
    width:100%;
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
  margin-left:-1.5%;
  /* margin-left:95%; */
  /* margin-top:10px; */
  /* font-size:18px; */
  /* border:1px solid red; */
}
.material-small-img{
  float:left;
  margin-top:17px;
  width:280px;
  height:200px;
  margin-right:17px;
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
  width:350px;
  height:40px;
  /* border: 1px solid yellow; */
  margin:33px auto 0;
  /* margin-top:33px; */
}
.select-label{
  /* float:left; */
  overflow: auto;
  /* margin-left:20px; */
  
  margin:25px 0px 60px 30px;
  /* border:1px solid green; */

}
.label-check{
  float:left;
  text-align:left;
  margin-bottom:5px;
  width:25%;
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
