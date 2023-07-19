//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
// Loading page with cakes 
//
//
$(function(){
  $.ajax({
    url:"http://localhost:3000/home",
    type:'GET',
  }).done(function(data){
    $.each(data, function(index, cake){
      var pro = document.createElement("li");
      pro.innerHTML = `
      <div class="col-3">
              <div class="card cardpro">
                <div class="card-img" id="cardImg"><img src="${cake.image}" style="height: 100px; position: relative; left: 50px;"> </div>
                <div class="card-info">
                <span class="text-title text-center" id="id" style="display: none;">${cake._id}</span>
                  <span class="text-title text-center text-name" id="name">${cake.name}</span>
                  <p class="text-body">${cake.description}</p>
                </div>
                <div class="card-footer" id="cardfoot">
                  <span class="text-title price">${cake.price}₪</span>
                  <span class="card-button showDialog">
                    <i class="bi bi-search"></i>
                  </span>
                </div>
              </div>
              </div>
              <br><br>
      `;
      $("#cakeContainer").append(pro);
    })

//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
// cart button that sends an ajax to get the user cart 
// with the function that displeys it below
// if there are items in the cart it will show them
//
  $("#cartBtn").click(function (req) {
    var userId = $("#userId").text();
    $.ajax({
      url: "http://localhost:3000/cart",
      type: "POST",
      data:{userId: userId}
    }).done(function(data){
      displayCartItems(data,userId);
    });
  });
  function displayCartItems(items, userId) {
    $(".inputGroup").css("display", "none");
    var modalBody = $("#cartModal .modal-body");
    modalBody.empty();
    var totalSum = 0; 
    items.forEach(function (item) {
      var itemName = item.name;
      var itemPrice = item.price;
      var itemQuantity = item.quantity;
      var itemId = item._id;
      var itemContainer = $("<div>").addClass("cart-item");
      var itemImage = $("<img>")
      .addClass("item-image")
      .attr("src", item.image)
      .attr("alt", itemName);
      itemContainer.append(itemImage);
      var itemText = $("<span>").text(itemName);
      itemText.addClass("name");
      var itemQuantityText = $("<span>").text(" - Quantity: " + itemQuantity);
      itemQuantityText.addClass("amount");
      var itemPriceText = $("<span>").text(" - Price: $" + itemPrice);
      itemPriceText.addClass("price");
      itemContainer.append(itemText);
      itemContainer.append(itemQuantityText);
      itemContainer.append(itemPriceText);
      var itemIdText = $("<span>")
      .addClass("hidden-item-id")
      .text(itemId)
      .css("display", "none");
      itemContainer.append(itemIdText);
      var deleteButton = $("<button>")
      .addClass("btn btn-danger btn-sm mx-2 cartdelete")
      .text("Delete")
      .click(function () {
        deleteCartItem(itemId, userId);
      });
      itemContainer.append(deleteButton);
      var editButton = $("<button>")
      .addClass("btn btn-primary btn-sm cartedit")
      .text("Edit")
      .click(function () {
        $(".inputGroup").css("display", "block");
        editCartItem(itemId, itemQuantity, userId);
      });
      itemContainer.append(editButton);
      modalBody.append(itemContainer);
      var itemSubtotal = itemPrice * itemQuantity;
      totalSum += itemSubtotal;
  });
  var totalSumText = $("<p>").text("Total Sum: $" + totalSum.toFixed(2));
  totalSumText.addClass("total-sum");
  modalBody.append(totalSumText);
  if(totalSum===0){
    $('#checkoutBtn').prop('disabled', true);
  }else{
    $('#checkoutBtn').prop('disabled', false);
  }
  $("#cartModal").modal("show");
  }
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
// the dialog for every card 
// gets its details and shows them in dialog
//
  var showDialogButtons = document.querySelectorAll(".showDialog");
  showDialogButtons.forEach(function(button) {
    button.addEventListener("click", function() {

      var dialog = document.getElementById("favDialog");
      dialog.showModal();
      var card = button.closest(".card");
      var cardImgSrc = card.querySelector(".card-img img").src;
      var cardName = card.querySelector(".text-name").textContent;
      var cardDescription = card.querySelector(".text-body").textContent;
      var cardPrice = card.querySelector(".price").textContent;
      var cardId = card.querySelector("#id").textContent;
      var dialogImg = document.getElementById("dialogImg");
      var dialogName = document.getElementById("dialogName");
      var dialogDescription = document.getElementById("dialogDescription");
      var dialogPrice = document.getElementById("dialogPrice");
      var dialogId = document.getElementById("dialog_id");
      var quantity = 1;
      dialogImg.src = cardImgSrc;
      dialogName.textContent = cardName;
      dialogDescription.textContent = cardDescription;
      dialogPrice.textContent = cardPrice;
      dialogId.textContent = cardId;
      dialogId.style.display="none";
      document.querySelector(".numOfProd").textContent = quantity;
      var plusButton = dialog.querySelector(".plus");
      var minusButton = dialog.querySelector(".minus");
      var quantityElement = dialog.querySelector(".numOfProd");
      plusButton.addEventListener("click", function() {
        quantity++;
        quantityElement.textContent = quantity;
      });
      minusButton.addEventListener("click", function() {
        if (quantity > 1) {
          quantity--;
          quantityElement.textContent = quantity;
        }
      });
    });
  });
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
// add an event listener so the item dialog will be closed when clicked outside of it 
//
//
window.addEventListener("click", function(event) {
  var dialog = document.getElementById("favDialog");
  if (event.target === dialog) {
    dialog.close();
  }
});
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
// clear cart button removes all items from the cart 
//
//
$(".clear-cart-btn").on("click", function() {
  var userId = $("#userId").text();
  clearCart(userId); 
});
});
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
// opens a socket to recive info from the server 
// shown the info an a modal (like commercial)
//
const socket = new WebSocket('ws://localhost:3000'); 
socket.addEventListener('open', () => {
  console.log('WebSocket connection established');
});
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (message.event === 'specialCakePopup') {
    const cakeImage = message.data.image;
    const cakeMessage = message.data.message;
    const modalImage = document.getElementById('specialCakeImage');
    const modalMessage = document.getElementById('specialCakeMessage');
    modalImage.src = cakeImage;
    modalMessage.textContent = cakeMessage;
    $('#specialCakeModal').modal('show');
  }
});
socket.addEventListener('close', () => {
  console.log('WebSocket connection closed');
});

