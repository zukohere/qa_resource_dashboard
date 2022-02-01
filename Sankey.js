drawChart()
    function drawChart() {
      
      // Data
      d3.json("json_data.json", function (dataset) {
        dataset = dataset.sankeyData
  // Accessors
  console.log("hello")
  const sexAccessor = d => d.sex
  const sexes = ["On Time","Late"]
  const sexIds = d3.range(sexes.length)

  const educationAccessor = d => d.education
  let educationNames = [...new Set([].concat.apply([],Array.from(dataset,d=> Object.keys(d.endpoint))))]
  console.log(educationNames)
  const educationIds = d3.range(educationNames.length)
  console.log(educationIds)
  const sesAccessor = d => d.ses
  let sesNames = [...new Set(Array.from(dataset,d=> d.ses))]
  console.log(sesNames)
    
  const sesIds = d3.range(sesNames.length)

  allPaths = {} 
  dataset.forEach(startingPoint => {
      educationNames.forEach(edu => 
      {allPaths[[getStatusKey(startingPoint),edu].join("--")]=startingPoint.endpoint[edu]}
  )})
//   console.log(allPaths)
  // probabilities
//   const stackedProbabilities = {}
//   dataset.forEach(startingPoint => {
//     const key = getStatusKey(startingPoint)
//     // let stackedProbability = 0
//     // stackedProbabilities[key] = educationNames.map((education, i) => {
//     //   stackedProbability += (startingPoint.endpoint[education]/100)
//     //   if (i == educationNames.length - 1) {
//     //     // account for rounding
//     //     return 1
//     //   } else {
//     //     return stackedProbability
//     //   }
//     // })
//   })
  
  // persons
  let currentPersonId = 0
  let peopleLookup = {}
  dataset.forEach(startingPoint => {
    educationNames.forEach(edu => 
    {peopleLookup[[getStatusKey(startingPoint),edu].join("--")]=0}
)})
        function generatePerson(elapsed,sex,ses,edu) {
          currentPersonId++
          
        //   const statusKey = getStatusKey({
        //     sex: sexes[sex],
        //     ses: sesNames[ses],
        //   })
          
        //   const probabilities = stackedProbabilities[statusKey]
          // console.log("female--Horn")
        //   const education = d3.bisect(probabilities, Math.random())
        // const education = 0
          education = edu
          return {
            id: currentPersonId,
            sex,
            ses,
            education,
            startTime: elapsed + getRandomNumberInRange(-0.1, 0.1),
            yJitter: getRandomNumberInRange(-15, 15)

          }
        }
  
  // dimensions
  let dimensions = {
    width: 1200,
    height: 500,
    margin: {
      top: 10,
      right: 200,
      bottom: 10,
      left: 120,
    },
    pathHeight: 50,
    endsBarsWidth: 15,
    endingBarPadding: 3,
  }
  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom
  
  // canvas
  const wrapper = d3.select("#wrapper")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
  
  const bounds = wrapper.append("g")
    .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)
  
  // scales
  const xScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, dimensions.boundedWidth])
    .clamp(true)
  
  const startYScale = d3.scaleLinear()
    .domain([sesIds.length, -1])
    .range([0, dimensions.boundedHeight])
  const endYScale = d3.scaleLinear()
    .domain([educationIds.length, -1])
    .range([0, dimensions.boundedHeight])
  
  const linkLineGenerator = d3.line()
    .x((d, i) => i * (dimensions.boundedWidth / 5))
    .y((d, i) => i <= 2
      ? startYScale(d[0])
      : endYScale(d[1])
    )
    .curve(d3.curveMonotoneX)
  
  const yTransitionProgressScale = d3.scaleLinear()
    .domain([0.45, 0.55])
    .range([0, 1])
    .clamp(true)
  
  const colorScale = d3.scaleLinear()
    .domain(d3.extent(sesIds))
    .range(["#12CBC4", "#B53471"])
    .interpolate(d3.interpolateHcl)
  
  // draw data
  const linkOptions = d3.merge(
    sesIds.map(startId => (
      educationIds.map(endId => (
        new Array(6).fill([startId, endId])
      ))
    ))
  )
  const linksGroup = bounds.append("g")
  const links = linksGroup.selectAll(".category-path")
    .data(linkOptions)
    .enter().append("path")
      .attr("class", "category-path")
      .attr("d", linkLineGenerator)
      .attr("stroke-width", dimensions.pathHeight)  
  
 // draw peripherals
 const trianglePoints = [
    " 0, 0",
    " 0, 0",
    " 0, 0",
  ].join(" ")


  const startingLabelsGroup = bounds.append("g")
    .style("transform", "translateX(-20px)")
  const startingLabels = startingLabelsGroup.selectAll(".start-label")
    .data(sesIds)
    .enter().append("text")
    .attr("class", "label start-label")
    .attr("y", (d, i) => startYScale(i))
    .text((d, i) => sentenceCase(sesNames[i]))
  const startLabel = startingLabelsGroup.append("text")
    .attr("class", "start-title")
    .attr("y", startYScale(sesIds[sesIds.length - 1]) - 65)
    .text("Origin")
  const startLabelLineTwo = startingLabelsGroup.append("text")
    .attr("class", "start-title")
    .attr("y", startYScale(sesIds[sesIds.length - 1]) - 50)
    .text("Region")
  const startingBars = startingLabelsGroup.selectAll(".start-bar")
    .data(sesIds)
    .enter().append("rect")
    .attr("x", 20)
    .attr("y", d => startYScale(d) - (dimensions.pathHeight / 2))
    .attr("width", dimensions.endsBarsWidth)
    .attr("height", dimensions.pathHeight)
    .attr("fill", colorScale)

  const endingLabelsGroup = bounds.append("g")
    .style("transform", `translateX(${dimensions.boundedWidth + 20}px)`)

  const endingLabels = endingLabelsGroup.selectAll(".end-label")
    .data(educationNames)
    .enter().append("text")
    .attr("class", "label end-label")
    .attr("y", (d, i) => endYScale(i) - 15)
    .text(d => d)

    const legendGroup = bounds.append("g")
