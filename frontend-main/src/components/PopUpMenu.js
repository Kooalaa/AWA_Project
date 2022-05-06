import { Component } from 'react';
import styles from '../styles/PopUpMenu.module.scss';
import { HiOutlineMenu } from 'react-icons/hi';
import PropTypes from 'prop-types';
import cx from 'classnames';
import MenuItem from './MenuItem';
import { Link } from 'react-router-dom';

export default class PopUpMenu extends Component {
    constructor(props) {
        super(props);

        this.state = { shown: false };

        this.onMenuClicked = this.onMenuClicked.bind(this);
    }

    closeMenuListenner = (event) => {
        if (!event.target.closest('[data-menu]')) {
            this.onMenuClicked();
        }
    };

    onMenuClicked() {
        if (!this.state.shown) {
            this.setState({ shown: !this.state.shown });
            document.addEventListener('click', this.closeMenuListenner);
        } else {
            document.removeEventListener('click', this.closeMenuListenner);
            this.setState({ shown: !this.state.shown });
        }
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.closeMenuListenner);
    }

    render() {
        return (
            <>
                <HiOutlineMenu className={styles.menuIcon} onClick={this.onMenuClicked} data-menu></HiOutlineMenu>
                <div className={cx(styles.menu, styles.font, this.state.shown ? styles.on : undefined)} data-menu>
                    <div className={cx(styles.title, styles.menuItem)}>{this.props.title}</div>
                    {this.props.children}
                    <div className={styles.menuSettings}>
                        <Link to="/account" style={{textDecoration: 'none', color: 'white'}}>
                            <MenuItem text="Account info"></MenuItem>
                        </Link>
                        <MenuItem text="Logout" onClick={this.props.onLogout}></MenuItem>
                    </div>
                </div>
            </>
        );
    }
}

PopUpMenu.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node,
    onLogout: PropTypes.func.isRequired,
};
