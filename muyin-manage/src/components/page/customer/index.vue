<template>
  <div>
    <div class="container mb-20 pt-20">
      <h4 class="color-666">经销商等级</h4>
      <hr>
      <v-category :typeValue="typeValue" :apiType="apiType"></v-category>
    </div>
    <div class="container">

      <div class="handle-box">
        <el-button type="primary" icon="el-icon-refresh" class="handle-del " @click="refresh">刷新</el-button>
        <el-button type="primary" icon="el-icon-lx-add" class="handle-del " @click="handleEdit" v-if="right.add">新增</el-button>
<!--        <el-button type="primary" icon="el-icon-delete" class="handle-del" @click="delAllSelection" v-if="right.del">批量删除</el-button>-->
        <el-input v-model="query.phone" placeholder="请输入经销商商户手机号查找" class="handle-input mr10 ml-10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" :loading="loading" header-cell-class-name="table-header" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <!--        <el-table-column prop="code" label="编号"></el-table-column>-->
        <el-table-column prop="createName" label="缩略图" width="120" align="center">
          <template slot-scope="scope">
            <el-image :src="scope.row.logoUrl" style="width: 50px; height: 50px" fit="cover">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture f50 color-border"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="adminUserName" label="管理员用户" width="120" align="center"></el-table-column>
        <el-table-column prop="wallet" label="钱包余额" width="80" align="center"></el-table-column>
        <el-table-column prop="levelCode" label="等级" width="80" align="center">
          <template slot-scope="scope">
            {{scope.row.levelCode == 1?"一级":(scope.row.levelCode == 2?"二级":(scope.row.levelCode == 3?"三级":(scope.row.levelCode == 4?"四级":(scope.row.levelCode == 5?"五级":""))))}}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号码" width="110" align="center"></el-table-column>
        <el-table-column prop="saleOverTime" label="总补单量" width="100" align="center"></el-table-column>
        <el-table-column prop="orderCount" label="总订单量" width="100" align="center"></el-table-column>
        <el-table-column label="状态" align="center" width="100" >
          <template slot-scope="scope">
            <el-tag :type="scope.row.status===0?'warning':(scope.row.status===1?'success':(scope.row.status===2?'danger':(scope.row.status===3?'info':'')))">
