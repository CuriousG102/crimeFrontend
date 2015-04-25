var InteractiveController = {
    MILLISECONDS_IN_A_DAY:  24 * 60 * 60 * 1000,
    DAYS_IN_THE_PAST: 500,
    slider: null,

    setup: function() {
        this.slider = $("#slider");
        var MILLISECONDS_IN_THE_PAST = this.DAYS_IN_THE_PAST * this.MILLISECONDS_IN_A_DAY;
        console.log(new Date(Date.now() - MILLISECONDS_IN_THE_PAST));
        console.log(new Date());
        this.slider.dateRangeSlider(
            {
                bounds: { // future improvement: account for timezone in setting bounds
                    min:  new Date(Date.now() - MILLISECONDS_IN_THE_PAST),
                    max: new Date()
                },
                step: {
                    days:1
                },
                range: {
                    min: {days: 2},
                    max: {days: 30}
                },
                formatter: function(val) {
                    var day = val.getDate(),
                        month = val.getMonth(),
                        year = val.getFullYear();
                    var MONTHS = ["Jan.", "Feb.", "March", "April",
                                  "May", "June", "July", "Aug.", "Sep.",
                                  "Oct.", "Nov.", "Dec."];
                    return MONTHS[month] + " " + day + ", " + year;
                }
            }
        );
    },

};
var missionControl;

$().ready(function () {
    missionControl = Object.create(InteractiveController);
    missionControl.setup(); 
});