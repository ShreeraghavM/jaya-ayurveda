import { useState, useRef, useEffect } from 'react'
import { type UserProfile, doshaProfiles, coachResponses, getCurrentTimePeriod, getSeason } from '../lib/data'
import { DISEASE_REPERTORY } from '../lib/knowledgeBase'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Props {
  profile: UserProfile
}

interface Message {
  id: string
  role: 'user' | 'coach'
  content: string
  timestamp: string
  suggestions?: string[]
}

const coachKnowledge: Record<string, (profile: UserProfile) => string> = {
  'how are you': (p) => `I'm here with you, ${p.name || 'friend'}! 🌿 Every moment is a chance to return to balance. How are YOU feeling right now?`,
  
  'tell me about my dosha': (p) => {
    const dosha = p.doshaType || 'Vata'
    const info = doshaProfiles[dosha]
    return `As a ${dosha} type, your core element is ${info.element}. Your natural qualities are ${info.qualities.slice(0, 4).join(', ')}. Your greatest strengths are ${info.strengths.slice(0, 3).join(' and ')}. Would you like specific guidance for balancing your ${dosha}?`
  },
  
  'what should i eat': (p) => {
    const dosha = p.doshaType || 'Vata'
    const foods = doshaProfiles[dosha].favorableFoods.slice(0, 5)
    return `For your ${dosha} constitution, I recommend: ${foods.join(', ')}. The key is to eat warm, freshly prepared food. Would you like specific meal ideas?`
  },
  
  'i feel anxious': (p) => {
    if (p.doshaType === 'Vata') return `Anxiety is common for Vata types — your air element makes the mind move quickly. Try this now: close your eyes, take 10 slow breaths through alternate nostrils (Nadi Shodhana). Apply warm sesame oil to your feet. Drink warm milk with nutmeg tonight. You are safe. 🌿`
    return `Take a deep breath. Anxiety comes and goes like clouds — you are the sky. Try 5 minutes of Nadi Shodhana (alternate nostril breathing). Drink warm water. Ground yourself by pressing your feet into the earth. You are not your anxiety. 🌿`
  },
  
  'i feel tired': (p) => {
    const dosha = p.doshaType || 'Vata'
    if (dosha === 'Kapha') return `For Kapha tiredness, the remedy is movement! Try 3 rounds of Kapalabhati breathing — it's like a cup of coffee for your nervous system. A brisk 10-minute walk will also help. Avoid napping — it will make you more sluggish. 🧘`
    if (dosha === 'Pitta') return `Pitta fatigue often comes from overheating — too much work, too much intensity. Cool down: drink coconut water, take a 15-minute rest, and practice Sheetali (cooling breath). Your fire needs tending, not fueling. 🌊`
    return `Vata fatigue comes from depletion. You need warmth and nourishment. Eat something warm and grounding — soup, kitchari, or warm milk with dates. Rest your mind (not just your body). A 10-minute nap is fine for Vata. 🌿`
  },
  
  'help me sleep': (p) => {
    const dosha = p.doshaType || 'Vata'
    return `For restful sleep, ${dosha} types should: ${dosha === 'Vata' ? 'Apply warm sesame oil to feet, drink warm milk with nutmeg, keep the room warm, and be in bed by 10 PM.' : dosha === 'Pitta' ? 'Keep the room cool, use coconut oil on feet, drink cool milk with saffron, and avoid screens 1 hour before bed.' : 'Wake before 6 AM (this helps you sleep earlier too), avoid naps, keep the room cool and dry, and do light exercise during the day.'} 🌙`
  },
  
  'what yoga should i do': (p) => {
    const dosha = p.doshaType || 'Vata'
    return dosha === 'Vata' ? 'Grounding poses are your medicine: Child\'s Pose (Balasana), Tree Pose (Vrksasana), and gentle forward folds. Start with 5 Sun Salutations to warm up, then hold each pose for 1-2 minutes. End with a long Savasana. Avoid fast, erratic movements.' 
      : dosha === 'Pitta' ? 'Cooling poses balance your fire: Moon Salutation (Chandra Namaskar), Seated Forward Fold, and Supine Twist. Practice in a cool room, avoid hot yoga, and focus on smooth, flowing movements. End with Sheetali pranayama.'
      : 'You need heat and movement! Sun Salutations (Surya Namaskar), Warrior poses, Camel Pose, and dynamic Vinyasa flow. Build intensity gradually. Kapalabhati breathing to start your practice. Power yoga is excellent for you.'
  },
  
  'recommend a remedy': (p) => {
    const dosha = p.doshaType || 'Vata'
    const remedies = dosha === 'Vata' 
      ? 'For Vata balance: warm sesame oil massage (Abhyanga) before bathing, warm ginger tea, grounding meditation, and warm, moist foods. Avoid cold and dry environments.'
      : dosha === 'Pitta'
      ? 'For Pitta balance: coconut oil massage, cooling Sheetali breath, time near water, bitter greens, and moonlight walks. Avoid spicy food and midday sun.'
      : 'For Kapha balance: dry brushing (Garshana), Kapalabhati breathing, vigorous morning exercise, light warm foods, and honey in warm water. Avoid cold, heavy, and sweet foods.'
    return remedies
  },
  
  'daily routine': (p) => {
    const dosha = p.doshaType || 'Vata'
    return `Your ideal daily routine as a ${dosha}: Wake at ${dosha === 'Kapha' ? '5:00 AM' : dosha === 'Pitta' ? '5:30 AM' : '6:00 AM'}. Start with oil pulling, tongue scraping, then ${dosha === 'Vata' ? 'warm sesame oil massage' : dosha === 'Pitta' ? 'cooling coconut oil massage' : 'dry brushing'}. Practice pranayama for 10 minutes, then yoga. Eat your biggest meal at lunch. Dinner by 7 PM, ${dosha === 'Vata' ? 'warm and light' : dosha === 'Pitta' ? 'cool and soothing' : 'very light or skip'}. Bed by ${dosha === 'Kapha' ? '9:30 PM' : '10 PM'}.`
  },
}

