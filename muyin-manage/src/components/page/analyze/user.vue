<template>
  <div class="p-20 bg-fff" >
    <el-collapse v-model="activeName" class="statistics" @change="handleCollapse">
      <el-collapse-item  name="1" disabled>
        <template slot="title">
          <el-link type="primary">昨日</el-link>
          <el-date-picker
                  v-model="queryTime"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions">
          </el-date-picker>
        </template>
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-1">
                <i class="el-icon-lx-goods grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{info.orderCount}}</div>
                  <div>订单量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-2">
                <i class="el-icon-lx-recharge grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{info.paidAmount + info.walletCost}}</div>
                  <div>订单总金额</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-3">
                <i class="el-icon-lx-redpacket grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{info.supplyPrice}}</div>
                  <div>成本</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-collapse-item>
<!--      <el-collapse-item title="7日核心指标" name="3">-->
<!--        <template slot="title">-->
<!--          7日核心指标<i class="header-icon el-icon-info"></i>-->
<!--        </template>-->
<!--        <el-card shadow="hover">-->
<!--          <el-table :data="todoList"  style="width: 100%;font-size:14px;">-->
<!--            <el-table-column label="时间" prop="date">-->
<!--            </el-table-column>-->
<!--            <el-table-column label="新注册数" prop="newCount">-->
<!--            </el-table-column>-->
<!--            <el-table-column label="日访问" prop="dayVisit">-->
<!--            </el-table-column>-->
<!--            <el-table-column label="累计注册" prop="count">-->
<!--            </el-table-column>-->
<!--          </el-table>-->
<!--          <schart ref="bar" class="schart" canvasId="bar" :data="data" type="bar" :options="options"></schart>-->
<!--        </el-card>-->
<!--      </el-collapse-item>-->
<!--      <el-collapse-item title="30日核心指标" name="4">-->
<!--        <el-card shadow="hover">-->
<!--          <el-table :data="todoList"  style="width: 100%;font-size:14px;">-->
<!--            <el-table-column label="时间" prop="date">-->
<!--            </el-table-column>-->
<!--            <el-table-column label="新注册数" prop="newCount">-->
<!--            </el-table-column>-->
<!--            <el-table-column label="日访问" prop="dayVisit">-->
<!--            </el-table-column>-->
<!--            <el-table-column label="累计注册" prop="count">-->
<!--            </el-table-column>-->
<!--          </el-table>-->
<!--          <schart ref="line2" class="schart" canvasId="line2" :data="data" type="line" :options="options2"></schart>-->
<!--        </el-card>-->
<!--      </el-collapse-item>-->
    </el-collapse>

  </div>
</template>

