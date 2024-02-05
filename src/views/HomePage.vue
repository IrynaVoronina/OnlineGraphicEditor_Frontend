<template>
  <div class="page-container homePage-container">
    <h1 class="page-title">Home Page</h1>
    <button @click="goToCreatePage" class="page-button">Create</button>
    <button @click="goToUpdatePage" class="page-button">Update</button>
</div>
</template>

<script>
export default {
  methods: {
    goToCreatePage() {
      this.$router.push('/create');
    },
    goToUpdatePage() {
      this.$router.push('/update');
    }
  }
}
</script>
