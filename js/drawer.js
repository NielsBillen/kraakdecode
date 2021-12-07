"use strict";

class Drawer
{
    constructor() 
    {
        if (this.constructor === Drawer)
            throw new Error("cannot instantiate abstract Drawer class!");
    }
    
    clear()
    {
        throw new Error("Method clear must be implemented!");
    }
    
    drawCircle(x, y, radius, thickness, strokeColor, fillColor)
    {
        throw new Error("Method drawCircle must be implemented!");
    }
    
    drawRectangle(x, y, width, height, thickness, strokeColor, fillColor)
    {
        throw new Error("Method drawRectangle must be implemented!");
    }
    
    drawRoundedRectangle(x, y, width, height, rounding, thickness, strokeColor, fillColor)
    {
        throw new Error("Method drawRectangle must be implemented!");
    }
    
    drawVerticalText(text, x, y, font, fontSize, color)
    {
        throw new Error("Method drawText must be implemented!");
    }
    
    drawImage(image, x, y, width, height)
    {
        throw new Error("Method drawImage must be implemented!");
    }
    
    toLocalFontSize(pt)
    {
        throw new Error("Method toLocalFontSize must be implemented!");
    }
    
    toLocal(value)
    {
        throw new Error("Method toLocal must be implemented!");
    }
}

class CanvasDrawer extends Drawer
{
    #canvas = null;
    
    constructor(canvas)
    {
        super();
        this.#canvas = canvas;    
    }

    clear()
    {
        this.#canvas.width = this.#canvas.clientWidth;
        this.#canvas.height = this.#canvas.clientHeight;

        const ctx = this.#canvas.getContext("2d");
        ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
    }

    drawCircle(x, y, radius, thickness, strokeColor, fillColor)
    {
        const ctx = this.#canvas.getContext("2d");
                
        ctx.lineWidth = this.toLocal(thickness);
        ctx.strokeStyle = strokeColor;
        ctx.fillStyle = fillColor;
    
        const cx = this.toLocal(x);
        const cy = this.toLocal(y);
        const r = this.toLocal(radius - thickness * 0.5);
        
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2.0 * Math.PI);        
        ctx.stroke();
        ctx.fill();
    }                      
                      
    drawRectangle(x, y, width, height, thickness, strokeColor, fillColor)
    {
        const ctx = this.#canvas.getContext("2d");
                
        ctx.lineWidth = this.toLocal(thickness);
        ctx.strokeStyle = strokeColor;
        ctx.fillStyle = fillColor;
    
        const rx = this.toLocal(x + thickness * 0.5);
        const ry = this.toLocal(y + thickness * 0.5);
        const rw = this.toLocal(width - thickness);
        const rh = this.toLocal(height - thickness);
        
        ctx.beginPath();
        ctx.rect(rx, ry, rw, rh);     
        if (thickness > 0 && strokeColor)
            ctx.stroke();
        if (height > 0 && fillColor)
            ctx.fill();
    }
        
    drawRoundedRectangle(x, y, width, height, rounding, thickness, strokeColor, fillColor)
    {
        const ctx = this.#canvas.getContext("2d");
                
        ctx.lineWidth = this.toLocal(thickness);
        ctx.strokeStyle = strokeColor;
        ctx.fillStyle = fillColor;
    
        const rr = this.toLocal(rounding);
        const xx = this.toLocal(x + thickness * 0.5);
        const yy = this.toLocal(y + thickness * 0.5);
        const ww = this.toLocal(width - thickness);
        const hh = this.toLocal(height - thickness);
        
        ctx.beginPath();
        ctx.moveTo(xx + rr, yy);
        ctx.arcTo(xx + ww, yy, xx + ww, yy + hh, rr);
        ctx.arcTo(xx + ww, yy + hh, xx, yy+hh, rr);
        ctx.arcTo(xx, yy + hh, xx, yy, rr);
        ctx.arcTo(xx, yy, xx + ww, yy, rr);
        ctx.closePath();
          
        if (thickness > 0 && strokeColor)
            ctx.stroke();
        if (height > 0 && fillColor)
            ctx.fill();
    }

    drawVerticalText(text, x, y, font, fontSize, color)
    {
        const ctx = this.#canvas.getContext("2d");
        ctx.font = "" + this.toLocalFontSize(fontSize) +'px "ComicNeue-Bold"';
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        const rx = this.toLocal(x);
        const ry = this.toLocal(y);
        
        ctx.save();
        ctx.translate(rx, ry);
        ctx.rotate(-Math.PI * 0.5);
        ctx.fillText(text, 0, 0);
        ctx.restore();
    }
        
    drawImage(image, x, y, width, height)
    {
        if (!image || !image.src)
            return;
        
        const xx = this.toLocal(x);
        const yy = this.toLocal(y);
        const ww = this.toLocal(width);
        const hh = this.toLocal(height);
        
        const ctx = this.#canvas.getContext("2d");
        const sx = ww / image.width;
        const sy = hh / image.height;
        const scale = Math.min(sx, sy);
        
        const sWidth = image.width * scale;
        const sHeight = image.height * scale;
        const dx = xx + (ww - sWidth) * 0.5;
        const dy = yy + (hh - sHeight) * 0.5;
        
        ctx.drawImage(image, 0, 0, image.width, image.height, dx, dy, sWidth, sHeight);
    }
        
    toLocal(value)
    {
        return value * this.#canvas.width;
    }
        
    toLocalFontSize(pt)
    {
        return (pt * 0.352778 / 210) * this.#canvas.width;
    }
}

