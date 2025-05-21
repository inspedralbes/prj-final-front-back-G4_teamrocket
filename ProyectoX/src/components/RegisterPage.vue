<template>
  <div class="nexus-register-container">
    <div id="particles-js-register" class="particles-container"></div>
   
    <v-container fluid class="pa-0 h-100">
      <v-row no-gutters justify="center" align="center" class="h-100">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="nexus-register-card" elevation="10">
            <div class="nexus-register-header">
              <div class="logo-container">
                <v-img
                  src="@/assets/Logo del Juego de darkness Unseen.png"
                  alt="Logo del Juego"
                  class="nexus-register-logo"
                  width="80"
                  height="80"
                ></v-img>
                <div class="logo-glow"></div>
                <div class="logo-border"></div>
              </div>
            </div>
           
            <v-card-title class="nexus-register-title">
              CREAR COMPTE
            </v-card-title>
           
            <v-card-text class="nexus-register-content">
              <v-text-field
                v-model="username"
                :rules="usernameRules"
                label="Nom d'usuari"
                required
                prepend-inner-icon="mdi-account"
                variant="outlined"
                color="#fc503b"
                class="nexus-input mb-2"
                density="comfortable"
              ></v-text-field>


              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Correu electrònic"
                required
                prepend-inner-icon="mdi-email"
                variant="outlined"
                color="#fc503b"
                class="nexus-input mb-2"
                density="comfortable"
              ></v-text-field>


              <v-text-field
                v-model="password"
                :rules="passwordRules"
                label="Contrasenya"
                type="password"
                required
                prepend-inner-icon="mdi-lock"
                variant="outlined"
                color="#fc503b"
                class="nexus-input mb-2"
                hint="Mínim 8 caràcters"
                persistent-hint
                density="comfortable"
              ></v-text-field>


              <v-text-field
                v-model="confirmPassword"
                :rules="confirmPasswordRules"
                label="Confirmar contrasenya"
                type="password"
                required
                prepend-inner-icon="mdi-lock-check"
                variant="outlined"
                color="#fc503b"
                class="nexus-input mb-3"
                density="comfortable"
              ></v-text-field>

              <v-btn
                @click="register"
                block
                color="#fc503b"
                size="large"
                :loading="loading"
                class="nexus-register-btn mb-3"
              >
                <template v-if="registerSuccess">
                  <v-icon color="white" class="mr-2">mdi-check-circle</v-icon>
                  COMPTE CREAT!
                </template>
                <template v-else-if="registerError">
                  <v-icon color="white" class="mr-2">mdi-alert-circle</v-icon>
                  ERROR EN EL REGISTRE
                </template>
                <template v-else>
                  CREAR COMPTE
                </template>
              </v-btn>


              <div class="nexus-register-footer">
                <p class="nexus-register-text">¿Ja tens un compte?</p>
                <v-btn
                  variant="text"
                  to="/login"
                  color="#fc503b"
                  class="nexus-login-btn"
                  :ripple="false"
                  size="small"
                >
                  Inicia sessió aquí
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
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
import { postRegister } from "../services/communicationManager.js";
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const registerSuccess = ref(false);
const registerError = ref(false);
const usernameRules = [
  v => !!v || "Nom d'usuari és requerit",
  v => (v && v.length >= 3) || 'Mínim 3 caràcters'
];
const emailRules = [
  v => !!v || 'Email és requerit',
  v => /.+@.+\..+/.test(v) || 'Email ha de ser vàlid'
];
const passwordRules = [
  v => !!v || 'Contrasenya és requerida',
  v => (v && v.length >= 8) || 'Mínim 8 caràcters'
];
const confirmPasswordRules = [
  v => !!v || 'Confirma la teva contrasenya',
  v => v === password.value || 'Les contrasenyes no coincideixen'
];
const snackbar = ref({
  show: false,
  text: '',
  color: ''
});

const register = async () => {
  loading.value = true;
  
  if(!username.value || !email.value || !password.value || !confirmPassword.value) {
    registerError.value = true;
    snackbar.value = {
      show: true,
      text: 'Falta omplir els camps',
      color: 'error'
    }

    setTimeout(() => {
      registerError.value = false;
    }, 2000);

    loading.value = false;
    return;
  }

  if(password.value !== confirmPassword.value) {
    registerError.value = true;
    snackbar.value = {
      show: true,
      text: 'Es requereix 8 caràcters',
      color: 'error'
    }

    setTimeout(() => {
      registerError.value = false;
    }, 2000);

    loading.value = false;
    return;
  }

  if(password.value.length < 8) {
    registerError.value = true;
    snackbar.value = {
      show: true,
      text: 'Es requereix 8 caràcters',
      color: 'error'
    }

    setTimeout(() => {
      registerError.value = false;
    }, 2000);

    loading.value = false;
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if(!emailRegex.test(email.value)) {
    registerError.value = true;
    snackbar.value = {
      show: true,
      text: "No és vàlid l'email",
      color: 'error'
    }

    setTimeout(() => {
      registerError.value = false;
    }, 2000);

    loading.value = false;
    return;
  }

  if(password.value !== confirmPassword.value) {
    registerError.value = true;
    snackbar.value = {
      show: true,
      text: 'Les contrasenyes no coincideixen',
      color: 'error'
    }
    setTimeout(() => {
      registerError.value = false;
    }, 2000);
    loading.value = false;
    return;
  }
  
  try {
    const response = await postRegister(username, email, password);

    if (!response) {
      registerError.value = true;
      snackbar.value = {
        show: true,
        text: 'Error de xarxa o problema al servidor',
        color: 'error'
      }

      setTimeout(() => {
        registerError.value = false;
      }, 2000);
      return;
    }

    const data = await response.json();

    if (!response.ok) {
      registerError.value = true;
      snackbar.value = {
        show: true,
        text: data.error || 'Error en registrar',
        color: 'error'
      }

      setTimeout(() => {
        registerError.value = false;
      }, 2000);
      return;
    }

    registerSuccess.value = true;
    snackbar.value = {
      show: true,
      text: 'Benvingut a Darkness Unseen',
      color: 'success'
    }

    setTimeout(() => {
      router.push('/login');
    }, 1500);
  } catch {
    registerError.value = true;
    snackbar.value = {
      show: true,
      text: 'Error inesperat en registrar',
      color: 'error'
    }

    setTimeout(() => {
      registerError.value = false;
    }, 2000);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (window.particlesJS) {
    window.particlesJS('particles-js-register', {
      particles: {
        number: { value: 60, density: { enable: true, value_area: 800 } },
        color: { value: "#fc503b" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: "#fc503b", opacity: 0.3, width: 1 },
        move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out" }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "repulse" },
          onclick: { enable: true, mode: "push" }
        }
      }
    });
  }
});
</script>

