<template>
  <div>
    <div class="container">

      <div class="handle-box">
        <el-button type="primary" icon="el-icon-refresh" class="handle-del " @click="refresh">刷新</el-button>
<!--        <el-button type="primary" icon="el-icon-lx-add" class="handle-del " @click="handleEdit" v-if="right.add">新增</el-button>-->
        <el-button type="primary" icon="el-icon-delete" class="handle-del" @click="delAllSelection" v-if="right.del">批量删除</el-button>
        <el-input v-model="query.number" placeholder="请输入订单编号" class="handle-input mr10 ml-10"></el-input>
<!--        <el-date-picker v-model="query.createTime" type="date" placeholder="选择起始时间" class="mr10">-->
<!--        </el-date-picker>-->
        <el-select v-model="query.status" placeholder="状态" class="handle-select mr10" @change="refresh">
          <el-option key="" label="全部" value=""></el-option>
<!--          <el-option key="0" label="创建订单" value="0"></el-option>-->
<!--          <el-option key="1" label="待支付" value="1"></el-option>-->
<!--          <el-option key="2" label="待商家确认" value="2"></el-option>-->
<!--          <el-option key="3" label="待发货" value="3"></el-option>-->
<!--          <el-option key="4" label="待收货" value="4"></el-option>-->
<!--          <el-option key="5" label="待上门自取" value="5"></el-option>-->
<!--          <el-option key="6" label="已收货待评价" value="6"></el-option>-->
<!--          <el-option key="7" label="完成" value="7"></el-option>-->
<!--          <el-option key="8" label="商家退单" value="8"></el-option>-->
<!--          <el-option key="9" label="取消" value="9"></el-option>-->
          <el-option :key="index" :label="item.name" :value="item.code" v-for="(item,index) in enumslist"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" v-loading="loading" header-cell-class-name="table-header" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="number" label="订单编号" width="150"></el-table-column>
        <el-table-column prop="consigneeName" label="收件人"></el-table-column>
        <el-table-column prop="consigneePhone" label="联系方式" width="120" align="center"></el-table-column>
        <el-table-column prop="addressDetail" label="收货地址" width="150"></el-table-column>
        <el-table-column prop="logisticsName" label="物流公司" width="150"></el-table-column>
        <el-table-column prop="logisticsNumber" label="物流单号" width="120"></el-table-column>
        <el-table-column prop="customerName" label="供货商" min-width="120" align="center" v-if="managerType == 2"></el-table-column>
        <el-table-column prop="totalPrice" label="合计价格"></el-table-column>
        <el-table-column prop="postage" label="配送费"></el-table-column>
        <el-table-column prop="paidAmount" label="实际支付"></el-table-column>
        <el-table-column prop="paidTime" label="支付时间" width="150"></el-table-column>
<!--        <el-table-column prop="createTime" label="创建时间"></el-table-column>-->
        <el-table-column label="状态" prop="status" align="center" width="120" >
          <template slot-scope="scope">
<!--            0-创建订单 1-待支付 2-待商家确认 3-待发货 4-待收货 5-待上门自取 6-已收货待评价 7-完成 8-商家退单 9-取消-->
            <el-tag :type="scope.row.status===2?'warning':(scope.row.status===7?'success':(scope.row.status===9?'info':(scope.row.status===8?'danger':'')))">
              {{enums[scope.row.status]}}
            </el-tag>
          </template>
        </el-table-column>
