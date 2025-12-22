import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export const maxDuration = 60 // Allow up to 60 seconds for CV parsing

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('cv') as File | null

        if (!file) {
            return NextResponse.json(
                { error: 'No CV file provided' },
                { status: 400 }
            )
        }

        if (file.type !== 'application/pdf') {
            return NextResponse.json(
                { error: 'Only PDF files are supported' },
                { status: 400 }
            )
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer()
        const base64 = Buffer.from(bytes).toString('base64')

        // Initialize Anthropic client
        const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        })

        // Use Claude to parse the CV
        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4096,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'document',
                            source: {
                                type: 'base64',
                                media_type: 'application/pdf',
                                data: base64,
                            },
                        },
                        {
                            type: 'text',
                            text: `Extract information from this CV/resume and return it as a JSON object with the following structure. Be thorough and extract ALL information available. If a field is not found, use an empty string or empty array as appropriate.

Return ONLY valid JSON, no markdown formatting or explanation:

{
  "name": "Full name of the person",
  "title": "Professional title or current role (e.g., 'Full-Stack Developer', 'Software Engineer')",
  "bio": "A 2-3 sentence professional summary based on the CV content. Write it in first person.",
  "skills": ["skill1", "skill2", ...], // Extract all technical skills, tools, and technologies mentioned
  "education": [
    {
      "institution": "University/School name",
      "degreeLevel": "Bachelor's/Master's/PhD/etc",
      "degreeName": "Field of study (e.g., Computer Science)",
      "startDate": "YYYY-MM or YYYY",
      "endDate": "YYYY-MM or YYYY or empty if current",
      "gpa": "GPA if mentioned"
    }
  ],
  "experience": [
    {
      "company": "Company name",
      "title": "Job title",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM or empty if current",
      "isPresent": true/false,
      "duties": "Brief description of responsibilities and achievements"
    }
  ],
  "projects": [
    {
      "title": "Project name",
      "description": "Brief project description",
      "tags": ["tech1", "tech2"],
      "liveUrl": "URL if mentioned",
      "githubUrl": "GitHub URL if mentioned"
    }
  ],
  "contact": {
    "email": "email if found",
    "github": "GitHub username or URL if found",
    "linkedin": "LinkedIn URL if found",
    "twitter": "Twitter/X handle if found"
  }
}

Important:
- For skills, use the exact technology names as they appear (e.g., "React", "Node.js", "TypeScript")
- For dates, use YYYY-MM format when possible, or just YYYY if only year is available
- The bio should be written in first person and sound professional
- Extract ALL projects mentioned, including personal projects, coursework, etc.
- If the CV is not in English, translate the extracted content to English`,
                        },
                    ],
                },
            ],
        })

        // Extract the text content from the response
        const textContent = response.content.find(block => block.type === 'text')
        if (!textContent || textContent.type !== 'text') {
            throw new Error('No text response from AI')
        }

        // Parse the JSON response
        let parsedData
        try {
            // Remove any markdown code blocks if present
            let jsonText = textContent.text.trim()
            if (jsonText.startsWith('```json')) {
                jsonText = jsonText.slice(7)
            }
            if (jsonText.startsWith('```')) {
                jsonText = jsonText.slice(3)
            }
            if (jsonText.endsWith('```')) {
                jsonText = jsonText.slice(0, -3)
            }
            parsedData = JSON.parse(jsonText.trim())
        } catch {
            console.error('Failed to parse AI response:', textContent.text)
            throw new Error('Failed to parse CV data')
        }

        // Add IDs to education, experience, and projects
        const processedData = {
            ...parsedData,
            education: (parsedData.education || []).map((edu: Record<string, unknown>, index: number) => ({
                ...edu,
                id: `edu-${Date.now()}-${index}`,
            })),
            experience: (parsedData.experience || []).map((exp: Record<string, unknown>, index: number) => ({
                ...exp,
                id: `exp-${Date.now()}-${index}`,
            })),
            projects: (parsedData.projects || []).map((proj: Record<string, unknown>, index: number) => ({
                ...proj,
                id: `proj-${Date.now()}-${index}`,
            })),
        }

        return NextResponse.json({ data: processedData })
    } catch (error) {
        console.error('CV parsing error:', error)
        const err = error as { message?: string }
        return NextResponse.json(
            { error: err.message || 'Failed to parse CV' },
            { status: 500 }
        )
    }
}
