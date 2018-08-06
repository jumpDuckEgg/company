<template>
  <div class="app-container">
    <el-row type="flex" justify="start">
      <el-col>
        <el-button size="mini" type="success" plain @click="openModifyDialog">修改关于我们</el-button>
      </el-col>
    </el-row>
    <div class="content-title">
      关于我们配置
    </div>
    <el-row class="content-box__item">
      <el-col :span="8">
        <span class="content-box__item-title">专题图片：</span>
        <el-button type="small" @click="openImgDialog()">查看</el-button>
      </el-col>
    </el-row>
    <el-row class="content-box__item">
      <el-col :span="24">
        <span class="content-box__item-title">详细信息：</span>
        <div class="descriptionBox">
          <div v-html="description"></div>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="图片查看" :visible.sync="imgDialogVisible" center>
      <img :src="templateImg" alt="" class="templateImg">
    </el-dialog>
    <el-dialog title="修改配置" :visible.sync="modifyDialogVisible" center top="40px" width="900px" :close-on-click-modal='false' @close='closeDialog'>
      <div class="modify-box">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="专题图片:">
            <upload ref="upload" v-bind="specialData" key="specialData" :materialfileList.sync='specialData.materialfileList' :buttonFlag.sync='specialData.buttonFlag'></upload>
          </el-form-item>
          <el-form-item label="详细信息:">
            <wangEditor :parentsContent='form.description' ref="wangEditor" style="width:700px"></wangEditor>
          </el-form-item>
          <el-row style="text-align:center">
            <el-button :disabled=' specialData.buttonFlag' @click="submitInfo">提交</el-button>
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
import { getAboutInfo, modifyAboutInfo } from "@/api/about.js";
import SERVER from "@/api/config";
export default {
  components: {
    upload,
    wangEditor
  },
  data() {
    return {
      imgDialogVisible: false,
      modifyDialogVisible: false,
      templateImg: test,
      pictureId: "",
      description: "",
      form: {
        pictureId: "",
        description: ""
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
    this.updateAboutInfo();
  },
  methods: {
    closeDialog() {
      this.updateAboutInfo();
    },
    updateAboutInfo() {
      getAboutInfo()
        .then(res => {
          this.form = res.result;
          this.pictureId = res.result.pictureId;
          this.description = res.result.description;
          if (this.$refs.wangEditor) {
            this.$refs.wangEditor.editor.txt.html(res.result.description);
          }
          this.specialData.materialfileList = [];
          if (res.result.pictureId != 0) {
            this.specialData.materialfileList.push({
              name: "专题图片",
              url: SERVER.INFO_URL + res.result.pictureId,
              response: {
                result: res.result.pictureId
              }
            });
            this.specialData.imgUrl = SERVER.INFO_URL + res.result.pictureId;
            if (this.$refs.upload) {
              this.$refs.upload.imageUrl =
                SERVER.INFO_URL + res.result.pictureId;
            }
            this.pictureId = SERVER.INFO_URL + res.result.pictureId;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    openModifyDialog() {
      this.modifyDialogVisible = true;
    },
    openImgDialog() {
      this.templateImg = this.pictureId;
      this.imgDialogVisible = true;
    },
    submitInfo() {
      this.$confirm("此操作将提交信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let submitInfoData = Object.assign({}, this.form);
          let specialData = this.specialData.materialfileList[0];
          if (this.specialData.materialfileList.length > 0) {
            submitInfoData.pictureId = specialData.response.result;
          } else {
            submitInfoData.pictureId = 0;
          }
          submitInfoData.description = this.$refs.wangEditor.editor.txt.html();

          modifyAboutInfo(submitInfoData).then(res => {
            if (res.success) {
              this.$message({
                type: "success",
                message: "提交成功"
              });
              this.updateAboutInfo();
              this.modifyDialogVisible = false;
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
.templateImg {
  width: 100%;
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

.descriptionBox {
  border: 3px solid rgb(64, 158, 255);
  margin-top: 10px;
  padding: 20px;
  border-radius: 10px;
  height: 500px;
  width: 80%;
  overflow: auto;
  // text-align: center;
}
</style>

