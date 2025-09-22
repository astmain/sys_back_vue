<template>
  <div>登陆</div>
  <el-button @click="test1()">test1-{{ BUS.count }}</el-button>
</template>

<script setup lang="ts">
import { BUS } from '../BUS';

function test1() {
  BUS.count++;
  console.log(BUS.count);
}
</script>

<style scoped></style>
