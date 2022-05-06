import styles from '../styles/Topbar.module.scss';
import PropTypes from 'prop-types';
import cx from 'classnames';
import PopUpMenu from './PopUpMenu';
import MenuItem from './MenuItem';
import { Link } from 'react-router-dom';
import Login from './Login';
import ShoppingCart from './ShoppingCart';

export default function Topbar(props) {
    var buttons = (
        <div className={styles.buttons}>
            <Link to="/create/account" className={cx(styles.button, styles.font)}>
                Register
            </Link>
            <Login onLogin={props.onLogin} />
        </div>
    );

    if (props.user?.type === 'SUPER') {
        buttons = (
            <div className={styles.buttons}>
                <PopUpMenu title={props.user.username} onLogout={props.onLogout} />
            </div>
        );
    }

    if (props.user?.type === 'ADMIN') {
        buttons = (
            <div className={styles.buttons}>
                <PopUpMenu title={`${props.user.first_name} ${props.user.last_name}`} onLogout={props.onLogout}>
                    <Link to="/status" style={{ textDecoration: 'none', color: 'white' }}>
                        <MenuItem text="Order status/\nhistory"></MenuItem>
                    </Link>
                </PopUpMenu>
            </div>
        );
    }

    if (props.user?.type === 'USER') {
        buttons = (
            <div className={styles.buttons}>
                <ShoppingCart cart={props.cart}></ShoppingCart>
                <PopUpMenu title={`${props.user.first_name} ${props.user.last_name}`} onLogout={props.onLogout}>
                    <Link to="/status" style={{ textDecoration: 'none', color: 'white' }}>
                        <MenuItem text="Order status/\nhistory"></MenuItem>
                    </Link>
                </PopUpMenu>
            </div>
        );
    }

    return (
        <div className={styles.topbar}>
            <Link to="/" className={cx(styles.logo, styles.logoFont)}>
                DR D. E. Livery
            </Link>
            <form action="search">
                <input name="search" className={styles.searchbar} placeholder="Search" />
            </form>
            {buttons}
        </div>
    );
}

Topbar.propTypes = {
    user: PropTypes.shape({
        user_id: PropTypes.number,
        type: PropTypes.oneOf(['ADMIN', 'USER', 'SUPER']),
        username: PropTypes.string,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        phone: PropTypes.string,
        email: PropTypes.string,
    }).isRequired,
    cart: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            count: PropTypes.number,
            price: PropTypes.number,
        })
    ).isRequired,
    onLogin: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
};