<!--        <el-table-column prop="visitCount" label="预览量" width="80" align="center"></el-table-column>-->
        <el-table-column prop="createTime" label="创建时间" width="150" align="center"></el-table-column>
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template slot-scope="scope">
<!--            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" v-if="right.edit">编辑</el-button>-->
<!--            <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)" v-if="right.del">删除</el-button>-->
            <el-button type="text" icon="el-icon-view" class="" @click="handleCheck(scope.$index, scope.row)" >查看</el-button>
            <el-button type="text" icon="el-icon-view" class="" @click="handleCheckService(scope.$index, scope.row.number)" v-if="scope.row.serviceCount > 0">查看售后</el-button>
            <el-button type="text" icon="el-icon-document-checked" class="" @click="handleUpdateStatus(3, scope.row.number)" v-if="scope.row.status ==2 && customerCode == scope.row.customerCode">受理</el-button>
            <el-button type="text" icon="el-icon-document-delete" class="red" @click="handleSome(9,scope.row.number)" v-if="scope.row.status ==2 && customerCode == scope.row.customerCode">拒绝</el-button>
            <el-button type="text" icon="el-icon-sold-out" class="" @click="handleSome(4, scope.row.number)" v-if="scope.row.status ==3 && customerCode == scope.row.customerCode">发货</el-button>
            <el-button type="text" icon="el-icon-truck" class="" @click="handleUpdateStatus(6, scope.row.number)" v-if="scope.row.status ==4 && customerCode == scope.row.customerCode">送达</el-button>
            <el-button type="text" icon="el-icon-document-checked" class="" @click="handleUpdateStatus(11, scope.row.number)" v-if="scope.row.status ==10 && customerCode == scope.row.customerCode">受理退款</el-button>
            <el-button type="text" icon="el-icon-document-delete" class="red" @click="handleSome(12, scope.row.number)" v-if="scope.row.status ==10 && customerCode == scope.row.customerCode" >拒绝退款</el-button>
            <el-button type="text" icon="el-icon-document-checked" class="" @click="handleUpdateStatus(13, scope.row.number)" v-if="scope.row.status ==11 && customerCode == scope.row.customerCode">确认退款</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
                background
                layout="total, sizes, prev, pager, next, jumper"
                :current-page="query.pageNum"
                :page-size="query.pageSize"
                :page-count="total"
                @current-change="handlePageChange"
                @size-change="handleSizeChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-drawer :title="title" :visible.sync="editVisible" size="60%" direction="rtl" :before-close="handleClose" class="commodity_drawer">
      <div class="demo-drawer__content">
        <el-tabs v-model="activeName">
          <el-tab-pane label="基本信息" name="first">
            <el-form ref="form" :model="form" label-width="120px">
              <el-form-item label="订单号" required>
                <el-input v-model="form.number" :disabled="formDisable"></el-input>
              </el-form-item>
              <el-form-item label="收货人姓名" required>
                <el-input v-model="form.consigneeName" :disabled="formDisable"></el-input>
              </el-form-item>
              <el-form-item label="收货人电话" required>
                <el-input v-model="form.consigneePhone" :disabled="formDisable"></el-input>
              </el-form-item>
              <el-form-item label="收货人地址" required>
                <el-input v-model="form.addressDetail" :disabled="formDisable"></el-input>
              </el-form-item>
    <!--          <el-form-item label="商品名称" required>-->
    <!--            <el-input v-model="form.title" :disabled="formDisable"></el-input>-->
    <!--          </el-form-item>-->
              <el-form-item label="余额支付金额" required>
                <el-input v-model="form.walletCost" :disabled="formDisable"></el-input>
              </el-form-item>
              <el-form-item label="优惠券支付金额" required>
                <el-input v-model="form.couponAmountCost" :disabled="formDisable"></el-input>
              </el-form-item>
              <el-form-item label="积分支付金额" required>
                <el-input v-model="form.pointCost" :disabled="formDisable"></el-input>
              </el-form-item>
              <el-form-item label="配送费" required>
                <el-input v-model="form.postage" :disabled="formDisable"></el-input>
              </el-form-item>
              <el-form-item label="实际支付金额" required>
                <el-input v-model="form.paidAmount" :disabled="formDisable"></el-input>
              </el-form-item>
              <el-form-item label="支付方式" required>
    <!--            <el-input v-model="form.paidType" ></el-input>-->
                <el-select v-model="form.paidType" placeholder="支付方式" :disabled="formDisable">
    <!--              <el-option key="0" label="微信APP" value="0"></el-option>-->
    <!--              <el-option key="1" label="微信JSAPI" value="1"></el-option>-->
    <!--              <el-option key="2" label="支付支付" value="2"></el-option>-->
    <!--              <el-option key="3" label="其他" value="3"></el-option>-->
                  <el-option :key="index" :label="item.name" :value="item.code" v-for="(item,index) in enumsPaidTypelist"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="购买时间" required>
                <el-input v-model="form.createTime" :disabled="formDisable"></el-input>
              </el-form-item>
              <el-form-item label="支付时间" required>
                <el-input v-model="form.paidTime" :disabled="formDisable"></el-input>
              </el-form-item>
              <el-form-item label="支付信息" required>
                <el-input v-model="form.title" :disabled="formDisable"></el-input>
              </el-form-item>
                <el-form-item label="会员备注" required>
                    <el-input v-model="form.remarks" :disabled="formDisable"></el-input>
                </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="商品信息" name="second">
            <el-table :data="form.memberOrderItemList" border class="table" ref="table"  header-cell-class-name="table-header" >
              <el-table-column prop="commodityName" label="商品名称" width="160"></el-table-column>
              <el-table-column prop="commodityIconUrl" label="缩略图" width="120" align="center">
                  <template slot-scope="scope">
                      <el-image :src="scope.row.commodityIconUrl" style="width: 50px; height: 50px" fit="cover">
                          <div slot="error" class="image-slot">
                              <i class="el-icon-picture f50 color-border"></i>
                          </div>
                      </el-image>
                  </template>
              </el-table-column>
              <el-table-column prop="salePrice" label="单价"  align="center"></el-table-column>
              <el-table-column prop="commodityAttrItemDesc" label="规格"  align="center"></el-table-column>
              <el-table-column prop="commodityCount" label="商品数量" align="center"></el-table-column>
              <el-table-column label="状态" prop="status" align="center" width="120" >
                <template slot-scope="scope" >
                  <div v-if="scope.row.orderServiceStatus || scope.row.orderServiceStatus == 0">{{enumsService[scope.row.orderServiceStatus]}}</div>
                  <div v-else>{{enums[form.status]}}</div>
                </template>
              </el-table-column>
          </el-table>
          </el-tab-pane>

          <el-tab-pane label="物流信息信息" name="three">
            <el-timeline class="p-20">
              <el-timeline-item
                      v-for="(activity, index) in express"
                      :key="index"
                      :icon="activity.icon"
                      :type="activity.type"
                      :color="activity.color"
                      :size="activity.size"
                      :timestamp="activity.time">
                {{activity.context}}
              </el-timeline-item>
            </el-timeline>
          </el-tab-pane>
        </el-tabs>
