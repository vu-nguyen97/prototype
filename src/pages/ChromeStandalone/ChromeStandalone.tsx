import React, {useState, useEffect} from "react";
import Page from "../../utils/composables/Page";
import Loading from "../../utils/Loading";
import Button from "antd/lib/button";
import ChromeStandaloneTable from "./ChromeStandaloneTable";
import ModalAddChromeStandalone from "./ModalAddChromeStandalone";
import service from "../../partials/services/axios.config";
import { toast } from "react-toastify";
const ChromeStandalone = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isOpenModalAddApp, setIsOpenModalAddApp] = useState(false);
    const [listContainer, setListContainer] = useState<any>([]);
    useEffect(() => {
        setIsLoading(true);
        service.get("/chrome-standalone-containers").then(
          (res: any) => {
            setListContainer(res.results);
            setIsLoading(false);
          },
          () => setIsLoading(false)
        );
      }, []);
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

    const onAddContainer = (values) =>{
        const {ip , chromePort, vncPort, vncPassword} = values;

        setIsLoading(true);
        service.post("/chrome-standalone-containers",{ip, chromePort, vncPort, vncPassword}).then(
          (res: any) => {
            toast(res.message || "Add container success!", { type: "success" });
            setIsLoading(false);
          },
          () => setIsLoading(false)
        );
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
                    listData={listContainer}
                />
            </div>
        </div>
        <ModalAddChromeStandalone
        isOpen={isOpenModalAddApp}
        onClose={() => setIsOpenModalAddApp(false)}
        setIsLoading={setIsLoading}
        onFinish={onAddContainer}/>
        </Page>
    )
}

export default ChromeStandalone;