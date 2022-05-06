import styles from '../styles/Footer.module.scss';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default function Footer(props) {
    return (
        <div className={styles.footer} style={props.styles}>
            <div className={cx(styles.title, styles.font)}>DR D. E. Livery</div>
            <div className={cx(styles.font)}>
                <div>Created by:</div>
                <div>Thomas Grönroos</div>
                <div>Konsta Alajärvi</div>
                <div>Samuli Ikäläinen</div>
                <div>Andreas Avetisian</div>
            </div>
            <div className={cx(styles.font)}>
                <div>Sponsored by:</div>
                <div>Ramppasamppa Corporation</div>
            </div>
        </div>
    );
}

Footer.propTypes = {
    styles: PropTypes.object,
};
