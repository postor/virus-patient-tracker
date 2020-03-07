import axios from "./axios";
import { getTime } from "date-fns";

const REPORT_URL = "/api/location/report";
export const report = async (lat, lng, user, date) => {
  const record = {
    pos: [lng, lat],
    user,
    date: getTime(new Date(date)),
  };
  await axios.post(REPORT_URL, record);
  return record;
};

const POS_LIST_URL = "/api/location/pos";
export const poses = async user => {
  const res = await axios.post(POS_LIST_URL, {
    user,
  });
  return res.data.hits.hits.map(({ _source }) => _source);
};

const OVERLAP_LIST_URL = "/api/location/overlap";
export const overlaps = async (user, posArr) => {
  const res = await axios.post(OVERLAP_LIST_URL, {
    user,
    posArr,
  });
  return res.data.hits.hits.map(({ _source }) => _source);
}
  ;
