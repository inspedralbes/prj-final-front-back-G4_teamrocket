# DARKNESS UNSEEN

## Descripció del proyecte

En aquest projecte desenvoluparem un joc d'ordinador emocionant on els jugadors han de sobreviure en un entorn hostil, recol·lectar recursos essencials i evitar ser detectats per perillosos Monstres. L'objectiu és mantenir-se amb vida el màxim de temps possible mentre s'enfronten a desafiaments estratègics. Els jugadors han d'utilitzar habilitats de sigil per evadir els monstres i assegurar-ne la supervivència. Amb un entorn dinàmic i múltiples nivells de dificultat, el joc promet una experiència immersiva i desafiant.

## Tecnologíes Utilitzades
### Frontend: 
- **Vue.js**: Framework principal per la interfície d'usuari
- **Three.js**: Biblioteca per gràfics 3D en temps real
- **Vue Router**: Navegació entre vistes
- **Vuex**: Gestió d'estat global
- **Vue CLI**: Eina de desenvolupament
### Unity:
- **UiToolkit**: Framework per interfícies d'usuari
- **C#**: Llenguatge de programació
### Backend:
- **Node.js**: Entorn d'execució JavaScript
- **Socket.io**: Comunicació a temps real
- **MongoDB**: Base de dades
- **Mongoose**: ORM per MongoDB
- **spawn**: Per eliminar fitxers automàticament
- **bcrypt**: Encriptació de contrasenyes
### Gestió de Tasques:
- **Taiga.io**: https://tree.taiga.io/project/a23hashusraf-tr3_g4-teamroket/backlog
### Contenedor y despliegue:
- **GitHub**: Control de versions y colaboracións.
---
## Participants del Proyecte
| Nom | 
|--------|
| [Hasham Hussain ] 
| [Albert Robert] 
| [Marc Castro]
| [Matthew Castilla] 
| [David Muñoz] 

# Documentació


## Disseny


