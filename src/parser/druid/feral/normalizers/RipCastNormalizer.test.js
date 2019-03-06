import SPELLS from 'common/SPELLS';

import RipCastNormalizer from './RipCastNormalizer';

describe('Druid/Feral/Normalizers/RipCastNormalizer', () => {
  // result for each scenario is what (if any) castEvent property each event should have after normalization
  const scenarios = [
    {
      it: 'labels applydebuff with Rip as castEvent',
      playerId: 1,
      events: [
        { testid: 1, timestamp: 1, sourceID: 1, targetID: 1, ability: { guid: SPELLS.RIP.id }, type: 'cast' },
        { testid: 2, timestamp: 1, sourceID: 1, targetID: 1, ability: { guid: SPELLS.RIP.id }, type: 'applydebuff' },
      ],
      result: [null, 1],
    },
    {
      it: 'labels applydebuff with Primal Wrath as castEvent',
      playerId: 1,
      events: [
        { testid: 1, timestamp: 1, sourceID: 1, targetID: 1, ability: { guid: SPELLS.PRIMAL_WRATH_TALENT.id }, type: 'cast' },
        { testid: 2, timestamp: 1, sourceID: 1, targetID: 1, ability: { guid: SPELLS.RIP.id }, type: 'applydebuff' },
      ],
      result: [null, 1],
    },
    {
      it: 'labels multiple applydebuff for Primal Wrath',
      playerId: 1,
      events: [
        { testid: 1, timestamp: 1, sourceID: 1, targetID: 1, ability: { guid: SPELLS.PRIMAL_WRATH_TALENT.id }, type: 'cast' },
        { testid: 2, timestamp: 1, sourceID: 1, targetID: 1, ability: { guid: SPELLS.RIP.id }, type: 'applydebuff' },
        { testid: 3, timestamp: 1, sourceID: 1, targetID: 2, ability: { guid: SPELLS.RIP.id }, type: 'applydebuff' },
        { testid: 4, timestamp: 1, sourceID: 1, targetID: 3, ability: { guid: SPELLS.RIP.id }, type: 'applydebuff' },
      ],
      result: [null, 1, 1, 1],
    },
    { // this test will currently fail, as we don't keep track of separate "most recent cast" events for each source. TODO: do that.
      it: 'handles multiple sources correctly',
      playerId: 1,
      events: [
        { testid: 1, timestamp: 1, sourceID: 1, targetID: 1, ability: { guid: SPELLS.RIP.id }, type: 'cast' },
        { testid: 1, timestamp: 1, sourceID: 2, targetID: 1, ability: { guid: SPELLS.RIP.id }, type: 'cast' },
        { testid: 2, timestamp: 1, sourceID: 1, targetID: 1, ability: { guid: SPELLS.RIP.id }, type: 'applydebuff' },
        { testid: 2, timestamp: 1, sourceID: 2, targetID: 1, ability: { guid: SPELLS.RIP.id }, type: 'applydebuff' },
      ],
      result: [null, null, 1, 2],
    },
    // test for: mismatched sourceID, mismatched targetID on rip, mismatched targetID on primal wrath (should still work), multiple casts, long time delay
  ];

  scenarios.forEach(scenario => {
    it(scenario.it, () => {
      const parser = new RipCastNormalizer({});
      //expect(parser.normalize(scenario.events).map(event => event.testid)).toEqual(scenario.result);
      expect(parser.normalize(scenario.events).map(event => (event.castEvent ? event.castEvent.testid : null))).toEqual(scenario.result);
    });
  });
});
