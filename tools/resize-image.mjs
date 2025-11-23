import fs from "fs";
import sharp from "sharp";
import config from '../config.json' with { type: 'json' };
const { tools: { resizeImage } } = config;

const extToLook = resizeImage.extToLook;
const dirToLook = resizeImage.dirToLook;
const dirOutput = dirToLook + 'output/';
const resizedHeight = resizeImage.resizedHeight;

async function main() {
    let files = fs.readdirSync(dirToLook);
    if (!fs.existsSync(dirOutput)) {
        fs.mkdirSync(dirOutput);
    }
    
    files = files.filter(file => {
        const ext = file.split('.').pop().toLowerCase();
        return extToLook.includes(ext);
    });
    files.forEach(async file => {
        try {
            const imageObj = sharp(dirToLook + file);
            const imageMetadata = await imageObj.metadata();
            console.log(`Converting ${file}...`);

            // Check for EXIF Orientation, if yes, swap resizedHeight to width for bigger picture
            const resized = !imageMetadata.orientation ? 
                {width: null, height: resizedHeight} :
                {width: resizedHeight, height: null} ;
            
            await imageObj.autoOrient().resize(resized).toFile(dirOutput + file);
        }
        catch (err) {
            console.log(err);
        }
    });
}

main();
