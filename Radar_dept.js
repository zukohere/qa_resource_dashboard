//  MAKE THIS REFLECT % ON-TIME OUT OF ASSIGNED TASKS, or task RANK (freq of assigned tasks scale 1 - 5)

d3.json("json_data.json", function (dataset) {
  radarData = dataset.Goals
  // console.log(Object.keys(radarData).map(d=>radarData[d]))
  Topics = Object.keys(radarData)
  Goals = Object.keys(radarData).map(d=>radarData[d].Goal)
  Actuals = Object.keys(radarData).map(d=>radarData[d].Actual)
data = [
    {
    type: 'scatterpolar',
    r: Goals,
    theta: Topics,
    fill: 'toself',
    name: "Goal"    
    },
    {
    type: 'scatterpolar',
    r: Actuals,
    theta: Topics,
    fill: 'toself',
    name: 'Actual'
    }
  ]
  
  layout = {
    title: "Dept. Goal vs Actual",
    polar: {
      radialaxis: {
        visible: true,
        // range: d3.max(Object.values(eeData.topicHours).map(d=>d/d3.sum(eeData.topicHours))
        // , d3.max(Object.values(eeData.affinity)))
        range: [0,d3.max(d3.max(Goals),d3.max(Actuals))]
      }
    }
  }
  
//   Plotly.newPlot("myDiv", data, layout)
  Plotly.newPlot("deptRadar", data, layout)
})