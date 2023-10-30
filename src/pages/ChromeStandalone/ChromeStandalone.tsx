import React, {useState, useEffect} from "react";
import Page from "../../utils/composables/Page";
import Loading from "../../utils/Loading";
import Button from "antd/lib/button";
import ChromeStandaloneTable from "./ChromeStandaloneTable";
import ModalAddChromeStandalone from "./ModalAddChromeStandalone";
import service from "../../partials/services/axios.config";
import { toast } from "react-toastify";
import ModalEditChromeStandalone from "./ModalEditChromeStandalone";
import ModalConfirmDelete from "./ModalConfirmDelete";
const ChromeStandalone = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isOpenModalAddApp, setIsOpenModalAddApp] = useState(false);
    const [listContainer, setListContainer] = useState<any>([]);
    const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
    const [editedContainer, setEditedContainer] = useState<any>({});
    const [deleteContainer, setDeleteContainer] = useState<any>({});
    const [isOpenModalConfirmDelete, setIsOpenModalConfirmDelete] = useState(false);
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

    
    const onEditData = (record) => {
        setEditedContainer(record);
        setIsOpenModalEdit(true);
    }

    const onDelete = (record) => {
        setDeleteContainer(record);
        setIsOpenModalConfirmDelete(true);
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

        <ModalEditChromeStandalone
        isOpen={isOpenModalEdit}
        onClose={() => setIsOpenModalEdit(false)}
        setIsLoading={setIsLoading}
        data={editedContainer}
        />

        <ModalConfirmDelete
        isOpen={isOpenModalConfirmDelete}
        onClose={() => setIsOpenModalConfirmDelete(false)}
        setIsLoading={setIsLoading}
        data={deleteContainer}
        />
        </Page>
    )
}

export default ChromeStandalone;