import React, { useState } from "react";
import PropTypes from "prop-types";
import ImagePreview from "./Modal/ImagePreview";
import GalleryPreview from "./Modal/GalleryPreview";

function ListImages(props) {
  const { imgs, size, max } = props;
  const totalImg = imgs?.length;

  const [imgPreview, setImgPreview] = useState<any>({});
  const [viewGallery, setViewGallery] = useState(false);

  const handleClick = (el) => {
    if (totalImg > max) {
      setViewGallery(true);
    } else {
      setImgPreview({ url: el.src });
    }
  };

  if (!imgs?.length) return <></>;

  let filteredImgs = imgs;
  if (totalImg > max) {
    filteredImgs = filteredImgs.slice(0, max);
  }

  return (
    <>
      <ul className="flex flex-wrap justify-center sm:justify-start mb-8 sm:mb-0 -space-x-2 -ml-px">
        {filteredImgs.map((el, idx) => (
          <li key={idx} className="">
            <img
              style={{ width: size, height: size }}
              className="cursor-pointer rounded-full shadow-custom1 bg-white border border-solid border-slate-400"
              onClick={() => handleClick(el)}
              src={el.src}
              alt={el.name || " "}
            />
          </li>
        ))}
        {totalImg > max && (
          <li>
            <div
              style={{ width: size, height: size }}
              className="cursor-pointer rounded-full bg-neutral-50 border border-slate-200 shadow-sm flex items-center justify-center text-base text-gray-800"
              onClick={() => setViewGallery(true)}
            >
              +{totalImg - max}
            </div>
          </li>
        )}
      </ul>
      <ImagePreview imgPreview={imgPreview} setImgPreview={setImgPreview} />
      <GalleryPreview
        list={imgs.map((el) => ({ original: el.src, thumbnail: el.src }))}
        open={viewGallery}
        setOpen={setViewGallery}
      />
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
};
export default ListImages;
