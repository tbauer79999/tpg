import axios from 'axios'

export const callOpenAI = async ({ linkedinUrl, companyName, companyWebsite }, systemPromptTemplate) => {
  const fullSystemPrompt = `
${systemPromptTemplate.trim()}

LinkedIn: ${linkedinUrl}
Company: ${companyName}
Website: ${companyWebsite}
  `.trim()

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: fullSystemPrompt,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
    }
  )

  return response.data.choices[0].message.content
}