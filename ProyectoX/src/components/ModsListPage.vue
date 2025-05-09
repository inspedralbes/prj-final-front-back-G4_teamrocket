<template>
  <div class="nexus-style">
    <!-- Header estilo Nexus Mods -->
    <v-app-bar app color="#0d0d0d" dark elevation="0" height="60" class="nexus-header">
      <div class="logo-container">
        <v-img
          src="@/assets/Logo del Juego de darkness Unseen.png"
          alt="Logo del Juego"
          class="logo nexus-logo"
          width="50"
          height="50"
          @click="scrollToTop"
        ></v-img>
      </div>
      
      <v-spacer></v-spacer>
      
      <div class="nexus-user-section">
        <v-btn
          v-if="!userEmail"
          color="#fc503b"
          class="nexus-login-btn"
          to="/login"
          text
          :ripple="false"
        >
          Iniciar Sesión
        </v-btn>
        <v-btn
          v-if="userEmail"
          color="#fc503b"
          class="nexus-login-btn"
          @click="logout"
          text
          :ripple="false"
        >
          Cerrar Sesión
        </v-btn>
      </div>
    </v-app-bar>

    <!-- Contenido principal -->
    <v-container fluid class="pa-0 nexus-container">
      <v-row no-gutters>
        <v-col cols="12">
          <section class="section nexus-section">
            <div class="filters-container">
              <v-row no-gutters class="filters-row">
                <v-col cols="12" md="6" class="filters-col">
                  <v-text-field
                    v-model="search"
                    label="Buscar mod..."
                    prepend-inner-icon="mdi-magnify"
                    variant="outlined"
                    density="compact"
                    class="search-field"
                    :class="{ 'search-field-hover': search.length > 0 }"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4" class="filters-col">
                  <v-select
                    v-model="sortBy"
                    :items="['Popularidad', 'Fecha']"
                    label="Ordenar por"
                    density="compact"
                    variant="outlined"
                    class="sort-select"
                    :class="{ 'sort-select-hover': sortBy !== 'Popularidad' }"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="2" class="filters-col">
                  <v-btn
                    color="#fc503b"
                    class="nexus-nav-btn"
                    @click="dialog = true"
                    text
                    :ripple="false"
                  >
                    <v-icon left>mdi-plus</v-icon>
                    Subir Mod
                  </v-btn>
                </v-col>
              </v-row>
            </div>

            <!-- Lista de mods -->
            <v-row no-gutters>
              <v-col
                v-for="mod in filteredMods"
                :key="mod.id"
                cols="12"
                sm="6"
                md="4"
              >
                <v-hover v-slot="{ hover }">
                  <v-card
                    class="nexus-card"
                    :elevation="hover ? 12 : 4"
                    :class="{ 'on-hover': hover }"
                  >
                    <v-card-title class="nexus-card-title">
                      {{ mod.title }}
                    </v-card-title>
                    <v-card-text class="nexus-card-text">
                      {{ mod.description }}
                      <div class="mt-2 d-flex align-center">
                        <v-icon icon="mdi-download" size="16" class="mr-1"></v-icon>
                        <span class="text-caption">{{ mod.downloads }} descargas</span>
                      </div>
                    </v-card-text>
                    <v-card-actions class="nexus-card-actions">
                      <v-btn
                        color="#fc503b"
                        text
                        :ripple="false"
                        @click="navigateToMod(mod.id)"
                      >
                        Ver detalles
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="#fc503b"
                        text
                        :ripple="false"
                        @click="download(mod, mods)"
                        :loading="mod.downloading"
                      >
                        <v-icon left>mdi-download</v-icon>
                        Descargar
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-hover>
              </v-col>
            </v-row>
          </section>
        </v-col>
      </v-row>
    </v-container>

    <!-- Dialog para el formulario -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card class="nexus-dialog">
        <v-card-title class="nexus-dialog-title">
          <v-icon icon="mdi-cloud-upload" class="mr-2"></v-icon>
          Subir Mod
        </v-card-title>
        <v-card-text>
          <v-form ref="uploadForm" @submit.prevent="uploadMod">
            <v-text-field
              v-model="title"
              label="Título del Mod"
              required
              variant="outlined"
              density="compact"
              class="nexus-input"
            ></v-text-field>
            <v-textarea
              v-model="description"
              label="Descripción"
              required
              variant="outlined"
              density="compact"
              rows="3"
              class="nexus-input"
            ></v-textarea>
            <v-file-input
              v-model="modFile"
              label="Archivo del Mod"
              required
              variant="outlined"
              density="compact"
              accept=".zip,.rar,.7z"
              class="nexus-input"
            ></v-file-input>
          </v-form>
        </v-card-text>
        <v-card-actions class="nexus-dialog-actions">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="dialog = false"
            :disabled="loading"
            class="nexus-btn"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="#fc503b"
            :loading="loading"
            :disabled="!userEmail || loading"
            @click="uploadMod"
            class="nexus-btn"
          >
            <v-icon icon="mdi-upload" start></v-icon>
            Subir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { getMods, postMod, postDownload } from '@/services/communicationManager';
