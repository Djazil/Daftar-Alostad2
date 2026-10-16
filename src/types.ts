export type Level = '1 ثانوي' | '2 ثانوي' | '3 ثانوي (بكالوريا)';

export type DayOfWeek = 'الأحد' | 'الإثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس';

export interface BehaviorLog {
  id: string;
  date: string;
  type: 'positive' | 'negative' | 'absence' | 'late';
  reason: string;
  delta: number;
  parentAcknowledged?: boolean;
  absenceType?: 'justified' | 'unjustified';
  justificationDocUrl?: string;
  justificationNote?: string;
  justifiedAt?: string;
}

export interface SubjectScoreRecord {
  subject: string;
  teacherName: string;
  continuousScore: number;
  tpScore?: number;
  testScore: number;
  examScore: number;
  average: number;
  coefficient: number;
  remark: string;
  logs?: BehaviorLog[];
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  group: 1 | 2;
  seatIndex: number;
  attendance: 'present' | 'absent' | 'late';
  absencesCount: number;
  bonusPoints: number;
  tpScore: number;
  test1: number;
  test2: number;
  exam: number;
  remark: string;
  parentCode: string;
  logs: BehaviorLog[];
  otherSubjects?: SubjectScoreRecord[];
  parentName?: string;
  parentPhone?: string;
  parentNotes?: string;
  parentRecommendations?: string;
  strengths?: string;
  areasForImprovement?: string;
  coordinationStatus?: 'good' | 'followup' | 'urgent' | 'pending';
  lastCoordinationDate?: string;
}

export interface LessonPlanNote {
  objectives: string;
  stages: string;
  materials: string;
  evaluation: string;
}

export interface CurriculumUnit {
  id: string;
  subject: string;
  level: Level;
  unitNumber: number;
  title: string;
  plannedHours: number;
  completedHours: number;
  status: 'completed' | 'in-progress' | 'pending';
  notes: string;
  competency?: string;
  lessonPlan?: LessonPlanNote;
}

export interface ClassGroup {
  id: string;
  name: string;
  level: Level;
  stream: string;
  room: string;
  schedule: string;
  hasTP: boolean;
  totalDesks?: number;
  students: Student[];
}

export interface TimetableSession {
  id: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  classId: string;
  className: string;
  room: string;
  groupType: 'قسم كامل' | 'فوج 1' | 'فوج 2';
  type: 'درس نظري' | 'أعمال تطبيقية (TP)' | 'أعمال موجهة (TD)' | 'معالجة بيداغوجية' | 'فرض / اختبار' | 'استدراك';
  notes?: string;
}

export interface TeacherProfile {
  name: string;
  subject: string;
  highSchool: string;
  wilaya: string;
  isFirstTimeSetupDone: boolean;
}

export interface AuthUser {
  email: string;
  name: string;
  avatar?: string;
  isAdmin: boolean;
  isActive: boolean;
}

export type SubscriptionPlanId = '1month' | '6months' | '1year' | 'lifetime';
export type SubscriptionStatus = 'none' | 'pending' | 'active' | 'expired' | 'suspended';

export interface PaymentProof {
  transactionRef?: string;
  senderName: string;
  phoneNumber?: string;
  ripNumber?: string;
  amount: number;
  paidAt: string;
  receiptNote?: string;
  receiptImageUrl?: string;
  sentViaWhatsApp?: boolean;
}

export interface TeacherSubscription {
  teacherEmail: string;
  teacherName: string;
  phoneNumber?: string;
  planId: SubscriptionPlanId | 'none';
  status: SubscriptionStatus;
  amountDZD: number;
  paymentProof?: PaymentProof;
  requestedAt?: string;
  activatedAt?: string;
  expiresAt: string | null;
  activatedByAdminEmail?: string;
  adminNotes?: string;
  isLifetime: boolean;
}