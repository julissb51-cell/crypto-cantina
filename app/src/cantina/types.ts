/** Una firma tal como la devuelve `listar()` del contrato libro-visitas. */
export interface Firma {
	autor: string
	mensaje: string
	ledger: number
	timestamp: bigint
}

/** Largo máximo que el frontend permite escribir (el contrato acepta hasta 320 bytes). */
export const MAX_CARACTERES = 80
