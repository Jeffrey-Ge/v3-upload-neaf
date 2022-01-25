import request from '@/utils/request'

// 上传文件分片
export function postUploadFile(data) {
  return request({
    url: '/api/gov/file/upload-chunk',
    method: 'post',
    data
  })
}

// 合并文件分片
export function mergeUploadFile(data) {
  return request({
    url: '/api/gov/file/merge-chunks',
    method: 'post',
    data
  })
}
