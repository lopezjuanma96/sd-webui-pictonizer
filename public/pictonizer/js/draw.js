// UTILS

const getStarFilledSvg = () => `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
</svg>
`

const getStarSvg = () => `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
    <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
</svg>
`

const MAX_STROKE_WIDTH = 16;
const MIN_STROKE_WIDTH = 1;

// Code Extracted from: https://github.com/JonSteinn/Web-Paint/blob/master/assets/js/draw.js

const updateEditCanvas = () => {
    //SHAPE DRAWER
    let drawer = {
        shapes: [],
        undoneShapes: [],
        selectedShape: 'pencil',
        canvas: document.getElementById('editCanvas'),
        ctx: document.getElementById('editCanvas').getContext('2d'),
        // Gets the startup for the image, which will be the generated picto and should also be the edited image, so we can redraw it later
        startup: document.getElementById('editCanvas').getContext('2d').getImageData(0, 0, document.getElementById('editCanvas').width, document.getElementById('editCanvas').height),
        selectedElement: null,
        availableShapes: {
            RECTANGLE: 'rectangle',
            OVAL: 'oval',
            CIRCLE: 'circle',
            LINE: 'line',
            PENCIL: 'pencil',
            DrawnText: 'text',
            MOVE: 'move' // TODO
        },
        settings: {
            color: '#000000',
            filled: false,
            width: 1,
            font: '12pt sans-serif'
        },
        /**
         * Deep copy of settings.
         * 
         * @returns {{color: string, filled: boolean, width: number, font: string}}
         */
        currentSettings: function () {
            return {
                color: drawer.settings.color.slice(0, drawer.settings.color.length),
                filled: drawer.settings.filled,
                width: drawer.settings.width,
                font: drawer.settings.font.slice(0, drawer.settings.font.length)
            };
        },
        /**
         * Draw all stored shapes.
         */
        drawAllStoredShapes: function () {
            for (let i = 0; i < drawer.shapes.length; i++) {
                if (drawer.shapes[i]) {
                    drawer.shapes[i].render(drawer.ctx);
                }
            }
        },
        /**
         * Draw the selected shape in its current state.
         */
        drawSelected: function () {
            if (drawer.selectedElement) {
                drawer.selectedElement.render(drawer.ctx);
            }
        },
        /**
         * Toggles the fill setting.
         */
        toggleFill: function () {
            drawer.settings.filled = !drawer.settings.filled;
            if (drawer.selectedElement) drawer.selectedElement.settings = drawer.currentSettings();
            return drawer.settings.filled;
        },
        /**
         * Changes the color setting.
         */
        setColor: function (color) {
            drawer.settings.color = color;
            if (drawer.selectedElement) drawer.selectedElement.settings = drawer.currentSettings();
        },
        /**
         * Increase the stroke width.
         */
        increaseStroke: function () {
            drawer.settings.width = Math.min(drawer.settings.width + 1, MAX_STROKE_WIDTH);
            if (drawer.selectedElement) drawer.selectedElement.settings = drawer.currentSettings();
            return drawer.settings.width;
        },
        /**
         * Decrease the stroke width.
         */
        decreaseStroke: function () {
            drawer.settings.width = Math.max(drawer.settings.width - 1, MIN_STROKE_WIDTH);
            if (drawer.selectedElement) drawer.selectedElement.settings = drawer.currentSettings();
            return drawer.settings.width;
        },
        /**
         * Redraws all elements to the canvas.
         */
        redraw: function () {
            // Wipe everything off the canvas
            drawer.ctx.putImageData(drawer.startup, 0, 0);
            drawer.drawAllStoredShapes();
            drawer.drawSelected();
        },
        /**
         * Add the last undone shape back to the list of shapes.
         */
        redo: function () {
            if (drawer.undoneShapes.length > 0) {
                drawer.shapes.push(drawer.undoneShapes.pop());
                drawer.redraw();
            }
        },
        /**
         * Remove the last shape drawn and place in temporary redo storage.
         */
        undo: function () {
            if (drawer.shapes.length > 0) {
                drawer.undoneShapes.push(drawer.shapes.pop());
                drawer.redraw();
            }
        },
        /**
         * Clear all shapes from the canvas.
         */
        clear: function () {
            drawer.shapes = [];
            drawer.undoneShapes = [];
            drawer.redraw();
        }
    }
    //END SHAPE DRAWER

    //SHAPE MOUSE EVENTS
    drawer.canvas.addEventListener('mousedown',
        /**
         * Starts drawing the selected shape.
         * 
         * @param {MouseEvent} e
         */
        function (e) {
            const mousePos = {x: e.offsetX, y: e.offsetY};
            switch (drawer.selectedShape) {
                case drawer.availableShapes.RECTANGLE:
                    drawer.selectedElement = new Rectangle(mousePos, drawer.currentSettings(), 0, 0);
                    break;
                case drawer.availableShapes.OVAL:
                    drawer.selectedElement = new Oval(mousePos, drawer.currentSettings(), 0, 0);
                    break;
                case drawer.availableShapes.CIRCLE:
                    drawer.selectedElement = new Circle(mousePos, drawer.currentSettings(), 0);
                    break;
                case drawer.availableShapes.LINE:
                    drawer.selectedElement = new Line(mousePos, drawer.currentSettings(), mousePos);
                    break;
                case drawer.availableShapes.PENCIL:
                    drawer.selectedElement = new Pencil(mousePos, drawer.currentSettings(), mousePos);
                    break;
                case drawer.availableShapes.DrawnText:
                    // If we are already drawing text, we are done and draw a new one
                    if (drawer.selectedElement) {
                        drawer.shapes.push(drawer.selectedElement);
                        drawer.undoneShapes.splice(0, drawer.undoneShapes.length);
                    }
                    drawer.selectedElement = new DrawnText(pos, drawer.currentSettings());
                    break;
                case drawer.availableShapes.MOVE:
                    // TODO
                    break;
            }
        })

    drawer.canvas.addEventListener('mousemove',
        /**
         * Updates the selected shape as the mouse moves.
         * 
         * @param {MouseEvent} e
         */
        function (e) {
            if (drawer.selectedElement && drawer.selectedShape !== drawer.availableShapes.DrawnText) {
                const mousePos = {x: e.offsetX, y: e.offsetY};
                drawer.selectedElement.resize(mousePos.x, mousePos.y);
                drawer.redraw();
            }
        })

    drawer.canvas.addEventListener('mouseup',
        /**
         * Stops drawing the selected shape.
         * 
         * @param {MouseEvent} e
         */
        function (e) {
            if (drawer.selectedElement && drawer.selectedShape !== drawer.availableShapes.DrawnText) {
                drawer.shapes.push(drawer.selectedElement);
                drawer.selectedElement = null;
                drawer.undoneShapes.splice(0, drawer.undoneShapes.length);
            }
        })
    //END SHAPE MOUSE EVENTS

    //KEYPRESS EVENTS
    function textKeyPress(key){
        if (key === 'Enter'){
            drawer.shapes.push(drawer.selectedElement);
            drawer.selectedElement = null;
            drawer.undoneShapes.splice(0, drawer.undoneShapes.length);
        } else {
            drawer.selectedElement.resize(key);
            drawer.redraw();
        }
    }

    document.addEventListener('keydown',
        /**
         * Handles keypress events.
         * 
         * @param {KeyboardEvent} e
         */
        function (e) {
            if (drawer.selectedElement && drawer.selectedShape === drawer.availableShapes.DrawnText){
                textKeyPress(e.key);
            } else if (e.key.toUpperCase() === 'Z' && e.ctrlKey) {
                if (e.shiftKey) drawer.undo();
                else drawer.redo();
            }
        })
    //END KEYPRESS EVENTS

    //NAVBAR EVENTS    
    const editNavButtons = document.getElementsByClassName('editNavButton');
    for(let i = 0; i < editNavButtons.length; i++){
        const element = editNavButtons[i];
        if (element.classList.contains('editNavButtonDisabled')) continue;
        else if (element.dataset.shape) {
            element.addEventListener('click',
                /**
                 * Toggles the selected shape.
                 * 
                 * @param {MouseEvent} e 
                 */
                function (e) {
                    if (element.dataset.shape === drawer.selectedShape) {
                        drawer.selectedShape = null;
                        if (drawer.selectedElement) {
                            drawer.shapes.push(drawer.selectedElement);
                            drawer.selectedElement = null;
                            drawer.undoneShapes.splice(0, drawer.undoneShapes.length);
                        }
                        drawer.redraw();
                        element.classList.remove('editNavButtonActive')
                    } else {
                        drawer.selectedShape = element.dataset.shape;
                        const prevActive = document.getElementsByClassName('editNavButtonActive')[0]
                        if (prevActive) prevActive.classList.remove('editNavButtonActive')
                        element.classList.add('editNavButtonActive')
                    }
                })
        }
        else if (element.getAttribute('id') === 'editFillToggle') {
            element.addEventListener('click',
                /**
                 * Toggles the fill of the selected shape.
                 * 
                 * @param {MouseEvent}
                 */
                function (e) {
                    const isFilled = drawer.toggleFill();
                    if (isFilled) element.innerHTML = getStarFilledSvg();
                    else element.innerHTML = getStarSvg();
                })
        }
        else if (element.getAttribute('id') === 'editColor') {
            element.addEventListener('change',
                /**
                 * Changes the color of the selected shape.
                 * 
                 * @param {MouseEvent}
                 */
                function (e) {
                    drawer.setColor(e.target.value);
                })
        }
        else if (element.getAttribute('id') === 'editUndo') {
            element.addEventListener('click',
                /**
                 * Undoes the last action.
                 * 
                 * @param {MouseEvent}
                 */
                function (e) {
                    drawer.undo();
                    // ADD CHECK FOR IF THERE IS NOTHING TO UNDO
                })
        }
        else if (element.getAttribute('id') === 'editRedo') {
            element.addEventListener('click',
                /**
                 * Redoes the last action.
                 * 
                 * @param {MouseEvent}
                 */
                function (e) {
                    drawer.redo();
                    // ADD CHECK FOR IF THERE IS NOTHING TO REDO
                })
        }
        else if (element.getAttribute('id') === 'editClear') {
            element.addEventListener('click',
                /**
                 * Clears the canvas.
                 * 
                 * @param {MouseEvent}
                 */
                function (e) {
                    drawer.clear();
                })
        }
        else if (element.classList.contains('editStrokeNavButton')) {
            element.addEventListener('click',
                /**
                 * Changes the stoke width.
                 * 
                 * @param {MouseEvent}
                 */
                function (e) {
                    const editStrokeValueNumber = document.getElementById("editStrokeValueNumber");
                    var value = parseInt(editStrokeValueNumber.innerText);
                    if (element.dataset.stroke === "increase") value = drawer.increaseStroke();
                    else if (element.dataset.stroke === "decrease") value = drawer.decreaseStroke();
                    editStrokeValueNumber.innerText = value;
                })
        }
    }
    //END NAVBAR EVENTS
}
