import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Button from "antd/lib/button";
import Modal from "antd/lib/modal/Modal";
import Form from "antd/lib/form";
import { toast } from "react-toastify";
import { EMAIL_REQUIRED, OPTION_REQUIRED } from "../../constants/formMessage";
import { ROLES } from "../../constants/constants";
import Select from "antd/lib/select";
import service from "../../partials/services/axios.config";
import AntInput from "antd/lib/input/Input";
import SelectStoreApp, {
  getActivedApp,
} from "../../partials/common/Forms/SelectStoreApp";
import { Input } from "antd";

function ModalAddAndEdit(props) {
  const [form] = Form.useForm();
  const {
    isOpen,
    onClose,
    setIsLoading,
    memberData,
    listStoreApps,
    listRole,
    listStores,
    listMember,
    setListMember,
  } = props;

  const defaultRole = ROLES.user;
  const [activedApp, setActivedApp] = useState<string[]>();
  const [activedRole, setActivedRole] = useState(defaultRole);
  const [selectedValue, setSelectedValue] = useState<any>([]);

  const handleChange = (value) => {
    setSelectedValue(value);
  };
  useEffect(() => {
    if (!memberData?.id) return;

    const { storeApps, email, role } = memberData;
    let newApps;
    if (storeApps && Array.isArray(storeApps)) {
      newApps = storeApps.map((el) => el.storeId + el.name);
      setActivedApp(newApps);
    }

    form.setFieldsValue({
      apps: newApps,
      email,
      role: role.name,
    });
    setActivedRole(role.name);
  }, [memberData?.id]);

  const initialValues = {
    apps: [],
    email: "",
    role: defaultRole,
  };
  const isEditMode = !!memberData?.id;

  const onCloseModal = () => {
    onClose();

    setTimeout(() => {
      form.resetFields();
      setActivedApp([]);
      setActivedRole(defaultRole);
    }, 300);
  };

  const onFinish = (values) => {
    const { apps, storeId, email, role } = values;
    const storeApps = apps?.map((str) => getActivedApp(listStoreApps, str));

    if (isEditMode) {
      return onSubmitEditUser(role, storeApps);
    }

    onSubmitInviteUser(email, role, storeId);
  };

  const onSubmitInviteUser = (email, role, storeId) => {
    const params = {
      email,
      role,
      storeId,
    };

    setIsLoading(true);
    service.post("/inviteUser", {email, role, storeId}).then(
      (res: any) => {
        toast(res.message || "Invite member success!", { type: "success" });
        setIsLoading(false);
        onCloseModal();
      },
      () => setIsLoading(false)
    );
    window.location.reload();
  };

  const onSubmitEditUser = (role, storeApps) => {
    const params = {
      id: memberData?.id,
      role,
      storeAppIds: storeApps?.map((el) => el.id),
    };

    setIsLoading(true);
    service.put("/user/role", params).then(
      (res: any) => {
        toast(res.message, { type: "success" });
        setIsLoading(false);
        onCloseModal();

        const foundIndex = listMember.findIndex(
          (item) => item.id === memberData.id
        );
        if (foundIndex !== -1) {
          const newTableData = listMember;
          newTableData.splice(foundIndex, 1, res.results);
          setListMember(newTableData);
        }
      },
      () => setIsLoading(false)
    );
    window.location.reload();
  };

  return (
    <Form
      id="FormAddNewMember"
      labelAlign="left"
      form={form}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      onFinish={onFinish}
      initialValues={initialValues}
    >
      <Modal
        title={isEditMode ? `Edit user ${memberData.email}` : "Invite member"}
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
            form="FormAddNewMember"
          >
            {isEditMode ? "Save" : "Invite"}
          </Button>,
        ]}
      >
        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: OPTION_REQUIRED }]}
        >
          <Input
            defaultValue="Default Value" disabled
            className="w-full"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: EMAIL_REQUIRED }]}
        >
          <AntInput
            allowClear
            placeholder="name@gmail.com"
            className="w-full"
          />
        </Form.Item>
        <Form.Item name="storeId" label="Store">
        <Select value={selectedValue} onChange={handleChange} className="w-full">
            {listStores.map((item) => (
              <Select.Option key={item.id} value={item.id}>            
                  {item.name}            
              </Select.Option>
            ))}
          </Select>
          </Form.Item>
        {/* {activedRole === ROLES.user && (
          <Form.Item name="stores" label="Stores">
            <SelectStoreApp
              isMultiple={true}
              listApp={listStoreApps}
              activedApp={activedApp}
              setActivedApp={(apps) => {
                setActivedApp(apps);
                form.setFieldsValue({ apps });
              }}
            />
          </Form.Item>
        )} */}
      </Modal>
    </Form>
  );
}

ModalAddAndEdit.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  setIsLoading: PropTypes.func,
  setListMember: PropTypes.func,
  listMember: PropTypes.array,
  memberData: PropTypes.object,
  listStoreApps: PropTypes.array,
  listStores: PropTypes.array,
  listRole: PropTypes.array,
};

export default ModalAddAndEdit;
