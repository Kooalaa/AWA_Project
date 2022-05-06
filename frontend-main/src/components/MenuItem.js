import { Component } from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/PopUpMenu.module.scss';
import cx from 'classnames';

const SplitText = (props) => {
    return (
        <>
            <br />
            {props.text}
        </>
    );
};

export default class MenuItem extends Component {
    render() {
        /** @type {string} */
        let text = this.props.text;

        let result = text;
        if (text.includes('\\n'))
            result = (
                <>
                    {text.split('\\n').map((text, index) => {
                        if (index != 0) return <SplitText key={index} text={text} />;
                        return text;
                    })}
                </>
            );

        return (
            <div className={cx(styles.menuItem, styles.button)} onClick={this.props.onClick}>
                {result}
            </div>
        );
    }
}

MenuItem.propTypes = {
    text: PropTypes.string,
    onClick: PropTypes.func,
};

MenuItem.defaultProps = {
    text: '',
    onClick: () => console.log('Button clicked'),
};
