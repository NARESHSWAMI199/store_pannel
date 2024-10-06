import { redirect } from "next/dist/server/api-utils";


export const updateObject = (state, updatedObject) => {
    return {
        ...state,
        ...updatedObject
    }
}


export const host = "http://192.168.1.15:8081"



export const toTitleCase = (str) => {
    if (!!str)
    return str.replace(
      /\w\S*/g,
      text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
    return "____"
  }

