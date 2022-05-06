import styles from '../styles/ShoppingCartView.module.scss';
import PropTypes from 'prop-types';
import CartItem from '../components/CartItem';
import { APIAddress } from '../config.json';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import cx from 'classnames';
import CheckBox from '../components/CheckBox';
import { useNavigate } from 'react-router';

const NewAddress = (props) => {
    return (
        <div style={{ marginBottom: '20px' }}>
            <form className={styles.newAddress} onChange={props.onChange}>
                <input name="address" placeholder="Street address" className={styles.span1to3} required />
                <input name="city" placeholder="City" required />
                <input name="zip" maxLength={5} placeholder="Postcode" required />
            </form>
            <CheckBox text="Save address" getValue={(val) => props.onChange(null, val, 'checkbox')} />
        </div>
    );
};

const ShoppingCart = (props) => {
    /** @type {{cart: import('../@types/App').App.Item[], restaurantId: number, token: string}} */
    let { cart, restaurantId, token, clearCart, removeItem } = props;
    const [error, setError] = useState(0);
    const [total, setTotal] = useState(0);
    const [restaurant, setRestaurant] = useState(null);
    const [userAddresses, setUserAddresses] = useState([]);
    const [userPaymentInfos, setUserPaymentInfos] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [newAddressState, setNewAddressState] = useState({ street_address: null, city: null, postcode: null, checked: false });
    const fields = {
        fname: useRef(null),
        lname: useRef(null),
        address: useRef(null),
        city: useRef(null),
        postcode: useRef(null),
        cardNum: useRef(null),
        expirationDate: useRef(null),
        cvc: useRef(null),
        save: useRef(false),
    };
    const nav = useNavigate();

    useEffect(() => {
        let _total = 0;
        cart.forEach((val) => {
            if (val.count <= 0) {
                removeItem(val.id);
                return;
            }
            _total += val.price * val.count;
        });
        _total = Math.round(_total * 100);
        setTotal(_total / 100);
    }, [cart]);

    const updateTotal = () => {
        let _total = 0;
        cart.forEach((val) => {
            if (val.count <= 0) {
                removeItem(val.id);
                return;
            }
            _total += val.price * val.count;
        });
        _total = Math.round(_total * 100);
        setTotal(_total / 100);
    };

    /** @type {EventListener} */
    const sendData = async (event) => {
        event.preventDefault();
        if (cart.length === 0) return false;
        if (selectedAddress === null) {
            setError(1);
            return false;
        }

        /** @type {import('axios').AxiosRequestConfig} */
        const conf = { headers: { authorization: `bearer ${token}` } };

        /**
         * Post new order for user.
         * @param {import('axios').AxiosRequestConfig} conf
         */
        const postOrder = async (conf) => {
            try {
                const res = await axios.post(APIAddress + 'orders', { restaurant_id: restaurantId, products: cart.map((val) => val.id) }, conf);
                console.log(res);
                nav('/');
            } catch (err) {
                console.error('Order request: ', err);
            }
        };

        if (paymentMethod === 'PayPal') postOrder(conf);
        else if (paymentMethod === 'CARD') {
            if (fields.save.current) {
                try {
                    /** @type {string} */
                    let expDate = fields.expirationDate.current.value;
                    expDate = expDate.split('/')[0] + '-01-' + expDate.split('/')[1].padStart(4, '20');

                    const data = {
                        street_address: fields.address.current.value,
                        city: fields.city.current.value,
                        postcode: fields.postcode.current.value,
                        first_name: fields.fname.current.value,
                        last_name: fields.lname.current.value,
                        type: 'CARD',
                        card_num: fields.cardNum.current.value,
                        cvv: fields.cvc.current.value,
                        expiration_date: expDate,
                    };
                    const res = await axios.post(APIAddress + 'users/@me/payment-info', data, conf);
                    console.log(res);
                    postOrder(conf);
                } catch (err) {
                    console.error(err);
                }
            } else postOrder(conf);
        } else if (parseInt(paymentMethod) == paymentMethod) {
            if (selectedAddress === 'ADD') {
                if (newAddressState.checked) {
                    try {
                        const data = newAddressState;
                        delete data.checked;
                        const res = await axios.post(APIAddress + 'users/@me/address', data, conf);
                        console.log(res);
                        postOrder(conf);
                    } catch (err) {
                        console.error(err);
                    }
                } else postOrder(conf);
            } else postOrder(conf);
        }
    };

    /** @type {EventListener} */
    const newAddressChanged = (event, checkedState, cehckbox) => {
        let newState = { ...newAddressState };

        switch (event?.target.name || cehckbox) {
            case 'checkbox':
                newState.checked = checkedState;
                break;
            case 'address':
                newState.street_address = event.target.value;
                break;
            case 'city':
                newState.city = event.target.value;
                break;
            case 'zip':
                newState.postcode = event.target.value;
                break;
            default:
                console.error('Input type not found');
                break;
        }

        setNewAddressState(newState);
    };

    useEffect(async () => {
        try {
            const res = await axios.get(APIAddress + 'restaurant');
            setRestaurant(res.data.find((val) => val.restaurant_id === restaurantId));
        } catch (err) {
            if (err) console.error(err);
        }
    }, [restaurantId]);

    useEffect(async () => {
        try {
            /** @type {import('axios').AxiosRequestConfig} */
            const conf = { headers: { authorization: `bearer ${token}` } };
            const addressRes = await axios.get(APIAddress + 'users/@me/address', conf);
            const paymentRes = await axios.get(APIAddress + 'users/@me/payment-info', conf);
            setUserAddresses(addressRes.data);
            setUserPaymentInfos(paymentRes.data);
        } catch (err) {
            if (err.response) console.error(err.response);
            else if (err) console.error(err);
        }
    }, [token]);

    const GridHeader = (props) => {
        return (
            <>
                <div className={props.className}>Product</div>
                <div className={props.className}>Count</div>
                <div className={props.className}>Price</div>
            </>
        );
    };

    let errMessage = null;
    if (error) {
        setTimeout(() => setError(0), 15000);
        if (error === 1) errMessage = <div className={styles.error}>Please select an address</div>;
    }

    return (
        <div className={styles.content}>
            <div className={styles.title}>Shopping cart</div>
            <div className={styles.cart}>
                <div className={styles.title}>Restaurant: {restaurant?.name}</div>
                <div className={styles.productList}>
                    <GridHeader className={styles.header} />
                    {cart.map((item) => {
                        return <CartItem key={item.id} item={item} editable={true} itemEdited={updateTotal} />;
                    })}
                </div>
                <div className={styles.total}>Total: {total}€</div>
                {errMessage}
                <select className={styles.deliveryAddress} defaultValue="NULL" name="addressSelection" onChange={(e) => setSelectedAddress(e.target.value)}>
                    <option value="NULL" hidden disabled>
                        Select delivery address
                    </option>
                    {userAddresses.map((val) => {
                        return (
                            <option value={val.address_id} key={val.address_id}>
                                {val.street_address}, {val.postcode}, {val.city}
                            </option>
                        );
                    })}
                    <option value="ADD">Add address</option>
                </select>

                {selectedAddress === 'ADD' ? <NewAddress onChange={newAddressChanged} /> : null}

                <button onClick={clearCart} className={styles.button}>
                    Delete order
                </button>
            </div>

            <div className={styles.paymentInfo}>
                <select className={styles.paymentSelection} defaultValue="NULL" name="paymentSelection" onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option value="NULL" hidden disabled>
                        Select payment method
                    </option>
                    <option value="CARD">Debit card</option>
                    <option value="PayPal">PayPal</option>
                    {userPaymentInfos.map((val) => {
                        return (
                            <option value={val.payment_information_id} key={val.payment_information_id}>
                                Card {val.card_num.substr(val.card_num.length - 4, 4).padStart(val.card_num.length, '*')}
                            </option>
                        );
                    })}
                </select>

                {paymentMethod === 'CARD' ? (
                    <form onSubmit={sendData} className={styles.infoGrid}>
                        <div className={styles.rows1to3}>
                            <input ref={fields.fname} name="firstName" placeholder="First name" autoComplete="given-name" required />
                            <input ref={fields.lname} name="lastName" placeholder="Last name" autoComplete="family-name" required />
                        </div>
                        <input ref={fields.address} name="address" placeholder="Street address" className={styles.span2to4} required />
                        <input ref={fields.city} name="city" placeholder="City" required />
                        <input ref={fields.postcode} name="zip" maxLength={5} placeholder="Postcode" required />
                        <input
                            ref={fields.cardNum}
                            minLength={16}
                            maxLength={16}
                            pattern="\d+"
                            name="cardNumber"
                            placeholder="Card number"
                            className={styles.span1to3}
                            required
                        />
                        <div className={styles.inline}>
                            <input
                                ref={fields.expirationDate}
                                maxLength={5}
                                pattern="\d{2}/\d{2}"
                                name="expirationDate"
                                placeholder="xx/xx"
                                className={styles.inlineItem}
                                required
                            />
                            <input
                                ref={fields.cvc}
                                type="password"
                                maxLength={3}
                                pattern="\d{3}"
                                name="cc-csc"
                                placeholder="cvc"
                                className={styles.inlineItem2}
                                required
                            />
                        </div>
                        <button className={styles.button}>Confirm</button>
                        <div className={cx(styles.span2to4, styles.alignCenter)}>
                            <CheckBox text="Save billing information" getValue={(val) => (fields.save.current = val)} />
                        </div>
                    </form>
                ) : null}

                {paymentMethod === 'PayPal' ? (
                    <button onClick={sendData} className={styles.button}>
                        Continue with PayPal
                    </button>
                ) : null}

                {parseInt(paymentMethod) == paymentMethod ? (
                    <button onClick={sendData} className={styles.button}>
                        Confirm
                    </button>
                ) : null}
            </div>
        </div>
    );
};

ShoppingCart.propTypes = {
    cart: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            count: PropTypes.number,
            price: PropTypes.number,
        })
    ).isRequired,
    user: PropTypes.shape({
        user_id: PropTypes.number,
        type: PropTypes.oneOf(['ADMIN', 'USER', 'SUPER']),
        username: PropTypes.string,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        phone: PropTypes.string,
        email: PropTypes.string,
    }).isRequired,
    restaurantId: PropTypes.number,
    token: PropTypes.string.isRequired,
    clearCart: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,
};

ShoppingCart.defaultProps = {
    clearCart: () => {
        console.error('Func clearCart is not defined');
    },
    removeItem: () => {
        console.error('Func removeItem is not defined');
    },
};

export default ShoppingCart;
