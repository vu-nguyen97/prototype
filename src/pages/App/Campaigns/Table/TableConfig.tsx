import moment from "moment";
import {
  capitalizeWord,
  getColumnNumber,
  sortByBool,
  sortByDate,
  sortByString,
  sortNumberWithNullable,
} from "../../../../utils/Helpers";
import getColumnSearchProps from "../../../../partials/common/Table/CustomSearch";
import searchMaxMinValue from "../../../../partials/common/Table/SearchMaxMinValue";

export const getColumns = (props) => {
  const { onSearchTable, onFilterTable } = props;

  const getDate = (field, title) => ({
    title,
    sorter: sortByDate(field),
    render: (record) => {
      if (!record[field]) return "";
      return moment(record[field])?.format("DD/MM/YYYY HH:mm");
    },
  });

  return [
    {
      title: "Name",
      dataIndex: "name",
      sorter: sortByString("name"),
      ...getColumnSearchProps({
        dataIndex: "name",
        getField: (el) => el.name,
        callback: (value) => onSearchTable(value, "name"),
        customFilter: () => true,
      }),
    },
    {
      title: "Total budget",
      render: (rd) => getColumnNumber(rd.defaultBudget?.totalBudget, "$"),
      sorter: (a, b) =>
        sortNumberWithNullable(a, b, (el) => el.defaultBudget?.totalBudget),
      ...searchMaxMinValue({
        getField: (r) => r.defaultBudget?.totalBudget,
        dataIndex: "totalBudget",
        placeholderSuffix: " ",
        onFilterTable,
      }),
    },
    {
      title: "Daily budget",
      render: (rd) => getColumnNumber(rd.defaultBudget?.dailyBudget, "$"),
      sorter: (a, b) =>
        sortNumberWithNullable(a, b, (el) => el.defaultBudget?.dailyBudget),
      ...searchMaxMinValue({
        getField: (r) => r.defaultBudget?.dailyBudget,
        dataIndex: "dailyBudget",
        placeholderSuffix: " ",
        onFilterTable,
      }),
    },
    {
      title: "Billing Type",
      render: (rd) => capitalizeWord(rd.billingType),
      sorter: sortByString("billingType"),
    },
    {
      title: "Goal",
      render: (rd) => capitalizeWord(rd.goal),
      sorter: sortByString("goal"),
    },
    {
      title: "Billing Strategy",
      render: (rd) => capitalizeWord(rd.biddingStrategy),
      sorter: sortByString("biddingStrategy"),
    },
    getDate("createdAt", "Created at"),
    getDate("scheduleStart", "Schedule start"),
    getDate("scheduleEnd", "Schedule end"),
    {
      title: "Enabled",
      render: (rd) => String(rd.enabled),
      sorter: sortByBool("enabled"),
    },
  ];
};
