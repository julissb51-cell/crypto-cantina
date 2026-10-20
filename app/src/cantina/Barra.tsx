import {
	connectWallet,
	fundAccount,
	networkStatus,
	profileModal,
	shortAddress,
} from "@stellar-scaffold/app-lib"
import { useTransition } from "react"
import { useNotification } from "../hooks/useNotification"
import { useWallet } from "../hooks/useWallet"
import { Barril } from "./Iconos"

/** Botón de billetera con Stellar Wallets Kit (Freighter, xBull, Albedo, Lobstr…). */
export const BotonBilletera = () => {
	const { address, isPending, balances, updateBalances } = useWallet()
	const { addNotification } = useNotification()
	const [fondeando, startTransition] = useTransition()

	if (!address) {
		return (
			<button
				className="btn btn-contorno"
				onClick={() => void connectWallet()}
				disabled={isPending}
			>
				{isPending ? "Cargando…" : "Conectar billetera"}
			</button>
		)
	}

	const sinFondos = !balances?.xlm
	const fondear = () =>
		startTransition(async () => {
			const { ok } = await fundAccount(address)
			if (ok) await updateBalances()
			addNotification(
				ok
					? "Cuenta fondeada con XLM de prueba."
					: "Friendbot no pudo fondear la cuenta.",
				ok ? "success" : "error",
			)
		})

	return (
		<div className="billetera">
			{sinFondos ? (
				<button
					className="btn btn-chico"
					onClick={fondear}
					disabled={fondeando}
				>
					{fondeando ? "Fondeando…" : "Fondear con Friendbot"}
				</button>
			) : (
				<span className="billetera-saldo">
					{Number(balances.xlm?.balance ?? 0).toFixed(2)} XLM
				</span>
			)}
			<button
				className="btn btn-contorno"
				onClick={() => void profileModal()}
				title={address}
			>
				{shortAddress(address)}
			</button>
		</div>
	)
}

const PildoraRed = () => {
	const { address, networkPassphrase } = useWallet()
	const { appNetwork, state, title } = networkStatus(address, networkPassphrase)
	return (
		<span className={`pildora-red pildora-red--${state}`} title={title}>
			{state === "mismatch" ? "Red equivocada" : appNetwork}
		</span>
	)
}

export const Barra = () => (
	<header className="barra">
		<a href="#inicio" className="barra-logo">
			<Barril />
			<span>Cripto Cantina</span>
		</a>
		<nav className="barra-enlaces">
			<a href="#barra">La barra</a>
			<a href="#libro">El libro</a>
			<a href="#contrato">Contrato</a>
		</nav>
		<div className="barra-acciones">
			<PildoraRed />
			<BotonBilletera />
		</div>
	</header>
)
