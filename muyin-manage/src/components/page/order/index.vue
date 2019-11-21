<template>
  <div>
    <div class="container">

      <div class="handle-box">
        <el-button type="primary" icon="el-icon-refresh" class="handle-del " @click="refresh">刷新</el-button>
<!--        <el-button type="primary" icon="el-icon-lx-add" class="handle-del " @click="handleEdit" v-if="right.add">新增</el-button>-->
        <el-button type="primary" icon="el-icon-delete" class="handle-del" @click="delAllSelection" v-if="right.del">批量删除</el-button>
        <el-input v-model="query.number" placeholder="请输入订单编号" class="handle-input mr10 ml-10"></el-input>
        <el-date-picker v-model="query.createTime" type="date" placeholder="选择起始时间" class="mr10">
        </el-date-picker>
        <el-select v-model="query.status" placeholder="状态" class="handle-select mr10" @change="refresh">
          <el-option key="" label="全部" value=""></el-option>
          <el-option key="0" label="创建订单" value="0"></el-option>
          <el-option key="1" label="待支付" value="1"></el-option>
          <el-option key="2" label="待商家确认" value="2"></el-option>
          <el-option key="3" label="待发货" value="3"></el-option>
          <el-option key="4" label="待收货" value="4"></el-option>
          <el-option key="5" label="待上门自取" value="5"></el-option>
          <el-option key="6" label="已收货待评价" value="6"></el-option>
          <el-option key="7" label="完成" value="7"></el-option>
          <el-option key="8" label="商家退单" value="8"></el-option>
          <el-option key="9" label="取消" value="9"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" :loading="loading" header-cell-class-name="table-header" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="number" label="订单编号"></el-table-column>
        <el-table-column prop="consigneeName" label="收件人"></el-table-column>
        <el-table-column prop="consigneePhone" label="联系方式" width="120" align="center"></el-table-column>
        <el-table-column prop="addressDetail" label="收货地址"></el-table-column>
        <el-table-column prop="totalPrice" label="合计价格"></el-table-column>
        <el-table-column prop="paidAmount" label="实际支付"></el-table-column>
        <el-table-column prop="paidTime" label="支付时间"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="状态" prop="status" align="center" width="80" >
<!--          <template slot-scope="scope">-->
<!--            0-创建订单 1-待支付 2-待商家确认 3-待发货 4-待收货 5-待上门自取 6-已收货待评价 7-完成 8-商家退单 9-取消-->
<!--            <el-tag :type="scope.row.status===0?'warning':(scope.row.status===1?'success':'danger')">-->
<!--              {{scope.row.status===0?'草稿':(scope.row.status===1?'上线':'下线')}}-->
<!--            </el-tag>-->
<!--          </template>-->
        </el-table-column>
        <el-table-column prop="visitCount" label="预览量" width="80" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" align="center"></el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
<!--            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" v-if="right.edit">编辑</el-button>-->
<!--            <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)" v-if="right.del">删除</el-button>-->
            <el-button type="text" icon="el-icon-delete" class="red" @click="handleCheck(scope.$index, scope.row)" v-if="right.del">查看</el-button>
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
    <el-drawer :title="title" :visible.sync="editVisible" size="40%" direction="rtl" :before-close="handleClose">
      <div class="demo-drawer__content">
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
          <el-form-item label="实际支付金额" required>
            <el-input v-model="form.paidAmount" :disabled="formDisable"></el-input>
          </el-form-item>
          <el-form-item label="余额支付金额" required>
            <el-input v-model="form.walletCost" :disabled="formDisable"></el-input>
          </el-form-item>
          <el-form-item label="优惠券支付金额" required>
            <el-input v-model="form.couponAmountCost" :disabled="formDisable"></el-input>
          </el-form-item>
          <el-form-item label="积分支付金额" required>
            <el-input v-model="form.pointCost" :disabled="formDisable"></el-input>
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
          <el-form-item label="购买时间" required>
            <el-input v-model="form.createTime" :disabled="formDisable"></el-input>
          </el-form-item>
          <el-form-item label="支付时间" required>
            <el-input v-model="form.paidTime" :disabled="formDisable"></el-input>
          </el-form-item>
          <el-form-item label="支付信息" required>
            <el-input v-model="form.title" :disabled="formDisable"></el-input>
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
                editorOption: {
                    placeholder: 'Hello World'
                },
                typeValue:'',
                category:[],
                right:{ // 权限
                    add:false,
                    edit:false,
                    del:false
                },
                formDisable:false,
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

            this.getData();
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
                        this.$massage.error(res.msg);
                    }
                    this.loading = false;
                })
            },
            getDetails(number){
                this.$axios.get("/member-order/selectByPrimaryKey?number="+number).then(res => {
                    if(res.code == 200) {
                        this.form = res.data;
                    }else{
                        this.$massage.error(res.msg);
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
