import React from "react";
import { numberWithCommas } from "../../../../../utils/Utils";

function Stats({ data }) {
  const checkNullable = (data) => (data === 0 ? true : !!data);

  const statClass = "text-stone-500 mb-1";
  const numberClass = "font-semibold";

  return (
    <div className="flex justify-between border bg-white rounded px-6 py-5 text-base">
      <div className="flex space-x-4 2xl:space-x-16">
        <div>
          <div className={statClass}>Installs</div>
          <div className={numberClass}>{numberWithCommas(data?.install)}</div>
        </div>
        <div>
          <div className={statClass}>Clicks</div>
          <div className={numberClass}>{numberWithCommas(data?.click)}</div>
        </div>
        <div>
          <div className={statClass}>Impressions</div>
          <div className={numberClass}>
            {numberWithCommas(data?.impression)}
          </div>
        </div>
      </div>
      <div className="flex space-x-4 2xl:space-x-16">
        <div>
          <div className={statClass}>eCPI</div>
          {checkNullable(data?.ecpi) && (
            <div className={numberClass}>${numberWithCommas(data.ecpi)}</div>
          )}
        </div>
        <div>
          <div className={statClass}>Cost</div>
          {checkNullable(data?.cost) && (
            <div className={numberClass}>${numberWithCommas(data.cost)}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Stats;
