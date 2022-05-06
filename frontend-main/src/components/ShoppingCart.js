import { Component } from 'react';
import styles from '../styles/ShoppingCartPopUp.module.scss';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import CartItem from './CartItem';
import { Link } from 'react-router-dom';

const ExtraItems = (props) => {
    let len = props.cart.length;
    if (len > 3) return <div className={props.className}>{`And ${len - 3} more ${len - 3 === 1 ? 'item' : 'items'} in cart`}</div>;
    return null;
};

export default class ShoppingCart extends Component {
    constructor(props) {
        super(props);

        this.state = { shown: false };

        this.onClick = this.onClick.bind(this);
    }

    closeMenuListenner = (event) => {
        if (!event.target.closest('[data-shopping]')) {
            this.onClick();
        }
    };

    onClick() {
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
        const GridHeader = (props) => {
            return (
                <>
                    <div className={props.className}>Product</div>
                    <div className={props.className}>Count</div>
                    <div className={props.className}>Price</div>
                </>
            );
        };

        let total = 0;
        for (const item of this.props.cart) {
            total += item.count * item.price;
        }
        total = Math.round(total * 100) / 100;

        return (
            <>
                <HiOutlineShoppingCart className={styles.menuIcon} onClick={this.onClick} data-shopping />
                <div className={cx(styles.menu, styles.font, this.state.shown ? styles.on : undefined)} data-shopping>
                    <div className={cx(styles.title, styles.menuItem)}>Shopping cart</div>
                    <div className={cx(styles.menuItem, styles.itemGrid)}>
                        <GridHeader className={styles.header} />
                        {this.props.cart.map((item, index) => {
                            if (index < 3) return <CartItem key={item.id} item={item} />;
                        })}
                    </div>
                    <ExtraItems className={cx(styles.menuItem, styles.itemsLeft)} cart={this.props.cart} />
                    <div className={styles.menuSettings}>
                        <div className={styles.menuItem}>{`Total price ${total}€`}</div>
                        <Link to="/cart" onClick={this.onClick} className={cx(styles.menuItem, styles.button)}>
                            Show more
                        </Link>
                    </div>
                </div>
            </>
        );
    }
}

ShoppingCart.propTypes = {
    cart: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            count: PropTypes.number,
            price: PropTypes.number,
        })
    ),
};
