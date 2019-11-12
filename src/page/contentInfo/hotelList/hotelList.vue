<template>
  <div class="all">
    <!--头部搜索bg-->
    <div class="header">
        <div class="header_add">
          <el-button type="primary" @click="addhotel">添加酒店</el-button>
        </div>
        <div class="header_seach">
          <div class="search-input">
            <el-input v-model="search_text" placeholder="请输入中文名称\英文名称\目的地"  clearable></el-input>
          </div>
          <div class="search-button">
            <el-button  size="medium" type="primary" icon="el-icon-search" ></el-button>
          </div>
        </div>
    </div>
    <!--头部搜索ed-->
    <!--left tree begin-->
    <div class="left_tree">
      <div class="tree_size">
        <el-tree
          :props="props1"
          :load="loadNode1"
          lazy
            >
        </el-tree>
      </div>
    </div>
    <!--left tree end-->
    <!--right img begin-->
    <div class="img" @click="addhotel">
      <div class="img_border" v-for="(item,index) of img" :key=""index>
        <div class="image_size">
          <img :src="item.imgUrl" class="img_item" >
        </div>
        <div class="hotchi" v-model="item.hotelchina">{{item.hotelchina}}</div>
        <div class="hoteng" v-model="item.hotelenglish">{{item.hotelenglish}}</div>
        <div class="start">
          <el-rate
            v-model="item.value5"
            disabled
            text-color="#ff9900"
            score-template="{item.value}">
          </el-rate>
        </div>
      </div>
    </div>
    <!--right img end-->
    <!--page begin-->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        background
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination>
    </div>
    <!--page end-->
    <!--弹出层bg-->
    <div>

      <el-dialog title="新增和编辑页面" :visible.sync="dialogFormVisible" width="80%" class="clearfix form_left" >
        <div class="info_title">
          基础信息
        </div>
        <el-form  :model="ruleForm" :rules="rules" ref="ruleForm" :inline="true" class="clearfix form_left" >
          <div class="left_input">
          <el-form-item label="中文名称" prop="NameChn" >
            <el-input v-model="ruleForm.NameChn"></el-input>
          </el-form-item>
          <el-form-item label="英文名称" prop="NameEng" >
            <el-input v-model="ruleForm.NameEng"></el-input>
          </el-form-item>
          <el-form-item label="中文地址" prop="Address">
            <el-input v-model="ruleForm.Address"></el-input>
          </el-form-item>
          <el-form-item label="英文地址" prop="AddressEng">
            <el-input v-model="ruleForm.AddressEng"></el-input>
          </el-form-item>
            <el-form-item label="所属地区" prop="area">
              <el-select v-model="ruleForm.area" placeholder="请选择活动区域" class="select">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
        </div>
          <div class="middle_input">
            <el-form-item label="星级" prop="Star">
              <el-select v-model="ruleForm.Star" placeholder="请选择星级" class="select">
                <el-option label="一星" value="1"></el-option>
                <el-option label="二星" value="2"></el-option>
                <el-option label="三星" value="3"></el-option>
                <el-option label="四星" value="4"></el-option>
                <el-option label="五星" value="5"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="经度" prop="Longitude">
              <el-input v-model="ruleForm.Longitude"></el-input>
            </el-form-item>
            <el-form-item label="纬度" prop="Latitude">
              <el-input v-model="ruleForm.Latitude"></el-input>
            </el-form-item>
            <el-form-item label="评分" prop="CommentScore">
              <el-input v-model="ruleForm.CommentScore"></el-input>
            </el-form-item>
          </div>
          <div class="right_input">
            <el-form-item label="备注" >
              <el-input
                type="textarea"
                :rows="13"
                placeholder="请输入内容"
                width="50%"
                class="textarea_size"
              >
              </el-input>
            </el-form-item>
          </div>
          <div class="introduction">
            <el-form-item label="简介" >
              <el-input
                type="textarea"
                :rows="17"
                placeholder="请输入内容"
                class="introduction_area"
              >
              </el-input>
            </el-form-item>
          </div>
          <div class="info_title">
            设施列表
          </div>
          <!--添加设施bg-->
          <div class="facilities">
            <div>
              <el-button type="primary" style="width: 200px;" @click="add_shebei">添加新设施</el-button>
            </div>
            <div class="add_facilities"
                 v-for="(domain, index) in ruleForm1.domains"
                 :key="domain.key"
                 :prop="'domains.' + index + '.value'"
                 v-model="ruleForm1"

            >
              <div class="qq" @click.prevent="tanchu(domain)">
              <el-form-item label="中文设施名"   class="facilities_name">
                <el-input v-model="domain.namechina" disabled></el-input>
              </el-form-item>
              <el-form-item label="英文设施名"  >
                <el-input v-model="domain.nameenglish" disabled></el-input>
              </el-form-item>
              <el-form-item label="设施简介">
                <el-input v-model="domain.info" disabled></el-input>
              </el-form-item>
                </div>
              <div>
                <el-button type="warning"  @click.prevent="removeDomain(domain)" size="mini">删除</el-button>
              </div>
            </div>
          </div>
          <div class="info_title">
            图片列表
          </div>
          <div class="add_img">
            <el-button type="primary" style="width: 200px; " @click="add_image_style" >添加图片</el-button>
          </div>
          <div class="image_border">

            <div
              class="image_kuang"
              v-for="(domain, index) in image.domains"
                 :key="domain.key"
              v-model="image"
              >
              <img  class="ima_kuang" v-model="image" :src=domain.url  @click="find_image(domain)" />
              <div class="image_exit" @click="img_delete(domain)">
              </div>
            </div>
          </div>
        </el-form>
        <div>
          <el-dialog title="查看素材" :visible.sync="find_img" append-to-body width="90%"  class="clearfix form_left" >
              <div class="zong_border clearfix">
                <div class="left_border">
                  <div class="left_img">
                    <img  style="width: 920px; height: 500px;" src="http://victor-t.cn/7.png" >
                  </div>
                  <div class="delete_img">
                    <el-button type="primary" style=" width: 150px;">移除图片<i class="el-icon-upload el-icon--right"></i></el-button>
                  </div>
                </div>
                <div class="right_border">
                  <div class="photo_info">
                    <div>相册信息</div>
                    <div style="font-size: 16px; font-weight: bold;">大帅府</div>
                    <div class="font_info">类型： 景点</div>
                    <div class="font_info">目的地： 沈阳</div>
                  </div>
                  <div class="shucai_info">
                    <div>素材信息</div>
                    <div style="font-size: 16px; font-weight: bold;">大帅府</div>
                    <div class="kuang_bor">
                      <el-form  :inline="true"  >
                          <el-form-item label="名称：">
                              <el-input ></el-input>
                          </el-form-item>
                        <el-form-item label="尺寸：">
                          <el-input ></el-input>
                        </el-form-item>
                        <el-form-item label="大小：">
                          <el-input ></el-input>
                        </el-form-item>
                          <el-tag
                            class="tag_info"
                            v-for="tag in tags"
                            :key="tag.name"
                            closable
                            @close="handleClose(tag)"
                            :type="tag.type">
                            {{tag.name}}
                          >
                          </el-tag>
                      </el-form>
                    </div>
                  </div>
                </div>
              </div>
          </el-dialog>
        </div>

        <div>
          <el-dialog title="设备列表" :visible.sync="shebeiWindow" append-to-body width="20%">
            <el-form :model="form">
              <el-form-item label="中文设备名" :label-width="formLabelWidth">
                <el-input v-model="form.china" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="英文设备名" :label-width="formLabelWidth">
                <el-input v-model="form.english" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="设备简称" :label-width="formLabelWidth">
                <el-input v-model="form.info" auto-complete="off"></el-input>
              </el-form-item>
              <input type="hidden" v-model="hidval" value="hidval"/>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="shebeiChange()">确 定</el-button>
            </div>
          </el-dialog>
        </div>

        <div>
          <el-dialog
            width="50%"
            title="添加图片"
            :visible.sync="img_change"
            append-to-body>
            <div class="big_img clearfix">
              <div class="select_img">
                  <el-button class="butn" type="primary" @click="sele_img">选取图片<i class="el-icon-upload el-icon--right"></i></el-button>
              </div>
              <div class="upload_img">
                <div>
                  <el-button class="butn" type="primary" @click="uplo_img">上传图片<i class="el-icon-upload el-icon--right"></i></el-button>
                </div>
              </div>
            </div>
          </el-dialog>
        </div>
        <!--11-->
        <div>
          <el-dialog
            width="80%"
            title="选取图片"
            :visible.sync="se_img"
            append-to-body>
            <div class="clearfix">
              <div class="sea_buton">
                <el-button type="primary" style="float: left">添加</el-button>
                <div class="input_wid">
                  <el-input
                      placeholder="请输入内容"
                      clearable
                    style="width: 182px"
                  >
                  </el-input>
                  <el-button type="primary" >搜索</el-button>
                </div>
              </div>
              <div class="input_img">
                <el-form >
                  <el-form-item label="所属地区" :label-width="formLabelWidth">
                      <el-select v-model="ruleForm.area" placeholder="请选择活动区域" >
                      <el-option label="区域一" value="shanghai"></el-option>
                      <el-option label="区域二" value="beijing"></el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="类型" :label-width="formLabelWidth">
                    <el-select v-model="ruleForm.area" placeholder="请选择活动区域" >
                      <el-option label="区域一" value="shanghai"></el-option>
                      <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="相册" :label-width="formLabelWidth">
                    <el-select v-model="ruleForm.area" placeholder="请选择活动区域" >
                      <el-option label="区域一" value="shanghai"></el-option>
                      <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>
              <div class="input_rig_img">
                <div
                  class="inp_i"
                  v-for="(domain, index) in image1.domains"
                  :key="domain.key"
                  v-model="image1"
                >
                  <img  class="inp_ii" v-model="image1" :src=domain.url />
                </div>
              </div>
            </div>
          </el-dialog>
        </div>
        <!--11-->

        <!--22-->
        <div>
          <el-dialog
            width="80%"
            title="选取图片"
            :visible.sync="up_img"
            append-to-body>
            <div class="clearfix">
              <div class="sea_buton">
                <el-button type="primary" style="float: left">上传并选取</el-button>
                <el-button  style="float: left" @click="createdImg">创建相册</el-button>
                <div class="input_wid">
                  <el-input
                    placeholder="请输入内容"
                    clearable
                    style="width: 182px"
                  >
                  </el-input>
                  <el-button type="primary" >搜索</el-button>
                </div>
              </div>
              <div class="input_img">
                <el-form >
                  <el-form-item label="所属地区" :label-width="formLabelWidth">
                    <el-select v-model="ruleForm.area" placeholder="请选择活动区域" >
                      <el-option label="区域一" value="shanghai"></el-option>
                      <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="类型" :label-width="formLabelWidth">
                    <el-select v-model="ruleForm.area" placeholder="请选择活动区域" >
                      <el-option label="区域一" value="shanghai"></el-option>
                      <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="相册" :label-width="formLabelWidth">
                    <el-select v-model="ruleForm.area" placeholder="请选择活动区域" >
                      <el-option label="区域一" value="shanghai"></el-option>
                      <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>
              <div class="input_rig_img">
                <el-upload
                  class="upload-demo"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :file-list="fileList2"
                  list-type="picture">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>

              </div>
            </div>
          </el-dialog>
        </div>
        <!--22-->

        <!--创建相册bg-->
        <div>
          <el-dialog
            width="20%"
            title="创建相册"
            :visible.sync="create_img"
            append-to-body>
            <div class="clearfix">
              <el-form :model="img_name">
                <el-form-item label="名称" :label-width="formLabelWidth">
                  <el-input v-model="img_name.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="类型" :label-width="formLabelWidth">
                  <el-input v-model="img_name.type" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="目的地" :label-width="formLabelWidth">
                  <el-input v-model="img_name.address" auto-complete="off"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" >确 定</el-button>
              </div>
            </div>
          </el-dialog>
        </div>
        <!--创建相册end-->




        <!--添加设施end-->
        <div slot="footer" class="dialog-footer">
          <el-button type="primary"  @click="submitForm('ruleForm')" >确认</el-button>
          <el-button  @click="dialogFormVisible = false">取消</el-button>
        </div>
      </el-dialog>
    </div>
    <!--弹出层end-->
  </div>

