document.write(`CREATE TABLE IF NOT EXISTS DroneHunt (
	"id"	INTEGER,
	"AgentID"	INTEGER,
	"Date"	Text,
	"Score"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
<br>`)
document.write(`CREATE TABLE IF NOT EXISTS Agent (
	"id"	INTEGER,
	"Name"	Text,
	"Faction"	Text,
	PRIMARY KEY("id" AUTOINCREMENT)
);
<br>`)
let AgentList = []
document.write(`INSERT INTO Agent (Name, Faction) VALUES `)
for (let a = 0; a < RAW.length; a++) {
    if (a < RAW.length - 1) {
    document.write(`("${RAW.at(a).name}", "${RAW.at(a).fac}"),
    <br>`)
} else {
    document.write(`("${RAW.at(a).name}", "${RAW.at(a).fac}");
    <br>`)
}
    let rec = {}
    rec["id"] = a+1
    rec["name"] = RAW.at(a).name
    rec["fac"] = RAW.at(a).fac
    AgentList.push(rec)
}
console.log(AgentList)

document.write(`INSERT INTO DroneHunt (AgentID, Date, Score) VALUES `)
for (let r of RAW) {
    for (let record of r.score) {
        if (RAW.at(-1) == r && r.score.at(-1) == record) {
            document.write(`(${AgentList.findIndex(a => a.name == r.name)+1},"${record.dt}",${record.dr});
        <br>`)
        } else {
            document.write(`(${AgentList.findIndex(a => a.name == r.name)+1},"${record.dt}",${record.dr}),
        <br>`)
        }
        
    }
}
document.write(`SELECT 		ROW_NUMBER() OVER (ORDER BY MAX(Score) DESC) AS "#"
, Name
, Faction
, MAX(Score) AS Score
FROM 		DroneHunt
INNER JOIN	Agent
ON	Agent.id = DroneHunt.AgentID
GROUP BY	Name
ORDER BY	MAX(Score) DESC;
<br>`)