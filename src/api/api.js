const { default: Axios } = require("axios")


const instance = Axios.create({
        baseURL: 'https://hacker-news.firebaseio.com/v0/',
})



export const API = {
    getItem(id) {
        return instance.get(`/item/${id}.json?print=pretty`)
    },
    getUsers(name) {
        return instance.get(`user/${name}.json?print=pretty`)
    },
    getIdsOfNewStories() {
        return instance.get('newstories.json?print=pretty')
    }
}

