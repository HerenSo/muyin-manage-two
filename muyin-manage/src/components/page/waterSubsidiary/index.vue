<template>
  <div>
    <div class="container">

      <div class="handle-box">
        <el-button type="primary" icon="el-icon-refresh" class="handle-del " @click="refresh">刷新</el-button>
        <el-button type="primary" icon="el-icon-printer" @click="handlePrinter">导出</el-button>
        <!--        <el-button type="primary" icon="el-icon-lx-add" class="handle-del " @click="handleEdit" v-if="right.add">新增</el-button>-->
<!--        <el-button type="primary" icon="el-icon-delete" class="handle-del" @click="delAllSelection" v-if="right.del">批量删除</el-button>-->
<!--        <el-select v-model="query.type" placeholder="交易类型" class="handle-select mr10 ml-10" @change="refresh">-->
<!--          <el-option key="" label="全部" value=""></el-option>-->
<!--          <el-option :key="index" :label="item.name" :value="item.code" v-for="(item,index) in enumslist"></el-option>-->
<!--        </el-select>-->
<!--        <el-select v-model="query.paidType" placeholder="交易方式" class="handle-select mr10" @change="refresh">-->
<!--          <el-option key="" label="全部" value=""></el-option>-->
<!--          <el-option :key="index" :label="item.name" :value="item.code" v-for="(item,index) in enumsPaidTypelist"></el-option>-->
<!--        </el-select>-->
        <el-input v-model="query.orderNumber" placeholder="请输入订单号查找" class="handle-input mr10 ml-10"></el-input>
<!--        <el-input v-model="query.customerCode" placeholder="请输入供货商名称查找" class="handle-input mr10 ml-10"></el-input>-->
        <el-select v-model="query.customerCode" placeholder="请选择供货商" @change="refresh" v-if="managerType == 2" class="mr10">
          <el-option v-for="(item,index) in customer" :key="index" :label="item.name" :value="item.code"></el-option>
        </el-select>
        <el-date-picker
                v-model="time"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
        </el-date-picker>
        <el-select v-model="query.status" placeholder="状态" class="handle-select ml-10 mr10" @change="refresh">
          <el-option key="" label="全部" value=""></el-option>
          <el-option :key="index" :label="item.name" :value="item.code" v-for="(item,index) in enumsStatuslist"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" v-loading="loading" header-cell-class-name="table-header" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="code" label="流水号" min-width="180"></el-table-column>
        <el-table-column prop="orderNumber" label="交易关联订单号" min-width="140"></el-table-column>
        <el-table-column prop="thirdOrderNumber" label="第三方交易流水号" min-width="140"></el-table-column>
        <el-table-column prop="content" label="交易内容" min-width="260"></el-table-column>
        <el-table-column prop="amount" label="实际入账金额" min-width="80" align="center" v-if="managerType == 2"></el-table-column>
        <el-table-column prop="amount" label="供货价" min-width="80" align="center" v-if="managerType != 2"></el-table-column>
        <el-table-column prop="customerName" label="供货商" min-width="120" v-if="managerType == 2">
          <template slot-scope="scope">{{scope.row.customerName}}</template>
        </el-table-column>
        <el-table-column prop="couponAmount" label="优惠券优惠金额" min-width="80" align="center" v-if="managerType == 2">
          <template slot-scope="scope">{{scope.row.couponAmount}}</template>
        </el-table-column>
        <el-table-column prop="pointCost" label="积分抵扣金额" min-width="80" align="center" v-if="managerType == 2">
          <template slot-scope="scope">{{scope.row.pointCost}}</template></el-table-column>
        <el-table-column prop="walletCost" label="钱包抵扣金额" min-width="80" align="center" v-if="managerType == 2"></el-table-column>
        <el-table-column prop="supplyReduce" label="供货商成本" min-width="70" align="center" v-if="managerType == 2"></el-table-column>
        <el-table-column prop="totalAmount" label="交易总金额" min-width="100" align="center" v-if="managerType == 2"></el-table-column>
        <el-table-column   label="交易类型" >
          <template slot-scope="scope">
          {{enums[scope.row.type]}}
          </template>
        </el-table-column>
        <el-table-column label="方式"   min-width="120" align="center">
          <template slot-scope="scope">
            {{enumsPaidType[scope.row.paidType]}}
          </template>
        </el-table-column>
        <el-table-column prop="platformCommission" label="平台抽成" width="80" align="center" v-if="managerType == 2"></el-table-column>
        <el-table-column  label="流水状态" >
          <template slot-scope="scope">
            <el-tag :type="scope.row.status===0?'':(scope.row.status===1?'success':'info')">
              {{enumsStatus[scope.row.status]}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="交易时期" width="160" align="center"></el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template slot-scope="scope">
<!--            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" v-if="right.edit">编辑</el-button>-->
<!--            <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)" v-if="right.del">删除</el-button>-->
<!--            <el-button type="text" icon="el-icon-delete" class="red" @click="handleCheck(scope.$index, scope.row)" v-if="right.del">查看</el-button>-->
            <el-button type="text" icon="el-icon-view" class="" @click="handleCheck(scope.$index, scope.row)" >查看订单</el-button>
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
            <el-table :data="form.memberOrderItemList" border class="table" ref="table" v-loading="loading" header-cell-class-name="table-header" >
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
                  <div v-else>{{enumsOrder[form.status]}}</div>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

        </el-tabs>
        <!--        <span slot="footer" class="dialog-footer demo-drawer__footer">-->
        <!--            <el-button @click="editVisible = false">取 消</el-button>-->
        <!--            <el-button type="primary" @click="saveEdit" :loading="subloading">{{ subloading ? '提交中 ...' : '确 定' }}</el-button>-->
        <!--        </span>-->
      </div>
    </el-drawer>

  </div>
