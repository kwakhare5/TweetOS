/**
 * Utility functions for TweetOS.
 */

export interface PostingWindow {
  status: 'green' | 'yellow' | 'off'
  label: string
  suggestion: string
}

/**
 * Calculates current time in Indian Standard Time (IST) and returns
 * the active posting window status according to the X algorithm weights.
 */
export function getPostingWindowStatus(): PostingWindow {
  const now = new Date()
  
  // Calculate IST hours (UTC + 5h 30m)
  const utcHours = now.getUTCHours()
  const utcMinutes = now.getUTCMinutes()
  
  let istMinutes = utcMinutes + 30
  let istHour = utcHours + 5 + Math.floor(istMinutes / 60)
  istHour = istHour % 24
  
  if (istHour >= 10 && istHour < 12) {
    return {
      status: 'green',
      label: '🟢 Morning Window (10AM–12PM)',
      suggestion: 'Great time for replies and quote tweets. High active feed scroll.'
    }
  }
  
  if (istHour >= 18 && istHour < 21) {
    return {
      status: 'green',
      label: '🟢 Evening Window (6PM–9PM)',
      suggestion: 'Best time to post anchor tweet. Maximize early engagement snowball.'
    }
  }
  
  if ((istHour >= 12 && istHour < 18) || (istHour >= 21 && istHour < 23)) {
    return {
      status: 'yellow',
      label: '🟡 Okay Window',
      suggestion: 'Good for active engagement & logging replies. Save anchor tweets.'
    }
  }
  
  return {
    status: 'off',
    label: '🔴 Low Activity Time',
    suggestion: 'Save your energy. Target windows are 10AM–12PM or 6PM–9PM IST.'
  }
}
