<template>
  <div>
    <el-button @click="test1()">test1</el-button>
    <div class="markdown" v-html="html_str"></div>
  </div>
</template>

<script setup lang="tsx">
import { ref, onMounted } from "vue"
import { ElMessage } from "element-plus"
import { marked } from "marked"

let html_str = ref()

async function test1() {
  try {
    // 注意：路径基于 public 目录，所以直接从根路径访问
    const response = await fetch("/doc1.md")
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const str = await response.text()
    // 使用 marked 将 Markdown 转为 HTML
    html_str.value = marked.parse(str)
    console.log("成功:html_str", html_str.value)
  } catch (error) {
    html_str.value = "<p>加载文档失败。</p>"
    console.error("html_str", error)
    console.error("失败:html_str", html_str.value)
  }
}
onMounted(() => {
  test1()
})
</script>

<style>
/* 可选：引入 GitHub 风格的 Markdown 样式 */
.markdown {
  /* font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; */
  font-family: Consolas;
  line-height: 1.6;
  color: #333;
}

.markdown h1,
.markdown h2,
.markdown h3 {
  color: #24292e !important;
  border-bottom: 1px solid #a7a7a7 !important;
}

.markdown pre {
  background-color: #dfdede !important;
  padding: 12px !important;
  border-radius: 6px !important;
  overflow: auto !important;
  /* margin: 1em 0 !important; */
}

.markdown code {
  background: none !important;
  padding: 0 !important;
  margin: 0 !important;
  font-family: Consolas !important;
}
.markdown ul li {
  margin-left: 10px !important;
}
</style>
