import { useContext } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Contexto from "../../context/Contexto";

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useContext(Contexto);
    const navegacion = useNavigate();

    const validacion = {
        nombre: {
            required: "El campo nombre es requerido!"
        },
        email: {
            required: "El campo correo es requerido!"
        },
        password: {
            required: "El campo contraseña es requerido!"
        }
    };

    const onSubmit = (data) => {
        const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios_registrados") || "[]");
        const actualizados = [
            ...usuariosGuardados.filter((u) => u.email !== data.email),
            { nombre: data.nombre, email: data.email }
        ];
        localStorage.setItem("usuarios_registrados", JSON.stringify(actualizados));

        login({ nombre: data.nombre, email: data.email });
        Swal.fire({
            title: `¡Bienvenido, ${data.nombre}!`,
            text: "Tu cuenta ha sido registrada correctamente.",
            icon: "success",
            confirmButtonText: "Aceptar"
        }).then(() => {
            navegacion("/", { replace: true });
        });
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100 py-4">
            <div className="card shadow border-0 rounded-4 p-4" style={{ maxWidth: "400px", width: "100%" }}>
                <h1 className="h2 fw-bold text-center mb-1">Crear Cuenta</h1>
                <p className="text-muted text-center small mb-4">Completa el formulario para registrarte</p>

                <form onSubmit={handleSubmit(onSubmit)} className="text-start">
                    <div className="mb-3">
                        <label htmlFor="nombre" className="form-label fw-medium">Nombre</label>
                        {errors.nombre && <p className="text-danger small mb-1">{errors.nombre.message}</p>}
                        <input
                            id="nombre"
                            type="text"
                            className="form-control"
                            placeholder="Tu nombre"
                            {...register("nombre", validacion.nombre)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label fw-medium">Correo</label>
                        {errors.email && <p className="text-danger small mb-1">{errors.email.message}</p>}
                        <input
                            id="email"
                            type="email"
                            className="form-control"
                            placeholder="Isay@gmail.com"
                            {...register("email", validacion.email)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="form-label fw-medium">Contraseña</label>
                        {errors.password && <p className="text-danger small mb-1">{errors.password.message}</p>}
                        <input
                            id="password"
                            type="password"
                            className="form-control"
                            placeholder="12345"
                            {...register("password", validacion.password)}
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100 mb-3">
                        Registrarse
                    </button>
                </form>

                <div className="text-center">
                    <p className="small text-muted mb-2">
                        ¿Ya tienes cuenta? <NavLink to="/login">Inicia sesión</NavLink>
                    </p>
                    <NavLink to="/" className="btn btn-outline-secondary btn-sm">
                        Inicio
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default Register;
