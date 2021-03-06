import React from "react"
import { DateTime } from "luxon"

const transformTimeSlot = timeSlot =>
  DateTime.fromISO(timeSlot.time.s)
    .setLocale("fr")
    .toFormat("T")

const CalendarTime = ({ timeSlot, selectTimeSlot }) => {
  //function timeslot.time.s
  return (
    <div
      className="justify-content-center"
      onClick={() => selectTimeSlot(timeSlot)}
    >
      <div
        style={{
          position: "relative",
          borderRadius: "4px",
          width: "100%",
          textAlign: "center",
          margin: "10px 0",
          height: "34px",
          lineHeight: "34px",
          fontSize: "14px",
          fontWeight: "700",
          cursor: "pointer",
          border: timeSlot.selected ? "" : "solid 1px #110F0F",
          color: timeSlot.selected ? "#fff" : "#000",
          backgroundColor: timeSlot.selected
            ? "#110F0F"
            : "rgba(255, 255, 255, 0.9)"
        }}
      >
        {" "}
        {transformTimeSlot(timeSlot)}
      </div>
    </div>
  )
}

export default CalendarTime
