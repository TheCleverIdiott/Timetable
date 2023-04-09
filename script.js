window.onload = function() {
    config.load_data();
	translator.translate_ui();
	
	dom_setup();
	add_navigation_events();
	timetable.display_current();



	function dom_setup() {
		create_header_buttons();
		fill_periods_container();
		create_subject_divs();
		
		
		function create_header_buttons() {
			var header = document.getElementsByTagName("header")[0];
			var counter = 0;
		
		
			for (entry of config.data.timetable) {
				var new_button = document.createElement("button");
			
				new_button.innerText = entry.day.substring(0,2);
				new_button.setAttribute("data-dayNumber", counter);
			
			
				new_button.addEventListener("click", function(e) {
					var header_buttons = document.querySelectorAll("header > button");
			
					for (button of header_buttons) {
						button.classList.remove("open");
					}

					e.target.classList.add("open");

					timetable.display_for_day(e.target.getAttribute("data-dayNumber"));
				});
			
			
				header.append(new_button);
				counter++;
			}
		}


		function fill_periods_container() {
			var periods_container = document.getElementById("periods_container");
		
			for (period of config.data.periods) {
				periods_container.innerHTML += 
					"<div class='period'>" +
						`<span>${period.start}</span>` +
						`<span>${period.end}</span>` +
					"</div>";
			}
		}


		function create_subject_divs() {
			var subjectsContainer = document.getElementById("subjects_container");

			for (let i = 0; i < config.data.periods.length; i++) {
				var subjectDiv = document.createElement("div");

				subjectDiv.classList.add("subject");
				subjectDiv.classList.add("hidden");
				subjectDiv.style.transitionDelay = i*0.025 + "s";

				subjectDiv.innerHTML = "<span></span><span></span>";

				subjectsContainer.append(subjectDiv);
			}
		}
	}
	
	
	
	function add_navigation_events() {
		add_swipe_events();
		add_keyboard_events();
		
	
		function add_swipe_events() {
			var timetable_div = document.getElementById("timetable");
	
			timetable_div.ontouchstart = function(e_start) {
				var touch_start_position = e_start.touches[0].clientX;

				timetable_div.ontouchmove = function(e_end) {
					var touch_end_position = e_end.touches[0].clientX;

					if (touch_start_position < touch_end_position - 75) {
						timetable_div.ontouchmove = null;
						timetable.display_previous_day();
					}
					else if (touch_start_position > touch_end_position + 75) {
						timetable_div.ontouchmove = null;
						timetable.display_next_day();
					}
				};
			};
		}
	
	
		function add_keyboard_events() {
			window.addEventListener("keydown", function(e) {
				if (e.keyCode == 37) {
					timetable.display_previous_day();
				}
				else if (e.keyCode == 39) {
					timetable.display_next_day();
				}
			});
		}
	}
};



var timetable = {
	currently_shown_day_number: 0,

	display_for_day: function(dayNumber) {
		timetable.currently_shown_day_number = dayNumber;
	
		timetable.subject_divs.hide();

		setTimeout(function() {
			timetable.subject_divs.fill(dayNumber);
			timetable.subject_divs.show();
		}, 450);
	},
	
	
	display_current: function() {
		var d = new Date();
		dayNumber = (d.getDay() != 0) ? d.getDay() - 1 : 6;

		var header_buttons = document.querySelectorAll("header > button");

		if (dayNumber >= config.data.timetable.length) {
			header_buttons[0].classList.add("open");
			timetable.display_for_day(0);
		}
		else {
			header_buttons[dayNumber].classList.add("open");
			timetable.display_for_day(dayNumber);
		}
	},
	
	
	display_previous_day: function() {
		var previous_day_number;
		var header_buttons = document.querySelectorAll("header > button");
		
		if (timetable.currently_shown_day_number != 0) {
			previous_day_number = parseInt(timetable.currently_shown_day_number) - 1;
			header_buttons[previous_day_number].click();
		}
	},
	
	
	display_next_day: function() {
		var next_day_number;
		var header_buttons = document.querySelectorAll("header > button");
	
		if (timetable.currently_shown_day_number != config.data.timetable.length - 1) {
			next_day_number = parseInt(timetable.currently_shown_day_number) + 1;
			header_buttons[next_day_number].click();
		}
	},
	
	
	subject_divs: {
		fill: function (dayNumber) {
			var subject_divs = document.querySelectorAll(".subject");

			//for (let period = 0; period < config.data.timetable[dayNumber].schedule.length; period++) {
			for (let period = 0; period < config.data.timetable[dayNumber].schedule.length && period < config.data.periods.length; period++) {
				var subject_name = config.data.timetable[dayNumber].schedule[period].subject;
				var subject_room = config.data.timetable[dayNumber].schedule[period].room;

				if (subject_name != "") {
					subject_divs[period].classList.remove("empty");

					if (typeof config.data.colors[subject_name] != "undefined") {
						subject_divs[period].style.color = config.data.colors[subject_name];
					}
					else {
						subject_divs[period].style.color = "#000";
					}

					subject_divs[period].querySelectorAll("span")[0].innerText = subject_name;
					subject_divs[period].querySelectorAll("span")[1].innerText = subject_room;
				}
				else {
					subject_divs[period].classList.add("empty");
				}
			}
		},
		
		
		show: function() {
			var subject_divs = document.querySelectorAll(".subject");

			for (div of subject_divs) {
				div.classList.remove("hidden");
			}
		},
		
		
		hide: function() {
			var subject_divs = document.querySelectorAll(".subject");

			for (div of subject_divs) {
				div.classList.add("hidden");
			}
		}
	}
};
