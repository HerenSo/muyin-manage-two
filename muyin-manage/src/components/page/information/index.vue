<template>
    <div class="container">
        <el-form ref="form" :model="form" label-width="140px">
            <el-form-item label="名称"  >
                <el-input v-model="form.name" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="合作期限"  >
                <el-input v-model="form.cooperationTime" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="联系电话"  >
                <el-input v-model="form.phone" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="固定电话"  >
                <el-input v-model="form.telephone" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="详细地址"  >
                <el-input v-model="form.address" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label=""  >
              <el-button type="primary" @click="saveEdit" :loading="subloading">{{ subloading ? '提交中 ...' : '保  存' }}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: 'index',
        data(){
            return{
                form:{},
                subloading:false,
            }
        },
        mounted(){
            this.getData();
        },
        methods:{
            getData(){
                this.$axios.post("/customer/selectCurrentCustomer").then(res => {
                    if(res.code == 200) {
                        this.form = res.data;
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            saveEdit(){
                if(!this.form.name){
                    this.$message.error("请输入名称！");
                    return;
                }
                let authorities = JSON.parse(localStorage.getItem("user_information"));
                let customerCode=authorities.customerCode;
                this.$set(this.form, 'customerCode', customerCode);
                this.subloading = true;
                this.$axios.post("/customer/insertOrUpdate",this.form).then(res => {
                    if(res.code == 200){
                        this.$message.success("修改成功！");
                        this.getData();
                    }
                    this.subloading = false;
                })
            }
        }
    };
</script>

<style scoped>

</style>