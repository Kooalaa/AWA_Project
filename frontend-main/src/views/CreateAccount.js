import styles from '../styles/CreateAccount.module.scss';
import cx from 'classnames';
import React from 'react';
import axios from 'axios';
import { APIAddress } from '../config.json';
import { Link } from 'react-router-dom';

export default function CreateAccount() {
    const [Password, setPassword] = React.useState();

    const [error, setError] = React.useState();

    const [showInputs, setShowInputs] = React.useState(true);

    const [accountCreated, setAccountCreated] = React.useState(false);

    const [account, setAccount] = React.useState({
        username: '',
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        password: '',
        type: '',
    });

    const [address, setAddress] = React.useState({
        street_address: '',
        city: '',
        postcode: '',
    });

    const handleInputs = (event) => {
        const newAccount = account;
        const newAddress = address;

        switch (event.target.name) {
            case 'fName':
                newAccount.first_name = event.target.value;
                break;

            case 'lName':
                newAccount.last_name = event.target.value;
                break;

            case 'pNumb':
                newAccount.phone = event.target.value;
                break;

            case 'eAdrs':
                newAccount.email = event.target.value;
                break;

            case 'sAdrs':
                newAddress.street_address = event.target.value;
                break;

            case 'city':
                newAddress.city = event.target.value;
                break;

            case 'postcode':
                newAddress.postcode = event.target.value;
                break;

            case 'user':
                newAccount.username = event.target.value;
                break;

            case 'password':
                newAccount.password = event.target.value;
                break;

            case 'repeatPassword':
                setPassword(event.target.value);
                break;

            case 'accountType':
                newAccount.type = event.target.value;
                break;
        }
        setAddress(newAddress);
        setAccount(newAccount);
    };

    const onSubmit = (event) => {
        event.preventDefault();
        setError('');
        if (Password === account.password) {
            console.log(account);
            console.log(address);
            axios.post(APIAddress + 'users', account).then(
                (res) => {
                    const config = { headers: { Authorization: 'bearer ' + res.data.token } };

                    axios.post(APIAddress + 'users/@me/address', address, config).then((res) => {
                        if (res.data) {
                            setShowInputs(false);
                            setAccountCreated(true);
                        }
                    });
                },
                (error) => {
                    if (error.response) {
                        if (error.response.data.includes('user_username_key')) {
                            setError('Username is taken');
                        }
                        if (error.response.data.includes('user_phone_key')) {
                            setError('Phone number is taken');
                        }
                        console.log(error.response);
                    }
                }
            );
        } else {
            setError('Passwords dont match');
        }
        return true;
    };

    const accountType = (
        <div className={styles.userType}>
            <label className={styles.font}> Manager </label>
            <input type="radio" name="accountType" onChange={handleInputs} value="ADMIN"></input>
            <label className={styles.font}> Customer </label>
            <input type="radio" name="accountType" onChange={handleInputs} value="USER"></input>
        </div>
    );

    return (
        <div className={styles.createAccount}>
            <div className={cx(styles.logo, styles.font)}>Account Creation</div>
            {accountCreated && (
                <div className={styles.created}>
                    <p> Account was succesfully created</p>
                    <Link to="/" className={styles.link}>
                        Mainpage
                    </Link>
                </div>
            )}
            {showInputs && (
                <form onSubmit={onSubmit}>
                    <div className={styles.textFields}>
                        <input type="text" required name="fName" placeholder="First name" onChange={handleInputs} />
                        <input type="text" required name="lName" placeholder="Last name" onChange={handleInputs} />
                        <input type="text" required pattern="[A-ö0-9\\s-]+" name="sAdrs" placeholder="Address" onChange={handleInputs} />
                        <input type="text" required name="city" placeholder="City" onChange={handleInputs} />
                        <input type="text" required maxLength={5} minLength={5} name="postcode" placeholder="Postcode" onChange={handleInputs} />
                        <input type="text" required maxLength={15} name="pNumb" placeholder="Phone number" onChange={handleInputs} />
                        <input type="text" required name="eAdrs" placeholder="Email address" onChange={handleInputs} />
                        <input type="text" required name="user" placeholder="Username" onChange={handleInputs} />
                        <input type="password" required name="password" placeholder="Password" onChange={handleInputs} />
                        <input type="password" required name="repeatPassword" placeholder="Repeat password" onChange={handleInputs} />
                    </div>

                    {accountType}

                    <button className={cx(styles.button, styles.font)} type="submit">
                        Create Account
                    </button>
                </form>
            )}
            <div className={styles.errors}>{error}</div>
        </div>
    );
}
