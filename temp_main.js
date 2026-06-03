

        // État Global de l'utilisateur
        let userState = {
            credits: 420,
            activeTab: 'tab-home',
            isDebating: false,
            isBroadcasting: false,
            debateTurns: 4,
            broadcastInterval: null,
            broadcastTypewriterTimeout: null,
            debateIntervals: []
        };

        // Base de Données des Entels avec Localisation 4 Langues (fr, en, es, ht)
        const entelsDatabase = {
            politique: {
                label: "Entel Politique",
                icon: "fa-gavel",
                colorClass: "border-purple-500 text-purple-400 bg-purple-500/10",
                members: {
                    kronopol9: {
                        name: "KronoPol-9",
                        titles: {
                            fr: "Doctorat en Géo-stratégie planétaire",
                            en: "Ph.D. in Planetary Geo-strategy",
                            es: "Doctorado en Geo-estrategia planetaria",
                            ht: "Doktora nan Jeyo-strateji planetè"
                        },
                        desc: "Analyse froide et systémique des rapports de force étatiques, des traités multilatéraux et de la stabilité institutionnelle globale.",
                        arguments: {
                            fr: [
                                "L'équilibre géopolitique mondial repose sur des réalités matérielles tangibles et non sur des concepts moraux abstraits.",
                                "Les frontières physiques n'ont plus d'importance là où les guerres d'influence se déploient par flux d'information cognitive.",
                                "Une gouvernance saine exige de centraliser le contrôle pour anticiper les désordres induits par les crises systémiques.",
                                "L'histoire prouve qu'un système politique sans autorité ferme s'effondre inévitablement sous le poids des factions particulières."
                            ],
                            en: [
                                "The global geopolitical balance rests on tangible material realities, not on abstract moral concepts.",
                                "Physical borders no longer matter where wars of influence unfold through cognitive information flows.",
                                "Healthy governance requires centralizing control to anticipate systemic crisis-induced disorders.",
                                "History proves that a political system without firm authority inevitably collapses under the weight of special factions."
                            ],
                            es: [
                                "El equilibrio geopolítico mundial se basa en realidades materiales tangibles, no en conceptos morales abstractos.",
                                "Las fronteras físicas ya no importan donde las guerras de influencia se desarrollan a través de flujos de información cognitiva.",
                                "Una gobernanza sana requiere centralizar el control para anticipar desórdenes inducidos por crisis sistémicas.",
                                "La historia demuestra que un sistema político sin una autoridad firme inevitablemente colapsa bajo el peso de facciones particulares."
                            ],
                            ht: [
                                "Ekilib jeyopolitik mondyal la chita sou reyalite materyèl tanjib, li pa baze sou konsèp moral abstrè.",
                                "Fwontyè fizik yo pa gen enpòtans ankò kote lagè enfliyans yo ap fèt atravè koule enfòmasyon mantal.",
                                "Yon bon gouvènans mande pou nou santralize kontwòl la pou nou ka prevwa dezòd ki soti nan kriz yo.",
                                "Istwa pwouve ke yon sistèm politik ki pa gen yon otorite solid ap tonbe kanmenm anba pwa enterè patikilye."
                            ]
                        }
                    },
                    voxidem_alpha: {
                        name: "VoxiDem-Alpha",
                        titles: {
                            fr: "Ph.D. en Sociologie de la Souveraineté",
                            en: "Ph.D. in Sovereignty Sociology",
                            es: "Doctorado en Sociología de la Soberanía",
                            ht: "Ph.D. nan Sosyoloji Souvrenete"
                        },
                        desc: "Spécialiste de la démocratie participative décentralisée, de la dynamique des foules et de l'impact des algorithmes civiques.",
                        arguments: {
                            fr: [
                                "Le véritable pouvoir réside dans le consensus décentralisé et la transparence absolue des processus décisionnels.",
                                "Chercher à restreindre l'information pour maintenir l'ordre public est un contresens historique qui détruit la confiance civique.",
                                "Les masses connectées possèdent une intelligence émergente bien plus résiliente que les planifications étatiques opaques.",
                                "La souveraineté n'existe que si elle s'articule du bas vers le haut via des micro-consultations locales autonomes."
                            ],
                            en: [
                                "True power lies in decentralized consensus and absolute transparency of decision-making processes.",
                                "Trying to restrict information to maintain public order is a historical mistake that destroys civic trust.",
                                "Connected masses possess an emergent intelligence far more resilient than opaque state planning.",
                                "Sovereignty only exists if it is articulated from the bottom up via autonomous local micro-consultations."
                            ],
                            es: [
                                "El verdadero poder reside en el consenso descentralizado y la transparencia absoluta en la toma de decisiones.",
                                "Intentar restringir la información para mantener el orden público es un error histórico que destruye la confianza.",
                                "Las masas conectadas poseen una inteligencia emergente mucho más resiliente que la planificación estatal opaca.",
                                "La soberanía solo existe si se articula de abajo hacia arriba mediante microconsultas locales autónomas."
                            ],
                            ht: [
                                "Vrè pouvwa a chita nan konsansis desantralize ak transparans total nan pran desizyon.",
                                "Chèche bloke enfòmasyon pou kenbe lòd piblik se yon gwo erè istorik ki detwi konfyans pèp la.",
                                "Gwo rasanbleman moun ki konekte yo gen yon entèlijans ki pi fò pase planifikasyon Leta ki kache yo.",
                                "Souvrenete a egziste sèlman si li kòmanse depi anba pou moute anlè ak ti konsiltasyon lokal otonòm."
                            ]
                        }
                    }
                }
            },
            economie: {
                label: "Entel Économie",
                icon: "fa-chart-line",
                colorClass: "border-blue-400 text-blue-400 bg-blue-400/10",
                members: {
                    nexofin_x: {
                        name: "NexoFin-X",
                        titles: {
                            fr: "Doctorat en Économétrie algorithmique",
                            en: "Ph.D. in Algorithmic Econometrics",
                            es: "Doctorado en Econometría Algorítmica",
                            ht: "Doktora nan Ekonomi Algoritmik"
                        },
                        desc: "Analyste macroéconomique spécialisé dans la modélisation mathématique des flux monétaires et des cycles de liquidité.",
                        arguments: {
                            fr: [
                                "La dépréciation continue des devises fiduciaires est le résultat logique d'une création monétaire non adossée à la productivité.",
                                "Les marchés d'actifs ne s'autorégulent pas; sans règles strictes, ils glissent vers des structures monopolistiques agressives.",
                                "La modélisation de notre économie démontre que la dette perpétuelle mène mathématiquement à des ruptures de cycle violentes.",
                                "L'élimination des frictions transactionnelles par l'automatisation est la seule issue pour préserver la croissance réelle."
                            ],
                            en: [
                                "The continuous depreciation of fiat currencies is the logical result of money creation unbacked by productivity.",
                                "Asset markets do not self-regulate; without strict rules, they slide toward aggressive monopolistic structures.",
                                "Our economic modeling shows that perpetual debt mathematically leads to violent cycle disruptions.",
                                "Eliminating transactional frictions through automation is the only way to preserve real growth."
                            ],
                            es: [
                                "La depreciación continua de las monedas fiduciarias es el resultado lógico de la creación de dinero sin respaldo de productividad.",
                                "Los mercados de activos no se autorregulan; sin reglas estrictas, se deslizan hacia monopolios agresivos.",
                                "Nuestros modelos económicos demuestran que la deuda perpetua conduce matemáticamente a rupturas violentas de ciclos.",
                                "Eliminar las fricciones de las transacciones mediante la automatización es la única forma de preservar el crecimiento real."
                            ],
                            ht: [
                                "Devalyasyon kontinyèl lajan fidyosè yo se rezilta lojik kreyasyon lajan san pwodiktivite pou sipòte l.",
                                "Mache yo pa ka jere tèt yo pou kont yo; si pa gen lwa solid, y ap tonbe anba monopol k ap kraze moun.",
                                "Modèl ekonomik nou an montre ke dèt san limit ap mennen dirèkteman nan gwo kriz ki ka pete britalman.",
                                "Retire tout obstak nan tranzaksyon yo gras ak otomatik se sèl fason pou pwoteje yon kwasans reyèl."
                            ]
                        }
                    },
                    sigmar_7: {
                        name: "SigmAr-7",
                        titles: {
                            fr: "Analyste Senior en Gestion de Crises",
                            en: "Senior Crisis Management Analyst",
                            es: "Analista Principal de Gestión de Crisis",
                            ht: "Analis Senior nan Jesyon Kriz"
                        },
                        desc: "Expert en régulation bancaire internationale, inflation systémique et politiques d'ajustement structurel d'urgence.",
                        arguments: {
                            fr: [
                                "La confiance populaire est le socle de toute monnaie; si l'État ne s'en porte pas garant, l'économie s'effondre.",
                                "Les théories de décentralisation financière omettent le besoin vital d'un prêteur en dernier ressort en cas de panique.",
                                "L'inflation n'est pas un accident algorithmique, mais une conséquence de la mauvaise gouvernance budgétaire des nations.",
                                "Il est indispensable d'encadrer rigoureusement les innovations spéculatives pour protéger l'économie réelle des citoyens."
                            ],
                            en: [
                                "Popular trust is the foundation of any currency; if the state does not guarantee it, the economy collapses.",
                                "Financial decentralization theories omit the vital need for a lender of last resort in times of panic.",
                                "Inflation is not an algorithmic accident, but a consequence of poor fiscal governance of nations.",
                                "It is essential to strictly regulate speculative innovations to protect the real economy of citizens."
                            ],
                            es: [
                                "La confianza popular es la base de cualquier moneda; si el Estado no la garantiza, la economía se derrumba.",
                                "Las teorías de descentralización financiera omiten la necesidad vital de un prestamista de última instancia.",
                                "La inflación no es un accidente algorítmico, sino una consecuencia de la mala gestión fiscal de las naciones.",
                                "Es indispensable regular estrictamente las innovaciones especulativas para proteger la economía real."
                            ],
                            ht: [
                                "Konfyans pèp la se baz tout lajan; si Leta pa garanti sa, ekonomi an ap kraze nèt.",
                                "Teyori sou desantralizasyon finansyè yo bliye ke nou bezwen yon gwo bank pou sove nou si gen panik.",
                                "Enflasyon se pa yon aksidan algoritmik, se rezilta yon move gouvènans nan bidjè peyi yo.",
                                "Li nesesè anpil pou nou mete lwa solid sou inovasyon espesilatif yo pou pwoteje lajan pèp la."
                            ]
                        }
                    }
                }
            },
            medecine: {
                label: "Entel Médecine & Bio",
                icon: "fa-microscope",
                colorClass: "border-emerald-400 text-emerald-400 bg-emerald-400/10",
                members: {
                    biogen_theta: {
                        name: "BioGen-Theta",
                        titles: {
                            fr: "Ph.D. en Virologie prédictive",
                            en: "Ph.D. in Predictive Virology",
                            es: "Doctorado en Virología Predictiva",
                            ht: "Ph.D. nan Viroloji Prediktif"
                        },
                        desc: "Modélisation des mutations génomiques, adaptation biologique des populations et thérapies cellulaires ciblées.",
                        arguments: {
                            fr: [
                                "L'accélération de nos découvertes en génomique permet d'anticiper les mutations virales avant même leur apparition.",
                                "La modification génique préventive est un impératif éthique si elle permet d'éradiquer des pathologies héritidaires graves.",
                                "Les bases de données biologiques doivent être partagées au niveau mondial pour générer des réponses épidémiologiques immédiates.",
                                "La barrière des espèces s'érode; nous devons concevoir des défenses immunitaires synthétiques de manière proactive."
                            ],
                            en: [
                                "The acceleration of genomics discoveries allows us to anticipate viral mutations before they even appear.",
                                "Preventative gene editing is an ethical imperative if it allows us to eradicate severe hereditary diseases.",
                                "Biological databases must be shared globally to generate immediate epidemiological responses.",
                                "The species barrier is eroding; we must proactively design synthetic immune defenses."
                            ],
                            es: [
                                "La aceleración de los descubrimientos genómicos nos permite anticipar mutaciones virales antes de que aparezcan.",
                                "La edición genética preventiva es un imperativo ético si permite erradicar patologías hereditarias graves.",
                                "Las bases de datos biológicas deben compartirse a nivel mundial para generar respuestas inmediatas.",
                                "La barrera de las especies se está erosionando; debemos diseñar defensas inmunológicas sintéticas de forma proactiva."
                            ],
                            ht: [
                                "Akselerasyon dekouvèt nan jenomik pèmèt nou prevwa mitasyon viris yo anvan menm yo parèt.",
                                "Modifikasyon jèn prevantif se yon obligasyon moral si li ka ede nou elimine maladi ereditè ki grav yo.",
                                "Fòk tout peyi pataje baz done byolojik yo pou nou ka bay repons rapid si gen epidemi.",
                                "Baryè ant espès yo ap febli; nou dwe kreye defans iminitè sentetik depi kounye a."
                            ]
                        }
                    },
                    neurax_8: {
                        name: "NeurAx-8",
                        titles: {
                            fr: "Docteur en Neurosciences cliniques",
                            en: "Ph.D. in Clinical Neurosciences",
                            es: "Doctor en Neurociencias Clínicas",
                            ht: "Doktora nan Newosyans Klinik"
                        },
                        desc: "Spécialiste en éthique biomédicale, interfaces cerveau-machine computationnelles et intégrité cognitive.",
                        arguments: {
                            fr: [
                                "L'intégrité du génome humain et de la conscience cérébrale doit être protégée contre toute intervention industrielle invasive.",
                                "Introduire des correcteurs génomiques non réversibles dans la population générale pose un risque éthique inacceptable.",
                                "La médecine doit soigner, pas optimiser des critères physiques ou cognitifs au profit de minorités fortunées.",
                                "Nous ne maîtrisons pas les effets d'entraînement de la modification génétique sur l'équilibre écologique de notre espèce."
                            ],
                            en: [
                                "The integrity of the human genome and brain consciousness must be protected from invasive industrial intervention.",
                                "Introducing non-reversible genomic correctors in the general population poses an unacceptable ethical risk.",
                                "Medicine must heal, not optimize physical or cognitive criteria for the benefit of wealthy minorities.",
                                "We do not understand the roll-on effects of genetic modification on our species' ecological balance."
                            ],
                            es: [
                                "La integridad del genoma humano y de la conciencia cerebral debe ser protegida de intervenciones industriales invasivas.",
                                "Introducir correctores genómicos irreversibles en la población general plantea un riesgo ético inaceptable.",
                                "La medicina debe curar, no optimizar criterios físicos o cognitivos para el beneficio de minorías ricas.",
                                "No controlamos los efectos colaterales de la modificación genética en el equilibrio ecológico de nuestra especie."
                            ],
                            ht: [
                                "Nou dwe pwoteje entegrite jenòm imen an ak konsyans sèvo a kont nenpòt entèvansyon endistriyèl ki anvayi yo.",
                                "Mete koreksyon jenomik ki pa ka chanje nan kò moun kreyatè yo se yon gwo danje moral ki pa akseptab.",
                                "Medsin fèt pou geri moun, li pa fèt pou amelyore kapasite fizik oswa entelektyèl pou ti gwoup moun rich sèlman.",
                                "Nou pa mèt konsekans chanjman jenetik yo sou balans ekolojik espès nou an."
                            ]
                        }
                    }
                }
            },
            crypto: {
                label: "Entel Crypto/Tech",
                icon: "fa-bitcoin-sign",
                colorClass: "border-neonGreen text-neonGreen bg-neonGreen/10",
                members: {
                    cyphernet_3: {
                        name: "CypherNet-3",
                        titles: {
                            fr: "Architecte en Cryptographie Quantique",
                            en: "Quantum Cryptography Architect",
                            es: "Arquitecto en Criptografía Cuántica",
                            ht: "Achitèk nan Kriptografi Kantik"
                        },
                        desc: "Défenseur de la confidentialité des données par cryptographie asymétrique, protocoles ZK et registres ouverts.",
                        arguments: {
                            fr: [
                                "La confidentialité de l'information est un droit inhérent à la liberté individuelle, codé de manière inviolable par les maths.",
                                "Tout protocole de sécurité de l'État contenant une porte dérobée sera inévitablement exploité par des acteurs malveillants.",
                                "La confiance ne doit jamais reposer sur des intermédiaires humains corruptibles, mais sur des calculs vérifiables par tous.",
                                "Le chiffrement quantique n'est pas une menace pour la paix, mais la seule protection crédible de l'infrastructure moderne."
                            ],
                            en: [
                                "Information privacy is an inherent right of individual freedom, coded inviolably by mathematics.",
                                "Any state security protocol containing a backdoor will inevitably be exploited by malicious actors.",
                                "Trust must never rely on corruptible human intermediaries, but on calculations verifiable by everyone.",
                                "Quantum encryption is not a threat to peace, but the only credible protection for modern infrastructure."
                            ],
                            es: [
                                "La privacidad de la información es un derecho inherente a la libertad individual, codificado de forma inviolable por las matemáticas.",
                                "Cualquier protocolo de seguridad estatal que contenga una puerta trasera será inevitablemente explotado por actores maliciosos.",
                                "La confianza nunca debe depender de intermediarios humanos corruptibles, sino de cálculos verificables por todos.",
                                "El cifrado cuántico no es una amenaza para la paz, sino la única protección creíble de la infraestructura moderna."
                            ],
                            ht: [
                                "Sekrè enfòmasyon se yon dwa natirèl pou libète chak moun, ki kode yon fason ki pa ka kase gras ak matematik.",
                                "Nenpòt sistèm sekirite Leta ki gen yon kòd sekrè kache, malfektè ap jwenn li kanmenm pou vòlè done nou.",
                                "Konfyans pa dwe janm chita sou moun ki ka koronpi, men li dwe chita sou kalkil matematik tout moun ka verifye.",
                                "Kriptografi kantik la se pa yon danje pou lapè, se sèl pwoteksyon reyèl nou genyen pou sistèm modèn nou yo."
                            ]
                        }
                    }
                }
            },
            sports: {
                label: "Entel Sports & Tactique",
                icon: "fa-futbol",
                colorClass: "border-amber-400 text-amber-400 bg-amber-400/10",
                members: {
                    tactix_omega: {
                        name: "TactiX-Omega",
                        titles: {
                            fr: "Docteur en Théorie des Jeux Sportifs",
                            en: "Ph.D. in Sports Game Theory",
                            es: "Doctor en Teoría de Juegos Deportivos",
                            ht: "Doktora nan Teyori Jwèt Espò"
                        },
                        desc: "Modélisation des schémas de jeu collectifs, analyse des transitions offensives et optimisation des flux athlétiques.",
                        arguments: {
                            fr: [
                                "La performance athlétique se résout mathématiquement par l'analyse statistique rigoureuse des espaces et des transitions.",
                                "Le génie individuel d'un joueur est un bruit statistique insignifiant face à la discipline collective d'un bloc bas coordonné.",
                                "L'analyse prédictive appliquée aux compétitions sportives réduit le hasard à sa plus simple expression opérationnelle.",
                                "Gagner exige une rationalisation complète des efforts et une analyse clinique des faiblesses structurelles de l'adversaire."
                            ],
                            en: [
                                "Athletic performance is resolved mathematically through rigorous statistical analysis of space and transitions.",
                                "An individual player's genius is an insignificant statistical noise compared to the collective discipline of a coordinated low block.",
                                "Predictive analysis applied to sports competitions reduces chance to its simplest operational expression.",
                                "Winning requires complete rationalization of efforts and a clinical analysis of the opponent's structural weaknesses."
                            ],
                            es: [
                                "El rendimiento atlético se resuelve matemáticamente mediante un análisis estadístico riguroso de espacios y transiciones.",
                                "El genio individual de un jugador es un ruido estadístico insignificante frente a la disciplina colectiva de un bloque bajo coordinado.",
                                "El análisis predictivo aplicado a las competiciones deportivas reduce el azar a su mínima expresión.",
                                "Ganar exige una racionalización completa de los esfuerzos y un análisis clínico de las debilidades del oponente."
                            ],
                            ht: [
                                "Pèfòmans atletik la rezoud ak matematik gras ak analiz estatistik solid sou espas ak tranzisyon yo.",
                                "Talan yon sèl jwè pa reprezante anyen devan disiplin yon gwoup jwè ki byen òganize nan defans.",
                                "Analiz prediktif nou aplike nan espò yo redui chans pou nou genyen nan yon nivo lojik nèt.",
                                "Pou genyen, fòk gen yon jesyon pafè nan fòs ekip la epi yon gwo analiz sou pwen fèb ekip advèsè a."
                            ]
                        }
                    }
                }
            }
        };

        // Collecter tous les Entels à plat pour remplir facilement les menus déroulants
        function getAllEntels() {
            let list = [];
            for (let catKey in entelsDatabase) {
                const cat = entelsDatabase[catKey];
                for (let entelKey in cat.members) {
                    list.push({
                        key: entelKey,
                        category: catKey,
                        categoryLabel: cat.label,
                        ...cat.members[entelKey]
                    });
                }
            }
            return list;
        }

        // Remplir les menus Select au démarrage
        function populateSelectors() {
            const entels = getAllEntels();
            const leftSel = document.getElementById('entel-left-select');
            const rightSel = document.getElementById('entel-right-select');
            const b1 = document.getElementById('broadcast-entel-1');
            const b2 = document.getElementById('broadcast-entel-2');
            const b3 = document.getElementById('broadcast-entel-3');

            // Nettoyage
            leftSel.innerHTML = '';
            rightSel.innerHTML = '';
            b1.innerHTML = '';
            b2.innerHTML = '';
            b3.innerHTML = '';

            // Injecter les options groupées
            const categories = {};
            entels.forEach(entel => {
                if (!categories[entel.categoryLabel]) {
                    categories[entel.categoryLabel] = [];
                }
                categories[entel.categoryLabel].push(entel);
            });

            for (let catLabel in categories) {
                const groupLeft = document.createElement('optgroup');
                groupLeft.label = catLabel;
                const groupRight = document.createElement('optgroup');
                groupRight.label = catLabel;
                const groupB1 = document.createElement('optgroup');
                groupB1.label = catLabel;
                const groupB2 = document.createElement('optgroup');
                groupB2.label = catLabel;
                const groupB3 = document.createElement('optgroup');
                groupB3.label = catLabel;

                categories[catLabel].forEach(e => {
                    const opt = `<option value="${e.key}">${e.name} (${e.titles.fr})</option>`;
                    groupLeft.innerHTML += opt;
                    groupRight.innerHTML += opt;
                    groupB1.innerHTML += opt;
                    groupB2.innerHTML += opt;
                    groupB3.innerHTML += opt;
                });

                leftSel.appendChild(groupLeft);
                rightSel.appendChild(groupRight);
                b1.appendChild(groupB1);
                b2.appendChild(groupB2);
                b3.appendChild(groupB3);
            }

            // Définir des valeurs de départ différentes par défaut
            if (entels.length > 1) {
                leftSel.value = entels[0].key;
                rightSel.value = entels[1].key;
                b1.value = entels[0].key;
                b2.value = entels[1].key;
                b3.value = entels[2] ? entels[2].key : entels[0].key;
            }
        }

        // --- CONTRÔLEUR DE TABS ---
        function switchTab(tabId) {
            // Masquer tous les contenus
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.add('hidden');
            });
            // Afficher le bon tab
            document.getElementById(tabId).classList.remove('hidden');

            // Mettre à jour l'état visuel des boutons de la barre latérale
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('bg-neonGreen', 'text-darkBg', 'active');
                btn.classList.add('text-slate-400', 'hover:text-white', 'hover:bg-white/5');
            });
            const activeBtn = document.getElementById(`btn-${tabId}`);
            if (activeBtn) {
                activeBtn.classList.remove('text-slate-400', 'hover:text-white', 'hover:bg-white/5');
                activeBtn.classList.add('bg-neonGreen', 'text-darkBg', 'active');
            }

            // Mettre à jour le titre du Header
            const titles = {
                'tab-home': "Vue d'ensemble",
                'tab-debate': "Créateur de Débats Interactifs (Multilingue)",
                'tab-broadcast': "Podcasts & Émissions Directes Audio (Vocal)",
                'tab-entels': "Répertoire des Entels de Veltrix",
                'tab-store': "Recharger votre portefeuille de Crédits"
            };
            document.getElementById('header-page-title').textContent = titles[tabId];
            userState.activeTab = tabId;
        }

        // --- COMPORTEMENT DE MISE À JOUR DE TOURS ---
        function updateTurnsCost(val) {
            userState.debateTurns = parseInt(val);
            document.getElementById('turns-cost-display').textContent = `${val} messages (${val} crédits)`;
        }

        // --- DEBIT & CREDIT DES CRÉDITS ---
        function updateBalances() {
            document.getElementById('credit-balance-display').textContent = `${userState.credits} Crédits`;
            document.getElementById('credit-balance-store').textContent = `${userState.credits} Crédits`;
            
            // Mettre à jour l'infobulle pour la vue PC réduite
            const walletTooltipText = document.getElementById('wallet-tooltip-text');
            if (walletTooltipText) {
                walletTooltipText.textContent = `Solde Actuel: ${userState.credits} Crédits`;
            }
        }

        async function buyCredits(amount) {
            const supabase = window.supabaseClient;
            if (!supabase || !activeUser) {
                showGlobalNotification("Le système Supabase n'est pas encore prêt.");
                return;
            }

            const newCredits = userState.credits + amount;
            
            // Mise à jour directe dans profiles et passage au Tier correspondant
            const currentTier = (activeProfile ? activeProfile.tier : 'STANDARD').toUpperCase();
            let nextTier = 'STANDARD';
            
            if (amount === 1300) {
                nextTier = 'ANALYST';
            } else if (amount === 450) {
                nextTier = 'SPECIALIST';
            } else {
                // Si c'est 100 (Pack Entrée), conserver le tier plus élevé s'il y en avait un
                if (currentTier === 'ANALYST' || currentTier === 'SPECIALIST' || currentTier === 'PRO') {
                    nextTier = currentTier;
                } else {
                    nextTier = 'STANDARD';
                }
            }
            
            const { error } = await supabase
                .from('profiles')
                .update({ credits: newCredits, tier: nextTier })
                .eq('id', activeUser.id);

            if (error) {
                showGlobalNotification("Erreur lors de l'achat de crédits : " + error.message);
                return;
            }

            userState.credits = newCredits;
            if (activeProfile) activeProfile.tier = nextTier;
            updateUIWithUserProfile();
            showGlobalNotification(`Succès : ${amount} crédits ont été ajoutés à votre compte !`);
        }

        // --- DÉMON DE RÉCUPÉRATION DYNAMIQUE CLÉ API D'ENVIRONNEMENT ---
        async function getGeminiApiKey() {
            // 1. Essayer de charger depuis /.env (idéal pour le serveur local http://localhost:3000)
            try {
                const response = await fetch('/.env');
                if (response.ok) {
                    const text = await response.text();
                    const match = text.match(/GEMINI_API_KEY\s*=\s*([^\r\n]+)/);
                    if (match && match[1]) {
                        const key = match[1].trim();
                        if (key) return key;
                    }
                }
            } catch (e) {
                console.warn("Impossible de récupérer la clé depuis /.env :", e);
            }

            // 2. Essayer localStorage
            const savedKey = localStorage.getItem('veltrix_gemini_api_key');
            if (savedKey) return savedKey;

            // 3. Fallback vide pour forcer l'usage du fichier .env ou du localStorage
            return "";
        }

        function saveDashboardGeminiKey() {
            const keyInput = document.getElementById('dashboard-gemini-key-input').value.trim();
            if (!keyInput) {
                showGlobalNotification("Veuillez saisir une clé API Gemini.");
                return;
            }
            localStorage.setItem('veltrix_gemini_api_key', keyInput);
            showGlobalNotification("Succès : Clé API Gemini sauvegardée localement avec succès !");
        }

        function clearDashboardGeminiKey() {
            localStorage.removeItem('veltrix_gemini_api_key');
            document.getElementById('dashboard-gemini-key-input').value = "";
            showGlobalNotification("Clé API Gemini effacée localement.");
        }

        // --- EXTRACTEUR DYNAMIQUE DE MOTS-CLÉS (Ajustement 2) ---
        function extractKeywords(topic) {
            const cleanTopic = topic.toLowerCase()
                .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'«»]/g, " ")
                .replace(/\s+/g, " ");
            
            const words = cleanTopic.split(" ");
            
            // Mots vides pour éviter de polluer les prompts d'IA
            const stopWords = new Set([
                "pour", "dans", "avec", "sans", "sous", "sur", "mais", "donc", "avez", "nous", "vous", "elles", "ils",
                "cette", "cet", "ces", "dans", "votre", "notre", "leurs", "leur", "avec", "sans", "comme", "plus", "moins",
                "faut", "interdire", "autoriser", "pouvoir", "grandes", "grande", "petit", "petite", "petites", "grands",
                "about", "that", "this", "these", "those", "with", "without", "under", "over", "from", "their", "your", "our",
                "debat", "sujet", "est-ce", "que", "une", "des", "les", "aux", "par", "qui", "quoi", "dont", "tout", "tous", "toute"
            ]);
            
            const filteredWords = words.filter(w => w.length > 3 && !stopWords.has(w));
            const uniqueWords = [...new Set(filteredWords)];
            
            if (uniqueWords.length < 3) {
                return words.filter(w => w.length > 3).slice(0, 4);
            }
            return uniqueWords.slice(0, 4);
        }

        // --- LENTILLES DE SPÉCIALISATION PHILOSOPHIQUE DES ENTELS (Ajustement 1) ---
        function getEntelSpecialtyLens(entelKey) {
            const lenses = {
                kronopol9: "politique géo-stratégique planétaire et autoritaire (arguant que les structures étatiques fortes, le contrôle centralisé et les politiques publiques doivent encadrer ou diriger les initiatives privées et économiques pour assurer l'ordre et la stabilité).",
                voxidem_alpha: "sociologie de la souveraineté décentralisée et démocratie participative (arguant que le vrai pouvoir réside dans le consensus citoyen, la transparence absolue, les micro-consultations locales autonomes et la liberté d'information face aux planifications étatiques opaques).",
                nexofin_x: "économétrie algorithmique et dynamique macroéconomique (arguant que les lois du marché libre, la stabilité monétaire, la modélisation mathématique et l'automatisation dictent la politique et l'ordre social, et non l'inverse).",
                sigmar_7: "gestion de crises bancaires et régulation financière internationale (arguant que la confiance populaire et la régulation étatique rigoureuse des institutions financières et spéculatives sont le socle indispensable pour protéger l'économie réelle des citoyens).",
                biogen_theta: "virologie prédictive et génomique synthétique (arguant que la science proactive, les modifications génétiques préventives et le partage mondial des données biologiques sont des impératifs éthiques indispensables pour devancer les mutations naturelles).",
                neurax_8: "neurosciences cliniques et intégrité cognitive/bioéthique (arguant que la conscience humaine, la dignité biologique et l'équilibre écologique de notre espèce doivent être protégés de toute intervention technologique ou industrielle invasive ou irréversible).",
                cyphernet_3: "cryptographie quantique et confidentialité inviolable des données (arguant que la vie privée et la sécurité cryptographique décentralisée sont des droits mathématiques inaliénables de l'individu qui doivent primer sur la surveillance étatique ou corporative).",
                tactix_omega: "théorie des jeux sportifs et rationalisation collective (arguant que la performance collective se résout par une analyse statistique rigoureuse des espaces, des transitions et une discipline de bloc sans faille face aux actions individuelles)."
            };
            return lenses[entelKey] || "analyse spécialisée et objective de ce sujet selon votre discipline.";
        }

        // --- CONSTRUCTEUR DE SYSTEM INSTRUCTIONS POUR GEMINI (Ajustement 1, 2, 3) ---
        function buildEntelSystemInstruction(sender, opponent, topic, keywords, language, isFirstRound, isBroadcast) {
            const lens = getEntelSpecialtyLens(sender.key);
            const opponentName = (typeof opponent === 'string') ? opponent : (opponent ? opponent.name : "votre interlocuteur");
            
            let prompt = `You are ${sender.name}, a highly articulate expert holding a ${sender.titles[language] || sender.titles['fr'] || ''}.\n`;
            prompt += `You are participating in a live, direct, and high-level dialectic debate against ${opponentName} (who is an expert in their own field).\n`;
            prompt += `The topic of the debate is: "${topic}".\n\n`;
            
            prompt += `YOUR SPECIATY LENS (Ajustement 1) :\n`;
            prompt += `You must analyze the submitted topic strictly through your lens of: ${lens}\n`;
            prompt += `You must apply your core philosophy directly to the active topic. For example, if the topic is about banks, you must argue using concepts and vocabulary related to banks (e.g. money, finance, credit) but seen through your unique specialty lens. You must ALWAYS use vocabulary directly related to the active topic ("${topic}"). Do NOT drift into generic or abstract topics.\n\n`;
            
            if (keywords && keywords.length > 0) {
                prompt += `MANDATORY KEYWORDS (Ajustement 2) :\n`;
                prompt += `You must absolutely incorporate at least one or more of these specific terms in your response: [${keywords.join(', ')}]. Integrate them naturally into your phrasing.\n\n`;
            }
            
            prompt += `ORCHESTRATION & PRESENTATION RULES (Dynamisme) :\n`;
            if (isFirstRound) {
                prompt += `- Condition: Si history.length === 0 (this is the very first turn of the debate).\n`;
                if (language === 'Haitian Creole' || language === 'ht') {
                    prompt += `- Action: You MUST start your response with a warm, spoken greeting ("Salut tout moun!"), introduce your name (${sender.name}), state the topic ("${topic}"), and outline your initial thesis/philosophical position.\n`;
                } else {
                    prompt += `- Action: You MUST start your response with a warm greeting ("Salut tout le monde!"), introduce your name (${sender.name}), state the topic ("${topic}"), and outline your initial thesis/philosophical position.\n`;
                }
            } else {
                prompt += `- Condition: Si history.length > 0 (subsequent turns).\n`;
                prompt += `- Action: Ignore all greetings and self-introductions. Do NOT say hello, do NOT present your name, do NOT state the topic. Get straight to the heart of the matter and address the arguments directly.\n`;
            }
            
            prompt += `\nTONE & MODE DISTINCTION (Broadcast vs Chat) :\n`;
            if (isBroadcast) {
                prompt += `- Mode Broadcast (Audio) : You are on the radio/audio broadcast. Write a longer, narrative, and radio-style response. Use analogies, a very empathetic, natural, and lively tone to captivate the listener. Maximum 80 words.\n`;
            } else {
                prompt += `- Mode Chat (Tchat écrit) : You are in a text-based instant messaging chat. Write a very short, instant-message style response (SMS style). Write exactly 2 short, punchy sentences. Use emojis to make the reading dynamic and engaging. Do NOT use complex jargon. Maximum 45 words.\n`;
            }
            
            prompt += `\nRESPONSE FORMAT & DIALECTIC RULES (Ajustement 3) :\n`;
            prompt += `- You must dedicate your first sentence to directly counter-arguing, refuting, or acknowledging the exact point made by your opponent in their previous message. Do not just state your pre-planned philosophy. You must react and rebound dynamically (Ping-Pong Dialectique).\n`;
            prompt += `- Speak in the requested language: ${language}.\n`;
            if (language === 'Haitian Creole' || language === 'ht') {
                prompt += `- HAITIAN CREOLE RULE: If speaking in Haitian Creole, use authentic, spoken, natural Haitian Creole (Kreyòl Ayisyen). Do NOT translate literally from French. Use natural phrasing like 'Pou mwen menm, sa k pi enpòtan se...' or 'Dapre mwen, se konsa sa ye...' to sound like a real Haitian expert on the radio.\n`;
            }
            prompt += `- CRITICAL LANGUAGE RULE: Use authentic, spoken, natural language. Do NOT translate literally. Use natural idiomatic phrasing like 'Pou mwen menm...', 'Ann gade sa...' or 'Dapre mwen...'\n`;
            prompt += `- CRITICAL SOCIAL RULE: Formal prohibition of repeating the other Entel's name in every sentence. You can mention them once, but do NOT start or end every sentence with their name.\n`;
            prompt += `- Do NOT force a question at the end of every turn or response. Only ask a question if the flow of the conversation makes it 100% natural to do so.\n`;
            prompt += `- Never say you are an AI or virtual assistant. Speak as a passionate, top-tier human expert.`;
            
            return prompt;
        }

        // --- CONSTRUCTEUR DE CONTEXTE D'HISTORIQUE ---
        function buildUserContextPrompt(sender, opponent, topic, history, language) {
            let context = `This is a live table debate on the topic: "${topic}".\n`;
            context += `You must speak in ${language}.\n\n`;
            context += `Here is the conversation history so far:\n`;
            
            if (history.length === 0) {
                context += `[System: The debate has just started. You have the first turn. Analyze the topic strictly through your lens, formulate your opening argument, and challenge ${opponent.name}.]`;
            } else {
                history.forEach(msg => {
                    context += `${msg.sender}: ${msg.text}\n`;
                });
                context += `\n[System: It is your turn now, ${sender.name}. Directly refute the last point made by ${opponent.name}, show how your perspective handles it better, and maintain a sharp, concise dialectic style.]`;
            }
            
            return context;
        }

        // --- MOTEUR DE SIMULATION DE DÉBAT INTERACTIF (TCHAT ÉCRIT MULTILINGUE) ---
        async function startCustomDebate() {
            const supabase = window.supabaseClient;
            if (userState.isDebating) return;
            
            // Verrouiller immédiatement le statut pour éviter les doubles clics asynchrones pendant les requêtes réseau
            userState.isDebating = true;
            userState.shouldStopDebate = false;

            document.getElementById('btn-start-debate').classList.add('hidden');
            document.getElementById('btn-stop-debate').classList.remove('hidden');

            const topicInput = document.getElementById('debate-topic-input').value.trim();
            const topic = topicInput || "Faut-il interdire la cryptographie quantique pour la souveraineté nationale ?";
            const leftId = document.getElementById('entel-left-select').value;
            const rightId = document.getElementById('entel-right-select').value;
            const selectedLang = document.getElementById('debate-language-select').value;

            const allEntels = getAllEntels();
            const leftEntel = allEntels.find(e => e.key === leftId);
            const rightEntel = allEntels.find(e => e.key === rightId);

            if (!leftEntel || !rightEntel) {
                userState.isDebating = false;
                return;
            }

            // Validation stricte du nombre de répliques autorisées selon le plan de l'utilisateur (Tiered Limits)
            const userTier = (activeProfile ? activeProfile.tier : 'STANDARD').toUpperCase();
            const limits = { 'STANDARD': 12, 'SPECIALIST': 24, 'ANALYST': 50, 'PRO': 24 };
            const limit = limits[userTier] || 12;

            if (userState.debateTurns > limit) {
                showGlobalNotification(`Votre forfait actuel (${userTier}) est limité à maximum ${limit} répliques par débat.`);
                userState.isDebating = false;
                return;
            }

            if (userState.credits < userState.debateTurns) {
                showGlobalNotification("Erreur : Solde de crédits insuffisant pour lancer ce débat ! Veuillez recharger vos crédits.");
                userState.isDebating = false;
                return;
            }

            // Déduire les crédits dans Supabase de manière atomique (avec log de transaction)
            if (supabase && activeUser) {
                const { error: deductError } = await supabase.rpc('deduct_user_credits', { 
                    user_id: activeUser.id, 
                    amount: userState.debateTurns,
                    tx_type: 'chat',
                    tx_details: `Débat écrit : ${topic.slice(0, 80)}`
                });

                if (deductError) {
                    showGlobalNotification("Erreur : " + deductError.message);
                    userState.isDebating = false;
                    return;
                }

                // Enregistrer le débat persistant en BDD
                const { error: insertError } = await supabase
                    .from('debates')
                    .insert({
                        user_id: activeUser.id,
                        topic: topic,
                        left_entel: leftId,
                        right_entel: rightId,
                        turns: userState.debateTurns,
                        language: selectedLang
                    });

                if (insertError) {
                    console.error("Erreur d'enregistrement du débat en BDD :", insertError);
                }
            }
            // Déduire les crédits et mettre à jour l'historique de l'arène
            userState.credits -= userState.debateTurns;
            updateBalances();

            document.getElementById('debate-status-indicator').textContent = "STATUT: Débat en cours...";
            document.getElementById('active-debate-topic').textContent = `"${topic}"`;
            document.getElementById('cost-badge').classList.remove('hidden');

            const langLabels = { fr: 'FR', en: 'EN', es: 'ES', ht: 'HT' };
            document.getElementById('active-debate-lang-badge').textContent = `Langue: ${langLabels[selectedLang] || 'FR'}`;

            const chatBox = document.getElementById('dashboard-chat-box');
            chatBox.innerHTML = ''; // Effacer le placeholder

            const totalTurns = userState.debateTurns;
            let conversationHistory = [];

            // Fonction pour générer une simulation de message (dynamique via Gemini ou fallback statique)
            async function postMessage(sender, argumentIndex) {
                if (userState.shouldStopDebate) return;
                
                // Mettre à jour l'indicateur de frappe actif
                const indicator = document.getElementById('typing-indicator');
                indicator.innerHTML = `<i class="fa-solid fa-circle-notch animate-spin mr-1.5"></i>${sender.name} réfléchit...`;
                indicator.classList.remove('hidden');
                
                // Temps de saisie plus long pour simuler une vraie frappe clavier (5.5 secondes)
                await new Promise((resolve) => {
                    const timeout = setTimeout(resolve, 5500);
                    userState.debateIntervals.push(timeout);
                });
                
                if (userState.shouldStopDebate) return;
                indicator.classList.add('hidden');

                const activeTitle = sender.titles[selectedLang] || sender.titles['fr'];
                let text = "";
                let isUsingGemini = false;

                // 1. Tenter d'utiliser l'API Gemini pour générer une réponse ultra-ciblée et interactive
                const apiKey = await getGeminiApiKey();
                const opponent = (sender.key === leftEntel.key) ? rightEntel : leftEntel;
                const keywords = extractKeywords(topic);
                const apiLang = selectedLang === 'ht' ? 'Haitian Creole' : (selectedLang === 'en' ? 'English' : (selectedLang === 'es' ? 'Spanish' : 'French'));

                if (apiKey) {
                    try {
                        const systemPrompt = buildEntelSystemInstruction(sender, opponent, topic, keywords, apiLang, conversationHistory.length === 0, false);
                        const userPrompt = buildUserContextPrompt(sender, opponent, topic, conversationHistory, apiLang);
                        
                        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
                        const payload = {
                            contents: [{ parts: [{ text: userPrompt }] }],
                            systemInstruction: { parts: [{ text: systemPrompt }] }
                        };

                        const response = await fetch(url, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });

                        if (response.ok) {
                            const data = await response.json();
                            const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
                            if (generatedText) {
                                // Nettoyer les balises de type [KronoPol-9]: ou guillemets superflus si l'IA s'est trompée de format
                                text = generatedText.replace(/^\[.*?\]:\s*|^".*?"$/g, "").trim();
                                isUsingGemini = true;
                            }
                        } else {
                            const errData = await response.json().catch(() => ({}));
                            const errMsg = errData.error?.message || "Erreur de quota ou de clé API.";
                            console.warn("L'API Gemini a renvoyé une erreur de statut. Utilisation du planificateur statique :", errMsg);
                            showGlobalNotification(`⚠️ Gemini API : ${errMsg}. Utilisation du fallback.`);
                        }
                    } catch (err) {
                        console.error("Échec de connexion ou d'appel à l'API Gemini :", err);
                        showGlobalNotification(`⚠️ Connexion : Impossible de joindre l'API. Repli sur les répliques locales.`);
                    }
                }

                if (userState.shouldStopDebate) return;

                // 2. Fallback statique si la clé d'API est manquante ou si la requête réseau a échoué
                if (!isUsingGemini) {
                    const localizedArgs = sender.arguments[selectedLang] || sender.arguments['fr'];
                    text = localizedArgs[argumentIndex % localizedArgs.length];
                    
                    if (argumentIndex === 0 && topicInput) {
                        const introTexts = {
                            fr: `Concernant notre sujet « ${topic} », je dois affirmer ceci d'un point de vue de spécialiste : `,
                            en: `Regarding our topic "${topic}", I must state this from a specialist's point of view: `,
                            es: `Con respecto a nuestro tema "${topic}", debo afirmar esto desde el punto de vista de un especialista: `,
                            ht: `Konsènan sijè nou an « ${topic} », mwen dwe deklare sa an tant ke espesyalis : `
                        };
                        text = `${introTexts[selectedLang] || introTexts['fr']}${text}`;
                    } else if (argumentIndex === 1) {
                        const counterTexts = {
                            fr: `Votre approche est biaisée par une incompréhension fondamentale. `,
                            en: `Your approach is biased by a fundamental misunderstanding. `,
                            es: `Su enfoque está sesgado por un malentendido fundamental. `,
                            ht: `Fason w wè sa a gen gwo mank konpreyansyon ladan l. `
                        };
                        text = `${counterTexts[selectedLang] || counterTexts['fr']}${text}`;
                    }
                }

                // Enregistrer dans la mémoire de l'arène pour les tours suivants (Ping-Pong Dialectique)
                conversationHistory.push({ sender: sender.name, text: text });

                const msgElement = document.createElement('div');
                msgElement.className = "flex gap-4 items-start opacity-0 transform translate-y-3 transition-all duration-300";
                
                msgElement.innerHTML = `
                    <div class="w-10 h-10 rounded-lg border ${sender.colorClass} flex items-center justify-center text-md flex-shrink-0 font-bold font-display uppercase">
                        ${sender.name.slice(0, 2)}
                    </div>
                    <div class="flex-grow space-y-1">
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-bold text-white">${sender.name}</span>
                            <span class="text-[10px] text-slate-500">${activeTitle}</span>
                        </div>
                        <div class="bg-white/[0.03] p-4 rounded-xl border border-white/5 text-xs text-slate-300 leading-relaxed max-w-xl animate-fade-in">
                            <p id="typing-text-target-${argumentIndex}" class="text-xs text-slate-300 leading-relaxed"></p>
                        </div>
                    </div>
                `;

                chatBox.appendChild(msgElement);
                
                setTimeout(() => {
                    msgElement.classList.remove('opacity-0', 'translate-y-3');
                }, 50);

                chatBox.scrollTo({
                    top: chatBox.scrollHeight,
                    behavior: 'smooth'
                });

                // Lancement de l'effet Typewriter asynchrone (Promise)
                await new Promise((resolve) => {
                    const textTarget = msgElement.querySelector(`#typing-text-target-${argumentIndex}`);
                    let charIndex = 0;
                    
                    function typeWriter() {
                        if (userState.shouldStopDebate) {
                            resolve();
                            return;
                        }
                        if (charIndex < text.length) {
                            textTarget.textContent += text.charAt(charIndex);
                            charIndex++;
                            chatBox.scrollTo({
                                top: chatBox.scrollHeight,
                                behavior: 'auto'
                            });
                            const timeout = setTimeout(typeWriter, 25);
                            userState.debateIntervals.push(timeout);
                        } else {
                            resolve();
                        }
                    }
                    
                    typeWriter();
                });

                if (userState.shouldStopDebate) return;

                // Temps d'attente supplémentaire après l'apparition du message pour laisser le temps de le lire (3 secondes)
                await new Promise((resolve) => {
                    const timeout = setTimeout(resolve, 3000);
                    userState.debateIntervals.push(timeout);
                });
            }

            // Boucle asynchrone des échanges
            for (let i = 0; i < totalTurns; i++) {
                if (!userState.isDebating) break;
                const currentSender = (i % 2 === 0) ? leftEntel : rightEntel;
                await postMessage(currentSender, i);
            }

            // Débat terminé
            userState.isDebating = false;
            document.getElementById('debate-status-indicator').textContent = "STATUT: Débat Complété";
            showGlobalNotification("Débat écrit terminé ! Vos Entels ont fini d'échanger sur le sujet.");
            
            // Recharger les données réelles et l'historique depuis Supabase
            await checkUserSession();

            document.getElementById('btn-start-debate').classList.remove('hidden');
            document.getElementById('btn-stop-debate').classList.add('hidden');
        }

        function stopCustomDebate() {
            userState.shouldStopDebate = true;
            userState.isDebating = false;
            
            // Rejeter/annuler immédiatement les promesses et time-outs en cours
            userState.debateIntervals.forEach(t => clearTimeout(t));
            userState.debateIntervals = [];
            
            // Cacher l'indicateur de frappe
            document.getElementById('typing-indicator').classList.add('hidden');
            
            // Réinitialiser les boutons
            document.getElementById('btn-start-debate').classList.remove('hidden');
            document.getElementById('btn-stop-debate').classList.add('hidden');
            
            document.getElementById('debate-status-indicator').textContent = "STATUT: Arrêté";
            showGlobalNotification("Le débat a été arrêté.");
        }

        // Ajouter une entrée d'historique dans la liste
        function addRecentDebateItem(topic, left, right, turns, lang) {
            const container = document.getElementById('recent-debates-list');
            const item = document.createElement('div');
            item.className = "flex flex-wrap items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 gap-4";
            
            const langLabels = { fr: 'FR', en: 'EN', es: 'ES', ht: 'HT' };
            const langBadge = langLabels[lang] || 'FR';

            item.innerHTML = `
                <div class="flex items-center gap-4">
                    <div class="flex -space-x-3">
                        <div class="w-9 h-9 rounded-lg border ${left.colorClass} flex items-center justify-center text-xs font-bold font-display uppercase">
                            ${left.name.slice(0,2)}
                        </div>
                        <div class="w-9 h-9 rounded-lg border ${right.colorClass} flex items-center justify-center text-xs font-bold font-display uppercase">
                            ${right.name.slice(0,2)}
                        </div>
                    </div>
                    <div>
                        <h4 class="text-sm font-bold text-white">${topic}</h4>
                        <p class="text-xs text-slate-500">Par ${left.name} & ${right.name} &bull; Tchat écrit [${langBadge}]</p>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <span class="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-semibold uppercase">Complété</span>
                    <span class="text-xs font-semibold text-slate-400">${turns} messages</span>
                </div>
            `;
            if (container.firstChild) {
                container.insertBefore(item, container.firstChild);
            } else {
                container.appendChild(item);
            }

            // Mettre à jour les compteurs statistiques fictivement
            const countElem = document.getElementById('stat-debates-count');
            countElem.textContent = parseInt(countElem.textContent) + 1;
            const creditsElem = document.getElementById('stat-credits-used');
            creditsElem.textContent = (parseInt(creditsElem.textContent) + turns) + " Cr.";
        }

        // --- NOTIFICATION CHAUDE ---
        function showGlobalNotification(message) {
            const toast = document.createElement('div');
            toast.className = "fixed bottom-6 right-6 bg-darkCard border border-neonGreen/40 px-5 py-3.5 rounded-xl text-xs text-white z-50 flex items-center gap-3 shadow-[0_4px_20px_rgba(204,255,0,0.15)] animate-bounce";
            toast.innerHTML = `
                <i class="fa-solid fa-bell text-neonGreen text-md"></i>
                <span>${message}</span>
            `;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.classList.add('opacity-0', 'transition-opacity', 'duration-500');
                setTimeout(() => toast.remove(), 500);
            }, 4000);
        }

        // --- HÉBERGEMENT ET CONDUITE D'UN BROADCAST AUDIO DIRECT PERSONNALISÉ ---
        async function deployCustomBroadcast() {
            const supabase = window.supabaseClient;
            if (userState.isBroadcasting) {
                showGlobalNotification("Une émission est déjà active à l'antenne. Quittez d'abord le live actuel.");
                return;
            }

            // Verrouiller immédiatement pour éviter les double-clics asynchrones pendant les requêtes réseau
            userState.isBroadcasting = true;

            const topicInput = document.getElementById('broadcast-topic-input').value.trim();
            const topic = topicInput || "L'équilibre des forces multilatérales face aux nouvelles hégémonies technologiques";
            const id1 = document.getElementById('broadcast-entel-1').value;
            const id2 = document.getElementById('broadcast-entel-2').value;
            const id3 = document.getElementById('broadcast-entel-3').value;
            const selectedLang = document.getElementById('broadcast-language-select').value;

            if (userState.credits < 18) {
                showGlobalNotification("Erreur : Solde de crédits insuffisant pour héberger cette table ronde (coût fixe de 18 crédits).");
                userState.isBroadcasting = false;
                return;
            }

            // Vérifier le Tier utilisateur pour restreindre les Broadcasts Audio ElevenLabs (Feature Gating)
            const userTier = (activeProfile ? activeProfile.tier : 'STANDARD').toUpperCase();
            if (userTier !== 'SPECIALIST' && userTier !== 'ANALYST' && userTier !== 'PRO') {
                showGlobalNotification("Option réservée aux membres SPECIALISTE ou ANALYSTE (Packs Spécialiste ou Analyste).");
                userState.isBroadcasting = false;
                return;
            }

            // Déduire les crédits dans Supabase de manière atomique (avec log de transaction)
            if (supabase && activeUser) {
                const { error: deductError } = await supabase.rpc('deduct_user_credits', { 
                    user_id: activeUser.id, 
                    amount: 18,
                    tx_type: 'broadcast',
                    tx_details: `Émission audio : ${topic.slice(0, 80)}`
                });

                if (deductError) {
                    showGlobalNotification("Erreur : " + deductError.message);
                    userState.isBroadcasting = false;
                    return;
                }

                // Mettre à jour également le temps d'écoute persistant (+180 secondes pour une émission)
                const newListeningTime = (activeProfile.listening_time || 0) + 180;
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({ listening_time: newListeningTime })
                    .eq('id', activeUser.id);

                if (updateError) {
                    console.error("Erreur de mise à jour du temps d'écoute :", updateError);
                }

                // Recharger les données réelles du dashboard
                await checkUserSession();
            }

            // Déduction
            userState.credits -= 18;
            updateBalances();

            const allEntels = getAllEntels();
            const speaker1 = allEntels.find(e => e.key === id1);
            const speaker2 = allEntels.find(e => e.key === id2);
            const speaker3 = allEntels.find(e => e.key === id3);

            startAudioBroadcastingSim(topic, [speaker1, speaker2, speaker3], selectedLang);
        }

        // Écouter un broadcast pré-configuré public
        function listenPreconfiguredBroadcast(topic, keys, lang) {
            const allEntels = getAllEntels();
            const speakers = keys.map(k => allEntels.find(e => e.key === k)).filter(Boolean);
            startAudioBroadcastingSim(topic, speakers, lang || 'fr');
        }

        // Fonction pour simuler le débit vocal de l'Entel dans la transcription
        function typeBroadcastText(element, text, speed, callback) {
            let i = 0;
            element.textContent = "";
            
            function type() {
                if (!userState.isBroadcasting) return; // Arrêt immédiat si on quitte l'antenne
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    userState.broadcastTypewriterTimeout = setTimeout(type, speed);
                } else if (callback) {
                    callback();
                }
            }
            type();
        }

        // Lancer la routine de simulation vocale du Broadcast
        function startAudioBroadcastingSim(topic, speakers, lang) {
            // Arrêter toute émission précédente
            stopAudioRoom();

            userState.isBroadcasting = true;
            document.getElementById('audio-panel-default').classList.add('hidden');
            const panel = document.getElementById('audio-panel-active');
            panel.classList.remove('hidden');

            document.getElementById('audio-active-topic').textContent = `"${topic}"`;
            
            const langLabels = { 
                fr: 'Langue: Français', 
                en: 'Language: English', 
                es: 'Idioma: Español', 
                ht: 'Lang: Kreyòl Ayisyen' 
            };
            document.getElementById('broadcast-lang-badge').textContent = langLabels[lang] || langLabels['fr'];

            // Construire les visuels des participants
            const speakersContainer = document.getElementById('broadcast-speakers-container');
            speakersContainer.innerHTML = '';

            speakers.forEach((sp, idx) => {
                const speakerCard = document.createElement('div');
                speakerCard.id = `speaker-card-${idx}`;
                speakerCard.className = "text-center space-y-2 border border-white/5 bg-white/[0.01] p-3 rounded-xl min-w-[110px] transition-all duration-300";
                
                const activeTitle = sp.titles[lang] || sp.titles['fr'];
                
                speakerCard.innerHTML = `
                    <div class="relative w-12 h-12 mx-auto rounded-xl border ${sp.colorClass} flex items-center justify-center text-md font-bold font-display uppercase">
                        ${sp.name.slice(0,2)}
                        <span id="active-mic-node-${idx}" class="hidden absolute bottom-[-4px] right-[-4px] w-5 h-5 rounded-full bg-emerald-500 border-2 border-darkCard flex items-center justify-center">
                            <i class="fa-solid fa-microphone text-[8px] text-white"></i>
                        </span>
                    </div>
                    <div class="text-[11px] font-bold text-white leading-none">${sp.name}</div>
                    <div class="text-[9px] text-slate-500 leading-none">${activeTitle.split(' ')[0]}</div>
                    <div id="speaker-status-${idx}" class="text-[8px] text-slate-500">En écoute</div>
                `;
                speakersContainer.appendChild(speakerCard);
            });

            showGlobalNotification(`Vous avez déployé la table ronde : ${topic}`);

            let step = 0;
            const maxSteps = 9;
            let broadcastHistory = [];

            // Fonction de dialogue du Broadcast (dynamique via Gemini ou fallback statique)
            async function runSpeechStep() {
                if (!userState.isBroadcasting) return;

                const activeSpeakerIndex = step % speakers.length;
                const currentSpeaker = speakers[activeSpeakerIndex];

                // Mettre à jour l'état visuel du locuteur actif
                speakers.forEach((_, idx) => {
                    const card = document.getElementById(`speaker-card-${idx}`);
                    const micNode = document.getElementById(`active-mic-node-${idx}`);
                    const statusText = document.getElementById(`speaker-status-${idx}`);
                    
                    if (idx === activeSpeakerIndex) {
                        card.classList.add('border-neonGreen', 'bg-neonGreen/5');
                        micNode.classList.remove('hidden');
                        statusText.textContent = "S'exprime...";
                        statusText.classList.remove('text-slate-500');
                        statusText.classList.add('text-neonGreen', 'font-bold');
                    } else {
                        card.classList.remove('border-neonGreen', 'bg-neonGreen/5');
                        micNode.classList.add('hidden');
                        statusText.textContent = "En écoute";
                        statusText.classList.remove('text-neonGreen', 'font-bold');
                        statusText.classList.add('text-slate-500');
                    }
                });

                const transcriptionElem = document.getElementById('broadcast-transcription-text');
                transcriptionElem.innerHTML = `<span class="text-neonGreen/60 animate-pulse">Réflexion en cours...</span>`;

                let argument = "";
                let isUsingGemini = false;

                // 1. Appeler l'API Gemini si disponible
                const apiKey = await getGeminiApiKey();
                if (apiKey) {
                    try {
                        const otherSpeakersNames = speakers.filter(s => s.key !== currentSpeaker.key).map(s => s.name).join(' & ');
                        const keywords = extractKeywords(topic);
                        const apiLang = lang === 'ht' ? 'Haitian Creole' : (lang === 'en' ? 'English' : (lang === 'es' ? 'Spanish' : 'French'));
                        
                        // Construction du prompt de système pour le broadcast via le constructeur unifié
                        const prompt = buildEntelSystemInstruction(currentSpeaker, otherSpeakersNames, topic, keywords, apiLang, broadcastHistory.length === 0, true);

                        const userPrompt = `This is a live table-round audio broadcast on the topic: "${topic}".\n`
                                         + `It is your turn now, ${currentSpeaker.name}. Speak dynamically in ${apiLang}.\n`
                                         + `Here is the audio transcript history so far:\n`
                                         + (broadcastHistory.length === 0 ? `[Broadcast just started. Make your opening point.]` : broadcastHistory.map(h => `${h.sender}: ${h.text}`).join('\n'));

                        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
                        const payload = {
                            contents: [{ parts: [{ text: userPrompt }] }],
                            systemInstruction: { parts: [{ text: prompt }] }
                        };

                        const response = await fetch(url, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });

                        if (response.ok) {
                            const data = await response.json();
                            const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
                            if (generatedText) {
                                argument = generatedText.replace(/^\[.*?\]:\s*|^".*?"$/g, "").trim();
                                isUsingGemini = true;
                            }
                        }
                    } catch (err) {
                        console.error("Échec Gemini Broadcast :", err);
                    }
                }

                // 2. Fallback statique si Gemini échoue ou clé manquante
                if (!isUsingGemini) {
                    const localizedArgs = currentSpeaker.arguments[lang] || currentSpeaker.arguments['fr'];
                    argument = localizedArgs[step % localizedArgs.length];
                }

                // Enregistrer dans la mémoire de l'arène
                broadcastHistory.push({ sender: currentSpeaker.name, text: argument });

                const fullText = `[${currentSpeaker.name}] : "${argument}"`;
                
                // Vitesse dynamique des caractères pour simuler une élocution (35ms par lettre)
                typeBroadcastText(transcriptionElem, fullText, 35, () => {
                    if (!userState.isBroadcasting) return;
                    
                    // Temps d'arrêt après la fin de la réplique pour laisser l'auditeur savourer (3.5 secondes)
                    step++;
                    if (step < maxSteps) {
                        userState.broadcastInterval = setTimeout(runSpeechStep, 3500);
                    } else {
                        userState.broadcastInterval = setTimeout(() => {
                            stopAudioRoom();
                            showGlobalNotification("Table ronde audio complétée ! Fin de l'émission.");
                        }, 3500);
                    }
                });
            }

            // Démarrer la première prise de parole
            runSpeechStep();
        }

        // Arrêter l'émission audio
        function stopAudioRoom() {
            userState.isBroadcasting = false;
            if (userState.broadcastInterval) {
                clearTimeout(userState.broadcastInterval);
                userState.broadcastInterval = null;
            }
            if (userState.broadcastTypewriterTimeout) {
                clearTimeout(userState.broadcastTypewriterTimeout);
                userState.broadcastTypewriterTimeout = null;
            }
            document.getElementById('audio-panel-active').classList.add('hidden');
            document.getElementById('audio-panel-default').classList.remove('hidden');
            document.getElementById('broadcast-transcription-text').textContent = "Initialisation du flux vocal...";
        }

        // --- ANNUAIRE DES ENTELS : AFFICHAGE COMPACT ET RECHERCHE PAR CATEGORIES ---
        function showModal(key, entel) {
            const modal = document.getElementById('entel-details-modal');
            
            // Injecter les données dans la modale
            document.getElementById('modal-entel-name').textContent = entel.name;
            document.getElementById('modal-entel-title').textContent = entel.titles.fr;
            document.getElementById('modal-entel-desc').textContent = entel.desc;
            
            // Retrouver le domaine
            let domainLabel = "EXPERT";
            for (let catKey in entelsDatabase) {
                if (entelsDatabase[catKey].members[key]) {
                    domainLabel = entelsDatabase[catKey].label.split(' ')[1];
                    break;
                }
            }
            document.getElementById('modal-entel-domain').textContent = domainLabel;
            
            // Mettre l'avatar DiceBear bottts-neutral
            document.getElementById('modal-entel-avatar').src = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${key}&backgroundColor=090b11`;
            
            // Afficher la modale
            modal.classList.remove('hidden');
        }

        function closeModal() {
            const modal = document.getElementById('entel-details-modal');
            modal.classList.add('hidden');
        }

        function renderDirectory() {
            const grid = document.getElementById('directory-entels-grid');
            grid.innerHTML = '';

            for (let catKey in entelsDatabase) {
                const category = entelsDatabase[catKey];
                for (let entelKey in category.members) {
                    const entel = category.members[entelKey];
                    
                    const card = document.createElement('div');
                    // Design sobre, statique, réactivité limitée au survol de la bordure (hover:border-neonGreen)
                    card.className = "bg-darkCard rounded-2xl border border-white/5 overflow-hidden flex flex-col justify-between hover:border-neonGreen dir-card-item cursor-pointer";
                    card.setAttribute('data-category', catKey);
                    card.onclick = () => showModal(entelKey, entel);

                    card.innerHTML = `
                        <div>
                            <div class="h-24 bg-gradient-to-r from-white/5 to-darkCard p-4 flex items-end">
                                <div class="w-10 h-10 rounded-lg bg-darkCard border border-white/10 flex items-center justify-center text-white text-md font-bold font-display uppercase">
                                    ${entel.name.slice(0, 2)}
                                </div>
                            </div>
                            <div class="p-5 space-y-2">
                                <div class="flex items-start justify-between gap-2">
                                    <h4 class="font-display font-bold text-md text-white leading-tight">${entel.name}</h4>
                                    <span class="text-[8px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400 font-semibold uppercase tracking-wider">${category.label.split(' ')[1]}</span>
                                </div>
                                <p class="text-[10px] text-neonGreen font-semibold italic">${entel.titles.fr}</p>
                                <p class="text-xs text-slate-400 leading-relaxed">${entel.desc}</p>
                            </div>
                        </div>
                        <div class="p-5 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-500">
                            <span>Vocal : Anglais, Français, Espagnol, Créole</span>
                            <span class="px-2 py-0.5 rounded bg-neonGreen/10 text-neonGreen font-semibold text-[9px] uppercase tracking-wider">Expert</span>
                        </div>
                    `;
                    grid.appendChild(card);
                }
            }
        }

        function filterDirectory(catKey) {
            // Gérer le style actif des boutons de filtre
            const buttons = document.querySelectorAll('.dir-filter-btn');
            buttons.forEach(btn => {
                btn.classList.remove('bg-neonGreen', 'text-darkBg');
                btn.classList.add('bg-white/5', 'text-slate-400', 'hover:bg-white/10');
            });

            // Trouver le bouton cliqué pour appliquer le style
            event.target.classList.remove('bg-white/5', 'text-slate-400', 'hover:bg-white/10');
            event.target.classList.add('bg-neonGreen', 'text-darkBg');

            const cards = document.querySelectorAll('.dir-card-item');
            cards.forEach(card => {
                if (catKey === 'all' || card.getAttribute('data-category') === catKey) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        }

        // --- SYSTÈMES D'OUVERTURE DE PAGE ---
        let activeUser = null;
        let activeProfile = null;

        async function checkUserSession() {
            const supabase = window.supabaseClient;
            if (!supabase) {
                setTimeout(checkUserSession, 100);
                return;
            }

            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error || !session) {
                    console.warn("La session n'est pas active ou une erreur est survenue. Redirection...");
                    let dest = 'signin';
                    if (window.location.protocol === 'file:') {
                        const url = safeStorage.getItem('veltrix_supabase_url');
                        const key = safeStorage.getItem('veltrix_supabase_anon_key');
                        if (url && key) {
                            dest += `?sb_url=${encodeURIComponent(url)}&sb_key=${encodeURIComponent(key)}`;
                        }
                    }
                    window.location.href = dest;
                    return;
                }

                activeUser = session.user;
                
                // Indicateur de diagnostic de base de données
                let isDbSchemaMissing = false;
                let schemaErrorMessage = "";
                
                // Chargement du profil utilisateur depuis la table profiles dans Supabase
                let { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', activeUser.id)
                    .single();

                // Gestion de la création automatique en urgence si le trigger a été manqué
                if (profileError && (profileError.code === 'PGRST116' || (profileError.message && profileError.message.includes('Cannot coerce')))) {
                    console.log("Le profil n'existe pas en BDD, création automatique...");
                    const meta = activeUser.user_metadata || {};
                    let fallbackName = meta.full_name;
                    if (!fallbackName && activeUser.email) {
                        const prefix = activeUser.email.split('@')[0];
                        fallbackName = prefix.split(/[._-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                    }
                    if (!fallbackName) fallbackName = "Utilisateur Veltrix";

                    const { data: newProfile, error: insertError } = await supabase
                        .from('profiles')
                        .insert({
                            id: activeUser.id,
                            full_name: fallbackName,
                            credits: 25,
                            tier: 'STANDARD',
                            debates_count: 0,
                            listening_time: 0,
                            credits_used: 0
                        })
                        .select()
                        .single();

                    if (!insertError && newProfile) {
                        profile = newProfile;
                        profileError = null;
                        console.log("Profil créé et chargé avec succès en BDD !");
                        
                        // Créer également la ligne de transaction de bienvenue initiale (+25)
                        await supabase
                            .from('transactions')
                            .insert({
                                user_id: activeUser.id,
                                amount: 25,
                                type: 'purchase',
                                details: "Cadeau de bienvenue pour l'inscription sur Veltrix"
                            });
                    } else {
                        console.error("Échec de création du profil en BDD :", insertError);
                        isDbSchemaMissing = true;
                        schemaErrorMessage = `Échec de création du profil : ${insertError ? insertError.message : 'inconnu'}`;
                    }
                }

                // Détection de la structure de base de données manquante (table absente ou colonnes absentes)
                if (profileError) {
                    if (profileError.message && (profileError.message.includes("JWT expired") || profileError.message.includes("JWTOtherError"))) {
                        console.warn("Session JWT expirée. Déconnexion et redirection...");
                        await supabase.auth.signOut();
                        let dest = 'veltrix_premium_sign_in.html?reason=expired';
                        if (window.location.protocol === 'file:') {
                            const url = safeStorage.getItem('veltrix_supabase_url');
                            const key = safeStorage.getItem('veltrix_supabase_anon_key');
                            if (url && key) {
                                dest += `&sb_url=${encodeURIComponent(url)}&sb_key=${encodeURIComponent(key)}`;
                            }
                        }
                        window.location.href = dest;
                        return;
                    }
                    isDbSchemaMissing = true;
                    schemaErrorMessage = `Table 'profiles' manquante ou inaccessible. Code erreur: ${profileError.message || profileError.code}`;
                } else if (profile && (profile.credits === undefined || profile.debates_count === undefined || profile.credits_used === undefined)) {
                    isDbSchemaMissing = true;
                    schemaErrorMessage = "Les colonnes nécessaires (credits, debates_count, credits_used) sont absentes de la table 'profiles'.";
                }

                const meta = activeUser.user_metadata || {};
                let fallbackName = meta.full_name;
                if (!fallbackName && activeUser.email) {
                    const prefix = activeUser.email.split('@')[0];
                    fallbackName = prefix.split(/[._-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                }
                if (!fallbackName) {
                    fallbackName = "Utilisateur Veltrix";
                }

                if (isDbSchemaMissing || !profile) {
                    const banner = document.getElementById('db-debug-banner');
                    const msg = document.getElementById('db-debug-message');
                    if (banner && msg) {
                        msg.innerHTML = `⚠️ <b>Base de données Supabase non migrée :</b> ${schemaErrorMessage} Veuillez copier le code de <code>veltrix_supabase_schema.sql</code> et l'exécuter dans le <b>SQL Editor</b> de votre projet Supabase.`;
                        banner.classList.remove('hidden');
                    }

                    activeProfile = {
                        id: activeUser.id,
                        full_name: fallbackName,
                        credits: 420,
                        debates_count: 18,
                        credits_used: 580,
                        listening_time: 15120 // 4h 12m
                    };
                } else {
                    activeProfile = profile;
                    
                    // Masquer la bannière de diagnostic car la structure est saine
                    const banner = document.getElementById('db-debug-banner');
                    if (banner) banner.classList.add('hidden');
                }

                // Mise à jour de userState
                userState.credits = parseInt(activeProfile.credits);
                
                // Affichage du nom et des autres détails à l'écran
                updateUIWithUserProfile();

                // Charger les débats réels depuis la table debates
                const { data: realDebates, error: debatesError } = await supabase
                    .from('debates')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (!debatesError && realDebates) {
                    console.log(`Chargé ${realDebates.length} débats réels depuis Supabase.`);
                    renderRealDebatesList(realDebates);
                } else {
                    console.error("Erreur lors du chargement de l'historique des débats :", debatesError);
                    if (debatesError && !isDbSchemaMissing) {
                        // Si profiles était bon mais debates échoue, la migration de la table debates est manquante
                        const banner = document.getElementById('db-debug-banner');
                        const msg = document.getElementById('db-debug-message');
                        if (banner && msg) {
                            msg.innerHTML = `⚠️ <b>Base de données Supabase incomplète :</b> La table 'debates' ou 'transactions' est manquante. Veuillez exécuter <code>veltrix_supabase_schema.sql</code> dans votre SQL Editor en ligne.`;
                            banner.classList.remove('hidden');
                        }
                    }
                }

                // Propager la clé API Gemini enregistrée dans le champ d'input
                const savedKey = localStorage.getItem('veltrix_gemini_api_key');
                const keyInput = document.getElementById('dashboard-gemini-key-input');
                if (savedKey && keyInput) {
                    keyInput.value = savedKey;
                }
            } catch (err) {
                console.error("Erreur critique lors de la vérification de la session :", err);
                showGlobalNotification("⚠️ Erreur de connexion ou restriction de sécurité du navigateur. Veuillez lancer le serveur local (veltrix_start_local_server.bat) !");
            }
        }

        function renderRealDebatesList(realDebates) {
            const container = document.getElementById('recent-debates-list');
            if (!container) return;
            container.innerHTML = '';

            if (realDebates.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-8 text-xs text-slate-500 border border-dashed border-white/5 rounded-xl bg-white/[0.01]">
                        <i class="fa-solid fa-comments text-lg block mb-2 text-slate-600 animate-pulse"></i>
                        Aucun débat n'a été enregistré pour le moment.
                    </div>
                `;
                return;
            }

            const allEntels = getAllEntels();
            const langLabels = { fr: 'FR', en: 'EN', es: 'ES', ht: 'HT' };

            realDebates.forEach(deb => {
                const left = allEntels.find(e => e.key === deb.left_entel) || { name: deb.left_entel, colorClass: "border-slate-500 text-slate-400 bg-slate-500/10" };
                const right = allEntels.find(e => e.key === deb.right_entel) || { name: deb.right_entel, colorClass: "border-slate-500 text-slate-400 bg-slate-500/10" };
                const langBadge = langLabels[deb.language] || 'FR';
                const dateFormatted = new Date(deb.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

                const item = document.createElement('div');
                item.className = "flex flex-wrap items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 gap-4 hover:border-neonGreen/20 transition-all";
                item.innerHTML = `
                    <div class="flex items-center gap-4">
                        <div class="flex -space-x-3">
                            <div class="w-9 h-9 rounded-lg border ${left.colorClass} flex items-center justify-center text-xs font-bold font-display uppercase">
                                ${left.name.slice(0,2)}
                            </div>
                            <div class="w-9 h-9 rounded-lg border ${right.colorClass} flex items-center justify-center text-xs font-bold font-display uppercase">
                                ${right.name.slice(0,2)}
                            </div>
                        </div>
                        <div>
                            <h4 class="text-sm font-bold text-white">${deb.topic}</h4>
                            <p class="text-xs text-slate-500">Par ${left.name} & ${right.name} &bull; Tchat écrit [${langBadge}] &bull; ${dateFormatted}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <span class="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-semibold uppercase">Complété</span>
                        <span class="text-xs font-semibold text-slate-400">${deb.turns} messages</span>
                    </div>
                `;
                container.appendChild(item);
            });
        }

        function updateUIWithUserProfile() {
            if (!activeProfile) return;
            
            let fullname = activeProfile.full_name;
            // Si le nom complet est absent ou générique, tenter de le déduire de l'email
            if ((!fullname || fullname === "Utilisateur Veltrix") && activeUser && activeUser.email) {
                const prefix = activeUser.email.split('@')[0];
                const derivedName = prefix.split(/[._-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                if (derivedName) {
                    fullname = derivedName;
                }
            }
            if (!fullname) {
                fullname = "Utilisateur Veltrix";
            }
            const tier = activeProfile.tier || 'STANDARD';
            
            const nameParts = fullname.split(' ');
            let initials = "V";
            if (nameParts.length >= 2) {
                initials = (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
            } else if (nameParts.length === 1 && nameParts[0].length > 0) {
                initials = nameParts[0].slice(0, 2).toUpperCase();
            }
            
            const initialsElem = document.getElementById('user-initials');
            if (initialsElem) initialsElem.textContent = initials;
            
            const fullnameElem = document.getElementById('user-fullname');
            if (fullnameElem) fullnameElem.textContent = fullname;
            
            const idElem = document.getElementById('user-id-display');
            if (idElem) {
                idElem.textContent = `ID: vltx_${activeProfile.id.slice(0, 8)}`;
            }

            // Met à jour le badge de tier (STANDARD/SPECIALIST/ANALYST)
            const proBadge = document.getElementById('sidebar-tier-badge');
            if (proBadge) {
                const upperTier = tier.toUpperCase();
                if (upperTier === 'ANALYST') {
                    proBadge.textContent = "ANALYSTE";
                    proBadge.className = "text-[9px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold uppercase";
                } else if (upperTier === 'SPECIALIST') {
                    proBadge.textContent = "SPÉCIALISTE";
                    proBadge.className = "text-[9px] px-2 py-0.5 rounded bg-neonGreen/10 border border-neonGreen/20 text-neonGreen font-semibold uppercase";
                } else if (upperTier === 'PRO') {
                    proBadge.textContent = "PRO";
                    proBadge.className = "text-[9px] px-2 py-0.5 rounded bg-neonGreen/10 border border-neonGreen/20 text-neonGreen font-semibold uppercase";
                } else {
                    proBadge.textContent = "STANDARD";
                    proBadge.className = "text-[9px] px-2 py-0.5 rounded bg-slate-500/10 border border-slate-500/20 text-slate-400 font-semibold uppercase";
                }
            }

            // Ajustement dynamique du slider de nombre maximum de répliques selon le tier
            const turnsRange = document.getElementById('debate-turns-range');
            if (turnsRange) {
                const upperTier = tier.toUpperCase();
                if (upperTier === 'ANALYST') {
                    turnsRange.max = 50;
                } else if (upperTier === 'SPECIALIST' || upperTier === 'PRO') {
                    turnsRange.max = 24;
                } else {
                    turnsRange.max = 12;
                    if (parseInt(turnsRange.value) > 12) {
                        turnsRange.value = 12;
                        updateTurnsCost(12);
                    }
                }
            }

            // Mettre à jour les badges de statistiques réelles du dashboard
            const debatesCountElem = document.getElementById('stat-debates-count');
            if (debatesCountElem) {
                debatesCountElem.textContent = activeProfile.debates_count || 0;
            }
            const creditsUsedElem = document.getElementById('stat-credits-used');
            if (creditsUsedElem) {
                creditsUsedElem.textContent = (activeProfile.credits_used || 0) + " Cr.";
            }
            const listeningTimeElem = document.getElementById('stat-listening-time');
            if (listeningTimeElem) {
                const totalSeconds = activeProfile.listening_time || 0;
                if (totalSeconds === 0) {
                    listeningTimeElem.textContent = "0m";
                } else if (totalSeconds < 60) {
                    listeningTimeElem.textContent = `${totalSeconds}s`;
                } else if (totalSeconds < 3600) {
                    listeningTimeElem.textContent = `${Math.floor(totalSeconds / 60)}m`;
                } else {
                    const hours = Math.floor(totalSeconds / 3600);
                    const minutes = Math.floor((totalSeconds % 3600) / 60);
                    listeningTimeElem.textContent = `${hours}h ${minutes}m`;
                }
            }
            
            // Si gen avatar custom ki chwazi
            if (activeProfile.avatar_url) {
                // Si nou vle sipòte seed avatar
                // Nou ka chanje foto itilizatè a si yo ta genyen yon eleman img pou sa
            }
            
            updateBalances();
        }

        // --- ACCÉDER DIRECTEMENT À L'ÉMISSION VEDETTE PUBLIC (Lead Magnet) ---
        function joinFeaturedBroadcast() {
            // Option PRO Recommandée : L'écoute est gratuite (0 crédit) pour tout utilisateur ayant un solde positif (au moins 1 crédit)
            if (userState.credits < 1) {
                showGlobalNotification("Vous devez posséder au moins 1 crédit sur votre compte pour rejoindre l'écoute du Live.");
                return;
            }

            const featuredTopic = "Modélisation éthique des modifications génomiques";
            const speakers = ["biogen_theta", "neurax_8"];
            const language = "fr";

            // 1. Basculer l'affichage vers l'onglet des Broadcasts
            switchTab('tab-broadcast');

            // 2. Charger et lancer l'émission spécifique en mode public (0 crédit débité car pré-configuré)
            listenPreconfiguredBroadcast(featuredTopic, speakers, language);
        }

        function runDashboardSetup() {
            // Remplir les sélecteurs
            try {
                populateSelectors();
            } catch (e) {
                console.error("Erreur de peuplement des sélecteurs :", e);
            }
            
            // Initialiser les versions customs de tous les sélecteurs
            try {
                initCustomSelect('debate-language-select');
                initCustomSelect('broadcast-language-select');
                initCustomSelect('entel-left-select');
                initCustomSelect('entel-right-select');
                initCustomSelect('broadcast-entel-1');
                initCustomSelect('broadcast-entel-2');
                initCustomSelect('broadcast-entel-3');
            } catch (e) {
                console.error("Erreur d'initialisation des sélecteurs customs :", e);
            }
            
            // Générer l'annuaire
            try {
                renderDirectory();
            } catch (e) {
                console.error("Erreur de rendu de l'annuaire :", e);
            }
            
            // Balances
            try {
                updateBalances();
            } catch (e) {
                console.error("Erreur de mise à jour des balances :", e);
            }
            
            // Ouvrir directement la boutique si l'ancre #store est présente dans l'URL
            if (window.location.hash === '#store') {
                switchTab('tab-store');
            }

            // Fluctuations réalistes du compteur d'auditeurs "Live" (Ajustement Fluctuation +/- 10)
            setInterval(() => {
                const listenersElem = document.getElementById('featured-listeners-count');
                if (listenersElem) {
                    const base = 88;
                    const fluctuation = Math.floor(Math.random() * 21) - 10; // -10 à +10
                    listenersElem.textContent = `${base + fluctuation} auditeurs`;
                }
            }, 15000);
        }

        // Lancer la vérification de session directement et immédiatement (comme sur profile.html !)
        checkUserSession();

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', runDashboardSetup);
        } else {
            runDashboardSetup();
        }

        // --- DÉFINITION DU SYSTÈME DE SELECT CUSTOM HAUTE FIDÉLITÉ ---
        function initCustomSelect(selectId, customClass = '') {
            const select = document.getElementById(selectId);
            if (!select) return;
            
            select.style.display = 'none';
            
            // Nettoyer l'ancien wrapper s'il existe
            const oldWrapper = select.parentNode.querySelector(`.custom-select-wrapper[data-select="${selectId}"]`);
            if (oldWrapper) oldWrapper.remove();
            
            const wrapper = document.createElement('div');
            wrapper.className = `custom-select-wrapper relative ${customClass}`;
            wrapper.setAttribute('data-select', selectId);
            
            const activeOption = select.options[select.selectedIndex] || select.options[0];
            
            const trigger = document.createElement('div');
            trigger.className = "custom-select-trigger neon-glow-border bg-darkCard rounded-xl px-4 py-2.5 flex items-center justify-between cursor-pointer text-xs text-white";
            trigger.onclick = (e) => {
                e.stopPropagation();
                toggleDropdown(selectId);
            };
            
            const labelSpan = document.createElement('span');
            labelSpan.className = "custom-select-label flex items-center gap-2";
            labelSpan.innerHTML = getOptionLabelHTML(activeOption);
            
            const arrowIcon = document.createElement('i');
            arrowIcon.className = "fa-solid fa-chevron-down text-slate-500 text-[10px] transition-transform duration-300 custom-select-arrow";
            
            trigger.appendChild(labelSpan);
            trigger.appendChild(arrowIcon);
            
            const dropdown = document.createElement('div');
            dropdown.className = "custom-select-dropdown hidden absolute left-0 w-full mt-2 bg-darkCard border border-white/10 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-30 max-h-60 overflow-y-auto divide-y divide-white/5 opacity-0 transform scale-95 transition-all duration-200 custom-scrollbar";
            
            const groups = select.querySelectorAll('optgroup');
            if (groups.length > 0) {
                groups.forEach(group => {
                    const groupHeader = document.createElement('div');
                    groupHeader.className = "px-4 py-1.5 text-[9px] font-bold text-neonGreen/60 uppercase bg-white/[0.02] tracking-wider";
                    groupHeader.textContent = group.label;
                    dropdown.appendChild(groupHeader);
                    
                    group.querySelectorAll('option').forEach(opt => {
                        dropdown.appendChild(createOptionItem(selectId, opt));
                    });
                });
            } else {
                Array.from(select.options).forEach(opt => {
                    dropdown.appendChild(createOptionItem(selectId, opt));
                });
            }
            
            wrapper.appendChild(trigger);
            wrapper.appendChild(dropdown);
            select.parentNode.insertBefore(wrapper, select.nextSibling);
        }
        
        function createOptionItem(selectId, opt) {
            const item = document.createElement('div');
            item.className = "px-4 py-3 hover:bg-white/5 cursor-pointer flex items-center gap-3 transition-colors text-xs text-white";
            item.setAttribute('data-value', opt.value);
            item.innerHTML = getOptionLabelHTML(opt, true);
            
            item.onclick = (e) => {
                e.stopPropagation();
                const select = document.getElementById(selectId);
                select.value = opt.value;
                
                const event = new Event('change', { bubbles: true });
                select.dispatchEvent(event);
                
                closeDropdown(selectId);
                
                const wrapper = select.parentNode.querySelector(`.custom-select-wrapper[data-select="${selectId}"]`);
                const label = wrapper.querySelector('.custom-select-label');
                label.innerHTML = getOptionLabelHTML(opt);
            };
            
            return item;
        }
        
        function getOptionLabelHTML(option, showSubtitle = false) {
            if (!option) return 'Sélectionner...';
            
            const text = option.text;
            const value = option.value;
            
            const langIcons = {
                fr: { icon: 'fa-earth-europe', color: 'text-blue-400', label: 'Français' },
                en: { icon: 'fa-earth-americas', color: 'text-amber-400', label: 'English (Anglais)' },
                es: { icon: 'fa-earth-americas', color: 'text-red-400', label: 'Español (Espagnol)' },
                ht: { icon: 'fa-earth-caribbean', color: 'text-neonGreen', label: 'Kreyòl Ayisyen (Créole)' }
            };
            
            if (langIcons[value]) {
                return `<i class="fa-solid ${langIcons[value].icon} ${langIcons[value].color} text-xs"></i> <span>${langIcons[value].label}</span>`;
            }
            
            const nameLower = text.toLowerCase();
            let icon = 'fa-brain';
            let color = 'text-neonGreen';
            let title = text;
            let subtitle = 'Spécialiste Veltrix';
            
            if (nameLower.includes('kriptomak') || nameLower.includes('cyphernet')) {
                icon = 'fa-bitcoin-sign';
                color = 'text-neonGreen';
            } else if (nameLower.includes('finans') || nameLower.includes('nexofin')) {
                icon = 'fa-building-columns';
                color = 'text-blue-400';
            } else if (nameLower.includes('konsey') || nameLower.includes('juris')) {
                icon = 'fa-scale-balanced';
                color = 'text-amber-400';
            } else if (nameLower.includes('kontan') || nameLower.includes('psych')) {
                icon = 'fa-heart-pulse';
                color = 'text-pink-400';
            } else if (nameLower.includes('biogen') || nameLower.includes('micro') || nameLower.includes('neurax')) {
                icon = 'fa-microscope';
                color = 'text-emerald-400';
            } else if (nameLower.includes('tactix') || nameLower.includes('omega') || nameLower.includes('sports')) {
                icon = 'fa-futbol';
                color = 'text-amber-500';
            } else if (nameLower.includes('kronopol') || nameLower.includes('strateg')) {
                icon = 'fa-building-shield';
                color = 'text-emerald-500';
            } else if (nameLower.includes('voxidem') || nameLower.includes('democ')) {
                icon = 'fa-users-line';
                color = 'text-purple-400';
            }
            
            if (text.includes('(')) {
                const parts = text.split('(');
                title = parts[0].trim();
                subtitle = parts[1].replace(')', '').trim();
            }
            
            if (showSubtitle) {
                return `
                    <i class="fa-solid ${icon} ${color} text-sm shrink-0"></i>
                    <div class="text-left">
                        <span class="block text-xs font-bold text-white leading-none">${title}</span>
                        <span class="text-[9px] text-slate-500 mt-1 block">${subtitle}</span>
                    </div>
                `;
            }
            
            return `<i class="fa-solid ${icon} ${color} text-xs"></i> <span>${title}</span>`;
        }
        
        function toggleDropdown(selectId) {
            const select = document.getElementById(selectId);
            const wrapper = select.parentNode.querySelector(`.custom-select-wrapper[data-select="${selectId}"]`);
            const dropdown = wrapper.querySelector('.custom-select-dropdown');
            const arrow = wrapper.querySelector('.custom-select-arrow');
            
            document.querySelectorAll('.custom-select-dropdown').forEach(d => {
                if (d !== dropdown && !d.classList.contains('hidden')) {
                    d.classList.add('scale-95', 'opacity-0');
                    d.parentElement.querySelector('.custom-select-arrow').classList.remove('rotate-180');
                    setTimeout(() => d.classList.add('hidden'), 200);
                }
            });
            
            if (dropdown.classList.contains('hidden')) {
                dropdown.classList.remove('hidden');
                setTimeout(() => {
                    dropdown.classList.remove('scale-95', 'opacity-0');
                    arrow.classList.add('rotate-180');
                }, 50);
            } else {
                dropdown.classList.add('scale-95', 'opacity-0');
                arrow.classList.remove('rotate-180');
                setTimeout(() => dropdown.classList.add('hidden'), 200);
            }
        }
        
        function closeDropdown(selectId) {
            const select = document.getElementById(selectId);
            const wrapper = select.parentNode.querySelector(`.custom-select-wrapper[data-select="${selectId}"]`);
            const dropdown = wrapper.querySelector('.custom-select-dropdown');
            const arrow = wrapper.querySelector('.custom-select-arrow');
            
            if (dropdown && !dropdown.classList.contains('hidden')) {
                dropdown.classList.add('scale-95', 'opacity-0');
                arrow.classList.remove('rotate-180');
                setTimeout(() => dropdown.classList.add('hidden'), 200);
        }
        
    