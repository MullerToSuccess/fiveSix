const HomeworkHosting = resolve => {
  import("teacherHome/student/components/homeworkHosting").then(module => {
    resolve(module);
  });
};
const HistoryHostingDetail = resolve => {
  import("teacherHome/student/components/historyHostingDetail").then(module => {
    resolve(module);
  });
};
const TodayHostingList = resolve => {
  import("teacherHome/student/components/todayHostingList").then(module => {
    resolve(module);
  });
};
const TodayHostingName = resolve => {
  import("teacherHome/student/components/todayHostingName").then(module => {
    resolve(module);
  });
};
const EverydayFeedback = resolve => {
  import("teacherHome/student/components/everydayFeedback").then(module => {
    resolve(module);
  });
};
const KnowledgePoint = resolve => {
  import("teacherHome/student/components/knowledgePoint").then(module => {
    resolve(module);
  });
};
const ViewImage = resolve => {
  import("teacherHome/student/components/viewImage").then(module => {
    resolve(module);
  });
};
const CheckEverydayFeedback = resolve => {
  import("teacherHome/student/components/checkEverydayFeedback").then(
    module => {
      resolve(module);
    }
  );
};
const HistoryHosting = resolve => {
  import("teacherHome/student/components/historyHosting").then(module => {
    resolve(module);
  });
};
// const AttendanceCount = resolve => {
//   import("teacherHome/student/components/attendanceCount").then(module => {
//     resolve(module);
//   });
// };
// const CountDetail = resolve => {
//   import("teacherHome/student/components/countDetail").then(module => {
//     resolve(module);
//   });
// };

export default [
  {
    path: "/teacher/student/homeworkHosting",
    name: "homeworkHosting",
    component: HomeworkHosting,
    meta: { requiresAuth: false, keepAlive: false }
  },
  {
    path: "/teacher/student/historyHostingDetail",
    name: "historyHostingDetail",
    component: HistoryHostingDetail,
    meta: { requiresAuth: false, keepAlive: false }
  },
  {
    path: "/teacher/student/todayHostingList",
    name: "todayHostingList",
    component: TodayHostingList,
    meta: { requiresAuth: false, keepAlive: false }
  },
  {
    path: "/teacher/student/todayHostingName",
    name: "todayHostingName",
    component: TodayHostingName,
    meta: { requiresAuth: false, keepAlive: false }
  },
  {
    path: "/teacher/student/everydayFeedback",
    name: "everydayFeedback",
    component: EverydayFeedback,
    meta: { requiresAuth: false, keepAlive: false }
  },
  {
    path: "/teacher/student/knowledgePoint",
    name: "knowledgePoint",
    component: KnowledgePoint,
    meta: { requiresAuth: false, keepAlive: false }
  },
  {
    path: "/teacher/student/viewImage",
    name: "viewImage",
    component: ViewImage,
    meta: { requiresAuth: false, keepAlive: false }
  },
  {
    path: "/teacher/student/checkEverydayFeedback",
    name: "checkEverydayFeedback",
    component: CheckEverydayFeedback,
    meta: { requiresAuth: false, keepAlive: false }
  },
  {
    path: "/teacher/student/historyHosting",
    name: "historyHosting",
    component: HistoryHosting,
    meta: { requiresAuth: false, keepAlive: true }
  }
  // ,
  // {
  //   path: "/teacher/student/attendanceCount",
  //   name: "attendanceCount",
  //   component: AttendanceCount,
  //   meta: { requiresAuth: false, keepAlive: true }
  // },
  // {
  //   path: "/teacher/student/countDetail",
  //   name: "countDetail",
  //   component: CountDetail,
  //   meta: { requiresAuth: false, keepAlive: true }
  // }
];
