import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";

const router = useRouter()

export const updateObject = (state, updatedObject) => {
    return {
        ...state,
        ...updatedObject
    }
}


export const host = "http://localhost:8081"



export const toTitleCase = (str) => {
    if (!!str)
    return str.replace(
      /\w\S*/g,
      text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
    return "____"
  }

