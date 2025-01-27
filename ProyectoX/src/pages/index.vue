<template>
  <div id="app">
    <header v-if="!isCharacterSelected" class="header">
      <div class="logo-container">
        <img 
          src="@/assets/Logo del Juego de darkness Unseen.png" 
          alt="Logo del Juego" 
          class="logo" 
          @click="scrollToTop" 
        />
      </div>
    </header>

    <section id="about" class="section about">
      <h2 class="about-title">Acerca del Juego</h2>
      <p class="about-description">
        En "Darkness Unseen", te enfrentarás a un mundo lleno de misterios, desafíos y peligros ocultos en cada esquina. 
        Este juego ofrece una experiencia inmersiva llena de aventuras y emociones. 
        ¡Prepárate para vivir la mejor experiencia en tu PC!
      </p>
    </section>

    <section id="features" class="section features">
      <h2>Características</h2>
      <div v-if="!isCharacterSelected" class="characters-gallery">
        <div v-for="character in characters" :key="character.name" class="character-card" @click="selectCharacter(character)">
          <img :src="character.image" :alt="character.name" class="character-image" />
          <div class="character-details">
            <h3>{{ character.nickname }}</h3>
            <p>{{ character.quote }}</p>
          </div>
        </div>
      </div>

      <div v-if="isCharacterSelected" class="character-detail">
        <button class="btn-x" @click="deselectCharacter">X</button>
        <div class="character-detail-content">
          <img :src="selectedCharacter.image" :alt="selectedCharacter.name" class="character-detail-image" />
          <div class="character-detail-info">
            <h3>{{ selectedCharacter.nickname }}</h3>
            <p>{{ selectedCharacter.quote }}</p>
            <ul>
              <li><strong>Nombre:</strong> {{ selectedCharacter.name }}</li>
              <li><strong>País/Región:</strong> {{ selectedCharacter.region }}</li>
            </ul>
            <p>{{ selectedCharacter.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="download" class="section download">
      <h2>Descargar el Juego</h2>
      <p>Haz clic en el botón de abajo para descargar el instalador del juego.</p>
      <button class="btn">Descargar para Windows</button>
    </section>

    <section id="contact" class="section contact">
      <h2>Contacto</h2>
      <p>¿Tienes preguntas o necesitas ayuda? Escríbenos a <a href="mailto:soporte@tujuego.com">soporte@tujuego.com</a>.</p>
    </section>

    <footer class="footer">
      <p>&copy; 2025 Tu Juego. Todos los derechos reservados.</p>
    </footer>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';

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
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #121212;
  color: #fff;
  overflow-x: hidden;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  background-color: #1c1c1c;
  color: #fff;
  padding: 20px;
  width: 100%;
  z-index: 1000;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.about {
  background-color: #333333;
  padding: 120px 20px 50px;
  text-align: center;
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
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.logo:hover {
  transform: scale(1.1);
  box-shadow: 0 0 10px #fc503b;
}

.section {
  padding: 50px 20px;
  text-align: center;
  background-color: #1e1e1e;
  opacity: 0;
  transition: opacity 1s ease-in-out;
  min-height: 100vh;
}

.section.visible {
  opacity: 1;
}

.characters-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 80px; /* Añadido espacio suficiente para no quedar debajo del header */
}

.character-card {
  background-color: #333;
  padding: 15px;
  border-radius: 10px;
  text-align: left;
  position: relative;
  transition: transform 0.3s, box-shadow 0.3s ease-in-out;
}

.character-card:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px 4px #e04635;
}

.character-image {
  width: 100%;
  height: auto;
  border-radius: 10px;
}

.character-detail {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #222;
  flex-direction: column;
}

.character-detail-content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: left;
}

.character-detail-image {
  width: 30%;
  border-radius: 10px;
  margin-right: 20px;
}

.character-detail-info {
  color: #fff;
  max-width: 500px;
}

.btn-x {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  background-color: transparent;
  color: #ffffff;
  font-size: 2rem;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.3s, color 0.3s;
}

.btn-x:hover {
  background-color: #fc503b;
  color: #fff;
}
</style>
