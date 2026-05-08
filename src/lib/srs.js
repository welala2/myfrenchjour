// SM-2 Spaced Repetition Algorithm
// quality: 0-5 (0-2 = fail, 3-5 = pass)

export function sm2(card, quality) {
  let { easeFactor = 2.5, interval = 1, repetitions = 0 } = card

  if (quality >= 3) {
    if (repetitions === 0) interval = 1
    else if (repetitions === 1) interval = 6
    else interval = Math.round(interval * easeFactor)
    repetitions += 1
  } else {
    repetitions = 0
    interval = 1
  }

  easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))

  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + interval)

  return { easeFactor, interval, repetitions, nextReview: nextReview.toISOString() }
}

export function isDue(card) {
  if (!card.nextReview) return true
  return new Date(card.nextReview) <= new Date()
}

export function getAllWords(data) {
  const seen = new Set()
  const out = []
  for (const [cat, catData] of Object.entries(data)) {
    for (const sub of catData.sub) {
      for (const w of sub.words) {
        if (!seen.has(w.f)) {
          seen.add(w.f)
          out.push({ ...w, cat, catLabel: catData.label })
        }
      }
    }
  }
  return out
}
