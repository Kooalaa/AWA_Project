import { Component } from 'react';
import SpecialOffers from '../components/SpecialOffers';
import RestaurantList from '../components/RestaurantList';
import { APIAddress } from '../config.json';
import axios from 'axios';
import { capitalize } from '../utility/string';
import UsercityList from '../components/UsercityList';

const MainPageContent = (props) => {
    let content = Object.entries(props.cities).map(([city, restaurants], index) => {
        return <RestaurantList key={index} city={capitalize(city)} restaurants={restaurants} />;
    });
    if (props.token !== '') content = <UsercityList userCity={props.cities[props.userCity]} city={capitalize(props.userCity)} />;
    return content;
};

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cities: {},
            specialOffers: [],
            userCity: '',
        };
    }

    componentDidMount() {
        axios.get(APIAddress + 'restaurant').then((res) => {
            var oulu = res.data.filter((val) => val.address.split(', ')[2]?.toLowerCase() === 'oulu');
            var turku = res.data.filter((val) => val.address.split(', ')[2]?.toLowerCase() === 'turku');
            var tampere = res.data.filter((val) => val.address.split(', ')[2]?.toLowerCase() === 'tampere');
            let cities = {
                oulu,
                turku,
                tampere,
            };
            this.setState({
                cities,
                restaurants: res.data,
            });

            axios
                .get(APIAddress + 'users/@me/address', {
                    headers: { authorization: 'bearer ' + this.props.token },
                })
                .then((res) => {
                    let userCity = '';
                    for (let key in cities) {
                        if (key === res.data[0].city.toLowerCase()) {
                            userCity = key;
                            break;
                        }
                    }
                    this.setState({
                        userCity,
                    });
                });
        });

        axios.get(APIAddress + 'products/special-offers').then((res) => {
            var requests = [];
            requests.push(axios.get(APIAddress + 'products'));
            if (!this.state.restaurants) requests.push(axios.get(APIAddress + 'restaurant'));
            Promise.all(requests).then((resArray) => {
                if (resArray.length === 2) {
                    this.setState({
                        specialOffers: res.data,
                        products: resArray[0].data,
                        restaurants: resArray[1].data,
                    });
                } else {
                    this.setState({
                        specialOffers: res.data,
                        products: resArray[0].data,
                    });
                }
            });
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.token !== this.props.token) {
            if (this.props.token !== '') {
                axios
                    .get(APIAddress + 'users/@me/address', {
                        headers: { authorization: 'bearer ' + this.props.token },
                    })
                    .then((res) => {
                        let userCity = '';
                        for (let key in this.state.cities) {
                            if (key === res.data[0].city.toLowerCase()) {
                                userCity = key;
                                break;
                            }
                        }
                        this.setState({
                            userCity,
                        });
                    });
            }
        }
    }

    render() {
        console.log(APIAddress);
        return (
            <div>
                <SpecialOffers products={this.state.products} restaurants={this.state.restaurants} specialOffers={this.state.specialOffers} />
                <MainPageContent cities={this.state.cities} userCity={this.state.userCity} token={this.props.token} />
            </div>
        );
    }
}

export default MainPage;
