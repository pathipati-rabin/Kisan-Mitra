
let userLocation = "", userLanguage = "en";
        let userLat = null, userLon = null;
        let isAwaitingSoilType = false, isAwaitingCropName = false, isAwaitingPestInfo = false, isAwaitingSoilHealthTopic = false;
        let conversationFlow = null;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = SpeechRecognition ? new SpeechRecognition() : null;
        let isListening = false;
        
        if (recognition) {
            recognition.continuous = false;
            recognition.interimResults = false;
            
            recognition.onresult = (event) => {
                document.getElementById('userInput').value = event.results[0][0].transcript;
                recognition.stop(); 
                sendMessage();
            };
            
            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                let errorMessage = "An error occurred with voice input.";
                if (event.error === 'not-allowed') {
                    errorMessage = "Microphone access was denied. Please allow microphone access in your browser settings.";
                } else if (event.error === 'no-speech') {
                    errorMessage = "No speech was detected. Please try again.";
                }
                alert(errorMessage);
            };
            
            recognition.onend = () => {
                if (isListening) {
                    const btn = document.getElementById('voiceBtn');
                    const btnText = document.getElementById('voiceBtnText');
                    isListening = false;
                    btn.classList.remove('active');
                    btnText.textContent = (translations[userLanguage] || translations['en']).voice_btn_start;
                }
            };
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                 document.getElementById('voiceBtn').style.display = 'none';
            });
        }
        
        const translations = {
            "en": {
                "voice_btn_start": "Voice Input", "voice_btn_listening": "Listening...",
                "invalid_crop_message": "Sorry, I don't have price information for '{crop}'. Please choose from the available options or type a valid crop name.",
                "greeting": "Hello! I'm Kisan Mitra. How can I assist you with your farming needs today?",
                "personalized_welcome": "Welcome from {location}! I can advise on crop selection, pest control, fertilizers, weather, and market prices. How can I help?",
                "options_title": "Quick Advisory", "crop-selection-query": "Crop Selection", "pest-control-query": "Pest Control", "fertilizer-query": "Fertilizer Guidance", "weather-query": "Weather Advisory", "soil-health-query": "Soil Health", "market-prices-query": "Market Prices",
                "fetching_prices": "Fetching market prices for **{crop}**...",
                "price_report": "The current modal price for **{crop}** in your region is approximately **₹{price}** per Quintal.",
                "ask_crop_price": "Which crop's price would you like to check? You can select from the options below or type a name.",
                "weather_report": "<b>Weather in {location}:</b><br>Temperature: {temp}°C<br>Condition: {description}<br>Humidity: {humidity}%<br>Wind Speed: {wind} m/s",
                "weather_error": "Sorry, I couldn't get the weather for your location. Please try again later.",
                "soil-types": { "question": "To get a recommendation, please select your soil type.", "options": ["Alluvial", "Black", "Red", "Laterite", "Arid", "Forest"] },
                "common-pests": { "question": "Which pest are you dealing with?", "options": ["Aphids", "Whiteflies", "Bollworms", "Stem Borers", "Locusts", "Other"] },
                "user_selection_prefix": "You selected:",
                "crop_rec_template": "Based on your location and **{soil}** soil, {recommendation}",
                "crop_rec_alluvial": "this fertile soil is excellent for crops like **Wheat, Rice, Sugarcane, and Jute**.",
                "crop_rec_black": "its high moisture retention is ideal for **Cotton, Soybean, and Jowar**.",
                "crop_rec_red": "it is well-suited for crops like **Groundnuts, Pulses, and Millets**.",
                "crop_rec_laterite": "it is perfect for plantation crops such as **Tea, Coffee, and Spices**.",
                "crop_rec_arid": "with proper irrigation, you can grow **Bajra, Barley, and Dates**.",
                "crop_rec_forest": "it is rich in humus and great for **Fruits, Tea, and Medicinal Plants**.",
                "crop_rec_default": "I do not have a specific recommendation for that soil type. Based on your area, **Wheat** and **Maize** are generally safe choices.",
                "soil_health_menu": { "question": "What aspect of soil health are you interested in? Please select an option.", "options": ["Water Drainage", "Nutrient Levels", "Soil Hardness", "Organic Matter"] },
                "soil_advice_drainage": "Poor drainage can harm roots. To improve it, add **organic matter** like compost, practice **conservation tillage** to create better soil structure, and in severe cases, install drainage tiles.",
                "soil_advice_nutrients": "For nutrient levels, a **soil test** is the best start. Improve fertility by using **crop rotation** with legumes (like peas or beans) and regularly adding **compost or well-rotted manure**.",
                "soil_advice_hardness": "Hard soil, or **compaction**, restricts root growth. Reduce it by **minimizing heavy machinery** on wet soil and planting **deep-rooted cover crops** like daikon radish.",
                "soil_advice_organic": "Organic matter is key! It improves water retention, nutrient supply, and soil structure. Add it by using **cover crops**, applying **compost**, and leaving **crop residue** on the field.",
                "fertilizer_alluvial": "Alluvial soil is quite fertile but can lack Nitrogen. Use a balanced NPK fertilizer and supplement with **farmyard manure**.",
                "fertilizer_black": "Black soil is rich in potash but often lacks Phosphorus. Use a **phosphorus-rich fertilizer** like DAP and add plenty of **compost**.",
                "fertilizer_red": "Red soil lacks Nitrogen and Phosphorous. A fertilizer mix with a higher ratio of N and P is recommended. **Liming** can also help if the soil is too acidic.",
                "fertilizer_laterite": "Laterite soil has low fertility. It requires a complete NPK fertilizer along with micronutrients. Regular application of **organic manure** is essential.",
                "fertilizer_arid": "Arid soil lacks organic matter and Nitrogen. Use **nitrogenous fertilizers** like Urea and add large amounts of **compost** to improve water retention.",
                "fertilizer_forest": "Forest soil is typically rich in organic matter but can be acidic. It's best to get a soil test, but a balanced, slow-release fertilizer is a good start.",
                "pest_advice_template": "For **{pest}**, {solution}",
                "pest_advice_aphids": "use a **Neem oil-based spray**. Ensure you cover the underside of the leaves. Encouraging ladybugs can also help naturally.",
                "pest_advice_whiteflies": "use **yellow sticky traps** to monitor and capture them. A mild insecticidal soap solution can also be effective.",
                "pest_advice_bollworms": "pheromone traps are effective for monitoring. Applying a **Bt (Bacillus thuringiensis) based pesticide** is a good organic solution.",
                "pest_advice_stemborers": "remove and destroy infected plant parts immediately. Releasing **Trichogramma wasps** can act as a biological control.",
                "pest_advice_locusts": "this is a serious issue. For large swarms, you must **contact your local agricultural authorities immediately**. Creating loud noises can sometimes deter smaller groups.",
                "pest_advice_other": "please describe the pest and the affected crop in more detail for a specific recommendation.",
                "precaution_title": "Precaution:",
                "precaution_hot": "High temperatures can stress crops. Ensure adequate irrigation, especially for young plants.",
                "precaution_rain": "Rain is expected. Postpone spraying pesticides or fertilizers. Ensure your fields have proper drainage to avoid waterlogging.",
                "precaution_wind": "Strong winds can damage tall crops like maize or sugarcane. If possible, provide support to vulnerable plants.",
                "precaution_humidity": "High humidity increases the risk of fungal diseases. Monitor your crops closely for any signs of infection like mildew or blight.",
                "precaution_clear": "Clear skies and calm weather are ideal for field activities like spraying, fertilizing, or harvesting.",
                "precaution_default": "The weather is moderate. Continue with your regular farming schedule and keep an eye on your crops.",
                "default": "I'm sorry, I didn't understand. Please ask about crops, pests, fertilizer, weather, or prices."
            },
            "hi": {
                "voice_btn_start": "आवाज इनपुट", "voice_btn_listening": "सुन रहा है...",
                "invalid_crop_message": "क्षमा करें, मेरे पास '{crop}' के लिए मूल्य की जानकारी नहीं है। कृपया उपलब्ध विकल्पों में से चुनें या एक वैध फसल का नाम टाइप करें।",
                "greeting": "नमस्ते! मैं किसान मित्र हूँ। आज मैं आपकी खेती की ज़रूरतों में कैसे सहायता कर सकता हूँ?",
                "personalized_welcome": "{location} से आपका स्वागत है! मैं फसल चयन, कीट नियंत्रण, उर्वरक, मौसम और बाजार कीमतों पर सलाह दे सकता हूँ। मैं कैसे मदद करूँ?",
                "options_title": "त्वरित सलाह", "crop-selection-query": "फ़सल चयन", "pest-control-query": "कीट नियंत्रण", "fertilizer-query": "उर्वरक मार्गदर्शन", "weather-query": "मौसम सलाहकार", "soil-health-query": "मृदा स्वास्थ्य", "market-prices-query": "बाजार मूल्य",
                "fetching_prices": "**{crop}** के लिए बाजार मूल्य प्राप्त कर रहा हूँ...",
                "price_report": "आपके क्षेत्र में **{crop}** का मौजूदा मॉडल मूल्य लगभग **₹{price}** प्रति क्विंटल है।",
                "ask_crop_price": "आप किस फसल की कीमत जानना चाहेंगे? आप नीचे दिए गए विकल्पों में से चुन सकते हैं या एक नाम टाइप कर सकते हैं।",
                "weather_report": "<b>{location} में मौसम:</b><br>तापमान: {temp}°C<br>स्थिति: {description}<br>आर्द्रता: {humidity}%<br>हवा की गति: {wind} m/s",
                "weather_error": "क्षमा करें, मैं आपके स्थान के लिए मौसम की जानकारी प्राप्त नहीं कर सका। कृपया बाद में पुनः प्रयास करें।",
                "soil-types": { "question": "सिफारिश प्राप्त करने के लिए, कृपया अपनी मिट्टी का प्रकार चुनें।", "options": ["जलोढ़", "काली", "लाल", "लैटेराइट", "शुष्क", "वन"] },
                "common-pests": { "question": "आप किस कीट से परेशान हैं?", "options": ["माहू", "सफ़ेद मक्खी", "बॉलवर्म", "तना छेदक", "टिड्डी", "अन्य"] },
                "user_selection_prefix": "आपने चुना:",
                "crop_rec_template": "आपके स्थान और **{soil}** मिट्टी के आधार पर, {recommendation}",
                "crop_rec_alluvial": "यह उपजाऊ मिट्टी **गेहूं, चावल, गन्ना और जूट** जैसी फसलों के लिए उत्कृष्ट है।",
                "crop_rec_black": "इसकी उच्च नमी धारण क्षमता **कपास, सोयाबीन और ज्वार** के लिए आदर्श है।",
                "crop_rec_red": "यह **मूंगफली, दालों और बाजरा** जैसी फसलों के लिए उपयुक्त है।",
                "crop_rec_laterite": "यह **चाय, कॉफी और मसालों** जैसी बागान फसलों के लिए एकदम सही है।",
                "crop_rec_arid": "उचित सिंचाई से आप **बाजरा, जौ और खजूर** उगा सकते हैं।",
                "crop_rec_forest": "यह ह्यूमस से भरपूर है और **फलों, चाय और औषधीय पौधों** के लिए बहुत अच्छा है।",
                "crop_rec_default": "उस मिट्टी के प्रकार के लिए मेरे पास कोई विशिष्ट सिफारिश नहीं है। आपके क्षेत्र के आधार पर, **गेहूं** और **मक्का** आम तौर पर सुरक्षित विकल्प हैं।",
                "soil_health_menu": { "question": "आप मिट्टी के स्वास्थ्य के किस पहलू में रुचि रखते हैं? कृपया एक विकल्प चुनें।", "options": ["जल निकासी", "पोषक तत्व स्तर", "मिट्टी की कठोरता", "जैविक पदार्थ"] },
                "soil_advice_drainage": "खराब जल निकासी जड़ों को नुकसान पहुंचा सकती है। इसे सुधारने के लिए, **जैविक पदार्थ** जैसे कम्पोस्ट डालें, बेहतर मिट्टी की संरचना के लिए **संरक्षण जुताई** का अभ्यास करें।",
                "soil_advice_nutrients": "पोषक तत्वों के स्तर के लिए, **मिट्टी परीक्षण** सबसे अच्छी शुरुआत है। फलियों के साथ **फसल चक्र** का उपयोग करके और नियमित रूप से **कम्पोस्ट या सड़ी हुई खाद** डालकर उर्वरता में सुधार करें।",
                "soil_advice_hardness": "कठोर मिट्टी, या **संघनन**, जड़ों के विकास को प्रतिबंधित करती है। गीली मिट्टी पर **भारी मशीनरी को कम करके** और **गहरी जड़ वाली कवर फसलें** लगाकर इसे कम करें।",
                "soil_advice_organic": "जैविक पदार्थ महत्वपूर्ण है! यह जल प्रतिधारण, पोषक तत्वों की आपूर्ति और मिट्टी की संरचना में सुधार करता है। **कवर फसलों** का उपयोग करके, **कम्पोस्ट** डालकर, और **फसल अवशेष** को खेत में छोड़कर इसे जोड़ें।",
                "fertilizer_alluvial": "जलोढ़ मिट्टी काफी उपजाऊ होती है लेकिन इसमें नाइट्रोजन की कमी हो सकती है। संतुलित एनपीके उर्वरक का उपयोग करें और **गोबर की खाद** डालें।",
                "fertilizer_black": "काली मिट्टी में पोटाश प्रचुर मात्रा में होता है लेकिन अक्सर फास्फोरस की कमी होती है। डीएपी जैसे **फास्फोरस युक्त उर्वरक** का उपयोग करें और भरपूर **कम्पोस्ट** डालें।",
                "fertilizer_red": "लाल मिट्टी में नाइट्रोजन और फास्फोरस की कमी होती है। एन और पी के उच्च अनुपात वाले उर्वरक मिश्रण की सिफारिश की जाती है। यदि मिट्टी बहुत अम्लीय है तो **चूना डालना** भी मदद कर सकता है।",
                "fertilizer_laterite": "लैटेराइट मिट्टी की उर्वरता कम होती है। इसे सूक्ष्म पोषक तत्वों के साथ एक पूर्ण एनपीके उर्वरक की आवश्यकता होती है। **जैविक खाद** का नियमित प्रयोग आवश्यक है।",
                "fertilizer_arid": "शुष्क मिट्टी में जैविक पदार्थ और नाइट्रोजन की कमी होती है। **नाइट्रोजनयुक्त उर्वरकों** जैसे यूरिया का उपयोग करें और जल प्रतिधारण में सुधार के लिए बड़ी मात्रा में **कम्पोस्ट** डालें।",
                "fertilizer_forest": "वन मिट्टी आमतौर पर जैविक पदार्थों से भरपूर होती है लेकिन अम्लीय हो सकती है। मिट्टी का परीक्षण करवाना सबसे अच्छा है, लेकिन एक संतुलित, धीमी गति से निकलने वाला उर्वरक एक अच्छी शुरुआत है।",
                "pest_advice_template": "**{pest}** के लिए, {solution}",
                "pest_advice_aphids": "**नीम तेल आधारित स्प्रे** का प्रयोग करें। पत्तियों के निचले हिस्से को कवर करना सुनिश्चित करें। लेडीबग को प्रोत्साहित करना भी स्वाभाविक रूप से मदद कर सकता है।",
                "pest_advice_whiteflies": "उनकी निगरानी और उन्हें पकड़ने के लिए **पीले चिपचिपे जाल** का उपयोग करें। एक हल्का कीटनाशक साबुन का घोल भी प्रभावी हो सकता है।",
                "pest_advice_bollworms": "फेरोमोन ट्रैप निगरानी के लिए प्रभावी हैं। **बीटी (बैसिलस थुरिंजिनेसिस) आधारित कीटनाशक** लगाना एक अच्छा जैविक समाधान है।",
                "pest_advice_stemborers": "संक्रमित पौधों के हिस्सों को तुरंत हटा दें और नष्ट कर दें। **ट्राइकोग्रामा ततैयों** को छोड़ना जैविक नियंत्रण के रूप में कार्य कर सकता है।",
                "pest_advice_locusts": "यह एक गंभीर मुद्दा है। बड़े झुंडों के लिए, आपको **तुरंत अपने स्थानीय कृषि अधिकारियों से संपर्क करना चाहिए**। तेज आवाज करने से कभी-कभी छोटे समूह रुक सकते हैं।",
                "pest_advice_other": "कृपया एक विशिष्ट सिफारिश के लिए कीट और प्रभावित फसल का अधिक विस्तार से वर्णन करें।",
                "precaution_title": "सावधानी:",
                "precaution_hot": "अधिक तापमान फसलों पर तनाव डाल सकता है। पर्याप्त सिंचाई सुनिश्चित करें, खासकर छोटे पौधों के लिए।",
                "precaution_rain": "बारिश की उम्मीद है। कीटनाशकों या उर्वरकों का छिड़काव स्थगित करें। जलभराव से बचने के लिए खेतों में उचित जल निकासी सुनिश्चित करें।",
                "precaution_wind": "तेज हवाएं मक्का या गन्ने जैसी लंबी फसलों को नुकसान पहुंचा सकती हैं। यदि संभव हो, तो कमजोर पौधों को सहारा दें।",
                "precaution_humidity": "अधिक आर्द्रता फंगल रोगों का खतरा बढ़ाती है। फफूंदी जैसे संक्रमण के किसी भी लक्षण के लिए अपनी फसलों की बारीकी से निगरानी करें।",
                "precaution_clear": "साफ आसमान और शांत मौसम छिड़काव, खाद डालने या कटाई जैसी गतिविधियों के लिए आदर्श है।",
                "precaution_default": "मौसम सामान्य है। अपने नियमित खेती के कार्यक्रम को जारी रखें और अपनी फसलों पर नजर रखें।",
                "default": "क्षमा करें, मैं समझ नहीं पाया। कृपया फसल, कीट, उर्वरक, मौसम या कीमतों के बारे में पूछें।"
            },
            "gu": {
                "voice_btn_start": "વોઇસ ઇનપુટ", "voice_btn_listening": "સાંભળી રહ્યું છે...",
                "invalid_crop_message": "માફ કરશો, મારી પાસે '{crop}' માટે ભાવની માહિતી નથી. કૃપા કરીને ઉપલબ્ધ વિકલ્પોમાંથી પસંદ કરો અથવા માન્ય પાકનું નામ લખો.",
                "greeting": "નમસ્તે! હું કિસાન મિત્ર છું. આજે હું તમારી ખેતીની જરૂરિયાતોમાં કેવી રીતે મદદ કરી શકું?",
                "personalized_welcome": "{location} થી સ્વાગત છે! હું પાકની પસંદગી, જીવાત નિયંત્રણ, ખાતરો, હવામાન અને બજાર ભાવ અંગે સલાહ આપી શકું છું. હું કેવી રીતે મદદ કરી શકું?",
                "options_title": "ઝડપી સલાહ", "crop-selection-query": "પાકની પસંદગી", "pest-control-query": "જીવાત નિયંત્રણ", "fertilizer-query": "ખાતર માર્ગદર્શન", "weather-query": "હવામાન સલાહ", "soil-health-query": "જમીનનું સ્વાસ્થ્ય", "market-prices-query": "બજાર ભાવ",
                "fetching_prices": "**{crop}** માટે બજાર ભાવ મેળવી રહ્યો છું...",
                "price_report": "તમારા વિસ્તારમાં **{crop}** નો હાલનો મોડલ ભાવ આશરે **₹{price}** પ્રતિ ક્વિન્ટલ છે.",
                "weather_report": "<b>{location}માં હવામાન:</b><br>તાપમાન: {temp}°C<br>સ્થિતિ: {description}<br>ભેજ: {humidity}%<br>પવનની ગતિ: {wind} m/s",
                "weather_error": "માફ કરશો, હું તમારા સ્થાન માટે હવામાન મેળવી શક્યો નથી. કૃપા કરીને પછી ફરી પ્રયાસ કરો.",
                "soil-types": { "question": "ભલામણ મેળવવા માટે, કૃપા કરીને તમારી જમીનનો પ્રકાર પસંદ કરો.", "options": ["કાંપવાળી", "કાળી", "લાલ", "પડખાઉ", "રણપ્રદેશની", "જંગલની"] },
                "common-pests": { "question": "તમે કઈ જીવાતનો સામનો કરી રહ્યા છો?", "options": ["મોલો", "સફેદ માખી", "ઇયળ", "ગાભમારો", "તીડ", "અન્ય"] },
                "user_selection_prefix": "તમે પસંદ કર્યું:",
                "crop_rec_template": "તમારા સ્થાન અને **{soil}** જમીન પર આધારિત, {recommendation}",
                "crop_rec_alluvial": "આ ફળદ્રુપ જમીન **ઘઉં, ચોખા, શેરડી અને શણ** જેવા પાકો માટે ઉત્તમ છે.",
                "crop_rec_black": "તેની ઉચ્ચ ભેજ જાળવી રાખવાની ક્ષમતા **કપાસ, સોયાબીન અને જુવાર** માટે આદર્શ છે.",
                "crop_rec_red": "તે **મગફળી, કઠોળ અને બાજરી** જેવા પાકો માટે યોગ્ય છે.",
                "crop_rec_laterite": "તે **ચા, કોફી અને મસાલા** જેવા વાવેતર પાકો માટે યોગ્ય છે.",
                "crop_rec_arid": "યોગ્ય સિંચાઈથી તમે **બાજરી, જવ અને ખજૂર** ઉગાડી શકો છો.",
                "crop_rec_forest": "તે હ્યુમસથી ભરપૂર છે અને **ફળો, ચા અને ઔષધીય છોડ** માટે ઉત્તમ છે.",
                "crop_rec_default": "તે જમીનના પ્રકાર માટે મારી પાસે કોઈ ચોક્કસ ભલામણ નથી. તમારા વિસ્તારના આધારે, **ઘઉં** અને **મકાઈ** સામાન્ય રીતે સલામત પસંદગીઓ છે.",
                "soil_health_menu": { "question": "તમે જમીનના સ્વાસ્થ્યના કયા પાસામાં રસ ધરાવો છો? કૃપા કરીને એક વિકલ્પ પસંદ કરો.", "options": ["પાણીનો નિકાલ", "પોષક તત્વોનું સ્તર", "જમીનની કઠિનતા", "સેન્દ્રિય પદાર્થ"] },
                "soil_advice_drainage": "ખરાબ પાણીનો નિકાલ મૂળને નુકસાન પહોંચાડી શકે છે. તેને સુધારવા માટે, ખાતર જેવા **સેન્દ્રિય પદાર્થ** ઉમેરો, સારી જમીન બંધારણ માટે **સંરક્ષણ ખેડાણ**નો અભ્યાસ કરો.",
                "soil_advice_nutrients": "પોષક તત્વોના સ્તર માટે, **જમીન પરીક્ષણ** શ્રેષ્ઠ શરૂઆત છે. કઠોળ સાથે **પાકની ફેરબદલી**નો ઉપયોગ કરીને અને નિયમિતપણે **કમ્પોસ્ટ અથવા સારી રીતે સડેલું ખાતર** ઉમેરીને ફળદ્રુપતામાં સુધારો કરો.",
                "soil_advice_hardness": "સખત જમીન, અથવા **સંકોચન**, મૂળના વિકાસને પ્રતિબંધિત કરે છે. ભીની જમીન પર **ભારે મશીનરી ઓછી કરીને** અને **ઊંડા મૂળવાળા આવરણ પાકો** વાવીને તેને ઓછું કરો.",
                "soil_advice_organic": "સેન્દ્રિય પદાર્થ ચાવીરૂપ છે! તે પાણીની જાળવણી, પોષક તત્વોનો પુરવઠો અને જમીનની રચનામાં સુધારો કરે છે. **આવરણ પાકો**નો ઉપયોગ કરીને, **કમ્પોસ્ટ** લગાવીને અને **પાકના અવશેષો** ખેતરમાં છોડીને તેને ઉમેરો.",
                "fertilizer_alluvial": "કાંપવાળી જમીન ખૂબ ફળદ્રુપ હોય છે પરંતુ તેમાં નાઇટ્રોજનની ઉણપ હોઈ શકે છે. સંતુલિત NPK ખાતરનો ઉપયોગ કરો અને **છાણિયું ખાતર** ઉમેરો.",
                "fertilizer_black": "કાળી જમીનમાં પોટાશ ભરપૂર હોય છે પરંતુ ફોસ્ફરસની ઉણપ હોય છે. DAP જેવા **ફોસ્ફરસયુક્ત ખાતર** નો ઉપયોગ કરો અને પુષ્કળ **કમ્પોસ્ટ** ઉમેરો.",
                "fertilizer_red": "લાલ જમીનમાં નાઇટ્રોજન અને ફોસ્ફરસની ઉણપ હોય છે. N અને P ના ઉચ્ચ ગુણોત્તરવાળા ખાતર મિશ્રણની ભલામણ કરવામાં આવે છે. જો જમીન ખૂબ એસિડિક હોય તો **લાઇમિંગ** પણ મદદ કરી શકે છે.",
                "fertilizer_laterite": "પડખાઉ જમીનની ફળદ્રુપતા ઓછી હોય છે. તેને સૂક્ષ્મ પોષકતત્ત્વોની સાથે સંપૂર્ણ NPK ખાતરની જરૂર પડે છે. **સેન્દ્રિય ખાતર** નો નિયમિત ઉપયોગ જરૂરી છે.",
                "fertilizer_arid": "રણપ્રદેશની જમીનમાં સેન્દ્રિય પદાર્થો અને નાઇટ્રોજનની ઉણપ હોય છે. યુરિયા જેવા **નાઇટ્રોજનયુક્ત ખાતરો** નો ઉપયોગ કરો અને પાણીની જાળવણી સુધારવા માટે મોટા પ્રમાણમાં **કમ્પોસ્ટ** ઉમેરો.",
                "fertilizer_forest": "જંગલની જમીન સામાન્ય રીતે સેન્દ્રિય પદાર્થોથી સમૃદ્ધ હોય છે પરંતુ એસિડિક હોઈ શકે છે. જમીનનું પરીક્ષણ કરાવવું શ્રેષ્ઠ છે, પરંતુ સંતુલિત, ધીમે-ધીમે છૂટતું ખાતર એક સારી શરૂઆત છે.",
                "pest_advice_template": "**{pest}** માટે, {solution}",
                "pest_advice_aphids": "**લીમડાના તેલ આધારિત સ્પ્રે**નો ઉપયોગ કરો. પાંદડાની નીચેની બાજુને આવરી લેવાની ખાતરી કરો. લેડીબગ્સને પ્રોત્સાહન આપવું પણ કુદરતી રીતે મદદ કરી શકે છે.",
                "pest_advice_whiteflies": "તેમની દેખરેખ અને પકડવા માટે **પીળા ચીકણા ટ્રેપ્સ**નો ઉપયોગ કરો. હળવો જંતુનાશક સાબુનો દ્રાવણ પણ અસરકારક બની શકે છે.",
                "pest_advice_bollworms": "ફેરોમોન ટ્રેપ્સ દેખરેખ માટે અસરકારક છે. **બીટી (બેસિલસ થુરિન્જિએન્સિસ) આધારિત જંતુનાશક**નો ઉપયોગ કરવો એ એક સારો ઓર્ગેનિક ઉપાય છે.",
                "pest_advice_stemborers": "સંક્રમિત છોડના ભાગોને તરત જ દૂર કરો અને નાશ કરો. **ટ્રાઇકોગ్రాમા ભમરી**ને છોડવું એ જૈવિક નિયંત્રણ તરીકે કામ કરી શકે છે.",
                "pest_advice_locusts": "આ એક ગંભીર સમસ્યા છે. મોટા ટોળા માટે, તમારે **તમારા સ્થાનિક કૃષિ અધિકારીઓનો તાત્કાલિક સંપર્ક કરવો** જ જોઇએ. જોરથી અવાજ કરવાથી ક્યારેક નાના જૂથોને રોકી શકાય છે.",
                "pest_advice_other": "ચોક્કસ ભલામણ માટે કૃપા કરીને જીવાત અને અસરગ્રસ્ત પાકનું વધુ વિગતવાર વર્ણન કરો.",
                "precaution_title": "સાવચેતી:",
                "precaution_hot": "ઊંચું તાપમાન પાકને નુકસાન પહોંચાડી શકે છે. પૂરતી સિંચાઈની ખાતરી કરો.",
                "precaution_rain": "વરસાદની અપેક્ષા છે. જંતુનાશકોનો છંટકાવ મુલતવી રાખો. પાણી ભરાઈ ન જાય તે માટે યોગ્ય નિકાલની ખાતરી કરો.",
                "precaution_wind": "તીવ્ર પવન ઊંચા પાકને નુકસાન પહોંચાડી શકે છે. નબળા છોડને ટેકો આપો.",
                "precaution_humidity": "વધુ ભેજ ફંગલ રોગોનું જોખમ વધારે છે. પાકનું નજીકથી નિરીક્ષણ કરો.",
                "precaution_clear": "ખેતરના કામકાજ માટે સ્વચ્છ આકાશ અને શાંત હવામાન આદર્શ છે.",
                "precaution_default": "હવામાન સાધારણ છે. તમારા નિયમિત ખેતી કાર્યો ચાલુ રાખો.",
                "default": "માફ કરશો, હું સમજી શક્યો નથી. કૃપા કરીને પાક, જીવાત, ખાતર, હવામાન અથવા ભાવ વિશે પૂછો."
            },
            "ta": {
                "voice_btn_start": "குரல் உள்ளீடு", "voice_btn_listening": "கேட்கிறது...",
                "invalid_crop_message": "மன்னிக்கவும், '{crop}' க்கான விலை தகவல் என்னிடம் இல்லை. கிடைக்கக்கூடிய விருப்பங்களிலிருந்து தேர்வு செய்யவும் அல்லது சரியான பயிர் பெயரைத் தட்டச்சு செய்யவும்.",
                "greeting": "வணக்கம்! நான் கிசான் மித்ரா. இன்று உங்கள் விவசாயத் தேவைகளுக்கு நான் எப்படி உதவ முடியும்?",
                "personalized_welcome": "{location} இலிருந்து வரவேற்கிறோம்! பயிர் தேர்வு, பூச்சி கட்டுப்பாடு, உரங்கள், வானிலை மற்றும் சந்தை விலைகள் குறித்து நான் உங்களுக்கு ஆலோசனை வழங்க முடியும். நான் எப்படி உதவ முடியும்?",
                "options_title": "விரைவு ஆலோசனை", "crop-selection-query": "பயிர் தேர்வு", "pest-control-query": "பூச்சி கட்டுப்பாடு", "fertilizer-query": "உர வழிகாட்டுதல்", "weather-query": "வானிலை அறிக்கை", "soil-health-query": "மண் வளம்", "market-prices-query": "சந்தை விலைகள்",
                "fetching_prices": "**{crop}** க்கான சந்தை விலைகளைப் பெறுகிறேன்...",
                "price_report": "உங்கள் பகுதியில் **{crop}** தற்போதைய மாதிரி விலை குவின்டாலுக்கு சுமார் **₹{price}** ஆகும்.",
                "ask_crop_price": "நீங்கள் எந்த பயிரின் விலையை அறிய விரும்புகிறீர்கள்? கீழே உள்ள விருப்பங்களிலிருந்து நீங்கள் தேர்ந்தெடுக்கலாம் அல்லது ஒரு பெயரைத் தட்டச்சு செய்யலாம்.",
                "weather_report": "<b>{location} இல் வானிலை:</b><br>வெப்பநிலை: {temp}°C<br>நிலை: {description}<br>ஈரப்பதம்: {humidity}%<br>காற்றின் வேகம்: {wind} m/s",
                "weather_error": "மன்னிக்கவும், உங்கள் இருப்பிடத்திற்கான வானிலை அறிக்கையைப் பெற முடியவில்லை. பின்னர் மீண்டும் முயற்சிக்கவும்.",
                "soil-types": { "question": "பயிர் பரிந்துரையைப் பெற, உங்கள் மண்ணின் வகையைத் தேர்ந்தெடுக்கவும்.", "options": ["வண்டல்", "கரிசல்", "செம்மண்", "சரளை", "பாலை", "காடு"] },
                "common-pests": { "question": "நீங்கள் எந்த பூச்சியை எதிர்கொள்கிறீர்கள்?", "options": ["அசுவினி", "வெள்ளை ஈ", "காய்ப் புழு", "தண்டுத் துளைப்பான்", "வெட்டுக்கிளி", "மற்றவை"] },
                "user_selection_prefix": "நீங்கள் தேர்ந்தெடுத்தது:",
                "crop_rec_template": "உங்கள் இருப்பிடம் மற்றும் **{soil}** மண்ணின் அடிப்படையில், {recommendation}",
                "crop_rec_alluvial": "இந்த வளமான மண் **கோதுமை, அரிசி, கரும்பு மற்றும் சணல்** போன்ற பயிர்களுக்கு சிறந்தது.",
                "crop_rec_black": "அதன் அதிக ஈரப்பதத்தைத் தக்கவைக்கும் திறன் **பருத்தி, சோயாபீன்ஸ் மற்றும் சோளம்** ஆகியவற்றிற்கு ஏற்றது.",
                "crop_rec_red": "இது **நிலக்கடலை, பருப்பு வகைகள் மற்றும் தினை** போன்ற பயிர்களுக்கு மிகவும் பொருத்தமானது.",
                "crop_rec_laterite": "இது **தேயிலை, காபி மற்றும் மசாலா** போன்ற தோட்டப் பயிர்களுக்கு ஏற்றது.",
                "crop_rec_arid": "சரியான நீர்ப்பாசனத்துடன், நீங்கள் **கம்பு, பார்லி மற்றும் பேரீச்சை** ஆகியவற்றை வளர்க்கலாம்.",
                "crop_rec_forest": "இது மட்கிய சத்து நிறைந்தது மற்றும் **பழங்கள், தேயிலை மற்றும் மருத்துவ தாவரங்களுக்கு** சிறந்தது.",
                "crop_rec_default": "அந்த மண் வகைக்கு என்னிடம் குறிப்பிட்ட பரிந்துரை இல்லை. உங்கள் பகுதியின் அடிப்படையில், **கோதுமை** மற்றும் **மக்காச்சோளம்** பொதுவாக பாதுகாப்பான தேர்வுகள்.",
                "soil_health_menu": { "question": "மண் ஆரோக்கியத்தின் எந்த அம்சத்தில் நீங்கள் ஆர்வமாக உள்ளீர்கள்? ஒரு விருப்பத்தைத் தேர்ந்தெடுக்கவும்.", "options": ["நீர் வடிகால்", "ஊட்டச்சத்து அளவு", "மண் கடினத்தன்மை", "கரிமப் பொருள்"] },
                "soil_advice_drainage": "மோசமான வடிகால் வேர்களுக்கு தீங்கு விளைவிக்கும். அதை மேம்படுத்த, உரம் போன்ற **கரிமப் பொருட்களை** சேர்க்கவும், சிறந்த மண் அமைப்புக்கு **பாதுகாப்பு உழவு** பயிற்சி செய்யவும்.",
                "soil_advice_nutrients": "ஊட்டச்சத்து அளவுகளுக்கு, **மண் பரிசோதனை** சிறந்த தொடக்கமாகும். பருப்பு வகைகளுடன் **பயிர் சுழற்சி** மற்றும் **உரம் அல்லது நன்கு மக்கிய எரு** சேர்ப்பதன் மூலம் வளத்தை மேம்படுத்தவும்.",
                "soil_advice_hardness": "கடினமான மண், அல்லது **இறுக்கம்**, வேர் வளர்ச்சியை கட்டுப்படுத்துகிறது. ஈரமான மண்ணில் **கனரக இயந்திரங்களைக் குறைப்பதன்** மூலமும், **ஆழமான வேரூன்றிய மூடு பயிர்களை** நடுவதன் மூலமும் அதைக் குறைக்கவும்.",
                "soil_advice_organic": "கரிமப் பொருள் முக்கியம்! இது நீர் தேக்கம், ஊட்டச்சத்து வழங்கல் மற்றும் மண் அமைப்பை மேம்படுத்துகிறது. **மூடு பயிர்களை** பயன்படுத்துவதன் மூலமும், **உரம்** இடுவதன் மூலமும், **பயிர் எச்சங்களை** வயலில் விட்டுவிடுவதன் மூலமும் அதைச் சேர்க்கவும்.",
                "fertilizer_alluvial": "வண்டல் மண் மிகவும் வளமானதாக இருந்தாலும், நைட்ரஜன் குறைவாக இருக்கலாம். சமச்சீரான NPK உரத்தைப் பயன்படுத்தவும் மற்றும் **பண்ணை எரு** சேர்க்கவும்.",
                "fertilizer_black": "கரிசல் மண்ணில் பொட்டாஷ் அதிகமாக உள்ளது, ஆனால் பெரும்பாலும் பாஸ்பரஸ் குறைவாக இருக்கும். டிஏபி போன்ற **பாஸ்பரஸ் நிறைந்த உரத்தை** பயன்படுத்தவும் மற்றும் நிறைய **கம்போஸ்ட்** சேர்க்கவும்.",
                "fertilizer_red": "செம்மண்ணில் நைட்ரஜன் மற்றும் பாஸ்பரஸ் குறைவாக உள்ளது. N மற்றும் P இன் அதிக விகிதத்துடன் கூடிய உரக் கலவை பரிந்துரைக்கப்படுகிறது. மண் மிகவும் அமிலத்தன்மை வாய்ந்ததாக இருந்தால் **சுண்ணாம்பு இடுவதும்** உதவும்.",
                "fertilizer_laterite": "சரளை மண்ணில் வளம் குறைவாக உள்ளது. அதற்கு நுண்ணூட்டச்சத்துக்களுடன் முழுமையான NPK உரம் தேவை. **கரிம உரத்தை** தவறாமல் பயன்படுத்துவது அவசியம்.",
                "fertilizer_arid": "பாலைவன மண்ணில் கரிமப் பொருட்கள் மற்றும் நைட்ரஜன் குறைவாக உள்ளது. யூரியா போன்ற **நைட்ரஜன் உரங்களை** பயன்படுத்தவும் மற்றும் நீர் தேக்கத்தை மேம்படுத்த அதிக அளவு **கம்போஸ்ட்** சேர்க்கவும்.",
                "fertilizer_forest": "காட்டு மண் பொதுவாக கரிமப் பொருட்களால் நிறைந்துள்ளது, ஆனால் அமிலத்தன்மையுடன் இருக்கலாம். மண் பரிசோதனை செய்வது சிறந்தது, ஆனால் சமச்சீரான, மெதுவாக வெளியாகும் உரம் ஒரு நல்ல தொடக்கமாகும்.",
                "pest_advice_template": "**{pest}** க்கு, {solution}",
                "pest_advice_aphids": "**வேப்ப எண்ணெய் அடிப்படையிலான ஸ்ப்ரே** பயன்படுத்தவும். இலைகளின் அடிப்பகுதியை மூடுவதை உறுதிப்படுத்தவும். லேடிபக்குகளை ஊக்குவிப்பதும் இயற்கையாகவே உதவும்.",
                "pest_advice_whiteflies": "**மஞ்சள் நிற ஒட்டும் பொறிகளை**ப் பயன்படுத்தி அவற்றைக் கண்காணிக்கவும் பிடிக்கவும். ஒரு லேசான பூச்சிக்கொல்லி சோப்பு கரைசல் கூட பயனுள்ளதாக இருக்கும்.",
                "pest_advice_bollworms": "ஃபெரோமோன் பொறிகள் கண்காணிப்புக்கு பயனுள்ளதாக இருக்கும். **பி.டி (பேசிலஸ் ತುరిಂಜಿಯೆನ್ಸಿಸ್) அடிப்படையிலான பூச்சிக்கொல்லி**யைப் பயன்படுத்துவது ஒரு நல்ல கரிம தீர்வாகும்.",
                "pest_advice_stemborers": "பாதிக்கப்பட்ட தாவர பாகங்களை உடனடியாக அகற்றி அழிக்கவும். **டிரைகோகிராமா குளவிகளை** விடுவிப்பது உயிரியல் கட்டுப்பாட்டாக செயல்படும்.",
                "pest_advice_locusts": "இது ஒரு தீவிரமான பிரச்சினை. பெரிய திரள்களுக்கு, நீங்கள் **உடனடியாக உங்கள் உள்ளூர் விவசாய அதிகாரிகளை தொடர்பு கொள்ள வேண்டும்**. உரத்த சத்தம் எழுப்புவது சில நேரங்களில் சிறிய குழுக்களைத் தடுக்கலாம்.",
                "pest_advice_other": "ஒரு குறிப்பிட்ட பரிந்துரைக்கு பூச்சி மற்றும் பாதிக்கப்பட்ட பயிர் பற்றி மேலும் விரிவாக விவரிக்கவும்.",
                "precaution_title": "எச்சரிக்கை:",
                "precaution_hot": "அதிக வெப்பநிலை பயிர்களுக்கு பாதிப்பை ஏற்படுத்தும். போதுமான நீர்ப்பாசனம் செய்வதை உறுதிப்படுத்தவும்.",
                "precaution_rain": "மழை எதிர்பார்க்கப்படுகிறது. பூச்சிக்கொல்லி தெளிப்பதை ஒத்திவைக்கவும். நீர் தேங்காமல் இருக்க சரியான வடிகால் வசதி செய்யவும்.",
                "precaution_wind": "பலத்த காற்று உயரமான பயிர்களை சேதப்படுத்தும். பலவீனமான தாவரங்களுக்கு ஆதரவு அளியுங்கள்.",
                "precaution_humidity": "அதிக ஈரப்பதம் பூஞ்சை நோய்களின் அபாயத்தை அதிகரிக்கிறது. பயிர்களை கவனமாக கண்காணிக்கவும்.",
                "precaution_clear": "தெளிவான வானம் மற்றும் அமைதியான வானிலை களப்பணிகளுக்கு ஏற்றது.",
                "precaution_default": "வானிலை மிதமானது. உங்கள் வழக்கமான விவசாய அட்டவணையைத் தொடரவும்.",
                "default": "மன்னிக்கவும், எனக்குப் புரியவில்லை. பயிர்கள், பூச்சிகள், உரம், வானிலை அல்லது விலைகள் பற்றி கேட்கவும்."
            },
            "te": {
                "voice_btn_start": "వాయిస్ ఇన్పుట్", "voice_btn_listening": "వినడం...",
                "invalid_crop_message": "క్షమించండి, నా దగ్గర '{crop}' కోసం ధర సమాచారం లేదు. దయచేసి అందుబాటులో ఉన్న ఎంపికల నుండి ఎంచుకోండి లేదా సరైన పంట పేరును టైప్ చేయండి.",
                "greeting": "నమస్కారం! నేను కిసాన్ మిత్ర. ఈ రోజు మీ వ్యవసాయ అవసరాలకు నేను ఎలా సహాయపడగలను?",
                "personalized_welcome": "{location} నుండి స్వాగతం! నేను పంట ఎంపిక, తెగుళ్ళ నివారణ, ఎరువులు, వాతావరణం మరియు మార్కెట్ ధరలపై సలహా ఇవ్వగలను. నేను ఎలా సహాయపడగలను?",
                "options_title": "త్వరిత సలహా", "crop-selection-query": "పంట ఎంపిక", "pest-control-query": "పురుగుల నివారణ", "fertilizer-query": "ఎరువుల మార్గదర్శకం", "weather-query": "వాతావరణ సలహా", "soil-health-query": "నేల ఆరోగ్యం", "market-prices-query": "మార్కెట్ ధరలు",
                "fetching_prices": "**{crop}** కోసం మార్కెట్ ధరలను పొందుతున్నాను...",
                "price_report": "మీ ప్రాంతంలో **{crop}** ప్రస్తుత మోడల్ ధర క్వింటాల్‌కు సుమారు **₹{price}**. ",
                "ask_crop_price": "మీరు ఏ పంట ధరను తెలుసుకోవాలనుకుంటున్నారు? మీరు దిగువ விருப்பங்களிலிருந்து ఎంచుకోవచ్చు లేదా పేరును టైప్ చేయవచ్చు.",
                "weather_report": "<b>{location}లో వాతావరణం:</b><br>ఉష్ణోగ్రత: {temp}°C<br>స్థితి: {description}<br>తేమ: {humidity}%<br>గాలి వేగం: {wind} m/s",
                "weather_error": "క్షమించండి, మీ ప్రాంతానికి వాతావరణ సమాచారం పొందలేకపోయాను. దయచేసి తర్వాత ప్రయత్నించండి.",
                "soil-types": { "question": "పంట సిఫార్సు పొందడానికి, దయచేసి మీ నేల రకాన్ని ఎంచుకోండి.", "options": ["ఒండ్రు", "నల్లరేగడి", "ఎర్ర", "లేటరైట్", "శుష్క", "అటవీ"] },
                "common-pests": { "question": "మీరు ఏ పురుగుతో బాధపడుతున్నారు?", "options": ["పేనుబంక", "తెల్ల దోమ", "కాయతొలుచు పురుగు", "కాండం తొలిచే పురుగు", "మిడత", "ఇతర"] },
                "user_selection_prefix": "మీరు ఎంచుకున్నారు:",
                "crop_rec_template": "మీ ప్రాంతం మరియు **{soil}** నేల ఆధారంగా, {recommendation}",
                "crop_rec_alluvial": "ఈ సారవంతమైన నేల **గోధుమ, వరి, చెరకు, మరియు జనుము** వంటి పంటలకు అద్భుతమైనది.",
                "crop_rec_black": "దీని అధిక తేమ నిలుపుదల **పత్తి, సోయాబీన్, మరియు జొన్న**కు అనువైనది.",
                "crop_rec_red": "ఇది **వేరుశెనగ, పప్పుధాన్యాలు, మరియు మిల్లెట్స్** వంటి పంటలకు బాగా సరిపోతుంది.",
                "crop_rec_laterite": "ఇది **తేయాకు, కాఫీ, మరియు సుగంధ ద్రవ్యాలు** వంటి తోటల పంటలకు సరైనది.",
                "crop_rec_arid": "సరైన నీటిపారుదలతో, మీరు **బజ్రా, బార్లీ, మరియు ఖర్జూరం** పండించవచ్చు.",
                "crop_rec_forest": "ఇది హ్యూమస్‌తో సమృద్ధిగా ఉండి **పండ్లు, తేయాకు, మరియు ఔషధ మొక్కల**కు గొప్పది.",
                "crop_rec_default": "ఆ నేల రకానికి నా దగ్గర నిర్దిష్ట సిఫార్సు లేదు. మీ ప్రాంతం ఆధారంగా, **గోధుమ** మరియు **మొక్కజొన్న** సాధారణంగా సురక్షితమైన ఎంపికలు.",
                "soil_health_menu": { "question": "మీరు నేల ఆరోగ్యం యొక్క ఏ అంశంపై ఆసక్తి కలిగి ఉన్నారు? దయచేసి ఒక ఎంపికను ఎంచుకోండి.", "options": ["నీటి పారుదల", "పోషక స్థాయిలు", "నేల కాఠిన్యం", "సేంద్రీయ పదార్థం"] },
                "soil_advice_drainage": "పేలవమైన నీటి పారుదల వేళ్లకు హాని కలిగిస్తుంది. దాన్ని మెరుగుపరచడానికి, కంపోస్ట్ వంటి **సేంద్రీయ పదార్థాన్ని** జోడించండి, మెరుగైన నేల నిర్మాణం కోసం **సంరక్షణ దున్నకం** పాటించండి.",
                "soil_advice_nutrients": "పోషక స్థాయిల కోసం, **నేల పరీక్ష** ఉత్తమ ప్రారంభం. పప్పుధాన్యాలతో **పంట మార్పిడి** మరియు క్రమం తప్పకుండా **కంపోస్ట్ లేదా బాగా కుళ్ళిన ఎరువు** జోడించడం ద్వారా సారాన్ని మెరుగుపరచండి.",
                "soil_advice_hardness": "కఠినమైన నేల, లేదా **గట్టిపడటం**, వేర్ల పెరుగుదలను నిరోధిస్తుంది. తడి నేలపై **భారీ యంత్రాలను తగ్గించడం** మరియు **లోతైన వేర్లు ఉన్న కవర్ పంటలను** నాటడం ద్వారా దాన్ని తగ్గించండి.",
                "soil_advice_organic": "సేంద్రీయ పదార్థం కీలకం! ఇది నీటిని నిలుపుకోవడం, పోషకాల సరఫరా మరియు నేల నిర్మాణాన్ని మెరుగుపరుస్తుంది. **కవర్ పంటలను** ఉపయోగించడం, **కంపోస్ట్** వేయడం మరియు **పంట అవశేషాలను** పొలంలో వదిలివేయడం ద్వారా దాన్ని జోడించండి.",
                "fertilizer_alluvial": "ఒండ్రు నేల చాలా సారవంతమైనది, కానీ నత్రజని లోపం ఉండవచ్చు. సమతుల్య NPK ఎరువును వాడండి మరియు **పశువుల ఎరువు** జోడించండి.",
                "fertilizer_black": "నల్లరేగడి నేలలో పొటాష్ అధికంగా ఉంటుంది, కానీ తరచుగా ఫాస్పరస్ లోపం ఉంటుంది. DAP వంటి **ఫాస్పరస్ అధికంగా ఉండే ఎరువును** వాడండి మరియు పుష్కలంగా **కంపోస్ట్** జోడించండి.",
                "fertilizer_red": "ఎర్ర నేలలో నత్రజని మరియు ఫాస్పరస్ లోపం ఉంటుంది. N మరియు P యొక్క అధిక నిష్పత్తితో కూడిన ఎరువుల మిశ్రమం సిఫార్సు చేయబడింది. నేల చాలా ఆమ్లంగా ఉంటే **సున్నం వేయడం** కూడా సహాయపడుతుంది.",
                "fertilizer_laterite": "లేటరైట్ నేల తక్కువ సారాన్ని కలిగి ఉంటుంది. దీనికి సూక్ష్మపోషకాలతో పాటు పూర్తి NPK ఎరువు అవసరం. **సేంద్రియ ఎరువు** క్రమం తప్పకుండా వేయడం అవసరం.",
                "fertilizer_arid": "శుష్క నేలలో సేంద్రియ పదార్థం మరియు నత్రజని లోపం ఉంటుంది. యూరియా వంటి **నత్రజని ఎరువులను** వాడండి మరియు నీటిని నిలుపుకోవడానికి పెద్ద మొత్తంలో **కంపోస్ట్** జోడించండి.",
                "fertilizer_forest": "అటవీ నేల సాధారణంగా సేంద్రియ పదార్థంతో సమృద్ధిగా ఉంటుంది, కానీ ఆమ్లంగా ఉండవచ్చు. నేల పరీక్ష చేయించుకోవడం ఉత్తమం, కానీ సమతుల్య, నెమ్మదిగా విడుదలయ్యే ఎరువు మంచి ప్రారంభం.",
                "pest_advice_template": "**{pest}** కొరకు, {solution}",
                "pest_advice_aphids": "**వేప నూనె ఆధారిత స్ప్రే** వాడండి. ఆకుల కింది భాగాన్ని కవర్ చేసేలా చూసుకోండి. లేడీబగ్స్‌ను ప్రోత్సహించడం కూడా సహజంగా సహాయపడుతుంది.",
                "pest_advice_whiteflies": "వాటిని పర్యవేక్షించడానికి మరియు పట్టుకోవడానికి **పసుపు జిగురు ట్రాప్‌లను** వాడండి. తేలికపాటి క్రిమిసంహారక సబ్బు ద్రావణం కూడా ప్రభావవంతంగా ఉంటుంది.",
                "pest_advice_bollworms": "ఫెరోమోన్ ట్రాప్‌లు పర్యవేక్షణకు ప్రభావవంతంగా ఉంటాయి. **బిటి (బాసిల్లస్ తురింజియెన్సిస్) ఆధారిత పురుగుమందు**ను వాడటం ఒక మంచి సేంద్రీయ పరిష్కారం.",
                "pest_advice_stemborers": "సోకిన మొక్కల భాగాలను వెంటనే తొలగించి నాశనం చేయండి. **ట్రైకోగ్రామా కందిరీగలను** విడుదల చేయడం జీవ నియంత్రణగా పనిచేస్తుంది.",
                "pest_advice_locusts": "ఇది ఒక తీవ్రమైన సమస్య. పెద్ద సమూహాల కోసం, మీరు **వెంటనే మీ స్థానిక వ్యవసాయ అధికారులను సంప్రదించాలి**. పెద్ద శబ్దాలు చేయడం కొన్నిసార్లు చిన్న సమూహాలను నిరోధించవచ్చు.",
                "pest_advice_other": "దయచేసి ఒక నిర్దిష్ట సిఫార్సు కోసం పురుగు మరియు ప్రభావిత పంట గురించి మరింత వివరంగా వివరించండి.",
                "precaution_title": "జాగ్రత్త:",
                "precaution_hot": "అధిక ఉష్ణోగ్రతలు పంటలకు హాని కలిగిస్తాయి. తగినంత నీటిపారుదలని నిర్ధారించుకోండి.",
                "precaution_rain": "వర్షం ఆశించబడుతుంది. పురుగుమందుల పిచికారీని వాయిదా వేయండి. నీరు నిలిచిపోకుండా సరైన డ్రైనేజీని నిర్ధారించుకోండి.",
                "precaution_wind": "బలమైన గాలులు పొడవైన పంటలను దెబ్బతీస్తాయి. బలహీనమైన మొక్కలకు మద్దతు ఇవ్వండి.",
                "precaution_humidity": "అధిక తేమ ఫంగల్ వ్యాధుల ప్రమాదాన్ని పెంచుతుంది. పంటలను నిశితంగా గమనించండి.",
                "precaution_clear": "స్పష్టమైన ఆకాశం మరియు ప్రశాంత వాతావరణం క్షేత్ర కార్యకలాపాలకు అనువైనవి.",
                "precaution_default": "వాతావరణం మధ్యస్తంగా ఉంది. మీ సాధారణ వ్యవసాయ షెడ్యూల్‌తో కొనసాగండి.",
                "default": "క్షమించండి, నాకు అర్థం కాలేదు. దయచేసి పంటలు, తెగుళ్లు, ఎరువులు, వాతావరణం లేదా ధరల గురించి అడగండి."
            },
            "bn": {
                "voice_btn_start": "ভয়েস ইনপুট", "voice_btn_listening": "শুনছি...",
                "invalid_crop_message": "দুঃখিত, আমার কাছে '{crop}' এর জন্য মূল্যের তথ্য নেই। অনুগ্রহ করে উপলব্ধ বিকল্পগুলি থেকে চয়ন করুন বা একটি বৈধ ফসলের নাম টাইপ করুন।",
                "greeting": "নমস্কার! আমি কিষাণ মিত্র। আজ আমি আপনার চাষের প্রয়োজনে কীভাবে সাহায্য করতে পারি?",
                "personalized_welcome": "{location} থেকে স্বাগতম! আমি ফসল নির্বাচন, কীটপতঙ্গ নিয়ন্ত্রণ, সার, আবহাওয়া এবং বাজারদর সম্পর্কে পরামর্শ দিতে পারি। আমি কীভাবে সাহায্য করতে পারি?",
                "options_title": "দ্রুত পরামর্শ", "crop-selection-query": "ফসল নির্বাচন", "pest-control-query": " কীটপতঙ্গ নিয়ন্ত্রণ", "fertilizer-query": "সারের নির্দেশিকা", "weather-query": "আবহাওয়ার পরামর্শ", "soil-health-query": "মাটির স্বাস্থ্য", "market-prices-query": "বাজার দর",
                "fetching_prices": "**{crop}** এর জন্য বাজার দর আনা হচ্ছে...",
                "price_report": "আপনার অঞ্চলে **{crop}** এর বর্তমান মডেল মূল্য প্রতি কুইন্টাল প্রায় **₹{price}**।",
                "ask_crop_price": "আপনি কোন ফসলের দাম জানতে চান? আপনি নীচের বিকল্পগুলি থেকে নির্বাচন করতে পারেন বা একটি নাম টাইপ করতে পারেন।",
                "weather_report": "<b>{location} এ আবহাওয়া:</b><br>তাপমাত্রা: {temp}°C<br>অবস্থা: {description}<br>আর্দ্রতা: {humidity}%<br>বাতাসের গতি: {wind} m/s",
                "weather_error": "দুঃখিত, আমি আপনার অবস্থানের জন্য আবহাওয়ার তথ্য পেতে পারিনি। অনুগ্রহ করে পরে আবার চেষ্টা করুন।",
                "soil-types": { "question": "ফসলের সুপারিশ পেতে, অনুগ্রহ করে আপনার মাটির ধরন নির্বাচন করুন।", "options": ["পলিমাটি", "কালো", "লাল", "ল্যাটেরাইট", "শুষ্ক", "বন"] },
                "common-pests": { "question": "আপনি কোন পোকার সাথে মোকাবিলা করছেন?", "options": ["জাবপোকা", "সাদা মাছি", "ফল ছিদ্রকারী পোকা", "কাণ্ড ছিদ্রকারী পোকা", "পঙ্গপাল", "অন্যান্য"] },
                "user_selection_prefix": "আপনি বেছে নিয়েছেন:",
                "crop_rec_template": "আপনার অবস্থান এবং **{soil}** মাটির উপর ভিত্তি করে, {recommendation}",
                "crop_rec_alluvial": "এই উর্বর মাটি **গম, ধান, আখ এবং পাট** এর মতো ফসলের জন্য চমৎকার।",
                "crop_rec_black": "এর উচ্চ আর্দ্রতা ধারণ ক্ষমতা **তুলা, সয়াবিন এবং জোয়ার** এর জন্য আদর্শ।",
                "crop_rec_red": "এটি **চিনাবাদাম, ডাল এবং মিলেট** এর মতো ফসলের জন্য উপযুক্ত।",
                "crop_rec_laterite": "এটি **চা, কফি এবং মশলা** এর মতো বাগান ফসলের জন্য উপযুক্ত।",
                "crop_rec_arid": "সঠিক সেচ দিয়ে আপনি **বাজরা, বার্লি এবং খেজুর** চাষ করতে পারেন।",
                "crop_rec_forest": "এটি হিউমাসে সমৃদ্ধ এবং **ফল, চা এবং ঔষধি গাছের** জন্য দুর্দান্ত।",
                "crop_rec_default": "আমার কাছে সেই মাটির ধরণের জন্য নির্দিষ্ট কোনো সুপারিশ নেই। আপনার এলাকার উপর ভিত্তি করে, **গম** এবং **ভুট্টা** সাধারণত নিরাপদ পছন্দ।",
                "soil_health_menu": { "question": "আপনি মাটির স্বাস্থ্যের কোন বিষয়ে আগ্রহী? অনুগ্রহ করে একটি বিকল্প নির্বাচন করুন।", "options": ["জল নিষ্কাশন", "পুষ্টির স্তর", "মাটির কঠোরতা", "জৈব পদার্থ"] },
                "soil_advice_drainage": "খারাপ জল নিষ্কাশন শিকড়ের ক্ষতি করতে পারে। এর উন্নতির জন্য, কম্পোস্টের মতো **জৈব পদার্থ** যোগ করুন, ভাল মাটির কাঠামোর জন্য **সংরক্ষণমূলক চাষ** অনুশীলন করুন।",
                "soil_advice_nutrients": "পুষ্টির স্তরের জন্য, **মাটি পরীক্ষা** সেরা শুরু। শিম্বিগোত্রীয় ফসলের সাথে **শস্য আবর্তন** ব্যবহার করে এবং নিয়মিত **কম্পোস্ট বা ভালভাবে পচা সার** যোগ করে উর্বরতা উন্নত করুন।",
                "soil_advice_hardness": "শক্ত মাটি, বা **সংকোচন**, শিকড়ের বৃদ্ধি সীমাবদ্ধ করে। ভেজা মাটিতে **ভারী যন্ত্রপাতি কমানো** এবং **গভীর শিকড়যুক্ত কভার ফসল** রোপণ করে এটি হ্রাস করুন।",
                "soil_advice_organic": "জৈব পদার্থ চাবিকাঠি! এটি জল ধারণ, পুষ্টি সরবরাহ এবং মাটির গঠন উন্নত করে। **কভার ফসল** ব্যবহার করে, **কম্পোস্ট** প্রয়োগ করে এবং **ফসলের অবশিষ্টাংশ** মাঠে রেখে এটি যোগ করুন।",
                "fertilizer_alluvial": "পলিমাটি বেশ উর্বর কিন্তু নাইট্রোজেনের অভাব থাকতে পারে। একটি সুষম NPK সার ব্যবহার করুন এবং **গোবর সার** যোগ করুন।",
                "fertilizer_black": "কালো মাটিতে পটাশ সমৃদ্ধ কিন্তু প্রায়শই ফসফরাসের অভাব থাকে। ডিএপি-র মতো **ফসফরাস-সমৃদ্ধ সার** ব্যবহার করুন এবং প্রচুর পরিমাণে **কম্পোস্ট** যোগ করুন।",
                "fertilizer_red": "লাল মাটিতে নাইট্রোজেন এবং ফসফরাসের অভাব থাকে। N এবং P এর উচ্চ অনুপাতযুক্ত একটি সার মিশ্রণের সুপারিশ করা হয়। মাটি খুব অম্লীয় হলে **লাইমিং** সাহায্য করতে পারে।",
                "fertilizer_laterite": "ল্যাটেরাইট মাটির উর্বরতা কম। এর জন্য মাইক্রোনিউট্রিয়েন্টস সহ একটি সম্পূর্ণ NPK সার প্রয়োজন। **জৈব সার** এর নিয়মিত প্রয়োগ অপরিহার্য।",
                "fertilizer_arid": "শুষ্ক মাটিতে জৈব পদার্থ এবং নাইট্রোজেনের অভাব থাকে। ইউরিয়ার মতো **নাইট্রোজেনাস সার** ব্যবহার করুন এবং জল ধারণ ক্ষমতা উন্নত করতে প্রচুর পরিমাণে **কম্পোস্ট** যোগ করুন।",
                "fertilizer_forest": "বনজ মাটি সাধারণত জৈব পদার্থে সমৃদ্ধ কিন্তু অম্লীয় হতে পারে। মাটি পরীক্ষা করা ভাল, তবে একটি সুষম, ধীর-গতির সার একটি ভাল শুরু।",
                "pest_advice_template": "**{pest}** এর জন্য, {solution}",
                "pest_advice_aphids": "**নিম তেল ভিত্তিক স্প্রে** ব্যবহার করুন। পাতার নিচের অংশটি ঢেকে রাখা নিশ্চিত করুন। লেডিবাগদের উৎসাহিত করাও স্বাভাবিকভাবে সাহায্য করতে পারে।",
                "pest_advice_whiteflies": "তাদের নিরীক্ষণ এবং ধরার জন্য **হলুদ স্টিকি ট্র্যাপ** ব্যবহার করুন। একটি হালকা কীটনাশক সাবান দ্রবণও কার্যকর হতে পারে।",
                "pest_advice_bollworms": "ফেরোমন ট্র্যাপ নিরীক্ষণের জন্য কার্যকর। **বিটি (ব্যাসিলাস থুরিনজিয়েনসিস) ভিত্তিক কীটনাশক** প্রয়োগ করা একটি ভাল জৈব সমাধান।",
                "pest_advice_stemborers": "সংক্রমিত গাছের অংশগুলি অবিলম্বে সরিয়ে ফেলুন এবং ধ্বংস করুন। **ট্রাইকোগ্রামা বোলতা** ছেড়ে দেওয়া জৈবিক নিয়ন্ত্রণ হিসাবে কাজ করতে পারে।",
                "pest_advice_locusts": "এটি একটি গুরুতর সমস্যা। বড় ঝাঁকের জন্য, আপনাকে **অবশ্যই আপনার স্থানীয় কৃষি কর্তৃপক্ষের সাথে যোগাযোগ করতে হবে**। জোরে শব্দ করা কখনও কখনও ছোট দলগুলিকে নিরুৎসাহিত করতে পারে।",
                "pest_advice_other": "একটি নির্দিষ্ট সুপারিশের জন্য অনুগ্রহ করে কীটপতঙ্গ এবং ক্ষতিগ্রস্ত ফসল সম্পর্কে আরও বিস্তারিতভাবে বর্ণনা করুন।",
                "precaution_title": "সতর্কতা:",
                "precaution_hot": "উচ্চ তাপমাত্রা ফসলের উপর চাপ সৃষ্টি করতে পারে। পর্যাপ্ত সেচ নিশ্চিত করুন।",
                "precaution_rain": "বৃষ্টির সম্ভাবনা আছে। কীটনাশক স্প্রে করা স্থগিত করুন। জল জমা এড়াতে সঠিক নিষ্কাশন ব্যবস্থা নিশ্চিত করুন।",
                "precaution_wind": "জোরালো বাতাস লম্বা ফসলের ক্ষতি করতে পারে। দুর্বল গাছকে सहारा দিন।",
                "precaution_humidity": "উচ্চ আর্দ্রতা ছত্রাকজনিত রোগের ঝুঁকি বাড়ায়। ফসল ঘনিষ্ঠভাবে পর্যবেক্ষণ করুন।",
                "precaution_clear": "পরিষ্কার আকাশ এবং শান্ত আবহাওয়া মাঠের কাজের জন্য আদর্শ।",
                "precaution_default": "আবহাওয়া মাঝারি। আপনার নিয়মিত চাষের সময়সূচী চালিয়ে যান।",
                "default": "দুঃখিত, আমি বুঝতে পারিনি। অনুগ্রহ করে ফসল, কীটপতঙ্গ, সার, আবহাওয়া বা দাম সম্পর্কে জিজ্ঞাসা করুন।"
            }
        };
        
        const intents = {
            "en": { "greeting": ["hello", "hi", "hey"], "crop_selection": ["crop", "sowing", "plant"], "pest_control": ["pest", "insect", "disease"], "fertilizer": ["fertilizer", "compost", "manure"], "weather": ["weather", "rain", "forecast"], "soil_health": ["soil", "health", "ph"], "market_prices": ["price", "market", "rate"] },
            "hi": { "greeting": ["नमस्ते", "नमस्कार"], "crop_selection": ["फसल", "बुवाई", "लगाना"], "pest_control": ["कीट", "रोग", "कीड़ा"], "fertilizer": ["उर्वरक", "खाद"], "weather": ["मौसम", "बारिश"], "soil_health": ["मिट्टी", "पीएच"], "market_prices": ["कीमत", "बाजार", "भाव", "दाम"] },
            "gu": { "greeting": ["નમસ્તે", "કેમ છો"], "crop_selection": ["પાક", "વાવણી", "રોપણી"], "pest_control": ["જીવાત", "રોગ", "જંતુ"], "fertilizer": ["ખાતર"], "weather": ["હવામાન", "વરસાદ"], "soil_health": ["જમીન", "પીએચ"], "market_prices": ["ભાવ", "બજાર", "દર"] },
            "ta": { "greeting": ["வணக்கம்"], "crop_selection": ["பயிர்", "விதைப்பு"], "pest_control": ["பூச்சி", "நோய்"], "fertilizer": ["உரம்"], "weather": ["வானிலை", "மழை"], "soil_health": ["மண்", "பிஎச்"], "market_prices": ["விலை", "சந்தை"] },
            "te": { "greeting": ["నమస్కారం"], "crop_selection": ["పంట", "విత్తడం"], "pest_control": ["పురుగు", "తెగులు", "రోగం"], "fertilizer": ["ఎరువు"], "weather": ["వాతావరణం", "వర్షం"], "soil_health": ["నేల", "పిహెచ్"], "market_prices": ["ధర", "మార్కెట్"] },
            "bn": { "greeting": ["নমস্কার", "হ্যালো"], "crop_selection": ["ফসল", "বপন", "চাষ"], "pest_control": ["পোকা", "রোগ"], "fertilizer": ["সার"], "weather": ["আবহাওয়া", "বৃষ্টি"], "soil_health": ["মাটি", "পিএইচ"], "market_prices": ["দাম", "দর", "বাজার"] }
        };

        window.onload = function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        userLat = position.coords.latitude;
                        userLon = position.coords.longitude;
                        reverseGeocode(userLat, userLon);
                    },
                    (error) => {
                        console.error("Geolocation error:", error);
                        showManualLocationInput("Could not detect location. Please enter it manually.");
                    }
                );
            } else {
                showManualLocationInput("Geolocation is not supported. Please enter your location manually.");
            }
        };

        function reverseGeocode(lat, lon) {
            fetch(`/api/location/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`)
                .then(response => response.json())
                .then(data => {
                    let userDistrict;
                    if (data.address && data.address.country_code === 'in') {
                        userDistrict = data.address.state_district || data.address.city || data.address.county;
                        if (userDistrict && data.address.state) {
                            userLocation = `${userDistrict}, ${data.address.state}`;
                            document.getElementById('locationStatus').textContent = `Location: ${userLocation}`;
                        } else {
                            showManualLocationInput("Could not pinpoint district. Please enter manually.");
                        }
                    } else {
                        showManualLocationInput("Service is available only in India. Please enter location.");
                    }
                    document.getElementById('startButton').style.display = 'block';
                })
                .catch(error => {
                    console.error("Reverse geocoding error:", error);
                    showManualLocationInput("Could not determine city. Please enter it manually.");
                });
        }

        function startChat() {
            userLanguage = document.getElementById('initialLanguage').value;
            const manualLocation = document.getElementById('initialLocation').value.trim();

            if (manualLocation) {
                const parts = manualLocation.split(',').map(p => p.trim());
                if (parts.length > 1) {
                    userLocation = manualLocation;
                } else {
                    alert("Please enter location as 'District, State' (e.g., Nashik, Maharashtra)");
                    return;
                }
            }

            if (!userLocation) {
                alert("Location is required to start.");
                return;
            }

            document.getElementById('introScreen').style.display = 'none';
            document.getElementById('mainContent').style.display = 'flex';
            document.getElementById('languageSelect').value = userLanguage;
            changeLanguage(false);
            
            setTimeout(() => {
                const welcomeMsg = (translations[userLanguage] || translations['en']).personalized_welcome.replace('{location}', userLocation);
                addMessage(welcomeMsg, 'bot');
            }, 500);
        }

        function sendMessage() {
            const userInput = document.getElementById('userInput');
            if (userInput.value.trim() === "") return;
            const message = userInput.value.trim();
            addMessage(message, 'user');
            userInput.value = "";
            
            setTimeout(() => processMessage(message), 800);
        }
        
        function processMessage(message) {
            if (isAwaitingSoilType) { sendSoilType(message); }
            else if (isAwaitingPestInfo) { sendPestType(message); }
            else if (isAwaitingCropName) { getMarketPrices(message); }
            else if (isAwaitingSoilHealthTopic) { handleSoilHealthTopic(message); }
            else { getBotResponse(message); }
        }

        function handleKeyPress(event) {
            if (event.key === "Enter") sendMessage();
        }

        function addMessage(content, sender) {
            const chatMessages = document.getElementById('chatMessages');
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}-message`;
            
            let formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
            formattedContent = formattedContent.replace(/\*(.*?)\*/g, '<i>$1</i>');
            
            messageDiv.innerHTML = formattedContent;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function selectOption(optionKey) {
            const res = translations[userLanguage] || translations['en'];
            addMessage(res[`${optionKey}-query`], 'user');
            
            setTimeout(() => {
                const actions = {
                    'crop-selection': () => {
                        conversationFlow = 'cropSelection';
                        isAwaitingSoilType = true;
                        addMessage(getOptionsHTML(res['soil-types'], 'soil-option', 'sendSoilType'), 'bot');
                    },
                    'pest-control': () => {
                        isAwaitingPestInfo = true;
                        addMessage(getOptionsHTML(res['common-pests'], 'pest-option', 'sendPestType'), 'bot');
                    },
                    'fertilizer': () => {
                        conversationFlow = 'fertilizerGuidance';
                        isAwaitingSoilType = true;
                        addMessage(getOptionsHTML(res['soil-types'], 'soil-option', 'sendSoilType'), 'bot');
                    },
                    'weather': () => getWeather(userLat, userLon),
                    'soil-health': () => {
                        isAwaitingSoilHealthTopic = true;
                        addMessage(getOptionsHTML(res['soil_health_menu'], 'soil-option', 'handleSoilHealthTopic'), 'bot');
                    },
                    'market-prices': () => getMarketPrices()
                };
                
                if (actions[optionKey]) actions[optionKey]();
            }, 800);
        }

        function getOptionsHTML(data, className, onclickFunc) {
            let html = `<p>${data.question}</p><div class="${className}s">`;
            data.options.forEach(opt => {
                html += `<div class="${className}" onclick="${onclickFunc}('${opt.replace(/'/g, "\\'")}')">${opt}</div>`;
            });
            return html + '</div>';
        }

        function getBotResponse(message) {
            const lowerCaseMessage = message.toLowerCase();
            const langIntents = intents[userLanguage] || intents['en'];
            let intentFound = Object.keys(langIntents).find(intent => 
                langIntents[intent].some(keyword => lowerCaseMessage.includes(keyword))
            );

            if (intentFound) {
                selectOption(intentFound.replace('_', '-'));
            } else {
                addMessage((translations[userLanguage] || translations['en']).default, 'bot');
            }
        }
        
        function generateWeatherPrecaution(weatherData, lang) {
            const res = translations[lang] || translations['en'];
            const temp = weatherData.main.temp;
            const condition = weatherData.weather[0].main.toLowerCase();
            const wind = weatherData.wind.speed;
            const humidity = weatherData.main.humidity;

            if (condition.includes('rain') || condition.includes('thunderstorm') || condition.includes('drizzle')) {
                return res.precaution_rain;
            } 
            else if (temp > 35) {
                return res.precaution_hot;
            } 
            else if (wind > 10) { 
                return res.precaution_wind;
            } 
            else if (humidity > 85) {
                return res.precaution_humidity;
            } 
            else if (condition.includes('clear')) {
                return res.precaution_clear;
            } 
            else {
                return res.precaution_default;
            }
        }
        async function getWeather(lat, lon) {
            const res = translations[userLanguage] || translations['en'];
            if (lat == null || lon == null) {
                addMessage(res.weather_error, 'bot');
                return;
            }
            try {
                const response = await fetch(`/api/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`);
                if (!response.ok) throw new Error('Weather data not available.');
                const data = await response.json();
                let report = res.weather_report
                    .replace('{location}', data.name)
                    .replace('{temp}', Math.round(data.main.temp))
                    .replace('{description}', data.weather[0].description)
                    .replace('{humidity}', data.main.humidity)
                    .replace('{wind}', data.wind.speed);
                const precaution = generateWeatherPrecaution(data, userLanguage);
                if (precaution) report += `<br><br><b>${res.precaution_title}</b> ${precaution}`;
                addMessage(report, 'bot');
            } catch (error) {
                console.error('Error fetching weather data:', error);
                addMessage(res.weather_error, 'bot');
            }
        }

        function handleSoilHealthTopic(topic) {
            isAwaitingSoilHealthTopic = false;
            const res = translations[userLanguage] || translations['en'];
            
            addMessage(`${res.user_selection_prefix || 'Selected:'} *${topic}*`, 'user');

            const optionIndex = res['soil_health_menu'].options.indexOf(topic);

            const adviceKeys = [
                'soil_advice_drainage',
                'soil_advice_nutrients',
                'soil_advice_hardness',
                'soil_advice_organic'
            ];

            let advice = res['default'];
            
            if (optionIndex !== -1) {
                const adviceKey = adviceKeys[optionIndex];
                advice = res[adviceKey];
            }

            setTimeout(() => {
                addMessage(advice, 'bot');
            }, 800);
        }

        function changeLanguage(updateChat = true) {
            userLanguage = document.getElementById('languageSelect').value;
            const res = translations[userLanguage] || translations['en'];
            document.getElementById('optionsTitle').textContent = res.options_title;
            const voiceBtnText = document.getElementById('voiceBtnText');
            if (voiceBtnText) {
                voiceBtnText.textContent = res.voice_btn_start;
            }
            document.querySelectorAll('.option-card').forEach(card => {
                const key = card.getAttribute('onclick').match(/'([^']+)'/)[1] + '-query';
                card.querySelector('.option-text').textContent = res[key];
            });
            if (updateChat) {
                document.getElementById('chatMessages').innerHTML = '';
                addMessage(res.personalized_welcome.replace('{location}', userLocation), 'bot');
            }
        }

        function toggleVoiceInput() {
            if (!recognition) return;
            const res = translations[userLanguage] || translations['en'];
            const btn = document.getElementById('voiceBtn');
            const btnText = document.getElementById('voiceBtnText');

            if (isListening) {
                recognition.stop();
            } else {
                const langCodeMap = { 'en': 'en-IN', 'hi': 'hi-IN', 'gu': 'gu-IN', 'ta': 'ta-IN', 'te': 'te-IN', 'bn': 'bn-IN' };
                recognition.lang = langCodeMap[userLanguage] || 'en-IN';
                try {
                    recognition.start();
                    isListening = true;
                    btn.classList.add('active');
                    btnText.textContent = res.voice_btn_listening;
                } catch(e) {
                    console.error("Voice recognition start error:", e);
                    alert("Could not start voice recognition. Please check microphone permissions.");
                }
            }
        }

        function showManualLocationInput(message) {
            document.getElementById('locationStatus').textContent = message;
            document.getElementById('locationInputContainer').style.display = 'block';
            document.getElementById('startButton').style.display = 'block';
        }
        
        // ===============================================
        // ==  FIXED/IMPROVED FUNCTIONS ARE BELOW ==
        // ===============================================
        async function getMarketPrices(cropName = null) {
            const res = translations[userLanguage] || translations['en'];
            const commonCrops = ['Wheat', 'Rice', 'Cotton', 'Potato', 'Onion', 'Soybean'];
            if (cropName) {
                addMessage(cropName, 'user');
                isAwaitingCropName = false;
                try {
                    const response = await fetch(`/api/market-prices?crop=${encodeURIComponent(cropName)}`);
                    const data = await response.json();
                    if (data.valid) {
                        addMessage(res.fetching_prices.replace('{crop}', data.crop), 'bot');
                        setTimeout(() => addMessage(res.price_report.replace('{crop}', data.crop).replace('{price}', data.price), 'bot'), 1000);
                    } else {
                        addMessage(res.invalid_crop_message.replace('{crop}', cropName), 'bot');
                        setTimeout(() => {
                            addMessage(getOptionsHTML({ question: res.ask_crop_price, options: commonCrops }, 'crop-price-option', 'getMarketPrices'), 'bot');
                            isAwaitingCropName = true;
                        }, 800);
                    }
                } catch (error) {
                    console.error('Market price error:', error);
                    addMessage(res.default, 'bot');
                }
            } else {
                isAwaitingCropName = true;
                addMessage(getOptionsHTML({ question: res.ask_crop_price, options: commonCrops }, 'crop-price-option', 'getMarketPrices'), 'bot');
            }
        }

        function sendSoilType(type) {
            isAwaitingSoilType = false;
            const res = translations[userLanguage] || translations['en'];
            
            const clickedType = res['soil-types'].options.find(opt => opt.toLowerCase() === type.toLowerCase()) || type;
            const userSelectionPrefix = res.user_selection_prefix || "You selected:";
            addMessage(`${userSelectionPrefix} *${clickedType}*`, 'user');

            const optionIndex = res['soil-types'].options.findIndex(opt => opt.toLowerCase() === type.toLowerCase());

            if (conversationFlow === 'fertilizerGuidance') {
                const adviceKeys = ['fertilizer_alluvial', 'fertilizer_black', 'fertilizer_red', 'fertilizer_laterite', 'fertilizer_arid', 'fertilizer_forest'];
                let advice = res['default'];
                if (optionIndex !== -1) {
                    advice = res[adviceKeys[optionIndex]];
                }
                addMessage(advice, 'bot');

            } else { // Default flow is cropSelection
                const recommendationKeys = ['crop_rec_alluvial', 'crop_rec_black', 'crop_rec_red', 'crop_rec_laterite', 'crop_rec_arid', 'crop_rec_forest'];
                let recommendation = res['crop_rec_default'];
                if (optionIndex !== -1) {
                    recommendation = res[recommendationKeys[optionIndex]];
                }
                
                const finalMessage = (res.crop_rec_template || "Based on your location and **{soil}** soil, {recommendation}")
                    .replace('{soil}', clickedType)
                    .replace('{recommendation}', recommendation);
                
                addMessage(finalMessage, 'bot');
            }
            
            conversationFlow = null;
        }


        function sendPestType(type) {
            isAwaitingPestInfo = false;
            const res = translations[userLanguage] || translations['en'];

            const clickedType = res['common-pests'].options.find(opt => opt.toLowerCase() === type.toLowerCase()) || type;
            addMessage(`${res.user_selection_prefix || 'You selected:'} *${clickedType}*`, 'user');

            const optionIndex = res['common-pests'].options.findIndex(opt => opt.toLowerCase() === type.toLowerCase());

            const solutionKeys = ['pest_advice_aphids', 'pest_advice_whiteflies', 'pest_advice_bollworms', 'pest_advice_stemborers', 'pest_advice_locusts', 'pest_advice_other'];
            let solution = res['default']; 
            if (optionIndex !== -1) {
                solution = res[solutionKeys[optionIndex]];
            }

            const finalMessage = (res.pest_advice_template || "For **{pest}**, {solution}")
                .replace('{pest}', clickedType)
                .replace('{solution}', solution);

            addMessage(finalMessage, 'bot');
        }
