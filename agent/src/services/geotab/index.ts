import GeotabClient from './client';
import GeotabRepository from './repository';
import GeotabHelper from './helper';

import { config } from '../../config';
import { RawTripInterface } from 'src/types/geotab';
import readGeotabConfig from '../../utils/reader.util';

import _ from 'lodash';
import { DateTime } from 'luxon';

class GeotabService {
  private repo: GeotabRepository;
  private helper: GeotabHelper;
  private fromDate: string;
  private toDate: string;

  constructor() {
    const client = new GeotabClient({
      userName: config.GO_USER,
      password: config.GO_PASS,
      database: config.GO_DATABASE,
      serverPath: config.GO_SERVER,
    });

    this.repo = new GeotabRepository(client);
    this.helper = new GeotabHelper();
    this.fromDate = DateTime.now().toUTC().minus({ days: 7 }).startOf('day').toFormat('yyyy-MM-dd hh:mm:ss');
    this.toDate = DateTime.now().toUTC().endOf('day').toFormat('yyyy-MM-dd hh:mm:ss');
  }

  getData = async (): Promise<any> => {
    const trips = await this.getTrips();

    const [statusData, devices, deviceStatusInfo, groups, drivers] = await Promise.all([
      this.getStatusData(),
      this.getDevices(),
      this.getDeviceStatusInfo(),
      this.getGroups(),
      this.getDrivers(),
    ]);

    return { devices, statusData, trips, groups, drivers, deviceStatusInfo };
  };

  getDevices = async (): Promise<any> => {
    const data = await this.repo.getDevices();
    const devices = this.helper.mapDevices(data);
    return devices;
  };

  getDeviceStatusInfo = async (): Promise<any> => {
    const data = await this.repo.getDeviceStatusInfo();
    const deviceStatusInfo = this.helper.mapDeviceStatusInfo(data);
    return deviceStatusInfo;
  };

  getStatusData = async (): Promise<any[]> => {
    const geotabConfig = await readGeotabConfig();
    const diagnosticIds = geotabConfig.diagnostics;

    const dataSets = await this.repo.getStatusData({
      fromDate: this.fromDate,
      toDate: this.toDate,
      diagnosticIds,
    });

    return dataSets.map((dataset: any) => {
      const groupedData = this.helper.mapStatusData(dataset);

      return _.mapValues(groupedData, (records: any[]) => {
        if (!records || records.length === 0) return null;

        const latest = _.head(records);
        const earliest = _.last(records);

        return {
          deviceId: latest.deviceId,
          data: latest.data - earliest.data,
        };
      });
    });
  };

  getTrips = async (): Promise<any> => {
    const start = DateTime.fromSQL(this.fromDate, { zone: 'utc' });
    const end = DateTime.fromSQL(this.toDate, { zone: 'utc' });

    const mid = start.plus({ hours: 12 });

    const [firstHalf, secondHalf] = await Promise.all([
      this.repo.getTrips({ fromDate: start.toFormat('yyyy-MM-dd hh:mm:ss'), toDate: mid.toFormat('yyyy-MM-dd hh:mm:ss') }),
      this.repo.getTrips({ fromDate: mid.toFormat('yyyy-MM-dd hh:mm:ss'), toDate: end.toFormat('yyyy-MM-dd hh:mm:ss') }),
    ]);

    const data = [...firstHalf, ...secondHalf];
    const trips = this.helper.mapTrips(data);

    const tripsByDevice = _.chain(trips)
      .mapValues((deviceTrips: RawTripInterface[]) => {
        const distance = _.sumBy(deviceTrips, 'distance');
        const { maximumSpeed } = _.maxBy(deviceTrips, 'maximumSpeed');

        const idlingHours = _.sumBy(deviceTrips, ({ idlingDuration }) => {
          const [hh, mm, ss] = idlingDuration.split(':').map(Number);
          return hh + mm / 60 + ss / 3600;
        });

        const drivingHours = _.sumBy(deviceTrips, ({ drivingDuration }) => {
          const [hh, mm, ss] = drivingDuration.split(':').map(Number);
          return hh + mm / 60 + ss / 3600;
        });

        const stopHours = Math.max(24 - drivingHours, 0);
        return { distance, maximumSpeed, idlingHours, drivingHours, stopHours };
      })
      .value();

    return tripsByDevice;
  };

  getGroups = async (): Promise<any> => {
    const data = await this.repo.getGroups();
    const groups = this.helper.mapGroups(data);
    return groups;
  };

  getDrivers = async (): Promise<any> => {
    const search = { isDriver: true };
    const data = await this.repo.getUsers(search);
    const drivers = this.helper.mapDrivers(data);
    return drivers;
  };

  getExceptionEvents = async (ruleIds: string[]): Promise<any> => {
    return await this.repo.getExceptionEvents({ fromDate: this.fromDate, toDate: this.toDate, ruleIds });
  };
}

export default GeotabService;
