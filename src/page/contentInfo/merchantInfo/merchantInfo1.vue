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
      <el-table :data="tableData" border :highlight-current-row="true" @row-click="handleClick">
        <el-table-column prop="id" label="ID" align="center"></el-table-column>
        <el-table-column prop="name" label="商户名字" align="center" width="250"></el-table-column>
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
        <el-table-column prop="settlementType" label="结算方式" align="center"></el-table-column>
        <el-table-column prop="linker" label="联系人" align="center"></el-table-column>
        <el-table-column prop="quota" label="额度" align="center"></el-table-column>
        <el-table-column prop="arrears" label="剩余额度" align="center"></el-table-column>
        <el-table-column prop="balance" label="总欠款" align="center"></el-table-column>
        <el-table-column prop="operation" label="操作" align="center">
          <template slot-scope="scope" style="cursor:pointer;margin:0 auto;">
            <div
              style="color: #f5a142;float:left;margin-left:30px;cursor:pointer;"
              @click="edit_info(1,scope.row.id)"
            >详情 |</div>
            <div
              style="color: #f5a142;float: left;cursor:pointer;"
              @click="edit_info(2,scope.row.id)"
            >编辑</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--end-->
    <!--分页-->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage4"
        :page-sizes="[5, 10, 50, 100]"
        :page-size="10"
        background
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
      width="1100px"
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
            <div class="saf" style="float: left;">
              <el-form-item label="商户名称 :" prop="name">
                <el-input
                  v-model="ruleForm.name"
                  style="width: 250px;"
                  placeholder="请输入"
                  :disabled="btnindex == 2"
                  :title="ruleForm.name"
                ></el-input>
              </el-form-item>
              <el-form-item label="商户其他名称" prop="otherNames" style="width: 350px;">
                <el-tag
                  :key="index"
                  v-for="(tag,index) in businessOtherNamesArr"
                  closable
                  :disable-transitions="false"
                  @close="businessHandleClose(tag)"
                >{{tag.name}}</el-tag>
                <el-input
                  style="width: 90%"
                  v-if="isInputVisible"
                  v-model="ruleForm.otherNames"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleEnterOtherNames"
                  @blur="handleEnterOtherNames"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 点我添加商户名称</el-button>
              </el-form-item>
              <el-form-item label="商户编码:" prop="localCompCode">
                <el-input
                  v-model="ruleForm.localCompCode"
                  style="width: 250px;"
                  placeholder="请输入"
                  :disabled="btnindex == 2"
                ></el-input>
              </el-form-item>
              <el-form-item label="类别 :" prop="localCompType">
                <el-select v-model="ruleForm.localCompType" placeholder="请选择" style="width: 250px;">
                  <el-option label="门店" value="1"></el-option>
                  <el-option label="同业" value="2"></el-option>
                  <el-option label="翻盘门店" value="3"></el-option>
                  <el-option label="个体分销" value="4"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态 :" prop="state">
                <el-select v-model="ruleForm.state" placeholder="请选择" style="width: 250px;">
                  <el-option key="2" label="正常" value="2"></el-option>
                  <el-option key="3" label="停用" value="3"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="结算方式 :" prop="settlementType">
                <el-select
                  v-model="ruleForm.settlementType"
                  placeholder="请选择"
                  style="width: 250px;"
                >
                  <el-option key="0" label="月结" value="1"></el-option>
                  <el-option key="1" label="非月结" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="ruleForm.settlementType == '月结'|| ruleForm.settlementType == '1'"
                label="额度 :"
                prop="quota"
              >
                <el-input v-model="ruleForm.quota" style="width: 250px;" placeholder="请输入额度"></el-input>
              </el-form-item>

              <el-form-item label="商户角色 :" prop="localCompRole">
                <el-select v-model="ruleForm.localCompRole" placeholder="请选择" style="width: 250px;">
                  <el-option label="旅游组团社" value="1" key="1"></el-option>
                  <el-option label="独立旅行社" value="2" key="2"></el-option>
                  <el-option label="个人/独立旅游顾问" value="3" key="3"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="门市类型 :" prop="storeType">
                <el-select v-model="ruleForm.storeType" placeholder="请选择" style="width: 250px;">
                  <el-option key="0" label="无" value="0"></el-option>
                  <el-option key="1" label="大运通自营" value="1"></el-option>
                  <el-option key="2" label="加盟门市" value="2"></el-option>
                  <el-option key="3" label="第三方门市" value="3"></el-option>
                </el-select>
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
                  @focus="dataPickerFocus()"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="公司logo :" prop="companyLogo" style="width:360px;">
                <el-upload
                  ref="uploadImg"
                  class="upload-demo"
                  action="http://test.dayuntong.com/upload/obs/api/picture/"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :file-list="fileList2"
                  :limit="1"
                  list-type="picture"
                  :on-error="handleError"
                  :on-success="handleSuccess"
                  name="files"
                  style="width: 220px;"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
                <div v-if=" this.imgnum == 2">
                  <img width="100%" height="12%" :src="ruleForm.imgUrl" />
                </div>
              </el-form-item>
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
                <el-form-item label="管理人员 :" prop="administrative">
                  <el-autocomplete
                    v-model="ruleForm.administrative"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入"
                    @focus="handleFocusAdminNames"
                    @select="handleSelectAdminNames"
                    @blur="handleBlurAdminNames"
                    :trigger-on-focus="false"
                    style="width: 250px"
                  >
                    <template slot-scope="{ item }">
                      <div class="name">{{ item.warn }}</div>
                      <div class="name">{{ item.name=item.value }}</div>
                    </template>
                  </el-autocomplete>
                  <div style="margin-top: 10px;">
                    <el-tag
                      :key="tag.id"
                      v-for="tag in adminArr"
                      class="tag"
                      closable
                      :disable-transitions="false"
                      @close="handleAdminClose(tag, adminArr)"
                      style="margin-botton: 5px;"
                    >{{tag.name}}</el-tag>
                  </div>
                </el-form-item>
                <el-form-item label="销售人员 :" prop="salesman">
                  <el-autocomplete
                    v-model="ruleForm.salesman"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入"
                    @focus="handleFocusSalesNames"
                    @select="handleSelectSalesNames"
                    @blur="handleBlurSalesNames"
                    :trigger-on-focus="false"
                    style="width: 250px;margin-bottom: 10px;"
                  >
                    <template slot-scope="{ item }">
                      <div class="name">{{ item.warn }}</div>
                      <div class="name">{{ item.name=item.value }}</div>
                    </template>
                  </el-autocomplete>
                  <div style="margin-top: 10px;">
                    <el-tag
                      :key="tag.id"
                      v-for="tag in salesArr"
                      class="tag"
                      closable
                      :disable-transitions="false"
                      @close="handleSalesClose(tag,salesArr)"
                      style="margin-botton: 5px;"
                    >{{tag.name}}</el-tag>
                  </div>
                </el-form-item>

                <!-- <el-form-item label="商户其他名称 " prop="otherNames" class="business">
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
                </el-form-item>-->

                <!-- <el-form-item label="商户其他名称" prop="otherNames">
                  <el-input class="name_input" v-model="ruleForm.otherNames"></el-input>
                </el-form-item>-->
              </div>
            </div>
          </el-form>
          <div class="rimInf">
            <h3>周边信息</h3>
            <label style="margin-right: 10px;">周边授信额度:</label>
            <el-input v-model.number="AbouQuota" placeholder="请输入"></el-input>
          </div>
          <!-- 账户信息 -->
          <div class="accountInfo">
            <h3>账户信息</h3>
            <el-button type="primary" @click="addAccount(1)">添加</el-button>
            <el-table :data="useList" border style="margin-top: 20px;">
              <el-table-column prop="name" label="名称" width="150" align="center"></el-table-column>
              <el-table-column prop="state" label="状态" width="80" align="center"></el-table-column>
              <el-table-column prop="phone" label="手机号" width="140" align="center"></el-table-column>
              <el-table-column prop="email" label="邮箱" width="170" align="center"></el-table-column>
              <el-table-column prop="sex" label="性别" width="50" align="center"></el-table-column>
              <el-table-column prop="wx" label="微信" width="140" align="center"></el-table-column>
              <el-table-column prop="qq" label="qq" width="140" align="center"></el-table-column>
              <el-table-column prop="peerUserType" label="职务" width="80" align="center"></el-table-column>
              <el-table-column prop="operation" label="操作" width="108" align="center">
                <template slot-scope="scope">
                  <div
                    style="color: #f5a142;float: left;margin-left: 14px"
                    @click="accountEdit(2,scope.$index,scope.row)"
                    v-if="btnindex === 2"
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
        <!-- 点击页面的详情出现的dialog是table -->
        <!-- 点击页面的详情出现的dialog是table -->
        <div class="dialogTable" v-if="btnindex == 1">
          <!-- 点击详情基本信息 -->
          <table>
            <tr>
              <td class="tr">ID：&nbsp;&nbsp;</td>
              <td class="longWeight">{{businewwInfPageId}}</td>
              <div class="BodyTableCenter">
                <td class="tr">状态：&nbsp;&nbsp;</td>
                <td class="longWeight">{{ruleForm.state}}</td>
              </div>
              <td class="tr">区域可见：&nbsp;&nbsp;</td>
              <td class="longWeight">{{ruleForm.orgs}}</td>
            </tr>
            <br />
            <tr>
              <td class="tr">商户名称：&nbsp;&nbsp;</td>
              <td class="longWeight">{{ruleForm.name}}</td>
              <div class="BodyTableCenter">
                <td class="tr">商户其他名称&nbsp;&nbsp;</td>
                <td class="longWeight">{{ruleForm.otherNames}}</td>
              </div>
              <td class="tr">商户编码：&nbsp;&nbsp;</td>
              <td class="longWeight">{{ruleForm.localCompCode}}</td>
            </tr>
            <br />
            <tr>
              <td class="tr">商户角色：&nbsp;&nbsp;</td>
              <td class="longWeight">{{ruleForm.localCompRole}}</td>
              <div class="BodyTableCenter">
                <td class="tr">类别：&nbsp;&nbsp;</td>
                <td class="longWeight">{{ruleForm.localCompType}}</td>
              </div>
              <td class="tr">结算方式：&nbsp;&nbsp;</td>
              <td class="longWeight">{{ruleForm.settlementType}}</td>
            </tr>
            <br />
            <tr>
              <td class="tr">门市类型：&nbsp;&nbsp;</td>
              <td class="longWeight">{{ruleForm.storeType}}</td>
              <div class="BodyTableCenter">
                <td class="tr">地址：&nbsp;&nbsp;</td>
                <td class="longWeight">{{ruleForm.address}}</td>
              </div>
              <td class="tr">联系人姓名：&nbsp;&nbsp;</td>
              <td class="longWeight">{{ruleForm.linker}}</td>
            </tr>
            <br />
            <tr>
              <td class="tr">联系人电话：&nbsp;&nbsp;</td>
              <td class="longWeight">{{ruleForm.phone}}</td>
              <div class="BodyTableCenter">
                <td class="tr">到期日期：&nbsp;&nbsp;</td>
                <td class="longWeight">{{ruleForm.expTime}}</td>
              </div>
              <td class="tr">管理人员：&nbsp;&nbsp;</td>
              <td class="longWeight">{{ruleForm.administrative}}</td>
            </tr>
            <br />
            <tr>
              <td class="tr">销售人员：&nbsp;&nbsp;</td>
              <td class="longWeight">{{ruleForm.salesman}}</td>

              <div class="BodyTableCenter">
                <td class="tr">对公户名：&nbsp;&nbsp;</td>
                <td class="longWeight">{{ruleForm.publicName}}</td>
              </div>
              <td class="tr">对公账号：&nbsp;&nbsp;</td>
              <td class="longWeight">{{ruleForm.bankcardNo}}</td>
            </tr>
            <br />
            <tr>
              <td class="tr">开户行：&nbsp;&nbsp;</td>
              <td class="longWeight">{{ruleForm.bankName}}</td>

              <div class="BodyTableCenter">
                <td class="tr">预存款：&nbsp;&nbsp;</td>
                <td class="longWeight">{{ruleForm.deposit}}</td>
              </div>
              <td class="tr">额度：&nbsp;&nbsp;</td>
              <td class="longWeight">{{AbouQuota}} <span v-if="ruleForm.quota !== 0">(剩余：{{toDecimal2(ruleForm.quota)}})</span></td>
            </tr>
            <br />
            <tr>
              <td class="tr">公司logo：&nbsp;&nbsp;</td>
              <td class="longWeight">
                <!-- {{ruleForm.imgUrl}} -->
                <img width="100%" height="12%" :src="ruleForm.imgUrl" />
              </td>
              <div class="BodyTableCenter">
                <td class="tr">经营范围：&nbsp;&nbsp;</td>
                <td class="longWeight">{{ruleForm.scopeExt}}</td>
              </div>
            </tr>
          </table>
          <!-- 点击详情账户信息 -->
          <div class="accountInfo">
            <h3>账户信息</h3>
            <el-button type="primary" v-if="btnindex !== 1">添加</el-button>
            <el-table :data="useList" border style="width: 100%;margin-top: 20px;">
              <el-table-column prop="name" label="名称" width="158" align="center"></el-table-column>
              <el-table-column prop="state" label="状态" width="120" align="center"></el-table-column>
              <el-table-column prop="phone" label="手机号" width="130" align="center"></el-table-column>
              <el-table-column prop="email" label="邮箱" width="170" align="center"></el-table-column>
              <el-table-column prop="sex" label="性别" width="80" align="center"></el-table-column>
              <el-table-column prop="wx" label="微信" width="140" align="center"></el-table-column>
              <el-table-column prop="qq" label="qq" width="140" align="center"></el-table-column>
              <el-table-column prop="peerUserType" label="职务" width="120" align="center"></el-table-column>
            </el-table>
          </div>
          <!-- 周边信息 -->
          <div class="rimInfDetails">
            <h3>周边信息</h3>
            <div>
              <table style="width: 100%;">
                <tr class="dialogTableTr">
                  <td class="dialogTableTd">
                    <label>周边授信额度：</label>
                    <span>{{AbouQuota}}</span>
                  </td>
                  <td class="dialogTableTd">
                    <label>周边剩余授信额度：</label>
                    <span>{{AbouBalance}}</span>
                  </td>
                  <!-- <td class="dialogTableTd">
                    <label>周边预存款：</label>
                    <span>{{AbouDeposit}}</span>
                  </td>-->
                </tr>
              </table>
            </div>
          </div>
          <!-- 点击详情欠款信息 -->
          <div class="relevanceDept">
            <h3>关联欠款</h3>
            <div class="relevanceDeptWarn">
              <p class="el-icon-warning">
                已关联
                <span style="color:#108ee9">{{page_order_total}}</span> 项 &nbsp;&nbsp;&nbsp; 总计：
                <span style="font-size: 16px;">{{arrears}}元</span>
              </p>
            </div>
            <el-table :data="tableRelevanceDeptInfo" border style="width: 100%;margin-top: 20px;">
              <el-table-column prop="OrderCode" label="订单编号" width="120" align="center"></el-table-column>
              <el-table-column prop="Title" label="产品名称" width="120" align="center"></el-table-column>
              <el-table-column prop="GroupCode" label="团期计划" width="120" align="center"></el-table-column>
              <el-table-column prop="CF_Date" label="出团日期" width="120" align="center"></el-table-column>
              <el-table-column prop="Payable" label="订单金额" width="80" align="center"></el-table-column>
              <el-table-column prop="qk_price" label="欠款金额" width="120" align="center"></el-table-column>
              <el-table-column prop="yh_price" label="已还金额" width="120" align="center"></el-table-column>
              <el-table-column prop="CreateTime" label="欠款日期" width="120" align="center"></el-table-column>
              <el-table-column prop="RepaymentDate" label="应还日期" align="center"></el-table-column>
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
        <el-form-item label="密码" prop="passWord">
          <el-input
            v-model="accountForm.passWord"
            placeholder="请输入"
            style="width：250px;"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="职务" prop="peerUserType" style="margin-bottom: 68px;">
          <el-radio-group v-model="accountForm.peerUserType">
            <el-radio :label="1">管理员</el-radio>
            <el-radio :label="2">销售</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="addAccountBtn fr" v-if="isAddAccountBtn !== 2">
          <el-button @click="addAccountCancelBtn('accountForm')">取消</el-button>
          <el-button type="primary" @click="addAccountAddBtn('accountForm')">添加账户</el-button>
        </el-form-item>
        <el-form-item class="addAccountBtn fr" v-if="isAddAccountBtn == 2">
          <el-button @click="addAccountEditCancel">取消</el-button>
          <el-button type="primary" @click="editAccountAddBtn('accountForm')">更改账户</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="选择人员"
      :visible.sync="isChooseAccount"
      :show-close="false"
      class="addAccount"
      :close-on-click-modal="false"
      width="500px"
    >
      <childAccount></childAccount>
    </el-dialog>
    <!--end-->
  </div>