import { functionSocket } from '@/services/socketManager';
import { ref, onMounted, computed } from 'vue';

const mods = ref([]);
const dialog = ref(false);
const title = ref('');
const description = ref('');
const modFile = ref(null);
const loading = ref(false);
const userEmail = ref(localStorage.getItem('userEmail'));
const search = ref('');
const sortBy = ref('Popularidad');

const filteredMods = computed(() => {
  return mods.value
    .filter(mod => 
      mod.title.toLowerCase().includes(search.value.toLowerCase()) ||
      mod.description.toLowerCase().includes(search.value.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy.value === 'Popularidad') {
        return b.downloads - a.downloads;
      }
      return new Date(b.created_at) - new Date(a.created_at);
    });
});

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
    const response = await postMod(formData);
    const newMod = await response.json();
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

const download = async (mod, mods) => {
  try {
    postDownload(mod.id);

    const link = document.createElement('a');
    link.href = `http://localhost:3002${mod.file_path}`;
    link.setAttribute('download', '');
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    functionSocket(mods);
  } catch (error) {
    console.log(error);
  }
};

const navigateToMod = (id) => {
  window.location.href = `/mod/${id}`;
};

onMounted(fetchMods);
</script>

<style scoped>
/* Estilos generales */
.nexus-style {
  background: #0d0d0d;
  color: #ffffff;
}

/* Header */
.nexus-header {
  background-color: rgba(13, 13, 13, 0.9) !important;
  backdrop-filter: blur(5px);
  border-bottom: 1px solid #fc503b;
  z-index: 1000;
  padding: 0 5%;
}

.logo-container {
  margin: 0 20px;
  cursor: pointer;
}

.nexus-logo {
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  border: 2px solid #fc503b;
  transform-origin: center;
}

.nexus-logo:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px #fc503b;
}

.nexus-nav-links {
  margin: 0 20px;
}

/* Contenedor principal */
.nexus-container {
  padding: 20px 0;
  max-width: 1200px;
  margin: 0 auto;
}

/* Sección */
.nexus-section {
  margin: 20px 0;
  padding: 20px;
  background: rgba(18, 18, 18, 0.9);
  border-radius: 12px;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

/* Contenedor de filtros */
.filters-container {
  margin-bottom: 20px;
}

.filters-row {
  gap: 20px;
}

.filters-col {
  padding: 0 10px;
}

/* Campos de entrada */
.search-field {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 8px 16px;
}

.search-field:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
}

.search-field-hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: #fc503b;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transform: translateY(-1px);
}

.sort-select {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 8px 16px;
}

.sort-select:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
}

.sort-select-hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: #fc503b;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transform: translateY(-1px);
}

/* Estilos específicos para los iconos */
.search-field .v-input__prepend-inner {
  margin-top: 0;
  padding-top: 0;
}

.search-field .v-icon {
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-field-hover .v-icon {
  color: #fc503b;
}

.sort-select .v-input__append-inner {
  margin-top: 0;
  padding-top: 0;
}

.sort-select .v-icon {
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sort-select-hover .v-icon {
  color: #fc503b;
}

/* Tarjetas */
.nexus-card {
  background: rgba(13, 13, 13, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin: 15px;
  transition: all 0.3s ease-in-out;
}

.nexus-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
}

.nexus-card-title {
  font-size: 18px;
  font-weight: 600;
  color: #fc503b;
  padding: 12px;
}

.nexus-card-text {
  padding: 12px;
  color: rgba(255, 255, 255, 0.9);
}

.nexus-card-actions {
  padding: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Botones */
.nexus-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: normal;
  text-decoration: none;
  font-size: 13px;
  padding: 6px 18px;
  border-radius: 4px;
  transition: all 0.3s ease-in-out;
}

.nexus-nav-btn {
  color: #fc503b;
}

.nexus-login-btn {
  color: #fc503b;
}

/* Diálogo */
.nexus-dialog {
  background: rgba(13, 13, 13, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.nexus-dialog-title {
  background: rgba(13, 13, 13, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 15px;
}

.nexus-dialog-actions {
  padding: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.nexus-input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-bottom: 12px;
}

/* Responsive */
@media (max-width: 960px) {
  .nexus-container {
    padding: 10px;
  }
  
  .nexus-card {
    margin: 10px;
  }
  
  .nexus-card-title {
    font-size: 16px;
  }
  
  .nexus-card-text {
    padding: 10px;
  }
  
  .nexus-card-actions {
    padding: 10px;
  }
  
  .nexus-btn {
    font-size: 12px;
    padding: 5px 15px;
  }
}
</style>