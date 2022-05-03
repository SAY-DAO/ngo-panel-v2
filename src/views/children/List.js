import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import PageContainer from '../../components/container/PageContainer';
import ChildCard from '../../components/child/ChildCard';
import { fetchChildList } from '../../redux/actions/childAction';

const ChildrenList = () => {
  const dispatch = useDispatch();
  const childrenAll = useSelector((state) => state.fetchChildList);
  const { childList, loading, success } = childrenAll;
  useEffect(() => {
    dispatch(fetchChildList());
  }, [dispatch]);

  console.log(childrenAll);

  return (
    <PageContainer>
      <ChildCard />
    </PageContainer>
  );
};;;

export default ChildrenList;
