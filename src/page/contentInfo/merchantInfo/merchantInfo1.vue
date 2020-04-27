<template>
  <div>
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
    <div class="button_style">
      <el-button type="primary" @click="add_info () ">添加</el-button>
      <!-- <el-button type="primary" v-if="tid <= 0" disabled>编辑</el-button>
      <el-button type="primary" v-else @click="edit_info">编辑</el-button>-->
      <!-- <el-button type="danger" v-if="tid <= 0" disabled @click="open7" plain>删除</el-button>
      <el-button type="danger" v-else @click="open7" plain>删除</el-button>-->
    </div>
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
        <el-table-column prop="balance" label="剩余额度" align="center"></el-table-column>
        <el-table-column prop="arrears" label="总欠款" align="center"></el-table-column>
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
              <el-form-item label="所属上级商户:" prop="parentName">
                <el-autocomplete
                  style="width: 250px;"
                  v-model="ruleForm.parentName"
                  :fetch-suggestions="querySearchAsyncName"
                  :trigger-on-focus="false"
                  placeholder="请输入内容"
                  @select="handleSelectName"
                  :disabled="ruleForm.parentID == -1 && sonList.length !== 0 && tid !== 0"
                ></el-autocomplete>
              </el-form-item>
              <el-form-item label="商户其他名称:" prop="otherNames" style="width: 350px;">
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
                v-if="(ruleForm.settlementType == '月结'|| ruleForm.settlementType == '1') && parentSettlementType !== 1"
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
              <el-form-item label="地区 :" prop="areaInformationName">
                <el-autocomplete
                  style="width:250px;"
                  clearable
                  placeholder="请输入地区名称"
                  :fetch-suggestions="querySearchdiqu"
                  @blur="handleBlurdiqu"
                  @select="handleSelectdiqu"
                  @focus="handleFocesdiqu"
                  v-model="ruleForm.areaInformationName"
                  :trigger-on-focus="false"
                ></el-autocomplete>
              </el-form-item>
              <el-form-item label="公司logo :" prop="companyLogo" style="width:360px;">
                <el-upload
                  ref="uploadImg"
                  class="upload-demo"
                  :action="imgUpload()"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :file-list="fileList2"
                  :limit="1"
                  :on-error="handleError"
                  :on-success="handleSuccess"
                  name="files"
                  style="width: 220px;"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                  <!-- </el-upload> -->
                  <!-- <el-upload
                  ref="uploadImg"
                  class="avatar-uploader"
                  :action="imgUpload()"
                  :limit="1"
                  :show-file-list="false"
                  :on-error="handleError"
                  :on-success="handleSuccess"
                >
                  <img v-if="ruleForm.imgUrl" :src="ruleForm.imgUrl" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
                  <!-- <el-button size="small" type="primary">点击上传</el-button> -->
                  <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                </el-upload>
                <div v-if=" this.imgnum == 2">
                  <img width="100%" height="12%" :src="ruleForm.imgUrl" />
                </div>
              </el-form-item>
              <!-- action="http://test.dayuntong.com/upload/obs/api/picture/" -->
              <el-form-item label="附件 :" prop="companyLogo" style="width:360px;">
                <el-upload
                  ref="uploadImg"
                  class="upload-demo"
                  :action="imgUpload()"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :file-list="fileList2"
                  :limit="1"
                  :on-error="handleErrorFileUrl"
                  :on-success="handleSuccessFileUrl"
                  name="files"
                  style="width: 220px;"
                >
                  <!-- <el-upload
                  ref="uploadImg"
                  class="avatar-uploader"
                  :action="imgUpload()"
                  :limit="1"
                  :show-file-list="false"
                  :on-error="handleErrorFileUrl"
                  :on-success="handleSuccessFileUrl"
                >
                  <img v-if="ruleForm.fileUrl" :src="ruleForm.fileUrl" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
                  <el-button size="small" type="primary">点击上传</el-button>
                  <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                </el-upload>
                <div v-if=" this.imgnum == 2">
                  <img width="100%" height="12%" :src="ruleForm.fileUrl" />
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
                    :trigger-on-focus="false"
                    style="width: 250px"
                  >
                    <template slot-scope="{ item }">
                      <div class="name">{{ item.warn }}</div>
                      <div class="name">{{ item.name=item.value }}</div>
                    </template>
                  </el-autocomplete>
                  <!-- <div style="margin-top: 10px;">
                    <el-tag
                      :key="tag.id"
                      v-for="tag in adminArr"
                      class="tag"
                      closable
                      :disable-transitions="false"
                      @close="handleAdminClose(tag, adminArr)"
                      style="margin-botton: 5px;"
                    >{{tag.name}}</el-tag>
                  </div>-->
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
        <div class="dialogTable" v-if="btnindex == 1">
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
                <td class="tr">商户其他名称:&nbsp;&nbsp;</td>
                <td class="longWeight">{{ruleForm.otherNames}}</td>
              </div>
              <td class="tr">商户编码：&nbsp;&nbsp;</td>
              <td class="longWeight">{{ruleForm.localCompCode}}</td>
            </tr>
            <br />
            <tr>
              <td class="tr">所属上级商户:&nbsp;&nbsp;</td>
              <td class="longWeight">{{ruleForm.parentName}}</td>
              <div class="BodyTableCenter">
                <td class="tr">经营范围：&nbsp;&nbsp;</td>
                <td class="longWeight">{{ruleForm.scopeExt}}</td>
              </div>
              <td class="tr">地区:&nbsp;&nbsp;</td>
              <td class="longWeight">{{ruleForm.areaInformationName}}</td>
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
              <td class="longWeight">
                {{toDecimal2(ruleForm.quota)}}
                <span
                  v-if="ruleForm.quota !== 0"
                >(剩余：{{toDecimal2(ruleForm.balance)}})</span>
              </td>
            </tr>
            <br />
            <tr>
              <td class="tr">公司logo：&nbsp;&nbsp;</td>
              <td class="longWeight">
                <!-- {{ruleForm.imgUrl}} -->
                <!-- <img width="100%" height="12%" :src="ruleForm.imgUrl" /> -->
                <a :href="ruleForm.imgUrl">logo</a>
              </td>
              <div class="BodyTableCenter">
                <td class="tr">附件：&nbsp;&nbsp;</td>
                <td class="longWeight">
                  <!-- {{ruleForm.fileUrl}} -->
                  <!-- <img width="100%" height="12%" :src="ruleForm.fileUrl" /> -->
                  <a :href="ruleForm.fileUrl">附件</a>
                </td>
              </div>
            </tr>
          </table>
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
              <el-table-column prop="orderCode" label="订单编号" align="center"></el-table-column>
              <el-table-column prop="title" label="产品名称" align="center"></el-table-column>
              <el-table-column prop="groupCode" label="团期计划" align="center"></el-table-column>
              <el-table-column prop="cF_Date" label="出团日期" align="center"></el-table-column>
              <el-table-column prop="payable" label="订单金额" align="center"></el-table-column>
              <el-table-column prop="qk_price" label="欠款金额" align="center"></el-table-column>
              <el-table-column prop="yh_price" label="已还金额" align="center"></el-table-column>
              <el-table-column prop="createTime" label="欠款日期" align="center"></el-table-column>
              <el-table-column prop="repaymentDate" label="应还日期" align="center"></el-table-column>
            </el-table>
            <el-pagination
              class="pagination"
              @size-change="handleGlSizeChange"
              background
              @current-change="handleGlCurrentChange"
              :current-page="1"
              :page-sizes="[10, 30, 50, 100]"
              :page-size="10"
              layout="total, sizes, prev, pager, next, jumper"
              :total="glTotal"
            ></el-pagination>
          </div>
          <div class="relevanceDept" v-if="ruleForm.parentID == -1">
            <h3>下级商户</h3>
            <div class="relevanceDeptWarn">
              <p class="el-icon-warning">
                所属
                <span style="color:#108ee9">{{sonList.length}}</span> 项
              </p>
            </div>
            <!-- <el-table :data="sonList" border style="width: 100%;margin-top: 20px;">
              <el-table-column prop="name" label="商户名称" align="center"></el-table-column>
              <el-table-column prop="settlementTypeCN" label="结算方式" align="center"></el-table-column>
              <el-table-column prop="linker" label="联系人姓名" align="center"></el-table-column>
              <el-table-column prop="phone" label="联系人电话" align="center"></el-table-column>
              <el-table-column prop="jqAdminList" label="管理人员" align="center"></el-table-column>
              <el-table-column prop="balance" label="剩余额度" align="center"></el-table-column>
              <el-table-column prop="deposit" label="预存款" align="center"></el-table-column>
              <el-table-column prop="peerUserType" label="职务" align="center"></el-table-column>
            </el-table>-->
            <table border="1" cellspacing="0" cellpadding="0" bordercolor="#EBEEF5">
              <tr align="center" style="height: 40px;">
                <td style="width: 300px;">商户名称</td>
                <td style="width: 200px;">结算方式</td>
                <td style="width: 200px;">联系人姓名</td>
                <td style="width: 200px;">联系人电话</td>
                <td style="width: 200px;">管理人员</td>
                <td style="width: 200px;">剩余额度</td>
                <td style="width: 200px;">预存款</td>
              </tr>
              <tr align="center" v-for="(item,index) in sonList" :key="index">
                <td class="paddingTd">{{item.name}}</td>
                <td class="paddingTd">{{item.settlementTypeCN}}</td>
                <td class="paddingTd">{{item.linker}}</td>
                <td class="paddingTd">{{item.phone}}</td>
                <td>
                  <span
                    v-for="(ite,index) in item.jqAdminList"
                    :key="'a'+index"
                    style="border:none;"
                  >{{ite.name}}</span>
                </td>
                <td class="paddingTd">{{item.balance}}</td>
                <td class="paddingTd">{{item.deposit}}</td>
              </tr>
            </table>
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

    <!-- <childAccount :isChooseAccount="isChooseAccount"></childAccount> -->

    <!--end-->
  </div>
