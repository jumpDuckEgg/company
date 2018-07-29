<template>
    <div class="upload">
        <el-row class="material" justify type="flex">
            <el-col>
                <div v-if="imageUrl" class="avatarBox">
                    <img :src="imageUrl" class="avatar">
                    <div class="del" @click="handledeleteFile">
                        <i class="el-icon-delete deletbtn"></i>
                    </div>
                </div>
                <el-upload v-else ref="uploadImg" :action="materialUploadUrl" :headers="headData" :on-preview="handleMaterialPreview" :on-change='handleMaterialChange' :on-remove="handleMaterialRemove" :before-remove="MaterialbeforeRemove" :limit="limitFlieNumber" :on-success="handleMaterialSuccess" :file-list="materialfileList" :show-file-list="false" :before-upload="beforeMaterialUpload" :on-exceed="handleMaterialExceed" :on-progress="handleProgress" :on-error="handleError">
                    <i class="el-icon-plus avatar-uploader-icon"></i>
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
    }
  },
  data() {
    return {
      materialUploadUrl: "",
      headData: {},
      imageUrl: ""
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
      let ids = [];
      ids.push(file.response.result);
      this.$emit("update:buttonFlag", true);
      deleteFile(ids)
        .then(res => {
          if (res.success) {
            this.$emit("update:materialfileList", fileList);
            this.$emit("update:buttonFlag", false);
          } else {
            this.$emit("update:buttonFlag", false);
          }
        })
        .catch(() => {
          this.$emit("update:buttonFlag", false);
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
    MaterialbeforeRemove(file, fileList) {
      //   return this.$confirm(`确定移除 ${file.name}？`);
      // 文件移除的时候触发的方法
    },
    beforeMaterialUpload(file) {
      console.log(this.materialfileList);
      return true;
    },
    handleError(err, file, fileList) {
      console.log(err, file, fileList);
    },
    handleMaterialChange(file, fileList) {
      console.log(file, fileList);
    },
    handledeleteFile() {
        let that = this;
        this.$confirm("此操作将提交信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
           that.imageUrl = '';
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.avatarBox {
  width: 178px;
  height: 178px;
}
.avatarBox .avatar {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.del {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 178px;
  color: #fff;
  text-align: center;
  z-index: 5;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 6px;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s;
}
.del:hover {
  opacity: 1;
}
.deletbtn {
  font-size: 40px;
  position: relative;
  top: 30%;
}
</style>