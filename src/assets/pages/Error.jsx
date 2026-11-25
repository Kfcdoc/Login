import { NavLink } from "react-router-dom";

const Error = () => {
    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100 py-4">
            <div className="card shadow border-0 rounded-4 p-4 text-center" style={{ maxWidth: "400px", width: "100%" }}>
                <h1 className="display-5 fw-bold text-danger mb-2">404</h1>
                <p className="text-muted mb-4">Página no encontrada.</p>
                <NavLink to="/" className="btn btn-primary">
                    Volver al inicio
                </NavLink>
            </div>
        </div>
    );
};

export default Error;
