<template>
  <v-container>
    <v-row>
      <h1>Mods</h1>
      <v-col cols="12" md="4" v-for="mod in mods" :key="mod.id">
        <v-card>
          <v-card-title>{{ mod.title }}</v-card-title>
          <v-card-text>
            <div>{{ mod.description }}</div>
            <div class="text-grey text-caption mt-2">Descargas: {{ mod.downloads }}</div>
          </v-card-text>
          <v-card-actions>
            <v-btn :to="`/mod/${mod.id}`" color="primary" variant="text">Ver detalles</v-btn>
            <v-spacer></v-spacer>
            <v-btn :href="`http://localhost:3002${mod.file_path}`" download target="_blank">Descargar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- FAB para subir nuevo mod -->
    <v-btn
      color="primary"
      class="fab"
      icon
      size="large"
      @click="dialog = true"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <!-- Dialog para el formulario -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title>Subir Mod</v-card-title>
        <v-card-text>
            <v-text-field v-model="title" label="Título del Mod" required />
            <v-textarea v-model="description" label="Descripción" required />
            <v-file-input v-model="modFile" label="Archivo del Mod" required />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" :loading="loading" :disabled="!userEmail" @click="uploadMod">Subir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { getMods, postMod } from '@/services/communicationManager';
import { ref, onMounted } from 'vue';

const mods = ref([]);
const dialog = ref(false);
const title = ref('');
const description = ref('');
const modFile = ref(null);
const loading = ref(false);
const userEmail = ref(localStorage.getItem('userEmail'));

const fetchMods = async () => {
  const response = await getMods();
  mods.value = await response.json();
  console.log(mods.value);
};

const uploadMod = async () => {
  loading.value = true;

  const formData = new FormData();
  formData.append('title', title.value);
  formData.append('description', description.value);
  formData.append('email', userEmail.value);
  formData.append('modFile', modFile.value);

  try {
    console.log(formData.title);
    const response = await postMod(formData);
    const newMod = await response.json();
    console.log(newMod);
    mods.value.unshift(newMod);
    dialog.value = false;
    title.value = '';
    description.value = '';
    modFile.value = null;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchMods);
</script>

<style scoped>
.fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
}
</style>