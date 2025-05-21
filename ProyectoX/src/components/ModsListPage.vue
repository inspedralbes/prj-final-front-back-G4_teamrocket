<template>
  <div class="nexus-style">
    <v-app-bar app color="#0d0d0d" dark elevation="0" height="60" class="nexus-header">
      <div class="logo-container">
        <v-img
          src="@/assets/Logo del Juego de darkness Unseen.png"
          alt="Logo del Juego"
          class="logo nexus-logo"
          width="50"
          height="50"
          @click="navigateToMainPage"
        ></v-img>
      </div>
      
      <v-spacer></v-spacer>
      
      <div class="nexus-user-section">
        <v-btn
          v-if="userEmail"
          color="#fc503b"
          class="nexus-login-btn"
          to="/"
          text
          :ripple="false"
        >
          <v-icon left>mdi-home</v-icon>
          Inici
        </v-btn>
        <v-btn
          v-if="userEmail"
          color="#fc503b"
          class="nexus-login-btn"
          to="/perfil"
          text
          :ripple="false"
        >
          <v-icon left>mdi-account</v-icon>
          Perfil
        </v-btn>
        <v-btn
          v-if="!userEmail"
          color="#fc503b"
          class="nexus-login-btn"
          to="/login"
          text
          :ripple="false"
        >
          Iniciar Sessió
        </v-btn>
        <v-btn
          v-if="userEmail"
          color="#fc503b"
          class="nexus-login-btn"
          @click="logout"
          text
          :ripple="false"
        >
          Tancar Sessió
        </v-btn>
        <v-btn
          v-if="isAdmin"
          color="#fc503b"
          class="nexus-login-btn"
          to="/admin"
          text
          :ripple="false"
        >
          <v-icon left>mdi-shield-account</v-icon>
          Admin
        </v-btn>
      </div>
    </v-app-bar>
    
    <section class="nexus-hero">
      <div class="hero-content">
        <v-container>
          <v-row>
            <v-col cols="12" md="8">
              <h1 class="nexus-hero-title">Darkness Unseen Mods</h1>
              <p class="nexus-hero-subtitle">
                Transforma la teva experiència d'horror amb mods que milloren els gràfics, afegeixen nous elements de joc i contingut escalofriant.
              </p>
              <div class="nexus-hero-buttons">
                <!-- <v-btn color="#fc503b" class="nexus-hero-btn" @click.stop>Explorar tots els mods</v-btn> -->
                <v-btn 
                  color="#fc503b" 
                  variant="outlined" 
                  class="nexus-hero-btn" 
                  @click.stop="openUploadDialog"
                >
                  Pujar mod
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </section>

    <section class="bepinex-section">
      <v-container>
        <v-row>
          <v-col cols="12">
            <div class="bepinex-links">
              <div class="bepinex-cube">
                <a href="https://github.com/BepInEx/BepInEx" class="bepinex-link" target="_blank" rel="noopener">
                  <v-icon left color="#fc503b" size="28">mdi-github</v-icon>
                  <span>Instruccions: BepInEx a GitHub</span>
                </a>
              </div>
              <div class="bepinex-cube">
                <a href="http://localhost:3002/resources/bepinex/BepInEx_win_x64_5.4.23.3.zip" class="bepinex-link" target="_blank" rel="noopener">
                  <v-icon left color="#fc503b" size="28">mdi-zip-box</v-icon>
                  <span>Baixar BepInEx (.zip)</span>
                </a>
              </div>
              <div class="bepinex-cube">
                <a href="#" class="bepinex-link" target="_blank" rel="noopener">
                  <v-icon left color="#fc503b" size="28">mdi-play-circle</v-icon>
                  <span>Veure tutorial en vídeo (pròximament)</span>
                </a>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section class="nexus-stats" v-if="stats.totalMods > 0">
      <v-container>
        <v-row class="justify-center">
          <v-col cols="6" sm="3">
            <div class="nexus-stat-item">
              <div class="nexus-stat-value">{{ formatNumber(stats.totalDownloads) }}</div>
              <div class="nexus-stat-label">Descàrregues</div>
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
              <div class="nexus-stat-label">Membres</div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <v-container class="nexus-main-container">
      <div class="nexus-search-sort">
        <v-text-field
          v-model="search"
          label="Cercar mods..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          class="nexus-search-field"
          @input="filterMods"
        ></v-text-field>

        <v-select
          v-model="selectedTags"
          :items="allTags"
          label="Filtrer per etiquetes"
          multiple
          chips
          clearable
          outlined
          dense
          item-text="name"
          item-value="name"
        ></v-select>

        <v-select
          v-model="sortBy"
          :items="['Més descarregats', 'Més recents', 'Més valorats']"
          label="Ordenar per"
          density="compact"
          variant="outlined"
          class="nexus-sort-select"bepinex
          @update:modelValue="sortMods"
        ></v-select>
      </div>

      <div v-if="loading" class="nexus-loading">
        <v-progress-circular indeterminate color="#fc503b"></v-progress-circular>
        <p>Cargan mods...</p>
      </div>
      <div v-else>
        <div v-if="filteredMods.length === 0" class="nexus-no-mods">
          <v-icon color="#fc503b" size="48">mdi-alert-circle-outline</v-icon>
          <h3>No s'han trobat mods</h3>
          <p>Intenta amb altres termes de cerca o puja el primer mod</p>
          <v-btn color="#fc503b" @click="openUploadDialog" v-if="userEmail">
            Pujar el meu primer mod
          </v-btn>
        </div>

        <div class="mods-cubes-row">
          <div v-for="mod in filteredMods" :key="mod.id" class="mod-cube">
            <div class="mod-cube-image-wrapper">
              <img v-if="mod.image" :src="`http://localhost:3002${mod.image}`" alt="Imagen del mod" class="mod-cube-image" />
              <div v-else class="mod-cube-image-placeholder">Sense imatge</div>
            </div>
            <div class="nexus-mod-content">
              <h3 class="nexus-mod-title">{{ mod.title }}</h3>
              <p class="nexus-mod-description">{{ truncateDescription(mod.description) }}</p>
              <div class="nexus-mod-meta">
                <span class="nexus-mod-author">Per {{ mod.User.username || 'Anónimo' }}</span>
                <span class="nexus-mod-stats">
                  <v-icon small color="warning">mdi-star</v-icon>
                  {{ calculateAverageRating(mod.id) }}/5
                </span>
                <span class="nexus-mod-stats">
                  <v-icon small>mdi-comment</v-icon>
                  {{ getCommentsCountForMod(mod.id) }} comentaris
                </span>
                <span class="nexus-mod-stats" @click="toggleLike(mod.id)" style="cursor: pointer;">
                  <v-icon 
                    small
                    :color="isToggled(mod.id) ? 'blue' : undefined"
                  >
                    mdi-thumb-up
                  </v-icon>
                  {{ getLikesCountForMod(mod.id) }} ressenyes
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
                Detalls
              </v-btn>
              <v-btn
                color="#fc503b"
                variant="text"
                size="small"
                @click="downloadMod(mod)"
                class="nexus-mod-btn"
                :disabled="!mod.file_path"
              >
                Descarregar
              </v-btn>
            </div>
          </div>
        </div>
      </div>
      <div class="nexus-view-all" v-if="filteredMods.length > 0 && !loading">
        <v-btn variant="text" color="#fc503b">Veure tots</v-btn>
      </div>
    </v-container>

    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card class="nexus-dialog">
        <v-card-title class="nexus-dialog-title">
          <v-icon icon="mdi-cloud-upload" class="mr-2"></v-icon>
          Pujar Mod
        </v-card-title>
        <v-card-text>
          <v-form ref="uploadForm" @submit.prevent="uploadMod" v-model="formValid">
            <v-text-field
              v-model="title"
              label="Títol del Mod*"
              :rules="[v => !!v || 'El títol és requerit']"
              required
              variant="outlined"
              density="compact"
              class="nexus-input"
            ></v-text-field>
            
            <v-textarea
              v-model="description"
              label="Descripció*"
              :rules="[v => !!v || 'La descripció és requerida']"
              required
              variant="outlined"
              density="compact"
              rows="3"
              class="nexus-input"
            ></v-textarea>

            <v-combobox
              v-model="tags"
              label="Etiquetes*"
              :rules="[v => Array.isArray(v) && v.filter(tag => tag.trim() !== '').length > 0 || 'Introdueix una etiqueta vàlida']"
              multiple
              chips
              clearable
              small-chips
              variant="outlined"
              density="compact"
              class="nexus-input"
              required
              hint="Pressiona Enter per agregar una etiqueta"
              persistent-hint
            ></v-combobox>
            
            <v-file-input
              v-model="modFile"
              label="Arxiu del Mod (ZIP, RAR, 7Z)*"
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
              label="Imatge del Mod*"
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
              <span>Assegureu-vos dincloure instruccions de com utilitzar el mod</span>
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
            Cancel·la
          </v-btn>
          <v-btn
            color="#fc503b"
            :loading="uploading"
            :disabled="!formValid || uploading"
            @click="uploadMod"
            class="nexus-btn"
          >
            <v-icon icon="mdi-upload" start></v-icon>
            Pujar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="uploadSuccess" color="success" timeout="3000">
      {{ successMessage }}
      <template v-slot:actions>
        <v-btn variant="text" @click="uploadSuccess = false">Tancar</v-btn>
      </template>
    </v-snackbar>

    <v-snackbar v-model="uploadError" color="error" timeout="3000">
      {{ errorMessage }}
      <template v-slot:actions>
        <v-btn variant="text" @click="uploadError = false">Tancar</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getAllMods, postMod, patchDownloadMod, getAllComments, getAllLikes, postLike, deleteLike } from '@/services/communicationManager';
