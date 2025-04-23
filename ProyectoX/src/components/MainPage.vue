<template>
  <div id="app">
    <v-app-bar v-if="!isCharacterSelected" app color="#1c1c1c" dark elevation="4">
      <div class="logo-container">
        <v-img
          src="@/assets/Logo del Juego de darkness Unseen.png"
          alt="Logo del Juego"
          class="logo"
          width="50"
          height="50"
          @click="scrollToTop"
        ></v-img>
      </div>
      <v-spacer></v-spacer>
      <v-btn
        color="#fc503b"
        class="mr-2"
        to="/login"
        :outlined="true"
        :ripple="false"
      >
        Iniciar Sesión
      </v-btn>
    </v-app-bar>

    <v-container fluid class="pa-0">
      <v-row no-gutters>
        <v-col cols="12">
          <section id="about" class="section about">
            <h2 class="about-title">Acerca del Juego</h2>
            <p class="about-description">
              En "Darkness Unseen", te enfrentarás a un mundo lleno de misterios, desafíos y peligros ocultos en cada esquina. 
              Este juego ofrece una experiencia inmersiva llena de aventuras y emociones. 
              ¡Prepárate para vivir la mejor experiencia en tu PC!
            </p>
          </section>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12">
          <section id="features" class="section features">
            <h2>Características</h2>
            <v-row v-if="!isCharacterSelected" class="mt-8">
              <v-col 
                v-for="character in characters"
                :key="character.name"
                cols="12"
                sm="6"
                md="3"
              >
                <v-hover v-slot="{ hover }">
                  <v-card
                    class="character-card"
                    :elevation="hover ? 8 : 2"
                    :class="{ 'on-hover': hover }"
                    @click="selectCharacter(character)"
                  >
                    <v-img
                      :src="character.image"
                      :alt="character.name"
                      class="character-image"
                      height="200"
                      cover
                    ></v-img>
                    <v-card-title>{{ character.nickname }}</v-card-title>
                    <v-card-text>{{ character.quote }}</v-card-text>
                  </v-card>
                </v-hover>
              </v-col>
            </v-row>

            <v-row v-if="isCharacterSelected">
              <v-col cols="12">
                <v-card class="character-detail">
                  <v-btn
                    icon
                    color="white"
                    class="close-btn"
                    @click="deselectCharacter"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-img
                        :src="selectedCharacter.image"
                        :alt="selectedCharacter.name"
                        class="character-detail-image"
                        height="400"
                        contain
                      ></v-img>
                    </v-col>
                    <v-col cols="12" md="8">
                      <v-card-title class="text-h4">{{ selectedCharacter.nickname }}</v-card-title>
                      <v-card-subtitle class="text-subtitle-1">{{ selectedCharacter.quote }}</v-card-subtitle>
                      <v-card-text>
                        <v-list-item>
                          <v-list-item-title><strong>Nombre:</strong> {{ selectedCharacter.name }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-title><strong>País/Región:</strong> {{ selectedCharacter.region }}</v-list-item-title>
                        </v-list-item>
                        <v-divider class="my-4"></v-divider>
                        <p>{{ selectedCharacter.description }}</p>
                      </v-card-text>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </section>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12">
          <section id="download" class="section download">
            <h2>Descargar el Juego</h2>
            <p>Haz clic en el botón de abajo para descargar el instalador del juego.</p>
            <v-btn
              color="#fc503b"
              x-large
              class="mt-4"
              elevation="4"
            >
              Descargar para Windows
            </v-btn>
          </section>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12">
          <section id="contact" class="section contact">
            <h2>Contacto</h2>
            <p>¿Tienes preguntas o necesitas ayuda? Escríbenos a <a href="mailto:soporte@tujuego.com">soporte@tujuego.com</a>.</p>
          </section>
        </v-col>
      </v-row>

      <v-footer
        class="pa-4 footer"
        color="#1c1c1c"
        dark
      >
        <v-row justify="center" no-gutters>
          <v-col class="text-center" cols="12">
            &copy; {{ new Date().getFullYear() }} Tu Juego. Todos los derechos reservados.
          </v-col>
        </v-row>
      </v-footer>
    </v-container>
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

const selectCharacter = (character) => {
  selectedCharacter.value = character;
  isCharacterSelected.value = true;
};

const deselectCharacter = () => {
  selectedCharacter.value = null;
  isCharacterSelected.value = false;
};

onMounted(() => {
  const sections = document.querySelectorAll('.section');
  const options = {
    root: null,
    threshold: 0.2,
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
});

const scrollToTop = () => {
  const aboutSection = document.getElementById('about');
  aboutSection.scrollIntoView({ behavior: 'smooth' });
};
</script>

<style scoped>
.section {
  padding: 64px 16px;
  text-align: center;
  background-color: #1e1e1e;
  opacity: 0;
  transition: opacity 1s ease-in-out;
  min-height: 100vh;
}

.section.visible {
  opacity: 1;
}

.about {
  background-color: #333333;
  padding-top: 120px;
}

.about-title {
  font-size: 2.5rem;
  color: #fc503b;
  margin-bottom: 20px;
}

.about-description {
  max-width: 700px;
  margin: 0 auto;
  font-size: 1.2rem;
  line-height: 1.8;
  color: #fff;
}

.logo {
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.logo:hover {
  transform: scale(1.1);
  box-shadow: 0 0 10px #fc503b;
}

.character-card {
  background-color: #333333;
  transition: transform 0.3s;
  height: 100%;
}

.character-card.on-hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px 4px #e04635 !important;
}

.character-detail {
  background-color: #222222;
  position: relative;
  padding: 20px;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
}

.footer {
  width: 100%;
}
</style>