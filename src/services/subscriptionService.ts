import { TeacherSubscription, SubscriptionTier, PaymentProof, SubscriptionPlanId } from '../types';

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: '1month',
    name: 'اشتراك شهري',
    durationLabel: '1 شهر',
    durationMonths: 1,
    durationDays: 30,
    priceDZD: 1000,
    features: ['جميع ممزات الدفتر الرقمي', 'تحديثات مجانية مستمرة', 'متابعة رادار اليقظة', 'تصدير التقارير والتوزيعات']
  },
  {
    id: '6months',
    name: 'اشتراك سداسي',
    durationLabel: '6 أشهر',
    durationMonths: 6,
    durationDays: 180,
    priceDZD: 5000,
    popular: true,
    features: ['توفير 1000 دج', 'جميع مميزات المنصة الكاملة', 'تصدير الإحصائيات الشاملة', 'دعم فني بيداغوجي أولوية']
  },
  {
    id: '1year',
    name: 'اشتراك سنوي كامل',
    durationLabel: 'سنة دراسية كاملة',
    durationMonths: 12,
    durationDays: 365,
    priceDZD: 9000,
    features: ['توفير 3000 دج', 'وصول غير محدود لكل الأقسام والتحديثات', 'دفع إلكتروني أو تحويل بريدي', 'شهادة ترخيص رسمية']
  },
  {
    id: 'lifetime',
    name: 'اشتراك مدى الحياة',
    durationLabel: 'دائم',
    durationMonths: null,
    durationDays: null,
    priceDZD: 25000,
    features: ['دفع لمرة واحدة فقط مدى الحياة', 'وصول مدى الحياة بدون تجديد سنوي', 'جميع الخصائص المستقبلية مجاناً', 'دعم مباشر خاص']
  }
];

const STORAGE_KEY = 'teacher_subscriptions_db_v2';

export const loadAllSubscriptions = (): TeacherSubscription[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading subscriptions:', e);
  }
  return [];
};

export const saveAllSubscriptions = (subs: TeacherSubscription[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
  } catch (e) {
    console.error('Error saving subscriptions:', e);
  }
};

export const getSubscriptionByEmail = (email: string): TeacherSubscription | null => {
  const all = loadAllSubscriptions();
  return all.find(s => s.teacherEmail.toLowerCase() === email.toLowerCase()) || null;
};

export const requestSubscription = (
  teacherEmail: string,
  teacherName: string,
  phoneNumber: string,
  planId: SubscriptionPlanId,
  paymentProof: PaymentProof
): TeacherSubscription => {
  const all = loadAllSubscriptions();
  const tier = SUBSCRIPTION_TIERS.find(t => t.id === planId);
  const amountDZD = tier ? tier.priceDZD : 0;

  const existingIndex = all.findIndex(s => s.teacherEmail.toLowerCase() === teacherEmail.toLowerCase());

  const newSub: TeacherSubscription = {
    teacherEmail,
    teacherName,
    phoneNumber,
    planId,
    status: 'pending',
    amountDZD,
    paymentProof,
    requestedAt: new Date().toISOString(),
    expiresAt: null,
    isLifetime: planId === 'lifetime'
  };

  if (existingIndex >= 0) {
    all[existingIndex] = newSub;
  } else {
    all.push(newSub);
  }

  saveAllSubscriptions(all);
  return newSub;
};

export const approveSubscription = (teacherEmail: string, adminEmail: string, notes?: string): TeacherSubscription | null => {
  const all = loadAllSubscriptions();
  const sub = all.find(s => s.teacherEmail.toLowerCase() === teacherEmail.toLowerCase());
  if (!sub) return null;

  const now = new Date();
  sub.status = 'active';
  sub.activatedAt = now.toISOString();
  sub.activatedByAdminEmail = adminEmail;
  if (notes) sub.adminNotes = notes;

  if (sub.planId === 'lifetime') {
    sub.expiresAt = null;
    sub.isLifetime = true;
  } else {
    const tier = SUBSCRIPTION_TIERS.find(t => t.id === sub.planId);
    const days = tier?.durationDays || 30;
    const exp = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    sub.expiresAt = exp.toISOString();
    sub.isLifetime = false;
  }

  saveAllSubscriptions(all);
  return sub;
};

export const suspendSubscription = (teacherEmail: string): TeacherSubscription | null => {
  const all = loadAllSubscriptions();
  const sub = all.find(s => s.teacherEmail.toLowerCase() === teacherEmail.toLowerCase());
  if (!sub) return null;

  sub.status = 'suspended';
  saveAllSubscriptions(all);
  return sub;
};

export const deleteAccountAndSubscriptionCompletely = (email: string) => {
  // 1. Delete subscription
  const all = loadAllSubscriptions();
  const filtered = all.filter(s => s.teacherEmail.toLowerCase() !== email.toLowerCase());
  saveAllSubscriptions(filtered);

  // 2. Delete pending activation accounts in auth storage if any
  try {
    const pendingRaw = localStorage.getItem('pending_auth_users');
    if (pendingRaw) {
      const pendingUsers = JSON.parse(pendingRaw);
      const updated = pendingUsers.filter((u: any) => u.email.toLowerCase() !== email.toLowerCase());
      localStorage.setItem('pending_auth_users', JSON.stringify(updated));
    }
  } catch (e) {
    console.error(e);
  }
};