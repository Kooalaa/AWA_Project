import styles from '../styles/OrderStatusHistoryView.module.scss';
import cx from 'classnames';
import Order from '../components/Order';
import { Component } from 'react';
import axios from 'axios';
import { APIAddress } from '../config.json';
import { HiOutlineArrowRight } from 'react-icons/hi';

class OrderStatusHistoryView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderStatusHistoryView: {
                orderId: '',
                status: '',
                estTimeOfDelivery: '',
                managerPhoneNumber: '',
                orderHistory: {},
            },
            orders: [],
        };

        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        let orderStatusHistoryView = { ...this.state.orderStatusHistoryView };

        switch (event.target.name) {
            case 'status':
                orderStatusHistoryView.status = event.target.value;
                break;
            case 'estTimeOfDelivery':
                orderStatusHistoryView.estTimeOfDelivery = event.target.value;
                break;
            case 'managerPhoneNumber':
                orderStatusHistoryView.managerPhoneNumber = event.target.value;
                break;
            case 'orderHistory':
                orderStatusHistoryView.orderHistory = event.target.value;
                break;
        }

        this.setState({ orderStatusHistoryView });
        // console.log(this.state);
    }

    componentDidMount() {
        this.updateOrder();
    }

    updateOrder = () => {
        const conf = { headers: { authorization: 'bearer ' + this.props.token } };

        if (this.props.user.type === 'USER') {
            axios.get(APIAddress + 'orders/@me', conf).then((res) => {
                console.log(res.data);
                this.setState({
                    orders: res.data,
                });
            });
        } else {
            axios.get(APIAddress + 'restaurant').then((res) => {
                const orderLists = [];
                for (const item of res.data) {
                    if (item.user_id === this.props.user.user_id) {
                        orderLists.push(axios.get(APIAddress + `orders/restaurants/${item.restaurant_id}`, conf));
                    }
                }
                axios.all(orderLists).then((responses) => {
                    let orders = [];
                    for (const res of responses) {
                        orders = orders.concat(res.data);
                    }
                    console.log(orders);
                    this.setState({
                        orders,
                    });
                });
            });
        }
    };

    render() {
        var orderStatus = (
            <div className={cx(styles.orderStatusContent, styles.fonts, styles.font)}>
                <div className={styles.orderStatusTitle}>Order Status</div>
                {this.state.orders.map((val) => {
                    if (val.status?.toLowerCase() !== 'received') {
                        return <Order key={val.order_id} user={this.props.user} order={val} token={this.props.token} update={this.updateOrder} />;
                    }
                })}
            </div>
        );

        var picture = (
            <div>
                <HiOutlineArrowRight size={150} />
            </div>
        );

        var historyView = (
            <div className={cx(styles.historyViewContent, styles.fonts, styles.font)}>
                <div>Order History</div>
                {this.state.orders.map((val) => {
                    if (val.status?.toLowerCase() === 'received') {
                        return <Order key={val.order_id} user={this.props.user} order={val} token={this.props.token} update={this.updateOrder} />;
                    }
                })}
            </div>
        );

        return (
            <div className={styles.mainDiv}>
                <div className={styles.orderStatusStyle}> {orderStatus} </div>
                <div className={styles.pictureStyle}> {picture} </div>
                <div className={styles.historyViewStyle}> {historyView} </div>
            </div>
        );
    }
}

export default OrderStatusHistoryView;
