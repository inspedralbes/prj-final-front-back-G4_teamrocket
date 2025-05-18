<template>
  <div class="nexus-users-admin">
    <!-- Contenedor para Three.js -->
    <div id="threejs-background" ref="threeContainer"></div>
    
    <!-- Sección de Estadísticas -->
    <v-card class="stats-card">
      <div class="stats-header">
        <v-icon color="#fc503b" size="28" class="mr-2">mdi-chart-bar</v-icon>
        <h3 class="stats-title">Estadístiques d'Usuaris</h3>
      </div>
      <v-divider class="stats-divider"></v-divider>
      <div class="stats-grid">
        <v-card v-for="stat in stats" :key="stat.title" class="stat-card" :class="stat.color">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.title }}</div>
        </v-card>
      </div>
    </v-card>

    <!-- Sección de Gestión -->
    <v-card class="management-card">
      <div class="management-header">
        <div class="header-left">
          <v-icon color="#fc503b" size="28" class="mr-2">mdi-account-cog</v-icon>
          <h3 class="management-title">Gestió d'Usuaris</h3>
        </div>
        <v-text-field
          v-model="searchUsers"
          label="Cercar usuaris..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          class="search-field"
          hide-details
        ></v-text-field>
      </div>

      <v-data-table
        :headers="userHeaders"
        :items="filteredUsers"
        :search="searchUsers"
        class="users-table"
      >
        <template v-slot:item.admin="{ item }">
          <v-chip :color="item.admin ? 'red' : 'grey'" small>
            <v-icon left small>{{ item.admin ? 'mdi-shield-account' : 'mdi-account' }}</v-icon>
            {{ item.admin ? 'Admin' : 'Usuari' }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="actions-container">
            <v-tooltip text="Eliminar usuari" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  color="red"
                  size="small"
                  @click="deleteUser(item.id)"
                  class="action-btn"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip :text="item.admin ? 'Treure admin' : 'Fer admin'" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  color="blue"
                  size="small"
                  @click="changeAdmin(item.id)"
                  class="action-btn"
                >
                  <v-icon>{{ item.admin ? 'mdi-account-remove' : 'mdi-account-star' }}</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { getUsersAdmin, deleteUserAdmin, changeUserAdmin } from '@/services/communicationManager';
import { listenNewUserAdmin } from '@/services/socketManager';

// Variables de estado
const users = ref([]);
const searchUsers = ref('');
const threeContainer = ref(null);

// Variables para Three.js
let scene, camera, renderer, particles, lines;
let animationId = null;

// Configuración de Three.js
const initThreeJS = () => {
  // Escena
  scene = new THREE.Scene();
  scene.background = null;

  // Cámara
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

  // Crear partículas
  createParticles();

  // Animación
  const animate = () => {
    animationId = requestAnimationFrame(animate);
    
    // Rotar partículas
    if (particles) {
      particles.rotation.x += 0.0003;
      particles.rotation.y += 0.0005;
    }
    
    // Actualizar conexiones
    updateConnections();
    
    renderer.render(scene, camera);
  };

  animate();

  // Manejar redimensionamiento
  window.addEventListener('resize', handleResize);
};

const createParticles = () => {
  const particleCount = 300;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  // Crear geometría de partículas
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

    // Colores en tonos rojos/anaranjados
    colors[i * 3] = 0.9 + Math.random() * 0.1;     // R
    colors[i * 3 + 1] = 0.2 + Math.random() * 0.2; // G
    colors[i * 3 + 2] = 0.1 + Math.random() * 0.1; // B
  }

  const particlesGeometry = new THREE.BufferGeometry();
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.8,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });

  particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  // Crear geometría para líneas de conexión
  const lineGeometry = new THREE.BufferGeometry();
  const linePositions = new Float32Array(particleCount * 3 * 2); // Cada partícula puede conectarse con otra
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xfc503b,
    transparent: true,
    opacity: 0.15,
    linewidth: 0.5
  });

  lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lines);
};

