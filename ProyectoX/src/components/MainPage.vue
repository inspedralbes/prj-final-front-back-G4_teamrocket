<template>
  <div id="app" class="nexus-style">
    <v-app-bar app color="#0d0d0d" dark elevation="0" height="60" class="nexus-header">
      <div class="logo-container">
        <v-img
          src="@/assets/Logo del Juego de darkness Unseen.png"
          alt="Logo del Joc"
          class="logo nexus-logo"
          width="50"
          height="50"
          @click="scrollToTop"
        ></v-img>
      </div>
     
      <v-spacer></v-spacer>
     
      <div class="nexus-user-section">
        <v-btn
          color="#fc503b"
          class="nexus-login-btn"
          to="/mods"
          text
          :ripple="false"
          variant="text"
        >
          <v-icon left size="20">mdi-puzzle</v-icon>
          <span class="btn-text">Mods</span>
        </v-btn>
        <v-btn
          v-if="userEmail"
          color="#fc503b"
          class="nexus-login-btn"
          to="/perfil"
          text
          :ripple="false"
          variant="text"
        >
          <v-icon left size="20">mdi-account</v-icon>
          <span class="btn-text">Perfil</span>
        </v-btn>
        <v-btn
          v-if="!userEmail"
          color="#fc503b"
          class="nexus-login-btn"
          to="/login"
          text
          :ripple="false"
          variant="text"
        >
          <span class="btn-text">Iniciar Sessió</span>
        </v-btn>
        <v-btn
          v-if="userEmail"
          color="#fc503b"
          class="nexus-login-btn"
          @click="logout"
          text
          :ripple="false"
          variant="text"
        >
          <span class="btn-text">Tancar Sessió</span>
        </v-btn>
        <v-btn
          v-if="isAdmin"
          color="#fc503b"
          class="nexus-login-btn"
          to="/admin"
          text
          :ripple="false"
          variant="text"
        >
          <v-icon left size="20">mdi-shield-account</v-icon>
          <span class="btn-text">Admin</span>
        </v-btn>
      </div>
    </v-app-bar>

    <div class="nexus-banner">
      <div class="parallax-bg"></div>
      <div class="banner-content">
        <h1 class="banner-title">DARKNESS UNSEEN</h1>
        <p class="banner-subtitle">Submergeix-te en l'horror que s'alça en les ombres</p>
        <v-btn
          color="#fc503b"
          x-large
          class="nexus-download-btn"
          href="https://darknessunseen.dam.inspedralbes.cat/resources/game"
          target="_blank" 
          rel="noopener"
          download
          elevation="4"
        >
          DESCARREGA ARA
        </v-btn>
      </div>
    </div>


    <v-container fluid class="pa-0 nexus-container">
      <v-row no-gutters>
        <v-col cols="12">
          <section id="about" class="section about nexus-section">
            <div class="section-header">
              <h2 class="section-title">SOBRE EL JOC</h2>
              <div class="title-decoration"></div>
            </div>
            <p class="about-description nexus-text">
              A "Darkness Unseen", et trobaràs en un món ple de misteris, reptes i perills amagats a cada cantonada.
              Aquest joc ofereix una experiència immersiva plena d'aventures i emocions.
              Prepara't per viure la millor experiència al teu PC!
            </p>
            <div class="nexus-divider"></div>
          </section>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12">
          <section id="download" class="section download nexus-section nexus-download-section">
            <div class="section-header">
              <h2 class="section-title">DESCARREGA EL JOC</h2>
              <div class="title-decoration"></div>
            </div>
            <p class="nexus-text">Fes clic al botó de sota per descarregar l'instal·lador del joc.</p>
            <v-btn
              color="#fc503b"
              x-large
              class="nexus-download-btn mt-4"
              href="https://darknessunseen.dam.inspedralbes.cat/resources/game"
              elevation="4"
            >
              DESCARREGA PER A WINDOWS
            </v-btn>
            <div class="system-requirements">
              <h3 class="requirements-title">REQUISITS DEL SISTEMA</h3>
              <div class="requirements-grid">
                <div class="requirements-col">
                  <h4>MÍNIMS</h4>
                  <ul>
                    <li>SO: Windows 10 64-bit</li>
                    <li>Processador: Intel Core i5-4460</li>
                    <li>Memòria: 8 GB RAM</li>
                    <li>Gràfics: NVIDIA GTX 760</li>
                    <li>Emmagatzematge: 30 GB</li>
                  </ul>
                </div>
                <div class="requirements-col">
                  <h4>RECOMANATS</h4>
                  <ul>
                    <li>SO: Windows 10/11 64-bit</li>
                    <li>Processador: Intel Core i7-8700K</li>
                    <li>Memòria: 16 GB RAM</li>
                    <li>Gràfics: NVIDIA GTX 1070</li>
                    <li>Emmagatzematge: 30 GB SSD</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12">
          <section id="contact" class="section contact nexus-section">
            <div class="section-header">
              <h2 class="section-title">CONTACTE</h2>
              <div class="title-decoration"></div>
            </div>
            <p class="nexus-text">Tens preguntes o necessites ajuda? Escriu-nos a <a href="mailto:soporte@tujuego.com" class="nexus-link">soporte@tujoc.com</a>.</p>
            <div class="social-links">
              <a href="#" class="social-icon"><v-icon>mdi-twitter</v-icon></a>
              <a href="#" class="social-icon"><v-icon>mdi-facebook</v-icon></a>
              <a href="#" class="social-icon"><v-icon>mdi-youtube</v-icon></a>
            </div>
          </section>
        </v-col>
      </v-row>

      <v-footer
        class="nexus-footer"
        color="#0d0d0d"
        dark
      >
        <v-row justify="center" no-gutters>
          <v-col class="text-center" cols="12">
            <div class="footer-links">
              <a href="#" class="footer-link">Termes de Servei</a>
              <a href="#" class="footer-link">Política de Privacitat</a>
              <a href="#" class="footer-link">DMCA</a>
              <a href="#" class="footer-link">FAQ</a>
            </div>
            <div class="copyright">
              &copy; {{ new Date().getFullYear() }} DARKNESS UNSEEN. Tots els drets reservats.
            </div>
          </v-col>
        </v-row>
      </v-footer>
    </v-container>
    <div id="particles-js" class="particles-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const userEmail = ref(localStorage.getItem('userEmail'));
