import React, { useState, useEffect } from "react";
import moment from "moment";
import PropTypes from "prop-types";

const TimeAgoComponent = (props) => {
  const { createDate, className } = props;
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    setTimeAgo(getAgoStr());

    const intervalId = setInterval(() => {
      setTimeAgo(getAgoStr());
    }, 60000);

    return () => clearInterval(intervalId);
  }, [createDate]);

  const getAgoStr = () => {
    if (createDate === undefined) return "";
    if (!createDate) {
      return "NaN";
    }

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

  return <div className={className}>{timeAgo}</div>;
};

TimeAgoComponent.defaultProps = {
  className: "min-w-[90px]",
};
TimeAgoComponent.propTypes = {
  className: PropTypes.string,
  createDate: PropTypes.number,
};

export default TimeAgoComponent;
