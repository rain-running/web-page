<template>
    <div>
      <h1>{{ title }}</h1>
      <p>{{ content }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HomePage',
    data() {
      return {
        title: 'Welcome to my website!',
        content: 'This is the home page.'
      }
    }
  }
  </script>