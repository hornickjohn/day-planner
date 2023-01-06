const dayStart = 9; //hours after midnight that the work day starts
var dayData;

// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  var datePicker = $('#current-day');

  //initialize datepicker on today, and load up today's info
  datePicker.on('change', SelectDay);
  datePicker.val(dayjs().format("YYYY-MM-DD"));
  LoadDay(GetUnixDay(dayjs()));
  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  //
  //
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
});

function SelectDay() {
  LoadDay(GetUnixDay(dayjs($(this).val())));
}

//loads data for given day into page - if no data found, initializes fresh page
function LoadDay(unixDay) {
  dayData = JSON.parse(localStorage.getItem('DayPlannerData_' + unixDay));

  ClearRows();
  SetBackgrounds(unixDay);

  if(dayData === null) {
    dayData = ["","","","","","","","",""];

    return;
  }

  //TODO: populate UI with loaded data
}

//sets time-classes on page rows according to current time
function SetBackgrounds(targetDay) {
  var today = GetUnixDay(dayjs());

  //iterate all time blocks
  var boxes = $('.time-block');
  for(var i = 0; i < boxes.length; i++) {
    //if future day, all hours are tagged as future
    if(targetDay > today) {
      boxes[i].classList.add('future');
    } 
    //if past day, all hours are tagged as past
    else if(targetDay < today) {
      boxes[i].classList.add('past');
    }
    //otherwise, it's today and we need to check hour by hour 
    else {
      var hr = Number(boxes[i].getAttribute('id').split('-')[1]);
      hr += dayStart;
      curhr = Number(dayjs().format("H"));

      //set past/present/future based on how current hour compares to this block's hour
      if(curhr === hr) {
        boxes[i].classList.add('present');
      }
      else if(curhr < hr) {
        boxes[i].classList.add('future');
      }
      else {
        boxes[i].classList.add('past');
      }
    }
  }
}

//clears all data and time-classes from page
function ClearRows() {
  //iterate all time blocks
  var boxes = $('.time-block');
  for(var i = 0; i < boxes.length; i++) {
    //remove any past/present/future classes
    boxes[i].classList.remove('past', 'present', 'future');
    //remove text from the input area of this block
    boxes[i].children.item(1).value = "";
  }
}

//converts day.unix into *days* since epoch
function GetUnixDay(day) {
  return Math.floor(day.unix() / 86400)
}