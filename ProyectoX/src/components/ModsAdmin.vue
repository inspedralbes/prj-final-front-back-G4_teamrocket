<template>
  <div class="nexus-mods-admin">
    <!-- Fondo Three.js -->
    <div id="threejs-background" ref="threeContainer"></div>
    
    <!-- Capçalera amb efecte de lluminositat -->
    <div class="admin-header glow-effect">
      <div class="header-content">
        <v-icon color="#fc503b" size="32" class="mr-3">mdi-puzzle</v-icon>
        <h2 class="admin-title">
          Gestió de Mods
          <div class="title-underline"></div>
        </h2>
      </div>
      
      <!-- Filtres premium -->
      <div class="filters-container">
        <v-btn-toggle
          v-model="selectedFilter"
          mandatory
          class="nexus-filter-toggle"
          color="#fc503b"
        >
          <v-tooltip location="bottom" text="Mostrar tots els mods">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                value="all"
                class="filter-btn"
              >
                <v-icon left>mdi-format-list-bulleted</v-icon>
                Tots els mods
              </v-btn>
            </template>
          </v-tooltip>

          <v-tooltip location="bottom" text="Mostrar només mods verificats">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                value="safe"
                class="filter-btn"
              >
                <v-icon left>mdi-shield-check</v-icon>
                Mods segurs
              </v-btn>
            </template>
          </v-tooltip>

          <v-tooltip location="bottom" text="Mostrar mods pendents de revisió">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                value="unsafe"
                class="filter-btn"
              >
                <v-icon left>mdi-alert</v-icon>
                Mods no segurs
              </v-btn>
            </template>
          </v-tooltip>
        </v-btn-toggle>

        <v-text-field
          v-model="searchQuery"
          placeholder="Cercar mods..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          class="search-input"
          hide-details
          clearable
        ></v-text-field>
      </div>
    </div>

    <!-- Targeta de taula amb efecte d'elevació -->
    <v-card 
      class="mods-table-card elevation-8"
      :class="{ 'loading': isLoading }"
    >
      <!-- Skeleton loader -->
      <div v-if="isLoading" class="skeleton-loader">
        <div v-for="i in 5" :key="i" class="skeleton-row"></div>
      </div>

      <!-- Taula de mods -->
      <v-data-table
        v-else
        :headers="headers"
        :items="filteredMods"
        :search="searchQuery"
        class="mods-table"
        :loading="isLoading"
        loading-text="Carregant mods..."
        no-data-text="No s'han trobat mods"
      >
        <!-- Columna de seguretat amb animació -->
        <template v-slot:item.security="{ item }">
          <v-fade-transition>
            <v-switch
              v-model="item.security"
              @change="toggleSafety(item)"
              color="#fc503b"
              hide-details
              inset
              :loading="item.updating"
            >
              <template v-slot:label>
                <span :class="item.security ? 'text-success' : 'text-warning'">
                  {{ item.security ? 'Verificat' : 'Pendent' }}
                </span>
              </template>
            </v-switch>
          </v-fade-transition>
        </template>

        <!-- Columna d'accions amb efecte hover -->
        <template v-slot:item.actions="{ item }">
          <div class="actions-container">
            <v-btn
              color="#fc503b"
              variant="tonal"
              size="small"
              :href="`http://localhost:3002${item.file_path}`"
              target="_blank"
              class="action-btn download-btn"
            >
              <v-icon left>mdi-download</v-icon>
              Descarregar
              <v-tooltip activator="parent" location="top">Descarregar arxiu</v-tooltip>
            </v-btn>
          </div>
        </template>

        <!-- Columna de data formatejada -->
        <template v-slot:item.uploaded_at="{ item }">
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <span v-bind="props">{{ formatDate(item.uploaded_at) }}</span>
            </template>
            <span>{{ new Date(item.uploaded_at).toLocaleString() }}</span>
          </v-tooltip>
        </template>

        <!-- Missatge quan no hi ha resultats -->
        <template v-slot:no-results>
          <div class="no-results">
            <v-icon color="#fc503b" size="48">mdi-magnify-close</v-icon>
            <h3>No s'han trobat mods</h3>
            <p>Prova amb altres termes de cerca</p>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Notificació d'estat -->
    <v-snackbar v-model="showNotification" :color="notificationColor" timeout="3000">
      {{ notificationMessage }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { changeSecurity, getModsAdmin } from '@/services/communicationManager';
import { listenChangeSecurityModAdmin, listenNewModsAdmin } from '@/services/socketManager';

// Variables d'estat
const mods = ref([]);
const selectedFilter = ref('all');
const searchQuery = ref('');
const isLoading = ref(true);
const showNotification = ref(false);
const notificationMessage = ref('');
const notificationColor = ref('');
const threeContainer = ref(null);

// Variables Three.js
let scene, camera, renderer, particles, raycaster, mouse;
let animationId = null;
let hoveredParticle = null;

const initThreeJS = () => {
  // Escena
  scene = new THREE.Scene();
  scene.background = null;

  // Càmera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  // Renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  threeContainer.value.appendChild(renderer.domElement);

  // Crear partícules
  createParticles();

  // Animació
  const animate = () => {
    animationId = requestAnimationFrame(animate);
    
    // Rotació suau
    if (particles) {
      particles.rotation.x += 0.0002;
      particles.rotation.y += 0.0003;
    }
    
    renderer.render(scene, camera);
  };

  animate();
  window.addEventListener('resize', handleResize);
};

const createParticles = () => {
  const particleCount = 150;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  // Crear textura per a partícules rodones
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(252,80,59,1)');
  gradient.addColorStop(0.7, 'rgba(252,80,59,0.8)');
  gradient.addColorStop(1, 'rgba(252,80,59,0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(32, 32, 32, 0, Math.PI * 2);
  ctx.fill();

  const particleTexture = new THREE.CanvasTexture(canvas);

  // Posicions i colors
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

    // Colors en tons vermells/taronja
    colors[i * 3] = 0.9 + Math.random() * 0.1;
    colors[i * 3 + 1] = 0.2 + Math.random() * 0.2;
    colors[i * 3 + 2] = 0.1 + Math.random() * 0.1;

    sizes[i] = 1.5;
  }

  const particlesGeometry = new THREE.BufferGeometry();
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const particlesMaterial = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    alphaMap: particleTexture,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
    depthWrite: false
  });

  particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);
};

const handleResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

const cleanUpThreeJS = () => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  window.removeEventListener('resize', handleResize);
  if (renderer) {
    renderer.dispose();
  }
  if (threeContainer.value && threeContainer.value.firstChild) {
    threeContainer.value.removeChild(threeContainer.value.firstChild);
  }
};

// Capçaleres de la taula
const headers = [
  { title: 'Títol', key: 'title', width: '25%' },
  { title: 'Autor', key: 'username', width: '20%' },
  { title: 'Estat', key: 'security', align: 'center', width: '15%' },
  { title: 'Data de pujada', key: 'uploaded_at', width: '20%' },
  { title: 'Accions', key: 'actions', align: 'center', sortable: false, width: '20%' }
];

const filteredMods = computed(() => {
  return mods.value.map(mod => ({
    ...mod,
    updating: false
  })).filter(mod => {
    if (selectedFilter.value === 'safe') return mod.security;
    if (selectedFilter.value === 'unsafe') return !mod.security;
    return true;
  });
});

// Hecho
const fetchModsAdmin = async () => {
  try {
    const response = await getModsAdmin();

    if(!response) {
      console.log('Error de xarxa o problema al servidor');
      notificationMessage.value = 'Error de xarxa o problema al servidor';
      notificationColor.value = 'error';
      showNotification.value = true;
      return;
    }

    const data = await response.json();

    if(!response.ok) {
      console.log('Error en obtenir tots els mods');
      notificationMessage.value = 'Error en obtenir tots els mods';
      notificationColor.value = 'error';
      showNotification.value = true;
      return;
    }

    mods.value = data.mods;
  } catch (error) {
    console.log('Error inesperat en obtenir tots els mods', error);
    notificationMessage.value = 'Error inesperat en obtenir tots els mods';
    notificationColor.value = 'error';
    showNotification.value = true;
  }
}

// Hecho
const toggleSafety = async (mod) => {
  const previousValue = mod.security;
  mod.updating = true;

  try {
    const response = await changeSecurity(mod.id);

    if (!response) {
      notificationMessage.value = 'Error de xarxa o problema al servidor'
      notificationColor.value = 'error';
      showNotification.value = true;
      mod.updating = false;
      return;
    }
    
    const data = await response.json();
    if(!response.ok) {
      notificationMessage.value = data.error || 'Error en actualitzar la seguretat del mod'
      notificationColor.value = 'error';
      showNotification.value = true;
      mod.updating = false;
      return;
    }
    
    notificationMessage.value = mod.security 
      ? 'Mod marcat com a segur' 
      : 'Mod marcat com a no segur';
    notificationColor.value = 'success';  
    showNotification.value = true;
  } catch (err) {
    console.error("Error en actualitzar la seguretat del mod", err);
    mod.security = previousValue;
    notificationMessage.value = 'Error inesperat en actualitzar la seguretat del mod';
    notificationColor.value = 'error';
    showNotification.value = true;
  } finally {
    mod.updating = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  
  // Si és d'avui, mostrar només l'hora
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' });
  }
  
  // Si és d'aquest any, mostrar dia i mes
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString('ca-ES', { month: 'short', day: 'numeric' });
  }
  
  // Per a dates més antigues
  return date.toLocaleDateString('ca-ES', { year: 'numeric', month: 'short', day: 'numeric' });
};

