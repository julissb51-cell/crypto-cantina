/**
 * Fondo de la cantina dibujado con SVG y CSS: estantes con botellas, velas
 * encendidas y vigas de madera. Reemplaza a una foto.
 */
const BOTELLAS = [
	[0, 46, 8],
	[12, 58, 9],
	[26, 40, 7],
	[37, 52, 10],
	[51, 62, 8],
	[63, 44, 9],
	[76, 56, 7],
	[87, 48, 10],
	[101, 60, 8],
	[113, 42, 9],
] as const

const Estante = ({ y, x }: { y: number; x: number }) => (
	<g transform={`translate(${x} ${y})`}>
		{BOTELLAS.map(([bx, alto, ancho], i) => (
			<g key={i} transform={`translate(${bx} ${-alto})`}>
				<rect
					x={ancho / 2 - 1.6}
					y={0}
					width={3.2}
					height={alto * 0.28}
					rx={1}
				/>
				<rect
					x={0}
					y={alto * 0.26}
					width={ancho}
					height={alto * 0.74}
					rx={ancho / 3}
				/>
			</g>
		))}
		<rect x={-6} y={0} width={136} height={5} className="estante-tabla" />
	</g>
)

const VELAS = [
	{ x: "8%", y: "62%", d: "0s" },
	{ x: "21%", y: "38%", d: "1.2s" },
	{ x: "47%", y: "70%", d: "0.6s" },
	{ x: "68%", y: "34%", d: "1.8s" },
	{ x: "83%", y: "58%", d: "0.3s" },
	{ x: "93%", y: "26%", d: "2.1s" },
]

export const Escena = () => (
	<div className="escena" aria-hidden="true">
		<div className="escena-vigas" />
		<svg
			className="escena-estantes"
			viewBox="0 0 520 420"
			preserveAspectRatio="xMaxYMid slice"
		>
			<g className="estante-botellas">
				<Estante x={250} y={120} />
				<Estante x={382} y={120} />
				<Estante x={250} y={230} />
				<Estante x={382} y={230} />
				<Estante x={250} y={340} />
				<Estante x={382} y={340} />
			</g>
		</svg>
		{VELAS.map((v, i) => (
			<span
				key={i}
				className="vela"
				style={{ left: v.x, top: v.y, animationDelay: v.d }}
			/>
		))}
		<div className="escena-velo" />
	</div>
)
