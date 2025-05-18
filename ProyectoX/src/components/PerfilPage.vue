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
          @click="$router.push('/')"
        ></v-img>
      </div>
      
      <v-spacer></v-spacer>
      
      <div class="nexus-user-section">
        <v-btn
          color="#fc503b"
          class="nexus-login-btn"
          to="/mods"
          text
          :ripple="false"
        >
          Explorar Mods
        </v-btn>
        <v-btn
          color="#fc503b"
          class="nexus-login-btn"
          @click="logout"
          text
          :ripple="false"
        >
          Tancar Sessió
        </v-btn>
      </div>
    </v-app-bar>

    <!-- Contenido principal con padding-top para evitar que el header fijo tape contenido -->
    <div class="nexus-content-wrapper">
      <v-container class="nexus-main-container">
        <!-- Portada/Banner al estilo GitHub -->
        <div class="nexus-profile-banner"></div>
        
        <!-- Sección de perfil con avatar posicionado sobre el banner -->
        <div class="nexus-profile-section">
          <div class="nexus-profile-left">
            <div class="nexus-avatar-container" @click="triggerFileInput">
              <v-avatar class="nexus-profile-avatar" size="160">
                <v-img :src="'http://localhost:3002' + user.avatar" />
              </v-avatar>
              <div class="nexus-avatar-overlay">
                <v-icon size="32">mdi-camera</v-icon>
                <span>Canviar foto</span>
              </div>
              <input 
                type="file" 
                ref="avatarInput"
                @change="handleAvatarChange"
                accept="image/*"
                style="display: none"
              />
            </div>
          </div>
          
          <div class="nexus-profile-right">
            <div class="nexus-profile-info">
              <h1 class="nexus-profile-username">{{ user.username }}</h1>
              <p class="nexus-profile-email">{{ user.email }}</p>
              
              <div class="nexus-profile-stats">
                <div class="nexus-stat-item">
                  <div class="nexus-stat-value">{{ user.mods?.length || 0 }}</div>
                  <div class="nexus-stat-label">Mods</div>
                </div>
                <div class="nexus-stat-item">
                  <div class="nexus-stat-value">{{ totalDownloads }}</div>
                  <div class="nexus-stat-label">Descàrregues</div>
                </div>
                <div class="nexus-stat-item">
                  <div class="nexus-stat-value">0</div>
                  <div class="nexus-stat-label">M'agrada</div>
                </div>
              </div>
              
              <v-btn 
                color="#fc503b" 
                variant="outlined"
                @click="editPerfil = true"
                class="nexus-edit-btn"
              >
                <v-icon left>mdi-pencil</v-icon>
                Editar perfil
              </v-btn>
            </div>
          </div>
        </div>

        <!-- Tabs de navegación fijados debajo del perfil -->
        <div class="nexus-tabs-container">
          <v-tabs v-model="tab" color="#fc503b" class="nexus-tabs">
            <v-tab value="mods">
              <v-icon left>mdi-puzzle</v-icon>
              Els meus Mods
            </v-tab>
            <v-tab value="activity">
              <v-icon left>mdi-chart-line</v-icon>
              Estadístiques
            </v-tab>
            <v-tab value="settings">
              <v-icon left>mdi-cog</v-icon>
              Configuració
            </v-tab>
          </v-tabs>
        </div>

        <v-window v-model="tab" class="nexus-tab-content">
          <v-window-item value="mods">
            <!-- Lista de Mods -->
            <div class="nexus-mods-container">
              <div class="nexus-mods-header">
                <h2 class="nexus-mods-title">Els meus Mods</h2>
                <v-btn 
                  color="#fc503b" 
                  to="/upload-mod"
                  class="nexus-new-mod-btn"
                >
                  <v-icon left>mdi-plus</v-icon>
                  Nou Mod
                </v-btn>
              </div>
              
              <div v-if="user.mods?.length === 0" class="nexus-no-mods">
                <div class="nexus-no-mods-content">
                  <v-icon color="#fc503b" size="64">mdi-puzzle-remove-outline</v-icon>
                  <h3>No tens mods pujats</h3>
                  <p>Comença a compartir les teves creacions amb la comunitat</p>
                  <v-btn 
                    color="#fc503b" 
                    to="/upload-mod"
                    class="nexus-btn"
                  >
                    <v-icon left>mdi-upload</v-icon>
                    Puja el teu primer mod
                  </v-btn>
                </div>
              </div>

              <div v-else class="nexus-mods-grid">
                <div v-for="mod in user.mods" :key="mod.id" class="nexus-mod-card">
                  <div class="nexus-mod-image-container">
                    <img 
                      v-if="mod.image" 
                      :src="`http://localhost:3002${mod.image}`" 
                      alt="Imatge del mod" 
                      class="nexus-mod-image" 
                    />
                    <div v-else class="nexus-mod-image-placeholder">
                      <v-icon size="48" color="#fc503b">mdi-puzzle</v-icon>
                    </div>
                  </div>
                  
                  <div class="nexus-mod-details">
                    <div class="nexus-mod-header">
                      <h3 class="nexus-mod-title">{{ mod.title }}</h3>
                      <div class="nexus-mod-visibility">
                        <v-chip 
                          small 
                          :color="mod.visible ? 'success' : 'grey'" 
                          text-color="white"
                        >
                          {{ mod.visible ? 'Públic' : 'Privat' }}
                        </v-chip>
                      </div>
                    </div>
                    
                    <p class="nexus-mod-description">{{ truncateDescription(mod.description) }}</p>
                    
                    <div class="nexus-mod-footer">
                      <div class="nexus-mod-stats">
                        <div class="nexus-mod-stat">
                          <v-icon small>mdi-download</v-icon>
                          {{ mod.downloads || 0 }} descàrregues
                        </div>
                        <div class="nexus-mod-stat">
                          <v-icon small>mdi-calendar</v-icon>
                          {{ formatDate(mod.uploaded_at) }}
                        </div>
                      </div>
                      
                      <div class="nexus-mod-actions">
                        <v-btn
                          color="#fc503b"
                          variant="text"
                          size="small"
                          @click="openEditDialogMod(mod)"
                          class="nexus-mod-btn"
                        >
                          Editar
                        </v-btn>
                        <v-btn
                          color="#fc503b"
                          variant="text"
                          size="small"
                          @click="updateVisible(mod.id)"
                          class="nexus-mod-btn"
                        >
                          <v-icon>{{ mod.visible ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                        </v-btn>
                        <v-btn
                          color="#fc503b"
                          variant="text"
                          size="small"
                          @click="deleteMod(mod.id)"
                          class="nexus-mod-btn"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-window-item>
          
          <v-window-item value="activity">
            <div class="nexus-activity-container">
              <h2 class="nexus-section-title">Estadístiques</h2>
              <div class="nexus-stats-cards">
                <v-card class="nexus-stat-card">
                  <v-card-title>Descàrregues totals</v-card-title>
                  <v-card-text>
                    <div class="nexus-stat-value">{{ totalDownloads }}</div>
                  </v-card-text>
                </v-card>
                
                <v-card class="nexus-stat-card">
                  <v-card-title>Mods populars</v-card-title>
                  <v-card-text>
                    <div v-if="topMods.length > 0">
                      <div v-for="mod in topMods" :key="mod.id" class="nexus-popular-mod">
                        <span class="nexus-popular-mod-name">{{ mod.title }}</span>
                        <span class="nexus-popular-mod-downloads">{{ mod.downloads }} descàrregues</span>
                      </div>
                    </div>
                    <div v-else class="nexus-no-stats">
                      No hi ha dades suficients
                    </div>
                  </v-card-text>
                </v-card>
              </div>
            </div>
          </v-window-item>
          
          <v-window-item value="settings">
            <div class="nexus-settings-container">
              <h2 class="nexus-section-title">Configuració del compte</h2>
              <v-card class="nexus-settings-card">
                <v-card-text>
                  <v-list>
                    <v-list-item @click="editPerfil = true">
                      <template v-slot:prepend>
                        <v-icon>mdi-account</v-icon>
                      </template>
                      <v-list-item-title>Editar perfil</v-list-item-title>
                      <template v-slot:append>
                        <v-icon>mdi-chevron-right</v-icon>
                      </template>
                    </v-list-item>
                    
                    <v-divider></v-divider>
                    
                    <v-list-item @click="changePasswordDialog = true">
                      <template v-slot:prepend>
                        <v-icon>mdi-lock</v-icon>
                      </template>
                      <v-list-item-title>Canviar contrasenya</v-list-item-title>
                      <template v-slot:append>
                        <v-icon>mdi-chevron-right</v-icon>
                      </template>
                    </v-list-item>
                    
                    <v-divider></v-divider>
                    
                    <v-list-item @click="logout">
                      <template v-slot:prepend>
                        <v-icon color="error">mdi-logout</v-icon>
                      </template>
                      <v-list-item-title class="text-error">Tancar sessió</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </div>
          </v-window-item>
        </v-window>

        <!-- Diálogo para editar mod -->
        <v-dialog v-model="editMod" max-width="600" class="nexus-dialog">
          <v-card>
            <v-card-title class="nexus-dialog-title">
              <v-icon icon="mdi-pencil" class="mr-2"></v-icon>
              Editar Mod
            </v-card-title>
            <v-card-text>
                <v-text-field 
                  v-model="newInformationMod.title" 
                  label="Títol del Mod" 
                  variant="outlined"
                  class="nexus-input"
                />
                <v-textarea 
                  v-model="newInformationMod.description" 
                  label="Descripció" 
                  variant="outlined"
                  class="nexus-input"
                  rows="3"
                />
                <v-file-input 
                  v-model="newInformationMod.modFile" 
                  label="Arxiu del Mod (deixa en blanc per no canviar)" 
                  variant="outlined"
                  class="nexus-input"
                  prepend-icon="mdi-paperclip"
                />
            </v-card-text>
            <v-card-actions class="nexus-dialog-actions">
              <v-spacer />
              <v-btn 
                variant="outlined"
                @click="editMod = false"
                class="nexus-btn"
              >
                Cancel·lar
              </v-btn>
              <v-btn 
                color="#fc503b" 
                :loading="loading" 
                @click="updateMod"
                class="nexus-btn"
              >
                Actualitzar mod
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Diálogo para editar perfil -->
        <v-dialog v-model="editPerfil" max-width="500" class="nexus-dialog">
          <v-card>
            <v-card-title class="nexus-dialog-title">
              <v-icon icon="mdi-account-edit" class="mr-2"></v-icon>
              Editar Perfil
            </v-card-title>
            <v-card-text>
              <v-text-field 
                v-model="newInformationUser.username" 
                label="Nom d'usuari" 
                variant="outlined"
                class="nexus-input"
              />
              <v-divider class="my-4"></v-divider>
              <v-text-field 
                v-model="newInformationUser.newPassword" 
                label="Nova contrasenya" 
                type="password" 
                variant="outlined"
                class="nexus-input"
              />
              <v-text-field 
                v-model="newInformationUser.confirmPassword" 
                label="Confirmar contrasenya" 
                type="password" 
                variant="outlined"
                class="nexus-input"
              />
            </v-card-text>
            <v-card-actions class="nexus-dialog-actions">
              <v-spacer />
              <v-btn 
                variant="outlined"
                @click="editPerfil = false"
                class="nexus-btn"
              >
                Cancel·lar
              </v-btn>
              <v-btn 
                color="#fc503b" 
                :loading="loading" 
                @click="updateProfile"
                class="nexus-btn"
              >
                Guardar canvis
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-snackbar
          v-model="snackbar.show"
          :color="snackbar.color"
          timeout="3000"
          class="nexus-snackbar"
        >
        {{ snackbar.text }}
        <template v-slot:actions>
          <v-btn
            variant="text"
            @click="snackbar.show = false"
            class="nexus-btn"
          >
            Tancar
          </v-btn>
        </template>
        </v-snackbar>
      </v-container>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { loadUserData, putUserProfile, putMod, changeVisible, deleteModSequelize } from "../services/communicationManager.js";

const router = useRouter();
const user = ref({ mods: [] });
const editMod = ref(false);
const loading = ref(false);
const editPerfil = ref(false);
const changePasswordDialog = ref(false);
const userEmail = ref(localStorage.getItem('userEmail'));
const tab = ref('mods');
const avatarInput = ref(null);

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

// Computed properties
const totalDownloads = computed(() => {
  return user.value.mods?.reduce((total, mod) => total + (mod.downloads || 0), 0) || 0;
});

const topMods = computed(() => {
  if (!user.value.mods) return [];
  return [...user.value.mods]
    .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
    .slice(0, 3);
});

const fetchUser = async () => {
  const response = await loadUserData(userEmail.value);
  if (!response.ok) throw new Error('Error en la resposta del servidor');

  const data = await response.json();
  user.value = data;
}

const triggerFileInput = () => {
  avatarInput.value.click();
};

const handleAvatarChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    newInformationUser.value.newAvatar = file;
    updateProfile();
  }
};

