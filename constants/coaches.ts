export type Review = {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
};

export type Availability = {
  day: string;
  times: string[];
};

export type Coach = {
  id: string;
  name: string;
  sport: string;
  sportId: string;
  location: string;
  state: string;
  distance: number;
  rating: number;
  reviewCount: number;
  pricePerHour: number;
  bio: string;
  credentials: string[];
  specialties: string[];
  yearsExperience: number;
  avatar: string;
  availability: Availability[];
  reviews: Review[];
};

export const COACHES: Coach[] = [
  {
    id: "1",
    name: "Marcus Rivera",
    sport: "Soccer",
    sportId: "soccer",
    location: "Austin, TX",
    state: "TX",
    distance: 3.2,
    rating: 4.9,
    reviewCount: 47,
    pricePerHour: 85,
    bio: "Former D1 soccer player with 8 years of coaching experience. I specialize in technical skill development, positioning, and mental toughness. Whether you're just starting out or preparing for college recruitment, I'll help you reach your potential.",
    credentials: ["USSF B License", "NCAA D1 Playing Experience", "CPR Certified"],
    specialties: ["Dribbling & Ball Control", "Finishing", "1v1 Defending", "Speed & Agility"],
    yearsExperience: 8,
    avatar: "MR",
    availability: [
      { day: "Monday", times: ["6:00 AM", "7:00 AM", "4:00 PM", "5:00 PM"] },
      { day: "Wednesday", times: ["6:00 AM", "7:00 AM", "4:00 PM", "5:00 PM"] },
      { day: "Saturday", times: ["8:00 AM", "9:00 AM", "10:00 AM"] },
    ],
    reviews: [
      { id: "r1", author: "Jake T.", rating: 5, text: "Marcus completely transformed my son's game in just 6 sessions. Incredible coach!", date: "2 weeks ago" },
      { id: "r2", author: "Sarah M.", rating: 5, text: "Best investment we've made in my daughter's soccer career. Highly recommend!", date: "1 month ago" },
      { id: "r3", author: "David L.", rating: 4, text: "Very knowledgeable and patient. Saw real improvement in my first touch.", date: "2 months ago" },
    ],
  },
  {
    id: "2",
    name: "Aisha Johnson",
    sport: "Basketball",
    sportId: "basketball",
    location: "Chicago, IL",
    state: "IL",
    distance: 5.7,
    rating: 4.8,
    reviewCount: 63,
    pricePerHour: 95,
    bio: "WNBA prospect and former collegiate All-American. I train athletes of all ages with a focus on IQ, shooting mechanics, and competitive mindset. My sessions are intense, focused, and always game-relevant.",
    credentials: ["NSCAA Certified", "NCAA D1 All-Conference", "Youth Coaching Certification"],
    specialties: ["Shooting Form", "Ball Handling", "Post Moves", "Basketball IQ"],
    yearsExperience: 6,
    avatar: "AJ",
    availability: [
      { day: "Tuesday", times: ["5:00 PM", "6:00 PM", "7:00 PM"] },
      { day: "Thursday", times: ["5:00 PM", "6:00 PM", "7:00 PM"] },
      { day: "Sunday", times: ["10:00 AM", "11:00 AM", "12:00 PM"] },
    ],
    reviews: [
      { id: "r1", author: "Marcus W.", rating: 5, text: "Aisha's attention to detail is unreal. My shot mechanics are completely different now.", date: "3 weeks ago" },
      { id: "r2", author: "Kim R.", rating: 5, text: "My daughter went from bench to starter in one season. Aisha is amazing.", date: "1 month ago" },
      { id: "r3", author: "Tony B.", rating: 5, text: "High energy, great drills, and real improvement every session.", date: "2 months ago" },
    ],
  },
  {
    id: "3",
    name: "Tyler Brooks",
    sport: "Baseball",
    sportId: "baseball",
    location: "Phoenix, AZ",
    state: "AZ",
    distance: 2.1,
    rating: 4.7,
    reviewCount: 38,
    pricePerHour: 75,
    bio: "Former minor league pitcher with 10 years of coaching youth through high school athletes. Pitching mechanics, hitting approach, and fielding fundamentals are my focus. I break down the game in a way kids can understand and apply immediately.",
    credentials: ["ABCA Member", "Minor League Professional Experience", "Level 2 Pitching Coach"],
    specialties: ["Pitching Mechanics", "Hitting Approach", "Infield Fundamentals", "Mental Game"],
    yearsExperience: 10,
    avatar: "TB",
    availability: [
      { day: "Monday", times: ["3:00 PM", "4:00 PM", "5:00 PM"] },
      { day: "Friday", times: ["3:00 PM", "4:00 PM", "5:00 PM"] },
      { day: "Saturday", times: ["9:00 AM", "10:00 AM", "11:00 AM"] },
    ],
    reviews: [
      { id: "r1", author: "Chris H.", rating: 5, text: "Tyler fixed my son's pitching mechanics in 3 sessions. College scouts have noticed.", date: "1 week ago" },
      { id: "r2", author: "Angela S.", rating: 4, text: "Very detailed coach. Breaks everything down step by step.", date: "3 weeks ago" },
    ],
  },
  {
    id: "4",
    name: "Rebecca Nguyen",
    sport: "Golf",
    sportId: "golf",
    location: "San Diego, CA",
    state: "CA",
    distance: 8.4,
    rating: 4.9,
    reviewCount: 29,
    pricePerHour: 120,
    bio: "PGA certified instructor with a specialty in beginner and junior golf development. I use video analysis and launch monitor data to make technical concepts simple and actionable. My students consistently lower their handicaps.",
    credentials: ["PGA Class A Member", "TPI Certified", "US Kids Certified"],
    specialties: ["Swing Analysis", "Short Game", "Course Management", "Junior Development"],
    yearsExperience: 12,
    avatar: "RN",
    availability: [
      { day: "Wednesday", times: ["8:00 AM", "9:00 AM", "10:00 AM"] },
      { day: "Friday", times: ["8:00 AM", "9:00 AM", "10:00 AM"] },
      { day: "Sunday", times: ["7:00 AM", "8:00 AM", "9:00 AM"] },
    ],
    reviews: [
      { id: "r1", author: "Robert K.", rating: 5, text: "Dropped 8 strokes in 2 months. Rebecca is the real deal.", date: "2 weeks ago" },
      { id: "r2", author: "Laura M.", rating: 5, text: "Finally found a coach who explains WHY, not just what to do.", date: "1 month ago" },
    ],
  },
  {
    id: "5",
    name: "Devon Carter",
    sport: "Strength & Speed",
    sportId: "strength-speed",
    location: "Atlanta, GA",
    state: "GA",
    distance: 4.3,
    rating: 4.8,
    reviewCount: 82,
    pricePerHour: 90,
    bio: "NSCA certified strength coach who works with multi-sport athletes to improve explosiveness, speed, and injury prevention. I train athletes from middle school to the professional level and specialize in sport-specific conditioning.",
    credentials: ["NSCA-CSCS", "USAW Level 1", "NASM Performance Enhancement Specialist"],
    specialties: ["Speed & Agility", "Vertical Jump", "Olympic Lifting", "Injury Prevention"],
    yearsExperience: 9,
    avatar: "DC",
    availability: [
      { day: "Monday", times: ["6:00 AM", "7:00 AM", "5:00 PM", "6:00 PM"] },
      { day: "Tuesday", times: ["6:00 AM", "7:00 AM", "5:00 PM", "6:00 PM"] },
      { day: "Thursday", times: ["6:00 AM", "7:00 AM", "5:00 PM", "6:00 PM"] },
    ],
    reviews: [
      { id: "r1", author: "Jordan P.", rating: 5, text: "Devon added 3 inches to my vertical in 8 weeks. Unbelievable results.", date: "1 week ago" },
      { id: "r2", author: "Maya T.", rating: 5, text: "Best trainer I've ever worked with. Knows the science and makes it fun.", date: "3 weeks ago" },
      { id: "r3", author: "Sam B.", rating: 4, text: "Intense workouts but you see real results.", date: "2 months ago" },
    ],
  },
  {
    id: "6",
    name: "Hannah Walsh",
    sport: "Lacrosse",
    sportId: "lacrosse",
    location: "Baltimore, MD",
    state: "MD",
    distance: 6.1,
    rating: 4.7,
    reviewCount: 21,
    pricePerHour: 80,
    bio: "NCAA Division I lacrosse player turned coach. I specialize in stick skills, footwork, and game-reading for female athletes ages 10-18. My sessions are structured, high-energy, and focused on helping players stand out in recruitment.",
    credentials: ["US Lacrosse Level 2", "NCAA D1 Player", "Youth Coaching Certification"],
    specialties: ["Stick Skills", "Shooting", "Dodging", "Defensive Positioning"],
    yearsExperience: 5,
    avatar: "HW",
    availability: [
      { day: "Tuesday", times: ["4:00 PM", "5:00 PM"] },
      { day: "Thursday", times: ["4:00 PM", "5:00 PM"] },
      { day: "Saturday", times: ["9:00 AM", "10:00 AM", "11:00 AM"] },
    ],
    reviews: [
      { id: "r1", author: "Beth C.", rating: 5, text: "Hannah is patient, encouraging, and incredibly skilled. My daughter loves her.", date: "2 weeks ago" },
      { id: "r2", author: "Greg R.", rating: 4, text: "Great technical knowledge and good energy with young athletes.", date: "1 month ago" },
    ],
  },
];