const updateConnections = () => {
  if (!particles || !lines) return;

  const positions = particles.geometry.attributes.position.array;
  const linePositions = lines.geometry.attributes.position.array;
  const particleCount = positions.length / 3;
  const maxDistance = 25;
  
  let index = 0;
  
  for (let i = 0; i < particleCount; i++) {
    const x1 = positions[i * 3];
    const y1 = positions[i * 3 + 1];
    const z1 = positions[i * 3 + 2];
    
    let closestDistance = maxDistance;
    let closestIndex = -1;
    
    // Encontrar la partícula más cercana
    for (let j = 0; j < particleCount; j++) {
      if (i === j) continue;
      
      const x2 = positions[j * 3];
      const y2 = positions[j * 3 + 1];
      const z2 = positions[j * 3 + 2];
      
      const dx = x1 - x2;
      const dy = y1 - y2;
      const dz = z1 - z2;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      
      if (dist < closestDistance) {
        closestDistance = dist;
        closestIndex = j;
      }
    }
    
    // Dibujar línea si hay una partícula cercana
    if (closestIndex !== -1) {
      linePositions[index++] = x1;
      linePositions[index++] = y1;
      linePositions[index++] = z1;
      
      linePositions[index++] = positions[closestIndex * 3];
      linePositions[index++] = positions[closestIndex * 3 + 1];
      linePositions[index++] = positions[closestIndex * 3 + 2];
    } else {
      // No dibujar línea (poner ambos puntos en la misma posición)
      linePositions[index++] = x1;
      linePositions[index++] = y1;
      linePositions[index++] = z1;
      
      linePositions[index++] = x1;
      linePositions[index++] = y1;
      linePositions[index++] = z1;
    }
  }
  
  lines.geometry.attributes.position.needsUpdate = true;
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

// Lógica del componente
const stats = computed(() => [
  { title: 'Usuaris totals', value: users.value.length, color: 'stat-total' },
  { title: 'Administradors', value: users.value.filter(u => u.admin).length, color: 'stat-admin' },
  { title: 'Usuaris normals', value: users.value.filter(u => !u.admin).length, color: 'stat-normal' }
]);

const userHeaders = [
  { title: 'ID', key: 'id', width: '80px' },
  { title: 'Nom d\'usuari', key: 'username' },
  { title: 'Email', key: 'email' },
  { title: 'Rol', key: 'admin', align: 'center' },
  { title: 'Accions', key: 'actions', align: 'center', sortable: false }
];

const filteredUsers = computed(() => {
  return users.value.map(user => ({
    ...user,
    email: user.email.length > 25 ? user.email.substring(0, 22) + '...' : user.email
  }));
});

const fetchUsers = async () => {
  users.value = await getUsersAdmin();
};

const deleteUser = async (userId) => {
  try {
    await deleteUserAdmin(userId);
    fetchUsers();
  } catch (error) {
    console.error('Error en eliminar usuari:', error);
  }
};

const changeAdmin = async (userId) => {
  try {
    await changeUserAdmin(userId);
    fetchUsers();
  } catch (error) {
    console.error('Error en canviar rol:', error);
  }
};

onMounted(() => {
  fetchUsers();
  listenNewUserAdmin(users);
  initThreeJS();
});

onBeforeUnmount(() => {
  cleanUpThreeJS();
});
</script>

<style scoped>
.nexus-users-admin {
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

.stats-card,
.management-card {
  position: relative;
  z-index: 1;
  background-color: rgba(25, 25, 25, 0.85) !important;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(252, 80, 59, 0.2);
  margin-bottom: 25px;
}

.stats-header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background-color: rgba(18, 18, 18, 0.9);
}

.stats-title {
  color: #fc503b;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.stats-divider {
  border-color: #333 !important;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  padding: 20px;
}

.stat-card {
  padding: 16px;
  border-radius: 6px;
  text-align: center;
  transition: transform 0.3s ease;
  background-color: rgba(30, 30, 30, 0.8) !important;
}

.stat-card:hover {
  transform: translateY(-3px);
}

.stat-total {
  border-top: 3px solid #fc503b;
}

.stat-admin {
  border-top: 3px solid #f44336;
}

.stat-normal {
  border-top: 3px solid #2196f3;
}

.stat-value {
  color: #fc503b;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  color: #b0b0b0;
  font-size: 0.9rem;
  margin-top: 8px;
}

.management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: rgba(18, 18, 18, 0.9);
  flex-wrap: wrap;
  gap: 15px;
}

.header-left {
  display: flex;
  align-items: center;
}

.management-title {
  color: #e0e0e0;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.search-field {
  max-width: 300px;
  min-width: 250px;
}

.users-table {
  background-color: transparent !important;
}

.users-table :deep(.v-table__wrapper) {
  border-radius: 0 0 8px 8px;
}

.users-table :deep(thead tr) {
  background-color: rgba(18, 18, 18, 0.9) !important;
}

.users-table :deep(th) {
  color: #fc503b !important;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.users-table :deep(td) {
  border-bottom: 1px solid #333 !important;
}

.users-table :deep(tr:hover td) {
  background-color: rgba(252, 80, 59, 0.05) !important;
}

.actions-container {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.action-btn {
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: scale(1.2);
}

/* Responsive */
@media (max-width: 768px) {
  .management-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-field {
    width: 100%;
    max-width: 100%;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>