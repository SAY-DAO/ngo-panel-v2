export default function swDev() {
  console.log('initiating service worker...');
  const swUrl = `public/serviceWorker.js`;
  console.log(`swurl = ${swUrl}`);
  const env = process.env.REACT_APP_NODE_ENV;

  if (env !== 'development' && 'serviceWorker' in navigator) {
    navigator.serviceWorker
      .register(swUrl)
      .then((reg) => console.log('success: ', reg.scope))
      .catch((err) => console.log('Failure: ', err));
  }else{
    console.log('SERVICE WORKER IS NOT RUNNING!!')
  }
}