class PDFDrawer extends Drawer
{
    #pdf = null;
    
    constructor(pdf)
    {
        super();
        this.#pdf = pdf;
    }

    clear()
    {
        
    }

    drawCircle(x, y, radius, thickness, strokeColor, fillColor)
    {
        this.#pdf.setLineWidth(this.toLocal(thickness) * 0.5);
        this.#pdf.setDrawColor(strokeColor);
        this.#pdf.setFillColor(fillColor);
    
        const cx = this.toLocal(x);
        const cy = this.toLocal(y);
        const r = this.toLocal(radius - thickness * 0.5);
        
        this.#pdf.circle(cx, cy, r, "DF");
    }      

    drawRectangle(x, y, width, height, thickness, strokeColor, fillColor)
    {        
        this.#pdf.setLineWidth(this.toLocal(thickness) * 0.5);
        if (strokeColor)
            this.#pdf.setDrawColor(strokeColor);
        if (fillColor)
            this.#pdf.setFillColor(fillColor);
                
        const rx = this.toLocal(x + thickness * 0.5);
        const ry = this.toLocal(y + thickness * 0.5);
        const rw = this.toLocal(width - thickness);
        const rh = this.toLocal(height - thickness);
        
        if (strokeColor && fillColor)
            this.#pdf.rect(rx, ry, rw, rh, "DF");
        else if (strokeColor)
            this.#pdf.rect(rx, ry, rw, rh, "D");
        else if (fillColor)
            this.#pdf.rect(rx, ry, rw, rh, "F");
    }   

    drawRoundedRectangle(x, y, width, height, rounding, thickness, strokeColor, fillColor)
    {        
        this.#pdf.setLineWidth(this.toLocal(thickness) * 0.5);
        this.#pdf.setDrawColor(strokeColor);
        this.#pdf.setFillColor(fillColor);
                
        const rx = this.toLocal(x + thickness * 0.5);
        const ry = this.toLocal(y + thickness * 0.5);
        const rw = this.toLocal(width - thickness);
        const rh = this.toLocal(height - thickness);
        const rr = this.toLocal(rounding);
        
        this.#pdf.roundedRect(rx, ry, rw, rh, rr, rr, "DF");
    }   

    drawVerticalText(text, x, y, font, fontSize, color)
    {
        this.#pdf.setFontSize(fontSize);
        this.#pdf.setFont(font, "bold");
        this.#pdf.setTextColor(color);
        
        const dimensions = this.#pdf.getTextDimensions(text);
        
        const rx = this.toLocal(x) + dimensions.h * 0.25;
        const ry = this.toLocal(y) + dimensions.w * 0.5;
        
        this.#pdf.text(text, rx, ry, { "angle": 90});
    }
    
    drawImage(image, x, y, width, height)
    {
        if (!image || !image.src)
            return;
        
        const xx = this.toLocal(x);
        const yy = this.toLocal(y);
        const ww = this.toLocal(width);
        const hh = this.toLocal(height);
        
        const sx = ww / image.width;
        const sy = hh / image.height;
        const scale = Math.min(sx, sy);
        
        const sWidth = image.width * scale;
        const sHeight = image.height * scale;
        const dx = xx + (ww - sWidth) * 0.5;
        const dy = yy + (hh - sHeight) * 0.5;
        
        this.#pdf.addImage(image, null, dx, dy, sWidth, sHeight);
    }

    toLocal(value)
    {
        return value * 210; /* in mm */
    }

    toLocalFontSize(pt)
    {
        return pt;
    }
}

