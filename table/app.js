const numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
const body = d3.select("body")
const container = body.append("div").attr("class", "container")
const table = container.append("table")
const tableheaders = [
    `Ranking`,
    `Agent Name`,
    `Faction`,
    `Score`,
    `MoreScoreTo#1`,
    `Latest Update`,
]
const tableheadrow = table.append("tr")
for (let tableheader of tableheaders) {
    tableheadrow.append("th").text(tableheader)
}
const TODAYDATE = moment(new Date())
let tablebody = table.append("tbody")
let scoreArray = []
for (let r of RAW) {
    if (!scoreArray.includes(r.score.at(-1).dr)) {
        scoreArray.push(r.score.at(-1).dr)
    }
}
scoreArray.sort((a, b) => b-a)
console.log(scoreArray)

for (let score of scoreArray) {
    for (let r of RAW) {
        if (score === r.score.at(-1).dr) {
            let tablerow = tablebody.append("tr")
            tablerow.append("td").text(scoreArray.indexOf(r.score.at(-1).dr) + 1)
            tablerow.append("td").text(r.name)
            tablerow.append("td").attr("class",r.fac).text(FAC[r.fac])
            tablerow.append("td").text(numberWithCommas(r.score.at(-1).dr))
            tablerow.append("td").text(numberWithCommas(scoreArray.at(0) - r.score.at(-1).dr) == 0 ? '-' : numberWithCommas(scoreArray.at(0) - r.score.at(-1).dr))
            // tablerow.append("td").text(r.score.at(-1).dt)
            tablerow.append("td").text(
                parseInt(moment.duration(TODAYDATE.diff(r.score.at(-1).dt)).asDays()) < 2
                ? `Today`
                : `${parseInt(moment.duration(TODAYDATE.diff(r.score.at(-1).dt)).asDays())} days ago`
                )
                // console.log(r.name,r.fac,r.score.at(-1).dt)
            }
    }
}
TweenMax.staggerFrom('td',1,{
    x: 100,
    scale: 0,
},-0.03)