# Kisan Mitra — Frontend / Backend

### Structure
- `frontend/index.html` — HTML structure
- `frontend/css/style.css` — CSS
- `frontend/js/app.js` — frontend chatbot logic, translations and voice input
- `backend/server.js` — Express backend and API proxy
- `.env.example` — environment variables

### Run
1. Install Node.js.
2. Run `npm install`.
3. Create `.env` using `.env.example` and add your OpenWeather API key.
4. Run `npm start`.
5. Open `http://localhost:3000`.

The weather API key is no longer exposed in frontend JavaScript. Location reverse-geocoding, weather and market-price requests use backend `/api` routes.
