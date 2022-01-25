<template>
  <Upload
    v-model:multiple="options.multiple"
    v-model:accept="options.accept"
    v-model:acceptName="options.acceptName"
    v-model:filesList="options.filesList"
    v-model:limit="options.limit"
    @setFiles="getFiles($event)"
  ></Upload>
</template>

<script setup>
import Upload from '@/components/Upload/index.vue'
import { defineProps, defineEmits, toRefs, reactive } from 'vue'
const state = reactive({
  options: {
    multiple: false,
    accept: ['png', 'jpg', 'jpeg', 'gif'],
    acceptName: '图片',
    limit: 2,
    filesList: []
  }
})
const getFiles = (files) => {
  state.options.filesList.push(files)
}
const { options } = toRefs(state)
</script>
