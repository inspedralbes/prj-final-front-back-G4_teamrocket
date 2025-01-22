<template>
  <div id="app">
    <header class="header">
      <div class="logo-container">
        <h1>Tu Juego para Windows</h1>
      </div>
      <nav>
        <a href="#about">Acerca del Juego</a>
        <a href="#download">Descargar</a>
        <a href="#features">Características</a>
        <a href="#contact">Contacto</a>
      </nav>
    </header>

    <section id="about" class="section about">
      <h2>Acerca del Juego</h2>
      <p>Este juego ofrece una experiencia inmersiva llena de aventuras y desafíos. ¡Prepárate para vivir la mejor experiencia en tu PC!</p>
    </section>

    <section id="download" class="section download">
      <h2>Descargar el Juego</h2>
      <p>Haz clic en el botón de abajo para descargar el instalador del juego.</p>
      <a href="/ruta-al-instalador/juego-setup.exe" class="btn">Descargar para Windows</a>
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
// Aquí podrías agregar cualquier funcionalidad específica de Vue
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  color: #222;
}

.header {
  background-color: #444;
  color: #f8f9fa;
  padding: 20px;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.logo {
  width: 50px;
  height: 50px;
}

.header nav a {
  color: #f8f9fa;
  margin: 0 15px;
  text-decoration: none;
}

.header nav a:hover {
  text-decoration: underline;
}

.section {
  padding: 50px 20px;
  text-align: center;
}

.about {
  background-color: #f9f9f9;
}

.download {
  background-color: #dfe4ea;
}

.features {
  background-color: #f9f9f9;
}

.contact {
  background-color: #dfe4ea;
}

.btn {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  text-decoration: none;
  border-radius: 5px;
}

.btn:hover {
  background-color: #218838;
}

.footer {
  background-color: #444;
  color: #f8f9fa;
  text-align: center;
  padding: 10px 0;
  margin-top: 20px;
}
</style>
