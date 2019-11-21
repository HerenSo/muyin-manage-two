<template>
  <div class="adminSet">
      <el-tabs v-model="message">
        <el-tab-pane :label="`基本信息`" name="first">
          <el-row>
            <el-col :span="8">
              <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="角色名称">
                  <el-input v-model="form.roleName"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                  <el-input type="textarea"  v-model="form.remark"></el-input>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane :label="`权限设置`" name="second">
          <div class=" el-table table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--small">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <thead class="table_main table_header ">
              <tr><th width="20%" align="center">权限名称</th><th width="60%">权限分配</th><th>全选</th></tr>
              </thead>
              <tbody class="table_main table_body " >
              <tr  v-for="(subMenus,index) in data">
                <td colspan="3">
                  <table width="100%" >
                    <tr class="table_parent"><td align="center" width="20%">{{subMenus.name}}</td><td></td><td align="center"></td></tr>
                    <tr v-for="(items,i) in subMenus.subMenus">
                      <td width="20%" align="center">&nbsp;&nbsp;<i class="el-icon-d-arrow-right"></i>&nbsp;&nbsp;{{items.name}}</td>
                      <td width="60%">
                        <label v-for="item in items.subMenus" role="checkbox" class="el-checkbox el-checkbox--small is-bordered" :class="{'is-checked':item.checked}" borer="">
                          <span aria-checked="mixed" :class="item.checked?'el-checkbox__input is-checked':'el-checkbox__input'">
                              <span class="el-checkbox__inner"></span>
                              <input type="checkbox" id="item.code" :value="item.code" v-model="rightList" aria-hidden="true" class="el-checkbox__original" value="">
                          </span>
                          <span class="el-checkbox__label">{{item.name}}<!----></span>
                        </label>
                      </td>
                      <td width="20%" align="center">
                        <label  role="checkbox" class="el-checkbox el-checkbox--small is-bordered" :class="{'is-checked':items.checked}" borer="">
                          <span aria-checked="mixed" :class="items.checked?'el-checkbox__input is-checked':'el-checkbox__input'">
                              <span class="el-checkbox__inner"></span>
                              <input type="checkbox" id="items.code" :value="items.code" v-model="allSelectList" aria-hidden="true" class="el-checkbox__original" value="">
                          </span>
                          <span class="el-checkbox__label">全选<!----></span>
                        </label>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </el-tab-pane>
      </el-tabs>
    <div class="handle-row">
      <el-button type="primary" @click="submit" :loading="subloading">{{ subloading ? '提交中 ...' : '保 存' }}</el-button>
      <el-button type="" @click="back">返回</el-button>
    </div>
  </div>
</template>

