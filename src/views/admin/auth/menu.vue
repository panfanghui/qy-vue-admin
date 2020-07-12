<template>
  <div class="subjectList">
    <el-row class="margin_b_10">
      <el-button type="primary" @click="add(0)">添加</el-button>
    </el-row>
    <el-card class="box-card" style="width:100%;padding-bottom:30px;">
      <div slot="header" class="clearfix">
        <span>菜单管理</span>
        <el-button style="float: right; padding: 20px 0" type="text"></el-button>
      </div>
      <el-tree
        style="font-size:15px;line-height: 22px;color:#999999"
        :data="data"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        :render-content="renderContent"
      ></el-tree>
    </el-card>
    <el-dialog :before-close="closeDialog" :title="awardTitle" :visible.sync="dialogFormVisible" width="60%" :close-on-click-modal="false">
      <el-form :model="info" ref="ruleForm" :rules="rules">
        <el-form-item prop="label" label="菜单标题:" :label-width="formLabelWidth">
          <el-input class="input_width_300" v-model="info.label" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="icon" label="图标:" :label-width="formLabelWidth">
          <el-input class="input_width_150" v-model="info.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="path" label="页面路径:" :label-width="formLabelWidth">
          <el-input class="input_width_300" v-model="info.path" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="module" label="模块名称:" :label-width="formLabelWidth">
          <el-input class="input_width_300" v-model="info.module" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="component" label="组件路径:" :label-width="formLabelWidth">
          <el-input class="input_width_300" v-model="info.component" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="组件名称:" :label-width="formLabelWidth">
          <el-input class="input_width_300" v-model="info.name" autocomplete="off"></el-input>
        </el-form-item>
		<el-form-item prop="url_value" label="接口权限:" :label-width="formLabelWidth">
		  <el-input class="input_width_300" v-model="info.url_value" autocomplete="off"></el-input>
		</el-form-item>
        <el-form-item prop="sort" label="排序:" :label-width="formLabelWidth">
          <el-input type="number" class="input_width_150" v-model="info.sort" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer flex space_center">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" v-if="editType==1?false:true" @click="confirm(info)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {menu_list,menu_add,menu_del} from '@/api/admin/menu.js';
  export default {
    name:'AwardsLog',
    data() {
      const data = [];
      return {
        data: JSON.parse(JSON.stringify(data)),
        // pid:null,
        editType:null,
        onOrOff:true,
        awardTitle:"菜单编辑",
        keyword:'',//搜索关键字
        currentPage:1,//当前页
        list:[],//列表
        pagination:{},//分页信息
        selectItem:'',//选中项
        pageInfo:{
          curPage:1,
          pageSize:10,
          keyword:'-1'
        },//获取用户信息
        formLabelWidth:'120px',
        formLabelWidth_options:'10',
        dialogFormVisible:false,
        info:{},
        rules: {
          label: [
            { required: true, message: '请输入菜单标题', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          module: [
            { required: true, message: '请输入模块名称', trigger: 'blur' },
          ],
          component: [
            { required: true, message: '请输入组件路径', trigger: 'blur' },
          ],
          name: [
            { required: true, message: '请输入组件名称', trigger: 'blur' },
          ],
          path: [
            { required: true, message: '请输入页面路径', trigger: 'blur' },
          ],
          url_value: [
            { required: true, message: '请输入后台接口地址', trigger: 'blur' },
          ],
          sort: [
            { required: true, message: '请输入排序', trigger: 'blur' },
          ],
        }
      }
    },
    created(){
      this.menu_list();
    },
    methods: {
      renderContent(h, { node, data, store }) {
        return (
          <span class="custom-tree-node" style="margin:20px;">
            <span style="margin-right:10px;">{node.label}</span>
            <span style="margin-right:10px;"><i class="el-icon-link"></i>{data.url_value}</span>
            <span style="margin-left:10px;">
              <el-button size="mini" type="text" on-click={ () => this.append(data,0) }>
              <el-tooltip class="item" effect="dark" content="添加" placement="top-start">
                    <i class="el-icon-edit"></i>
              </el-tooltip>
              </el-button>
              <el-button size="mini" type="text" on-click={ () => this.append(data,1) }>
                  <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                        <i class="el-icon-edit-outline"></i>
                  </el-tooltip>
              </el-button>
              <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>
                  <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                        <i class="el-icon-delete"></i>
                  </el-tooltip>
              </el-button>
            </span>
          </span>
          );
      },
      // 添加节点
      append(data,type) {
        if(type == 0){
          this.info={
            pid:null,
            label:'',
            icon:'',
            module:'',
            component:'',
            name:'',
            path:'',
            sort:'',
            url_value:''
        };
          this.info.pid = data.id;
          const newChild = { label: this.info.title, children: [] };
        } else {
          this.info = data;
        };
        this.editType = 0;
        this.dialogFormVisible = true;
      },
      // 删除节点
      remove(node, data) {
        this.$confirm('', '是否删除?', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
          }).then(() => {
            menu_del({id:data.id}).then(res=>{
                if(res.code==0){
                  this.$baseMessage(res.msg,'success');
                  const parent = node.parent;
                  const children = parent.data.children || parent.data;
                  const index = children.findIndex(d => d.id === data.id);
                  children.splice(index, 1);
                }else{
                  this.$baseMessage(res.msg,'error');
                }

            })
          }).catch(() => {
          });
      },
      add(type){
        this.dialogFormVisible = true;
        this.editType = 0;
      },
      menu_list(){
        menu_list(this.pageInfo).then(res=>{
          if(res.code == 0){
            this.data = res.data.list;
          }
        })
      },
      //提交
      confirm(formName){
        if(!this.info.label){
          return this.$baseMessage(
              `请输入菜单标题`,
              "error"
          )
        };
        if(!this.info.path){
          return this.$baseMessage(
              `请输入页面路径`,
              "error"
          )
        };
        if(!this.info.url_value){
          return this.$baseMessage(
              `请输入接口地址`,
              "error"
          )
        };
        this.info.title = this.info.label;
        if(this.editType == 0){
          menu_add(this.info).then(res=>{
            if(res.code == 0){
              this.$baseMessage('编辑成功','success');
            }
          })
        } else if(this.editType == 2) {
          menu_add(this.info).then(res=>{
            if(res.code == 0){
              this.$baseMessage('编辑成功');
            }
          })
        };
        this.info = {};
        this.dialogFormVisible = false;
        this.menu_list();
      },
      // 关闭弹窗
      closeDialog(){
        this.dialogFormVisible = false;
        this.info = {};
      },
      handleSizeChange(val) {
        this.pageInfo.pageSize = val;
        this.menu_list();
      },
    }
  }
</script>

<style lang="scss" scoped>
.subjectList {
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
</style>
