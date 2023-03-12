<template>
  <div>
    <h1 class="text-3xl font-bold mb-4">Upload File</h1>
    <input type="file" ref="fileInput" @change="uploadFile" accept=".pdf">
    <div class="mt-4" v-if="uploadedFiles.length > 0">
      <h2 class="text-2xl font-bold mb-4">Uploaded Files</h2>
      <ul>
        <li v-for="file in uploadedFiles" :key="file">{{ file }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNjc4NjA1Mzg0LCJleHAiOjE2Nzg2MDkwMTR9.uxwUk60nuOgMGvzZuIC5v0S19-YKKFnxOPKRC2YAhYE';

export default {
  name: 'Home',
  data() {
    return {
      uploadedFiles: [],
    };
  },
  methods: {
    uploadFile() {
      const formData = new FormData();
      const file = this.$refs.fileInput.files[0];
      formData.append('file', file);
      axios
        .post('http://localhost:5001/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${TOKEN}`
          },
        })
        .then((response) => {
          console.log(response.data);
          this.uploadedFiles.push(file.name);
          this.$refs.fileInput.value = '';
          alert('File uploaded successfully');
        })
        .catch((error) => {
          console.log(error);
          alert('Failed to upload file');
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
          this.uploadedFiles = response.data.files;
        })
        .catch((error) => {
          console.log(error);
        })
    },
  },
  mounted() {
    this.fetchFiles();
  },
};
</script>
