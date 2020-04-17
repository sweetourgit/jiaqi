<!-- 报销管理
     因接手时这样就把
     所有功能写在一起
     submitForm 保存报销
     chanceSubmit 取消报销
     chanelSubmit 撤销申请 后台找 刘晓婷
-->

<template>
  <div class="all">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!--报销-->
      <el-tab-pane label="报销" name="first">
        <div class="borders">
          <div>
            <div class="search">
              <span class="search_style">报销单号：</span>
              <el-input v-model="expenseID" placeholder="请输入内容" class="search_input"></el-input>
              <span class="search_style">团期计划：</span>
              <el-input v-model="groupCode" placeholder="请输入内容" class="search_input"></el-input>
              <span class="search_style">申请人：</span>
              <el-input v-model="createUser" placeholder="请输入内容" class="search_input" :disabled="ifShowProposer"></el-input>
              <span class="search_style">发起时间：</span>
              <el-date-picker
                class="search_input"
                style="width:30%"
                @change="endDateChange()"
                v-model="plan_data"
                type="daterange"
                range-separator="至"
                start-placeholder="请选择开始日期"
                end-placeholder="请选择结束日期"
                >
                </el-date-picker>
            </div>
            <div class="reform">
              <el-button type="primary"  @click="handleSearch">搜 索</el-button>
              <el-button type="primary"  @click="handleReset">重 置</el-button>
            </div>
            <div class="reform">
              <el-button type="primary" plain @click="dialogchange">申请</el-button>
            </div>
          </div>
          <div class="table_style">
            <el-table  :data="tableData" border style="width:100%;">
              <el-table-column prop="expenseID" label="报销单号" width="180" align="center"></el-table-column>
              <el-table-column prop="checkTypeEX" label="状态" width="180" align="center">
                <template slot-scope="scope">
                  <div
                    v-if="scope.row.checkTypeEX=='审批中'"
                    style="color: #7F7F7F"
                  >{{scope.row.checkTypeEX}}</div>
                  <div
                    v-if="scope.row.checkTypeEX=='驳回'"
                    style="color: #FF4A3D"
                  >{{scope.row.checkTypeEX}}</div>
                  <div
                    v-if="scope.row.checkTypeEX=='通过'"
                    style="color: #33D174"
                  >{{scope.row.checkTypeEX}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" :formatter='dateFormat'  label="发起时间" align="center"></el-table-column>
              <el-table-column prop="groupCode" label="团期计划" width="250" align="center"></el-table-column>
              <el-table-column prop="price" label="报销金额" width="180" align="center"></el-table-column>
              <el-table-column prop="createUser" label="申请人" width="150" align="center"></el-table-column>
              <!-- <el-table-column prop="info" label="审批意见" width="180" align="center"></el-table-column> -->
              <el-table-column prop="guid" label="操作" width="180" align="center">
                <template slot-scope="scope">
                  <div @click="dialogFind(scope)" style="color: #f5a142">详情</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage4"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageCount"
              background
            ></el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <!--报销end-->
      <!--报销弹窗-->
      <el-dialog title="报销申请" :visible.sync="dialogFormVisible" width="70%" :show-close="false" :close-on-click-modal="false">
        <div v-if="this.find == 1" class="re_style" style="margin-top:-20px;" >基本信息</div>
        <div v-if="this.find == 1" class="style_box">
              <div v-if="this.state == 0" class="sh_style">审核中</div>
              <div v-if="this.state == 1" class="tg_style">通过</div>
              <div v-if="this.state == 2" class="bh_style">驳回</div>
        </div>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <!--多报销-->
          <div>
            <el-tabs
              v-model="ruleForm.editableTabsValue"
              type="card"
              :editable="change ? false : true"
              @tab-click="tabClick"
              @edit="handleTabsEdit"
              style="border: 1px solid #E4E7ED"
            >
              <el-tab-pane
                :key="item.name"
                v-for="(item,index) in ruleForm.editableTabs"
                :label="item.title"
                :name="item.name"
              >
              <!-- {{item.content}} -->
              <div class="handle_div">
                <div class="handle_id" v-if="find==1"><span>ID:</span><span style="margin-left: 10px;">{{item.content.id}}</span></div>
                <div class="handle_people" v-if="find==1"><span>申请人:</span><span style="margin-left: 10px;">{{item.content.createUser}}</span></div>
                <div class="handle_time" v-if="find==1"><span>创建时间:</span><span style="margin-left: 10px;" >{{item.content.createTime | formatDate}}</span></div>
              </div>

              <div style="color: red; position: absolute;left: 20px;top:15px;" v-if="find==0" >*</div>
              <el-form-item label="团期计划" porp="groupCode" v-if="find==0"  >
                  <el-input
                      v-model="item.content.groupCode"
                      ref="groupCode"
                      style="width: 240px;"
                      placeholder="请输入团期计划"
                      :disabled="change"
                      @blur="tour_check"
                     >
                    </el-input >
                    <el-input
                    style="width:300px;"
                    disabled
                    v-model="item.content.productName"
                    placeholder="通过输入团期计划,自动补充产品名称"
                    ></el-input>

                    <el-button size="mini" @click="planDialog()" v-if="find==0">选择</el-button>
              </el-form-item>
               <div style="color:rgba(255,255,255,0.4);float:left">{{item.content.id}}</div>
              <div style="color: red; color: red; position: absolute;top:80px;left: 20px;" v-if="find==0">*</div>
              <el-form-item label="摘要" porp="mark" v-if="find==0">
                <el-input
                  v-model="item.content.mark"
                  ref="mark"
                  placeholder="请输入"
                  style="width: 480px;"
                  :disabled="change"
                ></el-input>
              </el-form-item>
              <el-form-item label="附件" label-width="75px"  v-if="find==0">
                  <el-upload
                  ref="image"
                  prop="image"
                  class="upload-demo"
                  multiple
                  name="files"
                  :action= "uploadUrl"
                  :on-success="handleSucess"
                  :on-change="handleChange"
                  :on-remove="handleRemove"
                  :on-error="handleError"
                  :on-preview="handlePreview"
                  :before-remove="beforeRemove"
                  :file-list="item.content.files">
                    <el-button size="small" type="primary" v-if="find==0">点击上传</el-button>
                  </el-upload>
                 </el-form-item>

               <div class="handle_div">
                    <div class="handle_id" v-if="find==1"><span>团期计划:</span><span style="margin-left: 10px;">{{item.content.groupCode}}</span></div>
                    <div class="handle_people" v-if="find==1"><span>产品名称:</span><span style="margin-left: 10px;">{{item.content.productName}}</span></div>
                    <div class="handle_time" v-if="find==1"><span>摘要:</span><span style="margin-left: 10px;" >{{item.content.mark}}</span></div>
              </div>
              <el-form-item  label="附件" label-width="80px" v-if="find==1">
                    <el-upload
                    class="upload-demo"
                    name="files"
                    :action= "uploadUrl"
                    :show-file-list=true
                    :disabled= true
                    :on-change="handleChange"
                    :on-preview="handlePreview"
                    :file-list="item.content.files">
                    </el-upload>
              </el-form-item>

                <div class="re_style">
                  <el-radio v-model="radio" label="1">关联单据</el-radio>
                  <!-- <el-radio v-model="radio" label="2">手添报销明细</el-radio> -->
                </div>
                <div v-if="radio==1" class="re_style" style="margin-top: 20px">
                  <el-button @click="addbx(item.content)" v-if="find==0">增加</el-button>
                </div>
                <div  style="background: #E6F3FC; height: 33px;width: 1204px;margin-left: 40px;margin-top: 10px; ">
                  <i
                    style="float: left; margin-left: 10px;margin-top: 7px;"
                    class="el-icon-warning"
                  ></i>
                  <div style="float: left;margin-left: 30px;margin-top: 7px;">
                    已选择
                    <span style="color: #249BEB">{{item.content.t_sum}}</span>项
                  </div>
                  <div style="float: left; margin-left: 30px;margin-top: 7px;">
                    报销总计：
                    <span style="font-weight:bold">{{item.content.t_price}}</span>元
                  </div>
                </div>
                <div v-if="radio==1">
                   <div class="re_style">
                    <el-table :data="item.content.payments" border style="margin-top: 30px;width: 100%">
                      <el-table-column prop="paymentID" label="无收入借款或预付款ID" align="center" v-if="find==1"></el-table-column>
                      <el-table-column prop="paymentID" label="无收入借款或预付款ID"  align="center" v-if="find==0"></el-table-column>
                      <el-table-column prop="supplierTypeEX" label="借款类型"  align="center"></el-table-column>
                      <el-table-column prop="supplierName" label="供应商"  align="center"></el-table-column>
                      <el-table-column prop="createUser" label="申请人"  align="center"></el-table-column>
                      <el-table-column prop="paymentMark" label="摘要" align="center"></el-table-column>
                      <el-table-column prop="paymentPrice" label="借款金额"  align="center"></el-table-column>
                      <!-- <el-table-column prop="wcount" label="未报销金额" width="100"></el-table-column> -->
                      <!-- <el-table-column prop="wcount" label="报销金额"   width="140"   align="center" v-if="find==0">
                        <template slot-scope="scope">
                          <el-input @input='addressChange(scope.row.price)' v-model="scope.row.price" style="width:100px;"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="" label="人数" width="140"  v-if="find==0"   align="center">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.peopleCount" style="width:100px;"></el-input>
                        </template>
                      </el-table-column> -->
                      <!-- 不能改的 -->
                      <el-table-column prop="swcount" label="报销金额"  align="center" v-if="find==0">  </el-table-column>
                      <el-table-column prop="peopled" label="人数"  align="center" v-if="find==0"> </el-table-column>


                       <el-table-column prop="price" label="报销金额"  align="center" v-if="find==1">  </el-table-column>
                       <el-table-column prop="peopleCount" label="人数" align="center"  v-if="find==1"> </el-table-column>

                       <el-table-column prop="expenseType" label="还款/拆分" align="center"></el-table-column>
                       <el-table-column prop="paymentID"  disabled  label="操作"    align="center">
                          <template slot-scope="scope">
                             <span @click="AmendOpen(scope.$index,scope.row.paymentID,0)" style="color: #f5a142" v-if="find==0">设置 |</span>
                             <span @click="t_delete(scope.row.paymentID)" style="color: #f5a142" v-if="find==0">删除</span>
                             <span @click="AmendOpen(scope.$index,scope.row.paymentID,1)" style="color: #f5a142" v-if="find==1">查看</span>
                         </template>
                       </el-table-column>

                    </el-table>
                  </div>
                 </div>
                <!-- <div v-if="radio==2">
                  <div style="float:left;margin: 10px 0 0 65px;width: 70px;">报销明细:</div>
                  <div class="re_style" style="margin-top: 20px;">
                    <el-input
                      :disabled="change"
                      v-model="ruleForm.monkeys.mark"
                      placeholder="请输入报销类型"
                      style="width: 240px;"
                    ></el-input>
                    <el-input
                      :disabled="change"
                      v-model="ruleForm.monkeys.price"
                      placeholder="请输入报销金额"
                      style="width: 240px;"
                    ></el-input>
                    <el-button type="primary" @click="addDomain" v-if="find==0">添加</el-button>
                  </div>
                  <div
                   v-for="(domain, index) in domains"
                   :class="re_style"
                   style="margin: 20px 0 0 135px;"
                   :key='index+"m"'>
                    <el-input
                      :disabled="change"
                      v-model="domain.mark"
                      placeholder="请输入报销类型"
                      style="width: 240px;"
                    ></el-input>
                    <el-input
                      :disabled="change"
                      v-model="domain.price"
                      placeholder="请输入报销金额"
                      style="width: 240px;"
                    ></el-input>
                    <el-button type="danger" @click="removeDomain(domain)" v-if="find==0">删除</el-button>
                  </div>
                </div> -->
              </el-tab-pane>
            </el-tabs>
              <!-- 审核结果 -->
              <div v-if="this.find == 1" class="re_style">审核结果</div>
                <el-table :data="tableCourse" border :header-cell-style="getRowClass"  v-if="this.find == 1" >
                  <el-table-column prop="finishedTime" label="审批时间" align="center"></el-table-column>
                  <el-table-column prop="participantName" label="审批人" align="center"></el-table-column>
                  <el-table-column prop="approvalName" label="审批结果" align="center"></el-table-column>
                  <el-table-column prop="comments" label="审批意见" align="center"></el-table-column>
                </el-table>
              <!-- 审核结果 END -->
             </div>
          <!--多报销end-->
        </el-form>
        <div slot="footer" class="dialog-footer" style="position: absolute;top: 20px;right: 20px;">
          <el-button @click="chanceSubmit(ruleForm)">取 消</el-button>
          <el-button v-if="this.find == 0" type="primary" @click="submitForm(ruleForm)" :disabled="submitformBtn">确 定</el-button>
          <el-button
            v-if="this.state == 0"
            type="danger"
            @click="chanelSubmit(ruleForm)"
            plain
          >撤销申请</el-button>
        </div>
      </el-dialog>
      <!--报销弹窗end-->
      <!--团期计划弹窗-->
      <el-dialog
        width="68%"
        title="获取团期计划"
        :visible.sync="dialogFormVisible2"
        append-to-body
        :show-close="false"
      >
          <div class="indialog">
            <div style=" position: absolute;right: 67px;top: 22px;">
              <el-button  @click="showplan()">取 消</el-button>
              <el-button type="primary" @click="addplan(ruleForm.editableTabsValue)">确 定</el-button>
            </div>
            <div class="indialog_search">
              <span class="search_style">团期单号：</span>
              <el-input v-model="tour_name" placeholder="请输入内容" class="search_input"  style="width:20%"></el-input>
              <span class="search_style">产品名称：</span>
              <el-input v-model="product_name" placeholder="请输入内容" class="search_input"  style="width:20%"></el-input>
              <span class="search_style">出行日期：</span>
              <!-- <el-date-picker
                v-model="startTime2"
                type="date"
                placeholder="开始日期"
                style="float: left;width: 140px;"
              ></el-date-picker>
              <el-date-picker
                v-model="endTime2"
                type="date"
                placeholder="终止日期"
                style="float: left;width: 140px;"
              ></el-date-picker> -->

               <el-date-picker
                class="search_input"
                style="width:33%"
                v-model="plan_data2"
                @change="endDateChange2()"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="终止日期"
                >
                </el-date-picker>
              <el-button
                type="primary"
                size="mini"
                @click="search_btn()"
                round
                style="margin-top: 10px;margin-bottom: 10px; margin-left: 20px; float:left;"
              >搜索</el-button>
              <el-button
              @click="T_update_btn"
              type="primary"
              size="mini"
              round
              style="margin-top: 10px;margin-bottom: 10px; margin-left: 10px;float:left;"
              >重置</el-button>

            </div>
            <el-table
              :data="planData"
              border
              :highlight-current-row="true"
              @row-click="planChange"
              style="width: 100%; margin:30px 0 100px 0"
            >
              <el-table-column prop="groupCode" label="团期计划ID"></el-table-column>
              <el-table-column prop="title" label="产品名称"></el-table-column>
              <el-table-column prop="destination" label="目的地"></el-table-column>
              <el-table-column prop="date" label="出行日期"></el-table-column>
              <el-table-column prop="orgName" label="部门"></el-table-column>
              <el-table-column prop="name" label="产品录入人"></el-table-column>
            </el-table>
          </div>
           <div class="block_s">
              <el-pagination
                  @size-change="t_handleSizeChange"
                  @current-change="t_handleCurrentChange"
                  :current-page.sync="currentPage5"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="t_pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="t_pageCount"
                  background
              ></el-pagination>
            </div>

      </el-dialog>
      <!--团期计划弹窗end-->
      <!--添加报销弹窗-->
      <el-dialog width="60%" title="添加报销" :visible.sync="dialogFormVisible3" append-to-body @close="t_text_del('joinData')" >
          <span class="search_style">供应商：</span>
                <el-input v-model="t_supplier" placeholder="请输入内容" class="search_input"></el-input>
          <div class="reform_s">
            <el-button @click="T_check" type="primary">搜 索</el-button>
            <el-button @click="T_update" type="primary">重 置</el-button>
          </div>
          <el-tabs v-model="activebox" @tab-click="joinClick"   style="float:left;width: 100%;">
              <el-tab-pane label="预付款" name="2"></el-tab-pane>
              <el-tab-pane label="无收入" name="1"></el-tab-pane>
              <el-tab-pane label="无收入(无团期计划)" name="0"></el-tab-pane>
          </el-tabs>
          <!-- @row-click="joinData_btn" -->
          <el-table
            :data="joinData"
            border
            tooltip-effect="dark"
            @selection-change="joinData_btn"
            style="width: 100%; margin-top: 30px">
            <el-table-column type="selection"  align="center"></el-table-column>
            <el-table-column prop="paymentID" label="预付款借款ID"  align="center" v-if="s_find==1"></el-table-column>
            <el-table-column prop="paymentID" label="无收入借款ID"  align="center" v-if="s_find==2"></el-table-column>

            <el-table-column prop="supplierName" label="供应商"  align="center"></el-table-column>
            <el-table-column prop="supplierTypeEX" label="借款类型"  align="center"></el-table-column>
            <!-- <el-table-column prop="orgName" label="部门" width="140"  align="center"></el-table-column> -->
            <el-table-column prop="price" label="金额"  align="center"></el-table-column>
            <!-- <el-table-column prop="wcount" label="未报销金额" width="150" align="center"></el-table-column> -->
            <el-table-column prop="paymentMark" label="摘要"  align="center"></el-table-column>
            <el-table-column prop="createUser" label="申请人" align="center"></el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button @click="t_text_del('joinData')">取 消</el-button>
            <el-button type="primary" @click="t_text()">确 定</el-button>
          </div>
      </el-dialog>
      <!--添加报销弹窗end-->

      <!--拆分弹窗-->
      <el-dialog width="60%" title="拆分/还款" :visible.sync="AmendOpenVisble" append-to-body @close="Amenddel()" >
           <el-form :model="Amend" :rules="rules" ref="Amend" label-width="110px" class="demo-ruleForm invoice"  v-if="find==0" >
                <div class="w500">
                   <el-form-item label="报销金额：" prop="money"  >
                      <el-input v-model="Amend.money" type='number' @input='addressChange()' class="Words"  placeholder="请输入 报销金额"></el-input>
                      <span class="Numbers">借款金额：{{Amend.Newmoney}}</span>
                    </el-form-item>
                    <el-form-item label="人数：" prop="number">
                      <el-input v-model="Amend.number"  type='number' class="Words"  placeholder="请输入 人数"></el-input>
                      <span class="Numbers">库存：{{Amend.Newnumber}}</span>
                    </el-form-item>
                    <el-form-item label="拆分/还款：" prop="state" >
                      <el-radio v-model="Amend.state" :label="1"  :disabled="disabled_style">拆分</el-radio>
                      <el-radio v-model="Amend.state" :label="2"  :disabled="disabled_style" >还款</el-radio>
                    </el-form-item>
                    <el-form-item label="选择账号："   v-if="Amend.state == 2">
                      <el-table
                        :data="AmendData"
                        :highlight-current-row="true"
                        @row-click="AmendDataClick"
                        border
                        style="width: 100%; margin-top: 30px">
                        <el-table-column prop="cardType" label='类型'  align="center"></el-table-column>
                        <el-table-column prop="title" label="账号名称"  align="center"></el-table-column>
                        <el-table-column prop="cardNum" label="卡号"  align="center"></el-table-column>
                        <el-table-column prop="openingBank" label="开户行" align="center"></el-table-column>
                        <el-table-column prop="openingName" label="开户人"  align="center"></el-table-column>
                        <el-table-column prop="createUser" label="操作"  align="center">
                          <template slot-scope="scope">
                              <span style="color: #f5a142">选择</span>
                          </template>
                        </el-table-column>
                      </el-table>

                    </el-form-item>
                </div>
            </el-form>
        <!-- @row-click="joinData_btn" -->
         <div v-if="find==1" class="statetype_style">
            <div>拆分/还款：{{statetype}}</div>
              <div v-if="statetype=='还款'">
                  还款账号：{{statetype_Data}}
              </div>
            </div>


          <div class="cancel"  >
              <el-button  @click="Amenddel()">取 消</el-button>
              <el-button  type="primary" @click="AmendApply(Amend)"  v-if="find==0">保存</el-button>
          </div>
       </el-dialog>
      <!--拆分弹窗end-->

      <!--需要你审批 先隐藏有需要在打开-->
      <!-- <el-tab-pane label="需要您审批" name="second">
         <approvalToBorrow></approvalToBorrow>
      </el-tab-pane> -->
      <!--审批end-->
    </el-tabs>
  </div>
</template>

<script>
// import NeedApproval from "@/page/Finance/reimburseManagement/needApproval";
import approvalToBorrow from "@/page/Finance/loanManagement/approvalToBorrow";
import { formatDate } from "@/js/libs/formatDate.js";
import moment from "moment";
export default {
  name: "reimburseManagement",
  components: {
    approvalToBorrow
  },
  data() {
    var areaIdRule = (rule, value, callback) => {
      if (
        this.editableTabs.groupCode == "" ||
        this.editableTabs.productName == ""
      ) {
        return callback(new Error("团期计划不能为空"));
      } else {
          return callback()
      }
    };
    var imageIdRule = (rule, value, callback) => {
      if (this.image == 0) {
        return callback(new Error("上传图片不能为空"));
      } else {
          return callback()
      }
    };

    return {
      uploadUrl: this.GLOBAL.serverSrc + '/upload/obs/api/picture/', // 上传凭证
      tableCourse:[], // 查看无收入借款审批过程
      image: 0,//验证上传图片没
      ifShowProposer: false, // 当职位为收纳额时候禁止使用申请人检索
      submitformBtn: false,//防止多次点击
      hand: [],
      plans: {
        planNum: "",
        planName: "",
        pid: ""
      },
      Amend:{
        Newmoney:"",
        Newnumber:"",
        money:'', // 多少钱
        number:"",//库存
        state:0,//拆分状态
        cardNum:'',//拆分还款账户
        paymentID:0,//订单id
        },
      new_style:0,
      statetype:"",
      disabled_style:true,//单选隐藏
      split_show:0,
      AmendData:[],//选择账户
      statetype_Data:'',//展示账户
      // beginDate: "",//报销开始时间+
      // endDate: "",//报销结束时间+
      plan_data:"",//选择时间
      plan_data2:"",//选择时间
      uid: 0, // 上传图片缩略图选中项
      planTotal: 1,
      userSize: 10,
      userTotal: 100,
      startTime2: "",   // supplier:0,//供应商没有的时候显示这个
      endTime2: "",
      pageSize: 10,//每页偏移量
      t_pageSize:10,
      pageCount: 100,
      t_pageCount:100,
      currentPage4: 1,
      currentPage5: 1,
      change: false,
      find: 0, //分辨查看
      s_find:1,//预付款借款id
      state:3,//审核中
      radio: "1",  // 单选
      AmendOpenVisble:false,//拆分隐藏
      dialogFormVisible2: false, //团期计划弹窗
      dialogFormVisible3: false,  //添加报销
      dialogFormVisible: false,   //报销表单弹窗
      dialogFormVisible1: false,  //报销人弹窗
      tour_name: "", //团期计划搜索
      product_name: "",
      domains: [  //手添报销
        {
          mark: "0",
          price: "0"
        }
      ],
      people: {  // 选中报销人字段
        tt: "大运通-日本",
        peo: "qq"
      },
      alljoinData:[],//所有关联数据
      ruleForm: {  //报销表单
      editableTabsValue: "1",
      editableTabs: [
        {
          title: "报销1",
          name: "1",
          content:{
              createUser:"",
              createTime: "",
              count:0,
              id:"",
              groupCode: "",
              productName: "",
              mark: "",
              t_price_box:[],
              t_sum:0,//一共多少项
              t_price:0,//一共多少钱
              files:[],
              payments:[],
              joinData:[],
              plan: {
                planId: "",
                planName: ""
              },

          }
        }
      ],
      },
      s_content:[],//获取当前页面s_content
      object_lisr:[],//最后提交的数组
      rules: { //报销表单验证
        name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        groupCode: [{ validator: areaIdRule, trigger: "blur" }],
        image: [{ validator: imageIdRule, trigger: "blur" }],
        mark: [
          { required: true, message: "请输入摘要", trigger: "change" },
          {
            min: 0,
            max: 80,
            message: "摘要字数不能超过80字",
            trigger: "change"
          }
        ],
        money: [{ required: true,  message: "请输入报销金额",}],
        number: [{ required: true, message: "请输入报销人数"}],
        state: [{ required: true, }],
        states: [{ required: true, }],
      },
      reimData: [{  //审批意见
          reier: "",
          reisult: "",
          info: "",
          time: ""
        }],
      formLabelWidth: "120px",
      activeName: "first",
      jointab:"2",
      activebox:'2',
      paymentype:2,
      expenseID: "",
      groupCode: "",
      t_plan: "",// 添加报销申请人
      t_supplier:"",//添加报销供应商
      createUser: "",
      createtime1: "",
      createtime2: "",
      tableData: [], //报销table
      planData: [],  //团期计划表格
      joinData:[],  //关联单据表单
      t_joinData:[],
      payments:[],
      file: [],
      files: [], //文件上传列表
      tabIndex: 1,
    };
  },
   filters: {// 时间过滤
          formatDate: function (value) {
            return moment(value).format('YYYY-MM-DD HH:mm:ss')
          },
        },
   methods: {
        moment,
        chanceSubmit() { // 取消按钮
            if(this.find == 0){
              this.$confirm("是否取消本次报销申请", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
              .then(() => {
                  this.tabIndex = 1;
                  this.radio= "1";
                  this.dialogFormVisible = false;
                  this.alljoinData = [];
                  this.tableCourse = [];
                  this.ruleNull()
            })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消"
                });
              });
          }else if(this.find == 1){
                  this.tabIndex = 1;
                  this.radio= "1";
                  this.find = 0 ;
                  this.state = 1;
                  this.dialogFormVisible = false;
                  this.alljoinData = [];
                  this.tableCourse = [];
                  this.ruleNull()
            }

        },
          // 表格表头颜色
        getRowClass({ row, column, rowIndex, columnIndex }) {
          if (rowIndex == 0) {
            return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px'
          } else {
            return ''
          }
        },
        subscript(){ //判断当前tab页
             for(let j in this.ruleForm.editableTabs){
              if(this.ruleForm.editableTabs[j].name == this.ruleForm.editableTabsValue){
                   this.s_content = this.ruleForm.editableTabs[j].content;
                }
              }

        },
        AmendNull(){ //拆分清空
         this.Amend={
                Newmoney:"",
                Newnumber:"",
                money:'', // 多少钱
                number:"",//库存
                state:0,//拆分状态
                cardNum:'',//拆分还款账户
                paymentID:0,//订单id
            }
            this.statetype_Data="";
         },
        ruleNull(){ // 清空内容
            this.ruleForm= {
                      editableTabsValue: "1",
                      editableTabs: [
                        {
                          title: "报销1",
                          name: "1",
                          content:{
                              createUser:"",
                              createTime: "",
                              count:0,
                              id:"",
                              groupCode: "",
                              productName: "",
                              mark: "",
                              t_price_box:[],
                              t_sum:0,//一共多少项
                              t_price:0,//一共多少钱
                              files:[],
                              payments:[],
                              joinData:[],
                              plan: {
                                planId: "",
                                planName: ""
                              },

                          }
                        }
                      ]
                      };
        },
        showplan(){//取消1
            this.t_pageSize = 10;
            this.currentPage5 = 1;

            this.dialogFormVisible2 = false;
            this.T_update_btn();
        },
        addplan(editableTabsValue) {//选择团期计划的确定按钮
           this. subscript();
          //  console.log(editableTabsValue,80);
           if(this.plans.planNum !== "" || this.plans.planName !== ""){
                  this.s_content.groupCode = this.plans.planNum;
                  this.s_content.productName = this.plans.planName;
                  this.s_content.id = this.plans.pid;
                  this.s_content.count =this.plans.count;
                  this.t_pageSize = 10;
                  this.currentPage5 = 1;
                  this.dialogFormVisible2 = false;
                  this.T_update_btn();
                  this.s_content.payments=[];

           }else{
                  this.dialogFormVisible2 = true;
                  this.$message({ message:'请选择团期计划',
                                  type: 'warning'
                                });
           }


        },
        //获取关联单据
        Associated(
          planID,
          suppliername = this.t_supplier,
          PaymentType = this.paymentype
        // createUser = this.t_plan
            ){
            this.subscript();
            let object = {};
                suppliername !== "" ? (object.suppliername = suppliername) : suppliername,
                planID !=="" ? (object.planID = planID) : planID,
                PaymentType !=="" ? (object.PaymentType = PaymentType) : PaymentType,
              this.$http
                .post(this.GLOBAL.serverSrc + "/finance/payment/api/checklist2", {
                  object:object,
                })
                .then(res => {

                  var object = res.data.objects;
                  var wcount; //未报销金额
                    for (let i in object) {

                      // object[i].peopleCount = this.s_content.count
                       this.joinData.push({
                          paymentID:  object[i].paymentID,
                          supplierTypeEX:object[i].supplierTypeEX,
                          groupCode:object[i].groupCode,
                          productName:object[i].productName,
                          createUser:object[i].createUser,
                          paymentMark:object[i].mark,
                          price:object[i].price,
                          paymentPrice:object[i].price,
                          bcount:0,
                          createTime:object[i].createTime,
                          supplierName:object[i].supplierName,
                          peopleCount:this.s_content.count,
                          orgName:object[i].orgName,
                          wcount: object[i].price - object[i].expensePrice,
                          accountID:0,
                          expenseType:"",
                          peopled:'',
                          swcount:'',


                      });


                    }
                      this.s_content.joinData = this.joinData;
                      this.t_supplier = "";
                 })
                .catch(err => {
                  console.log(err);
                });
            },

        planChange(row) {  //获取团号和name
          this.plans = {};
          this.plans.planName = row.title;
          this.plans.planNum = row.groupCode;
          this.plans.pid = row.planID;
          this.plans.count = row.count;
          this.subscript();

        },

        clickBanle(row) {  // 报销人选中行
          this.people = {};
          this.people.peo = row.name;
          this.people.tt = row.orgName;
        },
        t_handleSizeChange(val) {
          this.t_pageSize = val;
          this.currentPage5 = 1;
          this.searchHand4();
        },
        t_handleCurrentChange(val) {
          this.currentPage5 = val;
          this.searchHand4();
        },
        search_btn() {
         this.currentPage5 = 1;
         this.searchHand4();
        },
        searchHand4() { //团期计划搜索
          this.$http
            .post(this.GLOBAL.serverSrc + "/teamquery/get/api/planfinancepage", {
              pageIndex: this.currentPage5,
              pageSize: this.t_pageSize,
              object: {
                groupCode: this.tour_name, //团号
                title: this.product_name, //产品名称
                beginDate: this.plan_data2[0] ? formatDate(this.plan_data2[0],"yyyyMMdd") : 0, //搜索用开始日期
                endDate: this.plan_data2[1] ? formatDate(this.plan_data2[1], "yyyyMMdd") : 0 //搜索用结束日期

                // beginDate: this.startTime2? formatDate(this.startTime2, "yyyyMMdd"): 0, //搜索用开始日期
                // endDate: this.endTime2 ? formatDate(this.endTime2, "yyyyMMdd") : 0 //搜索用结束日期
              }
            })
            .then(res => {
              this.subscript();
              this.t_pageCount = res.data.total;
              this.planData = res.data.objects;
              //this.s_content.count =  res.data.objects[0].count
            })
            .catch(err => {
              console.log(err);
            });
        },
         endDateChange2() { //判断结束时间不能在开始时间之前
         if (this.plan_data2 == null){
              this.plan_data2 = ""
              this.searchHand4();
          }
        },
        T_update_btn(){//团期计划重置
            this.tour_name=""; //团号
            this.product_name="" //产品名称
            this.plan_data2 = ""
            this.t_pageSize = 10;
            this.currentPage5 = 1;
            this.searchHand4()
        },

        addDomain() {  //添加
          this.domains.push({
              mark: "0",
              price: "0"
            });
        },
        beginWokeing(res) {  //启动工作流
            console.log(res);
            this.$http
              .post(this.GLOBAL.jqUrl + "/JQ/StartUpWorkFlowForJQ", {
                jQ_ID: res.guid,
                jQ_Type: res.flowModel,
                workflowCode: res.flowModelName,
                userCode: sessionStorage.getItem("account")
              })
              .then(res => {
                let result = JSON.parse(res.data);
                if (result.code == "0") {
                  console.log("启动工作流成功");
                } else {
                  console.log("启动工作流错误!");
                  console.log(res.data);
                }
              })
              .catch(err => {
                console.log(err);
              });
          },

        chanelSubmit(ruleForm) {   //撤销申请
         let chanel_guid = ruleForm.editableTabs[0].content.guid;
            this.$confirm("是否需要撤销该笔报销", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                this.$http
                .post(this.GLOBAL.serverSrc + "/finance/expense/api/list", {
                  object:{
                    guid:chanel_guid,
                  }
                })
               .then(res => {
                   if (res.data.isSuccess == true) {
                    var d_objects = res.data.objects;
                    for(let i in d_objects){
                          if(d_objects[i].checkType == 0){
                            this.$http
                                .post(this.GLOBAL.serverSrc + "/finance/expense/api/delete", {
                                    guid:ruleForm.editableTabs[0].content.guid
                                  })
                                  .then(res => {
                                      this.tabIndex = 1;
                                      this.pageIndex = 1;
                                      this.state = 1;
                                      this.find = 0 ;
                                      this.currentPage4 = 1;
                                      this.currentPage5 = 1;
                                      this.pageList(1, this.pageSize);
                                      this.dialogFormVisible = false;
                                    if(res.data.isSuccess == true){
                                      this.$message({
                                        type: "success",
                                        message: "撤销成功!"
                                      });
                                      this.alljoinData=[];
                                      this.tableCourse = [];
                                      this.ruleNull()
                                      let text = res.config.data
                                      this.beginWokeing(text);
                                     }
                                    })
                                  .catch(err => {
                                    console.log(err);
                                  });
                          }else{
                            this.tabIndex = 1;
                            this.radio= "1";
                            this.dialogFormVisible = false;
                            this.alljoinData = [];
                            this.tableCourse = [];
                            this.ruleNull()
                            this.$message({
                                  type: "info",
                                  message: "订单已审核，刷新看状态"
                                });


                         }
                        }
                        return;
                   }
                })
                .catch(err => {
                  console.log(err);
                });

              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消撤销"
                });
              });
          },
        joinData_btn(row) {  //获取管理订单
         this.subscript();
         this.s_content.joinData = row;
         this.new_style = 1;
        },
      //  else if(joinData.length != undefined){ 2020/02/19隐藏
      //      console.log(joinData.length,'爸爸')
      //         this.dialogFormVisible3 = true;
      //         this.$message({
      //               type: "warning",
      //               message: "请选择关联单据"
      //               });
      //               return;
      //    }
        t_text() {//确认添加
        if(this.new_style == 1){
             this.subscript();
              let joinData = this.s_content.joinData;
              let joinDataid = this.s_content.joinData.paymentID;
              let payments = this.s_content.payments;
              console.log(joinData.length,'48894');
              if(joinData.length == 0){
                  this.$message({
                      type: "warning",
                      message: "选择团期计划"
                    });
                    return;
                    this.dialogFormVisible3 = true;
                }else{
                  if(payments.length != 0){
                            for(let i in payments){
                              for(let j in joinData){
                                if( payments[i].paymentID === joinData[j].paymentID ){
                                    //payments.splice(i, 1);
                                    this.dialogFormVisible3 = true;
                                    this.$message({
                                          type: "warning",
                                          message: "请重新选择关联单据"
                                          });
                                          return;
                                      }
                                 }
                            }
                        }
                    for(let k in joinData){
                          this.s_content.payments.push(joinData[k]);
                          this.alljoinData.push(joinData[k]);
                          this.s_content.t_price_box.push(joinData[k].swcount);
                        }
                      this.t_price_sum();
                      this.dialogFormVisible3 = false;
                      this.joinData=[];
                      this.activebox='2';
                   }
          }else{
              this.dialogFormVisible3 = true;
              this.$message({
                    type: "warning",
                    message: "请选择关联单据"
                    });
          }


      },

        t_text_del(){//确认取消
         this.subscript();
         this.joinData=[];
         this.activebox='2',
         this.dialogFormVisible3 = false;

        },
        AmendDataClick(row){ // 获取还款账号
           this.Amend.cardNum = row.id;
        },
        AmendApply(Amend){//提交申请

         this.subscript();
         let payments_box = this.s_content.payments;
         this.s_content.t_price_box=[];
              if(Amend.money == ""){
                this.$message({
                                type: "warning",
                                message: "金额不能为空 请重新填写"
                                });
                              return;
              }else if( Amend.number == ""){
                this.$message({
                                type: "warning",
                                message: "人数不能为空 请重新填写"
                                });
                              return
            }else if( Amend.number > Amend.Newnumber){
                  this.$message({
                                type: "warning",
                                message: "人数不能大于库存 请重新填写内容"
                                });
                              return;
            }else if(Amend.money > Amend.Newmoney){
                  this.$message({
                                type: "warning",
                                message: "报销金额不能大于借款金额 请重新填写内容"
                                });
                      return;
            }else if(Amend.money < Amend.Newmoney){
                          if(Amend.state == 0){
                              this.$message({
                                        type: "warning",
                                        message: "请选择拆分/还款"
                                        });
                                return;
                          }else if(Amend.state == 2){
                            if(Amend.cardNum == ""){
                                  this.$message({
                                              type: "warning",
                                              message: "请选择账户"
                                              });
                                                return;
                              }else{
                                  for(let i in payments_box){
                                    if(payments_box[i].paymentID == Amend.paymentID){
                                          payments_box[i].swcount = Amend.money;
                                          payments_box[i].price = Amend.money;
                                          payments_box[i].peopled = Amend.number;
                                          // payments_box[i].peopleCount = Amend.number
                                          payments_box[i].accountID = Amend.cardNum;
                                          payments_box[i].paymentID = Amend.paymentID;
                                          payments_box[i].expenseType = "还款";

                                      }
                                      this.s_content.t_price_box.push(payments_box[i].swcount);
                                  }
                                  console.log(payments_box,'sfasd');
                                  this.AmendOpenVisble = false;
                                  this.disabled_style =false;
                                  this.t_price_sum();
                                  //this.AmendNull();
                                }
                          }else if(Amend.state == 1){
                                Amend.cardNum = 0;
                                //console.log(Amend,'拆分1');
                                for(let i in payments_box){
                                  if(payments_box[i].paymentID == Amend.paymentID){
                                        payments_box[i].swcount = Amend.money;
                                        payments_box[i].price = Amend.money;
                                        payments_box[i].peopled =Amend.number;
                                        //payments_box[i].peopleCount = Amend.number
                                        payments_box[i].accountID = Amend.cardNum;
                                        payments_box[i].paymentID = Amend.paymentID;
                                        payments_box[i].expenseType = "拆分";
                                  }
                                    this.s_content.t_price_box.push(payments_box[i].swcount);
                                }
                                console.log(payments_box,'拆分2');
                              this.AmendOpenVisble = false;
                              this.disabled_style =false;
                              this.t_price_sum();
                              //this.AmendNull();
                          }

                }else if(Amend.money == Amend.Newmoney){
                        Amend.cardNum = 0;
                        for(let i in payments_box){
                            if(payments_box[i].paymentID == Amend.paymentID){
                                  payments_box[i].swcount = Amend.money;
                                  payments_box[i].peopled =Amend.number;
                                  //payments_box[i].peopleCount = Amend.number
                                  payments_box[i].price = Amend.money;
                                  payments_box[i].accountID = Amend.cardNum;
                                  payments_box[i].expenseType = "";
                              }
                              this.s_content.t_price_box.push(payments_box[i].swcount);
                          }
                              this.AmendOpenVisble = false;

                              this.t_price_sum();
                              //this.AmendNull();

                }


        },
        Amenddel(){ // 关闭隐藏
          this.AmendOpenVisble = false;
          this.disabled_style =  true;
          this.AmendNull();
            this.subscript();
            let payments_box = this.s_content.payments;
             for(let i in payments_box){
                if(payments_box[i].expenseType == 1){
                  payments_box[i].expenseType = "拆分"
                }else if(payments_box[i].expenseType == 2){
                  payments_box[i].expenseType = "还款"
                }

             }


        },
        AmendOpen(index,paymentID,condition){ // 打开设置拆分

            this.AmendOpenVisble = true;
            this.subscript();
            let payments_box = this.s_content.payments;
            for(let i in payments_box){
              //console.log(payments_box,'叭叭叭')
              if(payments_box[index].paymentID == paymentID){
                this.statetype = payments_box[index].expenseType;
                let oid = payments_box[i].accountID;
                this.collectionaccount(oid);

                if(payments_box[index].swcount != "" ){
                   if(condition == 0){
                      if(payments_box[index].expenseType == "拆分"){
                        payments_box[index].expenseType = 1
                      }else if(payments_box[index].expenseType == "还款"){
                        payments_box[index].expenseType = 2
                      }
                    }
                   this.Amend.money = payments_box[index].swcount;
                   this.Amend.number = payments_box[index].peopled;
                   this.Amend.Newmoney = payments_box[index].paymentPrice;
                   this.Amend.Newnumber = payments_box[index].peopleCount;
                   this.Amend.state = payments_box[index].expenseType;
                   this.Amend.paymentID = payments_box[index].paymentID;

                }else{
                  this.Amend.Newmoney = payments_box[index].paymentPrice;
                  this.Amend.Newnumber = payments_box[index].peopleCount;
                  this.Amend.money = payments_box[index].paymentPrice;
                  this.Amend.number = payments_box[index].peopleCount;
                  this.Amend.paymentID = payments_box[index].paymentID;
                  }


                 if(this.Amend.money >= this.Amend.Newmoney){
                      this.disabled_style = true;
                  }else{
                      this.disabled_style = false;
                  }






              }


            }




         },
         collectionaccount(oid){
            this.$http
                .post(this.GLOBAL.serverSrc + "/finance/collectionaccount/api/list", {
                      object:{
                     orgID:sessionStorage.getItem('topID'),
                    }
                  })
                  .then(res => {
                    for(let i in res.data.objects){
                        if(res.data.objects[i].cardType == 1){
                          res.data.objects[i].cardType = "收款"
                        }else if(res.data.objects[i].cardType == 2){
                                res.data.objects[i].cardType = "付款"
                          }
                        if(res.data.objects[i].id == oid){
                          this.statetype_Data = res.data.objects[i].title;
                          return;
                        }

                      }
                      this.AmendData = res.data.objects;
                  })
                  .catch(err => {
                    console.log(err);
                  });
         },
        addressChange() { //绑定报销金额文本框
           if(this.Amend.money >= this.Amend.Newmoney){
              this.disabled_style = true;
          }else{
              this.disabled_style = false;
          }
          },
        t_delete(paymentID){// 添加数据删除
          this.subscript();
          let payments_box = this.s_content.payments;
          this.$confirm("是否删除关联信息", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            this.s_content.t_price = 0
            for(let j in payments_box){
                if(payments_box[j].paymentID === paymentID){
                          payments_box.splice(j, 1);
                          if(payments_box.length == 0){//删除后没数据了
                           this.s_content.payments=[];

                           this.s_content.payments.length = 0;
                          } else{//删除后还有数据
                           this.s_content.payments.length = payments_box.length;
                           this.s_content.t_price_box.splice(j, 1);

                          }
                           for(let y in this.alljoinData ){
                                    if(this.alljoinData[y].paymentID === paymentID){
                                        this.alljoinData.splice(y, 1);
                                     }
                                  }
                         this.t_price_sum()
                         this.$message.success('删除成功');
                      }
               }
           })
          .catch(() => {
            console.log(7);
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
        },

        t_price_sum(){//多少项总价多少
          this.subscript();
          let t_price_box = this.s_content.t_price_box;
          let sss = 0 ;
            for(let i=0;i < t_price_box.length;i++){
                  sss = Number(t_price_box[i]) + sss
              }
         this.s_content.t_sum = this.s_content.payments.length;//多少项
         this.s_content.t_price= sss //多少钱
        },
        dialogchange() {  // 报销弹窗
          this.payments = [];
          this.find = 0;
          this.change = false;
          this.dialogFormVisible = true;
        },

        dialogFind(scope) {//详情
          this.find = 1;
          this.change = true;
          this.dialogFormVisible = true;
          this.ruleForm.editableTabs=[];
          this.tableCourse = [];
          this.$http
                .post(this.GLOBAL.serverSrc + "/finance/expense/api/list", {
                  object:{
                    guid:scope.row.guid,
                  }
                })
                .then(res => {
                  if (res.data.isSuccess == true) {
                    var d_objects = res.data.objects;
                    let d_objects_content =[];
                    // let wcount_s = 0;
                    for(let i in d_objects){
                        if(d_objects[i].checkType == 0){
                          this.state = 0;
                        }else if(d_objects[i].checkType == 1){
                          this.state = 1;
                        }else if(d_objects[i].checkType == 2){
                          this.state = 2;
                        }
                            let t_sum = d_objects[i].payments.length;//多少项
                            let qian = 0;
                            let d_price_box =[];
                      for( let s in d_objects[i].payments){
                                d_price_box.push(d_objects[i].payments[s].price);
                              // if(d_objects[i].payments[s].checkType == 1){ //返回0是审核中
                              //     wcount_s = d_objects[i].payments[s].paymentPrice -  d_objects[i].payments[s].price;//未报销金额
                              // }else{
                              //     wcount_s=d_objects[i].payments[s].paymentPrice
                              // }
                                d_objects[i].payments[s].createUser = d_objects[i].createUser,
                                d_objects[i].payments[s].wcount = d_objects[i].payments[s].paymentPrice -  d_objects[i].payments[s].price;
                                if(d_objects[i].payments[s].expenseType == 1){
                                  d_objects[i].payments[s].expenseType= "拆分"
                                }else if(d_objects[i].payments[s].expenseType == 2){
                                 d_objects[i].payments[s].expenseType= "还款"
                               }else{
                                  d_objects[i].payments[s].expenseType= ""
                               }
                              }


                      for(let i=0;i < d_price_box.length;i++){ // 多少钱
                          qian = Number(d_price_box[i]) + qian
                      }
                        d_objects_content.unshift({
                          createUser:d_objects[i].createUser,
                          createTime: d_objects[i].createTime,
                          id:d_objects[i].id,
                          groupCode: d_objects[i].groupCode,
                          productName: d_objects[i].productName,
                          mark:  d_objects[i].mark,
                          t_sum:t_sum,//一共多少项
                          t_price:qian,//一共多少钱
                          guid:d_objects[i].guid,
                          files:d_objects[i].files,
                          payments:d_objects[i].payments,
                          joinData:d_objects[i].joinData,
                      })
                    }

                    for(let i in d_objects_content){
                              let newTabName = ++this.tabIndex;
                                        newTabName=newTabName-1 +"";
                                  this.ruleForm.editableTabs.push({
                                        title: "报销" + newTabName,
                                        name: newTabName,
                                        content: d_objects_content[i]
                                      });
                      if(d_objects_content[i].id == scope.row.expenseID){
                           this.ruleForm.editableTabsValue = this.ruleForm.editableTabs.length.toString();
                        }

                      }
                       this.auditResult(d_objects[0].guid);


                  }
                })
                .catch(err => {
                  console.log(err);
                });
        },
        addbx(item) { //添加报销 || this.image === 0
          this.plans.pid = item.id;
          if(item.groupCode === "" || item.mark === "" || item.productName === "" ){
                this.$message({
                  message: '请检查必填项',
                  type: 'warning'
                });
            }else{
                this.Associated(this.plans.pid);
                this.dialogFormVisible3 = true;
            }
        },
        adddialog() {    //报销人选择弹窗
          this.getUserList(1);
          this.dialogFormVisible1 = true;
        },
        getUserList(val) {   //获取用户列表
          var that = this;
          this.$http
            .post(this.GLOBAL.serverSrc + "/org/api/userpage", {
              object: {
                isDeleted: 0
              },
              pageSize: this.userSize,
              pageIndex: val,
              isGetAll: true,
              id: 0
            })
            .then(function(obj) {
              that.userTotal = obj.data.total;
              that.tableData1 = obj.data.objects;
            })
            .catch(function(obj) {
              console.log(obj);
            });
        },

        planDialog() {  //团期计划弹窗
          this.dialogFormVisible2 = true;
          this.searchHand4();
        },
        handleClick(tab, event) {
          console.log(tab, event);
        },
        joinClick(tab){ // 添加报销tab切换
            this.subscript();
            this.joinData = [];
            this.jointab = tab.name;
            let paymentype = this.paymentype;
            let suppliername = this.t_supplier;
            let pid = this.plans.pid;

            if(this.jointab == "2"){
                paymentype = 2;
                this.s_find = 1;
                pid = this.plans.pid;
            }else if(this.jointab == "0"){
               paymentype = 1;
               this.s_find = 2;
               pid = 0;
            }else if(this.jointab === "1"){
               paymentype = 1;
               this.s_find = 2;
               pid = this.plans.pid;

            }
           this.Associated(pid,suppliername,paymentype)

        },
        handleSizeChange(val) {
          this.pageSize = val;
          this.currentPage4 = 1;
          this.pageList();
        },

        handleCurrentChange(val) {
          this.currentPage4 = val;
          this.pageList();
        },

        handleCurrentChange1(val) {   //选择报销人
          this.getUserList(val);
          console.log(`当前页: ${val}`);
        },

        handleChange(file, files) {  //文件上传
          this.files = files.slice(-3);
        },

        handleSucess(res, file, files) {  //图片上传成功
          this.subscript();
          var paths = [];
          //let one_index = this.ruleForm.editableTabsValue - 1;
              this.s_content.files = files;
          for (var i = 0; i < files.length; i++) {
            paths = JSON.parse(files[i].response).paths[0];
            this.$set(this.s_content.files[i], "url", paths.Url);
            this.$set(this.s_content.files[i], "name", paths.Name);
          }
          this.image = 1;
          this.uid = files[0].uid;
        },
        handleRemove(file, files) {//图片删除
          this.subscript();
          let files_n = this.s_content;
          if(files.length == 0){
            files_n.files = [];
          }
         this.uid = file[0].uid;

          },
        handleError(err, file) {// 上传失败
          this.files = []
        },
        handlePreview(file) {
            window.open(file.url);
          },

        beforeRemove(file, files) {
          return this.$confirm(`确定移除 ${ file.name }？`);
        },
        handleTabsEdit(targetName, action) {   //添加报销和删除
          let newTab= this.getNewTab();
          if (action === "add") {
            let newTabName = ++this.tabIndex + "";
            this.ruleForm.editableTabs.push({
              title: "报销" + this.tabIndex,
              name: newTabName,
              content: newTab
            });
            this.ruleForm.editableTabsValue = newTabName;
          }
          if (action === "remove") {

            if(this.ruleForm.editableTabs.length == 1){
                 this.$confirm("是否取消本次报销申请", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                  })
                .then(() => {
                  targetName = "1"
                  this.tableCourse = [];
                  this.ruleNull()
                    this.tabIndex = 1;
                    this.radio= "1";
                    this.find = 0;
                    this.state = 1;
                    this.dialogFormVisible = false;

                  })
                .catch(() => {
                  this.$message({
                    type: "info",
                    message: "已取消"
                  });
          });
          }else{
            this.$confirm("是否需要删除 报销" + targetName, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
            .then(() => {
                 // this.alljoinData=[];
                  let tabs = this.ruleForm.editableTabs;
                  let activeName = this.ruleForm.editableTabsValue;
                  if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                      if (tab.name === targetName) {
                        let nextTab = tabs[index + 1] || tabs[index - 1];
                        if (nextTab) {
                          activeName = nextTab.name;
                        }
                      }
                    });
                  }

                  let targetb = targetName-1;
                  this.alljoinData.splice(targetb, 1);
                   this.ruleForm.editableTabsValue = activeName;
                  this.ruleForm.editableTabs = tabs.filter(tab => tab.name !== targetName);
                  this.subscript();

                  // let joinData = this.s_content.joinData;
                  // this.alljoinData.push(joinData);


               })

          .catch(() => {
            console.log(7);
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
          }
          }
        },
        tabClick(targetName) {  //切换时候，换内容
          this.ruleForm.editableTabsValue = targetName.name
           },

        getNewTab(){  // 获取新tab实例
          return {
              createUser:"",
              createTime:"",
              groupCode:"",
              productName:"",
              id:"",
              mark:"",
              files:[],
              joinData:[],
              payments:[],
              t_price_box:[],//钱盒子
              t_sum:0,//一共多少项
              t_price:0,//一共多少钱
              plan: {
                planId: "",
                planName: ""
              },
              }
        },
        T_check(){ //添加报销搜索
          this.joinData=[];
          this.joinClick(this.jointab);
        },
        T_update(){//添加报销重置
            this.t_plan = "";
            this.t_supplier = "";
            this.joinData=[];
            this.activebox='2',
            this.Associated(this.plans.pid);
        },
        // beginDateBlur() {//开始时间
        //     if (this.beginDate == "" && this.endDate == "") {
        //       this.pageList(1, this.pageSize);
        //     }
        //   },
        endDateBlur() {//结束时间
          if (this.beginDate == "" && this.endDate == "") {
              this.pageList(1, this.pageSize);
            }
          },
        handleSearch() {// 搜索1
            this.pageIndex = 1;
            this.currentPage4 = 1;
            this.pageList(1, this.pageSize);

          },
        handleReset() { // 重置
            this.pageIndex = 1;
            this.currentPage4 = 1;
            this.expenseID = "";
            this.groupCode = "";
            this.createUser = "";
            this.plan_data = "";
           // this.beginDate = "";
            //this.endDate = "";
            this.pageList(1, this.pageSize);
         },
          //查询列表
        pageList(
            pageIndex = this.pageIndex,
            pageSize = this.pageSize,
            expenseID = this.expenseID,//单号
            groupCode = this.groupCode,//计划
            productName = this.productName,
            createUser = this.createUser,//申请人
            beginTime= this.plan_data[0],//开始时间
            endTime = this.plan_data[1],//结束时间
        ){
            var that = this;
            let object = {};
            if(beginTime == null){
              beginTime = "";
            }else if(endTime == null){
             this.$message({
              type: "warning",
              message: "请选择结束时间"
            });
            }

              expenseID !== "" ? (object.expenseID = expenseID) : expenseID,
              groupCode !== "" ? (object.groupCode = groupCode) : groupCode,
              productName !== "" ?(object.productName = productName) : productName,
              createUser !== ""? (object.createUser = createUser): createUser;
              beginTime !== ""? (object.beginTime = beginTime): beginTime;
              endTime !== ""? (object.endTime = endTime): endTime;

            if (endTime !== "" && beginTime !== "") {
                object.beginTime = moment(beginTime).format("YYYY-MM-DD");
                object.endTime = moment(endTime).format("YYYY-MM-DD");
                }

            that.$http
              .post(that.GLOBAL.serverSrc + "/finance/expense/api/page", {
                pageIndex: that.currentPage4,
                pageSize: that.pageSize,
                total: 0,
                object: object
              })
              .then(function(obj) {
                that.tableData=[];
                that.pageCount = obj.data.total;
                  for(let j in obj.data.objects){
                     that.tableData.push({
                      beginTime: obj.data.objects[j].beginTime,
                      checkType: obj.data.objects[j].checkType,
                      checkTypeEX:  obj.data.objects[j].checkTypeEX,
                      createTime:  obj.data.objects[j].createTime,
                      createUser:  obj.data.objects[j].createUser,
                      endTime:  obj.data.objects[j].endTime,
                      expenseID:  obj.data.objects[j].expenseID,
                      groupCode:  obj.data.objects[j].groupCode,
                      guid:  obj.data.objects[j].guid,
                      orgName:  obj.data.objects[j].orgName,
                      planID:  obj.data.objects[j].planID,
                      price:  obj.data.objects[j].price,
                })
                }
              })
              .catch(function(obj) {
                console.log(obj);
              });
        },
        endDateChange() { //判断结束时间不能在开始时间之前
         if (this.plan_data == null){
              this.plan_data = ""
              this.pageList(1, this.pageSize);
          }
        },
        dateFormat: function(row, column) { // 起始时间格式转换
          let date = row[column.property];
          if(date == undefined || date == '') {
            return '';
          }
          return moment(date).format('YYYY-MM-DD HH:mm:ss')
        },


        tour_check() {   // 团期计划输入框失去焦点时
           this.subscript();
           if(this.s_content.groupCode.length > 10 ){
                  this.$http.post(this.GLOBAL.serverSrc + "/teamquery/get/api/planfinancelist", {
                    "object": {
                      "groupCode": this.s_content.groupCode, // 团号
                    }
                  }).then(res => {
                    if (res.data.isSuccess == true) {
                          this.s_content.productName = res.data.objects[0].title
                          this.s_content.count =  res.data.objects[0].count
                          this.s_content.id =  res.data.objects[0].planID
                          this.plans.pid  = res.data.objects[0].planID
                     }
                  }).catch(err => {
                    console.log(err)
                  })
              }else{
                 this.s_content.productName = "";
                 this.plans.pid  = "" ;
                 this.s_content.groupCode = "";
                  this.$message({
                  message: '请输入正确的团期计划',
                  type: 'warning'
                });

              }
        },


        add_form(object){ // 提交代码
              this.$http
                    .post(this.GLOBAL.serverSrc + "/finance/expense/api/insertlist", {
                        object:object
                      })
                      .then(res => {
                          this.pageList(1, this.pageSize);
                          this.radio= "1";
                          this.tabIndex = 1;
                          this.dialogFormVisible = false;
                          this.submitformBtn=false;
                          this.alljoinData= [];
                          this.tableCourse = [];
                         if (res.data.isSuccess == true) {
                           this.$message({
                            type: "success",
                            message: "创建成功!"
                          });

                        this.ruleNull()
                        this.T_update_btn();
                        this.beginWokeing(res.data.object);
                        return;
                        }else{
                          this.alljoinData= [];
                          this.tableCourse = [];
                          this.ruleNull()
                            this.submitformBtn=false;
                            this.$message({
                            type: "error",
                            message: "创建失败!"
                          });
                        }
                      })
                      .catch(err => {
                        console.log(err);
                      });


        },

        submitForm(ruleForm) { // 报销申请提交
            var joinData_sn=[];
            var files_s=[];
            var editableTabs = this.ruleForm.editableTabs;
            var verify = 0;
            this.object_lisr=[];
            this.submitformBtn=true;
            for(var j in editableTabs){
                let submitForm_list = editableTabs[j].content;
                          if(submitForm_list.mark.length > 80 ){ // 判断摘要字数
                                    this.$message({
                                        message:'摘要字数不能超过80字',
                                        type: 'warning'
                                    });
                                   this.submitformBtn=false;
                                    verify = 0
                                    return;
                                  }
                           if(submitForm_list.groupCode !=="" && submitForm_list.mark !== ""  && submitForm_list.payments.length !== 0){ // 判断必填内容 && submitForm_list.files.length !== 0
                               console.log(this.alljoinData,'排重关联订单')
                               for(var i=0; i<this.alljoinData.length; i++){
                                  for(var j=i+1; j<this.alljoinData.length; j++){
                                    if(this.alljoinData[i].paymentID === this.alljoinData[j].paymentID){
                                        this.$message({
                                                message:'关联单据重复，请重新选择',
                                                type: 'warning'
                                              });
                                             this.submitformBtn=false;
                                              verify = 0
                                              return;
                                        }
                                     }
                                }
                               for(var n in submitForm_list.payments){//判断填写的报销金额
                                if(submitForm_list.payments[n].price === "0" || submitForm_list.payments[n].price === ""){
                                  //  this.$message({
                                  //               message:'请填写本次报销金额',
                                  //               type: 'warning'
                                  //             });
                                  //             this.submitformBtn=false;
                                  //             verify = 0
                                  //             return;
                                }else if(submitForm_list.payments[n].peopled === 0 || submitForm_list.payments[n].peopled === ""){
                                          this.$message({
                                                message:'人数不能为空',
                                                type: 'warning'
                                              });
                                              this.submitformBtn=false;
                                              verify = 0
                                              return;
                                 }
                                submitForm_list.payments[n].peopleCount = submitForm_list.payments[n].peopled;
                                console.log(submitForm_list.payments[n],'fasfas');
                                        // else if(submitForm_list.payments[n].price > submitForm_list.payments[n].wcount){
                                        //     this.$message({
                                        //         message:'本次报销金额不得大于借款金额',
                                        //         type: 'warning'
                                        //       });
                                        //       this.submitformBtn=false;
                                        //       verify = 0
                                        //       return;
                                        //    }
                                         if(submitForm_list.payments[n].swcount == ""){
                                           this.$message({
                                                message:'请设置 报销金额/人数',
                                                type: 'warning'
                                              });
                                              this.submitformBtn=false;
                                              return;
                                        }else if(submitForm_list.payments[n].expenseType == "拆分"){
                                          submitForm_list.payments[n].expenseType = 1;
                                        }else if(submitForm_list.payments[n].expenseType == "还款"){
                                          submitForm_list.payments[n].expenseType = 2;
                                        }else{
                                           submitForm_list.payments[n].expenseType = 0;
                                        }
                                }

                                this.object_lisr.push({//给数组赋值
                                          createUser: sessionStorage.getItem('id'),//用户id
                                          planID:submitForm_list.id,//团期计划id
                                          price:submitForm_list.t_price,//总价
                                          mark:submitForm_list.mark,
                                          files: submitForm_list.files , //图片
                                          payments: submitForm_list.payments, //关联付款单据报销明细
                                          checkType:0,//审批状态
                                        })
                                        verify = 1
                          }else{

                              verify = 0
                              this.$message({
                                  message: '请检查必填项',
                                  type: 'warning'
                              });
                              this.submitformBtn=false;
                              return;
                    }
              }
             if(verify !== 0){
                this.add_form(this.object_lisr)//调用提交接口

              }
          },
        //方法结尾

        // 获取审核列表结果
        auditResult(paramsGuid) {
          var that =this
          this.$http.post(this.GLOBAL.jqUrl + '/JQ/GetInstanceActityInfoForJQ', {
            jQ_ID: paramsGuid,
            jQ_Type: 3,
          }).then(obj => {
            that.tableCourse = []
            that.tableCourse = obj.data.extend.instanceLogInfo;
              if(that.tableCourse.length > 0 ) {
                that.printAuditingContent = '<b>开始</b> -> '
                that.tableCourse.forEach(function (item) {
                  that.printAuditingContent += item.participantName + '( <b>' + item.approvalName + '</b> )'  + ' -> ';
                })
                }
          })
          .catch(obj => {})
      },
     },

      created() {
        this.pageList();
        if (sessionStorage.getItem('hasCashierInfo')) {
          this.ifAccountBtn = true
        } else {
          this.ifAccountBtn = false
        }
        if (!sessionStorage.getItem('hasCashierInfo')) { // 只有是出纳的时候才显示申请人检索
          this.ifShowProposer = true
        }
      },

};
</script>

