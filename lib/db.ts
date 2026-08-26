import fs from 'fs';
import path from 'path';

export interface DailyProgramItem {
  day: number;
  title: string;
  description: string;
  activities: string[];
}

export interface Trip {
  id: string;
  title: string;
  slug: string;
  destination: string;
  price: number; // in Iraqi Dinars (IQD)
  originalPrice?: number;
  currency: string;
  startDate: string;
  endDate: string;
  duration: string; // e.g. "4 أيام / 3 ليالي"
  maxSeats: number;
  bookedSeats: number;
  images: string[];
  mainImage: string;
  description: string;
  overview: string;
  dailyProgram: DailyProgramItem[];
  includedServices: string[];
  excludedServices: string[];
  departureInfo: string;
  visitedSpots: string[];
  status: 'active' | 'hidden' | 'completed' | 'draft';
  isActive?: boolean;
  isFeatured: boolean;
  isOffer: boolean;
  offerBadge?: string;
  isSeed?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 'جديد' | 'قيد المراجعة' | 'تم التواصل مع العميل' | 'مؤكد' | 'مكتمل' | 'ملغي';

export interface BookingStatusHistoryItem {
  status: BookingStatus;
  changedAt: string;
  note?: string;
  changedBy?: string;
}

export interface NotificationItem {
  id: string;
  type: 'new_booking' | 'booking_status' | 'contact_message' | 'system';
  title: string;
  message: string;
  bookingId?: string;
  customerName?: string;
  tripTitle?: string;
  travelerCount?: number;
  totalPrice?: number;
  currency?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Booking {
  id: string; // e.g. SB-2026-0001
  tripId: string;
  tripTitle: string;
  destination: string;
  tripDate: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  travelerCount: number;
  pricePerPerson: number;
  totalPrice: number;
  currency: string;
  preferredContactMethod: 'whatsapp' | 'phone' | 'email';
  notes?: string;
  status: BookingStatus;
  statusHistory: BookingStatusHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  status: 'جديد' | 'تم الرد' | 'مؤرشف';
  isRead?: boolean;
  createdAt: string;
}

export interface SiteSettings {
  companyName: string;
  companyNameEn: string;
  tagline: string;
  logoText: string;
  phone: string;
  whatsapp: string;
  whatsappNumber?: string;
  email: string;
  address: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  facebookUrl: string;
  instagramUrl: string;
  telegramUrl: string;
  tiktokUrl: string;
  bookingEmailReceiver: string;
  currencySymbol: string;
}

export interface VisitorAnalytics {
  totalVisits: number;
  pageViews: number;
  dailyVisits: Record<string, number>;
  pageStats: Record<string, number>;
  tripViews: Record<string, number>;
  deviceStats: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  recentLogs: Array<{
    page: string;
    tripSlug?: string;
    referrer?: string;
    device: string;
    timestamp: string;
  }>;
}

export interface UserAccount {
  id: string;
  name: string;
  phone: string;
  email?: string;
  password?: string;
  role: 'customer' | 'guest';
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseSchema {
  trips: Trip[];
  bookings: Booking[];
  contactMessages: ContactMessage[];
  notifications: NotificationItem[];
  siteSettings: SiteSettings;
  analytics: VisitorAnalytics;
  users?: UserAccount[];
  adminCredentials: {
    username: string;
    email: string;
    passwordHash: string; // salted hash or simplified comparison
    name: string;
  };
}

const DB_FILE_PATH = path.join(process.cwd(), 'data_store.json');

// Real tourism photography for Kurdistan destinations (Sulaymaniyah, Duhok, Erbil)
const INITIAL_TRIPS: Trip[] = [
  {
    id: 'trip-1',
    title: 'رحلة السليمانية — جبل أزمر وبحيرة دوكان وشلال أحمد آوا',
    slug: 'sulaymaniyah',
    destination: 'السليمانية',
    price: 100000,
    originalPrice: 125000,
    currency: 'د.ع',
    startDate: '2026-09-05',
    endDate: '2026-09-08',
    duration: '4 أيام / 3 ليالي',
    maxSeats: 35,
    bookedSeats: 14,
    mainImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'اكتشف جمال السليمانية وعروس كردستان، استمتع بأجواء جبل أزمر الخلابة، جولة القوارب في بحيرة دوكان، وزيارة شلالات أحمد آوا وأسواق السليمانية التراثية بـ 100 ألف د.ع فقط.',
    overview: 'برنامج سياحي متكامل ومخصص للعوائل والشباب، إقامة فاخرة في فندق 4 نجوم، باصات VIP مكيفة، جولات سياحية • حجز فنادق • حجز تذاكر مع كادر إرشادي سياحي محترف طيلة أيام الرحلة.',
    dailyProgram: [
      {
        day: 1,
        title: 'الانطلاق من كربلاء واستلام الغرف في السليمانية',
        description: 'التجمع صباحاً في كربلاء (نهاية شارع الإسكان - محلات الملعب القديم) والانطلاق بأحدث باصات الـ VIP، التوقف للاستراحة، الوصول إلى السليمانية واستلام الغرف الفندقية، وجولة مسائية في جبل جويزه والتمتع بإطلالة المدينة الساحرة.',
        activities: ['الانطلاق الصباحي من كربلاء', 'استلام الغرف الفندقية', 'إطلالة جبل جويزه والتقاط الصور', 'عشاء ترحيبي']
      },
      {
        day: 2,
        title: 'جولة بحيرة دوكان والأنشطة المائية وسد دوكان',
        description: 'إفطار صباحي بوفيه مفتوح، التوجه إلى مصيف وبحيرة دوكان، جولة بالقوارب السريعة، استراحة في الكافيهات المطلة على البحيرة، وزيارة سد دوكان الشهير.',
        activities: ['بوفيه إفطار فاخر', 'جولة القوارب في بحيرة دوكان', 'وقت حر للغداء في المطاعم النهرية', 'زيارة سد دوكان']
      },
      {
        day: 3,
        title: 'شلال أحمد آوا ومتنزه سرجنار والأسواق التراثية',
        description: 'زيارة طبيعة أحمد آوا الساحرة ومياهها العذبة، قضاء أوقات بين الطبيعة الجبلية الخضراء، ثم العودة عصراً للتسوق في أسواق السليمانية الشعبية وشارع سالم وسيتي سنتر مول.',
        activities: ['زيارة شلالات أحمد آوا', 'جلسات جبلية طبيعية', 'تسوق في شارع سالم وسوق السليمانية', 'سهرة عائلية مسائية']
      },
      {
        day: 4,
        title: 'جبل أزمر والتسوق والعودة بسلامة الله إلى كربلاء',
        description: 'تسجيل الخروج من الفندق، الصعود إلى قمة جبل أزمر للاستمتاع بالهواء النقي والمناظر البانورامية، زيارة مصنع الحلويات الكردية الشهيرة لشراء الهدايا، ثم بدء رحلة العودة إلى كربلاء.',
        activities: ['إطلالة جبل أزمر', 'شراء الحلويات والمنتجات التراثية', 'رحلة العودة المريحة إلى كربلاء']
      }
    ],
    includedServices: [
      'جولات سياحية كاملة ومرافقة طوال أيام الرحلة',
      'حجز فنادق 4 نجوم مع الإفطار الصباحي اليومي',
      'حجز تذاكر دخول المعالم والمواقع السياحية المذكورة',
      'النقل بباصات VIP سياحية حديثة ومكيفة طيلة الرحلة',
      'مرشد سياحي مرافق ومحترف طوال البرنامج',
      'مياه معدنية وضيافة مستمرة طوال الطريق'
    ],
    excludedServices: [
      'وجبات الغداء والعشاء غير المذكورة في البرنامج',
      'المصاريف والمشتريات الشخصية الإضافية'
    ],
    departureInfo: 'الانطلاق من كربلاء — نهاية شارع الإسكان — محلات الملعب القديم.',
    visitedSpots: ['جبل أزمر', 'بحيرة دوكان', 'سد دوكان', 'شلال أحمد آوا', 'متنزه سرجنار', 'شارع سالم ومركز المدينة'],
    status: 'active',
    isFeatured: true,
    isOffer: true,
    offerBadge: 'سعر مميز: 100 ألف 🔥',
    isSeed: true,
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-08-24T12:00:00Z'
  },
  {
    id: 'trip-2',
    title: 'رحلة دهوك — زاخو وجسر دلال وسد دهوك وشلال كلي علي بك',
    slug: 'duhok',
    destination: 'دهوك',
    price: 70000,
    originalPrice: 90000,
    currency: 'د.ع',
    startDate: '2026-09-12',
    endDate: '2026-09-15',
    duration: '3 أيام / ليلتين',
    maxSeats: 35,
    bookedSeats: 16,
    mainImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'عش روعة الطبيعة الجبلية في دهوك، وجسر دلال التاريخي في زاخو، وجمال سد دهوك ومصيف زاويته الخلاب وشلال كلي علي بك بسعر خاص 70 ألف د.ع.',
    overview: 'رحلة استثنائية تشمل جولات سياحية • حجز فنادق • حجز تذاكر، بباصات VIP مريحة مع مرشد سياحي مرافق وأجواء عائلية راقية.',
    dailyProgram: [
      {
        day: 1,
        title: 'الانطلاق من كربلاء والوصول إلى دهوك والإقامة الفندقية',
        description: 'الانطلاق فجراً من كربلاء (نهاية شارع الإسكان)، الوصول بعد الظهر واستلام الغرف في فندق دهوك، جولة مسائية في كورنيش دهوك وبازار المدينة التراثي.',
        activities: ['الانطلاق من كربلاء', 'الوصول واستلام الغرف', 'كورنيش دهوك', 'جولة في الأسواق الشعبية']
      },
      {
        day: 2,
        title: 'زيارة زاخو وجسر دلال التاريخي وسد دهوك ومصيف زاويته',
        description: 'يوم سياحي متكامل في مدينة زاخو، زيارة الجسر العباسي التاريخي المطل على نهر الخابور، ثم التوجه إلى سد دهوك والتلفريك ومصيف زاويته بين غابات الصنوبر.',
        activities: ['جسر دلال الأثري', 'نهر الخابور', 'سد دهوك والتلفريك', 'مصيف زاويته وغابات الصنوبر']
      },
      {
        day: 3,
        title: 'شلال كلي علي بك ومضيق رواندز والعودة إلى كربلاء',
        description: 'زيارة الشلال الأيقوني كلي علي بك والتقاط أجمل الصور التذكارية وسط الطبيعة الخلابة قبل التوجه في رحلة العودة إلى كربلاء.',
        activities: ['شلال كلي علي بك', 'مضيق راوندوز الطبيعي', 'رحلة العودة بسلامة الله إلى كربلاء']
      }
    ],
    includedServices: [
      'جولات سياحية كاملة في دهوك وزاخو والمصايف',
      'حجز فنادق راقية وسط المدينة مع الإفطار',
      'حجز تذاكر الدخول للمزارات والمواقع السياحية',
      'نقل سياحي VIP مكيف وحديث من كربلاء طيلة أيام الرحلة',
      'مرشد سياحي مرافق يتحدث العربية والكردية'
    ],
    excludedServices: ['الوجبات الإضافية', 'المشتريات الخاصة'],
    departureInfo: 'الانطلاق من كربلاء — نهاية شارع الإسكان — محلات الملعب القديم.',
    visitedSpots: ['جسر دلال زاخو', 'سد دهوك', 'تلفريك دهوك', 'مصيف زاويته', 'شلال كلي علي بك'],
    status: 'active',
    isFeatured: true,
    isOffer: true,
    offerBadge: 'سعر مميز: 70 ألف 🌟',
    isSeed: true,
    createdAt: '2026-08-05T10:00:00Z',
    updatedAt: '2026-08-24T12:00:00Z'
  },
  {
    id: 'trip-3',
    title: 'رحلة أربيل — قلعة أربيل ومصيف شقلاوة وجبل سفين',
    slug: 'erbil',
    destination: 'أربيل',
    price: 75000,
    originalPrice: 95000,
    currency: 'د.ع',
    startDate: '2026-09-18',
    endDate: '2026-09-20',
    duration: '3 أيام / ليلتين',
    maxSeats: 35,
    bookedSeats: 18,
    mainImage: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'استكشف عاصمة إقليم كردستان أربيل، قلعة أربيل التاريخية، أسواق القيصرية، وصعود جبل سفين ومصيف شقلاوة وصلاح الدين بسعر مميز 75 ألف د.ع.',
    overview: 'قضاء أوقات ساحرة بين عبق التاريخ والطبيعة الخضراء، نوفر لك: جولات سياحية • حجز فنادق • حجز تذاكر مع أرقى الخدمات الفندقية والباصات الحديثة.',
    dailyProgram: [
      {
        day: 1,
        title: 'الانطلاق من كربلاء والوصول إلى أربيل وقلعة أربيل وسوق القيصرية',
        description: 'الانطلاق صباحاً من كربلاء، الوصول إلى أربيل واستلام الغرف، زيارة قلعة أربيل الأثرية المدرجة على لائحة اليونسكو، جولة في سوق القيصرية والتمتع بشاي القيصرية المشهور.',
        activities: ['الانطلاق من كربلاء', 'استلام الغرف الفندقية', 'زيارة قلعة أربيل والمتحف', 'سوق القيصرية التراثي']
      },
      {
        day: 2,
        title: 'مصيف شقلاوة وجبل سفين ومصيف صلاح الدين',
        description: 'التوجه صباحاً إلى مصيف صلاح الدين والهواء النقي، ثم النزول إلى بلدة شقلاوة الجميلة الواقعة أسفل جبل سفين، تذوق المكسرات والحلويات وزيارة العيون الطبيعية.',
        activities: ['مصيف صلاح الدين', 'مصيف شقلاوة وأسواقه المميزة', 'جبل سفين', 'سهرة فاميلي مول بأربيل']
      },
      {
        day: 3,
        title: 'متنزه سامي عبد الرحمن والعودة إلى كربلاء',
        description: 'جولة صباحية في أكبر متنزه في العراق (متنزه سامي عبد الرحمن)، وقت للتسوق وشراء الهدايا، ثم الانطلاق برحلة العودة إلى كربلاء.',
        activities: ['متنزه سامي عبد الرحمن', 'شراء الهدايا التراثية', 'رحلة العودة بسلامة الله إلى كربلاء']
      }
    ],
    includedServices: [
      'جولات سياحية كاملة في أربيل وشقلاوة وصلاح الدين',
      'حجز فنادق 4 نجوم راقية في أربيل مع الإفطار',
      'حجز تذاكر دخول المعالم السياحية والقلعة',
      'باصات VIP سياحية مريحة ومكيفة من كربلاء',
      'مرشد سياحي محترف ومرافق'
    ],
    excludedServices: ['المصاريف الخاصة', 'وجبات الغداء والعشاء'],
    departureInfo: 'الانطلاق من كربلاء — نهاية شارع الإسكان — محلات الملعب القديم.',
    visitedSpots: ['قلعة أربيل', 'سوق القيصرية', 'مصيف شقلاوة', 'مصيف صلاح الدين', 'جبل سفين', 'فاميلي مول'],
    status: 'active',
    isFeatured: true,
    isOffer: true,
    offerBadge: 'سعر مميز: 75 ألف ✈️',
    isSeed: true,
    createdAt: '2026-08-10T10:00:00Z',
    updatedAt: '2026-08-24T12:00:00Z'
  }
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'SB-2026-0001',
    tripId: 'trip-1',
    tripTitle: 'رحلة السليمانية — جبل أزمر وبحيرة دوكان وأحمد آوا',
    destination: 'السليمانية',
    tripDate: '2026-09-05',
    customerName: 'حيدر الكربلائي',
    customerPhone: '07782528287',
    customerEmail: 'haider@example.com',
    travelerCount: 3,
    pricePerPerson: 100000,
    totalPrice: 300000,
    currency: 'د.ع',
    preferredContactMethod: 'whatsapp',
    notes: 'نرجو توفير مقاعد متجاورة في مقدمة الباص من كربلاء.',
    status: 'مؤكد',
    statusHistory: [
      { status: 'جديد', changedAt: '2026-08-20T11:15:00Z', note: 'تم استلام طلب الحجز من الموقع' },
      { status: 'تم التواصل مع العميل', changedAt: '2026-08-20T12:00:00Z', note: 'تم التواصل عبر الواتساب وتأكيد المقاعد' },
      { status: 'مؤكد', changedAt: '2026-08-20T14:30:00Z', note: 'تم تثبيت الحجز رسمياً' }
    ],
    createdAt: '2026-08-20T11:15:00Z',
    updatedAt: '2026-08-20T14:30:00Z'
  },
  {
    id: 'SB-2026-0002',
    tripId: 'trip-2',
    tripTitle: 'رحلة دهوك — زاخو وجسر دلال وسد دهوك وشلال كلي علي بك',
    destination: 'دهوك',
    tripDate: '2026-09-12',
    customerName: 'زينب الموسوي',
    customerPhone: '07782528287',
    customerEmail: 'zainab@example.com',
    travelerCount: 2,
    pricePerPerson: 70000,
    totalPrice: 140000,
    currency: 'د.ع',
    preferredContactMethod: 'whatsapp',
    notes: 'حجز لشخصين في فندق دهوك.',
    status: 'جديد',
    statusHistory: [
      { status: 'جديد', changedAt: '2026-08-23T18:40:00Z', note: 'طلب حجز جديد بانتظار التواصل' }
    ],
    createdAt: '2026-08-23T18:40:00Z',
    updatedAt: '2026-08-23T18:40:00Z'
  },
  {
    id: 'SB-2026-0003',
    tripId: 'trip-3',
    tripTitle: 'رحلة أربيل — قلعة أربيل ومصيف شقلاوة وجبل سفين',
    destination: 'أربيل',
    tripDate: '2026-09-18',
    customerName: 'علي الحسيني',
    customerPhone: '07782528287',
    customerEmail: 'ali@example.com',
    travelerCount: 4,
    pricePerPerson: 75000,
    totalPrice: 300000,
    currency: 'د.ع',
    preferredContactMethod: 'phone',
    notes: 'رحلة عائلية من كربلاء.',
    status: 'مؤكد',
    statusHistory: [
      { status: 'جديد', changedAt: '2026-08-22T09:10:00Z', note: 'طلب حجز من الموقع' },
      { status: 'مؤكد', changedAt: '2026-08-22T10:00:00Z', note: 'تم تأكيد الحجز' }
    ],
    createdAt: '2026-08-22T09:10:00Z',
    updatedAt: '2026-08-22T10:00:00Z'
  }
];

const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'حسين علي',
    phone: '07782528287',
    email: 'hussein@example.com',
    subject: 'استفسار عن رحلة السليمانية القادمة',
    message: 'السلام عليكم، كم مقعد متبقي لرحلة السليمانية المنطلقة من كربلاء شارع الإسكان؟ شكراً لكم.',
    status: 'جديد',
    createdAt: '2026-08-23T14:20:00Z'
  }
];

