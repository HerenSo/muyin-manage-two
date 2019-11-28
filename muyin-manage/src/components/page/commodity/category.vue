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
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    @selection-change="handleSelectionChange"
                    v-loading="loading"
                    row-key="id"
                    default-expand-all
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="分类名称" >
                </el-table-column>
                <el-table-column prop="createName" label="缩略图" width="120" align="center">
                    <template slot-scope="scope">
                        <el-image :src="scope.row.iconUrl" style="width: 50px; height: 50px" fit="cover">
                            <div slot="error" class="image-slot">
                                <i class="el-icon-picture f50 color-border"></i>
                            </div>
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="level" label="级别" align="center" >
                    <template slot-scope="scope">
                        <span class="pr-5" v-for="item in scope.row.roles">{{item.roleName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="120" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status=='0'?'success':(scope.row.status=='1'?'danger':'')">
                            {{scope.row.status=="0"?"正常":(scope.row.status=="1"?"禁用":"")}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" width="120">
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180"  align="center">
                </el-table-column>
                <el-table-column label="操作" width="140" align="center">
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

        <!-- 编辑弹出框 -->
        <el-drawer :title="title" :visible.sync="editVisible" size="40%" direction="rtl" :before-close="handleClose">
            <div class="demo-drawer__content">
                <el-form ref="form" :model="form" label-width="100px">
                    <el-form-item label="父级分类">
                        <el-cascader
                                v-model="form.parentCode"
                                :options="category"
                                :props="{ expandTrigger: 'hover',value:'code',label:'name',children:'subCategorys' }"></el-cascader>
                    </el-form-item>
                    <el-form-item label="分类名称" label-width="100px" required><el-input v-model="form.name" autocomplete="off"></el-input></el-form-item>
                    <el-form-item label="缩略图" label-width="100px">
                        <div class="headIconUrl">
                            <i class="el-icon-s-custom"></i>
                            <div class="crop-demo">
                                <img :src="form.iconUrl" class="pre-img">
                            </div>
                            <input ref="file" id="file" class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
                        </div>
                        <el-dialog class="cropDialog" title="裁剪图片" :visible.sync="dialogVisible" width="30%">
                            <vue-cropper ref='cropper' :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage" style="width:100%;height:300px;"></vue-cropper>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="cancelCrop">取 消</el-button>
                                <el-button type="primary" @click="sureCrop">确 定</el-button>
                            </span>
                        </el-dialog>
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
    import VueCropper  from 'vue-cropperjs';
    export default {
        name: 'category',
        components: {
            VueCropper
        },
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
                query: {
                    pageNum: 1,
                    pageSize: 10
                },
                idx: -1,
                total: 1, // 分页数
                roleList:[],
                form:{},
                title:'编辑',
                subloading:false,
                editVisible:false, // 控制
                category:[], // 分类
                defaultSrc: require('../../../assets/img/img.jpg'),
                imgSrc: '',
                cropImg: '',
                dialogVisible: false,
                file:'',
            }
        },
        created() {
            // 权限
            let authorities = JSON.parse(localStorage.getItem("user_information"));
            authorities.authorities.map((item) => {
                switch (item.authority) {
                    case 'ROLE_COMMODITY_CATEGORY_EDIT':this.right.edit = true;break;
                    case 'ROLE_COMMODITY_CATEGORY_DEL':this.right.del = true;break;
                    case 'ROLE_COMMODITY_CATEGORY_ADD':this.right.add = true;break;
                    default:break;
                }
            })
            //数据
            this.getCategory();
            this.getData();

        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.query.pageNum = val;
                this.getData();
            },
            // 获取 列表数据
            getData() {
                this.$set(this.query, 'type', 0);
                this.$axios.post('/category/selectPageList?pageSize=10&pageNum='+this.query.pageNum,this.query).then((res) => {
                    if(res.code == 200){
                        this.tableData = res.data.records;
                        this.total = res.data.pages;
                        this.tableData.map((item,index) => {
                            // let parentCode = item.parentCode;
                            // item.parentCode = [];
                            // item.parentCode.push(parentCode);
                            // item.parentCode = JSON.parse(item.parentCode);
                            if(item.subCategorys.length >0){
                                item.hasChildren = true;
                                item.children = item.subCategorys;
                            }
                            item.id=index;
                        })
                        this.$forceUpdate();
                        console.log(this.tableData)
                    }else{
                        this.$message.error(res.msg);
                    }
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
                        this.category.map(item => {
                            if(item.subCategorys.length == 0){
                                delete item.subCategorys;
                            }else{
                                item.subCategorys.map(i => {
                                    if(i.subCategorys.length == 0){
                                        delete i.subCategorys;
                                    }
                                })
                            }
                        })
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            saveEdit(){
                // if(!this.form.parentCode){
                //     this.$message.error("请选择父级分类！");
                //     return;
                // }
                if(!this.form.name){
                    this.$message.error("请输入分类名称！");
                    return;
                }
                this.form.parentCode = JSON.stringify(this.form.parentCode)
                if(!this.form.iconUrl && this.form.parentCode){
                    this.$message.error("请上传缩略图！");
                    return;
                }
                this.$set(this.form, 'type', 0);
                this.subloading = true;
                this.$axios.post("/category/insertOrUpdate",this.form).then(res => {
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
                    this.form.code = row.code;
                    this.form.name = row.name;
                    this.form.iconUrl = row.iconUrl;
                    this.form.parentCode = [];
                    this.form.parentCode.push(row.parentCode);
                    this.$forceUpdate();
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
                    this.$axios.delete("/category/delete?code=" + row.code).then(res => {
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
                        ids.push(item.code);
                    })
                    this.$axios.post("/category/deleteBatch",ids).then(res => {
                        if (res.code == 200) {
                            this.$message.success("批量删除成功！");
                            this.getData();
                            this.multipleSelection = [];
                        }
                    })
                }).catch(() => {});
            },
            sureCrop(){ // 缩略图上传
                let cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
                this.cropImg = this.processData(cropImg);
                console.log(this.cropImg);
                let formData = new FormData();
                formData.append("file", this.cropImg,this.file.name);
                formData.append("type", 1);
                formData.append("isInsert", false);
                let params = {
                    formData:formData,
                    dataType:"vueCropper"
                }
                this.$axios.post("/api/attachments/insertUploadFile",params).then(res => {
                    if(res.code == 200){
                        this.$message.success("上传成功！");
                        this.$set(this.form, 'iconUrl', res.data.url);
                        this.dialogVisible = false;
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            setImage(e){ // 选择缩略图
                this.file = e.target.files[0];
                if (!this.file.type.includes('image/')) {
                    this.$message.error("请上传png/jpg格式文件！");
                    return;
                }
                // this.sureCrop();
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.dialogVisible = true;
                    this.imgSrc = event.target.result;
                    this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
                };
                reader.readAsDataURL(this.file);
            },
            cropImage () { // 剪裁缩略图
                let cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
                this.cropImg = this.processData(cropImg);
            },
            processData(dataUrl) {
                var binaryString = window.atob(dataUrl.split(',')[1]);
                var arrayBuffer = new ArrayBuffer(binaryString.length);
                var intArray = new Uint8Array(arrayBuffer);
                for (var i = 0, j = binaryString.length; i < j; i++) {
                    intArray[i] = binaryString.charCodeAt(i);
                }

                var data = [intArray],
                    blob;

                try {
                    blob = new Blob(data);
                } catch (e) {
                    window.BlobBuilder = window.BlobBuilder ||
                        window.WebKitBlobBuilder ||
                        window.MozBlobBuilder ||
                        window.MSBlobBuilder;
                    if (e.name === 'TypeError' && window.BlobBuilder) {
                        var builder = new BlobBuilder();
                        builder.append(arrayBuffer);
                        blob = builder.getBlob(this.file.type); // imgType为上传文件类型，即 file.type
                    } else {
                        console.log('版本过低，不支持上传图片');
                    }
                }
                return blob;
            },
            cancelCrop(){ // 取消剪裁
                this.dialogVisible = false;
                // this.cropImg = this.defaultSrc;
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
            handleRefresh(){
                this.getData();
            },
            handleClose(){
                this.editVisible = false;
                this.subloading = false;
                this.form = {};
            },
        },
        watch:{
            dialogVisible(newsval,oldval){
                if(!newsval){
                    this.$refs.file.value = '';
                }
            }
        }
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
    .input-new-tag{
        width:140px;
        padding-right: 10px;
        margin-left: 0;
    }
    .border{
        border:1px solid $color-one;
        border-radius: 4px;
        padding: 10px;
    }

    .pre-img{
        width: 120px;
        height: 120px;
        /*background: #f8f8f8;*/
        /*border: 1px solid #eee;*/
        border-radius: 5px;
    }
    .crop-demo{
        position: absolute;
        width: 120px;
        height: 120px;
        left: 0;
        top: 0;
        display: flex;
        align-items: flex-end;
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
        width: 120px;
        height: 120px;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
    }
</style>