</template>

<script>
    import bus from '../../common/bus';
    export default {
        name: 'index',
        data() {
            return {
                query: {
                    startTime: '',
                    endTime:"",
                    customerCode: '',
                    status:'',
                    pageNum: 1,
                    pageSize: 10
                },
                time:[],
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                tableData: [],
                loading:false,
                multipleSelection: [],
                delList: [],
                editVisible: false,
                activeName:'first',
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
                managerType:'',
                formDisable:false,
                enumslist:[],
                enumsPaidTypelist:[],
                enumsStatuslist:[],
                enums:{}, // 交易类型枚举
                enumsPaidType:{}, // 交易方式枚举
                enumsStatus:{},
                enumsOrderlist:[],
                enumsOrder:{}, // 枚举
                enumsServicelist:[],
                enumsService:{},
                formDisable:false,
                customer:[], // 供货商
            };
        },
        mounted() {
            // 权限

            let authorities = JSON.parse(localStorage.getItem("user_information"));
            this.managerType = authorities.managerType;
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
            let enumslist = enums.WalletBillTypeEnum; // 交易类型
            let enumsPaidTypelist = enums.PaidTypeEnum;
            let enumsStatuslist = enums.WalletBillStatusEnum;
            let enumsOrderlist = enums.MemberOrderStatusEnum;
            let enumsServicelist = enums.MemberOrderServiceStatusEnum;
            for(let key in enumslist){
                this.enumslist.push(enumslist[key]);
            }
            this.enumslist.map(item => {
                this.$set(this.enums,item.code,item.name);
            })

            for(let key in enumsPaidTypelist){
                this.enumsPaidTypelist.push(enumsPaidTypelist[key]);
            }
            this.enumsPaidTypelist.map(item => {
                this.$set(this.enumsPaidType,item.code,item.name);
            })

            for(let key in enumsStatuslist){
                this.enumsStatuslist.push(enumsStatuslist[key]);
            }
            this.enumsStatuslist.map(item => {
                this.$set(this.enumsStatus,item.code,item.name);
            })
            for(let key in enumsOrderlist){
                this.enumsOrderlist.push(enumsOrderlist[key]);
            }
            this.enumsOrderlist.map(item => {
                this.$set(this.enumsOrder,item.code,item.name);
            })
            for(let key in enumsServicelist){
                this.enumsServicelist.push(enumsServicelist[key]);
            }
            this.enumsServicelist.map(item => {
                this.$set(this.enumsService,item.code,item.name);
            })

            this.getData();
            this.getCustomer();
        },
        methods: {
            // 获取数据
            getData() {
                if(this.time.length>0){
                    this.$set(this.query,"startTime",this.time[0])
                    this.$set(this.query,"endTime",this.time[1])
                }
                this.loading = true;
                this.$axios.post("/wallet-bill/selectPageList?pageNum="+this.query.pageNum+"&pageSize="+this.query.pageSize,this.query).then(res => {
                    if(res.code == 200) {
                        this.tableData = res.data.records;
                        this.total = res.data.pages;
                    }else{
                        this.$message.error(res.msg);
                    }
                    this.loading = false;
                })
            },
            getCustomer(){// 获取供销商
                this.$axios.post("/customer/selectList",{}).then(res => {
                    if(res.code == 200){
                        this.customer = res.data;
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            getDetails(number){
                this.$axios.get("/member-order/selectByPrimaryKey?number="+number).then(res => {
                    if(res.code == 200) {
                        this.form = res.data;
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
                    this.form = row;
                    this.title = '编辑';
                }else{
                    this.title = '新增';
                    this.form = {}
                }
            },
            handleCheck(index,row){
                this.title = '订单详情';
                this.getDetails(row.orderNumber);
                this.formDisable = true;
                this.editVisible = true;
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
                // 二次确认删除
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
            handlePrinter(){
                if(this.time.length>0){
                    this.$set(this.query,"startTime",this.time[0])
                    this.$set(this.query,"endTime",this.time[1])
                }
                // this.$delete(this.query,"pageNum")
                // this.$delete(this.query,"pageSize")
                let ret = ''
                for (let it in this.query) {
                    if(encodeURIComponent(this.query[it]) && it != "pageNum" && it != "pageSize"){
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(this.query[it]) + '&'
                    }
                }
                window.open(this.baseUrl+'/wallet-bill/exportWalletBill?'+ret,'_blank');
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
            refresh(){ // 刷新
                this.getData();
            }
        }
    };
</script>

<style lang="scss" scoped>
  .handle-box {
    margin-bottom: 20px;
  }

  .handle-select {
    width: 120px;
  }

  .handle-input {
    width: 200px;
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
