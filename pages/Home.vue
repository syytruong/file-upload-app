<template>
  <div class="file-uploader">
    <div class="file-picker">
      <h1 style="margin-bottom: 20px">Upload File Applications</h1>
      <div class="file-input">
        <input type="file" ref="fileInput" @change="handleFileSelected">
        <button class="upload-btn" @click="handleUpload" :disabled="isUploading">Upload</button>
      </div>
    </div>
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
        <tbody v-if="uploadedFiles.length > 0">
          <tr v-for="file in uploadedFiles" :key="file.name">
            <td>{{ file.name }}</td>
            <td>{{ getFileSize(file.size) }}</td>
            <td>{{ getFileType(file.name) }}</td>
            <td>{{ getFileCreatedDate(file.createdDate) }}</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="12">
              <h2 style="text-align: center;">No file uploaded!</h2>
            </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import path from 'path';

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE2Nzg2MTE0NjUsImV4cCI6MTY4MTIwMzQ5NX0.ndrKyHcKmOY1_OBNLc_862BuLd8OiofaALkb1F_P-_I';

export default {
  name: 'Home',
  data() {
    return {
      uploadedFiles: [],
      selectedFile: null,
      isUploading: false,
    };
  },
  methods: {
    handleFileSelected(event) {
      console.log("WHAT ??", event.target.files[0])
      this.selectedFile = event.target.files[0];
    },
    handleUpload() {
      if (!this.selectedFile) {
        alert('Please select a file');
        return;
      }
      if (this.isUploading) {
        return;
      }

      this.isUploading = true;
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.isUploading = true;
      axios
        .post('http://localhost:5001/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${TOKEN}`
          },
        })
        .then((response) => {
          this.uploadedFiles.push(response.data.file);
          this.selectedFile = null;
        })
        .catch((error) => {
          console.log(error);
        }).finally(() => {
          this.isUploading = false
        });
    },
    fetchFiles() {
      axios
        .get('http://localhost:5001/files', {
          headers: {
            'Authorization': `Bearer ${TOKEN}`
          }
        })
        .then((response) => {
          console.log(response.data)
          this.uploadedFiles = response.data.files;
        })
        .catch((error) => {
          console.log(error);
        })
    },
    getFileSize(size) {
      if (size === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const i = Math.floor(Math.log(size) / Math.log(k));
      const fileSize = parseFloat((size / Math.pow(k, i)).toFixed(2));
      return `${fileSize} ${sizes[i]}`;
    },
    getFileType(filename) {
      return path.extname(filename).substring(1).toUpperCase();
    },
    getFileCreatedDate(createdDate) {
      const date = new Date(createdDate);
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
      ];
      const year = date.getFullYear();
      const month = monthNames[date.getMonth()];
      const day = date.getDate();
      return `${month} ${day}, ${year}`;
    }
  },
  mounted() {
    this.fetchFiles();
  },
};
</script>

<style>
  .file-uploader {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
    width: 100%;
    margin-top: 0;
    margin-bottom: auto;
  }

.file-picker {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 10%;
  margin-bottom: 30px;
  width: 100%;
}

.file-picker h1 {
  font-size: 36px;
  font-weight: bold;
}

.file-input {
  display: flex;
  align-items: center;
  gap: 10px;
}

.file-input input[type="file"] {
  margin-right: 10px;
  font-size: 16px;
  padding: 10px;
  width: 300px;
  border: 2px solid #ccc;
  border-radius: 10px;
}

.file-input .upload-btn {
  background-color: #008CBA;
  border: none;
  color: white;
  font-size: 18px;
  font-weight: bold;
  border-radius: 10px;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.file-input .upload-btn:hover {
  background-color: #0077B3;
}

.file-input .upload-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

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
