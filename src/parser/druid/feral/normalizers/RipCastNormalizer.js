import SPELLS from 'common/SPELLS/index';
import EventsNormalizer from 'parser/core/EventsNormalizer';

const CAST_WINDOW = 100;
class RipCastNormalizer extends EventsNormalizer {
  /**
   * Both Rip and Primal Wrath applies the Rip debuff. To help differentiate them this normalizer adds a castEvent property to applydebuff and refreshdebuff events caused by Rip or Primal Wrath. This is useful for determining if the Rip was caused by Primal Wrath or the regular Rip ability.
   * 
   * The events for Primal Wrath usually occur in the log like this (with the same or very close timestamps)
   *  cast primal wrath
   *  applydebuff or refreshdebuff rip (for each target)
   *  damage primal wrath (for each target)
   * 
   * The events for Rip occur in the log like this (with the same or very close timestamps)
   *  cast rip
   *  applydebuff or refreshdebuff rip
   * 
   * @param {Array} events
   * @returns {Array} Events possibly with some applydebuff and refreshdebuff events altered to have a castEvent property.
   */
  normalize(events) {
    let lastPrimalWrathCast = null;
    let lastRipCast = null;
    const fixedEvents = [];
    events.forEach((event) => {
      if (event.type === 'cast' && event.ability.guid === SPELLS.PRIMAL_WRATH_TALENT.id) {
        lastPrimalWrathCast = event;
      } else if (event.type === 'cast' && event.ability.guid === SPELLS.RIP.id) {
        lastRipCast = event;
      } else if ((event.type === 'applydebuff' || event.type === 'refreshdebuff') && event.ability.guid === SPELLS.RIP.id) {
        if (lastPrimalWrathCast && lastPrimalWrathCast.sourceID === event.sourceID && (event.timestamp - lastPrimalWrathCast.timestamp) < CAST_WINDOW) {
          event.castEvent = lastPrimalWrathCast;
          event.__modified = true;
        } else if (lastRipCast && lastRipCast.sourceID === event.sourceID && lastRipCast.targetID === event.targetID && (event.timestamp - lastRipCast.timestamp) < CAST_WINDOW) {
          event.castEvent = lastRipCast;
          event.__modified = true;
        }
      }
      fixedEvents.push(event);
    });    
    return fixedEvents;
  }
}

export default RipCastNormalizer;