</template>

<script>
import state from "../../../store/state";
import childAccount from "./comps/chooseAccount";
import moment from "moment";

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
    //商户编码唯一性验证
    let localCompCode = (rule, value, callback) => {
      if (this.btnindex !== 2) {
        if (this.ruleForm.localCompCode == "") {
          return callback("请输入商户编码");
        } else {
          this.$http
            .post(
              this.GLOBAL.serverSrc + "/universal/localcomp/api/isexistcode",
              {
                localCompCode: this.ruleForm.localCompCode
              }
            )
            .then(res => {
              if (res.status == 200 && res.data.isSuccess == false) {
                return callback("已存在该编码的商户");
              } else {
                return callback();
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      } else {
        return callback();
      }
    };
    // 商户名称唯一性验证
    let nameValidator = (rule, value, callback) => {
      if (this.btnindex !== 2) {
        if (this.ruleForm.name == "") {
          return callback("请输入名字");
        } else {
          if (this.ruleForm.name.length > 40) {
            return callback("不要超过40个字符");
          } else {
            this.$http
              .post(
                this.GLOBAL.serverSrc + "/universal/localcomp/api/isexistalias",
                {
                  name: this.ruleForm.name
                }
              )
              .then(res => {
                if (res.status == 200 && res.data.isSuccess == false) {
                  return callback("已存在该名称的商户");
                } else {
                  return callback();
                }
              })
              .catch(err => {
                console.log(err);
              });
          }
        }
      } else {
        return callback();
      }
    };
    //商户其他名称验证唯一性
    let otherNamesValidator = (rule, value, callback) => {
      if (this.ruleForm.otherNames) {
        if (this.ruleForm.otherNames.length > 40) {
          return callback("不要超过40个字符");
        } else {
          this.$http
            .post(
              this.GLOBAL.serverSrc + "/universal/localcomp/api/isexistalias",
              {
                name: this.ruleForm.otherNames
              }
            )
            .then(res => {
              res.data.isSuccess == false
                ? (this.isOtherSuccess = false)
                : (this.isOtherSuccess = true);
              if (res.status == 200 && res.data.isSuccess == false) {
                this.isOtherSuccess = false;
                return callback("已存在该名称的商户");
              } else {
                return callback();
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      } else {
        return callback();
      }
    };
    // let that = this;
    return {
      otherNamesObj: {}, //添加商户其他名称enter接收
      // isBusinessTrue: false, //添加商户其他名称是判断issuccess false则此名字已存在
      // orgsAddArr: [], //添加商户信息是存储区域可见的数组
      AbouArrears: null, //周边欠款
      AbouBalance: null, //周边剩余授信额度
      AbouDeposit: null, //周边预存款
      arrears: null, //关联欠款总计多少
      page_order_total: null, //关联数量 不准确到时和后台确认参数名
      AbouQuota: null, //周边授信额度
      // editAdmin: [], //点击编辑页的admin 用来接收修改之前的
      businewwInfPageId: "", //商户信息详情页的ID 同时也是商户其他名称添加接口的localCompID
      vague: [], //模糊搜索的数组
      // cascaderArr: [],
      isAddAccountBtn: 0, //判断账户信息弹窗是从添加按钮进入还是编辑进入
      accountArr: [], //用来接收本地添加账户的字段
      tableRelevanceDeptInfo: [], //点击详情欠款信息
      isAddAccount: false, // 判断添加账户弹窗的出现
      scoperangeList: [], //区域可见接口接收
      businessOtherNamesArr: [], //商户其他名称tag列表
      adminArr: [], //管理人员tag列表
      salesArr: [], //销售人员tag列表
      fileList: [], //上传图片
      imgnum: 1, //图片位置显示
      btnindex: 0, //编辑还是详情判断弹窗按钮的字段
      readonly: true, // 点击表单修改然后只读
      statesValue: "", //搜索状态字段
      payValue: "", //搜过结算字段
      isInputVisible: false, //商户其他名称tags显示隐藏
      isOtherSuccess: true, //商户其他名称唯一性判断  false则有重复的 则不能添加到businessOtherNamesArr
      isAccountValidator: null, //账户信息添加时验证唯一性 后台返回false则重复
      isChooseAccount: false, //选择人员的dialog tree是否显示
      isHavePhoneOrEmail: null, //tid为0的时候（大保存）添加账户信息手机号和邮箱的判断
      tid: 0, //tid为0新大保存的添加 不为0则是编辑页的添加账户信息（目前我的理解）
      pageSize: 10, //每页条数 默认10
      pageIndex: 1, //每页
      total: 1, //总条数
      currentPage4: 1, //当前页数
      // editAccouontScopeid: null, //账户信息修改时需要的scopeid
      accountForm: {
        name: "", //账户信息名字
        phone: "", //手机号
        email: "", //邮箱
        sex: "", //性别
        wx: "", //微信号
        qq: "", //qq号
        state: null, //状态 2正常 3 停用
        passWord: "", //密码
        peerUserType: null //职位  1管理员 2销售
        //id:"",
      }, //添加账户信息的对象
      // 添加账号信息的验证
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
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
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
        state: [{ required: true, message: "请选择状态", trigger: "change" }],
        passWord: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 30, message: "请输入6-30位密码", trigger: "blur" }
        ],
        peerUserType: [
          { required: true, message: "请选择职务", trigger: "change" }
        ]
      },
      ruleForm: {
        name: "", //
        storeType: "", //门市类型默认是无
        localCompType: "", //类别
        state: null, //状态默认是正常
        expTime: "", //到期时间
        settlementType: null, //结算方式
        quota: "", //额度
        //department: "",
        // people: "",
        scopeExt: [], //经营范围
        orgs: [], //区域可见
        address: "", //地址
        linker: "", //联系人姓名
        phone: "", //联系人电话
        publicName: "", //对公户名
        bankName: "", //开户行
        bankcardNo: "", //对公账号
        localCompRole: "", //商户角色
        salesman: "", //销售人员
        administrative: "", //管理人员
        otherNames: "", //商户其他名字
        localCompCode: "", //商户编码
        ImgUrl: "" //logo
      },
      rules: {
        expTime: [{ required: true, message: "请选择日期", trigger: "change" }],
        name: [
          // { required: true, message: "请输入名称", trigger: "blur" },
          // { max: 40, message: "不要超过40个字符", trigger: "blur" }
          { validator: nameValidator, trigger: "blur" }
        ],
        localCompType: [
          { required: true, message: "请选择类型", trigger: "change" }
        ],
        state: [{ required: true, message: "请选择状态", trigger: "change" }],
        settlementType: [
          { required: true, message: "请选择结算方式", trigger: "change" }
        ],
        localCompRole: [
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
        // department: [
        //   { required: true, message: "请选择类型", trigger: "change" }
        // ],
        // people: [{ required: true, message: "请选择类型", trigger: "change" }],
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
          { max: 80, message: "不要超过80个字符", trigger: "blur" }
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
        otherNames: [{ validator: otherNamesValidator, trigger: "change" }],
        localCompCode: [
          {
            required: true,
            max: 10,
            trigger: "blur",
            validator: localCompCode
          }
          // { pattern: /(^[\-0-9][0-9]*(.[0-9]+)?)$/, message: "请输入数字" }
        ]
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
  components: {
    childAccount: childAccount
  },
  methods: {
    moment,
    // 点击添加商户其他名称事件
    showInput() {
      this.isInputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 时间格式转换
    dataPickerFocus() {
      if (this.btnindex == 2) {
        if (this.ruleForm.expTime.toString().length !== 8) {
          this.ruleForm.expTime = "";
        } else {
          this.ruleForm.expTime = moment(this.ruleForm.expTime).format(
            "YYYYMMDD"
          );
        }
      }
    },
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
    // 商户其他名称添加请求
    adminOtherAxios() {
      this.$http
        .post(
          this.GLOBAL.serverSrc +
            "/universal/localcomp/api/localcompaliasinsert",
          {
            object: {
              name: this.ruleForm.otherNames,
              localCompID: this.businewwInfPageId
            }
          }
        )
        .then(obj => {
          if (obj.data.isSuccess == true) {
            this.businessOtherNamesArr.push(this.otherNamesObj);
          } else {
            this.$message.error("该商户其他名称已存在");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 商户其他名字enter触发的事件
    handleEnterOtherNames() {
      // console.log(this.isOtherSuccess);
      let obj = {};
      let istrue = true;
      obj.name = this.ruleForm.otherNames;
      this.businessOtherNamesArr.some(item => {
        if (item.name == obj.name) {
          this.$message.error("该商户名称以重复");
          istrue = false;
          return istrue;
        }
      });
      if (
        this.ruleForm.otherNames &&
        this.isOtherSuccess == true &&
        istrue == true
      ) {
        this.businessOtherNamesArr.push(obj);
        this.isInputVisible = false;
        this.ruleForm.otherNames = "";
      }

      //   this.otherNamesObj = {};
      //   this.otherNamesObj["name"] = this.ruleForm.otherNames;
      //   if (
      //     this.otherNamesObj.name !== undefined &&
      //     this.otherNamesObj.name !== ""
      //   ) {
      //     if (this.businessOtherNamesArr.length == 0) {
      //       this.adminOtherAxios();
      //       // console.log(this.isBusinessTrue);
      //       // if (this.isBusinessTrue == true) {
      //       //   this.businessOtherNamesArr.push(otherNamesObj);
      //       // } else {
      //       //   this.$message.error("该商户其他名称已存在");
      //       // }
      //     } else {
      //       if (
      //         JSON.stringify(this.businessOtherNamesArr).indexOf(
      //           JSON.stringify(this.otherNamesObj)
      //         ) == -1
      //       ) {
      //         this.adminOtherAxios();
      //         // console.log(this.isBusinessTrue);
      //         // if (this.isBusinessTrue == true) {
      //         //   this.businessOtherNamesArr.push(otherNamesObj);
      //         // } else {
      //         //   this.$message.error("该商户其他名称已存在");
      //         // }
      //       } else {
      //         this.$message.error("该商户其他名称已存在2");
      //       }
      //     }
      //   }
      //   this.ruleForm.otherNames = "";
    },
    // 商户其他人员tag删除
    businessHandleClose(tag) {
      this.businessOtherNamesArr.splice(
        this.businessOtherNamesArr.indexOf(tag),
        1
      );
      // this.$http
      //   .post(
      //     this.GLOBAL.serverSrc +
      //       "/universal/localcomp/api/localcompaliasdelete",
      //     {
      //       id: tag.id
      //     }
      //   )
      //   .then(obj => {
      //     this.getOneMess(this.tid);
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
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
      this.adminArr.push(item);
      this.handleBlurAdminNames();
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
        arr.push(this.adminArr[i].name);
      }
      this.ruleForm.administrative = arr.join(",");
    },
    // 销售人员blur触发的事件
    handleBlurSalesNames() {
      let arr = [];
      for (let i = 0; i < this.salesArr.length; i++) {
        this.salesArr[i].isDeleted = 0;
        this.salesArr[i].jqUserType = 2;
        arr.push(this.salesArr[i].name);
      }
      this.ruleForm.salesman = arr.join(",");
    },
    // 管理 tag 删除
    handleAdminClose(tag, arr) {
      arr.forEach((v, k, arr) => {
        if (arr[k].name == tag.name) {
          arr.splice(k, 1);
        }
      });
      this.adminArr = arr;
      this.handleBlurAdminNames();
    },
    // 销售 tag 删除
    handleSalesClose(tag, arr) {
      arr.forEach((v, k, arr) => {
        if (arr[k].name == tag.name) {
          arr.splice(k, 1);
        }
      });
      this.salesArr = arr;
      this.handleBlurSalesNames();
    },

    // 删除账户信息按钮
    accountDelete(index, row) {
      this.useList.splice(index, 1);
    },
    //编辑账户信息按钮
    accountEdit(idx, index, row) {
      if (row.peerUserType == "销售") {
        row.peerUserType = 2;
      } else {
        row.peerUserType = 1;
      }
      // this.editAccouontScopeid = index;
      this.isAddAccount = true;
      this.accountForm = Object.assign({}, row);
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
        passWord: "",
        peerUserType: [] //职位
        //id:"",
      };
      this.$refs[accountForm].resetFields();
      this.isAddAccount = false;
      this.isAddAccountBtn = 0;
    },
    // 点击添加按钮的大保存时 账户信息添加 tid为0时的
    bigSaveAccount() {
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
      if (this.accountForm.peerUserType == 1) {
        this.accountForm.peerUserType = "管理员";
      } else {
        this.accountForm.peerUserType = "销售";
      }
      // console.log(this.accountForm)
      this.useList.push(this.accountForm);
      // console.log(this.useList,"this.userlist")
      this.isAddAccount = false;
      this.$message({
        message: "添加成功",
        type: "success"
      });
    },

    //添加账户信息弹窗的添加账户按钮事件
    addAccountAddBtn(accountForm) {
      // debugger
      // isAddAccountBtn == 1 是第一次添加保存到本地
      // isAddAccountBtn == 2 是此时没有删除按钮 只可编辑 掉接口
      // 现在判断的依据是tid为0则是大保存的添加 不是则是编辑进入的添加
      // if (this.isAddAccountBtn == 1) {
      if (this.tid === 0) {
        this.$refs[accountForm].validate(valid => {
          if (valid) {
            this.accountForm.createTime = new Date().getTime();
            this.bigSaveAccountValidator().then(obj => {
              if (obj == true) {
                let istype;
                // 长度为0时直接走后台接口验证，大于0本地验证
                if (this.useList.length > 0) {
                  // 邮箱为空只验证手机号，不为空则手机号和邮箱验证
                  let [phone, email] = [false, false];
                  if (this.accountForm.email == "") {
                    this.useList.some(item => {
                      phone = item.phone == this.accountForm.phone;
                      return (this.isHavePhoneOrEmail =
                        item.phone == this.accountForm.phone);
                    });
                  } else {
                    this.useList.some(item => {
                      phone = item.phone == this.accountForm.phone;
                      email = item.email == this.accountForm.email;
                      return (this.isHavePhoneOrEmail =
                        item.phone == this.accountForm.phone ||
                        item.email == this.accountForm.email);
                    });
                  }
                  if (this.isHavePhoneOrEmail) {
                    if (phone) {
                      this.$message.error("该手机号已注册过");
                    } else if (email) {
                      this.$message.error("该邮箱已注册过");
                    } else if (phone && email) {
                      this.$message.error("该手机号或邮箱已注册过");
                    }
                  } else {
                    this.bigSaveAccount();
                  }
                } else {
                  console.log("此时第一条");
                  this.bigSaveAccount();
                }
              }
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else {
        this.$refs[accountForm].validate(valid => {
          if (valid) {
            this.accountForm.createTime = new Date().getTime();
            this.accountValidator().then(obj => {
              this.accountForm.localCompID = this.tid;
              if (obj == true) {
                this.useList.push(this.accountForm);
                if (this.accountForm.state == "正常") {
                  this.accountForm.state = 2;
                } else {
                  this.accountForm.state = 3;
                }
                if (this.accountForm.sex == "男") {
                  this.accountForm.sex = 1;
                } else {
                  this.accountForm.sex = 2;
                }
                if (this.accountForm.peerUserType == "管理员") {
                  this.accountForm.peerUserType = 1;
                } else {
                  this.accountForm.peerUserType = 2;
                }
                this.$http
                  .post(
                    this.GLOBAL.serverSrc +
                      "/universal/localcomp/api/PeerUserinsert",
                    {
                      object: this.accountForm
                    }
                  )
                  .then(obj => {
                    this.isAddAccount = false;
                    this.getOneMess(this.tid);
                  })
                  .catch(err => {
                    this.isAddAccount = false;
                    console.log(err);
                  });
              }
            });
            // // 修改验证手机号和邮箱的接口的接口
            // this.$http
            //   .post(
            //     this.GLOBAL.serverSrc +
            //       "/universal/localcomp/api/isexistpeeruser",
            //     {
            //       phone: this.accountForm.phone,
            //       email: this.accountForm.email,
            //       id: 0
            //     }
            //   )
            //   .then(obj => {
            //     const { isSuccess } = obj.data;
            //     if (isSuccess == false) {
            //       this.$message.error("该手机号，邮箱已注册过");
            //     } else {
            //       // 修改的接口
            //       this.$http
            //         .post(
            //           this.GLOBAL.serverSrc +
            //             "/universal/localcomp/api/PeerUserUpdate",
            //           {
            //             object: this.accountForm
            //           }
            //         )
            //         .then(obj => {
            //           this.isAddAccount = false;
            //           this.getOneMess(this.tid);
            //         })
            //         .catch(err => {
            //           this.isAddAccount = false;
            //           console.log(err);
            //         });
            //     }
            //   })
            //   .catch(err => {
            //     console.log(err);
            //   });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    // 修改验证手机号和邮箱的接口的接口
    accountValidator() {
      console.log(this.accountForm.id,"this.accountForm.id")
      return this.$http
        .post(
          this.GLOBAL.serverSrc + "/universal/localcomp/api/isexistpeeruser",
          {
            phone: this.accountForm.phone,
            email: this.accountForm.email,
            id: this.accountForm.id
          }
        )
        .then(obj => {
          const { isSuccess } = obj.data;
          if (isSuccess == false) {
            this.$message.error(obj.data.result.message);
          }
          // this.isAccountValidator = isSuccess;
          return isSuccess;
        })
        .catch(err => {
          console.log(err);
          return "";
        });
    },
    // 大保存的时候验证手机号和邮箱的接口的接口 此时没有id走这个验证接口
    bigSaveAccountValidator() {
      return this.$http
        .post(
          this.GLOBAL.serverSrc + "/universal/localcomp/api/isexistpeeruserno",
          {
            phone: this.accountForm.phone,
            email: this.accountForm.email
          }
        )
        .then(obj => {
          const { isSuccess } = obj.data;
          if (isSuccess == false) {
            this.$message.error(obj.data.result.message);
          }
          // this.isAccountValidator = isSuccess;
          return isSuccess;
        })
        .catch(err => {
          console.log(err);
          return "";
        });
    },
    // 更改账户
    editAccountAddBtn() {
      // this.accountForm.id = this.editAccouontScopeid;
      this.accountForm.localCompID = this.tid;
      if (this.accountForm.state == "正常") {
        this.accountForm.state = 2;
      } else {
        this.accountForm.state = 3;
      }
      if (this.accountForm.sex == "男") {
        this.accountForm.sex = 1;
      } else {
        this.accountForm.sex = 2;
      }
      if (this.accountForm.peerUserType == "管理员") {
        this.accountForm.peerUserType = 1;
      } else {
        this.accountForm.peerUserType = 2;
      }
      this.accountValidator().then(res => {
        if (res === true) {
          this.$http
            .post(
              this.GLOBAL.serverSrc + "/universal/localcomp/api/PeerUserUpdate",
              {
                object: this.accountForm
              }
            )
            .then(obj => {
              if (obj.data.isSuccess == true) {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.isAddAccount = false;
                this.getOneMess(this.tid);
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          if (this.accountForm.peerUserType == 1) {
            this.accountForm.peerUserType = "管理员";
          } else {
            this.accountForm.peerUserType = "销售";
          }
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
        }
      });
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
        state: null,
        passWord: "",
        peerUserType: null //职位
        //id:"",
      };
      // if (this.$refs[this.addForm] !== undefined) {
      //   console.log(1)
      //   this.$refs[this.addForm].resetFields();
      // }
      // this.$nextTick((accountForm) => {
      //   console.log(1)
      //   this.$refs[this.addForm].resetFields();
      // });
    },

    // handlePreview(file) {
    // console.log(file);
    // },
    // handleRemove(file, fileList) {
    // console.log(file, fileList);
    // },

    // dialog关闭的回调
    closeDialog() {
      this.btnindex = 0;
    },
    // 重置
    handleReset() {
      this.pageIndex = 1;
      this.input = "";
      this.statesValue = "";
      this.payValue = "";
      // this.list();
      this.pageList(1, this.pageSize);
      this.currentPage4 = 1;
    },
    // pageSize 改变时会触发
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageList(1, val);
    },
    // currentPage 改变时会触发
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.pageList(val, this.pageSize);
    },
    // 搜索
    handleSearch() {
      this.pageIndex = 1;
      this.pageList(1, this.pageSize);
      this.currentPage4 = 1;
    },
    //查询列表
    pageList(
      pageIndex = this.pageIndex,
      pageSize = this.pageSize,
      input = this.input,
      statesValue = this.statesValue,
      settlementType = this.payValue
    ) {
      let object = {};
      input !== "" ? (object.name = input) : "",
        statesValue !== "" ? (object.state = statesValue) : statesValue,
        settlementType !== ""
          ? (object.settlementType = settlementType)
          : settlementType;
      // 1月结 2非月结
      // 2正常 3停用
      // jqUserType 1 管理员  2 销售
      this.$http
        .post(this.GLOBAL.serverSrc + "/universal/localcomp/api/page", {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          object: object
        })
        .then(obj => {
          this.total = obj.data.total;
          this.tableData = obj.data.objects;
          this.tableData.forEach(function(v, k, arr) {
            //arr[k]["department"] = "XXX";
            arr[k]["manager"] = "阳阳";
            if (arr[k]["state"] == 2) {
              arr[k]["state"] = "正常";
            } else {
              arr[k]["state"] = "停用";
            }
            if (arr[k]["localCompType"] == 1) {
              arr[k]["localCompType"] = "门店";
            } else if (arr[k]["localCompType"] == 2) {
              arr[k]["localCompType"] = "同业";
            } else if (arr[k]["localCompType"] == 3) {
              arr[k]["localCompType"] = "翻盘门店";
            } else if (arr[k]["localCompType"] == 4) {
              arr[k]["localCompType"] = "个体分销";
            }
            if (arr[k]["settlementType"] == 2) {
              arr[k]["settlementType"] = "非月结";
            } else {
              arr[k]["settlementType"] = "月结";
            }
          });
        })
        .catch(obj => {
          console.log(obj);
        });
    },
    // 添加按钮 新增商户信息的
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
    // 编辑和详情  详情为1 编辑为2
    edit_info(index, row) {
      // this.businessOtherNamesArr = [];
      index === 1 ? (this.readonly = true) : (this.readonly = false);
      this.btnindex = index;
      this.tid = row;
      this.getOneMess(this.tid);
      this.dialogFormVisible = true;
    },
    // 关联欠款表格的接口
    getDebitTable() {
      this.$http
        .post(this.GLOBAL.serverSrc + "/universal/localcomp/api/page_order", {
          pageIndex: this.pageIndex,
          pageSize: this.pagesize,
          // total: 1, //总条数
          object: {
            // isDeleted: 0 //是否删除
            orgID: this.businewwInfPageId
          }
        })
        .then(obj => {
          this.tableRelevanceDeptInfo = obj.data.objects;
          this.page_order_total = obj.data.total;
        })
        .catch(err => {
          console.log(err);
        });
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
    // 重置
    resetForm(ruleForm) {
      //this.$refs[formName].resetFields();
      this.ruleForm = {
        name: "", //
        storeType: "无", //门市类型默认是无
        localCompType: "",
        state: "正常", //状态默认是正常
        expTime: "",
        settlementType: "非月结", //结算方式
        quota: "",
        // department: "",
        // people: "",
        scopeExt: [], //经营范围
        orgs: [], //区域可见
        address: "",
        linker: "",
        phone: "",
        publicName: "",
        bankName: "",
        bankcardNo: "",
        localCompRole: "", //商户角色
        salesman: "", //销售人员
        administrative: "" //管理人员
      };
      if (this.btnindex !== 1) this.$refs["ruleForm"].resetFields();
      this.dialogFormVisible = false;
      this.btnindex = 0;
      this.adminArr = [];
      this.salesArr = [];
      this.businessOtherNamesArr = [];
      // this.$refs.uploadImg.clearFiles(); // 上传图片隐藏 要不报错先影藏
      // this.orgsAddArr = []
    },
    // 修改
    editorForm(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          this.editMerchan(ruleForm);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //列表
    list() {
      var that = this;
      this.$http
        .post(this.GLOBAL.serverSrc + "/universal/localcomp/api/page", {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          // total: 1, //总条数
          object: {
            // isDeleted: 0 //是否删除
          }
        })
        .then(function(obj) {
          that.total = obj.data.total;
          that.tableData = obj.data.objects;
          that.tableData.forEach(function(v, k, arr) {
            //arr[k]["department"] = "XXX";
            arr[k]["manager"] = "阳阳";
            if (arr[k]["state"] == 2) {
              arr[k]["state"] = "正常";
            } else {
              arr[k]["state"] = "停用";
            }
            if (arr[k]["localCompType"] == 1) {
              arr[k]["localCompType"] = "门店";
            } else if (arr[k]["localCompType"] == 2) {
              arr[k]["localCompType"] = "同业";
            } else if (arr[k]["localCompType"] == 3) {
              arr[k]["localCompType"] = "翻盘门店";
            } else if (arr[k]["localCompType"] == 4) {
              arr[k]["localCompType"] = "个体分销";
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
      // if (
      //   this.tableData.filter(v => this.ruleForm.otherNames == v.name).length !=
      //   0
      // ) {
      //   this.$message.error("添加失败,该商户其他名称已存在");
      //   this.dialogFormVisible = true;
      //   return;
      // }

      // 商户角色
      //console.log("商户角色",this.ruleForm.localCompRole)
      // if ((this.ruleForm.localCompRole = "旅游组团社")) {
      //   this.ruleForm.localCompRole = 1;
      // } else if ((this.ruleForm.localCompRole = "独立旅行社")) {
      //   this.ruleForm.localCompRole = 2;
      // } else {
      //   this.ruleForm.localCompRole = 3;
      // }
      // 类别
      // console.log("类别",this.ruleForm.localCompType)
      // if ((this.ruleForm.localCompType = "门店")) {
      //   this.ruleForm.localCompType = 1;
      // } else if ((this.ruleForm.localCompType = "同业")) {
      //   this.ruleForm.localCompType = 2;
      // } else if ((this.ruleForm.localCompType = "翻牌门店")) {
      //   this.ruleForm.localCompType = 3;
      // }else if ((this.ruleForm.localCompType = "个体分销")) {
      //   this.ruleForm.localCompType = 4;
      // }

      // 判断商户名称是否是具有唯一性
      // if (
      //   this.tableData.filter(v => this.ruleForm.name == v.name).length != 0
      // ) {
      //   this.$message.error("添加失败,该商户名称已存在");
      //   this.dialogFormVisible = true;
      //   return;
      // }

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

      if (this.ruleForm.settlementType == 2) {
        this.ruleForm.quota = 0;
      }
      //console.log("门市类型",this.ruleForm.storeType)
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
      // 添加账户

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

      // useList
      this.useList.forEach((val, idx, arr) => {
        if (arr[idx].peerUserType == "管理员") {
          arr[idx].peerUserType = 1;
        } else {
          arr[idx].peerUserType = 2;
        }
        if (arr[idx].sex == "男") {
          arr[idx].sex = 1;
        } else {
          arr[idx].sex = 2;
        }
        if (arr[idx].state == "正常") {
          arr[idx].state = 2;
        } else {
          arr[idx].state = 3;
        }
      });
      // console.log(this.useList, "上传的账号信息");
      // 周边授信额度
      if (this.AbouQuota == null) {
        this.AbouQuota = 0;
      }
      if (this.ruleForm.quota == "") {
        this.ruleForm.quota = 0;
      }

      this.$http
        .post(this.GLOBAL.serverSrc + "/universal/localcomp/api/insert", {
          object: {
            isDeleted: 0,
            code: null,
            name: this.ruleForm.name,
            localCompType: this.ruleForm.localCompType,
            //localCompType: 1,
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
            //localCompRole: 1,
            storeType: this.ruleForm.storeType,
            orgs: this.ruleForm.orgs,
            useList: this.useList,
            jqAdminList: adminAndSalesArr,
            localCompAliasList: this.businessOtherNamesArr, //商户其他名称
            abouQuota: this.AbouQuota, //周边授信额度
            localCompCode: this.ruleForm.localCompCode, //商户编码
            localCompAliasList: this.businessOtherNamesArr
          }
        })
        .then(obj => {
          if (obj.data.isSuccess == true) {
            this.dialogFormVisible = false;
            // console.log("添加成功",obj);
            // this.pageSize = this.pageSize;
            this.pageIndex = 1;
            this.currentPage4 = 1;
            this.list();
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.$refs.uploadImg.clearFiles(); // 上传图片隐藏
          } else {
            this.$message({
              message: "添加失败",
              type: "error"
            });
            this.$refs.uploadImg.clearFiles(); // 上传图片隐藏
          }
        })
        .catch(obj => {
          this.$message({
            message: "添加失败",
            type: "error"
          });
          this.$refs.uploadImg.clearFiles(); // 上传图片隐藏
        });
    },
    //修改
    editMerchan(ruleForm) {
      //判断商户其他名称是否具有唯一性 并且输个个数不可超过五十个
      if (this.businessOtherNamesArr.length !== 0) {
        if (this.businessOtherNamesArr.length > 50) {
          this.$message.error("商户其他名称不可超过50个");
          this.dialogFormVisible = true;
          return;
        }
      }

      // 门市类型
      if (this.ruleForm.storeType == "无") {
        this.ruleForm.storeType = 0;
      } else if (
        this.ruleForm.storeType == "大运通自营" ||
        this.ruleForm.storeType == 1
      ) {
        this.ruleForm.storeType = 1;
      } else if (
        this.ruleForm.storeType == "加盟门市" ||
        this.ruleForm.storeType == 2
      ) {
        // console.log(6);
        this.ruleForm.storeType = 2;
      } else if (
        this.ruleForm.storeType == "第三方门市" ||
        this.ruleForm.storeType == 3
      ) {
        this.ruleForm.storeType = 3;
      }
      // 商户角色
      if (
        this.ruleForm.localCompRole == "旅游组团社" ||
        this.ruleForm.localCompRole == 1
      ) {
        this.ruleForm.localCompRole = 1;
      } else if (
        this.ruleForm.localCompRole == "独立旅行社" ||
        this.ruleForm.localCompRole == 2
      ) {
        this.ruleForm.localCompRole = 2;
      } else if (
        this.ruleForm.localCompRole == "个人/独立旅游顾问" ||
        this.ruleForm.localCompRole == 3
      ) {
        this.ruleForm.localCompRole = 3;
      }
      //类别
      if (
        this.ruleForm.localCompType == "门店" ||
        this.ruleForm.localCompType == 1
      ) {
        this.ruleForm.localCompType = 1;
      } else if (
        this.ruleForm.localCompType == "同业" ||
        this.ruleForm.localCompType == 2
      ) {
        this.ruleForm.localCompType = 2;
      } else if (
        this.ruleForm.localCompType == "翻盘门店" ||
        this.ruleForm.localCompType == 3
      ) {
        this.ruleForm.localCompType = 3;
      } else if (
        this.ruleForm.localCompType == "个体分销" ||
        this.ruleForm.localCompType == 4
      ) {
        this.ruleForm.localCompType = 4;
      }
      // 状态
      if (this.ruleForm.state == "停用" || this.ruleForm.state == 3) {
        this.ruleForm.state = 3;
      } else if (this.ruleForm.state == "正常" || this.ruleForm.state == 2) {
        this.ruleForm.state = 2;
      }
      //结算方式
      if (
        this.ruleForm.settlementType == "非月结" ||
        this.ruleForm.settlementType == 2
      ) {
        this.ruleForm.settlementType = 2;
        this.ruleForm.quota = 0;
      } else if (
        this.ruleForm.settlementType == "月结" ||
        this.ruleForm.settlementType == 1
      ) {
        this.ruleForm.settlementType = 1;
      }

      // 经营范围
      let scopeExt = this.ruleForm.scopeExt.join(",");

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
      // 添加账户
      // jqAdminList 管理和销售人员
      let adminAndSalesArr = [...this.adminArr, ...this.salesArr];
      adminAndSalesArr = adminAndSalesArr.map(item => {
        return {
          name: item.name,
          userCode: item.userCode,
          uid: item.uid,
          jqUserType: item.jqUserType,
          isDeleted: item.isDeleted
        };
      });

      // useList
      this.useList.forEach((val, idx, arr) => {
        if (arr[idx].peerUserType == "管理员") {
          arr[idx].peerUserType = 1;
        } else {
          arr[idx].peerUserType = 2;
        }
        if (arr[idx].sex == "男") {
          arr[idx].sex = 1;
        } else {
          arr[idx].sex = 2;
        }
        if (arr[idx].state == "正常") {
          arr[idx].state = 2;
        } else {
          arr[idx].state = 3;
        }
      });

      this.ruleForm.expTime = moment(this.ruleForm.expTime).format("YYYYMMDD");
      this.ruleForm.id = this.tid;
      this.$http
        .post(this.GLOBAL.serverSrc + "/universal/localcomp/api/save", {
          object: {
            id: this.ruleForm.id,
            isDeleted: 0,
            code: null,
            name: this.ruleForm.name,
            localCompType: this.ruleForm.localCompType,
            //localCompType: 1,
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
            //localCompRole: 1,
            storeType: this.ruleForm.storeType,
            orgs: this.ruleForm.orgs,
            jqAdminList: adminAndSalesArr,
            localCompAliasList: this.businessOtherNamesArr,
            abouQuota: this.AbouQuota, //周边授信额度
            localCompCode: this.localCompCode,
            useList: this.useList
          }
        })
        .then(obj => {
          if (obj.data.isSuccess == true) {
            // console.log("修改成功",obj);
            this.dialogFormVisible = false;
            this.input = "";
            this.statesValue = "";
            this.payValue = "";
            //this.pageSize= 10;
            this.pageIndex = this.pageIndex;
            this.currentPage4 = this.currentPage4;
            this.list();
            this.$message.success("修改成功");
            this.$refs.uploadImg.clearFiles(); // 上传图片隐藏
          } else {
            this.$message.error("修改失败");
            this.$refs.uploadImg.clearFiles(); // 上传图片隐藏
          }
        })
        .catch(obj => {
          console.log("error");
        });
    },
    clear() {
      // this.orgsAddArr = [];
      this.businessOtherNamesArr = [];
      this.AbouQuota = null;
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
        //department: "",
        //people: "",
        scopeExt: [], //经营范围
        orgs: [], //区域可见
        address: "",
        linker: "",
        phone: "",
        publicName: "",
        bankName: "",
        bankcardNo: "",
        localCompRole: "", //商户角色
        salesman: "", //销售人员
        administrative: ""
      };
      if (this.$refs["ruleForm"] !== undefined) {
        this.$refs["ruleForm"].resetFields();
      }
    },
    //周边信息 整数转浮点数
    toDecimal2(x) {
      let f = Math.round(x * 100) / 100;
      var s = f.toString();
      var rs = s.indexOf(".");
      if (rs < 0) {
        rs = s.length;
        s += ".";
      }
      while (s.length <= rs + 2) {
        s += "0";
      }
      return s;
    },
    //获取一条信心
    getOneMess(id) {
      if (this.btnindex == 1) {
        this.rimResidue(id);
      }
      this.$http
        .post(this.GLOBAL.serverSrc + "/universal/localcomp/api/get", {
          id: id
        })
        .then(obj => {
          const { object } = obj.data;
          const {
            jqAdminList,
            localCompAliasList,
            orgs,
            useList
          } = obj.data.object;

          object.imgUrl != null ? (this.imgnum = 2) : (this.imgnum = 1);
          this.ruleForm.name = object.name;
          this.ruleForm.imgUrl = object.imgUrl;
          this.AbouQuota = object.abouQuota
          // this.ruleForm.localCompType = String(object.localCompType);
          // 商户信息详情页的ID
          this.businewwInfPageId = object.id;
          if (this.btnindex == 1) this.getDebitTable();
          this.useList = useList;
          this.useList.forEach((val, idx, arr) => {
            if (arr[idx].state == 2) {
              arr[idx].state = "正常";
            } else {
              arr[idx].state = "停用";
            }
            if (arr[idx].sex == 1) {
              arr[idx].sex = "男";
            } else {
              arr[idx].sex = "女";
            }
            if (arr[idx].peerUserType == 1) {
              arr[idx].peerUserType = "管理员";
            } else {
              arr[idx].peerUserType = "销售";
            }
          });
          // 状态
          if (object.state == 2) {
            this.ruleForm.state = "正常";
          } else {
            this.ruleForm.state = "停用";
          }
          // 类别
          if (object.localCompType == 1) {
            this.ruleForm.localCompType = "门店";
          } else if (object.localCompType == 2) {
            this.ruleForm.localCompType = "同业";
          } else if (object.localCompType == 3) {
            this.ruleForm.localCompType = "翻盘门店";
          } else if (object.localCompType == 4) {
            this.ruleForm.localCompType = "个体分销";
          }
          // 商户角色
          if (object.localCompRole == 1) {
            this.ruleForm.localCompRole = "旅游组团社";
          } else if (object.localCompRole == 2) {
            this.ruleForm.localCompRole = "独立旅行社";
          } else if (object.localCompRole == 3) {
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
          if (this.btnindex == 1) {
            this.ruleForm.scopeExt = object.scopeExt;
          } else {
            this.ruleForm.scopeExt = object.scopeExt.split(",");
          }
          this.adminArr = [];
          this.salesArr = [];
          jqAdminList.forEach((val, idx, arr) => {
            if (arr[idx].jqUserType === 1) {
              this.adminArr.push(val);
            } else {
              this.salesArr.push(val);
            }
          });
          let adminArr = [],
            salesArr = [];
          // 从商户详情页点击编辑进入编辑页然后管理人员与销售人员去重
          if (this.btnindex == 2) {
            this.adminArr = this.removalData(this.adminArr);
            this.salesArr = this.removalData(this.salesArr);
          }
          this.adminArr.forEach((val, idx, arr) => {
            adminArr.push(this.adminArr[idx].name);
          });
          this.salesArr.forEach((val, idx, arr) => {
            salesArr.push(this.salesArr[idx].name);
          });
          this.ruleForm.administrative = adminArr.join(",");
          this.ruleForm.salesman = salesArr.join(",");

          // 区域可见
          let areaDetails = [],
            areaEdit = [];
          for (let i = 0; i < orgs.length; i++) {
            for (let j = 0; j < this.scoperangeList.length; j++) {
              if (orgs[i].orgID == this.scoperangeList[j].id) {
                areaDetails.push(this.scoperangeList[j].orgName);
                areaEdit.push(orgs[i].orgID);
              }
            }
          }

          if (this.btnindex == 1) {
            this.ruleForm.orgs = areaDetails.join(",");
          } else {
            this.ruleForm.orgs = areaEdit;
          }

          // 商户其他名称 btnindex为1则是详情页 2是编辑页展现形式
          if (this.btnindex == 2) {
            let businessNamesArr = [];
            localCompAliasList.forEach((val, idx, arr) => {
              businessNamesArr.push({
                name: arr[idx].name,
                id: arr[idx].id
              });
            });
            this.businessOtherNamesArr = businessNamesArr;
          }

          if (this.btnindex == 1) {
            let businessNamesArr = [];
            localCompAliasList.forEach((val, idx, arr) => {
              businessNamesArr.push(arr[idx].name);
            });
            this.ruleForm.otherNames = businessNamesArr.toString();
          }

          // console.log("get",this.businessOtherNamesArr)
          if (this.btnindex == 1) {
            this.ruleForm.expTime = moment(object.expTime.toString()).format(
              "YYYY-MM-DD"
            );
          } else {
            let year = "";
            let month = "";
            let day = "";
            let pin = "";
            year = String(object.expTime).substring(0, 4);
            month = String(object.expTime).substring(4, 6);
            day = String(object.expTime).substring(6, 8);
            pin = year + "-" + month + "-" + day;
            this.ruleForm.expTime = pin;
            this.ruleForm.expTime = new Date(pin);
          }
          if (object.settlementType == 2) {
            this.ruleForm.settlementType = "非月结";
          } else if (object.settlementType == 1) {
            this.ruleForm.settlementType = "月结";
          }

          this.ruleForm.quota = object.quota;
          //todo    部门和人员 预留
          // this.ruleForm.department = "1";
          //this.ruleForm.people = "2";
          // this.ruleForm.scopeExt = object.scopeExt.split(",");

          this.ruleForm.quota = object.quota;
          this.ruleForm.address = object.address;
          this.ruleForm.linker = object.linker;
          this.ruleForm.phone = object.phone;
          this.ruleForm.publicName = object.publicName;
          this.ruleForm.bankName = object.bankName;
          this.ruleForm.bankcardNo = object.bankcardNo;
          this.ruleForm.localCompCode = object.localCompCode;
          this.ruleForm.deposit = object.deposit;
          // this.AbouDeposit = this.toDecimal2(object.abouDeposit);
          this.AbouQuota = this.toDecimal2(object.abouQuota);
          this.AbouBalance = this.toDecimal2(object.abouBalance);
          this.arrears = this.toDecimal2(object.arrears);
        })
        .catch(obj => {
          console.log(obj);
        });
    },
    // 周边剩余授信额度接口请求 tid就是此id
    rimResidue(id) {
      this.$http
        .post(
          this.GLOBAL.serverSrcPhp +
            "/api/v1/predeposit/predeposit/peripherycredit",
          {
            id: id
          }
        )
        .then(res => {
          let AbouBalance = Number(res.data.data.surplus_amount);
          this.AbouBalance = this.toDecimal2(AbouBalance);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 数组里面对象去重方法
    removalData(arrData) {
      var hash = {};
      arrData = arrData.reduce((item, next) => {
        //name是你要以什么属性去重
        hash[next.name] ? "" : (hash[next.name] = true && item.push(next));
        return item;
      }, []);
      return arrData;
    },
    //图片上传失败
    handleError(err, file) {
      this.$message.error("图片上传失败重新上传");
      this.fileList2 = [];
      this.imgnum = 2;
    },
    //图片上传成功
    handleSuccess(response, file, fileList2) {
      //console.log(file);
      if (file.status == "success") {
        this.imgnum = 1;
        let T_img = JSON.parse(response);
        this.ruleForm.imgUrl = T_img.paths[0].Url;
      } else {
        this.$message.error("图片上传失败重新上传");
      }
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
    //选中待上传的图片
    handlePreview(file) {
      // this.uid=file.uid;
    },
    //删除待上传的图片
    handleRemove(file, fileList) {
      // this.uid=fileList[0].uid;
      // for(let i=0;i<this.fileList.length;i++){
      //  if(file.uid==this.fileList[i].uid){
      //  this.fileList.splice(i,1);
      //  }
      // }
      // this.time=this.fileList.length;
    },
    // 商户信息
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
          this.scoperangeList = res.data.objects;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    this.currentPage4 = 1;
    this.list();
    this.areaAxios();
  }
};
</script>

<style scoped>
.BodyTableCenter {
  margin: 0 60px 0 100px;
}
.longWeight {
  width: 160px;
  vertical-align: top;
}
.tr {
  /* text-align: right; */
  font-weight: bold;
  vertical-align: top;
}
/* .el-pagination {
  margin-right: 300px !important;
} */
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
  width: 100%;
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
  margin-bottom: 20px;
  margin-top: 20px;
  height: 100px;
}
.dialogTableTr {
  line-height: 40px;
}
/* .dialogTableTd {
  width: 33.33%;
  height: auto;
} */
</style>

.el-pagination {
  margin-right: 300px !important;
}
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
  width: 100%;
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
  margin-bottom: 20px;
  margin-top: 20px;
  height: 100px;
}
.dialogTableTr {
  line-height: 40px;
}
.dialogTableTd {
  width: 33.33%;
  height: auto;
}
</style>
