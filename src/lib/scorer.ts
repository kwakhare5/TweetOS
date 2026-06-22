import { AlgorithmScore, SignalScore } from '@/types'

export function scoreTweet(tweet: string, isThread: boolean): AlgorithmScore {
  const hookStrength = scoreHook(tweet)
  const replyBait = scoreReplyBait(tweet)
  const specificity = scoreSpecificity(tweet)
  const emotionalTrigger = scoreEmotionalTrigger(tweet)
  const length = scoreLength(tweet, isThread)
  const noLinksInBody = scoreLinks(tweet)
  const ctaQuality = scoreCTA(tweet)
  const threadPotential = scoreThreadPotential(tweet, isThread)

  const suggestions = generateSuggestions(
    tweet,
    isThread,
    hookStrength,
    replyBait,
    specificity,
    emotionalTrigger,
    length,
    noLinksInBody,
    ctaQuality,
    threadPotential
  )

  const overall = calculateOverall(
    hookStrength,
    replyBait,
    specificity,
    emotionalTrigger,
    length,
    noLinksInBody,
    ctaQuality,
    threadPotential
  )

  return {
    overall,
    hookStrength,
    replyBait,
    specificity,
    emotionalTrigger,
    length,
    noLinksInBody,
    ctaQuality,
    threadPotential,
    suggestions,
    calculatedAt: new Date().toISOString()
  }
}

function scoreHook(tweet: string): SignalScore {
  const cleanTweet = tweet.trim()
  if (!cleanTweet) {
    return { score: 0, label: 'Fail', reason: 'Empty tweet' }
  }

  const words = cleanTweet.split(/\s+/)
  const first8Words = words.slice(0, 8).join(' ').toLowerCase()
  const first3Words = words.slice(0, 3).join(' ').toLowerCase()

  let score = 5
  const reasons: string[] = []

  // Check for strong signals
  const hasNumInFirst3 = /\b\d+\b/.test(first3Words) || /\b(one|two|three|four|five|six|seven|eight|nine|ten)\b/.test(first3Words)
  if (hasNumInFirst3) {
    score += 2
    reasons.push('number in opener')
  }

  const hasFirstPerson = /\b(i|my|we|our)\b/.test(first8Words)
  if (hasFirstPerson) {
    score += 1.5
    reasons.push('personal perspective')
  }

  const tools = ['react', 'nextjs', 'next.js', 'supabase', 'vercel', 'tailwind', 'typescript', 'ts', 'javascript', 'js', 'postgres', 'sql', 'api', 'database', 'docker', 'aws', 'grok', 'gemini', 'claude']
  const matchedTools = tools.filter(t => first8Words.includes(t))
  if (matchedTools.length > 0) {
    score += 1.5
    reasons.push(`specific tool (${matchedTools[0]})`)
  }

  const frustrations = ['hate', 'pain', 'broken', 'worst', 'fail', 'wrong', 'annoyed', 'frustrated', 'tired', 'sad', 'broke', 'lost', 'waste', 'wasted', 'annoying', 'struggle', 'mess']
  const matchedFrustrations = frustrations.filter(f => first8Words.includes(f))
  if (matchedFrustrations.length > 0) {
    score += 1.5
    reasons.push(`frustration opener ('${matchedFrustrations[0]}')`)
  }

  const strongVerbs = ['built', 'killed', 'saved', 'destroyed', 'doubled', 'scaled', 'launch', 'shipped', 'created', 'discovered', 'learned', 'solved', 'fixed', 'optimized', 'hacked']
  const matchedVerbs = strongVerbs.filter(v => first8Words.includes(v))
  if (matchedVerbs.length > 0) {
    score += 1.5
    reasons.push(`strong verb ('${matchedVerbs[0]}')`)
  }

  if (first8Words.includes('?')) {
    score += 1.5
    reasons.push('question hook')
  }

  // Check for weak openers
  const weakOpeners = ['so i', 'just', 'hey', 'thread:', 'guys', 'everyone', 'hello', 'today i', 'wanted to']
  const matchedWeak = weakOpeners.find(w => first8Words.startsWith(w))
  if (matchedWeak) {
    score -= 2.5
    reasons.push(`weak opener ('${matchedWeak}')`)
  }

  score = Math.max(0, Math.min(10, score))
  const label = score >= 7.5 ? 'Strong' : score >= 4 ? 'Weak' : 'Fail'
  
  let reasonText = ''
  if (reasons.length > 0) {
    reasonText = `Score ${score.toFixed(1)}/10. Detected: ${reasons.join(', ')}.`
  } else {
    reasonText = 'Standard hook. Could be stronger with numbers, tools, or emotional openers.'
  }

  return { score, label, reason: reasonText }
}

