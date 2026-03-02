import GeotabClient from './client';

class GeotabRepository {
  private client: GeotabClient;

  constructor(client: GeotabClient) {
    this.client = client;
  }

  getUsers = async (search: any): Promise<any[]> => {
    return await this.client.call('Get', { typeName: 'User', search });
  };

  getDevices = async (): Promise<any[]> => {
    const result = await this.client.call('Get', { typeName: 'Device' });
    return result;
  };

  getDeviceStatusInfo = async (): Promise<any[]> => {
    const result = await this.client.call('Get', { typeName: 'DeviceStatusInfo' });
    return result;
  };

  getStatusData = async ({ fromDate, toDate, diagnosticIds }: any): Promise<any> => {
    const calls = diagnosticIds.map((id: any) => [
      'Get',
      {
        typeName: 'StatusData',
        search: { fromDate, toDate, diagnosticSearch: { id } },
      },
    ]);

    return await this.client.multiCall(calls);
  };

  getTrips = async ({ fromDate, toDate }: any): Promise<any> => {
    return await this.client.call('Get', {
      typeName: 'Trip',
      search: { fromDate, toDate },
      propertySelector: {
        fields: ['device', 'driver', 'distance', 'drivingDuration', 'idlingDuration', 'maximumSpeed', 'stopDuration'],
      },
    });
  };

  getGroups = async (): Promise<any> => {
    return await this.client.call('Get', { typeName: 'Group' });
  };

  getExceptionEvents = async ({ fromDate, toDate, ruleIds }: any): Promise<any> => {
    const calls = ruleIds.map((id: string) => [
      'Get',
      {
        typeName: 'ExceptionEvent',
        search: { fromDate, toDate, ruleSearch: { id } },
      },
    ]);

    return await this.client.multiCall(calls);
  };

  getLatestStatusData = async (deviceIds: string[], diagnosticIds: string[]): Promise<any[]> => {
    const calls = deviceIds.flatMap(deviceId =>
      diagnosticIds.map(diagnosticId => [
        'Get',
        {
          typeName: 'StatusData',
          search: {
            deviceSearch: { id: deviceId },
            diagnosticSearch: { id: diagnosticId },
            resultsLimit: 1,
          },
        },
      ]),
    );
    return await this.client.multiCall(calls);
  };
}

export default GeotabRepository;