import { listenToModDownloads, listenToComments, listenToLikes } from '@/services/socketManager';

const stats = ref({
  totalDownloads: 0,
  totalMods: 0,
  totalMembers: 0
});
const mods = ref([]);
const comments = ref([]);
const likes = ref([]);
const loading = ref(true);
const userEmail = ref(localStorage.getItem('userEmail'));
const isAdmin = ref(localStorage.getItem('userAdmin') == 1);

const search = ref('');
const sortBy = ref('');
const selectedTags = ref([]);    

const dialog = ref(false);
const title = ref('');
const description = ref('');
const tags = ref([]);
const modFile = ref(null);
const imageFile = ref(null);
const uploading = ref(false);
const formValid = ref(false);
const uploadSuccess = ref(false);
const uploadError = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

console.log(isAdmin.value);

const navigateToMainPage = () => {
  window.location.href = '/';
};

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
  if (!dateString) return 'Data desconeguda';
  const date = new Date(dateString);
  const day = String(date.getDate());
  const month = String(date.getMonth() + 1);
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const truncateDescription = (desc) => {
  if (!desc) return '';
  return desc.length > 100 ? desc.substring(0, 100) + '...' : desc;
};

const isToggled = (modId) => {
  return likes.value.some(like => like.modId === modId && like.email === userEmail.value);
};

