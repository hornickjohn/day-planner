const dayStart = 9; //hours after midnight that the work day starts
var dayData;

// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  var datePicker = $('#current-day');

  //give datepicker event handler to select pages, set to today, and load up today's info
  datePicker.on('change', function() {
    LoadDay(GetUnixDay(dayjs($(this).val())));
  });
  datePicker.val(dayjs().format("YYYY-MM-DD"));
  LoadDay(GetUnixDay(dayjs()));

  //add event handler for text being changed to highlight the save button
  $('.time-block textarea').on('change', function() {
    $(this).siblings('button').addClass('unsavedButton')
  });

  //event handler for save buttons to save their row
  $('.saveBtn').on('click', SaveRow);

  //event handler for clear day button
  $('#clear-day').on('click', RemoveDayFromStorage);
});

//loads data for given day into page - if no data found, initializes fresh page
function LoadDay(unixDay) {
  dayData = JSON.parse(localStorage.getItem('DayPlannerData_' + unixDay));

  //clear any previous data and set row styles
  ClearRows();
  SetBackgrounds(unixDay);

  //if no data loaded, start a fresh page
  if(dayData === null) {
    dayData = ["","","","","","","","",""];

    return;
  }

  //fill each text area with corresponding saved data
  var textAreas = $('.time-block textarea');
  for(var i = 0; i < textAreas.length && i < dayData.length; i++) {
    textAreas[i].value = dayData[i];
  }
}

function SaveRow() {
  //get this save button's text sibling
  var textBlock = $(this).siblings('textarea');
  //get which hour we're in
  var index = Number(textBlock.parent().attr('id').split('-')[1]);

  //store text data in data object, unhighlight save button
  dayData[index] = textBlock.val();
  $(this).removeClass('unsavedButton');

  //update local storage
  SaveDay();
}

//Sets the selected day's saved data in local storage
function SaveDay() {  
  localStorage.setItem('DayPlannerData_' + GetUnixDay(dayjs($('#current-day').val())), JSON.stringify(dayData));
}

//clears local storage data for currently selected day, and resets the page elements
function RemoveDayFromStorage() {
  var unixDay = GetUnixDay(dayjs($('#current-day').val()));
  localStorage.removeItem('DayPlannerData_' + unixDay);
  LoadDay(unixDay);
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
    //remove highlights from save buttons
    boxes[i].children.item(2).classList.remove('unsavedButton');
    //remove text from the input area of this block
    boxes[i].children.item(1).value = "";
  }
}

//converts day.unix into *days* since epoch
function GetUnixDay(day) {
  return Math.floor(day.startOf('d').unix() / 86400)
}