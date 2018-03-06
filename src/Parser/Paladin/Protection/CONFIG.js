import { Noichxd, Yajinni } from 'MAINTAINERS';
import SPECS from 'common/SPECS';

import CombatLogParser from './CombatLogParser';
import CHANGELOG from './CHANGELOG';

export default {
  spec: SPECS.PROTECTION_PALADIN,
  maintainers: [Yajinni, Noichxd],
  patchCompatibility: '7.3.5', // no changelog so no clue
  changelog: CHANGELOG,
  parser: CombatLogParser,
  path: __dirname, // used for generating a GitHub link directly to your spec
};
