// Utility functions for authentic Bengali news display and dynamic calendar calculation
// Strictly aligned with Bangladesh Standard Time (Asia/Dhaka) & Bangla Academy Official Calendar

const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliNumber(num: number | string): string {
  if (num === undefined || num === null) return '';
  return num
    .toString()
    .replace(/[0-9]/g, match => bengaliDigits[parseInt(match, 10)]);
}

export interface BengaliDateInfo {
  dayName: string;
  gregorianDate: string;
  gregorianWithDay: string;
  englishDate: string;
  englishWithDay: string;
  bengaliEra: string;
  bengaliDateOnly: string;
  fullDateString: string;
  season: string;
  formattedTime: string;
}

const DAYS_BN = [
  'রবিবার',
  'সোমবার',
  'মঙ্গলবার',
  'বুধবার',
  'বৃহস্পতিবার',
  'শুক্রবার',
  'শনিবার'
];

const GREGORIAN_MONTHS_BN = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর'
];

const BANGLA_MONTHS = [
  'বৈশাখ',
  'জ্যৈষ্ঠ',
  'আষাঢ়',
  'শ্রাবণ',
  'ভাদ্র',
  'আশ্বিন',
  'কার্তিক',
  'অগ্রহায়ণ',
  'পৌষ',
  'মাঘ',
  'ফাল্গুন',
  'চৈত্র'
];

const BANGLA_SEASONS = [
  'গ্রীষ্মকাল', // বৈশাখ-জ্যৈষ্ঠ
  'বর্ষাকাল',  // আষাঢ়-শ্রাবণ
  'শরৎকাল',   // ভাদ্র-আশ্বিন
  'হেমন্তকাল', // কার্তিক-অগ্রহায়ণ
  'শীতকাল',   // পৌষ-মাঘ
  'বসন্তকাল'  // ফাল্গুন-চৈত্র
];

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Calculates current date in Bangladesh Standard Time (UTC+6, Asia/Dhaka)
 * and accurately computes the corresponding Bengali Calendar date (বঙ্গাব্দ)
 * based on Bangla Academy's official revised calendar.
 */
