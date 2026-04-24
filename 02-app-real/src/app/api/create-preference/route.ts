import { NextResponse } from 'next/server'
import MercadoPago from 'mercadopago'

const client = new MercadoPago({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

export async function POST(req: Request) {
  const { plan } = await req.json()

  const prices: Record<string, number> = {
    esencial: 800,
    personalizado: 1300,
  }

  const titles: Record<string, string> = {
    esencial: 'Plan Esencial - Prendé',
    personalizado: 'Plan Personalizado - Prendé',
  }

  if (!prices[plan]) {
    return NextResponse.json(
      { error: 'Plan inválido' },
      { status: 400 }
    )
  }

  const preference = await client.preferences.create({
    items: [
      {
        title: titles[plan],
        quantity: 1,
        unit_price: prices[plan],
        currency_id: 'UYU',
      },
    ],
    back_urls: {
      success: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=success`,
      failure: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=error`,
    },
    auto_return: 'approved',
  })

  return NextResponse.json({
    id: preference.id,
  })
}