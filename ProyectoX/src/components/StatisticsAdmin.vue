<template>
  <v-card class="mb-4">
    <v-card-title>Estadistiques</v-card-title>
    <v-card-text>
      <div class="chart-container">
        <canvas ref="statsChart"></canvas>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { Chart } from 'chart.js/auto';

const statsMods = ref([]);
const userCount = ref(0);
const modCount = ref(0);
const statsChart = ref(null);
let chartInstance = null;

onMounted(async () => {
  // Obtener estadísticas de mods
  const modsResponse = await fetch('http://localhost:3002/api/stats/stats-mods');
  statsMods.value = await modsResponse.json();
  
  // Obtener total de usuarios
  const usersResponse = await fetch('http://localhost:3002/api/users');
  const usersData = await usersResponse.json();
  userCount.value = usersData.users.length;
  
  // Obtener total de mods
  const modsData = await fetch('http://localhost:3002/api/mods');
  const allMods = await modsData.json();
  modCount.value = allMods.length;
  
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