<template>
  <v-card class="mb-4">
    <v-card-title>Estadísticas</v-card-title>
    <v-card-text>
      <div class="chart-container">
        <canvas ref="statsChart"></canvas>
      </div>
      <div class="stats-summary">
        <p>Total de usuarios: {{ userCount }}</p>
        <p>Total de mods: {{ modCount }}</p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { Chart } from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(annotationPlugin);

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
    
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Nuevos Mods (Δ)',
            data: newModsData,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            tension: 0.4,
            fill: true,
            borderWidth: 2,
            pointStyle: 'triangle',
            pointRadius: 6,
            pointRotation: 180
          },
          {
            label: 'Mods Eliminados (Σ)',
            data: deletedModsData,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            tension: 0.4,
            fill: true,
            borderWidth: 2,
            pointStyle: 'rectRot',
            pointRadius: 5
          },
          {
            label: 'Total Usuarios',
            data: Array(labels.length).fill(userCount.value),
            borderColor: 'rgb(54, 162, 235)',
            borderDash: [5, 5],
            tension: 0,
            fill: false,
            borderWidth: 1
          },
          {
            label: 'Total Mods',
            data: Array(labels.length).fill(modCount.value),
            borderColor: 'rgb(153, 102, 255)',
            borderDash: [5, 5],
            tension: 0,
            fill: false,
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Estadísticas ΔΣ de la Plataforma',
            font: {
              size: 16
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false
          },
          annotation: {
            annotations: {
              arrowDelta: {
                type: 'line',
                yMin: Math.max(...newModsData) * 0.9,
                yMax: Math.max(...newModsData),
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 2,
                arrowHeads: {
                  start: {
                    enabled: true,
                    length: 15,
                    width: 10
                  },
                  end: {
                    enabled: true,
                    length: 15,
                    width: 10
                  }
                }
              },
              arrowSigma: {
                type: 'line',
                yMin: Math.max(...deletedModsData) * 0.9,
                yMax: Math.max(...deletedModsData),
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 2,
                arrowHeads: {
                  start: {
                    enabled: true,
                    length: 15,
                    width: 10
                  },
                  end: {
                    enabled: true,
                    length: 15,
                    width: 10
                  }
                }
              }
            }
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
            title: {
              display: true,
              text: 'Cantidad',
              font: {
                weight: 'bold'
              }
            },
            beginAtZero: true
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