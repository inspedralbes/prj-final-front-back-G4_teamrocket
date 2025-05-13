<template>
  <div class="nexus-style">
    <!-- Header -->
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

    <!-- Hero Section with Video Background -->
    <section class="nexus-hero" @click="openVideoModal">
      <div class="video-background">
        <video 
          ref="backgroundVideo"
          autoplay
          muted
          loop
          playsinline
          class="video-element"
        >
          <source src="" type="video/mp4">
          Tu navegador no soporta videos HTML5.
        </video>
        <div class="video-overlay"></div>
      </div>
      
      <div class="hero-content">
        <v-container>
          <v-row>
            <v-col cols="12" md="8">
              <h1 class="nexus-hero-title">Darkness Unseen Mods</h1>
              <p class="nexus-hero-subtitle">
                Transforma tu experiencia de terror con mods que mejoran gráficos, añaden nuevos elementos de juego y contenido escalofriante.
              </p>
              <div class="nexus-hero-buttons">
                <v-btn color="#fc503b" class="nexus-hero-btn" @click.stop>Explorar todos los mods</v-btn>
                <v-btn 
                  color="#fc503b" 
                  variant="outlined" 
                  class="nexus-hero-btn" 
                  @click.stop="openUploadDialog"
                  :disabled="!userEmail"
                >
                  Subir mod
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </section>

    <!-- Sección independiente para BepInEx links -->
    <section class="bepinex-section">
      <v-container>
        <v-row>
          <v-col cols="12">
            <div class="bepinex-links">
              <div class="bepinex-cube">
                <a href="https://github.com/BepInEx/BepInEx" class="bepinex-link" target="_blank" rel="noopener">
                  <v-icon left color="#fc503b" size="28">mdi-github</v-icon>
                  <span>Instrucciones: BepInEx en GitHub</span>
                </a>
              </div>
              <div class="bepinex-cube">
                <a href="https://github.com/BepInEx/BepInEx/archive/refs/heads/master.zip" class="bepinex-link" target="_blank" rel="noopener">
                  <v-icon left color="#fc503b" size="28">mdi-zip-box</v-icon>
                  <span>Descargar BepInEx (.zip)</span>
                </a>
              </div>
              <div class="bepinex-cube">
                <a href="#" class="bepinex-link" target="_blank" rel="noopener">
                  <v-icon left color="#fc503b" size="28">mdi-play-circle</v-icon>
                  <span>Ver video tutorial (próximamente)</span>
                </a>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Stats Section -->
    <section class="nexus-stats" v-if="stats.totalMods > 0">
      <v-container>
        <v-row>
          <v-col cols="12">
            <h2 class="nexus-stats-title">Mods y colecciones para Darkness Unseen</h2>
          </v-col>
          <v-col cols="6" sm="3">
            <div class="nexus-stat-item">
              <div class="nexus-stat-value">{{ formatNumber(stats.totalDownloads) }}</div>
              <div class="nexus-stat-label">Descargas</div>
            </div>
          </v-col>
          <v-col cols="6" sm="3">
            <div class="nexus-stat-item">
              <div class="nexus-stat-value">{{ formatNumber(stats.totalMods) }}</div>
              <div class="nexus-stat-label">Mods</div>
            </div>
          </v-col>
          <v-col cols="6" sm="3">
            <div class="nexus-stat-item">
              <div class="nexus-stat-value">{{ formatNumber(stats.totalMembers) }}</div>
              <div class="nexus-stat-label">Miembros</div>
            </div>
          </v-col>
          <v-col cols="6" sm="3">
            <div class="nexus-stat-item">
              <div class="nexus-stat-value">${{ formatNumber(stats.totalRewards) }}</div>
              <div class="nexus-stat-label">Recompensas</div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Main Content -->
    <v-container class="nexus-main-container">
      <!-- Filter Tabs -->
      <div class="nexus-filter-tabs">
        <v-tabs v-model="activeTab" grow>
          <v-tab value="new">Nuevos</v-tab>
          <v-tab value="updated">Actualizados</v-tab>
          <v-tab value="trending">Tendencia</v-tab>
          <v-tab value="popular">Populares</v-tab>
          <v-tab value="surprise">Sorpresa</v-tab>
        </v-tabs>
      </div>

      <!-- Search and Sort -->
      <div class="nexus-search-sort">
        <v-text-field
          v-model="search"
          label="Buscar mods..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          class="nexus-search-field"
          @input="filterMods"
        ></v-text-field>
        <v-select
          v-model="sortBy"
          :items="['Relevancia', 'Más descargados', 'Más recientes', 'Más valorados']"
          label="Ordenar por"
          density="compact"
          variant="outlined"
          class="nexus-sort-select"
          @update:modelValue="sortMods"
        ></v-select>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="nexus-loading">
        <v-progress-circular indeterminate color="#fc503b"></v-progress-circular>
        <p>Cargando mods...</p>
      </div>

      <!-- Mods List -->
      <div v-else class="nexus-mods-list">
        <div v-if="filteredMods.length === 0" class="nexus-no-mods">
          <v-icon color="#fc503b" size="48">mdi-alert-circle-outline</v-icon>
          <h3>No se encontraron mods</h3>
          <p>Intenta con otros términos de búsqueda o sube el primer mod</p>
          <v-btn color="#fc503b" @click="openUploadDialog" v-if="userEmail">
            Subir mi primer mod
          </v-btn>
        </div>

        <div v-for="mod in filteredMods" :key="mod.id" class="nexus-mod-item">
          <div class="nexus-mod-content">
            <h3 class="nexus-mod-title">{{ mod.title }}</h3>
            <p class="nexus-mod-description">{{ truncateDescription(mod.description) }}</p>
            <div class="nexus-mod-meta">
              <span class="nexus-mod-author">por {{ mod.User.username || 'Anónimo' }}</span>
              <span class="nexus-mod-stats">
                <v-icon small color="warning">mdi-star</v-icon>
                {{ calculateAverageRating(mod.id) }}/5
              </span>
              <span class="nexus-mod-stats">
                <v-icon small>mdi-comment</v-icon>
                {{ getCommentsCountForMod(mod.id) }} comentarios
              </span>
              <span class="nexus-mod-stats" @click="toggleLike(mod.id)" style="cursor: pointer;">
                <v-icon 
                  small
                  :color="isToggled(mod.id) ? 'blue' : undefined"
                >
                  mdi-thumb-up
                </v-icon>
                {{ getLikesCountForMod(mod.id) }} reseñas
              </span>
              <span class="nexus-mod-downloads">
                <v-icon small>mdi-download</v-icon>
                {{ formatDownloads(mod.downloads) }}
              </span>
              <span class="nexus-mod-date">
                <v-icon small>mdi-calendar</v-icon>
                {{ formatDate(mod.uploaded_at) }}
              </span>
            </div>
          </div>
          <div class="nexus-mod-actions">
            <v-btn
              color="#fc503b"
              variant="text"
              size="small"
              @click="navigateToMod(mod.id)"
              class="nexus-mod-btn"
            >
              Detalles
            </v-btn>
            <v-btn
              color="#fc503b"
              variant="text"
              size="small"
              @click="downloadMod(mod)"
              class="nexus-mod-btn"
              :disabled="!mod.file_path"
            >
              Descargar
            </v-btn>
          </div>
        </div>
      </div>

      <!-- View All Button -->
      <div class="nexus-view-all" v-if="filteredMods.length > 0 && !loading">
        <v-btn variant="text" color="#fc503b">Ver todos</v-btn>
      </div>
    </v-container>

    <!-- Upload Dialog -->
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card class="nexus-dialog">
        <v-card-title class="nexus-dialog-title">
          <v-icon icon="mdi-cloud-upload" class="mr-2"></v-icon>
          Subir Mod
        </v-card-title>
        <v-card-text>
          <v-form ref="uploadForm" @submit.prevent="uploadMod" v-model="formValid">
            <v-text-field
              v-model="title"
              label="Título del Mod*"
              :rules="[v => !!v || 'El título es requerido']"
              required
              variant="outlined"
              density="compact"
              class="nexus-input"
            ></v-text-field>
            
            <v-textarea
              v-model="description"
              label="Descripción*"
              :rules="[v => !!v || 'La descripción es requerida']"
              required
              variant="outlined"
              density="compact"
              rows="3"
              class="nexus-input"
            ></v-textarea>
            
            <v-file-input
              v-model="modFile"
              label="Archivo del Mod (ZIP, RAR, 7Z)*"
              required
              variant="outlined"
              density="compact"
              accept=".zip,.rar,.7z"
              class="nexus-input"
              prepend-icon="mdi-paperclip"
              :show-size="1000"
            ></v-file-input>

            <v-file-input
              v-model="imageFile"
              label="Imagen del Mod*"
              required
              variant="outlined"
              density="compact"
              accept="image/*"
              class="nexus-input"
              prepend-icon="mdi-image"
              :show-size="1000"
            ></v-file-input>

            <div class="nexus-upload-hint">
              <v-icon small color="#fc503b">mdi-information-outline</v-icon>
              <span>Asegúrate de incluir instrucciones de instalación en tu archivo</span>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions class="nexus-dialog-actions">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="closeDialog"
            :disabled="uploading"
            class="nexus-btn"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="#fc503b"
            :loading="uploading"
            :disabled="!formValid || uploading"
            @click="uploadMod"
            class="nexus-btn"
          >
            <v-icon icon="mdi-upload" start></v-icon>
            Subir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Video Modal -->
    <v-dialog v-model="videoModal" max-width="800" persistent>
      <v-card class="nexus-video-modal">
        <v-card-title class="nexus-video-modal-title">
          <v-icon icon="mdi-video" class="mr-2"></v-icon>
          Video de Presentación
        </v-card-title>
        <v-card-text>
          <video 
            ref="modalVideo"
            autoplay
            loop
            playsinline
            class="video-element"
          >
            <source src="" type="video/mp4">
            Tu navegador no soporta videos HTML5.
          </video>
        </v-card-text>
        <v-card-actions class="nexus-video-modal-actions">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="closeVideoModal"
            class="nexus-btn"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Upload Success Snackbar -->
    <v-snackbar v-model="uploadSuccess" color="success" timeout="3000">
      Mod subido correctamente!
      <template v-slot:actions>
        <v-btn variant="text" @click="uploadSuccess = false">Cerrar</v-btn>
      </template>
    </v-snackbar>

    <!-- Upload Error Snackbar -->
    <v-snackbar v-model="uploadError" color="error" timeout="3000">
      Error al subir el mod: {{ errorMessage }}
      <template v-slot:actions>
        <v-btn variant="text" @click="uploadError = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { getMods, postMod, postDownloadMod, getAllComments, getAllLikes, postLike, deleteLike } from '@/services/communicationManager';
