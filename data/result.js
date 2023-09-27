"use strict";

export function constructResult(resultData) {
    const resultObject = {
        memberId: resultData.memberId,
        date: resultData.date,
        discipline: resultData.discipline,
        resultType: resultData.resultType,
        time: resultData.time,

        timeToMilliSec() {
            const minuteParts = resultData.time.split(':');
            const minutes = parseInt(minuteParts[0], 10);

            const secondsAndMillisecondsParts = minuteParts[1].split('.');
            const seconds = parseInt(secondsAndMillisecondsParts[0]);
            const milliseconds = parseInt(secondsAndMillisecondsParts[1]);

            const totalTimeInMilliseconds = (minutes * 60 + seconds) * 1000 + milliseconds;

            return totalTimeInMilliseconds;
        }

    }

    resultObject.time = resultObject.timeToMilliSec();

    return resultObject;
}