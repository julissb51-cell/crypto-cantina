import { connectWallet } from "@stellar-scaffold/app-lib"
import { libroVisitas } from "@stellar-scaffold/app-lib/clients"
import { useState } from "react"
import { useNotification } from "../hooks/useNotification"
import { useWallet } from "../hooks/useWallet"
import { explicarError } from "./errores"
import { MAX_CARACTERES, type Firma } from "./types"

interface Props {
	firmas: Firma[]
	alFirmar: () => void
}

export const FormularioFirma = ({ firmas, alFirmar }: Props) => {
	const { address, signTransaction, updateBalances } = useWallet()
	const { addNotification } = useNotification()
	const [mensaje, setMensaje] = useState("")
	const [enviando, setEnviando] = useState(false)
	const [sellado, setSellado] = useState(false)

	const largo = [...mensaje].length
	const miFirma = address ? firmas.find((f) => f.autor === address) : undefined

	const firmar = async (evento: React.FormEvent) => {
		evento.preventDefault()
		if (!address) {
			void connectWallet()
			return
		}
		const texto = mensaje.trim()
		if (!texto) return

		setEnviando(true)
		try {
			const tx = await libroVisitas.firmar(
				{ autor: address, mensaje: texto },
				{ publicKey: address },
			)
			// La simulación ya detecta errores del contrato (firma repetida, mensaje inválido)
			if (tx.result.isErr()) throw tx.result.unwrapErr()
			const { result } = await tx.signAndSend({ signTransaction })
			if (result.isErr()) throw result.unwrapErr()
			setSellado(true)
			setMensaje("")
			addNotification(
				`¡Firmado! Eres la firma Nº ${result.unwrap()} del libro.`,
				"success",
			)
			alFirmar()
			void updateBalances()
		} catch (e) {
			console.error(e)
			addNotification(explicarError(e), "error")
		} finally {
			setEnviando(false)
		}
	}

	return (
		<section className="hoja-firma" id="firmar">
			<span className={`sello ${sellado || miFirma ? "sello--puesto" : ""}`}>
				sello
			</span>
			<h2>Deja tu firma</h2>
			<p>
				Una dirección, un mensaje. La wallet lo autoriza y el contrato lo guarda
				para siempre en esta instancia.
			</p>

			{miFirma ? (
				<div className="ya-firmaste">
					<p className="ya-firmaste-titulo">Ya firmaste el libro</p>
					<blockquote>“{miFirma.mensaje}”</blockquote>
					<a href="#libro" className="btn btn-vino btn-ancho">
						Ver mi firma en el libro
					</a>
				</div>
			) : (
				<form onSubmit={(e) => void firmar(e)}>
					<label className="sr-only" htmlFor="mensaje">
						Tu mensaje
					</label>
					<input
						id="mensaje"
						className="hoja-firma-input"
						placeholder="La primera ronda va por la casa."
						value={mensaje}
						maxLength={MAX_CARACTERES}
						onChange={(e) =>
							setMensaje([...e.target.value].slice(0, MAX_CARACTERES).join(""))
						}
						disabled={enviando}
						autoComplete="off"
					/>
					<p className="contador">
						{largo}/{MAX_CARACTERES}
					</p>
					<button
						type="submit"
						className="btn btn-vino btn-ancho"
						disabled={enviando || (!!address && !mensaje.trim())}
					>
						{!address
							? "Conecta tu wallet para firmar"
							: enviando
								? "Esperando tu billetera…"
								: "Firmar y sellar"}
					</button>
				</form>
			)}
		</section>
	)
}
