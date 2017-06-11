import '../styles/site.common.scss';
import App from './app/about.app';

$(async ()=>{
  const appContainer = $('#app');
  (await App.init(appContainer)).run();
});