const updateProfile = async () => {
  loading.value = true;

  const formData = new FormData();
  formData.append('email', userEmail.value);
  if (newInformationUser.value.username) formData.append('username', newInformationUser.value.username);
  
  if (newInformationUser.value.newPassword) {
    if (newInformationUser.value.newPassword !== newInformationUser.value.confirmPassword) {
      snackbar.value = {
        show: true,
        text: 'Les contrasenyes no coincideixen',
        color: 'error'
      };
      loading.value = false;
      return;
    }
    formData.append('newPassword', newInformationUser.value.newPassword);
  }

  if (newInformationUser.value.newAvatar) {
    formData.append('newAvatar', newInformationUser.value.newAvatar);
  }

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

    const data = await response.json();
    snackbar.value = {
      show: true,
      text: data.message,
      color: 'success'
    };
    
    editPerfil.value = false;
    newInformationUser.value.newPassword = '';
    newInformationUser.value.confirmPassword = '';
    fetchUser();
  } catch (err) {
    console.error(err);
    snackbar.value = {
      show: true,
      text: 'Error en actualitzar el perfil',
      color: 'error'
    };
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

const updateVisible = async (modId) => {
  try {
    const response = await changeVisible(modId);

    if(!response) {
      snackbar.value = {
        show: true,
        text: 'Error de xarxa o problema al servidor',
        color: 'error'
      };
      return;
    }

    const data = await response.json();

    if (!response.ok) {
      snackbar.value = {
        show: true,
        text: data.error || 'Error en actualitzar la visibilitat',
        color: 'error'
      };
      return;
    }

    snackbar.value = {
      show: true,
      text: data.message || 'Visibilitat actualitzada correctament',
      color: 'success'
    };

    fetchUser();
  } catch (error) {
    snackbar.value = {
      show: true,
      text: 'Error inesperat en actualitzar la visibilitat del mod',
      color: 'error'
    };
  } 
}

// Hecho
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

    if (!response) {
      snackbar.value = {
        show: true,
        text: 'Error de xarxa o problema al servidor',
        color: 'error'
      }
      loading.value = false;
      return;
    }

    const data = await response.json();

    if (!response.ok) {
      snackbar.value = {
        show: true,
        text: data.error,
        color: 'error'
      };
      return;
    }

    snackbar.value = {
      show: true,
      text: data.message,
      color: 'success'
    };
    
    await fetchUser();
    editMod.value = false;
  } catch (err) {
    console.error(err);
    snackbar.value = {
      show: true,
      text: 'Error en actualitzar el mod',
      color: 'error'
    };
  } finally {
    loading.value = false;
  }
}

