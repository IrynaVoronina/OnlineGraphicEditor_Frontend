<template>
    <div>
      <button @click="goToHomePage">Home Page</button>
    </div>
  </template>

<style>
@import '../components/styles/default.css';
</style>
 
  <script>
  export default {
    methods: {
      goToHomePage() {
        this.$router.push('/');
      },
    }
  }
  </script>