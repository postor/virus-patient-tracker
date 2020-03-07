import axios from "./axios";
import { getTime } from "date-fns";

const REPORT_URL = "/api/location/users";
export const users = async () => await axios.get(REPORT_URL);

const POS_LIST_URL = "/api/location/pos";
export const poses = async user => await axios.post(POS_LIST_URL, {
  user,
});

export const groupOverlaps = (arr = []) => {
  const rtn = {};
  for (const record of arr) {
    /* eslint-disable-next-line */
    if (rtn[record.user] === undefined) { rtn[record.user] = []; };
    rtn[record.user].push(record);
  }
  return rtn;
}
  ;
