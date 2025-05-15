<template>
  <div id="app" class="nexus-style">
    <!-- Header estilo Nexus Mods -->
    <v-app-bar v-if="!isCharacterSelected" app color="#0d0d0d" dark elevation="0" height="80" class="nexus-header">
      <div class="logo-container">
        <v-img
          src="@/assets/Logo del Juego de darkness Unseen.png"
          alt="Logo del Juego"
          class="logo nexus-logo"
          width="60"
          height="60"
          @click="scrollToTop"
        ></v-img>
      </div>
     
      <div class="nexus-nav-links">
        <v-btn
          color="#fc503b"
          class="nexus-nav-btn"
          to="/mods"
          text
          :ripple="false"
        >
          Mods
        </v-btn>
      </div>
     
      <v-spacer></v-spacer>
     
      <div class="nexus-user-section">
        <v-btn
          v-if="!userEmail"
          color="#fc503b"
          class="nexus-login-btn"
          to="/login"
          text
          :ripple="false"
        >
          Iniciar Sesión
        </v-btn>
        <v-btn
          v-if="userEmail"
          color="#fc503b"
          class="nexus-login-btn"
          @click="logout"
          text
          :ripple="false"
        >
          Cerrar Sesión
        </v-btn>
      </div>
      <v-btn
        v-if="userEmail"
        color="#fc503b"
        class="mr-2"
        to="/perfil"
        :outlined="true"
        :ripple="false"
      >
        Perfil
      </v-btn>
      <v-btn
        v-if="isAdmin"
        color="#fc503b"
        class="mr-2"
        to="/admin"
        :outlined="true"
        :ripple="false"
      >
        Administration
      </v-btn>
    </v-app-bar>


    <!-- Banner principal con efecto parallax -->
    <div class="nexus-banner">
      <div class="parallax-bg"></div>
      <div class="banner-content">
        <h1 class="banner-title">DARKNESS UNSEEN</h1>
        <p class="banner-subtitle">Sumérgete en el horror que acecha en las sombras</p>
        <v-btn
          color="#fc503b"
          x-large
          class="nexus-download-btn"
          elevation="4"
        >
          DESCARGAR AHORA
        </v-btn>
      </div>
    </div>


    <v-container fluid class="pa-0 nexus-container">
      <!-- Sección Acerca del Juego -->
      <v-row no-gutters>
        <v-col cols="12">
          <section id="about" class="section about nexus-section">
            <div class="section-header">
              <h2 class="section-title">ACERCA DEL JUEGO</h2>
              <div class="title-decoration"></div>
            </div>
            <p class="about-description nexus-text">
              En "Darkness Unseen", te enfrentarás a un mundo lleno de misterios, desafíos y peligros ocultos en cada esquina.
              Este juego ofrece una experiencia inmersiva llena de aventuras y emociones.
              ¡Prepárate para vivir la mejor experiencia en tu PC!
            </p>
            <div class="nexus-divider"></div>
          </section>
        </v-col>
      </v-row>


      <!-- Sección Características -->
      <v-row no-gutters>
        <v-col cols="12">
          <section id="features" class="section features nexus-section">
            <div class="section-header">
              <h2 class="section-title">PERSONAJES</h2>
            </div>
           
            <div v-if="isCharacterSelected" class="character-navigation">
              <v-btn
                icon
                color="#fc503b"
                class="nav-arrow prev-arrow"
                :disabled="characters.indexOf(selectedCharacter) === 0"
                @click="selectPreviousCharacter"
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn
                icon
                color="#fc503b"
                class="nav-arrow next-arrow"
                :disabled="characters.indexOf(selectedCharacter) === characters.length - 1"
                @click="selectNextCharacter"
              >
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </div>
           
            <v-row v-if="!isCharacterSelected" class="mt-4 nexus-grid">
              <v-col
                v-for="character in characters"
                :key="character.name"
                cols="12"
                sm="6"
                md="3"
              >
                <v-hover v-slot="{ hover }">
                  <v-card
                    class="character-card nexus-card"
                    :elevation="hover ? 12 : 4"
                    :class="{ 'on-hover': hover }"
                    @click="selectCharacter(character)"
                  >
                    <div class="card-image-container">
                      <v-img
                        :src="character.image"
                        :alt="character.name"
                        class="character-image"
                        height="180"
                        cover
                      ></v-img>
                      <div class="card-overlay" :class="{ 'overlay-hover': hover }"></div>
                    </div>
                    <v-card-title class="nexus-card-title">{{ character.nickname }}</v-card-title>
                    <v-card-text class="nexus-card-text">{{ character.quote }}</v-card-text>
                    <div class="nexus-card-footer"></div>
                  </v-card>
                </v-hover>
              </v-col>
            </v-row>


            <!-- Detalle del personaje seleccionado -->
            <v-row v-if="isCharacterSelected" class="character-detail-row">
              <v-col cols="12">
                <v-card class="character-detail nexus-detail-card" style="overflow-y: hidden;">
                  <v-btn
                    icon
                    color="#fc503b"
                    class="close-btn nexus-close-btn"
                    @click="deselectCharacter"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                  <v-row>
                    <v-col cols="12" md="4" class="detail-image-col">
                      <div class="detail-image-container">
                        <v-img
                          :src="selectedCharacter.image"
                          :alt="selectedCharacter.name"
                          class="character-detail-image"
                          height="400"
                          contain
                        ></v-img>
                        <div class="detail-image-frame"></div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="8" class="detail-content-col">
                      <v-card-title class="nexus-detail-title">{{ selectedCharacter.nickname }}</v-card-title>
                      <v-card-subtitle class="nexus-detail-subtitle">"{{ selectedCharacter.quote }}"</v-card-subtitle>
                      <v-card-text class="nexus-detail-content">
                        <v-list-item class="nexus-detail-item">
                          <v-list-item-title><span class="detail-label">Nombre:</span> {{ selectedCharacter.name }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item class="nexus-detail-item">
                          <v-list-item-title><span class="detail-label">País/Región:</span> {{ selectedCharacter.region }}</v-list-item-title>
                        </v-list-item>
                        <div class="nexus-detail-divider"></div>
                        <p class="nexus-detail-description">{{ selectedCharacter.description }}</p>
                      </v-card-text>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </section>
        </v-col>
      </v-row>


      <!-- Sección de Descarga -->
      <v-row no-gutters>
        <v-col cols="12">
          <section id="download" class="section download nexus-section nexus-download-section">
            <div class="section-header">
              <h2 class="section-title">DESCARGA EL JUEGO</h2>
              <div class="title-decoration"></div>
            </div>
            <p class="nexus-text">Haz clic en el botón de abajo para descargar el instalador del juego.</p>
            <v-btn
              color="#fc503b"
              x-large
              class="nexus-download-btn mt-4"
              elevation="4"
            >
              DESCARGAR PARA WINDOWS
            </v-btn>
            <div class="system-requirements">
              <h3 class="requirements-title">REQUISITOS DEL SISTEMA</h3>
              <div class="requirements-grid">
                <div class="requirements-col">
                  <h4>MÍNIMOS</h4>
                  <ul>
                    <li>SO: Windows 10 64-bit</li>
                    <li>Procesador: Intel Core i5-4460</li>
                    <li>Memoria: 8 GB RAM</li>
                    <li>Gráficos: NVIDIA GTX 760</li>
                    <li>Almacenamiento: 30 GB</li>
                  </ul>
                </div>
                <div class="requirements-col">
                  <h4>RECOMENDADOS</h4>
                  <ul>
                    <li>SO: Windows 10/11 64-bit</li>
                    <li>Procesador: Intel Core i7-8700K</li>
                    <li>Memoria: 16 GB RAM</li>
                    <li>Gráficos: NVIDIA GTX 1070</li>
                    <li>Almacenamiento: 30 GB SSD</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </v-col>
      </v-row>


      <!-- Sección de Contacto -->
      <v-row no-gutters>
        <v-col cols="12">
          <section id="contact" class="section contact nexus-section">
            <div class="section-header">
              <h2 class="section-title">CONTACTO</h2>
              <div class="title-decoration"></div>
            </div>
            <p class="nexus-text">¿Tienes preguntas o necesitas ayuda? Escríbenos a <a href="mailto:soporte@tujuego.com" class="nexus-link">soporte@tujuego.com</a>.</p>
            <div class="social-links">
              <a href="#" class="social-icon"><v-icon>mdi-twitter</v-icon></a>
              <a href="#" class="social-icon"><v-icon>mdi-facebook</v-icon></a>
              <a href="#" class="social-icon"><v-icon>mdi-discord</v-icon></a>
              <a href="#" class="social-icon"><v-icon>mdi-youtube</v-icon></a>
            </div>
          </section>
        </v-col>
      </v-row>


      <!-- Footer -->
      <v-footer
        class="nexus-footer"
        color="#0d0d0d"
        dark
      >
        <v-row justify="center" no-gutters>
          <v-col class="text-center" cols="12">
            <div class="footer-links">
              <a href="#" class="footer-link">Términos de Servicio</a>
              <a href="#" class="footer-link">Política de Privacidad</a>
              <a href="#" class="footer-link">DMCA</a>
              <a href="#" class="footer-link">FAQ</a>
            </div>
            <div class="copyright">
              &copy; {{ new Date().getFullYear() }} DARKNESS UNSEEN. Todos los derechos reservados.
            </div>
          </v-col>
        </v-row>
      </v-footer>
    </v-container>
   
    <!-- Efecto de partículas para fondo -->
    <div id="particles-js" class="particles-container"></div>
  </div>
</template>


<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter();
const characters = reactive([
  {
    image: "https://yottacdn.akamaized.net/yottapfres/common/assets/frontend/game_home/home/mafia2/img/ca2f1ca1.png",
    nickname: "Papi",
    name: "Raúl Díaz",
    region: "México",
    quote: "¿Nos tomamos unas copas?",
    description: "Papi creció en un barrio pobre de Oakvale, con amigos de todas las clases sociales. Jefe de una empresa de seguridad, siempre cuida de su equipo, tanto en operaciones como cuando es hora de celebrar."
  },
  {
    image: "https://yottacdn.akamaized.net/yottapfres/common/assets/frontend/game_home/home/mafia2/img/7cfa16e3.png",
    nickname: "Espina Escarlata",
    name: "Gabriela Valentina",
    region: "España",
    quote: "El conocimiento es poder, pero el poder corrompe... ¿y qué más da?",
    description: "Gabriela, conocida como Espina Escarlata, es una estratega astuta y peligrosa que combina inteligencia con seducción para conseguir lo que quiere."
  },
  {
    image: "https://yottacdn.akamaized.net/yottapfres/common/assets/frontend/game_home/home/mafia2/img/e7986260.png",
    nickname: "El Capitán",
    name: "Luis Salazar",
    region: "Colombia",
    quote: "Mantén la cabeza fría y los enemigos lejos de casa.",
    description: "Luis es un exmilitar con un fuerte sentido del deber y la justicia. Ahora lidera operaciones clandestinas para proteger a su comunidad."
  },
  {
    image:"https://yottacdn.akamaized.net/yottapfres/common/assets/frontend/game_home/home/mafia2/img/bc5dd673.png",
    nickname: "Belladona",
    name: "Ana Levitska",
    region: "Rusia",
    quote: "La belleza es mi arma más letal.",
    description: "Ana, conocida como Belladona, es una experta en espionaje que utiliza su encanto y habilidades para infiltrarse en los lugares más inaccesibles."
  }
]);


const selectedCharacter = ref(null);
const isCharacterSelected = ref(false);
const userEmail = ref(localStorage.getItem('userEmail'));
const isAdmin = ref(localStorage.getItem('userAdmin') == 1);

console.log(isAdmin.value);

const selectCharacter = (character) => {
  selectedCharacter.value = character;
  isCharacterSelected.value = true;
  window.scrollTo({
    top: document.getElementById('features').offsetTop - 80,
    behavior: 'smooth'
  });
};


const deselectCharacter = () => {
  selectedCharacter.value = null;
  isCharacterSelected.value = false;
};


const selectPreviousCharacter = () => {
  const currentIndex = characters.indexOf(selectedCharacter.value);
  if (currentIndex > 0) {
    selectCharacter(characters[currentIndex - 1]);
  }
};


const selectNextCharacter = () => {
  const currentIndex = characters.indexOf(selectedCharacter.value);
  if (currentIndex < characters.length - 1) {
    selectCharacter(characters[currentIndex + 1]);
  }
};


onMounted(() => {
  // Efecto de aparición de secciones
  const sections = document.querySelectorAll('.nexus-section');
  const options = {
    root: null,
    threshold: 0.1,
  };


  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, options);


  sections.forEach((section) => {
    observer.observe(section);
  });


  // Inicializar partículas.js si está disponible
  if (window.particlesJS) {
    window.particlesJS('particles-js', {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
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


const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};


const logout = () => {
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userAdmin');
  userEmail.value = null;
  isAdmin.value = null;
}
</script>


<style scoped>
/* Estilos generales */
.nexus-style {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #e0e0e0;
  background-color: #121212;
  position: relative;
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


/* Header estilo Nexus */
.nexus-header {
  background-color: rgba(13, 13, 13, 0.9) !important;
  backdrop-filter: blur(5px);
  border-bottom: 1px solid #fc503b;
  z-index: 1000;
  padding: 0 5%;
}


.nexus-logo {
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  border: 2px solid #fc503b;
}


.nexus-logo:hover {
  transform: scale(1.1);
  box-shadow: 0 0 15px #fc503b;
}


.nexus-nav-links {
  margin-left: 40px;
}


.nexus-nav-btn {
  font-weight: 600;
  letter-spacing: 0.5px;
  margin: 0 10px;
  text-transform: uppercase;
  font-size: 0.9rem;
  transition: all 0.3s;
}


.nexus-nav-btn:hover {
  color: #fff !important;
  text-shadow: 0 0 8px #fc503b;
}


.nexus-login-btn {
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-left: 15px;
  text-transform: uppercase;
  font-size: 0.9rem;
  transition: all 0.3s;
}


.nexus-login-btn:hover {
  color: #fff !important;
  text-shadow: 0 0 8px #fc503b;
}


/* Banner principal */
.nexus-banner {
  height: 70vh;
  min-height: 500px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
}


.parallax-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
              url('https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80') no-repeat center center;
  background-size: cover;
  background-attachment: fixed;
  z-index: -1;
}


.banner-content {
  max-width: 800px;
  padding: 0 20px;
  z-index: 1;
}


.banner-title {
  font-size: 4.5rem;
  font-weight: 900;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 20px;
  text-shadow: 0 0 20px rgba(252, 80, 59, 0.7);
  animation: pulse 3s infinite;
}


.banner-subtitle {
  font-size: 1.5rem;
  margin-bottom: 40px;
  letter-spacing: 1px;
}


@keyframes pulse {
  0% { text-shadow: 0 0 20px rgba(252, 80, 59, 0.7); }
  50% { text-shadow: 0 0 30px rgba(252, 80, 59, 1); }
  100% { text-shadow: 0 0 20px rgba(252, 80, 59, 0.7); }
}


.nexus-download-btn {
  background-color: #fc503b !important;
  color: white !important;
  font-weight: bold;
  letter-spacing: 1px;
  padding: 15px 30px !important;
  border-radius: 4px;
  transition: all 0.3s;
  text-transform: uppercase;
}


.nexus-download-btn:hover {
  background-color: #e04635 !important;
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3) !important;
}


/* Secciones generales */
.nexus-section {
  padding: 80px 10%;
  text-align: center;
  position: relative;
  z-index: 1;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
  background-color: rgba(18, 18, 18, 0.9);
}


.nexus-section.visible {
  opacity: 1;
  transform: translateY(0);
}


.section-header {
  margin-bottom: 60px;
  position: relative;
  z-index: 2;
}


.section-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(13, 13, 13, 0.7), transparent);
  pointer-events: none;
}


.nexus-section.visible {
  opacity: 1;
  transform: translateY(0);
}


.section-header {
  margin-bottom: 50px;
}


.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #fc503b;
  margin-bottom: 15px;
  position: relative;
  display: inline-block;
}


