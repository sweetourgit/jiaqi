<template>
  <div class="vivo" style="position:relative" id="tradeAdd">
    <el-dialog :title="info == ''?'添加':'编辑'" :visible="dialogFormVisible" style="margin:-80px 0 0 0;width: 100%;" custom-class="city_list" :show-close="false" @close="closeAdd" >
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <div class="buttonDv" v-if="info == ''">
          <el-button type="primary" @click="cancelBtnTJ" style="margin-right: 10px" plain>取消</el-button>
          <el-button type="primary" @click="submitBtnTJ('ruleForm')" style="margin: 0">添加</el-button>
        </div>
        <div class="buttonDv" v-if="info != ''">
          <el-button type="primary" @click="cancelBtnXG" style="margin-right: 10px" plain>取消</el-button>
          <el-button type="primary" @click="submitBtnXG('ruleForm')" style="margin: 0">保存</el-button>
        </div>
        <!--<p class="stepTitle">基本信息</p>-->
        <el-divider content-position="left">基本信息</el-divider>
        <div class="stepDv">
          <el-form-item label="收款详细说明：" prop="mark" label-width="140px">
            <el-input v-model="ruleForm.mark" placeholder="请输入" class="baseIn" maxlength="80" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="收款时间：" prop="creditTime" label-width="140px">
            <el-date-picker v-model="ruleForm.creditTime" type="date" placeholder="请选择日期" class="start-time baseIn"></el-date-picker>
          </el-form-item>
          <el-form-item label="分销商：" prop="distributor" label-width="140px" v-if="info != ''">
            <el-radio-group v-model="ruleForm.distributor" @change="radioChange" :disabled="true">
              <el-radio label="美团（团购直连）">美团（团购直连）</el-radio>
              <el-radio label="马蜂窝自由行">马蜂窝自由行</el-radio>
              <el-radio label="去哪儿">去哪儿</el-radio>
              <!--待添加，新需求-->
              <el-radio label="票付通余额">票付通余额</el-radio>
              <el-radio label="无">无</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="分销商：" prop="distributor" label-width="140px" v-if="info == ''">
            <el-radio-group v-model="ruleForm.distributor" @change="radioChange">
              <el-radio label="美团（团购直连）">美团（团购直连）</el-radio>
              <el-radio label="马蜂窝自由行">马蜂窝自由行</el-radio>
              <el-radio label="去哪儿">去哪儿</el-radio>
              <el-radio label="票付通余额">票付通余额</el-radio>
              <el-radio label="无">无</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="收款账户：" prop="payAccount" label-width="140px">
            <el-input v-model="ruleForm.payAccount" placeholder="请选择" class="baseIn" :readonly="readOnly"></el-input>
            <el-button type="primary" @click="chooseFun" style="margin-left: 10px">选择</el-button>
          </el-form-item>

        </div>
        <!--分销商为：票付通余额-->
        <div v-if="PFTYE">
          <div class="stepDv">
            <el-form-item label="关联订单：" prop="payAccount" label-width="140px">
              <el-button type="primary" @click="chooseDDFun" style="margin-left: 10px">选择</el-button>
            </el-form-item>
            <el-form-item label="收款金额：" prop="payMoney" label-width="140px">
              <el-input v-model="pftForm.payMoney" placeholder="请输入" class="baseIn" disabled></el-input>
              <p style="margin: 0;color: #999;line-height: 22px;">收款金额可通过附件文档自动生成</p>
            </el-form-item>
            <el-form-item label="款项入账时间段：" prop="startTime" label-width="140px">
              <el-date-picker v-model="pftForm.startTime" type="date" placeholder="开始日期" class="start-time baseIn" :picker-options="startDatePicker"></el-date-picker>
              <span style="display: inline-block;line-height: 32px;margin:0;">--</span>
              <el-date-picker v-model="pftForm.endTime" type="date" placeholder="结束日期" class="start-time baseIn" :picker-options="endDatePicker"></el-date-picker>
              <p style="margin: 0;color: #999;line-height: 22px;">款项入账时间段可通过附件文档自动生成</p>
            </el-form-item>
            <el-form-item label="附件：" label-width="140px">
              <el-upload ref="upload2" class="upload-demo" :action="UploadUrl2()" :headers="headers" :on-success="handleSuccess2" :on-error="handleError2" :on-remove="handleRemove2" :before-remove="beforeRemove2" :on-exceed="handleExceed2" :file-list="pft_list">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </div>

          <!--<p class="stepTitle">绑定订单</p>-->
          <el-divider content-position="left">绑定订单</el-divider>
          <!--绑定订单table-->
          <div class="stepDv" style="margin-bottom: 50px;">
            <el-table ref="singleTable" :data="chooseTable" border style="width: 96%;margin: 0 auto;" :header-cell-style="getRowClass" height="700">
              <el-table-column prop="order_sn" label="订单ID" align="center" >
              </el-table-column>
              <el-table-column prop="distributor" label="分销商" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.distributor}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="product_name" label="产品名称" align="center">
              </el-table-column>
              <el-table-column prop="sale_at" label="下单时间" align="center">
              </el-table-column>
              <el-table-column prop="cost" label="费用" align="center">
                <template slot-scope="scope">
                  <span>收入:{{scope.row.income}}</span><br>
                  <span>单票成本:{{scope.row.single_cost}}</span><br>
                  <span>总成本:{{scope.row.cost}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="quantity" label="数量" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.quantity}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="" label="客人信息" align="center">
                <template slot-scope="scope">
                  <span>取票人:{{scope.row.contact_name}}</span><br>
                  <span>手机:{{scope.row.contact_phone}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="check_at" label="验证时间" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.check_at}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="pay_type" label="卖出支付方式" align="center">
                <template slot-scope="scope">
                  <p v-if="scope.row.pay_type == 1">产品自销</p>
                  <p v-if="scope.row.pay_type == 2">授信支付</p>
                  <p v-if="scope.row.pay_type == 3">微信支付</p>
                  <p v-if="scope.row.pay_type == 4">易宝云企付</p>
                  <p v-if="scope.row.pay_type == 5">余额支付</p>
                  <p v-if="scope.row.pay_type == 6">支付宝</p>
                  <p v-if="scope.row.pay_type == 7">自采</p>
                </template>
              </el-table-column>
              <el-table-column prop="import_at" label="导入时间" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.import_at}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="" label="关联产品" align="center">
                <template slot-scope="scope">
                  <p v-if="scope.row.is_relate_pro == 1">未关联产品</p>
                  <p v-if="scope.row.is_relate_pro == 2">产品名称：{{scope.row.relate_pro_name}}<br>团期计划：{{scope.row.tour_no}}</p>
                </template>
              </el-table-column>
              <el-table-column prop="create_uid" label="操作人" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.create_uid}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="money" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button size="small" type="text" style="color: red;" @click="deleteBtnGL(scope)" v-if="info == ''">删除</el-button>
                  <el-button size="small" type="text" style="color: red;" @click="deleteBtnGLEdit(scope)" v-if="info != ''">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!--分销商为：其他-->
        <div v-if="!PFTYE">
          <div class="stepDv">
            <el-form-item label="收款金额：" prop="payMoney" label-width="140px">
              <el-input v-model="ruleForm.payMoney" placeholder="请输入" class="baseIn"></el-input>
              <p style="margin: 0;color: #999;line-height: 22px;">收款金额可通过附件文档自动生成</p>
            </el-form-item>
            <el-form-item label="款项入账时间段：" prop="startTime" label-width="140px">
              <el-date-picker v-model="ruleForm.startTime" type="date" placeholder="开始日期" class="start-time baseIn" :editable="disabled" :picker-options="importStartDatePicker"></el-date-picker>
              <span style="display: inline-block;line-height: 32px;margin:0;">--</span>
              <el-date-picker v-model="ruleForm.endTime" type="date" placeholder="结束日期" class="start-time baseIn" :editable="disabled" :picker-options="importEndDatePicker"></el-date-picker>
              <p style="margin: 0;color: #999;line-height: 22px;">款项入账时间段可通过附件文档自动生成</p>
            </el-form-item>
            <el-form-item label="附件：" label-width="140px" v-if="info == ''">
              <el-upload ref="upload1" class="upload-demo" :action="UploadUrl()" :headers="headers" :on-success="handleSuccess" :on-error="handleError" :on-remove="handleRemove" :before-remove="beforeRemove" :on-exceed="handleExceed" :limit="1" :file-list="fileList">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </div>

          <!--<p class="stepTitle" v-if="showSK">收款明细</p>-->
          <el-divider content-position="left" v-if="showSK">收款明细</el-divider>

          <!--添加-->
          <div class="stepDv" style="margin-bottom: 50px;" v-if="info == ''">
            <div class="lineTitle"><i class="el-icon-info"></i>&nbsp;&nbsp;已关联&nbsp;{{totalItem}}&nbsp;项 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总计：{{totalMoney}}元  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收款入账时间段：{{startTime}}--{{endTime}}</div>
            <el-table ref="singleTable" :data="tableDataQK" border style="width: 96%;margin: 0 auto;" :header-cell-style="getRowClass" height="700">
              <el-table-column prop="1" label="入账时间" align="center">
              </el-table-column>
              <el-table-column prop="2" label="订单编号" align="center">
              </el-table-column>
              <el-table-column prop="3" label="客人名称" align="center">
              </el-table-column>
              <el-table-column prop="4" label="产品" align="center">
              </el-table-column>
              <el-table-column prop="5" label="结算金额" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row[5]}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="6" label="手续费" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row[6]}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="8" label="团号" align="center">
              </el-table-column>
              <el-table-column prop="9" label="粉联号" align="center">
              </el-table-column>
              <el-table-column prop="10" label="发票号" align="center">
              </el-table-column>
              <el-table-column prop="money" label="操作" align="center">
                <template slot-scope="scope">
                  <p v-if="scope.row[0] == '已删除'">已删除</p>
                  <el-button size="small" type="text" style="color: red;" @click="deleteBtn(scope)" v-else>删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!--编辑-->
          <div class="stepDv" style="margin-bottom: 50px;" v-if="info != '' && showSK">
            <div class="lineTitle"><i class="el-icon-info"></i>&nbsp;&nbsp;已关联&nbsp;{{totalItem}}&nbsp;项 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总计：{{totalMoney}}元  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收款入账时间段：{{startTime}}--{{endTime}}</div>
            <el-table ref="singleTable" :data="tableDataQK" border style="width: 96%;margin: 0 auto;" :header-cell-style="getRowClass" height="700">
              <el-table-column prop="rece_at" label="入账时间" align="center">
              </el-table-column>
              <el-table-column prop="order_sn" label="订单编号" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.plat_order_sn}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="guest_name" label="客人名称" align="center">
              </el-table-column>
              <el-table-column prop="product_name" label="产品" align="center">
              </el-table-column>
              <el-table-column prop="rece_money" label="结算金额" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.rece_money}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="charge" label="手续费" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.charge}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="tour_no" label="团号" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.tour_no}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="divide_connect_no" label="粉联号" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.divide_connect_no}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="invoice_no" label="发票号" align="center">
              </el-table-column>
              <el-table-column prop="money" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button size="small" type="text" style="color: green;" @click="detailEdit(scope)">编辑</el-button>
                  <el-button size="small" type="text" style="color: red;" @click="deleteBtnEdit(scope)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!--编辑，无明细有订单显示-->
          <!--<p class="stepTitle" v-if="!showSK">订单详情</p>-->
          <el-divider content-position="left" v-if="!showSK">订单详情</el-divider>
          <div class="stepDv" style="margin-bottom: 50px;" v-if="!showSK">
            <el-table ref="singleTable" :data="tableDataQK" border style="width: 96%;margin: 0 auto;" :header-cell-style="getRowClass" height="700">
              <el-table-column prop="order_sn" label="订单ID" align="center" >
              </el-table-column>
              <el-table-column prop="distributor" label="分销商" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.distributor}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="product_name" label="产品名称" align="center">
              </el-table-column>
              <el-table-column prop="type_name" label="类别" align="center">
              </el-table-column>
              <el-table-column prop="sale_at" label="下单时间" align="center" width="100">
                <template slot-scope="scope">
                  <span>{{scope.row.sale_at}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="option" label="费用" align="center">
                <template slot-scope="scope">
                  <span>收入:{{scope.row.income}}</span><br>
                  <span>单票成本:{{scope.row.single_cost}}</span><br>
                  <span>总成本:{{scope.row.cost}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="quantity" label="数量" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.quantity}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="money" label="客人信息" align="center">
                <template slot-scope="scope">
                  <span>取票人:{{scope.row.contact_name}}</span><br>
                  <span>手机:{{scope.row.contact_phone}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="check_at" label="验证时间" align="center" width="100">
                <template slot-scope="scope">
                  <span>{{scope.row.check_at}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="pay_type" label="卖出支付方式" align="center" width="100">
                <template slot-scope="scope">
                  <span>{{scope.row.pay_type_name}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="import_at" label="导入时间" align="center" width="100">
                <template slot-scope="scope">
                  <span>{{scope.row.import_at}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="tour_no" label="关联产品" align="center">
                <template slot-scope="scope">
                  <p v-if="scope.row.tour_no == ''">未关联产品</p>
                  <p v-else>产品名称：{{scope.row.product_name_por}}<br>团期计划：{{scope.row.tour_no}}</p>
                </template>
              </el-table-column>
              <el-table-column prop="create_uid" label="操作人" align="center" width="100">
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!--选择收款账户-->
        <el-dialog title="选择账户" :visible="dialogFormVisible1" width=60% @close="close" append-to-body>
          <div class="table_trip" style="width: 100%;">
            <el-table ref="singleTable" :data="tableDataZH" border style="width: 100%;margin-bottom: 28px;" :highlight-current-row="true" :header-cell-style="getRowClass">
              <el-table-column prop="cardType" label="类型" align="center" >
              </el-table-column>
              <el-table-column prop="title" label="账号名称" align="center">
              </el-table-column>
              <el-table-column prop="cardNum" label="卡号" align="center" width="70%">
              </el-table-column>
              <el-table-column prop="openingBank" label="开户行" align="center">
              </el-table-column>
              <el-table-column prop="openingName" label="开户人" align="center">
              </el-table-column>
              <el-table-column prop="option" label="操作" align="center" width="100">
                <template slot-scope="scope">
                  <el-button @click="chooseBtn(scope.row)" type="danger" size="small" class="table_details">选择</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="footer" style="text-align: right;">
            <el-button class="el-button" type="warning" @click="close">取 消</el-button>
            <!--<el-button class="el-button" type="primary" @click="">确 认</el-button>-->
          </div>
        </el-dialog>
        <!--票付通余额，关联订单-->
        <el-dialog title="关联订单" :visible="dialogFormVisible2" width=90% @close="close" append-to-body id="GLDDTable">
          <div class="table_trip" style="width: 100%;">
            <div class="lineTitle"><i class="el-icon-info"></i>&nbsp;&nbsp;已关联&nbsp;{{PFT_num}}&nbsp;项 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总计：{{PFT_money}}元  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收款入账时间段：{{PFT_start}}--{{PFT_end}}</div>
            <el-table ref="multipleTable" v-loading="loading" :data="tableDataGLDD" border style="width: 100%;margin-bottom: 28px;" height="700" :highlight-current-row="true" :header-cell-style="getRowClass" @selection-change="selectionChange" @row-click="handleRowClick">
              <el-table-column prop="id" label="" fixed type="selection"></el-table-column>
              <el-table-column prop="order_sn" label="订单ID" align="center" >
              </el-table-column>
              <el-table-column prop="distributor" label="分销商" align="center">
              </el-table-column>
              <el-table-column prop="product_name" label="产品名称" align="center">
              </el-table-column>
              <el-table-column prop="sale_at" label="下单时间" align="center" width="100">
              </el-table-column>
              <el-table-column prop="cost" label="费用" align="center">
                <template slot-scope="scope">
                  <span>收入:{{scope.row.income}}</span><br>
                  <span>单票成本:{{scope.row.single_cost}}</span><br>
                  <span>总成本:{{scope.row.cost}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="quantity" label="数量" align="center">
              </el-table-column>
              <el-table-column prop="" label="客人信息" align="center">
                <template slot-scope="scope">
                  <span>取票人:{{scope.row.contact_name}}</span><br>
                  <span>手机:{{scope.row.contact_phone}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="check_at" label="验证时间" align="center" width="100">
              </el-table-column>
              <el-table-column prop="pay_type" label="卖出支付方式" align="center">
                <template slot-scope="scope">
                  <p v-if="scope.row.pay_type == 1">产品自销</p>
                  <p v-if="scope.row.pay_type == 2">授信支付</p>
                  <p v-if="scope.row.pay_type == 3">微信支付</p>
                  <p v-if="scope.row.pay_type == 4">易宝云企付</p>
                  <p v-if="scope.row.pay_type == 5">余额支付</p>
                  <p v-if="scope.row.pay_type == 6">支付宝</p>
                  <p v-if="scope.row.pay_type == 7">自采</p>
                </template>
              </el-table-column>
              <el-table-column prop="import_at" label="导入时间" align="center" width="100">
              </el-table-column>
              <el-table-column prop="" label="关联产品" align="center">
                <template slot-scope="scope">
                  <p v-if="scope.row.is_relate_pro == 1">未关联产品</p>
                  <p v-if="scope.row.is_relate_pro == 2">产品名称：{{scope.row.relate_pro_name}}<br>团期计划：{{scope.row.tour_no}}</p>
                </template>
              </el-table-column>
              <el-table-column prop="create_uid" label="操作人" align="center">
              </el-table-column>
            </el-table>

            <div class="block" style="text-align: center;">
              <el-pagination
                @size-change="handleSizeChangeGL"
                @current-change="handleCurrentChangeGL"
                :current-page.sync="currentPageGL"
                :page-sizes="[10, 20, 50, 100]"
                :page-size= pageSizeGL
                layout="total, sizes, prev, pager, next, jumper"
                :total=pageCountGL
                background>
              </el-pagination>
            </div>

          </div>

          <div class="footer" style="text-align: right;">
            <el-button class="el-button" type="warning" @click="close">取 消</el-button>
            <el-button class="el-button" type="primary" @click="saveBtn">保 存</el-button>
          </div>
        </el-dialog>

      </el-form>
      <!--有附件上传时，收款明细编辑-->
      <el-dialog title="修改收款明细" :visible="dialogFormVisible3" width=30% @close="close" append-to-body id="edit_detail">
        <el-form :model="detailForm" :rules="detailRules" ref="ruleFormMX">
          <div>
            <el-form-item label="入账时间" prop="enterTime" label-width="120px">
              <el-date-picker v-model="detailForm.enterTime" type="date" placeholder="请选择日期" class="start-time inputWidth" :editable="disabled"></el-date-picker>
            </el-form-item>
            <el-form-item label="订单号" prop="orderNum" label-width="120px">
              <el-input v-model="detailForm.orderNum" class="inputWidth" placeholder="请输入订单号"></el-input>
            </el-form-item>
            <el-form-item label="客人名称" prop="guestName" label-width="120px">
              <el-input v-model="detailForm.guestName" class="inputWidth" placeholder="请输入客人名称"></el-input>
            </el-form-item>
            <el-form-item label="产品" prop="product" label-width="120px">
              <el-input v-model="detailForm.product" class="inputWidth" placeholder="请输入产品名称"></el-input>
            </el-form-item>
            <el-form-item label="结算金额" prop="money" label-width="120px">
              <el-input v-model="detailForm.money" class="inputWidth" placeholder="请输入结算金额" :disabled="!detailForm.canEdit"></el-input>
            </el-form-item>
            <el-form-item label="团号" prop="tour_no" label-width="120px">
              <el-input v-model="detailForm.tour_no" class="inputWidth" placeholder="请输入团号"></el-input>
            </el-form-item>
            <el-form-item label="粉联号" prop="divide_connect_no" label-width="120px">
              <el-input v-model="detailForm.divide_connect_no" class="inputWidth" placeholder="请输入粉联号"></el-input>
            </el-form-item>
            <el-form-item label="发票号" prop="invoice_no" label-width="120px">
              <el-input v-model="detailForm.invoice_no" class="inputWidth" placeholder="请输入发票号"></el-input>
            </el-form-item>
          </div>
        </el-form>

        <div class="footer" style="text-align: right;">
          <el-button class="el-button" type="warning" @click="close">取 消</el-button>
          <el-button class="el-button" type="primary" @click="detailSave">保 存</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
  import {formatDate} from '@/js/libs/publicMethod.js'
  export default {
    name: "orderEdit",
    props: {
      dialogFormVisible: false,
      info: ''
    },
    data() {
      return {
        disabled: false,
        readOnly: true,
//       基本信息
        rece_code: '',
        rece_codeEdit: '',
        ruleForm: {
          creditTime: '',
          payAccount: '',
          payAccountID: '',
          mark: '',
          distributor: '无',
          payMoney: '',
          startTime: '',
          endTime: ''
        },
        rules:{
          creditTime: [{ required: true, message: '收款时间不能为空', trigger: 'blur' }],
          payAccount: [{ required: true, message: '收款账户不能为空', trigger: 'blur' }],
          mark: [{ required: true, message: '收款详细说明不能为空', trigger: 'blur' }]
        },
        fileList: [],

//        收款账户选择
        dialogFormVisible1: false,
        tableDataZH: [],
        deleteStr: '',

//        收款明细
        tableDataQK: [],
        totalItem: '0',
        totalMoney: '',
        startTime: '',
        endTime: '',
        dialogFormVisible3: false,
        detailForm: {
          enterTime: '',
          orderNum: '',
          guestName: '',
          product: '',
          money: '',
          tour_no: '',
          divide_connect_no: '',
          invoice_no: '',
          canEdit: true,
          id: '',
          indexDetail: ''
        },
        detailRules:{
          enterTime: [{ required: true, message: '入账时间不能为空', trigger: 'blur' }],
//          orderNum: [{ required: true, message: '订单号不能为空', trigger: 'blur' }],
//          product: [{ required: true, message: '产品不能为空', trigger: 'blur' }],
          money: [
            { required: true, message: '结算金额不能为空', trigger: 'blur' },
            { pattern: /^\d+(\.\d+)?$/, message: '收款金额需为正数' }
          ]
        },

        showSK: true,

//        票付通余额
        PFTYE: false,
        tableDataGLDD: [],
        dialogFormVisible2: false,
        multipleSelection: [],
        chooseTable: [],
        loading: true,
        pageSizeGL: 10,
        pageCountGL: 0,
        currentPageGL: 1,
        pftForm: {
          payMoney: '',
          startTime: '',
          endTime: ''
        },
        pft_list: [],
        isPFT: false,

        PFT_num: 0,
        PFT_money: 0,
        PFT_start: '',
        PFT_end: '',

//        时间限制
        startDatePicker: this.beginDate(),
        endDatePicker: this.processDate(),
        importStartDatePicker: this.beginDate1(),
        importEndDatePicker: this.processDate1(),
      }
    },
    computed: {
      // 计算属性的 getter
      headers(){
          return {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
      }
    },
    watch: {
      dialogFormVisible: {
        handler: function () {
//          alert(this.dialogFormVisible);
          if(this.dialogFormVisible && this.info == ''){
            this.getCode()
          }
          if(this.info != '' && this.dialogFormVisible){
            this.loadData();
          }
        }
      }
    },
    methods: {
      // 表格头部背景颜色
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#F7F7F7;color:rgb(85, 85, 85);'
        } else {
          return ''
        }
      },
//      关闭添加/编辑弹窗
      closeAdd(){
//        if(this.info != ''){
          this.ruleForm = {
            creditTime: '',
            payAccount: '',
            payAccountID: '',
            mark: '',
            distributor: '无',
            payMoney: '',
            startTime: '',
            endTime: ''
          };
          this.showSK = true;
          this.fileList = [];
          this.deleteStr = '';
          this.tableDataQK = [];
          this.totalItem = '0';
          this.totalMoney = '';
          this.startTime = '';
          this.endTime = '';
          this.PFTYE = false;
          this.tableDataGLDD = [];
          this.dialogFormVisible2 = false;
          this.multipleSelection = [];
          this.chooseTable = [];
          this.loading = true;
          this.pageSizeGL = 10;
          this.pageCountGL = 0;
          this.currentPageGL = 1;
          this.pftForm = {
            payMoney: '',
            startTime: '',
            endTime: ''
          };
          this.pft_list = [];

          this.PFT_num = 0;
          this.PFT_money = 0;
          this.PFT_start = '';
          this.PFT_end = '';
//        }
        this.$emit('close', false);
      },
      radioChange(val){
        if(val == '票付通余额'){
          this.PFTYE = true;
        }else{
          this.PFTYE = false;
        }
      },
//      票付通余额，关联订单
      chooseDDFun(){
        let orderStr = '';
        if(this.chooseTable.length > 0){
          this.chooseTable.forEach(function (item, index, arr) {
            orderStr += item.order_sn + ','
          });
          orderStr = orderStr.substr(0, orderStr.length - 1);
        }
        this.getListRece(orderStr);
        this.dialogFormVisible2 = true;
      },
      selectionChange(val) {
        const that = this;
//        console.log(val);
        this.multipleSelection = val;
        if(this.multipleSelection.length != 0){
          let start = this.multipleSelection[0].sale_at;
          let end = this.multipleSelection[0].sale_at;
          let totalMoney = 0;
          this.multipleSelection.forEach(function (item, index, arr) {
            if(new Date(Date.parse(start)) > new Date(Date.parse(item.sale_at))){
              start = item.sale_at;
            }
            if(new Date(Date.parse(end)) < new Date(Date.parse(item.sale_at))){
              end = item.sale_at;
            }
            totalMoney += parseFloat(item.income);
//                console.log(totalMoney);
          });
          that.PFT_num = this.multipleSelection.length;
          that.PFT_money = totalMoney.toFixed(2);
          that.PFT_start = formatDate(new Date(Date.parse(start))).split(" ")[0];
          that.PFT_end = formatDate(new Date(Date.parse(end))).split(" ")[0];
        }
      },
      handleRowClick(row, column, event){
//        console.log(this.$refs.multipleTable.selection);
        this.$refs.multipleTable.toggleRowSelection(row);
      },
      saveBtn(){
        let table = [];
        if(this.chooseTable != ''){
          table = this.chooseTable;
        }
        this.chooseTable = table.concat(this.multipleSelection);
        if(this.chooseTable.length != 0){
          let start = this.chooseTable[0].sale_at;
          let end = this.chooseTable[0].sale_at;
          let totalMoney = 0;
          this.chooseTable.forEach(function (item, index, arr) {
            if(new Date(Date.parse(start)) > new Date(Date.parse(item.sale_at))){
              start = item.sale_at;
            }
            if(new Date(Date.parse(end)) < new Date(Date.parse(item.sale_at))){
              end = item.sale_at;
            }
            totalMoney += parseFloat(item.income);
//                console.log(totalMoney);
          });
          this.pftForm = {
            payMoney: totalMoney.toFixed(2),
            startTime: formatDate(new Date(Date.parse(start))).split(" ")[0],
            endTime: formatDate(new Date(Date.parse(end))).split(" ")[0]
          };
        }
        this.close();
      },
      deleteBtnGL(scope){
        this.chooseTable.splice(scope.$index,1);
        if(this.chooseTable.length != 0){
          let start = this.chooseTable[0].sale_at;
          let end = this.chooseTable[0].sale_at;
          let totalMoney = 0;
          this.chooseTable.forEach(function (item, index, arr) {
            if(new Date(Date.parse(start)) > new Date(Date.parse(item.sale_at))){
              start = item.sale_at;
            }
            if(new Date(Date.parse(end)) < new Date(Date.parse(item.sale_at))){
              end = item.sale_at;
            }
            totalMoney += parseFloat(item.income);
//                console.log(totalMoney);
          });
          this.pftForm = {
            payMoney: totalMoney.toFixed(2),
            startTime: formatDate(new Date(Date.parse(start))).split(" ")[0],
            endTime: formatDate(new Date(Date.parse(end))).split(" ")[0]
          };
        }
      },
      deleteBtnGLEdit(scope){
//        alert(scope.row.id);
        const that = this;
//        console.log(scope.row);
        if(scope.row.id){
          this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/receivables/receivables/deldetails", {
            "id": scope.row.id
          }).then(function(response) {
            console.log('删除',response);
            if(response.data.code == 200){
              that.chooseTable.splice(scope.$index,1);
              if(that.chooseTable.length != 0){
                let start = that.chooseTable[0].sale_at;
                let end = that.chooseTable[0].sale_at;
                let totalMoney = 0;
                that.chooseTable.forEach(function (item, index, arr) {
                  if(new Date(Date.parse(start)) > new Date(Date.parse(item.sale_at))){
                    start = item.sale_at;
                  }
                  if(new Date(Date.parse(end)) < new Date(Date.parse(item.sale_at))){
                    end = item.sale_at;
                  }
                  totalMoney += parseFloat(item.income);
//                console.log(totalMoney);
                });
                that.pftForm = {
                  payMoney: totalMoney.toFixed(2),
                  startTime: formatDate(new Date(Date.parse(start))).split(" ")[0],
                  endTime: formatDate(new Date(Date.parse(end))).split(" ")[0]
                };
              }else{
                that.pftForm = {
                  payMoney: 0,
                  startTime: '',
                  endTime: ''
                };
              }
            }else{
              if(response.data.message){
                that.$message.warning(response.data.message);
              }else{
                that.$message.warning('提交失败');
              }
            }
          }).catch(function(obj) {
            console.log(obj)
          });
        }else{
          this.deleteBtnGL(scope);
        }

      },
//      添加
      cancelBtnTJ(){
        this.$confirm("是否取消本次添加?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$message.success("已取消添加");
          this.closeAdd();
        }).catch(() => {

        });
      },
      submitBtnTJ(formName){

        const that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
//            alert(this.totalMoney != '');
            if(this.totalMoney == '' && this.startTime == ''){
//              alert("均为空");
              that.subFun();

            }else if(this.totalMoney != '' && this.startTime != ''){
//              alert("均不为空");
              if(parseFloat(this.ruleForm.payMoney).toFixed(2) != parseFloat(this.totalMoney).toFixed(2)) {
//                alert('金额不等');
                this.$confirm("收款金额和全部收款明细结算金额总计不符是否继续添加?", "提示", {
                  confirmButtonText: "添加",
                  cancelButtonText: "取消",
                  type: "warning"
                }).then(() => {
                  let start = this.ruleForm.startTime, end = this.ruleForm.endTime;
                  const reg = /^(\d{4})(-)(\d{2})(-)(\d{2})/;
                  if (!reg.test(start)) {
                    start = formatDate(this.ruleForm.startTime);
                  }
                  if (!reg.test(end)) {
                    end = formatDate(this.ruleForm.endTime);
                  }
                  if (start.split(' ')[0] != this.startTime || end.split(' ')[0] != this.endTime) {
                    this.$confirm("款项入账时间段和全部收款明细入账时间区间不符，是否继续添加?", "提示", {
                      confirmButtonText: "添加",
                      cancelButtonText: "取消",
                      type: "warning"
                    }).then(() => {
                      that.subFun();
                    }).catch(() => {

                    });
                  }else{
                    that.subFun();
                  }
                }).catch(() => {

                });
              }else{
//                alert('金额相等');
                let start = this.ruleForm.startTime, end = this.ruleForm.endTime;
                const reg = /^(\d{4})(-)(\d{2})(-)(\d{2})/;
                if (!reg.test(start)) {
                  start = formatDate(this.ruleForm.startTime);
                }
                if (!reg.test(end)) {
                  end = formatDate(this.ruleForm.endTime);
                }
                if (start.split(' ')[0] != this.startTime || end.split(' ')[0] != this.endTime) {
                  this.$confirm("款项入账时间段和全部收款明细入账时间区间不符，是否继续添加?", "提示", {
                    confirmButtonText: "添加",
                    cancelButtonText: "取消",
                    type: "warning"
                  }).then(() => {
                    that.subFun();
                  }).catch(() => {

                  });
                }else{
                  that.subFun();
                }
              }
            }
          }
        });
      },
      subFun(){
        const that = this;
        let fileArr = [],money = '',startTime = '',endTime = '', flag = true;
        const reg = /^(\d{4})(-)(\d{2})(-)(\d{2})/;
        if(this.PFTYE){
          if(this.pft_list.length != 0){
            this.pft_list.forEach(function (item, index, arr) {
//              console.log(item);
              let file = {
                name: item.name,
                url: item.response.data.url
              };
              fileArr.push(file);
            });
          }
          if(this.chooseTable.length == 0){
            that.$message.warning('关联订单不能为空');
            flag = false;
            return;
          }
          if(this.pftForm.payMoney == ''){
            that.$message.warning('收款金额不能为空');
            flag = false;
            return;
          }else{
            money = this.pftForm.payMoney;
          }
          if(this.pftForm.startTime == ''){
            that.$message.warning('款项入账时间段不能为空');
            flag = false;
            return;
          }else{
            if (!reg.test(this.pftForm.startTime)) {
              startTime = formatDate(this.pftForm.startTime);
            }else{
              startTime = this.pftForm.startTime;
            }
          }
          if(this.pftForm.endTime == ''){
            that.$message.warning('款项入账时间段不能为空');
            flag = false;
            return;
          }else{
            if (!reg.test(this.pftForm.endTime)) {
              endTime = formatDate(this.pftForm.endTime);
            }else{
              endTime = this.pftForm.endTime;
            }
//            endTime = this.pftForm.endTime;
          }
        }else{
          if(this.fileList.length != 0 && this.tableDataQK != []){
            fileArr.push({
              name: this.fileList[0].name,
              url: this.fileList[0].response.data.file_url
            });
          }else{
            fileArr = [];
          }
          if(this.ruleForm.payMoney == ''){
            that.$message.warning('收款金额不能为空');
            flag = false;
            return;
          }else{
            money = this.ruleForm.payMoney;
          }
          if(this.ruleForm.startTime == ''){
            that.$message.warning('款项入账时间段不能为空');
            flag = false;
            return;
          }else{
            if (!reg.test(this.ruleForm.startTime)) {
              startTime = formatDate(this.ruleForm.startTime);
            }else{
              startTime = this.ruleForm.startTime;
            }
//            startTime = this.ruleForm.startTime;
          }
          if(this.ruleForm.endTime == ''){
            that.$message.warning('款项入账时间段不能为空');
            flag = false;
            return;
          }else{
            if (!reg.test(this.ruleForm.endTime)) {
              endTime = formatDate(this.ruleForm.endTime);
            }else{
              endTime = this.ruleForm.endTime;
            }
//            endTime = this.ruleForm.endTime;
          }
        }
        let getOrder = '';
        this.chooseTable.forEach(function (item, index, arr) {
          getOrder += item.order_sn + ',';
//          alert(getOrder);
        });
        getOrder = getOrder.substr(0, getOrder.length - 1);
//        alert(getOrder);
        if (!reg.test(this.ruleForm.creditTime)) {
          this.ruleForm.creditTime = formatDate(this.ruleForm.creditTime);
        }
//        alert(this.ruleForm.creditTime);
//        alert(startTime);
//        alert(endTime);
        let data;
        if(this.deleteStr == ''){
          data = {
            "rece_code":this.rece_code,
            "explain":this.ruleForm.mark,
            "receivables_at":this.ruleForm.creditTime,
            "distributor":this.ruleForm.distributor,
            "account_id":this.ruleForm.payAccountID,
            "rece_money":money,
            "rece_start":startTime,
            "rece_end":endTime,
            "file":fileArr,
            "org_id":sessionStorage.getItem('orgID'),
            "create_uid":sessionStorage.getItem('id'),
            "get_order":getOrder
          }
        }else{
          this.deleteStr = this.deleteStr.substr(0, this.deleteStr.length - 1);
          data = {
            "rece_code":this.rece_code,
            "explain":this.ruleForm.mark,
            "receivables_at":this.ruleForm.creditTime,
            "distributor":this.ruleForm.distributor,
            "account_id":this.ruleForm.payAccountID,
            "rece_money":money,
            "rece_start":startTime,
            "rece_end":endTime,
            "file":fileArr,
            "org_id":sessionStorage.getItem('orgID'),
            "create_uid":sessionStorage.getItem('id'),
            "del_order":this.deleteStr,
            "get_order":getOrder
          }
        }
        if(flag){
          this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/receivables/receivables/addrece", data, ).then(function(response) {
            console.log(response);
            if (response.data.code == '200') {
              that.ruleForm = {
                creditTime: '',
                payAccount: '',
                payAccountID: '',
                mark: '',
                distributor: '无',
                payMoney: '',
                startTime: '',
                endTime: ''
              };
              that.fileList = [];
              that.deleteStr = '';
              that.tableDataQK = [];
              that.totalItem = '0';
              that.totalMoney = '';
              that.startTime = '';
              that.endTime = '';
              that.$message({
                type: 'success',
                message: '添加成功!'
              });
              that.closeAdd();
            } else {
              if(response.data.message){
                that.$message.warning(response.data.message);
              }else{
                that.$message.warning('提交失败');
              }
            }
          }).catch(function(error) {
            console.log(error);
          });
        }
      },
