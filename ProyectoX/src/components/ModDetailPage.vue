<template>
  <div class="nexus-detail-page">
    <!-- Botó de tornar -->
    <v-btn 
      @click="$router.back()" 
      prepend-icon="mdi-arrow-left" 
      variant="text"
      color="#fc503b"
      class="nexus-back-btn"
    >
      Tornar a la llista
    </v-btn>
    
    <!-- Contingut principal -->
    <v-card v-if="mod" class="nexus-mod-detail">
      <!-- Capçalera -->
      <div class="nexus-mod-header">
        <h1 class="nexus-mod-title">{{ mod.title }}</h1>
        <div class="nexus-mod-author">per {{ mod.uploaded_by || 'Anònim' }}</div>
      </div>
      
      <v-divider class="nexus-divider"></v-divider>
      
      <div class="nexus-mod-content">
        <!-- Columna esquerra -->
        <div class="nexus-main-column">
          <!-- Descripció -->
          <div class="nexus-section">
            <h2 class="nexus-section-title">Descripció</h2>
            <div class="nexus-mod-description">{{ mod.description }}</div>
          </div>
          
          <!-- Actualitzacions -->
          <div class="nexus-section" v-if="mod.uploaded_at">
            <h2 class="nexus-section-title">Actualitzacions</h2>
            <div class="nexus-update-info">
              <div class="nexus-update-item">
                <span class="nexus-update-label">Pujada original:</span>
                <span class="nexus-update-value">{{ formatDate(mod.uploaded_at) }}</span>
              </div>
            </div>
          </div>
          
          <!-- Comentaris -->
          <div class="nexus-section">
            <h2 class="nexus-section-title">Comentaris</h2>
            
            <!-- Formulari per afegir comentaris -->
            <v-card variant="outlined" class="nexus-comment-form">
              <h3 class="nexus-comment-form-title">Afegeix un comentari</h3>
              
              <v-form @submit.prevent="submitComment" v-model="formValid">
                <v-textarea
                  v-model="newComment.content"
                  label="Comentari"
                  :rules="[v => !!v || 'El comentari és obligatori']"
                  required
                  counter
                  rows="3"
                  variant="outlined"
                  class="nexus-comment-input"
                ></v-textarea>
                
                <div class="nexus-rating-section">
                  <label class="nexus-rating-label">Valoració</label>
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
                  Publicar comentari
                </v-btn>
              </v-form>
            </v-card>
            
            <!-- Llista de comentaris -->
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
                    label="Editar comentari"
                    variant="outlined"
                  ></v-textarea>
                  <div class="nexus-comment-edit-actions">
                    <v-btn color="#fc503b" @click="editComment(comment)" size="small">Desar</v-btn>
                    <v-btn variant="text" @click="isEditing = false" size="small">Cancel·lar</v-btn>
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
                      {{ isEditing ? 'Cancel·lar' : 'Editar' }}
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
              <p>Encara no hi ha comentaris. Sigues el primer a opinar!</p>
            </div>
          </div>
        </div>
        
        <!-- Columna dreta -->
        <div class="nexus-sidebar">
          <!-- Estadístiques -->
          <v-card variant="outlined" class="nexus-stats-card">      
            <v-divider class="nexus-stats-divider"></v-divider>
            
            <div class="nexus-stats-item">
              <div class="nexus-stats-label">Descàrregues totals</div>
              <div class="nexus-stats-value">{{ mod.downloads || 0 }}</div>
            </div>
            
            <v-divider class="nexus-stats-divider"></v-divider>
            
            <div class="nexus-stats-item">
              <div class="nexus-stats-label">Versió</div>
              <div class="nexus-stats-value">1.0</div>
            </div>
          </v-card>

          <!-- Botó de descàrrega -->
          <v-btn
            @click="download(mod)" 
            block 
            color="#fc503b" 
            size="large"
            prepend-icon="mdi-download"
            class="nexus-download-btn"
          >
            Descarregar mod
          </v-btn>
          
          <!-- Gràfic de descàrregues diàries -->
          <v-card variant="outlined" class="nexus-downloads-chart-card">
            <h3 class="nexus-chart-title">Descàrregues diàries</h3>
            <div class="nexus-chart-container">
              <canvas ref="downloadsChart"></canvas>
              <div class="nexus-chart-indicator" :class="trendClass" v-if="trendPercentage !== 0">
                <v-icon :color="trendColor">{{ trendIcon }}</v-icon>
                {{ trendPercentage }}%
              </div>
            </div>
          </v-card>
          
          <!-- Informació del creador -->
          <v-card variant="outlined" class="nexus-creator-card">
            <div class="nexus-creator-item">
              <span class="nexus-creator-label">Creat per</span>
              <span class="nexus-creator-value">{{ mod.uploaded_by || 'Anònim' }}</span>
            </div>
            
            <div class="nexus-creator-item">
              <span class="nexus-creator-label">Pujat per</span>
              <span class="nexus-creator-value">{{ mod.uploaded_by || 'Anònim' }}</span>
            </div>
            
            <div class="nexus-creator-item">
              <span class="nexus-creator-label">Escaneig de virus</span>
              <span class="nexus-creator-value nexus-virus-safe">
                <v-icon color="success">mdi-check-circle</v-icon>
                Segur
              </span>
            </div>
          </v-card>
          
          <!-- Etiquetas -->
        <v-card variant="outlined" class="nexus-tags-card">
          <h3 class="nexus-tags-title">Etiquetes per aquest mod</h3>
          
          <div v-if="mod.tags && mod.tags.length > 0" class="nexus-tags-list">
            <v-chip 
              v-for="(tag, index) in mod.tags" 
              :key="index" 
              class="nexus-tag"
              :color="tag.color || '#fc503b'" 
              label
              small
            >
              {{ tag.name || tag }}
            </v-chip>
          </div>
          
          <div v-else class="nexus-no-tags">
            <v-icon small color="grey">mdi-tag-off</v-icon>
            <span>Encara no hi ha etiquetes</span>
          </div>
          
          <v-btn 
            variant="text" 
            color="#fc503b" 
            size="small" 
            class="nexus-add-tag-btn"
            v-if="userEmail"
            @click="openAddTagDialog"
          >
            + Afegir etiqueta
          </v-btn>
        </v-card>

        </div>
      </div>
    </v-card>
    
    <!-- Estats de carrega/error -->
    <v-card v-else class="nexus-loading-card">
      <v-card-text class="nexus-loading-content">
        <v-progress-circular indeterminate color="#fc503b" v-if="loading"></v-progress-circular>
        <div v-else class="nexus-error-message">
          <v-icon color="error" size="large">mdi-alert-circle</v-icon>
          <p>Mod no trobat</p>
        </div>
      </v-card-text>
    </v-card>
    
    <!-- Snackbar per a missatges -->
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
          Tancar
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { getCommentsById, getMod, postComment, patchDownloadMod, deleteCommentMongodb, putComment } from '@/services/communicationManager';
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
const downloadsChart = ref(null);
const chartInstance = ref(null);

