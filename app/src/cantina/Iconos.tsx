/** Barril de la cantina, usado como logo. */
export const Barril = ({ size = 44 }: { size?: number }) => (
	<svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
		<defs>
			<linearGradient id="barril-madera" x1="0" x2="1">
				<stop offset="0" stopColor="#5a2328" />
				<stop offset="0.5" stopColor="#8a3d43" />
				<stop offset="1" stopColor="#5a2328" />
			</linearGradient>
		</defs>
		<path
			d="M14 6h36c4 8 6 16 6 26s-2 18-6 26H14c-4-8-6-16-6-26s2-18 6-26z"
			fill="url(#barril-madera)"
		/>
		<path d="M10 17h44M8 32h48M10 47h44" stroke="#efe3cc" strokeWidth="5" />
		<path
			d="M24 6c-2 8-3 17-3 26s1 18 3 26M40 6c2 8 3 17 3 26s-1 18-3 26"
			stroke="#3b1518"
			strokeWidth="1.5"
			fill="none"
			opacity="0.6"
		/>
		<rect x="26" y="27" width="12" height="10" rx="1.5" fill="#efe3cc" />
	</svg>
)

/** Estrella y copa de la portada del libro. */
export const CopaEstrella = () => (
	<svg
		width="56"
		height="80"
		viewBox="0 0 56 80"
		aria-hidden="true"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.4"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path
			d="M28 2l3.6 7.4 8.1 1.2-5.9 5.7 1.4 8.1L28 20.6l-7.2 3.8 1.4-8.1-5.9-5.7 8.1-1.2z"
			fill="currentColor"
		/>
		<path d="M14 32h28c0 10-6 17-14 17s-14-7-14-17z" />
		<path
			d="M16.5 39h23c-1.5 4.6-5.8 7.6-11.5 7.6S18 43.6 16.5 39z"
			fill="currentColor"
			stroke="none"
		/>
		<path d="M28 49v15M19 66h18" />
		<path
			d="M28 70l1.7 3.4 3.8.6-2.7 2.6.6 3.7L28 78.6l-3.4 1.7.6-3.7-2.7-2.6 3.8-.6z"
			fill="currentColor"
			stroke="none"
		/>
	</svg>
)

export const Pluma = () => (
	<svg
		width="34"
		height="34"
		viewBox="0 0 24 24"
		aria-hidden="true"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.6"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M12 20h9" />
		<path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
		<path d="M4 4h7M4 8h4" opacity="0.6" />
	</svg>
)

export const Flecha = ({ direccion }: { direccion: "izq" | "der" }) => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 24 24"
		aria-hidden="true"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		style={{ transform: direccion === "izq" ? "scaleX(-1)" : undefined }}
	>
		<path d="M5 12h14M13 6l6 6-6 6" />
	</svg>
)
