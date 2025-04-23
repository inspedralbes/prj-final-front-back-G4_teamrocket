<template>
  <v-container fluid fill-height class="register-container pa-0">
    <v-row no-gutters justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="register-card mx-auto" elevation="10">
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
            Crear Cuenta
          </v-card-title>
          
          <v-card-text>
              <v-text-field
                v-model="username"
                :rules="usernameRules"
                label="Nombre de Usuario"
                required
                prepend-icon="mdi-account"
                variant="outlined"
                color="#fc503b"
                bg-color="#333333"
                class="mb-4"
              ></v-text-field>

              <v-text-field
                v-model="email"
                :rules="emailRules"
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
                :rules="passwordRules"
                label="Contraseña"
                type="password"
                required
                prepend-icon="mdi-lock"
                variant="outlined"
                color="#fc503b"
                bg-color="#333333"
                class="mb-4"
                hint="Mínimo 6 caracteres, incluye números y letras"
              ></v-text-field>

              <v-text-field
                v-model="confirmPassword"
                :rules="confirmPasswordRules"
                label="Confirmar Contraseña"
                type="password"
                required
                prepend-icon="mdi-lock-check"
                variant="outlined"
                color="#fc503b"
                bg-color="#333333"
                class="mb-4"
              ></v-text-field>

              <v-btn
                @click="register"
                block
                color="#fc503b"
                size="large"
                :loading="loading"
                class="mb-4"
              >
                CREAR CUENTA
              </v-btn>
            <div class="text-center mt-4">
              <p>¿Ya tienes una cuenta? 
                <v-btn
                  variant="text"
                  to="/login"
                  color="#fc503b"
                  class="font-weight-bold pa-0"
                  :ripple="false"
                >
                  Inicia sesión aquí
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
import { ref, computed } from 'vue';
import { postRegister } from "../services/communicationManager.js";
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const termsAccepted = ref(false);

const register = async () => {
  loading.value = true;

  console.log(email);
  
  try {
    // Aquí implementarías la lógica de registro
    // Por ejemplo:
    // await authService.register(username.value, email.value, password.value);

    await postRegister(username, email, password);
    
    // Simular una espera para demostración
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Redireccionar al usuario a la página de inicio de sesión o principal
    router.push('/');
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    // Aquí podrías manejar errores, como mostrar un mensaje al usuario
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-container {
  background-color: #121212;
  min-height: 100vh;
}

.register-card {
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