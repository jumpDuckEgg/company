<template>
  <div class="app-container">
    <el-row type="flex" justify="start">
      <el-col>
        <el-button size="mini" type="success" plain @click="openModifyDialog">修改联系我们</el-button>
      </el-col>
    </el-row>
    <div class="content-title">
      联系我们配置
    </div>
    <div class="content-box">
      <el-row class="content-box__item">
        <el-col :span="12">
          <span class="content-box__item-title">系统名称：</span>{{currentData.name}}
        </el-col>
      </el-row>
      <el-row class="content-box__item">
        <el-col :span="6">
          <span class="content-box__item-title">系统logo：</span>
          <el-button type="small" @click="openImgDialog('logo')">查看</el-button>
        </el-col>
        <el-col :span="6">
          <span class="content-box__item-title">专题图片：</span>
          <el-button type="small" @click="openImgDialog('pictureId')">查看</el-button>
        </el-col>
        <el-col :span="6">
          <span class="content-box__item-title">微信二维码：</span>
          <el-button type="small" @click="openImgDialog('contactWechatPath')">查看</el-button>
        </el-col>
      </el-row>
      <el-row class="content-box__item">
        <el-col :span="6">
          <span class="content-box__item-title">联系人：</span>{{currentData.contactor}}
        </el-col>
        <el-col :span="6">
          <span class="content-box__item-title">联系电话：</span>{{currentData.contactPhone}}
        </el-col>
        <el-col :span="6">
          <span class="content-box__item-title">联系手机号码：</span>{{currentData.contactMobilePhone}}
        </el-col>
        <el-col :span="6">
          <span class="content-box__item-title">微信号：</span>{{currentData.contactWechatNo}}
        </el-col>
      </el-row>
      <el-row class="content-box__item">
        <el-col :span="6">
          <span class="content-box__item-title">邮箱：</span>{{currentData.contactEmail}}
        </el-col>
        <el-col :span="6">
          <span class="content-box__item-title">邮编：</span>{{currentData.postCode}}
        </el-col>
        <el-col :span="6">
          <span class="content-box__item-title">经度：</span>{{currentData.latitude}}
        </el-col>
        <el-col :span="6">
          <span class="content-box__item-title">纬度：</span>{{currentData.longitude}}
        </el-col>
      </el-row>
      <el-row class="content-box__item">
        <el-col :span="24">
          <span class="content-box__item-title">联系地址：</span>{{currentData.address}}
        </el-col>
      </el-row>
      <el-row class="content-box__item">
        <el-col :span="24">
          <span class="content-box__item-title">营业时间：</span>{{currentData.openTime}}
        </el-col>
      </el-row>
      <el-row class="content-box__item">
        <el-col :span="24">
          <span class="content-box__item-title">详细信息：</span>
          <div class="descriptionBox">
            <div v-html="currentData.description"></div>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-dialog title="图片查看" :visible.sync="imgDialogVisible" center>
      <img :src="templateImg" alt="" class="templateImg">
    </el-dialog>
    <el-dialog title="修改配置" :visible.sync="modifyDialogVisible" center top="40px" width="900px" :close-on-click-modal='false' @close='closeDialog'>
      <div class="modify-box">
        <el-form ref="form" :model="form" label-width="80px" :inline="true">
          <el-col>
            <el-form-item label="系统名称:">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-col :span="8">
              <el-form-item label="系统logo:">
                <upload ref="logoUpload" v-bind="logoData" key="logoData" :materialfileList.sync='logoData.materialfileList' :buttonFlag.sync='logoData.buttonFlag'></upload>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="专题图片:">
                <upload ref="specialUpload" v-bind="specialData" key="specialData" :materialfileList.sync='specialData.materialfileList' :buttonFlag.sync='specialData.buttonFlag'></upload>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="二维码:">
                <upload ref="wechatUpload" v-bind="wechatData" key="wechatData" :materialfileList.sync='wechatData.materialfileList' :buttonFlag.sync='wechatData.buttonFlag'></upload>
              </el-form-item>
            </el-col>
            </el-form-item>
          </el-col>
          <el-form-item label="联系人:">
            <el-input v-model="form.contactor"></el-input>
          </el-form-item>
          <el-form-item label="联系电话:">
            <el-input v-model="form.contactPhone"></el-input>
          </el-form-item>
          <el-form-item label="手机号码:">
            <el-input v-model="form.contactMobilePhone"></el-input>
          </el-form-item>
          <el-form-item label="微信号:">
            <el-input v-model="form.contactWechatNo"></el-input>
          </el-form-item>
          <el-form-item label="邮箱:">
            <el-input v-model="form.contactEmail"></el-input>
          </el-form-item>
          <el-form-item label="邮编:">
            <el-input v-model="form.postCode"></el-input>
          </el-form-item>
          <el-form-item label="经度:">
            <el-input v-model="form.latitude"></el-input>
          </el-form-item>
          <el-form-item label="纬度:">
            <el-input v-model="form.longitude"></el-input>
          </el-form-item>
          <el-form-item label="联系地址:">
            <el-input v-model="form.address"></el-input>
          </el-form-item>
          <el-form-item label="营业时间:">
            <el-input v-model="form.openTime"></el-input>
          </el-form-item>
          <el-row>
            <el-form-item label="详细信息:">
              <wangEditor :parentsContent='form.description' ref="wangEditor" style="width:700px"></wangEditor>
            </el-form-item>
          </el-row>
          <el-row style="text-align:center">
            <el-button :disabled='logoData.buttonFlag||specialData.buttonFlag||wechatData.buttonFlag' @click="submitInfo">提交</el-button>
          </el-row>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import upload from "@/components/UpLoad/index.vue";