const fetchMods = async () => {
    loading.value = true;

  try {
    const response = await getAllMods();

    if (!response) {
      errorMessage.value = 'Error de xarxa o problema al servidor';
      uploadError.value = true;
      loading.value = false;
      return;
    }

    const data = await response.json();

    if(!response.ok) {
      errorMessage.value = data.error || 'Error en obtenir tots els mods';
      uploadError.value = true;
      loading.value = false;
      return;
    }

    mods.value = data;
    
    stats.value = {
      totalDownloads: mods.value.reduce((sum, mod) => sum + (mod.downloads || 0), 0),
      totalMods: mods.value.length,
      totalMembers: new Set(mods.value.map(mod => mod.uploaded_by)).size
    };
  } catch {
    errorMessage.value = 'Error inesperat en obtenir tots els mods';
    uploadError.value = true;
  } finally {
    loading.value = false;
  }
};

const fetchComments = async () => {
  try {
    const response = await getAllComments();

    if (!response) {
      console.error("Error de xarxa o problema al servidor");
      return;
    }

    const data = await response.json();

    if(!response.ok) {
      console.error('Error en obtenir tots els comentaris');
      return;
    }

    comments.value = data;
  } catch {
    console.error('Error inesperat en obtenir tots els comentaris');
  }
}

const fetchLikes = async () => {
  try {
    const response = await getAllLikes();

    if (!response) {
      console.error("Error de xarxa o problema al servidor");
      return;
    }

    const data = await response.json();

    if(!response.ok) {
      console.error(data.error || 'Error en obtenir tots els likes');
      return;
    }

    likes.value = data;
  } catch {
    console.error('Error inesperat en obtenir tots els likes');
  }
}

const allTags = computed(() => {
  const set = new Set();

  mods.value.forEach(mod => {
    console.log('Mod:', mod.title, 'Tags:', mod.tags);
    mod.tags.forEach(tag => {
      set.add(tag.name);
    });
  });

  const tagsArray = Array.from(set);
  return tagsArray;
});

const filteredMods = computed(() => {
  let result = [...mods.value];

  const ratingsMap = comments.value.reduce((acc, comment) => {
    const { modId, rating } = comment;
    if (!acc[modId]) {
      acc[modId] = { total: 0, count: 0 };
    }
    acc[modId].total += rating;
    acc[modId].count += 1;
    return acc;
  }, {});
  
  if (search.value) {
    const searchTerm = search.value.toLowerCase();
    result = result.filter(mod => 
      mod.title.toLowerCase().includes(searchTerm) || 
      (mod.description && mod.description.toLowerCase().includes(searchTerm)) ||
      (mod.author && mod.author.toLowerCase().includes(searchTerm))
    );
  }

  if (selectedTags.value && selectedTags.value.length > 0) {

    result = result.filter(mod => {
      const modTagNames = mod.tags.map(tag => tag.name);

      const matchesAll = selectedTags.value.every(tag => modTagNames.includes(tag));
      
      return matchesAll;
    });
  }
  
  switch (sortBy.value) {
    case 'Més descarregats':
      return result.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    case 'Més recents':
      return result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    case 'Més valorats':
      return result.sort((a, b) => {
        const aRating = ratingsMap[a.id]
          ? ratingsMap[a.id].total / ratingsMap[a.id].count
          : 0;
        const bRating = ratingsMap[b.id]
          ? ratingsMap[b.id].total / ratingsMap[b.id].count
          : 0;
        return bRating - aRating;
      });
    default:
      return result;
  }
});

