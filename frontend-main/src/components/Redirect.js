import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';

const Redirect = (props) => {
    let firstRender = useRef(true);
    let nav = useNavigate();
    let route = useLocation();

    /** @type {{from: string[], to: string, onChange: any, replace: boolean}} */
    let { from, to, onChange, replace } = props;

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        if (from.includes(route.pathname)) {
            console.log(route);
            nav(to, { replace });
        }
    }, [onChange]);

    return null;
};

Redirect.propTypes = {
    onChange: PropTypes.any.isRequired,
    from: PropTypes.arrayOf(PropTypes.string),
    to: PropTypes.string,
    replace: PropTypes.bool,
};

Redirect.defaultProps = {
    from: ['/create/account'],
    to: '/',
    replace: false,
};

export default Redirect;
