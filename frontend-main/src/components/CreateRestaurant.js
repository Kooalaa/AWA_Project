import styles from '../styles/CreateRestaurant.module.scss';
import { Link } from 'react-router-dom';
import cx from 'classnames';

export default function CreateRestaurant() {
    return (
        <Link to="/create/restaurant" className={cx(styles.font, styles.createRestaurant)}>
            Create Restaurant
        </Link>
    );
}
