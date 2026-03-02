import Service from '../services';

class VehiclesController {
  public getDevices = async (req: any, res: any) => {
    try {
      const service = new Service();
      const { data, kpis } = await service.getfuelEfficiency();

      res.status(200).json({
        success: true,
        data,
        kpis,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  public getKPIs = async (req: any, res: any) => {
    try {
      const service = new Service();
      const data = await service.getfuelEfficiencyKPIs();

      res.status(200).json({
        success: true,
        data: {
          fuelEfficiency: { value: '14.2 km/l', trend: '+2.4% vs mes anterior' },
          co2Reduction: { value: '2.4 ton', trend: 'Objetivo: 3.0 ton' },
          activeAlerts: { value: 3, trend: 'Requieren atención' },
        },
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
}

export default new VehiclesController();
