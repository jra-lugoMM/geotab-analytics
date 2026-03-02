import GeotabClient from '../services/geotab/client';

class AuthController {
  public get = async (req: any, res: any) => {
    try {
      const { userName, password, database } = req.body;
      const geotabClient = new GeotabClient({
        userName,
        password,
        database,
        serverPath: 'my.geotab.com',
      });

      const data = await geotabClient.call('Authenticate', { database, userName, password });
      res.status(200).json({
        success: true,
        token: data.credentials.sessionId,
        user: { name: userName, database },
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
}

export default new AuthController();
