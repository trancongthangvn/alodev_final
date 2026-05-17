#!/usr/bin/env node
/**
 * Smoke test for the alodev API. Hits localhost:3014 with the CF-Connecting-IP
 * header (server requires it for admin routes) and verifies the basic CRUD
 * surface for blog posts, plus the public health/blog endpoints.
 *
 * Run: node --env-file=server/.env scripts/smoke-test.mjs
 * Exits 0 on success, non-zero on first failure.
 *
 * NOT a unit test — assumes the server is already running (PM2 cluster).
 * Cleans up any test post it creates.
 */

import { strict as assert } from 'node:assert'

const BASE = process.env.SMOKE_BASE || 'http://localhost:3014'
const ADMIN_USER = process.env.ADMIN_USER
const ADMIN_PASS = process.env.ADMIN_PASS
if (!ADMIN_USER || !ADMIN_PASS) {
  console.error('Missing ADMIN_USER / ADMIN_PASS')
  process.exit(1)
}

const authHeader = 'Basic ' + Buffer.from(`${ADMIN_USER}:${ADMIN_PASS}`).toString('base64')

let passed = 0
let failed = 0
async function t(name, fn) {
  try {
    await fn()
    console.log(`  ✓ ${name}`)
    passed++
  } catch (err) {
    console.error(`  ✗ ${name}\n    ${err.message}`)
    failed++
  }
}

async function req(path, { method = 'GET', headers = {}, body, withCf = true, withAuth = false } = {}) {
  const h = { ...headers }
  if (withCf) h['CF-Connecting-IP'] = '127.0.0.1'
  if (withAuth) h['Authorization'] = authHeader
  if (body) h['Content-Type'] = 'application/json'
  return fetch(`${BASE}${path}`, { method, headers: h, body: body ? JSON.stringify(body) : undefined })
}

console.log(`Smoke tests against ${BASE}\n`)

// Public surface
await t('GET /api/health → 200 with db.ok', async () => {
  const r = await req('/api/health', { withCf: false })
  assert.equal(r.status, 200)
  const j = await r.json()
  assert.equal(j.ok, true)
  assert.equal(j.db.ok, true)
  assert.ok(j.db.published > 0, 'expected at least 1 published post')
})

await t('GET /api/blog → returns posts array', async () => {
  const r = await req('/api/blog', { withCf: false })
  assert.equal(r.status, 200)
  const j = await r.json()
  assert.ok(Array.isArray(j.posts))
  assert.ok(j.posts.length > 0, 'no posts returned')
})

// CF guard
await t('GET /api/admin/blog without CF header → 403', async () => {
  const r = await req('/api/admin/blog', { withCf: false, withAuth: true })
  assert.equal(r.status, 403)
})

await t('GET /api/admin/blog with bad creds → 401', async () => {
  const r = await req('/api/admin/blog', { headers: { 'Authorization': 'Basic ' + Buffer.from('x:y').toString('base64') } })
  assert.equal(r.status, 401)
})

// Admin CRUD round-trip
let createdId = null
await t('POST /api/admin/blog → 200, returns id', async () => {
  const r = await req('/api/admin/blog', {
    method: 'POST', withAuth: true,
    body: { title: '__SMOKE_TEST_DELETE_ME__', description: 'smoke test' },
  })
  assert.equal(r.status, 200)
  const j = await r.json()
  assert.ok(j.id, 'no id in response')
  createdId = j.id
})

await t('PATCH /api/admin/blog/:id → updates description', async () => {
  assert.ok(createdId, 'no createdId from previous step')
  const r = await req(`/api/admin/blog/${createdId}`, {
    method: 'PATCH', withAuth: true,
    body: { description: 'updated' },
  })
  assert.equal(r.status, 200)
})

await t('GET /api/admin/blog/:id → returns updated post', async () => {
  const r = await req(`/api/admin/blog/${createdId}`, { withAuth: true })
  assert.equal(r.status, 200)
  const j = await r.json()
  assert.equal(j.description, 'updated')
})

await t('DELETE /api/admin/blog/:id → 200', async () => {
  const r = await req(`/api/admin/blog/${createdId}`, { method: 'DELETE', withAuth: true })
  assert.equal(r.status, 200)
})

await t('GET /api/admin/blog/:id after delete → 404', async () => {
  const r = await req(`/api/admin/blog/${createdId}`, { withAuth: true })
  assert.equal(r.status, 404)
})

console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed === 0 ? 0 : 1)
