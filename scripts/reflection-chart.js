import * as d3 from 'd3';
import * as geometric from 'geometric';

export default class ReflectionChart {
    constructor(id) {
        this.id = id
        this.width = '' 
        this.height = '' 

        this.margin = {
            top: 50,
            right: 20,
            bottom: 50,
            left: 20
        }

        //store elements to pass in
        this.options = {
            radius: 10,
            surfaceAngle: -90,
            surfaceStartPoint: '',
            surfaceEndPoint: '',
            startAngle: 235,
            reflectedAngle: '',
            distance: 200,
            startPoint: '',
            reflectedPoint: '',
        }
    }


    create = () => {

        //empty svg if its been defined; handle resizing
        if (this.svg) {
            this.clear()
        }        

        this.draw(false)

        let targetResizeFn = window[`${this.id}-resizeFn`]

        window.removeEventListener("resize", targetResizeFn, false)
  
        window.addEventListener('resize', window[`${this.id}-resizeFn`] = (e) => {
          setTimeout((e) => {
            this.draw(true)
          }, 100)
  
        } , false)
    }

    throttle = (fn, wait) => {
        let inThrottle, lastFn, lastTime;
        return function() {
          const context = this,
            args = arguments;
          if (!inThrottle) {
            fn.apply(context, args)
            lastTime = Date.now()
            inThrottle = true
          } else {
            clearTimeout(lastFn)
            lastFn = setTimeout(function() {
              if (Date.now() - lastTime >= wait) {
                fn.apply(context, args)
                lastTime = Date.now()
              }
            }, Math.max(wait - (Date.now() - lastTime), 0))
          }
        }
    }

    draw = (redraw) => {

        //add svg to div based on height and width
        const container = document.getElementById(this.id)
        let heightCurrent = container.offsetHeight
        container.style.height = heightCurrent + "px"

        let margin = this.margin
        const width = container.offsetWidth - margin.right - margin.left
        this.margin.right = width < 500 ? 50 : 0
  
        const height = Math.max(200, container.offsetHeight - margin.top - margin.bottom)
  
        this.width = width
        this.height = height


        //arrow head settings
        const markerBoxWidth = 5;
        const markerBoxHeight = 5;
        const refX = markerBoxWidth / 2;
        const refY = markerBoxHeight / 2;
        const arrowPoints = [[0, 0], [0, 5], [5, 2.5]];
        

        //destructuring
        const  { options } = this

        options.center = [this.width / 2, this.height / 2];
        options.end = [this.width, this.height / 2];
        options.surfaceStartPoint = geometric.pointTranslate(options.end, options.surfaceAngle, -120);
        options.surfaceEndPoint = geometric.pointTranslate(options.end, options.surfaceAngle, 120);


        //drag listener
        const startDragGenerator = d3.drag()
            .on("drag", (event) => {
            let x = Math.round(event.x), 
                y = Math.round(event.y);
            options.startPoint = [
                x < options.radius ? options.radius : x > this.width - options.radius ? this.width - options.radius : x,
                y < options.radius ? options.radius : y > this.height - options.radius ? this.height - options.radius : y
            ];
            options.distance = geometric.lineLength([options.center, options.startPoint]);
            options.startAngle = geometric.lineAngle([options.center, options.startPoint]);
            this.update(options);
        });
    

        //if it's being drawn for the first time, create elements
        if (!redraw) {

            this.svg = d3.select(container).append("svg")
                .attr("width", container.offsetWidth)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")")

            //black line that lines reflect off 
            options.mirror = this.svg.append("line")
                .attr("class", "surface-line")

            options.startLine = this.svg.append("line")
                .attr("class", "start-angle");
                
                
            options.startHandle = this.svg.append("circle")
                .attr("class", "start-handle")
                .attr("r", options.radius)
                .call(startDragGenerator);


            options.reflectedLine = this.svg.append("line")
                .attr("class", "reflect-angle")


        }

        //add width, heights, positions etc regardless if it's being redrawn or not
        this.svg.attr("width", container.offsetWidth)
            .attr("height", height)

        //add arrow definitions
        this.svg
            .append('defs')
            .append('marker')
            .attr('id', 'arrow')
            .attr('viewBox', [0, 0, markerBoxWidth, markerBoxHeight])
            .attr('refX', refX)
            .attr('refY', refY)
            .attr('markerWidth', markerBoxWidth)
            .attr('markerHeight', markerBoxHeight)
            .attr('orient', 'auto-start-reverse')
            .append('path')
            .attr('d', d3.line()(arrowPoints))
            .attr('fill', '#ff6347');    
        
        options.mirror
            .attr("x1", options.surfaceStartPoint[0])
            .attr("y1", options.surfaceStartPoint[1])
            .attr("x2", options.surfaceEndPoint[0])
            .attr("y2", options.surfaceEndPoint[1]);

        options.startLine            
            .attr("x2", options.end[0])
            .attr("y2", options.end[1]);

        options.reflectedLine
            .attr("x2", options.end[0])
            .attr("y2", options.end[1])
            .attr("marker-start", "url(#arrow)");       
                    
        this.update(options)
    }

    update = (options) => {

        options.reflectedAngle = geometric.angleReflect(options.startAngle - 180, options.surfaceAngle); // subtract 180 from start angle so that it begins at start point
        options.startPoint = geometric.pointTranslate(options.center, options.startAngle, options.distance);
        options.reflectedPoint = geometric.pointTranslate(options.center, options.reflectedAngle, options.distance);
    

        options.startLine
            .attr("x1", options.startPoint[0])
            .attr("y1", options.startPoint[1]);
    
        options.startHandle
            .attr("transform", "translate(" + options.startPoint + ")");
    
        options.reflectedLine
            .attr("x1", options.reflectedPoint[0])
            .attr("y1", options.reflectedPoint[1]);
    }


    //empty the svg 
    clear = () => {
        this.svg && this.svg.selectAll("*").remove();
        let targetResizeFn = window[`${this.id}-resizeFn`]
  
        if (targetResizeFn) {
          window.removeEventListener("resize", targetResizeFn, false)
        }
  
    }

}