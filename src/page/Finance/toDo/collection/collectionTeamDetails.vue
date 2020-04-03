<!--

  收款详情，所有收款类型通用同一个组件

-->
<template>
  <div class="loan-management">
    <div style="text-align: right; margin: 25px 20px 0 0;">
      <el-button type="warning" plain @click="handleCancel">取消</el-button>
      <el-button type="primary" plain @click="handlePass">通过</el-button>
      <el-button type="danger" plain @click="handleRejected">驳回</el-button>
      <el-button type="success" plain @click="handleTouchPrint" plain v-if="getOrgID === 491 || 310 || 342 || 362 || 542 || 574">打印本页</el-button>
    </div>
    <div>
      <el-divider content-position="left" class='title-margin'>基本信息</el-divider>
      <div class="item-content">
        <el-tag type="warning" v-if="fundamental.checkType === '0'" class="distributor-status">审批中</el-tag>
        <el-tag type="danger" v-if="fundamental.checkType === '2'" class="distributor-status">驳回</el-tag>
        <el-tag type="success" v-if="fundamental.checkType === '1'" class="distributor-status">通过</el-tag>
      </div>
      <!-- 打印内容，含有直客，同业 -->
      <div ref="print">
        <div v-if="keepComponentName === 'nameIIICollectionTeamSame'">
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
                      <td>{{ fundamental.id }}</td>
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
                      <td>{{ fundamental.dept }}</td>
                      <td>{{ fundamental.createUser }}</td>
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
                      <td>{{ fundamental.collectionNumber }}</td>
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
                      <td>{{ fundamental.localCompName }}</td>
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
                      <td>{{ fundamental.id }}</td>
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
                      <td>{{ fundamental.dept }}</td>
                      <td>{{ fundamental.createUser }}</td>
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
                      <td>{{ fundamental.collectionNumber }}</td>
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
                      <td>{{ fundamental.localCompName }}</td>
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
                      <td>{{ itemInvoice.invoiceType === 1 ? '个人' : '单位' }}</td>
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
        <div v-if="keepComponentName === 'nameIIICollectionTeamDirect'">
          <div class="print-content" style="border-bottom: 1px dashed #ccc;">
            <div style="width: 100%;height: 40px; line-height: 40px; margin: 10px 0;text-align: center; font-weight: 500;font-size: 24px;">大运通收款凭证</div>
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
                    <td>{{ fundamental.id }}</td>
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
                    <td>{{fundamental.dept}}</td>
                    <td>{{ fundamental.createUser }}</td>
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
                    <td>{{ fundamental.collectionNumber }}</td>
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
                    <td>{{ fundamental.id }}</td>
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
                    <td>{{fundamental.dept}}</td>
                    <td>{{ fundamental.createUser }}</td>
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
                    <td>{{ fundamental.collectionNumber }}</td>
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
                    <td>{{ itemInvoice.invoiceType === 1 ? '个人' : '单位' }}</td>
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
      <!-- 打印内容，含有直客，同业 END -->
      <div v-if="keepComponentName === 'nameIIICollectionTeamDirect'">
        <!-- 第一行 -->
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color ">ID:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.id }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color ">申请人:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.createUser }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">创建时间:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.createTime | formatDate }}</div></el-col>
          </el-col>
        </el-row>
        <!-- 第一行 END -->
        <!-- 第二行 -->
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">交易流水号:</div></el-col>
            <el-col :span="18"><div class="grid-del">{{ fundamental.serialNumber }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">收款账户:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.collectionNumber }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">收款金额:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.price }}</div></el-col>
          </el-col>
        </el-row>
        <!-- 第二行 END -->
        <!-- 第三行 -->
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">收款时间:</div></el-col>
            <el-col :span="18">
              <div class="grid-del">{{ fundamental.collectionTime | formatDate }}</div>
            </el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">摘要:</div></el-col>
            <el-col :span="18"><div class="grid-del">{{ fundamental.abstract }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">开发票:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.invoice == 1 ?  '是' : '否' }}</div></el-col>
          </el-col>
        </el-row>
        <!-- 第三行 END -->
        <!-- 第四行 -->
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">凭证:</div></el-col>
            <el-col :span="18">
              <el-upload

                class="upload-demo"
                name="files"
                :file-list="fundamental.files"
                :show-file-list=true
                action="test"
                :disabled=true
                :on-preview="handlePreview"
              >
              </el-upload>
            </el-col>
          </el-col>
          <el-col :span="6"></el-col>
          <el-col :span="6"></el-col>
        </el-row>
        <!-- 第四行 END -->
      </div>
      <div v-if="keepComponentName === 'nameIIICollectionTeamSame'">
         <!-- 第一行 -->
         <el-row type="flex" class="row-bg" justify="space-around">
           <el-col :span="6">
             <el-col :span="6"><div class="grid-del label-color ">ID:</div></el-col>
             <el-col :span="18"><div class="grid-del ">{{ fundamental.id }}</div></el-col>
           </el-col>
           <el-col :span="6">
             <el-col :span="6"><div class="grid-del label-color ">申请人:</div></el-col>
             <el-col :span="18"><div class="grid-del ">{{ fundamental.createUser }}</div></el-col>
           </el-col>
           <el-col :span="6">
             <el-col :span="6"><div class="grid-del label-color">创建时间:</div></el-col>
             <el-col :span="18"><div class="grid-del ">{{ fundamental.createTime | formatDate }}</div></el-col>
           </el-col>
         </el-row>
         <!-- 第一行 END -->
         <!-- 第二行 -->
         <el-row type="flex" class="row-bg" justify="space-around">
           <el-col :span="6">
             <el-col :span="6"><div class="grid-del label-color">同业社名称:</div></el-col>
             <el-col :span="18"><div class="grid-del">{{ fundamental.localCompName }}</div></el-col>
           </el-col>
           <el-col :span="6">
             <el-col :span="6"><div class="grid-del label-color">收款账户:</div></el-col>
             <el-col :span="18"><div class="grid-del ">{{ fundamental.collectionNumber }}</div></el-col>
           </el-col>
           <el-col :span="6">
             <el-col :span="6"><div class="grid-del label-color">收款金额:</div></el-col>
             <el-col :span="18"><div class="grid-del ">{{ fundamental.price }}</div></el-col>
           </el-col>
         </el-row>
         <!-- 第二行 END -->
         <!-- 第四行 -->
         <el-row type="flex" class="row-bg" justify="space-around">
           <el-col :span="6">
             <el-col :span="6"><div class="grid-del label-color">摘要:</div></el-col>
             <el-col :span="18"><div class="grid-del">{{ fundamental.abstract }}</div></el-col>
           </el-col>
           <el-col :span="6">
             <el-col :span="6"><div class="grid-del label-color">开发票:</div></el-col>
             <el-col :span="18"><div class="grid-del">{{ fundamental.invoice == 1 ?  '是' : '否' }}</div></el-col>
           </el-col>
           <el-col :span="6">
             <el-col :span="6"><div class="grid-del label-color">凭证:</div></el-col>
             <el-col :span="18">
               <el-upload
                 class="upload-demo"
                 name="files"
                 :file-list="fundamental.files"
                 :show-file-list=true
                 action="test"
                 :disabled=true
                 :on-preview="handlePreview"
               >
               </el-upload>
             </el-col>
           </el-col>
         </el-row>
         <!-- 第四行 END -->
       </div>
      <div v-if="keepComponentName === 'nameIIICollectionTeamInner'">
        <!-- 第一行 -->
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">收款单号:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.id }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color ">申请人:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.createUser }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">申请时间:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.createTime | formatDate }}</div></el-col>
          </el-col>
        </el-row>
        <!-- 第一行 END -->
        <!-- 第二行 -->
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">分销商:</div></el-col>
            <el-col :span="18"><div class="grid-del">{{ fundamental.distributor }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">收款账户:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.collectionNumber }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">收款金额:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.price }}</div></el-col>
          </el-col>
        </el-row>
        <!-- 第二行 END -->
        <!-- 第四行 -->
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">收款时间:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.collectionTime | formatDate }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">摘要:</div></el-col>
            <el-col :span="18"><div class="grid-del">{{ fundamental.abstract }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">款项说明:</div></el-col>
            <el-col :span="18"><div class="grid-del">{{ fundamental.moneyExplain }}</div></el-col>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">凭证:</div></el-col>
            <el-col :span="18">
              <el-upload

                class="upload-demo"
                name="files"
                :file-list="fundamental.files"
                :show-file-list=true
                action="test"
                :disabled=true
                :on-preview="handlePreview"
              >
              </el-upload>
            </el-col>
          </el-col>
          <el-col :span="6"></el-col>
          <el-col :span="6"></el-col>
        </el-row>
        <!-- 第四行 END -->
      </div>
      <div v-if="keepComponentName === 'nameIIICollectionTeamReimburse'">
        <!-- 第一行 -->
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color ">ID:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.id }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color ">申请人:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.createUser }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">申请时间:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.createTime | formatDate }}</div></el-col>
          </el-col>
        </el-row>
        <!-- 第一行 END -->
        <!-- 第二行 -->
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">报销单号:</div></el-col>
            <el-col :span="18"><div class="grid-del">{{ fundamental.reimbursement }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">借款单号:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.loan }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">收款金额:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.price }}</div></el-col>
          </el-col>
        </el-row>
        <!-- 第二行 END -->
        <!-- 第四行 -->
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">汇款/现金:</div></el-col>
            <el-col :span="18"><div class="grid-del">{{fundamental.accountID == 13 ? "现金" : "汇款"}}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">收款账户:</div></el-col>
            <el-col :span="18"><div class="grid-del">{{ fundamental.collectionNumber }}</div></el-col>
          </el-col>
          <el-col :span="6">
          </el-col>
        </el-row>
        <!-- 第四行 END -->
      </div>
      <div v-if="keepComponentName !== 'nameIIICollectionTeamReimburse'">
        <!-- 审核结果 -->
        <el-divider content-position="left" class='title-margin title-margin-t'>审核结果</el-divider>
        <el-table :data="tableAuditResults" border :header-cell-style="getRowClass">
          <el-table-column prop="createTime" :formatter='dateFormatDetails' label="审批时间" align="center"></el-table-column>
          <el-table-column prop="spName" label="审批人" align="center"></el-table-column>
          <el-table-column prop="spState" label="审批结果" align="center"></el-table-column>
          <el-table-column prop="spContent" label="审批意见" align="center"></el-table-column>
        </el-table>
        <!-- 审核结果 END -->
        <!-- 发票 -->
        <div v-if="paramsInvoiceTable.length !== 0">
          <el-divider content-position="left" class='title-margin title-margin-t'>发票</el-divider>
          <el-table :data="tableInvoice" border :header-cell-style="getRowClass">
            <el-table-column prop="invoiceID" label="发票类型" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.invoiceID === 1">纸质发票</div>
              </template>
            </el-table-column>
            <el-table-column prop="invoiceType" label="个人/单位" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.invoiceType === 1">个人</div>
                <div v-if="scope.row.invoiceType === 2">单位</div>
              </template>
            </el-table-column>
            <el-table-column prop="invoiceNumber" label="纳税人识别号" align="center"></el-table-column>
            <el-table-column prop="invoiceHeaderOrTel" label="发票抬头" align="center"></el-table-column>
            <el-table-column prop="invoiceItem" label="发票项目" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.invoiceItem === 1">旅游费</div>
              </template>
            </el-table-column>
            <el-table-column prop="invoicePrice" label="金额" align="center"></el-table-column>
            <el-table-column prop="cardNumber" label="账号" align="center"></el-table-column>
            <el-table-column prop="bankName" label="开户行" align="center"></el-table-column>
            <el-table-column prop="address" label="地址" align="center"></el-table-column>
            <el-table-column prop="tel" label="电话" align="center"></el-table-column>
          </el-table>
        </div>
        <!-- 关联欠款 -->
        <el-divider content-position="left" class='title-margin title-margin-t'>关联欠款</el-divider>
        <!-- 同业/直客关联欠款 -->
        <div v-if="paramsCollectionType === 2 || paramsCollectionType === 1">
          <div v-if="paramsCollectionType === 2">
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
            <el-table-column prop="date" label="出发日期" align="center"></el-table-column>
            <el-table-column prop="payablePrice" label="订单金额" align="center"></el-table-column>
            <el-table-column prop="arrearsPrice" label="未收金额" align="center"></el-table-column>
            <el-table-column prop="repaidPrice" label="已收金额" align="center"></el-table-column>
            <el-table-column prop="amountPrice" label="待审核金额" align="center"></el-table-column>
            <el-table-column prop="matchingPrice" label="本次收款金额" align="center"></el-table-column>
            <el-table-column prop="prop" label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.hasSubmitData"
                  type="primary"
                  plain
                  size="small"
                  @click="recognitionDo(scope.row)"
                >去认款</el-button>
                <el-button
                  v-else
                  type="primary"
                  plain
                  size="small"
                  @click="handleRecognitionDel(scope.row)"
                >查看认款详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 同业/直客关联欠款 END -->
        <!-- 内部收款，关联欠款 -->
        <div class="stepDv bottomDis" v-else-if="paramsCollectionType === 5">
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
        <!-- 通过、驳回弹框 -->
        <el-dialog :title="approveDialogTitle" :visible.sync="ifShowApproveDialog" width="40%" custom-class="city_list">
          <textarea rows="8" v-model="approvalOpinion" style="width: 100%; margin: 0 auto; resize: none"></textarea>
          <el-row type="flex" class="row-bg">
            <el-col :span="8" :offset="18">
              <el-button @click="handleApproveDialogCancel">取消</el-button>
              <el-button @click="handleApproveDialogConfirm" type="primary">确定</el-button>
            </el-col>
          </el-row>
        </el-dialog>
        <!-- 通过、驳回弹框 END -->
        <!-- 内部收款，关联欠款 END -->
        <!-- 去认款 -->
        <recognitionDetail :dialogVisibleDel="dialogVisibleDel" :msg="msg" @close="recognitionClose"></recognitionDetail>
        <!-- 去认款 END -->
        <!-- 认款详情 -->
        <recognitionDo :dialogVisibleDo="dialogVisibleDo" :msg="msg" @close="recognitionClose"></recognitionDo>
        <!-- 认款详情 EBD -->
      </div>
    </div>
  </div>
