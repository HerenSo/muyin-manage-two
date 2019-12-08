<template>
  <div class="">
    <div class="container">
      <el-tabs v-model="message">
        <el-tab-pane :label="`未读消息(${count})`" name="first">
          <el-table :data="tableData" :show-header="false" style="width: 100%"@cell-click="messageClick" >
            <el-table-column >
              <template slot-scope="scope">
                <span class="message-title">{{scope.row.title}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" width="180" ></el-table-column>
            <el-table-column width="120">
              <template slot-scope="scope">
                <el-button size="small" @click="handleRead(scope.row)">标为已读</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination" v-if="total>0">
            <el-pagination
                    background
                    layout="total, prev, pager, next, jumper"
                    :current-page="query.pageNum"
                    :page-count="total"
                    @current-change="handlePageChange"
            ></el-pagination>
          </div>
          <!--                    <div class="handle-row">-->
          <!--                        <el-button type="primary">全部标为已读</el-button>-->
          <!--                    </div>-->
        </el-tab-pane>
        <el-tab-pane :label="`已读消息(${count2})`" name="second">
          <template v-if="message === 'second'">
            <el-table :data="tableData2" :show-header="false" style="width: 100%" @cell-click="messageClick">
              <el-table-column >
                <template slot-scope="scope">
                  <span class="message-title">{{scope.row.title}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" width="150" ></el-table-column>
              <el-table-column width="120">
                <template slot-scope="scope">
                  <el-button type="danger" @click="handleDel(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination" v-if="total2>0">
              <el-pagination
                      background
                      layout="total, prev, pager, next, jumper"
                      :current-page="queryRead.pageNum"
                      :page-count="total2"
                      @current-change="handlePageChange2"
              ></el-pagination>
            </div>
            <!--                        <div class="handle-row">-->
            <!--                            <el-button type="danger">删除全部</el-button>-->
            <!--                        </div>-->
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
    export default {
        name: 'tabs',
        data() {
            return {
                message: 'first',
                showHeader: false,
                unread: [{
                    date: '2018-04-19 20:00:00',
                    title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护',
                },{
                    date: '2018-04-19 21:00:00',
                    title: '今晚12点整发大红包，先到先得',
                }],
                read: [{
                    date: '2018-04-19 20:00:00',
                    title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护'
                }],
                recycle: [{
                    date: '2018-04-19 20:00:00',
                    title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护'
                }],
                query:{
                    pageNum:1,
                    pageSize:10
                },
                queryRead:{
                    pageNum:1,
                    pageSize:10
                },
                tableData:[],
                tableData2:[],
                total:"",
                total2:'',
                count2:'',
                count:"",
            }
        },
        mounted(){
            this.getData();
            this.getData2();
        },
        methods: {
            // 获取数据
            getData() {
                this.$axios.post("/system-message/selectPageList?pageNum="+this.query.pageNum+"&pageSize="+this.query.pageSize,{status:0}).then(res => {
                    if(res.code == 200) {
                        this.tableData = res.data.records;
                        this.total = res.data.pages;
                        this.count = res.data.total;
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            getData2() {
                this.$axios.post("/system-message/selectPageList?pageNum="+this.queryRead.pageNum+"&pageSize="+this.queryRead.pageSize,{status:1}).then(res => {
                    if(res.code == 200) {
                        this.tableData2 = res.data.records;
                        this.total2 = res.data.pages;
                        this.count2 = res.data.total;
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            messageClick(row,column, cell, even){
                console.log(column)
                if(row.status == 0){
                    this.handleRead(row);
                }
                if(column.id != "el-table_6_column_18"){
                    let content = "<div class='pl-20 pr-20'>"+row.content+"</div>";
                    if(row.createTime){
                        content = "<div class='pl-20 pr-20'><div class='color-999 pt-5 pb-10'>"+row.createTime+"</div>"+row.content+"</div>";
                    }
                    this.$alert(content, row.title, {
                        dangerouslyUseHTMLString: true,
                        confirmButtonText: '确定',
                        callback: action => {
                            // this.$message({
                            //     type: 'info',
                            //     message: `action: ${ action }`
                            // });
                        }
                    });
                }
            },
            handleRead(row) {
                this.$axios.post("/system-message/updateMessageStatus",{code:row.code}).then(res => {
                    if(res.code == 200) {
                        this.getData();
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            handleDel(row) {
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    let ids = [];
                    this.multipleSelection.map(item => {
                        ids.push(item.code);
                    })
                    this.$axios.delete("/system-message/delete?code="+row.code).then(res => {
                        if(res.code == 200) {
                            this.$message.success("批量删除成功！");
                            this.getData2();
                        }else{
                            this.$message.error(res.msg);
                        }
                    })
                }).catch(() => {});

            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageNum', val);
                this.getData();
            },
            // 分页导航
            handlePageChange2(val) {
                this.$set(this.queryRead, 'pageNum', val);
                this.getData2();
            },
        },
        computed: {
            unreadNum(){
                return this.unread.length;
            }
        },
    }

</script>

<style>
  .message-title{
    cursor: pointer;
  }
  .handle-row{
    margin-top: 30px;
  }
</style>

