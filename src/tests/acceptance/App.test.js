// import React from 'react'
import { visit } from '../visit'

describe('App', () => {
  test('loads on /', async () => {
    const page = visit('/')
    const text = await page.evaluate(() => document.body.textContent).end()
    expect(text).toContain('Please start the game')
  })

  test('has two game boards', async () => {
    const page = visit('/')
    const selector = '.game-board'
    const cardCount = await page
      .wait(selector)
      .evaluate(sel => document.querySelectorAll(sel).length, selector)
      .end()

    expect(cardCount).toEqual(2)
  })
})
