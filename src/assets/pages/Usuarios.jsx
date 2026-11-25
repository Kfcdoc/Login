import { useParams } from 'react-router-dom'
const Usuario = () => {
    const { nombre } = useParams()
    return (
        <div>
            <h1>Usuario</h1>
            <p>Nombre: {nombre}</p>
        </div>
    )
}

export default Usuario
