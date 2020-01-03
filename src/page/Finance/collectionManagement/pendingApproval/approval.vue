<template>
  <div class="vivo" style="position:relative" id="collectionDetail">
    <el-dialog
      title="审批"
      :visible="dialogFormVisible"
      custom-class="city_list"
      :show-close="false"
      style="margin:-80px 0 0 0;width: 100%;"
    >
      <div class="buttonDv">
        <el-button type="primary" @click="closeAdd('cancal')" style="margin-right: 10px" plain>取消</el-button>
        <!--<el-button type="primary" @click="deleteDo" v-if="baseInfo.approved != 1">删除</el-button>-->
        <el-button type="primary" @click="approvalPass" :disabled="passDisabled">通过</el-button>
        <el-button type="primary" @click="approvalReject" v-if="info.collectionType !== 6">驳回</el-button>
        <!-- 报销还款审批页的去认款按钮显示begin -->
        <el-button
          type="primary"
          v-if="info.collectionType == 6 && baseInfo.accountID !== 13"
          @click="recognitionDo(tableAssociated[0])"
        >去认款</el-button>
        <!-- 报销还款审批页的去认款按钮显示end -->
        <el-button type="success" @click="touchPrint" plain v-if="getOrgID == 491">打印本页详情</el-button>
      </div>
      <!-- 被 print 包括的是要打印的区域，关于print开头的命名样式均为打印样式 -->
      <div ref="print">
        <!-- 同业 -->
        <div v-if="info.collectionType == 2">
          <div v-for="item in tableAssociated" :key="item.id">
            <div class="print-content" style="border-bottom: 1px dashed #ccc">
              <div
                style="width: 100%;height: 40px; line-height: 40px; margin: 10px 0;text-align: center; font-weight: 500;font-size: 24px;"
              >大运通收款凭证</div>
              <div class="print-same-table">
                <!-- 确认日期 -->
                <div>
                  <table width="100%">
                    <thead>
                      <tr>
                        <th>确认日期</th>
                        <th>确认人</th>
                        <th>收款状态</th>
                        <th>收款单号</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ printSureTime }}</td>
                        <td>{{ getUserName }}</td>
                        <td>{{ printSureState }}</td>
                        <td>{{ baseInfo.id }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!-- 部门 -->
                <div>
                  <table width="100%">
                    <thead>
                      <tr>
                        <th>部门</th>
                        <th>申请人</th>
                        <th>订单数</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{baseInfo.dept}}</td>
                        <td>{{ baseInfo.createUser }}</td>
                        <td>1</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!-- 交易方式 -->
                <div>
                  <table width="100%">
                    <thead>
                      <tr>
                        <th>应收金额</th>
                        <th>交易方式</th>
                        <th>实收金额</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{item.payablePrice}}</td>
                        <td>{{ baseInfo.collectionNumber }}</td>
                        <td>{{ item.matchingPrice }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!-- 团号 -->
                <div>
                  <table width="100%">
                    <thead>
                      <tr>
                        <th>团号</th>
                        <th>订单号</th>
                        <th>同业社名称</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ item.groupCode }}</td>
                        <td>{{item.orderCode}}</td>
                        <td>{{ baseInfo.localCompName }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div style="display: flex;justify-content: space-between;">
                <p>
                  合计人民币：
                  <span>{{ item.matchingPrice }}</span>
                </p>
                <p>第一联 业务联</p>
              </div>
            </div>
            <div class="print-content" style="border-bottom: 1px dashed #ccc">
              <div
                style="width: 100%;height: 40px; line-height: 40px; margin: 10px 0;text-align: center; font-weight: 500;font-size: 24px;"
              >大运通收款凭证</div>
              <div class="print-same-table">
                <!-- 确认日期 -->
                <div>
                  <table width="100%">
                    <thead>
                      <tr>
                        <th>确认日期</th>
                        <th>确认人</th>
                        <th>收款状态</th>
                        <th>收款单号</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ printSureTime }}</td>
                        <td>{{ getUserName }}</td>
                        <td>{{ printSureState }}</td>
                        <td>{{ baseInfo.id }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!-- 部门 -->
                <div>
                  <table width="100%">
                    <thead>
                      <tr>
                        <th>部门</th>
                        <th>申请人</th>
                        <th>订单数</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{baseInfo.dept}}</td>
                        <td>{{ baseInfo.createUser }}</td>
                        <td>1</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!-- 交易方式 -->
                <div>
                  <table width="100%">
                    <thead>
                      <tr>
                        <th>应收金额</th>
                        <th>交易方式</th>
                        <th>实收金额</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{item.payablePrice}}</td>
                        <td>{{ baseInfo.collectionNumber }}</td>
                        <td>{{ item.matchingPrice }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!-- 团号 -->
                <div>
                  <table width="100%">
                    <thead>
                      <tr>
                        <th>团号</th>
                        <th>订单号</th>
                        <th>同业社名称</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ item.groupCode }}</td>
                        <td>{{item.orderCode}}</td>
                        <td>{{ baseInfo.localCompName }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!-- 发票 -->
                <div>
                  <table width="100%">
                    <thead>
                      <tr>
                        <th>发票类型</th>
                        <th>个人/单位</th>
                        <th>纳税人识别号</th>
                        <th>发票抬头</th>
                        <th>发票项目</th>
                        <th>金额</th>
                        <th>账号</th>
                        <th>开户行</th>
                        <th>地址</th>
                        <th>手机号</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="itemInvoice in tableInvoice" :key="itemInvoice.index">
                        <!--<td>{{ itemInvoice.invoiceID }}纸质发票 = 1</td>-->
                        <td>纸质发票</td>
                        <td>{{ itemInvoice.invoiceType == 1 ? '个人' : '单位' }}</td>
                        <td>{{ itemInvoice.invoiceNumber }}</td>
                        <td>{{ itemInvoice.invoiceHeaderOrTel }}</td>
                        <!--<td>{{ itemInvoice.invoiceItem }} 1旅游费</td>-->
                        <td>旅游费</td>
                        <td>{{ itemInvoice.invoicePrice }}</td>
                        <td>{{ itemInvoice.cardNumber }}</td>
                        <td>{{ itemInvoice.bankName }}</td>
                        <td>{{ itemInvoice.address }}</td>
                        <td>{{ itemInvoice.tel }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div style="display: flex;justify-content: space-between;">
                <p>
                  合计人民币：
                  <span>{{ item.matchingPrice }}</span>
                </p>
                <p>第二联 财务联</p>
              </div>
            </div>
            <div style="page-break-after: always;"></div>
          </div>
        </div>
        <!-- 直客 -->
        <div v-if="info.collectionType == 1">
          <div class="print-content" style="border-bottom: 1px dashed #ccc;">
            <div
              style="width: 100%;height: 40px; line-height: 40px; margin: 10px 0;text-align: center; font-weight: 500;font-size: 24px;"
            >大运通收款凭证</div>
            <div class="print-same-table">
              <!-- 确认日期 -->
              <div>
                <table width="100%">
                  <thead>
                    <tr>
                      <th>确认日期</th>
                      <th>确认人</th>
                      <th>收款状态</th>
                      <th>收款单号</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{ printSureTime }}</td>
                      <td>{{ getUserName }}</td>
                      <td>{{ printSureState }}</td>
                      <td>{{ baseInfo.id }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- 部门 -->
              <div>
                <table width="100%">
                  <thead>
                    <tr>
                      <th>部门</th>
                      <th>申请人</th>
                      <th>订单数</th>
                      <th>团号</th>
                      <th>订单号</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{baseInfo.dept}}</td>
                      <td>{{ baseInfo.createUser }}</td>
                      <td>1</td>
                      <td>{{ printGroupCode }}</td>
                      <td>{{ printOrderCode }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- 交易方式 -->
              <div>
                <table width="100%">
                  <thead>
                    <tr>
                      <th>应收金额</th>
                      <th>交易方式</th>
                      <th>实收金额</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{ printPayablePrice }}</td>
                      <td>{{ baseInfo.collectionNumber }}</td>
                      <td>{{ printMatchingPrice }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div style="display: flex;justify-content: space-between;">
              <p>
                合计人民币：
                <span>{{ printMatchingPrice }}</span>
              </p>
              <p>第一联 业务联</p>
            </div>
          </div>
          <div class="print-content" style="border-bottom: 1px dashed #ccc;">
            <div
              style="width: 100%;height: 40px; line-height: 40px; margin: 10px 0;text-align: center; font-weight: 500;font-size: 24px;"
            >大运通收款凭证</div>
            <div class="print-same-table" v-for="item in tableAssociated" :key="item.id">
              <!-- 确认日期 -->
              <div>
                <table width="100%">
                  <thead>
                    <tr>
                      <th>确认日期</th>
                      <th>确认人</th>
                      <th>收款状态</th>
                      <th>收款单号</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{ printSureTime }}</td>
                      <td>{{ getUserName }}</td>
                      <td>{{ printSureState }}</td>
                      <td>{{ baseInfo.id }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- 部门 -->
              <div>
                <table width="100%">
                  <thead>
                    <tr>
                      <th>部门</th>
                      <th>申请人</th>
                      <th>订单数</th>
                      <th>团号</th>
                      <th>订单号</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{baseInfo.dept}}</td>
                      <td>{{ baseInfo.createUser }}</td>
                      <td>1</td>
                      <td>{{ printGroupCode }}</td>
                      <td>{{ printOrderCode }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- 交易方式 -->
              <div>
                <table width="100%">
                  <thead>
                    <tr>
                      <th>应收金额</th>
                      <th>交易方式</th>
                      <th>实收金额</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{ printPayablePrice }}</td>
                      <td>{{ baseInfo.collectionNumber }}</td>
                      <td>{{ printMatchingPrice }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- 发票 -->
              <div>
                <table width="100%">
                  <thead>
                    <tr>
                      <th>发票类型</th>
                      <th>个人/单位</th>
                      <th>纳税人识别号</th>
                      <th>发票抬头</th>
                      <th>发票项目</th>
                      <th>金额</th>
                      <th>账号</th>
                      <th>开户行</th>
                      <th>地址</th>
                      <th>手机号</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="itemInvoice in tableInvoice" :key="itemInvoice.index">
                      <!--<td>{{ itemInvoice.invoiceID }}纸质发票 = 1</td>-->
                      <td>纸质发票</td>
                      <td>{{ itemInvoice.invoiceType == 1 ? '个人' : '单位' }}</td>
                      <td>{{ itemInvoice.invoiceNumber }}</td>
                      <td>{{ itemInvoice.invoiceHeaderOrTel }}</td>
                      <!--<td>{{ itemInvoice.invoiceItem }} 1旅游费</td>-->
                      <td>旅游费</td>
                      <td>{{ itemInvoice.invoicePrice }}</td>
                      <td>{{ itemInvoice.cardNumber }}</td>
                      <td>{{ itemInvoice.bankName }}</td>
                      <td>{{ itemInvoice.address }}</td>
                      <td>{{ itemInvoice.tel }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div style="display: flex;justify-content: space-between;">
              <p>
                合计人民币：
                <span>{{ printMatchingPrice }}</span>
              </p>
              <p>第二联 财务联</p>
            </div>
          </div>
        </div>
      </div>
      <!-- 打印结束 END -->

      <!--<p class="stepTitle">基本信息</p>-->
      <el-divider content-position="left">基本信息</el-divider>
      <el-button type="warning" round size="mini" style="margin-left: 4%;">审批中</el-button>

      <!-- 报销还款显示的begin -->
      <div class="detailNameParent" v-if="info.collectionType == 6">
        <p class="detailName">
          <span>收款单号：</span>
          {{baseInfo.id}}
        </p>
        <p class="detailName">
          <span>申请人：</span>
          {{baseInfo.createUser}}
        </p>
        <p class="detailName">
          <span>申请时间：</span>
          {{baseInfo.createTime}}
        </p>
        <p class="detailName">
          <span>报销单号：</span>
          {{baseInfo.reimbursement}}
        </p>
        <p class="detailName">
          <span>借款单号：</span>
          {{baseInfo.loan}}
        </p>
        <p class="detailName">
          <span>收款金额：</span>
          {{baseInfo.price}}
        </p>
        <p class="detailName">
          <span>汇款/现金：</span>
          {{baseInfo.accountID == 13  ? "现金" : "汇款"}}
        </p>
        <p class="detailName">
          <span>收款账户：</span>
          {{baseInfo.collectionNumber}}
        </p>
      </div>
      <!-- 报销还款显示的end -->

      <div v-if="info.collectionType !== 6">
        <div class="stepDv">
          <p class="inputLabel">
            <span>ID：</span>
            {{baseInfo.id}}
          </p>
          <p class="inputLabel">
            <span>申请人：</span>
            {{baseInfo.createUser}}
          </p>
          <p class="inputLabel">
            <span>创建时间：</span>
            {{baseInfo.createTime}}
          </p>
          <p class="inputLabel" v-if="info.collectionType == 2">
            <span>同业社名称：</span>
            {{baseInfo.localCompName}}
          </p>
          <p class="inputLabel" v-if="info.collectionType == 1">
            <span>交易流水号：</span>
            {{baseInfo.orderNumber}}
          </p>
          <p class="inputLabel" v-if="info.collectionType == 5">
            <span>分销商：</span>
            {{baseInfo.distributor}}
          </p>
          <p class="inputLabel">
            <span>收款账户：</span>
            {{baseInfo.collectionNumber}}
          </p>
          <p class="inputLabel">
            <span>收款金额：</span>
            {{baseInfo.price}}
          </p>
          <p class="inputLabel">
            <span>摘要：</span>
            {{baseInfo.abstract}}
          </p>
          <p class="inputLabel" v-if="info.collectionType != 5">
            <span>开发票：</span>
            {{baseInfo.invoice}}
          </p>
          <p class="inputLabel" v-if="info.collectionType == 5">
            <span>收款时间：</span>
            {{baseInfo.collectionTime}}
          </p>
          <p class="inputLabel" v-if="info.collectionType == 5">
            <span>款项说明：</span>
            {{baseInfo.moneyExplain}}
          </p>

          <div class="inputLabel">
            <span>凭证：</span>
            <ul>
              <li v-for="item in fileList" :key="item.index">
                <a :href="item.url" target="_blank">{{item.name}}</a>
              </li>
            </ul>
          </div>
        </div>

        <el-divider content-position="left">审核结果</el-divider>
        <div class="stepDv bottomDis">
          <el-table
            ref="singleTable"
            :data="tableDataResult"
            border
            style="width: 96%;margin: 0 auto;"
            :header-cell-style="getRowClass"
          >
            <el-table-column prop="createTime" label="审批时间" align="center"></el-table-column>
            <el-table-column prop="spName" label="审批人" align="center"></el-table-column>
            <el-table-column prop="spState" label="审批结果" align="center"></el-table-column>
            <el-table-column prop="spContent" label="审批意见" align="center"></el-table-column>
          </el-table>
        </div>

        <div v-if="baseInfo.invoice == '有'">
          <el-divider content-position="left">发票</el-divider>
          <div class="stepDv bottomDis">
            <el-table :data="tableInvoice" border :header-cell-style="getRowClass">
              <el-table-column prop="invoiceID" label="发票类型" align="center">
                <template slot-scope="scope">
                  <div>{{invoiceType[scope.row.invoiceID]}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="invoiceType" label="个人/单位" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.invoiceType == 1">个人</div>
                  <div v-if="scope.row.invoiceType == 2">单位</div>
                </template>
              </el-table-column>
              <el-table-column prop="invoiceNumber" label="纳税人识别号" align="center"></el-table-column>
              <el-table-column prop="invoiceHeaderOrTel" label="发票抬头" align="center"></el-table-column>
              <el-table-column prop="invoiceItem" label="发票项目" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.invoiceItem == 1">旅游费</div>
                </template>
              </el-table-column>
              <el-table-column prop="invoicePrice" label="金额" align="center"></el-table-column>
              <el-table-column prop="cardNumber" label="账号" align="center"></el-table-column>
              <el-table-column prop="bankName" label="开户行" align="center"></el-table-column>
              <el-table-column prop="address" label="地址" align="center"></el-table-column>
              <el-table-column prop="tel" label="手机号" align="center"></el-table-column>
            </el-table>
          </div>
        </div>

        <div>
          <el-divider content-position="left">关联欠款</el-divider>
          <!--同业/直客 关联欠款-->
          <div class="stepDv bottomDis" v-if="info.collectionType == 2 || info.collectionType == 1">
            <div class="associated" v-if="info.collectionType == 2">
              <div class="associatedIcon">
                <i class="el-icon-warning"></i>
              </div>
              <div class="associatedItems">
                已关联
                <span style="font-weight: bold;">{{ tableManyRow }}</span>项
              </div>
              <div class="associatedMoney">总计：{{ getCollectionPriceTotal }}元</div>
            </div>
            <el-table :data="tableAssociated" border :header-cell-style="getRowClass">
              <el-table-column prop="orderCode" label="订单编号" align="center"></el-table-column>
              <el-table-column prop="productName" label="产品名称" align="center"></el-table-column>
              <el-table-column prop="groupCode" label="团期计划" align="center"></el-table-column>
              <el-table-column prop="date" label="出团日期" align="center"></el-table-column>
              <el-table-column prop="payablePrice" label="订单金额" align="center"></el-table-column>
              <el-table-column prop="arrearsPrice" label="欠款金额" align="center"></el-table-column>
              <el-table-column prop="repaidPrice" label="已还金额" align="center"></el-table-column>
              <el-table-column prop="amountPrice" label="待审核金额" align="center"></el-table-column>
              <el-table-column prop="matchingPrice" label="本次收款金额" align="center"></el-table-column>
              <el-table-column
                prop="prop"
                label="操作"
                align="center"
                v-if="hasSubject"
              >
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.checkType != 3"
                    type="text"
                    @click="recognitionDo(scope.row)"
                  >去认款</el-button>
                  <el-button v-else type="text" @click="recognitionDetail(scope.row)">查看认款详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!--同业/直客 end-->

          <!--内部收款 关联欠款-->
          <div class="stepDv bottomDis" v-if="info.collectionType == 5">
            <el-table :data="tableAssociated" border :header-cell-style="getRowClass">
              <el-table-column prop="id" label="订单编号" align="center"></el-table-column>
              <!--没有这个字段 suppliers 待解决-->
              <el-table-column prop="suppliers" label="分销商" width="80" align="center"></el-table-column>
              <el-table-column prop="productName" label="产品名称" align="center"></el-table-column>
              <el-table-column prop="groupCode" label="团期计划" align="center"></el-table-column>
              <el-table-column prop="payablePrice" label="订单金额" align="center"></el-table-column>
              <el-table-column prop="arrearsPrice" label="欠款金额" align="center"></el-table-column>
              <el-table-column prop="repaidPrice" label="已还金额" align="center"></el-table-column>
              <el-table-column prop="amountPrice" label="待审核金额" align="center"></el-table-column>
              <el-table-column prop="matchingPrice" label="本次收款" align="center"></el-table-column>
            </el-table>
          </div>
          <!--内部收款 end-->
        </div>
      </div>

      <!--审批弹窗-->
      <div>
        <el-dialog
          style="text-align: left;"
          :title="approvalTitle"
          :visible.sync="dialogVisibleApproval"
          width="30%"
          top="20vh"
          append-to-body
        >
          <div>
            <p class="areaP" v-if="approval_status == 1">通过说明：</p>
            <p class="areaP" v-if="approval_status == 2">驳回意见：</p>
            <el-input
              class="areaIn"
              type="textarea"
              :rows="3"
              placeholder="请输入内容(选填)"
              v-model="approvalMark"
            ></el-input>
          </div>
          <div slot="footer" style="overflow: hidden;">
            <el-button @click="dialogVisibleApproval = false">取 消</el-button>
            <el-button type="primary" @click="approvalSubmit()">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <!--审批结束-->

      <recognitionDo :dialogFormVisible2="dialogFormVisible2" :msg="msg" @close="recognitionClose"></recognitionDo>
      <recognitionDetail
        :dialogFormVisible3="dialogFormVisible3"
        :msg="msg"
        @close="recognitionClose"
      ></recognitionDetail>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
import { formatDate } from "@/js/libs/publicMethod.js";
import recognitionDo from "@/page/Finance/collectionManagement/pendingApproval/recognitionDo.vue";
import recognitionDetail from "@/page/Finance/collectionManagement/pendingApproval/recognitionDetail.vue";
export default {
  name: "collectionDetail",
  components: {
    recognitionDo,
    recognitionDetail
  },
  props: {
    dialogFormVisible: false,
    info: ""
  },
  data() {
    return {
      printMatchingPrice: null,
      getOrgID: null, // 财务id
      printSureTime: null, // 打印用 - 确认时间
      printSureState: null, // 状态
      getUserName: null, // 打印用户名

      printPayablePrice: null,
      printOrderCode: null,
      printGroupCode: null,

      passDisabled: false, // 通过按钮是否禁用
      // 基础信息
      baseInfo: {
        id: "",
        createUser: "",
        createTime: "",
        collectionType: "",
        distributor: "",
        orderNumber: "",
        localCompName: "",
        price: "",
        abstract: "",
        invoice: "",
        collectionTime: "",
        moneyExplain: "",
        collectionNumber: ""
      },

      hasSubject: false,

      // 基础信息凭证
      fileList: [],
      // 审核结果，table数据
      tableDataResult: [],
      // 发票，table数据
      tableInvoice: [],
      invoiceType: {
        "1": "纸质发票"
      },
      // 关联欠款，table数据
      tableAssociated: [],

      // 审批弹框数据
      approvalTitle: "",
      dialogVisibleApproval: false,
      approval_status: "",
      approvalMark: "",

      tableManyRow: 0,
      getCollectionPriceTotal: 0,

      dialogFormVisible2: false, // 去认款显示隐藏
      dialogFormVisible3: false, // 查看认款详情
      msg: "" // 传值字段
    };
  },
  computed: {
    // 计算属性的 getter
  },
  watch: {
    dialogFormVisible: {
      handler: function() {
        if (this.info != "" && this.dialogFormVisible) {
          this.passDisabled = false;
          this.hasSubject = false;
          this.loadData();
          this.getMoment();
        }
      }
    }
  },
  methods: {
    // 打印详情
    touchPrint() {
      this.$print(this.$refs.print);
    },
    // 表格头部背景颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#F7F7F7;color:rgb(85, 85, 85);";
      } else {
        return "";
      }
    },
    // 去认款
    recognitionDo(row) {
      this.dialogFormVisible2 = true;
      this.msg = {
        collectionType: this.info.collectionType,
        baseInfo: this.baseInfo,
        tableDataOrder: row,
        fileList: this.fileList
      };
    },
    // 查看认款详情
    recognitionDetail(row) {
      this.msg = {
        id: row.id
      };
      this.dialogFormVisible3 = true;
    },
    recognitionClose(str) {
      this.dialogFormVisible2 = false;
      this.dialogFormVisible3 = false;
      this.msg = "";
      // console.log(str);
      if (str == "success") {
        this.passDisabled = false;
        this.loadData();
      }
    },
    // 关闭弹窗
    closeAdd(str) {
      if (str === "cancal") {
        const that = this;
        this.tableAssociated.forEach(function(item, index, arr) {
          if (item.checkType == 3) {
            that.$http
              .post(
                that.GLOBAL.serverSrc + "/finance/CollectionBank/api/delete",
                {
                  id: item.id
                }
              )
              .then(function(response) {
                console.log("删除", response);
                if (response.data.isSuccess) {
                  console.log("成功。。。");
                }
              })
              .catch(function(error) {
                console.log(error);
              });
          }
        });
      }
      this.baseInfo = {
        id: "",
        createUser: "",
        createTime: "",
        collectionType: "",
        distributor: "",
        orderNumber: "",
        localCompName: "",
        price: "",
        abstract: "",
        invoice: "",
        collectionNumber: ""
      };

      this.$emit("close", false);
    },

    // 通过按钮事件
    approvalPass() {
      this.dialogVisibleApproval = true;
      this.approvalTitle = "审批通过";
      this.approval_status = "1";
    },
    // 驳回按钮事件
    approvalReject() {
      this.dialogVisibleApproval = true;
      this.approvalTitle = "审批驳回";
      this.approval_status = "2";
    },

    // 审批提交事件
    approvalSubmit() {
      const that = this;
      const date = this.getMoment();
      this.$http
        .post(this.GLOBAL.serverSrc + "/finance/collection/api/getCollIDTG", {
          datetime: date,
          spname: sessionStorage.getItem("name"),
          spstate: this.approval_status,
          spcontent: this.approvalMark,
          checktype: this.approval_status,
          id: this.info.id
        })
        .then(function(response) {
          // console.log('审批操作',response);
          if (response.data.isSuccess) {
            // that.$message.success("审批提交成功~");
            if (that.approval_status == "1") {
              that.insert();
            } else if (that.approval_status == "2") {
              that.closeAdd("cancal");
            }
            that.dialogVisibleApproval = false;
            that.approval_status = "";
            that.approvalMark = "";
          } else {
            if (response.data.message) {
              that.$message.warning(response.data.message);
            } else {
              that.$message.warning("审批提交失败~");
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    insert() {
      // alert('insert');
      const that = this;
      this.$http
        .post(this.GLOBAL.serverSrc + "/finance/Receipt/api/insert", {
          object: {
            collectionID: this.info.id
          }
        })
        .then(function(response) {
          console.log(response);
          if (response.data.isSuccess) {
            that.$message.success("审批提交成功~");
            that.closeAdd();
          } else {
            if (response.data.message) {
              that.$message.warning(response.result.message);
            } else {
              that.$message.warning("insert失败~");
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    // 加载数据
    loadData() {
      const that = this;
      // 获取基本信息
      this.$http
        .post(this.GLOBAL.serverSrc + "/finance/collection/api/coll", {
          id: this.info.id
        })
        .then(function(response) {
          console.log('审批详情',response);
          if (response.data.isSuccess) {
            const hasInvoice = response.data.object.invoice == 1 ? "有" : "无";
            let createTimeStr = "";
            if (response.data.object.createTime) {
              createTimeStr = response.data.object.createTime.split("T")[0];
              if (response.data.object.createTime.split("T")[1]) {
                createTimeStr +=
                  " " +
                  response.data.object.createTime.split("T")[1].split(".")[0];
              }
            }
            that.baseInfo = {
              id: response.data.object.id,
              createUser: response.data.object.createUser,
              createTime: createTimeStr
                ? createTimeStr
                : response.data.object.createTime,
              collectionType: response.data.object.collectionType,
              distributor: response.data.object.distributor,
              orderNumber: response.data.object.serialNumber,
              collectionNumber: response.data.object.collectionNumber,
              price: response.data.object.price,
              abstract: response.data.object.abstract,
              invoice: hasInvoice,
              collectionTime: response.data.object.collectionTime,
              moneyExplain: response.data.object.moneyExplain,
              localCompName: response.data.object.localCompName,
              reimbursement: response.data.object.reimbursement,
              loan: response.data.object.loan,
              accountID: response.data.object.accountID
              //   response.data.object.accountID == 13
              //     ? (response.data.object.accountID = "现金")
              //     : (response.data.object.accountID = "汇款")
            };

            that.getAccount(response.data.object.accountID);

            that.printMatchingPrice =
              response.data.object.arrears[0].matchingPrice;
            that.printPayablePrice =
              response.data.object.arrears[0].payablePrice;
            that.printOrderCode = response.data.object.arrears[0].orderCode;
            that.printGroupCode = response.data.object.arrears[0].groupCode;
            // 打印相关
            if (response.data.object.spw.length > 0) {
              that.printSureTime = response.data.object.spw[0].createTime;
              that.printSureState =
                response.data.object.spw[
                  response.data.object.spw.length - 1
                ].spState;
            }

            // id为105有数据  数据字段待确认
            that.tableInvoice = response.data.object.invoiceTable;
            that.tableAssociated = response.data.object.arrears;
            that.tableDataResult = response.data.object.spw;

            that.tableManyRow = that.tableAssociated.length;
            that.getCollectionPriceTotal = 0;

            // 如果是报销还款进来的并且获取的accountID 为现金 则可以直接通过 此时没有去认款的按钮
            
            if (that.info.collectionType == 6) {
              if(that.tableAssociated[0].checkType !== 3) {
                if (response.data.object.accountID == 13) {
                that.passDisabled = false;
              } else {
                that.passDisabled = true;
              }
              } else {
                that.passDisabled = false;
              }
            }
            

            // 凭证
            that.fileList = response.data.object.files;
          } else {
            // that.baseInfo = {
            //   id: 1235,
            //   createUser: "自己造假",
            //   createTime: "2012-12-12",
            //   collectionNumber: "收款账户",
            //   price: 250,
            //   reimbursement: 1236547896,
            //   loan: 1111111111,
            //   accountID: "汇款"
            // };
            // if (that.info.collectionType == 6) {
            //   if (that.baseInfo.accountID == "现金") {
            //     that.passDisabled = false;
            //   } else {
            //     that.passDisabled = true;
            //   }
            // }
            that.$message.warning("加载数据失败~");
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    getAccount(id){
      const that = this;
      this.$http.post(this.GLOBAL.serverSrc + "/finance/collectionaccount/api/get", {
        "id": id
      }, ).then(function(response) {
        console.log(response);
        if (response.data.isSuccess) {
          if(response.data.object.subject){
            that.hasSubject = true;
          }
        } else {
          that.hasSubject = false;
        }
        if (!that.hasSubject) {
          // alert("没有科目值");
          that.tableAssociated.forEach(item => {
            that.getCollectionPriceTotal += item.matchingPrice;
          });
        } else {
          // alert("有科目值");
          that.tableAssociated.forEach(item => {
            that.getCollectionPriceTotal += item.matchingPrice;

            if (item.checkType != 3) {
              that.passDisabled = true;
            }
          });
        }
      }).catch(function(error) {
        console.log(error);
      });
    },

    getMoment() {
      const now = new Date();

      const year = now.getFullYear().toString();
      const month = (now.getMonth() + 1).toString();
      const day = now.getDate().toString();

      return year + month + day;
    }
  },
  created() {
    this.getOrgID = sessionStorage.getItem("orgID");
    this.getUserName = sessionStorage.getItem("name");
  },
  mounted() {}
};
</script>
<style lang="scss">
#collectionDetail .print-content {
  display: none;
  width: 100%;
}
#collectionDetail .el-dialog {
  width: 90%;
}
#collectionDetail .stepTitle {
  width: 94%;
  line-height: 45px;
  font-size: 18px;
  text-indent: 20px;
  margin: 0 auto;
}
#collectionDetail .detailNameParent {
  margin: 10px 0 0 40px;
  .detailName {
    display: inline-block;
    width: 30%;
  }
}
#collectionDetail .stepDv {
  width: 94%;
  margin: 0 auto;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;
  .inputLabel {
    width: 31%;
    font-size: 14px;
    line-height: 45px;
    margin: 0;
    vertical-align: top;
    span {
      display: inline-block;
      width: 120px;
      vertical-align: top;
    }
    ul {
      display: inline-block;
      width: 70%;
      list-style: none;
      padding: 0;
      margin: 0;
    }
  }
  .baseIn {
    width: 300px;
    vertical-align: top;
    margin: 10px auto;
  }
  .upload-demo {
    width: 80%;
    display: inline-block;
    margin: 10px auto;
  }
}
#collectionDetail .bottomDis {
  margin-bottom: 50px;
}
#collectionDetail .buttonDv {
  position: absolute;
  top: 8px;
  right: 3%;
}
#collectionDetail .el-divider__text,
#tradeAdd .el-link {
  font-size: 16px;
}
#collectionDetail .el-upload-list__item {
  margin-top: 10px !important;
}
#collectionDetail .el-upload-list__item {
  width: 100% !important;
}
#collectionDetail .lineTitle {
  width: 100%;
  margin: 10px auto;
  background-color: #e6f3fc;
  height: 30px;
  line-height: 30px;
  box-sizing: border-box;
  padding: 0 10px;
}

/*关联欠款*/
#collectionDetail .associated {
  display: block;
  width: 100%;
  height: 40px;
  line-height: 40px;
  background: #e3f2fc;
  border: 1px solid #cfeefc;
  border-radius: 5px;
  overflow: hidden;
}
#collectionDetail .associatedIcon {
  font-size: 14pt;
  color: #0b84e6;
  margin: 0 0 0 15px;
  float: left;
}
#collectionDetail .associatedItems {
  float: left;
  margin: 0 0 0 10px;
}
</style>