// Hecho
const deleteMod = async (modId) => {
  try {
    const response = await deleteModSequelize(modId);

    if (!response) {
      snackbar.value = {
        show: true,
        text: 'Error de xarxa o problema al servidor',
        color: 'error'
      }
      return;
    }

    const data = await response.json();

    if (!response.ok) {
      snackbar.value = {
        show: true,
        text: data.error || 'Error en eliminar el mod',
        color: 'error'
      };
      return;
    }

    snackbar.value = {
      show: true,
      text: data.message || 'Mod eliminat correctament',
      color: 'success'
    }

    fetchUser();
  } catch (err) {
    snackbar.value = {
      show: true,
      text: 'Error inesperat en eliminar el mod',
      color: 'error'
    }
  }
}

const truncateDescription = (desc) => {
  if (!desc) return '';
  return desc.length > 100 ? desc.substring(0, 100) + '...' : desc;
};

const formatDate = (dateString) => {
  if (!dateString) return 'Data desconeguda';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('ca-ES', options);
};

const logout = () => {
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userAdmin');
  router.push('/');
};

onMounted(fetchUser);
</script>

<style scoped>
/* Estilos generales */
.nexus-style {
  background: #0d0d0d;
  color: #ffffff;
  min-height: 100vh;
}

/* Contenedor principal con padding para evitar que el header fijo tape el contenido */
.nexus-content-wrapper {
  padding-top: 60px; /* Misma altura que el header */
}

