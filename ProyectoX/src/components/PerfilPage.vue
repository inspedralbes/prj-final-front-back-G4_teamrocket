<template>
  <v-container>
    <!-- Perfil del usuario -->
    <v-card class="mx-auto my-5" max-width="400">
      <v-card-title>
        <v-avatar class="mr-3" size="64">
          <v-img :src="user.avatar"></v-img>
        </v-avatar>
        <div>
          <h3>{{ user.username }}</h3>
          <p class="text-subtitle-2">{{ user.email }}</p>
        </div>
      </v-card-title>
    </v-card>

    <!-- Lista de Mods -->
    <v-card class="mx-auto" max-width="800">
      <v-card-title>Mis Mods</v-card-title>
      <v-divider></v-divider>
      <v-list>
        <v-list-item v-for="mod in user.mods" :key="mod.id">
          <v-list-item-content>
            <v-list-item-title>{{ mod.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ mod.description }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon v-if="isPublic = !isPublic">
              <v-icon> {{ isPublic ? mdi-earth : mdi-lock }}</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { loadUserData } from "../services/communicationManager.js";

const user = ref({});
const isPublic = ref(true);
const userEmail = ref(localStorage.getItem('userEmail'));

const fetchUser = async () => {
  const response = await loadUserData(userEmail.value);

  if (!response.ok) throw new Error('Error en la respuesta del servidor');

  user.value = await response.json();

  console.log(user);
}

onMounted(fetchUser);
</script>