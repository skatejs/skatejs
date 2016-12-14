let environment = process && process.env ? process.env.NODE_ENV : null;
if (!environment) {
  environment = 'production';
}
// IE doesn't support 'startsWith'
const isProduction = environment.toLowerCase().indexOf('prod') === 0;
export default isProduction;