export function getCurrentBengaliDate(targetDate: Date = new Date()): BengaliDateInfo {
  // Use Intl.DateTimeFormat with Asia/Dhaka to get true Bangladesh local time regardless of user's browser location
  let bstYear = targetDate.getFullYear();
  let bstMonth = targetDate.getMonth() + 1; // 1-12
  let bstDay = targetDate.getDate();
  let bstWeekdayIndex = targetDate.getDay();
  let bstHour = targetDate.getHours();
  let bstMinute = targetDate.getMinutes();

  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Dhaka',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    }).formatToParts(targetDate);

    const comp: Record<string, string> = {};
    for (const p of parts) comp[p.type] = p.value;

    if (comp.year) bstYear = parseInt(comp.year, 10);
    if (comp.month) bstMonth = parseInt(comp.month, 10);
    if (comp.day) bstDay = parseInt(comp.day, 10);
    if (comp.hour) bstHour = parseInt(comp.hour, 10);
    if (comp.minute) bstMinute = parseInt(comp.minute, 10);

    const weekdayMap: Record<string, number> = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6
    };
    if (comp.weekday && weekdayMap[comp.weekday] !== undefined) {
      bstWeekdayIndex = weekdayMap[comp.weekday];
    }
  } catch {
    // Fallback to manual UTC+6 offset if Intl timezone is unsupported
    const utc = targetDate.getTime() + targetDate.getTimezoneOffset() * 60000;
    const bst = new Date(utc + 6 * 3600000);
    bstYear = bst.getFullYear();
    bstMonth = bst.getMonth() + 1;
    bstDay = bst.getDate();
    bstWeekdayIndex = bst.getDay();
    bstHour = bst.getHours();
    bstMinute = bst.getMinutes();
  }

  const dayName = DAYS_BN[bstWeekdayIndex] || 'শনিবার';
  const gregorianDate = `${toBengaliNumber(bstDay)} ${GREGORIAN_MONTHS_BN[bstMonth - 1]} ${toBengaliNumber(bstYear)}`;
  const gregorianWithDay = `${dayName}, ${gregorianDate}`;

  // English (Gregorian) date representation
  const MONTHS_EN = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const DAYS_EN = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];
  const englishDay = DAYS_EN[bstWeekdayIndex] || 'Saturday';
  const englishDate = `${bstDay} ${MONTHS_EN[bstMonth - 1]} ${bstYear}`;
  const englishWithDay = `${englishDay}, ${englishDate}`;

  // Time in Bengali (e.g. রাত ৮:৫০)
  let period = 'সকাল';
  if (bstHour >= 12 && bstHour < 15) period = 'দুপুর';
  else if (bstHour >= 15 && bstHour < 18) period = 'বিকাল';
  else if (bstHour >= 18 && bstHour < 20) period = 'সন্ধ্যা';
  else if (bstHour >= 20 || bstHour < 5) period = 'রাত';
  else period = 'সকাল';

  const displayHour = bstHour % 12 === 0 ? 12 : bstHour % 12;
  const minuteFormatted = bstMinute < 10 ? `০${toBengaliNumber(bstMinute)}` : toBengaliNumber(bstMinute);
  const formattedTime = `${period} ${toBengaliNumber(displayHour)}:${minuteFormatted}`;

  // Bengali Calendar Date calculation (Bangla Academy System)
  const leap = isLeapYear(bstYear);
  const banglaMonthLengths = [
    31, 31, 31, 31, 31, 31, // Boishakh to Ashwin (31 days)
    30, 30, 30, 30,         // Kartik to Magh (30 days)
    leap ? 30 : 29,         // Falgun (29 or 30 days)
    30                      // Choitra (30 days)
  ];

  const currentDateUTC = Date.UTC(bstYear, bstMonth - 1, bstDay);
  const boishakhStartUTC = Date.UTC(bstYear, 3, 14); // April 14

  let bYear: number;
  let bMonthIndex = 0;
  let bDay = 1;

  if (currentDateUTC >= boishakhStartUTC) {
    bYear = bstYear - 593;
    let dayCount = Math.round((currentDateUTC - boishakhStartUTC) / (1000 * 60 * 60 * 24));
    for (let i = 0; i < 12; i++) {
      if (dayCount < banglaMonthLengths[i]) {
        bMonthIndex = i;
        bDay = dayCount + 1;
        break;
      }
      dayCount -= banglaMonthLengths[i];
    }
  } else {
    bYear = bstYear - 594;
    const prevBoishakhStartUTC = Date.UTC(bstYear - 1, 3, 14);
    let dayCount = Math.round((currentDateUTC - prevBoishakhStartUTC) / (1000 * 60 * 60 * 24));
    for (let i = 0; i < 12; i++) {
      if (dayCount < banglaMonthLengths[i]) {
        bMonthIndex = i;
        bDay = dayCount + 1;
        break;
      }
      dayCount -= banglaMonthLengths[i];
    }
  }

  const bMonthName = BANGLA_MONTHS[bMonthIndex];
  const bengaliDateOnly = `${toBengaliNumber(bDay)} ${bMonthName} ${toBengaliNumber(bYear)}`;
  const bengaliEra = `${bengaliDateOnly} বঙ্গাব্দ`;
  const season = BANGLA_SEASONS[Math.floor(bMonthIndex / 2)];
  const fullDateString = `${gregorianWithDay} (${englishWithDay}) | ${bengaliEra}`;

  return {
    dayName,
    gregorianDate,
    gregorianWithDay,
    englishDate,
    englishWithDay,
    bengaliEra,
    bengaliDateOnly,
    fullDateString,
    season,
    formattedTime
  };
}

export function calculateReadingTime(text: string): string {
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 180));
  return `${toBengaliNumber(minutes)} মিনিট পাঠ`;
}
