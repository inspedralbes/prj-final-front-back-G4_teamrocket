<template>
  <v-card class="mb-4">
    <v-card-title>Mods Subidos</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item v-for="mod in mods" :key="mod.id">
          <v-list-item-title>{{ mod.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const mods = ref({});

// onMounted(async () => {
//   const res = await fetch('http://localhost:3002/api/mods');
//   mods.value = await res.json();
// });
</script>