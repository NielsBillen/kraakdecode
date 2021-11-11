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
    
    toLocalFontSize(pt)
    {
        throw new Error("Method toLocal must be implemented!");
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
        ctx.stroke();
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
          
        ctx.stroke();
        ctx.fill();
    }

    drawVerticalText(text, x, y, font, fontSize, color)
    {
        const ctx = this.#canvas.getContext("2d");
        ctx.font = "" + this.toLocalFontSize(fontSize) +'pt "ComicNeue-Bold"';
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

    drawRectangle(x, y, width, height, thickness, strokeColor, fillColor)
    {        
        this.#pdf.setLineWidth(this.toLocal(thickness) * 0.5);
        this.#pdf.setDrawColor(strokeColor);
        this.#pdf.setFillColor(fillColor);
                
        const rx = this.toLocal(x + thickness * 0.5);
        const ry = this.toLocal(y + thickness * 0.5);
        const rw = this.toLocal(width - thickness);
        const rh = this.toLocal(height - thickness);
        
        this.#pdf.rect(rx, ry, rw, rh, "DF");
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
        
        const rx = this.toLocal(x) + dimensions.h * 0.5;
        const ry = this.toLocal(y) + dimensions.w * 0.5;
        
        this.#pdf.text(text, rx, ry, { "angle": 90});
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

function drawPreview(drawer)
{
    const aspectRatio = 1.41421356237;
    const margin = 0.1;
    const indent = 0.02;
    const textBoxIndent = 0.03;
    const imageSeperation = 0.01;
    const outerWidth = 1.0 - 2.0 * margin;
    const outerHeight = outerWidth / aspectRatio;
    const innerTopMargin = margin + indent;
    const innerLeftMargin = 2 * margin;
    const innerWidth = outerWidth - margin - indent;
    const innerHeight = outerHeight - 2 * indent;
    const imageBoxTopMargin = innerTopMargin + textBoxIndent;
    const imageBoxWidth = (innerWidth - 2 * textBoxIndent - 2 * imageSeperation) / 3.0;
    const imageBoxHeight = (innerHeight - 2 * textBoxIndent - imageSeperation) / 2.0;
    
    const textBoxLeftMargin = innerLeftMargin + textBoxIndent;
    const textBoxTopMargin = innerTopMargin + textBoxIndent + imageSeperation + imageBoxHeight;
    const textBoxWidth = innerWidth - 2 * textBoxIndent;
    const textBoxHeight = imageBoxHeight;
    
    
    drawer.clear();
    drawer.drawRectangle(margin, margin, outerWidth, outerHeight, 0.01, "#7cb2d1", "aqua");
    drawer.drawVerticalText("Kraak de code", 0.15, 0.1 + 0.4 / aspectRatio, "ComicNeue-Bold", 24, "black");
    drawer.drawRoundedRectangle(innerLeftMargin, margin + indent, innerWidth, innerHeight, 0.05, 0.01, "#7cb2d1", "aqua");
    
    for(let i = 0; i < 3; i += 1)
    {
        let imageBoxX = textBoxLeftMargin + i * (imageSeperation + imageBoxWidth);
        drawer.drawRoundedRectangle(imageBoxX, imageBoxTopMargin, imageBoxWidth, imageBoxHeight, 0.025, 0.01, "#7cb2d1", "white");
    }

    drawer.drawRoundedRectangle(textBoxLeftMargin, textBoxTopMargin, textBoxWidth, imageBoxHeight, 0.025, 0.01, "#7cb2d1", "white");
}