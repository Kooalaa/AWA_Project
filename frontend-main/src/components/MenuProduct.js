import { Component } from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/RestaurantMenuPopUp.module.scss';
import cx from 'classnames';

export default class MenuProduct extends Component {
    render() {
        /** @type {string} */
        let text = this.props.text;

        return (
            <div className={cx(styles.menuItem, styles.button, styles.elem)} onClick={this.props.onClick}>
                {text}
            </div>
        );
    }
}

MenuProduct.propTypes = {
    text: PropTypes.string,
    onClick: PropTypes.func,
};

MenuProduct.defaultProps = {
    text: '',
    onClick: () => console.log('Button clicked'),
};