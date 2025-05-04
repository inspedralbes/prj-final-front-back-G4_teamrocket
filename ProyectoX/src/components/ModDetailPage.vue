<template>
  <v-container>
    <v-btn @click="$router.back()" prepend-icon="mdi-arrow-left" class="mb-4">
      Volver a la lista
    </v-btn>
    
    <v-card v-if="mod" class="mod-detail">
      <v-card-title class="text-h4">{{ mod.title }}</v-card-title>
      
      <v-card-text>
        <v-row>
          <v-col cols="12" md="8">
            <div class="text-body-1 my-4">{{ mod.description }}</div>
            
            <v-divider class="my-4"></v-divider>
            
            <div class="d-flex align-center mb-2">
              <v-icon color="primary" class="mr-2">mdi-download</v-icon>
              <span class="text-body-2">{{ mod.downloads }} descargas</span>
            </div>
            
            <div class="d-flex align-center mb-2" v-if="mod.uploaded_at">
              <v-icon color="primary" class="mr-2">mdi-calendar</v-icon>
              <span class="text-body-2">Subido el {{ formatDate(mod.uploaded_at) }}</span>
            </div>
            
            <div class="d-flex align-center mb-2" v-if="mod.uploaded_by">
              <v-icon color="primary" class="mr-2">mdi-account</v-icon>
              <span class="text-body-2">Subido por: {{ mod.uploaded_by }}</span>
            </div>
          </v-col>
          
          <v-col cols="12" md="4">
            <v-card variant="outlined" class="pa-4">
              <v-btn 
                block 
                color="primary" 
                size="large" 
                :href="`http://localhost:3002/api/mods/download/${route.params.id}`" 
                download 
                target="_blank"
                prepend-icon="mdi-download"
              >
                Descargar mod
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    
    <v-card v-else>
      <v-card-text class="text-center py-8">
        <v-progress-circular indeterminate color="primary" v-if="loading"></v-progress-circular>
        <div v-else class="text-h6">Mod no encontrado</div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getMod } from '@/services/communicationManager';

const route = useRoute();
const mod = ref(null);
const loading = ref(true);

const fetchModDetails = async () => {
  loading.value = true;
  try {
    const response = await getMod(route.params.id);
    mod.value = await response.json();
  } catch (error) {
    console.error('Error al cargar detalles del mod:', error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'Fecha desconocida';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

onMounted(fetchModDetails);
</script>

<style scoped>
.mod-detail {
  margin-bottom: 24px;
}
</style>
