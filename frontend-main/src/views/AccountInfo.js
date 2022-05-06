import react from 'react';
import styles from '../styles/AccountInfo.module.scss';
import cx from 'classnames';
import { Component } from 'react';
import { APIAddress } from '../config.json';
import axios from 'axios';
import { Link } from 'react-router-dom';

class AccountInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountData: {
                userName: '',
                firstName: '',
                lastName: '',
                address: {
                    
                },
                phoneNumber: '',
                email: '',
                password: ''
            }
        };

        this.onChange = this.onChange.bind(this);
    }
    
    componentDidMount() {
        axios.get(APIAddress + 'users/@me', {
                    headers: { authorization: 'bearer ' + this.props.token },
                }).then((res) => {
                    this.setState({
                        userName: res.data.username,
                        firstName: res.data.first_name,
                        lastName: res.data.last_name,
                        phoneNumber: res.data.phone,
                        email: res.data.email
                    })
                });

        axios.get(APIAddress + 'users/@me/address', {
            headers: { authorization: 'bearer ' + this.props.token },
        }).then((res) => {
            console.log(res);
            this.setState({
                ...this.state.address,
                street_address: res.data[0].street_address,
                city: res.data[0].city,
                postcode: res.data[0].postcode
            })
        });
    }

    onChange(event) {
        let accountData = { ...this.state.accountData };

        switch (event.target.name) {
            case 'firstName':
                accountData.firstName = event.target.value;
                break;
            case 'lastName':
                accountData.lastName = event.target.value;
                break;
            case 'phoneNumber':
                accountData.phoneNumber = event.target.value;
                break;
            case 'email':
                accountData.email = event.target.value;
                break;
        }

        this.setState({ accountData });
    }

    render() {
        return (
            <>
                <div className = {cx(styles.infoField, styles.font)}>
                    <div>
                        <div className = { styles.title }>Account Information</div>
                        <div className = { styles.infoBoxes }>
                            <input 
                                className = { styles.inputs } 
                                name='userName' 
                                placeholder='Username' 
                                type='text' 
                                onChange={this.onChange}
                                defaultValue={this.state.userName}
                                readOnly
                            />
                            <input 
                                className = { styles.inputs } 
                                name='firstName' 
                                placeholder='First name' 
                                type='text' 
                                onChange={this.onChange}
                                defaultValue={this.state.firstName}
                                readOnly
                            />
                            <input 
                                className = { styles.inputs } 
                                name='lastName' 
                                placeholder='Last name' 
                                type='text' 
                                onChange={this.onChange}
                                defaultValue={this.state.lastName}
                                readOnly
                            />
                            <input 
                                className = { styles.inputs } 
                                name='street' 
                                placeholder='Street' 
                                type='text' 
                                onChange={this.onChange}
                                defaultValue={this.state.street_address}
                                readOnly
                            />
                            <input 
                                className = { styles.inputs } 
                                name='city' 
                                placeholder='City' 
                                type='text' 
                                onChange={this.onChange}
                                defaultValue={this.state.city}
                                readOnly
                            />
                            <input 
                                className = { styles.inputs } 
                                name='postcode' 
                                placeholder='Postcode' 
                                type='text' 
                                onChange={this.onChange}
                                defaultValue={this.state.postcode}
                                readOnly
                            />
                            <input 
                                className = { styles.inputs } 
                                name='phoneNumber' 
                                placeholder='Phone number' 
                                type='text' 
                                onChange={this.onChange}
                                defaultValue={this.state.phoneNumber}
                                readOnly
                            />
                            <input 
                                className = { styles.inputs } 
                                name='email' 
                                placeholder='Email' 
                                type='email' 
                                onChange={this.onChange}
                                defaultValue={this.state.email}
                                readOnly
                            />
                        </div>
                        <div className = { styles.buttons }>
                            <Link to="/" className = { styles.cancelButton }>Go back to main page</Link>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default AccountInfo;