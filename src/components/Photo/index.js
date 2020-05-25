import React from "react";
import PropTypes from "prop-types";
// import './style.scss';

const Photo = ({
  index,
  onClick,
  photo,
  margin,
  direction,
  top,
  left,
  key
}) => {

  const imgStyle = {
    //margin: margin,
    display: "block",
    cursor: "pointer",
    position: "absolute",
    left: left,
    top: top
  };

  const handleClick = event => {
    onClick(event, { photo, index });
  };

  return (
    <img
      key={key}
      style={ imgStyle}
      {...photo}
      onClick={onClick ? handleClick : null}
    />
  );

  return (
    <div className="card-photo" onClick={onClick ? handleClick : null}  
    >
      <figure className="card-photo__image">
          <img
            key={key}
            style={imgStyle}
            {...photo}
          
          />
      </figure>

      {/* <div className="card-photo__title"> <h4>lelelelel</h4></div> */}
    </div>
  );
};

export const photoPropType = PropTypes.shape({
  key: PropTypes.string,
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  alt: PropTypes.string,
  title: PropTypes.string,
  srcSet: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  sizes: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
});

Photo.propTypes = {
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  photo: photoPropType.isRequired,
  margin: PropTypes.number,
  top: props => {
    if (props.direction === "column" && typeof props.top !== "number") {
      return new Error(
        "top is a required number when direction is set to `column`"
      );
    }
  },
  left: props => {
    if (props.direction === "column" && typeof props.left !== "number") {
      return new Error(
        "left is a required number when direction is set to `column`"
      );
    }
  },
  direction: PropTypes.string
};

export default Photo;
