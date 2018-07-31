<template>
    <div class="app-container">
        <el-row type="flex" justify="start">
            <el-col>
                <el-button size="mini" type="primary" plain @click="openCreateDialog('addParent')">新增主类</el-button>
                <el-button size="mini" type="primary" plain @click="openCreateDialog('addSon')">新增子类</el-button>
                <el-button size="mini" type="success" plain @click="openModifyDialog()">修改类别</el-button>
                <el-button size="mini" type="info" plain @click="deleteDialog()">删除类别</el-button>
            </el-col>
        </el-row>
        <div class="table-box">
            <tree-grid :columns="columns" :loading='loading' :tree-structure="true" :data-source="tableData" style="margin-top:10px;" @sort='tableSort' @multipleSelection='handleSelectionChange'></tree-grid>
        </div>
        <el-dialog :title="typeTitle" :visible.sync="dialogVisible" width="400px" center="" :close-on-click-modal='false' @close='closeDialog'>

            <el-form ref="createForm" :rules="rules" :model="form" label-width="80px">
                <el-form-item label="类型名字" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="类型顺序" prop="displayOrder">
                    <el-input type="number" v-model="form.displayOrder"></el-input>
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
import { addType, deleteType, updateType, getType } from "@/api/type.js";
import TreeGrid from "@/components/treetable/vue/treegrid.vue";
export default {
  components: {
    TreeGrid
  },
  data() {
    return {
      loading: false,
      pageIndex: 1,
      pageSize: 10,
      orderBy: "display_order",
      tableData: [],
      parentId: 0,
      total: 0,
      currentPage: 0,
      typeTitle: "",
      dialogVisible: false,
      form: {
        name: "",
        displayOrder: 0
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入类型名称",
            trigger: "blur"
          }
        ],
        displayOrder: [
          {
            required: true,
            message: "请输入排序",
            trigger: "blur"
          }
        ]
      },
      multipleSelection: [],
      columns: [
        {
          text: "名字",
          field: "name",
          width: "150",
          prop: "name",
          sort: false,
          textAlign: "left"
        },
        {
          text: "排序",
          field: "displayOrder",
          width: "85",
          prop: "display_order",
          sort: "custom",
          textAlign: "center"
        }
      ]
    };
  },
  created() {
    this.updateTypeInfo();
  },
  methods: {
    tableSort(row) {
      this.loading = true;
      let data = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        orderBy: row,
        parentId: 0
      };
      getType(data)
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
    updateTypeInfo() {
      this.loading = true;
      let data = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        orderBy: this.orderBy,
        parentId: 0
      };
      getType(data)
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
      // console.log(val);
    },
    openCreateDialog(type) {
      if (type == "addParent") {
        this.typeTitle = "新增主类";
        this.parentId = 0;
      }
      if (type == "addSon") {
        if (
          this.multipleSelection.length != 1 ||
          this.multipleSelection[0].parentId != 0
        ) {
          this.$message({
            type: "warning",
            message: "请选择一个主类进行添加"
          });
          return false;
        }

        this.parentId = this.multipleSelection[0].id;
        this.typeTitle = "新增子类";
      }

      this.dialogVisible = true;
    },
    openModifyDialog() {
      if (this.multipleSelection.length != 1) {
        this.$message({
          type: "warning",
          message: "请选择一个类型进行修改"
        });
        return false;
      }
      this.typeTitle = "修改类型";
      this.form.displayOrder = this.multipleSelection[0].displayOrder;
      this.form.name = this.multipleSelection[0].name;
      this.dialogVisible = true;
    },
    closeDialog() {
      this.form.displayOrder = 0;
      this.form.name = "";
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let submitData;
          if (this.typeTitle == "修改类型") {
            submitData = this.multipleSelection[0];
            submitData.displayOrder = this.form.displayOrder;
            submitData.name = this.form.name;
            submitData._parent = [];
            submitData.children = [];
            updateType(submitData).then(res => {
              if (res.success) {
                this.form.displayOrder = "";
                this.form.name = "";
                this.updateTypeInfo();
                this.$message({
                  type: "success",
                  message: "修改成功"
                });
                this.dialogVisible = false;
              }
            });
          } else {
            submitData = this.form;
            submitData.parentId = this.parentId;

            addType(submitData).then(res => {
              if (res.success) {
                this.form.displayOrder = "";
                this.form.name = "";
                this.updateTypeInfo();
                this.$message({
                  type: "success",
                  message: "添加成功"
                });
                this.dialogVisible = false;
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    deleteDialog() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: "warning",
          message: "至少选择一个类别进行删除"
        });
        return false;
      }
      this.$confirm("此操作将永久删除该类别, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let ids = [];
          this.multipleSelection.map((value, index) => {
            ids.push(value.id);
          });
          deleteType(ids).then(res => {
            if (res.success) {
              this.updateTypeInfo();
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
    }
  }
};
</script>

<style scoped>
.table-box {
  margin-top: 10px;
  max-width: 282px;
}
</style>

