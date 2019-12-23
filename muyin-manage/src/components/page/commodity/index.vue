<template>
  <div>
    <div class="container mb-20 pt-20">
      <h4 class="color-666">商品分类</h4>
      <hr>
      <v-category :typeValue="typeValue" :apiType="apiType"></v-category>
    </div>
    <div class="container">

      <div class="handle-box">
        <el-button type="primary" icon="el-icon-refresh" class="handle-del " @click="refresh">刷新</el-button>
        <el-button type="primary" icon="el-icon-lx-add" class="handle-del " @click="handleEdit" v-if="right.add">新增</el-button>
        <el-button type="primary" icon="el-icon-printer" @click="handlePrinter">导出</el-button>
        <el-button type="primary" icon="el-icon-delete" class="handle-del" @click="delAllSelection" v-if="right.del">批量删除</el-button>
        <el-input v-model="query.name" placeholder="请输入商品名称" class="handle-input mr10 ml-10"></el-input>
        <el-select v-model="query.customerCode" placeholder="请选择供货商" @change="refresh" v-if="managerType == 2" class="mr10">
          <el-option key="" label="全部" value=""></el-option>
          <el-option v-for="(item,index) in customer" :key="index" :label="item.name" :value="item.code"></el-option>
        </el-select>
<!--        <el-date-picker v-model="query.saleTime" type="date" placeholder="请选择销售时间" class="mr10">-->
<!--        </el-date-picker>-->
        <el-select v-model="query.status" placeholder="状态" class="handle-select mr10" @change="refresh">
          <el-option key="" label="全部" value=""></el-option>
<!--          <el-option key="0" label="待审核" value="0"></el-option>-->
<!--          <el-option key="1" label="审核通过" value="1"></el-option>-->
<!--          <el-option key="2" label="审核不通过" value="2"></el-option>-->
<!--          <el-option key="3" label="下架" value="3"></el-option>-->
<!--          <el-option key="4" label="上架" value="4"></el-option>-->
          <el-option :key="index" :label="item.name" :value="item.code" v-for="(item,index) in enumslist"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" v-loading="loading" header-cell-class-name="table-header" @selection-change="handleSelectionChange">
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
        <el-table-column label="商品分类" width="120" align="center">
            <template slot-scope="scope">
                <el-tag>
                    {{enumsType[scope.row.type]}}
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="商品所属类型" width="120" align="center"></el-table-column>
        <el-table-column prop="saleShowPrice" label="销售价格" width="120" align="center"></el-table-column>
        <el-table-column prop="salePrice" label="当前销售价格" width="120" align="center"></el-table-column>
        <el-table-column prop="supplyPrice" label="供货价格" width="120" align="center"></el-table-column>
        <el-table-column prop="commodityStock" label="剩余库存"  align="center"></el-table-column>
        <el-table-column prop="saleTime" label="开始销售" width="100" align="center"></el-table-column>
        <el-table-column prop="saleOverTime" label="售卖到期" width="100" align="center"></el-table-column>
        <el-table-column prop="customerName" label="供货商" min-width="120" v-if="managerType == 2"></el-table-column>
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
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" v-if="right.edit">编辑</el-button>
<!--            <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)" v-if="right.del">删除</el-button>-->
              <el-button type="text" icon="el-icon-document-checked" class="" @click="handleUpdateStatus(1, scope.row)" v-if="scope.row.status ==0">审核通过</el-button>
              <el-button type="text" icon="el-icon-document-delete" class="red" @click="handleUpdateStatus(2, scope.row)" v-if="scope.row.status ==0">审核不通过</el-button>
              <el-button type="text" icon="el-icon-sold-out" class="red" @click="handleUpdateStatus(3, scope.row)" v-if="scope.row.status ==4">下架</el-button>
              <el-button type="text" icon="el-icon-sell" class="" @click="handleUpdateStatus(4, scope.row)" v-if="scope.row.status ==3 || scope.row.status===1">上架</el-button>
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
        <el-form ref="form" :model="form" label-width="140px" :rules="rules">
            <el-tabs v-model="activeName">
                <el-tab-pane label="基本信息" name="first">
                    <el-form-item label="商品名称"  prop="name">
                        <el-input v-model="form.name" placeholder="请输入商品名称"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类" required>
                        <el-select v-model="form.type" placeholder="">
