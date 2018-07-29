import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken, setUserInfo,removeUserInfo } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          if (response.success) {
            const token = response.result;
            setToken(token);
            if (userInfo.checked) {
              console.log("免登陆")
              let data = {
                username: username,
                password: userInfo.password
              }
              setUserInfo(data);
            }else{
              removeUserInfo();
            }
            commit('SET_TOKEN', token)
            resolve()
          } else {
            reject(response.errorInfos[0])
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          // console.log(response)
          commit('SET_NAME', response.result.userName)
          commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
          resolve(response)
        }).catch(error => {
          reject(error)
        });
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {

        commit('SET_TOKEN', '')
        removeToken();
       
        resolve();


      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
