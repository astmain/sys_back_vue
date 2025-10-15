<template>
  <div>
    <el-dialog v-model="show" title="编辑头像" width="650" draggable :close-on-click-modal="false">
      <div>图片编辑裁剪大小尺寸 {{ url_img }}</div>
      <el-button class="btn" @click="on_rotate_left">左旋转</el-button>
      <el-button class="btn" @click="on_rotate_right">右旋转</el-button>
      <div class="flex justify-between">
        <nav style="width: 200px; height: 200px">
          <vue-cropper
            ref="cropper_ref"
            :img="option.img"
            :output-size="option.size"
            :output-type="option.output_type"
            :info="true"
            :full="option.full"
            :fixed="fixed"
            :fixed-number="fixed_number"
            :can-move="option.can_move"
            :can-move-box="option.can_move_box"
            :fixed-box="option.fixed_box"
            :original="option.original"
            :auto-crop="option.auto_crop"
            :auto-crop-width="option.auto_crop_width"
            :auto-crop-height="option.auto_crop_height"
            :center-box="option.center_box"
            :high="option.high"
            :max-img-size="option.max_img_size"
            mode="contain"
            @real-time="on_real_time"
            @img-load="on_img_load"
          />
        </nav>
        <nav>
          <div>图片编辑后的预览图</div>
          <div :style="{ width: previews.w + 'px', height: previews.h + 'px', overflow: 'hidden', margin: '5px' }">
            <div :style="previews.div">
              <img :src="previews.url" :style="previews.img" />
            </div>
          </div>
        </nav>
      </div>

      <template #footer>
        <el-button type="primary" @click="() => (show = false)">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx">
import { ref, reactive } from "vue"
import { BUS } from "@/BUS"
import { util_sdk_oss_upload } from "@/plugins/util_sdk_oss_upload"

let show = ref(false)
let url_img = ref("111")

// 预览
const cropper_ref = ref<any>(null)
const previews = ref<any>({}) //预览视图
const fixed = ref<boolean>(false) //固定
const fixed_number = ref<[number, number]>([1, 1]) //正方形比例
const option = reactive({
  img: "https://cdn.jsdelivr.net/gh/astmain/filestore@master/avatar_default.png",
  auto_crop_width: 200,
  auto_crop_height: 200,
  size: 1,
  full: false,
  output_type: "png",
  can_move: true,
  fixed_box: false,
  original: false,
  can_move_box: true,
  auto_crop: true,
  center_box: true,
  high: true,
  max_img_size: 99999,
})

function on_real_time(data: any) {
  previews.value = data
}

function on_img_load(msg: any) {
  console.log("img load", msg)
}
function on_rotate_left() {
  cropper_ref.value?.rotateLeft()
}
function on_rotate_right() {
  cropper_ref.value?.rotateRight()
}
function open() {
  show.value = true
}

async function submit() {
  show.value = true

  //
  console.log(`111---previews:`, previews)
  console.log(`111---previews:`, previews.value.url) //blob:http://127.0.0.1:8080/e14fd2d2-0215-4488-a2c2-d4a4d0b86351"
  // 如何将 previews.value.url 转成 类似input 上传文件 event.target.files 中的file
  const file = await url_to_file(previews.value.url)
  console.log(`111---file:`, file)

  util_sdk_oss_upload({
    file,
    path_static: "/public/0/我的头像",
    callback: (res: any) => {
      console.log(res)
    },
  })

  async function url_to_file(url: string, name = "avatar.png") {
    const res = await fetch(url)
    const blob = await res.blob()
    return new File([blob], name, { type: blob.type || "image/png" })
  }
}

// 暴露方法给父组件调用
defineExpose({ show, open, submit, url_img })
</script>

<style></style>
