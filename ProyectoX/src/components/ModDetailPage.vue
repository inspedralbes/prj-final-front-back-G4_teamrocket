<template>
  <div class="nexus-detail-page">
    <!-- Botón de volver -->
    <v-btn 
      @click="$router.back()" 
      prepend-icon="mdi-arrow-left" 
      variant="text"
      color="#fc503b"
      class="nexus-back-btn"
    >
      Volver a la lista
    </v-btn>
    
    <!-- Contenido principal -->
    <v-card v-if="mod" class="nexus-mod-detail">
      <!-- Encabezado -->
      <div class="nexus-mod-header">
        <h1 class="nexus-mod-title">{{ mod.title }}</h1>
        <div class="nexus-mod-author">por {{ mod.uploaded_by || 'Anónimo' }}</div>
      </div>
      
      <v-divider class="nexus-divider"></v-divider>
      
      <div class="nexus-mod-content">
        <!-- Columna izquierda -->
        <div class="nexus-main-column">
          <!-- Descripción -->
          <div class="nexus-section">
            <h2 class="nexus-section-title">Descripción</h2>
            <div class="nexus-mod-description">{{ mod.description }}</div>
          </div>
          
          <!-- Actualizaciones -->
          <div class="nexus-section" v-if="mod.uploaded_at">
            <h2 class="nexus-section-title">Actualizaciones</h2>
            <div class="nexus-update-info">
              <div class="nexus-update-item">
                <span class="nexus-update-label">Última actualización:</span>
                <span class="nexus-update-value">{{ formatDate(mod.updated_at || mod.uploaded_at) }}</span>
              </div>
              <div class="nexus-update-item">
                <span class="nexus-update-label">Subida original:</span>
                <span class="nexus-update-value">{{ formatDate(mod.uploaded_at) }}</span>
              </div>
            </div>
          </div>
          
          <!-- Comentarios -->
          <div class="nexus-section">
            <h2 class="nexus-section-title">Comentarios</h2>
            
            <!-- Formulario para añadir comentarios -->
            <v-card variant="outlined" class="nexus-comment-form">
              <h3 class="nexus-comment-form-title">Añadir un comentario</h3>
              
              <v-form @submit.prevent="submitComment" v-model="formValid">
                <v-textarea
                  v-model="newComment.content"
                  label="Comentario"
                  :rules="[v => !!v || 'Comentario es requerido']"
                  required
                  counter
                  rows="3"
                  variant="outlined"
                  class="nexus-comment-input"
                ></v-textarea>
                
                <div class="nexus-rating-section">
                  <label class="nexus-rating-label">Valoración</label>
                  <v-rating
                    v-model="newComment.rating"
                    color="amber"
                    hover
                    half-increments
                    density="comfortable"
                  ></v-rating>
                </div>
                
                <v-btn
                  type="submit"
                  color="#fc503b"
                  :disabled="!formValid"
                  :loading="submitting"
                  class="nexus-comment-submit"
                >
                  Publicar comentario
                </v-btn>
              </v-form>
            </v-card>
            
            <!-- Lista de comentarios -->
            <div v-if="comments.length > 0" class="nexus-comments-list">
              <v-card 
                v-for="(comment, index) in comments" 
                :key="index" 
                class="nexus-comment-card"
                variant="outlined"
              >
                <div class="nexus-comment-header">
                  <div class="nexus-comment-author">{{ maskEmail(comment.email) }}</div>
                  <v-rating
                    :model-value="comment.rating"
                    color="amber"
                    readonly
                    density="compact"
                    size="small"
                  ></v-rating>
                </div>
                
                <div v-if="!isEditing" class="nexus-comment-content">
                  {{ comment.content }}
                </div>

                <div v-else class="nexus-comment-edit">
                  <v-textarea
                    v-model="newContent"
                    rows="2"
                    label="Editar comentario"
                    variant="outlined"
                  ></v-textarea>
                  <div class="nexus-comment-edit-actions">
                    <v-btn color="#fc503b" @click="editComment(comment)" size="small">Guardar</v-btn>
                    <v-btn variant="text" @click="isEditing = false" size="small">Cancelar</v-btn>
                  </div>
                </div>

                <div class="nexus-comment-footer">
                  <span class="nexus-comment-date">{{ formatDate(comment.createdAt) }}</span>
                  
                  <div class="nexus-comment-actions" v-if="comment.email === userEmail">
                    <v-btn 
                      variant="text" 
                      color="#fc503b" 
                      size="small"
                      @click="toggleEdit(comment)"
                      class="nexus-comment-action-btn"
                    >
                      {{ isEditing ? 'Cancelar' : 'Editar' }}
                    </v-btn>
                    <v-btn 
                      variant="text" 
                      color="error" 
                      size="small"
                      @click="deleteComment(comment)"
                      class="nexus-comment-action-btn"
                    >
                      Eliminar
                    </v-btn>
                  </div>
                </div>
              </v-card>
            </div>
            
            <div v-else class="nexus-no-comments">
              <v-icon size="large" color="grey">mdi-comment-outline</v-icon>
              <p>No hay comentarios aún. ¡Sé el primero en opinar!</p>
            </div>
          </div>
        </div>
        
        <!-- Columna derecha -->
        <div class="nexus-sidebar">
          <!-- Estadísticas -->
          <v-card variant="outlined" class="nexus-stats-card">
            <div class="nexus-stats-item">
              <div class="nexus-stats-label">Endorsements</div>
              <div class="nexus-stats-value">8,984</div>
            </div>
            
            <v-divider class="nexus-stats-divider"></v-divider>
            
            <div class="nexus-stats-item">
              <div class="nexus-stats-label">Total descargas</div>
              <div class="nexus-stats-value">{{ mod.downloads || 0 }}</div>
            </div>
            
            <v-divider class="nexus-stats-divider"></v-divider>
            
            <div class="nexus-stats-item">
              <div class="nexus-stats-label">Versión</div>
              <div class="nexus-stats-value">1.3</div>
            </div>
          </v-card>

          <!-- Botón de descarga -->
          <v-btn
            @click="download(mod)" 
            block 
            color="#fc503b" 
            size="large"
            prepend-icon="mdi-download"
            class="nexus-download-btn"
          >
            Descargar mod
          </v-btn>
          
          <!-- Información del creador -->
          <v-card variant="outlined" class="nexus-creator-card">
            <div class="nexus-creator-item">
              <span class="nexus-creator-label">Creado por</span>
              <span class="nexus-creator-value">{{ mod.uploaded_by || 'Anónimo' }}</span>
            </div>
            
            <div class="nexus-creator-item">
              <span class="nexus-creator-label">Subido por</span>
              <span class="nexus-creator-value">{{ mod.uploaded_by || 'Anónimo' }}</span>
            </div>
            
            <div class="nexus-creator-item">
              <span class="nexus-creator-label">Escaneo de virus</span>
              <span class="nexus-creator-value nexus-virus-safe">
                <v-icon color="success">mdi-check-circle</v-icon>
                Seguro
              </span>
            </div>
          </v-card>
          
          <!-- Tags -->
          <v-card variant="outlined" class="nexus-tags-card">
            <h3 class="nexus-tags-title">Tags para este mod</h3>
            <div class="nexus-tags-list">
              <v-chip v-for="(tag, index) in ['Mapa', 'Interfaz', 'Mejora']" :key="index" class="nexus-tag">
                {{ tag }}
              </v-chip>
            </div>
            <v-btn variant="text" color="#fc503b" size="small" class="nexus-add-tag-btn">
              + Añadir tag
            </v-btn>
          </v-card>
          
          <!-- Estadísticas de archivos -->
          <v-card variant="outlined" class="nexus-files-card">
            <div class="nexus-files-grid">
              <div class="nexus-files-item">
                <div class="nexus-files-label">DESCRIPCIÓN</div>
                <div class="nexus-files-value">1</div>
              </div>
              <div class="nexus-files-item">
                <div class="nexus-files-label">ARCHIVOS</div>
                <div class="nexus-files-value">1</div>
              </div>
              <div class="nexus-files-item">
                <div class="nexus-files-label">IMÁGENES</div>
                <div class="nexus-files-value">9</div>
              </div>
              <div class="nexus-files-item">
                <div class="nexus-files-label">VIDEOS</div>
                <div class="nexus-files-value">1</div>
              </div>
              <div class="nexus-files-item">
                <div class="nexus-files-label">POSTS</div>
                <div class="nexus-files-value">85</div>
              </div>
              <div class="nexus-files-item">
                <div class="nexus-files-label">BUGS</div>
                <div class="nexus-files-value">0</div>
              </div>
            </div>
          </v-card>
        </div>
      </div>
    </v-card>
    
    <!-- Loading/Error states -->
    <v-card v-else class="nexus-loading-card">
      <v-card-text class="nexus-loading-content">
        <v-progress-circular indeterminate color="#fc503b" v-if="loading"></v-progress-circular>
        <div v-else class="nexus-error-message">
          <v-icon color="error" size="large">mdi-alert-circle</v-icon>
          <p>Mod no encontrado</p>
        </div>
      </v-card-text>
    </v-card>
    
    <!-- Snackbar para mensajes -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
      location="bottom right"
      class="nexus-snackbar"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="snackbar.show = false"
          :color="snackbar.color === 'error' ? 'white' : ''"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getCommentsById, getMod, postComment, postDownloadMod, deleteCommentMongodb, putComment } from '@/services/communicationManager';
