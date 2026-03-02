import app from './config/server';
import { config } from './config';

const main = async () => {
  try {
    app.listen(config.PORT, () => console.log(`Server listening on port ${config.PORT}`));
  } catch (error) {
    process.exit(1);
  }
};

main();
