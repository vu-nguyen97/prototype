import React from "react";
import Modal from "antd/lib/modal/Modal";
import Button from "antd/lib/button/button";
import CreativeTable from "./CreativeTable";

function ModalDetail({ isOpen, onClose, rd, setPreviewData, setImgPreview }) {
  const onCloseModal = () => {
    onClose();
  };

  const data = rd.creatives?.length ? rd.creatives : rd.assets || [];

  return (
    <Modal
      title={`View "${rd.name}" pack`}
      width={1100}
      open={isOpen}
      destroyOnClose
      onCancel={onCloseModal}
      footer={[
        <Button
          key="back"
          type="primary"
          htmlType="button"
          onClick={onCloseModal}
        >
          Close
        </Button>,
      ]}
    >
      <CreativeTable
        data={data}
        setPreviewData={setPreviewData}
        setImgPreview={setImgPreview}
      />
    </Modal>
  );
}

export default ModalDetail;