<script>
    import Schart from 'vue-schart';
    import bus from '../../common/bus';
    export default {
        name: 'user',
        data() {
            return {
                name: localStorage.getItem('ms_username'),
                activeName:['1','2','3','4'],
                todoList: [
                    {
                    date:'2019-10-18',
                    newCount:3,
                    dayVisit:99,
                    count:125,
                    status: false,
                    },
                    {
                        date:'2019-10-18',
                        newCount:3,
                        dayVisit:99,
                        count:125,
                        status: false,
                    },
                    {
                        date:'2019-10-18',
                        newCount:3,
                        dayVisit:99,
                        count:125,
                        status: false,
                    }, {
                        date:'2019-10-18',
                        newCount:3,
                        dayVisit:99,
                        count:125,
                        status: false,
                    },
                    {
                        date:'2019-10-18',
                        newCount:3,
                        dayVisit:99,
                        count:125,
                        status: false,
                    },
                    {
                        date:'2019-10-18',
                        newCount:3,
                        dayVisit:99,
                        count:125,
                        status: false,
                    }
                ],
                data: [
                    {
                    name: '2018/09/04',
                    value: 1083
                },
                    {
                        name: '2018/09/05',
                        value: 941
                    },
                    {
                        name: '2018/09/06',
                        value: 1139
                    },
                    {
                        name: '2018/09/07',
                        value: 816
                    },
                    {
                        name: '2018/09/08',
                        value: 327
                    },
                    {
                        name: '2018/09/09',
                        value: 228
                    },
                    {
                        name: '2018/09/10',
                        value: 1065
                    }
                ],
                options: {
                    title: '',
                    showValue: false,
                    fillColor: '#faa54b',
                    bottomPadding: 30,
                    topPadding: 30
                },
                options2: {
                    title: '',
                    fillColor: '#faa54b',
                    axisColor: '#74cae2',
                    contentColor: '#EEEEEE',
                    bgColor: '#fff',
                    bottomPadding: 30,
                    topPadding: 30
                },
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                queryTime:[],
                info:{},
                query:{}
            }
        },
        components: {
            Schart
        },
        computed: {
            role() {
                return this.name === 'admin' ? '超级管理员' : '普通用户';
            }
        },
        created(){
            this.getData();
            this.handleListener();
            this.changeDate();
        },
        activated(){
            this.handleListener();
        },
        deactivated(){
            window.removeEventListener('resize', this.renderChart);
            bus.$off('collapse', this.handleBus);
        },
        methods: {
            // 获取数据
            getData() {
                this.$set(this.query,"queryStartTime",this.queryTime[0]);
                this.$set(this.query,"queryEndTime",this.queryTime[1]);
                this.$axios.post("/statistical-order/selectStatisticalOrder",this.query).then(res => {
                    if(res.code == 200) {
                        this.info = res.data;
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            changeDate(){
                const now = new Date().getTime();
                this.data.forEach((item, index) => {
                    const date = new Date(now - (6 - index) * 86400000);
                    item.name = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`
                })
            },
            handleListener(){
                bus.$on('collapse', this.handleBus);
                // 调用renderChart方法对图表进行重新渲染
                window.addEventListener('resize', this.renderChart)
            },
            handleCollapse(val){
                setTimeout(() => {
                    this.renderChart()
                }, 300);
            },
            handleBus(msg){
                setTimeout(() => {
                    this.renderChart()
                }, 300);
            },
            renderChart(){
                this.$refs.bar.renderChart();
                this.$refs.line.renderChart();
                this.$refs.line2.renderChart();
            }
        },
    }

</script>


<style lang="scss">
  .el-row {
    margin-bottom: 20px;
  }

  .grid-content {
    display: flex;
    align-items: center;
    height: 100px;
  }

  .grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
  }

  .grid-num {
    font-size: 30px;
    font-weight: bold;
  }

  .grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
  }

  .grid-con-1 .grid-con-icon {
    background: rgba(170, 220, 221, .1);
    color: #aadcdd;
  }

  .grid-con-1 .grid-num {
    color: #aadcdd;
  }

  .grid-con-2 .grid-con-icon {
    background: rgba(182, 221, 170, .1);
    color: #b6ddaa;
  }

  .grid-con-2 .grid-num {
    color: #b6ddaa;
  }

  .grid-con-3 .grid-con-icon {
    background:rgba(240, 154, 189, .1);
    color: #f09abd;
  }

  .grid-con-3 .grid-num {
    color: #f09abd;
  }


  .user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
  }

  .user-avator {
    width: 120px;
    /*height: 120px;*/
    border-radius: 50%;
  }

  .user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
  }

  .user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
  }

  .user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
  }

  .user-info-list span {
    margin-left: 70px;
  }

  .mgb20 {
    margin-bottom: 20px;
  }

  .todo-item {
    font-size: 14px;
  }

  .todo-item-del {
    text-decoration: line-through;
    color: #999;
  }

  .schart {
    width: 100%;
    height: 300px;
  }
  .el-collapse.statistics{
    border-bottom: none;
  }
  .el-collapse.statistics .el-collapse-item__header{
    background: $color-border;
    margin-bottom: 20px;
    padding-left: 20px;
    padding-right: 20px;
  }
  .el-collapse.statistics  .el-table__body{
    width: 100% !important;
  }

</style>