.title-decoration {
  height: 3px;
  width: 100px;
  background: linear-gradient(to right, transparent, #fc503b, transparent);
  margin: 0 auto;
}


.nexus-text {
  max-width: 800px;
  margin: 0 auto 30px;
  font-size: 1.1rem;
  line-height: 1.8;
  color: #e0e0e0;
}


.nexus-divider {
  height: 1px;
  width: 200px;
  background: linear-gradient(to right, transparent, #fc503b, transparent);
  margin: 40px auto;
}


/* Tarjetas de personajes */
.nexus-grid {
  padding: 0 5%;
}


.nexus-card {
  background-color: rgba(30, 30, 30, 0.9) !important;
  border-radius: 12px !important;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid #333;
  position: relative;
  height: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}


.nexus-card.on-hover {
  transform: translateY(-10px) scale(1.03) !important;
  box-shadow: 0 10px 30px rgba(252, 80, 59, 0.3) !important;
  border-color: #fc503b;
  background-color: rgba(30, 30, 30, 0.95) !important;
}


.card-image-container {
  position: relative;
  overflow: hidden;
}


.character-image {
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s;
  opacity: 1;
  transform-origin: center;
  margin-top: 20px;
}


.nexus-card.on-hover .character-image {
  transform: scale(1.15) rotate(2deg);
  opacity: 0.95;
}


.nexus-card.on-hover .character-image {
  transform: scale(1.1);
}


.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  opacity: 0.7;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}


.overlay-hover {
  opacity: 0.5;
  background: linear-gradient(to top, rgba(252, 80, 59, 0.4), transparent);
  transform: translateY(-5px);
}


.nexus-card-title {
  font-size: 1.3rem !important;
  font-weight: 600 !important;
  color: #fc503b !important;
  padding-bottom: 0 !important;
  transition: all 0.3s;
}


.nexus-card.on-hover .nexus-card-title {
  color: white !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}


.character-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 40px 0;
  padding: 0 40px;
  position: relative;
  z-index: 3;
}


