<template>
  <v-card class="mb-4">
    <v-card-title>Estadísticas</v-card-title>
    <v-card-text>
      <p>Total de usuarios: {{ userCount }}</p>
      <p>Total de mods: {{ modCount }}</p>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const userCount = ref(0);
const modCount = ref(0);

// onMounted(async () => {
//   const users = await fetch('http://localhost:3002/api/users').then(res => res.json());
//   const mods = await fetch('http://localhost:3002/api/mods').then(res => res.json());
//   userCount.value = users.length;
//   modCount.value = mods.length;
// });
</script>