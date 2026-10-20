import { shortAddress } from "@stellar-scaffold/app-lib"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useWallet } from "../hooks/useWallet"
import { CopaEstrella, Flecha } from "./Iconos"
import { type Firma } from "./types"

const POR_PAGINA = 4
const DURACION_GIRO = 750

type Pagina =
	| { tipo: "portadilla" }
	| { tipo: "firmas"; desde: number; firmas: Firma[] }
	| { tipo: "vacia" }

const fecha = new Intl.DateTimeFormat("es-CR", {
	day: "numeric",
	month: "short",
	year: "numeric",
	hour: "2-digit",
	minute: "2-digit",
})

const useConsulta = (consulta: string) => {
	const [coincide, setCoincide] = useState(
		() => window.matchMedia(consulta).matches,
	)
	useEffect(() => {
		const mq = window.matchMedia(consulta)
		const cambio = () => setCoincide(mq.matches)
		mq.addEventListener("change", cambio)
		return () => mq.removeEventListener("change", cambio)
	}, [consulta])
	return coincide
}

function armarPaginas(firmas: Firma[], dobles: boolean): Pagina[] {
	const paginas: Pagina[] = [{ tipo: "portadilla" }]
	for (let i = 0; i < firmas.length; i += POR_PAGINA) {
		paginas.push({
			tipo: "firmas",
			desde: i,
			firmas: firmas.slice(i, i + POR_PAGINA),
		})
	}
	if (firmas.length === 0)
		paginas.push({ tipo: "firmas", desde: 0, firmas: [] })
	if (dobles && paginas.length % 2 === 1) paginas.push({ tipo: "vacia" })
	return paginas
}

const Entrada = ({
	firma,
	numero,
	esMia,
}: {
	firma: Firma
	numero: number
	esMia: boolean
}) => (
	<li className={`entrada ${esMia ? "entrada--mia" : ""}`}>
		<span className="entrada-numero">Nº {String(numero).padStart(2, "0")}</span>
		<p className="entrada-mensaje">“{firma.mensaje}”</p>
		<p className="entrada-autor">
			—{" "}
			<a
				href={`https://stellar.expert/explorer/testnet/account/${firma.autor}`}
				target="_blank"
				rel="noreferrer"
				title={firma.autor}
			>
				{shortAddress(firma.autor)}
			</a>
			{esMia && <span className="entrada-tuya">tu firma</span>}
		</p>
		<time className="entrada-fecha">
			{fecha.format(new Date(Number(firma.timestamp) * 1000))} · ledger{" "}
			{firma.ledger}
		</time>
	</li>
)

const ContenidoPagina = ({
	pagina,
	numero,
	total,
	miDireccion,
}: {
	pagina: Pagina
	numero: number
	total: number
	miDireccion?: string
}) => {
	let contenido: React.ReactNode = null
	if (pagina.tipo === "portadilla") {
		contenido = (
			<div className="portadilla">
				<CopaEstrella />
				<p className="portadilla-casa">Este libro pertenece a la</p>
				<p className="portadilla-titulo">Cripto Cantina</p>
				<hr />
				<p className="portadilla-nota">
					{total === 0
						? "Aún nadie ha firmado."
						: `${total} ${total === 1 ? "firma guardada" : "firmas guardadas"} en Soroban · Testnet`}
				</p>
				<p className="portadilla-pie">Pasa la página →</p>
			</div>
		)
	} else if (pagina.tipo === "firmas" && pagina.firmas.length === 0) {
		contenido = (
			<div className="pagina-vacia">
				<p>Todavía no hay firmas.</p>
				<p>¡Sé la primera persona en firmar el libro!</p>
				<a href="#firmar" className="btn btn-vino">
					Firmar ahora
				</a>
			</div>
		)
	} else if (pagina.tipo === "firmas") {
		contenido = (
			<ol className="entradas">
				{pagina.firmas.map((f, i) => (
					<Entrada
						key={f.autor}
						firma={f}
						numero={pagina.desde + i + 1}
						esMia={f.autor === miDireccion}
					/>
				))}
			</ol>
		)
	} else {
		contenido = (
			<div className="pagina-final">Fin de las firmas · por ahora</div>
		)
	}
	return (
		<>
			{contenido}
			<span className="pagina-numero">{numero}</span>
		</>
	)
}

interface Giro {
	direccion: 1 | -1
	desde: number
}

