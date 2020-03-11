import "leaflet/dist/leaflet.css";
import "semantic-ui-css/semantic.min.css";

import AddRoute from "./comps/AddRoute";
import Users from "./comps/Users";
import { Provider, context } from "./store";
import { report, poses, overlaps } from "./libs/pos";
import { groupOverlaps } from "./libs/user";
import React, { useState, useContext, useEffect } from "react";
import { render } from "react-dom";
import { Map, Circle, TileLayer } from "react-leaflet";
import { Tab, Container } from "semantic-ui-react";

const position = [22.600445, 114.137329];
const App = () => {
  const [routePoints, setRoutePoints] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [addModeOptions, setAddModeOptions] = useState({ date: new Date(), user: "张三" });
  const panes = [
    { menuItem: "User List", render: () => <Tab.Pane><Users /></Tab.Pane> },
    {
      menuItem: "Mimic Report", render: () => <Tab.Pane>
        <AddRoute opts={addModeOptions} setOpts={setAddModeOptions} />
      </Tab.Pane>,
    },
  ];
  const { data, methods } = useContext(context);
  useEffect(() => {
    (async () => {
      methods.setPoints([]);
      const posArr = await poses(data.user);
      methods.setPoints(posArr);
      methods.setRelatedUsers({});
      const overlapPos = await overlaps(data.user, posArr);
      methods.setRelatedUsers(groupOverlaps(overlapPos));
    })();
  }, [data.user]);
  return (
    <div>
      <Map key="map" center={position} zoom={13} style={{ height: "100vh", width: "70vw" }}
        onclick={e => addPos(e.latlng)}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        {data.points.map((point, i) => {
          const { pos } = point;
          const [lng, lat] = pos;
          return (<Circle key={i} center={[lat, lng]} radius={80}></Circle>);
        })}
      </Map>
      <div key="ctrls" style={{ width: "30vw", position: "absolute", right: 0, top: 0 }}>
        <Container>
          <Tab panes={panes} activeIndex={addMode ? 1 : 0}
            onTabChange={(e, { activeIndex }) => {
              setAddMode(activeIndex === 1 ? true : false);
            }}
          /></Container>
      </div>
    </div>);

  /* eslint-disable */
  async function addPos(latlng) {
    console.log(latlng)
    if (!addMode) return
    const { lng, lat } = latlng
    const { user, date, points } = data
    let record = await report(lat, lng, user, date)
    methods.setPoints(points.concat([record]))
  }
  /* eslint-enable */

};
render(<Provider><App /></Provider>, document.getElementById("app"))
  ;
