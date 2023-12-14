import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import ImagePreview from "./Modal/ImagePreview";

function ListImages(props) {
  const { imgs, size, onClick, max } = props;

  const [imgPreview, setImgPreview] = useState<any>({});

  // const handleClick = (idx) => {
  //   if (!onClick) return;
  //   onClick(idx);
  // };

  if (!imgs?.length) return <></>;

  const totalImg = imgs.length;
  let filteredImgs = imgs;
  if (totalImg > max) {
    filteredImgs = filteredImgs.slice(0, max);
  }

  return (
    <>
      <ul className="flex flex-wrap justify-center sm:justify-start mb-8 sm:mb-0 -space-x-3 -ml-px">
        {filteredImgs.map((el, idx) => (
          <li key={idx} className="">
            <img
              style={{ width: size, height: size }}
              className={classNames(
                "cursor-pointer rounded-full"
                // onClick && "cursor-pointer"
              )}
              onClick={() => setImgPreview({ url: el.src })}
              // onClick={() => handleClick(idx)}
              src={el.src}
              alt={el.name || " "}
            />
          </li>
        ))}
        {totalImg > 5 && (
          <li>
            <div
              style={{ width: size, height: size }}
              className={classNames(
                "cursor-pointer rounded-full bg-neutral-50 border border-slate-200 shadow-sm flex items-center justify-center text-base text-gray-800"
                // onClick && "cursor-pointer"
              )}
              // onClick={() => handleClick(-1)}
            >
              +{totalImg - 4}
            </div>
          </li>
        )}
      </ul>
      <ImagePreview imgPreview={imgPreview} setImgPreview={setImgPreview} />
    </>
  );
}

ListImages.defaultProps = {
  max: 4,
  size: 40,
};
ListImages.propTypes = {
  imgs: PropTypes.array,
  size: PropTypes.number,
  max: PropTypes.number,
  onClick: PropTypes.func,
};
export default ListImages;
