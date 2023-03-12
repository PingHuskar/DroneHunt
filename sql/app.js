document.write(`CREATE TABLE DroneHunt (
	"id"	INTEGER,
	"AgentID"	INTEGER,
	"Date"	Text,
	"Score"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
<br>`)
document.write(`CREATE TABLE Agent (
	"id"	INTEGER,
	"Name"	Text,
	"Faction"	Text,
	PRIMARY KEY("id" AUTOINCREMENT)
);
<br>`)
let AgentList = []
for (let a = 0; a < RAW.length; a++) {
    document.write(`INSERT INTO Agent (Name, Faction)
    VALUES ("${RAW.at(a).name}", "${RAW.at(a).fac}");
    <br>`)
    let rec = {}
    rec["id"] = a+1
    rec["name"] = RAW.at(a).name
    rec["fac"] = RAW.at(a).fac
    AgentList.push(rec)
}
console.log(AgentList)

for (let r of RAW) {
    for (let record of r.score) {
        document.write(`INSERT INTO DroneHunt (AgentID, Date, Score)
        VALUES (${AgentList.findIndex(a => a.name == r.name)+1},"${record.dt}",${record.dr});
        <br>`)
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