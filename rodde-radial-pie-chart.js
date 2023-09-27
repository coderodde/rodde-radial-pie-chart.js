'use strict';

(function() {
    class RadialPieChart extends HTMLElement {
        
        #maximumRadius;
        #startAngle;
        #emptyRadialPieChartColor;
        #radialPieChartBackgroundColor;
        
        constructor() {
            super();
            
            const shadow = this.attachShadow({ mode: "open" });
            const componentContainer = document.createElement("div");
            const radialPieChartCanvas = document.createElement("canvas");
            const maximumRadius = this.maximumRadius;
            
            radialPieChartCanvas.width  = 2 * maximumRadius;
            radialPieChartCanvas.height = 2 * maximumRadius;
            
            componentContainer.appendChild(radialPieChartCanvas);
            
            const entries = this.getElementsByTagName("entry");
            
            this.#drawEntries(radialPieChartCanvas, entries);
            shadow.appendChild(componentContainer);
        }
        
        get maximumRadius() {
            return this.getAttribute("maximumRadius") || 100;
        }
        
        get startAngle() {
            return this.getAttribute("startAngle") || 0.0;
        }
        
        get emptyRadialPieChartColor() {
            return this.getAttribute("emptyRadialPieChartColor") || "black";
        }
        
        get radialPieChartBackgroundColor() {
            return this.getAttribute("radialPieChartBackgroundColor") || "white";
        }
        
        connectedCallback() {
            console.log("connected");
        }   
        
        #drawEntries(canvas, entries) {
            const maximumRadius                 = this.maximumRadius;
            const startAngle                    = this.startAngle;
            const emptyRadialPieChartColor      = this.emptyRadialPieChartColor;
            const radialPieChartBackgroundColor = this.radialPieChartBackgroundColor;
            
            if (entries.length === 0) {
                this.#fillEmptyChart(canvas, emptyRadialPieChartColor);
            } else {
                this.#renderEntries(canvas, entries);
            }
        }
        
        #fillEmptyChart(canvas, color) {
            const width = canvas.width;
            const height = canvas.height;
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = width / 2;

            ctx.beginPath();
            ctx.arc(centerX,
                    centerY,
                    radius,
                    0.0,
                    2 * Math.PI, 
                    false);

            ctx.fillStyle = this.emptyRadialPieChartColor;
            ctx.fill();
        }
        
        #renderEntries(canvas, entries) {
            const anglePerEntry = 360.0 / entries.length;
            
            for (var i = 0, n = entries.length; i !== n; i++) {
                var entryStartAngle = -90.0 + parseFloat(this.startAngle)
                                            + anglePerEntry * i;
                                            
                var entryEndAngle = entryStartAngle + anglePerEntry;
                
                entryStartAngle = Math.PI * (entryStartAngle / 180.0);
                entryEndAngle = Math.PI * (entryEndAngle / 180.0);
                
                this.#drawEntry(canvas,
                                entries,
                                entryStartAngle,
                                entryEndAngle,
                                entries[i].getAttribute("value"),
                                entries[i].getAttribute("color"));
            }
        }
        
        #drawEntry(canvas,
                   entries,
                   entryStartAngle,
                   entryEndAngle,
                   value,
                   color) {
            const centerX = this.maximumRadius;
            const centerY = this.maximumRadius;
            const maximumValue = this.#findMaximumValue(entries);
            const radius = this.maximumRadius * (value / maximumValue);
            const ctx = canvas.getContext("2d");
            
            ctx.beginPath();
            ctx.arc(centerX, 
                    centerY, 
                    radius,
                    entryStartAngle, 
                    entryEndAngle);
                    
            ctx.lineTo(centerX, centerY);
            ctx.fillStyle = color;
            ctx.fill();
        }      

        #findMaximumValue(entries) {
            var maximumValue = 0;

            for (var i = 0, n = entries.length; i !== n; i++) {
                const tentativeMaximumValue = entries[i].getAttribute("value");
                maximumValue = Math.max(maximumValue, tentativeMaximumValue);
            }

            return maximumValue;
        }
    }
    
    customElements.define("radial-pie-chart", RadialPieChart);
})();