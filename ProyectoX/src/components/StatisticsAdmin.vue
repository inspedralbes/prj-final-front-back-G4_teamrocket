<template>
  <v-card class="mb-4">
    <v-card-title>Estadistiques</v-card-title>
    <v-card-text>
      <div class="chart-container">
        <canvas ref="statsChart"></canvas>
      </div>
    </v-card-text>
  </v-card>

  <!-- Notificació d'estat -->
    <v-snackbar v-model="showNotification" :color="notificationColor" timeout="3000">
      {{ notificationMessage }}
    </v-snackbar>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { Chart } from 'chart.js/auto';
import { getStats, getUsersAdmin, getAllMods } from '@/services/communicationManager';

const statsMods = ref([]);
const userCount = ref(0);
const modCount = ref(0);
const statsChart = ref(null);
const showNotification = ref(false);
const notificationMessage = ref('');
const notificationColor = ref('');
let chartInstance = null;

const fetchStats = async () => {
  try {
    const response = await getStats();

    if(!response) {
      console.error('Error de xarxa o problema al servidor');
      notificationMessage.value = 'Error de xarxa o problema al servidor';
      notificationColor.value = 'error';
      showNotification.value = true;
      return;
    }

    const data = await response.json();

    if(!response.ok) {
      console.error('Error en obtenir les dades per les estadistiques');
      notificationMessage.value = 'Error en obtenir les dades per les estadistiques';
      notificationColor.value = 'error';
      showNotification.value = true;
      return;
    }

    statsMods.value = data;
  } catch (error) {
    console.error('Error inesperat en obtenir les dades per les estadistiques', error);
    notificationMessage.value = 'Error inesperat en obtenir les dades per les estadistiques';
    notificationColor.value = 'error';
    showNotification.value = true;
  }
}

const fetchUsers = async () => {
  try {
    const response = await getUsersAdmin();

    if(!response) {
      console.error('Error de xarxa o problema al servidor');
      notificationMessage.value = 'Error de xarxa o problema al servidor';
      notificationColor.value = 'error';
      showNotification.value = true;
      return;
    }

    const data = await response.json();

    if(!response.ok) {
      console.error('Error en obtenir tots els usuaris');
      notificationMessage.value = 'Error en obtenir tots els usuaris';
      notificationColor.value = 'error';
      showNotification.value = true;
      return;
    }

    const usersData = data;
    userCount.value = usersData.length;
  } catch (error) {
    console.error('Error inesperat en obtenir tots els usuris', error);
    notificationMessage.value = 'Error inesperat en obtenir tots els usuris';
    notificationColor.value = 'error';
    showNotification.value = true;
  }
}

const fetchMods = async () => {
  try {
    const response = await getAllMods();

    if(!response) {
      console.error('Error de xarxa o problema al servidor');
      notificationMessage.value = 'Error de xarxa o problema al servidor';
      notificationColor.value = 'error';
      showNotification.value = true;
      return;
    }

    const data = await response.json();

    if(!response.ok) {
      console.error('Error en obtenir tots els mods');
      notificationMessage.value = 'Error en obtenir tots els mods';
      notificationColor.value = 'error';
      showNotification.value = true;
      return;
    }

    const allMods = data;
    modCount.value = allMods.length;
  } catch (error) {
    console.error('Error inesperat en obtenir tots els mods', error);
    notificationMessage.value = 'Error inesperat en obtenir tots els mods'
    notificationColor.value = 'error';
    showNotification.value = true;
  }
}

onMounted(async () => {
  await fetchStats();
  await fetchUsers();
  await fetchMods();
  
  // Preparar datos para el gráfico
  prepareChartData();
});

const prepareChartData = () => {
  if (statsChart.value) {
    // Destruir el gráfico anterior si existe
    if (chartInstance) {
      chartInstance.destroy();
    }
    
    // Crear el nuevo gráfico
    const ctx = statsChart.value.getContext('2d');
    
    // Procesar datos para el gráfico
    const labels = statsMods.value.map(stat => {
      const date = new Date(stat.date);
      return date.toLocaleDateString();
    });
    
    const newModsData = statsMods.value.map(stat => stat.newMods);
    const deletedModsData = statsMods.value.map(stat => stat.deletedMods);
    const totalModsData = statsMods.value.map(stat => stat.totalMods || modCount.value);
    const totalUsersData = statsMods.value.map(stat => stat.totalUsers || userCount.value);
    
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Nous Mods',
            data: newModsData,
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            borderRadius: 4,
            yAxisID: 'y'
          },
          {
            label: 'Mods Eliminats',
            data: deletedModsData,
            backgroundColor: 'rgba(255, 99, 132, 0.7)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            borderRadius: 4,
            yAxisID: 'y'
          },
          {
            label: 'Total Mods',
            data: totalModsData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            type: 'line',
            tension: 0.1,
            fill: false,
            pointRadius: 5,
            yAxisID: 'y'
          },
          {
            label: 'Total Usuaris',
            data: totalUsersData,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 2,
            type: 'line',
            tension: 0.1,
            fill: false,
            pointRadius: 5,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            font: {
              size: 16
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false
          },
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Fecha',
              font: {
                weight: 'bold'
              }
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Mods',
              font: {
                weight: 'bold'
              }
            },
            beginAtZero: true
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Usuaris',
              font: {
                weight: 'bold'
              }
            },
            beginAtZero: true,
            grid: {
              drawOnChartArea: false
            }
          }
        }
      }
    });
  }
};
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 400px;
  margin-bottom: 20px;
}

.stats-summary {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
  border-left: 4px solid #1976d2;
}

.stats-summary p {
  margin: 8px 0;
  font-size: 1.1em;
}
</style>