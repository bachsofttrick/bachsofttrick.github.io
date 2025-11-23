// this is a markdown template:
// ---
// title: {title}
// publishedAt: {date}
// order: {order}
// hidden: {hidden}
// ---
// create a .js that takes in two args: category, title.
// Replace {title} with title arg, {date} with today date (example "2025-11-21"), hidden: false
// with category arg, check in folder "blog/posts" for category folder, find if such a folder exists,
// If yes, use it, if not, mkdirsync the folder.
// Check that category folder for file with format {date}.md (251121.md).
// If yes, rename that 251121.md to 251121-1.md,
// copy the template.md to blog/posts/[category], the new post file now has "order: 2"
// and rename to 251121-2.md.
// If it is 251121-2.md that exists, template.md becomes 251121-3.md with "order: 3" and so on.
// If no such file exist, "order: 1" and template.md becomes 251121.md

import fs from 'fs';
import path from 'path';
import config from '../config.json' with { type: 'json' };
const { tools: { newPost } } = config;

// Entry point
if (process.argv.length !== 4) {
    console.error('Usage: node new-post.mjs <category> <title>');
    process.exit(1);
}

let category = process.argv[2];
const title = process.argv[3];

let dirPath = '';

// Function to get value from config.json
function getValueFromConfig(key) {
    if (newPost.hasOwnProperty(key)) {
        return newPost[key];
    } else {
        console.error('This category doesn\'t exist in config.json');
        process.exit(1);
    }
}

// Function to get today's date in YYYY-MM-DD or YYMMDD format
function getTodayDate(fullDate = false) {
    let today = new Date();
    if (fullDate) {
        return today.toISOString().slice(0, 10);
    }
    return today.toISOString().slice(2, 10).replace(/-/g, '');
}

// Function to get the next available order number
function getNextOrderNumber() {
    const files = fs.readdirSync(dirPath);

    const date = getTodayDate();
    const baseFilename = `${date}.md`;

    // Check if the base file exists. If yes, change it to {date}-1.md,
    // in preparation for {date}-2.md
    const baseFileExists = files.includes(baseFilename);
    let order = 1;
    if (baseFileExists) {
        fs.renameSync(`${dirPath}/${baseFilename}`, `${dirPath}/${date}-1.md`)
        return order + 1;
    }

    // Base file does not exist, switch to counting ordered files
    while (true) {
        const fileName = `${date}-${order}.md`;
        if (files.includes(fileName)) {
            order++;
        } else {
            break;
        }
    }

    return order;
}

// Function to create the markdown file
function createMarkdownFile(title, order) {
    const date = getTodayDate();

    const templatePath = path.join(process.cwd(), 'tools', 'template.md');
    const templateContent = fs.readFileSync(templatePath, 'utf-8');

    const newFilename = `${date}` + (order < 2 ? ``: `-${order}`) + `.md`;
    const newFilePath = path.join(dirPath, newFilename);

    const content = templateContent
        .replace('{title}', title)
        .replace('{date}', getTodayDate(true))
        .replace('{order}', order)
        .replace('{hidden}', false);

    fs.writeFileSync(newFilePath, content);
    console.log(`Created markdown file: ${newFilename}`);
}

// Main function
function main(title) {
    category = getValueFromConfig(category);
    dirPath = path.join(process.cwd(), 'app', 'blog', 'posts', category);
    // Check if category folder exists, if not, create it
    if (!fs.existsSync(dirPath)) {
        console.log(dirPath);
        fs.mkdirSync(dirPath);
        console.log(`Created category folder: ${dirPath}`);
    }

    const order = getNextOrderNumber();
    createMarkdownFile(title, order);
}

main(title);
