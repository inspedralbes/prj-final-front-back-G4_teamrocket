<template>
  <v-container>
    <!-- Perfil del usuario -->
    <v-card class="mx-auto my-5" max-width="400">
      <v-card-title>
        <v-avatar class="mr-3" size="100">
          <v-img :src="'http://localhost:3002' + user.avatar" />
        </v-avatar>
        <div>
          <h3>{{ user.username }}</h3>
          <p class="text-subtitle-2">{{ user.email }}</p>
        </div>
        <v-spacer />
        <v-btn icon @click="editPerfil = true">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </v-card-title>
    </v-card>

    <!-- Diálogo para editar perfil -->
    <v-dialog v-model="editPerfil" max-width="500">
      <v-card>
        <v-card-title>Editar Perfil</v-card-title>
        <v-card-text>
          <v-text-field v-model="newInformationUser.username" label="Nombre de usuario" />
          <v-file-input v-model="newInformationUser.newAvatar" label="Foto de perfil" />

          <v-divider class="my-4"></v-divider>

          <v-text-field v-model="newInformationUser.newPassword" label="Nueva contraseña" type="password" />
          <v-text-field v-model="newInformationUser.confirmPassword" label="Confirmar contraseña" type="password" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="editPerfil = false">Cancelar</v-btn>
          <v-btn color="primary" :loading="loading" @click="updateProfile">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
            <v-btn icon @click="openEditDialogMod(mod)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="updateVisible(mod)">
              <v-icon>{{ mod.visible ? 'mdi-earth' : 'mdi-lock' }}</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-dialog v-model="editMod" max-width="600">
        <v-card>
          <v-card-title>Subir Mod</v-card-title>
          <v-card-text>
              <v-text-field v-model="newInformationMod.title" label="Título del Mod" />
              <v-textarea v-model="newInformationMod.description" label="Descripción" />
              <v-file-input v-model="newInformationMod.modFile" label="Archivo del Mod" />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="editMod = false">Cancelar</v-btn>
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
import { loadUserData, putUserProfile, putMod, putVisible } from "../services/communicationManager.js";

const user = ref({ mods: [] });
const editMod = ref(false);
const loading = ref(false);
const editPerfil = ref(false);
const userEmail = ref(localStorage.getItem('userEmail'));
const newInformationMod = ref({
  modId: 0,
  title: '',
  description: '',
  modFile: null
});
const newInformationUser = ref({
  username: '',
  newAvatar: null,
  newPassword: '',
  confirmPassword: ''
});
const snackbar = ref({
  show: false,
  text: '',
  color: ''
});
let data;

const fetchUser = async () => {
  const response = await loadUserData(userEmail.value);
  if (!response.ok) throw new Error('Error en la respuesta del servidor');

  const data = await response.json();

  user.value = data;
}

const updateProfile = async () => {
  loading.value = true;

  const formData = new FormData();
  formData.append('email', userEmail.value);
  if (newInformationUser.value.username) formData.append('username', newInformationUser.value.username);
  if (newInformationUser.value.newPassword && newInformationUser.value.newPassword !== newInformationUser.value.confirmPassword) {
    snackbar.value = {
      show: true,
      text: 'Las contraseñas no coinciden',
      color: 'error'
    };
    return;
  }
  if(newInformationUser.value.newAvatar) formData.append('newAvatar', newInformationUser.value.newAvatar);

  formData.forEach((value, key) => {
    console.log(key, value);
  });

  try {
    const response = await putUserProfile(formData);

    if (!response.ok) {
      const error = await response.json();
      snackbar.value = {
        show: true,
        text: error.message,
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
    editPerfil.value = false;

    fetchUser();
  } catch (err) {
    console.error(err);
    return;
  } finally {
    loading.value = false;
  }
};

const openEditDialogMod = (mod) => {
  newInformationMod.value.modId = mod.id;
  newInformationMod.value.title = mod.title;
  newInformationMod.value.description = mod.description;
  newInformationMod.value.modFile = null;
  editMod.value = true;
}

const updateVisible = async (mod) => {
  mod.visible = !mod.visible;

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
  formData.append('id', newInformationMod.value.modId);
  formData.append('title', newInformationMod.value.title);
  formData.append('description', newInformationMod.value.description);
  if (newInformationMod.value.modFile) {
    formData.append('modFile', newInformationMod.value.modFile);
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
    editMod.value = false;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchUser);
</script>