export const Libro = ({
	firmas,
	cargando,
	error,
}: {
	firmas: Firma[]
	cargando: boolean
	error: unknown
}) => {
	const { address } = useWallet()
	const dobles = !useConsulta("(max-width: 820px)")
	const sinMovimiento = useConsulta("(prefers-reduced-motion: reduce)")
	const [abierto, setAbierto] = useState(false)
	const [abriendo, setAbriendo] = useState(false)
	const [vista, setVista] = useState(0)
	const [giro, setGiro] = useState<Giro | null>(null)

	const paginas = useMemo(() => armarPaginas(firmas, dobles), [firmas, dobles])
	const paso = dobles ? 2 : 1
	const vistas = Math.ceil(paginas.length / paso)
	const actual = Math.min(vista, vistas - 1)

	useEffect(() => setVista(0), [dobles])

	const pasar = useCallback(
		(direccion: 1 | -1) => {
			const destino = actual + direccion
			if (giro || destino < 0 || destino >= vistas) return
			if (sinMovimiento) {
				setVista(destino)
				return
			}
			setGiro({ direccion, desde: actual })
			window.setTimeout(() => {
				setVista(destino)
				setGiro(null)
			}, DURACION_GIRO)
		},
		[actual, giro, vistas, sinMovimiento],
	)

	const abrir = () => {
		if (sinMovimiento) return setAbierto(true)
		setAbriendo(true)
		window.setTimeout(() => {
			setAbierto(true)
			setAbriendo(false)
		}, 700)
	}

	const irAMiFirma = () => {
		const indice = firmas.findIndex((f) => f.autor === address)
		if (indice < 0) return
		const pagina = 1 + Math.floor(indice / POR_PAGINA)
		setVista(Math.floor(pagina / paso))
	}

	useEffect(() => {
		if (!abierto) return
		const tecla = (e: KeyboardEvent) => {
			if (e.key === "ArrowRight") pasar(1)
			if (e.key === "ArrowLeft") pasar(-1)
		}
		window.addEventListener("keydown", tecla)
		return () => window.removeEventListener("keydown", tecla)
	}, [abierto, pasar])

	const pagina = (indice: number, clase: string) =>
		paginas[indice] ? (
			<div className={`pagina ${clase}`}>
				<ContenidoPagina
					pagina={paginas[indice]}
					numero={indice + 1}
					total={firmas.length}
					miDireccion={address}
				/>
			</div>
		) : (
			<div className={`pagina ${clase} pagina--sin`} />
		)

	const renderDoble = () => {
		const base = (giro ? giro.desde : actual) * 2
		if (!giro) {
			return (
				<>
					{pagina(base, "pagina-izq")}
					{pagina(base + 1, "pagina-der")}
				</>
			)
		}
		if (giro.direccion === 1) {
			return (
				<>
					{pagina(base, "pagina-izq")}
					{pagina(base + 3, "pagina-der")}
					<div className="hoja hoja--adelante">
						{pagina(base + 1, "hoja-frente")}
						{pagina(base + 2, "hoja-dorso")}
					</div>
				</>
			)
		}
		return (
			<>
				{pagina(base - 2, "pagina-izq")}
				{pagina(base + 1, "pagina-der")}
				<div className="hoja hoja--atras">
					{pagina(base, "hoja-frente")}
					{pagina(base - 1, "hoja-dorso")}
				</div>
			</>
		)
	}

	const renderSimple = () => {
		const indice = giro ? giro.desde + giro.direccion : actual
		return (
			<div
				key={indice}
				className={`pagina-unica ${giro ? `pasa-${giro.direccion === 1 ? "adelante" : "atras"}` : ""}`}
			>
				{pagina(indice, "pagina-der")}
			</div>
		)
	}

	const miIndice = firmas.findIndex((f) => f.autor === address)

	return (
		<section className="seccion-libro" id="libro">
			<p className="antetitulo">El libro</p>
			<h2 className="titulo-seccion">Todas las firmas de la noche</h2>
			<p className="seccion-lead">
				Cada página se lee directo del contrato con <code>listar()</code> y se
				actualiza sola cuando alguien firma.
			</p>

			{!abierto ? (
				<div className={`libro-cerrado ${abriendo ? "abriendo" : ""}`}>
					<div className="tapa">
						<div className="tapa-marco">
							<CopaEstrella />
							<p className="tapa-casa">Cantina de noche</p>
							<p className="tapa-titulo">
								<em>El libro</em>
								<em>de visitas</em>
								<span>de la</span>
								<span>Cripto Cantina</span>
							</p>
							<p className="tapa-adorno">◆</p>
						</div>
					</div>
					<button
						className="btn btn-pergamino btn-ancho"
						onClick={abrir}
						disabled={abriendo}
					>
						Abrir el libro
					</button>
					<p className="libro-nota">
						{cargando
							? "Leyendo el contrato…"
							: error
								? "No se pudo leer el contrato en este momento."
								: `${firmas.length} ${firmas.length === 1 ? "firma" : "firmas"} · cada dirección deja una sola nota en testnet.`}
					</p>
				</div>
			) : (
				<div className="libro-abierto">
					<div className={`libro ${dobles ? "libro--doble" : "libro--simple"}`}>
						{dobles ? renderDoble() : renderSimple()}
						{dobles && <div className="lomo" aria-hidden="true" />}
					</div>
					<div className="libro-controles">
						<button
							className="btn btn-fantasma btn-redondo"
							onClick={() => pasar(-1)}
							disabled={actual === 0 || !!giro}
							aria-label="Página anterior"
						>
							<Flecha direccion="izq" />
						</button>
						<span className="libro-pagina">
							{dobles ? "Páginas" : "Página"} {actual * paso + 1}
							{dobles
								? `–${Math.min(actual * paso + 2, paginas.length)}`
								: ""}{" "}
							de {paginas.length}
						</span>
						<button
							className="btn btn-fantasma btn-redondo"
							onClick={() => pasar(1)}
							disabled={actual >= vistas - 1 || !!giro}
							aria-label="Página siguiente"
						>
							<Flecha direccion="der" />
						</button>
					</div>
					<div className="libro-extras">
						{miIndice >= 0 && (
							<button className="btn btn-chico" onClick={irAMiFirma}>
								Ir a mi firma
							</button>
						)}
						<button className="btn btn-chico" onClick={() => setAbierto(false)}>
							Cerrar el libro
						</button>
					</div>
				</div>
			)}
		</section>
	)
}
