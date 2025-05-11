import { redirect } from "next/dist/server/api-utils";


export const updateObject = (state, updatedObject) => {
    return {
        ...state,
        ...updatedObject
    }
}

// const hostIp = "192.168.1.6"
const hostIp = "localhost"
const port = "8080"


// export const host = "http://localhost:8080"
export const host = `http://${hostIp}:${port}` // connected with macbook
export const wbhost = `ws://${hostIp}:${port}` // for websocket

// export const host = "http://202.157.82.29:8080" 

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
  export const userImage = host+"/wholesale/auth/profile/"


  export const suId = 0;
  export const ruppeeIcon = "₹ "

  export const projectName = "Swami Sales"

  export const dataNotFoundImage = "https://cdn-icons-png.flaticon.com/512/7466/7466073.png";
  export const defaultChatImage = "https://static.vecteezy.com/system/resources/thumbnails/008/508/957/small_2x/3d-chat-mail-message-notification-chatting-illustration-png.png"

  export const rowsPerPageOptions=[10, 25 , 50]