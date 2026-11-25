import { useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Contexto from "../../context/Contexto";

const Home = () => {
    const { logged, usuario, cerrar_sesion } = useContext(Contexto);
    const { id } = useParams();
    const personajeId = id || 1;
    const [personaje, setPersonaje] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(false);

    const nombreUsuario =
        typeof usuario === "string"
            ? usuario
            : usuario?.nombre || usuario?.usuario || usuario?.email;

    const API = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetch(`${API}/${personajeId}`)
            .then((res) => {
                if (!res.ok) throw new Error("Error al cargar");
                return res.json();
            })
            .then((data) => {
                setPersonaje(data);
                setError(false);
            })
            .catch(() => {
                setPersonaje(null);
                setError(true);
            })
            .finally(() => setCargando(false));
    }, [API, personajeId]);

    const logout = () => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Se cerrará tu sesión actual.",
            icon: "warning",
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                cerrar_sesion();
            }
        });
    };
    

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100 py-4">
            <div className="card shadow border-0 rounded-4 p-4 text-center" style={{ maxWidth: "420px", width: "100%" }}>
                {logged && nombreUsuario ? (
                    <>
                        <h1 className="h2 fw-bold mb-2">Bienvenido, {nombreUsuario}</h1>
                        <p className="text-muted mb-4">Sesión iniciada</p>
                        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mb-4">
                            <button type="button" onClick={logout} className="btn btn-outline-danger px-4">
                                Cerrar Sesión
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="h2 fw-bold mb-2">Bienvenido</h1>
                        <p className="text-muted mb-4">Registra o inicia sesion xD</p>

                        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mb-4">
                            <NavLink to="/login" className="btn btn-primary px-4">
                                Iniciar Sesión
                            </NavLink>
                            <NavLink to="/registro" className="btn btn-outline-success px-4">
                                Registro
                            </NavLink>
                        </div>
                    </>
                )}

                <hr className="my-3" />

                <h2 className="h6 text-uppercase text-muted mb-3">Personaje destacado</h2>

                {cargando && <p className="text-muted mb-0">Cargando personaje...</p>}
                {error && <p className="text-danger mb-0">No se pudo cargar el personaje.</p>}

                {personaje && (
                    <div className="card border-0 bg-body-tertiary rounded-3 p-3">
                        <img
                            src={personaje.image}
                            alt={personaje.name}
                            className="rounded-circle mx-auto mb-3 shadow-sm"
                            style={{ width: "120px", height: "120px", objectFit: "cover" }}
                        />
                        <h3 className="h5 fw-semibold mb-1">#{personaje.id} - {personaje.name}</h3>
                        <p className="text-muted small mb-0">
                            {personaje.species} • {personaje.status}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
