import React, { useEffect, useState } from "react";
import Page from "../../utils/composables/Page";
import { Link, useParams } from "react-router-dom";
import Breadcrumb from "antd/lib/breadcrumb/Breadcrumb";
import Loading from "../../utils/Loading";
import service from "../../partials/services/axios.config";
import StoreAppIcon from "../../partials/common/StoreAppIcon";
import NewTheme from "../App/Themes/NewTheme/NewTheme";

function AppDetail(props) {
    const { id } = useParams<{ id: string }>();
    const [appData, setAppData] = useState<any>(null);

    const [isLoading, setIsLoading] = useState(false);
    const packageClass = "!text-slate-400 truncate";

    useEffect(() => {
        setIsLoading(true);
        service.get(`/store-app/${id}`).then(
            (res: any) => {
                setIsLoading(false);
                setAppData(res.results);
            },
            () => setIsLoading(false)
        );
    }, [id]);


    return (

        <Page>
            {isLoading && <Loading />}
            {appData && (
                <div>
                    <div
                        className="flex items-center bg-white p-5 rounded-sm"
                    >
                        <div className="flex items-center grow truncate">
                            <div className="shrink-0">
                                <StoreAppIcon app={appData} />
                            </div>

                            <div className="ml-5 grow truncate">
                                <div className="text-base sm:text-lg md:text-xl font-bold !text-black overflow-auto whitespace-normal line-clamp-2">
                                    {appData.name}
                                </div>
                                {appData.url ? (
                                    <a
                                        href={appData.url}
                                        className={packageClass}
                                        title="View the game in the store"
                                        target="_blank"
                                    >
                                        {appData.storeId}
                                    </a>
                                ) : (
                                    <div className={packageClass}>{appData.storeId}</div>
                                )}
                            </div>
                        </div>

                    </div>
                    <div className="flex items-center bg-white p-5 rounded-sm">
                        <NewTheme 
                            title="Update Main Store Listing"
                            target="APP"
                        ></NewTheme>
                    </div>

                </div>
            )}


        </Page>
    );
}

export default AppDetail;