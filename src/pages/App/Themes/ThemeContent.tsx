import React from "react";
import PropTypes from "prop-types";
import NewTheme from "./NewTheme/NewTheme";

function ThemeContent(props) {
  const { data, idx, init } = props;

  return (
    <div className="p-4 sm:p-6">
      {!init ? (
        <>
          <div>{idx}</div>
          <div>{data.name}</div>
        </>
      ) : (
        <NewTheme />
      )}
    </div>
  );
}

ThemeContent.propTypes = {
  data: PropTypes.object,
  idx: PropTypes.number,
  init: PropTypes.bool,
};

export default ThemeContent;
