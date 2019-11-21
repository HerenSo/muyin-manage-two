<template>
  <div class="container">
    <div class="handle_button">
      <el-button type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button type="primary" icon="el-icon-delete" @click="handleDeleteOne" v-if="right.edit">删除</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="handleEdit" v-if="right.edit">新增</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="handleEditOne" v-if="right.edit">新增一级菜单</el-button>
    </div>
    <div>
      <el-row type="flex">
        <el-col :span="8" class="roleList">
          <div class="medo_title pl-20">系统菜单列表</div>
          <div  class="">
            <el-tree
                    :data="tree"
                    default-expand-all
                    node-key="code"
                    ref="tree"
                    highlight-current
                    @current-change="checkMenuChange"
                    :props="defaultProps">
            </el-tree>
          </div>
        </el-col>
        <el-col :span="15" class="menuList">
          <!--          <div class="medo_title p-lr-20">可用菜单权限</div>-->
          <el-table
                  :data="tableData"
                  :loading="loading"
                  highlight-current-row
                  style="width: 100%">
            <el-table-column prop="code" label="菜单编码" min-width="160">
            </el-table-column>
            <el-table-column prop="name" label="菜单名称" min-width="120">
            </el-table-column>
            <el-table-column prop="parentName" label="上级菜单">
            </el-table-column>
            <el-table-column fixed="right" label="" width="60">
              <template slot-scope="scope">
                <el-link @click="handleEdit(scope.row)" type="primary" size="small" v-if="right.edit"><i class="el-icon-edit"></i></el-link>
                <el-link @click="handleDelete(scope.row)" type="danger" size="small" v-if="right.edit"><i class="el-icon-delete"></i></el-link>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <!--编辑-->
    <el-drawer
            :title="drawerTitle"
            :visible.sync="drawer"
            :direction="direction"
            size="30%"
            :before-close="handleCloseDrawer">
      <div class="demo-drawer__content">
        <el-form :model="form" class="form_flex">
          <el-form-item label="父节点名称" label-width="100px"><el-input v-model="form.parentName" :disabled="true"></el-input></el-form-item>
          <el-form-item label="菜单名称" label-width="100px" required><el-input v-model="form.name" ></el-input></el-form-item>
          <el-form-item label="菜单编码" label-width="100px" required><el-input v-model="form.code" ></el-input></el-form-item>
          <el-form-item label="菜单路径" label-width="100px"><el-input v-model="form.url" ></el-input></el-form-item>
          <el-form-item label="级别" label-width="100px"><el-input v-model="form.level" class="width200"></el-input></el-form-item>
          <el-form-item label="排序" label-width="100px"><el-input v-model="form.sortLevel"  class="width200"></el-input></el-form-item>
          <el-form-item label="图标" label-width="100px"><el-input v-model="form.icon" class="width200"></el-input></el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="drawer = false">取 消</el-button>
          <el-button type="primary" @click="submitEdit" :loading="subloading">{{ subloading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
    export default {
        name: "index",
        data() {
            return {
                tableData: [],
                loading:false,
                currentPage:1,
                pageSize:8,
                total:0,
                drawer:false, // 抽屉
                direction:'rtl', // 抽屉在右
                drawerTitle:'编辑',
                subloading:false,
                form:{
                    url: "/"
                },
                editUrl:'',
                search:'',
                menuId:"",
                menuName:'',
                tree:[],
                defaultProps:{
                    children: 'subMenus',
                    label: 'name',
                    id:'code'
                },
                menuCurrentId:'',
                right:{ // 权限
                    add:false,
                    edit:true,
                    del:false
                }
            }
        },
        mounted(){
            // 权限
            let authorities = JSON.parse(localStorage.getItem("user_information"));
            authorities.authorities.map((item) => {
                switch (item.authority) {
                    case 'ROLE_SUPER_ADMIN':this.right.edit = true;break;
                    default:break;
                }
            })
            // this.getData();
            this.getMenuTree();
        },
        methods:{
            getData(){ //获取列表
                this.loading = true;
                this.$axios.get("/menu/selectByPrimaryKey?code="+this.menuId).then(res => {
                    if(res.code == 200){
                        this.tableData = res.data;
                    }
                    this.loading = false;
                })
            },
            getMenuTree(){ // 获取菜单树
                this.$axios.post("/menu/selectMenusTreeByUserPID",{}).then(res => {
                    if(res.code == 200){
                        this.tree = res.data;
                        this.menuId = this.tree[0].code;
                        this.menuName = this.tree[0].name;
                        // this.tree.map((item) => {
                        //     item.subMenus.map
                        // })
                        this.$nextTick(() => {
                            this.$refs.tree.setCurrentKey(this.menuId);//获取已经设置的资源后渲染
                        });
                        // this.getData();
                        this.tableData = this.tree[0].subMenus;
                    }
                })
            },
            submitEdit(){ // 编辑 新增
                if(!this.form.name){
                    this.$message.error("请输入菜单名称！");
                    return;
                }
                if(!this.form.code){
                    this.$message.error("请输入菜单编码！");
                    return;
                }
                // if(!this.form.url){
                //     this.$message.error("请选择菜单路径！");
                //     return;
                // }
                this.subloading = true;
                this.$axios.post('/menu/insertOrUpdate',this.form).then(res => {
                    if(res.code == 200){
                        this.$message.success(this.drawerTitle+"成功！");
                        this.drawer = false;
                        // if(this.drawerTitle == "编辑"){
                        //     // this.getData();
                        // }else{
                        //     this.getMenuTree();
                        // }
                        this.getMenuTree();
                        this.form = {
                            url:'/'
                        };
                    }
                    this.subloading = false;
                })
            },
            handleEdit(item){
                this.drawer = true;
                if(item.code){
                    this.form={
                        code: item.code,
                        name : item.name,
                        parentName : item.parentName,
                        level : item.level,
                        url : item.url,
                        icon : item.icon,
                        sortLevel : item.sortLevel,
                    };
                    this.drawerTitle = '编辑';
                }else{
                    this.form={
                        code: '',
                        url:'/',
                        parentName : this.menuName,
                        parentCode:this.menuId,
                    };
                    this.drawerTitle = '新增';
                }
            },
            handleEditOne(){
                this.menuId = '';
                this.menuName = '';
                this.handleEdit({code:''});
            },
            handleDelete(item){
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete("/menu/delete?code=" + item.code).then(res => {
                        if (res.code == 200) {
                            this.$message.success("删除成功！");
                            this.getMenuTree();
                        }
                    })
                })
            },
            handleDeleteOne(){
                this.handleDelete({code:this.menuId});
            },
            checkMenuChange(item,node){ // 选择父级菜单
                this.menuId = item.code;
                this.menuName = item.name;
                // this.getData(); // 获取子菜单列表
                this.tableData = item.subMenus;
            },
            handleCloseDrawer(){
                this.drawer = false;
                this.subloading = false;
                this.form = {
                    url:'/'
                };
            },
            refresh(){ // 刷新
                this.getMenuTree();
            }
        },
        watch:{
            drawer(newVal,oldVal){
                if(newVal = false){
                    this.subloading = false;
                    this.form = {
                        url:'/'
                    };
                }
            }
        }
    }
</script>

<style scoped>
  .selectedCity.distpicker-address-wrapper{
    display: flex;
    justify-content: space-between;
  }
  .selectedCity.distpicker-address-wrapper >>> select{
    width: 30%;
    font-size: 14px;
  }
  .roleList,.menuList{
    margin: 20px 0;
    /*padding: 15px;*/
    border-radius: 4px;
    border:1px solid #ededed;
  }
  .roleList >>> .cell{
    white-space: nowrap;
  }
  .menuList{
    margin-left: 20px;
  }
  .medo_title{
    line-height: 42px;
    /*margin-bottom: 15px;*/
    border-bottom: 1px solid #ededed;
  }
  .menuList .medo_title{
    margin-bottom: 0;
  }
  .menuList >>> .el-tree-node__label {
    padding-left: 10px;
  }
  .el-tree{
    padding: 20px 0;
    height: 490px;
    overflow-y: auto;
  }
</style>