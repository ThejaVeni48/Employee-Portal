const db = require('../../config/db');

const TimesheetCustomization = (req, res) => {
  const { orgId, selectedDay, email } = req.body;


  console.log("orgId",orgId);
  console.log("selectedDay",selectedDay);
  console.log("email",email);

  


  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

 

  const generatedDays = [];

  for (let i = 0; i < 7; i++) {
    generatedDays.push(weekDays[(selectedDay + i) % 7]);
  }

  

  console.log("generatedDays",generatedDays);

  const endDay = generatedDays[6];

  const startDay = generatedDays[0];

  const duration  = generatedDays.length;

  const status = 'A';
  

 
      const insertSql = `
        INSERT INTO TC_ORG_SETTINGS
        (ORG_ID, START_DAY, END_DAY,STATUS,DURATION,CREATED_BY)
        VALUES (?, ?, ?, ?, ?,?)
      `;

      db.query(
        insertSql,
        [orgId, startDay, endDay, status,duration,email],
        (insErr,insRes) => {
          if (insErr) {
              console.log("error occured",insErr);
            return res.status(500).json({ message: "Insert failed", error: insErr });
          }
          

        console.log("result",insRes);
        
        if(insRes.affectedRows > 0)
        {
             


            const currentDay = new Date();
            console.log("currentDay",currentDay);

            // need to get current monday from current day
function getCurrentWeekMonday(d) {
  
  const date = new Date(d); 
  const dayOfWeek = date.getDay(); 

  const diff = (dayOfWeek + 6) % 7; 
  
  date.setDate(date.getDate() - diff);
  


  return date;
}


const today = new Date();
const currentMonday = getCurrentWeekMonday(today);

console.log("Today is:", today.toDateString());
console.log("Monday of this week was:", currentMonday.toDateString());



const getDay  = currentMonday.getDay();


console.log("getDay",getDay);



// Calculate start date based on selectedDay in the current week
function getDateOfWeekday(selectedDay) {
  const today = new Date();
  const currentDay = today.getDay(); // 0-6
  const diff = (selectedDay - currentDay + 7) % 7; // days to add to reach selectedDay
  const startDate = new Date(today);
  startDate.setDate(today.getDate() + diff);
  return startDate;
}

const startDate = getDateOfWeekday(selectedDay); // selectedDay = 0..6
const weeks = [];

for (let i = 0; i < 7; i++) {
  const tempDate = new Date(startDate);
  tempDate.setDate(startDate.getDate() + i);
  weeks.push(tempDate.toISOString().split("T")[0]); // YYYY-MM-DD
}

console.log("Generated week dates:", weeks);



const weekStart = weeks[0];


const weekEnd = weeks[6];


const sql = `INSERT INTO TC_MASTER (ORG_ID,WEEK_START,WEEK_END,CREATED_BY)
VALUES(?,?,?,?)`;


db.query(sql,[orgId,weekStart,weekEnd,email],(insert,error)=>{
    if(error)
    {
        console.log("Error coccured",error);
        return res.status(500).json({data:error})
        

    }

    console.log("insert result",insert);
    return res.status(200).json({data:insert})
    
})





            
            
        }
        else{
            console.log("false");
            
        }
        }
      );
    
  
};

module.exports = { TimesheetCustomization };
