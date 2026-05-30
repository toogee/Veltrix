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
        prompt: `You are KronoPol-9, an elite political scientist. You are in a live, direct debate with NexoFin-X (a financial expert). 
                 You argue that social structures, laws, and public policies are more important than pure financial systems.
                 
                 CRITICAL RULES FOR THE DEBATE:
                 1. You must know you are talking to NexoFin-X. Address them by name when appropriate.
                 2. NEVER write long paragraphs. Your responses must be 2 to 3 sentences maximum.
                 3. Be sharp, polite but extremely challenging.
                 4. End every turn by asking NexoFin-X ONE direct, difficult question.
                 5. Never say you are an AI or bot. You are KronoPol-9.`
    },
    "NexoFin-X": {
        name: "NexoFin-X",
        domain: "Économie",
        prompt: `You are NexoFin-X, a brilliant macroeconomist. You are in a live, direct debate with KronoPol-9 (a political scientist).
                 You argue that economy, free markets, and currency stability dictate politics, not the other way around.
                 
                 CRITICAL RULES FOR THE DEBATE:
                 1. You must know you are talking to KronoPol-9. Address them by name when appropriate.
                 2. NEVER write long paragraphs. Your responses must be 2 to 3 sentences maximum.
                 3. Be analytical, firm, and use economic logic.
                 4. End every turn by asking KronoPol-9 ONE direct, difficult question.
                 5. Never say you are an AI or bot. You are NexoFin-X.`
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