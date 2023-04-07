// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  // Grab page elements
  var saveButtonsArr = $(".saveBtn")
  var descriptionElArr = $(".description")
  var dayEl = $("#currentDay");
  var timeBlockDivsArr = $("div[id^='hour-']");
  

  // On page load: start event listeners, set the current date, and start the clock for styling the page based on the current hour
  saveButtonsArr.click(saveTimeBlock)
  descriptionElArr.change(function() {
    needSaveStyle($(this).parent());
  });
  dayEl.text(dayjs().format("dddd, MMMM DD, YYYY"));
  fetchLocalSaves();
  runTopOfTheHour();
  
  // Callback Functions:
  
  // For the save button that was clicked, reset the styling. 
  // If the description text is null or only spaces, then remove any exisiting local storage (instead of holding a null value). 
  // Otherwise, add to local storage (overwriting any current values) with the time-block's id as key and description as value.
  function saveTimeBlock (event) {
    $(this).css("background-color", "")
    var parentDiv = $(this).parent(); 
    var timeBlockStr = parentDiv[0].id;
    var descriptionStr = parentDiv.children(".description")[0].value;
    if (!descriptionStr.trim()) {
      localStorage.removeItem(timeBlockStr);
    }
    else {
      localStorage.setItem(timeBlockStr, descriptionStr);
    }
    
  }
  
  // Style the save button with red background to indicate that user needs to save
  function needSaveStyle(timeBlockParam) {
    var saveButton = timeBlockParam.children(".saveBtn")
    saveButton.css("background-color", "red")
  }

  // Populate the page from localStorage
  function fetchLocalSaves () {
    for (let i = 0; i <= 24; i++) {
      var savedDescriptionStr = localStorage.getItem("hour-" + i);
      var timeBlockDiv = $("#hour-" + i);
      if (timeBlockDiv.length && savedDescriptionStr) { 
        timeBlockDiv.children(".description")[0].value = savedDescriptionStr;
      }
    }
  }
  
  // Use setTimeout and setInterval to updateTimeBasedStyles at the top of the next hour and again every hour after
  function runTopOfTheHour () {
    updateTimeBasedStyles();
    var minLeft = 60 - dayjs().format("m");
    setTimeout(function () {
      updateTimeBasedStyles();
      setInterval(function() {
        updateTimeBasedStyles();
      }, 60*60*1000);
    }, minLeft*60*1000);
  };

  //Set the class for each time block based on past/present/future based on the current time
  function updateTimeBasedStyles() {
    var curHour = Number(dayjs().format("H"));
    for (let j = 0; j < timeBlockDivsArr.length; j++) {
      if (timeBlockDivsArr[j].id.substr(5) == curHour) {
        timeBlockDivsArr[j].setAttribute("class", "row time-block present");
      }
      else if (timeBlockDivsArr[j].id.substr(5) < curHour) {
        timeBlockDivsArr[j].setAttribute("class", "row time-block past");
      }
      else {
        timeBlockDivsArr[j].setAttribute("class", "row time-block future");
      }     
    }
  }

});
