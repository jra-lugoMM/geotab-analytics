import GeotabService from './geotab';
import { TripInterface, StatusDataInterface, DeviceInterface } from '../types/geotab';
import _ from 'lodash';

export default class Service {
  private geotabService: GeotabService;

  constructor() {
    this.geotabService = new GeotabService();
  }

  getDevices = async (): Promise<any> => {
    return await this.geotabService.getDevices();
  };

  getTrips = async (): Promise<any> => {
    return await this.geotabService.getTrips();
  };

  getStatusData = async (): Promise<any> => {
    return await this.geotabService.getStatusData();
  };

  getfuelEfficiency = async (): Promise<any> => {
    const [devices, statusData, trips] = await Promise.all([this.getDevices(), this.getStatusData(), this.getTrips()]);

    const fuelEfficiency = _.map(devices, device => {
      const deviceId = device.id;
      const trip = trips[deviceId] as TripInterface | undefined;
      const fuelEntry = statusData[0][deviceId] as StatusDataInterface | undefined;
      const idlingFuelEntry = statusData[1][deviceId] as StatusDataInterface | undefined;
      const fuelLevelEntry = statusData[2][deviceId] as StatusDataInterface | undefined;

      const distance = Math.max(0, Number(trip?.distance || 0));
      const fuelUsed = Math.max(0, Number(fuelEntry?.data || 0));
      const idlingFuelUsed = Math.max(0, Number(idlingFuelEntry?.data || 0));
      const fuelLevel = Math.max(0, Number(fuelLevelEntry?.data || 0));
      const safeIdling = idlingFuelUsed || 1;
      const safeFuel = fuelUsed || 1;

      const co2Factor = 2.38;
      const fuelPrice = 21;

      const co2 = Math.max(0, (fuelUsed * co2Factor) / 1000);
      const fuelTotalPrice = Math.max(0, safeFuel * safeIdling * fuelPrice);
      const performance = fuelUsed > 0 ? Math.max(0, distance / fuelUsed) : 0;

      return {
        ...device,
        distance: distance,
        idleFuelUsed: idlingFuelUsed,
        fuelUsed: fuelUsed,
        co2: co2,
        performance: performance,
        idlingTime: Math.max(0, Number(trip?.idlingHours || 0)),
        drivingTime: Math.max(0, Number(trip?.drivingHours || 0)),
        fuelPrice: fuelTotalPrice,
        fuelLevel: fuelLevel,
      };
    });

    const totalCo2 = fuelEfficiency.reduce((sum: number, v: any) => sum + v.co2, 0);
    const totalIdling = fuelEfficiency.reduce((sum: number, v: any) => sum + v.idlingTime, 0);
    const totalPrice = fuelEfficiency.reduce((sum: number, v: any) => sum + v.fuelPrice, 0);

    return { data: fuelEfficiency, kpis: { totalCo2, totalIdling, totalPrice } };
  };

  getfuelEfficiencyKPIs = async (): Promise<any> => {
    const fuelEfficiency = await this.getfuelEfficiency();
    const totalCo2 = fuelEfficiency.reduce((sum: number, v: any) => sum + v.co2, 0);
    const totalIdling = fuelEfficiency.reduce((sum: number, v: any) => sum + v.idlingTime, 0);
    const totalPrice = fuelEfficiency.reduce((sum: number, v: any) => sum + v.fuelPrice, 0);

    return { totalCo2, totalIdling, totalPrice };
  };
}
