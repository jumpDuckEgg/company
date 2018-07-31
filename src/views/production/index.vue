<template>
  <div class="app-container">
    <el-row type="flex" justify="end">
      <el-col style="width:300px;margin-bottom:10px;">
        <el-input placeholder="请输入产品名称" class="input-with-select" size='mini'>
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-row type="flex" justify="start">
      <el-col>
        <el-button size="mini" type="primary" plain @click="openDialog('created')">新增产品</el-button>
        <el-button size="mini" type="success" plain @click="openDialog('modify')">修改产品</el-button>
        <el-button size="mini" type="info" plain>删除产品</el-button>
        <el-button size="mini" type="danger" plain>预览</el-button>
      </el-col>
    </el-row>
    <el-row class="table-box">
      <tree-grid :treeStructure='false' :columns="columns" :loading='loading' :data-source="tableData" style="margin-top:10px;" @sort='tableSort' @multipleSelection='handleSelectionChange'></tree-grid>
    </el-row>
    <el-dialog :title="typeTitle" :visible.sync="dialogVisible" width="900px" top="50px" center="" :close-on-click-modal='false'>

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
          <upload v-bind="specialData" key="specialData" :materialfileList.sync='specialData.materialfileList' :buttonFlag.sync='specialData.buttonFlag'></upload>
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
export default {
    components: {
        TreeGrid,
        wangEditor,
        upload
    },
    data() {
        return {
            options: [],
            selectedOptions: [],
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
                    width: "260",
                    prop: "content",
                    sort: false,
                    textAlign: "center"
                },
                {
                    text: "主类型id",
                    field: "type",
                    width: "100",
                    prop: "type",
                    sort: false,
                    textAlign: "center"
                },
                {
                    text: "子类型id",
                    field: "subType",
                    width: "100",
                    prop: "subType",
                    sort: false,
                    textAlign: "center"
                },
                {
                    text: "图片id",
                    field: "picturePath",
                    width: "100",
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
        filterOptions(data) {
            for (var j = 0; j < data.length; j++) {
                data[j].label = data[j].name;
                data[j].value = data[j].id;
                if (
                    data[j].children != undefined &&
                    data[j].children.length > 0
                ) {
                    this.filterOptions(data[j].children);
                } else {
                    delete data[j].children;
                }
            }
        },
        tableSort() {},
        selectChange(data) {
            if (data.length == 1) {
                this.type = 0;
                this.subType = data[0];
            }
            if (data.length == 2) {
                this.type = data[0];
                this.subType = data[1];
            }
        },
        updateProductionInfo() {
            this.loading = true;
            let data = {
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                orderBy: this.orderBy,
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
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        openDialog(type) {
            if (type == "created") {
                this.typeTitle = "新增产品";
            }
            if (type == "modify") {
                this.typeTitle = "修改产品";
            }
            this.dialogVisible = true;
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
                            submitData.picturePath =
                                specialData.response.result;
                        }
                        submitData.type = this.type;
                        submitData.subType = this.type;
                        submitData.content = this.$refs.wangEditor.editorContent;
                        addProduction(submitData).then(res => {
                            if (res.success) {
                                this.updateProductionInfo();
                                this.type = 0;
                                this.subType = 0;
                                this.form.title = "";
                                this.form.content = "";
                                this.form.displayOrder = 0;
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

<style scoped>
.table-box {
    margin-top: 10px;
    max-width: 844px;
}
</style>

