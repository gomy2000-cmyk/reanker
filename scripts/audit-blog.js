// ブログ全記事の監査スクリプト
// 内部リンク、タイトル長、description長、Reanker表記の混在をチェック
const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, '..', 'content', 'blog')
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'))
const today = new Date().toISOString().slice(0, 10)

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---/)
  if (!m) return {}
  const fm = m[1]
  const get = (k) => {
    const re = new RegExp('^' + k + ':\\s*"([^"]*)"', 'm')
    const x = fm.match(re)
    return x ? x[1] : ''
  }
  return {
    title: get('title'),
    description: get('description'),
    ogTitle: get('ogTitle'),
    publishedAt: get('publishedAt'),
    category: get('category'),
  }
}

const posts = files.map((f) => {
  const raw = fs.readFileSync(path.join(dir, f), 'utf8')
  const slug = f.replace(/\.md$/, '')
  const fm = parseFrontmatter(raw)
  const body = raw.replace(/^---\n[\s\S]*?\n---/, '')
  const links = [...body.matchAll(/\]\(\/blog\/([a-z0-9-]+)\)/g)].map((m) => m[1])
  return {
    slug,
    ...fm,
    isFuture: fm.publishedAt > today,
    titleLen: fm.title.length,
    descLen: fm.description.length,
    links: [...new Set(links)],
    bodyLen: body.length,
    reankerCount: (body.match(/\bReAnker\b/g) || []).length,
    lowercaseReanker: (body.match(/\bReanker\b/g) || []).length,
  }
})

const slugSet = new Set(posts.map((p) => p.slug))
const futureSlugs = new Set(posts.filter((p) => p.isFuture).map((p) => p.slug))

console.log('=== Summary ===')
console.log('Total:', posts.length, '/ Published:', posts.filter((p) => !p.isFuture).length, '/ Future:', posts.filter((p) => p.isFuture).length)
console.log('')

console.log('=== 1. Broken internal /blog/ links ===')
let broken = 0
for (const p of posts) {
  const b = p.links.filter((l) => !slugSet.has(l))
  if (b.length) { console.log('  [' + p.slug + ']', b.join(', ')); broken++ }
}
if (!broken) console.log('  OK: no broken links')
console.log('')

console.log('=== 2. Published article -> future article links ===')
let futLinks = 0
for (const p of posts) {
  if (p.isFuture) continue
  const fl = p.links.filter((l) => futureSlugs.has(l))
  if (fl.length) { console.log('  [' + p.slug + ' ' + p.publishedAt + '] ->', fl.join(', ')); futLinks++ }
}
if (!futLinks) console.log('  OK: no published->future links')
console.log('')

console.log('=== 3. Title length (recommended 28-45) ===')
posts.filter((p) => p.titleLen < 25 || p.titleLen > 50).forEach((p) => {
  console.log('  [' + String(p.titleLen).padStart(2) + '] ' + p.slug + ' :: ' + p.title)
})
console.log('')

console.log('=== 4. Description length (Japanese SEO target: 80-120) ===')
posts.filter((p) => p.descLen < 75 || p.descLen > 130).forEach((p) => {
  console.log('  [' + String(p.descLen).padStart(3) + '] ' + p.slug)
})
console.log('')

console.log('=== 5. Reanker (lowercase a) typo ===')
const typos = posts.filter((p) => p.lowercaseReanker > 0)
if (typos.length) {
  typos.forEach((p) => console.log('  [' + p.slug + '] Reanker x' + p.lowercaseReanker + ' / ReAnker x' + p.reankerCount))
} else {
  console.log('  OK: no lowercase Reanker')
}
console.log('')

console.log('=== 6. ogTitle missing ===')
const noOg = posts.filter((p) => !p.ogTitle)
if (noOg.length) noOg.forEach((p) => console.log('  ' + p.slug))
else console.log('  OK: all have ogTitle')
console.log('')

console.log('=== 7. Body length distribution ===')
posts.sort((a, b) => a.bodyLen - b.bodyLen).forEach((p) => {
  const bar = '#'.repeat(Math.floor(p.bodyLen / 500))
  console.log('  ' + String(p.bodyLen).padStart(5) + ' ' + bar + ' ' + p.slug)
})
