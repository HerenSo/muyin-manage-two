<template>
    <div class="container">
        <el-form ref="form" :model="form" label-width="140px">
            <el-form-item label="平台名称"  >
                <el-input v-model="form.name" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="合作期限"  >
                <el-input v-model="form.cooperationTime" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="联系人"  >
                <el-input v-model="form.name" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="联系电话"  >
                <el-input v-model="form.phone" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="单笔分成"  >
                <el-input v-model="form.name" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="固定电话"  >
                <el-input v-model="form.telephone" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="所属区域"  >
                <el-input v-model="form.name" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="详细地址"  >
                <el-input v-model="form.address" placeholder=""></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: 'index',
        data(){
            return{
                form:{}
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
                        this.$massage.error(res.msg);
                    }
                })
            }
        }
    };
</script>

<style scoped>

</style>