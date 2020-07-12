<template>
  <div class="user_list">
    <el-row class="margin_b_10">
      <el-button type="primary" @click="edit(0)" icon='el-icon-plus'>添加</el-button>
    </el-row>
    <el-table
      :data="list"
      class="margin_l_10"
      max-height="680"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="index" label="序号" class="width_20"></el-table-column>
      <el-table-column prop="username" label="用户名" class="width_20"></el-table-column>
      <el-table-column prop="nickname" label="用户类型" class="width_20"></el-table-column>
      <el-table-column prop="last_login_time" label="最后登录时间" class="width_20"></el-table-column>
      <el-table-column label="操作" class="width_20">
        <template slot-scope="scope">
          <el-button @click="edit(2,scope.row)" type="primary" size="mini">编辑</el-button>
          <el-button @click="edit(1,scope.row)" type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex space_center">
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.curPage"
        :page-size="Number(pagination.pageSize)"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.totalItem"
      ></el-pagination>
    </div>
    <el-dialog :title="awardTitle" :visible.sync="dialogFormVisible" width="60%">
      <el-form :model="info" style="margin: 0 auto;">
        <el-form-item label="用户名:" :label-width="formLabelWidth">
          <el-input class="input_width_300" v-model="info.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码:" :label-width="formLabelWidth">
          <el-input type="text" class="input_width_300" v-model="info.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选择角色:" :label-width="formLabelWidth">
          <el-dropdown split-button type="primary" @command="select_rike">
            {{tip}}
            <el-dropdown-menu slot="dropdown">
              <blockquote v-for="(i,index) in role_arr" :key="index">
                <el-dropdown-item :command="index" >{{i.name}}</el-dropdown-item>
              </blockquote>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer flex space_center">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" v-if="editType==1?false:true" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {user_list,user_edit,user_del} from '@/api/admin/user.js';
import {role_list} from '@/api/admin/role.js';
import {formatTime} from '@/utils/index.js';
  export default {
    name:'UserList',
    data() {
      return {
        editType:null,
        onOrOff:true,
        tip:'选择用户角色',
        awardTitle:"编辑",
        pid:null,
        keyword:'',//搜索关键字
        currentPage:1,//当前页
        list:[],//列表
        pagination:{},//分页信息
        selectItem:'',//选中项
        pageInfo:{
          page:1,
          limit:50,
          keyword:'-1'
        },
        formLabelWidth:'150px',
        formLabelWidth_options:'10',
        dialogFormVisible:false,
        role_arr:[],//角色类型列表
        info:{
          username:'',
          nickname:'',
          password:''
        }
      }
    },
    created(){
      this.user_list();
    },
    methods: {
      select_rike(item){
        this.info.nickname = this.role_arr[item].name;
        this.info.role = this.role_arr[item].id;
        this.tip = this.info.nickname;
      },
      // 用户列表
      user_list(){
        user_list({}).then(res=>{
          if(res.code == 0){
            this.list = res.data.list;
            this.list = this.list.map(item=>{
              if(item.last_login_time !=0){
                item.last_login_time = formatTime(item.last_login_time);
              } else {
                item.last_login_time = '无登陆数据';
              }
              return item;
            })
            this.pagination.totalItem = res.data.count;
          }
        })
      },
      // 添加奖项
      confirm(){
        if(!this.info.username.trim()){
          return this.$baseMessage(
              `请输入用户名`,
              "error"
          )
        };
        if(!this.info.password.trim()){
          return this.$baseMessage(
              `请输入密码`,
              "error"
          )
        };
        if(!this.info.nickname.trim()){
          return this.$baseMessage(
              `请选择用户角色`,
              "error"
          )
        };
        if(this.editType == 2||this.editType == 0) {
          user_edit(this.info).then(res=>{
            if(res.code == 0){
              this.$baseMessage(res.msg,'success');
            } else {
              this.$baseMessage(res.msg,'error')
            }
          })
        };
        setTimeout(()=>{
          this.user_list();
        },200);
        this.dialogFormVisible = false;
      },
      //编辑
      edit(type,row){
        this.editType = type;
        if(type == 0){
          this.info = {
            username:'',
            nickname:'',
            password:''
          };
          this.role_list();
          this.dialogFormVisible = true;
        } else if(type == 1) {
          this.$confirm('', '是否删除?', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
              user_del({id:row.id}).then(res=>{
                if(res.code==0){
                  this.$baseMessage(res.msg,'success');
                } else {
                  this.$baseMessage(res.msg,'error');
                }
              });
              setTimeout(()=>{
                this.user_list();
              },200); 
            }).catch(() => {
            });

        } else {
          this.dialogFormVisible = true;
          row.password = '';
          row.last_login_time = null;
          this.info = row;
          this.role_list();
        }
      },
      // 获取用户角色列表
      role_list(){
        role_list(this.pageInfo).then(res=>{
          console.log('role_list',res);
          if(res.code==0){
            this.role_arr = res.data.list;
          }
        })
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageInfo.pageSize = val;
        this.user_list();
      },
      // 选中项
      handleSelectionChange(item){
        console.log(item)
        let selectList = item.map(item=>{
          return item.id
        });
        this.selectItem = selectList.join(',');
      },
      // 选中页数
       handleCurrentChange(val) {
         console.log('val',val)
        this.pageInfo.curPage = val;
        this.user_list();
      },
    }
  }
</script>

<style lang="scss" scoped>
.user_list {
  position: relative;
  padding: 10px;
  .padding_10 {
    padding: 10px;
  }
}
.font_c_blue {
  color: #1890ff;
}
.margin_b_10{
  margin-bottom: 10px;
}
.el-button--mini {
    padding: 5px 7px;
    font-size: 12px;
    border-radius: 2px;
}
</style>