.nav-arrow {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(252, 80, 59, 0.1);
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}


.nav-arrow:hover {
  transform: scale(1.1);
  background-color: rgba(252, 80, 59, 0.2);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}


.nav-arrow:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}


.prev-arrow {
  transform: rotate(180deg);
}


.next-arrow {
  transform: rotate(0deg);
}


.nexus-card-footer {
  height: 4px;
  background: #fc503b;
  width: 0;
  transition: width 0.3s;
}


.nexus-card.on-hover .nexus-card-footer {
  width: 100%;
}


/* Detalle del personaje */
.nexus-detail-card {
  background-color: rgba(26, 26, 26, 0.95) !important;
  border-radius: 16px !important;
  border: 1px solid #333;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5) !important;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}


.nexus-detail-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6) !important;
}


.nexus-detail-card:hover {
  transform: translateY(-5px);
}


.nexus-close-btn {
  position: absolute !important;
  top: 15px !important;
  right: 15px !important;
  z-index: 2;
  background-color: rgba(13, 13, 13, 0.7) !important;
}


.detail-image-col {
  display: flex;
  align-items: center;
  justify-content: center;
}


.detail-image-container {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 30px;
  background: linear-gradient(rgba(13, 13, 13, 0.2), transparent);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}


.detail-image-container:hover {
  background: linear-gradient(rgba(13, 13, 13, 0.3), transparent);
}


