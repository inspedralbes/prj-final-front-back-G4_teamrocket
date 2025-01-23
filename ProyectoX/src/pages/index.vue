<template>
  <div id="app">
    <header class="header">
      <div class="logo-container">
        <!-- Logo como botón de volver al inicio -->
        <img 
          src="@/assets/Logo del Juego de darkness Unseen.png" 
          alt="Logo del Juego" 
          class="logo" 
          @click="scrollToTop" 
        />
      </div>
    </header>

    <section id="about" class="section about">
      <h2>Acerca del Juego</h2>
      <p>Este juego ofrece una experiencia inmersiva llena de aventuras y desafíos. ¡Prepárate para vivir la mejor experiencia en tu PC!</p>
    </section>

    <section id="features" class="section features">
      <h2>Características</h2>
      <ul>
        <li>Gráficos impresionantes</li>
        <li>Modo multijugador</li>
        <li>Compatible con mandos</li>
        <li>Actualizaciones frecuentes</li>
      </ul>
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
import { onMounted } from 'vue';

// Función para animar las secciones al hacer scroll
onMounted(() => {
  const sections = document.querySelectorAll('.section');
  const options = {
    root: null,
    threshold: 0.2,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, options);

  sections.forEach(section => {
    observer.observe(section);
  });
});

// Función para volver al inicio
const scrollToTop = () => {
  const aboutSection = document.getElementById('about');
  aboutSection.scrollIntoView({ behavior: 'smooth' });
};
</script>

<style scoped>
/* Fondo general para toda la página */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #121212; /* Fondo oscuro */
  color: #fff; /* Texto blanco */
  overflow-x: hidden;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  background-color: #1c1c1c; /* Fondo oscuro del header */
  color: #fff; /* Texto blanco */
  padding: 20px;
  width: 100%;
  z-index: 1000;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 20px;
}

.logo {
  width: 50px; /* Tamaño reducido del logo */
  height: 50px; /* Tamaño reducido del logo */
  border-radius: 50%; /* Hace el logo redondo */
  background-color: #2c2533; /* Fondo del logo */
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

/* Efecto de hover para el logo */
.logo:hover {
  transform: scale(1.1); /* Aumenta ligeramente el tamaño */
  box-shadow: 0 0 10px #fc503b; /* Sombra naranja */
}

.section {
  padding: 50px 20px;
  text-align: center;
  background-color: #1e1e1e; /* Fondo oscuro para las secciones */
  color: #fff; /* Texto blanco */
  opacity: 0;
  transition: opacity 1s ease-in-out;
  height: 100vh;
}

.about {
  background-color: #333333; /* Fondo más oscuro para la sección de "Acerca del Juego" */
}

.features {
  background-color: #444444; /* Fondo oscuro para características */
}

.download {
  background-color: #555555; /* Fondo oscuro para descarga */
}

.contact {
  background-color: #666666; /* Fondo oscuro para contacto */
}

footer {
  background-color: #1c1c1c; /* Fondo oscuro del footer */
  color: #fff; /* Texto blanco */
  text-align: center;
  padding: 10px 0;
  margin-top: 20px;
}

.btn {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #fc503b; /* Color naranja para el botón */
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #fc503b; /* Naranja más oscuro al hacer hover */
}

.section.visible {
  opacity: 1;
}

.about {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.features, .download, .contact {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
