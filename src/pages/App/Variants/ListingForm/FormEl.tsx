import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Form from "antd/lib/form";
import { FIELD_REQUIRED } from "../../../../constants/formMessage";
import DynamicUpload, {
  getUploadRule,
} from "../../../../partials/common/Forms/DynamicUpload";
import SelectCustomListing from "../../../../partials/common/Forms/SelectCustomListing";

export const DYNAMIC_LISTING = "dynamicListing";
export const DYNAMIC_CREATIVES = "dynamicCreatives";

function FormEl(props) {
  const { group, onChangeGroup, listingData, disabled, form } = props;
  const { id, listing } = group;

  const creatives = group.creatives || [];
  const creativeField = "creativeUploadEl";

  const onSetListing = (value) => {
    onChangeGroup(group, value);
    form.setFields([{ name: DYNAMIC_LISTING + id, value, errors: [] }]);
  };

  const onSetCreativeListFiles = (fieldName, files: any[]) => {
    onChangeGroup(group, files, "creatives");
    form.setFields([
      { name: DYNAMIC_CREATIVES + id, value: files, errors: [] },
    ]);
  };

  useEffect(() => {
    if (!listing) {
      form.setFieldValue(DYNAMIC_LISTING + id, undefined);
    }
  }, [listing]);

  return (
    <>
      <Form.Item
        label="Listing"
        name={DYNAMIC_LISTING + id}
        rules={[{ required: true, message: FIELD_REQUIRED }]}
      >
        <SelectCustomListing
          listApp={listingData}
          activedApp={listing}
          setActivedApp={onSetListing}
        />
      </Form.Item>

      <Form.Item
        name={DYNAMIC_CREATIVES + id}
        label="Creatives"
        rules={[getUploadRule(creatives, "Please select creatives")]}
      >
        <DynamicUpload
          wrapperClass=""
          isShowLabel={false}
          multiple
          field={creativeField}
          listFiles={creatives}
          onSetListFiles={onSetCreativeListFiles}
          accept={".png, .jpeg, .mp4"}
        />
      </Form.Item>
    </>
  );
}

FormEl.defaultProps = {
  group: {},
  listingData: [],
};

FormEl.propTypes = {
  form: PropTypes.object,
  group: PropTypes.object,
  listingData: PropTypes.array,
  onChangeGroup: PropTypes.func,
  disabled: PropTypes.bool,
};

export default FormEl;
