<template>
  <div class="file-list">
    <table>
      <thead>
        <tr>
          <th>File Name</th>
          <th>File Size</th>
          <th>File Type</th>
          <th>Created Date</th>
        </tr>
      </thead>
      <tbody v-if="files.length > 0">
        <tr
          v-for="(file, index) in files"
          :key="`${file.name}-${index}`"
        >
          <td>{{ file.name }}</td>
          <td>{{ getFileSize(file.size) }}</td>
          <td>{{ getFileType(file.name) }}</td>
          <td>{{ getFileCreatedDate(file.lastModified) }}</td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="12">
            <h2 style="text-align: center">No file uploaded!</h2>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import path from 'path';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  props: {
    uploadedFiles: Array,
  }
})

export default class FileList extends Vue {
  files: Array<File> = [];

  created() {
    const props = this.$props
    if (props?.uploadedFiles?.length) {
      this.files = [...props.uploadedFiles];
    }
  }

  getFileSize(size: number): string {
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    const fileSize = parseFloat((size / Math.pow(k, i)).toFixed(2));
    return `${fileSize} ${sizes[i]}`;
  }
  
  getFileType(filename: string): string {
    return path.extname(filename).substring(1).toUpperCase();
  }
  
  getFileCreatedDate(lastModified: number) {
    const date = new Date(lastModified);
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'
    ];
    const year = date.getFullYear();
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    return `${month} ${day}, ${year}`;
  }
};
</script>

<style scoped>
.file-list {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
}

.file-list h2 {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
}

.file-list table {
  border-collapse: collapse;
  margin-top: 20px;
  width: 100%;
}

.file-list table th,
.file-list table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}

.file-list table th {
  font-size: 18px;
  font-weight: bold;
}

.file-list table td {
  font-size: 16px;
}
</style>