<!--        <span slot="footer" class="dialog-footer demo-drawer__footer">-->
<!--            <el-button @click="editVisible = false">取 消</el-button>-->
<!--            <el-button type="primary" @click="saveEdit" :loading="subloading">{{ subloading ? '提交中 ...' : '确 定' }}</el-button>-->
<!--        </span>-->
      </div>
    </el-drawer>

    <!--操作-->
    <el-dialog :title="titleHandle" :visible.sync="editVisibleHandle" width="30%" :before-close="closeHandle">
      <el-form ref="form" :model="formHandle" label-width="100px">
        <el-form-item label="物流公司" v-if="status == 4" required>
<!--          <el-input v-model="formHandle.logisticsIdent"></el-input>-->
          <el-select v-model="formHandle.logisticsIdent" placeholder="选择">
            <el-option :key="index" :label="item.courierName" :value="item.courierCode" v-for="(item,index) in courier"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号" v-if="status == 4" required>
          <el-input v-model="formHandle.logisticsNumber"></el-input>
        </el-form-item>
        <el-form-item label="原因" v-if="status == 9 || status == 12" required>
          <el-input type="textarea" v-model="formHandle.authReason"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="editVisibleHandle = false">取 消</el-button>
                <el-button type="primary" @click="submitHandle">确 定</el-button>
            </span>
    </el-dialog>

    <!--售后-->
    <el-dialog title="售后详情" :visible.sync="serviceVisible" width="70%" >
      <el-table :data="service" border class="table" ref="serviceTable"  header-cell-class-name="table-header">
        <el-table-column prop="orderNumber" label="订单编号"></el-table-column>
        <el-table-column prop="commodityName" label="商品名称"></el-table-column>
        <el-table-column prop="commodityIconUrl" label="缩略图" width="120" align="center">
          <template slot-scope="scope">
            <el-image :src="scope.row.commodityIconUrl" style="width: 50px; height: 50px" fit="cover">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture f50 color-border"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>
