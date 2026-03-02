export interface TripInterface {
  deviceId?: string;
  driver: string;
  distance: number;
  drivingHours: number;
  idlingHours: number;
  maximumSpeed: number;
  stopHours: number;
}

export interface RawTripInterface {
  deviceId: string;
  driver: string;
  distance: number;
  drivingDuration: string;
  idlingDuration: string;
  maximumSpeed: number;
  stopDuration: number;
}

export interface DeviceInterface {
  id: string;
  name: string;
  serialNumber: string;
  vin: string;
  plate: string;
  groupsId: string[];
}

export interface DriversInterface {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
}

export interface GroupsInterface {
  id: string;
  name: string;
  children: string;
}

export interface StatusDataInterface {
  deviceId: string;
  data: number;
}

export interface DeviceStatusInfoInterface {
  deviceId: string;
  driverId: string;
  lastUpdate: string;
  latitude: number;
  longitude: number;
  speed: number;
}

export interface GeotabDataPayload {
  devices: DeviceInterface[];
  statusData: Record<string, StatusDataInterface>;
  trips: Record<string, TripInterface>;
  groups: GroupsInterface[];
  drivers: DriversInterface[];
  deviceStatusInfo: Record<string, DeviceStatusInfoInterface>;
}
