/**
 * VELTRIX - INITIALISATION CLIENT SUPABASE
 * Ce fichier gère la connexion entre le navigateur et la base de données Supabase.
 * Il dispose d'un système intelligent demandant la clé publique Anon directement dans l'interface si elle n'est pas encore enregistrée.
 */

const SUPABASE_URL = "https://cphzzxxrvfaqxgyzzebo.supabase.co";

// Chargement de la clé Anon depuis le localStorage
let supabaseAnonKey = localStorage.getItem('veltrix_supabase_anon_key') || "";
// Nettoyage automatique des valeurs invalides de localStorage
if (supabaseAnonKey === "undefined" || supabaseAnonKey === "null" || supabaseAnonKey === "[object Object]") {
    localStorage.removeItem('veltrix_supabase_anon_key');
    supabaseAnonKey = "";
}
let supabase = null;

// Fonction pour initialiser le client Supabase
function initSupabaseClient() {
    if (typeof window.supabase === 'undefined') {
        console.warn("Le SDK Supabase n'est pas encore chargé sur cette page. Attente...");
        return false;
    }
    
    if (!supabaseAnonKey) {
        injectSupabaseKeyModal();
        return false;
    }

    try {
        // Validation basique de la longueur de la clé Anon
        if (supabaseAnonKey.length < 20) {
            throw new Error("Clé Anon trop courte ou invalide.");
        }

        supabase = window.supabase.createClient(SUPABASE_URL, supabaseAnonKey);
        
        // Auto-détection d'une instance corrompue/incomplète (auth non disponible)
        if (!supabase || !supabase.auth) {
            throw new Error("L'instance Supabase créée est incomplète (auth non disponible).");
        }

        console.log("Client Supabase initialisé avec succès !");
        return true;
    } catch (error) {
        console.error("Erreur d'initialisation de Supabase :", error);
        
        // Réinitialisation automatique du localStorage pour forcer la saisie d'une nouvelle clé
        localStorage.removeItem('veltrix_supabase_anon_key');
        supabaseAnonKey = "";
        supabase = null;
        
        injectSupabaseKeyModal();
        return false;
    }
}

// Injecte un Modal Premium pour demander la clé Anon Supabase si elle est absente
function injectSupabaseKeyModal() {
    // Si le modal est déjà là, on ne fait rien
    if (document.getElementById('supabase-key-modal')) return;

    const currentVal = localStorage.getItem('veltrix_supabase_anon_key') || "";

    const modal = document.createElement('div');
    modal.id = "supabase-key-modal";
    modal.className = "fixed inset-0 bg-darkBg/90 backdrop-blur-md flex items-center justify-center z-[9999] p-4";
    
    modal.innerHTML = `
        <div class="bg-darkCard border border-neonGreen/30 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-[0_0_50px_rgba(204,255,0,0.15)] text-center transform scale-95 transition-all duration-300">
            <div class="w-12 h-12 bg-neonGreen/10 border border-neonGreen/20 rounded-xl flex items-center justify-center mx-auto text-neonGreen text-xl">
                <i class="fa-solid fa-database"></i>
            </div>
            <div class="space-y-1.5">
                <h3 class="font-display font-bold text-lg text-white">Connexion Veltrix & Supabase</h3>
                <p class="text-xs text-slate-400 leading-relaxed">
                    Pour connecter la création de compte, la connexion et les soldes de vos Crédits à Supabase, veuillez saisir la **Clé Publique Anon** de votre projet ci-dessous.
                </p>
            </div>
            
            <div class="space-y-3">
                <div class="neon-glow-border bg-darkBg rounded-xl flex items-center px-3.5 py-2.5 gap-2.5">
                    <i class="fa-solid fa-key text-slate-500 text-xs"></i>
                    <input id="supabase-key-input" type="password" value="${currentVal}" placeholder="Entrez votre clé Anon Supabase..." class="w-full bg-transparent text-xs text-white focus:outline-none placeholder-slate-600">
                </div>
                <a href="https://supabase.com/dashboard" target="_blank" class="text-[10px] text-neonGreen hover:underline block font-semibold text-right">
                    Où puis-je trouver cette clé ? <i class="fa-solid fa-up-right-from-square text-[8px]"></i>
                </a>
            </div>

            <div class="flex gap-3">
                <button onclick="saveSupabaseKey()" class="flex-1 py-3 bg-neonGreen text-darkBg font-display font-bold rounded-xl text-xs hover:scale-[1.01] transition-transform shadow-[0_0_15px_rgba(204,255,0,0.1)]">
                    CONNECTER LA BASE DE DONNÉES
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    
    // Animation d'apparition
    setTimeout(() => {
        modal.querySelector('.transform').classList.remove('scale-95');
        modal.querySelector('.transform').classList.add('scale-100');
    }, 50);
}

// Enregistrement de la clé Supabase
window.saveSupabaseKey = function() {
    const input = document.getElementById('supabase-key-input');
    const key = input.value.trim();
    
    if (!key) {
        alert("Veuillez d'abord entrer votre clé Anon Supabase !");
        return;
    }

    localStorage.setItem('veltrix_supabase_anon_key', key);
    supabaseAnonKey = key;
    
    // Initialisation du client
    const success = initSupabaseClient();
    
    if (success) {
        const modal = document.getElementById('supabase-key-modal');
        if (modal) modal.remove();
        
        // Rafraîchit la page automatiquement pour charger les données depuis Supabase
        window.location.reload();
    } else {
        alert("Erreur d'initialisation. Assurez-vous que la clé est correcte !");
    }
};

// Déclenche l'initialisation dès que le script est chargé
window.addEventListener('DOMContentLoaded', () => {
    // Si le SDK n'est pas encore complètement chargé, on réessaye après 100ms
    const checkInterval = setInterval(() => {
        if (typeof window.supabase !== 'undefined') {
            clearInterval(checkInterval);
            initSupabaseClient();
        }
    }, 100);
});

// Exposition des fonctions pour un contrôle manuel sur toutes les pages
window.injectSupabaseKeyModal = injectSupabaseKeyModal;
window.initSupabaseClient = initSupabaseClient;
