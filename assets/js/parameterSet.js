class Parameter {
    constructor(name, value, changed){
        this.name = name;
        this.value = value;
        this.changed = changed;
    }
    name;
    value;
    changed;
}

class ParameterSet {
    //Strap Feed Parameters
    strapFeedSpeedFast;
    strapFeedSpeedSlow;
    strapBackSpeedFast;
    strapBackSpeedSlow;
    distanceToSlowFeed;
    distanceToSlowRetract;
    timeToSlowRetract;
    timeToSlowFeed;
    //Refeed Parameters
    minStrapLength;
    timeRefeedBackwards;
    maxStrapLength;
    timeRefeedForwards;
    numberOfRefeeds;
    //Tension and Sealing Parameters
    tensionTime;
    tensionRockerDelay;
    tensionBreakTime;
    numberOfTensionCycles;
    tensionReliefTime;
    coolingTime;
    closeHeadDelay;
    //Runtime Monitoring Timers
    totalCycleRuntime;
    strapFeedRuntime;
    strapBackRuntime;
    tensionRuntime;
    camRuntime;
    heaterRuntime;
    //Heater Parameters
    basicTemperature;
    cleaningTemperature;
    strapsUntilCleaning;
    //Mode Parameters
    backWithTensionMotorMode;
    refeedMode;
    cyclePrepareMode;
    cyclicTensioningMode;
    autoCleanMode;
    headRemainOpenMode;
    revStopMode;
}