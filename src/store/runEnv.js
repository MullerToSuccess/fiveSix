import stroage from '@/store/stroage.js'

export default {
  namespaced: true,
  state: {
    env: stroage['persistent'].get('runEnv.env') || '',
    host: 'anoah.com',
    host56: '56dian.cn',
    upload: 'upload',
    pro: 'http',
    pro56: 'https'
  },
  getters: {
    env: state => {
      return `${state.env}`
    },
    api2: state => {
      if (state.env) {
        return `${state.pro}://${state.env}${state.host}/yxp_api2/`
      } else {
        return `${state.pro}://api2.${state.host}/`
      }
    },
    api56: state => {
      if (state.env) {
        return `${state.pro}://${state.env}${state.host56}/`
      } else {
        return `${state.pro56}://apis.${state.host56}/`
      }
    },
    apishare: state => {
      if (state.env) {
        return `${state.pro}://share.${state.env}${state.host56}/`
      } else {
        return `${state.pro}://share.${state.host56}/`
      }
    },
    apidev: state => {
      if (state.env) {
        return `${state.pro}://www.${state.env}${state.host}/`
      } else {
        return `${state.pro}://www.${state.host}/`
      }
    },
    apiUpload: state => {
      if (state.env) {
        return `${state.pro}://${state.upload}.${state.env}${state.host56}/`
      } else {
        return `${state.pro56}://${state.upload}.${state.host56}/`
      }
    },
    old: state => {
      return `${state.pro}://e.${state.env}${state.host}/`
    },
    apis2: state => {
      if (state.env) {
        return `${state.pro}://apis2.${state.env}${state.host}:8182/`
      } else {
        return `${state.pro}://apis2.${state.env}${state.host}/`
      }
    },
    // 授权接口域名
    yxp_apis2: state => {
      if (state.env) {
        return `${state.pro}://${state.env}${state.host}/yxp_apis2/`
      } else {
        return `${state.pro}://apis2.${state.host}/`
      }
    },
    // 调用壳子时需要
    shell_api: state => {
      return `e.${state.env}${state.host}`
    }
  },
  mutations: {
    setEnv (state, val) {
      state.env = val
      stroage['persistent'].set('runEnv.env', val)

      window.ICOM_EVN_VAR = {
        js_local: true,
        debug: true,
        lib_address: `../QTI/jslibs/`,
        base: `../QTI/icoms/`,
        api_address: `${this.getters['runEnv/old']}/api/`,
        api_address_dist: `${this.getters['runEnv/old']}/api_dist/`,
        api_address_router: `${this.getters['runEnv/old']}/api_router/`,
        api_cache: true
      }
      if (typeof $i !== 'undefined') {
        $i.fn.setEnvVar(window.ICOM_EVN_VAR);
      }
      // document.getElementById('icombase').src = `${this.getters['runEnv/old']}/icoms/qtidiv/icombase.js`
      // document.getElementById('icombase').remove()
      // window.bus.addQti(`${this.getters['runEnv/old']}/icoms/qtidiv/icombase.js`, 'icombase')
    }
  },
  actions: {
    changeEnv: function ({ commit }, val) {
      commit('setEnv', val)
    }
  }
}
