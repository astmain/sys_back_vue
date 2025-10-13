<template>
  <el-button @click="test1">测试1</el-button>

  <!-- <input class="file_input" type="file" @change="on_change_file" accept=".stl,.png" style="display: none" /> -->
  <input class="file_input" id="file_input" type="file" @change="on_change_file" />
</template>

<script setup lang="tsx">
function test1() {
  document.querySelector<HTMLInputElement>(".file_input")?.click()
  // document.getElementById("file_input")?.click()
}

function on_change_file(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  console.log("on_change_file---file", file)
}
</script>
<style></style>
