<template>
  <div>
    <div class="container mb-20 pt-20">
      <h4 class="color-666">提现管理</h4>
    </div>
    <div class="container">

      <div class="handle-box">
        <el-button type="primary" icon="el-icon-refresh" class="handle-del " @click="refresh">刷新</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" :loading="loading" header-cell-class-name="table-header" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="bankUsername" label="提现持卡人"></el-table-column>
        <el-table-column prop="bankUserphone" label="持卡人手机号" width="120" align="center"></el-table-column>
        <el-table-column prop="bankNumber" label="银行卡卡号" width="120" align="center"></el-table-column>
        <el-table-column prop="bankName" label="银行卡名" width="120" align="center"></el-table-column>
        <el-table-column prop="amount" label="提现总金额" width="120" align="center"></el-table-column>
        <el-table-column prop="serviceCharge" label="应扣除手续费金额" width="120" align="center"></el-table-column>
        <el-table-column prop="reason" label="审核缘由" width="120" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" width="120" align="center"></el-table-column>
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-document-checked" class="" @click="auditMemberWithdrawal(scope.row)" v-if="scope.row.status ==0">审核通过</el-button>
            <el-button type="text" icon="el-icon-document-delete" class="red" @click="showAuditWithdrawal(scope.row)" v-if="scope.row.status ==0">审核不通过</el-button>
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
        ></el-pagination>
      </div>
    </div>

    <!--操作-->
    <el-dialog :title="titleHandle" :visible.sync="editVisibleHandle" width="30%" :before-close="closeHandle">
      <el-form ref="form" label-width="100px">
        <el-form-item label="原因" required>
          <el-input type="textarea" v-model="reason"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="editVisibleHandle = false">取 消</el-button>
                <el-button type="primary" @click="updateWithdrawalFailure">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';
    import bus from '../../common/bus';
    import vCategory from '../../common/category.vue';
    export default {
        name: 'index',
        data() {
            return {
                dynamicTags: [],
                query: {
                    pageNum: 1,
                    pageSize: 10
                },
                tableData: [],
                loading:false,
                total: 0,
                title:'编辑',
                form: {},
                subloading:false,
                typeValue:'',
                apiType:"",
                username:'',
                userid:"",
                querySignRecord: {
                    pageNum: 1,
                    pageSize: 10
                },
                right:{ // 权限
                    audit:false
                },
              editVisibleHandle:false,
              withdrawalCode: '',
              reason: '',
            };
        },
        mounted() {
            // 权限
            let authorities = JSON.parse(localStorage.getItem("user_information"));
            authorities.authorities.map((item) => {
                switch (item.authority) {
                    case 'MEMBER_WITHDRAWAL_RECORD_AUDIT':this.right.audit = true;break;
                    default:break;
                }
            })

            this.getData();
        },
        methods: {
            // 获取数据
            getData() {
                this.loading = true;
                this.$axios.post("/member-withdrawal-record/selectPageList?pageNum="+this.query.pageNum+"&pageSize="+this.query.pageSize,this.query).then(res => {
                    if(res.code == 200) {
                        this.tableData = res.data.records;
                        this.total = res.data.pages;
                    }else{
                        this.$message.error(res.msg);
                    }
                    this.loading = false;
                })
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageNum', 1);
                this.getData();
            },
            // 状态改变操作
            auditMemberWithdrawal(row) {
                this.$confirm("确定审核通过吗？", '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/member-withdrawal-record/auditMemberWithdrawal",{code :row.code, dataType:'form'}).then(res => {
                        if (res.code === 200) {
                            this.$message.success("审核成功！");
                            this.getData();
                        }
                    })
                }).catch(() => {});
            },
            showAuditWithdrawal(row){
              this.editVisibleHandle = true;
              this.withdrawalCode = row.code
            },
            // 审核不通过
            updateWithdrawalFailure() {
              this.$confirm("确定审核不通过吗？", '提示', {
                type: 'warning'
              }).then(() => {
                this.$axios.post("/member-withdrawal-record/updateWithdrawalFailure",{code : this.withdrawalCode,reason : this.reason, dataType:'form'}).then(res => {
                  if (res.code === 200) {
                    this.$message.success("操作成功！");
                    this.editVisibleHandle = false;
                    this.getData();

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
  .current{
    background: $color-theme;
    color: #fff;
    cursor: pointer;
  }
  .cursor{
    cursor: pointer;
  }
</style>
