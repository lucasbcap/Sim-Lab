import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, NavLink, useParams } from "react-router-dom";
import sim1 from "../wiki/sim1.md?raw";
import sim2 from "../wiki/sim2.md?raw";

const wikiEntries: Record<string, { title: string; content: string }> = {
    sim1: { title: "Simulation fluide (particules)", content: sim1 },
    sim2: { title: "Simulation 2 (a definir)", content: sim2 },
};

export default function WikiPage() {
    const { slug } = useParams();
    const entry = slug ? wikiEntries[slug] : undefined;
    const [navOpen, setNavOpen] = useState(false);

    if (!entry) {
        return (
            <div
                style={{
                    padding: "96px 24px",
                    fontFamily: "\"Plus Jakarta Sans\", sans-serif",
                }}
            >
                <h1 style={{ marginTop: 0 }}>Wiki introuvable</h1>
                <p>Cette page n'existe pas encore.</p>
                <Link to="/wiki/sim1">Voir la page fluide</Link>
            </div>
        );
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f7f4ee",
                fontFamily: "\"Plus Jakarta Sans\", sans-serif",
                color: "#1f1b16",
                display: "grid",
                gridTemplateColumns: navOpen ? "260px 1fr" : "0 1fr",
                transition: "grid-template-columns 0.2s ease",
                paddingTop: 56,
            }}
        >
            <aside
                style={{
                    borderRight: "1px solid #e3dbd0",
                    background: "#fbf9f4",
                    overflow: "hidden",
                    position: "sticky",
                    top: 56,
                    height: "calc(100vh - 56px)",
                    transition: "width 0.2s ease",
                }}
            >
                <div
                    style={{
                        padding: "24px 20px",
                        display: "grid",
                        gap: 16,
                    }}
                >
                    <strong style={{ letterSpacing: "0.08em" }}>SIM-LAB WIKI</strong>
                    <nav style={{ display: "grid", gap: 10 }}>
                        <NavLink
                            to="/wiki/sim1"
                            style={({ isActive }) => ({
                                textDecoration: "none",
                                color: isActive ? "#1f1b16" : "#6a5d50",
                                fontWeight: isActive ? 600 : 500,
                            })}
                        >
                            Simulation fluide
                        </NavLink>
                        <NavLink
                            to="/wiki/sim2"
                            style={({ isActive }) => ({
                                textDecoration: "none",
                                color: isActive ? "#1f1b16" : "#6a5d50",
                                fontWeight: isActive ? 600 : 500,
                            })}
                        >
                            Simulation 2
                        </NavLink>
                    </nav>
                </div>
            </aside>
            <section
                style={{
                    padding: "32px 24px 64px",
                }}
            >
                <div style={{ maxWidth: 860, margin: "0 auto" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 16,
                            marginBottom: 16,
                        }}
                    >
                        <Link
                            to="/"
                            style={{
                                textDecoration: "none",
                                color: "#6a5d50",
                                fontWeight: 600,
                            }}
                        >
                            ← Retour
                        </Link>
                        <button
                            type="button"
                            onClick={() => setNavOpen((value) => !value)}
                            style={{
                                border: "1px solid #d8cec0",
                                background: "#fff",
                                padding: "8px 12px",
                                borderRadius: 10,
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                        >
                            {navOpen ? "Masquer le plan" : "Afficher le plan"}
                        </button>
                    </div>
                    <h1 style={{ marginTop: 0 }}>{entry.title}</h1>
                    <div
                        style={{
                            marginTop: 24,
                            background: "white",
                            borderRadius: 16,
                            padding: "28px 32px",
                            border: "1px solid #e3dbd0",
                            boxShadow: "0 18px 32px rgba(31, 27, 22, 0.08)",
                        }}
                    >
                        <ReactMarkdown>{entry.content}</ReactMarkdown>
                    </div>
                </div>
            </section>
        </div>
    );
}
