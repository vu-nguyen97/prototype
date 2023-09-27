import React from "react";
import PropTypes from "prop-types";
import { Field } from "../../Helpers";
// @ts-ignore
import UnityLogo from "../../../../../images/networks/unity.png";
import { capitalizeWord, getColumnNumber } from "../../../../../utils/Helpers";
import moment from "moment";
import EditableField from "./EditableField";
import service from "../../../../../partials/services/axios.config";
import { toast } from "react-toastify";

function Details(props) {
  const { data, setIsLoading, setCampaignData } = props;

  if (!data?.id) return <></>;

  const onSaveDailyBudget = (newValue, callback) => {
    const params = { ...data.defaultBudget, dailyBudget: newValue };
    onUpdateDaily(params, callback);
  };

  const onSaveTotalBudget = (newValue, callback) => {
    const params = { ...data.defaultBudget, totalBudget: newValue };
    onUpdateDaily(params, callback);
  };

  const onUpdateDaily = (params, callback) => {
    setIsLoading(true);
    service.put("/budget", params).then(
      (res: any) => {
        callback && callback();
        setCampaignData((oldState) => ({
          ...oldState,
          defaultBudget: res.results,
        }));
        toast(res.message, { type: "success" });
        setIsLoading(false);
      },
      () => setIsLoading(false)
    );
  };

  const dailyBudget = data?.defaultBudget?.dailyBudget;
  const dailyBudgetStr = getColumnNumber(dailyBudget, "$");
  const totalBudget = data?.defaultBudget?.totalBudget;
  const totalBudgetStr = getColumnNumber(totalBudget, "$");

  return (
    <div className="page-section-multi">
      <div className="text-black font-semibold text-lg">Campaign details</div>

      <div className="rounded-sm border-t border-b mt-4 text-sm2">
        <Field
          name="Network"
          value={
            <div className="flex items-center">
              <img
                src={UnityLogo}
                alt=" "
                className="w-5 h-5 rounded-sm mr-1 mb-0.5"
              />
              <span>Unity</span>
            </div>
          }
        />
        <Field
          name="Name"
          value={<span className="font-bold">{data.name}</span>}
        />
        <Field name="Billing type" value={capitalizeWord(data.billingType)} />
        <Field name="Campaign goal" value={capitalizeWord(data.goal)} />
        <Field
          name="Schedule start"
          value={
            data.scheduleStart &&
            moment(data.scheduleStart)?.format("DD-MM-YYYY HH:mm:ss")
          }
        />
        <Field
          border={false}
          name="Schedule end"
          value={
            data.scheduleEnd &&
            moment(data.scheduleEnd).format("DD-MM-YYYY HH:mm:ss")
          }
        />
        <EditableField
          title="Total budget"
          defaultValue={totalBudget}
          valueWithCurrency={totalBudgetStr}
          onSave={onSaveTotalBudget}
        />
        <EditableField
          title="Daily budget"
          defaultValue={dailyBudget}
          valueWithCurrency={dailyBudgetStr}
          onSave={onSaveDailyBudget}
        />
      </div>
    </div>
  );
}

Details.propTypes = {
  data: PropTypes.object,
  setIsLoading: PropTypes.func,
  setCampaignData: PropTypes.func,
};

export default Details;
