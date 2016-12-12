export default function deprecated (context, oldUsage, newUsage ) {
  const location = context.localName ? context.localName : String(context);
  console.warn(`${location} ${oldUsage} is deprecated. Use ${newUsage}.`);
}
