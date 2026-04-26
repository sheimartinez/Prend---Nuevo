import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClub } from "./actions";
import InternalHeader from "@/components/InternalHeader";
import Pricing from "@/components/Pricing";

type DashboardPageProps = {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
};

type MembershipRow = {
  id: string;
  club_id: string;
  role: string;
  status?: string | null;
};

type ClubRow = {
  id: string;
  name: string;
  created_at?: string;
};

type InvitationRow = {
  id: string;
  club_id: string;
  email: string;
  role: string;
  status: string;
  clubs?: { name: string } | { name: string }[] | null;
};

function getDashboardMessage(success?: string, error?: string) {
  if (success === "invitation_accepted") {
    return {
      type: "success" as const,
      text: "Invitación aceptada correctamente.",
    };
  }

  if (error === "missing_club_name") {
    return { type: "error" as const, text: "Ingresá el nombre del club." };
  }

  if (error === "club_limit_reached") {
    return {
      type: "error" as const,
      text: "Tu cuenta ya pertenece a un club. El límite actual es 1 club por usuario.",
    };
  }

  if (error === "create_club_failed") {
    return { type: "error" as const, text: "No se pudo crear el club." };
  }

  if (error === "create_admin_membership_failed") {
    return {
      type: "error" as const,
      text: "El club se creó, pero no se pudo asignar el admin.",
    };
  }

  if (error) {
    return { type: "error" as const, text: "Ocurrió un error." };
  }

  return null;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const { success, error } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userEmail = user.email?.toLowerCase() ?? "";

  const { data: memberships, error: membershipsError } = await supabase
    .from("memberships")
    .select("id, club_id, role, status")
    .eq("user_id", user.id);

  if (membershipsError) {
    return <div>Error al cargar tus clubes</div>;
  }

  const membershipRows = (memberships ?? []) as MembershipRow[];
  const clubIds = membershipRows.map((membership) => membership.club_id);

  let clubs: ClubRow[] = [];

  if (clubIds.length > 0) {
    const { data: clubsData, error: clubsError } = await supabase
      .from("clubs")
      .select("id, name, created_at")
      .in("id", clubIds);

    if (clubsError) {
      return <div>Error al cargar los datos de los clubes</div>;
    }

    clubs = (clubsData ?? []) as ClubRow[];
  }

  const { data: invitationsData } = await supabase
    .from("invitations")
    .select(`
      id,
      club_id,
      email,
      role,
      status,
      clubs (
        name
      )
    `)
    .eq("email", userEmail)
    .eq("status", "pending");

  const invitations = (invitationsData ?? []) as InvitationRow[];
  const feedback = getDashboardMessage(success, error);
  const canCreateClub = membershipRows.length === 0;

  return (
    <>
      <InternalHeader userEmail={userEmail} />

      <main className="prende-page">
        <div className="prende-container">
          <div className="prende-kicker">Panel privado</div>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="prende-title">Dashboard</h1>
              <p className="prende-subtitle">
                Gestioná tus clubes, accesos internos, invitaciones y planes
                desde un espacio privado.
              </p>
            </div>

            <Link href="/socio" className="prende-btn-secondary">
              Vista socio
            </Link>
          </div>

          {feedback && (
            <div
              className={`mt-6 ${
                feedback.type === "success" ? "prende-success" : "prende-alert"
              }`}
            >
              {feedback.text}
            </div>
          )}

          {invitations.length > 0 && (
            <section className="prende-section">
              <div className="prende-card">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="prende-section-title">
                      Invitaciones pendientes
                    </h2>
                    <p className="prende-card-text">
                      Tenés invitaciones privadas para sumarte a un club.
                    </p>
                  </div>

                  <span className="prende-pill">
                    {invitations.length} pendiente(s)
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  {invitations.map((invitation) => {
                    const clubName = Array.isArray(invitation.clubs)
                      ? invitation.clubs[0]?.name
                      : invitation.clubs?.name;

                    return (
                      <div
                        key={invitation.id}
                        className="rounded-2xl border bg-[#FBF9F6] p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-bold text-[#1E293B]">
                              {clubName || "Club"}
                            </p>
                            <p className="text-sm text-gray-500">
                              Invitación para entrar como {invitation.role}.
                            </p>
                          </div>

                          <Link
                            href={`/invitations/${invitation.id}/accept`}
                            className="prende-btn"
                          >
                            Aceptar invitación
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          <section className="prende-section">
            <div className="prende-grid-2">
              {canCreateClub ? (
                <div className="prende-card">
                  <h2 className="prende-section-title">Crear club</h2>
                  <p className="prende-card-text">
                    Creá el espacio privado de gestión interna de tu club.
                  </p>

                  <form
                    action={createClub}
                    className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]"
                  >
                    <input
                      name="name"
                      placeholder="Nombre del club"
                      required
                      className="prende-input"
                    />

                    <button className="prende-btn">Crear club</button>
                  </form>

                  <p className="prende-help">
                    Límite actual: 1 club por usuario.
                  </p>
                </div>
              ) : (
                <div className="prende-card">
                  <h2 className="prende-section-title">Club activo</h2>
                  <p className="prende-card-text">
                    Tu cuenta ya tiene acceso a un club. Podés administrarlo o
                    usar la vista socio.
                  </p>
                </div>
              )}

              <div className="prende-card">
                <h2 className="prende-section-title">Acceso seguro</h2>
                <p className="prende-card-text">
                  Prendé funciona como plataforma privada de gestión interna. No
                  es tienda, no tiene checkout público y no promueve consumo.
                </p>
              </div>
            </div>
          </section>

          <section className="prende-section">
            <h2 className="prende-section-title">Mis clubes</h2>

            {clubs.length === 0 ? (
              <div className="prende-empty mt-4">
                Todavía no perteneces a ningún club.
              </div>
            ) : (
              <div className="mt-4 prende-grid">
                {clubs.map((club) => {
                  const membership = membershipRows.find(
                    (m) => m.club_id === club.id
                  );

                  return (
                    <div key={club.id} className="prende-card">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-xl font-extrabold text-[#1E293B]">
                            {club.name}
                          </h3>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="prende-pill">
                              Rol: {membership?.role || "socio"}
                            </span>

                            <span className="prende-pill">
                              Estado: {membership?.status || "active"}
                            </span>
                          </div>
                        </div>

                        <Link href={`/club/${club.id}`} className="prende-btn">
                          Entrar al club
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="prende-section">
            <Pricing />
          </section>
        </div>
      </main>
    </>
  );
}