const isAdmin = ref(localStorage.getItem('userAdmin') == 1);

onMounted(() => {
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

.nexus-header {
  background-color: rgba(13, 13, 13, 0.9) !important;
  backdrop-filter: blur(5px);
  border-bottom: 1px solid #fc503b;
  z-index: 1000;
  padding: 0 5%;
  display: flex;
  align-items: center;
}

.logo-container {
  margin-right: 20px;
  cursor: pointer;
  flex-shrink: 0;
}

.nexus-logo {
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  border: 2px solid #fc503b;
}

.nexus-logo:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px #fc503b;
}

.nexus-user-section {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  padding-right: 0;
}

.nexus-login-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: normal;
  font-size: 0.8125rem !important;
  height: 36px;
  min-width: auto !important;
  padding: 0 10px !important;
  margin: 0 !important;
}

.nexus-login-btn .v-btn__content {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0;
}

.btn-text {
  font-size: 0.8125rem;
  letter-spacing: 0.5px;
}

.nexus-login-btn .v-icon {
  font-size: 20px;
  margin-right: 4px;
}

.nexus-nav-links {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 20px;
}

.nexus-nav-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: normal;
  font-size: 0.8rem;
  padding: 0 12px;
  height: 36px;
}

.nexus-login-btn .v-btn__content,
.nexus-nav-btn .v-btn__content {
  display: flex;
  align-items: center;
  gap: 6px;
}

.nexus-nav-btn {
  position: relative;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin: 0 10px;
  text-transform: uppercase;
  font-size: 0.9rem;
  transition: all 0.3s;
  overflow: hidden;
  padding: 10px 20px;
}

.nexus-nav-btn::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: #fc503b;
  transition: all 0.3s;
  transform: translateX(-50%);
}

.nexus-nav-btn:hover::after {
  width: 80%;
}

.nexus-nav-btn:hover {
  color: #fff !important;
  text-shadow: 0 0 8px #fc503b;
  transform: translateY(-2px);
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
  animation: text-glow 3s infinite;
  position: relative;
  display: inline-block;
}

@keyframes text-glow {
  0% { text-shadow: 0 0 20px rgba(252, 80, 59, 0.7); }
  50% { text-shadow: 0 0 30px rgba(252, 80, 59, 1), 0 0 40px rgba(252, 80, 59, 0.5); }
  100% { text-shadow: 0 0 20px rgba(252, 80, 59, 0.7); }
}

.banner-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #fc503b, transparent);
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
  padding: 0 30px !important;
  height: 50px !important;
  line-height: 50px !important;
  border-radius: 4px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(252, 80, 59, 0.3);
  text-align: center !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.nexus-download-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: all 0.6s;
}

.nexus-download-btn:hover {
  background-color: #e04635 !important;
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 12px 24px rgba(252, 80, 59, 0.4) !important;
}

.nexus-download-btn:hover::after {
  left: 100%;
}

.nexus-download-btn .v-btn__content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

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
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(30, 30, 30, 0.5);
  overflow: hidden;
}

.social-icon::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(252, 80, 59, 0.5) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}

.social-icon:hover {
  color: #fff;
  transform: translateY(-5px);
}

.social-icon:hover::before {
  opacity: 1;
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