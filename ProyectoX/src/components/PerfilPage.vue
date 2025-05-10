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
            <v-btn icon @click="openEditDialog(mod)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="updateVisible(mod)">
              <v-icon>{{ mod.visible ? 'mdi-earth' : 'mdi-lock' }}</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-dialog v-model="dialog" max-width="600">
        <v-card>
          <v-card-title>Subir Mod</v-card-title>
          <v-card-text>
              <v-text-field v-model="editMod.title" label="Título del Mod" />
              <v-textarea v-model="editMod.description" label="Descripción" />
              <v-file-input v-model="editMod.modFile" label="Archivo del Mod" />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="dialog = false">Cancelar</v-btn>
            <v-btn color="primary" :loading="loading" :disabled="!userEmail" @click="updateMod">Actualizar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        timeout="3000"
      >
      {{ snackbar.text }}
      </v-snackbar>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { loadUserData, putMod, putVisible } from "../services/communicationManager.js";

const user = ref({ mods: [] });
const dialog = ref(false);
const loading = ref(false);
let data;
const userEmail = ref(localStorage.getItem('userEmail'));
const editMod = ref({
  modId: 0,
  title: '',
  description: '',
  modFile: null
});
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
});

const fetchUser = async () => {
  const response = await loadUserData(userEmail.value);
  if (!response.ok) throw new Error('Error en la respuesta del servidor');

  const data = await response.json();

  user.value = data;

  console.log(user.value);
}

const openEditDialog = (mod) => {
  editMod.value.modId = mod.id;
  editMod.value.title = mod.title;
  editMod.value.description = mod.description;
  editMod.value.modFile = null;
  dialog.value = true;
};

const updateVisible = async (mod) => {
  mod.visible = !mod.visible;

  console.log(mod.visible);

  try {
    const response = await putVisible(mod.id, mod.visible);

    if(!response.ok) {
      data = await response.json();
      snackbar.value = {
        show: true,
        text: data.error,
        color: 'error'
      };
      
      return;
    }

    data = await response.json();

    snackbar.value = {
      show: true,
      text: data.message,
      color: 'success'
    };
  } catch (error) {
    console.error(error);
  }
}

const updateMod = async () => {
  loading.value = true;

  const formData = new FormData();
  formData.append('id', editMod.value.modId);
  formData.append('title', editMod.value.title);
  formData.append('description', editMod.value.description);
  if (editMod.value.modFile) {
    formData.append('modFile', editMod.value.modFile);
  }

  try {
    const response = await putMod(formData);

    if (!response.ok) {
      data = await response.json();
      snackbar.value = {
        show: true,
        text: data.error,
        color: 'error'
      };
      
      return;
    }

    data = await response.json();

    snackbar.value = {
      show: true,
      text: data.message,
      color: 'success'
    };
    
    await fetchUser();
    dialog.value = false;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchUser);
</script>