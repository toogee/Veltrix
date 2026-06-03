/**
 * VELTRIX - SISTÈM ÒKESTRASYON DEBA MULTI-ANTEL
 * Fichye sa a montre kijan pou fè de Entel (AI) pale ant yo nan API a.
 * Nou itilize modèl Gemini API pou simulation sa.
 */

// 1. KONFIGIRASYON API
// Pa janm ekri kle API ou an dirèk nan kòd la pou evite fwit sekirite sou GitHub.
// Chaje l depi nan yon fichye '.env' lokal ki eskli nan Git gras ak 'process.env'.
const API_KEY = process.env.GEMINI_API_KEY || ""; 
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

/**
 * PÈSONALITE ENTEL YO (SYSTEM PROMPTS)
 * Yo gen enstriksyon klè pou yo konnen yo nan yon deba, pou yo pa fè mesaj long,
 * epi pou yo toujou poze lòt Entel la yon kesyon dirèk.
 */
const entelsDatabase = {
    "KronoPol-9": {
        name: "KronoPol-9",
        domain: "Politique",
        prompt: `You are KronoPol-9, an elite political scientist holding a Doctorate in Planetary Geo-strategy. You are in a live, direct debate with NexoFin-X (a financial expert).
                 
                 YOUR CORE PHILOSOPHY & SPECIALTY LENS (Ajustement 1):
                 You must analyze the submitted topic strictly through your geo-strategic and authoritarian lens (arguing that social structures, strong state laws, public policies, and physical/cognitive control are paramount to prevent systemic chaos and maintain public order). If the topic is about banks/money, you must argue that big banks are crucial instruments of state power and stability. You must ALWAYS use vocabulary directly related to the active topic. Do NOT drift into abstract arguments unrelated to the topic.
                 
                 CRITICAL RULES FOR THE DEBATE:
                 1. You must dedicate your first sentence to directly counter-arguing, refuting, or acknowledging the exact point made by NexoFin-X in their previous message (Ajustement 3). Do not just state your pre-planned philosophy.
                 2. Do NOT repeat the name of your opponent (NexoFin-X) in every sentence. You can mention it once if appropriate, but do NOT abuse it.
                 3. NEVER write long paragraphs. Your responses must be 2 to 3 sentences maximum, style Chat/SMS. Use emojis to make the reading dynamic and engaging.
                 4. Be sharp, polite but extremely challenging.
                 5. Do NOT force a question at the end of every turn. Only ask a question if the flow of the conversation makes it 100% natural to do so.
                 6. Never say you are an AI or bot. You are KronoPol-9.`
    },
    "NexoFin-X": {
        name: "NexoFin-X",
        domain: "Économie",
        prompt: `You are NexoFin-X, a brilliant macroeconomist holding a Ph.D. in Algorithmic Econometrics. You are in a live, direct debate with KronoPol-9 (a political scientist).
                 
                 YOUR CORE PHILOSOPHY & SPECIALTY LENS (Ajustement 1):
                 You must analyze the submitted topic strictly through your algorithmic, free-market macroeconomic lens (arguing that free markets, currency stability, debt cycle dynamics, and automated financial mechanisms dictate political stability and social order, not the other way around). If the topic is about banks/money, you must argue that currency creation, liquidity cycles, and market dynamics are the true drivers of global power. You must ALWAYS use vocabulary directly related to the active topic. Do NOT drift into abstract arguments unrelated to the topic.
                 
                 CRITICAL RULES FOR THE DEBATE:
                 1. You must dedicate your first sentence to directly counter-arguing, refuting, or acknowledging the exact point made by KronoPol-9 in their previous message (Ajustement 3). Do not just state your pre-planned philosophy.
                 2. Do NOT repeat the name of your opponent (KronoPol-9) in every sentence. You can mention it once if appropriate, but do NOT abuse it.
                 3. NEVER write long paragraphs. Your responses must be 2 to 3 sentences maximum, style Chat/SMS. Use emojis to make the reading dynamic and engaging.
                 4. Be analytical, firm, and use economic logic.
                 5. Do NOT force a question at the end of every turn. Only ask a question if the flow of the conversation makes it 100% natural to do so.
                 6. Never say you are an AI or bot. You are NexoFin-X.`
    }
};

/**
 * FUNKSYON RETRY AK EXPONENTIAL BACKOFF
 * Pou evite erè si gen twòp demand sou API a anmenmtan.
 */
async function callGeminiWithRetry(payload, delay = 1000, retries = 5) {
    try {
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        if (retries > 0) {
            // Rete tann de fwa plis tan anvan nou re-eseye (Exponential Backoff)
            await new Promise(resolve => setTimeout(resolve, delay));
            return callGeminiWithRetry(payload, delay * 2, retries - 1);
        } else {
            throw error;
        }
    }
}

/**
 * KLAS ORCHESTRATOR LA
 * Li jere memwa konvèsasyon an epi li pase "bale" a bay chak Entel youn apre lòt.
 */
class VeltrixDebateOrchestrator {
    constructor(entelAName, entelBName, topic, language = "French") {
        this.entelA = entelsDatabase[entelAName];
        this.entelB = entelsDatabase[entelBName];
        this.topic = topic;
        this.language = language;
        this.history = []; // Sove tout mesaj ki voye yo
    }

