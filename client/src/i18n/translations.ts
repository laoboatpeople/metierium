const fr: Record<string, unknown> = {
  // Navigation & Common
  loading: 'Chargement...',
  language: 'Langue',
  signOut: 'Déconnexion',
  dashboard: 'Tableau de bord',
  theory: 'Théorie',
  theorySubtitle: 'Consultez la documentation officielle et le contenu théorique par chapitre.',
  exams: 'Examens',
  aiTutor: 'Tuteur IA',
  subscription: 'Abonnement',
  profile: 'Profil',
  categories: 'catégories',
  chapters: 'chapitres',
  chapter: 'chapitre',
  questions: 'questions',
  question: 'question',
  retry: 'Réessayer',
  somethingWentWrong: 'Une erreur est survenue',

  // Theory page
  theoryAvailable: 'Théorie disponible',
  theoryInPreparation: 'Le contenu théorique pour ce chapitre est en préparation.',
  theoryBasedOn: 'Basé sur {count} questions disponibles.',
  theoryProgress: 'Théorie disponible dans {withTheory}/{total} chapitres',
  theoryEmptyTitle: 'Aucune théorie disponible',
  theoryEmptyDesc: 'Le contenu théorique sera ajouté prochainement. Revenez bientôt !',
  theoryWithTheory: '{count} avec théorie',

  // License sections
  licenseCommon: 'Tronc Commun',
  licenseCommonSub: 'Questions générales communes à tous les métiers',
  licenseM: 'Mécanique',
  licenseMSub: 'Questions spécifiques aux métiers de la mécanique',
  licenseE: 'Électricité',
  licenseESub: 'Questions spécifiques aux métiers de l\'électricité',
  licenseS: 'Sécurité',
  licenseSSub: 'Questions spécifiques à la sécurité et réglementation',

  // Theory rendering
  noContent: 'Aucun contenu disponible pour cette section.',

  // Landing page - Navigation
  navFeatures: 'Fonctionnalités',
  navTrades: 'Métiers',
  navPricing: 'Tarifs',
  navContact: 'Contact',
  navSignIn: 'Connexion',
  navSignUp: 'Inscription',

  // Landing page - Hero
  heroBadge: 'Préparation aux examens de métiers',
  heroTitle: 'Certification Québec',
  heroTagline: 'Réussissez votre examen de métier',
  heroDesc: 'Accédez à du contenu théorique complet, des examens blancs et un suivi personnalisé pour maximiser vos chances de réussite à l\'examen de certification.',
  heroPillTheory: 'Théorie complète',
  heroPillExams: 'Examens blancs',
  heroPillTracking: 'Suivi personnalisé',
  heroCta: 'Commencer',

  // Landing page - How it works
  howItWorksTitle: 'Comment ça marche',
  howItWorksSubtitle: 'Trois étapes simples pour réussir votre certification',
  step1Title: 'Choisissez votre métier',
  step1Desc: 'Sélectionnez votre métier parmi ceux disponibles et accédez au contenu spécifique à votre examen de certification.',
  step2Title: 'Étudiez la théorie',
  step2Desc: 'Parcourez le contenu théorique organisé par chapitre, avec des explications claires adaptées à votre métier.',
  step3Title: 'Réussissez l\'examen',
  step3Desc: 'Testez vos connaissances avec des examens blancs, suivez votre progression et arrivez confiant le jour J.',

  // Landing page - Features
  featuresTitle: 'Tout ce dont vous avez besoin pour réussir',
  featuresSubtitle: 'Une plateforme complète conçue pour les travailleurs québécois qui préparent leur examen de métier.',
  featureTheorie: 'Théorie complète',
  featureTheorieDesc: 'Accédez à tout le contenu théorique organisé par chapitre, avec des explications claires et détaillées.',
  featureExamens: 'Examens blancs',
  featureExamensDesc: 'Testez vos connaissances avec des examens blancs qui simulent les conditions réelles de l\'examen.',
  featureSuivi: 'Suivi de progression',
  featureSuiviDesc: 'Visualisez votre progression, identifiez vos points faibles et concentrez-vous sur ce qui compte.',

  // Landing page - Trades
  tradesTitle: 'Métiers disponibles',
  tradesSubtitle: 'Choisissez votre métier et commencez votre préparation dès aujourd\'hui.',
  tradeElectricien: 'Électricien (CMEQ)',
  tradeElectricienDesc: 'Préparation complète à l\'examen de certification de la Corporation des maîtres électriciens du Québec.',
  tradeTheoryComplete: 'Théorie complète',
  tradeExamQuestions: 'Questions d\'examen',
  tradePlombier: 'Plombier (CMMTQ)',
  tradePlombierDesc: 'Préparation à l\'examen de certification en plomberie.',
  tradeSoudeur: 'Soudeur (QBQ)',
  tradeSoudeurDesc: 'Préparation à l\'examen de certification en soudage.',
  comingSoon: 'À Venir',

  // Landing page - Pricing
  pricingTitle: 'Choisissez votre plan',
  pricingSubtitle: 'Accédez à tout le contenu théorique et aux outils d\'étude pour maximiser vos chances de réussite.',
  planFree: 'GRATUIT',
  planMonthly: 'MENSUEL',
  planFreeDesc: 'Pour débuter votre préparation',
  planMonthlyDesc: 'L\'accès complet pour réussir',
  planFreePrice: '0',
  planMonthlyPrice: '29',
  planPerMonth: '/mois',
  planFreeCta: 'Commencer gratuitement',
  planMonthlyCta: 'S\'abonner',
  planFeatureTheory: 'Accès à la théorie',
  planFeatureLimited: 'Questions limitées',
  planFeatureUnlimited: 'Questions illimitées',
  planFeatureExams: 'Examens blancs illimités',
  planFeatureAiTutor: 'Tuteur IA',
  planFeatureTracking: 'Suivi de progression',
  planFeatureStats: 'Statistiques détaillées',
  planCancelAnytime: 'Vous pouvez annuler à tout moment. Aucune question, aucun engagement.',

  // Landing page - CTA
  ctaTitle: 'Prêt à réussir votre examen ?',
  ctaDesc: 'Rejoignez les travailleurs qui utilisent Certification Québec pour se préparer efficacement.',
  ctaButton: 'Commencer gratuitement',

  // Landing page - Footer
  footerBrand: 'Certification Québec',
  footerRights: '© {year} Certification Québec. Préparation aux examens de métiers.',
  footerLinkFeatures: 'Fonctionnalités',
  footerLinkTrades: 'Métiers',
  footerLinkPricing: 'Tarifs',
  footerLinkContact: 'Contact',
  footerQuickLinks: 'Liens rapides',

  // Auth
  signIn: 'Connexion',
  signInTitle: 'Connectez-vous à votre compte',
  signInSubtitle: 'Accédez à votre espace d\'étude personnalisé',
  email: 'Courriel',
  emailPlaceholder: 'votre@courriel.com',
  password: 'Mot de passe',
  passwordPlaceholder: 'Votre mot de passe',
  name: 'Nom complet',
  namePlaceholder: 'Jean Tremblay',
  noAccount: 'Pas encore de compte ?',
  createAccount: 'Créer un compte',
  register: 'Inscription',
  registerTitle: 'Créez votre compte',
  registerSubtitle: 'Commencez votre préparation dès maintenant',
  haveAccount: 'Déjà un compte ?',
  signInLink: 'Connectez-vous',
  registerLink: 'Inscrivez-vous',
  loginError: 'Courriel ou mot de passe incorrect',
  registerSuccess: 'Compte créé avec succès',

  // Pricing
  pricing: 'Abonnement',

  // Admin
  admin: 'Admin',
  adminDashboard: 'Tableau de bord',
  adminDashboardDesc: 'Aperçu général de la plateforme',
  adminTrades: 'Métiers',
  adminTradesDesc: 'Gérer les métiers de la plateforme',
  adminChapters: 'Chapitres',
  adminChaptersDesc: 'Gérer les chapitres et leur contenu théorique',
  adminQuestions: 'Questions',
  adminQuestionsDesc: 'Gérer les questions à choix multiples',
  adminUsers: 'Utilisateurs',
  adminUsersDesc: 'Gérer les utilisateurs de la plateforme',
  adminBackToApp: 'Retour à l\'app',
  adminCheckingAccess: 'Vérification des accès...',
  adminTotalUsers: 'Utilisateurs',
  adminTotalTrades: 'Métiers',
  adminTotalChapters: 'Chapitres',
  adminTotalQuestions: 'Questions',
  adminAdd: 'Ajouter',
  adminSave: 'Sauvegarder',
  adminCancel: 'Annuler',
  adminConfirmDelete: 'Supprimer ?',
  adminStatusActive: 'Actif',
  adminStatusInactive: 'Inactif',
  adminRoleAdmin: 'Admin',
  adminRoleStudent: 'Étudiant',
  adminPlanMonthly: 'Mensuel',
  adminPlanFree: 'Gratuit',
  adminNoTrades: 'Aucun métier trouvé',
  adminNoChapters: 'Aucun chapitre trouvé',
  adminNoQuestions: 'Aucune question trouvée',
  adminNoUsers: 'Aucun utilisateur trouvé',
};

