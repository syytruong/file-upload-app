<template>
  <div>
    <h1>Upload file</h1>
    <div>
      <input type="file" ref="fileInput" @change="onFileSelected">
      <button @click="uploadFile">Upload</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      file: null,
      uploadedFiles: []
    };
  },
  methods: {
    onFileSelected(event) {
      this.file = event.target.files[0];
    },
    uploadFile() {
      const formData = new FormData();
      formData.append('file', this.file);
      axios.post('http://localhost:5001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        console.log(response.data);
        this.uploadedFiles.push(file);
        this.$refs.fileInput.value = '';
        alert('File uploaded successfully');
      })
      .catch(error => {
        console.log(error);
        alert('Failed to upload file');
      });
    }
  }
};
</script>
