const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Importar el paquet cors
const app = express();


app.use(cors());
// Middleware per processar peticions JSON i URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Ruta GET per obtenir les preguntes des del fitxer JSON
app.get('/preguntes', (req, res) => {
  console.log("Get Funcional");
});

// Servidor escoltant al port 3000
app.listen(3000, () => {
  console.log('Servidor escoltant al port 3000');
});
