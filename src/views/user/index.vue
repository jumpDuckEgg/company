<template>
  <div class="app-container">
    <el-row type="flex" justify="end">
      <el-col style="width:400px;margin-bottom:10px;">
        <el-input placeholder="请输入内容" v-model="searchText" class="input-with-select" size='mini'>
          <el-select v-model="select" slot="prepend" placeholder="请选择" style="width:90px;">
            <el-option label="姓名" value="userName"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="sreachData"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-row type="flex" justify="start">
      <el-col>
        <el-button size="mini" type="primary" plain @click="createdUser">新增用户</el-button>
        <el-button size="mini" type="success" plain @click="modifyPassword">修改密码</el-button>
        <el-button size="mini" type="danger" plain @click="deleteUser">删除</el-button>
      </el-col>
    </el-row>

    <div class="table-box">
      <el-table v-loading="loading" :data="tableData" stripe size='mini' border @selection-change="handleSelectionChange" @sort-change='tableSort'>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="user_name" label="姓名" width="120" align='center' sortable='custom'>
          <template slot-scope="scope">
            {{scope.row.userName}}
          </template>
        </el-table-column>
        </el-table-column>
        <el-table-column prop="create_date" label="创建时间" width="100" align='center' sortable='custom'>
          <template slot-scope="scope">
            <el-tag size='mini'>{{scope.row.createDate}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备注" width="230" header-align="center">
          <template slot-scope="scope">
            <div class="overWord">
              {{scope.row.remark}}
            </div>
            <el-tag class="detail" size="mini" @click.native="showDetail(scope.row.remark)">详情</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background layout="prev, pager, next,sizes,total" :total="total" :page-sizes="[10, 15, 20,25]" :page-size="pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
      </div>

    </div>
    <!-- 新增用户 -->
    <el-dialog :visible.sync="dialogVisible" width="350px" center lock-scroll :close-on-click-modal="false">
      <div class="dialog-title">新增用户</div>
      <el-form ref="form" :model="form" :rules="rules" label-width="70px">
        <el-form-item label="姓名：" prop="name">
          <el-input size="mini" v-model="form.name" clearable class="input_width"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input size="mini" v-model="form.password" class="input_width" type="password" ref="password">
            <i class="el-icon-view el-input__icon" slot="suffix" @mousedown="showPass" @mouseup="hidePass"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input size="mini" type="textarea" v-model="form.remark" clearable class="input_width"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitUser('form')" size="mini" v-loading='submitFlag'>确 定</el-button>
        <el-button @click="cancelAddUser" size="mini" type="danger" v-loading='submitFlag'>取 消</el-button>
      </span>
    </el-dialog>
    <!-- 修改信息 -->
    <el-dialog :visible.sync="modifyDialogVisible" width="350px" center lock-scroll :close-on-click-modal="false">
      <div class="dialog-title">{{dialogTitle}}</div>
      <el-form ref="mdform" :model="mdform" :rules="mdrules" label-width="90px">
        <template v-if="dialogTitle == '修改密码'">
          <el-form-item label="密码：" prop="password">
            <el-input size="mini" v-model="mdform.password" class="input_width" type="password">
            </el-input>
          </el-form-item>
          <el-form-item label="确认密码：" prop="checkpassword">
            <el-input size="mini" v-model="mdform.checkpassword" class="input_width" type="password">
            </el-input>
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="checkModify('mdform')" v-loading='modifyFlag'>确 定</el-button>
        <el-button size="mini" type="danger" @click="cancelModify('mdform')" v-loading='modifyFlag'>取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
    getUsersByPage,
    createdUser,
    removeUser,
    modifyUser,
    modifyPassword
} from "@/api/user.js";