<!--                            <el-option key="0" label="普通[默认]" :value="0"></el-option>-->
<!--                            <el-option key="1" label="会员" :value="1"></el-option>-->
<!--                            <el-option key="2" label="寄卖" :value="2"></el-option>-->
<!--                            <el-option key="3" label="0元购" :value="3"></el-option>-->
<!--                            <el-option key="4" label="新人礼" :value="4"></el-option>-->
                          <el-option :key="index" :label="item.name" :value="item.code" v-for="(item,index) in enumsTypelist"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品所属类型">
                        <el-cascader
                                clearable
                                v-model="form.categoryCode"
                                :options="category"
                                :props="{ expandTrigger: 'hover',value:'code',label:'name',children:'subCategorys' }"></el-cascader>
                    </el-form-item>
                    <el-form-item label="商品展示原价" prop="saleShowPrice">
                      <el-input v-model="form.saleShowPrice" placeholder="请输入商品展示的原售价格"></el-input>
                    </el-form-item>
                    <el-form-item label="商品展示售价" prop="salePrice">
                      <el-input v-model="form.salePrice" placeholder="请输入商品展示售价"></el-input>
                    </el-form-item>
                    <el-form-item label="商品积分售价" required>
                        <el-input v-model="form.pointPrice" placeholder="请输入商品积分售价"></el-input>
                    </el-form-item>
                    <el-form-item label="所属供货商" required v-if="managerType == 2">
                        <el-select v-model="form.customerCode" placeholder="请选择">
                            <el-option v-for="(item,index) in customer" :key="index" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品供货价" prop="supplyPrice">
                        <el-input v-model="form.supplyPrice" placeholder="请输入供货商商品供货价"></el-input>
                    </el-form-item>
                  <el-form-item label="配送费">
                    <el-input v-model="form.postage" placeholder="请输入配送费"></el-input>
                  </el-form-item>
                    <el-form-item label="开始销售时间" required>
                        <el-date-picker
                                v-model="form.saleTime"
                                type="datetime"
                                placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="售卖到期时间">
                        <el-date-picker
                                v-model="form.saleOverTime"
                                type="datetime"
                                placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="简单描述" required>
                        <el-input  v-model="form.description" placeholder="请输入简单描述"></el-input>
                    </el-form-item>
                    <el-form-item label="热度" prop="hot">
                        <el-input v-model="form.hot" placeholder="请输入热度"></el-input>
                    </el-form-item>
                    <el-form-item label="是否支持积分抵扣" required>
<!--                        <el-select v-model="form.supportPoint" placeholder="">-->
<!--                            <el-option key="1" label="是" :value="1"></el-option>-->
<!--                            <el-option key="0" label="否" :value="0"></el-option>-->
<!--                        </el-select>-->
                        <el-switch
                                v-model="form.supportPoint"
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
                            <input ref="file" class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
                        </div>
                        <span class="color-999">（建议上传图片尺寸170*170）</span>
                        <el-dialog class="cropDialog" title="裁剪图片" :visible.sync="dialogVisible" width="30%">
                            <vue-cropper ref='cropper' :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage" style="width:100%;height:300px;"></vue-cropper>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="cancelCrop">取 消</el-button>
                                <el-button type="primary" @click="sureCrop">确 定</el-button>
                            </span>
                        </el-dialog>
                    </el-form-item>
                    <el-form-item label="轮播顶图">
