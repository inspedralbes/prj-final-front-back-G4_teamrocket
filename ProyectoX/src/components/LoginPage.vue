<template>
  <div class="nexus-login-container">
    <v-container fluid class="pa-0 h-100">
      <v-row no-gutters class="h-100">
        <v-col cols="12" md="6" class="hidden-sm-and-down">
          <div id="particles-js-left" class="particles-left-container"></div>
        </v-col>

        <v-col cols="12" md="6">
          <div class="d-flex align-center justify-center h-100">
            <v-card class="nexus-login-card" elevation="10">
              <div class="nexus-login-header">
                <div class="logo-container">
                  <v-img
                    src="@/assets/Logo del Juego de darkness Unseen.png"
                    alt="Logo del Joc"
                    class="nexus-login-logo"
                    width="120"
                    height="120"
                  ></v-img>
                  <div class="logo-glow"></div>
                  <div class="logo-border"></div>
                </div>
              </div>
             
              <v-card-title class="nexus-login-title">
                INICIAR SESSIÓ
              </v-card-title>
             
              <v-card-text class="nexus-login-content">
                <v-text-field
                  v-model="email"
                  label="Correu electrònic"
                  required
                  prepend-inner-icon="mdi-email"
                  variant="outlined"
                  color="#fc503b"
                  class="nexus-input mb-4"
                  :rules="[rules.required]"
                ></v-text-field>

                <v-text-field
                  v-model="password"
                  label="Contrasenya"
                  type="password"
                  required
                  prepend-inner-icon="mdi-lock"
                  variant="outlined"
                  color="#fc503b"
                  class="nexus-input mb-4"
                  :rules="[rules.required]"
                ></v-text-field>

                <v-btn
                  @click="login"
                  block
                  color="#fc503b"
                  size="large"
                  :loading="loading"
                  class="nexus-login-btn mb-4"
                >
                  <template v-if="loginSuccess">
                    <v-icon color="white" class="mr-2">mdi-check-circle</v-icon>
                    INICIAT CORRECTAMENT
                  </template>
                  <template v-else-if="loginError">
                    <v-icon color="white" class="mr-2">mdi-alert-circle</v-icon>
                    ERROR EN INICI
                  </template>
                  <template v-else>
                    INICIAR SESSIÓ
                  </template>
                </v-btn>
                <div class="nexus-login-footer">
                  <p class="nexus-login-text">No tens un compte?</p>
                  <v-btn
                    variant="text"
                    to="/register"
                    color="#fc503b"
                    class="nexus-register-btn"
                    :ripple="false"
                  >
                    Registra't aquí
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </div>
        </v-col>
        <v-snackbar
          v-model="snackbar.show"
          :color="snackbar.color"
          timeout="3000"
          location="bottom"
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
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { postLogin } from "../services/communicationManager.js";
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const email = ref('');
const password = ref('');
const loginSuccess = ref(false);
const loginError = ref(false);
const snackbar = ref({
  show: false,
  text: '',
  color: ''
});

const login = async () => {
  loading.value = true;

  if(!email.value || !password.value) {
    loginError.value = true;
    snackbar.value = {
      show: true,
      text: 'Falta omplir els camps',
      color: 'error'
    }

    setTimeout(() => {
      loginError.value = false;
    }, 2000);

    loading.value = false;
    return;
  }

  try {
    const response = await postLogin(email, password);

    if(!response) {
      loginError.value = true;
      snackbar.value = {
        show: true,
        text: 'Error de xarxa o problema al servidor',
        color: 'error'
      }

      setTimeout(() => {
        loginError.value = false;
      }, 2000);

      return;
    }

    const data = await response.json();

    if (!response.ok) {
      loginError.value = true;
      snackbar.value = {
        show: true,
        text: data.error || 'Error en iniciar sessió',
        color: 'error'
      }

      setTimeout(() => {
        loginError.value = false;
      }, 2000);
      return;
    }

    localStorage.setItem('userEmail', data.email);
    localStorage.setItem('userAdmin', data.admin.toString());

    loginSuccess.value = true;
    snackbar.value = {
      show: true,
      text: 'Benvingut a Darkness Unseen',
      color: 'success'
    }

    setTimeout(() => {
      router.push('/');
    }, 1000);
  } catch {
    loginError.value = true;
    snackbar.value = {
      show: true,
      text: 'Error inesperat en iniciar sessió',
      color: 'error'
    }

    setTimeout(() => {
      loginError.value = false;
    }, 2000);
  } finally {
    loading.value = false;
  }
};

const rules = {
  required: value => !!value || 'Aquest camp és obligatori',
};

onMounted(() => {
  if (window.particlesJS) {
    window.particlesJS('particles-js-left', {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#fc503b" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: { 
          enable: true, 
          distance: 150, 
          color: "#fc503b", 
          opacity: 0.3, 
          width: 1 
        },
        move: { 
          enable: true, 
          speed: 2, 
          direction: "none", 
          random: true, 
          straight: false, 
          out_mode: "out"
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "repulse" },
          onclick: { enable: true, mode: "push" }
        },
        modes: {
          repulse: { distance: 100, duration: 0.4 },
          push: { particles_nb: 4 }
        }
      }
    });
  }
});
</script>