const openUploadDialog = () => {
  if (!userEmail.value) {
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

const responseFromServer = async (response) => {
  if(!response) {
    errorMessage.value = 'Error de xarxa o problema al servidor';
    uploadError.value = true;
    return;
  }

  const data = await response.json();

  if(!response.ok) {
    errorMessage.value = data.error || "Error en l'operació";
    uploadError.value = true;
    return;
  }
}

const toggleLike = async (modId) => {
  if (!userEmail.value) {
    errorMessage.value = 'Necessites iniciar sessió per donar like';
    uploadError.value = true;
    return;
  }

  try {
    const existingLike = likes.value.find(
      like => like.modId === modId && like.email === userEmail.value
    );

    let response;
    if(!existingLike) {
      response = await postLike(modId, userEmail.value);
      await responseFromServer(response);
    }
    else {
      response = await deleteLike(modId, userEmail.value);
      await responseFromServer(response);
    }
  } catch (error) {
    errorMessage.value = existingLike
      ? 'Error inesperat en eliminar el like'
      : 'Error inesperat en registrar el like';
    uploadError.value = true;
  }
};

const uploadMod = async () => {
  if (!formValid.value) return;
  uploading.value = true;
  
  const formData = new FormData();
  formData.append('title', title.value);
  formData.append('description', description.value);
  formData.append('modFile', modFile.value);
  formData.append('imageFile', imageFile.value);
  formData.append('email', userEmail.value);
  formData.append('tags', JSON.stringify(tags.value));
  
  try {
    const response = await postMod(formData);

    if(!response) {
      errorMessage.value = 'Error de xarxa o problema al servidor';
      uploadError.value = true;
      uploading.value = false;
      return;
    }

    const data = await response.json();

    if(!response.ok) {
      errorMessage.value = data.error || 'Error en pujar el mod'
      uploadError.value = true;
      uploading.value = false;
      return;
    }

    successMessage.value = data.message || 'Mod subido correctamente';
    uploadSuccess.value = true;
    closeDialog();
    
    await fetchMods();
  } catch {
    errorMessage.value = 'Error inesperat en pujar el mod';
    uploadError.value = true;
  } finally {
    uploading.value = false;
  }
};

const downloadMod = async (mod) => {
  if (!mod || !mod.file_path) {
    errorMessage.value = 'El mod no té un fitxer associat';
    uploadError.value = true;
    return;
  }
  
  try {
    const response = await patchDownloadMod(mod.id);

    if(!response) {
      errorMessage.value = 'Error de xarxa o problema al servidor';
      uploadError.value = true;
      return;
    }

    const data = await response.json();
    
    if(!response.ok) {
      errorMessage.value = data.error || 'Error en descarregar el mod'
      uploading.value = false;
      return;
    }

    successMessage.value = data.message || 'Descàrrega exitosa';
    uploadSuccess.value = true;
    
    const link = document.createElement('a');
    link.href = `http://localhost:3002${mod.file_path}`;
    link.setAttribute('download', `${mod.title || 'mod'}.zip`);
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch {
    errorMessage.value = 'Error inesperat en descarregar el mod';
    uploadError.value = true;
  }
};

const navigateToMod = (id) => {
  window.location.href = `/mod/${id}`;
};

const logout = () => {
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userAdmin');
  userEmail.value = null;
  isAdmin.value = null;
  window.location.href = '/';
};

onMounted(async () => {
  await fetchMods();
  await fetchComments();
  await fetchLikes();
  listenToModDownloads(mods, stats);
  listenToComments(comments);
  listenToLikes(likes);
});
</script>

<style scoped>
.nexus-style {
  background: #0d0d0d;
  color: #ffffff;
  min-height: 100vh;
}

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
  gap: 10px;
}

.nexus-login-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: normal;
  font-size: 0.8rem;
  padding: 0 12px;
  height: 36px;
}

.nexus-login-btn .v-btn__content {
  display: flex;
  align-items: center;
  gap: 6px;
}

.nexus-nav-links {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 20px;
}

.nexus-nav-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: normal;
}

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

.nexus-main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 15px;
}

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
  min-width: 0;
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