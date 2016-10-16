export default fn => (fn || '').toString().indexOf(['native code']) > -1;