<!--                        <div class="backgroundImgUrl"><i class="el-icon-picture"></i></div>-->
                        <el-upload
                                class="upload-demo banner_upload"
                                :action="baseUrl+'/api/attachments/insertUploadFile'"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                :on-change="handleChange"
                                :file-list="fileList"
                                ref="banner"
                                :data="{isInsert:true,type:1}"
                                list-type="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb，建议尺寸375*375</div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="" >
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品规格" name="second">
                    <el-form-item label="规格类型" label-width="100px">
                        <el-input v-model="commodityAttrsItem.name" placeholder="请输入属性类型，例：颜色" style="width:440px;padding-right: 10px"></el-input>
                        <div class="mt-10 border">
                            <el-tag
                                    :key="tag"
                                    v-for="tag in dynamicTags"
                                    size="medium"
                                    closable
                                    :disable-transitions="false"
                                    style="margin-left: 0;margin-right: 10px"
                                    @close="handleTagsClose(tag)">
                              <span class="inputTag">{{tag.tagName}} <img :src="tag.imageUrl" v-if="tag.imageUrl" /> &nbsp;￥{{tag.salePrice}}/<del>{{tag.saleShowPrice}}</del>&nbsp;{{tag.stock}}件</span>
                            </el-tag>
                          <!--编辑属性-->
                          <div v-if="isAttrsEdit" class="inputAttrsGroup" v-for="(edit,index) in commodityAttrsItem.commodityAttrItems" :key="index">
                            <el-input class="input-new-tag"  v-model="edit.tagName" placeholder="属性名称，例：红色" ref="saveTagInput" size="small">
                            </el-input>
                            <el-input class="input-new-tag" v-model="edit.saleShowPrice" placeholder="销售价格"  ref="saveTagInput" size="small"  >
                            </el-input>
                            <el-input class="input-new-tag" v-model="edit.salePrice" placeholder="当前价格"  ref="saveTagInput" size="small" >
                            </el-input>
                            <el-input class="input-new-tag" v-model="edit.stock" placeholder="库存量"  ref="saveTagInput" size="small" >
                            </el-input>
                            <div class="headAttrsUrl">
                              <!--                                <i class="el-icon-plus"></i>-->
                              <div class="crop-demo">
                                <img :src="edit.imageUrl" class="pre-img" v-if="edit.imageUrl">
                              </div>
                            </div>
                            <div class="headAttrsUrl">
                              <el-button  class="button-new-tag" size="small"  style="margin-left: 0;" >修改图片</el-button>
                              <input ref="file" class="crop-input" type="file" name="image" accept="image/*" @change="setAttrImage" @click="editAttrImage(index)"/>
                            </div>
                          </div>
                          <!--新增属性-->
                            <div v-if="inputVisible" class="inputAttrsGroup">
                                <el-input class="input-new-tag"  v-model="inputValue.tagName" placeholder="属性名称，例：红色" ref="saveTagInput" size="small">
                                </el-input>
                                <el-input class="input-new-tag" v-model="inputValue.saleShowPrice" placeholder="销售价格"  ref="saveTagInput" size="small"  >
                                </el-input>
                                <el-input class="input-new-tag" v-model="inputValue.salePrice" placeholder="当前价格"  ref="saveTagInput" size="small" >
                                </el-input>
                                <el-input class="input-new-tag" v-model="inputValue.stock" placeholder="库存量"  ref="saveTagInput" size="small" >
                                </el-input>
                              <div class="headAttrsUrl" v-if="inputValue.imageUrl">
<!--                                <i class="el-icon-plus"></i>-->
                                <div class="crop-demo">
                                  <img :src="inputValue.imageUrl" class="pre-img" v-if="inputValue.imageUrl">
                                </div>
                              </div>
                              <div class="headAttrsUrl" v-else>
                                <el-button  class="button-new-tag" size="small"  style="margin-left: 0;" >上传图片</el-button>
                                <input ref="file" class="crop-input" type="file" name="image" accept="image/*" @change="setAttrImage"  @click="addAttrImage"/>
                              </div>
                                <el-button v-if="inputVisible" type="primary" class="button-new-tag" size="small"  style="margin-left: 0;" @click="handleInputConfirm">确定</el-button>
                            </div>
                            <el-button v-if="!inputVisible" class="button-new-tag" size="small" @click="showInput" style="margin-left: 0;">+ 添加属性值</el-button>
                        </div>
                    </el-form-item>
                    <el-form-item label="设为主规格" label-width="100px">
                        <el-switch
                            v-model="commodityAttrsItem.isMain"
                            active-text="是"
                            inactive-text="否"
                            :active-value="1"
                            :inactive-value="0">
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="" label-width="120px">
                        <el-button size="small" type="primary" @click="submitCommodityAttrs">{{isAttrsEdit?'确定':'确定添加'}}</el-button>
                    </el-form-item>
                    <el-divider content-position="left">规格</el-divider>
                    <el-form-item class="commodityAttrs" :label="item.name" label-width="120px" v-for="(item,index) in commodityAttrs" :key="index" >
                        <el-tag
                            :key="i"
                            v-for="(tag,i) in item.commodityAttrItems"
                            size="medium"
                            style="margin-left: 0;margin-right: 10px">
                          <span class="inputTag">{{tag.tagName}} <img :src="tag.imageUrl" v-if="tag.imageUrl" /> &nbsp;￥{{tag.salePrice}}/<del>{{tag.saleShowPrice}}</del>&nbsp;{{tag.stock}}件</span>
                        </el-tag>
                        <div class="attrClose" @click="handleAttrsClose(index)"><i class="el-icon-close"></i></div>
                        <div class="attrClose attredit" @click="handleAttrsEdit(index)"><i class="el-icon-edit"></i></div>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="详情信息" name="third">
                    <el-form-item label="商品条形码编号">
                        <el-input v-model="commodityDetails.barNumber" placeholder="请输入商品条形码编号"></el-input>
                    </el-form-item>
                    <el-form-item label="保质期（天）">
                        <el-input v-model="commodityDetails.expirationDate" placeholder="请输入保质期"></el-input>
                    </el-form-item>
                    <el-form-item label="原产地">
                        <el-input v-model="commodityDetails.origin" placeholder="请输入原产地"></el-input>
                    </el-form-item>
