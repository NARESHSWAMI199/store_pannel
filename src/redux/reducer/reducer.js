import { updateObject } from "src/utils/util"
import * as actionsType  from "src/redux/actions/actions"
import { useEffect, useState } from "react"

const State = () => {
    const [initialState,setInitialState] = useState({
        token : null,
        error : null
    })

    useEffect (()=>{
        const token = localStorage.getItem("token");
        console.log(token)
        setInitialState(token);
    },[])

    return initialState;
    
}


const authStart = (state,actions) =>{
    return updateObject(state,{
        error : null,
        loding : true
    })
}


const authSuccess = (state,action) =>{
    return updateObject(state,{
        token : action.token,
        loding : false,
        error : false
    })
}


const authFail = (state, action) => {
        return updateObject(state, {
            error: action.error,
            loading: false
        });
    }


    const authLogout = (state, action) => {
        return utility.updateObject(state, {
            token: null
        });
    }
    

const authReducer = (state = <State/>, actions) => {
    switch (actions.type){
        case actionsType.AUTH_START: return authStart(state,actions);
        case actionsType.AUTH_SUCCESS: return authSuccess(state,actions);
        case actionsType.AUTH_FAIL: return authFail(state,actions);
        case actionsType.AUTH_LOGOUT: return authLogout(state,actions);
        default: return state;
    }
}


export default authReducer;