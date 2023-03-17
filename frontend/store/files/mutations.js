export default {
  setFileList(state, fileList) {
    state.fileList = fileList
  },
  addNewFile(state, newFile) {
    state.fileList = [...state.fileList, newFile]
  }
}