//      修改
      cancelBtnXG(){

        this.$confirm("是否取消本次编辑?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$message.success("已取消编辑");
          this.closeAdd();
        }).catch(() => {

        });
      },
      submitBtnXG(formName){
        const that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.PFTYE){
              that.subFunXG();
            }else{
              if(!this.showSK){
//                alert("无明细修改");
                let Stime = '', Etime = '';
                if(this.ruleForm.startTime.toString().split('-')[1]){
                  Stime = this.ruleForm.startTime.split(" ")[0];
                }else{
                  Stime = formatDate(this.ruleForm.startTime).split(" ")[0];
                }
                if(this.ruleForm.endTime.toString().split('-')[1]){
                  Etime = this.ruleForm.endTime.split(" ")[0];
                }else{
                  Etime = formatDate(this.ruleForm.endTime).split(" ")[0];
                }
                if(this.tableDataQK.length > 0){
                  let sale_at = this.tableDataQK[0].sale_at.split(" ")[0];

                  if(new Date(Date.parse(Stime)) > new Date(Date.parse(sale_at)) || new Date(Date.parse(Etime)) < new Date(Date.parse(sale_at))){
                    this.$confirm("收款入账时间设置错误，无法修改", "提示", {
                      confirmButtonText: "好的",
                      cancelButtonText: "取消",
                      type: "warning"
                    }).then(() => {

                    }).catch(() => {

                    });
                  }else{
                    if(parseFloat(this.ruleForm.payMoney) < parseFloat(this.tableDataQK[0].income)){
                      this.$confirm("收款金额小于收入金额，无法修改", "提示", {
                        confirmButtonText: "好的",
                        cancelButtonText: "取消",
                        type: "warning"
                      }).then(() => {

                      }).catch(() => {

                      });
                    }else{
                      that.subFunXG();
                    }

                  }
                }else{
                  that.subFunXG();
                }

              }else if(this.totalMoney != '' && this.startTime != ''){
//              alert("均不为空");
                if(parseFloat(this.ruleForm.payMoney).toFixed(2) != parseFloat(this.totalMoney).toFixed(2)) {
//                alert('金额不等');
                  this.$confirm("收款金额和全部收款明细结算金额总计不符是否继续添加?", "提示", {
                    confirmButtonText: "添加",
                    cancelButtonText: "取消",
                    type: "warning"
                  }).then(() => {
                    let start = this.ruleForm.startTime, end = this.ruleForm.endTime;
                    const reg = /^(\d{4})(-)(\d{2})(-)(\d{2})/;
                    if (!reg.test(start)) {
                      start = formatDate(this.ruleForm.startTime);
                    }
                    if (!reg.test(end)) {
                      end = formatDate(this.ruleForm.endTime);
                    }

                    if (start.split(' ')[0] != this.startTime || end.split(' ')[0] != this.endTime) {
                      this.$confirm("款项入账时间段和全部收款明细入账时间区间不符，是否继续添加?", "提示", {
                        confirmButtonText: "添加",
                        cancelButtonText: "取消",
                        type: "warning"
                      }).then(() => {
                        that.subFunXG();
                      }).catch(() => {

                      });
                    }else{
                      that.subFunXG();
                    }
                  }).catch(() => {

                  });
                }else{
//                alert('金额相等');
                  let start = this.ruleForm.startTime, end = this.ruleForm.endTime;
                  const reg = /^(\d{4})(-)(\d{2})(-)(\d{2})/;
                  if (!reg.test(start)) {
                    start = formatDate(this.ruleForm.startTime);
                  }
                  if (!reg.test(end)) {
                    end = formatDate(this.ruleForm.endTime);
                  }

//                  alert(start.split(' ')[0] == this.startTime && end.split(' ')[0] == this.endTime);
                  if (start.split(' ')[0] != this.startTime || end.split(' ')[0] != this.endTime) {
                    this.$confirm("款项入账时间段和全部收款明细入账时间区间不符，是否继续添加?", "提示", {
                      confirmButtonText: "添加",
                      cancelButtonText: "取消",
                      type: "warning"
                    }).then(() => {
                      that.subFunXG();
                    }).catch(() => {

                    });
                  }else{
                    that.subFunXG();
                  }
                }
              }
            }

          }
        });
      },
      subFunXG(){
        const that = this;
        const reg = /^(\d{4})(-)(\d{2})(-)(\d{2})/;
        let fileArr = [],money = '',startTime = '',endTime = '',file = '',flag = true;
        if(this.PFTYE){
          if(this.pft_list.length != 0){
            this.pft_list.forEach(function (item, index, arr) {
              console.log(item);
              if(item.response){
                file = {
                  name: item.name,
                  url: item.response.data.url
                };
              }else{
                file = {
                  name: item.name,
                  url: item.url
                };
              }
              fileArr.push(file);
            });
          }
          if(this.chooseTable.length == 0){
            that.$message.warning('关联订单不能为空');
            flag = false;
            return;
          }
          if(this.pftForm.payMoney == ''){
            that.$message.warning('收款金额不能为空');
            flag = false;
            return;
          }else{
            money = this.pftForm.payMoney;
          }
          if(this.pftForm.startTime == ''){
            that.$message.warning('款项入账时间段不能为空');
            flag = false;
            return;
          }else{
//            startTime = this.pftForm.startTime;
            if (!reg.test(this.pftForm.startTime)) {
              startTime = formatDate(this.pftForm.startTime);
            }else{
              startTime = this.pftForm.startTime;
            }
          }
          if(this.pftForm.endTime == ''){
            that.$message.warning('款项入账时间段不能为空');
            flag = false;
            return;
          }else{
            if (!reg.test(this.pftForm.endTime)) {
              endTime = formatDate(this.pftForm.endTime);
            }else{
              endTime = this.pftForm.endTime;
            }
//            endTime = this.pftForm.endTime;
          }
        }else{
          if(this.ruleForm.payMoney == ''){
            that.$message.warning('收款金额不能为空');
            flag = false;
            return;
          }else{
            money = this.ruleForm.payMoney;
          }
          if(this.ruleForm.startTime == ''){
            that.$message.warning('款项入账时间段不能为空');
            flag = false;
            return;
          }else{
//            startTime = this.ruleForm.startTime;
            if (!reg.test(this.ruleForm.startTime)) {
              startTime = formatDate(this.ruleForm.startTime);
            }else{
              startTime = this.ruleForm.startTime;
            }
          }
          if(this.ruleForm.endTime == ''){
            that.$message.warning('款项入账时间段不能为空');
            flag = false;
            return;
          }else{
//            endTime = this.ruleForm.endTime;
            if (!reg.test(this.ruleForm.endTime)) {
              endTime = formatDate(this.ruleForm.endTime);
            }else{
              endTime = this.ruleForm.endTime;
            }
          }
        }
//        alert(getOrder);
        if(flag){
          let getOrder = '';
          this.chooseTable.forEach(function (item, index, arr) {
            if(item.id){

            }else{
              getOrder += item.order_sn + ',';
            }
          });
          if (!reg.test(this.ruleForm.creditTime)) {
            this.ruleForm.creditTime = formatDate(this.ruleForm.creditTime);
          }
          getOrder = getOrder.substr(0, getOrder.length - 1);
          this.deleteStr = this.deleteStr.substr(0, this.deleteStr.length - 1);
          this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/receivables/receivables/updrece", {
            "id": this.info,
            "rece_code": this.rece_codeEdit,
            "explain": this.ruleForm.mark,
            "receivables_at": this.ruleForm.creditTime,
            "distributor": this.ruleForm.distributor,
            "account_id": this.ruleForm.payAccountID,
            "rece_money":money,
            "rece_start":startTime,
            "rece_end":endTime,
            "file":fileArr,
            "org_id": sessionStorage.getItem('orgID'),
            "create_uid": sessionStorage.getItem('id'),
            "detailed_id": this.deleteStr,
            "get_order": getOrder
          }, ).then(function(response) {
            console.log(response);
            if (response.data.code == '200') {
              that.ruleForm = {
                creditTime: '',
                payAccount: '',
                payAccountID: '',
                mark: '',
                distributor: '无',
                payMoney: '',
                startTime: '',
                endTime: ''
              };
              that.fileList = [];
              that.deleteStr = '';
              that.tableDataQK = [];
              that.totalItem = '0';
              that.totalMoney = '';
              that.startTime = '';
              that.endTime = '';
              that.$message({
                type: 'success',
                message: '修改成功!'
              });
              that.closeAdd();
            } else {
              if(response.data.message){
                that.$message.warning(response.data.message);
              }else{
                that.$message.warning('提交失败');
              }
            }
          }).catch(function(error) {
            console.log(error);
          });
        }
      },

