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
  $('#loggedEmail').empty()
  $('#loggedEmail').append(`${localStorage.name}`)
  $('#main').fadeIn()
  fetchWishlist(true)
  fetchItems()
  fetchNews()
}

function hasLogout () {
  $('#loggedEmail').empty()
  $('#wishlistCardContainer').empty()
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
          email : newUser.email,
          password: newUser.password
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
    fetchWishlist(false)
    location.href = "#toWishlist";
  })
  .fail((jxHQR,status)=>{
    console.log(status);
    Swal.fire({
      type: 'error',
      title: 'Oops...',
      text: 'Item already added'
    })
  })
  
}

function removeItem (id, img, name) {
  event.preventDefault()
  console.log(img)
  Swal.fire({
    imageUrl: img,
    imageWidth: 200,
    imageHeight: 200,
    title: 'Delete this items?',
    text: name,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.value) {
      $.ajax({
        url : `${baseUrl}/wishlist/${id}`,
        method : 'delete',
        headers : {
          token : localStorage.token
        }
      })
        .done(response => {
          console.log(response)
          fetchWishlist(false)
        })
        .fail((jxHQR,status)=>{
          console.log(status);
        })
      Swal.fire(
        'Deleted!',
        'Your file has been deleted.',
        'success'
      )
    }
  })
}

function fetchDetails (id) {
  event.preventDefault()
  Swal.fire({
    imageUrl: 'https://www.justori.com/justori/assets/images/11.gif',
    
    position: 'center',
    showConfirmButton: false
  })
  $.ajax({
    url: `${baseUrl}/items/${id}`,
    type: 'get',
    headers: {
      token: localStorage.token
    }
  })
  .done(({data}) => {
    console.log(data)
    let item = data.item
    $.ajax({
      url: `https://www.googleapis.com/youtube/v3/search?part=id&q=fortnite ${item.name}&type=video&key=AIzaSyAgufyMDC_DB_DJufzI1ueBKtkMYTH_9C0`,
      type: 'get'
    })
    .done(youtube => {
      let videoId = youtube.items[0].id.videoId
      Swal.fire({
        html: `
        <div class="row" style="height:500px">
          <div class="col s5">
            <div class="row" style="margin-top:20px">
              <div class="col s12">
                <div class="card">
                  <div class="card-image">
                    <img src="${item.images.icon}" width=200px>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col s7" style="">
            <h2>${item.name.toUpperCase()}</h2>
            <div class="row">
              <div class="col s12">
                <div class="card">
                  <div class="row card-content" style="text-align:left">
                    <div class="col s6">
                      <h6>Type: ${item.type}</h6>
                      <h6>Rarity: ${item.rarity}</h6>
                      <h5>Price: ${item.cost}</h5>
                    </div>
                    <div class="col s6">
                      <h4 style="margin-top:-5px">Rating</h4>
                      <h6>avgStars:    ${item.ratings.avgStars}</h6>
                      <h6>totalPoints: ${item.ratings.totalPoints}</h6>
                      <h6>numberVotes: ${item.ratings.numberVotes}</h6>     
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <iframe width="420" height="245" src="https://www.youtube.com/embed/${videoId}" allowfullscreen="allowfullscreen"></iframe>
        </div>
        `,
        showConfirmButton: false,
        heightAuto: false,
        width: 1100
      })
    })
    .fail((jxHQR,status)=>{
      console.log(status);
    })
  })
  .fail(function(error){
    console.log('kok error')
  })
  
}

function fetchWishlist (animate) {
  $('#wishlistCardContainer').empty()
  $.ajax({
    url: `${baseUrl}/wishlist`,
    type: 'get',
    headers: {
      token: localStorage.token
    }
  })
    .done(function(data){
      console.log(data)
      if(data.length > 0) {
        data.forEach(item => {
          if (animate === true) {
            $('#wishlistCardContainer').append(`
              <div class="col s3 m3 animated fadeInUp delay-0.5s">
                <div class="card hoverable">
                  <div class="card-image">
                    <a onclick="removeItem('${item._id}', '${item.thumbnail}', '${item.itemName}')" class="btn-small transparent" style="position:absolute; z-index:1; font-size:10px; color: red; top: 3px; right:3px; height:30px">
                      <i class="fas fa-times"></i>
                    </a>
                    <img src="${item.thumbnail}" width=200px height=200px>
                  </div>
                  <div class="card-stacked" style="height:170px">
                    <div class="card-action">
                      <h5>${item.itemName}</h5>
                      <h6>Price: ${item.price}</h6>
                      <a class="waves-effect waves-light btn-small purple modal-trigger" onclick="fetchDetails('${item.itemId}')">Detail</a>
                    </div>
                  </div>
                </div>
              </div>
            `)
          } else {
            $('#wishlistCardContainer').append(`
            <div class="col s3 m3">
              <div class="card hoverable">
                <div class="card-image">
                  <a onclick="removeItem('${item._id}', '${item.thumbnail}', '${item.itemName}')" class="btn-small transparent" style="position:absolute; z-index:1; font-size:10px; color: red; top: 3px; right:3px; height:30px">
                    <i class="fas fa-times"></i>
                  </a>
                  <img src="${item.thumbnail}" width=200px height=200px>
                </div>
                <div class="card-stacked" style="height:150px">
                  <div class="card-action">
                    <h5>${item.itemName}</h5>
                    <h6>Price: ${item.price}</h6>
                    <a class="waves-effect waves-light btn-small purple modal-trigger" onclick="fetchDetails('${item.itemId}')">Detail</a>
                  </div>
                </div>
              </div>
            </div>
          `)
          }
        })
      } else {
        $('#wishlistCardContainer').append(`
        <div style="margin-left:310px; margin-top:150px">
          <div class="col s6 animated fadeIn">
            <div class="card horizontal">
              <div class="card-stacked">
                <div class="card-content">
                  <p>Wishlist empty,</p>
                  <p>add some items first..</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        `)
      }
    })
    .fail(function(error){
      console.log('kok error')
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



