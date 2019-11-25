<template>
    <div>
        <div class="container">

            <div class="handle-box">
                <el-button type="primary" icon="el-icon-refresh" class="handle-del " @click="refresh">刷新</el-button>
                <el-button type="primary" icon="el-icon-lx-add" class="handle-del " @click="handleEdit" v-if="right.add">新增</el-button>
                <el-button type="primary" icon="el-icon-delete" class="handle-del" @click="delAllSelection" v-if="right.del">批量删除</el-button>
                <el-input v-model="query.couponName" placeholder="请输入优惠券名称" class="handle-input mr10 ml-10"></el-input>
                <el-date-picker v-model="query.starttime" type="date" placeholder="生效时间" class="mr10">
                </el-date-picker>
                <el-select v-model="query.status" placeholder="状态" class="handle-select mr10" @change="refresh">
                    <el-option key="" label="全部" value=""></el-option>
                    <el-option key="0" label="未审核" value="0"></el-option>
                    <el-option key="1" label="审核通过" value="1"></el-option>
                    <el-option key="2" label="审核不通过" value="2"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" :loading="loading" header-cell-class-name="table-header" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="couponName" label="优惠券名称" min-width="120px"></el-table-column>
                <el-table-column prop="preferentialAmount" label="优惠金额" align="center"></el-table-column>
                <el-table-column prop="triggerAmount" label="触发金额" align="center"></el-table-column>
                <el-table-column prop="starttime" label="生效时间" width="150" align="center"></el-table-column>
                <el-table-column prop="endtime" label="失效时间" width="150" align="center"></el-table-column>
                <el-table-column prop="paymentAmount" label="发放量" align="center">
                  <template slot-scope="scope">
                    {{scope.row.paymentAmount == -1 ? "无限制":scope.row.paymentAmount}}
                  </template>
                </el-table-column>
                <el-table-column  label="适用范围">
                    <template slot-scope="scope">
                        <span v-for="(item,index) in scope.row.scope" :key="index">{{item == "0" ? "无限制":(item == "1"?"部分商品可用":(item == "2"?"部分商品不可用":"限在线配送订单"))}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="叠加类型" prop="superpositionRule" align="center" width="120" >
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.superpositionRule===0?'warning':(scope.row.superpositionRule===1?'success':'')">
                            {{scope.row.superpositionRule===0?'不可叠加':(scope.row.superpositionRule===1?'全部可叠加':'')}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="状态" prop="status" align="center" width="120" >
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status===0?'warning':(scope.row.status===1?'success':(scope.row.status===2?'danger':''))">
                            {{scope.row.status===0?'未审核':(scope.row.status===1?'审核通过':(scope.row.status===2?'审核不通过':''))}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createUserid" label="创建用户"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="160" align="center"></el-table-column>
                <el-table-column label="操作" width="120" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" v-if="right.edit">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)" v-if="right.del">删除</el-button>
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
        <el-drawer :title="title" :visible.sync="editVisible" size="70%" direction="rtl" :before-close="handleClose" class="commodity_drawer">
            <div class="demo-drawer__content">
                <el-form ref="form" :model="form" label-width="120px">
                    <el-form-item label="优惠券名称" required>
                        <el-input v-model="form.couponName"></el-input>
                    </el-form-item>
                    <el-form-item label="优惠金额" required>
                        <el-input v-model="form.preferentialAmount"></el-input>
                    </el-form-item>
                    <el-form-item label="有效触发金额" required>
                        <el-input v-model="form.triggerAmount"></el-input>
                    </el-form-item>
                    <el-form-item label="发放量" required>
                        <el-input v-model="form.paymentAmount" class="width100" ></el-input><el-radio class="ml-10" v-model="form.paymentAmount" border :label="-1">无限制</el-radio>
                    </el-form-item>
                    <el-form-item label="生效时间" required>
                        <el-date-picker v-model="form.starttime" type="date" placeholder="选择">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="失效时间" required>
                        <el-date-picker v-model="form.endtime" type="date" placeholder="选择">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="适用范围" required>
                        <el-select v-model="form.scope" placeholder="适用范围" value-key="value">
                            <el-option key="0" label="无限制" :value="0"></el-option>
                            <el-option key="1" label="部分商品可用" :value="1"></el-option>
                            <el-option key="2" label="部分商品不可用" :value="2"></el-option>
                            <el-option key="3" label="限在线配送订单" :value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择商品" required>
                      <div style="display: flex">
                        <el-tree
                                :data="category"
                                :props="props"
                                show-checkbox
                                @check-change="handleCheckChange">
                        </el-tree>
                        <div style="flex: 1; padding:0 10px">
                          <el-table :data="tableDataCommodity" border class="table" ref="multipleTable" :loading="loadingCommodity" header-cell-class-name="table-header" @selection-change="handleCommodityChange">
                            <el-table-column type="selection" width="55" align="center"></el-table-column>
                            <!--        <el-table-column prop="code" label="编号"></el-table-column>-->
                            <el-table-column prop="name" label="商品名称" ></el-table-column>
                            <el-table-column prop="createName" label="缩略图" width="120" align="center">
                              <template slot-scope="scope">
                                <el-image :src="scope.row.iconUrl" style="width: 50px; height: 50px" fit="cover">
                                  <div slot="error" class="image-slot">
                                    <i class="el-icon-picture f50 color-border"></i>
                                  </div>
                                </el-image>
                              </template>
                            </el-table-column>
                          </el-table>
                          <div class="pagination">
                            <el-pagination
                                    background
                                    layout="total, prev, pager, next, jumper"
                                    :current-page="queryCommodity.pageNum"
                                    :page-count="totalCommodity"
                                    @current-change="handlePageChange"
                                    @size-change="handleSizeChange"
                            ></el-pagination>
                          </div>
                        </div>
                      </div>
                    </el-form-item>
                    <el-form-item label="叠加类型" required>
                        <el-select v-model="form.superpositionRule" placeholder="叠加类型">
                            <el-option key="0" label="不可叠加" :value="0"></el-option>
                            <el-option key="1" label="全部可叠加" :value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer demo-drawer__footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit" :loading="subloading">{{ subloading ? '提交中 ...' : '确 定' }}</el-button>
                </span>
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
                props: {
                    id:'code',
                    label: 'name',
                    children: 'subCategorys'
                },
                typeValue:'',
                category:[],
                tableDataCommodity:[],
                queryCommodity: {
                    status:'',
                    pageNum: 1,
                    pageSize: 10
                },
                totalCommodity:'',
                loadingCommodity:false,
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
                    case 'ROLE_COUPON_EDIT':this.right.edit = true;break;
                    case 'ROLE_COUPON_DEL':this.right.del = true;break;
                    case 'ROLE_COUPON_ADD':this.right.add = true;break;
                    default:break;
                }
            })

            this.getData();
            this.getCategory();
        },
        methods: {
            // 获取数据
            getData() {
                this.loading = true;
                this.$axios.post("/coupon/selectPageList?pageNum="+this.query.pageNum+"&pageSize="+this.query.pageSize,this.query).then(res => {
                    if(res.code == 200) {
                        this.tableData = res.data.records;
                        this.total = res.data.pages;

                    }else{
                        this.$massage.error(res.msg);
                    }
                    this.loading = false;
                })
            },
            getCategory(){// 获取分类
                let params = {
                    type:0,
                    status:0
                }
                this.$axios.post("/category/queryCategoryTree",params).then(res => {
                    if(res.code == 200){
                        this.category = res.data;
                    }else{
                        this.$massage.error(res.msg);
                    }
                })
            },
            // 获取商品数据
            getCommodity() {
                this.loadingCommodity = true;
                this.$axios.post("/commodity/selectPageList?pageNum="+this.queryCommodity.pageNum+"&pageSize="+this.queryCommodity.pageSize,this.queryCommodity).then(res => {
                    if(res.code == 200) {
                        this.tableDataCommodity = res.data.records;
                        this.totalCommodity = res.data.pages;
                    }else{
                        this.$massage.error(res.msg);
                    }
                    this.loadingCommodity = false;
                })
            },
            getDetails(code){
                this.$axios.get("/coupon/selectByPrimaryKey?code="+code).then(res => {
                    if(res.code == 200) {
                        this.form = res.data;
                    }else{
                        this.$massage.error(res.msg);
                    }
                })
            },
            // 保存编辑
            saveEdit() {
                if(!this.form.couponName){
                    this.$message.error("请输入优惠券名称！");
                    return;
                }
                if(!this.form.preferentialAmount){
                    this.$message.error("请输入优惠金额！");
                    return;
                }
                if(!this.form.paymentAmount){
                    this.$message.error("请输入发放量！");
                    return;
                }
                if(!this.form.triggerAmount){
                    this.$message.error("请输入优惠券有效触发金额！");
                    return;
                }
                this.form.scope = this.form.scope.join(',');
                this.$set(this.form, 'type', 0);
                this.subloading = true;
                this.$axios.post("/coupon/insertOrUpdate",this.form).then(res => {
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
                this.getDetails(row.code);
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
                    this.$axios.delete("/coupon/delete?number=" + row.code).then(res => {
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
                        ids.push(item.code);
                    })
                    this.$axios.post("/coupon/deleteBatch",ids).then(res => {
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
            //  选商品
            handleCommodityChange(val){

            },
            // 选分类
            handleCheckChange(data, checked, indeterminate) {
                console.log(data, checked, indeterminate);
                if(checked){
                    this.queryCommodity.categoryCode = data.code;
                    this.queryCommodity.pageNum = 1;
                    this.getCommodity();
                }else {
                    this.tableDataCommodity = [];
                }
            },
            refresh(){ // 刷新
                this.getData();
            }
        }
    };
</script>

<style lang="scss" scoped>

  .commodity_drawer .el-drawer__body{
    overflow-y: auto;
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
