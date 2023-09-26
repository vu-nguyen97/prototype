import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import service from "../../../../../partials/services/axios.config";
import { useParams } from "react-router";
import moment from "moment";
import { DATE_RANGE_FORMAT } from "../../../../../partials/common/Forms/RangePicker";
import TableWrapper from "../../../../../partials/common/Table/TableWrapper";
import { getColumns } from "./TableColumns";
import {
  SortData,
  SortMap,
} from "../../../../../partials/common/Table/interface";
import classNames from "classnames";
import {
  getRowSelection,
  getSortedData,
  onChangeInfiniteTable,
  sortByString,
} from "../../../../../partials/common/Table/Helper";
import {
  checkContainText,
  checkRangeValue,
  setRangeValue,
} from "../../../../../utils/helper/TableHelpers";
import InfiniteScrollTable from "../../../../../utils/hooks/InfiniteScrollTable";
// import { performanceSortMap } from "../../../../../partials/common/Table/Columns/PerformanceCols";
import { toast } from "react-toastify";
import ModalDetail from "./ModalDetail";

function CreativePacks(props) {
  const urlParams = useParams();
  const { dateRange, setPreviewData, setImgPreview } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [creativePacks, setCreativePacks] = useState<any>([]);

  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [filterByMaxMin, setFilterByMaxMin] = useState<any>({});
  const [searchData, setSearchData] = useState<any>({});

  const PAGE_SIZE = 10;
  const [tablePage, setTablePage] = useState(0);
  const [sortData, setSortData] = useState<SortData>({});
  const [columns, setColumns] = useState(getColumns({}));

  const [packToView, setPackToView] = useState<any>({});

  useEffect(() => {
    const params = {
      // startDate: moment(dateRange[0])?.format(DATE_RANGE_FORMAT),
      // endDate: moment(dateRange[1])?.format(DATE_RANGE_FORMAT),
      campaignId: urlParams.campId,
    };

    setIsLoading(true);
    service.get("/creativePack", { params }).then(
      (res: any) => {
        setIsLoading(false);
        setCreativePacks(res.results || []);

        if (res.results?.length) {
          let creatives: any = [];
          res.results.forEach((el) => {
            if (el.creatives?.length) {
              creatives = [...creatives, ...el.creatives];
            }
          });
        }
      },
      () => setIsLoading(false)
    );
  }, [dateRange]);

  const onSearchTable = (value, field) => {
    setSearchData({ ...searchData, [field]: value });
  };

  const onFilterTable = (data) => {
    setRangeValue(data, filterByMaxMin, setFilterByMaxMin);
  };

  const onClickName = (rd) => {
    if (rd.creatives?.length || rd.assets?.length) {
      setPackToView(rd);
    }
  };

  useEffect(() => {
    setColumns(
      getColumns({
        onClickName,
        onSearchTable,
        onFilterTable,
      })
    );
  }, [creativePacks]);

  const onClickAction = (key) => {};

  const rowSelection = getRowSelection(
    selectedRecords,
    setSelectedRecords,
    creativePacks
  );

  const sortMap: SortMap[] = [
    {
      title: "Name",
      sorter: (a, b) => sortByString(a, b, "name"),
    },
    // ...performanceSortMap,
  ];

  const sortedData = getSortedData(creativePacks, sortData);
  const filteredData = sortedData?.filter((el) => {
    let result = true;

    const isContainText = checkContainText(searchData, el);
    const checkValue = checkRangeValue(filterByMaxMin, el);

    if (!isContainText || !checkValue) {
      result = false;
    }

    return result;
  });

  InfiniteScrollTable({
    listData: creativePacks,
    setTablePage,
    tablePage,
    filteredData,
    PAGE_SIZE,
    tableId: "CampaignCreativePacks",
  });

  const paginationedData = filteredData.slice(0, PAGE_SIZE * (tablePage + 1));
  const isScrollY = filteredData && filteredData.length > 10;
  const settingOpts = [];

  return (
    <div className="page-section-multi">
      <div className="flex justify-between items-start">
        <div className="text-black font-semibold text-lg min-h-[32px]">
          Creative Packs
          {filteredData?.length > 0 && (
            <span className="ml-1">({filteredData?.length})</span>
          )}
        </div>
        {/* <SettingEl onClickAction={onClickAction} items={settingOpts} /> */}
      </div>

      <TableWrapper
        loading={isLoading}
        initialColumns={columns}
        setColumns={setColumns}
        isShowSettings={false}
        isShowSummary={false}
        id="CampaignCreativePacks"
        size="middle"
        className={classNames("mt-1")}
        rowKey={(record) => record.id}
        dataSource={paginationedData}
        scroll={{ x: 600, y: isScrollY ? 325 : undefined }}
        // scroll={{ x: 1800, y: isScrollY ? 325 : undefined }}
        pagination={false}
        onChange={(p, f, s, e) =>
          onChangeInfiniteTable(p, f, s, e, sortMap, setSortData)
        }
        rowSelection={rowSelection}
      />

      <ModalDetail
        isOpen={!!packToView?.id}
        onClose={() => setPackToView({})}
        rd={packToView}
        setPreviewData={setPreviewData}
        setImgPreview={setImgPreview}
      />
    </div>
  );
}

CreativePacks.propTypes = {
  dateRange: PropTypes.array,
  setPreviewData: PropTypes.func,
  setImgPreview: PropTypes.func,
};

export default CreativePacks;