function drawPreview(drawer, exerciseData1, exerciseData2)
{
    const aspectRatio = 1.41421356237;
    const margin = 0.05;
    const indent = 0.02;
    const titleWidth = 0.1;
    const textBoxIndent = 0.03;
    const imageSeperation = 0.01;
    const imageInset = 0.02;
    const outerWidth = 1.0 - 2.0 * margin;
    const outerHeight = outerWidth / aspectRatio;
    const innerX = margin + titleWidth;
    const innerY = margin + indent;
    const innerWidth = outerWidth - titleWidth - indent;
    const innerHeight = outerHeight - 2 * indent;
    const imageBoxY = innerY + textBoxIndent;
    const imageBoxWidth = (innerWidth - 2 * textBoxIndent - 2 * imageSeperation) / 3.0;
    const imageBoxHeight = (innerHeight - 2 * textBoxIndent - imageSeperation) / 2.0;
    
    const textBoxLeftMargin = innerX + textBoxIndent;
    const textBoxTopMargin = innerY + textBoxIndent + imageSeperation + imageBoxHeight;
    const textBoxWidth = innerWidth - 2 * textBoxIndent;
    const textBoxHeight = imageBoxHeight;
    
    drawer.clear();
    
    const drawFunction = (yOffset, exerciseData) => 
    {
        if (!exerciseData.enabled)
            return;
        
        drawer.drawRectangle(margin, yOffset + margin, outerWidth, outerHeight, 0.01, exerciseData.borderColor, exerciseData.backgroundColor);
        drawer.drawVerticalText(exerciseData.title, margin + titleWidth * 0.5, yOffset + margin + outerHeight * 0.5, "ComicNeue-Bold", 24, exerciseData.borderColor);

        // image rectangle
        drawer.drawRoundedRectangle(innerX, yOffset + innerY, innerWidth, innerHeight, 0.05, 0.01, exerciseData.borderColor, exerciseData.accentColor);
        for(let i = 0; i < 3; i += 1)
        {
            // draw the box
            const imageBoxX = textBoxLeftMargin + i * (imageSeperation + imageBoxWidth);
            drawer.drawRoundedRectangle(imageBoxX, yOffset + imageBoxY, imageBoxWidth, imageBoxHeight, 0.03, 0.01, exerciseData.borderColor, "white");


            // draw the image
            const imageX = imageBoxX + imageInset;
            const imageWidth = imageBoxWidth - 2 * imageInset;
            const imageHeight = imageWidth * 0.9;
            const imageY = imageBoxY + imageBoxHeight - imageHeight - imageInset;
            drawer.drawImage(exerciseData.images[i], imageX, yOffset + imageY, imageWidth, imageHeight);

            const circleRadius = (imageY - imageBoxY) * 0.25;
            const circleY = yOffset + (imageBoxY + imageY) * 0.5;

            // draw the circles
            for(let j = 0; j < 3; j += 1)
            {
                const bulletSelected = exerciseData.bullets[i] == (j + 1); 
                const circleX = imageBoxX + imageBoxWidth * 0.5 + (j - 1) * circleRadius * 3;
                drawer.drawCircle(circleX, circleY, circleRadius, 0.01, exerciseData.borderColor, (bulletSelected ? exerciseData.accentColor : "white"));
            }
        }


        // text field
        drawer.drawRoundedRectangle(textBoxLeftMargin, yOffset + textBoxTopMargin, textBoxWidth, imageBoxHeight, 0.025, 0.01, exerciseData.borderColor, "white");
        drawer.drawRectangle(textBoxLeftMargin + 0.0225, yOffset + textBoxTopMargin + textBoxHeight * 0.5 - 0.02, textBoxWidth - 0.045, 0.0025, 0, exerciseData.accentColor, exerciseData.accentColor);
        drawer.drawRectangle(textBoxLeftMargin + 0.0225, yOffset + textBoxTopMargin + textBoxHeight * 0.5 + 0.02, textBoxWidth - 0.045, 0.0025, 0, exerciseData.borderColor, exerciseData.borderColor);
        drawer.drawRectangle(textBoxLeftMargin + 0.02, yOffset + textBoxTopMargin + 0.02, textBoxWidth - 0.04, textBoxHeight - 0.04, 0.005, exerciseData.accentColor, null);
        drawer.drawRectangle(textBoxLeftMargin + 0.02, yOffset + textBoxTopMargin + 0.02, textBoxWidth - 0.04, textBoxHeight * 0.15, 0.005, exerciseData.accentColor, exerciseData.accentColor);
        drawer.drawRectangle(textBoxLeftMargin + 0.02, yOffset + textBoxTopMargin - 0.02 + textBoxHeight * 0.85, textBoxWidth - 0.04, textBoxHeight * 0.15, 0.005, exerciseData.accentColor, exerciseData.accentColor);    
    }
    
    drawFunction(0, exerciseData1);
    drawFunction(aspectRatio - margin * 2 - outerHeight, exerciseData2);
}