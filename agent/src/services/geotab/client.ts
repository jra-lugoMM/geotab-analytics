import MyGeotabApi from 'mg-api-js';

class GeotabClient {
  public api: any;

  constructor({ userName, password, database, serverPath }: any) {
    this.api = new MyGeotabApi({
      credentials: { userName, password, database },
      path: serverPath,
      options: {
        timeout: 30000,
      },
    });
  }

  async call(method: string, params: any = {}): Promise<any> {
    return this.api.call(method, params);
  }

  async multiCall(calls: any[]): Promise<any> {
    return this.api.multiCall(calls);
  }
}

export default GeotabClient;
