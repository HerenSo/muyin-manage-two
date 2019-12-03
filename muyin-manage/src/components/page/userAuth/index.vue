<!--
	账号管理
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
        <el-table-column prop="username" label="用户名" >
        </el-table-column>
        <el-table-column prop="loginName" label="角色" >
          <template slot-scope="scope">
            <span class="pr-5" v-for="item in scope.row.roles">{{item.roleName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userphone" label="手机号" width="120" align="center">
        </el-table-column>
        <el-table-column prop="managerType" label="管理员类型" width="120" align="center">
          <template slot-scope="scope">
            {{enumsManagerType[scope.row.managerType]}}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status=='0'?'warning':(scope.row.status=='1'?'success':(scope.row.status=='2'?'danger':(scope.row.status=='3'?'danger':(scope.row.status=='9'?'info':''))))">
              <!--              {{scope.row.status=="0"?"待审核":(scope.row.status=="1"?"正常":(scope.row.status=="2"?"冻结":(scope.row.status=="3"?"审核失败":"注销")))}}-->
              {{enums[scope.row.status]}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180"  align="center">
        </el-table-column>
        <el-table-column label="操作" width="140" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" v-if="right.edit">编辑</el-button>
            <el-button type="text" class="red" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)" v-if="right.del">删除</el-button>
            <el-button type="text" icon="el-icon-document-checked" class="" @click="handleUpdateStatus(1, scope.row)" v-if="scope.row.status ==0">审核通过</el-button>
            <el-button type="text" icon="el-icon-document-add" class="red" @click="handleUpdateStatus(3, scope.row)" v-if="scope.row.status ==0">审核不通过</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :page-count="total">
        </el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-drawer :title="title" :visible.sync="editVisible" size="30%" direction="rtl" :before-close="handleClose">
      <div class="demo-drawer__content">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="头像" label-width="100px">
            <div class="headIconUrl">
              <i class="el-icon-s-custom"></i>
              <div class="crop-demo">
                <img :src="form.headiconUrl" class="pre-img">
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
          <el-form-item label="用户名" label-width="100px" required><el-input v-model="form.username" autocomplete="off"></el-input></el-form-item>
          <el-form-item label="手机号码" label-width="100px" required><el-input v-model="form.userphone" autocomplete="off"></el-input></el-form-item>
          <el-form-item label="密码" label-width="100px" required><el-input type="password" v-model="psw" ></el-input></el-form-item>
          <el-form-item label="用户角色" required>
            <el-select v-model="form.roleIds" multiple placeholder="请选择角色" value-key="value" class="w100">
              <el-option :key="item.roleid" :label="item.roleName" :value="item.roleid" v-for="(item) in roleList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="管理员类型">
            <el-select v-model="form.managerType" placeholder="请选择管理员类型">
              <!--<el-option key="0" label="无" :value="0"></el-option>
              <el-option key="1" label="经销商" :value="1"></el-option>
              <el-option key="2" label="供货商" :value="2"></el-option>-->
              <el-option :key="index" :label="item.name" :value="item.code" v-for="(item,index) in enumsManagerTypelist"></el-option>
            </el-select>
          </el-form-item>
          <!--          <el-form-item label="状态" required>-->
          <!--            <el-select v-model="form.status" placeholder="请选择状态">-->
          <!--              &lt;!&ndash;<el-option key="0" label="待审核" :value="0"></el-option>-->
          <!--              <el-option key="1" label="正常" :value="1"></el-option>-->
          <!--              <el-option key="2" label="冻结" :value="2"></el-option>-->
          <!--              <el-option key="3" label="审核失败" :value="3"></el-option>-->
          <!--              <el-option key="9" label="注销" :value="9"></el-option>&ndash;&gt;-->
          <!--              <el-option :key="index" :label="item.name" :value="item.code" v-for="(item,index) in enumslist"></el-option>-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <el-form-item label="是否为管理员">
            <el-select v-model="form.isAdmin" placeholder="">
              <el-option key="0" label="否" :value="0"></el-option>
              <el-option key="1" label="是" :value="1"></el-option>
            </el-select>
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
        name: 'index',
        components: {
            VueCropper
        },
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
                enumslist:[],
                enumsManagerTypelist:[],
                enums:{}, // 枚举
                enumsManagerType:{},
            }
        },
        created() {
            // 权限
            let authorities = JSON.parse(localStorage.getItem("user_information"));
            if(authorities.isAdmin == 1){
                this.isAdmin = true;
            }
            this.managerType = authorities.managerType;
            authorities.authorities.map((item) => {
                switch (item.authority) {
                    case 'ROLE_USER_EDIT':this.right.edit = true;break;
                    case 'ROLE_USER_DEL':this.right.del = true;break;
                    case 'ROLE_USER_ADD':this.right.add = true;break;
                    default:break;
                }
            })


            // 枚举
            let enums = JSON.parse(localStorage.getItem("ClassEnums"));
            let enumslist = enums.UserStatusEnum;
            let enumsManagerTypelist = enums.ManagerTypeEnum
            for(let key in enumslist){
                this.enumslist.push(enumslist[key]);
            }
            this.enumslist.map(item => {
                this.$set(this.enums,item.code,item.name);
            })
            for(let key in enumsManagerTypelist){
                this.enumsManagerTypelist.push(enumsManagerTypelist[key]);
            }
            this.enumsManagerTypelist.map(item => {
                this.$set(this.enumsManagerType,item.code,item.name);
            })

            //数据
            this.getData();
            this.getRole();

        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 列表数据
            getData() {
                this.$axios.post('/user/selectPageList?pageSize=10&pageNum='+this.cur_page,{managerType:this.managerType}).then((res) => {
                    if(res.code == 200){
                        this.tableData = res.data.records;
                        this.total = res.data.pages;
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            getRole() { // 获取角色列表
                this.$axios.post('/role/selectList',{}).then((res) => {
                    if(res.code == 200){
                        this.roleList = res.data;
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            saveEdit(){
                if(this.form.roleIds.length == 0){
                    this.$message.error("请选择角色！");
                    return;
                }
                if(!this.form.username){
                    this.$message.error("请输入用户名！");
                    return;
                }
                if(!this.form.userphone){
                    this.$message.error("请输入手机号码！");
                    return;
                }
                if(this.form.userid){ // 編輯
                    if(this.isAdmin){ // 是否超级管理员
                        if(this.psw == this.form.password){ // 没有修改密码
                            this.form.password = "";
                        }else{
                            this.form.password = this.psw;
                        }
                    }else{
                        this.form.password = "";
                    }
                }else{
                    if(!this.psw){
                        this.$message.error("请输入密码！");
                        return;
                    }else{
                        this.form.password = this.psw;
                    }
                }
                this.subloading = true;
                this.$axios.post("/user/saveManagerUser",this.form).then(res => {
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
                    this.psw = row.password;
                    let roleIds = [];
                    row.roles.map(item => {
                        roleIds.push(item.roleid)
                    })
                    this.form = {
                        userid:row.userid,
                        username:row.username,
                        userphone:row.userphone,
                        roleIds:roleIds,
                        password:row.password,
                        managerType:row.managerType,
                        status:row.status,
                        isAdmin:row.isAdmin,
                        headiconUrl:row.headiconUrl
                    }
                    this.title = '编辑';
                }else{
                    this.title = '新增';
                    this.form = {
                        status:1,
                        isAdmin:0,
                    }
                }
            },
            // 状态改变操作
            handleUpdateStatus(status, row) {
                let msg = "";
                if(status == 1){
                    msg = "审核通过";
                }else if(status == 3){
                    msg = "审核不通过";
                }
                this.$confirm("确定"+msg+"吗？", '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/user/saveManagerUser",{userid:row.userid,status:status}).then(res => {
                        if (res.code == 200) {
                            this.$message.success(msg+"成功！");
                            this.getData();
                        }
                    })
                }).catch(() => {});
            },
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete("/user/delete?userid=" + row.userid).then(res => {
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
                        ids.push(item.userid);
                    })
                    this.$axios.post("/user/deleteBatch",ids).then(res => {
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
                        this.$set(this.form, 'headiconUrl', res.data.url);
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
