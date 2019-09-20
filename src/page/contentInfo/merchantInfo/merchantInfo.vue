<template>
  <div>
    <!--搜索heard-->
    <div>
      <div class="search">
        <div>
          <span>商户名称：</span>
          <el-input v-model="input" placeholder="请输入商户名称" class="search_input"></el-input>
        </div>
        <div style="margin: 0 36px;">
          <span>状态：</span>
          <el-select v-model="statesValue" placeholder="全部状态">
            <el-option
              v-for="item in statesOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div style="position:relative;">
          <span>结算方式：</span>
          <el-select v-model="payValue" placeholder="全部方式">
            <el-option
              v-for="item in payOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <div class="btn">
            <el-button type="primary" class="btnSearch" @click="handleSearch">搜索</el-button>
            <el-button class="btnReset" @click="handleReset">重置</el-button>
          </div>
        </div>
      </div>
    </div>
    <!--end-->
    <!--功能button-->
    <div class="button_style">
      <el-button type="primary" @click="add_info () ">添加</el-button>
      <!-- <el-button type="primary" v-if="tid <= 0" disabled>编辑</el-button>
      <el-button type="primary" v-else @click="edit_info">编辑</el-button>-->
      <!-- <el-button type="danger" v-if="tid <= 0" disabled @click="open7" plain>删除</el-button>
      <el-button type="danger" v-else @click="open7" plain>删除</el-button>-->
    </div>
    <!--end-->
    <!--商户信息-->
    <div class="info_table">
      <el-table
        :data="tableData"
        border
        style="width: 82%"
        :highlight-current-row="true"
        @row-click="handleClick"
      >
        <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
        <el-table-column prop="name" label="商户名字" width="180" align="center"></el-table-column>
        <el-table-column prop="state" label="状态" align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.state == '停用'">
              <div style="color: red">{{scope.row.state}}</div>
            </template>
            <template v-else>
              <div>{{scope.row.state}}</div>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="localCompType" label="类别" align="center"></el-table-column>
        <el-table-column prop="settlementType" label="结算方式" width="100" align="center"></el-table-column>
        <el-table-column prop="linker" label="联系人" align="center"></el-table-column>
        <el-table-column prop="quota" label="额度" width="100" align="center"></el-table-column>
        <el-table-column prop="arrears" label="剩余额度" width="120" align="center"></el-table-column>
        <el-table-column prop="balance" label="总欠款" width="120" align="center"></el-table-column>
        <el-table-column prop="operation" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <div
              style="color: #f5a142;float: left;margin-left: 30px"
              @click="edit_info(1,scope.row)"
            >详情 |</div>
            <div style="color: #f5a142;float: left;" @click="edit_info(2,scope.row)">编辑</div>
          </template>
        </el-table-column>

        <!-- <el-table-column prop="localCompType" label="商户类型" align="center"></el-table-column>
        <el-table-column prop="name" label="商品名称" width="180" align="center"></el-table-column>
        <el-table-column prop="linker" label="联系人" align="center"></el-table-column>
        <el-table-column prop="phone" label="电话" width="120" align="center"></el-table-column>
        <el-table-column prop="department" label="所属部门" align="center"></el-table-column>
        <el-table-column prop="manager" label="区域经理" width="150" align="center"></el-table-column>
        <el-table-column prop="settlementType" label="结算方式" width="100" align="center"></el-table-column>
        <el-table-column prop="quota" label="额度" width="100" align="center"></el-table-column>
        <el-table-column prop="arrears" label="剩余额度" width="120" align="center"></el-table-column>
        <el-table-column prop="balance" label="总欠款" width="120" align="center"></el-table-column>-->
      </el-table>
    </div>
    <!--end-->
    <!--分页-->
    <div class="block" style="margin-bottom: 20px;margin-top: 20px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage4"
        :page-sizes="[5, 10, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!--end-->
    <!--弹窗-->
    <el-dialog
      title="基本信息"
      :visible.sync="dialogFormVisible"
      :show-close="false"
      @close="closeDialog"
      :close-on-click-modal="false"
      width="1000px"
    >
      <div class="dialog">
        <template v-if="btnindex !== 1">
          <!-- 点击页面的添加按钮或者列表的编辑出现的dialog是form -->
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="105px"
            class="demo-ruleForm clearfix"
            :disabled="readonly"
          >
            <div class="saf" style="float: left">
              <el-form-item label="商户名称 :" prop="name">
                <el-input v-model="ruleForm.name" style="width: 250px;" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="类别 :" prop="localCompType">
                <el-select v-model="ruleForm.localCompType" placeholder="请选择" style="width: 250px;">
                  <el-option label="门店" value="0"></el-option>
                  <el-option label="同业" value="1"></el-option>
                  <el-option label="翻盘门店" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态 :" prop="state">
                <el-select v-model="ruleForm.state" placeholder="请选择" style="width: 250px;">
                  <el-option key="2" label="正常" value="2"></el-option>
                  <el-option key="3" label="停用" value="3"></el-option>
                </el-select>
                <!-- <el-radio-group v-model="ruleForm.state">
                  <el-radio label="停用"></el-radio>
                  <el-radio label="正常"></el-radio>
                </el-radio-group>-->
              </el-form-item>
              <!-- <el-form-item label="活动时间" required>
                <el-form-item prop="expTime">
                  <el-date-picker
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyyMMdd"
                    format="yyyy-MM-dd"
                    v-model="ruleForm.expTime"
                    style="width: 250px;"
                  ></el-date-picker>
                </el-form-item>
              </el-form-item>-->
              <el-form-item label="结算方式 :" prop="settlementType">
                <el-select
                  v-model="ruleForm.settlementType"
                  placeholder="请选择"
                  style="width: 250px;"
                >
                  <el-option key="0" label="月结" value="0"></el-option>
                  <el-option key="1" label="非月结" value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="ruleForm.settlementType == '0'" label="额度 :" prop="quota">
                <el-input v-model="ruleForm.quota" style="width: 250px;" placeholder="请输入额度"></el-input>
              </el-form-item>

              <el-form-item label="商户角色 :" prop="LocalCompRole">
                <el-select v-model="ruleForm.LocalCompRole" placeholder="请选择" style="width: 250px;">
                  <el-option label="旅游组团社" value="0"></el-option>
                  <el-option label="独立旅行社" value="1"></el-option>
                  <el-option label="个人/独立旅游顾问" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="门市类型 :" prop="storeType" class="placaBlockhahahah">
                <el-select v-model="ruleForm.storeType" placeholder="请选择" style="width: 250px;">
                  <el-option key="0" label="无" value="0"></el-option>
                  <el-option key="1" label="大运通自营" value="1"></el-option>
                  <el-option key="2" label="加盟门市" value="2"></el-option>
                  <el-option key="3" label="第三方门市" value="3"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="管理人员 :" prop="administrative">
                <!-- <el-cascader
                  ref="adminLeader"
                  class="wewe"
                  v-model="ruleForm.administrative"
                  :props="adminProps"
                  style="width: 250px"
                  placeholder="请输入"
                  @change="cascaderChangeNode"
                ></el-cascader>-->
                <el-autocomplete
                  v-model="ruleForm.administrative"
                  :fetch-suggestions="querySearchAsync"
                  placeholder="请输入"
                  @focus="handleFocusAdminNames"
                  @select="handleSelectAdminNames"
                  @blur="handleBlurAdminNames"
                  :trigger-on-focus="false"
                  style="width: 250px"
                ></el-autocomplete>
                <div style="margin-top: 10px;">
                  <el-tag
                    :key="tag.id"
                    v-for="tag in adminArr"
                    class="tag"
                    closable
                    :disable-transitions="false"
                    @close="handleAdminClose(tag, adminArr)"
                    style="margin-botton: 5px;"
                  >{{tag.value}}</el-tag>
                </div>
              </el-form-item>
              <el-form-item label="地址 :" prop="address">
                <el-input
                  type="textarea"
                  v-model="ruleForm.address"
                  style="width: 250px;resize: none;"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item label="到期日期 :" prop="expTime">
                <el-date-picker
                  type="date"
                  v-model="ruleForm.expTime"
                  style="width: 250px;"
                  placeholder="请选择"
                  value-format="yyyyMMdd"
                  format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="公司logo :" prop="companyLogo" style="width:360px;">
                <el-upload
                  class="upload-demo"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :file-list="fileList2"
                  :limit="1"
                  style="width: 220px;"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
              </el-form-item>
              <!-- <el-form-item v-if="ruleForm.settlementType == '月结'" label="额度" prop="quota">
                <el-input v-model="ruleForm.quota" style="width: 250px;"></el-input>
              </el-form-item>
              <el-form-item label="部们-管理" prop="department">
                <el-select v-model="ruleForm.department" placeholder="请选择部门" style="width: 250px;">
                  <el-option label="门店" value="1"></el-option>
                  <el-option label="同业" value="2"></el-option>
                  <el-option label="翻盘门店" value="3"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="people">
                <el-select v-model="ruleForm.people" placeholder="请选择人员" style="width: 250px;">
                  <el-option label="门店" value="0"></el-option>
                  <el-option label="同业" value="1"></el-option>
                  <el-option label="翻盘门店" value="2"></el-option>
                </el-select>
              </el-form-item>-->
            </div>
            <div class="ty" style="float: left; margin-left: 60px">
              <el-form-item label="联系人姓名 :" prop="linker">
                <el-input v-model="ruleForm.linker" style="width: 250px;"></el-input>
              </el-form-item>
              <el-form-item label="联系人电话 :" prop="phone">
                <el-input v-model="ruleForm.phone" style="width: 250px;"></el-input>
              </el-form-item>
              <el-form-item label="对公户名 :" prop="publicName">
                <el-input v-model="ruleForm.publicName" style="width: 250px;"></el-input>
              </el-form-item>
              <el-form-item label="开户行 :" prop="bankName">
                <el-input v-model="ruleForm.bankName" style="width: 250px;"></el-input>
              </el-form-item>
              <el-form-item label="对公账号 :" prop="bankcardNo">
                <el-input v-model="ruleForm.bankcardNo" style="width: 250px;"></el-input>
              </el-form-item>
              <div class="rrr" style="float: left;width:490px;">
                <el-form-item label="经营范围 :" prop="scopeExt">
                  <el-checkbox-group v-model="ruleForm.scopeExt">
                    <el-checkbox label="出境" name="leave"></el-checkbox>
                    <el-checkbox label="入境" name="enter"></el-checkbox>
                    <el-checkbox label="国内" name="inland"></el-checkbox>
                    <el-checkbox label="赴台游" name="taiyou"></el-checkbox>
                    <el-checkbox label="住宿" name="stay"></el-checkbox>
                    <el-checkbox label="票务" name="ticket"></el-checkbox>
                    <el-checkbox label="邮轮" name="shop"></el-checkbox>
                    <el-checkbox label="汽车租赁" name="car"></el-checkbox>
                    <el-checkbox label="保险" name="insurance"></el-checkbox>
                    <el-checkbox label="其他" name="other"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="区域可见 :" prop="orgs">
                  <el-checkbox-group v-model="ruleForm.orgs">
                    <el-checkbox
                      v-for="item in scoperangeList"
                      :label="item.id"
                      name="orgs"
                      :key="item.id"
                    >{{item.orgName}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="销售人员 :" prop="salesman">
                  <!-- <el-cascader
                    ref="myCascader"
                    class="wewe"
                    v-model="ruleForm.salesman"
                    :props="saleProps"
                    style="width: 250px;margin-bottom: 10px;"
                    placeholder="请输入，可选择多个"
                  ></el-cascader>-->
                  <!-- <el-tag :key="tag" v-for="tag in businessOtherNamesArr" class="tag"  closable :disable-transitions="false" @close="handleClose(tag)"
                  >{{tag}}</el-tag>-->
                  <el-autocomplete
                    v-model="ruleForm.salesman"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入"
                    @focus="handleFocusSalesNames"
                    @select="handleSelectSalesNames"
                    @blur="handleBlurSalesNames"
                    :trigger-on-focus="false"
                    style="width: 250px;margin-bottom: 10px;"
                  ></el-autocomplete>
                  <div style="margin-top: 10px;">
                    <el-tag
                      :key="tag.id"
                      v-for="tag in salesArr"
                      class="tag"
                      closable
                      :disable-transitions="false"
                      @close="handleSalesClose(tag,salesArr)"
                      style="margin-botton: 5px;"
                    >{{tag.value}}</el-tag>
                  </div>
                </el-form-item>
                <el-form-item label="商户其他名称 :" prop="otherNames" class="business">
                  <el-input
                    v-model="ruleForm.otherNames"
                    placeholder="请输入，可输入多个"
                    @keyup.enter.native="handleEnterOtherNames"
                  ></el-input>
                  <div style="margin-top: 10px;">
                    <el-tag
                      :key="index"
                      v-for="(tag,index) in businessOtherNamesArr"
                      class="tag"
                      closable
                      :disable-transitions="false"
                      @close="businessHandleClose(tag)"
                      style="margin-botton: 5px;"
                    >{{tag.name}}</el-tag>
                  </div>
                </el-form-item>
              </div>
            </div>
          </el-form>
          <!-- 账户信息 -->
          <div class="accountInfo">
            <h3>账户信息</h3>
            <el-button type="primary" @click="addAccount(1)">添加</el-button>
            <el-table :data="useList" border style="width: 100%;margin-top: 20px;">
              <el-table-column prop="name" label="名称" width="80" align="center"></el-table-column>
              <el-table-column prop="state" label="状态" width="80" align="center"></el-table-column>
              <el-table-column prop="phone" label="手机号" width="120" align="center"></el-table-column>
              <el-table-column prop="email" label="邮箱" width="160" align="center"></el-table-column>
              <el-table-column prop="sex" label="性别" width="50" align="center"></el-table-column>
              <el-table-column prop="wx" label="微信" width="120" align="center"></el-table-column>
              <el-table-column prop="qq" label="qq" width="120" align="center"></el-table-column>
              <el-table-column prop="peerUserType" label="职务" width="80" align="center"></el-table-column>
              <el-table-column prop="operation" label="操作" width="110" align="center">
                <template slot-scope="scope">
                  <div
                    style="color: #f5a142;float: left;margin-left: 14px"
                    @click="accountEdit(2,scope.$index,scope.row)"
                  >编辑</div>
                  <div
                    style="color: #f5a142;float: left;"
                    @click="accountDelete(scope.$index,scope.row)"
                    v-if="btnindex !== 2"
                  >| 删除</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
        <!-- 点击页面的添加按钮或者列表的编辑出现的dialog是table -->
        <div class="dialogTable" v-if="btnindex == 1">
          <!-- 点击详情基本信息 -->
          <table style="width: 100%;">
            <tr class="dialogTableTr">
              <td class="dialogTableTd">
                <label>ID：</label>
                <span>{{businewwInfPageId}}</span>
              </td>
              <td class="dialogTableTd">
                <label>状态：</label>
                <span>{{ruleForm.state}}</span>
              </td>
              <td class="dialogTableTd">
                <label>区域可见：</label>
                <span>{{ruleForm.orgs}}</span>
              </td>
            </tr>
            <tr class="dialogTableTr">
              <td class="dialogTableTd">
                <label>商户名称：</label>
                <span>{{ruleForm.name}}</span>
              </td>
              <td class="dialogTableTd">
                <label>类别：</label>
                <span>{{ruleForm.localCompType}}</span>
              </td>
              <td class="dialogTableTd">
                <label>结算方式：</label>
                <span>{{ruleForm.settlementType}}</span>
              </td>
            </tr>
            <tr class="dialogTableTr">
              <td class="dialogTableTd">
                <label>商户角色：</label>
                <span>{{ruleForm.LocalCompRole}}</span>
              </td>
              <td class="dialogTableTd">
                <label>到期日期：</label>
                <span>{{ruleForm.expTime}}</span>
              </td>
              <td class="dialogTableTd">
                <label>门市类型：</label>
                <span>{{ruleForm.storeType}}</span>
              </td>
            </tr>
            <tr class="dialogTableTr">
              <td class="dialogTableTd">
                <label>管理人员：</label>
                <span>{{ruleForm.administrative}}</span>
              </td>
              <td class="dialogTableTd">
                <label>地址：</label>
                <span>{{ruleForm.address}}</span>
              </td>
              <td class="dialogTableTd">
                <label>联系人姓名：</label>
                <span>{{ruleForm.linker}}</span>
              </td>
            </tr>
            <tr class="dialogTableTr">
              <td class="dialogTableTd">
                <label>联系人电话：</label>
                <span>{{ruleForm.phone}}</span>
              </td>
              <td class="dialogTableTd">
                <label>对公户名：</label>
                <span>{{ruleForm.publicName}}</span>
              </td>
              <td class="dialogTableTd">
                <label>开户行：</label>
                <span>{{ruleForm.bankName}}</span>
              </td>
            </tr>
            <tr class="dialogTableTr">
              <td class="dialogTableTd">
                <label>对公账号：</label>
                <span>{{ruleForm.bankcardNo}}</span>
              </td>
              <td class="dialogTableTd">
                <label>经营范围：</label>
                <span>{{ruleForm.scopeExt}}</span>
              </td>
              <td class="dialogTableTd">
                <label>额度：</label>
                <span>{{ruleForm.quota}}</span>
              </td>
            </tr>
            <tr class="dialogTableTr">
              <td class="dialogTableTd">
                <label>公司logo：</label>
                <span></span>
              </td>
              <td class="dialogTableTd">
                <label>销售人员：</label>
                <span>{{ruleForm.salesman}}</span>
              </td>
            </tr>
          </table>
          <!-- 点击详情账户信息 -->
          <div class="accountInfo">
            <h3>账户信息</h3>
            <el-button type="primary" v-if="btnindex !== 1">添加</el-button>
            <el-table :data="useList" border style="width: 100%;margin-top: 20px;">
              <el-table-column prop="name" label="名称" width="120" align="center"></el-table-column>
              <el-table-column prop="state" label="状态" width="120" align="center"></el-table-column>
              <el-table-column prop="phone" label="手机号" width="120" align="center"></el-table-column>
              <el-table-column prop="email" label="邮箱" width="120" align="center"></el-table-column>
              <el-table-column prop="sex" label="性别" width="80" align="center"></el-table-column>
              <el-table-column prop="wx" label="微信" width="120" align="center"></el-table-column>
              <el-table-column prop="qq" label="qq" width="120" align="center"></el-table-column>
              <el-table-column prop="peerUserType" label="职务" width="120" align="center"></el-table-column>
            </el-table>
          </div>
          <!-- 点击详情欠款信息 -->
          <div class="relevanceDept">
            <h3>关联欠款</h3>
            <div class="relevanceDeptWarn">
              <p class="el-icon-warning">
                已关联
                <span style="color:#108ee9">1</span> 项 &nbsp;&nbsp;&nbsp; 总计：
                <span style="font-size: 16px;">1200.00 元</span>
              </p>
            </div>
            <el-table :data="tableRelevanceDeptInfo" border style="width: 100%;margin-top: 20px;">
              <el-table-column prop="orderNum" label="订单编号" width="120" align="center"></el-table-column>
              <el-table-column prop="state" label="产品名称" width="120" align="center"></el-table-column>
              <el-table-column prop="telphone" label="团期计划" width="120" align="center"></el-table-column>
              <el-table-column prop="email" label="出团日期" width="120" align="center"></el-table-column>
              <el-table-column prop="gender" label="订单金额" width="80" align="center"></el-table-column>
              <el-table-column prop="wechat" label="欠款金额" width="120" align="center"></el-table-column>
              <el-table-column prop="QQ" label="已还金额" width="120" align="center"></el-table-column>
              <el-table-column prop="duty" label="欠款日期" width="120" align="center"></el-table-column>
              <el-table-column prop="duty" label="应还日期" width="120" align="center"></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="ButtonCls">
          <el-button type="primary" v-if="tid==0" @click="submitForm('ruleForm')">确定</el-button>
          <el-button type="primary" v-if="btnindex == 1" @click="editBtn(2)">编辑</el-button>
          <el-button type="primary" v-if="btnindex == 2" @click="editorForm('ruleForm')">修改</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="添加账户"
      :visible.sync="isAddAccount"
      :show-close="false"
      class="addAccount"
      :close-on-click-modal="false"
      width="500px"
    >
      <h3>手机号和邮箱可作为用户名进行登录</h3>
      <el-form ref="accountForm" :model="accountForm" :rules="accountFormRules" label-width="80px">
        <el-form-item label="姓名" prop="name" style="width：250px;">
          <el-input v-model="accountForm.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="accountForm.phone" placeholder="请输入" style="width：250px;"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="accountForm.email" placeholder="请输入" style="width：250px;"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="accountForm.sex" placeholder="请选择" style="width：250px;">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="微信" prop="wx">
          <el-input v-model="accountForm.wx" placeholder="请输入" style="width：250px;"></el-input>
        </el-form-item>
        <el-form-item label="qq" prop="qq">
          <el-input v-model="accountForm.qq" placeholder="请输入" style="width：250px;"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="accountForm.state" placeholder="请选择" style="width：250px;">
            <el-option label="正常" value="2"></el-option>
            <el-option label="停用" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="accountForm.password"
            placeholder="请输入"
            style="width：250px;"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="职务" prop="peerUserType" style="margin-bottom: 68px;">
          <el-checkbox-group
            v-model="accountForm.peerUserType"
            @change="bindCheckBox(accountForm.peerUserType)"
          >
            <el-checkbox label="管理员" name="peerUserType"></el-checkbox>
            <el-checkbox label="销售" name="peerUserType"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item class="addAccountBtn fr" v-if="isAddAccountBtn !== 2">
          <el-button @click="addAccountCancelBtn('accountForm')">取消</el-button>
          <el-button type="primary" @click="addAccountAddBtn('accountForm')">添加账户</el-button>
        </el-form-item>
        <el-form-item class="addAccountBtn fr" v-if="isAddAccountBtn == 2">
          <el-button @click="addAccountEditCancel">取消</el-button>
          <el-button type="primary" @click="addAccountAddBtn('accountForm')">更改账户</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--end-->
  </div>
</template>

<script>
import state from "../../../store/state";

export default {
  name: "merchantInfo",
  data() {
    //效验添加账户信息弹窗中微信字段
    let wechatvalidator = (rule, value, callback) => {
      if (/[\u4E00-\u9FA5]/g.test(value)) {
        return callback("请输入正确格式");
      } else {
        return callback();
      }
    };
    let that = this;
    return {
      businewwInfPageId: "", //商户信息详情页的ID
      vague: [], //模糊搜索的数组
      cascaderArr: [],
      isAddAccountBtn: 0, //判断账户信息弹窗是从添加按钮进入还是编辑进入
      accountArr: [], //用来接收本地添加账户的字段
      tableRelevanceDeptInfo: [], //点击详情欠款信息
      isAddAccount: false, // 判断添加账户弹窗的出现
      scoperangeList: [], //区域可见接口接收
      businessOtherNamesArr: [], //商户其他名称tag列表
      adminArr: [], //管理人员tag列表
      salesArr: [], //销售人员tag列表
      fileList: [], //上传图片
      btnindex: 0, //编辑还是详情判断弹窗按钮的字段
      readonly: true, // 点击表单修改然后只读
      statesValue: "", //搜索状态字段
      payValue: "", //搜过结算字段
      tid: 0,
      pagesize: 10,
      total: 1,
      currentPage4: 4,
      accountForm: {
        name: "",
        phone: "",
        email: "",
        sex: "",
        wx: "",
        qq: "",
        state: "",
        password: "",
        peerUserType: ["管理人员"]
      }, //添加账户信息的对象
      accountFormRules: {
        name: [
          { required: true, message: "请输入名字", trigger: "blur" },
          { max: 40, message: "不要超过40个字符", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入电话", trigger: "blur" },
          { min: 11, max: 11, message: "请输入11位数字", trigger: "blur" },
          { pattern: /(^[\-0-9][0-9]*(.[0-9]+)?)$/, message: "请输入数字" }
        ],
        email: [
          { type: "email", message: "请输入正确格式的邮箱", trigger: "blur" }
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        // rules中 正则
        wx: [{ validator: wechatvalidator, trigger: "blur" }],
        qq: [
          {
            min: 5,
            max: 11,
            pattern: /(^[\-0-9][0-9]*(.[0-9]+)?)$/,
            message: "请输入正确格式",
            trigger: "blur"
          }
        ],
        state: [{ required: true, message: "请选择状态", trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 30, message: "请输入6-30位密码", trigger: "blur" }
        ],
        peerUserType: [
          { required: true, message: "请选择职务", trigger: "blur" }
        ]
      },
      ruleForm: {
        name: "", //
        storeType: "", //门市类型默认是无
        localCompType: "", //类别
        state: null, //状态默认是正常
        expTime: "", //到期时间
        settlementType: null, //结算方式
        quota: "",
        department: "",
        people: "",
        scopeExt: [], //经营范围
        orgs: [], //区域可见
        address: "",
        linker: "",
        phone: "",
        publicName: "",
        bankName: "",
        bankcardNo: "",
        LocalCompRole: "", //商户角色
        salesman: "", //销售人员
        administrative: "", //管理人员
        otherNames: "" //商户其他名字
      },
      rules: {
        // expTime: [{ type: "string", message: "请选择日期", trigger: "change" }],
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { max: 40, message: "不要超过40个字符", trigger: "blur" }
          // { validator: nameValidator, trigger: "blur" }
        ],
        localCompType: [
          { required: true, message: "请选择类型", trigger: "change" }
        ],
        state: [{ required: true, message: "请选择状态", trigger: "change" }],
        settlementType: [
          { required: true, message: "请选择结算方式", trigger: "change" }
        ],
        LocalCompRole: [
          { required: true, message: "请选择商户角色", trigger: "change" }
        ],
        storeType: [
          { required: true, message: "请选择门市类型", trigger: "blur" }
        ],
        administrative: [
          { required: true, message: "请选择管理人员", trigger: "change" }
        ],
        quota: [
          { required: true, message: "请输入额度", trigger: "blur" },
          { pattern: /(^[\-0-9][0-9]*(.[0-9]+)?)$/, message: "请输入自然数" }
        ],
        department: [
          { required: true, message: "请选择类型", trigger: "change" }
        ],
        people: [{ required: true, message: "请选择类型", trigger: "change" }],
        address: [{ max: 80, message: "不要超过80个字符", trigger: "blur" }],
        linker: [
          { required: true, message: "请输入联系人姓名", trigger: "blur" },
          { max: 4, message: "不要超过4个字符", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入联系人电话", trigger: "blur" },
          { min: 11, max: 11, message: "请输入11位数字", trigger: "blur" },
          { pattern: /(^[\-0-9][0-9]*(.[0-9]+)?)$/, message: "请输入数字" }
        ],
        publicName: [
          { required: true, message: "请输入对公户名", trigger: "blur" },
          { max: 40, message: "不要超过40个字符", trigger: "blur" }
        ],
        bankName: [
          { required: true, message: "请输入开户行", trigger: "blur" },
          { max: 30, message: "不要超过30个字符", trigger: "blur" }
        ],
        bankcardNo: [
          { required: true, message: "请输入对公账号", trigger: "blur" },
          { max: 30, message: "不要超过30个字符", trigger: "blur" }
        ],
        scopeExt: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个经营",
            trigger: "change"
          }
        ],
        orgs: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个区域",
            trigger: "change"
          }
        ],
        salesman: [{ required: true, message: "请输入", trigger: "change" }],
        otherNames: [{ max: 40 }]
      },
      dialogFormVisible: false,
      input: "", //搜索输入框
      tableData: [],
      useList: [], //弹窗中的账户信息
      statesOptions: [
        {
          value: 2,
          label: "正常"
        },
        {
          value: 3,
          label: "停用"
        }
      ],
      payOptions: [
        {
          value: 1,
          label: "月结"
        },
        {
          value: 2,
          label: "非月结"
        }
      ],
      fileList2: []
    };
  },
  methods: {
    // 管理人员的模糊查询
    querySearchAsync(queryString, cb) {
      this.vague = [];
      this.$http
        .post(this.GLOBAL.serverSrc + "/org/api/userlist", {
          object: {
            name: queryString
          }
        })
        .then(res => {
          for (let i = 0; i < res.data.objects.length; i++) {
            this.vague.push({
              uid: res.data.objects[i].id,
              value: res.data.objects[i].name,
              userCode: res.data.objects[i].userCode
            });
          }
          let results = queryString
            ? this.vague.filter(this.createStateFilter(queryString))
            : [];
          cb(results);
        });
    },
    createStateFilter(queryString) {
      return restaurant => {
        return restaurant.value;
      };
    },
    // 商户其他名字enter触发的事件
    handleEnterOtherNames() {
      let otherNamesObj = {};
      // otherNamesObj["nq"] = 1
      // otherNamesObj["n"] = 2
      // otherNamesObj["na"] = 3

      otherNamesObj["name"] = this.ruleForm.otherNames;
      console.log(otherNamesObj);
      this.businessOtherNamesArr.push(otherNamesObj);
      this.ruleForm.otherNames = "";
      console.log(this.businessOtherNamesArr);
    },
    // 管理人员focus触发的事件
    handleFocusAdminNames() {
      this.ruleForm.administrative = "";
    },
    // 销售人员focus触发的事件
    handleFocusSalesNames() {
      this.ruleForm.salesman = "";
    },
    // 管理人员select触发的事件
    handleSelectAdminNames(item) {
      console.log(item);
      this.adminArr.push(item);
      this.handleBlurAdminNames();
      console.log(this.adminArr);
    },
    // 销售人员select触发的事件
    handleSelectSalesNames(item) {
      this.salesArr.push(item);
      this.handleBlurSalesNames();
    },
    // 管理人员blur触发的事
    handleBlurAdminNames() {
      let arr = [];
      for (let i = 0; i < this.adminArr.length; i++) {
        this.adminArr[i].isDeleted = 0;
        this.adminArr[i].jqUserType = 1;
        arr.push(this.adminArr[i].value);
      }
      this.ruleForm.administrative = arr.join(",");
    },
    // 销售人员blur触发的事件
    handleBlurSalesNames() {
      let arr = [];
      for (let i = 0; i < this.salesArr.length; i++) {
        this.salesArr[i].isDeleted = 0;
        this.salesArr[i].jqUserType = 2;
        arr.push(this.salesArr[i].value);
      }
      this.ruleForm.salesman = arr.join(",");
    },
    // 管理 销售 tag 删除
    handleAdminClose(tag, arr) {
      arr.forEach((v, k, arr) => {
        if (arr[k].value == tag.value) {
          arr.splice(k, 1);
        }
      });
      this.arr = arr;
      this.handleBlurAdminNames();
    },
    // 销售 tag 删除
    handleSalesClose(tag, arr) {
      arr.forEach((v, k, arr) => {
        if (arr[k].value == tag.value) {
          arr.splice(k, 1);
        }
      });
      this.arr = arr;
      this.handleBlurSalesNames();
    },
    // 商户其他人员tag删除
    businessHandleClose(tag, arr) {
      this.businessOtherNamesArr.splice(
        this.businessOtherNamesArr.indexOf(tag),
        1
      );
    },
    //管理人员懒加载方法
    // initAdminCascader(node, resolve) {
    //   const { level } = node;
    //   let nId = 204;
    //   if (level > 0) {
    //     nId = node.value;
    //   }
    //   // let isCascader = this.$refs.adminLeader.getCheckedNodes()[0];
    //   // let address
    //   // isCascader.hasChildren == false ? address = "/org/api/userlistwithorg" : address = "/org/api/deptlist"
    //   this.$http
    //     .post(this.GLOBAL.serverSrc + "/org/api/deptlist", {
    //       object: {
    //         ParentID: nId
    //       }
    //     })
    //     .then(res => {
    //       this.cascaderArr = res.data.objects.forEach(v => {
    //         // let data = res.data.objects.forEach(v => {
    //         return {
    //           label: v.orgName,
    //           value: v.id,
    //           leaf: v.isLeaf < 2
    //         };
    //       });
    //       resolve(this.cascaderArr);
    //     });
    // },
    // 销售人员懒加在的方法
    // initSaleCascader(node, resolve) {
    //   const { level } = node;
    //   let nId = 204;
    //   if (level > 0) {
    //     nId = node.value;
    //   }
    //   this.$http
    //     .post(this.GLOBAL.serverSrc + "/org/api/deptlist", {
    //       object: {
    //         ParentID: nId
    //       }
    //     })
    //     .then(res => {
    //       // console.log(res);
    //       let data = res.data.objects.forEach(v => {
    //         return {
    //           label: v.orgName,
    //           value: v.id,
    //           leaf: v.isLeaf < 2
    //         };
    //       });
    //       resolve(data);
    //     });
    // },
    // 添加账户信息弹窗中职位checkbox 单选切换
    bindCheckBox(value) {
      this.accountForm.peerUserType = [];
      this.accountForm.peerUserType.push(value[1]);
    },
    // 删除账户信息按钮
    accountDelete(index, row) {
      // console.log(index,row)
      this.useList.splice(index, 1);
    },
    //编辑账户信息按钮
    accountEdit(idx, index, row) {
      // console.log(index,row)
      this.isAddAccount = true;
      this.accountForm = row;
      this.isAddAccountBtn = idx;
    },
    // 从编辑按钮进入的弹窗的取消按钮
    addAccountEditCancel() {
      this.isAddAccount = false;
      this.isAddAccountBtn = 0;
    },
    //添加账户信息弹窗的取消按钮事件
    addAccountCancelBtn(accountForm) {
      this.accountForm = {
        name: "",
        phone: "",
        email: "",
        sex: "",
        wx: "",
        qq: "",
        state: "",
        password: "",
        peerUserType: [] //职位
      };
      this.$refs[accountForm].resetFields();
      this.isAddAccount = false;
      this.isAddAccountBtn = 0;
    },
    //添加账户信息弹窗的添加账户按钮事件
    addAccountAddBtn(accountForm) {
      // debugger
      // isAddAccountBtn == 1 是第一次添加保存到本地
      // isAddAccountBtn == 2 是此时没有删除按钮 只可编辑 掉接口
      if (this.isAddAccountBtn == 1) {
        this.$refs[accountForm].validate(valid => {
          if (valid) {
            this.accountForm.createTime = new Date().getTime();
            this.useList.push(this.accountForm);
            if (this.accountForm.state == 2) {
              this.accountForm.state = "正常";
            } else {
              this.accountForm.state = "停用";
            }
            if (this.accountForm.sex == 1) {
              this.accountForm.sex = "男";
            } else {
              this.accountForm.sex = "女";
            }
            this.isAddAccount = false;
            this.$message({
              message: "添加成功",
              type: "success"
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else if (this.isAddAccountBtn == 2) {
      }
    },
    // 点击添加商户或者编辑出现的dialog上的添加账户信息
    addAccount(index) {
      this.isAddAccountBtn = index;
      this.isAddAccount = true;
      this.accountForm = {
        name: "",
        phone: "",
        email: "",
        sex: "",
        wx: "",
        qq: "",
        state: "",
        password: "",
        peerUserType: [] //职位
      };
      // this.$nextTick((accountForm) => {
      //   this.$refs["addForm"].resetFields();
      // });
    },
    handlePreview(file) {
      // console.log(file);
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },

    //cascader 管理人员选中后判断是否有children从而判断是否是末节点 如果是则请求接口拼接
    // cascaderChangeNode() {
    //   let isCascader = this.$refs.adminLeader.getCheckedNodes()[0];
    //   // console.log(111111111111)
    //   // console.log(isCascader)
    //   if (isCascader.hasChildren === false) {
    //     //部门人员
    //     this.$http
    //       .post(
    //         this.GLOBAL.serverSrc + "/org/api/userlistwithorg",
    //         {
    //           id: isCascader.value
    //         },
    //         {
    //           headers: {
    //             Authorization: "Bearer " + localStorage.getItem("token")
    //           }
    //         }
    //       )
    //       .then(res => {
    //         this.cascaderArr.push(res.data.objects);
    //         console.log(this.cascaderArr);
    //         console.log(res);
    //       })
    //       .catch(function(error) {
    //         console.log(error);
    //       });
    //   }
    // },
    // dialog关闭的回调
    closeDialog() {
      this.btnindex = 0;
    },
    // getTime(val) {
    //   const d = new Date(val);
    //   console.log(val)
    //   console.log(d)
    //   this.ruleForm.expTime =
    //     d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    //     console.log(this.ruleForm.expTime)
    // },
    //销售人员联动下拉框消失时触发事件
    // cascader(e, val) {
    //   // console.log("cascader");
    //   // console.log(e);
    //   // console.log(val);
    //   // console.log(this.$refs.myCascader.getCheckedNodes()[0].pathLabels);
    //   console.log(this.ruleForm.salesman);
    //   if (e === false) {
    //     let arr = this.$refs.myCascader.getCheckedNodes()[0].pathLabels;
    //     let b = arr.join("-");
    //     this.businessOtherNamesArr.push(b);
    //     console.log(this.businessOtherNamesArr);
    //   }
    // },

    // 搜索
    handleSearch() {
      this.pageList();
    },
    //查询列表
    pageList() {
      var that = this;
      this.$http
        .post(this.GLOBAL.serverSrc + "/universal/localcomp/api/page", {
          pageIndex: 1,
          pageSize: 10,
          object: {
            name: that.input,
            state: that.statesValue,
            settlementType: that.payValue
            // 1月结 2非月结
            // 2正常 3停用
            // jqUserType 1 管理员  2 销售
          }
        })
        .then(function(obj) {
          that.total = obj.data.total;
          that.tableData = obj.data.objects;
          that.tableData.forEach(function(v, k, arr) {
            arr[k]["department"] = "XXX";
            arr[k]["manager"] = "阳阳";
            if (arr[k]["state"] == 2) {
              arr[k]["state"] = "正常";
            } else {
              arr[k]["state"] = "停用";
            }
            if (arr[k]["localCompType"] == 0) {
              arr[k]["localCompType"] = "门店";
            } else if (arr[k]["localCompType"] == 1) {
              arr[k]["localCompType"] = "同业";
            } else {
              arr[k]["localCompType"] = "翻盘门店";
            }
            if (arr[k]["settlementType"] == 2) {
              arr[k]["settlementType"] = "非月结";
            } else {
              arr[k]["settlementType"] = "月结";
            }
          });
        })
        .catch(function(obj) {
          console.log(obj);
        });
    },
    // 重置
    handleReset() {
      this.input = "";
      this.statesValue = "";
      this.payValue = "";
      this.list();
    },
    handleSizeChange(val) {
      this.pagesize = val;
      var that = this;
      this.$http
        .post(this.GLOBAL.serverSrc + "/universal/localcomp/api/page", {
          pageIndex: 1,
          pageSize: val,
          total: 0,
          object: {}
        })
        .then(function(obj) {
          that.total = obj.data.total;
          that.tableData = obj.data.objects;
          that.tableData.forEach(function(v, k, arr) {
            // arr[k]["department"] = "XXX";
            // arr[k]["manager"] = "阳阳";
            if (arr[k]["state"] == 2) {
              arr[k]["state"] = "正常";
            } else {
              arr[k]["state"] = "停用";
            }
            if (arr[k]["localCompType"] == 0) {
              arr[k]["localCompType"] = "门店";
            } else if (arr[k]["localCompType"] == 1) {
              arr[k]["localCompType"] = "同业";
            } else {
              arr[k]["localCompType"] = "翻盘门店";
            }
            if (arr[k]["settlementType"] == 2) {
              arr[k]["settlementType"] = "非月结";
            } else {
              arr[k]["settlementType"] = "月结";
            }
          });
          console.log(obj.data.total);
        })
        .catch(function(obj) {
          console.log(obj);
        });
    },
    handleCurrentChange(val) {
      var that = this;
      this.$http
        .post(this.GLOBAL.serverSrc + "/universal/localcomp/api/page", {
          pageIndex: val,
          pageSize: this.pagesize,
          total: 0,
          object: {}
        })
        .then(function(obj) {
          that.total = obj.data.total;
          that.tableData = obj.data.objects;
          that.tableData.forEach(function(v, k, arr) {
            arr[k]["department"] = "XXX";
            arr[k]["manager"] = "阳阳";
            if (arr[k]["state"] == 2) {
              arr[k]["state"] = "正常";
            } else {
              arr[k]["state"] = "停用";
            }
            if (arr[k]["localCompType"] == 0) {
              arr[k]["localCompType"] = "门店";
            } else if (arr[k]["localCompType"] == 1) {
              arr[k]["localCompType"] = "同业";
            } else {
              arr[k]["localCompType"] = "翻盘门店";
            }
            if (arr[k]["settlementType"] == 2) {
              arr[k]["settlementType"] = "非月结";
            } else {
              arr[k]["settlementType"] = "月结";
            }
          });
          // console.log(obj.data.total);
        })
        .catch(function(obj) {
          console.log(obj);
        });
      // console.log(`当前页: ${val}`);
    },
    add_info() {
      this.tid = 0;
      this.clear();
      this.readonly = false;
      this.dialogFormVisible = true;
    },
    // 详情弹窗上的点击编辑
    editBtn(index) {
      this.edit_info(2, this.tid);
    },
    // 编辑
    edit_info(index, row) {
      // this.businessOtherNamesArr = [];
      index === 1 ? (this.readonly = true) : (this.readonly = false);
      this.btnindex = index;
      this.tid = row.id;
      this.getOneMess(row.id);
      this.dialogFormVisible = true;
    },
    //提交
    submitForm(ruleForm) {
      // 判断添加是是否有账户 有则可以添加 无则不可添加
      if (this.useList.length == 0) {
        this.$message.error("请添加账户信息");
      } else {
        this.$refs[ruleForm].validate(valid => {
          if (valid) {
            this.addMerchan(ruleForm);
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    resetForm(ruleForm) {
      //this.$refs[formName].resetFields();
      this.ruleForm = {
        name: "", //
        storeType: "", //门市类型默认是无
        localCompType: "",
        state: 0, //状态默认是正常
        expTime: "",
        settlementType: 1, //结算方式
        quota: "",
        department: "",
        people: "",
        scopeExt: [], //经营范围
        orgs: [], //区域可见
        address: "",
        linker: "",
        phone: "",
        publicName: "",
        bankName: "",
        bankcardNo: "",
        LocalCompRole: "", //商户角色
        salesman: "", //销售人员
        administrative: "" //管理人员
      };
      if (this.btnindex !== 1) this.$refs["ruleForm"].resetFields();
      this.dialogFormVisible = false;
      this.btnindex = 0;
      this.adminArr = [];
      this.salesArr = [];
      this.businessOtherNamesArr = [];
    },
    // 修改
    editorForm(ruleForm) {
      // console.log(ruleForm);
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          this.editMerchan();
          this.tid = 0;
          this.dialogFormVisible = false;
        } else {
          console.log("error submit!!");
          // console.log(this.ruleForm);
          return false;
        }
      });
    },
    //列表
    list() {
      var that = this;
      this.$http
        .post(this.GLOBAL.serverSrc + "/universal/localcomp/api/page", {
          pageIndex: 1,
          pageSize: this.pagesize,
          // total: 1, //总条数
          object: {
            // isDeleted: 0 //是否删除
          }
        })
        .then(function(obj) {
          // console.log(obj);
          that.total = obj.data.total;
          that.tableData = obj.data.objects;
          that.tableData.forEach(function(v, k, arr) {
            arr[k]["department"] = "XXX";
            arr[k]["manager"] = "阳阳";
            if (arr[k]["state"] == 2) {
              arr[k]["state"] = "正常";
            } else {
              arr[k]["state"] = "停用";
            }
            if (arr[k]["localCompType"] == 0) {
              arr[k]["localCompType"] = "门店";
            } else if (arr[k]["localCompType"] == 1) {
              arr[k]["localCompType"] = "同业";
            } else {
              arr[k]["localCompType"] = "翻盘门店";
            }
            if (arr[k]["settlementType"] == 2) {
              arr[k]["settlementType"] = "非月结";
            } else {
              arr[k]["settlementType"] = "月结";
            }
          });
          // console.log(obj.data.total);
        })
        .catch(function(obj) {
          console.log(obj);
        });
    },
    //添加
    addMerchan(ruleForm) {
      //判断商户其他名称是否具有唯一性 并且输个个数不可超过五十个
      if (this.businessOtherNamesArr.length !== 0) {
        if (this.businessOtherNamesArr.length > 50) {
          this.$message.error("商户其他名称不可超过50个");
          this.dialogFormVisible = true;
          return;
        }
      }
      if (
        this.tableData.filter(v => this.ruleForm.otherNames == v.name).length !=
        0
      ) {
        this.$message.error("添加失败,该商户其他名称已存在");
        this.dialogFormVisible = true;
        return;
      }
      if (
        new Set(this.businessOtherNamesArr).size !==
        this.businessOtherNamesArr.length
      ) {
        // this.$message.error("该商户其他名称中输入重复名称")
        this.businessOtherNamesArr = [...new Set(this.businessOtherNamesArr)];
        // return
      }

      // 判断商户名称是否是具有唯一性
      if (
        this.tableData.filter(v => this.ruleForm.name == v.name).length != 0
      ) {
        this.$message.error("添加失败,该商户名称已存在");
        this.dialogFormVisible = true;
        return;
      }

      // 状态
      if (this.ruleForm.state == "停用") {
        this.ruleForm.state = 3;
      } else {
        this.ruleForm.state = 2;
      }
      // 结算方式
      if (this.ruleForm.settlementType == "非月结") {
        this.ruleForm.settlementType = 2;
        this.ruleForm.quota = 0;
      } else {
        this.ruleForm.settlementType = 1;
      }
      // 门市类型
      if (this.ruleForm.storeType == "无") {
        this.ruleForm.storeType = 0;
      } else if (this.ruleForm.storeType == "大运通自营") {
        this.ruleForm.storeType = 1;
      } else if (this.ruleForm.storeType == "加盟门市") {
        this.ruleForm.storeType = 2;
      } else if (this.ruleForm.storeType == "第三方门市") {
        this.ruleForm.storeType = 3;
      }
      // 经营范围
      let scopeExt = this.ruleForm.scopeExt.join(",");
      console.log(scopeExt);
      // this.ruleForm.orgs = this.ruleForm.orgs.join(",");
      /*let name = [];
          this.ruleForm.scopeExt.forEach(item => {
            name.push(item);
          })
          this.ruleForm.scopeExt['name'] = [];
          this.ruleForm.scopeExt.name = name;*/
      // 区域可见
      let orgs = [];
      for (let i = 0; i < this.ruleForm.orgs.length; i++) {
        let org = {};
        org.orgID = this.ruleForm.orgs[i];
        org.isDeleted = 0;
        org.createTime = new Date().getTime();
        orgs.push(org);
      }
      this.ruleForm.orgs = orgs;
      // console.log(this.ruleForm.orgs)
      // 添加账户
      this.useList.forEach((value, index, arr) => {
        if (arr[index].state == "正常") {
          arr[index].state = 2;
        } else {
          arr[index].state = 3;
        }
        if (arr[index].sex == "男") {
          arr[index].sex = 1;
        } else {
          arr[index].sex = 2;
        }
        if (arr[index].peerUserType == "管理员") {
          arr[index].peerUserType = 1;
        } else {
          arr[index].peerUserType = 2;
        }
      });

      // jqAdminList 管理和销售人员
      let adminAndSalesArr = [...this.adminArr, ...this.salesArr];
      adminAndSalesArr = adminAndSalesArr.map(item => {
        return {
          name: item.value,
          userCode: item.userCode,
          uid: item.uid,
          jqUserType: item.jqUserType,
          isDeleted: item.isDeleted
        };
      });

      // localCompAliasList 商户其他名称
      // console.log(this.businessOtherNamesArr)
      // let businessOtherNamesArr = this.businessOtherNamesArr.join(",");
      // console.log(businessOtherNamesArr)
      this.$http
        .post(this.GLOBAL.serverSrc + "/universal/localcomp/api/insert", {
          object: {
            isDeleted: 0,
            code: null,
            name: this.ruleForm.name,
            localCompType: this.ruleForm.localCompType,
            address: this.ruleForm.address,
            state: this.ruleForm.state,
            expTime: this.ruleForm.expTime,
            settlementType: this.ruleForm.settlementType,
            quota: this.ruleForm.quota,
            scopeExt: scopeExt,
            linker: this.ruleForm.linker,
            phone: this.ruleForm.phone,
            publicName: this.ruleForm.publicName,
            bankName: this.ruleForm.bankName,
            bankcardNo: this.ruleForm.bankcardNo,
            balance: this.ruleForm.balance,
            arrears: this.ruleForm.arrears,
            imgUrl: this.ruleForm.imgUrl,
            localCompRole: this.ruleForm.localCompRole,
            storeType: this.ruleForm.storeType,
            orgs: this.ruleForm.orgs,
            useList: this.useList,
            jqAdminList: adminAndSalesArr,
            localCompAliasList: this.businessOtherNamesArr
          }
        })
        .then(obj => {
          this.dialogFormVisible = false;
          this.list();
          this.$message({
            message: "添加成功",
            type: "success"
          });
        })
        .catch(obj => {
          this.$message({
            message: "添加失败",
            type: "error"
          });
          console.log(obj);
        });
    },
    //修改
    editMerchan() {
      if (this.ruleForm.state == "停用") {
        this.ruleForm.state = 3;
      } else {
        this.ruleForm.state = 2;
      }
      if (this.ruleForm.settlementType == "非月结") {
        this.ruleForm.settlementType = 2;
      } else {
        this.ruleForm.settlementType = 1;
      }
      if (this.ruleForm.settlementType == 0) {
        this.ruleForm.quota = 0;
      }
      this.ruleForm.scopeExt = this.ruleForm.scopeExt.join(",");
      console.log(this.ruleForm.expTime);
      if (this.ruleForm.expTime.length > 0) {
        let year = "";
        let month = "";
        let day = "";
        let pin = "";
        year = this.ruleForm.expTime.substring(0, 4);
        month = this.ruleForm.expTime.substring(5, 7);
        day = this.ruleForm.expTime.substring(8, 10);
        pin = year + month + day;
        this.ruleForm.expTime = pin;
      }
      console.log(this.ruleForm.expTime);
      this.ruleForm.id = this.tid;
      var that = this;
      this.$http
        .post(this.GLOBAL.serverSrc + "/universal/localcomp/api/save", {
          object: this.ruleForm
        })
        .then(function(obj) {
          that.list();
        })
        .catch(function(obj) {
          console.log(obj);
        });
    },
    clear() {
      this.businessOtherNamesArr = [];
      this.adminArr = [];
      this.salesArr = [];
      this.useList = [];
      this.ruleForm = {
        name: "", //
        storeType: "无", //门市类型默认是无
        localCompType: "",
        state: "正常", //状态默认是正常
        expTime: "",
        settlementType: "非月结", //结算方式
        quota: "",
        department: "",
        people: "",
        scopeExt: [], //经营范围
        orgs: [], //区域可见
        address: "",
        linker: "",
        phone: "",
        publicName: "",
        bankName: "",
        bankcardNo: "",
        LocalCompRole: "", //商户角色
        salesman: "", //销售人员
        administrative: ""
      };
      if (this.$refs["ruleForm"] !== undefined) {
        this.$refs["ruleForm"].resetFields();
      }
    },
    //获取一条信心
    getOneMess(id) {
      this.$http
        .post(this.GLOBAL.serverSrc + "/universal/localcomp/api/get", {
          id: id
        })
        .then(obj => {
          console.log(obj);
          const { object } = obj.data;
          const {
            jqAdminList,
            localCompAliasList,
            orgs,
            useList
          } = obj.data.object;
          this.ruleForm.name = object.name;
          // this.ruleForm.localCompType = String(object.localCompType);
          // 商户信息详情页的ID
          this.businewwInfPageId = object.id;
          this.useList = useList;
          // 状态
          if (object.state == 2) {
            this.ruleForm.state = "正常";
          } else {
            this.ruleForm.state = "停用";
          }
          // 类别
          if (object.localCompType == 0) {
            this.ruleForm.localCompType = "门店";
          } else if (object.localCompType == 1) {
            this.ruleForm.localCompType = "同业";
          } else {
            this.ruleForm.localCompType = "翻盘门店";
          }
          // 商户角色
          if (object.localCompRole == 0) {
            this.ruleForm.localCompRole = "旅游组团社";
          } else if (object.localCompRole == 1) {
            this.ruleForm.localCompRole = "独立旅行社";
          } else {
            this.ruleForm.localCompRole = "个人/独立旅游顾问";
          }
          // 门市类型
          if (object.storeType == 0) {
            this.ruleForm.storeType = "无";
          } else if (object.storeType == 1) {
            this.ruleForm.storeType = "大运通自营";
          } else if (object.storeType == 2) {
            this.ruleForm.storeType = "加盟门市";
          } else {
            this.ruleForm.storeType = "第三方门市";
          }

          // 经营范围
          this.ruleForm.scopeExt = object.scopeExt;

          // 管理人员 和 销售
          jqAdminList.forEach((val, idx, arr) => {
            if (arr[idx].jqUserType == 1) {
              this.adminArr.push(arr[idx]);
            } else if (arr[idx].jqUserType == 2) {
              this.salesArr.push(arr[idx]);
            }
          });
          let adminArr = [],
            salesArr = [];
          this.adminArr.forEach((val, idx, arr) => {
            adminArr.push(this.adminArr[idx].name);
          });
          this.salesArr.forEach((val, idx, arr) => {
            salesArr.push(this.salesArr[idx].name);
          });
          this.ruleForm.administrative = adminArr.join(",");
          this.ruleForm.salesman = salesArr.join(",");

          // 区域可见
          for (let i = 0; i < orgs.length; i++) {
            for (let j = 0; j < this.scoperangeList.length; j++) {
              if (orgs[i].orgID == this.scoperangeList[j].id) {
                this.ruleForm.orgs.push(this.scoperangeList[j].orgName)
              }
            }
          }
          this.ruleForm.orgs = this.ruleForm.orgs.join(',')
          // console.log(this.ruleForm.orgs)

          let year = "";
          let month = "";
          let day = "";
          let pin = "";
          year = String(object.expTime).substring(0, 4);
          month = String(object.expTime).substring(4, 6);
          day = String(object.expTime).substring(6, 8);
          pin = year + "-" + month + "-" + day;
          this.ruleForm.expTime = pin;
          // this.ruleForm.expTime = new Date(pin);
          // console.log(this.ruleForm.expTime);
          // }
          if (object.settlementType == 2) {
            this.ruleForm.settlementType = "非月结";
          } else {
            this.ruleForm.settlementType = "月结";
          }
          this.ruleForm.quota = object.quota;
          //todo    部门和人员 预留
          this.ruleForm.department = "1";
          this.ruleForm.people = "2";
          // this.ruleForm.scopeExt = object.scopeExt.split(",");
          this.ruleForm.address = object.address;
          this.ruleForm.linker = object.linker;
          this.ruleForm.phone = object.phone;
          this.ruleForm.publicName = object.publicName;
          this.ruleForm.bankName = object.bankName;
          this.ruleForm.bankcardNo = object.bankcardNo;
        })
        .catch(obj => {
          console.log(obj);
        });
    },
    //删除
    // rowDelete() {
    //   var that = this;
    //   this.$http
    //     .post(this.GLOBAL.serverSrc + "/universal/localcomp/api/delete", {
    //       id: this.tid
    //     })
    //     .then(function(obj) {})
    //     .catch(function(obj) {
    //       console.log(obj);
    //     });
    // },
    // //删除弹框
    // open7() {
    //   this.$confirm("此操作将永久删除该条记录, 是否继续?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //     center: true
    //   })
    //     .then(() => {
    //       this.rowDelete();
    //       this.list();
    //       this.tid = 0;
    //       this.$message({
    //         type: "success",
    //         message: "删除成功!"
    //       });
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消删除"
    //       });
    //     });
    // },
    handleClick(row, event, column) {
      this.tid = row.id;
    },
    // dialog中区域可见获取数据
    areaAxios() {
      this.$http
        .post(this.GLOBAL.serverSrc + "/org/api/deptlist", {
          object: {
            ParentID: 204
          }
        })
        .then(res => {
          // console.log(res)
          this.scoperangeList = res.data.objects;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    this.list();
    this.areaAxios();
  }
};
</script>

<style scoped>
.addAccountBtn {
  margin-top: -44px;
}

.el-dialog .el-input,
.el-select {
  width: 250px !important;
}
.fr {
  float: right;
}
.addAccount {
  padding-bottom: 30px;
  padding-left: 20px;
  box-sizing: border-box;
}
.addAccount h3 {
  margin-left: 22px;
  margin-top: -5px;
  margin-bottom: 30px;
  color: #f5a142;
}
.relevanceDept {
  width: 98%;
}
.relevanceDeptWarn {
  background-color: #e6f3fc;
  padding-left: 16px;
  border-radius: 5px;
}
.el-icon-warning:before {
  color: #108ee9;
  font-size: 18px;
  margin-right: 10px;
}
.el-upload-list__item {
  width: 130px !important;
}
/* .upload-demo .el-upload-list,.el-form-item__content{
  width: 250px!important;
} */
.el-input__inner::-webkit-input-placeholder {
  color: #333 !important;
}
.tag {
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
  display: block;
  margin-bottom: 10px;
  width: 250px;
}
.el-tag {
  white-space: normal !important;
  height: auto;
}
.fl {
  float: left;
}
.accountInfo {
  width: 922px;
  margin-top: 30px;
}
.dialog {
  height: 600px;
  min-width: 934px;
  overflow-y: scroll;
}
.dialog::-webkit-scrollbar {
  width: 0px;
  background-color: #808080;
}
.clearfix:after,
.clearfix:before {
  content: "";
  display: table;
}
.clearfix:after {
  clear: both;
}
.clearfix {
  *zoom: 1;
}
.btn {
  position: absolute;
  right: -85px;
  bottom: -60px;
}
.el-dialog__wrapper .el-dialog {
  top: -7vh !important;
}
.rrr .el-form-item {
  margin-bottom: 32px !important;
}
.search {
  display: flex;
  padding-left: 5px;
  box-sizing: border-box;
}
.search_input {
  width: 217px;
  margin-left: 20px;
}
.button_style {
  margin-top: 65px;
}
.info_table {
  margin-top: 20px;
}
.ButtonCls {
  position: absolute;
  right: 30px;
  top: 16px;
}
.el-checkbox + .el-checkbox {
  margin-right: 10px;
}
.block {
  float: right;
  margin-top: 50px;
  margin-bottom: 50px;
}
.dialogTableTr {
  line-height: 40px;
}
.dialogTableTd {
  width: 33.33%;
  height: auto;
}
</style>
