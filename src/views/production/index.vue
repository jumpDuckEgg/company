<template>
  <div class="app-container">
    <el-row type="flex" justify="start" style="margin:20px 0;">
      <el-col style="font-size:13px;">
        产品类型:
        <el-cascader :options="options" change-on-select size="mini" v-model="searchOptions"></el-cascader>
        <el-input v-model='searchContent' placeholder="请输入产品名称" class="input-with-select" size='mini' style="width:300px;margin-bottom:10px;">
          <el-button slot="append" icon="el-icon-search" @click="searchInfo"></el-button>
        </el-input>
        <el-button size="mini" type="success" @click="clearSearch">清空搜索信息</el-button>
      </el-col>
    </el-row>
    <el-row type="flex" justify="start">
      <el-col>
        <el-button size="mini" type="primary" plain @click="openDialog('created')">新增产品</el-button>
        <el-button size="mini" type="success" plain @click="openDialog('modify')">修改产品</el-button>
        <el-button size="mini" type="info" plain @click="deleteDialog">删除产品</el-button>
        <!-- <el-button size="mini" type="danger" plain>预览</el-button> -->
      </el-col>
    </el-row>
    <el-row class="table-box">
      <tree-grid :treeStructure='false' :columns="columns" :loading='loading' :data-source="tableData" style="margin-top:10px;" @sort='tableSort' @multipleSelection='handleSelectionChange' @wacthcontent='showContent'></tree-grid>
    </el-row>
    <div class="pagination-box">
      <el-pagination background layout="prev, pager, next,sizes,total" :current-page.sync="currentPage" :total="total" :page-sizes="[10, 15, 20,25]" :page-size="pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <el-dialog :title="typeTitle" :visible.sync="dialogVisible" width="900px" top="50px" center="" :close-on-click-modal='false' @close='closeDialog'>

      <el-form ref="createForm" :rules="rules" :model="form" label-width="80px" :inline="true">
        <el-form-item label="标题:" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="类型:">
          <el-cascader :options="options" change-on-select @change='selectChange' v-model="selectedOptions"></el-cascader>
        </el-form-item>
        <el-form-item label="类型顺序" prop="displayOrder">
          <el-input type="number" v-model="form.displayOrder" style="width:180px"></el-input>
        </el-form-item>
        <el-form-item label="产品图片:">
          <upload ref="upload" v-bind="specialData" key="specialData" :materialfileList.sync='specialData.materialfileList' :buttonFlag.sync='specialData.buttonFlag'></upload>
        </el-form-item>
        <el-form-item label="内容:">
          <wangEditor :parentsContent='form.content' ref="wangEditor" style="width:745px"></wangEditor>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm('createForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="查看内容" :visible.sync="contentDialogVisible" width="600px" top="50px" center="" :close-on-click-modal='false'>
      <div class="showContent">
        <div v-html="tempContent" v-if="tempFlag == 'content'" class="descriptionBox"></div>
        <div v-if="tempFlag == 'img'" class="descriptionBox">
          <img :src="tempContent" alt="">
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addProduction,
  deleteProduction,
  updateProduction,
  getProduction
} from "@/api/production.js";
import { getType } from "@/api/type.js";
import wangEditor from "@/components/WangEditor/index.vue";
import TreeGrid from "@/components/treetable/vue/treegrid.vue";
import upload from "@/components/UpLoad/index.vue";
import SERVER from "@/api/config";
export default {
  components: {
    TreeGrid,
    wangEditor,
    upload
  },
  data() {
    return {
      multipleSelection: [],
      contentDialogVisible: false,
      tempContent: "",
      tempFlag: "",
      options: [],
      selectedOptions: [],
      searchOptions: [],
      searchContent: "",
      type: 0,
      subType: 0,
      typeTitle: "新增产品",
      dialogVisible: false,
      pageIndex: 1,
      pageSize: 10,
      orderBy: "display_order",
      total: 0,
      currentPage: 0,
      loading: false,
      tableData: [],
      columns: [
        {
          text: "标题",
          field: "title",
          width: "150",
          prop: "title",
          sort: false,
          textAlign: "left"
        },
        {
          text: "内容",
          field: "content",
          width: "102",
          prop: "content",
          sort: false,
          textAlign: "center"
        },
        {
          text: "主类型",
          field: "typeName",
          width: "100",
          prop: "typeName",
          sort: false,
          textAlign: "center"
        },
        {
          text: "产品类型",
          field: "subTypeName",
          width: "100",
          prop: "subTypeName",
          sort: false,
          textAlign: "center"
        },
        {
          text: "产品图片",
          field: "picturePath",
          width: "140",
          prop: "picturePath",
          sort: false,
          textAlign: "center"
        },
        {
          text: "排序",
          field: "displayOrder",
          width: "85",
          prop: "display_order",
          sort: "custom",
          textAlign: "center"
        }
      ],
      form: {
        title: "",
        content: "",
        displayOrder: 0
      },
      rules: {
        title: [
          {
            required: true,
            message: "请输入标题",
            trigger: "blur"
          }
        ]
      },
      specialData: {
        uploadFolder: "一般图片",
        materialfileList: [],
        limitFlieNumber: 1,
        buttonFlag: false,
        imgUrl: ""
      }
    };
  },
  created() {
    this.updateProductionInfo();
    let data = {
      pageIndex: 1,
      pageSize: 1000,
      parentId: 0
    };
    getType(data)
      .then(res => {
        if (res.success) {
          let records = res.result.records;
          this.filterOptions(records);
          this.options = records;
        }
      })
      .catch(err => {});
  },
  methods: {
    clearSearch() {
      this.searchContent = "";
      this.searchOptions = [];
    },
    searchInfo() {
      this.pageIndex = 1;
      this.pageSize = this.pageSize;
      let searchData = {};
      console.log(this.searchOptions);
      if (this.searchOptions.length == 1) {
        searchData.type = this.searchOptions[0];
        searchData.subType = 0;
      }
      if (this.searchOptions.length == 2) {
        searchData.type = this.searchOptions[0];
        searchData.subType = this.searchOptions[1];
      }
      if (this.searchContent) {
        searchData.title = this.searchContent;
      }
      console.log(searchData);
      this.updateProductionInfo(searchData);
    },
    filterOptions(data) {
      for (var j = 0; j < data.length; j++) {
        data[j].label = data[j].name;
        data[j].value = data[j].id;
        if (data[j].children != undefined && data[j].children.length > 0) {
          this.filterOptions(data[j].children);
        } else {
          delete data[j].children;
        }
      }
    },
    tableSort(row) {
      this.loading = true;
      let data = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        orderBy: row,
        parentId: 0
      };
      getProduction(data)
        .then(res => {
          if (res.success) {
            this.tableData = res.result.records;
            this.loading = false;
            this.total = Number(res.result.total);
            this.currentPage = res.result.current;
          }
        })
        .catch(err => {});
    },
    selectChange(data) {
      if (data.length == 1) {
        this.type = data[0];
        this.subType = 0;
      }
      if (data.length == 2) {
        this.type = data[0];
        this.subType = data[1];
      }
    },
    updateProductionInfo(params) {
      this.loading = true;
      let data = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        orderBy: this.orderBy
      };
      if (params) {
        data = Object.assign(data, params);
      }
      getProduction(data)
        .then(res => {
          if (res.success) {
            this.tableData = res.result.records;
            this.loading = false;
            this.total = Number(res.result.total);
            this.currentPage = res.result.current;
          }
        })
        .catch(err => {});
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    showContent(data) {
      if (data.indexOf("一般图片") !=-1) {
        this.tempFlag = "img";
        this.tempContent = SERVER.IMG_URL + data;
      } else {
        this.tempFlag = "content";
        this.tempContent = data;
      }

      this.contentDialogVisible = true;
    },
    openDialog(type) {
      if (type == "created") {
        this.typeTitle = "新增产品";
      }
      if (type == "modify") {
        if (this.multipleSelection.length != 1) {
          this.$message({
            type: "warning",
            message: "请选择一个产品进行修改"
          });
          return false;
        }
        let data = this.multipleSelection[0];
        console.log(data);
        this.form.title = data.title;
        this.form.displayOrder = data.displayOrder;
        this.specialData.materialfileList = [];
        this.specialData.materialfileList.push({
          name: "产品图片",
          url: SERVER.IMG_URL + data.picturePath,
          response: {
            result: data.pictureId
          }
        });
        this.specialData.imgUrl = SERVER.IMG_URL + data.picturePath;

        if (this.$refs.upload) {
          this.$refs.upload.imageUrl = SERVER.IMG_URL + data.picturePath;
        }
        if (this.$refs.wangEditor) {
          this.$refs.wangEditor.editor.txt.html(data.content);
        } else {
          this.form.content = data.content;
        }
        if (data.type == 0) {
          this.selectedOptions = [data.subType];
          this.type = 0;
          this.subType = data.subType;
        } else {
          this.selectedOptions = [data.type, data.subType];
          this.type = data.type;
          this.subType = data.subType;
        }
        this.typeTitle = "修改产品";
      }
      this.dialogVisible = true;
    },
    deleteDialog() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: "warning",
          message: "至少选择一个产品进行删除"
        });
        return false;
      }
      this.$confirm("此操作将永久删除该产品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let ids = [];
          this.multipleSelection.map((value, index) => {
            ids.push(value.id);
          });
          deleteProduction(ids).then(res => {
            if (res.success) {
              this.updateProductionInfo();
              this.$message({
                type: "success",
                message: "删除成功"
              });
            }
          });
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    closeDialog() {
      this.type = 0;
      this.subType = 0;
      this.form.title = "";
      this.form.content = "";
      this.form.displayOrder = 0;
      this.selectedOptions = [];
      this.specialData.materialfileList = [];
      this.specialData.imgUrl = "";
      this.$refs.wangEditor.editor.txt.html("");
      this.$refs.upload.imageUrl = "";
    },
    handleSizeChange(val) {
      this.pageSize = val;
      let searchData = {};
      if (this.searchOptions.length == 1) {
        searchData.type = 0;
        searchData.subType = this.searchOptions[0];
      }
      if (this.searchOptions.length == 2) {
        searchData.type = this.searchOptions[0];
        searchData.subType = this.searchOptions[1];
      }
      if (this.searchContent) {
        searchData.title = this.searchContent;
      }
      this.updateProductionInfo(searchData);
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      let searchData = {};
      if (this.searchOptions.length == 1) {
        searchData.type = 0;
        searchData.subType = this.searchOptions[0];
      }
      if (this.searchOptions.length == 2) {
        searchData.type = this.searchOptions[0];
        searchData.subType = this.searchOptions[1];
      }
      if (this.searchContent) {
        searchData.title = this.searchContent;
      }
      this.updateProductionInfo(searchData);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.type == 0 && this.subType == 0) {
            this.$message({
              type: "warning",
              message: "请选择一个类别"
            });
            return false;
          }
          if (this.typeTitle == "新增产品") {
            let submitData = Object.assign({}, this.form);
            let specialData = this.specialData.materialfileList[0];
            if (this.specialData.materialfileList.length > 0) {
              submitData.pictureId = specialData.response.result;
            }
            submitData.type = this.type;
            submitData.subType = this.subType;
            submitData.content = this.$refs.wangEditor.editorContent;
            addProduction(submitData).then(res => {
              if (res.success) {
                this.updateProductionInfo();

                this.dialogVisible = false;
              }
            });
          }
          if (this.typeTitle == "修改产品") {
            let submitData = Object.assign(
              this.multipleSelection[0],
              this.form
            );
            let specialData = this.specialData.materialfileList[0];
            if (this.specialData.materialfileList.length > 0) {
              submitData.pictureId = specialData.response.result;
            }
            submitData.type = this.type;
            submitData.subType = this.subType;
            submitData.content = this.$refs.wangEditor.editorContent;
            updateProduction(submitData).then(res => {
              if (res.success) {
                this.updateProductionInfo();

                this.dialogVisible = false;
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.table-box {
  margin-top: 10px;
  max-width: 724px;
}
.showContent {
  height: 500px;
  /* overflow: scroll; */
}
.pagination-box {
  margin-top: 20px;
  margin-left: 200px;
}
.descriptionBox {
  border: 3px solid rgb(64, 158, 255);
  margin-top: 10px;
  padding: 20px;
  border-radius: 10px;
  height: 500px;
  width: 100%;
  overflow: auto;
  img {
    width: 500px;
  }
}
</style>

