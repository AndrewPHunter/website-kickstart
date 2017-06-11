import 'babel-polyfill';
import 'whatwg-fetch';
import 'jqcloud2';
import 'jqcloud2/dist/jqcloud.css';

export default class App{
  constructor($elem){
    this.$elem = $elem;
  }
  static async init($elem){
    const trend =  new App($elem);
    trend.data = trend.processData(await trend.loadData());
    return trend;
  }

  static delay(interval){
    return new Promise(r=>setTimeout(r,interval));
  }

  run(){
    this.$elem.jQCloud(this.data, {
      width:700,
      height:400,
      fontSize:{
        from: 0.1,
        to:0.02
      }
    });
    this.updateLoop();
  }

  async updateLoop(){
    while(true){ //eslint-disable-line
      await App.delay(10000);
      this.data = this.processData(await this.loadData());
      this.$elem.jQCloud('update', this.data);
    }
  }

  loadData(){
    const headers = new Headers({
      "Accept":"application/vnd.github.mercy-preview+json"
    });
    const init = {
      method: 'GET',
      headers: headers,
      mode: 'cors',
      cache: 'no-cache'
    };

    const url = 'https://api.github.com/search/repositories?q=language:javascript';

    return fetch(url, init)
      .then(response=>response.json());
  }

  processData(data){
    return data.items.map(item=>{
      return {
        text: item.name,
        weight: item.watchers
      };
    });
  }
}
