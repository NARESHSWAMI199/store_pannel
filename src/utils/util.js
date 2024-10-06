import { redirect } from "next/dist/server/api-utils";


export const updateObject = (state, updatedObject) => {
    return {
        ...state,
        ...updatedObject
    }
}

// export const host = "http://10.11.13.49:8081"

export const host = "http://localhost:8081"

export const toTitleCase = (str) => {
    if (!!str)
    return str.replace(
      /\w\S*/g,
      text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
    return "____"
  }


  export  const itemImage = host+"/admin/item/image/";
  export const storeImage = host+"/admin/store/image/"
  export const userImage = host+"/admin/auth/profile/"


  export const suId = 0;