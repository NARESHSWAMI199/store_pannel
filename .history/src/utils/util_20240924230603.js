export const updateObject = (state, updatedObject) => {
    return {
        ...state,
        ...updatedObject
    }
}


export const host = "http://10.11.13.49:8081"