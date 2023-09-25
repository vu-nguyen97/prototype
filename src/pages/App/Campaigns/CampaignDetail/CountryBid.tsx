import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Table from "antd/lib/table/Table";
import {
  getSortedData,
  keepSortColumn,
  onChangeInfiniteTable,
  sortByCountry,
  sortByString,
} from "../../../../partials/common/Table/Helper";
import service from "../../../../partials/services/axios.config";
import { useParams } from "react-router-dom";
import getColumnSearchProps from "../../../../partials/common/Table/CustomSearch";
import {
  getColumnNumber,
  getCountryEl,
  sortNumberWithNullable,
} from "../../../../utils/Helpers";
import InfiniteScrollTable from "../../../../utils/hooks/InfiniteScrollTable";
import { SortData, SortMap } from "../../../../partials/common/Table/interface";
import {
  checkContainText,
  checkRangeValue,
} from "../../../../utils/helper/TableHelpers";
import classNames from "classnames";
import { ID_COL_NO_WIDTH } from "../../../../partials/common/Table/Columns/IndexCol";

function CountryBid(props) {
  const urlParams = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [listData, setListData] = useState([]);

  const [searchData, setSearchData] = useState<any>({});
  const [filterByMaxMin, setFilterByMaxMin] = useState<any>({});

  const PAGE_SIZE = 20;
  const [tablePage, setTablePage] = useState(0);
  const [sortData, setSortData] = useState<SortData>({});

  const onSearchTable = (value, field) => {
    setSearchData({ ...searchData, [field]: value });
  };

  useEffect(() => {
    setIsLoading(true);
    service
      .get("/bids/countries", { params: { campaignId: urlParams.campId } })
      .then(
        (res: any) => {
          setIsLoading(false);
          setListData(res.results || []);
        },
        () => setIsLoading(false)
      );
  }, []);

  const sortMap: SortMap[] = [
    {
      title: "Country",
      sorter: (a, b) => sortByCountry(a, b),
    },
    {
      title: "Bid",
      sorter: (a, b) => sortNumberWithNullable(a, b, (el) => el.bid),
    },
    {
      title: "Type",
      sorter: (a, b) => sortByString(a, b, "type"),
    },
  ];

  const columns = [
    ID_COL_NO_WIDTH,
    {
      title: "Country",
      render: getCountryEl,
      sorter: keepSortColumn,
      ...getColumnSearchProps({
        dataIndex: "country",
        callback: (value) => onSearchTable(value, "country"),
        customFilter: () => true,
      }),
    },
    {
      title: "Bid",
      sorter: keepSortColumn,
      render: (rd) => getColumnNumber(rd.bid, "$"),
    },
    {
      title: "Type",
      render: (rd) => rd.type,
      sorter: keepSortColumn,
      ...getColumnSearchProps({
        dataIndex: "type",
        callback: (value) => onSearchTable(value, "type"),
        customFilter: () => true,
      }),
    },
  ];

  const sortedData = getSortedData(listData, sortData);
  const filteredData = sortedData.filter((el) => {
    let result = true;

    const isContainText = checkContainText(searchData, el, true);
    const checkValue = checkRangeValue(filterByMaxMin, el);

    if (!isContainText || !checkValue) {
      result = false;
    }

    return result;
  });

  InfiniteScrollTable({
    listData,
    setTablePage,
    tablePage,
    filteredData,
    PAGE_SIZE,
    tableId: "CampaignCountryBid",
  });

  const paginationedData = filteredData.slice(0, PAGE_SIZE * (tablePage + 1));
  const isScrollY = filteredData && filteredData.length > 10;

  return (
    <div className="page-section-multi">
      <div className="text-black font-semibold text-lg">
        Countries & Bids
        {filteredData?.length > 0 && (
          <span className="ml-1">({filteredData?.length})</span>
        )}
      </div>

      <Table
        id="CampaignCountryBid"
        className={classNames("mt-3", isScrollY && "custom-mask")}
        size="middle"
        rowKey={(record: any) => record.id}
        loading={isLoading}
        // @ts-ignore
        columns={columns}
        dataSource={paginationedData}
        scroll={{ x: 600, y: isScrollY ? 325 : undefined }}
        pagination={false}
        onChange={(p, f, s, e) =>
          onChangeInfiniteTable(p, f, s, e, sortMap, setSortData)
        }
      />
    </div>
  );
}

CountryBid.propTypes = {};

export default CountryBid;