.attr("class", "legend")
.attr("transform", `translate(${dimensions.boundedWidth}, 5)`)

const femaleLegend = legendGroup.append("g")
.attr("transform", `translate(${-dimensions.endsBarsWidth * 1.5 + dimensions.endingBarPadding + 1}, 0)`)

var triangle = d3.symbol()
      .type(d3.symbolTriangle)
      .size(50)
      
femaleLegend.append("path")
.attr("d", triangle)
.attr("transform", "translate(-7, 2)")

femaleLegend.append("text")
.attr("class", "legend-text-left")
.text("On Time")
.attr("x", -20)
.attr("y", 4)

femaleLegend.append("line")
.attr("class", "legend-line")
.attr("x1", -dimensions.endsBarsWidth / 2 + 19)
.attr("x2", -dimensions.endsBarsWidth / 2 + 19)
.attr("y1", 12)
.attr("y2", 37)

const maleLegend = legendGroup.append("g")
.attr("transform", `translate(${-dimensions.endsBarsWidth / 2 - 4}, 0)`)

maleLegend.append("circle")
.attr("r", 5.5)
.attr("transform", "translate(5, 0)")

maleLegend.append("text")
.attr("class", "legend-text-right")
.text("Late")
.attr("x", 15)
.attr("y", 4)

