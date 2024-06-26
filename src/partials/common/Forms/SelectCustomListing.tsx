import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Select from "antd/lib/select";
import GamePlatformIcon from "../GamePlatformIcon";
import { ALL_APP_OPTION } from "../../../constants/constants";
import {
  filterSelectGroupByKey,
  onSelectWithAllOpt,
} from "../../../utils/Helpers";
import { maxTagPlaceholder } from "./MaxTagPlaceholder";

export const getActivedApp = (listApp: any[] = [], activedId: string = "") => {
  if (!listApp?.length || !activedId) return {};

  const results = listApp.find((el) => el.storeId + el.name === activedId);
  return results || {};
};

function SelectCustomListing(props) {
  const {
    loading,
    isMultiple,
    hasAllOpt,
    classNames,
    listApp,
    activedApp,
    setActivedApp,
    onBlur,
    getKey,
    filterOption,
    autoFocus,
    placeholder,
    onFocusFunc,
  } = props;

  const onGetKey = (data) => {
    if (getKey) {
      return getKey(data);
    }
    return data.storeId + data.name;
  };

  const listAppEl = listApp?.map((data, idx) => (
    <Select.Option key={data.id} size="large">
      <div className="flex items-center">
        {/* {data.icon && <GamePlatformIcon app={data} inputSize={true} />} */}
        {data.listingName}
      </div>
    </Select.Option>
  ));

  let contentEl = listAppEl;
  if (hasAllOpt && listApp.length) {
    contentEl = (
      <>
        <Select.OptGroup label={`All Apps (${listApp.length})`}>
          <Select.Option size="large" value={ALL_APP_OPTION}>
            All Apps
          </Select.Option>
        </Select.OptGroup>

        <Select.OptGroup label="Apps">{listAppEl}</Select.OptGroup>
      </>
    );
  }

  const listOpts = listApp?.map((data) => onGetKey(data));
  const onChangeValue = (values) => {
    if (isMultiple) {
      if (!hasAllOpt) {
        // Case multiple without the all_option (default multiple)
        return setActivedApp(values);
      }
      onSelectWithAllOpt(
        values,
        listOpts,
        ALL_APP_OPTION,
        activedApp,
        setActivedApp
      );
    } else {
      setActivedApp(values);
    }
  };

  return (
    <Select
      loading={loading}
      className={`w-full ${classNames}`}
      placeholder={placeholder || "Select listing"}
      mode={isMultiple ? "multiple" : undefined}
      maxTagCount="responsive"
      maxTagPlaceholder={(v) => maxTagPlaceholder(v, activedApp, onChangeValue)}
      allowClear
      value={activedApp}
      onChange={onChangeValue}
      onFocus={onFocusFunc}
      showSearch
      autoFocus={autoFocus}
      filterOption={filterOption || filterSelectGroupByKey}
      onBlur={onBlur}
    >
      {contentEl}
    </Select>
  );
}

SelectCustomListing.defaultProps = {
  classNames: "",
  isMultiple: false,
  loading: false,
  autoFocus: false,
};

SelectCustomListing.propTypes = {
  isMultiple: PropTypes.bool,
  loading: PropTypes.bool,
  hasAllOpt: PropTypes.bool,
  autoFocus: PropTypes.bool,
  // listApp: PropTypes.array,
  listApp: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  classNames: PropTypes.string,
  activedApp: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  setActivedApp: PropTypes.func,
  onBlur: PropTypes.func,
  getKey: PropTypes.func,
  filterOption: PropTypes.func,
  placeholder: PropTypes.string,
  onFocusFunc: PropTypes.func,
};

export default SelectCustomListing;