<script>
    import bus from '../../common/bus';
    export default {
        data(){
            return{
                message: 'first',
                data: [],
                oldVal:'',
                rightList:[],
                allSelectList:[],
                subloading:false
            }
        },
        props:['role'],
        computed:{
            form(){
                return  this.role;
            }
        },
        mounted(){
            this.data = JSON.parse(localStorage.getItem("user_information")).menus;
            this.data.map((item) => {
                item.subMenus.map((i) => {
                    i.subMenus.unshift({ // 加查看
                        code:i.code,
                        name:'查看',
                        // checked:true
                    })
                })
                return item;
            })
            this.queryByManagerId();
        },
        methods: {
            queryByManagerId(){ // 根据角色查询权限
                var that = this;
                this.$axios.post('/menu/selectMenusTreeByRoleId?roleid='+this.form.roleid).then((res) => {
                    if(res.code == 200){
                        this.getResDataList(res.data);
                        this.getDataList(this.data);
                        this.data.map((data,d) => { // 使全选
                            data.subMenus.map((items,i) => {
                                var flag = true;
                                items.subMenus.map((item,index) => {
                                    if(item.checked != true){
                                        flag = false;
                                    }
                                })
                                if(flag){
                                    items.checked = true;
                                    this.allSelectList.push(items.code);
                                }
                                return items;
                            })
                            return data;
                        })
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            getDataList(subList) {
                subList.map((data, i) =>{
                    if(data.subMenus != null){
                        this.getDataList(data.subMenus);
                    }
                    if(this.rightList.find((e) => (e == data.code)))
                        data.checked=true;
                });
            },
            getResDataList(subList) {
                subList.map((data, i) =>{
                    if(data.subMenus != null){
                        this.getResDataList(data.subMenus);
                    }
                    this.rightList.push(data.code);
                });
            },
            submit(){
                this.form.menus = this.rightList;

                console.log('form',this.form)
                this.subloading = true;
                this.$axios.post('/role/insertOrUpdate',this.form).then((res) => {
                    if(res.code == 200){
                        if(this.form.code){
                            this.$message.success('编辑成功！');
                        }else {
                            this.$message.success('新增成功！');
                        }
                    }else{
                        this.$message.error(res.msg);
                    }
                    this.subloading = false;
                })

            },
            arraySpanMethod({ row, column, rowIndex, columnIndex }) {
                if (row.parentId == 0) {
                    if (columnIndex == 3) {
                        return [0, 3];
                    }
                }
            },
            back(){
                bus.$emit('visible', false);
            },
        },
        watch:{
            $route(newValue, oldValue){
                if(newValue.query.code){
                    this.form = {};
                    this.form.code = newValue.query.code;
                }
            },
            rightList(newVal,oldVal){
                // console.log(newVal)
                var newsId = newVal.concat(oldVal).filter(function(v, i, arr) {
                    return arr.indexOf(v) === arr.lastIndexOf(v);
                });
                this.data.map((data,d) => { // 使全选
                    data.subMenus.map((items,i) => {
                        items.subMenus.map((item, index) => {
                            if(item.code == newsId[0]) {
                                var flag = true;
                                if(newVal.length>oldVal.length){ // 如果新值的长度大于旧值的长度，表示选中，反之取消选中
                                    if(this.rightList.indexOf(data.code) == -1){ // 添加祖父ID
                                        this.rightList.push(data.code)
                                    }
                                    if(this.rightList.indexOf(items.code) == -1){ // 添加父ID
                                        this.rightList.push(items.code)
                                        items.subMenus[0].checked = true
                                    }
                                    item.checked = true;
                                    this.data[d].subMenus[i].subMenus.map((t) => {
                                        if(this.rightList.indexOf(t.code) == -1){
                                            flag = false;
                                            // console.log(t.code,flag)
                                        }
                                    })
                                    if(flag){
                                        items.checked = true
                                        this.allSelectList.push(items.code);
                                    }
                                }else{
                                    var flat =false
                                    this.data[d].subMenus.map((t) => { // 判断是否需要添加祖父ID
                                        if(this.rightList.indexOf(t.code) != -1){
                                            flat = true;
                                        }
                                    })
                                    if(!flat){ // 删除祖父ID
                                        this.rightList.splice(this.rightList.indexOf(data.code),1)
                                    }
                                    item.checked = false;
                                    if(this.allSelectList.indexOf(items.code) !=-1){
                                        items.checked = false;
                                        this.allSelectList.splice(this.allSelectList.indexOf(items.code),1);
                                    }
                                }
                            }
                        })
                        return items;
                    })
                    return data;
                })
            },
            allSelectList(newVal,oldVal){
                var newsId = newVal.concat(oldVal).filter(function(v, i, arr) {
                    return arr.indexOf(v) === arr.lastIndexOf(v);
                });
                this.data.map((data,d) => {
                    data.subMenus.map((items,i) => {
                        if(items.code == newsId[0]) {
                            // console.log(this.rightList)
                            items.subMenus.map((item, index) => {
                                if(newVal.length>oldVal.length) {
                                    if (this.rightList.indexOf(data.code) == -1) { // 添加祖父ID
                                        this.rightList.push(data.code)
                                    }
                                    items.checked = true;
                                    item.checked = true;
                                    if (this.rightList.indexOf(item.code) == -1){
                                        this.rightList.push(item.code);
                                    }
                                }else{
                                    var flat = false;
                                    this.data[d].subMenus.map((t) => { // 判断是否需要添加祖父ID
                                        if(this.rightList.indexOf(t.code) != -1){
                                            flat = true;
                                        }
                                    })
                                    if(!flat){ // 删除祖父ID
                                        // console.log(data.code)
                                        this.rightList.splice(this.rightList.indexOf(data.code),1)
                                    }
                                    items.checked =false;
                                    item.checked = false;
                                    this.rightList.splice(this.rightList.indexOf(item.code),1);
                                }
                            })
                        }
                        return items;
                    })
                    return data;
                })
            }
        }
    }
</script>

<style scoped>
  .handle-row {
    /*position: fixed;*/
    bottom: 0;
    /*background: #fff;*/
    padding: 10px 0;
    width: 100%;
    margin-right: 10px;
    display: flex;
    justify-content: flex-end;
  }
  .el-tab-pane{
    padding: 20px 0;
  }
  .adminSet{
    margin-top: -30px;
    padding: 0 30px;
  }
  .adminSet >>> .el-table__expanded-cell[class*=cell]{
    padding: 0 0 0 47px !important;
  }
  .table_child >>> thead{
    display: none !important;
  }
  .table_child >>> td{
    border:none !important;
    border-left: 1px solid #EBEEF5 !important;
    border-top: 1px solid #EBEEF5 !important;
  }
  .table_child td .text-center{
    display: block;
    text-align: center !important;
  }
  .table_main{
    line-height: 36px;
  }
  .table_main td ,.table_main th{
    padding: 4px 6px;
    text-align: inherit;
  }
  .table_main > tr > td{
    padding: 0 !important;
  }
  .el-checkbox__original {
    top: -8px;
    left: -10px;
    width: 73px;
    height: 32px;
    z-index: 1;
    cursor: pointer;
  }
</style>