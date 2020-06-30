/*
 * extract parameter from url to toggle test mode and joystick mode
 */
export function findGetParameter(parameterName) {
  let result = null;
  let tmp = [];
  window.location.search
    .substr(1)
    .split("&")
    .forEach(function(item) {
      tmp = item.split("=");
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
  return result;
}
