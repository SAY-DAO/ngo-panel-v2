/* eslint-disable no-restricted-syntax */
import { CronJob } from 'cron';
import { CronExpression } from './corns';
import { daoApi, publicApi } from '../apis/sayBase';
import { PaymentStatusEnum } from './types';

// delete ol;d needs which are not paid
export default function DeleteOldNeeds(userInfo) {
  const job = new CronJob(
    CronExpression.EVERY_WEEK,
    async () => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: userInfo && userInfo.access_token,
        },
      };
      try {
        const { data: nestData } = await daoApi.get(`needs/delete/candidates`, config);
        for await (const need of nestData[0]) {
          if (need.status === PaymentStatusEnum.NOT_PAID) {
            const { data: deleteData } = await publicApi.patch(
              `need/delete/needId=${need.id}`,
              {},
              config,
            );
            console.log(deleteData);
          }
        }
        console.log('You will see this message every Querter');
      } catch (e) {
        console.log({ e });
      }
    },
    null,
    false,
    'America/Los_Angeles'
  );

  job.start(userInfo);
}