import { listenToModDownloads, listenToComments, listenToLikes } from '@/services/socketManager';

// Datos reales
const stats = ref({
  totalDownloads: 0,
  totalMods: 0,
  totalMembers: 0,
  totalRewards: 0
});

const mods = ref([]);
const comments = ref([]);
const likes = ref([]);
const loading = ref(true);
const userEmail = ref(localStorage.getItem('userEmail'));

// Filtros y búsqueda
const activeTab = ref('new');
const search = ref('');
const sortBy = ref('Relevancia');

// Upload dialog
const dialog = ref(false);
const title = ref('');
const description = ref('');
const modFile = ref(null);
const imageFile = ref(null);
const uploading = ref(false);
const formValid = ref(false);
const uploadSuccess = ref(false);
const uploadError = ref(false);
const errorMessage = ref('');

// Formateadores
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const calculateAverageRating = (modId) => {
  const modComments = comments.value.filter(c => c.modId === modId);
  if (modComments.length === 0) return 0;
  const total = modComments.reduce((sum, c) => sum + (c.rating || 0), 0);
  return (total / modComments.length).toFixed(0);
};

const getCommentsCountForMod = (modId) => {
  return comments.value.filter(comment => comment.modId === modId).length;
};

const getLikesCountForMod = (modId) => {
  return likes.value.filter(like => like.modId === modId).length;
}

