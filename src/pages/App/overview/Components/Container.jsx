import React, { useState } from "react";
import Dropdown from "antd/lib/dropdown/dropdown";
import MoreOutlined from "@ant-design/icons/lib/icons/MoreOutlined";
import LineChart from "../Charts/LineChart";
import BarChart from "../Charts/BarChart";
import PieChart from "../Charts/PieChart";
import DoughnutChart from "../Charts/DoughnutChart";
import StackBarChart from "../Charts/StackBarChart";
const Container = ({listPerformance, listChart, criteria}) => {
    const [selectedChart, setSelectedChart] = useState(listChart[0].key);
    return (
        <div style={{marginBottom: 40 , backgroundColor: "white"}}>
            <div style={{marginLeft:918, paddingTop: 10}}>
                <Dropdown
                    className="!ml-0 xs:!ml-2"
                    menu={{
                        selectable: true,
                        items: listChart,
                        onClick: (item) => {setSelectedChart(item.key)},
                    }}
                    trigger={["click"]}
                >
                    <button className="btn-light icon !px-1.5 !py-2" >
                        <MoreOutlined />
                    </button>
                </Dropdown>
            </div>
            {selectedChart == 1&&<LineChart props = {listPerformance}/>}
            {selectedChart == 2&&<BarChart props = {listPerformance}/>}
            {selectedChart == 3&&<PieChart listPerformance={listPerformance} criteria={criteria}/>}
            {selectedChart == 4&&<DoughnutChart listPerformance={listPerformance} criteria={criteria}/>}
            {selectedChart == 5&&<StackBarChart listPerformance={listPerformance} criteria={criteria}/>}
        </div>
    );
};

export default Container;
