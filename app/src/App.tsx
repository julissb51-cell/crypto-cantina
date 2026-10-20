import { Route, Routes } from "react-router-dom"
import { Barra } from "./cantina/Barra"
import { Escena } from "./cantina/Escena"
import { FormularioFirma } from "./cantina/FormularioFirma"
import { Libro } from "./cantina/Libro"
import { Portada } from "./cantina/Portada"
import { Contrato, Pasos, Pie } from "./cantina/Secciones"
import { useLibro } from "./cantina/useLibro"
import Debug from "./pages/Debug"

const Cantina = () => {
	const { firmas, cargando, error, recargar } = useLibro()
	return (
		<>
			<Portada firmas={firmas} cargando={cargando} />
			<FormularioFirma firmas={firmas} alFirmar={() => void recargar()} />
			<Pasos />
			<Libro firmas={firmas} cargando={cargando} error={error} />
			<Contrato />
		</>
	)
}

function App() {
	return (
		<div className="cantina">
			<Barra />
			<Escena />
			<main className="contenido">
				<Routes>
					<Route path="/" element={<Cantina />} />
					<Route path="/debug" element={<Debug />} />
					<Route path="/debug/:contractName" element={<Debug />} />
				</Routes>
			</main>
			<Pie />
		</div>
	)
}

export default App
