import { users } from "../libs/user";
import { poses } from "../libs/pos";
import { context } from "../store";
import React, { useState, useEffect, useContext } from "react";
import { Icon, List, Dropdown, Message } from "semantic-ui-react";

export default () => {
  const [userlist, setUserlist] = useState([]);
  const { methods, data } = useContext(context);
  useEffect(() => {
    (async () => {
      const res = await users();
      setUserlist(res.data.aggregations.users.buckets);
    })();
  }, []);

  const dropdownOptions = userlist.map(({ key }) => ({
    text: key,
    value: key,
    icon: "user",
    key,
  }));

  const { relatedUsers } = data;
  return (<div>
    <Dropdown options={dropdownOptions} selection fluid search clearable
      value={data.user}
      onChange={(e, { value }) => methods.setUser(value)}
    />
    <List>{Object.keys(relatedUsers).map(user => (<List.Item
      key={user}
    >
      <Icon name='user'></Icon>
      <List.Content header={user} description={`${relatedUsers[user].length} 个潜在接触点`} />
    </List.Item>))}
    </List>

    <Message info>
      <Message.Header>判定规则</Message.Header>
      <p>1. 上报间隔 2 分钟内</p>
      <p>2. 上报位置 400 米内</p>
      <p>同时满足以上两点判定为接触点，修改规则参考 services/location.service.ts</p>
    </Message>
  </div>);
};
