<template>
  <div>
    <el-dialog v-model="show" :title="title" width="800px" draggable :close-on-click-modal="false">
      <div>id: {{ form.id }}</div>
      <div>parent_id: {{ form.parent_id }}</div>

      <el-form label-width="100px">
        <nav class="flex">
          <el-form-item label="字典名称">
            <el-input v-model="form.name" style="width: 280px"></el-input>
          </el-form-item>
          <el-form-item label="字典编码">
            <el-input v-model="form.code" style="width: 280px"></el-input>
          </el-form-item>
        </nav>
        <nav class="flex">
          <el-form-item label="排序" width="300">
            <el-input v-model="form.sort" style="width: 280px" type="number"></el-input>
          </el-form-item>
          <el-form-item label="状态" width="300">
            <el-select v-model="form.status" style="width: 280px">
              <el-option label="启动" :value="true" />
              <el-option label="禁用" :value="false" />
            </el-select>
          </el-form-item>
        </nav>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="6"></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submit"> Confirm </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx">
import { ref, onMounted } from "vue"
import { api } from "@/api"
import { ElMessage } from "element-plus"
import { id } from "zod/v4/locales"

const show = ref(false)
const title = ref("")
let callback = ref(async () => {}) //回调函数
const form = ref({ id: "", parent_id: "", name: "", code: "", status: true, remark: "", sort: 0 })

async function submit() {
  callback.value()
  show.value = false
}

function form_reset() {
  form.value = { id: "", parent_id: "", name: "", code: "", status: true, remark: "", sort: 0 }
}

defineExpose({ show, title, open, submit, form, form_reset, callback })
</script>
