// Inspired from https://cantwell-tom.medium.com/flood-fill-and-line-tool-for-html-canvas-65e08e31aec6
// and completed using GitHub Copilot's help

// paint Bucket
class Bucket {
    /**
     * The class for the paint bucket tool.
     * 
     * @param position
     * @param settings
     */
    constructor(position, settings) {
        this.position = position;
        this.settings = settings;
        this.toPaint = [];
        this.painted = [];
    }

    /**
     * Render the area painted by the bucket.
     * 
     * @param ctx
     */
    render(ctx) {
        if (this.painted.length > 0) return this.rerender(ctx); // if painted area has already been calculated, just rerender it
        var p = ctx.getImageData(this.position.x, this.position.y, 1, 1).data;
        const prevColor = {
            rgb: [p[0], p[1], p[2]],
            hex: "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6)
        }
        if (prevColor.hex === this.settings.color) return; // if the color is already the same, don't paint
        //console.log("prevColor: " + prevColor.hex, "- color: " + this.settings.color)
        ctx.fillStyle = this.settings.color;

        const processed = new Set();
        this.toPaint.push(this.position);
        processed.add(`${this.position.x},${this.position.y}`)
        while (this.toPaint.length > 0) {
            var p = this.toPaint.pop();
            var x = p.x;
            var y = p.y;
            var data = ctx.getImageData(x, y, 1, 1).data;
            var color = [data[0], data[1], data[2]];
            if (colorsAreClose(color, prevColor.rgb, 0.7)) {
                //console.log("PAINTED: prevColor: " + prevColor.rgb.join(","), "- color: " + hexToRgb(this.settings.color).join(","), `\nposition: (${x}, ${y}) - positionColor: (`, color.join(","), ')');
                ctx.fillRect(x, y, 1, 1);
                this.painted.push({x: x, y: y});
                if (!processed.has(`${x+1},${y}`) && x+1 < ctx.canvas.width){
                    this.toPaint.push({x: x + 1, y: y});
                    processed.add(`${x+1},${y}`)
                }
                if (!processed.has(`${x-1},${y}`) && x-1 >= 0){
                    this.toPaint.push({x: x - 1, y: y});
                    processed.add(`${x-1},${y}`)
                }
                if (!processed.has(`${x},${y+1}`) && y+1 < ctx.canvas.height){
                    this.toPaint.push({x: x, y: y + 1});
                    processed.add(`${x},${y+1}`)
                }
                if (!processed.has(`${x},${y-1}`) && y-1 >= 0){
                    this.toPaint.push({x: x, y: y - 1});
                    processed.add(`${x},${y-1}`)
                }
            } /*else {
                console.log("NOT PAINTED:", `\nposition: (${x}, ${y}) - positionColor: (`, color.join(","), ')', "because distance is", colorsNormalizedDistance(color, prevColor.rgb))
            }*/
        }
    }

    /**
     * Rerenders the painted area.
     * It is necessary here and not in shapes bc of computational cost.
     * @param ctx
     */
    rerender(ctx) {
        ctx.fillStyle = this.settings.color;
        for (let i = 0; i < this.painted.length; i++) {
            ctx.fillRect(this.painted[i].x, this.painted[i].y, 1, 1);
        }
    }
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function hexToRgb(hex) {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    return [r, g, b];
}

function colorsAreClose(color1, color2, thresh, normalized = true){
    if (color1 == color2) return true;
    if (typeof color1 == "string") color1 = hexToRgb(color1);
    if (typeof color2 == "string") color2 = hexToRgb(color2);
    if (normalized) return colorsNormalizedDistance(color1, color2) < thresh;
    return Math.abs(color1[0] - color2[0]) < thresh || Math.abs(color1[1] - color2[1]) < thresh || Math.abs(color1[2] - color2[2]) < thresh;
}

function colorsNormalizedDistance(color1, color2){
    return Math.sqrt(Math.pow(color1[0] - color2[0], 2) + Math.pow(color1[1] - color2[1], 2) + Math.pow(color1[2] - color2[2], 2)) / 255;
}