//      选择收款账户
      chooseFun(){
        const that = this;
        this.dialogFormVisible1 = true;
        this.$http.post(
          this.GLOBAL.serverSrc + "/finance/collectionaccount/api/list",
          {
            "object": {
              "isDeleted": 0
            },
          },)
          .then(function (obj) {
            console.log(obj);
            if(obj.data.isSuccess){
              that.tableDataZH = obj.data.objects;
            }else{
              that.$message.warning("加载账户信息失败");
            }
          })
          .catch(function (obj) {
            console.log(obj)
          })
      },
      close(){
        this.dialogFormVisible1 = false;
        this.dialogFormVisible2 = false;
        this.dialogFormVisible3 = false;
        this.loading = true;
        this.PFT_num = 0;
        this.PFT_money = 0;
        this.PFT_start = '';
        this.PFT_end = '';
      },
      chooseBtn(row){
        this.ruleForm.payAccount = row.title;
        this.ruleForm.payAccountID = row.id;
        this.close();
      },

//      上传凭证
      UploadUrl(){
        return this.GLOBAL.serverSrcPhp + '/api/v1/receivables/receivables/files';
      },
      handleSuccess(response, file, fileList){
        console.log(file);
        console.log(fileList);
        console.log('response',response);
        if(response.code == 200){
          this.fileList = fileList;
          this.tableDataQK = file.response.data.list;
          this.totalItem = file.response.data.list.length;
          this.totalMoney = file.response.data.money;
          this.ruleForm.payMoney = file.response.data.money;
          this.ruleForm.mark = file.response.data.title;
          this.startTime = formatDate(new Date(file.response.data.start*1000));
          this.startTime = this.startTime.split(' ')[0];
          this.endTime = formatDate(new Date(file.response.data.end*1000));
          this.endTime = this.endTime.split(' ')[0];
          this.ruleForm.startTime = formatDate(new Date(file.response.data.start*1000));
          this.ruleForm.endTime = formatDate(new Date(file.response.data.end*1000));
          this.tableDataQK.forEach(function (item, index, arr) {
            item[1] = formatDate(new Date(item[1]*1000));
          })
        }else{
          if(response.message){
            this.$message.warning(response.message);
          }else{
            this.$message.warning('文件上传失败');
          }
//          this.fileList = {};
          this.$refs.upload1.clearFiles();
        }
      },
      handleError(err, file, fileList){
        this.$message.warning(`文件上传失败，请重新上传！`);
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
        this.tableDataQK = [];
        this.totalItem = '';
        this.totalMoney = '';
        this.ruleForm.payMoney = '';
        this.startTime = '';
        this.endTime = '';
        this.ruleForm.startTime = '';
        this.ruleForm.endTime = '';
        this.fileList = [];
      },
      handleExceed(files, fileList) {
        this.$message.warning(`平台订单只支持一个附件上传！`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
//      上传票付通余额凭证
      UploadUrl2(){
        return this.GLOBAL.serverSrcPhp + '/api/v1/receivables/receivables/fzfilesfiles';
      },
      handleSuccess2(response, file, fileList){
        console.log(file);
        console.log(fileList);
        console.log('response',response);
        if(response.code == 200){
          this.pft_list = fileList;
//          this.tableDataQK = file.response.data.list;
//          this.totalItem = file.response.data.list.length;
//          this.totalMoney = file.response.data.money;
////          this.ruleForm.payMoney = file.response.data.money;
//          this.startTime = formatDate(new Date(file.response.data.start*1000));
//          this.endTime = formatDate(new Date(file.response.data.end*1000));
////          this.ruleForm.startTime = formatDate(new Date(file.response.data.start*1000));
////          this.ruleForm.endTime = formatDate(new Date(file.response.data.end*1000));
//          this.tableDataQK.forEach(function (item, index, arr) {
//            item[1] = formatDate(new Date(item[1]*1000));
//          })
        }else{
          if(response.message){
            this.$message.warning(response.message);
          }else{
            this.$message.warning('文件上传失败');
          }
//          this.fileList = {};
          this.$refs.upload2.clearFiles();
        }
      },
      handleError2(err, file, fileList){
        this.$message.warning(`文件上传失败，请重新上传！`);
      },
      handleRemove2(file, fileList) {
        console.log(file, fileList);
//        this.tableDataQK = [];
//        this.totalItem = '';
//        this.totalMoney = '';
//        this.ruleForm.payMoney = '';
//        this.startTime = '';
//        this.endTime = '';
//        this.ruleForm.startTime = '';
//        this.ruleForm.endTime = '';
      },
      handleExceed2(files, fileList) {
        this.$message.warning(`平台订单只支持一个附件上传！`);
      },
      beforeRemove2(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
//      明细删除
      deleteBtn(scope){
        const that = this;
        this.$confirm("是否删除此明细?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          console.log(scope.row[2]+'======'+scope.$index);
//          that.tableDataQK.splice(scope.$index,1);
          this.$set(that.tableDataQK[scope.$index],'0','已删除');
          that.deleteStr += scope.$index + ',';
          let num = parseInt(that.totalItem);
          num--;
          that.totalItem = num;
//          console.log(num);
          let totalMoney = that.totalMoney;
          totalMoney = parseFloat(totalMoney) - parseFloat(scope.row[5]);
          that.totalMoney = totalMoney.toFixed(2);
//          console.log(parseFloat(totalMoney),parseFloat(scope.row[5]),parseFloat(totalMoney)-parseFloat(scope.row[5]));
          let start = that.tableDataQK[0][1];
          let end = that.tableDataQK[0][1];
          that.tableDataQK.forEach(function (item, index, arr) {
            if(item[0] != '已删除'){
              if(new Date(Date.parse(start)) > new Date(Date.parse(item[1]))){
                start = item[1];
              }
              if(new Date(Date.parse(end)) < new Date(Date.parse(item[1]))){
                end = item[1];
              }
            }
          });
//          console.log(totalMoney.toFixed(2),start,end);
          that.totalMoney = totalMoney.toFixed(2);
          that.startTime = start.split(' ')[0];
          that.endTime = end.split(' ')[0];
//          console.log(that.deleteStr);
        }).catch(() => {

        });
      },
      deleteBtnEdit(scope){
        const that = this;
        this.$confirm("是否删除此明细?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
//          console.log(scope.row[2]+'======'+scope.$index);
          this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/receivables/receivables/deldetails", {
            "id": scope.row.id
          }, ).then(function(response) {
            console.log(response);
            if (response.data.code == '200') {
              that.$message.success("删除成功~");
              that.tableDataQK.splice(scope.$index,1);
              that.deleteStr += scope.row.id + ',';
              let num = parseInt(that.totalItem);
              num--;
              that.totalItem = num;
//          console.log(num);
              let totalMoney = 0;
//             totalMoney = parseFloat(totalMoney) - parseFloat(scope.row[rece_money]);
              that.totalMoney = totalMoney.toFixed(2);
//          console.log(parseFloat(totalMoney),parseFloat(scope.row[5]),parseFloat(totalMoney)-parseFloat(scope.row[5]));
              let start = that.tableDataQK[0].rece_at;
              let end = that.tableDataQK[0].rece_at;
              that.tableDataQK.forEach(function (item, index, arr) {
                if(new Date(Date.parse(start)) > new Date(Date.parse(item.rece_at))){
                  start = item.rece_at;
                }
                if(new Date(Date.parse(end)) < new Date(Date.parse(item.rece_at))){
                  end = item.rece_at;
                }
                totalMoney += parseFloat(item.rece_money);
              });
//          console.log(totalMoney.toFixed(2),start,end);
              that.totalMoney = totalMoney.toFixed(2);
              that.startTime = start;
              that.endTime = end;
              console.log(that.deleteStr);
            } else {
              if(response.data.message){
                that.$message.warning(response.data.message);
              }else{
                that.$message.warning("失败~");
              }

            }
          }).catch(function(error) {
            console.log(error);
          });

        }).catch(() => {

        });
      },
