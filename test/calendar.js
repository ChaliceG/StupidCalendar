var Calendar = require('../src/calendar');
var chai = require('chai');
var Util = require('util');

chai.should();


describe('cutMonthRanges', function () {
    it('takes a start and end date and returns an array of month ranges',
        function () {
            var start = new Date('2016-06-02');
            var end = new Date('2016-08-12');

            Calendar.cutMonthRanges(start, end)
                .should.have.property('length')
                .equal(3);
    });
});

describe('cutWeekRanges', function () {
    it('takes a month range and returns an array of week ranges',
        function () {
            var start = new Date('Wed Jun 01 2016 00:00:00 GMT-0700 (PDT)'),
                end = new Date('Thu Jun 30 2016 00:00:00 GMT-0700 (PDT)');

            Calendar.cutWeekRanges(start, end)
                .should.have.property('length')
                .equal(5);//week test but meh
        });
});

describe('populateDays', function () {
    it('takes a start and end and returns an array of the days inbetween',
        function () {
            var start = new Date('start: Wed Jun 01 2016 00:00:00 GMT-0700 (PDT)'),
                end = new Date('Sat Jun 04 2016 00:00:00 GMT-0700 (PDT)');

            Calendar.populateDays(start, end)
                .should.have.property('length')
                .equal(4);
    });
});

describe('testing', function () {
    it('blah', function () {
        var d = new Date('Thu Jun 30 2016 00:00:00 GMT-0700 (PDT)');
        var x = new Date(d.getYear(), d.getMonth(), d.getDay() + 12)
        //console.log(x.getDate());
    });
    it('should do some serious shit', function () {
        var start = new Date('2016-06-02');
        var end = new Date('2016-08-12');

        var x = Calendar.build(start, end);

        console.log(JSON.stringify(x));
    });
});
