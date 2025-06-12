import { useState } from 'react'
import { callOpenAI } from './lib/openaiClient'

const defaultState = {
  linkedinUrl: '',
  role: '',
  companyName: '',
  companyWebsite: '',
  aiResponse: '',
  loading: false,
}

const userPrompts = {
  1: `Research {Prospect’s LinkedIn} and {Company name} + {website}. Based on the prospect’s role, company size, and publicly available information (e.g., LinkedIn activity, press releases, interviews), identify specific security challenges or business priorities they might be facing. Then, write a concise value-based message (max 3 sentences) that clearly maps those insights to how the company DTEX and their product Intercept Ai3 can help. The message should be highly personalized and actionable.

GOAL: Schedule a quick intro call.  
END with: Would you be open to a quick 20-minute call next week?
CRITICAL: CREATE THIS IN AN EMAIL FORMAT.
CRITICAL: Make sure you mention their role.
IMPORTANT. Insert paragraph breaks between ideas to improve readability. `,

  2: `Research {Prospect’s LinkedIn} and {Company name} + {website}. Based on the prospect’s role, company size, and publicly available information (e.g., LinkedIn activity, press releases, interviews), identify specific security challenges or business priorities they might be facing. Then, write a concise value-based message (max 3 sentences) that clearly maps those insights to how the company LeanTaaS and their product iQueue Surgical center can help. The message should be highly personalized and actionable.

GOAL: Schedule a quick intro call.  
END with: Would you be open to a quick 20-minute call next week?
CRITICAL: CREATE THIS IN AN EMAIL FORMAT
IMPORTANT. Insert paragraph breaks between ideas to improve readability. Aim for a short intro insight, followed by the value proposition from LeanTaaS.`,

  3: `Research {Prospect’s LinkedIn} and {Company name} + {website}. Based on the prospect’s role, company size, and publicly available information (e.g., LinkedIn activity, press releases, interviews), identify specific security challenges or business priorities they might be facing. Then, write a concise value-based message (max 3 sentences) that clearly maps those insights to how the company HID Global and their product PKIaaS can help. The message should be highly personalized and actionable.

GOAL: Schedule a quick intro call.  
END with: Would you be open to a quick 20-minute call next week?
CRITICAL: CREATE THIS IN AN EMAIL FORMAT
IMPORTANT. Insert paragraph breaks between ideas to improve readability.`,

  4: `Research {Prospect’s LinkedIn}, their role as {ROLE}, and {Company name} + {website}. Open by summarizing the prospect’s likely priorities or challenges **in their role as {ROLE}**, especially given the company’s size, industry, or recent activity (e.g., LinkedIn posts, press, interviews).  Then, write a concise value-based message (max 3 sentences) that clearly maps those insights to how the company {Storpool Storiage} and their product {On Prem Block Data Storage} can help. The message should be highly personalized and actionable.

GOAL: Schedule a quick intro call.  
END with: Would you be open to a quick 20-minute call next week?
CRITICAL: CREATE THIS IN AN EMAIL FORMAT
IMPORTANT. Insert paragraph breaks between ideas to improve readability.`,

  5: `Research {Prospect’s LinkedIn}, their role as {ROLE}, and {Company name} + {website}. Open by summarizing the prospect’s likely priorities or challenges **in their role as {ROLE}**, especially given the company’s size, industry, or recent activity (e.g., LinkedIn posts, press, interviews).  Then, write a concise value-based message (max 3 sentences) that clearly maps those insights to how the company {Storpool Storiage} and their product {On Prem Block Data Storage} can help. The message should be highly personalized and actionable.

GOAL: Schedule a quick intro call.  
END with: Would you be open to a quick 20-minute call next week?
CRITICAL: CREATE THIS IN AN EMAIL FORMAT
IMPORTANT. Insert paragraph breaks between ideas to improve readability.`,
}

function App() {
  const [activeUser, setActiveUser] = useState(1)
  const [forms, setForms] = useState({
    1: { ...defaultState },
    2: { ...defaultState },
    3: { ...defaultState },
    4: { ...defaultState },
    5: { ...defaultState },
  })

  const handleChange = (userId, field, value) => {
    setForms(prev => ({
      ...prev,
      [userId]: { ...prev[userId], [field]: value },
    }))
  }

  const handleSubmit = async (userId) => {
    const { linkedinUrl, role, companyName, companyWebsite } = forms[userId]
    const systemPromptTemplate = userPrompts[userId]

    handleChange(userId, 'loading', true)

    try {
      const result = await callOpenAI({
  linkedinUrl,
  role,
  companyName,
  companyWebsite
}, systemPromptTemplate)

      handleChange(userId, 'aiResponse', result)
    } catch (err) {
      console.error('OpenAI error:', err)
      handleChange(userId, 'aiResponse', '⚠️ Failed to generate response.')
    }

    handleChange(userId, 'loading', false)
  }

  const renderTab = (userId) => {
    const { linkedinUrl, role, companyName, companyWebsite, aiResponse, loading } = forms[userId]


    return (
      <div style={{ marginTop: '1rem' }}>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(userId) }}>
          <label>LinkedIn URL:</label>
          <input
            type="text"
            value={linkedinUrl}
            onChange={(e) => handleChange(userId, 'linkedinUrl', e.target.value)}
            required
            style={{ width: '100%', marginBottom: '1rem' }}
          />

<label>Role:</label>
<input
  type="text"
  value={role}
  onChange={(e) => handleChange(userId, 'role', e.target.value)}
  required
  style={{ width: '100%', marginBottom: '1rem' }}
/>


          <label>Company Name:</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => handleChange(userId, 'companyName', e.target.value)}
            required
            style={{ width: '100%', marginBottom: '1rem' }}
          />

          <label>Company Website:</label>
          <input
            type="text"
            value={companyWebsite}
            onChange={(e) => handleChange(userId, 'companyWebsite', e.target.value)}
            required
            style={{ width: '100%', marginBottom: '1rem' }}
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Submit'}
          </button>
        </form>

        {aiResponse && (
          <div style={{ marginTop: '1rem' }}>
            <label>AI Response:</label>
            <textarea
              value={aiResponse}
              readOnly
              rows={10}
              style={{ width: '100%', marginTop: '0.5rem' }}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <h2>AI Outreach Tool</h2>

      {/* Tab Header */}
      <div style={{ display: 'flex', marginBottom: '1rem' }}>
        {[
          { id: 1, label: 'DTEX' },
          { id: 2, label: 'LeanTaaS' },
          { id: 3, label: 'PKI' },
          { id: 4, label: 'Storpool Storage' },
          { id: 4, label: 'Workbright' },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveUser(id)}
            style={{
              padding: '0.5rem 1rem',
              borderBottom: activeUser === id ? '2px solid black' : '1px solid gray',
              background: activeUser === id ? '#f2f2f2' : '#fff',
              cursor: 'pointer',
              marginRight: '0.5rem',
              fontWeight: activeUser === id ? 'bold' : 'normal',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      {renderTab(activeUser)}
    </div>
  )
}

export default App
