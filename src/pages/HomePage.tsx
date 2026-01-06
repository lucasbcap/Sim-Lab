import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <main
            style={{
                minHeight: "100vh",
                background:
                    "radial-gradient(120% 120% at 15% 10%, #f7f5e8 0%, #f3eee0 40%, #e9dfd2 70%, #e1d7c8 100%)",
                color: "#1f1b16",
                fontFamily: "\"Plus Jakarta Sans\", sans-serif",
                padding: "96px 24px 64px",
            }}
        >
            <section
                style={{
                    maxWidth: 980,
                    margin: "0 auto",
                    display: "grid",
                    gap: 32,
                }}
            >
                <div style={{ display: "grid", gap: 16 }}>
                    <span
                        style={{
                            textTransform: "uppercase",
                            letterSpacing: "0.22em",
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#6d5f51",
                        }}
                    >
                        Physique visuelle
                    </span>
                    <h1
                        style={{
                            fontSize: "clamp(32px, 5vw, 64px)",
                            lineHeight: 1.05,
                            margin: 0,
                            fontWeight: 700,
                        }}
                    >
                        SIM-LAB: des simulations qui donnent vie au mouvement.
                    </h1>
                    <p
                        style={{
                            maxWidth: 560,
                            fontSize: "clamp(16px, 2vw, 20px)",
                            lineHeight: 1.5,
                            margin: 0,
                            color: "#3d3329",
                        }}
                    >
                        Explore des expériences interactives construites avec des
                        particules, des forces et des obstacles. Commence par la
                        simulation de fluide, et ajoute tes prochaines scènes.
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                        <Link
                            to="/fluide"
                            style={{
                                padding: "12px 18px",
                                background: "#1f1b16",
                                color: "#fdf8f0",
                                borderRadius: 999,
                                textDecoration: "none",
                                fontWeight: 600,
                            }}
                        >
                            Lancer la simulation fluide
                        </Link>
                        <a
                            href="#scenes"
                            style={{
                                padding: "12px 18px",
                                border: "1px solid #1f1b16",
                                color: "#1f1b16",
                                borderRadius: 999,
                                textDecoration: "none",
                                fontWeight: 600,
                            }}
                        >
                            Voir les scenes
                        </a>
                        <Link
                            to="/wiki/sim1"
                            style={{
                                padding: "12px 18px",
                                background: "rgba(31, 27, 22, 0.08)",
                                color: "#1f1b16",
                                borderRadius: 999,
                                textDecoration: "none",
                                fontWeight: 600,
                            }}
                        >
                            Lire le wiki
                        </Link>
                    </div>
                </div>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: 20,
                    }}
                >
                    {[
                        {
                            title: "Fluide particulaire",
                            status: "Disponible",
                            description:
                                "Des billes libres qui s'ecoulent selon la gravite et la rotation.",
                            link: "/fluide",
                        },
                        {
                            title: "Pendule double",
                            status: "Disponible",
                            description:
                                "Une simulation chaotique pour etudier l'instabilite.",
                            link: "/pendule",
                        },
                        {
                            title: "Vagues et ressorts",
                            status: "A venir",
                            description:
                                "Une grille elastique pour des ondes visuelles.",
                        },
                    ].map((card) => (
                        <article
                            key={card.title}
                            id={card.title === "Fluide particulaire" ? "scenes" : ""}
                            style={{
                                background: "rgba(255, 255, 255, 0.78)",
                                border: "1px solid rgba(31, 27, 22, 0.1)",
                                borderRadius: 20,
                                padding: 20,
                                display: "grid",
                                gap: 12,
                                minHeight: 160,
                                boxShadow: "0 14px 30px rgba(31, 27, 22, 0.08)",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 12,
                                }}
                            >
                                <h3 style={{ margin: 0, fontSize: 18 }}>
                                    {card.title}
                                </h3>
                                <span
                                    style={{
                                        fontSize: 12,
                                        fontWeight: 600,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.1em",
                                        color:
                                            card.status === "Disponible"
                                                ? "#226c3a"
                                                : "#7a6c5e",
                                        background:
                                            card.status === "Disponible"
                                                ? "rgba(34, 108, 58, 0.12)"
                                                : "rgba(122, 108, 94, 0.15)",
                                        padding: "4px 8px",
                                        borderRadius: 999,
                                    }}
                                >
                                    {card.status}
                                </span>
                            </div>
                            <p style={{ margin: 0, color: "#4b3f33" }}>
                                {card.description}
                            </p>
                            {card.status === "Disponible" && card.link && (
                                <Link
                                    to={card.link}
                                    style={{
                                        color: "#1f1b16",
                                        fontWeight: 600,
                                        textDecoration: "none",
                                    }}
                                >
                                    Ouvrir →
                                </Link>
                            )}
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}