function scoreReplyBait(tweet: string): SignalScore {
  const cleanTweet = tweet.trim()
  if (!cleanTweet) {
    return { score: 0, label: 'Fail', reason: 'Empty tweet' }
  }

  const lowercase = cleanTweet.toLowerCase()

  if (/\brt\b|\bretweet\b|please rt/i.test(lowercase)) {
    return {
      score: 2,
      label: 'Fail',
      reason: 'Asking for RTs/retweets is flagged by the algorithm and suppresses organic reach.'
    }
  }

  if (lowercase.endsWith('thoughts?') || lowercase.endsWith('thoughts ?') || lowercase.includes('let me know')) {
    return {
      score: 4,
      label: 'Weak',
      reason: "Generic 'thoughts?' or 'let me know' CTAs are overused and get ignored."
    }
  }

  let score = 5
  const reasons: string[] = []

  if (cleanTweet.endsWith('?')) {
    score += 3
    reasons.push('ends with specific question')
  }

  const controversialTriggers = ['change my mind', 'unpopular opinion', 'hot take', 'hot-take', 'disagree', 'stop doing', 'mistake']
  const matchedContro = controversialTriggers.find(t => lowercase.includes(t))
  if (matchedContro) {
    score += 2.5
    reasons.push(`controversial prompt ('${matchedContro}')`)
  }

  if (lowercase.includes('__')) {
    score += 2.5
    reasons.push('fill-in-the-blank format')
  }

  if (/\b(pain|mess|struggle|nightmare)\b/.test(lowercase)) {
    score += 1.5
    reasons.push('relatable pain point')
  }

  score = Math.max(0, Math.min(10, score))
  const label = score >= 7.5 ? 'Strong' : score >= 4 ? 'Weak' : 'Fail'
  const reasonText = reasons.length > 0 
    ? `Detected: ${reasons.join(', ')}.`
    : 'No clear conversation starter. Try ending with a specific question.'

  return { score, label, reason: reasonText }
}

function scoreSpecificity(tweet: string): SignalScore {
  const cleanTweet = tweet.trim()
  if (!cleanTweet) {
    return { score: 0, label: 'Fail', reason: 'Empty tweet' }
  }

  let count = 0
  const matches: string[] = []

  const tools = ['react', 'next.js', 'nextjs', 'typescript', 'supabase', 'vercel', 'tailwind', 'postgres', 'sql', 'docker', 'aws', 'grok', 'gemini', 'claude', 'node', 'npm', 'git']
  tools.forEach(t => {
    const regex = new RegExp(`\\b${t.replace('.', '\\.')}\\b`, 'gi')
    const countMatches = (cleanTweet.match(regex) || []).length
    if (countMatches > 0) {
      count += countMatches
      matches.push(t)
    }
  })

  const numbers = cleanTweet.match(/\b\d+%\b|\b\d+\b/g) || []
  if (numbers.length > 0) {
    count += numbers.length
    matches.push(...numbers)
  }

  const timeframes = cleanTweet.match(/\b\d+\s*(hour|min|sec|day|week|month|year|hr|yr|mo|wk)s?\b|\b\d+(h|m|s|d|w|y)\b/gi) || []
  if (timeframes.length > 0) {
    count += timeframes.length
    matches.push(...timeframes)
  }

  const errors = ['404', '500', 'typeerror', 'error', 'exception', 'bug', 'crash', 'fail']
  errors.forEach(e => {
    const regex = new RegExp(`\\b${e}\\b`, 'gi')
    const countMatches = (cleanTweet.match(regex) || []).length
    if (countMatches > 0) {
      count += countMatches
      matches.push(e)
    }
  })

  const mentions = cleanTweet.match(/@\w+/g) || []
  if (mentions.length > 0) {
    count += mentions.length
    matches.push(...mentions)
  }

  const score = Math.max(0, Math.min(10, count * 1.5))
  const label = score >= 7.5 ? 'Strong' : score >= 4 ? 'Weak' : 'Fail'
  const reasonText = count > 0
    ? `Found ${count} specifics: ${Array.from(new Set(matches)).slice(0, 5).join(', ')}${matches.length > 5 ? '...' : ''}.`
    : 'Too abstract. Add specific tool names, numbers, timeframes, or metrics.'

  return { score, label, reason: reasonText }
}

