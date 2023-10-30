import React, {useState, useEffect} from "react";
import Page from "../../utils/composables/Page";
import Loading from "../../utils/Loading";
import GoogleAccountTable from "./GoogleAccountTable";
import service from "../../partials/services/axios.config";
import { toast } from "react-toastify";
import ModalAddGPStore from "./ModalAddGPStore";
import Button from "antd/lib/button";
import ModalEditGPStore from "./ModalEditGPStore";
import ModalConfirmDeleteGPStore from "./ModalConfirmDeleteGPStore";
import { Link, useLocation, useNavigate } from "react-router-dom";
const GoogleAccount = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [listGPStore, setListGPStore] = useState<any>([]);
    const [isOpenModalAdd, setIsOpenModalAdd] = useState(false);
    const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
    const [editedStore, setEditedStore] = useState<any>({});
    const [deleteStore, setDeleteStore] = useState<any>({});
    const [isOpenModalConfirmDelete, setIsOpenModalConfirmDelete] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        setIsLoading(true);
        service.get("/google-play-stores").then(
          (res: any) => {
            setListGPStore(res.results);
            setIsLoading(false);
          },
          () => setIsLoading(false)
        );
    }, []);

    
    const onEditData = (record) => {
        setEditedStore(record);
        setIsOpenModalEdit(true);
    }

    const onDelete = (record) => {
        setDeleteStore(record);
        setIsOpenModalConfirmDelete(true);
    }

    const onOpen = (record) => {

    }

    return(
        <Page>
            {isLoading && <Loading />}
        <div>
            <h1 style={{fontSize: 40, fontWeight: "bold"}}>Google Play Account</h1>
            <div>
            <div>
                <Button type="primary" onClick={(e) => setIsOpenModalAdd(true)}>
                        New Store
                </Button>
            </div>
                <GoogleAccountTable
                    isLoading = {isLoading}
                    onEdit={onEditData}
                    onDelete={onDelete}
                    onOpen={onOpen}
                    listData={listGPStore}
                />
            </div>
        </div>
        <ModalAddGPStore
        isOpen={isOpenModalAdd}
        onClose={() => setIsOpenModalAdd(false)}
        setIsLoading={setIsLoading}
        />

        <ModalEditGPStore
        isOpen={isOpenModalEdit}
        onClose={() => setIsOpenModalEdit(false)}
        setIsLoading={setIsLoading}
        data={editedStore}
        />
        <ModalConfirmDeleteGPStore
        isOpen={isOpenModalConfirmDelete}
        onClose={() => setIsOpenModalConfirmDelete(false)}
        setIsLoading={setIsLoading}
        data={deleteStore}
        />

        </Page>
    )
}

export default GoogleAccount;