<!--              {{scope.row.status===0?'待审核':(scope.row.status===1?'审核成功':(scope.row.status===2?'审核失败':(scope.row.status===9?'注销':'正常')))}}-->
              {{enums[scope.row.status]}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="160" align="center"></el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template slot-scope="scope">
<!--            <el-button type="text" icon="el-icon-delete" @click="handleCheck(scope.$index, scope.row)">查看</el-button>-->
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" v-if="right.edit">编辑</el-button>
            <el-button type="text" icon="el-icon-turn-off" class="red" @click="handleDelete(9, scope.row)" v-if="scope.row.status != 0 && scope.row.status != 2 ">注销</el-button>
            <el-button type="text" icon="el-icon-tickets" @click="handleAccount(scope.$index, scope.row)" v-if="scope.row.status != 0 && scope.row.status != 2">资金流水</el-button>
            <el-button type="text" icon="el-icon-document-checked" class="" @click="handleDelete(1, scope.row)" v-if="scope.row.status ==0">审核通过</el-button>
            <el-button type="text" icon="el-icon-document-add" class="red" @click="handleDelete(2, scope.row)" v-if="scope.row.status ==0">审核不通过</el-button>
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
        <el-form ref="form" :model="form" label-width="140px">
          <el-form-item label="商户名称" :required="!ischeck" >
            <el-input v-model="form.name" placeholder="" :readonly="ischeck"></el-input>
          </el-form-item>
<!--          <el-form-item label="管理员用户" :required="!ischeck" >-->
<!--            <el-input v-model="form.adminUserName" placeholder=""  :readonly="ischeck"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="等级名" >-->
<!--            <el-input v-model="form.levelName" placeholder=""  :readonly="ischeck"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="订单量" >-->
<!--            <el-input v-model="form.orderCount" placeholder="" :readonly="ischeck"></el-input>-->
<!--          </el-form-item>-->
          <el-form-item label="商户LOGO" >
              <div class="headIconUrl">
                  <i class="el-icon-plus"></i>
                  <div class="crop-demo">
                      <img :src="form.logoUrl" class="pre-img">
                  </div>
                  <input ref="file" class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
              </div>
              <el-dialog class="cropDialog" title="裁剪图片" :visible.sync="dialogCropVisible" width="30%">
                  <vue-cropper ref='cropper' :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage" style="width:100%;height:300px;"></vue-cropper>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelCrop">取 消</el-button>
                    <el-button type="primary" @click="sureCrop">确 定</el-button>
                </span>
              </el-dialog>
          </el-form-item>
          <el-form-item label="商户详细地址信息"  :required="!ischeck" >
            <el-input v-model="form.address" placeholder="" :readonly="ischeck"></el-input>
          </el-form-item>
          <el-form-item label="商户联系号码"  :required="!ischeck">
            <el-input v-model="form.phone" placeholder="" :readonly="ischeck"></el-input>
          </el-form-item>
          <el-form-item label="商户固定电话号码" >
            <el-input v-model="form.telephone" placeholder="" :readonly="ischeck"></el-input>
          </el-form-item>
          <el-form-item label="合作合同编号"  :required="!ischeck">
            <el-input v-model="form.contractNumber" placeholder="" :readonly="ischeck"></el-input>
          </el-form-item>
          <el-form-item label="合同合作到期时间"  :required="!ischeck">
            <el-input v-model="form.cooperationTime" placeholder="" :readonly="ischeck"></el-input>
          </el-form-item>
          <el-form-item label="商户合同">
<!--              <div class="backgroundImgUrl" ><i class="el-icon-picture"></i></div>-->
              <el-upload
                      class="upload-demo banner_upload"
                      :action="baseUrl+'/api/attachments/insertUploadFile'"
                      :on-preview="handlePreview"
                      :on-remove="handleRemove"
                      :on-change="handleChange"
                      :file-list="fileList"
                      :data="{isInsert:true,type:1}"
                      list-type="picture">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
          </el-form-item>
<!--          <el-form-item label="商户注册时间" >-->
<!--            <el-input v-model="form.createTime" placeholder="" :readonly="ischeck"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="单笔订单销售提成" >-->
<!--            <el-input v-model="form.commission" placeholder="" :readonly="ischeck"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="热度" >-->
<!--            <el-input v-model="form.hot" placeholder="" :readonly="ischeck"></el-input>-->
<!--          </el-form-item>-->
          <el-form-item label="经度" >
            <el-input v-model="form.longitude" placeholder="" :readonly="ischeck"></el-input>
          </el-form-item>
          <el-form-item label="纬度" >
            <el-input v-model="form.latitude" placeholder="" :readonly="ischeck"></el-input>
          </el-form-item>
          <el-form-item label="" >
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer demo-drawer__footer" v-if="!ischeck">
                  <el-button @click="editVisible = false">取 消</el-button>
                  <el-button type="primary" @click="saveEdit" :loading="subloading">{{ subloading ? '提交中 ...' : '确 定' }}</el-button>
              </span>
      </div>
    </el-drawer>

<!--    资金流水-->
    <el-dialog title="资金流水" :visible.sync="dialogVisible" width="90%" :before-close="handleAccountClose">
      <el-table :data="tableAccount" border class="table"  header-cell-class-name="table-header">
        <el-table-column prop="code" label="流水号"></el-table-column>
        <el-table-column prop="userid" label="账户ID" width="80" align="center"></el-table-column>
        <el-table-column prop="orderNumber" label="订单号" align="center"></el-table-column>
        <el-table-column prop="totalAmount" label="总金额" width="80" align="center"></el-table-column>
        <el-table-column prop="amount" label="实付金额"></el-table-column>
        <el-table-column prop="cardCost" label="交易面额" width="120" align="center"></el-table-column>
        <el-table-column prop="cardNumber" label="会员卡号" width="80" align="center"></el-table-column>
        <el-table-column prop="couponAmount" label="优惠金额" width="80" align="center"></el-table-column>
        <el-table-column prop="content" label="交易内容" align="center"></el-table-column>
        <el-table-column prop="createTime" label="交易时期" width="150" align="center"></el-table-column>
        <el-table-column label="交易类型" align="center" width="100" >
          <template slot-scope="scope">
            <!--{{scope.row.type===0?'购物':(scope.row.type===1?'经销商提现':(scope.row.type===2?'分销提成':(scope.row.type===3?'充值赠送':(scope.row.type===4?'积分赠送':''))))}}-->
            {{enumsWalletBillType[scope.row.status]}}
          </template>
        </el-table-column>
        <el-table-column prop="paidType" label="方式" width="80" align="center">
          <template slot-scope="scope">
            <!--{{scope.row.paidType == 0?"微信":(scope.row.paidType == 1?"支付宝":(scope.row.paidType == 2?"纯钱包余额":(scope.row.paidType == 9?"其他":"")))}}-->
            {{enumsPaidType[scope.row.status]}}
          </template>
        </el-table-column>
        <el-table-column prop="point" label="积分消耗" width="80" align="center"></el-table-column>
        <el-table-column prop="pointCost" label="积分抵扣" width="80" align="center"></el-table-column>
        <el-table-column prop="walletCost" label="钱包抵扣" width="80" align="center"></el-table-column>
        <el-table-column prop="platformCommission" label="平台抽成" width="80" align="center"></el-table-column>
        <el-table-column label="状态" align="center" width="100" >
          <template slot-scope="scope">
            <el-tag :type="scope.row.status===0?'warning':(scope.row.status===1?'success':(scope.row.status===2?'danger':''))">
              <!--{{scope.row.status===0?'交易中':(scope.row.status===1?'已入账':(scope.row.status===2?'已取消':""))}}-->
              {{enumsWalletBill[scope.row.status]}}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
                background
                layout="total, sizes, prev, pager, next, jumper"
                :current-page="account.pageNum"
                :page-size="account.pageSize"
                :page-count="totalAccount"
                @current-change="handleAccountPageChange"
                @size-change="handleAccountSizeChange"
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
    import VueCropper  from 'vue-cropperjs';
    export default {
        name: 'index',
        components: {
            vCategory,
            quillEditor,
            VueCropper
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
                typeValue:'',
                apiType:"",
                category:[],
                right:{ // 权限
                    add:false,
                    edit:false,
                    del:false
                },
                ischeck:false,
                dialogVisible:false,
                tableAccount:[],
                account:{
                    code:'',
                    pageNum: 1,
                    pageSize: 10
                },
                totalAccount:'',
                defaultSrc: require('../../../assets/img/img.jpg'),
                imgSrc: '',
                cropImg: '',
                dialogCropVisible: false,
                file:'',
                fileList:[],
                attachmentsList:[],
                enumslist:[],
                enumsWalletBilllist:[],
                enumsPaidTypelist:[],
                enumsWalletBillTypelist:[],
                enums:{}, // 枚举
                enumsWalletBill:{},
                enumsPaidType:{},
                enumsWalletBillType:{},
            };
        },
        mounted() {
            // 权限

            let authorities = JSON.parse(localStorage.getItem("user_information"));
            authorities.authorities.map((item) => {
                switch (item.authority) {
                    case 'ROLE_CUSTOMER_EDIT':this.right.edit = true;break;
                    case 'ROLE_CUSTOMER_DEL':this.right.del = true;break;
                    case 'ROLE_CUSTOMER_ADD':this.right.add = true;break;
                    default:break;
                }
            })

            // 枚举
            let enums = JSON.parse(localStorage.getItem("ClassEnums"));
            let enumslist = enums.CustomerStatusEnum;
            let enumsWalletBilllist = enums.WalletBillStatusEnum;
            let enumsPaidTypelist = enums.PaidTypeEnum;
            let enumsWalletBillTypelist = enums.WalletBillTypeEnum;
            for(let key in enumslist){
                this.enumslist.push(enumslist[key]);
            }
            this.enumslist.map(item => {
                this.$set(this.enums,item.code,item.name);
            })
            for(let key in enumsWalletBilllist){
                this.enumsWalletBilllist.push(enumsWalletBilllist[key]);
            }
            this.enumsWalletBilllist.map(item => {
                this.$set(this.enumsWalletBill,item.code,item.name);
            })
            for(let key in enumsPaidTypelist){
                this.enumsPaidTypelist.push(enumsPaidTypelist[key]);
            }
            this.enumsPaidTypelist.map(item => {
                this.$set(this.enumsPaidType,item.code,item.name);
            })
            for(let key in enumsWalletBillTypelist){
                this.enumsWalletBillTypelist.push(enumsWalletBillTypelist[key]);
            }
            this.enumsWalletBillTypelist.map(item => {
                this.$set(this.enumsWalletBillType,item.code,item.name);
            })

            this.typeValue = 1; // 0用户级别，1经销商级别
            this.apiType = 1; // 区别接口，0文章/商品；1用户/经销商
            bus.$on('categoryCode', msg => {
                this.query.categoryCode = msg;
                this.getData();
            });
            // this.getData();
        },
        methods: {
            // 获取数据
            getData() {
                this.loading = true;
                this.$axios.post("/customer/selectPageList?pageNum="+this.query.pageNum+"&pageSize="+this.query.pageSize,this.query).then(res => {
                    if(res.code == 200) {
                        this.tableData = res.data.records;
                        this.total = res.data.pages;
                    }else{
                        this.$message.error(res.msg);
                    }
                    this.loading = false;
                })
            },
            getAccount() {
                this.$axios.post("/wallet-bill/selectPageList?pageNum="+this.account.pageNum+"&pageSize="+this.account.pageSize,this.account).then(res => {
                    if(res.code == 200) {
                        this.tableAccount = res.data.records;
                        this.totalAccount = res.data.pages;
                    }else{
                        this.$message.error(res.msg);
                    }
                    this.loading = false;
                })
            },
            getDetails(code) {
                this.$axios.get("/customer/selectByPrimaryKey?code="+code).then(res => {
                    if(res.code == 200) {
                        this.form = res.data;
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            getCategory(){// 获取分类
                let params = {
                    type:this.typeValue,
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
                // if(!this.form.categoryCode){
                //     this.$message.error("请选择分类！");
                //     return;
                // }
                // if(!this.form.title){
                //     this.$message.error("请输入标题！");
                //     return;
                // }
                // if(!this.form.content){
                //     this.$message.error("请输入内容！");
                //     return;
                // }
                this.subloading = true;
                this.fileList.map(item => {
                    this.attachmentsList.push(item.response.data.id)
                })
                this.form.attachmentsList = this.attachmentsList;
                this.$axios.post("/customer/insertOrUpdate",this.form).then(res => {
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
                this.ischeck = false;
                this.editVisible = true;
                if(row ){
                    this.form = row;
                    this.title = '编辑';
                }else{
                    this.title = '新增';
                    this.form = {}
                }
            },
            handleAccount(index,row){ // 流水
              this.dialogVisible = true;
                this.$set(this.account, 'code', row.code);
                this.getAccount();
            },
            handleCheck(index,row){ // 查看
                this.title = '商户详情';
              this.ischeck = true;
                this.editVisible = true;
                this.getDetails(row.code)
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageNum', 1);
                this.getData();
            },
            // 状态改变操作
            handleDelete(status, row) {
                let msg = "";
                if(status == 9){
                    msg = "注销";
                }else if(status == 1){
                    msg = "审核通过";
                }else if(status == 2){
                    msg = "审核不通过";
                }
                this.$confirm("确定"+msg+"吗？", '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/customer/insertOrUpdate",{code:row.code,status:status}).then(res => {
                        if (res.code == 200) {
                            this.$message.success(msg+"成功！");
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
                        ids.push(item.code);
                    })
                    this.$axios.post("/customer/deleteBatch",ids).then(res => {
                        if (res.code == 200) {
                            this.$message.success("批量删除成功！");
                            this.getData();
                            this.multipleSelection = [];
                        }
                    })
                }).catch(() => {});
            },
            handleChange(file, fileList) { // 轮播图上传
                this.fileList = fileList.slice(-3);
            },
            handleRemove(file, fileList) {// 轮播图删除
                this.fileList = fileList.slice(-3);
                console.log(file, fileList);
                this.$axios.post("/api/attachments/deleteFile",{url:file.response.data.url,dataType:"form"}).then(res => {
                    if(res.code == 200){
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            handlePreview(file) {
                console.log(file);
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
                        this.$set(this.form, 'logoUrl', res.data.url);
                        this.dialogCropVisible = false;
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
                    this.dialogCropVisible = true;
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
                this.dialogCropVisible = false;
                // this.cropImg = this.defaultSrc;
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
            handleAccountPageChange(val){
                this.$set(this.account, 'pageNum', val);
                this.getAccount();
            },
            handleAccountSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.$set(this.account, 'pageNum', 1);
                this.$set(this.account, 'pageSize', val);
                this.getAccount();
            },
            handleClose(){
                this.editVisible = false;
                this.subloading = false;
                this.form = {};
            },
            handleAccountClose(){
                this.dialogVisible = false;
                this.account={
                    code:'',
                    pageNum: 1,
                    pageSize: 10
                }
            },
            refresh(){ // 刷新
                this.getData();
            }
        },
        watch:{
            dialogCropVisible(newsval,oldval){
                if(!newsval){
                    this.$refs.file.value = '';
                }
            }
        }
    };
</script>

<style lang="scss">
  .commodity_drawer .el-drawer__body{
    overflow-y: auto;
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
  }
  .backgroundImgUrl i{
    font-size: 80px;
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

  .cropDialog{
      z-index: 9999 !important;
      .el-dialog{
          z-index: 9999 !important;
      }
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
  .banner_upload {
      .el-upload-list--picture .el-upload-list__item-thumbnail{
          width: 290px;
          height: 115px;
      }
      .el-upload-list--picture .el-upload-list__item{
          height: 136px;
      }
      .el-upload-list--picture .el-upload-list__item.is-success .el-upload-list__item-name{
          line-height: 115px;
          padding-left: 20px;
      }
  }
</style>
