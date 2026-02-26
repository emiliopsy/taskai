import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    if (!text?.trim()) {
      return NextResponse.json({ error: 'Texto vacío' }, { status: 400 })
    }

    const today = new Date().toISOString().split('T')[0]

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    })

    const prompt = `Sos un asistente para organizar tareas. Analizá el siguiente texto y extraé todas las tareas mencionadas.

Texto del usuario: "${text}"

Hoy es: ${today}

Para cada tarea, asigná:
- category: una de estas categorías [trabajo, personal, compras, salud, finanzas, estudio, hogar, otro]
- priority: "alta" si es urgente o importante, "media" si es normal, "baja" si puede esperar
- date: fecha estimada en formato YYYY-MM-DD si se menciona (mañana, la semana que viene, etc.), o null si no hay fecha

Respondé ÚNICAMENTE con un JSON válido, sin texto adicional, en este formato exacto:
{
  "tasks": [
    {
      "text": "descripción clara de la tarea",
      "category": "categoría",
      "priority": "alta|media|baja",
      "date": "YYYY-MM-DD o null"
    }
  ]
}`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    const parsed = JSON.parse(responseText)

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Error en parse-tasks:', error)
    return NextResponse.json(
      { error: 'Error al procesar las tareas' },
      { status: 500 }
    )
  }
}
