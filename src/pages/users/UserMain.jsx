import React, { useEffect, useState } from 'react';
import '../../resources/styles/css/search-user.css';
import { useDispatch, useSelector } from 'react-redux';
import UserTable from '../../components/users/UserTable';
import { searchUser } from '../../redux/actions/userAction';
import UserDialog from '../../components/dialogs/UserDialog';

function UserMain() {
  const dispatch = useDispatch();

  const [query, setQuery] = useState('');
  const [dialogValues, setDialogValues] = useState();

  const { result } = useSelector((state) => state.userSearch);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(searchUser(query));
    };
    if (query.length === 0 || query.length > 2) fetchData();
  }, [query]);

  return (
    <div className="app">
      <input
        className="search"
        placeholder="Search..."
        onChange={(e) => setQuery(e.target.value.toLowerCase())}
      />
      {result && <UserTable setDialogValues={setDialogValues} data={result.users} />}
      {dialogValues && dialogValues.open && dialogValues.user && (
        <UserDialog setDialogValues={setDialogValues} dialogValues={dialogValues} />
      )}
    </div>
  );
}

export default UserMain;