const en: Record<string, string> = {
  // Navigation & Common
  loading: 'Loading...',
  language: 'Language',
  signOut: 'Sign Out',
  dashboard: 'Dashboard',
  theory: 'Theory',
  theorySubtitle: 'Browse official documentation and theoretical content by chapter.',
  exams: 'Exams',
  aiTutor: 'AI Tutor',
  subscription: 'Subscription',
  profile: 'Profile',
  categories: 'categories',
  chapters: 'chapters',
  chapter: 'chapter',
  questions: 'questions',
  question: 'question',
  retry: 'Retry',
  somethingWentWrong: 'Something went wrong',

  // Theory page
  theoryAvailable: 'Theory available',
  theoryInPreparation: 'Theoretical content for this chapter is in preparation.',
  theoryBasedOn: 'Based on {count} available questions.',
  theoryProgress: 'Theory available in {withTheory}/{total} chapters',
  theoryEmptyTitle: 'No theory available',
  theoryEmptyDesc: 'Theoretical content will be added soon. Check back later!',
  theoryWithTheory: '{count} with theory',

  // License sections
  licenseCommon: 'Common Core',
  licenseCommonSub: 'General questions common to all trades',
  licenseM: 'Mechanics',
  licenseMSub: 'Questions specific to mechanical trades',
  licenseE: 'Electrical',
  licenseESub: 'Questions specific to electrical trades',
  licenseS: 'Safety',
  licenseSSub: 'Questions specific to safety and regulations',

  noContent: 'No content available for this section.',

  // Landing page - Navigation
  navFeatures: 'Features',
  navTrades: 'Trades',
  navPricing: 'Pricing',
  navContact: 'Contact',
  navSignIn: 'Sign In',
  navSignUp: 'Sign Up',

  // Landing page - Hero
  heroBadge: 'Trade Exam Preparation',
  heroTitle: 'Certification Québec',
  heroTagline: 'Pass your trade exam',
  heroDesc: 'Access complete theoretical content, practice exams, and personalized tracking to maximize your chances of passing the certification exam.',
  heroPillTheory: 'Complete Theory',
  heroPillExams: 'Practice Exams',
  heroPillTracking: 'Personalized Tracking',
  heroCta: 'Get Started',

  // Landing page - How it works
  howItWorksTitle: 'How It Works',
  howItWorksSubtitle: 'Three simple steps to pass your certification',
  step1Title: 'Choose Your Trade',
  step1Desc: 'Select your trade from available options and access content specific to your certification exam.',
  step2Title: 'Study the Theory',
  step2Desc: 'Browse theoretical content organized by chapter, with clear explanations tailored to your trade.',
  step3Title: 'Pass the Exam',
  step3Desc: 'Test your knowledge with practice exams, track your progress, and arrive confident on exam day.',

  // Landing page - Features
  featuresTitle: 'Everything you need to succeed',
  featuresSubtitle: 'A complete platform designed for Quebec workers preparing for their trade exam.',
  featureTheorie: 'Complete Theory',
  featureTheorieDesc: 'Access all theoretical content organized by chapter, with clear and detailed explanations.',
  featureExamens: 'Practice Exams',
  featureExamensDesc: 'Test your knowledge with practice exams that simulate real exam conditions.',
  featureSuivi: 'Progress Tracking',
  featureSuiviDesc: 'View your progress, identify weak points, and focus on what matters.',

  // Landing page - Trades
  tradesTitle: 'Available Trades',
  tradesSubtitle: 'Choose your trade and start your preparation today.',
  tradeElectricien: 'Electrician (CMEQ)',
  tradeElectricienDesc: 'Complete preparation for the certification exam of the Corporation des maîtres électriciens du Québec.',
  tradeTheoryComplete: 'Complete Theory',
  tradeExamQuestions: 'Exam Questions',
  tradePlombier: 'Plumber (CMMTQ)',
  tradePlombierDesc: 'Preparation for the plumbing certification exam.',
  tradeSoudeur: 'Welder (QBQ)',
  tradeSoudeurDesc: 'Preparation for the welding certification exam.',
  comingSoon: 'Coming Soon',

  // Landing page - Pricing
  pricingTitle: 'Choose Your Plan',
  pricingSubtitle: 'Access all theoretical content and study tools to maximize your chances of success.',
  planFree: 'FREE',
  planMonthly: 'MONTHLY',
  planFreeDesc: 'Start your preparation',
  planMonthlyDesc: 'Full access to succeed',
  planFreePrice: '0',
  planMonthlyPrice: '29',
  planPerMonth: '/month',
  planFreeCta: 'Start for free',
  planMonthlyCta: 'Subscribe',
  planFeatureTheory: 'Theory access',
  planFeatureLimited: 'Limited questions',
  planFeatureUnlimited: 'Unlimited questions',
  planFeatureExams: 'Unlimited practice exams',
  planFeatureAiTutor: 'AI Tutor',
  planFeatureTracking: 'Progress tracking',
  planFeatureStats: 'Detailed statistics',
  planCancelAnytime: 'Cancel anytime. No questions asked, no commitment.',

  // Landing page - CTA
  ctaTitle: 'Ready to pass your exam?',
  ctaDesc: 'Join the workers using Certification Québec to prepare effectively.',
  ctaButton: 'Start for free',

  // Landing page - Footer
  footerBrand: 'Certification Québec',
  footerRights: '© {year} Certification Québec. Trade exam preparation.',
  footerLinkFeatures: 'Features',
  footerLinkTrades: 'Trades',
  footerLinkPricing: 'Pricing',
  footerLinkContact: 'Contact',
  footerQuickLinks: 'Quick Links',

  // Auth
  signIn: 'Sign In',
  signInTitle: 'Sign in to your account',
  signInSubtitle: 'Access your personalized study space',
  email: 'Email',
  emailPlaceholder: 'your@email.com',
  password: 'Password',
  passwordPlaceholder: 'Your password',
  name: 'Full Name',
  namePlaceholder: 'John Smith',
  noAccount: 'Don\'t have an account?',
  createAccount: 'Create an account',
  register: 'Register',
  registerTitle: 'Create your account',
  registerSubtitle: 'Start your preparation now',
  haveAccount: 'Already have an account?',
  signInLink: 'Sign in',
  registerLink: 'Register',
  loginError: 'Incorrect email or password',
  registerSuccess: 'Account created successfully',

  // Pricing
  pricing: 'Subscription',

  // Admin
  admin: 'Admin',
  adminDashboard: 'Dashboard',
  adminDashboardDesc: 'Platform overview',
  adminTrades: 'Trades',
  adminTradesDesc: 'Manage platform trades',
  adminChapters: 'Chapters',
  adminChaptersDesc: 'Manage chapters and their theory content',
  adminQuestions: 'Questions',
  adminQuestionsDesc: 'Manage multiple choice questions',
  adminUsers: 'Users',
  adminUsersDesc: 'Manage platform users',
  adminBackToApp: 'Back to app',
  adminCheckingAccess: 'Checking access...',
  adminTotalUsers: 'Users',
  adminTotalTrades: 'Trades',
  adminTotalChapters: 'Chapters',
  adminTotalQuestions: 'Questions',
  adminAdd: 'Add',
  adminSave: 'Save',
  adminCancel: 'Cancel',
  adminConfirmDelete: 'Delete?',
  adminStatusActive: 'Active',
  adminStatusInactive: 'Inactive',
  adminRoleAdmin: 'Admin',
  adminRoleStudent: 'Student',
  adminPlanMonthly: 'Monthly',
  adminPlanFree: 'Free',
  adminNoTrades: 'No trades found',
  adminNoChapters: 'No chapters found',
  adminNoQuestions: 'No questions found',
  adminNoUsers: 'No users found',
};

export type Locale = 'en' | 'fr';

const translations: Record<Locale, Record<string, unknown>> = { fr, en };

export function getTranslation(locale: Locale, path: string, vars?: Record<string, string | number>): string {
  const keys = path.split('.');
  let val: unknown = translations[locale];
  for (const k of keys) {
    val = (val as Record<string, unknown>)?.[k];
  }
  if (typeof val !== 'string') return path;
  if (!vars) return val;
  return val.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`));
}
