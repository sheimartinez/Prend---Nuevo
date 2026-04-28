import { MercadoPagoConfig, Payment } from "mercadopago";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();

  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;

  if (!token) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const paymentId =
    body?.data?.id || body?.id || new URL(request.url).searchParams.get("id");

  if (!paymentId) {
    return NextResponse.json({ ok: true });
  }

  const client = new MercadoPagoConfig({ accessToken: token });
  const paymentClient = new Payment(client);

  const payment = await paymentClient.get({ id: String(paymentId) });

  const paymentType = payment.metadata?.type;
  const status = payment.status;

  /**
   * Pago de cuota social del socio
   */
  if (paymentType === "member_fee") {
    const feeId = payment.external_reference || payment.metadata?.fee_id;

    if (!feeId) {
      return NextResponse.json({ ok: true });
    }

    if (status === "approved") {
      await supabase
        .from("member_fees")
        .update({
          status: "pagada",
          paid_at: new Date().toISOString(),
          mercado_pago_payment_id: String(payment.id),
          updated_at: new Date().toISOString(),
        })
        .eq("id", feeId);
    }

    return NextResponse.json({ ok: true });
  }

  /**
   * Pago de plan SaaS del club/admin
   */
  const subscriptionId =
    payment.external_reference || payment.metadata?.subscription_id;

  const clubId = payment.metadata?.club_id;
  const plan = payment.metadata?.plan;

  if (!subscriptionId || !clubId) {
    return NextResponse.json({ ok: true });
  }

  await supabase.from("payments").insert({
    club_id: clubId,
    subscription_id: subscriptionId,
    plan,
    amount: payment.transaction_amount,
    currency: payment.currency_id || "UYU",
    status,
    mercado_pago_payment_id: String(payment.id),
    raw_payload: payment as any,
  });

  if (status === "approved") {
    const now = new Date();
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    await supabase
      .from("subscriptions")
      .update({
        status: "active",
        mercado_pago_payment_id: String(payment.id),
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq("id", subscriptionId);
  }

  return NextResponse.json({ ok: true });
}