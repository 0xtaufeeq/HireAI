import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function GET() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `
Please return ONLY a JSON object with a success message and the current date.
Do not include any explanations or additional text.
Format: {"status": "success", "message": "Gemini API is working", "timestamp": "current_timestamp"}
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Try to parse the JSON response
    try {
      // Clean the response more thoroughly
      let jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      
      // Extract only the JSON part (between { and })
      const jsonStart = jsonText.indexOf('{')
      const jsonEnd = jsonText.lastIndexOf('}')
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        jsonText = jsonText.substring(jsonStart, jsonEnd + 1)
      }
      
      const parsedResponse = JSON.parse(jsonText)
      
      return NextResponse.json({
        success: true,
        geminiResponse: parsedResponse,
        rawResponse: text,
        message: 'Gemini API integration test successful'
      })
    } catch (parseError) {
      return NextResponse.json({
        success: true,
        geminiResponse: null,
        rawResponse: text,
        message: 'Gemini API responded but JSON parsing failed',
        parseError: parseError instanceof Error ? parseError.message : 'Unknown parse error'
      })
    }

  } catch (error) {
    console.error('Gemini API test error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gemini API test failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic' 