<template>
    <div class="page-container homePage-container">
      <h1 class="page-title">Error Page</h1>
      <p class="errorMessage">!! {{ message }} !!</p>
      <br>
      <!--<button v-if="imageId !== undefined" 
        @click="returnToImage" class="page-button">
        Повернутись до зображення</button>-->
  </div>
</template>

<style>
@import "../components/styles/error.css"; 
</style>

<script>
export default {
    data() {
      return {
        message: "",
        imageId: null,
      };
    },
    mounted() {
      this.message = this.$route.query.message;
      console.log(this.imageId)
      this.imageId = this.$route.query.imageId;
      console.log("--",this.imageId)
    },
    methods:{
      returnToImage(){
        this.$router.push("/image/" + this.imageId);
      }
    }
}
</script>