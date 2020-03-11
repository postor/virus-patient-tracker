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
      <List.Content header={user} description={`${relatedUsers[user].length} contact points`} />
    </List.Item>))}
    </List>

    <Message info>
      <Message.Header>Rules</Message.Header>
      <p>1. diff between two reports less than 2 min</p>
      <p>2. distance between two reports less than 400 meter</p>
      <p>one contact point if both meet, refer services/location.service.ts to change rules</p>
    </Message>
  </div>);
};
