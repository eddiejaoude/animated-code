import { expect, test } from '@playwright/test'

const source = ['const answer = 42', 'console.log(answer)'].join('\n')

test.describe('CodeReel critical journeys', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('CodeReel', { exact: true })).toBeVisible()
  })

  test.afterEach(async ({ page }) => {
    expect(await page.pageErrors(), 'the journey should not emit uncaught page errors').toEqual([])
  })

  test('updates the preview when code changes', async ({ page }) => {
    const editor = page.locator('textarea')

    await editor.fill(source)

    await expect(editor).toHaveValue(source)
    await expect(page.getByText(`2 lines · ${source.length} chars`, { exact: true })).toBeVisible()
    await expect(page.getByRole('main')).toContainText('const answer = 42')
    await expect(page.getByRole('main')).toContainText('console.log(answer)')
  })

  test('builds and manages a multi-step sequence', async ({ page }) => {
    const codePanel = page.locator('aside').filter({ has: page.locator('textarea') })

    await codePanel.getByRole('button', { name: 'Steps' }).click()
    await expect(codePanel.getByText('Step 1 / 3', { exact: true })).toBeVisible()

    await codePanel.getByTitle('Add step after current').click()
    await expect(codePanel.getByText('Step 2 / 4', { exact: true })).toBeVisible()

    await codePanel.getByTitle('Duplicate step').click()
    await expect(codePanel.getByText('Step 3 / 5', { exact: true })).toBeVisible()

    await codePanel.getByTitle('Delete step').click()
    await expect(codePanel.getByText('Step 2 / 4', { exact: true })).toBeVisible()
  })

  test('completes the configured export flow', async ({ page }) => {
    await page.getByRole('button', { name: '1:1', exact: true }).click()
    await page.getByRole('button', { name: 'GIF', exact: true }).click()
    await page.getByRole('button', { name: 'Export video' }).click()

    await expect(page.getByRole('heading', { name: 'Exporting GIF' })).toBeVisible()
    await expect(page.getByText('1080×1080', { exact: true })).toBeVisible()

    const download = page.getByRole('button', { name: 'Download GIF' })
    await expect(download).toBeDisabled()

    await expect(page.getByRole('heading', { name: 'Export complete' })).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText('codereel-1x1.gif', { exact: true })).toBeVisible()
    await expect(download).toBeEnabled()

    await download.click()
    await expect(page.getByText("Prototype build — the encoder isn't wired up yet.", { exact: true })).toBeVisible()

    await page.getByRole('button', { name: 'Close' }).click()
    await expect(page.getByRole('heading', { name: 'Export complete' })).toBeHidden()
  })
})
