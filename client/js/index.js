const baseUrl= 'http://localhost:3000'

function isLoggedIn () {
  if (localStorage.token) {
    hasLogin()
  } else {
    hasLogout()
  }
}

function hasLogin () {
  $('#loginForm').hide()
  $('#registerForm').hide()
  $('#loggedEmail').append(`${localStorage.name}`)
  $('#main').fadeIn()
}

function hasLogout () {
  $('#loggedEmail').empty()
  $('#main').hide()
  $('#registerForm').hide()
  $('#loginForm').fadeIn()
}

function logout() {
  Swal.fire({
    title: 'Where are u going?',
    // text: "You won't be able to revert this!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Gotta go!'
  }).then((result) => {
    if (result.value) {
      localStorage.removeItem('token')
      localStorage.removeItem('name')
      localStorage.removeItem('email')
      localStorage.removeItem('userId')
      Swal.fire({
        position: 'center',
        title: `See u soon..`,
        showConfirmButton: false,
        timer: 1000
      })
      const auth2 = gapi.auth2.getAuthInstance();

      auth2.signOut()
      .then(function(){
        console.log('User signed out')
         hasLogout()
      })
      .catch(function(err){
        console.log(err)
      })
      hasLogout()
    }
  })
  
}

function register (newUser) {
  $.ajax({
    url: `${baseUrl}/users/register`,
    type: 'post',
    dataType: 'json',
    data: newUser
  })
    .done(function(success){
        console.log(success)
        let loginOption = {
          email : email,
          password: password
        }
        login(loginOption)
      })
    .fail(function(error){
        console.log(error)
    })
}

function login (loginOption) {
  $.ajax({
    url: `${baseUrl}/users/login`,
    type: 'post',
    dataType: 'json',
    data: loginOption
  })
    .done(function(Data){
      console.log(Data)
      localStorage.setItem('token', Data.token)
      localStorage.setItem('name', Data.name)
      localStorage.setItem('email', Data.email)
      localStorage.setItem('userId', Data.id)
      hasLogin()
    })
    .fail(function(error){
      console.log(error)
    })
}

function onSignIn(googleUser) {

  const idToken= googleUser.getAuthResponse().id_token

   $.ajax({
      url: `${baseUrl}/users/loginGoogle`,
      type: 'post',
      dataType: 'json',
      data:{idToken}
   })
   .done(function(Data){
     console.log(Data)
     localStorage.setItem('token', Data.token)
     localStorage.setItem('name', Data.name)
     localStorage.setItem('email', Data.email)
     localStorage.setItem('userId', Data.id)
     hasLogin()
   })

   .fail(function(err){
    console.log(err)

   })

}

function addItem (itemId, name, thumbnail, price) {
  event.preventDefault()
  console.log('masuk',itemId, name, thumbnail, price);

  $.ajax({
    url : `${baseUrl}/wishlist`,
    method : 'post',
    data : {
      itemId : itemId,
      itemName : name,
      thumbnail : thumbnail,
      price : price
    },
    headers : {
      token : localStorage.token
    }
  })
  .done(response =>{
    console.log(response);
    location.href = "#toWishlist";
      $("#wishlistCardContainer").append(
        `<div id="${itemId}" class="card col s-3">
        <div class="card-image">
          <img src="${thumbnail}" width=200px height=150px>
        </div>
        <div class="card-stacked">
          <div class="card-content" style="height:100px">
            <span>${name}</span>
            <span>${price}</span>
          </div>
          <div class="card-action">
            <a href="#" target="_blank">detail</a>
          </div>
        </div>
      </div>`
      )
  })
  .catch((jxHQR,status)=>{
    console.log(status);
  })
  
}

function fetchItems () {
  $('#carouselMessage').append(`
    <p>Please wait...</p>
  `)
  $.ajax({
    url: `${baseUrl}/items`,
    type: 'get'
  })
    .done(function({data}){
      // console.log(data);
      for (let i = 0; i <= 100; i++) {
        let dataCard = {
          itemId : data[i].itemId,
          userId : localStorage.userId,
          itemName : data[i].item.name,
          description : data[i].item.description,
          thumbnail : data[i].item.images.background,
          hover : data[i].item.images.featured,
          image : data[i].item.images.icon,
          price : data[i].item.cost,
          type : data[i].item.type,
          rarity : data[i].item.rarity,
          rating : data[i].item.rating
        }
        // console.log(dataCard);
        // let passData = JSON.stringify(dataCard)
        // console.log('passData', passData);

        $('#itemCarousel').append(`
        <div id="${data[i].itemId}" class="carousel-item" title="" style="margin-top: -100px">
          <img src="${data[i].item.images.information}">
          <a href="#" onclick="addItem('${data[i].itemId}','${data[i].item.name}','${data[i].item.images.background}','${data[i].item.cost}');"><i class="fas fa-plus-circle" style="color:red; font-size:4em; position:absolute; z-index:1; margin-top:-385px; margin-left: 215px"></i></a>
        </div>

        `)
      }
      $('#carouselLoading').hide()
      $('#carouselMessage').empty()
      $('#carouselMessage').append(`
        <p>Click <i class="fas fa-plus-circle" style="color:red"></i> for adding to wishlist!</p>
      `)
      $('.carousel').carousel();
    })
    .fail(function(error){
      console.log('kok error')
    })
}

function fetchNews () {
  $.ajax({
    url: `${baseUrl}/news`,
    type: 'get'
  })
    .done(function({articles}){
      $('#newsLoading').hide()
      articles.forEach(news => {
        $('#newsContainer').append(`
        <div class="col s3 m3 animated fadeInUp delay-0.5s">
          <div class="card">
            <div class="card-image">
              <img src="${news.urlToImage}" width=200px height=150px>
            </div>
            <div class="card-stacked">
              <div class="card-content" style="height:100px">
                <span>${news.title.substring(0,70)}...</span>
              </div>
              <div class="card-action">
                <a href="${news.url}" target="_blank">Read this news</a>
              </div>
            </div>
          </div>
        </div>
        `)
      })
    })
    .fail(function(error){
      console.log(error)
    })
}

$(document).ready(function() {
    console.log('ready!')

     isLoggedIn()
    // $('#loginForm').hide()
    // $('#registerForm').hide()
    fetchItems()
    fetchNews()

    $('#register').submit(function (event) {
      event.preventDefault()
      let data = $(this).serializeArray()
      let newUser = {
        name: data[0].value,
        email: data[1].value,
        password: data[2].value,
      }
      console.log(newUser)
       register(newUser)
    })
  
    $('#login').submit(function (event) {
      event.preventDefault()
      let data = $(this).serializeArray()
      let loginOption = {
        email: data[0].value,
        password: data[1].value
      }
      console.log(loginOption)
       login(loginOption)
    })
  
    $('#toRegister').click(() => {
      event.preventDefault()
      $('#loginForm').hide()
      $('#registerForm').show()
    })
  
    $('#toLogin').click(() => {
      event.preventDefault()
      $('#registerForm').hide()
      $('#loginForm').show()
    })
  
  
    $('#logout').click(() => {
      event.preventDefault()
      logout()
    })

  });



