// 全記事の内部リンクを抽出してチェック
const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, '..', 'content', 'blog')
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'))

const today = new Date().toISOString().slice(0, 10)

// slug -> {publishedAt, isFuture} のマップ
const articleMeta = {}
for (const f of files) {
  const slug = f.replace(/\.md$/, '')
  const raw = fs.readFileSync(path.join(dir, f), 'utf8')
  const fm = raw.match(/^---\n([\s\S]*?)\n---/)
  const pub = (fm?.[1].match(/^publishedAt:\s*"([^"]*)"/m) || [])[1] || ''
  articleMeta[slug] = { publishedAt: pub, isFuture: pub > today }
}

const blogSlugs = new Set(files.map((f) => f.replace(/\.md$/, '')))

const compareSrc = fs.readFileSync(path.join(__dirname, '..', 'lib', 'compare.ts'), 'utf8')
const compareSlugs = new Set(
  [...compareSrc.matchAll(/slug:\s*['"]([\w-]+)['"]/g)].map((m) => m[1])
)

const validStaticPaths = new Set([
  '/', '/pricing', '/contact', '/legal', '/privacy', '/terms',
  '/login', '/blog', '/compare', '/dashboard',
])

const issues = []
let totalLinks = 0

for (const f of files) {
  const slug = f.replace(/\.md$/, '')
  const myPub = articleMeta[slug].publishedAt
  const amIPublished = !articleMeta[slug].isFuture
  const raw = fs.readFileSync(path.join(dir, f), 'utf8')
  const body = raw.replace(/^---\n[\s\S]*?\n---/, '')

  const links = [...body.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)]

  for (const [, text, href] of links) {
    totalLinks++

    if (/^https?:\/\//i.test(href)) continue
    if (/^mailto:/i.test(href)) continue
    if (href.startsWith('#')) continue

    const pathOnly = href.split('?')[0].split('#')[0]

    const blogMatch = pathOnly.match(/^\/blog\/([\w-]+)\/?$/)
    if (blogMatch) {
      const target = blogMatch[1]
      if (!blogSlugs.has(target)) {
        issues.push({ slug, type: 'BROKEN_BLOG_LINK', href, text })
      } else if (amIPublished && articleMeta[target].isFuture) {
        // 公開済み記事から未来公開記事へのリンク = 今は404
        issues.push({
          slug,
          type: 'LINK_TO_FUTURE_ARTICLE',
          href,
          text,
          targetPub: articleMeta[target].publishedAt,
          myPub,
        })
      } else if (!amIPublished && articleMeta[target].isFuture && articleMeta[target].publishedAt > myPub) {
        // 未来記事から「自分より後の未来記事」へのリンク = 自分が公開された時点でも未公開
        issues.push({
          slug,
          type: 'LINK_TO_LATER_FUTURE',
          href,
          text,
          targetPub: articleMeta[target].publishedAt,
          myPub,
        })
      }
      continue
    }

    const compareMatch = pathOnly.match(/^\/compare\/([\w-]+)\/?$/)
    if (compareMatch) {
      if (!compareSlugs.has(compareMatch[1])) {
        issues.push({ slug, type: 'BROKEN_COMPARE_LINK', href, text })
      }
      continue
    }

    if (pathOnly.startsWith('/')) {
      if (!validStaticPaths.has(pathOnly.replace(/\/$/, '')) && pathOnly !== '/') {
        if (!pathOnly.match(/^\/(blog|compare)$/)) {
          issues.push({ slug, type: 'UNKNOWN_STATIC_LINK', href, text })
        }
      }
    }
  }
}

console.log('=== Link Audit ===')
console.log('Today:', today)
console.log('Files:', files.length, '/ Total links found:', totalLinks)
console.log('Issues:', issues.length)
console.log('')

const byType = {}
for (const issue of issues) {
  if (!byType[issue.type]) byType[issue.type] = []
  byType[issue.type].push(issue)
}

for (const [type, list] of Object.entries(byType)) {
  console.log(`\n=== ${type} (${list.length}) ===`)
  for (const i of list) {
    const extra = i.targetPub ? `  [target pub: ${i.targetPub}, my pub: ${i.myPub}]` : ''
    console.log(`  [${i.slug}] ${i.href}${extra}`)
  }
}
