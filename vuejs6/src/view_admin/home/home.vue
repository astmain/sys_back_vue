<template>
  <div>首页</div>
  <el-button @click="handle_click">点击</el-button>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { ElMessage } from "element-plus"
// import { ApiProperty } from "@nestjs/swagger"
// import { IsString } from "class-validator"

// class Home_Dto {
//   @ApiProperty({ description: "用户名", example: "张三" })
//   @IsString()
//   name!: string
// }

// const data = ref<Home_Dto>({
//   name: "",
// })

function handle_click() {
  // data.value.name = "张三"
  // console.log(data.value)
}
</script>

<style scoped></style>
