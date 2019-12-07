<!--
	角色管理
-->

<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd" v-if="right.add">新增</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="delAllSelection" v-if="right.del">批量删除</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="roleName" label="角色名" >
        </el-table-column>
<!--        <el-table-column prop="roleType" label="角色类型" >-->
<!--        </el-table-column>-->
        <el-table-column prop="createTime" label="创建时间" width="180"  align="center">
        </el-table-column>
        <el-table-column prop="remark" label="备注"  align="center">
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" v-if="right.edit">编辑</el-button>
            <el-button type="text" class="red" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)" v-if="right.del">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :page-count="total">
        </el-pagination>
      </div>
    </div>


    <!-- 编辑 -->
    <el-dialog  :visible.sync="visible" width="90%" center>
      <user-edit :role="role" v-if="visible"></user-edit>
    </el-dialog>
  </div>
</template>

<script>
    import userEdit from './edit.vue';
    import bus from '../../common/bus';
    export default {
        name: 'index',
        components: { userEdit},
        data() {
            return {
                loading:false,
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                del_list: [],
                right:{ // 权限
                    add:false,
                    edit:false,
                    del:false
                },
                idx: -1,
                total: 1, // 分页数
                role:{}, // 当前角色对象
                title:'编辑',
                visible:false // 控制
            }
        },
        created() {
            this.getData();

            // 权限
            let authorities = JSON.parse(localStorage.getItem("user_information"));
            authorities.authorities.map((item) => {
                switch (item.authority) {
                    case 'ROLE_ROLE_EDIT':this.right.edit = true;break;
                    case 'ROLE_ROLE_DEL':this.right.del = true;break;
                    case 'ROLE_ROLE_ADD':this.right.add = true;break;
                    default:break;
                }
            })
            bus.$on('visible', (msg) => {
                this.visible = msg;
                this.role = {};
                this.getData();
            });
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 列表数据
            getData() {
                this.$axios.post('/role/selectPageList?pageSize=10&pageNum='+this.cur_page,{}).then((res) => {
                    if(res.code == 200){
                        this.tableData = res.data.records;
                        this.total = res.data.pages;
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            handleRefresh(){
                this.getData();
            },
            handleAdd(){
                // tab=-1 时，不加载tab
                this.visible = true;
                this.role = {};
            },
            handleEdit(index, row) {
                // tab=-1 时，不加载tab
                this.role = row;
                this.visible = true;
                console.log('role', row)
                // bus.$emit('role', row);
            },
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete("/role/delete?roleid=" + row.roleid).then(res => {
                        if (res.code == 200) {
                            this.$message.success("删除成功！");
                            this.getData();
                        }
                    })
                }).catch(() => {});

            },
            delAllSelection() { //批量删除
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    let ids = [];
                    this.multipleSelection.map(item => {
                        ids.push(item.roleid);
                    })
                    if(ids.length === 0){
                      this.$message.error("请选择要删除数据！");
                      return ;
                    }
                    this.$axios.post("/role/deleteBatch",ids).then(res => {
                        if (res.code == 200) {
                            this.$message.success("批量删除成功！");
                            this.getData();
                            this.multipleSelection = [];
                        }
                    })
                }).catch(() => {});
            },
            handleSelectionChange(val) {
                // console.log("选中了，",val)
                this.multipleSelection = val;
            }
        },
        watch:{
            visible(newVal,oldVal){
                if(newVal == false){
                    bus.$emit('role', {});
                }
            }
        }
    }

</script>

<style scoped>
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
