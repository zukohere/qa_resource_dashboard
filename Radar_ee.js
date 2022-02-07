//  MAKE THIS REFLECT % ON-TIME OUT OF ASSIGNED TASKS, or task RANK (freq of assigned tasks scale 1 - 5)

d3.json("json_data.json", function (dataset) {
    Object.keys(dataset.radarData).forEach(key => {
    var newDiv = d3.select("#myDiv").append("div")
    .attr("id", "radarDiv-"+key)
    // console.log(key)
    // console.log(key.length)
    // console.log(dataset.radarData[key])
    var eeData = dataset.radarData[key]
    affinity = Object.fromEntries(Object.entries(eeData.affinity).sort())
    topicHours = Object.fromEntries(Object.entries(eeData.topicHours).sort())
    Theta = Object.keys(eeData.affinity).sort()
    // })})

totalTopicHours = d3.sum(Object.values(eeData.topicHours))


data = [
    {
    type: 'scatterpolar',
    r: Object.values(eeData.affinity),
    theta: Object.keys(eeData.affinity),
    fill: 'toself',
    name: "Proficiency Rating"    
    },
    {
    type: 'scatterpolar',
    r: Object.values(eeData.topicHours),
    theta: Object.keys(eeData.topicHours),
    fill: 'toself',
    name: 'Task Rank (Hours Spent)'
    }
  ]
  
  layout = {
    title: eeData.name,
    polar: {
      radialaxis: {
        visible: true,
        // range: d3.max(Object.values(eeData.topicHours).map(d=>d/d3.sum(eeData.topicHours))
        // , d3.max(Object.values(eeData.affinity)))
        range: [0,5]
      }
    }
  }
  
//   Plotly.newPlot("myDiv", data, layout)
  Plotly.newPlot("radarDiv-"+key, data, layout)
})

})