import styles from '../styles/Order.module.scss';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { APIAddress } from '../config.json';
import { capitalize } from '../utility/string';

function Timer({ at, status, confirm, user, setTime }) {
    let [seconds, setSeconds] = useState(Math.round((at - Date.now()) / 1000) % 60);
    let [minutes, setMinutes] = useState(Math.round((at - Date.now()) / 1000 / 60) % 60);

    useEffect(() => {
        console.log('Seconds: ', Math.round((at - Date.now() / 1000)) % 60);
        console.log('Minutes: ', Math.round((at - Date.now() / 1000 / 60)) % 60);
        setSeconds(Math.round((at - Date.now()) / 1000) % 60);
        setMinutes(Math.round((at - Date.now()) / 1000 / 60) % 60);
    }, [at]);

    useEffect(() => {
        let secondsTimer;
        if (seconds > 0) {
            secondsTimer = setInterval(() => {
                setSeconds(seconds - 1);
            }, 1000);
        } else if (minutes > 0) {
            secondsTimer = setInterval(() => {
                setMinutes(minutes - 1);
                setSeconds(59);
            }, 1000);
        }
        return () => {
            clearInterval(secondsTimer);
        };
    });

    if (seconds > 0 || minutes > 0) {
        return (
            <span>
                {minutes}:{seconds}
            </span>
        );
    } else if (seconds <= 0 && minutes <= 0 && status !== 'RECEIVED' && user.type === 'USER') {
        return (
            <button className={styles.confirmButton} onClick={confirm}>
                Confirm
            </button>
        );
    } else if (seconds <= 0 && minutes <= 0 && status !== 'RECEIVED' && user.type === 'ADMIN') {
        return (
            <button className={styles.confirmButton} onClick={setTime}>
                Set time
            </button>
        );
    } else return null;
}

function Status({ order, user, token }) {
    const statusMap = {
        'Order recieved': 1,
        Preparing: 2,
        'Ready for delivery': 3,
        Delivering: 4,
        Delivered: 5,
        Received: 6,
    };

    const initialStatus = order.status ? capitalize(order.status.toLowerCase()) : null;

    const [status, setStatus] = useState(initialStatus);
    let [count, setCount] = useState(statusMap[initialStatus] ?? 0);

    let changeStatus = () => {
        let _status = '';
        switch (count) {
            case 0:
                _status = 'Order recieved';
                setStatus(_status);
                break;
            case 1:
                _status = 'Preparing';
                setStatus(_status);
                break;
            case 2:
                _status = 'Ready for delivery';
                setStatus(_status);
                break;
            case 3:
                _status = 'Delivering';
                setStatus(_status);
                break;
            case 4:
                _status = 'Delivered';
                setStatus(_status);
                break;
            case 5:
                _status = '';
                setStatus('');
                break;
        }

        if (count === 5) {
            setCount(0);
        } else setCount(count + 1);

        /** @type {import('axios').AxiosRequestConfig} */
        let conf = { headers: { authorization: `bearer ${token}` } };
        let data = {
            orderId: order.order_id,
            status: _status,
        };
        axios.patch(APIAddress + 'orders/update', data, conf);
    };

    return (
        <>
            <div>Status: {status}</div>
            {user.type === 'ADMIN' && count !== 6 ? (
                <button className={styles.statusButton} onClick={changeStatus}>
                    Change status
                </button>
            ) : null}
        </>
    );
}

export default function Order(props) {
    const setReceived = async () => {
        /** @type {import('axios').AxiosRequestConfig} */
        let conf = { headers: { authorization: `bearer ${props.token}` } };
        await axios.post(APIAddress + `orders/received/${props.order.order_id}`, {}, conf);
        props.update();
    };

    const setTime = () => {
        /** @type {import('axios').AxiosRequestConfig} */
        let conf = { headers: { authorization: `bearer ${props.token}` } };
        let data = {
            orderId: props.order.order_id,
            ready_time: Date.now() + 10 * 60 * 1000 + 2000,
        };

        axios.patch(APIAddress + 'orders/update', data, conf).then(() => {
            props.update();
        });
    };

    var statusButton = (
        <div name="status" className={styles.orderStatus}>
            <Status user={props.user} order={props.order} token={props.token} />
        </div>
    );

    return (
        <div className={styles.orderStatusContent}>
            <div>Order ID: {props.order.order_id}</div>
            {statusButton}
            <div name="estTimeOfDelivery">
                Estimated Time of Delivery:{' '}
                <Timer at={props.order.ready_time} status={props.order.status} user={props.user} setTime={setTime} confirm={setReceived} />
            </div>
        </div>
    );
}
