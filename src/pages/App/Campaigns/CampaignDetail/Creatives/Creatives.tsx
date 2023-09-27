import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { checkContainText } from "../../../../../utils/helper/TableHelpers";
import InfiniteScrollTable from "../../../../../utils/hooks/InfiniteScrollTable";
import {
  getSortedData,
  onChangeInfiniteTable,
  sortByString,
} from "../../../../../partials/common/Table/Helper";
import {
  SortData,
  SortMap,
} from "../../../../../partials/common/Table/interface";
import { getColumns } from "./TableColumns";
import Table from "antd/lib/table";

function Creatives(props) {
  const { setPreviewData, setImgPreview, initedCreatives } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [creatives, setCreatives] = useState<any>([]);

  const [searchData, setSearchData] = useState<any>({});

  const PAGE_SIZE = 10;
  const [tablePage, setTablePage] = useState(0);
  const [sortData, setSortData] = useState<SortData>({});
  const [columns, setColumns] = useState(getColumns({}));

  useEffect(() => {
    // initedCreatives là một mảng, default là undefined
    // -> ko check theo length để đợi api của creative pack call xong (initedCreatives có thể là [])
    if (initedCreatives && isLoading) {
      setIsLoading(false);
    }

    if (!initedCreatives?.length) return setCreatives([]);
    setCreatives(initedCreatives);
  }, [initedCreatives]);

  const onSearchTable = (value, field) => {
    setSearchData({ ...searchData, [field]: value });
  };

  const sortMap: SortMap[] = [
    {
      title: "Name",
      sorter: (a, b) => sortByString(a, b, "name"),
    },
    {
      title: "Type",
      sorter: (a, b) => sortByString(a, b, "type"),
    },
    {
      title: "Language",
      sorter: (a, b) => sortByString(a, b, "language"),
    },
  ];

  useEffect(() => {
    setColumns(
      getColumns({
        onSearchTable,
        setPreviewData,
        setImgPreview,
      })
    );
  }, [creatives]);

  const sortedData = getSortedData(creatives, sortData);
  const filteredData = sortedData?.filter((el) => {
    let result = true;
    const isContainText = checkContainText(searchData, el);

    if (!isContainText) {
      result = false;
    }

    return result;
  });

  InfiniteScrollTable({
    listData: creatives,
    setTablePage,
    tablePage,
    filteredData,
    PAGE_SIZE,
    tableId: "CampaignCreative",
  });

  const paginationedData = filteredData.slice(0, PAGE_SIZE * (tablePage + 1));
  const isScrollY = filteredData && filteredData.length > 10;

  return (
    <>
      <div className="page-section-multi">
        <div className="flex justify-between items-start">
          <div className="text-black font-semibold text-lg min-h-[32px]">
            Creatives
            {filteredData?.length > 0 && (
              <span className="ml-1">({filteredData?.length})</span>
            )}
          </div>
        </div>

        <Table
          loading={isLoading}
          // @ts-ignore
          columns={columns}
          setColumns={setColumns}
          id="CampaignCreative"
          getPopupContainer={() => document.getElementById("CampaignCreative")!}
          size="small"
          className={classNames("mt-1")}
          rowKey={(record) => record.id}
          dataSource={paginationedData}
          scroll={{ x: 600, y: isScrollY ? 325 : undefined }}
          pagination={false}
          onChange={(p, f, s, e) =>
            onChangeInfiniteTable(p, f, s, e, sortMap, setSortData)
          }
        />
      </div>
    </>
  );
}

Creatives.propTypes = {
  setPreviewData: PropTypes.func,
  setImgPreview: PropTypes.func,
  initedCreatives: PropTypes.array,
};

export default Creatives;
