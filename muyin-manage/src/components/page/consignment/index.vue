<template>
  <div>
<!--    <div class="container mb-20 pt-20">-->
<!--      <h4 class="color-666">商品分类</h4>-->
<!--      <hr>-->
<!--      <v-category :typeValue="typeValue" :apiType="apiType"></v-category>-->
<!--    </div>-->
    <div class="container">

      <div class="handle-box">
        <el-button type="primary" icon="el-icon-refresh" class="handle-del " @click="refresh">刷新</el-button>
        <el-input v-model="query.name" placeholder="请输入商品名称" class="handle-input mr10 ml-10"></el-input>
        <el-select v-model="query.status" placeholder="状态" class="handle-select mr10" @change="refresh">
          <el-option key="" label="全部" value=""></el-option>
          <el-option :key="index" :label="item.name" :value="item.code" v-for="(item,index) in enumslist"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" :loading="loading" header-cell-class-name="table-header">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <!--        <el-table-column prop="code" label="编号"></el-table-column>-->
        <el-table-column prop="name" label="商品名称"></el-table-column>
        <el-table-column prop="createName" label="缩略图" width="120" align="center">
          <template slot-scope="scope">
            <el-image :src="scope.row.iconUrl" style="width: 50px; height: 50px" fit="cover">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture f50 color-border"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="saleShowPrice" label="销售价格" width="120" align="center"></el-table-column>
        <el-table-column prop="salePrice" label="当前销售价格" width="120" align="center"></el-table-column>
        <el-table-column prop="supplyPrice" label="供货价格" width="120" align="center"></el-table-column>
        <el-table-column prop="saleTime" label="开始销售" width="100" align="center"></el-table-column>
        <el-table-column prop="saleOverTime" label="售卖到期" width="100" align="center"></el-table-column>
        <el-table-column label="可否积分抵扣" align="center" width="120" >
          <template slot-scope="scope">
            <el-tag :type="scope.row.supportPoint===0?'danger':(scope.row.supportPoint===1?'success':'')">{{scope.row.supportPoint===0?'否':(scope.row.supportPoint===1?'是':'')}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="80" >
          <template slot-scope="scope">
            <el-tag :type="scope.row.status===0?'warning':(scope.row.status===1?'success':(scope.row.status===2?'danger':(scope.row.status===3?'info':(scope.row.status===4?'':''))))">
              <!--              {{scope.row.status===0?'待审核':(scope.row.status===1?'审核通过':(scope.row.status===2?'审核不通过':(scope.row.status===3?'下架':(scope.row.status===4?'上架':''))))}}-->
              {{enums[scope.row.status]}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-document-checked" class="" @click="handleCheck(scope.row)">查看</el-button>
            <el-button type="text" icon="el-icon-document-checked" class="" @click="handleUpdateStatus(1, scope.row)" v-if="scope.row.status ==0 && right.audit">审核通过</el-button>
            <el-button type="text" icon="el-icon-document-delete" class="red" @click="handleUpdateStatus(2, scope.row)" v-if="scope.row.status ==0 && right.audit">审核不通过</el-button>
            <el-button type="text" icon="el-icon-sold-out" class="red" @click="handleUpdateStatus(3, scope.row)" v-if="scope.row.status ==4 && right.audit">下架</el-button>
            <el-button type="text" icon="el-icon-sell" class="" @click="handleUpdateStatus(4, scope.row)" v-if="(scope.row.status ==3 || scope.row.status===1) && right.audit">上架</el-button>
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
    <el-drawer title="商品详情" :visible.sync="editVisible" size="60%" direction="rtl"  class="commodity_drawer">
      <div class="demo-drawer__content">
        <el-form ref="form" :model="form" label-width="140px" :rules="rules">
          <el-tabs v-model="activeName">
            <el-tab-pane label="基本信息" name="first">
              <el-form-item label="商品名称"  prop="name">
                <el-input v-model="form.name" placeholder="请输入商品名称" readonly="readonly"></el-input>
              </el-form-item>
              <el-form-item label="商品分类" >
                <el-select v-model="form.type" placeholder=""disabled >
                  <el-option :key="index" :label="item.name" :value="item.code" v-for="(item,index) in enumsTypelist"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="商品所属类型">
                <el-cascader
                        v-model="form.categoryCode"
                        disabled
                        :options="category"
                        :props="{ expandTrigger: 'hover',value:'code',label:'name',children:'subCategorys' }"></el-cascader>
              </el-form-item>
              <el-form-item label="商品展示原价"  prop="saleShowPrice" >
                <el-input v-model="form.saleShowPrice" placeholder="请输入商品展示的原售价格" readonly="readonly"></el-input>
              </el-form-item>
              <el-form-item label="商品展示售价"  prop="salePrice" >
                <el-input v-model="form.salePrice" placeholder="请输入商品实际售价" readonly="readonly"></el-input>
              </el-form-item>
              <el-form-item label="商品积分售价" >
                <el-input v-model="form.pointPrice" placeholder="请输入商品积分售价" readonly="readonly"></el-input>
              </el-form-item>
              <el-form-item label="所属供货商" >
                <el-select v-model="form.customerCode" placeholder="请选择" disabled>
                  <el-option v-for="(item,index) in customer" :key="index" :label="item.name" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="商品供货价"  prop="supplyPrice">
                <el-input v-model="form.supplyPrice" placeholder="请输入供货商商品供货价" readonly="readonly"></el-input>
              </el-form-item>
              <el-form-item label="开始销售时间"  readonly="readonly">
                <el-date-picker
                        v-model="form.saleTime"
                        type="datetime"
                        disabled
                        placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="售卖到期时间"  readonly="readonly">
                <el-date-picker
                        v-model="form.saleOverTime"
                        type="datetime"
                        disabled
                        placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="简单描述">
                <el-input  v-model="form.description" placeholder="请输入简单描述"  readonly="readonly"></el-input>
              </el-form-item>
              <el-form-item label="是否支持积分抵扣">
                <!--                        <el-select v-model="form.supportPoint" placeholder="">-->
                <!--                            <el-option key="1" label="是" :value="1"></el-option>-->
                <!--                            <el-option key="0" label="否" :value="0"></el-option>-->
                <!--                        </el-select>-->
                <el-switch
                        v-model="form.supportPoint"
                        disabled
                        active-text="是"
                        inactive-text="否"
                        :active-value="1"
                        :inactive-value="0">
                </el-switch>
              </el-form-item>
              <el-form-item label="缩略图" >
                <div class="headIconUrl">
                  <i class="el-icon-plus"></i>
                  <div class="crop-demo">
                    <img :src="form.iconUrl" class="pre-img">
                  </div>
<!--                  <input ref="file" class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>-->
                </div>
<!--                <el-dialog class="cropDialog" title="裁剪图片" :visible.sync="dialogVisible" width="30%">-->
<!--                  <vue-cropper ref='cropper' :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage" style="width:100%;height:300px;"></vue-cropper>-->
<!--                  <span slot="footer" class="dialog-footer">-->
<!--                                <el-button @click="cancelCrop">取 消</el-button>-->
<!--                                <el-button type="primary" @click="sureCrop">确 定</el-button>-->
<!--                            </span>-->
<!--                </el-dialog>-->
              </el-form-item>
              <el-form-item label="轮播顶图">
                <!--                        <div class="backgroundImgUrl"><i class="el-icon-picture"></i></div>-->
                <el-upload
                        class="upload-demo banner_upload"
                        :action="baseUrl+'/api/attachments/insertUploadFile'"
                        :file-list="fileList"
                        ref="banner"
                        :data="{isInsert:true,type:1}"
                        list-type="picture">
<!--                  <el-button size="small" type="primary">点击上传</el-button>-->
<!--                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                </el-upload>
              </el-form-item>
              <el-form-item label="" >
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品规格" name="second">
              <el-form-item label="是否为主规格" label-width="120px">
                <el-switch
                        disabled
                        v-model="commodityAttrsItem.isMain"
                        active-text="是"
                        inactive-text="否"
                        :active-value="1"
                        :inactive-value="0">
                </el-switch>
              </el-form-item>
<!--              <el-divider content-position="left">规格</el-divider>-->
              <el-form-item class="commodityAttrs" :label="item.name" label-width="120px" v-for="(item,index) in commodityAttrs" :key="index" >
                <el-tag
                        :key="tag"
                        v-for="(tag,i) in item.commodityAttrItems"
                        size="medium"
                        style="margin-left: 0;margin-right: 10px">
                  {{tag.tagName}}&nbsp;￥{{tag.salePrice}}/<del>{{tag.saleShowPrice}}</del>&nbsp;{{tag.stock}}件
                </el-tag>
<!--                <div class="attrClose" ><i class="el-icon-close"></i></div>-->
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="详情信息" name="third">
              <el-form-item label="商品条形码编号">
                <el-input v-model="commodityDetails.barNumber" placeholder="请输入商品条形码编号" readonly="readonly"></el-input>
              </el-form-item>
              <el-form-item label="保质期（天）">
                <el-input v-model="commodityDetails.expirationDate" placeholder="请输入保质期" readonly="readonly"></el-input>
              </el-form-item>
              <el-form-item label="原产地">
                <el-input v-model="commodityDetails.origin" placeholder="请输入原产地" readonly="readonly"></el-input>
              </el-form-item>
              <!--                    <el-form-item label="规格" required>-->
              <!--                        <el-input v-model="commodityDetails.specification" placeholder="请输入规格"></el-input>-->
              <!--                    </el-form-item>-->
              <el-form-item label="商品描述" >
                <el-input v-model="commodityDetails.deatils" placeholder="请输入商品描述" readonly="readonly"></el-input>
              </el-form-item>
              <el-form-item label="商品详情">
                <quill-editor ref="myTextEditor" v-model="commodityDetails.description" :options="editorOption" disabled readonly="readonly"></quill-editor>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>

        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
    import VueCropper  from 'vue-cropperjs';
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';
    import bus from '../../common/bus';
    import vCategory from '../../common/category.vue';
    const toolbarOptions = [
        ['clean']                                         // remove formatting button
    ]
    export default {
        name: 'index',
        components: {
            vCategory,
            quillEditor,
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
                editVisible:false,
                multipleSelection: [],
                total: 0,
                activeName: 'first',
                form: {},
                rules: { // 表单验证规则
                },
                editorOption: {
                    placeholder: '',
                    modules: {
                        toolbar: {
                            container: toolbarOptions,  // 工具栏
                            handlers: {
                                'image': function (value) {
                                    if (value) {
                                        console.log('自定义图片');
                                        document.querySelector('.setImageEditor').click()
                                    } else {
                                        this.quill.format('image', false);
                                    }
                                }
                            }
                        }
                    }
                },
                editorFileList:[],
                typeValue:'',
                apiType:'',
                category:[], // 分类
                customer:[], // 经销商
                commodityDetails:{}, // 商品详情
                attachmentsList:[], // 图片附件集合
                commodityAttrs:[], // 属性
                commodityAttrsItem:{},
                dynamicTags: [],
                right:{ // 权限
                    add:false,
                    edit:false,
                    del:false,
                    audit:false
                },
                defaultSrc: require('../../../assets/img/img.jpg'),
                imgSrc: '',
                cropImg: '',
                dialogVisible: false,
                file:'',
                fileList:[],
                enumslist:[],
                enumsTypelist:[],
                enumsType:{},
                enums:{} // 枚举
            };
        },
        mounted() {
            // 权限

            let authorities = JSON.parse(localStorage.getItem("user_information"));
            authorities.authorities.map((item) => {
                switch (item.authority) {
                    case 'ROLE_CONSIGNMENT_AUDIT':this.right.audit = true;break;
                    default:break;
                }
            })

            // 枚举
            let enums = JSON.parse(localStorage.getItem("ClassEnums"));
            let enumslist = enums.CommodityStatusEnum;
            let enumsTypelist = enums.CommodityTypeEnum;
            for(let key in enumslist){
                this.enumslist.push(enumslist[key]);
            }
            this.enumslist.map(item => {
                this.$set(this.enums,item.code,item.name);
            })
            for(let key in enumsTypelist){
                this.enumsTypelist.push(enumsTypelist[key]);
            }
            this.enumsTypelist.map(item => {
                this.$set(this.enumsType,item.code,item.name);
            })
            //
            // this.typeValue = 0; // 0商品，1文章
            // this.apiType = 0; // 区别接口，0文章/商品；1用户/经销商
            // bus.$on('categoryCode', msg => {
            //     this.query.categoryCode = msg;
            //     this.getData();
            // });
            this.getData();
        },
        methods: {
            // 获取数据
            getData() {
                this.loading = true;
                this.$axios.post("/commodity/selectConsignmentCommodity?pageNum="+this.query.pageNum+"&pageSize="+this.query.pageSize,this.query).then(res => {
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
                    type:this.typeValue,
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
                                    }else{
                                        i.subCategorys.map(a => {
                                            if(a.subCategorys.length == 0){
                                                delete a.subCategorys;
                                            }else{
                                                a.subCategorys.map(b => {
                                                    if(b.subCategorys.length == 0){
                                                        delete b.subCategorys;
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            getCustomer(){// 获取供销商
                this.$axios.post("/customer/selectList",{}).then(res => {
                    if(res.code == 200){
                        this.customer = res.data;
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            getDetails(code) { // 获取详情
                this.$axios.get("/commodity/selectCommodityDetail?code="+code).then(res => {
                    if(res.code == 200) {
                        this.form = res.data;
                        let categoryCode = this.form.categoryCode;
                        this.form.categoryCode = [];
                        this.form.categoryCode.push(categoryCode);
                        console.log("categoryCode--",this.form.categoryCode)
                        this.fileList =  res.data.attachmentsList;
                        this.commodityDetails =  res.data.commodityDetails;
                        this.commodityAttrs =  res.data.commodityAttrs;
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            handleCheck(row){
                this.editVisible = true;
                this.getDetails(row.code);
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
                }else if(status == 1){
                    msg = "审核通过";
                }else if(status == 2){
                    msg = "审核不通过";
                }else if(status == 3){
                    msg = "下架";
                }else if(status == 4){
                    msg = "上架";
                }
                this.$confirm("确定"+msg+"吗？", '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/commodity/updateCommodityStatus",{code:row.code,status:status,dataType:'form'}).then(res => {
                        if (res.code == 200) {
                            this.$message.success(msg+"成功！");
                            this.getData();
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
            refresh(){ // 刷新
                this.getData();
            }
        },
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
  .commodityAttrs{
    border:1px solid #ededed;
    border-radius: 5px;
    position: relative;
    padding: 10px 0;
    .attrClose{
      position: absolute;
      top:-25px;
      right: -5px;
      padding: 10px;
      cursor: pointer;
      &:hover{
        color: $color-theme;
      }
    }
  }
  .el-upload{
    display: inherit;
  }
</style>
