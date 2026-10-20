import { type Firma } from "./types"

export const Portada = ({
	firmas,
	cargando,
}: {
	firmas: Firma[]
	cargando: boolean
}) => (
	<section className="portada" id="inicio">
		<p className="antetitulo">Stellar Sessions · Challenge #1</p>
		<h1>
			<em>El libro de visitas de la</em>
			<span>Cripto Cantina</span>
		</h1>
		<p className="portada-lead">
			Conecta tu wallet, deja un mensaje y fírmalo en testnet. Cada dirección
			escribe una sola vez. El libro muestra todas las firmas.
		</p>
		<div className="portada-botones">
			<a href="#firmar" className="btn btn-vino btn-grande">
				Firmar el libro
			</a>
			<a href="#libro" className="btn btn-fantasma btn-grande">
				Leer las firmas
			</a>
		</div>
		<dl className="portada-datos">
			<div>
				<dt>{cargando ? "…" : firmas.length}</dt>
				<dd>
					{firmas.length === 1 ? "firma en la barra" : "firmas en la barra"}
				</dd>
			</div>
			<div>
				<dt>1</dt>
				<dd>firma por dirección</dd>
			</div>
			<div>
				<dt>∞</dt>
				<dd>guardada en el contrato</dd>
			</div>
		</dl>
	</section>
)