function generateCoachResponse(userMessage: string, profile: UserProfile): string {
  const lower = userMessage.toLowerCase().trim()
  const dosha = profile.doshaType || 'Vata'
  const timePeriod = getCurrentTimePeriod()
  const season = getSeason()

  // Check knowledge base
  for (const [key, generator] of Object.entries(coachKnowledge)) {
    if (lower.includes(key)) return generator(profile)
  }

  // Check Clinical Disease Repertory (Charaka Samhita RAG Grounding)
  const matchedDisease = DISEASE_REPERTORY.find(d => {
    const condName = d.condition.toLowerCase()
    const sansk = d.sanskrit.toLowerCase()
    const id = d.id.toLowerCase()
    const sys = d.system.toLowerCase()
    return (
      lower.includes(id) ||
      condName.split('(')[0].trim().split(' ').some(w => w.length > 3 && lower.includes(w)) ||
      lower.includes(sansk.split('·')[0].trim()) ||
      lower.includes(sys) ||
      d.primaryHerbs.some(h => lower.includes(h.toLowerCase().split(' ')[0]))
    )
  })

  if (matchedDisease) {
    return `🌿 **${matchedDisease.condition}** (${matchedDisease.sanskrit})\n\n` +
      `📖 *Classical Reference:* ${matchedDisease.charakaRef}\n\n` +
      `⚖️ *Dosha Root:* ${matchedDisease.doshaImbalance}.\n\n` +
      `🍵 *First-Line Remedy:* ${matchedDisease.homeRemedy}\n\n` +
      `🥣 *Method & Dosage:* ${matchedDisease.preparation} (${matchedDisease.dosage})\n\n` +
      `✅ *Pathya (Beneficial):* ${matchedDisease.pathya.slice(0, 3).join(', ')}.\n` +
      `⚠️ *Apathya (Avoid):* ${matchedDisease.apathya.slice(0, 3).join(', ')}.\n\n` +
      `💡 *Clinical Safety Note:* ${matchedDisease.precautions}`
  }

  // Keyword matching for broader responses
  if (lower.includes('food') || lower.includes('eat') || lower.includes('meal') || lower.includes('recipe'))
    return coachKnowledge['what should i eat'](profile)
  if (lower.includes('anxi') || lower.includes('worried') || lower.includes('nervous') || lower.includes('panic'))
    return coachKnowledge['i feel anxious'](profile)
  if (lower.includes('tire') || lower.includes('exhaust') || lower.includes('low energy') || lower.includes('fatigue'))
    return coachKnowledge['i feel tired'](profile)
  if (lower.includes('sleep') || lower.includes('insomnia') || lower.includes('rest'))
    return coachKnowledge['help me sleep'](profile)
  if (lower.includes('yoga') || lower.includes('exercise') || lower.includes('workout') || lower.includes('stretch'))
    return coachKnowledge['what yoga should i do'](profile)
  if (lower.includes('remedy') || lower.includes('cure') || lower.includes('medicine') || lower.includes('heal'))
    return coachKnowledge['recommend a remedy'](profile)
  if (lower.includes('routine') || lower.includes('schedule') || lower.includes('daily') || lower.includes('morning'))
    return coachKnowledge['daily routine'](profile)
  if (lower.includes('stress') || lower.includes('overwhelm') || lower.includes('burnout'))
    return `As a ${dosha} type, stress hits you ${dosha === 'Vata' ? 'through anxiety and scattered thoughts — ground yourself with warm food, slow breathing, and a consistent routine' : dosha === 'Pitta' ? 'as irritability and anger — cool down with time in nature, Sheetali breath, and reducing commitments' : 'as withdrawal and heaviness — push through with movement, social connection, and stimulating activities'}. What specifically is causing stress right now?`
  if (lower.includes('weather') || lower.includes('season') || lower.includes('climate'))
    return `We're in ${season} — a ${season === 'summer' ? 'Pitta season. Stay cool, eat cooling foods, and avoid overexertion' : season === 'winter' ? 'Kapha season. Stay warm, active, and eat light, spicy foods' : 'Vata season. Stay grounded, warm, and maintain routine'}. For your ${dosha} constitution, this means: ${doshaProfiles[dosha].balanceTips[0].toLowerCase()}`
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey'))
    return `Hello ${profile.name || 'friend'}! 🌿 ${timePeriod === 'morning' || timePeriod === 'brahma_muhurta' ? 'Good morning — how did you sleep? Your morning routine sets the tone for the entire day.' : timePeriod === 'afternoon' || timePeriod === 'mid_morning' ? 'Good afternoon — how is your energy flowing? Remember to eat your largest meal now when your Agni is strongest.' : timePeriod === 'evening' ? 'Good evening — time to begin winding down. How was your day?' : 'Good evening — it\'s late. Are you resting well?'} What would you like guidance on?`
  if (lower.includes('thank') || lower.includes('thanks'))
    return `You're welcome, ${profile.name || 'friend'} 🌿 I'm always here for you. Remember, every small step toward balance is a victory. Is there anything else you need?`
  if (lower.includes('morning') || lower.includes('wake up') || lower.includes('起床'))
    return `Good morning! 🌅 Your ideal morning as a ${dosha}: ${dosha === 'Vata' ? 'Wake gently, drink warm water, do oil pulling, practice Nadi Shodhana, gentle yoga, and eat a warm breakfast.' : dosha === 'Pitta' ? 'Rise with the sun, practice cooling breath, do Moon Salutations, and eat a cooling breakfast.' : 'Wake before 6 AM, do Kapalabhati, vigorous yoga, and a light warm breakfast with honey and ginger.'}`

  // Default contextual response
  const defaults = [
    `That's an interesting thought, ${profile.name || 'friend'}. As a ${dosha} type, remember that balance comes from routine, proper food, and conscious breathing. What specifically would you like guidance on?`,
    `I hear you. In Ayurveda, we say "the disease is not in the body, but in the consciousness." Let's work on bringing your ${dosha} energy into balance. Would you like to focus on diet, exercise, or mental wellness?`,
    `Every question is a step toward awareness 🌿 For ${dosha} types like you, the key is to ${dosha === 'Vata' ? 'stay grounded and warm' : dosha === 'Pitta' ? 'stay cool and moderate' : 'stay active and light'}. What aspect of your wellness would you like to explore?`,
  ]
  return defaults[Math.floor(Math.random() * defaults.length)]
}