function scoreEmotionalTrigger(tweet: string): SignalScore {
  const cleanTweet = tweet.trim()
  if (!cleanTweet) {
    return { score: 0, label: 'Fail', reason: 'Empty tweet' }
  }

  const lowercase = cleanTweet.toLowerCase()
  const triggers: string[] = []

  if (/\b(secret|unusual|hidden|nobody talks|truth|why most|how i actually|revealed|underrated)\b/.test(lowercase)) {
    triggers.push('curiosity')
  }
  if (/\b(all been there|am i the only|every developer|every founder|late night|tiring|developer struggles)\b/.test(lowercase)) {
    triggers.push('relatability')
  }
  if (/\b(dream|growth|succeed|future|goals|freedom|better|improve|love|passion|win|achieve)\b/.test(lowercase)) {
    triggers.push('aspiration/hope')
  }
  if (/\b(hate|pain|broken|worst|fail|wrong|annoyed|exhausted|regret|mistake|warning|broke|lost|waste)\b/.test(lowercase)) {
    triggers.push('frustration')
  }
  if (/\b(don't miss|last chance|before it's too late|now or never|quick|hurry|urgent|alert)\b/.test(lowercase)) {
    triggers.push('FOMO/urgency')
  }
  if (/\b(literally me|programmer humor|meme|joke|lol|haha)\b/.test(lowercase)) {
    triggers.push('humor')
  }

  let score = 3
  if (triggers.length >= 2) {
    score = 9
  } else if (triggers.length === 1) {
    score = 7
  }

  const label = score >= 7 ? 'Strong' : 'Weak'
  const reasonText = triggers.length > 0
    ? `Detected emotional trigger(s): ${triggers.join(', ')}.`
    : 'No emotional hooks detected. Make it relatable, aspirational, frustrating, or curious.'

  return { score, label, reason: reasonText }
}

function scoreLength(tweet: string, isThread: boolean): SignalScore {
  const chars = tweet.length
  if (chars === 0) {
    return { score: 0, label: 'Fail', reason: 'Empty tweet' }
  }

  if (chars > 280) {
    return {
      score: 0,
      label: 'Fail',
      reason: `CRITICAL: ${chars} characters. Exceeds the X 280-character limit for free accounts.`
    }
  }

  if (isThread) {
    if (chars < 200) {
      return {
        score: 10,
        label: 'Strong',
        reason: `${chars} chars. Excellent hook length for a thread (under 200 is ideal).`
      }
    } else {
      return {
        score: 6,
        label: 'Weak',
        reason: `${chars} chars. Thread hooks are best kept under 200 chars to entice readers to expand.`
      }
    }
  }

  if (chars < 100) {
    return {
      score: 9,
      label: 'Strong',
      reason: `${chars} chars. Punchy, short, and highly readable single tweet.`
    }
  } else if (chars >= 220 && chars <= 270) {
    return {
      score: 9,
      label: 'Strong',
      reason: `${chars} chars. Context-rich length in the optimal 220-270 character sweet spot.`
    }
  } else if (chars > 270 && chars <= 280) {
    return {
      score: 7,
      label: 'Weak',
      reason: `${chars} chars. Very close to the 280-char hard limit. Cut slightly if possible.`
    }
  } else {
    if (chars >= 100 && chars < 200) {
      return {
        score: 5,
        label: 'Weak',
        reason: `${chars} chars. In the awkward middle zone (100-200). Make it shorter (<100) or expand it (220-270).`
      }
    } else {
      return {
        score: 7.5,
        label: 'Strong',
        reason: `${chars} chars. Decent length, but could be expanded to 220+ for richer context.`
      }
    }
  }
}

function scoreLinks(tweet: string): SignalScore {
  const cleanTweet = tweet.trim()
  const hasLink = /https?:\/\/[^\s]+|www\.[^\s]+|\b\w+\.(com|org|net|co|io|sh|dev)\b/i.test(cleanTweet)

  if (hasLink) {
    return {
      score: 2,
      label: 'Fail',
      reason: 'Contains an external link. The X algorithm heavily penalizes external links. Add link in first reply instead.'
    }
  }

  return {
    score: 10,
    label: 'Strong',
    reason: 'No external links. Reach will not be suppressed by the algorithm.'
  }
}

