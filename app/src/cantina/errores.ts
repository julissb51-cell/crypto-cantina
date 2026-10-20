// Códigos de `Error` definidos en contracts/libro-visitas/src/lib.rs
const MENSAJES: Record<string, string> = {
	YaFirmo:
		"Esta dirección ya firmó el libro. Solo se permite una firma por dirección.",
	MensajeVacio: "El mensaje no puede estar vacío.",
	MensajeLargo: "El mensaje es demasiado largo.",
}
const CODIGOS = ["", "YaFirmo", "MensajeVacio", "MensajeLargo"]

/** Traduce un error del contrato, de la billetera o de la red a un texto en español. */
export function explicarError(error: unknown): string {
	const texto =
		error instanceof Error
			? error.message
			: typeof error === "object" && error !== null && "message" in error
				? String((error as { message: unknown }).message)
				: String(error)

	// El cliente generado devuelve el nombre del error; la red, el código numérico
	if (MENSAJES[texto]) return MENSAJES[texto]
	const codigo = /Error\(Contract, #(\d+)\)/.exec(texto)?.[1]
	const nombre = codigo ? CODIGOS[Number(codigo)] : undefined
	if (nombre) return MENSAJES[nombre]
	if (/reject|declin|cancel/i.test(texto))
		return "Cancelaste la firma en tu billetera."
	if (/account not found|does not exist|404/i.test(texto))
		return "Tu cuenta no existe en testnet todavía. Fondéala con Friendbot y vuelve a intentarlo."
	return "No se pudo firmar el libro. Revisa que tu billetera esté en Testnet e inténtalo de nuevo."
}
