<template>
  <div class="supplierList">
    <!--搜索栏-->
    <div class="plan">
      <div style="width:1140px;">
        <div class="fl">
          <span class="emptyPlan">供应商名称</span>
          <el-input v-model="supplierName" class="empty" clearable placeholder="请输入团期计划"></el-input>
        </div>
        <!--<div class="fl" style="margin:0 90px 0 90px;">-->
          <!--<span class="emptyPlan">ID</span>-->
          <!--<el-input v-model="supplierCard" class="empty" clearable placeholder="请输入申请人"></el-input>-->
        <!--</div>-->
        <div class="fl" style="margin:0 90px 0 90px;">
          <span class="emptyPlan" >结算方式</span>
          <el-select v-model="settlement" placeholder="请输入类型" class="empty" clearable>
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item of settlementType"
              :key="item.value"
            />
          </el-select>
        </div>
      </div>
      <div style="width:1140px;">
        <div class="fl">
          <span class="emptyPlan">状态</span>
          <el-select v-model="condition" clearable placeholder="请输入类型" class="empty" >
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item of conditionType"
              :key="item.value"
            />
          </el-select>
        </div>
        <div class="fl" style="width: 100%">
          <span class="emptyPlan">类别</span>
          <el-select v-model="category" placeholder="请输入类型" class="empty" clearable>
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item of borrowingType"
              :key="item.value"
            />
          </el-select>
        </div>
        <!--<div class="fl">-->
        <!--<span class="emptyPlan">可见区域</span>-->
        <!--<el-select v-model="visibleArea" placeholder="请输入类型" class="empty" clearable>-->
          <!--<el-option-->
            <!--:label="item.label"-->
            <!--:value="item.value"-->
            <!--v-for="item of visibleType"-->
            <!--:key="item.value"-->
          <!--/>-->
        <!--</el-select>-->
      <!--</div>-->

      </div>
      <div style="float:right; margin:0 0 30px 0;">
        <el-button type="primary" @click="searchButton()">搜索</el-button>
        <el-button type="primary" plain @click="reset()">重置</el-button>
      </div>
    </div>
    <!--添加按钮-->
    <div style="clear:both;">
      <el-button type="primary" @click="addSupplier">添加</el-button>
    </div>
    <!--表格-->
    <el-table :data="tableData" border class="tableData" :header-cell-style="getRowClass">
      <el-table-column prop="id" label="ID" width="150" align="center"></el-table-column>
      <el-table-column prop="name" label="供应商名称" width="230" align="center"></el-table-column>
      <el-table-column prop="userState" label="状态" width="100" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.userState=='1'" style="color: #7F7F7F">正常</div>
          <div v-if="scope.row.userState=='2'" style="color: #FF4A3D">停用</div>
          <div v-if="scope.row.userState=='0'" style="color: #33D174">等待审核</div>
        </template>
      </el-table-column>
      <el-table-column prop="supplierTypeEX" label="类型" width="150" align="center"></el-table-column>
      <el-table-column prop="isMonthlyEX" label="结算方式" width="150" align="center"></el-table-column>
      <el-table-column prop="orgName" label="所属部门" width="200" align="center"></el-table-column>
      <el-table-column label="操作" width="159" align="center">
        <template slot-scope="scope">
          <span class="cursor" @click="detailsClick(scope.row.id)">详情</span>
          <span class="cursor">|</span>
          <span class="cursor" @click="editClick(scope.row.id,scope.row)">编辑</span>
        </template>
      </el-table-column>
    </el-table>
    <!--详情弹窗-->
    <SupplierDetails
      :flag.sync="flag"
      :msg="pid"
    ref="mychild"></SupplierDetails>
    <el-pagination
      class="pagination"
      :page-sizes="[10,1,30,50]"
      background
      @size-change="handleSizeChange"
      :page-size="pagesize"
      :current-page.sync="currentPage"
      @current-change="handleCurrentChange"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!--添加弹窗-->
    <el-dialog
      :title="title"
      :visible.sync="supplierShow"
      width="1100px"
      style="margin:-80px 0 0 0;"
      custom-class="city_list"
      :show-close="false"
    >
      <div class="addButton">
        <el-button @click="closeSupplier()">取消</el-button>
        <el-button @click="saveModule('rformA')" type="primary">确定</el-button>
      </div>
      <div class="basic">基本信息</div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="rformA"
        label-width="120px"
        style="overflow:hidden; margin:20px 0 0 0;"
      >
        <div style="float:left;">
          <el-form-item label="供应商名称" prop="name">
            <el-input class="name_input" v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="供应商编码" prop="supplierCode">
            <el-input class="name_input" v-model="ruleForm.supplierCode"></el-input>
          </el-form-item>
          <!--12号改过-->
          <!--<el-form-item label="公司可见性" prop="visible">-->
            <!--<el-cascader-->
              <!--class="name_input"-->
              <!--:options="visibleType"-->
              <!--:props="{ multiple: true, checkStrictly: true }"-->
              <!--v-model="ruleForm.visible"-->
              <!--@change="companyList"-->
              <!--clearable-->
              <!--collapse-tags-->
              <!--clearable></el-cascader>-->
          <!--</el-form-item>-->

          <!--<el-select-->
            <!--v-model="ruleForm.visible"-->
            <!--placeholder="请选择"-->
            <!--@change="companyList"-->
            <!--class="name_input">-->
          <!--<el-option-->
          <!--v-for="item in visibleType"-->
          <!--:key="item.value"-->
          <!--:label="item.label"-->
          <!--:value="item.value"-->
          <!--&gt;</el-option>-->
          <!--</el-select>-->
          <!--<el-cascader :options="visibleType" v-model="ruleForm.visible" :props="{ multiple: true, checkStrictly: true }" clearable></el-cascader>-->
          </el-form-item>
          <el-form-item label="状态"  prop="supplierState">
            <el-select v-model="ruleForm.supplierState"
                       clearable placeholder="请选择"
                       class="name_input">
              <el-option
                v-for="item in conditionType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="线路" prop="routeType">
            <el-select v-model="ruleForm.routeType"
                       clearable placeholder="请选择"
                       class="name_input">
              <el-option
                v-for="item in pathType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类别" prop="supplierType" >
            <el-select v-model="ruleForm.supplierType"
                       clearable placeholder="请选择"
                       class="name_input">
              <el-option
                v-for="item in borrowingType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结算方式" prop="supplierWay" >
            <el-select v-model="ruleForm.supplierWay"
                       clearable placeholder="请选择"
                       class="name_input">
              <el-option
                v-for="item in settlementType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
               <!--<el-form-item label="使用部门" prop="userDepartment">-->
          <!--<el-cascader-->
            <!--v-model="ruleForm.userDepartment"-->
            <!--:options="options"-->
            <!--:props="{ multiple: true }"-->
            <!--class="name_input"-->
            <!--clearable-->
          <!--&gt;</el-cascader>-->
        <!--</el-form-item>-->
          <el-form-item label="产品主要方向" prop="orientation">
            <el-input class="name_input" v-model="ruleForm.orientation"></el-input>
          </el-form-item>
          <el-form-item label="到期日期" prop="expireData" >
            <el-date-picker
              v-model="ruleForm.expireData"
              type="datetime"
              :editable="false"
              :picker-options="pickerOptions0"
              placeholder="选择日期"
              class="name_input"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="附件" prop="supplierUpload">
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :file-list="fileList"
            >
              <el-button size="small">上传文件</el-button>
            </el-upload>
          </el-form-item>
        </div>
        <div style="float:right; width:41%;overflow:hidden;">
          <el-form-item label="法人代表" prop="legalPerson">
            <el-input class="name_input" v-model="ruleForm.legalPerson"></el-input>
          </el-form-item>
          <el-form-item label="合同编号" prop="pactNumber">
            <el-input class="name_input" v-model="ruleForm.pactNumber"></el-input>
          </el-form-item>
          <el-form-item label="经手人" prop="handlers">
            <el-input class="name_input" v-model="ruleForm.handlers"></el-input>
          </el-form-item>
          <el-form-item label="经手人电话" prop="handlersPhone">
            <el-input class="name_input" v-model="ruleForm.handlersPhone"></el-input>
          </el-form-item>
          <el-form-item label="负责人" prop="principal">
            <el-input class="name_input" v-model="ruleForm.principal"></el-input>
          </el-form-item>
          <el-form-item label="负责人电话" prop="principalPhone">
            <el-input class="name_input" v-model="ruleForm.principalPhone"></el-input>
          </el-form-item>
          <el-form-item label="操作负责人" prop="operator">
            <el-input class="name_input" v-model="ruleForm.operator"></el-input>
          </el-form-item>
          <el-form-item label="供应商协议" prop="agreement" >
            <el-select v-model="ruleForm.agreement" placeholder="请选择" class="name_input">
              <el-option
                v-for="item in agreement"
                :key="item.value"
                :label="item.label"
                :value="item.value"

              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input class="name_input" v-model="ruleForm.remark"></el-input>
          </el-form-item>
          <!--<el-form-item label="供应商其他名称" prop="otherSupplier">-->
            <!--<el-input class="name_input" v-model="ruleForm.otherSupplier"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="供应商其他名称" prop=""  style="width: 90%">
            <el-tag
              :key="tag"
              v-for="tag in dynamicTags"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input
              style="width: 90%"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 点我添加供应商名称</el-button>
          </el-form-item>
        </div>
      </el-form>
      <div class="basic" style="margin:15px 0 0 0;">账户信息</div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        style="overflow:hidden; margin:20px 0 0 0;"
      >
        <div style="float:left;">
          <el-form-item label="汇款户名" prop="accountName">
            <el-input class="
            " v-model="ruleForm.accountName"></el-input>
          </el-form-item>
          <el-form-item label="开户行" prop="openingBank">
            <el-input class="name_input" v-model="ruleForm.openingBank"></el-input>
          </el-form-item>
        </div>
        <div style="float:right; margin:0 200px 0 0; overflow:hidden;">
          <el-form-item label="账号" prop="account">
            <el-input class="name_input" v-model="ruleForm.account"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="note">
            <el-input class="name_input" v-model="ruleForm.note"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div style="float:right; margin:0 200px 30px 0;">
        <el-button type="primary" plain @click="emptyForm()">清空表单</el-button>
        <el-button type="primary" @click="addEmty()">添加账户</el-button>
      </div>
      <el-table :data="tableDataBank" border class="tableDataBank" :header-cell-style="getRowClass">
        <el-table-column prop="cardName" label="汇款户名" width="109" align="center"></el-table-column>
        <el-table-column prop="bankName" label="开户行" width="150" align="center"></el-table-column>
        <el-table-column prop="cardNumber" label="账号" width="200" align="center"></el-table-column>
        <el-table-column prop="memo" label="备注" width="150" align="center"></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              @click="handleClick(scope.row)"
              type="text"
              size="small"
              class="balk_details"
            >编辑</el-button>
            <div class="table_line">|</div>
            <el-button
              type="text"
              @click.native.prevent="deleteEmty(scope.$index, tableDataBank)"
              class="table_editor"
              size="small"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!--编辑弹窗-->
    <el-dialog
      :title="title"
      :visible.sync="editShow"
      width="1100px"
      style="margin:-80px 0 0 0;"
      custom-class="city_list"
      :show-close="false"
    >
      <div class="addButton">
        <el-button @click="closeSupplier()">取消</el-button>
        <el-button @click="saveModule('rformB')" type="primary">确定</el-button>
      </div>
      <div class="basic">基本信息</div>
      <el-form
        :model="editForm"
        :rules="rules"
        ref="rformB"
        label-width="120px"
        style="overflow:hidden; margin:20px 0 0 0;"
      >
        <div style="float:left;">
          <el-form-item label="供应商名称" prop="name">
            <el-input class="name_input"
                      v-model="editForm.name"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="供应商编码" prop="supplierCode">
            <el-input class="name_input"
                      v-model="editForm.supplierCode"
                      :disabled="true"></el-input>
          </el-form-item>
          <!--<el-form-item label="公司可见性" prop="visible">
            <el-select v-model="ruleForm.visible" placeholder="请选择" @change="companyList">
              <el-option
                v-for="item in visibleType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <!-- <el-cascader :options="visibleType" v-model="ruleForm.visible" :props="{ multiple: true, checkStrictly: true }" clearable></el-cascader> -->
          <!--</el-form-item>&ndash;&gt;-->

          <!--<el-form-item label="公司可见性" prop="visible">-->

            <!--<el-cascader-->
            <!--class="name_input"-->
            <!--:options="visibleType"-->
            <!--:props="{ multiple: true, checkStrictly: true }"-->
            <!--v-model="ruleForm.visible"-->
            <!--@change="companyList"-->
            <!--clearable-->
            <!--collapse-tags-->
            <!--clearable></el-cascader>-->
            <!--</el-form-item>-->
            <!--公司可见性-->
            <!--<el-select-->
              <!--v-model="editForm.visible"-->
              <!--placeholder="请选择"-->
              <!--@change="companyList"-->
              <!--class="name_input">-->
              <!--<el-option-->
                <!--v-for="item in visibleType"-->
                <!--:key="item.value"-->
                <!--:label="item.label"-->
                <!--:value="item.value"-->
              <!--&gt;</el-option>-->
            <!--</el-select>-->
            <!--<el-cascader :options="visibleType" v-model="ruleForm.visible" :props="{ multiple: true, checkStrictly: true }" clearable></el-cascader>-->
          </el-form-item>
          <el-form-item label="状态"  prop="supplierState">
            <el-select
              v-model="editForm.supplierState"
              clearable placeholder="请选择"
              class="name_input"
            @change="handState">
              <el-option
                v-for="item in conditionType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="线路" prop="routeType">
            <el-select
              v-model="editForm.routeType"
              clearable placeholder="请选择"
              class="name_input"
              @change="handRoute">
              <el-option
                v-for="item in pathType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类别" prop="supplierType">
            <el-select
              v-model="editForm.supplierType"
              clearable placeholder="请选择"
              class="name_input"
              @change="handType">
              <el-option
                v-for="item in borrowingType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结算方式" prop="supplierWay">
            <el-select
              v-model="editForm.supplierWay"
              clearable placeholder="请选择"
              class="name_input"
              @change="handWay">
              <el-option
                v-for="item in settlementType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
                <!--<el-form-item label="使用部门" prop="userDepartment">-->
                      <!--<el-cascader-->
                        <!--v-model="editForm.userDepartment"-->
                        <!--:options="options"-->
                        <!--:props="{ multiple: true }"-->
                        <!--clearable-->
                        <!--class="name_input"-->
                      <!--&gt;</el-cascader>-->
                    <!--</el-form-item>-->
          <el-form-item label="产品主要方向" prop="orientation">
            <el-input class="name_input" v-model="editForm.orientation"></el-input>
          </el-form-item>
          <el-form-item label="到期日期" prop="expireData">
            <el-date-picker
              class="name_input"
              v-model="editForm.expireData"
              type="datetime"
              :editable="false"
              :picker-options="pickerOptions0"
              placeholder="选择日期"
              @change="handClick"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="附件" prop="supplierUpload">
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :file-list="fileList"
            >
              <el-button size="small">上传文件</el-button>
            </el-upload>
          </el-form-item>
        </div>
        <div style="float:right; width:41%;overflow:hidden;">
          <el-form-item label="法人代表" prop="legalPerson">
            <el-input class="name_input" v-model="editForm.legalPerson"></el-input>
          </el-form-item>
          <el-form-item label="合同编号" prop="pactNumber">
            <el-input class="name_input" v-model="editForm.pactNumber"></el-input>
          </el-form-item>
          <el-form-item label="经手人" prop="handlers">
            <el-input class="name_input" v-model="editForm.handlers"></el-input>
          </el-form-item>
          <el-form-item label="经手人电话" prop="handlersPhone">
            <el-input class="name_input" v-model="editForm.handlersPhone"></el-input>
          </el-form-item>
          <el-form-item label="负责人" prop="principal">
            <el-input class="name_input" v-model="editForm.principal"></el-input>
          </el-form-item>
          <el-form-item label="负责人电话" prop="principalPhone">
            <el-input class="name_input" v-model="editForm.principalPhone"></el-input>
          </el-form-item>
          <el-form-item label="操作负责人" prop="operator">
            <el-input class="name_input" v-model="editForm.operator"></el-input>
          </el-form-item>
          <el-form-item label="供应商协议" prop="agreement">
            <el-select
              v-model="editForm.agreement"
              placeholder="请选择"
              class="name_input"
              @change="handAgree">
              <el-option
                v-for="item in agreement"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input class="name_input" v-model="editForm.remark"></el-input>
          </el-form-item>
          <!--<el-form-item label="供应商其他名称" prop="otherSupplier">-->
            <!--<el-input class="name_input" v-model="editForm.otherSupplier"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="供应商其他名称" prop="" style="width: 90%">
            <el-tag
              :key="tag"
              class="name_input"
              v-for="tag in dynamicTags"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input
              style="width: 90%"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 点我添加供应商名称</el-button>
          </el-form-item>
        </div>
      </el-form>
      <div class="basic" style="margin:15px 0 0 0;">账户信息</div>
      <el-form
        :model="editForm"
        :edit="edit"
        ref="editForm"
        label-width="120px"
        style="overflow:hidden; margin:20px 0 0 0;"
      >
        <div style="float:left;">
          <el-form-item label="*汇款户名" prop="accountName">
            <el-input class="name_input" v-model="editForm.accountName"></el-input>
          </el-form-item>
          <el-form-item label="*开户行" prop="openingBank">
            <el-input class="name_input" v-model="editForm.openingBank"></el-input>
          </el-form-item>
        </div>
        <div style="float:right; margin:0 200px 0 0; overflow:hidden;">
          <el-form-item label="*账号" prop="account">
            <el-input class="name_input" v-model="editForm.account"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="note">
            <el-input class="name_input" v-model="editForm.note"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div style="float:right; margin:0 200px 30px 0;">
        <el-button type="primary" plain @click="emptyForm1()">清空表单</el-button>
        <el-button type="primary" @click="addEmty1()">添加账户</el-button>
      </div>
      <el-table :data="tableDataBank" border class="tableDataBank" :header-cell-style="getRowClass">
        <el-table-column prop="cardName" label="汇款户名" width="109" align="center"></el-table-column>
        <el-table-column prop="bankName" label="开户行" width="150" align="center"></el-table-column>
        <el-table-column prop="cardNumber" label="账号" width="200" align="center"></el-table-column>
        <el-table-column prop="memo" label="备注" width="150" align="center"></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              @click="handleClick(scope.row)"
              type="text"
              size="small"
              class="balk_details"
            >编辑</el-button>
            <div class="table_line">|</div>
            <el-button
              type="text"
              @click.native.prevent="deleteEmty(scope.$index, tableDataBank)"
              class="table_editor"
              size="small"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