//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
// add to cart button 
// sends an ajax to save the item in the cart 
//
$(".addToCart").click(function () {
  var dialog = document.getElementById("favDialog");
  dialog.close();
  var productId = $("#dialog_id").text();
  var quantity = parseInt($(".numOfProd").text());
  var userId = $("#userId").text();
  $.ajax({
    url: "http://localhost:3000/cart/add",
    type: "POST",
    data: { productId: productId, quan: quantity , userId: userId },
  }).done(function(data){
    //check if the item already exists , so it wont change the number in the cart circle
    if(data<=quantity){
      var numOfProduct = parseInt($("#cart").text());
      numOfProduct++;
      $("#cart").text(numOfProduct);
    }
  });
});
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
// show orders button sends an ajax to get all historic user orders
//a fter he gets the orders he shows it in the screen
//
$('#showOrdersBtn').click(function() {
  var userId = $("#userId").text();
  $.ajax({
    url: '/getUserOrders',
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
              Order from: ${orders[i].orderDate}
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
// checkout button that gets all the cart items and saves the as an order  
//  sends ajax request to save order
// after he saves it it clears the shoping cart
// and shows a thank you alert with the order details
$('#checkoutBtn').click(function() {
  var userId = $("#userId").text();
  const date = new Date();
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  const orderDate = `${day}/${month}/${year}`; 
  $.ajax({
    url: '/updateOrders',
    type: 'POST',
    data: {userId: userId , orderDate: orderDate}
    
  }).done(function(data){
    var confirmationMessage = 'Thank you for buying!\n';
    confirmationMessage += 'Order Details:\n';
    for (var i = 0; i < data.products.length; i++) {
      confirmationMessage += 'Product Number: '+ i + 1 + '\n';
      confirmationMessage += 'Product Name: ' + data.products[i].productName + '\n';
      confirmationMessage += 'Quantity: ' + data.products[i].quantity + '\n';
      confirmationMessage += 'Price: ' + data.products[i].price + "₪" +'\n';
      confirmationMessage += '\n';
    }
    confirmationMessage += 'Date: ' + data.orderDate + '\n';
    confirmationMessage += 'Total Amount: ' + data.totalAmount + '\n';
    clearCart(userId);
    alert(confirmationMessage);
  });
});
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
// sends an ajax request to delete an item 
//  after it is deleting from the db it will delete from the html
//
function deleteCartItem(productId,userId) {
  $.ajax({
    url: "http://localhost:3000/cart/remove",
    type: "POST",
    data: {
      productId: productId,
      userId: userId,
    },
    success: function (response) {
      $("#cartModal .modal-body .cart-item").each(function () {
        var cartItemId = $(this).find(".hidden-item-id").text();
        if (cartItemId === productId) {
          $(this).remove();
        }
      });
      var numOfProduct = parseInt($("#cart").text());
      numOfProduct--;
      $("#cart").text(numOfProduct);
      updateTotalAmount(userId);
      if(numOfProduct===0){
        $('#checkoutBtn').prop('disabled', true);
      }else{
        $('#checkoutBtn').prop('disabled', false);
      }
    }
  });
}
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
// sends an ajax to edit the quantity of the item 
//after it is changing in the db it will change in the html
// first creating a input box to get the number to change then sends an ajax then changes in the html
//
function editCartItem(productId, quantity,userId) {
  var cartItem = $(".cart-item").filter(function () {
    return $(this).find(".hidden-item-id").text() === productId;
  });  
  var quantityElement = cartItem.find(".amount"); 
  var inputElement = $("<input>").attr("type", "number").val(quantity);
  inputElement.addClass("editInput");
  quantityElement.html(inputElement); 
  var submitButton = $("<button>").text("Submit");  
  quantityElement.append(submitButton);
  submitButton.on("click", function () {
    var newQuantity = inputElement.val();
    if(newQuantity==="0"){
      deleteCartItem(productId,userId);
    }
    else if (newQuantity !== "") {
      $.ajax({
        url: "http://localhost:3000/cart/update",
        type: "POST",
        data: {
          productId: productId,
          quantity: parseInt(newQuantity),
          userId: userId,
        },
        success: function (response) {
          quantityElement.html(" - Quantity: " + newQuantity);
          updateTotalAmount(userId);
        },
      });
    }
  });
}
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
// function that updates the total sum of items in cart 
//
//
function updateTotalAmount(userId) {
  var cartItems = $(".cart-item");
  var totalSum = 0;
  cartItems.each(function() {
    var itemQuantity = parseInt($(this).find(".amount").text().split(": ")[1]);
    var itemPrice = parseFloat($(this).find(".price").text().split("$")[1]);
    var itemSubtotal = itemQuantity * itemPrice;
    totalSum += itemSubtotal;
  });
  $(".total-sum").text("Total Sum: $" + totalSum.toFixed(2));
}
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
// a function that claers the cart 
//sends an ajax request to delete it from the db then deletes it in the html
//
function clearCart(userId) {
  $.ajax({
    url: "http://localhost:3000/cart/clear",
    type: "POST",
    data: {userId: userId},
    success: function (response) {
       $(".cart-item").remove();
       var numOfProduct = parseInt($("#cart").text());
        numOfProduct = 0;
        $("#cart").text(numOfProduct);
       updateTotalAmount(userId);
       if(numOfProduct===0){
        $('#checkoutBtn').prop('disabled', true);
      }else{
        $('#checkoutBtn').prop('disabled', false);
      }
    }
  });
}
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
// 9 event listeners for the dropdown menu selection 
// each one calls getCakes with it own parameters
//
//
var selectedCategory = "";
$("#allCakes").click(function() {
  selectedCategory = "cake";
  selectedCakeType = "all";
  getCakes(selectedCategory, selectedCakeType); 
});
$("#dairyCakes").click(function() {
  selectedCategory = "cake";
  selectedCakeType = "dairy";
  getCakes(selectedCategory, selectedCakeType);
});
$("#nonDairyCakes").click(function() {
  selectedCategory = "cake";
  selectedCakeType = "not-dairy";
  getCakes(selectedCategory, selectedCakeType);
});
$("#allCookies").click(function() {
  selectedCategory = "cookie";
  selectedCakeType = "all";
  getCakes(selectedCategory, selectedCakeType);
});
$("#dairyCookies").click(function() {
  selectedCategory = "cookie";
  selectedCakeType = "dairy";
  getCakes(selectedCategory, selectedCakeType);
});
$("#nonDairyCookies").click(function() {
  selectedCategory = "cookie";
  selectedCakeType = "not-dairy";
  getCakes(selectedCategory, selectedCakeType); 
});
$("#allDesserts").click(function() {
  selectedCategory = "dessert";
  selectedCakeType = "all";
  getCakes(selectedCategory, selectedCakeType); 
});
$("#dairyDesserts").click(function() {
  selectedCategory = "dessert";
  selectedCakeType = "dairy";
  getCakes(selectedCategory, selectedCakeType); 
});
$("#nonDairyDesserts").click(function() {
  selectedCategory = "dessert";
  selectedCakeType = "not-dairy";
  getCakes(selectedCategory, selectedCakeType); 
});
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
// a function that recives info about the selection it the dropdown
//sends ajax req for the selected items
//after reciving data it shown the selected items in the html
//
  function getCakes(category, cakeType) {
    $.ajax({
      url: "http://localhost:3000/cakes",
      type: "GET",
      data: { category: category, cakeType: cakeType },
      success: function(data) {
        $("#cakeContainer").empty();
        $.each(data, function(index, cake) {
          var pro = document.createElement("li");
          pro.innerHTML = `
          <div class="col-3">
          <div class="card cardpro">
            <div class="card-img" id="cardImg"><img src="${cake.image}" style="height: 100px; position: relative; left: 50px;"> </div>
            <div class="card-info">
            <span class="text-title text-center" id="id" style="display: none;">${cake._id}</span>
              <span class="text-title text-center text-name" id="name">${cake.name}</span>
              <p class="text-body">${cake.description}</p>
            </div>
            <div class="card-footer" id="cardfoot">
              <span class="text-title price">${cake.price}₪</span>
              <span class="card-button showDialog">
                <i class="bi bi-search"></i>
              </span>
            </div>
          </div>
          </div>
          <br><br>
          `;
          $("#cakeContainer").append(pro);
        });
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
// cart button that sends an ajax to get the user cart 
// display function is up
//
        $("#cartBtn").click(function (req) {
          var userId = $("#userId").text();
          $.ajax({
            url: "http://localhost:3000/cart",
            type: "POST",
            data:{userId: userId}
          }).done(function(data){
            displayCartItems(data,userId);
          });
        });
      var showDialogButtons = document.querySelectorAll(".showDialog");
      showDialogButtons.forEach(function(button) {
        button.addEventListener("click", function() {
          var dialog = document.getElementById("favDialog");
          dialog.showModal();
          var card = button.closest(".card");
          var cardImgSrc = card.querySelector(".card-img img").src;
          var cardName = card.querySelector(".text-name").textContent;
          var cardDescription = card.querySelector(".text-body").textContent;
          var cardPrice = card.querySelector(".price").textContent;
          var cardId = card.querySelector("#id").textContent;
          var dialogImg = document.getElementById("dialogImg");
          var dialogName = document.getElementById("dialogName");
          var dialogDescription = document.getElementById("dialogDescription");
          var dialogPrice = document.getElementById("dialogPrice");
          var dialogId = document.getElementById("dialog_id");
          var quantity = 1;
          dialogImg.src = cardImgSrc;
          dialogName.textContent = cardName;
          dialogDescription.textContent = cardDescription;
          dialogPrice.textContent = cardPrice;
          dialogId.textContent = cardId;
          dialogId.style.display="none";
          document.querySelector(".numOfProd").textContent = quantity;
          var plusButton = dialog.querySelector(".plus");
          var minusButton = dialog.querySelector(".minus");
          var quantityElement = dialog.querySelector(".numOfProd");      
          plusButton.addEventListener("click", function() {
            quantity++;
            quantityElement.textContent = quantity;
          });     
          minusButton.addEventListener("click", function() {
            if (quantity > 1) {
              quantity--;
              quantityElement.textContent = quantity;
            }
        });
      })
    });
      },
      error: function(error) {
        console.log("Error fetching cakes:", error);
      }
    });
  }
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
//***************************************************************************************************** */
// fix the menue if the window is small
// adds the functionality to the dropdown
//
document.addEventListener("DOMContentLoaded", function(){
  if (window.innerWidth < 992) {  
    document.querySelectorAll('.navbar .dropdown').forEach(function(everydropdown){
      everydropdown.addEventListener('hidden.bs.dropdown', function () {
          this.querySelectorAll('.submenu').forEach(function(everysubmenu){
            everysubmenu.style.display = 'none';
          });
      })
    });
    document.querySelectorAll('.dropdown-menu a').forEach(function(element){
      element.addEventListener('click', function (e) {
          let nextEl = this.nextElementSibling;
          if(nextEl && nextEl.classList.contains('submenu')) {
            e.preventDefault();
            if(nextEl.style.display == 'block'){
              nextEl.style.display = 'none';
            } else {
              nextEl.style.display = 'block';
            }
  
          }
      });
    })
  }  
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
});
