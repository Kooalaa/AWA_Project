import { Component } from 'react';
import styles from '../styles/RestaurantMenuPopUp.module.scss';
import PropTypes from 'prop-types';
import cx from 'classnames';
import MenuProduct from './MenuProduct';
import axios from 'axios';
import { APIAddress } from '../config.json';
import { CloudinaryContext, Image } from 'cloudinary-react';

export default class RestaurantMenuPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productData: {
                restaurant_id: '',
                product_id: '',
                name: '',
                price: '',
                description: '',
            },
        };
        this.state = { shown: false };

        this.onMenuClicked = this.onMenuClicked.bind(this);
    }

    closeMenuListenner = (event) => {
        if (!event.target.closest(`[data-menu${this.props.index}]`)) {
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

    menu = { [`data-menu${this.props.index}`]: true };
    render() {
        const { product } = this.props;
        return (
            <>
                <div className={styles.menuIcon} onClick={this.onMenuClicked} {...this.menu}>
                    {this.props.product.name}
                </div>
                <div className={cx(styles.menu, styles.font, this.state.shown ? styles.on : undefined)} {...this.menu}>
                    <div className={styles.pictureNamePrice}>
                        <CloudinaryContext cloudName="ramppasamppa" className={styles.productPicture}>
                            <Image publicId={this.props.product.picture} className={styles.pictureStyleSize} />
                        </CloudinaryContext>
                        <div className={styles.nameAndPrice}>
                            <MenuProduct text={this.props.product.name}></MenuProduct>
                            <MenuProduct text={'Price: ' + this.props.product.price + '€'}></MenuProduct>
                        </div>
                    </div>
                    <div className={styles.description}>
                        <MenuProduct text={this.props.product.description}></MenuProduct>
                    </div>
                    <div className={styles.buttons}>
                        <button onClick={this.onMenuClicked} className={cx(styles.closeButton, styles.font)}>
                            Close
                        </button>
                        <button
                            className={cx(styles.addToCartButton, styles.font)}
                            onClick={() => {
                                this.props.addToCart(product.restaurant_id, product.product_id, product.name, product.price);
                            }}
                        >
                            Add to cart
                        </button>
                    </div>
                </div>
            </>
        );
    }
}

RestaurantMenuPopUp.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node,
};
