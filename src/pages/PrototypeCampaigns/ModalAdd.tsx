import React from "react";
import PropTypes from "prop-types";
import Button from "antd/lib/button";
import Modal from "antd/lib/modal/Modal";
import AppVariants, { FORM_LISTING } from "../App/Variants/AppVariants";

function ModalAdd(props) {
  const { isOpen, onClose, submitCb, store } = props;

  const onCloseModal = () => {
    onClose();
  };

  const onSubmit = () => {
    onCloseModal();
    submitCb && submitCb();
  };

  return (
    <Modal
      title="Add new campaign"
      width={900}
      open={isOpen}
      maskClosable={false}
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
          Save
        </Button>,
      ]}
    >
      <AppVariants submitCb={onSubmit} store={store} />
    </Modal>
  );
}

ModalAdd.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  submitCb: PropTypes.func,
  store: PropTypes.string,
};

export default ModalAdd;