onMounted(async () => {
  try {
    fetchModsAdmin();
    listenChangeSecurityModAdmin(mods);
    listenNewModsAdmin(mods);
    initThreeJS();
  } catch (err) {
    console.error("Error en carregar mods", err);
    notificationMessage.value = 'Error en carregar mods';
    notificationColor.value = 'error';
    showNotification.value = true;
  } finally {
    isLoading.value = false;
  }
});

onBeforeUnmount(() => {
  cleanUpThreeJS();
});
</script>

<style scoped>
.nexus-mods-admin {
  padding: 20px;
  position: relative;
  overflow-x: hidden;
}

#threejs-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

/* Capçalera amb efecte */
.admin-header {
  background-color: rgba(25, 25, 25, 0.9);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 25px;
  border: 1px solid #333;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.glow-effect::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 20% 50%, rgba(252, 80, 59, 0.1), transparent 70%);
  pointer-events: none;
}

.header-content {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.admin-title {
  color: #e0e0e0;
  font-size: 1.8rem;
  font-weight: 600;
  position: relative;
  margin: 0;
}

.title-underline {
  height: 3px;
  width: 50px;
  background-color: #fc503b;
  margin-top: 8px;
  border-radius: 3px;
}

/* Filtres premium */
.filters-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
}

.nexus-filter-toggle {
  background-color: rgba(30, 30, 30, 0.8);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #333;
}

.filter-btn {
  text-transform: none;
  letter-spacing: normal;
  font-weight: 500;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  background-color: rgba(252, 80, 59, 0.1) !important;
}

.search-input {
  max-width: 300px;
  background-color: rgba(30, 30, 30, 0.7);
  border-radius: 6px;
}

.search-input :deep(.v-field__outline) {
  color: #333 !important;
}

.search-input :deep(.v-field__outline:hover) {
  color: #fc503b !important;
}

/* Targeta de taula */
.mods-table-card {
  background-color: rgba(25, 25, 25, 0.9) !important;
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.mods-table-card:hover {
  box-shadow: 0 10px 30px rgba(252, 80, 59, 0.1) !important;
}

.mods-table {
  background-color: transparent !important;
}

.mods-table :deep(.v-table__wrapper) {
  border-radius: 0 0 8px 8px;
}

.mods-table :deep(thead tr) {
  background-color: rgba(18, 18, 18, 0.9) !important;
}

.mods-table :deep(th) {
  color: #fc503b !important;
  font-weight: 600;
  letter-spacing: 0.5px;
  font-size: 0.9rem;
}

.mods-table :deep(td) {
  border-bottom: 1px solid #333 !important;
  font-size: 0.875rem;
}

.mods-table :deep(tr:hover td) {
  background-color: rgba(252, 80, 59, 0.05) !important;
}

/* Accions */
.actions-container {
  display: flex;
  justify-content: center;
}

.download-btn {
  transition: all 0.3s ease;
}

.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(252, 80, 59, 0.2);
}

/* Skeleton loader */
.skeleton-loader {
  padding: 20px;
}

.skeleton-row {
  height: 48px;
  background-color: rgba(255, 255, 255, 0.05);
  margin-bottom: 10px;
  border-radius: 4px;
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0.3; }
}

/* No results */
.no-results {
  text-align: center;
  padding: 40px;
  color: #b0b0b0;
}

.no-results h3 {
  color: #e0e0e0;
  margin-top: 15px;
}

/* Responsive */
@media (max-width: 960px) {
  .filters-container {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-input {
    width: 100%;
    max-width: 100%;
  }
  
  .admin-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 600px) {
  .nexus-filter-toggle {
    width: 100%;
  }
  
  .filter-btn {
    font-size: 0.75rem;
    padding: 0 8px;
  }
  
  .filter-btn .v-icon {
    margin-right: 4px;
  }
}
</style>