</template>
<script>
  export default {
    data() {
      var checkLongitude = (rule, value, callback) => {
        if(!value){
          return callback(new Error('经度不能为空'));
        }
        var reg = /^[0-9]+.?[0-9]*$/;
        if (!reg.test(value)) {
          return callback(new Error('请输入数字'));
        }
        callback()
      };
      var checkLatitude = (rule, value, callback) => {
        if(!value){
          return callback(new Error('纬度不能为空'));
        }
        var reg = /^[0-9]+.?[0-9]*$/;
        if (!reg.test(value)) {
          return callback(new Error('请输入数字'));
        }
        callback()
      };
      var checkCommentScore = (rule, value, callback) => {

        var reg = /^([1-9]\d?|100)$/;
        if(value){
          if (!reg.test(value)) {
            return callback(new Error('请输入1-100的数字'));
          }
        }
        callback()
      };
      var checkarea = (rule, value, callback) => {
        if(!value){
          return callback(new Error('所属地区不能为空'));
        }
        callback()
      };
      var checkNameChn = (rule, value, callback) => {
        if(!value){
          return callback(new Error('中文名称不能为空'));
        }
        callback()
      };
      var checkAddress = (rule, value, callback) => {
        if(!value){
          return callback(new Error('中文地址不能为空'));
        }
        callback()
      };
      return {
        create_img:false,
        fileList2: [
          {name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
          },
          {name: 'food2.jpeg',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
          }],
        se_img:false,
        up_img:false,
        img_change:false,
        hidval:-1,
        shebeiWindow:false,
        img_name:{
          name: '',
          type: '',
          address: '',
        }
        ,
        form: {
          china: '',
          english: '',
          info: '',

        },
        tags: [
          { name: '标签一', type: '' },
          { name: '标签二', type: 'success' },
          { name: '标签三', type: 'info' },
          { name: '标签四', type: 'warning' },
          { name: '标签五', type: 'danger' }
        ],
        image1:{
          domains: [{
            url: 'http://victor-t.cn/7.png',
          },{
            url: 'http://victor-t.cn/7.png',
          },{
            url: 'http://victor-t.cn/7.png',
          },{
            url: 'http://victor-t.cn/7.png',
          },{
            url: 'http://victor-t.cn/7.png',
          },{
            url: 'http://victor-t.cn/7.png',
          }
          ]
        },
        image:{
          domains: [{
            url: 'http://victor-t.cn/7.png',
          },{
            url: 'http://victor-t.cn/7.png',
          },{
            url: 'http://victor-t.cn/7.png',
          }
          ]
        },
        ruleForm1: {
          domains: [{
            value: '',
            namechina:'12',
            nameenglish:'12',
            info:'12'
          }],
        },
        dialogFormVisible: false,
        ruleForm: {
          NameChn: '',
          NameEng:'',
          Address:'',
          AddressEng:'',
          area:'',
          Star:'',
          region: '',
          Longitude:'',
          Latitude:'',
          CommentScore:'',
          desc: ''
        },
        rules: {
          NameChn: [
            {validator: checkNameChn,trigger: 'blur' }
          ],
          Address: [
            {validator: checkAddress,trigger: 'blur' }
         ],
          area: [
            {validator: checkarea,trigger: 'blur' }
          ],
          Longitude: [
              {validator: checkLongitude,trigger: 'blur' }
            ],
          Latitude: [
            {validator: checkLatitude,trigger: 'blur' }
          ],
          CommentScore: [
            {validator: checkCommentScore,trigger: 'blur' }
          ],


        },
        formLabelWidth: '120px',
        img:[
          {
            imgUrl:'http://victor-t.cn/7.png',
            hotelchina:'平八茶楼酒店',
            hotelenglish:'Heihachi Tea House Inn',
            value5: 3.7,
          }, {
            imgUrl:'http://victor-t.cn/7.png',
            hotelchina:'平八茶楼酒店',
            hotelenglish:'Heihachi Tea House Inn',
            value5: 3.7,
          },
          {
            imgUrl:'http://victor-t.cn/7.png',
            hotelchina:'平八茶楼酒店',
            hotelenglish:'Heihachi Tea House Inn',
            value5: 3.7,
          },{
            imgUrl:'http://victor-t.cn/7.png',
            hotelchina:'平八茶楼酒店',
            hotelenglish:'Heihachi Tea House Inn',
            value5: 3.7,
          },{
            imgUrl:'http://victor-t.cn/7.png',
            hotelchina:'平八茶楼酒店',
            hotelenglish:'Heihachi Tea House Inn',
            value5: 3.7,
          },{
            imgUrl:'http://victor-t.cn/7.png',
            hotelchina:'平八茶楼酒店',
            hotelenglish:'Heihachi Tea House Inn',
            value5: 3.7,
          }
        ],
        currentPage4: 4,
        search_text:'',
        props1: {
          label: 'name',
          // children: 'zones',
          // isLeaf: 'leaf'
        },
        find_img:false
      }
    },
    methods: {
      createdImg(){
         this.create_img = true

      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      sele_img(){
        this.se_img = true
      },
      uplo_img(){
        this.up_img = true
      },
      add_image_style(){
       this.img_change = true
      },

      handleClose(tag){
        this.tags.splice(this.tags.indexOf(tag), 1)
      },
      //查看素材
      find_image(item){
        this.find_img = true
      },
      //图片删除
      img_delete(item){
        var index = this.image.domains.indexOf(item)
        this.image.domains.splice(index, 1)

      },
      shebeiChange(){

        this.ruleForm1.domains[this.hidval].namechina = this.form.china
        this.ruleForm1.domains[this.hidval].nameenglish =this.form.english
        this.ruleForm1.domains[this.hidval].info =this.form.info
        this.shebeiWindow = false
      },
      tanchu(item){
      this.shebeiWindow = true
        var index = this.ruleForm1.domains.indexOf(item)
        this.hidval = index
        this.form.china = this.ruleForm1.domains[this.hidval].namechina
        this.form.english = this.ruleForm1.domains[this.hidval].nameenglish
        this.form.info = this.ruleForm1.domains[this.hidval].info
        //console.log(this.ruleForm1.domains.indexOf(item))
      },
      removeDomain(item) {
        var index = this.ruleForm1.domains.indexOf(item)

        if (index !== -1) {
          this.ruleForm1.domains.splice(index, 1)
        }
      },

        add_shebei() {
          this.ruleForm1.domains.push({
            value: '',
            namechina:'',
            nameenglish:'',
            info:'',
            key: Date.now()
          });
        },
      //添加酒店
      addhotel(){
        this.dialogFormVisible =  true
      },
      //添加酒店确认按钮
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      loadNode1(node, resolve) {
        console.log(node)
        if (node.level === 0) {
          //获取顶级组织
          return resolve([{ name: 'region' },{name:'qqq'}]);
        }
        if (node.level > 1) return resolve([]);

        setTimeout(() => {
          const data = [{
            name: 'leaf',
            leaf: true
          }, {
            name: 'zone'
          }];

          resolve(data);
        }, 500);
      }
    }



  }
</script>

<style scoped>
  .all{
    width: 100%;
    padding-bottom: 40px;
    overflow: auto;
  }
  .header{
    height: 50px;
  }
  .header_add{
    float: left;
  }
  .header_seach{
    float: right;
    margin-right: 80px;
  }
  .search-input{
    width: 353px;
    float: left;
  }
  .search-button{
    float: left;
    margin-left: 20px
  }
  .left_tree {
      float: left;
      margin-top: 10px;
      width: 400px;
      height: 70%;
      border:1px solid #fff;
      box-shadow:3px 3px 3px #EDEDED,3px -3px 3px #EDEDED,-3px 3px 3px #EDEDED,-3px -3px 3px #EDEDED;
      margin-left: 5px;
  }
  .tree_size{
    margin: 0 auto;
    padding-top: 10px;
    width: 300px;
    height: 500px;
    overflow: auto;
  }
  .img{
    margin-top: 10px;
    float: left;
    width: 66%;
    /*width: 1157px;*/
  }
  .image_size{

  }
  .img_border{
    margin-left: 20px;
    margin-bottom: 10px;
  /*  width: 550px;
    height: 480px;*/
    width: 31%;
    float: left;
  }
  .block{
    float: right;
    margin-right: 68px;
    margin-top: 10px;
  }
  .hotchi{
    text-align: left;
    font-weight: bolder;
    margin-top: 10px;
  }
  .hoteng{
    text-align: left;
    margin-top: 10px;
  }
  .start{
    text-align: left;
    margin-top: 10px;
  }
  .info_title{
    height: 30px;
    font-size: 16px;
    text-align: left;
    float: left;
    width: 1500px;
    margin-top: 6px;
  }
  .left_input{
    width: 300px;
    height: 300px;
    float: left;
    margin-left: 30px;
  }
  .middle_input{
    width: 300px;
    height: 300px;
    float: left;
    margin-left: 80px;
  }
  .right_input{
    width: 600px;
    height: 300px;
    float: left;
    margin-left: 50px;
  }
  .introduction{
    height: 400px;
    float: left;
    margin-top: 10px;
    margin-left: 48px;
  }
  .introduction_area{
    width: 700px;
    padding-left: 17px;
  }

  .textarea_size{
    width: 500px;

  }
  .select{
    width: 202px;
  }
  .add_facilities{
    width: 400px;
    height: 250px;
    background: #F2F2F2;
    float: left;
    margin-left: 200px;
    margin-top: 50px;
  }
  .facilities{
    float: left;
    width: 1500px;
  }
  .facilities_name{
    margin-top: 15px;
  }
  .add_img{
    width: 1400px;
    height: 50px;
    float: left;
    text-align: left;
    margin-left: 75px;
  }
  .image_border{

    float: left;
    margin-left: 25px;
  }
  .image_kuang{
    width: 300px;
    height: 200px;
    background: #6f7180;
    float: left;
    margin-left: 50px;
    margin-top: 20px;
  }
  .ima_kuang{
    width: 300px;
    height: 200px;
    background: #6f7180;
    float: left;
  }
  .image_exit{
    width: 25px;
    height: 25px;
    background: #3a8ee6;
    float: left;
    margin-left: 278px;
    margin-top: -205px;
  }
  .zong_border{
    width: 1655px;
    border: #8c939d solid 1px;
  }
  .left_border{
    width: 1000px;
    height: 780px;
    border: #8c939d solid 1px;
    float: left;
  }
  .left_img{
    width: 920px;
    height: 500px;
    background: #5daf34;
    float: left;
    margin-top: 80px;
    margin-left: 40px;
  }
  .right_border{
    width: 600px;
    height: 780px;
    border: #8c939d solid 1px;
    float: right;
  }
  .delete_img{
    width: 89px;
    height: 40px;
    float: left;
    margin-left: 441px;
    margin-top: 50px;
  }
  .photo_info{
    height: 300px;
    border: #8c939d solid 1px;

  }
  .shucai_info{
    height: 400px;
    border: #8c939d solid 1px;
    margin-top: 76px;
  }
  .font_info{
    margin-left: 213px;
    margin-top: 47px;
    font-size: 15px;
  }
  .kuang_bor{
    width: 300px;
    margin-left: 150px;
  }

  .tag_info{
   margin-left: 20px;
    margin-top: 10px;
  }
  .select_img{
    width: 400px;
    height: 300px;
    background: #8c939d;
    float: left;
  }
  .upload_img{
    width: 400px;
    height: 300px;
    background: #8c939d;
    float: left;
    margin-left: 10px;
  }
  .big_img{
    width: 878px;
    margin-left: 58px;
  }
  .butn{
    margin-left: 150px;
    margin-top: 125px;
  }
  .sea_buton{
    width: 1480px;
    height: 50px;
    float: left;
  }
  .input_wid{
    width: 260px;
    float: right;
  }
  .input_img{
    width: 430px;
    float: left;
    margin-top: 20px;
  }
  .input_rig_img{
    width: 1050px;
    float: left;
    margin-top: 20px;
  }
  .inp_i{
    width: 320px;
    height: 250px;
    background: #3a8ee6;
    float: left;
    margin-left: 20px;
    margin-top: 10px;
  }
  .inp_ii{
    width: 320px;
    height: 250px;
  }
  .dialog-footer{
   text-align: center;
  }
  .clearfix:after{
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  .img_item{
    display: block;
    width: 100%;
  }
  .clearfix{
    zoom:1;
  }
  @media screen and (max-width: 1800px){
    .right_input{
      margin-left: 42px;
      margin-top: 14px;
    }
  }



</style>
