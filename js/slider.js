var InteractiveController = {
    MILLISECONDS_IN_A_DAY:  24 * 60 * 60 * 1000,
    DAYS_IN_THE_PAST: 500,
    DAYS_IN_PAST_FOR_DEFAULT: 7,
    slider: null,
    clients: [],

    setup: function() {
        this.slider = $("#slider");
        var MILLISECONDS_IN_THE_PAST = this.DAYS_IN_THE_PAST * this.MILLISECONDS_IN_A_DAY;
        var MILLISECONDS_IN_THE_PAST_DEFAULT = this.DAYS_IN_PAST_FOR_DEFAULT * this.MILLISECONDS_IN_A_DAY;
        var MONTHS = ["Jan.", "Feb.", "March", "April",
                      "May", "June", "July", "Aug.", "Sep.",
                      "Oct.", "Nov.", "Dec."];
        this.slider.dateRangeSlider(
            {
                bounds: { // future improvement: account for timezone in setting bounds
                    min:  new Date(Date.now() - MILLISECONDS_IN_THE_PAST),
                    max: new Date()
                },
                defaultValues: {
                    min: new Date(Date.now() - MILLISECONDS_IN_THE_PAST_DEFAULT),
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
                    return MONTHS[month] + " " + day + ", " + year;
                },
                scales: [{
                    next: function(value) {
                        var next = new Date(value);
                        return new Date(next.setMonth(value.getMonth() + 1));
                    },
                    label: function(value) {
                        return MONTHS[value.getMonth()] + " " 
                        + value.getFullYear().toString().slice(-2);
                    }
                }]
            }
        );
        $("#updateButton").click(this.update.bind(this));
        this.update();
    },

    addClient: function(clientFunction) {
        this.clients.push(clientFunction);
    },

    update: function() {
        var dateValues = this.slider.dateRangeSlider("values");
        for (var i = 0; i < this.clients.length; i++)
            this.clients[i](dateValues.min, dateValues.max);
    }
};
var missionControl;

$().ready(function () {
    missionControl = Object.create(InteractiveController);
    missionControl.setup(); 
});