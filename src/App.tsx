import { Link, NavLink, Outlet } from "react-router-dom";

export default function App() {
    return (
        <div style={{ minHeight: "100vh", background: "#f7f4ee" }}>
            <header
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 56,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 24px",
                    background: "rgba(252, 249, 244, 0.95)",
                    borderBottom: "1px solid #e3dbd0",
                    zIndex: 20,
                    fontFamily: "\"Plus Jakarta Sans\", sans-serif",
                }}
            >
                <Link
                    to="/"
                    style={{
                        textDecoration: "none",
                        color: "#1f1b16",
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                    }}
                >
                    SIM-LAB
                </Link>
                <nav
                    style={{
                        display: "flex",
                        gap: 16,
                        alignItems: "center",
                    }}
                >
                    <NavLink
                        to="/"
                        end
                        style={({ isActive }) => ({
                            textDecoration: "none",
                            color: isActive ? "#1f1b16" : "#6a5d50",
                            fontWeight: isActive ? 600 : 500,
                        })}
                    >
                        Accueil
                    </NavLink>
                    <NavLink
                        to="/fluide"
                        style={({ isActive }) => ({
                            textDecoration: "none",
                            color: isActive ? "#1f1b16" : "#6a5d50",
                            fontWeight: isActive ? 600 : 500,
                        })}
                    >
                        Fluide
                    </NavLink>
                    <NavLink
                        to="/pendule"
                        style={({ isActive }) => ({
                            textDecoration: "none",
                            color: isActive ? "#1f1b16" : "#6a5d50",
                            fontWeight: isActive ? 600 : 500,
                        })}
                    >
                        Pendule
                    </NavLink>
                    <NavLink
                        to="/wiki/sim1"
                        style={({ isActive }) => ({
                            textDecoration: "none",
                            color: isActive ? "#1f1b16" : "#6a5d50",
                            fontWeight: isActive ? 600 : 500,
                        })}
                    >
                        Wiki
                    </NavLink>
                </nav>
            </header>
            <main style={{ paddingTop: 56 }}>
                <Outlet />
            </main>
        </div>
    );
}