function scoreCTA(tweet: string): SignalScore {
  const lowercase = tweet.toLowerCase()

  if (/\b(retweet|rt|please rt|follow @|follow me|dm me|dm for)\b/.test(lowercase)) {
    return {
      score: 3,
      label: 'Fail',
      reason: 'Begging for follows/RTs gets downranked. Use a natural prompt instead.'
    }
  }

  if (lowercase.endsWith('thoughts?') || lowercase.includes('let me know') || lowercase.includes('agree?')) {
    return {
      score: 6,
      label: 'Weak',
      reason: "Generic CTAs like 'thoughts?' have low conversion. Use a specific question."
    }
  }

  const hasSpecificQuestion = lowercase.includes('?') && /\b(what|how|why|who|which|when|share your|tell me)\b/.test(lowercase)
  if (hasSpecificQuestion) {
    return {
      score: 9,
      label: 'Strong',
      reason: 'Ended with a specific, engaging question to drive comments.'
    }
  }

  const isStory = /\b(i|we|my|project|built|shipped|learned|decided|worked)\b/.test(lowercase)
  if (isStory) {
    return {
      score: 5,
      label: 'Weak',
      reason: 'Pure story tweet. No CTA is acceptable here, but adding a specific question can increase replies.'
    }
  }

  return {
    score: 4,
    label: 'Weak',
    reason: 'No clear Call to Action or conversation starter.'
  }
}

function scoreThreadPotential(tweet: string, isThread: boolean): SignalScore {
  if (isThread) {
    return {
      score: 10,
      label: 'Strong',
      reason: 'Configured as a thread. Excellent for providing deep value.'
    }
  }

  const lowercase = tweet.toLowerCase()
  const hasSteps = /\b(1\.|2\.|3\.|-|\*)\b/.test(lowercase) || /\b(step \d+|lesson \d+|phase \d+)\b/.test(lowercase) || lowercase.includes('here is how') || lowercase.includes('here\'s how') || lowercase.includes('lessons learned')

  if (hasSteps) {
    return {
      score: 8,
      label: 'Strong',
      reason: 'Contains structured lists or sequential info. Consider expanding into a multi-tweet thread.'
    }
  }

  return {
    score: 5,
    label: 'Weak',
    reason: 'Single tweet formatting. Good for a quick insight, but has low thread potential.'
  }
}

function generateSuggestions(
  tweet: string,
  isThread: boolean,
  hookStrength: SignalScore,
  replyBait: SignalScore,
  specificity: SignalScore,
  emotionalTrigger: SignalScore,
  length: SignalScore,
  noLinksInBody: SignalScore,
  ctaQuality: SignalScore,
  threadPotential: SignalScore
): string[] {
  const suggestions: string[] = []

  if (length.label === 'Fail') {
    suggestions.push('Shorten the tweet to be under 280 characters (free account limit).')
  }

  if (hookStrength.score < 7) {
    suggestions.push('Make the hook stronger by adding a number, specific tool name, or personal pronoun in the first 8 words.')
  }

  if (replyBait.score < 7) {
    suggestions.push('End with a specific question or controversial prompt to invite discussion instead of vague "thoughts?".')
  }

  if (specificity.score < 7) {
    suggestions.push('Add specific tools, metrics, timeframes, or project details to make the tweet less abstract.')
  }

  if (emotionalTrigger.score < 7) {
    suggestions.push('Inject emotional trigger keywords (curiosity, frustration, relatability, aspiration, or urgency).')
  }

  if (!isThread && length.score < 8 && length.label !== 'Fail') {
    suggestions.push('Adjust length: make it punchy under 100 characters, or expand to 220-270 characters for context.')
  }

  if (isThread && length.score < 8) {
    suggestions.push('Keep the thread hook under 200 characters to invite readers to expand.')
  }

  if (noLinksInBody.score < 7) {
    suggestions.push('Remove external links from the body (reach suppression). Post them in the first reply instead.')
  }

  if (ctaQuality.score < 7 && ctaQuality.score > 3) {
    suggestions.push('Upgrade the Call to Action from generic "thoughts?" to a targeted question.')
  }

  if (threadPotential.score >= 8 && !isThread) {
    suggestions.push('Expand this structured list/steps format into a thread for maximum engagement.')
  }

  return suggestions
}

function calculateOverall(
  hookStrength: SignalScore,
  replyBait: SignalScore,
  specificity: SignalScore,
  emotionalTrigger: SignalScore,
  length: SignalScore,
  noLinksInBody: SignalScore,
  ctaQuality: SignalScore,
  threadPotential: SignalScore
): number {
  if (length.label === 'Fail') {
    return 0
  }

  const total =
    hookStrength.score * 0.20 +
    replyBait.score * 0.15 +
    specificity.score * 0.15 +
    emotionalTrigger.score * 0.15 +
    length.score * 0.15 +
    noLinksInBody.score * 0.10 +
    ctaQuality.score * 0.05 +
    threadPotential.score * 0.05

  return Math.round(total * 10)
}