.detail-image-frame {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 2px solid #fc503b;
  border-radius: 4px;
  pointer-events: none;
  z-index: 1;
}


.character-detail-image {
  border-radius: 8px;
  z-index: 0;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}


.character-detail-image:hover {
  transform: scale(1.05);
}


.detail-content-col {
  padding: 40px !important;
  text-align: left;
}


.nexus-detail-title {
  font-size: 2.5rem !important;
  color: #fc503b !important;
  font-weight: 700 !important;
  padding-left: 0 !important;
  background: linear-gradient(45deg, transparent, rgba(252, 80, 59, 0.2), transparent);
  background-size: 200% 100%;
  background-position: 100%;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}


.nexus-detail-title:hover {
  background-position: 0;
  transform: translateX(5px);
  color: white !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}


.nexus-detail-title:hover {
  background-position: 0;
}


.nexus-detail-subtitle {
  font-size: 1.2rem !important;
  color: #b0b0b0 !important;
  font-style: italic !important;
  padding-left: 0 !important;
  margin-bottom: 20px !important;
}


.nexus-detail-content {
  padding: 0 !important;
}


.nexus-detail-item {
  padding: 5px 0 !important;
  margin: 0 !important;
}


.detail-label {
  color: #fc503b;
  font-weight: 600;
  margin-right: 10px;
}


