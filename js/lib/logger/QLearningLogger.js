import winston from 'winston';
import FileHelper from "../../helpers/FileHelper";

export default new (winston.Logger)({
  transports: [
    new (winston.transports.File)({ filename: FileHelper.ensureExistence('logs/ai/q-learning.log')})
  ]
});