<style scoped>
.nexus-login-container {
  min-height: 100vh;
  background-color: #121212;
  position: relative;
  overflow: hidden;
}

.h-100 {
  height: 100%;
}

.particles-left-container {
  position: absolute;
  width: 50%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: #0a0a0a;
}

.nexus-login-card {
  background-color: rgba(30, 30, 30, 0.9) !important;
  border-radius: 16px !important;
  border: 1px solid #333;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5) !important;
  overflow: hidden;
  position: relative;
  z-index: 1;
  backdrop-filter: blur(5px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  max-width: 450px;
  margin: 20px;
}

.nexus-login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 40px rgba(252, 80, 59, 0.2) !important;
}

.nexus-login-header {
  display: flex;
  justify-content: center;
  padding: 40px 0 20px;
  position: relative;
}

.logo-container {
  position: relative;
  width: 120px;
  height: 120px;
}

.nexus-login-logo {
  border-radius: 50%;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 2px solid #fc503b;
  position: relative;
  z-index: 2;
}

.logo-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: radial-gradient(circle, rgba(252, 80, 59, 0.4) 0%, rgba(252, 80, 59, 0) 70%);
  border-radius: 50%;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.3s;
}

.logo-border {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border: 2px solid transparent;
  border-radius: 50%;
  z-index: 1;
  transition: all 0.3s;
}

.logo-container:hover .nexus-login-logo {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 0 25px rgba(252, 80, 59, 0.7);
}

.logo-container:hover .logo-glow {
  opacity: 1;
}

.logo-container:hover .logo-border {
  border-color: rgba(252, 80, 59, 0.5);
  transform: scale(1.05);
}

.nexus-login-title {
  color: #fc503b !important;
  font-size: 1.8rem !important;
  font-weight: 700 !important;
  letter-spacing: 1px !important;
  text-transform: uppercase !important;
  text-align: center !important;
  padding: 0 24px 16px !important;
  margin-top: 10px;
  position: relative;
}

.nexus-login-title::after {
  content: '';
  display: block;
  width: 100px;
  height: 3px;
  background: linear-gradient(to right, transparent, #fc503b, transparent);
  margin: 10px auto 0;
}

.nexus-login-content {
  padding: 0 30px 30px !important;
}

.nexus-input :deep(.v-field) {
  background-color: rgba(18, 18, 18, 0.8) !important;
  border: 1px solid #333 !important;
  color: #e0e0e0 !important;
  transition: all 0.3s;
}

.nexus-input :deep(.v-field__outline) {
  color: #333 !important;
}

.nexus-input :deep(.v-field:hover .v-field__outline) {
  color: #fc503b !important;
}

.nexus-input :deep(.v-field--focused .v-field__outline) {
  color: #fc503b !important;
  opacity: 1 !important;
}

.nexus-input :deep(.v-label) {
  color: #b0b0b0 !important;
}

.nexus-input :deep(.v-field--focused .v-label) {
  color: #fc503b !important;
}

.nexus-input :deep(.v-field__prepend-inner) {
  padding-right: 12px !important;
}

.nexus-login-btn {
  background-color: #fc503b !important;
  color: white !important;
  font-weight: bold !important;
  letter-spacing: 1px !important;
  text-transform: uppercase !important;
  padding: 12px 24px !important;
  border-radius: 4px !important;
  transition: all 0.3s !important;
  margin-top: 20px !important;
  box-shadow: 0 4px 12px rgba(252, 80, 59, 0.3) !important;
}

.nexus-login-btn:hover {
  background-color: #e04635 !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 20px rgba(252, 80, 59, 0.4) !important;
}

.nexus-login-btn:active {
  transform: translateY(0) !important;
}

.nexus-login-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(252, 80, 59, 0.2);
}

.nexus-login-text {
  color: #b0b0b0;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.nexus-register-btn {
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
  transition: all 0.3s !important;
  padding: 0 8px !important;
  min-width: auto !important;
}

.nexus-register-btn:hover {
  color: white !important;
  text-shadow: 0 0 8px #fc503b;
}

.nexus-login-card {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 0.8s ease-out forwards;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 960px) {
  .particles-left-container {
    display: none;
  }
 
  .nexus-login-card {
    margin: 20px auto;
  }
}

@media (max-width: 600px) {
  .nexus-login-card {
    margin: 10px;
    border-radius: 12px !important;
  }
 
  .nexus-login-title {
    font-size: 1.5rem !important;
  }
 
  .nexus-login-content {
    padding: 0 20px 20px !important;
  }
 
  .logo-container {
    width: 100px;
    height: 100px;
  }
 
  .nexus-login-logo {
    width: 100px;
    height: 100px;
  }
}
</style>