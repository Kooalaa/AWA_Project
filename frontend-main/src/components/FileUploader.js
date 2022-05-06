import React from 'react';

const FileUploader = (props) => {
    const hiddenFileInput = React.useRef(null);

    const handleClick = () => {
        hiddenFileInput.current.click();
    };

    const handleChange = (event) => {
        props.selected(event);
    };

    return (
        <>
            <button type='button' onClick={handleClick} className={props.style}>
                + Add picture
            </button>
            <input name="picture" type="file" ref={hiddenFileInput} onChange={handleChange} style={{ display: 'none' }} className={props.style} />
        </>
    );
};

export default FileUploader;
