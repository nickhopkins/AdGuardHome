import React, {Fragment, useEffect} from 'react';
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getClients} from '../../../actions';

import PageTitle from '../../ui/PageTitle';
import {RootState} from '../../../initialState';
import {updateClient} from "../../../actions/clients";
import Loading from "../../ui/Loading";


const Client = () => {
    const dispatch = useDispatch();
    const {clientId} = useParams<{ clientId?: string }>();
    const clients = useSelector((state: RootState) => state.dashboard.clients);
    const processingClients = useSelector((state: RootState) => state.dashboard.processingClients);

    useEffect(() => {
        dispatch(getClients());

    }, []);

    console.log(clients);

    const getClient = (clientId: string, clients: any) => {
        const client = clients.find((item: any) => {
            return item.ids.find((inner: string) => inner === clientId)
        });

        if (client) {
            return client
        }

        return {
            name: "not found",
            ids: [],
            tags: [],
            use_global_settings: true,
            use_global_blocked_services: true,
        };
    };

    const client = getClient(clientId, clients);

    const handleFormUpdate = (values: any, name: any) => {
        dispatch(updateClient(values, name));
    };

    const handleClick = () => {
        const values = {...client, use_global_blocked_services: !client.use_global_blocked_services}
        handleFormUpdate(values, client.name)
    }

    if (!client.ids.length)
        return( <PageTitle title="Specify a client ip on the url" /> )

    return (<Fragment>
            <PageTitle title={`Client: ${client.name}`}/>
            {processingClients && <Loading/>}

            <div className="col-12">
                <h5>IP: {clientId}</h5>
                <div>
                    <h5>Use Global Blocked Services</h5>
                    {client.use_global_blocked_services &&
                        <button className="btn btn-success" onClick={handleClick}>ON</button>}
                    {!client.use_global_blocked_services &&
                        <button className="btn btn-danger" onClick={handleClick}>OFF</button>}
                </div>
            </div>
        </Fragment>
    )

}

export default Client
