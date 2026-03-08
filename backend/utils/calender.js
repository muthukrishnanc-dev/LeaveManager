require("dotenv").config();

const { google } = require("googleapis");
const key = require("../leave-managing-system-2f8e2945fd6e.json");
const auth = new google.auth.JWT(key.client_email, null, key.private_key, [
  "https://www.googleapis.com/auth/calendar",
]);

const calender = google.calendar({ version: "v3", auth });
const createEvent = async (startDate, endDate, Employee, EmployeeId) => {
  const end = new Date(endDate);
  end.setDate(end.getDate() + 1);
  const start = startDate.toISOString().split("T")[0];
  const endFormetted = end.toISOString().split("T")[0];
  await calender.events.insert({
    calendarId: process.env.CALENDER_ID,
    requestBody: {
      summary: `${EmployeeId} ${Employee} on leave`,
      start: { date: start },
      end: { date: endFormetted },
    },
  });
};

module.exports = { createEvent };
