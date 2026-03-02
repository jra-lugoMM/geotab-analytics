import GeotabService from '../services/geotab';

class DriversController {
  public getDrivers = async (req: any, res: any) => {
    try {
      const geotabService = new GeotabService();
      const data = await geotabService.getDrivers();

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  public getKPIs = async (req: any, res: any) => {
    try {
      const geotabService = new GeotabService();
      //   const data = await geotabService.getKPIs();

      res.status(200).json({
        success: true,
        data: [
          {
            id: 'D-102',
            name: 'Juan Pérez',
            exceptions: 24,
            rating: 65,
            status: 'Riesgo',
          },
        ],
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
}

export default new DriversController();
