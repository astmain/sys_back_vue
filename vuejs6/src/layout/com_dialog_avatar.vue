<template>
  <div>
    <el-dialog v-model="show" title="编辑头像" width="780" draggable :close-on-click-modal="false" @closed="on_closed">
      <div class="flex gap-6">
        <!-- 左侧：裁剪区 -->
        <div class="border p-2">
          <img ref="img_ref" :src="url_img" alt="source" class="max-w-[480px] max-h-[480px]" style="display: block" />
        </div>

        <!-- 右侧：预览与信息 -->
        <div class="flex flex-col gap-4 items-center">
          <div ref="preview_ref" class="border rounded-full bg-white" :style="`width:${preview_size}px;height:${preview_size}px;overflow:hidden`"></div>
          <div class="text-sm text-gray-500">
            <div>图像大小：{{ preview_size }} × {{ preview_size }} 像素</div>
            <div>文件大小：{{ file_size_text }}</div>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button type="primary" @click="on_submit">确定</el-button>
        <el-button @click="show = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx">
import { ref, watch, nextTick } from "vue"
import Cropper from "cropperjs"
import "cropperjs/dist/cropper.css"
import { BUS } from "@/BUS"

type T_emit = {
  (e: "done", payload: { blob: Blob; base64: string; url: string }): void
}

const emit = defineEmits<T_emit>()

// 对外暴露
const show = ref(false)
const url_img = ref<string>("")
const preview_size = ref<number>(160)
const img_ref = ref<HTMLImageElement | null>(null)
const preview_ref = ref<HTMLDivElement | null>(null)
let cropper: InstanceType<typeof Cropper> | null = null

const file_size_text = ref<string>("—")
let object_url_to_revoke: string | null = null

function open() {
  show.value = true
}

function set_file(file: File) {
  if (object_url_to_revoke) URL.revokeObjectURL(object_url_to_revoke)
  const url = URL.createObjectURL(file)
  object_url_to_revoke = url
  url_img.value = url
  file_size_text.value = format_size(file.size)
  show.value = true
}

function init_cropper() {
  if (!img_ref.value) return
  cropper?.destroy()
  cropper = new Cropper(img_ref.value, {
    viewMode: 1,
    aspectRatio: 1,
    dragMode: "move",
    autoCropArea: 1,
    background: false,
    guides: false,
    movable: true,
    zoomable: true,
    rotatable: false,
    scalable: false,
    preview: preview_ref.value || undefined,
  })
}

function on_submit() {
  if (!cropper) return
  const size = preview_size.value
  const canvas = cropper.getCroppedCanvas({
    width: size,
    height: size,
    imageSmoothingEnabled: true,
    imageSmoothingQuality: "high",
  })
  canvas.toBlob(
    async (blob) => {
      if (!blob) return
      const base64 = canvas.toDataURL("image/png", 0.92)
      const url = URL.createObjectURL(blob)

      // 默认直接更新本地头像（也可以交给父组件处理上传）
      BUS.user.avatar = base64

      emit("done", { blob, base64, url })
      show.value = false
    },
    "image/png",
    0.92
  )
}

function on_closed() {
  cropper?.destroy()
  cropper = null
  if (object_url_to_revoke) {
    URL.revokeObjectURL(object_url_to_revoke)
    object_url_to_revoke = null
  }
}

watch(
  () => show.value,
  async (v) => {
    if (v) {
      await nextTick()
      init_cropper()
    }
  }
)

function format_size(n: number) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(2)} KB`
  return `${(n / 1024 / 1024).toFixed(2)} MB`
}

defineExpose({ open, set_file, show, url_img })
</script>

<style scoped>
/* 保持简洁，无阴影与动画 */
</style>
