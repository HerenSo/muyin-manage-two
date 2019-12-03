<template>
  <div>
    <div class="container mb-20 pt-20">
      <h4 class="color-666">文章分类</h4>
      <hr>
      <v-category :typeValue="typeValue" :apiType="apiType"></v-category>
    </div>
    <div class="container">

      <div class="handle-box">
        <el-button type="primary" icon="el-icon-refresh" class="handle-del " @click="refresh">刷新</el-button>
        <el-button type="primary" icon="el-icon-lx-add" class="handle-del " @click="handleEdit" v-if="right.add">新增</el-button>
        <el-button type="primary" icon="el-icon-delete" class="handle-del" @click="delAllSelection" v-if="right.del">批量删除</el-button>
        <el-input v-model="query.title" placeholder="请输入文章名" class="handle-input mr10 ml-10"></el-input>
        <el-date-picker v-model="query.createTime" type="date" placeholder="选择创建时间" class="mr10">
        </el-date-picker>
        <el-select v-model="query.status" placeholder="状态" class="handle-select mr10" @change="refresh">
          <el-option key="" label="全部" value=""></el-option>
<!--          <el-option key="0" label="草稿" value="0"></el-option>-->
<!--          <el-option key="1" label="上线" value="1"></el-option>-->
<!--          <el-option key="2" label="下线" value="2"></el-option>-->
          <el-option :key="index" :label="item.name" :value="item.code" v-for="(item,index) in enumslist"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" :loading="loading" header-cell-class-name="table-header" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="createName" label="创建人" width="120" align="center"></el-table-column>
        <!--        <el-table-column  prop="content" label="文章内容">-->
        <!--          <template slot-scope="scope">-->
        <!--            <div v-html="scope.row.content.substring(0,30)"></div>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column prop="categoryName" label="所属类型"></el-table-column>
        <el-table-column label="状态" align="center" width="80" >
          <template slot-scope="scope">
            <el-tag :type="scope.row.status===0?'warning':(scope.row.status===1?'success':'danger')">
<!--              {{scope.row.status===0?'草稿':(scope.row.status===1?'上线':'下线')}}-->
              {{enums[scope.row.status]}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="visitCount" label="预览量" width="80" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" align="center"></el-table-column>
        <el-table-column label="操作" width="120" align="center">
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
    <el-drawer :title="title" :visible.sync="editVisible" size="60%" direction="rtl" :before-close="handleClose" class="commodity_drawer">
      <div class="demo-drawer__content">
        <el-form ref="form" :model="form" label-width="70px">
          <el-form-item label="分类" required>
            <el-select v-model="form.categoryCode" placeholder="分类">
              <el-option :key="index" :label="item.name" :value="item.code" v-for="(item,index) in category"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标题" required>
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="内容" required>
            <quill-editor ref="myTextEditor" v-model="form.content" :options="editorOption"></quill-editor>
          </el-form-item>
          <el-form-item label="状态" required>
            <el-select v-model="form.status" placeholder="状态">
<!--              <el-option key="0" label="草稿" :value="0"></el-option>-->
<!--              <el-option key="1" label="上线" :value="1"></el-option>-->
<!--              <el-option key="2" label="下线" :value="2"></el-option>-->
              <el-option :key="index" :label="item.name" :value="item.code" v-for="(item,index) in enumslist"></el-option>
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
        components: {
            vCategory,
            quillEditor
        },
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
                    placeholder: ''
                },
                typeValue:'',
                apiType:'',
                category:[],
                right:{ // 权限
                    add:false,
                    edit:false,
                    del:false
                },
                enumslist:[],
                enums:{}, // 枚举
            };
        },
        mounted() {
            // 权限

            let authorities = JSON.parse(localStorage.getItem("user_information"));
            authorities.authorities.map((item) => {
                switch (item.authority) {
                    case 'ROLE_ARTICLE_EDIT':this.right.edit = true;break;
                    case 'ROLE_ARTICLE_DEL':this.right.del = true;break;
                    case 'ROLE_ARTICLE_ADD':this.right.add = true;break;
                    default:break;
                }
            })

            // 枚举
            let enums = JSON.parse(localStorage.getItem("ClassEnums"));
            let enumslist = enums.ArticleStatusEnum;
            for(let key in enumslist){
                this.enumslist.push(enumslist[key]);
            }
            this.enumslist.map(item => {
                this.$set(this.enums,item.code,item.name);
            })


            this.typeValue = 1; // 0商品，1文章
            this.apiType = 0; // 区别接口，0文章/商品；1用户/经销商
            bus.$on('categoryCode', msg => {
                this.query.categoryCode = msg;
                this.getData();
            });
            // this.getData();

            this.getCategory();
        },
        methods: {
            // 获取数据
            getData() {
                this.loading = true;
                this.$axios.post("/article/selectPageList?pageNum="+this.query.pageNum+"&pageSize="+this.query.pageSize,this.query).then(res => {
                    if(res.code == 200) {
                        this.tableData = res.data.records;
                        this.total = res.data.pages;
                    }else{
                        this.$message.error(res.msg);
                    }
                    this.loading = false;
                })
            },
            getCategory(){// 获取分类
                let params = {
                    type:1,
                    status:0
                }
                this.$axios.post("/category/queryCategoryTree",params).then(res => {
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
            // 编,辑操作
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
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete("/article/delete?id=" + row.id).then(res => {
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
                        ids.push(item.id);
                    })
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

<style lang="scss">
  .commodity_drawer .el-drawer__body{
    overflow-y: auto;
  }
  .commodity_drawer .el-drawer__header{
    margin-bottom: 10px;
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