<style scoped lang="scss">
.borders {
    width: 99%;
    margin: 25px auto;
    height: auto;
    border: 1px solid #e6e6e6;
}
.search {
  float: left;
  margin-top: 30px;
}
.search_style {
  float: left;
  margin-top: 10px;
  margin-left: 20px;
  font-size: 14px;
}
.search_input {
  float: left;
  width: 200px;
}
.search__ {
  float: left;
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
}
.yellow{
  background:#ffff00
  }
.reform {
  float: left;
  width: 99%;
  margin-left: 20px;
  margin-top: 20px;
}
.reform_s {
  float: right;
  margin-bottom: 20px;
  margin-top: 20px;
}
.table_style {
  width: 98%;
  margin-left: 20px;
  margin-top: 20px;
  float: left;
}
.block {
  float: left;
  margin-left: 600px;
  margin-top: 30px;
  margin-bottom: 60px;
}
.block_s {
  float: left;
  margin-left: 370px;
  margin-top: -20px;
  margin-bottom: 85px;
}
.reimbursementer {
  float: left;
  max-width: 700px;
  min-width: 300px;
  min-height: 40px;
  border: 1px solid #dcdfe6;
}
/* .indialog {
  min-height: 300px;
} */

.all .el-upload-list__item {
  clear: both;
}
.re_style {
  margin:20px 30px;
  font-size: 16px;
 }

