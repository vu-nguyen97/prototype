import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Modal from "antd/lib/modal/Modal";
import Button from "antd/lib/button";
import Tree from "antd/lib/tree";
import Divider from "antd/lib/divider";
import {
  filterTree,
  getAllLeavesKeys,
  getAllParentKeys,
  getCurrentNode,
} from "../../../utils/helper/TreeHelpers";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import HolderOutlined from "@ant-design/icons/lib/icons/HolderOutlined";
import Search from "antd/lib/input/Search";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { getDay, reorder } from "../../../utils/Helpers";
import { getColTitle } from "../../../utils/helper/TableHelpers";
import Tooltip from "antd/es/tooltip";
import { AiOutlineQuestionCircle } from "@react-icons/all-files/ai/AiOutlineQuestionCircle";
import Switch from "antd/lib/switch";
import moment from "moment";

const DYNAMIC_DAY = "dynamicDay";

function ModalSettings(props) {
  const {
    isOpen,
    onClose,
    treeColumns,
    columns,
    colSettings,
    setColSettings,
    dateRange,
  } = props;

  const [treeData, setTreeData] = useState<any>([]);
  const [crrTreeData, setCrrTreeData] = useState<any[]>([]);
  const [treeSearch, setTreeSearch] = useState<string>();

  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedNodes, setCheckedNodes] = useState<any>([]);
  const [initedNodes, setInitedNodes] = useState<any>([]);
  const [isDynamic, setIsDynamic] = useState(
    localStorage.getItem(DYNAMIC_DAY) === "true"
  );

  useEffect(() => {
    const listKeys = getAllLeavesKeys(treeColumns);

    // Khi init, sẽ lấy thêm các column từ prop ("columns") mà treeColumns chưa có
    const filteredCols = columns
      .filter((el) => !listKeys.includes(el.columnId))
      ?.map((el) => ({ title: getColTitle(el), key: el.columnId }));

    const listColumns = [...treeColumns, ...filteredCols];

    const getList = (list, parentTitle = "", fullName = false) => {
      return list.map((el) => {
        if (!el.children?.length) return { ...el, parentTitle, fullName };

        return {
          ...el,
          parentTitle,
          fullName,
          children: getList(el.children, getColTitle(el), el.fullName),
        };
      });
    };

    const newTreeData = getList(listColumns);
    setTreeData(newTreeData);
    setCrrTreeData(newTreeData);
  }, []);

  useEffect(() => {
    if (!treeData?.length) return;

    const initedNodes = Object.keys(colSettings || {})
      ?.filter((el) => colSettings[el])
      .map((el) => getCurrentNode(el, treeData));
    setCheckedNodes(initedNodes);
    setInitedNodes(initedNodes);
  }, [colSettings, treeData]);

  const onCloseModal = (resetNodes = true) => {
    onClose();
    setTimeout(() => {
      setTreeSearch("");
      setExpandedKeys([]);
      if (resetNodes) {
        setCheckedNodes(initedNodes);
      }
    }, 300);
  };

  const onCheck = (checkedKeysValue, info) => {
    let newNodes = info.checkedNodes?.filter((el) => !el.children?.length);
    const node = info.node || {};

    // Chỉ ghi đè (không chọn các metrics không có day data) khi đã chọn checkbox và có truyền dateRange
    if (isDynamic && dateRange?.length && node.children?.length) {
      const totalDay = moment().diff(moment(dateRange?.[0]), "days");
      const childrenNodes = node?.children || [];
      const nodeKeys = getAllLeavesKeys(childrenNodes);
      const isCheckd = node.halfChecked || node.checked;
      // Khi đã được check dù là halfChecked thì cũng clear all đi
      // Vì có case: thư viện đang detect là đã chọn (halfChecked) rồi nên vẫn toggle hành động "check" thay vì "uncheck"
      const filteredKeys = isCheckd ? nodeKeys : [];

      newNodes = newNodes.filter((node) => {
        if (filteredKeys.some((el) => el === node.key)) return false;

        const day = getDay(node.key);
        if (day > -1 && Number(day) > totalDay) {
          return false;
        }
        return true;
      });
    }
    setCheckedNodes(newNodes);
  };

  const onExpand = (newExpandedKeys, info) => {
    setExpandedKeys(newExpandedKeys);
  };

  const onRemove = (data) => {
    const newNodes = checkedNodes.filter((el) => el.key !== data.key);
    setCheckedNodes(newNodes);
  };

  const onRemoveAll = () => {
    setCheckedNodes([]);
  };

  const onSearchTree = (e) => {
    const { value } = e.target;
    const newTreeData = filterTree(treeData, value);
    const listKeys = getAllParentKeys(newTreeData);

    value && setExpandedKeys(listKeys);
    setCrrTreeData(newTreeData);
    setTreeSearch(value);
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    // item does not change position
    if (result.source.index === result.destination.index) return;

    const orderedColumn = reorder(
      checkedNodes,
      result.source.index,
      result.destination.index
    );
    setCheckedNodes(orderedColumn);
  };

  const onChangeDynamicDay = (value) => {
    setIsDynamic(value);
    localStorage.setItem(DYNAMIC_DAY, value);
  };

  const onApply = () => {
    const newSettings: any = {};
    checkedNodes.forEach((el) => {
      newSettings[el.key] = true;
    });

    setColSettings(newSettings);
    onCloseModal(false);
  };

  return (
    <Modal
      title="Table settings"
      style={{ top: "30px" }}
      open={isOpen}
      width={750}
      maskClosable={false}
      onCancel={() => onCloseModal()}
      footer={[
        <Button key="back" onClick={() => onCloseModal()}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={onApply}>
          Apply
        </Button>,
      ]}
    >
      <div className="flex flex-col md:flex-row md:max-h-[calc(100vh-220px)]">
        <div className="flex flex-col">
          <div className="font-bold">Metrics</div>
          <Search
            allowClear
            className="mt-1"
            placeholder="Search"
            value={treeSearch}
            onChange={onSearchTree}
          />
          <div className="flex items-center font-semibold py-1.5 mb-2 border-b">
            <div className="flex items-center mr-4">
              Dynamic day
              <Tooltip
                title="If enabled, when the wrapper checkbox level is selected, it will not select metrics without data."
                color="white"
                overlayClassName="tooltip-light"
              >
                <AiOutlineQuestionCircle size={16} className="ml-1" />
              </Tooltip>
              :
            </div>
            <Switch
              size="small"
              title="Dynamic day"
              checked={isDynamic}
              onChange={onChangeDynamicDay}
            />
          </div>
          <Tree
            className="w-60 overflow-auto !-ml-2"
            treeData={crrTreeData}
            selectable={false}
            checkable
            blockNode
            expandedKeys={expandedKeys}
            onExpand={onExpand}
            checkedKeys={checkedNodes?.map((el) => el.key)}
            onCheck={onCheck}
          />
        </div>
        <Divider type="vertical" className="!h-auto !mx-4" />
        <div className="md:!hidden px-4">
          <Divider className="!h-full !mt-2 !mb-4" />
        </div>

        <div className="flex-1 h-auto overflow-y-auto">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="TableSettingsDroppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="p-4 pt-3 rounded min-h-[200px] bg-slate-100"
                >
                  <div className="flex justify-between">
                    <div className="font-bold">
                      Metrics order
                      {checkedNodes?.length > 0 && (
                        <span> ({checkedNodes.length})</span>
                      )}
                    </div>
                    <div
                      className="font-semibold cursor-pointer hover:!text-black"
                      onClick={onRemoveAll}
                    >
                      Remove all
                    </div>
                  </div>
                  <Divider className="!mx-0 !my-2" />

                  <div className="mt-4">
                    {checkedNodes?.map((data, idx) => {
                      const { parentTitle, fullName } = data;
                      const title = getColTitle(data);
                      const columnName =
                        fullName && parentTitle
                          ? title + " (" + parentTitle + ")"
                          : title;

                      return (
                        <Draggable
                          key={data.key}
                          draggableId={data.key}
                          index={idx}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex items-center justify-between pl-3 bg-white mt-2 rounded border"
                            >
                              <div className="flex items-center">
                                <HolderOutlined className="mr-2" />
                                <span>{columnName}</span>
                              </div>
                              <DeleteOutlined
                                className="basis-9 py-3 cursor-pointer"
                                onClick={() => onRemove(data)}
                              />
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                  </div>

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </Modal>
  );
}

ModalSettings.defaultProps = {};

ModalSettings.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  columns: PropTypes.array,
  treeColumns: PropTypes.array,
  colSettings: PropTypes.object,
  setColSettings: PropTypes.func,
  dateRange: PropTypes.array,
};

export default ModalSettings;
