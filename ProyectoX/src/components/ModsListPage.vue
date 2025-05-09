<template>
  <v-container fluid class="pa-0 nexus-container">
    <v-row no-gutters>
      <v-col cols="12">
        <section class="section nexus-section">
          <div class="section-header">
            <v-row align="center">
              <v-col cols="12" md="6">
                <div class="title-container">
                  <v-btn to="/" icon class="back-button">
                    <v-icon>mdi-arrow-left</v-icon>
                  </v-btn>
                  <h2 class="section-title">MODS</h2>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="filters-container">
                  <v-row align="center">
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="search"
                        label="Buscar mod..."
                        prepend-inner-icon="mdi-magnify"
                        variant="outlined"
                        density="compact"
                        class="search-field"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-select
                        v-model="sortBy"
                        :items="['Popularidad', 'Fecha']"
                        label="Ordenar por"
                        density="compact"
                        variant="outlined"
                        class="sort-select"
                      ></v-select>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
            </v-row>
          </div>
        </section>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="4" v-for="mod in filteredMods" :key="mod.id">
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            v-bind="props"
            :elevation="isHovering ? 12 : 2"
            class="transition-swing"
            @click="navigateToMod(mod.id)"
          >
            <v-card-title class="text-h6 font-weight-medium">
              {{ mod.title }}
            </v-card-title>
            <v-card-text>
              <div class="mod-description">
                {{ mod.description }}
              </div>
              <div class="mt-2 d-flex align-center">
                <v-icon icon="mdi-download" size="16" class="mr-1"></v-icon>
                <span class="text-caption">{{ mod.downloads }} descargas</span>
              </div>
            </v-card-text>
            <v-card-actions class="pa-4">
              <v-btn
                color="primary"
                variant="outlined"
                size="small"
                class="mr-2"
                @click.stop="navigateToMod(mod.id)"
              >
                Ver detalles
              </v-btn>
              <v-btn
                color="success"
                size="small"
                @click.stop="download(mod, mods)"
                :loading="mod.downloading"
              >
                <v-icon icon="mdi-download" start></v-icon>
                Descargar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-hover>
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
        <v-card-title class="text-h5">
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
            ></v-text-field>
            <v-textarea
              v-model="description"
              label="Descripción"
              required
              variant="outlined"
              density="compact"
              rows="3"
            ></v-textarea>
            <v-file-input
              v-model="modFile"
              label="Archivo del Mod"
              required
              variant="outlined"
              density="compact"
              accept=".zip,.rar,.7z"
            ></v-file-input>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="dialog = false"
            :disabled="loading"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            :loading="loading"
            :disabled="!userEmail || loading"
            @click="uploadMod"
          >
            <v-icon icon="mdi-upload" start></v-icon>
            Subir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
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
.nexus-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.section {
  padding: 40px 0;
}

.section-header {
  margin-bottom: 40px;
  text-align: center;
}

.section-title {
  color: #fc503b;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.title-decoration {
  width: 100px;
  height: 3px;
  background: #fc503b;
  margin: 0 auto;
  border-radius: 2px;
}

/* Filtros */
.filters-container {
  background: rgba(13, 13, 13, 0.8);
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
}

.search-field {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.sort-select {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Tarjetas de mods */
.v-card {
  background: rgba(13, 13, 13, 0.95);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
  transition: all 0.3s ease-in-out;
}

.v-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.v-card-title {
  color: #fc503b;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.v-card-actions {
  background: rgba(13, 13, 13, 0.9);
  backdrop-filter: blur(5px);
}

/* Botones */
.v-btn {
  text-transform: none !important;
  font-weight: 500;
  transition: all 0.3s ease-in-out;
}

.v-btn:not(.v-btn--text) {
  background: #fc503b !important;
  color: white !important;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.v-btn:not(.v-btn--text):hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.3);
}

.v-btn--text {
  color: #fc503b !important;
}

/* Botón de vuelta */
.back-button {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  color: #fc503b !important;
  transition: all 0.3s ease-in-out;
}

.back-button:hover {
  transform: translateY(-50%) rotate(-5deg);
  color: #ff6b57 !important;
}

/* FAB */
.fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 10;
  background: #fc503b !important;
  color: white !important;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.fab:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.3);
}

/* Responsive */
@media (max-width: 960px) {
  .nexus-container {
    padding: 10px;
  }
  
  .section {
    padding: 20px 0;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .v-card {
    margin-bottom: 15px;
  }
}
</style>
