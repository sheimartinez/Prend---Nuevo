import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const PLANS = {
  esencial: {
    title: "Prendé - Plan Esencial",
    price: 800,
  },
  personalizado: {
    title: "Prendé - Plan Personalizado",
    price: 1300,
  },
};

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await request.json();
  const clubId = String(body.club_id || "");
  const plan = String(body.plan || "esencial") as keyof typeof PLANS;

  if (!clubId || !PLANS[plan]) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { data: membership } = await supabase
    .from("memberships")
    .select("id")
    .eq("club_id", clubId)
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (!membership) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;

  if (!token || token === "TU_ACCESS_TOKEN") {
    return NextResponse.json(
      { error: "Falta configurar MERCADO_PAGO_ACCESS_TOKEN" },
      { status: 500 }
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const { data: subscription, error: subscriptionError } = await supabase
    .from("subscriptions")
    .insert({
      club_id: clubId,
      plan,
      status: "pending",
    })
    .select("id")
    .single();

  if (subscriptionError || !subscription) {
    console.error("SUBSCRIPTION CREATE ERROR:", subscriptionError);

    return NextResponse.json(
      {
        error:
          subscriptionError?.message || "No se pudo crear suscripción",
      },
      { status: 500 }
    );
  }

  const preferenceBody = {
    items: [
      {
        id: plan,
        title: PLANS[plan].title,
        quantity: 1,
        unit_price: PLANS[plan].price,
        currency_id: "UYU",
      },
    ],
    metadata: {
      club_id: clubId,
      subscription_id: subscription.id,
      plan,
    },
    external_reference: subscription.id,
    back_urls: {
      success: `${appUrl}/dashboard?success=payment_started`,
      failure: `${appUrl}/dashboard?error=payment_failed`,
      pending: `${appUrl}/dashboard?success=payment_pending`,
    },
    notification_url: `${appUrl}/api/mercadopago/webhook`,
  };

  const mpResponse = await fetch(
    "https://api.mercadopago.com/checkout/preferences",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preferenceBody),
    }
  );

  const mpText = await mpResponse.text();
  const mpData = mpText ? JSON.parse(mpText) : {};

  if (!mpResponse.ok) {
    console.error("MERCADO PAGO PREFERENCE ERROR:", mpData);

    return NextResponse.json(
      {
        error:
          mpData?.message ||
          mpData?.error ||
          "No se pudo crear preferencia de Mercado Pago",
      },
      { status: 500 }
    );
  }

  await supabase
    .from("subscriptions")
    .update({
      mercado_pago_preference_id: mpData.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", subscription.id);

  return NextResponse.json({
    preference_id: mpData.id,
    init_point: mpData.init_point,
    sandbox_init_point: mpData.sandbox_init_point,
  });
}