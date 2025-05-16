<template>
  <div class="nexus-mods-admin">
    <!-- Encabezado con efecto de luminosidad -->
    <div class="admin-header glow-effect">
      <div class="header-content">
        <v-icon color="#fc503b" size="32" class="mr-3">mdi-puzzle</v-icon>
        <h2 class="admin-title">
          Gestión de Mods
          <div class="title-underline"></div>
        </h2>
      </div>
      
      <!-- Filtros premium -->
      <div class="filters-container">
        <v-btn-toggle
          v-model="selectedFilter"
          mandatory
          class="nexus-filter-toggle"
          color="#fc503b"
        >
          <v-tooltip location="bottom" text="Mostrar todos los mods">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                value="all"
                class="filter-btn"
              >
                <v-icon left>mdi-format-list-bulleted</v-icon>
                Todos los mods
              </v-btn>
            </template>
          </v-tooltip>

          <v-tooltip location="bottom" text="Mostrar solo mods verificados">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                value="safe"
                class="filter-btn"
              >
                <v-icon left>mdi-shield-check</v-icon>
                Mods seguros
              </v-btn>
            </template>
          </v-tooltip>

          <v-tooltip location="bottom" text="Mostrar mods pendientes de revisión">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                value="unsafe"
                class="filter-btn"
              >
                <v-icon left>mdi-alert</v-icon>
                Mods no seguros
              </v-btn>
            </template>
          </v-tooltip>
        </v-btn-toggle>

        <v-text-field
          v-model="searchQuery"
          placeholder="Buscar mods..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          class="search-input"
          hide-details
          clearable
        ></v-text-field>
      </div>
    </div>

    <!-- Tarjeta de tabla con efecto de elevación -->
    <v-card 
      class="mods-table-card elevation-8"
      :class="{ 'loading': isLoading }"
    >
      <!-- Skeleton loader -->
      <div v-if="isLoading" class="skeleton-loader">
        <div v-for="i in 5" :key="i" class="skeleton-row"></div>
      </div>

      <!-- Tabla de mods -->
      <v-data-table
        v-else
        :headers="headers"
        :items="filteredMods"
        :search="searchQuery"
        class="mods-table"
        :loading="isLoading"
        loading-text="Cargando mods..."
        no-data-text="No se encontraron mods"
      >
        <!-- Columna de seguridad con animación -->
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
                  {{ item.security ? 'Verificado' : 'Pendiente' }}
                </span>
              </template>
            </v-switch>
          </v-fade-transition>
        </template>

        <!-- Columna de acciones con efecto hover -->
        <template v-slot:item.actions="{ item }">
          <div class="actions-container">
            <v-btn
              color="#fc503b"
              variant="tonal"
              size="small"
              :href="getDownloadUrl(item.file_path)"
              target="_blank"
              class="action-btn download-btn"
              @click="logDownload(item.id)"
            >
              <v-icon left>mdi-download</v-icon>
              Descargar
              <v-tooltip activator="parent" location="top">Descargar archivo</v-tooltip>
            </v-btn>
          </div>
        </template>

        <!-- Columna de fecha formateada -->
        <template v-slot:item.uploaded_at="{ item }">
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <span v-bind="props">{{ formatDate(item.uploaded_at) }}</span>
            </template>
            <span>{{ new Date(item.uploaded_at).toLocaleString() }}</span>
          </v-tooltip>
        </template>

        <!-- Mensaje cuando no hay resultados -->
        <template v-slot:no-results>
          <div class="no-results">
            <v-icon color="#fc503b" size="48">mdi-magnify-close</v-icon>
            <h3>No se encontraron mods</h3>
            <p>Intenta con otros términos de búsqueda</p>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Notificación de estado -->
    <v-snackbar v-model="showNotification" :color="notificationColor" timeout="3000">
      {{ notificationMessage }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getModsAdmin } from '@/services/communicationManager';

const mods = ref([]);
const selectedFilter = ref('all');
const searchQuery = ref('');
const isLoading = ref(true);
const showNotification = ref(false);
const notificationMessage = ref('');
const notificationColor = ref('');

const headers = [
  { title: 'Título', key: 'title', width: '25%' },
  { title: 'Autor', key: 'username', width: '20%' },
  { title: 'Estado', key: 'security', align: 'center', width: '15%' },
  { title: 'Fecha de subida', key: 'uploaded_at', width: '20%' },
  { title: 'Acciones', key: 'actions', align: 'center', sortable: false, width: '20%' }
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

const getDownloadUrl = (path) => `http://localhost:3002${path}`;

const logDownload = async (modId) => {
  try {
    await fetch(`http://localhost:3002/api/mods/${modId}/download`, {
      method: 'POST'
    });
  } catch (err) {
    console.error("Error al registrar descarga", err);
  }
};

const toggleSafety = async (mod) => {
  mod.updating = true;
  try {
    const response = await fetch(`http://localhost:3002/api/mods/${mod.id}/safe`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isSafe: mod.security }),
    });

    if (response.ok) {
      showNotification.value = true;
      notificationMessage.value = mod.security 
        ? 'Mod marcado como seguro' 
        : 'Mod marcado como no seguro';
      notificationColor.value = 'success';
    }
  } catch (err) {
    console.error("Error al actualizar la seguridad del mod", err);
    mod.security = !mod.security;
    notificationMessage.value = 'Error al actualizar';
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
  
  // Si es de hoy, mostrar solo la hora
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }
  
  // Si es de este año, mostrar día y mes
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  }
  
  // Para fechas más antiguas
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
};

onMounted(async () => {
  try {
    mods.value = await getModsAdmin();
  } catch (err) {
    console.error("Error al cargar mods", err);
    notificationMessage.value = 'Error al cargar mods';
    notificationColor.value = 'error';
    showNotification.value = true;
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.nexus-mods-admin {
  padding: 20px;
  background-color: transparent;
}

/* Encabezado con efecto */
.admin-header {
  background-color: rgba(25, 25, 25, 0.9);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 25px;
  border: 1px solid #333;
  position: relative;
  overflow: hidden;
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

/* Filtros premium */
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

/* Tarjeta de tabla */
.mods-table-card {
  background-color: rgba(25, 25, 25, 0.9) !important;
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
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

/* Acciones */
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