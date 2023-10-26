import React, {useState} from "react";
import Page from "../../utils/composables/Page";
import Loading from "../../utils/Loading";
import Button from "antd/lib/button";
import ChromeStandaloneTable from "./ChromeStandaloneTable";
import ModalAddChromeStandalone from "./ModalAddChromeStandalone";
const ChromeStandalone = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpenModalAddApp, setIsOpenModalAddApp] = useState(false);
    const listData = [
        {
            id:1,
            IP: "ip-1",
            chromePort: "chrome-port-1",
            vncPort: "vnc-port-1",
            vncpwd: "vnc-pwd-1"
        },
        {
            id:2,
            IP: "ip-2",
            chromePort: "chrome-port-2",
            vncPort: "vnc-port-2",
            vncpwd: "vnc-pwd-2"
        },
        {
            id:3,
            IP: "ip-3",
            chromePort: "chrome-port-3",
            vncPort: "vnc-port-3",
            vncpwd: "vnc-pwd-3"
        },
    ]
    const onEditData = (record) => {

    }

    const onDelete = (record) => {

    }
    return(
        <Page>
            {isLoading && <Loading />}
        <div>
            <h1 style={{fontSize: 40, fontWeight: "bold"}}>Chrome Standalone Containers</h1>
            <div>
                <div>
                    <Button type="primary" onClick={(e) => setIsOpenModalAddApp(true)}>
                            New
                    </Button>
                </div>
                <ChromeStandaloneTable
                    isLoading = {isLoading}
                    onEdit={onEditData}
                    onDelete={onDelete}
                    listData={listData}
                />
            </div>
        </div>
        <ModalAddChromeStandalone
        isOpen={isOpenModalAddApp}
        onClose={() => setIsOpenModalAddApp(false)}
        setIsLoading={setIsLoading}/>
        </Page>
    )
}

export default ChromeStandalone;