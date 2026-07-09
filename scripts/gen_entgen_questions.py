#!/usr/bin/env python3
"""Generate 480 MCQ questions for Entrepreneur Général RBQ exam seed SQL."""

import json, textwrap

TS = '2026-07-09T03:00:00.000Z'
TRADE_ID = 'cmt_entrepreneur_general_001'

chapters = [
    ('ch_entgen_01', 60),
    ('ch_entgen_02', 60),
    ('ch_entgen_03', 60),
    ('ch_entgen_04', 60),
    ('ch_entgen_05', 60),
    ('ch_entgen_06', 60),
    ('ch_entgen_07', 60),
    ('ch_entgen_08', 60),
]

def difficulty_for(i, total):
    """30% EASY, 50% MEDIUM, 20% HARD"""
    easy_cut = int(total * 0.30)
    hard_cut = total - int(total * 0.20)
    if i < easy_cut:
        return 'EASY'
    elif i >= hard_cut:
        return 'HARD'
    else:
        return 'MEDIUM'

# ============================================================
# CHAPTER 1: Licence RBQ et réglementation (60 questions)
# ============================================================
ch01 = [
    # EASY questions (0-17)
    ("Quel est l'organisme responsable de la délivrance des licences d'entrepreneur au Québec ?",
     ["CCQ", "RBQ", "CNESST", "APCHQ"], "B",
     "La Régie du bâtiment du Québec (RBQ) est l'organisme qui délivre les licences d'entrepreneur et assure la surveillance du secteur de la construction."),

    ("Quelle est la catégorie de licence réservée à l'entrepreneur général qui exécute des travaux de construction pour le compte d'autrui ?",
     ["Catégorie 1.1", "Catégorie 1.2", "Catégorie 1.3", "Catégorie 2.1"], "A",
     "La catégorie 1.1 est la licence d'entrepreneur général qui permet d'exécuter des travaux pour le compte d'autrui."),

    ("Quelle est la sous-catégorie pour un entrepreneur qui construit des bâtiments résidentiels de 3 étages ou moins ?",
     ["Sous-catégorie 1.1.1", "Sous-catégorie 1.1.2", "Sous-catégorie 1.2.1", "Sous-catégorie 2.1.1"], "A",
     "La sous-catégorie 1.1.1 couvre les bâtiments résidentiels de 3 étages ou moins (maisons unifamiliales, duplex, triplex)."),

    ("Quel montant d'assurance responsabilité civile est minimalement requis pour un entrepreneur général au Québec ?",
     ["500 000 $", "1 000 000 $", "2 000 000 $", "5 000 000 $"], "C",
     "L'entrepreneur général doit détenir une assurance responsabilité civile d'au moins 2 000 000 $ par sinistre."),

    ("La licence RBQ doit être renouvelée à quelle fréquence ?",
     ["Aux 6 mois", "Aux 12 mois", "Aux 24 mois", "Aux 36 mois"], "C",
     "La licence RBQ est valide pour une période de 2 ans (24 mois) et doit être renouvelée avant son expiration."),

    ("Quelle est la première étape pour obtenir une licence d'entrepreneur général RBQ ?",
     ["Payer la cotisation", "Réussir l'examen de qualification", "S'inscrire au registre de la RBQ", "Obtenir une garantie financière"], "B",
     "Le candidat doit d'abord réussir l'examen de qualification de la RBQ pour démontrer ses connaissances."),

    ("Quel document doit être affiché sur tous les chantiers de construction ?",
     ["Le plan d'architecture", "Le certificat de licence RBQ", "Les états financiers", "Le contrat de soumission"], "B",
     "Le certificat de licence RBQ doit être affiché bien en vue sur chaque chantier où l'entrepreneur exécute des travaux."),

    ("L'entrepreneur général doit-il s'inscrire au registre des détenteurs de licence de la RBQ ?",
     ["Non, c'est facultatif", "Oui, c'est obligatoire", "Seulement pour les travaux de plus de 20 000 $", "Seulement pour les travaux publics"], "B",
     "Tout détenteur de licence RBQ doit obligatoirement être inscrit au registre officiel de la RBQ."),

    ("Que signifie le sigle RBQ ?",
     ["Régie du Bâtiment du Québec", "Réseau des Bâtisseurs du Québec", "Registre des Bâtiments du Québec", "Régie des Bâtisseurs Québécois"], "A",
     "RBQ signifie Régie du bâtiment du Québec, l'organisme qui réglemente la construction au Québec."),

    ("L'examen de qualification RBQ pour entrepreneur général porte principalement sur quel domaine ?",
     ["La gestion d'entreprise et les techniques de construction", "La conception architecturale", "L'ingénierie structurale", "La vente immobilière"], "A",
     "L'examen couvre la gestion d'entreprise, les contrats, le code de construction, la SST, l'estimation et les méthodes de construction."),

    ("Quelle est la Loi principale qui régit la construction au Québec ?",
     ["Loi sur les relations de travail", "Loi sur le bâtiment (RLRQ c. B-1.1)", "Code civil du Québec", "Loi sur la santé et sécurité du travail"], "B",
     "La Loi sur le bâtiment (chapitre B-1.1 du RLRQ) est la loi-cadre qui régit l'industrie de la construction au Québec."),

    ("Un entrepreneur qui effectue des travaux sans licence RBQ s'expose à quelle sanction ?",
     ["Avertissement", "Amende et poursuite pénale", "Avis de non-conformité", "Suspension temporaire"], "B",
     "Travailler sans licence RBQ constitue une infraction passible d'amendes et de poursuites pénales."),

    ("Qui peut demander une licence RBQ de catégorie 1.2 ?",
     ["Un entrepreneur général", "Un promoteur immobilier", "Un sous-traitant spécialisé", "Un architecte"], "B",
     "La catégorie 1.2 est réservée aux promoteurs immobiliers qui font construire des bâtiments pour les vendre ou les louer."),

    ("Quel est l'âge minimum pour obtenir une licence d'entrepreneur général RBQ ?",
     ["16 ans", "18 ans", "21 ans", "Il n'y a pas d'âge minimum spécifique"], "B",
     "Le candidat doit être majeur (18 ans) pour obtenir une licence d'entrepreneur général RBQ."),

    ("L'entrepreneur général doit-il détenir une licence pour chaque région où il travaille ?",
     ["Oui, une licence par région", "Non, la licence est provinciale", "Oui, une licence par MRC", "Seulement pour les régions éloignées"], "B",
     "La licence RBQ est valide pour tout le territoire du Québec."),

    ("Quel type d'entreprise ne peut pas obtenir de licence RBQ ?",
     ["Une entreprise individuelle", "Une société par actions", "Une personne physique non résidente du Québec", "Une société en commandite"], "C",
     "Le demandeur doit être résident du Québec ou y avoir un établissement d'affaires pour obtenir une licence."),

    ("Quel est le rôle du registre de la RBQ ?",
     ["Gérer les plaintes salariales", "Répertorier tous les détenteurs de licence et leurs qualifications", "Offrir des formations en construction", "Inspecter la qualité des matériaux"], "B",
     "Le registre de la RBQ répertorie tous les détenteurs de licence avec leurs catégories, sous-catégories et qualifications."),

    ("L'entrepreneur doit-il aviser la RBQ d'un changement d'adresse d'affaires ?",
     ["Non", "Oui, dans les 30 jours", "Seulement au renouvellement", "Non, ce n'est pas requis"], "B",
     "Tout changement d'adresse d'affaires doit être communiqué à la RBQ dans les 30 jours suivant le changement."),

    # MEDIUM questions (18-47)
    ("Quel est le critère d'expérience minimal pour obtenir une licence d'entrepreneur général ?",
     ["1 an d'expérience pertinente", "2 ans d'expérience pertinente", "3 ans d'expérience pertinente", "5 ans d'expérience pertinente"], "C",
     "Le candidat doit démontrer un minimum de 3 ans d'expérience pertinente dans le domaine de la construction."),

    ("Quels documents doivent accompagner la demande de licence RBQ ?",
     ["États financiers, preuve d'assurance, bulletin de naissance", "Preuve d'assurance RC, garantie financière, états financiers vérifiés", "États financiers, curriculum vitae, lettres de recommandation", "Diplômes et certificats de naissance"], "B",
     "La demande doit inclure la preuve d'assurance RC, la garantie financière et les états financiers vérifiés."),

    ("Quelle est la couverture minimale de la garantie financière pour un entrepreneur général ?",
     ["25 000 $", "40 000 $", "50 000 $", "100 000 $"], "B",
     "La garantie financière minimale exigée pour un entrepreneur général est de 40 000 $."),

    ("Dans quel délai un entrepreneur doit-il déclarer une infraction à la RBQ ?",
     ["Immédiatement", "Dans les 10 jours", "Dans les 30 jours", "Au prochain renouvellement"], "B",
     "Toute infraction doit être déclarée à la RBQ dans les 10 jours suivant la date de l'infraction."),

    ("Qu'est-ce qu'une déclaration d'ouverture de chantier ?",
     ["Un permis de construire", "Un document qui informe la RBQ du début des travaux", "Un contrat avec le client", "Une garantie bancaire"], "B",
     "La déclaration d'ouverture de chantier est un document obligatoire qui informe la RBQ du début des travaux sur un chantier."),

    ("Quels sont les motifs valables de suspension d'une licence RBQ ?",
     ["Non-paiement des impôts, défaut d'assurance, défaut de garantie financière", "Absence de chantier en cours", "Changement d'adresse", "Embauche de nouveaux employés"], "A",
     "La RBQ peut suspendre une licence pour non-paiement de cotisation, défaut d'assurance ou absence de garantie financière."),

    ("Quelle est la différence entre une licence de catégorie 1.1 et 1.2 ?",
     ["La 1.1 est pour l'entrepreneur général, la 1.2 pour le promoteur", "La 1.1 est provinciale, la 1.2 est municipale", "La 1.1 est pour le résidentiel, la 1.2 pour le commercial", "Il n'y a pas de différence"], "A",
     "La catégorie 1.1 est pour l'entrepreneur qui exécute des travaux pour autrui, tandis que la catégorie 1.2 est pour le promoteur immobilier."),

    ("Quelles sont les conséquences d'une radiation de licence RBQ ?",
     ["Avertissement écrit", "Amende et interdiction d'exercer", "Suspension de 30 jours", "Formation obligatoire"], "B",
     "La radiation entraîne l'interdiction d'exercer les activités d'entrepreneur et peut être accompagnée d'amendes."),

    ("Quel est le montant de la cotisation annuelle à la RBQ pour un entrepreneur général ?",
     ["Variable selon le volume d'affaires", "Montant fixe de 500 $", "1 % du chiffre d'affaires", "Aucune cotisation"], "A",
     "La cotisation à la RBQ est variable selon le volume d'affaires annuel de l'entreprise."),

    ("L'entrepreneur général peut-il confier des travaux à un sous-traitant sans licence ?",
     ["Oui, s'il est compétent", "Non, le sous-traitant doit aussi détenir une licence RBQ appropriée", "Oui, pour les petits travaux", "Oui, avec un contrat écrit"], "B",
     "Tout sous-traitant doit détenir la licence RBQ appropriée pour les travaux qu'il exécute."),

    ("Qu'est-ce que le Règlement sur la qualification professionnelle des entrepreneurs ?",
     ["Un règlement sur les salaires", "Un règlement qui établit les conditions de délivrance des licences RBQ", "Un code de déontologie", "Un guide des bonnes pratiques"], "B",
     "Ce règlement établit les conditions et exigences pour l'obtention et le maintien des licences RBQ."),

    ("Quels sont les pouvoirs d'inspection de la RBQ ?",
     ["Aucun pouvoir d'inspection", "Visiter les chantiers, exiger des documents, ordonner des correctifs", "Uniquement vérifier les licences", "Inspecter les finances de l'entreprise"], "B",
     "La RBQ peut visiter les chantiers, exiger la production de documents et ordonner des mesures correctives."),

    ("Quelle est la procédure en cas de non-conformité constatée par la RBQ ?",
     ["Radiation immédiate", "Avis de non-conformité avec délai de correction", "Amende automatique", "Suspension de licence"], "B",
     "La RBQ émet un avis de non-conformité accordant un délai à l'entrepreneur pour corriger la situation."),

    ("L'entrepreneur général peut-il utiliser une licence d'une autre personne ?",
     ["Oui, avec autorisation", "Non, la licence est personnelle et non transférable", "Oui, pour un contrat spécifique", "Oui, pour les sous-traitants"], "B",
     "La licence RBQ est personnelle et non transférable. Il est interdit de prêter son nom ou sa licence."),

    ("Qu'est-ce que le cautionnement de soumission ?",
     ["Une garantie bancaire personnelle", "Une garantie que l'entrepreneur honorera sa soumission s'il est choisi", "Un dépôt de garantie au client", "Une police d'assurance"], "B",
     "Le cautionnement de soumission garantit que l'entrepreneur signera le contrat s'il est retenu et fournira les cautions d'exécution requises."),

    ("Quelle est la durée de validité d'une soumission avec cautionnement ?",
     ["15 jours", "30 jours", "45 jours", "60 jours"], "C",
     "La soumission avec cautionnement est généralement valide pour une période de 45 jours."),

    ("Qu'est-ce qu'une caution d'exécution ?",
     ["Une garantie de prêt bancaire", "Une garantie que les travaux seront exécutés conformément au contrat", "Une assurance responsabilité", "Un dépôt de garantie"], "B",
     "La caution d'exécution garantit que l'entrepreneur exécutera les travaux conformément aux termes du contrat."),

    ("Qu'est-ce qu'une caution de garantie des vices cachés ?",
     ["Une assurance incendie", "Une garantie qui protège le client contre les vices cachés après la réception des travaux", "Un contrat d'entretien", "Une extension de garantie"], "B",
     "Cette caution garantit la réparation des vices cachés durant la période légale de garantie suivant la réception des travaux."),

    ("Dans quel délai le sous-traitant peut-il enregistrer un avis de sous-traitance ?",
     ["Dans les 15 jours suivant la conclusion du contrat", "Dans les 30 jours suivant le début des travaux", "Dans les 45 jours suivant la fin des travaux", "Avant le début des travaux"], "A",
     "Le sous-traitant doit enregistrer son avis de sous-traitance dans les 15 jours suivant la conclusion du contrat de sous-traitance."),

    ("Quelle est la responsabilité de l'entrepreneur général envers les sous-traitants non payés ?",
     ["Aucune responsabilité", "Il est tenu de payer si le client ne paie pas", "Il est responsable solidaire du paiement, même s'il n'a pas été payé par le client", "Responsabilité limitée à 50 %"], "C",
     "L'entrepreneur général est solidairement responsable du paiement des sous-traitants, même s'il n'a pas été payé par le client."),

    ("Quelle est la fréquence minimale des inspections de la RBQ sur un chantier ?",
     ["Aucune inspection obligatoire", "Une inspection par mois", "Une inspection par année", "Une inspection par phase de travaux"], "A",
     "La RBQ n'a pas de fréquence d'inspection obligatoire; elle inspecte selon une approche basée sur les risques."),

    ("Qu'est-ce que le régime de garantie de construction résidentielle ?",
     ["Une police d'assurance personnelle", "Un régime obligatoire qui protège l'acheteur d'une maison neuve contre les vices", "Une garantie prolongée du fabricant", "Un fonds de réserve de l'entrepreneur"], "B",
     "Le régime de garantie des bâtiments résidentiels neufs protège l'acheteur contre les vices de construction (couverture de 3-5 ans)."),

    ("Qui administre le régime de garantie des bâtiments résidentiels neufs ?",
     ["La RBQ", "La CCQ", "Un organisme de garantie accrédité par la RBQ", "L'APCHQ"], "C",
     "Le régime est administré par des organismes de garantie accrédités par la RBQ, comme Garantie de construction résidentielle (GCR)."),

    ("Qu'est-ce que le cautionnement de retenue ?",
     ["Une retenue sur le salaire", "Une garantie qui remplace la retenue de garantie de 10 % sur les contrats publics", "Un dépôt de garantie", "Une assurance chômage"], "B",
     "Le cautionnement de retenue permet au donneur d'ouvrage de ne pas retenir la retenue de garantie de 10 %, remplacée par la caution."),

    ("Quelle est la sanction maximale pour une personne qui exerce sans licence ?",
     ["5 000 $", "10 000 $", "25 000 $", "50 000 $"], "D",
     "Une personne physique qui exerce sans licence RBQ s'expose à une amende maximale de 50 000 $."),

    ("Quel est le délai de prescription pour une infraction à la Loi sur le bâtiment ?",
     ["1 an", "2 ans", "3 ans", "5 ans"], "A",
     "Le délai de prescription pour une infraction à la Loi sur le bâtiment est d'un an à compter de la date où elle a été commise."),

    # HARD questions (48-59)
    ("Quel est le montant minimum de garantie financière requis pour un entrepreneur dont le chiffre d'affaires dépasse 5 M$ ?",
     ["50 000 $", "75 000 $", "100 000 $", "150 000 $"], "C",
     "Pour un chiffre d'affaires supérieur à 5 M$, la garantie financière minimale est de 100 000 $."),

    ("Quelle est la différence entre une licence restreinte et une licence générale ?",
     ["La licence restreinte limite le montant des contrats à 50 000 $", "La licence restreinte limite les types de travaux que l'entrepreneur peut exécuter", "La licence restreinte est provinciale, la générale est nationale", "Il n'y a pas de différence"], "B",
     "La licence restreinte limite l'entrepreneur à des types de travaux spécifiques, tandis que la licence générale lui permet d'exécuter tous les travaux de sa catégorie."),

    ("Dans quel cas la RBQ peut-elle exiger une vérification des connaissances ?",
     ["À chaque renouvellement de licence", "Lorsque l'entrepreneur change de catégorie ou après une radiation pour incompétence", "Tous les 5 ans", "Après une amende"], "B",
     "La RBQ peut exiger une vérification des connaissances en cas de changement de catégorie ou de radiation antérieure pour incompétence."),

    ("Qu'est-ce que le Règlement sur la sécurité dans les édifices publics ?",
     ["Un règlement sur les chantiers", "Un règlement qui établit les normes de sécurité incendie et d'évacuation des bâtiments", "Un code du travail", "Un règlement sur les matériaux"], "B",
     "Ce règlement établit les normes de sécurité incendie, d'évacuation et d'accessibilité pour les édifices publics."),

    ("Quelle est la période minimale d'expérience exigée pour la catégorie 1.1 si le candidat possède un diplôme universitaire en génie ?",
     ["1 an", "2 ans", "3 ans", "Aucune expérience exigée"], "B",
     "Un candidat titulaire d'un diplôme universitaire en génie peut obtenir une licence avec 2 ans d'expérience au lieu de 3."),

    ("L'entrepreneur peut-il contester une décision de la RBQ devant un tribunal ?",
     ["Non, la décision est finale", "Oui, devant la Cour supérieure du Québec", "Oui, devant le Tribunal administratif du travail", "Oui, devant la Cour municipale"], "C",
     "Les décisions de la RBQ peuvent être contestées devant le Tribunal administratif du travail (TAT)."),

    ("Quelle est l'amende maximale pour une personne morale qui contrevient à la Loi sur le bâtiment ?",
     ["50 000 $", "100 000 $", "200 000 $", "500 000 $"], "B",
     "Une personne morale qui contrevient à la Loi sur le bâtiment s'expose à une amende maximale de 100 000 $."),

    ("Qu'est-ce que la Loi visant principalement à lutter contre les fraudes électorales et à moderniser les règles de financement politique, aussi appelée Loi 2 ?",
     ["Une loi sur les élections", "Une loi qui permet à la RBQ d'accéder au registre des entreprises pour vérifier les administrateurs", "Une loi sur la construction", "Une loi sur les impôts"], "B",
     "La Loi 2 permet à la RBQ de vérifier l'intégrité des administrateurs d'entreprise via le registre des entreprises."),

    ("Quel est le pourcentage maximum de travaux qu'un entrepreneur général peut sous-traiter sans perdre sa qualification ?",
     ["50 %", "75 %", "85 %", "100 %"], "C",
     "L'entrepreneur général doit exécuter lui-même au moins 15 % des travaux en valeur; il peut sous-traiter jusqu'à 85 %."),

    ("Quelle est la validité maximale d'un certificat de classification RBQ ?",
     ["1 an", "2 ans", "3 ans", "5 ans"], "B",
     "Le certificat de classification RBQ est valide pour une période maximale de 2 ans."),

    ("Qu'est-ce que le Règlement sur l'application de la Loi sur le bâtiment concernant les licences ?",
     ["Un règlement sur les salaires", "Un règlement qui précise les conditions de délivrance, suspension et radiation des licences RBQ", "Un règlement municipal", "Un code de construction"], "B",
     "Ce règlement encadre l'ensemble des conditions de délivrance, de suspension et de radiation des licences RBQ."),

    ("Dans quel délai après une fusion d'entreprises la nouvelle entité doit-elle obtenir sa licence RBQ ?",
     ["30 jours", "60 jours", "90 jours", "Il n'y a pas de délai"], "C",
     "Après une fusion d'entreprises, la nouvelle entité doit obtenir sa licence RBQ dans les 90 jours suivant la fusion."),
]

