<template>
  <div>
    <div ref="editor" style="text-align:left"></div>
  </div>
</template>

<script>
import E from "wangeditor";
import SERVER from "@/api/config";
import { getToken } from "@/utils/auth";
export default {
  name: "editor",
  props: {
    parentsContent: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      editorContent: this.parentsContent,
      editor: ""
    };
  },
  created() {},
  methods: {},
  mounted() {
    let url = SERVER.BASE_URL + "/file/upload?type=一般图片";
    var editor = new E(this.$refs.editor);
    this.editor = editor;
    editor.customConfig.onchange = html => {
      this.editorContent = html;
    };
    editor.customConfig.uploadImgHeaders = {
      Authorization: `Bearer ${getToken()}`
    };
    editor.customConfig.uploadImgServer = url;
    editor.customConfig.uploadFileName = "file";
    // 自定义提示方法
    editor.customConfig.customAlert = function(info) {
      // info 是需要提示的内容
      this.$message({
        type: "error",
        message: info
      });
    };

    // 监听函数
    editor.customConfig.uploadImgHooks = {
      before: function(xhr, editor, files) {
        console.log(files);
        let file = files[0];
        const isJPG = file.type === "image/jpeg" || file.type === "image/png";
        const isLt2M = file.size / 1024 < 800;
        if (!isJPG) {
          alert("上传头像图片只能是 JPG或PNG 格式!");
          return {
            prevent: true,
            msg: "放弃上传"
          };
        }
        if (!isLt2M) {
          alert("上传头像图片大小不能超过 800k!");
          return {
            prevent: true,
            msg: "放弃上传"
          };
        }
        // 图片上传之前触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
        // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
        // return {
        //     prevent: true,
        //     msg: '放弃上传'
        // }
      },
      success: function(xhr, editor, result) {
        // 图片上传并返回结果，图片插入成功之后触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
      },
      fail: function(xhr, editor, result) {
        // 图片上传并返回结果，但图片插入错误时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
      },
      error: function(xhr, editor) {
        // 图片上传出错时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
      },
      timeout: function(xhr, editor) {
        // 图片上传超时时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
      },

      // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
      // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
      customInsert: function(insertImg, result, editor) {
        // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
        // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

        // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
        if (result.success) {
          let url = SERVER.BASE_URL + "/file/get?id=" + result.result;
          insertImg(url);
        } else {
          this.$message({
            type: "error",
            message: result.errorInfos[0].msg
          });
        }
        // result 必须是一个 JSON 格式字符串！！！否则报错
      }
    };
    editor.create();
    editor.txt.html(this.parentsContent);
  }
};
</script>

<style scoped>
</style>