// Variables per a l'indicador de tendència (estil Steam)
const trendPercentage = ref(0);
const trendColor = ref('success');
const trendIcon = ref('mdi-arrow-up');
const trendClass = ref('up');


const openAddTagDialog = () => {
  // Implementa la lógica para añadir una nueva etiqueta
  snackbar.value = {
    show: true,
    text: 'Funcionalitat d\'afegir etiqueta en desenvolupament',
    color: 'info'
  };
};

const newComment = ref({
  email: userEmail,
  content: '',
  modId: route.params.id,
  rating: 5
});

// Funció millorada per calcular la tendència (7 dies com Steam)
const calculateTrend = (data) => {
  if (!data || data.length < 2) {
    trendPercentage.value = 0;
    trendColor.value = 'warning';
    trendIcon.value = 'mdi-minus';
    trendClass.value = 'neutral';
    return;
  }

  // Agafar els últims 7 dies o tots si n'hi ha menys de 7
  const recentData = data.length > 7 ? data.slice(-7) : data;
  const firstValue = recentData[0].totalDownloads;
  const lastValue = recentData[recentData.length - 1].totalDownloads;

  if (firstValue === 0) {
    trendPercentage.value = 100;
    trendColor.value = 'success';
    trendIcon.value = 'mdi-arrow-up';
    trendClass.value = 'up';
    return;
  }

  const percentageChange = ((lastValue - firstValue) / firstValue) * 100;
  trendPercentage.value = Math.round(Math.abs(percentageChange));

  if (percentageChange > 0) {
    trendColor.value = 'success';
    trendIcon.value = 'mdi-arrow-up';
    trendClass.value = 'up';
  } else if (percentageChange < 0) {
    trendColor.value = 'error';
    trendIcon.value = 'mdi-arrow-down';
    trendClass.value = 'down';
  } else {
    trendColor.value = 'warning';
    trendIcon.value = 'mdi-minus';
    trendClass.value = 'neutral';
  }
};

