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
            
            <!-- Sección de calificación promedio -->
            <div class="d-flex align-center mt-4" v-if="averageRating">
              <v-icon color="amber" class="mr-2">mdi-star</v-icon>
              <span class="text-body-2">{{ averageRating.toFixed(1) }} ({{ comments.length }} valoraciones)</span>
            </div>
          </v-col>
          
          <v-col cols="12" md="4">
            <v-card variant="outlined" class="pa-4">
              <v-btn 
                block 
                color="primary" 
                size="large" 
                :href="`http://localhost:3002${mod.file_path}`" 
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
    
    <!-- Sección de comentarios -->
    <v-card v-if="mod" class="mt-6">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-comment-multiple-outline</v-icon>
        Comentarios
      </v-card-title>
      
      <!-- Formulario para añadir comentario -->
      <v-card-text>
        <v-form ref="form" v-model="isFormValid" @submit.prevent="submitComment">
          <v-row>
            <v-col cols="12" md="6">
              <div class="d-flex align-center">
                <span class="mr-2">Valoración:</span>
                <v-rating
                  v-model="newComment.rating"
                  color="amber"
                  half-increments
                  hover
                ></v-rating>
              </div>
            </v-col>
            
            <v-col cols="12">
              <v-textarea
                v-model="newComment.content"
                label="Tu comentario"
                :rules="[v => !!v || 'El comentario es obligatorio']"
                required
                auto-grow
                rows="3"
              ></v-textarea>
            </v-col>
            
            <v-col cols="12" class="d-flex justify-end">
              <v-btn
                type="submit"
                color="primary"
                :disabled="!isFormValid || isSubmitting"
                prepend-icon="mdi-send"
              >
                {{ isSubmitting ? 'Enviando...' : 'Enviar comentario' }}
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
        
        <v-alert
          v-if="commentStatus.show"
          :type="commentStatus.type"
          variant="tonal"
          closable
          class="mt-4"
        >
          {{ commentStatus.message }}
        </v-alert>
        
        <v-divider class="my-4"></v-divider>
        
        <!-- Lista de comentarios -->
        <div v-if="commentsLoading" class="text-center py-4">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
        
        <div v-else-if="comments.length === 0" class="text-center py-4">
          <v-icon size="large" color="grey" class="mb-2">mdi-comment-off-outline</v-icon>
          <div class="text-body-1">No hay comentarios aún. ¡Sé el primero en comentar!</div>
        </div>
        
        <div v-else>
          <v-list lines="three">
            <v-list-item
              v-for="(comment, index) in comments"
              :key="index"
              class="mb-4"
            >
              <template v-slot:prepend>
                <v-avatar color="primary" class="text-white">
                  {{ comment.email.charAt(0).toUpperCase() }}
                </v-avatar>
              </template>
              
              <v-list-item-title>
                <div class="d-flex align-center">
                  <span class="font-weight-medium">{{ maskEmail(comment.email) }}</span>
                  <v-spacer></v-spacer>
                  <v-rating
                    :model-value="comment.rating"
                    color="amber"
                    density="compact"
                    readonly
                    size="small"
                  ></v-rating>
                </div>
              </v-list-item-title>
              
              <v-list-item-subtitle class="text-caption text-grey">
                {{ formatDate(comment.createdAt) }}
              </v-list-item-subtitle>
              
              <v-list-item-text class="mt-2">
                {{ comment.content }}
              </v-list-item-text>
            </v-list-item>
          </v-list>
          
          <div v-if="hasMoreComments" class="text-center py-2">
            <v-btn
              variant="text"
              color="primary"
              @click="loadMoreComments"
              :disabled="loadingMoreComments"
            >
              {{ loadingMoreComments ? 'Cargando...' : 'Cargar más comentarios' }}
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getComments, getMod, postComment } from '@/services/communicationManager';

const route = useRoute();
const mod = ref(null);
const loading = ref(true);
const comments = ref([]);
const commentsLoading = ref(true);
const hasMoreComments = ref(false);
const loadingMoreComments = ref(false);
const currentPage = ref(1);
const commentsPerPage = 5;
const userEmail = ref(localStorage.getItem('userEmail'));

// Form state
const form = ref(null);
const isFormValid = ref(false);
const isSubmitting = ref(false);
const commentStatus = ref({
  show: false,
  type: 'success',
  message: ''
});

const newComment = ref({
  email: userEmail,
  content: '',
  rating: 5,
  modId: ''
});

const averageRating = computed(() => {
  if (!comments.value.length) return 0;
  const total = comments.value.reduce((sum, comment) => sum + comment.rating, 0);
  return total / comments.value.length;
});

const fetchModDetails = async () => {
  loading.value = true;
  try {
    const response = await getMod(route.params.id);
    mod.value = await response.json();
    
    // Una vez que tenemos el mod, podemos cargar sus comentarios
    if (mod.value) {
      newComment.value.modId = route.params.id;
      fetchComments();
    }
  } catch (error) {
    console.error('Error al cargar detalles del mod:', error);
  } finally {
    loading.value = false;
  }
};

const fetchComments = async () => {
  commentsLoading.value = true;
  try {
    const response = getComments(route.params.id);
    const data = await response.json();
    
    if (data.success) {
      comments.value = data.comments;
      hasMoreComments.value = data.totalComments > comments.value.length;
    }
  } catch (error) {
    console.error('Error al cargar comentarios:', error);
  } finally {
    commentsLoading.value = false;
  }
};

const loadMoreComments = async () => {
  loadingMoreComments.value = true;
  try {
    currentPage.value++;
    const response = await fetch(`/api/comments?modId=${route.params.id}&page=${currentPage.value}&limit=${commentsPerPage}`);
    const data = await response.json();
    
    if (data.success) {
      comments.value = [...comments.value, ...data.comments];
      hasMoreComments.value = data.totalComments > comments.value.length;
    }
  } catch (error) {
    console.error('Error al cargar más comentarios:', error);
  } finally {
    loadingMoreComments.value = false;
  }
};

const submitComment = async () => {
  if (!isFormValid.value) return;
  
  isSubmitting.value = true;
  try {
    const response = await postComment(newComment);
    
    const data = await response.json();
    
    if (data.success) {
      // Añadir el nuevo comentario al principio de la lista
      comments.value.unshift(data.comment);
      
      // Resetear el formulario
      newComment.value.content = '';
      form.value.reset();
      
      commentStatus.value = {
        show: true,
        type: 'success',
        message: '¡Comentario publicado con éxito!'
      };
      
      // Ocultar el mensaje después de 5 segundos
      setTimeout(() => {
        commentStatus.value.show = false;
      }, 5000);
    } else {
      throw new Error(data.message || 'Error al publicar el comentario');
    }
  } catch (error) {
    console.error('Error al enviar comentario:', error);
    commentStatus.value = {
      show: true,
      type: 'error',
      message: error.message || 'Error al publicar el comentario. Inténtalo de nuevo.'
    };
  } finally {
    isSubmitting.value = false;
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

// Función para ocultar parte del email por privacidad
const maskEmail = (email) => {
  if (!email) return '';
  const [username, domain] = email.split('@');
  if (username.length <= 2) return email;
  
  return `${username.substring(0, 2)}***@${domain}`;
};

onMounted(fetchModDetails);
</script>

<style scoped>
.mod-detail {
  margin-bottom: 24px;
}
</style>