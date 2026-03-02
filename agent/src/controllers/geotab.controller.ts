import GeotabService from '../services/geotab';

class GeotabController {
  public get = async (req: any, res: any) => {
    try {
      const geotabService = new GeotabService();

      const data = await geotabService.getData();
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  public getDevices = async (req: any, res: any) => {
    try {
      const geotabService = new GeotabService();

      const data = await geotabService.getDevices();
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  public getStatusData = async (req: any, res: any) => {
    try {
      const geotabService = new GeotabService();

      const data = await geotabService.getStatusData();
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  public getDeviceStatusInfo = async (req: any, res: any) => {
    try {
      const geotabService = new GeotabService();

      const data = await geotabService.getDeviceStatusInfo();
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  public getGroups = async (req: any, res: any) => {
    try {
      const geotabService = new GeotabService();

      const data = await geotabService.getGroups();
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  public getDrivers = async (req: any, res: any) => {
    try {
      const geotabService = new GeotabService();

      const data = await geotabService.getDrivers();
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
}

export default new GeotabController();
