// Utility functions for authentic Bengali news display and dynamic calendar calculation

const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliNumber(num: number | string): string {
  if (num === undefined || num === null) return '';
  return num
    .toString()
    .replace(/[0-9]/g, match => bengaliDigits[parseInt(match, 10)]);
}

/**
 * Calculates current date in Bangladesh Standard Time (UTC+6)
 * and accurately computes the corresponding Bengali Calendar date (বঙ্গাব্দ)
 * based on Bangla Academy's official revised calendar.
 */
export function getCurrentBengaliDate(): {
  dayName: string;
  gregorianDate: string;
  bengaliEra: string;
  fullDateString: string;
} {
  const days = [
    'রবিবার',
    'সোমবার',
    'মঙ্গলবার',
    'বুধবার',
    'বৃহস্পতিবার',
    'শুক্রবার',
    'শনিবার'
  ];

  const gregorianMonths = [
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

  // Current time in Bangladesh Standard Time (UTC+6)
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const bstDate = new Date(utc + 6 * 3600000);

  const dayOfWeek = bstDate.getDay();
  const dayName = days[dayOfWeek];
  const gDay = bstDate.getDate();
  const gMonth = bstDate.getMonth(); // 0-indexed
  const gYear = bstDate.getFullYear();

  const gregorianDate = `${dayName}, ${toBengaliNumber(gDay)} ${gregorianMonths[gMonth]} ${toBengaliNumber(gYear)}`;

  // Dynamic Bengali Calendar Calculation (Bangla Academy System)
  const bengaliEra = getBanglaCalendarDate(bstDate);

  return {
    dayName,
    gregorianDate,
    bengaliEra,
    fullDateString: `${gregorianDate} | ${bengaliEra}`
  };
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Bangla Academy Revised Calendar conversion
 * Boishakh starts on April 14.
 */
function getBanglaCalendarDate(date: Date): string {
  const banglaMonths = [
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

  const year = date.getFullYear();
  const month = date.getMonth(); // 0 = Jan, 9 = Oct
  const day = date.getDate();

  const leap = isLeapYear(year);

  // Month day limits for Bangla months:
  // Boishakh to Ashwin: 31 days each (first 6 months)
  // Kartik to Magh: 30 days each (next 4 months)
  // Falgun: 29 days (30 in leap year)
  // Choitra: 30 days
  const banglaMonthLengths = [
    31, // Boishakh
    31, // Jyaistha
    31, // Ashar
    31, // Srabon
    31, // Bhadra
    31, // Ashwin
    30, // Kartik
    30, // Agrahayan
    30, // Poush
    30, // Magh
    leap ? 30 : 29, // Falgun
    30 // Choitra
  ];

  // Start dates of Bangla months in Gregorian calendar:
  // Boishakh: Apr 14
  // Jyaistha: May 15
  // Ashar: Jun 15
  // Srabon: Jul 16
  // Bhadra: Aug 16
  // Ashwin: Sep 16
  // Kartik: Oct 17
  // Agrahayan: Nov 16
  // Poush: Dec 16
  // Magh: Jan 15
  // Falgun: Feb 14
  // Choitra: Mar 15 (or Mar 15)

  // Starting anchor: April 14 of the current Gregorian year
  const boishakhStart = new Date(year, 3, 14); // Month 3 is April

  let bYear: number;
  let bMonthIndex = 0;
  let bDay = 1;

  if (date >= boishakhStart) {
    bYear = year - 593;
    const diffTime = date.getTime() - boishakhStart.getTime();
    let dayCount = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // 0 for April 14

    for (let i = 0; i < 12; i++) {
      if (dayCount < banglaMonthLengths[i]) {
        bMonthIndex = i;
        bDay = dayCount + 1;
        break;
      }
      dayCount -= banglaMonthLengths[i];
    }
  } else {
    bYear = year - 594;
    // Calculate relative to April 14 of previous year
    const prevBoishakhStart = new Date(year - 1, 3, 14);
    const diffTime = date.getTime() - prevBoishakhStart.getTime();
    let dayCount = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    for (let i = 0; i < 12; i++) {
      if (dayCount < banglaMonthLengths[i]) {
        bMonthIndex = i;
        bDay = dayCount + 1;
        break;
      }
      dayCount -= banglaMonthLengths[i];
    }
  }

  return `${toBengaliNumber(bDay)} ${banglaMonths[bMonthIndex]} ${toBengaliNumber(bYear)} বঙ্গাব্দ`;
}

export function calculateReadingTime(text: string): string {
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 180));
  return `${toBengaliNumber(minutes)} মিনিট পাঠ`;
}
