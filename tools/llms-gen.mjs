// Generates llms.txt (curated) and optionally llms-full.txt (exhaustive)
// from blog posts, so AI assistants can discover and cite this site.
// Usage: node tools/llms-gen.mjs [--full]
// Output paths, description length, and per-category post limit
// come from config.json tools.llms.

import fs from 'fs';
import path from 'path';
import config from '../config.json' with { type: 'json' };
const { contactInfo, app: { personalSummary }, tools: { llms } } = config;

const includeFull = process.argv.includes('--full');

function getBaseUrl() {
    const sitemapPath = path.join(process.cwd(), 'app', 'sitemap.ts');
    const content = fs.readFileSync(sitemapPath, 'utf-8');
    const match = content.match(/baseUrl\s*=\s*['"]([^'"]+)['"]/);
    if (!match) {
        console.error('Could not find baseUrl in app/sitemap.ts');
        process.exit(1);
    }
    return match[1];
}

function parseFrontmatter(fileContent) {
    const match = /---\s*([\s\S]*?)\s*---/.exec(fileContent);
    if (!match) return null;
    const content = fileContent.replace(/---\s*([\s\S]*?)\s*---/, '').trim();
    const metadata = {};
    match[1].trim().split('\n').forEach((line) => {
        const [key, ...valueArr] = line.split(': ');
        let value = valueArr.join(': ').trim().replace(/^['"](.*)['"]$/, '$1');
        const toKey = key.trim();
        if (toKey === 'hidden') metadata[toKey] = value === 'true';
        else metadata[toKey] = value;
    });
    return { metadata, content };
}

function stripMarkdown(input) {
    return input
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/`[^`]*`/g, ' ')
        .replace(/!\[.*?\]\(.*?\)/g, ' ')
        .replace(/\[([^\]]*)\]\(.*?\)/g, '$1')
        .replace(/<[^>]*>/g, ' ')
        .replace(/^[#>*-]+\s?/gm, ' ')
        .replace(/[*_~]+/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function summarize(content) {
    const plain = stripMarkdown(content);
    if (plain.length <= llms.descLength) return plain;
    return plain.slice(0, llms.descLength).trimEnd() + '...';
}

function getAllPosts() {
    const postsDir = path.join(process.cwd(), 'app', 'blog', 'posts');
    const posts = [];
    fs.readdirSync(postsDir).forEach((category) => {
        const categoryDir = path.join(postsDir, category);
        if (!fs.statSync(categoryDir).isDirectory()) return;
        fs.readdirSync(categoryDir).forEach((year) => {
            const yearDir = path.join(categoryDir, year);
            if (!fs.statSync(yearDir).isDirectory()) return;
            fs.readdirSync(yearDir)
                .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
                .forEach((file) => {
                    const parsed = parseFrontmatter(fs.readFileSync(path.join(yearDir, file), 'utf-8'));
                    if (!parsed || parsed.metadata.hidden) return;
                    posts.push({
                        title: parsed.metadata.title,
                        publishedAt: parsed.metadata.publishedAt,
                        category,
                        slug: path.basename(file, path.extname(file)),
                        summary: summarize(parsed.content),
                    });
                });
        });
    });
    return posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

function postLine(post, baseUrl) {
    return `- [${post.title}](${baseUrl}/blog/${post.category}/${post.slug}): ${post.summary} (${post.publishedAt})`;
}

function buildHeader(baseUrl, totalPosts) {
    return `# Brian Phan

> ${personalSummary} Blog covers software engineering and AI projects, cooking, life, photography, and film (${totalPosts} posts).

## About

- [About Me](${baseUrl}/about): work experience, skills, education.
- [Projects](${baseUrl}/projects): AI and software projects.
- [Blog index](${baseUrl}/blog): all posts with category and date filtering.
- Contact: ${contactInfo.email}, ${contactInfo.linkedin}, ${contactInfo.github}
`;
}

function buildFooter(baseUrl) {
    return `## Machine-readable indexes

- Full URL list: ${baseUrl}/sitemap.xml
- Feed: ${baseUrl}/rss.xml
`;
}

function main() {
    const baseUrl = getBaseUrl();
    const posts = getAllPosts();
    const byCategory = {};
    posts.forEach((post) => {
        (byCategory[post.category] = byCategory[post.category] || []).push(post);
    });

    const header = buildHeader(baseUrl, posts.length);
    const footer = buildFooter(baseUrl);

    // Curated file: recent posts per category
    let curated = header + '\n';
    Object.keys(byCategory).sort().forEach((category) => {
        const recent = byCategory[category].slice(0, llms.postsPerCategory);
        curated += `## ${category} (${byCategory[category].length} posts, recent ${recent.length} shown)\n\n`;
        curated += recent.map((post) => postLine(post, baseUrl)).join('\n') + '\n\n';
    });
    curated += footer;
    const outputPath = path.join(process.cwd(), llms.output);
    fs.writeFileSync(outputPath, curated);
    console.log(`Wrote ${outputPath} (${posts.length} posts indexed)`);

    // Exhaustive file behind --full flag
    if (includeFull) {
        let full = header + '\n';
        Object.keys(byCategory).sort().forEach((category) => {
            full += `## ${category} (${byCategory[category].length} posts)\n\n`;
            full += byCategory[category].map((post) => postLine(post, baseUrl)).join('\n') + '\n\n';
        });
        full += footer;
        const fullPath = path.join(process.cwd(), llms.fullOutput);
        fs.writeFileSync(fullPath, full);
        console.log(`Wrote ${fullPath}`);
    }
}

main();
