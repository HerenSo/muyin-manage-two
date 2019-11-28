<template>
  <div>
    <div class="container">

      <div class="handle-box">
        <el-button type="primary" icon="el-icon-refresh" class="handle-del " @click="refresh">刷新</el-button>
        <!--        <el-button type="primary" icon="el-icon-lx-add" class="handle-del " @click="handleEdit" v-if="right.add">新增</el-button>-->
<!--        <el-button type="primary" icon="el-icon-delete" class="handle-del" @click="delAllSelection" v-if="right.del">批量删除</el-button>-->
        <el-select v-model="query.type" placeholder="交易类型" class="handle-select mr10 ml-10" @change="refresh">
          <el-option key="" label="全部" value=""></el-option>
          <el-option :key="index" :label="item.name" :value="item.code" v-for="(item,index) in enumslist"></el-option>
        </el-select>
        <el-select v-model="query.paidType" placeholder="交易方式" class="handle-select mr10" @change="refresh">
          <el-option key="" label="全部" value=""></el-option>
          <el-option :key="index" :label="item.name" :value="item.code" v-for="(item,index) in enumsPaidTypelist"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" :loading="loading" header-cell-class-name="table-header" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="code" label="流水号" min-width="120"></el-table-column>
        <el-table-column prop="orderNumber" label="交易关联订单号" min-width="130"></el-table-column>
        <el-table-column prop="thirdOrderNumber" label="第三方交易流水号" min-width="140"></el-table-column>
        <el-table-column prop="content" label="交易内容"></el-table-column>
        <el-table-column prop="amount" label="实际支付金额" min-width="120"></el-table-column>
        <el-table-column prop="cardCost" label="会员卡交易面额" min-width="130"></el-table-column>
        <el-table-column prop="cardNumber" label="会员卡号"></el-table-column>
        <el-table-column prop="couponAmount" label="优惠券优惠金额" min-width="130"></el-table-column>
        <el-table-column prop="point" label="积分消耗数值" min-width="120"></el-table-column>
        <el-table-column prop="pointCost" label="积分抵扣金额" min-width="120"></el-table-column>
        <el-table-column prop="walletCost" label="钱包抵扣金额" min-width="120"></el-table-column>
        <el-table-column prop="totalAmount" label="交易总金额" min-width="100"></el-table-column>
        <el-table-column prop="type" label="交易类型" >
          <template slot-scope="scope">
          {{enums[scope.row.type]}}
          </template>
        </el-table-column>
        <el-table-column label="方式" prop="paidType"  min-width="120" align="center">
          <template slot-scope="scope">
            {{enumsPaidType[scope.row.paidType]}}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="流水状态" >
          <template slot-scope="scope">
            <el-tag :type="scope.row.status===0?'':(scope.row.status===1?'success':'danger')">
              {{scope.row.status===0?'交易中':(scope.row.status===1?'已入账':'已取消')}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="platformCommission" label="平台抽成" width="80" align="center"></el-table-column>
        <el-table-column prop="createTime" label="交易时期" width="160" align="center"></el-table-column>
<!--        <el-table-column label="操作" width="120" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" v-if="right.edit">编辑</el-button>-->
<!--            <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)" v-if="right.del">删除</el-button>-->
<!--            <el-button type="text" icon="el-icon-delete" class="red" @click="handleCheck(scope.$index, scope.row)" v-if="right.del">查看</el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
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
    <el-drawer :title="title" :visible.sync="editVisible" size="40%" direction="rtl" :before-close="handleClose">
      <div class="demo-drawer__content">
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="订单号" required>
            <el-input v-model="form.number" :disabled="formDisable"></el-input>
          </el-form-item>
          <el-form-item label="支付方式" required>
            <!--            <el-input v-model="form.paidType" ></el-input>-->
            <el-select v-model="form.paidType" placeholder="支付方式" :disabled="formDisable">
              <el-option key="0" label="微信APP" value="0"></el-option>
              <el-option key="1" label="微信JSAPI" value="1"></el-option>
              <el-option key="2" label="支付支付" value="2"></el-option>
              <el-option key="3" label="其他" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
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
                    createTime: '',
                    title: '',
                    status:'',
                    pageNum: 1,
                    pageSize: 10
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
                enumslist:[],
                enumsPaidTypelist:[],
                enums:{}, // 交易类型枚举
                enumsPaidType:{} // 交易方式枚举
            };
        },
        mounted() {
            // 权限

            let authorities = JSON.parse(localStorage.getItem("user_information"));
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

            this.getData();
        },
        methods: {
            // 获取数据
            getData() {
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