.nexus-detail-divider {
  height: 1px;
  background: linear-gradient(to right, #fc503b, transparent);
  margin: 20px 0;
}


.nexus-detail-description {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #e0e0e0;
}


/* Sección de descarga */
.nexus-download-section {
  background: linear-gradient(rgba(18, 18, 18, 0.9), rgba(18, 18, 18, 0.9)),
              url('https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80') no-repeat center center;
  background-size: cover;
  background-attachment: fixed;
}


.system-requirements {
  max-width: 800px;
  margin: 40px auto 0;
  background-color: rgba(30, 30, 30, 0.8);
  border-radius: 8px;
  padding: 30px;
  border: 1px solid #333;
}


.requirements-title {
  color: #fc503b;
  margin-bottom: 20px;
  font-size: 1.5rem;
}


.requirements-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  text-align: left;
}


.requirements-col h4 {
  color: #fc503b;
  margin-bottom: 15px;
  font-size: 1.2rem;
  border-bottom: 1px solid #333;
  padding-bottom: 5px;
}


.requirements-col ul {
  list-style-type: none;
  padding-left: 0;
}


.requirements-col li {
  margin-bottom: 8px;
  position: relative;
  padding-left: 20px;
}


.requirements-col li::before {
  content: "•";
  color: #fc503b;
  position: absolute;
  left: 0;
}