const formatDownloads = (num) => {
  return formatNumber(num || 0);
};

const formatDate = (dateString) => {
  if (!dateString) return 'Fecha desconocida';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

const truncateDescription = (desc) => {
  if (!desc) return '';
  return desc.length > 100 ? desc.substring(0, 100) + '...' : desc;
};

const isToggled = (modId) => {
  return likes.value.some(like => like.modId === modId && like.email === userEmail.value);
};

// Funciones de mods
const fetchMods = async () => {
  try {
    loading.value = true;
    mods.value = await getMods();
    
    // Calcular estadísticas
    stats.value = {
      totalDownloads: mods.value.reduce((sum, mod) => sum + (mod.downloads || 0), 0),
      totalMods: mods.value.length,
      totalMembers: 0, // Esto deberías obtenerlo del backend
      totalRewards: 0 // Esto deberías obtenerlo del backend
    };
  } catch (error) {
    console.error('Error fetching mods:', error);
  } finally {
    loading.value = false;
  }
};

const fetchComments = async () => {
  try {
    const response = await getAllComments();
    comments.value = await response.json();
    console.log(comments.value);
  } catch (err) {
    console.log(err);
  }
}

const fetchLikes = async () => {
  try {
    likes.value = await getAllLikes();
    console.log(likes.value);
  } catch (err) {
    console.log(err);
  }
}

const filteredMods = computed(() => {
  let result = [...mods.value];
  
  // Filtrar por búsqueda
  if (search.value) {
    const searchTerm = search.value.toLowerCase();
    result = result.filter(mod => 
      mod.title.toLowerCase().includes(searchTerm) || 
      (mod.description && mod.description.toLowerCase().includes(searchTerm)) ||
      (mod.author && mod.author.toLowerCase().includes(searchTerm))
    );
  }
  
  // Ordenar
  switch (sortBy.value) {
    case 'Más descargados':
      return result.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    case 'Más recientes':
      return result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    case 'Más valorados':
      return result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    default:
      return result;
  }
});

const filterMods = () => {
  // La función computed ya maneja esto
};

const sortMods = () => {
  // La función computed ya maneja esto
};

// Funciones de diálogo
const openUploadDialog = () => {
  if (!userEmail.value) {
    // Redirigir a login si no está autenticado
    window.location.href = '/login';
    return;
  }
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  title.value = '';
  description.value = '';
  modFile.value = null;
  imageFile.value = null;
};

const toggleLike = async (modId) => {
  const existingLike = likes.value.find(
    like => like.modId === modId && like.email === userEmail.value
  );

  if (!existingLike) {
    try {
      await postLike(modId, userEmail.value);
    } catch (err) {
      console.log('Error al registrar like:', err);
    }
  } else {
    try {
      await deleteLike(modId, userEmail.value);
    } catch (err) {
      console.log('Error al eliminar like:', err);
    }
  }
};

const toggleLike = async (modId) => {
  const existingLike = likes.value.find(
    like => like.modId === modId && like.email === userEmail.value
  );

  if (!existingLike) {
    try {
      await postLike(modId, userEmail.value);
    } catch (err) {
      console.log('Error al registrar like:', err);
    }
  } else {
    try {
      await deleteLike(modId, userEmail.value);
    } catch (err) {
      console.log('Error al eliminar like:', err);
    }
  }
};

const uploadMod = async () => {
  if (!formValid.value) return;
  if (!modFile.value || !imageFile.value) return;
  uploading.value = true;
  
  const formData = new FormData();
  formData.append('title', title.value);
  formData.append('description', description.value);
  formData.append('modFile', modFile.value);
  formData.append('imageFile', imageFile.value);
  formData.append('email', userEmail.value);
  
  try {
    const response = await postMod(formData);
    const newMod = await response.json();
    
    // Agregar el nuevo mod a la lista
    mods.value.unshift(newMod);
    
    // Mostrar feedback
    uploadSuccess.value = true;
    closeDialog();
    
    // Recargar mods para asegurarnos de tener los datos actualizados
    await fetchMods();
  } catch (error) {
    console.error('Error uploading mod:', error);
    errorMessage.value = error.message || 'Error desconocido';
    uploadError.value = true;
  } finally {
    uploading.value = false;
  }
};

// Funciones de mod
const downloadMod = async (mod) => {
  if (!mod.file_path) return;
  
  try {
    // Registrar la descarga en el backend
    await postDownloadMod(mod.id);
    
    // Descargar el archivo
    const link = document.createElement('a');
    link.href = `http://localhost:3002${mod.file_path}`;
    link.setAttribute('download', '');
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Error downloading mod:', error);
    errorMessage.value = 'Error al descargar el mod';
    uploadError.value = true;
  }
};

const navigateToMod = (id) => {
  window.location.href = `/mod/${id}`;
};

const logout = () => {
  localStorage.removeItem('userEmail');
  userEmail.value = null;
  window.location.href = '/';
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Inicialización
onMounted(() => {
  fetchMods();
  fetchComments();
  fetchLikes();
  listenToModDownloads(mods, stats);
  listenToComments(comments);
  listenToLikes(likes);
  
  // Obtener estadísticas de miembros y recompensas del backend si es necesario
  // fetchStats().then(data => { stats.value.totalMembers = data.members; ... });
});
</script>

<style scoped>
/* Estilos generales */
.nexus-style {
  background: #0d0d0d;
  color: #ffffff;
  min-height: 100vh;
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

.nexus-user-section {
  display: flex;
  align-items: center;
}

.nexus-login-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: normal;
}

/* Hero Section */
.nexus-hero {
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), 
              url('@/assets/darkness-bg.jpg') no-repeat center center;
  background-size: cover;
  padding: 80px 0;
  border-bottom: 1px solid #fc503b;
}

.nexus-hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.nexus-hero-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 30px;
  max-width: 600px;
  line-height: 1.6;
}

