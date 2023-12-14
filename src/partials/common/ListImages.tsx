import React from "react";
// @ts-ignore
import img1 from "../../images/logo/logo.png";
// @ts-ignore
import img2 from "../../images/networks/unity.png";
import PropTypes from "prop-types";
import classNames from "classnames";

function ListImages(props) {
  const { imgs, size, onClick } = props;

  const handleClick = (idx) => {
    if (!onClick) return;
    onClick(idx);
  };

  return (
    <ul className="flex flex-wrap justify-center sm:justify-start mb-8 sm:mb-0 -space-x-3 -ml-px">
      {imgs.map((el, idx) => (
        <li key={idx}>
          <img
            style={{ width: size, height: size }}
            className={classNames("rounded-full", onClick && "cursor-pointer")}
            onClick={() => handleClick(idx)}
            src={el.src}
            alt={el.name}
          />
        </li>
      ))}
      <li>
        <div
          style={{ width: size, height: size }}
          className={classNames(
            "rounded-full bg-neutral-50 border border-slate-200 shadow-sm flex items-center justify-center text-base text-gray-800",
            onClick && "cursor-pointer"
          )}
          onClick={() => handleClick(-1)}
        >
          +5
        </div>
      </li>
    </ul>
  );
}

ListImages.defaultProps = {
  size: 40,
  imgs: [
    { src: img1, name: " " },
    { src: img2, name: " " },
    { src: img1, name: " " },
    { src: img2, name: " " },
  ],
};
ListImages.propTypes = {
  imgs: PropTypes.array,
  size: PropTypes.number,
  onClick: PropTypes.func,
};
export default ListImages;
