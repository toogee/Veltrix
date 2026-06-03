/**
 * VELTRIX - INITIALISATION CLIENT SUPABASE
 * Ce fichier gère la connexion entre le navigateur et la base de données Supabase.
 * Il est configuré pour se connecter automatiquement sans modal de configuration.
 */

function isLocalStorageWorking() {
    try {
        localStorage.setItem('__test_storage', '1');
        localStorage.removeItem('__test_storage');
        return true;
    } catch (e) {
        return false;
    }
}

// Wrappers de stockage sécurisés contre les restrictions du protocole local file:///
const safeStorage = {
    getItem(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            return window[`__mem_${key}`] || "";
        }
    },
    setItem(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            window[`__mem_${key}`] = value;
        }
    },
    removeItem(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            delete window[`__mem_${key}`];
        }
    }
};

// AUTO-DÉTECTION ET EXTRACTION DEPUIS L'URL (Fallback ultime pour file:///)
(function() {
    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const urlParam = params.get('sb_url') || hashParams.get('sb_url');
    const keyParam = params.get('sb_key') || hashParams.get('sb_key');
    if (urlParam) safeStorage.setItem('veltrix_supabase_url', urlParam);
    if (keyParam) safeStorage.setItem('veltrix_supabase_anon_key', keyParam);
})();

const DEFAULT_SUPABASE_URL = "https://cphzzxxrvfaqxgyzzebo.supabase.co";
const DEFAULT_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwaHp6eHhydmZhcXhneXp6ZWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNjQzODksImV4cCI6MjA5NTc0MDM4OX0.4xolo6bSh2td55h0dGxRlzxGdeCaIKK8Q13eDke--Cw";

let SUPABASE_URL = safeStorage.getItem('veltrix_supabase_url') || DEFAULT_SUPABASE_URL;
if (SUPABASE_URL === "undefined" || SUPABASE_URL === "null" || SUPABASE_URL === "[object Object]" || SUPABASE_URL === "" || !SUPABASE_URL.startsWith("http")) {
    SUPABASE_URL = DEFAULT_SUPABASE_URL;
    safeStorage.setItem('veltrix_supabase_url', DEFAULT_SUPABASE_URL);
}

// Chargement de la clé Anon depuis le localStorage sécurisé
let supabaseAnonKey = safeStorage.getItem('veltrix_supabase_anon_key') || DEFAULT_SUPABASE_KEY;
// Nettoyage automatique des valeurs invalides de localStorage
if (supabaseAnonKey === "undefined" || supabaseAnonKey === "null" || supabaseAnonKey === "[object Object]" || supabaseAnonKey === "" || supabaseAnonKey.length < 20) {
    supabaseAnonKey = DEFAULT_SUPABASE_KEY;
    safeStorage.setItem('veltrix_supabase_anon_key', DEFAULT_SUPABASE_KEY);
}

window.supabaseClient = null;

// Fonction pour initialiser le client Supabase
function initSupabaseClient() {
    if (typeof window.supabase === 'undefined') {
        console.warn("Le SDK Supabase n'est pas encore chargé sur cette page. Attente...");
        return false;
    }

    try {
        window.supabaseClient = window.supabase.createClient(SUPABASE_URL, supabaseAnonKey);
        
        // Auto-détection d'une instance corrompue/incomplète (auth non disponible)
        if (!window.supabaseClient || !window.supabaseClient.auth) {
            throw new Error("L'instance Supabase créée est incomplète (auth non disponible).");
        }

        console.log("Client Supabase initialisé avec succès !");
        return true;
    } catch (error) {
        console.error("Erreur d'initialisation de Supabase, tentative de restauration par défaut :", error);
        
        try {
            SUPABASE_URL = DEFAULT_SUPABASE_URL;
            supabaseAnonKey = DEFAULT_SUPABASE_KEY;
            safeStorage.setItem('veltrix_supabase_url', DEFAULT_SUPABASE_URL);
            safeStorage.setItem('veltrix_supabase_anon_key', DEFAULT_SUPABASE_KEY);
            
            window.supabaseClient = window.supabase.createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_KEY);
            console.log("Client Supabase restauré et initialisé avec succès avec les identifiants par défaut !");
            return true;
        } catch (innerError) {
            console.error("Échec critique de l'initialisation de Supabase :", innerError);
            window.supabaseClient = null;
            return false;
        }
    }
}

// Version simplifiée et inoffensive de injectSupabaseKeyModal (pas de modal affiché)
function injectSupabaseKeyModal() {
    console.warn("L'affichage du modal Supabase a été court-circuité. Rétablissement des identifiants par défaut...");
    try {
        safeStorage.setItem('veltrix_supabase_url', DEFAULT_SUPABASE_URL);
        safeStorage.setItem('veltrix_supabase_anon_key', DEFAULT_SUPABASE_KEY);
        SUPABASE_URL = DEFAULT_SUPABASE_URL;
        supabaseAnonKey = DEFAULT_SUPABASE_KEY;
        initSupabaseClient();
    } catch (e) {
        console.error("Erreur lors de la réinitialisation automatique :", e);
    }
}

// Enregistrement de la clé Supabase
window.saveSupabaseKey = function() {
    console.warn("saveSupabaseKey appelée manuellement. Utilisation des paramètres par défaut.");
    safeStorage.setItem('veltrix_supabase_url', DEFAULT_SUPABASE_URL);
    safeStorage.setItem('veltrix_supabase_anon_key', DEFAULT_SUPABASE_KEY);
    window.location.reload();
};

// Déclenche l'initialisation dès que le script est chargé
function runSupabaseSetup() {
    // Si le SDK n'est pas encore complètement chargé, on réessaye après 100ms
    const checkInterval = setInterval(() => {
        if (typeof window.supabase !== 'undefined') {
            clearInterval(checkInterval);
            initSupabaseClient();
        }
    }, 100);

    // Auto-propagation des clés dans tous les liens internes pour le fallback file:///
    if (!isLocalStorageWorking() || window.location.protocol === 'file:') {
        const url = safeStorage.getItem('veltrix_supabase_url');
        const key = safeStorage.getItem('veltrix_supabase_anon_key');
        if (url && key) {
            document.querySelectorAll('a').forEach(a => {
                const href = a.getAttribute('href');
                if (href && href.endsWith('.html') && !href.startsWith('http') && !href.startsWith('//')) {
                    const separator = href.includes('?') ? '&' : '?';
                    a.setAttribute('href', href + separator + `sb_url=${encodeURIComponent(url)}&sb_key=${encodeURIComponent(key)}`);
                }
            });
        }
    }
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', runSupabaseSetup);
} else {
    runSupabaseSetup();
}

// Exposition des fonctions pour un contrôle manuel sur toutes les pages
window.injectSupabaseKeyModal = injectSupabaseKeyModal;
window.initSupabaseClient = initSupabaseClient;
