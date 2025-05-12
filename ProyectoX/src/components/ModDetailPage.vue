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
                @click="download(mod)" 
                block 
                color="primary" 
                size="large"
                prepend-icon="mdi-download"
              >
                Descargar mod
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
        
        <!-- Sección de comentarios -->
        <v-divider class="my-6"></v-divider>
        
        <h3 class="text-h5 mb-4">Comentarios</h3>
        
        <!-- Formulario para añadir comentarios -->
        <v-card variant="outlined" class="mb-6 pa-4">
          <h4 class="text-h6 mb-3">Añadir un comentario</h4>
          
          <v-form @submit.prevent="submitComment" v-model="formValid">
            <v-textarea
              v-model="newComment.content"
              label="Comentario"
              :rules="[v => !!v || 'Comentario es requerido']"
              required
              counter
              rows="3"
            ></v-textarea>
            
            <div class="mb-3">
              <label class="text-subtitle-1 mb-2 d-block">Valoración</label>
              <v-rating
                v-model="newComment.rating"
                color="amber"
                hover
                half-increments
              ></v-rating>
            </div>
            
            <v-btn
              type="submit"
              color="primary"
              :disabled="!formValid"
              :loading="submitting"
            >
              Publicar comentario
            </v-btn>
          </v-form>
        </v-card>
        
        <!-- Lista de comentarios -->
        <div v-if="comments.length > 0">
          <v-card v-for="(comment, index) in comments" :key="index" class="mb-3 pa-4" variant="outlined">
            <div class="d-flex justify-space-between align-center">
              <div class="text-subtitle-1 font-weight-bold">{{ maskEmail(comment.email) }}</div>
              <v-rating
                :model-value="comment.rating"
                color="amber"
                readonly
                dense
                size="small"
              ></v-rating>
            </div>
            
            <div v-if="!isEditing" class="text-body-2 my-2">
              {{ comment.content }}
            </div>

            <div v-else class="text-body-2 my-2">
              <v-textarea
                v-model="newContent"
                rows="2"
                label="Editar comentario"
              />
              <v-btn color="primary" @click="editComment(comment)">Enviar</v-btn>
            </div>

            <div class="text-caption text-grey">
              {{ formatDate(comment.createdAt) }}
            </div>

            <div>
              <v-btn v-if="comment.email === userEmail" @click="deleteComment(comment)">Eliminar</v-btn>
              <v-btn v-if="comment.email === userEmail" @click="toggleEdit(comment)">
                {{ isEditing ? 'Cancelar' : 'Editar' }}
              </v-btn>
            </div>
          </v-card>
        </div>
        
        <div v-else class="text-center py-4">
          <v-icon size="large" color="grey">mdi-comment-outline</v-icon>
          <p class="text-body-1 mt-2">No hay comentarios aún. ¡Sé el primero en opinar!</p>
        </div>
        
        <v-snackbar
          v-model="snackbar.show"
          :color="snackbar.color"
          timeout="3000"
        >
          {{ snackbar.text }}
        </v-snackbar>
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
import { getCommentsById, getMod, postComment, postDownload, deleteCommentMongodb, putComment } from '@/services/communicationManager';
import { functionSocket2 } from '@/services/socketManager';

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

const fetchModDetails = async () => {
  loading.value = true;
  try {
    const response = await getMod(route.params.id);
    mod.value = await response.json();
    await fetchComments();
  } catch (error) {
    console.error('Error al cargar detalles del mod:', error);
  } finally {
    loading.value = false;
  }
};

const fetchComments = async () => {
  try {
    // Asumiendo que tienes un endpoint para obtener comentarios por modId
    const response = await getCommentsById(route.params.id);
    comments.value = await response.json();
    console.log(comments.value);
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
    
    // Resetear formulario
    newComment.value = {
      email: '',
      content: '',
      rating: 5
    };
    
    // Mostrar mensaje de éxito
    snackbar.value = {
      show: true,
      text: '¡Comentario publicado correctamente!',
      color: 'success'
    };
    
    // Actualizar lista de comentarios
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

// Función para ocultar parte del email por privacidad
const maskEmail = (email) => {
  if (!email) return '';
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  
  const name = parts[0];
  const domain = parts[1];
  
  // Mostrar solo primeros 2 caracteres + asteriscos + último caracter
  const maskedName = name.length <= 3 
    ? name 
    : `${name.substring(0, 2)}${'*'.repeat(name.length - 3)}${name.charAt(name.length - 1)}`;
  
  return `${maskedName}@${domain}`;
};

const download = async (mod) => {
  try {
    postDownload(route.params.id);

    const link = document.createElement('a');
    link.href = `http://localhost:3002${mod.file_path}`;
    link.setAttribute('download', '');
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    functionSocket2(mod);
  } catch (error) {
    console.log(error);
  }
}

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
    console.log("Error");
  }
};

const toggleEdit = (comment) => {
  if (!isEditing.value) {
    newContent.value = comment.content; // cargar contenido original
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

    console.log(newContent.value);
    comment.content = newContent.value;
    isEditing.value = false;
  } catch (error) {
    console.error("Error");
  }
}

onMounted(fetchModDetails);
</script>

<style scoped>
.mod-detail {
  margin-bottom: 24px;
}
</style>