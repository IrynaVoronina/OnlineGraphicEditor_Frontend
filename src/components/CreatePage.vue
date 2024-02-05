<template>
  <div class="page-container homePage-container">
    <h1 class="page-title">Create new image</h1>
    <br>
    <form @submit.prevent="createImage">
      <label for="name">Name:</label>
      <input type="text" v-model="name" required />
      
      <label for="format">Format:</label>
      <select v-model="format">
        <option value="bmp">bmp</option>
        <option value="png">png</option>
        <option value="jpg">jpg</option>
      </select>

      <button type="submit" class="page-button">Create</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      name: "",
      format: "",
    };
  },
  methods: {
      createImage() {
        axios.post("http://localhost:8080/image/create", {
        name: this.name,
        width: 800,
        height: 800,
        format: this.format,
      })
      .then(response => {
        this.$router.push("/image/" + response.data.id);
      })
      .catch(error => {
        console.error("Error creating image", error);
      });
    },
  },
};
</script>