.sh_style {
  width: 48px;
  border-radius:10%;
  font-size: 12px;
  height: 26px;
  margin:5px 0px 5px 40px;
  text-align: center;
  line-height: 26px;
  background:#999;
  color:#fff;
}
.tg_style{
  width: 48px;
  height: 26px;
  border-radius:10%;
  margin:5px 0px 5px 40px;
  text-align: center;
  line-height: 26px;
  background:#229206;
  color: rgb(234, 234, 234);
}
.bh_style{
  width: 48px;
  height: 26px;
  border-radius:10%;
  margin:5px 0px 5px 40px;
  text-align: center;
  line-height: 26px;
  background:red;
  color:  rgb(234, 234, 234);
}

.upload-demo  .el-upload-list__item {
  width: 30%;
}
.handle_div {
  /* height: 50px; */
  line-height: 40px;
  margin-left: 40px;
  width: 100%;
  float: left;
}
.handle_id {   /*css66666*/
  float: left;
  width: 30%;
}
.handle_people {
  float: left;
  width: 30%;
  /* margin-left: 250px; */
}
.handle_time {
  float: left;
  width: 30%;
  /* margin-left: 250px; */
}
.statetype_style{
  width: 100%;
  height: 400px;
}
.cancel{
  float: right;
  margin-top: -20px;
}
</style>
