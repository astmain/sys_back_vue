<template>
  <!-- 多选 -->
  <div>多选框dialog例子</div>
  <!-- 我希望点击el-select时，弹出弹窗 -->
  <el-select style="width: 1000px" @visible-change="handleVisibleChange" v-model="option_value" placeholder="Select" clearable multiple>
    <template #label="{ label }">
      <span>{{ label }}: </span>
    </template>
  </el-select>

  <!-- 弹窗 -->
  <el-dialog v-model="dialogTableVisible" title="Shipping address" width="800">
    <button @click="addOption">添加</button>
  </el-dialog>
</template>
<script>
//自定义

export default {
  data() {
    return {
      dialogTableVisible: false,
      option_value: ['Option1'],
    };
  },
  methods: {
    handleVisibleChange(visible) {
      if (visible) {
        // 当下拉框打开时，同时打开弹窗
        this.dialogTableVisible = true;
      }
    },

    addOption() {
      this.option_value.push('Option' + Date.now());
    },
  }, ////

  async mounted() {}, ////
};
</script>

<style scoped></style>
