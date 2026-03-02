import _ from 'lodash';

class GeotabHelper {
  constructor() {}

  mapDevices = (data: any): any => {
    return _.chain(data)
      .map(device => ({
        id: device.id,
        name: device.name,
        serialNumber: device.serialNumber || null,
        vin: device.vehicleIdentificationNumber || null,
        plate: device.licensePlate || null,
        groupsId: device.groups?.map((g: any) => g.id) || [],
      }))
      .keyBy('id')
      .value();
  };

  mapDeviceStatusInfo = (data: any): any => {
    return _.chain(data)
      .map(status => ({
        deviceId: status.device.id,
        driverId: status.driver.id,
        lastUpdate: status.dateTime,
        latitude: status.latitude,
        longitude: status.longitude,
        speed: status.speed,
      }))
      .keyBy('deviceId')
      .value();
  };

  mapDrivers = (data: any): any => {
    return _.chain(data)
      .map(driver => ({
        id: driver.id,
        name: driver.name,
        firstName: driver.firstName || null,
        lastName: driver.lastName || null,
      }))
      .keyBy('id')
      .value();
  };

  mapGroups = (data: any): any => {
    return _.chain(data)
      .map((group: any) => ({
        id: group.id,
        name: group.name.replace(/[\\+/{}|]/gi, '') || '',
        children: group.children.map((g: any) => g.id),
      }))
      .value();
  };

  mapStatusData = (data: any): any => {
    return _.chain(data)
      .map(status => ({
        deviceId: status.device.id,
        data: status.data,
        dateTime: status.dateTime,
      }))
      .orderBy('dateTime', 'desc')
      .groupBy('deviceId')
      .value();
  };

  mapTrips = (data: any): any => {
    return _.chain(data)
      .map(trip => ({
        deviceId: trip.device.id,
        driver: trip.driver || 'UnknownDriverId',
        distance: trip.distance,
        drivingDuration: trip.drivingDuration,
        idlingDuration: trip.idlingDuration,
        maximumSpeed: trip.maximumSpeed,
        stopDuration: trip.stopDuration,
      }))
      .groupBy('deviceId')
      .value();
  };
}

export default GeotabHelper;
