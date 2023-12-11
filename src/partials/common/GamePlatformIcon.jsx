import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { handleErrorImage } from "../../utils/Helpers";

function GamePlatformIcon(props) {
  const { app, imgClass, inputSize } = props;

  if (!app.icon) return <></>;

  const defaultImgClass =
    "w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-md lg:rounded-2xl";
  const inputSizeImgClass = "w-5 h-5 rounded-[0.15rem] mr-[10px]";
  const imgClassName = inputSize ? inputSizeImgClass : defaultImgClass;

  return (
    <div className="relative flex-shrink-0">
      <img
        src={app.icon}
        alt=" "
        className={classNames(!imgClass ? imgClassName : imgClass)}
        referrerPolicy="no-referrer"
        onError={handleErrorImage}
      />
    </div>
  );
}

GamePlatformIcon.defaultProps = {
  imgClass: "",
};

GamePlatformIcon.propTypes = {
  app: PropTypes.object,
  imgClass: PropTypes.string,
  inputSize: PropTypes.bool,
};

export default GamePlatformIcon;
