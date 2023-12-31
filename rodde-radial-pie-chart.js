'use strict';

(function() {
    class RadialPieChart extends HTMLElement {
        
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
			
			// Set the mutation observer:
			const observerConfig = { 
				attributes: true, 
				childList:  true,
				subtree:    true,
			};
			
			const observerCallback = (mutationList, observer) => {
				for (const mutation of mutationList) {
					// If any mutation, just fix and exit.
					this.#drawEntries(radialPieChartCanvas, entries);
					break;
				}	
			};
	
			const pieCharts = document.getElementsByTagName("radial-pie-chart");
			const observer = new MutationObserver(observerCallback);
			observer.disconnect();
			
			for (var i = 0, n = pieCharts.length; i !== n; i++) {
				observer.observe(pieCharts[i], observerConfig);
			}
			
			observer.observe(document.body, observerConfig);
        }
        
        get maximumRadius() {
            return this.getAttribute("maximumRadius") || 100;
        }
        
        get startAngle() {
            return this.getAttribute("startAngle") || 0.0;
        }
		
        get backgroundColor() {
            return this.getAttribute("backgroundColor") || "white";
        }
        
		get canvasBackgroundColor() {
			return this.getAttribute("canvasBackgroundColor") || "white";
		}
        
        #drawEntries(canvas, entries) {
			this.#fillEmptyChart(canvas);
			
			if (entries.length !== 0) {
				this.#renderEntries(canvas, entries);
			}
        }
        
        #fillEmptyChart(canvas, color) {
			canvas.width = 
			canvas.height = 2 * this.maximumRadius;
			
            const width = canvas.width;
            const height = canvas.height;
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = width / 2;
			const ctx = canvas.getContext("2d");
			
			ctx.fillStyle = this.canvasBackgroundColor;
			ctx.fillRect(0, 0, width, height);

            ctx.beginPath();
            ctx.arc(centerX,
                    centerY,
                    radius,
                    0.0,
                    2 * Math.PI, 
                    false);

            ctx.fillStyle = this.backgroundColor;
            ctx.fill();
        }
        
        #renderEntries(canvas, entries) {
			this.#fillEmptyChart(canvas, this.backgroundColor);
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