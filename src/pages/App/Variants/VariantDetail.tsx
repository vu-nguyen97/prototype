import React from "react";
import PropTypes from "prop-types";
import NewVariant from "./NewVariant";
import AddCampaigns from "../../AddCampaign";
import { Collapse } from "antd";
const { Panel } = Collapse;

const onCollapseChange = () => {};

function VariantDetail(props) {
  const { data, idx, init, pickedVariant } = props;

  return (
    <div className="p-4 sm:p-6">
      {!init ? (
        <>
          <div>
            <Collapse defaultActiveKey={["1"]} onChange={onCollapseChange}>
              <Panel header="App used" key="1">
                <NewVariant viewOnlyMode={true} data={data} idx={idx} />
              </Panel>
              <Panel header="Unity ads" key="2">
                <AddCampaigns data={data}></AddCampaigns>
              </Panel>
            </Collapse>
          </div>
        </>
      ) : (
        <NewVariant pickedVariant={pickedVariant} idx={idx}/>
      )}
    </div>
  );
}

VariantDetail.propTypes = {
  data: PropTypes.object,
  idx: PropTypes.number,
  init: PropTypes.bool,
  pickedVariant: PropTypes.arrayOf(PropTypes.any),
};

export default VariantDetail;