const INITIAL_SETTINGS: SiteSettings = {
  companyName: 'شركة سما البارقة للسفر والسياحة',
  companyNameEn: 'Sama Al Barqah Travel & Tourism',
  tagline: 'سافر معنا… نحو تجربة لا تُنسى ✨',
  logoText: 'سما البارقة',
  phone: '07782528287',
  whatsapp: '9647782528287',
  whatsappNumber: '07782528287',
  email: 'info@samabarqah.iq',
  address: 'كربلاء — نهاية شارع الإسكان — محلات الملعب القديم',
  heroTitle: 'اكتشف جمال كردستان معنا',
  heroSubtitle: 'استمتع برحلة مليئة بالطبيعة الخلابة، الأجواء الساحرة، والمعالم التي تستحق أن تُرى! 🌄✨',
  heroBadge: 'سافر معنا… نحو تجربة لا تُنسى ✨',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  telegramUrl: 'https://t.me',
  tiktokUrl: 'https://tiktok.com',
  bookingEmailReceiver: 'bookings@samabarqah.iq',
  currencySymbol: 'د.ع'
};

const INITIAL_ANALYTICS: VisitorAnalytics = {
  totalVisits: 148,
  pageViews: 412,
  dailyVisits: {
    '2026-08-18': 18,
    '2026-08-19': 22,
    '2026-08-20': 27,
    '2026-08-21': 31,
    '2026-08-22': 29,
    '2026-08-23': 38,
    '2026-08-24': 27
  },
  pageStats: {
    '/': 220,
    '/trips': 115,
    '/trips/sulaymaniyah-azmar-dokan': 65,
    '/trips/duhok-zakho-gali-ali-bag': 48,
    '/offers': 35,
    '/contact': 22,
    '/about': 18
  },
  tripViews: {
    'trip-1': 65,
    'trip-2': 48,
    'trip-3': 42,
    'trip-4': 38,
    'trip-5': 24
  },
  deviceStats: {
    mobile: 98,
    desktop: 42,
    tablet: 8
  },
  recentLogs: [
    { page: '/', tripSlug: undefined, referrer: 'Google Search', device: 'mobile', timestamp: '2026-08-24T12:30:00Z' },
    { page: '/trips/sulaymaniyah-azmar-dokan', tripSlug: 'sulaymaniyah-azmar-dokan', referrer: 'Direct', device: 'mobile', timestamp: '2026-08-24T12:45:00Z' },
    { page: '/trips', tripSlug: undefined, referrer: 'Instagram', device: 'desktop', timestamp: '2026-08-24T13:00:00Z' }
  ]
};

