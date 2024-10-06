import axios from "axios"
import * as actions from 'src/redux/actions/actions'



export const authStart = () =>{
    return {
        type : actions.AUTH_START
    }
}


export const authSuccess = (token) =>{
    return {
        type : actions.AUTH_SUCCESS,
        token : token
    }
}


export const authFail = error =>{
    return {
        type : actions.AUTH_FAIL,
        error : error
    }
}


export const authLogout = error =>{
    localStorage.removeItem('token');
    return {
        type : actions.AUTH_LOGOUT,
    }
}


export function authLogin(email, password) {
    return dispatch => {
    dispatch(authStart())
    axios.post("http://localhost:8081/admin/auth/login" , {
        email : email,
        password : password
    })
    .then (res => {
        const token = res.data.res.token
        localStorage.setItem("token", token)
        localStorage.setItem("email",email)
        dispatch(authSuccess(token));
    })
    .catch (err =>{ 
        const errorMessage = err.response.data.message;
        dispatch(authFail(errorMessage))
    })
}

}









