import { users } from "../libs/user";
import { poses } from "../libs/pos";
import { context } from "../store";
import React, { useState, useEffect, useContext } from "react";
import { Icon, List, Dropdown } from "semantic-ui-react";

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
  </div>);
};