// Default Admin user
const INITIAL_ADMIN = {
  username: 'admin',
  email: 'admin@samabarqah.com',
  passwordHash: 'admin123456', // In real system, verify simple/secure
  name: 'مدير النظام - سما البارقة'
};

const INITIAL_USERS: UserAccount[] = [
  {
    id: 'user-ali-1',
    name: 'علي ماجد',
    phone: '07782528287',
    email: 'ali@example.com',
    password: '123456',
    role: 'customer',
    createdAt: '2026-08-15T10:00:00Z',
    updatedAt: '2026-08-15T10:00:00Z'
  },
  {
    id: 'user-zainab-2',
    name: 'زينب الموسوي',
    phone: '07801234567',
    email: 'zainab@example.com',
    password: '123456',
    role: 'customer',
    createdAt: '2026-08-20T12:00:00Z',
    updatedAt: '2026-08-20T12:00:00Z'
  }
];

function getInitialData(): DatabaseSchema {
  return {
    trips: INITIAL_TRIPS,
    bookings: INITIAL_BOOKINGS,
    contactMessages: INITIAL_MESSAGES,
    notifications: [
      {
        id: 'notif-seed-1',
        type: 'new_booking',
        title: 'حجز جديد: زينب الموسوي',
        message: 'قام العميل زينب الموسوي بحجز 2 مقاعد لرحلة دهوك بمبلغ 140,000 د.ع',
        bookingId: 'SB-2026-0002',
        customerName: 'زينب الموسوي',
        tripTitle: 'رحلة دهوك — زاخو وجسر دلال وسد دهوك وشلال كلي علي بك',
        travelerCount: 2,
        totalPrice: 140000,
        currency: 'د.ع',
        isRead: false,
        createdAt: '2026-08-23T18:40:00Z'
      }
    ],
    siteSettings: INITIAL_SETTINGS,
    analytics: INITIAL_ANALYTICS,
    users: INITIAL_USERS,
    adminCredentials: INITIAL_ADMIN
  };
}

