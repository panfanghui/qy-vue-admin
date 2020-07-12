<template>
  <div class="subjectList">
    <el-row class="margin_b_10">
      <el-button type="primary" @click="add(0)"  icon='el-icon-plus'>添加</el-button>
    </el-row>
    <el-table
      :data="list"
      class="margin_l_10"
      max-height="680"
      @selection-change="handleSelectionChange"
      >
      <el-table-column type="index" label="序号" class="width_20"></el-table-column>
      <el-table-column prop="name" label="名称" class="width_20"></el-table-column>
      <el-table-column prop="description" label="描述" class="width_20"></el-table-column>
      <el-table-column label="操作" class="width_20">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row,2)" type="primary" size="mini" >编辑</el-button>
          <el-button @click="edit(scope.row,1)" type="danger" size="mini">删除</el-button>
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
      <el-form :model="info">
        <el-form-item label="名称:" :label-width="formLabelWidth">
          <el-input
            :disabled="editType==1?true:false"
            class="input_width_300"
            v-model="info.name"
            placeholder="请输入角色名称"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述:" :label-width="formLabelWidth">
          <el-input
            :rows="2"
            v-model="info.description"
            type="textarea"
            autocomplete="off"
            placeholder="请输入角色描述"
          ></el-input>
        </el-form-item>
        <el-card class="box-card" style="width:100%;padding-bottom:30px;">
          <div slot="header" class="clearfix">
            <span>选择权限</span>
            <el-button style="float: right; padding: 3px 0" type="text"></el-button>
          </div>
          <el-tree
            v-if="info.menu_list!=''"
            style="font-size:18px;"
            :data="info.menu_list"
            :default-checked-keys="info.menu_auth"
            show-checkbox
            @check="checked"
            node-key="id"
            :check-strictly="true"
            default-expand-all
            :expand-on-click-node="false"
            :render-content="renderContent"
          ></el-tree>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer flex space_center">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" v-if="editType==1?false:true" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {role_list,role_edit,role_detail,role_del} from '@/api/admin/role.js';
import {menu_list} from '@/api/admin/menu.js';
  export default {
    name:'',
    data() {
      return {
        data:[],
        editType:null,
        onOrOff:true,
        awardTitle:"用户角色编辑",
        keyword:'',//搜索关键字
        currentPage:1,//当前页
        list:[],//列表
        pagination:{
          totalItem:0
        },//分页信息
        selectItem:'',//选中项
        pageInfo:{
          curPage:1,
          pageSize:10,
          keyword:'-1'
        },
        formLabelWidth:'80px',
        formLabelWidth_options:'10',
        dialogFormVisible:false,
        menu_auth:[],//菜单列表id
        info:{//弹框信息
          description: "",
          name: "",
          menu_list:[],
          menu_auth:[]
        }
      }
    },
    created(){
      this.role_list();
    },
    methods: {
      checked(e,node){
        this.menu_auth = node.halfCheckedKeys.concat(node.checkedKeys);
      },
      renderContent(h, { node, data, store }) {
        return (
          <span class="custom-tree-node">
            <span style="margin-right:10px;">{node.label}</span>
          </span>);
      },
      // 删除
      role_del(id){
        this.$confirm('', '是否删除?', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
          }).then(() => {
            role_del({id:id}).then(res=>{
              if(res.code==0){
                 this.$baseMessage(res.msg,'success');
                 this.role_list();
              };
            })
            setTimeout(()=>{
              this.user_list();
            },200);
          }).catch(() => {
          });
        
      },
      // 添加节点
      append(data,type) {
        if(type == 0){
          this.info.pid = data.id;
          const newChild = { label: this.info.title, children: [] };
          // if (!data.children) {
          //   this.$set(data, 'children', []);
          // }
          // data.children.push(newChild);
        } else {
          this.info = data;
        };
        this.editType = 0;
        this.dialogFormVisible = true;
      },
      // 点击添加
      add(type){
        this.info={
          description: "",
          name: "",
          menu_list:[]
        }
        this.menu_list();
        this.editType = type;
        this.dialogFormVisible = true;
      },
      // 获取权限菜单列表
      menu_list(){
        menu_list({}).then(res=>{
          console.log('role',res)
          this.info.menu_list = res.data.list;
        })
      },
      // 角色列表
      role_list(){
        role_list({}).then(res=>{
          console.log('role_list',res)
          if(res.code == 0){
            this.list = res.data.list;
            this.pagination.totalItem = res.data.count;
          }
        })
      },
      // 点击确定=>编辑
      confirm(){
        if(!this.info.name.trim()){
          return this.$baseMessage('请输入角色名称')
        };
        if(!this.info.description.trim()){
          return this.$baseMessage('请输入角色描述')
        };
        if(this.menu_auth.length<1&&this.editType==0){
          return this.$baseMessage('请勾选菜单列表')
        };
        if(this.editType == 2||this.editType == 0) {
          let info = {//弹框信息
              description: this.info.description,
              name: this.info.name,
              menu_auth:this.menu_auth
            };
            if(this.editType == 2){
              info.id = this.info.id
            };
           role_edit(info).then(res=>{
            if(res.code ==0){
              this.$baseMessage('编辑成功','success');
              this.role_list();
              this.menu_auth = [];
              this.dialogFormVisible = false;
            }else{
               return this.$baseMessage(res.msg)
            }
          })
        };

      },
      // 角色详情
      role_detail(id){
        role_detail({id:id}).then(res=>{
          console.log('search',res)
          if(res.code == 0){
            let arr = res.data.menu_auth;
            for(let i = 0;i<arr.length;i++){
              for(let j = i+1;j<arr.length;j++){
                if(arr[i]>arr[j]){
                  let temp = arr[i];
                  arr[i]= arr[j];
                  arr[j] = temp;
                }
              }
            };
            console.log(arr)
            res.data.menu_auth = arr;
            this.info = res.data;
            this.menu_auth = this.info.menu_auth;
            console.log(this.menu_auth)
          }
        })
      },
      // 点击修改
      edit(row,type){
        if(type == 1){
          this.role_del(row.id)
        } else {
          this.dialogFormVisible = true;
          // this.info = row;
          this.info = {
            description: row.description,
            name: row.name,
            id:row.id
          }
          this.editType = type;
          this.role_detail(row.id)
        }
      },
      handleSizeChange(val) {
        this.pageInfo.pageSize = val;
        this.role_list();
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
        this.pageInfo.curPage = val;
        this.role_list();
      },
    }
  }
</script>

<style lang="scss" scoped>
.subjectList {
  width: 100%;
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
