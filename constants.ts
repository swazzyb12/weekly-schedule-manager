// FIX: Import the 'Day' type to resolve the 'Cannot find name' error.
import type { Schedule, Category, Day } from './types';

export const DAYS: Day[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const INITIAL_SCHEDULE_EN: Schedule = {
  monday: [
    { id: 'mon-1', time: "8:00-9:00", duration: "1h", category: "anchor", activity: "Morning Anchor", notes: "Wake up, breakfast, school prep" },
    { id: 'mon-2', time: "9:00-15:00", duration: "6h", category: "school", activity: "School Classes", notes: "Fixed commitment" },
    { id: 'mon-3', time: "15:00-15:30", duration: "30m", category: "transition", activity: "Transition", notes: "Commute home, quick reset" },
    { id: 'mon-4', time: "15:30-17:00", duration: "1h30m", category: "gym", activity: "Gym (Priority 1)", notes: "Fixed appointment - don't skip" },
    { id: 'mon-5', time: "17:00-17:30", duration: "30m", category: "recovery", activity: "Recovery", notes: "Daily walk/social" },
    { id: 'mon-6', time: "17:30-19:30", duration: "2h", category: "deepwork", activity: "Deep Work", notes: "Project/Assignment block" },
    { id: 'mon-7', time: "19:30-20:30", duration: "1h", category: "maintenance", activity: "Maintenance", notes: "Cook dinner & eat" },
    { id: 'mon-8', time: "20:30-23:30", duration: "3h", category: "personal", activity: "Personal/Prep", notes: "Internship prep, typing (30m)" }
  ],
  tuesday: [
    { id: 'tue-1', time: "7:00-8:00", duration: "1h", category: "anchor", activity: "Morning Anchor", notes: "Wake early, breakfast, 10min chore" },
    { id: 'tue-2', time: "8:00-18:00", duration: "10h", category: "school", activity: "School Classes", notes: "Longest day" },
    { id: 'tue-3', time: "18:00-18:30", duration: "30m", category: "transition", activity: "Transition", notes: "Commute home" },
    { id: 'tue-4', time: "18:30-20:30", duration: "2h", category: "deepwork", activity: "Deep Work - Cybersecurity", notes: "Career priority" },
    { id: 'tue-5', time: "20:30-21:30", duration: "1h", category: "maintenance", activity: "Maintenance", notes: "Cook dinner & eat" },
    { id: 'tue-6', time: "21:30-22:00", duration: "30m", category: "recovery", activity: "Recovery", notes: "Walk/social, break from screens" },
    { id: 'tue-7', time: "22:00-23:30", duration: "1h30m", category: "personal", activity: "Wind Down", notes: "Prep for tomorrow, lights out 23:30" }
  ],
  wednesday: [
    { id: 'wed-1', time: "8:00-9:00", duration: "1h", category: "anchor", activity: "Morning Anchor", notes: "Wake up, breakfast, school prep" },
    { id: 'wed-2', time: "9:00-16:00", duration: "7h", category: "school", activity: "School Classes", notes: "Fixed commitment" },
    { id: 'wed-3', time: "16:00-16:30", duration: "30m", category: "transition", activity: "Transition", notes: "Commute home" },
    { id: 'wed-4', time: "16:30-18:00", duration: "1h30m", category: "gym", activity: "Project or Gym (Flex)", notes: "Choose based on weekly gym goal" },
    { id: 'wed-5', time: "18:00-19:00", duration: "1h", category: "maintenance", activity: "Maintenance", notes: "Cook dinner & eat" },
    { id: 'wed-6', time: "19:00-19:30", duration: "30m", category: "recovery", activity: "Recovery", notes: "Daily walk/social" },
    { id: 'wed-7', time: "19:30-21:30", duration: "2h", category: "deepwork", activity: "Deep Work", notes: "Mid-week push on school" },
    { id: 'wed-8', time: "21:30-23:30", duration: "2h", category: "personal", activity: "Wind Down", notes: "Touch typing (30m), personal time" }
  ],
  thursday: [
    { id: 'thu-1', time: "8:30-9:00", duration: "30m", category: "anchor", activity: "Morning Anchor", notes: "Wake up, breakfast" },
    { id: 'thu-2', time: "9:00-11:00", duration: "2h", category: "gym", activity: "Gym + Groceries", notes: "Get logistics done early" },
    { id: 'thu-3', time: "11:00-11:30", duration: "30m", category: "transition", activity: "Transition", notes: "Daily walk/social" },
    { id: 'thu-4', time: "11:30-13:00", duration: "1h30m", category: "deepwork", activity: "Deep Work - Cybersecurity", notes: "Primary focus" },
    { id: 'thu-5', time: "13:00-14:00", duration: "1h", category: "maintenance", activity: "Maintenance", notes: "Cook lunch & eat" },
    { id: 'thu-6', time: "14:00-16:30", duration: "2h30m", category: "school", activity: "School Ahead", notes: "Project/Internship applications" },
    { id: 'thu-7', time: "16:30-18:00", duration: "1h30m", category: "personal", activity: "Student Job/Flex", notes: "Optional work or learning" },
    { id: 'thu-8', time: "18:00-23:30", duration: "5h30m", category: "social", activity: "Social/Personal", notes: "Flexible evening" }
  ],
  friday: [
    { id: 'fri-1', time: "8:30-10:00", duration: "1h30m", category: "anchor", activity: "Morning Anchor", notes: "Wake up, breakfast" },
    { id: 'fri-2', time: "10:00-12:00", duration: "2h", category: "deepwork", activity: "Deep Work", notes: "Finish workweek strong" },
    { id: 'fri-3', time: "12:00-13:00", duration: "1h", category: "maintenance", activity: "Maintenance", notes: "Cook lunch, commute prep" },
    { id: 'fri-4', time: "13:00-14:00", duration: "1h", category: "transition", activity: "Transition", notes: "Travel to school, typing (30m)" },
    { id: 'fri-5', time: "14:00-18:00", duration: "4h", category: "school", activity: "School Classes", notes: "Fixed commitment" },
    { id: 'fri-6', time: "18:00-19:00", duration: "1h", category: "maintenance", activity: "Maintenance", notes: "Commute home, quick tidy" },
    { id: 'fri-7', time: "19:00-23:30", duration: "4h30m", category: "social", activity: "Protected Date Night", notes: "Dinner & quality time with GF" }
  ],
  saturday: [
    { id: 'sat-1', time: "Morning", duration: "1h30m", category: "gym", activity: "Gym Session (Priority 2)", notes: "Set fixed time Saturday morning" },
    { id: 'sat-2', time: "Midday", duration: "2h", category: "maintenance", activity: "Deep Chore/House Reset", notes: "Get the big clean done" },
    { id: 'sat-3', time: "Afternoon", duration: "Flexible", category: "personal", activity: "Balance/Flex", notes: "Project/study catch-up or social" }
  ],
  sunday: [
    { id: 'sun-1', time: "9:00-15:00", duration: "6h", category: "church", activity: "Church", notes: "Fixed commitment" },
    { id: 'sun-2', time: "15:00-17:00", duration: "2h", category: "gym", activity: "Gym Session (Priority 3)", notes: "Sunday afternoon workout" },
    { id: 'sun-3', time: "17:00-20:00", duration: "3h", category: "planning", activity: "Meal Prep & Weekly Planning", notes: "Your discipline block" },
    { id: 'sun-4', time: "20:00-23:30", duration: "3h30m", category: "personal", activity: "Recharge", notes: "Relaxation time" }
  ]
};

export const INITIAL_SCHEDULE_NL: Schedule = {
  monday: [
    { id: 'mon-1', time: "8:00-9:00", duration: "1h", category: "anchor", activity: "Ochtend Anker", notes: "Wakker worden, ontbijt, schoolvoorbereiding" },
    { id: 'mon-2', time: "9:00-15:00", duration: "6h", category: "school", activity: "Schoollessen", notes: "Vaste verplichting" },
    { id: 'mon-3', time: "15:00-15:30", duration: "30m", category: "transition", activity: "Overgang", notes: "Woon-werkverkeer naar huis, snelle reset" },
    { id: 'mon-4', time: "15:30-17:00", duration: "1h30m", category: "gym", activity: "Sportschool (Prioriteit 1)", notes: "Vaste afspraak - niet overslaan" },
    { id: 'mon-5', time: "17:00-17:30", duration: "30m", category: "recovery", activity: "Herstel", notes: "Dagelijkse wandeling/sociaal" },
    { id: 'mon-6', time: "17:30-19:30", duration: "2h", category: "deepwork", activity: "Diep Werk", notes: "Project/Opdracht blok" },
    { id: 'mon-7', time: "19:30-20:30", duration: "1h", category: "maintenance", activity: "Onderhoud", notes: "Avondeten koken & eten" },
    { id: 'mon-8', time: "20:30-23:30", duration: "3h", category: "personal", activity: "Persoonlijk/Voorbereiding", notes: "Stagevoorbereiding, typen (30m)" }
  ],
  tuesday: [
    { id: 'tue-1', time: "7:00-8:00", duration: "1h", category: "anchor", activity: "Ochtend Anker", notes: "Vroeg op, ontbijt, 10 min. klusje" },
    { id: 'tue-2', time: "8:00-18:00", duration: "10h", category: "school", activity: "Schoollessen", notes: "Langste dag" },
    { id: 'tue-3', time: "18:00-18:30", duration: "30m", category: "transition", activity: "Overgang", notes: "Naar huis reizen" },
    { id: 'tue-4', time: "18:30-20:30", duration: "2h", category: "deepwork", activity: "Diep Werk - Cybersecurity", notes: "Carrièreprioriteit" },
    { id: 'tue-5', time: "20:30-21:30", duration: "1h", category: "maintenance", activity: "Onderhoud", notes: "Avondeten koken & eten" },
    { id: 'tue-6', time: "21:30-22:00", duration: "30m", category: "recovery", activity: "Herstel", notes: "Wandelen/sociaal, schermpauze" },
    { id: 'tue-7', time: "22:00-23:30", duration: "1h30m", category: "personal", activity: "Afbouwen", notes: "Voorbereiden op morgen, lichten uit 23:30" }
  ],
  wednesday: [
    { id: 'wed-1', time: "8:00-9:00", duration: "1h", category: "anchor", activity: "Ochtend Anker", notes: "Wakker worden, ontbijt, schoolvoorbereiding" },
    { id: 'wed-2', time: "9:00-16:00", duration: "7h", category: "school", activity: "Schoollessen", notes: "Vaste verplichting" },
    { id: 'wed-3', time: "16:00-16:30", duration: "30m", category: "transition", activity: "Overgang", notes: "Naar huis reizen" },
    { id: 'wed-4', time: "16:30-18:00", duration: "1h30m", category: "gym", activity: "Project of Sportschool (Flex)", notes: "Kies op basis van wekelijks sportdoel" },
    { id: 'wed-5', time: "18:00-19:00", duration: "1h", category: "maintenance", activity: "Onderhoud", notes: "Avondeten koken & eten" },
    { id: 'wed-6', time: "19:00-19:30", duration: "30m", category: "recovery", activity: "Herstel", notes: "Dagelijkse wandeling/sociaal" },
    { id: 'wed-7', time: "19:30-21:30", duration: "2h", category: "deepwork", activity: "Diep Werk", notes: "Midweekse schoolpush" },
    { id: 'wed-8', time: "21:30-23:30", duration: "2h", category: "personal", activity: "Afbouwen", notes: "Tienvingerblindtypen (30m), persoonlijke tijd" }
  ],
  thursday: [
    { id: 'thu-1', time: "8:30-9:00", duration: "30m", category: "anchor", activity: "Ochtend Anker", notes: "Wakker worden, ontbijt" },
    { id: 'thu-2', time: "9:00-11:00", duration: "2h", category: "gym", activity: "Sportschool + Boodschappen", notes: "Logistiek vroeg afhandelen" },
    { id: 'thu-3', time: "11:00-11:30", duration: "30m", category: "transition", activity: "Overgang", notes: "Dagelijkse wandeling/sociaal" },
    { id: 'thu-4', time: "11:30-13:00", duration: "1h30m", category: "deepwork", activity: "Diep Werk - Cybersecurity", notes: "Primaire focus" },
    { id: 'thu-5', time: "13:00-14:00", duration: "1h", category: "maintenance", activity: "Onderhoud", notes: "Lunch koken & eten" },
    { id: 'thu-6', time: "14:00-16:30", duration: "2h30m", category: "school", activity: "Vooruitwerken school", notes: "Project/Stage-aanmeldingen" },
    { id: 'thu-7', time: "16:30-18:00", duration: "1h30m", category: "personal", activity: "Studentenbaan/Flex", notes: "Optioneel werk of leren" },
    { id: 'thu-8', time: "18:00-23:30", duration: "5h30m", category: "social", activity: "Sociaal/Persoonlijk", notes: "Flexibele avond" }
  ],
  friday: [
    { id: 'fri-1', time: "8:30-10:00", duration: "1h30m", category: "anchor", activity: "Ochtend Anker", notes: "Wakker worden, ontbijt" },
    { id: 'fri-2', time: "10:00-12:00", duration: "2h", category: "deepwork", activity: "Diep Werk", notes: "Werkweek sterk afsluiten" },
    { id: 'fri-3', time: "12:00-13:00", duration: "1h", category: "maintenance", activity: "Onderhoud", notes: "Lunch koken, reis voorbereiden" },
    { id: 'fri-4', time: "13:00-14:00", duration: "1h", category: "transition", activity: "Overgang", notes: "Reizen naar school, typen (30m)" },
    { id: 'fri-5', time: "14:00-18:00", duration: "4h", category: "school", activity: "Schoollessen", notes: "Vaste verplichting" },
    { id: 'fri-6', time: "18:00-19:00", duration: "1h", category: "maintenance", activity: "Onderhoud", notes: "Naar huis reizen, snel opruimen" },
    { id: 'fri-7', time: "19:00-23:30", duration: "4h30m", category: "social", activity: "Beschermde Date Night", notes: "Diner & quality time met vriendin" }
  ],
  saturday: [
    { id: 'sat-1', time: "Morning", duration: "1h30m", category: "gym", activity: "Sportsessie (Prioriteit 2)", notes: "Vaste tijd op zaterdagochtend instellen" },
    { id: 'sat-2', time: "Midday", duration: "2h", category: "maintenance", activity: "Grote schoonmaak/Huis reset", notes: "De grote schoonmaak doen" },
    { id: 'sat-3', time: "Afternoon", duration: "Flexible", category: "personal", activity: "Balans/Flex", notes: "Project/studie inhalen of sociaal" }
  ],
  sunday: [
    { id: 'sun-1', time: "9:00-15:00", duration: "6h", category: "church", activity: "Kerk", notes: "Vaste verplichting" },
    { id: 'sun-2', time: "15:00-17:00", duration: "2h", category: "gym", activity: "Sportsessie (Prioriteit 3)", notes: "Zondagmiddag training" },
    { id: 'sun-3', time: "17:00-20:00", duration: "3h", category: "planning", activity: "Maaltijden voorbereiden & Wekelijkse planning", notes: "Jouw disciplineblok" },
    { id: 'sun-4', time: "20:00-23:30", duration: "3h30m", category: "personal", activity: "Opladen", notes: "Ontspanningstijd" }
  ]
};

export const getInitialSchedule = (language: 'en' | 'nl'): Schedule => {
  return language === 'nl' ? INITIAL_SCHEDULE_NL : INITIAL_SCHEDULE_EN;
};


interface CategoryStyle {
  bg: string;
  border: string;
  text: string;
}

export const CATEGORY_STYLES: Record<Category, CategoryStyle> = {
  anchor:      { bg: 'bg-gradient-to-br from-yellow-100 to-rose-200', border: 'border-rose-400', text: 'text-rose-800 font-semibold' },
  school:      { bg: 'bg-blue-100',    border: 'border-blue-300',    text: 'text-blue-800' },
  gym:         { bg: 'bg-red-100',     border: 'border-red-300',     text: 'text-red-800' },
  deepwork:    { bg: 'bg-purple-100',  border: 'border-purple-300',  text: 'text-purple-800' },
  maintenance: { bg: 'bg-gray-100',    border: 'border-gray-300',    text: 'text-gray-800' },
  recovery:    { bg: 'bg-green-100',   border: 'border-green-300',   text: 'text-green-800' },
  transition:  { bg: 'bg-yellow-100',  border: 'border-yellow-300',  text: 'text-yellow-800' },
  personal:    { bg: 'bg-pink-100',    border: 'border-pink-300',    text: 'text-pink-800' },
  social:      { bg: 'bg-teal-100',    border: 'border-teal-300',    text: 'text-teal-800' },
  church:      { bg: 'bg-indigo-100',  border: 'border-indigo-300',  text: 'text-indigo-800' },
  planning:    { bg: 'bg-orange-100',  border: 'border-orange-300',  text: 'text-orange-800' }
};

export const CATEGORY_ICONS: Record<Category, string> = {
  anchor: '🌅',
  school: '🏫',
  gym: '💪',
  deepwork: '🎯',
  maintenance: '🍳',
  recovery: '🚶',
  transition: '🔄',
  personal: '📱',
  social: '💕',
  church: '⛪',
  planning: '📋'
};