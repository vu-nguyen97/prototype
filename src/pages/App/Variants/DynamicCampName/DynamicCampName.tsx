import React from "react";
import AntInput from "antd/lib/input/Input";
import SelectStoreApp from "../../../../partials/common/Forms/SelectStoreApp";
import Form from "antd/lib/form";

export default function DynamicCampName(props) {
  const { listStoreApps, form } = props;

  return (
    <div className="">
      <Form.Item
        name="app"
        label="App"
        rules={[{ required: true, message: "Please select an app" }]}
      >
        <SelectStoreApp
          listApp={listStoreApps}
          setActivedApp={(app) => {
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
    </div>
  );
}
