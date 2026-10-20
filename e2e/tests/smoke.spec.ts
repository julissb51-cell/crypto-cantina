import { test, expect } from "@playwright/test"

// Pruebas de humo del frontend de la Cripto Cantina: no necesitan billetera.

test("la portada carga", async ({ page }) => {
	const response = await page.goto("/")
	expect(response?.ok()).toBeTruthy()
	await expect(page.getByRole("heading", { level: 1 })).toContainText(
		"Cripto Cantina",
	)
})

test("muestra el botón para conectar la billetera", async ({ page }) => {
	await page.goto("/")
	await expect(
		page.getByRole("button", { name: "Conectar billetera" }),
	).toBeVisible()
})

test("el formulario de firma tiene contador de 80 caracteres", async ({
	page,
}) => {
	await page.goto("/")
	await expect(
		page.getByPlaceholder("La primera ronda va por la casa."),
	).toBeVisible()
	await expect(page.getByText("0/80")).toBeVisible()
})

test("el libro se abre", async ({ page }) => {
	await page.goto("/")
	await page.getByRole("button", { name: "Abrir el libro" }).click()
	await expect(page.getByText("Este libro pertenece a la")).toBeVisible()
})
