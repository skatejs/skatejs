let environment = process && process.env ? process.env.NODE_ENV : null;
if (!environment) {
  environment = 'production';
}
const isProduction = environment.toLowerCase().startsWith('prod');
export default isProduction;
