import React from "react";
import PropTypes from "prop-types";
import Button from "antd/lib/button";
import Modal from "antd/lib/modal/Modal";
import AppVariants, { FORM_LISTING } from "../App/Variants/AppVariants";

function ModalAdd(props) {
  const { isOpen, onClose } = props;

  const onCloseModal = () => {
    onClose();
  };

  return (
    <Modal
      title="Add New Campaign"
      width={900}
      open={isOpen}
      onCancel={onCloseModal}
      footer={[
        <Button key="back" htmlType="button" onClick={onCloseModal}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          htmlType="submit"
          form={FORM_LISTING}
        >
          Next
        </Button>,
      ]}
    >
      <AppVariants isModalCreate submitCb={onClose} />
    </Modal>
  );
}

ModalAdd.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default ModalAdd;
