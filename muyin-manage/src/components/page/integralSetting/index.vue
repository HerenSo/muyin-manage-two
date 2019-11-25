<!--
	商品分类管理
-->

<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="handleEdit" v-if="right.add">新增</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="delAllSelection" v-if="right.del">批量删除</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="succession" label="连续签到天数"  align="center">
        </el-table-column>
        <el-table-column prop="point" label="奖励积分值" align="center">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"   align="center">
        </el-table-column>
        <el-table-column label="操作" width="140" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" v-if="right.edit">编辑</el-button>
            <el-button type="text" class="red" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)" v-if="right.del">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 编辑弹出框 -->
    <el-drawer :title="title" :visible.sync="editVisible" size="40%" direction="rtl" :before-close="handleClose">
      <div class="demo-drawer__content">
        <el-form ref="form" :model="form" label-width="130px">
          <el-form-item label="连续签到天数"   required><el-input v-model="form.succession" autocomplete="off"></el-input></el-form-item>
          <el-form-item label="奖励积分值"  required><el-input v-model="form.point" autocomplete="off"></el-input></el-form-item>
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
                loading:false,
                tableData: [],
                multipleSelection: [],
                del_list: [],
                right:{ // 权限
                    add:false,
                    edit:false,
                    del:false
                },
                idx: -1,
                total: 1, // 分页数
                roleList:[],
                form:{},
                title:'编辑',
                subloading:false,
                editVisible:false, // 控制
            }
        },
        created() {
            // 权限
            let authorities = JSON.parse(localStorage.getItem("user_information"));
            authorities.authorities.map((item) => {
                switch (item.authority) {
                    case 'ROLE_INTEGRAL_SETTING_EDIT':this.right.edit = true;break;
                    case 'ROLE_INTEGRAL_SETTING_DEL':this.right.del = true;break;
                    case 'ROLE_INTEGRAL_SETTING_ADD':this.right.add = true;break;
                    default:break;
                }
            })
            //数据
            this.getData();

        },
        methods: {
            // 获取 列表数据
            getData() {
                this.$axios.post('/sign-award/selectList',{}).then((res) => {
                    if(res.code == 200){
                        this.tableData = res.data;
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            saveEdit(){
                if(!this.form.succession){
                    this.$message.error("请输入连续签到天数！");
                    return;
                }
                if(!this.form.point){
                    this.$message.error("奖励积分值！");
                    return;
                }
                this.subloading = true;
                this.$axios.post("/sign-award/insertOrUpdate",this.form).then(res => {
                    if(res.code == 200){
                        this.$message.success(this.title+"成功！");
                        this.editVisible = false;
                        this.getData();
                    }
                    this.subloading = false;
                })
            },
            handleEdit(index, row) {
                this.editVisible = true;
                if(row){
                    this.form = row;
                    this.title = '编辑';
                }else{
                    this.title = '新增';
                    this.form = {}
                }
            },
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete("/sign-award/delete?id=" + row.id).then(res => {
                        if (res.code == 200) {
                            this.$message.success("删除成功！");
                            this.getData();
                        }
                    })
                }).catch(() => {});

            },
            delAllSelection() { //批量删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    let ids = [];
                    this.multipleSelection.map(item => {
                        ids.push(item.id);
                    })
                    this.$axios.post("/sign-award/deleteBatch",ids).then(res => {
                        if (res.code == 200) {
                            this.$message.success("批量删除成功！");
                            this.getData();
                            this.multipleSelection = [];
                        }
                    })
                }).catch(() => {});
            },
            // 触发搜索按钮
            handleSearch() {
                this.getData();
            },
            handleSelectionChange(val) {
                // console.log("选中了，",val)
                this.multipleSelection = val;
            },
            handleRefresh(){
                this.getData();
            },
            handleClose(){
                this.editVisible = false;
                this.subloading = false;
                this.form = {};
            },
        },
    }

</script>

<style  lang="scss">
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
  .del-dialog-cnt{
    font-size: 16px;
    text-align: center
  }
  .table{
    width: 100%;
    font-size: 14px;
  }
</style>
