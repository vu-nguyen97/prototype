import React, { useState, useEffect } from "react";
import moment from "moment";

const TimeAgoComponent = ({ createDate }) => {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    
    setTimeAgo(getAgoStr());
    
    const intervalId = setInterval(() => {
      setTimeAgo(getAgoStr());
    }, 60000);

    return () => clearInterval(intervalId);

  }, [createDate]);

  const getAgoStr = () => {
    const now = moment();
    const then = moment(createDate);
    const diffInMilliseconds = now.diff(then);
    const duration = moment.duration(diffInMilliseconds);
    const hours = duration.hours();
    const minutes = duration.minutes();

    let agoString = "";

    if (hours > 0) {
      agoString = `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else if (minutes > 0) {
      agoString = `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else {
      agoString = "just now";
    }
    return agoString;
  };

  return <div>{timeAgo}</div>;
};

export default TimeAgoComponent;
