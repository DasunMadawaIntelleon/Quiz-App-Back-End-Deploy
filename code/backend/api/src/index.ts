import app from './app';
import logger from './core/utils/logger';
const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.info(`Server running on http://localhost:${port}`);
});