import { listenToModDownloads2 } from '@/services/socketManager';
import Chart from 'chart.js/auto';

const route = useRoute();
const mod = ref(null);
const loading = ref(true);
const comments = ref([]);
const formValid = ref(false);
const submitting = ref(false);
const isEditing = ref(false);
const newContent = ref('');
const userEmail = ref(localStorage.getItem('userEmail'));
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
});

const newComment = ref({
  email: userEmail,
  content: '',
  modId: route.params.id,
  rating: 5
});

// Función para inicializar el historial de descargas si no existe
const initDownloadsHistory = () => {
  if (!mod.value.downloads_history) {
    // Si no hay historial, creamos uno vacío
    mod.value.downloads_history = [];
  }
};

const fetchModDetails = async () => {
  loading.value = true;
  try {
    const response = await getMod(route.params.id);
    const data = await response.json();
    mod.value = data.modUser;
    console.log(mod.value);
    initDownloadsHistory();
    await fetchComments();
  } catch (error) {
    console.error('Error al cargar detalles del mod:', error);
  } finally {
    loading.value = false;
  }
};

const fetchComments = async () => {
  try {
    const response = await getCommentsById(route.params.id);
    comments.value = await response.json();
  } catch (error) {
    console.error('Error al cargar comentarios:', error);
    snackbar.value = {
      show: true,
      text: 'Error al cargar comentarios',
      color: 'error'
    };
  }
};

