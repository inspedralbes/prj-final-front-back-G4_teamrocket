<template>
  <div id="app">
    <header class="header">
      <div class="logo-container">
        <h1>Tu Juego para Windows</h1>
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
</script>

<style scoped>
/* Fondo general para toda la página */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f0f0f0; /* Fondo claro para toda la página */
  color: #000; /* Color de texto negro para toda la página */
  overflow-x: hidden; /* Evitar el desplazamiento horizontal */
}

header {
  position: fixed;
  top: 0;
  left: 0;
  background-color: #222; /* Fondo oscuro para el encabezado */
  color: #fff; /* Texto blanco en el encabezado */
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

header h1 {
  margin: 0;
  font-size: 24px;
}

.section {
  padding: 50px 20px;
  text-align: center;
  background-color: #fff;
  color: #000;
  opacity: 0;
  transition: opacity 1s ease-in-out;
  height: 100vh; /* Asegura que cada sección ocupe toda la altura */
}

.about {
  background-color: #e3f2fd; /* Fondo azul claro para la sección 'Acerca del Juego' */
}

.features {
  background-color: #c8e6c9; /* Fondo verde claro para la sección 'Características' */
}

.download {
  background-color: #e8f5e9; /* Fondo verde suave para 'Descargar' */
}

.contact {
  background-color: #f1f8e9; /* Fondo verde muy suave para 'Contacto' */
}

footer {
  background-color: #222; /* Fondo oscuro para el pie de página */
  color: #fff; /* Texto blanco en el pie de página */
  text-align: center;
  padding: 10px 0;
  margin-top: 20px;
}

.btn {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #28a745; /* Fondo verde para el botón */
  color: white;
  text-decoration: none;
  border-radius: 5px;
}

.btn:hover {
  background-color: #218838; /* Cambio de color al pasar el ratón */
}

/* Animación de visibilidad para las secciones */
.section.visible {
  opacity: 1;
}

/* Sección 'Acerca del Juego' ocupará toda la pantalla */
.about {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.features, .download, .contact {
  height: 100vh; /* Cada sección ocupará toda la pantalla */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
