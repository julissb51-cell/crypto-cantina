import { libroVisitas } from "@stellar-scaffold/app-lib/clients"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"
import { useSubscription } from "../hooks/useSubscription"
import { type Firma } from "./types"

export const contractId = libroVisitas.options.contractId

const CLAVE = ["libro-visitas", "listar"]

/** Lee todas las firmas con `listar()` y se actualiza con los eventos `firma`. */
export function useLibro() {
	const queryClient = useQueryClient()

	const consulta = useQuery({
		queryKey: CLAVE,
		queryFn: async (): Promise<Firma[]> => {
			const tx = await libroVisitas.listar()
			return tx.result as Firma[]
		},
		refetchInterval: 30_000,
	})

	const recargar = useCallback(
		() => queryClient.invalidateQueries({ queryKey: CLAVE }),
		[queryClient],
	)

	useSubscription(contractId, "firma", recargar)

	return {
		firmas: consulta.data ?? [],
		cargando: consulta.isPending,
		error: consulta.error,
		recargar,
	}
}