export default function ChatCoach({ profile }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const dosha = profile.doshaType || 'Vata'
  const doshaEmoji = dosha === 'Vata' ? '🌬️' : dosha === 'Pitta' ? '🔥' : '🌍'

  useEffect(() => {
    if (messages.length === 0) {
      const timePeriod = getCurrentTimePeriod()
      const greeting = coachResponses[timePeriod]?.greeting || coachResponses.morning.greeting
      setMessages([{
        id: '1',
        role: 'coach',
        content: `${greeting}\n\nI'm your personal Ayurvedic companion. I know you're a ${dosha} type${profile.name ? `, ${profile.name}` : ''}. I'm here to guide you — ask me anything about your health, diet, routine, yoga, or remedies.`,
        timestamp: new Date().toISOString(),
        suggestions: ['Acid Reflux remedy', 'IBS & digestion care', 'Help me sleep (Anidra)', 'Tech-neck stiffness', 'What should I eat today?'],
      }])
    }
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const response = generateCoachResponse(text, profile)
      const coachMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'coach',
        content: response,
        timestamp: new Date().toISOString(),
        suggestions: ['What should I eat?', 'Guide my yoga', 'Tell me a remedy', 'My daily routine'],
      }
      setMessages(prev => [...prev, coachMsg])
      setIsTyping(false)
    }, 800 + Math.random() * 1200)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #0a1a0a 0%, #0d1f0d 100%)' }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-4 border-b border-emerald-800/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-800/50 flex items-center justify-center text-xl">
            {doshaEmoji}
          </div>
          <div>
            <h1 className="text-emerald-100 font-semibold text-base">Jaya Coach</h1>
            <p className="text-emerald-400/50 text-xs">Your Ayurvedic Companion — always here</p>
          </div>
          <div className="ml-auto">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-2' : ''}`}>
              {msg.role === 'coach' && (
                <div className="flex items-center gap-1.5 mb-1 ml-1">
                  <span className="text-xs">{doshaEmoji}</span>
                  <span className="text-emerald-500/50 text-[10px]">Jaya</span>
                </div>
              )}
              <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-emerald-700 text-emerald-50 rounded-br-md'
                  : 'bg-emerald-950/60 border border-emerald-800/30 text-emerald-100/90 rounded-bl-md'
              }`}>
                {msg.content.split('\n').map((line, i) => (
                  <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                ))}
              </div>
              <p className={`text-[10px] text-emerald-600/30 mt-1 ${msg.role === 'user' ? 'text-right mr-1' : 'ml-1'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              {msg.suggestions && msg.role === 'coach' && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {msg.suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(s)}
                      className="px-3 py-1 rounded-full text-[11px] bg-emerald-900/40 border border-emerald-800/30 text-emerald-300/70 hover:bg-emerald-800/40 hover:text-emerald-200 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-emerald-950/60 border border-emerald-800/30 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-emerald-500/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-emerald-500/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-emerald-500/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-5 py-4 border-t border-emerald-800/30 bg-emerald-950/40 backdrop-blur-sm">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend(input)}
            placeholder="Ask your Ayurvedic companion..."
            className="flex-1 bg-emerald-950/60 border border-emerald-800/40 rounded-xl px-4 py-3 text-sm text-emerald-100 placeholder:text-emerald-600/50 outline-none focus:border-emerald-600/50 transition-colors"
          />
          <Button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isTyping}
            className="bg-emerald-700 hover:bg-emerald-600 text-emerald-50 px-4 rounded-xl disabled:opacity-30"
          >
            ↑
          </Button>
        </div>
      </div>
    </div>
  )
}
