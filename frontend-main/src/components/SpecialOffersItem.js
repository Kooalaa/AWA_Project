import styles from '../styles/SpecialOffersItem.module.scss';
import { CloudinaryContext, Image } from 'cloudinary-react';
import cx from 'classnames';
import { Link } from 'react-router-dom';

export default function SpecialOffersItem(props) {
    return (
        <Link to={'/restaurants/' + props.restaurant.restaurant_id} className={styles.specialoffersitem}>
            <CloudinaryContext cloudName="ramppasamppa">
                <div>
                    <Image publicId={props.product.picture} />
                </div>
            </CloudinaryContext>
            <div className={styles.offerInfo}>
                <div className={styles.font}>{props.product.name}</div>
                <div className={styles.font}>{props.restaurant.name}</div>
            </div>
            <div className={cx(styles.offerInfo, styles.percent)}>
                <span classnName={styles.font}>{props.specialOffer.percent_off * 100}%</span>
            </div>
        </Link>
    );
}
