<template>
  <div class="container">
    <!--
    // 配送费用配置
    String POSTAGE_AMOUNT = "POSTAGE_AMOUNT";
    // 铜牌会员2升级需要消耗费用
    String MEMBER_LEVELUP2_AMOUNT = "MEMBER_LEVELUP2_AMOUNT";
    // 银牌会员升级需要邀请会员数
    String MEMBER_LEVELUP3_AMOUNT = "MEMBER_LEVELUP3_AMOUNT";
    // 金牌会员升级需要邀请会员数
    String MEMBER_LEVELUP4_AMOUNT = "MEMBER_LEVELUP4_AMOUNT";
    // 积分折算1元实际金额比率值(默认1元:100积分)
    String POINT_CONVERT_PER_AMOUNT_RAT = "POINT_CONVERT_PER_AMOUNT_RAT";
    // 会员消费金钱1元折算积分奖励比率
    String MEMBER_POINT_CONVERSION_RAT = "MEMBER_POINT_CONVERSION_RAT";
    // 寄卖商品抽成比例
    String CONSIGN_FOR_SALE_COMMISSION_RAT = "CONSIGN_FOR_SALE_COMMISSION_RAT";
    // 微信发起企业对个人银行卡支付手续费费
    String WX_PAY_BANK_SERVICE_CHARGE_RAT = "WX_PAY_BANK_SERVICE_CHARGE_RAT";
    // 微信发起企业对个人银行卡支付手续费最大额度(元)
    String WX_PAY_BANK_SERVICE_CHARGE_MAX = "WX_PAY_BANK_SERVICE_CHARGE_MAX";
    // 抢购开始时间（时分）
    String COMMODITY_TO_SNAP_UP_START_TIME = "COMMODITY_TO_SNAP_UP_START_TIME";
    // 抢购结束时间（时分）
    String COMMODITY_TO_SNAP_UP_END_TIME = "COMMODITY_TO_SNAP_UP_END_TIME";
    // 抢购时间间隔（每隔多少分钟）
    String COMMODITY_TO_SNAP_UP_INTERVAL = "COMMODITY_TO_SNAP_UP_INTERVAL";
    -->
        <el-form ref="form" :model="form" label-width="380px">
          <el-form-item label="配送费用配置"  >
            <el-input v-model="form.postage_amount" placeholder="" class="width260"></el-input>
          </el-form-item>
          <el-form-item label="铜牌会员升级需要消耗费用"  >
            <el-input v-model="form.member_levelup2_amount" placeholder="" class="width260"></el-input>
          </el-form-item>
          <el-form-item label="银牌会员升级需要邀请会员数"  >
            <el-input v-model="form.member_levelup3_amount" placeholder="" class="width260"></el-input>
          </el-form-item>
          <el-form-item label="金牌会员升级需要邀请会员数"  >
            <el-input v-model="form.member_levelup4_amount" placeholder="" class="width260"></el-input>
          </el-form-item>
<!--          <el-form-item label="积分折算1元实际金额比率值"  >-->
<!--            <el-input v-model="form.point_convert_per_amount_rat" placeholder="" class="width260"></el-input><span class="color-999">&nbsp;&nbsp;(默认1元:100积分)</span>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="会员消费金钱1元折算积分奖励比率"  >-->
<!--            <el-input v-model="form.member_point_conversion_rat" placeholder="" class="width260"></el-input>-->
<!--          </el-form-item>-->
          <el-form-item label="寄卖商品抽成比例"  >
            <el-input v-model="form.consign_for_sale_commission_rat" placeholder="" class="width260"></el-input>
          </el-form-item>
          <el-form-item label="微信发起企业对个人银行卡支付手续费"  >
            <el-input v-model="form.wx_pay_bank_service_charge_rat" placeholder="" class="width260"></el-input>
          </el-form-item>
          <el-form-item label="微信发起企业对个人银行卡支付手续费最大额度"  >
            <el-input v-model="form.wx_pay_bank_service_charge_max" placeholder="" class="width260"></el-input>
          </el-form-item>
          <el-form-item label="抢购开始时间"  >
<!--            <el-input v-model="form.commodity_to_snap_up_start_time" placeholder=""></el-input>-->
            <el-time-select placeholder="起始时间" v-model="form.commodity_to_snap_up_start_time" :picker-options="{start: '00:00',step: '00:15',end: '24:00'}"></el-time-select>
          </el-form-item>
          <el-form-item label="抢购结束时间"  >
