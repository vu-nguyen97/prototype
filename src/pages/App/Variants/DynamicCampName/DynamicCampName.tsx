import React, { useEffect, useState } from "react";
import AntInput from "antd/lib/input/Input";
import SelectStoreApp from "../../../../partials/common/Forms/SelectStoreApp";
import Form from "antd/lib/form";
import Select from "antd/lib/select";
import { useQuery } from "@tanstack/react-query";
import { GET_APPS_BY_STORE } from "../../../../api/constants.api";
import { getAppsByStore } from "../../../../api/common/common.api";

export default function DynamicCampName(props) {
  const { form, listStores, onResetGroup } = props;

  const [listStoreApps, setListStoreApps] = useState<any>([]);
  const [app, setApp] = useState();

  const formStoreId = Form.useWatch("store", form);

  const { data: appsRes, isLoading } = useQuery(
    [GET_APPS_BY_STORE, formStoreId],
    getAppsByStore,
    {
      staleTime: 3 * 60000,
      enabled: !!listStores?.length && !!formStoreId,
    }
  );

  useEffect(() => {
    setListStoreApps(appsRes);
    setApp(undefined);
    form.setFields([
      { name: "app", value: "", errors: [] },
      { name: "campaignName", value: "", errors: [] },
    ]);
  }, [appsRes]);

  return (
    <>
      <Form.Item
        name="store"
        label="Store"
        rules={[{ required: true, message: "Please select an app" }]}
      >
        <Select allowClear placeholder="Store" onChange={onResetGroup}>
          {listStores?.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="app"
        label="App"
        rules={[{ required: true, message: "Please select an app" }]}
      >
        <SelectStoreApp
          loading={isLoading}
          listApp={listStoreApps}
          placeholder="Select a app"
          activedApp={app}
          setActivedApp={(app) => {
            setApp(app);
            onResetGroup();
            if (app) {
              const regex = /(?=[A-Z])/;
              const index = app.toString().search(regex);
              const part2 = app.toString().substring(index);
              const words = part2.split(" ");
              const capitalizedWords = words.map((word) => word.toUpperCase());
              const result = `CPI_PRTT_${capitalizedWords.join("_")}`;
              form.setFields([
                { name: "app", value: app, errors: [] },
                { name: "campaignName", value: result, errors: [] },
              ]);
            } else {
              form.setFieldValue("app", app);
            }
          }}
        />
      </Form.Item>

      <Form.Item
        className="!mt-4"
        name="campaignName"
        label="Campaign name"
        rules={[{ required: true, message: "Please enter campaign name" }]}
      >
        <AntInput allowClear placeholder="Enter campaign name" />
      </Form.Item>
    </>
  );
}