.nexus-hero-buttons {
  display: flex;
  gap: 15px;
}

.nexus-hero-btn {
  text-transform: none;
  font-weight: 500;
  padding: 10px 20px;
}

/* Stats Section */
.nexus-stats {
  background: rgba(18, 18, 18, 0.9);
  padding: 40px 0;
  border-bottom: 1px solid #252525;
}

.nexus-stats-title {
  font-size: 1.2rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 20px;
  text-align: center;
}

.nexus-stat-item {
  text-align: center;
  padding: 15px;
}

.nexus-stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #fc503b;
  margin-bottom: 5px;
}

.nexus-stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

/* Main Container */
.nexus-main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 15px;
}

/* Loading State */
.nexus-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
}

.nexus-loading p {
  margin-top: 20px;
  color: rgba(255, 255, 255, 0.8);
}

/* No Mods State */
.nexus-no-mods {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  background: rgba(30, 30, 30, 0.5);
  border-radius: 8px;
  margin: 20px 0;
}

.nexus-no-mods h3 {
  color: #fc503b;
  margin: 15px 0 10px;
}

.nexus-no-mods p {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 20px;
}

/* Filter Tabs */
.nexus-filter-tabs {
  margin-bottom: 20px;
  border-bottom: 1px solid #252525;
}