</template>

<script>
import state from "../../../store/state";
// import childAccount from "./comps/chooseAccount";
import moment from "moment";

export default {
  name: "merchantInfo",
  data() {
    let wechatvalidator = (rule, value, callback) => {
      if (/[\u4E00-\u9FA5]/g.test(value)) {
        return callback("请输入正确格式");
      } else {
        return callback();
      }
    };
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
      otherNamesObj: {}, 
      // isBusinessTrue: false,
      // orgsAddArr: [], 
      AbouArrears: null, 
      AbouBalance: null, 
      AbouDeposit: null, 
      arrears: null, 
      page_order_total: null, 
      AbouQuota: null, 
      // editAdmin: [],  
      businewwInfPageId: "", 
      vague: [], 
      vagueDiQu: [], 
      // cascaderArr: [],
      isAddAccountBtn: 0, 
      accountArr: [], 
      tableRelevanceDeptInfo: [], 
      isAddAccount: false, 
      scoperangeList: [], 
      businessOtherNamesArr: [], 
      adminArr: [], 
      salesArr: [], 
      fileList: [], 
      imgnum: 1, 
      btnindex: 0, 
      readonly: true, 
      statesValue: "", 
      payValue: "", 
      isInputVisible: false, 
      isOtherSuccess: true,  
      isAccountValidator: null, 
      isChooseAccount: false, 
      isHavePhoneOrEmail: null, 
      tid: 0, 
      pageSize: 10,  
      pageIndex: 1, 
      total: 1, 
      currentPage4: 1, 
      glPageSize: 10, 
      glPageIndex: 1, 
      glTotal: 0, 
      // editAccouontScopeid: null, 
      accountForm: {
        name: "", 
        phone: "", 
        email: "", 
        sex: "", 
        wx: "", 
        qq: "", 
        state: null, 
        passWord: "",
        peerUserType: null 
        //id:"",
      }, 
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
        // sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        wx: [{ validator: wechatvalidator, trigger: "blur" }]
        // qq: [
        //   {
        //     min: 5,
        //     max: 11,
        //     pattern: /(^[\-0-9][0-9]*(.[0-9]+)?)$/,
        //     message: "请输入正确格式",
        //     trigger: "blur"
        //   }
        // ],
        // state: [{ required: true, message: "请选择状态", trigger: "change" }],
        // passWord: [
        //   { required: true, message: "请输入密码", trigger: "blur" },
        //   { min: 6, max: 30, message: "请输入6-30位密码", trigger: "blur" }
        // ],
        // peerUserType: [
        //   { required: true, message: "请选择职务", trigger: "change" }
        // ]
      },
      sonList: [],
      ruleForm: {
        name: "", 
        storeType: "", 
        localCompType: "", 
        state: null, 
        expTime: "", 
        areaInformationID: null, 
        areaInformationName: "", 
        settlementType: null, 
        quota: "", 
        //department: "",
        // people: "",
        scopeExt: [], 
        orgs: [], 
        address: "", 
        linker: "", 
        phone: "", 
        publicName: "", 
        bankName: "", 
        bankcardNo: "", 
        localCompRole: "", 
        salesman: "", 
        administrative: "", 
        otherNames: "", 
        localCompCode: "", 
        ImgUrl: "", 
        fileUrl: "", 
        parentID: -1, 
        parentName: "" 
      },
      rules: {
        // expTime: [{ required: true, message: "请选择日期", trigger: "change" }],
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          // { max: 40, message: "不要超过40个字符", trigger: "blur" }
          { validator: nameValidator, trigger: "blur" }
        ],
        areaInformationName: [
          { required: true, message: "请选择地区", trigger: "blur" }
        ],
        localCompType: [
          { required: true, message: "请选择类型", trigger: "change" }
        ],
        state: [{ required: true, message: "请选择状态", trigger: "change" }],
        settlementType: [
          { required: true, message: "请选择结算方式", trigger: "change" }
        ],
        // localCompRole: [
        //   { required: true, message: "请选择商户角色", trigger: "change" }
        // ],
        // storeType: [
        //   { required: true, message: "请选择门市类型", trigger: "blur" }
        // ],
        administrative: [
          // { required: true, message: "请选择管理人员", trigger: "change" }
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
        // publicName: [
        //   { required: true, message: "请输入对公户名", trigger: "blur" },
        //   { max: 40, message: "不要超过40个字符", trigger: "blur" }
        // ],
        // bankName: [
        //   { required: true, message: "请输入开户行", trigger: "blur" },
        //   { max: 80, message: "不要超过80个字符", trigger: "blur" }
        // ],
        // bankcardNo: [
        //   { required: true, message: "请输入对公账号", trigger: "blur" },
        //   { max: 30, message: "不要超过30个字符", trigger: "blur" }
        // ],
        // scopeExt: [
        //   {
        //     type: "array",
        //     required: true,
        //     message: "请至少选择一个经营",
        //     trigger: "change"
        //   }
        // ],
        // orgs: [
        //   {
        //     type: "array",
        //     required: true,
        //     message: "请至少选择一个区域",
        //     trigger: "change"
        //   }
        // ],
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
      input: "", 
      tableData: [],
      useList: [], 
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
      fileList2: [], 
      fileList1: [], 
      isSelect: false, 
      areaInformationName: "", 
      superiorMerchants: [], 
      parentSettlementType: null 
    };
  },
  components: {
    // childAccount: childAccount
  },
  methods: {
    moment,
    querySearchAsyncName(queryString, cb) {
      this.superiorMerchants = [];
      this.$http
        .post(this.GLOBAL.serverSrc + "/universal/localcomp/api/list", {
          object: {
            name: queryString,
            parentID: -1
          }
        })
        .then(res => {
          for (let i = 0; i < res.data.objects.length; i++) {
            this.superiorMerchants.push({
              id: res.data.objects[i].id,
              value: res.data.objects[i].name
            });
          }
          let results = queryString
            ? this.superiorMerchants.filter(this.createFilter(queryString))
            : [];
          cb && cb(results);
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleSelectName(item) {
      this.parentSettlementType = item.settlementType;
      this.ruleForm.parentID = item.id;
      this.ruleForm.parentName = item.value;
    },
    imgUpload() {
      return this.GLOBAL.serverSrc + "/upload/obs/api/picture";
      // return this.GLOBAL.jqUrl + '/upload/obs/api/picture'
    },
    showInput() {
      this.isInputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
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
    querySearchdiqu(queryString, cb) {
      this.vagueDiQu = [];
      this.$http
        .post(this.GLOBAL.serverSrc + "/universal/area/api/fuzzy", {
          object: {
            areaName: queryString
          }
        })
        .then(res => {
          for (let i = 0; i < res.data.objects.length; i++) {
            this.vagueDiQu.push({
              id: res.data.objects[i].id,
              value: res.data.objects[i].markName
            });
          }
          var results = queryString
            ? this.vagueDiQu.filter(this.createFilter(queryString))
            : [];

          cb(results);
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleFocesdiqu() {
      // let areaInformationName
      // this.ruleForm.areaInformationName = ""
    },
    handleBlurdiqu() {
      setTimeout(() => {
        if (this.isSelect === false) {
          this.ruleForm.areaInformationName = "";
          this.ruleForm.areaInformationID = null;
        } else {
          this.isSelect = false;
        }
      }, 200);
    },
    handleSelectdiqu(item) {
      this.ruleForm.areaInformationID = item.id;
      // this.form.areaId = item;
      this.ruleForm.areaInformationName = item.value;
      this.isSelect = true;
    },
    createFilter(queryString) {
      return restaurant => {
        return restaurant.value;
      };
    },
    querySearchAsync(queryString, cb) {
      this.vague = [];
      this.$http
        .post(this.GLOBAL.serverSrc + "/org/api/userlist", {
          object: {
            name: queryString
          }
        })
        .then(res => {
          // if (res.data.objects.length !== 0) {
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
          // } else {
          //   this.ruleForm.administrative = ""
          // }
        });
    },
    createStateFilter(queryString) {
      return restaurant => {
        return restaurant.value;
      };
    },
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
    handleFocusAdminNames() {
      // this.ruleForm.administrative = "";
    },
    handleFocusSalesNames() {
      this.ruleForm.salesman = "";
    },
    handleSelectAdminNames(item) {
      item.jqUserType = 1;
      item.isDeleted = 1;
      this.adminArr.push(item);
      // this.handleBlurAdminNames();
    },
    handleSelectSalesNames(item) {
      this.salesArr.push(item);
      this.handleBlurSalesNames();
    },
    // handleBlurAdminNames() {
    // let arr = [];
    // for (let i = 0; i < this.adminArr.length; i++) {
    //   this.adminArr[i].isDeleted = 0;
    //   this.adminArr[i].jqUserType = 1;
    //   arr.push(this.adminArr[i].name);
    // }
    // this.ruleForm.administrative = arr.join(",");
    // },
    handleBlurSalesNames() {
      let arr = [];
      for (let i = 0; i < this.salesArr.length; i++) {
        this.salesArr[i].isDeleted = 0;
        this.salesArr[i].jqUserType = 2;
        arr.push(this.salesArr[i].name);
      }
      this.ruleForm.salesman = arr.join(",");
    },
    // handleAdminClose(tag, arr) {
    //   arr.forEach((v, k, arr) => {
    //     if (arr[k].name == tag.name) {
    //       arr.splice(k, 1);
    //     }
    //   });
    //   this.adminArr = arr;
    //   this.handleBlurAdminNames();
    // },
    handleSalesClose(tag, arr) {
      arr.forEach((v, k, arr) => {
        if (arr[k].name == tag.name) {
          arr.splice(k, 1);
        }
      });
      this.salesArr = arr;
      this.handleBlurSalesNames();
    },
    accountDelete(index, row) {
      this.useList.splice(index, 1);
    },
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
    addAccountEditCancel() {
      this.isAddAccount = false;
      this.isAddAccountBtn = 0;
    },
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
        peerUserType: [] 
        //id:"",
      };
      this.$refs[accountForm].resetFields();
      this.isAddAccount = false;
      this.isAddAccountBtn = 0;
    },
    bigSaveAccount() {
      if (this.accountForm.state == 2) {
        this.accountForm.state = "正常";
      } else if (this.accountForm.state == 1) {
        this.accountForm.state = "停用";
      } else {
        this.accountForm.state = "";
      }

      if (this.accountForm.sex == 1) {
        this.accountForm.sex = "男";
      } else if (this.accountForm.sex == 2) {
        this.accountForm.sex = "女";
      } else {
        this.accountForm.sex = "";
      }

      if (this.accountForm.peerUserType == 1) {
        this.accountForm.peerUserType = "管理员";
      } else {
        this.accountForm.peerUserType = "销售";
      }
      this.useList.push(this.accountForm);
      this.isAddAccount = false;
      this.$message({
        message: "添加成功",
        type: "success"
      });
    },
    addAccountAddBtn(accountForm) {
      // debugger
      // isAddAccountBtn == 1 
      // isAddAccountBtn == 2 
      // if (this.isAddAccountBtn == 1) {
      if (this.tid === 0) {
        this.$refs[accountForm].validate(valid => {
          if (valid) {
            this.accountForm.createTime = new Date().getTime();
            this.bigSaveAccountValidator().then(obj => {
              if (obj == true) {
                let istype;
                if (this.useList.length > 0) {
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
                } else if (this.accountForm.state == "停用") {
                  this.accountForm.state = 3;
                } else {
                  this.accountForm.state = 0;
                }

                if (this.accountForm.sex == "男") {
                  this.accountForm.sex = 1;
                } else if (this.accountForm.sex == "女") {
                  this.accountForm.sex = 2;
                } else {
                  this.accountForm.sex = 0;
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
    accountValidator() {
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
    editAccountAddBtn() {
      // this.accountForm.id = this.editAccouontScopeid;
      this.accountForm.localCompID = this.tid;
      if (this.accountForm.state !== null) {
        if (this.accountForm.state == 2 || this.accountForm.state == "正常") {
          this.accountForm.state = 2;
        } else {
          this.accountForm.state = 3;
        }
      } else {
        this.accountForm.state = 0;
      }
      if (this.accountForm.sex !== "") {
        if (this.accountForm.sex == 1 || this.accountForm.sex == "男") {
          this.accountForm.sex = 1;
        } else {
          this.accountForm.sex = 2;
        }
      } else {
        this.accountForm.sex = 0;
      }

      if (this.accountForm.peerUserType !== "") {
        if (
          this.accountForm.peerUserType == 1 ||
          this.accountForm.peerUserType == "管理员"
        ) {
          this.accountForm.peerUserType = 1;
        } else {
          this.accountForm.peerUserType = 2;
        }
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
        peerUserType: null
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
    closeDialog() {
      this.btnindex = 0;
      this.arrears = 0;
      this.sonList = [];
      this.parentSettlementType = null;
      this.glPageIndex = 1;
      this.glPageSize = 10;
    },
    handleReset() {
      this.pageIndex = 1;
      this.input = "";
      this.statesValue = "";
      this.payValue = "";
      // this.list();
      this.pageList(1, this.pageSize);
      this.currentPage4 = 1;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageList(1, val);
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.pageList(val, this.pageSize);
    },
    handleSearch() {
      this.pageIndex = 1;
      this.pageList(1, this.pageSize);
      this.currentPage4 = 1;
    },
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
    add_info() {
      this.tid = 0;
      this.clear();
      this.readonly = false;
      this.dialogFormVisible = true;
    },
    editBtn(index) {
      this.edit_info(2, this.tid);
    },
    edit_info(index, row) {
      // this.businessOtherNamesArr = [];
      index === 1 ? (this.readonly = true) : (this.readonly = false);
      this.btnindex = index;
      this.tid = row;
      this.getOneMess(this.tid);
      this.dialogFormVisible = true;
    },
    getDebitTable(id) {
      this.$http
        .post(this.GLOBAL.serverSrc + "/universal/localcomp/api/page_order", {
          pageIndex: this.glPageIndex,
          pageSize: this.glPageSize,
          // total: 1, 
          object: {
            // isDeleted: 0 
            orgID: id
          }
        })
        .then(obj => {
          this.glTotal = obj.data.total;
          this.tableRelevanceDeptInfo = obj.data.objects;
          this.tableRelevanceDeptInfo.forEach((item, index, arr) => {
            item.cF_Date = moment(item.cF_Date.toString()).format("YYYY-MM-DD");
            item.createTime = moment(item.createTime).format("YYYY-MM-DD");
            item.repaymentDate = moment(item.repaymentDate).format(
              "YYYY-MM-DD"
            );
          });
          this.page_order_total = obj.data.total;
          this.getDebitTablePrice(id, this.glTotal);
        })
        .catch(err => {
          console.log(err);
        });
    },
    getDebitTablePrice(id, total) {
      this.arrears = 0;
      console.log(this.arrears)
      this.$http
        .post(this.GLOBAL.serverSrc + "/universal/localcomp/api/page_order", {
          pageIndex: 1,
          pageSize: total,
          total: total, 
          object: {
            // isDeleted: 0 
            orgID: id
          }
        })
        .then(obj => {
          obj.data.objects.forEach(item => {
            this.arrears += item.qk_price;
          });
        })
        .catch(err => {});
    },
    handleGlSizeChange(val) {
      this.glPageSize = val;
      this.glPageIndex = 1;
      this.getDebitTable(this.tid);
    },
    handleGlCurrentChange(val) {
      this.glPageSize = 10;
      this.glPageIndex = val;
      this.getDebitTable(this.tid);
    },
    submitForm(ruleForm) {
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
        name: "", 
        storeType: "无",
        localCompType: "",
        state: "正常", 
        expTime: "",
        settlementType: "非月结", 
        quota: "",
        // department: "",
        // people: "",
        scopeExt: [], 
        orgs: [], 
        address: "",
        linker: "",
        phone: "",
        publicName: "",
        bankName: "",
        bankcardNo: "",
        localCompRole: "", 
        salesman: "", 
        administrative: "", 
        ImgUrl: "", 
        fileUrl: "", 
        parentName: "",
        parentID: -1,
        areaInformationName: "",
        areaInformationID: null
      };
      if (this.btnindex !== 1) this.$refs["ruleForm"].resetFields();
      this.dialogFormVisible = false;
      this.btnindex = 0;
      this.adminArr = [];
      this.salesArr = [];
      this.businessOtherNamesArr = [];
      this.sonList = [];
      this.arrears = 0;
      // this.$refs.uploadImg.clearFiles();
      // this.orgsAddArr = []
    },
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
    list() {
      var that = this;
      this.$http
        .post(this.GLOBAL.serverSrc + "/universal/localcomp/api/page", {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          // total: 1, 
          object: {
            // isDeleted: 0 
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
    addMerchan(ruleForm) {
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

      // console.log("商户角色", this.ruleForm.localCompRole);
      if ((this.ruleForm.localCompRole = "旅游组团社")) {
        this.ruleForm.localCompRole = 1;
      } else if ((this.ruleForm.localCompRole = "独立旅行社")) {
        this.ruleForm.localCompRole = 2;
      } else {
        this.ruleForm.localCompRole = 3;
      }
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

      // if (
      //   this.tableData.filter(v => this.ruleForm.name == v.name).length != 0
      // ) {
      //   this.$message.error("添加失败,该商户名称已存在");
      //   this.dialogFormVisible = true;
      //   return;
      // }

      if (this.ruleForm.state == "停用") {
        this.ruleForm.state = 3;
      } else {
        this.ruleForm.state = 2;
      }

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
      if (this.ruleForm.storeType == "无") {
        this.ruleForm.storeType = 0;
      } else if (this.ruleForm.storeType == "大运通自营") {
        this.ruleForm.storeType = 1;
      } else if (this.ruleForm.storeType == "加盟门市") {
        this.ruleForm.storeType = 2;
      } else if (this.ruleForm.storeType == "第三方门市") {
        this.ruleForm.storeType = 3;
      }

      let scopeExt = "";
      if (this.ruleForm.scopeExt.length !== 0) {
        let scopeExt = this.ruleForm.scopeExt.join(",");
      }
      let orgs = [];
      for (let i = 0; i < this.ruleForm.orgs.length; i++) {
        let org = {};
        org.orgID = this.ruleForm.orgs[i];
        org.isDeleted = 0;
        org.createTime = new Date().getTime();
        orgs.push(org);
      }
      this.ruleForm.orgs = orgs;

      // jqAdminList 
      // let adminAndSalesArr = [...this.salesArr];
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

      this.useList.forEach((val, idx, arr) => {
        if (arr[idx].peerUserType == "管理员") {
          arr[idx].peerUserType = 1;
        } else {
          arr[idx].peerUserType = 2;
        }
        if (arr[idx].sex == "男") {
          arr[idx].sex = 1;
        } else if (arr[idx].sex == "女") {
          arr[idx].sex = 2;
        } else {
          arr[idx].sex = 0;
        }
        if (arr[idx].state == "正常" || arr[idx].state == "") {
          arr[idx].state = 2;
        } else {
          arr[idx].state = 3;
        }
      });
      // console.log(this.useList, "上传的账号信息");
      if (this.AbouQuota == null) {
        this.AbouQuota = 0;
      }
      if (this.ruleForm.quota == "") {
        this.ruleForm.quota = 0;
      }

      if (this.ruleForm.expTime == "") {
        this.ruleForm.expTime = 0;
      }
      this.ruleForm.parentID == null
        ? (this.ruleForm.parentID = -1)
        : this.ruleForm.parentID;
      // console.log(this.ruleForm.parentID,"this.ruleForm.parentID")
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
            // arrears: this.ruleForm.arrears,
            imgUrl: this.ruleForm.imgUrl,
            fileUrl: this.ruleForm.fileUrl,
            localCompRole: this.ruleForm.localCompRole,
            //localCompRole: 1,
            storeType: this.ruleForm.storeType,
            orgs: this.ruleForm.orgs,
            useList: this.useList,
            jqAdminList: adminAndSalesArr,
            localCompAliasList: this.businessOtherNamesArr, 
            abouQuota: this.AbouQuota, 
            localCompCode: this.ruleForm.localCompCode, 
            localCompAliasList: this.businessOtherNamesArr,
            areaInformationID: this.ruleForm.areaInformationID,
            areaInformationName: this.ruleForm.areaInformationName,
            parentID: this.ruleForm.parentID
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
            this.$refs.uploadImg.clearFiles(); 
          } else {
            this.$message({
              message: "添加失败",
              type: "error"
            });
            this.$refs.uploadImg.clearFiles(); 
          }
        })
        .catch(obj => {
          this.$message({
            message: "添加失败",
            type: "error"
          });
          this.$refs.uploadImg.clearFiles(); 
        });
    },
    editMerchan(ruleForm) {
      if (this.businessOtherNamesArr.length !== 0) {
        if (this.businessOtherNamesArr.length > 50) {
          this.$message.error("商户其他名称不可超过50个");
          this.dialogFormVisible = true;
          return;
        }
      }
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
      } else {
        this.ruleForm.localCompRole = 0;
      }
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
      if (this.ruleForm.state == "停用" || this.ruleForm.state == 3) {
        this.ruleForm.state = 3;
      } else if (this.ruleForm.state == "正常" || this.ruleForm.state == 2) {
        this.ruleForm.state = 2;
      }
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

      let scopeExt = "";
      if (this.ruleForm.scopeExt.length !== 0) {
        scopeExt = this.ruleForm.scopeExt.join(",");
      }

      // console.log(this.ruleForm.expTime, 22);
      if (this.ruleForm.expTime == "Invalid Date") {
        this.ruleForm.expTime = 0;
      } else {
        this.ruleForm.expTime = moment(this.ruleForm.expTime).format(
          "YYYYMMDD"
        );
      }
      // console.log(this.ruleForm.expTime);

      let orgs = [];

      for (let i = 0; i < this.ruleForm.orgs.length; i++) {
        let org = {};
        org.orgID = this.ruleForm.orgs[i];
        org.isDeleted = 0;
        org.createTime = new Date().getTime();
        orgs.push(org);
      }
      this.ruleForm.orgs = orgs;
      // jqAdminList 
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
            // arrears: this.ruleForm.arrears,
            imgUrl: this.ruleForm.imgUrl,
            fileUrl: this.ruleForm.fileUrl,
            localCompRole: this.ruleForm.localCompRole,
            //localCompRole: 1,
            storeType: this.ruleForm.storeType,
            orgs: this.ruleForm.orgs,
            jqAdminList: adminAndSalesArr,
            localCompAliasList: this.businessOtherNamesArr,
            abouQuota: this.AbouQuota, 
            localCompCode: this.localCompCode,
            useList: this.useList,
            areaInformationID: this.ruleForm.areaInformationID,
            parentID: this.ruleForm.parentID
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
            this.$refs.uploadImg.clearFiles();
          } else {
            this.$message.error("修改失败");
            this.$refs.uploadImg.clearFiles(); 
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
        name: "", 
        storeType: "无", 
        localCompType: "",
        state: "正常", 
        expTime: "",
        settlementType: "非月结", 
        quota: "",
        //department: "",
        //people: "",
        scopeExt: [], 
        orgs: [], 
        address: "",
        linker: "",
        phone: "",
        publicName: "",
        bankName: "",
        bankcardNo: "",
        localCompRole: "", 
        salesman: "", 
        administrative: "",
        parentID: -1,
        parentName: "",
        areaInformationName: "",
        areaInformationID: null
      };
      if (this.$refs["ruleForm"] !== undefined) {
        this.$refs["ruleForm"].resetFields();
      }
    },
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
          this.parentSettlementType = object.parentSettlementType;
          this.ruleForm.name = object.name;
          this.ruleForm.imgUrl = object.imgUrl;
          this.ruleForm.fileUrl = object.fileUrl;
          this.AbouQuota = object.abouQuota;
          this.ruleForm.balance = object.balance;
          // this.ruleForm.localCompType = String(object.localCompType);
          this.businewwInfPageId = object.id;
          if (this.btnindex == 1) this.getDebitTable(id);
          this.useList = useList;
          this.useList.forEach((val, idx, arr) => {
            if (arr[idx].state == 2) {
              arr[idx].state = "正常";
            } else if (arr[idx].state == 3) {
              arr[idx].state = "停用";
            } else {
              arr[idx].state = null;
            }
            if (arr[idx].sex == 1) {
              arr[idx].sex = "男";
            } else if (arr[idx].sex == 2) {
              arr[idx].sex = "女";
            } else {
              arr[idx].sex = "";
            }
            if (arr[idx].peerUserType == 1) {
              arr[idx].peerUserType = "管理员";
            } else {
              arr[idx].peerUserType = "销售";
            }
          });
          if (object.state == 2) {
            this.ruleForm.state = "正常";
          } else {
            this.ruleForm.state = "停用";
          }
          if (object.localCompType == 1) {
            this.ruleForm.localCompType = "门店";
          } else if (object.localCompType == 2) {
            this.ruleForm.localCompType = "同业";
          } else if (object.localCompType == 3) {
            this.ruleForm.localCompType = "翻盘门店";
          } else if (object.localCompType == 4) {
            this.ruleForm.localCompType = "个体分销";
          }
          if (object.localCompRole == 1) {
            this.ruleForm.localCompRole = "旅游组团社";
          } else if (object.localCompRole == 2) {
            this.ruleForm.localCompRole = "独立旅行社";
          } else if (object.localCompRole == 3) {
            this.ruleForm.localCompRole = "个人/独立旅游顾问";
          }
          if (object.storeType == 0) {
            this.ruleForm.storeType = "无";
          } else if (object.storeType == 1) {
            this.ruleForm.storeType = "大运通自营";
          } else if (object.storeType == 2) {
            this.ruleForm.storeType = "加盟门市";
          } else {
            this.ruleForm.storeType = "第三方门市";
          }
          if (object.expTime === 0) {
            this.ruleForm.expTime = "";
          }
          if (object.scopeExt !== null) {
            if (this.btnindex == 1) {
              this.ruleForm.scopeExt = object.scopeExt;
            } else {
              this.ruleForm.scopeExt = object.scopeExt.split(",");
            }
          }
          // this.adminArr = [];
          this.salesArr = [];
          this.ruleForm.administrative = "";
          jqAdminList.forEach((val, idx, arr) => {
            if (arr[idx].jqUserType === 2) {
              this.salesArr.push(val);
            } else {
              this.ruleForm.administrative = val.name;
            }
          });
          // let adminArr = [],
          let salesArr = [];
          if (this.btnindex == 2) {
            // this.adminArr = this.removalData(this.adminArr);
            this.salesArr = this.removalData(this.salesArr);
          }
          // this.adminArr.forEach((val, idx, arr) => {
          //   adminArr.push(this.adminArr[idx].name);
          // });
          this.salesArr.forEach((val, idx, arr) => {
            salesArr.push(this.salesArr[idx].name);
          });
          // this.ruleForm.administrative = adminArr.join(",");
          this.ruleForm.salesman = salesArr.join(",");
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
          if (this.btnindex == 2) {
            this.ruleForm.otherNames = "";
          }

          // console.log("get",this.businessOtherNamesArr)
          if (this.btnindex == 1) {
            if (object.expTime !== 0) {
              this.ruleForm.expTime = moment(object.expTime.toString()).format(
                "YYYY-MM-DD"
              );
            }
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

          this.sonList = object.sonList;

          this.ruleForm.parentID = object.parentID;
          this.ruleForm.parentName = object.parentName;
          this.ruleForm.quota = object.quota;

          //todo    
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
          this.ruleForm.areaInformationName = object.areaInformationName;
          this.ruleForm.areaInformationID = object.areaInformationID;
          // this.AbouDeposit = this.toDecimal2(object.abouDeposit);
          this.AbouQuota = this.toDecimal2(object.abouQuota);
          this.AbouBalance = this.toDecimal2(object.abouBalance);
          // if (this.btnindex == 1) {
          //   this.arrears = this.toDecimal2(object.arrears);
          // }
        })
        .catch(obj => {
          console.log(obj);
        });
    },
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
    removalData(arrData) {
      var hash = {};
      arrData = arrData.reduce((item, next) => {
        hash[next.name] ? "" : (hash[next.name] = true && item.push(next));
        return item;
      }, []);
      return arrData;
    },
    handleError(err, file) {
      this.$message.error("图片上传失败重新上传");
      this.fileList2 = [];
      this.imgnum = 2;
    },
    handleErrorFileUrl(err, file) {
      this.$message.error("附件上传失败重新上传");
      this.fileList1 = [];
      this.fileUrl = 2;
    },
    handleSuccess(response, file, fileList2) {
      console.log(file, "logo");
      if (file.status == "success") {
        this.imgnum = 1;
        let T_img = JSON.parse(response);
        this.ruleForm.imgUrl = T_img.paths[0].Url;
        // this.ruleForm.imgUrl = URL.createObjectURL(file.raw);
      } else {
        this.$message.error("图片上传失败重新上传");
      }
    },
    handleSuccessFileUrl(response, file, fileList1) {
      console.log(file, "附件");
      if (file.status == "success") {
        this.fileUrl = 1;
        let T_fileUrl = JSON.parse(response);
        this.ruleForm.fileUrl = T_fileUrl.paths[0].Url;
        // this.ruleForm.fileUrl = URL.createObjectURL(file.raw);
      } else {
        this.$message.error("附件上传失败重新上传");
      }
    },
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
    handlePreview(file) {
      // this.uid=file.uid;
    },
    handleRemove(file, fileList) {
      // this.uid=fileList[0].uid;
      // for(let i=0;i<this.fileList.length;i++){
      //  if(file.uid==this.fileList[i].uid){
      //  this.fileList.splice(i,1);
      //  }
      // }
      // this.time=this.fileList.length;
    },
    handleClick(row, event, column) {
      this.tid = row.id;
    },
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
    // this.areaAxios();
  }
};
</script>

<style scoped>
.paddingTd {
  padding: 12px 2px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 50px;
  height: 50px;
  text-align: center;
}
.avatar {
  width: 178px;
  display: block;
}
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
  margin-bottom: 20px;
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
.pagination {
  margin-top: 40px;
  text-align: right;
}
/* .dialogTableTd {
  width: 33.33%;
  height: auto;
} */
</style>