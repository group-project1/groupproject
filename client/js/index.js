const baseUrl= 'http://localhost:3000'

function isLoggedIn () {
  if (localStorage.token) {
    hasLogin()
  } else {
    hasLogout()
  }
}

function hasLogin () {
  console.log($('#artistName')[0].value) 
  fetchFavorites()
  $('#loginForm').hide()
  $('#registerForm').hide()
  $('#loggedEmail').append(`${localStorage.email}`)
  $('#main').fadeIn()
}

function hasLogout () {
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
      localStorage.removeItem('username')
      localStorage.removeItem('email')
      localStorage.removeItem('userId')
      Swal.fire({
        position: 'center',
        title: `See u soon..`,
        showConfirmButton: false,
        timer: 1000
      })
      hasLogout()
    }
  })
  
}

function registerold (newUser) {
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

function loginold (loginOption) {
  $.ajax({
    url: `${baseUrl}/users/login`,
    type: 'post',
    dataType: 'json',
    data: loginOption
  })
    .done(function(Data){
        console.log(Data)
        localStorage.setItem('token', Data.token)
    })
    .fail(function(error){
      console.log(error)
    })
}

function addItem () {
  location.href = "#toWishlist";
  return false
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
      for (let i = 0; i <= 100; i++) {
        $('#itemCarousel').append(`
        <a class="carousel-item" href="" onclick="return addItem()" title="" style="margin-top: -100px"><img src="${data[i].item.images.information}"></a>

        `)
      }
      $('#carouselLoading').hide()
      $('#carouselMessage').empty()
      $('#carouselMessage').append(`
        <p>Click image for adding to wishlist!</p>
      `)
      $('.carousel').carousel();
    })
    .fail(function(error){
      console.log(error)
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

    // $('a.thumb').click(function(event){
    //   event.preventDefault();
    //   var content = $('.modal-body');
    //   content.empty();
    //     var title = $(this).attr("title");
    //     $('.modal-title').html(title);        
    //     content.html($(this).html());
    //     $(".modal-profile").modal({show:true});
    // });
    // isLoggedIn()
    $('#loginForm').hide()
    $('#registerForm').hide()
    fetchItems()
    fetchNews()

    $('#register').submit(function (event) {
      event.preventDefault()
      let data = $(this).serializeArray()
      let newUser = {
        username: data[0].value,
        email: data[1].value,
        password: data[2].value,
      }
      console.log(newUser)
      // register(username, email, password)
    })
  
    $('#login').submit(function (event) {
      event.preventDefault()
      let data = $(this).serializeArray()
      let loginOption = {
        email: data[0].value,
        password: data[1].value
      }
      console.log(loginOption)
      // login(email, password)
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

    // $('#registerForm').submit(function(event){
    //     event.preventDefault()
    //     let data= $(this).serializeArray()
    //     let newUser = {
    //       name: data[0].value,
    //       email: data[1].value,
    //       password: data[2].value
          
    //     }
    //     console.log(newUser)
    //     register(newUser)
    // })

    // $('#loginForm').submit(function(event){
    //     event.preventDefault()
    //     let data= $(this).serializeArray()
    //     let loginOption = {
    //       email: data[0].value,
    //       password: data[1].value
    //     }
    //     console.log(loginOption)
    //     login(loginOption)
    // })
  });



