import {
    useEffect,
    useState
} from "react";

import "../css/liveStatus.css";

import socket from "../services/socketService.js";


function LiveStatus() {

    const [
        connected,
        setConnected
    ] = useState(
        socket.connected
    );


    useEffect(() => {

        const handleConnect =
            () => {

                setConnected(true);

            };


        const handleDisconnect =
            () => {

                setConnected(false);

            };


        socket.on(
            "connect",
            handleConnect
        );


        socket.on(
            "disconnect",
            handleDisconnect
        );


        return () => {

            socket.off(
                "connect",
                handleConnect
            );


            socket.off(
                "disconnect",
                handleDisconnect
            );

        };

    }, []);


    return (

        <div
            className={
                connected
                    ? "live-status online"
                    : "live-status offline"
            }
        >

            <span
                className="live-status-dot"
            />


            {
                connected
                    ? "LIVE NETWORK"
                    : "RECONNECTING"
            }

        </div>

    );

}


export default LiveStatus;