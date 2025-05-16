<template>
  <v-container>
    <h2 class="mb-4">Gestión de Usuarios</h2>
    <v-table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre de usuario</th>
          <th>Email</th>
          <th>Admin</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>
                <v-icon color="primary" v-if="user.admin">mdi-shield-account</v-icon>
                <v-icon color="grey" v-else>mdi-account</v-icon>
            </td>
            <td>
                <v-btn color="red" @click="deleteUser(user.id)">Eliminar</v-btn>
                <v-btn color="blue" @click="changeAdmin(user.id)"> {{ user.admin == 1 ? 'Cambiar usuario' : 'Cambiar administrador' }}</v-btn>
            </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getUsersAdmin, deleteUserAdmin, changeUserAdmin } from '@/services/communicationManager';

const users = ref([]);

const fetchUsers = async () => {
    users.value = await getUsersAdmin();
    console.log(users.value);
}

const deleteUser = async (userId) => {
  try {
    await deleteUserAdmin(userId);

    fetchUsers();
  } catch (error) {
    console.error('Error al conectar con el servidor:', error);
  }
};

const changeAdmin = async (userId) => {
  try {
    await changeUserAdmin(userId);

    fetchUsers();
  } catch (error) {
    console.error('Error al conectar con el servidor:', error);
  }
};

onMounted(fetchUsers);
</script>