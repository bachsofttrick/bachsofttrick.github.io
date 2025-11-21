// this is a markdown template:
// ---
// title: {title}
// publishedAt: {date}
// order: {order}
// hidden: {hidden}
// ---
// create a .js that takes in two args: category, title.
// Replace {title} with title arg, {date} with today date (example "2025-11-21"), hidden: false
// with category arg, check in folder "blog/posts" for category folder, find if such a folder exists, If yes, use it, if not, mkdirsync the folder.
// Check that category folder for file with format {date}.md (251121.md). If yes, rename that 251121.md to 251121-1.md, "order: 2", copy the template.md to blog/posts/[category] and rename to 251121-2.md. If it is 251121-2.md that exists, template.md becomes 251121-3.md and so on. If no such file exist, "order: 1" and template.md becomes 251121.md

import fs from 'fs';
import path from 'path';


// Entry point
if (process.argv.length !== 4) {
    console.error('Usage: node new-post.mjs <category> <title>');
    process.exit(1);
}

const category = process.argv[2];
const title = process.argv[3];

const dirPath = path.join(process.cwd(), 'app', 'blog', 'posts', category);

// Function to get today's date in YYYYMMDD format
function getTodayDate() {
    const today = new Date();
    return today.toISOString().slice(0, 10).replace(/-/g, '');
}

// Function to get the next available order number
function getNextOrderNumber() {
    const files = fs.readdirSync(dirPath);

    const date = getTodayDate();
    const baseFilename = `${date}.md`;

    // Check if the base file exists
    const baseFileExists = files.includes(baseFilename);

    // Check for existing numbered files
    let order = 1;
    if (baseFileExists) {
        let i = 1;
        while (true) {
            const fileName = `${date}-${i}.md`;
            if (files.includes(fileName)) {
                i++;
            } else {
                break;
            }
        }
        order = i + 1;
    }

    return order;
}

// Function to create the markdown file
function createMarkdownFile(title, date, order) {
    const templatePath = path.join(process.cwd(), 'tools', 'template.md');
    const templateContent = fs.readFileSync(templatePath, 'utf-8');

    const newFilename = `${date}-${order}.md`;
    const newFilePath = path.join(dirPath, newFilename);

    const content = templateContent
        .replace('{title}', title)
        .replace('{date}', date)
        .replace('{order}', order)
        .replace('{hidden}', false);

    fs.writeFileSync(newFilePath, content);
    console.log(`Created markdown file: ${newFilePath}`);
}

// Main function
function main(title) {
    const date = getTodayDate();

    // Check if category folder exists, if not, create it
    if (!fs.existsSync(dirPath)) {
        console.log(dirPath);
        fs.mkdirSync(dirPath);
        console.log(`Created category folder: ${dirPath}`);
    }

    // Get next order number
    const order = getNextOrderNumber();

    // Create markdown file
    createMarkdownFile(title, date, order);
}

main(title);
