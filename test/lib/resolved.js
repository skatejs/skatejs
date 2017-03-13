import { created as $created } from 'src/util/symbols';

export default function resolved (elem) {
  return elem[$created];
}
