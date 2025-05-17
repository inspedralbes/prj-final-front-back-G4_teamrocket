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

const statsMods = ref([]);

onMounted(async () => {
  statsMods.value = await fetch('http://localhost:3002/api/stats/stats-mods').then(res => res.json());

  console.log(statsMods.value);
});
</script>