import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registro from "./pages/Register";
import Usuario from "./pages/Usuarios";
import Error from "./pages/Error";
import RutasPrivadas from "./routes/RutasPrivadas";
import RutasPublicas from "./routes/RutasPublicas";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RutasPrivadas><Home /></RutasPrivadas>} />
                <Route path="/personaje/:id" element={<RutasPrivadas><Home /></RutasPrivadas>} />
                <Route path="/login" element={<RutasPublicas><Login /></RutasPublicas>} />
                <Route path="/registro" element={<RutasPublicas><Registro /></RutasPublicas>} />
                <Route path="/usuario/:nombre" element={<RutasPrivadas><Usuario /></RutasPrivadas>} />
                <Route path="*" element={<Error />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
