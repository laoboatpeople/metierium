-- ============================================================
-- SEED QUESTIONS: Entrepreneur Général RBQ (Chapitres 1-4)
-- 260 questions MCQ en français
-- ============================================================

INSERT INTO "Question" (id, "tradeId", "chapterId", type, difficulty, question, options, answer, explanation, locale, "createdAt", "updatedAt") VALUES

-- ============================================================
-- CHAPITRE 1: Licence RBQ et réglementation (q_entgen_001 à q_entgen_065)
-- ============================================================

-- EASY (questions 1-20)

('q_entgen_001', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'EASY', 'Quel organisme délivre les licences d\'entrepreneur au Québec?',
'["Régie du bâtiment du Québec (RBQ)", "Commission de la construction du Québec (CCQ)", "Ministère du Travail", "Association de la construction du Québec (ACQ)"]', 'A', 'La RBQ est l\'organisme responsable de la délivrance des licences d\'entrepreneur au Québec en vertu de la Loi sur le bâtiment.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_002', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'EASY', 'Quelle est la principale loi qui régit l\'industrie de la construction au Québec?',
'["Loi sur le bâtiment", "Code civil du Québec", "Loi sur les normes du travail", "Loi sur la santé et la sécurité du travail"]', 'A', 'La Loi sur le bâtiment (RLRQ c. B-1.1) est la loi principale qui encadre l\'industrie de la construction au Québec, incluant la délivrance des licences.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_003', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'EASY', 'Quelle est la durée de validité d\'une licence d\'entrepreneur général RBQ?',
'["1 an", "2 ans", "3 ans", "5 ans"]', 'D', 'La licence d\'entrepreneur RBQ est valide pour une période de 5 ans, après quoi elle doit être renouvelée.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_004', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'EASY', 'Quelle catégorie de licence permet de réaliser des travaux de construction de toute nature sans limite de montant?',
'["Sous-catégorie 1.1", "Sous-catégorie 1.2", "Catégorie 2", "Catégorie 3"]', 'A', 'La sous-catégorie 1.1 (entrepreneur général) permet d\'exécuter des travaux de construction de toute nature, sans limite de montant.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_005', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'EASY', 'Quelle est la limite de montant des travaux pour la sous-catégorie 1.2?',
'["20 000 $", "40 000 $", "60 000 $", "100 000 $"]', 'B', 'La sous-catégorie 1.2 permet de réaliser des travaux de construction dont la valeur totale n\'excède pas 40 000 $.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_006', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'EASY', 'Qui est responsable de la sécurité sur un chantier de construction?',
'["L\'entrepreneur général seulement", "Tous les employeurs sur le chantier", "Le maître d\'œuvre seulement", "La CCQ"]', 'B', 'Tous les employeurs présents sur un chantier de construction sont responsables de la sécurité de leurs travailleurs respectifs, conformément à la LSST.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_007', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'EASY', 'Un entrepreneur doit détenir une licence RBQ pour:',
'["Effectuer des travaux de construction d\'une valeur de 10 000 $ et plus", "Effectuer des travaux de construction de toute valeur", "Uniquement pour les travaux publics", "Uniquement pour les travaux résidentiels"]', 'A', 'Tout entrepreneur qui effectue des travaux de construction d\'une valeur de 10 000 $ et plus doit détenir une licence RBQ.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_008', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'EASY', 'Les travaux de construction d\'une valeur inférieure à quel montant sont exemptés de licence RBQ?',
'["5 000 $", "10 000 $", "20 000 $", "40 000 $"]', 'B', 'Les travaux de construction d\'une valeur inférieure à 10 000 $ sont exemptés de l\'obligation de détenir une licence RBQ.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_009', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'EASY', 'Quel est l\'âge minimum pour être dirigeant d\'une entreprise de construction détenant une licence RBQ?',
'["16 ans", "18 ans", "21 ans", "25 ans"]', 'B', 'Le dirigeant d\'une entreprise de construction doit être âgé d\'au moins 18 ans pour obtenir une licence RBQ.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_010', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'EASY', 'Le fait de ne pas détenir une licence RBQ alors qu\'elle est requise constitue:',
'["Une infraction passible d\'amendes", "Une simple omission administrative", "Un privilège pour le client", "Aucune conséquence légale"]', 'A', 'Exercer des activités de construction sans licence requise constitue une infraction à la Loi sur le bâtiment, passible d\'amendes pouvant aller jusqu\'à plusieurs milliers de dollars.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_011', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'EASY', 'Quel type de cautionnement est obligatoire pour les entrepreneurs généraux au Québec?',
'["Cautionnement d\'exécution", "Cautionnement de main-d\'œuvre", "Cautionnement de soumission", "Tous les cautionnements ci-dessus"]', 'B', 'Le cautionnement de main-d\'œuvre (ou cautionnement pour salaires) est obligatoire pour tous les entrepreneurs généraux titulaires d\'une licence RBQ.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_012', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'EASY', 'La RBQ peut refuser de délivrer une licence si le dirigeant:',
'["A un casier judiciaire lié à des infractions en matière de construction", "N\'a pas de diplôme universitaire", "Réside à l\'extérieur du Québec", "Travaille pour un concurrent"]', 'A', 'La RBQ peut refuser une licence si le dirigeant a été déclaré coupable d\'une infraction à la Loi sur le bâtiment ou à une autre loi pertinente dans les 5 dernières années.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_013', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'EASY', 'Qu\'est-ce que le cautionnement de main-d\'œuvre garantit?',
'["Le paiement des salaires des employés", "La qualité des matériaux", "La finition des travaux", "Le respect des échéanciers"]', 'A', 'Le cautionnement de main-d\'œuvre garantit le paiement des salaires et des avantages sociaux dus aux travailleurs employés sur les chantiers.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_014', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'EASY', 'Qui peut demander une licence RBQ au nom d\'une personne morale?',
'["Un dirigeant dûment autorisé", "N\'importe quel employé", "Le comptable de l\'entreprise", "Un avocat externe"]', 'A', 'Seul un dirigeant dûment autorisé par la personne morale peut faire une demande de licence RBQ au nom de celle-ci.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_015', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'EASY', 'La licence RBQ est délivrée pour des catégories et sous-catégories correspondant:',
'["À la nature et à l\'ampleur des travaux que l\'entrepreneur peut effectuer", "Au nombre d\'employés de l\'entreprise", "Au chiffre d\'affaires de l\'entreprise", "À la région où l\'entreprise opère"]', 'A', 'Les licences RBQ sont délivrées par catégories et sous-catégories qui définissent la nature et l\'ampleur des travaux autorisés.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_016', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'EASY', 'Que doit faire un entrepreneur qui change d\'adresse d\'affaires?',
'["Aviser la RBQ dans les 30 jours", "Aviser la RBQ dans les 90 jours", "Renouveler sa licence", "Aucune obligation de le signaler"]', 'A', 'L\'entrepreneur doit aviser la RBQ de tout changement d\'adresse d\'affaires dans les 30 jours suivant le changement.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_017', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'EASY', 'Un entrepreneur peut-il prêter sa licence à un autre entrepreneur?',
'["Oui, avec autorisation écrite", "Non, c\'est interdit", "Oui, moyennant des frais", "Oui, pour un seul projet"]', 'B', 'Il est strictement interdit de prêter sa licence RBQ à une autre personne ou entreprise. Cela constitue une infraction grave.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_018', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'EASY', 'Quel document la RBQ exige-t-elle pour démontrer la compétence d\'un dirigeant?',
'["Un certificat de compétence", "Un diplôme universitaire", "Une attestation de la CCQ", "Un permis de conduire"]', 'A', 'La RBQ exige un certificat de compétence délivré par l\'organisme compétent pour attester de la capacité du dirigeant à gérer une entreprise de construction.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_019', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'EASY', 'Qu\'est-ce que la Loi sur le bâtiment exige concernant les assurances?',
'["Une assurance responsabilité civile d\'au moins 1 000 000 $", "Une assurance vie", "Une assurance invalidité", "Une assurance chômage"]', 'A', 'La Loi sur le bâtiment exige que tout entrepreneur titulaire d\'une licence souscrive une assurance responsabilité civile d\'au moins 1 000 000 $.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_020', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'EASY', 'L\'assurance responsabilité civile couvre:',
'["Les dommages causés à des tiers dans le cadre des travaux", "Les dommages aux outils de l\'entrepreneur", "La perte de revenus de l\'entrepreneur", "Les défauts de construction"]', 'A', 'L\'assurance responsabilité civile couvre les dommages corporels et matériels causés à des tiers dans le cadre des activités de construction.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

-- MEDIUM (questions 21-53)

('q_entgen_021', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'MEDIUM', 'Quelles sont les conséquences d\'une fausse déclaration dans une demande de licence RBQ?',
'["Le refus ou la révocation de la licence", "Une simple lettre d\'avertissement", "Aucune conséquence si corrigée dans les 30 jours", "Une amende de 100 $"]', 'A', 'Toute fausse déclaration dans une demande de licence peut entraîner le refus ou la révocation de la licence par la RBQ.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_022', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'MEDIUM', 'Dans quel délai un entrepreneur doit-il renouveler sa licence après son expiration?',
'["Il peut la renouveler en tout temps avec des frais de retard", "Elle ne peut pas être renouvelée après expiration", "Dans les 60 jours suivant l\'expiration", "Dans les 90 jours suivant l\'expiration"]', 'A', 'Un entrepreneur peut renouveler sa licence après son expiration, mais des frais de retard s\'appliquent et des conditions supplémentaires peuvent être exigées.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_023', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'MEDIUM', 'Le cautionnement de main-d\'œuvre doit être souscrit auprès:',
'["D\'une compagnie d\'assurance ou d\'une institution financière autorisée", "De la RBQ directement", "De la CCQ", "D\'un courtier en valeurs mobilières"]', 'A', 'Le cautionnement de main-d\'œuvre doit être souscrit auprès d\'une compagnie d\'assurance ou d\'une institution financière autorisée à exercer au Québec.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_024', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'MEDIUM', 'Quelle est la différence entre une licence de catégorie 1 et une licence de catégorie 2?',
'["La catégorie 1 concerne les travaux de construction et la catégorie 2 concerne les travaux de rénovation", "La catégorie 1 est pour les entrepreneurs généraux et la catégorie 2 pour les entrepreneurs spécialisés", "La catégorie 1 est réservée aux entreprises et la catégorie 2 aux particuliers", "Il n\'y a pas de différence significative"]', 'B', 'La catégorie 1 est destinée aux entrepreneurs généraux (construction de toute nature) tandis que la catégorie 2 est pour les entrepreneurs spécialisés (un seul métier).', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_025', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'MEDIUM', 'Un entrepreneur doit informer la RBQ d\'un changement de dirigeant dans quel délai?',
'["Dans les 30 jours suivant le changement", "Avant le changement", "Dans les 60 jours suivant le changement", "Au moment du renouvellement de la licence"]', 'B', 'L\'entrepreneur doit obtenir l\'approbation de la RBQ avant tout changement de dirigeant. La demande doit être faite préalablement au changement.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_026', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'MEDIUM', 'Qu\'est-ce que le registre des entreprises de construction (REC)?',
'["Un registre public tenu par la RBQ contenant les renseignements sur les licences", "Un registre interne de la CCQ", "Un registre des employés de la construction", "Un annuaire des fournisseurs"]', 'A', 'Le REC est un registre public tenu par la RBQ qui contient les renseignements relatifs aux licences délivrées aux entrepreneurs.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_027', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'MEDIUM', 'Un entrepreneur peut-il cumuler des licences de plusieurs catégories?',
'["Oui, s\'il satisfait aux exigences de chaque catégorie", "Non, une seule licence par entreprise", "Oui, automatiquement avec la licence principale", "Non, les catégories sont mutuellement exclusives"]', 'A', 'Un entrepreneur peut détenir plusieurs licences de différentes catégories s\'il satisfait aux exigences de qualification pour chacune.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_028', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'MEDIUM', 'Le défaut de fournir un cautionnement de main-d\'œuvre peut entraîner:',
'["La suspension de la licence", "Une simple amende", "Une lettre d\'avertissement", "Aucune conséquence si l\'entreprise paie ses employés"]', 'A', 'Le défaut de fournir ou de maintenir un cautionnement de main-d\'œuvre valide peut entraîner la suspension de la licence par la RBQ.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_029', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'MEDIUM', 'Quelles informations doivent obligatoirement paraître sur les documents d\'affaires d\'un entrepreneur?',
'["Le numéro de licence RBQ", "Le chiffre d\'affaires", "Le nombre d\'employés", "Les coordonnées bancaires"]', 'A', 'Tout document d\'affaires (soumissions, contrats, factures) d\'un entrepreneur doit obligatoirement mentionner son numéro de licence RBQ.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_030', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'MEDIUM', 'Que doit faire un entrepreneur dont la licence a été suspendue?',
'["Cesser immédiatement toute activité de construction", "Continuer les contrats en cours", "Transférer ses contrats à un sous-traitant", "Payer une amende et continuer"]', 'A', 'Un entrepreneur dont la licence est suspendue doit cesser immédiatement toute activité de construction, sous peine de sanctions additionnelles.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_031', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'MEDIUM', 'Quel est le rôle de la CCQ dans l\'industrie de la construction?',
'["Gérer les régimes de retraite et d\'assurance des travailleurs", "Délivrer les licences d\'entrepreneur", "Inspecter les chantiers de construction", "Élaborer le Code de construction"]', 'A', 'La CCQ gère les régimes de retraite, d\'assurance et les avantages sociaux des travailleurs de la construction, ainsi que la classification des employeurs.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_032', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'MEDIUM', 'Un entrepreneur peut-il être tenu responsable des actes de ses sous-traitants?',
'["Oui, dans certains cas selon le contrat et la loi", "Non, chaque entrepreneur est responsable de ses propres actes", "Oui, toujours et sans exception", "Non, la responsabilité revient au donneur d\'ouvrage"]', 'A', 'L\'entrepreneur général peut être tenu responsable des actes de ses sous-traitants, notamment en vertu du Code civil et des obligations contractuelles.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_033', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'MEDIUM', 'Qu\'est-ce que le plan de garantie pour les bâtiments résidentiels neufs?',
'["Un régime obligatoire de protection des acheteurs contre les vices de construction", "Une assurance habitation", "Une garantie prolongée du fabricant", "Un programme facultatif de la RBQ"]', 'A', 'Le plan de garantie pour les bâtiments résidentiels neufs est un régime obligatoire qui protège les acheteurs contre les vices de construction.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_034', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'MEDIUM', 'Qui administre le plan de garantie pour les bâtiments résidentiels neufs?',
'["La Garantie de construction résidentielle (GCR)", "La RBQ", "La CCQ", "Les assureurs privés"]', 'A', 'La Garantie de construction résidentielle (GCR) est l\'organisme qui administre le plan de garantie obligatoire pour les bâtiments résidentiels neufs.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_035', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'MEDIUM', 'Les sous-traitants doivent-ils détenir une licence RBQ?',
'["Oui, s\'ils effectuent des travaux de 10 000 $ et plus", "Non, seule l\'entreprise générale a besoin d\'une licence", "Oui, seulement s\'ils travaillent sur des chantiers publics", "Non, ils sont couverts par la licence de l\'entrepreneur général"]', 'A', 'Les sous-traitants doivent détenir leur propre licence RBQ s\'ils effectuent des travaux d\'une valeur de 10 000 $ et plus.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_036', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'MEDIUM', 'Qu\'est-ce qu\'un dirigeant de fait dans une entreprise de construction?',
'["Une personne qui exerce un contrôle effectif sur l\'entreprise sans être nécessairement inscrite comme dirigeant", "Un employé cadre", "Un actionnaire minoritaire", "Un consultant externe"]', 'A', 'Un dirigeant de fait est une personne qui exerce un contrôle effectif sur l\'entreprise, même si elle n\'est pas officiellement désignée comme dirigeante dans les registres.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_037', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'MEDIUM', 'La RBQ peut-elle vérifier les antécédents judiciaires d\'un dirigeant?',
'["Oui, dans le cadre de l\'évaluation de la demande de licence", "Non, cela violerait la vie privée", "Oui, seulement si le dirigeant consent", "Non, les antécédents judiciaires ne sont pas pertinents"]', 'A', 'La RBQ peut vérifier les antécédents judiciaires d\'un dirigeant dans le cadre du processus d\'évaluation d\'une demande de licence.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_038', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'MEDIUM', 'Que doit faire un entrepreneur qui désire ajouter une sous-catégorie à sa licence existante?',
'["Présenter une demande de modification à la RBQ avec les documents requis", "Attendre le renouvellement de sa licence", "Payer des frais sans fournir de documents", "Aviser la RBQ par téléphone"]', 'A', 'L\'entrepreneur doit présenter une demande de modification de licence à la RBQ, accompagnée des documents démontrant qu\'il satisfait aux exigences de la nouvelle sous-catégorie.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_039', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'MEDIUM', 'Quelle est la période maximale pendant laquelle un entrepreneur peut exercer sans avoir renouvelé sa licence expirée?',
'["Il ne peut pas exercer après l\'expiration, même un jour", "30 jours", "60 jours", "90 jours"]', 'A', 'Un entrepreneur ne peut légalement exercer aucune activité de construction après la date d\'expiration de sa licence, même pour un seul jour.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_040', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'MEDIUM', 'La Loi sur le bâtiment s\'applique à quel type de bâtiments?',
'["À tous les bâtiments et installations", "Uniquement aux bâtiments résidentiels", "Uniquement aux bâtiments commerciaux", "Uniquement aux bâtiments industriels"]', 'A', 'La Loi sur le bâtiment s\'applique à tous les bâtiments et installations, qu\'ils soient résidentiels, commerciaux, industriels ou institutionnels.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_041', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'MEDIUM', 'Qu\'est-ce que le système de classification des entrepreneurs (SCE)?',
'["Un système qui classe les entrepreneurs par compétences et spécialités", "Un système de notation de crédit", "Un système d\'évaluation des chantiers", "Un système de pointage pour les appels d\'offres"]', 'A', 'Le SCE est un système qui permet de classifier les entrepreneurs selon leurs compétences, leur expérience et leurs spécialités pour déterminer les travaux qu\'ils peuvent effectuer.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_042', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'MEDIUM', 'L\'entrepreneur général avec une licence 1.1 peut-il agir comme promoteur immobilier?',
'["Oui, mais des règles supplémentaires s\'appliquent", "Non, c\'est une activité distincte", "Oui, sans restriction", "Non, sauf s\'il détient aussi une licence de courtier immobilier"]', 'A', 'Un entrepreneur général 1.1 peut agir comme promoteur immobilier, mais il doit se conformer aux règles applicables, notamment le plan de garantie résidentielle.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_043', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'MEDIUM', 'Qu\'est-ce qu\'une infraction continue selon la Loi sur le bâtiment?',
'["Une infraction qui se prolonge dans le temps, chaque jour constituant une infraction distincte", "Une infraction qui n\'est pas punissable", "Une infraction commise par négligence", "Une infraction involontaire"]', 'A', 'Une infraction continue est une infraction qui se prolonge dans le temps; chaque jour pendant lequel l\'infraction se poursuit constitue une infraction distincte.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_044', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'MEDIUM', 'Quels sont les recours d\'un client contre un entrepreneur qui ne détient pas la licence appropriée?',
'["Le client peut demander la nullité du contrat et des dommages-intérêts", "Le client n\'a aucun recours", "Le client peut seulement exiger une réduction de prix", "Le client doit s\'adresser à la CCQ"]', 'A', 'Un client peut demander la nullité du contrat et réclamer des dommages-intérêts si l\'entrepreneur ne détenait pas la licence appropriée au moment du contrat.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_045', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'MEDIUM', 'La RBQ peut-elle imposer des conditions particulières à une licence?',
'["Oui, la RBQ peut imposer les conditions qu\'elle juge nécessaires", "Non, les conditions sont fixes", "Oui, mais seulement avec l\'accord de l\'entrepreneur", "Non, la loi ne le permet pas"]', 'A', 'La RBQ peut imposer des conditions particulières à une licence si elle le juge nécessaire pour assurer la protection du public.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_046', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'MEDIUM', 'Qu\'est-ce qu\'une entreprise liée dans le contexte de la licence RBQ?',
'["Une entreprise qui partage des dirigeants ou des actionnaires avec une autre entreprise licenciée", "Une entreprise en partenariat avec une autre", "Une entreprise qui a des contrats avec une autre", "Une entreprise affiliée à un syndicat"]', 'A', 'Des entreprises liées sont des entreprises qui partagent des dirigeants, des actionnaires ou qui sont sous contrôle commun, ce qui peut avoir un impact sur la délivrance des licences.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_047', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'MEDIUM', 'Un entrepreneur doit conserver ses registres comptables pendant combien d\'années?',
'["3 ans", "5 ans", "6 ans", "10 ans"]', 'C', 'Les registres comptables doivent être conservés pendant au moins 6 ans conformément aux exigences fiscales et réglementaires applicables aux entreprises de construction.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_048', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'MEDIUM', 'Quel est le rôle des inspecteurs de la RBQ sur les chantiers?',
'["Vérifier la conformité des travaux avec le Code de construction et les lois applicables", "Superviser les travailleurs", "Gérer les horaires de travail", "Calculer les salaires"]', 'A', 'Les inspecteurs de la RBQ vérifient la conformité des travaux de construction avec les normes du Code de construction et les autres lois applicables.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_049', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'MEDIUM', 'Un entrepreneur peut-il refuser l\'accès à son chantier à un inspecteur de la RBQ?',
'["Non, l\'inspecteur a le droit d\'accéder au chantier en tout temps", "Oui, avec un préavis de 24 heures", "Oui, si le chantier est privé", "Non, mais seulement pendant les heures normales de travail"]', 'A', 'Un inspecteur de la RBQ a le droit d\'accéder à tout chantier de construction en tout temps pour exercer ses fonctions d\'inspection.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_050', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'MEDIUM', 'Quelle est la conséquence de ne pas afficher sa licence sur les chantiers?',
'["Une amende peut être imposée", "Aucune conséquence si la licence est valide", "La licence est automatiquement révoquée", "Un avertissement verbal"]', 'A', 'Le défaut d\'afficher la licence sur les chantiers constitue une infraction passible d\'une amende.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_051', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'MEDIUM', 'Qu\'est-ce que le cautionnement de soumission garantit?',
'["Que l\'entrepreneur honorera sa soumission s\'il est choisi", "Le paiement des salaires", "La qualité des matériaux", "La finition des travaux"]', 'A', 'Le cautionnement de soumission garantit que l\'entrepreneur honorera sa soumission et signera le contrat s\'il est retenu pour le projet.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_052', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'MEDIUM', 'Dans quel cas un entrepreneur peut-il perdre son cautionnement de main-d\'œuvre?',
'["S\'il fait défaut de payer les salaires ou les cotisations sociales", "S\'il termine le projet en retard", "S\'il dépasse le budget", "S\'il utilise des sous-traitants"]', 'A', 'Le cautionnement de main-d\'œuvre peut être perdu si l\'entrepreneur fait défaut de payer les salaires, les avantages sociaux ou les cotisations à la CCQ.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_053', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'MEDIUM', 'Un entrepreneur doit-il fournir un cautionnement d\'exécution pour un contrat privé?',
'["Cela dépend des exigences du contrat", "Oui, c\'est toujours obligatoire", "Non, jamais pour les contrats privés", "Uniquement pour les contrats de plus de 500 000 $"]', 'A', 'Le cautionnement d\'exécution n\'est pas obligatoire par la loi pour les contrats privés, mais le donneur d\'ouvrage peut l\'exiger dans le contrat.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

-- HARD (questions 54-65)

('q_entgen_054', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'HARD', 'Quels sont les critères précis permettant à la RBQ de refuser une demande de licence basée sur le manque de compétence?',
'["L\'absence de certificat de compétence valide et l\'expérience insuffisante", "Le nombre d\'années d\'études du dirigeant", "La taille de l\'entreprise", "Le lieu de résidence du dirigeant"]', 'A', 'La RBQ peut refuser une demande de licence si le dirigeant ne détient pas un certificat de compétence valide ou si l\'expérience est jugée insuffisante pour la catégorie demandée.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_055', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'HARD', 'Comment la RBQ traite-t-elle une demande de licence lorsqu\'un dirigeant a été déclaré coupable d\'une infraction criminelle?',
'["Elle évalue au cas par cas la pertinence de l\'infraction par rapport à l\'activité de construction", "Elle refuse automatiquement la demande", "Elle suspend la demande pendant 5 ans", "Elle approuve la demande après paiement d\'une amende"]', 'A', 'La RBQ évalue au cas par cas chaque situation, en tenant compte de la nature de l\'infraction, du lien avec l\'activité de construction et du temps écoulé depuis la condamnation.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_056', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'HARD', 'Quelle est la différence entre un cautionnement de soumission et un cautionnement d\'exécution en termes de déclenchement?',
'["Le cautionnement de soumission s\'active à l\'octroi du contrat, le cautionnement d\'exécution s\'active en cas de défaut d\'exécution", "Les deux sont activés en même temps", "Le cautionnement d\'exécution s\'active avant la soumission", "Il n\'y a pas de différence"]', 'A', 'Le cautionnement de soumission garantit que l\'entrepreneur signera le contrat s\'il est choisi, tandis que le cautionnement d\'exécution garantit la bonne exécution des travaux.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_057', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'HARD', 'Dans le cadre d\'une fusion d\'entreprises de construction, comment la licence RBQ est-elle transférée?',
'["L\'entreprise issue de la fusion doit faire une nouvelle demande de licence", "La licence est automatiquement transférée", "La licence des deux entreprises reste valide", "Une licence provisoire est délivrée automatiquement"]', 'A', 'Lors d\'une fusion, la nouvelle entité doit présenter une nouvelle demande de licence à la RBQ, car la licence n\'est pas transférable automatiquement.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_058', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'HARD', 'Quels sont les pouvoirs spécifiques d\'un enquêteur de la RBQ en matière de perquisition?',
'["Il peut obtenir un mandat de perquisition et saisir des documents pertinents", "Il peut perquisitionner sans mandat", "Il n\'a aucun pouvoir de perquisition", "Il peut perquisitionner seulement avec le consentement de l\'entrepreneur"]', 'A', 'Les enquêteurs de la RBQ peuvent, sur obtention d\'un mandat de perquisition, accéder à des lieux et saisir des documents pertinents à leur enquête.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_059', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'HARD', 'Quelles sont les règles particulières applicables aux entreprises de construction qui sont des sociétés en commandite?',
'["Le commandité doit détenir le certificat de compétence et répondre aux exigences de la RBQ", "Les commanditaires doivent aussi détenir une licence", "La société en commandite ne peut pas obtenir de licence", "Seul le gérant doit être compétent"]', 'A', 'Dans une société en commandite, c\'est le commandité (associé responsable) qui doit détenir le certificat de compétence et répondre aux exigences de la RBQ.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_060', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'HARD', 'Comment la RBQ traite-t-elle les infractions commises par une personne morale dont un dirigeant est également dirigeant d\'une autre entreprise?',
'["Les deux entreprises peuvent être tenues responsables et leurs licences peuvent être affectées", "Seule l\'entreprise où l\'infraction a été commise est responsable", "Le dirigeant est personnellement responsable mais pas les entreprises", "Aucune conséquence pour l\'autre entreprise"]', 'A', 'Lorsqu\'un dirigeant est commun à plusieurs entreprises, les infractions peuvent affecter les licences de toutes les entreprises concernées.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_061', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'HARD', 'Quels sont les critères d\'évaluation de la solvabilité d\'une entreprise pour l\'obtention d\'une licence RBQ?',
'["La situation financière, le passif, la trésorerie et le ratio de liquidité", "Uniquement le chiffre d\'affaires", "Le nombre d\'employés", "La durée d\'existence de l\'entreprise"]', 'A', 'La RBQ évalue la solvabilité de l\'entreprise en examinant sa situation financière globale, notamment le passif, la trésorerie et les ratios de liquidité.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_062', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'HARD', 'Un entrepreneur peut-il contester une décision de la RBQ de refuser ou suspendre sa licence?',
'["Oui, par un recours devant le Tribunal administratif du Québec (TAQ)", "Non, la décision de la RBQ est sans appel", "Oui, mais seulement devant la Cour supérieure", "Oui, par un recours devant le ministre du Travail"]', 'A', 'Un entrepreneur peut contester une décision de la RBQ devant le Tribunal administratif du Québec (TAQ) dans les 30 jours suivant la notification de la décision.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_063', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'HARD', 'Quelles sont les obligations d\'un entrepreneur en matière d\'affichage du numéro de licence sur ses véhicules?',
'["Les véhicules utilisés pour la construction doivent afficher le numéro de licence", "Seulement les véhicules de service", "Aucune obligation", "Uniquement sur les véhicules loués"]', 'A', 'Les véhicules utilisés dans le cadre des activités de construction doivent afficher le numéro de licence RBQ de l\'entreprise.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_064', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'HARD', 'Qu\'est-ce qu\'un ordre de correction émis par la RBQ et quelles en sont les conséquences?',
'["Une directive écrite exigeant de corriger une non-conformité dans un délai précis; le défaut peut entraîner des sanctions", "Une suggestion d\'amélioration sans caractère obligatoire", "Une amende payable immédiatement", "Un avis de suspension de licence"]', 'A', 'Un ordre de correction est une directive écrite de la RBQ exigeant qu\'une non-conformité soit corrigée dans un délai déterminé, sous peine de sanctions.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_065', 'cmt_entrepreneur_general_001', 'ch_entgen_01', 'MCQ', 'HARD', 'Dans le contexte d\'une licence RBQ, qu\'est-ce que la notion d\'« établissement stable »?',
'["Un lieu d\'affaires fixe où l\'entrepreneur exerce ses activités de façon permanente", "Un chantier temporaire", "Un bureau de poste", "Une adresse de domicile personnel"]', 'A', 'L\'établissement stable est le lieu d\'affaires fixe où l\'entrepreneur exerce ses activités de façon permanente et où les dossiers sont accessibles.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

-- ============================================================
-- CHAPITRE 2: Gestion d'entreprise (q_entgen_066 à q_entgen_130)
-- ============================================================

-- EASY (questions 66-85)

('q_entgen_066', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'EASY', 'Quel organisme est responsable de la classification des employeurs dans l\'industrie de la construction?',
'["La Commission de la construction du Québec (CCQ)", "La RBQ", "Revenu Québec", "Emploi Québec"]', 'A', 'La CCQ est responsable de la classification des employeurs dans l\'industrie de la construction au Québec.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_067', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'EASY', 'Qu\'est-ce que la classification des employeurs détermine?',
'["Les taux de cotisation aux régimes de retraite et d\'assurance", "Le montant de la licence", "Le nombre d\'employés permis", "La région de travail autorisée"]', 'A', 'La classification détermine les taux de cotisation que l\'employeur doit verser aux régimes de retraite et d\'assurance gérés par la CCQ.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_068', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'EASY', 'Quelle taxe doit être facturée sur les travaux de construction au Québec?',
'["La TVQ et la TPS", "Seulement la TPS", "Seulement la TVQ", "Aucune taxe ne s\'applique"]', 'A', 'Les travaux de construction sont assujettis à la TPS (taxe fédérale) et à la TVQ (taxe provinciale) au Québec.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_069', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'EASY', 'Qu\'est-ce qu\'une convention collective dans l\'industrie de la construction?',
'["Une entente négociée entre les associations d\'employeurs et les syndicats régissant les conditions de travail", "Un contrat entre l\'entrepreneur et le client", "Un accord entre la RBQ et la CCQ", "Un règlement gouvernemental"]', 'A', 'La convention collective est une entente négociée entre les associations d\'employeurs et les syndicats qui fixe les conditions de travail dans l\'industrie.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_070', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'EASY', 'Quel est le principal régime de retraite des travailleurs de la construction au Québec?',
'["Le Régime de retraite de l\'industrie de la construction (RRIC)", "Le RRQ", "Le RÉER", "Le CELI"]', 'A', 'Le RRIC est le régime de retraite administré par la CCQ pour les travailleurs de l\'industrie de la construction au Québec.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_071', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'EASY', 'Un entrepreneur doit tenir ses livres comptables selon quelle méthode?',
'["La méthode de la comptabilité d\'engagement", "La méthode de la comptabilité de caisse", "La méthode linéaire", "La méthode dégressive"]', 'A', 'La comptabilité d\'engagement est la méthode généralement requise pour les entreprises de construction, où les revenus et dépenses sont comptabilisés lorsqu\'ils sont réalisés, peu importe le moment de l\'encaissement.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_072', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'EASY', 'Qu\'est-ce que la tenue de registres de paie implique pour l\'entrepreneur?',
'["Conserver les relevés d\'emploi, les déductions à la source et les cotisations", "Afficher les salaires sur les chantiers seulement", "Payer les employés en argent comptant", "Conserver les registres pendant 1 an"]', 'A', 'L\'entrepreneur doit conserver tous les registres de paie incluant les relevés d\'emploi, les déductions à la source, les cotisations sociales, et ce pour la période prévue par la loi.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_073', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'EASY', 'Comment s\'appelle le régime d\'assurance parentale au Québec?',
'["Régime québécois d\'assurance parentale (RQAP)", "Assurance-emploi", "Sécurité de la vieillesse", "Régime de rentes du Québec"]', 'A', 'Le RQAP est le régime québécois qui offre des prestations parentales aux travailleurs du Québec, en remplacement de l\'assurance-emploi pour les congés parentaux.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_074', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'EASY', 'Que doit faire un entrepreneur lorsqu\'il embauche un nouveau travailleur?',
'["L\'inscrire auprès de la CCQ et vérifier son certificat de compétence", "L\'inscrire à l\'assurance-emploi seulement", "Signer un contrat de travail écrit", "Aviser la RBQ"]', 'A', 'L\'entrepreneur doit inscrire tout nouveau travailleur auprès de la CCQ et vérifier qu\'il détient le certificat de compétence approprié.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_075', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'EASY', 'À quelle fréquence un entrepreneur doit-il produire ses déclarations de paie à la CCQ?',
'["Mensuellement", "Annuellement", "Trimestriellement", "Hebdomadairement"]', 'A', 'Les déclarations de paie à la CCQ doivent être produites sur une base mensuelle, avec les cotisations correspondantes.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_076', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'EASY', 'Le formulaire prescrit par la CCQ pour déclarer la paie des employés s\'appelle:',
'["Le relevé mensuel (RM)", "Le T4", "Le Relevé 1", "Le contrat de travail"]', 'A', 'Le relevé mensuel (RM) est le formulaire que les employeurs de la construction doivent transmettre à la CCQ chaque mois pour déclarer la paie.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_077', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'EASY', 'Les salaires dans l\'industrie de la construction sont déterminés par:',
'["La convention collective en vigueur", "Le salaire minimum provincial", "Chaque employeur individuellement", "Le gouvernement du Québec"]', 'A', 'Les salaires et conditions de travail dans l\'industrie de la construction sont déterminés par la convention collective applicable.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_078', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'EASY', 'Qu\'est-ce que la CNESST?',
'["La Commission des normes, de l\'équité, de la santé et de la sécurité du travail", "La Commission de la construction du Québec", "La Régie du bâtiment du Québec", "La Commission nationale de l\'emploi"]', 'A', 'La CNESST est l\'organisme qui veille à l\'application des normes du travail, de l\'équité salariale et de la santé et sécurité du travail au Québec.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_079', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'EASY', 'Un entrepreneur doit s\'inscrire à la CNESST pour:',
'["Obtenir une couverture pour les lésions professionnelles de ses employés", "Obtenir une licence RBQ", "Classer ses employés", "Payer les impôts"]', 'A', 'L\'inscription à la CNESST permet à l\'entrepreneur d\'obtenir une couverture d\'assurance pour les lésions professionnelles subies par ses employés.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_080', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'EASY', 'Quelle est la période de paie habituelle dans l\'industrie de la construction?',
'["Hebdomadaire", "Aux deux semaines", "Mensuelle", "Aux trois semaines"]', 'A', 'Dans l\'industrie de la construction, la période de paie est habituellement hebdomadaire, conformément aux conventions collectives.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_081', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'EASY', 'Qu\'est-ce qu\'un relevé d\'emploi (ROE)?',
'["Un document qui atteste des heures travaillées et du salaire pour l\'assurance-emploi", "Un document fiscal annuel", "Un contrat de travail", "Un relevé de banque"]', 'A', 'Le relevé d\'emploi (ROE) est un document que l\'employeur doit fournir pour tout arrêt de travail afin que l\'employé puisse bénéficier de l\'assurance-emploi.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_082', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'EASY', 'Les entrepreneurs doivent-ils remettre un relevé d\'emploi à la fin d\'un chantier?',
'["Oui, si le travailleur cesse de travailler ou si la période d\'emploi se termine", "Non, jamais pour un chantier", "Oui, seulement si le travailleur le demande", "Non, le ROE n\'est requis que pour les licenciements permanents"]', 'A', 'L\'entrepreneur doit remettre un relevé d\'emploi lorsqu\'un travailleur cesse de travailler, que ce soit à la fin d\'un chantier ou pour toute autre raison.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_083', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'EASY', 'Qu\'est-ce que le certificat de compétence d\'un travailleur de la construction?',
'["Une attestation qui prouve qu\'un travailleur possède les compétences requises pour exercer un métier", "Une licence d\'entrepreneur", "Un diplôme universitaire", "Un permis de conduire"]', 'A', 'Le certificat de compétence, délivré par la CCQ, atteste qu\'un travailleur possède les compétences et la qualification nécessaires pour exercer un métier de la construction.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_084', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'EASY', 'Les cotisations à la CCQ servent principalement à financer:',
'["Les régimes de retraite, d\'assurance et les avantages sociaux des travailleurs", "Les inspections de la RBQ", "Les infrastructures publiques", "La formation professionnelle des entrepreneurs"]', 'A', 'Les cotisations versées à la CCQ servent à financer les régimes de retraite, les assurances collectives et les avantages sociaux des travailleurs de la construction.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_085', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'EASY', 'Qu\'est-ce que le Régime de rentes du Québec (RRQ)?',
'["Un régime public de retraite de base qui couvre tous les travailleurs québécois", "Un régime privé d\'épargne-retraite", "Une assurance parentale", "Un fonds de pension syndical"]', 'A', 'Le RRQ est un régime public obligatoire qui offre une protection de base aux travailleurs québécois en cas de retraite, d\'invalidité ou de décès.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

-- MEDIUM (questions 86-118)

('q_entgen_086', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'MEDIUM', 'Comment la CCQ détermine-t-elle la classification d\'un employeur?',
'["En fonction de la nature prédominante des travaux effectués par l\'entreprise", "En fonction du nombre d\'employés", "En fonction du chiffre d\'affaires", "En fonction de la région"]', 'A', 'La classification de l\'employeur est déterminée selon la nature prédominante des travaux que l\'entreprise effectue habituellement.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_087', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'MEDIUM', 'Quelles sont les conséquences de ne pas payer ses cotisations à la CCQ?',
'["Des pénalités, des intérêts et possiblement des poursuites judiciaires", "Aucune conséquence réelle", "Une simple lettre de rappel", "Une réduction de la cotisation future"]', 'A', 'Le défaut de payer les cotisations à la CCQ entraîne des pénalités, des intérêts sur les arriérés et peut mener à des poursuites judiciaires.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_088', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'MEDIUM', 'Qu\'est-ce que la méthode de l\'avancement des travaux en comptabilité?',
'["Une méthode qui permet de comptabiliser les revenus proportionnellement au degré d\'avancement du projet", "Une méthode de paie", "Une méthode d\'évaluation des stocks", "Une méthode d\'amortissement"]', 'A', 'La méthode de l\'avancement des travaux permet de comptabiliser les revenus d\'un contrat à long terme proportionnellement au degré d\'avancement du projet.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_089', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'MEDIUM', 'Qu\'est-ce que le rapport d\'impôt pour un contrat de construction (T5018)?',
'["Un feuillet fiscal que l\'entrepreneur général doit remettre à ses sous-traitants", "Une déclaration de revenus", "Un rapport de paie pour la CCQ", "Un relevé de TPS/TVQ"]', 'A', 'Le T5018 est un feuillet fiscal que l\'entrepreneur général doit remettre à chaque sous-traitant auquel il a versé des montants pour des services de construction.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_090', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'MEDIUM', 'Dans quel délai un entrepreneur doit-il produire le relevé mensuel à la CCQ?',
'["Au plus tard le 15e jour du mois suivant", "Le dernier jour du mois", "Le 1er jour du mois suivant", "Le 30e jour du mois suivant"]', 'A', 'Le relevé mensuel doit être produit et les cotisations payées au plus tard le 15e jour du mois suivant la période de paie.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_091', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'MEDIUM', 'Qu\'est-ce que la sous-traitance en cascade et pourquoi est-elle problématique?',
'["Un système où un sous-traitant en engage un autre, créant une chaîne qui complexifie les responsabilités", "Un système de sous-traitance organisé par la RBQ", "Un contrat entre plusieurs entrepreneurs", "Un mode de paiement échelonné"]', 'A', 'La sous-traitance en cascade crée une chaîne de sous-traitants qui peut complexifier les relations contractuelles, les responsabilités et les obligations de paiement.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_092', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'MEDIUM', 'Qu\'est-ce que la retenue à la source pour un entrepreneur?',
'["Le montant déduit du salaire d\'un employé pour les impôts et cotisations", "Un montant retenu par le client sur le paiement des travaux", "Un dépôt de garantie", "Une avance sur salaire"]', 'A', 'La retenue à la source est le montant que l\'employeur déduit du salaire brut de l\'employé pour les impôts, le RRQ, l\'AE et le RQAP.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_093', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'MEDIUM', 'Comment l\'entrepreneur doit-il traiter les montants TPS et TVQ sur ses factures?',
'["Les percevoir de ses clients et les remettre aux autorités fiscales", "Les conserver comme profit", "Les verser directement aux employés", "Les déduire de ses dépenses"]', 'A', 'L\'entrepreneur doit percevoir la TPS et la TVQ sur ses factures et les remettre aux autorités fiscales (Revenu Québec pour la TVQ et l\'ARC pour la TPS).', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_094', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'MEDIUM', 'Quels sont les éléments qui doivent figurer sur le bulletin de paie d\'un travailleur de la construction?',
'["Le nombre d\'heures travaillées, le taux horaire, les déductions et les cotisations", "Seulement le salaire net", "Le numéro de licence de l\'entrepreneur", "L\'adresse du chantier"]', 'A', 'Le bulletin de paie doit inclure les heures travaillées, le taux horaire, le salaire brut, toutes les déductions (impôts, RRQ, AE, RQAP, cotisations CCQ) et le salaire net.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_095', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'MEDIUM', 'Qu\'est-ce que le droit de gage légal dans l\'industrie de la construction?',
'["Une protection légale qui permet aux entrepreneurs et sous-traitants de réclamer le paiement de leurs travaux", "Un droit de propriété sur le bâtiment", "Un privilège hypothécaire", "Une retenue de garantie"]', 'A', 'Le droit de gage légal (construction lien) permet à un entrepreneur, sous-traitant ou fournisseur d\'inscrire une hypothèque légale sur un immeuble pour garantir le paiement des travaux.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_096', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'MEDIUM', 'Dans quel délai doit-on inscrire une hypothèque légale de la construction?',
'["Dans les 30 jours suivant la fin des travaux", "Dans les 15 jours suivant le début des travaux", "Dans les 60 jours suivant la signature du contrat", "Dans les 90 jours suivant la facturation"]', 'A', 'L\'hypothèque légale de la construction doit être inscrite dans les 30 jours suivant la fin des travaux ou la cessation du contrat.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_097', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'MEDIUM', 'Qu\'est-ce que la déclaration de souscription d\'un travailleur de la construction?',
'["Le processus par lequel un travailleur adhère aux régimes de la CCQ", "Un contrat d\'embauche", "Une déclaration de revenus", "Une demande de licence"]', 'A', 'La déclaration de souscription est le processus par lequel un travailleur de la construction adhère aux régimes de retraite, d\'assurance et d\'avantages sociaux de la CCQ.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_098', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'MEDIUM', 'Comment un entrepreneur doit-il gérer les acomptes provisionnels reçus des clients?',
'["Les comptabiliser comme un passif jusqu\'à ce que les revenus soient gagnés", "Les considérer comme revenu immédiatement", "Les déposer dans un compte distinct", "Les retourner au client"]', 'A', 'Les acomptes reçus doivent être comptabilisés comme un passif (produits reportés) jusqu\'à ce que les travaux correspondants soient réalisés.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_099', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'MEDIUM', 'Qu\'est-ce qu\'un plan d\'amortissement et pourquoi est-il important pour l\'entrepreneur?',
'["Un tableau qui répartit le coût d\'un actif sur sa durée de vie utile à des fins fiscales et comptables", "Un plan de paiement des fournisseurs", "Un échéancier de projet", "Un budget annuel"]', 'A', 'Le plan d\'amortissement permet de répartir le coût d\'acquisition des immobilisations (équipements, véhicules) sur leur durée de vie utile.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_100', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'MEDIUM', 'Quelle est la responsabilité de l\'entrepreneur en matière d\'équité salariale?',
'["Assurer que la rémunération est égale entre les hommes et les femmes pour un même travail", "Payer le salaire minimum", "Indexer les salaires annuellement", "Offrir des bonus égaux à tous"]', 'A', 'L\'entrepreneur doit se conformer à la Loi sur l\'équité salariale en s\'assurant qu\'il n\'y a pas de discrimination salariale entre les hommes et les femmes.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_101', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'MEDIUM', 'Qu\'est-ce qu\'un état des résultats dans la comptabilité d\'une entreprise de construction?',
'["Un état financier qui présente les revenus et les dépenses sur une période donnée", "Un relevé bancaire", "Une liste des contrats en cours", "Un tableau d\'amortissement"]', 'A', 'L\'état des résultats (ou compte de résultats) présente les revenus gagnés et les dépenses engagées par l\'entreprise au cours d\'une période donnée.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_102', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'MEDIUM', 'Qu\'est-ce que le ratio de liquidité générale et pourquoi est-il important?',
'["Un ratio qui mesure la capacité de l\'entreprise à payer ses dettes à court terme", "Un ratio de rentabilité", "Un ratio d\'endettement", "Un ratio de rotation des stocks"]', 'A', 'Le ratio de liquidité générale (actif à court terme / passif à court terme) mesure la capacité de l\'entreprise à honorer ses obligations financières à court terme.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_103', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'MEDIUM', 'Un entrepreneur doit-il s\'inscrire au fichier de la CCQ avant d\'embaucher des travailleurs?',
'["Oui, l\'inscription doit être faite avant tout embauche", "Non, l\'inscription peut être faite dans les 30 jours", "Oui, mais seulement pour les chantiers de plus de 50 000 $", "Non, l\'inscription se fait au moment de la déclaration annuelle"]', 'A', 'L\'employeur doit s\'inscrire au fichier de la CCQ avant d\'embaucher le premier travailleur de la construction.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_104', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'MEDIUM', 'Qu\'est-ce que l\'assurance-emploi (AE) et comment est-elle financée?',
'["Un régime d\'assurance contre le chômage financé par les cotisations de l\'employeur et de l\'employé", "Une assurance privée", "Un régime financé par le gouvernement seulement", "Une assurance parentale"]', 'A', 'L\'assurance-emploi est un régime fédéral qui offre une protection en cas de perte d\'emploi, financé par les cotisations de l\'employeur et de l\'employé.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_105', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'MEDIUM', 'Qu\'est-ce que le programme « Compétences » de la CCQ?',
'["Un programme de formation et de certification des travailleurs de la construction", "Un programme de prêts aux entreprises", "Un programme de subventions salariales", "Un programme d\'assurance parentale"]', 'A', 'Le programme « Compétences » de la CCQ vise la formation et la certification des travailleurs de la construction pour assurer la qualité de la main-d\'œuvre.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_106', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'MEDIUM', 'Un entrepreneur peut-il contester sa classification auprès de la CCQ?',
'["Oui, il peut demander une révision dans les 30 jours suivant l\'avis de classification", "Non, la classification est définitive", "Oui, en tout temps", "Non, seule la RBQ peut contester la classification"]', 'A', 'L\'employeur peut demander une révision de sa classification dans les 30 jours suivant la réception de l\'avis de classification de la CCQ.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_107', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'MEDIUM', 'Qu\'est-ce que la cotisation de l\'employeur au RRQ?',
'["Un pourcentage du salaire du travailleur que l\'employeur verse au Régime de rentes du Québec", "Un impôt sur le revenu de l\'entreprise", "Une contribution volontaire", "Une taxe sur la masse salariale"]', 'A', 'La cotisation de l\'employeur au RRQ est un pourcentage du salaire du travailleur que l\'employeur doit verser en plus des cotisations du salarié.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_108', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'MEDIUM', 'Comment les dépenses de matériaux sont-elles comptabilisées dans un projet de construction?',
'["Comme des coûts directs affectés au projet spécifique", "Comme des frais généraux", "Comme des dépenses administratives", "Comme des immobilisations"]', 'A', 'Les matériaux utilisés pour un projet spécifique sont des coûts directs directement attribuables à ce projet et comptabilisés comme tels.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_109', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'MEDIUM', 'Qu\'est-ce que le temps supplémentaire et comment est-il rémunéré dans la construction?',
'["Les heures travaillées au-delà des heures normales, rémunérées à un taux majoré selon la convention collective", "Les heures de repas", "Les heures de transport", "Les heures de formation"]', 'A', 'Le temps supplémentaire correspond aux heures travaillées au-delà de la semaine normale de travail et est rémunéré à un taux majoré, généralement 1,5 fois le taux horaire.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_110', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'MEDIUM', 'Qu\'est-ce qu\'un ordre de changement et comment doit-il être géré?',
'["Une modification aux travaux prévus au contrat, qui doit être documentée par écrit et approuvée", "Un changement d\'employé sur le chantier", "Un changement de fournisseur", "Une modification de l\'échéancier"]', 'A', 'Un ordre de changement est une modification aux travaux prévus au contrat original qui doit être documentée par écrit et approuvée par les parties avant d\'être exécutée.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_111', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'MEDIUM', 'Qu\'est-ce que la gestion de la trésorerie et pourquoi est-elle cruciale en construction?',
'["La gestion des entrées et sorties de fonds pour assurer la liquidité nécessaire aux opérations", "La gestion des comptes clients", "La gestion des comptes fournisseurs", "La gestion des emprunts bancaires"]', 'A', 'La gestion de la trésorerie est cruciale en construction car les délais de paiement peuvent être longs et l\'entreprise doit pouvoir payer ses employés et fournisseurs.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_112', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'MEDIUM', 'Que doit faire un entrepreneur lorsqu\'il reçoit un paiement direct du client pour un sous-traitant?',
'["Verser le montant au sous-traitant sans délai", "Conserver le montant comme garantie", '["Verser le montant au sous-traitant dans les 30 jours", "Retourner le paiement au client"]', 'A', 'Lorsqu\'un entrepreneur reçoit un paiement incluant des montants destinés à des sous-traitants, il doit leur verser ces montants sans délai.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_113', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'MEDIUM', 'Qu\'est-ce que le rapport de chantier et pourquoi est-il important?',
'["Un document qui consigne l\'évolution quotidienne des travaux, les incidents et les décisions", "Un rapport financier", "Un rapport de paie", "Un rapport d\'impôt"]', 'A', 'Le rapport de chantier est un document essentiel qui consigne l\'évolution des travaux, les conditions météo, les visiteurs, les incidents et les décisions prises.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_114', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'MEDIUM', 'Quelle est la différence entre un coût direct et un coût indirect dans un projet de construction?',
'["Un coût direct est directement attribuable au projet spécifique; un coût indirect est partagé entre plusieurs projets", "Un coût direct est plus élevé qu\'un coût indirect", "Un coût direct est payé comptant", "Un coût indirect ne peut pas être calculé"]', 'A', 'Les coûts directs (matériaux, main-d\'œuvre) sont directement attribuables à un projet spécifique, tandis que les coûts indirects (administration, loyer) sont partagés.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_115', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'MEDIUM', 'Un entrepreneur doit-il fournir une estimation écrite avant de commencer des travaux?',
'["Oui, une soumission écrite est recommandée et souvent requise pour les contrats", "Non, une entente verbale suffit", "Oui, seulement pour les travaux de plus de 50 000 $", "Non, l\'estimation n\'est pas nécessaire"]', 'A', 'Une soumission écrite détaillée est recommandée et souvent requise pour former un contrat valide, surtout pour des travaux d\'une certaine importance.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_116', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'MEDIUM', 'Qu\'est-ce que la marge bénéficiaire brute dans un projet de construction?',
'["La différence entre le prix du contrat et les coûts directs du projet", "Le profit net après toutes les dépenses", "Le chiffre d\'affaires total", "La différence entre les revenus et les impôts"]', 'A', 'La marge bénéficiaire brute est la différence entre le montant du contrat et les coûts directs (main-d\'œuvre et matériaux) associés au projet.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_117', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'MEDIUM', 'Qu\'est-ce que la Loi sur les normes du travail impose en matière de congés fériés?',
'["Les travailleurs ont droit à des jours fériés chômés et payés selon la loi", "Les travailleurs n\'ont pas droit à des congés fériés dans la construction", "Les congés fériés sont optionnels", "Les congés fériés doivent être pris pendant l\'hiver"]', 'A', 'La Loi sur les normes du travail prévoit des jours fériés chômés et payés pour les travailleurs, avec des conditions spécifiques pour l\'industrie de la construction.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_118', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'MEDIUM', 'Un entrepreneur peut-il exiger qu\'un travailleur fournisse ses propres outils?',
'["Cela dépend de la convention collective et du métier exercé", "Oui, toujours", "Non, jamais", "Oui, seulement pour les travailleurs temporaires"]', 'A', 'La question des outils fournis par le travailleur est généralement régie par la convention collective et peut varier selon le métier dans la construction.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

-- HARD (questions 119-130)

('q_entgen_119', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'HARD', 'Dans le cadre de la Loi sur les relations du travail, la formation professionnelle et la gestion de la main-d\'œuvre dans l\'industrie de la construction (Loi R-20), qu\'est-ce que le « placement syndical »?',
'["Un mécanisme par lequel les syndicats réfèrent des travailleurs aux employeurs selon les besoins", "Un système de sélection des entrepreneurs", "Un processus d\'embauche directe", "Un programme de formation"]', 'A', 'Le placement syndical est un mécanisme prévu par la Loi R-20 par lequel les syndicats réfèrent des travailleurs disponibles aux employeurs qui en font la demande.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_120', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'HARD', 'Quels sont les critères permettant à un entrepreneur de démontrer qu\'un travailleur est un entrepreneur indépendant plutôt qu\'un employé?',
'["Le degré de contrôle, la propriété des outils, le risque de perte et l\'indépendance dans l\'exécution du travail", "Le montant payé", "La durée du contrat", "Le lieu de travail"]', 'A', 'Les critères de distinction entre employé et entrepreneur indépendant incluent le contrôle, la propriété des outils, le risque financier et l\'indépendance dans l\'exécution.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_121', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'HARD', 'Comment fonctionne le système de cotisation à la CCQ pour un employeur qui a des travailleurs dans plusieurs classifications?',
'["Il doit cotiser au taux correspondant à chaque classification pour les heures travaillées dans chacune", "Il paie le taux le plus élevé pour tous ses travailleurs", "Il paie un taux moyen pondéré", "Il choisit un taux unique applicable à tous"]', 'A', 'L\'employeur doit appliquer le taux de cotisation approprié pour chaque classification, en fonction des heures réellement travaillées dans chaque catégorie.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_122', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'HARD', 'Qu\'est-ce que le passif de retraite et comment affecte-t-il les états financiers d\'une entreprise de construction?',
'["L\'obligation de l\'employeur de cotiser au régime de retraite, apparaissant comme un passif au bilan", "Un actif de l\'entreprise", "Une dépense future seulement", "Un élément hors bilan"]', 'A', 'Le passif de retraite représente l\'obligation de l\'employeur de verser des cotisations au régime de retraite pour les services déjà rendus par les travailleurs.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_123', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'HARD', 'Quelles sont les règles spécifiques concernant le travail en dehors des heures normales pour les travailleurs de la construction syndiqués?',
'["Les majorations de salaire et les conditions sont déterminées par la convention collective applicable", "Le travail hors heures normales est interdit", "Aucune règle spécifique", "Le taux horaire est doublé automatiquement"]', 'A', 'Les conditions de travail en dehors des heures normales, incluant les majorations salariales, sont déterminées par la convention collective applicable à l\'employeur.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_124', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'HARD', 'Comment l\'entrepreneur doit-il traiter comptablement les retenues de garantie sur les contrats?',
'["Les comptabiliser comme un actif (créance) jusqu\'à leur libération", "Les considérer comme une perte", "Les ignorer dans les états financiers", "Les comptabiliser comme un passif"]', 'A', 'Les retenues de garantie sont des montants que le client retient jusqu\'à la fin des travaux; elles sont comptabilisées comme un actif (créance) dans les livres de l\'entrepreneur.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_125', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'HARD', 'Qu\'est-ce que le mécanisme de la portabilité des avantages sociaux dans l\'industrie de la construction?',
'["La possibilité pour un travailleur de conserver ses avantages sociaux en changeant d\'employeur dans l\'industrie", "Le transfert des avantages sociaux à la retraite", "Un système d\'assurance portable", "Un régime de prêts aux travailleurs"]', 'A', 'La portabilité permet aux travailleurs de la construction de conserver leurs avantages sociaux (assurance, retraite) même en changeant d\'employeur au sein de l\'industrie.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_126', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'HARD', 'Qu\'est-ce que le ratio d\'endettement et comment est-il utilisé dans l\'évaluation d\'une entreprise de construction?',
'["Un ratio qui mesure le niveau d\'endettement par rapport aux fonds propres, utilisé par les banques et la RBQ", "Un ratio de profitabilité", "Un ratio d\'efficacité opérationnelle", "Un ratio de rotation de la main-d\'œuvre"]', 'A', 'Le ratio d\'endettement (dettes / fonds propres) mesure le levier financier de l\'entreprise et est utilisé par les institutions financières et la RBQ.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_127', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'HARD', 'Quelles sont les obligations d\'un entrepreneur en matière de formation continue pour ses travailleurs?',
'["Il doit permettre aux travailleurs de suivre les formations obligatoires selon la Loi R-20 et les conventions collectives", "Aucune obligation", "Seulement pour les apprentis", "Uniquement la formation en santé et sécurité"]', 'A', 'L\'employeur doit permettre aux travailleurs de suivre les formations obligatoires prévues par la Loi R-20 et les conventions collectives, notamment pour le maintien des compétences.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_128', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'HARD', 'Comment fonctionne la déclaration trimestrielle des retenues à la source pour un entrepreneur de construction?',
'["L\'entrepreneur doit produire une déclaration de retenues à la source (TPS, TVQ, impôts) à chaque trimestre ou selon la fréquence déterminée par Revenu Québec", "Une déclaration annuelle suffit", "Les retenues sont versées directement par les employés", "Les retenues sont optionnelles"]', 'A', 'L\'entrepreneur doit produire des déclarations de retenues à la source selon la fréquence déterminée par Revenu Québec, généralement mensuelle ou trimestrielle.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_129', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'HARD', 'Qu\'est-ce qu\'un contrat à forfait et comment les risques sont-ils répartis?',
'["Un contrat à prix fixe où l\'entrepreneur assume le risque de dépassement des coûts", "Un contrat où le client paie les coûts réels plus une marge", "Un contrat basé sur le temps et les matériaux", "Un contrat sans engagement financier"]', 'A', 'Dans un contrat à forfait (prix fixe), l\'entrepreneur s\'engage à réaliser les travaux pour un montant déterminé et assume le risque de dépassement des coûts.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_130', 'cmt_entrepreneur_general_001', 'ch_entgen_02', 'MCQ', 'HARD', 'Quelles sont les conséquences fiscales pour un entrepreneur qui utilise incorrectement la méthode de l\'avancement des travaux?',
'["Une réévaluation des revenus par l\'ARC et Revenu Québec avec pénalités et intérêts", "Aucune conséquence", "Une simple correction comptable", "Un remboursement d\'impôt automatique"]', 'A', 'L\'utilisation incorrecte de la méthode de l\'avancement des travaux peut entraîner une réévaluation des revenus imposables par les autorités fiscales, avec pénalités et intérêts.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

-- ============================================================
-- CHAPITRE 3: Contrats et droit de la construction (q_entgen_131 à q_entgen_195)
-- ============================================================

-- EASY (questions 131-150)

('q_entgen_131', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'EASY', 'Quel article du Code civil du Québec traite du contrat d\'entreprise?',
'["Les articles 2098 à 2129", "Les articles 1458 à 1469", "Les articles 1800 à 1850", "Les articles 2200 à 2250"]', 'A', 'Les articles 2098 à 2129 du Code civil du Québec sont spécifiquement consacrés au contrat d\'entreprise ou de service.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_132', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'EASY', 'Qu\'est-ce qu\'un contrat d\'entreprise au sens du Code civil du Québec?',
'["Un contrat par lequel une personne s\'engage à effectuer un travail matériel ou intellectuel pour une autre personne, moyennant un prix", "Un contrat de vente", "Un contrat de location", "Un contrat de travail"]', 'A', 'Le contrat d\'entreprise est défini comme une entente par laquelle une personne (l\'entrepreneur) s\'engage à effectuer un travail pour une autre (le client), moyennant un prix.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_133', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'EASY', 'Qu\'est-ce qu\'un contrat à forfait?',
'["Un contrat où le prix est fixé à l\'avance pour l\'ensemble des travaux", "Un contrat où le prix est déterminé après les travaux", "Un contrat sans prix convenu", "Un contrat négocié quotidiennement"]', 'A', 'Le contrat à forfait est un contrat par lequel l\'entrepreneur s\'engage à réaliser des travaux pour un prix global déterminé à l\'avance.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_134', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'EASY', 'Qu\'est-ce qu\'un contrat à gré à gré?',
'["Un contrat négocié directement entre les parties contractantes", "Un contrat imposé par le gouvernement", "Un contrat standardisé", "Un contrat sans négociation"]', 'A', 'Le contrat à gré à gré est un contrat librement négocié entre les parties, sans appel d\'offres public.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_135', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'EASY', 'Qu\'est-ce que le cautionnement d\'exécution?',
'["Une garantie qui protège le client si l\'entrepreneur n\'exécute pas correctement ses obligations", "Un contrat d\'assurance", "Une garantie de soumission", "Un dépôt de garantie"]', 'A', 'Le cautionnement d\'exécution garantit au client que l\'entrepreneur exécutera ses obligations contractuelles conformément au contrat.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_136', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'EASY', 'Qu\'est-ce que la responsabilité civile extracontractuelle?',
'["La responsabilité qui découle d\'un préjudice causé à autrui sans qu\'il y ait de contrat entre les parties", "La responsabilité prévue au contrat", "La responsabilité criminelle", "La responsabilité professionnelle"]', 'A', 'La responsabilité extracontractuelle (art. 1457 C.c.Q.) s\'applique lorsqu\'une personne cause un préjudice à autrui en dehors de tout lien contractuel.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_137', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'EASY', 'Qui est le donneur d\'ouvrage dans un contrat de construction?',
'["La personne pour qui les travaux sont exécutés (le client)", "L\'entrepreneur", "Le sous-traitant", "L\'architecte"]', 'A', 'Le donneur d\'ouvrage est la personne physique ou morale pour qui les travaux de construction sont réalisés.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_138', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'EASY', 'Quels sont les éléments essentiels d\'un contrat de construction valide?',
'["Le consentement des parties, un objet déterminé et une cause licite", "Un nombre minimal de pages", "La signature d\'un notaire", "L\'enregistrement à la RBQ"]', 'A', 'Les éléments essentiels de tout contrat, incluant le contrat de construction, sont le consentement, la capacité, un objet déterminé et une cause licite.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_139', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'EASY', 'Qu\'est-ce qu\'un vice caché?',
'["Un défaut de la chose vendue ou construite qui existait avant la vente et qui n\'était pas apparent", "Un défaut visible", "Un défaut causé par l\'acheteur", "Un défaut esthétique"]', 'A', 'Un vice caché est un défaut qui existait au moment de la vente ou de la réception des travaux, qui n\'était pas apparent et qui rend la chose impropre à son usage.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_140', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'EASY', 'Un sous-traitant a-t-il un lien contractuel direct avec le client (donneur d\'ouvrage)?',
'["Non, le lien contractuel est entre le sous-traitant et l\'entrepreneur général", "Oui, directement", "Oui, si le contrat le prévoit", "Non, jamais"]', 'A', 'Le sous-traitant a un lien contractuel avec l\'entrepreneur général, et non directement avec le donneur d\'ouvrage, sauf disposition contraire.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_141', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'EASY', 'Qu\'est-ce que la réception des travaux?',
'["L\'acte par lequel le client accepte les travaux et constate qu\'ils sont conformes au contrat", "Le début des travaux", "La facturation des travaux", "La signature du contrat"]', 'A', 'La réception des travaux est l\'acte par lequel le donneur d\'ouvrage accepte les travaux et constate qu\'ils sont conformes aux stipulations du contrat.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_142', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'EASY', 'Qu\'est-ce qu\'une soumission en matière de contrat de construction?',
'["Une offre de service détaillée présentée par l\'entrepreneur au client potentiel", "Une commande de matériaux", "Un contrat final", "Un paiement anticipé"]', 'A', 'Une soumission est une offre de service faite par un entrepreneur à un client potentiel, décrivant les travaux, les matériaux, les délais et le prix.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_143', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'EASY', 'Qu\'est-ce que le cautionnement de garantie de paiement?',
'["Une garantie pour assurer le paiement des sous-traitants et des fournisseurs", "Une garantie de soumission", "Une garantie d\'exécution", "Une assurance responsabilité"]', 'A', 'Le cautionnement de garantie de paiement (ou cautionnement pour sous-traitants) assure que les sous-traitants et fournisseurs seront payés pour leurs travaux et matériaux.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_144', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'EASY', 'Qu\'est-ce qu\'une clause pénale dans un contrat de construction?',
'["Une clause qui prévoit une pénalité en cas d\'inexécution des obligations contractuelles", "Une clause d\'indexation des prix", "Une clause de non-concurrence", "Une clause de confidentialité"]', 'A', 'La clause pénale est une disposition contractuelle qui fixe à l\'avance le montant des dommages-intérêts en cas d\'inexécution des obligations.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_145', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'EASY', 'Un contrat de construction doit-il obligatoirement être écrit?',
'["Il est fortement recommandé qu\'il soit écrit pour être valide et opposable", "Non, il peut être verbal", "Oui, il doit obligatoirement être notarié", "Non, la forme est libre"]', 'A', 'Bien que la forme écrite ne soit pas toujours obligatoire pour la validité du contrat, elle est fortement recommandée pour prouver son contenu et éviter les litiges.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_146', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'EASY', 'Qui est responsable des dommages causés aux voisins pendant un chantier de construction?',
'["L\'entrepreneur qui exécute les travaux", "Le donneur d\'ouvrage seulement", "La municipalité", "Personne n\'est responsable"]', 'A', 'L\'entrepreneur est responsable des dommages causés aux voisins dans le cadre de l\'exécution de ses travaux, en vertu de la responsabilité extracontractuelle.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_147', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'EASY', 'Qu\'est-ce que la garantie légale de conformité?',
'["Le droit de l\'acheteur d\'exiger que le bien soit conforme à ce qui a été convenu", "Une garantie prolongée payante", "Une assurance supplémentaire", "Un contrat d\'entretien"]', 'A', 'La garantie légale de conformité oblige l\'entrepreneur à livrer un ouvrage conforme aux spécifications convenues dans le contrat.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_148', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'EASY', 'Qu\'est-ce que la résiliation d\'un contrat de construction?',
'["La fin anticipée du contrat par l\'une ou l\'autre des parties pour un motif valable", "La fin normale du contrat après achèvement des travaux", "La prolongation du contrat", "La modification du contrat"]', 'A', 'La résiliation est la fin anticipée du contrat avant l\'achèvement des travaux, généralement pour inexécution ou par consentement mutuel.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_149', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'EASY', 'Qu\'est-ce qu\'un contrat de sous-traitance?',
'["Un contrat par lequel l\'entrepreneur général confie une partie des travaux à un autre entrepreneur", "Un contrat entre le client et l\'architecte", "Un contrat de vente de matériaux", "Un contrat de travail"]', 'A', 'Le contrat de sous-traitance est un contrat par lequel l\'entrepreneur général (l\'entrepreneur principal) confie l\'exécution d\'une partie des travaux à un sous-traitant.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_150', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'EASY', 'Dans quel délai un entrepreneur peut-il réclamer un solde impayé après la fin des travaux?',
'["Dans les 3 ans suivant la fin des travaux, selon le Code civil", "Dans les 6 mois", "Dans les 30 jours", "Dans les 5 ans"]', 'A', 'Le délai de prescription pour une réclamation contractuelle est de 3 ans à compter de la date où le droit d\'action est né, conformément au Code civil du Québec.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

-- MEDIUM (questions 151-183)

('q_entgen_151', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'MEDIUM', 'Qu\'est-ce que la solidarité dans un contrat de construction impliquant plusieurs entrepreneurs?',
'["Un mécanisme où chaque entrepreneur peut être tenu responsable de la totalité de la dette", "Une obligation individuelle", "Une responsabilité partagée également", "Une exonération de responsabilité"]', 'A', 'La solidarité signifie que chaque débiteur peut être tenu responsable de la totalité de l\'obligation, et non seulement de sa part, selon le Code civil.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_152', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'MEDIUM', 'Qu\'est-ce que l\'action directe d\'un sous-traitant contre le donneur d\'ouvrage?',
'["Le droit du sous-traitant de réclamer directement son paiement au donneur d\'ouvrage si l\'entrepreneur général ne le paie pas", "Une action en justice contre le client", "Une procédure accélérée", "Un recours hypothécaire"]', 'A', 'L\'action directe permet au sous-traitant de réclamer directement au donneur d\'ouvrage le paiement de ses travaux si l\'entrepreneur général ne l\'a pas payé.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_153', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'MEDIUM', 'Qu\'est-ce que la clause de règlement des différends dans un contrat de construction?',
'["Une clause qui prévoit le processus à suivre en cas de litige (médiation, arbitrage ou tribunal)", "Une clause qui annule le contrat en cas de litige", "Une clause qui favorise toujours l\'entrepreneur", "Une clause qui impose des pénalités"]', 'A', 'La clause de règlement des différends prévoit les mécanismes de résolution des conflits, comme la médiation, l\'arbitrage ou le recours aux tribunaux.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_154', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'MEDIUM', 'Comment les contrats de construction publique sont-ils généralement attribués?',
'["Par appel d\'offres public, conformément aux lois applicables", "Par négociation directe", "Par tirage au sort", "Par désignation gouvernementale"]', 'A', 'Les contrats de construction publique sont généralement attribués par un processus d\'appel d\'offres public, transparent et concurrentiel.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_155', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'MEDIUM', 'Qu\'est-ce que l\'inexécution contractuelle dans le cadre d\'un contrat de construction?',
'["Le fait pour une partie de ne pas respecter ses obligations prévues au contrat", "Une exécution partielle acceptée", "Une modification du contrat", "Une suspension temporaire"]', 'A', 'L\'inexécution contractuelle survient lorsqu\'une partie ne respecte pas ses obligations (délai, qualité, prix) telles que prévues au contrat.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_156', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'MEDIUM', 'Qu\'est-ce que le droit de rétention d\'un entrepreneur sur un chantier?',
'["Le droit de l\'entrepreneur de suspendre les travaux si le client ne paie pas", "Le droit de retenir les outils du client", "Le droit de prendre possession du chantier", "Le droit de refuser l\'accès au chantier"]', 'A', 'Le droit de rétention permet à l\'entrepreneur de suspendre l\'exécution des travaux si le client ne respecte pas ses obligations de paiement.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_157', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'MEDIUM', 'Qu\'est-ce qu\'un avenant à un contrat de construction?',
'["Une modification ou un ajout au contrat original, signé par les deux parties", "Un nouveau contrat qui remplace l\'ancien", "Une annexe technique", "Un procès-verbal de réunion"]', 'A', 'Un avenant est un document qui modifie les termes du contrat original (portée, prix, délais) et qui doit être signé par les deux parties.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_158', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'MEDIUM', 'Qu\'est-ce que la force majeure dans un contrat de construction?',
'["Un événement imprévisible, irrésistible et extérieur aux parties qui suspend ou libère des obligations", "Une clause qui pénalise l\'entrepreneur", "Une garantie de performance", "Une obligation de résultat"]', 'A', 'La force majeure est un événement imprévisible et irrésistible (catastrophe naturelle, guerre) qui libère les parties de leurs obligations contractuelles.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_159', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'MEDIUM', 'Qu\'est-ce que la caution personnelle donnée par un dirigeant d\'entreprise?',
'["Un engagement personnel du dirigeant à garantir les obligations de son entreprise envers le client", "Une assurance personnelle", "Un dépôt d\'argent", "Une garantie hypothécaire"]', 'A', 'La caution personnelle est un engagement par lequel le dirigeant garantit personnellement les obligations de son entreprise envers le client.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_160', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'MEDIUM', 'Comment les contrats de construction doivent-ils traiter les modifications imprévues?',
'["Par des ordres de changement écrits approuvés par les deux parties", "Par des ententes verbales", "Par des modifications unilatérales", "Par l\'arrêt des travaux"]', 'A', 'Toute modification imprévue aux travaux doit faire l\'objet d\'un ordre de changement écrit, approuvé et signé par les deux parties.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_161', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'MEDIUM', 'Qu\'est-ce que l\'obligation de résultat de l\'entrepreneur?',
'["L\'obligation d\'atteindre un résultat précis convenu au contrat, sous réserve des aléas normaux", "Une obligation de faire de son mieux", "Une obligation de livrer les matériaux", "Une obligation de respecter le budget"]', 'A', 'L\'obligation de résultat signifie que l\'entrepreneur s\'engage à livrer un ouvrage conforme aux spécifications, à la différence d\'une simple obligation de moyens.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_162', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'MEDIUM', 'Qu\'est-ce que la clause de dédit dans un contrat de construction?',
'["Une clause qui permet à une partie de se retirer du contrat moyennant le paiement d\'une indemnité", "Une clause de résiliation automatique", "Une clause de non-concurrence", "Une clause de confidentialité"]', 'A', 'La clause de dédit permet à l\'une ou l\'autre des parties de se retirer du contrat avant son exécution, moyennant le paiement d\'une somme déterminée.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_163', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'MEDIUM', 'Dans le cadre d\'un contrat de construction, que signifie le terme « CAC » (Contrat d\'approvisionnement et de construction)?',
'["Un contrat standardisé utilisé dans l\'industrie de la construction", "Un contrat de crédit", "Un contrat d\'assurance construction", "Un contrat de location"]', 'A', 'Le CAC (Contrat d\'approvisionnement et de construction) est un modèle de contrat standardisé utilisé dans l\'industrie de la construction au Québec.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_164', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'MEDIUM', 'Qu\'est-ce que la médiation dans le contexte des litiges de construction?',
'["Un processus volontaire de résolution de conflit assisté par un médiateur neutre", "Un jugement rendu par un tribunal", "Une procédure d\'arbitrage", "Une négociation directe sans tiers"]', 'A', 'La médiation est un processus volontaire où un tiers neutre (le médiateur) aide les parties à trouver une solution mutuellement acceptable à leur litige.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_165', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'MEDIUM', 'Qu\'est-ce que l\'arbitrage dans un différend de construction?',
'["Un processus où un arbitre impartial rend une décision qui lie les parties, sans passer par les tribunaux", "Une médiation non contraignante", "Un procès public", "Une négociation de dernière chance"]', 'A', 'L\'arbitrage est un mode alternatif de résolution des conflits où un ou plusieurs arbitres rendent une décision exécutoire et sans appel.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_166', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'MEDIUM', 'Quelles sont les obligations de l\'entrepreneur en matière de garantie des vices cachés après la réception des travaux?',
'["Garantir l\'ouvrage contre les vices cachés pendant la période prévue par la loi", "Aucune obligation après la réception", "Une garantie d\'un an", "Une garantie qui débute à la signature du contrat"]', 'A', 'L\'entrepreneur est tenu à la garantie contre les vices cachés pour une période qui peut varier selon la nature du vice, conformément au Code civil.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_167', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'MEDIUM', 'Qu\'est-ce que la responsabilité solidaire des constructeurs d\'un bâtiment (art. 2118 C.c.Q.)?',
'["La responsabilité de l\'architecte, de l\'ingénieur et de l\'entrepreneur pour la perte de l\'ouvrage pendant 5 ans", "La responsabilité individuelle de chaque constructeur", "La responsabilité du seul entrepreneur général", "La responsabilité du donneur d\'ouvrage"]', 'A', 'L\'article 2118 C.c.Q. prévoit la responsabilité solidaire de l\'architecte, de l\'ingénieur et de l\'entrepreneur pour la perte de l\'ouvrage dans les 5 ans.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_168', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'MEDIUM', 'Qu\'est-ce qu\'une hypothèque légale de la construction?',
'["Une sûreté que peuvent inscrire les constructeurs et fournisseurs pour garantir le paiement des travaux", "Un prêt hypothécaire", "Une assurance habitation", "Un contrat de vente"]', 'A', 'L\'hypothèque légale de la construction est une sûreté légale qui permet aux personnes ayant participé à la construction d\'être payées sur le produit de la vente de l\'immeuble.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_169', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'MEDIUM', 'Qu\'est-ce que la clause d\'indexation dans un contrat de construction?',
'["Une clause qui permet d\'ajuster le prix du contrat en fonction de l\'inflation ou de l\'augmentation des coûts", "Une clause qui fixe le prix final", "Une clause de rabais", "Une clause de pénalité"]', 'A', 'La clause d\'indexation permet de réviser le prix du contrat en fonction de l\'évolution de l\'indice des prix ou des coûts des matériaux.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_170', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'MEDIUM', 'Qu\'est-ce que le privilège de l\'entrepreneur sur les matériaux livrés?',
'["Le droit de l\'entrepreneur de reprendre possession des matériaux non payés livrés sur le chantier", "Un droit de propriété", "Une clause contractuelle", "Un dépôt de garantie"]', 'A', 'Le privilège de l\'entrepreneur lui permet de reprendre possession des matériaux qu\'il a livrés sur le chantier et qui n\'ont pas été payés.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_171', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'MEDIUM', 'Qu\'est-ce qu\'un contrat à administration (coût + marge)?',
'["Un contrat où le client paie les coûts réels des travaux plus une marge de profit convenue", "Un contrat à prix fixe", "Un contrat à forfait", "Un contrat clé en main"]', 'A', 'Le contrat à administration (cost-plus) prévoit que le client rembourse les coûts réels engagés par l\'entrepreneur, plus une marge de profit convenue.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_172', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'MEDIUM', 'Qu\'est-ce que la garantie pour vices de conception dans un contrat de construction?',
'["L\'obligation de l\'entrepreneur et des professionnels de livrer un ouvrage exempt de défauts de conception", "Une garantie sur les matériaux seulement", "Une assurance que l\'entrepreneur souscrit pour lui-même", "Une clause de non-responsabilité"]', 'A', 'La garantie contre les vices de conception est une obligation légale qui protège le client contre les défauts de conception affectant la solidité ou l\'usage de l\'ouvrage.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_173', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'MEDIUM', 'Comment un entrepreneur peut-il protéger ses droits en cas de non-paiement par le client?',
'["En inscrivant une hypothèque légale et en exerçant les recours prévus par la loi", "En arrêtant le chantier sans préavis", "En détruisant les travaux effectués", "En facturant des intérêts punitifs"]', 'A', 'Les recours en cas de non-paiement incluent l\'inscription d\'une hypothèque légale, l\'action directe et les procédures judiciaires appropriées.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_174', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'MEDIUM', 'Qu\'est-ce qu\'un contrat clé en main (turnkey)?',
'["Un contrat où l\'entrepreneur livre un ouvrage complet et prêt à être utilisé", "Un contrat où le client fournit tous les matériaux", "Un contrat de rénovation", "Un contrat de service uniquement"]', 'A', 'Le contrat clé en main confie à l\'entrepreneur la responsabilité complète du projet, de la conception à la livraison finale, l\'ouvrage étant prêt à l\'emploi.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_175', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'MEDIUM', 'Quelles sont les conséquences d\'un contrat de construction conclu sans licence appropriée?',
'["Le contrat peut être déclaré nul et l\'entrepreneur peut perdre son droit au paiement", "Le contrat reste valide mais l\'entrepreneur paie une amende", "Aucune conséquence si les travaux sont bien exécutés", "Le client doit quand même payer"]', 'A', 'Un contrat conclu sans licence appropriée peut être déclaré nul et l\'entrepreneur peut perdre son droit de réclamer le paiement des travaux effectués.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_176', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'MEDIUM', 'Qu\'est-ce que l\'exception d\'inexécution dans un contrat de construction?',
'["Le droit d\'une partie de suspendre sa propre exécution si l\'autre partie n\'exécute pas ses obligations", "Une exception qui annule le contrat", "Une clause de résiliation", "Un recours en dommages"]', 'A', 'L\'exception d\'inexécution permet à une partie de suspendre l\'exécution de ses obligations si l\'autre partie n\'exécute pas les siennes.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_177', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'MEDIUM', 'Qu\'est-ce qu\'un contrat de construction de type « conception-construction » (design-build)?',
'["Un contrat où le même entrepreneur est responsable à la fois de la conception et de la réalisation du projet", "Un contrat où la conception est séparée de la construction", "Un contrat de rénovation seulement", "Un contrat standard de l\'architecte"]', 'A', 'Le contrat conception-construction (design-build) confie à un même contractant la responsabilité de la conception et de la réalisation du projet.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_178', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'MEDIUM', 'Quelle est la responsabilité de l\'entrepreneur envers les sous-traitants en matière de paiement?',
'["Il doit payer ses sous-traitants pour les travaux exécutés, même s\'il n\'a pas été payé par le client", "Il n\'a aucune obligation avant d\'être payé", "Les sous-traitants doivent se faire payer par le client", "Le paiement est à la discrétion de l\'entrepreneur"]', 'A', 'L\'entrepreneur général est tenu de payer ses sous-traitants pour les travaux qu\'ils ont exécutés, indépendamment de son propre paiement par le client.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_179', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'MEDIUM', 'Qu\'est-ce que le contrat de construction par lots séparés?',
'["Un contrat où le client engage séparément plusieurs entrepreneurs pour différents lots de travaux", "Un contrat unique pour l\'ensemble des travaux", "Un contrat de sous-traitance", "Un contrat d\'approvisionnement"]', 'A', 'Le contrat par lots séparés consiste pour le client à confier différents lots (structure, électricité, plomberie) à des entrepreneurs distincts.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_180', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'MEDIUM', 'Qu\'est-ce que le vice de construction et quels en sont les types?',
'["Un défaut dans la construction qui peut être apparent (visible à la réception) ou caché", "Un défaut esthétique seulement", "Un défaut causé par l\'usure normale", "Un défaut de fonctionnement de l\'équipement"]', 'A', 'Les vices de construction peuvent être apparents (visibles lors de la réception) ou cachés (non décelables lors d\'un examen raisonnable à la réception).', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_181', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'MEDIUM', 'Quelles sont les clauses essentielles d\'un contrat de sous-traitance?',
'["La description des travaux, le prix, les délais, les modalités de paiement et les assurances", "Le nom des actionnaires", "La date de fondation de l\'entreprise", "Le chiffre d\'affaires du sous-traitant"]', 'A', 'Un contrat de sous-traitance doit notamment préciser les travaux à effectuer, le prix, les échéanciers, les conditions de paiement et les assurances requises.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_182', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'MEDIUM', 'Qu\'est-ce que le paiement progressif dans un contrat de construction?',
'["Des paiements effectués à différentes étapes de l\'avancement des travaux", "Un paiement unique à la fin des travaux", "Un acompte au début du projet", "Un paiement mensuel fixe"]', 'A', 'Le paiement progressif permet à l\'entrepreneur d\'être payé à mesure que les travaux avancent, généralement sur présentation de factures d\'étape.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_183', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'MEDIUM', 'Comment les intérêts sur les comptes en souffrance sont-ils calculés dans l\'industrie de la construction?',
'["Au taux d\'intérêt prévu par la Loi sur le bâtiment ou au taux convenu dans le contrat", "Au taux fixé par la banque du client", "Sans intérêt", "Au taux légal seulement"]', 'A', 'Les intérêts sur les comptes en souffrance sont calculés selon le taux prévu par la Loi sur le bâtiment ou selon le taux convenu dans le contrat.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

-- HARD (questions 184-195)

('q_entgen_184', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'HARD', 'Qu\'est-ce que la réception judiciaire des travaux et quand est-elle utilisée?',
'["Une réception ordonnée par le tribunal en cas de désaccord entre les parties sur la conformité des travaux", "Une réception faite par un juge lors d\'un procès", "Une réception automatique après un certain délai", "Une inspection municipale"]', 'A', 'La réception judiciaire est ordonnée par le tribunal lorsque les parties ne s\'entendent pas sur la conformité ou l\'achèvement des travaux.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_185', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'HARD', 'Quel est l\'effet de la réception des travaux sans réserve sur la responsabilité de l\'entrepreneur pour les vices apparents?',
'["L\'entrepreneur est libéré de sa responsabilité pour les vices apparents qui auraient dû être constatés lors de la réception", "L\'entrepreneur reste responsable de tous les vices", "Le client perd tout recours", "La réception annule le contrat"]', 'A', 'La réception sans réserve libère l\'entrepreneur de sa responsabilité pour les vices apparents qui étaient décelables lors d\'un examen raisonnable.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_186', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'HARD', 'Qu\'est-ce que la garantie quinquennale (5 ans) prévue par le Code civil du Québec?',
'["La responsabilité solidaire des constructeurs pour les vices graves qui compromettent la solidité de l\'ouvrage pendant 5 ans", "Une garantie de 5 ans sur tous les matériaux", "Une assurance habitation de 5 ans", "Un délai de prescription de 5 ans"]', 'A', 'L\'article 2118 C.c.Q. prévoit une responsabilité de 5 ans pour les constructeurs si l\'ouvrage périt ou présente des vices graves compromettant sa solidité.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_187', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'HARD', 'Dans quelles circonstances un entrepreneur peut-il être déchu de son droit de réclamer des sommes supplémentaires pour des travaux non prévus au contrat?',
'["S\'il n\'a pas obtenu un ordre de changement écrit avant d\'exécuter les travaux supplémentaires", "Jamais, il peut toujours réclamer", "S\'il n\'a pas informé le client verbalement", "S\'il a déjà été payé pour les travaux de base"]', 'A', 'L\'entrepreneur peut perdre son droit de réclamer des sommes supplémentaires s\'il n\'a pas obtenu d\'ordre de changement écrit avant d\'effectuer les travaux.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_188', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'HARD', 'Comment la notion de « perte de l\'ouvrage » est-elle interprétée dans le cadre de l\'article 2118 du Code civil?',
'["Comme la destruction de l\'ouvrage ou l\'existence de vices graves qui en compromettent la solidité", "Uniquement la destruction complète", "Les dommages esthétiques seulement", "Le retard dans l\'exécution"]', 'A', 'La perte de l\'ouvrage inclut à la fois la destruction matérielle et les vices graves qui compromettent la solidité ou l\'usage de l\'ouvrage.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_189', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'HARD', 'Quelles sont les obligations de l\'entrepreneur général envers le donneur d\'ouvrage concernant la surveillance des sous-traitants?',
'["L\'entrepreneur général est responsable de la surveillance et de la coordination des sous-traitants", "Les sous-traitants sont autonomes", "Le donneur d\'ouvrage supervise directement les sous-traitants", "Aucune surveillance n\'est requise"]', 'A', 'L\'entrepreneur général a l\'obligation de surveiller et de coordonner le travail de ses sous-traitants et est responsable des défauts dans leur exécution.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_190', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'HARD', 'Qu\'est-ce que la résolution du contrat de construction pour inexécution et quels en sont les effets?',
'["L\'annulation rétroactive du contrat qui remet les parties dans leur état initial, avec restitution des prestations", "La fin du contrat pour l\'avenir seulement", "Une suspension temporaire", "Une modification des conditions"]', 'A', 'La résolution pour inexécution annule le contrat rétroactivement et oblige les parties à restituer les prestations reçues.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_191', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'HARD', 'Comment les dommages-intérêts sont-ils évalués en cas de retard dans l\'exécution d\'un contrat de construction?',
'["En fonction du préjudice réel subi par le client, incluant les pertes et les coûts supplémentaires", "Au montant fixé dans la clause pénale", "Au montant déterminé par le juge sans égard au préjudice réel", "Au taux d\'intérêt légal"]', 'A', 'Les dommages-intérêts pour retard sont calculés en fonction du préjudice réel subi, à moins qu\'une clause pénale ne prévoie un montant forfaitaire.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_192', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'HARD', 'Qu\'est-ce que la fiducie dans le contexte des contrats de construction?',
'["Un mécanisme où des fonds sont détenus par un tiers pour garantir le paiement des intervenants", "Un contrat de prêt", "Une assurance", "Une société en commandite"]', 'A', 'La fiducie est un mécanisme par lequel des sommes (ex. retenues de garantie) sont détenues par un fiduciaire pour garantir le paiement des entrepreneurs et fournisseurs.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_193', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'HARD', 'Qu\'est-ce que le cautionnement solidaire et comment diffère-t-il du cautionnement simple?',
'["Le cautionnement solidaire permet au créancier de réclamer la totalité de la dette à la caution sans poursuivre d\'abord le débiteur principal", "Les deux sont identiques", "Le cautionnement solidaire ne s\'applique qu\'aux contrats publics", "La caution simple n\'existe pas dans la construction"]', 'A', 'Dans le cautionnement solidaire, le créancier peut réclamer directement à la caution la totalité de la dette, contrairement au cautionnement simple où il doit d\'abord poursuivre le débiteur principal.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_194', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'HARD', 'Quelles sont les conséquences de la faillite de l\'entrepreneur général sur les contrats de sous-traitance?',
'["Les sous-traitants peuvent réclamer directement au donneur d\'ouvrage le paiement des travaux effectués", "Les sous-traitants perdent tous leurs droits", "Les contrats sont automatiquement annulés", "Les sous-traitants doivent poursuivre l\'entrepreneur en faillite"]', 'A', 'En cas de faillite de l\'entrepreneur général, les sous-traitants peuvent exercer leur action directe contre le donneur d\'ouvrage pour être payés.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_195', 'cmt_entrepreneur_general_001', 'ch_entgen_03', 'MCQ', 'HARD', 'Comment un contrat de construction peut-il être modifié valablement après sa signature?',
'["Par un avenant écrit signé par les deux parties, indiquant clairement les modifications", "Par une entente verbale", "Par un courriel non signé", "Par une note de service de l\'entrepreneur"]', 'A', 'Toute modification à un contrat de construction doit faire l\'objet d\'un avenant écrit, signé par les deux parties, décrivant précisément les changements.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

-- ============================================================
-- CHAPITRE 4: Code de construction et plans (q_entgen_196 à q_entgen_260)
-- ============================================================

-- EASY (questions 196-215)

('q_entgen_196', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'EASY', 'Qu\'est-ce que le Code de construction du Québec?',
'["Un règlement qui établit les normes techniques pour la construction au Québec", "Un code de déontologie", "Un code de conduite pour les entrepreneurs", "Un manuel de gestion de chantier"]', 'A', 'Le Code de construction du Québec est un ensemble de règlements qui établissent les normes techniques minimales pour la conception et la réalisation des travaux de construction.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_197', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'EASY', 'Le Code de construction du Québec est principalement basé sur:',
'["Le Code national du bâtiment (CNB) avec des adaptations québécoises", "Le Code européen de la construction", "Le Code américain uniforme", "Les normes ISO"]', 'A', 'Le Code de construction du Québec est basé sur le Code national du bâtiment (CNB) du Canada, avec des adaptations et des modifications spécifiques au Québec.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_198', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'EASY', 'Qu\'est-ce qu\'un plan de construction?',
'["Un dessin technique qui représente les dimensions, les matériaux et les spécifications d\'un bâtiment", "Un plan d\'affaires", "Un plan de financement", "Un plan de marketing"]', 'A', 'Un plan de construction est un dessin technique détaillé qui représente les dimensions, la disposition des pièces, les matériaux et les spécifications d\'un bâtiment.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_199', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'EASY', 'Qui est responsable d\'obtenir un permis de construction auprès de la municipalité?',
'["Le propriétaire ou l\'entrepreneur mandaté par le propriétaire", "La RBQ", "La CCQ", "L\'architecte seulement"]', 'A', 'C\'est au propriétaire de l\'immeuble ou à l\'entrepreneur qu\'il mandate de faire la demande de permis de construction auprès de la municipalité.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_200', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'EASY', 'Qu\'est-ce qu\'une inspection municipale en cours de construction?',
'["Une vérification de la conformité des travaux par un inspecteur de la municipalité", "Une inspection par l\'entrepreneur lui-même", "Une inspection par le client", "Une inspection par l\'assureur"]', 'A', 'L\'inspection municipale est une vérification effectuée par un inspecteur de la municipalité pour s\'assurer que les travaux respectent le Code de construction et le permis émis.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_201', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'EASY', 'Qu\'est-ce que le zonage en matière de construction?',
'["La réglementation municipale qui détermine les usages permis dans chaque secteur du territoire", "La division du chantier en zones", "La classification des types de bâtiments", "Le système de ventilation"]', 'A', 'Le zonage est un règlement municipal qui détermine quels types de constructions et d\'usages sont permis dans chaque zone du territoire.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_202', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'EASY', 'Qu\'est-ce qu\'un devis dans le contexte de la construction?',
'["Un document qui décrit en détail les matériaux, les méthodes et les normes à respecter", "Un plan de paiement", "Un contrat de sous-traitance", "Une estimation des coûts"]', 'A', 'Un devis est un document technique qui spécifie en détail les matériaux à utiliser, les méthodes d\'installation et les normes de qualité à respecter.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_203', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'EASY', 'Quelle est l\'échelle la plus courante sur les plans de construction résidentielle?',
'["1/4 de pouce = 1 pied (1:48)", "1 pouce = 1 pied (1:12)", "1/2 pouce = 1 pied (1:24)", "1/8 de pouce = 1 pied (1:96)"]', 'A', 'L\'échelle 1/4" = 1\'-0" (1:48) est l\'échelle la plus couramment utilisée pour les plans de construction résidentielle.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_204', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'EASY', 'Que sont les lignes de contour sur un plan de site?',
'["Des lignes qui relient les points de même altitude sur le terrain", "Les limites du terrain", "Le tracé des fondations", "Les lignes de propriété"]', 'A', 'Les lignes de contour (courbes de niveau) relient les points de même élévation et permettent de représenter le relief du terrain sur un plan.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_205', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'EASY', 'Qu\'est-ce qu\'une coupe transversale dans un plan de construction?',
'["Une vue en section du bâtiment qui montre les détails de construction intérieurs", "Une vue de dessus du bâtiment", "Une vue extérieure", "Un plan d\'étage"]', 'A', 'Une coupe transversale est une vue en section du bâtiment qui permet de voir l\'intérieur des murs, les hauteurs de plafond et les détails de construction.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_206', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'EASY', 'Un entrepreneur peut-il commencer les travaux avant d\'avoir obtenu le permis de construction?',
'["Non, les travaux ne peuvent pas commencer avant l\'obtention du permis", "Oui, pour les travaux préparatoires", "Oui, pour tous les travaux", "Non, mais le permis peut être obtenu dans les 30 jours suivant le début"]', 'A', 'Les travaux de construction ne peuvent légalement commencer avant l\'obtention du permis de construction délivré par la municipalité.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_207', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'EASY', 'Qu\'est-ce que la hauteur sous plafond minimale requise dans une habitation selon le Code de construction?',
'["2,1 mètres (7 pieds) dans les pièces habitables", "2,5 mètres (8 pieds)", "1,8 mètre (6 pieds)", "3 mètres (10 pieds)"]', 'A', 'Le Code de construction exige une hauteur sous plafond minimale de 2,1 mètres (environ 7 pieds) dans les pièces habitables d\'une habitation.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_208', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'EASY', 'Qu\'est-ce qu\'un détecteur de fumée et où doit-il être installé?',
'["Un appareil de détection de fumée obligatoire à chaque étage et à proximité des chambres", "Un appareil optionnel", "Un extincteur", "Un détecteur de monoxyde de carbone"]', 'A', 'Le Code de construction exige l\'installation de détecteurs de fumée à chaque étage et à l\'extérieur des aires de sommeil dans les bâtiments résidentiels.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_209', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'EASY', 'Qu\'est-ce qu\'une fondation dans un bâtiment?',
'["La partie de la structure qui repose sur le sol et transmet les charges au sol", "Le toit du bâtiment", "Les murs extérieurs", "Le plancher du rez-de-chaussée"]', 'A', 'La fondation est la partie inférieure de la structure qui repose sur le sol et qui transmet les charges du bâtiment au sol de façon sécuritaire.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_210', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'EASY', 'Qu\'est-ce qu\'une poutre dans une structure?',
'["Un élément structural horizontal qui supporte des charges et les transfère aux colonnes ou aux murs porteurs", "Un élément vertical", "Un élément décoratif", "Une fondation"]', 'A', 'Une poutre est un élément structural horizontal conçu pour supporter des charges (plancher, toit) et les transférer aux éléments porteurs verticaux.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_211', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'EASY', 'Qu\'est-ce que le revêtement extérieur d\'un bâtiment?',
'["Le matériau qui recouvre l\'extérieur des murs pour protéger le bâtiment des intempéries", "La peinture intérieure", "Le revêtement de sol", "Le matériau d\'isolation"]', 'A', 'Le revêtement extérieur est le matériau (brique, parement, vinyle, etc.) qui recouvre les murs extérieurs pour protéger le bâtiment des intempéries.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_212', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'EASY', 'Qu\'est-ce que la déclaration de conformité en fin de chantier?',
'["Un document attestant que les travaux sont conformes au Code de construction", "Un certificat de garantie", "Un permis de construire", "Un contrat d\'entretien"]', 'A', 'La déclaration de conformité est un document que l\'entrepreneur ou le professionnel doit produire pour attester que les travaux respectent le Code de construction.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_213', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'EASY', 'Un permis de construction est-il toujours requis pour des travaux de rénovation intérieure?',
'["Cela dépend de la nature et de l\'ampleur des travaux; les travaux majeurs nécessitent un permis", "Non, jamais pour l\'intérieur", "Oui, toujours", "Non, la rénovation est toujours exemptée"]', 'A', 'Certains travaux de rénovation intérieure peuvent nécessiter un permis selon leur nature (modification de murs porteurs, plomberie, électricité, etc.).', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_214', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'EASY', 'Qu\'est-ce qu\'une échelle graphique sur un plan?',
'["Une règle graduée dessinée sur le plan qui permet de mesurer les distances réelles", "Une échelle de couleurs", "Un tableau de conversion", "Une légende de symboles"]', 'A', 'L\'échelle graphique est une règle graduée imprimée sur le plan qui permet de mesurer directement les distances réelles sur le dessin.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_215', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'EASY', 'Qu\'est-ce qu\'un mur porteur?',
'["Un mur qui supporte une charge structurale du bâtiment (toit, étage supérieur)", "Un mur de séparation intérieure", "Un mur de clôture", "Un mur de soutènement"]', 'A', 'Un mur porteur est un mur qui supporte des charges structurales du bâtiment et qui ne peut être modifié sans évaluation structurale et permis.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

-- MEDIUM (questions 216-248)

('q_entgen_216', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'MEDIUM', 'Quelles sont les adaptations québécoises les plus importantes au Code national du bâtiment?',
'["Les exigences pour la neige, le gel et la résistance au feu spécifiques au Québec", "Les normes de couleur des matériaux", "Les normes de design intérieur", "Les règles de zonage"]', 'A', 'Les adaptations québécoises incluent notamment des normes plus strictes pour les charges de neige, la profondeur de gel des fondations et la résistance au feu.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_217', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'MEDIUM', 'Que sont les charges permanentes et les charges temporaires dans le calcul structural?',
'["Les charges permanentes (poids propre) et les charges temporaires (neige, vent, occupants)", "Les charges de construction et les charges d\'exploitation", "Les charges de toit et de fondation", "Les charges verticales et horizontales"]', 'A', 'Les charges permanentes sont le poids constant du bâtiment (structure, revêtements) et les charges temporaires sont variables (neige, vent, occupants, équipement).', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_218', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'MEDIUM', 'Comment les plans de construction sont-ils organisés dans un jeu de plans?',
'["Par catégories: plans d\'ensemble, plans architecturaux, plans structuraux, plans mécaniques et électriques", "Par ordre alphabétique", "Par date de création", "Par ordre de grandeur"]', 'A', 'Un jeu de plans est généralement organisé en sections: plans d\'ensemble, plans architecturaux, plans de structure, plans mécaniques, plans électriques et devis.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_219', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'MEDIUM', 'Qu\'est-ce que la zone de dégagement minimale requise autour d\'une sortie de secours?',
'["La largeur et la hauteur libres minimales pour permettre une évacuation sécuritaire", "La distance jusqu\'à la rue", "La distance entre les sorties", "La largeur de la porte"]', 'A', 'Le Code de construction prescrit des dimensions minimales de dégagement (largeur et hauteur) pour les issues de secours afin de permettre une évacuation sécuritaire.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_220', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'MEDIUM', 'Qu\'est-ce que l\'indice de résistance au feu d\'un matériau ou d\'un assemblage?',
'["Le temps en minutes pendant lequel un élément peut résister au feu tout en remplissant sa fonction", "La température maximale supportée", "La couleur du matériau après exposition au feu", "Le coût de protection incendie"]', 'A', 'L\'indice de résistance au feu est le temps (en minutes) pendant lequel un élément de construction peut résister au feu tout en maintenant ses fonctions structurales.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_221', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'MEDIUM', 'Qu\'est-ce qu\'un plan de situation (site plan)?',
'["Un plan qui montre l\'emplacement du bâtiment sur le terrain, les limites, les accès et les services", "Un plan d\'étage", "Un plan de fondation", "Un plan de toiture"]', 'A', 'Le plan de situation indique la position du bâtiment sur le terrain par rapport aux limites de propriété, aux voies d\'accès et aux réseaux de services.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_222', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'MEDIUM', 'Qu\'est-ce que la profondeur de gel et pourquoi est-elle importante pour les fondations?',
'["La profondeur à laquelle le givre pénètre dans le sol; les fondations doivent être sous cette profondeur", "La profondeur de la neige", "La profondeur des fouilles", "L\'épaisseur du béton"]', 'A', 'La profondeur de gel est la distance à laquelle le sol gèle en hiver. Les fondations doivent être établies sous cette profondeur pour éviter les mouvements différentiels.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_223', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'MEDIUM', 'Qu\'est-ce que l\'isolation thermique et quel est son rôle dans un bâtiment?',
'["Un matériau qui réduit les transferts de chaleur pour améliorer l\'efficacité énergétique", "Un matériau qui isole du bruit", "Un matériau décoratif", "Un matériau de structure"]', 'A', 'L\'isolation thermique est un matériau qui réduit le transfert de chaleur entre l\'intérieur et l\'extérieur du bâtiment, contribuant à l\'efficacité énergétique.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_224', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'MEDIUM', 'Quelle est la valeur R minimale recommandée pour l\'isolation des murs extérieurs au Québec?',
'["Généralement R-20 à R-24 selon le Code de construction", "R-10", "R-30", "R-5"]', 'A', 'Le Code de construction pour le Québec exige généralement une valeur d\'isolation de R-20 à R-24 pour les murs extérieurs des bâtiments résidentiels.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_225', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'MEDIUM', 'Qu\'est-ce que la charge de neige et comment affecte-t-elle la conception du toit?',
'["Le poids de la neige accumulée sur le toit; elle détermine la résistance structurale requise", "L\'épaisseur de neige prévue", "La durée de l\'enneigement", "La couleur du toit"]', 'A', 'La charge de neige est le poids de la neige qui peut s\'accumuler sur un toit; elle est un facteur déterminant dans la conception de la structure du toit au Québec.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_226', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'MEDIUM', 'Qu\'est-ce qu\'une membrane pare-vapeur et où doit-elle être installée?',
'["Une membrane qui empêche la migration de l\'humidité vers l\'isolant, installée du côté chaud de l\'isolant", "Un revêtement extérieur", "Une membrane d\'étanchéité de toit", "Un filtre géotextile"]', 'A', 'Le pare-vapeur est une membrane installée du côté chaud (intérieur) de l\'isolant pour empêcher la vapeur d\'eau de pénétrer dans l\'isolant et d\'y causer de la condensation.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_227', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'MEDIUM', 'Que signifie le terme « hors tout » sur un plan de construction?',
'["La dimension totale incluant tous les éléments", "La dimension intérieure seulement", "La hauteur du bâtiment", "La dimension sans les finitions"]', 'A', 'L\'indication « hors tout » sur un plan signifie la dimension totale du bâtiment incluant les saillies et les finitions extérieures.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_228', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'MEDIUM', 'Qu\'est-ce que le drain français et à quoi sert-il?',
'["Un système de drainage périphérique installé autour des fondations pour évacuer l\'eau du sol", "Un type de revêtement de sol", "Un système de plomberie intérieure", "Un système de ventilation"]', 'A', 'Le drain français est un tuyau perforé installé autour des fondations pour recueillir et évacuer l\'eau souterraine, protégeant ainsi les fondations contre l\'humidité.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_229', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'MEDIUM', 'Qu\'est-ce que l\'entraxe dans la construction à ossature de bois?',
'["La distance entre les centres de deux éléments structuraux adjacents (ex. 16 pouces ou 24 pouces)", "La distance entre les murs", "La hauteur des murs", "L\'épaisseur des colombages"]', 'A', 'L\'entraxe est la distance mesurée entre les centres de deux éléments structuraux (colombages, solives, chevrons), généralement 16" ou 24" au Québec.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_230', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'MEDIUM', 'Qu\'est-ce qu\'un escalier doit respecter comme dimensions selon le Code de construction?',
'["Une hauteur de marche maximale de 7 3/4\\u2033 et un giron minimal de 10\\u2033 (r\u00e9sidentiel)", "Une hauteur de marche de 10\\u2033 et un giron de 6\\u2033", "Une hauteur de marche de 12\\u2033 et un giron de 12\\u2033", "Aucune dimension pr\u00e9cise n\'est impos\u00e9e"]', 'A', 'Le Code de construction prescrit une hauteur de marche maximale de 7 3/4" (197 mm) et un giron (profondeur) minimal de 10" (254 mm) pour les escaliers r\u00e9sidentiels.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_231', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'MEDIUM', 'Qu\'est-ce que la solive de plancher et quel est son rôle?',
'["Un élément structural horizontal qui supporte le plancher et les charges d\'occupation", "Un élément de finition du plancher", "Un élément décoratif", "Un élément de fondation"]', 'A', 'Les solives de plancher sont des éléments structuraux horizontaux qui supportent le revêtement de plancher et transmettent les charges aux poutres et aux murs porteurs.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_232', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'MEDIUM', 'Qu\'est-ce qu\'une fenêtre de sortie de secours (issue) dans un sous-sol?',
'["Une fenêtre assez grande pour permettre l\'évacuation en cas d\'urgence et l\'accès des premiers répondants", "Une fenêtre décorative", "Une fenêtre fixe", "Une fenêtre de ventilation"]', 'A', 'Les fenêtres de sortie de secours dans les sous-sols doivent avoir des dimensions minimales pour permettre l\'évacuation des occupants et l\'entrée des pompiers.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_233', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'MEDIUM', 'Qu\'est-ce que la ventilation d\'un comble (grenier) doit assurer?',
'["Une circulation d\'air adéquate entre l\'isolant et le toit pour éviter la condensation", "Le chauffage du grenier", "La climatisation", "L\'éclairage naturel"]', 'A', 'La ventilation du comble permet d\'évacuer l\'humidité et la chaleur, prévenant ainsi la condensation, la détérioration de la structure et la formation de glace.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_234', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'MEDIUM', 'Comment sont indiquées les dimensions sur un plan de construction?',
'["Par des lignes de cote avec des chiffres indiquant les mesures", "Par des flèches seulement", "Par des notes en marge", "Par des codes de couleur"]', 'A', 'Les dimensions sont indiquées par des lignes de cote (lignes horizontales ou verticales) avec des chiffres qui spécifient les mesures.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_235', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'MEDIUM', 'Qu\'est-ce que la dalle de béton sur sol?',
'["Une dalle de béton coulée directement sur le sol préparé, servant de plancher", "Une dalle suspendue", "Un trottoir extérieur", "Un plancher de bois"]', 'A', 'Une dalle sur sol est une dalle de béton coulée directement sur un lit de gravier et une membrane pare-vapeur, servant de plancher au rez-de-chaussée ou au sous-sol.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_236', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'MEDIUM', 'Qu\'est-ce qu\'une certification Novoclimat?',
'["Un programme de certification pour les maisons neuves écoénergétiques au Québec", "Une certification de qualité des matériaux", "Une certification de sécurité incendie", "Un label acoustique"]', 'A', 'Novoclimat est un programme de certification de la Société d\'habitation du Québec pour les maisons neuves qui répondent à des normes élevées d\'efficacité énergétique.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_237', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'MEDIUM', 'Qu\'est-ce que le parement extérieur (brick veneer) dans une construction résidentielle?',
'["Une façade en brique qui n\'est pas structurale mais qui sert de revêtement esthétique et protecteur", "Un mur de brique porteur", "Une fondation en brique", "Un mur de soutènement"]', 'A', 'Le parement de brique est une brique de placage non structurale installée comme revêtement extérieur décoratif et protecteur sur une ossature de bois ou d\'acier.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_238', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'MEDIUM', 'Quelles sont les exigences du Code de construction pour les garde-corps (balustrades)?',
'["Une hauteur minimale de 36″ (900 mm) pour les plates-formes de moins de 6 mètres de hauteur", "Une hauteur de 24″", "Une hauteur de 48″", "Aucune exigence de hauteur"]', 'A', 'Le Code de construction exige une hauteur minimale de 36″ (900 mm) pour les garde-corps dans les bâtiments résidentiels de moins de 6 mètres.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_239', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'MEDIUM', 'Qu\'est-ce que le calfeutrage et à quoi sert-il dans la construction?',
'["Le scellement des joints et des fissures pour empêcher les infiltrations d\'air et d\'eau", "La fixation des fenêtres", "L\'isolation des murs", "La finition des planchers"]', 'A', 'Le calfeutrage consiste à sceller les joints et les fissures autour des fenêtres, portes et autres ouvertures pour empêcher les infiltrations d\'air et d\'eau.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_240', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'MEDIUM', 'Comment les plans de fondation sont-ils typiquement présentés?',
'["En plan de dessus montrant les dimensions et la disposition des semelles, murs et drains", "En élévation seulement", "En perspective", "En coupe longitudinale seulement"]', 'A', 'Les plans de fondation sont généralement présentés en vue de dessus (plan), montrant la disposition des semelles, des murs de fondation, des drains et des armatures.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_241', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'MEDIUM', 'Qu\'est-ce que l\'échangeur d\'air (VRC) dans une maison?',
'["Un système de ventilation qui renouvelle l\'air intérieur tout en récupérant la chaleur", "Un climatiseur", "Un purificateur d\'air", "Un déshumidificateur"]', 'A', 'Le VRC (ventilateur récupérateur de chaleur) renouvelle l\'air intérieur tout en transférant la chaleur de l\'air extrait à l\'air frais entrant.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_242', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'MEDIUM', 'Qu\'est-ce que la pente de toit et comment est-elle exprimée?',
'["L\'inclinaison du toit, exprimée en rapport vertical/horizontal (ex. 4:12)", "La hauteur du toit", "La longueur du toit", "La largeur du toit"]', 'A', 'La pente de toit est exprimée en pouces de montée verticale par 12 pouces de course horizontale, par exemple une pente de 4:12.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_243', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'MEDIUM', 'Qu\'est-ce qu\'un lucarne sur un plan de toiture?',
'["Une ouverture vitrée verticale placée sur une pente de toit pour éclairer et ventiler les combles", "Un puits de lumière", "Une fenêtre de toit", "un cheminée"]', 'A', 'Une lucarne est une structure qui émerge du toit, avec une fenêtre verticale, permettant d\'aménager et d\'éclairer les combles.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_244', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'MEDIUM', 'Qu\'est-ce que le coin de fenêtre (head flashing) et pourquoi est-il important?',
'["Une pièce de métal installée au-dessus des fenêtres pour diriger l\'eau vers l\'extérieur", "Le cadre de la fenêtre", "Le rebord de fenêtre", "La moustiquaire"]', 'A', 'Le coin de fenêtre (ou solin) est un élément de métal ou de plastique installé au-dessus des fenêtres et portes pour empêcher l\'infiltration d\'eau.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_245', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'MEDIUM', 'Qu\'est-ce que le retrait du béton et comment y remédie-t-on?',
'["La contraction du béton en séchant, compensée par des joints de contrôle et une armature appropriée", "L\'expansion du béton", "Le durcissement du béton", "La coloration du béton"]', 'A', 'Le retrait du béton est une contraction due au séchage. On y remédie par l\'installation de joints de contrôle, une armature appropriée et une cure adéquate.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_246', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'MEDIUM', 'Que sont les joints de dilatation dans un bâtiment?',
'["Des espaces structuraux qui permettent aux matériaux de se dilater et se contracter sans dommage", "Les joints entre les briques", "Les joints de plâtre", "Les joints de carrelage"]', 'A', 'Les joints de dilatation sont des coupures intentionnelles dans la structure qui permettent aux matériaux de se dilater et se contracter sous l\'effet des variations thermiques.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_247', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'MEDIUM', 'Comment les portes extérieures doivent-elles être installées selon le Code de construction?',
'["Avec un seuil, une coupe-froid et une isolation adéquate, en respectant les dégagements requis", "Sans seuil", "Avec une ouverture vers l\'intérieur seulement", "Avec un espace d\'air sous la porte"]', 'A', 'Les portes extérieures doivent être installées avec un seuil, des coupe-froid et une isolation adéquate, et respecter les dégagements requis pour la sécurité.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_248', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'MEDIUM', 'Qu\'est-ce qu\'un plan d\'étage (floor plan)?',
'["Une vue de dessus d\'un étage montrant la disposition des pièces, portes et fenêtres", "Une vue en coupe du bâtiment", "Une vue extérieure", "Un plan de fondation"]', 'A', 'Le plan d\'étage est une vue de dessus (en coupe horizontale) d\'un étage qui montre la disposition des pièces, des portes, des fenêtres et des escaliers.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

-- HARD (questions 249-260)

('q_entgen_249', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'HARD', 'Comment le Code de construction du Québec traite-t-il les bâtiments existants lors de rénovations majeures?',
'["Les rénovations majeures doivent généralement mettre le bâtiment aux normes actuelles pour les parties modifiées", "Les bâtiments existants sont exemptés", "Seulement les ajouts doivent être conformes", "Les normes actuelles s\'appliquent à l\'ensemble du bâtiment"]', 'A', 'Lors de rénovations majeures, les parties modifiées doivent généralement être mises aux normes actuelles du Code de construction, selon le principe de mise à niveau progressive.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_250', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'HARD', 'Qu\'est-ce que le calcul des charges de vent et comment influence-t-il la conception structurale?',
'["L\'évaluation des forces exercées par le vent sur le bâtiment, déterminant la résistance des murs, du toit et des ancrages", "Le calcul de la pression d\'air intérieure", "Le dimensionnement des fenêtres", "Le calcul de la ventilation"]', 'A', 'Le calcul des charges de vent détermine les forces latérales que le vent exerce sur le bâtiment et influence la conception de la structure, des murs et des ancrages.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_251', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'HARD', 'Quels sont les critères pour qu\'un bâtiment soit considéré comme « insalubre » selon le Code de construction?',
'["La présence d\'humidité excessive, de moisissures, d\'infiltrations d\'eau ou de vermine compromettant la santé", "Le manque d\'isolation", "La présence de matériaux non conformes", "Le manque d\'espace de rangement"]', 'A', 'Un bâtiment peut être déclaré insalubre s\'il présente des conditions qui compromettent la santé des occupants (humidité, moisissures, vermine, etc.).', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_252', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'HARD', 'Comment les escaliers en colimaçon sont-ils traités par le Code de construction du Québec?',
'["Ils sont permis sous certaines conditions spécifiques de dimensions de marche et de giron minimal", "Ils sont interdits dans toute nouvelle construction", "Ils sont permis sans restriction", "Ils sont permis seulement comme escalier de service"]', 'A', 'Le Code de construction permet les escaliers en colimaçon sous réserve de respecter des dimensions minimales spécifiques pour les marches et le giron.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_253', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'HARD', 'Qu\'est-ce que le principe de « continuité structurale » dans la construction à ossature de bois?',
'["Le transfert vertical des charges à travers les éléments porteurs alignés, des fondations au toit", "La continuité des joints", "La continuité de l\'isolation", "La continuité du pare-vapeur"]', 'A', 'La continuité structurale exige que les éléments porteurs (murs, colonnes) soient alignés verticalement des fondations au toit pour assurer un transfert efficace des charges.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_254', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'HARD', 'Comment le Code de construction traite-t-il l\'installation de systèmes de gicleurs dans les bâtiments résidentiels?',
'["Les gicleurs sont obligatoires dans certains types de bâtiments résidentiels (plus de 3 étages, certains multiplex)", "Les gicleurs sont toujours optionnels", "Les gicleurs sont interdits dans le résidentiel", "Les gicleurs sont obligatoires dans toutes les résidences"]', 'A', 'Le Code de construction exige l\'installation de gicleurs automatiques dans certains bâtiments résidentiels, notamment ceux de plus de 3 étages ou certains multiplex.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_255', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'HARD', 'Qu\'est-ce que la contrainte admissible du sol et comment est-elle déterminée?',
'["La capacité maximale du sol à supporter une charge sans tassement excessif, déterminée par une étude de sol", "La résistance du béton", "La densité du sol", "La perméabilité du sol"]', 'A', 'La contrainte admissible du sol est la charge maximale que le sol peut supporter et est déterminée par une étude géotechnique (essai de sol).', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_256', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'HARD', 'Comment s\'effectue la vérification de la conformité des travaux aux plans et devis approuvés?',
'["Par des inspections municipales à différentes étapes (fondation, structure, finition) et une inspection finale", "Par une seule inspection à la fin des travaux", "Par l\'entrepreneur lui-même", "Par l\'architecte sans inspection municipale"]', 'A', 'Les inspections municipales se déroulent à plusieurs étapes clés de la construction pour vérifier la conformité aux plans et devis approuvés.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_257', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'HARD', 'Quels sont les critères pour qu\'une fenêtre soit conforme au Code de construction en matière d\'évacuation (sortie de secours)?',
'["Une ouverture libre d\'au moins 15 pieds carrés (1,4 m²), 15″" de hauteur et 20″" de largeur", "Une ouverture de 10 pieds carrés", "Une ouverture de 5 pieds carrés", "Aucune dimension minimale"]', 'A', 'Les fenêtres de sortie de secours doivent avoir une ouverture libre d\'au moins 15 pieds carrés (1,4 m²), avec une hauteur minimale de 15″" et une largeur de 20″".', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_258', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'HARD', 'Qu\'est-ce que la version du Code de construction applicable à un projet?',
'["La version en vigueur au moment de la demande de permis de construire", "La version la plus récente toujours", "La version choisie par l\'entrepreneur", "La version en vigueur au début des travaux"]', 'A', 'Le Code de construction applicable est celui en vigueur au moment du dépôt de la demande de permis de construire, et non au début des travaux.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_259', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'HARD', 'Comment le drainage des fondations doit-il être conçu pour être conforme au Code de construction?',
'["Avec un drain perforé autour des fondations, une pente minimale, et un exutoire approprié (égout pluvial ou pompe de puisard)", "Avec un simple trou au bas du mur", "Avec du gravier seulement", "Aucun drainage n\'est requis"]', 'A', 'Le drainage des fondations doit comprendre un drain perforé posé à la base des fondations, avec une pente vers un exutoire, protégé par un filtre géotextile et du gravier.', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z'),

('q_entgen_260', 'cmt_entrepreneur_general_001', 'ch_entgen_04', 'MCQ', 'HARD', 'Qu\'est-ce que la résistance au feu d\'un mur coupe-feu et comment est-elle déterminée?',
'["La durée en minutes pendant laquelle un mur peut résister au feu et empêcher sa propagation, déterminée par des essais normalisés", "L\'épaisseur du mur", "Le matériau du mur", "La couleur du mur"]', 'A', 'La résistance au feu d\'un mur coupe-feu est déterminée par des essins normalisés (CAN/ULC S101) et est exprimée en minutes (45, 60, 90, 120 minutes).', 'fr', '2026-07-09T03:00:00.000Z', '2026-07-09T03:00:00.000Z')

ON CONFLICT (id) DO NOTHING;
