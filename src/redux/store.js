import { createStore,compose,applyMiddleware } from "redux";
import authReducer from "./reducer/reducer";
import thunk from "redux-thunk";
import { useEffect, useState } from "react";

function Store () {
    
const [composeEnhances,setComposeEnhances] =  useState(null)
useEffect (async ()=>{
    await setComposeEnhances(window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose)
},[]) 

return composeEnhances

}

export const store =  createStore(
    authReducer, <Store/>,(applyMiddleware(thunk))
)