<!--                    <el-form-item label="规格" required>-->
<!--                        <el-input v-model="commodityDetails.specification" placeholder="请输入规格"></el-input>-->
<!--                    </el-form-item>-->
                    <el-form-item label="商品描述">
                        <el-input v-model="commodityDetails.deatils" placeholder="请输入商品描述"></el-input>
                    </el-form-item>
                    <el-form-item label="商品详情" required >
                        <span class="color-999" style="position: absolute;left: -90px;top:30px;">（图片宽375）</span>
                        <quill-editor ref="myTextEditor" v-model="commodityDetails.description" :options="editorOption"></quill-editor>
                    </el-form-item>
                </el-tab-pane>
            </el-tabs>

        </el-form>
        <!--富文本编辑框 图片上传-->
        <el-upload
              class="upload-demo"
              :action="baseUrl+'/api/attachments/insertUploadFile'"
              multiple
              style="display: none;"
              :on-success="handleEditorFileChange"
              :data="{isInsert:false,type:1}"
              :file-list="editorFileList">
          <el-button size="small" type="primary" id="setImageEditor" class="setImageEditor">点击上传</el-button>
        </el-upload>

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
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';
    import bus from '../../common/bus';
    import vCategory from '../../common/category.vue';
    // 工具栏配置
    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{'header': 1}, {'header': 2}],               // custom button values
        [{'list': 'ordered'}, {'list': 'bullet'}],
        [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
        [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
        [{'direction': 'rtl'}],                         // text direction

        [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
        [{'header': [1, 2, 3, 4, 5, 6, false]}],

        [{'color': []}, {'background': []}],          // dropdown with defaults from theme
        [{'font': []}],
        [{'align': []}],
        ['link', 'image', 'video'],
        ['clean']                                         // remove formatting button
    ]
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
                    status:'',
                    customerCode:'',
                    name:'',
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
                activeName: 'first',
                form: {
                    name: '',
                    saleShowPrice: '',
                    salePrice: '',
                    supplyPrice: '',
                    categoryCode:[],
                },
                rules: { // 表单验证规则
                    name: [
                        { required: true, message: '请输入商品名称', trigger: 'blur' }
                    ],
                    saleShowPrice: [
                        { required: true, message: '请输入商品展示的原售价格', trigger: 'blur' }
                    ],
                    salePrice: [
                        { required: true, message: '请输入商品实际售价', trigger: 'blur' }
                    ],
                    supplyPrice: [
                        { required: true, message: '请输入供货价', trigger: 'blur' }
                    ],
                    // hot: [
                    //     { message: '请输入正整数', trigger: 'blur' },
                    //     // {
                    //     //     validator(rule, value, callback) {
                    //     //         if (Number.isInteger(Number(value)) && Number(value) > 0) {
                    //     //             callback()
                    //     //         } else if(value !== '' ){
                    //     //             callback(new Error('请输入正整数'))
                    //     //         }
                    //     //     },
                    //     //     trigger: 'blur'
                    //     // }
                    // ]
                },
                subloading:false,
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
                inputVisible: false,
                inputValue: {},
                right:{ // 权限
                    add:false,
                    edit:false,
                    del:false
                },
                defaultSrc: require('../../../assets/img/img.jpg'),
                imgSrc: '',
                cropImg: '',
                dialogVisible: false,
                file:'',
                attrfile:'',
                fileList:[],
                enumslist:[],
                enumsTypelist:[],
                enumsType:{},
                enums:{}, // 枚举
                croploading:false,
                isAttrsEdit:false,
                commodityAttrsIndex:'',
                commodityAttrsItemIndex:'',
                managerType:''
            };
        },
        mounted() {
            // 权限

            let authorities = JSON.parse(localStorage.getItem("user_information"));
            this.managerType = authorities.managerType;
            authorities.authorities.map((item) => {
                switch (item.authority) {
                    case 'ROLE_COMMODITY_EDIT':this.right.edit = true;break;
                    case 'ROLE_COMMODITY_DEL':this.right.del = true;break;
                    case 'ROLE_COMMODITY_ADD':this.right.add = true;break;
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

            this.typeValue = 0; // 0商品，1文章
            this.apiType = 0; // 区别接口，0文章/商品；1用户/经销商
            bus.$on('categoryCode', msg => {
                this.query.categoryCode = msg;
                this.getData();
            });
            // this.getData();
            this.getCategory();
            this.getCustomer();
        },
        methods: {
            // 获取数据
            getData() {
                this.loading = true;
                this.$axios.post("/commodity/selectPageList?pageNum="+this.query.pageNum+"&pageSize="+this.query.pageSize,this.query).then(res => {
                    if(res.code == 200) {
                        this.tableData = res.data.records;
                        this.total = res.data.pages;
                    }else{
                        this.$message.error(res.msg);
                    }
                    this.loading = false;
                })
            },
            getDetails(code) { // 获取详情
                this.$axios.get("/commodity/selectCommodityDetail?code="+code).then(res => {
                    if(res.code == 200) {
                        this.form = res.data;
                        let categoryCode = this.form.categoryCode;
                        this.form.categoryCode = [];
                        this.form.categoryCode.push(categoryCode);
                        // console.log("categoryCode--",this.form.categoryCode)
                        this.fileList =  res.data.attachmentsList;
                        this.commodityDetails =  res.data.commodityDetails;
                        this.commodityAttrs =  res.data.commodityAttrs;
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
            // 保存编辑
            saveEdit() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        // if(!this.form.categoryCode){
                        //     this.$message.error("请选择分类！");
                        //     return;
                        // }
                        if(!this.form.name){
                            this.$message.error("请输入商品名称");
                            return;
                        }
                        if(!this.form.supplyPrice){
                            this.$message.error("请输入供货价！");
                            return;
                        }
                        if(this.fileList.length == 0){
                            this.$message.error("请上传轮播图！");
                            return;
                        }
                        if(isNaN(this.commodityDetails.expirationDate) && this.commodityDetails.expirationDate){
                            this.$message.error("保质期需输入数字！或为空");
                            return;
                        }
                        if(this.form.hot && !(/(^[1-9]\d*$)/.test(this.form.hot))){
                            this.$message.error("热度请输入正整数！或为空");
                            return;
                        }
                        console.log(this.fileList)
                        this.attachmentsList =[];
                        this.fileList.map(item => {
                            if(item.id) {
                                this.attachmentsList.push(item.id);
                            }else{
                                this.attachmentsList.push(item.response.data.id);
                            }
                        })
                        this.form.attachmentsList = this.attachmentsList;
                        // console.log("fileList",this.form.attachmentsList);
                        this.form.commodityDetails = this.commodityDetails;
                        this.form.commodityAttrs = this.commodityAttrs;

                        // console.log(this.form.categoryCode)
                        if(this.form.categoryCode.length > 0){
                            this.form.categoryCode = this.form.categoryCode[this.form.categoryCode.length -1];
                        }else{
                            this.form.categoryCode = ""
                        }

                        this.subloading = true;
                        this.$axios.post("/commodity/insertOrUpdate",this.form).then(res => {
                            if(res.code == 200){
                                this.$message.success(this.title+"成功！");
                                this.editVisible = false;
                                this.handleClose();
                                this.getData();
                            }else{
                                this.$message.error(res.msg);
                            }
                            this.subloading = false;
                        })
                    } else {
                        return false;
                    }
                });

            },
            // 编,辑操作
            handleEdit(index, row) {
                this.editVisible = true;
                if(row ){
                    this.title = '编辑';
                    this.getDetails(row.code);
                }else{
                    this.title = '新增';
                    this.form = {
                        categoryCode:[]
                    }
                }
            },
            handleTagsClose(tag) { // 删除商品属性值
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            },
            handleAttrsEdit(index){
                console.log(this.commodityAttrs[index]);
                this.commodityAttrsIndex = index;
                this.isAttrsEdit = true;
                this.commodityAttrsItem = this.commodityAttrs[index];
                this.dynamicTags = this.commodityAttrs[index].commodityAttrItems;
            },
            handleAttrsClose(index){
                this.commodityAttrs.splice(index, 1);
                this.isAttrsEdit = false;
                this.commodityAttrsItemIndex = '';
                this.commodityAttrsIndex = '';
                this.$forceUpdate();
            },
            showInput() { // 输入商品属性值
                this.inputVisible = true;
                // this.$nextTick(_ => {
                //     this.$refs.saveTagInput.$refs.input.focus();
                // });
            },
            handleInputConfirm() { // 添加商品属性值
                let inputValue = this.inputValue;
                if (!inputValue.tagName){
                    this.$message.error("请输入属性值名称！");
                    return;
                }
                if (!inputValue.salePrice){
                    this.$message.error("请输入当前价格！");
                    return;
                }
                if (!inputValue.stock){
                    this.$message.error("请输入库存量！");
                    return;
                }
                if (inputValue) {
                    this.dynamicTags.push(inputValue);
                }
                this.inputVisible = false;
                this.inputValue = {};
            },
            submitCommodityAttrs(){ // 确定商品属性
                if(!this.commodityAttrsItem.name){
                    this.$message.error("请输入属性名称！");
                    return;
                }
                if(this.dynamicTags.length == 0){
                    this.$message.error("请至少添加一个属性值！");
                    return;
                }
                if(!this.commodityAttrsItem.isMain){
                    this.commodityAttrsItem.isMain = 0;
                }
                this.commodityAttrsItem.commodityAttrItems = this.dynamicTags;
                if(this.isAttrsEdit){
                    this.commodityAttrs[this.commodityAttrsIndex] = this.commodityAttrsItem;
                }else{
                    this.commodityAttrs.push(this.commodityAttrsItem);
                }
                this.dynamicTags = [];
                this.commodityAttrsItem = {};
                this.inputVisible = false;
                this.isAttrsEdit = false;
                this.commodityAttrsItemIndex = '';
                this.commodityAttrsIndex = '';
                console.log(this.commodityAttrs)
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
                    this.$axios.delete("/commodity/delete?code=" + row.code).then(res => {
                        if (res.code == 200) {
                            this.$message.success("删除成功！");
                            this.getData();
                        }
                    })
                }).catch(() => {});
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
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delAllSelection() { //批量删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    let ids = [];
                    this.multipleSelection.map(item => {
                        ids.push(item.code);
                    })
                    if(ids.length === 0){
                        this.$message.error("请选择要删除数据！");
                        return ;
                    }
                    this.$axios.post("/commodity/deleteBatch",ids).then(res => {
                        if (res.code == 200) {
                            this.$message.success("批量删除成功！");
                            this.getData();
                            this.multipleSelection = [];
                        }
                    })
                }).catch(() => {});
            },
            handleChange(file, fileList) { // 轮播图上传
                this.fileList = fileList.slice(-10);

            },
            handleEditorFileChange(response, file, fileList){ // 商品详情 图片上传
                // this.editorFileList = fileList.slice(-3);
                let quill = this.$refs.myTextEditor.quill
                // 获取光标所在位置
                let length = quill.getSelection().index;
                // 插入图片，res为服务器返回的图片链接地址
                console.log(response)
                quill.insertEmbed(length, 'image', response.data.url);
                // this.editorFileList.map(item => {
                //     quill.insertEmbed(length, 'image', item.response.data.url);
                // })
                // 调整光标到最后
                quill.setSelection(length + 1);
            },
            handleRemove(file, fileList) {// 轮播图删除
                this.fileList = fileList.slice(-3);
                console.log(file, fileList);
                let url;
                if(file.id){
                    url = file.url;
                }else{
                    url = file.response.data.url;
                }
                this.$axios.post("/api/attachments/deleteFile",{url:url,dataType:"form"}).then(res => {
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
            editAttrImage(index){
                this.commodityAttrsItemIndex = index;
                console.log(this.commodityAttrsItemIndex)
            },
            addAttrImage(){
                this.commodityAttrsItemIndex = "";
            },
            setAttrImage(e){ // 选择商品属性图
                this.attrfile = e.target.files[0];
                if (!this.attrfile.type.includes('image/')) {
                    this.$message.error("请上传png/jpg格式文件！");
                    return;
                }
                let params = {
                    file:this.attrfile,
                    type:1,
                    isInsert:false,
                    dataType:"multipart"
                }
                this.croploading = true;
                this.$axios.post("/api/attachments/insertUploadFile",params).then(res => {
                    if(res.code == 200){
                        this.$message.success("上传成功！");
                        if(this.commodityAttrsItemIndex || this.commodityAttrsItemIndex === 0){
                            if(this.commodityAttrs[this.commodityAttrsIndex].commodityAttrItems[this.commodityAttrsItemIndex].imageUrl){
                                this.commodityAttrs[this.commodityAttrsIndex].commodityAttrItems[this.commodityAttrsItemIndex].imageUrl = res.data.url;
                            }else{
                                this.$set(this.commodityAttrs[this.commodityAttrsIndex].commodityAttrItems[this.commodityAttrsItemIndex], 'imageUrl', res.data.url);
                            }
                        }else{
                            this.$set(this.inputValue, 'imageUrl', res.data.url);
                        }

                    }else{
                        this.$message.error(res.msg);
                    }
                    this.croploading = false;
                })
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
            handlePrinter(){
                // this.$delete(this.query,"pageNum");
                // this.$delete(this.query,"pageSize");
                // this.$delete(this.query,"categoryCode");
                let ret = ''
                for (let it in this.query) {
                    if(encodeURIComponent(this.query[it]) && it != "pageNum" && it != "pageSize" && it != "categoryCode"){
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(this.query[it]) + '&'
                    }
                }
                window.open(this.baseUrl+'/commodity/exportCommodity?'+ret,'_blank');

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
                this.form = {
                    categoryCode:[]
                };
                this.commodityAttrsItem = {};
                this.commodityAttrs = [];
                this.dynamicTags = [];
                this.inputValue = {};
                this.commodityDetails = {};
                this.isAttrsEdit = false;
                this.commodityAttrsItemIndex = '';
                this.commodityAttrsIndex = '';
                this.$refs.banner.clearFiles();
                this.$refs[form].resetFields();
            },
            refresh(){ // 刷新
                this.getData();
            }
        },
        watch:{
            dialogVisible(newsval,oldval){
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
      .attrClose.attredit{
        top:-25px;
        right: 15px;
      }
    }



  .inputTag{
    vertical-align: middle;
    img{
      width: 20px;
      height: 20px;
      border-radius: 2px;
      vertical-align: -5px;
    }
  }
  .inputAttrsGroup{
    display: flex;
    margin: 8px 0;

    .input-new-tag{
      width:100px;
      &:nth-child(1){
        width:160px;
      }
    }
  }
  .headAttrsUrl{
    position: relative;
    border-radius: 4px;
    border:1px solid #ededed;
    height: 30px;
    width: auto;
    min-width: 30px;
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    .pre-img{
      width: 30px;
      height: 30px;
    }
    .crop-input{
      width: 80px;
      height: 30px;
    }
    .crop-demo{
       width: 30px;
       height: 30px;
     }
    i{
      font-size: 20px;
      color: #ddd;
    }

  }
</style>
