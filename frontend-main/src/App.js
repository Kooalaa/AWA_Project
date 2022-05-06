import './App.scss';
import { Component } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { APIAddress } from './config.json';
import axios from 'axios';
import Topbar from './components/Topbar';
import CreateAccount from './views/CreateAccount';
import RestaurantView from './views/RestaurantView';
import Redirect from './components/Redirect';
import MainPage from './views/MainPage';
import Footer from './components/Footer';
import CreateRestaurant from './views/CreateRestaurant';
import ManagerMainPage from './views/ManagerMainPage';
import RedirectManager from './components/RedirectManager';
import ShoppingCart from './views/ShoppingCart';
import OrderStatusHistoryView from './views/OrderStatusHistoryView';
import Search from './views/Search';
import AccountInfo from './views/AccountInfo';

class InitialState {
    constructor() {
        this.loginToken = '';
        this.user = {
            user_id: -1,
            username: '',
            type: undefined,
            first_name: '',
            last_name: '',
            phone: '',
            email: '',
        };
        this.orderRestaurantId = null;
        this.shoppingCart = [];
    }
}

class Item {
    constructor(id, name, price, count = 1) {
        this.id = id;
        this.name = name;
        this.count = count;
        this.price = price;
        this.updateCount = (val) => (this.count = val);
    }
}

class App extends Component {
    constructor(props) {
        super(props);

        this.state = new InitialState();
        this.state.loginToken = localStorage.getItem('token') ?? this.state.loginToken;
        this.state.user.type = localStorage.getItem('userType') ?? this.state.user.type;

        this.onLogin = this.onLogin.bind(this);
        this.onLogout = this.onLogout.bind(this);
        this.addToCart = this.addToCart.bind(this);
    }

    /**
     * Process login request and save credentials to state
     * and local storage if successful.
     * @param {Promise<import('axios').AxiosResponse<any, any>} loginRequest
     * @memberof App
     */
    onLogin(loginRequest) {
        loginRequest.then(
            (res) => {
                this.setState({ loginToken: res.data.token }, () => {
                    localStorage.setItem('token', this.state.loginToken);
                });

                /** @type {import('axios').AxiosRequestConfig} */
                const conf = { headers: { Authorization: `bearer ${res.data.token}` } };

                axios.get(APIAddress + 'users/@me', conf).then(
                    (res) => {
                        this.setState(
                            {
                                user: res.data,
                            },
                            () => {
                                localStorage.setItem('userType', this.state.user.type);
                            }
                        );
                    },
                    () => {
                        this.setState(new InitialState());
                        localStorage.removeItem('token');
                    }
                );
            },
            (err) => {
                if (err.response) {
                    console.log(err.response.data);
                    console.log(err.response.status);
                } else if (err.request) console.log(err.request);
                else console.log('error', err.message);
            }
        );
    }

    /**
     * Remove user credentials from state and local storage.
     * @memberof App
     */
    onLogout() {
        this.setState(new InitialState());
        localStorage.clear();
    }

    /**
     * Adds new item to shopping cart or increases item count if already in cart.
     * @param {number} id product_id of teh item
     * @param {string} name titel/name of the item
     * @param {number} price base price of the item
     */
    addToCart(orderRestaurantId, id, name, price) {
        if (this.state.orderRestaurantId !== orderRestaurantId && this.state.orderRestaurantId !== null) return;
        let cart = this.state.shoppingCart;

        let itemInList = cart.findIndex((val) => val.id === id);
        if (itemInList >= 0) {
            cart[itemInList].count++;
        } else {
            cart.push(new Item(id, name, price));
        }

        this.setState({ orderRestaurantId, ShoppingCart: cart });
    }

    /**
     * Get user info if user was logged in earlier.
     * @memberof App
     */
    componentDidMount() {
        if (this.state.loginToken !== '') {
            /** @type {import('axios').AxiosRequestConfig} */
            const conf = { headers: { Authorization: `bearer ${this.state.loginToken}` } };

            axios.get(APIAddress + 'users/@me', conf).then(
                (res) => {
                    this.setState({
                        user: res.data,
                    });
                },
                (err) => {
                    if (err.response) {
                        console.log(err.response.data);
                        console.log(err.response.status);
                    } else if (err.request) console.log(err.request);
                    else console.log(err);

                    this.setState(new InitialState());
                    localStorage.clear();
                }
            );
        }
    }

    render() {
        return (
            <BrowserRouter>
                <Redirect onChange={this.state.user} replace={true} />
                <RedirectManager onChange={this.state.user} replace={true} />
                <Topbar onLogin={this.onLogin} onLogout={this.onLogout} user={this.state.user} cart={this.state.shoppingCart} />
                <Routes>
                    <Route path="/" element={<MainPage user={this.state.user} token={this.state.loginToken} />} />
                    <Route path="/create/account" element={<CreateAccount />} />
                    <Route path="/create/restaurant" element={<CreateRestaurant token={this.state.loginToken} />} />
                    <Route path="/status" element={<OrderStatusHistoryView token={this.state.loginToken} user={this.state.user} />} />
                    <Route path="/account" element={<AccountInfo token={this.state.loginToken}/>} />
                    <Route
                        path="/cart"
                        element={
                            <ShoppingCart
                                cart={this.state.shoppingCart}
                                user={this.state.user}
                                restaurantId={this.state.orderRestaurantId}
                                token={this.state.loginToken}
                                clearCart={() => this.setState({ shoppingCart: [], orderRestaurantId: null })}
                                removeItem={(id) => {
                                    let shoppingCart = this.state.shoppingCart;
                                    let index = shoppingCart.findIndex((val) => val.id === id);
                                    if (index >= 0) shoppingCart.splice(index, 1);
                                    this.setState({ shoppingCart });
                                }}
                            />
                        }
                    />
                    <Route path="/restaurants/:id" element={<RestaurantView addToCart={this.addToCart}/>} />
                    <Route path="/managerpage" element={<ManagerMainPage user={this.state.user} token={this.state.loginToken} />} />
                    <Route path="/search" element={<Search />} />
                </Routes>
                <Footer />
            </BrowserRouter>
        );
    }
}

export default App;
