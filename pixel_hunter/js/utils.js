const mainElement = document.querySelector(`#main`);

export const renderElement = (template, tagName = `div`, tagClass) => {
  const wrapper = document.createElement(tagName);
  wrapper.innerHTML = template;
  wrapper.setAttribute(`class`, tagClass || ``);
  return wrapper;
};

export const appendElement = (element, tagName = `div`, tagClass) => {
  const wrapper = renderElement(``, tagName, tagClass);
  wrapper.appendChild(element);
  return wrapper;
};

export const showScreen = (element) => {
  mainElement.innerHTML = ``;
  mainElement.appendChild(element);
};

export const showElement = (element) => {
  mainElement.appendChild(element);
};

export const isEquivalent = (array1, array2) => {
  const aString = array1.toString();
  const bString = array2.toString();

  return aString === bString;
};

export const resize = (frame, object) => {

  let ratioX = object.width / frame.width;
  let ratioY = object.height / frame.height;

  if (object.width > object.height) {
    ratioY = ratioX;
  }

  if (object.width < object.height) {
    ratioX = ratioY;
  }

  if (object.width === object.height && frame.width > frame.height) {
    ratioX = ratioY;
  }

  const result = {
    width: object.width / ratioX,
    height: object.height / ratioY
  };

  if (result.width > frame.width) {
    result.width = object.width / (object.width / frame.width);
    result.height = object.height / (object.width / frame.width);
  }

  if (result.height > frame.height) {
    result.width = object.width / (object.height / frame.height);
    result.height = object.height / (object.height / frame.height);
  }

  return result;
};

export const resizeImg = (image, frame) => {
  const picture = new Image();
  picture.src = image.src;
  picture.onload = () => {
    const properSize = resize(frame, picture);
    picture.width = properSize.width;
    picture.height = properSize.height;
  };
  return picture;
};

export const resizeToProperSize = (image) => {
  const frame = {
    width: image.width,
    height: image.height
  };
  return resizeImg(image, frame);
};

export default mainElement;