.nexus-filter-tabs :deep(.v-tab) {
  text-transform: none;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
}

.nexus-filter-tabs :deep(.v-tab--selected) {
  color: #fc503b;
}

.nexus-filter-tabs :deep(.v-tab:hover) {
  color: #ffffff;
}

/* Search and Sort */
.nexus-search-sort {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.nexus-search-field {
  flex: 1;
}

.nexus-sort-select {
  width: 200px;
}

/* Mods List */
.nexus-mods-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.nexus-mod-item {
  background: rgba(18, 18, 18, 0.9);
  border: 1px solid #252525;
  border-radius: 6px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.nexus-mod-item:hover {
  border-color: #fc503b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.nexus-mod-content {
  flex: 1;
  min-width: 0; /* Para evitar problemas con el texto largo */
}

.nexus-mod-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #fc503b;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nexus-mod-description {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 10px;
  line-height: 1.5;
}

.nexus-mod-meta {
  display: flex;
  gap: 15px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  flex-wrap: wrap;
}

.nexus-mod-author {
  font-style: italic;
}

.nexus-mod-downloads, .nexus-mod-date {
  display: flex;
  align-items: center;
  gap: 5px;
}

.nexus-mod-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.nexus-mod-btn {
  text-transform: none;
  font-size: 0.8rem;
}

.nexus-view-all {
  text-align: center;
  margin-top: 30px;
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
  color: #fc503b;
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

.nexus-upload-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 10px;
}

/* Responsive */
.bepinex-links {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
  gap: 24px;
  margin-bottom: 32px;
  margin-top: 18px;
  flex-wrap: wrap;
}
.bepinex-cube {
  background: rgba(25, 25, 25, 0.93);
  border: 2px solid #fc503b;
  border-radius: 14px;
  box-shadow: 0 2px 16px 0 rgba(252,80,59,0.15);
  padding: 28px 22px 20px 22px;
  min-width: 220px;
  max-width: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.18s, box-shadow 0.18s;
}
.bepinex-cube:hover {
  transform: translateY(-6px) scale(1.03);
  box-shadow: 0 8px 32px 0 #fc503b55;
}
.bepinex-link {
  color: #fff !important;
  background: transparent;
  border-radius: 6px;
  font-weight: 600;
  padding: 0;
  transition: color 0.2s;
  font-size: 1.08rem;
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}
.bepinex-link:hover {
  color: #fc503b !important;
}

/* Cubos de mods */
.mods-cubes-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: center;
  align-items: stretch;
  margin-bottom: 32px;
  margin-top: 18px;
}
.mod-cube {
  background: rgba(25, 25, 25, 0.93);
  border: 2px solid #fc503b;
  border-radius: 14px;
  box-shadow: 0 2px 16px 0 rgba(252,80,59,0.13);
  min-width: 260px;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  padding: 0;
  overflow: hidden;
  transition: transform 0.18s, box-shadow 0.18s;
}

