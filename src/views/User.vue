<script setup lang="ts">

</script>

<template>
  <div class="user">
    <div class="head">
      <img class="logo" src="../assets/lime.png" />
      <div class="info">
        <div class="name">青柠记账</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user {
  min-height: 100%;
  background-color: #f5f5f5;
  padding: 12px;
}

.head {
  display: flex;
  background: linear-gradient(315deg, #7fcea4 0%, #39be77 100%);
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 12px;
}

.head .logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid #fff;
  margin-right: 10px;
}

.head .info .name {
  font-size: 18px;
  color: #fff;
  font-weight: 500;
}
</style>
