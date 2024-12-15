import { getFirestore } from "firebase-admin/firestore";
import { Timestamp } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
dotenv.config();
import { initializeApp, cert } from "firebase-admin/app";
const serviceAccount = {
  projectId: process.env.ADMIN_PROJECT_ID,
  privateKey: process.env.ADMIN_PRIVATE_KEY,
  clientEmail: process.env.ADMIN_CLIENT_EMAIL,
};
export const fbAdmin = initializeApp({
  credential: cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
});
const db = getFirestore(fbAdmin);
const masterTags = [
  "clinical_psychology", // Psicología clínica
  "child_psychology", // Psicología infantil
  "adolescent_psychology", // Psicología para adolescentes
  "adult_psychology", // Psicología para adultos
  "geriatric_psychology", // Psicología para personas mayores
  "psychiatry", // Psiquiatría
  "counseling", // Consejería
  "psychotherapy", // Psicoterapia
  "cognitive_behavioral_therapy", // Terapia cognitivo-conductual (CBT)
  "dialectical_behavior_therapy", // Terapia dialéctica conductual (DBT)
  "family_therapy", // Terapia familiar
  "couples_therapy", // Terapia de pareja
  "trauma_therapy", // Terapia de trauma
  "substance_abuse_counseling", // Consejería de abuso de sustancias
  "addiction_psychiatry", // Psiquiatría de adicciones
  "forensic_psychology", // Psicología forense
  "neuropsychology", // Neuropsicología
  "behavioral_therapy", // Terapia conductual
  "child_and_adolescent_psychiatry", // Psiquiatría infantil y adolescente
  "social_work", // Trabajo social
  "school_psychology", // Psicología escolar
  "rehabilitation_psychology", // Psicología de rehabilitación
  "occupational_psychology", // Psicología ocupacional
  "holistic_mental_health", // Salud mental holística
  "mindfulness_based_therapy", // Terapia basada en mindfulness
];
const tags = [
  "anxiety", // Ansiedad
  "depression", // Depresión
  "stress_management", // Manejo del estrés
  "self_esteem", // Autoestima
  "trauma_recovery", // Recuperación de trauma
  "grief_counseling", // Consejería de duelo
  "relationship_issues", // Problemas de relación
  "anger_management", // Manejo de la ira
  "PTSD", // Trastorno de estrés postraumático
  "social_anxiety", // Ansiedad social
  "OCD", // Trastorno obsesivo-compulsivo
  "panic_disorders", // Trastornos de pánico
  "phobias", // Fobias
  "sleep_disorders", // Trastornos del sueño
  "insomnia", // Insomnio
  "work_life_balance", // Equilibrio vida-trabajo
  "burnout_prevention", // Prevención de burnout
  "addiction_recovery", // Recuperación de adicciones
  "substance_abuse", // Abuso de sustancias
  "smoking_cessation", // Cesación del tabaco
  "life_transitions", // Transiciones de vida
  "career_counseling", // Consejería de carrera
  "parenting_support", // Apoyo para padres
  "child_behavior_issues", // Problemas de comportamiento infantil
  "autism_support", // Apoyo en autismo
  "ADHD_support", // Apoyo en TDAH
  "eating_disorders", // Trastornos alimentarios
  "body_image", // Imagen corporal
  "self_harm_prevention", // Prevención de autolesiones
  "emotional_regulation", // Regulación emocional
  "attachment_issues", // Problemas de apego
  "life_purpose", // Propósito de vida
  "communication_skills", // Habilidades de comunicación
  "mindfulness", // Mindfulness
  "meditation", // Meditación
  "coping_skills", // Habilidades de afrontamiento
  "resilience_building", // Construcción de resiliencia
  "bipolar_disorder", // Trastorno bipolar
  "schizophrenia", // Esquizofrenia
  "emotional_support", // Apoyo emocional
  "family_conflicts", // Conflictos familiares
  "spirituality_issues", // Problemas de espiritualidad
  "identity_crisis", // Crisis de identidad
  "gender_identity", // Identidad de género
  "sexual_orientation", // Orientación sexual
  "fertility_support", // Apoyo en fertilidad
  "postpartum_support", // Apoyo postparto
  "loneliness", // Soledad
  "empathy_training", // Entrenamiento en empatía
  "assertiveness_training", // Entrenamiento en asertividad
];
const populate = async () => {
  for (const tag of masterTags) {
    const data = {
      tag: tag,
      createdAt: Timestamp.now(),
    };
    await db.collection("master-tags").add(data);
  }
  for (const tag of tags) {
    const data = {
      tag: tag,
      createdAt: Timestamp.now(),
    };
    await db.collection("tags").add(data);
  }
};
populate();
