import React from "react";
import Modal from "antd/lib/modal";
import ImageGallery from "react-image-gallery";

function GalleryPreview(props: any) {
  const { list, open, setOpen } = props;
  const previewTitle = "Preview images";

  return (
    <Modal
      open={open}
      title={previewTitle}
      centered
      footer={null}
      onCancel={() => setOpen(false)}
    >
      <ImageGallery
        items={list}
        showPlayButton={false}
        showFullscreenButton={false}
      />
    </Modal>
  );
}

export default GalleryPreview;
