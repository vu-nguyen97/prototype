import React from "react";
import Collapse from "antd/lib/collapse";
import CloseOutlined from "@ant-design/icons/lib/icons/CloseOutlined";
import classNames from "classnames";
import { RequiredMark } from "../../../../utils/helper/UIHelper";
import { Group, Listing } from "./interface";
import { bulkLink } from "../../../AddCampaign/constants";
import { PlusIcon } from "../../../AddCampaign/Helpers";
import FormEl from "./FormEl";
import { getGroupListing } from "../Helpers";

function ListingGroup(props) {
  const {
    form,
    className,
    activeKey,
    setActiveKey,
    groups,
    setGroups,
    listings = [],
    title = "Listing",
    disabled,
  } = props;

  const onChangeGroup = (group, value, field: keyof Group = "listing") => {
    const newGroup = groups.map((el: Group) => {
      if (el.id !== group.id) return el;
      return { ...el, [field]: value };
    });
    setGroups(newGroup);
  };

  const onDeleteGroup = (event, groupId) => {
    event.stopPropagation();
    setGroups(groups.filter((el) => el.id !== groupId));
  };

  const onChangeCollapse = (newStrKeys) => {
    const newKeys = newStrKeys.map((groupId) => Number(groupId));

    if (newKeys.length < activeKey.length) {
      // Collapse action: ko cho collapse khi data đang rỗng (form error)
      const activedKey = activeKey.find((key) => !newKeys.includes(key));
      const activedGroup: Group = groups.find((el) => el.id === activedKey);

      if (!activedGroup?.listing || !activedGroup.creatives?.length) return;
    }

    if (!newKeys.length) {
      setActiveKey([]);
    } else {
      setActiveKey(newKeys);
    }
  };

  const getListingName = (id) => {
    return listings.find((el: Listing) => el.id === id)?.listingName;
  };

  const getGroupName = (group) => {
    const { id, listing, creatives } = group;
    if (activeKey?.includes(id)) return "Group";

    const totalCreative = creatives?.length;
    let text = totalCreative > 1 ? " creatives" : " creative";

    return (
      <div>
        Group: (<span className="font-bold">{getListingName(listing)}</span>
        {" - "}
        {totalCreative}
        <span>{text}</span>)
      </div>
    );
  };

  return (
    <div className={classNames("border p-5 shadow-md rounded", className)}>
      {title && (
        <div className="mb-2">
          {RequiredMark} {title}
        </div>
      )}

      <Collapse
        className="!bg-transparent not-custom-header-font"
        bordered={false}
        activeKey={activeKey}
        onChange={onChangeCollapse}
      >
        {groups.map((group: Group) => {
          const { id, listing, creatives } = group;
          const listingData = getGroupListing(groups, id, listings);

          return (
            <Collapse.Panel
              forceRender
              header={getGroupName(group)}
              key={id}
              className={classNames(
                "!border-0 !bg-gray-100/60 !rounded last:!mb-1",
                id && "!mt-1.5"
              )}
              extra={
                <CloseOutlined
                  className="pl-2"
                  title="Delete group"
                  onClick={(e) => onDeleteGroup(e, id)}
                />
              }
            >
              <div className="ml-6">
                <FormEl
                  form={form}
                  group={group}
                  onChangeGroup={onChangeGroup}
                  listingData={listingData}
                  disabled={disabled}
                />
              </div>
            </Collapse.Panel>
          );
        })}
      </Collapse>
      {addBidGroupLink({ groups, setGroups, setActiveKey })}
    </div>
  );
}

export default ListingGroup;

export const addBidGroupLink = (params: any = {}) => (
  <div className={bulkLink} onClick={() => onPlusGroup(params)}>
    {PlusIcon}
    <span>Add new group</span>
  </div>
);

export const onPlusGroup = ({ groups, setGroups, setActiveKey }) => {
  if (!groups?.length) {
    setGroups([{ id: 0 }]);
    setActiveKey([0]);
    return;
  }

  const lastGroup = groups[groups.length - 1];
  const newId = lastGroup.id + 1;
  const hasErrForm = groups.some((group: Group) => {
    if (!group.listing || !group.creatives?.length) return true;
    return false;
  });
  if (hasErrForm) return;

  setGroups([...groups, { id: newId }]);
  setActiveKey([newId]);
};
