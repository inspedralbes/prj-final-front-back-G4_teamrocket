<template>
  <v-container>
    <h2 class="mb-4">Gestión de Mods</h2>
    <v-row class="mb-4">
      <v-col cols="12" sm="6" md="4">
        <v-select
          v-model="selectedFilter"
          :items="[
            { text: 'Todos los mods', value: 'todos' },
            { text: 'Solo seguros', value: 'seguros' },
            { text: 'Solo no seguros', value: 'no_seguros' }
          ]"
          item-text="text"
          item-value="value"
          label="Filtrar por seguridad"
          dense
          outlined
        ></v-select>
      </v-col>
    </v-row>
    <v-table>
      <thead>
        <tr>
          <th>Título</th>
          <th>Autor</th>
          <th>Descargar</th>
          <th>¿Seguro?</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="mod in filteredMods" :key="mod.id">
          <td>{{ mod.title }}</td>
          <td>{{ mod.username || 'Desconocido' }}</td>
          <td>
            <v-btn color="primary" :href="`http://localhost:3002${mod.file_path}`" target="_blank">
              Descargar
            </v-btn>
          </td>
          <td>
            <v-switch
              v-model="mod.security"
              @change="toggleSafety(mod)"
              color="success"
            ></v-switch>
          </td>
          <td>{{ mod.uploaded_at }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getModsAdmin } from '@/services/communicationManager';

const mods = ref([]);
const selectedFilter = ref('todos');

const toggleSafety = async (mod) => {
  try {
    await fetch(`http://localhost:3002/api/mods/${mod.id}/safe`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isSafe: mod.security }),
    });
  } catch (err) {
    console.error("Error al actualizar la seguridad del mod", err);
  }
};

const filteredMods = computed(() => {
  if (selectedFilter.value === 'seguros') {
    return mods.value.filter(mod => mod.security === true);
  } else if (selectedFilter.value === 'no_seguros') {
    return mods.value.filter(mod => mod.security === false);
  } else {
    return mods.value;
  }
});

onMounted(async () => {
  mods.value = await getModsAdmin();
});
</script>