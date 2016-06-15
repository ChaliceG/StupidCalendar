var fs = require('fs'),
    //shh ok this is a FP thing
    //if JS had proper support for lazy sequences
    //I wouldn't have to do this
    days = [0, 1, 2, 3, 4, 5, 6],
    months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ],
    releaseData = JSON.parse(fs.readFileSync(__dirname + '/releases.json'));

function build (start, end) {
    return cutMonthRanges(start, end)
        .map(range => buildMonth(range.start, range.end));
}

function buildMonth (start, end) {
    return {
        start: start,
        end: end,
        name: months[start.getMonth()],
        weeks: cutWeekRanges(start, end)
            .map(range => buildWeek(range.start, range.end))
    };
}

function buildWeek (start, end) {
    return {
        start: start,
        end: end,
        days: populateDays(start, end)
            .map(dayDate => buildDate(dayDate))
    };
}

function buildDate (date) {
    return {
        number: date.getDay(),
        date: date.getDate(),
        releases: releaseData
            .filter(release => isReleaseOnDay(release, date))
            .sort(releaseComparator)
    }
}

function isReleaseOnDay (release, date) {
    var releaseDate = new Date(release.startDate);
    return releaseDate.getFullYear() === date.getFullYear()
        && releaseDate.getMonth() === date.getMonth()
        && releaseDate.getDate() === date.getDate();
}

function cutMonthRanges (start, end) {
    if (end < start) {
        throw "shut up go away";
        //( ͡° ͜ʖ ͡°)
    }
    var currentMonth,
        startOfNextMonth,
        endOfThisMonth,
        startOfThisMonth;
    startOfNextMonth = new Date(start.getFullYear(), start.getMonth()+ 1, 1);
    endOfThisMonth = new Date(start.getFullYear(), start.getMonth()+ 1, 0);
    startOfThisMonth = new Date(start.getFullYear(), start.getMonth(), 1);

    currentMonth = {
        start: startOfThisMonth,
        end: endOfThisMonth
    };

    if (start.getMonth() === end.getMonth()) {
        return [currentMonth];
    } else {
        return [].concat([currentMonth],
            cutMonthRanges(startOfNextMonth, end));
    }
}

function cutWeekRanges (start, end) {
    if (end < start) {
        return [];
    } else {
        var startOfNextWeek,
            endOfThisWeek,
            daysLeftInWeek;

        daysLeftInWeek = 7 - start.getDay();

        startOfNextWeek = new Date(start.getFullYear(),
            start.getMonth(),
            start.getDate() + daysLeftInWeek);

        endOfThisWeek = new Date(start.getFullYear(),
            start.getMonth(),
            start.getDate() + daysLeftInWeek - 1);

        return [].concat(
            [{
                start: start,
                end: endOfThisWeek > end ? end : endOfThisWeek
            }],
            cutWeekRanges(startOfNextWeek, end));
    }
}

function populateDays (start, end) {
    var startOfThisWeek = start.getDate() - start.getDay();
    return days.slice(start.getDay(), end.getDay() + 1)
        .map(offset =>
            new Date(start.getFullYear(),
                start.getMonth(),
                startOfThisWeek + offset)
            );
}

function releaseComparator (left, right) {
    if (left.priority && !right.priority) {
        return -1;
    }
    if (!left.priority && right.priority) {
        return 1;
    }
    if (!left.priority && !right.priority) {
        return 0;
    }
    if (left.priority > right.priority) {
        return -1;
    }
    return 1;
}

module.exports = {
    populateDays: populateDays,
    cutWeekRanges: cutWeekRanges,
    cutMonthRanges: cutMonthRanges,
    buildDate: buildDate,
    buildWeek: buildWeek,
    buildMonth: buildMonth,
    build: build
};
