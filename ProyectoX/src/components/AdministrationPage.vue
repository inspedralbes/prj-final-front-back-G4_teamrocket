<template>
  <div class="nexus-admin">
    <v-app-bar app color="#0d0d0d" dark elevation="0" height="60" class="nexus-header fixed-header">
        <div class="logo-container">
    <v-img
      src="@/assets/Logo del Juego de darkness Unseen.png"
      alt="Logo del Juego"
      class="logo nexus-logo"
      contain
      width="40"
      height="40"
      @click="navigateToMainPage"
    ></v-img>
  </div>
      
      <v-spacer></v-spacer>
      
      <div class="nexus-user-section">
        <v-btn
          color="#fc503b"
          class="nexus-login-btn"
          to="/"
          text
          :ripple="false"
        >
          <v-icon left size="20">mdi-home</v-icon>
          Inicio
        </v-btn>
        <v-btn
          color="#fc503b"
          class="nexus-login-btn"
          to="/mods"
          text
          :ripple="false"
        >
          <v-icon left size="20">mdi-puzzle</v-icon>
          Mods
        </v-btn>
      </div>
    </v-app-bar>

    <div class="admin-content-wrapper">
      <v-container class="nexus-admin-container">
        <v-row>
          <v-col cols="12" md="3" class="nexus-admin-sidebar">
            <v-card class="nexus-admin-card">
              <v-list bg-color="transparent">
                <v-list-item
                  v-for="item in adminNavItems"
                  :key="item.title"
                  :value="item.value"
                  active-color="#fc503b"
                  @click="activeTab = item.value"
                >
                  <template v-slot:prepend>
                    <v-icon>{{ item.icon }}</v-icon>
                  </template>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>

              <v-divider class="my-2"></v-divider>
              <v-card-actions class="d-flex flex-column">
                <v-btn
                  color="#fc503b"
                  label="Adminer"
                  href="http://localhost:8080"
                  target="_blank"
                  block
                  class="mb-2"
                >
                  Adminer
                </v-btn>
                <v-btn
                  color="#fc503b"
                  label="Microserveis"
                  href="http://localhost:9000"
                  target="_blank"
                  block
                >
                  Microserveis
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col cols="12" md="9">
            <v-card class="nexus-admin-main-card">
              <component :is="activeComponent" />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import UsersAdmin from './UsersAdmin.vue';
import ModsAdmin from './ModsAdmin.vue';
import StatisticsAdmin from './StatisticsAdmin.vue';

const router = useRouter();
const activeTab = ref('users');

const adminNavItems = [
  { title: "Gestió d'Usuaris", icon: 'mdi-account-group', value: 'users' },
  { title: 'Gestió de Mods', icon: 'mdi-puzzle', value: 'mods' },
  { title: 'Estadístiques', icon: 'mdi-chart-bar', value: 'stats' },
];

const componentsMap = {
  'users': UsersAdmin,
  'mods': ModsAdmin,
  'stats': StatisticsAdmin
};

const activeComponent = computed(() => componentsMap[activeTab.value] || UsersAdmin);

const navigateToMainPage = () => {
  router.push('/');
};
</script>

<style scoped>
.nexus-admin {
  background-color: #0d0d0d;
  min-height: 100vh;
}

.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 0 5%;
}

.admin-content-wrapper {
  margin-top: 80px;
  padding-bottom: 40px;
}

.nexus-admin-container {
  max-width: 1400px;
  padding: 20px;
}

.nexus-admin-sidebar {
  padding-right: 0;
}

.nexus-admin-card {
  background-color: rgba(25, 25, 25, 0.9) !important;
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.nexus-admin-main-card {
  background-color: rgba(25, 25, 25, 0.9) !important;
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
  min-height: 500px;
}

.logo-container {
  margin-right: 20px;
  padding: 8px;
  cursor: pointer;
  overflow: visible;
}

.nexus-logo {
  border-radius: 50%;
  border: 2px solid #fc503b;
  transition: transform 0.3s ease;
  cursor: pointer;
  display: block;
  margin: 0 auto;
  transform-origin: center;
  box-sizing: content-box;
}

.nexus-logo:hover {
  transform: scale(1.15);
  box-shadow: 0 0 15px rgba(252, 80, 59, 0.5);
}

.nexus-user-section {
  display: flex;
  gap: 10px;
}

.nexus-login-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: normal;
  font-size: 0.875rem;
  height: 36px;
  padding: 0 12px;
}

.nexus-login-btn .v-btn__content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nexus-admin-sidebar .v-list-item {
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
  margin-bottom: 4px;
}

.nexus-admin-sidebar .v-list-item--active {
  border-left: 3px solid #fc503b;
  background-color: rgba(252, 80, 59, 0.1) !important;
}

.nexus-admin-sidebar .v-list-item:hover {
  background-color: rgba(252, 80, 59, 0.05) !important;
}

@media (max-width: 960px) {
  .nexus-admin-sidebar {
    padding-right: 12px;
    margin-bottom: 20px;
  }
  
  .admin-content-wrapper {
    margin-top: 70px;
  }
}
</style>