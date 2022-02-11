let img;

function preload()
{
    img = loadImage('image.jpg');
}


function setup() 
{
    createCanvas(512, 256);
    background(0);
    image(img, 0, 0);
    drawDither(img, 1);
    image(img, 256, 0);
    filter(GRAY);
}



function drawDither(img, steps) 
{
    img.loadPixels()
    for(let x = 0; x < img.width; x++)
    {
        for(let y = 0; y < img.height; y++)
        {
            let oldpixel = getPixel(img, x, y);
            let r = red(oldpixel);
            let g = green(oldpixel);
            let b = blue(oldpixel);
            let newR = findClosest(r, steps);
            let newG = findClosest(g, steps);
            let newB = findClosest(b, steps);
            let newC = color(newR, newG, newB);
            setPixel(img, x, y, newC);

            let qR = r - newR;
            let qG = g - newG;
            let qB = b - newB;

            distErr(img, x, y, qR, qG, qB);

        }
    }

    img.updatePixels();
    
}


function index(x, y)
{
    return (x + y * img.width) * 4;
}


function getPixel(img, x, y)
{
    let r = img.pixels[index(x, y)];
    let g = img.pixels[index(x, y) + 1];
    let b = img.pixels[index(x, y) + 2];
    let a = img.pixels[index(x, y) + 3];
    return color(r, g, b, a);
}

function setPixel(img, x, y, _color)
{
    let r = red(_color);
    let g = green(_color);
    let b = blue(_color);
    let a = alpha(_color);
    img.pixels[index(x, y)] = r;
    img.pixels[index(x, y) + 1] = g;
    img.pixels[index(x, y) + 2] = b;
    img.pixels[index(x, y) + 3] = a;
}

function findClosest(val, steps)
{
    return  round((steps * val) / 255) * floor(255 / steps);
}

function distErr(img, x, y, qR, qG, qB)
{
    addErr(img, x + 1, y, qR, qG, qB, 7 / 16.0);
    addErr(img, x - 1, y + 1, qR, qG, qB, 3 / 16.0);
    addErr(img, x, y + 1, qR, qG, qB, 5 / 16.0);
    addErr(img, x + 1, y + 1, qR, qG, qB, 1 / 16.0);
}

function addErr(img, x, y, qR, qG, qB, factor)
{
    if(x < 0 || x >= img.width || y < 0 || y >= img.height)
        return;
    let pix = getPixel(img, x, y);
    let r = red(pix);
    let g = green(pix);
    let b = blue(pix);
    pix.setRed(r + qR * factor);
    pix.setGreen(g + qG * factor);
    pix.setBlue(b + qB * factor);
    setPixel(img, x, y, pix);
}