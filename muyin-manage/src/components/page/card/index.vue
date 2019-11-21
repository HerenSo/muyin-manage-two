<!--
	卡劵管理
-->

<template>
    <div class="table">
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="handleEdit" v-if="right.add">新增</el-button>
                <el-button type="primary" icon="el-icon-delete" @click="delAllSelection" v-if="right.del">批量删除</el-button>
                <el-input v-model="query.cardNumber" placeholder="请输入手机号码查找" class="handle-input mr10 ml-10"></el-input>
                <el-select v-model="query.status" placeholder="状态" class="handle-select mr10" @change="handleRefresh">
                    <el-option key="" label="全部" value=""></el-option>
                    <el-option key="0" label="草稿" value="0"></el-option>
                    <el-option key="1" label="上线" value="1"></el-option>
                    <el-option key="2" label="下线" value="2"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="number" label="卡卷ID" >
                </el-table-column>
                <el-table-column prop="name" label="名称" >
                </el-table-column>
                <el-table-column prop="amount" label="金额"  width="120" align="center">
                </el-table-column>
                <el-table-column prop="paidAmount" label="实付金额"  width="120" align="center">
                </el-table-column>
                <el-table-column prop="type" label="类型" width="120" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.type==0?'':(scope.row.type==1?'success':'')">
                            {{scope.row.type==0?"会员卡":(scope.row.type==1?"充值卡":"")}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="激活时间" width="180"  align="center">
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
                <el-form ref="form" :model="form" label-width="100px">
                    <el-form-item label="名称" label-width="100px" required><el-input v-model="form.name" autocomplete="off"></el-input></el-form-item>
                    <el-form-item label="图标" label-width="100px">
                        <div class="headIconUrl">
                            <i class="el-icon-plus"></i>
                            <div class="crop-demo">
                                <img :src="form.iconUrl" class="pre-img">
                            </div>
                            <input ref="file" class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
                        </div>
                        <el-dialog class="cropDialog" title="裁剪图片" :visible.sync="dialogVisible" width="30%">
                            <vue-cropper ref='cropper' :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage" style="width:100%;height:300px;"></vue-cropper>
                            <span slot="footer" class="dialog-footer">
                        <el-button @click="cancelCrop">取 消</el-button>
                        <el-button type="primary" @click="sureCrop">确 定</el-button>
                    </span>
                        </el-dialog>
                    </el-form-item>
                    <el-form-item label="卡片背景" label-width="100px">
                        <div class="backgroundImgUrl" v-loading="croploading"><i class="el-icon-picture"></i>
                            <div class="crop-demo">
                                <img :src="form.backgroundImgUrl" class="pre-img">
                            </div>
                            <input class="crop-input" type="file" name="image" accept="image/*" @change="setBannerImage"/>
                        </div>
                    </el-form-item>
                    <el-form-item label="金额" label-width="100px" required><el-input v-model="form.amount" autocomplete="off"></el-input></el-form-item>
                    <el-form-item label="折扣额度" label-width="100px" required><el-input v-model="form.discount" autocomplete="off"></el-input></el-form-item>
                    <el-form-item label="实付金额" label-width="100px" required><el-input v-model="form.paidAmount" autocomplete="off"></el-input></el-form-item>
                    <el-form-item label="类型" required>
                        <el-select v-model="form.type" placeholder="请选择类型">
                            <el-option key="0" label="会员卡" :value="0"></el-option>
                            <el-option key="1" label="充值卡" :value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="描述信息" label-width="100px" ><el-input type="textarea" :row="5" v-model="form.description" autocomplete="off"></el-input></el-form-item>
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
    import VueCropper  from 'vue-cropperjs';
    import bus from '../../common/bus';
    export default {
        name: 'index',
        components: {
            VueCropper
        },
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
                    case 'ROLE_COUPON_EDIT':this.right.edit = true;break;
                    case 'ROLE_COUPON_DEL':this.right.del = true;break;
                    case 'ROLE_COUPON_ADD':this.right.add = true;break;
                    default:break;
                }
            })
            //数据
            this.getData();

        },
        methods: {
            // 获取 列表数据
            getData() {
                this.$axios.post("/card/selectPageList?pageNum="+this.query.pageNum+"&pageSize="+this.query.pageSize,this.query).then((res) => {
                    if(res.code == 200){
                        this.tableData = res.data.records;
                        this.total = res.data.pages;
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
                if(!this.form.name){
                    this.$message.error("请输入名称！");
                    return;
                }
                if(!this.form.amount){
                    this.$message.error("请输入金额！");
                    return;
                }
                if(!this.form.paidAmount){
                    this.$message.error("请输入实付金额！");
                    return;
                }
                if(!this.form.discount){
                    this.$message.error("请输入折扣额度！");
                    return;
                }
                this.subloading = true;
                this.$axios.post("/card/insertOrUpdate",this.form).then(res => {
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
                    this.form = {
                        number:row.number,
                        name:row.name,
                        backgroundImgUrl:row.backgroundImgUrl,
                        amount:row.amount,
                        paidAmount:row.paidAmount,
                        type:row.type,
                        discount:row.discount,
                        description:row.description,
                    }
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
                    this.$axios.delete("/card/delete?number=" + row.number).then(res => {
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
                        ids.push(item.number);
                    })
                    this.$axios.post("/card/deleteBatch",ids).then(res => {
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
            uploadImg(type,params){ // 图上传
                this.$axios.post("/api/attachments/insertUploadFile",params).then(res => {
                    if(res.code == 200){
                        this.$message.success("上传成功！");
                        if(type == "banner"){
                            this.$set(this.form, 'backgroundImgUrl', res.data.url);
                        }else{
                            this.$set(this.form, 'iconUrl', res.data.url);
                        }
                        this.dialogVisible = false;
                    }else{
                        this.$message.error(res.msg);
                    }
                    this.croploading = false;
                })
            },
            setBannerImage(e){ // 选择卡片背景图
                this.file = e.target.files[0];
                if (!this.file.type.includes('image/')) {
                    this.$message.error("请上传png/jpg格式文件！");
                    return;
                }
                let params = {
                    file:this.file,
                    type:1,
                    isInsert:false,
                    pickUpColor:true,
                    dataType:"multipart"
                }
                this.croploading = true;
                this.uploadImg("banner",params);
            },
            sureCrop(){ // 缩略图确定
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
                this.uploadImg("icon",params);
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
                this.psw='',
                    this.form = {
                    };
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
        height: 200px;
        width: 320px;
        display: flex;
        align-items: center;
        justify-content: center;
        .pre-img{
            width: 320px;
            height: 200px;
        }
        .crop-demo{
            width: 320px;
            height: 200px;
        }
        .crop-input{
            width: 320px;
            height: 200px;
        }
    }
    .backgroundImgUrl i{
        font-size: 80px;
        color: #ddd;
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
