import React, { useEffect, useState } from "react";
import Page from "../../../../utils/composables/Page";
import { Link, useParams } from "react-router-dom";
import Breadcrumb from "antd/lib/breadcrumb/Breadcrumb";
import { APP_PATH, EXTRA_FOOTER } from "../../../../constants/constants";
import CountryBid from "./CountryBid/CountryBid";
import CreativePacks from "./CreativePack/CreativePack";
import {
  DATE_RANGE_FORMAT,
  getLast7Day,
  onClickRangePickerFooter,
} from "../../../../partials/common/Forms/RangePicker";
import { disabledDate } from "../../../../utils/Helpers";
import Tag from "antd/lib/tag";
import DatePicker from "antd/lib/date-picker";
import VideoPopup from "../../../../partials/common/Modal/VideoPopup";
import ImagePreview from "../../../../partials/common/Modal/ImagePreview";
import service from "../../../../partials/services/axios.config";
import Loading from "../../../../utils/Loading";
import moment from "moment";
import Stats from "./Stats/Stats";

function CampaignDetail(props) {
  const urlParams = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [campaignData, setCampaignData] = useState<any>({});
  const [isOpenDateRange, setIsOpenDateRange] = useState(false);
  const [dateRange, setDateRange] = useState<any>(getLast7Day());

  const [previewData, setPreviewData] = useState({});
  const [imgPreview, setImgPreview] = useState<any>({});

  useEffect(() => {
    const params = {
      campaignId: urlParams.campId,
      startDate: moment(dateRange[0])?.format(DATE_RANGE_FORMAT),
      endDate: moment(dateRange[1])?.format(DATE_RANGE_FORMAT),
    };

    setIsLoading(true);
    service.get("/campaign", { params }).then(
      (res: any) => {
        setIsLoading(false);
        setCampaignData(res.results);
      },
      () => setIsLoading(false)
    );
  }, [urlParams.campId]);

  const onChangeRangePicker = (values) => {
    setDateRange(values);
  };

  return (
    <Page>
      {isLoading && <Loading />}

      <div className="page-breadcrum">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={APP_PATH + "/" + urlParams.appId + "/campaigns"}>
              Campaigns
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{campaignData.name}</Breadcrumb.Item>
        </Breadcrumb>

        <DatePicker.RangePicker
          className="w-full xs:w-auto"
          open={isOpenDateRange}
          onOpenChange={(open) => setIsOpenDateRange(open)}
          value={dateRange}
          onChange={onChangeRangePicker}
          disabledDate={disabledDate}
          renderExtraFooter={() => (
            <div className="flex py-2.5">
              {EXTRA_FOOTER.map((obj, idx) => (
                <Tag
                  key={idx}
                  color="blue"
                  className="cursor-pointer"
                  onClick={() =>
                    onClickRangePickerFooter(obj.value, setDateRange, () =>
                      setIsOpenDateRange(false)
                    )
                  }
                >
                  {obj.label}
                </Tag>
              ))}
            </div>
          )}
        />
      </div>

      <div className="px-4 sm:px-6 lg:px-12 2xl:px-24 py-6 flex flex-col space-y-4 md:space-y-6">
        <Stats data={campaignData.data} />
        <CountryBid />
        <CreativePacks
          dateRange={dateRange}
          setPreviewData={setPreviewData}
          setImgPreview={setImgPreview}
        />
      </div>

      <VideoPopup
        classNames="!z-1190"
        onClose={() => setPreviewData({})}
        previewData={previewData}
      />
      <ImagePreview imgPreview={imgPreview} setImgPreview={setImgPreview} />
    </Page>
  );
}

export default CampaignDetail;
