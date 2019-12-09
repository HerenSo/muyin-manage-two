<template>
  <div>
    <div class="container">

      <div class="handle-box">
        <el-button type="primary" icon="el-icon-refresh" class="handle-del " @click="refresh">刷新</el-button>
        <!--        <el-button type="primary" icon="el-icon-lx-add" class="handle-del " @click="handleEdit" v-if="right.add">新增</el-button>-->
        <!--        <el-button type="primary" icon="el-icon-delete" class="handle-del" @click="delAllSelection" v-if="right.del">批量删除</el-button>-->
        <el-input v-model="query.orderNumber" placeholder="请输入订单编号" class="handle-input mr10 ml-10"></el-input>
        <el-select v-model="query.status" placeholder="状态" class="handle-select mr10" @change="refresh">
          <el-option key="" label="全部" value=""></el-option>
          <el-option :key="index" :label="item.name" :value="item.code" v-for="(item,index) in enumslist"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" :loading="loading" header-cell-class-name="table-header">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
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
        <el-table-column prop="outRefundId" label="第三方支付平台退款单号" width="180" ></el-table-column>
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
              {{enums[scope.row.status]}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="申请时间" align="center"  width="160"></el-table-column>
        <el-table-column label="操作" width="140" align="center" fixed="right">
          <template slot-scope="scope">
            <!--            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" v-if="right.edit">编辑</el-button>-->
            <!--            <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)" v-if="right.del">删除</el-button>-->
            <!--            <el-button type="text" icon="el-icon-delete" class="red" @click="handleCheck(scope.$index, scope.row)" v-if="right.del">查看</el-button>-->
            <el-button type="text" icon="el-icon-document-checked" class="" @click="handleAudit(1, scope.row)" v-if="scope.row.status ==0">审核通过</el-button>
            <el-button type="text" icon="el-icon-document-delete" class="red" @click="handleAudit(9, scope.row)" v-if="scope.row.status ==0">审核不通过</el-button>
            <el-button type="text" icon="el-icon-document-checked" class="" @click="handleUpdateStatus(6, scope.row)" v-if="scope.row.status ==1 && (scope.row.type ==0 || scope.row.type ==3)">确认收到退还货物</el-button>
<!--            <el-button type="text" icon="el-icon-sell" class="" @click="handleUpdateStatus(6, scope.row)" v-if="scope.row.status ==1 && scope.row.type===3">确认换货送达</el-button>-->
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
    <!--操作-->
    <el-dialog :title="titleHandle" :visible.sync="editVisible" width="30%" :before-close="closeHandle">
      <el-form ref="form" :model="form" label-width="60px">
        <el-form-item label="备注" >
          <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitHandle">确 定</el-button>
            </span>
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
                    pageSize: 10
                },
                tableData: [],
                loading:false,
                multipleSelection: [],
                delList: [],
                editVisible: false,
                titleHandle:"确定审核通过",
                total: 0,
                form: {
                    remark:''
                },
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
                enumsTypelist:[],
                enums:{}, // 枚举
                enumsType:{}
            };
        },
        mounted() {
            // 权限
            let authorities = JSON.parse(localStorage.getItem("user_information"));
            authorities.authorities.map((item) => {
                switch (item.authority) {
                    case 'ROLE_AFTERSALES_SERVICE_EDIT':this.right.edit = true;break;
                    default:break;
                }
            })

            // 枚举
            let enums = JSON.parse(localStorage.getItem("ClassEnums"));
            let enumslist = enums.MemberOrderServiceStatusEnum;
            let enumsTypelist = enums.MemberOrderServiceTypeEnum;
            for(let key in enumslist){
                this.enumslist.push(enumslist[key]);
            }
            this.enumslist.map(item => {
                this.$set(this.enums,item.code,item.name);
            })
            for(let key in enumsTypelist){
                this.enumsTypelist.push(enumsTypelist[key]);
            }
            this.enumsTypelist.map(item => {
                this.$set(this.enumsType,item.code,item.name);
            })

            this.getData();
        },
        methods: {
            // 获取数据
            getData() {
                this.loading = true;
                this.$axios.post("/member-order-service/selectPageList?pageNum="+this.query.pageNum+"&pageSize="+this.query.pageSize,this.query).then(res => {
                    if(res.code == 200) {
                        this.tableData = res.data.records;
                        this.total = res.data.pages;
                    }else{
                        this.$message.error(res.msg);
                    }
                    this.loading = false;
                })
            },
            handleAudit(status, row){
                this.status = status;
                this.orderNumber = row.code;
                if(status == 1){
                    this.titleHandle = "确定审核通过";
                }else if(status == 9){
                    this.titleHandle = "确定审核不通过";
                }
                this.editVisible = true;
            },
            submitHandle(){
                let url = '/member-order/confirmOrderService';
                // if(this.status == 1){
                //     url = "/member-order/confirmOrderService";
                // }else if(this.status == 9){
                //     url = "/member-order/refuseRefund";
                // }
                this.$axios.get(url+"?orderServiceCode="+this.orderNumber+"&remark="+this.form.remark+"&status="+this.status).then(res => {
                    if (res.code == 200) {
                        this.$message.success(this.titleHandle+"成功！");
                        this.getData();
                        this.editVisible = false;
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            // 状态改变操作
            handleUpdateStatus(status, row) {
                let msg = "";
                let url = "";
                if(status == 6 && (row.type ==0 || row.type ==2)){
                    msg = "收到退还货物";
                    url = "/member-order/confirmOrderServiceReceived?orderServiceCode="+row.code;
                }else if(status == 6 && row.type ==3){
                    msg = "换货送达";
                    url = "/member-order/confirmOrderServiceReceived?orderServiceCode="+row.code;
                }
                this.$confirm("确定"+msg+"吗？", '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$axios.get(url).then(res => {
                        if (res.code == 200) {
                            this.$message.success(msg+"成功！");
                            this.getData();
                        }else{
                            this.$message.error(res.msg);
                        }
                    })
                }).catch(() => {});
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageNum', 1);
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
            closeHandle(){
                this.editVisible = false;
                this.form = {
                    remark:''
                };
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