.mod-cube-image-wrapper {
  width: 100%;
  height: 180px;
  background: #181818;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  overflow: hidden;
}
.mod-cube-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.mod-cube-image-placeholder {
  width: 100%;
  height: 100%;
  color: #fff;
  background: #222;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  font-weight: 600;
}

.nexus-mod-content {
  padding: 20px 18px 6px 18px;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nexus-mod-actions {
  padding: 0 18px 18px 18px;
  display: flex;
  gap: 10px;
}

.mod-cube:hover {
  transform: translateY(-6px) scale(1.03);
  box-shadow: 0 8px 32px 0 #fc503b55;
}
@media (max-width: 1100px) {
  .mods-cubes-row {
    gap: 18px;
  }
  .mod-cube {
    min-width: 220px;
    max-width: 100%;
  }
}
@media (max-width: 900px) {
  .bepinex-links {
    flex-direction: column;
    align-items: stretch;
    gap: 18px;
  }
  .bepinex-cube {
    max-width: 100%;
    min-width: 0;
    width: 100%;
  }
}

@media (max-width: 960px) {
  .nexus-hero-title {
    font-size: 2rem;
  }
  
  .nexus-hero-subtitle {
    font-size: 1rem;
  }
  
  .nexus-search-sort {
    flex-direction: column;
  }
  
  .nexus-sort-select {
    width: 100%;
  }
  
  .nexus-mod-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .nexus-mod-actions {
    width: 100%;
    justify-content: flex-end;
  }
}

@media (max-width: 600px) {
  .nexus-stat-value {
    font-size: 1.4rem;
  }
  
  .nexus-stat-label {
    font-size: 0.8rem;
  }
  
  .nexus-filter-tabs {
    overflow-x: auto;
  }
  
  .nexus-mod-meta {
    gap: 8px;
  }
}
</style>