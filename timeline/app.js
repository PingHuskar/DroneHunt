const searchParam = new URLSearchParams(location.search)
const DEAULTMODE = `TH`
const MODE = searchParam.get(`mode`) ?? DEAULTMODE
const CHART_TITLE = `Drone Sender ${MODE}`
const SOURCE = `???`
const DRONENETRELEASEDATE = "5/3/2021"

// https://developer.mozilla.org/en-US/docs/Web/CSS/Viewport_concepts
document.getElementsByTagName("svg")[0].setAttribute(`width`,`${document.documentElement.clientWidth}`)
document.getElementsByTagName("svg")[0].setAttribute(`height`,`${document.documentElement.clientHeight}`)

const DATA = [];
const MaxDaysAgo = parseInt((Date.parse(new Date(DRONENETRELEASEDATE) - Date.parse(new Date()))/1000)/(60*60*24))
// for (let r of RAW) {
//     let DaysAgo = parseInt((Date.parse(new Date())/1000 - Date.parse(new Date(r.dt))/1000)/(60*60*24))
//     // console.log()
//     if ((parseInt(DaysAgo/100)+1)*100 > MaxDaysAgo) {
//         MaxDaysAgo = (parseInt(DaysAgo/100)+1)*100
//     }
// }
for (let r of RAW) {
    if (r.fac == MODE || MODE === DEAULTMODE) {
        DATA.push({ daysago: DRONENETRELEASEDATE, name: r.name, score: 0 })
        for (let record of r.score) {
            let DaysAgo = parseInt((Date.parse(new Date())/1000 - Date.parse(new Date(record.dt))/1000)/(60*60*24))
            
            DATA.push({ daysago: record.dt, name: r.name, score: record.dr })
        }
    }
}

// set canvas margins
leftMargin=150
topMargin=300

DATA.forEach((d) => {
    d.daysago = parseInt((Date.parse(new Date())/1000 - Date.parse(new Date(d.daysago))/1000)/(60*60*24))
});

console.log(DATA)

//scale xAxis 
const xAxisWidth = 450
var xExtent = d3.extent(DATA, d => d.daysago);
xScale = d3.scaleLinear().domain([0,d3.max(DATA, d => d.daysago) + 30]).range([2*topMargin+xAxisWidth,leftMargin])
// xScale = d3.scaleLinear().domain(xExtent).range([2*topMargin,leftMargin])

//scale yAxis
var yMax=d3.max(DATA,d=>d.score)
yScale = d3.scaleLinear().domain([0, yMax*1.2]).range([2*topMargin, 0])

//we will draw xAxis and yAxis next


//draw xAxis and xAxis label
xAxis = d3
    .axisBottom(xScale)

d3.select("svg")
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${topMargin*2})`)
    .call(xAxis)
    // .append("text")
    // .attr("x", 500) //middle of the xAxis
    // .attr("y", "50") // a little bit below xAxis
    // .text("Days Ago")

//yAxis and yAxis label
yAxis = d3.axisLeft()
    .scale(yScale)
    .ticks(5)

d3.select('svg')
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${leftMargin},0)`) //use variable in translate
    .call(yAxis)
    // .append("text")
    // .attr("transform", "rotate(-90)")
    // .attr("x", "-150")
    // .attr("y", "-50")
    // .attr("text-anchor", "end")
    // .text("SCORE")

//use .nest()function to group DATA so the line can be computed for each group
var sumstat = d3.nest() 
    .key(d => d.name)
    .entries(DATA);

// console.log(sumstat)

//set color pallete for different vairables
var mediaName = sumstat.map(d => d.key) 
var color = d3.scaleOrdinal().domain(mediaName).range(colorbrewer.Set2[6])

//select path - three types: curveBasis,curveStep, curveCardinal
d3.select("svg")
    .selectAll(".line")
    .append("g")
    .attr("class", "line")
    .data(sumstat)
    .enter()
    .append("path")
    .attr("d", function (d) {
        return d3.line()
            .x(d => xScale(d.daysago))
            .y(d => yScale(d.score)).curve(d3.curveBasis)
            (d.values)
    })
    .attr("fill", "none")
    .attr("stroke", d => color(d.key))
    .attr("stroke-width", 2)


//append circle 
d3.select("svg")
    .selectAll("circle")
    .append("g")
    .data(DATA)
    .enter()
    .append("circle")
    .attr("r", 6)
    .attr("cx", d => xScale(d.daysago))
    .attr("cy", d => yScale(d.score))
    .style("fill", d => color(d.name))

//append legends
var legend = d3.select("svg")
    .selectAll('g.legend')
    .data(sumstat)
    .enter()
    .append("g")
    .attr("class", "legend");

const legendPaddingLeft = 750 + xAxisWidth
const legendPaddingTop = 250

legend.append("circle")
    .attr("cx", legendPaddingLeft)
    .attr('cy', (d, i) => i * 30 + legendPaddingTop)
    .attr("r", 6)
    .style("fill", d => color(d.key))

legend.append("text")
    .attr("x", legendPaddingLeft+10)
    .attr("y", (d, i) => i * 30 + legendPaddingTop+5)
    .text(d => d.key)

//append title
d3.select("svg")
    .append("text")
    .attr("x", 700)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .text(CHART_TITLE)
    .style("fill", "black")
    .style("font-size", 28)
    .style("font-family", "Arial Black")

//apend source
d3.select("svg")
    .append("text")
    .attr("x", 70)
    .attr("y", screen.height-200)
    .text(`About DroneNet: Dronenet | Ingress Wiki | Fandom`)
    .style("fill", "black")
    .style("font-size", 14)
    .style("font-family", "Arial Black")
    .style("cursor", "pointer")
    .on('click', function () {
        open(`https://ingress.fandom.com/wiki/Dronenet`,`_blank`)
    })