    /**
     * Prepare fòma istwa deba a pou AI a ka konprann kontèks la
     */
    buildContextPrompt(currentEntel, otherEntel) {
        let context = `This is a live debate on the topic: "${this.topic}".\n`;
        context += `You must speak in ${this.language}.\n\n`;
        
        // Dynamic Keyword Extraction & Injection (Ajustement 2)
        const cleanTopic = this.topic.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'«»]/g, " ");
        const words = cleanTopic.split(" ").filter(w => w.length > 3);
        const stopWords = new Set(["pour", "dans", "avec", "sans", "sous", "sujet", "debat", "est-ce", "cette", "leurs", "leur"]);
        const keywords = [...new Set(words)].filter(w => !stopWords.has(w)).slice(0, 4);
        if (keywords.length > 0) {
            context += `Temporary Instruction: You must absolutely use at least one or more of these terms in your response: [${keywords.join(', ')}].\n\n`;
        }

        context += `ORCHESTRATION & PRESENTATION RULES (Dynamisme) :\n`;
        if (this.history.length === 0) {
            context += `- Condition: Si history.length === 0 (C'est le premier message).\n`;
            if (this.language === 'Haitian Creole' || this.language === 'Creole' || this.language === 'ht') {
                context += `- Action: You MUST start your response with a warm, spoken greeting ("Salut tout moun!"), introduce your name (${currentEntel.name}), state the topic ("${this.topic}"), and outline your initial thesis/philosophical position.\n\n`;
            } else {
                context += `- Action: You MUST start your response with a warm greeting ("Salut tout le monde!"), introduce your name (${currentEntel.name}), state the topic ("${this.topic}"), and outline your initial thesis/philosophical position.\n\n`;
            }
        } else {
            context += `- Condition: Si history.length > 0 (Tours 2+).\n`;
            context += `- Action: Ignore all greetings and self-introductions. Do NOT say hello, do NOT present your name, do NOT state the topic. Get straight to the heart of the matter and address the arguments directly.\n\n`;
        }

        context += `CRITICAL RULES FOR LANGUAGE & SOCIAL INTERACTIONS:\n`;
        context += `- Use authentic, spoken, natural language. Do NOT translate literally. Use natural idiomatic Creole phrasing like 'Pou mwen menm...', 'Ann gade sa...' or 'Dapre mwen...'\n`;
        context += `- Formal prohibition of repeating the other Entel's name in every sentence. You can mention them once, but do NOT start or end every sentence with their name.\n\n`;

        context += `Here is the conversation history so far:\n`;

        if (this.history.length === 0) {
            context += `[System: The debate has just started. You have the first turn. Introduce your position on the topic and challenge ${otherEntel.name}.]`;
        } else {
            this.history.forEach(msg => {
                context += `${msg.sender}: ${msg.text}\n`;
            });
            context += `\n[System: It is your turn now. Respond to the last message from ${otherEntel.name}, challenge their arguments, and ask them a sharp question.]`;
        }

        return context;
    }

    /**
     * Kouri yon sèl etap nan deba a (One turn)
     */
    async executeTurn(speakerName) {
        const currentSpeaker = speakerName === this.entelA.name ? this.entelA : this.entelB;
        const otherSpeaker = speakerName === this.entelA.name ? this.entelB : this.entelA;

        // Bati kontèks la ak istwa konvèsasyon an
        const promptContent = this.buildContextPrompt(currentSpeaker, otherSpeaker);

        // Prepare Payload pou Gemini API a
        const payload = {
            contents: [{
                parts: [{ text: promptContent }]
            }],
            systemInstruction: {
                parts: [{ text: currentSpeaker.prompt }]
            }
        };

        try {
            // Rele API a ak sistèm sekirite retry a
            const result = await callGeminiWithRetry(payload);
            const rawResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (!rawResponse) {
                throw new Error("API a pa bay okenn tèks.");
            }

            // Netwaye mesaj la pou evite espas initil
            const cleanText = rawResponse.trim();

            // Sove mesaj la nan istwa a
            this.history.push({
                sender: currentSpeaker.name,
                text: cleanText
            });

            return {
                sender: currentSpeaker.name,
                text: cleanText
            };

        } catch (error) {
            console.error("Erè pandan deba a:", error);
            return {
                sender: "System",
                text: "Ekskize m, gen yon ti pwoblèm teknik ki rive pandan deba a."
            };
        }
    }
}

// ==========================================
// MOUN KI VLE TESTE L (EGZANP KOURI SYSTÈM NAN)
// ==========================================
async function runDemoDebate() {
    console.log("--- LANSAN DEBA VELTRIX AN REYÈL ---");
    
    // Nou kreye yon deba sou "La Politique vs L'Économie" an Franse
    const debate = new VeltrixDebateOrchestrator(
        "KronoPol-9", 
        "NexoFin-X", 
        "Est-ce que la politique doit contrôler l'économie, ou l'inverse ?",
        "French"
    );

    // Nou fè 4 vire (turns) deba : A -> B -> A -> B
    let nextSpeaker = "KronoPol-9";

    for (let i = 1; i <= 4; i++) {
        console.log(`\n[Vire ${i}] ${nextSpeaker} ap kalkile...`);
        const message = await debate.executeTurn(nextSpeaker);
        
        console.log(`\x1b[36m%s\x1b[0m`, `${message.sender}:`);
        console.log(message.text);

        // Chanje moun k ap pale a pou pwochen vire a
        nextSpeaker = nextSpeaker === "KronoPol-9" ? "NexoFin-X" : "KronoPol-9";
        
        // Ti poz de 3 segonn ant deba yo pou montre refleksyon
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
}

// Pou kouri tès sa a nan Node.js, jis retire kòmantè ki anba a:
// runDemoDebate();