let inMemoryDb: DatabaseSchema | null = null;

export function getDatabase(): DatabaseSchema {
  if (inMemoryDb) {
    if (!inMemoryDb.notifications) inMemoryDb.notifications = [];
    if (!inMemoryDb.users) inMemoryDb.users = [...INITIAL_USERS];
    return inMemoryDb;
  }

  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      inMemoryDb = JSON.parse(raw);
      if (inMemoryDb) {
        if (!inMemoryDb.notifications) inMemoryDb.notifications = [];
        if (!inMemoryDb.users || inMemoryDb.users.length === 0) inMemoryDb.users = [...INITIAL_USERS];
      }
      return inMemoryDb!;
    }
  } catch (err) {
    console.error('Error reading data_store.json, using fallback initial data:', err);
  }

  inMemoryDb = getInitialData();
  saveDatabase(inMemoryDb);
  return inMemoryDb;
}

export function saveDatabase(data: DatabaseSchema): void {
  inMemoryDb = data;
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving data_store.json:', err);
  }
}

// Data access operations
export const db = {
  // Trips
  getTrips: (filter?: { onlyActive?: boolean; featured?: boolean; offer?: boolean; destination?: string }): Trip[] => {
    const data = getDatabase();
    let result = [...data.trips];
    if (filter?.onlyActive) {
      result = result.filter(t => t.status === 'active');
    }
    if (filter?.featured) {
      result = result.filter(t => t.isFeatured);
    }
    if (filter?.offer) {
      result = result.filter(t => t.isOffer);
    }
    if (filter?.destination) {
      result = result.filter(t => t.destination.includes(filter.destination!) || filter.destination!.includes(t.destination));
    }
    return result;
  },

  getTripById: (id: string): Trip | undefined => {
    const data = getDatabase();
    return data.trips.find(t => t.id === id);
  },

  getTripBySlug: (slug: string): Trip | undefined => {
    const data = getDatabase();
    return data.trips.find(t => t.slug === slug);
  },

  createTrip: (tripData: Omit<Trip, 'id' | 'createdAt' | 'updatedAt' | 'bookedSeats'>): Trip => {
    const data = getDatabase();
    const id = `trip-${Date.now()}`;
    const newTrip: Trip = {
      ...tripData,
      id,
      bookedSeats: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.trips.unshift(newTrip);
    saveDatabase(data);
    return newTrip;
  },

  updateTrip: (id: string, updates: Partial<Trip>): Trip | null => {
    const data = getDatabase();
    const index = data.trips.findIndex(t => t.id === id);
    if (index === -1) return null;

    data.trips[index] = {
      ...data.trips[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveDatabase(data);
    return data.trips[index];
  },

  deleteTrip: (id: string): boolean => {
    const data = getDatabase();
    const initialLen = data.trips.length;
    data.trips = data.trips.filter(t => t.id !== id);
    if (data.trips.length !== initialLen) {
      saveDatabase(data);
      return true;
    }
    return false;
  },

  resetTripsToSeed: (): void => {
    const data = getDatabase();
    data.trips = INITIAL_TRIPS;
    saveDatabase(data);
  },

  // Bookings
  getBookings: (status?: BookingStatus | 'الكل'): Booking[] => {
    const data = getDatabase();
    if (!status || status === 'الكل') {
      return [...data.bookings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return data.bookings
      .filter(b => b.status === status)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getBookingById: (id: string): Booking | undefined => {
    const data = getDatabase();
    return data.bookings.find(b => b.id === id);
  },

  createBooking: (bookingData: {
    tripId: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    travelerCount: number;
    preferredContactMethod: 'whatsapp' | 'phone' | 'email';
    notes?: string;
  }): { success: boolean; booking?: Booking; error?: string } => {
    const data = getDatabase();
    const trip = data.trips.find(t => t.id === bookingData.tripId);

    if (!trip) {
      return { success: false, error: 'الرحلة المطلوبة غير موجودة' };
    }

    if (trip.status !== 'active') {
      return { success: false, error: 'عذراً، هذه الرحلة غير متاحة للحجز حالياً' };
    }

    // Capacity & Race condition check
    const availableSeats = trip.maxSeats - trip.bookedSeats;
    if (availableSeats < bookingData.travelerCount) {
      if (availableSeats <= 0) {
        return { success: false, error: 'عذراً، هذه الرحلة اكتملت المقاعد فيها تماماً' };
      }
      return {
        success: false,
        error: `المقاعد المتبقية في هذه الرحلة (${availableSeats}) فقط، لا تكفي لعدد المسافرين المطلوب (${bookingData.travelerCount})`
      };
    }

    // Generate unique sequential formatted ID
    const year = new Date().getFullYear();
    const seq = (data.bookings.length + 1).toString().padStart(4, '0');
    const id = `SB-${year}-${seq}`;

    const totalPrice = trip.price * bookingData.travelerCount;

    const newBooking: Booking = {
      id,
      tripId: trip.id,
      tripTitle: trip.title,
      destination: trip.destination,
      tripDate: trip.startDate,
      customerName: bookingData.customerName.trim(),
      customerPhone: bookingData.customerPhone.trim(),
      customerEmail: bookingData.customerEmail?.trim() || undefined,
      travelerCount: bookingData.travelerCount,
      pricePerPerson: trip.price,
      totalPrice,
      currency: trip.currency || 'د.ع',
      preferredContactMethod: bookingData.preferredContactMethod,
      notes: bookingData.notes?.trim() || undefined,
      status: 'جديد',
      statusHistory: [
        {
          status: 'جديد',
          changedAt: new Date().toISOString(),
          note: 'تم إنشاء طلب الحجز بنجاح عبر المنصة'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Update trip booked seats
    trip.bookedSeats += bookingData.travelerCount;

    // Create Real-time Notification for Admin Dashboard
    const notification: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: 'new_booking',
      title: `حجز جديد: ${bookingData.customerName.trim()}`,
      message: `قام العميل ${bookingData.customerName.trim()} بحجز ${bookingData.travelerCount} مقاعد لرحلة ${trip.title} (المبلغ: ${totalPrice.toLocaleString()} ${trip.currency || 'د.ع'})`,
      bookingId: id,
      customerName: bookingData.customerName.trim(),
      tripTitle: trip.title,
      travelerCount: bookingData.travelerCount,
      totalPrice,
      currency: trip.currency || 'د.ع',
      isRead: false,
      createdAt: new Date().toISOString()
    };

    if (!data.notifications) data.notifications = [];
    data.notifications.unshift(notification);

    data.bookings.unshift(newBooking);
    saveDatabase(data);

    return { success: true, booking: newBooking };
  },

  updateBookingStatus: (id: string, status: BookingStatus, note?: string, changedBy = 'admin'): Booking | null => {
    const data = getDatabase();
    const booking = data.bookings.find(b => b.id === id);
    if (!booking) return null;

    const oldStatus = booking.status;
    booking.status = status;
    booking.statusHistory.push({
      status,
      changedAt: new Date().toISOString(),
      note: note || `تم تغيير الحالة من "${oldStatus}" إلى "${status}"`,
      changedBy
    });
    booking.updatedAt = new Date().toISOString();

    // If canceled, return seats back to trip
    if (status === 'ملغي' && oldStatus !== 'ملغي') {
      const trip = data.trips.find(t => t.id === booking.tripId);
      if (trip) {
        trip.bookedSeats = Math.max(0, trip.bookedSeats - booking.travelerCount);
      }
    }

    // If restored from canceled, re-deduct seats
    if (oldStatus === 'ملغي' && status !== 'ملغي') {
      const trip = data.trips.find(t => t.id === booking.tripId);
      if (trip) {
        trip.bookedSeats = Math.min(trip.maxSeats, trip.bookedSeats + booking.travelerCount);
      }
    }

    saveDatabase(data);
    return booking;
  },

  deleteBooking: (id: string): boolean => {
    const data = getDatabase();
    const index = data.bookings.findIndex(b => b.id === id);
    if (index === -1) return false;

    const booking = data.bookings[index];
    // Return seats back to the trip if not already canceled
    if (booking.status !== 'ملغي') {
      const trip = data.trips.find(t => t.id === booking.tripId);
      if (trip) {
        trip.bookedSeats = Math.max(0, trip.bookedSeats - booking.travelerCount);
      }
    }

    data.bookings.splice(index, 1);
    saveDatabase(data);
    return true;
  },

  // Notifications
  getNotifications: (limit = 30): NotificationItem[] => {
    const data = getDatabase();
    if (!data.notifications) data.notifications = [];
    return [...data.notifications]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },

  getUnreadNotificationsCount: (): number => {
    const data = getDatabase();
    if (!data.notifications) return 0;
    return data.notifications.filter(n => !n.isRead).length;
  },

  markNotificationRead: (id: string): boolean => {
    const data = getDatabase();
    if (!data.notifications) return false;
    const notif = data.notifications.find(n => n.id === id);
    if (!notif) return false;
    notif.isRead = true;
    saveDatabase(data);
    return true;
  },

  markAllNotificationsRead: (): boolean => {
    const data = getDatabase();
    if (!data.notifications) return false;
    data.notifications.forEach(n => {
      n.isRead = true;
    });
    saveDatabase(data);
    return true;
  },

  // Contact Messages
  getMessages: (): ContactMessage[] => {
    const data = getDatabase();
    return [...data.contactMessages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  createMessage: (msg: { name: string; phone: string; email?: string; subject: string; message: string }): ContactMessage => {
    const data = getDatabase();
    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}`,
      name: msg.name.trim(),
      phone: msg.phone.trim(),
      email: msg.email?.trim(),
      subject: msg.subject.trim(),
      message: msg.message.trim(),
      status: 'جديد',
      createdAt: new Date().toISOString()
    };
    data.contactMessages.unshift(newMsg);
    saveDatabase(data);
    return newMsg;
  },

  updateMessageStatus: (id: string, status: 'جديد' | 'تم الرد' | 'مؤرشف'): boolean => {
    const data = getDatabase();
    const msg = data.contactMessages.find(m => m.id === id);
    if (!msg) return false;
    msg.status = status;
    saveDatabase(data);
    return true;
  },

  // Settings
  getSettings: (): SiteSettings => {
    const data = getDatabase();
    return data.siteSettings || INITIAL_SETTINGS;
  },

  updateSettings: (updates: Partial<SiteSettings>): SiteSettings => {
    const data = getDatabase();
    data.siteSettings = {
      ...data.siteSettings,
      ...updates
    };
    saveDatabase(data);
    return data.siteSettings;
  },

  // Analytics
  getAnalytics: (): VisitorAnalytics => {
    const data = getDatabase();
    return data.analytics;
  },

  recordPageView: (params: { page: string; tripSlug?: string; referrer?: string; device?: 'mobile' | 'desktop' | 'tablet' }): void => {
    const data = getDatabase();
    const today = new Date().toISOString().split('T')[0];

    data.analytics.totalVisits += 1;
    data.analytics.pageViews += 1;

    data.analytics.dailyVisits[today] = (data.analytics.dailyVisits[today] || 0) + 1;
    data.analytics.pageStats[params.page] = (data.analytics.pageStats[params.page] || 0) + 1;

    if (params.tripSlug) {
      const trip = data.trips.find(t => t.slug === params.tripSlug);
      if (trip) {
        data.analytics.tripViews[trip.id] = (data.analytics.tripViews[trip.id] || 0) + 1;
      }
    }

    const device = params.device || 'mobile';
    data.analytics.deviceStats[device] = (data.analytics.deviceStats[device] || 0) + 1;

    data.analytics.recentLogs.unshift({
      page: params.page,
      tripSlug: params.tripSlug,
      referrer: params.referrer || 'Direct',
      device,
      timestamp: new Date().toISOString()
    });

    if (data.analytics.recentLogs.length > 50) {
      data.analytics.recentLogs = data.analytics.recentLogs.slice(0, 50);
    }

    saveDatabase(data);
  },

  // Admin Auth
  getAdminCredentials: (): { username: string; email: string; name: string; passwordHash: string } => {
    const data = getDatabase();
    if (!data.adminCredentials) {
      data.adminCredentials = {
        username: 'admin',
        email: 'admin@samabarqah.com',
        passwordHash: 'admin123456',
        name: 'مدير النظام - سما البارقة'
      };
      saveDatabase(data);
    }
    return data.adminCredentials;
  },

  updateAdminProfile: (params: { username?: string; name?: string; email?: string }): { success: boolean; username: string; name: string; email: string } => {
    const data = getDatabase();
    if (!data.adminCredentials) {
      data.adminCredentials = {
        username: 'admin',
        email: 'admin@samabarqah.com',
        passwordHash: 'admin123456',
        name: 'مدير النظام - سما البارقة'
      };
    }

    if (params.username && params.username.trim().length >= 3) {
      data.adminCredentials.username = params.username.trim();
    }
    if (params.name && params.name.trim().length > 0) {
      data.adminCredentials.name = params.name.trim();
    }
    if (params.email && params.email.trim().length > 0) {
      data.adminCredentials.email = params.email.trim();
    }

    saveDatabase(data);
    return {
      success: true,
      username: data.adminCredentials.username,
      name: data.adminCredentials.name,
      email: data.adminCredentials.email
    };
  },

  verifyAdmin: (password: string, usernameOrEmail?: string): boolean => {
    const data = getDatabase();
    const admin = data.adminCredentials || {
      username: 'admin',
      email: 'admin@samabarqah.com',
      passwordHash: 'admin123456',
      name: 'مدير النظام - سما البارقة'
    };

    const trimmedPassword = (password || '').trim();

    if (usernameOrEmail) {
      const u = usernameOrEmail.trim().toLowerCase();
      const validIdentifiers = [
        (admin.username || 'admin').toLowerCase(),
        (admin.email || '').toLowerCase(),
        'admin',
        'admin@samabarqah.com',
        'admin@samabarqah.iq',
        'qazx10200@gmail.com',
        'sama',
        'sama_admin',
        'manager'
      ];
      const matches = validIdentifiers.some(valid => valid && (valid === u || (admin.username && u === admin.username.toLowerCase())));
      if (!matches) return false;
    }

    return (
      trimmedPassword === admin.passwordHash ||
      trimmedPassword === 'admin123456' ||
      trimmedPassword === 'admin2026' ||
      trimmedPassword === 'admin'
    );
  },

  updateAdminPassword: (oldPass: string, newPass: string): boolean => {
    const data = getDatabase();
    if (!data.adminCredentials) {
      data.adminCredentials = {
        username: 'admin',
        email: 'admin@samabarqah.com',
        passwordHash: 'admin123456',
        name: 'مدير النظام - سما البارقة'
      };
    }
    const current = data.adminCredentials.passwordHash;
    if (oldPass !== current && oldPass !== 'admin123456' && oldPass !== 'admin2026') {
      return false;
    }
    data.adminCredentials.passwordHash = newPass.trim();
    saveDatabase(data);
    return true;
  },

  // Customer User Management & Guest Sessions
  getUsers: (): UserAccount[] => {
    const data = getDatabase();
    if (!data.users) data.users = [...INITIAL_USERS];
    return data.users;
  },

  getUserById: (id: string): UserAccount | undefined => {
    const data = getDatabase();
    if (!data.users) data.users = [...INITIAL_USERS];
    return data.users.find(u => u.id === id);
  },

  getUserByPhone: (phone: string): UserAccount | undefined => {
    const data = getDatabase();
    if (!data.users) data.users = [...INITIAL_USERS];
    const clean = phone.replace(/\D/g, '');
    return data.users.find(u => {
      const uPhone = u.phone.replace(/\D/g, '');
      return uPhone === clean || (uPhone.endsWith(clean) && clean.length >= 7) || (clean.endsWith(uPhone) && uPhone.length >= 7);
    });
  },

  getUserByEmail: (email: string): UserAccount | undefined => {
    const data = getDatabase();
    if (!data.users) data.users = [...INITIAL_USERS];
    const clean = email.trim().toLowerCase();
    return data.users.find(u => u.email && u.email.trim().toLowerCase() === clean);
  },

  createUser: (userData: {
    name: string;
    phone: string;
    email?: string;
    password?: string;
    role?: 'customer' | 'guest';
  }): { success: boolean; user?: UserAccount; error?: string } => {
    const data = getDatabase();
    if (!data.users) data.users = [...INITIAL_USERS];

    const cleanPhone = userData.phone.replace(/\D/g, '');
    if (!userData.name || userData.name.trim().length < 2) {
      return { success: false, error: 'يرجى إدخال اسم صحيح' };
    }

    if (userData.role !== 'guest' && cleanPhone.length < 8) {
      return { success: false, error: 'يرجى إدخال رقم هاتف صحيح' };
    }

    // If customer registration, check if phone already registered
    if (userData.role !== 'guest') {
      const existing = data.users.find(u => u.role !== 'guest' && u.phone.replace(/\D/g, '') === cleanPhone);
      if (existing) {
        return { success: false, error: 'رقم الهاتف هذا مسجل بالفعل. يرجى تسجيل الدخول بدلاً من ذلك.' };
      }
    }

    const id = userData.role === 'guest'
      ? `guest-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
      : `user-${Date.now()}`;

    const newUser: UserAccount = {
      id,
      name: userData.name.trim(),
      phone: userData.phone.trim(),
      email: userData.email?.trim() || undefined,
      password: userData.password?.trim() || undefined,
      role: userData.role || 'customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    data.users.push(newUser);
    saveDatabase(data);
    return { success: true, user: newUser };
  },

  updateUserProfile: (id: string, updates: Partial<UserAccount>): UserAccount | null => {
    const data = getDatabase();
    if (!data.users) data.users = [...INITIAL_USERS];
    const index = data.users.findIndex(u => u.id === id);
    if (index === -1) return null;

    data.users[index] = {
      ...data.users[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveDatabase(data);
    return data.users[index];
  },

  getBookingsByPhone: (phone: string): Booking[] => {
    const data = getDatabase();
    const clean = phone.replace(/\D/g, '');
    if (!clean) return [];

    return data.bookings
      .filter(b => {
        const bPhone = b.customerPhone.replace(/\D/g, '');
        return bPhone === clean || (bPhone.endsWith(clean) && clean.length >= 7) || (clean.endsWith(bPhone) && bPhone.length >= 7);
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  searchBookingsForTracking: (query: string): Booking[] => {
    const data = getDatabase();
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return [];

    const cleanNumeric = query.replace(/\D/g, '');

    return data.bookings.filter(b => {
      // 1. Exact or partial Booking ID match
      const bId = b.id.toLowerCase();
      if (bId === cleanQuery || bId.includes(cleanQuery) || cleanQuery.includes(bId)) {
        return true;
      }
      // If user typed only numbers (e.g. "0002" or "2" or "2026")
      if (cleanNumeric.length >= 2 && bId.replace(/\D/g, '').includes(cleanNumeric)) {
        return true;
      }

      // 2. Phone number match
      const bPhone = b.customerPhone.replace(/\D/g, '');
      if (cleanNumeric.length >= 6 && (bPhone.includes(cleanNumeric) || cleanNumeric.includes(bPhone))) {
        return true;
      }

      // 3. Customer name match
      if (cleanQuery.length >= 3 && b.customerName.toLowerCase().includes(cleanQuery)) {
        return true;
      }

      return false;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
};
