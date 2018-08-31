import storage from "@/store/stroage";
import homeApi from "@/module/home/axios/home";

export default {
  namespaced: true,
  state: {
    newMsg: false,
    newHomeworkMsg: 0,
    newSchoolMsg: 0
  },
  mutations: {
    setMsg(state, val) {
      state.newMsg = val
    },
    setHomeworkMsg(state, type) {
      if (type === 'add') {
        state.newHomeworkMsg++
      } else if (type === 'clear') {
        state.newHomeworkMsg = 0
      } else {
        if (state.newHomeworkMsg === 0) {
          return false
        }
        state.newHomeworkMsg--
      }
      if (state.newHomeworkMsg === 0 && state.newSchoolMsg === 0) {
        state.newMsg = false
      } else {
        state.newMsg = true
      }
    },
    setSchoolMsg(state, type) {
      if (type === 'add') {
        state.newSchoolMsg++
      } else if (type === 'clear') {
        state.newSchoolMsg = 0
      } else {
        if (state.newSchoolMsg === 0) {
          return false
        }
        state.newSchoolMsg--
      }
      if (state.newHomeworkMsg === 0 && state.newSchoolMsg === 0) {
        state.newMsg = false
      } else {
        state.newMsg = true
      }
    },
    connectMqtt(state) {
      if (!window.bus.mqtt.client || !window.bus.mqtt.client.isConnected()) {
        window.bus.mqtt.connect();
        homeApi.getMsg({ user_id: storage['persistent'].get('userinfo').userid }).then(r => {
          if (r.notice > 0 || r.homework > 0) {
            state.newMsg = true;
            // this.$store.commit("notice/setSchoolMsg", true);
            state.newSchoolMsg = r.notice;
            // this.$store.commit("notice/setHomeworkMsg", true);
            state.newHomeworkMsg = r.homework
          }
        });
      }
    }
  },
  actions: {

  }

}
