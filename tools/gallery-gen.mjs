import fs from 'fs';
import path from 'path';
import config from '../config.json' with { type: 'json' };
const { tools: { newPost } } = config;

if (process.argv.length !== 4) {
    console.error('Usage: node gallery-gen.mjs <category> <date>');
    process.exit(1);
}

const categoryKey = process.argv[2];
const date = process.argv[3];

if (!newPost.hasOwnProperty(categoryKey)) {
    console.error('This category doesn\'t exist in config.json');
    process.exit(1);
}

const category = newPost[categoryKey];
const year = date.slice(0, 2);
const imgDir = path.join(process.cwd(), 'public', 'images', 'blog', category, year, date);

if (!fs.existsSync(imgDir)) {
    console.error(`Directory not found: ${imgDir}`);
    process.exit(1);
}

const files = fs.readdirSync(imgDir)
    .filter(f => !f.startsWith('.'))
    .sort();

if (files.length === 0) {
    console.error('No files found in directory.');
    process.exit(1);
}

const basePath = `/images/blog/${category}/${year}/${date}`;
const imgList = files.map(f => `'${basePath}/${f}'`).join(', ');
const galleryTag = `\n<Gallery imgs={[${imgList}]} gridColumns={${files.length}}/>`;

const postPath = path.join(process.cwd(), 'app', 'blog', 'posts', category, year, `${date}.md`);
if (!fs.existsSync(postPath)) {
    console.error(`Post not found: ${postPath}`);
    process.exit(1);
}

fs.appendFileSync(postPath, galleryTag);
console.log(`Appended Gallery to ${postPath}`);
