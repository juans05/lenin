<template>
  <div class="container-loader">
    <div class="loader">
      <img
        class="loader-image"
        src="../assets/images/colorLogoApp.png"
        alt="Loader"
      />
      <div class="loader-circle"></div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.loader {
  position: relative;
  width: 150px;
  height: 150px;
  .loader-circle {
    position: absolute;
    top: 0;
    left: 0;
    margin-top: -30px;
    width: 100%;
    height: 100%;
    border: 4px solid rgb(213, 223, 255);
    border-top-color: #07166A;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