// Funció per inicialitzar el gràfic (estil Steam)
const initChart = () => {
  // Verificar si el canvas existeix i està disponible
  if (!downloadsChart.value) {
    console.log('Canvas no disponible per al gràfic');
    return;
  }

  // Verificar si hi ha dades disponibles
  const stats = mod.value?.statsDailyDownloadsMods;
  if (!stats || !stats.length) {
    console.log('No hi ha dades suficients per al gràfic');
    return;
  }

  try {
    // Verificar si el canvas té context
    const ctx = downloadsChart.value.getContext('2d');
    if (!ctx) {
      console.error('No es pot obtenir el context del canvas');
      return;
    }
    
    if (chartInstance.value) {
      chartInstance.value.destroy();
      chartInstance.value = null;
    }
    
    // Ordenar dades per data
    const sortedData = [...mod.value.statsDailyDownloadsMods].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    // Preparar etiquetes i dades
    const labels = sortedData.map(item => 
      new Date(item.date).toLocaleDateString('ca-ES', { day: 'numeric', month: 'short' })
    );
    const data = sortedData.map(item => item.totalDownloads);

    // Calcular tendència
    calculateTrend(sortedData);

    // Destruir instància anterior si existeix
    // if (chartInstance.value) {
    //   try {
    //     chartInstance.value.destroy();
    //   } catch (error) {
    //     console.error('Error en destruir el gràfic anterior:', error);
    //   }
    //   chartInstance.value = null;
    // }

    // Crear nova instància amb estil Steam
    chartInstance.value = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Descàrregues Diàries',
          data: data,
          backgroundColor: '#fc503b',
          borderColor: '#fc503b',
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            display: false 
          },
          tooltip: {
            backgroundColor: '#1e1e1e',
            titleColor: '#ffffff',
            bodyColor: '#e0e0e0',
            borderColor: '#fc503b',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.raw}`
            }
          }
        },
        scales: {
          x: {
            grid: { 
              display: false,
              drawBorder: false
            },
            ticks: { 
              color: '#a0a0a0',
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 7
            }
          },
          y: {
            beginAtZero: true,
            grid: { 
              color: 'rgba(255,255,255,0.05)',
              drawBorder: false
            },
            ticks: { 
              color: '#a0a0a0',
              precision: 0
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        animation: {
          duration: 800
        }
      }
    });
  } catch (error) {
    console.error('Error en inicialitzar el gràfic:', error);
    if (chartInstance.value) {
      chartInstance.value = null;
    }
  }
};

const initDownloadsHistory = () => {
  if (!mod.value.downloads_history) {
    mod.value.downloads_history = [];
  }
};

// Hecho
const fetchModDetails = async () => {
  loading.value = true;

  try {
    const response = await getMod(route.params.id);
    
    if (!response) {
      snackbar.value = {
        show: true,
        text: 'Error de xarxa o problema al servidor',
        color: 'error'
      }
      return;
    }

    const data = await response.json();
    console.log('Datos completos del mod:', data); 

    if (!response.ok) {
      snackbar.value = {
        show: true,
        text: data.error || 'Error en obtenir el mod',
        color: 'error'
      };
      return;
    }

    mod.value = data.modUser;
    console.log('Datos del modUser:', mod.value);

    if (data.statsDailyDownloadsMods) {
      mod.value.statsDailyDownloadsMods = data.statsDailyDownloadsMods;
    }
    
    initDownloadsHistory();
    await fetchComments();
    
    if (downloadsChart.value) {
      nextTick(() => {
        initChart();
      });
    }
  } catch {
    snackbar.value = {
      show: true,
      text: 'Error inesperat en carregar detalls del mod',
      color: 'error'
    };
  } finally {
    loading.value = false;
  }
};

// Hecho
const fetchComments = async () => {
  try {
    const response = await getCommentsById(route.params.id);

    if(!response) {
      console.error('Error de xarxa o problema al servidor');
      return;
    }

    const data = await response.json();

    if(!response.ok) {
      console.error(data.error || 'Error en obtenir tots els comentaris');
      return;
    }

    comments.value = data;
  } catch {
    console.error('Error inesperat en obtenir tots els comentaris');
  }
};

// Hecho
const submitComment = async () => {
  submitting.value = true;

  try {
    const response = await postComment(newComment);

    if(!response) {
      snackbar.value = {
        show: true,
        text: 'Error de xarxa o problema al servidor',
        color: 'error'
      };
      return;
    }

    const data = await response.json();

    if(!response.ok) {
      snackbar.value = {
        show: true,
        text: data.error || 'Error en registrar el comentari',
        color: 'error'
      };
      return;
    }
    
    newComment.value = {
      email: userEmail,
      content: '',
      modId: route.params.id,
      rating: 5
    };
    
    snackbar.value = {
      show: true,
      text: 'Comentari publicat correctament',
      color: 'success'
    };
    
    await fetchComments();
  } catch {
    snackbar.value = {
      show: true,
      text: 'Error inesperat en publicar comentari',
      color: 'error'
    };
  } finally {
    submitting.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'Data desconeguda';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ca-ES', {
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

// Hecho
const download = async (mod) => {
  try {
    const response = await patchDownloadMod(route.params.id);

    if(!response) {
      snackbar.value = {
        show: true,
        text: 'Error de xarxa o problema al servidor',
        color: 'error'
      };
      return;
    }

    /*
    if(!response.ok) {
      snackbar.value = {
        show: true,
        text: data.error || 'Error en registrar el comentari',
        color: 'error'
      };
      return;
    }
    */

    const link = document.createElement('a');
    link.href = `http://localhost:3002${mod.file_path}`;
    link.setAttribute('download', `${mod.title || 'mod'}.zip`);
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
      
    snackbar.value = {
      show: true,
      text: 'Descàrrega iniciada',
      color: 'success'
    };
  } catch {
    snackbar.value = {
      show: true,
      text: 'Error en iniciar la descàrrega',
      color: 'error'
    };
  }
};

