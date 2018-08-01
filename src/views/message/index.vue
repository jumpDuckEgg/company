<template>
    <div class="app-container">
        <el-row type="flex" justify="start">
            <el-col>
                <el-button size="mini" type="success" plain @click="changeStatus">修改留言状态</el-button>
                <el-button size="mini" type="info" plain @click="removeMessage">删除留言</el-button>
            </el-col>
        </el-row>
        <el-row class="table-box">
            <tree-grid :treeStructure='false' :columns="columns" :loading='loading' :data-source="tableData" style="margin-top:10px;" @sort='tableSort' @multipleSelection='handleSelectionChange' @wacthcontent='showContent'></tree-grid>
        </el-row>
        <div class="pagination-box">
            <el-pagination background layout="prev, pager, next,sizes,total" :current-page.sync="currentPage" :total="total" :page-sizes="[10, 15, 20,25]" :page-size="pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import {
  addMessage,
  deleteMessage,
  updateMessage,
  getMessage
} from "@/api/message.js";
import TreeGrid from "@/components/treetable/vue/treegrid.vue";
export default {
  components: {
    TreeGrid
  },
  data() {
    return {
      loading: false,
      tableData: [],
      columns: [
        {
          text: "联系人",
          field: "contactor",
          width: "100",
          prop: "contactor",
          sort: false,
          textAlign: "left"
        },
        {
          text: "联系电话",
          field: "contactPhone",
          width: "150",
          prop: "contact_phone",
          sort: false,
          textAlign: "center"
        },
        {
          text: "邮箱",
          field: "contactEmail",
          width: "150",
          prop: "contact_email",
          sort: false,
          textAlign: "center"
        },
        {
          text: "联系地址",
          field: "address",
          width: "150",
          prop: "address",
          sort: false,
          textAlign: "center"
        },
        {
          text: "状态",
          field: "status",
          width: "150",
          prop: "status",
          sort: false,
          textAlign: "center"
        },
        {
          text: "留言",
          field: "message",
          width: "150",
          prop: "message",
          sort: false,
          textAlign: "center"
        }
      ],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      currentPage: 0,
      multipleSelection: []
    };
  },
  created() {
    this.updateMessageInfo();
  },
  methods: {
    updateMessageInfo(params) {
      this.loading = true;
      let data = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      };
      if (params) {
        data = Object.assign(data, params);
      }
      getMessage(data)
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
    handleSizeChange(val) {
      this.pageSize = val;
      this.updateMessageInfo();
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.updateMessageInfo();
    },
    changeStatus() {
      if (this.multipleSelection.length !== 1) {
        this.$message({
          type: "warning",
          message: "请选择一个留言进行修改"
        });
        return false;
      }
      this.$confirm("此操作将修改该留言为已处理, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let submitData = Object.assign({}, this.multipleSelection[0]);
          submitData.status = 1;
          updateMessage(submitData).then(res => {
            if (res.success) {
              this.$message({
                type: "success",
                message: "修改成功"
              });
              this.updateMessageInfo();
            } else {
              this.$message({
                type: "info",
                message: "修改失败"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消修改"
          });
        });
    },
    removeMessage() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: "warning",
          message: "请至少选择一个留言进行删除"
        });
        return false;
      }
      this.$confirm("此操作将永久删除该留言, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let ids = [];
          this.multipleSelection.map((value, index) => {
            ids.push(value.id);
          });
          deleteMessage(ids).then(res => {
            if (res.success) {
              this.$message({
                type: "success",
                message: "删除成功"
              });
              this.updateMessageInfo();
            } else {
              this.$message({
                type: "info",
                message: "删除失败"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    tableSort() {},
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    showContent() {}
  }
};
</script>

<style lang="scss" scoped>
.table-box {
  margin-top: 10px;
  max-width: 897px;
}
.pagination-box {
  margin-top: 20px;
  margin-left: 200px;
}
</style>


