// Fluency levels — your French passport
// Each level represents what you can do with your vocabulary
// at that point in your French journey.

export const LEVELS = [
  {
    n: 1,
    key: 'touriste',
    name: 'Touriste',
    nameEn: 'Tourist',
    icon: '🛬',
    blurb: 'Survive a vacation — order food, ask directions, basic numbers',
    threshold: 500,    // ~500 words to reach this stamp
    color: '#3a6b8a',  // sky blue
    bgColor: '#e8f0f5',
  },
  {
    n: 2,
    key: 'estivant',
    name: 'Estivant',
    nameEn: 'Holidaymaker',
    icon: '🏡',
    blurb: 'Rent a vacation home — groceries, neighbors, simple chats',
    threshold: 1500,
    color: '#4a7a4a',  // leaf green
    bgColor: '#e9f1e9',
  },
  {
    n: 3,
    key: 'resident',
    name: 'Résident',
    nameEn: 'Resident',
    icon: '🏠',
    blurb: 'Actually live there — daily life, doctor visits, news',
    threshold: 2500,
    color: '#c4632a',  // terracotta
    bgColor: '#f6ece0',
  },
  {
    n: 4,
    key: 'pro',
    name: 'Pro',
    nameEn: 'Professional',
    icon: '💼',
    blurb: 'Work there — meetings, formal contexts, industry',
    threshold: 3000,
    color: '#5a3e8a',  // deep purple
    bgColor: '#ece5f3',
  },
]

export function levelByN(n) {
  return LEVELS.find(l => l.n === n) || LEVELS[1]
}

// For a given known word count, return current level + progress to next
export function passport(knownCount) {
  let current = 0
  for (const lv of LEVELS) {
    if (knownCount >= lv.threshold) current = lv.n
  }
  const next = LEVELS.find(l => l.n === current + 1)
  return {
    current,                  // 0 if no stamp yet, else 1-4
    currentLevel: current ? levelByN(current) : null,
    next,                     // next level to reach (or undefined)
    knownCount,
    progressToNext: next
      ? Math.min(100, Math.round((knownCount / next.threshold) * 100))
      : 100,
  }
}