<style scoped>
.nexus-register-container {
  min-height: 100vh;
  background-color: #121212;
  position: relative;
  overflow: hidden;
}

.h-100 {
  height: 100%;
}

.particles-container {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
  pointer-events: none;
}

.nexus-register-card {
  background-color: rgba(30, 30, 30, 0.9) !important;
  border-radius: 12px !important;
  border: 1px solid #333;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5) !important;
  overflow: hidden;
  position: relative;
  z-index: 1;
  backdrop-filter: blur(5px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  max-width: 420px;
  margin: 20px auto;
}

.nexus-register-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(252, 80, 59, 0.2) !important;
}

.nexus-register-header {
  display: flex;
  justify-content: center;
  padding: 20px 0 10px;
  position: relative;
}

.logo-container {
  position: relative;
  width: 80px;
  height: 80px;
}

.nexus-register-logo {
  border-radius: 50%;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 2px solid #fc503b;
  position: relative;
  z-index: 2;
}

.logo-glow {
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  background: radial-gradient(circle, rgba(252, 80, 59, 0.3) 0%, rgba(252, 80, 59, 0) 70%);
  border-radius: 50%;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.3s;
}

.logo-border {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border: 1px solid transparent;
  border-radius: 50%;
  z-index: 1;
  transition: all 0.3s;
}

.logo-container:hover .nexus-register-logo {
  transform: scale(1.08) rotate(3deg);
  box-shadow: 0 0 20px rgba(252, 80, 59, 0.6);
}

.logo-container:hover .logo-glow {
  opacity: 1;
}

.logo-container:hover .logo-border {
  border-color: rgba(252, 80, 59, 0.4);
  transform: scale(1.03);
}

.nexus-register-title {
  color: #fc503b !important;
  font-size: 1.5rem !important;
  font-weight: 700 !important;
  letter-spacing: 1px !important;
  text-transform: uppercase !important;
  text-align: center !important;
  padding: 0 20px 10px !important;
  margin-top: 5px;
  position: relative;
}

.nexus-register-title::after {
  content: '';
  display: block;
  width: 80px;
  height: 2px;
  background: linear-gradient(to right, transparent, #fc503b, transparent);
  margin: 8px auto 0;
}

.nexus-register-content {
  padding: 0 24px 24px !important;
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
  font-size: 0.9rem !important;
}

.nexus-input :deep(.v-field--focused .v-label) {
  color: #fc503b !important;
}

.nexus-input :deep(.v-field__prepend-inner) {
  padding-right: 10px !important;
}

.nexus-input :deep(.v-messages__message) {
  color: #fc503b !important;
  font-size: 0.75rem !important;
}

.nexus-input :deep(.v-messages__hint) {
  font-size: 0.75rem !important;
}

.nexus-register-btn {
  background-color: #fc503b !important;
  color: white !important;
  font-weight: bold !important;
  letter-spacing: 1px !important;
  text-transform: uppercase !important;
  padding: 10px 20px !important;
  border-radius: 4px !important;
  transition: all 0.3s !important;
  margin-top: 10px !important;
  box-shadow: 0 3px 10px rgba(252, 80, 59, 0.3) !important;
  font-size: 0.9rem !important;
}

.nexus-register-btn:hover {
  background-color: #e04635 !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 16px rgba(252, 80, 59, 0.4) !important;
}

.nexus-register-btn:active {
  transform: translateY(0) !important;
}

.nexus-register-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(252, 80, 59, 0.2);
}

.nexus-register-text {
  color: #b0b0b0;
  margin-bottom: 6px;
  font-size: 0.85rem;
}

.nexus-login-btn {
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
  transition: all 0.3s !important;
  padding: 0 6px !important;
  min-width: auto !important;
  font-size: 0.85rem !important;
}

.nexus-login-btn:hover {
  color: white !important;
  text-shadow: 0 0 6px #fc503b;
}

.nexus-register-card {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 600px) {
  .nexus-register-card {
    margin: 10px;
    max-width: 95%;
  }
 
  .nexus-register-title {
    font-size: 1.3rem !important;
  }
 
  .nexus-register-content {
    padding: 0 16px 16px !important;
  }
 
  .logo-container {
    width: 70px;
    height: 70px;
  }
 
  .nexus-register-logo {
    width: 70px;
    height: 70px;
  }
}
</style>