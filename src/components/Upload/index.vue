<template>
  <div>
    <el-upload
      action=""
      :on-change="handleFileChange"
      :auto-upload="false"
      :show-file-list="false"
      :on-exceed="handleExceed"
      :multiple="multiple"
      :limit="limit"
      :file-list="fileList"
    >
      <el-button size="mini" plain type="primary">
        选择文件
      </el-button>
    </el-upload>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, reactive, computed, toRefs, ref, onMounted, watch } from 'vue'
import { postUploadFile, mergeUploadFile } from '@/api/dataTransmit'
import { ElMessage } from 'element-plus'
import SparkMD5 from 'spark-md5'
const chunkSize = 5 * 1024 * 1024
/**
 * @description: 生成文件hash
 * @param {*}
 * @return {*}
 */
const createMD5 = (fileChunkList) => {
  return new Promise((resolve, reject) => {
    const slice =
      File.prototype.slice ||
      File.prototype.mozSlice ||
      File.prototype.webkitSlice
    const chunks = fileChunkList.length
    let currentChunk = 0
    const spark = new SparkMD5.ArrayBuffer()
    const fileReader = new FileReader()
    fileReader.onload = function (e) {
      spark.append(e.target.result)
      currentChunk++
      if (currentChunk < chunks) {
        loadChunk()
      } else {
        resolve(spark.end())
      }
    }

    fileReader.onerror = function (e) {
      reject(e)
    }

    function loadChunk() {
      fileReader.readAsArrayBuffer(fileChunkList[currentChunk])
    }

    loadChunk()
  })
}

const currentFile = ref(null)
const chunkFormData = ref([])
const fileHash = ref(null)
const percentage = computed(() => {
  if (!chunkFormData.value.length) return 0
  const uploaded = chunkFormData.value.filter((item) => item.percentage).length
  return Number(((uploaded / chunkFormData.value.length) * 100).toFixed(2))
})

const props = defineProps({
  multiple: Boolean,
  accept: Array,
  acceptName: String,
  limit: Number,
  filesList: []
})

const emit = defineEmits(['close', 'refresh'])
const state = reactive({
  fileList: []
})

watch(
  () => props.filesList,
  (newVal, oldVal) => {
    state.fileList = newVal
  },
  {
    deep: true
  }
)

const handleExceed = (files, fileList) => {
  ElMessage({
    type: 'error',
    message: `只能选择${props.limit}个文件进行上传`
  })
}

const handleBeforeUpload = (file) => {
  if (props.limit > props.filesList.length) {
    const type = file.name.split('.')[1].toLowerCase()
    const isType = props.accept.includes(type)
    if (!isType) {
      ElMessage.error(`请上传${props.acceptName}`)
    }
    return isType
  } else {
    ElMessage({
      type: 'error',
      message: `该类目下只能上传${props.limit}个文件`
    })
    return false
  }
}

/**
 * @description: 创建文件分片
 * @param {*}
 * @return {*}
 */
const createChunkList = (file, chunkSize) => {
  const fileChunkList = []
  let cur = 0
  while (cur < file.size) {
    fileChunkList.push(file.slice(cur, cur + chunkSize))
    cur += chunkSize
  }
  return fileChunkList
}
/**
 * @description: 选择文件事件
 * @param {*}
 * @return {*}
 */
const handleFileChange = async (file) => {
  if (!handleBeforeUpload(file)) return
  currentFile.value = file
  handleUploadFile()
}

/**
 * @description: 分片上传回调
 * @param {*}
 * @return {*}
 */
const uploadProgress = (item) => {
  return (e) => {
    item.percentage = parseInt(String((e.loaded / e.total) * 100))
  }
}
/**
 * @description: 断点续传
 * @param {*}
 * @return {*}
 */
const continueUpload = () => {
  const notUploaded = chunkFormData.value.filter((item) => !item.percentage)
  Promise.all(
    notUploaded.map((data) => {
      return new Promise((resolve, reject) => {
        postUploadFile(
          data.formData,
          uploadProgress(data)
        )
          .then((data) => {
            resolve(data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    })
  ).then((data) => {
    if (!data.includes(undefined)) {
      mergeUploadFile({
        basePath: `13D1EEA876F89002/108D26728DAAFD1`,
        mergeFiles: [{
          identifier: fileHash.value,
          fileName: currentFile.value.name
        }]
      }).then(res => {
        state.fileList = res
        emit('setFiles', state.fileList[0])
        ElMessage({
          type: 'success',
          message: `上传成功`
        })
      })
    }
  })
}
/**
 * @description: 文件上传
 * @param {*}
 * @return {*}
 */
const handleUploadFile = async () => {
  // 文件分片
  const fileChunkList = createChunkList(currentFile.value.raw, chunkSize)
  // 文件hash
  // let fileHash = await MultiThreadCreateMD5(currentFile.value.raw, chunkSize)
  fileHash.value = await createMD5(fileChunkList, chunkSize)
  const chunkList = fileChunkList.map((file, index) => {
    return {
      file: file,
      identifier: fileHash.value
    }
  })
  chunkFormData.value = chunkList.map((chunk, index) => {
    const formData = new FormData()
    formData.append('files', chunk.file)
    formData.append('chunkNumber', index + 1)
    formData.append('basePath', `13D1EEA876F89002/108D26728DAAFD1`)
    formData.append('identifier', chunk.identifier)
    return {
      formData: formData,
      percentage: 0
    }
  })

  continueUpload()
}

const { fileList } = toRefs(state)
</script>
