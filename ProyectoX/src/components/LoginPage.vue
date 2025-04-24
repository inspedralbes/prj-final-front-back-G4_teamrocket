<template>
  <v-container fluid fill-height class="login-container pa-0">
    <v-row no-gutters justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="login-card mx-auto" elevation="10">
          <v-card-item class="d-flex justify-center pa-4">
            <v-img
              src="@/assets/Logo del Juego de darkness Unseen.png"
              alt="Logo del Juego"
              class="logo"
              width="80"
              height="80"
            ></v-img>
          </v-card-item>
          
          <v-card-title class="text-center text-h4 my-4" style="color: #fc503b;">
            Iniciar Sesión
          </v-card-title>
          
          <v-card-text>
              <v-text-field
                v-model="email"
                label="Correo Electrónico"
                required
                prepend-icon="mdi-email"
                variant="outlined"
                color="#fc503b"
                bg-color="#333333"
                class="mb-4"
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Contraseña"
                type="password"
                required
                prepend-icon="mdi-lock"
                variant="outlined"
                color="#fc503b"
                bg-color="#333333"
                class="mb-4"
              ></v-text-field>

              <!--
              <div class="d-flex justify-space-between align-center mb-4">
                <v-checkbox
                  v-model="rememberMe"
                  label="Recordarme"
                  color="#fc503b"
                ></v-checkbox>
                <v-btn
                  variant="text"
                  color="#fc503b"
                  class="ml-2"
                  :ripple="false"
                >
                  ¿Olvidaste tu contraseña?
                </v-btn>
              </div>
              -->

              <v-btn
                @click="login"
                block
                color="#fc503b"
                size="large"
                :loading="loading"
                class="mb-4"
              >
                INICIAR SESIÓN
              </v-btn>

            <div class="text-center mt-4">
              <p>¿No tienes una cuenta? 
                <v-btn
                  variant="text"
                  to="/register"
                  color="#fc503b"
                  class="font-weight-bold pa-0"
                  :ripple="false"
                >
                  Regístrate aquí
                </v-btn>
              </p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { postLogin } from "../services/communicationManager.js";
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const email = ref('');
const password = ref('');
const rememberMe = ref(false);

const login = async () => {

  loading.value = true;
  try {
    await postLogin(email, password);
    
    // Simular una espera para demostración
    await new Promise(resolve => setTimeout(resolve, 1000));

    localStorage.setItem('userEmail', email.value);
    
    // Redireccionar al usuario a la página principal
    router.push('/');
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    // Aquí podrías manejar errores, como mostrar un mensaje al usuario
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  background-color: #121212;
  min-height: 100vh;
}

.login-card {
  background-color: #1e1e1e;
  color: white;
}

.logo {
  border-radius: 50%;
  transition: transform 0.3s, box-shadow 0.3s;
}

.logo:hover {
  transform: scale(1.1);
  box-shadow: 0 0 10px #fc503b;
}
</style>