const submitComment = async () => {
  submitting.value = true;
  try {
    await postComment(newComment);
    
    newComment.value = {
      email: userEmail,
      content: '',
      modId: route.params.id,
      rating: 5
    };
    
    snackbar.value = {
      show: true,
      text: '¡Comentario publicado correctamente!',
      color: 'success'
    };
    
    await fetchComments();
  } catch (error) {
    console.error('Error al publicar comentario:', error);
    snackbar.value = {
      show: true,
      text: 'Error al publicar comentario',
      color: 'error'
    };
  } finally {
    submitting.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'Fecha desconocida';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const maskEmail = (email) => {
  if (!email) return '';
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  
  const name = parts[0];
  const domain = parts[1];
  
  const maskedName = name.length <= 3 
    ? name 
    : `${name.substring(0, 2)}${'*'.repeat(name.length - 3)}${name.charAt(name.length - 1)}`;
  
  return `${maskedName}@${domain}`;
};

const download = async (mod) => {
  try {
    // Registrar la descarga en el backend
    await postDownloadMod(route.params.id);

    // Simular la descarga
    const link = document.createElement('a');
    link.href = `http://localhost:3002${mod.file_path}`;
    link.setAttribute('download', '');
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    link.remove();

    // Actualizar estadísticas locales
    const today = new Date().toISOString().split('T')[0];
    
    // Inicializar downloads_history si no existe
    if (!mod.downloads_history) {
      mod.downloads_history = {};
    }
    
    // Incrementar contadores
    mod.downloads_history[today] = (mod.downloads_history[today] || 0) + 1;
    mod.downloads = (mod.downloads || 0) + 1;

    snackbar.value = {
      show: true,
      text: `¡Descarga iniciada!`,
      color: 'info'
    };
  } catch (error) {
    console.error('Error al descargar:', error);
    snackbar.value = {
      show: true,
      text: 'Error al iniciar la descarga',
      color: 'error'
    };
  }
};

const deleteComment = async (comment) => {
  try {
    const response = await deleteCommentMongodb(comment._id);

    if(!response.ok) {
      const errorData = response.json();
      console.error("Error al eliminar comentario:", errorData.error);
      return;
    }

    snackbar.value = {
      show: true,
      text: '¡Comentario eliminado correctamente!',
      color: 'success'
    };

    await fetchComments();
  } catch (error) {
    console.error("Error al eliminar comentario:", error);
  }
};

const toggleEdit = (comment) => {
  if (!isEditing.value) {
    newContent.value = comment.content;
  }
  isEditing.value = !isEditing.value;
}

const editComment = async (comment) => {
  try {
    const response = await putComment(comment._id, newContent.value);

    if(!response.ok) {
      const errorData = await response.json();
      console.error(errorData.error);
      return;
    }

    snackbar.value = {
      show: true,
      text: '¡Comentario actualizado correctamente!',
      color: 'success'
    };

    comment.content = newContent.value;
    isEditing.value = false;
  } catch (error) {
    console.error("Error al editar comentario:", error);
  }
}

onMounted(() => {
  fetchModDetails();
  listenToModDownloads2(mod);
});

onBeforeUnmount(() => {
});
</script>

<style scoped>
.nexus-detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #0d0d0d;
  color: #ffffff;
}

.nexus-back-btn {
  margin-bottom: 20px;
  text-transform: none;
  letter-spacing: normal;
}

.nexus-mod-detail {
  background: rgba(18, 18, 18, 0.9);
  border: 1px solid #252525;
  border-radius: 6px;
  overflow: hidden;
}

.nexus-mod-header {
  padding: 24px;
  border-bottom: 1px solid #252525;
}

.nexus-mod-title {
  font-size: 28px;
  font-weight: 600;
  color: #fc503b;
  margin-bottom: 8px;
}

.nexus-mod-author {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
}

.nexus-divider {
  border-color: #252525;
}

.nexus-mod-content {
  display: flex;
  padding: 24px;
  gap: 24px;
}

.nexus-main-column {
  flex: 1;
  min-width: 0;
}

.nexus-sidebar {
  width: 300px;
  flex-shrink: 0;
}

.nexus-section {
  margin-bottom: 32px;
}

.nexus-section-title {
  font-size: 20px;
  font-weight: 600;
  color: #fc503b;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #252525;
}

.nexus-mod-description {
  font-size: 15px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
}

.nexus-update-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nexus-update-item {
  display: flex;
  justify-content: space-between;
}

.nexus-update-label {
  color: rgba(255, 255, 255, 0.7);
}

.nexus-update-value {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

/* Cards de la sidebar */
.nexus-stats-card,
.nexus-creator-card,
.nexus-tags-card,
.nexus-files-card {
  background: rgba(13, 13, 13, 0.8);
  border: 1px solid #252525;
  border-radius: 6px;
  margin-bottom: 16px;
  padding: 16px;
}

.nexus-stats-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}

.nexus-stats-divider {
  border-color: #252525;
  margin: 8px 0;
}

.nexus-stats-label {
  color: rgba(255, 255, 255, 0.7);
}

.nexus-stats-value {
  color: #ffffff;
  font-weight: 500;
}

.nexus-download-btn {
  margin-bottom: 16px;
  text-transform: none;
  font-weight: 500;
}

.nexus-creator-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}

