<template>
  <div></div>
</template>

<script>
    export default {
        name: 'index',
        data(){
            return{
                query:{}
            }
        },
        mounted(){
            this.getData();
        },
        methods:{
            // 获取数据
            getData() {
                // this.$set(this.query,"queryStartTime",this.queryTime[0]);
                // this.$set(this.query,"queryEndTime",this.queryTime[1]);
                this.$axios.post("/statistical-order/selectStatisticalOrder",this.query).then(res => {
                    if(res.code == 200) {
                        if(res.data){
                            // this.info = res.data;
                        }else{
                            // this.info = {};
                            // this.$message.error(res.msg);
                        }

                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
        }
    };
</script>

<style scoped>

</style>