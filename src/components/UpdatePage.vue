<template>
  <div class="page-container homePage-container">
    <h1 class="page-title">Update</h1>
    
    <input type="file" @change="handleFileChange" />
    <button @click="uploadFile" class="page-button">Upload File</button>
  
  </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
    return {
      selectedFile: null
    };
  },
    methods: {
    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
      
    },
    uploadFile() {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      const fullName = this.selectedFile.name;
      const parts = fullName.split(".");
      const name = parts[0];
      const format = parts[1];
      //formData.append('name', name);
      //formData.append('format', format);

      //formData.append('location', this.selectedFile.webkitRelativePath); // неможливо через заходи безпеки
 //
      
      axios.post('http://localhost:8080/image/upload', formData)
        .then(response => {
            this.$router.push("/image/" + response.data.id);

        })
        .catch(error => {
          const exceptionResponse = error.response.data;
          console.error('error:', exceptionResponse.errorMessage); 
          this.$router.push({
            path: '/errorPage',
            query: { message: exceptionResponse.errorMessage,
                           imageId: undefined}
          });
        });
    },   
  },
};
</script>

