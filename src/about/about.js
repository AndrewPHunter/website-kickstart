import '../styles/site.common.scss';
import App from './app/about.app';

$(async ()=>{
  const appContainer = $('#app');
  const app = await App.init(appContainer);
  appContainer.empty();
  app.run();
});
