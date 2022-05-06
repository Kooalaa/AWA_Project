import styles from '../styles/Login.module.scss';
import { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import axios from 'axios';
import { APIAddress } from '../config.json';

export default class Login extends Component {
    static propTypes = {
        onLogin: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            shown: false,
            username: createRef(null),
            password: createRef(null),
        };

        this.onClick = this.onClick.bind(this);
        this.onLogin = this.onLogin.bind(this);
    }

    closePopUpListenner = (event) => {
        if (!event.target.closest('[data-login]')) {
            this.onClick();
        }
    };

    onClick() {
        if (!this.state.shown) {
            this.setState({ shown: !this.state.shown });
            document.addEventListener('click', this.closePopUpListenner);
        } else {
            document.removeEventListener('click', this.closePopUpListenner);
            this.setState({ shown: !this.state.shown });
        }
    }

    /**
     * @param {Event} event
     */
    onLogin(event) {
        event.preventDefault();
        event.stopPropagation();

        if (this.state.err) this.setErrorMessage(null);

        /** @type {import('axios').AxiosRequestConfig} */
        const conf = {
            auth: {
                username: this.state.username.current.value,
                password: this.state.password.current.value,
            },
            timeout: 10000,
        };
        const request = axios.post(APIAddress + 'login', null, conf);

        if (typeof this.props.onLogin === 'function') this.props.onLogin(request);
        request.catch((err) => {
            if (err.response) {
                if (err.response.data === 'Username or password incorrect') this.setErrorMessage(err.response.data);
            } else console.error(err);
        });
        request.then(() => this.onClick());

        return true;
    }

    setErrorMessage = (msg) => {
        this.setState({ err: msg });
    };

    componentWillUnmount() {
        document.removeEventListener('click', this.closePopUpListenner);
    }

    render() {
        return (
            <>
                <button onClick={this.onClick} className={cx(styles.button, styles.font)} data-login>
                    Login
                </button>
                <form onSubmit={this.onLogin} className={cx(styles.menu, styles.font, this.state.shown ? styles.on : undefined)} data-login>
                    <div className={cx(styles.title, styles.menuItem)}>Login</div>

                    {this.state.err ? <div className={styles.error}>{this.state.err}</div> : null}

                    <input ref={this.state.username} placeholder="Username" className={styles.menuItem}></input>
                    <input ref={this.state.password} type="password" placeholder="Password" className={styles.menuItem}></input>

                    <div className={styles.menuSettings}>
                        <button className={cx(styles.menuItem, styles.button)}>Login</button>
                    </div>
                </form>
            </>
        );
    }
}
