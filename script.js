/**
 * Created by Travis on 7/20/2016.
 */
$(document).ready(function(){
    (function(){

        var pomodoro = {

            break : [5],
            session: [25],
            primary: [25, ":", 0, 0],
            toggleFlag : 0,
            displayToggle : 0,
            timer : 0,

            init : function(){
                this.cacheDom();
                this.bindEvents();
            },

            cacheDom : function(){
                this.$el = $("#clock-backing");
                this.$sessionPlus = this.$el.find("#session-plus");
                this.$sessionMinus = this.$el.find("#session-minus");
                this.$sessionDisplay = this.$el.find("#session-display");
                this.$breakPlus = this.$el.find("#break-plus");
                this.$breakMinus = this.$el.find("#break-minus");
                this.$breakDisplay = this.$el.find("#break-display");
                this.$primaryToggle = this.$el.find("#primary-toggle");
                this.$primaryReset = this.$el.find("#primary-reset");
                this.$primaryDisplay = this.$el.find("#primary-display");
                this.$indicator = this.$el.find("#indicator");
            },

            bindEvents : function(){
                this.$sessionPlus.on("click", {array: this.session, display : this.$sessionDisplay, direction : 1}, this.setTimers.bind(this));
                this.$sessionMinus.on("click", {array: this.session, display : this.$sessionDisplay, direction : -1}, this.setTimers.bind(this));
                this.$breakPlus.on("click", {array: this.break, display : this.$breakDisplay, direction : 1}, this.setTimers.bind(this));
                this.$breakMinus.on("click", {array: this.break, display : this.$breakDisplay, direction : -1}, this.setTimers.bind(this));
                this.$primaryToggle.on("click", this.toggleTimerPlay.bind(this));
                this.$primaryReset.on("click", this.resetTimer.bind(this));
            },

            render : function(display, array){
                display.html(array);
            },

            setTimers : function(event){
                if((event.data.array == this.session) && (this.session[0] >= 0)){
                    console.log(1);
                    if(this.session[0] == 0 && event.data.direction == -1){
                        this.render(this.$sessionDisplay, this.session);
                    } else if(this.toggleFlag == 0) {
                        this.session[0] = this.session[0] + event.data.direction;
                        var display = this.$sessionDisplay;
                        this.render(display, this.session);
                            if(this.displayToggle == 0) {
                                this.primary = [this.session[0], ":", 0, 0];
                                this.render(this.$primaryDisplay, this.primary);
                            }
                    }

                } else if ((event.data.array == this.break) && (this.break[0] >= 0)){
                    if(this.break[0] == 0 && event.data.direction == -1){
                        this.render(this.$breakDisplay, this.break);
                    } else if(this.toggleFlag == 0){
                        this.break[0] = this.break[0] + event.data.direction;
                        var display = this.$breakDisplay;
                        this.render(display, this.break);
                            if(this.displayToggle == 1){
                                this.primary = [this.break[0], ":", 0, 0];
                                this.render(this.$primaryDisplay, this.primary);
                            }
                    }
                }
            },

            startTimer : function(duration) {
                console.log(3);
                var time = duration;

                this.timer = setInterval(function() {

                    console.log(4);

                    var minutes = parseInt(time / 60, 10);
                    var seconds = parseInt(time % 60, 10);

                    minutes = minutes < 10 ? "0" + minutes : minutes;
                    seconds = seconds < 10 ? "0" + seconds : seconds;

                    console.log(minutes);

                    pomodoro.primary = [minutes, ":", seconds];
                    pomodoro.render(pomodoro.$primaryDisplay, pomodoro.primary);

                    if (--time < 0) {
                        if(pomodoro.displayToggle == 0){
                            pomodoro.displayToggle = 1;
                        } else if(pomodoro.displayToggle == 1){
                            pomodoro.displayToggle = 0;
                        }
                        pomodoro.switchDisplay();
                    }
                }, 1000);
            },

            toggleTimerPlay : function(){
                if(this.toggleFlag === 0) {
                    console.log(1);
                    if(this.displayToggle === 0) {
                        console.log(2);
                        var duration = (((this.session - (this.session - this.primary[0])) * 60) + this.primary[2]);
                        console.log(duration);
                        this.toggleFlag = 1;
                        this.startTimer(duration);
                    } else if(this.displayToggle === 1){
                        duration = (((this.break - (this.break - this.primary[0])) * 60) + this.primary[2]);
                        this.toggleFlag = 1;
                        this.startTimer(duration);
                    }
                } else if(this.toggleFlag === 1){
                    clearInterval(this.timer);
                    this.toggleFlag = 0;
                }
            },

            switchDisplay : function(){
                this.alertUser();
                if(this.displayToggle === 0){
                    clearInterval(this.timer);
                    var duration = (this.session * 60);
                    this.startTimer(duration);
                } else if(this.displayToggle === 1){
                    clearInterval(this.timer);
                    duration = (this.break * 60);
                    this.startTimer(duration);
                }
            },

            resetTimer : function(){
                clearInterval(this.timer);
                this.break = [5];
                this.session = [25];
                this.primary = [this.session[0], ":", 0, 0];
                console.log(this.primary);
                this.render(this.$sessionDisplay, this.session);
                this.render(this.$breakDisplay, this.break);
                this.render(this.$primaryDisplay, this.primary);
                this.toggleFlag = 0;
                this.displayToggle = 0;
                this.$sessionPlus.on("click", {array: this.session, display : this.$sessionDisplay, direction : 1}, this.setTimers.bind(this));
                this.$sessionMinus.on("click", {array: this.session, display : this.$sessionDisplay, direction : -1}, this.setTimers.bind(this));
                this.$breakPlus.on("click", {array: this.break, display : this.$breakDisplay, direction : 1}, this.setTimers.bind(this));
                this.$breakMinus.on("click", {array: this.break, display : this.$breakDisplay, direction : -1}, this.setTimers.bind(this));
                this.alertUser();
            },

            alertUser : function(){
                if(this.displayToggle == 0){
                    $('#main').css('background-color', "#b9d2ff");
                    this.$indicator.html("Session");
                } else if(this.displayToggle == 1){
                    $('#main').css('background-color', "#DABFA1");
                    this.$indicator.html("Break");
                }

            }

        };
        pomodoro.init();
    })();
});