//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
// function that sends an ajax to get the rating and then update the chart api with it 
// with the update chart function below it and functio for calculating avarage
//
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(fetchDataAndDrawChart);
function fetchDataAndDrawChart() {
  $.ajax({
    url: '/orders',
    type: 'GET',
    success: function(data) {
      var cakeData = [['Cake', 'Quantity', { role: 'style' }]];
      var cakeCount = {}; 

      data.forEach(function(order) {
        order.products.forEach(function(product) {
          var cake = product.productName;
          if (cake in cakeCount) {
            cakeCount[cake] += product.quantity;
          } else {
            cakeCount[cake] = product.quantity;
          }
        });
      });
      for (var cake in cakeCount) {
        var color = getRandomColor();
        cakeData.push([cake, cakeCount[cake], color]);
      }
      var chart = new google.visualization.ColumnChart(document.getElementById('chartContainer'));

    var data = google.visualization.arrayToDataTable(cakeData);
    var options = {
        title: 'Most Bought Cakes',
        width: 750 ,
        height:350
    };
        console.log(data);
        console.log(options);
      chart.draw(data, options);
    },
    error: function(error) {
      console.error('Failed to fetch data:', error);
    }
  });
}
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
// canvas settings
// 
//
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var grd = ctx.createLinearGradient(0, 0, 300, 0);
grd.addColorStop(0, "white");
grd.addColorStop(1, "black");
ctx.fillStyle = grd;
ctx.fillRect(0, 10, 600, 80);
ctx.fillStyle = "black";
ctx.font = "40px 'Brush Script MT', cursive";
ctx.fillText("Rachely Sweets", 20, 50);

//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
// function that sends an ajax to get the rating and then update the chart with it 
// with the update chart function below it and functio for calculating avarage
//
function fetchRatingsAndUpdateChart() {
    $.ajax({
      url: '/ratings',
      method: 'GET',
      success: function (data) {
        updateChart(data);
      },
      error: function (error) {
        console.error('Failed to fetch ratings:', error);
      },
    });
  } 
  let chart = null;
  function updateChart(ratings) {
    if (chart) {
      chart.destroy();
    }
    const ratingsValues = ratings.map((rating) => rating.rating);
    const averageRating = calculateAverageRating(ratingsValues);
    const ratingGraph = document.getElementById('ratingGraph');
    const ctx = ratingGraph.getContext('2d');
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Rating'],
        datasets: [
          {
            label: 'Average Rating',
            data: [averageRating],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 5,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          datalabels: { 
            display: true,
            align: 'top',
            anchor: 'center',
            color: '#000',
            font: {
              weight: 'bold',
            },
            formatter: function (value, context) {
              return value.toFixed(1);
            },
          },
        },
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
          },
        },
      },
    });
  }
  function calculateAverageRating(ratings) {
    if (ratings.length === 0) {
      return 0;
    }
    const sum = ratings.reduce((total, rating) => total + parseInt(rating), 0);
    return sum / ratings.length;
  }
  //***************************************************************************************************** */
  //***************************************************************************************************** */
  //***************************************************************************************************** */
  //***************************************************************************************************** */
  // submit button that gets the rating and save the in the json file with an ajax request 
  // after it is reciving the updated rating it is updating the chart
  // it has a function to show a thank you message for tow seconds and also a function to clear the rating stars 
  //the rating starst in index.ejs
  $('#submitRating').click(function () {
    const rating = $('input[name="rating"]:checked').val();
    if (!rating) {
      console.error('No rating selected');
      return;
    }
    const ratingData = { rating };
    $.ajax({
      url: '/ratings',
      method: 'POST',
      data: JSON.stringify(ratingData),
      contentType: 'application/json',
      success: function (data) {
        console.log('Rating submitted successfully');
        showThankYouMessage();
        resetRatingStars();
        fetchRatingsAndUpdateChart();
      },
      error: function (error) {
        console.error('Failed to submit rating:', error);
      },
    });
  });
  function showThankYouMessage() {
    const thankYouMessage = $('<div>', { class: 'thank-you-message' }).text('Thank you for rating');
    $('body').append(thankYouMessage);
    setTimeout(function () {
      thankYouMessage.remove();
    }, 2000); 
  }
  function resetRatingStars() {
    $('input[name="rating"]').prop('checked', false);
  }
  //update chart when the page loaded
  fetchRatingsAndUpdateChart();

//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
//bing maps api 
// gets locations from ajax req and pins them
//shows in zoom random pin
//

    var map;
    function initMap() {
        map = new Microsoft.Maps.Map('#map', {
          credentials: 'AhuAvbW8ppZgT9hfM2KQXyKL1zTrOJFUy7n3vcH2U3NE6ViLkhXxlqfGCOCH9UNR',
        });
        $.ajax({
          url: '/locations',
          type: 'GET',
          success: function(data) {
            console.log("location");
            displayLocationsOnMap(data);
          },
          error: function(error) {
            console.error('Failed to fetch location data:', error);
          },
        });
      }
      
      function displayLocationsOnMap(locations) {
        Microsoft.Maps.loadModule('Microsoft.Maps.Search', function() {
          var searchManager = new Microsoft.Maps.Search.SearchManager(map);
          var pushpins = [];
          locations.forEach(function(location) {
            var latitude = location.latitude;
            var longitude = location.longitude;
            var name = location.name;
            var locationLatLng = new Microsoft.Maps.Location(latitude, longitude);
            var pin = new Microsoft.Maps.Pushpin(locationLatLng, {
              title: name,
            });
            pushpins.push(pin);
          });
          var bounds = Microsoft.Maps.LocationRect.fromLocations(
            locations.map(function(location) {
              return new Microsoft.Maps.Location(location.latitude, location.longitude);
            })
          );
          map.setView({ bounds: bounds });
          var randomIndex = Math.floor(Math.random() * pushpins.length);
          var randomPin = pushpins[randomIndex];
          map.setView({ center: randomPin.getLocation(), zoom: 12.5 });
          map.entities.push(pushpins);
        });
      }
      