//      明细编辑
      detailEdit(scope){
//        alert(scope.row.reco_status);
        let flagEdit;
        if(scope.row.reco_status == 1){
          flagEdit = false;
        }else{
          flagEdit = true;
        }
        this.detailForm = {
          enterTime: scope.row.rece_at,
          orderNum: scope.row.plat_order_sn,
          guestName: scope.row.guest_name,
          product: scope.row.product_name,
          money: scope.row.rece_money,
          tour_no: scope.row.tour_no,
          divide_connect_no: scope.row.divide_connect_no,
          invoice_no: scope.row.invoice_no,
          canEdit: flagEdit,
          id: scope.row.id,
          indexDetail: scope.$index
        };
        this.dialogFormVisible3 = true;
      },
      detailSave(){
//        alert(this.detailForm.money != this.tableDataQK[this.detailForm.indexDetail].rece_money);
        if(parseFloat(this.detailForm.money).toFixed(2) != parseFloat(this.tableDataQK[this.detailForm.indexDetail].rece_money).toFixed(2) && this.tableDataQK[this.detailForm.indexDetail].order_sn != ''){
          this.$confirm("结算金额同时修改关联订单的收入，是否修改", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.saveFun();
          }).catch(() => {

          });
        }else{
          this.saveFun();
        }


      },
      saveFun(){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/receivables/receivables/upddetailed", {
          "id": this.detailForm.id,
          "plat_order_sn": this.detailForm.orderNum,
          "product_name": this.detailForm.product,
          "rece_money": this.detailForm.money,
          "rece_at": this.detailForm.enterTime,
          "guest_name": this.detailForm.guestName,
          "tour_no": this.detailForm.tour_no,
          "divide_connect_no": this.detailForm.divide_connect_no,
          "invoice_no": this.detailForm.invoice_no
        }, ).then(function(response) {
//          console.log(response);
          if (response.data.code == '200') {
//            console.log('that.detailForm.enterTime', that.detailForm.enterTime);

            if(that.detailForm.enterTime.toString().split('-')[1]){
              that.tableDataQK[that.detailForm.indexDetail].rece_at = that.detailForm.enterTime;
            }else{
              that.tableDataQK[that.detailForm.indexDetail].rece_at = formatDate(that.detailForm.enterTime).split(" ")[0];
            }

            that.tableDataQK[that.detailForm.indexDetail].plat_order_sn = that.detailForm.orderNum;
            that.tableDataQK[that.detailForm.indexDetail].guest_name = that.detailForm.guestName;
            that.tableDataQK[that.detailForm.indexDetail].product_name = that.detailForm.product;
            that.tableDataQK[that.detailForm.indexDetail].rece_money = that.detailForm.money;
            that.tableDataQK[that.detailForm.indexDetail].tour_no = that.detailForm.tour_no;
            that.tableDataQK[that.detailForm.indexDetail].divide_connect_no = that.detailForm.divide_connect_no;
            that.tableDataQK[that.detailForm.indexDetail].invoice_no = that.detailForm.invoice_no;
            that.detailForm = {
              enterTime: '',
              orderNum: '',
              guestName: '',
              product: '',
              money: '',
              tour_no: '',
              divide_connect_no: '',
              invoice_no: '',
              canEdit: true,
              id: '',
              indexDetail: ''
            };

            let start = that.tableDataQK[0].rece_at;
            let end = that.tableDataQK[0].rece_at;
            let totalMoney = 0;
            that.tableDataQK.forEach(function (item, index, arr) {
              if(new Date(Date.parse(start)) > new Date(Date.parse(item.rece_at))){
                start = item.rece_at;
              }
              if(new Date(Date.parse(end)) < new Date(Date.parse(item.rece_at))){
                end = item.rece_at;
              }
              totalMoney += parseFloat(item.rece_money);
//              console.log(totalMoney);
            });

            that.totalMoney = totalMoney.toFixed(2);
            that.startTime = start;
            that.endTime = end;

            that.$message({
              type: 'success',
              message: '修改成功!'
            });
            that.close();
          } else {
            if(response.data.message){
              that.$message.warning(response.data.message);
            }else{
              that.$message.warning('提交失败');
            }
          }
        }).catch(function(error) {
          console.log(error);
        });
      },

      getCode(){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrc + "/ong/api/receivable/get", {},
          {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }).then(function(obj) {
          console.log(obj);
          if(obj.data.isSuccess){
            that.rece_code = obj.data.object;
          }else{
            if(obj.data.result.message){
              that.$message.warning(obj.data.result.message);
            }else{
              that.$message.warning("获取收款编码失败~");
            }

          }
        }).catch(function(obj) {
          that.$message.warning("获取收款编码失败~");
          console.log(obj)
        });
      },
      loadData(){
//        console.log(this.info);
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/receivables/receivables/receive", {
          "id": this.info
        }, ).then(function(response) {
          console.log(response);
          if (response.data.code == '200') {
            that.rece_codeEdit = response.data.data.rece_code;
            response.data.data.receivables_at = formatDate(new Date(response.data.data.receivables_at*1000));
            response.data.data.rece_start = formatDate(new Date(response.data.data.rece_start*1000));
            response.data.data.rece_end = formatDate(new Date(response.data.data.rece_end*1000));
            that.ruleForm = {
              creditTime: response.data.data.receivables_at,
              payAccount: response.data.data.account_id,
              payAccountID: response.data.data.account_id,
              mark: response.data.data.explain,
              distributor: response.data.data.distributor,
              payMoney: response.data.data.rece_money,
              startTime: response.data.data.rece_start,
              endTime: response.data.data.rece_end
            };
            if(that.ruleForm.distributor == '票付通余额'){
//              console.log('票付通余额');
              that.isPFT = true;
              that.PFTYE = true;
              if(response.data.data.list != ''){
                that.chooseTable = response.data.data.list;
//                console.log(that.chooseTable);
                let start = formatDate(new Date(that.chooseTable[0].sale_at*1000)).split(" ")[0];
                let end = formatDate(new Date(that.chooseTable[0].sale_at*1000)).split(" ")[0];
                let totalMoney = 0;
                that.chooseTable.forEach(function (item, index, arr) {
                  item.sale_at = formatDate(new Date(item.sale_at*1000));
//                  item.sale_at = item.sale_at.split(" ")[0];
                  item.check_at = formatDate(new Date(item.check_at*1000));
//                  item.check_at = item.check_at.split(" ")[0];
                  item.import_at = formatDate(new Date(item.import_at*1000));
//                  item.import_at = item.import_at.split(" ")[0];
                  if(new Date(Date.parse(start)) > new Date(Date.parse(item.sale_at))){
                    start = item.sale_at;
                  }
                  if(new Date(Date.parse(end)) < new Date(Date.parse(item.sale_at))){
                    end = item.sale_at;
                  }
                  totalMoney += parseFloat(item.income);
//                console.log(totalMoney);
                  that.$http.post(that.GLOBAL.serverSrc + "/org/api/userget", {
                    "id": item.create_uid
                  },{
                    headers: {
                      'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    }
                  }).then(function(response) {

                    if (response.data.isSuccess) {
                      item.create_uid = response.data.object.name
                    } else {
                      that.$message.warning("加载数据失败~");
                    }
                  }).catch(function(error) {
                    console.log(error);
                  });
                });
                that.pftForm = {
                  payMoney: totalMoney.toFixed(2),
                  startTime: start,
                  endTime: end
                };
              }else{
                that.chooseTable = [];
                that.pftForm = {
                  payMoney: 0,
                  startTime: '',
                  endTime: ''
                };
              }
              that.pft_list = response.data.data.file;

            }else{
              that.isPFT = false;
              that.PFTYE = false;
              if(response.data.data.file != '' && response.data.data.type == 1){
                that.fileList = response.data.data.file;
                that.tableDataQK = response.data.data.list;
                that.totalItem = response.data.data.list.length;

                let start = formatDate(new Date(that.tableDataQK[0].rece_at*1000)).split(" ")[0];
                let end = formatDate(new Date(that.tableDataQK[0].rece_at*1000)).split(" ")[0];
                let totalMoney = 0;
                that.tableDataQK.forEach(function (item, index, arr) {
                  item.rece_at = formatDate(new Date(item.rece_at*1000));
                  item.rece_at = item.rece_at.split(" ")[0];
                  if(new Date(Date.parse(start)) > new Date(Date.parse(item.rece_at))){
                    start = item.rece_at;
                  }
                  if(new Date(Date.parse(end)) < new Date(Date.parse(item.rece_at))){
                    end = item.rece_at;
                  }
                  totalMoney += parseFloat(item.rece_money);
//                  console.log(totalMoney);
                });

                that.totalMoney = totalMoney.toFixed(2);
                that.startTime = start;
                that.endTime = end;
                that.showSK = true;
              }else if(response.data.data.type == 2 && response.data.data.list.length != 0){
                that.tableDataQK = response.data.data.list;
                that.totalItem = response.data.data.list.length;
                that.totalMoney = response.data.data.rece_money;
                that.startTime = response.data.data.rece_start;
                that.endTime = response.data.data.rece_end;
                that.tableDataQK.forEach(function (item, index, arr) {
                  item.sale_at = formatDate(new Date(item.sale_at*1000));
//                  console.log(item.check_at);
                  item.check_at = formatDate(new Date(item.check_at*1000));
                  item.import_at = formatDate(new Date(item.import_at*1000));
                  that.$http.post(that.GLOBAL.serverSrc + "/org/api/userget", {
                    "id": item.create_uid
                  },{
                    headers: {
                      'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    }
                  }).then(function(response) {
                    console.log('名字',response.data.object.name);
                    if (response.data.isSuccess) {
                      item.create_uid = response.data.object.name;
                    } else {
                      that.$message.warning("失败~");
                    }
                  }).catch(function(error) {
                    console.log(error);
                  });
                });
                that.showSK = false;
              }else{
                that.tableDataQK = [];
                that.totalItem = '';
                that.totalMoney = '';
                that.startTime = '';
                that.endTime = '';
                that.showSK = false;
              }
            }
            that.$http.post(that.GLOBAL.serverSrc + "/finance/collectionaccount/api/get",
            {
              "id": response.data.data.account_id
            },{
              headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
              }
            }).then(function (obj) {
//                that.tableDataZH = obj.data.objects;
              console.log('账户查询',obj);
              if(obj.data.isSuccess){
                that.ruleForm.payAccount = obj.data.object.title;
              }
            }).catch(function (obj) {
              console.log(obj)
            });

          } else {
            that.$message.warning("加载数据失败~");
          }
        }).catch(function(error) {
          console.log(error);
        });
      },
      getListRece(orderStr){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/order/external-order/listforrece", {
          "pageIndex": this.currentPageGL,
          "pageSize": this.pageSizeGL,
          "order_sn": orderStr,
          "type": 1
        }, ).then(function(response) {
          console.log('关联订单',response);
          if (response.data.code == '200') {
            that.tableDataGLDD = response.data.data.list;
            that.pageCountGL = parseInt(response.data.data.total);
            that.tableDataGLDD.forEach(function (item, index, arr) {
              item.check_at = formatDate(new Date(item.check_at*1000));
              item.import_at = formatDate(new Date(item.import_at*1000));
              item.sale_at = formatDate(new Date(item.sale_at*1000));
              that.$http.post(that.GLOBAL.serverSrc + "/org/api/userget", {
                "id": item.create_uid
              },{
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('token'),
                }
              }).then(function(response) {

                if (response.data.isSuccess) {
                  item.create_uid = response.data.object.name
                } else {
                  that.$message.warning("加载数据失败~");
                }
              }).catch(function(error) {
                console.log(error);
              });
            });
            that.loading = false;
          } else {
            that.$message.warning("加载数据失败~");
            that.loading = false;
          }
        }).catch(function(error) {
          console.log(error);
        });
      },
      handleSizeChangeGL(val){
        this.loading = true;
        this.pageSizeGL = val;
        this.currentPageGL = 1;
        this.getListRece();
      },
      handleCurrentChangeGL(val){
        this.loading = true;
        this.currentPageGL = val;
        this.getListRece();
      },