// Hecho
const deleteComment = async (comment) => {
  try {
    const response = await deleteCommentMongodb(comment._id);

    if(!response) {
      snackbar.value = {
        show: true,
        text: 'Error de xarxa o problema al servidor',
        color: 'error'
      };
      return;
    }

    const data = await response.json();

    if(!response.ok) {
      snackbar.value = {
        show: true,
        text: data.error || 'Error en eliminar el comentari',
        color: 'error'
      };
      return;
    }

    snackbar.value = {
      show: true,
      text: 'Comentari eliminat correctament!',
      color: 'success'
    };

    await fetchComments();
  } catch {
    snackbar.value = {
      show: true,
      text: 'Error inesperat en eliminar el comentari',
      color: 'error'
    };
  }
};

const toggleEdit = (comment) => {
  if (!isEditing.value) {
    newContent.value = comment.content;
  }
  isEditing.value = !isEditing.value;
};

// Hecho
const editComment = async (comment) => {
  try {
    const response = await putComment(comment._id, newContent.value);

    if(!response) {
      snackbar.value = {
        show: true,
        text: 'Error de xarxa o problema al servidor',
        color: 'error'
      };
      return;
    }

    const data = await response.json();

    if(!response.ok) {
      snackbar.value = {
        show: true,
        text: data.error || 'Error en actualitzar el comentari',
        color: 'error'
      };
      return;
    }

    snackbar.value = {
      show: true,
      text: 'Comentari actualitzat correctament!',
      color: 'success'
    };

    comment.content = newContent.value;
    isEditing.value = false;
  } catch {
    snackbar.value = {
      show: true,
      text: 'Error inesperat en actualitzar el comentari',
      color: 'error'
    };
  }
};

// Observar canvis en les dades de descàrregues
// watch(() => mod.value?.statsDailyDownloadsMods, (newVal) => {
//   if (newVal && downloadsChart.value) {
//     nextTick(() => {
//       initChart();
//     });
//   }
// }, { deep: true });

onMounted(() => {
  fetchModDetails();
  // Inicialitzar el gràfic quan el component estigui muntat
  nextTick(() => {
    if (downloadsChart.value) {
      initChart();
    }
  });
  listenToModDownloads2(mod, initChart);
});

onBeforeUnmount(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }
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
.nexus-files-card,

.nexus-downloads-chart-card {
  background: rgba(20, 20, 20, 0.8);
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
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

/* Estilos para el gráfico de descargas */
.nexus-downloads-chart-card {
  background: rgba(13, 13, 13, 0.8);
  border: 1px solid #252525;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;
}

.nexus-chart-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: rgba(255, 255, 255, 0.9);
}

.nexus-chart-container {
  position: relative;
  height: 220px;
  width: 100%;
}

.nexus-chart-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: 16px;
  background: rgba(30, 30, 30, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.nexus-chart-indicator.up {
  color: #4caf50;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.nexus-chart-indicator.down {
  color: #f44336;
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.nexus-chart-indicator.neutral {
  color: #ff9800;
  border: 1px solid rgba(255, 152, 0, 0.3);
}


.nexus-chart-arrow {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(13, 13, 13, 0.7);
}

.nexus-chart-arrow.up {
  color: #4caf50;
}

.nexus-chart-arrow.down {
  color: #f44336;
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


.nexus-tags-card {
  margin-top: 16px;
  padding: 16px;
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
  background: rgba(252, 80, 59, 0.1) !important;
  color: #fc503b !important;
  border: 1px solid rgba(252, 80, 59, 0.3);
  font-size: 0.8rem;
}

.nexus-no-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  margin-bottom: 12px;
}

.nexus-add-tag-btn {
  width: 100%;
  margin-top: 8px;
}
</style>