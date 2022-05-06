import CreateRestaurant from '../components/CreateRestaurant';
import ManagerRestaurantList from '../components/ManagerRestaurantList';
import { Component } from 'react';
import axios from 'axios';
import { APIAddress } from '../config.json';

class ManagerMainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            managerRestaurants: [],
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.user.user_id !== this.props.user.user_id) {
            axios.get(APIAddress + 'restaurant').then((res) => {
                let managerRestaurants = res.data.filter((val) => val.user_id === this.props.user.user_id);
                console.log(this.props.user);
                this.setState({
                    managerRestaurants,
                    restaurants: res.data,
                });
            });
        }
    }

    componentDidMount() {
        axios.get(APIAddress + 'restaurant').then((res) => {
            let managerRestaurants = res.data.filter((val) => val.user_id === this.props.user.user_id);
            console.log(this.props.user);
            this.setState({
                managerRestaurants,
                restaurants: res.data,
            });
        });
    }

    render() {
        return (
            <div>
                <CreateRestaurant />
                <ManagerRestaurantList managerRestaurants={this.state.managerRestaurants} />
            </div>
        );
    }
}
export default ManagerMainPage;