/* Sección de contacto */
.social-links {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}


.social-icon {
  color: #e0e0e0;
  font-size: 1.5rem;
  transition: all 0.3s;
}


.social-icon:hover {
  color: #fc503b;
  transform: scale(1.2);
}


.nexus-link {
  color: #fc503b;
  text-decoration: none;
  transition: all 0.3s;
}


.nexus-link:hover {
  text-decoration: underline;
  text-shadow: 0 0 8px rgba(252, 80, 59, 0.5);
}


/* Footer */
.nexus-footer {
  border-top: 1px solid #fc503b;
  padding: 30px 0 !important;
  background-color: rgba(13, 13, 13, 0.9) !important;
  backdrop-filter: blur(5px);
  z-index: 100;
}


.footer-links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}


.footer-link {
  color: #b0b0b0;
  text-decoration: none;
  transition: all 0.3s;
  font-size: 0.9rem;
}


.footer-link:hover {
  color: #fc503b;
}


.copyright {
  color: #777;
  font-size: 0.9rem;
}


/* Responsive */
@media (max-width: 960px) {
  .banner-title {
    font-size: 3.5rem;
  }
 
  .requirements-grid {
    grid-template-columns: 1fr;
  }
}


@media (max-width: 600px) {
  .nexus-header {
    padding: 0 20px;
  }
 
  .nexus-nav-links {
    margin-left: 20px;
  }
 
  .banner-title {
    font-size: 2.5rem;
  }
 
  .banner-subtitle {
    font-size: 1.2rem;
  }
 
  .nexus-section {
    padding: 60px 20px;
  }
 
  .section-title {
    font-size: 2rem;
  }
}
</style>