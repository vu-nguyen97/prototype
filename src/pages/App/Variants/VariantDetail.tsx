import React from "react";
import PropTypes from "prop-types";
import NewVariant from "./NewVariant";
import AddCampaigns from "../../AddCampaign";
import { Collapse } from "antd";
const { Panel } = Collapse;

const onCollapseChange = () => {

}

function VariantDetail(props) {
  const { data, idx, init } = props;

  console.log(data);

  return (
    <div className="p-4 sm:p-6">
      {!init ? (
        <>
          <div>
            <Collapse defaultActiveKey={['1']} onChange={onCollapseChange}>
              <Panel header="App used" key="1">
                <NewVariant viewOnlyMode={true} data={data} />
              </Panel>
              {/* <Panel header="Unity ads" key="2">
                <AddCampaigns name={data.name}></AddCampaigns>
              </Panel> */}
            </Collapse>
          </div>
        </>
      ) : (
        <NewVariant />
      )}

    </div>
  );
}

VariantDetail.propTypes = {
  data: PropTypes.object,
  idx: PropTypes.number,
  init: PropTypes.bool,
};

export default VariantDetail;