</template>
<script>
  import recognitionDetail from './recognitionDetail';
  import recognitionDo from './recognitionDo';
  import collectTeamDetails from '../mixins/collectTeamDetails';

  export default {
    name: "collectionTeamDetails",
    components: {
      recognitionDetail,
      recognitionDo
    },
    data() {
      return {
        refundList:{},
        printMatchingPrice: null,
        printPayablePrice: null,
        printOrderCode: null,
        printGroupCode: null,
        getOrgID: null, // 财务id
        printSureTime: null, // 打印用 - 确认时间
        printSureState: null, // 状态
      };
    },
    mixins: [ collectTeamDetails ],
    created () {},
    mounted() {},
    methods: {
      // 打印
      handleTouchPrint () {
        this.$print(this.$refs.print);
      },
    }
  }
</script>

<style scoped lang="scss">
  .loan-management{
    width: 99%;
    margin: 25px auto 50px;
    height: auto;
    border: 1px solid #e6e6e6;
    .print-content {
      display: none;
      width: 100%;
    }
    .row-content{
      width: 95%;
      margin: 0 auto;
    }
    .title-margin{
      margin-bottom: 30px;
    }
    .reimbursement-mt{
      margin: 20px 0;
    }
    .item-content{
      margin: 10px 0;
    }
    .title-margin-t{
      margin-top: 45px;
    }
    .el-divider__text{
      font-size: 17px !important
    }
    .distributor-status{
      margin-left: 4%;
    }
    .row-bg {
      padding: 13px 0;
      .grid-del{
        text-align: left;
        font-size: 14px;
      }
      .label-color{
        color: #909399;
      }
      .doc-mt-3{
        margin-top: 3px;
      }
    }
    .associatedIcon {
      font-size: 14pt;
      color: #0b84e6;
      margin: 0 0 0 15px;
      float: left;
    }
    .associatedItems {
      float: left;
      margin: 0 0 0 10px;
    }
  }
</style>
