<template>
    <v-card class="mb-4">
        <v-card-title>Usuarios Registrados</v-card-title>
        <v-card-text>
            <v-list>
                <v-list-item v-for="user in users" :key="user.id">
                    <v-list-item-title>{{ user.username }} ({{ user.email }})</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-card-text>
  </v-card>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const users = ref([]);

onMounted(async () => {
    const res = await fetch('http://localhost:3002/api/users');
    const data = await res.json();
    users.value = data.users;
});
</script>