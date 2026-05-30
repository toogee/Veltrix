/**
 * VELTRIX - CLIENT INITIALISATION SUPABASE
 * Fichye sa a jere koneksyon ant navigatè a ak baz de done Supabase la.
 * Li gen yon sistèm entèlijan pou mande Anon Key la dirèkteman nan koòdone a si li pako sove.
 */

const SUPABASE_URL = "https://cphzzxxrvfaqxgyzzebo.supabase.co";

// Chaje kle Anon nan localStorage la
let supabaseAnonKey = localStorage.getItem('veltrix_supabase_anon_key') || "";
let supabase = null;

// Fonksyon pou inisyalize kliyan Supabase la
function initSupabaseClient() {
    if (typeof window.supabase === 'undefined') {
        console.warn("Supabase SDK pako chaje nan paj sa a. Rete tann...");
        return false;
    }
    
    if (!supabaseAnonKey) {
        injectSupabaseKeyModal();
        return false;
    }

    try {
        supabase = window.supabase.createClient(SUPABASE_URL, supabaseAnonKey);
        console.log("Supabase Client konfime ak siksè !");
        return true;
    } catch (error) {
        console.error("Erè nan inisyalizasyon Supabase:", error);
        return false;
    }
}

// Enjekte yon Modal Premium pou mande Supabase Anon Key si li pa la
function injectSupabaseKeyModal() {
    // Si modal la deja la, nou pa fè anyen
    if (document.getElementById('supabase-key-modal')) return;

    const modal = document.createElement('div');
    modal.id = "supabase-key-modal";
    modal.className = "fixed inset-0 bg-darkBg/90 backdrop-blur-md flex items-center justify-center z-[9999] p-4";
    
    modal.innerHTML = `
        <div class="bg-darkCard border border-neonGreen/30 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-[0_0_50px_rgba(204,255,0,0.15)] text-center transform scale-95 transition-all duration-300">
            <div class="w-12 h-12 bg-neonGreen/10 border border-neonGreen/20 rounded-xl flex items-center justify-center mx-auto text-neonGreen text-xl">
                <i class="fa-solid fa-database"></i>
            </div>
            <div class="space-y-1.5">
                <h3 class="font-display font-bold text-lg text-white">Koneksyon Veltrix ak Supabase</h3>
                <p class="text-xs text-slate-400 leading-relaxed">
                    Pou nou kapab konekte sistèm enskripsyon, koneksyon, ak balans Kredi ou yo nan Supabase, tanpri antre **Anon Public Key** pwojè w la bò kote.
                </p>
            </div>
            
            <div class="space-y-3">
                <div class="neon-glow-border bg-darkBg rounded-xl flex items-center px-3.5 py-2.5 gap-2.5">
                    <i class="fa-solid fa-key text-slate-500 text-xs"></i>
                    <input id="supabase-key-input" type="password" placeholder="Antre Supabase Anon Key w la..." class="w-full bg-transparent text-xs text-white focus:outline-none placeholder-slate-600">
                </div>
                <a href="https://supabase.com/dashboard" target="_blank" class="text-[10px] text-neonGreen hover:underline block font-semibold text-right">
                    Kote m ka jwenn kle sa a ? <i class="fa-solid fa-up-right-from-square text-[8px]"></i>
                </a>
            </div>

            <div class="flex gap-3">
                <button onclick="saveSupabaseKey()" class="flex-1 py-3 bg-neonGreen text-darkBg font-display font-bold rounded-xl text-xs hover:scale-[1.01] transition-transform shadow-[0_0_15px_rgba(204,255,0,0.1)]">
                    KONEKTE BAZ DE DONE A
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    
    // Ti animasyon aparisyon dousman
    setTimeout(() => {
        modal.querySelector('.transform').classList.remove('scale-95');
        modal.querySelector('.transform').classList.add('scale-100');
    }, 50);
}

// Sove kle Supabase la
window.saveSupabaseKey = function() {
    const input = document.getElementById('supabase-key-input');
    const key = input.value.trim();
    
    if (!key) {
        alert("Tanpri antre kle Supabase Anon Key la anvan !");
        return;
    }

    localStorage.setItem('veltrix_supabase_anon_key', key);
    supabaseAnonKey = key;
    
    // Inisyalize kliyan an
    const success = initSupabaseClient();
    
    if (success) {
        const modal = document.getElementById('supabase-key-modal');
        if (modal) modal.remove();
        
        // Rafrechi paj la otomatikman pou chaje done yo depi nan Supabase
        window.location.reload();
    } else {
        alert("Erè nan inisyalizasyon. Asire w ke kle a kòrèk !");
    }
};

// Deklanche inisyalizasyon an le pli vit ke script la chaje
window.addEventListener('DOMContentLoaded', () => {
    // Si SDK a pako chaje nèt, nou tcheke apre 100ms
    const checkInterval = setInterval(() => {
        if (typeof window.supabase !== 'undefined') {
            clearInterval(checkInterval);
            initSupabaseClient();
        }
    }, 100);
});
