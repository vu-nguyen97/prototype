import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Button from "antd/lib/button";
import Modal from "antd/lib/modal/Modal";
import Form from "antd/lib/form";
import { toast } from "react-toastify";
import service from "../../partials/services/axios.config";
import AntInput from "antd/lib/input/Input";
import SelectStoreApp, {getActivedApp} from "../../partials/common/Forms/SelectStoreApp";
import { useNavigate } from 'react-router-dom'; // Import useHistory from React Router


function ModalAdd(props) {
  
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const {
    isOpen,
    onClose,
    setIsLoading,
    listStoreApps
  } = props;

  const [activedApp, setActivedApp] = useState<object[]>();
  const [campaignName, setCampaignName] = useState("");
  const onCloseModal = () => {
    onClose();
    setTimeout(() => {
      form.resetFields();
      setActivedApp([]);
    }, 300);
  };

  useEffect(() => {
    form.setFieldsValue({
      campaignName,
    });
    
  }, [campaignName]);

  const onFinish = (values) => {
    const { campaignName , apps} = values;
    const regex = /(?=[A-Z])/;
    const index = apps.toString().search(regex);
    const part1 = apps.substring(0, index);
    const part2 = apps.toString().substring(index);
    onSubmit(campaignName, part1);
  };

  const onSubmit = (campaignName: any , appId: any) => {
    const payload = {
      name: campaignName,
      appId,
    };
    console.log(payload)
    setIsLoading(true);
    service.post("/cpi-campaigns", payload).then(
      (res: any) => {
        toast(res.message || "Create campaign success!", { type: "success" });
        setIsLoading(false);
        onCloseModal();
        setTimeout(() => {
          navigate('/apps/'+ res.results.id +'/themes',  {state: { packageId: appId}});
        }, 1000);
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
            Next
          </Button>,
        ]}
      >
        <Form.Item name="apps" label="App" rules={[{ required: true, message: "Please select an app" }]}>
          <SelectStoreApp
            isMultiple={false}
            listApp={listStoreApps}
            activedApp={activedApp}
            setActivedApp={(apps) => {
              setActivedApp(apps);
              form.setFieldsValue({ apps });
              console.log(apps);
              const regex = /(?=[A-Z])/;
              const index = apps.toString().search(regex);
              const part2 = apps.toString().substring(index);
              const words = part2.split(' ');
              const capitalizedWords = words.map(word => word.toUpperCase());
              const result = `CPI_PRTT_${capitalizedWords.join('_')}`;  
              setCampaignName(result);
            }}
          />
        </Form.Item>
        <Form.Item
          name="campaignName"
          label="Campaign name"
          rules={[{ required: true, message: "Please enter campaign name" }]}
        >
          <AntInput
            allowClear
            placeholder=""
            className="w-full"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
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
