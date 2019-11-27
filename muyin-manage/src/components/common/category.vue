<template>
  <div class="">
    <div class="mt-20">
      <el-popover placement="top" class="mr10 mb-5" trigger="hover" :open-delay="500"  v-for="(tag,index) in dynamicTags" :key="tag.code" :disabled="index==0">
        <div style="text-align: right; margin: 0" >
          <el-button size="mini" type="primary"  @click="handleCategoryAdd(tag)">编辑</el-button>
          <el-button type="info" size="mini" @click="handleCategoryDel(tag.code)" v-if="apiType != 1">删除</el-button>
        </div>
        <el-button slot="reference" @click="handleCategory(index)" :class="tag.light == 1?'current mb-5':'mb-5'">{{tag.name}}</el-button>

      </el-popover>
      <el-button  size="small" @click="handleCategoryAdd" v-if="apiType != 1">+ 添加分类</el-button>
    </div>
    <div class="pt-10 mt-10 border-top">
      <el-popover placement="left" class="mr10" trigger="hover" :open-delay="500"  v-for="(tag,index) in subCategorys" :key="tag.code" >
        <div style="text-align: right; margin: 0" >
          <el-button size="mini" type="primary"  @click="handleCategoryAdd(tag)">编辑</el-button>
          <el-button type="info" size="mini" @click="handleCategoryDel(tag.code)" v-if="apiType != 1">删除</el-button>
        </div>
        <el-button slot="reference" @click="handlesubCategorys(index)" :class="tag.light == 1?'subcurrent mb-5':'mb-5'" size="mini">{{tag.name}}</el-button>

      </el-popover>
      <el-button  size="mini" @click="handlesubCategorysAdd" v-if="subCategorys && apiType != 1">+ 添加子分类</el-button>
    </div>

    <!-- 分类编辑弹出框 -->
    <el-dialog :title="titleCategory" :visible.sync="editVisibleCategory" width="30%" :before-close="closeHandle">
      <el-form ref="form" :model="formCategory" label-width="140px">
        <el-form-item label="名称">
          <el-input v-model="formCategory.name"></el-input>
        </el-form-item>
          <el-form-item label="赠送优惠券" v-if="apiType == 1">
              <el-select v-model="formCategory.couponCode" placeholder="选择">
                  <el-option :key="index" :label="item.couponName" :value="item.code" v-for="(item,index) in couponList"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="等级级别" v-if="apiType == 1">
              <el-input v-model="formCategory.level"></el-input>
          </el-form-item>
          <el-form-item label="消费折扣" v-if="apiType == 1">
              <el-input v-model="formCategory.discount"></el-input>
          </el-form-item>
          <el-form-item label="等级积分比率" v-if="apiType == 1">
              <el-input v-model="formCategory.pointRate"></el-input>
          </el-form-item>
          <el-form-item label="0元购次数" v-if="apiType == 1">
              <el-input v-model="formCategory.zeroFormulaCount"><template slot="append">次</template></el-input>
          </el-form-item>
          <el-form-item label="直推佣金比率" v-if="apiType == 1">
              <el-input v-model="formCategory.directBrokerage"></el-input>
          </el-form-item>
          <el-form-item label="间推佣金比率" v-if="apiType == 1">
              <el-input v-model="formCategory.indirectBrokerage"></el-input>
          </el-form-item>
          <el-form-item label="备注" v-if="apiType == 1">
              <el-input type="textarea" v-model="formCategory.remark"></el-input>
          </el-form-item>
          <el-form-item label="缩略图" v-if="typeValue == 0 && apiType == 0">
              <div class="headIconUrl">
                  <i class="el-icon-plus"></i>
                  <div class="crop-demo">
                      <img :src="formCategory.iconUrl" class="pre-img">
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
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="editVisibleCategory = false">取 消</el-button>
                <el-button type="primary" @click="categoryEdit">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
    import VueCropper  from 'vue-cropperjs';
    import bus from './bus';
    export default {
        name: 'category',
        components: {
            VueCropper
        },
        data(){
            return{
                dynamicTags: [],
                titleCategory:'编辑',
                editVisibleCategory:false,
                categoryId:'',
                parentcategoryCode:'', // 父级分类ID
                subCategorys:[], //子分类
                formCategory:{
                    level:0
                },
                type:'',
                apiUrl:'/category/queryCategoryTree',
                apiAddUrl:'/category/insertOrUpdate',
                apiDelUrl:'/category/delete',
                imgSrc: '',
                cropImg: '',
                dialogVisible: false,
                file:'',
                couponList:[], // 优惠券
            }
        },
        props:["typeValue","apiType"],
        watch:{
            typeValue(){
                console.log(this.typeValue);
                this.type = this.typeValue;
            },
            apiType(){
                console.log(this.apiType);
                if(this.apiType == 1){ // 用户，经销商
                    this.apiUrl = "/level/selectList";
                    this.apiAddUrl = "/level/insertOrUpdate";
                    this.apiDelUrl = "/level/insertOrUpdate";
                }else{ // 文章，商品
                    this.apiUrl = "/category/queryCategoryTree";
                    this.apiAddUrl = "/category/insertOrUpdate";
                    this.apiDelUrl = "/category/delete";
                }
                this.getCategory(); // 获取分类
            },
            dialogVisible(newsval,oldval){
                if(!newsval){
                    this.$refs.file.value = '';
                }
            }
        },
        created() {
            this.getCoupon();
        },
        methods:{
            getCategory(){// 获取分类
                let params = {
                    type:this.type,
                    status:0
                }
                this.$axios.post(this.apiUrl,params).then(res => {
                    if(res.code == 200){
                        let dynamicTags = res.data;
                        dynamicTags.unshift({name:'全部',code:null});
                        if(dynamicTags.length>0){
                            if(!this.dynamicTags.find(item => item.light==1)){
                                dynamicTags.map(item => {
                                    item.light = 0;
                                })
                                dynamicTags[0].light = 1;
                                bus.$emit('categoryCode', dynamicTags[0].code);
                                this.subCategorys = dynamicTags[0].subCategorys;
                            }else{
                                this.dynamicTags.map(i => {
                                    if(i.light == 1){
                                        dynamicTags.map(item => {
                                            if(item.code == i.code){
                                                item.light = 1;
                                                bus.$emit('categoryCode', item.code);
                                                this.subCategorys = item.subCategorys;
                                            }
                                            return item;
                                        })
                                    }
                                })
                            }
                        }
                        this.dynamicTags = dynamicTags;
                    }else{
                        this.$massage.error(res.msg);
                    }
                })
            },
            getCoupon(){
                this.$axios.post("/coupon/selectList",{}).then(res => {
                    if(res.code == 200){
                        this.couponList = res.data;
                    }else{
                        this.$massage.error(res.msg);
                    }
                })
            },
            categoryEdit(){ // 编辑 新增 分类
                if(!this.formCategory.name){
                    this.$message.error("请输入名称！");
                    return;
                }
                this.$set(this.formCategory,"type",this.type);
                this.$set(this.formCategory,"parentCode",this.parentcategoryCode);
                this.$axios.post(this.apiAddUrl,this.formCategory).then(res => {
                    if(res.code == 200){
                        console.log(res)
                        this.getCategory();
                        this.editVisibleCategory = false;
                    }else{
                        this.$massage.error(res.msg);
                    }
                })
            },
            handleCategory(index){ // 点击分类事件
                this.dynamicTags.map(item => {
                    item.light = 0;
                })
                this.dynamicTags[index].light = 1;
                this.$forceUpdate();
                // this.query.categoryCode = this.dynamicTags[index].code;
                bus.$emit('categoryCode', this.dynamicTags[index].code);
                this.parentcategoryCode = this.dynamicTags[index].code;
                this.subCategorys = this.dynamicTags[index].subCategorys;
                // this.getData();
            },
            handlesubCategorys(index){ //点击子分类
                this.subCategorys.map(item => {
                    item.light = 0;
                })
                this.subCategorys[index].light = 1;
                this.$forceUpdate();
                // this.query.categoryCode = this.subCategorys[index].code;
                bus.$emit('categoryCode', this.subCategorys[index].code);
                // this.getData();
            },
            handleCategoryDel(code) { // 删除分类
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete(this.apiDelUrl+"?code=" + code).then(res => {
                        if (res.code == 200) {
                            this.$message.success("删除成功！");
                            this.getCategory();
                        }
                    })
                }).catch(() => {});
            },
            handleCategoryAdd(tag) {
                if(tag.code){
                    this.titleCategory = (this.apiType == 1)?"编辑等级":"编辑分类";
                    // this.formCategory={
                    //     code : tag.code,
                    //     name : tag.name,
                    //     iconUrl: tag.iconUrl
                    // };
                    this.formCategory=tag;
                }else{
                    this.titleCategory = (this.apiType == 1)?"新增等级":"新增分类";
                }
                this.editVisibleCategory = true;
            },
            handlesubCategorysAdd(tag){
                if(tag.code){
                    this.titleCategory = (this.apiType == 1)?"编辑等级":"编辑分类";
                    // this.formCategory={
                    //     code : tag.code,
                    //     name : tag.name,
                    //     parentCode:tag.parentCode
                    // };
                    this.formCategory=tag;
                }else{
                    this.titleCategory = (this.apiType == 1)?"新增等级":"新增分类";
                }
                this.editVisibleCategory = true;
            },
            sureCrop(){
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
                        this.$set(this.formCategory, 'iconUrl', res.data.url);
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
            closeHandle(){
                this.editVisibleCategory = false;
                this.formCategory={
                    level:0
                }
            },
        },
    };
</script>

<style lang="scss">
  .el-popover{
    min-width: auto;
  }
  .current{
    background: $color-theme;
    color: #fff;
    cursor: pointer;
  }
  .subcurrent{
    background: $color-one;
    color: $color-theme;
    cursor: pointer;
  }
  .cursor{
    cursor: pointer;
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
</style>