.nexus-creator-label {
  color: rgba(255, 255, 255, 0.7);
}

.nexus-creator-value {
  color: #ffffff;
  font-weight: 500;
}

.nexus-virus-safe {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #4caf50;
}

.nexus-tags-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: rgba(255, 255, 255, 0.9);
}

.nexus-tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.nexus-tag {
  background: rgba(252, 80, 59, 0.1);
  color: #fc503b;
  border: 1px solid rgba(252, 80, 59, 0.3);
}

.nexus-add-tag-btn {
  width: 100%;
}

.nexus-files-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.nexus-files-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nexus-files-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  margin-bottom: 4px;
}

.nexus-files-value {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
}

/* Estilos para comentarios */
.nexus-comment-form {
  background: rgba(13, 13, 13, 0.8);
  border: 1px solid #252525;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 24px;
}

.nexus-comment-form-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: rgba(255, 255, 255, 0.9);
}

.nexus-comment-input {
  margin-bottom: 16px;
}

.nexus-rating-section {
  margin-bottom: 16px;
}

.nexus-rating-label {
  display: block;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.7);
}

.nexus-comment-submit {
  text-transform: none;
}

.nexus-comments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.nexus-comment-card {
  background: rgba(13, 13, 13, 0.8);
  border: 1px solid #252525;
  border-radius: 6px;
  padding: 16px;
}

.nexus-comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.nexus-comment-author {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.nexus-comment-content {
  font-size: 14px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 12px;
}

.nexus-comment-edit {
  margin-bottom: 12px;
}

.nexus-comment-edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.nexus-comment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nexus-comment-date {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.nexus-comment-actions {
  display: flex;
  gap: 8px;
}

.nexus-comment-action-btn {
  text-transform: none;
  letter-spacing: normal;
  min-width: 0;
}

.nexus-no-comments {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
}

.nexus-no-comments p {
  margin-top: 12px;
}

/* Loading states */
.nexus-loading-card {
  background: rgba(18, 18, 18, 0.9);
  border: 1px solid #252525;
  border-radius: 6px;
}

.nexus-loading-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.nexus-error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.7);
}

/* Snackbar */
.nexus-snackbar {
  font-family: inherit;
}

/* Responsive */
@media (max-width: 960px) {
  .nexus-mod-content {
    flex-direction: column;
  }
  
  .nexus-sidebar {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .nexus-mod-header {
    padding: 16px;
  }
  
  .nexus-mod-title {
    font-size: 24px;
  }
  
  .nexus-mod-content {
    padding: 16px;
  }
  
  .nexus-files-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>