maleLegend.append("line")
.attr("class", "legend-line")
.attr("x1", -dimensions.endsBarsWidth / 2 - 6)
.attr("x2", -dimensions.endsBarsWidth / 2 - 6)
.attr("y1", 12)
.attr("y2", 37)


  // draw data
  const femaleMarkers = endingLabelsGroup.selectAll(".female-marker")
    .data(educationIds)
    .enter().append("circle")
    .attr("class", "ending-marker female-marker")
    .attr("r", 5.5)
    .attr("cx", 5)
    .attr("cy", d => endYScale(d) + 5)

    var triangle = d3.symbol()
      .type(d3.symbolTriangle)
      .size(50)
      
  const maleMarkers = endingLabelsGroup.selectAll(".male-marker")
    .data(educationIds)
    .enter().append("path")
    .attr("class", "ending-marker male-marker")
    .attr("d", triangle)
    .attr("transform", d => `translate(5, ${endYScale(d) + 20})`)

  // number of units flowing into system
  const maxPeople = 100
  let people = []
  const markersGroup = bounds.append("g")
    .attr("class", "markers-group")


  const endingBarGroup = bounds.append("g")
    .attr("transform", `translate(${dimensions.boundedWidth}, 0)`)

  function updateMarkers(elapsed) {
    //keep labels from writing on top of each other.
    endingLabelsGroup.selectAll(".ending-value").html("")
    //

    const xProgressAccessor = d => (elapsed - d.startTime) / 5000
    // if (people.length < maxPeople) {
        // console.log(d3.sum(Object.values(peopleLookup))+" less than "+d3.sum(Object.values(allPaths)) )
        // console.log(d3.sum(Object.values(peopleLookup))<=d3.sum(Object.values(allPaths)) )
        // if (d3.sum(Object.values(peopleLookup))<=d3.sum(Object.values(allPaths))) {
        // var sex = getRandomValue(sexIds)
        // var ses = getRandomValue(sesIds)
        // var edu = getRandomValue(educationIds)
        // var checkPeople = [sexes[sex],sesNames[ses],educationNames[edu]].join("--")
        
        var peopleKeys = Object.keys(peopleLookup).filter(key =>allPaths[key]>0)
        // console.log(peopleKeys)
    
        if (peopleKeys.length>0) {    
        // var checkPeople = getRandomValue(peopleKeys)
        checkPeople = peopleKeys[0]
        // while (peopleLookup[checkPeople]<allPaths[checkPeople]) {
        checkPath = checkPeople.split("--")
        sex = sexes.indexOf(checkPath[0])
        ses = sesNames.indexOf(checkPath[1])
        edu = educationNames.indexOf(checkPath[2])
        peopleLookup[checkPeople]++
        // console.log(checkPeople)
        

      people = [
        ...people,
        ...d3.range(1).map(() => generatePerson(elapsed,sex,ses,edu)),
      ]
      if (peopleLookup[checkPeople]>=allPaths[checkPeople]) {delete peopleLookup[checkPeople]}
      
    }
    
    // console.log(people)
    const females = markersGroup.selectAll(".marker-circle")
      .data(people.filter(d => (
        xProgressAccessor(d) < 1
        && sexAccessor(d) == 0
      )), d => d.id)
    females.enter().append("circle")
      .attr("class", "marker marker-circle")
      .attr("r", 5.5)
      .style("opacity", 0)
    females.exit().remove()

    const males = markersGroup.selectAll(".marker-triangle")
      .data(people.filter(d => (
        xProgressAccessor(d) < 1
        && sexAccessor(d) == 1
      )), d => d.id)

      var triangle = d3.symbol()
      .type(d3.symbolTriangle)
      .size(50)
    males.enter().append("path")
      .attr("class", "marker marker-triangle")
      .attr("d", triangle)
      .style("opacity", 0)
    males.exit().remove()

    const markers = d3.selectAll(".marker")
    markers.style("transform", d => {
      const x = xScale(xProgressAccessor(d))
      const yStart = startYScale(sesAccessor(d))
      const yEnd = endYScale(educationAccessor(d))
      const yChange = yEnd - yStart
      const yProgress = yTransitionProgressScale(xProgressAccessor(d))
      const y = yStart + (yChange * yProgress) + d.yJitter
      return `translate(${x}px, ${y}px)`
    })
      .attr("fill", d => colorScale(sesAccessor(d)))
      .transition().duration(100)
      .style("opacity", d => xScale(xProgressAccessor(d)) < 10 ? 0 : 1)

    const endingGroups = educationIds.map((endId, i) => (
      people.filter(d => (
        xProgressAccessor(d) >= 1
        && educationAccessor(d) == endId
      ))
    ))

    const endingPercentages = d3.merge(
      endingGroups.map((peopleWithSameEnding, endingId) => (
        d3.merge(
          sexIds.map(sexId => (
            sesIds.map(sesId => {
              const peopleInBar = peopleWithSameEnding.filter(d => (
                sexAccessor(d) == sexId
              ))
              const countInBar = peopleInBar.length
              const peopleInBarWithSameStart = peopleInBar.filter(d => (
                sesAccessor(d) == sesId
              ))
              const count = peopleInBarWithSameStart.length
              const numberOfPeopleAbove = peopleInBar.filter(d => (
                sesAccessor(d) > sesId
              )).length
              return {
                endingId,
                sesId,
                sexId,
                count,
                countInBar,
                percentAbove: numberOfPeopleAbove / (peopleInBar.length || 1),
                percent: count / (countInBar || 1),
              }
            })
          ))
        )
      ))
    )

    endingBarGroup.selectAll(".ending-label")
      .data(endingPercentages)
      .enter()
      .append("rect")
      // .join('rect')
      .attr("class", "ending-bar")
      .attr("x", d => -dimensions.endsBarsWidth * (d.sexId + 1) - (d.sexId * dimensions.endingBarPadding))
      .attr("width", dimensions.endsBarsWidth)
      .attr("y", d => endYScale(d.endingId) - dimensions.pathHeight / 2 + dimensions.pathHeight * d.percentAbove)
      .attr("height", d => d.countInBar ? dimensions.pathHeight * d.percent : dimensions.pathHeight)
      .attr("fill", d => d.countInBar ? colorScale(d.sesId) : "#DADADD")


    endingLabelsGroup.selectAll(".ending-bar")
      .data(endingPercentages)
      .enter()
      .append("text")
      .attr("class", "ending-value")
      .attr("x", d => (d.sesId) * 33 + 47)
      .attr("y", d => endYScale(d.endingId) - dimensions.pathHeight / 2 + 14 * d.sexId + 35)
      .attr("fill", d => d.countInBar ? colorScale(d.sesId) : "#DADADD")
      .text(d => d.count)
      // .selectAll(".ending-value")
      // .exit()

    
    
    // console.log(endingPercentages)

  }

  d3.timer(updateMarkers)
})
    }
    //helper functions
    getStatusKey = ({ sex, ses }) => [sex, ses].join("--")
    sentenceCase = str => [
      str.slice(0, 1).toUpperCase(),
      str.slice(1),
    ].join("")

    getRandomValue = arr => arr[Math.floor(getRandomNumberInRange(0, arr.length))]

    getRandomNumberInRange = (min, max) => Math.random() * (max - min) + min

    //reference: https://observablehq.com/@chekos/animated-sankey
