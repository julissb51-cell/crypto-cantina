import { labPrefix } from "@stellar-scaffold/app-lib"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Pluma } from "./Iconos"
import { contractId } from "./useLibro"

export const Pasos = () => (
	<section className="seccion-pasos" id="barra">
		<p className="antetitulo">La barra</p>
		<h2 className="titulo-seccion">Tres pasos y tu nombre queda en el libro</h2>
		<p className="seccion-lead">
			Sin registro, sin correo. Solo una wallet Stellar en testnet y una frase
			corta que valga la pena recordar.
		</p>
		<div className="pasos">
			<article className="paso paso--pergamino">
				<span className="paso-numero">01</span>
				<h3>Conecta tu wallet</h3>
				<p>
					Freighter u otra billetera Stellar. La dirección es tu identidad en la
					cantina.
				</p>
			</article>
			<article className="paso paso--madera">
				<span className="paso-numero">02</span>
				<h3>Escribe una línea</h3>
				<p>
					Hasta 80 caracteres. Un brindis, una broma, un recuerdo de la noche.
				</p>
			</article>
		</div>
		<blockquote className="cita">
			<p className="antetitulo">En la barra</p>
			<p>“Si vuelves, el libro ya tiene tu nombre.”</p>
		</blockquote>
		<article className="paso paso--vino">
			<div>
				<span className="paso-numero">03</span>
				<h3>Firma y sella</h3>
				<p>
					La wallet autoriza, el contrato Soroban guarda tu mensaje y el ledger
					lo deja a la vista de todos.
				</p>
			</div>
			<span className="paso-icono">
				<Pluma />
			</span>
		</article>
	</section>
)

const FUNCIONES = [
	[
		"firmar(autor, mensaje)",
		"Exige autor.require_auth(), una firma por dirección y emite el evento firma.",
	],
	["listar()", "Devuelve todas las firmas: autor, mensaje, ledger y fecha."],
	["total()", "Cantidad de firmas en el libro."],
	["ya_firmo(autor)", "Indica si una dirección ya firmó."],
]

export const Contrato = () => {
	const [copiado, setCopiado] = useState(false)
	const copiar = () => {
		void navigator.clipboard?.writeText(contractId).then(() => {
			setCopiado(true)
			window.setTimeout(() => setCopiado(false), 1600)
		})
	}
	return (
		<section className="seccion-contrato" id="contrato">
			<p className="antetitulo">Contrato</p>
			<h2 className="titulo-seccion">Lo que hay detrás de la barra</h2>
			<div className="contrato-id">
				<span>ID en testnet</span>
				<code>{contractId}</code>
				<button className="btn btn-chico" onClick={copiar}>
					{copiado ? "¡Copiado!" : "Copiar"}
				</button>
			</div>
			<ul className="funciones">
				{FUNCIONES.map(([firma, desc]) => (
					<li key={firma}>
						<code>{firma}</code>
						<p>{desc}</p>
					</li>
				))}
			</ul>
			<div className="contrato-enlaces">
				<a
					className="btn btn-fantasma"
					href={`https://stellar.expert/explorer/testnet/contract/${contractId}`}
					target="_blank"
					rel="noreferrer"
				>
					Ver en Stellar Expert
				</a>
				<a
					className="btn btn-fantasma"
					href={labPrefix()}
					target="_blank"
					rel="noreferrer"
				>
					Stellar Lab
				</a>
				<Link className="btn btn-fantasma" to="/debug/libro_visitas">
					Explorador del contrato
				</Link>
			</div>
		</section>
	)
}

export const Pie = () => (
	<footer className="pie">
		<p>
			Hecho con{" "}
			<a href="https://scaffoldstellar.org" target="_blank" rel="noreferrer">
				Scaffold Stellar
			</a>{" "}
			para Stellar Sessions · Challenge #1
		</p>
		<p>
			<a
				href="https://github.com/julissb51-cell/crypto-cantina"
				target="_blank"
				rel="noreferrer"
			>
				GitHub
			</a>
			{" · "}Juliana Sanabria Bravo
		</p>
	</footer>
)
