<template>
  <v-container>
    <h1>Panel de Administración</h1>
    <UsersAdmin />
    <ModsAdmin />
    <StatisticsAdmin />
  </v-container>
</template>

<script setup>
import UsersAdmin from './UsersAdmin.vue'
import ModsAdmin from './ModsAdmin.vue'
import StatisticsAdmin from './StatisticsAdmin.vue'
</script>