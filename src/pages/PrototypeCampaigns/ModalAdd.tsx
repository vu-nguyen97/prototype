import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Button from "antd/lib/button";
import Modal from "antd/lib/modal/Modal";
import Form from "antd/lib/form";
import { toast } from "react-toastify";
import service from "../../partials/services/axios.config";
import AntInput from "antd/lib/input/Input";
import SelectStoreApp, {getActivedApp} from "../../partials/common/Forms/SelectStoreApp";

function ModalAdd(props) {
  const [form] = Form.useForm();
  const {
    isOpen,
    onClose,
    setIsLoading,
    listStoreApps
  } = props;


  const [activedApp, setActivedApp] = useState<object[]>();

  const onCloseModal = () => {
    onClose();
    setTimeout(() => {
      form.resetFields();
      setActivedApp([]);
    }, 300);
  };

  const onFinish = (values) => {
    
    const { name , apps} = values;
    const storeApps = apps?.map((str) => getActivedApp(listStoreApps, str));
    onSubmit(name, storeApps);

  };

  const onSubmit = (name: any , apps: any[]) => {
    const payload = {
      name,
      appIds: apps?.map((el) => el.id),
    };
    setIsLoading(true);
    service.post("/prototype-campaigns", payload).then(
      (res: any) => {
        toast(res.message || "Create campaign success!", { type: "success" });
        setIsLoading(false);
        onCloseModal();
      },
      () => setIsLoading(false)
    );
  };

  return (
    <Form
      id="FormAddNewCpiCampaign"
      labelAlign="left"
      form={form}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      onFinish={onFinish}
    >
      <Modal
        title="Add New Campaign"
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
            form="FormAddNewCpiCampaign"
          >
            Save
          </Button>,
        ]}
      >

        <Form.Item
          name="name"
          label="Campaign name"
          rules={[{ required: true, message: "Please enter campaign name" }]}
        >
          <AntInput
            allowClear
            placeholder=""
            className="w-full"
          />
        </Form.Item>
        <Form.Item name="apps" label="Apps">
          <SelectStoreApp
            isMultiple={true}
            listApp={listStoreApps}
            placeholder="You can add this later by providing a theme."    
            activedApp={activedApp}
            setActivedApp={(apps) => {
              setActivedApp(apps);
              form.setFieldsValue({ apps });
            }}   
          />
        </Form.Item>

      </Modal>
    </Form>
  );
}

ModalAdd.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  setIsLoading: PropTypes.func,
  listStoreApps: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default ModalAdd;
