export const updateObject = (state, updatedObject) => {
    return {
        ...state,
        ...updatedObject
    }
}


export const host = "http://localhost:8081"