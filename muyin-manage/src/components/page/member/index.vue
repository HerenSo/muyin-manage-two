<template>
  <div>
    <div class="container mb-20 pt-20">
      <h4 class="color-666">会员等级</h4>
      <hr>
        <v-category :typeValue="typeValue" :apiType="apiType"></v-category>
    </div>
    <div class="container">

      <div class="handle-box">
        <el-button type="primary" icon="el-icon-refresh" class="handle-del " @click="refresh">刷新</el-button>
        <el-button type="primary" icon="el-icon-lx-add" class="handle-del " @click="handleEdit" v-if="right.add">新增</el-button>
<!--        <el-button type="primary" icon="el-icon-delete" class="handle-del" @click="delAllSelection" v-if="right.del">批量删除</el-button>-->
        <el-input v-model="query.userphone" placeholder="请输入手机号码查找" class="handle-input mr10 ml-10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" v-loading="loading" header-cell-class-name="table-header" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="nickname" label="昵称"><template slot-scope="scope">{{scope.row.member.nickname}}</template></el-table-column>
        <el-table-column prop="username" label="用户名" width="120" align="center"></el-table-column>
        <el-table-column prop="sex" label="性别" width="80">
          <template slot-scope="scope">
            <el-tag :type="scope.row.member.sex===1?'':scope.row.member.sex===0?'success':'info'">{{scope.row.member.sex===1?'男':scope.row.member.sex===0?'女':"未知"}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="等级" prop="levelName" align="center"  >
          <template slot-scope="scope">{{scope.row.member.levelName}}</template>
        </el-table-column>
        <el-table-column prop="userphone" label="手机号" width="120" align="center"></el-table-column>
        <el-table-column label="生日" width="120" align="center">
          <template slot-scope="scope">{{scope.row.member.birthday}}</template>
        </el-table-column>
        <el-table-column prop="wallet" label="余额" width="120" align="center"><template slot-scope="scope">{{scope.row.member.wallet}}</template></el-table-column>
        <el-table-column prop="point" label="积分" width="120" align="center"><template slot-scope="scope">{{scope.row.member.point}}</template></el-table-column>
        <el-table-column prop="point" label="零元购次数" width="120" align="center"><template slot-scope="scope">{{scope.row.member.freeSellCount}}</template></el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="160" align="center"></el-table-column>
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template slot-scope="scope">
<!--            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">充值</el-button>-->
            <!--<el-button type="text" icon="el-icon-lx-calendar" class="" @click="handleSignRecord(scope.$index, scope.row)">签到记录</el-button>-->
<!--            <el-button type="text" icon="el-icon-lx-tag" class="" @click="handleResetPasswords(scope.$index, scope.row)">重置密码</el-button>-->
            <el-button type="text" icon="el-icon-document-checked" class="" @click="handleUpdateStatus(1, scope.row)" v-if="scope.row.status ==0">审核通过</el-button>
            <el-button type="text" icon="el-icon-document-delete" class="red" @click="handleUpdateStatus(3, scope.row)" v-if="scope.row.status ==0">审核不通过</el-button>
            <el-button type="text" icon="el-icon-turn-off" class="red" @click="handleUpdateStatus(2, scope.row)" v-if="scope.row.status == 1">冻结</el-button>
            <el-button type="text" icon="el-icon-open" class="" @click="handleUpdateStatus(1, scope.row)" v-if="scope.row.status == 2">解冻</el-button>
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

    <!-- 编辑弹出框 -->
    <el-drawer :title="title" :visible.sync="editVisible" size="60%" direction="rtl" :before-close="handleClose">
      <div class="demo-drawer__content">
        <el-form ref="form" :model="form" label-width="70px">
          <!--          <el-form-item label="分类" required>-->
          <!--            <el-select v-model="form.categoryCode" placeholder="分类">-->
          <!--              <el-option :key="index" :label="item.name" :value="item.code" v-for="(item,index) in category"></el-option>-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <el-form-item label="标题" required>
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="内容" required>
            <quill-editor ref="myTextEditor" v-model="form.content"></quill-editor>
          </el-form-item>
          <el-form-item label="状态" required>
            <el-select v-model="form.status" placeholder="状态">
              <el-option key="0" label="草稿" :value="0"></el-option>
              <el-option key="1" label="上线" :value="1"></el-option>
              <el-option key="2" label="下线" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="置顶">
            <el-select v-model="form.topside" placeholder="">
              <el-option key="0" label="否" :value="0"></el-option>
              <el-option key="1" label="是" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序" class="width260">
            <el-input v-model="form.sortId" class="width100"><i slot="suffix">值越小越靠前</i></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer demo-drawer__footer">
                  <el-button @click="editVisible = false">取 消</el-button>
                  <el-button type="primary" @click="saveEdit" :loading="subloading">{{ subloading ? '提交中 ...' : '确 定' }}</el-button>
              </span>
      </div>
    </el-drawer>

    <!-- 签到记录弹出框 -->
    <el-dialog title="签到记录" :visible.sync="visibleSignRecord" width="40%" >
      <el-table :data="signRecord" border class="table" ref="multipleTable" header-cell-class-name="table-header" >
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="signDate" label="签到时间"  align="center"></el-table-column>
        <el-table-column label="连续签到天数" prop="succession" align="center"  ></el-table-column>

      </el-table>
      <div class="pagination">
        <el-pagination
                background
                layout="total, sizes, prev, pager, next, jumper"
                :current-page="querySignRecord.pageNum"
                :page-size="querySignRecord.pageSize"
                :page-count="totalSignRecord"
                @current-change="handlePageSignRecordChange"
        ></el-pagination>
      </div>
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
                titleCategory:'编辑',
                editVisibleCategory:false,
                categoryId:'',
                formCategory:{},
                query: {
                    userphone:'',
                    managerType:0,
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
                apiType:"",
                category:[],
                signRecord:[],// 签到记录
                visibleSignRecord:false, // 控制签到记录弹窗
                username:'',
                userid:"",
                querySignRecord: {
                    pageNum: 1,
                    pageSize: 10
                },
                totalSignRecord:0,
                right:{ // 权限
                    add:false,
                    edit:false,
                    del:false
                },
            };
        },
        components: {
            vCategory,
            quillEditor
        },
        mounted() {
            // 权限
            let authorities = JSON.parse(localStorage.getItem("user_information"));
            authorities.authorities.map((item) => {
                switch (item.authority) {
                    case 'ROLE_MEMBER_EDIT':this.right.edit = true;break;
                    case 'ROLE_MEMBER_DEL':this.right.del = true;break;
                    case 'ROLE_MEMBER_ADD':this.right.add = true;break;
                    default:break;
                }
            })

            this.typeValue = 0; // 0用户级别，1经销商级别
            this.apiType = 1; // 区别接口，0文章/商品；1用户/经销商
            bus.$on('categoryCode', msg => {
                this.query.levelCode = msg;
                this.getData();
            });
            this.getCategory(); // 获取分类
            // this.getData();
        },
        methods: {
            // 获取数据
            getData() {
                this.loading = true;
                this.$axios.post("/user/selectPageList?pageNum="+this.query.pageNum+"&pageSize="+this.query.pageSize,this.query).then(res => {
                    if(res.code == 200) {
                        this.tableData = res.data.records;
                        this.total = res.data.pages;
                    }else{
                        this.$message.error(res.msg);
                    }
                    this.loading = false;
                })
            },
            getSignRecord() { // 获取签到记录
                this.$axios.post("/user-sign-record/selectPageList?pageNum="+this.querySignRecord.pageNum+"&pageSize="+this.querySignRecord.pageSize,{userid:this.userid}).then(res => {
                    if(res.code == 200) {
                        this.signRecord = res.data.records;
                        this.signRecord.map(item => {
                            item.username = this.username;
                        })
                        this.totalSignRecord = res.data.pages;
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            getCategory(){// 获取分类
                let params = {
                    type:this.typeValue
                }
                this.$axios.post("/level/selectList",params).then(res => {
                    if(res.code == 200){
                        this.category = res.data;

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
                this.$axios.post("/article/insertOrUpdate",this.form).then(res => {
                    if(res.code == 200){
                        this.$message.success(this.title+"成功！");
                        this.editVisible = false;
                        this.getData();
                    }
                    this.subloading = false;
                })
            },
            // 编辑操作
            handleEdit(index, row) {
                this.editVisible = true;
                if(row ){
                    this.form = {
                        id:row.id,
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
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageNum', 1);
                this.getData();
            },
            // 状态改变操作
            handleUpdateStatus(status, row) {
                let msg = "";
                if(status == 0){
                    msg = "待审核";
                }else if(status == 1 && row.status == 0){
                    msg = "审核通过";
                }else if(status == 3){
                    msg = "审核不通过";
                }else if(status == 1 && row.status == 2){
                    msg = "解冻";
                }else if(status == 2){
                    msg = "冻结";
                }
                this.$confirm("确定"+msg+"吗？", '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("user/freezeUser",{userId :row.userid,status:status,dataType:'form'}).then(res => {
                        if (res.code == 200) {
                            this.$message.success(msg+"成功！");
                            this.getData();
                        }
                    })
                }).catch(() => {});
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要冻结吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/user/freezeUser?userId=" + row.userid).then(res => {
                        if (res.code == 200) {
                            this.$message.success("冻结成功！");
                            this.getData();
                        }
                    })
                }).catch(() => {});
            },
            handleSignRecord(index, row) { // 签到记录
                this.visibleSignRecord = true;
                this.signRecord = [];
                this.username = row.username;
                this.userid = row.userid;
                this.getSignRecord();
            },
            handleResetPasswords(index, row) {
                this.$confirm('确定要重置密码吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/user/resetUserPassWord?userId=" + row.userid).then(res => {
                        if (res.code == 200) {
                            this.$message.success("重置成功！");
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
                        ids.push(item.id);
                    })
                    if(ids.length === 0){
                      this.$message.error("请选择要删除数据！");
                      return ;
                    }
                    this.$axios.post("/article/deleteBatch",ids).then(res => {
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
            handlePageSignRecordChange(val){ // 签到分页导航
                this.$set(this.querySignRecord, 'pageNum', val);
                this.getSignRecord();
            },
            handleClose(){
                this.editVisible = false;
                this.subloading = false;
                this.form = {};
            },
            handleCategoryClose(){
                this.editVisibleCategory=false;
                this.formCategory = {};
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