.nexus-main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px 40px;
}

/* Header */
.nexus-header {
  background-color: rgba(13, 13, 13, 0.95) !important;
  backdrop-filter: blur(5px);
  border-bottom: 1px solid #252525;
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
  transition: transform 0.3s;
  border: 2px solid #fc503b;
}

.nexus-logo:hover {
  transform: scale(1.05);
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
}

/* Banner al estilo GitHub */
.nexus-profile-banner {
  height: 200px;
  background: linear-gradient(to right, #0d0d0d, #1a1a1a);
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid #252525;
  margin-bottom: -80px; /* Esto hará que el avatar se superponga al banner */
  position: relative;
}

/* Profile Section */
.nexus-profile-section {
  display: flex;
  gap: 32px;
  margin-bottom: 32px;
  padding: 0 24px;
  position: relative;
}

.nexus-profile-left {
  flex: 0 0 auto;
  position: relative;
  margin-top: -20px; /* Para ajustar la posición y que sobresalga del banner */
}

.nexus-profile-right {
  flex: 1;
  padding-top: 80px; /* Espacio para evitar solapamiento con el avatar */
}

.nexus-avatar-container {
  position: relative;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.3s;
  z-index: 10;
}

.nexus-avatar-container:hover .nexus-avatar-overlay {
  opacity: 1;
}

.nexus-avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  color: white;
}