// let id = 0;
import moment from 'moment'
import SupplierDetails from "./supplierDetails/supplierDetails"
export default {
  data() {
    return {
      dynamicTags: [],//供应商其他名称
      flags:true,//编辑页面的input框
      inputVisible: false,
      inputValue: '',
      // aaa: 1,
      // props: {},
      /*props: {
          lazy: true,
          _this: this,
          multiple: true, checkStrictly: true,
          lazyLoad(node, resolve) {
            const { level } = node;
            let nId =204;
            if (level > 0) {
               nId = node.value;
            }
            console.log(nId);
            this._this.$http
            .post(this._this.GLOBAL.serverSrc + "/org/api/deptlist", {
              object: {
                ParentID: nId
              }
            })
            .then(res => {
            let data = res.data.objects.map(v => {
              return {
                label: v.orgName,
                value: v.id,
              };
            });
            resolve(data);
            });
          }
        },*/
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      pid:"",
      userindex:0,//编辑的index
      supplierName: "", //搜索框供应商名称
      supplierCard: "", //搜索框ID
      settlement: "", //搜索框结算名称
      condition: "", //搜索框状态
      category: "", //搜索框类别
      visibleArea: "", //搜索框可见区域
      // 添加区域
      ruleForm: {
        name: "", //供应商名称
        visible: "", //公司可见性
        visible1:"",//公司可见性代码
        supplierState: "正常", //状态
        routeType: "", //线路
        supplierType: "", //类别
        supplierWay: "", //结算方式
        userDepartment: "", //使用部门
        orientation: "", //产品主要方向
        expireData: "", //到期日期
        supplierUpload: "", //附件
        legalPerson: "", //法人代表
        pactNumber: "", //合同编号
        handlers: "", //经手人
        handlersPhone: "", //经手人电话
        principal: "", //负责人
        principalPhone: "", //负责人电话
        operator: "", //操作负责人
        agreement: "", //供应商协议
        remark: "", //备注
        accountName: "", //汇款户名
        openingBank: "", //开户行
        account: "", //账号
        note: "" ,//备注
        supplierCode:""//供应商编码
      },
      //编辑区域
      editForm: {
        name: "", //供应商名称
        visible: "", //公司可见性
        visible1:"",//公司可见性代码
        supplierState: "", //状态
        supplierState1:'',//状态数值
        routeType: "", //线路
        supplierType: "", //类别
        supplierType1:"",//类别的编码
        supplierWay: "", //结算方式
        userDepartment: "", //使用部门
        orientation: "", //产品主要方向
        expireData: "", //到期日期
        supplierUpload: "", //附件
        legalPerson: "", //法人代表
        pactNumber: "", //合同编号
        handlers: "", //经手人
        handlersPhone: "", //经手人电话
        principal: "", //负责人
        principalPhone: "", //负责人电话
        operator: "", //操作负责人
        agreement: "", //供应商协议
        agreement1:"",//供应商协议数字
        remark: "", //备注
        accountName: "", //汇款户名
        openingBank: "", //开户行
        account: "", //账号
        note: "", //备注
        supplierCode:"",//供应商编码
        editbanks:'',//银行信息
        supplierWay1:''//结算方式编号
      },
      //状态
      conditionType: [
        {
          value: "1",
          label: "正常"
        },
        {
          value: "2",
          label: "停用"
        },
        {
          value: "0",
          label: "待审核"
        }
      ],
      // ruleForm_01: {
      //   accountName: "",
      //   openingBank: "",
      //   account: "",
      //   note: ""
      // },
      //验证
      //11号修改过
      // 添加区域的正则判断
      rules: {
        name: [
          { required: true, message: "供应商名称不能为空", trigger: "blur" },
          {
            min: 0,
            max: 40,
            message: "供应商名称字数不能超过40字",
            trigger: "change"
          }
        ],
        handlersPhone:[{
          pattern: /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/,message:'请输入正确的电话号区号后加-'
        }
        ],
        principalPhone:[{
          pattern: /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/,message:'请输入正确的电话号区号后加-'
        }
        ],
        visible: [
          { required: true, message: "公司可见性不能为空", trigger: "blur" }
        ],
        supplierState: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        routeType: [
          { required: true, message: "线路不能为空", trigger: ["blur","change"] }
        ],
        supplierType: [
          { required: true, message: "类别不能为空", trigger: ["blur","change"] }
        ],
        supplierCode: [
          { required: true, message: "供应商编码不能为空", trigger: "blur" }
        ],
        supplierWay: [
          { required: true, message: "结算方式不能为空", trigger: ["blur","change"] }
        ],
        expireData: [
          { required: true, message: "到期日期不能为空", trigger: "blur" }
        ],
        userDepartment: [
          { required: true, message: "使用部门不能为空", trigger: "blur" }
        ],
        // agreement:[
        //   {required: true, message: "请选择供应商协议", trigger: ["blur","change"] }
        // ],
        accountName: [
          { required: true, message: "汇款账户不能为空", trigger: "blur" }
        ],
        account: [{ required: true, message: "账号不能为空", trigger: "blur" }],
        openingBank: [
          { required: true, message: "开户行不能为空", trigger: "blur" }
        ]
      },
      // 编辑区域的正则判断
      edit:{
        name: [
          { required: true, message: "供应商名称不能为空", trigger: "blur" },
          {
            min: 0,
            max: 40,
            message: "供应商名称字数不能超过40字",
            trigger: "change"
          }
        ],
        handlersPhone:[{
          pattern: /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/,message:'请输入正确的电话号区号后加-'
        }
        ],
        principalPhone:[{
          pattern: /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/,message:'请输入正确的电话号区号后加-'
        }
        ],
        visible: [
          { required: true, message: "公司可见性不能为空", trigger: "blur" }
        ],
        supplierState: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        routeType: [
          { required: true, message: "线路不能为空", trigger: "change" }
        ],
        supplierType: [
          { required: true, message: "类别不能为空", trigger: "blur" }
        ],
        supplierCode: [
          { required: true, message: "供应商编码不能为空", trigger: "blur" }
        ],
        supplierWay: [
          { required: true, message: "结算方式不能为空", trigger: "blur" }
        ],
        expireData: [
          { required: true, message: "到期日期不能为空", trigger: "blur" }
        ],
        userDepartment: [
          { required: true, message: "使用部门不能为空", trigger: "blur" }
        ],
        // agreement:[
        //   {required: true, message: "请选择供应商协议", trigger: "blur" }
        // ],
        accountName: [
          { required: true, message: "汇款账户不能为空", trigger: "blur" }
        ],
        account: [{ required: true, message: "账号不能为空", trigger: "blur" }],
        openingBank: [
          { required: true, message: "开户行不能为空", trigger: "blur" }
        ]
      },
      //0settlement: [],//结算方式
      condition: [
        {
          //状态
          value: 1,
          label: "正常"
        },
        {
          value: 2,
          label: "停用"
        },
        {
          value: 0,
          label: "待审核"
        }
      ],
      settlementType: [], //搜索框结算方式数字
      borrowingType: [], //搜索框供应商类别数组
      visibleType: [], //搜索框可见区域数组
      pathType: [], //添加弹窗中线路数组
      tableData: [], //表格
      supplierShow: false, //添加弹窗
      editShow:false,//编辑弹窗
      branch: [], //使用部门选择器
      fileList: [], //添加供应商上传附件
      // 11号修改
      flag:false,
      agreement: [
        {
          //供应商协议
          value: "1",
          label: "是"
        },
        {
          value: "2",
          label: "否"
        }
      ],
      tableDataBank: [], //账户信息表格
      title: "", //标题
      //分页
      currentPage: 1, //当前页数
      pagesize: 10, // 设定默认分页每页显示数
      pageIndex: 1, // 设定当前页数
      total: 0, //总条目数
      options: [] //部门的数据
    };
  },
  components:{
    SupplierDetails:SupplierDetails
  },

  methods: {
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    moment,
    //表格颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#F7F7F7;color:rgb(85, 85, 85);";
      } else {
        return "";
      }
    },
    //搜索框重置
    reset() {
      (this.supplierName = ""), //搜索框供应商名称
        (this.supplierCard = ""), //搜索框ID
        (this.settlement = ""), //搜索框结算名称
        (this.condition = ""), //搜索框状态
        (this.category = ""), //搜索框类别
        (this.visibleArea = ""); //搜索框可见区域
      this.supplierPage();
    },
    //结算方式
    settlemen() {
      this.settlementType = [];
      this.$http
        .post(
          "http://test.dayuntong.com/universal/supplier/api/dictionaryget?enumname=IsMonthly"
        )
        .then(res => {
          for (let i = 0; i < res.data.objects.length; i++) {
            this.settlementType.push({
              value: res.data.objects[i].id,
              label: res.data.objects[i].name
            });
          }
        })
        .then(res => {
          //that.settlementType =  res.data.objects;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //供应商类别
    themeList() {
      this.borrowingType = [];
      this.$http
        .post(
          "http://test.dayuntong.com/universal/supplier/api/dictionaryget?enumname=SupplierType"
        )
        .then(res => {
          console.log(res,"供应商类别")
          for (let i = 0; i < res.data.objects.length; i++) {
            this.borrowingType.push({
              value: res.data.objects[i].id,
              label: res.data.objects[i].name
            });
          }
        })
        .then(res => {
          //this.borrowingType =  res.data.objects;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //可见区域
    visible() {
      this.visibleType = [];
      this.$http
        .post(
          "http://test.dayuntong.com/universal/supplier/api/dictionaryget?enumname=CompanyArea"
        )
        .then(res => {
          for (let i = 0; i < res.data.objects.length; i++) {
            this.visibleType.push({
              value: res.data.objects[i].name,
              key: res.data.objects[i].id,
              label: res.data.objects[i].name
            });
          }
        })
        .then(res => {
          //this.borrowingType =  res.data.objects;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 把公司可见性传给后端
    companyList(item) {
      this.userDeparType = [];
      let sid = item;
      this.$http.post("http://test.dayuntong.com/universal/supplier/api/dictionaryget?enumname=CompanyArea", {
        id: sid
      }).then(res => {
        console.log(res, '把公司可见性传给后端');
        console.log(item, '获取选中的项')
        console.log(this.visibleType, '可见部门')
        this.aaaa();
      });
    },
    //使用部门请求的接口
    aaaa(node, resolve) {
      this.options = [];
      this.$http.post(this.GLOBAL.serverSrc + "/org/api/deptlist", {
        object: {
          ParentID: 210,
          isDeleted: 0
        }
      })
        .then(res => {
          console.log(res, "部门请求")
          console.log(res.data.objects.id, '获取当前数据下的id')
          for (let i = 0; i < res.data.objects.length; i++) {
            this.options.push({
              value: res.data.objects[i].id,
              label: res.data.objects[i].orgName,
              // children:[res.data.objects[i].id,res.data.objects[i].orgName]
            });
          }

        // let data = res.data.objects.map(v => {
        //     return {
        //       label: v.orgName,
        //       value: v.id,
        //     };
        // })
        //resolve(data);
      });
    },
    // visible(node, resolve){
    //     this.visibleType = [];
    //     let nId = 204;
    //     this.$http.post(this.GLOBAL.serverSrc + '/org/api/deptlist', {
    //       "object": {
    //         "ParentID": nId,
    //         "isDeleted": 0
    //       },
    //     })
    //     .then(res => {
    //       for (let i = 0; i < res.data.objects.length; i++) {
    //         this.visibleType.push({
    //           "value": res.data.objects[i].id,
    //           "label": res.data.objects[i].orgName
    //         })
    //       }
    //     }).then(res =>{
    //       //this.visibleType =  res.data.objects;
    //     })
    //   },
    //线路
    trails() {
      this.pathType = [];
      this.$http
        .post(
          "http://test.dayuntong.com/universal/supplier/api/dictionaryget?enumname=ProductArea"
        )
        .then(res => {
          for (let i = 0; i < res.data.objects.length; i++) {
            this.pathType.push({
              value: res.data.objects[i].id,
              label: res.data.objects[i].name
            });
          }
        })
        .then(res => {
          //this.pathType =  res.data.objects;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //添加供应商按钮
    addSupplier() {
      this.title = "添加供应商";
      this.supplierShow = true;
    },
    // 取消按钮关闭弹窗
    closeSupplier() {
      this.supplierShow = false;
      this.editShow = false
      this.emptyForm()
      this.tableDataBank = []
      this.ruleForm = {
        name: "", //供应商名称
        visible: "", //公司可见性
        companyAreaEX: "",//公司可见性数字
        supplierState: "正常", //状态
        routeType: "", //线路
        routeType1:'',
        supplierType: "", //类别
        supplierWay: "", //结算方式
        userDepartment: "", //使用部门
        orientation: "", //产品主要方向
        expireData: "", //到期日期
        supplierUpload: "", //附件
        legalPerson: "", //法人代表
        pactNumber: "", //合同编号
        handlers: "", //经手人
        handlersPhone: "", //经手人电话
        principal: "", //负责人
        principalPhone: "", //负责人电话
        operator: "", //操作负责人
        agreement: "", //供应商协议
        remark: "", //备注
        accountName: "", //汇款户名
        openingBank: "", //开户行
        account: "", //账号
        note: "",//备注
        supplierCode: ""//供应商编码
      }
    },
    //判断显示编辑或者添加弹窗
    saveModule(formName) {
      if (this.title == "添加供应商") {
          this.addLabelTheme(formName);
      } else {
        this.editLabelTheme(formName);
      }
    },
    // 判断输入的编码是否重复
    //添加一条供应商
    addLabelTheme(formName) {
      console.log(formName,456)
      console.log(this.visibleType,'供应商可见性')
      console.log(this.ruleForm.expireData,6666)
      //公司可见性的判断
      // if (this.ruleForm.visible == '集团共享') {
      //   this.ruleForm.visible1 = 1
      // } else if (this.ruleForm.visible == '沈阳专享') {
      //   this.ruleForm.visible1 = 2
      // } else if (this.ruleForm.visible == '吉林专享') {
      //   this.ruleForm.visible1 = 3
      // } else if (this.ruleForm.visible == '大连专享') {
      //   this.ruleForm.visible1 = 4
      // } else if (this.ruleForm.visible == '哈尔滨专享') {
      //   this.ruleForm.visible1 = 5
      // }
      let types = [];
      let keepAlias = [] // 给alias赋值用
      let banks =[];
      for (let i = 0; i < this.tableDataBank.length; i++) {
        banks.push({
          "id": 0,
          "createTime": 0,
          "code": "string",
          "isDeleted": 0,
          "cardNumber": this.tableDataBank[i].cardNumber,
          "bankName": this.tableDataBank[i].bankName,
          "cardName": this.tableDataBank[i].cardName,
          "memo": this.tableDataBank[i].memo,
          "supplierID": 0
        })
      }
      types.push({
        id: 0,
        supplierType: this.ruleForm.supplierType,
        supplierID: 0
      });
      if (this.dynamicTags.length > 0) {
        this.dynamicTags.forEach((item) => {
          keepAlias.push({'name': item, 'id': 0})
        })
        console.log(keepAlias, 'this.dynamicTags')
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          var _this = this;
          this.$http.post(
            this.GLOBAL.serverSrc + "/universal/supplier/api/isexistsuppliercode",
            {
              object:{
                supplierCode:this.ruleForm.supplierCode
              }
            }
          )
            .then(res => {
              console.log(res,'测试')
              if (res.data.isSuccess == true) {
                this.$http
                  .post(
                    this.GLOBAL.serverSrc + "/universal/supplier/api/supplierinsert",
                    {
                      object: {
                        id: 0,
                        createTime: 0,
                        isDeleted: 0,
                        //这个地方有问题
                        userState: this.ruleForm.supplierState == "正常" ? 1 : this.ruleForm.supplierState,
                        name: this.ruleForm.name,
                        types: types,
                        productDirection: this.ruleForm.orientation,
                        supplierCode: this.ruleForm.supplierCode, // 供应商编码
                        isMonthly: this.ruleForm.supplierWay,
                        isAgree: this.ruleForm.agreement,
                        // companyArea: this.ruleForm.visible,
                        companyArea: 1, // 公司可見性
                        productArea: this.ruleForm.routeType,
                        leader: this.ruleForm.principal,
                        phone: this.ruleForm.principalPhone,
                        legalPerson: this.ruleForm.legalPerson,
                        handPerson: this.ruleForm.handlers,
                        handPhone: this.ruleForm.handlersPhone,
                        billName: this.ruleForm.operator,
                        taxNumber: this.ruleForm.pactNumber,
                        orgs: [{
                          "orgID": 0,
                          "orgName": '集团'
                        }], // 使用部門
                        alias: keepAlias, // 部门其他名 otherSupplier
                        expireTime: moment(this.ruleForm.expireData).format('YYYY-MM-DD'), // 到期日期
                        memo: this.ruleForm.remark,
                        banks: banks,
                        //附件
                        files: [{
                          "id": 0,
                          "createTime": 0,
                          "code": "string",
                          "isDeleted": 0,
                          "url": "string",
                          "supplierID": 0,
                          "name": "string"
                        }]
                      }

                    }
                  )
                  .then(res => {
                    if (res.data.isSuccess == true) {
                      this.supplierPage();
                      this.supplierShow = false;
                      this.$refs[formName].resetFields();
                    } else {
                      this.$message.success("编码重复");
                    }
                  });
              } else {
                this.$message.success("供应编码重复请重新填写");
              }
            });

        } else {
          return false;
        }
      });
    },
    // 编辑时的保存
    handClick(){

    },
    handState(val){
      console.log(val,'获取改变的值')
      this.editForm.supplierState1=val
    },
    handRoute(val){
      console.log(val,"获取路线的值")
      this.editForm.routeType1 =val
    },
    handType(val){
      console.log(val,"获取类别的值")
      this.editForm.supplierType1 =val
    },
    handWay(val){
      console.log(val,"获取结算方式的值")
      this.editForm.supplierWay1 =val
    },
    handAgree(val){
      console.log(val,"获取供应商协议的值")
      this.editForm.agreement1 =val
    },
    editLabelTheme(formName){
      console.log(this.pid,'每条数据的id值')
      // console.log(this.editForm,1314)
      // debugger;
      if (this.editForm.supplierState == "正常"){
        this.editForm.supplierState1 =1
      } else if(this.editForm.supplierState == "停用"){
        this.editForm.supplierState1 =2
      }else if(this.editForm.supplierState == "待审核"){
        this.editForm.supplierState1 =0
      };
      // switch (this.editForm.supplierState){
      //   case "正常":
      //     this.editForm.supplierState1 =1;
      //     break;
      //   case "停用":
      //     this.editForm.supplierState1 =2;
      //     break;
      //   case "待审核":
      //     this.editForm.supplierState1 =0;
      //     break;
      // }
      if (this.editForm.agreement == "是"){
          this.editForm.agreement1 =1
      } else {
          this.editForm.agreement1 =2
      };

      // if(this.editForm.visible == '集团共享'){
      //   this.editForm.visible1 = 1
      // }else if(this.editForm.visible == '沈阳专享'){
      //   this.editForm.visible1 = 2
      // }else if(this.editForm.visible == '吉林专享'){
      //   this.editForm.visible1 = 3
      // }else if(this.editForm.visible == '大连专享'){
      //   this.editForm.visible1 = 4
      // }else if(this.editForm.visible == '哈尔滨专享'){
      //   this.editForm.visible1 = 5
      // }
      if(this.editForm.supplierType == '船票'){
        this.editForm.supplierType =0
      }else if(this.editForm.supplierType == '地接社'){
        this.editForm.supplierType =1
      }else if(this.editForm.supplierType == '机票'){
        this.editForm.supplierType =2
      }else if(this.editForm.supplierType == '拼票'){
        this.editForm.supplierType =3
      }else if (this.editForm.supplierType == '酒店'){
        this.editForm.supplierType =4
      } else if (this.editForm.supplierType == '签证'){
        this.editForm.supplierType =5
      } else if(this.editForm.supplierType == '合作拼团社'){
        this.editForm.supplierType =6
      }else if (this.editForm.supplierType == '邮轮'){
        this.editForm.supplierType =7
      } else if (this.editForm.supplierType == '火车票'){
        this.editForm.supplierType =8
      } else if (this.editForm.supplierType == '汽车票'){
        this.editForm.supplierType =9
      };
      if (this.editForm.supplierWay =="一团一结"){
        this.editForm.supplierWay1 =1
      }else if (this.editForm.supplierWay =="走团后结款") {
        this.editForm.supplierWay1 =2
      }else if (this.editForm.supplierWay =="月结") {
        this.editForm.supplierWay1 =3
      }else if (this.editForm.supplierWay =="预存款") {
        this.editForm.supplierWay1 =4
      }else if (this.editForm.supplierWay =="走团前80%走团后20%") {
        this.editForm.supplierWay1 =5
      }else if (this.editForm.supplierWay =="走团前50%走团后月结") {
        this.editForm.supplierWay1 =6
      }else if (this.editForm.supplierWay =="走团前80%走团后月结") {
        this.editForm.supplierWay1 =7
      }else if (this.editForm.supplierWay =="走团前50%走团后50") {
        this.editForm.supplierWay1 =8
      }
      if(this.editForm.routeType == '国内'){
        this.editForm.routeType1 =1
      }else if(this.editForm.routeType == '长航线'){
        this.editForm.routeType1 =2
      }else if(this.editForm.routeType == '东南亚'){
        this.editForm.routeType1 =3
      }else if(this.editForm.routeType == '日韩'){
        this.editForm.routeType1 =4
      }else if(this.editForm.routeType == '港澳台'){
        this.editForm.routeType1 =5
      }else if(this.editForm.routeType == '邮轮'){
        this.editForm.routeType1 =6
      }else if(this.editForm.routeType == '集团'){
        this.editForm.routeType1 =7
      }else if(this.editForm.routeType == '省内周边游'){
        this.editForm.routeType1 =8
      }else if(this.editForm.routeType == '本公司通用'){
        this.editForm.routeType1 =9
      }
    let types = [];
      let keepAlias = [] // 给alias赋值用
      let banks =[];
      for (let i=0;i<this.tableDataBank.length;i++){
        banks.push({
          "id": 0,
          "createTime": 0,
          "code": "string",
          "isDeleted": 0,
          "cardNumber":this.tableDataBank[i].cardNumber,
          "bankName": this.tableDataBank[i].bankName,
          "cardName": this.tableDataBank[i].cardName,
          "memo": this.tableDataBank[i].memo,
          "supplierID": 0
        })
      }
      types.push({
        id: 0,
        supplierType: this.editForm.supplierType,
        supplierID: 0
      });
      if (this.dynamicTags.length > 0) {
        this.dynamicTags.forEach((item) => {
          keepAlias.push({'name': item, 'supplierID': this.userindex})
        })
        console.log(keepAlias, 'this.dynamicTags')
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          var _this = this;
          this.$http
            .post(
              this.GLOBAL.serverSrc + "/universal/supplier/api/suppliersave",
              {
                object: {
                  id: this.userindex,
                  createTime: 0,
                  isDeleted: 0,
                  code:null,
                  userState: this.editForm.supplierState1,
                  name: this.editForm.name,
                  types: types,
                  productDirection: this.editForm.orientation,
                  supplierCode: this.editForm.supplierCode,
                  isMonthly: this.editForm.supplierWay1,
                  isAgree: this.editForm.agreement1,
                  // companyArea: this.editForm.visible,
                  companyArea: 1, // 公司可見性
                  productArea: this.editForm.routeType1,
                  leader: this.editForm.principal,
                  phone: this.editForm.principalPhone,
                  legalPerson: this.editForm.legalPerson,
                  handPerson: this.editForm.handlers,
                  handPhone: this.editForm.handlersPhone,
                  billName: this.editForm.operator,
                  taxNumber: this.editForm.pactNumber,
                  orgs: [
                    {
                    "id": 0,
                    "orgName": "集团"
                  }
                  ], // 使用部門
                  alias:keepAlias, // 部门其他名 otherSupplier
                  expireTime: moment(this.editForm.expireData).format('YYYY-MM-DD'), // 到期日期
                  memo: this.editForm.remark,
                  banks:banks,
                  files: [
                  //   {
                  //   "id": 0,
                  //   "createTime": 0,
                  //   "code": "string",
                  //   "isDeleted": 0,
                  //   "url": "string",
                  //   "supplierID": 0,
                  //   "name": "string"
                  // }
                  ],
                  manageType: 1
                }
              },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
            )
            .then(res => {
              if (res.data.isSuccess == true) {
                // this.tabledata=this.editForm
                this.supplierPage();
                this.editShow = false;
                // Vue.set(this.tableData,this.userindex,this.editForm)
                // this.$refs[formName].resetFields();
                this.$message.success('修改成功')
              } else {
                this.$message.success("编辑失败");
              }
            });
        } else {
          return false;
        }
      });
    },
    //申请
    confirmSupplier() {},
    //分页
    handleSizeChange(page) {
      this.currentPage = 1;
      this.pagesize = page;
      this.supplierPage();
    },
    //当前页面改变时会触发的事件
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.supplierPage();
    },
    //搜索
    searchButton() {
      this.supplierPage();
    },
    //查询表格
    supplierPage(
      supplierName = this.supplierName,
      supplierCard = this.supplierCard,
      settlement = this.settlement,
      condition = this.condition,
      category = this.category,
      visibleArea = this.visibleArea,

    ) {
      var that = this;
      this.$http
    .post(this.GLOBAL.serverSrc + "/universal/supplier/api/supplierpage", {
      object: {
        isDeleted: 0,
        name: supplierName,
        id: supplierCard == "" ? 0 : supplierCard,
        isMonthly: settlement == "" ? 0 : settlement,
        supplierType: category == "" ? 0 : category,
        UserState: condition == "" ? -1 : condition,
        companyArea: visibleArea == "" ? 1 : visibleArea
        /*"isDeleted": 0,
        "supplierType": -1,
        "UserState":-1,*/
      },
      pageSize: this.pagesize,
      pageIndex: this.currentPage,
      isGetAll: true,
      id: 0
    })
    .then(obj => {
      console.log(obj,"tabledata")
      that.total = obj.data.total;
      that.tableData = obj.data.objects;
    })
    .catch(obj => {
      console.log(obj);
    });
},
    //清空表单
    emptyForm() {
      (this.ruleForm.accountName = ""),
        (this.ruleForm.openingBank = ""),
        (this.ruleForm.account = ""),
        (this.ruleForm.note = "");
    },
    emptyForm1() {
      (this.editForm.accountName = ""),
        (this.editForm.openingBank = ""),
        (this.editForm.account = ""),
        (this.editForm.note = "");
    },
    //添加账户
    addEmty(index, row) {
      if (
        this.ruleForm.accountName != "" &&
        this.ruleForm.openingBank != "" &&
        this.ruleForm.account != ""
      ) {
        this.tableDataBank.push({
          cardName: this.ruleForm.accountName,
          bankName: this.ruleForm.openingBank,
          cardNumber: this.ruleForm.account,
          memo: this.ruleForm.note
        });
        this.emptyForm();
      }
      console.log(this.tableDataBank,777)
    },

    addEmty1(index, row) {
      if (
        this.editForm.accountName != "" &&
        this.editForm.openingBank != "" &&
        this.editForm.account != ""

      ) {
        this.tableDataBank.push({
          cardName: this.editForm.accountName,
          bankName: this.editForm.openingBank,
          cardNumber: this.editForm.account,
          memo: this.editForm.note
        });
        this.emptyForm1();
      }
      console.log(this.tableDataBank,777)
    },
    //编辑账户
    handleClick(index, rows) {
      /*this.ruleForm_01.accountName = this.cardName;
        this.ruleForm_01.openingBank = this.bankName;
        this.ruleForm_01.account = this.cardNumber;
        this.ruleForm_01.note = this.memo;*/

    },
    //编辑按钮
    editClick(index,data){
      this.userindex=index
      console.log(this.userindex,"当前的编辑的id")
      this.title = "编辑供应商";
      this.editShow = true;
      this.flags = false;
      // this.editForm = Object.assign({}, data)
      this.$http.post(this.GLOBAL.serverSrc + "/universal/supplier/api/supplierget", {
        id: index
      }).then(res => {
        console.log(res,"获取单条商品信息")
        this.editForm.name=res.data.object.name,
          this.editForm.visible=res.data.object.companyAreaEX, //公司可见性
          // this.editForm.supplierState=res.data.object.userStateEX,
          this.editForm.routeType= res.data.object.productAreaEX, //线路
          this.editForm.supplierType= res.data.object.types[0].supplierTypeEX, //类别
          this.editForm.supplierWay= res.data.object.isMonthlyEX, //结算方式
          // this.editForm.supplierWay1 =res.data.object.isMonthly,
          this.editForm.userDepartment= data.supplierTypeEX, //使用部门
          this.editForm.orientation= res.data.object.productDirection, //产品主要方向
          this.editForm.expireData=res.data.object.expireTime , //到期日期
          this.editForm.supplierUpload= "", //附件
          this.editForm.legalPerson= res.data.object.legalPerson, //法人代表
          this.editForm.pactNumber= res.data.object.taxNumber, //合同编号
          this.editForm.handlers= res.data.object.handPerson, //经手人
          this.editForm.handlersPhone= res.data.object.handPhone, //经手人电话
          this.editForm.principal= res.data.object.leader, //负责人
          this.editForm.principalPhone= res.data.object.phone, //负责人电话
          this.editForm.operator= res.data.object.billName, //操作负责人
          // this.editForm.agreement= res.data.object.isAgree, //供应商协议
          this.editForm.remark= res.data.object.memo, //备注
          this.editForm.accountName= "", //汇款户名
          this.editForm.openingBank= "", //开户行
          this.editForm.account= "", //账号
          this.editForm.note= "", //备注
          this.editForm.supplierCode =res.data.object.supplierCode,//供应商编码
          this.tableDataBank =res.data.object.banks,//保存银行的信息
          this.editForm.supplierState1 =res.data.object.userState
        // 判断是否
        if(res.data.object.isAgree==1) {
          this.editForm.agreement= "是";
        }else if(res.data.object.isAgree==2){
          this.editForm.agreement= "否";
        };
        if(res.data.object.userState ==1){
          this.editForm.supplierState ="正常"
        }else if(res.data.object.userState == 2){
          this.editForm.supplierState ='停用'
        } else if(res.data.object.userState ==0){
          this.editForm.supplierState ='待审核'
        };
        console.log(this.editForm,"编辑列表的数据")
      });
    },
    detailsClick(id){
      console.log(id,'详情时的id')
      this.pid=id
      this.flag = true
      this.$refs.mychild.teamGetDetails(id);
    },
    //删除账户
    deleteEmty(index, rows) {
      rows.splice(index, 1);
    }
  },
  mounted() {
    this.supplierPage();
  },
  // watch:{
  //     conditionType:{
  //       handler(newValue,oldValue){
  //         deep:true
  //       }
  //     },
  //   pathType:{
  //     handler(newValue,oldValue){
  //       deep:true
  //     }
  //   },
  //   borrowingType:{
  //     handler(newValue,oldValue){
  //       deep:true
  //     }
  //   },
  //   settlementType:{
  //     handler(newValue,oldValue){
  //       deep:true
  //     }
  //   },
  //   agreement:{
  //     handler(newValue,oldValue){
  //       deep:true
  //     }
  //   },
  // },

  created() {
    this.themeList(); //供应商类别
    this.settlemen(); //结算方式
    this.visible(); //可见区域
    this.trails(); //线路
  }
};
</script>

<style scoped lang='stylus'>
.supplierList {
  width: 1140px;
}

/* 搜索框样式 */
.name_input {
  width: 200px;
}

.empty {
  width: 200px;
  line-height: 30px;
  margin: 0 0 0 10px;
}

.fl {
  float: left;
  margin: 0 0 20px 0;
}

.emptyPlan {
  margin: 0 0 0 30px;
  float: left;
  width: 80px;
  text-align: right;
  line-height: 40px;
}

.planTime {
  width: 135px;
  line-height: 30px;
  margin: 0 0 0 10px;
}

.time {
  margin: 0 0 0 10px;
}

.plan {
  font-size: 14px;
}

/* 表格样式 */
.tableData {
  width: 1140px;
  margin: 20px 0 0 0;
}

.cursor {
  cursor: pointer;
  color:#A7F43D
}

/* 添加弹窗样式 */
.addButton {
  position: absolute;
  top: 8px;
  right: 10px;
}

.basic {
  font-size: 12pt;
}

/* 银行表格 */
.tableDataBank {
  width: 810px;
  margin: 15px 0 0 50px;
  overflow: hidden;
}

.balk_details {
  float: left;
  margin: 0 0 0 50px;
  color: #000;
}

.table_line {
  float: left;
  margin: 3px 10px 0 10px;
}

.table_editor {
  float: left;
}

/* 分页 */
.pagination {
  text-align: right;
  margin: 30px 0 50px 0;
}
</style>
