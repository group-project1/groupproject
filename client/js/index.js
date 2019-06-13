const baseUrl= 'http://localhost:3000'

$(document).ready(function() {
    $('#registerForm').submit(function(event){
        event.preventDefault()
        let data= $(this).serializeArray()
        let name= data[0].value
        let email= data[1].value
        let password= data[2].value
        
        console.log(name, email, password)
        $.ajax({
            url: `${baseUrl}/users/register`,
            type: 'post',
            dataType: 'json',
            data: {
                name: name,
                email: email,
                password: password
            }
          })
        .done(function(success){
            let loginOption = {
              email : email,
              password: password
            }
            $.ajax({
              url: `${baseUrl}/users/login`,
              type: 'post',
              dataType: 'json',
              data: loginOption
            })
            .done(function(Data){
                console.log(Data)
              localStorage.setItem('token', Data.token)
              isLogin()
            })
            .fail(function(error){
              console.log(error)
            })
          })
        .fail(function(error){
            console.log(error)
        })
        
    })

    $('#loginForm').submit(function(event){
        event.preventDefault()
        let data= $(this).serializeArray()
        let email= data[0].value
        let password= data[1].value

        $.ajax({
            url: `${baseUrl}/users/login`,
            type: 'post',
            dataType: 'json',
            data: {
                email: email,
                password: password
            }
          })
          .done(function(Data){
            console.log(Data)
            localStorage.setItem('token', Data.token)
          })
          .fail((err)=>{
           console.log(err)
        
          })
    })
  });



