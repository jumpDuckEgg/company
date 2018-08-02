<template>
    <div class="upload">
        <el-row class="material" justify type="flex">
            <el-col>

                <el-upload ref="uploadImg" :action="materialUploadUrl" :headers="headData" :on-preview="handleMaterialPreview" :on-change='handleMaterialChange' :on-remove="handleMaterialRemove" :before-remove="handleMaterialbeforeRemove" :limit="limitFlieNumber" :on-success="handleMaterialSuccess" :file-list="materialfileList" :show-file-list="true" :before-upload="beforeMaterialUpload" :on-exceed="handleMaterialExceed" :on-progress="handleProgress" :on-error="handleError">
                    <!-- <i class="el-icon-plus avatar-uploader-icon"></i> -->
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>

            </el-col>
        </el-row>
    </div>
</template>

<script>
import { deleteFile } from "@/api/file";
import { getToken } from "@/utils/auth";
import SERVER from "@/api/config";
export default {
  name: "upload",
  props: {
    uploadFolder: {
      type: String,
      default: "material"
    },
    materialfileList: {
      type: Array,
      default: []
    },
    limitFlieNumber: {
      type: Number,
      default: 3
    },
    buttonFlag: {
      type: Boolean,
      default: false
    },
    imgUrl: {
      type: String,
      default: false
    }
  },
  data() {
    return {
      materialUploadUrl: "",
      headData: {},
      imageUrl: this.imgUrl,
      deleteFlag: true
    };
  },
  created() {
    let url = SERVER.BASE_URL + "/file/upload?type=" + this.uploadFolder;
    this.materialUploadUrl = url;

    this.headData = { Authorization: `Bearer ${getToken()}` };
  },
  methods: {
    handleProgress() {
      // console.log("我在上传了");

      this.$emit("update:buttonFlag", true);
    },
    // 课件资源
    handleMaterialSuccess(response, file, fileList) {
      if (!response.success) {
        this.$message({
          message: response.errorInfos[0].msg,
          type: "error",
          duration: 5 * 1000
        });
        return false;
      }
      this.imageUrl = URL.createObjectURL(file.raw);
      this.$emit("update:materialfileList", fileList);
      this.$emit("update:buttonFlag", false);
    },
    handleMaterialRemove(file, fileList) {
      if (!this.deleteFlag) {
        return false;
      }
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let ids = [];
          ids.push(file.response.result);
          this.$emit("update:buttonFlag", true);
          deleteFile(ids)
            .then(res => {
              if (res.success) {
                this.$emit("update:materialfileList", fileList);
                this.$emit("update:buttonFlag", false);
                this.imageUrl = "";
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              } else {
                this.$emit("update:buttonFlag", false);
              }
            })
            .catch(() => {
              this.$emit("update:buttonFlag", false);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleMaterialPreview(file) {
      console.log(file);
    },
    handleMaterialExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 ${this.limitFlieNumber} 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    handleMaterialbeforeRemove(file, fileList) {
      // return this.$confirm(`确定移除 ${file.name}？`);
      // 文件移除的时候触发的方法
    },
    beforeMaterialUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 < 800;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG或PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 800k!");
      }
      if (isJPG && isLt2M) {
        this.deleteFlag = true;
      } else {
        this.deleteFlag = false;
      }
      return isJPG && isLt2M;
    },
    handleError(err, file, fileList) {
      console.log(err, file, fileList);
    },
    handleMaterialChange(file, fileList) {
      console.log(file, fileList);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>