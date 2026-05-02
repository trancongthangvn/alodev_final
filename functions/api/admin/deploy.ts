/**
 * POST /api/admin/deploy — trigger CF Pages production rebuild.
 *
 * After admin changes blog content in D1, the static export must be
 * regenerated to pick up the new posts (build script syncs JSON at build
 * start).  Two paths supported, in order of preference:
 *
 *  1. GitHub Actions workflow_dispatch (preferred — works for any project,
 *     including ad-hoc Pages):
 *     Set GH_REPO + GH_TOKEN secrets, this dispatches
 *     .github/workflows/deploy.yml which runs build + deploy on GH runners.
 *     Admin clicks Publish → site live in ~90s.
 *
 *  2. CF Pages deploy hook (legacy, requires Git-connected project):
 *     Set DEPLOY_HOOK_URL secret to a webhook URL from CF dashboard.
 *
 * Setup (one-time):
 *   wrangler pages secret put GH_TOKEN --project-name=alodev   # GH PAT with workflow scope
 *   wrangler pages secret put GH_REPO  --project-name=alodev   # e.g. trancongthangvn/alodev_final
 */

import { jsonResponse } from '../../_lib/d1-utils'

interface Env {
  DEPLOY_HOOK_URL?: string
  GH_TOKEN?: string
  GH_REPO?: string
  INTERNAL_DEPLOY_URL?: string
  INTERNAL_DEPLOY_TOKEN?: string
}

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  // Path 0: Self-hosted webhook on CT104 (CF Tunnel → Express).  Preferred when
  // GitHub Actions deploy is fragile or build deps haven't been pushed yet.
  // Pages secret pair INTERNAL_DEPLOY_URL + INTERNAL_DEPLOY_TOKEN gates this.
  if (ctx.env.INTERNAL_DEPLOY_URL && ctx.env.INTERNAL_DEPLOY_TOKEN) {
    const reason = await readReason(ctx.request)
    try {
      const r = await fetch(ctx.env.INTERNAL_DEPLOY_URL, {
        method: 'POST',
        headers: {
          'X-Deploy-Token': ctx.env.INTERNAL_DEPLOY_TOKEN,
          'Content-Type': 'application/json',
          'User-Agent': 'alodev-admin-deploy',
        },
        body: JSON.stringify({ reason }),
      })
      if (r.ok) {
        const body = await r.json().catch(() => ({}))
        return jsonResponse(200, { ok: true, queued: true, via: 'internal-webhook', reason, ...body })
      }
      const text = await r.text()
      return jsonResponse(502, { error: 'Internal deploy webhook trả lỗi', status: r.status, detail: text.slice(0, 500) })
    } catch (e) {
      return jsonResponse(500, { error: 'Internal deploy fetch failed', detail: String((e as Error).message).slice(0, 200) })
    }
  }

  // Path 1: GitHub Actions workflow_dispatch (fallback)
  if (ctx.env.GH_TOKEN && ctx.env.GH_REPO) {
    const reason = await readReason(ctx.request)
    const r = await fetch(
      `https://api.github.com/repos/${ctx.env.GH_REPO}/actions/workflows/deploy.yml/dispatches`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ctx.env.GH_TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'alodev-admin-deploy',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ref: 'main', inputs: { reason } }),
      },
    )
    if (r.status === 204) {
      return jsonResponse(200, { ok: true, queued: true, via: 'github-actions', reason })
    }
    const text = await r.text()
    return jsonResponse(502, { error: 'GitHub workflow dispatch fail', status: r.status, detail: text.slice(0, 500) })
  }

  // Path 2: CF Pages deploy hook (legacy)
  if (ctx.env.DEPLOY_HOOK_URL) {
    try {
      const r = await fetch(ctx.env.DEPLOY_HOOK_URL, { method: 'POST' })
      if (!r.ok) {
        const text = await r.text()
        return jsonResponse(502, { error: 'Deploy hook trả lỗi', status: r.status, detail: text.slice(0, 500) })
      }
      const body = await r.json().catch(() => ({}))
      return jsonResponse(200, { ok: true, queued: true, via: 'cf-deploy-hook', response: body })
    } catch (e) {
      return jsonResponse(500, { error: 'Deploy hook fetch failed', detail: String((e as Error).message).slice(0, 200) })
    }
  }

  return jsonResponse(503, {
    error: 'Deploy chưa cấu hình. Set GH_TOKEN + GH_REPO làm Pages secrets (khuyên dùng) hoặc DEPLOY_HOOK_URL.',
    setup: [
      'wrangler pages secret put GH_TOKEN --project-name=alodev   # GH PAT with workflow scope',
      'wrangler pages secret put GH_REPO  --project-name=alodev   # vd: trancongthangvn/alodev_final',
    ],
  })
}

async function readReason(req: Request): Promise<string> {
  try {
    const body = await req.clone().json().catch(() => ({}))
    if (body && typeof body === 'object' && typeof (body as Record<string, unknown>).reason === 'string') {
      return ((body as Record<string, unknown>).reason as string).slice(0, 100)
    }
  } catch { /* fallthrough */ }
  return 'admin-ui'
}