<!--            <el-input v-model="form.commodity_to_snap_up_end_time" placeholder=""></el-input>-->
            <el-time-select placeholder="结束时间" v-model="form.commodity_to_snap_up_end_time" :picker-options="{ start: '00:00', step: '00:15', end: '24:00', minTime: form.commodity_to_snap_up_start_time }">
            </el-time-select>
          </el-form-item>
          <el-form-item label="抢购时间间隔(分钟)"  >
            <el-input v-model="form.commodity_to_snap_up_interval" placeholder="" class="width260"></el-input>
          </el-form-item>
          <el-form-item label="推广背景图" >
            <div class="backgroundImgUrl" v-loading="croploading"><i class="el-icon-picture"></i>
              <div class="crop-demo">
                <img :src="form.wechat_promote_background_url" class="pre-img">
              </div>
              <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
            </div>
            <span class="color-999">&nbsp;&nbsp;(建议尺寸:750*1132)</span>
          </el-form-item>

            <el-form-item label="用户权益" >
                <div class="backgroundImgUrl" v-loading="cropUserloading"><i class="el-icon-picture"></i>
                    <div class="crop-demo">
                        <img :src="form.the_user_member_rights_url" class="pre-img">
                    </div>
                    <input class="crop-input" type="file" name="image" accept="image/*" @change="setUserImage"/>
                </div>
                <span class="color-999">&nbsp;&nbsp;(建议尺寸:750*1132)</span>
            </el-form-item>

            <el-form-item label="用户协议">
                <quill-editor ref="myTextEditor" v-model="form.user_member_agreement" :options="editorOption"></quill-editor>
            </el-form-item>

          <el-form-item label=""  >
            <div class="handle-row">
              <el-button type="primary" @click="submit">保存</el-button>
<!--              <el-button @click="back" class="mgb20">取消</el-button>-->
            </div>
          </el-form-item>
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
  </div>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';
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
            quillEditor
        },
        data(){
            return{
                form:{},
                defaultSrc: require('../../../assets/img/img.jpg'),
                imgSrc: '',
                cropImg: '',
                dialogVisible: false,
                file:'',
                croploading:false,
                cropUserloading:false,
                editorFileList:[],
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
                }
            }
        },
        mounted(){
            this.getData();
        },
        methods:{
            getData(){
                this.$axios.post("/system-settings/selectList",{}).then(res => {
                    if(res.code == 200) {
                        var data = {};
                        res.data.map((item) => {
                            data[item.name.toLowerCase()] = item.value;
                            return item;
                        })
                        this.form = data;
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            submit(){
                var data = [];
                var item = {};
                //toUpperCase()
                for(var i in this.form){
                    item = {};
                    item.name = i.toUpperCase();
                    item.value = this.form[i];
                    data.push(item);
                }
                // console.log(data)
                // this.$axios({
                //     url: '/system-settings/insertOrUpdate',
                //     method: 'post',
                //     data: JSON.stringify(data),
                //     headers: { 'Content-Type': 'application/json;charset=UTF-8' },
                // })
                this.$axios.post("/system-settings/insertOrUpdate",data).then((res) => {
                    if(res.code == 200){
                        this.$message.success('保存成功！');
                        this.getData();
                    }else{
                        this.$message.error(res.msg);
                    }
                })
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
            sureCrop(){
                let params = {
                    file:this.file,
                    type:1,
                    isInsert:false,
                    dataType:"multipart"
                }
                this.croploading = true;
                this.$axios.post("/api/attachments/insertUploadFile",params).then(res => {
                    if(res.code == 200){
                        this.$message.success("上传成功！");
                        this.$set(this.form, 'wechat_promote_background_url', res.data.url);
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
            setUserImage(e){ // 选择图
                this.file = e.target.files[0];
                if (!this.file.type.includes('image/')) {
                    this.$message.error("请上传png/jpg格式文件！");
                    return;
                }
                this.sureCropUser();
            },
            sureCropUser(){
                let params = {
                    file:this.file,
                    type:1,
                    isInsert:false,
                    dataType:"multipart"
                }
                this.cropUserloading = true;
                this.$axios.post("/api/attachments/insertUploadFile",params).then(res => {
                    if(res.code == 200){
                        this.$message.success("上传成功！");
                        // this.$set(this.form, 'THE_USER_MEMBER_RIGHTS_URL', res.data.url);
                        this.$set(this.form,"the_user_member_rights_url",res.data.url)
                        this.dialogVisible = false;
                    }else{
                        this.$message.error(res.msg);
                    }
                    this.cropUserloading = false;
                })
            },
        }
    };
</script>

<style lang="scss" scoped>
  .backgroundImgUrl{
    border-radius: 4px;
    border:1px solid #ededed;
    width: 188px;
    height: 284px;
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
    width: 188px;
    height: 284px;
    /*height: 138px;*/
    /*background: #f8f8f8;*/
    /*border: 1px solid #eee;*/
    border-radius: 5px;
    border:none;
  }
  .crop-demo{
    position: absolute;
    width: 188px;
    height: auto;
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
    width: 188px;
    height: 284px;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
  }
  .el-color-picker__color{border:none;}
</style>