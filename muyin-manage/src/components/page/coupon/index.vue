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
                        {{scope.row.scope == "0" ? "无限制":(scope.row.scope == "1"?"部分商品可用":(scope.row.scope == "2"?"部分商品不可用":"限在线配送订单"))}}
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
                    <el-form-item label="选择商品" required v-if="form.scope == 1 || form.scope == 2">
                      <div class="selectedCommodity">
                        <el-tree
                                class="categoryTree"
                          :data="category"
                          :props="props"
                          show-checkbox
                          highlight-current
                          node-key="code"
                          accordion
                          @current-change="handleCheckChange"
                          @check="handleCheckCategory">
                        </el-tree>
                        <div class="commodityTable">
                          <el-table
                                  :data="tableDataCommodity"
                                  border class="table"
                                  ref="multipleCommodityTable"
                                  :loading="loadingCommodity"
                                  header-cell-class-name="table-header"
                                  @selection-change="handleCommodityChange"
                                  @select="handleCommoditySelect">
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
                                    v-if="tableDataCommodity.length > 0"
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
                      <div class="pt-10">已选分类：
                        <el-tag
                                :key="tag"
                                v-for="(tag,i) in couponConditionsList"
                                size="medium"
                                style="margin-left: 0;margin-right: 10px">
                          {{tag.name}}
                        </el-tag>
                      </div>
                      <div>已选商品：
                        <el-tag
                                :key="tag"
                                v-for="(tag,i) in couponCommodityList"
                                size="medium"
                                style="margin-left: 0;margin-right: 10px">
                          {{tag.name}}
                        </el-tag>
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
                    pageSize: 5
                },
                totalCommodity:'',
                loadingCommodity:false,
                couponConditionsList:[], // 已选分类
                couponCommodityList:[], // 已选商品
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
            this.getCommodity();
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
                        this.tableDataCommodity.forEach(item => {
                            // this.couponCommodityList.map(i => {
                            //     if(item.code == i.code){
                            //         console.log(item.name)
                            //         this.$refs.multipleCommodityTable.toggleRowSelection(item,true);
                            //     }
                            // })

                            if(this.couponCommodityList.find(i => item.code == i.code)){
                                this.$nextTick(function () {
                                    this.$refs.multipleCommodityTable.toggleRowSelection(item,true);
                                }.bind(this));
                            }
                        })

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
                this.form.couponConditionsList = this.couponConditionsList.concat(this.couponCommodityList);
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
                if(!this.form.starttime){
                    this.$message.error("请选择生效时间！");
                    return;
                }
                if(!this.form.endtime){
                    this.$message.error("请选择失效时间！");
                    return;
                }
                if(!this.form.scope){
                    this.$message.error("请选择适用范围！");
                    return;
                }
                if((this.form.scope == 1 || this.form.scope == 2) && this.form.couponConditionsList.length == 0){
                    this.$message.error("请选择分类或商品！");
                    return;
                }
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
                    this.form ={
                        code:row.code,
                        couponName:row.couponName,
                        preferentialAmount : row.preferentialAmount,
                        paymentAmount : row.paymentAmount,
                        triggerAmount : row.triggerAmount,
                        starttime : row.starttime,
                        endtime : row.endtime,
                        scope : row.scope,
                        superpositionRule : row.superpositionRule,
                        couponConditionsList : row.couponConditionsList
                    };
                    this.couponConditionsList = []; // 已选分类
                    this.couponCommodityList = []; // 已选商品
                    this.form.couponConditionsList.map(item => {
                        if(item.commodityCode){ // 商品
                            this.couponCommodityList.push(item);
                        }
                        if(item.categoryCode){ // 分类
                            this.couponConditionsList.push(item);
                        }
                    })
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
                    this.$axios.delete("/coupon/delete?code=" + row.code).then(res => {
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
                this.getCategory();
                this.queryCommodity.pageNum = 1;
                this.getCommodity();
            },
            //  选商品
            handleCommoditySelect(selection, row){
                // console.log(selection, row)
                if(!this.loadingCommodity){
                    if(this.couponCommodityList.find((item) => (row.code == item.commodityCode))){
                        this.couponCommodityList = this.couponCommodityList.filter((item) => (row.code != item.code));
                    }else{
                        this.couponCommodityList.push({name:row.name,commodityCode:row.code,code:row.code,type:this.form.scope == 1?1:0});
                    }
                }

            },
            handleCommodityChange(val){
                // console.log(val,)
                // if(val.length >0){
                //     val.map(item => {
                //         this.couponCommodityList.push({categoryCode:item.categoryCode,name:item.name,commodityCode:item.code,type:this.form.scope == 1?1:0});
                //     })
                // }
            },
            // 选分类
            handleCheckCategory(row,data){
                // console.log(row,data);
                this.couponConditionsList = [];
                let categoryItem = {};
                data.checkedNodes.map((item,index) => {
                    // console.log(item)
                    if(item.parentCode || item.subCategorys.length == 0){
                        categoryItem = {
                            categoryCode:item.code,
                            name:item.name,
                            type:this.form.scope == 1?1:0,
                        }
                        this.couponConditionsList.push(categoryItem)
                    }
                })
                console.log(this.couponConditionsList)
            },
            handleCheckChange(data,row) {
                // console.log(data,row);
                // if(checked){
                    this.queryCommodity.categoryCode = data.code;
                    this.queryCommodity.pageNum = 1;
                    this.getCommodity();
                // }else {
                //     this.tableDataCommodity = [];
                // }
            },
            refresh(){ // 刷新
                this.getData();
            }
        }
    };
</script>

<style lang="scss" >

  .commodity_drawer .el-drawer__body{
    overflow-y: auto;
  }
  .selectedCommodity{
    display: flex;
    width: 100%;
    border:1px solid #ededed;
  }
  .categoryTree{
    flex: 1;
    border-right:1px solid #ededed;
  }
  .commodityTable{
    flex: 3;
    /*padding: 0 10px;*/
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
