# 🌾 Kisan Mitra – AI Crop Advisory Chatbot

**Kisan Mitra** is an AI-powered crop advisory chatbot designed to help farmers get quick and useful information related to agriculture. The platform provides assistance with crop selection, weather conditions, soil health, fertilizers, pest control, and market prices through an easy-to-use multilingual interface.

The project was developed with a focus on making agricultural information more accessible to farmers through conversational interaction and location-based services.

---

## 🚀 Features

* 🤖 **AI-Based Crop Advisory Chatbot**

  * Provides agriculture-related guidance through a conversational interface.
  * Helps farmers with crop, soil, fertilizer, and pest-related queries.

* 🌦️ **Weather Information**

  * Fetches real-time weather information based on the user's location.
  * Provides temperature, humidity, wind speed, and weather conditions.
  * Generates weather-based precautions for farming.

* 📍 **Location Detection**

  * Detects the user's geographical location.
  * Uses reverse geocoding to identify the corresponding location.

* 🌱 **Soil Health Assistance**

  * Provides guidance based on different soil types.
  * Helps farmers understand suitable crops and agricultural practices.

* 🐛 **Pest Control Guidance**

  * Provides information and recommendations for common agricultural pest problems.

* 💰 **Market Prices**

  * Displays crop market price information.
  * Includes crops such as Wheat, Rice, Cotton, Potato, Onion, and Soybean.

* 🌐 **Multilingual Support**

  * English
  * Hindi
  * Gujarati
  * Tamil
  * Telugu
  * Bengali

* 🎤 **Voice Input**

  * Allows users to interact with the chatbot using voice input.

* 📱 **Responsive Interface**

  * Designed to work across desktop and mobile screen sizes.

---

## 🛠️ Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript
* Font Awesome
* Google Fonts – Poppins

### Backend

* Node.js
* Express.js

### APIs

* OpenWeather API – Weather information
* OpenStreetMap Nominatim – Reverse geocoding

### Other

* REST API
* Geolocation API
* Browser Speech Recognition API

---

## 📂 Project Structure

```text
KisanMitra/
│
├── frontend/
│   ├── index.html
│   │
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       └── app.js
│
├── backend/
│   └── server.js
│
├── .env.example
├── package.json
├── README.md
└── Hack1_original.html
```

---

## 🔄 How It Works

```text
User
  ↓
Kisan Mitra Chatbot
  ↓
User Query
  ↓
Frontend JavaScript
  ↓
Backend API
  ↓
External APIs / Advisory Logic
  ↓
Response
  ↓
Farmer
```

The frontend handles the user interface and chatbot interaction, while the Node.js/Express backend manages API requests and keeps the weather API key securely outside the frontend code.

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-github-repository-url>
```

### 2. Open the Project

```bash
cd KisanMitra
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```env
OPENWEATHER_API_KEY=your_openweathermap_api_key_here
PORT=3000
```

Replace the API key with your own OpenWeather API key.

> **Important:** Never upload your `.env` file or API keys to GitHub.

### 5. Start the Server

```bash
npm start
```

### 6. Open in Browser

```text
http://localhost:3000
```

---

## 🔐 API Security

The OpenWeather API key is **not stored in the frontend JavaScript**.

Instead, the frontend communicates with the Express backend:

```text
Frontend
   ↓
/api/weather
   ↓
Express Backend
   ↓
OpenWeather API
```

This prevents the API key from being directly exposed in the browser-side source code.

---

## 🔗 Backend API Endpoints

| Method | Endpoint                | Purpose                     |
| ------ | ----------------------- | --------------------------- |
| GET    | `/api/weather`          | Fetch weather information   |
| GET    | `/api/location/reverse` | Reverse geocode coordinates |
| GET    | `/api/market-prices`    | Get crop market prices      |

### Weather Example

```text
/api/weather?lat=23.0225&lon=72.5714
```

### Reverse Geocoding Example

```text
/api/location/reverse?lat=23.0225&lon=72.5714
```

---

## 🌾 Supported Crops

The current market-price module includes:

* Wheat
* Rice
* Cotton
* Potato
* Onion
* Soybean

---

## 🌐 Supported Languages

Kisan Mitra currently supports:

| Language | Code |
| -------- | ---- |
| English  | `en` |
| Hindi    | `hi` |
| Gujarati | `gu` |
| Tamil    | `ta` |
| Telugu   | `te` |
| Bengali  | `bn` |

---

## 🎯 Project Objectives

The main objectives of Kisan Mitra are:

1. To make agricultural information easily accessible to farmers.
2. To provide agricultural assistance through a conversational chatbot.
3. To provide location-based weather information.
4. To assist farmers with soil, fertilizer, and pest-related queries.
5. To provide agricultural market-price information.
6. To support multiple regional languages.
7. To create a simple and accessible digital farming assistant.

---

## 🔮 Future Improvements

* Integration with a trained agricultural AI/ML model.
* Real-time government mandi/market price integration.
* Crop disease detection using image recognition.
* Personalized crop recommendations based on soil and weather data.
* Fertilizer recommendations based on soil-test results.
* Voice responses in regional languages.
* Farmer-specific dashboards and history.
* Integration with agricultural government schemes and services.

---

## 👨‍💻 Project

**Kisan Mitra – AI Crop Advisory Chatbot**

Developed as an agricultural technology project to provide farmers with accessible, multilingual, and location-aware digital assistance.

---

## ⭐ Contributing

Contributions are welcome!

If you would like to improve Kisan Mitra:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Commit your changes.
5. Push the branch.
6. Create a Pull Request.

---

## 📄 License

This project is created for educational and project-development purposes.