import wangEditor from "@/components/WangEditor/index.vue";
import test from "@/assets/404_images/404.png";
import { getCompanyInfo, modifyCompanyInfo } from "@/api/contact.js";
import SERVER from "@/api/config";
export default {
    components: {
        upload,
        wangEditor
    },
    data() {
        return {
            currentData: {
                name: "",
                logo: "",
                contactor: "",
                pictureId: "",
                contactPhone: "",
                contactMobilePhone: "",
                contactWechatNo: "",
                contactWechatPath: "",
                contactEmail: "",
                postCode: "",
                longitude: 0,
                latitude: 0,
                address: "",
                openTime: "0",
                description: ""
            },
            imgDialogVisible: false,
            templateImg: test,
            modifyDialogVisible: false,
            form: {
                name: "",
                logo: "",
                contactor: "",
                pictureId: "",
                contactPhone: "",
                contactMobilePhone: "",
                contactWechatNo: "",
                contactWechatPath: "",
                contactEmail: "",
                postCode: "",
                longitude: 0,
                latitude: 0,
                address: "",
                openTime: "0",
                description: ""
            },
            logoData: {
                uploadFolder: "一般图片",
                materialfileList: [],
                limitFlieNumber: 1,
                buttonFlag: false,
                imgUrl: ""
            },
            specialData: {
                uploadFolder: "一般图片",
                materialfileList: [],
                limitFlieNumber: 1,
                buttonFlag: false,
                imgUrl: ""
            },
            wechatData: {
                uploadFolder: "一般图片",
                materialfileList: [],
                limitFlieNumber: 1,
                buttonFlag: false,
                imgUrl: ""
            }
        };
    },
    created() {
        this.updateCompanyInfo();
    },
    methods: {
        closeDialog() {
            this.updateCompanyInfo();
        },
        updateCompanyInfo() {
            getCompanyInfo().then(res => {
                if (res.success) {
                    this.currentData = this.form = res.result;
                    if (this.$refs.wangEditor) {
                        this.$refs.wangEditor.editor.txt.html(
                            res.result.description
                        );
                    }
                    this.logoData.materialfileList = [];
                    if (res.result.logo != 0) {
                        this.logoData.materialfileList.push({
                            name: "系统logo",
                            url:
                                SERVER.BASE_URL +
                                "/file/upload?type=" +
                                res.result.logo,
                            response: {
                                result: res.result.logo
                            }
                        });
                        this.logoData.imgUrl =
                            SERVER.BASE_URL + "/file/get?id=" + res.result.logo;
                        if (this.$refs.logoUpload) {
                            this.$refs.logoUpload.imageUrl =
                                SERVER.BASE_URL +
                                "/file/get?id=" +
                                res.result.logo;
                        }
                        this.logo = res.result.logo;
                    }

                    this.specialData.materialfileList = [];
                    if (res.result.pictureId != 0) {
                        this.specialData.materialfileList.push({
                            name: "专题图片",
                            url:
                                SERVER.BASE_URL +
                                "/file/get?id=" +
                                res.result.pictureId,
                            response: {
                                result: res.result.pictureId
                            }
                        });
                        this.specialData.imgUrl =
                            SERVER.BASE_URL +
                            "/file/get?id=" +
                            res.result.pictureId;
                        if (this.$refs.specialUpload) {
                            this.$refs.specialUpload.imageUrl =
                                SERVER.BASE_URL +
                                "/file/get?id=" +
                                res.result.pictureId;
                        }
                        this.pictureId = res.result.pictureId;
                    }

                    this.wechatData.materialfileList = [];
                    if (res.result.contactWechatPath != 0) {
                        this.wechatData.materialfileList.push({
                            name: "微信二维码",
                            url:
                                SERVER.BASE_URL +
                                "/file/get?id=" +
                                res.result.contactWechatPath,
                            response: {
                                result: res.result.contactWechatPath
                            }
                        });
                        this.wechatData.imgUrl =
                            SERVER.BASE_URL +
                            "/file/get?id=" +
                            res.result.contactWechatPath;
                        if (this.$refs.wechatUpload) {
                            this.$refs.wechatUpload.imageUrl =
                                SERVER.BASE_URL +
                                "/file/get?id=" +
                                res.result.contactWechatPath;
                        }
                        this.contactWechatPath = res.result.contactWechatPath;
                    }
                } else {
                    this.$message({
                        type: "error",
                        message: res.errorInfos[0].msg
                    });
                }
            });
        },

        openImgDialog(type) {
            if (type == "logo") {
                this.templateImg =
                    SERVER.BASE_URL + "/file/get?id=" + this.logo;
            }
            if (type == "pictureId") {
                this.templateImg =
                    SERVER.BASE_URL + "/file/get?id=" + this.pictureId;
            }
            if (type == "contactWechatPath") {
                this.templateImg =
                    SERVER.BASE_URL + "/file/get?id=" + this.contactWechatPath;
            }
            this.imgDialogVisible = true;
        },
        openModifyDialog() {
            this.modifyDialogVisible = true;
        },
        submitInfo() {
            this.$confirm("此操作将提交信息, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    let submitInfoData = Object.assign({}, this.form);
                    let logoData = this.logoData.materialfileList[0];
                    if (this.logoData.materialfileList.length > 0) {
                        submitInfoData.logo = logoData.response.result;
                    } else {
                        submitInfoData.logo = 0;
                    }
                    let specialData = this.specialData.materialfileList[0];
                    if (this.specialData.materialfileList.length > 0) {
                        submitInfoData.pictureId = specialData.response.result;
                    } else {
                        submitInfoData.pictureId = 0;
                    }
                    let wechatData = this.wechatData.materialfileList[0];
                    if (this.wechatData.materialfileList.length > 0) {
                        submitInfoData.contactWechatPath =
                            wechatData.response.result;
                    } else {
                        submitInfoData.contactWechatPath = 0;
                    }
                    submitInfoData.description = this.$refs.wangEditor.editor.txt.html();

                    modifyCompanyInfo(submitInfoData).then(res => {
                        if (res.success) {
                            this.$message({
                                type: "success",
                                message: "提交成功"
                            });
                            this.updateCompanyInfo();
                            this.modifyDialogVisible =false;
                        } else {
                            this.$message({
                                type: "error",
                                message: "提交失败"
                            });
                        }
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消提交"
                    });
                });
        }
    }
};
</script>

<style lang="scss" scoped>
.content-title {
    margin: 10px 0;
    padding-left: 10px;
    border-left: 5px solid rgb(64, 158, 255);
}
.content-box {
    width: 96%;
    margin: 0 auto;
    border-bottom: 0;
    &__item {
        padding: 10px;
        &-title {
            color: #999;
            border-left: 5px solid #999999;
            padding-left: 10px;
        }
    }
}
.templateImg {
    width: 100%;
}
.modify-box {
}
.descriptionBox {
    border: 3px solid rgb(64, 158, 255);
    margin-top: 10px;
    padding: 20px;
    border-radius: 10px;
    height: 500px;
    width:80%;
    overflow: auto;
    // text-align: center;
}

</style>

