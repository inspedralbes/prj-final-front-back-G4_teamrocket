<template>
  <div class="nexus-users-admin">
    <!-- Sección de Estadísticas -->
    <v-card class="stats-card">
      <div class="stats-header">
        <v-icon color="#fc503b" size="28" class="mr-2">mdi-chart-bar</v-icon>
        <h3 class="stats-title">Estadísticas de Usuarios</h3>
      </div>
      <v-divider class="stats-divider"></v-divider>
      <div class="stats-grid">
        <v-card v-for="stat in stats" :key="stat.title" class="stat-card" :class="stat.color">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.title }}</div>
        </v-card>
      </div>
    </v-card>

    <!-- Sección de Gestión -->
    <v-card class="management-card">
      <div class="management-header">
        <div class="header-left">
          <v-icon color="#fc503b" size="28" class="mr-2">mdi-account-cog</v-icon>
          <h3 class="management-title">Gestión de Usuarios</h3>
        </div>
        <v-text-field
          v-model="searchUsers"
          label="Buscar usuarios..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          class="search-field"
          hide-details
        ></v-text-field>
      </div>

      <v-data-table
        :headers="userHeaders"
        :items="filteredUsers"
        :search="searchUsers"
        class="users-table"
      >
        <template v-slot:item.admin="{ item }">
          <v-chip :color="item.admin ? 'red' : 'grey'" small>
            <v-icon left small>{{ item.admin ? 'mdi-shield-account' : 'mdi-account' }}</v-icon>
            {{ item.admin ? 'Admin' : 'Usuario' }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="actions-container">
            <v-tooltip text="Eliminar usuario" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  color="red"
                  size="small"
                  @click="deleteUser(item.id)"
                  class="action-btn"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip :text="item.admin ? 'Quitar admin' : 'Hacer admin'" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  color="blue"
                  size="small"
                  @click="changeAdmin(item.id)"
                  class="action-btn"
                >
                  <v-icon>{{ item.admin ? 'mdi-account-remove' : 'mdi-account-star' }}</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { getUsersAdmin, deleteUserAdmin, changeUserAdmin } from '@/services/communicationManager';

const users = ref([]);
const searchUsers = ref('');

const stats = computed(() => [
  { title: 'Usuarios totales', value: users.value.length, color: 'stat-total' },
  { title: 'Administradores', value: users.value.filter(u => u.admin).length, color: 'stat-admin' },
  { title: 'Usuarios normales', value: users.value.filter(u => !u.admin).length, color: 'stat-normal' }
]);

const userHeaders = [
  { title: 'ID', key: 'id', width: '80px' },
  { title: 'Nombre de usuario', key: 'username' },
  { title: 'Email', key: 'email' },
  { title: 'Rol', key: 'admin', align: 'center' },
  { title: 'Acciones', key: 'actions', align: 'center', sortable: false }
];

const filteredUsers = computed(() => {
  return users.value.map(user => ({
    ...user,
    email: user.email.length > 25 ? user.email.substring(0, 22) + '...' : user.email
  }));
});

const fetchUsers = async () => {
  users.value = await getUsersAdmin();
};

const deleteUser = async (userId) => {
  try {
    await deleteUserAdmin(userId);
    fetchUsers();
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
  }
};

const changeAdmin = async (userId) => {
  try {
    await changeUserAdmin(userId);
    fetchUsers();
  } catch (error) {
    console.error('Error al cambiar rol:', error);
  }
};

fetchUsers();
</script>

<style scoped>
.nexus-users-admin {
  padding: 20px;
}

.stats-card {
  background-color: rgba(25, 25, 25, 0.9) !important;
  border: 1px solid #333;
  border-radius: 8px;
  margin-bottom: 25px;
  overflow: hidden;
}

.stats-header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background-color: rgba(18, 18, 18, 0.9);
}

.stats-title {
  color: #fc503b;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.stats-divider {
  border-color: #333 !important;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  padding: 20px;
}

.stat-card {
  padding: 16px;
  border-radius: 6px;
  text-align: center;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
}

.stat-total {
  border-top: 3px solid #fc503b;
}

.stat-admin {
  border-top: 3px solid #f44336;
}

.stat-normal {
  border-top: 3px solid #2196f3;
}

.stat-value {
  color: #fc503b;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  color: #b0b0b0;
  font-size: 0.9rem;
  margin-top: 8px;
}

.management-card {
  background-color: rgba(25, 25, 25, 0.9) !important;
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
}

.management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: rgba(18, 18, 18, 0.9);
  flex-wrap: wrap;
  gap: 15px;
}

.header-left {
  display: flex;
  align-items: center;
}

.management-title {
  color: #e0e0e0;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.search-field {
  max-width: 300px;
  min-width: 250px;
}

.users-table {
  background-color: transparent !important;
}

.users-table :deep(.v-table__wrapper) {
  border-radius: 0 0 8px 8px;
}

.users-table :deep(thead tr) {
  background-color: rgba(18, 18, 18, 0.9) !important;
}

.users-table :deep(th) {
  color: #fc503b !important;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.users-table :deep(td) {
  border-bottom: 1px solid #333 !important;
}

.users-table :deep(tr:hover td) {
  background-color: rgba(252, 80, 59, 0.05) !important;
}

.actions-container {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.action-btn {
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: scale(1.2);
}

/* Responsive */
@media (max-width: 768px) {
  .management-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-field {
    width: 100%;
    max-width: 100%;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>