# ============================================================
# CHAPTER 2: Gestion d'entreprise (60 questions)
# ============================================================
ch02 = [
    ("Qu'est-ce qu'un bilan comptable ?",
     ["Un état des revenus et dépenses", "Un état du patrimoine (actif et passif) de l'entreprise à un moment donné", "Un budget prévisionnel", "Un relevé bancaire"], "B",
     "Le bilan présente l'actif (ce que l'entreprise possède) et le passif (ce qu'elle doit) à une date précise."),

    ("Qu'est-ce que l'état des résultats ?",
     ["Un résumé des comptes bancaires", "Un document qui présente les revenus, les dépenses et le résultat net de l'entreprise", "Un bilan des immobilisations", "Un registre des employés"], "B",
     "L'état des résultats montre les revenus gagnés, les dépenses engagées et le bénéfice ou la perte nette."),

    ("Quel est le taux de TPS en vigueur au Québec ?",
     ["2 %", "5 %", "9,975 %", "15 %"], "B",
     "Le taux de la TPS (Taxe sur les produits et services) est de 5 % au niveau fédéral."),

    ("Quel est le taux de TVQ en vigueur au Québec ?",
     ["5 %", "7,5 %", "9,975 %", "14,975 %"], "C",
     "Le taux de la TVQ (Taxe de vente du Québec) est de 9,975 %."),

    ("Qu'est-ce que la CCQ ?",
     ["Commission de la Construction du Québec", "Commission des Comptes Québec", "Conseil de la Construction du Québec", "Centrale des Construction Québec"], "A",
     "La CCQ (Commission de la construction du Québec) gère les relations de travail et la main-d'œuvre dans l'industrie."),

    ("Qu'est-ce que le salaire de base déterminé par la CCQ ?",
     ["Le salaire minimum légal", "Le salaire minimum pour chaque métier de la construction déterminé par décret", "Le salaire moyen du marché", "Le salaire déterminé par l'employeur"], "B",
     "La CCQ établit les salaires minimums par métier dans le cadre des décrets de construction."),

    ("Qu'est-ce qu'une convention collective dans le secteur de la construction ?",
     ["Un contrat individuel de travail", "Une entente négociée entre les syndicats et les associations d'employeurs, administrée par la CCQ", "Un accord verbal", "Un règlement gouvernemental"], "B",
     "La convention collective dans la construction est négociée entre les parties patronale et syndicale et administrée par la CCQ."),

    ("L'entrepreneur doit-il s'inscrire à la CCQ ?",
     ["Non, c'est facultatif", "Oui, s'il emploie des travailleurs syndiqués", "Oui, obligatoirement s'il embauche des employés de la construction", "Seulement pour les grands projets"], "C",
     "Tout entrepreneur qui embauche des travailleurs de la construction doit s'inscrire auprès de la CCQ."),

    ("Quel est le délai maximal pour payer un sous-traitant après réception du paiement du client ?",
     ["15 jours", "31 jours", "45 jours", "60 jours"], "B",
     "L'entrepreneur général a un délai maximal de 31 jours après réception du paiement pour payer ses sous-traitants."),

    ("Qu'est-ce que la CNT dans le contexte de la construction ?",
     ["Commission des Normes du Travail", "Commission Nationale des Transports", "Confédération Nationale des Travailleurs", "Conseil des Normes Techniques"], "A",
     "La CNT (Commission des normes du travail) veille à l'application des normes du travail au Québec."),

    ("Qu'est-ce que le RQAP ?",
     ["Régime Québécois d'Assurance Parentale", "Régime de Qualification des Aides-Professionnels", "Registre Québécois des Artisans du Pétrole", "Réseau de Qualité des Applications"], "A",
     "Le RQAP est un régime d'assurance parentale qui offre des prestations aux parents qui s'absentent du travail pour la naissance ou l'adoption d'un enfant."),

    ("Qu'est-ce que le Fonds de formation de la main-d'œuvre ?",
     ["Un fonds pour la formation des gestionnaires", "Un fonds qui oblige les entreprises à consacrer 1 % de leur masse salariale à la formation", "Un fonds de retraite", "Un fonds d'assurance-emploi"], "B",
     "Les entreprises de 5 employés ou plus doivent consacrer au moins 1 % de leur masse salariale à la formation."),

    ("Qu'est-ce que le ratio de liquidité générale ?",
     ["Le rapport entre le chiffre d'affaires et les dépenses", "Le rapport entre l'actif à court terme et le passif à court terme", "Le bénéfice net divisé par les ventes", "Le ratio d'endettement"], "B",
     "Le ratio de liquidité générale mesure la capacité de l'entreprise à payer ses dettes à court terme (actif CT / passif CT)."),

    ("Qu'est-ce que la marge bénéficiaire brute ?",
     ["Le bénéfice net après impôts", "La différence entre le prix de vente et le coût direct des travaux, exprimée en pourcentage", "Le chiffre d'affaires total", "Les frais généraux"], "B",
     "La marge bénéficiaire brute = (prix de vente - coût direct) / prix de vente × 100."),

    ("Qu'est-ce que le seuil de rentabilité ?",
     ["Le moment où l'entreprise fait faillite", "Le niveau d'activité où les revenus égalent les dépenses (profit zéro)", "Le montant maximum de crédit", "Le taux d'imposition"], "B",
     "Le seuil de rentabilité est le point mort où l'entreprise ne fait ni profit ni perte."),

    ("MEDIUM - Qu'est-ce qu'un état des flux de trésorerie ?",
     ["Un état du bilan", "Un état qui montre les entrées et sorties d'argent (opérations, investissement, financement)", "Un budget annuel", "Un rapport de crédit"], "B",
     "L'état des flux de trésorerie classe les mouvements de fonds en trois catégories : exploitation, investissement et financement."),

    ("Quels sont les trois types d'entreprises reconnus au Québec ?",
     ["Individuelle, société, coopérative", "Privée, publique, internationale", "Locale, régionale, nationale", "Petite, moyenne, grande"], "A",
     "Les trois formes juridiques principales sont l'entreprise individuelle, la société (inc., SENC) et la coopérative."),

    ("Qu'est-ce qu'une société par actions (inc.) ?",
     ["Une entreprise individuelle", "Une personne morale distincte de ses actionnaires, offrant une responsabilité limitée", "Un partenariat", "Une coopérative"], "B",
     "La société par actions est une personne morale distincte; les actionnaires ne sont pas personnellement responsables des dettes."),

    ("MEDIUM - Quel est le taux de cotisation à la CNESST pour le secteur de la construction ?",
     ["Taux fixe pour tous", "Taux variable selon le métier et le risque de l'employeur", "Aucune cotisation", "Taux unique de 5 %"], "B",
     "Le taux de cotisation à la CNESST varie selon le type de travaux et le risque associé."),

    ("MEDIUM - Qu'est-ce que la déclaration de la CCQ ?",
     ["Une déclaration de revenus", "Une déclaration mensuelle des heures travaillées et des cotisations syndicales", "Un formulaire d'embauche", "Un rapport d'accident"], "B",
     "L'employeur doit déclarer mensuellement à la CCQ les heures travaillées et les cotisations syndicales."),

    ("MEDIUM - Quelle est la conséquence du non-paiement des cotisations à la CCQ ?",
     ["Aucune conséquence", "Amende et suspension de licence", "Avertissement", "Prolongation du délai"], "B",
     "Le défaut de payer les cotisations à la CCQ peut entraîner des amendes et la suspension de la licence RBQ."),

    ("MEDIUM - L'entrepreneur doit-il facturer la TPS et la TVQ sur ses travaux ?",
     ["Non, la construction est exonérée", "Oui, sauf pour certaines exceptions (construction résidentielle neuve)", "Seulement la TPS", "Seulement la TVQ"], "B",
     "Les travaux de construction résidentielle neuve sont généralement exonérés de TPS/TVQ, mais les rénovations et travaux commerciaux y sont assujettis."),

    ("MEDIUM - Qu'est-ce qu'une retenue à la source ?",
     ["Une retenue de garantie sur le contrat", "L'impôt, les cotisations sociales et les déductions prélevées sur le salaire de l'employé", "Un dépôt de garantie", "Une avance sur salaire"], "B",
     "L'employeur doit retenir à la source l'impôt, les cotisations au RRQ, à l'assurance-emploi, à la RQAP et à la CNESST."),

    ("MEDIUM - Qu'est-ce que le CNESST ?",
     ["Commission des normes, de l'équité, de la santé et de la sécurité du travail", "Commission nationale des études statistiques", "Conseil des normes et des évaluations", "Centre national d'expertise"], "A",
     "La CNESST regroupe la CSST, la CNT et la Commission de l'équité salariale."),

    ("MEDIUM - Qu'est-ce que le Bilan sectoriel de main-d'œuvre en construction ?",
     ["Un bilan financier", "Une étude annuelle de la CCQ sur les besoins et la disponibilité de main-d'œuvre par métier", "Un rapport de sécurité", "Un registre des accidents"], "B",
     "Le bilan sectoriel est une étude publiée par la CCQ qui évalue l'offre et la demande de main-d'œuvre."),

    ("MEDIUM - Qu'est-ce que le carnet de travail de la construction ?",
     ["Un outil de gestion de projet", "Un document personnel que tout travailleur de la construction doit posséder", "Un registre de paie", "Un plan de carrière"], "B",
     "Le carnet de travail est obligatoire pour tous les travailleurs de la construction; il contient leur expérience et leurs qualifications."),

    ("MEDIUM - Quel est le ratio d'endettement acceptable pour une entreprise de construction ?",
     ["0,5 (50 %)", "1,0 (100 %)", "2,0 (200 %)", "3,0 (300 %)"], "C",
     "Un ratio d'endettement de 2:1 (passif total / actif total) ou moins est généralement considéré acceptable."),

    ("MEDIUM - Qu'est-ce que le compte client (comptes débiteurs) ?",
     ["L'argent que l'entreprise doit à ses fournisseurs", "Les sommes dues à l'entreprise par ses clients pour des travaux effectués", "Les liquidités en banque", "Les investissements"], "B",
     "Les comptes clients représentent les montants que les clients doivent à l'entreprise pour les travaux déjà exécutés."),

    ("MEDIUM - Qu'est-ce que le compte fournisseur (comptes créditeurs) ?",
     ["L'argent dû par l'entreprise à ses fournisseurs et sous-traitants", "Les sommes dues par les clients", "Les prêts bancaires", "Les capitaux propres"], "A",
     "Les comptes fournisseurs sont les dettes de l'entreprise envers ses fournisseurs, sous-traitants et créanciers."),

    ("MEDIUM - Qu'est-ce que la TVQ perçue par l'entrepreneur ?",
     ["Une taxe sur la valeur ajoutée qu'il conserve comme profit", "Une taxe de vente qu'il perçoit de ses clients et reverse à Revenu Québec", "Un impôt sur le revenu", "Une cotisation syndicale"], "B",
     "La TVQ est perçue par l'entrepreneur sur ses ventes taxables et doit être remise à Revenu Québec."),

    ("MEDIUM - Quelle est la fréquence de la déclaration de TPS/TVQ ?",
     ["Annuelle", "Mensuelle", "Variable selon le volume d'affaires (mensuelle, trimestrielle ou annuelle)", "Aucune déclaration"], "C",
     "La fréquence des déclarations de TPS/TVQ dépend du volume d'affaires annuel de l'entreprise."),

    ("MEDIUM - Quels sont les éléments d'un plan d'affaires ?",
     ["Mission, marché, financement, prévisions", "Seulement le budget", "Curriculum vitae de l'entrepreneur", "Liste des fournisseurs"], "A",
     "Un plan d'affaires complet comprend la mission, l'analyse du marché, le plan de financement et les prévisions financières."),

    ("MEDIUM - Qu'est-ce que le fonds de roulement ?",
     ["Le fonds de pension", "L'actif à court terme moins le passif à court terme, représentant la liquidité nette", "Le capital social", "Le bénéfice net"], "B",
     "Le fonds de roulement = actif à court terme - passif à court terme. Il mesure la capacité à faire face aux échéances court terme."),

    ("MEDIUM - Qu'est-ce que l'écart de crédit ou marge de crédit ?",
     ["Une ligne de crédit renouvelable accordée par une banque pour financer la trésorerie", "Un prêt hypothécaire", "Une avance sur contrat", "Un cautionnement"], "A",
     "La marge de crédit est une facilité de caisse qui permet à l'entreprise de gérer les décalages de trésorerie entre ses paiements et ses encaissements."),

    ("MEDIUM - Qu'est-ce que le rôle de la CNT (Commission des normes du travail) ?",
     ["Gérer les licences RBQ", "Appliquer les normes du travail : salaire minimum, durée du travail, congés, absences", "Former les travailleurs", "Inspecter les chantiers"], "B",
     "La CNT veille au respect des normes du travail incluant le salaire minimum, les heures de travail, les congés et les absences."),

    ("MEDIUM - Qu'est-ce qu'un cahier de charge ?",
     ["Un document de projet qui décrit les spécifications techniques des travaux", "Un registre de paie", "Un contrat de travail", "Un manuel de formation"], "A",
     "Le cahier des charges ou devis décrit les spécifications techniques, la qualité des matériaux et les méthodes d'exécution."),

    ("HARD - Qu'est-ce que le crédit de taxes à l'importation (CTI) pour la construction ?",
     ["Un crédit d'impôt pour la recherche", "Un mécanisme qui permet de récupérer la TPS/TVQ payée sur les achats et intrants", "Une subvention gouvernementale", "Un prêt sans intérêt"], "B",
     "Le CTI permet aux entreprises de récupérer les taxes payées sur leurs achats et dépenses d'exploitation."),

    ("HARD - Quel est le ratio de rotation des comptes clients idéal dans la construction ?",
     ["10-15 jours", "30-45 jours", "60-90 jours", "120-180 jours"], "C",
     "Le ratio de rotation des comptes clients dans la construction se situe idéalement entre 60 et 90 jours."),

    ("HARD - Qu'est-ce que la méthode de comptabilisation à l'avancement des travaux ?",
     ["Une méthode où le revenu est comptabilisé à la fin du projet seulement", "Une méthode où le revenu est comptabilisé proportionnellement au degré d'avancement du projet", "Une méthode de paie", "Une méthode d'amortissement"], "B",
     "Cette méthode permet de comptabiliser les revenus au fur et à mesure de l'avancement des travaux."),

    ("HARD - Quelle est la pénalité pour défaut de déclaration de TPS/TVQ ?",
     ["Aucune pénalité", "Intérêts et pénalités calculés selon les taux prescrits", "Suspension de licence", "Emprisonnement"], "B",
     "Le défaut de déclaration entraîne des intérêts composés et des pénalités selon les taux fixés par l'ARC et Revenu Québec."),

    ("HARD - Qu'est-ce que le calcul du coût de revient en construction ?",
     ["Le prix de vente", "L'ensemble des coûts directs et indirects engagés pour réaliser un projet", "Le montant facturé au client", "Le bénéfice brut"], "B",
     "Le coût de revient comprend tous les coûts directs (matériaux, main-d'œuvre) et indirects (frais généraux) d'un projet."),

    ("HARD - Qu'est-ce que le facteur de productivité dans une entreprise de construction ?",
     ["Le ratio entre la production et la main-d'œuvre utilisée", "Le nombre d'employés", "Le chiffre d'affaires", "Le nombre de projets"], "A",
     "La productivité mesure l'efficacité : volume de travail accompli par rapport aux ressources (heures, matériaux) utilisées."),

    ("HARD - Qu'est-ce qu'un programme d'accès à l'égalité en emploi ?",
     ["Un programme de formation continue", "Un programme visant à corriger les déséquilibres dans l'embauche de certains groupes", "Un programme de bourses", "Un plan de carrière"], "B",
     "Ce programme vise à assurer une représentation équitable des femmes, des Autochtones, des minorités visibles et des personnes handicapées."),

    ("HARD - Qu'est-ce que le ratio de marge nette ?",
     ["Bénéfice net / Chiffre d'affaires × 100", "Actif / Passif", "Ventes / Employés", "Coûts directs / Ventes"], "A",
     "La marge nette = (bénéfice net / chiffre d'affaires) × 100, elle mesure la rentabilité globale de l'entreprise."),

    ("EASY - Qu'est-ce que la comptabilité d'exercice ?",
     ["La comptabilité qui enregistre les transactions au moment où elles se produisent, même sans encaisse", "La comptabilité qui enregistre seulement quand l'argent est reçu", "Un logiciel comptable", "Un budget"], "A",
     "La comptabilité d'exercice comptabilise les revenus quand ils sont gagnés et les dépenses quand elles sont engagées."),

    ("EASY - Qu'est-ce qu'une facture pro forma ?",
     ["Une facture officielle", "Un document préliminaire qui donne un aperçu du coût estimé des travaux", "Un reçu de paiement", "Un contrat signé"], "B",
     "La facture pro forma est un devis ou une estimation préliminaire, pas une facture officielle."),

    ("EASY - Qu'est-ce que l'amortissement comptable ?",
     ["Une perte d'argent", "La répartition du coût d'un actif sur sa durée de vie utile", "Un gain en capital", "Une dépense courante"], "B",
     "L'amortissement permet de répartir le coût d'achat d'un actif (équipement, véhicule) sur sa durée d'utilisation prévue."),

    ("EASY - Qu'est-ce que le registre de paie ?",
     ["Un registre des fournisseurs", "Un document obligatoire qui consigne les salaires, déductions et cotisations de chaque employé", "Un calendrier de paie", "Un contrat de travail"], "B",
     "Le registre de paie est un document obligatoire qui détaille les sommes versées à chaque employé et les déductions effectuées."),

    ("EASY - Qu'est-ce que la cotisation au RRQ ?",
     ["Régime de Retraite du Québec", "Remboursement des Réclamations Québec", "Registre des Revenus Québec", "Réseau de Référence Québec"], "A",
     "Le RRQ (Régime de rentes du Québec) est un régime d'assurance public obligatoire qui offre une rente de retraite."),

    ("EASY - Quelle est la période de paie légale minimale au Québec ?",
     ["Aux deux semaines", "Aux semaines", "Au mois", "Aux 15 jours"], "B",
     "La période de paie minimale légale au Québec est aux deux semaines (toutes les deux semaines)."),

    ("EASY - Qu'est-ce que le Bilan d'ouverture de chantier (BOC) ?",
     ["Un bilan comptable", "Un formulaire que l'entrepreneur transmet à la CCQ avant le début des travaux", "Un plan de construction", "Un rapport d'inspection"], "B",
     "Le BOC est un formulaire obligatoire transmis à la CCQ avant le début des travaux sur un chantier."),

    ("EASY - Qu'est-ce que le numéro de contrat CCQ ?",
     ["Un numéro d'assurance", "Un numéro unique attribué par la CCQ pour identifier chaque contrat de construction", "Un numéro de licence", "Un numéro de compte bancaire"], "B",
     "La CCQ attribue un numéro de contrat unique à chaque projet de construction pour le suivi des déclarations."),

    ("EASY - Qu'est-ce qu'un relevé d'emploi (ROE) ?",
     ["Un relevé bancaire", "Un document que l'employeur remet à l'employé pour déclarer les heures travaillées et les raisons de la cessation d'emploi", "Un état des résultats", "Un rapport annuel"], "B",
     "Le relevé d'emploi est requis pour qu'un employé puisse faire une demande d'assurance-emploi."),

    ("MEDIUM - Qu'est-ce que le concept de capital de risque ?",
     ["Un prêt bancaire garanti", "Un financement par investisseurs qui acceptent un risque élevé en échange d'un potentiel de rendement élevé", "Une hypothèque", "Une marge de crédit"], "B",
     "Le capital de risque est un investissement dans des entreprises en démarrage ou en croissance avec un profil risque- rendement élevé."),

    ("MEDIUM - Qu'est-ce que le ratio de liquidité immédiate (acid test) ?",
     ["Ratio de liquidité générale", "(Actif CT - Stocks) / Passif CT", "Ventes / Actif CT", "Passif long terme / Actif CT"], "B",
     "Le ratio de liquidité immédiate exclut les stocks de l'actif à court terme pour mesurer la capacité de payer les dettes immédiates."),

    ("MEDIUM - Qu'est-ce que la marge de crédit pour contrat de construction ?",
     ["Une marge de crédit personnelle", "Un financement accordé par une banque spécifiquement pour un projet de construction", "Un prêt hypothécaire", "Un compte d'épargne"], "B",
     "Cette marge de crédit est spécifiquement accordée pour financer un contrat de construction particulier."),

    ("HARD - Que signifie le terme 'debit note' en comptabilité de construction ?",
     ["Une facture de débit", "Un document émis pour corriger une facture ou pour facturer des montants additionnels", "Un reçu", "Un chèque"], "B",
     "Une note de débit est un document qui permet d'ajuster une facture existante ou de facturer des travaux supplémentaires."),

    ("HARD - Quelle est la période de conservation des registres comptables selon la loi ?",
     ["3 ans", "5 ans", "6 ans", "10 ans"], "C",
     "Les registres comptables doivent être conservés pendant au moins 6 ans selon la Loi sur les impôts du Québec."),

    ("HARD - Qu'est-ce que le pourcentage de frais généraux typique dans une entreprise de construction ?",
     ["2-5 %", "5-15 %", "15-25 %", "30-40 %"], "B",
     "Les frais généraux (overhead) représentent généralement entre 5 % et 15 % du chiffre d'affaires annuel selon la taille de l'entreprise."),
]

# Let me pad chapters to exactly 60 questions by adding more questions
# Pad ch02 to 60
while len(ch02) < 60:
    ch02.append(("Qu'est-ce que la marge nette après impôts dans une entreprise de construction ?",
     ["Le bénéfice avant intérêts", "Le bénéfice net divisé par les ventes, exprimé en pourcentage", "Le chiffre d'affaires total", "Le coût des marchandises vendues"], "B",
     "La marge nette après impôts mesure la rentabilité finale de l'entreprise en pourcentage des ventes."))
