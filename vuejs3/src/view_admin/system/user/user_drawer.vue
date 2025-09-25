<template>
  <ElDrawer ref="drawer" v-model="drawer_show" :title="drawer_title" size="500px" destroy-on-close>
    <el-form label-width="60px" label-position="left">
      <el-form-item label="头像">
        <img :src="drawer_data.avatar" alt="" class="w-20 h-20" />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="drawer_data.name" />
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="drawer_data.phone" />
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="drawer_data.gender" fill="#006eff">
          <el-radio-button label="男" value="男" />
          <el-radio-button label="女" value="女" />
          <el-radio-button label="未知" value="未知" />
        </el-radio-group>
      </el-form-item>

      <el-form-item label="备注">
        <el-input type="textarea" v-model="drawer_data.remark" :rows="3" />
      </el-form-item>

      <el-form-item label="部门树">
        <!-- <el-tree :data="BUS.depart_tree" node-key="id" :props="{ label: 'name' }" :default-expand-all="true" show-checkbox check-strictly :default-checked-keys="depart_menu_ids" /> -->
        <el-tree :data="BUS.depart_tree" node-key="id" :props="{ label: 'name' }" :default-expand-all="true" show-checkbox :default-checked-keys="depart_role_ids" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button type="primary" @click="">确定</el-button>
    </template>
  </ElDrawer>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { BUS } from "@/BUS"
import { api } from "@/api"
import { ElMessage } from "element-plus"
let drawer_show = ref(false)
let drawer_title = ref("")
let drawer_data = ref({} as any)
let depart_role_ids = ref([])


// 打开交互窗口
async function open(data: any) {
  drawer_data.value = data
  console.log("drawer_data.value", drawer_data.value)
  drawer_show.value = true
  let res: any = await api.user.find_one_user({ id: drawer_data.value.id })
  if (res.code != 200) return ElMessage.error(res.msg) //前置判断
  console.log("res", res)
  depart_role_ids.value = res.result.depart_role_ids
}

defineExpose({
  open,
})
</script>

<style scoped></style>