export default {
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请再次输入密码"));
            } else if (value !== this.mdform.password) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };
        return {
            dialogTitle: "修改密码",
            submitFlag: false,
            modifyFlag: false,
            loading: false,
            pageIndex: 1,
            total: 1,
            pageSize: 15,
            currentPage: 1,
            searchText: "",
            select: "",
            tableData: [],
            multipleSelection: [],
            dialogVisible: false,
            modifyDialogVisible: false,
            orderBy: "create_date desc",
            form: {
                name: "",
                password: "",
                remark: ""
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入姓名",
                        trigger: "blur"
                    }
                ],
                password: [
                    {
                        required: true,
                        message: "请输入密码",
                        trigger: "blur"
                    }
                ]
            },
            mdform: {
                password: "",
                checkpassword: ""
            },
            mdrules: {
                password: [
                    {
                        required: true,
                        message: "请输入密码",
                        trigger: "blur"
                    }
                ],
                checkpassword: [{ validator: validatePass, trigger: "blur" }]
            }
        };
    },
    filters: {},
    created() {
        this.loading = true;
        let data = {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            orderBy: this.orderBy
        };
        getUsersByPage(data)
            .then(res => {
                if (res.success) {
                    this.tableData = res.result.records;
                    this.loading = false;
                    this.total = Number(res.result.total);
                    this.currentPage = res.result.current;
                }
            })
            .catch(err => {
                this.loading = false;
            });
    },
    methods: {
        tableSort(row) {
            let sortData = "";
            if (row.order == "descending") {
                sortData = row.prop + " desc";
            } else {
                sortData = row.prop;
            }
            let data = {};
            data = {
                pageIndex: 1,
                pageSize: this.pageSize,
                orderBy: sortData
            };
            this.loading = true;
            getUsersByPage(data)
                .then(res => {
                    if (res.success) {
                        this.tableData = res.result.records;
                        this.loading = false;
                        this.total = Number(res.result.total);
                        this.currentPage = res.result.current;
                    }
                })
                .catch(err => {
                    this.loading = false;
                });
        },
        sreachData() {
            if (!this.select) {
                this.$message({
                    type: "warning",
                    message: "请选择一个类型"
                });
                return false;
            }
            let data = {};
            data = {
                pageIndex: 1,
                pageSize: this.pageSize,
                orderBy: this.orderBy
            };
            data[this.select] = this.searchText;
            getUsersByPage(data)
                .then(res => {
                    if (res.success) {
                        this.tableData = res.result.records;
                        this.loading = false;
                        this.total = Number(res.result.total);

                        this.currentPage = res.result.current;
                    }
                })
                .catch(err => {
                    this.loading = false;
                });
        },
        checkModify(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let modifyData = {};
                    if (this.dialogTitle == "修改密码") {
                        modifyPassword(
                            this.mdform.password,
                            this.multipleSelection[0].id
                        ).then(res => {
                            if (res.result) {
                                this.$message({
                                    type: "success",
                                    message: "修改密码成功"
                                });
                                this.mdform.password = "";
                                this.modifyDialogVisible = false;
                            }
                        });
                    }
                    if (this.dialogTitle == "修改权限") {
                        this.multipleSelection[0].type = this.mdform.type;
                        modifyData = this.multipleSelection[0];
                        modifyUser(modifyData)
                            .then(res => {
                                if (res.result) {
                                    this.$message({
                                        type: "success",
                                        message: "修改权限成功"
                                    });
                                    this.mdform.type = "";
                                }
                            })
                            .then(() => {
                                this.loading = true;
                                let data = {};
                                this.searchText = "";
                                data = {
                                    pageIndex: this.pageIndex,
                                    pageSize: this.pageSize,
                                    orderBy: this.orderBy
                                };
                                getUsersByPage(data)
                                    .then(res => {
                                        if (res.success) {
                                            this.tableData = res.result.records;
                                            this.loading = false;
                                            this.total = Number(
                                                res.result.total
                                            );
                                            this.currentPage =
                                                res.result.current;
                                            this.modifyDialogVisible = false;
                                        }
                                    })
                                    .catch(err => {
                                        this.loading = false;
                                        this.modifyDialogVisible = false;
                                    });
                            });
                    }
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        cancelModify() {
            this.modifyDialogVisible = false;
        },
        showDetail(detail) {
            this.$alert(detail, "备注详情", {
                confirmButtonText: "确定",
                callback: action => {}
            });
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        createdUser() {
            this.dialogVisible = true;
        },
        modifyPassword() {
            if (!(this.multipleSelection.length == 1)) {
                this.$message({
                    type: "warning",
                    message: "请选择一个用户进行修改"
                });
                return false;
            }
            this.dialogTitle = "修改密码";
            this.modifyDialogVisible = true;
        },

        cancelAddUser() {
            this.form.name = "";
            this.form.type = "";
            this.form.password = "";
            this.dialogVisible = false;
            this.$message({
                type: "info",
                message: "取消添加用户"
            });
        },
        submitUser(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.submitFlag = true;
                    createdUser(this.form)
                        .then(res => {
                            if (res.success) {
                                this.submitFlag = false;
                                this.$message({
                                    type: "success",
                                    message: "新增用户成功"
                                });
                                this.form.name = "";
                                this.form.type = "";
                                this.form.password = "";
                                this.form.remark = "";
                                this.dialogVisible = false;
                            } else {
                                this.submitFlag = false;
                                this.dialogVisible = false;
                                return Promise.reject();
                            }
                        })
                        .then(() => {
                            this.loading = true;
                            let data = {};
                            this.searchText = "";
                            data = {
                                pageIndex: this.pageIndex,
                                pageSize: this.pageSize,
                                orderBy: this.orderBy
                            };
                            getUsersByPage(data)
                                .then(res => {
                                    if (res.success) {
                                        this.tableData = res.result.records;
                                        this.loading = false;
                                        this.total = Number(res.result.total);
                                        this.currentPage = res.result.current;
                                    }
                                })
                                .catch(err => {
                                    this.loading = false;
                                });
                        })
                        .catch(() => {});
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        deleteUser() {
            if (this.multipleSelection.length == 0) {
                this.$message({
                    type: "warning",
                    message: "请选择至少一个用户进行删除"
                });
                return false;
            }
            this.$confirm("此操作将永久删除该用户信息, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    let ids = [];
                    this.multipleSelection.map((value, index) => {
                        ids.push(value.id);
                    });
                    removeUser(ids)
                        .then(res => {
                            if (res.success) {
                                this.$message({
                                    type: "success",
                                    message: "删除成功!"
                                });
                            }
                        })
                        .then(() => {
                            this.loading = true;
                            let data = {};
                            this.searchText = "";
                            data = {
                                pageIndex: this.pageIndex,
                                pageSize: this.pageSize,
                                orderBy: this.orderBy
                            };
                            getUsersByPage(data).then(res => {
                                if (res.success) {
                                    this.loading = false;
                                    this.tableData = res.result.records;
                                    this.total = Number(res.result.total);
                                    this.currentPage = res.result.current;
                                }
                            });
                        });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        handleCurrentChange(val) {
            this.loading = true;
            let data = {};
            this.pageIndex = val;
            data = {
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                orderBy: this.orderBy
            };
            if (this.select && this.searchText) {
                data[this.select] = this.searchText;
            }
            getUsersByPage(data)
                .then(res => {
                    if (res.success) {
                        this.tableData = res.result.records;
                        this.loading = false;
                        this.total = Number(res.result.total);

                        this.currentPage = res.result.current;
                    }
                })
                .catch(err => {
                    this.loading = false;
                });
        },
        handleSizeChange(val) {
            this.loading = true;
            let data = {};
            this.pageSize = val;
            data = {
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                orderBy: this.orderBy
            };
            if (this.select && this.searchText) {
                data[this.select] = this.searchText;
            }
            getUsersByPage(data)
                .then(res => {
                    if (res.success) {
                        this.tableData = res.result.records;
                        this.loading = false;
                        this.total = Number(res.result.total);
                        this.currentPage = res.result.current;
                    }
                })
                .catch(err => {
                    this.loading = false;
                });
        },
        showPass() {
            this.$refs.password.type = "text";
        },
        hidePass() {
            this.$refs.password.type = "password";
        }
    }
};
</script>

<style lang="scss" scoped>
.table-box {
    margin-top: 10px;
    width: 506px;
}
.input_width {
    width: 200px;
}
.dialog-title {
    border-left-width: 4px;
    border-left-color: deepskyblue;
    border-left-style: solid;
    padding-left: 10px;
    margin-bottom: 20px;
}
.pagination-box {
    margin: 20px auto;
    text-align: center;
}
.overWord {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 50px;
}
.detail {
    position: absolute;
    right: 0;
    top: 0;
    transform: translate(-20%, 40%);
    cursor: pointer;
}
</style>

