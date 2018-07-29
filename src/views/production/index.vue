<template>
  <div class="app-container">
      <el-row type="flex" justify="end">
            <el-col style="width:300px;margin-bottom:10px;">
                <el-input placeholder="请输入产品名称"   class="input-with-select" size='mini'>
                    <el-button slot="append" icon="el-icon-search" ></el-button>
                </el-input>
            </el-col>
        </el-row>
      <el-row type="flex" justify="start">
            <el-col>
                <el-button size="mini" type="primary" plain>新增产品</el-button>
                <el-button size="mini" type="success" plain>修改产品</el-button>
                <el-button size="mini" type="info" plain>删除产品</el-button>
                <el-button size="mini" type="danger" plain>预览</el-button>
                <el-button size="mini" type="primary" plain>新增类别</el-button>
            </el-col>
        </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
     
    }
  },
  methods: {
   
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

