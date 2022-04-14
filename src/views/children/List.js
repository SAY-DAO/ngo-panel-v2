import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import PageContainer from '../../components/container/PageContainer';
import ChildCard from '../../components/child/ChildCard';
import { fetchChildList } from '../../redux/actions/childAction';

const ChildrenList = () => {
  const dispatch = useDispatch();
  const { checkResult, loading, success } = useSelector((state) => state.fetchChildList);
  useEffect(() => {
    dispatch(fetchChildList());
  }, [dispatch]);

  return (
    <PageContainer>
      <ChildCard />
    </PageContainer>
  );
};

export default ChildrenList;