.nexus-profile-avatar {
  border: 3px solid #fc503b;
  box-shadow: 0 0 20px rgba(252, 80, 59, 0.3);
  background-color: #0d0d0d; /* Fondo para que no se vea a través */
}

.nexus-profile-info {
  padding-top: 12px;
}

.nexus-profile-username {
  font-size: 2rem;
  font-weight: 600;
  color: #fc503b;
  margin-bottom: 4px;
}

.nexus-profile-email {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 20px;
}

.nexus-profile-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.nexus-stat-item {
  text-align: center;
}

.nexus-stat-value {
  font-size: 1.4rem;
  font-weight: 600;
  color: #fc503b;
  margin-bottom: 4px;
}

.nexus-stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.nexus-edit-btn {
  text-transform: none;
  font-weight: 500;
}

/* Tabs al estilo GitHub */
.nexus-tabs-container {
  border-bottom: 1px solid #252525;
  background: #161616;
  padding: 0 24px;
  margin-bottom: 24px;
  border-radius: 0 0 8px 8px;
  position: sticky;
  top: 60px; /* Misma altura que el header */
  z-index: 900;
}

.nexus-tabs {
  background: transparent !important;
}

.nexus-tab-content {
  background: transparent;
  padding: 0 24px;
}

/* Mods Section */
.nexus-mods-container {
  background: transparent;
}