//     时间限制
      beginDate(){
//      alert(begin);
        const that = this;
        return {
          disabledDate(time){
            if (that.pftForm.endTime) {  //如果结束时间不为空，则小于结束时间
              return new Date(that.pftForm.endTime).getTime() < time.getTime()
            } else {
              // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
            }
          }
        }
      },
      processDate(){
//      alert(process);
        const that = this;
        return {
          disabledDate(time) {
            if (that.pftForm.startTime) {  //如果开始时间不为空，则结束时间大于开始时间
              return new Date(that.pftForm.startTime).getTime() > time.getTime()
            } else {
              // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
            }
          }
        }
      },
      beginDate1(){
//      alert(begin);
        const that = this;
        return {
          disabledDate(time){
            if (that.ruleForm.endTime) {  //如果结束时间不为空，则小于结束时间
              return new Date(that.ruleForm.endTime).getTime() < time.getTime()
            } else {
              // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
            }
          }
        }
      },
      processDate1(){
//      alert(process);
        const that = this;
        return {
          disabledDate(time) {
            if (that.ruleForm.startTime) {  //如果开始时间不为空，则结束时间大于开始时间
              return new Date(that.ruleForm.startTime).getTime() > time.getTime()
            } else {
              // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
            }
          }
        }
      },
    },
    created() {

    },
    mounted() {

    }
  }

