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
        .get('http://localhost:5001/files')
        .then((response) => {
          this.uploadedFiles = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.fetchFiles();
  },
};
</script>
