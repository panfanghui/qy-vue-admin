<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="800px" height="380px" :before-close="handleClose"
      :close-on-click-modal="false">
      <el-container>
        <el-header style="height: 40px;">
          <div>
            <div style="float: left;">
              <el-upload :action="action" multiple :on-success="handleSuccess" :show-file-list="false">
                <el-button style="margin-left: -20px;" size="small" type="primary">上传
                </el-button>
              </el-upload>
            </div>
            <div style="float: right;">
              <el-checkbox v-model="checked" style="padding-right: 30px;" @change="checkedImageAll">全选</el-checkbox>
              <el-button type="danger" @click="deletefiles">删除</el-button>
              <el-dropdown style="padding-left: 10px;" trigger="click">
                <el-button type="primary">
                  移动<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(item,index) in category_list" v-if="item.id>0" :key="index" @click.native="movefilecate(item)">{{item.name}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>

        </el-header>
        <hr />
        <br />
        <el-container>
          <el-aside width="150px" style="background-color: #f4f5f9;">
            <div class="catagory">
              <a>
                <p style="text-align: center;line-height: 50px;color:#000000" @click="editcategoryadd">
                  <span class="el-icon-circle-plus" style="color:rgb(2, 117, 216);"></span>
                  添加分组
                </p>
              </a>
            </div>
            <div v-for="(item,index) in category_list" :key="index" class="catagory">
              <div v-if='item.is_edit' :style="item.is_show?'height: 80px;margin-top: 10px;background:#ffffff':'height: 80px;margin-top: 10px;'">
                <p style="margin-left: 10px;text-align: left;line-height: 50px;color:#000000">
                  <span class="el-icon-folder-opened" style="color:rgb(237, 206, 134);padding-right: 12px;"></span>
                  <a style="color:#7c7c7c">
                    <input style="width: 80px;" v-model="item.name" />
                  </a>
                  <span class="el-icon-s-tools" style="color:#7c7c7c" @click="editcategory(item)"></span>
                </p>
                <p style="text-align: center;">
                  <a><span style="color:#0080FF;padding-right: 10px;" @click="editcategorysave(item)">保存</span>
                    <span style="color:#C41A16" @click="editcategorydelete(item)">删除</span></a>
                </p>
              </div>
              <div v-else :style="item.is_show?'height: 40px;background:#ffffff':'height: 40px;'">
                <p style="margin-left: 10px;text-align: left;line-height: 50px;color:#000000">
                  <span class="el-icon-folder-opened" style="color:rgb(237, 206, 134);padding-right: 12px;"></span>
                  <a @click="checkedImage(item)" style="color:#7c7c7c"> {{item.name}} </a>
                  <span class="el-icon-s-tools" @click="editcategory(item)" style="color:#7c7c7c" v-if="item.id>0"></span>
                </p>
              </div>
            </div>
          </el-aside>
          <el-main>
            <el-row :gutter="24" style="height: 350px;overflow: scroll;overflow-x: hidden; overflow-y: auto;">
              <el-col :span="6" v-for="(item,index) in file_list" :key="index">
                <div class="select_image" @click="checkedImageOne(item)">
                  <img :src="item.url" style="width: 100%; height: 100%;" />
                  <div v-if="item.status" class="mask">
                    <span class="el-icon-check" style="color:#FFFFFF;font-size: 34px;line-height: 75px;"></span>
                  </div>
                </div>
              </el-col>
            </el-row>

          </el-main>

        </el-container>
      </el-container>
      <div class="col-lg-12" v-if="is_more_data">
        <a>
          <p @click="more_data()" style="color: #0080FF;font-size: 18px; text-align: center;">点击加载更多</p>
        </a>
      </div>
      <br />
      <hr />
      <br />
      <div style="position: relative; padding-right: 15px; text-align: center;">
        <el-button style="margin-left: 10px;" size="small" type="primary" :loading="loading" @click="saveData">确定
        </el-button>
        <el-button type="danger" @click="handleClose">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    FileList,
    FileDelete,
    Category,
    CategoryEdit,
    CategoryDelete,
    FileMove,
    UpLoad
  } from "@/api/admin/attachment.js";

  export default {
    name: "FileUpload",
    props: {
      num: {
        type: Number,
        default: 1,
        required: true,
      }
    },
    data() {
      return {
        show: true,
        checked: true,
        loading: false,
        dialogVisible: true,
        dialogImageUrl: "",
        action: "",
        title: "图片管理",
        dialogFormVisible: false,
        category_list: [],
        category_id: 0,
        file_list: [],
        select_image_list: [],
        page: 1,
        is_more_data: 1
      };
    },
    computed: {
      percentage() {
        if (this.allImgNum == 0) return 0;
        return this.$baseLodash.round(this.imgNum / this.allImgNum, 2) * 100;
      },
    },
    created() {
      this.action = UpLoad();
      this.categoryList(1);
    },
    methods: {
      categoryList(is_onload = 0) {
        Category({}).then(res => {
          if (res.code == 0) {
            this.category_list = res.data;
            if (is_onload == 1) {
              this.category_id = this.category_list[0].id
              this.fileList();
            }
          }
        })
      },
      fileList() {
        FileList({
          category_id: this.category_id,
          page: this.page
        }).then(res => {
          if (res.code == 0) {
            if (res.data.length <= 0) {
              this.is_more_data = 0
            } else {
              this.is_more_data = 1
            }
            this.file_list = this.file_list.concat(res.data);
          }
        })
      },
      checkedImage(item) {
        this.category_id = item.id;
        this.checked = false;
        this.page = 1;
        this.file_list = [];
        let list = [];
        this.category_list.forEach((item1, index) => {
          item1.is_edit = 0;
          item1.is_show = 0;
          list.push(item1)
        })
        this.category_list = list;
        item.is_show = 1;
        this.fileList()
      },
      more_data() {
        this.page++
        this.fileList()
      },
      //选择的图片
      saveData() {
        let list = [];
        let file_list=[];
        this.file_list.forEach((item, index) => {
          if (item.status == 1) {
            list.push(item)
          }
        })
        if(list.length>this.num){
          this.$baseMessage(
            "最多只能选择"+this.num+"图片",
            "error"
          );
          return 0;
        }
        this.file_list.forEach((item, index) => {
          item.status=0;
          file_list.push(item)
        })
        this.file_list=file_list;
        this.$emit('selectImage', list)
        this.dialogFormVisible=false;
      },
      checkedImageOne(item) {
        item.status = !item.status
      },
      editcategory(item) {
        let list = [];
        this.category_list.forEach((item1, index) => {
          if (item.id == item1.id) {
            item1.is_edit = !item1.is_edit
          } else {
            item1.is_edit = 0;
            item1.is_show = 0;
          }
          list.push(item1)
        })
        this.category_list = list;
      },
      checkedImageAll() {
        let list = [];
        this.file_list.forEach((item, index) => {
          if (this.checked) {
            item.status = 1;
          } else {
            item.status = 0;
          }
          list.push(item)
        })
        this.file_list = list;
      },
      //编辑分类
      editcategoryadd() {
        CategoryEdit({}).then(res => {
          if (res.code == 0)
            this.categoryList()
        })
      },
      //编辑分类
      editcategorysave(item) {
        CategoryEdit({
          id: item.id,
          name: item.name
        }).then(res => {
          if (res.code == 0) {
            this.categoryList()
          }
        })
      },
      //删除分组
      editcategorydelete(item) {
        CategoryDelete({
          id: item.id,
        }).then(res => {
          if (res.code == 0) {
            this.categoryList()
          }
        })
      },
      //删除分组
      deletefiles() {
        let delete_ids = [];
        this.file_list.forEach((item) => {
          if (item.status == 1) {
            delete_ids.push(item.id)
          }
        })
        if (delete_ids.length == 0) {
          this.$baseMessage(
            `请选择图片`,
            "error"
          );
          return 0;
        }
        FileDelete({
          ids: delete_ids
        }).then(res => {
          if (res.code == 0) {
            this.$baseMessage(
              res.msg,
              "success"
            );
            this.file_list = [];
            this.page = 1;
            this.fileList()
          }
        })
      },
      //移动图片到分类
      movefilecate(item) {
        let move_ids = [];
        this.file_list.forEach((item1) => {
          if (item1.status == 1) {
            move_ids.push(item1.id)
          }
        })
        if (move_ids.length == 0) {
          this.$baseMessage(
            `请选择图片`,
            "error"
          );
          return 0;
        }
        FileMove({
          ids: move_ids,
          category_id: item.id
        }).then(res => {
          this.$baseMessage(
            res.msg,
            "success"
          );
          this.file_list = [];
          this.page = 1;
          this.category_id = item.id
          this.fileList()
        })
      },
      //上传图片
      handleSuccess(response, file, fileList) {
        this.file_list = this.file_list.concat({
          id: response.data.id,
          url: response.data.url,
          status: 0
        });

      },
      handleError(err, file, fileList) {
        console.log(err)
      },
      handleShow() {
        this.dialogFormVisible = true;
      },
      //上传图片
      handleClose() {
        this.fileList = [];
        this.picture = "picture";
        this.allImgNum = 0;
        this.imgNum = 0;
        this.imgSuccessNum = 0;
        this.imgErrorNum = 0;
        this.action = UpLoad();
        this.dialogFormVisible = false;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .catagory {
    width: 150px;
  }

  .select_image {
    width: 140px;
    height: 80px;
    margin: 10px;
  }

  .select_image .mask {
    position: relative;
    width: 140px;
    height: 80px;
    top: -84px;
    right: 0;
    bottom: 0;
    left: 0px;
    z-index: 5;
    background-color: rgba(0, 0, 0, 0.5);
    text-align: center;
    background-size: 40px 40px;
    background-repeat: no-repeat;
    background-position: center;
  }
</style>
