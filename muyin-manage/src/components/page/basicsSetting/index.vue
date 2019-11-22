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
          <el-form-item label="积分折算1元实际金额比率值"  >
            <el-input v-model="form.point_convert_per_amount_rat" placeholder="" class="width260"></el-input><span class="color-999">&nbsp;&nbsp;(默认1元:100积分)</span>
          </el-form-item>
          <el-form-item label="会员消费金钱1元折算积分奖励比率"  >
            <el-input v-model="form.member_point_conversion_rat" placeholder="" class="width260"></el-input>
          </el-form-item>
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
            <el-time-select placeholder="起始时间" v-model="form.commodity_to_snap_up_start_time" :picker-options="{start: '08:30',step: '00:15',end: '18:30'}"></el-time-select>
          </el-form-item>
          <el-form-item label="抢购结束时间"  >
<!--            <el-input v-model="form.commodity_to_snap_up_end_time" placeholder=""></el-input>-->
            <el-time-select placeholder="结束时间" v-model="form.commodity_to_snap_up_end_time" :picker-options="{ start: '08:30', step: '00:15', end: '18:30', minTime: form.commodity_to_snap_up_start_time }">
            </el-time-select>
          </el-form-item>
          <el-form-item label="抢购时间间隔(分钟)"  >
            <el-input v-model="form.commodity_to_snap_up_interval" placeholder="" class="width260"></el-input>
          </el-form-item>
          <el-form-item label=""  >
            <div class="handle-row">
              <el-button type="primary" @click="submit">保存</el-button>
              <el-button @click="back" class="mgb20">取消</el-button>
            </div>
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
                this.$axios.post("/system-settings/selectList",{}).then(res => {
                    if(res.code == 200) {
                        var data = {};
                        res.data.map((item) => {
                            data[item.name.toLowerCase()] = item.value;
                            return item;
                        })
                        this.form = data;
                    }else{
                        this.$massage.error(res.msg);
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
        }
    };
</script>

<style scoped>

</style>