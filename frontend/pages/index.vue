<template>
  <div class="file-uploader">
    <div class="file-picker">
      <h1 style="margin-bottom: 20px">Upload File Applications</h1>
      <div class="file-input">
        <input type="file" ref="fileInput" @change="handleFileSelected">
        <button class="upload-btn" @click="handleUpload" :disabled="isUploading">Upload</button>
      </div>
    </div>

    <file-list :uploadedFiles="uploadedFiles" />

    <v-snackbar
      v-model="snackbar"
      multi-line
      top
      right
      outlined
      :color="snackbarColor"
    >
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-progress-circular
          v-if="isUploading"
          color="blue-lighten-3"
          indeterminate
        >
        </v-progress-circular>
        <v-btn
          v-else
          :color="snackbarColor"
          v-bind="attrs"
          icon
          @click="hideMessage"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>


<script lang="ts">
import axios from 'axios';
import { Component, Vue } from 'vue-property-decorator';
import FileList from '~/components/FileList.vue';

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE2Nzg2MTE0NjUsImV4cCI6MTY4MTIwMzQ5NX0.ndrKyHcKmOY1_OBNLc_862BuLd8OiofaALkb1F_P-_I';

@Component({
  components: {FileList},
})

export default class Home extends Vue {
  uploadedFiles: Array<File> = [];
  isUploading: boolean = false;
  selectedFile: File | null = null;
  snackbar: boolean = false;
  snackbarColor: string = '';
  snackbarText: string = '';

  showMessage(text: string, type: string): void {
    this.snackbarText = text;
    this.snackbarColor = type;
    this.snackbar = true;
  }

  hideMessage(): void {
    this.snackbar = false;
    this.snackbarText = '';
    this.snackbarColor = '';
  }
  
  handleFileSelected(event: Event): void {
    if (!event.target) {
      console.error('Event target is null');
      return;
    }
    const input = event.target as HTMLInputElement;
    if (!input.files) {
      console.error('No file selected');
      return;
    }

    this.selectedFile = input.files[0];
  }
  
  handleUpload(): void {
    if (!this.selectedFile) {
      this.showMessage('Please select a file', 'warning');
      return;
    }

    // Check if selectedFile is null before using it
    if (this.selectedFile !== null && !this.isUploading) {
      this.isUploading = true;
      this.showMessage('File uploading', 'info');
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      axios
        .post(`${process.env.NUXT_ENV_API_ENDPOINT_URL}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${TOKEN}`
          },
        })
        .then((response: any) => {
          const newFile = response.data.file;
          this.uploadedFiles.push(newFile);
          this.selectedFile = null;
          Vue.set(this.uploadedFiles, this.uploadedFiles.length - 1, newFile);
          this.showMessage('Upload file success', 'success');
          // @ts-ignore
          this.$refs.fileInput.value = null;
        })
        .catch((error: any) => {
          this.showMessage('Upload file error', 'error');
          console.log(error);
        }).finally(() => {
          this.isUploading = false
        });
    }
  }

  fetchFiles(): void {
    axios
      .get(`${process.env.NUXT_ENV_API_ENDPOINT_URL}/files`, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        }
      })
      .then((response: any) => {
        this.uploadedFiles = response.data.files;
      })
      .catch((error: any) => {
        console.log(error);
      })
  }
  
  mounted(): void {
    this.fetchFiles();
  }
}
</script>

<style scoped>
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
</style>
