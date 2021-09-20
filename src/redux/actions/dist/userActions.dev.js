"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logoutUser = exports.signUpUser = exports.loginUser = void 0;

var _types = require("../types");

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

var loginUser = function loginUser(userData, history)
{
  return function (dispatch)
  {
    // dispatch({type: LOADING_UI});
    _axios["default"].post("".concat(REACT_APP_BASE_URL, "/api/login"), userData).then(function (res)
    {

      var FBIdToken = res.data.idToken; // setAuthorizationHeader(FBIdToken);

      dispatch({
        type: _types.SET_USER,
        payload: res.data.personData
      });
      dispatch({
        type: _types.CLEAR_ERRORS
      });
      history.push("/");
    })["catch"](function (err)
    {
      dispatch({
        type: _types.SET_ERRORS,
        payload: err.response.data
      });
    });
  };
};

exports.loginUser = loginUser;

var signUpUser = function signUpUser(newUserData, history)
{
  return function (dispatch)
  {
    _axios["default"].post("".concat(REACT_APP_BASE_URL, "/api/signup"), newUserData).then(function (res)
    {
      console.log(res);
      var FBIdToken = res.data.idToken;
      setAuthorizationHeader(FBIdToken);
      dispatch({
        type: _types.SET_USER,
        payload: res.data.personData
      });
      dispatch({
        type: _types.CLEAR_ERRORS
      });
      history.push('/');
    })["catch"](function (err)
    {
      dispatch({
        type: _types.SET_ERRORS,
        payload: err.response.data
      });
    });
  };
};

exports.signUpUser = signUpUser;

var logoutUser = function logoutUser(history)
{
  return function (dispatch)
  {
    _axios["default"].post("".concat(REACT_APP_BASE_URL, "/api/logout")).then(function (res)
    {
      if (res.status === 200)
      {
        localStorage.removeItem('FBIdToken');
        delete _axios["default"].defaults.headers.common['Authorization'];
        dispatch({
          type: _types.SET_UNAUTHENTICATED
        });
        console.log(history);
        history.push('/');
      } else
      {
        console.log(res.status);
      }
    })["catch"](function (res)
    {
      console.log(res.status);
    });
  };
};

exports.logoutUser = logoutUser;

var setAuthorizationHeader = function setAuthorizationHeader(token)
{
  var FBIdToken = token;
  localStorage.setItem('FBIdToken', FBIdToken);
  _axios["default"].defaults.headers.common['Authorization'] = FBIdToken;
}; // const setUserProperties = res => {
//   const
// }