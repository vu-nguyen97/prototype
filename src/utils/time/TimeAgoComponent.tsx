import React, { useState, useEffect } from "react";
import moment from "moment";
import PropTypes from "prop-types";

const TimeAgoComponent = (props) => {
  const { createDate, className } = props;
  const [timeAgo, setTimeAgo] = useState("");


  useEffect(() => {
    
    console.log('TimeAgoComponent createDate', createDate);

    setTimeAgo(getAgoStr());
    
    const intervalId = setInterval(() => {
      setTimeAgo(getAgoStr());
    }, 60000);

    return () => clearInterval(intervalId);

  }, [createDate]);

  const getAgoStr = () => {

    if(!createDate || createDate === 0){
      return "NaN";
    }

    const now = moment();
    console.log('now', now);
    console.log('now milliseconds', now.milliseconds);
    const then = moment(createDate);
    console.log('then milliseconds', createDate);
    console.log('then', then);
    
    const diffInMilliseconds = now.diff(then);
    const duration = moment.duration(diffInMilliseconds);
    const hours = duration.hours();
    const minutes = duration.minutes();

    let agoString = "";

    console.log('hours', hours)
    console.log('minutes', minutes)
    if (hours > 0) {
      agoString = `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else if (minutes > 0) {
      agoString = `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else {
      agoString = "just now";
    }
    return agoString;
  };

  return <div className={className}>{timeAgo}</div>;
};

TimeAgoComponent.defaultProps = {
  className: "",
  createDate: 0,
};
TimeAgoComponent.propTypes = {
  className: PropTypes.string,
  createDate: PropTypes.number,
};

export default TimeAgoComponent;
