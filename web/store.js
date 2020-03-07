import createContext from "next-context-store";
import { format } from "date-fns";
export const { Provider, Consumer, context } = createContext({
  data: {
    user: "张三",
    date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    points: [],
    relatedUsers: {},
  }, // Data or function that returns data | 仓库数据，或者返回仓库数据的函数
  methods: {  // Methods or store action | 方法，或者称为action
    setDate(date) {
      this.date = date;  // This will bind to the data object | this会绑定到data对象上
    },
    setUser(user) {
      this.user = user;
    },
    setPoints(points) {
      this.points = points;
    },
    setRelatedUsers(relatedUsers) {
      this.relatedUsers = relatedUsers;
    },
  },
})
  ;