<!--        <el-table-column prop="outRefundId" label="第三方支付平台退款单号" width="180" ></el-table-column>-->
        <el-table-column prop="reason" label="申请理由" ></el-table-column>
        <el-table-column prop="remark" label="审核原因" ></el-table-column>
        <el-table-column prop="backAmount" label="退还金额" align="center" ></el-table-column>
        <el-table-column prop="backWallet" label="退还钱包金额" align="center"  width="110"></el-table-column>
        <el-table-column prop="type" label="售后类型" align="center"  width="120">
          <template slot-scope="scope">
            {{enumsType[scope.row.type]}}
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" align="center" width="120" >
          <template slot-scope="scope">
            <el-tag :type="scope.row.status===0?'warning':(scope.row.status===6?'success':(scope.row.status===8?'info':(scope.row.status===9?'danger':'')))">
              {{enumsService[scope.row.status]}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="申请时间" align="center"  width="160"></el-table-column>

      </el-table>
    </el-dialog>
  </div>
</template>

<script>
    import bus from '../../common/bus';
    export default {
        name: 'index',
        data() {
            return {
                query: {
                    status:'',
                    pageNum: 1,
                    pageSize: 10,
                    number:''
                },
                tableData: [],
                loading:false,
                multipleSelection: [],
                delList: [],
                editVisible: false,
                total: 0,
                title:'编辑',
                form: {},
                subloading:false,
                typeValue:'',
                category:[],
                right:{ // 权限
                    add:false,
                    edit:false,
                    del:false
                },
                formDisable:false,
                titleHandle:"拒绝原因",
                editVisibleHandle:false,
                formHandle:{},
                status:0,
                number:'',
                courier:[], // 物流公司
                enumslist:[],
                enums:{}, // 枚举
                enumsServicelist:[],
                enumsService:{},
                enumsPaidTypelist:[],
                enumsPaidType:{}, // 枚举
                enumsTypelist:[],
                enumsType:{},
                customerCode:'',
                managerType:'',
                service:[], // 售后服务
                serviceVisible:false,
                express:[], // 物流
                activeName:"first",
            };
        },
        mounted() {
            // 权限

            let authorities = JSON.parse(localStorage.getItem("user_information"));
            this.managerType = authorities.managerType;
            this.customerCode = authorities.customerCode;
            authorities.authorities.map((item) => {
                switch (item.authority) {
                    case 'ROLE_ORDER_EDIT':this.right.edit = true;break;
                    case 'ROLE_ORDER_DEL':this.right.del = true;break;
                    case 'ROLE_ORDER_ADD':this.right.add = true;break;
                    default:break;
                }
            })

            // 枚举
            let enums = JSON.parse(localStorage.getItem("ClassEnums"));
            let enumslist = enums.MemberOrderStatusEnum;
            let enumsServicelist = enums.MemberOrderServiceStatusEnum;
            let enumsPaidTypelist = enums.OrderPaidTypeEnum;
            let enumsTypelist = enums.MemberOrderServiceTypeEnum; // 售后类型
            for(let key in enumslist){
                this.enumslist.push(enumslist[key]);
            }
            this.enumslist.map(item => {
                this.$set(this.enums,item.code,item.name);
            })
            for(let key in enumsServicelist){
                this.enumsServicelist.push(enumsServicelist[key]);
            }
            this.enumsServicelist.map(item => {
                this.$set(this.enumsService,item.code,item.name);
            })
            console.log(this.enumsService)
            for(let key in enumsPaidTypelist){
                this.enumsPaidTypelist.push(enumsPaidTypelist[key]);
            }
            this.enumsPaidTypelist.map(item => {
                this.$set(this.enumsPaidType,item.code,item.name);
            })
            for(let key in enumsTypelist){
                this.enumsTypelist.push(enumsTypelist[key]);
            }
            this.enumsTypelist.map(item => {
                this.$set(this.enumsType,item.code,item.name);
            })

            bus.$on('message', (msg) => { // 新的订单消息
                if(msg){
                    this.getData();
                }
            });

            this.query.number = localStorage.getItem("targetCode");
            localStorage.removeItem("targetCode");
            this.getData();
            this.getCourier();
        },
        methods: {
            // 获取数据
            getData() {
                this.loading = true;
                this.$axios.post("/member-order/selectPageList?pageNum="+this.query.pageNum+"&pageSize="+this.query.pageSize,this.query).then(res => {
                    if(res.code == 200) {
                        this.tableData = res.data.records;
                        this.total = res.data.pages;
                    }else{
                        this.$message.error(res.msg);
                    }
                    this.loading = false;
                })
            },
            // 获取物流公司
            getCourier() {
                this.$axios.post("/courier-company/selectList",{}).then(res => {
                    if(res.code == 200) {
                        this.courier = res.data;
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            getDetails(number){
                this.$axios.get("/member-order/selectByPrimaryKey?number="+number).then(res => {
                    if(res.code == 200) {
                        this.form = res.data;
                        this.getExpress(this.form.logisticsNumber,this.form.logisticsIdent);
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            getExpress(logisticsNumber,logisticsIdent){
                this.$axios.post("/api/order/selectExpressByExpressNum",{logisticsNumber:logisticsNumber,logisticsIdent:logisticsIdent}).then(res => {
                    if(res.code == 200) {
                        this.express = res.data.data;
                        if(this.express.length>0){
                            this.$set(this.express[0],"icon","el-icon-truck")
                            this.$set(this.express[0],"type",'primary')
                            this.$set(this.express[0],"size",'large')
                        }
                        console.log(this.express)
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            getServiceDetails(orderNumber){
                this.$axios.post("/member-order-service/selectPageList?pageNum=1&pageSize=999",{orderNumber:orderNumber}).then(res => {
                    if(res.code == 200) {
                        this.service = res.data.records;
                        console.log(this.service)
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            // 保存编辑
            saveEdit() {
                if(!this.form.categoryCode){
                    this.$message.error("请选择分类！");
                    return;
                }
                if(!this.form.title){
                    this.$message.error("请输入标题！");
                    return;
                }
                if(!this.form.content){
                    this.$message.error("请输入内容！");
                    return;
                }
                this.subloading = true;
                this.$axios.post("/member-order/insertOrUpdate",this.form).then(res => {
                    if(res.code == 200){
                        this.$message.success(this.title+"成功！");
                        this.editVisible = false;
                        this.getData();
                    }
                    this.subloading = false;
                })
            },
            // 编,辑操作
            handleEdit(index, row) {
                this.editVisible = true;
                if(row ){
                    this.form = {
                        number:row.number,
                        categoryCode:row.categoryCode,
                        title:row.title,
                        content:row.content,
                        topside:row.topside,
                        status:row.status,
                        sortId:row.sortId,
                    }
                    this.title = '编辑';
                }else{
                    this.title = '新增';
                    this.form = {
                        categoryCode:this.query.categoryCode,
                        topside:1,
                        status:1,
                        sortId:0,
                    }
                }
            },
            handleCheck(index,row){
                this.title = '订单详情';
                this.getDetails(row.number);
                this.formDisable = true;
                this.editVisible = true;
            },
            // 状态改变操作
            handleUpdateStatus(status, number) {
                let msg = "";
                let url = "";
                if(status == 3){
                    msg = "确认接受订单";
                    url = "/member-order/confirm";
                }else if(status == 6){
                    msg = "确认商品已送达";
                    url = "/member-order/reached";
                }else if(status == 11){
                    msg = "确认受理退款";
                    url = "/member-order/acceptRefund";
                }else if(status == 13){
                    msg = "确认收到退回货物并退款";
                    url = "/member-order/confirmRefund";
                }
                this.$confirm(msg+"吗？", '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$axios.get(url+"?number="+number).then(res => {
                        if (res.code == 200) {
                            this.$message.success(msg+"成功！");
                            this.getData();
                        }
                    })
                }).catch(() => {});
            },
            submitHandle(){
                let msg = "";
                let url = "";
                if(this.status == 9){
                    if(!this.formHandle.authReason){
                        this.$message.error("请填写拒绝原因！");
                        return;
                    }
                    msg = "拒绝受理订单";
                    url = "/member-order/rejected?number="+this.number+"&authReason="+this.formHandle.authReason;
                }else if(this.status == 4){
                    if(!this.formHandle.logisticsIdent){
                        this.$message.error("请选择物流公司！");
                        return;
                    }
                    if(!this.formHandle.logisticsNumber){
                        this.$message.error("请填写物流单号！");
                        return;
                    }
                    msg = "发货";
                    url = "/member-order/deliver?number="+this.number+"&logisticsIdent="+this.formHandle.logisticsIdent+"&logisticsNumber="+this.formHandle.logisticsNumber;
                }else if(this.status == 12){
                    if(!this.formHandle.authReason){
                        this.$message.error("请填写拒绝原因！");
                        return;
                    }
                    msg = "拒绝受理订单";
                    url = "/member-order/refuseRefund?number="+this.number+"&authReason="+this.formHandle.authReason;
                }
                this.$axios.get(url).then(res => {
                    if (res.code == 200) {
                        this.$message.success(msg+"成功！");
                        this.editVisibleHandle = false;
                        this.getData();
                    }
                })
            },
            handleSome(status,number){
                this.editVisibleHandle = true;
                this.number = number;
                this.status = status;
                if(status == 9){
                    this.titleHandle = "填写拒绝原因";
                }else if(status == 4){
                    this.titleHandle = "填写发货物流";
                }else if(status == 12){
                    this.titleHandle = "填写拒绝原因";
                }
            },
            handleCheckService(status,number){ // 售后
                this.serviceVisible = true;
                this.getServiceDetails(number);
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageNum', 1);
                this.getData();
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete("/member-order/delete?number=" + row.number).then(res => {
                        if (res.code == 200) {
                            this.$message.success("删除成功！");
                            this.getData();
                        }
                    })
                }).catch(() => {});
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delAllSelection() { //批量删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    let ids = [];
                    this.multipleSelection.map(item => {
                        ids.push(item.number);
                    })
                    if(ids.length === 0){
                        this.$message.error("请选择要删除数据！");
                        return ;
                    }
                    this.$axios.post("/member-order/deleteBatch",ids).then(res => {
                        if (res.code == 200) {
                            this.$message.success("批量删除成功！");
                            this.getData();
                            this.multipleSelection = [];
                        }
                    })
                }).catch(() => {});
            },
            handleStatusChange(){
                this.getData();
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageNum', val);
                this.getData();
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.$set(this.query, 'pageNum', 1);
                this.$set(this.query, 'pageSize', val);
                this.getData();
            },
            handleClose(){
                this.editVisible = false;
                this.subloading = false;
                this.form = {};
            },
            closeHandle(){
                this.editVisibleHandle = false;
                this.formHandle = {};
            },
            refresh(){ // 刷新
                this.getData();
            }
        }
    };
</script>

<style lang="scss" >
  .el-timeline-item__node--large{
    width: 20px;
    height: 20px;
    left: -5px;
  }
  .commodity_drawer .el-drawer__body{
    overflow-y: auto;
  }
  .commodity_drawer .el-drawer__header{
    margin-bottom: 10px;
  }
  .handle-box {
    margin-bottom: 20px;
  }

  .handle-select {
    width: 120px;
  }

  .handle-input {
    width: 300px;
    display: inline-block;
  }
  .table {
    width: 100%;
    font-size: 14px;
  }
  .table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
  }
</style>
