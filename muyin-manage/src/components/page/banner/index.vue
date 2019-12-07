<!--
	轮播图管理
-->

<template>
    <div class="table">
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="handleEdit" v-if="right.add">新增</el-button>
                <el-button type="primary" icon="el-icon-delete" @click="delAllSelection" v-if="right.del">批量删除</el-button>
                <el-input v-model="query.title" placeholder="请输入标题查找" class="handle-input mr10 ml-10"></el-input>
                <el-select v-model="query.status" placeholder="状态" class="handle-select mr10" @change="handleRefresh">
                    <el-option key="" label="全部" value=""></el-option>
                    <el-option key="0" label="隐藏" :value="0"></el-option>
                    <el-option key="1" label="显示" :value="1"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="createName" label="轮播图" width="120" align="center">
                    <template slot-scope="scope">
                        <el-image :src="scope.row.imageUrl" style="width: 100px; height: 40px" fit="cover">
                            <div slot="error" class="image-slot">
                                <i class="el-icon-picture f50 color-border"></i>
                            </div>
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="标题" >
                </el-table-column>
                <el-table-column prop="url" label="跳转地址"  >
                </el-table-column>
                <el-table-column prop="type" label="类型"   align="center">
                  <template slot-scope="scope">
                      {{enums[scope.row.type]}}
                  </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序"  width="80" align="center">
                </el-table-column>
                <el-table-column prop="status" label="状态" width="80" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status==0?'danger':(scope.row.status==1?'success':'')">
                            {{scope.row.status==0?"隐藏 ":(scope.row.status==1?"显示":"")}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="140" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" v-if="right.edit">编辑</el-button>
                        <el-button type="text" class="red" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)" v-if="right.del">删除</el-button>
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
                <el-form ref="form" :model="form" label-width="110px">
                    <el-form-item label="标题"  required><el-input v-model="form.title" autocomplete="off"></el-input></el-form-item>
                    <el-form-item label="图片上传" >
                        <div class="backgroundImgUrl" v-loading="croploading"><i class="el-icon-picture"></i>
                            <div class="crop-demo">
                                <img :src="form.imageUrl" class="pre-img">
                            </div>
                            <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
                        </div>
                    </el-form-item>
                    <el-form-item label="所属一级分类" >
                        <el-select v-model="form.categoryCode" placeholder="请选择类型">
                            <el-option  :label="item.name" :value="item.code" v-for="(item,index) in categoryParent" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="跳转地址" ><el-input v-model="form.url" autocomplete="off"></el-input></el-form-item>
                    <el-form-item label="跳转参数"><el-input v-model="form.params" autocomplete="off"></el-input></el-form-item>
                    <el-form-item label="类型" required>
                        <el-select v-model="form.type" placeholder="请选择类型">
                            <el-option :key="index" :label="item.name" :value="item.code" v-for="(item,index) in enumslist"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="主题颜色" required>
                        <el-color-picker v-model="form.themeColor"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="状态" >
                        <el-switch
                                v-model="form.status"
                                active-text="显示"
                                inactive-text="隐藏"
                                :active-value="1"
                                :inactive-value="0">
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="排序"><el-input v-model="form.sort" autocomplete="off"></el-input></el-form-item>
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
        name: 'administratorSet',
        data() {
            return {
                loading:false,
                tableData: [],
                cur_page: 1,
                query: {
                    cardNumber: '',
                    status:'',
                    pageNum: 1,
                    pageSize: 10
                },
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
                psw:'',
                isAdmin:false, // 管理员
                managerType:'',
                defaultSrc: require('../../../assets/img/img.jpg'),
                imgSrc: '',
                cropImg: '',
                dialogVisible: false,
                file:'',
                croploading:false,
                categoryParent:[],
                enumslist:[],
                enums:{} // 枚举
            }
        },
        created() {
            // 权限
            let authorities = JSON.parse(localStorage.getItem("user_information"));
            if(authorities.isAdmin == 1){
                this.isAdmin = true;
            }
            authorities.authorities.map((item) => {
                switch (item.authority) {
                    case 'ROLE_BANNER_EDIT':this.right.edit = true;break;
                    case 'ROLE_BANNER_DEL':this.right.del = true;break;
                    case 'ROLE_BANNER_ADD':this.right.add = true;break;
                    default:break;
                }
            })
            // 枚举
            let enums = JSON.parse(localStorage.getItem("ClassEnums"));
            let enumslist = enums.BannerTypeEnum;
            for(let key in enumslist){
                this.enumslist.push(enumslist[key]);
            }
            this.enumslist.map(item => {
                this.$set(this.enums,item.code,item.name);
            })

            //数据
            this.getData();
            this.getCategory();
        },
        methods: {
            // 获取 列表数据
            getData() {
                this.$axios.post("/banner/selectPageList?pageNum="+this.query.pageNum+"&pageSize="+this.query.pageSize,this.query).then((res) => {
                    if(res.code == 200){
                        this.tableData = res.data.records;
                        this.total = res.data.pages;
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            // 获取 一级分类
            getCategory() {
                this.$axios.post("/category/selectCategoryParent",{status:0,type:0,level:0}).then((res) => {
                    if(res.code == 200){
                        this.categoryParent = res.data;
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            saveEdit(){
                if(!this.form.type){
                    this.$message.error("请选择类型！");
                    return;
                }
                if(!this.form.title){
                    this.$message.error("请输入标题！");
                    return;
                }
                if(!this.form.imageUrl){
                    this.$message.error("请上传图片！");
                    return;
                }
                if(!this.form.themeColor){
                    this.$message.error("请选择主题颜色！");
                    return;
                }
                this.subloading = true;
                this.$axios.post("/banner/insertOrUpdate",this.form).then(res => {
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
                    this.form = row
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
                    this.$axios.delete("/banner/delete?id=" + row.id).then(res => {
                        if (res.code == 200) {
                            this.$message.success("删除成功！");
                            this.getData();
                        }else{
                            this.$message.error(res.msg);
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
                    this.$axios.post("/banner/deleteBatch",ids).then(res => {
                        if (res.code == 200) {
                            this.$message.success("批量删除成功！");
                            this.getData();
                            this.multipleSelection = [];
                        }else{
                            this.$message.error(res.msg);
                        }
                    })
                }).catch(() => {});
            },
            sureCrop(){
                let params = {
                    file:this.file,
                    type:1,
                    isInsert:false,
                    pickUpColor: "1",
                    dataType:"multipart"
                }
                this.croploading = true;
                this.$axios.post("/api/attachments/insertUploadFile",params).then(res => {
                    if(res.code == 200){
                        this.$message.success("上传成功！");
                        this.$set(this.form, 'imageUrl', res.data.url);
                        this.$set(this.form, 'themeColor', res.data.themeColor);
                        this.dialogVisible = false;
                    }else{
                        this.$message.error(res.msg);
                    }
                    this.croploading = false;
                })
            },
            setImage(e){ // 选择图
                this.file = e.target.files[0];
                if (!this.file.type.includes('image/')) {
                    this.$message.error("请上传png/jpg格式文件！");
                    return;
                }
                this.sureCrop();
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageNum', 1);
                this.getData();
            },
            handleSelectionChange(val) {
                // console.log("选中了，",val)
                this.multipleSelection = val;
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
            handleRefresh(){
                this.getData();
            },
            handleClose(){
                this.editVisible = false;
                this.subloading = false;
                this.form = { };
            },
        },
    }

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
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .headIconUrl{
        border-radius: 4px;
        border:1px solid #ededed;
        height: 120px;
        width: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .headIconUrl i{
        font-size: 60px;
        color: #ddd;
    }
    .backgroundImgUrl{
        border-radius: 4px;
        border:1px solid #ededed;
        width: 348px;
        height: 138px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .backgroundImgUrl i{
        font-size: 80px;
        color: #ddd;
    }

    .cropDialog{
        z-index: 9999 !important;
        .el-dialog{
            z-index: 9999 !important;
        }
    }
    .pre-img{
        width: 348px;
        height: 138px;
        /*background: #f8f8f8;*/
        /*border: 1px solid #eee;*/
        border-radius: 5px;
        border:none;
    }
    .crop-demo{
        position: absolute;
        width: 348px;
        height: 138px;
        left: 0;
        top: 0;
        display: flex;
        align-items: flex-end;
        border:none;
    }
    .crop-demo-btn{
        position: relative;
        width: 100px;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        margin-left: 30px;
        background-color: #409eff;
        color: #fff;
        font-size: 14px;
        border-radius: 4px;
        box-sizing: border-box;
    }
    .crop-input{
        position: absolute;
        width: 348px;
        height: 138px;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
    }
    .el-color-picker__color{border:none;}
</style>
