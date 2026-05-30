# Guide d'Activation et de Sélection du Modèle ElevenLabs Multilingual v2 dans Veltrix

Il est très facile de s'y perdre en cherchant comment activer le modèle multilingue spécifique dans ElevenLabs, car la plateforme ne le propose pas sous forme d'abonnement séparé. Ce guide technique détaille de manière professionnelle son fonctionnement et son intégration au sein de l'écosystème Veltrix.

---

## 1. Fonctionnement de la Tarification ElevenLabs

### Pourquoi ne voyez-vous pas de bouton "S'abonner" ou "Acheter" pour ce modèle ?
Sur ElevenLabs, les plans d'abonnement (qu'ils soient **Free**, **Starter**, **Creator** ou **Pay-as-you-go**) vous attribuent des **crédits généraux** sous la forme d'un quota de caractères global. 

* **Pas de barrière d'accès :** Les modèles de synthèse vocale (tels que *Multilingual v2*, *Flash* ou *Turbo*) sont simplement des options de traitement à choisir à la volée lors de la génération.
* **Coût réel :** Lorsque vous utilisez le modèle **Eleven Multilingual v2**, ElevenLabs déduira simplement **0,10 $ pour 1 000 caractères** directement de votre solde actif (par exemple, sur vos 5,00 $ de recharge ou votre quota mensuel).
* **Accès gratuit :** Aucun frais supplémentaire n'est requis pour débloquer l'accès à ce modèle ou à la langue créole/française.

> [!NOTE]
> Le modèle *Multilingual v2* est extrêmement performant car il conserve l'accent, l'intonation et le ton naturel du locuteur même lorsqu'il change de langue ou de dialecte.

---

## 2. Sélection du Modèle sur la Console ElevenLabs (Playground)

Si vous souhaitez effectuer un test directement depuis l'interface visuelle d'ElevenLabs sans passer par le code :

1. Connectez-vous à votre console ElevenLabs.
2. Allez dans le menu supérieur et cliquez sur **"Speech Synthesis"** (Synthèse vocale).
3. Saisissez votre texte en **Créole** ou en **Français** dans la zone de saisie.
4. Juste au-dessus de cette zone de texte, cliquez sur le menu déroulant intitulé **"Model"** (Modèle).
5. Dans la liste déroulante, sélectionnez **"Eleven Multilingual v2"**.

---

## 3. Sélection Automatique dans le Code & Banc d'Essai Veltrix

Dans le code de l'API, vous n'avez besoin d'effectuer aucune configuration préalable sur le site d'ElevenLabs. C'est directement dans le corps de votre requête API que vous spécifiez quel modèle utiliser.

Dans le Banc d'Essai professionnel que nous avons construit ([veltrix_pro_broadcast_test_bench (4).html](file:///c:/Users/Miche/OneDrive/Bureau/Veltrix/veltrix_pro_broadcast_test_bench%20(4).html)), l'appel est préconfiguré pour appeler automatiquement ce modèle :

```json
{
  "text": "Texte en Créole ou Français...",
  "model_id": "eleven_multilingual_v2"
}
```

Dès que la requête est envoyée avec la clé API valide, ElevenLabs comprend l'instruction, génère une voix naturelle avec l'accent approprié et débite le montant correspondant de votre solde.

---

## 4. Recommandations de Paramétrage pour les Entels

Pour un rendu optimal dans l'arène de Veltrix, nous vous suggérons d'ajuster les contrôles d'humanisation comme suit dans le panneau du Banc d'Essai :

| Paramètre | Valeur Recommandée | Effet Recherché |
| :--- | :--- | :--- |
| **Stability** | `0.45` | Plus d'expressivité et d'intonations émotionnelles |
| **Clarity / Similarity** | `0.85` | Fidélité parfaite au clone vocal original de l'Entel |
| **Style Exaggeration** | `0.15` | Expressions et respirations naturelles légères |

> [!TIP]
> **Économie de budget :** Pour optimiser vos dépenses API tout en conservant l'effet d'immersion (effet WOW), limitez la taille des répliques des Entels à un maximum de 150 caractères (environ 25 à 30 mots).
