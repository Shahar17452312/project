//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
// gets all of the items from the DB and shows them in the html
//
//
//
$(function() {
  var cardId;
  $.ajax({
    url:"http://localhost:3000/admin",
    type:'GET',
  }).done(function(data){
    $.each(data, function(index, cake){
      var pro = document.createElement("li");
      pro.className = cake._id;
      pro.innerHTML = `
      <div class="col-md-3">
      <div class="card cardpro">
        <div class="card-img" id="cardImg"><img src="${cake.image}" style="height: 100px; position: relative; left: 50px;"> </div>
        <div class="card-info">
          <button class="text-title text-center showDialog" id="name">${cake.name}</button>
          <p class="text-body">${cake.description}</p>
        </div>
        <div class="card-footer" id="cardfoot">
          <span class="text-title price">${cake.price}₪</span>
          <button class="btn btn-sm btn-outline-secondary edit-btn" id="${cake._id}">Edit</button>
          <dialog id="editDialog" >
              <form id="editForm">
                <div class="form-group">
                  <label for="name">Name</label>
                  <input type="text" id="name" name="name" required>
                </div>
                <div class="form-group">
                  <label for="description">Description</label>
                  <input type="text" id="description" name="description" required>
                </div>
                <div class="form-group">
                  <label for="price">Price</label>
                  <input type="number" id="price" name="price" required>
                </div>
                <div class="form-group">
                  <label for="image">Image URL</label>
                  <input type="text" id="image" name="image" required>
                </div>
                  <button type="submit" id="submitBTN" >Save Changes</button>
              </form>
              <button class="cancelEditBtn">Cancel</button>
            </dialog>
            <form id="deleteForm" >
              <button class="btn btn-sm btn-outline-danger delete-btn" id="deleteBtn">Delete</button>
            </form>
        </div>
      </div>
      <br><br>
  </div>
      `;
      $("#cakeContainer").append(pro);
    })

//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
// buttons for the edit dialog and the add dialog
//
//
//
  var editDialog = document.getElementById('editDialog');
  const addCakeDialog = document.getElementById('addDialog');
  $(document).on('click', '#addCakeBtn', function() {
      addCakeDialog.showModal();
    });

  $('#closeBTN').click(function() {
      addCakeDialog.close();
  });
  $('.edit-btn').click(function() {
    cardId = $(this).attr('id');
      editDialog.showModal();
    });
  $('.cancelEditBtn').click(function() {
    editDialog.close();
  });


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
// this deletes an item from the DB 
//after deleting it , it removes it from the html
//
//
  $('#cakeContainer').on('submit', 'form#deleteForm', function(event) {
    event.preventDefault();
    var formElement = $(this);
    var liElement = formElement.closest('li');
    var id = liElement.attr('class');
    $.ajax({
      url:`/cakes/${id}/remove`,
      type: 'POST',
      data: formElement.serialize()
    }).done(function(data){
      liElement.remove();
    })
        
  });
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
// show orders button sends an ajax to get all  orders
//a fter he gets the orders he shows it in the screen
//
$('#showOrdersBtn').click(function() {
  var userId = $("#userId").text();
  $.ajax({
    url: '/getAdminOrders',
    type: 'POST',
    data:{userId: userId},
    success: function(orders) {
      var coloElements = document.getElementsByClassName("colo");
        if (coloElements.length > 0) {
          var coloElement = coloElements[0];
          coloElement.innerHTML = "";
        }
        for (var i = 0; i < orders.length; i++) {
          var pro = document.createElement("aside");
          pro.classList.add("accordion-item")
          pro.innerHTML = `
          <h2 class="accordion-header" id="heading${i}">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
              Order from: ${orders[i].orderDate} ${orders[i].userId.name}
            </button>
          </h2>
          <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-bs-parent=".colo">
            <div class="accordion-body${i}">
            </div>
          </div>
          `;
          $(".colo").append(pro);
          var sub = document.querySelector(`.accordion-body${i}`)
          
          for (var j = 0 ; j <orders[i].products.length;j++){
            var product = document.createElement("div");
            product.innerHTML = `
            Product name: ${orders[i].products[j].productName}
            <br>
            Quantity: ${orders[i].products[j].quantity}
            <br>
            Price: ${orders[i].products[j].price}₪
            `;
            sub.appendChild(product);
          }
        }
    },
    error: function(error) {
      console.log('Error retrieving orders:', error);
    }
  });
});

//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
// fix the menue if the window is small
// adds the functionality to the dropdown
//
document.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth < 992) {
    document.querySelectorAll('.navbar .dropdown').forEach(function (everydropdown) {
      everydropdown.addEventListener('hidden.bs.dropdown', function () {
        this.querySelectorAll('.submenu').forEach(function (everysubmenu) {
          everysubmenu.style.display = 'none';
        });
      });
    });
    document.querySelectorAll('.dropdown-menu a').forEach(function (element) {
      element.addEventListener('click', function (e) {
        let nextEl = this.nextElementSibling;
        if (nextEl && nextEl.classList.contains('submenu')) {
          e.preventDefault();
          if (nextEl.style.display == 'block') {
            nextEl.style.display = 'none';
          } else {
            nextEl.style.display = 'block';
          }
        }
      });
    });
  }
});



//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
// this edits the item sends an ajax req and saves the changes in the DB
//after saving it shows the chnges in the html
//
//
  $('#cakeContainer').on('submit', 'form#editForm', function(event) {
    event.preventDefault();
    var formElement = $(this);
    var card = formElement.closest('.cardpro');
    $.ajax({
      url: `/cakes/${cardId}/edit`,
      type: 'POST',
      data: formElement.serialize(),
    }).done(function(data){
      var liElement = document.getElementsByClassName(cardId);
      var card = $(liElement).find('.cardpro');
      card.find('.showDialog').text(data.name);
      card.find('.text-body').text(data.description);
      card.find('.price').text(data.price+ "₪");
      card.find('.card-img img').attr("src",data.image);
      editDialog.close();
      $('#editForm')[0].reset();
    });
  });

//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
// 
//
//
//
 
  function postToFacebook(name, price) {
    const accessToken = "EAAJbWKZCc0HsBAFzdqqZBwMLR8TRpWdLZBgBdpya2Cn3Cjpp76XmVrRCIEYiL0sZBrdCZCZB04JE04AOjBm39ZCd4OjTZBSqRRRZCnUxIJ1dwEAIOOemqaBM9dLosk7k00Un0BfhEnD6CO3oGDyRgtnfmVvBZBovEYNvr2Ayare7YCxFbU6dphaw2oRyRXmBX9kFSipgFnPKdGYW9HZBNsBZCf9i"; // Replace with your Facebook access token
    const postMessage =
      `Attention all cake lovers! We are excited to announce that we have a new cake : "${name}" available on our website it's only ${price}$ . Come and check out our delicious creation!`;
    const pageId = "103186909525848";
    const apiUrl = `https://graph.facebook.com/v16.0/${pageId}/feed`;
    const postData = {
      message: postMessage,
      access_token: accessToken,
    };
    fetch(apiUrl, {
      method: "POST",
      body: new URLSearchParams(postData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Post successfully sent!");
      })
      .catch((error) => {
        console.log("Post request failed. Error:", error);
      });
  }
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
// when adding an item this sends an ajax req to save the item in the DB
//after saving it it shows it in the html
//
//
    $('#addCakeForm').submit(function(event) {
      event.preventDefault();
      var formElement = $(this);
      $.ajax({
        url: '/add',
        type: 'POST',
        data: formElement.serialize(),
      }).done(function(data){
      postToFacebook(data.name, data.price);
      var formData = formElement.serializeArray(); 
      var pro = document.createElement("li");
      pro.className = data._id; 
      pro.innerHTML = `
      <div class="col-md-3">
      <div class="card cardpro">
        <div class="card-img" id="cardImg"><img src="${data.image}" style="height: 100px; position: relative; left: 50px;"> </div>
        <div class="card-info">
          <button class="text-title text-center showDialog" id="name">${data.name}</button>
          <p class="text-body">${data.description}</p>
        </div>
        <div class="card-footer" id="cardfoot">
          <span class="text-title price">${data.price}₪</span>
          <button class="btn btn-sm btn-outline-secondary edit-btn" id="${data._id}">Edit</button>
          <dialog id="editDialog" >
              <form id="editForm">
                <div class="form-group">
                  <label for="name">Name</label>
                  <input type="text" id="name" name="name" required>
                </div>
                <div class="form-group">
                  <label for="description">Description</label>
                  <input type="text" id="description" name="description" required>
                </div>
                <div class="form-group">
                  <label for="price">Price</label>
                  <input type="number" id="price" name="price" required>
                </div>
                <div class="form-group">
                  <label for="image">Image URL</label>
                  <input type="text" id="image" name="image" required>
                </div>
                  <button type="submit" id="submitBTN" >Save Changes</button>
              </form>
              <button class="cancelEditBtn">Cancel</button>
            </dialog>
            <form id="deleteForm" >
              <button class="btn btn-sm btn-outline-danger delete-btn" id="deleteBtn">Delete</button>
            </form>
        </div>
      </div>
      <br><br>
  </div>
      `;
      $("#cakeContainer").append(pro);
      addCakeDialog.close();
      $('#addCakeForm')[0].reset();

      $('.edit-btn').click(function() {
        cardId = $(this).attr('id');
          editDialog.showModal();
        });
    })
    });
  });
});