### Moqups:
![image](https://github.com/user-attachments/assets/7865e64e-adf9-4220-85e2-b7fbe7a8c9ef)

---

### WifreFrames:

![image](https://github.com/user-attachments/assets/940e9d85-dab6-4d0f-a3ff-9036bde6f38a)

---

# 🐳 Desplegament amb Docker
Aquest apartat descriu com desplegar el servei de backend Node.js utilitzant Docker. Aquesta configuració permet crear un entorn de desenvolupament i desplegament coherent i fàcil de reproduir.

## 📦 Arquitectura de Contenidors
El projecte utilitza una arquitectura contenidoritzada pel backend. El frontend es desplega per mitjans tradicionals, mentre que el backend està encapsulat dins d’un contenidor Docker.

Arquitectura del Docker:
![image](https://github.com/user-attachments/assets/c7881c03-13e3-4b8e-82d8-57b14fad7903)

## ⚙️ Configuració Docker del Backend
🧱 Imatge Base i Execució
Base: node:18-alpine

Directori de treball: /app

Port exposat: 3002

Comanda per defecte: npm run dev (amb nodemon)
![image](https://github.com/user-attachments/assets/4b537fe4-67ac-41be-8ec0-b81edcd1dd49)

## 🚀 Instruccions de Desplegament
Assegura’t de tenir Docker instal·lat.
Si no el tens, el pots descarregar des de https://www.docker.com

Afegeix un fitxer .env a la carpeta Back/ amb les variables d'entorn necessàries, com:
```bash
MYSQL_HOST=mysql
MYSQL_DATABASE= Nom de la base de dades
MYSQL_USER= Nom de L'usuari del servidor
MYSQL_PASSWORD= La teva contrasenya secreta

MONGODB_URI= mongodb://USUARI:CONTRASENYA@HOST:PORT/NOM_BASE_DATOS
```

Executa els serveis:
```bash
docker compose -f docker-compose-dev.yml up --build -d
```

Aquesta comanda:
Construeix la imatge del backend
Inicia MongoDB, MySQL, Adminer i Portainer
Exposa els ports necessaris

## 🗂️ Volums i Persistència
Els volums Docker garanteixen que les dades no es perdin encara que els contenidors es reiniciïn
### 🧰 Desenvolupament Actiu
🔄 Canvis al codi dins Back/ s'apliquen automàticament gràcies al muntatge de volums.
🌍 El backend està preparat per rebre sol·licituds del frontend Vue.js i accedir a MongoDB/MySQL mitjançant .env.

--- 
# 🕯️ Darkness Unseen – Manual d'Ús

**Darkness Unseen** és un videojoc cooperatiu de terror en 2D on la foscor és total i només la teva llanterna t’ajuda a orientar-te. El jugador ha de col·laborar amb amics per explorar escenaris generats aleatòriament, evitar enemics amb intel·ligència artificial i recollir els objectes necessaris per escapar.

---

## 📋 Requisits previs

Per jugar a **Darkness Unseen**, necessites:

- Un ordinador amb Windows
- Una connexió a Internet estable
- Un compte de **Steam** actiu
- Steam instal·lat i executant-se

---

## 👤 Connexió i Accés

1. Obre Steam i accedeix al teu compte.
2. Llença **Darkness Unseen** des de la teva biblioteca.
3. El joc autentica automàticament el teu compte a través de Steam.

---

## 👥 Multijugador: Invitació d’Amics i Sales

Un cop iniciat el joc:

- Pots **crear una sala privada**.
- Pots **convidar amics** des de la llista de Steam.
- També pots **unir-te a una sala** mitjançant un codi.

Els jugadors es connecten a una mateixa partida a través de Steam, de manera senzilla i ràpida.

---

## 🛏️ Lobby i Preparació

Després d’unir-se a una sala, tots els jugadors apareixen a la **lobby**:

- Zona segura abans d’iniciar la partida.
- Permet comprar i equipar objectes abans d'entrar al nivell.
- També es pot esperar que altres amics es connectin.

### 🛒 Objectes disponibles a la botiga

| Objecte     | Descripció                                     | Cost | Ús/Limitacions                      |
|-------------|------------------------------------------------|------|-------------------------------------|
| 🔦 Llanterna  | Permet veure dins la foscor                   | 100  | Dura **1 minut** per partida        |
| 🧭 Bruíxola   | Indica la direcció dels objectius principals  | 150  | Ús il·limitat durant la partida     |
| 🏏 Bat        | Permet repel·lir enemics momentàniament       | 200  | Només es pot utilitzar **3 cops**   |

---

## 🎮 Desenvolupament de la Partida

Quan el líder de la sala inicia la partida:

1. Tots els jugadors apareixen en un **escenari generat de forma procedural**.
2. L’entorn és completament fosc, excepte la zona il·luminada per la llanterna del jugador.
3. L’objectiu principal és **recollir els ítems necessaris per desbloquejar la sortida**.
4. Els jugadors hauran de coordinar-se i evitar els enemics.

### Enemics amb IA

| Tipus d’enemic      | Com actua                                                 |
|---------------------|-----------------------------------------------------------|
| 👁️ Stalker          | Et persegueix silenciosament i apareix sobtadament        |
| 👂 Sensor sonor     | Escolta sons com la teva veu o moviments ràpids           |

---

## 🎯 Objectiu: Escapar

- Un cop recollits els objectes clau, es desbloqueja la sortida del mapa.
- Els jugadors han de fugir per la sortida abans que els enemics els atrapin.
- Si sobreviuen, guanyen **diners virtuals** que poden gastar a la botiga de la lobby.

---


## Diagrama GamePlay

![diagrama](https://github.com/user-attachments/assets/b0db1aa2-cf20-4390-8472-3fbb915f31db)

---

## 🔁 Restauració d’Ítems

Quan una partida acaba i tornes a la **lobby**, els objectes com el bat i la llanterna es poden comprar de nou a la botiga i restaurar-ne les funcions:
- La llanterna torna a tenir 1 minut de durada.
- El bat torna a tenir 3 usos.
- No es pot conservar res entre partides.

---

## 🛠️ Compatibilitat amb Mods

**Darkness Unseen** suporta **mods comunitaris**:

- Els jugadors poden crear nous enemics, escenaris o ítems.
- Els mods es poden descarregar.
- Si estàs interessat en instal·lar mods visita la nostra pàgina web: https://darknessunseen.dam.inspedralbes.cat/