</script>
<style lang="scss">
  #GLDDTable .el-table__fixed-body-wrapper{
    top: 48px!important;
  }
  #tradeAdd .el-dialog{
    width: 90%;
  }
  #tradeAdd .buttonDv{
    position: absolute;
    top: 8px;
    right: 3%;
  }
  #tradeAdd .el-divider__text, #tradeAdd .el-link{
    font-size: 16px;
  }
  #tradeAdd .el-form-item{
    /*margin: 0;*/
  }
  #tradeAdd .stepTitle{
    width: 94%;
    line-height: 45px;
    font-size: 18px;
    text-indent: 20px;
    margin: 0 auto;
  }
  #tradeAdd .stepDv{
    width: 94%;
    margin: 0 auto;
    /*background-color: #f7f7f7;*/
    padding: 10px;
    box-sizing: border-box;
    .el-radio{
      /*margin: 10px 15px;*/
      line-height: 32px;
    }
    .baseIn{
      width: 300px;
      /*vertical-align: top;*/
      /*margin: 10px auto;*/
    }
    .upload-demo{
      width: 80%;
      display: inline-block;
    }
  }
  #tradeAdd .el-upload-list__item{
    margin-top: 10px !important;
  }
  #tradeAdd .lineTitle{
    width: 96%;
    margin: 10px auto;
    background-color: #E6F3FC;
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
    padding: 0 10px;
  }
  #tradeAdd .block{
    /*float: left;*/
    margin-left: 600px;
    margin-top: 70px;
    margin-bottom: 30px;
  }
  #edit_detail .inputWidth{
    width: 80%!important;
  }
</style>