.nexus-mods-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.nexus-mods-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #fc503b;
}

.nexus-new-mod-btn {
  text-transform: none;
  font-weight: 500;
}

.nexus-mods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.nexus-mod-card {
  background: #161616;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #252525;
  transition: all 0.2s;
}

.nexus-mod-card:hover {
  border-color: #fc503b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(252, 80, 59, 0.1);
}

.nexus-mod-image-container {
  width: 100%;
  height: 180px;
  background: #0d0d0d;
  overflow: hidden;
  position: relative;
}

.nexus-mod-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.nexus-mod-card:hover .nexus-mod-image {
  transform: scale(1.05);
}

.nexus-mod-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #121212;
}

.nexus-mod-details {
  padding: 16px;
}

.nexus-mod-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.nexus-mod-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #fc503b;
  margin: 0;
}

.nexus-mod-visibility {
  margin-left: 8px;
}

.nexus-mod-description {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 16px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.nexus-mod-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nexus-mod-stats {
  display: flex;
  gap: 12px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

.nexus-mod-stat {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nexus-mod-actions {
  display: flex;
  gap: 8px;
}

.nexus-mod-btn {
  text-transform: none;
  font-size: 0.8rem;
}

/* No Mods State */
.nexus-no-mods {
  background: #161616;
  border-radius: 8px;
  border: 1px dashed #252525;
  padding: 40px;
  text-align: center;
}

.nexus-no-mods-content {
  max-width: 400px;
  margin: 0 auto;
}

.nexus-no-mods h3 {
  color: #fc503b;
  margin: 15px 0 10px;
  font-size: 1.2rem;
}

.nexus-no-mods p {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 20px;
  font-size: 0.9rem;
}

/* Activity Section */
.nexus-activity-container {
  background: transparent;
}

.nexus-section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #fc503b;
  margin-bottom: 24px;
}

.nexus-stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.nexus-stat-card {
  background: #161616;
  border-radius: 8px;
  border: 1px solid #252525;
}

.nexus-stat-value {
  font-size: 2rem;
  font-weight: 600;
  color: #fc503b;
}

.nexus-popular-mod {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #252525;
}

.nexus-popular-mod:last-child {
  border-bottom: none;
}

.nexus-popular-mod-name {
  color: rgba(255, 255, 255, 0.9);
}

.nexus-popular-mod-downloads {
  color: #fc503b;
  font-weight: 500;
}

.nexus-no-stats {
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  padding: 20px 0;
}

/* Settings Section */
.nexus-settings-container {
  background: transparent;
}

.nexus-settings-card {
  background: #161616;
  border-radius: 8px;
  border: 1px solid #252525;
}

/* Diálogos */
.nexus-dialog {
  background: rgba(13, 13, 13, 0.95);
}

.nexus-dialog-title {
  background: #161616;
  border-bottom: 1px solid #252525;
  padding: 16px 24px;
  color: #fc503b;
  font-weight: 600;
}

.nexus-dialog-actions {
  background: #161616;
  border-top: 1px solid #252525;
  padding: 16px 24px;
}

.nexus-input {
  background: #161616;
  border-color: #252525 !important;
}

.nexus-input :deep(.v-field__outline) {
  color: #252525 !important;
}

.nexus-btn {
  text-transform: none;
  font-weight: 500;
}

/* Snackbar */
.nexus-snackbar {
  font-family: inherit;
}

/* Responsive */
@media (max-width: 960px) {
  .nexus-profile-section {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .nexus-profile-stats {
    justify-content: center;
  }
  
  .nexus-mods-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}

@media (max-width: 600px) {
  .nexus-profile-username {
    font-size: 1.5rem;
  }
  
  .nexus-profile-stats {
    flex-direction: column;
    gap: 16px;
  }
  
  .nexus-mods-grid {
    grid-template-columns: 1fr;
  }
}
</style>